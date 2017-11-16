import { statusByteClassifier, statusByteToChannel } from './utils/statusByteUtils';
import * as defaults from './constants/defaults';
import * as types from './constants/actionTypes';
import { dataBytesToUint14 } from './utils/dataByteUtils';

export const clearActiveNotes = () => ({
  type: types.ALL_NOTES_OFF,
});

export const generateMidiActions = (midiMessage, currentStateCallback) => {
  const channel = statusByteToChannel(midiMessage[0]);
  const dataBytes = midiMessage.slice(1);

  const midiMessageType = statusByteClassifier(midiMessage[0]);
  const type = deriveActionType(midiMessageType, channel, dataBytes);
  const baseData = { type, midiMessageType, channel, dataBytes };
  const typeSpecificData = deriveTypeSpecificData(baseData, currentStateCallback);
  const mainAction = Object.assign({}, baseData, typeSpecificData);
  if (type === types.NOTE_OFF) {
    return [mainAction, { type: types.NOTE_RELEASED }];
  }
  return [mainAction];
};

const deriveActionType = (midiMessageType, channel, dataBytes) => {
  switch (midiMessageType) {
    case types.NOTE_ON:
      // A note on with velocity 0 is a treated as a note off
      if (dataBytes[1] === 0) return types.NOTE_OFF;
      break;
    case types.CONTROL_CHANGE:
      // CC 74 is used for timbre messages
      if (dataBytes[0] === 74) return types.TIMBRE;
      // CC 123 on the master channel is an all notes off message
      if (dataBytes[0] === 123 && channel === 1) return types.ALL_NOTES_OFF;
      break;
  }
  return midiMessageType;
};

const deriveTypeSpecificData = (baseData, currentStateCallback) => {
  const { type, midiMessageType, channel, dataBytes } = baseData;
  switch (type) {
    case types.NOTE_ON: {
      // Note On messages bundle channelScope to set expression values at creation.
      const channelScope = currentStateCallback().channelScopes[channel];
      return { noteNumber: dataBytes[0], noteOnVelocity: dataBytes[1], channelScope };
    }
    case types.NOTE_OFF:
      // A Note On with velocity 0 is treated as a note off with velocity 64
      return midiMessageType === types.NOTE_ON ?
        { noteNumber: dataBytes[0], noteOffVelocity: defaults.NOTE_OFF_VELOCITY } :
        { noteNumber: dataBytes[0], noteOffVelocity: dataBytes[1] };
    case types.PITCH_BEND:
      // This Control Change message's data bytes are ordered [LSB, MSB].
      return { pitchBend: dataBytesToUint14(dataBytes.reverse()) };
    case types.TIMBRE:
      return { timbre: dataBytesToUint14([dataBytes[1]]) };
    case types.CHANNEL_PRESSURE:
      return { pressure: dataBytesToUint14(dataBytes) };
  }
};
