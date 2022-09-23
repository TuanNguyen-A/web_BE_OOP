const categoryRouter = require('./category')
const productRouter = require('./product')

function route(app) {
    app.use('/category', categoryRouter);
    app.use('/product', productRouter);
}

module.exports = route
