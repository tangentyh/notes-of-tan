# Utils

## Arrays

1. `java.util.Arrays`
   - conversion
     - `static String toString(type[] a)`
     - `static String deepToString(Object[] a)`
     - `static <T> List<T> asList(T... a)` — `return new ArrayList<>(a);`
       - `ArrayList` here is `Arrays$ArrayList` which implements `List`, a view on the original array with fixed size
       - if real `ArrayList` is desired — use this `Arrays$ArrayList` to construct
     - stream methods
   - `static int binarySearch(type[] a, type v)`  
     `static int binarySearch(type[] a, int start, int end, type v)`
     - `Object[]` actually needs to be `Comparable[]`
   - copy
     - `static type[] copyOf(type[] original, int newLength)` — uses `System::arraycopy` behind the scenes
     - `static type[] copyOfRange(type[] a, int start, int end)`
     - `System::arraycopy`
     - `T[]::clone`
   - initialization and modifications
     - `static void fill(type[] a, type v)`
     - `static void setAll(double[] array, IntToDoubleFunction generator)` — generator takes indices as parameter  
       `static void setAll(int[] array, IntUnaryOperator generator)`  
       `static void setAll(long[] array, IntToLongFunction generator)`  
       `static <T> void setAll(T[] array, IntFunction<? extends T> generator)`
     - `parallelSetAll` — parallel version of `setAll`
     - `parallelPrefix` — prefix operators, like prefix sum
   - `Object` methods
     - `static boolean equals(type[] a, type[] b)`
     - `static int hashCode(Object[] a)`
     - `static boolean deepEquals(Object[] a1, Object[] a2)`
     - `static int deepHashCode(Object[] a)`
     - `static String deepToString(Object[] a)`
     - `compare` — since JDK 9
   - sort
     - `static void sort(type[] a)`  
       `static void sort(type[] a, int fromIndex, int toIndex)`  
       `static <T> void sort(T[] a, Comparator<? super T> c)`  
       `static <T> void sort(T[] a, int fromIndex, int toIndex, Comparator<? super T> c)`
       - `Object[]` actually needs to be `Comparable[]`
       - `java.util.DualPivotQuickSort::sort` for primitive type arrays
       - `java.util.TimSort::sort` for `T[]`
     - `static void parallelSort(type[] a)`  
       `static void parallelSort(type[] a, int fromIndex, int toIndex)` (no `Object[]`)  
       `static <T extends Comparable<? super T>> void parallelSort(T[] a, int fromIndex, int toIndex)`  
       `static <T> void parallelSort(T[] a, Comparator<? super T> cmp)`  
       `static <T> void parallelSort(T[] a, int fromIndex, int toIndex, Comparator<? super T> cmp)`
       - granularity — `private static final int MIN_ARRAY_SORT_GRAN = 1 << 13;`
       - sequential sort (as `Arrays::sort`) when
         ```java
         if (n <= MIN_ARRAY_SORT_GRAN || (p = ForkJoinPool.getCommonPoolParallelism()) == 1)
         ```
       - else parallel sort — uses threading (each thread gets a chunk of the list and sorts it in parallel. Later these sorted chunks are merged into a result)
       - `java.util.DualPivotQuickSort::sort` for primitive type arrays
       - `java.util.TimSort::sort` for `T[]`

## Event Handling

1. `java.util.EventListener` — A tagging interface that all event listener interfaces must extend

1. `java.util.EventListenerProxy` — An abstract wrapper class for an EventListener class which associates a set of additional parameters with the listener
   ```java
   public abstract class EventListenerProxy<T extends EventListener> extends Object
   implements EventListener
   ```

1. `java.util.EventObject` — The root class from which all event state objects shall be derived
   ```java
   public class EventObject extends Object
   implements Serializable
   ```

1. MVC
   - `java.util.Observable`
   - `interface java.util.Observer`

## Collections and Maps

