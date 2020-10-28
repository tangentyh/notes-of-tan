# Miscellanea

1. docs
   - [official](https://nodejs.org/en/docs/)
   - [guides](https://nodejs.org/en/docs/guides/)

1. to learn
   - [nswbmw/node-in-debugging: 《Node.js 调试指南》](https://github.com/nswbmw/node-in-debugging)

# Event Loop

1. [official](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

# Command Line Options

1. Synopsis
   ```shell
   node [options] [V8 options] [script.js | -e "script" | -] [--] [arguments]
   node debug [script.js | -e "script" | <host>:<port>] …
   node --v8-options
   node
   ```

   - options
     - `-v, --version`
     - `-h, --help`
     - `-e, --eval "script"` -- Evaluate the following argument as JavaScript. The modules which are predefined in the REPL can also be used in script
     - `-p, --print "script"` -- Identical to `-e` but prints the result
     - more

1. more on [official](https://nodejs.org/dist/latest-v10.x/docs/api/cli.html)

# Modules

## Cornerstone

1. `buffer`
   - enable interaction with octet streams in TCP streams, file system operations, and other contexts
   - the `Buffer` class implements the `Uint8Array`
   - The `Buffer` class is a global within Node.js, no need for `require('buffer').Buffer`
   - Instances of the `Buffer` class are similar to arrays of integers but correspond to fixed-sized, raw memory allocations outside the V8 heap
   - The size of the `Buffer` is established when it is created and cannot be resized
   - `buffer.Buffer`
     - `from(arrayBuffer: ArrayBuffer | SharedArrayBuffer, byteOffset?: number, length?: number): Buffer`  
       `from(data: any[]): Buffer`  
       `from(data: Uint8Array): Buffer`  
       `from(str: string, encoding?: string): Buffer`
     - `toString(encoding?: string, start?: number, end?: number): string`
       - encoding -- `'uft8'` (default), `'ascii'`, `'base64'`, `'binary'`, `'hex'`, more

1. `string_decoder` -- decoding `Buffer` with care to multi-byte UTF-8 and UTF-16 characters
   - constructor `string_decoder.StringDecoder(encoding?: string): NodeStringDecoder`
     - `encoding` defaults to `utf8`
   - `NodeStringDecoder.write(buffer: Buffer): string` -- Returns a decoded string, ensuring that any incomplete multibyte characters at the end of the Buffer are omitted from the returned string and stored in an internal buffer for the next call to `write()` or `end()`
   - `NodeStringDecoder.end(buffer?: Buffer): string` -- Returns any remaining input stored in the internal buffer
     - if argument provided, one final call to `write()` is performed before returning the remaining input

1. `stream` -- an abstract interface for working with streaming data
   - Object Mode
     - All streams created by Node.js APIs operate exclusively on strings and `Buffer` (or `Uint8Array`) objects
     - stream implementations can work with other types of JavaScript values with the exception of `null`
   - Buffering
     - get -- `Writable._writableState.getBuffer()` or `Readable._readableState.buffer`
     - amount -- determined by `Stream.highWaterMark: number`, defaults to a total number of bites
     - buffering -- Once the total size of the internal read buffer reaches the threshold specified by `highWaterMark`, the stream will temporarily stop reading data from the underlying resource until the data currently buffered can be consumed
     - duplex -- Duplex and Transform streams are both Readable and Writable, each maintain two separate internal buffers used for reading and writing
   - Writable Streams -- `stream.Writeable`
     - implementations (some are Duplex streams that implement the Writable interface)
       - HTTP requests, on the client
       - HTTP responses, on the server
       - `fs` write streams
       - `zlib` streams
       - `crypto` streams
       - TCP sockets
       - child process stdin
       - `process.stdout`, `process.stderr`
     - `readonly`
       - `writableHighWaterMark: number`
       - `writableLength: number`
     - events
       - `'close'` (not all will emit this event, such as `process.stderr`)
       - `'drain'` -- If a call to `stream.write(chunk)` returns `false`, the `'drain'` event will be emitted when it is appropriate to resume writing data to the stream
       - `'finish'` -- after the `stream.end()` method has been called, and all data has been flushed to the underlying system
       - `on(event: "error", listener: (err: Error) => void): this` -- an error occurred while writing or piping data (the stream is not closed)
       - `on(event: "pipe", listener: (src: Readable) => void): this` -- emitted when the `stream.pipe()` method is called on a readable stream, adding this writable to its set of destinations
       - `on(event: "unpipe", listener: (src: Readable) => void): this` -- emitted when the `stream.unpipe()` method is called on a Readable stream, removing this Writable from its set of destinations, also emitted in case this Writable stream emits an error when a Readable stream pipes into it
     - `write(chunk: any, cb?: (error: Error | null | undefined) => void): boolean`  
       `write(chunk: any, encoding?: string, cb?: (error: Error | null | undefined) => void): boolean`
       - writes some data to the stream, and calls the supplied callback once the data has been fully handled
       - If an error occurs, the callback may or may not be called with the error as its first argument. To reliably detect write errors, add a listener for the `'error'` event
       - return `true` when the internal buffer is less than the `highWaterMark` after admitting
       - If `false` is returned, further attempts to write data to the stream should stop until the `'drain'` event is emitted
       - While calling `write()` on a stream that is not draining is allowed, Node.js will buffer all written chunks until maximum memory usage occurs, at which point it will abort unconditionally. Even before it aborts, high memory usage will cause poor garbage collector performance and high RSS (Resident set size)
     - `setDefaultEncoding(encoding: string): this`
       - in object mode will always ignore the `encoding` argument
     - `end(cb?: () => void): void`  
       `end(chunk: any, cb?: () => void): void`  
       `end(chunk: any, encoding?: string, cb?: () => void): void`
       - the optional callback function is attached as a listener for the `'finish'` event
     - `cork(): void` -- forces all written data to be buffered in memory, The buffered data will be flushed when `end()` or `uncork()`
     - `uncork(): void` -- flushes all data buffered since `stream.cork()` was called
       - it is recommended that calls to `uncork()` be deferred using `process.nextTick()`. Doing so allows batching of all `write()` calls that occur within a given Node.js event loop phase
       - If the `cork()` method is called multiple times on a stream, the same number of calls to `uncork()` must be called to flush the buffered data
     - `destroy(error?: Error): void` -- Destroy the stream, and emit `'error'`
   - Readable Streams -- `stream.Readable`
     - implementations
       - HTTP responses, on the client
       - HTTP requests, on the server
       - `fs` read streams
       - `zlib` streams
       - `crypto` streams
       - TCP sockets
       - child process stdout and stderr
       - `process.stdin`
     - two modes
       - flowing mode, data is read from the underlying system automatically and provided to an application as quickly as possible using events via the `EventEmitter` interface
       - paused mode, the `stream.read()` method must be called explicitly to read chunks of data from the stream
       - if in flowing mode and there are no consumers available to handle the data, that data will be lost
       - switch to flowing mode
         - Adding a `'data'` event handler
         - Calling the `stream.resume()` method
         - Calling the `stream.pipe()` method to send the data to a Writable
       - switch to pause mode
         - If there are no pipe destinations, by calling the `stream.pause()` method
         - If there are pipe destinations, by removing all pipe destinations. Multiple pipe destinations may be removed by calling the `stream.unpipe()` method
         - removing `'data'` handler is no use for backwards compatibility
     - three states
       - `readable._readableState.flowing = null`
       - `readable._readableState.flowing = false`
       - `readable._readableState.flowing = true`
     - use one -- In general, developers should choose one of the methods of consuming data and should never use multiple methods to consume data from a single stream
     - `readonly`
       - `readableHighWaterMark: number`
       - `readableLength: number`
     - events
       - `'close'`
       - `on(event: "data", listener: (chunk: any) => void): this` -- emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer
       - `'end'` -- emitted when there is no more data to be consumed from the stream
       - `on(event: "error", listener: (err: Error) => void): this`
       - `'readable'` -- emitted when there is data available to be read from the stream, or the end of the stream data has been reached (`read()` returns `null`) but before the `'end'` event is emitted
     - `read(size?: number): any`
       - If `size` bytes are not available to be read, `null` will be returned unless the stream has ended, in which case all of the data remaining in the internal buffer will be returned
       - only be called on Readable streams operating in paused mode, called automatically in flowing mode
       - if returns a chunk of data, a `'data'` event will also be emitted
       - consider `readline` module
     - `setEncoding(encoding: string): this` -- Setting an encoding causes the stream data to be returned as `string`s of the specified encoding rather than as `Buffer` objects when not in object mode
       - will properly handle multi-byte characters
     - `pause(): this` -- cause a stream in flowing mode to stop emitting `'data'` events, switching out of flowing mode
     - `isPaused(): boolean`
     - `resume(): this` -- switch to flowing mode
     - `pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T` -- switch automatically into flowing mode and push all of its data to the attached Writable
       - `options.end` -- defaults to `true`, whether end the writer when the reader ends (not `process.stderr` and `process.stdout`)
       - if the Readable stream emits an error during processing, the Writable destination is not closed automatically
       - possible to attach multiple Writable streams to a single Readable stream
     - `unpipe(destination?: NodeJS.WritableStream): this` -- detaches a Writable stream previously attached
     - `unshift(chunk: any): void` -- pushes a chunk of data back into the internal buffer
       - cannot be called after the `'end'` event has been emitted or a runtime error will be thrown
       - Developers using `stream.unshift()` often should consider switching to use of a Transform stream instead
       - best to simply avoid calling while in the process of performing a read
     - `destroy(error?: Error): void` -- Destroy the stream, and emit `'error'`
     - `push(chunk: any, encoding?: string): boolean` -- for implementers
     - `[Symbol.asyncIterator](): AsyncIterableIterator<any>`
   - Duplex and Transform Streams
     - `stream.Duplex` -- streams that implement both the Readable and Writable interfaces
       - TCP sockets
       - `zlib` streams
       - `crypto` streams
     - `stream.Transform` -- Duplex streams where the output is in some way related to the input (Operate on written data, then read the result)
       - `zlib` streams
       - `crypto` streams
   - `stream.finished(stream: NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream, callback: (err?: NodeJS.ErrnoException) => void): () => void` -- get notified when a stream is no longer readable, writable or has experienced an error or a premature close event
     - Especially useful in error handling scenarios where a stream is destroyed prematurely (like an aborted HTTP request), and will not emit `'end'` or `'finish'`
   - `stream.pipeline(...streams: Array<NodeJS.ReadWriteStream | NodeJS.WritableStream>, callback?: (err: NodeJS.ErrnoException) => void): NodeJS.WritableStream` -- pipe between streams forwarding errors and properly cleaning up and provide a callback when the pipeline is complete
     - only the first stream can be `ReadableStream`

1. `readline` -- provides an interface for reading data from a `Readable` stream one line at a time
   - synchronous version
     ```JavaScript
     const rl = readline.createInterface({ input: process.stdin });
     function noerr_promisify(fun, ...defaults) {
         return (...arg) => new Promise((resolve) => {
             fun(...defaults, ...arg, ans => resolve(ans));
         });
     }
     const q = noerr_promisify(rl.question.bind(rl), '');
     (async () => {
         const input = await q();
         console.log(`resolved: ${input}`);
         await q().then(console.log);
         rl.close();
     })();
     ```

1. `events`
   - intro -- Much of the Node.js core API is built around an idiomatic asynchronous event-driven architecture in which certain kinds of objects (called "emitters") periodically emit named events that cause Function objects ("listeners") to be called
   - Synchronous -- all of the functions attached to a specific event are called synchronously when an event is emitted
     - switch to an asynchronous -- `setImmediate()` or `process.nextTick()`
   - `EventEmitter` -- All objects that emit events are instances of the `EventEmitter` class
   - add a listener
     - `EventEmitter.on(event: string | symbol, listener: (...args: any[]) => void): this` -- allows one or more functions to be attached to named events emitted by the object
       - Any values returned by the called listeners are ignored and will be discarded
       - alias -- `EventEmitter.addListener()`
     - `EventEmitter.prependListener(event, listener): this` -- add to the beginning of the listeners array
     - disposable -- `EventEmitter.once(event: string | symbol, listener: (...args: any[]) => void): this`
     - disposable and beginning -- `EventEmitter.prependOnceListener(event, listener): this`
   - remove a listener
     - `EventEmitter.off(...): this` -- alias of `EventEmitter.removeListener()`
     - `EventEmitter.removeListener(event: string | symbol, listener: (...args: any[]) => void): this` -- remove, at most, one instance of a listener from the listener array
       - need to remove multiple times if registered multiple times to completely remove
     - `EventEmitter.removeAllListeners(event?: string | symbol): this` -- Removes all listeners, or those of the specified
   - emit an event -- `EventEmitter.emit(event: string | symbol, ...args: any[]): boolean` -- allows an arbitrary set of arguments to be passed to the listener functions
       - `function` callbacks -- `this` is intentionally set to reference the `EventEmitter` to which the listener is attached
       - array function callbacks -- `this` is `{}` (to be verified)
   - listener event -- All EventEmitters emit the event `'newListener'` when new listeners are added and `'removeListener'` when existing listeners are removed
     - `'newListener'` -- before a listener is added to its internal array of listeners
     - The `'removeListener'` event is emitted after the listener is removed
     - callback arg -- `(eventName: string | symbol, listener: Function)`
   - maximum number of listeners
     - not a hard limit. The `EventEmitter` instance will allow more listeners to be added but will output a trace warning to stderr indicating that a "possible EventEmitter memory leak" has been detected
       - The `--trace-warnings` command line flag can be used to display the stack trace for such warnings
       - The emitted warning can be inspected with `process.on('warning')`
     - `EventEmitter.defaultMaxListeners` -- default maximum number of events can be registered for any single event, defaults to 10
     - `EventEmitter.setMaxListeners(n: number): this` -- set maximum number of events for individual `EventEmitter` instance
     - `EventEmitter.getMaxListeners(): number` -- for individual instance
   - infomation about registered events
     - `EventEmitter.eventNames(): Array<string | symbol>` -- listing the events for which the emitter has registered listeners
     - `EventEmitter.listenerCount(type: string | symbol): number` -- the number of listeners listening to a specific event
     - `EventEmitter.listeners(event: string | symbol): Function[]` -- a copy of the array of listeners for a specific event
     - `EventEmitter.rawListeners(event: string | symbol): Function[]` -- a copy of the array of listeners for the event named `eventName`, including any wrappers (such as those created by `.once()`)

1. module system
   - each file is treated as a separate module
   - Variables local to the module will be private, because the module is wrapped in a function
     ```JavaScript
     (function(exports, require, module, __filename, __dirname) {
     // Module code actually lives in here
     });
     ```
   - When a file is run directly from Node.js, `require.main === module`
     - the entry point of the current application -- `require.main.filename` (`__filename`)
   - extension -- `.js`, `.json`, `.node` (binary)
   - Folders as Modules
     - `package.json` -- `"name"` for package name, `"main"` for package entry point
     - `index.js` or `index.node` will be attempted to load without `package.json`
   - module scope
     - `__dirname` -- `path.dirname(__filename)`
     - `__filename` -- absolute path of the current module file
     - `exports` -- `module.exports` reference
     - `module`
       - `module.children` -- The module objects required by this one
       - `module.filename`
       - `module.id`
       - `module.loaded`
       - `module.parent`
       - `module.paths` -- The search paths for the module
       - `module.require()` -- provides a way to load a module as if `require()` was called from the original module
     - `require()`
     - `require.cache` -- Modules are cached in this object when they are required. By deleting a key value from this object, the next `require` will reload the module. Note that this does not apply to native addons, for which reloading will result in an Error
     - `require.resolve()` -- resolve a module in a specified array of paths
     - `require.resolve.paths(request: string): string[]` -- Returns an array containing the paths searched during resolution of `request` or `null` if the `request` string references a core module, for example `http` or `fs`
   - `require('module').builtinModules: string[]` -- A list of the names of all modules provided by Node.js. Can be used to verify if a module is maintained by a third-party module or not

1. Global Objects
   - The following variables may appear to be global but are not. They exist only in the scope of modules
     - `__dirname`
     - `__filename`
     - `exports`
     - `module`
     - `require()`
   - `Buffer`, `clearImmediate()`, `clearInterval()`, `clearTimeout()`, `console`, `process`, `setImmediate()`, `setInterval()`, `setTimeout()`, `URL`, `URLSearchParams`
   - `global` -- The global namespace object
     - The top-level scope is not the global scope
     - `var something` inside a Node.js module will be local to that module

1. Timers -- globals
   - `setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout` -- timers phase
     - Technically, the poll phase controls when timers are executed
   - `setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout` -- timers phase
   - `NodeJS.Timeout`
     - `ref(): NodeJS.Timeout` -- requests that the Node.js event loop not exit so long as the `Timeout` is active, done by default
     - `unref(): NodeJS.Timeout` -- the active `Timeout` object will not require the Node.js event loop to remain active. If there is no other activity keeping the event loop running, the process may exit before the `Timeout` object's callback is invoked
       - creates an internal timer that will wake the Node.js event loop. Creating too many of these can adversely impact performance
     - `refresh(): NodeJS.Timeout` -- Sets the timer's start time to the current time, and reschedules the timer
   - `setImmediate(callback: (...args: any[]) => void, ...args: any[]): NodeJS.Immediate` -- execute once the pull phase completes (check phase)
     - `process.nextTick()` -- processed after the current operation completes, regardless of the current phase of the event loop
     - can `ref()` and `unref()`
   - Cancelling Timers -- `clearTimeout(timeoutId: NodeJS.Timeout): void`, `clearInterval(intervalId: NodeJS.Timeout): void`, `clearImmediate(immediateId: NodeJS.Immediate): void`
     - not possible to cancel timers that were created using the promisified variants

## debug

1. `assert`
   - use `const assert = require('assert').strict;` for strict mode -- legacy mode without `.strict` is deprecated
   - `assert(value: any, message?: string, ...optionalParams: any[]): void`
     - alias of `assert.ok()`

1. `console` -- as in browsers
   - A global `console` instance configured to write to `process.stdout` and `process.stderr`
   - `console.Console` -- class with methods can be used to write to any Node.js stream
     - `const { Console } = require('console');` or `const { Console } = console;`
     - constructor: `Console(stdout: WriteableStream, stderr?: WriteableStream)`
     - logging

1. Errors
   - types -- standard JavaScript errors, system errors, user-defined errors, assertions
   - all inherits global object `Error`, [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
   - Class: System Error -- typically generated at the syscall level, occur when an application violates an operating system constraint such as attempting to read a file that does not exist or when the user does not have sufficient permissions
     - `error.code: string`
     - `error.errno: number | string`
     - `error.syscall: string`
     - `error.path: string`
     - `error.address: string`
     - `error.port: string`

1. `inspector` -- for debug

1. debugger
   - Inserting the statement `debugger;` into the source code of a script will enable a breakpoint at that position in the code
   - debug commands -- `help`
   - watchers command -- `watch('my_expression')`, `unwatch('my_expression')`

1. `trace_event` -- provides a mechanism to centralize tracing information generated by V8, Node core, and userspace code

## net

1. `net` -- creating stream-based TCP or IPC servers and clients
   - `createServer(connectionListener?: (socket: Socket) => void): Server`
   - `createServer(options?: { allowHalfOpen?: boolean, pauseOnConnect?: boolean }, connectionListener?: (socket: Socket) => void): Server`
   - `net.Server`
     - events
       - `on(event: "close", listener: () => void): this`
       - `on(event: "connection", listener: (socket: Socket) => void): this`
       - `on(event: "error", listener: (err: Error) => void): this`
       - `on(event: "listening", listener: () => void): this`
     - `listen(port?: number, hostname?: string, backlog?: number, listeningListener?: Function): this` -- TCP server  
       `listen(path: string, backlog?: number, listeningListener?: Function): this` -- IPC server  
       `listen(options: ListenOptions, listeningListener?: Function): this`  
       `listen(handle: any, backlog?: number, listeningListener?: Function): this`
   - `createConnection(options: NetConnectOpts, connectionListener?: Function): Socket`  
     `createConnection(port: number, host?: string, connectionListener?: Function): Socket`  
     `createConnection(path: string, connectionListener?: Function): Socket`
     - alias -- `net.connect()`
     - equivalent -- `(new net.Server(...)).connect(...)`
   - `net.Socket extends stream.Duplex`
     - events
       - `on(event: "close", listener: (had_error: boolean) => void): this`
       - `on(event: "connect", listener: () => void): this`
       - `on(event: "data", listener: (data: Buffer) => void): this`
       - `on(event: "drain", listener: () => void): this`
       - `on(event: "end", listener: () => void): this`
       - `on(event: "error", listener: (err: Error) => void): this`
       - `on(event: "lookup", listener: (err: Error, address: string, family: string | number, host: string) => void): this`
       - `on(event: "timeout", listener: () => void): this`
     - `readonly bufferSize: number`
     - `readonly bytesRead: number`
     - `readonly bytesWritten: number`
     - `readonly connecting: boolean`
     - `readonly destroyed: boolean`
     - `readonly localAddress: string`
     - `readonly localPort: number`
     - `readonly remoteAddress?: string`
     - `readonly remoteFamily?: string`
     - `readonly remotePort?: number`

1. `http`
   - The interface is careful to never buffer entire requests or responses — the user is able to stream data
   - Keys are lowercased
   - `http.METHODS: string[]` -- A list of the HTTP methods that are supported by the parser
   - `http.STATUS_CODES: { [errorCode: number]: string | undefined; [errorCode: string]: string | undefined; }` -- `http.STATUS_CODES[404] === 'Not Found'`
   - `http.createServer(requestListener?: (request: IncomingMessage, response: ServerResponse) => void): Server`  
     `http.createServer(options: ServerOptions, requestListener?: (req: http.IncomingMessage, res: http.ServerResponse) => void): Server`
      - the `requestListener` is registered to the `'request'` event
      - `ServerOptions` for extend `res` and `req`
   - `class Server extends net.Server`
     - `setTimeout(msecs?: number, callback?: () => void): this`  
       `setTimeout(callback: () => void): this` -- Sets the timeout value for sockets
     - `maxHeadersCount: number`
     - `timeout: number`
     - `keepAliveTimeout: number`
   - `class ServerResponse extends OutgoingMessage`
     - `statusCode: number`
     - `statusMessage: string`
     - `assignSocket(socket: net.Socket): void`
     - `detachSocket(socket: net.Socket): void`
     - `writeContinue(callback?: () => void): void`
     - `writeHead(statusCode: number, headers?: OutgoingHttpHeaders): void`  
       `writeHead(statusCode: number, reasonPhrase?: string, headers?: OutgoingHttpHeaders): void`
   - `OutgoingMessage extends stream.Writable`
     - `upgrading: boolean`
     - `chunkedEncoding: boolean`
     - `shouldKeepAlive: boolean`
     - `useChunkedEncodingByDefault: boolean`
     - `sendDate: boolean`
     - `finished: boolean`
     - `headersSent: boolean`
     - `connection: net.Socket`
     - `setTimeout(msecs: number, callback?: () => void): this`
     - `setHeader(name: string, value: number | string | string[]): void`
     - `getHeader(name: string): number | string | string[] | undefined`
     - `getHeaders(): OutgoingHttpHeaders`
     - `getHeaderNames(): string[]`
     - `hasHeader(name: string): boolean`
     - `removeHeader(name: string): void`
     - `addTrailers(headers: OutgoingHttpHeaders | Array<[string, string]>): void`
     - `flushHeaders(): void`
   - `class IncomingMessage extends stream.Readable`
     - `httpVersion: string`
     - `httpVersionMajor: number`
     - `httpVersionMinor: number`
     - `connection: net.Socket`
     - `headers: IncomingHttpHeaders` -- `{[header: string]: string | string[] | undefined}`
     - `rawHeaders: string[]`
     - `trailers: { [key: string]: string | undefined }`
     - `rawTrailers: string[]`
     - `method?: string`
     - `url?: string`
     - `statusCode?: number`
     - `statusMessage?: string`
     - `socket: net.Socket`
     - more
   - `http.request(options: RequestOptions | string | URL, callback?: (res: IncomingMessage) => void): ClientRequest`  
     `http.request(url: string | URL, options: RequestOptions, callback?: (res: IncomingMessage) => void): ClientRequest` -- HTTP requests from the client agent
   - `http.get(options: RequestOptions | string | URL, callback?: (res: IncomingMessage) => void): ClientRequest`  
     `http.get(url: string | URL, options: RequestOptions, callback?: (res: IncomingMessage) => void): ClientRequest` -- sets the method to GET and calls `req.end()` automatically, Since most requests are GET requests without bodies
   - `let globalAgent: Agent`
   - `class http.Agent` -- managing connection persistence and reuse for HTTP clients
     - maintains a pool of connection sockets, provide `{agent: false}` to use a new agent for request
     - tbc
   - `class http.ClientRequest` -- represents an in-progress request whose header has already been queue, return by `http.request()`, `http.get()`
   - `interface RequestOptions extends ClientRequestArgs { }`
     ```TypeScript
     interface ClientRequestArgs {
         protocol?: string;
         host?: string;
         hostname?: string;
         family?: number;
         port?: number | string;
         defaultPort?: number | string;
         localAddress?: string;
         socketPath?: string;
         method?: string;
         path?: string;
         headers?: OutgoingHttpHeaders;
         auth?: string;
         agent?: Agent | boolean;
         _defaultAgent?: Agent;
         timeout?: number;
         // https://github.com/nodejs/node/blob/master/lib/_http_client.js#L278
         createConnection?: (options: ClientRequestArgs, oncreate: (err: Error, socket: net.Socket) => void) => net.Socket;
     }
     ```

1. `http2` -- tbc

1. `dgram` -- an implementation of UDP Datagram sockets
   - `createSocket(type: "udp4" | "udp6", callback?: (msg: Buffer, rinfo: RemoteInfo) => void): Socket`
   - `createSocket(options: SocketOptions, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): Socket`
   - `dgram.Socket`
     - events
       - `on(event: "close", listener: () => void): this`
       - `on(event: "error", listener: (err: Error) => void): this`
       - `on(event: "listening", listener: () => void): this`
       - `on(event: "message", listener: (msg: Buffer, rinfo: AddressInfo) => void): this`
     - `send(msg: Buffer | string | Uint8Array | any[], port: number, address?: string, callback?: (error: Error | null, bytes: number) => void): void`  
       `send(msg: Buffer | string | Uint8Array, offset: number, length: number, port, address?, callback?): void`
     - `bind(...): void` -- listen for datagram messages on a named port and optional address

1. `dns`
   - `dns.lookup(hostname: string, options?, callback)` -- use the underlying operating system facilities to perform name resolution
     - connect to an actual DNS server to perform name resolution, and that always use the network to perform DNS queries
   - `dns.resolve(hostname: string, callback: (err: NodeJS.ErrnoException, addresses: string[]) => void): void` -- Uses the DNS protocol to resolve a hostname into an array of the resource records

1. `https` -- similar to `http`
   ```JavaScript
   const options = {
     key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
     cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
   };
   https.createServer(options, (req, res) => {
     res.writeHead(200);
     res.end('hello world\n');
   }).listen(443); // Binding to any port less than 1024 requires root privilege
   ```

   - `https.Server` -- a subclass of `tls.Server` and emits events same as `http.Server`

1. `crypto` -- provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions
   ```JavaScript
   let salt = Math.round((Date.now() * Math.random())) + '';
   let salted = crypto.createHash('sha512').update(salt + password, 'utf8').digest('hex');
   ```

   - `crypto.getHashes(): string[]`
   - `createHash(algorithm: string, options?: stream.TransformOptions): Hash`
   - `Hash extends NodeJS.ReadWriteStream`
     - `update(data: string | Buffer | NodeJS.TypedArray | DataView): Hash`  
       `update(data: string, input_encoding: Utf8AsciiLatin1Encoding): Hash`
     - `digest(): Buffer`  
       `digest(encoding: HexBase64Latin1Encoding): string` -- The `Hash` object can not be used again

1. `tls` -- an implementation of the Transport Layer Security (TLS) and Secure Socket Layer (SSL) protocols that is built on top of OpenSSL
   - self-signed certificate -- [Lets Encrypt](https://letsencrypt.org/), [SSL.md](SSL.md), OpenSSL

1. `zlib` -- provides compression functionality implemented using Gzip and Deflate/Inflate
   ```JavaScript
   const compress = zlib.createDeflate(); // also zlib.createGzip();
   fs.createReadStream(source).pipe(compress).pipe(fs.createWriteStream(dest));
   ```

   - more

1. `querystring` -- similar to `URLSearchParams` in browsers but more general as it allows the customization of delimiter
   - `stringify(obj?: {}, sep?: string, eq?: string, options?: StringifyOptions): string` -- produces a URL query string from a given obj by iterating through the object's "own properties"
   - `parse(str: string, sep?: string, eq?: string, options?: ParseOptions): ParsedUrlQuery` --  parses a URL query string (`str`) into a collection of key and value pairs
     - `interface ParsedUrlQuery { [key: string]: string | string[]; }`
   - `escape(str: string): string` -- default `StringifyOptions.encodeURIComponent`
   - `unescape(str: string): string` -- default `ParseOptions.decodeURIComponent`
   - `sp`: `&`, `eq`: `=`
   - `interface StringifyOptions { encodeURIComponent?: Function; }`
   - `interface ParseOptions { maxKeys?: number; decodeURIComponent?: Function; }`

1. `url` -- `url.URL` and `url.URLSearchParams` is similar to that in browsers
   ```
   "  https:   //    user   :   pass   @ sub.host.com : 8080   /p/a/t/h  ?  query=string   #hash "
   │          │  │          │          │   hostname   │ port │          │                │       │
   │          │  │          │          ├──────────────┴──────┤          │                │       │
   │ protocol │  │ username │ password │        host         │          │                │       │
   ├──────────┴──┼──────────┴──────────┼─────────────────────┤          │                │       │
   │   origin    │                     │       origin        │ pathname │     search     │ hash  │
   ├─────────────┴─────────────────────┴─────────────────────┴──────────┴────────────────┴───────┤
   │                                            href                                             │
   └─────────────────────────────────────────────────────────────────────────────────────────────┘
   (all spaces in the "" line should be ignored — they are purely for formatting)
   ```

   - `url.format(URL: URL, options?: URLFormatOptions): string` -- a customizable serialization of a URL String representation of a WHATWG URL object
   - `url.domainToASCII(domain: string): string` -- Returns the Punycode ASCII serialization of the domain. If domain is an invalid domain, the empty string is returned
   - `url.domainToUnicode(domain: string): string` -- Returns the Unicode serialization of the domain. If domain is an invalid domain, the empty string is returned
   - `url.URL` -- added to global since v10
     - `constructor(input: string, base?: string | URL)` -- Creates a new `URL` object by parsing the `input` relative to the `base`
     - `protocol: string`
     - `readonly origin: string`
     - `username: string`
     - `password: string`
     - `host: string`
     - `hostname: string`
     - `port: string`
     - `pathname: string`
     - `search: string` -- Gets and sets the serialized query portion of the URL, will be percent-encoded
     - `hash: string`
     - `readonly searchParams: URLSearchParams` -- the query parameters of the URL
     - `href: string` -- equivalent to `URL.toString()` and `URL.toJSON()`
     - `toString(): string` -- equivalent to that of `URL.href` and `URL.toJSON()`
     - `toJSON(): string` -- equivalent to that of `URL.href` and `URL.toString()`
   - `URLSearchParams` -- container mixin, added to global since v10
     - the purpose of the `querystring` module is more general, as it allows the customization of delimiter characters (& and =)
     - `constructor()`  
       `constructor(init?: URLSearchParams)`  
       `constructor(init?: string)` -- leading `?` is ignored  
       `constructor(init?: { [key: string]: string | string[] | undefined })`  
       `constructor(init?: Iterable<[string, string]> | Array<[string, string]>)`
     - `append(name: string, value: string): void`
     - `delete(name: string): void`
     - `entries(): IterableIterator<[string, string]>`
     - `forEach(callback: (value: string, name: string, searchParams: this) => void): void`
     - `get(name: string): string | null`
     - `getAll(name: string): string[]`
     - `has(name: string): boolean`
     - `keys(): IterableIterator<string>`
     - `set(name: string, value: string): void`
     - `sort(): void`
     - `toString(): string`
     - `values(): IterableIterator<string>`
     - `[Symbol.iterator](): IterableIterator<[string, string]>`

## Runtime service

1. `process` -- a `global` that provides information about, and control over, the current Node.js process
   - I/O
     - used internally in `console`
     - Writes may be synchronous depending on what the stream is connected to and whether the system is Windows or POSIX
     - `process.stderr: Stream` -- `fd` 2
     - `process.stdin: Stream` -- `fd` 0
     - `process.stdout: Stream` -- `fd` 1
   - environment
     - `process.argv: string[]` -- `process.execPath`, then the executed file, then other arguments
     - `process.argv0: string` -- original value of `process.argv[0]`
     - `process.chdir(directory: string): void`
     - `process.cwd(): string`
     - `process.env` -- an object containing the user environment
     - `process.execArgv` -- the set of Node.js-specific command-line options passed when the Node.js process was launched
     - `process.execPath` -- the absolute pathname of the executable
     - `process.version: string`
     - `process.versions: ProcessVersions` -- version strings of Node.js and its dependencies
   - runtime
     - `process.exit(code?: number): never`
   - more

1. `perf_hooks` (experimental) -- as `Performance` in browsers

1. `child_process` -- spawn child processes in a manner that is similar to `popen(3)`
   - [“How to fix stdio buffering”](https://www.perkin.org.uk/posts/how-to-fix-stdio-buffering.html) and its companion piece [“Buffering in standard streams”](http://www.pixelbeat.org/programming/stdio_buffering/)
   - `child_process.spawn(command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): ChildProcess`
     - command -- console command
     - Pipes are established between the parent application and the child process

1. `cluster` -- allows easy creation of child processes that all share server ports
   ```JavaScript
   const cluster = require('cluster');
   const http = require('http');
   const numCPUs = require('os').cpus().length;

   if (cluster.isMaster) {
     console.log(`Master ${process.pid} is running`);

     // Fork workers.
     for (let i = 0; i < numCPUs; i++) {
       cluster.fork();
     }

     cluster.on('exit', (worker, code, signal) => {
       console.log(`worker ${worker.process.pid} died`);
     });
   } else {
     // Workers can share any TCP connection
     // In this case it is an HTTP server
     http.createServer((req, res) => {
       res.writeHead(200);
       res.end('hello world\n');
     }).listen(8000);

     console.log(`Worker ${process.pid} started`);
   }
   ```

   - A single instance of Node.js runs in a single thread. To take advantage of multi-core systems, the user will sometimes want to launch a cluster of Node.js processes to handle the load
   - The worker processes are spawned using the `child_process.fork()` method, so that they can communicate with the parent via IPC and pass server handles back and forth

1. `worker_threads` -- provides a way to create multiple environments running on independent threads, and to create message channels between them
   - `--experimental-worker` flag
   - useful for performing CPU-intensive JavaScript operations; do not use them for I/O
   - unlike child processes or when using the `cluster` module, can also share memory efficiently by transferring `ArrayBuffer` instances or sharing `SharedArrayBuffer` instances between them

## System and OS

1. `fs` -- file system
   - Promises API -- `require('fs').promises`, refer to docs for methods
   - All the methods have asynchronous and synchronous forms
     - The asynchronous form always takes a completion callback as its last argument
       - no guaranteed ordering when called -- chain the callbacks, or `await`
       - the first and typically only argument of a callback is always reserved for an exception, `null` or `undefined` when resolved
     - the synchronous form any exceptions are immediately thrown
       - Exceptions may be handled using `try/catch,` or they may be allowed to bubble up.
   - While it is not recommended, most fs functions allow the callback argument to be omitted, in which case a default callback is used that rethrows errors
     - To get a trace to the original call site, set the `NODE_DEBUG` environment variable
   - hidden file on windows
     - On Windows, opening an existing hidden file using the `w` flag (either through `fs.open` or `fs.writeFile`) will fail with `EPERM`
     - Existing hidden files can be opened for writing with the `r+` flag
   - `type PathLike = string | Buffer | URL`
     - WHATWG `URL` object support experimental -- `file:` protocol, tbc
   - `fd: number` -- file descriptor, returned by `fs.open()`
   - watch for changes on a file or a director -- `fs.watch()`
     ```TypeScript
     function watch(
         filename: PathLike,
         options: { encoding?: BufferEncoding | null, persistent?: boolean, recursive?: boolean } | BufferEncoding | undefined | null,
         listener?: (event: string, filename: string) => void,
     ): FSWatcher
     ```

     - listener will be attached to the `'change'` event of the returned `FSWatcher`
     - less efficient -- `fs.watchFile(...): void`, `fs.unwatchFile(...): void`
     - `fs.FSWatcher extends events.EventEmitter`
       - event `'change'` -- Emitted when something changes in a watched directory or file: callback -- `(eventType: string, filename: string | Buffer)` -- `eventType` can be `change` or `rename`
       - event `'error'` -- callback -- `(error: Error)`
       - `FSWatcher.close(): void`
   - `fs.access(...): void` -- Tests a user's permissions for the file or directory
     - `fs.accessSync(...): void`
     - Using `fs.access()` to check for the accessibility of a file before calling other `fs` methods is not recommended -- introduces a race condition
     - should open/read/write the file directly and handle the error raised if the file is not accessible
   - rename -- [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html)
     - `fs.rename(oldPath: PathLike, newPath: PathLike, callback: (err: NodeJS.ErrnoException) => void): void`
     - `fs.renameSync(oldPath: PathLike, newPath: PathLike): void`
   - truncate -- [truncate(2)](http://man7.org/linux/man-pages/man2/truncate.2.html)
     - `fs.truncate(path: PathLike, len?: number | undefined | null, callback): void` -- Truncate a file to a specified length, `truncate(2)`
     - `fs.ftruncate(fd: number, len: number | undefined | null, callback): void` -- ftruncate(2) - Truncate a file to a specified length
     - `fs.ftruncateSync(fd: number, len?: number | null): void`
     - `fs.truncateSync(path: PathLike, len?: number | null): void`
     - extend with null bytes when large `len`, `len` default to 0
   - Change ownership -- [chown(2)](http://man7.org/linux/man-pages/man2/chown.2.html)
     - `fs.chown(path: PathLike, uid: number, gid: number, callback): void`
     - `fs.chownSync(path: PathLike, uid: number, gid: number): void`
     - `fs.fchown(fd: number, uid: number, gid: number, callback): void`
     - `fs.fchownSync(fd: number, uid: number, gid: number): void`
     - `fs.lchown(path: PathLike, uid: number, gid: number, callback): void`
   - Change permissions -- [chmod(2)](http://man7.org/linux/man-pages/man2/chmod.2.html)
     - [modes](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_file_modes)
     - `fs.chmod(path: PathLike, mode: string | number, callback): void`
     - `fs.chmodSync(path: PathLike, mode: string | number): void`
     - `fs.fchmod(fd: number, mode: string | number, callback): void`
     - `fs.fchmodSync(fd: number, mode: string | number): void`
     - `fs.lchmod(path: PathLike, mode: string | number, callback): void` -- BSD variant, Does not dereference symbolic links
     - `fs.lchmodSync(path: PathLike, mode: string | number): void`
   - get file status -- [stat(2)](http://man7.org/linux/man-pages/man2/stat.2.html)
     - `fs.stat(path: PathLike, callback: (err: NodeJS.ErrnoException, stats: Stats) => void): void`
     - `fs.statSync(path: PathLike): Stats`
     - `fs.fstat(fd: number, callback: (err: NodeJS.ErrnoException, stats: Stats) => void): void`
     - `fs.fstatSync(fd: number): Stats`
     - `fs.lstat(path: PathLike, callback: (err: NodeJS.ErrnoException, stats: Stats) => void): void`
     - `fs.lstatSync(path: PathLike): Stats`
     - `class Stats`
       - `isFile(): boolean`
       - `isDirectory(): boolean`
       - `isBlockDevice(): boolean`
       - `isCharacterDevice(): boolean`
       - `isSymbolicLink(): boolean` (only valid with fs.lstat())
       - `isFIFO(): boolean`
       - `isSocket(): boolean`
       - coordination -- `util.inspect(stats)` -- `dev: number` `ino: number` `mode: number` `nlink: number` `uid: number` `gid: number` `rdev: number` `size: number` `blksize: number` `blocks: number` `atimeMs: number` `mtimeMs: number` `ctimeMs: number` `birthtimeMs: number` `atime: Date` `mtime: Date` `ctime: Date` `birthtime: Date`
       - a: access, m: modified, c: change
   - link -- [link(2)](http://man7.org/linux/man-pages/man2/link.2.html), [symlink(2)](http://man7.org/linux/man-pages/man2/symlink.2.html), [readlink(2)](http://man7.org/linux/man-pages/man2/readlink.2.html), [unlink(2)](http://man7.org/linux/man-pages/man2/unlink.2.html)
     - `fs.link(existingPath: PathLike, newPath: PathLike, callback): void`
     - `fs.linkSync(existingPath: PathLike, newPath: PathLike): void`
     - `fs.symlink(target: PathLike, path: PathLike, callback): void`  
       `fs.symlink(target: PathLike, path: PathLike, type: symlink.Type | null, callback): void`
     - `fs.symlinkSync(target: PathLike, path: PathLike, type?: symlink.Type | null): void`
     - `symlink.Type = "dir" | "file" | "junction"` -- only available on Windows (ignored on other platforms), defaults to `'file'`
     - `fs.readlink(...): void`
     - `fs.readlinkSync(...): string | Buffer`
     - `fs.unlink(path: PathLike, callback): void`
     - `fs.unlinkSync(path: PathLike): void`
   - path -- [path(3)](http://man7.org/linux/man-pages/man3/realpath.3.html)
     - `fs.realpath(path: PathLike, callback: (err: NodeJS.ErrnoException, resolvedPath: string) => void): void`  
       buffer overload
     - `fs.realpath.native(...): void`
     - `fs.realpathSync(path: PathLike, options?): string | Buffer`
     - `fs.realpathSync(...): ...`
   - dir -- [rmdir(2)](http://man7.org/linux/man-pages/man2/rmdir.2.html), [mkdir(2)](http://man7.org/linux/man-pages/man2/mkdir.2.html), `mkdtemp`, [readdir(3)](http://man7.org/linux/man-pages/man3/readdir.3.html)
     - `fs.rmdir(path: PathLike, callback): void`
     - `fs.rmdirSync(path: PathLike): void`
     - `fs.mkdir(path: PathLike, mode: number | string | MakeDirectoryOptions | undefined | null, callback): void`
     - `fs.mkdirSync(path: PathLike, mode?: number | string | MakeDirectoryOptions | null): void`
     - `fs.mkdtemp(...)`
     - `fs.mkdtempSync(...)`
     - `fs.readdir(path, options?, callback: (err, files: string[] | Buffer[]) => void): void`
     - `fs.readdirSync(path, options?): string[] | Buffer[]`
   - open and close -- [open(2)](http://man7.org/linux/man-pages/man2/open.2.html), [close(2)]
     - `fs.close(fd: number, callback): void`
     - `fs.closeSync(fd: number): void`
     - `fs.open(path: PathLike, flags: string | number, mode: string | number | undefined | null, callback: (err: NodeJS.ErrnoException, fd: number) => void): void`
       - `flags` -- `r`, `w`, `x`, `+`, `a`
     - `fs.openSync(path: PathLike, flags: string | number, mode?: string | number | null): number`
   - modify -- change timestamps
     - `fs.utimes(path: PathLike, atime: string | number | Date, mtime: string | number | Date, callback): void`
     - `fs.utimesSync(path: PathLike, atime: string | number | Date, mtime: string | number | Date): void`
     - `fs.futimes(fd: number, atime: string | number | Date, mtime: string | number | Date, callback): void`
     - `fs.futimesSync(fd: number, atime: string | number | Date, mtime: string | number | Date): void`
   - write and read
     ```TypeScript
     function write<TBuffer extends BinaryData>(
         fd: number,
         buffer: TBuffer,
         offset: number | undefined | null,
         length: number | undefined | null,
         position: number | undefined | null,
         callback: (err: NodeJS.ErrnoException, written: number, buffer: TBuffer) => void,
     ): void;
     function writeSync(fd: number, buffer: BinaryData, offset?: number | null, length?: number | null, position?: number | null): number;
     function writeFile(path: PathLike | number, data: any, options: WriteFileOptions, callback: (err: NodeJS.ErrnoException) => void): void;
     function writeFile(path: PathLike | number, data: any, callback: (err: NodeJS.ErrnoException) => void): void;
     ///////////////////
     function appendFile(file: PathLike | number, data: any, options: WriteFileOptions, callback: (err: NodeJS.ErrnoException) => void): void;
     function appendFile(file: PathLike | number, data: any, callback: (err: NodeJS.ErrnoException) => void): void;
     function appendFileSync(file: PathLike | number, data: any, options?: WriteFileOptions): void;
     ///////////////////
     function read<TBuffer extends BinaryData>(
         fd: number,
         buffer: TBuffer,
         offset: number,
         length: number,
         position: number | null,
         callback?: (err: NodeJS.ErrnoException, bytesRead: number, buffer: TBuffer) => void,
     ): void;
     function readSync(fd: number, buffer: BinaryData, offset: number, length: number, position: number | null): number;
     function readFile(
         path: PathLike | number,
         options: { encoding?: string | null; flag?: string; } | string | undefined | null,
         callback: (err: NodeJS.ErrnoException, data: string | Buffer) => void,
     ): void;
     function readFileSync(path: PathLike | number, options?: { encoding?: string | null; flag?: string; } | string | null): string | Buffer;
     ```

   - read and write stream
     ```TypeScript
     function createReadStream(path: PathLike, options?: string | {
         flags?: string;
         encoding?: string;
         fd?: number;
         mode?: number;
         autoClose?: boolean;
         start?: number;
         end?: number;
         highWaterMark?: number;
     }): ReadStream;
     /////////////
     function createWriteStream(path: PathLike, options?: string | {
         flags?: string;
         encoding?: string;
         fd?: number;
         mode?: number;
         autoClose?: boolean;
         start?: number;
     }): WriteStream;
     ```

     - `ReadStream extends stream.Readable`
       - event
         - `(event: "open", listener: (fd: number) => void): this`
         - `(event: "close", listener: () => void): this`
         - `(event: "ready", listener: () => void): this` -- ready to be used. Fires immediately after `'open'`
       - `ReadStream.bytesRead: number` -- The number of bytes read so far
       - `ReadStream.path: string | Buffer`
     - `WriteStream extends stream.Writable`
       - event -- as `ReadStream`
       - `WriteStream.bytesRead: number`
       - `WriteStream.path: string | Buffer`
   - copy file
     - `fs.copyFile(src: PathLike, dest: PathLike, callback): void`  
       `fs.copyFile(src: PathLike, dest: PathLike, flags: number, callback): void`
     - `fs.copyFileSync(src: PathLike, dest: PathLike, flags?: number): void`
   - more tbc

1. `os` -- provides a number of operating system-related utility methods
   - `hostname(): string`
   - `loadavg(): number[]`
   - `uptime(): number`
   - `freemem(): number`
   - `totalmem(): number`
   - `cpus(): CpuInfo[]`
   - `type(): string`
   - `release(): string`
   - `networkInterfaces(): { [index: string]: NetworkInterfaceInfo[] }`
   - `homedir(): string`
   - `userInfo(options?: { encoding: string }): { username: string, uid: number, gid: number, shell: any, homedir: string }`
   - `arch(): string`
   - `platform(): NodeJS.Platform`
   - `tmpdir(): string`
   - `endianness(): "BE" | "LE"`
   - `const EOL: string`
   - `more`

1. `path` -- utilities for working with file and directory paths
   ```
   ┌─────────────────────┬────────────┐
   │          dir        │    base    │
   ├──────┬              ├──────┬─────┤
   │ root │              │ name │ ext │
   "  /    home/user/dir / file  .txt "
   └──────┴──────────────┴──────┴─────┘
   ┌─────────────────────┬────────────┐
   │          dir        │    base    │
   ├──────┬              ├──────┬─────┤
   │ root │              │ name │ ext │
   " C:\      path\dir   \ file  .txt "
   └──────┴──────────────┴──────┴─────┘
   ```

   - when working with Windows file paths -- `path.win32`
   - working with POSIX file paths -- `path.posix`
   - `path.normalize(p: string): string` -- normalizes the given path, resolving `'..'` and `'.'` segments, normalize `path.delimiter`
   - `path.join(...paths: string[]): string` -- Join all arguments together and normalize the resulting path
   - `isAbsolute(path: string): boolean`
   - `relative(from: string, to: string): string`
   - `dirname(p: string): string`
   - `basename(p: string, ext?: string): string`
   - `extname(p: string): string`
   - `parse(pathString: string): ParsedPath` -- get root, dir, base, name, and ext
   - `format(pathObject: FormatInputPathObject): string` -- reverse of `parse()`
   - `const sep: '\\' | '/'`
   - `const delimiter: ';' | ':'`
   - more

1. `tty` -- provides the `tty.ReadStream` and `tty.WriteStream` classes
   - When Node.js detects that it is being run with a text terminal ("TTY") attached, `process.stdin` will, by default, be initialized as an instance of `tty.ReadStream` and both `process.stdout` and `process.stderr` will, by default be instances of `tty.WriteStream`
     ```shell
     $ node -p -e "Boolean(process.stdout.isTTY)"
     true
     $ node -p -e "Boolean(process.stdout.isTTY)" | cat
     false
     ```

   - more

## Node.js utilities

1. `repl` -- provides a Read-Eval-Print-Loop (REPL) implementation that is available both as a standalone program or includible in other applications
   - Design and Features -- `repl.start(...)` creates `repl.REPLServer`, which will act as REPL
     - input and output may be connected to any `Stream`
     - evaluation can be overridden by passing in an alternative evaluation function when the `repl.REPLServer` instance is created
     - possible to expose a variable to the REPL explicitly by assigning it to the `REPLServer.context` object
   - Commands in REPL -- `.`, `.help`
     - `.break` -- When in the process of inputting a multi-line expression, entering the .break command (or pressing the `<ctrl>-C` key combination) will abort further input or processing of that expression
     - `.clear` -- Resets the REPL context to an empty object and clears any multi-line expression currently being input
     - `.exit` -- Close the I/O stream, causing the REPL to exit
     - `.help` -- Show this list of special commands
     - `.save` -- Save the current REPL session to a file: `> .save ./file/to/save.js`
     - `.load` -- Load a file into the current REPL session. `> .load ./file/to/load.js`
     - `.editor` -- Enter editor mode (`<ctrl>-D` to finish, `<ctrl>-C` to cancel)
   - Special keys
     - `<ctrl>-C` -- When pressed once, has the same effect as the `.break` command. When pressed twice on a blank line, has the same effect as the `.exit` command
     - `<ctrl>-D` -- Has the same effect as the `.exit` command
     - `<tab>` -- When pressed on a blank line, displays global and local(scope) variables. When pressed while entering other input, displays relevant autocompletion options
   - variables
     - modules available as module name
     - `_` -- ans
   - `--experimental-repl-await` -- Enable experimental top-level `await` keyword support in REPL
   - more

1. `async_hooks` experimental
   - provides an API to register callbacks tracking the lifetime of asynchronous resources created inside a Node.js application

1. ECMAScript Modules -- `--experimental-modules`

1. `util`
   - `util.format(format: any, ...param: any[]): string` -- `printf`-like
     - `%s` - String
     - `%d` - Number (integer or floating point value)
     - `%i` - Integer
     - `%f` - Floating point value
     - `%j` - JSON. Replaced with the string `'[Circular]'` if the argument contains circular references
     - `%o` - Object. A string representation of an object with generic JavaScript object formatting. Similar to `util.inspect()` with options `{ showHidden: true, depth: 4, showProxy: true }`. This will show the full object including non-enumerable symbols and properties
     - `%O` - Object. A string representation of an object with generic JavaScript object formatting. Similar to `util.inspect()` without options. This will show the full object not including non-enumerable symbols and properties
     - `%%` - single percent sign ('%'). This does not consume an argument
   - `util.callbackify(...): Function` -- Takes an `async` function (or a function that returns a Promise) and returns a function following the error-first callback style
   - `util.promisify(...): Promise` -- Takes a function following the common error-first callback style, i.e. take callback as the last argument, and returns a version that returns promises
      - `this` is lost if not bound
   - `util.debuglog(key: string): (msg: string, ...param: any[]) => void` -- create a `console.error()` like function that conditionally writes debug messages to `stderr` based on the existence of the `NODE_DEBUG` environment variable
   - `util.deprecate<T extends Function>(fn: T, message: string): T` -- wraps the given function or class in such a way that it is marked as deprecated
     - emit a `DeprecationWarning` using the `process.on('warning')` event
     - By default, this warning will be emitted and printed to `stderr` exactly once, the first time it is called
     - behavior controlled by command line flags and `process` properties
   - `util.getSystemErrorName(err: number): string` -- Returns the string name for a numeric error code that comes from a Node.js API
     - [Common System Errors](https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors)
     - typically `Error.errno: number` as parameter
   - `util.inspect(...): string` -- returns a string representation of object that is primarily useful for debugging. Additional options may be passed that alter certain aspects of the formatted string
   - `util.isDeepStrictEqual(val1: any, val2: any): boolean`
   - `util.TextDecoder` -- An implementation of the WHATWG Encoding Standard, support some encodings using the full [ICU](https://en.wikipedia.org/wiki/International_Components_for_Unicode) data
     ```TypeScript
     class TextDecoder {
         readonly encoding: string; // defaults to 'utf-8'
         readonly fatal: boolean; // defaults to false
         readonly ignoreBOM: boolean; // byte order mark, defaults to `false`
         constructor(
           encoding?: string,
           options?: { fatal?: boolean; ignoreBOM?: boolean }
         );
         decode(
           input?: NodeJS.TypedArray | DataView | ArrayBuffer | null,
           options?: { stream?: boolean } // true if additional chunks are expected, defaults to false
         ): string;
     }
     ```

     - encodings -- `utf-8`, `utf-16`, more
   - `util.TextEncoder` -- An implementation of the WHATWG Encoding Standard, only support UTF-8 encoding
     ```TypeScript
     class TextEncoder {
         readonly encoding: string;
         constructor();
         encode(input?: string): Uint8Array;
     }
     ```

   - `util.types` -- type checks for different kinds of built-in objects, usually have the overhead of calling into C++, primarily useful for addon developers who prefer to do type checking in JavaScript
     - `util.types.isXxx(...): boolean`

1. `v8` -- exposes APIs that are specific to the version of V8 built into the Node.js binary

1. `vm` -- provides APIs for compiling and running code within V8 Virtual Machine contexts

1. C++ addons

1. N-API -- Application Binary Interface (ABI) stable across versions of Node.js

# npm

1. docs
   - [official site](https://docs.npmjs.com/), [official site](https://docs.npmjs.com/all)
   - `npm help npm`
   - `npm help <term>`
   - package search -- [npms](https://npms.io/), [npm](https://www.npmjs.com/search?q=), `npm search`

1. `npm help <term> [<terms..>]`

1. `npm install`, `npm i`
   ```
   npm install (with no args, in package dir)
   npm install [<@scope>/]<name>
   npm install [<@scope>/]<name>@<tag>
   npm install [<@scope>/]<name>@<version>
   npm install [<@scope>/]<name>@<version range>
   npm install <git-host>:<git-user>/<repo-name>
   npm install <git repo url>
   npm install <tarball file>
   npm install <tarball url>
   npm install <folder>
   ```

   - common options
     - `[-P|--save-prod|-D|--save-dev|-O|--save-optional]`
     - `[-E|--save-exact]`
     - `[-B|--save-bundle]`
     - `[--no-save]`
     - `[--dry-run]`
   - With the `--production` flag (or when the `NODE_ENV` environment variable is set to production), npm will not install modules listed in `devDependencies`
   - scope -- a way of grouping related packages together, and also affect a few things about the way npm treats the package
     - `@types`
   - more

1. `npm uninstall ...`
   ```
   npm uninstall [<@scope>/]<pkg>[@<version>]... [-S|--save|-D|--save-dev|-O|--save-optional|--no-save]
   aliases: remove, rm, r, un, unlink
   ```

   - options correspond to `dependencies`, `devDependencies`, `optionalDependencies`

1. `npm update [...]`
   ```
   npm update [-g] [<pkg>...]
   aliases: up, upgrade
   ```

   - update npm -- `npm install npm -g`, `npm install npm@latest -g`

1. `npm outdated` -- check the registry to see if any (or, specific) installed packages are currently outdated
   ```
   npm outdated [[<@scope>/]<pkg> ...]
   ```

1. `npm list`
   ```
   npm ls [[<@scope>/]<pkg> ...]
   aliases: list, la, ll
   ```

1. `npm config`, `npm c` -- gets its config settings from the command line, environment variables, `npmrc` files, and in some cases, the `package.json` file
   ```shell
   npm config set <key> <value> [-g|--global] # value defaults to true
   npm config get <key>
   npm config delete <key>
   npm config list [-l] [--json] # Show all the config settings, -l also show defaults
   ############################### --json show the settings in json format
   npm config edit # --global flag to edit the global config
   npm get <key>
   npm set <key> <value> [-g|--global]
   ```

   - `npmrc`
     - four
       - per-project config file (/path/to/my/project/.npmrc)
       - per-user config file (~/.npmrc)
       - global config file ($PREFIX/etc/npmrc)
       - npm builtin config file (/path/to/npm/npmrc)
     - `key = value`
     - Environment variables -- `prefix = ${HOME}/.npm-packages`
     - array values -- `key[] = "first value"`, `key[] = "second value"`
     - line comment -- `;`, `#`

1. `npm link`, `npm ln` -- Symlink a package folder
   ```shell
   npm link (in package dir) # creates global link
   npm link [<@scope>/]<pkg>[@<version>] # link-install the package
   ```

   - two step
     - First, `npm link` in a package folder will create a symlink in the global folder that links to the package where the `npm link` command was executed
     - Next, in some other location, create a symbolic link from globally-installed `package-name` to `node_modules/` of the current folder
   - two step in one -- specify the package to link-install as a path can be resolved
     ```
     npm link ../node-redis
     ```

1. `npm init`
   ```
   npm init [--force|-f|--yes|-y|--scope]
   npm init <@scope> (same as `npx <@scope>/create`)
   npm init [<@scope>/]<name> (same as `npx [<@scope>/]create-<name>`)
   ```

1. `package.json`
   - [npm doc](https://docs.npmjs.com/files/package.json)
   - [based on the CommonJS module system recommendations](http://wiki.commonjs.org/wiki/Packages/1.0#Package_Descriptor_File)
   - `name` -- The name of the package—required
   - `version` -- The current version conforming to semantic version requirements—required
   - `description` -- The package description
   - `keywords` -- An array of search terms
   - `maintainers` -- An array of package maintainers (includes name, email, and website)
   - `contributors` -- An array of package contributors (includes name, email, and website)
   - `bugs` -- The URL where bugs can be submitted
   - `licenses` -- An array of licenses
   - `repository` -- The package repository
   - `dependencies` -- Prerequisite packages and their version numbers

1. publish
   - [npm](https://docs.npmjs.com/misc/developers)
   - a `directories` field in `package.json`
     ```json
     "directories" : {
     "doc" : ".",
     "test" : "test",
     "example" : "examples"
     }
     ```

   - `npm adduser`
   - `npm publish`

# Popular Node Modules

1. `async` -- collections and flow control
   - [github](https://github.com/caolan/async)

1. `commander` -- Command-Line Magic

1. `underscore` or `lodash`

1. unit test
   - `mocha`
   - `tape`
   - `jest`, `ts-jest`
   - `alsatian`
   - `chai-immutable`

1. `forever` -- restarts if crashed

1. `loadtest`

## Koa

1. philosophy -- middleware
   - A Koa application is an object containing an array of middleware functions
   - executed in a stack-like manner upon request

1. hello world
   ```JavaScript
   const Koa = require('koa');
   const app = new Koa();
   app.use(async ctx => {
     ctx.body = 'Hello World';
   });
   app.listen(3000);
   ```

1. cascading
   - downstream
   - upstream -- `await next()`

1. settings
   - `app.env` defaulting to the NODE_ENV or "development"
   - `app.proxy` when true proxy header fields will be trusted
   - `app.subdomainOffset` offset of .subdomains to ignore [2]

1. `class Application`
   - `Application.listen()` -- `http.Server.listen()`  
     `Application.callback()` -- return callback functions
     ```JavaScript
     const http = require('http');
     const https = require('https');
     const Koa = require('koa');
     const app = new Koa();
     http.createServer(app.callback()).listen(3000); // equivalent to app.listen(3000)
     https.createServer(app.callback()).listen(3001);
     ```
   - `Application.use()` -- Add the given middleware function to this application
     - [middleware](https://github.com/koajs/koa/wiki#middleware)
   - `Application.key: KeyGrip | string[]` -- set signed cookie keys, used when signing cookies with
     ```JavaScript
     ctx.cookies.set('name', 'tobi', { signed: true });
     ```
   - `Application.context` -- the prototype from which `ctx` is created, may add additional properties
   - error handling
     - outputs all errors to `stderr` unless `app.silent` is `true`, except when `err.status` is 404 or `err.expose` is `true`
     - custom error-handling
       ```JavaScript
       app.on('error', (err, ctx) => {
         log.error('server error', err, ctx)
       });
       ```
       if an error is in the req/res cycle and it is not possible to respond to the client, the `Context` instance is also passed

1. context
   - `Context.req` -- `http.IncomingMessage` -- request in `http`
   - `Context.res` -- `http.ServerResponse` -- response in `http`
     - Bypassing Koa's response handling is not supported. Avoid using the following node properties:
       - `res.statusCode`
       - `res.writeHead()`
       - `res.write()`
       - `res.end()`
   - `Context.state` -- for frontend use
   - `Context.app` -- Application instance reference
   - `ctx.cookies.get(name, [options])`
   - `ctx.cookies.set(name, value, [options])`
