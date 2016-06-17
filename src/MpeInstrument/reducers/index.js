import { combineReducers } from 'redux';
import activeNotes from './activeNotes';
import channelScopes from './channelScopes';

export default combineReducers({
  channelScopes,
  activeNotes,
});
