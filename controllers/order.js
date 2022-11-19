const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");
const orderid = require('order-id')('key');

const index = async (req, res) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const search = req.query.search ? req.query.search : ''
    const sort = req.query.sort ? req.query.sort : ''
    const pageIndex = req.query.pageIndex ? req.query.pageIndex : 1
    const pageSize = req.query.pageSize ? req.query.pageSize : 10
    
    if(sort){
        const asc = req.query.asc ? req.query.asc : 1
        console.log(asc)
        var sortObj = {};
        sortObj[sort] = asc;
    
        orders = await Order
        .find()
        .populate({
            path: 'orderProducts',
            populate: {
                path: 'product',
            }
        })
        .populate({
            path:'user',
            match:{
                $or: [
                    { email: { $regex: search }},
                    { fullName: { $regex: search }},
                    { address: { $regex: search }}, 
                    { phoneNumber: { $regex: search }}
                ]
            }
        })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .sort(sortObj)
    }else{
        orders = await Order
        .find()
        .populate({
            path: 'orderProducts',
            populate: {
                path: 'product',
            }
        })
        .populate({
            path:'user',
            match:{
                $or: [
                    { email: { $regex: search }},
                    { fullName: { $regex: search }},
                    { address: { $regex: search }}, 
                    { phoneNumber: { $regex: search }}
                ]
            }
        })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        //.where("active").ne(false)
    }

    orders = orders.filter(item => (item.user != null));
    
    totalPage = Math.ceil(orders.length/pageSize)
    totalItem = await Order.countDocuments()
    
    return res.status(200).json({ orders, totalPage, totalItem })
}

const add = async (req, res) => {

    const order = req.body
    order.id = orderid.generate()

    tempArr = []

    order.orderProducts.forEach(async (element) => {
        orderProduct = new OrderProduct(element)
        tempArr.push(orderProduct._id)
        await orderProduct.save()
    });

    order.orderProducts = tempArr
    const newOrder = new Order(order)
    await newOrder.save()

    return res.status(201).json({ success: true })
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
    order = await Order.find({ _id }).populate('orderProducts').populate('user')
    if (!order.length) {
        return res.status(404).json({ message: 'order does not exist.' })
    }
    return res.status(200).json({ order })
}

    
const updateOrder = async(req, res, next) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }
    const { id, status } = req.body

    const foundOrderById = await Order.findById(id)
    if(!foundOrderById){
        return res.status(404).json({ message: 'Order does not exist.' })
    }

    const result = await Order.updateOne({ _id: id }, {status})
    return res.status(200).json({ success: true })
}

const listOrderByUser = async(req, res, next) => {

    const orders = await Order
        .find({user: req.user._id})
        .populate({
            path: 'orderProducts',
            populate: {path: 'product'}
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
    listOrderByUser
};
