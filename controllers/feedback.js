const Feedback = require("../models/Feedback");

const index = async(req, res) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const search = req.query.search ? req.query.search : ''
    const sort = req.query.sort ? req.query.sort : ''
    const pageIndex = req.query.pageIndex ? req.query.pageIndex : 1
    const pageSize = req.query.pageSize ? req.query.pageSize : 10

    if(sort){
        feedbacks = await Feedback
        .find({})
        .populate({
            path:'user',
            match: {
                $or: [
                    { email: { $regex: search }},
                    { fullName: { $regex: search }},
                    { address: { $regex: search }}, 
                    { phoneNumber: { $regex: search }}
                ]
            }
        })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .sort(sortObj)

    }else{
        feedbacks = await Feedback
        .find({})
        .populate({
            path:'user',
            match: {
                $or: [
                    { email: { $regex: search } },
                    { fullName: { $regex: search } },
                    { address: { $regex: search } }, 
                    { phoneNumber: { $regex: search } }
                ]
            }
        })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
    }

    feedbacks = feedbacks.filter(item => (item.user != null));
    
    totalItem = await Feedback.countDocuments({$or: [
        { 'user.email': { $regex: search } },
        { 'user.fullName': { $regex: search } },
        { 'user.address': { $regex: search } }, 
        { 'user.phoneNumber': { $regex: search } }
    ]})
    
    totalPage = Math.ceil(totalItem/pageSize)

    return res.status(200).json({ feedbacks, totalItem, totalPage })
}

const add = async(req, res) => {
    
    const newFeedback = new Feedback({content: req.body.content, user: req.user._id})
    await newFeedback.save()
    return res.status(201).json({ success: true })
}

const deleteFeedback = async(req, res, next) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }
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