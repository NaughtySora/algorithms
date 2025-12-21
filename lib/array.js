'use strict';

function swap(i, j) {
  [this[i], this[j]] = [this[j], this[i]];
}

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
  if (this.length === 0) return -1;
  for (let i = 0; i < this.length; i++) {
    if (this[i] === target) return i;
  }
  return -1;
}

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
  if (this.length === 0) return -1;
  let left = 0;
  let right = this.length - 1;
  while (left <= right) {
    const middle = (left + right) >> 1;
    const current = this[middle];
    if (current < value) left = middle + 1;
    else if (current > value) right = middle - 1;
    else return middle;
  }
  return -1;
}

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
  if (this.length === 0) return -1;
  let i = 1;
  const max = this.length - 1;
  while (i < max && this[i] < value) i <<= 1;
  let left = i >> 1;
  let right = Math.min(i, max);
  while (left <= right) {
    const middle = (left + right) >> 1;
    const current = this[middle];
    if (current < value) left = middle + 1;
    else if (current > value) right = middle - 1;
    else return middle;
  }
  return -1;
}

/**
 * @description
 * Jump Search
 * ~ O(sqrt(n))
 * searching in sorted array
 * faster than linear search
 * 
 * uses jumps, usually sqrt(n), where n is array length
 * combines jumps and linear search
 * 
 */

function jump(value) {
  if (this.length === 0) return -1;
  const length = this.length;
  const step = Math.floor(Math.sqrt(length));
  let i = 0;
  while (i < length && this[i] < value) i += step;
  let left = Math.max(0, i - step);
  let right = Math.min(i, length - 1);
  for (; left <= right; left++) {
    if (this[left] === value) return left;
  }
  return -1;
}

/**
 * @description
 * Interpolation Search
 * 
 * searches in sorted array
 * 'predicts' where the value can
 * heavily relies on array being uniformly distribute
 * suites for numeric values, strings are not included even if they are numeric too
 *
 */

function interpolation(value) {
  if (this.length === 0) return -1;
  let low = 0;
  let high = this.length - 1;
  while (low <= high) {
    if (value < this[low] || value > this[high]) return -1;
    if (this[high] === this[low]) return this[low] === value ? low : -1;
    const position = (low
      + (value - this[low]) / (this[high] - this[low])
      * (high - low)) >> 0;
    if (position < low || position > high) return -1;
    const current = this[position];
    if (current < value) low = position + 1;
    else if (current > value) high = position - 1;
    else return position;
  }
  return -1;
}

/**
 * @description
 * QuickSelect
 * Finds one value in unsorted array
 * 
 * Average O(n log n)
 * Worst-case O(n2) if pivot is terrible
 * also no extra memory, O(1)
 * Cache friendly for arrays
 * 
 * rank-base search
 * example: 
 * 4th smallest in unsorted array,
 * the median
 * 
 * will not sort a whole array, just finds the value
 *  
 * good for huge static arrays
 */

function quickSelect(k) {
  if (this.length === 0) return -1;
  let low = 0, high = this.length - 1;
  while (true) {
    let store = low;
    for (let i = low; i < high; i++) {
      if (this[i] < this[high]) {
        swap.call(this, i, store);
        store++;
      }
    }
    swap.call(this, store, high);
    if (store === k) return this[store];
    if (store < k) low = store + 1;
    else high = store - 1;
  }
}

/**
 * @description
 * Prefix Sum
 * O(1) for range sum look up
 * precomputes the sums of every range starting from 0
 * 
 * constant time to get sum of ranges.
 */

function prefixSum() {
  const length = this.length;
  const sums = Array(length).fill(0);
  sums[0] = this[0];
  for (let i = 1; i < length; i++) {
    sums[i] = this[i] + sums[i - 1];
  }
  return (start, end) =>
    sums[end] - sums[Math.max(start - 1, 0)];
}

