import { expect } from 'chai';
import { createRecorder } from '../../lib';
import chai from 'chai';

let recorder;

describe('Recorder', () => {
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
