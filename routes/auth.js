const express = require('express')
const router = express.Router()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//const {validate} = require('../helpers/validator');
const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')

const AuthController = require('../controllers/auth')

router.route('/signUp').post(validateBody(schemas.authSignUpSchema), AuthController.signUp)

router.route('/signIn').post(validateBody(schemas.authSignInSchema), passport.authenticate('local', { session: false }), AuthController.signIn)

router.route('/secret').get(passport.authenticate('jwt', { session: false }), AuthController.secret)

router.route('/verify-email').post(AuthController.verifyEmail)

router.route('/forgot-password').post(AuthController.forgotPassword)

router.route('/verify-forgot-password').post(AuthController.verifyForgotPassword)

module.exports = router;