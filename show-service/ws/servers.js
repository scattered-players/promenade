const WebSocket = require('ws');

const wssAdmin = new WebSocket.Server({ noServer: true });
const wssActor = new WebSocket.Server({ noServer: true });
const wssAttendee = new WebSocket.Server({ noServer: true });
const wssGuide = new WebSocket.Server({ noServer: true });
const wssFacesIn = new WebSocket.Server({ noServer: true });
const wssFacesOut = new WebSocket.Server({ noServer: true });

module.exports = {
  wssAdmin,
  wssActor,
  wssAttendee,
  wssGuide,
  wssFacesIn,
  wssFacesOut
};