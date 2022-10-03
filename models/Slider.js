const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SliderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    image: {
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

const Slider = mongoose.model('Slider', SliderSchema)
module.exports = Slider