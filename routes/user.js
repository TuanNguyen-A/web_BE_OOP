const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

router.route('/list').get(UserController.index)
router.route('/update/:id').post(UserController.updateUser)
router.route('/delete').post(UserController.deleteUser)

module.exports = router;