const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/credentials.json');

// var token = jwt.sign({ foo: 'bar' }, JWT_SECRET, { algorithm: 'HS256', expiresIn: 1});
// console.log('SIGNED TOKEN!', token);
// console.log('VERIFICATION!', jwt.verify(token,JWT_SECRET));
// setTimeout(() => {
//   console.log('VERIFICATION?', jwt.verify(token,JWT_SECRET));
// }, 2000);

module.exports = {
  createToken: user => {
    var token = jwt.sign({ userId: user._id, username: user.username, kind: user.kind }, JWT_SECRET, { algorithm: 'HS256'});
    return token;
  },
  createExpiringToken: (user, expiresIn) => {
    var token = jwt.sign({ userId: user._id, username: user.username, kind: user.kind }, JWT_SECRET, { algorithm: 'HS256', expiresIn});
    return token;
  },
  decodeToken: token => jwt.decode(token),
  validateToken: token => {
    return jwt.verify(token,JWT_SECRET);
  }
}

