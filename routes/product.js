const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/product')
const passport = require('passport')

router.route('/').get(passport.authenticate('jwt', { session: false }), ProductController.index)
router.route('/add').post(passport.authenticate('jwt', { session: false }), ProductController.add)
router.route('/update').post(passport.authenticate('jwt', { session: false }), ProductController.updateProduct)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), ProductController.deleteProduct)
router.route('/homeProductList').get(ProductController.homeProductList)
router.route('/newProducts').get(ProductController.newProducts)
router.route('/saleProducts').get(ProductController.saleProducts)
router.route('/listProductByCategoryId/:id').get(ProductController.listProductByCategoryId)
router.route('/:id').get(ProductController.getProduct)

module.exports = router;