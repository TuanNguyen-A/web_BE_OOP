const express = require('express')
const router = express.Router()

const passport = require('passport')

const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')
const OrderController = require('../controllers/order')


router.route('/add').post(OrderController.add)
router.route('/list').get(passport.authenticate('jwt', { session: false }), OrderController.index)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), OrderController.deleteOrder)
router.route('/update').post(passport.authenticate('jwt', { session: false }), OrderController.updateOrder)
router.route('/listOrderByUser').get(passport.authenticate('jwt', { session: false }), OrderController.listOrderByUser)
router.route('/:id').get(passport.authenticate('jwt', { session: false }), OrderController.getOrder)


module.exports = router;