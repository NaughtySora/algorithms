'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { SLL, cycles, mergeSort, middle, splitHalf } = require('../lib/list.js');

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
});