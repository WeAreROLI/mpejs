import MpeInstrument from './mpe';

if (navigator.requestMIDIAccess) {
  console.log('\nWelcome to Web MIDI Sandbox\n\n');

  navigator.requestMIDIAccess({ sysex: true }).then(
    function(x){
      console.log('MIDI inputs:');
      console.log(Array.from(x.inputs.values()));
      console.log('MIDI outputs:');
      console.log(Array.from(x.outputs.values()));
      new MpeInstrument(
        x.inputs.values().next().value,
        x.outputs.values().next().value
      );
    },
    function(error) {
      console.log('requestMIDIAccess failed.');
    }
  )
} else {
  console.log('Please use a browser which supports Web MIDI API.');
}
