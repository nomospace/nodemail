var moment = require('moment');

exports.index = function(req, res) {
  var id = req.params.id;
  if (id) {
    res.locals({
      'id': id,
      'tag': 'inbox',
      'moment': moment,
      'data': req.session.msgs[id]
    });
    res.render('mail/compose.html');
  }
}