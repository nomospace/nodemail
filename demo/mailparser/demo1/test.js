var MailParser = require("mailparser").MailParser,
	mailparser = new MailParser(),
	fs = require("fs");

mailparser.on("end", function(mail_object) {
	console.log(mail_object);
	// console.log("Subject:", mail_object.subject);
});

fs.createReadStream("163.eml").pipe(mailparser);