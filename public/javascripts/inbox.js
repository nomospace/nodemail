$(function() {
	// debugger;
	// var path = location.pathname;
	// if (path == '/mail') {
	// 	_getInbox();
	// }

	function _getInbox() {
		$.getJSON('/ajax/mail/inbox').done(function(result) {
			console.log(result);
			$('#J_content').html(JSON.stringify(result.data));
		});
	}

	_getInbox();
})