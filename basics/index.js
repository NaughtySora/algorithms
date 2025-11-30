//? Memory models, stack, heap, contiguous memory, pointer arithmetic.

/**
 * @description
 * Arrays
 * elements live in contiguous memory
 * next element (address + i + size), where i index
 * random access O(1)
 *  */

/**
 * @description
 * Contiguous memory
 * Means no gaps
 * [C]
 * int[0] is base array address
 * int[1] is base + 4 (int size)
 *
 * NOTE. JS arrays NOT guaranteed contiguous because of mixed types, holes, engine opt, runtime changes
 * Typed Arrays & Buffers ARE contiguous, fixed size per element, densely packed, binary data only
 */

/**
 * @description
 * pointer arithmetic
 * [C]
 * *(p + 5)
 */

/**
 * @description
 * index math
 * and mathematical operations on indexes
 * 0. *(p + 5)
 * 1. for (int i = 0; i < n; i += 2)
 * 2. mid = (l + r) / 2
 * 3. index % 2
 */


/**
 * @description
 * Stack
 * [C] stores:
 * function arguments,
 * return address,
 * saved registers,
 * local primitive variables,
 * local fixed-size structs,
 * pointers (which may reference heap)
 *
 * stack stores call frames
 * all static data, pointers to dynamic.
 * all data destroyed after function call.
 */

/**
 * @description
 * Heap
 * dynamic non contagious data, slow
 *
 * stores:
 * variable-sized data,
 * long-lived objects,
 * dynamic arrays, trees, graphs.
 *
 * managed by:
 * malloc/free (C),
 * new/delete (C++),
 * Garbage collectors (Java, Go, JS),
 * Allocators (jemalloc, tcmalloc, mimalloc).
 */

//? Time Models Constant vs linear vs logarithmic access

// RAM takes ~100 ns per access, CPU is ~0.3 ns per cycle, so memory latency is ~300 cycles.
// 100 ns / 0.3 ns ~ 333 cycles
// How many such hits you incur determines constant, linear, logarithmic patterns.

/**
 * @description
 * Constant O(1)
 * CPU computes the address directly and loads it with one memory operation.
 * To be O(1), the CPU must compute the address by:
 * base register + (index * size) this a single instruction on real CPUs.
 * [C] arr[i]
 * [JS] typed array or buffer buf[i]
 * its constant because it gets address and loads it
 * example:
 * T = type
 * i = index
 * array_base = address where array[0]
 * address = array_base + i * sizeof(T)
 * load(address)
 *
 * details:
 * cache hit -> 0.3 - 1 ns
 * cache miss -> 80-150 ns depends of where data is L2, L3, DRAM
 *
 * O(1) is one memory operation but:
 * 1 cycle (L1 hit)
 * 4 cycles (L2 hit)
 * 12 cycles (L3 hit)
 * 300 cycles (DRAM hit)
 *
 * constant time means number of address computations, not always fast
 *
 * Modern CPUs always load memory in cache lines, usually 64 bytes.
 * example:
 * int32 array -> element = 4 bytes (16 elements per cache line).
 *
 * case 1 - needed data is in L1 cache
 * cpu finds address in L1 and loads it in 1 cycle.
 *
 * case 2 - 64 bytes chunk is not in L1.
 * ask L2 -> maybe there
 * ask L3 -> maybe there
 * ask DRAM -> there, slowest
 */


/**
 * @description
 * Linear O(n)
 * To find element CPU walk through element one by one.
 * Each step depends on previous one.
 * You can get pointer to the next element only after reading previous.
 * Creates pointer dependency chain, blocking CPU pipeline parallelism.
 * examples:
 * LL lists,
 * Trees if stores as pointers,
 * Maps with chained nodes,
 * DOM trees,
 * anything with pointer structure
 *
 * node0 -> node1 -> node2 -> noden
 * Can't skip ahead, pointer caching, bad cache locality.
 * */

/**
 * @description
 * Logarithmic O(log n)
 * Bounded number of pointer jumps, usually proportional to tree depth.
 * typical for:
 * Balanced binary trees,
 * B-Trees / B+Trees,
 * Page tables,
 * Filesystem structures,
 * Database indexes.
 *
 * Each step halves or reduce search space.
 * start -> big chuck
 * next -> smaller
 * next -> leaf
 *          1
 *       /     \
 *      2       3
 *    /  \    /  \
 *   4    5   6   7
 *
 * start -> 1,2,3,4,5,6,7
 * next -> 2,4,5
 * next -> 4
 *
 * So 1M elements ~= 20 steps.
 * ~20 dependent cache misses instead of
 * - O(1) 1 dependent pointer
 * - O(n) 1M dependent pointers
 *
 * Tree representation can also be:
 * Pointer Tree ~log(n) dependent cache misses; scattered memory
 * Array Tree same algorithmic steps, but fewer cache misses, contiguous memory lines, prefetching effective
 */


