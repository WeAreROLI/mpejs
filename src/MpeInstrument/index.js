import { createStore } from 'redux';
import { generateMidiActions } from './actions';
import rootReducer from './reducers';

/**
 * A class to represent an MPE MIDI instrument.
 *
 * To trigger and modulate notes, pass MIDI data to the `processMidiMessage`
 * method of an instance.
 *
 * `activeNotes` returns an array of the current active notes.
 *
 * To receive updates on changes in the current `activeNotes` state, pass a
 * callback to the `subscribe` method.
 */
export class MpeInstrument {
  /**
   * Create an MpeInstrument instance.
   *
   * Handles note messages on channels 1–16 as a single MPE zone.
   *
   * Channel 1 – the zone master channel – currently only has special behaviour
   * in the case of all notes off messages.
   *
   * @returns {undefined}
   */
  constructor() {
    this.store = createStore(rootReducer);
  }

  /**
   * Reads MIDI message data and updates MpeInstrument state accordingly.
   *
   * @param {Uint8Array} midiMessage A MIDI message.
   * @returns {undefined}
   */
  processMidiMessage(midiMessage) {
    const actions = generateMidiActions(midiMessage, this.store.getState);
    actions.forEach(this.store.dispatch);
  }

  /**
   * Lists current active notes.
   *
   * @returns {Array} An array of note objects representing active notes.
   */
  activeNotes() {
    return this.store.getState().activeNotes;
  }

  /**
   * Subscribe to changes to activeNotes state.
   *
   * @param {function} callback A callback to be updated will all current active
   * notes in response to any note changes.
   * @returns {function} A function to unsubscribe the given callback.
   */
  subscribe(callback) {
    let currentActiveNotes = this.activeNotes();
    return this.store.subscribe(() => {
      let previousActiveNotes = currentActiveNotes;
      currentActiveNotes = this.activeNotes();
      if (currentActiveNotes !== previousActiveNotes) {
        callback(this.activeNotes());
      }
    });
  }

  /* eslint-disable no-console */
  /**
   * Prints changes to the developer console.
   *
   * @returns {undefined}
   */
  debug() {
    this.subscribe((activeNotes) => {
      activeNotes.forEach((n) => {
        const { noteNumber, pitchBend, pressure, timbre, noteOnVelocity, noteOffVelocity } = n;
        console.log({ noteNumber, noteOnVelocity, pitchBend, timbre, pressure, noteOffVelocity });
      });
      console.log(`${activeNotes.length} active note(s)`);
    });
  }
  /* eslint-enable no-console */

}
