# Memory models, stack, heap, contiguous memory, pointer arithmetic.

## Arrays
- elements live in contiguous memory
- next element (address + i + size), where i index
- random access O(1)

### Contiguous memory, means no gaps
- [C] int[0] is base array address. int[1] is base + 4 (int size)
- JS arrays NOT guaranteed contiguous because of mixed types, holes, engine opt, runtime changes
- Typed Arrays and Buffers are contiguous, fixed size per element, densely packed, binary data only

### Pointer arithmetic
- [C] *(p + 5)

### Index math, and mathematical operations on indexes
- *(p + 5)
- for (int i = 0; i < n; i += 2)
- mid = (l + r) / 2
- index % 2

## Stack
- [C] stores: function arguments, return address, saved registers,
local primitive variables, local fixed-size structs, pointers (which may reference heap)
- stack stores call frames
- all static data, pointers to dynamic.
- all data destroyed after function call.

## Heap
- dynamic non contagious data, slow
- stores: variable-sized data, long-lived objects, dynamic arrays, trees, graphs.
- managed by: malloc/free [C], new/delete [C++], Garbage collectors [Java, Go, JS],
Allocators [jemalloc, tcmalloc, mimalloc]

## Time Models Constant vs linear vs logarithmic access
- RAM takes ~100 ns per access, CPU is ~0.3 ns per cycle, 
so memory latency is ~300 cycles.
- 100 ns / 0.3 ns ~ 333 cycles
- How many such hits you incur determines constant, linear, logarithmic patterns.

### Constant O(1)
- it means number of address computations, not always fast
- CPU computes the address directly and loads it with one memory operation.
-  To be O(1), the CPU must compute the address by 
base register + (index * size) this a single instruction on real CPUs.
- [C] arr[i]
- [JS] typed array or buffer buf[i]
- its constant because it gets address and loads it
- modern CPUs always load memory in cache lines, usually 64 bytes.
- cache hit -> 0.3 - 1 ns
- cache miss -> 80-150 ns depends of where data is L2, L3, DRAM
- int32 array -> element = 4 bytes (16 elements per cache line).
- O(1) is one memory operation but: 1 cycle (L1 hit), 4 cycles (L2 hit)
12 cycles (L3 hit), 300 cycles (DRAM hit)

#### Example loading
- T = type, i = index
- array_base = address where array[0]
- address = array_base + i * sizeof(T)
- load(address)

#### Example cache
- case 1 - needed data is in L1 cache
- cpu finds address in L1 and loads it in 1 cycle.
- case 2 - 64 bytes chunk is not in L1.
- ask L2 -> maybe there
- ask L3 -> maybe there
- ask DRAM -> there, slowest

## Linear O(n)
- to find element CPU walk through element one by one.
- Each step depends on previous one.
- cou can get pointer to the next element only after reading previous.
- creates pointer dependency chain, blocking CPU pipeline parallelism.
#### Structures
- LL lists,
- Trees if stores as pointers,
- Maps with chained nodes,
- DOM trees,
- anything with pointer structure
#### Example
- node0 -> node1 -> node2 -> noden
- Can't skip ahead, pointer caching, bad cache locality.

## Logarithmic O(log n)
- Bounded number of pointer jumps, usually proportional to tree depth.
- typical for:
- Balanced binary trees,
- B-Trees / B+Trees,
- Page tables,
- Filesystem structures,
- Database indexes.

- Each step halves or reduce search space.
- start -> big chuck
- next -> smaller
- next -> leaf
         1
      /     \
     2       3
   /  \    /  \
  4    5   6   7

- start -> 1,2,3,4,5,6,7
- next -> 2,4,5
- next -> 4
-  So 1M elements ~= 20 steps.
- ~20 dependent cache misses instead of
- O(1) 1 dependent pointer
- O(n) 1M dependent pointers
- tree representation can also be:
- pointer Tree ~log(n) dependent cache misses, scattered memory
- array Tree same algorithmic steps, but fewer cache misses,
 contiguous memory lines, prefetching effective

