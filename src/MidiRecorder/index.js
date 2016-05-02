/* eslint no-console: 1 */
export class MidiRecorder {
  constructor(midiInput) {
    this.input = midiInput;
  }

  debug() {
    this.input.addEventListener('midimessage', ({ receivedTime, data }) => {
      console.log(receivedTime, data);
      console.log('-');
    });
  }
}
