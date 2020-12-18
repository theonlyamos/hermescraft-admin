var createError = require('http-errors');
const debug = require('./debugger');
var express = require('express');
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var fileupload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const compression = require('compression');
const helmet = require('helmet');
const { isAdmin } = require('./authorize');
var config = require('./config');
var connectEnsureLoggedIn = require('connect-ensure-login');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var LoginRouter = require('./routes/login');
var PagesRouter = require('./routes/pages');
var ProductsRouter = require('./routes/products');
var OrdersRouters = require('./routes/orders');
var CustomersRouter = require('./routes/customers');
var AdministratorsRouter = require('./routes/administrators');
const CouponsRouter = require('./routes/coupons');
const AccountRouter = require('./routes/account');
const SettingsRouter = require('./routes/settings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.secretKey, 
  resave: false,
  saveUninitialized: false,
  store: new FileStore()
}))

app.use(fileupload({
  preserveExtension: true,
  safeFileNames: true
}))

app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(debug.dblog)

app.use('/login', LoginRouter);

app.use(connectEnsureLoggedIn.ensureLoggedIn())
app.use(isAdmin);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pages', PagesRouter);
app.use('/products', ProductsRouter);
app.use('/orders', OrdersRouters);
app.use('/customers', CustomersRouter);
app.use('/administrators', AdministratorsRouter);
app.use('/coupons', CouponsRouter);
app.use('/account', AccountRouter);
app.use('/settings', SettingsRouter);

var connect = mongoose.connect(config.mongoUrI, 
                                { useNewUrlParser: true,
                                  useUnifiedTopology: true,
                                  useFindAndModify: false
                                });

connect.then((db) => {
  debug.log('Connected to database');
},(err) => {
  debug.error(err.message);
})


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
