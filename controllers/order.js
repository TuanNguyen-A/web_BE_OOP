const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");
const orderid = require('order-id')('key');
const User = require("../models/User");
const Discount = require("../models/Discount");

const index = async (req, res) => {
    if (req.user.role != "admin") {
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const search = req.query.search ? req.query.search : ''
    const sort = req.query.sort ? req.query.sort : ''
    const pageIndex = req.query.pageIndex ? req.query.pageIndex : 1
    const pageSize = req.query.pageSize ? req.query.pageSize : 10

    user_ids = await User
        .find({
            $or: [
                { email: { $regex: search } },
                { fullName: { $regex: search } },
                { address: { $regex: search } },
                { phoneNumber: { $regex: search } }
            ]
        })
        .select('_id')

    if (sort) {
        const asc = req.query.asc ? req.query.asc : 1
        console.log(asc)
        var sortObj = {};
        sortObj[sort] = asc;

        orders = await Order
            .find({ 'user': { $in: user_ids } })
            .populate({
                path: 'orderProducts',
                populate: {
                    path: 'product',
                }
            })
            .populate({
                path: 'user',
                // match:{
                //     $or: [
                //         { email: { $regex: search }},
                //         { fullName: { $regex: search }},
                //         { address: { $regex: search }}, 
                //         { phoneNumber: { $regex: search }}
                //     ]
                // }
            })
            .limit(pageSize)
            .skip(pageSize * (pageIndex - 1))
            .sort(sortObj)
    } else {
        orders = await Order
            .find({ 'user': { $in: user_ids } })
            .populate({
                path: 'orderProducts',
                populate: {
                    path: 'product',
                }
            })
            .populate({
                path: 'user',
                // match:{
                //     $or: [
                //         { email: { $regex: search }},
                //         { fullName: { $regex: search }},
                //         { address: { $regex: search }}, 
                //         { phoneNumber: { $regex: search }}
                //     ]
                // }
            })
            .limit(pageSize)
            .skip(pageSize * (pageIndex - 1))
        //.where("active").ne(false)
    }

    totalItem = await Order.countDocuments({
        'user': { $in: user_ids }
    })
    totalPage = Math.ceil(totalItem / pageSize)

    return res.status(200).json({ orders, totalPage, totalItem })
}

const add = async (req, res) => {

    order = req.body
    order.user = req.user._id
    order.id = orderid.generate()
    if(order.discount){
        try {
            await applyDiscount(order.discount, order.totalPrice)
        } catch (e) {
            return res.status(400).json({ message: e })
        }
    }


    tempArr = []

    order.orderProducts.forEach(async (element) => {
        orderProduct = new OrderProduct(element)
        tempArr.push(orderProduct._id)
        await orderProduct.save()
    });

    order.orderProducts = tempArr

    try {
        const newOrder = new Order(order)
        await newOrder.save()
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

    return res.status(201).json({ success: true })
}

const applyDiscount = async (code, total) => {

    discount = await Discount.findOne({ code });

    if (discount.purchase_limit <= 0 || discount.expiration_date <= Date.now()) {
        throw "Discount code has expired"
    }
    if (discount.minium_order > total) {
        // console.log("applyDiscount")
        throw "Not eligible for discount"
    }

    numTemp = discount.purchase_limit - 1
    // await Discount.updateOne({ code: code }, { $set: { purchase_limit: numTemp } }, function (err, res) {
    //     if (err) throw err;
    // });
    Discount.findOneAndUpdate({ code: code }, { $set: { purchase_limit: numTemp } }, function (err, res) {
        console.log(err)
        if (err) throw err;
        
    });

}

const deleteOrder = async (req, res, next) => {
    const { id } = req.body
    const order = await Order.findById(id)
    if (!order) {
        return res.status(404).json({ message: 'order does not exist.' })
    }
    console.log("order")
    await order.remove()
    return res.status(200).json({ success: true })
}

const getOrder = async (req, res, next) => {
    const _id = req.params.id
    order = await Order.find({ _id })
        .populate({
            path: 'orderProducts',
            populate: {
                path: 'product',
            }
        })
        .populate('user')
    if (!order.length) {
        return res.status(404).json({ message: 'order does not exist.' })
    }
    return res.status(200).json({ order })
}


const updateOrder = async (req, res, next) => {
    if (req.user.role != "admin") {
        return res.status(400).json({ message: 'Bad request!!!' })
    }
    const { id, status } = req.body

    const foundOrderById = await Order.findById(id)
    if (!foundOrderById) {
        return res.status(404).json({ message: 'Order does not exist.' })
    }

    if (status == 'cancel' || status == 'pending') {
        return res.status(400).json({ message: 'Bad request' })
    }

    if (status == 'shipping' && foundOrderById.status != 'processing') {
        return res.status(400).json({ message: 'Bad request' })
    }

    if (status == 'shipped' && foundOrderById.status != 'shipping') {
        return res.status(400).json({ message: 'Bad request' })
    }

    if (status == 'receive' && foundOrderById.status != 'shipped') {
        return res.status(400).json({ message: 'Bad request' })
    }

    const result = await Order.updateOne({ _id: id }, { status })
    return res.status(200).json({ success: true })
}

const cancelOrder = async (req, res, next) => {
    const id = req.body.order_id

    const foundOrderById = await Order.findById(id)
    if (!foundOrderById) {
        return res.status(404).json({ message: 'Order does not exist.' })
    }

    if (!foundOrderById.user.equals(req.user._id)) {
        return res.status(400).json({ message: 'Bad request' })
    }

    if (foundOrderById.status != 'pending' && foundOrderById.status != 'processing') {
        return res.status(400).json({ message: 'Cannot cancel' })
    }

    const result = await Order.updateOne({ _id: id }, { status: 'cancelled' })
    return res.status(200).json({ success: true })
}

const listOrderByUser = async (req, res, next) => {

    const orders = await Order
        .find({ user: req.user._id })
        .populate({
            path: 'orderProducts',
            populate: { path: 'product' }
        })

    console.log("ORDER", orders)

    return res.status(200).json({ orders })

}


module.exports = {
    add,
    index,
    deleteOrder,
    getOrder,
    updateOrder,
    listOrderByUser,
    cancelOrder
};
