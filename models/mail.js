var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MailSchema = new Schema({
  id: {type: String},
  username: {type: String},
  page: {type: Number},
  data: {type: Object},
  createAt: {type: Date, default: Date.now}
});

mongoose.model('Mail', MailSchema);
