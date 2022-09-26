
const express = require('express')
const router = express.Router()

const { cloudinary } = require('../utils/cloudinary');

router.route('/getimg').get(async (req, res) => {
    const {resources} = await cloudinary.search.expression('folder:dev_setups')
    .sort_by('public_id', 'desc')
    .max_results(30)
    .execute();
    const publicIds = resources.map(file=>file.public_id)
    res.send(publicIds)
})

router.route('/cloudinary').post(async (req, res) => {
    //console.log("OK")
    try{
        const imgArr = req.body.data;

        for(const img of imgArr) {
            const uploadedResponse = await cloudinary.uploader
            .upload(img, {
                upload_preset: 'dev_setups',
                folder: 'dev_setups'
            })
    
            console.log(uploadedResponse.public_id)
        }
        res.json({msg: 'Successfully Uploaded'})
    }catch(err){
        console.log(err)
        res.status(500).json({err: 'errrrrr'})
    }
})

module.exports = router;