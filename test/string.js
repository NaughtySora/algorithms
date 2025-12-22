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
    const str2 = 'It is the mark of an educated mind to be \
    able to entertain a thought without accepting it';

    assert.equal(
      substring.call(str2, 'to'),
      str2.indexOf('to'),
    );
  });
});