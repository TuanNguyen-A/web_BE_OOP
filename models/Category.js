const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true,
})

const Category = mongoose.model('Category', CategorySchema)
module.exports = Category