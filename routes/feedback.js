const express = require('express')
const router = express.Router()

const passport = require('passport')
const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')
const FeedbackController = require('../controllers/feedback')


router.route('/add').post(FeedbackController.add)
router.route('/search/:search').get(FeedbackController.searchFeedback)
router.route('/list').get(passport.authenticate('jwt', { session: false }), FeedbackController.index)
router.route('/delete').post(passport.authenticate('jwt', { session: false }), FeedbackController.deleteFeedback)
router.route('/:id').get(passport.authenticate('jwt', { session: false }), FeedbackController.getFeedback)


module.exports = router;