const Discount = require("../models/Discount");

const index = async(req, res) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const search = req.query.search ? req.query.search : ''
    const sort = req.query.sort ? req.query.sort : ''
    const pageIndex = req.query.pageIndex ? req.query.pageIndex : 1
    const pageSize = req.query.pageSize ? req.query.pageSize : 10
    
    if(sort){
        const asc = req.query.asc ? req.query.asc : 1
        console.log(asc)
        var sortObj = {};
        sortObj[sort] = asc;
    
        discounts = await Discount
        .find({name: { $regex: search }})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .sort(sortObj)
    }else{
        discounts = await Discount
        .find({name: { $regex: search }})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
    }

    totalItem = await Discount.countDocuments({name: { $regex: search }})
    totalPage = Math.ceil(totalItem/pageSize)
    
    return res.status(200).json({ discounts, totalPage, totalItem })
}

const homeDiscountList = async(req, res) => {
    const search = req.query.search ? req.query.search : ''
    const sort = req.query.sort ? req.query.sort : ''
    const pageIndex = req.query.pageIndex ? req.query.pageIndex : 1
    const pageSize = req.query.pageSize ? req.query.pageSize : 10
    
    if(sort){
        const asc = req.query.asc ? req.query.asc : 1
        console.log(asc)
        var sortObj = {};
        sortObj[sort] = asc;
    
        discounts = await Discount
        .find({
            name: { $regex: search }, 
            active: true, 
            expiration_date: {$gte: Date.now()} 
        })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .sort(sortObj)
    }else{
        discounts = await Discount
        .find({
            name: { $regex: search }, 
            active: true, 
            expiration_date: {$gte: Date.now()} 
        })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
    }

    totalItem = await Discount.countDocuments({
        name: { $regex: search }, 
        active: true, 
        expiration_date: {$gte: Date.now()} 
    })
    totalPage = Math.ceil(totalItem/pageSize)
    
    return res.status(200).json({ discounts, totalPage, totalItem })
}

const add = async(req, res) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const { code, discount, minium_order, purchase_limit, expiration_date, content, active } = req.body
    console.log(code)
    const foundDiscount = await Discount.findOne({ code })

    if (foundDiscount) return res.status(403).json({ message: 'Discount is already in exist.' })

    const newDiscount = new Discount({ code, discount, minium_order, purchase_limit, expiration_date, content, active })
    await newDiscount.save()

    return res.status(201).json({ success: true })
}

const deleteDiscount = async(req, res, next) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }

    const { id } = req.body
    const discount = await Discount.findById(id)
    if(!discount){
        return res.status(404).json({ message: 'Discount does not exist.' })
    }
    await discount.remove()
    return res.status(200).json({ success: true })
}

const updateDiscount = async(req, res, next) => {
    if(req.user.role!="admin"){
        return res.status(400).json({ message: 'Bad request!!!' })
    }
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
    discount = await Discount.findOne({ 
        _id, 
    })

    if(!discount){
        return res.status(404).json({ message: 'Discount does not exist.' })
    }

    return res.status(200).json({ discount })
}

const getDiscountByCode = async(req, res, next) => {
    const code = req.params.code
    discount = await Discount.findOne({ 
        code, 
        active: true, 
        expiration_date: {$gte: Date.now()} 
    })

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
    getDiscountByCode,
    homeDiscountList,
    getDiscount
};