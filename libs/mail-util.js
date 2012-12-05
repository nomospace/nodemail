var ImapConnection = require('imap').ImapConnection;
//var util = require('util');
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

exports.getConnection = function(user, recreate) {
  if (recreate || !this.conn) {
    // TODO 匹配过于简单暴力
    var mail = user.name && user.name.split('@')[1].split('.')[0];
    this.conn = new ImapConnection({
      username: user.name,
      password: user.pass,
      host: 'imap.' + mail + '.com',
      port: 993,
//      debug: console.error,
      secure: true
    });
  }
  return this.conn;
};

exports.doConnect = function(options, cb) {
  this.getConnection(options.user, options.recreate).connect(cb);
};

exports.doLogout = function(user, cb) {
  this.getConnection(user).logout(cb);
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
  Mail.findOne({id: id, username: USER.name}, function(err, mail) {
    if (err) throw err;
    cb(mail);
  });
};

exports.saveMail = function(options) {
  var mail = new Mail();
  mail.id = options.id;
  mail.page = options.page;
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

exports.getMailListByPage = function(page, cb) {
  Mail.find({page: page, username: USER.name}, 'data',
    function(err, list) {
      // TODO list 数据对象不仅仅包含纯 data 字段
      // 数据按时间对象排序
      if (err) throw err;
      cb(list);
    });
};

exports.updateMail = function(options) {
  Mail.update({id: options.id, page: options.page, username: USER.name}, function(err, mail) {
    if (err) throw err;
  });
};

exports.getUnseenMail = function(imap, cb) {
  imap.search(['UNSEEN'], cb);
};

exports.getBoxes = function(imap, cb) {
  imap.getBoxes(function(err, boxes) {
    if (err) throw err;
    var bs = [], key;
//      console.log(boxes);
    for (key in boxes) {
      key && bs.push(key);
//        console.log('status: ' + key);
//        imap.status(key, function(err, box) {
//          console.log(key, err, box);
//        });
    }
    cb(bs);
  });
};

exports.saveBoxes = function() {

};

function die(err) {
  console.log('Uh oh: ' + err);
  // process.exit(1);
}
