const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var showSchema = new Schema({
  date: Date,
  isEventbrite: Boolean,
  eventBriteId: String,
  parties: [{ type: Schema.Types.ObjectId, ref: 'Party' }],
  currentPhase: { type: Schema.Types.ObjectId, ref: 'Phase' },
  isRunning: Boolean
});

module.exports = showSchema;