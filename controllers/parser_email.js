var   util  = require('util')
    , utils  = require('./utils')
    , events = require('events')
;

module.exports = ParserEmail;

function ParserEmail(content) {
    var parser = this;

    parser.content = content;
}
util.inherits(ParserEmail, events.EventEmitter);

ParserEmail.prototype.execute = function() {
    var parser = this;

    parser.parse_part(parser.content);
}

ParserEmail.prototype.parse_header_block = function(content) {
    var parser = this;

	var result      = new Array();
	if (content == '') {
		return result;
	}
	var header_arr  = content.split(/\r\n|\n/);
	var current_key = false;
	var extra       = false;
	for (var i = 0; i < header_arr.length; i++) {
		tupple = utils.explode(header_arr[i], ':', 2);
		if (header_arr[i].match(/^\s+/) || tupple.length < 2) {
			if (current_key && header_arr[i].match(/^\s+/)) {
				//util.log('Adding [' + header_arr[i] + '] to ' + current_key);
				result[current_key] += ' ' + utils.trim(header_arr[i]);
				extra = true;
			} else {
				util.debug('Invalid Header: ' + header_arr[i]);
			}
			continue;
		}
		var key     = tupple[0].toLowerCase();
		//util.log('Working with ' + key);
		current_key = key;
		result[key] = tupple[1];
	}
	for (key in result) {
		result[key] = parser.parse_header(result[key]);
	}
	return result;
}

ParserEmail.prototype.parse_header = function(header) {
    var parser = this;

	var result    = {};
	var extra = false;
	header        = header.split(';');
	result.value  = utils.trim(header[0]);
	//Start from second element
	for(var i = 1; i < header.length; i++) {
		if (header[i] == '') {
			continue;
		}
		extra = true;
		var tupple = utils.explode(header[i], '=', 2);
		var h_name = utils.trim(tupple[0]);
		//util.log('Extra Name: (' + i + ')' + h_name);
		if (tupple.length == 2) {
			result[h_name] = utils.trim(tupple[1]).replace(/^"/, '').replace(/"$/, '');
		} else {
			result[h_name] = '';
		}
	}
	return result;
}

ParserEmail.prototype.parse_multitype = function(content, boundary) {
    var parser = this;

	if (!content || !boundary) {
		return false;
	}
	//util.log('Working with boundary ' + boundary);
	if (content.substr(0, boundary.length + 2) != ('--' + boundary)) {
		util.debug('Invalid Multi Part');
		return false;
	}

    var regexp = new RegExp('--' + boundary + '\\r?\\n', 'mg');
    //util.debug(util.inspect(regexp));
	content = content.split(regexp);
	//util.debug('Content Length: ' + content.length);
	//Skip the first part, as it's empty
	for (var i = 1; i < content.length; i++) {
	    inner = true;
	    //util.log('Parsing Part ' + i + ': ' + boundary);
	    parser.parse_part(content[i]);
	}
}

ParserEmail.prototype.parse_part = function(content) {
    var parser = this;

	var temp = content.split(/\r?\n\r?\n/gm);
	content = new Array();
	content.push(temp[0]);
	content.push(temp.slice(1).join("\n\n"));

    //Compile the headers
	var headers = parser.parse_header_block(content[0]);
	if (!headers['content-type']) {
		headers['content-type'] = { 'value': 'text/plain' };
	}

    //Compile the content
	if (content.length == 2) {
		content = content[1];
	} else {
		content = '';
	}

	util.debug('Emitting raw part on ' + headers['content-type'].value);
	parser.emit('raw_part', headers, content);

	parser.parse_raw_part(headers, content);
}

ParserEmail.prototype.parse_raw_part = function(headers, content) {
    //Rebuild some of the types
	var main_type = headers['content-type'].value.split("\/", 1) + '';
	util.log('Have a content type: ' + headers['content-type'].value);
	util.log('Main Type: ' + main_type);
	switch (main_type) {
	case 'text':
		break;
	case 'multipart':
		parser.parse_multitype(content, headers['content-type'].boundary);
		break;
	case 'application':
	case 'image':
		content = content.replace(/\r\n/mg, '');
		break;
	default:
		util.debug('Unknown content type: ' + headers['content-type'].value);
		util.debug('Unknown content type: ' + main_type);
		util.debug(util.inspect(headers['content-type']));
		break;
	}
	parser.emit('part', headers, content);
}
