/**
 * Constants to map MIDI messages contents to message types.
 *
 * MIDI message information derived from this table:
 * https://www.midi.org/specifications/item/table-1-summary-of-midi-message
 */

export const CHANNEL_MESSAGE = 'CHANNEL_MESSAGE';
export const SYSTEM_MESSAGE = 'SYSTEM_MESSAGE';
export const NOTE_ON = 'NOTE_ON';
export const NOTE_OFF = 'NOTE_OFF';
export const AFTERTOUCH = 'AFTERTOUCH';
export const CONTROL_CHANGE = 'CONTROL_CHANGE';
export const PROGRAM_CHANGE = 'PROGRAM_CHANGE';
export const CHANNEL_PRESSURE = 'CHANNEL_PRESSURE';
export const PITCH_BEND = 'PITCH_BEND';
export const CHANNEL_MODE = 'CHANNEL_MODE';
export const ALL_SOUND_OFF = 'ALL_SOUND_OFF';
export const RESET_ALL_CONTROLLERS = 'RESET_ALL_CONTROLLERS';
export const LOCAL_CONTROL = 'LOCAL_CONTROL';
export const ALL_NOTES_OFF = 'ALL_NOTES_OFF';
export const SYSTEM_EXCLUSIVE = 'SYSTEM_EXCLUSIVE';
export const MIDI_TIME_CODE_QUARTER_FRAME = 'MIDI_TIME_CODE_QUARTER_FRAME';
export const SONG_POSITION_POINTER = 'SONG_POSITION_POINTER';
export const SONG_SELECT = 'SONG_SELECT';
export const TUNE_REQUEST = 'TUNE_REQUEST';
export const END_OF_EXCLUSIVE = 'END_OF_EXCLUSIVE';
export const TIMING_CLOCK = 'TIMING_CLOCK';
export const UNDEFINED = 'UNDEFINED';
export const START = 'START';
export const CONTINUE = 'CONTINUE';
export const STOP = 'STOP';
export const ACTIVE_SENSING = 'ACTIVE_SENSING';
export const RESET = 'RESET';
export const UNCLASSIFIED = 'UNCLASSIFIED';
