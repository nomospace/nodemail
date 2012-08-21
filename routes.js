var site = require('./controllers/site');
var sign = require('./controllers/sign');
var mail = require('./controllers/mail');

var express = require('express');
var path = require('path');

module.exports = function(app) {

  var staticDir = path.join(__dirname, 'public');
  app.use(express.static(staticDir));

  // 
  app.get('/', site.index);
  app.get('/signin', sign.showLogin);
  app.get('/signout', sign.signout)
  app.post('/signin', sign.login);
  app.get('/mail', mail.index);

  // ajax
  app.get('/mail/inbox', mail.inbox);


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