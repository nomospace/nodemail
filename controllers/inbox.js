var mailUtil = require('./mail-util');
var fs = require('fs');

var cb = mailUtil.cb;
var imap;
var mailObject = {};

exports.index = function(req, res) {
  res.render('mail/inbox.html');
}

exports.getList = function(req, res, next) {
  _getMail(req, res);
}

function _getMail(req, res) {
  var user = req.session.user;
  if (!user) return;

  if (!imap) {
    imap = mailUtil.connection(user);
  }

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
  mailUtil.setHandlers([
    _connect, 
    _openBox, 
    _search, 
    function(results) {
      _fetch(results, res);
    }]);

  cb();
}

function _connect() {
  console.log('connect...');
  imap.connect(cb);
}

function _openBox() {
  imap.openBox('INBOX', false, cb);
}

function _search(results) {
  console.log(results);
  mailObject.messages = results.messages;
  imap.search(['ALL', ['SINCE', 'August 27, 2012']], cb);
}

function _fetch(results, res) {
  var fetch = imap.fetch(results, {
    request: {
      body: true
      // headers: ['from', 'to', 'subject', 'date']
    }
  });

  var fileStream, msgChunk = '';
  mailObject.msgs = [];

  fetch.on('message', function(msg) {
    // console.log('Got message: ' + util.inspect(msg, true, 5));
    // fileStream = fs.createWriteStream('msg-' + msg.seqno + '-raw.txt');
    msg.on('data', function(chunk) {
      // console.log('Got message chunk of size ' + chunk.length);
      // fileStream.write(chunk);
      msgChunk += chunk;
    });
    msg.on('end', function() {

      mailObject.msgs.push({
        'msg': msg,
        'chunk': msgChunk
      });

      msgChunk = '';

      // console.log(msgChunk);
      // fileStream.end();
      // console.log('Finished message: ' + util.inspect(msg, false, 5));
    });
  });

  fetch.on('end', function() {
    mailObject.msgs = mailObject.msgs.reverse();    
    // 返回数据
    res.json({
      status: 'success',
      data: mailObject
    });
    console.log('Done fetching all messages!');
    // imap.logout(cb);
  });
}