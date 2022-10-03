const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DiscountSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    minium_order: {
        type: Number,
        required: true
    },
    purchase_current: {
        type: Number,
        default: 0
    },
    purchase_limit: {
        type: Number
    },
    expiration_date: {
        type: Date,
        required: true
    },
    content: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})

const Discount = mongoose.model('Discount', DiscountSchema)
module.exports = Discount