import { createStore } from 'redux'
import { midiMessage } from './actions'
import rootReducer from './reducers'

export default class MpeInstrument {
  constructor(midiInput, midiOutput) {
    this.input = midiInput;
    this.output = midiOutput;
    this.store = createStore(rootReducer);
    this.input.onmidimessage = (event) =>
      this.store.dispatch(midiMessage(event, this.store.getState()));
      this.store.subscribe(
        () => {
          this.store.getState().activeNotes.map((n) => {
            const { noteNumber, pitchBend, pressure, timbre, noteOnVelocity, noteOffVelocity } = n;
            console.log({ noteNumber, noteOnVelocity, pitchBend, timbre, pressure, noteOffVelocity });
          })
          console.log('-');
        }
      );
  }
}
