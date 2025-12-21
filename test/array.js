'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  search: { linear, binary, exponential, interpolation, jump },
} = require("../lib/array.js");

describe('Array', () => {
  describe('search', () => {
    const long = Array.from({ length: 1000 }, (_, i) => i);
    const short = [3, 6, 10, 24];
    const one = [3];
    const empty = [];
    [
      linear,
      binary,
      exponential,
      interpolation,
      jump,
    ].forEach(test);

    function test(fn) {
      it(fn.name, () => {
        assert.equal(fn.call(long, 331), long.indexOf(331));
        assert.equal(fn.call(long, 0), long.indexOf(0));
        assert.equal(fn.call(long, 999), long.indexOf(999));
        assert.equal(fn.call(long, 234562), -1);
        assert.equal(fn.call(short, 3), short.indexOf(3));
        assert.equal(fn.call(short, 6), short.indexOf(6));
        assert.equal(fn.call(short, 10), short.indexOf(10));
        assert.equal(fn.call(short, 24), short.indexOf(24));
        assert.equal(fn.call(one, 3), one.indexOf(3));
        assert.equal(fn.call(empty, 3), empty.indexOf(3));
      });
    };
  });
});