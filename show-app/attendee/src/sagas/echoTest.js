import {eventChannel, END} from 'redux-saga';
import { call, takeEvery, take, put, fork, cancel } from 'redux-saga/effects'
import { Janus } from 'janus-gateway';
import {
  JOIN_ECHO_TEST,
  JOIN_ECHO_TEST_FAILURE,
  JOIN_ECHO_TEST_SUCCESS,
  RECEIVE_ECHO_STREAM,
  SHOW_SNACKBAR,
  RECEIVE_CURRENT_SHOW_STATE
} from '../actions/const';

import {
  reportError,
  reportSlowlink
} from '../actions';

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

function attachPlugin(session, audioMute, videoMute, localStream) {
  return eventChannel(emitter => {
    let echotest, myid, mypvtid, feeds=[];
    session.attach({
      plugin:'janus.plugin.echotest',
      success:(pluginHandle) => {
        echotest = pluginHandle;
        console.log('PLUGIN', echotest);
        emitter({ type: 'PLUGIN_ATTACHED', echotest});
        echotest.send({
          message: { 
              audio: !audioMute,
              video: !videoMute
          }
        });
        publishOwnFeed(emitter, echotest, !audioMute, !videoMute, localStream);
      },
      error: error => {
        reportError({
          type: 'JANUS_ECHO_ERROR',
          message: error.message || error
        })();
        emitter(new Error(error))
      },
      consentDialog: on => {
        emitter({ type: 'CONSENT_DIALOG', on })
      },
      iceState: function(state) {
        Janus.log("ICE state changed to " + state);
      },
      mediaState: (media, on) => {
        Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + media);
        if(!on){
          reportError({
            type: 'JANUS_ERROR',
            message: `EchoTest: Janus stopped receiving our ${media}`
          })();
        }
      },
      webrtcState: on => emitter({ type:'WEBRTC_STATE', on}),
      ondataopen: data => {
        Janus.log("The DataChannel is available!");
      },
      ondata: json => {
        Janus.log("We got data from the DataChannel!");
        let data = JSON.parse(json);
        console.log(data);
      },
      slowLink: (uplink, lost) => {
        let message = "Janus reports problems " + (uplink ? "sending" : "receiving") +
          " packets in videoRoom (" + lost + " lost packets)";
        console.log(message);
        reportSlowlink({
          type: 'VIDEO_ROOM',
          uplink,
          lost
        })();
      },
      onmessage: (msg, jsep) => {
        Janus.debug(" ::: Got a message (publisher) :::");
        Janus.debug(msg);
        var event = msg["videoroom"];
        Janus.debug("Event: " + event);
				if(msg["error"]) {
          Janus.error(msg["error"]);
          reportError({
            type: 'JANUS_ERROR',
            errorcode: msg['error_code'],
            message: msg["error"]
          })();
				} 
        if (jsep) {
          Janus.debug("Handling SDP as well...");
          Janus.debug(jsep);
          echotest.handleRemoteJsep({jsep: jsep});
          // TODO: Add handling for if video or audio was rejected
        }
      },
      onlocalstream: stream => {
        Janus.debug(" ::: Got a local stream :::");
        Janus.debug(stream);
        emitter({
          type:JOIN_ECHO_TEST_SUCCESS,
          echotest,
          stream
        })
      },
      onremotestream: stream => {
        emitter({
          type:RECEIVE_ECHO_STREAM,
          stream
        })
      },
      oncleanup: () => {
        Janus.log('CLEANUP local feed');
        emitter(END);
      }
    })

    return () => echotest && echotest.detach();
  })
}

function publishOwnFeed(emitter, pluginHandle, useAudio, useVideo, localStream) {
  let media = {
    audioRecv: false,
    videoRecv: false,
    data: true
  };
  if(!localStream){
    media.audioSend = false;
    media.videoSend = false;
  }
	pluginHandle.createOffer({
    stream: localStream,	
    // If you want to test simulcasting (Chrome and Firefox only), then
    // pass a ?simulcast=true when opening this demo page: it will turn
    // the following 'simulcast' property to pass to janus.js to true
    simulcast: false,
    simulcast2: false,
    success: function(jsep) {
      Janus.debug("Got publisher SDP!");
      Janus.debug(jsep);
      // You can force a specific codec to use when publishing by using the
      // audiocodec and videocodec properties, for instance:
      // 		publish["audiocodec"] = "opus"
      // to force Opus as the audio codec to use, or:
      // 		publish["videocodec"] = "vp9"
      // to force VP9 as the videocodec to use. In both case, though, forcing
      // a codec will only work if: (1) the codec is actually in the SDP (and
      // so the browser supports it), and (2) the codec is in the list of
      // allowed codecs in a room. With respect to the point (2) above,
      // refer to the text in janus.plugin.videoroom.jcfg for more details
      pluginHandle.send({
        message:{
          request: "configure",
          audio: useAudio,
          video: useVideo ,
          data: true
        },
        jsep
      });
    },
    error: function(error) {
      Janus.error("WebRTC error:", error);
      if (useAudio) {
        publishOwnFeed(emitter, pluginHandle, false, useVideo);
      } else {
        reportError({
          type: 'ECHO_OFFER_REJECTED',
          message: error.message || error
        })();
        emitter(new Error(error));
      }
    }
  })
}


function* watchForActions(echotest, userId) {
  try {
    while (true) {
      let action = yield take('*')
      switch(action.type) {
        case RECEIVE_CURRENT_SHOW_STATE:
          let user;
          action.body.currentShow.parties.map(party => {
            party.attendees.map(attendee => {
              if(attendee._id === userId){
                user = attendee;
              }
            });
          });
          if(user) {
            echotest.send({
              message: {
                request: 'configure',
                audio: !user.isAudioMuted,
                video: !user.isVideoMuted
              }
            })
          }
          break;
      }
    }
  } catch(e) {
    console.error('JANUS ACTION ERROR', e);
  }
}

function* echoTestSaga(action) {
  let { server, userId, audioMute, videoMute, localStream } = action;

  yield call(janusInit);
  if(!Janus.isWebrtcSupported()) {
    yield put({ type: JOIN_ECHO_TEST_FAILURE })
    yield put({ type: SHOW_SNACKBAR, text: 'WebRTC Not supported', timeout: 5000});
    return;
  }

  try {
    let sessionChannel = yield call(createSession, server);
    let session = yield take(sessionChannel);
    console.log('SESSION', session);

    let actionWatcher;
    try {
      let pluginChannel = yield call(attachPlugin, session, audioMute, videoMute, localStream);
      while(true) {
        let event = yield take(pluginChannel);
        console.log('JANUS EVENT', event);
        if(event.type === 'PLUGIN_ATTACHED') {
          actionWatcher = yield fork(watchForActions, event.echotest, userId);
        } else {
          yield put(event);
        }
      }
    } catch(e){
      console.error('ECHOTEST EVENT CHANNEL ERROR', e);
      yield cancel(actionWatcher);
    } finally {
      console.log('CLOSING SESSION');
      sessionChannel.close();
      yield cancel(actionWatcher);
    }

  } catch(e){
    console.error('JANUS ERROR', e);
  }
}

export default function* echoTestWatcher(){
  yield takeEvery(JOIN_ECHO_TEST, echoTestSaga);

}