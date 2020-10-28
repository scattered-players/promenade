import React from 'react';
import config from 'config';

import { LOGIN } from './const';

import loginFailure from './loginFailure';
import loginSuccess from './loginSuccess';
import showSnackbar from './showSnackbar';
import wereBlocked from './wereBlocked';

function action() {
  return [
    { type: LOGIN },
    async dispatch => {
      try{
        let requestBody = {};
        var urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('token');
        if(token) {
          console.log('GOIN', token);
          requestBody.token = token;
        }
        let response = await fetch(`${ config.SERVICE_HOST }/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          credentials: 'include'
        });
        console.log(response);
        if (!response.ok) {
          if(response.status === 403){
            return dispatch(wereBlocked());
          } else {
            throw response;
          }
        }

        let result = await response.json();
        if(result.kind !== 'Guide') {
          return location.replace(config[result.kind.toUpperCase() + '_URL'] + location.search);
        }

        const dontReload = (urlParams.get('standalone') === 'true');

        if (token && !dontReload) {
          let newSearch = '';
          let isFirst = true;
          for (const [key, value] of urlParams) {
            if(key !== 'token') {
              newSearch += isFirst ? '?' : '&';
              isFirst = false;
              newSearch += `${key}=${value}`;
            }
          }
          return location.replace(`${location.protocol}//${location.host}${location.pathname}${newSearch}`);
        }

        dispatch(loginSuccess(result));
        dispatch(showSnackbar(<React.Fragment>Logged in!</React.Fragment>));
      } catch(e) {
        dispatch(loginFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error logging in: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