// | Structure     | Time Model               | Why                                            |
// | ------------- | ------------------------ | ---------------------------------------------- |
// | Array         | O(1)                     | Address math, contiguous                       |
// | Linked list   | O(n)                     | Pointer chasing                                |
// | Balanced tree | O(log n)                 | Bounded pointer jumps                          |
// | Hash table    | O(1) average, O(n) worst | Depends on buckets                             |
// | Binary heap   | O(log n)                 | Tree stored in array (index math, no pointers) |

//? Cache Locality & CPU Pipelines How CPU reads memory in blocks

/**
 * @description CPU Pipelines
 * Fetch – read instruction from memory 
 * Decode – understand the instruction 
 * Execute – ALU computes result
 * Memory – read/write operands from memory
 * Writeback – store result in registers
 * 
 * Multiple instructions can be in the pipeline simultaneously
 * The CPU wants 1 instruction per cycle throughput, not total latency.
 * Memory latency can stall the pipeline if the CPU is waiting for data.
 */

/**
 * @description Cache Locality
 * Cache locality is about how predictable your memory access is
 * 
 * 1. Temporal Locality
 * Recently used data is likely to be used again soon.
 * Example: a variable used multiple times in a loop.
 * Caches exploit this by keeping recently accessed lines in L1/L2
 * 
 * 2. Spatial Locality
 * Data near recently accessed data is likely to be used soon
 * Example: sequential array iteration for(i=0;i<n;i++) arr[i].
 * CPU prefetchers load consecutive cache lines automatically
 * 
 * Even O(1) or O(log n) operations can be extremely slow if you jump randomly in memory,
 * because each cache miss stalls the pipeline.
 * */

/**
 * @description
 * Pipelines and Cache interaction
 * 1. CPU fetches instruction
 * 2. Instruction requires data, CPU checks L1 cache
 * hit -> 1-4 cycles, continue
 * miss -> check L2,
 * miss -> check L3, 
 * miss -> fetch DRAM (~300 cycles)
 * 3. If data not in cache, the pipeline stalls, waiting for memory.
 * Even if algorithmic complexity is O(1), a cache miss can cost hundreds of cycles.
 */

/**
 * @description
 * Pointer based structs and pipelines
 * 
 * Pointer chasing (linked list, pointer-based tree):
 * Each node may be on a different cache line, linear latency in memory accesses
 * CPU cannot prefetch because the next pointer is unknown until the current node is loaded
 * Pipeline stalls, low instruction throughput
 * 
 * Array-based structures:
 * Memory is contiguous, predictable
 * Prefetchers load next cache lines while CPU executes current instruction
 * Pipeline stays full, maximizing throughput
 */

/**
 * @description
 * Parallelism and cache misses
 * If instructions depend on previous memory loads, 
 * the CPU can’t continue until data arrives, pipeline bubble.
 * 
 * Pointer-based O(log n) tree access:
 * Each dereference is dependent
 * Pipeline stalls for each miss
 * 
 * Array-based O(log n) tree:
 * Index math computes the next location without memory load dependency
 * CPU can prefetch the next cache line, keeping pipeline busy
 * */

// Algorithmic complexity is not enough, cache locality and pipeline behavior dominate real performance.
// | Access pattern     | CPU pipeline    | Cache hits          | Notes                          |
// | ------------------ | --------------- | ------------------- | ------------------------------ |
// | Sequential array   | full throughput | L1/L2 hits          | Prefetchers help               |
// | Pointer-based list | stalls          | many L3/DRAM misses | Dependent loads, unpredictable |
// | Array tree         | mostly hits     | L1/L2               | Index math + contiguous memory |
// | Random access      | pipeline stalls | L3/DRAM misses      | Prefetchers useless            |


//? Random Access vs Sequential Access The fundamental divide
/**
 * @description
 * Sequential Access
 * You read or write memory locations contiguously:
 * 
 * Iterating an array for(i=0;i<n;i++) arr[i]
 * Processing a contiguous block of a buffer
 * Scanning a file in order
 * 
 * 1. Cache lines loaded once,
 * 64 bytes per cache line, multiple elements per load
 * 2. Hardware prefetching works,
 * CPU predicts the next line will be used, loads it in advance
 * 3. Pipeline stalls minimized
 * Dependent loads are rare, instruction-level parallelism exploited
 * 4. DRAM row hits more likely
 * Accessing sequential addresses within the same DRAM row is faster
 * 
 * Poor at dynamic insert/delete in middle O(n) shifts
 * 
 * High throughput, minimal latency per element.
 */

