const Product = require("../models/Product");
const Category = require("../models/Category");

const index = async(req, res) => {
    const products = await Product.find({})

    return res.status(200).json({ products })
}

const add = async(req, res) => {
    console.log("Controller")
    const { name, category_id, content, image, price, price_sale, num, status } = req.body
    console.log(name)
    const foundProduct = await Product.findOne({ name })

    if (foundProduct) return res.status(403).json({  message: 'Product is already in exist.' })

    const newProduct = new Product({ name, category_id, content, image, price, price_sale, num, status })
    await newProduct.save()

    return res.status(201).json({ success: true })
}

const deleteProduct = async(req, res, next) => {
    const _id = req.body.id
    const product = await Product.findById({ _id })
    await product.remove()
    return res.status(200).json({ success: true })
}

const updateProduct = async(req, res, next) => {
    const id = req.body.id

    const { name } = req.body
    const foundProduct = await Product.findOne({ name })

    if(foundProduct){
        return res.status(403).json({ message: 'Product is already in exist.' })
    }

    const result = await Product.updateOne({ _id: id }, req.body)
    return res.status(200).json({ success: true })
}

module.exports = {
    add,
    index,
    deleteProduct,
    updateProduct
};