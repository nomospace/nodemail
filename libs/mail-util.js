var ImapConnection = require('imap').ImapConnection;
var util = require('util');
var nodeMailer = require('nodemailer');
var models = require('../models');
var Mail = models.Mail;
//var Temp = models.Temp;

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
//    debug: console.error,
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

//exports.saveImap = function(imap) {
//  var temp = new Temp();
//  temp.imap = imap;
//  temp.save(function(err) {
//    if (err) throw err;
//  });
//};

//exports.getImap = function(cb) {
//  Temp.findOne(USER.name, function(err, temp) {
//    if (err) throw err;
//    cb(temp);
//  });
//};

exports.getMailList = function(cb) {
  Mail.find({username: USER.name}, 'data', function(err, list) {
    // TODO list 数据对象不仅仅包含纯 data 字段
    if (err) throw err;
    cb(list);
  });
};

function die(err) {
  console.log('Uh oh: ' + err);
  // process.exit(1);
}
