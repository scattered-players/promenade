const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var showSchema = new Schema({
  date: Date,
  isEventbrite: Boolean,
  eventBriteId: String,
  parties: [{ type: Schema.Types.ObjectId, ref: 'Party' }],
  state: String,
  introStartTime: Number,
  isRunning: Boolean,
  endingType: String
});

module.exports = showSchema;