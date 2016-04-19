import { combineReducers } from 'redux';
import activeNotes from './activeNotes';
import channelScopes from './channelScopes';

const rootReducer = combineReducers({
  channelScopes,
  activeNotes,
});

export default rootReducer;
