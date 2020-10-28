const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var attendanceSchema = new Schema({
  attendee: { type: Schema.Types.ObjectId, ref: 'Attendee' },
  show: { type: Schema.Types.ObjectId, ref: 'Show' },
  party: { type: Schema.Types.ObjectId, ref: 'Party' }
});

module.exports = attendanceSchema;