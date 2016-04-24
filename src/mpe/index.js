import { createStore } from 'redux'
import { generateMidiActions } from './actions'
import rootReducer from './reducers'

export class MpeInstrument {
  constructor(midiInput, midiOutput) {
    this.input = midiInput;
    this.output = midiOutput;
    this.store = createStore(rootReducer);
    this.input.addEventListener('midimessage', (event) => {
      const actions = generateMidiActions(event, () => this.store.getState());
      actions.forEach(this.store.dispatch);
    });
  }

  debug() {
    this.store.subscribe(() => {
      const state = this.store.getState();
      state.activeNotes.map((n) => {
        const { noteNumber, pitchBend, pressure, timbre, noteOnVelocity, noteOffVelocity } = n;
        console.log({ noteNumber, noteOnVelocity, pitchBend, timbre, pressure, noteOffVelocity });
      })
      console.log(`${state.activeNotes.length} active note(s)`);
      console.log('-');
    });
  }

  subscribe(callback) {
    this.store.subscribe(() => callback(this.store.getState().activeNotes));
  }
}