1. concurrent collections — see [Thread-Safe Collections](./javaConcurrency.md#thread-safe-collections), and [`SynchronousQueue`](./javaConcurrency.md#data-exchange-synchronizers)

1. `Iterable`
   ```java
   public interface Iterable<T>
   ```
   - `default void forEach(Consumer<? super T> action)`
   - `Iterator<T> iterator()`
   - `default Spliterator<T> spliterator()`
   - foreach loop — needs to implement `Iterable`
     - behind the scenes — a loop with an iterator

1. `java.util.Iterator<E>`
   ```java
   public interface Iterator<E>
   ```
   - fail fast — multiple readers, or a single reader and writer, otherwise `ConcurrentModificationException`
     - detection scheme — the count of modifications is keep in both the collection and the iterator
     - exception — `LinkedList::set` is not counted
   - `E next()` — possibly `NoSuchElementException`
   - `boolean hasNext()`
   - `void remove()` — remove the element last returned by `next()`
   - `default void forEachRemaining(Consumer<? super E> action)`
   - `Collections::emptyIterator`

1. `java.util.Spliterator` — both sequential and parallel data processing, the parallel analogue of an `Iterator`
   - fail fast
   - late-binding — binds to the source of elements at the point of first traversal, first split, or first query for estimated size, rather than at the time the `Spliterator` is created

1. `java.util.Collection`
   ```java
   public interface Collection<E>
   extends Iterable<E>
   ```
   - add
     - `boolean add(E e)` — `true` when success
     - `boolean addAll(Collection<? extends E> c)`
   - test
     - `boolean equals(Object o)`
     - `boolean contains(Object o)`
     - `boolean containsAll(Collection<?> c)`
     - `boolean isEmpty()`
   - modify
     - `void clear()`
     - `boolean removeIf(Predicate<? super E> filter)`
     - `boolean removeAll(Collection<?> c)`
     - `boolean remove(Object o)`
     - `boolean retainAll(Collection<?> c)`
   - conversion
     - `<T> T[] toArray(T[] a)` — no new array created if `a` is of the correct size
     - `default Stream<E> stream()`
     - `default Stream<E> parallelStream()`
   - get collection information
     - `int size()`
     - `Iterator<E> iterator()`
     - `default Spliterator<E> spliterator()`
   - `java.util.AbstractCollection` — a skeletal implementation of the `Collection` interface, to minimize the effort required to implement this interface
      ```java
      public abstract class AbstractCollection<E> extends Object
      implements Collection<E>
      ```
      - should have been replaced by default methods, but only new methods have default implementation
      - extends the abstract class and simultaneously implement the interface — only make a difference to clarity and reflection

1. `java.util.Collections` — static helper
   - `static <T> boolean addAll(Collection<? super T> c, T... elements)`
   - `static boolean disjoint(Collection<?> c1, Collection<?> c2)` — `true` if the two specified collections have no elements in common
   - `static int frequency(Collection<?> c, Object o)`
   - `static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)`  
     `static <T> T max(Collection<? extends T> coll, Comparator<? super T> comp)`  
     `static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll)`  
     `static <T> T min(Collection<? extends T> coll, Comparator<? super T> comp)`
   - `static <T> Comparator<T> reverseOrder()`  
     `static <T> Comparator<T> reverseOrder(Comparator<T> cmp)`
     - called by `Comparator::reverseOrder` and `Comparator::reversed`
   - list related — see [List](#list)
   - views and wrappers — see [Views and Wrappers](#views-and-wrappers)
     - `Collections::unmodifiableCollection`
     - `Collections::synchronizedCollection`
     - `Collections::checkedCollection`

### List

1. `interface java.util.RandomAccess` — marker interface used by `List` implementations to indicate that they support fast (generally constant time) random access

1. `java.util.List`
   ```java
   public interface List<E> extends Collection<E>
   ```
   - `java.util.AbstractList<E>` — This class provides a skeletal implementation of the `List` interface to minimize the effort required to implement this interface backed by a "random access" data store (such as an array)
     ```java
     public abstract class AbstractList<E>
     extends AbstractCollection<E>
     implements List<E>
     ```
   - add — with indexed version
     - `void add(int index, E element)`
     - `boolean addAll(int index, Collection<? extends E> c)`
   - element
     - `E get(int index)`
     - `int indexOf()`
     - `int lastIndexOf(Object o)`
   - list information
     - `ListIterator<E> listIterator()`
     - `ListIterator<E> listIterator(int index)`
     - `default Spliterator<E> spliterator()`
     - `List<E> subList(int fromIndex, int toIndex)` — a view
   - modify and converse
     - `E set(int index, E element)`
     - `E remove(int index)`
     - `default void sort(Comparator<? super E> c)` — uses `Arrays::sort` after `toArray()`

1. `java.util.ListIterator` — has `previous` in addition to `next`
   ```java
   public interface ListIterator<E> extends Iterator<E>
   ```
   - `void add(E e)`
   - `boolean hasPrevious()`
   - `int nextIndex()`
   - `E previous()`
   - `int previousIndex()`
   - `void set(E e)`
   - `Collections::emptyListIterator`

1. `List` related methods in `Collections`
   - find
     - `static <T> int binarySearch(List<? extends Comparable<? super T>> list, T key)` — return `(-(insertion point) - 1)` if no matching  
       `static <T> int binarySearch(List<? extends T> list, T key, Comparator<? super T> c)`
       - whether `indexedBinarySearch` or `iteratorBinarySearch` — checks `RandomAccess` or `BINARYSEARCH_THRESHOLD` to determine
     - `static int indexOfSubList(List<?> source, List<?> target)`
     - `static int lastIndexOfSubList(List<?> source, List<?> target)`
   - modify
     - `static <T> void copy(List<? super T> dest, List<? extends T> src)`
     - `static <T> void fill(List<? super T> list, T obj)`
     - `static <T> boolean replaceAll(List<T> list, T oldVal, T newVal)`
     - `static void reverse(List<?> list)`
     - `static void rotate(List<?> list, int distance)`
     - `static void shuffle(List<?> list)` — checks whether `RandomAccess` otherwise `toArray()`  
       `static void shuffle(List<?> list, Random rnd)`
     - `static <T extends Comparable<? super T>> void sort(List<T> list)`
     - `static <T> void sort(List<T> list, Comparator<? super T> c)` — uses `List::sort`
     - `static void swap(List<?> list, int i, int j)`
   - views
     - `Arrays::asList`
     - `nCopies`
     - `singletonList`
     - `emptyList`
     - `unmodifiableList`
     - `synchronizedList`
     - `checkedList`
     - `List::subList`

1. `java.util.ArrayList`
   ```java
   public class ArrayList<E>
   extends AbstractList<E>
   implements List<E>, RandomAccess, Cloneable, Serializable
   ```
   - `private static final int DEFAULT_CAPACITY = 10`
   - constructors
     - `ArrayList()` — constructs an empty list with an initial capacity of 10
     - `ArrayList(Collection<? extends E> c)`
     - `ArrayList(int initialCapacity)`
     - anonymous `ArrayList` — double brace initialization, actually a inner subclass
       ```java
       new ArrayList<String>() {{ add("Harry"); add("Tony"); }};
       ```
     - `int[]` to `ArrayList<Integer>` without loop — for large arrays with sparse access patterns
       ```java
       public List<Integer> asList(final int[] is) {
           return Collections.unmodifiableList(new AbstractList<Integer>() {
               public Integer get(int i) { return is[i]; }
               public int size() { return is.length; }
           });
       }
       ```
   - capacity
     - `void ensureCapacity(int minCapacity)`
       ```java
       int newCapacity = oldCapacity + (oldCapacity >> 1);
       ```
     - `void trimToSize()`

1. `java.util.LinkedList`
   ```java
   public class LinkedList<E>
   extends AbstractSequentialList<E>
   implements List<E>, Deque<E>, Cloneable, Serializable
   ```
   - use with `ListIterator`
   - `LinkedList` vs `ArrayDeque` — see `ArrayDeque` below

### Queue

1. `java.util.Queue`
   ```java
   public interface Queue<E> extends Collection<E>
   ```
   - `IllegalStateException` or `NoSuchElementException` when failure
     - `boolean add(E e)` — returning `true` upon success and throwing an `IllegalStateException` if no space is currently available
     - `E remove()`
     - `E element()` — peek the head
   - return `null` when failure
     - `boolean offer(E e)`
     - `E poll()`
     - `E peek()`
   - `java.util.AbstractQueue` — skeletal implementations of some `Queue` operations
     ```java
     public abstract class AbstractQueue<E> extends AbstractCollection<E>
     implements Queue<E>
     ```

1. `java.util.Deque`
   ```java
   public interface Deque<E> extends Queue<E>
   ```
   |         | First Element (Head)                 |                         | Last Element (Tail)    |                            |
   | ------- | ------------------------------------ | ----------------------- | ---------------------- | -------------------------- |
   |         | Throws exception                     | return special value    | Throws exception       | return special value       |
   | Insert  | `addFirst(e)`, `push(e)`             | `offerFirst(e)`         | `addLast(e)`, `add(e)` | `offerLast(e)`, `offer(e)` |
   | Remove  | `removeFirst()`, `remove()`, `pop()` | `pollFirst()`, `poll()` | `removeLast()`         | `pollLast()`               |
   | Examine | `getFirst()`, `element()`            | `peekFirst()`, `peek()` | `getLast()`            | `peekLast()`               |
   - usage — double ended queue, also should be used in preference to the legacy `Stack` class

1. `LinkedList`

1. `java.util.ArrayDeque`
   ```java
   public class ArrayDeque<E> extends AbstractCollection<E>
   implements Deque<E>, Cloneable, Serializable
   ```
   - underlying implementation — circular array, no `null` elements
   - not implementing `List` and extends `AbstractCollection` but not `AbstractQueue` — [retrofit `ArrayDeque` to implement `List`](https://bugs.openjdk.java.net/browse/JDK-8143850)
   - no `null` support — `NullPointerException` for `null` elements
   - capacity
     - default initial capacity — 16
     - capacity grow policy — double capacity if small; else grow by 50%
       ```java
       int jump = (oldCapacity < 64) ? (oldCapacity + 2) : (oldCapacity >> 1);
       ```
   - `ArrayDeque` vs `LinkedList` — `LinkedList`s iterate with more CPU cache miss, have the overhead of node allocations, and consume more memory, but supports `List`, `null` elements, and better remove-while-iterate

1. `java.util.PriorityQueue`
   ```java
   public class PriorityQueue<E> extends AbstractQueue<E>
   implements Serializable
   ```
   - `private static final int DEFAULT_INITIAL_CAPACITY = 11`
   - capacity grow policy — as `ArrayDeque`

1. views
   - as stack — `Collections::asLifoQueue`

### Set

1. `java.util.Set`
   ```java
   public interface Set<E> extends Collection<E>
   ```
   - `java.util.AbstractSet<E>`

1. `java.util.NavigableSet` — adds methods for locating and backward traversal
   ```java
   public interface NavigableSet<E> extends SortedSet<E>
   ```
   - locating
     - `E lower(E e)`
     - `E pollFirst()`
     - `E pollLast()`
     - `E higher(E e)`
     - `E ceiling(E e)`
     - `E floor(E e)`
   - backward traversal
     - `Iterator<E> descendingIterator()`
     - `NavigableSet<E> descendingSet()`
   - `java.util.SortedSet`
     ```java
     public interface SortedSet<E> extends Set<E>
     ```
     - `Comparator<? super E> comparator()`
     - `E first()`
     - `E last()`
     - `default Spliterator<E> spliterator()`
     - `SortedSet<E> headSet(E toElement)`
     - `SortedSet<E> subSet(E fromElement, E toElement)`
     - `SortedSet<E> tailSet(E fromElement)`

1. `java.util.HashSet`
   ```java
   public class HashSet<E> extends AbstractSet<E>
   implements Set<E>, Cloneable, Serializable
   ```
   - underlying data structure — `private transient HashMap<E,Object> map`
   - dummy value for the value of `Map.Entry` — `private static final Object PRESENT = new Object()`
   - iteration performance — proportional to capability

1. `java.util.TreeSet` — red-black tree
   ```java
   public class TreeSet<E> extends AbstractSet<E>
   implements NavigableSet<E>, Cloneable, Serializable
   ```
   - underlying data structure — `private transient NavigableMap<E,Object> m`, initialized with `TreeMap`
   - dummy value — see `HashSet`

1. `java.util.EnumSet` — for use with enum types
   ```java
   public abstract class EnumSet<E extends Enum<E>>
   extends AbstractSet<E>
   implements Cloneable, Serializable
   ```
   - underlying data — represented internally as bit vectors
   - no `null` support — `NullPointerException` for `null` elements
   - usage — a high-quality, typesafe alternative to traditional int-based "bit flags"
   - underlying implementation — `RegularEnumSet` with a `long`, `JumboEnumSet` with a `long[]`, non-public in `java.util`
   - helper class — the abstract class itself acts as a static helper

1. `java.util.LinkedHashSet` — ordered `HashSet` with underlying linked list, have no control over `removeEldestEntry`
   ```java
   public class LinkedHashSet<E> extends HashSet<E>
   implements Set<E>, Cloneable, Serializable
   ```

1. views
   - `Map::keySet` etc.
   - set from map — `Collections::newSetFromMap` (for maps without corresponding sets, like `WeakHashMap` but not `HashMap`)
   - `Collections::singleton`
   - empty views — `Collections::emptySet`, `Collections::emptyNavigableSet`, `Collections::emptySortedSet`
   - unmodifiable views — `Collections::unmodifiableSet`, `Collections::unmodifiableNavigableSet`, `Collections::unmodifiableSortedSet`
   - synchronized views
   - checked views
   - subset methods

1. `BitSet` — see [Legacy Collections](#legacy-collections)

### Maps

1. `java.util.Map`
   ```java
   public interface Map<K,V>
   ```
   - modify
     - `void clear()`
     - return old value if not `void`
       - `V remove(Object key)` — returns the previous value or `null`
       - `default boolean remove(Object key, Object value)` — remove if `get(key)` equals `value`
       - `V put(K key, V value)` — returns as `remove` method
       - `default V putIfAbsent(K key, V value)` — `null` value is also absent
       - `void putAll(Map<? extends K,? extends V> m)`
       - `default V replace(K key, V value)`
       - `default boolean replace(K key, V oldValue, V newValue)`
       - `default void replaceAll(BiFunction<? super K,? super V,? extends V> function)`
     - return new value if not `void`
       - `default V compute(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`
       - `default V computeIfAbsent(K key, Function<? super K,? extends V> mappingFunction)` — `null` value is also absent
       - `default V computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`
       - `default V merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFunction)`
         ```java
         V newValue = (oldValue == null) ? value : remappingFunction.apply(oldValue, value);
         ```
         ```java
         // example
         counts.put(word, counts.getOrDefault(word, 0) + 1);
         counts.merge(word, 1, Integer::sum);
         ```
   - test
     - `boolean isEmpty()`
     - `boolean containsKey(Object key)`
     - `boolean containsValue(Object value)`
     - `boolean equals(Object o)`
   - loop or views
     - `default void forEach(BiConsumer<? super K,? super V> action)`
     - `Set<Map.Entry<K,V>> entrySet()`
     - `Set<K> keySet()`
     - `Collection<V> values()`
   - get
     - `V get(Object key)` — `null` if absent, can be confused with `null` values
     - `default V getOrDefault(Object key, V defaultValue)`
   - `int size()`
   - `interface Entry<K, V>` — key-value pair
   - `java.util.AbstractMap<K,V>` — This class provides a skeletal implementation of the `Map` interface, to minimize the effort required to implement this interface
     ```java
     public abstract class AbstractMap<K,V> extends Object
     implements Map<K,V>
     ```
     - should have been replaced by default methods, but only new methods have default implementation
     - extends the abstract class and simultaneously implement the interface — only make a difference to clarity and reflection
     - `AbstractMap.SimpleEntry`, `AbstractMap.SimpleImmutableEntry`
       ```java
       public static class AbstractMap.SimpleEntry<K,V> extends Object
       implements Map.Entry<K,V>, Serializable
       ```

1. `java.util.NavigableMap` — refer to `NavigableSet`
   ```java
   public interface NavigableMap<K,V> extends SortedMap<K,V>
   ```

1. `java.util.HashMap`
   ```java
   public class HashMap<K,V> extends AbstractMap<K,V>
   implements Map<K,V>, Cloneable, Serializable
   ```
   - schema — hash code modulo the number of buckets, or red-black tree if a hash collision
   - constants
     - `static final int DEFAULT_INITIAL_CAPACITY = 1 << 4` — initial capacity will be converted to the power of 2
     - `static final int MAXIMUM_CAPACITY = 1 << 30`
     - `static final float DEFAULT_LOAD_FACTOR = 0.75f`
     - `static final int TREEIFY_THRESHOLD = 8`
     - `static final int UNTREEIFY_THRESHOLD = 6`
     - `static final int MIN_TREEIFY_CAPACITY = 64` — smallest capability to permit treeify
   - `static class Node<K,V> implements Map.Entry<K,V>` — permits `null` values and keys
   - iteration performance — proportional to capability

1. `java.util.TreeMap` — red-black tree
   ```java
   public class TreeMap<K,V> extends AbstractMap<K,V>
   implements NavigableMap<K,V>, Cloneable, Serializable
   ```
   - do not support the `Entry::setValue` method — `Map.Entry` returned by methods in this class and its views represent snapshots of mappings at the time they were produced

1. `java.util.EnumMap` — for use with enum types
   ```java
   public class EnumMap<K extends Enum<K>,V>
   extends AbstractMap<K,V>
   implements Serializable, Cloneable
   ```
   - underlying data — represented internally as arrays, ordinals as indices
   - weakly consistent iterators — never throw `ConcurrentModificationException`, may or may not show the effects of any modifications to the map that occur while the iteration is in progress
   - `null` support — no `null` keys but values

1. `java.util.LinkedHashMap` — ordered `HashMap` with underlying doubly-linked list
   ```java
   public class LinkedHashMap<K,V> extends HashMap<K,V>
   implements Map<K,V>
   ```
   - `LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)`
     - `final boolean accessOrder` — `true` for access order, `false` for insertion order (default)
   - insertion order — the order is not affected if a key is re-inserted, even the value changes
   - access order — get methods and modify methods make corresponding entries place at the last position: `put`, `putIfAbsent`, `get`, `getOrDefault`, `compute`, `computeIfAbsent`, `computeIfPresent`, or `merge`
     - `Map::replace` — results an access only when the value is replaced
     - operations on views — no effect on order
   - `protected boolean removeEldestEntry(Map.Entry<K,V> eldest)` — invoked by `put` and `putAll` after inserting a new entry into the map, returns `true` if this map should remove its eldest entry

1. `java.util.WeakHashMap`
   ```java
   public class WeakHashMap<K,V> extends AbstractMap<K,V>
   implements Map<K,V>
   ```
   - underlying implementation — `Entry` extends `WeakReference` and registered to a `ReferenceQueue` upon construction
   - not count for gc — the presence of a mapping for a given key will not prevent the key from being discarded by the garbage collector
     - `private final ReferenceQueue<Object> queue` — `WeakReference` keys are registered with a `queue` when created; when the referent of `WeakReference` is reclaimed by GC, `WeakReference::enqueue` is called at the same time or at some later time
     - `expungeStaleEntries()` — private method that scan `WeakReference` keys in `queue` and set corresponding values to `null`; called every time in access methods, `size()`, and internal resize method
   - `null` support — both keys and values
   - values with strong reference to the keys — prevent keys from gc, can be alleviated by wrapping values with `new WeakReference(value)`

1. `java.util.IdentityHashMap` — `HashMap` with keys (and values) that are compared by `==`, not `equals`
   ```java
   public class IdentityHashMap<K,V> extends AbstractMap<K,V>
   implements Map<K,V>, Serializable, Cloneable
   ```
   - constant-time performance for the basic operations (`get` and `put`) — assuming the system identity hash function (`System.identityHashCode(Object)`) disperses elements properly among the buckets
   - rehashing may be fairly expensive — initialize with large expected capacity

1. views
   - `Collections::singletonMap`
   - empty views — `Collections::emptyMap`, `Collections::emptyNavigableMap`, `Collections::emptySortedMap`
   - unmodifiable views — `Collections::unmodifiableMap`, `Collections::unmodifiableNavigableMap`, `Collections::unmodifiableSortedMap`
   - synchronized views
   - checked views
   - sub map methods

### Views and Wrappers

1. `Map::keySet` etc.

1. `Arrays::asList`

1. `Collections`
   - one for n wrapper — `static <T> List<T> nCopies(int n, T o)`
     - returns an immutable list consisting of n copies of the specified object, `o` is stored only once
   - stack view — `static <T> Queue<T> asLifoQueue(Deque<T> deque)`
   - set view from map, see [Set](#set) — `static <E> Set<E> newSetFromMap(Map<E,Boolean> map)`
   - wrappers containing only one element — immutable, instance of inner class in `Collections`, containing only one element
     - `static <T> Set<T> singleton(T o)`
     - `static <T> List<T> singletonList(T o)`
     - `static <K,V> Map<K,V> singletonMap(K key, V value)`
   - empty wrapper — immutable, instance of inner class in `Collections`, singleton
     - `static <T> Iterator<T> emptyIterator()`
     - `static <T> List<T> emptyList()`
     - `static <T> ListIterator<T> emptyListIterator()`
     - `static <K,V> Map<K,V> emptyMap()`
     - `static <K,V> NavigableMap<K,V> emptyNavigableMap()`
     - `static <E> NavigableSet<E> emptyNavigableSet()`
     - `static <T> Set<T> emptySet()`
     - `static <K,V> SortedMap<K,V> emptySortedMap()`
     - `static <E> SortedSet<E> emptySortedSet()`
   - unmodifiable view — `UnsupportedOperationException` when try modifying, instance of inner class in `Collections`
     - `static <T> Collection<T> unmodifiableCollection(Collection<? extends T> c)`
     - `static <T> List<T> unmodifiableList(List<? extends T> list)`
     - `static <K,V> Map<K,V> unmodifiableMap(Map<? extends K,? extends V> m)`
     - `static <K,V> NavigableMap<K,V> unmodifiableNavigableMap(NavigableMap<K,? extends V> m)`
     - `static <T> NavigableSet<T> unmodifiableNavigableSet(NavigableSet<T> s)`
     - `static <T> Set<T> unmodifiableSet(Set<? extends T> s)`
     - `static <K,V> SortedMap<K,V> unmodifiableSortedMap(SortedMap<K,? extends V> m)`
     - `static <T> SortedSet<T> unmodifiableSortedSet(SortedSet<T> s)`
   - synchronized view — synchronized with mutex, instance of inner class in `Collections`
     - `static <T> Collection<T> synchronizedCollection(Collection<T> c)`
     - `static <T> List<T> synchronizedList(List<T> list)`
     - `static <K,V> Map<K,V> synchronizedMap(Map<K,V> m)`
     - `static <K,V> NavigableMap<K,V> synchronizedNavigableMap(NavigableMap<K,V> m)`
     - `static <T> NavigableSet<T> synchronizedNavigableSet(NavigableSet<T> s)`
     - `static <T> Set<T> synchronizedSet(Set<T> s)`
     - `static <K,V> SortedMap<K,V> synchronizedSortedMap(SortedMap<K,V> m)`
     - `static <T> SortedSet<T> synchronizedSortedSet(SortedSet<T> s)`
   - checked view — throw `ClassCastException` immediately when heap pollution (detects with `Class::isInstance`), instance of inner class in `Collections`, intended as debugging support
     ```java
     ArrayList<String> strings = new ArrayList<>();
     ArrayList rawList = strings; // warning only, not an error, for compatibility with legacy code
     rawList.add(new Date()); // now strings contains a Date object!
     ```
     - `static <E> Collection<E> checkedCollection(Collection<E> c, Class<E> type)`
     - `static <E> List<E> checkedList(List<E> list, Class<E> type)`
     - `static <K,V> Map<K,V> checkedMap(Map<K,V> m, Class<K> keyType, Class<V> valueType)`
     - `static <K,V> NavigableMap<K,V> checkedNavigableMap(NavigableMap<K,V> m, Class<K> keyType, Class<V> valueType)`
     - `static <E> NavigableSet<E> checkedNavigableSet(NavigableSet<E> s, Class<E> type)`
     - `static <E> Queue<E> checkedQueue(Queue<E> queue, Class<E> type)`
     - `static <E> Set<E> checkedSet(Set<E> s, Class<E> type)`
     - `static <K,V> SortedMap<K,V> checkedSortedMap(SortedMap<K,V> m, Class<K> keyType, Class<V> valueType)`
     - `static <E> SortedSet<E> checkedSortedSet(SortedSet<E> s, Class<E> type)`
   - `equals` and `hashCode`
     - unmodifiable, synchronized and checked views — returns a collection whose equals method does not invoke the `equals` method of the underlying collection but `Object::equals`, same for `hashCode`
     - exception — `unmodifiableSet` and `unmodifiableList` methods use the `equals` and `hashCode` methods of the underlying collections

1. sub-ranges — views that changes reflect to the original
   - `List::subList`
   - `SortedMap::subMap`, `SortedMap::headMap`, `SortedMap::tailMap`
     - `NavigableMap` — overrides and has new definitions with inclusion option
     - also for `SortedSet` and `NavigableSet`

### Legacy Collections

1. `java.util.Hashtable` — synchronized `HashMap`, use `ConcurrentHashMap` instead

1. `java.util.Properties` — for property files
   ```java
   public class Properties extends Hashtable<Object,Object>
   ```
   - `String` keys and values
   - property file syntax — [.properties - Wikipedia](https://en.wikipedia.org/wiki/.properties)
   - can be saved to a stream or loaded from a stream
     - `void store(OutputStream out, String comments)`
     - more
   - can use a secondary `Properties` for default
     - `Properties()`
     - `Properties(Properties defaults)`
     - `String getProperty(String key)`
     - `String getProperty(String key, String defaultValue)` — `defaultValue` only when no secondary `Properties` and `key` absent
   - system properties — see `java` in [CLI](./javaBasics.md#cli), find accessible names in `$JAVA_HOME/conf/security/java.policy`
     ```shell
     # jshell> System.getProperties().forEach((k, v) -> System.out.printf("%s=%s\n", k, v))
     $ java -XshowSettings:properties --version
     Property settings: # only a portion is available on all platforms
         awt.toolkit = sun.awt.windows.WToolkit
         file.encoding = GBK # not an official property, use Charset.defaultCharset() instead
         file.separator = \
         java.awt.graphicsenv = sun.awt.Win32GraphicsEnvironment
         java.class.path =
         java.class.version = 56.0
         java.home = C:\Program Files\Java\jdk-12.0.2
         java.io.tmpdir = C:\Users\ADMINI~1\AppData\Local\Temp\
         java.library.path = # JAVA_PATH;C:\Windows\Sun\Java\bin;. for Windows
         java.runtime.name = OpenJDK Runtime Environment
         java.runtime.version = 12.0.2+10
         java.specification.name = Java Platform API Specification
         java.specification.vendor = Oracle Corporation
         java.specification.version = 12
         java.vendor = Oracle Corporation
         java.vendor.url = https://java.oracle.com/
         java.vendor.url.bug = https://bugreport.java.com/bugreport/
         java.version = 12.0.2
         java.version.date = 2019-07-16
         java.vm.compressedOopsMode = Zero based
         java.vm.info = mixed mode, sharing
         java.vm.name = OpenJDK 64-Bit Server VM
         java.vm.specification.name = Java Virtual Machine Specification
         java.vm.specification.vendor = Oracle Corporation
         java.vm.specification.version = 12
         java.vm.vendor = Oracle Corporation
         java.vm.version = 12.0.2+10
         jdk.debug = release
         line.separator = \r\n
         os.arch = amd64
         os.name = Windows 7
         os.version = 6.1
         path.separator = ;
         sun.arch.data.model = 64
         sun.boot.library.path = C:\Program Files\Java\jdk-12.0.2\bin
         sun.cpu.endian = little
         sun.cpu.isalist = amd64
         sun.desktop = windows
         sun.io.unicode.encoding = UnicodeLittle
         sun.java.launcher = SUN_STANDARD
         sun.jnu.encoding = GBK
         sun.management.compiler = HotSpot 64-Bit Tiered Compilers
         sun.os.patch.level = Service Pack 1
         sun.stderr.encoding = ms936
         sun.stdout.encoding = ms936
         user.country = CN
         user.dir = # pwd
         user.home = # ~
         user.language = en
         user.name = Administrator
         user.script =
         user.variant =
     ```

1. `java.util.Enumeration` — legacy `Iterator`
   - get `Enumeration` — use `Collections::enumeration`, `Collections::emptyEnumeration` to work with legacy code

1. `java.util.Vector` — legacy synchronized `ArrayList`

1. `java.util.Stack` — legacy
   ```java
   public class Stack<E> extends Vector<E>
   ```

1. `java.util.BitSet` — bit vector, no perfect alternative, still in use
   ```java
   public class BitSet extends Object
   implements Cloneable, Serializable
   ```
   - no boundary check — some methods (such as `size()`) may overflow
   - creation
     - constructors
     - `valueOf`
     - `clone`
     - `BitSet get(int fromIndex, int toIndex)`

## Preferences

1. preferences — in `java.util.prefs`
   - disadvantages of property files
     - no uniform location
     - no standard naming convention, increasing the likelihood of name clashes
   - location of preferences — registry in Windows, file system for Linux, implementation hidden from user
   - structure — tree structure, recommended to make the configuration node paths match the package names
   - multiple users — `Preferences.userRoot()`, `Preferences.systemRoot()`

1. `java.util.prefs.Preferences` — `Map` like
   ```java
   public abstract class Preferences extends Object
   ```
   - move around nodes
     - `static Preferences userRoot()`
     - `static Preferences userNodeForPackage(Class<?> c)`
     - `static Preferences systemRoot()`
     - `static Preferences systemNodeForPackage(Class<?> c)`
     - `abstract Preferences node(String pathName)`
   - get value from key
     - `abstract boolean getBoolean(String key, boolean def)`
     - `abstract byte[] getByteArray(String key, byte[] def)`
     - `abstract double getDouble(String key, double def)`
     - `abstract float getFloat(String key, float def)`
     - `abstract int getInt(String key, int def)`
     - `abstract long getLong(String key, long def)`
   - put key-value pairs
   - export and import
   - more

## Stream

1. stream
   - characteristics
     - no store — elements stored in an underlying collection or generated on demand, should not mutate upon terminal operation
     - does not mutate source — new stream on every call
     - lazy
     - one-time — may throw `IllegalStateException` if it detects that the stream is being reused
     - sequential or parallel — in parallel mode when the terminal method executes, all intermediate stream operations will be parallelized, using `ForkJoinPool`
     - ordered or not — streams that arise from ordered collections (arrays and lists), from ranges, generators, and iterators, or from calling `Stream::sorted` are ordered
       - order and parallelism — ordering does not preclude efficient parallelism, but some operations can be more effectively parallelized without requiring order
   - stream creation
     - from collections and `Arrays` — `Collection::stream`, `Collection::parallelStream`, `Arrays::stream`
       - under the hood — `StreamSupport::stream`, which uses `Spliterator`
     - static methods in `Stream`
     - `Pattern::splitAsStream`
     - `Files::lines`, `BufferedReader::lines`
     - `Stream.Builder`
     - `Random::ints`, `Random::doubles`, `Random::longs` for primitive variants
     - `CharSequence::codepoints`, `CharSequence::chars`

1. `java.util.stream.BaseStream`
   ```java
   public interface BaseStream<T,S extends BaseStream<T,S>>
   extends AutoCloseable
   ```
   - `void close()`
   - `boolean isParallel()`
   - `Iterator <T> iterator()`
   - `Spliterator <T> spliterator()`
   - `S onClose(Runnable closeHandler)`
   - `S parallel()`
   - `S sequential()`
   - `S unordered()`

1. `java.util.stream.StreamSupport` — for library writers presenting stream views of data structures
   ```java
   public final class StreamSupport extends Object
   ```

1. `java.util.stream.IntStream`, `java.util.stream.LongStream`, `java.util.stream.DoubleStream`
   ```java
   public interface IntStream
   extends BaseStream<Integer,IntStream>
   ```
   - methods like those in `Stream`
   - creation — partial `range()` in Python
     - `static IntStream range(int startInclusive, int endExclusive)`
     - `static IntStream rangeClosed(int startInclusive, int endInclusive)`
     - `static LongStream range(long startInclusive, long endExclusive)`
     - `static LongStream rangeClosed(long startInclusive, long endInclusive)`
   - transformation
     - `DoubleStream asDoubleStream()`  
       `LongStream asLongStream()`
     - `Stream<Integer> boxed()`  
       `Stream<Double> boxed()`  
       `Stream<Long> boxed()`
     - `LongSummaryStatistics summaryStatistics()`  
       `IntSummaryStatistics summaryStatistics()`  
       `DoubleSummaryStatistics summaryStatistics()`

1. `java.util.stream.Stream`
   ```java
   public interface Stream<T>
   extends BaseStream<T,Stream<T>>
   ```
   - creation
     - `static <T> Stream<T> of(T... values)`  
       `static <T> Stream<T> of(T t)`
     - `static <T> Stream<T> empty()`
     - `static <T> Stream<T> generate(Supplier<T> s)` — Returns an infinite sequential unordered stream where each element is generated by the provided Supplier.
     - `static <T> Stream<T> iterate(T seed, UnaryOperator<T> f)` — Returns an infinite sequential ordered Stream produced by iterative application of a function `f` to an initial element seed, producing a Stream consisting of seed, `f(seed)`, `f(f(seed))`, etc.
     - `static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b)`
     - `static <T> Stream.Builder<T> builder()`
       ```java
       public static interface Stream.Builder<T>
       extends Consumer<T>
       ```
       - `void accept(T t)`  
         `default Stream.Builder<T> add(T t)`
       - `Stream<T> build()`
   - transformation
     - `BaseStream` methods
     - `Stream<T> filter(Predicate<? super T> predicate)`
     - `<R> Stream<R> map(Function<? super T,? extends R> mapper)`  
       `DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper)`  
       `IntStream mapToInt(ToIntFunction<? super T> mapper)`  
       `LongStream mapToLong(ToLongFunction<? super T> mapper)`
     - `<R> Stream<R> flatMap(Function<? super T,? extends Stream<? extends R>> mapper)`  
       `DoubleStream flatMapToDouble(Function<? super T,? extends DoubleStream> mapper)`  
       `IntStream flatMapToInt(Function<? super T,? extends IntStream> mapper)`  
       `LongStream flatMapToLong(Function<? super T,? extends LongStream> mapper)`
   - query — order matters
     - `Stream<T> limit(long maxSize)`
     - `Stream<T> skip(long n)`
     - `Stream<T> distinct()` — uses `Object::equals`, the first occurrence when ordered
     - `Stream<T> sorted()`  
       `Stream<T> sorted(Comparator<? super T> comparator)`
   - reduction (terminal operation)
     - `Optional<T> max(Comparator<? super T> comparator)`
     - `Optional<T> min(Comparator<? super T> comparator)`
     - `long count()`
     - `Optional<T> findAny()` — effective when parallel
     - `Optional<T> findFirst()`
     - `boolean allMatch(Predicate<? super T> predicate)`
     - `boolean anyMatch(Predicate<? super T> predicate)`
     - `boolean noneMatch(Predicate<? super T> predicate)`
     - `T reduce(T identity, BinaryOperator<T> accumulator)`
     - `<U> U reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)`
     - `Collectors::reducing`
   - result (terminal operation)
     - `Stream<T> peek(Consumer<? super T> action)`
     - `void forEach(Consumer<? super T> action)`
     - `void forEachOrdered(Consumer<? super T> action)` — when in parallel mode and order matters
     - `Object[] toArray()`  
       `<A> A[] toArray(IntFunction<A[]> generator)`
     - `<R,A> R collect(Collector<? super T,A,R> collector)`  
       `<R> R collect(Supplier<R> supplier, BiConsumer<R,? super T> accumulator, BiConsumer<R,R> combiner)` — `Collector` shortcut
       ```java
       List<String> asList = stringStream.collect(ArrayList::new, ArrayList::add,
                                                  ArrayList::addAll);
       String concat = stringStream.collect(StringBuilder::new, StringBuilder::append,
                                            StringBuilder::append)
                                   .toString();
       ```
     - iterator methods from `BaseStream`

1. `java.util.stream.Collector` — A mutable reduction operation that accumulates input elements into a mutable result container
   ```java
   public interface Collector<T,A,R>
   ```
   - process
     - creation of a new result container (`Supplier<A> supplier()`)
     - incorporating a new data element into a result container (`BiConsumer<A,T> accumulator()`)
     - combining two result containers into one (`BinaryOperator<A> combiner()`)
     - performing an optional final transform on the container (`Function<A,R> finisher()`)
   - `Set<Collector.Characteristics> characteristics()`
   - `enum Characteristics`
     - `CONCURRENT` — Indicates that this collector is concurrent, meaning that the result container can support the accumulator function being called concurrently with the same result container from multiple threads.
     - `IDENTITY_FINISH` — Indicates that the finisher function is the identity function and can be elided.
       - `Function.identity()`
     - `UNORDERED` — Indicates that the collection operation does not commit to preserving the encounter order of input elements.
   - creation
     - `static <T,A,R> Collector<T,A,R> of(Supplier<A> supplier, BiConsumer<A,T> accumulator, BinaryOperator<A> combiner, Function<A,R> finisher, Collector.Characteristics... characteristics)`
     - `static <T,R> Collector<T,R,R> of(Supplier<R> supplier, BiConsumer<R,T> accumulator, BinaryOperator<R> combiner, Collector.Characteristics... characteristics)`
     - methods in `Collectors`

1. `java.util.stream.Collectors`
   - statics
     - `static <T> Collector<T,?,Double> averagingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Double> averagingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Double> averagingLong(ToLongFunction<? super T> mapper)`
     - `static <T> Collector<T,?,Optional<T>> maxBy(Comparator<? super T> comparator)`
     - `static <T> Collector<T,?,Optional<T>> minBy(Comparator<? super T> comparator)`
     - `static <T> Collector<T,?,DoubleSummaryStatistics> summarizingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,IntSummaryStatistics> summarizingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,LongSummaryStatistics> summarizingLong(ToLongFunction<? super T> mapper)`
     - `static <T> Collector<T,?,Long> counting()`
     - `static <T> Collector<T,?,Double> summingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Integer> summingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Long> summingLong(ToLongFunction<? super T> mapper)`
   - collector chaining
     - `static <T,A,R,RR> Collector<T,A,RR> collectingAndThen(Collector<T,A,R> downstream, Function<R,RR> finisher)` — add finisher
     - `static <T,U,A,R> Collector<T,?,R> mapping(Function<? super T,? extends U> mapper, Collector<? super U,A,R> downstream)` — preprocess with `T -> U` function for collector accepting `U`
     - `groupingBy`
     - `groupingByConcurrent`
     - `partitioningBy`
   - group (defaults to using `HashMap` and `ConcurrentHashMap`)
     - `static <T,K> Collector<T,?,Map<K,List<T>>> groupingBy(Function<? super T,? extends K> classifier)`  
       `static <T,K,A,D> Collector<T,?,Map<K,D>> groupingBy(Function<? super T,? extends K> classifier, Collector<? super T,A,D> downstream)`  
       `static <T,K,D,A,M extends Map<K,D>> Collector<T,?,M> groupingBy(Function<? super T,? extends K> classifier, Supplier<M> mapFactory, Collector<? super T,A,D> downstream)`
     - `static <T,K> Collector<T,?,ConcurrentMap<K,List<T>>> groupingByConcurrent(Function<? super T,? extends K> classifier)`  
       `static <T,K,A,D> Collector<T,?,ConcurrentMap<K,D>> groupingByConcurrent(Function<? super T,? extends K> classifier, Collector<? super T,A,D> downstream)`  
       `static <T,K,A,D,M extends ConcurrentMap<K,D>> Collector<T,?,M> groupingByConcurrent(Function<? super T,? extends K> classifier, Supplier<M> mapFactory, Collector<? super T,A,D> downstream)`
     - `static <T> Collector<T,?,Map<Boolean,List<T>>> partitioningBy(Predicate<? super T> predicate)`  
       `static <T,D,A> Collector<T,?,Map<Boolean,D>> partitioningBy(Predicate<? super T> predicate, Collector<? super T,A,D> downstream)`
   - to map (`HashMap` and `ConcurrentHashMap`)
     - `static <T,K,U> Collector<T,?,ConcurrentMap<K,U>> toConcurrentMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper)`  
       `static <T,K,U> Collector<T,?,ConcurrentMap<K,U>> toConcurrentMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper, BinaryOperator<U> mergeFunction)`  
       `static <T,K,U,M extends ConcurrentMap<K,U>> Collector<T,?,M> toConcurrentMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper, BinaryOperator<U> mergeFunction, Supplier<M> mapSupplier)`
     - `static <T,K,U> Collector<T,?,Map<K,U>> toMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper)`  
       `static <T,K,U> Collector<T,?,Map<K,U>> toMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper, BinaryOperator<U> mergeFunction)`  
       `static <T,K,U,M extends Map<K,U>> Collector<T,?,M> toMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper, BinaryOperator<U> mergeFunction, Supplier<M> mapSupplier)`
   - to collection
     - `static <T,C extends Collection<T>> Collector<T,?,C> toCollection(Supplier<C> collectionFactory)`
     - `static <T> Collector<T,?,List<T>> toList()`
     - `static <T> Collector<T,?,Set<T>> toSet()`
   - join
     - `static Collector<CharSequence,?,String> joining()`
     - `static Collector<CharSequence,?,String> joining(CharSequence delimiter)`
     - `static Collector<CharSequence,?,String> joining(CharSequence delimiter, CharSequence prefix, CharSequence suffix)`
   - reduce
     - `static <T> Collector<T,?,Optional<T>> reducing(BinaryOperator<T> op)`
     - `static <T> Collector<T,?,T> reducing(T identity, BinaryOperator<T> op)`
     - `static <T,U> Collector<T,?,U> reducing(U identity, Function<? super T,? extends U> mapper, BinaryOperator<U> op)`

## SPI (Service Loader)

1. SPI
   - [zhihu](https://zhuanlan.zhihu.com/p/28909673)
   - define the interface / superclass, and provide its implementation, no hard code
   - for `ServiceLoader`, define in `META-INF/services/packageName.InterfaceName` as a text file with fully qualified implementation name
     ```
     implementation.package.name.ImplName1
     implementation.package.name.ImplName2
     ...
     ```
   - example for `ServiceLoader`
     ```java
     public interface Search {
         public List<String> searchDoc(String keyword);
     }
     // implementations and configurations omitted
     public class TestCase {
         public static ServiceLoader<Search> s = ServiceLoader.load(Search.class);
         public static void main(String[] args) {
             for (Search search : s) {
                 search.searchDoc("hello world");
             }
         }
     }
     ```
   - `java.text.spi`

1. `java.util.ServiceLoader`
   ```java
   public final class ServiceLoader<S> extends Object
   implements Iterable<S>
   ```
   - `Iterator<S> iterator()` — Lazily loads the available providers of this loader's service.
   - `static <S> ServiceLoader<S> load(Class<S> service)` — Creates a new service loader for the given service type, using the current thread's context class loader.

## Other Utils

1. date and time related — see [Time](./javaMisc.md#time)

1. `java.util.PropertyPermission` — system property permissions

1. `java.util.UUID` — an immutable universally unique identifier (UUID). A UUID represents a 128-bit value.

1. `java.util.Objects` — null-safe
   - `static <T> int compare(T a, T b, Comparator<? super T> c)` — `return (a == b) ? 0 : c.compare(a, b);`
   - `static boolean deepEquals(Object a, Object b)` — Returns `true` if the arguments are deeply equal to each other and `false` otherwise.
   - `static boolean equals(Object a, Object b)` — `return (a == b) || (a != null && a.equals(b));`
   - `static int hash(Object... values)` — `return Arrays.hashCode(values);`
   - `static int hashCode(Object o)` — `return o != null ? o.hashCode() : 0;`
   - `static boolean isNull(Object obj)` — `return obj == null;`
   - `static boolean nonNull(Object obj)` — `return obj != null;`
   - `static <T> T requireNonNull(T obj)`  
     `static <T> T requireNonNull(T obj, String message)`  
     `static <T> T requireNonNull(T obj, Supplier<String> messageSupplier)` — Checks that the specified object reference is not null and throws a customized `NullPointerException` if it is.
   - `static String toString(Object o)` — `return String.valueOf(o);` &rarr; `return (obj == null) ? "null" : obj.toString();`
   - `static String toString(Object o, String nullDefault)` — `return (o != null) ? o.toString() : nullDefault;`
   - index check methods — since JDK 9

1. `java.util.Optional` — A container object which may or may not contain a non-null value, a better `null`
   ```java
   public final class Optional<T> extends Object
   ```
   - fallback to `null
     - `boolean isPresent()`
     - `T get()`
   - transformation
     - `void ifPresent(Consumer<? super T> consumer)`
     - `<U> Optional<U> map(Function<? super T,? extends U> mapper)`
     - `<U> Optional<U> flatMap(Function<? super T,Optional<U>> mapper)`
     - `Optional<T> filter(Predicate<? super T> predicate)`
     - `T orElse(T other)`
     - `T orElseGet(Supplier<? extends T> other)`
     - `<X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier)`
   - creation
     - `static <T> Optional<T> empty()`
     - `static <T> Optional<T> of(T value)`
     - `static <T> Optional<T> ofNullable(T value)`
   - variants
     - `java.util.OptionalInt`
     - `java.util.OptionalDouble`
     - `java.util.OptionalLong`

1. `java.util.LongSummaryStatistics`, `java.util.IntSummaryStatistics`, `java.util.DoubleSummaryStatistics`
   ```java
   public class LongSummaryStatistics extends Object
   implements LongConsumer, IntConsumer
   ```
   - creation
     - `Collectors::summarizingLong`, `Collectors::summarizingDouble`, `Collectors::summarizingInt`
     - `IntSummaryStatistics(long count, int min, int max, long sum)`
     - with out collector — `IntSummaryStatistics()`
       ```java
       LongSummaryStatistics stats = longStream.collect(LongSummaryStatistics::new,
                                                        LongSummaryStatistics::accept,
                                                        LongSummaryStatistics::combine);
       ```
   - statics
     - `double getAverage()`
     - `long getCount()`
     - `long|int|double getMax()`
     - `long|int|double getMin()`
     - `long|double getSum()`
     - `String toString()`

## ZIP, Checksum and Encryption

1. `java.util.Base64`
   - `java.util.Base64.Decoder`
   - `java.util.Base64.Encoder`

1. `java.util.zip.CRC32`
   ```java
   public class CRC32 extends Object
   implements Checksum
   ```
   - `interface java.util.zip.Checksum`

1. ZIP streams — see [ZIP Streams](./javaIO.md#zip-streams)

1. `java.security.MessageDigest` — MD5, SHA-1, SHA-256, SHA-384, and SHA-512
   ```java
   bytesToHex(MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(Paths.get("temp.py"))));
   ```
   ```java
   static char[] HEX_ARRAY = "0123456789ABCDEF".toCharArray();
   static String bytesToHex(byte[] bytes) {
       char[] hexChars = new char[bytes.length << 1];
       for (int j = 0; j < bytes.length; ++j) {
           int v = bytes[j] & 0xFF;
           hexChars[j << 1] = HEX_ARRAY[v >>> 4];
           hexChars[(j << 1) + 1] = HEX_ARRAY[v & 0x0F];
       }
       return String.valueOf(hexChars);
   }
   ```
   - CLI — `keytool`

1. `javax.crypto.Cipher` — AES, DES, RSA
   - `java.security.KeyPairGenerator`
