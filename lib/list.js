'use strict';

/**
 * @description
 * primitive Single Linked List (SLL)
 * 
 * pop - O(n)
 * push, unshift, shift - O(1)
 */

class SLL {
  #head = null;
  #tail = null;

  push(value) {
    const node = { value, next: null };
    if (this.#head === null) this.#head = node;
    else this.#tail.next = node;
    this.#tail = node;
    return node;
  }

  unshift(value) {
    const node = { value, next: null };
    if (this.#head === null) this.#tail = node;
    else node.next = this.#head;
    this.#head = node;
    return node;
  }

  pop() {
    if (this.#head === null) return null;
    const head = this.#head;
    if (head.next === null) {
      this.#tail = this.#head = null;
      return head;
    }
    let node = head;
    const tail = this.#tail;
    while (node.next !== tail) node = node.next;
    this.#tail = node;
    node.next = null;
    return tail;
  }

  shift() {
    if (this.#head === null) return null;
    const head = this.#head;
    this.#head = head.next;
    if (this.#head === null) this.#tail = null;
    head.next = null;
    return head;
  }
}

/**
 * @description Slow/Fast pointers
 * - detect cycles
 * - find middle
 * - split or reorder
 * 
 * 
 */