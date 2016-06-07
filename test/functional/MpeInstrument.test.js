import { expect } from 'chai';
import { createMpeInstrument } from '../../lib';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

// A c' note on, max velocity, on channel 2.
const NOTE_ON_1 = new Uint8Array([0x91, 60, 127]);
// A note off for NOTE_ON_1.
const NOTE_OFF_1 = new Uint8Array([0x81, 60, 127]);
// A note off for NOTE_ON_1, using a zero velocity note on.
const NOTE_OFF_1_ZERO_VELOCITY = new Uint8Array([0x91, 60, 0]);
// A d' note on, max velocity, on channel 3.
const NOTE_ON_2 = new Uint8Array([0x92, 62, 127]);
// A copy of NOTE_ON_2, but on channel 4.
const NOTE_ON_2_SAME_NOTE_NUMBER = new Uint8Array([0x93, 62, 127]);
// A e' note on, max velocity, on the same channel as NOTE_ON_2.
const NOTE_ON_2_SAME_CHANNEL = new Uint8Array([0x92, 64, 127]);
// A note off for NOTE_ON_2.
const NOTE_OFF_2 = new Uint8Array([0x82, 62, 127]);
// An all notes off message.
const ALL_NOTES_OFF = new Uint8Array([0xb0, 123, 0]);
// An all notes off message, sent erroneously on a note channel.
const ALL_NOTES_OFF_NOTE_CHANNEL = new Uint8Array([0xb1, 123, 0]);
// A pitch bend message, max value, on channel 3.
const PITCH_BEND = new Uint8Array([0xe2, 127, 127]);
// A timbre message, max value, on channel 3.
const TIMBRE = new Uint8Array([0xb2, 74, 127]);
// A pressure message, max value, on channel 3.
const PRESSURE = new Uint8Array([0xd2, 127, 127]);
const channelScopeMessages = { PITCH_BEND, TIMBRE, PRESSURE };

let mpeInstrument;
let states;

describe('MpeInstrument', () => {
  /* eslint-disable no-console */
  describe('initialization options', () => {
    describe('default', () => {
      beforeEach(() => {
        mpeInstrument = createMpeInstrument();
        sinon.stub(console, 'log');
      });
      it('doesn\'t log a note creation event by default', () => {
        try {
          mpeInstrument.processMidiMessage(NOTE_ON_1);
          expect(console.log).not.to.be.called;
        } finally {
          // Moving this line to `afterEach` mutes test output.
          console.log.restore();
        }
      });
    });
    describe('log', () => {
      beforeEach(() => {
        mpeInstrument = createMpeInstrument({ log: true });
        sinon.stub(console, 'log');
      });
      it('logs a note creation event', () => {
        try {
          mpeInstrument.processMidiMessage(NOTE_ON_1);
          expect(console.log).to.have.callCount(1);
        } finally {
          // Moving this line to `afterEach` mutes test output.
          console.log.restore();
        }
      });
      it('doesn\'t log messages that don\'t change activeNotes', () => {
        try {
          mpeInstrument.processMidiMessage(NOTE_OFF_1);
          mpeInstrument.processMidiMessage(PITCH_BEND);
          mpeInstrument.processMidiMessage(TIMBRE);
          mpeInstrument.processMidiMessage(PRESSURE);
          expect(console.log).to.have.callCount(1);
        } finally {
          // Moving this line to `afterEach` mutes test output.
          console.log.restore();
        }
      });
    });
  });
  /* eslint-enable no-console */
  describe('#activeNotes()', () => {
    beforeEach(() => {
      mpeInstrument = createMpeInstrument();
    });
    it('returns an empty array on initialization', () => {
      expect(mpeInstrument.activeNotes()).to.be.instanceof(Array);
      expect(mpeInstrument.activeNotes()).to.be.empty;
    });
  });
  describe('#processMidiMessage()', () => {
    beforeEach(() => {
      mpeInstrument = createMpeInstrument();
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
    it('resets channel scope after a note on on the same channel', () => {
      mpeInstrument.processMidiMessage(PITCH_BEND);
      mpeInstrument.processMidiMessage(TIMBRE);
      mpeInstrument.processMidiMessage(PRESSURE);
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      mpeInstrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      mpeInstrument.processMidiMessage(NOTE_OFF_2);
      const state = mpeInstrument.activeNotes();
      expect(state[0].noteNumber).to.equal(NOTE_ON_2_SAME_CHANNEL[1]);
      expect(state[0].pitchBend).to.equal(8192);
      expect(state[0].timbre).to.equal(8192);
      expect(state[0].pressure).to.equal(0);
    });
    it('resets channel scope after a note off', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      mpeInstrument.processMidiMessage(PITCH_BEND);
      mpeInstrument.processMidiMessage(TIMBRE);
      mpeInstrument.processMidiMessage(PRESSURE);
      mpeInstrument.processMidiMessage(NOTE_OFF_2);
      mpeInstrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      const state = mpeInstrument.activeNotes();
      expect(state[0].pitchBend).to.equal(8192);
      expect(state[0].timbre).to.equal(8192);
      expect(state[0].pressure).to.equal(0);
    });
    it('doesn\'t reset channel scope after a note on another channel', () => {
      mpeInstrument.processMidiMessage(PITCH_BEND);
      mpeInstrument.processMidiMessage(TIMBRE);
      mpeInstrument.processMidiMessage(PRESSURE);
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.processMidiMessage(NOTE_OFF_1);
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      const state = mpeInstrument.activeNotes();
      expect(state[0].pitchBend).not.to.equal(8192);
      expect(state[0].timbre).not.to.equal(8192);
      expect(state[0].pressure).not.to.equal(0);
    });
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
      mpeInstrument.processMidiMessage(ALL_NOTES_OFF_NOTE_CHANNEL);
      expect(mpeInstrument.activeNotes().length).to.equal(2);
    });
  });
  describe('#subscribe()', () => {
    beforeEach(() => {
      mpeInstrument = createMpeInstrument();
      states = [];
      mpeInstrument.subscribe((newState) => states = [...states, newState]);
    });
    it('is triggered by note on and off messages', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_1);
      mpeInstrument.processMidiMessage(NOTE_OFF_1);
      expect(states.length).to.equal(3);
    });
    it('is triggered by channel scope messages with effects', () => {
      mpeInstrument.processMidiMessage(NOTE_ON_2);
      mpeInstrument.processMidiMessage(PITCH_BEND);
      mpeInstrument.processMidiMessage(TIMBRE);
      mpeInstrument.processMidiMessage(PRESSURE);
      expect(states.length).to.equal(4);
    });
    it('ignores channel scope messages with no effect', () => {
      for (const message in channelScopeMessages) {
        mpeInstrument.processMidiMessage(message);
      }
      expect(states.length).to.equal(0);
    });
    it('ignores note off messages with no effect', () => {
      mpeInstrument.processMidiMessage(NOTE_OFF_1);
      expect(states.length).to.equal(0);
    });
  });
});
