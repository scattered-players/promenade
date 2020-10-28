import { CONTACT_SHOW_SERVICE } from './const';

import config from 'config';

import lostContactWithShowService from './lostContactWithShowService';
import contactShowServiceSuccess from './contactShowServiceSuccess';
import showSnackbar from './showSnackbar';

function action() {
  return [
    { type: CONTACT_SHOW_SERVICE },
    function connectWebSocket(dispatch) {
      let socket = new WebSocket(`${config.SOCKET_ADDRESS}`);

      socket.onopen = function() {
        console.log('Connection Established!');
        dispatch(contactShowServiceSuccess());
        dispatch(showSnackbar('Websocket connection established!'));
      }
  
      socket.onmessage = function(e) {
        let message = JSON.parse(e.data);
        // let { type, body } = message;
        dispatch(message);
      };
  
      socket.onerror = function(e) {
        console.error('UHOH', e);
        try {
          socket.close();
        } catch(e) {
          onClose();
        }
      };
  
      socket.onclose = function onClose() {
        dispatch(lostContactWithShowService());
        console.log('connection closed, retrying in 1 second...');
        dispatch(showSnackbar('connection closed, retrying in 1 second...', 500));
        setTimeout(() => {
          dispatch({ type: CONTACT_SHOW_SERVICE });
          dispatch(connectWebSocket);
        }, 1000);
      };
    }
  ];
}

export default action;
