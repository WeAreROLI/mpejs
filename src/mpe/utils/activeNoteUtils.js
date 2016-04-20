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
