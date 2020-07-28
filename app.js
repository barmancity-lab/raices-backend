var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var passport = require('passport');
//var bodyParser = require('body-parser')

let flash = require('connect-flash');

var app = express();

const publicPath = path.resolve(__dirname, 'public');

app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  name: 'schoollapp',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('prod'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.disable('etag');


// Serve this path with the Express static file middleware.
app.use(express.static(publicPath));

var indexRouter = require('./routes/route');
app.use('/', indexRouter);


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

    let errorMsj = JSON.stringify(err.stack);

    res.render('error',{err:errorMsj});
});

module.exports = app;
