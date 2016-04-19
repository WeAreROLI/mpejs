import { statusByteClassifier, statusByteToChannel } from '../utils/statusByteUtils';
import * as types from '../constants/actionTypes';
import { dataBytesToUint14 } from '../utils/dataByteUtils';

function overrideBaseType(baseType, dataBytes) {
  switch (baseType) {
    case types.NOTE_ON:
      // A NOTE_ON with velocity 0 behaves as a NOTE_OFF
      if (dataBytes[1] === 0) return types.NOTE_OFF;
    case types.CONTROL_CHANGE:
      // CC 74 is used for TIMBRE
      if (dataBytes[0] === 74) return types.TIMBRE;
    default:
      return baseType;
  }
}

function deriveTypeSpecificData(baseData, dataBytes, channelScope) {
  switch (baseData.type) {
    case types.NOTE_ON:
      return { channelScope, noteNumber: dataBytes[0], noteOnVelocity: dataBytes[1] }
    case types.NOTE_OFF:
      return { noteNumber: dataBytes[0], noteOffVelocity: dataBytes[1] }
    case types.PITCH_BEND:
      return { pitchBend: dataBytesToUint14(dataBytes.reverse()) }
    case types.TIMBRE:
      return { timbre: dataBytesToUint14(dataBytes.slice(1)) }
    case types.CHANNEL_PRESSURE:
      return { pressure: dataBytesToUint14(dataBytes) }
  }
}

export function midiMessage(midiEvent, currentState) {
  const channel = statusByteToChannel(midiEvent.data[0]);
  const dataBytes = midiEvent.data.slice(1);

  const baseType = statusByteClassifier(midiEvent.data[0]);
  const type = overrideBaseType(baseType, dataBytes);
  const baseData = { type, channel };
  const channelScope = currentState.channelScopes[channel];
  const typeSpecificData = deriveTypeSpecificData(baseData, dataBytes, channelScope);

  return Object.assign({}, baseData, typeSpecificData);
}
