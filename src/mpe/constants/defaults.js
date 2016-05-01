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
