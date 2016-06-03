import * as actions from './actions';
import rootReducer from './reducers';
import { createStore } from 'redux';
import { isRecordingStored } from './utils/recorderStateUtils';

/* eslint no-console: 1 */
export function createRecorder() {

  const store = createStore(rootReducer);

  function processMessage(message, time = performance.now()) {
    store.dispatch(actions.processMessage(message, time));
  }

  function record() {
    store.dispatch(actions.startRecording());
    return () => store.dispatch(actions.stopRecording());
  }

  function play() {
    if (isRecordingStored(this.store.getState())) {
      store.dispatch(actions.startPlayback());
      return () => store.dispatch(actions.stopPlayback());
    }
  }

  function dump() {
    return store.getState().recording.recordedMessages;
  }

  /* eslint-disable no-console */
  function debug() {
    // Implement as redux middleware.
  }
  /* eslint-enable no-console */

  return {
    processMessage,
    debug,
    record,
    play,
    dump,
  };
}
