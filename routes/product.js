const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/product')
const passport = require('passport')

router.route('/').get(ProductController.index)
router.route('/add').post(passport.authenticate('jwt', { session: false }), ProductController.add)
router.route('/update').post(passport.authenticate('jwt', { session: false }), ProductController.updateProduct)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), ProductController.deleteProduct)
router.route('/:id').get(ProductController.getProduct)
router.route('/listProductByCategoryId/:id').get(ProductController.listProductByCategoryId)
router.route('/newProducts').get(ProductController.newProducts)

module.exports = router;