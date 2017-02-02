import { expect } from 'chai';
import mpeInstrument from '../../lib';
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

let instrument;
let states;

describe('mpeInstrument', () => {
  /* eslint-disable no-console */
  describe('initialization options', () => {
    describe('default', () => {
      beforeEach(() => {
        instrument = mpeInstrument();
        sinon.stub(console, 'log');
      });
      it('doesn\'t log a note creation event by default', () => {
        try {
          instrument.processMidiMessage(NOTE_ON_1);
          expect(console.log).not.to.be.called;
        } finally {
          // Moving this line to `afterEach` mutes test output.
          console.log.restore();
        }
      });
    });
    describe('log', () => {
      beforeEach(() => {
        instrument = mpeInstrument({ log: true });
        sinon.stub(console, 'log');
      });
      it('logs a note creation event', () => {
        try {
          instrument.processMidiMessage(NOTE_ON_1);
          expect(console.log).to.have.callCount(1);
        } finally {
          // Moving this line to `afterEach` mutes test output.
          console.log.restore();
        }
      });
      it('doesn\'t log messages that don\'t change activeNotes', () => {
        try {
          instrument.processMidiMessage(NOTE_OFF_1);
          instrument.processMidiMessage(PITCH_BEND);
          instrument.processMidiMessage(TIMBRE);
          instrument.processMidiMessage(PRESSURE);
          expect(console.log).to.have.callCount(1);
        } finally {
          // Moving this line to `afterEach` mutes test output.
          console.log.restore();
        }
      });
    });
    describe('normalize', () => {
      beforeEach(() => {
        instrument = mpeInstrument({ normalize: true });
      });
      it('should have normalized timbre values', () => {
        instrument.processMidiMessage(NOTE_ON_1);
        instrument.processMidiMessage(NOTE_ON_2);
        expect(instrument.activeNotes().every(n => n.timbre <= 1 && n.pitchBend >= 0)).to.be.true;
      });
      it('should have normalized noteOnVelocity values', () => {
        instrument.processMidiMessage(NOTE_ON_1);
        instrument.processMidiMessage(NOTE_ON_2);
        expect(instrument.activeNotes().every(n => n.noteOnVelocity <= 1 && n.pitchBend >= 0)).to.be.true;
      });
      it('should have normalized pitch bend values', () => {
        instrument.processMidiMessage(NOTE_ON_1);
        instrument.processMidiMessage(NOTE_ON_2);
        expect(instrument.activeNotes().every(n => n.pitchBend <= 1 && n.pitchBend >= -1)).to.be.true;
      });
      it('should have normalized pressure values', () => {
        instrument.processMidiMessage(NOTE_ON_1);
        instrument.processMidiMessage(NOTE_ON_2);
        expect(instrument.activeNotes().every(n => n.pressure <= 1 && n.pressure >= -1)).to.be.true;
      });
      it('should have normalized noteOffVelocity values', () => {
        let states = [];
        instrument.processMidiMessage(NOTE_ON_1);
        instrument.subscribe((newState) => states = [...states, newState]);
        instrument.processMidiMessage(NOTE_OFF_1);
        expect(states.length).to.equal(2);
        expect(states[0][0].noteOffVelocity).to.equal(1);
      });
      it('should follow normal note update and removal behaviours', () => {
        instrument.processMidiMessage(NOTE_ON_1);
        instrument.processMidiMessage(NOTE_ON_2);
        expect(instrument.activeNotes()[1].timbre).to.be.above(0.49).and.below(0.51);
        instrument.processMidiMessage(TIMBRE);
        expect(instrument.activeNotes().length).to.eq(2);
        expect(instrument.activeNotes()[1].timbre).to.eq(1);
        instrument.processMidiMessage(NOTE_OFF_2);
        expect(instrument.activeNotes().length).to.eq(1);
        instrument.processMidiMessage(NOTE_OFF_1);
        expect(instrument.activeNotes().length).to.eq(0);
      });
    });
  });
  /* eslint-enable no-console */
  describe('#activeNotes()', () => {
    beforeEach(() => {
      instrument = mpeInstrument();
    });
    it('returns an empty array on initialization', () => {
      expect(instrument.activeNotes()).to.be.instanceof(Array);
      expect(instrument.activeNotes()).to.be.empty;
    });
  });
  describe('#processMidiMessage()', () => {
    beforeEach(() => {
      instrument = mpeInstrument();
    });
    it('creates an active note given a note on', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      expect(instrument.activeNotes().length).to.equal(1);
    });
    it('defaults note on pitch bend to 8192', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      expect(instrument.activeNotes()[0].pitchBend).to.equal(8192);
    });
    it('defaults note on timbre to 8192', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      expect(instrument.activeNotes()[0].timbre).to.equal(8192);
    });
    it('defaults note on pressure to 0', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      expect(instrument.activeNotes()[0].pressure).to.equal(0);
    });
    it('can create two notes on the same channel', () => {
      instrument.processMidiMessage(NOTE_ON_2);
      instrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      expect(instrument.activeNotes().length).to.equal(2);
    });
    it('removes the active note specified by note off', () => {
      instrument.processMidiMessage(NOTE_ON_2);
      expect(instrument.activeNotes().length).to.equal(1);
      instrument.processMidiMessage(NOTE_OFF_2);
      expect(instrument.activeNotes().length).to.equal(0);
    });
    it('registers note off velocity', () => {
      let states = [];
      instrument.processMidiMessage(NOTE_ON_1);
      instrument.subscribe((newState) => states = [...states, newState]);
      instrument.processMidiMessage(NOTE_OFF_1);
      expect(states.length).to.equal(2);
      expect(states[0][0].noteOffVelocity).to.equal(127);
    });
    it('treats a zero velocity note on as a middle velocity note off', () => {
      let states = [];
      instrument.processMidiMessage(NOTE_ON_1);
      instrument.subscribe((newState) => states = [...states, newState]);
      instrument.processMidiMessage(NOTE_OFF_1_ZERO_VELOCITY);
      expect(states.length).to.equal(2);
      expect(states[1].length).to.equal(0);
      expect(states[0][0].noteOffVelocity).to.equal(64);
    });
    it('ignores note off unless both channel and note number match', () => {
      instrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      instrument.processMidiMessage(NOTE_ON_2_SAME_NOTE_NUMBER);
      const state1 = instrument.activeNotes();
      instrument.processMidiMessage(NOTE_OFF_2);
      const state2 = instrument.activeNotes();
      expect(state2).to.deep.equal(state1);
    });
    it('returns an two active notes receiving two note ons', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      instrument.processMidiMessage(NOTE_ON_2);
      expect(instrument.activeNotes().length).to.equal(2);
    });

    for (const key in channelScopeMessages) {
      const messageName = key.toLowerCase().replace(/_/g, ' ');
      const message = channelScopeMessages[key];
      it(`applies ${messageName} change to all notes on channel`, () => {
        instrument.processMidiMessage(NOTE_ON_2);
        instrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
        const state1 = instrument.activeNotes();
        instrument.processMidiMessage(message);
        const state2 = instrument.activeNotes();
        expect(state2).not.to.deep.equal(state1);
      });
      it(`doesn't apply ${messageName} change to notes on other channels`, () => {
        instrument.processMidiMessage(NOTE_ON_1);
        const state1 = instrument.activeNotes();
        instrument.processMidiMessage(message);
        const state2 = instrument.activeNotes();
        expect(state2).to.deep.equal(state1);
      });
      it(`applies ${messageName} change to the following note on`, () => {
        instrument.processMidiMessage(NOTE_ON_2);
        const state1 = instrument.activeNotes();
        instrument.processMidiMessage(NOTE_OFF_2);
        instrument.processMidiMessage(message);
        instrument.processMidiMessage(NOTE_ON_2);
        const state2 = instrument.activeNotes();
        expect(state2).not.to.deep.equal(state1);
      });
    }
    it('resets channel scope after a note on on the same channel', () => {
      instrument.processMidiMessage(PITCH_BEND);
      instrument.processMidiMessage(TIMBRE);
      instrument.processMidiMessage(PRESSURE);
      instrument.processMidiMessage(NOTE_ON_2);
      instrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      instrument.processMidiMessage(NOTE_OFF_2);
      const state = instrument.activeNotes();
      expect(state[0].noteNumber).to.equal(NOTE_ON_2_SAME_CHANNEL[1]);
      expect(state[0].pitchBend).to.equal(8192);
      expect(state[0].timbre).to.equal(8192);
      expect(state[0].pressure).to.equal(0);
    });
    it('resets channel scope after a note off', () => {
      instrument.processMidiMessage(NOTE_ON_2);
      instrument.processMidiMessage(PITCH_BEND);
      instrument.processMidiMessage(TIMBRE);
      instrument.processMidiMessage(PRESSURE);
      instrument.processMidiMessage(NOTE_OFF_2);
      instrument.processMidiMessage(NOTE_ON_2_SAME_CHANNEL);
      const state = instrument.activeNotes();
      expect(state[0].pitchBend).to.equal(8192);
      expect(state[0].timbre).to.equal(8192);
      expect(state[0].pressure).to.equal(0);
    });
    it('doesn\'t reset channel scope after a note on another channel', () => {
      instrument.processMidiMessage(PITCH_BEND);
      instrument.processMidiMessage(TIMBRE);
      instrument.processMidiMessage(PRESSURE);
      instrument.processMidiMessage(NOTE_ON_1);
      instrument.processMidiMessage(NOTE_OFF_1);
      instrument.processMidiMessage(NOTE_ON_2);
      const state = instrument.activeNotes();
      expect(state[0].pitchBend).not.to.equal(8192);
      expect(state[0].timbre).not.to.equal(8192);
      expect(state[0].pressure).not.to.equal(0);
    });
    it('applies all notes off messages', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      instrument.processMidiMessage(NOTE_ON_2);
      expect(instrument.activeNotes().length).to.equal(2);
      instrument.processMidiMessage(ALL_NOTES_OFF);
      expect(instrument.activeNotes().length).to.equal(0);
    });
    it('ignores all notes off message on a note channel', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      instrument.processMidiMessage(NOTE_ON_2);
      expect(instrument.activeNotes().length).to.equal(2);
      instrument.processMidiMessage(ALL_NOTES_OFF_NOTE_CHANNEL);
      expect(instrument.activeNotes().length).to.equal(2);
    });
  });
  describe('#subscribe()', () => {
    beforeEach(() => {
      instrument = mpeInstrument();
      states = [];
      instrument.subscribe((newState) => states = [...states, newState]);
    });
    it('is triggered by note on and off messages', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      instrument.processMidiMessage(NOTE_OFF_1);
      expect(states.length).to.equal(3);
    });
    it('is triggered by channel scope messages with effects', () => {
      instrument.processMidiMessage(NOTE_ON_2);
      instrument.processMidiMessage(PITCH_BEND);
      instrument.processMidiMessage(TIMBRE);
      instrument.processMidiMessage(PRESSURE);
      expect(states.length).to.equal(4);
    });
    it('ignores channel scope messages with no effect', () => {
      for (const message in channelScopeMessages) {
        instrument.processMidiMessage(message);
      }
      expect(states.length).to.equal(0);
    });
    it('ignores note off messages with no effect', () => {
      instrument.processMidiMessage(NOTE_OFF_1);
      expect(states.length).to.equal(0);
    });
  });
  describe('#clear()', () => {
    it('clears all notes', () => {
      instrument.processMidiMessage(NOTE_ON_1);
      instrument.processMidiMessage(NOTE_ON_2);
      expect(instrument.activeNotes().length).to.equal(2);
      instrument.clear();
      expect(instrument.activeNotes().length).to.equal(0);
    });
  });
});
