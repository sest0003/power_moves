require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const populateRouter = require('./routes/populate')
const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');
const brandRouter = require('./routes/brands');
const categoryRouter = require('./routes/categories');
const membershipRouter = require('./routes/memberships');

// Initialize database
var db = require('./models');
// Set it to false to avoid deleting and recreating the tables every time
db.sequelize.sync({ force: false });
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Basic endpoints for routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/init', populateRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/memberships',  membershipRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
