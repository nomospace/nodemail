exports.index = function(req, res, next) {
  if (req.session.user) {
    res.render('mail/index.html', {});
  } else {
    res.render('sign/signin.html');
  }
};