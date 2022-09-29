const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/product')

router.route('/add').post(ProductController.add)
router.route('/list').get(ProductController.index)
router.route('/update').post(ProductController.updateProduct)
router.route('/delete').post(ProductController.deleteProduct)
router.route('/:id').get(ProductController.getProduct)

module.exports = router;