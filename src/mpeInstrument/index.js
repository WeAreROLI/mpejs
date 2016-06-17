import { createStore, applyMiddleware } from 'redux';
import { generateMidiActions } from './actions';
import { logger } from './middlewares';
import rootReducer from './reducers';

/**
 * Creates an Object representing an instrument supporting MPE.
 *
 * @kind function
 * @example
 * import { mpeInstrument } from 'mpe';
 *
 * // Assign `instrument` as an Object modelling an MPE instrument
 * const instrument = mpeInstrument();
 *
 * // 1) Request MIDI device access from the Web MIDI API
 * // 2) Take the first `MidiInput` from the available MIDI `inputMap`
 * // 3) Send input messages from this input to `instrument`
 * navigator.requestMIDIAccess().then({ inputMap } => {
 *   const midiInput = inputMap.values().next();
 *   midiInput.addEventListener(
 *     'midimessage',
 *     { data } => instrument.processMidiMessage(data)
 *   );
 * });
 * @param {Object} options Configuration options.
 * @param {Boolean} [options.log=false] When `true` logs current active notes to
 * the console.
 * @return {Object} An Object representing an MPE compatible instrument.
 *
 */
export function mpeInstrument(options) {
  const store = options && options.log ?
    createStore(rootReducer, applyMiddleware(logger)) :
    createStore(rootReducer);
  /**
   * Reads MIDI message data and updates the instrument state accordingly.
   *
   * Processed MIDI messages trigger changes or modulations in `activeNotes`. On
   * receiving a MIDI message, `processMidiMessage` decides which notes on which
   * channels (if any) should be affected by that message, and applies the
   * changes.
   *
   * _MPE implementation details:_
   *
   * _Handles note messages on channels 1–16 as a single MPE zone. Multi-zone
   * layouts are not currently supported._
   *
   * _Channel 1 only implements "zone master channel" behaviour in the case of all
   * notes off messages. Other messages types on channel 1 are handled as standard
   * channel scope messages._
   *
   * @example
   * import { mpeInstrument } from 'mpe';
   * const instrument = mpeInstrument();
   *
   * // Trigger a note on, channel 2, middle C, max velocity
   * instrument.processMidiMessage([145, 60, 127]);
   * @memberof mpeInstrument
   * @instance
   * @param {Uint8Array} midiMessage A MIDI message.
   * @return {undefined}
   */
  function processMidiMessage(midiMessage) {
    const actions = generateMidiActions(midiMessage, store.getState);
    actions.forEach(store.dispatch);
  }

  /**
   * Lists current active notes.
   *
   * @example
   * import { mpeInstrument } from 'mpe';
   * const instrument = mpeInstrument();
   *
   * instrument.activeNotes();
   * // => []
   *
   * instrument.processMidiMessage([145, 60, 127]);
   * instrument.activeNotes();
   * // => [ { noteNumber: 60,
   * //        channel: 2,
   * //        noteOnVelocity: 127,
   * //        pitchBend: 8192,
   * //        timbre: 8192,
   * //        pressure: 0 } ]
   *
   * @memberof mpeInstrument
   * @instance
   * @return {Array} An array of note objects representing active notes.
   * @method activeNotes
   */
  function activeNotes() {
    return store.getState().activeNotes;
  }

  /**
   * Subscribe to changes to the MPE instrument’s active notes.
   *
   * All changes or modulations affecting the instrument’s active notes trigger
   * the provided callback. The new value of `activeNotes` is passed to the
   * provided callback as an argument.
   *
   * @example
   * import { mpeInstrument } from 'mpe';
   * const instrument = mpeInstrument();
   *
   * // Print new `activeNotes` values to the console
   * instrument.subscribe(console.log);
   * @memberof mpeInstrument
   * @instance
   * @param {function} callback A callback to be updated with current active
   * notes in response to any note changes. For example, the callback is
   * triggered when a new active note is added or an existing one is modulated.
   * @return {function} A function to unsubscribe the given callback.
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
