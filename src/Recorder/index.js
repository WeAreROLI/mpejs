import * as actions from './actions';
import rootReducer from './reducers';
import { createStore } from 'redux';
import { isRecordingStored } from './utils/recorderUtils';

/* eslint no-console: 1 */
export function createRecorder() {

  const store = createStore(rootReducer);

  function record(message, time) {
    store.dispatch(actions.recordMessage(message, time));
  }

  function play() {
    if (isRecordingStored(this.store.getState())) {
      store.dispatch(actions.startPlayback());
      return () => store.dispatch(actions.stopPlayback());
    }
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
    debug,
    record,
    play,
    dump,
  };
}
