'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  search: { linear, binary, exponential, interpolation, jump },
  sort: { mergeSort, quickSort: { hoareQuickSort, lomutoQuickSort } },
  subarray: { max, counting, }
} = require("../lib/array.js");

const MIN = -5000;
const MAX = 5000;

const array = () => Array.from(
  { length: 10 },
  () => Math.floor(Math.random() * (MAX - MIN) + MIN),
);

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

  describe('sort', () => {
    it('quickSort hoare', () => {
      const arr = [5, -3, 9, -24, 9, 0, 0, 1, 3, 15, 90, -2];
      const arr2 = arr.slice(0);
      arr.sort((a, b) => a - b);
      hoareQuickSort.call(arr2);
      assert.deepEqual(arr, arr2);
    });

    it('quickSort lomuto', () => {
      const arr = [5, -3, 9, -24, 9, 0, 0, 1, 3, 15, 90, -2];
      const arr2 = arr.slice(0);
      arr.sort((a, b) => a - b);
      lomutoQuickSort.call(arr2);
      assert.deepEqual(arr, arr2);
    });

    it('mergeSort', () => {
      const example = [5, -3, 9, -24, 9, 0, 0, 1, 3, 15, 90, -2];
      const arr = example.slice(0);
      arr.sort((a, b) => a - b);
      const arr2 = mergeSort.call(example);
      assert.deepEqual(arr, arr2);
    });
  });

  describe('subarray', () => {
    const arr = [5, -3, 9, -24, 9, 0, -1, 1, -3, 15, 16, 2];
    it('max', () => {
      const { value, range } = max.call(arr);
      assert.equal(value, 39);
      assert.deepEqual(range, [4, 11]);
    });

    it('counting', () => {
      const count = counting.call(arr, 2);
      assert.equal(count, 2);
    });
  });
  
});