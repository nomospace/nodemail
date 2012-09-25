var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TempSchema = new Schema({
  imap: {type: Object},
  createAt: {type: Date, default: Date.now}
});

mongoose.model('Temp', TempSchema);
