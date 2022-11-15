const Product = require("../models/Product");
const Category = require("../models/Category");

const { cloudinary } = require('../utils/cloudinary');


const index = async (req, res) => {

    const products = await Product.find({})

    return res.status(200).json({ products })
}

const newProducts = async (req, res) => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const products = await Product.find({createdAt: {$gte: threeDaysAgo}})

    return res.status(200).json({ products })
}

const add = async (req, res) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const { name, category_id, content, imgList, price, price_sale, num, active } = req.body
    
    const foundProduct = await Product.findOne({ name })

    if (foundProduct) return res.status(403).json({ message: 'Product is already in exist.' })

    //Upload img to Cloudinary
    images = []
    try {
        for (const img of imgList) {
            const uploadedResponse = await cloudinary.uploader
                .upload(img, {
                    upload_preset: 'dev_setups',
                    folder: 'dev_setups/product'
                })
            images.push(uploadedResponse.public_id)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'errrrrr' })
    }



    const newProduct = new Product({ name, category_id, content, images, price, price_sale, num, active })
    await newProduct.save()

    return res.status(201).json({ success: true })
}

const deleteProduct = async (req, res, next) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }
    const _id = req.body.id
    const product = await Product.findById({ _id })

    if (!product) {
        return res.status(404).json({ message: 'Product does not exist.' })
    }

    //Destroy image
    imgList = product.images
    try {
        for (const img of imgList) {
            await cloudinary.uploader.destroy(img)
                .then(() => {
                    console.log("Destroy img")
                })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'errrrrr' })
    }

    await product.remove()
    return res.status(200).json({ success: true })
}

const updateProduct = async (req, res, next) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }
    const id = req.body.id

    const { name, changedImg, category_id, content, imgList, price, price_sale, num, active } = req.body
    const foundProductByName = await Product.findOne({ name })

    if (foundProductByName) {
        updatedProduct = await Product.findById(id)
        if (updatedProduct.name != name) return res.status(403).json({ message: 'CategProductory is already in exist.' })
    }

    const foundProductById = await Product.findById(id)
    if (!foundProductById) {
        return res.status(404).json({ message: 'Product does not exist.' })
    }

    //Update imgs
    if (changedImg) {
        //destroy image
        oldimgList = foundProductById.images
        try {
            for (const img of oldimgList) {
                await cloudinary.uploader.destroy(img)
                    .then(() => {
                        console.log("Destroy img")
                    })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: 'errrrrr' })
        }

        //Upload new img to Cloudinary
        images = []
        try {
            for (const img of imgList) {
                const uploadedResponse = await cloudinary.uploader
                    .upload(img, {
                        upload_preset: 'dev_setups',
                        folder: 'dev_setups/product'
                    })
                images.push(uploadedResponse.public_id)   
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: 'errrrrr' })
        }
        
        await Product.updateOne({ _id: id }, { name, category_id, content, price, price_sale, num, active, images })
        return res.status(200).json({ success: true })
    }
    
    const result = await Product.updateOne({ _id: id }, { name, category_id, content, price, price_sale, num, active })
    return res.status(200).json({ success: true })
}

const getProduct = async (req, res, next) => {
    const _id = req.params.id
    const product = await Product.find({ _id })
    if (!product) {
        return res.status(404).json({ message: 'Product does not exist.' })
    }
    return res.status(200).json({ product })
}

const searchProductByCategoryId = async(req, res, next) =>{
    const id = req.params.id
    console.log(id)
    try{
        const products = await Product.find({ category_id: id })
        if(!products.length){
            return res.status(404).json({ message: 'Cannot find product by category id.' })
        }
    }catch(err){
        return res.status(404).json({ message: 'Cannot find product by category id.' })
    }
    return res.status(200).json({ products })
}

const searchProduct = async(req, res, next) =>{
    const search = req.params.search
    const products = await Product.find({ name: { $regex: search } })
    console.log(products)
    return res.status(200).json({ products })
}

module.exports = {
    add,
    index,
    deleteProduct,
    getProduct,
    updateProduct,
    searchProductByCategoryId,
    searchProduct,
    newProducts
};