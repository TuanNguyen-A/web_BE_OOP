const User = require("../models/User");
const bcrypt = require('bcryptjs')

const index = async(req, res) => {
    const users = await User.find({})

    return res.status(200).json({ users })
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

module.exports = {
    index,
    updateUser,
    deleteUser
};