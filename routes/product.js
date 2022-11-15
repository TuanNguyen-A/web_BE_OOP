const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/product')
const passport = require('passport')

router.route('/add').post(passport.authenticate('jwt', { session: false }), ProductController.add)
router.route('/list').get(ProductController.index)
router.route('/update').post(passport.authenticate('jwt', { session: false }), ProductController.updateProduct)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), ProductController.deleteProduct)
router.route('/:id').get(ProductController.getProduct)
router.route('/searchProductByCategoryId/:id').get(ProductController.searchProductByCategoryId)
router.route('/search/:search').get(ProductController.searchProduct)
router.route('/newProducts').get(ProductController.newProducts)

module.exports = router;