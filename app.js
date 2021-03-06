var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
var exphbs=require('express-handlebars');
var session = require('express-session')
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var mongoUtil = require( './utils/mongoUtil' );

var csrf = require('csurf');
var bodyParser = require('body-parser');
// var parseForm = bodyParser.urlencoded({ extended: false })
// var csrfProtection = csrf({ cookie: true })

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf({ cookie: true }))

mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my super secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.use('/', indexRouter);

// app.use('/users', usersRouter);

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
