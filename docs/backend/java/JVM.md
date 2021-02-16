# JVM

1. JVM in `System`
   - `static void exit(int status)`
   - `static void gc()` — run garbage collector
   - `static Channel inheritedChannel()` — the channel inherited from the entity that created this Java virtual machine
   - `static void load(String filename)`
   - `static void loadLibrary(String libname)`
   - `static String mapLibraryName(String libname)`
   - `static void runFinalization()`
   - `static SecurityManager getSecurityManager()`
   - `static void setSecurityManager(SecurityManager s)`

## Memory

1. threads
   - system threads, besides the main thread
     - VM thread — waits for operations to appear that require the JVM to reach a safe-point where modifications to the heap can not occur; operations are "stop-the-world" garbage collections, thread stack dumps, thread suspension and biased locking revocation
     - period task thread — responsible for timer events (i.e. interrupts) that are used to schedule execution of periodic operations
     - GC thread — literally
     - compiler thread — JIT
     - signal dispatcher thread — receives signals sent to the JVM process and handle them inside the JVM by calling the appropriate JVM methods
   - errors — `StackOverflowError`, `OutOfMemoryError` for frames

1. memory model per thread
   - program counter (PC) — address of the current instruction (or opcode), or undefined if the current method is native, typically incremented after each instruction; pointing at a memory address in the Method Area
   - native stack — for JNI
   - stack — LIFO queue for frames for each method executing on the thread; no direct manipulation except pop and push
     - CLI — `-Xss<size>`, e.g. `-Xss64m`
   - frame — element in stack, fixed size after creation
     - may be allocated in the heap — no direct stack manipulation except pop and push, so frame objects may be allocated in the heap and the memory does not need to be contiguous
     - local variable array — containing `this` if not static, method parameters and local variables (primitive types, reference and return address)
     - return value
     - operand stack — analogous to general purpose registers used in CPU; most JVM byte code spends its time manipulating the operand stack by pushing, popping, duplicating, swapping, or executing operations that produce or consume values, as well as move values between the local variable array and the operand stack
     - reference to runtime constant pool for the class of the current method — references to variables and methods compiled as symbolic references stored in the class's constant pool
       - binding — the process of the field, method or class identified by the symbolic reference being completely replaced by a direct reference

1. memory model shared between threads
   - heap — where objects allocated
     - young generation
       - Eden
       - survivor
     - old (or tenure) generation
     - CLI
       - heap size — `-Xms<size>` for initial value, `-Xmx<size>` for max value
       - new (young) generation size — `-Xmn<size>` (`-XX:NewSize` and `-XX:MaxNewSize`), not needed if `-XX:+UseAdaptiveSizePolicy`
         - `-XX:SurvivorRatio=8` — incompatible with `-XX:+UseAdaptiveSizePolicy`
       - new old generation ratio — `-XX:NewRatio=2`
   - permanent generation (removed since JDK 8), allocated as part of contiguous memory as the Java heap
     - interned strings (string table), can be explicitly interned by `String::intern`, moved to heap since JDK 8
       - CLI — `-XX:+PrintStringTableStatistics`, `-XX:StringTableSize`
     - method area — must be thread-safe
       - class loader reference
       - runtime constant pool — numeric constants - field references - method references - attributes
       - class info
         - field data — name - type - modifiers - attributes
         - method data — name - return type - parameter types (in order) - modifiers - attributes
         - method code
           - bytecodes
           - operand stack size - local variable size - local variable table
           - exception table
             - per exception handler — start point - end point - PC offset for handler code - constant pool index for exception class being caught
   - metaspace, replacement for permanent generation since JDK 8
     - held in native memory and not related to heap — PermGen had a fixed size, but `MaxMetaspaceSize` defaults to infinity, no more `java.lang.OutOfMemoryError: Permgen space` (`OutOfMemoryError` for metaspace is still possible)
     - GC — triggered once the `MaxMetaspaceSize` is reached
     - CLI — `-XX:MetaspaceSize`, `-XX:MaxMetaspaceFreeRatio`, `-XX:MinMetaspaceFreeRatio`, `-XX:MaxMetaspaceSize`
   - code cache — for JIT
     - CLI — `-XX:ReservedCodeCacheSize=128m`, `-XX:InitialCodeCacheSize`
   - `java.nio.MappedByteBuffer` (direct buffer) — use native methods to manipulate non-heap memory, read and write directly to a memory address, used in NIO
     - CLI — `-XX:MaxDirectMemorySize`??

