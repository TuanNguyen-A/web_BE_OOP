const express = require('express')
const router = express.Router()


const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')
const OrderController = require('../controllers/order')

router.route('/add').post(OrderController.add)
router.route('/list').get(OrderController.index)
router.route('/delete').post(OrderController.deleteOrder)
router.route('/update').post(OrderController.updateOrder)
router.route('/:id').get(OrderController.getOrder)

module.exports = router;