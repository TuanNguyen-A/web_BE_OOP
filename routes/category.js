const express = require('express')
const router = express.Router()

const CategoryController = require('../controllers/category')
const passport = require('passport')

router.route('/').get(CategoryController.index)
router.route('/add').post(CategoryController.addCategory)
router.route('/update').post(CategoryController.updateCategory)
router.route('/delete').post(CategoryController.deleteCategory)
router.route('/:id').get(CategoryController.getCategory)


module.exports = router;