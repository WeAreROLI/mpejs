import * as noteStates from './noteStates';

export const NOTE_ON_VELOCITY = 64;
export const PITCH_BEND = 8192;
export const PRESSURE = 0;
export const TIMBRE = 8192;
export const NOTE_OFF_VELOCITY = 64;
export const NOTE_STATE = noteStates.KEY_DOWN;

export const ACTIVE_NOTE = {
  noteOnVelocity: NOTE_ON_VELOCITY,
  pitchBend: PITCH_BEND,
  pressure: PRESSURE,
  timbre: TIMBRE,
  noteState: NOTE_STATE,
};

export const CHANNEL_SCOPE = {
  pitchBend: PITCH_BEND,
  timbre: TIMBRE,
  pressure: PRESSURE,
};

export const CHANNEL_SCOPES = {
  1: CHANNEL_SCOPE,
  2: CHANNEL_SCOPE,
  3: CHANNEL_SCOPE,
  4: CHANNEL_SCOPE,
  5: CHANNEL_SCOPE,
  6: CHANNEL_SCOPE,
  7: CHANNEL_SCOPE,
  8: CHANNEL_SCOPE,
  9: CHANNEL_SCOPE,
  10: CHANNEL_SCOPE,
  11: CHANNEL_SCOPE,
  12: CHANNEL_SCOPE,
  13: CHANNEL_SCOPE,
  14: CHANNEL_SCOPE,
  15: CHANNEL_SCOPE,
  16: CHANNEL_SCOPE,
};
