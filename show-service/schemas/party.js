const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var partySchema = new Schema({
  currentPlace: { type: Schema.Types.ObjectId, ref: 'Place' },
  selectedPlace: { type: Schema.Types.ObjectId, ref: 'Place' },
  nextPlace: { type: Schema.Types.ObjectId, ref: 'Place' },
  attendances: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }],
  chat: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  inventory: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  decider: { type: Schema.Types.ObjectId, ref: 'Attendance' },
  guideIsDeciding: Boolean,
  guide: { type: Schema.Types.ObjectId, ref: 'Guide' },
  decisionDeadline: Date,
  janusIndex: Number,
  color: String,
  name: String,
  history: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
  notes: String,
  videoChoices: [{ phase: { type: Schema.Types.ObjectId, ref: 'Phase' }, choiceURL: String }]
});

module.exports = partySchema;