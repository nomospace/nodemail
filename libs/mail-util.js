var ImapConnection = require('imap').ImapConnection;
var util = require('util');
var nodeMailer = require('nodemailer');
var models = require('../models');
var Mail = models.Mail;

var _handlers;
var _next = 0;

exports.cb = function(err) {
  if (err) die(err);
  else if (_next < _handlers.length) {
    _handlers[_next++].apply(this, Array.prototype.slice.call(arguments).slice(1));
  }
};

exports.setHandlers = function(handlers) {
  _next = 0;
  _handlers = handlers;
};

exports.connection = function(user) {
  if (!user) return;
  // TODO 支持其他邮箱
  return new ImapConnection({
    username: user.name,
    password: user.pass,
    host: 'imap.163.com',
    port: 993,
    secure: true
  });
};

exports.isFunction = function(obj) {
  return toString.call(obj) == '[object function]';
};

exports.createTransport = function(req) {
  var user = req.session.user;
  if (!user) return;

  var name = user.name,
    pass = user.pass;

  return nodeMailer.createTransport('SMTP', {
    // service: "Gmail",
    host: 'smtp.163.com',
    // hostname
    port: 25,
    // port for secure SMTP
    auth: {
      user: name,
      pass: pass
    }
  });
};

exports.getMailById = function(id, cb) {
  Mail.findOne({seqno: id, username: USER.name}, function(err, mail) {
    if (err) throw err;
    cb(mail);
  });
};

exports.saveMail = function(options) {
  var mail = new Mail();
  mail.seqno = options.seqno;
  mail.data = options.data;
  mail.username = USER.name;
  mail.save(function(err) {
    if (err) throw err;
  });
};

function die(err) {
  console.log('Uh oh: ' + err);
  // process.exit(1);
}
