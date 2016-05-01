import { expect } from 'chai';
import { MpeInstrument } from '../lib';
import 'chai';


const NOTE_ON_1 = new Uint8Array([145, 60, 127]);
const NOTE_ON_2 = new Uint8Array([146, 62, 127]);
// const NOTE_OFF_1 = new Uint8Array([129, 60, 127]);
const NOTE_OFF_2 = new Uint8Array([130, 62, 127]);
const ZERO_VELOCITY_NOTE_OFF_1 = new Uint8Array([145, 60, 0]);

describe('MpeInstrument', () => {
  let mpeInstrument;
  describe('#activeNotes()', () => {
    beforeEach(() => {
      mpeInstrument = new MpeInstrument();
    });
    it('returns an empty array on initialization', () => {
      expect(mpeInstrument.activeNotes()).to.be.instanceof(Array);
      expect(mpeInstrument.activeNotes()).to.be.empty;
    });
    it('returns an active note receiving a note on', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      expect(mpeInstrument.activeNotes().length).to.equal(1);
    });
    it('treats a zero velocity note on as a middle velocity note off', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.processMidiMessage(ZERO_VELOCITY_NOTE_OFF_1);
      expect(mpeInstrument.activeNotes().length).to.equal(0);
    });
    it('removes specific activeNotes with note off', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      const stateAfterNoteOne = mpeInstrument.activeNotes();
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      mpeInstrument.processMidiMessage(NOTE_OFF_2);
      expect(mpeInstrument.activeNotes()).to.deep.equal(stateAfterNoteOne);
    });
    it('returns an two active notes receiving two note ons', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      expect(mpeInstrument.activeNotes().length).to.equal(2);
    });
  });
});
