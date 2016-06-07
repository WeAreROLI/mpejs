import * as actions from './actions';
import rootReducer from './reducers';
import { logger } from './middlewares';
import { createStore, applyMiddleware } from 'redux';

/**
 * @summary Creates a Recorder instance.
 *
 * @param {Boolean} [options={ log: false }] Options to configure the recorder.
 * @returns {Recorder} A Recorder instance. Stores messages and times received
 * to the `record` method.
 */
export function createRecorder(options = { log: false }) {

  const store = options.log ?
    createStore(rootReducer, applyMiddleware(logger)) :
    createStore(rootReducer);

  /**
   * Adds received messages to a time indexed store. Supports all standard
   * JavaScript data types.
   *
   * @param  {any} message A message to store.
   * @param  {Number} time The time to index the received message against.
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

  return {
    record,
    dump,
  };
}
