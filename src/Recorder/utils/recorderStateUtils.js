export function isRecordingInProgress(state) {
  return state.recording.start && !state.recording.stop;
}

export function isRecordingStored(state) {
  return state.recording.stop && state.recording.recordedMessages.length;
}
