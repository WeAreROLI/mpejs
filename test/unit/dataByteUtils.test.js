import { expect } from 'chai';
import { 
  int7ToUnsignedFloat, int14ToUnsignedFloat, int14ToSignedFloat, 
  unsignedFloatToInt7, unsignedFloatToInt14, signedFloatToInt14,
} from '../../src/mpeInstrument/utils/dataByteUtils';
import { chain, range, zip } from 'lodash';

const int7s = [
  { int7: 0,   unsigned: 0.0, signed: -1.0 },
  { int7: 127, unsigned: 1.0, signed: 1.0  },
  { int7: 64,  unsigned: 0.5, signed: 0.0  },
];

const int14s = [
  { int14: 0,     unsigned: 0.0, signed: -1.0 },
  { int14: 16383, unsigned: 1.0, signed: 1.0  },
  { int14: 8192,  unsigned: 0.5, signed: 0.0  },
];

describe('dataByteUtils', () => {
  describe('int7ToUnsignedFloat', () => {
    int7s.forEach(({ int7, unsigned }) => {
      it(`should convert ${int7} to ${unsigned}`, () => {
        expect(int7ToUnsignedFloat(int7)).to.eq(unsigned);
      });
    });

    it('should produce even intervals', () => {
      chain(range(128))
        .map(int7ToUnsignedFloat)
        .thru(vs => zip(vs.slice(0, -1), vs.slice(1)))
        .map(([a, b]) => b - a)
        .thru(ds => Array.from(new Set(ds)))
        .value()
        .every(v => expect(v).to.be.closeTo(0.0078, 0.0002));
    });
  });
  describe('int14ToUnsignedFloat', () => {
    int14s.forEach(({ int14, unsigned }) => {
      it(`should convert ${int14} to ${unsigned}`, () => {
        expect(int14ToUnsignedFloat(int14)).to.eq(unsigned);
      });
    });

    it('should produce even intervals', () => {
      chain(range(16384))
        .map(int14ToUnsignedFloat)
        .thru(vs => zip(vs.slice(0, -1), vs.slice(1)))
        .map(([a, b]) => b - a)
        .thru(ds => Array.from(new Set(ds)))
        .value()
        .every(v => expect(v).to.be.closeTo(0.000061, 0.00001));
    });
  });
  describe('int14ToSignedFloat', () => {
    int14s.forEach(({ int14, signed }) => {
      it(`should convert ${int14} to ${signed}`, () => {
        expect(int14ToSignedFloat(int14)).to.eq(signed);
      });

      it('should produce even intervals', () => {
        chain(range(16384))
          .map(int14ToSignedFloat)
          .thru(vs => zip(vs.slice(0, -1), vs.slice(1)))
          .map(([a, b]) => b - a)
          .thru(ds => Array.from(new Set(ds)))
          .value()
          .every(v => expect(v).to.be.closeTo(0.00012, 0.00001));
      });
    });
  });
  describe('unsignedFloatToInt7', () => {
    int7s.forEach(({ int7, unsigned }) => {
      it(`should convert ${unsigned} to ${int7}`, () => {
        expect(unsignedFloatToInt7(unsigned)).to.eq(int7);
      });
    });
  });
  describe('unsignedFloatToInt14', () => {
    int14s.forEach(({ int14, unsigned }) => {
      it(`should convert ${unsigned} to ${int14}`, () => {
        expect(unsignedFloatToInt14(unsigned)).to.eq(int14);
      });
    });
  });
  describe('signedFloatToInt14', () => {
    int14s.forEach(({ int14, signed }) => {
      it(`should convert ${signed} to ${int14}`, () => {
        expect(signedFloatToInt14(signed)).to.eq(int14);
      });
    });
  });
});
