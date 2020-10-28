const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: String,
  isAnsiblePart: Boolean
});

module.exports = itemSchema;