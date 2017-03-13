import { normalizeNote } from './activeNoteUtils';
import { toScientificPitch, toHelmholtzPitch } from './noteNumberUtils';

export const normalizeAction = action => {
  if (action.channelScope) {
    action.channelScope = normalizeNote(action.channelScope);
  }
  return normalizeNote(action);
};

export const addScientificPitch = action =>
  typeof action.noteNumber === 'undefined'
    ? action
    : Object.assign({}, action, { pitch: toScientificPitch(action.noteNumber) });

export const addHelmholtzPitch = action =>
  typeof action.noteNumber === 'undefined'
    ? action
    : Object.assign({}, action, { pitch: toHelmholtzPitch(action.noteNumber) });

export const addPitch = conversionType =>
  conversionType === 'helmholtz'
    ? addHelmholtzPitch
    : addScientificPitch;
