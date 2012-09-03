exports.trim = trim;
function trim(string) {
	return string.replace(/^\s*|\s*$/, '')
}

exports.explode = explode;
function explode(string, delim, limit) {
	if (!limit) {
		return string.split(delim);
	}
	var parts  = string.split(delim);

	var result = parts.slice(0, limit - 1);
	result.push(parts.slice(limit - 1).join(delim));
	return result;
}
