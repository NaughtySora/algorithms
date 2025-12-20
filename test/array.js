'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { search: { linear } } = require("../lib/array.js");

describe('Array', () => {
  describe('search', () => {
    it('linear', () => {
      const array = [3, 6, 1, 3, -11, 6];
      assert.equal(linear.call(array, -11), 4);
    });
  });
});