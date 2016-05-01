import { statusByteClassifier, statusByteToChannel } from './utils/statusByteUtils';
import * as types from './constants/actionTypes';
import { dataBytesToUint14 } from './utils/dataByteUtils';

export function generateMidiActions(midiMessage, currentStateCallback) {
  const channel = statusByteToChannel(midiMessage[0]);
  const dataBytes = midiMessage.slice(1);

  const baseType = statusByteClassifier(midiMessage[0]);
  const type = overrideBaseType(baseType, dataBytes);
  const baseData = { type, channel };
  const typeSpecificData = deriveTypeSpecificData(baseData, dataBytes, currentStateCallback);
  const mainAction = Object.assign({}, baseData, typeSpecificData);
  if (type === types.NOTE_OFF) {
    return [mainAction, { type: types.NOTE_RELEASED }];
  }
  return [mainAction];
}

function overrideBaseType(baseType, dataBytes) {
  switch (baseType) {
    case types.NOTE_ON:
      // A NOTE_ON with velocity 0 is a NOTE_OFF
      if (dataBytes[1] === 0) return types.NOTE_OFF;
    case types.CONTROL_CHANGE:
      // CC 74 is used for TIMBRE
      if (dataBytes[0] === 74) return types.TIMBRE;
  }
  return baseType;
}

function deriveTypeSpecificData(baseData, dataBytes, currentStateCallback) {
  switch (baseData.type) {
    case types.NOTE_ON: {
      // Note On messages bundle channelScope to set expression values at creation.
      const channelScope = currentStateCallback().channelScopes[baseData.channel];
      return { noteNumber: dataBytes[0], noteOnVelocity: dataBytes[1], channelScope };
    }
    case types.NOTE_OFF:
      return { noteNumber: dataBytes[0], noteOffVelocity: dataBytes[1] };
    case types.PITCH_BEND:
      // This Control Change message's data bytes are ordered [LSB, MSB].
      return { pitchBend: dataBytesToUint14(dataBytes.reverse()) };
    case types.TIMBRE:
      return { timbre: dataBytesToUint14([dataBytes[1]]) };
    case types.CHANNEL_PRESSURE:
      return { pressure: dataBytesToUint14(dataBytes) };
  }
}
