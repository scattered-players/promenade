const { mongoose } = require('../util/db');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    isRootUser: Boolean
}, {
    discriminatorKey: 'kind'
});

module.exports = adminSchema;