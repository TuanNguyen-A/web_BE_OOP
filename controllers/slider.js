const Slider = require("../models/Slider");
const { cloudinary } = require('../utils/cloudinary');

const index = async (req, res) => {
    const sliders = await Slider.find({})

    return res.status(200).json({ sliders })
}

const addSlider = async (req, res) => {
    const { name, content, image, active } = req.body

    const foundSlider = await Slider.findOne({ name })
    console.log("HERE")

    if (foundSlider) return res.status(403).json({ message: 'Slider is already in exist.' })

    //Upload img to Cloudinary
    imageId = "";
    try {
        const uploadedResponse = await cloudinary.uploader
            .upload(image, {
                upload_preset: 'dev_setups',
                folder: 'dev_setups/slider'
            })

        imageId = uploadedResponse.public_id

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'errrrrr' })
    }

    const newSlider = new Slider({ name, content, image: imageId, active })
    await newSlider.save()

    return res.status(201).json({ success: true })
}

const deleteSlider = async (req, res, next) => {
    const { id } = req.body
    const slider = await Slider.findById(id)
    if (!slider) {
        console.log("1")
        return res.status(404).json({ message: 'Slider does not exist.' })
    }

    //Destroy image
    try {
        await cloudinary.uploader.destroy(slider.image)
        console.log("Destroy image")
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'errrrrr' })
    }

    await slider.remove()
    return res.status(200).json({ success: true })
}

const updateSlider = async (req, res, next) => {
    const { id, name, content, image, active, changedImg } = req.body
    const foundSliderByName = await Slider.findOne({ name })

    if (foundSliderByName) {
        updatedSlider = await Slider.findById(id)
        if (updatedSlider.name != name) return res.status(403).json({ message: 'Slider is already in exist.' })
    }

    const foundSliderById = await Slider.findById(id)
    if (!foundSliderById) {
        return res.status(404).json({ message: 'Slider does not exist.' })
    }

    if (changedImg) {
        try {
            //Destroy image
            await cloudinary.uploader.destroy(foundSliderById.image)
            
            //Upload image
            const uploadedResponse = await cloudinary.uploader
            .upload(image, {
                upload_preset: 'dev_setups',
                folder: 'dev_setups/slider'
            })

            imageId = uploadedResponse.public_id
            
            await Slider.updateOne({ _id: id }, { name, content, image: imageId, active })
            return res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: 'errrrrr' })
        }
    }

    const result = await Slider.updateOne({ _id: id }, { name, content, active })
    return res.status(200).json({ success: true })
}

const getSlider = async (req, res, next) => {
    const _id = req.params.id
    const slider = await Slider.find({ _id })

    if (!slider) {
        return res.status(404).json({ message: 'Slider does not exist.' })
    }

    return res.status(200).json({ slider })
}

module.exports = {
    addSlider,
    index,
    deleteSlider,
    updateSlider,
    getSlider
};