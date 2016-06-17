import * as types from './constants/actionTypes';

export function recordMessage(message, time) {
  return { type: types.RECORD_MESSAGE, time, message };
}

export function startPlayback(time) {
  return { type: types.PLAYBACK_STARTED, time };
}

export function stopPlayback(time) {
  return { type: types.PLAYBACK_STOPPED, time };
}
