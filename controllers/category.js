const Category = require("../models/Category");

const index = async(req, res) => {
    const categories = await Category.find({})

    return res.status(200).json({ categories })
}

const addCategory = async(req, res) => {
    const { name, status } = req.body
    
    const foundCategory = await Category.findOne({ name })
    console.log("HERE")

    if (foundCategory) return res.status(403).json({ message: 'Category is already in exist.' })

    const newCategory = new Category({ name, status })
    await newCategory.save()

    return res.status(201).json({ success: true })
}

const deleteCategory = async(req, res, next) => {
    const { id } = req.body
    const category = await Category.findById(id)
    await category.remove()
    return res.status(200).json({ success: true })
}

const updateCategory = async(req, res, next) => {
    const { id, name } = req.body
    const foundCategory = await Category.findOne({ name })

    if(foundCategory){
        updatedCategory = await Category.findById(id)
        if (updatedCategory.name != name) return res.status(403).json({ message: 'Category is already in exist.' })
    }

    const result = await Category.updateOne({ _id: id }, req.body)
    return res.status(200).json({ success: true })
}

module.exports = {
    addCategory,
    index,
    deleteCategory,
    updateCategory,
};