exports.index = function(req, res) {
  res.locals.tag = '';
  res.render('mail/index.html');
//  res.partial('../../README.md');
};
