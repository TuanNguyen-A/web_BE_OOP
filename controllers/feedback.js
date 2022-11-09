const Feedback = require("../models/Feedback");

const index = async(req, res) => {
    const feedbacks = await Feedback.find({}).populate('user')

    return res.status(200).json({ feedbacks })
}

const add = async(req, res) => {
    const newFeedback = new Feedback(req.body)
    await newFeedback.save()
    return res.status(201).json({ success: true })
}

const deleteFeedback = async(req, res, next) => {
    const { id } = req.body
    const feedback = await Feedback.findById(id)
    if(!feedback){
        return res.status(404).json({ message: 'feedback does not exist.' })
    }
    await feedback.remove()
    return res.status(200).json({ success: true })
}

const getFeedback = async (req, res, next) => {
    const _id = req.params.id
    feedback = await Feedback.find({ _id }).populate('user')
    if(!feedback.length){
        return res.status(404).json({ message: 'feedback does not exist.' })
    }
    return res.status(200).json({ feedback })
}

const searchFeedback = async(req, res, next) =>{
    const search = req.params.search
    const feedbacks = await Feedback.find({ email: { $regex: search } })
    console.log(feedbacks)
    return res.status(200).json({ feedbacks })
}

module.exports = {
    add,
    index,
    deleteFeedback,
    searchFeedback,
    getFeedback
};