import { expect } from 'chai';
import { createRecorder } from '../../lib';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

let recorder;

describe('Recorder', () => {
  /* eslint-disable no-console */
  describe('initialization options', () => {
    describe('default', () => {
      before(() => {
        recorder = createRecorder({ logc: true });
        sinon.stub(console, 'log');
      });
      it('doesn\'t log a record call by default', () => {
        try {
          recorder.record('hello', 0);
          expect(console.log).to.have.not.been.called;
        } finally {
          // Moving this line to `afterEach` mutes test output.
          console.log.restore();
        }
      });
    });
    describe('log', () => {
      before(() => {
        recorder = createRecorder({ log: true });
        sinon.stub(console, 'log');
      });
      it('logs a record call with log set to true', () => {
        try {
          recorder.record('Hi', 0);
          expect(console.log).to.have.callCount(2);
        } finally {
          // Moving this line to `afterEach` mutes test output.
          console.log.restore();
        }
      });
    });
  });
  /* eslint-enable no-console */
  describe('#record()', () => {
    beforeEach(() => {
      recorder = createRecorder();
    });
    it('records a string passed as input', () => {
      recorder.record('hello', 0);
      expect(recorder.dump()).to.deep.eq([{ time: 0, message: 'hello' }]);
    });
    it('records an object given as input', () => {
      recorder.record({ foo: 'bar', baz: 42 }, 1000);
      expect(recorder.dump()).to.deep.eq(
        [{ time: 1000, message: { foo: 'bar', baz: 42 } }]
      );
    });
    it('records an array given as input', () => {
      recorder.record(['foo', 'bar', 'baz'], 3000);
      expect(recorder.dump()).to.deep.eq(
        [{ time: 3000, message: ['foo', 'bar', 'baz'] }]
      );
    });
    it('records multiple messages', () => {
      recorder.record('Hi', 0);
      recorder.record('there!', 1);
      expect(recorder.dump()).to.deep.eq(
        [{ time: 0, message: 'Hi' }, { time: 1, message: 'there!' }]
      );
    });
  });
  describe('#dump', () => {
    beforeEach(() => {
      recorder = createRecorder();
    });
    it('returns messages in time order', () => {
      recorder.record('there!', 1);
      recorder.record('Hi', 0);
      expect(recorder.dump()[0]).to.deep.eq({ time: 0, message: 'Hi' });
    });
  });
});
