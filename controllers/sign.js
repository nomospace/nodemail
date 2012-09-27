var config = require('../config').config;
var sanitize = require('validator').sanitize;
var crypto = require('crypto');
var mailUtil = require('../libs/mail-util');

exports.showLogin = function(req, res) {
  // req.session._loginReferer = req.headers.referer;
  res.render('sign/signin.html');
};

exports.login = function(req, res) {
  var name = sanitize(req.body.name).trim().toLowerCase();
  var pass = sanitize(req.body.pass).trim();
  var user = {
    name: name,
    pass: pass
  };
  // store session cookie
  genSession(user, res);

  mailUtil.connection(user).connect(function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('login');
      USER = req.session.user = user;
      res.locals({'currentUser': req.session.user});
      res.redirect('/mail');
    }
  });
};

exports.signout = function(req, res) {
  var user = req.session.user;
  if (user) {
    mailUtil.connection(user).logout(function(err) {
      if (err) {
        throw err;
      } else {
        console.log('logout');
        req.session.destroy();
        res.clearCookie(config.authCookieName, {path: '/'});
        res.redirect(req.headers.referer || 'home');
      }
    });
  } else {
    res.redirect('/signin');
  }
};

exports.authUser = function(req, res, next) {
  if (req.session.user) {
    res.locals({'currentUser': req.session.user});
  }
  return next();
};

// private

function genSession(user, res) {
  var authToken = encrypt(user.name + '\t' + user.pass, config.sessionSecret);
  // cookie 有效期30天   
  res.cookie(config.authCookieName, authToken, {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30
  });
}

function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}
