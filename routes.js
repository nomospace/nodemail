var site = require('./controllers/site');
var express = require('express');
var path = require('path');

module.exports = function(app) {

  var staticDir = path.join(__dirname, 'public');
  app.use(express.static(staticDir));

  app.get('/', site.index);
  // app.get('/404', function(req, res) {
  //   throw new NotFound;
  // });
  // app.get('/500', function(req, res) {
  //   throw new Error('500!');
  // });
  app.get('*', function(req, res) {
    res.render('index.html', {});
    // throw new NotFound;
  });
}

function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;