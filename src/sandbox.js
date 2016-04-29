if (navigator.requestMIDIAccess) {
  console.log('\nWelcome to Web MIDI Sandbox\n\n');

  navigator.requestMIDIAccess({ sysex: true }).then(
    function(x){
      const inputs = Array.from(x.inputs.values());
      const outputs = Array.from(x.outputs.values());
      console.log('MIDI inputs:');
      console.log(inputs);
      console.log('MIDI outputs:');
      console.log(outputs);
      if (!inputs) {
	return 'No MIDI devices not found.';
      }
      const instrument = new WebMidiUtils.MpeInstrument(inputs[0], outputs[0]);
      inputs[0].addEventListener('midimessage', ({ data }) =>
		instrument.processMidiMessage(data)
      );
      instrument.debug();
    },
    function(error) {
      console.log('requestMIDIAccess failed.');
    }
  )
} else {
  console.log('Please use a browser which supports Web MIDI API.');
}
