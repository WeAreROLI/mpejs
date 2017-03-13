/**
 * Maps MIDI messages contents to message types.
 *
 * MIDI message information derived from this table:
 * https://www.midi.org/specifications/item/table-1-summary-of-midi-message
 */

import * as types from '../constants/midiMessageTypes';

export const statusByteClassifier = statusByte => {
  const firstNibble = statusByte & 0xf0;
  switch (firstNibble) {
    case 0x80: return types.NOTE_OFF;
    case 0x90: return types.NOTE_ON;
    case 0xa0: return types.AFTERTOUCH;
    case 0xb0: return types.CONTROL_CHANGE;
    case 0xc0: return types.PROGRAM_CHANGE;
    case 0xd0: return types.CHANNEL_PRESSURE;
    case 0xe0: return types.PITCH_BEND;
    case 0xf0: return types.SYSTEM_MESSAGE;
  }
  return types.UNCLASSIFIED;
};

export const statusByteToChannel = statusByte =>
  (statusByte & 0x0f) + 1;
