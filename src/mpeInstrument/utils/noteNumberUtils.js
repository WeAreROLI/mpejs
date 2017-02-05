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

export function toPitchClassNumber(noteNumber) {
  return Math.floor(noteNumber % 12);
}

export function toOctaveNumber(noteNumber) {
  return Math.floor(noteNumber / 12);
}

export function toPitchClassName(noteNumber) {
  return PITCH_CLASS_NUMBER_TO_PITCH_NAME[toPitchClassNumber(noteNumber)];
}

export function toHelmholtzPitch(noteNumber) {
  return `helmholtz ${noteNumber}`;
}

export function toScientificPitch(noteNumber) {
  return `${toPitchClassName(noteNumber)}${toOctaveNumber(noteNumber)}`;
}
