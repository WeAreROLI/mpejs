import { transformObject } from './objectUtils';
import { int7ToUnsignedFloat, int14ToUnsignedFloat, int14ToSignedFloat } from './dataByteUtils';

const NORMALIZE_NOTE_TRANSFORMATIONS = {
  noteOnVelocity: int7ToUnsignedFloat,
  noteOffVelocity: int7ToUnsignedFloat,
  pitchBend: int14ToSignedFloat,
  pressure: int14ToUnsignedFloat,
  timbre: int14ToUnsignedFloat,
};

export const normalizeNote = (note) =>
  transformObject(note, NORMALIZE_NOTE_TRANSFORMATIONS);

export const findActiveNoteIndex = (state, action) => {
  const { channel, noteNumber } = action;
  return state.findIndex((activeNote) =>
    activeNote.channel === channel && activeNote.noteNumber === noteNumber
  );
};

export const findActiveNoteIndexesByChannel = (state, action) =>
  state.reduce(
    (indexes, activeNote, index) =>
      activeNote.channel === action.channel ? [...indexes, index] : indexes,
      []
  );
