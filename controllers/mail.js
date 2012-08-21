exports.index = function(req, res, next) {
  if (req.session.user) {
    res.render('mail/index.html', {});
  } else {
    res.render('sign/signin.html');
  }
  // _getMail(req, res);
};

exports.inbox = function(req, res, next) {
  // res.json({
  //   status: 'success',
  //   now: new Date()
  // });
  _getMail(req, res);
}

function _getMail(req, res) {
  var user = req.session.user;
  // console.log(user.name, user.pass);
  var ImapConnection = require('imap').ImapConnection,
    util = require('util'),
    imap = new ImapConnection({
      username: user.name,
      password: user.pass,
      host: 'imap.163.com',
      port: 993,
      secure: true
    });

  function die(err) {
    console.log('Uh oh: ' + err);
    process.exit(1);
  }

  var box, cmds, next = 0,
    cb = function(err) {
      if (err) die(err);
      else if (next < cmds.length) cmds[next++].apply(this, Array.prototype.slice.call(arguments).slice(1));
    };
  cmds = [

  function() {
    imap.connect(cb);
  }, function() {
    imap.openBox('INBOX', false, cb);
  }, function(result) {
    box = result;
    imap.search(['SEEN', ['SINCE', 'August 15, 2012']], cb);
  }, function(results) {
    var fetch = imap.fetch(results, {
      request: {
        headers: ['from', 'to', 'subject', 'date']
      }
    });
    var message;
    fetch.on('message', function(msg) {
      console.log('Got message: ' + util.inspect(msg, true, 5));
      msg.on('data', function(chunk) {
        console.log('Got message chunk of size ' + chunk.length);
      });
      msg.on('end', function() {
        console.log(msg.structure);
        message = msg;
        // console.log('Finished message: ' + util.inspect(msg, false, 5));
      });
    });
    fetch.on('end', function() {
      // 返回数据
      res.json({
        status: 'success',
        data: message
      });
      console.log('Done fetching all messages!');
      imap.logout(cb);
    });
  }

  ];
  cb();
}