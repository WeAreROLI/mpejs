import * as types from './constants/actionTypes';
import * as defaults from './constants/defaults';

/* eslint-disable no-console */
export default function rootReducer(state = defaults.RECORDER_STATE, action) {
  switch(action.type) {
    case types.RECORD_MESSAGE: {
      const { message, time } = action;
      return Object.assign({}, state, { recordedMessages: [...state.recordedMessages, { time, message }] });
    }
  }
  return state;
}
