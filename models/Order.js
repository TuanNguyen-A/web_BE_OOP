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
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    note: {
        type: String
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
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipping', 'shipped', 'cancelled' ],
        default: 'pending'
    },
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

