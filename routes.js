var index = require('./controllers/index');
var site = require('./controllers/site');
var sign = require('./controllers/sign');
var mail = require('./controllers/mail');
var inbox = require('./controllers/inbox');
var compose = require('./controllers/compose');

var express = require('express');
var path = require('path');

module.exports = function(app) {
  app.use(express.static(path.join(__dirname, 'public')));

  // url routes
  app.get('/', site.index);
  app.get('/signin', sign.showSignin);
  app.get('/signout', sign.signout);
  app.post('/signin', sign.signin);
  app.get('/mail', mail.index);
  app.get('/mail/inbox', inbox.index);
  app.get('/mail/flagged', inbox.flagged);
  app.get('/mail/seen', inbox.seen);
  app.get('/mail/unseen', inbox.unseen);
  app.get('/mail/deleted', inbox.deleted);
  app.get('/mail/answered', inbox.answered);
  app.get('/mail/draft', inbox.draft);
  app.get('/mail/box/:box', inbox.box);
  app.get('/mail/inbox/page/:page', inbox.index);
  app.get('/mail/inbox/:id', inbox.getById);
  app.get('/mail/inbox/:id/html', inbox.getHtml);
  app.get('/mail/inbox/:id/compose', compose.index);
  app.get('/mail/compose', compose.index);

  // ajax
  app.get('/ajax/mail/index', index);
  app.get('/ajax/mail/inbox', inbox.getAll);
  app.get('/ajax/mail/flagged', inbox.getFlagged);
  app.get('/ajax/mail/seen', inbox.getSeen);
  app.get('/ajax/mail/unseen', inbox.getUnseen);
  app.get('/ajax/mail/deleted', inbox.getDeleted);
  app.get('/ajax/mail/answered', inbox.getAnswered);
  app.get('/ajax/mail/draft', inbox.getDraft);
  app.get('/ajax/mail/box/:box', inbox.getBoxMail);
  app.get('/ajax/mail/boxes', inbox.getBoxes);
  app.post('/ajax/mail/send', compose.send);
  app.post('/ajax/mail/:id/addFlags/:flag', inbox.addFlags);

  app.get('*', function(req, res) {
    res.render('index.html', {});
    // throw new NotFound;
  });

};

//function NotFound(msg) {
//  this.name = 'NotFound';
//  Error.call(this, msg);
//  Error.captureStackTrace(this, arguments.callee);
//}
//
//NotFound.prototype.__proto__ = Error.prototype;
