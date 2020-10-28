const path = require('path');
var mongoose = require('mongoose');
const { MONGODB_CONNECTION_STRING } = require('../secrets/credentials.json')
mongoose.set('useCreateIndex', true);
mongoose.connect(MONGODB_CONNECTION_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DATABASE CONNECTED')
});

module.exports = {
    db,
    mongoose
};