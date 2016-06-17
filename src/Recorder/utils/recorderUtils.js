export function isRecordingStored(state) {
  return state.recording.length;
}

export function recordingEndTime(state) {
  return isRecordingStored(state) ?
    state.recordedEvents.slice(-1)[0].time :
    0;
}
