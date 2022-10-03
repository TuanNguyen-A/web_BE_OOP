const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderProductSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
}, {
    timestamps: true,
})

const OrderProduct = mongoose.model('OrderProduct', OrderProductSchema)
module.exports = OrderProduct

