const Feedback = require("../models/Feedback");
const User = require("../models/User");

const index = async(req, res) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const search = req.query.search ? req.query.search : ''
    const sort = req.query.sort ? req.query.sort : ''
    const pageIndex = req.query.pageIndex ? req.query.pageIndex : 1
    const pageSize = req.query.pageSize ? req.query.pageSize : 10

    var sortObj = {};
    if(search){
        
        user_ids = await User
            .find({
                $or: [
                    { email: { $regex: search } },
                    { fullName: { $regex: search } },
                    { address: { $regex: search } },
                    { phoneNumber: { $regex: search } }
                ]
            })
            .select('_id')
        
        sortObj['user'] = { $in: user_ids };
    }

    if(sort){
        feedbacks = await Feedback
        .find(sortObj)
        .populate({
            path:'user',
            // match: {
            //     $or: [
            //         { email: { $regex: search }},
            //         { fullName: { $regex: search }},
            //         { address: { $regex: search }}, 
            //         { phoneNumber: { $regex: search }}
            //     ]
            // }
        })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .sort(sortObj)

    }else{
        feedbacks = await Feedback
        .find(sortObj)
        .populate({
            path:'user',
            // match: {
            //     $or: [
            //         { email: { $regex: search } },
            //         { fullName: { $regex: search } },
            //         { address: { $regex: search } }, 
            //         { phoneNumber: { $regex: search } }
            //     ]
            // }
        })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
    }
    
    totalItem = await Feedback.countDocuments(sortObj)

    console.log(totalItem)
    totalPage = Math.ceil(totalItem/pageSize)

    return res.status(200).json({ feedbacks, totalItem, totalPage })
}

const add = async(req, res) => {
    
    const newFeedback = new Feedback({content: req.body.content, user: req.user._id, rating: req.body.rating})
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

module.exports = {
    add,
    index,
    deleteFeedback,
    getFeedback
};