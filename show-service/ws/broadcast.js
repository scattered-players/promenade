const WebSocket = require('ws');

const {
  wssAdmin,
  wssActor,
  wssAttendee,
  wssGuide
} = require('./servers');

function broadcastAdmin(message) {
  wssAdmin.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function broadcastActor(message) {
  wssActor.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function broadcastAttendee(message) {
  wssAttendee.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function broadcastGuide(message) {
  wssGuide.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function broadcastAll(message) {
  broadcastAdmin(message);
  broadcastActor(message);
  broadcastAttendee(message);
  broadcastGuide(message);
}

function sendMessageToUser(userId, message) {
  wssAdmin.clients.forEach(function each(client) {
    if (client.userId === userId) {
      client.send(JSON.stringify(message));
    }
  });
  wssActor.clients.forEach(function each(client) {
    if (client.userId === userId) {
      client.send(JSON.stringify(message));
    }
  });
  wssAttendee.clients.forEach(function each(client) {
    if (client.userId === userId) {
      client.send(JSON.stringify(message));
    }
  });
  wssGuide.clients.forEach(function each(client) {
    if (client.userId === userId) {
      client.send(JSON.stringify(message));
    }
  });
}

module.exports = {
  broadcastAdmin,
  broadcastActor,
  broadcastAttendee,
  broadcastGuide,
  broadcastAll,
  sendMessageToUser
};