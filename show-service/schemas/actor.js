const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var actorSchema = new Schema({
    isAvailable: Boolean,
    places: [{ type: Schema.Types.ObjectId, ref: 'Place' }] 
}, {
    discriminatorKey: 'kind'
});

module.exports = actorSchema;