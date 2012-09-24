var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MailSchema = new Schema({
  name: {type: String},
  body: {type: Object},
  description: {type: String},
  createAt: {type: Date, default: Date.now}
});

mongoose.model('Mail', MailSchema);
