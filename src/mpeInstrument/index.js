import { createStore, applyMiddleware } from 'redux';
import { generateMidiActions } from './actions';
import { logger, normalizer } from './middlewares';
import rootReducer from './reducers';

const ALL_NOTES_OFF = new Uint8Array([0xb0, 123, 0]);

/**
 * Creates a new instance for processing MPE data
 *
 * @kind function
 * @example
 * import mpeInstrument from 'mpe';
 *
 * // Define `instrument` as an instance of `mpeInstrument`
 * const instrument = mpeInstrument();
 *
 * // 1) Request MIDI device access from the Web MIDI API
 * // 2) Take the first `MidiInput` from the available MIDI `inputMap`
 * // 3) Send input messages from this input to `instrument`
 * navigator.requestMIDIAccess().then(access => {
 *   const midiInput = access.inputMap.values().next();
 *   midiInput.addEventListener(
 *     'midimessage',
 *     (event) => instrument.processMidiMessage(event.data)
 *   );
 * });
 * @param {Object} options
 * @param {Boolean} [options.log=false] Log instrument state to the console on
 * change
 * @param {Boolean} [options.normalize=false] For all notes, remap `timbre`,
 * `noteOnVelocity`, `noteOffVelocity` and `pressure` between 0 and 1, remap
 * `pitchBend` between -1 and 1
 * @return {Object} Instance representing an MPE compatible instrument
 *
 */
export function mpeInstrument(options) {
  const middlewares = [
    options && options.normalize && normalizer,
    options && options.log && logger,
  ].filter(f => f);
  const store = createStore(rootReducer, applyMiddleware(...middlewares));
  /**
   * Reads an MPE message and updates `mpeInstrument` state
   *
   * @example
   * import mpeInstrument from 'mpe';
   *
   * const instrument = mpeInstrument();
   *
   * // Trigger a note on, channel 2, middle C, max velocity
   * instrument.processMidiMessage([145, 60, 127]);
   * @memberof mpeInstrument
   * @instance
   * @param {Uint8Array} midiMessage An MPE MIDI message
   * @return {undefined}
   */
  function processMidiMessage(midiMessage) {
    const actions = generateMidiActions(midiMessage, store.getState);
    actions.forEach(store.dispatch);
  }
  /**
   * Clears all active notes
   *
   * @example
   * import mpeInstrument from 'mpe';
   *
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
   * instrument.clear();
   * instrument.activeNotes()
   * // => []
   *
   * @memberof mpeInstrument
   * @instance
   * @return {undefined}
   */
  function clear() {
    processMidiMessage(ALL_NOTES_OFF);
  }

  /**
   * Lists active notes of the `mpeInstrument` instance
   *
   * @example
   * import mpeInstrument from 'mpe';
   *
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
   * @return {Array} Active note objects
   * @method activeNotes
   */
  function activeNotes() {
    return store.getState().activeNotes;
  }

  /**
   * Subscribes a callback to changes to the instance's active notes
   *
   * @example
   * import mpeInstrument from 'mpe';
   *
   * const instrument = mpeInstrument();
   *
   * // Log `activeNotes` values to the console on change
   * instrument.subscribe(console.log);
   * @memberof mpeInstrument
   * @instance
   * @param {function} callback Callback for active note changes
   * @return {function} Unsubscribe the callback
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
    clear,
    activeNotes,
    subscribe,
  };
}
