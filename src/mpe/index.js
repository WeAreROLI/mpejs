/* eslint no-console: 1 */
import { createStore } from 'redux';
import { generateMidiActions } from './actions';
import rootReducer from './reducers';

export class MpeInstrument {
  constructor(midiInput, midiOutput) {
    this.input = midiInput;
    this.output = midiOutput;
    this.store = createStore(rootReducer);
  }

  /**
   * Triggers the processing of a MIDI message.
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

  /**
   * @param {function} callback A callback to be updated will all current active
   * notes in response to any note changes.
   * @returns {function} A function to unsubscribe the given callback.
   */
  subscribe(callback) {
    let currentActiveNotes;
    return this.store.subscribe(() => {
      let previousActiveNotes = currentActiveNotes;
      currentActiveNotes = this.activeNotes();
      if (currentActiveNotes !== previousActiveNotes) {
        callback(this.activeNotes());
      }
    });
  }
}
