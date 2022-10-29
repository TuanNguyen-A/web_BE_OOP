const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/product')
const passport = require('passport')

router.route('/add').post(passport.authenticate('jwt', { session: false }), ProductController.add)
router.route('/list').get(ProductController.index)
router.route('/update').post(passport.authenticate('jwt', { session: false }), ProductController.updateProduct)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), ProductController.deleteProduct)
router.route('/:id').get(ProductController.getProduct)

module.exports = router;