import { createStore, applyMiddleware, compose } from 'redux';
import { generateMidiActions, clearActiveNotes } from './actions';
import { logger } from './middlewares';
import { normalize, addPitch, convertPitchBendRange } from './utils/activeNoteUtils';
import rootReducer from './reducers';

/**
 * Creates a new instrument instance for processing MPE data
 *
 * @kind function
 * @example
 * import mpeInstrument from 'mpe';
 *
 * // Define `instrument` as an instance of `mpeInstrument`
 * const instrument = mpeInstrument();
 *
 * // Request MIDI device access from the Web MIDI API
 * navigator.requestMIDIAccess().then(access => {
 *   // Iterate over the list of inputs returned
 *   access.inputs.forEach(midiInput => {
 *     // Send 'midimessage' events to the mpe.js `instrument` instance
 *     midiInput.addEventListener(
 *       'midimessage',
 *       (event) => instrument.processMidiMessage(event.data)
 *     );
 *   });
 * });
 * @param {Object} options
 * @param {Boolean} [options.log=false] Log instrument state to the console on
 * change
 * @param {Boolean} [options.normalize=false] For all notes, remap `timbre`,
 * `noteOnVelocity`, `noteOffVelocity` and `pressure` between 0 and 1, remap
 * `pitchBend` between -1 and 1
 * @param {Boolean} [options.pitch=false] Adds a `pitch` property to all notes:
 * uses scientific notation eg. `C4` when `true` or `'scientific'`, uses
 * Helmholtz notation eg. `c'` when set to `'helmholtz'`
 * @param {Boolean} [options.pitchBendRange=48] Converts `pitchBend` to the
 * range specified, overriding `normalize` if both are set
 * @return {Object} Instance representing an MPE compatible instrument
 */
export const mpeInstrument = options => {
  const defaults = {
    log: false,
    normalize: true,
    pitch: false,
    pitchBendRange: 48,
  };
  const defaultedOptions = Object.assign({}, defaults, options);
  const formatNote = compose(...[
    defaultedOptions.pitch && addPitch(defaultedOptions),
    defaultedOptions.pitchBendRange && convertPitchBendRange(defaultedOptions),
    defaultedOptions.normalize && normalize,
  ].filter(f => f));
  const formatActiveNotes = notes => notes.map(formatNote);
  const middlewares = [
    defaultedOptions.log && logger(formatActiveNotes),
  ].filter(f => f);
  const store = createStore(rootReducer, applyMiddleware(...middlewares));
  const rawActiveNotes = () => store.getState().activeNotes;

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
   * //        noteOnVelocity: 1,
   * //        pitchBend: 0,
   * //        timbre: 0.5,
   * //        pressure: 0 } ]
   *
   * @memberof mpeInstrument
   * @instance
   * @return {Array} Active note objects
   * @method activeNotes
   */
  const activeNotes = () => formatActiveNotes(rawActiveNotes());

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
   * //        noteOnVelocity: 1,
   * //        pitchBend: 0,
   * //        timbre: 0.5,
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
  const clear = () => store.dispatch(clearActiveNotes());

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
  const processMidiMessage = midiMessage => {
    const actions = generateMidiActions(midiMessage, store.getState);
    actions.forEach(store.dispatch);
  };

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
  const subscribe = callback => {
    let currentActiveNotes = rawActiveNotes();
    return store.subscribe(() => {
      let previousActiveNotes = currentActiveNotes;
      currentActiveNotes = rawActiveNotes();
      if (currentActiveNotes !== previousActiveNotes) {
        callback(activeNotes());
      }
    });
  };

  return {
    processMidiMessage,
    clear,
    activeNotes,
    subscribe,
  };
};
