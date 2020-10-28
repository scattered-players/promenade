var reducer = require('../../src/reducers/snackbar');

describe('snackbar', () => {

  it('should not change the passed state', (done) => {

    const state = Object.freeze({});
    reducer(state, {type: 'INVALID'});

    done();
  });
});
