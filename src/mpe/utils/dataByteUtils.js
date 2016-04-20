/**
 * Scales 7-bit values into the 14-bit range.
 *
 * @param {uint8} input Input 7-bit integer.
 * @returns {uint16} Scaled 14-bit integer.
 */
export const scale7To14Bit = (input) => {
  if (input > 127) {
    throw new RangeError(
      `scale7To14Bit takes a 7-bit integer.\n` +
      `scale7To14Bit(${input}) is invalid.`
    );
  }
  if (input <= 64) {
    return input << 7;
  }
  return (input / 127) * 16383;
};

/**
 * Converts one or two MIDI data bytes into normalized 14-bit values.
 *
 * @param {uint8} midiDataByte1 First MIDI data byte.
 * @param {uint8} midiDataByte2 Second MIDI data byte. If given a second byte
 * implies a 14-bit precision value.
 * @returns {uint16} Normalized 14-bit integer representation of the inputs.
 */
export const dataBytesToUint14 = (midiDataBytes) => {
  // Discard identifier bit.
  const midiDataByteContents = midiDataBytes.map((dataByte) => 127 & dataByte);
  switch (midiDataBytes.length) {
    case 1:
      // With one 7-bit value, scale to a 14-bit integer.
      return scale7To14Bit(midiDataByteContents[0]);
    case 2:
      // With two 7-bit values, combine to make one 14-bit integer
      return (midiDataByteContents[0] << 7) + midiDataByteContents[1];
  }
  throw new Error(
    `midiDataToMpeValue takes one or two 8-bit integers.\n` +
    `midiDataToMpeValue(${midiDataBytes}) is invalid.`
  );
};
