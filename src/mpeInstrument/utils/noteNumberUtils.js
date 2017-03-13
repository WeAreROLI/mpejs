const PITCH_CLASS_NUMBER_TO_PITCH_NAME = {
  0:  'C',
  1:  'C#',
  2:  'D',
  3:  'Eb',
  4:  'E',
  5:  'F',
  6:  'F#',
  7:  'G',
  8:  'Ab',
  9:  'A',
  10: 'Bb',
  11: 'B',
};

export const toPitchClassNumber = noteNumber => Math.floor(noteNumber % 12);

export const toOctaveNumber = noteNumber => Math.floor(noteNumber / 12) - 1;

export const toPitchClassName = noteNumber =>
  PITCH_CLASS_NUMBER_TO_PITCH_NAME[toPitchClassNumber(noteNumber)];

export const toHelmholtzCommas = noteNumber => {
  const numCommas = Math.max((-1 * toOctaveNumber(noteNumber)) + 2, 0);
  return new Array(numCommas).fill(',').join('');
};

export const toHelmholtzApostrophes = noteNumber => {
  const numApostrophes = Math.max(toOctaveNumber(noteNumber) - 3, 0);
  return new Array(numApostrophes).fill('\'').join('');
};

export const toHelmholtzPitchName = noteNumber =>
  noteNumber >= 48
    ? toPitchClassName(noteNumber).toLowerCase()
    : toPitchClassName(noteNumber);


export const toHelmholtzPitch = noteNumber =>
  `${toHelmholtzPitchName(noteNumber)}${toHelmholtzCommas(noteNumber)}${toHelmholtzApostrophes(noteNumber)}`;

export const toScientificPitch = noteNumber =>
  `${toPitchClassName(noteNumber)}${toOctaveNumber(noteNumber)}`;
