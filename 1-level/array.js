'use strict';

/**
 * @description
 * Searching algorithms
 * 
 */

/**
 * @description
 * Linear Search O(n)
 * Sequential access, cache friendly
 * Beats binary search with small arrays
 * 
 * Use when: array unsorted or tiny(<32 elements)
 * 
 */

function findIndex(target) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === target) return i;
  }
  return -1;
}

/**
 * @description
 * Searching algorithms
 * 
 */
