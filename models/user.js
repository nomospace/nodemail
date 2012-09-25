var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String},
  createAt: {type: Date, default: Date.now}
});

mongoose.model('User', UserSchema);
