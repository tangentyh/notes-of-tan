# Docs

1. [JavaScript reference - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)

1. [ECMA-262 Github](https://tc39.github.io/ecma262/)
   - [ECMA official](http://www.ecma-international.org/ecma-262/)
   - [ECMA official ES6](http://www.ecma-international.org/ecma-262/6.0/index.html)

1. W3C: [JS Web APIs](https://www.w3.org/standards/webdesign/script)

1. [ESLint](https://eslint.org/docs/rules/)

1. [puzzles](http://javascript-puzzlers.herokuapp.com/)

# Miscellaneous

1. ES6 to earlier: [babel.js](https://babeljs.io/)

1. promisify and `this`
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

1. string format
   ```javascript
   let soMany = 10;
   console.log(`This is ${soMany} times easier!`);
   // "This is 10 times easier!
   ```

   - from ES6
   - notice backticks in lieu of quotes

1. swap
   ```javascript
   b = [a, a=b][0];
   [b, a] = [a, b]; // ES6
   ```

1. `0` and `-0`
   ```javascript
   1 / x === 1 / Math.abs(x);
   Object.is(-0, +0) // ES6
   ```

   - in `Math.atan()`

1. equivalent of `zip` in python
   ```javascript
   zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c])); // ES6
   ```

1. equivalent of `range` in python
   ```javascript
   Array.apply(null, Array(5)).map(function (_, i) {return i;});
   [...Array(10).keys()]; // ES6
   Array.from({length: 10}, (x, i) => i); // ES6
   ```

1. shallow copy an array
   ```javascript
   new Array(...arr); // arr.length > 1;
   Array.of(...arr);
   arr.slice(0);
   [...arr];
   Array.from(arr);
   ```

   from fast to slow

1. floor division
   ```javascript
   (a/b | 0); // (a/b << 0)
   ```

# Lexical grammar

1. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar)

1. comments
   - `#!` hashbang stage 3

1. literals
   - `null`
   - boolean
   - numbers
     - `0x`, `0o`, `0b`, also capitalized
     - `0888` is 888, `0777` is 511, not strict mode
   - object
     ```java
     let iterable = {
       [Symbol.iterator]() {
         return {
           i: 0,
           next() {
             if (this.i < 3) {
               return { value: this.i++, done: false };
             }
             return { value: undefined, done: true };
           }
         };
       }
     };
     ```
   - array
   - string
     ```javascript
     '\xA9' // "©", in the range 0x0000 to 0x00FF
     '\u00A9' // "©" (U+A9), For code points U+0000 to U+FFFF
     '\uD87E\uDC04' // larger range if two combined
     '\u{2F804}'
     ```
   - regular expression
   - template literals

1. Automatic semicolon insertion

# Statements

## Flow Control

1. blocks -- used to group zero or more statements
   - delimited by a pair of curly brackets
   - and may optionally be labelled

1. empty -- An empty statement is used to provide no statement, although the JavaScript syntax would expect one
   ```
   ;
   ```

1. `break` -- terminates the current loop, switch, or label statement

1. `continue`
   - also label

1. `if...else`

1. `switch`
   - `===`
   - scope
     ```JavaScript
     const action = 'say_hello';
     switch (action) {
       case 'say_hello':
         let message = 'hello';
         console.log(message);
         break;
       case 'say_hi':
         let message = 'hi';
         console.log(message);
         break;
       default:
         console.log('Empty action received.');
         break;
     }
     ```
     - result -- `Uncaught SyntaxError: Identifier 'message' has already been declared`
     - fix -- add brackets
   - expression condition
     ```javascript
     switch (true) {
       case num < 0: alert(“Less than 0.”); break;
       case num >= 0 && num <= 10: alert(“Between 0 and 10.”); break;
       case num > 10 && num <= 20: alert(“Between 10 and 20.”); break;
       default: alert(“More than 20.”);
     }
     ```

1. `try...catch`, `finally`
   - cannot `break` when unlabelled
   - catch by type
     ```javascript
     try {
       myroutine(); // may throw three types of exceptions
     } catch (e) {
       if (e instanceof TypeError) {
         // statements to handle TypeError exceptions
       } else if (e instanceof RangeError) {
         // statements to handle RangeError exceptions
       } else if (e instanceof EvalError) {
         // statements to handle EvalError exceptions
       } else {
         // statements to handle any unspecified exceptions
         logMyErrors(e); // pass exception object to error handler
       }
     }
     ```
   - optional catch binding -- stage 4
     ```javascript
     try {
       // ...
     } catch {
       // ...
     }
     ```
   - `finally` return value surpasses return value in `try` and `catch`
     ```javascript
     console.log((() => {
       try {
         return 1;
       } finally {
         return 2;
       }
     })()); // 2
     ```

1. `throw`
   - throw expression or `new Error`

## Declarations

1. `var`
   - scope -- current execution context (function)
   - variable hoisting
   - Undeclared variables are always global, Undeclared variables do not exist until the code assigning to them is executed, Undeclared variables are configurable (e.g. can be deleted)
     ```
     function x() {
       y = 1;   // Throws a ReferenceError in strict mode
       var z = 2;
     }
     x();
     console.log(y); // logs "1"
     console.log(z); // Throws a ReferenceError: z is not defined outside x
     console.log(a); // ReferenceError
     delete this.x; // Throws a TypeError in strict mode. Fails silently otherwise.
     delete this.y; // true
     ```

1. `let`
   - temporal dead zone
     ```javascript
     // prints out 'undefined'
     console.log(typeof undeclaredVariable);
     // results in a 'ReferenceError', TDZ
     console.log(typeof i);
     let i = 10;
     n = {a: [1, 2, 3]};
     for (let n of n.a) { // ReferenceError, TDZ
       console.log(n);
     }
     ```

1. `const`

## function and class

1. `function`
   - variable hoisting
   - Conditionally created functions -- results are inconsistent across implementations
   - function expressions are not hoisted

1. `function*` -- returns `Generator` object
   - `GeneratorFunction` constructor
     ```javascript
     const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor
     ```
     - generator function created with the `GeneratorFunction` constructor do not create closures to their creation contexts; they always are created in the global scope

1. `async function` -- returns an `AsyncFunction` object
   - `AsyncFunction` constructor
     ```javascript
     const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
     ```
     - async functions created with the `AsyncFunction` constructor do not create closures to their creation contexts; they are always created in the global scope

1. `return`

1. `class`
   - unlike the class expression, the class declaration doesn't allow an existing class to be declared again and will throw a type error if attempted.
   - The class body of a class declaration is executed in strict mode
   - The constructor property is optional.
   - not hoisted

## Iterations

1. `do...while`

1. `while`

1. `for`
   - `for` without a statement
     ```javascript
     for (
       var oItNode = document.getElementById(sId); /* initialization */
       oItNode; /* condition */
       nLeft += oItNode.offsetLeft, nTop += oItNode.offsetTop, oItNode = oItNode.offsetParent /* final-expression */
     ); /* semicolon, mandatory here */
     ```

1. `for...in` -- iterates over all non-Symbol, enumerable properties of an object
   - arbitrary order
   - Iterating over own properties only
     - `type PropertyKey = string | number | symbol`, number will be converted to string
     - `Object.prototype.hasOwnProperty(v: PropertyKey): boolean`
     - `Object.prototype.propertyIsEnumerable(v: PropertyKey): boolean`
     - `Object.getOwnPropertyNames(o: any): string[]`
     - `Object.keys(o: any): string[]`, `Object.entries()`, `Object.values()`

1. `for...of` -- `Symbol.iterator` hook

1. `for await...of` -- `Symbol.asyncIterator` hook, also sync iterables

## Others

1. `debugger`

1. `import`
   - hoist
   - strict mode

1. `export`
   - strict mode

1. `import.meta` -- a meta-property exposing context-specific meta data to a JavaScript module

# Expressions and operators

## Primary expressions

1. `this`

# Typed Arrays

1. Typed Arrays
   - WebGL deals with complex calculations requiring predictable precision, standard JavaScript numbers do not work
   - WebGL introduces the concept of typed arrays, which are arrays whose items are set to be values of a particular type
   - `ArrayBuffer`
     - a generic, fixed-length raw binary data buffer
     - cannot directly manipulate the contents
     - create one of the typed array objects or a `DataView` object which represents the buffer in a specific format, and use that to read and write the contents of the buffer
     - constructor: `ArrayBuffer(byteLength: number)`
     - `ArrayBuffer.prototype.byteLength` Read only -- The size, in bytes, of the array

1. Views -- `DataView`
   - An array buffer view is a particular way of using the bytes within an array buffer
   - constructor: `DataView(buffer: ArrayBuffer, byteOffset?: number, byteLength?)`
   - properties: from constructor
     - `DataView.prototype.buffer` Read only -- The ArrayBuffer referenced by this view. Fixed at construction time and thus read only
     - `DataView.prototype.byteLength` Read only -- The length (in bytes) of this view from the start of its ArrayBuffer. Fixed at construction time and thus read only
     - `DataView.prototype.byteOffset` Read only -- The offset (in bytes) of this view from the start of its ArrayBuffer. Fixed at construction time and thus read only
   - read methods: return a number
     - `DataView.prototype.getInt8(byteOffset)` -- Gets a signed 8-bit integer (byte) at the specified byte offset from the start of the view
     - `DataView.prototype.getUint8(byteOffset)` -- Gets an unsigned 8-bit integer (unsigned byte) at the specified byte offset from the start of the view
     - `DataView.prototype.getInt16(byteOffset, littleEndian?: boolean)` -- Gets a signed 16-bit integer (short) at the specified byte offset from the start of the view
     - `DataView.prototype.getUint16(byteOffset, littleEndian?: boolean)` -- Gets an unsigned 16-bit integer (unsigned short) at the specified byte offset from the start of the view
     - `DataView.prototype.getInt32(byteOffset, littleEndian?: boolean)` -- Gets a signed 32-bit integer (long) at the specified byte offset from the start of the view
     - `DataView.prototype.getUint32(byteOffset, littleEndian?: boolean)` -- Gets an unsigned 32-bit integer (unsigned long) at the specified byte offset from the start of the view
     - `DataView.prototype.getFloat32(byteOffset, littleEndian?: boolean)` -- Gets a signed 32-bit float (float) at the specified byte offset from the start of the view
     - `DataView.prototype.getFloat64(byteOffset, littleEndian?: boolean)` -- Gets a signed 64-bit float (double) at the specified byte offset from the start of the view
   - write methods
     - `DataView.prototype.setInt8(byteOffset, value)` -- Stores a signed 8-bit integer (byte) value at the specified byte offset from the start of the view
     - `DataView.prototype.setUint8(byteOffset, value)` -- Stores an unsigned 8-bit integer (unsigned byte) value at the specified byte offset from the start of the view
     - `DataView.prototype.setInt16(byteOffset, value, littleEndian?)` -- Stores a signed 16-bit integer (short) value at the specified byte offset from the start of the view
     - `DataView.prototype.setUint16(byteOffset, value, littleEndian?)` -- Stores an unsigned 16-bit integer (unsigned short) value at the specified byte offset from the start of the view
     - `DataView.prototype.setInt32(byteOffset, value, littleEndian?)` -- Stores a signed 32-bit integer (long) value at the specified byte offset from the start of the view
     - `DataView.prototype.setUint32(byteOffset, value, littleEndian?)` -- Stores an unsigned 32-bit integer (unsigned long) value at the specified byte offset from the start of the view
     - `DataView.prototype.setFloat32(byteOffset, value, littleEndian?)` -- Stores a signed 32-bit float (float) value at the specified byte offset from the start of the view
     - `DataView.prototype.setFloat64(byteOffset, value, littleEndian?)` -- Stores a signed 64-bit float (double) value at the specified byte offset from the start of the view

1. Typed Views  
   | Type | Value Range | Description | Web IDL type | Equivalent C type |
   | ---- | ----------- | ----------- | ------------ | ----------------- |
   | `Int8Array` | -128 to 127 | 8-bit two's complement signed integer | byte | `int8_t` |
   | `Uint8Array` | 0 to 255 | 8-bit unsigned integer | octet | `uint8_t` |
   | `Uint8ClampedArray` | 0 to 255 | 8-bit unsigned integer (clamped) | octet | `uint8_t` |
   | `Int16Array` | -32768 to 32767 | 16-bit two's complement signed integer | short | `int16_t` |
   | `Uint16Array` | 0 to 65535 | 16-bit unsigned integer | unsigned short | `uint16_t` |
   | `Int32Array` | -2147483648 to 2147483647 | 32-bit two's complement signed integer | long | `int32_t` |
   | `Uint32Array` | 0 to 4294967295 | 32-bit unsigned integer | unsigned long | `uint32_t` |
   | `Float32Array` | 1.2x10-38 to 3.4x1038 | 32-bit IEEE floating point number ( 7 significant digits e.g. 1.1234567) | unrestricted float | `float` |
   | `Float64Array` | 5.0x10-324 to 1.8x10308 | 64-bit IEEE floating point number (16 significant digits e.g. 1.123...15) | unrestricted double | `double` |

   - act like regular arrays with the exception that their elements must be of a particular data type
     - methods of `Array` are available, and more
     - when setting, the number is stored as the modulo of the largest possible number
     - additional method: `TypedArray.prototype.subarray(begin, end): TypedArray`
       - difference with `slice()`: this is creating a new view on the existing buffer; changes to the new object's contents will impact the original object and vice versa
       - begin and end is clamped to the valid index range for the current array; if the computed length of the new array would be negative, it's clamped to zero. If either begin or end is negative, it refers to an index from the end of the array instead of from the beginning
   - inherits: `DataView`
   - constructor
     ```javascript
     new TypedArray(); // new in ES2017
     new TypedArray(length);
     new TypedArray(typedArray);
     new TypedArray(object);
     new TypedArray(buffer [, byteOffset [, length]]);
     ```

   - properties of constructors
     - `name`: constructor name
     - `length`
     - `BYTES_PER_ELEMENT`: help determine length when build from `ArrayBuffer`
   - The contents are initialized to 0

## Advanced???

1. Advanced Functions: ???
   - Safe Type Detection
     ```javascript
     function isArray(value) {
         return Object.prototype.toString.call(value) == "[object Array]";
         // false for COM
     }
     ```

     largely in use for identifying the native or library
   - Scope-Safe Constructors: prevent call without `new`
     ```javascript
     function Person(name, age, job) {
         if (this instanceof Person) {
             this.name = name;
             this.age = age;
             this.job = job;
         } else {
             return new Person(name, age, job);
         }
     }
     ```

     under this circumstance constructor stealing must be used with prototype chaining or parasitic combination
   - Lazy Loading Functions
     - manipulating the function the first time it is called
       ```javascript
       function createXHR() {
           if (typeof XMLHttpRequest != "undefined") {
               createXHR = function () {
                   return new XMLHttpRequest();
               };
           }
       }
       ```

     - return a new anonymous function
   - `Function.prototype.bind(thisArg: any, ...argArray: any[])` -- creates a new bound function (BF)
     - creates a new function that, when called, has its `this` keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called
       - more overhead
     - thisArg
       - The value is ignored if the bound function is constructed using the `new` operator
       - When using bind to create a function(supplied as a callback) inside a `setTimeout()`, any primitive value passed as `thisArg` is converted to object
       - If no arguments are provided to bind, the `this` of the executing scope is treated as the `thisArg` for the new function
     - internally when without `new` -- `Function.prototype.call([[BoundThis]], [[BoundArguments]], args)`
     - example
       ```javascript
       var slice = Array.prototype.slice;
       slice.apply(arguments);
       var unboundSlice = Array.prototype.slice;
       var slice = Function.prototype.apply.bind(unboundSlice);
       slice(arguments);
       ```

# ECMAScript

## Object

1. Tamper-Proof Objects
   - for individual properties: manually set each property’s `[[Configurable]]`, `[[Writable]]`, `[[Enumerable]]`, `[[Value]]`, `[[Get]]`, and `[[Set]]` attributes to alter how the property behaves
   - once an object has been made tamper-proof, the operation cannot be undone
   - corresponding modification fails silently or by throwing a `TypeError` (most commonly, but not exclusively, when in strict mode)
   - `Object.preventExtensions(o: any): any` -- Prevents any extensions of an object
     - `__proto__` also become immutable
   - `Object.isExtensible(o: any): boolean` -- Determines if extending of an object is allowed
   - `Object.seal(o: any): any` -- seals an object, preventing new properties from being added to it and marking all existing properties as non-configurable. Values of present properties can still be changed as long as they are writable
     - non-extensible and `[[configurable]]` set to `false`
   - `Object.isSealed(o: any): boolean` -- Determines if an object is sealed
   - `Object.freeze(o: any): any` -- freezes an object: that is, prevents new properties from being added to it; prevents existing properties from being removed; and prevents existing properties, or their enumerability, configurability, or writability, from being changed, it also prevents the prototype from being changed
     - non-extensible, sealed and property value cannot be changed
   - `Object.isFrozen(o: any): boolean` -- Determines if an object was frozen

## Error Handling

### try catch and errors

1. Syntax
   ```javascript
   try {
       //
   } catch (error) {
       //
   } finally {
       //
   }
   ```

   - Unlike other languages, you must define a name for the `Error` object even if you don’t intend to use it
   - nothing that can be done in the `try` or `catch` portion of the statement to prevent the code in finally from executing, which includes using a `return` statement
   - If `finally` is provided, then `catch` becomes optional, and vice versa
     - IE7 and earlier had a bug where the code in `finally` would never be executed unless there was also a `catch`

1. `Error`
   - constructor: `Error(message?: string)`
     - can be used as a function (without `new`)
   - properties and methods
     - `Error.prototype.message` -- Error message
     - `Error.prototype.name` -- Error name
     - `Error.prototype.toString()` -- Returns a string (`Error: ${error.message}`) representing the specified object. Overrides the `Object.prototype.toString()` method
   - nonstandard but widely support properties
     - `Error.prototype.stack` -- Stack trace

1. Error Types
   ```javascript
   try {
       foo.bar();
   } catch (e) {
       if (e instanceof ReferenceError) {
           console.log(e.name + ': ' + e.message);
       } else if (e instanceof RangeError) {
           console.log(e.name + ': ' + e.message);
       }
       // ... etc
   }
   ```

   - constructor name is the same as error type name, and similar to `Error()`
   - `EvalError` -- Creates an instance representing an error that occurs regarding the global function `eval()`
     - This exception is not thrown by JavaScript anymore, however the `EvalError` object remains for compatibility
   - `RangeError` -- Creates an instance representing an error that occurs when a numeric variable or parameter is outside of its valid range
   - `ReferenceError` -- Creates an instance representing an error when a non-existent variable is referenced
   - `SyntaxError` -- Creates an instance representing a syntax error when trying to interpret syntactically invalid code
   - `TypeError` -- Creates an instance representing an error that occurs when a variable or parameter is not of a valid type
   - `URIError` -- Creates an instance representing an error that occurs when `encodeURI()` or `decodeURI()` are passed invalid parameters

1. Custom Error Types
   - ES6
     ```javascript
     class CustomError extends Error {
         constructor(foo = 'bar', ...params) {
             // Pass remaining arguments
             // (including vendor specific ones) to parent constructor
             super(...params);

             // Maintains proper stack trace for where our error was thrown (only available on V8)
             if (Error.captureStackTrace) {
                 Error.captureStackTrace(this, CustomError);
             }

             // Custom debugging information
             this.foo = foo;
             this.date = new Date();
         }
     }

     try {
         throw new CustomError('baz', 'bazMessage');
     } catch (e) {
         console.log(e.foo); //baz
         console.log(e.message); //bazMessage
         console.log(e.stack); //stacktrace
     }
     ```

     - Babel and other transpilers will not correctly handle the code without additional configuration
     - Some browsers include the CustomError constructor in the stack trace when using ES2015 classes
   - ES5
     ```javascript
     function CustomError(foo, message, fileName, lineNumber) {
         var instance = new Error(message, fileName, lineNumber);
         instance.foo = foo;
         Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
         if (Error.captureStackTrace) {
             Error.captureStackTrace(instance, CustomError);
         }
         return instance;
     }
     CustomError.prototype = Object.create(Error.prototype, {
         constructor: {
             value: Error,
             enumerable: false,
             writable: true,
             configurable: true
         }
     });
     if (Object.setPrototypeOf) {
         Object.setPrototypeOf(CustomError, Error);
     } else {
         CustomError.__proto__ = Error;
     }

     try {
         throw new CustomError('baz', 'bazMessage');
     } catch (e) {
         console.log(e.foo); //baz
         console.log(e.message);//bazMessage
     }
     ```

     All browsers include the CustomError constructor in the stack trace when using a prototype declaration

### throw, console

1. `throw` syntax
   ```javascript
   throw expression;
   ```

   - any expression can be thrown, but better an object, especially using specific type constructor
   - if a caught error cannot be handled, consider rethrow

1. 3 common errors
   - Type Coercion Errors: avoid `==`, `!=`, `if (variable)`
   - Data Type Errors: use `typeof`, `instanceof`
   - Communication Errors: The `encodeURIComponent()` method should always be used for query string arguments

1. Log Errors to the Server
   - use `Image()` ???
     ```javascript
     function logError(sev, msg) {
         var img = new Image();
         img.src = "log.php?sev=" + encodeURIComponent(sev) + "&msg=" +
             encodeURIComponent(msg);
     }
     ```

1. `Console`
   - provides access to the browser's debugging console, `window.console`
   - print methods
     - `Console.log(...)` -- For general output of logging information
       - when logging objects in the latest versions of Chrome and Firefox what get logged on the console is a reference to the object
       - use `console.log(JSON.parse(JSON.stringify(obj)))` to see the value at the moment of being logged
       - prints the element in an HTML-like tree for `Node` objects
       - [string substitution](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions) (%) and additional arguments
       - `Console.assert()` (no string substitution), `Console.debug()`, `Console.error()`, `Console.info()`, `Console.warn()`
     - `Console.debug(...)` -- Outputs a message to the console (`Console.log()`) with the log level "debug"
       - Note: Starting with Chromium 58 this method only appears in Chromium browser consoles when level "Verbose" is selected.
     - `Console.error(...)` -- `Console.log()` with error level
     - `Console.info(...)` -- `Console.log()`
     - `Console.warn(...)` -- `Console.log()` with warning level
     - `Console.assert(assertion?: boolean, ...): void` -- Log a error level message and stack trace to console if the first argument is `false`
       - `Console.log()` with a condition and error level and without string substitution
     - `Console.dir(obj): void` -- Displays an interactive list of the properties of the specified JavaScript object
       - prints the `HTMLElement` in a JSON-like tree
     - `Console.dirxml(obj)` -- `Console.dir()` which displays an interactive tree of the descendant elements of the specified XML/HTML element if possible
     - `Console.table(data, columns?): void` -- logs data as a table. Each element in the array (or enumerable property if data is an object) will be a row in the table
       - columns parameter to select a subset of columns to display
     - `Console.clear()` -- Clear the console
   - count methods
     - `Console.count(label?: string)` -- Log the number of times this line or a particular call has been called with the given label
       - without the parameter, the label is `"default"`
     - `Console.countReset(label?: string)` -- Resets the value of the counter with the given label
   - methods with new indentation
     - `Console.group(groupTitle?)` -- Creates a new inline group, indenting all following output by another level
     - `Console.groupCollapsed(groupTitle?)` -- Creates a new inline group, indenting all following output by another level. However, unlike `group()` this starts with the inline group collapsed requiring the use of a disclosure button to expand it
     - `Console.groupEnd()` -- Exits the current inline group
   - timing methods
     - `Console.time(label?: string)` -- Starts a timer with a name specified as an input parameter
       - Up to 10,000 simultaneous timers can run on a given page
       - label defaults to `"default"`
     - `Console.timeEnd(label?)` -- Stops the specified timer and logs the elapsed time in seconds since it started
     - `Console.timeLog(label?)` -- Logs the value of the specified timer to the console
       - not widely supported
     - `Console.timeStamp(label?: string)` nonstandard -- Adds a marker to the browser's Timeline or Waterfall tool
       - label will then be shown alongside the marker
   - `Console.trace()` -- Outputs a stack trace
   - Styling console output -- You can use the `%c` directive to apply a CSS style to console output:
     ```javascript
     console.log("This is %cMy stylish message",
     "color: yellow; font-style: italic; background-color: blue;padding: 2px");
     ```

     Note: Quite a few CSS properties are supported by this styling; you should experiment and see which ones prove useful

## Maintainability, Performance and Deployment

1. maintainability
   - four spaces and semicolon
   - comments
   - intuitive and proper naming
     - `var name` will override `window.name`
   - type transparency
     ```javascript
     /**
      * @param {string} s
      * @param
      * @return {number}
      */
     ```

   - loose coupling
     - decouple JavaScript inline in HTML
     - decouple `HTMLElement.style` by altering `HTMLElement.className`
     - decouple Application Logic/Event Handlers
   - Respect Object Ownership
   - Avoid Globals
   - Avoid Null Comparisons
   - Use Constants

1. performance
   - Be Scope-Aware -- avoid long scope-chain lookup ???
   - Avoid long property lookup
     - actually long chaining dict lookup
   - Avoid Double Interpretation
   - prefer native methods, switch statements and bitwise operations
   - Optimize DOM Interactions -- DOM manipulations and interactions take a large amount of time because they often require rerendering all or part of the page ???
     - Minimize Live Updates
       - use `DocumentFragment`
       - use `HTMLElement.InnerHTML`
     - Use Event Delegation
     - Beware of `HTMLCollections` (and `NodeList`) -- An `HTMLCollection` in the HTML DOM is live; it is automatically updated when the underlying document is changed
       - cache `length` and items in loops
       - In some cases, `NodeList` is static, where any changes in the DOM does not affect the content of the collection, as `Document.querySelectorAll()`
       - In other cases, the `NodeList` is live, which means that changes in the DOM automatically update the collection, such as `Node.childNodes`

1. deployment
   - webpack
   - build
   - validation
   - compression -- file and HTTP

# JSON

1. syntax
   - simple values — Strings, numbers, Booleans, and `null`, no `undefined`
     - strings must use double quotes to be valid
   - objects -- key-value pairs
     - key is enclosed by double quotes
     - no trailing semicolon
   - arrays

1. polyfill
   - tbc
   - better not use `eval()`

1. `JSON`
   - `JSON.parse(text: string, receiver?: (key: any, value: any) => any): any`
     - text: The string to parse as JSON
     - reviver -- If a function, this prescribes how the value originally produced by parsing is transformed, before being returned
     - does not allow trailing commas: `SyntaxError`
   - `JSON.stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string`  
     `JSON.stringify(value: any, replacer?: (string | number)[], space?: string | number): string`
     - value -- The value to convert to a JSON string
     - replacer -- A function that alters the behavior of the stringification process, or an array of `String` and `Number` objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string
       - If you return any other object, the object is recursively stringified into the JSON string, calling the replacer function on each property, unless the object is a function, in which case nothing is added to the JSON string.
       - If you return `undefined`, the property is not included (i.e., filtered out) in the output JSON string.
       - cannot use the replacer function to remove values from an array. If you return `undefined` or a function then `null` is used instead
     - space
       - if a `Number`, it indicates the number of space characters to use as white space; this number is capped at 10 and 0
       - if a string, the string (or the first 10 characters of the string) is used as whitespace
     - rule
       - If the value has a `toJSON()` method, it's responsible to define what data will be serialized
       - `Boolean`, `Number`, and `String` objects are converted to the corresponding primitive values during stringification, in accord with the traditional conversion semantics
       - If `undefined`, a `Function`, or a `Symbol` is encountered during conversion it is either omitted (when it is found in an object) or censored to `null` (when it is found in an array). `JSON.stringify()` can also just return undefined when passing in "pure" values like `JSON.stringify(function(){})` or `JSON.stringify(undefined)`
       - All `Symbol`-keyed properties will be completely ignored, even when using the replacer function
       - The instances of Date implement the `toJSON()` function by returning a string (the same as `date.toISOString())`. Thus, they are treated as strings
       - The numbers `Infinity` and `NaN`, as well as the object `null`, are all considered `null`
       - All the other `Object` instances (including `Map`, `Set`, `WeakMap`, and `WeakSet`) will have only their enumerable properties serialized

# Strict Mode

1. Invoking strict mode
   - put the exact statement `"use strict";` (or `'use strict';`) before any other statements
     - for a script or a function
     - for scripts
       - no effect for functions inside
       - concatenate conflicting scripts can be problematic
   - modules are automatically in strict mode, with no statement needed to initiate it

1. variables
   - assigning a value to an undeclared variable throws a `ReferenceError`
   - an attempt to `delete` a variable causes an `ReferenceError` -- Nonstrict mode allows this and may silently fail (returning `false`)
   - disallows variables named `implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`, and `yield`, causes `SyntaxError`
     - also function names
   - disallows using `eval` and `arguments` as identifiers and manipulating their values or `SyntaxError`

1. Objects
   - Assigning a value to a read-only property throws a `TypeError`
   - Using delete on a nonconfigurable property throws a `TypeError`
   - Attempting to add a property to a nonextensible object throws a `TypeError`
   - When using an object literal, property names must be unique or throws `SyntaxError` -- not ES6

1. Functions
   - named function arguments be unique or `SyntaxError`
   - In nonstrict mode, changes to a named argument are also reflected in the `arguments` object, whereas strict mode ensures that each are completely separate
   - the elimination of `arguments.callee` and `arguments.caller`, throws a `TypeError`
   - disallowing function declarations unless they are at the top level of a script or function, or `SyntaxError`
     - function statements outside top level are permitted in ES6

1. `eval()`
   - no longer create variables or functions in the containing context
     - what declared inside remain inside a special scope that is used while code is being evaluated and then destroyed once completed

1. `this`
   - in nonstrict mode, When using the `apply()` or `call()` methods of a function, a `null` or `undefined` value is coerced to the global object
   - In strict mode, the `this` value for a function is always used as specified
   - and if unspecified, `this` will be `undefined`

1. miscellanea
   - An attempt to use `with` in strict mode results in a `SyntaxError`
   - An octal literal is now considered invalid syntax in strict mode
     - `parseInt()` with octal literals are considered decimal literals with a leading zero
     - not ES6 `0o`
   - ES6 forbids setting properties on primitive values or `TypeError`

# Build Tools

1. [tbc](https://www.typescriptlang.org/docs/handbook/integrating-with-build-tools.html)

1. webpack
   - [webpack-dev-server](https://survivejs.com/webpack/developing/webpack-dev-server/)
   - [Concepts | webpack](https://webpack.js.org/concepts/)

# TypeScript -- superset of JavaScript

1. docs -- [Basic Types · TypeScript](https://www.typescriptlang.org/docs/handbook/basic-types.html)

## CLI

1. `ts-node`
   - `.type` in REPL

1. `tsc`
   - [complier options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

1. tsconfig.json
   - use
     - by invoking tsc with no input files, in which case the compiler searches for the tsconfig.json file starting in the current directory and continuing up the parent directory chain
     - By invoking tsc with no input files and a `--project` (or just `-p`) command line option that specifies the path of a directory containing a tsconfig.json file, or a path to a valid .json file containing the configurations
   - [schema](http://json.schemastore.org/tsconfig)
   - Example Using the `"files"` property
     ```json
     {
         "compilerOptions": {
             "module": "commonjs",
             "noImplicitAny": true,
             "removeComments": true,
             "preserveConstEnums": true,
             "sourceMap": true
         },
         "files": [
             "core.ts",
             "sys.ts",
             "types.ts",
             "scanner.ts",
             "parser.ts",
             "utilities.ts",
             "binder.ts",
             "checker.ts",
             "emitter.ts",
             "program.ts",
             "commandLineParser.ts",
             "tsc.ts",
             "diagnosticInformationMap.generated.ts"
         ]
     }
     ```

   - example Using the `"include"` and `"exclude"` properties
   - strict example
     ```json
     {
       "compilerOptions": {
         "alwaysStrict": true, // Parse in strict mode and emit "use strict" for each source file.
         // If you have wrong casing in referenced files e.g. the filename is Global.ts and you have a /// <reference path="global.ts" /> to reference this file, then this can cause to unexpected errors. Visite: http://stackoverflow.com/questions/36628612/typescript-transpiler-casing-issue
         "forceConsistentCasingInFileNames": true, // Disallow inconsistently-cased references to the same file.
         // "allowUnreachableCode": false, // Do not report errors on unreachable code. (Default: False)
         // "allowUnusedLabels": false, // Do not report errors on unused labels. (Default: False)
         "noFallthroughCasesInSwitch": true, // Report errors for fall through cases in switch statement.
         "noImplicitReturns": true, // Report error when not all code paths in function return a value.
         "noUnusedParameters": true, // Report errors on unused parameters.
         "noUnusedLocals": true, // Report errors on unused locals.
         "noImplicitAny": true, // Raise error on expressions and declarations with an implied "any" type.
         "noImplicitThis": true, // Raise error on this expressions with an implied "any" type.
         "strictNullChecks": true, // The null and undefined values are not in the domain of every type and are only assignable to themselves and any.
         // To enforce this rules, add this configuration.
         "noEmitOnError": true // Do not emit outputs if any errors were reported.
       }
     }
     ```

1. Project References -- tbc

1. [build tools](https://www.typescriptlang.org/docs/handbook/integrating-with-build-tools.html#webpack)

## Lint

1. [tslint](https://www.npmjs.com/package/tslint)
   - [rules](https://palantir.github.io/tslint/rules/)
   - `tslint --help`
   - `tslint --init`

1. [ESLint rules for TSLint](https://github.com/buzinas/tslint-eslint-rules#configure-your-rules)

## Type Basics

1. Basic Types
   - concrete values
   - `boolean`
   - `number`
   - `string`
   - `Array<T>` or `T[]`
      - `ReadonlyArray<T>`
   - tuple -- express an array where the type of a fixed number of elements is known
     - When accessing an element outside the set of known indices, a union type is used instead: `T1 | T2`
     - `[T1, T2]`
     - `?` -- `[number, string?, boolean?];`
   - `any` -- opt-out of type-checking and let the values pass through compile-time checks
   - `unknown`
     - Anything is assignable to `unknown`, but unknown isn’t assignable to anything but itself and `any` without a type assertion or a control flow based narrowing
     - Likewise, no operations are permitted on an unknown without first asserting or narrowing to a more specific type.
   - `void` -- return type of functions, or `undefined` or `null`
   - `null` and `undefined` -- subtypes of all other types when without `--strictNullChecks` flag
     - use union type: `string | null | undefined`
   - `never` -- the return type for a function expression or an arrow function expression that always throws an exception or one that never returns
     - Variables also acquire the type `never` when narrowed by any type guards that can never be true
     - a subtype of, and assignable to, every type
     - `any` is not assignable to `never`
   - `object`, `<T>{}` (`T` for `interface`), `{a: string, b?: number}`, `{a: string; b?: number}`
   - C-like `enum` -- members as properties, enum name as type
     ```TypeScript
     enum Color {Red, Green, Blue}
     let c: Color = Color.Green;
     enum Color {Red = 1, Green = 2, Blue = 4}
     let c: Color = Color.Green;
     enum Color {Red = 1, Green, Blue}
     let colorName: string = Color[2];
     ```

     - computed cannot be followed by non-initialized
       ```TypeScript
       enum E {
           A = getSomeValue(),
           B, // error! 'A' is not constant-initialized, so 'B' needs an initializer
       }
       ```

     - String enums -- each member has to be constant-initialized with a string literal, or with another string enum member
       ```TypeScript
       enum Direction {
           Up = "UP",
           Down = "DOWN",
           Left = "LEFT",
           Right = "RIGHT",
       }
       ```

     - Heterogeneous enums -- not recommended
     - When all members in an enum have literal enum values
       - enum members as types
         ```TypeScript
         enum ShapeKind {
             Circle,
             Square,
         }
         interface Circle {
             kind: ShapeKind.Circle;
             radius: number;
         }
         interface Square {
             kind: ShapeKind.Square;
             sideLength: number;
         }
         let c: Circle = {
             kind: ShapeKind.Square,
             //    ~~~~~~~~~~~~~~~~ Error!
             radius: 100,
         }
         ```

       - enum types themselves effectively become a union of each enum member
     - Enums at runtime
       - real objects that exist at runtime
       - Reverse mappings -- numeric enums members also get a reverse mapping from enum values to enum names
         ```TypeScript
         enum Enum {
             A
         }
         let a = Enum.A;
         let nameOfA = Enum[a]; // "A"
         ```

     - `const` enums -- can only use constant enum expressions, completely removed during compilation, inlined at use sites
     - Ambient enums `declare enum` -- describe the shape of already existing enum types
       - an ambient (and non-const) enum member that does not have initializer is always considered computed

1. variable declaration
   - `declare` -- declare variables that may not have originated from a TypeScript file, not for compilation and simply a hint to the compiler
     - `.d.ts`
   - `type`: like `typedef` in C
     ```TypeScript
     type C = { a: string, b?: number }
     function f({ a, b }: C): void {
         // ...
     }
     type Tree<T> = {
         value: T;
         left: Tree<T>;
         right: Tree<T>;
     }
     type LinkedList<T> = T & { next: LinkedList<T> };
     interface Person {
         name: string;
     }
     var people: LinkedList<Person>;
     ```

   - function type
     ```TypeScript
     let myAdd: (baseValue: number, increment: number) => number =
         function(x: number, y: number): number { return x + y; };
     let f: (x: number) => number = x => x * x;
     let f2: (x: number) => <number> x * x;
     function foo(...args: [number, string, boolean]): void;
     function foo(args_0: number, args_1: string, args_2: boolean): void;
     ```

     - default-initialized parameters don’t need to occur after required parameters, unlike ES6
     - `this` parameters -- fake parameters that come first in the parameter list, make `this` a explicit type in lieu of `any`
       - `this: void` means a function that does not require a `this` type
     - `this` parameters in callbacks
       ```TypeScript
       interface UIElement {
           addClickListener(onclick: (this: void, e: Event) => void): void;
       }
       class Handler0 {
           info: string;
           onClickBad(this: Handler, e: Event) {
               // oops, used this here. using this callback would crash at runtime
               this.info = e.message;
           }
       }
       class Handler {
           info: string;
           onClickGood = (e: Event) => { this.info = e.message }
       }
       let h = new Handler();
       uiElement.addClickListener(h.onClickBad);
       ```

       - arrow functions don’t capture `this`, so you can always pass them to something that expects `this: void`
       - one arrow function is created per object of type Handler. Methods, on the other hand, are only created once and attached to Handler’s prototype
     - overload
       ```TypeScript
       function pickCard(x: {suit: string; card: number; }[]): number;
       function pickCard(x: number): {suit: string; card: number; };
       function pickCard(x): any {
           // Check to see if we're working with an object/array
           // if so, they gave us the deck and we'll pick the card
           if (typeof x == "object") {
               let pickedCard = Math.floor(Math.random() * x.length);
               return pickedCard;
           }
           // Otherwise just let them pick the card
           else if (typeof x == "number") {
               let pickedSuit = Math.floor(x / 13);
               return { suit: suits[pickedSuit], card: x % 13 };
           }
       }
       ```

1. type assertion
   ```TypeScript
   let someValue: any = "this is a string";
   let strLength: number = (<string>someValue).length;
   let strLength2: number = (someValue as string).length;
   ```
   - no runtime impact, and is used purely by the compiler
   - `null` or `undefined` removing type assertion -- `!`: `str!.charAt(0)`

1. type inference

1. type compatibility -- Structural typing is a way of relating types based solely on their members
   - x is compatible with y if y has at least the same members as x

1. destructuring
   ```TypeScript
   let { a, b }: { a: string, b: number } = o;
   ```

   - default values
     ```TypeScript
     function keepWholeObject(wholeObject: { a: string, b?: number }) {
         let { a, b = 1001 } = wholeObject;
     }
     ```

## Interfaces

1. `interface` -- `type` for objects, only the shape that matters
   ```TypeScript
   interface LabelledValue {
       label: string;
       op?: number;
       readonly ro?: string;
   }
   function printLabel(labelledObj: LabelledValue) {
       console.log(labelledObj.label);
   }
   let myObj = {size: 10, label: "Size 10 Object"};
   printLabel(myObj);
   ```

   - optional properties: `?`
   - `readonly`
   - Excess Property Checks
     ```TypeScript
     let s2: LabelledValue = myObj; // OK, but not recommended
     let s3: LabelledValue = {size: 10, label: '111'} // error: size does not exist in type LabelledValue
     ```

     - get around -- type assertion
     - Indexable type -- an index signature that describes the types we can use to index into the object: config the interface to be able to have some extra properties
       ```TypeScript
       interface SquareConfig {
           color?: string;
           width?: number;
           [propName: string]: any;
       }
       ```

       - two types of supported index signatures: string and number
       - the type returned from a numeric indexer must be a subtype of the type returned from the string indexer, `a[100]` is the same as `a['100']` in JavaScript
       - string index enforce all properties match their return type

1. `interface` for functions
   ```TypeScript
   interface SearchFunc {
       (source: string, subString: string): boolean; // call signature
   }
   ```

   - the names of the parameters do not need to match
     ```TypeScript
     let mySearch: SearchFunc;
     mySearch = function(src: string, sub: string): boolean {
         let result = src.search(sub);
         return result > -1;
     }
     ```

   - can infer the argument types
     ```TypeScript
     let mySearch: SearchFunc;
     mySearch = function(src, sub) {
         let result = src.search(sub);
         return result > -1;
     }
     ```

1. `interface` for `class` `implements`
   ```TypeScript
   interface ClockInterface {
       currentTime: Date;
       setTime(d: Date);
   }
   class Clock implements ClockInterface {
       currentTime: Date;
       setTime(d: Date) {
           this.currentTime = d;
       }
       constructor(h: number, m: number) { }
   }
   ```

   - can also describe methods
   - describe the public side of the class, rather than both the public and private side
   - only the instance side of the class is checked, not the static side
     - create an interface with a construct signature and try to create a class that implements this interface you get an error
     - also check constructor: refer to docs

1. Extending Interfaces
   ```TypeScript
   interface Shape {
       color: string;
   }
   interface PenStroke {
       penWidth: number;
   }
   interface Square extends Shape, PenStroke {
       sideLength: number;
   }
   let square = <Square>{};
   square.color = "blue";
   square.sideLength = 10;
   square.penWidth = 5.0;
   ```

   - interfaces can extend each other. This allows you to copy the members of one interface into another

1. Interfaces Extending Classes -- inherits the members of the class but not their implementations
   - even inherits the private and protected members of a base class
     ```TypeScript
     class Control {
         private state: any;
     }
     interface SelectableControl extends Control {
         select(): void;
     }
     class Button extends Control implements SelectableControl {
         select() { }
     }
     // Error: Property 'state' is missing in type 'Image'.
     class myImage implements SelectableControl {
         select() { }
     }
     ```

1. Hybrid Types
   - for example, an object that acts as both a function and an object, with additional properties
     ```TypeScript
     interface Counter {
         (start: number): string;
         interval: number;
         reset(): void;
     }
     function getCounter(): Counter {
         let counter = <Counter>function (start: number) { };
         counter.interval = 123;
         counter.reset = function () { };
         return counter;
     }
     let c = getCounter();
     c(10);
     c.reset();
     c.interval = 5.0;
     ```

## Classes

1. `class`
   ```TypeScript
   class Greeter {
       greeting: string;
       constructor(message: string) {
           this.greeting = message;
       }
       greet() {
           return "Hello, " + this.greeting;
       }
   }
   let greeter = new Greeter("world");
   ```

1. `extends`
   - `super()` -- the constructor of the base class
     - before we ever access a property on this in a constructor body, we have to call `super()`. This is an important rule that TypeScript will enforce
   - override method -- use the same identifier

1. Public, private, protected and more
   - Public by default
   - `private` and `protected` -- the same declaration is required when comparing type
     ```TypeScript
     class Animal {
         private name: string;
         constructor(theName: string) { this.name = theName; }
     }
     class Rhino extends Animal {
         constructor() { super("Rhino"); }
     }
     class Employee {
         private name: string;
         constructor(theName: string) { this.name = theName; }
     }
     let animal = new Animal("Goat");
     let rhino = new Rhino();
     let employee = new Employee("Bob");
     animal = rhino;
     animal = employee; // Error: 'Animal' and 'Employee' are not compatible
     ```

   - `private` -- cannot be accessed from outside of its containing class
   - `protected` -- like `private` but can also be accessed within deriving classes
     - A constructor may also be marked `protected`
   - `readonly`
   - Parameter properties -- constructor parameter with `readonly`, `public`, `private` or `protected`, will be initialized as properties of the class
   - accessors -- `get`, `set` as in ES6 with type
     - accessors with a `get` and no `set` are automatically inferred to be readonly
   - `static`: use the class name in lieu of `this` to access

1. Abstract Classes -- `abstract`
   ```TypeScript
   abstract class Animal {
       abstract makeSound(): void;
       move(): void {
           console.log("roaming the earth...");
       }
   }
   ```

   - for other classes to derive, may not be instantiated directly
   - Unlike an interface, an abstract class may contain implementation details for its members
     - may optionally include access modifiers
   - `abstract` marked do not contain an implementation and must be implemented in derived classes
   - objects declared abstract class type but instantiated by subclass constructor, will lose what defined only in that subclass

1. use class as an interface
   - a class declaration creates two things: a type representing instances of the class and a constructor function
   - Because classes create types, you can use them in the same places you would be able to use interfaces

### Mixins

1. concept -- another popular way of building up classes from reusable components is to build them by combining simpler partial classes
   - wikipedia -- a Mixin is a class that contains methods for use by other classes without having to be the parent class of those other classes
   - sometimes described as being "included" rather than "inherited", can also be viewed as an interface with implemented methods
   - Mixins encourage code reuse and can be used to avoid the inheritance ambiguity that multiple inheritance can cause (the "diamond problem")

1. example
   ```TypeScript
   // Disposable Mixin
   class Disposable {
       isDisposed: boolean;
       dispose() {
           this.isDisposed = true;
       }
   }

   // Activatable Mixin
   class Activatable {
       isActive: boolean;
       activate() {
           this.isActive = true;
       }
       deactivate() {
           this.isActive = false;
       }
   }

   @mixin([Disposable, Activatable])
   class SmartObject implements Disposable, Activatable {
       constructor() {
           setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
       }
       interact() {
           this.activate();
       }
       // Disposable
       isDisposed: boolean = false;
       dispose: () => void;
       // Activatable
       isActive: boolean = false;
       activate: () => void;
       deactivate: () => void;
   }

   // alternative -- Object.assign()
   function mixin(baseCtors: any[]) {
       return function applyMixins(derivedCtor: any) {
           baseCtors.forEach(baseCtor => {
               Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                   derivedCtor.prototype[name] = baseCtor.prototype[name];
               });
           });
       }
   }
   let smartObj = new SmartObject();
   setTimeout(() => smartObj.interact(), 1000);
   ```

   overhead: we create stand-in properties and their types for the members that will come from our mixins, that’s exactly what we want to avoid by using mixins

1. The pure function and delegation based Flight-Mixin Approach
   ```javascript
   'use strict';
   // Implementation
   const EnumerableFirstLast = (function () { // function based module pattern.
     const first = function () {
         return this[0];
       },
       last = function () {
         return this[this.length - 1];
       };
     return function () {      // function based Flight-Mixin mechanics ...
       this.first  = first;  // ... referring to ...
       this.last   = last;   // ... shared code.
     };
   }());
   // Application - explicit delegation:
   // applying [first] and [last] enumerable behavior onto [Array]'s [prototype].
   EnumerableFirstLast.call(Array.prototype);
   // Now you can do:
   const a = [1, 2, 3];
   a.first(); // 1
   a.last();  // 3
   ```

## Generics

1. capturing the type
   ```TypeScript
   function identity<T>(arg: T): T {
       return arg;
   }
   let output = identity<string>("myString");
   let output2 = identity("myString");
   ```

   - when working with classes, static members can not use the class’s type parameter

1. Generic Constraints
   ```TypeScript
   interface Lengthwise {
       length: number;
   }
   function loggingIdentity<T extends Lengthwise>(arg: T): T {
       console.log(arg.length);  // Now we know it has a .length property, so no more error
       return arg;
   }
   ```

   - Type Parameters
     ```TypeScript
     function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
         return obj[key];
     }
     function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
       return names.map(n => o[n]);
     }
     ```

1. Using Class Types in Generics
   ```TypeScript
   function create<T>(c: {new(): T; }): T {
       return new c();
   }
   ```

## Advanced Types

1. Intersection Types -- `T & U`

1. Union Types -- `T | U`
   - `type Easing = "ease-in" | "ease-out" | "ease-in-out";`
   - `1 | 2`

1. type guard -- some expression that performs a runtime check that guarantees the type in some scope
   - type predicate type guards -- `is` return type
     ```TypeScript
     function isFish(pet: Fish | Bird): pet is Fish {
         return (<Fish>pet).swim !== undefined;
     }
     if (isFish(pet)) {
         pet.swim();
     }
     else {
         pet.fly();
     }
     ```

     - called with some variable, TypeScript will narrow that variable to that specific type if the original type is compatible
   - `typeof` type guards -- `if (typeof x === 'number')`
   - `instanceof` type guards

1. mapped types
   ```TypeScript
   type Readonly<T> = {
       readonly [P in keyof T]: T[P];
   }
   type Partial<T> = {
       [P in keyof T]?: T[P];
   }
   type Keys = 'option1' | 'option2';
   type Flags = { [K in Keys]: boolean };
   ```

   - `Partial` and `Readonly` already in library
   - more in lib

1. conditional types -- `T extends U ? X : Y`
   - when T is assignable to U the type is X, otherwise the type is Y
   - predefined in `lib.d.ts` -- access via `F12`
     - `Exclude<T, U>` – Exclude from T those types that are assignable to U
     - `Extract<T, U>` – Extract from T those types that are assignable to U
     - `NonNullable<T>` – Exclude null and undefined from T
     - `ReturnType<T>` – Obtain the return type of a function type
     - `InstanceType<T>` – Obtain the instance type of a constructor function type

1. tbc

## Modules

1. modules and scripts
   - any file containing a top-level `import` or `export` is considered a module
   - a script whose contents are available in the global scope (and therefore to modules as well)
   - `tsc --module commonjs Test.ts` for node.js

1. `export` -- ES6 like

1. `import` -- ES6 like
   - If a module identifier is only ever used as part of a type annotations and never as an expression, then no `require` call is emitted for that module
   - Import a module for side-effects only `import 'module'` -- module augmentation see below
   - import types
     ```TypeScript
     // module.d.ts
     export declare class Pet {
        name: string;
     }
     // global-script.ts
     function adopt(p: import("./module").Pet) {
         console.log(`Adopting ${p.name}...`);
     }
     ```

     also JavaScript
     ```JavaScript
     // a.js
     /**
      * @param p { import("./module").Pet }
      */
     function walk(p) {
         console.log(`Walking ${p.name}...`);
     }
     ```

1. `export =` and `import = require()` -- model the traditional CommonJS and AMD workflow, such as
   - The `export = syntax` specifies a single object that is exported from the module
   - When exporting a module using `export =`, TypeScript-specific `import module = require("module")` must be used to import the module
   - Depending on the module target specified during compilation, the compiler will generate appropriate code for different target

1. Ambient Modules `.d.ts` -- Working with Other JavaScript Libraries
   - We could define each module in its own .d.ts file with top-level export declarations
   - or write them as one larger `.d.ts` file. To do so, we use a construct similar to ambient namespaces, but we use the `module` keyword and the quoted name of the module which will be available to a later import
     ```TypeScript
     /// <reference path="node.d.ts"/>
     import * as URL from "url";
     ```

   - direct import with `any` type
     ```TypeScript
     declare module "hot-new-module";
     import x, {y} from "hot-new-module";
     ```

   - Wildcard module declarations -- non-JavaScript content

1. Module Resolution

## Namespaces

1. `namespace`
   - the `--outFile` flag to compile all of the input files into a single JavaScript output file
   - namespaces can span multiple files, and can be concatenated using `--outFile`
   - Non-exported members are only visible in the original (un-merged) namespace
   - aliases -- `import a =`
     ```TypeScript
     namespace Shapes {
         export namespace Polygons {
             export class Triangle { }
             export class Square { }
         }
     }
     import polygons = Shapes.Polygons;
     let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
     ```

   - modules would be the recommended code organization mechanism

## Declaration

1. Declaration merge -- merges two separate declarations declared with the same name into a single definition
   - interfaces with same name will merge
   - namespaces with same name will merge, not the non-exported
   - Merging Namespaces with Classes, functions, enums -- static field
   - classes can not merge with other classes or with variables
   - Module Augmentation -- `declare module`
     ```TypeScript
     // observable.ts stays the same
     export class Observable<T> {
         // ... implementation left as an exercise for the reader ...
     }
     // map.ts
     import { Observable } from "./observable";
     declare module "./observable" {
         interface Observable<T> {
             map<U>(f: (x: T) => U): Observable<U>;
         }
     }
     Observable.prototype.map = function (f) {
         // ... another exercise for the reader
     }
     // consumer.ts
     import { Observable } from "./observable";
     import "./map";
     let o: Observable<number>;
     o.map(x => x.toFixed());
     ```

     can’t declare new top-level declarations in the augmentation – just patches to existing declarations
   - Global augmentation `declare global` -- add declarations to the global scope from inside a module
     - have the same behavior and limits as module augmentations

## JSX

1. basic usage
   - `.tsx` file extension
   - enable `jsx` option

1. tbc

## Decorators

1. use
   ```TypeScript
   @f @g x
   // or
   @f
   @g
   x
   ```

   - stage 2 proposal for JavaScript and are available as an experimental feature
   - enable the `experimentalDecorators` compiler option

1. Decorator Factories -- customize how a decorator is applied to a declaration
   ```TypeScript
   function color(value: string) { // this is the decorator factory
       return function (target) { // this is the decorator
           // do something with 'target' and 'value'...
       }
   }
   // call with @color('red')
   ```

1. Decorator Evaluation
   - Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for -- each instance member and each static member
   - Parameter Decorators are applied for the constructor
   - Class Decorators are applied for the class

1. Property Decorators
   - cannot be used in any other ambient context
   - The expression for the property decorator will be called as a function at runtime, with the following two arguments:
     - Either the constructor function of the class for a static member, or the prototype of the class for an instance member
     - The name of the member

1. sample decorators
   ```TypeScript
   function sealed(constructor: Function) { // @sealed
       Object.seal(constructor);
       Object.seal(constructor.prototype);
   }
   function enumerable(value: boolean) { // @enumerable(false)
       return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
           descriptor.enumerable = value;
       };
   }
   function configurable(value: boolean) { // @configurable(false)
       return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
           descriptor.configurable = value;
       };
   }
   ```

1. `reflect-metadata` npm module -- tbc

## Triple-Slash Directives

1. Triple-Slash Directives
   - single-line comments containing a single XML tag. The contents of the comment are used as compiler directives
   - only valid at the top of their containing file
   - `/// <reference path="..." />` -- a declaration of dependency between files
     - instruct the compiler to include additional files in the compilation process
     - also serve as a method to order the output when using `--out` or `--outFile`
     - resolved in a depth first manner
     - `--noResolve` -- If the compiler flag `--noResolve` is specified, triple-slash references are ignored
       - neither result in adding new files, nor change the order of the files provided
   - `/// <reference types="..." />` -- declares a dependency on a package
     - Use these directives only when you’re authoring a `d.ts` file by hand
     - an `import` for declaration packages
     - For example, including `/// <reference types="node" />` in a declaration file declares that this file uses names declared in `@types/node/index.d.ts`
   - `/// <reference lib="..." />` -- explicitly include an existing built-in lib file
     - Built-in lib files are referenced in the same fashion as the `"lib"` compiler option in tsconfig.json (e.g. use `lib="es2015"` and not `lib="lib.es2015.d.ts"`, etc.)
     - For example, adding `/// <reference lib="es2017.string" />` to one of the files in a compilation is equivalent to compiling with `--lib es2017.string`
   - more

## Type Checking JavaScript Files

1. tbc

## Declaration Files

1. tbc
