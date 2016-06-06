/* eslint-disable no-console */
export const logger = store => next => action => {
  console.log('action', action);
  let result = next(action);
  console.log('new state', store.getState());
  return result;
};
/* eslint-enable no-console */
