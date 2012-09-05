exports.index = function(req, res) {
  var id = req.params.id;
  if (id) {
    res.local('tag', 'inbox');
    res.local('data', req.session.msgs[id]);
    res.render('mail/compose.html');
  }
}