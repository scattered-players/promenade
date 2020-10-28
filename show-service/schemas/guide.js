const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var guideSchema = new Schema({
  characterName: String
}, {
    discriminatorKey: 'kind'
});

module.exports = guideSchema;