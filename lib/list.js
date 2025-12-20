'use strict';

/**
 * @description
 * primitive Single Linked List (SLL)
 * protected head/list to use in current module context
 * 
 * pop - O(n)
 * push, unshift, shift - O(1)
 */

const head = Symbol('kHead');
const tail = Symbol('kTail');

function protect(name) {
  Object.defineProperty(this,
    name, { value: this[name], enumerable: false },
  );
}

class SLL {
  [head] = null;
  [tail] = null;

  constructor() {
    protect.call(this, head);
    protect.call(this, tail);
  }

  push(value) {
    const node = { value, next: null };
    if (this[head] === null) this[head] = node;
    else this[tail].next = node;
    this[tail] = node;
    return node;
  }

  unshift(value) {
    const node = { value, next: null };
    if (this[head] === null) this[tail] = node;
    else node.next = this[head];
    this[head] = node;
    return node;
  }

  pop() {
    if (this[head] === null) return null;
    const head = this[head];
    if (head.next === null) {
      this[tail] = this[head] = null;
      return head;
    }
    let node = head;
    const tail = this[tail];
    while (node.next !== tail) node = node.next;
    this[tail] = node;
    node.next = null;
    return tail;
  }

  shift() {
    if (this[head] === null) return null;
    const head = this[head];
    this[head] = head.next;
    if (this[head] === null) this[tail] = null;
    head.next = null;
    return head;
  }

  toJSON() {
    if (this[head] === null) return [];
    let pointer = this[head];
    const output = [];
    while (pointer !== null) {
      output.push(pointer.value);
      pointer = pointer.next;
    }
    return output;
  }
}

/**
 * @description Slow/Fast pointers
 * find middle
 * detect cycles
 * split or reorder
 */

function middle() {
  let slow = this[head];
  if (slow === null) return null;
  if (slow.next === null) return slow;
  let fast = this[head].next.next;
  while (fast !== null) {
    slow = slow.next;
    fast = fast?.next?.next ?? null;
  }
  return slow;
}

function cycles() {
  let slow = this[head];
  if (slow === null) return false;
  if (slow.next === null) return false;
  let fast = this[head].next.next;
  while (fast !== null) {
    if (slow === fast) return true;
    slow = slow.next;
    fast = fast?.next?.next ?? null;
  }
  return false;
}

function splitHalf() {
  let slow = this[head];
  const list = new SLL();
  if (slow === null) return list;
  if (slow.next === null) return list;
  let fast = this[head].next.next;
  while (fast !== null) {
    fast = fast?.next?.next ?? null;
    slow = slow.next;
  }
  list[head] = slow.next;
  slow.next = null;
  list[tail] = this[tail];
  list[tail].next = null;
  this[tail] = slow;
  return list;
}

/**
 * @description MergeSort
 * 
 * good for lists, easy split, O(1) memory
 * O(n log n) time
 */

function mergeSort(list) {
  const target = list ?? this[head];
  if (target.next === null) return target;
  let slow = target, fast = target;
  do {
    fast = fast.next.next;
    if (fast === null || fast.next === null) {
      const current = slow;
      slow = slow.next;
      current.next = null;
    } else {
      slow = slow.next;
    }
  }
  while (fast !== null && fast.next !== null);
  let left = mergeSort(target);
  let right = mergeSort(slow);
  let l = { next: null };
  let t = l;
  while (left !== null || right !== null) {
    if (right === null) {
      t.next = left;
      left = left.next;
    } else if (left === null) {
      t.next = right;
      right = right.next;
    } else if (left.value > right.value) {
      t.next = right;
      right = right.next;
    } else {
      t.next = left;
      left = left.next;
    }
    t = t.next;
  }
  if (this !== undefined) {
    this[head] = l.next;
    this[tail] = t;
  }
  return l.next;
}

module.exports = { middle, cycles, splitHalf, SLL };