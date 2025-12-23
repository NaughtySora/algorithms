'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  SLL, cycles, mergeSort,
  middle, splitHalf, reverse, sublistReverse
} = require('../lib/list.js');

describe('Linked List', () => {
  it('detect cycles', () => {
    const list = new SLL();
    const node = list.push({ a: 1 });
    list.push({ b: 1 });
    list.push({ c: 1 });

    assert.equal(cycles.call(list), false);

    const dNode = list.push({ d: 1 });
    dNode.next = node;
    assert.ok(cycles.call(list));
  });

  it('finding middle', () => {
    const list = new SLL();
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);
    list.push(5);
    assert.equal(middle.call(list).value, 3);
  });

  it('split into half and return new list', () => {
    const list = new SLL();
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);
    list.push(5);
    assert.deepEqual(splitHalf.call(list).toJSON(), [4, 5]);
    assert.deepEqual(list.toJSON(), [1, 2, 3]);
  });

  it('mergeSort', () => {
    const list = new SLL();
    list.push(3);
    list.push(-26);
    list.push(0);
    list.push(1);
    list.push(1);
    list.push(19);
    list.push(-9);
    list.push(5);
    list.push(0);
    mergeSort.call(list);
    assert.deepEqual(list.toJSON(), [-26, -9, 0, 0, 1, 1, 3, 5, 19]);
  });

  it('reversing list', () => {
    const list = new SLL();
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);
    reverse.call(list);
    assert.deepEqual(list.toJSON(), [4, 3, 2, 1]);
  });

  it('sublist reversing', () => {
    const list = new SLL();
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);
    list.push(5);
    list.push(6);
    assert.deepEqual(list.toJSON(), [1, 2, 3, 4, 5, 6]);
    sublistReverse.call(list, 2, 4);
    assert.deepEqual(list.toJSON(), [1, 4, 3, 2, 5, 6]);
  });
});