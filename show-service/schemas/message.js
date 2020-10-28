const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  schemaVersion: Number,
  username: String,
  userKind: String,
  content: String,
  timestamp: Number
});

module.exports = messageSchema;