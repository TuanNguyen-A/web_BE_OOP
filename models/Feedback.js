const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MongooseFindByReference } = require('mongoose-find-by-reference');

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

FeedbackSchema.plugin(MongooseFindByReference);

const Feedback = mongoose.model('Feedback', FeedbackSchema)
module.exports = Feedback