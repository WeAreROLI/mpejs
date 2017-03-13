import { expect } from 'chai';
import { toScientificPitch, toHelmholtzPitch } from '../../src/mpeInstrument/utils/noteNumberUtils';
import noteNumberToPitch from '../data/noteNumberToPitch';
import { log } from 'mocha-logger';

describe('noteNumberUtils', () => {
  describe('toScientificPitch()', () => {
    it('converts note numbers to scientific pitch', () => {
      log(noteNumberToPitch.map(({ noteNumber, scientific }, i) => {
        expect(toScientificPitch(noteNumber)).to.eq(scientific);
        return `${noteNumber} ${scientific}`;
      }).join(' | '));
    });
  });
  describe('toHelmholtzPitch()', () => {
    it('converts note numbers to helmholtz pitch', () => {
      log(noteNumberToPitch.map(({ noteNumber, helmholtz }, i) => {
        expect(toHelmholtzPitch(noteNumber)).to.eq(helmholtz);
        return `${noteNumber} ${helmholtz}`;
      }).join(' | '));
    });
  });
});
