const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeedbackSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }
}, {
    timestamps: true,
})

const Feedback = mongoose.model('Feedback', FeedbackSchema)
module.exports = Feedback