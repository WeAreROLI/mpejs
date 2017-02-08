import { normalizeAction, addScientificPitch, addHelmholtzPitch } from './utils/actionUtils';

let currentActiveNotes;

/* eslint-disable no-console */
export const logger = store => next => action => {
  let result = next(action);
  let previousActiveNotes = currentActiveNotes;
  currentActiveNotes = store.getState().activeNotes;
  if (currentActiveNotes !== previousActiveNotes) {
    console.log('active notes:', currentActiveNotes);
  }
  return result;
};
/* eslint-enable no-console */

export const normalizer = store => next => action => {
  return next(normalizeAction(action));
};

export const pitchConverter = conversionType => store => next => action => {
  const actionModifier = conversionType === 'helmholtz'
    ? addHelmholtzPitch
    : addScientificPitch;
  return next(actionModifier(action));
};
