const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var attendeeSchema = new Schema({
    isBlocked: Boolean,
    audioMuteDeadline: Number,
    isAudioMuted: Boolean,
    videoMuteDeadline: Number,
    isVideoMuted: Boolean
}, {
    discriminatorKey: 'kind'
});

module.exports = attendeeSchema;