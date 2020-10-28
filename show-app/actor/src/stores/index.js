import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import createSagaMiddleware from 'redux-saga'
import reducers from '../reducers';
import rootSaga from '../sagas';

function reduxStore(initialState) {
  const composeEnhancers =
    (typeof window === 'object' && window.devToolsExtension) ?
      window.devToolsExtension({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose;

  const sagaMiddleware = createSagaMiddleware()
  const enhancer = composeEnhancers(
    applyMiddleware(multi),
    applyMiddleware(thunk),
    applyMiddleware(sagaMiddleware)
  );
  const store = createStore(reducers, initialState, enhancer);
  sagaMiddleware.run(rootSaga);

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