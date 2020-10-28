import {eventChannel, END} from 'redux-saga';
import { call, takeEvery, take, put, fork, cancel } from 'redux-saga/effects'
import { Janus } from 'janus-gateway';
import {
  JOIN_VIDEO_ROOM,
  JOIN_VIDEO_ROOM_FAILURE,
  JOIN_VIDEO_ROOM_SUCCESS,
  ATTACH_LOCAL_FEED,
  ATTACH_REMOTE_FEED,
  DETACH_REMOTE_FEED,
  RECEIVE_REMOTE_FEED,
  RECEIVE_ACTOR_FEED,
  SHOW_SNACKBAR,
  SET_LOCAL_MUTES,
  RECEIVE_CURRENT_SHOW_STATE,
  JANUS_SESSION_CREATED
} from '../actions/const';

import {
  reportError,
  reportSlowlink
} from '../actions';

let slowlinkEvents = [];

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

    return () => {
      console.log('DESTROYING SESSION');
      session.destroy();
    };
  });
}

function attachPlugin(session, partyId, userId, audioMute, videoMute, localStream) {
  return eventChannel(emitter => {
    let sfutest, myid, mypvtid, feeds=[];
    session.attach({
      plugin:'janus.plugin.videoroom',
      success:(pluginHandle) => {
        sfutest = pluginHandle;
        console.log('PLUGIN', sfutest);
        emitter({ type: 'PLUGIN_ATTACHED', sfutest});
        sfutest.send({
          message: { 
            request: "join", 
            room: partyId, 
            ptype: "publisher", 
            display: `guide:${userId}` 
          }
        });
      },
      error: error => emitter(new Error(error)),
      consentDialog: on => {
        emitter({ type: 'CONSENT_DIALOG', on })
      },
      mediaState: (media, on) => {
        Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + media);
        if(!on){
          reportError({
            type: 'JANUS_ERROR',
            message: `VideoRoom: Janus stopped receiving our ${media}`
          })();
        }
      },
      webrtcState: on => emitter({ type:'WEBRTC_STATE', on}),
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
      ondataopen: data => {
        Janus.log("The DataChannel is available!");
      },
      ondata: json => {
        Janus.log("We got data from the DataChannel!");
        let data = JSON.parse(json);
        console.log(data);
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
        switch(event) {
          case 'joined': 
            myid = msg["id"];
            mypvtid = msg["private_id"];
            Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
            publishOwnFeed(emitter, sfutest, !audioMute, !videoMute, localStream);
            if(msg["publishers"]){
              let list = msg["publishers"];
              Janus.debug("Got a list of available publishers/feeds:");
              Janus.debug(list);
              list.filter(feed => feed.display !== `guide:${userId}`).map(feed => newRemoteFeed(emitter, session, mypvtid, partyId, feed, feeds));
            }
          break;
          case 'destroyed':
            Janus.warn("The room has been destroyed!");
            // TODO: emit something when this happens
            break;
          case 'event':
            if(msg["publishers"]){
              let list = msg["publishers"];
              Janus.debug("Got a list of available publishers/feeds:");
              Janus.debug(list);
              list.filter(feed => feed.display !== `guide:${userId}`).map(feed => newRemoteFeed(emitter, session, mypvtid, partyId, feed, feeds));
            } else if(msg["leaving"]){
              // One of the publishers has gone away?
              var leaving = msg["leaving"];
              Janus.log("Publisher left: " + leaving);
              emitter({
                type: DETACH_REMOTE_FEED,
                feed: {
                  id: leaving
                }
              });
            }
            break;
        }
        if (jsep) {
          Janus.debug("Handling SDP as well...");
          Janus.debug(jsep);
          sfutest.handleRemoteJsep({jsep: jsep});
          // TODO: Add handling for if video or audio was rejected
        }
      },
      onlocalstream: stream => {
        emitter({ type: ATTACH_LOCAL_FEED, session, feed: {
          sfutest,
          stream
        }});
      },
      oncleanup: () => {
        Janus.log('CLEANUP local feed');
        emitter(END);
      }
    })

    return () => sfutest && sfutest.detach();
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
    // Publishers are sendonly
    // Add data:true here if you want to publish datachannels as well
    media,
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
          video: useVideo,
          data: true,
          bitrate: 64000
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
          type: 'OFFER_REJECTED',
          message: error.message || error
        })();
        emitter(new Error(error));
      }
    }
  })
}

