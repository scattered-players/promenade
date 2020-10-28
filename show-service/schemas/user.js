const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  username: String,
  isOnline: Boolean,
  audioError: String,
  videoError: String,
  mediaError: String,
  currentBrowser: String
}, {
    discriminatorKey: 'kind'
});

module.exports = userSchema;