import { createStore, applyMiddleware } from 'redux';
import { generateMidiActions } from './actions';
import { logger } from './middlewares';
import rootReducer from './reducers';

/**
 * Creates an MpeInstrument instance.
 *
 * MPE MIDI implementation details:
 *
 * Handles note messages on channels 1–16 as a single MPE zone.
 *
 * Channel 1 only implements "zone master channel" behaviour in the case of
 * all notes off messages. Other messages types on channel 1 as standard
 * channel scope messages.
 *
 * @param {Object} options Configuration options.
 * @param {Boolean} [options.log=false] When true, logs active notes to the
 * console.
 * @return {MpeInstrument} An MPE MIDI instrument instance.
 */
export default function MpeInstrument(options = { log: false }) /** @lends MpeInstrument.prototype */ {
  const store = options.log ?
    createStore(rootReducer, applyMiddleware(logger)) :
    createStore(rootReducer);
  /**
   * Reads MIDI message data and updates the instrument state accordingly.
   *
   * Processed MIDI messages trigger changes or modulations in `activeNotes`.
   *
   * @param {Uint8Array} midiMessage A MIDI message.
   * @return {undefined}
   * @method processMidiMessage
   */
  function processMidiMessage(midiMessage) {
    const actions = generateMidiActions(midiMessage, store.getState);
    actions.forEach(store.dispatch);
  }

  /**
   * Lists current active notes.
   *
   * @returns {Array} An array of note objects representing active notes.
   */
  function activeNotes() {
    return store.getState().activeNotes;
  }

  /**
   * Subscribe to changes to the instrument's active notes.
   *
   * All changes or modulations affecting the instrument's active notes trigger
   * the provided callback, and pass the new state as the function argument.
   *
   * @param {function} callback A callback to be updated will all current active
   * notes in response to any note changes.
   * @returns {function} A function to unsubscribe the given callback.
   */
  function subscribe(callback) {
    let currentActiveNotes = this.activeNotes();
    return store.subscribe(() => {
      let previousActiveNotes = currentActiveNotes;
      currentActiveNotes = this.activeNotes();
      if (currentActiveNotes !== previousActiveNotes) {
        callback(this.activeNotes());
      }
    });
  }

  return {
    processMidiMessage,
    activeNotes,
    subscribe,
  };
}