| Structure     | Time Model               | Why                                            |
| ------------- | ------------------------ | ---------------------------------------------- |
| Array         | O(1)                     | Address math, contiguous                       |
| Linked list   | O(n)                     | Pointer chasing                                |
| Balanced tree | O(log n)                 | Bounded pointer jumps                          |
| Hash table    | O(1) average, O(n) worst | Depends on buckets                             |
| Binary heap   | O(log n)                 | Tree stored in array (index math, no pointers) |

## Cache Locality and CPU Pipelines, how CPU reads memory in blocks

### CPU Pipelines

- fetch, read instruction from memory 
- decode, understand the instruction 
- execute, ALU computes result
- memory, read/write operands from memory
- writeback, store result in registers

- multiple instructions can be in the pipeline simultaneously
- the CPU wants 1 instruction per cycle throughput, not total latency.
- memory latency can stall the pipeline if the CPU is waiting for data.

### Cache Locality
*Cache locality is about how predictable your memory access is*

1. Temporal Locality
- recently used data is likely to be used again soon.
- example: a variable used multiple times in a loop.
- caches exploit this by keeping recently accessed lines in L1/L2

2. Spatial Locality
- data near recently accessed data is likely to be used soon
- CPU prefetchers load consecutive cache lines automatically
- even O(1) or O(log n) operations can be extremely slow if you jump randomly in memory,
- because each cache miss stalls the pipeline.

### Pipelines and Cache interaction

- CPU fetches instruction
- Instruction requires data, CPU checks L1 cache
- hit -> 1-4 cycles, continue
- miss -> check L2,
- miss -> check L3, 
- miss -> fetch DRAM (~300 cycles)
- if data not in cache, the pipeline stalls, waiting for memory.
- even if algorithmic complexity is O(1), a cache miss can cost hundreds of cycles.

## Pointer based structs and pipelines

- pointer chasing (linked list, pointer-based tree):
- each node may be on a different cache line, linear latency in memory accesses
- CPU cannot prefetch because the next pointer is unknown until the current node is loaded
- pipeline stalls, low instruction throughput
- array-based structures:
- memory is contiguous, predictable
- prefetchers load next cache lines while CPU executes current instruction
- pipeline stays full, maximizing throughput

## Parallelism and cache misses
- if instructions depend on previous memory loads, 
- the CPU can’t continue until data arrives, pipeline bubble.
- pointer-based O(log n) tree access:
- each dereference is dependent
- pipeline stalls for each miss
- array-based O(log n) tree:
- index math computes the next location without memory load dependency
- CPU can prefetch the next cache line, keeping pipeline busy


#### Algorithmic complexity is not enough, cache locality and pipeline behavior dominate real performance.

| Access pattern     | CPU pipeline    | Cache hits          | Notes                          |
| ------------------ | --------------- | ------------------- | ------------------------------ |
| Sequential array   | full throughput | L1/L2 hits          | Prefetchers help               |
| Pointer-based list | stalls          | many L3/DRAM misses | Dependent loads, unpredictable |
| Array tree         | mostly hits     | L1/L2               | Index math + contiguous memory |
| Random access      | pipeline stalls | L3/DRAM misses      | Prefetchers useless            |


##  Random Access vs Sequential Access The fundamental divide

### Sequential Access
- you read or write memory locations contiguously:
- iterating an array for(i=0;i<n;i++) arr[i]
- processing a contiguous block of a buffer
- scanning a file in order
1. cache lines loaded once,
- 64 bytes per cache line, multiple elements per load
2. hardware prefetching works,
- CPU predicts the next line will be used, loads it in advance
3. pipeline stalls minimized
- dependent loads are rare, instruction-level parallelism exploited
4. DRAM row hits more likely
- accessing sequential addresses within the same DRAM row is faster
- poor at dynamic insert/delete in middle O(n) shifts
- high throughput, minimal latency per element.


