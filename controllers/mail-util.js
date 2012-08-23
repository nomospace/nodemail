var ImapConnection = require('imap').ImapConnection;
var util = require('util');

var _handlers;
var _next = 0;

exports.cb = function(err) {
	// var box;
	if (err) die(err);
	else if (_next < _handlers.length) {
		_handlers[_next++].apply(this, Array.prototype.slice.call(arguments).slice(1));
	}
}

exports.setHandlers = function(handlers) {
	_handlers = handlers;
}

exports.connection = function(user) {
	if (!user) return;
	// todo 支持其他邮箱
	return imap = new ImapConnection({
		username: user.name,
		password: user.pass,
		host: 'imap.163.com',
		port: 993,
		secure: true
	});
}

function die(err) {
	console.log('Uh oh: ' + err);
	process.exit(1);
}