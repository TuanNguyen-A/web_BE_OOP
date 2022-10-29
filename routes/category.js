const express = require('express')
const router = express.Router()

const CategoryController = require('../controllers/category')
const passport = require('passport')

router.route('/list').get(passport.authenticate('jwt', { session: false }), CategoryController.index)
router.route('/add').post(passport.authenticate('jwt', { session: false }), CategoryController.addCategory)
router.route('/update').post(passport.authenticate('jwt', { session: false }), CategoryController.updateCategory)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), CategoryController.deleteCategory)
router.route('/:id').get(CategoryController.getCategory)

module.exports = router;