var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MailSchema = new Schema({
  seqno: {type: String},
  username: {type: String},
  data: {type: Object},
  createAt: {type: Date, default: Date.now}
});

mongoose.model('Mail', MailSchema);
