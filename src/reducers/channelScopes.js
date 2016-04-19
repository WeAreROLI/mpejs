import * as types from '../constants/actionTypes';

export default function channelScopes(state = {}, action) {
  if (!types[action.type]) {
    return state;
  }
  const { channel } = action;
  return Object.assign(state, { [channel]: channelScope(state[channel], action) });
}

function channelScope(state = {}, action) {
  switch (action.type) {
    case types.PITCH_BEND:
      return Object.assign({}, state, { pitchBend: action.pitchBend });
    case types.CHANNEL_PRESSURE:
      return Object.assign({}, state, { pressure: action.pressure });
    case types.TIMBRE:
      return Object.assign({}, state, { timbre: action.timbre });
  }
  return state;
}
