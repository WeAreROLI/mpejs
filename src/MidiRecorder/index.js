/* eslint no-console: 1 */
export class MidiRecorder {
  /**
   * Creates a MidiRecorder instance.
   * 
   * @param {MIDIInput} midiInput A Web MIDI API `MIDIInput` instance to process
   * data from.
   * @returns {undefined}
   */
  constructor(midiInput) {
    this.input = midiInput;
  }

  /* eslint-disable no-console */
  debug() {
    this.input.addEventListener('midimessage', ({ receivedTime, data }) => {
      console.log(receivedTime, data);
      console.log('-');
    });
  }
  /* eslint-enable no-console */
}
