require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiQuestions = require('./routes/api/questions');
const apiAuth = require('./routes/api/auth');
const scoreRoutes = require('./routes/api/score');
var app = express();

MONGO_URI = '';
MONGO_URI = process.env.MONGODB_URI;
 

const continueWithMongoDB = () => {
  mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
}



if  (MONGO_URI === '') {
  console.error('\nMONGO_URI is not set');
} else {
  continueWithMongoDB();
}




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/questions', apiQuestions);
app.use('/api/auth', apiAuth);
app.use('/api/score', scoreRoutes);


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
