var mailUtil = require('./mail-util');
var fs = require('fs');
var MailParser = require('mailparser').MailParser;

var cb = mailUtil.cb;
var isFunction = mailUtil.isFunction;
var imap, mailObject = {};

exports.index = function(req, res) {
  res.render('mail/inbox.html');
}

exports.getList = function(req, res) {
  _getMail(req, res);
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
    _fetch(results, res);
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
  imap.search(['ALL', ['SINCE', 'August 28, 2012']], cb);
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
      msgChunk = chunk;
    });
    msg.on('end', function() {
      var text = '', headers = '';
      if (msgChunk) {
        var mp = new MailParser();
        mp.setMaxListeners(100);

        // setup an event listener when the parsing finishes
        mp.on('headers', function(headers){
          headers = headers;
        });
        mp.on("end", function(mail_object) {
          console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
          console.log("Subject:", mail_object.subject); // Hello world!
          console.log("Text body:", mail_object.text); // How are you today?          
        });

        var mail = new Buffer(msgChunk, 'utf-8');
        for (var i = 0, len = mail.length; i < len; i++) {
          mp.write(new Buffer([mail[i]]));
        }
        mp.end();

        // send the email source to the parser
        // mp.write(mail);
        // mp.end(mail);
      }

      mailObject.msgs.push({
        'msg': msg,
        // 'chunk': msgChunk,
        'text': text,
        'headers': headers
      });
      // fileStream.end();
    });
  });

  fetch.on('end', function() {
    mailObject.msgs = mailObject.msgs.reverse();
    res.json({
      status: 'success',
      data: mailObject
    });
    console.log('Done fetching all messages!');
    imap.logout(cb);
  });
}

// function _getBoxes(req, res) {
//   imap.getBoxes(function(err, results) {
//     res.json({
//       status: 'success',
//       data: results
//     });
//   });
// }