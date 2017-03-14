import { compose } from 'redux';
import { transformObject } from './objectUtils';
import { int7ToUnsignedFloat, int14ToUnsignedFloat, int14ToSignedFloat } from './dataByteUtils';
import { toScientificPitch, toHelmholtzPitch } from './noteNumberUtils';

const NORMALIZE_NOTE_TRANSFORMATIONS = {
  noteOnVelocity: int7ToUnsignedFloat,
  noteOffVelocity: int7ToUnsignedFloat,
  pitchBend: int14ToSignedFloat,
  pressure: int14ToUnsignedFloat,
  timbre: int14ToUnsignedFloat,
};

export const normalize = note =>
  transformObject(note, NORMALIZE_NOTE_TRANSFORMATIONS);

export const addScientificPitch = action =>
  typeof action.noteNumber === 'undefined'
    ? action
    : Object.assign({}, action, { pitch: toScientificPitch(action.noteNumber) });

export const addHelmholtzPitch = action =>
  typeof action.noteNumber === 'undefined'
    ? action
    : Object.assign({}, action, { pitch: toHelmholtzPitch(action.noteNumber) });

export const addPitch = ({ pitch }) =>
  pitch === 'helmholtz'
    ? addHelmholtzPitch
    : addScientificPitch;

export const createPitchBendConverter = (pitchBendRange, normalize) => {
  const conversionFunctions = [
    pitchBendRange && (v => v * parseFloat(pitchBendRange)),
    !normalize && int14ToSignedFloat,
  ].filter(f => f);
  return compose(...conversionFunctions);
};

export const convertPitchBendRange = ({ pitchBendRange, normalize }) => action =>
  Object.assign(
    {},
    action,
    { pitchBend: createPitchBendConverter(pitchBendRange, normalize)(action.pitchBend) }
  );

export const findActiveNoteIndex = (state, action) => {
  const { channel, noteNumber } = action;
  return state.findIndex(activeNote =>
    activeNote.channel === channel && activeNote.noteNumber === noteNumber
  );
};

export const findActiveNoteIndexesByChannel = (state, action) =>
  state.reduce(
    (indexes, activeNote, index) =>
      activeNote.channel === action.channel ? [...indexes, index] : indexes,
      []
  );
