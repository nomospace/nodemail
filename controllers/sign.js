var sanitize = require('validator').sanitize;

exports.showLogin = function(req, res) {
  // req.session._loginReferer = req.headers.referer;
  res.render('sign/signin.html');
}

exports.login = function(req, res, next) {
  // todo exception ?
  console.log(req.name, req.body);
  var loginName = sanitize(req.body.name).trim().toLowerCase();
  var pass = sanitize(req.body.pass).trim();
  console.log(loginName, pass);
}