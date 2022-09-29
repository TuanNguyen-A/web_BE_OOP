const Product = require("../models/Product");
const Category = require("../models/Category");

const { cloudinary } = require('../utils/cloudinary');

const index = async(req, res) => {
    const products = await Product.find({})

    return res.status(200).json({ products })
}

const add = async(req, res) => {
    console.log("Controller")
    const { name, category_id, content, imgList, price, price_sale, num, status } = req.body
    console.log(name)
    const foundProduct = await Product.findOne({ name })

    if (foundProduct) return res.status(403).json({  message: 'Product is already in exist.' })

    //Upload img to Cloudinary
    images = []
    try{
        for(const img of imgList) {
            const uploadedResponse = await cloudinary.uploader
            .upload(img, {
                upload_preset: 'dev_setups',
                folder: 'dev_setups'
            })
            images.push(uploadedResponse.public_id)
        }
    }catch(err){
        console.log(err)
        res.status(500).json({err: 'errrrrr'})
    }

    const newProduct = new Product({ name, category_id, content, images, price, price_sale, num, status })
    await newProduct.save()

    return res.status(201).json({ success: true })
}

const deleteProduct = async(req, res, next) => {
    const _id = req.body.id
    const product = await Product.findById({ _id })
    if(!product){
        return res.status(404).json({ message: 'Product does not exist.' })
    }
    await product.remove()
    return res.status(200).json({ success: true })
}

const updateProduct = async(req, res, next) => {
    const id = req.body.id

    const { name } = req.body
    const foundProduct = await Product.findOne({ name })

    if(foundProduct){
        updatedProduct = await Product.findById(id)
        if (updatedProduct.name != name) return res.status(403).json({ message: 'CategProductory is already in exist.' })
    }else{
        return res.status(404).json({ message: 'Product does not exist.' })
    }

    const result = await Product.updateOne({ _id: id }, req.body)
    return res.status(200).json({ success: true })
}

const getProduct = async(req, res, next) => {
    const _id = req.params.id
    const product = await Product.find({ _id })
    return res.status(200).json({ product })
}

module.exports = {
    add,
    index,
    deleteProduct,
    getProduct,
    updateProduct
};