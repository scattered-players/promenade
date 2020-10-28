import config from 'config';

function action(event) {
  return async () => {
    try{
      let response = await fetch(`${ config.SERVICE_HOST }/users/reportSlowlink`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({event}),
        credentials: 'include'
      });
      if (!response.ok) {
        throw response;
      }
    } catch(e) {
      console.error('Failed to report slowlink: ', e);
    }
  };
}

export default action;
