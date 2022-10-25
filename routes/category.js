const express = require('express')
const router = express.Router()

const CategoryController = require('../controllers/category')

router.route('/list').get(CategoryController.index)
router.route('/add').post(CategoryController.addCategory)
router.route('/update').post(CategoryController.updateCategory)
router.route('/delete').post(CategoryController.deleteCategory)
router.route('/:id').get(CategoryController.getCategory)
router.route('/search/:search').get(CategoryController.searchCategory)


module.exports = router;