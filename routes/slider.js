const express = require('express')
const router = express.Router()

const SliderController = require('../controllers/slider')
const passport = require('passport')

router.route('/list').get(passport.authenticate('jwt', { session: false }), SliderController.index)
router.route('/add').post(passport.authenticate('jwt', { session: false }), SliderController.addSlider)
router.route('/update').post(passport.authenticate('jwt', { session: false }), SliderController.updateSlider)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), SliderController.deleteSlider)
router.route('/:id').get(SliderController.getSlider)

module.exports = router;