/**
 * @description
 * Random Access
 * Memory accesses jump around, addresses unpredictable:
 * Pointer-based linked lists
 * Pointer-based trees
 * Hash table with poor distribution
 * 
 * 1. Cache misses increase,
 * Each access may hit L2/L3/DRAM
 * 2. Prefetchers cannot help,
 * CPU cannot predict next address
 * 3. Pipeline stalls,
 * Dependent loads force CPU to wait for memory
 * 4. DRAM row misses more likely,
 * Random jumps force row precharge + activate cycles.
 * 
 * Excellent at dynamic insert/delete, flexible topology
 * 
 * High latency, low throughput, even if algorithmic complexity is O(1) per element.
 * */

/**
 * @description
 * Mixed
 * 
 * B-trees, 
 * Skip Lists
 * 
 * Balance between locality and dynamic insertion/deletion
 */


//? Mutability vs Immutability Persistent Data Structures

/**
 * @description
 * Mutability - modify the data at the same memory location
 * Examples:
 * [C]
 * arr[3] = 10;
 * node->value = 42;
 * 
 * it implies:
 * Updating only writes new bits into address.
 * No copies are made.
 * All references to that object see the new value.
 * 
 * why its fast:
 * One write to RAM/cache,
 * No allocations,
 * No copying,
 * Fits the CPU model (CPU likes stable addresses, cache line stays hot)
 * 
 * dangerous:
 * code shares this structure, they see updates, requires locks / synchronization,
 * hence harder to make concurrency safe.
 */

/**
 * @description
 * Immutability - Once a value is created, its memory never changes.
 * Example:
 * [JS]
 * const a = 1; const b = a + 1; 
 * 
 * Each value has one-time allocated memory.
 * Old value remains, new value allocated elsewhere.
 * 
 * No locks required for reading shared data.
 * No accidental side effects.
 * Great for concurrency.
 * 
 * Requires allocation + copying.
 * Can create garbage pressure in GC languages.
 */

/**
 * @description
 * Persistent Data Structures
 * 
 * Data structures that preserve all historical versions, 
 * while sharing memory so copies are cheap.
 * persistence as time-persistent versions in RAM.
 * 
 * Example: 
 * Clojure vectors,
 * Haskell lists.
 * 
 * root -> A | B
 * update A
 * newRoot -> new A | shared B
 * Only A is copied; B is reused.
 * 
 * Memory cost for each update: O(log n) new nodes
 * Change visibility: Old versions still accessible
 * 
 * Cheap snapshots (versioning)
 * Undo/redo
 * Thread-safe reads without locks
 * Deterministic behavior
 * 
 * More pointer chasing
 * More allocations
 * Update cost usually O(log n)
 */

//? Comparison vs Hashing vs Bitwise Model

/**
 * @description
 * Comparison Model
 * You compare values with <, >, or ==.
 * 
 * What are these allow:
 * Compare items,
 * Sorting based on comparisons,
 * Tree balancing decisions (BST, Red-Black Tree, AVL, B-Tree)
 * 
 * Maintains sorted order
 * Range queries
 * Floor/ceil operations
 * Works for arbitrary comparable values
 * 
 * Comparisons are expensive
 * Hard to get below O(log n) for search
 */

/**
 * @description
 * Transform data into a fixed-size integer, index by that.
 * 
 * What are these allow:
 * Compute hash, 
 * Compare keys when collisions occur
 * No ordering or sorting
 * 
 * Hash tables (unordered_map, JS objects, Python dicts)
 * Bloom filters
 * LRU caches keyed by hash
 * 
 * Average lookup: O(1)
 * Average insert/delete: O(1)
 * Worst-case lookup: O(n) 
 * Order lost — no range queries
 * 
 * Near-constant-time access
 * Scales extremely well
 * Cache-friendly when buckets stored contiguously
 * 
 * No ordering
 * Hash collisions complicate implementation
 * Hash computation itself costs time
 * Memory overhead for buckets
 * */

/**
 * @description
 * Bitwise Model
 * Uses bitwise CPU instructions
 * 
 * Bitsets / bitmaps
 * Bloom filters (bit-array + hash functions)
 * Tries (prefix trees)
 * Radix trees / Patricia tries
 * HyperLogLog (probabilistic cardinality)
 * Fast set membership
 * CPU-friendly boolean vectors (SIMD operations)
 * 
 * Lookup: O(1) (bitset)
 * Insert/delete: O(1) (set a bit)
 * Massive parallelism via SIMD
 * Very small memory footprint
 * 
 * Fastest operations possible on CPU
 * Zero branch mispredictions
 * Perfect cache locality
 * Ideal for boolean flags, sets, filters
 * Amazing for high-performance computing
 * 
 * Limited domain (integers → bits)
 * Poor for complex, non-ordinal data
 * Hard to maintain human reasoning
 * Requires fixed-size universe or hashing
 */

/**
 * @description
 * Usage
 * 
 * Comparison model - Balanced trees, sorted arrays.
 * Hashing model - Hash table, bloom filters.
 * Bitwise model - Bitsets, prefix tries, compressed bitmaps (Roaring), SIMD.
 */