const fetch = require('node-fetch');
const { v4:uuid } = require('uuid');
const { JANUS_ADMIN_KEY } = require('../secrets/credentials')
const { SHOW_DOMAIN_NAME, JANUS_MODE } = require('../secrets/promenade-config.json')

async function janusInit(subdomain){
  let response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'create',
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  let result = await response.json()
  console.log('INIT RESULT', result);
  return result.data.id
}

async function janusAttach(subdomain, sessionId, pluginName){
  let response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'attach',
      plugin: pluginName,
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  let result = await response.json()
  console.log('ATTACH RESULT', result);
  return result.data.id
}

async function createVideoRoom(subdomain, roomId){
  let sessionId = await janusInit(subdomain);
  let pluginHandle = await janusAttach(subdomain, sessionId, 'janus.plugin.videoroom');

  response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}/${pluginHandle}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'message',
      body: {
        request : "create",
        admin_key: JANUS_ADMIN_KEY,
        publishers: 20,
        room : roomId,
        permanent : false,
        is_private : true,
        // videocodec: 'h264'
      },
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  result = await response.json()
  console.log('CREATE ROOM RESULT', result);
}

async function destroyVideoRoom(subdomain, roomId){
  let sessionId = await janusInit(subdomain);
  let pluginHandle = await janusAttach(subdomain, sessionId, 'janus.plugin.videoroom');

  response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}/${pluginHandle}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'message',
      body: {
        request : "destroy",
        admin_key: JANUS_ADMIN_KEY,
        room : roomId,
        permanent : false
      },
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  result = await response.json()
  console.log('DESTROY ROOM RESULT', result);
}

async function listUsers(subdomain, roomId){
  let sessionId = await janusInit(subdomain);
  let pluginHandle = await janusAttach(subdomain, sessionId, 'janus.plugin.videoroom');

  response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}/${pluginHandle}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'message',
      body: {
        request : "listparticipants",
        admin_key: JANUS_ADMIN_KEY,
        room : roomId
      },
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  result = await response.json()
  console.log('LIST USER RESULT', JSON.stringify(result, null, 4));
  return result;
}

async function kickUser(subdomain, roomId, janusUserId){
  let sessionId = await janusInit(subdomain);
  let pluginHandle = await janusAttach(subdomain, sessionId, 'janus.plugin.videoroom');

  response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}/${pluginHandle}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'message',
      body: {
        request : "kick",
        admin_key: JANUS_ADMIN_KEY,
        room : roomId,
        id: janusUserId
      },
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  result = await response.json()
  console.log('KICK USER RESULT', result);
}

async function createAudioBridge(subdomain, bridgeId){
  let sessionId = await janusInit(subdomain);
  let pluginHandle = await janusAttach(subdomain, sessionId, 'janus.plugin.audiobridge');

  response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}/${pluginHandle}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'message',
      body: {
        request : "create",
        admin_key: JANUS_ADMIN_KEY,
        room : bridgeId,
        permanent : false,
        is_private : true,
      },
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  result = await response.json()
  console.log('CREATE BRIDGE RESULT', result);
}

async function destroyAudioBridge(subdomain, bridgeId){
  let sessionId = await janusInit(subdomain);
  let pluginHandle = await janusAttach(subdomain, sessionId, 'janus.plugin.audiobridge');

  response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}/${pluginHandle}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'message',
      body: {
        request : "destroy",
        admin_key: JANUS_ADMIN_KEY,
        room : bridgeId,
        permanent : false
      },
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  result = await response.json()
  console.log('DESTROY BRIDGE RESULT', result);
}

async function createStream(subdomain, streamId){
  let sessionId = await janusInit(subdomain);
  let pluginHandle = await janusAttach(subdomain, sessionId, 'janus.plugin.streaming');

  response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}/${pluginHandle}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'message',
      body: {
        request : "create",
        admin_key: JANUS_ADMIN_KEY,
        id : streamId,
        description:'Shattered Ending',
        permanent : false,
        is_private : false,
        type: 'rtp',
        audio: true,
        video: true,
        audioport: 6002,
        audiopt: 97,
        audiortpmap: 'opus/48000/2',
        videoport: 6004,
        // videopt: 96,
        // videortpmap: 'VP8/90000',
        videopt: 126,
        videortpmap: 'H264/90000',
        videofmtp: 'profile-level-id=42e01f;packetization-mode=1',
        videobufferkf: true
      },
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  result = await response.json()
  console.log('CREATE STREAM RESULT', result);
}

async function destroyStream(subdomain, streamId){
  let sessionId = await janusInit(subdomain);
  let pluginHandle = await janusAttach(subdomain, sessionId, 'janus.plugin.streaming');

  response = await fetch(`https://${subdomain}.${SHOW_DOMAIN_NAME}:8089/janus/${sessionId}/${pluginHandle}`, {
    method: 'POST',
    body: JSON.stringify({
      janus:'message',
      body: {
        request : "destroy",
        admin_key: JANUS_ADMIN_KEY,
        id : streamId,
        permanent : false
      },
      transaction: '' + Math.floor(Math.random()*1000000)
    })
  });
  result = await response.json()
  console.log('DESTROY STREAM RESULT', result);
}

async function startShow(show){
  await Promise.all([
    createStream('janus', show._id)
  ].concat(show.parties.map(async party => {
    if(JANUS_MODE !== 'SINGLE'){
      await createVideoRoom(party.janusId, party._id)
    }
    await createVideoRoom('janus', party._id)
  })))
}

async function stopShow(show){
  await Promise.all([
    destroyStream('janus', show._id)
  ].concat(show.parties.map(async party => {
    if(JANUS_MODE !== 'SINGLE'){
      await destroyVideoRoom(party.janusId, party._id)
    }
    await destroyVideoRoom('janus', party._id)
  })))
}

module.exports = {
  createVideoRoom,
  createAudioBridge,
  createStream,
  destroyVideoRoom,
  destroyAudioBridge,
  destroyStream,
  kickUser,
  listUsers,
  startShow,
  stopShow
}