# Miscellaneous

1. index virtual map
   ```javascript
   A = (x, y) => (2*x+1) % (y|1);
   // [ 1, 3, 5, 7, 9, 0, 2, 4, 6, 8 ] when length is 10
   array[A(i, array.length)];
   ```

1. max profit for *k* non-intersecting transactions
   ```
            a3
            /\      a5
           /  \    /
     a1   /    \  /
     /\  /      \/
    /  \/       a4
   /   a2
   a0
   ```
   - example -- `a5 - a0` for one transaction, `a1 - a0` and `a5 - a2` for two transactions, `a1 - a0`, `a3 - a2`, `a5 - a4` for three transactions
   - algorithm -- get peak-valley pairs, combine adjacent peak-valley pairs if possible, then reverse order sort the profit for each peak-valley pairs and get *k* prefix sum
   - peak-valley combining examples -- can get max profit after sort and prefix sum
     - for `a0` to `a3`: `a1 - a0`, `a3 - a2` combined to -- `a1 - a2` and `a3 - a0`
     - for `a0` to `a5` -- combined to `a5 - a0`, `a3 - a4` and `a1 - a2`

# Math

1. even or odd
   ```cpp
   (a & 1 == 1);
   ```

1. positive modulo
   ```javascript
   ((a % b) + b) % b;
   ```

1. LSB, least significant bit
   ```cpp
   x & (-x);
   ```

1. two pointers, one from head and one from tail
   ```python
   nums[i] + nums[~i]
   ```

1. number of digits
   ```javascript
   (n) => {
     n = Math.abs(n);
     if (n === 0) return 1;
     return (n > 999999999999997)? Number.parseInt(Math.log10(n))-1: Number.parseInt(Math.log10(n));
   };
   ```

1. n choose k, combination, binomial coefficient
   ```javascript
   const logf = [0, 0, 0.6931471805599453, 1.791759469228055] //...
   const binom = (n, k) => {
       return Math.round(Math.exp(logf[n] - logf[n-k] - logf[k]));
   };
   ```

1. Fibonacci
   ```javascript
   (i) => {
       const phi = 0.5 + Math.sqrt(5) / 2;
       //  return Math.floor(phi ** i / Math.sqrt(5) + 0.5);
       return Math.round(phi ** i / Math.sqrt(5));
   };
   // index
   (F) => {
       const log_phi = Math.log(0.5 + Math.sqrt(5) / 2);
       return Math.floor(Math.log(F * Math.sqrt(5) + 0.5) / log_phi)
   };
   ```

1. Catalan number
   $$
   C_n = \binom{2n}{n} - \binom{2n}{n-1} = \frac{1}{n+1}\binom{2n}{n} \\
   C_0 = 1 \qquad C_{n+1} = \sum^n_{i=0} C_i C_{n-i} \quad n \ge 0
   $$

   - the number of Dyck words of length 2n
   - the number of expressions containing n pairs of parentheses which are correctly matched
   - the number of different ways n + 1 factors can be completely parenthesized (or the number of ways of associating n applications of a binary operator)
   - the number of full binary trees with n + 1 leaves
   - the number of monotonic lattice paths along the edges of a grid with n × n square cells, which do not pass above the diagonal

