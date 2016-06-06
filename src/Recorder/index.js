import * as actions from './actions';
import rootReducer from './reducers';
import { createStore } from 'redux';

/* eslint no-console: 1 */
/**
 * @summary Creates a Recorder instance.
 *
 * @returns {Recorder} A Recorder instance. Stores messages and times received
 * to the `record` method.
 */
export function createRecorder() {

  const store = createStore(rootReducer);

  /**
   * Adds received messages to a time indexed store. Supports all standard
   * JavaScript data types.
   *
   * @param  {any} message  A message to store.
   * @param  {Number} time  The time to index the received message against.
   * @returns {undefined}
   */
  function record(message, time) {
    store.dispatch(actions.recordMessage(message, time));
  }

  /**
   * Returns all messages stored by the `Recorder` instance. Entries are ordered
   * by ascending time values.
   *
   * @return {Array} An array of stored messages.
   */
  function dump() {
    return store.getState().recordedMessages.sort((a, b) => a.time > b.time);
  }

  /* eslint-disable no-console */
  /**
   * Prints changes to the developer console.
   *
   * @return {undefined}
   */
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
