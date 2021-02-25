const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var botSchema = new Schema({
    username: String,
    isOnline: Boolean,
    isAvailable: Boolean,
    places: [{ type: Schema.Types.ObjectId, ref: 'Place' }] 
});

module.exports = botSchema;