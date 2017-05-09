var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var compression = require('compression');
var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var cons = require('consolidate');
var session = require('express-session');
const FileStore = require('session-file-store')(session);
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // view engine setup
  app.set('views', config.root + 'views');
  app.set('view engine', 'html');
  app.engine('html', require('ejs-mate'));

  // uncomment after placing your favicon in /public
  app.use(compression());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(session({
    secret: 'sensecent~',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        retries: 1
    }),
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(config.root + 'public'));

  if ('development' === env) {
    app.use(errorHandler());
  }
};
