const express = require('express');
const router = express.Router();

const passport = require('passport');

//const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers');
const OrderController = require('../controllers/order')

router.route('/').get(passport.authenticate('jwt', { session: false }), OrderController.index);
router.route('/listPendingOrder').get(passport.authenticate('jwt', { session: false }), OrderController.listPendingOrder);
router.route('/listOrderByUser').get(passport.authenticate('jwt', { session: false }), OrderController.listOrderByUser);
router.route('/listOrderAssignedByShipper').get(passport.authenticate('jwt', { session: false }), OrderController.listOrderAssignedByShipper);
router.route('/listForShipper').get(passport.authenticate('jwt', { session: false }), OrderController.listForShipper);
router.route('/add').post(passport.authenticate('jwt', { session: false }), OrderController.add);
router.route('/delete').post(passport.authenticate('jwt', { session: false }), OrderController.deleteOrder);
router.route('/update').post(passport.authenticate('jwt', { session: false }), OrderController.updateOrder);
router.route('/cancel').post(passport.authenticate('jwt', { session: false }), OrderController.cancelOrder);
router.route('/receivedOrder').post(passport.authenticate('jwt', { session: false }), OrderController.receivedOrder);
router.route('/shipperAssignOrder').post(passport.authenticate('jwt', { session: false }), OrderController.shipperAssignOrder);
router.route('/shippedOrder').post(passport.authenticate('jwt', { session: false }), OrderController.shippedOrder);
router.route('/:id').get(passport.authenticate('jwt', { session: false }), OrderController.getOrder);

module.exports = router;
