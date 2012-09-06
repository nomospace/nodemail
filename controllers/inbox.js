var util = require('util');
var mailUtil = require('../libs/mail-util');
var cache = require('lru-cache')({
  max: 100
});
var fs = require('fs');
var MailParser = require('mailparser').MailParser;
var moment = require('moment');
var emitter = new (require('events').EventEmitter)();

var cb = mailUtil.cb;
var isFunction = mailUtil.isFunction;
var imap, mailObject = {};

moment.lang('zh-cn');

emitter.on('response', function(res) {
  mailObject.msgs = mailObject.msgs.reverse();
  res.json({
    status: 'success',
    data: mailObject
  });
  console.log('Done fetching all messages!');
  // imap.logout(cb);
});

exports.index = function(req, res) {
  res.local('tag', 'inbox');
  res.render('mail/list.html');
}

exports.getList = function(req, res) {
  _getMail(req, res);
}

exports.getById = function(req, res) {
  var id = req.params.id;
  if (id) {
    res.locals({
      'id': id,
      'tag': 'index',
      'moment': moment,
      'data': req.session.msgs[id]
    });
    res.render('mail/mail.html');
  }
}

exports.getHtml = function(req, res) {
  var id = req.params.id;
  if (id) {
    res.locals({
      'html': req.session.msgs[id].mail.html
    });
    res.render('mail/content.html', {
      layout: false
    });
  }
}

// exports.getBoxes = function(req, res) {
//   _connect(function() {
//     _getBoxes(req, res);
//   });
// }

function _getMail(req, res) {
  var user = req.session.user;
  if (!user) return;

  if (!imap) {
    imap = mailUtil.connection(user);
  }

  mailUtil.setHandlers([
  _connect, _openBox, _search, function(results) {
    _fetch(results, res, req);
  }]);

  cb();
}

function _connect(fn) {
  imap.connect(cb);
  // imap.connect(function(err, results) {
  //   cb(err, results);
  //   isFunction(fn) && fn();
  // });
}

function _openBox() {
  imap.openBox('INBOX', false, cb);
}

function _search(results) {
  mailObject.messages = results.messages;
  imap.search(['ALL', ['SINCE', moment().subtract('days', 7)]], cb);
}

function _fetch(results, res, req) {
  var msgLength = results.length,
    fetch = imap.fetch(results, {
      request: {
        body: 'full',
        headers: false
        // headers: ['from', 'to', 'subject', 'date']
      }
    });

  req.session.msgs = {};

  console.log('total:', msgLength);

  var fileStream, msgChunk = '',
    bufferHelper;
  mailObject.msgs = [];

  fetch.on('message', function(msg) {
    // var fileName = 'msg-' + msg.seqno + '-raw.txt';
    // fileStream = fs.createWriteStream(fileName);
    msg.on('data', function(chunk) {
      // fileStream.write(chunk);
      msgChunk += chunk;
      cache.set(msg.seqno, msgChunk);
    });
    msg.on('end', function() {
      if (msgChunk) {
        var mp = new MailParser();
        mp.setMaxListeners(100);

        // setup an event listener when the parsing finishes
        // mp.on('headers', function(headers){
        //   headers = headers;
        // });
        mp.on("end", function(mail) {
          var data = {
            'msg': msg,
            'mail': mail
          };

          req.session.msgs[msg.seqno] = data;
          mailObject.msgs.push(data);

          for (var i = 0; i < mail.attachments && mail.attachments.length; i++) {
            console.log(mail.attachments[i].fileName);
          }

          if (msgLength == mailObject.msgs.length) {
            emitter.emit('response', res);
          }
        });

        // var mail = new Buffer(msgChunk, 'utf-8');
        // for (var i = 0, len = mail.length; i < len; i++) {
        //   mp.write(new Buffer([mail[i]]));
        // }

        // fs.createReadStream(fileName).pipe(mp);

        // send the email source to the parser
        // mp.write();
        mp.end(cache.get(msg.seqno));

        msgChunk = '';
      }

      // fileStream.end();
    });
  });

  // fetch.on('end', function() {
  // mailObject.msgs = mailObject.msgs.reverse();
  // res.json({
  //   status: 'success',
  //   data: mailObject
  // });
  // console.log('Done fetching all messages!');
  // imap.logout(cb);
  // });
}

// function _getBoxes(req, res) {
//   imap.getBoxes(function(err, results) {
//     res.json({
//       status: 'success',
//       data: results
//     });
//   });
// }