var site = require('./controllers/site');
var sign = require('./controllers/sign');
var mail = require('./controllers/mail');
var inbox = require('./controllers/inbox');
var compose = require('./controllers/compose');

var express = require('express');
var path = require('path');

module.exports = function(app) {

  var staticDir = path.join(__dirname, 'public');
  app.use(express.static(staticDir));

  // url routes
  app.get('/', site.index);
  app.get('/signin', sign.showLogin);
  app.get('/signout', sign.signout);
  app.post('/signin', sign.login);
  app.get('/mail', mail.index);
  app.get('/mail/inbox', inbox.index);
  app.get('/mail/unseen', inbox.unseen);
  app.get('/mail/inbox/page/:page', inbox.index);
  app.get('/mail/inbox/:id', inbox.getById);
  app.get('/mail/inbox/:id/html', inbox.getHtml);
  app.get('/mail/inbox/:id/compose', compose.index);
  app.get('/mail/compose', compose.index);


  // ajax
  app.get('/ajax/mail/inbox', inbox.getAll);
  app.get('/ajax/mail/unseen', inbox.getUnseen);
  app.get('/ajax/mail/boxes', inbox.getBoxes);
  app.post('/ajax/mail/send', compose.send);

  app.get('*', function(req, res) {
    res.render('index.html', {});
    // throw new NotFound;
  });

};

function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;
