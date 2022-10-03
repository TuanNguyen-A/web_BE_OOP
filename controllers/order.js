const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");
const orderid = require('order-id')('key');

const index = async (req, res) => {
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

module.exports = {
    add,
    index,
    deleteOrder,
    getOrder
};
