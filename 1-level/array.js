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

function linear(target) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === target) return i;
  }
  return -1;
}

const there = linear.call([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);

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
 * 
 * 0[-----]100
 * 0---[--]100
 * 0---|--100
 */

function binary(value) {
  let left = 0;
  let right = this.length - 1;
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

const five = binary.call([1, 2, 3, 4, 5, 6, 7, 8, 9], 6);

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

function exponential(value) {
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
const res = exponential.call(array, 699);

/**
 * @description
 * QuickSort
 * Average O(n log n)
 * Worst-case O(n2) if pivot is bad
 * 
 * The core idea: Partition around a pivot
 * 
 * In-place, requires almost no extra memory O(1)
 * Cache-friendly for arrays
 * Can be adapted to select median, top-k, ...
 * 
 * has 2 variants
 * Hoare: with 2 pointer, Left and Right, 
 * any index pivot (usually Middle or Random, median of first, last, middle elements)
 * 
 * Lomuto: left pointer, store, pivot is last index
 * 
 */

// Hoare
{
  function partition(left, right) {
    const pivot = this[(left + right) >> 1];
    while (true) {
      while (this[left] < pivot) left++;
      while (this[right] > pivot) right--;
      if (left >= right) return right;
      [this[left], this[right]] = [this[right], this[left]];
      left++;
      right--;
    }
  }

  function quicksort() {
    const stack = [0, this.length - 1];
    while (stack.length > 0) {
      const high = stack.pop();
      const low = stack.pop();
      if (low >= high) continue;
      const boundary = partition.call(this, low, high);
      if (low < boundary) stack.push(low, boundary);
      if (boundary + 1 < high) stack.push(boundary + 1, high);
    }
  }
}

function swap(i, j) {
  [this[i], this[j]] = [this[j], this[i]];
}

// Lomuto
{
  function partition(low, high) {
    const pivot = this[high];
    let store = low;
    while (low !== high) {
      if (this[low] < pivot) {
        swap.call(this, low, store);
        store++;
      }
      low++;
    }
    swap.call(this, high, store);
    return store;
  }

  function quicksort() {
    const stack = [0, this.length - 1];
    while (stack.length > 0) {
      const high = stack.pop();
      const low = stack.pop();
       if (low >= high) continue;
      const boundary = partition.call(this, low, high);
      stack.push(low, boundary - 1);
      stack.push(boundary + 1, high);
    }
  }
}


/**
 * @description
 * QuickSelect
 * Average O(n log n)
 * Worst-case O(n2) if pivot is terrible
 * 
 * In-place, requires almost no extra memory
 * Cache-friendly for arrays
 * Can be adapted to select median, top-k, ...
 */