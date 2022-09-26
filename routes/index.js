const categoryRouter = require('./category')
const productRouter = require('./product')
const uploadRouter = require('./upload')

function route(app) {
    app.use('/category', categoryRouter);
    app.use('/product', productRouter);
    app.use('/upload', uploadRouter);
}

module.exports = route
