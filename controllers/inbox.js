var mailUtil = require('./mail-util');

var _imap;

exports.index = function(req, res) {
    res.render('mail/inbox.html');
}

exports.getList = function(req, res, next) {
  _getMail(req, res);
}

function _getMail(req, res) {
  var user = req.session.user,
  imap, mailObject = {};
  if (!user) return;
  // console.log(user.name, user.pass);
  console.log('get');

  if (!_imap) {
    _imap = mailUtil.connection(user);
  }
  imap = _imap;

  // var ImapConnection = require('imap').ImapConnection,
  //  util = require('util'),
  //  imap = new ImapConnection({
  //    username: user.name,
  //    password: user.pass,
  //    host: 'imap.163.com',
  //    port: 993,
  //    secure: true
  //  });
  // function die(err) {
  //  console.log('Uh oh: ' + err);
  //  process.exit(1);
  // }
  // var box, cmds, next = 0,
  //  cb = function(err) {
  //    if (err) die(err);
  //    else if (next < cmds.length) {
  //      cmds[next++].apply(this, Array.prototype.slice.call(arguments).slice(1));
  //    }
  //  };
  var cb = mailUtil.cb,
    box;

  mailUtil.setHandlers([

  function() {
    console.log('connect...');
    imap.connect(cb);
  }, function() {
    imap.openBox('INBOX', false, cb);
  }, function(result) {
    console.log(result);
    box = result;
    mailObject.messages = box.messages;
    // console.log(box);
    imap.search(['ALL', ['SINCE', 'August 20, 2012']], cb);
  }, function(results) {
    var fetch = imap.fetch(results, {
      request: {
        body: true
        // headers: ['from', 'to', 'subject', 'date']
      }
    });
    // var message;
    fetch.on('message', function(msg) {
      // console.log('Got message: ' + util.inspect(msg, true, 5));
      msg.on('data', function(chunk) {
        // console.log('Got message chunk of size ' + chunk.length);
      });
      msg.on('end', function() {
        // console.log(msg);
        // message = msg;
        mailObject.msg = msg;
        // console.log('Finished message: ' + util.inspect(msg, false, 5));
      });
    });
    fetch.on('end', function() {
      // 返回数据
      res.json({
        status: 'success',
        data: mailObject
      });
      console.log('Done fetching all messages!');
      // imap.logout(cb);
    });
  }

  ]);
  cb();
}