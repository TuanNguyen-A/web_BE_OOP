const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String
    },
    images: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    price_sale: {
        type: Number
    },
    num: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})

const Product = mongoose.model('Product', ProductSchema)
module.exports = Product