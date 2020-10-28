import { eventChannel, END } from 'redux-saga';
import { call, takeEvery, take, put } from 'redux-saga/effects'
import { Janus } from 'janus-gateway';
import {
  JOIN_AUDIO_BRIDGE,
  JOIN_AUDIO_BRIDGE_FAILURE,
  JOIN_AUDIO_BRIDGE_SUCCESS,
  RECEIVE_AUDIO_BRIDGE_FEED,
  SHOW_SNACKBAR,
  JOIN_STREAM,
  STREAM_FAILURE,
  SET_STREAMING_STREAM
} from '../actions/const';

import {
  reportError,
  reportSlowlink
} from '../actions';

function janusInit() {
  return new Promise(resolve => Janus.init({ debug: "all", callback: resolve }))
}

function createSession(server) {
  return eventChannel(emitter => {
    let session = new Janus({
      server,
      success: () => emitter(session),
      error: e => emitter(new Error(e)),
      destroyed: () => emitter(END)
    });

    return session.destroy;
  });
}

function attachPlugin(session, showId) {
  return eventChannel(emitter => {
    let streaming, myid, webrtcUp = false;
    session.attach({
      plugin: 'janus.plugin.streaming',
      success: (pluginHandle) => {
        streaming = pluginHandle;
        Janus.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
        pluginHandle.send({
          message: {
            request: "watch",
            id: showId
          }
        });
      },
      error: error => {
        reportError({
          type: 'JANUS_STREAM_ERROR',
          message: error.message || error
        })();
        emitter(new Error(error))
      },
      consentDialog: on => emitter({ type: 'CONSENT_DIALOG', on }),
      mediaState: (media, on) => {
        Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + media);
        if(!on){
          reportError({
            type: 'JANUS_ERROR',
            message: `Streaming: Janus stopped receiving our ${media}`
          })();
        }
      },
      webrtcState: on => emitter({ type: 'WEBRTC_STATE', on }),
      slowLink: (uplink, lost) => {
        let message = "Janus reports problems " + (uplink ? "sending" : "receiving") +
          " packets in streaming (" + lost + " lost packets)";
        console.log(message);
        reportSlowlink({
          type: 'STREAMING',
          uplink,
          lost
        })();
      },
      onmessage: (msg, jsep) => {
        Janus.debug(" ::: Got a message :::");
        Janus.debug(msg);
        var event = msg["streaming"];
        Janus.debug("Event: " + event);

				if(msg["error"]) {
          Janus.error(msg["error"]);
          reportError({
            type: 'JANUS_ERROR',
            errorcode: msg['error_code'],
            message: msg["error"]
          })();
				} 
        if (jsep !== undefined && jsep !== null) {
          Janus.debug("Handling SDP as well...");
          Janus.debug(jsep);
          // Offer from the plugin, let's answer
          streaming.createAnswer(
            {
              jsep: jsep,
              // We want recvonly audio/video and, if negotiated, datachannels
              media: { audioSend: false, videoSend: false, data: true },
              success: function (jsep) {
                Janus.debug("Got SDP!");
                Janus.debug(jsep);
                streaming.send({
                  message: {
                    request: "start"
                  },
                  jsep
                });
              },
              error: function (error) {
                Janus.error("WebRTC error:", error);
                reportError({
                  type: 'STREAM_ANSWER_REJECTED',
                  message: error.message || error
                })();
              }
            });
        }
      },
      onremotestream: function (stream) {
        emitter({
          type: SET_STREAMING_STREAM,
          feed: {
            streaming,
            stream
          }
        })
      },
      oncleanup: () => {
        Janus.log('CLEANUP local feed');
        emitter(END);
      }
    })

    return () => streaming && streaming.detach();
  })
}

function* streamingSaga(action) {
  let { server, showId } = action;

  yield call(janusInit);
  if (!Janus.isWebrtcSupported()) {
    yield put({ type: STREAM_FAILURE })
    yield put({ type: SHOW_SNACKBAR, text: 'WebRTC Not supported', timeout: 5000 });
    return;
  }

  try {
    let sessionChannel = yield call(createSession, server);
    let session = yield take(sessionChannel);
    console.log('SESSION', session);

    try {
      let pluginChannel = yield call(attachPlugin, session, showId);
      while (true) {
        let event = yield take(pluginChannel);
        console.log('JANUS EVENT', event);
        yield put(event);
      }
    } catch (e) {
      console.error('STREAM EVENT CHANNEL ERROR', e);
    } finally {
      console.log('CLOSING SESSION');
      sessionChannel.close();
    }

  } catch (e) {
    console.error('JANUS ERROR', e);
  }
}

export default function* streamingWatcher() {
  yield takeEvery(JOIN_STREAM, streamingSaga);

}