/**
 * @description
 * Kadane, max subarray
 * maximum sum of a contiguous subarray
 * 
 * tracking local sum and global sum to find max subarray
 * also there is a min Kadane simply flipped algorithm tracks min subarray
 * 
 */

function maxSubarray() {
  let local = 0;
  let value = -Infinity;
  let start = -1;
  let end = -1;
  let store = 0;
  for (let i = 0; i < this.length; i++) {
    local += this[i];
    if (local > value) {
      value = local;
      end = i;
      start = store;
    }
    if (local < 0) {
      local = 0;
      store = i + 1;
    }
  }
  return { value, range: [start, end] };
}

/**
 * @description
 * Counting subarray
 * O(n) - time
 * O(n) - space
 * 
 * finding count or all subarray 
 * where sum of elements = target 
 * 
 * array : [1,2,3]
 * target: 3
 * count: 2
 * subarrays: [1,2] and [3]
 * 
 */

function countingSubarray(target) {
  const store = new Map([[0, 1]]);
  let count = 0;
  let running = 0;
  for (let i = 0; i < this.length; i++) {
    const value = this[i];
    running += value;
    const diff = running - target;
    if (store.has(diff)) count += store.get(diff);
    store.set(running, (store.get(running) ?? 0) + 1);
  }
  return count;
}

function countingXORSubarray(target) {
  const store = new Map([[0, 1]]);
  let count = 0;
  let running = 0;
  for (let i = 0; i < this.length; i++) {
    const value = this[i];
    running ^= value;
    const diff = running ^ target;
    if (store.has(diff)) count += store.get(diff);
    store.set(running, (store.get(running) ?? 0) + 1);
  }
  return count;
}

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

function hoarePartition(left, right) {
  const pivot = this[(left + right) >> 1];
  while (true) {
    while (this[left] < pivot) left++;
    while (this[right] > pivot) right--;
    if (left >= right) return right;
    swap.call(this, left, right);
    left++;
    right--;
  }
}

function hoareQuickSort() {
  const stack = [0, this.length - 1];
  while (stack.length > 0) {
    const high = stack.pop();
    const low = stack.pop();
    if (low >= high) continue;
    const boundary = hoarePartition.call(this, low, high);
    if (low < boundary) stack.push(low, boundary);
    if (boundary + 1 < high) stack.push(boundary + 1, high);
  }
}

function lomutoPartition(low, high) {
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

function lomutoQuickSort() {
  const stack = [0, this.length - 1];
  while (stack.length > 0) {
    const high = stack.pop();
    const low = stack.pop();
    if (low >= high) continue;
    const boundary = lomutoPartition.call(this, low, high);
    stack.push(low, boundary - 1);
    stack.push(boundary + 1, high);
  }
}

/**
 * MergeSort
 * O(n log n) performance
 * O(n) space
 * 
 * using D & C approach
 * splits array into half, sort, merges back
 * 
 * if implemented recursively recursion depth is log2(n)
 * 
 * there is counting mergeSort i will not implement it,
 * the same sort but need to count every left - right value swap
 */

function mergeSort(min = 0, max = this.length - 1) {
  if (min === max) return [this[min]];
  const middle = (min + max) >> 1;
  const left = mergeSort.call(this, min, middle);
  const right = mergeSort.call(this, middle + 1, max);
  const limit = left.length + right.length;
  const array = [];
  let l = 0, r = 0;
  while (array.length !== limit) {
    if (l >= left.length) array.push(right[r++]);
    else if (r >= right.length) array.push(left[l++]);
    else if (left[l] > right[r]) array.push(right[r++]);
    else array.push(left[l++]);
  }
  return array;
}

module.exports = {
  search: {
    linear,
    binary,
    exponential,
    jump,
    interpolation,
  },
  sort: {
    quickSort: {
      hoareQuickSort,
      lomutoQuickSort,
    },
    mergeSort,
  },
  subarray: {
    countingXORSubarray,
    countingSubarray,
    maxSubarray,
  },
  prefixSum,
  quickSelect,
};