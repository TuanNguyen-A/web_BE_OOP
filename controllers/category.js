const Category = require("../models/Category");

const index = async(req, res) => {
    search = req.query.search ? req.query.search : ''
    search = search.toLowerCase()
    const sort = req.query.sort ? req.query.sort : ''
    const pageIndex = req.query.pageIndex ? req.query.pageIndex : 1
    const pageSize = req.query.pageSize ? req.query.pageSize : 10
    
    if(sort){
        const asc = req.query.asc ? req.query.asc : 1
        console.log(asc)
        var sortObj = {};
        sortObj[sort] = asc;
    
        categories = await Category
        .find({name: { $regex: search }})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .sort(sortObj)
    }else{
        categories = await Category
        .find({name: { $regex: search }} )
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        //.where("active").ne(false)
    }
    
    totalItem = await Category.countDocuments({name: { $regex: search }})
    totalPage = Math.ceil(totalItem/pageSize)

    return res.status(200).json({ categories, totalPage, totalItem})
}

const addCategory = async(req, res) => {
    console.log('HHHHHH',req.user)
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }
    const { name, active } = req.body
    
    const foundCategory = await Category.findOne({ name })

    if (foundCategory) return res.status(403).json({ message: 'Category is already in exist.' })

    const newCategory = new Category({ name: name.toLowerCase(), active })
    await newCategory.save()

    return res.status(201).json({ success: true })
}

const deleteCategory = async(req, res, next) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const { id } = req.body
    const category = await Category.findById(id)
    if(!category){
        return res.status(404).json({ message: 'Category does not exist.' })
    }
    await category.remove()
    return res.status(200).json({ success: true })
}

const updateCategory = async(req, res, next) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const { id, name } = req.body
    const foundCategoryByName = await Category.findOne({ name })

    if(foundCategoryByName){
        updatedCategory = await Category.findById(id)
        if (updatedCategory.name != name) return res.status(403).json({ message: 'Category is already in exist.' })
    }

    const foundCategoryById = await Category.findById(id)
    if(!foundCategoryById){
        return res.status(404).json({ message: 'Category does not exist.' })
    }

    const result = await Category.updateOne({ _id: id }, req.body)
    return res.status(200).json({ success: true })
}

const getCategory = async(req, res, next) => {
    const _id = req.params.id
    const category = await Category.find({ _id })

    if(!category){
        return res.status(404).json({ message: 'Category does not exist.' })
    }

    return res.status(200).json({ category })
}

module.exports = {
    addCategory,
    index,
    deleteCategory,
    updateCategory,
    getCategory
};