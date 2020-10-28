import config from 'config';

function action(error) {
  return async () => {
    console.log('REPORTING ERROR', error);
    try{
      let response = await fetch(`${ config.SERVICE_HOST }/users/reportError`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({error}),
        credentials: 'include'
      });
      if (!response.ok) {
        throw response;
      }
      console.log('SUCCESSFULLY REPORTED THE ERROR', error);
    } catch(e) {
      console.error('FAILED TO REPORT THE ERROR', error);
      console.error('IT WAS BECAUSE', e);
    }
  };
}

window.addEventListener('beforeunload', function(event) {
  action({
    type:'UNLOAD',
    message: 'UNLOADED!'
  })
});

export default action;
