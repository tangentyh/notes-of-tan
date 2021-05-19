# Operating System

## Miscellanea

1. [Numbers Every Programmer Should Know By Year](https://colin-scott.github.io/personal_website/research/interactive_latency.html)
   ```shell
   curl cheat.sh/latencies
   ```
   ```
   Latency Comparison Numbers (~2012)
   ----------------------------------
   L1 cache reference                           0.5 ns
   Branch mispredict                            5   ns
   L2 cache reference                           7   ns                      14x L1 cache
   Mutex lock/unlock                           25   ns
   Main memory reference                      100   ns                      20x L2 cache, 200x L1 cache
   Compress 1K bytes with Zippy             3,000   ns        3 us
   Send 1K bytes over 1 Gbps network       10,000   ns       10 us
   Read 4K randomly from SSD*             150,000   ns      150 us          ~1GB/sec SSD
   Read 1 MB sequentially from memory     250,000   ns      250 us
   Round trip within same datacenter      500,000   ns      500 us
   Read 1 MB sequentially from SSD*     1,000,000   ns    1,000 us    1 ms  ~1GB/sec SSD, 4X memory
   Disk seek                           10,000,000   ns   10,000 us   10 ms  20x datacenter roundtrip
   Read 1 MB sequentially from disk    20,000,000   ns   20,000 us   20 ms  80x memory, 20X SSD
   Send packet CA->Netherlands->CA    150,000,000   ns  150,000 us  150 ms
   ```
   - [original link to berkeley](http://www.eecs.berkeley.edu/~rcs/research/interactive_latency.html)
   - [widespread 2012 version](https://gist.github.com/jboner/2841832)

## Introduction

1. 基本特征
   - 并发
     - 并发 — 宏观上在一段时间内能同时运行多个程序
     - 并行 — 同一时刻能运行多个指令。多流水线、多核处理器或者分布式计算系统
   - 共享
     - 互斥共享
       - 互斥共享的资源称为临界资源
     - 同时共享
   - 虚拟 — 把一个物理实体转换为多个逻辑实体
     - 时分复用技术
     - 空分复用技术 — 虚拟内存
   - 异步

1. 基本功能
   - 进程管理 — 进程控制、进程同步、进程通信、死锁处理、处理机调度等
   - 内存管理 — 内存分配、地址映射、内存保护与共享、虚拟内存等
   - 文件管理 — 文件存储空间的管理、目录管理、文件读写管理和保护等
   - 设备管理 — 完成用户的 I/O 请求，方便用户使用各种设备，并提高设备的利用率。主要包括缓冲管理、设备分配、设备处理、虛拟设备等

1. 系统调用 — 如果一个进程在用户态需要使用内核态的功能，就进行系统调用从而陷入内核，由操作系统代为完成。
   - common calls
     - 进程控制 — fork(); exit(); wait();
     - 进程通信 — pipe(); shmget(); mmap();
     - 文件操作 — open(); read(); write();
     - 设备操作 — ioctl(); read(); write();
     - 信息维护 — getpid(); alarm(); sleep();
     - 安全 — chmod(); umask(); chown();

1. monolithic and micro-kernel — 在微内核结构下，操作系统被划分成小的、定义良好的模块，只有微内核这一个模块运行在内核态，其余模块运行在用户态。

1. interrupt
   - 外中断 — 由 CPU 执行指令以外的事件引起，如 I/O 完成中断，表示设备输入/输出处理已经完成，处理器能够发送下一个输入/输出请求。此外还有时钟中断、控制台中断等
   - 异常 — 由 CPU 执行指令的内部事件引起，如非法操作码、地址越界、算术溢出等
   - 陷入 — 在用户程序中使用系统调用

## Process

1. process and thread
   - 进程 — 进程是资源分配的基本单位
     - 进程控制块 (Process Control Block, PCB) — 描述进程的基本信息和运行状态，所谓的创建进程和撤销进程，都是指对 PCB 的操作
   - 线程 — 线程是独立调度的基本单位。一个进程中可以有多个线程，它们共享进程资源。

1. 进程状态的切换
   ```
                   scheduler dispatch
          admitted       ------>          exit
   created -----> ready          running ------> terminated
                    |    <------    |
            I/O or  |   interrupt   | I/O or
             event  |               | event wait
         completion \--> waiting <--/
   ```
   - 就绪状态的进程通过调度算法从而获得 CPU 时间，转为运行状态；而运行状态的进程，在分配给它的 CPU 时间片用完之后就会转为就绪状态，等待下一次调度
   - 阻塞状态是缺少需要的资源从而由运行状态转换而来，但是该资源不包括 CPU 时间，缺少 CPU 时间会从运行态转换为就绪态

1. 僵尸进程，孤儿进程
   - 僵尸进程 — 一个子进程结束后，它的父进程并没有等待它（调用 wait 或者 waitpid），那么这个子进程将成为一个僵尸进程，占用进程号和内存
     - 防止僵尸进程
       - 孤儿进程
       - 父进程调用 wait 或者 waitpid 等待子进程结束
       - waitpid in `SIGCHLD` handler
       - `signal(SIGCLD, SIG_IGN)` — 通知内核，表示忽略 `SIGCHLD` 信号，那么子进程结束后，内核会进行回收
   - 孤儿进程 — 一个父进程已经结束了，但是它的子进程还在运行，那么这些子进程将成为孤儿进程。孤儿进程会被 Init（进程 ID 为1）接管，并且会调用 wait 等待其结束

1. 协程 — 用户态的轻量级线程，tbd

1. 进程调度算法
   - 批处理系统 — 调度算法目标是保证吞吐量和周转时间（从提交到终止的时间）
     - 先来先服务 first-come first-serverd（FCFS） — 短作业必须一直等待前面的长作业执行完毕才能执行
     - 短作业优先 shortest job first（SJF） — 长作业有可能会饿死
     - 最短剩余时间优先 shortest remaining time next（SRTN） — 短作业优先的抢占式版本，当一个新的作业到达时，其整个运行时间与当前进程的剩余时间作比较
     - 最高响应比优先 Highest Response Ratio Next（HRRN）— 响应比 = 1+ 等待时间/处理时间。同时考虑了等待时间的长短和估计需要的执行时间长短，很好的平衡了长短进程。非抢占，吞吐量高，开销可能较大，提供好的响应时间，无饥饿问题。
   - 交互式系统 — 调度算法的目标是快速地进行响应
     - 优先级调度 — 为了防止低优先级的进程永远等不到调度，可以随着时间的推移增加等待进程的优先级
       - 优先级反转 — 高优先级的进程等待被一个低优先级进程占用的资源时，就会出现优先级反转，即优先级较低的进程比优先级较高的进程先执行
       - 解决优先级反转
         - 优先级天花板（priority ceiling） — 当任务申请某资源时，把该任务的优先级提升到可访问这个资源的所有任务中的最高优先级，这个优先级称为该资源的优先级天花板，简单易行
         - 优先级继承（priority inheritance） — 当任务A申请共享资源S时，如果S正在被任务C使用，通过比较任务C与自身的优先级，如发现任务C的优先级小于自身的优先级，则将任务C的优先级提升到自身的优先级，任务C释放资源S后，再恢复任务C的原优先级
     - 时间片轮转 — FCFS，每次调度时，把 CPU 时间分配给队首进程，该进程可以执行一个时间片。当时间片用完时，由计时器发出时钟中断，调度程序便停止该进程的执行，并将它送往就绪队列的末尾，同时继续把 CPU 时间分配给队首的进程。
       - 时间片太小 — 会导致进程切换得太频繁，在进程切换上就会花过多时间
       - 时间片过长 — 实时性不能得到保证
     - 多级反馈队列 — 多个队列，每个队列时间片大小都不同，例如 1,2,4,8,…。进程在第一个队列没执行完，就会被移到下一个队列。每个队列优先权也不同，最上面的优先权最高。因此只有上一个队列没有进程在排队，才能调度当前队列上的进程。解决长任务进程切换过多的问题。

1. 进程同步
   - 临界区 — 对临界资源进行访问的那段代码称为临界区，用于同一进程中线程的同步
   - 同步与互斥
     - 同步 — 多个进程因为合作产生的直接制约关系，使得进程有一定的先后执行关系
     - 互斥 — 多个进程在同一时刻只有一个进程能进入临界区
     - 互斥量 — 内核对象，semaphore with value 1
   - 信号量（semaphore） — 整型变量，mutex when 1
     - down 和 up 操作，也就是常见的 P 和 V 操作
       - down — 如果信号量大于 0 ，执行 -1 操作；如果信号量等于 0，进程睡眠，等待信号量大于 0
       - up — 对信号量执行 +1 操作，唤醒睡眠的进程让其完成 down 操作
     - atomic — 执行这些操作的时候屏蔽中断
   - 事件 — 允许一个线程在处理完一个任务后，主动唤醒另外一个线程执行任务。事件分为手动重置事件和自动重置事件。手动重置事件被设置为激发状态后，会唤醒所有等待的线程，而且一直保持为激发状态，直到程序重新把它设置为未激发状态。自动重置事件被设置为激发状态后，会唤醒一个等待中的线程，然后自动恢复为未激发状态。
   - 管程 — like object intrinsic lock in Java

1. 经典同步问题
   - 生产者和消费者问题
   - 哲学家进餐问题 — 五个哲学家围着一张圆桌，每个哲学家面前放着食物。哲学家的生活有两种交替活动：吃饭以及思考。当一个哲学家吃饭时，需要先拿起自己左右两边的两根筷子，并且一次只能拿起一根筷子。
     - 死锁 — 如果所有哲学家同时拿起左手边的筷子，那么所有哲学家都在等待其它哲学家吃完并释放自己手中的筷子
     - 防止死锁 — [The Dining Philosophers - LeetCode](https://leetcode.com/problems/the-dining-philosophers/)
   - 读者-写者问题 — `java.util.concurrent.locks.ReadWriteLock`

1. 进程通信
   - 管道 — 通过 pipe 函数创建的，`fd[0]` 用于读，`fd[1]` 用于写。只支持半双工通信（单向交替传输）；只能在父子进程或者兄弟进程中使用。
   - FIFO, aka named pipe — 去除了管道只能在父子进程中使用的限制。常用于客户-服务器应用程序中，FIFO 用作汇聚点，在客户进程和服务器进程之间传递数据。
   - 消息队列
     - 消息队列可以独立于读写进程存在，从而避免了 FIFO 中同步管道的打开和关闭时可能产生的困难；
     - 避免了 FIFO 的同步阻塞问题，不需要进程自己提供同步方法
     - 读进程可以根据消息类型有选择地接收消息，而不像 FIFO 那样只能默认地接收
   - semaphore
   - 共享存储 — 允许多个进程共享一个给定的存储区。因为数据不需要在进程之间复制，所以这是最快的一种 IPC。需要使用信号量用来同步对共享存储的访问。多个进程可以将同一个文件映射到它们的地址空间从而实现共享内存。另外 XSI 共享内存不是使用文件，而是使用内存的匿名段。
   - socket

## Disk

1. 磁盘结构
   - 盘面（Platter）：一个磁盘有多个盘面；
   - 磁道（Track）：盘面上的圆形带状区域，一个盘面可以有多个磁道；
   - 扇区（Track Sector）：磁道上的一个弧段，一个磁道可以有多个扇区，它是最小的物理储存单位，目前主要有 512 bytes 与 4 K 两种大小；
   - 磁头（Head）：与盘面非常接近，能够将盘面上的磁场转换为电信号（读），或者将电信号转换为盘面的磁场（写）；
   - 制动手臂（Actuator arm）：用于在磁道之间移动磁头；
   - 主轴（Spindle）：使整个盘面转动。

1. 磁盘调度算法
   - 读写一个磁盘块的时间的影响因素有
     - 旋转时间（主轴转动盘面，使得磁头移动到适当的扇区上）
     - 寻道时间（制动手臂移动，使得磁头移动到适当的磁道上） — 其中，寻道时间最长，因此磁盘调度的主要目标是使磁盘的平均寻道时间最短
     - 实际的数据传输时间
   - FCFS — 按照磁盘请求的顺序进行调度
   - SSTF, Shortest Seek Time First — 优先调度与当前磁头所在磁道距离最近的磁道, 两端的磁道请求容易出现饥饿现象
   - SCAN, 电梯算法 — 电梯总是保持一个方向运行，直到该方向没有请求为止，然后改变运行方向。

1. SSD
   - hierarchy
     - memory cells -> strings (typically 32 to 64 cells per string) -> arrays
     - pages, range from 2 to 16 Kb, read / write unit; pages in an empty block have to be written sequentially
     - blocks, typically contain 64 to 512 pages, smallest erase entity
     - planes
     - dies
   - Flash Translation Layer (FTL) — mapping page IDs to their physical locations, tracking empty, written, and discarded pages, also responsible for garbage collection
   - write amplification — data cannot be directly overwritten as in HDD: NAND flash memory writes data in pages but erases data in blocks, have to do GC to erase before write
     - `TRIM`, a SATA command — tell an SSD which blocks of previously saved data are no longer needed as a result of file deletions or volume formatting, thus ignoring those during GC
     - OP (Over Provisioning) — reserved space, 7% ~ 30%, can alleviate write amplification

1. block device abstraction — most operating systems have a block device abstraction, which hides an internal disk structure and buffers I/O operations internally; the smallest unit of disk operation
   - strategy — writing only full blocks, and combining subsequent writes to the same block

1. redundant arrays of independent disks, RAID
   - RAID 0 — horizontal scaling of disks, no redundancy but high performance, can be used for logs
   - RAID 1 — an exact copy (or mirror) of a set of data on two or more disks; any read request can be serviced and handled by any drive in the array, overall write performance is equal to the speed of the slowest disk
   - RAID 10 and RAID 01 — multiple RAID 1 forming RAID 0, or multiple RAID 0 forming RAID 1
   - RAID 5 — parity check based, parity information is distributed among the drives, requires that all drives but one be present to operate. Upon failure of a single drive, subsequent reads can be calculated from the distributed parity such that no data is lost
   - more

1. file systems
   - HDFS, GFS — tbd

## Compiling

1. 目标文件
   - 可执行目标文件：可以直接在内存中执行
   - 可重定位目标文件：可与其它可重定位目标文件在链接阶段合并，创建一个可执行目标文件
   - 共享目标文件：这是一种特殊的可重定位目标文件，可以在运行时被动态加载进内存并链接

1. 编译过程
   - 预处理阶段：处理以 # 开头的预处理命令
   - 编译阶段：翻译成汇编文件（文本）
   - 汇编阶段：将汇编文件翻译成可重定位目标文件
   - 链接阶段：将可重定位目标文件和 printf.o 等单独预编译好的目标文件进行合并，得到最终的可执行目标文件
     - 静态链接 — 以一组可重定位目标文件为输入，生成一个完全链接的可执行目标文件作为输出
       - 过程
         - 符号解析：每个符号对应于一个函数、一个全局变量或一个静态变量，符号解析的目的是将每个符号引用与一个符号定义关联起来
         - 重定位：链接器通过把每个符号定义与一个内存位置关联起来，然后修改所有对这些符号的引用，使得它们指向这个内存位置
       - 问题
         - 当静态库更新时那么整个程序都要重新进行链接
         - 对于 `printf` 这种标准函数库，如果每个程序都要有代码，这会极大浪费资源
     - 动态链接
       - 在给定的文件系统中一个库只有一个文件，所有引用该库的可执行目标文件都共享这个文件，它不会被复制到引用它的可执行文件中
       - 在内存中，一个共享库的 .text 节（已编译程序的机器代码）的一个副本可以被不同的正在运行的进程共享

## Memory

1. 虚拟内存
   - 内存 -> 地址空间 -> 页
   - 虚拟内存 — 页被映射到物理内存，但不需要映射到连续的物理内存，也不需要所有页都必须在物理内存中。当程序引用到不在物理内存中的页时，由硬件执行必要的映射，将缺失的部分装入物理内存并重新执行失败的指令。

1. 分页系统地址映射: 内存管理单元（MMU）— 管理着地址空间和物理内存的转换
   - 页表（Page table） — 存储着页（程序地址空间）和页框（物理内存空间）的映射表
   - 虚拟地址 — 分成两个部分，一部分存储页面号，一部分存储偏移量

1. 颠簸现象 — 频繁的页调度行为，解决方案有
   - 修改页面置换算法
   - 降低同时运行的程序的数量
   - 终止该进程或增加物理内存容量

1. 页面置换算法 — 在程序运行过程中，如果要访问的页面不在内存中（page fault），就发生缺页中断从而将该页调入内存中。此时如果内存已无空闲空间，系统必须从内存中调出一个页面到磁盘对换区中来腾出空间。
   - OPT, Optimal replacement algorithm — 所选择的被换出的页面将是最长时间内不再被访问，通常可以保证获得最低的缺页率。是一种理论上的算法，因为无法知道一个页面多长时间不再被访问。
   - LRU, Least Recently Used
     - 2Q (Two-Queue LRU) — maintains two queues to distinguish between the recently and frequently accessed pages
   - NRU, Not Recently Used — flag R for read, flag M for modified, R resets periodically; choose page in order 00, 01, 10, 11 according to flag R and M
   - FIFO, First In First Out
     - plain FIFO
     - second chance — FIFO but if last visited flag is set, the head is enqueued again with flag cleared, and continue the process with the new head
     - Clock — 使用环形链表将页面连接起来，再使用一个指针指向最老的页面。避免 second chance 中的链表移动
   - LFU
   - more on [Page replacement algorithm - Wikipedia](https://en.wikipedia.org/wiki/Page_replacement_algorithm)

1. segment
   - 覆盖问题 — 编译器在编译过程中建立的多个表，有 4 个表是动态增长的（call stack, constant table, source text, symbol table），如果使用分页系统的一维地址空间，动态增长的特点会导致覆盖问题
   - 分段 — 把每个表分成段，一个段构成一个独立的地址空间。每个段的长度可以不同，并且可以动态增长。
   - 段页式 — 程序的地址空间划分成多个拥有独立地址空间的段，每个段上的地址空间划分成大小相同的页。这样既拥有分段系统的共享和保护，又拥有分页系统的虚拟内存功能。

## Dead Lock

1. necessary condition
   - 互斥 — 每个资源要么已经分配给了一个进程，要么就是可用的
   - 占有和等待 — 已经得到了某个资源的进程可以再请求新的资源
   - 不可抢占 — 已经分配给一个进程的资源不能强制性地被抢占，它只能被占有它的进程显式地释放
   - 环路等待 — 有两个或者两个以上的进程组成一条环路，该环路中的每个进程都在等待下一个进程所占有的资源

1. 鸵鸟策略 — 因为解决死锁问题的代价很高，因此鸵鸟策略这种不采取任务措施的方案会获得更高的性能。

1. 死锁检测与死锁恢复
   - 每种类型一个资源的死锁检测 — 检测有向图是否存在环，可以 DFS + visited
   - 每种类型多个资源的死锁检测 — current allocation matrix C, request matrix P, resource vector, remaining resource vector A
     1. 寻找一个没有标记的进程 $P_i$ in P，它所请求的资源小于等于 A
     1. 如果找到了这样一个进程，那么将 $C_i$ 行向量加到 A 中，标记该进程，并转回 1
     1. 如果没有这样一个进程，算法终止
     1. 任何没有被标记的进程都是死锁进程
   - 死锁恢复
     - 利用抢占恢复
     - 利用回滚恢复
     - 通过杀死进程恢复

1. 死锁预防
   - 破坏互斥条件 — 例如假脱机打印机技术允许若干个进程同时输出，唯一真正请求物理打印机的进程是打印机守护进程
   - 破坏占有和等待条件 — 一种实现方式是规定所有进程在开始执行前请求所需要的全部资源
   - 破坏不可抢占条件
   - 破坏环路等待 — 给资源统一编号，进程只能按编号顺序来请求资源

1. 死锁避免
   - 安全状态 — 如果没有死锁发生，并且即使所有进程突然请求对资源的最大需求，也仍然存在某种调度次序能够使得每一个进程运行完毕，则称该状态是安全的。与死锁的检测类似
   - 单个资源的银行家算法 — 断对请求的满足是否会进入不安全状态，如果是，就拒绝请求；否则予以分配。
   - 多个资源的银行家算法
     - 查找待分配的资源的矩阵是否存在一行（一个进程待分配待资源）小于等于可用资源向量。如果不存在这样的行，那么系统将会发生死锁，状态是不安全的。
     - 假若找到这样一行，将该进程标记为终止，已分配资源释放
     - 重复以上两步，直到所有进程都标记为终止，则状态时安全的
     - 如果一个状态不是安全的，需要拒绝进入这个状态
