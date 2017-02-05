const PITCH_CLASS_NUMBER_TO_PITCH_NAME = {
  0:  'C',
  1:  'C♯',
  2:  'D',
  3:  'E♭',
  4:  'E',
  5:  'F',
  6:  'F♯',
  7:  'G',
  8:  'A♭',
  9:  'A',
  10: 'B♭',
  11: 'B',
};

export function toPitchClassNumber(noteNumber) {
  return Math.floor(noteNumber % 12);
}

export function toOctaveNumber(noteNumber) {
  return Math.floor(noteNumber / 12) - 1;
}

export function toPitchClassName(noteNumber) {
  return PITCH_CLASS_NUMBER_TO_PITCH_NAME[toPitchClassNumber(noteNumber)];
}

export function toHelmholtzCommas(noteNumber) {
  const numCommas = Math.max((-1 * toOctaveNumber(noteNumber)) + 2, 0);
  return new Array(numCommas).fill(',').join('');
}

export function toHelmholtzApostrophes(noteNumber) {
  const numApostrophes = Math.max(toOctaveNumber(noteNumber) - 3, 0);
  return new Array(numApostrophes).fill('\'').join('');
}

export function toHelmholtzPitchName(noteNumber) {
  if (noteNumber >= 48) return toPitchClassName(noteNumber).toLowerCase();
  return toPitchClassName(noteNumber);
}


export function toHelmholtzPitch(noteNumber) {
  return `${toHelmholtzPitchName(noteNumber)}${toHelmholtzCommas(noteNumber)}${toHelmholtzApostrophes(noteNumber)}`;
}

export function toScientificPitch(noteNumber) {
  return `${toPitchClassName(noteNumber)}${toOctaveNumber(noteNumber)}`;
}
