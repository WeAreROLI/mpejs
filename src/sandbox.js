import { MpeInstrument } from './mpe';
import { MidiRecorder } from './recorder';

if (navigator.requestMIDIAccess) {
  console.log('\nWelcome to Web MIDI Sandbox\n\n');

  navigator.requestMIDIAccess({ sysex: true }).then(
    function(x){
      console.log('MIDI inputs:');
      console.log(Array.from(x.inputs.values()));
      console.log('MIDI outputs:');
      console.log(Array.from(x.outputs.values()));
      const input = x.inputs.values().next().value;
      const output = x.outputs.values().next().value;
      const instrument = new MpeInstrument(input, output);
      instrument.debug();

      const recorder = new MidiRecorder(input);
      recorder.debug();
    },
    function(error) {
      console.log('requestMIDIAccess failed.');
    }
  )
} else {
  console.log('Please use a browser which supports Web MIDI API.');
}
