if(location.protocol === 'http:' && location.hostname !== 'localhost'){
  location.href = `https://${location.host}${location.pathname}${location.search}`;
}

import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import App from './containers/App';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

ReactDOM.render(
  <AppContainer>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <App />
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
            <NextApp />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}

