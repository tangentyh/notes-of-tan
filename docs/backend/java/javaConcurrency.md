# Java Concurrency

## Concurrency Concepts

### Concurrency and Parallelism

1. concurrency vs parallelism
   - concurrency — multitask at once, possible even for one core/thread; nondeterministic
   - parallelism — multiple execution at once; deterministic
     - hyperthread — surplus thread of a core, squeeze pipeline bubbles (idle cycles)
     - [Amdahl's law - Wikipedia](https://en.wikipedia.org/wiki/Amdahl%27s_law) — theoretical speedup when using multiple processors is determined by the portion cannot be parallelized

1. parallel architecture
   - bit level — 8 bit, 16 bit, 32 bit, to 64 bit
   - instruction level — pipelining, out-of-order execution, and speculative execution
   - data level — single instruction, multiple data, (aka. SIMD) like image processing of modern GPUs
   - task level — shared-memory or distributed-memory

### Concurrency Models

1. threads and locks
   - mutex and memory visibility
   - fork join and work-stealing
   - problems
     - deadlock — see [OS notes](../OS-notes.md#dead-lock)
       - careful of alien method — when alien method call while holding a lock, it may require other locks, possible for deadlock; use techniques like copy on write to alleviate
     - livelock — `tryLock` of threads timeout simultaneously and then contention
     - thread pool problem — blocking makes a thread unavailable; can be solved by event-driven programming, which however breaks the nature control flow and may introduce excessive global states

1. functional programming
   - imperative programming — problems with shared mutable state
     - hidden state — `java.text.SimpleDateFormat`
     - escaped state
       ```java
       public class Tournament {
           private List<Player> players = new LinkedList<Player>();
           public synchronized void addPlayer(Player p) { players.add(p); }
           public synchronized Iterator<Player> getPlayerIterator() {
              return players.iterator(); // escaped state
           }
       }
       ```
   - functional programming — from shared mutable state to shared immutable state
     - first-class — can be manipulated like any other value
     - pure function — side effect free
   - shared mutable states in Clojure
     - atomics — CAS
       - validators — called whenever an attempt is made to change the value of the atom
       - watchers — called after the value has changed and will only be called once
     - persistent data structure — like copy on write, but space efficient, `PersistentVector` and `PersistentHashMap`; a separation of identity and state
     - `agent` — encapsulates a reference to a single value, value can only be modified by `send` function and arguments, concurrent `send`s are serialized, sent functions are evaluated asynchronously
       ```clojure
       (send my-agent + 2)
       ```
       - `await` function — blocks until all actions dispatched from the current thread to the given agent(s) have completed
       - error handling — by validator and watcher, stop when error and exception persisted, can restart manually or automatically
     - software transactional memory (STM) — ACID without D, retry if conflict, functions should be pure

1. actors — from shared mutable state to unshared mutable state, communicates with each other by exchanging messages
   - [akka](https://akka.io/) — implementation of the Actor Model on the JVM
   - messages — sent asynchronously and queued in a mailbox, processed sequentially
     - poison pill message — tell an actor to stop
     - event messages
       - death watch — register to receive notification message when an actor stopped
       - distributed cluster member events — register to be notified when new members join or existing members leave or fail
     - coupled independent mailboxes — one mailbox for one actor, yet unhandled messages reside in a mailbox and not lost on restart
     - dead letter mailbox — messages sent to actors that have terminated are sent to a virtual dead letter mailbox
   - hierarchical supervision
     - hierarchical — tree-like, can retrieve by path, like `"/user/an-actor/a-child"`, `"/user/an-actor/*"`
     - supervision — parent as supervisor, act when exception in supervised actors
     - action mode — one-for-one or all-for-one
       - one-for-one — only the child that experienced the error is restarted or terminated
       - all-for-one — all of the supervisor’s children are restarted or terminated when a single child experiences an error
     - actions when exception while processing message
       - resume — discards the message and maintains the internal state of the actor
       - restart — discards the message and restart the actor, resetting the internal state
         - factory — `actorOf()` in akka takes an actor factory, new instances can be created on demand
         - reference — `actorOf()` and `actorFor()` in akka return a reference, the same actor reference can be used even if restarted
       - terminate — terminates the actor, further messages in the actor’s mailbox will not be processed
       - escalate — escalate the decision to the supervisor’s supervisor, the supervisor itself may be restarted or terminated
     - lifecycle hooks — `preStart`, `preRestart`, `postRestart`, `postStop`
   - error kernel pattern — the part that must be correct if the system is to function correctly, should be small and simple
     - error kernel and actor — an actor's error kernel are its top-level actors, an actor system forms an error kernel hierarchy where risky operations are pushed down to the lower-level actors
   - let it crash
     - defensive programming — try to anticipate possible bugs, `null` guard for example, but any code triggers the `null` guard may have bugs itself which remains to be a threat
     - let it crash — allowing the fault tolerance mechanisms to handle defensive programming
     - let it crash and actor
       - simpler code
       - failure of an actor is logged, and no failure cascade due to state isolation
       - recovery by error kernel

1. communicating sequential processes
   - channels
     - first class — instead of each process being tightly coupled to a single mailbox as in actor, channels can be independently created, written to, read from, and passed between processes
     - transfer queue like
     - channels with buffer — bounded blocking queue like
       - strategy when full — block, drop, sliding window
       - no unbounded buffer —
         >whenever you have an “inexhaustible” resource, sooner or later you will exhaust it
     - sequence like — `map`, `filter` and so on
     - other
       - many to many channel — read/write multiple channels for one go block
       - timeout channel — channels auto close after a timeout
   - go block — event-driven but with nature control flow, by transparently rewriting sequential code into event-driven code under the hood
     - state machines can park — go blocks translated to state machines, which can relinquish control of the thread by parking instead of blocking
     - park — when park instead of block, the thread the go block is running on can be used by another go block
     - inversion of control — framework multiplex many go blocks over a limited thread pool

1. lambda architecture
   ```
   raw data -> batch layer -> batch views -> serving layer
      ↑                                       ↑
   new data -> speed layer -> realtime views -┘
   ```
   - raw data in contrast to derived data
     - raw data — immutable
     - example: Wikipedia page — edits are the raw data from which pages are derived
     - example: bank account — balance of a bank account is derived from a sequence of raw debits and credits
   - batch layer — running indefinitely to create batch views, can be implemented by MapReduce
     - MapReduce
       - map — input to key-value pairs
       - reduce — values for each key reduced, the same key handled by the same reducer
     - incremental batch layer — update batch views incrementally instead of recomputing; can be useful, but can never be a replacement for recomputation
   - batch view — contains the derived data that will be returned by queries or contains data that can easily be combined to create it
   - serving layer — for storing, indexing and querying batch views
   - speed layer
     - batch layer latency problem — batch layer takes time to update batch view
     - speed layer — generates real-time views from new data, which is appended to raw data simultaneously
     - real-time views — combined with batch views to create fully up-to-date answers to queries
     - example — Apache Storm

1. other concurrency models
   - general purpose GPU programming — OpenCL, CUDA
   - dataflow — for example, futures and promises, VHDL and Verilog
   - reactive programing — automatically react to the propagation of changes, see [http://reactivex.io/intro.html](http://reactivex.io/intro.html)

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
     - OS dependent — Windows has seven priority levels, thread priorities are ignored on Linux by default
     - unrecommended — few scenarios there to ever tweak priorities. If you have several threads with a high priority that don’t become inactive, the lower-priority threads may never execute
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
     - handler defaults — default handler (`static` `Thread::setDefaultUncaughtExceptionHandler`) defaults to `null`, individual handler (`Thread::setUncaughtExceptionHandler`) defaults to `ThreadGroup`
   - `ThreadGroup` — represents a set of threads. In addition, a thread group can also include other thread groups
     ```java
     public class ThreadGroup implements Thread.UncaughtExceptionHandler
     ```
     - unrecommended — use alternatives instead
     - share some APIs of `Thread`
     - action orders of `ThreadGroup::uncaughtException` when an uncaught exception
       1. the `uncaughtException` method of the parent thread group
       1. otherwise, default handler if non-`null`
       1. otherwise, nothing happens if the `Throwable` is an instance of `ThreadDeath`
       1. otherwise, print the name of the thread and the stack trace to `System.err`
   - `ThreadLocal`, `ThreadLocalRandom` — thread-local variables, see below
     ```java
     public static final ThreadLocal<SimpleDateFormat> dateFormat =
         ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
     ```
     - motivations — avoid synchronization and blocking and boost performance
       - motivation of the above example — the internal data structures used by `SimpleDateFormat` can be corrupted by concurrent access, and synchronization is expensive
       - motivation of `ThreadLocalRandom` — `Random` is thread safe using `AtomicLong::compareAndSet`, but inefficient if multiple threads need to wait for a single shared generator

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
   public class Thread implements Runnable
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
   - `BLOCKED` — intrinsic object lock, a thread that is blocked waiting for a monitor lock is in this state
   - `WAITING` — after `Object::wait`, `Thread::join`, or by `Lock` or `Condition`, a thread that is waiting indefinitely for another thread to perform a particular action is in this state.
   - `TIMED_WAITING` — after `Thread::sleep`, or methods for `WAITING` with a time parameter, a thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
   - `TERMINATED` — A thread that has exited is in this state.

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
   - `ThreadLocal.ThreadLocalMap`, referenced by `Thread.threadLocals` instance field — hash table with closed hashing
     - entry — `WeakReference<ThreadLocal<?>>` as key, whose hash value managed by a static `AtomicInteger`, which `getAndAdd` for every `ThreadLocal` instance
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
   - `wait` should always be used in a loop — interrupts and spurious wakeups are possible, also another thread may acquire the associated lock and make the condition false again before the awakened thread scheduled
   - spurious wakeup — a thread can wake up without being notified, interrupted, or timing out, (due to `pthread` limitations??)
   - lost wakeup — before one thread `wait`, another thread modified the condition and notified, but the `notify` does nothing because the target thread yet to `wait`
     - prevention in Java — `IllegalMonitorStateException` if `await` or `notify` without the lock acquired

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
   - equivalent conditions in `Object` — see [Inheritance](./javaBasics.md#Inheritance) for other `Object` APIs
     - `void notify()`
     - `void notifyAll()`
     - `void wait()`
     - `void wait(long timeout)`
     - `void wait(long timeout, int nanos)`
   - monitor — intrinsic lock is the loose adaption of the monitor concept, see [Monitor (synchronization) - Wikipedia](https://en.wikipedia.org/wiki/Monitor_(synchronization))
   - JVM optimization — see [zhihu](https://zhuanlan.zhihu.com/p/75880892), [CS-Notes](https://github.com/CyC2018/CS-Notes/blob/master/notes/Java%20%E5%B9%B6%E5%8F%91.md#%E5%8D%81%E4%BA%8C%E9%94%81%E4%BC%98%E5%8C%96)
     - 锁膨胀 — unlocked, biased, lightweight, inflated
     - 锁消除, 锁粗化, 自适应自旋锁

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
   - underlying implementation — `AbstractQueuedSynchronizer`

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
     - performance — the read-write lock implementation (which is inherently more complex than a mutual exclusion lock) can dominate the execution cost if the read operations are too short
   - underlying implementation — `AbstractQueuedSynchronizer`

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
   - solution to above problems
     - memory barrier, membar, memory fence or fence instruction — a type of barrier instruction that causes a CPU or compiler to enforce an ordering constraint on memory operations issued before and after the barrier instruction. This typically means that operations issued prior to the barrier are guaranteed to be performed before operations issued after the barrier
     - barrier — a barrier for a group of threads or processes in the source code means any thread/process must stop at this point and cannot proceed until all other threads/processes reach this barrier
   - ensure changes visible — compiler will insert the appropriate code to ensure that a change to the a variable in one thread is visible from any other thread that reads the variable
     - [happen-before order](https://docs.oracle.com/javase/specs/jls/se11/html/jls-17.html#jls-17.4.5) — a write to a volatile field is visible to and ordered before every subsequent read of that field
   - atomicity — volatile variables do not provide any atomicity, but makes read and write to `long` and `double` atomic
     - [JLS 17.7. Non-Atomic Treatment of double and long](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.7)  
       > For the purposes of the Java programming language memory model, a single write to a non-volatile `long` or `double` value is treated as two separate writes: one to each 32-bit half. This can result in a situation where a thread sees the first 32 bits of a 64-bit value from one write, and the second 32 bits from another write.
   - also `synchronized` — changes visible before a variable is unlocked; invalidate processor cache when acquiring, flush cache before releasing

1. `java.util.concurrent.atomic` package — use efficient machine-level instructions to guarantee atomicity without using locks
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
     - problem with CAS — under high contention, performance suffers because the optimistic updates require too many retries
     - limit — the computation must be associative and commutative
     - `identity` in parameters — initial value, also used when `accumulate()`

1. classes in `java.util.concurrent.atomic`
   - `java.util.concurrent.atomic.AtomicBoolean`
   - `java.util.concurrent.atomic.AtomicIntegerArray`
   - `java.util.concurrent.atomic.AtomicIntegerFieldUpdater<T>` — a reflection-based utility that enables atomic updates to designated `volatile int` fields of designated classes
   - `java.util.concurrent.atomic.AtomicLongArray`
   - `java.util.concurrent.atomic.AtomicLongFieldUpdater<T>`
   - `java.util.concurrent.atomic.AtomicMarkableReference<V>` — maintains markable references by creating internal objects representing "boxed" [reference, boolean] pairs
   - `java.util.concurrent.atomic.AtomicReference<V>`
   - `java.util.concurrent.atomic.AtomicReferenceArray<E>`
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
   - non-null — parameter validated, typically with `Objects::requireNonNull`
   - implementation — `ReentrantLock` with `Condition`, except `SynchronousQueue`, `LinkedTransferQueue`

1. `java.util.concurrent.BlockingQueue`
   ```java
   public interface BlockingQueue<E> extends Queue<E>
   ```
   - `boolean add(E e)` — usually `AbstractQueue::add`, no lock and `IllegalStateException` if full
   - blocking
     - `E put(E e) throws InterruptedException`
     - `E take() throws InterruptedException`
   - timeout
     - `boolean offer(E e, long timeout, TimeUnit unit) throws InterruptedException`
     - `E poll(long timeout, TimeUnit unit) throws InterruptedException`
   - return special value
     - `boolean offer(E e)` — possible to return `false` if full after lock acquired
     - `E poll()` — possible to return `null` if empty after lock acquired

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
   - comparison in backing priority queue — generally `Long::compare` with `Delayed::getDelay`
   - implementation — block by remaining delay like in `take()` implemented by `Condition::awaitNanos` with `Delay::getDelay` as argument
   - `java.util.concurrent.Delay`
     ```java
     public interface Delayed extends Comparable<Delayed> {
         long getDelay(TimeUnit unit); // remaining delay
     }
     ```
     - consistency between `compareTo`, `getDelay` and `equals` — a `compareTo` method needs to provide an ordering consistent with its `getDelay` method, which violates the consistency between `compareTo` and `equals`

1. `java.util.concurrent.SynchronousQueue` — a mechanism that pairs up producer and consumer threads, a blocking queue in which each insert operation must wait for a corresponding remove operation by another thread, and vice versa
   ```java
   public class SynchronousQueue<E> extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```
   - empty queue — no internal capacity, cannot `peek()`, etc.
   - constructors — similar performance, but FIFO usually supports higher throughput under contention and LIFO maintains higher thread locality in common applications
     - `SynchronousQueue()` — LIFO for non-fair mode
     - `SynchronousQueue(boolean fair)` — FIFO for fairness, performance is similar for this collection
   - implementation — dual queue with `LockSupport`, `VarHandle::compareAndSet`, see javadoc in source code
   - other similar synchronizers — `LinkedTransferQueue`, `Exchanger`

1. `java.util.concurrent.LinkedTransferQueue` — unbounded `TransferQueue` backed by dual queues of slack (refer to javadoc in source code) based on linked nodes
   ```java
   public class LinkedTransferQueue<E> extends AbstractQueue<E>
   implements TransferQueue<E>, Serializable
   ```
   - `java.util.concurrent.TransferQueue` — a `BlockingQueue` in which producers may wait for consumers to receive elements
     ```java
     public interface TransferQueue<E> extends BlockingQueue<E>
     ```
     - `void transfer(E e)` — transfers the specified element immediately if there exists a consumer already waiting, else waits until the element is received by a consumer
     - `boolean tryTransfer(E e)`
     - `boolean tryTransfer(E e, long timeout, TimeUnit unit)`
   - inaccurate `size()` — `size()` is O(n) and maybe inaccurate, due to non-data nodes and concurrency
   - atomicity for bulk operations — bulk operations `addAll`, `removeAll`, `retainAll`, `containsAll`, `equals`, and `toArray` are not guaranteed to be performed atomically
   - implementation — dual queues with slack, see javadoc in source code
   - comparison with `SynchronousQueue` — `LinkedTransferQueue` is more fast??, and
     > Capability-wise, `LinkedTransferQueue` is actually a superset of `ConcurrentLinkedQueue`, `SynchronousQueue` (in “fair” mode), and unbounded `LinkedBlockingQueue`.  
     > —— Doug Lea

1. [Disruptor](https://lmax-exchange.github.io/disruptor/) — ring buffer, lock free, tbd
   - [GitHub](https://github.com/LMAX-Exchange/disruptor)

### Concurrent Collections

1. concurrent collections
   - generally non-blocking algorithm
   - some are non-null
   - inaccurate `size()` — `size()` is O(n) and maybe inaccurate, due to non-data nodes and concurrency
   - no guaranteed atomicity for bulk operations — bulk operations `addAll`, `removeAll`, `retainAll`, `containsAll`, `equals`, and `toArray` are not guaranteed to be performed atomically
   - iterators are weakly consistent — may or may not reflect all modifications after construction, but will not return a value twice

1. `java.util.concurrent.ConcurrentLinkedQueue`
   ```java
   public class ConcurrentLinkedQueue<E> extends AbstractQueue<E>
   implements Queue<E>, Serializable
   ```
   - [Simple, Fast, and Practical Non-Blocking and Blocking Concurrent Queue Algorithms](http://www.cs.rochester.edu/~scott/papers/1996_PODC_queues.pdf)
   - implementation — `VarHandle::compareAndSet`

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
   - implementation — `VarHandle::compareAndSet`

1. `java.util.concurrent.ConcurrentHashMap`
   ```java
   public class ConcurrentHashMap<K,V> extends AbstractMap<K,V>
   implements ConcurrentMap<K,V>, Serializable
   ```
   - fully interoperable with `Hashtable`
   - `concurrencyLevel` — the estimated number of concurrently updating threads, defaults to 16, other write threads will be blocked if the number exceeded
   - `long mappingCount()` — used in lieu of `size()` for `long`; an estimate, the actual count may differ if there are concurrent insertions or removals
   - atomicity
     - non-null key and value — `null` is for absent
     - put — `synchronized` on the old node, CAS if `null`
     - replace — `synchronized` on the old node
     - lambda — `synchronized` on the old node, compute lambda, set computed value, then exit; if `null`, CAS put a dummy node and `synchronized` on the dummy node
     - use `ConcurrentHashMap<String, LongAdder>` with `putIfAbsent`
       ```java
       map.putIfAbsent(word, new LongAdder()).increment();
       map.computeIfAbsent(word, k -> new LongAdder()).increment(); // better
       ```
   - `parallelismThreshold` parameter of bulk operations — if the map contains more elements than the threshold, the bulk operation is parallelized, fully utilize the `ForkJoinPool.commonPool()` if set to 1
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

1. `java.util.concurrent.CopyOnWriteArrayList` — all mutative operations (add, set, and so on) are implemented by making a fresh copy of the underlying array, `synchronized` on a private field
   ```java
   public class CopyOnWriteArrayList<E> extends Object
   implements List<E>, RandomAccess, Cloneable, Serializable
   ```
   - tradeoff — efficient when traversal operations vastly outnumber mutations, and is useful when you cannot or don't want to synchronize traversals
     - comparison to synchronized view — when frequent mutation is needed, synchronized view of `ArrayList` can outperform a `CopyOnWriteArrayList`
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
   - `Executors::callable` — methods for converting to `Callable`

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
   - Spring extensions — `org.springframework.util.concurrent.ListenableFuture<T>`

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

1. `interface java.util.concurrent.Executor` — decoupling task submission from the mechanics of how each task will be run
   - `void execute(Runnable command)`
   - Spring encapsulation — `org.springframework.core.task.TaskExecutor`
     ```java
     @FunctionalInterface
     public interface TaskExecutor extends Executor
     ```

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
   ```java
   public interface CompletionService<V>
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
   - creation
     - `Executors` — returned by `Executors::newCachedThreadPool`, `Executors::newFixedThreadPool`, `Executors::newSingleThreadExecutor`
     - constructor parameters
       - `int corePoolSize` — the number of threads to keep in the pool, even if they are idle, unless `ThreadPoolExecutor::allowCoreThreadTimeOut` with `true`
       - `int maximumPoolSize`
       - `long keepAliveTime`, `TimeUnit unit` — the maximum time that excess idle threads will wait for new tasks before terminating
       - `BlockingQueue<Runnable> workQueue` — the queue to queue tasks if no idle core thread
       - `ThreadFactory threadFactory` — optional, defaults to `Executors::defaultThreadFactory`
       - `RejectedExecutionHandler` — optional, defaults to `AbortPolicy`
   - `RejectedExecutionHandler` — reject policies when task queue overflow, as static inner classes, defaults to `AbortPolicy`
     - `ThreadPoolExecutor.AbortPolicy` — throw `RejectedExecutionException`
     - `ThreadPoolExecutor.CallerRunsPolicy`
     - `ThreadPoolExecutor.DiscardOldestPolicy`
     - `ThreadPoolExecutor.DiscardPolicy`
   - Spring extension — `org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor`, defaults to `LinkedBlockingQueue` and can `setQueueCapacity`, and more
   - more

1. `java.util.concurrent.ScheduledThreadPoolExecutor` — `ThreadPoolExecutor` that can additionally schedule commands to run after a given delay, or to execute periodically, preferable to `java.util.Timer`
   ```java
   public class ScheduledThreadPoolExecutor extends ThreadPoolExecutor
   implements ScheduledExecutorService
   ```
   - creation
     - `Executors` — returned by `Executors::newScheduledThreadPool`, `Executors::newSingleThreadScheduledExecutor`
     - inherited constructors, also constructors with more optional parameters
       ```java
       public ScheduledThreadPoolExecutor(int corePoolSize) {
           super(corePoolSize, Integer.MAX_VALUE,
                 DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS, // 10 ms
                 new DelayedWorkQueue()); // inner static class, like DelayQueue,
                 // but element type is an inner class called ScheduledFutureTask
                 // and every ScheduledFutureTask also records its index in the
                 // backing array to speed up cancellation and removal
       }
       ```

1. `java.util.concurrent.ForkJoinPool` — see [Fork-Join](#fork-join)

1. `java.util.concurrent.Executors` — factory and utility methods
   - thread pools — note that underlying queue size is unbounded
     - `static ExecutorService newCachedThreadPool()` — new threads are created as needed; idle threads are kept for 60 seconds, queue is `SynchronousQueue`  
       `static ExecutorService newCachedThreadPool(ThreadFactory threadFactory)`
     - `static ExecutorService newFixedThreadPool(int nThreads)` — contains a fixed set of threads; tasks kept in a `LinkedBlockingQueue` when overloaded
       `static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory)`
     - `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize)` — fixed-thread pool for scheduled execution; a replacement for `java.util.Timer`  
       `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize, ThreadFactory threadFactory)`
     - `static ExecutorService newSingleThreadExecutor()` — a “pool” with a single thread that executes the submitted tasks sequentially, queue is `LinkedBlockingQueue`  
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
     - `ForkJoinPool` exploits work stealing — efficient for recursive tasks, and event-style tasks (especially `asyncMode` for the latter)
   - use and limitations
     - suitable for high volume — huge numbers of tasks and subtasks may be hosted by a small number of actual threads in a `ForkJoinPool`. The pool attempts to maintain enough active (or available) threads by dynamically adding, suspending, or resuming internal worker threads, even if some tasks are stalled waiting to join others
     - no side effect — main use as computational tasks calculating pure functions or operating on purely isolated objects
     - avoid `synchronized` methods or blocks — should minimize other blocking synchronization apart from joining other tasks or using synchronizers. Subdividable tasks should also not perform blocking I/O, and should ideally access variables that are completely independent of those accessed by other running tasks
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
     - `void complete(V value)`  
       `void completeExceptionally(Throwable ex)`
     - `static void helpQuiesce()` — Possibly executes tasks until the pool hosting the current task is quiescent.
   - extending — extend one of the abstract classes that support a particular style of fork/join processing, defines a `compute` method that somehow uses the control methods supplied by this base class
     - tags — for use of specialized subclasses
     - base `final` support methods — should minimally implement protected methods
     - `java.util.concurrent.RecursiveAction` — a recursive no return value `ForkJoinTask`
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

1. `java.util.concurrent.ForkJoinPool` — provides the entry point for submissions from non-`ForkJoinTask` clients, as well as management and monitoring operations, queue is a internal class based on array
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

1. memory consistency effects — happen-before, see [volatile](#volatile-and-atomics)

1. `java.util.concurrent.locks.AbstractQueuedSynchronizer` — tbd
   <!-- TODO -->
   - `AbstractQueuedSynchronizer::compareAndSetState` — uses `VarHandle::compareAndSet`
   - CLH lock queue — the thread appends itself to the waiting queue and spins on the variable that can be updated only by the thread preceding it in the queue
     - Java uses CLH locks for blocking synchronizers, see javadoc of `AbstractQueuedSynchronizer.Node`

1. `java.util.concurrent.locks.LockSupport` — basic thread blocking primitives for creating locks and other synchronization classes
   - underlying — `jdk.internal.misc.Unsafe::park`, `Unsafe::unpark`
   - `static void park(Object blocker)` — park current thread, wrapped by set and unset `Thread.parkBlocker`
   - `static void unpark(Thread thread)`

1. `java.util.concurrent.Exchanger` — allows two threads to exchange objects when both are ready for the exchange, a bidirectional form of a `SynchronousQueue`
   ```java
   public class Exchanger<V>
   ```
   - `V exchange(V x)` — waits for another thread to arrive at this exchange point (unless the current thread is interrupted), and then transfers the given object to it, receiving its object in return
   - `V exchange(V x, long timeout, TimeUnit unit)`
   - underlying implementation — `VarHandle::compareAndSetState`, `LockSupport`, see javadoc in source code for dual data structures

### Count Synchronizers

1. `java.util.concurrent.Semaphore` — allows a set of threads to wait until permits are available for proceeding, often used to restrict the number of threads than can access some (physical or logical) resource
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
   - underlying implementation — `AbstractQueuedSynchronizer`

1. `java.util.concurrent.CountDownLatch` — allows a set of threads to wait until a count has been decremented to 0, and the count cannot be increased
   - constructor — `CountDownLatch(int count)`
   - `void await()` — causes the current thread to wait until the latch has counted down to zero and return immediately upon subsequent call, unless the thread is interrupted  
     `boolean await(long timeout, TimeUnit unit)`
   - `void countDown()` — decrements the count of the latch, releasing all waiting threads if the count reaches zero
   - `long getCount()`
   - underlying implementation — `AbstractQueuedSynchronizer`

1. `java.util.concurrent.CyclicBarrier` — allows a set of threads to wait until a predefined count of them has reached a common barrier, and then optionally executes a barrier action, and the count is reset
   - all-or-none — if a thread leaves a barrier point prematurely and exceptionally, all other threads waiting at that barrier point will also leave abnormally via `BrokenBarrierException` (or `InterruptedException` if they too were interrupted at about the same time)
   - constructors
     - `CyclicBarrier(int parties)`
     - `CyclicBarrier(int parties, Runnable barrierAction)`
   - `int await()` — waits until all parties have invoked `await` on this barrier, returns the arrival index of that thread at the barrier  
     `int await(long timeout, TimeUnit unit)`
   - `int getNumberWaiting()`
   - `int getParties()` — the number of parties required to trip this barrier
   - `boolean isBroken()` — Queries if this barrier is in a broken state
   - `void reset()`
   - underlying implementation — `ReentrantLock`

1. `java.util.concurrent.Phaser` — like a cyclic barrier, but faster??, with a mutable party count, and can have multiple phases with phase number cycling from 0 to `Integer.MAX_VALUE`
   - constructors
     - `Phaser()` — 0 parties, phase number 0
     - `Phaser(int parties)`
     - `Phaser(Phaser parent)`
     - `Phaser(Phaser parent, int parties)`
   - registration — change number of parties
     - `int register()` — adds a new unarrived party to this phaser
     - `int bulkRegister(int parties)` — adds the given number of new unarrived parties to this phaser
   - tree tiering — children automatically register with and deregister from their parents according to the their numbers of registered parties
     - `Phaser getParent()` — returns the parent of this phaser, or `null` if none
     - `Phaser getRoot()` — returns the root ancestor of this phaser, which is the same as this phaser if it has no parent
   - arrive — when the final party for a given phase arrives, an optional `onAdvance` is performed and the phase advances (phase number +1)
     - `int arrive()` — arrives at this phaser, without waiting for others to arrive
     - `int arriveAndAwaitAdvance()` — arrives at this phaser and awaits others
     - `int arriveAndDeregister()` — arrives at this phaser and deregisters from it without waiting for others to arrive
   - await — wait at a specific phase, returns when the phaser advances to (or is already at) a different phase
     - `int awaitAdvance(int phase)` — awaits the phase of this phaser to advance from the given phase value, returning immediately if the current phase is not equal to the given phase value or this phaser is terminated
     - `int awaitAdvanceInterruptibly(int phase)`
     - `int awaitAdvanceInterruptibly(int phase, long timeout, TimeUnit unit)`
   - termination — triggered when `onAdvance` returns `true`; after termination, all synchronization methods immediately return a negative integer and registration takes no effect
     - `void forceTermination()` — forces this phaser to enter termination state
     - `boolean isTerminated()` — returns true if this phaser has been terminated
   - monitoring
     - `int getArrivedParties()` — returns the number of registered parties that have arrived at the current phase of this phaser
     - `int getPhase()` — returns the current phase number
     - `int getRegisteredParties()` — returns the number of parties registered at this phaser
     - `int getUnarrivedParties()` — returns the number of registered parties that have not yet arrived at the current phase of this phaser
   - `protected boolean onAdvance(int phase, int registeredParties)` — overridable method to perform an action upon impending phase advance, and to control termination
     ```java
     return registeredParties == 0; // default implementation
     ```
   - underlying implementation — `VarHandle::compareAndSetState`, `LockSupport`
