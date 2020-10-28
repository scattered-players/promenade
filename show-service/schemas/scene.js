const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var sceneSchema = new Schema({
  party: { type: Schema.Types.ObjectId, ref: 'Party' },
  place: { type: Schema.Types.ObjectId, ref: 'Place' },
  startTime: Date,
  endTime: Date
});

module.exports = sceneSchema;