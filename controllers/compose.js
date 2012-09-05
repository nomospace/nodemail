exports.index = function(req, res) {
  var id = req.params.id;
  if (id) {
    res.locals({
      'id': id,
      'tag': 'inbox',
      'data': req.session.msgs[id]
    });
    res.render('mail/compose.html');
  }
}