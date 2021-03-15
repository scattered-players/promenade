const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var guideSchema = new Schema({
  characterName: String,
  isAudioMuted: Boolean,
  isVideoMuted: Boolean,
  isMegaphone: Boolean
}, {
    discriminatorKey: 'kind'
});

module.exports = guideSchema;