1. root-finding algorithm: combining the bisection method, the secant method and inverse quadratic interpolation
   - [Brent's method](https://en.wikipedia.org/wiki/Brent%27s_method)

1. multiplication of two numbers -- Karatsuba algorithm
   - [wikipedia](https://en.wikipedia.org/wiki/Karatsuba_algorithm)

1. [Exponentiation by squaring - Wikipedia](https://en.wikipedia.org/wiki/Exponentiation_by_squaring)
   - [example](https://leetcode.com/problems/student-attendance-record-ii/discuss/101633/Improving-the-runtime-from-O(n)-to-O(log-n))

1. Sieve of Eratosthenes -- bit vector masking
   ```java
   // Euler's sieve?
   int n = 2000000;
   long start = System.currentTimeMillis();
   BitSet b = new BitSet(n + 1);
   int count = 0;
   int i;
   for (i = 2; i <= n; i++)
       b.set(i);
   i = 2;
   while (i * i <= n) {
       if (b.get(i)) {
           count++;
           int k = 2 * i;
           while (k <= n) {
               b.clear(k);
               k += i;
           }
       }
       i++;
   }
   while (i <= n) {
       if (b.get(i))
           count++;
       i++;
   }
   ```
   ```java
   class Solution {
       public int countPrimes(int n) {
           if (n < 3) return 0;
           BitSet b = new BitSet();
           int sq = ((int) Math.sqrt(n)) + 1, count = n / 2, i;
           for (i = 3; i < sq; i += 2) {
               if (!b.get(i)) {
                   for (int k = i * i; k < n; k += 2 * i) {
                       if (!b.get(k)) {
                           --count;
                           b.set(k);
                       }
                   }
               }
           }
           return count;
       }
   }
   ```
   - [wikipedia](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)

1. Bézout's identity
   $$
   \forall a, b \in \mathbb{Z}, \quad \exists k_1, k_2 \in \mathbb{Z} \\
   \text{s.t.} \quad k_1 a + k_2 b = \operatorname{GCD}(a, b)
   $$
   - [Bézout's identity - Wikipedia](https://en.wikipedia.org/wiki/B%C3%A9zout%27s_identity)

1. modulo related
   - [Euler's theorem - Wikipedia](https://en.wikipedia.org/wiki/Euler%27s_theorem)
     - [Fermat's little theorem - Wikipedia](https://en.wikipedia.org/wiki/Fermat%27s_little_theorem)
   - [Chinese remainder theorem - Wikipedia](https://en.wikipedia.org/wiki/Chinese_remainder_theorem)

1. geometry
   - [Convex hull algorithms - Wikipedia](https://en.wikipedia.org/wiki/Convex_hull_algorithms)

# Strings

1. references
   - [string.pdf](http://www-igm.univ-mlv.fr/~lecroq/string/string.pdf)
   - [string.pdf.html](http://www-igm.univ-mlv.fr/~lecroq/string/node1.html)
   - [Boyer--Moore](https://www.cnblogs.com/xubenben/p/3359364.html)
   - wikipedia

1. `__substring_find.py`
   - KMP
     ```java
     static int[] kmpTable(String s) {
         char[] cs = s.toCharArray();
         int[] prefTable = new int[cs.length + 1];
         for (int i = 1, cnt = 0; i < cs.length; )
             if (cs[i] == cs[cnt]) prefTable[++i] = ++cnt;
             else if (cnt == 0) prefTable[++i] = 0;
             else cnt = prefTable[cnt];
         return prefTable;
     }
     ```
     - alternative -- see `__substring_find.py`

1. Longest palindromic substring -- [Manacher's algorithm](https://en.wikipedia.org/wiki/Longest_palindromic_substring)
   ```java
   class Solution {
       public String shortestPalindrome(String s) {
           int len = getPrefixLenByManacher(s.toCharArray());
           return new StringBuilder(s.substring(len)).reverse().append(s).toString();
       }
       private int getPrefixLenByManacher(char[] cs) {
           final int[] p = new int[(cs.length << 1) + 1];
           DelimitedChars s = new DelimitedChars(cs);
           int c = 0, r = 0; // center, right
           int prefixLen = 0;
           for (int i = 1; i != p.length; ++i) {
               p[i] = (r > i) ? Math.min(r - i, p[(c << 1) - i]) : 0;
               for (
                   int lo = i - p[i] - 1, hi = i + p[i] + 1;
                   lo > -1 && hi < p.length && s.comp(lo, hi);
                   --lo, ++hi
               ) ++p[i];
               if (i + p[i] > r) {
                   c = i;
                   r = i + p[i];
               }
               if (i - p[i] == 0) prefixLen = Math.max(prefixLen, p[i]);
           }
           return prefixLen;
       }
   }
   class DelimitedChars {
       private final char[] cs;
       public DelimitedChars(char[] cs) {
           this.cs = cs;
       }
       public boolean comp(int i, int j) {
           assert ((i ^ j) & 1) == 0;
           return (i & 1) == 0 || cs[i >> 1] == cs[j >> 1];
       }
   }
   ```
   - [explanation with figures](https://web.archive.org/web/20190420104610/http://articles.leetcode.com/longest-palindromic-substring-part-ii/)

1. suffix tree -- tbd
   - [Suffix tree - Wikipedia](https://en.wikipedia.org/wiki/Suffix_tree)

# Search and sort

1. two implementation of binary search -- difference in while condition and `hi`
   ```python
   def bisect_left(a, x, lo=0, hi=None):
       if lo < 0:
           raise ValueError('lo must be non-negative')
       if hi is None:
           hi = len(a)
       while lo < hi:
           mid = (lo+hi)//2
           if a[mid] < x: lo = mid+1
           else: hi = mid
       return lo
   ```
   ```java
   private static <T> int indexedBinarySearch(List<? extends Comparable<? super T>> list, T key) {
       int low = 0;
       int high = list.size()-1;
       while (low <= high) {
           int mid = (low + high) >>> 1;
           Comparable<? super T> midVal = list.get(mid);
           int cmp = midVal.compareTo(key);
           if (cmp < 0)
               low = mid + 1;
           else if (cmp > 0)
               high = mid - 1;
           else
               return mid; // key found
       }
       return -(low + 1);  // key not found
   }
   ```

1. Fractional cascading -- bisect an item in several lists in O(log *n+k*) time and O(*n*) space
   - [wikipedia](https://en.wikipedia.org/wiki/Fractional_cascading)
   - build search list $M_i$ from original searched list $L_1, L_2, L_3, \ldots$
     1. $M_k$ is equal to $L_k$
     1. for $M_n, M_{n-1}, \ldots, M_1$, $M_k$ is merged with $x_i$ ($i\in N$ and *i* is odd) from $M_{k+1}$
     1. for each item *x* in $M_i$, store the position resulting from searching for *x* in $L_i$ and $M_{i+1}$ as $x_L$, $x_M$, this can be done in steps above and should not be done separately
   - search value *q*
     1. bisect $M_1$, found *x*, the result for $L_1$ is $x_L$
     1. bisect the next list in $M_i$ from index $x_M-1$ to $x_M$, find a new *x*
     1. repeat the above step until $M_n$ is covered
   - example
     ```
     L1 = 24, 64, 65, 80, 93
     L2 = 23, 25, 26
     L3 = 13, 44, 62, 66
     L4 = 11, 35, 46, 79, 81
     M1 = 24[0, 1], 25[1, 1], 35[1, 3], 64[1, 5], 65[2, 5], 79[3, 5], 80[3, 6], 93[4, 6]
     M2 = 23[0, 1], 25[1, 1], 26[2, 1], 35[3, 1], 62[3, 3], 79[3, 5]
     M3 = 13[0, 1], 35[1, 1], 44[1, 2], 62[2, 3], 66[3, 3], 79[4, 3]
     M4 = 11[0, 0], 35[1, 0], 46[2, 0], 79[3, 0], 81[4, 0]
     ```
     search *q* = 50, from 64[1, 5] in M1, to 62[3, 3], to 62[2, 3], to 79[3, 0], result is [1, 3, 2, 3]

1. Tim sort -- a type of merge sort

# Trees

1. build tree from level transverse array
   ```javascript
   let build = (leaves) => {
       if (leaves.length === 0) return null;
       leaves = leaves.map((x) => {
           if (x !== null) return new TreeLinkNode(x);
           else return null;
       });
       for (let i = 0; i < leaves.length; i++) {
           if (!leaves[i]) continue;
           if ((i+1) * 2-1 < leaves.length) leaves[i].left = leaves[2*(i+1)-1];
           else break;
           if ((i+1) * 2 < leaves.length) leaves[i].right = leaves[2*(i+1)];
           else break;
       }
       return leaves[0];
   };
   ```

1. `__Trie.py` -- trie and Finwick tree

1. Segment tree -- allows querying which of the stored segments contain a given point at O(log *n+k*)  
   ![][p1]

   [p1]: images/1.png
   - [wikipedia](https://en.wikipedia.org/wiki/Segment_tree)
   - introduction
     - static, cannot be modified once it's built
     - A segment tree for a set *I* of *n* intervals uses O(*n* log *n*) storage and can be built in O(*n* log *n*) time
     - support searching for all the intervals that contain a query point in O(log *n + k*), *k* being the number of retrieved intervals or segments
   - build backbone
     1. sort all endpoints of given intervals
     1. build leaves according to endpoints
     1. internal nodes represent the union of the intervals of its childs
   - insert interval *X*
     1. start from root, the current node is *T*
     1. if the interval of *T* $\subseteq$ *X*, store *X* at *T* and finish
     1. If *X* intersects the interval of the left child of *T*, then insert *X* in that child, recursively. If *X* intersects the interval of the right child of *T*, then insert *X* in that child, recursively.
   - query the point *q*
     1. start from root
     1. query the child of the current node if the current node has childs and *q* is in the interval of that child
     1. report all intervals stored along the path

1. segment tree for range sum -- [Efficient and easy segment trees - Codeforces](http://codeforces.com/blog/entry/18051)
   - for interval query -- discretization possible values

1. interval tree
   - [Interval tree - Wikipedia](https://en.wikipedia.org/wiki/Interval_tree)

1. Range minimum query
   - [Range minimum query - Wikipedia](https://en.wikipedia.org/wiki/Range_minimum_query)

# Probabilistic data structures

1. Bloom Filter

# Graph

1. Cycle detection
   - [Cycle detection - Wikipedia](https://en.wikipedia.org/wiki/Cycle_detection#Floyd%27s_Tortoise_and_Hare)
   - directed graph representation -- array: `i -> a[i]` for vertex i to vertex `a[i]`

1. Eulerian path
   - [Fleury's algorithm](https://en.wikipedia.org/wiki/Eulerian_path#Fleury.27s_algorithm)
   - [Hierholzer's algorithm](https://en.wikipedia.org/wiki/Eulerian_path#Hierholzer's_algorithm)

1. use DAGs in lieu of `boolean[] visited` or `BitSet` or `Map<Integer, List<Integer>> val2indexList`
   ```java
   Map<Integer, Integer> lasts = new HashMap<>();
   int[] colorDAGs = new int[boxes.length];
   for (int i = boxes.length - 1; i > -1; --i) {
       int color = boxes[i];
       colorDAGs[i] = lasts.getOrDefault(color, boxes.length);
       lasts.put(color, i);
   }
   ```

1. path find
   - [A* search algorithm - Wikipedia](https://en.wikipedia.org/wiki/A*_search_algorithm)
     - [leetcode 675](https://leetcode.com/problems/cut-off-trees-for-golf-event/solution/)
   - [Lee algorithm - Wikipedia](https://en.wikipedia.org/wiki/Lee_algorithm) -- BFS, wave propagation
     - Hadlock's Algorithm -- BFS, but put non-detours at the head of the searching queue while put detours at the tail of the searching queue
       ```
       [0, 0, 0, 0, 0, 1, 2]
       [0, 0, 0, 0, 1, s, 1]
       [0, 0, 0, 0, 2, 1, 2]
       [0, 0, 0, 0, 3, 2, 3]
       [0, 0, 0, 0, 4, 3, 4]
       [0, 0, 0, 0, 5, -1, -1]
       [0, 0, 0, 0, 6, 7, 8]
       [0, 0, 0, 0, 0, 0, 9]
       [0, 0, 0, 0, 0, 0, 10]
                            ↖ end
       s: start
       -1: blockage encountered
       0: untouched area
       nonzero int: path length
       ```
       - detour example -- in a grid, it is a detour if `abs(to_i - i) + abs(to_j - j)` will be larger when `i` or `j` changes
