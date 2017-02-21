import { expect } from 'chai';
import { int7ToUnsignedFloat, int14ToUnsignedFloat, int14ToSignedFloat } from '../../src/mpeInstrument/utils/dataByteUtils';

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
  });
  describe('int14ToUnsignedFloat', () => {
    int14s.forEach(({ int14, unsigned }) => {
      it(`should convert ${int14} to ${unsigned}`, () => {
        expect(int14ToUnsignedFloat(int14)).to.eq(unsigned);
      });
    });
  });
  describe('int14ToSignedFloat', () => {
    int14s.forEach(({ int14, signed }) => {
      it(`should convert ${int14} to ${signed}`, () => {
        expect(int14ToSignedFloat(int14)).to.eq(signed);
      });
    });
  });
});
