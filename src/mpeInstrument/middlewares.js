let currentActiveNotes;

/* eslint-disable no-console */
export const logger = formatActiveNotes => store => next => action => {
  let result = next(action);
  let previousActiveNotes = currentActiveNotes;
  currentActiveNotes = store.getState().activeNotes;
  if (currentActiveNotes !== previousActiveNotes) {
    console.log('active notes:', formatActiveNotes(currentActiveNotes));
  }
  return result;
};
/* eslint-enable no-console */
