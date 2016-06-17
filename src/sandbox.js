/* eslint no-console: 0 */
/* global mpe: false */

if (navigator.requestMIDIAccess) {
  console.log('\nWelcome to Web MIDI Sandbox\n\n');

  navigator.requestMIDIAccess({ sysex: true }).then(
    ({ inputMap, outputMap }) => {
      const inputs = Array.from(inputMap.values());
      const outputs = Array.from(outputMap.values());
      console.log('MIDI inputs:');
      console.log(inputs);
      console.log('MIDI outputs:');
      console.log(outputs);

      if (!inputs && !outputs) {
        return console.log('No MIDI devices not found.');
      }
      const instrument = new mpe.mpeInstrument({ debug: true });
      const selectedInput = inputs[0];
      selectedInput.addEventListener(
        'midimessage',
        ({ data }) => instrument.processMidiMessage(data)
      );

      const recorder = new mpe.recorder();
      recorder.debug();
    },
    (error) => {
      console.log('requestMIDIAccess failed.');
      console.error(error);
    }
  );
} else {
  console.log('Please use a browser which supports Web MIDI API.');
}
