const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var phaseSchema = new Schema({
    name: String,
    kind: String,
    attributes: Object
});

module.exports = phaseSchema;