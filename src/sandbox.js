/* eslint no-console: 0 */
/* global mpe: false */

if (navigator.requestMIDIAccess) {
  console.info('\nWeb MIDI Sandbox\n\n');

  navigator.requestMIDIAccess({ sysex: true }).then(
    ({ inputs, outputs }) => {
      const inputArray = Array.from(inputs.values());
      const outputArray = Array.from(outputs.values());
      console.info('MIDI inputs:');
      console.info(inputArray);
      console.info('MIDI outputs:');
      console.info(outputArray);

      if (!inputArray && !outputArray) {
        return console.log('No MIDI devices not found.');
      }
      const instrument = new mpe.mpeInstrument({ debug: true });
      const selectedInput = inputArray[0];
      selectedInput.addEventListener(
        'midimessage',
        ({ data }) => {
          document.getElementById('midi').checked && console.info(data);
          instrument.processMidiMessage(data);
        }
      );
      instrument.subscribe(activeNotes => document.getElementById('mpe').checked && console.info(JSON.stringify(activeNotes, null, '  ')));
    },
    (error) => {
      console.info('requestMIDIAccess failed.');
      console.error(error);
    }
  );
} else {
  console.info('Please use a browser which supports Web MIDI API.');
}
