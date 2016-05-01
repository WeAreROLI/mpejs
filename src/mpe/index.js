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
    const actions = generateMidiActions(midiMessage, () => this.store.getState());
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
   * Prints all incoming messages and state changes to the developer console.
   *
   * @returns {undefined}
   */
  debug() {
    this.store.subscribe(() => {
      const state = this.store.getState();
      state.activeNotes.map((n) => {
        const { noteNumber, pitchBend, pressure, timbre, noteOnVelocity, noteOffVelocity } = n;
        console.log({ noteNumber, noteOnVelocity, pitchBend, timbre, pressure, noteOffVelocity });
      });
      console.log(`${state.activeNotes.length} active note(s)`);
    });
  }

  subscribe(callback) {
    this.store.subscribe(() => callback(this.activeNotes()));
  }
}
