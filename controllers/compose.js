var moment = require('moment');
//var nodemailer = require('nodemailer');
var mailUtil = require('../libs/mail-util');

exports.index = function(req, res) {
  if (req.session.user) {
    var id = req.params.id;
    if (id) {
      mailUtil.getMailById(id, function(mail) {
        res.locals({
          'id': id,
          'tag': 'inbox',
          'moment': moment,
          'data': mail.data
        });
        res.render('mail/compose.html');
      });
    } else {
      res.locals({
        'id': '',
        'tag': '',
        'moment': '',
        'data': ''
      });
      res.render('mail/compose.html');
    }
  } else {
    res.redirect('/signin');
  }
};

exports.send = function(req, res) {
  // npm usage http://cnodejs.org/topic/501cb7aff767cc9a51b14c1b
  // todo show-code http://isolasoftware.it/2012/05/28/call-rest-api-with-node-js/
  // bug https://github.com/visionmedia/express/issues/1080
  // bug https://github.com/andris9/mailcomposer/issues/6
  // see https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
  // bugunfixed https://github.com/mscdex/node-imap/issues/88
  // console.log(req.body);
  var body = req.body,
    transport = mailUtil.createTransport(req),
    options = {
      'from': body.from,
      'to': body.to,
      'cc': body.cc,
      'subject': body.subject,
      'text': body.text,
      'html': body.html
    };

//  console.log(body);

  transport.sendMail(options, function(error) {
    if (error) {
      res.json({
        status: 'error',
        message: error.message
      });
    } else {
      // if you don't want to use this transport object anymore, uncomment following line
      transport.close(); // close the connection pool
      res.json({
        status: 'success'
      });
    }
  });
};
