<a name="MpeInstrument"></a>

## MpeInstrument
A class to represent an MPE MIDI instrument.

To trigger and modulate notes, pass MIDI messages to the `processMidiMessage`
method of an instance.

`activeNotes` returns an array of the current active notes.

To receive updates on changes in the current `activeNotes` state, pass a
callback to the `subscribe` method.

**Kind**: global class  

* [MpeInstrument](#MpeInstrument)
    * [new MpeInstrument()](#new_MpeInstrument_new)
    * [.processMidiMessage(midiMessage)](#MpeInstrument+processMidiMessage) ⇒ <code>undefined</code>
    * [.activeNotes()](#MpeInstrument+activeNotes) ⇒ <code>Array</code>
    * [.subscribe(callback)](#MpeInstrument+subscribe) ⇒ <code>function</code>
    * [.debug()](#MpeInstrument+debug) ⇒ <code>undefined</code>

<a name="new_MpeInstrument_new"></a>

### new MpeInstrument()
Create an MpeInstrument instance.

Handles note messages on channels 1–16 as a single MPE zone.

Channel 1 – the zone master channel – currently only has special behaviour
in the case of all notes off messages.

<a name="MpeInstrument+processMidiMessage"></a>

### mpeInstrument.processMidiMessage(midiMessage) ⇒ <code>undefined</code>
Reads MIDI message data and updates MpeInstrument state accordingly.

**Kind**: instance method of <code>[MpeInstrument](#MpeInstrument)</code>  

| Param | Type | Description |
| --- | --- | --- |
| midiMessage | <code>Uint8Array</code> | A MIDI message. |

<a name="MpeInstrument+activeNotes"></a>

### mpeInstrument.activeNotes() ⇒ <code>Array</code>
Lists current active notes.

**Kind**: instance method of <code>[MpeInstrument](#MpeInstrument)</code>  
**Returns**: <code>Array</code> - An array of note objects representing active notes.  
<a name="MpeInstrument+subscribe"></a>

### mpeInstrument.subscribe(callback) ⇒ <code>function</code>
Subscribe to changes to activeNotes state.

**Kind**: instance method of <code>[MpeInstrument](#MpeInstrument)</code>  
**Returns**: <code>function</code> - A function to unsubscribe the given callback.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | A callback to be updated will all current active notes in response to any note changes. |

<a name="MpeInstrument+debug"></a>

### mpeInstrument.debug() ⇒ <code>undefined</code>
Prints changes to the developer console.

**Kind**: instance method of <code>[MpeInstrument](#MpeInstrument)</code>  
