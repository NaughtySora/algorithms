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

const there = findIndex.call([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);

/**
 * @description
 * Binary search O(log n)
 * Divide and conquer (D&C)
 * 
 * Array has to be sorted
 * 
 * Good for cpu pipelines
 * 
 * Predictable jumps
 * No pointer chasing
 * Even with 1M elements only 20 comparisons

 */

function search(index) {
  if (index < 0 || index > this.length) return -1;
  let step = 0;
  let last = this.length - 1;
  while (step <= last) {
    const middle = (step + last) >> 1;
    if (middle < index) {
      step = middle + 1;
      continue;
    }
    if (middle > index) {
      last = middle - 1;
      continue;
    }
    return this[middle];
  }
  return -1;
}

const seven = search.call([1, 2, 3, 4, 5, 6, 7, 8, 9], 6);

/**
 * @description
 * Exponential Search
 * Can search sequences without a bound,
 * index phase O(log k), k = index of value
 * binary search O(log k)
 * Array has to be sorted
 * 
 * Faster than binary search when target is closer to start
 */

function expo(value) {
  let i = 1;
  const max = this.length - 1;
  while (this[i] < value && i < max) i <<= 1;
  let left = i >> 1;
  let right = Math.min(i, max);
  while (left <= right) {
    const middle = (left + right) >> 1;
    const current = this[middle];
    if (current < value) {
      left = middle + 1;
      continue;
    }
    if (current > value) {
      right = middle - 1;
      continue;
    }
    return middle;
  }
  return -1;
}


const array = Array.from({ length: 1000 }, (_, i) => i);
const s = expo.call(array, 699);

console.log(s);