function newRemoteFeed(emitter, session, mypvtid, myroom, feedInfo, feeds) {
  var id = feedInfo["id"];
  var display = feedInfo["display"];
  var audio = feedInfo["audio_codec"];
  var video = feedInfo["video_codec"];
  Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");

  let remoteFeed = null;
  session.attach(
		{
			plugin: "janus.plugin.videoroom",
			success: function(pluginHandle) {
				remoteFeed = pluginHandle;
				remoteFeed.simulcastStarted = false;
				Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
				Janus.log("  -- This is a subscriber");
				// We wait for the plugin to send us an offer
				var subscribe = { request: "join", room: myroom, ptype: "subscriber", feed: id, private_id: mypvtid };
				// In case you don't want to receive audio, video or data, even if the
				// publisher is sending them, set the 'offer_audio', 'offer_video' or
				// 'offer_data' properties to false (they're true by default), e.g.:
				// 		subscribe["offer_video"] = false;
				// For example, if the publisher is VP8 and this is Safari, let's avoid video
				if(Janus.webRTCAdapter.browserDetails.browser === "safari" &&
						(video === "vp9" || (video === "vp8" && !Janus.safariVp8))) {
					if(video)
						video = video.toUpperCase()
					Janus.warn("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
					subscribe["offer_video"] = false;
				}
				remoteFeed.videoCodec = video;
				remoteFeed.send({"message": subscribe});
			},
			error: function(error) {
        Janus.error("  -- Error attaching plugin...", error);
        // TODO: Handle this with an action
			},
			onmessage: function(msg, jsep) {
				Janus.debug(" ::: Got a message (subscriber) :::");
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
				} else if(event === "attached") {
          // Subscriber created and attached
          remoteFeed.rfid = msg["id"];
          remoteFeed.rfdisplay = msg["display"];
          Janus.log("Successfully attached to feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") in room " + msg["room"]);
          if(remoteFeed.rfdisplay.startsWith('attendee:')) {
            emitter({ type:ATTACH_REMOTE_FEED, feed: {
              remoteFeed
            }})
          }
        } else if(event === "event") {
          // Check if we got an event on a simulcast-related event from this publisher
          var substream = msg["substream"];
          var temporal = msg["temporal"];
          if(substream || temporal) {
            if(!remoteFeed.simulcastStarted) {
              console.log('SIMULCAST')
              remoteFeed.simulcastStarted = true;
              // Add some new buttons
              // addSimulcastButtons(remoteFeed.rfindex, remoteFeed.videoCodec === "vp8" || remoteFeed.videoCodec === "h264");
            }
            // We just received notice that there's been a switch, update the buttons
            // updateSimulcastButtons(remoteFeed.rfindex, substream, temporal);
          }
        } else {
          // What has just happened?
        }
				if(jsep) {
					Janus.debug("Handling SDP as well...");
					Janus.debug(jsep);
					// Answer and attach
					remoteFeed.createAnswer(
						{
							jsep: jsep,
							// Add data:true here if you want to subscribe to datachannels as well
							// (obviously only works if the publisher offered them in the first place)
							media: { audioSend: false, videoSend: false, data: true },	// We want recvonly audio/video
							success: function(jsep) {
								Janus.debug("Got SDP!");
								Janus.debug(jsep);
								remoteFeed.send({
                  message: {
                    request: "start",
                    room: myroom
                  },
                  jsep
                });
							},
							error: function(error) {
                Janus.error("WebRTC error:", error);
                reportError({
                  type: 'REMOTE_OFFER_REJECTED',
                  message: error.message || error
                })();
							}
						});
				}
			},
      ondataopen: data => {
        Janus.log("The Remote DataChannel is available!");
      },
      ondata: json => {
        Janus.log("We got data from the Remote DataChannel!");
      },
      mediaState: (media, on) => {
        Janus.log("We " + (on ? "started" : "stopped") + " receiving someone's " + media);
        if(!on){
          reportError({
            type: 'WEBRTC_ERROR',
            message: `RemoteFeed: We stopped receiving someone's ${media}`
          })();
        }
      },
			webrtcState: function(on) {
				Janus.log("Janus says this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now");
			},
      slowLink: (uplink, lost) => {
        let message = "Janus reports problems " + (uplink ? "sending" : "receiving") +
          " packets in videoRoom (" + lost + " lost packets)";
        console.log(message);
        reportSlowlink({
          type: 'REMOTE_FEED',
          display,
          uplink,
          lost
        })();
      },
			onlocalstream: function(stream) {
				// The subscriber stream is recvonly, we don't expect anything here
			},
			onremotestream: function(stream) {
        Janus.debug("Remote feed #" + remoteFeed.rfindex);
        Janus.debug(stream);
        if(remoteFeed.rfdisplay.startsWith('attendee:')) {
          emitter({
            type: RECEIVE_REMOTE_FEED,
            id: remoteFeed.rfid,
            display: remoteFeed.rfdisplay,
            stream
          });
        } else if(remoteFeed.rfdisplay.startsWith('actor:')) {
          emitter({
            type: RECEIVE_ACTOR_FEED,
            feed: {
              remoteFeed,
              stream
            }
          });
        }
			},
			oncleanup: function() {
				Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
			}
    });
  return () => remoteFeed && remoteFeed.hangup()
}

function* watchForActions(sfutest, userId) {
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
            sfutest.send({
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

function* videoRoomSaga(action) {
  let { server, partyId, userId, audioMute, videoMute, localStream } = action;

  yield call(janusInit);
  if(!Janus.isWebrtcSupported()) {
    yield put({ type: JOIN_VIDEO_ROOM_FAILURE })
    yield put({ type: SHOW_SNACKBAR, text: 'WebRTC Not supported', timeout: 5000});
    return;
  }

  try {
    let sessionChannel = yield call(createSession, server);
    let session = yield take(sessionChannel);
    console.log('SESSION', session);
    
    yield put({
      type: JANUS_SESSION_CREATED,
      session
    });

    let actionWatcher;
    try {
      let pluginChannel = yield call(attachPlugin, session, partyId, userId, audioMute, videoMute, localStream);
      while(true) {
        let event = yield take(pluginChannel);
        console.log('JANUS EVENT', event);
        if(event.type === 'PLUGIN_ATTACHED') {
          actionWatcher = yield fork(watchForActions, event.sfutest, userId);
        } else {
          yield put(event);
        }
      }
    } catch(e){
      console.error('VIDEOROOM EVENT CHANNEL ERROR', e);
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

export default function* videoRoomWatcher(){
  yield takeEvery(JOIN_VIDEO_ROOM, videoRoomSaga);

}