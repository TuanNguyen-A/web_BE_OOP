const categoryRouter = require('./category')
const productRouter = require('./product')
const userRouter = require('./user')
const authRouter = require('./auth')
const orderRouter = require('./order')
const feedbackRouter = require('./feedback')
const discountRouter = require('./discount')
const sliderRouter = require('./slider')

function route(app) {
    app.use('/category', categoryRouter);
    app.use('/product', productRouter);
    app.use('/user', userRouter);
    app.use('/auth', authRouter);
    app.use('/order', orderRouter);
    app.use('/feedback', feedbackRouter);
    app.use('/discount', discountRouter);
    app.use('/slider', sliderRouter);
}

module.exports = route
