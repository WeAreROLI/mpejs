import { transformObject } from './objectUtils';

export const int7ToSignedFloat = v => v <= 64
  ? 0.5 * v / 64
  : v / 127;

export const int14ToUnsignedFloat = v => v <= 8192
  ? 0.5 * v / 8192
  : v / 16383;

export const int14ToSignedFloat = v => v <= 8192
  ? v / 8192 - 1
  : (v - 8192) / 8191;

const NORMALIZE_NOTE_TRANSFORMATIONS = {
  noteOnVelocity: int7ToSignedFloat,
  noteOffVelocity: int7ToSignedFloat,
  pitchBend: int14ToSignedFloat,
  pressure: int14ToUnsignedFloat,
  timbre: int14ToUnsignedFloat,
};

export function normalizeNote(note) {
  return transformObject(note, NORMALIZE_NOTE_TRANSFORMATIONS);
}

export function findActiveNoteIndex(state, action) {
  const { channel, noteNumber } = action;
  return state.findIndex((activeNote) =>
    activeNote.channel === channel && activeNote.noteNumber === noteNumber
  );
}

export function findActiveNoteIndexesByChannel(state, action) {
  return state.reduce(
    (indexes, activeNote, index) =>
      activeNote.channel === action.channel ? [...indexes, index] : indexes,
      []
  );
}
