const User = require("../models/User");
const bcrypt = require('bcryptjs')

const index = async(req, res) => {

    const search = req.query.search ? req.query.search : ''
    const sort = req.query.sort ? req.query.sort : ''
    const pageIndex = req.query.pageIndex ? req.query.pageIndex : 1
    const pageSize = req.query.pageSize ? req.query.pageSize : 10
    
    if(sort){
        const asc = req.query.asc ? req.query.asc : 1
        console.log(asc)
        var sortObj = {};
        sortObj[sort] = asc;
    
        users = await User
        .find({fullName: { $regex: search }})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .sort(sortObj)
    }else{
        users = await User
        .find({fullName: { $regex: search }})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
    }

    totalPage = Math.ceil(users.length/pageSize)

    return res.status(200).json({ users, totalPage })
}

const updateUser = async(req, res, next) => {
    const { email, id } = req.body

    const foundUserById = await User.findById(id)
    if(!foundUserById){
        return res.status(404).json({ message: 'User does not exist.' })
    }

    if(email != foundUserById.email){
        return res.status(400).json({ message: 'Cannot change email' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHashed = await bcrypt.hash(req.body.password, salt)
    req.body.password = passwordHashed

    const result = await User.updateOne({ _id: id }, req.body)
    return res.status(200).json({ success: true })
}

const deleteUser = async(req, res, next) => {
    const { id } = req.body
    const user = await User.findById(id)

    if(!user){
        return res.status(404).json({ message: 'User does not exist.' })
    }

    await user.remove()
    return res.status(200).json({ success: true })
}


const getUser= async(req, res, next) => {
    const _id = req.params.id
    const user = await User.find({ _id })
    if(!user){
        return res.status(404).json({ message: 'User does not exist.' })
    }
    return res.status(200).json({ user })
}

const searchUser = async(req, res, next) =>{
    const search = req.params.search
    const users = await User.find({ fullName: { $regex: search } })
    console.log(users)
    return res.status(200).json({ users })
}

module.exports = {
    index,
    updateUser,
    deleteUser,
    getUser,
    searchUser
};