import { expect } from 'chai';
import fs from 'fs';

describe('license', () => {
  it('contains an up to date copyright notice', () => {
    const license = fs.readFileSync('./LICENSE.txt', 'utf8');
    expect(license).to.include(`Copyright (c) ${new Date().getFullYear()} ROLI Ltd.`);
  });
});
