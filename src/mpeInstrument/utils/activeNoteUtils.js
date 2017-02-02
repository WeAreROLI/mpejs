import { transformObject } from './objectUtils';

const NORMALIZE_NOTE_TRANSFORMATIONS = {
  timbre: v => v / 16383,
  pressure: v => v / 16383,
  pitchBend: v => (2 * v / 16383) - 1,
  noteOnVelocity: v => v / 127,
};

export function normalizeNote(note) {
  return transformObject(note, NORMALIZE_NOTE_TRANSFORMATIONS);
}

export function normalizeAction(note) {
  if (note.channelScope) {
    note.channelScope = normalizeNote(note.channelScope);
  }
  return normalizeNote(note);
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
