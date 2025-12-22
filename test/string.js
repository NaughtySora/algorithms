'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { substring, window } = require('../lib/string.js');

describe('string', () => {
  it('substring', () => {
    const str = 'The roots of education are bitter, but the fruit is sweet';
    assert.equal(
      substring.call(str, 'are bit'),
      str.indexOf('are bit'),
    );

    assert.equal(
      substring.call(str, 'Quality is'),
      str.indexOf('Quality is'),
    );
  });
});