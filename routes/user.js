const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')
const passport = require('passport')

router.route('/:id').get(UserController.getUser)
router.route('/search/:search').get(UserController.searchUser)
router.route('/').get(passport.authenticate('jwt', { session: false }), UserController.index)
router.route('/update').post(passport.authenticate('jwt', { session: false }), UserController.updateUser)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), UserController.deleteUser)

module.exports = router;