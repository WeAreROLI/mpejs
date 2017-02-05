import { expect } from 'chai';
import { toScientificPitch, toHelmholtzPitch } from '../../src/mpeInstrument/utils/noteNumberUtils';
import noteNumberToPitch from '../data/noteNumberToPitch';

describe('noteNumberUtils', () => {
  describe('toScientificPitch', () => {
    noteNumberToPitch.forEach(({ noteNumber, scientific }, i) => {
      it(`converts note number ${noteNumber} to ${scientific}`, () => {
        expect(toScientificPitch(noteNumber)).to.eq(scientific);
      });
    });
  });
  describe('toHelmholtzPitch', () => {
    noteNumberToPitch.forEach(({ noteNumber, helmholtz }, i) => {
      it(`converts note number ${noteNumber} to ${helmholtz}`, () => {
        expect(toHelmholtzPitch(noteNumber)).to.eq(helmholtz);
      });
    });
  });
});
