import * as types from '../constants/actionTypes';
import * as defaults from '../constants/defaults';
import * as noteStates from '../constants/noteStates';
import { findActiveNoteIndex, findActiveNoteIndexesByChannel } from '../utils/activeNoteUtils';

export default function activeNotes(state = [], action) {
  if (!types[action.type]) {
    return state;
  }
  switch(action.type) {
    case types.NOTE_ON:
      return [...state, activeNote({}, action)];
    case types.NOTE_OFF:
      const noteIndex = findActiveNoteIndex(state, action);
      return [...state.slice(0, noteIndex), activeNote(state[noteIndex], action), ...state.slice(noteIndex + 1)];
    case types.PITCH_BEND:
    case types.CHANNEL_PRESSURE:
    case types.TIMBRE:
      const noteIndexes = findActiveNoteIndexesByChannel(state, action);
      noteIndexes.forEach((noteIndex) => {
        state = [...state.slice(0, noteIndex), activeNote(state[noteIndex], action), ...state.slice(noteIndex + 1)]
      });
      return state;
    case types.NOTE_RELEASED:
      return state.filter((activeNote) => activeNote.noteState !== noteStates.OFF);
  }
  console.log(action);
  return state;
}

function activeNote(state = {}, action) {
  const { noteNumber, channel } = action;
  switch(action.type) {
    case types.NOTE_ON:
      const { noteOnVelocity, channelScope } = action;
      return Object.assign(state, defaults.ACTIVE_NOTE, { noteNumber, channel, noteOnVelocity }, channelScope);
    case types.NOTE_OFF:
      const { noteOffVelocity } = action;
      return Object.assign(state, { noteOffVelocity, noteState: noteStates.OFF });
    case types.PITCH_BEND:
      const { pitchBend } = action;
      return Object.assign(state, { pitchBend });
    case types.CHANNEL_PRESSURE:
      const { pressure } = action;
      return Object.assign(state, { pressure });
    case types.TIMBRE:
      const { timbre } = action;
      return Object.assign(state, { timbre });
  }
  return state;
}