1. native memory tracking (NMT) — non-heap memory tracking
   - docs — [JVM Guide](https://docs.oracle.com/en/java/javase/11/vm/native-memory-tracking.html), [Troubleshooting — Diagnostic Tools](https://docs.oracle.com/en/java/javase/11/troubleshoot/diagnostic-tools.html#GUID-1F53A50E-86FF-491D-A023-8EC4F1D1AC77)
   - CLI
     - enable NMT (5% -10% performance overhead) — `-XX:NativeMemoryTracking=off|summary|detail`
     - print NMT statistics at JVM exit — `-XX:+UnlockDiagnosticVMOptions -XX:+PrintNMTStatistics`
   - make JVM print NMT statistics, with the above option enabled
     ```
     jcmd <pid> VM.native_memory [summary | detail | baseline | summary.diff | detail.diff | shutdown] [scale= KB | MB | GB]
     ```
     - NMT snapshot
       ```shell
       jps -l # list JVM pids
       jcmd <pid> VM.native_memory
       ```
     - NMT over time
       ```shell
       $ jcmd <pid> VM.native_memory baseline
       Baseline succeeded
       # after some time
       $ jcmd <pid> VM.native_memory summary.diff
       ```

1. an object at runtime
   ```
   Java object A          InstanceKlass       Java mirror
   (instanceOopDesc)
    [ _mark  ] 64b                            (java.lang.Class instance)
    [ _klass ] 32b --->  [ ...          ] <-┐               
    [ fields ]           [ _java_mirror ] --┼>  [ _mark   ]
                         [ ...          ]   |   [ _klass  ]
                                            |   [ fields  ]
                                            └-- [ klass   ]
                                                [ A.value ] (static field)
   ```
   - [OpenJDK: jol (Java Object Layout)](http://openjdk.java.net/projects/code-tools/jol/)
     ```java
     class A {
       boolean b;
       Object o1;
     }
     class B extends A {
       int i;
       long l;
       Object o2;
       float f;
     }
     class C extends B {
       boolean b;
     }
     ```
     ```shell
     $ java -Xbootclasspath/a:. -jar ~/Downloads/jol-cli-0.5-full.jar internals C
     # Running 64-bit HotSpot VM.
     # Using compressed oop with 3-bit shift.
     # Using compressed klass with 3-bit shift.
     # Objects are 8 bytes aligned.
     # Field sizes by type: 4, 1, 1, 2, 2, 4, 4, 8, 8 [bytes]
     # Array element sizes: 4, 1, 1, 2, 2, 4, 4, 8, 8 [bytes]
     
     C object internals:
      OFFSET  SIZE    TYPE DESCRIPTION                    VALUE
           0     4         (object header)                09 00 00 00 (00001001 00000000 00000000 00000000) (9)
           4     4         (object header)                00 00 00 00 (00000000 00000000 00000000 00000000) (0)
           8     4         (object header)                be 3b 01 f8 (10111110 00111011 00000001 11111000) (-134136898)
          12     1 boolean A.b                            false
          13     3         (alignment/padding gap)        N/A
          16     4  Object A.o1                           null
          20     4     int B.i                            0
          24     8    long B.l                            0
          32     4   float B.f                            0.0
          36     4  Object B.o2                           null
          40     1 boolean C.b                            false
          41     7         (loss due to the next object alignment)
     Instance size: 48 bytes
     Space losses: 3 bytes internal + 7 bytes external = 10 bytes total
     ```
   - [jdk/oop.hpp at master · openjdk/jdk](https://github.com/openjdk/jdk/blob/master/src/hotspot/share/oops/oop.hpp)
     ```cpp
     class oopDesc {
       // ...
      private:
       volatile markWord _mark;
       union _metadata {
         Klass*      _klass;
         narrowKlass _compressed_klass;
       } _metadata;
       // ...
     }
     ```
     - [jdk/markWord.hpp at master · openjdk/jdk](https://github.com/openjdk/jdk/blob/master/src/hotspot/share/oops/markWord.hpp)
       ```cpp
       class markWord {
        private:
         uintptr_t _value;
         // ...
       }
       ```
     - [jdk/instanceKlass.hpp at master · openjdk/jdk](https://github.com/openjdk/jdk/blob/master/src/hotspot/share/oops/instanceKlass.hpp)
       ```cpp
       class InstanceKlass: public Klass {
         // ...
         // Method array.
         Array<Method*>* _methods;
         // ...
         // Instance and static variable information, starts with 6-tuples of shorts
         // [access, name index, sig index, initval index, low_offset, high_offset]
         // for all fields, followed by the generic signature data at the end of
         // the array. Only fields with generic signature attributes have the generic
         // signature data set in the array. The fields array looks like following:
         //
         // f1: [access, name index, sig index, initial value index, low_offset, high_offset]
         // f2: [access, name index, sig index, initial value index, low_offset, high_offset]
         //      ...
         // fn: [access, name index, sig index, initial value index, low_offset, high_offset]
         //     [generic signature index]
         //     [generic signature index]
         //     ...
         Array<u2>*      _fields;
         // ...
       }
       ```
     - [jdk/oop.inline.hpp at master · openjdk/jdk](https://github.com/openjdk/jdk/blob/master/src/hotspot/share/oops/oop.inline.hpp)
       ```cpp
       inline oop  oopDesc::obj_field(int offset) const                    { return HeapAccess<>::oop_load_at(as_oop(), offset);  }
       inline jint oopDesc::int_field(int offset) const                    { return HeapAccess<>::load_at(as_oop(), offset);  }
       ```

## GC

1. [Java Platform, Standard Edition HotSpot Virtual Machine Garbage Collection Tuning Guide, Release 11](https://docs.oracle.com/en/java/javase/11/gctuning/index.html)

1. GC
   - GC target detection
     - reference count — not used by JVM due to circular reference
     - reachability detection — DFS from GC roots
       - 自救 — make the object reachable in `Object::finalize`, 自救只能进行一次，`Object::finalize` will not be called twice
       - necessity when unload a class in permanent generation or metaspace — instances and class loader of this class garbage collected, no `Class` instance reference
   - GC type
     - minor GC — GC in young generation, where lifespan is short, move alive objects from Eden to survivor, executed frequently and relatively fast, triggered when not enough space in Eden
     - full GC — typically pause the application threads, GC in both generations and also permanent generation
     - major GC — GC in tenure generation, only in CMS
     - mixed GC — GC in young and part of tenure generation, only in G1??
   - full GC trigger
     - `System::gc`
     - not enough space in old or permanent generation
     - promotion guarantee failed, see below
     - concurrent mode failure in CMS

1. GC algorithm
   - mark sweep
     - steps
       - mark — mark reachable objects, stop-the-world
       - sweep — collected the unmarked and erase marks, merge if contiguous to the previous free block, freed space added to a single linked list called free list
     - free list — searched when allocate new objects to find enough space
     - disadvantages — segmentation; low performance
   - mark compact
     - compact — move active objects to one end, no segmentation but stop-the-world
   - mark copy — divide memory into two regions
     - copy — copies all alive objects to the other region
   - mark copy in HotSpot — Eden:survivor defaults to 8:(1 + 1), copy from Eden and one survivor to the other survivor, if not enough space, move to tenure generation
   - hybrid — mark copy for young generation, mark sweep or compact for tenure generation

1. memory management strategies
   - `new` objects — created in Eden, minor GC if not enough space
   - pretenure — large `new` objects directly created in tenure generation, specified as `-XX:PretenureSizeThreshold`
   - promotion by age — every move to Survivor increments the age by 1, move to tenure generation when age `-XX:MaxTenuringThreshold`
   - dynamic promotion — 如果在 Survivor 中相同年龄所有对象大小的总和大于 Survivor 空间的一半，则年龄大于或等于该年龄的对象可以直接进入老年代，无需等到 `MaxTenuringThreshold`
   - promotion guarantee — 在发生 Minor GC 之前，虚拟机先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果条件成立的话，那么 Minor GC 可以确认是安全的; after JDK 6, `-XX:-HandlePromotionFailure` removed，只要老年代的连续空间大于新生代对象的总大小或者历次晋升到老年代的对象的平均大小就进行 minor GC，否则 full GC
   - GC ergonomics with `-XX:+UseAdaptiveSizePolicy` — 不需要手工指定新生代的大小（`-Xmn`）、Eden 和 Survivor 区的比例、晋升老年代对象年龄等细节参数了。JVM 会根据当前系统的运行情况收集性能监控信息，动态调整这些参数 to achieve pause/throughput/footprint goals
     - logging — `-XX:AdaptiveSizePolicyOutputInterval=1`, `-XX:+PrintAdaptiveSizePolicy`
     - pause time goal — `-XX:MaxGCPauseMillis=<nnn>`, a hint to the garbage collector that a pause-time of `<nnn>` milliseconds or fewer is desired
     - throughput goal — `-XX:GCTimeRatio=nnn`, a hint to the garbage collector that no more than `1 / (1 + nnn)` of time should be spent on GC
     - footprint goal — if the throughput and maximum pause-time goals have been met, then the garbage collector reduces the size of the heap until one of the goals (invariably the throughput goal) can't be met or minimum reached

1. garbage collectors
   - categorization
     - for young generation — serial, ParNew, parallel scavenge, G1
     - for tenure generation — CMS, serial old (MSC), parallel old, G1
     - stop-the-world — above all except CMS and G1
     - combination of young and tenure
       - serial — serial old, CMS
       - ParNew — serial old, CMS
       - parallel scavenge — serial old, parallel old
   - default GC
     - since JDK 9 — G1
     - JDK 8
       - parallel GC for server class machine (with at least 2 processors and at least 2 GB of physical memory)
       - serial GC for client class machine (single processor or 32-bit platform)
   - serial — mark-copy, single thread, about 100ms for 100 to 200M garbage
     - serial old — serial GC for tenure generation, mark-compact, can serve as backup for CMS
   - ParNew — serial GC but multithread
   - parallel scavenge — similar to ParNew, but throughput (user CPU time versus total CPU time) first in contrast to minimizing pause time, better UX being more responsive with small pause time although smaller young generation and more frequent GC
     - parallel old — parallel scavenge for tenure generation
   - CMS, concurrent mark sweep — [blog](https://plumbr.io/handbook/garbage-collection-algorithms-implementations/concurrent-mark-and-sweep)
     - disadvantages
       - low throughput
       - concurrent mode failure — the CMS collector is unable to finish reclaiming the unreachable objects before the tenured generation fills up, or if an allocation cannot be satisfied with the available free space blocks in the tenured generation; serial old as backup
         - float garbage — objects that are traced by the garbage collector (reachable) thread may subsequently become unreachable by the time collection process ends, due to concurrently running application thread
       - segmentation from mark sweep
     - phases
       1. initial mark — stop-the-world but fast, mark objects directly connected to GC roots
       1. concurrent mark — most time-consuming phase
          - card marking — marks the area of the heap (called “card”) that contains the mutated object since last phase as “dirty”
       1. concurrent preclean — accounting for references being changed during previous marking phase, making dirty cards clean
       1. concurrent-abortable-preclean — like the previous phase, tbd
       1. final remark — stop-the-world, finalize marking all live objects in the old generation
       1. concurrent sweep
       1. concurrent reset — resetting inner data structures of the CMS algorithm and preparing them for the next cycle
   - G1, garbage first
     - region — G1 divides heap into different regions and the young and tenure generation is not physically separated. 通过记录每个 Region 垃圾回收时间以及回收所获得的空间，并维护一个优先列表，每次根据允许的收集时间，优先回收价值最大的 Region
     - remembered set — keep track of regionA -> regionB connection; when scanning regionB refer to remembered set to find out if need to scan regionA
     - phases except remembered set maintainence — like CMS, initial mark, concurrent mark, final remark, cleanup (partially concurrent)
       - cleanup — sort regions by GC cost and value, use a pause prediction model to meet a user-defined pause time target and select the number of regions to collect based on the specified pause time target
       - [Introduction on Oracle](https://www.oracle.com/technetwork/tutorials/tutorials-1876574.html)
     - advantages
       - concurrent like CMS
       - space compact, mark compact as a whole while being copy between regions
       - predictable GC pause durations
   - ZGC — shorter pause than Shenandoah, tbd
   - Shenandoah — higher throughput than ZGC, tbd

1. GC CLI
   - `-XX:+UseSerialGC` — 在新生代和老年代使用串行收集器
   - `-XX:+UseParNewGC` — 在新生代使用并行收集器
   - `-XX:+UseParallelGC` — 新生代使用并行回收收集器，更加关注吞吐量
   - `-XX:+UseParallelOldGC` — 老年代使用并行回收收集器
   - `-XX:+UseConcMarkSweepGC` — 新生代使用并行收集器，老年代使用CMS+串行收集器
     - `-XX:ParallelCMSThreads` — 设定CMS的线程数量
   - `-XX:+UseG1GC` — 启用G1垃圾回收器
     - `-XX:G1HeapRegionSize`, `-XX:G1NewSizePercent`, `-XX:G1MaxNewSizePercent`
   - `-XX:+UnlockExperimentalVMOptions` `-XX:+UseZGC` — 启用ZGC
     - `-XX:ZCollectionInterval` — ZGC发生的最小时间间隔，单位秒
     - `-XX:ZAllocationSpikeTolerance` — ZGC触发自适应算法的修正系数，默认2，数值越大，越早的触发ZGC
     - `-XX:+UnlockDiagnosticVMOptions` `-XX:-ZProactive` — 是否启用主动回收，默认开启，这里的配置表示关闭。
   - `-XX:+UseShenandoahGC`
   - `-XX:ParallelGCThreads` — 设置用于垃圾回收的线程数
   - `-XX:ConcGCThreads` — 并发回收垃圾的线程。默认是总核数的12.5%，8核CPU默认是1。调大后GC变快，但会占用程序运行时的CPU资源，吞吐会受到影响。
   - `-XX:InitiatingHeapOccupancyPercent` — percentage of the (entire) heap occupancy to start a concurrent GC cycle
   - `-Xlog` — 设置GC日志中的内容、格式、位置以及每个日志的大小
     ```
     -Xlog:safepoint,classhisto*=trace,age*,gc*=info:file=/opt/logs/logs/gc-%t.log:time,tid,tags:filecount=5,filesize=50m
     -XX:+PrintGC -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -Xloggc:/home/logs/gc.log
     ```
   - `-XX:+PrintCommandLineFlags` — print flags, can check used GC configurations
   - limits
     - `-XX:GCHeapFreeLimit` — minimum percentage of free space after a full GC before OOM
     - `-XX:MinHeapFreeRatio=40` and `-XX:MaxHeapFreeRatio=70` — virtual space percentage of total (virtual + committed) space in a generation
       - reduce memory footprint — lowering `-XX:MaxHeapFreeRatio` to as low as 10% and `-XX:MinHeapFreeRatio` has shown to successfully reduce the heap size without too much performance degradation; however, results may vary greatly

## Reference

1. `java.lang.ref.Reference`
   ```java
   public abstract class Reference<T>
   ```
   - `T get()`
   - `void clear()`
   - `boolean enqueue()` — adds this reference object to the queue with which it is registered, if any, only by the program (GC can enqueue references without invoking this method, typically clear referents simultaneously)
   - `boolean isEnqueued()`
   - notification of changes in an object's reachability — by registering an appropriate reference object with a reference queue at the time the reference object is created
   - reachability: an object is
     - strongly reachable — if it can be reached by some thread without traversing any reference objects. A newly-created object is strongly reachable by the thread that created it.
     - softly reachable — if it is not strongly reachable but can be reached by traversing a soft reference
     - weakly reachable — if it is neither strongly nor softly reachable but can be reached by traversing a weak reference. When the weak references to a weakly-reachable object are cleared, the object becomes eligible for finalization.
     - phantom reachable — if it is neither strongly, softly, nor weakly reachable, it has been finalized, and some phantom reference refers to it
     - unreachable — if it is not reachable in any of the above ways, eligible for reclamation
   - package private constructor for override
     - `Reference(T referent)`
     - `Reference(T referent, ReferenceQueue<? super T> queue)` — registered with the given queue
   - subclasses
     - `SoftReference`
     - `WeakReference`
     - `PhantomReference`

1. strong reference

1. `java.lang.ref.SoftReference<T>` — cleared at the discretion of the garbage collector in response to memory demand, guaranteed to have been cleared before `OutOfMemoryError`
   - use — for implementing memory-sensitive caches

1. `java.lang.ref.WeakReference<T>` — weak reference objects, which do not prevent their referents from being made finalizable, finalized, and then reclaimed; next GC
   - use — weak references are for implementing canonicalizing mappings that do not prevent their keys (or values) from being reclaimed

1. `java.lang.ref.PhantomReference<T>` — enqueued after the collector determines that their referents may otherwise be reclaimed
   - referent GC point
     - before Java 9 — unlike soft and weak references, phantom references are not automatically cleared by the GC as they are enqueued; an object that is reachable via phantom references will remain so until all such references are cleared or themselves become unreachable
     - since Java 9 — when phantom reachability detected, GC will atomically clear all phantom references to that object and all phantom references to any other phantom-reachable objects from which that object is reachable. At the same time or at some later time it will enqueue those newly-cleared phantom references that are registered with reference queues
   - use — a better `Object::finalize` hook: for scheduling pre-mortem cleanup actions in a more flexible way than is possible with the Java finalization mechanism
   - `Object::finalize` drawbacks
     - 实例执行垃圾回收的周期更长，性能更低
     - 单线程执行，因此在实例数目较多的情况下可能引起阻塞
     - 会被子类所继承，在子类未知的情况下，影响子类的垃圾回收性能
     - 不当的重载会导致原本已经"死亡"的实例"复活"
   - `get()` — always return `null` to ensure that a reclaimable object remains so

1. `java.lang.ref.ReferenceQueue<T>` — to which registered reference objects are appended by GC, at the same time or at some later time after detecting the reachability of the referent has changed to the value corresponding to the type of the reference
   - implementation — linked list, by `head` field, `next` field in `Reference`, and flags in `Reference`
   - `Reference<? extends T> poll()` — non-block
   - `Reference<? extends T> remove()` — block
   - `Reference<? extends T> remove(long timeout)`

## Class Loading

1. class file structure — tbd
   ```
   ClassFile {
       u4                magic;
       u2                minor_version;
       u2                major_version;
       u2                constant_pool_count;
       cp_info           contant_pool[constant_pool_count – 1];
       u2                access_flags;
       u2                this_class;
       u2                super_class;
       u2                interfaces_count;
       u2                interfaces[interfaces_count];
       u2                fields_count;
       field_info        fields[fields_count];
       u2                methods_count;
       method_info       methods[methods_count];
       u2                attributes_count;
       attribute_info    attributes[attributes_count];
   }
   ```
   - CLI — `javap -v -p -s -sysinfo -constants`
   - [ref](https://blog.jamesdbloom.com/JVMInternals.html)

1. class loading
   - class loading process — only classes needed for execution loaded, using the class loader of the method caller
     - loading — load binary stream from disk or web into structures in method area and generate a `Class` instance for the class
     - link
       - verifying — check semantics and safety like `final`, `private` and variable types, etc.
         - bytecode verification — bytecode, except system classes, verified for safety before loaded into JVM
         - turn off on CLI — `-noverify` (or `-Xverify:none`)
       - preparing — memory allocation for JVM, like method tables; static fields populated in method area
       - resolving — replace symbolic references with direct references
         - dynamic binding — resolving can happen after initializing for dynamic binding purposes
     - initializing — execute `<clinit>()` for assignments of non-`final` static fields and static blocks
   - class loaders
     - The bootstrap class loader — loads the system classes (typically, from the JAR file `rt.jar`, from modules since JDK 9)
       - usually implemented in C — as an integral part of the virtual machine, no `ClassLoader` object involved, `String.class.getClassLoader()` is `null`
     - The extension class loader — loads “standard extensions” from the `jre/lib/ext` directory, the loader does not use the class path
       - no more `jre/lib/ext` from JDK 9 — The javac compiler and java launcher will exit if the `java.ext.dirs` system property is set, or if the `lib/ext` directory exists
       - the platform class loader — the extension class loader is retained from JDK 9 and is specified as the platform class loader, see `ClassLoader::getPlatformClassLoader`
     - The system class loader (jdk internal `AppClassLoader`) — loads the application classes
   - class loader hierarchy
     - cosmic root — the bootstrap class loader
     - parents first — load only if the parent has failed
     - default parent when constructing `ClassLoader` — system class loader
   - break parents first
     - use customized `ClassLoader` — overloading `ClassLoader::loadClass`
     - use SPI — `Thread::getContextClassLoader` under the hood, so built-in classes can use user classes
     - OSGi hot deployment
     - module from JDK 9 — defaults to using the class loader of the module if in a module
   - context class loader — each thread has a reference to a class loader
     - `Thread::getContextClassLoader`, `Thread::setContextClassLoader`
     - class loader inversion — the phenomenon when loading classes programmatically, classes to load are not visible to default class loaders, can be solved by using context class loader
   - class loaders as namespaces — class equality is determined by its full name **and** the class loader
     - equality — `Class::equals`, `Class::isAssignableFrom`, `Class::isInstance`, `instanceof`
     - use — useful for loading code from multiple sources, hot deployment etc.
   - Class Data Sharing (CDS) — share common classes across different JVM instances and improve JVM start speed

1. class loading trigger
   - 主动引用 — must load the class for those references
     - when bytecode `new`, `getstatc`, `putstataic`, `invokestatic`
     - `java.lang.reflect`
     - parent classes must be loaded before loading subclasses
     - `main` method class when starting
     - `java.lang.invoke.MethodHandle`
   - 被动引用 — will not trigger class loading
     - the subclass when referring to a static field of superclass from a subclass
     - the class as the type of elements of an array
     - the class when referring to constants, as constants held in constant pool of the invoking class

1. `ClassLoader`
   ```java
   public abstract class ClassLoader extends Object
   ```
   - creation
     - `Class::getClassLoader`
   - assertion
     - `void clearAssertionStatus()`
     - `void setClassAssertionStatus(String className, boolean enabled)`
     - `void setDefaultAssertionStatus(boolean enabled)`
     - `void setPackageAssertionStatus(String packageName, boolean enabled)`
   - load classes
     - `protected Class<?> loadClass(String name, boolean resolve)` — Loads the class with the specified binary name, in below order
       1. `protected final Class<?> findLoadedClass(String name)`
       1. `loadClass` of the parent class loader or the build-in JVM class loader if the parent is `null`
       1. `protected Class<?> findClass​(String name)` — for overloading with own implementation
     - `protected final Class<?> defineClass(...)` — convert bytes to classes, typically used by `findClass`

1. `java.net.URLClassLoader`
   ```java
   public class URLClassLoader
   extends SecureClassLoader
   implements Closeable
   ```
   - example usage
     ```java
     URL url = new URL("file:///path/to/plugin.jar");
     URLClassLoader pluginLoader = new URLClassLoader(new URL[] { url });
     Class<?> cl = pluginLoader.loadClass("mypackage.MyClass");
     ```
