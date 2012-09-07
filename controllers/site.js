exports.index = function(req, res) {
	res.local('tag', '');
	res.render('mail/index.html');
};