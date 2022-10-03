const mongoose = require('mongoose')
const OrderProduct = require('./OrderProduct')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    orderProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderProduct'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    note: {
        type: String
    },
    status: {
        type: Number
    },
    discount: {
        type: Number
    },
    transportFee: {
        type: Number
    },
    totalPrice:{
        type: Number,
        required: true
    }
}, {
    timestamps: true,
})

OrderSchema.pre('remove', async function(next) {
    try {
        await OrderProduct.deleteMany({_id:{$in:this.orderProducts}})
        next()
    } catch (error) {
        next(error)
    }
})

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order
