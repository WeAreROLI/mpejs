import * as actions from './actions';
import rootReducer from './reducers';
import { logger } from './middlewares';
import { createStore, applyMiddleware } from 'redux';

/**
 * Creates a recorder instance.
 *
 * @param {Object} options Configuration options.
 * @param {Boolean} [options.log=false] When `true` logs changes to the console.
 * @returns {recorder} A `recorder` instance. Stores messages and times received
 * to the `record` method.
 */
export function recorder(options) {

  const store = options && options.log ?
    createStore(rootReducer, applyMiddleware(logger)) :
    createStore(rootReducer);

  /**
   * Adds received messages to a time indexed store. Supports all standard
   * JavaScript data types.
   *
   * @memberof recorder
   * @instance
   * @param  {any} message A message to store.
   * @param  {Number} time The time to index the received message against.
   * @return {undefined}
   */
  function record(message, time) {
    store.dispatch(actions.recordMessage(message, time));
  }

  /**
   * Returns all messages stored by the `recorder` instance. Entries are ordered
   * by ascending time values.
   *
   * @memberof recorder
   * @instance
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
