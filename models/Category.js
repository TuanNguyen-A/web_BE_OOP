const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})

const Category = mongoose.model('Category', CategorySchema)
module.exports = Category