## Random Access
- memory accesses jump around, addresses unpredictable:
- pointer-based linked lists
- pointer-based trees
- hash table with poor distribution
1. cache misses increase,
- each access may hit L2/L3/DRAM
2. prefetchers cannot help,
- CPU cannot predict next address
3. pipeline stalls,
- dependent loads force CPU to wait for memory
4. DRAM row misses more likely,
- random jumps force row precharge + activate cycles.
- excellent at dynamic insert/delete, flexible topology
- high latency, low throughput, even if algorithmic complexity is O(1) per element.

#### Mixed
- B-trees, 
- Skip Lists
- balance between locality and dynamic insertion/deletion

## Mutability vs Immutability Persistent Data Structures

#### Mutability - modify the data at the same memory location

#### Examples:
- [C]
- arr[3] = 10;
- node->value = 42;
- it implies:
- updating only writes new bits into address
- no copies are made
- all references to that object see the new value
- 
#### fast
- one write to RAM/cache
- no allocations
- no copying
- fits the CPU model (CPU likes stable addresses, cache line stays hot)

#### dangerous
- code shares this structure, they see updates, requires locks / synchronization,
- hence harder to make concurrency safe.

#### Immutability - Once a value is created, its memory never changes.

#### Example:
- [JS]
- const a = 1; const b = a + 1; 
- each value has one-time allocated memory.
- old value remains, new value allocated elsewhere.
- no locks required for reading shared data.
- no accidental side effects.
- great for concurrency.
- requires allocation + copying.
- can create garbage pressure in GC languages.

## Persistent Data Structures
- data structures that preserve all historical versions
- while sharing memory so copies are cheap
- persistence as time-persistent versions in RAM

#### Example
- Clojure vectors,
- Haskell lists.

- root -> A | B
- update A
- newRoot -> new A | shared B
- only A is copied; B is reused.
- memory cost for each update: O(log n) new nodes
- change visibility: Old versions still accessible
- cheap snapshots (versioning)
- undo/redo
- thread-safe reads without locks
- deterministic behavior
- more pointer chasing
- more allocations
- update cost usually O(log n)

## Comparison vs Hashing vs Bitwise Model

### Comparison Model
- You compare values with <, >, or ==.

#### What are these allow
- Compare items,
- Sorting based on comparisons,
- Tree balancing decisions (BST, Red-Black Tree, AVL, B-Tree)
- Maintains sorted order
- Range queries
- Floor/ceil operations
- Works for arbitrary comparable values
- Comparisons are expensive
- Hard to get below O(log n) for search

## Transform data into a fixed-size integer, index by that.

#### What are these allow:
- compute hash, 
- compare keys when collisions occur
- no ordering or sorting
- hash tables (unordered_map, JS objects, Python dicts)
- bloom filters
- LRU caches keyed by hash
- average lookup: O(1)
- average insert/delete: O(1)
- worst-case lookup: O(n) 
- order lost no range queries
- near-constant-time access
- scales extremely well
- cache-friendly when buckets stored contiguously
- no ordering
- hash collisions complicate implementation
- hash computation itself costs time
- memory overhead for buckets

## Bitwise Model
- uses bitwise CPU instructions
- Bitsets / bitmaps
- Bloom filters (bit-array + hash functions)
- Tries (prefix trees)
- Radix trees / Patricia tries
- HyperLogLog (probabilistic cardinality)
- Fast set membership
- CPU-friendly boolean vectors (SIMD operations)

- Lookup: O(1) (bitset)
- Insert/delete: O(1) (set a bit)
- massive parallelism via SIMD
- very small memory footprint

- fastest operations possible on CPU
- zero branch mispredictions
- perfect cache locality
- ideal for boolean flags, sets, filters
- amazing for high-performance computing

- limited domain (integers → bits)
- poor for complex, non-ordinal data
- hard to maintain human reasoning
- requires fixed-size universe or hashing

### Usage
- Comparison model - Balanced trees, sorted arrays.
- Hashing model - Hash table, bloom filters.
- Bitwise model - Bitsets, prefix tries, compressed bitmaps (Roaring), SIMD.