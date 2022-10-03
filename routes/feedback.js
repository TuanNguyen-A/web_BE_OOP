const express = require('express')
const router = express.Router()


const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')
const FeedbackController = require('../controllers/feedback')


router.route('/add').post(FeedbackController.add)
router.route('/list').get(FeedbackController.index)
router.route('/delete').post(FeedbackController.deleteFeedback)
router.route('/:id').get(FeedbackController.getFeedback)

module.exports = router;