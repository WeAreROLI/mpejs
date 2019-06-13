import { compose } from 'redux';
import { transformObject } from './objectUtils';
import { 
  int7ToUnsignedFloat, int14ToUnsignedFloat, int14ToSignedFloat, 
  unsignedFloatToInt7, unsignedFloatToInt14, signedFloatToInt14,
} from './dataByteUtils';
import { toScientificPitch, toHelmholtzPitch } from './noteNumberUtils';

const NORMALIZE_NOTE_TRANSFORMATIONS = {
  noteOnVelocity: int7ToUnsignedFloat,
  noteOffVelocity: int7ToUnsignedFloat,
  pitchBend: int14ToSignedFloat,
  pressure: int14ToUnsignedFloat,
  timbre: int14ToUnsignedFloat,
};

const UNNORMALIZE_NOTE_TRANSFORMATIONS = {
  noteOnVelocity: unsignedFloatToInt7,
  noteOffVelocity: unsignedFloatToInt7,
  pitchBend: signedFloatToInt14,
  pressure: unsignedFloatToInt14,
  timbre: unsignedFloatToInt14,
};

export const normalize = note =>
  transformObject(note, NORMALIZE_NOTE_TRANSFORMATIONS);

export const unnormalize = note =>
  transformObject(note, UNNORMALIZE_NOTE_TRANSFORMATIONS);

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

const pick = (inObj, properties) => properties.reduce((acc, key) => {
  acc[key] = inObj[key];
}, {});

export const pickRequiredProperty = note =>
  pick(note, ['noteNumber', 'channel', 'noteOnVelocity', 'pitchBend', 'timbre', 'pressure']);


//  Actual pitch which has been applied pitch bend is `noteNumber + deltaPitch`
// -pitchBendRange <= deltaPitch <= pitchBendRange
export const int14ToDeltaPitch = (pitchBendRange, normalize, int14) => {
  const conversionFunctions = [
    pitchBendRange && (v => v * parseFloat(pitchBendRange)),
    !normalize && int14ToSignedFloat,
  ].filter(f => f);
  return compose(...conversionFunctions)(int14);
};

export const deltaPitchToInt14 = (pitchBendRange, normalize, deltaPitch) => {
  const conversionFunctions = [
    !normalize && signedFloatToInt14,
    pitchBendRange && (v => v / parseFloat(pitchBendRange)),
  ].filter(f => f);
  return compose(...conversionFunctions)(deltaPitch);
};

export const convertPitchBendRange = ({ pitchBendRange, normalize }) => action =>
  Object.assign(
    {},
    action,
    { pitchBend: int14ToDeltaPitch(pitchBendRange, normalize, action.pitchBend) }
  );

export const revertPitchBendRange = ({ pitchBendRange, normalize }) => action =>
  Object.assign(
    {},
    action,
    { pitchBend: deltaPitchToInt14(pitchBendRange, normalize, action.pitchBend) }
  );

export const createThresholdFunction = ({pitchBendRange, normalize}) => action => {
  // TODO: Apply threshold pitchbend which is out of range
  return action;
};

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
