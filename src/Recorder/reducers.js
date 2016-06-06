import * as types from './constants/actionTypes';
import * as defaults from './constants/defaults';
import { isRecordingInProgress } from './utils/recorderStateUtils';

/* eslint-disable no-console */
export default function rootReducer(state = defaults.RECORDER_STATE, action) {
  switch(action.type) {
    case types.MESSAGE_RECEIVED:
      console.log(action, state);
      if (isRecordingInProgress(state)) {
        const recording = updateRecording(state.recording, action);
        return Object.assign({}, state, { recording });
      }
    case types.RECORDING_STARTED:
    case types.RECORDING_STOPPED: {
      const recording = updateRecording(state.recording, action);
      return Object.assign({}, state, { recording });
    }
    case types.PLAYBACK_STARTED:
    case types.PLAYBACK_STOPPED: {
      const playback = updatePlayback(state.playback, action);
      return Object.assign({}, state, { playback });
    }
  }
  console.log('unhandled', action);
  return state;
}

function updatePlayback(state = {}, action) {
  const { time } = action;
  switch(action.type) {
    case types.PLAYBACK_STARTED:
      return Object.assign({}, state, { start: time });
    case types.PLAYBACK_STOPPED:
      return Object.assign({}, state, { stop: time });
  }
  return state;
}

function updateRecording(state = {}, action) {
  const { message, time } = action;
  const { recordedMessages, start } = state;
  switch(action.type) {
    case types.MESSAGE_RECEIVED: {
      const offset = time - start;
      return Object.assign(
        {},
        state,
        { recordedMessages: [...recordedMessages, { offset, message }] }
      );
    }
    case types.RECORDING_STARTED:
      return Object.assign({}, state, { start: time });
    case types.RECORDING_STOPPED:
      return Object.assign({}, state, { stop: time });
  }
  return state;
}
