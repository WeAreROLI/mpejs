import { combineReducers } from 'redux';
import * as types from '../constants/actionTypes';
import * as defaults from '../constants/defaults';
import * as noteStates from '../constants/noteStates';
import { dataBytesToUint14 } from '../utils/dataByteUtils';
import { findActiveNoteIndex, findActiveNoteIndexesByChannel } from '../utils/activeNoteUtils';

function channelScopes(state = {}, action) {
  if (!types[action.type]) {
    return state;
  }
  let channelSubtree = [];
  channelSubtree[action.channel] = channelScope(state[action.channel], action);
  return Object.assign(state, channelSubtree);
}

function channelScope(state = {}, action) {
  switch (action.type) {
    case types.PITCH_BEND:
      return Object.assign({}, state, { pitchBend: action.pitchBend });
    case types.CHANNEL_PRESSURE:
      return Object.assign({}, state, { pressure: action.pressure });
    case types.TIMBRE:
      return Object.assign({}, state, { timbre: action.timbre });
  }
  return state;
}

function activeNotes(state = [], action) {
  if (!types[action.type]) {
    return state;
  }
  // Remove released notes
  state = state.filter((activeNote) => activeNote.noteState !== noteStates.OFF);
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

const rootReducer = combineReducers({
  channelScopes,
  activeNotes,
});

export default rootReducer;
