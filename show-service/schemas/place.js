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
  phases: { type: Schema.Types.ObjectId, ref: 'Phase' }
});

module.exports = placeSchema;