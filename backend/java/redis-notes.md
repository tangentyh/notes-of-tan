# Introduction

1. docs
   - [Redis official](https://redis.io/documentation)
   - [Redis GitHub](https://github.com/redis/redis)
   - [Redis Labs Documentation | Redis Labs Documentation Center](https://docs.redislabs.com/latest/index.html)
   - [Redis 命令参考 — Redis 命令参考](http://redisdoc.com/)
   - books
     - [e-Books - Redis](https://redislabs.com/ebooks)
     - [Redis 设计与实现 — Redis 设计与实现](http://redisbook.com/)
     - [Redis实战 — Redis 实战](http://redisinaction.com/)
     - [Redis使用手册](http://redisguide.com/)
     - [《Redis入门与实战》 — LearnRedis.com 1.0 文档](http://learnredis.com/)

# Data Types And Data Structures

## Data Structures

1. string
   - `c_str` -- used in string literal, like when `redisLog`
   - simple dynamic string，SDS -- used as keys, values, and buffers
     ```cpp
     struct sdshdr {
         // 记录 buf 数组中已使用字节的数量
         // 等于 SDS 所保存字符串的长度
         int len;
         // 记录 buf 数组中未使用字节的数量
         int free;
         // c_str, '\0' ended, which is not counted in len
         char buf[];
     };
     ```
     - capacity grow policy -- if `len` < 1 MB, `free` = `len`; else, `free` = 1 MB
     - lazy reclaim of `free` -- reclaim on demand
     - binary-safe -- `len` as end, instead of `'\0'` as end
       - `'\0'` as end -- for C API reuse, partially supported

1. dictionary, hash table -- used in `REDIS_HASH` and database implementation, and more
   ```cpp
   typedef struct dict {
       // 类型特定函数
       dictType *type;
       // 需要传给那些类型特定函数的可选参数
       void *privdata;
       // 哈希表
       dictht ht[2];
       // rehash 索引
       int rehashidx; /* rehashing not in progress if rehashidx == -1 */
   } dict;
   ```
   - `dictType`
     ```cpp
     typedef struct dictType {
         // 计算哈希值的函数, MurmurHash algorithm for v3
         unsigned int (*hashFunction)(const void *key);
         // 复制键的函数
         void *(*keyDup)(void *privdata, const void *key);
         // 复制值的函数
         void *(*valDup)(void *privdata, const void *obj);
         // 对比键的函数
         int (*keyCompare)(void *privdata, const void *key1, const void *key2);
         // 销毁键的函数
         void (*keyDestructor)(void *privdata, void *key);
         // 销毁值的函数
         void (*valDestructor)(void *privdata, void *obj);
     } dictType;
     ```
   - `dictht` -- dictionary hash table
     ```cpp
     typedef struct dictht {
         // 哈希表数组
         dictEntry **table;
         // size of table, defaults to 4
         unsigned long size;
         // 哈希表大小掩码，用于计算索引值
         // 总是等于 size - 1
         unsigned long sizemask;
         // 该哈希表已有节点的数量
         unsigned long used;
     } dictht;
     ```
     - `dictEntry` -- key-value pair
       ```cpp
       typedef struct dictEntry {
           void *key;
           // 值
           union { void *val; uint64_t u64; int64_t s64; } v;
           // 指向下个哈希表节点，形成链表
           struct dictEntry *next;
       } dictEntry;
       ```
     - hash value -- `hashFunction(key) & sizemask`
     - hash collision -- separate chaining with `*next`, 程序总是将新节点添加到链表的表头位置
   - rehash
     - expand -- when not executing `BGSAVE` or `BGREWRITEAOF` and load factor >= 1, or when executing either one and load factor >= 5; expand to the size of the first 2^n that >= `ht[0].used * 2`
     - shrink -- when load factor < 0.1; shrink to the size of the first 2^n that >= `ht[0].used`
     - progressive rehash -- set `rehashidx` to 0, and increment by 1 for every CRUD operation, reset to -1 when completed and swap `ht[0]` and `ht[1]`

1. skiplist -- used in `REDIS_ZSET` and cluster
   ```cpp
   typedef struct zskiplist {
       // 表头节点和表尾节点
       struct zskiplistNode *header, *tail;
       // 表中节点的数量
       unsigned long length;
       // 表中层数最大的节点的层数
       int level;
   } zskiplist;
   ```
   - `zskiplistNode`
     ```cpp
     typedef struct zskiplistNode {
         // 后退指针
         struct zskiplistNode *backward;
         // 分值
         double score;
         // 成员对象
         robj *obj;
         // 层
         struct zskiplistLevel {
             // 前进指针
             struct zskiplistNode *forward;
             // 跨度
             unsigned int span;
         } level[];
     } zskiplistNode;
     ```
     - level -- height generated between 1 to 32 according to power law
     - score -- for sort, ascending, sort by `obj` when equality

1. int set -- encoding-adapting ordered distinct array, used in `REDIS_SET` if the cardinality is low
   ```cpp
   typedef struct intset {
       // 编码方式
       uint32_t encoding;
       // 集合包含的元素数量
       uint32_t length;
       // 保存元素的数组, ordered
       int8_t contents[];
   } intset;
   ```
   - add element -- O(N)
     - space saving -- `contents` is of the smallest encoding possible, upgrade and reallocate if necessary
     - upgrade -- if one encoding not enough, upgrade encoding of `contents` from `INTSET_ENC_INT16` to `INTSET_ENC_INT32` to `INTSET_ENC_INT64`, new element added at head or tail
   - related commands
     - `SADD`

1. list -- linked list, used in `REDIS_LIST` and various places
   ```cpp
   typedef struct listNode {
       struct listNode *prev;
       struct listNode *next;
       void *value;
   } listNode;
   typedef struct list {
       listNode *head;
       listNode *tail;
       unsigned long len;
       // 节点值复制函数
       void *(*dup)(void *ptr);
       // 节点值释放函数
       void (*free)(void *ptr);
       // 节点值对比函数
       int (*match)(void *ptr, void *key);
   } list;
   ```
   - related commands
     - `LLEN key`
     - `LRANGE key start stop`

1. ziplist -- a sequential data structure that is continuous on memory, used in `REDIS_LIST` and `REDIS_HASH`
   ```
   zlbytes zltail zllen [entries] zlend
    4b       4b    2b              0xFF
   ```
   - `zlbytes` -- total size
   - `zltail` -- offset between the start of the ziplist and the start of the last entry
   - `zllen` -- total entry count, can only hold within `UINT16_MAX`
   - `zlend` -- end mark
   - entry -- a byte array or a number
     ```
     previous_entry_length encoding content
     ```
     - `previous_entry_length` -- 1 byte when < `0xFE` otherwise 5 byte starting with `0xFE`, for iterating
     - `encoding` -- type and length of `content`
     - operations like push an entry -- O(N), the possibility of long cascade update is low, which needs consecutive entries of length between 250 to 253b
       - cascade update -- `previous_entry_length` of an entry updates from 1b to 5b, triggering the `previous_entry_length` update of the next entry, O(N^2) in the worst case

## Data Types

1. object -- wrapper for data structures, with timestamp, with reference count for object sharing and GC
   ```cpp
   typedef struct redisObject {
       // 类型
       unsigned type:4;
       // 编码
       unsigned encoding:4;
       // 指向底层实现数据结构的指针
       void *ptr;
       // 引用计数
       int refcount;
       unsigned lru:22;
       // ...
   } robj;
   ```
   - `type` -- `REDIS_STRING`, `REDIS_LIST`, `REDIS_HASH`, `REDIS_SET`, `REDIS_ZSET`, keys are always string
   - `encoding` -- `REDIS_ENCODING_INT`, `REDIS_ENCODING_EMBSTR`, `REDIS_ENCODING_RAW`, `REDIS_ENCODING_HT` (hash table), `REDIS_ENCODING_LINKEDLIST`, `REDIS_ENCODING_ZIPLIST`, `REDIS_ENCODING_INTSET`, `REDIS_ENCODING_SKIPLIST`
   - polymorphism -- the same command works for different types and/or encodings
   - GC -- reference counting
   - `lru` -- last accessed timestamp, used when `maxmemory` with `volatile-lru` or `allkeys-lru`
   - flyweight -- for integers from 0 to 9999
   - related commands
     - `OBJECT`
       - `OBJECT ENCODING`
       - `OBJECT REFCOUNT`
       - `OBJECT IDLETIME`
     - `TYPE`
     - see `redisDb`

1. `REDIS_STRING`
   - corresponding `encoding`
     - `REDIS_ENCODING_INT` -- `long`, for numbers within range
     - `REDIS_ENCODING_EMBSTR` -- 使用 embstr 编码的 SDS, used when stirng length <= 39 bytes and when `long double`
       - `embstr` -- like raw SDS, but allocate one space for both `redisObject` and `sdshdr`, read only, and more
     - `REDIS_ENCODING_RAW` -- SDS, used when string length > 39 bytes
   - related commands
     - `SET`, `GET`
     - `MSET`
     - `APPEND`
     - `INCRBYFLOAT`
     - `INCRBY`, `DECRBY`
     - `STRLEN`
     - `SETRANGE`, `GETRANGE`
     - `SETEX`

1. bit array
   - `redisObject.type` -- `REDIS_STRING`, like `java.util.BitSet`, but one byte (`char`) each word
   - related commands
     - `SETBIT`
     - `GETBIT`
     - `BITCOUNT`
     - `BITOP`

1. `REDIS_LIST`
   - corresponding `encoding`
     - `REDIS_ENCODING_ZIPLIST` -- when each element size < 64 bytes and list size < 512, `list-max-ziplist-value` and `list-max-ziplist-entries` in configurations
     - `REDIS_ENCODING_LINKEDLIST`
   - related commands
     - `LPUSH`, `RPUSH`
     - `LPOP`, `RPOP`
     - `LINDEX`
     - `LLEN`
     - `LINSERT`
     - `LREM`
     - `LTRIM`
     - `LSET`

1. `REDIS_HASH`
   - corresponding `encoding`
     - `REDIS_ENCODING_ZIPLIST` -- when all keys and values < 64 bytes, and list size < 512, `hash-max-ziplist-value` and `hash-max-ziplist-entries` in configurations
     - `REDIS_ENCODING_HT`
   - related commands
     - `HSET`, `HGET`
     - `HEXISTS`
     - `HDEL`
     - `HLEN`
     - `HGETALL`

1. `REDIS_SET`
   - corresponding `encoding`
     - `REDIS_ENCODING_INTSET` -- when only integer elements and cardinality < 512, `set-max-intset-entrie` in configurations
     - `REDIS_ENCODING_HT` -- `null` as value
   - related commands
     - `SADD`
     - `SCARD`
     - `SISMEMBER`
     - `SMEMBERS`
     - `SRANDMEMBER`
     - `SPOP`
     - `SREM`

1. `REDIS_ZSET` -- ordered set
   - corresponding `encoding`
     - `REDIS_ENCODING_ZIPLIST` -- when cardinality < 128 and all elements < 64 bytes, `zset-max-ziplist-entries` and `zset-max-ziplist-value` in configurations
     - `REDIS_ENCODING_SKIPLIST` -- use `zset`: like `java.util.LinkedHashMap` but with skiplist in lieu of linked list
       ```cpp
       typedef struct zset {
           zskiplist *zsl;
           dict *dict;
       } zset;
       ```
   - related commands
     - `ZCARD`
     - `ZADD`
     - `ZRANGE`, `ZREVRANGE`
     - `ZSCORE`
     - `ZCOUNT`
     - `ZRANK`, `ZREVRANK`
     - `ZREM`

## Sort

1. sort
   ```cpp
   typedef struct _redisSortObject {
       robj *obj;
       union {
           double score;
           robj *cmpobj; // for BY ALPHA
       } u;
   } redisSortObject;
   ```
   - steps
     1. create an array of `redisSortObject`
     1. populate `redisSortObject->obj`
     1. populate scores, skipped when `ALPHA`, according to the pattern when `BY`;otherwise populate `cmpobj` if `BY` with `ALPHA`
     1. sort, by quicksort
     1. return to the client
   - compare by
     ```
     reids> SADD fruits "apple" "banana" "cherry"
     redis> MSET apple-price 8 banana-price 5.5 cherry-price 7
     redis> SORT fruits BY *-price
     ```
   - related commands
     - `SORT`
       ```
       SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
       ```
       - `ALPHA` -- lexicographically
       - `ASC`, `DESC`
       - `BY`
       - `LIMIT`
       - `GET` -- get pattern
       - `STORE`

# Server

1. server
   ```cpp
   struct redisServer {
     // ...
     redisDb *db; // db array
     int dbnum;                      /* Total number of configured DBs */
     // ...
     // part of stats
     long long stat_keyspace_hits;   /* Number of successful lookups of keys */
     long long stat_keyspace_misses; /* Number of failed lookups of keys */
     // ...
     /* RDB persistence */
     long long dirty;                /* Changes to DB from the last save */
     long long dirty_before_bgsave;  /* Used to restore dirty on failed BGSAVE */
     // ...
     /* Networking */
     list *clients;              /* List of active clients */
     list *clients_to_close;     /* Clients to close asynchronously */
     list *clients_pending_write; /* There is to write or install handler. */
     list *clients_pending_read;  /* Client has pending read socket buffers. */
     // ...
     /* Scripting */
     lua_State *lua; /* The Lua interpreter. We use just one for all clients */
     client *lua_client;   /* The "fake client" to query Redis from Lua */
     // ...
   }
   ```
   - `dbnum` -- defaults to 16, `database` in configurations
   - maintainence when reading or writing a keyspace
     - maintain statistics, like `stat_keyspace_hits`, `stat_keyspace_misses`
     - update `redisObject.lru`
     - delete a key if expired
     - mark `WATCH`ed keys dirty
     - increment `dirty` counters
     - dispatch notifications
   - related commands
     - `INFO`
       - `SERVER`
       - `STATS`

1. `redisDb`
   ```cpp
   /* Redis database representation. There are multiple databases identified
    * by integers from 0 (the default database) up to the max configured
    * database. The database number is the 'id' field in the structure. */
   typedef struct redisDb {
       dict *dict;                 /* The keyspace for this DB */
       dict *expires;              /* Timeout of keys with a timeout set */
       dict *blocking_keys;        /* Keys with clients waiting for data (BLPOP)*/
       dict *ready_keys;           /* Blocked keys that received a PUSH */
       dict *watched_keys;         /* WATCHED keys for MULTI/EXEC CAS */
       int id;                     /* Database ID */
       long long avg_ttl;          /* Average TTL, just for stats */
       unsigned long expires_cursor; /* Cursor of the active expire cycle. */
       list *defrag_later;         /* List of key names to attempt to defrag one by one, gradually. */
   } redisDb;
   ```
   - `expires` -- a dict where keys are pointers to keys in keyspace, values are `long long` UNIX timestamps
     - expungement strategy
       - lazy -- expunge when reading the key
       - periodic -- expunge with a frequency and duration; continue from the last expunged `redisDb`, cycling the db array; examine and expunge keys randomly selected from `expires` for each `redisDb`
     - related commands -- `PEXPIREAT` under the hood
       - `EXPIRE`, `PEXPIRE`, `SETEX` (only for string) -- TTL, in s or ms
       - `EXPIREAT`, `PEXPIREAT` -- UNIX timestamp, in s or ms
       - `TTL`, `PTTL` -- remaining time to live, in s or ms
       - `PERSIST` -- remove timestamp
     - replication related -- key expungement of followers is controlled by the master, who sends `DEL` commands to followers
     - persistence related
       - RDB
         - when `SAVE` or `BGSAVE` -- expired keys filtered
         - when loading data -- master will filter expired keys, followers will not (cleared when syncing with master)
       - AOF
         - when writing to AOF -- when expunged, a `DEL` is explicitly appended
         - when rewriting AOF -- expired keys filtered
   - related commands
     - `FLUSHDB`
     - `RANDOMKEY`
     - `DBSIZE`
     - `EXISTS`
     - `DEL`
     - `RENAME`
     - `KEYS`
     - `INFO`, `INFO STATS`

1. client
   ```cpp
   typedef struct client { // once called redisClient
     uint64_t id;            /* Client incremental unique ID. */
     connection *conn; // fd, connection type, state, flags, callbacks
     // ...
     redisDb *db;            /* Pointer to currently SELECTed DB. */
     robj *name;             /* As set by CLIENT SETNAME. */
     sds querybuf;           /* Buffer we use to accumulate client queries. */
     // ...
     uint64_t flags;         /* Client flags: CLIENT_* macros. */
     // ...
   } client;
   ```
   - query buffer or reply buffer overflow -- the client will be closed
     - hard limit -- close immediately
     - soft limit -- close after the time since `time_t obuf_soft_limit_reached_time` beyond configured, `client-output-buffer-limit` in configurations
   - `querybuf` related fields
     ```cpp
     size_t qb_pos;          /* The position we have read in querybuf. */
     sds pending_querybuf;   /* If this client is flagged as master, this buffer
                                represents the yet not applied portion of the
                                replication stream that we are receiving from
                                the master. */
     size_t querybuf_peak;   /* Recent (100ms or more) peak of querybuf size. */
     int argc;               /* Num of arguments of current command. */
     robj **argv;            /* Arguments of current command. */
     struct redisCommand *cmd, *lastcmd;  /* Last command executed. */
     ```
   - `flags`
     ```cpp
     /* Client flags */
     #define CLIENT_SLAVE (1<<0)   /* This client is a repliaca */
     #define CLIENT_MASTER (1<<1)  /* This client is a master */
     #define CLIENT_MONITOR (1<<2) /* This client is a slave monitor, see MONITOR */
     #define CLIENT_MULTI (1<<3)   /* This client is in a MULTI context */
     #define CLIENT_BLOCKED (1<<4) /* The client is waiting in a blocking operation */
     #define CLIENT_DIRTY_CAS (1<<5) /* Watched keys modified. EXEC will fail. */
     #define CLIENT_CLOSE_AFTER_REPLY (1<<6) /* Close after writing entire reply. */
     #define CLIENT_UNBLOCKED (1<<7) /* This client was unblocked and is stored in
                                       server.unblocked_clients */
     #define CLIENT_LUA (1<<8) /* This is a non connected client used by Lua */
     #define CLIENT_ASKING (1<<9)     /* Client issued the ASKING command */
     #define CLIENT_CLOSE_ASAP (1<<10)/* Close this client ASAP */
     #define CLIENT_UNIX_SOCKET (1<<11) /* Client connected via Unix domain socket */
     // more
     ```
   - more
   - related commands
     - `SELECT`
     - `CLIENT`
       - `LIST`
       - `SETNAME`
       - `KILL`

1. `redisCommand`
   ```cpp
   struct redisCommand {
       char *name;
       redisCommandProc *proc;
       char *sflags;   /* Flags as string representation, one char per flag. */
       uint64_t flags; /* The actual flags, obtained from the 'sflags' field. */
       // ...
       long long microseconds, calls; // statistics
       // ...
   };
   ```
   - `name` -- `client->argv[0]`
   - `proc` -- callback, called as `client->cmd->proc(client)`
   - `sflags`
     - `w` -- write, like `SET`, `RPUSH`, `DEL`
     - `r` -- read, like `GET`, `STRLEN`, `EXISTS`
     - `m` -- 这个命令可能会占用大量内存，执行之前需要先检查服务器的内存使用情况，如果内存紧缺的话就禁止执行这个命令。 like `SET`, `APPEND`, `RPUSH`, `LPUSH`, `SADD`, `SINTERSTORE`
     - more

# Events

1. event loop
   - file events -- sockets
   - time events -- `serverCron`
   - flush AOF buffer

1. file events -- Reactor model, I/O multiplexing, event queuing at event dispatcher
   - event handlers
     - `acceptTcpHandler`
     - `readQueryFromClient`
     - `sendReplyToClient`
     - more
   - tbd

1. time events -- tbd
   - one time scheduled events
   - periodic events
     - `serverCron` -- `hz` in configurations, defaults to 10, update statistics, expunge expired keys, close and clear sessions, AOF and RDB, follower replication, cluster synchronization and heartbeat

1. `serverCron`
   - update tasks
     - update timestamp cache -- timestamp cached in `redisServer.unixtime` and `redisServer.mstime` to reduce system calls for timestamp insensitive tasks like logging, deciding persistence time point, `EXPIRE` and slow query log not included
     - update `redisServer.lruclock` timestamp cache, defaults to once every 10s
     - update stats
   - more tasks

# Publish and Subscribe

1. publish and subscribe
   - channels
     ```cpp
     struct redisServer {
       // ...
       dict *pubsub_channels;  /* channels a client is interested in (SUBSCRIBE) */
       list *pubsub_patterns;  /* patterns a client is interested in (SUBSCRIBE) */
       // ...
     }
     ```
     - `pubsub_channels` -- `dict`, key as channel name, value as a linked list of subscribed clients
     - `pubsub_patterns` -- `list`, `pubsubPattern` as elements
       ```cpp
       typedef struct pubsubPattern {
           client *client;
           robj *pattern;
       } pubsubPattern;
       ```
   - related commands
     - `SUBSCRIBE`
     - `PUBLISH`
     - `PSUBSCRIBE` -- subscribe but support glob-style patterns
     - `PUBSUB`
     - `PUNSUBSCRIBE`
     - `UNSUBSCRIBE`

1. keyspace changes notification
   ```cpp
   void notifyKeyspaceEvent(int type, char *event, robj *key, int dbid)
   ```
   - keyspace event -- every key event in a keyspace, `notify-keyspace-events` in configurations
     - key event -- commands on keys
   - channel name -- prefixed with `__keyspace@<db>__`, like `__keyspace@0__:foo`
   - parameters
     - `event` -- command name, like `del`
     - `key`, `dbid` -- related key and db
     - `type`
       ```cpp
       /* Keyspace changes notification classes. Every class is associated with a
        * character for configuration purposes. */
       #define NOTIFY_KEYSPACE (1<<0)    /* K */
       #define NOTIFY_KEYEVENT (1<<1)    /* E */
       #define NOTIFY_GENERIC (1<<2)     /* g */
       #define NOTIFY_STRING (1<<3)      /* $ */
       #define NOTIFY_LIST (1<<4)        /* l */
       #define NOTIFY_SET (1<<5)         /* s */
       #define NOTIFY_HASH (1<<6)        /* h */
       #define NOTIFY_ZSET (1<<7)        /* z */
       #define NOTIFY_EXPIRED (1<<8)     /* x */
       #define NOTIFY_EVICTED (1<<9)     /* e */
       #define NOTIFY_STREAM (1<<10)     /* t */
       #define NOTIFY_KEY_MISS (1<<11)   /* m (Note: This one is excluded from NOTIFY_ALL on purpose) */
       #define NOTIFY_LOADED (1<<12)     /* module only key space notification, indicate a key loaded from rdb */
       #define NOTIFY_ALL (NOTIFY_GENERIC | NOTIFY_STRING | NOTIFY_LIST | NOTIFY_SET | NOTIFY_HASH | NOTIFY_ZSET | NOTIFY_EXPIRED | NOTIFY_EVICTED | NOTIFY_STREAM) /* A flag */
       ```

# Persistence

1. RDB -- persistence of current snapshot in memory as a compressed binary file
   - expired key handling -- see `redisDb`
   - automatic load -- if AOF switched off, RDB files are loaded automatically at start
   - auto `BGSAVE` -- `save` in configurations, triggered if `redisServer.dirty` more than configured during corresponding configured time duration, executed by `serverCron` function
     - `redisServer.dirty` -- counter for changes to keys since last `SAVE` or `BGSAVE`, for example, the counter will +3 after `SADD` 3 elements on a key
     - `redisServer.lastsave` -- timestamp of last successful `SAVE` or `BGSAVE`
   - RDB file format -- tbd
   - related commands
     - `SAVE` -- blocking
     - `BGSAVE` -- non-blocking in a forked process, but reject other `SAVE`, `BGSAVE`, `BGREWRITEAOF` when executing

1. AOF -- append only file, text file format, recording write commands
   - steps
     - append -- write to buffer `redisServer.aof_buf`, whose type is `sds`
     - write and sync -- at the end of every event loop, `flushAppendOnlyFile` executed, which writes to AOF and sync as `appendfsync` in configurations
   - `appendfsync` in configurations
     - `always` -- also depends on `no-appendfsync-on-rewrite`, which defaults to false
     - `everysec`, default -- if over 1 sec since last sync; by a dedicated thread
     - `no` -- no sync, sync handled by OS
   - AOF loading -- fake client created, from which commands in AOF executed
   - AOF rewrite -- deduplicate AOF, implemented by generating commands from current database state with care for client input buffer overflow
     - avoid blocking -- AOF rewrite is executed in a forked process, new commands during AOF rewrite are simultaneously saved in a separate buffer, which is flushed before the new AOF replace the previous one
   - expired key handling -- see `redisDb`
   - related commands
     - `BGREWRITEAOF` -- non-blocking, but reject `BGSAVE` when executing

# Clustering

1. replication
   - set slave -- `SLAVEOF` command, or `slaveof` in configurations
   - synchronization
     - `SYNC` -- used in old version, slave send `SYNC` to master, the master starts recording commands while `BGSAVE` for RDB file and send it to the slave, the slave load the file, and the master send commands since `BGSAVE` to the slave
     - `PSYNC` -- full resynchronization as `SYNC` for initial replication, partial resynchronization as recovery
     - command propagate -- propagate commands with side effects after `SYNC`
     - heartbeat -- slaves will ping master with `REPLCONF ACK replication_offset` periodically, defaults to 1 Hz, `lag` in the output of `INFO replication`
       - anti-entropy -- reconcile if the `replication_offset` received by master does not match its own, e.g. some command propagate message lost
       - related configurations `min-slaves-to-write`, `min-slaves-max-lag`
   - partial resynchronization implementation -- by replication offset in master and slave, replication backlog in master as buffer, and server ID (run ID)
     - replication offset -- master adds n to its offset upon n bytes propagated, slave adds n to its offset upon n bytes received
     - replication backlog -- fixed size FIFO queue defaults to 1 MB, saving propagated commands; if the command the replication offset in slave points to no longer in the queue, resort to full resynchronization
     - run ID -- slave will persist the ID of the master server, send back to master upon recovering, full resynchronization if not the same master
   - related commands
     - `SLAVEOF`
     - `SYNC`, `PSYNC` -- internal command
     - `REPLCONF`
     - `INFO replication`

1. sentinel -- monitor the cluster and pick new leader
   - available commands -- `PING`, pub/sub etc., see `sentinelcmds[]` in `sentinel.c`
   - configurations -- `sentinel`
   - state
     ```cpp
     /* Main state. */
     struct sentinelState {
         // ...
         uint64_t current_epoch;         /* Current epoch. */
         dict *masters;      /* Dictionary of master sentinelRedisInstances.
                                Key is the instance name, value is the
                                sentinelRedisInstance structure pointer. */
         // ...
     } sentinel;
     ```
     - `sentinelRedisInstance` -- states of master, slave or another sentinel, tbd
   - link -- command link and subscribe link, first established to the master and then slaves
     - channel -- sentinel subscribe by sending command `SUBSCRIBE __sentinel__:hello` via subscribe link once it is established
     - inter-sentinel link -- upon the discovery of other sentinels, command links established mutually
   - heartbeat
     - `INFO` master and slaves -- sentinel will send `INFO` to master in 0.1 Hz, refreshing `run_id` and `slaves` accordingly, for newly added slaves, sentinel will create link to them and send heartbeats in the same manner, and extract `run_id`, `role`, `master_link_status`, `slave_priority`, `slave_repl_offset` etc. from `INFO`
     - make master and slaves `PUBLISH` and piggyback -- sentinel send `PUBLISH` to master and slave, defaults to 0.5 Hz
       ```
       PUBLISH __sentinel__:hello "<s_ip>,<s_port>,<s_runid>,<s_epoch>,<m_name>,<m_id>,<m_port>,<m_epoch>
       ```
       - `s_` for sentinel, `m_` for master
       - loop: perception of other sentinels -- sentinels can `PUBLISH` via command link and receive via their subscription, for piggybacked message, ignore if same ID as self in the message, update states according to the message if other sentinels
     - to master, slaves and other sentinels -- sentinel `PING` other servers in 1 Hz, with possible response `+PONG`, `-LOADING`, `-MASTERDOWN`
       - subjective down -- if no valid response for `down-after-milliseconds` in sentinel configurations, `SRI_S_DOWN` will be ORed to flags; opinion may vary among sentinels
       - objective down -- ask other sentinels, `SRI_S_DOWN` ORed if subjective down for a quorum, `quorum` set in sentinel configurations and can vary among sentinels
         ```
         SENTINEL is-master-down-by-addr <ip> <port> <current_epoch> <run_id_or_star>
         ```
         response, where the last two only used for leader election
         ```
         1) <down_state>
         2) <leader_runid>
         3) <leader_epoch>
         ```
   - sentinel leader election (Raft) -- after master server objective down, a sentinel will `SENTINEL is-master-down-by-addr` to other sentinels but with own `run_id`, the following runs like Raft
   - failover -- after master failure, the leader sentinel selects a slave as the new master by sending `SLAVEOF no one`, then `INFO` in 1 Hz to see if `role` in response becomes `master`, and the `SLAVEOF` other slaves to set the new master, also `SLAVEOF` the old master once it come back
     - master selection -- filter out down slaves, slaves with no response for `INFO` for 5s, slaves whose link with the old master broke for `down-after-milliseconds * 10`; then sort by `slave_priority`, `slave_repl_offset`, `run_id` and choose the best

1. cluster -- database sharing
   - enable cluster -- `cluster-enabled` in configurations, a node can only `SELECT` 0
   - add node to cluster -- three way handshake after `CLUSTER MEET` from the client: `MEET`, `PONG`, `PING`; then disseminate to other nodes via Gossip (heartbeats) to let them handshake the new node
     ```
     CLUSTER MEET <ip> <port>
     ```
   - structures in `cluster.h` -- `clusterNode`, `clusterLink`, `clusterState`
   - slots -- `1 << 14` = 16384 slots, `CLUSTER_FAIL` even if only one slot not handled
     - delegate slots to a node -- `CLUSTER ADDSLOTS`
     - slot state store -- as a `clusterNode` map in `clusterState.slots` and as a bit vector `slots` in `clusterNode` in `clusterState->nodes`
     - broadcast `slots` -- a node will broadcast its `slots` to other nodes, which is kept in `clusterState.slots` and `clusterNode` in `clusterState->nodes`
       ```cpp
       typedef struct clusterState {
           clusterNode *myself;  /* This node */
           // ...
           dict *nodes;          /* Hash table of name -> clusterNode structures */
           dict *nodes_black_list; /* Nodes we don't re-add for a few seconds. */
           clusterNode *migrating_slots_to[CLUSTER_SLOTS];
           clusterNode *importing_slots_from[CLUSTER_SLOTS];
           clusterNode *slots[CLUSTER_SLOTS];
           uint64_t slots_keys_count[CLUSTER_SLOTS];
           rax *slots_to_keys;
           // ...
       } clusterState;
       ```
       ```cpp
       typedef struct clusterNode {
           // ...
           unsigned char slots[CLUSTER_SLOTS/8]; /* slots handled by this node */
           int numslots;   /* Number of slots handled by this node */
           // ...
       } clusterNode;
       ```
     - hash function -- `CRC16(key) & 0x3fff`, command `CLUSTER KEYSLOT`
       - `0x3fff` -- bitmap for a node will be of size 2 KB, which saves bandwidth compared to 65536 slots, and 16384 slots are enough for clusters under 1000 nodes
     - `slots_to_keys` -- slot to key mapping as radix trees, support for commands like `CLUSTER GETKEYSINSLOT`
   - sharding and re-sharding
     - sharding -- execute if the right slot, otherwise redirect the client to the node the slot belongs to by a `MOVE` error
     - re-sharding -- adjust slot distribution and migrate slots
     - migrate slots -- executed online by cluster management utility redis-trib, one slot by one slot
       1. send `CLUSTER SETSLOT <slot> IMPORTING <source_id>` to target node, setting its `clusterState.importing_slots_from[slot]` to source node
       1. send `CLUSTER SETSLOT <slot> MIGRATING <target_id>` to source node, setting its `clusterState.migrating_slots_to[slot]` t target node
       1. send `CLUSTER GETKEYSINSLOT` to source node, for keys responded, send `MIGRATE` to source node; repeat until all keys migrated
       1. send `CLUSTER SETSLOT <slot> NODE <target_id>` to any node to disseminate the information to the cluster
     - command executing when migrating -- if the key does not exist on the source node, send `ASK` error to redirect the client to the target node, and client send `ASKING` to the redirected node before resending command
       - `ASKING` -- turn on `REDIS_ASKING` in `client.flags` for next command; a node will refrain from send `MOVE` error and try to execute the command even if the slot is not delegated to the node if `REDIS_ASKING` on the client and `clusterState.importing_slots_from[slot]` is not `NULL`
   - replication and failover -- use replication for each node and select a slave as the new master if the original master is down
     - set slave -- `CLUSTER REPLICATE`, set `clusterState.myself.slaveof` and turn off `CLUSTER_NODE_MASTER` and turn on `CLUSTER_NODE_SLAVE` `clusterState.myself.flags`, then information disseminated via heartbeats, and other nodes update information in `clusterNode->slaves`, `clusterNode.numslaves`
     - `CLUSTER_NODE_PFAIL` and `CLUSTER_NODE_FAIL`
       - heartbeat and `CLUSTER_NODE_PFAIL` -- nodes (masters and slaves) in cluster will periodically `PING` each other, if no `PONG`, mark `CLUSTER_NODE_PFAIL` (probable fail) for target node in `clusterState.nodes` and disseminate via heartbeat message; upon receiving such message, a node will append to `clusterNode->fail_reports` in `clusterState.nodes`
       - `CLUSTER_NODE_FAIL` -- if a majority of master nodes mark one master node `CLUSTER_NODE_PFAIL`, then that node will be marked `CLUSTER_NODE_FAIL`, and a `FAIL` message will be broadcasted
     - failover -- when the master fails, a slave is elected to `SLAVEOF no one`, cancel slots in the original master and add those slots for itself, then broadcast a `PONG` to inform the cluster
       - new master election -- Raft, other master nodes can vote
   - messages
     - type
       - `MEET`
       - `PING` -- once every second, every node selects 5 other random nodes to `PING`; besides, every node `PING` nodes whose last `PONG` till now is over half of `cluster-node-timeout`
       - `PONG` -- response to `MEET` and `PING`, and voluntary broadcast
       - `FAIL` -- broadcasted ASAP
       - `PUBLISH` -- clients can subscribe to every node, and can also publish to every other node; the current implementation will simply broadcast each published message to all other nodes, but at some point this will be optimized either using Bloom filters or other algorithms
     - header common to all messages -- `clusterMsg` in `cluster.h`, includes the sender's ID, `currentEpoch`, `configEpoch`, flags, slot bitmap, address, master ID, cluster state POV (`CLUSTER_OK` or `CLUSTER_FAIL`)
     - heartbeat -- `PING`, `PONG`, also contain a Gossip section
     - Gossip section -- for `MEET`, `PING` and `PONG` messages, offering a view of ID, last `PING` and `PONG` timestamps, address and flags of a few random nodes from the sender
       ```cpp
       /* PING, MEET and PONG */
       struct {
           /* Array of N clusterMsgDataGossip structures */
           clusterMsgDataGossip gossip[1];
       } ping;
       ```
   - related command `CLUSTER`
     - `MEET`
     - `NODES`
     - `INFO`
     - `ADDSLOTS`, `SETSLOT`
     - `KEYSLOT`
     - `GETKEYSINSLOT`
     - `REPLICATE`

# Transaction

1. transaction -- queue commands and execute them atomically
   - command queue -- all commands except transaction related commands will be validated and queued
     ```cpp
     typedef struct multiState {
         multiCmd *commands;     /* Array of MULTI commands */
         int count;              /* Total number of MULTI commands */
         int cmd_flags;          /* The accumulated command flags OR-ed together.
                                    So if at least a command has a given flag, it
                                    will be set in this field. */
         int cmd_inv_flags;      /* Same as cmd_flags, OR-ing the ~flags. so that it
                                    is possible to know if all the commands have a
                                    certain flag. */
         int minreplicas;        /* MINREPLICAS for synchronous replication */
         time_t minreplicas_timeout; /* MINREPLICAS timeout as unixtime. */
     } multiState;
     typedef struct client {
         // ...
         multiState mstate;      /* MULTI/EXEC state */
         // ...
     } client;
     ```
   - optimistic lock -- `WATCH`, transaction aborted if any `WATCH`ed key is modified before `EXEC`
     - implementation -- `redisDb->watched_keys`, `dict` of key to client linked list; add `CLIENT_DIRTY_CAS` in `client.flags` if a command with `w` in `redisCommand.sflags` modified watched keys
   - ACID -- guaranteed by single thread, except durability
     - force durability -- `SAVE` before `EXEC`, but low performance

1. non-transactional pipeline -- batch commands but not in a transaction

1. related commands
   - `MULTI` -- start transaction, `CLIENT_MULTI` in `client.flags`
   - `EXEC` -- commit
   - `WATCH`, `UNWATCH`
   - `DISCARD`

# Other

1. config
   - config file -- `/etc/redis/redis.conf`
   - related commands
     - `CONFIG`

1. eviction when `maxmemory`
   - `volatile-lru` -- 从已设置过期时间的数据集中挑选最近最少使用的数据淘汰
   - `volatile-ttl` -- 从已设置过期时间的数据集中挑选将要过期的数据淘汰
   - `volatile-random` -- 从已设置过期时间的数据集中任意选择数据淘汰
   - `allkeys-lru` -- 从所有数据集中挑选最近最少使用的数据淘汰
   - `allkeys-random` -- 从所有数据集中任意选择数据进行淘汰
   - `noeviction` -- 禁止驱逐数据

1. Lua
   - create Lua environment
     1. 创建一个基础的 Lua 环境 by `lua_open`， 之后的所有修改都是针对这个环境进行的。
     1. 载入多个函数库到 Lua 环境里面， 让 Lua 脚本可以使用这些函数库来进行数据操作。 -- tbd
     1. 创建全局表格 `redis` ， 这个表格包含了对 Redis 进行操作的函数， 比如用于在 Lua 脚本中执行 Redis 命令的 `redis.call` 函数。
     1. 使用 Redis 自制的随机函数来替换 Lua 原有的带有副作用的随机函数， 从而避免在脚本中引入副作用。
     1. 创建排序辅助函数， Lua 环境使用这个辅佐函数来对一部分 Redis 命令的结果进行排序， 从而消除这些命令的不确定性。
     1. 创建 `redis.pcall` 函数的错误报告辅助函数， 这个函数可以提供更详细的出错信息。
     1. 对 Lua 环境里面的全局环境进行保护， 防止用户在执行 Lua 脚本的过程中， 将额外的全局变量添加到了 Lua 环境里面。
     1. 将完成修改的 Lua 环境保存到服务器状态的 `lua` 属性里面， 等待执行服务器传来的 Lua 脚本。
   - `redis.call` and `redis.pcall` -- executed by `redisServer.lua_client`
   - SHA1
     - as key -- `redisServer->lua_scripts`, which is `dict` with SHA1 as key, function body as value
     - as Lua function name -- function `f_<SHA1>()` is defined with the arguments of `EVAL`
   - script executing -- tbd
   - related commands
     - `EVAL`
     - `EVALSHA`
     - `SCRIPT`

1. slow log
   - configurations -- `slowlog-log-slower-than`, `slowlog-max-len`
   - log entry id -- `long long` `redisServer.slowlog_entry_id`, +1 every time
   - tbd
   - related commands
     - `SLOWLOG`
       - `GET`

1. `MONITOR` -- a debugging command that streams back every command processed by the Redis server
   - `client.flags` -- `REDIS_MONITOR`
