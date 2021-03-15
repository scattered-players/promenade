const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var guideSchema = new Schema({
  characterName: String,
  isAudioMuted: Boolean,
  isVideoMuted: Boolean,
  isMegaphone: Boolean,
  audioPath: String
}, {
    discriminatorKey: 'kind'
});

module.exports = guideSchema;