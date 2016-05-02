import { expect } from 'chai';
import { MpeInstrument } from '../lib';
import 'chai';


const NOTE_ON_1 = new Uint8Array([0x91, 60, 127]);
const NOTE_OFF_1 = new Uint8Array([0x81, 60, 127]);
const NOTE_OFF_1_ZERO_VELOCITY = new Uint8Array([0x91, 60, 0]);
const NOTE_ON_2 = new Uint8Array([0x92, 62, 127]);
const NOTE_ON_2_SAME_NOTE_NUMBER = new Uint8Array([0x93, 62, 127]);
const NOTE_ON_2_SAME_CHANNEL = new Uint8Array([0x92, 64, 127]);
const NOTE_OFF_2 = new Uint8Array([0x82, 62, 127]);
const ALL_NOTES_OFF = new Uint8Array([0xb0, 123, 0]);
const ALL_NOTES_OFF_WRONG_CHANNEL = new Uint8Array([0xb1, 123, 0]);

const PITCH_BEND = new Uint8Array([0xe2, 127, 127]);
const TIMBRE = new Uint8Array([0xb2, 74, 127]);
const PRESSURE = new Uint8Array([0xd2, 127, 127]);

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
    it('defaults note on pitch bend to 8192', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      expect(mpeInstrument.activeNotes()[0].pitchBend).to.equal(8192);
    });
    it('defaults note on timbre to 8192', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      expect(mpeInstrument.activeNotes()[0].timbre).to.equal(8192);
    });
    it('defaults note on pressure to 0', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      expect(mpeInstrument.activeNotes()[0].pressure).to.equal(0);
    });
    it('can create two notes on the same channel', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      mpeInstrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      expect(mpeInstrument.activeNotes().length).to.equal(2);
    });
    it('removes the active note specified by note off', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      expect(mpeInstrument.activeNotes().length).to.equal(1);
      mpeInstrument.processMidiMessage(NOTE_OFF_2);
      expect(mpeInstrument.activeNotes().length).to.equal(0);
    });
    it('registers note off velocity', () => {
      let states = [];
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.subscribe((newState) => states = [...states, newState]);
      mpeInstrument.processMidiMessage(NOTE_OFF_1);
      expect(states.length).to.equal(2);
      expect(states[0][0].noteOffVelocity).to.equal(127);
    });
    it('treats a zero velocity note on as a middle velocity note off', () => {
      let states = [];
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.subscribe((newState) => states = [...states, newState]);
      mpeInstrument.processMidiMessage(NOTE_OFF_1_ZERO_VELOCITY);
      expect(states.length).to.equal(2);
      expect(states[1].length).to.equal(0);
      expect(states[0][0].noteOffVelocity).to.equal(64);
    });
    it('ignores note off unless both channel and note number match', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      mpeInstrument.processMidiMessage(NOTE_ON_2_SAME_NOTE_NUMBER);
      const state1 = mpeInstrument.activeNotes();
      mpeInstrument.processMidiMessage(NOTE_OFF_2);
      const state2 = mpeInstrument.activeNotes();
      expect(state2).to.deep.equal(state1);
    });
    it('returns an two active notes receiving two note ons', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      expect(mpeInstrument.activeNotes().length).to.equal(2);
    });

    for (const key in channelScopeMessages) {
      const messageName = key.toLowerCase().replace(/_/g, ' ');
      const message = channelScopeMessages[key];
      it(`applies ${messageName} change to all notes on channel`, () => {
        mpeInstrument.processMidiMessage(NOTE_ON_2);
        mpeInstrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
        const state1 = mpeInstrument.activeNotes();
        mpeInstrument.processMidiMessage(message);
        const state2 = mpeInstrument.activeNotes();
        expect(state2).not.to.deep.equal(state1);
      });
      it(`doesn't apply ${messageName} change to notes on other channels`, () => {
        mpeInstrument.processMidiMessage(NOTE_ON_1);
        const state1 = mpeInstrument.activeNotes();
        mpeInstrument.processMidiMessage(message);
        const state2 = mpeInstrument.activeNotes();
        expect(state2).to.deep.equal(state1);
      });
      it(`applies ${messageName} change to the following note on`, () => {
        mpeInstrument.processMidiMessage(NOTE_ON_2);
        const state1 = mpeInstrument.activeNotes();
        mpeInstrument.processMidiMessage(NOTE_OFF_2);
        mpeInstrument.processMidiMessage(message);
        mpeInstrument.processMidiMessage(NOTE_ON_2);
        const state2 = mpeInstrument.activeNotes();
        expect(state2).not.to.deep.equal(state1);
      });
    }
    it('applies all notes off messages', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      expect(mpeInstrument.activeNotes().length).to.equal(2);
      mpeInstrument.processMidiMessage(ALL_NOTES_OFF);
      expect(mpeInstrument.activeNotes().length).to.equal(0);
    });
    it('ignores all notes off message on a note channel', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      expect(mpeInstrument.activeNotes().length).to.equal(2);
      mpeInstrument.processMidiMessage(ALL_NOTES_OFF_WRONG_CHANNEL);
      expect(mpeInstrument.activeNotes().length).to.equal(2);
    });
  });
});
