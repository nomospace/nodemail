var util = require('util');
var mailUtil = require('../libs/mail-util');
var cache = require('lru-cache')({max: 100});
var fs = require('fs');
var MailParser = require('mailparser').MailParser;
var moment = require('moment');
var emitter = new (require('events').EventEmitter)();

var cb = mailUtil.cb;
var imap, mailObject = {};

moment.lang('zh-cn');

emitter.on('messages', function(res) {
  mailObject.msgs = mailObject.msgs.reverse();
  res.json({
    status: 'success',
    data: mailObject
  });
  console.log('Done fetching all messages!');
// imap.logout(cb);
});

//emitter.on('boxes', function(res, boxes) {
//  res.json(boxes);
//  console.log('Done fetching all boxes!');
//});

exports.index = function(req, res) {
  if (req.session.user) {
    res.locals.tag = 'inbox';
    res.render('mail/list.html');
  } else {
    res.render('sign/signin.html');
  }
};

exports.getList = function(req, res, next) {
  // res.send(JSON.stringify({response:'11json'}));
  _getMail(req, res, next);
};

exports.getById = function(req, res) {
  var id = req.params.id;
  if (id) {
    mailUtil.getMailById(id, function(mail) {
      res.locals({
        'id': id,
        'tag': 'index',
        'moment': moment,
        'data': mail.data
      });
      res.render('mail/mail.html');
    });
  } else {
    res.locals.tag = '';
    res.render('mail/index.html');
  }
};

exports.getHtml = function(req, res) {
  var id = req.params.id;
  if (id) {
    mailUtil.getMailById(id, function(mail) {
      res.locals({'html': mail.data.mail.html});
      res.render('mail/content.html', {layout: false});
    });
  }
}

function _getMail(req, res, next) {
  var user = req.session.user;
  if (!user) return;

  if (!imap) {
    /*req.session.imap =*/
    imap = mailUtil.connection(user);
  }

  mailUtil.setHandlers([
    _connect,
    _getBoxes,
    _openBox,
    _search,
    function(results) {
      _fetch(results, req, res, next);
    }
  ]);

  cb();
}

function _connect(/*fn*/) {
  imap.connect(cb);
  // imap.connect(function(err, results) {
  //   cb(err, results);
  //   isFunction(fn) && fn();
  // });
}

function _getBoxes() {
  // cpu 高负荷 ?
  if (!cache.get('boxes1') || !cache.get('boxes').length) {
    imap.getBoxes(function(err, boxes) {
      cache.set('boxes', boxes);
      if (err) throw err;
      mailObject.boxes = [];
//      console.log(boxes);
      for (var key in boxes) {
        key && mailObject.boxes.push(key);
//        console.log('status: ' + key);
//        imap.status(key, function(err, box) {
//          console.log(key, err, box);
//        });
      }
      cb();
    });
  }
}

function _openBox() {
  imap.openBox('INBOX', false, cb);
}

function _search(results) {
  mailObject.messages = results.messages;
  imap.search(['ALL', ['SINCE', moment().subtract('days', 7 * 1)]], cb);
}

function _fetch(results, req, res, next) {
  var msgLength = results.length,
    fetch = imap.fetch(results, {
      request: {
        body: 'full',
        headers: false
        // headers: ['from', 'to', 'subject', 'date']
      }
    });

  // TODO req.session 过大时，页面响应速度会明显变慢，估计是频繁调用 JSON.stringify(session) 导致的计算效率下降
//  req.session.msgs = {};
  var msgs = {};

  console.log('total:', msgLength);

  var msgChunk = '';
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
        mp.on('end', function(mail) {
          var data = {
            'msg': msg,
            'mail': mail
          };

          msgs[msg.seqno] = data;
          mailObject.msgs.push(data);

          // 持久化至本地数据库
          (function(data) {
            var id = msg.seqno;
            mailUtil.getMailById(id, function(mail) {
              if (!mail) {
                mailUtil.saveMail({seqno: id, data: data});
              }
            });
          })(data);

          // for (var i = 0; i < mail.attachments && mail.attachments.length; i++) {
          //   console.log(mail.attachments[i].fileName);
          // }

          if (msgLength == mailObject.msgs.length) {
            emitter.emit('messages', res);
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
}
