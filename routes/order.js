const express = require('express');
const router = express.Router();

const passport = require('passport');

//const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers');
const OrderController = require('../controllers/order')

router.route('/').get(passport.authenticate('jwt', { session: false }), OrderController.index);
router.route('/add').post(passport.authenticate('jwt', { session: false }), OrderController.add);
router.route('/delete').post(passport.authenticate('jwt', { session: false }), OrderController.deleteOrder);
router.route('/update').post(passport.authenticate('jwt', { session: false }), OrderController.updateOrder);
router.route('/listOrderByUser').get(passport.authenticate('jwt', { session: false }), OrderController.listOrderByUser);
router.route('/cancel').post(passport.authenticate('jwt', { session: false }), OrderController.cancelOrder);
router.route('/:id').get(passport.authenticate('jwt', { session: false }), OrderController.getOrder);

module.exports = router;
