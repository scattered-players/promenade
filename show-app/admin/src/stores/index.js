import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import reducers from '../reducers';

function reduxStore(initialState) {
  const composeEnhancers =
    (typeof window === 'object' && window.devToolsExtension) ?
      window.devToolsExtension({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(multi),
    applyMiddleware(thunk)
  );
  const store = createStore(reducers, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // We need to require for hot reloading to work properly.
      const nextReducer = require('../reducers');  // eslint-disable-line global-require

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default reduxStore;
