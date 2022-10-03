const Discount = require("../models/Discount");

const index = async(req, res) => {
    const discounts = await Discount.find({})

    return res.status(200).json({ discounts })
}

const add = async(req, res) => {
    console.log("Controller")

    const { code, discount, minium_order, purchase_limit, expiration_date, content, active } = req.body
    console.log(code)
    const foundDiscount = await Discount.findOne({ code })

    if (foundDiscount) return res.status(403).json({ message: 'Discount is already in exist.' })

    const newDiscount = new Discount({ code, discount, minium_order, purchase_limit, expiration_date, content, active })
    await newDiscount.save()

    return res.status(201).json({ success: true })
}

const deleteDiscount = async(req, res, next) => {
    const { id } = req.body
    const discount = await Discount.findById(id)
    if(!discount){
        return res.status(404).json({ message: 'Discount does not exist.' })
    }
    await discount.remove()
    return res.status(200).json({ success: true })
}

const updateDiscount = async(req, res, next) => {
    const id = req.body.id

    const { code} = req.body
    console.log(code)
    const foundDiscount = await Discount.findOne({ code })

    if(foundDiscount){
        console.log("Testtt",foundDiscount)
        updatedDiscount = await Discount.findById(id)
        if (updatedDiscount.code != code) return res.status(403).json({ message: 'Discount is already in exist.' })
    }

    const foundDiscountById = await Discount.findById(id)
    if(!foundDiscountById){
        return res.status(404).json({ message: 'Discount does not exist.' })
    }

    const result = await Discount.updateOne({ _id: id }, req.body)
    return res.status(200).json({ success: true })
}

const getDiscount = async(req, res, next) => {
    const _id = req.params.id
    const discount = await Discount.find({ _id })

    if(!discount){
        return res.status(404).json({ message: 'Discount does not exist.' })
    }

    return res.status(200).json({ discount })
}

module.exports = {
    add,
    index,
    deleteDiscount,
    updateDiscount,
    getDiscount
};