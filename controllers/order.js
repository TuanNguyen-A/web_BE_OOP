const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");
const orderid = require('order-id')('key');

const index = async (req, res) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }
    const orders = await Order
        .find({})
        .populate({
            path: 'orderProducts',
            populate: {path: 'product'}
        })
        .populate('user')

    return res.status(200).json({ orders })
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

const searchOrder = async(req, res, next) =>{
    const search = req.params.search
    const oders = await Order.find({ id: { $regex: search } })
    console.log(oders)
    return res.status(200).json({ oders })
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
    searchOrder,
    updateOrder,
    listOrderByUser
};
