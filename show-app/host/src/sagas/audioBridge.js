import {eventChannel, END} from 'redux-saga';
import { call, takeEvery, take, put } from 'redux-saga/effects'
import { Janus } from 'janus-gateway';
import {
  JOIN_AUDIO_BRIDGE,
  JOIN_AUDIO_BRIDGE_FAILURE,
  JOIN_AUDIO_BRIDGE_SUCCESS,
  RECEIVE_AUDIO_BRIDGE_FEED,
  SHOW_SNACKBAR
} from '../actions/const';

function janusInit() {
  return new Promise(resolve => Janus.init({ debug: "all", callback: resolve}))
}

function createSession(server) {
  return eventChannel(emitter => {
    let session = new Janus({
      server,
      success:() => emitter(session),
      error: e => emitter(new Error(e)),
      destroyed: () => emitter(END)
    });

    return session.destroy;
  });
}

function attachPlugin(session, showId, userId) {
  return eventChannel(emitter => {
    let mixertest, myid, webrtcUp = false;
    session.attach({
      plugin:'janus.plugin.audiobridge',
      success:(pluginHandle) => {
        mixertest = pluginHandle;
        Janus.log("Plugin attached! (" + mixertest.getPlugin() + ", id=" + mixertest.getId() + ")");
        pluginHandle.send({
          message: { 
            request: "join", 
            room: showId, 
            display: `attendee:${userId}` 
          }
        });
      },
      error: error => emitter(new Error(error)),
      consentDialog: on => emitter({ type: 'CONSENT_DIALOG', on }),
      mediaState: (media, on) => Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + media),
      webrtcState: on => emitter({ type:'WEBRTC_STATE', on}),
      onmessage: (msg, jsep) => {
        Janus.debug(" ::: Got a message :::");
        Janus.debug(msg);
        var event = msg["audiobridge"];
        Janus.debug("Event: " + event);
        switch(event) {
          case 'joined': 
            if(msg["id"]) {
              myid = msg["id"];
              Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
              if(!webrtcUp) {
                webrtcUp = true;
                // Publish our stream
                mixertest.createOffer(
                  {
                    media: { video: false },	// This is an audio only room
                    success: function(jsep) {
                      Janus.debug("Got SDP!");
                      Janus.debug(jsep);
                      mixertest.send({
                        message: {
                          request: "configure",
                          muted: true 
                        },
                        jsep
                      });
                    },
                    error: function(error) {
                      Janus.error("WebRTC error:", error);
                      bootbox.alert("WebRTC error... " + JSON.stringify(error));
                    }
                  });
              }
            }
            if(msg["participants"]){
              let list = msg["participants"];
              Janus.debug("Got a list of participants:");
              Janus.debug(list);
            }
          break;
          case 'destroyed':
            Janus.warn("The room has been destroyed!");
            // TODO: emit something when this happens
            break;
          case 'event':
            if(msg["participants"]){
              let list = msg["participants"];
              Janus.debug("Got a list of participants:");
              Janus.debug(list);
            } else if(msg["leaving"]){
              var leaving = msg["leaving"];
              Janus.log("Participant left: " + leaving);
            }
            break;
        }
        if (jsep) {
          Janus.debug("Handling SDP as well...");
          Janus.debug(jsep);
          mixertest.handleRemoteJsep({jsep});
          // TODO: Add handling for if video or audio was rejected
        }
      },
      onlocalstream: stream => {
      },
      onremotestream: function(stream) {
        emitter({
          type:RECEIVE_AUDIO_BRIDGE_FEED,
          feed: {
            mixertest,
            stream
          }
        })
      },
      oncleanup: () => {
        Janus.log('CLEANUP local feed');
        emitter(END);
      }
    })

    return () => mixertest && mixertest.detach();
  })
}

function* audioBridgeSaga(action) {
  let { server, showId, userId } = action;

  yield call(janusInit);
  if(!Janus.isWebrtcSupported()) {
    yield put({ type: JOIN_AUDIO_BRIDGE_FAILURE })
    yield put({ type: SHOW_SNACKBAR, text: 'WebRTC Not supported', timeout: 5000});
    return;
  }

  try {
    let sessionChannel = yield call(createSession, server);
    let session = yield take(sessionChannel);
    console.log('SESSION', session);

    try {
      let pluginChannel = yield call(attachPlugin, session, showId, userId);
      while(true) {
        let event = yield take(pluginChannel);
        console.log('JANUS EVENT', event);
        yield put(event);
      }
    } catch(e){
      console.error('AUDIOBRIDGE EVENT CHANNEL ERROR', e);
    } finally {
      console.log('CLOSING SESSION');
      sessionChannel.close();
    }

  } catch(e){
    console.error('JANUS ERROR', e);
  }
}

export default function* audioBridgeWatcher(){
  yield takeEvery(JOIN_AUDIO_BRIDGE, audioBridgeSaga);

}