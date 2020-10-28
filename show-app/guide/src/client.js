if(location.protocol === 'http:' && location.hostname !== 'localhost'){
  location.href = `https://${location.host}${location.pathname}${location.search}`;
}

import 'regenerator-runtime/runtime';
import 'audioworklet-polyfill';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
// import './util/autoplay-hack';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import App from './containers/App';
import configureStore from './stores';

import {
  MUI_THEME
} from 'custom/config.json';

const store = configureStore();

const theme = createMuiTheme({
  palette: {
    type: MUI_THEME
  },
});

ReactDOM.render(
  <AppContainer>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Provider store={store}>
          <App />
        </Provider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default; // eslint-disable-line global-require

    ReactDOM.render(
      <AppContainer>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Provider store={store}>
              <NextApp />
            </Provider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}

