import { expect } from 'chai';
import { MpeInstrument } from '../lib';
import 'chai';


const NOTE_ON_1 = new Uint8Array([0x92, 60, 127]);
const NOTE_ON_2 = new Uint8Array([0x93, 62, 127]);
const NOTE_ON_2_SAME_CHANNEL = new Uint8Array([0x93, 64, 127]);
const NOTE_OFF_1_ZERO_VELOCITY = new Uint8Array([0x82, 60, 0]);
const NOTE_OFF_2 = new Uint8Array([0x83, 62, 127]);

const PITCH_BEND = new Uint8Array([0xe3, 127, 127]);
const TIMBRE = new Uint8Array([0xb3, 74, 127]);
const PRESSURE = new Uint8Array([0xd3, 127, 127]);

const channelScopeMessages = { PITCH_BEND, TIMBRE, PRESSURE };

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
  });
  describe('#processMidiMessage()', () => {
    beforeEach(() => {
      mpeInstrument = new MpeInstrument();
    });
    it('creates an active note given a note on', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      expect(mpeInstrument.activeNotes().length).to.equal(1);
    });
    it('can create two notes on the same channel', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      mpeInstrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      expect(mpeInstrument.activeNotes().length).to.equal(2);
    });
    it('treats a zero velocity note on as a note off', () => {
      // TODO: check noteOffVelocity.
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.processMidiMessage(NOTE_OFF_1_ZERO_VELOCITY);
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

    for (const key in channelScopeMessages) {
      const messageName = key.toLowerCase().replace(/_/g, ' ');
      const message = channelScopeMessages[key];
      it(`${messageName} change affects all notes on channel`, () => {
        mpeInstrument.processMidiMessage(NOTE_ON_2);
        mpeInstrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
        const state1 = mpeInstrument.activeNotes();
        mpeInstrument.processMidiMessage(message);
        const state2 = mpeInstrument.activeNotes();
        expect(state1).not.to.deep.equal(state2);
      });
      it(`${messageName} change doesn't affect other channels`, () => {
        mpeInstrument.processMidiMessage(NOTE_ON_1);
        const state1 = mpeInstrument.activeNotes();
        mpeInstrument.processMidiMessage(message);
        const state2 = mpeInstrument.activeNotes();
        expect(state1).to.deep.equal(state2);
      });
    }
  });
});
