exports.index = function(req, res, next) {
  if (req.session.user) {
    res.locals.tag = '';
    res.render('mail/index.html');
  } else {
    res.redirect('/signin');
  }
};
