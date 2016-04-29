import { expect } from 'chai';
import { MpeInstrument } from '../src';

describe('MpeInstrument', () => {
  let mpeInstrument = new MpeInstrument();
  describe('#activeNotes()', () => {
    beforeEach(() => {
      mpeInstrument = new MpeInstrument();
    })
    it('should return an empty array on initialization', () => {
      expect(mpeInstrument.activeNotes()).to.be.instanceof(Array);
      expect(mpeInstrument.activeNotes()).to.be.empty;
    });
  });
});
