# Redis

## Introduction

1. Redis — REmote DIctionary Server

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

1. online CLI — on redis.io, like [DEL – Redis](https://redis.io/commands/del)

1. CLI
   - `redis-server`
     - `redis-sentinel`
   - `redis-cli` — [tbd](https://redis.io/topics/rediscli)
   - `redis-benchmark` — [tbd](https://redis.io/topics/benchmarks)
   - `redis-trib`

## Data Types And Data Structures

### Data Structures

1. string
   - `c_str` — used in string literal, like when `serverLog`
   - simple dynamic string, SDS — used as keys, `OBJ_STRING`, and buffers
     ```c
     struct sdshdr { // old implementation
         unsigned int len; // 记录 buf 数组中已使用字节的数量
         unsigned int free; // 记录 buf 数组中未使用字节的数量
         char buf[]; // c_str, '\0' ended, which is not counted in len
     };
     ```
     - capacity grow policy — if `len` < 1 MB, `free` = `len`; else, `free` = 1 MB
     - lazy reclaim of `free` — reclaim on demand
     - binary-safe — `len` as end, instead of `'\0'` as end
       - `'\0'` as end — for C API reuse, partially supported
     - new version, simplified
       ```c
       // also sdshdr8, sdshdr16, sdshdr64 for uint8_t, uint16_t, uint64_t
       struct sdshdr32 {
           uint32_t len; /* used, `\0` not counted */
           uint32_t alloc; /* excluding the header and null terminator */
           // #define SDS_TYPE_8  1 ... #define SDS_TYPE_64 4
           unsigned char flags; /* 3 lsb of type, 5 unused bits */
           char buf[]; // c_str, '\0' ended, which is not counted in len
       };
       ```
       - max `alloc` — 0.5 GB

1. dictionary, hash table — used in `OBJ_HASH` and database implementation, and more
   ```c
   typedef struct dict {
       dictType *type; // functions for a specific type
       void *privdata; // parameter for functions in dictType
       dictht ht[2];
       long rehashidx; /* rehashing not in progress if rehashidx == -1 */
       unsigned long iterators; /* number of iterators currently running */
   } dict;
   ```
   - `dictType` — `setDictType`, `zsetDictType`, `dbDictType`, etc. predefined in `server.c`
     ```c
     typedef struct dictType {
         uint64_t (*hashFunction)(const void *key);
         void *(*keyDup)(void *privdata, const void *key);
         void *(*valDup)(void *privdata, const void *obj);
         int (*keyCompare)(void *privdata, const void *key1, const void *key2);
         void (*keyDestructor)(void *privdata, void *key);
         void (*valDestructor)(void *privdata, void *obj);
     } dictType;
     ```
   - `dictht` — dictionary hash table
     ```c
     typedef struct dictht {
         dictEntry **table;
         unsigned long size; // capacity
         unsigned long sizemask; // size - 1
         unsigned long used;
     } dictht;
     ```
     - `dictEntry` — key-value pair
       ```c
       typedef struct dictEntry {
           void *key;
           union {
               void *val;
               uint64_t u64;
               int64_t s64;
               double d;
           } v;
           struct dictEntry *next;
       } dictEntry;
       ```
     - hash value — `hashFunction(key) & sizemask`
     - hash collision — chaining with `*next`, new nodes added at head
   - rehash
     - expand — when not executing `BGSAVE` or `BGREWRITEAOF` and load factor >= 1, or when executing either one and load factor >= 5; expand to the size of the first 2^n that >= `ht[0].used * 2`
     - shrink — when load factor < 0.1; shrink to the size of the first 2^n that >= `ht[0].used`
     - progressive rehash — set `rehashidx` to 0, and increment by 1 for every CRUD operation, reset to -1 when completed and swap `ht[0]` and `ht[1]`

1. skiplist — used in `OBJ_ZSET`
   ```c
   typedef struct zskiplist {
       struct zskiplistNode *header, *tail;
       unsigned long length;
       int level;
   } zskiplist;
   ```
   - `zskiplistNode`
     ```c
     typedef struct zskiplistNode {
         sds ele;
         double score;
         struct zskiplistNode *backward;
         struct zskiplistLevel {
             struct zskiplistNode *forward;
             unsigned long span; // rank starting from 1
         } level[];
     } zskiplistNode;
     ```
     - level — height generated between 1 to 32 according to power law
     - score — for sort, ascending, sort by `ele` lexicographically when equality

1. int set — encoding-adapting ordered distinct array, used in `OBJ_SET` if the cardinality is low
   ```c
   typedef struct intset {
       uint32_t encoding;
       uint32_t length;
       int8_t contents[]; // ordered
   } intset;
   ```
   - add element — O(N)
     - space saving — `contents` is of the smallest encoding possible, upgrade and reallocate if necessary
     - upgrade — if one encoding not enough, upgrade encoding of `contents` from `INTSET_ENC_INT16` to `INTSET_ENC_INT32` to `INTSET_ENC_INT64`, new element added at head or tail

1. list — doubly linked list, used internally such as struct fields
   ```c
   typedef struct listNode {
       struct listNode *prev;
       struct listNode *next;
       void *value;
   } listNode;
   typedef struct list {
       listNode *head;
       listNode *tail;
       void *(*dup)(void *ptr); // duplication
       void (*free)(void *ptr);
       int (*match)(void *ptr, void *key); // comparison
       unsigned long len;
   } list;
   ```

1. ziplist — a sequential data structure that is continuous on memory (`unsigned char` array), used in `OBJ_LIST` and `OBJ_HASH`
   ```
   zlbytes zltail zllen [entries] zlend
    4b       4b    2b              0xFF
   ```
   - `zlbytes` — total size
   - `zltail` — offset between the start of the ziplist and the start of the last entry
   - `zllen` — total entry count, can only hold within `UINT16_MAX`
   - `zlend` — end mark
   - entry — a byte array or a number
     ```
     previous_entry_length encoding content
     ```
     - `previous_entry_length` — 1 byte when < `0xFE` otherwise 5 byte starting with `0xFE`, for iterating
     - `encoding` — type and length of `content`
     - operations like push an entry — O(N), the possibility of long cascade update is low, which needs consecutive entries of length between 250 to 253b
       - cascade update — `previous_entry_length` of an entry updates from 1b to 5b, triggering the `previous_entry_length` update of the next entry, O(N^2) in the worst case

1. quicklist — doubly linked list of ziplists, used in `OBJ_LIST`, tbd

1. listpack — `unsigned char` array like ziplist, designed to replace ziplist, currently only used in `OBJ_STREAM`, tbd

1. radix tree — used in `OBJ_STREAM` and more, tbd

1. zipmap — String -> String Map data structure optimized for size
   ```
   <zmlen><len>"foo"<len><free>"bar"<len>"hello"<len><free>"world"
   ```

### Data Types

1. object — wrapper for data structures, with timestamp, with reference count for object sharing and GC
   ```c
   #define LRU_BITS 24
   typedef struct redisObject {
       unsigned type:4;
       unsigned encoding:4;
       unsigned lru:LRU_BITS; /* LRU time (relative to global lru_clock) or
                               * LFU data (least significant 8 bits frequency
                               * and most significant 16 bits access time). */
       int refcount;
       void *ptr;
   } robj;
   ```
   - `type` — `OBJ_STRING`, `OBJ_LIST`, `OBJ_SET`, `OBJ_ZSET`, `OBJ_HASH`, `OBJ_MODULE`, `OBJ_STREAM`
   - `encoding`
     ```c
     #define OBJ_ENCODING_RAW 0     /* Raw representation */
     #define OBJ_ENCODING_INT 1     /* Encoded as integer */
     #define OBJ_ENCODING_HT 2      /* Encoded as hash table */
     #define OBJ_ENCODING_ZIPMAP 3  /* Encoded as zipmap */
     #define OBJ_ENCODING_LINKEDLIST 4 /* No longer used: old list encoding. */
     #define OBJ_ENCODING_ZIPLIST 5 /* Encoded as ziplist */
     #define OBJ_ENCODING_INTSET 6  /* Encoded as intset */
     #define OBJ_ENCODING_SKIPLIST 7  /* Encoded as skiplist */
     #define OBJ_ENCODING_EMBSTR 8  /* Embedded sds string encoding */
     #define OBJ_ENCODING_QUICKLIST 9 /* Encoded as linked list of ziplists */
     #define OBJ_ENCODING_STREAM 10 /* Encoded as a radix tree of listpacks */
     ```
   - polymorphism — the same command works for different types and/or encodings
   - GC — reference counting
   - `lru` — last accessed timestamp, see [Other](#other)
   - flyweight — for integers from 0 to 9999
   - empty collections — when add like `LPUSH`, an empty collection is prepared; empty collections will be garbage collected, except stream; read commands like `LLEN` and some write commands on an empty key behave like an empty collection held on the key
   - related commands
     - `OBJECT subcommand [arguments [arguments ...]]` — see `OBJECT HELP`
       - `OBJECT ENCODING`
       - `OBJECT REFCOUNT`
       - `OBJECT IDLETIME`
       - `OBJECT FREQ` — available when `maxmemory-policy` is set to an LFU policy
       - `DEBUG OBJECT`
     - `TYPE`
     - see [`redisDb`](#server-and-client)

1. `OBJ_STRING`
   - corresponding `encoding`
     - `OBJ_ENCODING_INT` — `long long`, for numbers within range
     - `OBJ_ENCODING_EMBSTR` — an object where the sds string is actually an unmodifiable string allocated in the same chunk as the object itself, used when string length <= 44 bytes (`OBJ_ENCODING_EMBSTR_SIZE_LIMIT`) and when `long double`
     - `OBJ_ENCODING_RAW` — SDS, used when string length > 44 bytes
   - related commands
     - plain set and get
       - `SET key value [EX seconds|PX milliseconds|KEEPTTL] [NX|XX] [GET]`
         - `GETSET`
         - `SETEX`, `PSETEX`
         - `SETNX`
       - `MSET`
         - `MSETNX` — no operation even if just one single key already exists
       - `GET`, `MGET`
     - `APPEND` — amortized O(1)
     - `INCRBY`, `DECRBY`, `INCR`, `DECR` — only for signed 64 bit, start with 0 if key does not exist
       - `INCRBYFLOAT` — output precision fixed to 17 digits
     - `SETRANGE`, `GETRANGE` — zero byte padded
     - `BITFIELD` — capable of addressing specific integer fields of varying bit widths and arbitrary non (necessary) aligned offset
     - `STRLEN`
     - `STRALGO LCS`

1. data structure with `redisObject.type` of `OBJ_STRING`
   - bitmap
     - implementation — like `java.util.BitSet`, but one byte (`char`) each word
     - related commands
       - `SETBIT`
       - `GETBIT`
       - `BITCOUNT`
       - `BITOP` — `AND`, `OR`, `XOR` and `NOT`
       - `BITPOS` — return the position of the first bit set to 1 or 0 in a string
   - HyperLogLog — probabilistic, count unique elements like a set, memory footprint of 12KB in worst case, standard error of 0.81%
     - implementation — [HyperLogLog - Wikipedia](https://en.wikipedia.org/wiki/HyperLogLog), [`hyperloglog.c`](https://github.com/redis/redis/blob/c1aaad06d85c89ab7abebd5cefab026bdcb086ab/src/hyperloglog.c#L37-L180), [redis.io](https://redis.io/commands/pfcount#hyperloglog-representation)
       - sparse representation
       - dense representation
       - `PFCOUNT` cache — last 8 bytes encode the latest computed cardinality for caching purposes
     - related commands
       - `PFADD`
       - `PFCOUNT` — slow if merge
       - `PFMERGE`

1. `OBJ_LIST`
   - corresponding `encoding`
     - `OBJ_ENCODING_ZIPLIST` — when each element size < 64 bytes and list size < 512, `list-max-ziplist-value` and `list-max-ziplist-entries` in configurations
     - `OBJ_ENCODING_QUICKLIST` — `list-max-ziplist-size`, `list-compress-depth` in configurations
   - related commands
     - `LPUSH`, `RPUSH`
       - `LPUSHX`, `RPUSHX` — no operation if key does not exist
     - `LPOP`, `RPOP` — `null` when empty
       - `BRPOP`, `BLPOP` — block with timeout (infinitely if `0`) when all keys are empty, first come first serve for clients
     - `LSET`
     - get
       - `LINDEX` — get by index
       - `LRANGE` — inclusive, support `-1`
     - `LLEN`
     - find
       - `LINSERT` — find and insert
       - `LPOS` — find
       - `LREM`
     - `LTRIM key start stop`
     - `LMOVE source destination LEFT|RIGHT LEFT|RIGHT` — since 6.2.0, can be used for reliable queue and circular list
       - `BLMOVE`
       - `RPOPLPUSH`, `BRPOPLPUSH`

1. `OBJ_HASH`
   - corresponding `encoding`
     - `OBJ_ENCODING_ZIPLIST` — when all keys and values < 64 bytes, and list size < 512, `hash-max-ziplist-value` and `hash-max-ziplist-entries` in configurations
       - difference with top level keystore — use more small hashes with fields in lieu of keys to save memory, but no functions like `EXPIRE` for fields
     - `OBJ_ENCODING_HT`
   - related commands
     - `HSET`, `HSETNX`
       - `HMSET`, deprecated
     - `HGET`, `HMGET`, `HGETALL`
     - `HEXISTS`
     - `HDEL`
     - `HLEN`
     - `HINCRBY`, `HINCRBYFLOAT`
     - `HSTRLEN`
     - `HKEYS`, `HVALS`
     - `HSCAN`

1. `OBJ_SET`
   - corresponding `encoding`
     - `OBJ_ENCODING_INTSET` — when only integer elements and cardinality < 512, `set-max-intset-entries` in configurations
     - `OBJ_ENCODING_HT` — `setDictType`, `null` as value
   - related commands
     - `SADD`
     - `SCARD`
     - between sets
       - `SDIFF key [key ...]`, `SDIFFSTORE destination key [key ...]`
       - `SINTER key [key ...]`, `SINTERSTORE`
       - `SUNION`, `SUNIONSTORE`
       - `SMOVE`
     - `SISMEMBER`, `SMISMEMBER`
     - `SMEMBERS`
     - `SPOP` — Knuth sampling and Floyd sampling, not uniform distribution
     - `SRANDMEMBER` — bucket based: an element alone in a bucket is much more likely to be returned than an element in a bucket with chained elements
     - `SREM`
     - `SSCAN`

1. `OBJ_ZSET` — ordered set, sort by `memcmp()` if score is the same
   - corresponding `encoding`
     - `OBJ_ENCODING_ZIPLIST` — when cardinality < 128 and all elements < 64 bytes, `zset-max-ziplist-entries` and `zset-max-ziplist-value` in configurations
     - `OBJ_ENCODING_SKIPLIST` — use `zset`: like `java.util.LinkedHashMap` but with skiplist in lieu of linked list
       ```c
       typedef struct zset {
           zskiplist *zsl;
           dict *dict; // member to score
       } zset;
       ```
   - use
     - graph query — [Hexastore](https://redis.io/topics/indexes#representing-and-querying-graphs-using-an-hexastore)
     - [multi dimensional index](https://redis.io/topics/indexes#multi-dimensional-indexes)
   - related commands
     - `ZADD key [NX|XX] [GT|LT] [CH] [INCR] score member [score member ...]`
     - count
       - `ZCARD` — cardinality
       - `ZCOUNT key min max`
       - `ZLEXCOUNT key min max`
     - `ZSCORE`, `ZMSCORE` — get score
     - get members by range
       - `ZRANGE key start stop [WITHSCORES]`, `ZREVRANGE` — get members by index, inclusive ranges, can be `-1`
       - `ZRANGEBYLEX`, `ZREVRANGEBYLEX` — `(`, `[` prefixed ranges, or `+` and `-`
       - `ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]`, `ZREVRANGEBYSCORE` — inclusive ranges, `(` for exclusive, can be `-inf`, `+inf`, can be used for weighted random selection of an element
     - `ZRANK`, `ZREVRANK`
     - remove
       - `ZREM`
       - `ZREMRANGEBYLEX`
       - `ZREMRANGEBYRANK`
       - `ZREMRANGEBYSCORE`
     - intersection, union
       - `ZINTER`, `ZINTERSTORE`
       - `ZUNION`, `ZUNIONSTORE`
     - `ZINCRBY key increment member`
     - `ZPOPMAX key [count]`, `ZPOPMIN` — a `count` value that is higher than the sorted set's cardinality will not produce an error
       - `BZPOPMAX`, `BZPOPMIN`
     - `ZSCAN`
     - lexicographically — `ZRANGEBYLEX`, `ZREVRANGEBYLEX`, `ZREMRANGEBYLEX` and `ZLEXCOUNT`
       - if different score — if the elements in the sorted set have different scores, the returned elements are unspecified

1. Geo related — of type `OBJ_ZSET`
   - [Geohash - Wikipedia](https://en.wikipedia.org/wiki/Geohash) — latitude and longitude bits are interleaved in order to form an unique 52 bit integer, which does not lose precision when converted to `double`
   - limitation — areas very near to the poles are not indexable; radiuses are approximated by perfect sphere model
   - related commands
     - `GEOADD key longitude latitude member [longitude latitude member ...]`
     - `GEODIST`
     - `GEOHASH` — standard Geohash instead of the Redis internal one
     - `GEOPOS` — return the positions (longitude,latitude)
     - `GEORADIUS` — get members within a specified circle
     - `GEORADIUSBYMEMBER` — like `GEORADIUS` but the center of the circle is the specified member
     - delete — `ZREM`

1. `OBJ_STREAM` — log data structure, append only, allow consumers block waiting and has consumer groups, since 5.0
   - corresponding `encoding` - `OBJ_ENCODING_STREAM`, radix tree of listpacks
     ```c
     typedef struct stream {
         rax *rax;               /* The radix tree holding the stream. */
         uint64_t length;        /* Number of elements inside this stream. */
         streamID last_id;       /* Zero if there are yet no items. */
         rax *cgroups;           /* Consumer groups dictionary: name -> streamCG */
     } stream;
     ```
     - `streamID` — `<millisecondsTime>-<64b-sequenceNumber>`, monotonically incrementing, usually auto generated by passing `*`
       ```c
       /* Stream item ID: a 128 bit number composed of a milliseconds time and
        * a sequence counter. IDs generated in the same millisecond (or in a past
        * millisecond if the clock jumped backward) will use the millisecond time
        * of the latest generated ID and an incremented sequence. */
       typedef struct streamID {
           uint64_t ms;        /* Unix time in milliseconds. */
           uint64_t seq;       /* Sequence number. */
       } streamID;
       ```
       - special forms in some commands — `*`, `+`, `-`, `$`, `>`, see below
   - use
     - fan out messages to multiple clients — multiple consumers see the new messages appended to the stream (the same way many `tail -f` processes can see what is added to a log)
     - time series store — get messages by ranges of time, or alternatively to iterate the messages using a cursor to incrementally check all the history; consumers will know what is a new message by remembering last `streamID`
     - consumer groups, like in Kafka but logical partitions — a stream of messages that can be partitioned to multiple consumers, possible to scale the message processing across different consumers; explicit acknowledgment of processed items, ability to inspect the pending items, claiming of unprocessed messages, and coherent history visibility for each single client
       - latency — minimal, before returning to the event loop both the client calling `XADD` and the clients blocked to consume messages, will have their reply in the output buffers
   - consumer group — like a pseudo consumer that gets data from a stream, and actually serves multiple consumers; within a consumer group:
     ```
     +----------------------------------------+
     | consumer_group_name: mygroup           |
     | consumer_group_stream: somekey         |
     | last_delivered_id: 1292309234234-92    |
     |                                        |
     | consumers:                             |
     |    "consumer-1" with pending messages  |
     |       1292309234234-4                  |
     |       1292309234232-8                  |
     |    "consumer-42" with pending messages |
     |       ... (and so forth)               |
     +----------------------------------------+
     ```
     - stable consumer name — consumers identified by case-sensitive names, which stay unchanged even after reconnection
     - cursor — each consumer group has the concept of the first ID never consumed
     - explicit consumer ACK — consuming a message requires an explicit acknowledgment using `XACK`, then Redis can evict ACKed message from the consumer group
     - pending tracked — a consumer group tracks all the messages that are currently pending, i.e. delivered but not yet ACKed messages
     - one message one customer
   - observability — see `XINFO`, get info like who is consuming messages, what messages are pending, the set of consumer groups active in a given stream
     - dead letter — when delivery count is abnormally height, it is probably wiser to put such messages in another stream and send a notification to the system administrator
   - zero-length streams — zero-length stream keys are not deleted in contrast to keys of other collections, to preserve the state of customer groups
   - related commands
     - `XADD key ID field value [field value ...]`
       - `MAXLEN` option — capped stream, with `~` for approximated cap but more efficient
     - `XTRIM key MAXLEN [~] count`
     - `XDEL` — mark delete
     - `XLEN`
     - `XRANGE key start end [COUNT count]`, `XREVRANGE`
       - special `streamID` — `-`, `+`
       - iterate — streamID which is `streamID.seq + 1` from previous returned `streamID` as `start`, and `+` as `end`, with `COUNT` limit
     - `XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]`
       - `$` as `id` — the maximum ID already stored in the stream
       - `BLOCK` — block until any listened `key` has new data, and blocking clients are FIFO
     - `XINFO STREAM`, `XINFO HELP`
     - consumer group
       - `XREADGROUP` — `XREAD` consumer group version, not a readonly command due to side effects
         ```
         XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] ID [ID ...]
         ```
         - special `ID` `>` — messages never delivered to other consumers so far
         - other valid `ID` — return pending messages
       - `XGROUP` — create, destroy and manage consumer groups
         - consumer auto creation — consumers are auto-created the first time they are mentioned, no need for explicit creation
       - `XACK`
       - `XPENDING` — inspect the list of pending messages, specify range to see idle time and delivery count
       - `XCLAIM` — changes the ownership of a pending message to the specified customer, claiming a message will reset its idle time, also increment its delivery count if not `JUSTID`; can be used in case of permanent consumer failure
       - `XINFO` — see `XINFO HELP`
         - `XINFO CONSUMERS key groupname`
         - `XINFO GROUPS key`

### Sort

1. sort
   ```c
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
     redis> SADD fruits "apple" "banana" "cherry"
     redis> MSET apple-price 8 banana-price 5.5 cherry-price 7
     redis> SORT fruits BY *-price
     ```
   - related commands
     - `SORT`
       ```
       SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
       ```
       - `ALPHA` — lexicographically
       - `ASC`, `DESC`
       - `BY`
       - `LIMIT`
       - `GET` — get pattern
       - `STORE`

## Server and Client

1. server
   ```c
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
   - `dbnum` — defaults to 16, `database` in configurations
   - maintainence when reading or writing a keyspace
     - maintain statistics, like `stat_keyspace_hits`, `stat_keyspace_misses`
     - update `redisObject.lru`
     - delete a key if expired
     - mark `WATCH`ed keys dirty
     - increment `dirty` counters
     - dispatch notifications
   - related commands
     - `INFO [section]`
       - `INFO server`, `INFO clients`
       - `INFO stats`
       - more
       - `CONFIG RESETSTAT`
       - `DBSIZE`
     - `SHUTDOWN [NOSAVE|SAVE]`
     - `DEBUG SEGFAULT`
     - `TIME`
     - `SWAPDB index1 index2` — swap db index
     - `MOVE key db` — between `redisServer.db`
     - `FLUSHALL`

1. `redisDb`
   ```c
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
   - `expires` — a dict where keys are pointers to keys in keyspace, values are `long long` UNIX timestamps
     - expungement strategy
       - lazy — expunge when reading the key
       - periodic — expunge in some frequency with a time limit, continue from the last expunged `redisDb`, cycling `redisServer.db` array: examine and expunge 20 keys randomly selected from `redisDb->expires` until no more than 25% of selected 20 keys expunged
     - key expiration in replicas — key expungement of followers is controlled by the master, who sends `DEL` commands to followers
     - persistence related
       - RDB
         - when `SAVE` or `BGSAVE` — expired keys filtered
         - when loading data — master will filter expired keys, followers will not (cleared when syncing with master)
       - AOF
         - when writing to AOF — when expunged, a `DEL` is explicitly appended
         - when rewriting AOF — expired keys filtered
     - related commands — `PEXPIREAT` under the hood
       - `EXPIRE`, `PEXPIRE`, `SET` — TTL, in s or ms, untouched by altering commands like `INCR`, `LPUSH`, `HSET`, `RENAME`, overwritten for other write commands
       - `EXPIREAT`, `PEXPIREAT` — UNIX timestamp, in s or ms
       - `TTL`, `PTTL` — remaining time to live, in s or ms
       - `PERSIST` — remove expiration
   - related commands
     - `DEL`
       - `UNLINK` — GC left to do, asynchronously in another thread
     - `DUMP`, `RESTORE` — serialize and deserialize, format is opaque and non-standard, with checksum and values are encoded in the same format used by RDB with RDB version
       - `MIGRATE` — see [Clustering](#clustering)
     - `KEYS pattern` — support more glob pattern
     - `EXISTS key [key ...]`, `TOUCH key [key ...]`
     - `FLUSHDB` — delete all the keys
     - `RANDOMKEY`
     - `DBSIZE`
     - `RENAME`, `RENAMENX`
     - `SCAN` — incrementally iterate over a collection of elements

1. `redisCommand`
   ```c
   struct redisCommand {
       char *name;
       redisCommandProc *proc;
       int arity;
       char *sflags;   /* Flags as string representation, one char per flag. */
       uint64_t flags; /* The actual flags, obtained from the 'sflags' field. */
       // ...
       long long microseconds, calls; // statistics
       // ...
   };
   ```
   - `name` — `client->argv[0]`
   - `proc` — callback, called as `client->cmd->proc(client)`
   - `sflags` — see [redis.io](https://redis.io/commands/command#flags), and [`server.c`](https://github.com/redis/redis/blob/25f457c7f69e7f0254cc5d585eadd784dd30d91c/src/server.c#L113-L180)
     - `write` — write, like `SET`, `RPUSH`, `DEL`
     - `read-only` — read, like `GET`, `STRLEN`, `EXISTS`
     - `use-memory` — may increase memory usage once called, don't allow if out of memory, like `SET`, `APPEND`, `RPUSH`, `LPUSH`, `SADD`, `SINTERSTORE`
     - more
   - related commands
     - `COMMAND` — details about all Redis commands
     - `COMMAND COUNT`
     - `COMMAND INFO command-name [command-name ...]` — `COMMAND` for specific commands
     - `COMMAND GETKEYS` — keys parsed from a full Redis command

1. client
   ```c
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
   - query buffer (hard non-configurable limit) or reply buffer overflow — the client will be closed
     - hard limit — close immediately
     - soft limit — close after the time elapsed since `client.obuf_soft_limit_reached_time` is beyond the configured, `client-output-buffer-limit` in configurations
   - `querybuf` related fields
     ```c
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
     ```c
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
   - client side caching — see [Publish and Subscribe](#publish-and-subscribe)
   - more
   - related commands
     - `SELECT`
     - `ECHO`
     - `PING`
     - `QUIT`
     - `MONITOR` — a debugging command that streams back every command processed by the Redis server, `CLIENT_MONITOR` in `client.flags`
     - `CLIENT`
       - `CLIENT LIST`
       - `CLIENT GETNAME`, `CLIENT SETNAME`
       - `CLIENT KILL`
       - `CLIENT ID` — runtime unique and logical clock in terms of the time connected to the server
       - `CLIENT PAUSE` — suspend all the Redis clients for the specified amount of time (in milliseconds)
       - `CLIENT REPLY ON|OFF|SKIP`
       - `CLIENT UNBLOCK`
       - client caching related commands, see [Publish and Subscribe](#publish-and-subscribe)

## Events

1. event loop, `aeMain` in `ae.c` — [zhihu](https://zhuanlan.zhihu.com/p/144805500)
   - steps
     1. in `beforesleep` call back
        1. cluster and persistence logics like flush AOF buffer
        1. `writeToClient`
     1. `epoll_wait`
     1. file events — sockets
     1. time events
   - limitations
     - single core
     - big key throttling

1. file events — Reactor model, I/O multiplexing, event queuing at event dispatcher
   - event handlers
     - `acceptTcpHandler`
     - `readQueryFromClient`
     - `sendReplyToClient`
     - more
   - tbd

1. time events — tbd
   - one time scheduled events
   - periodic events `serverCron` — `hz` in configurations, defaults to 10, update statistics, expunge expired keys, close and clear sessions, AOF and RDB, follower replication, cluster synchronization and heartbeat
     - update tasks
       - update timestamp cache — timestamp cached in `redisServer.unixtime` and `redisServer.mstime` to reduce system calls for timestamp insensitive tasks like logging, deciding persistence time point, `EXPIRE` and slow query log not included
       - update `redisServer.lruclock` timestamp cache, defaults to once every 10s
       - update stats
     - more tasks

1. multithread IO, since 6.0 — [zhihu](https://zhuanlan.zhihu.com/p/144805500), dispatch tasks to IO threads for `read()` and `write()` system calls, main thread also does one tasks and spinning waiting for the completion of IO threads

## Publish and Subscribe

1. publish and subscribe
   - channels
     ```c
     struct redisServer {
         // ...
         /* Pubsub */
         dict *pubsub_channels;  /* Map channels to list of subscribed clients */
         list *pubsub_patterns;  /* A list of pubsub_patterns */
         dict *pubsub_patterns_dict;  /* A dict of pubsub_patterns */
         int notify_keyspace_events; /* Events to propagate via Pub/Sub. This is an
                                        xor of NOTIFY_... flags. */
         // ...
     };
     ```
     ```c
     typedef struct client {
         // ...
         dict *pubsub_channels;  /* channels a client is interested in (SUBSCRIBE) */
         list *pubsub_patterns;  /* patterns a client is interested in (SUBSCRIBE) */
         // ...
     } client;
     ```
     - `pubsub_channels` — `dict`, key as channel name, value as a linked list of subscribed clients
     - `pubsub_patterns` — `list`, `pubsubPattern` as elements
       ```c
       typedef struct pubsubPattern {
           client *client;
           robj *pattern;
       } pubsubPattern;
       ```
   - related commands
     - `SUBSCRIBE`
     - `PSUBSCRIBE` — glob-style pattern subscribe
     - `PUBLISH channel message` — O(N+M) where N is the number of clients subscribed to the receiving channel and M is the total number of subscribed patterns (by any client)
     - `PUBSUB` — inspect the state of the Pub/Sub subsystem
       - `PUBSUB CHANNELS [pattern]`
       - `PUBSUB NUMSUB [channel-1 ... channel-N]`
       - `PUBSUB NUMPAT`
     - `UNSUBSCRIBE`
     - `PUNSUBSCRIBE`

1. keyspace event notifications
   ```c
   void notifyKeyspaceEvent(int type, char *event, robj *key, int dbid)
   ```
   - event — all the commands generate events only if the target key is really modified, `notify-keyspace-events` in configurations
     - keyspace event — every key event in a keyspace
     - key event — commands on keys
   - channel name
     - key-space notification — prefixed with `__keyspace@<db>__`, like `__keyspace@0__:foo`
     - key-event notification — prefixed with `__keyevent@<db>__`
     - example — when `DEL` `mykey`
       ```
       PUBLISH __keyspace@0__:mykey del
       PUBLISH __keyevent@0__:del mykey
       ```
     - test — use below `redis-cli` and another `redis-cli` to send key commands
       ```shell
       $ redis-cli config set notify-keyspace-events KEA
       $ redis-cli --csv psubscribe '__key*__:*'
       Reading messages... (press Ctrl-C to quit)
       "psubscribe","__key*__:*",1
       ```
   - node-specific in a cluster — keyspace event notifications not broadcasted in a cluster to receive all keyspace events of a cluster, clients need to subscribe to all nodes
   - parameters
     - `event` — command name, like `del`
     - `key`, `dbid` — related key and db
     - `type` — `redisServer.notify_keyspace_events`, at least `K` or `E` should present in `notify-keyspace-events` otherwise no event
       ```c
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

1. tracking — assist client caching, since 6.0, specific improvement for the practice of leveraging the Pub/Sub system in order to send invalidation messages to invalidate stale cache
   - src — `tracking.c`, tbd
   - two modes
     - default — the server remembers what keys a given client accessed in the tracking table, and send invalidation messages when the same keys are modified or evicted
       - invalidation message — clients remove the corresponding keys upon receiving
     - broadcasting — clients subscribe to key prefixes such as `object:` or `user:`, and will receive a notification message every time a key matching such prefix is touched, no memory cost for server
   - implementation
     - default mode
       - tracking table — keys to clients kept by server
         - eviction — random eviction, evict an older entry and send invalidation message if max reached; `tracking_table_max_keys` in configurations, defaults to no limit
       - store client ID instead of pointer — avoid GC; if a client disconnects, the information will be incrementally garbage collected as caching slots are invalidated
       - single key space — modification to a key in database 2 can invalidate another key in database 3, reducing both the memory usage and the implementation complexity
     - broadcasting mode
       - prefix table — each prefix is associated to a list of clients
   - connection
     - RESP3 — multiplexing, possible to run the data queries and receive the invalidation messages in the same connection
     - RESP2 — can only use two separated connections: one for data, and one for invalidation messages (`_redis_:invalidate` channel, note that using Pub/Sub is entirely a trick to reuse old client implementations, but actually the message is not really sent to a channel)
       - race condition — possible when invalidation connection faster than data connection
         ```
         [D] client -> server: GET foo (server start tracking the key)
         [I] server -> client: Invalidate foo (somebody else touched it)
         [D] server -> client: "bar" (the reply of "GET foo", which is not valid but will be cached)
         ```
         - solution — populate the key in the local cache with null placeholder, do nothing if key missing upon getting result (`put` if present instead of just `put`)
   - tracking target
     - normally — keys in read only commands
     - opt-in caching — `OPTIN` option, when broadcasting is NOT active, use `CLIENT CACHING yes` to track keys in read only commands, effective for the immediately next command/transaction/script
     - opt-out caching — `OPTOUT` option, the contrary of `OPTIN`, in tandem with `CLIENT CACHING no`
   - network partition — if connection lost, flush the local cache, can be in tandem with invalidation connection `PING` heartbeat to see if connection lost
   - related commands
     - `CLIENT TRACKING`
       - `NOLOOP` option — don't send notifications about keys modified by this connection itself
     - `CLIENT CACHING YES|NO`
     - `CLIENT GETREDIR` — returns the client ID we are redirecting our tracking notifications to

## Persistence

1. RDB — persistence of current snapshot in memory as a compressed binary file
   - expired key handling — see [`redisDb`](#server-and-client)
   - automatic load — if AOF switched off, RDB files are loaded automatically at start
   - auto `BGSAVE` — `save <seconds> <changes>` in configurations, triggered if after `<seconds>` since `redisServer.lastsave` `redisServer.dirty` is more than `<changes>`, executed by `serverCron` function
     - `redisServer.dirty` — counter for changes to keys since last `SAVE` or `BGSAVE`, for example, the counter will +3 after `SADD` 3 elements on a key
     - `redisServer.lastsave` — timestamp of last successful `SAVE` or `BGSAVE`
   - RDB file format — tbd
   - related commands
     - `SAVE` — blocking
     - `BGSAVE` — non-blocking in a forked process, but reject other `SAVE`, `BGSAVE`, `BGREWRITEAOF` when executing
     - `LASTSAVE` — the UNIX TIME of the last DB save executed with success

1. AOF — append only file, text file format, recording write commands
   - steps
     - append — write to buffer `redisServer.aof_buf`, whose type is `sds`
     - write and sync — at the end of every event loop, `flushAppendOnlyFile` executed, which writes to AOF and sync as `appendfsync` in configurations
   - `appendfsync` in configurations
     - `always` — also depends on `no-appendfsync-on-rewrite`, which defaults to false
     - `everysec`, default — if over 1 sec since last sync; by a dedicated thread
     - `no` — no sync, sync handled by OS
   - AOF loading — fake client created, from which commands in AOF executed
   - AOF rewrite — deduplicate AOF, implemented by generating commands from current database state with care for client input buffer overflow
     - non-blocking — AOF rewrite is executed in a forked process, new commands during AOF rewrite are simultaneously saved in a separate buffer besides the normal AOF buffer, which is flushed to the new AOF before the new AOF replace the previous one
   - expired key handling — see [`redisDb`](#server-and-client)
   - related commands
     - `BGREWRITEAOF` — non-blocking, but reject `BGSAVE` and another `BGREWRITEAOF` when executing

## Clustering

### Replication

1. replication
   - tree structure — replicas can also be connected to other replicas, forming sub-replicas; all the sub-replicas will receive exactly the same replication stream from the master since 4.0
   - read write
     - readonly replica — `replica-read-only` in configurations
     - write master only when — `min-replicas-to-write` and `min-replicas-max-lag` in configurations: if there are at least N replicas, with a lag less than M seconds, then the write will be accepted
   - related commands
     - `SLAVEOF`, `REPLICAOF`, `slaveof` in configurations
     - `SYNC`, `PSYNC` — internal command
     - `REPLCONF`
     - `INFO replication`
     - `WAIT` — blocks the current client until all the previous write commands are successfully transferred and acknowledged by at least the specified number of replicas
     - `ROLE`

1. synchronization — initial sync and then command propagate
   - initial sync
     - `SYNC` — used in old version, slave send `SYNC` to master, the master starts recording commands while `BGSAVE` for RDB file and send it to the slave, the slave load the file, and the master send commands since `BGSAVE` to the slave
     - `PSYNC` — full resynchronization as `SYNC` for initial replication, partial resynchronization as recovery, see below
     - diskless support — the master can send RDB file to replicas without persisting it on the disk, `repl-diskless-sync` in configurations
   - command propagate — after initial sync, asynchronously propagate commands which are with side effects, use `WAIT` for synchronous replication
   - heartbeat — update replication offset, and last heartbeat time for lag
     - heartbeat detail — slaves will ping master with `REPLCONF ACK replication_offset` periodically, defaults to 1 Hz, `lag` in the output of `INFO replication`
     - anti-entropy — reconcile if the `replication_offset` received by master does not match its own, e.g. some command propagate message lost
   - data safety
     - persistence and restart — it is strongly advised to have persistence turned on in the master and in the replicas, if not possible instances should be configured to avoid restarting automatically after a reboot, to avoid replication of the initial empty state after restart
     - expire — replicas wait for `DEL` from the master for expiration, and the replica uses its physical clock to report that a key does not exist only for read operations that don't violate the consistency of the data set??
       - example — [How we scaled the GitHub API with a sharded, replicated rate limiter in Redis - The GitHub Blog](https://github.blog/2021-04-05-how-we-scaled-github-api-sharded-replicated-rate-limiter-redis/)

1. partial resynchronization implementation — by replication offset in master and slave, replication backlog in master as buffer, and replication ID
   - replication offset — master adds n to its offset upon n bytes propagated, slave adds n to its offset upon n bytes received
   - replication backlog — fixed size FIFO queue defaults to 1 MB, saving propagated commands; if the command the replication offset in slave points to no longer in the queue, resort to full resynchronization
   - replication ID — random string, marks a given history of the data set, generated every time an instance restarts from scratch as a master, or a replica is promoted to master (but also keep one old ID for partial sync since 4.0); slave will persist the ID after handshake, send back to master upon recovering, full resynchronization if no replication ID match
     - change replication ID after promotion — in case the old master is still working as a master because of some network partition

### Sentinel

1. sentinel — monitor masters and slaves, and pick new leader
   - state
     ```c
     struct sentinelState {
         // ...
         uint64_t current_epoch;         /* Current epoch. */
         dict *masters;      /* Dictionary of master sentinelRedisInstances.
                                Key is the instance name, value is the
                                sentinelRedisInstance structure pointer. */
         // ...
     } sentinel;
     ```
     - `sentinelRedisInstance` — states of master, slave or another sentinel
   - configurations — `sentinel`, see [redis.io](https://redis.io/topics/sentinel#configuring-sentinel)
   - commands, see [redis.io](https://redis.io/topics/sentinel#sentinel-commands)
     - related command
       - `SENTINEL` — monitor and configuration provider
       - `ROLE`
     - available commands — `PING`, pub/sub etc., also see `sentinelcmds[]` in `sentinel.c`

1. links — command link and subscribe link, first established to the master and then slaves
   - channel — sentinels publish and subscribe via the channel `__sentinel__:hello`
   - inter-sentinel communication — discovery each other sentinel by pub/sub (see below), then establish command links to each other
   - sentinel as a Redis-compatible Pub/Sub server — for clients to get notified about sentinel events, see [redis.io](https://redis.io/topics/sentinel#pubsub-messages) for event list and message format

1. sentinel recovery, downgrade and anti-entropy
   - persistent state — sentinel state is persisted in the sentinel configuration file: every time a new configuration is received, or created (leader Sentinels), for a master, the configuration is persisted on disk together with the configuration epoch
   - TILT mode: time drift protection — in TILT mode the Sentinel will continue to monitor everything, but stop acting at all
     - trigger — the Sentinel timer interrupt is normally called 10 times per second, if the call time difference is negative or over 2s, TILT mode entered for 30s or prolonged if already entered
   - anti-entropy — periodically, see below
     - eventual consistency — as configuration propagation, every partition will converge to the higher `configEpoch` configuration available (last-write-wins), use `min-replicas-to-write` and `min-replicas-max-lag` to bound the divergence
       - proxies using CRDT — [Roshi](https://github.com/soundcloud/roshi), [Dynomite](https://github.com/Netflix/dynomite)

1. heartbeat
   - refresh `INFO`: `INFO` master and slaves — sentinel will send `INFO` to master in 0.1 Hz, refreshing `run_id` and `slaves` accordingly, for newly added slaves, sentinel will create link to them and thereafter send heartbeats in the same manner, and extract `run_id`, `role`, `master_link_status`, `slave_priority`, `slave_repl_offset` etc. from `INFO`
   - reconcile and discover other sentinels: make master and slaves `PUBLISH` and piggyback — sentinel send `PUBLISH` to master and slave, defaults to 0.5 Hz
     ```
     PUBLISH __sentinel__:hello "<s_ip>,<s_port>,<s_runid>,<s_epoch>,<m_name>,<m_id>,<m_port>,<m_epoch>
     ```
     - `s_` for sentinel, `m_` for master
     - loop: perception of other sentinels — sentinels can `PUBLISH` via command link and receive via their subscription, for piggybacked message, ignore if same ID as self in the message, update states according to the message if other sentinels
     - configuration propagation — as the above `__sentinel__:hello` loop, but only accept configurations with larger Raft epoch (see anti-entropy above)
   - failure detection: to master, slaves and other sentinels — sentinel `PING` other servers in 1 Hz, with possible response `+PONG`, `-LOADING`, `-MASTERDOWN`
     - subjective down — if no valid response for `down-after-milliseconds` in sentinel configurations, `SRI_S_DOWN` will be ORed to flags; opinions may vary among sentinels
     - objective down — after `SRI_S_DOWN` detected, the sentinel asks other sentinels, `SRI_O_DOWN` ORed if down for a quorum, `quorum` set in sentinel configurations and can vary among sentinels
       ```
       SENTINEL is-master-down-by-addr <ip> <port> <current_epoch> <run_id_or_star>
       ```
       response, where the last two only used for leader election
       ```
       1) <down_state>
       2) <leader_runid>
       3) <leader_epoch>
       ```

1. failover when objective down
   - sentinel leader election (Raft) — after master server objective down, a sentinel will `SENTINEL is-master-down-by-addr` to other sentinels but with own `run_id`, the following runs like Raft
   - promotion — after master failure, the leader sentinel selects a slave as the new master by sending `SLAVEOF no one`, then `INFO` in 1 Hz to see if `role` in response becomes `master`, and the `SLAVEOF` other slaves to set the new master, also `SLAVEOF` the old master once it come back
     - selection for promotion — filter out down slaves, slaves with no response for `INFO` for 5s, slaves whose link with the old master broke for `down-after-milliseconds * 10`; then sort by `slave_priority`, `slave_repl_offset`, `run_id` and choose the best
   - enforce configuration — even when no failover is in progress, sentinels will always try to set the current configuration on monitored instances with a delay, helping recovered instances to catch up
     - delay — to reconfigure, the wrong configuration must be observed for some time, that is greater than the period used to broadcast new configurations

### Redis Cluster

1. cluster — database sharding
   - enable cluster — `cluster-enabled` in configurations, other cluster configurations are similarly `cluster–` prefixed, a node can only `SELECT` 0, cluster bus port is always command port plus 1000
   - add node to cluster — three way handshake after `CLUSTER MEET` from the client: `MEET`, `PONG`, `PING`; then disseminate to other nodes via Gossip (heartbeats) to let them handshake the new node
     - set slave — `CLUSTER REPLICATE`: set `clusterState.myself.slaveof` and turn off `CLUSTER_NODE_MASTER` and turn on `CLUSTER_NODE_SLAVE` in `clusterState.myself.flags`, then information disseminated via heartbeats, and other nodes update information in `clusterNode->slaves`, `clusterNode.numslaves`
   - related commands
     - `MIGRATE` — `DUMP` + `DEL` in the source, `RESTORE` in the sink: atomically transfer a key from a source Redis instance to a destination Redis instance
     - `READONLY` — enables read queries for a connection to a Redis Cluster replica node, indicate the client is fine with possible stale data and will not write
     - `READWRITE` — reverse of `READONLY`
     - `CLUSTER`
       - `CLUSTER MEET`
       - `CLUSTER NODES`
       - `CLUSTER INFO`
       - `CLUSTER ADDSLOTS`, `SETSLOT`
       - `CLUSTER KEYSLOT`
       - `CLUSTER GETKEYSINSLOT`
       - `CLUSTER REPLICATE`
       - `CLUSTER FAILOVER`

1. nodes
   ```c
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
   ```c
   typedef struct clusterNode {
       // ...
       unsigned char slots[CLUSTER_SLOTS/8]; /* slots handled by this node */
       int numslots;   /* Number of slots handled by this node */
       // ...
   } clusterNode;
   ```
   <!-- - structures in `cluster.h` — `clusterNode`, `clusterLink`, `clusterState` -->
   - node attributes (`clusterState`) — own persistent ID, and information about other nodes such as ID, epoch, slots
   - complete graph link — all the cluster nodes are connected using a TCP bus and a binary protocol, called Redis Cluster Bus; but use Gossip to avoid exchanging too many messages between nodes during normal conditions
   - slots — `1 << 14` = 16384 slots, suggested max size of nodes is in the order of ~ 1000 nodes
     - delegate slots to a node — `CLUSTER ADDSLOTS`
     - broadcast `slots` — a node will broadcast its `slots` to other nodes, which is kept in `clusterState.slots` and `clusterNode.slots` in `clusterState->nodes`
     - hash function — `CRC16(key) & 0x3fff`, command `CLUSTER KEYSLOT`
       - `0x3fff` — bitmap for a node will be of size 2 KB, which saves bandwidth compared to 65536 slots, and 16384 slots are enough for clusters under 1000 nodes
     - `slots_to_keys` — slot to key mapping as radix trees, support for commands like `CLUSTER GETKEYSINSLOT`
     - multiple key operations — supported as long as all the keys involved all belong to the same hash slot, use hash tags to ensure
     - hash tags — only hash the non-empty substring between the first `{}` in a key if possible, e.g., `this{foo}key` and `another{foo}key` are guaranteed to be in the same hash slot

1. redirect and re-sharding
   - redirect — execute if the right slot, otherwise redirect the client to the node the slot belongs to by a `-MOVED` error; eventually clients obtain an up-to-date representation of the cluster and directly contact the right nodes, by memorizing received `-MOVED` or issuing `CLUSTER NODE` or `CLUSTER SLOTS` upon every `-MOVED`
   - re-sharding — adjust slot distribution and migrate slots
   - migrate slots — executed online by cluster management utility `redis-trib`, one slot by one slot
     1. send `CLUSTER SETSLOT <slot> IMPORTING <source_id>` to target node, setting its `clusterState.importing_slots_from[slot]` to source node
     1. send `CLUSTER SETSLOT <slot> MIGRATING <target_id>` to source node, setting its `clusterState.migrating_slots_to[slot]` to target node
     1. send `CLUSTER GETKEYSINSLOT` to source node, for keys responded, send `MIGRATE` to source node; repeat until all keys migrated
     1. send `CLUSTER SETSLOT <slot> NODE <target_id>` to any node to disseminate the information to the cluster
   - command executing when migrating
     - `-ASK` error — if the key does not exist on the source node, send `-ASK` error to redirect the client to the target node, and client send `ASKING` to the redirected node before resending command
     - `ASKING` — turn on `REDIS_ASKING` in `client.flags` for next command; a node will refrain from send `-MOVED` error and try to execute the command even if the slot is not delegated to the node if `REDIS_ASKING` on the client and `clusterState.importing_slots_from[slot]` is not `NULL`
     - `-TRYAGAIN` error — if keys split between the source and destination nodes for multiple key operations, clients can try again later or report the error

1. messages
   - message types
     - `MEET`
     - `PING` — in 1 Hz, every node selects 5 other random nodes to `PING`; besides, every node `PING` nodes whose last `PONG` till now is over half of `cluster-node-timeout`
     - `PONG` — response to `MEET` and `PING`, or voluntary broadcast
     - `FAIL` — broadcasted ASAP
     - `UPDATE` — if a receiver of a heartbeat packet finds the sender information is stale, it will `UPDATE` the stale node
     - `PUBLISH` — clients can subscribe to every node, and can also publish to every other node; the current implementation will simply broadcast each published message to all other nodes, but at some point this will be optimized either using Bloom filters or other algorithms
   - message header common to all messages — `clusterMsg` in `cluster.h`, includes the sender's ID, `currentEpoch`, `configEpoch`, flags, slot bitmap, port, master ID, cluster state POV (`CLUSTER_OK` or `CLUSTER_FAIL`)
   - heartbeat — `PING`, `PONG`, also contain a Gossip section
   - Gossip section — for `MEET`, `PING` and `PONG` messages, offering a view of some random nodes from the cluster, including ID,<!-- last `PING` and `PONG` timestamps,--> address and flags, where the number of random nodes is proportional to the cluster size
     ```c
     /* PING, MEET and PONG */
     struct {
         /* Array of N clusterMsgDataGossip structures */
         clusterMsgDataGossip gossip[1];
     } ping;
     ```

1. failover — use replication for each node and select a slave as the new master if the original master is down
   - eventual consistency — due to asynchronous replication and partition like the one documented in sentinel above
   - failure states
     - cluster fail — `CLUSTER_FAIL` even if only one slot not handled
     - heartbeat and `CLUSTER_NODE_PFAIL` (probable fail) — nodes (masters and slaves) in cluster will periodically `PING` each other, if no `PONG` for more than `cluster-node-timeout`, mark `CLUSTER_NODE_PFAIL` for target node in `clusterState.nodes` and disseminate via heartbeat message; upon receiving such message, a node will append it to `clusterNode->fail_reports` in `clusterState.nodes`
       - reconnect — nodes also try to reconnect the TCP link to avoid marking `CLUSTER_NODE_PFAIL` only because a TCP link problem
       - self protection — nodes refuse writes if cannot reach the majority for more than `cluster-node-timeout`
     - `CLUSTER_NODE_FAIL` — if a majority of master nodes mark one master node `CLUSTER_NODE_PFAIL` or `CLUSTER_NODE_FAIL` within `cluster-node-timeout` multiplied by a factor (2 currently), then that node will be marked `CLUSTER_NODE_FAIL`, and a `FAIL` message will be broadcasted
   - failover — when the master fails, slaves can start elections and if a slave is elected, it is elected to `SLAVEOF no one`, cancel slots in the original master and add those slots for itself, then broadcast a `PONG` to inform the cluster
     - prerequisites for a slave to start an election — when the master with positive `numslots` failed from the POV of the slave, and the time since slave's last interaction with the master is less than an amount configurable by `cluster-replica-validity-factor`, a slave node can start election after a jittered delay computed with slave rank
     - slave rank — slaves exchange messages when the master is failing in order to establish a (best effort) rank, ranked by how updated the replication offset is. In this way the most updated slaves try to get elected before others.
     - new master election — Raft like, other master nodes can vote but behave [a little differently](https://redis.io/topics/cluster-spec#masters-reply-to-slave-vote-request) compared to Raft, `currentEpoch` as term, upon winning a new unique and incremental `configEpoch` higher than any other master is created and new configuration is broadcasted to overwrite configurations with old ones
   - replica migration — guarantees that eventually every master will be backed by at least one slave
     - process — if singled master detected, the slave among the masters with the maximum number of attached slaves, that is not in FAIL state and has the smallest node ID, will migrate to the singled master
     - can try to migrate only when enough slaves left — `cluster-migration-barrier` in configurations
   - recover and clear `CLUSTER_NODE_FAIL` — if failed nodes reachable again for some time, clear directly if slave or no slot, otherwise rejoin the cluster
     - rejoin — rejoining master nodes will be slave of the node that stole its last hash slot, rejoining slave nodes will be slave of the node that stole the last hash slot of its former master

1. proxy based
   - [twitter/twemproxy: A fast, light-weight proxy for memcached and redis](https://github.com/twitter/twemproxy)

## Transaction

1. transaction — queue commands and execute them atomically, no rollback
   - command queue — all commands except transaction related commands will be validated and queued, all the other commands will be executed even if some command fails during the transaction
     ```c
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
   - optimistic lock — `WATCH`, transaction aborted if any `WATCH`ed key is modified before `EXEC`
     - implementation — `redisDb->watched_keys`, `dict` of key to client linked list; add `CLIENT_DIRTY_CAS` in `client.flags` if a command with `w` in `redisCommand.sflags` modified watched keys
   - ACID — guaranteed by single thread, except durability
     - force durability — `SAVE` before `EXEC`, but low performance

1. related commands
   - `MULTI` — start transaction, `CLIENT_MULTI` in `client.flags`
   - `EXEC` — executes all previously queued commands
   - `WATCH`, `UNWATCH`
   - `DISCARD` — also `UNWATCH` all keys

1. Lua scripts — Lua 5.1, transactional by definition
   - create Lua environment
     1. 创建一个基础的 Lua 环境 by `lua_open`， 之后的所有修改都是针对这个环境进行的。
     1. 载入多个函数库到 Lua 环境里面， 让 Lua 脚本可以使用这些函数库来进行数据操作。 — tbd
     1. 创建全局表格 `redis` ， 这个表格包含了对 Redis 进行操作的函数， 比如用于在 Lua 脚本中执行 Redis 命令的 `redis.call` 函数。
     1. 使用 Redis 自制的随机函数来替换 Lua 原有的带有副作用的随机函数， 从而避免在脚本中引入副作用。
     1. 创建排序辅助函数， Lua 环境使用这个辅佐函数来对一部分 Redis 命令的结果进行排序， 从而消除这些命令的不确定性。
     1. 创建 `redis.pcall` 函数的错误报告辅助函数， 这个函数可以提供更详细的出错信息。
     1. 对 Lua 环境里面的全局环境进行保护， 防止用户在执行 Lua 脚本的过程中， 将额外的全局变量添加到了 Lua 环境里面。
     1. 将完成修改的 Lua 环境保存到服务器状态的 `lua` 属性里面， 等待执行服务器传来的 Lua 脚本。
   - `redis.call` and `redis.pcall` — executed by `redisServer.lua_client`, arguments are arguments of Redis commands
     ```lua
     return redis.call('set',KEYS[1],'bar')
     ```
     - error handling — if a Redis command call will result in an error, `redis.call()` will raise a Lua error that in turn will force `EVAL` to return an error to the command caller, while `redis.pcall()` will trap the error and return a Lua table representing the error
     - keys must be passed explicitly — in order to be compatible with cluster
   - SHA1
     - as key — `redisServer->lua_scripts`, which is `dict` with SHA1 as key, function body as value
     - as Lua function name — function `f_<SHA1>()` is defined with the arguments of `EVAL`
   - [tbd from type conversion](https://redis.io/commands/eval#conversion-between-lua-and-redis-data-types)
   - related commands
     - `EVAL script numkeys key [key ...] arg [arg ...]`
     - `EVALSHA` — arguments as `EVAL`, scripts cached using `SCRIPT LOAD`
     - `SCRIPT` — tbd
       - `SCRIPT DEBUG`
       - `SCRIPT EXISTS`
       - `SCRIPT FLUSH`
       - `SCRIPT KILL`
       - `SCRIPT LOAD`

1. other non-transactional batch
   - pipeline — batch commands but not in a transaction
   - mass insertion — `redis-cli --pipe` pipe mode
     ```shell
     cat data.txt | redis-cli --pipe
     ```
     - `data.txt` — sequence of commands in the Redis protocol format, see [Redis Mass Insertion](https://redis.io/topics/mass-insert) for scripts for generating

## Other

1. config
   - config file — `/etc/redis/redis.conf` or as CLI options prefixed with `--`
   - related command — `CONFIG`
     - `CONFIG GET` — support `*` glob pattern
     - `CONFIG SET`
     - `CONFIG REWRITE` — rewrites the `redis.conf` to current configurations

1. `maxmemory-policy` in configurations — eviction policy when `maxmemory` reached, which defaults to 0 which means no limit for 64 bit systems
   - `noeviction` — no eviction, return errors instead
   - LRU — approximated of LRU, by sampling `maxmemory-samples` of keys, and evicting the one least recently used; pooling since 3.0, when the N keys sampling was performed, keys are used to populate a larger pool of keys (just 16 keys by default) sorted by idle time, if the keys are less recently used
     - `allkeys-lru` — all keys
     - `volatile-lru` — only among keys that have an expire set, return errors instead if no eviction
   - random
     - `allkeys-random`
     - `volatile-random`
   - `volatile-ttl` — evict keys with an expire set, and try to evict keys with a shorter TTL first, return errors instead if no eviction
   - LFU — since 4.0, reuse `redisObject.lru`, uses Morris counter (the greater the counter, the less likely to be incremented) to estimate access frequency, combined with a decay period so that the counter is reduced over time; sampled similarly to LRU
     - [src](https://github.com/redis/redis/blob/204a14b8cffba6a23e4e313e248bed7ef5cd8260/src/evict.c#L242-L277)
     - tune
       - `lfu-log-factor 10` – defaults to saturate (255) at around 1M hits
       - `lfu-decay-time 1`
     - `allkeys-lfu`
     - `volatile-lfu`
   - related commands — `MEMORY`, see `MEMORY HELP`
     - `MEMORY DOCTOR`
     - `MEMORY MALLOC-STATS`
     - `MEMORY PURGE`
     - `MEMORY STATS` — some overlap with `INFO`
     - `MEMORY USAGE` — the number of bytes that a key and its value require to be stored in RAM
     - `OBJECT FREQ` — available when `maxmemory-policy` is set to an LFU policy
     - `TOUCH key [key ...]` — alters the last access time of keys

1. slow log
   - configurations — `slowlog-log-slower-than`, `slowlog-max-len`
   - log entry id — `long long` `redisServer.slowlog_entry_id`, +1 every time
   - latency
     - enable latency monitor — `LATENCY`, `latency-monitor-threshold` in configurations
     - [Redis latency problems troubleshooting – Redis.io](https://redis.io/topics/latency)
   - related commands
     - `SLOWLOG`
       - `SLOWLOG GET`
       - `SLOWLOG LEN`
       - `SLOWLOG RESET`
     - `LATENCY` — see `LATENCY HELP`
       - `LATENCY LATEST` — returns the latest latency samples for all events
       - `LATENCY HISTORY` — returns latency time series for a given event
       - `LATENCY RESET` — resets latency time series data for one or more events
       - `LATENCY GRAPH` — renders an ASCII-art graph of an event's latency samples
       - `LATENCY DOCTOR` — replies with a human-readable latency analysis report

1. distributed locks — see [distributed](./distributed.md#distributed-locks)

1. big keys
   - find big keys — `redis-cli --bigkeys`, `SCAN`
   - check whether big key — `DEBUG OBJECT`, `STRLEN`, etc.
   - delete bigkeys — `UNLINK`

1. Redis modules — since 4.0, dynamic libraries, `loadmodule` in configurations or use `MODULE LOAD`
   - [tbd](https://redis.io/topics/modules-intro)
   - related commands `MODULE`
     - `MODULE LIST`
     - `MODULE LOAD`
     - `MODULE UNLOAD`

1. security
   - command disabling — `rename-config` in configurations
   - hash flooding protect — Redis uses a per-execution pseudo-random seed to the hash function
   - ACL — allows certain connections to be limited in terms of the commands that can be executed and the keys that can be accessed, new connections are already authenticated with a "default" user
   - TLS — see [TLS Support – Redis.io](https://redis.io/topics/encryption)
   - related commands
     - `AUTH`
     - `ACL`

1. RESP — Redis clients communicate with the Redis server using a protocol called REdis Serialization Protocol
   ```shell
   { echo -e '*1\r\n$4\r\nPING\r\n'; sleep 1; } | netcat redis.host.com 6379
   ```
   - delimiter and section terminator — `\r\n`
   - data type — depends on the first byte, bulk strings and arrays are followed by byte count and `\r\n` if not `NULL`
     - `+` — simple strings
     - `-` — errors
     - `:` — integers
     - `$` — bulk strings
     - `*` — arrays
     - `NULL` — `"$-1\r\n"`, `"*-1\r\n"`
   - client request and server reply — a client sends the Redis server a RESP Array consisting of just Bulk Strings; a Redis server replies to clients sending any valid RESP data type as reply
   - inline mode — designed for utilities like `telnet`
     ```shell
     echo PING | nc localhost 6379
     ```
   - RESP3 — since 6.0, [specification](https://github.com/antirez/RESP3/blob/master/spec.md)
     - map data type
     - multiplexing — possible to run the data queries and receive the invalidation messages in the same connection
   - related commands
     - `HELLO` — since 6.0, switch protocol

1. meme
   - `LOLWUT`
