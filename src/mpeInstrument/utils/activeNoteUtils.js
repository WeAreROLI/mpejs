import { transformObject } from './objectUtils';

const NORMALIZE_NOTE_TRANSFORMATIONS = {
  noteOnVelocity: v => v / 127,
  noteOffVelocity: v => v / 127,
  pitchBend: v => (2 * v / 16383) - 1,
  pressure: v => v / 16383,
  timbre: v => v / 16383,
};

export function normalizeNote(note) {
  return transformObject(note, NORMALIZE_NOTE_TRANSFORMATIONS);
}

export function normalizeAction(action) {
  if (action.channelScope) {
    action.channelScope = normalizeNote(action.channelScope);
  }
  return normalizeNote(action);
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
