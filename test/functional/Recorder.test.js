import { expect } from 'chai';
import { createRecorder } from '../../lib';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

let recorder;

describe('Recorder', () => {
  describe('#record()', () => {
    beforeEach(() => {
      recorder = createRecorder();
    });
    it('records messages passed as input', () => {
      recorder.record('hello', 0);
      expect(recorder.dump()).to.deep.eq([{ time: 0, message: 'hello' }]);
    });
    it('records multiple messages', () => {
      recorder.record('Hi', 0);
      recorder.record('there!', 1);
      expect(recorder.dump().length).to.eq(2);
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
