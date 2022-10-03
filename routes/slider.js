const express = require('express')
const router = express.Router()

const SliderController = require('../controllers/slider')

router.route('/list').get(SliderController.index)
router.route('/add').post(SliderController.addSlider)
router.route('/update').post(SliderController.updateSlider)
router.route('/delete').post(SliderController.deleteSlider)
router.route('/:id').get(SliderController.getSlider)

module.exports = router;