import * as types from './constants/actionTypes';

export function processMessage(message, time = performance.now()) {
  return { type: types.MESSAGE_RECEIVED, time, message };
}

export function startRecording(time = performance.now()) {
  return { type: types.RECORDING_STARTED, time };
}

export function stopRecording(time = performance.now()) {
  return { type: types.RECORDING_STOPPED, time };
}

export function startPlayback(time = performance.now()) {
  return { type: types.PLAYBACK_STARTED, time };
}

export function stopPlayback(time = performance.now()) {
  return { type: types.PLAYBACK_STOPPED, time };
}
