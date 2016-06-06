import * as actions from './actions';
import rootReducer from './reducers';
import { createStore } from 'redux';

/* eslint no-console: 1 */
export function createRecorder() {

  const store = createStore(rootReducer);

  function record(message, time) {
    store.dispatch(actions.recordMessage(message, time));
  }

  function dump() {
    return store.getState().recordedMessages.sort((a, b) => a.time > b.time);
  }

  /* eslint-disable no-console */
  function debug() {
    // Implement as redux middleware.
  }
  /* eslint-enable no-console */

  return {
    record,
    dump,
    debug,
  };
}
