const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
  placeName: String,
  characterName: String,
  currentParty: { type: Schema.Types.ObjectId, ref: 'Party' },
  partyQueue: [{ type: Schema.Types.ObjectId, ref: 'Party' }],
  flavorText: String,
  audioPath: String,
  audioVolume: Number,
  assetKey: String,
  currentFilter: String,
  isAvailable: Boolean,
  phase: { type: Schema.Types.ObjectId, ref: 'Phase' },
  isBot: Boolean,
  botURL: String,
  botTime: Number
});

module.exports = placeSchema;