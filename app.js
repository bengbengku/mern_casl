const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { decoteToken } = require('./middleware/middleware');
const productRoute = require('./app/product/routes');
const categoryRoute = require('./app/category/routes');
const tagRoute = require('./app/tag/routes');
const authRoute = require('./app/auth/routes');
const deliveryRoute = require('./app/delivery/routes');
const cartItemsRoute = require('./app/cart/routes');
const orderRoute = require('./app/order/routes');
const invoiceRoute = require('./app/invoice/routes');
const rajaOngkirRoute = require('./app/rajaongkir/routes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(decoteToken());

app.use('/api', productRoute);
app.use('/api', categoryRoute);
app.use('/api', tagRoute);
app.use('/api', deliveryRoute);
app.use('/api', cartItemsRoute);
app.use('/api', orderRoute);
app.use('/api', invoiceRoute);
app.use('/api', rajaOngkirRoute);
app.use('/auth', authRoute);

app.use('/', (req, res) => {
  res.render('index', { title: 'Beng API Service' });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
