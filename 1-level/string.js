/**
 * @description
 * Sliding window search
 * that a pattern not general purpose algorithm
 * to do different thing reuse the key idea not the whole function
 * O(n)
 * 
 * Used to find unique sequences, 
 * min/max tracking,
 * substring containment
 * sums
 * frequency matching
 * 
 * creates 'window' with 2 pointer
 * maintains register mapped values to indexes for fast lookup 
 * 
 */

/** @description longest unique string */

function sliding() {
  const registry = new Map();
  let left = 0;
  let bestLen = 0;
  let bestLeft = 0;
  for (let right = 0; right < this.length; right++) {
    const stored = registry.get(this[right]);
    if (stored !== undefined && stored >= left) {
      left = stored + 1;
    }
    registry.set(this[right], right);
    const range = right - left + 1;
    if (range > bestLen) {
      bestLen = range;
      bestLeft = left;
    }
  }
  return this.slice(bestLeft, bestLeft + bestLen);
}

/**
 * @description
 * Rabin-Karp
 * 
 * turn every substring into number,
 * compare numbers
 * 
 * simple/fast
 * 
 * using rolling hash
 */

function buildPowers(base) {
  const length = this.length;
  const pows = Array(length).fill(0);
  pows[0] = 1;
  for (let i = 1; i < length; i++) {
    pows[i] = pows[i - 1] * base;
  }
  return pows;
}

function polynomialHash(pows, right) {
  let sum = 0;
  for (let i = 0; i < right; i++) {
    sum += this[i].charCodeAt() * pows[right - 1 - i];
  }
  return sum;
}

function findSubstring(value) {
  const base = 31;
  const length = value.length;
  const pows = buildPowers.call(this, base);
  const target = polynomialHash.call(value, pows, length);
  let sum = polynomialHash.call(this, pows, length);
  const max = this.length - length;
  for (let i = 0; i <= max; i++) {
    console.log({ target, sum });
    if (sum === target) return i;
    if (i === max) break;
    sum -= (this[i].charCodeAt() * pows[length - 1]);
    sum *= base;
    sum += this[i + length].charCodeAt();
  }
  return -1;
}
