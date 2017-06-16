import * as types from '../constants/actionTypes';
import * as defaults from '../constants/defaults';
import * as noteStates from '../constants/noteStates';
import { findActiveNoteIndex, findActiveNoteIndexesByChannel } from '../utils/activeNoteUtils';

const activeNotes = (state = [], action) => {
  if (!types[action.type]) {
    return state;
  }
  switch(action.type) {
    case types.NOTE_ON:
      return [...state, activeNote({}, action)];
    case types.NOTE_OFF: {
      const noteIndex = findActiveNoteIndex(state, action);
      return (noteIndex >= 0) ?
        [...state.slice(0, noteIndex), activeNote(state[noteIndex], action), ...state.slice(noteIndex + 1)] :
        state;
    }
    case types.PITCH_BEND:
    case types.CHANNEL_PRESSURE:
    case types.TIMBRE: {
      const noteIndexes = findActiveNoteIndexesByChannel(state, action);
      noteIndexes.forEach(noteIndex => {
        state = [...state.slice(0, noteIndex), activeNote(state[noteIndex], action), ...state.slice(noteIndex + 1)];
      });
      return state;
    }
    case types.NOTE_RELEASED:
      return state.length ?
        state.filter(activeNote => activeNote.noteState !== noteStates.OFF) :
        state;
    case types.ALL_NOTES_OFF:
      return [];
  }
  return state;
};

const activeNote = (state = defaults.ACTIVE_NOTE, action) => {
  const { noteNumber, channel, channelScope, noteOnVelocity, noteOffVelocity,
    pitch, pitchBend, pressure, timbre } = action;
  switch(action.type) {
    case types.NOTE_ON:
      return Object.assign({}, state, { noteNumber, channel, noteOnVelocity }, pitch && { pitch }, channelScope);
    case types.NOTE_OFF:
      return Object.assign({}, state, { noteOffVelocity, noteState: noteStates.OFF });
    case types.PITCH_BEND:
      return Object.assign({}, state, { pitchBend });
    case types.CHANNEL_PRESSURE:
      return Object.assign({}, state, { pressure });
    case types.TIMBRE:
      return Object.assign({}, state, { timbre });
  }
  return state;
};

export default activeNotes;
