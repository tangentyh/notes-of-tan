# Concurrency

## Thread

1. multithread
   - construct a runnable thread
     - construct with a `Runnable` target
     - subclass `Thread` and override `run` method — recommended only when customizing `run` is not enough
   - start a thread — `Thread::run`
     - [zhihu](https://zhuanlan.zhihu.com/p/34414549)
   - thread scheduling — depends on the services the OS provides

1. properties of threads
   - priority — whenever the scheduler wants to pick a new thread, threads with higher priorities are preferred
     - inherit — initially set equal to the priority of the creating thread
     - mapped constants — `Thread.MIN_PRIORITY` 1, `Thread.NORM_PRIORITY` 5, `Thread.MAX_PRIORITY` 10, mapped to priority levels of the host platform
     - Windows has seven priority levels, priorities are ignored in Linux??
     - caveat — few scenarios there to ever tweak priorities. If you have several threads with a high priority that don’t become inactive, the lower-priority threads may never execute
   - daemon — serves other threads, JVM exits when only daemon threads remain
     - inherit — is a daemon thread if and only if the creating thread is a daemon
     - no persistence access — should never access a persistent resource such as a file or database since it can terminate at any time
   - state — enum `Thread.State`, see below
   - `Thread.UncaughtExceptionHandler` — method to be invoked from when the given thread terminates due to the given uncaught exception
     ```java
     @FunctionalInterface
     public interface UncaughtExceptionHandler {
         void uncaughtException(Thread t, Throwable e);
     }
     ```
     - exceptions in `uncaughtException` — any exception thrown by this method will be ignored by JVM
     - handler defaults — default handler defaults to `null`, individual handler defaults to `ThreadGroup`
   - `ThreadGroup` — represents a set of threads. In addition, a thread group can also include other thread groups
     - not recommended, use alternatives instead
     - action orders of `ThreadGroup::uncaughtException` when an uncaught exception
       - the `uncaughtException` method of the parent thread group
       - otherwise, default handler if non-`null`
       - otherwise, nothing happens if the `Throwable` is an instance of `ThreadDeath`
       - otherwise, print the name of the thread and the stack trace to `System.err`
   - `ThreadLocal`, `ThreadLocalRandom` — thread-local variables
     ```java
     public static final ThreadLocal<SimpleDateFormat> dateFormat =
         ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
     ```
     - motivations — avoid synchronization and blocking and boost performance
       - the internal data structures used by `SimpleDateFormat` can be corrupted by concurrent access, and synchronization is expensive
       - `Random` is thread safe using `AtomicLong::compareAndSet`, but inefficient if multiple threads need to wait for a single shared generator

1. `Runnable` — should be implemented by any class whose instances are intended to be executed by a thread
   ```java
   @FunctionalInterface
   public interface Runnable {
       void run();
   }
   ```
   - see [Callable and Future](#callable-and-future) for more
   - conversion to `Callable` — `Executors::callable`

1. `Thread`
   ```java
   public class Thread extends Object
   implements Runnable
   ```
   - constructors
     - `Thread(Runnable target)`
     - `Thread(Runnable target, String name)`
   - lifecycle
     - `void start()`
     - `void run()` — called by `start()`, generally should not be called explicitly
     - `void interrupt()` — set the interrupted status, if the thread is blocked, throw `InterruptedException` inside the thread
       - used by blocking methods — typically blocking methods (those related to `Thread.State.WAITING` and `Thread.State.TIMED_WAITING`) threaten to throw `InterruptedException`
   - wait
     - `static void yield()` — rarely appropriate to use, see javadoc
     - `static void sleep(long millis)` — for current thread  
       `static void sleep(long millis, int nanos)`
     - `void join()` — waits for this thread to die  
       `void join(long millis)`  
       `void join(long millis, int nanos)`
   - get information
     - `static Thread currentThread()`
     - `boolean isAlive()`
     - `boolean isInterrupted()` — can be used for check in `while`
     - `static boolean interrupted()` — for current thread, also clears interrupted status
     - `int getPriority()`
     - `boolean isDaemon()`
     - `Thread.State getState()`
   - get handler
     - `Thread.UncaughtExceptionHandler getUncaughtExceptionHandler()`
     - `static Thread.UncaughtExceptionHandler getDefaultUncaughtExceptionHandler()`
   - set
     - `void setPriority(int newPriority)`
     - `void setDaemon(boolean on)`
     - `void setUncaughtExceptionHandler(Thread.UncaughtExceptionHandler eh)`
     - `static void setDefaultUncaughtExceptionHandler(Thread.UncaughtExceptionHandler eh)`

1. `enum Thread.State`
   - `NEW` — after `new`, a thread that has not yet started is in this state.
   - `RUNNABLE` — after `start()`, a thread executing in the Java virtual machine is in this state, may not be running due to CPU time slicing
   - `BLOCKED` — intrinsic object lock, a thread that is blocked waiting for a monitor lock is in this state.
   - `WAITING` — after `Object::wait`, `Thread::join`, or by `Lock` or `Condition`, a thread that is waiting indefinitely for another thread to perform a particular action is in this state.
   - `TIMED_WAITING` — after `Thread::sleep`, or methods for `WAITING` with a time parameter, a thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
   - `TERMINATED` — A thread that has exited is in this state.

1. `ThreadGroup`
   ```java
   public class ThreadGroup extends Object
   implements Thread.UncaughtExceptionHandler
   ```
   - share some APIs of `Thread`

1. `ThreadLocal`
   ```java
   public class ThreadLocal<T>
   ```
   - `T get()`
   - `void remove()` — can prevent possible memory leak
   - `void set(T value)`
     ```java
     public void set(T value) {
         Thread t = Thread.currentThread();
         ThreadLocalMap map = getMap(t);
         if (map != null) {
             map.set(this, value);
         } else {
             createMap(t, value);
         }
     }
     ```
   - `static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier)`
   - `ThreadLocal.ThreadLocalMap`, referenced by `Thread.threadLocals` field — open addressing hash table
     - entry — `WeakReference<ThreadLocal<?>>` as key, whose hash value managed by a static `AtomicInteger`, `getAndAdd` for every `ThreadLocal` instance
     - memory leak — referent of `WeakReference<ThreadLocal<?>>` keys can be reclaimed by GC, but no `ReferenceQueue` like in `WeakHashMap`, `expungeStaleEntries()` called only when rehash, and single entry expunge method called only when a stale entry encountered, possibly leaving stale entries not expunged

1. `java.util.concurrent.ThreadLocalRandom`
   ```java
   public class ThreadLocalRandom extends Random
   ```
   - `static ThreadLocalRandom current()`

## Synchronization and Locks

1. synchronization
   - race condition — when a system's substantive behavior is dependent on the sequence or timing of other uncontrollable events
   - atomic
   - preference — concurrent collections with non-blocking mechanism, synchronizers > underlying locks in `java.util.concurrent` > `synchronized` > `Lock`
     - avoid client-side locking — discouraged to use the lock of an object to implement additional atomic operations, e.g. use the lock of a `Vector` object to implement something like `AtomicLong::getAndAdd` for given index
   - when to use
     > If you write a variable which may next be read by another thread, or you read a variable which may have last been written by another thread, you must use synchronization.

1. lock — when the lock object is locked, no other thread can `lock()` (being blocked)
   ```java
   myLock.lock(); // a ReentrantLock object
   try {
       // critical section
   }
   finally {
       myLock.unlock(); // make sure the lock is unlocked even if an exception is thrown
   }
   ```

1. conditions, condition queues or condition variables — a means for one thread to suspend execution (to "wait") until notified by another thread that some state condition may now be true
   ```java
   class BoundedBuffer {
     final Lock lock = new ReentrantLock();
     final Condition notFull  = lock.newCondition();
     final Condition notEmpty = lock.newCondition();
     final Object[] items = new Object[100];
     int putptr, takeptr, count;
     public void put(Object x) throws InterruptedException {
       lock.lock();
       try {
         while (count == items.length) notFull.await();
         items[putptr] = x;
         if (++putptr == items.length) putptr = 0;
         ++count;
         notEmpty.signal();
       } finally {
         lock.unlock();
       }
     }
     public Object take() throws InterruptedException {
       lock.lock();
       try {
         while (count == 0) notEmpty.await();
         Object x = items[takeptr];
         if (++takeptr == items.length) takeptr = 0;
         --count;
         notFull.signal();
         return x;
       } finally {
         lock.unlock();
       }
     }
   }
   ```
   - atomic lock release when calling `await()` — atomically releases the associated lock and suspends the current thread, just like `Object::wait`
   - re-acquire the lock when `signal()` — a thread must then re-acquire the lock before returning from `await()`
   - intrinsically bound to a lock
     - `Lock::newCondition` to get instances
     - `await` and `signal` methods can only be called if the thread owns the `Lock` of the `Condition`
   - wait set — a thread enters wait set and stays deactivated after the call to `await`, until `signal`ed by other threads
   - deadlock — when all threads are in wait set

1. `synchronized` — use intrinsic lock, a method or code block that is atomic to a thread, reentrant
   ```java
   public synchronized void transfer(int from, int to, int amount) throws InterruptedException {
       while (accounts[from] < amount) wait(); // wait on intrinsic object lock's single condition
       accounts[from] -= amount;
       accounts[to] += amount;
       notifyAll(); // notify all threads waiting on the condition
   }
   ```
   ```java
   synchronized (obj) {
       while (<condition does not hold>)
           obj.wait(timeout, nanos);
       // Perform action appropriate to condition
   }
   ```
   - intrinsic lock — every object has an intrinsic lock, used if declared with `synchronized`
     - static methods — the intrinsic lock of associated `Class<?>` is used
   - equivalent conditions in `Object` — see [Inheritance](./javaBasics.md#inheritance) for other `Object` APIs
     - `void notify()`
     - `void notifyAll()`
     - `void wait()`
     - `void wait(long timeout)`
     - `void wait(long timeout, int nanos)`
   - monitor — intrinsic lock is the loose adaption of the monitor concept
     - [Monitor (synchronization) - Wikipedia](https://en.wikipedia.org/wiki/Monitor_(synchronization))
   - JVM optimization — see [zhihu](https://zhuanlan.zhihu.com/p/75880892), [CS-Notes/Java 并发.md at master · CyC2018/CS-Notes](https://github.com/CyC2018/CS-Notes/blob/master/notes/Java%20%E5%B9%B6%E5%8F%91.md#%E5%8D%81%E4%BA%8C%E9%94%81%E4%BC%98%E5%8C%96)

1. `interface java.util.concurrent.locks.Lock`
   - `void lock()` — other threads are blocked if the lock cannot be acquired, cannot be interrupted
   - `void lockInterruptibly()` — `lock()` that can be interrupted, equivalent to `tryLock()` with an infinite timeout
   - `Condition newCondition()`
   - `boolean tryLock()` — return `false` rather than being blocked
   - `boolean tryLock(long time, TimeUnit unit)` — can be interrupted
   - `void unlock()`

1. `interface java.util.concurrent.locks.Condition` — renamed API as counterpart methods in `Object` are `final`
   - `void await()`
   - `boolean await(long time, TimeUnit unit)`
   - `long awaitNanos(long nanosTimeout)`
   - `void awaitUninterruptibly()`
   - `boolean awaitUntil(Date deadline)`
   - `void signal()` — choose one random thread to unblock, more likely to deadlock compared to `signalAll()`
   - `void signalAll()`

1. `java.util.concurrent.locks.ReentrantLock`
   ```java
   public class ReentrantLock extends Object
   implements Lock, Serializable
   ```
   - reentrant — has a hold count, can be repeatedly acquired by a thread, `lock()` will return immediately if the current thread already owns the lock, every `lock()` needs `unlock()` in order to relinquish the lock
     - `int getHoldCount()`
   - fair — a lot slower, a fair lock can still be unfair if the thread scheduler is unfair
     - `ReentrantLock()`
     - `ReentrantLock(boolean fair)`
   - underlying implementation — `AbstractQueuedSynchronizer::compareAndSetState`

1. `java.util.concurrent.locks.ReentrantReadWriteLock` — read lock for accessors, write lock for mutators
   ```java
   public class ReentrantReadWriteLock extends Object
   implements ReadWriteLock, Serializable
   ```
   - `ReentrantReadWriteLock.ReadLock readLock()`
     - read lock can be acquired if — the write lock is not held by another thread
   - `ReentrantReadWriteLock.WriteLock writeLock()`
     - write lock can be acquired if — neither the read nor write lock are held by another thread
   - `interface java.util.concurrent.locks.ReadWriteLock`
     - scenarios — while only a single thread at a time (a writer thread) can modify the shared data, in many cases any number of threads can concurrently read the data
     - mutual exclusive or not — the read lock may be held simultaneously by multiple reader threads, so long as there are no writers. The write lock is exclusive
     - `writeLock` happen-before — must guarantee that the memory synchronization effects of `writeLock` operations: a thread successfully acquiring the read lock will see all updates made upon previous release of the write lock
     - simultaneous read and write lock — a writer can acquire the read lock, but not vice-versa
     - overhead — the read-write lock implementation (which is inherently more complex than a mutual exclusion lock) can dominate the execution cost if the read operations are too short
   - underlying implementation — `AbstractQueuedSynchronizer::compareAndSetState`

1. `java.util.concurrent.locks.StampedLock` — a capability-based lock, not reentrant, lock acquisition methods return a stamp that represents and controls access with respect to a lock state; lock release and conversion methods require stamps as arguments
   ```java
   public class StampedLock implements Serializable
   ```
   - stamp — zero value for failure, the state of a `StampedLock` consists of a version and mode
   - three modes
     - write — blocks waiting for exclusive access
       - `long writeLock()`
       - `void unlockWrite(long stamp)`
     - read — blocks waiting for non-exclusive access
       - `long readLock()`
       - `void unlockRead(long stamp)`
       - `int getReadLockCount()`
     - optimistic read — an extremely weak version of a read-lock, that can be broken by a writer at any time, for short read-only code segments
       - `long tryOptimisticRead()` — returns a non-zero stamp only if the lock is not currently held in write mode
       - `boolean validate(long stamp)` — returns true if the lock has not been acquired in write mode since obtaining a given stamp
     - `void unlock(long stamp)`
   - mode conversion methods
   - `Lock` conversion
     - `Lock asReadLock()`
     - `Lock asWriteLock()`
     - `ReadWriteLock asReadWriteLock()`
   - underlying implementation — memory fence methods in `VarHandle`, and `VarHandle::compareAndSet`
   - example
     ```java
     class Point {
        private double x, y;
        private final StampedLock sl = new StampedLock();
        void move(double deltaX, double deltaY) { // an exclusively locked method
          long stamp = sl.writeLock();
          try {
            x += deltaX;
            y += deltaY;
          } finally {
            sl.unlockWrite(stamp);
          }
        }
        double distanceFromOrigin() { // A read-only method
          long stamp = sl.tryOptimisticRead();
          double currentX = x, currentY = y;
          if (!sl.validate(stamp)) {
             stamp = sl.readLock();
             try {
               currentX = x;
               currentY = y;
             } finally {
                sl.unlockRead(stamp);
             }
          }
          return Math.sqrt(currentX * currentX + currentY * currentY);
        }
        void moveIfAtOrigin(double newX, double newY) { // upgrade
          // Could instead start with optimistic, not read mode
          long stamp = sl.readLock();
          try {
            while (x == 0.0 && y == 0.0) {
              long ws = sl.tryConvertToWriteLock(stamp);
              if (ws != 0L) {
                stamp = ws;
                x = newX;
                y = newY;
                break;
              }
              else {
                sl.unlockRead(stamp);
                stamp = sl.writeLock();
              }
            }
          } finally {
            sl.unlock(stamp);
          }
        }
      }
     ```

## volatile and Atomics

1. `volatile` — ensures that a field is coherently accessed by multiple threads
   - problems of concurrent write and read to instance fields
     - cache coherence — threads running in different processors may see different values for the same memory location
     - reorder — a memory value can be changed by another thread, but compilers assume memory values are only changed with explicit instructions, and compilers reorder instructions to maximize throughput
     - memory barrier, membar, memory fence or fence instruction — a type of barrier instruction that causes a CPU or compiler to enforce an ordering constraint on memory operations issued before and after the barrier instruction. This typically means that operations issued prior to the barrier are guaranteed to be performed before operations issued after the barrier
     - barrier — a barrier for a group of threads or processes in the source code means any thread/process must stop at this point and cannot proceed until all other threads/processes reach this barrier
   - ensure changes visible — compiler will insert the appropriate code to ensure that a change to the a variable in one thread is visible from any other thread that reads the variable
     - [happen-before order](https://docs.oracle.com/javase/specs/jls/se11/html/jls-17.html#jls-17.4.5) — a write to a volatile field is visible to and ordered before every subsequent read of that field
   - atomicity — volatile variables do not provide any atomicity, but makes read and write to `long` and `double` atomic
     - [JLS 17.7. Non-Atomic Treatment of double and long](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.7)  
       > For the purposes of the Java programming language memory model, a single write to a non-volatile `long` or `double` value is treated as two separate writes: one to each 32-bit half. This can result in a situation where a thread sees the first 32 bits of a 64-bit value from one write, and the second 32 bits from another write.
   - also `synchronized` — changes visible before a variable is unlocked

1. `java.util.concurrent.atomic` — use efficient machine-level instructions to guarantee atomicity without using locks
   - optimistic update — `compareAndSet` method, or use lambda like `accumulateAndGet` method
     ```java
     public static AtomicLong largest = new AtomicLong();
     // In some thread...
     // largest.set(Math.max(largest.get(), observed)); // Error--race condition!
     do {
         oldValue = largest.get();
         newValue = Math.max(oldValue, observed);
     } while (!largest.compareAndSet(oldValue, newValue));
     ```
     - CAS, [Compare-and-swap - Wikipedia](https://en.wikipedia.org/wiki/Compare-and-swap)
       - ABA problem — use `AtomicStampedReference`, or traditional synchronization
   - delayed computation — `LongAdder`, `LongAccumulator`, `DoubleAdder`, `DoubleAccumulator`
     - under high contention, performance suffers because the optimistic updates require too many retries
     - the computation must be associative and commutative
     - `identity` — initial value, also used when `accumulate()`

1. `java.util.concurrent.atomic` classes
   - `java.util.concurrent.atomic.AtomicBoolean` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicIntegerArray` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicIntegerFieldUpdater<T>`
   - `java.util.concurrent.atomic.AtomicLongArray` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicLongFieldUpdater<T>`
   - `java.util.concurrent.atomic.AtomicMarkableReference<V>`
   - `java.util.concurrent.atomic.AtomicReference<V>` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicReferenceArray<E>` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicReferenceFieldUpdater<T,V>`
   - `java.util.concurrent.atomic.AtomicStampedReference<V>`
   - `java.lang.Number`
     - `java.util.concurrent.atomic.AtomicInteger`
     - `java.util.concurrent.atomic.AtomicLong`
     - `java.util.concurrent.atomic.Striped64` — a package-local class holding common representation and mechanics for classes supporting dynamic striping on 64 bit values
       - `java.util.concurrent.atomic.DoubleAccumulator`
       - `java.util.concurrent.atomic.DoubleAdder`
       - `java.util.concurrent.atomic.LongAccumulator`
       - `java.util.concurrent.atomic.LongAdder`

## Thread-Safe Collections

1. `java.util.concurrent` exceptions
   - `java.util.concurrent.BrokenBarrierException`
   - `java.util.concurrent.ExecutionException`
   - `java.util.concurrent.TimeoutException`
   - `RuntimeException`
     - `java.util.concurrent.CompletionException`
     - `IllegalStateException`
       - `java.util.concurrent.CancellationException`
     - `java.util.concurrent.RejectedExecutionException`

### Blocking Queues

1. Blocking Queues
   - producer consumer model
   - no synchronization needed — instead of synchronization and locks, queue the instructions and let only the access of one thread
   - the queue needs to be thread-safe — blocking queue blocks a thread when no slot for producer or no provision for consumer
   - timeout — some methods have versions with timeout

1. `java.util.concurrent.BlockingQueue`
   ```java
   public interface BlockingQueue<E> extends Queue<E>
   ```
   - non-null
   - blocking
     - `E put(E e)`
     - `E take()`
   - timeout
     - `boolean offer(E e, long timeout, TimeUnit unit)`  
       `boolean offer(E e)` — 0 timeout
     - `E poll(long timeout, TimeUnit unit)`

1. `java.util.concurrent.BlockingDeque`
   ```java
   public interface BlockingDeque<E>
   extends BlockingQueue<E>, Deque<E>
   ```

1. `java.util.concurrent.LinkedBlockingQueue` — optionally-bounded blocking queue based on linked nodes
   ```java
   public class LinkedBlockingQueue<E> extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```

1. `java.util.concurrent.LinkedBlockingDeque` — deque version of `LinkedBlockingQueue`
   ```java
   public class LinkedBlockingDeque<E> extends AbstractQueue<E>
   implements BlockingDeque<E>, Serializable
   ```

1. `java.util.concurrent.ArrayBlockingQueue` — optionally-fair bounded blocking queue backed by an array
   ```java
   public class ArrayBlockingQueue<E> extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```

1. `java.util.concurrent.PriorityBlockingQueue` — unbounded blocking queue that uses the same ordering rules as `PriorityQueue`
   ```java
   public class PriorityBlockingQueue<E> extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```

1. `java.util.concurrent.DelayQueue` — unbounded blocking queue of `Delayed` elements backed by `PriorityQueue`, in which an element can only be taken when its delay has expired
   ```java
   public class DelayQueue<E extends Delayed> extends AbstractQueue<E>
   implements BlockingQueue<E>
   ```
   - The head of the queue is that `Delayed` element whose delay expired furthest in the past
   - `java.util.concurrent.Delay`
     ```java
     public interface Delayed extends Comparable<Delayed> {
         long getDelay(TimeUnit unit);
     }
     ```
     - consistency between `compareTo` and `getDelay` — a `compareTo` method needs to provide an ordering consistent with its `getDelay` method, which violates the consistency between `compareTo` and `equals`

1. `java.util.concurrent.LinkedTransferQueue` — unbounded `TransferQueue` backed by dual queues of slack (refer to source code) based on linked nodes
   ```java
   public class LinkedTransferQueue<E> extends AbstractQueue<E>
   implements TransferQueue<E>, Serializable
   ```
   - `java.util.concurrent.TransferQueue` — A `BlockingQueue` in which producers may wait for consumers to receive elements
     ```java
     public interface TransferQueue<E> extends BlockingQueue<E>
     ```
     - `void transfer(E e)` — transfers the specified element immediately if there exists a consumer already waiting, else waits until the element is received by a consumer
   - inaccurate `size()` — `size()` is O(n) and maybe inaccurate, due to non-data nodes and concurrency
   - atomicity for bulk operations — bulk operations `addAll`, `removeAll`, `retainAll`, `containsAll`, `equals`, and `toArray` are not guaranteed to be performed atomically

### Concurrent Collections

1. concurrent collections
   - generally non-blocking algorithm
   - some are non-null
   - inaccurate `size()` — `size()` is O(n) and maybe inaccurate, due to non-data nodes and concurrency
   - atomicity for bulk operations — bulk operations `addAll`, `removeAll`, `retainAll`, `containsAll`, `equals`, and `toArray` are not guaranteed to be performed atomically
   - iterators are weakly consistent — may or may not reflect all modifications after construction, but will not return a value twice

1. `java.util.concurrent.ConcurrentLinkedQueue`
   ```java
   public class ConcurrentLinkedQueue<E> extends AbstractQueue<E>
   implements Queue<E>, Serializable
   ```
   - [Simple, Fast, and Practical Non-Blocking and Blocking Concurrent Queue Algorithms](http://www.cs.rochester.edu/~scott/papers/1996_PODC_queues.pdf)

1. `java.util.concurrent.ConcurrentLinkedDeque`
   ```java
   public class ConcurrentLinkedDeque<E> extends AbstractCollection<E>
   implements Deque<E>, Serializable
   ```

1. `java.util.concurrent.ConcurrentSkipListSet`
   ```java
   public class ConcurrentSkipListSet<E> extends AbstractSet<E>
   implements NavigableSet<E>, Cloneable, Serializable
   ```

1. `java.util.concurrent.ConcurrentSkipListMap`
   ```java
   public class ConcurrentSkipListMap<K,V> extends AbstractMap<K,V>
   implements ConcurrentNavigableMap<K,V>, Cloneable, Serializable
   ```

1. `java.util.concurrent.ConcurrentHashMap`
   ```java
   public class ConcurrentHashMap<K,V> extends AbstractMap<K,V>
   implements ConcurrentMap<K,V>, Serializable
   ```
   - fully interoperable with `Hashtable`
   - `concurrencyLevel` — the estimated number of concurrently updating threads, defaults to 16, other write threads will be blocked if the number exceeded
   - `long mappingCount()` — used in lieu of `size()` for `long`; an estimate, the actual count may differ if there are concurrent insertions or removals
   - atomicity
     - value non-null — `null` is for absent; if also for value, incompatible with the operation that use `synchronized` on the old value
     - put — `synchronized` on the old value, CAS if `null`
     - replace — `synchronized` on the old value
     - lambda — `synchronized` on the old value, if `null`, CAS a dummy value and `synchronized` on the dummy value, compute lambda, set computed value, exit lock block
     - use `ConcurrentHashMap<String, LongAdder>` with `putIfAbsent`
       ```java
       map.putIfAbsent(word, new LongAdder()).increment();
       map.computeIfAbsent(word, k -> new LongAdder()).increment(); // better
       ```
   - `parallelismThreshold` of bulk operations — if the map contains more elements than the threshold, the bulk operation is parallelized, fully utilize the `ForkJoinPool.commonPool()` if set to 1
   - `java.util.concurrent.ConcurrentMap`
     ```java
     public interface ConcurrentMap<K,V> extends Map<K,V>
     ```
   - concurrent set views
     - `ConcurrentHashMap.KeySetView<K,V> keySet()`  
       `ConcurrentHashMap.KeySetView<K,V> keySet(V mappedValue)`
     - `static <K> ConcurrentHashMap.KeySetView<K,Boolean> newKeySet()`  
       `static <K> ConcurrentHashMap.KeySetView<K,Boolean> newKeySet(int initialCapacity)`

### Copy on Write Collections

1. `java.util.concurrent.CopyOnWriteArrayList` — all mutative operations (add, set, and so on) are implemented by making a fresh copy of the underlying array
   ```java
   public class CopyOnWriteArrayList<E> extends Object
   implements List<E>, RandomAccess, Cloneable, Serializable
   ```
   - tradeoff — efficient when traversal operations vastly outnumber mutations, and is useful when you cannot or don't want to synchronize traversals
     - comparaison to synchronized view — when frequent mutation is needed, synchronized view of `ArrayList` can outperform a `CopyOnWriteArrayList`
   - snapshot iterator — iterator method uses a reference to the state of the array at the point that the iterator was created
   - thread-safe — memory consistency

1. `java.util.concurrent.CopyOnWriteArraySet` — a `Set` that uses an internal `CopyOnWriteArrayList` for all of its operations
   ```java
   public class CopyOnWriteArraySet<E> extends AbstractSet<E>
   implements Serializable
   ```

## Callable and Future

1. `java.util.concurrent.Callable` — `Runnable` that can return a result and throw a checked exception
   ```java
   @FunctionalInterface
   public interface Callable<V> {
       V call() throws Exception;
   }
   ```
   - methods for converting to `Callable` in `Executors`

1. `java.util.concurrent.Future` — result-bearing action that can be cancelled
   ```java
   public interface Future<V>
   ```
   - `V get()` — block until finish or exception
     - throws `InterruptedException`, `ExecutionException`
   - `V get(long timeout, TimeUnit unit)` — `TimeoutException` when timeout
   - `boolean cancel(boolean mayInterruptIfRunning)`
   - `boolean isCancelled()`
   - `boolean isDone()`

1. `java.util.concurrent.ScheduledFuture` — delayed `Future`
   ```java
   public interface ScheduledFuture<V>
   extends Delayed, Future<V>
   ```

1. `java.util.concurrent.FutureTask` — A cancellable asynchronous computation, or wrapper for `Callable` or `Runnable`
   ```java
   public class FutureTask<V> extends Object
   implements RunnableFuture<V>
   ```
   - `java.util.concurrent.RunnableFuture`
     ```java
     public interface RunnableFuture<V>
     extends Runnable, Future<V>
     ```
   - constructors
     - `FutureTask(Callable<V> callable)`
     - `FutureTask(Runnable runnable, V result)`

1. `java.util.concurrent.ForkJoinTask` — see [Fork-Join](#fork-join)

1. `java.util.concurrent.CompletableFuture` — A `Future` that may be explicitly completed (setting its value and status), and may be used as a `CompletionStage`, supporting dependent functions and actions that trigger upon its completion (`Promise.then` in JS), can be async
   ```java
   public class CompletableFuture<T> extends Object
   implements Future<T>, CompletionStage<T>
   ```
   - `async` suffixed methods — use `ForkJoinPool.commonPool`, or the `Executor` argument, all generated asynchronous tasks are instances of the marker interface `CompletableFuture.AsynchronousCompletionTask`
   - non-`async` methods — actions performed by the thread that completes the current `CompletableFuture`, or by any other caller of a completion method
   - static methods
     - `static CompletableFuture<Void> allOf(CompletableFuture<?>... cfs)`
     - `static CompletableFuture<Object> anyOf(CompletableFuture<?>... cfs)`
     - `static <U> CompletableFuture<U> completedFuture(U value)` — `Promise.resolve`
     - `static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)`
   - explicitly complete
     - `boolean cancel(boolean mayInterruptIfRunning)`
     - `boolean complete(T value)`
     - `boolean completeExceptionally(Throwable ex)`
     - `void obtrudeException(Throwable ex)`
     - `void obtrudeValue(T value)`
   - `Promise.prototype.then`
     - `CompletableFuture<Void> thenAccept(Consumer<? super T> action)`
       - `acceptEither`
       - `thenAcceptBoth`
     - `<U> CompletableFuture<U> thenApply(Function<? super T,? extends U> fn)`
       - `applyToEither`
     - `CompletableFuture<Void> thenRun(Runnable action)`
       - `runAfterBoth`
       - `runAfterEither`
     - `<U,V> CompletableFuture<V> thenCombine(CompletionStage<? extends U> other, BiFunction<? super T,? super U,? extends V> fn)`
     - `<U> CompletableFuture<U> thenCompose(Function<? super T,? extends CompletionStage<U>> fn)`
   - `Promise.prototype.catch`
     - `CompletableFuture<T> exceptionally(Function<Throwable,? extends T> fn)`
   - `catch` and `then`
     - `<U> CompletableFuture<U> handle(BiFunction<? super T,Throwable,? extends U> fn)`
     - `CompletableFuture<T> whenComplete(BiConsumer<? super T,? super Throwable> action)`
   - get
     - `T get()`
     - `T get(long timeout, TimeUnit unit)`
     - `T getNow(T valueIfAbsent)`
     - `T join()`
   - manage
     - `int getNumberOfDependents()` — estimated
     - `boolean isCancelled()`
     - `boolean isCompletedExceptionally()`
     - `boolean isDone()`
   - more

## Executors

1. thread pool
   - constructing a new thread is expensive
   - throttle the number of concurrent threads — huge number of threads can greatly degrade performance and even crash the virtual machine

1. `java.util.concurrent.Executor` — decoupling task submission from the mechanics of how each task will be run
   ```java
   public interface Executor
   ```
   - `void execute(Runnable command)`

1. `java.util.concurrent.ExecutorService` — `Executor` with methods to manage termination and produce `Future`
   ```java
   public interface ExecutorService extends Executor
   ```
   - `<T> Future<T> submit(Callable<T> task)`  
     `Future<?> submit(Runnable task)`  
     `<T> Future<T> submit(Runnable task, T result)`
   - `boolean awaitTermination(long timeout, TimeUnit unit)`
   - `invokeAll`, `invokeAny`, with timeout version
     - `<T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks)`  
       `<T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks, long timeout, TimeUnit unit)`
     - `<T> T invokeAny(Collection<? extends Callable<T>> tasks)`  
       `<T> T invokeAny(Collection<? extends Callable<T>> tasks, long timeout, TimeUnit unit)`
   - `void shutdown()`  
     `List<Runnable> shutdownNow()`
   - `java.util.concurrent.AbstractExecutorService` — default implementations of `ExecutorService` execution methods
     ```java
     public abstract class AbstractExecutorService extends Object
     implements ExecutorService
     ```

1. `java.util.concurrent.ExecutorCompletionService` — lightweight blocking queue that decouples the production of new asynchronous tasks from the consumption of the results of completed tasks
   ```java
   public class ExecutorCompletionService<V> extends Object
   implements CompletionService<V>
   ```
   - constructors
     - `ExecutorCompletionService(Executor executor)`
     - `ExecutorCompletionService(Executor executor, BlockingQueue<Future<V>> completionQueue)`
   - `Future<V> poll()` — `null` if none are present  
     `Future<V> poll(long timeout, TimeUnit unit)`
   - `Future<V> submit(Callable<V> task)`  
     `Future<V> submit(Runnable task, V result)`
   - `Future<V> take()` — wait if none are present

1. `java.util.concurrent.ScheduledExecutorService` — `ExecutorService` that can schedule commands to run after a given delay, or to execute periodically
   ```java
   public interface ScheduledExecutorService extends ExecutorService
   ```
   - `<V> ScheduledFuture<V> schedule(Callable<V> callable, long delay, TimeUnit unit)`
   - `ScheduledFuture<?> schedule(Runnable command, long delay, TimeUnit unit)`
   - `ScheduledFuture<?> scheduleAtFixedRate(Runnable command, long initialDelay, long period, TimeUnit unit)`
   - `ScheduledFuture<?> scheduleWithFixedDelay(Runnable command, long initialDelay, long delay, TimeUnit unit)`

1. `java.util.concurrent.ThreadPoolExecutor` — `ExecutorService` that executes each submitted task using one of possibly several pooled threads
   ```java
   public class ThreadPoolExecutor extends AbstractExecutorService
   ```
   - creation — returned by `Executors.newCachedThreadPool()`, `Executors.newFixedThreadPool(int)`, `Executors.newSingleThreadExecutor()`
   - reject policies when task queue overflow, as static inner classes
     - `ThreadPoolExecutor.AbortPolicy` — `RejectedExecutionException`
     - `ThreadPoolExecutor.CallerRunsPolicy`
     - `ThreadPoolExecutor.DiscardOldestPolicy`
     - `ThreadPoolExecutor.DiscardPolicy`
   - more

1. `java.util.concurrent.ScheduledThreadPoolExecutor` — `ThreadPoolExecutor` that can additionally schedule commands to run after a given delay, or to execute periodically, preferable to `java.util.Timer`
   ```java
   public class ScheduledThreadPoolExecutor extends ThreadPoolExecutor
   implements ScheduledExecutorService
   ```
   - creation — returned by `Executors.newScheduledThreadPool(int)`, `Executors.newSingleThreadScheduledExecutor()`

1. `java.util.concurrent.ForkJoinPool` — see [Fork-Join](#fork-join)

1. `java.util.concurrent.Executors` — factory and utility methods
   - thread pools
     - `static ExecutorService newCachedThreadPool()` — new threads are created as needed; idle threads are kept for 60 seconds  
       `static ExecutorService newCachedThreadPool(ThreadFactory threadFactory)`
     - `static ExecutorService newFixedThreadPool(int nThreads)` — contains a fixed set of threads; tasks kept in a queue when overloaded; idle threads are kept indefinitely  
       `static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory)`
     - `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize)` — fixed-thread pool for scheduled execution; a replacement for `java.util.Timer`  
       `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize, ThreadFactory threadFactory)`
     - `static ExecutorService newSingleThreadExecutor()` — a “pool” with a single thread that executes the submitted tasks sequentially  
       `static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory)`
     - `static ScheduledExecutorService newSingleThreadScheduledExecutor()` — scheduled version of `newSingleThreadExecutor`
       `static ScheduledExecutorService newSingleThreadScheduledExecutor(ThreadFactory threadFactory)`
     - `static ExecutorService newWorkStealingPool()`-- `ForkJoinPool`  
       `static ExecutorService newWorkStealingPool(int parallelism)`
     - `java.util.concurrent.ThreadFactory`
       ```java
       public interface ThreadFactory {
           Thread newThread(Runnable r);
       }
       ```
   - methods for conversion to `Callable` — from `Runnable`, `PrivilegedAction`, `PrivilegedExceptionAction`
   - more

### Fork-Join

1. fork-join framework
   - work stealing
     - task queue — each thread has a deque for tasks, and pushes subtasks onto the head, LIFO
     - work stealing — when a worker thread is idle, it “steals” a task from the tail of another deque
       - stealing is rare — since large subtasks are at the tail, such stealing is rare
       - stealing is expensive — context switch between threads, even between CPUs if not the same core
       - only steal from adjacent thread to mitigate contention
     - `ForkJoinPool` employing work stealing — efficient for recursive tasks, and event-style tasks (especially `asyncMode` for the latter)
   - use and limitations
     - high volume — Huge numbers of tasks and subtasks may be hosted by a small number of actual threads in a `ForkJoinPool`. The pool attempts to maintain enough active (or available) threads by dynamically adding, suspending, or resuming internal worker threads, even if some tasks are stalled waiting to join others
     - no side effect — main use as computational tasks calculating pure functions or operating on purely isolated objects
     - avoid `synchronized` methods or blocks — should minimize other blocking synchronization apart from joining other tasks or using synchronizers such as Phasers. Subdividable tasks should also not perform blocking I/O, and should ideally access variables that are completely independent of those accessed by other running tasks
     - define and use `ForkJoinTasks` that may block — three further considerations
       - independent — completion of few other tasks should be dependent on a task that blocks on external synchronization or I/O
       - small blocking tasks — to minimize resource impact, tasks should be small; ideally performing only the (possibly) blocking action
       - ensure progress — ensure the number of possibly blocked tasks fewer than `ForkJoinPool.getParallelism()`, or use `ForkJoinPool.ManagedBlocker`
     - loosely enforced guideline — by not permitting checked exceptions such as `IOException` to be thrown
     - like a call (fork) and return (join) from a parallel recursive function — `a.fork(); b.fork(); b.join(); a.join();` is likely to be substantially more efficient than `a.join(); b.join()`
     - task size rule of thumb — a task should perform more than 100 and less than 10000 basic computational steps
   - dependency
     - who fork who join — parent thread must join all its forks
     - unordered join — forks from the same parent thread can be joined in arbitrary order
     - join all before being joined — a thread can be joined only when all its forks joined

1. `java.util.concurrent.ForkJoinTask` — tasks that run within a `ForkJoinPool`, a thread-like entity but much lighter, lightweight form of `Future`
   ```java
   public abstract class ForkJoinTask<V> extends Object
   implements Future<V>, Serializable
   ```
   - constructors (adaptors)
     - `static <T> ForkJoinTask<T> adapt(Callable<? extends T> callable)`
     - `static ForkJoinTask<?> adapt(Runnable runnable)`
     - `static <T> ForkJoinTask<T> adapt(Runnable runnable, T result)`
   - exceptions — may still encounter unchecked exceptions, which are rethrown to callers join them
     - `java.util.concurrent.RejectedExecutionException` — internal resource exhaustion
   - awaiting completion and extracting results
     - `ForkJoinTask<V> fork()` — Arranges to asynchronously execute this task in the pool the current task is running in, if applicable, or using the `ForkJoinPool.commonPool()` if not `inForkJoinPool()`.
     - `V join()` — Returns the result of the computation when it is done
     - inherited `Future::get`, but throws checked exception
     - `V invoke()` — semantically equivalent to `fork(); join()` but always attempts to begin execution in the current thread
     - `invokeAll`
       - `static <T extends ForkJoinTask<?>> Collection<T> invokeAll(Collection<T> tasks)` — forking a set of tasks and joining them all
       - `static void invokeAll(ForkJoinTask<?>... tasks)`
       - `static void invokeAll(ForkJoinTask<?> t1, ForkJoinTask<?> t2)`
     - quietly — do not extract results or report exceptions, useful when expecting delayed processing of results or exceptions until all complete
       - `void quietlyComplete()`
       - `void quietlyInvoke()`
       - `void quietlyJoin()`
   - execution status
     - `boolean isCancelled()` — in which case `getException()` returns a `CancellationException`
     - `boolean isCompletedAbnormally()`
     - `boolean isCompletedNormally()`
     - `boolean isDone()` — normally, abnormally or cancelled
   - manage circular dependency
     - `void complete(V value)`  
       `void completeExceptionally(Throwable ex)`
     - `static void helpQuiesce()` — Possibly executes tasks until the pool hosting the current task is quiescent.
   - extending — extend one of the abstract classes that support a particular style of fork/join processing, defines a `compute` method that somehow uses the control methods supplied by this base class
     - tags — for use of specialized subclasses
     - base `final` support methods — should minimally implement protected methods
     - `java.util.concurrent.RecursiveAction` — A recursive resultless `ForkJoinTask`
       ```java
       public abstract class RecursiveAction extends ForkJoinTask<Void>
       ```
     - `java.util.concurrent.RecursiveTask` — A recursive result-bearing `ForkJoinTask`
       ```java
       public abstract class RecursiveTask<V> extends ForkJoinTask<V>
       ```
     - `java.util.concurrent.CountedCompleter` — completed actions trigger other actions
       ```java
       public abstract class CountedCompleter<T> extends ForkJoinTask<T>
       ```
       - tbd

1. `java.util.concurrent.ForkJoinPool` — provides the entry point for submissions from non-`ForkJoinTask` clients, as well as management and monitoring operations
   ```java
   public class ForkJoinPool extends AbstractExecutorService
   ```
   - `static ForkJoinPool commonPool()` — used by any `ForkJoinTask` that is not explicitly submitted to a specified pool, threads are slowly reclaimed during periods of non-use, and reinstated upon subsequent use
   - `static void managedBlock(ForkJoinPool.ManagedBlocker blocker)`
   - `ForkJoinPool.ManagedBlocker`
     ```java
     public static interface ManagedBlocker {
         boolean block() throws InterruptedException;
         boolean isReleasable();
     }
     ```

## Synchronizers

1. Memory consistency effects — happen-before, see [volatile](#volatile-and-atomics)

1. `AbstractQueuedSynchronizer::compareAndSetState` — uses `VarHandle::compareAndSet`
   <!-- TODO -->
   - CLH lock queue — the thread appends itself to the waiting queue and spins on the variable that can be updated only by the thread preceding it in the queue
     - Java uses CLH locks for blocking synchronizers, but with the same tactic, see javadoc for `AbstractQueuedSynchronizer.Node`
   - `java.util.concurrent.locks.LockSupport` — basic thread blocking primitives for creating locks and other synchronization classes
     - underlying — `jdk.internal.misc.Unsafe::park`, `Unsafe::unpark`
     - `static void park(Object blocker)` — park current thread, wrapped by set and unset `Thread.parkBlocker`
     - `static void unpark(Thread thread)`

### Count Synchronizers

1. `java.util.concurrent.Semaphore` — Allows a set of threads to wait until permits are available for proceeding, often used to restrict the number of threads than can access some (physical or logical) resource
   ```java
   public class Semaphore implements Serializable
   ```
   - use
     - permit — a count, can be acquired or released, by any caller
     - binary semaphore — mutex lock, but without ownership
     - multiple permits methods — increased risk of indefinite postponement when used without fairness
     - fairness — FIFO by the order of executing of specific internal points in `acquire` methods
   - constructors
     - `Semaphore(int permits)`
     - `Semaphore(int permits, boolean fair)`
   - release — Releases a permit, returning it to the semaphore
     - `void release()`
     - `void release(int permits)`
   - acquire — Acquires a permit from this semaphore, blocking until one is available, or the thread is interrupted
     - `void acquire()`
     - `void acquire(int permits)`
     - `boolean tryAcquire()` — return immediately, regardless of fairness
     - `boolean tryAcquire(int permits)`
     - `boolean tryAcquire(int permits, long timeout, TimeUnit unit)`
     - `boolean tryAcquire(long timeout, TimeUnit unit)`
   - underlying implementation — `AbstractQueuedSynchronizer::compareAndSetState`

1. `java.util.concurrent.CountDownLatch` — Allows a set of threads to wait until a count has been decremented to 0, and the count cannot be increased
   - constructor — `CountDownLatch(int count)`
   - `void await()` — Causes the current thread to wait until the latch has counted down to zero and return immediately upon subsequent call, unless the thread is interrupted  
     `boolean await(long timeout, TimeUnit unit)`
   - `void countDown()` — decrements the count of the latch, releasing all waiting threads if the count reaches zero
   - `long getCount()`
   - underlying implementation — `AbstractQueuedSynchronizer::compareAndSetState`

1. `java.util.concurrent.CyclicBarrier` — Allows a set of threads to wait until a predefined count of them has reached a common barrier, and then optionally executes a barrier action, and the count is reset
   - all-or-none — If a thread leaves a barrier point prematurely and exceptionally, all other threads waiting at that barrier point will also leave abnormally via `BrokenBarrierException` (or `InterruptedException` if they too were interrupted at about the same time)
   - constructors
     - `CyclicBarrier(int parties)`
     - `CyclicBarrier(int parties, Runnable barrierAction)`
   - `int await()` — Waits until all parties have invoked `await` on this barrier, returns the arrival index of that thread at the barrier  
     `int await(long timeout, TimeUnit unit)`
   - `int getNumberWaiting()`
   - `int getParties()` — the number of parties required to trip this barrier
   - `boolean isBroken()` — Queries if this barrier is in a broken state
   - `void reset()`
   - underlying implementation — `ReentrantLock`

1. `java.util.concurrent.Phaser` — Like a cyclic barrier, but with a mutable party count, and can have multiple phases with phase number cycling from 0 to `Integer.MAX_VALUE`
   - constructors
     - `Phaser()` — 0 parties, phase number 0
     - `Phaser(int parties)`
     - `Phaser(Phaser parent)`
     - `Phaser(Phaser parent, int parties)`
   - registration — change number of parties
     - `int register()` — Adds a new unarrived party to this phaser
     - `int bulkRegister(int parties)` — Adds the given number of new unarrived parties to this phaser
   - tree tiering — children automatically register with and deregister from their parents according to the their numbers of registered parties
     - `Phaser getParent()` — Returns the parent of this phaser, or null if none
     - `Phaser getRoot()` — Returns the root ancestor of this phaser, which is the same as this phaser if it has no parent
   - arrive — When the final party for a given phase arrives, an optional `onAdvance` is performed and the phase advances (phase number +1)
     - `int arrive()` — Arrives at this phaser, without waiting for others to arrive
     - `int arriveAndAwaitAdvance()` — Arrives at this phaser and awaits others
     - `int arriveAndDeregister()` — Arrives at this phaser and deregisters from it without waiting for others to arrive
   - await — wait at a specific phase, returns when the phaser advances to (or is already at) a different phase
     - `int awaitAdvance(int phase)` — Awaits the phase of this phaser to advance from the given phase value, returning immediately if the current phase is not equal to the given phase value or this phaser is terminated
     - `int awaitAdvanceInterruptibly(int phase)`
     - `int awaitAdvanceInterruptibly(int phase, long timeout, TimeUnit unit)`
   - termination — triggered when `onAdvance` returns `true`. Upon termination, all synchronization methods immediately return a negative integer and registration takes no effect
     - `void forceTermination()` — Forces this phaser to enter termination state
     - `boolean isTerminated()` — Returns true if this phaser has been terminated
   - monitoring
     - `int getArrivedParties()` — Returns the number of registered parties that have arrived at the current phase of this phaser
     - `int getPhase()` — Returns the current phase number
     - `int getRegisteredParties()` — Returns the number of parties registered at this phaser
     - `int getUnarrivedParties()` — Returns the number of registered parties that have not yet arrived at the current phase of this phaser
   - `protected boolean onAdvance(int phase, int registeredParties)` — Overridable method to perform an action upon impending phase advance, and to control termination
     ```java
     return registeredParties == 0; // default implementation
     ```
   - underlying implementation — `VarHandle::compareAndSetState`

### Data Exchange Synchronizers

1. `java.util.concurrent.Exchanger` — Allows two threads to exchange objects when both are ready for the exchange, a bidirectional form of a `SynchronousQueue`
   ```java
   public class Exchanger<V> extends Object
   ```
   - `V exchange(V x)` — Waits for another thread to arrive at this exchange point (unless the current thread is interrupted), and then transfers the given object to it, receiving its object in return
   - `V exchange(V x, long timeout, TimeUnit unit)`

1. `java.util.concurrent.SynchronousQueue` — a mechanism that pairs up producer and consumer threads, a blocking queue in which each insert operation must wait for a corresponding remove operation by another thread, and vice versa
   ```java
   public class SynchronousQueue<E>
   extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```
   - empty queue — no internal capacity
   - non-null
   - constructors
     - `SynchronousQueue()` — LIFO for non-fair mode
     - `SynchronousQueue(boolean fair)` — FIFO for fairness, performance is similar for this collection
   - `E poll()` — 0 timeout
   - other inherited methods
