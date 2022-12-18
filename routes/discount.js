const express = require('express')
const router = express.Router()

const passport = require('passport')
const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')
const DiscountController = require('../controllers/discount')

router.route('/').get(passport.authenticate('jwt', { session: false }), DiscountController.index)
router.route('/add').post(passport.authenticate('jwt', { session: false }), DiscountController.add)
router.route('/update').post(passport.authenticate('jwt', { session: false }), DiscountController.updateDiscount)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), DiscountController.deleteDiscount)
router.route('/homeDiscountList').get(DiscountController.homeDiscountList)
router.route('/getDiscountByCode/:code').get(DiscountController.getDiscountByCode)
router.route('/:id').get(DiscountController.getDiscount)

module.exports = router;