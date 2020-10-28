# OS I/O

1. 输入操作通常包括两个阶段
   - 等待数据 -- 等待数据从网络中到达。当所等待数据到达时，它被复制到内核中的某个缓冲区
   - 从内核向进程复制数据 -- 把数据从内核缓冲区复制到应用进程缓冲区

1. IO
   - synchronous IO
     - blocking IO -- block for both phases
     - non-blocking IO -- polling for the first phase, block for the second phase
     - IO multiplexing, aka event driven IO -- `select` or `poll`, like `java.nio.channels.Selector`, block for both phases, but one thread for multiple sockets
     - signal driven IO -- `sigaction`, return immediately for the first phase。内核在数据到达时向应用进程发送 `SIGIO` 信号, blocking for second phase
   - asynchronous IO
     - asynchronous IO -- `aio_read`, 内核会在所有操作完成之后向应用进程发送信号, non-blocking for both phases

1. `select` -- like `java.nio.channels.Selector`, 监视一组文件描述符，等待一个或者多个描述符成为就绪状态
   ```c
   int select(int nfds, fd_set *readfds, fd_set *writefds,
           fd_set *exceptfds, struct timeval *timeout);
   ```
   - `nfds` -- the highest-numbered file descriptor in any of the three sets, plus 1
   - `fd_set` -- array based, of size `FD_SETSIZE` which defaults to 1024
   - `readset`、`writeset`、`exceptset` -- 分别对应读、写、异常条件的描述符集合, three classes of events on the specified set of file descriptors, can be `NULL`; upon return, each of the file descriptor sets will be cleared of all file descriptors except for those that are ready / exceptional

1. `poll` -- similar to `select`, but with more event types and no size constraint for array `*fds`
   ```c
   int poll(struct pollfd *fds, unsigned int nfds, int timeout);
   struct pollfd {
       int   fd;         /* file descriptor */
       short events;     /* requested events */
       short revents;    /* returned events */
   };
   ```
   - structure reuse
     ```c
     // If we detect the event, zero it out so we can reuse the structure
         if ( fds[0].revents & POLLIN )
             fds[0].revents = 0;
     ```

1. `epoll` -- event poll
   ```c
   int epoll_create(int size);
   int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event)；
   int epoll_wait(int epfd, struct epoll_event *events,
                  int maxevents, int timeout);
   ```
   - `epoll_create()` -- creates a new `epoll` instance, the `size` argument is ignored, but must be greater than zero
   - `epoll_ctl` -- add, modify, or remove entries in the interest list of the `epoll` instance referred to by the file descriptor `epfd`. 已注册的描述符在内核中会被维护在一棵红黑树上
     - `op`, `fd` -- it requests that the operation `op` be performed for the target file descriptor, `fd`
   - `epoll_wait` -- waits for events on the `epoll` instance referred to by the file descriptor `epfd`. The buffer pointed to by `events` is used to return information from the ready list about file descriptors in the interest list that have some events available
   - mode
     - LT, level trigger -- default, blocking and non-blocking, after `epoll_wait`, 进程可以不立即处理该事件，下次调用 `epoll_wait()` 会再次通知进程
     - ET, edge trigger -- non-blocking, after `epoll_wait`, 下次再调用 `epoll_wait()` 时不会再得到事件到达的通知

1. `epoll` vs `poll` vs `select`
   - `epoll` 进程不需要通过轮询来获得事件完成的描述符
   - `epoll` 只需要将描述符从进程缓冲区向内核缓冲区拷贝一次
     - `select` and `poll`, 每次调用都需要将全部描述符从应用进程缓冲区复制到内核缓冲区
   - 对多线程编程更友好，一个线程调用了 `epoll_wait()` 另一个线程关闭了同一个描述符也不会产生像 `select` 和 `poll` 的不确定情况
     - 如果一个线程对某个描述符调用了 `select` 或者 `poll`，另一个线程关闭了该描述符，会导致调用结果不确定
   - `select` `timeout` 参数精度为微秒, 更加适用于实时性要求比较高的场景，而 `poll` 和 `epoll` 为毫秒

1. Netty 粘包拆包 -- distinguish data boundary
   - `DelimiterBasedFrameDecoder`
   - `LineBasedFrameDecoder`
   - `FixedLengthFrameDecoder`

# IO

1. `java.io` exceptions
   - `java.io.IOException` extends `Exception`
     - `java.io.CharConversionException`
     - `java.io.EOFException`
     - `java.io.FileNotFoundException`
     - `java.io.InterruptedIOException`
     - `java.io.ObjectStreamException`
     - `java.io.InvalidClassException`
     - `java.io.InvalidObjectException`
     - `java.io.NotActiveException`
     - `java.io.NotSerializableException`
     - `java.io.OptionalDataException`
     - `java.io.StreamCorruptedException`
     - `java.io.WriteAbortedException`
     - `java.io.SyncFailedException`
     - `java.io.UnsupportedEncodingException`
     - `java.io.UTFDataFormatException`
   - `java.io.UncheckedIOException` extends `RuntimeException`

## Console

1. `java.io.Console` — synchronized
   ```java
   public final class Console extends Object
   implements Flushable
   ```
   - creation
     - `System.console()`
   - write
     - `void flush()`
     - `Console format(String fmt, Object... args)`
     - `Console printf(String format, Object... args)`
   - read
     - `String readLine()`  
       `String readLine(String fmt, Object... args)`
     - `char[] readPassword()`  
       `char[] readPassword(String fmt, Object... args)`
   - get underlying stream
     - `Reader reader()`
     - `PrintWriter writer()`

1. `java.util.Scanner` — not synchronized
   ```java
   public final class Scanner extends Object
   implements Iterator<String>, Closeable
   ```
   - constructors
     - `Scanner(File source)`
     - `Scanner(File source, String charsetName)`
     - `Scanner(InputStream source)` — uses `InputStreamReader` behind the scenes
       - `System.in` for stdin
     - `Scanner(InputStream source, String charsetName)`
     - `Scanner(Path source)`
     - `Scanner(Path source, String charsetName)`
     - `Scanner(String source)`
     - `Scanner(Readable source)`
       ```java
       Scanner in = new Scanner(new BufferedReader(new InputStreamReader(System.in)));
       ```
     - `Scanner(ReadableByteChannel source)`
     - `Scanner(ReadableByteChannel source, String charsetName)`
   - settings — delimiter, locale, regex
     - `Scanner reset()`
     - `Scanner useDelimiter(Pattern pattern)`
     - `Scanner useDelimiter(String pattern)`
     - `Pattern delimiter()`
     - `Scanner useLocale(Locale locale)`
     - `Locale locale()`
     - `Scanner useRadix(int radix)`
     - `int radix()`
   - read
     - `String next()`
     - `String next(Pattern pattern)`
     - `String next(String pattern)`
     - `String nextLine()`
     - `BigDecimal nextBigDecimal()`
     - `BigInteger nextBigInteger()`
     - `BigInteger nextBigInteger(int radix)`
     - `boolean nextBoolean()`
     - `byte nextByte()`
     - `byte nextByte(int radix)`
     - `double nextDouble()`
     - `float nextFloat()`
     - `int nextInt()`
     - `int nextInt(int radix)`
     - `long nextLong()`
     - `long nextLong(int radix)`
     - `short nextShort()`
     - `short nextShort(int radix)`
     - `MatchResult match()` — the match result of the last scanning operation
       - peek
         ```java
         s.hasNext(".*"); // ".*" matches anything, similar to hasNext(), but updates the scanner's internal match variable
         s.match().group(0)​;​
         ```
   - test — `has-` prefixed version of read methods, `hasNext`
   - find — ignoring delimiters, the scanner returns and advances past the match if found, else returns `null` with position unchanged
     - `String findInLine(Pattern pattern)`
     - `String findInLine(String pattern)`
     - `String findWithinHorizon(Pattern pattern, int horizon)` — will never search more than `horizon` code points beyond its current position, `horizon` ignored if it is 0
     - `String findWithinHorizon(String pattern, int horizon)`
   - skip — ignoring delimiters
     - `Scanner skip(Pattern pattern)`
     - `Scanner skip(String pattern)`
   - `IOException ioException()` — Returns the `IOException` last thrown by this Scanner's underlying `Readable`.

1. `java.io.BufferedReader` — synchronized
   ```java
   public class BufferedReader
   extends Reader
   ```
   - `Stream<String> lines()`
   - `String readLine()`
   - `Reader` methods

1. stdin, stdout, stderr
   - see [`System`](./javaBasics.md#System)
   - see `InputStream` (`BufferedInputStream`) and `PrintStream`

## Basic IO Stream

1. IO streams
   - byte streams, byte oriented — `InputStream`, `OutputStream`
     - deal with bytes — `FilterInputStream`, `FilterOutputStream` and their derivatives
     - buffer — use `BufferedInputStream` and `BufferedOutputStream` as an intermediate stream
   - `char` streams, two-byte `char` values (UTF-16 codepoints) oriented — `Reader`, `Writer`, can be converted from byte streams, both have a protected `Object` field `lock` for synchronization
   - usage — combination, filter streams as wrappers
     ```java
     DataInputStream din = new DataInputStream(
         new BufferedInputStream(
             new FileInputStream("employee.dat")));
     ```

1. IO interfaces
   - `java.io.Closeable` — idempotent variant with `IOException` compared to `AutoCloseable` with `Exception`
     ```java
     public interface Closeable
     extends AutoCloseable
     ```
     - `close()` when already closed — no effect if already closed, whereas `AutoCloseable::close` may have side effects
   - `java.io.Flushable` — write any buffered output to the underlying stream
     ```java
     public interface Flushable {
         void flush() throws IOException;
     }
     ```
   - `Readable`
     ```java
     public interface Readable {
         public int read(java.nio.CharBuffer cb) throws IOException;
     }
     ```
   - `Appendable` — to which char sequences and values can be appended, must be implemented by any class whose instances are intended to receive formatted output from a `java.util.Formatter`
     ```java
     public interface Appendable {
         Appendable append(char c) throws IOException;
         Appendable append(CharSequence csq) throws IOException;
         Appendable append(CharSequence csq, int start, int end) throws IOException;
     }
     ```

1. `java.io.InputStream`
   ```java
   public abstract class InputStream extends Object
   implements Closeable
   ```
   - lifecycle
     - `int available()` — an estimate of the number of bytes that can be read (or skipped over) without blocking
     - `abstract int read()` — block if necessary, read next byte (0 ~ 255), `-1` if at end, used by some other methods so only one method to implementing when inheriting  
       `int read(byte[] b)`  
       `int read(byte[] b, int off, int len)` — reads up to `len` bytes of data from the offset into byte buffer `b`
     - `long skip(long n)` — returns the actual number of bytes skipped
     - `void close()`
   - mark — the stream somehow remembers all the bytes read after the call to `mark` and stands ready to supply those same bytes again if and whenever the method `reset` is called, as long as within `readlimit`
     - `boolean markSupported()`
     - `void mark(int readlimit)`
     - `void reset()`
   - read all to `String` — see [stack overflow](https://stackoverflow.com/questions/309424/how-do-i-read-convert-an-inputstream-into-a-string-in-java)
     ```java
     public String inputStreamToString(InputStream inputStream) throws IOException {
         ByteArrayOutputStream bos = new ByteArrayOutputStream();
         inputStream.transferTo(bos);
         return bos.toString("utf-8");
     }
     ```
     - `public long transferTo(OutputStream out)` — since JDK 9
       ```java
       public long transferTo(OutputStream out) throws IOException {
           Objects.requireNonNull(out, "out");
           long transferred = 0;
           byte[] buffer = new byte[DEFAULT_BUFFER_SIZE]; // 8192
           int read;
           while ((read = this.read(buffer, 0, DEFAULT_BUFFER_SIZE)) >= 0) {
               out.write(buffer, 0, read);
               transferred += read;
           }
           return transferred;
       }
       ```

1. `java.io.OutputStream`
   ```java
   public abstract class OutputStream extends Object
   implements Closeable, Flushable
   ```
   - `abstract void write(int b)` — block if necessary  
     `void write(byte[] b)`  
     `void write(byte[] b, int off, int len)`
   - `void flush()`
   - `void close()` — automatically `flush()` before close

1. `java.io.Reader` — see `InputStream`
   ```java
   public abstract class Reader extends Object
   implements Readable, Closeable
   ```
   - lifecycle
     - `boolean ready()`
     - `abstract int read(char[] cbuf, int off, int len)` — 0 ~ 65535 or -1  
       `int read()`  
       `int read(char[] cbuf)`  
       `int read(CharBuffer target)`
     - `long skip(long n)`
     - `abstract void close()`
   - mark
     - `boolean markSupported()`
     - `void mark(int readAheadLimit)`
     - `void reset()`

1. `java.io.Writer` — see `OutputStream`
   ```java
   public abstract class Writer extends Object
   implements Appendable, Closeable, Flushable
   ```
   - `Writer append(char c)`  
     `Writer append(CharSequence csq)`  
     `Writer append(CharSequence csq, int start, int end)`
   - `abstract void write(char[] cbuf, int off, int len)`  
     `void write(char[] cbuf)`  
     `void write(int c)`  
     `void write(String str)`  
     `void write(String str, int off, int len)`
   - `abstract void flush()`
   - `abstract void close()`

1. convert stream to reader or writer, uses `Charset.defaultCharset()` if not specified
   - `java.io.InputStreamReader` — used by `Scanner` behind the scenes
     ```java
     public class InputStreamReader
     extends Reader
     ```
     - constructors
       - `InputStreamReader(InputStream in)`
       - `InputStreamReader(InputStream in, Charset cs)`
       - `InputStreamReader(InputStream in, CharsetDecoder dec)`
       - `InputStreamReader(InputStream in, String charsetName)`
     - `String getEncoding()`
   - `java.io.OutputStreamWriter`
     ```java
     public class OutputStreamWriter
     extends Writer
     ```
     - constructors
       - `OutputStreamWriter(OutputStream out)`
       - `OutputStreamWriter(OutputStream out, Charset cs)`
       - `OutputStreamWriter(OutputStream out, CharsetEncoder enc)`
       - `OutputStreamWriter(OutputStream out, String charsetName)`
     - `String getEncoding()`

## Filter Stream

1. filter stream — contains some other stream, which it uses as its basic source or sink of data, possibly transforming the data along the way or providing additional functionality
   - `java.io.FilterInputStream`
     ```java
     public class FilterInputStream
     extends InputStream
     ```
     - constructor — `protected FilterInputStream(InputStream in)`
   - `java.io.FilterOutputStream`
     ```java
     public class FilterOutputStream
     extends OutputStream
     ```
     - constructor — `FilterOutputStream(OutputStream out)`
   - `java.io.FilterReader`
     ```java
     public abstract class FilterReader
     extends Reader
     ```
   - `java.io.FilterWriter`
     ```java
     public abstract class FilterWriter
     extends Writer
     ```

1. buffer streams — the ability to buffer the input and to support the mark and reset methods
   - `java.io.BufferedInputStream`
     ```java
     public class BufferedInputStream
     extends FilterInputStream
     ```
     - constructors
       - `BufferedInputStream(InputStream in)`
       - `BufferedInputStream(InputStream in, int size)`
   - `java.io.BufferedOutputStream`
     ```java
     public class BufferedOutputStream
     extends FilterOutputStream
     ```
     - constructors
       - `BufferedOutputStream(OutputStream out)`
       - `BufferedOutputStream(OutputStream out, int size)`
   - `java.io.BufferedReader`
     ```java
     public class BufferedReader
     extends Reader
     ```
   - `java.io.BufferedWriter`
     ```java
     public class BufferedWriter
     extends Writer
     ```

1. data input — conversion between bytes from a binary stream and Java data types, big endian
   - [modified UTF-8](https://docs.oracle.com/javase/8/docs/api/java/io/DataInput.html#modified-utf-8) — UTF-8 encoded UTF-16
   - `java.io.DataInput`
     ```java
     public interface DataInput
     ```
     - `void readFully(byte[] b)`
     - `void readFully(byte[] b, int off, int len)`
     - `boolean readBoolean()`
     - `byte readByte()`
     - `char readChar()`
     - `double readDouble()`
     - `float readFloat()`
     - `int readInt()`
     - `String readLine()`
     - `long readLong()`
     - `short readShort()`
     - `int readUnsignedByte()` — 0 ~ 255
     - `int readUnsignedShort()` — 0 ~ 65535
     - `String readUTF()` — modified UTF-8 encoded string
     - `int skipBytes(int n)`
   - `java.io.DataOutput`
     ```java
     public interface DataOutput
     ```
   - `java.io.DataInputStream`
     ```java
     public class DataInputStream
     extends FilterInputStream
     implements DataInput
     ```
     - constructor — `DataInputStream(InputStream in)`
   - `java.io.DataOutputStream`
     ```java
     public class DataOutputStream
     extends FilterOutputStream
     implements DataOutput
     ```
     - constructor — `DataOutputStream(OutputStream out)`

1. peek — push back stream
   - `java.io.PushbackInputStream`
     ```java
     public class PushbackInputStream
     extends FilterInputStream
     ```
     - constructors
       - `PushbackInputStream(InputStream in)`
       - `PushbackInputStream(InputStream in, int size)`
     - push back
       - `void unread(byte[] b)`
       - `void unread(byte[] b, int off, int len)`
       - `void unread(int b)`
   - `java.io.PushbackReader`
     ```java
     public class PushbackReader
     extends FilterReader
     ```

### ZIP Streams

1. inflate and deflate
   - `java.util.zip.InflaterInputStream`
     ```java
     public class InflaterInputStream
     extends FilterInputStream
     ```
   - `java.util.zip.DeflaterOutputStream`
     ```java
     public class DeflaterOutputStream
     extends FilterOutputStream
     ```

1. ZIP stream
   - `java.util.zip.ZipInputStream`
     ```java
     public class ZipInputStream
     extends InflaterInputStream
     ```
   - `java.util.zip.ZipOutputStream`
     ```java
     public class ZipOutputStream
     extends DeflaterOutputStream
     ```

1. ZIP file system — `FileSystems.newFileSystem(Paths.get(zipname), null)`

## Print Stream

1. print streams — add the ability to print representations of various data values conveniently
   - never throws an `IOException` — only `checkError()`
   - auto flush — support auto flush, defaults to `false`
     - for `PrintStream` — after a byte array is written, or a `\n` is written
     - for `PrintWriter` — after the invoke of `println`, `printf`, or `format`
   - `printf` — [formats](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#syntax)

1. `java.io.PrintStream` — print into bytes
   ```java
   public class PrintStream
   extends FilterOutputStream
   implements Appendable, Closeable
   ```
   - constructors
     - `PrintStream(File file)`
     - `PrintStream(File file, String csn)`
     - `PrintStream(OutputStream out)`
     - `PrintStream(OutputStream out, boolean autoFlush)`
     - `PrintStream(OutputStream out, boolean autoFlush, String encoding)`
     - `PrintStream(String fileName)`
     - `PrintStream(String fileName, String csn)`
   - `print` and `println` methods — `void`, supports primitive types, `char[]` and `Object`
   - `printf`
     - `PrintStream printf(Locale l, String format, Object... args)`
     - `PrintStream printf(String format, Object... args)`
   - `boolean checkError()`

1. `java.io.PrintWriter` — print into text (chars)
   ```java
   public class PrintWriter
   extends Writer
   ```
   - constructors
     - `PrintWriter(File file)`
     - `PrintWriter(File file, String csn)`
     - `PrintWriter(OutputStream out)`
     - `PrintWriter(OutputStream out, boolean autoFlush)`
     - `PrintWriter(String fileName)`
     - `PrintWriter(String fileName, String csn)`
     - `PrintWriter(Writer out)`
     - `PrintWriter(Writer out, boolean autoFlush)`
   - methods — see `PrintStream`
     - difference — `PrintStream::write` methods allow `int` and `byte[]`

## Other Streams

1. externally buffered streams — save the data in an internal buffer (byte array, etc.), no effect for `close()` and no `IOException` afterwards
   - `java.io.ByteArrayInputStream`
     ```java
     public class ByteArrayInputStream
     extends InputStream
     ```
   - `java.io.ByteArrayOutputStream`
     ```java
     public class ByteArrayOutputStream
     extends OutputStream
     ```
   - `java.io.StringReader` — read from `String`: `StringReader(String s)`
     ```java
     public class StringReader
     extends Reader
     ```
   - `java.io.StringWriter` — uses `StringBuffer` as buffer
     ```java
     public class StringWriter
     extends Writer
     ```

## Serialization

1. `transient` — mark fields not part of the persistent state, which is skipped in serialization

1. `interface java.io.Serializable` — mark only data fields serializable, superclass data or any other class information not included
   - deserialize fields of classes not `Serializable` — initialized using the public or protected no-arg constructor
   - serialize subclasses whose parents are not `Serializable` — serialize the super types only when they have accessible no-arg constructor
   - serialization and deserialization control — override default read and write behavior, special handling during the serialization and deserialization, by implementing methods below
     ```java
     private void writeObject(java.io.ObjectOutputStream out) throws IOException
     private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException
     private void readObjectNoData() throws ObjectStreamException
     ```
   - version ID — used during deserialization to verify that the sender and receiver of a serialized object have loaded classes compatible with serialization, `InvalidClassException` if no match
     - declare explicitly
       ```java
       MODIFIER static final long serialVersionUID = 42L; // private is recommended
       ```
     - generate by default, not recommended — the serialization runtime will calculate a default `serialVersionUID` value for that class based on various aspects of the class (fingerprint), which may vary depending on compiler implementations
     - not applicable to array classes — cannot declare explicitly, and the requirement for matching `serialVersionUID` values is waived for array classes
     - get version ID via CLI — `serialver ClassName`
     - auto conversion when version ID match — for data fields, skip when type is different, ignore additional, set absent to default
   - write or read with another object
     - when writing to stream — implement `writeReplace`
       ```java
       MODIFIER Object writeReplace() throws ObjectStreamException;
       ```
     - when reading from stream — implement `readResolve`
       ```java
       MODIFIER Object readResolve() throws ObjectStreamException;
       ```
   - serial number — associate the object a number in encounter order and save or read the object data when first encounter, only save the serial number or read the object reference when encountered afterwards
   - file structure
     - magic number — `ACED`
     - version number of the object serialization format — `0005` for JDK 8
     - object sequences
       - strings saved in modified UTF-8
       - fingerprint stored in class — first 8 bytes of SHA
     - more

1. `java.io.Externalizable` — complete control over the format and contents of the stream for an object and its superclasses
   ```java
   public interface Externalizable
   extends Serializable
   ```
   - taking precedence and mechanism — If the object supports `Externalizable`, the `writeExternal` method is called. If the object does not support `Externalizable` and does implement `Serializable`, the object is saved using `ObjectOutputStream`
   - no-arg constructor when reconstructing — when reading, creates an object with the no-argument constructor and then calls the `readExternal` method
   - use another object — support `writeReplace` and `readResolve` methods
   - `void readExternal(ObjectInputStream in) throws IOException, ClassNotFoundException`
   - `void writeExternal(ObjectOutputStream out) throws IOException`

1. interfaces for object streams
   - `interface java.io.ObjectStreamConstants` — Constants written into the Object Serialization Stream
   - `java.io.ObjectOutput`
     ```java
     public interface ObjectOutput
     extends DataOutput, AutoCloseable
     ```
     - inherited methods
     - `void flush()`
     - `void writeObject(Object obj)`
   - `java.io.ObjectInput`
     ```java
     public interface ObjectInput
     extends DataInput, AutoCloseable
     ```
     - inherited methods
     - `int available()`
     - `int read()`  
       `int read(byte[] b)`  
       `int read(byte[] b, int off, int len)`
     - `Object readObject()`
     - `long skip(long n)`

1. `java.io.ObjectInputStream`
   ```java
   public class ObjectInputStream
   extends InputStream
   implements ObjectInput, ObjectStreamConstants
   ```
   - constructor — `ObjectInputStream(InputStream in)`
   - `void defaultReadObject()`

1. `java.io.ObjectOutputStream`
   ```java
   public class ObjectOutputStream
   extends OutputStream
   implements ObjectOutput, ObjectStreamConstants
   ```
   - constructor — `ObjectOutputStream(OutputStream out)`
   - `void defaultWriteObject()`

## Files

### File Classes

1. `java.io.File` — an abstract representation of file and directory pathnames, the old school way
   ```java
   public class File extends Object
   implements Serializable, Comparable<File>
   ```
   - separators — `System.getProperty("file.separator")`, `System.getProperty("path.separator")`
     - `static String separator`
     - `static char separatorChar`
     - `static String pathSeparator`
     - `static char pathSeparatorChar`
   - permissions
     - `boolean canExecute()`
     - `boolean canRead()`
     - `boolean canWrite()`
     - `boolean isHidden()`
     - `boolean setExecutable(boolean executable)
     - `boolean setExecutable(boolean executable, boolean ownerOnly)
     - `boolean setReadable(boolean readable)
     - `boolean setReadable(boolean readable, boolean ownerOnly)
     - `boolean setReadOnly()
     - `boolean setWritable(boolean writable)
     - `boolean setWritable(boolean writable, boolean ownerOnly)
   - inherited
     - `int compareTo(File pathname)` — lexicographically
   - CRUD
     - `static File createTempFile(String prefix, String suffix)`
     - `static File createTempFile(String prefix, String suffix, File directory)`
     - `boolean createNewFile()`
     - `boolean mkdir()`
     - `boolean mkdirs()`
     - `boolean delete()`
     - `void deleteOnExit()`
     - `boolean exists()`
     - `boolean renameTo(File dest)`
   - metadata and list
     - `boolean isDirectory()`
     - `boolean isFile()`
     - `long lastModified()`
     - `boolean setLastModified(long time)`
     - `long length()`
     - `String[] list()`  
       `String[] list(FilenameFilter filter)`
     - `File[] listFiles()`  
       `File[] listFiles(FileFilter filter)`  
       `File[] listFiles(FilenameFilter filter)`
     - `static File[] listRoots()`
   - path
     - `File getAbsoluteFile()`
     - `String getAbsolutePath()`
     - `File getCanonicalFile()`
     - `String getCanonicalPath()`
     - `String getName()`
     - `String getParent()`
     - `File getParentFile()`
     - `String getPath()`
     - `boolean isAbsolute()`
     - `String toString()`
     - `Path toPath()`
     - `URI toURI()`
   - space — the partition named by this abstract pathname
     - `long getFreeSpace()`
     - `long getTotalSpace()`
     - `long getUsableSpace()`
   - file filters
     - `java.io.FilenameFilter`
       ```java
       @FunctionalInterface
       public interface FilenameFilter {
           boolean accept(File dir, String name);
       }
       ```
     - `java.io.FileFilter`
       ```java
       @FunctionalInterface
       public interface FileFilter {
           boolean accept(File pathname);
       }
       ```
   - `java.io.FileDescriptor` — used in file streams
      ```java
      public final class FileDescriptor extends Object
      ``

1. `java.nio.file.Path` — represents a system dependent file path, immutable
   ```java
   public interface Path
   extends Comparable<Path>, Iterable<Path>, Watchable
   ```
   - creation
     - `java.nio.file.Paths`
       ```java
       public final class Paths extends Object
       ```
       - `static Path get(String first, String... more)` — join
       - `static Path get(URI uri)`
     - `File::toPath`
   - components methods
   - relative, absolute, real path methods
   - `File toFile()`
   - `URI toUri()`
   - inherited methods
   - example: three ways to `pwd`
     ```java
     new java.io.File(".").getCanonicalPath();
     System.getProperty("user.dir");
     Paths.get(".").toAbsolutePath().normalize().toString();
     ```

1. `java.nio.file.Files` — static methods take `Path` as arguments, operate its underlying files, usually atomically
   ```java
   public final class Files extends Object
   ```
   - limit — some read / write methods are intended for text files of moderate length, use stream methods such as `newInputStream` for large or binary files
   - glop pattern — extended syntax, extended `**`, see [File Operations (The Java™ Tutorials > Essential Classes > Basic I/O)](https://docs.oracle.com/javase/tutorial/essential/io/fileOps.html#glob), and [`FileSystem::getPathMatcher`](https://docs.oracle.com/javase/8/docs/api/java/nio/file/FileSystem.html#getPathMatcher-java.lang.String-)
   - `readAllBytes`, `readAllLines`, etc.

1. utility classes
   - `java.nio.file.DirectoryStream` — an object to iterate over the entries in a directory, supports only a single `Iterator`
     ```java
     public interface DirectoryStream<T>
     extends Closeable, Iterable<T>
     ```
   - `java.nio.file.SimpleFileVisitor` — a simple visitor of files with default behavior to visit all files and to re-throw I/O errors
     ```java
     public class SimpleFileVisitor<T> extends Object
     implements FileVisitor<T>
     ```
     - `public interface java.nio.file.FileVisitor<T>`
     - prevent termination by exceptions — override `postVisitDirectory` to return `FileVisitResult.CONTINUE` and `visitFileFailed` to return `FileVisitResult.SKIP_SUBTREE`
   - `java.nio.file.PathMatcher`
     ```java
     @FunctionalInterface
     public interface PathMatcher
     ```

1. `java.nio.file.FileStore` — a storage pool, device, partition, volume, concrete file system or other implementation specific means of file storage
   ```java
   public abstract class FileStore extends Object
   ```

1. `java.nio.file.FileSystem`
   ```java
   public abstract class FileSystem extends Object
   implements Closeable
   ```
   - `abstract Path getPath(String first, String... more)`
   - `abstract Iterable<Path> getRootDirectories()`
   - `abstract boolean isOpen()`
   - `abstract boolean isReadOnly()`
   - `abstract Iterable<FileStore> getFileStores()`
   - `abstract PathMatcher getPathMatcher(String syntaxAndPattern)`
   - `abstract String getSeparator()`
   - `abstract UserPrincipalLookupService getUserPrincipalLookupService()`
   - `abstract WatchService newWatchService()`
   - `abstract FileSystemProvider provider()`
   - `abstract Set<String> supportedFileAttributeViews()`
   - creation — `FileSystems`

1. `java.nio.file.FileSystems` — factory methods for file systems
   - initialization — The first invocation of any of the methods defined by this class causes the default `FileSystemProvider` to be loaded. The default provider, identified by the URI scheme "file", creates the `FileSystem` that provides access to the file systems accessible to the JVM
   - `static FileSystem getDefault()`
   - `static FileSystem getFileSystem(URI uri)`
   - `static FileSystem newFileSystem(Path path, ClassLoader loader)` — constructs a new `FileSystem` to access the contents of a file as a file system, supports ZIP files
   - `static FileSystem newFileSystem(URI uri, Map<String,?> env)`
   - `static FileSystem newFileSystem(URI uri, Map<String,?> env, ClassLoader loader)`

1. `java.nio.file.spi.FileSystemProvider` — file system service provider, methods in `Files` under the hood
   ```java
   public abstract class FileSystemProvider extends Object
   ```

1. `java.nio.channels.FileChannel` — reading, writing, mapping, locking, transferring and manipulating a file
   ```java
   public abstract class FileChannel
   extends AbstractInterruptibleChannel
   implements SeekableByteChannel, GatheringByteChannel, ScatteringByteChannel
   ```
   - creation
     - `static FileChannel open(Path path, OpenOption... options)`
     - `static FileChannel open(Path path, Set<? extends OpenOption> options, FileAttribute<?>... attrs)`
     - `FileInputStream::getChannel`, `FileOutputStream::getChannel`, `RandomAccessFile::getChannel`
   - `abstract MappedByteBuffer map(FileChannel.MapMode mode, long position, long size)` — maps a region of this channel's file directly into memory, recommended only for large files
   - lock — lock the given region of this channel's file
     - `FileLock lock()` — blocks, equivalent to `lock(0L, Long.MAX_VALUE, false)`  
       `abstract FileLock lock(long position, long size, boolean shared)`
     - `FileLock tryLock()` — `null` if not available, equivalent to `tryLock(0L, Long.MAX_VALUE, false)`  
       `abstract FileLock tryLock(long position, long size, boolean shared)`
   - AIO -- `java.nio.channels.AsynchronousFileChannel`

1. `java.nio.channels.FileLock` — a lock on a region of a file, on behalf of the JVM
   ```java
   public abstract class FileLock extends Object
   implements AutoCloseable
   ```
   - region is fixed — the region stays fixed, the file can have uncovered portion or can grow beyond the region
     - `boolean overlaps(long position, long size)`
     - `long position()`
     - `long size()`
   - lock on behalf of the JVM — not for multithreading, but for multiprocessing
   - shared lock — allow other programs to acquire overlapping shared locks while not allowing exclusive locks
     - `shared` for read, exclusive for write — `true` to request a shared lock, in which case this channel must be open for reading (and possibly writing); `false` to request an exclusive lock, in which case this channel must be open for writing (and possibly reading)
   - OS dependent
     - lock support — On some systems, file locking is merely advisory
     - shared support — a request for a shared lock is automatically converted into a request for an exclusive lock if not supported
     - memory map support — on some systems, you cannot simultaneously lock a file and map it into memory
     - avoid multiple channels on the same locked file — on some systems, closing a channel releases all locks on the underlying file
     - avoid locking files on a networked file system
   - `abstract void release()`  
     `void close()`

### File Options and Attributes

1. options
   - `interface java.nio.file.OpenOption` — mark interface
   - `interface java.nio.file.CopyOption` — mark interface
   - `java.nio.file.LinkOption.NOFOLLOW_LINKS` — Do not follow symbolic links
     ```java
     public enum LinkOption extends Enum<LinkOption>
     implements OpenOption, CopyOption
     ```
   - `java.nio.file.StandardOpenOption`
     ```java
     public enum StandardOpenOption extends Enum<StandardOpenOption>
     implements OpenOption
     ```
     - `READ`
     - `CREATE`
     - `CREATE_NEW`
     - `DELETE_ON_CLOSE`
     - `SPARSE` — a hint to the file system that this file will be sparse
     - `SYNC`, `DSYNC`
     - `WRITE`
     - `APPEND`
     - `TRUNCATE_EXISTING`
   - `java.nio.file.StandardCopyOption`
     ```java
     public enum StandardCopyOption extends Enum<StandardCopyOption>
     implements CopyOption
     ```
     - `ATOMIC_MOVE`
     - `COPY_ATTRIBUTES`
     - `REPLACE_EXISTING`
   - `java.nio.file.FileVisitOption.FOLLOW_LINKS` — Follow symbolic links, neither `OpenOption` nor `CopyOption`

1. file attributes — `java.nio.file.attribute`
   - `java.nio.file.attribute.UserPrincipal` — a Principal representing an identity used to determine access rights to objects in a file system
     ```java
     public interface UserPrincipal extends Principal
     ```
   - `interface java.nio.file.attribute.BasicFileAttributes` — basic file attributes, including times, file or dir or link, size, file key
     - file key — an object of some class, specific to the file system, that may or may not uniquely identify a file
     - read attributes — `Files::readAttributes`
     - sub-interfaces
       - `java.nio.file.attribute.DosFileAttributes`
       - `java.nio.file.attribute.PosixFileAttributes`
   - `java.nio.file.attribute.FileTime` — a file's time stamp attribute
     ```java
     public final class FileTime extends Object
     implements Comparable<FileTime>
     ```

### File Stream

1. file streams
   - `java.io.FileInputStream`
      ```java
      public class FileInputStream
      extends InputStream
      ```
      - constructors
        - `FileInputStream(File file)`
        - `FileInputStream(FileDescriptor fdObj)`
        - `FileInputStream(String name)`
      - methods beyond `InputStream`
        - `protected void finalize()` — ensures that the close method of this file input stream is called when there are no more references to it
        - `FileChannel getChannel()`
        - `FileDescriptor getFD()`
   - `java.io.FileOutputStream`
     ```java
     public class FileOutputStream
     extends OutputStream
     ```
     - constructors
       - `FileOutputStream(File file)`
       - `FileOutputStream(File file, boolean append)`
       - `FileOutputStream(FileDescriptor fdObj)`
       - `FileOutputStream(String name)`
       - `FileOutputStream(String name, boolean append)`
     - see `FileInputStream`
   - print streams
   - `Scanner`, `BufferedReader`
   - `java.io.RandomAccessFile` — both reading and writing to a random access file, which has a file pointer, suitable for small and moderate files
     ```java
     public class RandomAccessFile extends Object
     implements DataOutput, DataInput, Closeable
     ```
     - mode — `"r"`, `"rw"`, `"rws"` (file content or metadata synchronized with storage), or `"rwd"` (only file content synchronized)
     - constructors
       - `RandomAccessFile(File file, String mode)`
       - `RandomAccessFile(String name, String mode)`
     - file info
       - `FileChannel getChannel()`
       - `FileDescriptor getFD()`
       - `long length()`
     - file pointer — cursor for read / write
       - `long getFilePointer()`
       - `void seek(long pos)` — Sets the file-pointer offset, measured from the beginning of this file, at which the next read or write occurs.
       - `void setLength(long newLength)`
       - `int skipBytes(int n)`
     - read
       - `int read()`
       - `int read(byte[] b)`
       - `int read(byte[] b, int off, int len)`
       - `DataInput` methods
     - write — `DataOutput` methods

1. char based file streams — default encoding as `InputStreamReader`, `OutputStreamWriter`
   - `java.io.FileReader`
     ```java
     public class FileReader
     extends InputStreamReader
     ```
     - constructors
       - `FileReader(File file)`
       - `FileReader(FileDescriptor fd)`
       - `FileReader(String fileName)`
   - `java.io.FileWriter`
     ```java
     public class FileWriter
     extends OutputStreamWriter
     ```
     - constructors
       - `FileWriter(File file)`
       - `FileWriter(File file, boolean append)`
       - `FileWriter(FileDescriptor fd)`
       - `FileWriter(String fileName)`
       - `FileWriter(String fileName, boolean append)`
   - print streams

# NIO

1. file related — see [File Classes](#File-Classes)

## NIO Buffers

1. `java.nio`
   - `ByteOrder`
   - `Buffer` — a container for a fixed amount of data of a specific primitive type
     - `ByteBuffer` — can be direct, can be mapped to memory, content can be heterogeneous or homogeneous, big-endian or little-endian
       - `MappedByteBuffer`
     - `CharBuffer`
     - `DoubleBuffer`, `FloatBuffer`, `IntBuffer`, `LongBuffer`, `ShortBuffer`
   - runtime exceptions
     - `java.nio.BufferOverflowException`
     - `java.nio.BufferUnderflowException`
     - `java.lang.IllegalStateException`
       - `java.nio.InvalidMarkException`
     - `java.lang.UnsupportedOperationException`
       - `java.nio.ReadOnlyBufferException`

1. `java.nio.ByteOrder`
   ```java
   public final class ByteOrder extends Object
   ```
   - `static ByteOrder BIG_ENDIAN`
   - `static ByteOrder LITTLE_ENDIAN`
   - `static ByteOrder nativeOrder()` — the native byte order of the underlying platform
   - for buffers — `ByteBuffer::order`

1. `java.nio.Buffer` — finite sequence of elements, not thread-safe
   ```java
   public abstract class Buffer extends Object
   ```
   - underlying array
     - `abstract Object array()` — Returns the array that backs this buffer (optional operation)
     - `abstract int arrayOffset()` — Returns the offset within this buffer's backing array of the first element of the buffer (optional operation)
     - `abstract boolean hasArray()`
   - indices
     - `int capacity()`
     - `int limit()` — the index of the first element that should not be read or written
     - `int position()` — the index of the next element to be read or written
     - relative operations — from position
     - absolute operations — from explicit index
   - change indices
     - `Buffer clear()` — for `put` or related, sets the limit to the capacity and the position to zero
     - `Buffer flip()` — for `get` or related, sets the limit to the current position and then sets the position to zero
     - `Buffer rewind()` — for re-read, sets the position to zero
     - `Buffer limit(int newLimit)`
     - `Buffer position(int newPosition)`
     - mark and reset
       - `Buffer mark()` — set the current as the index to which its position will be set when `reset()`, otherwise `InvalidMarkException`
       - `Buffer reset()`
   - remaining
     - `int remaining()` — from position to limit
     - `boolean hasRemaining()`
   - attributes
     - `abstract boolean isDirect()`
     - `abstract boolean isReadOnly()`

1. `java.nio.ByteBuffer` — byte buffer with absolute and relative, bulk and not bulk `get` and `put`, not bulk `get` and `put` with other types, as well as views and other manipulating
   ```java
   public abstract class ByteBuffer
   extends Buffer
   implements Comparable<ByteBuffer>
   ```
   - view buffers — another buffer whose content is backed by the byte buffer, changes on either one will be reflected on both
   - get and put methods — content can be heterogeneous or homogeneous, big-endian or little-endian
   - creation
     - `static ByteBuffer allocate(int capacity)`
     - `static ByteBuffer allocateDirect(int capacity)`
     - `static ByteBuffer wrap(byte[] array)`
     - `static ByteBuffer wrap(byte[] array, int offset, int length)`
   - manipulate
     - `abstract ByteBuffer compact()`
     - `abstract ByteBuffer duplicate()`
     - `abstract ByteBuffer slice()`
   - `java.nio.MappedByteBuffer` — a direct byte buffer whose content is a memory-mapped region of a file
     ```java
     public abstract class MappedByteBuffer
     extends ByteBuffer
     ```
     - `FileChannel::map`
   - attributes
     - direct buffers
       - no intermediate buffer — JVM will attempt to avoid copying the buffer's content to (or from) an intermediate buffer before (or after) each invocation of one of the underlying operating system's native I/O operations
       - higher overhead — have somewhat higher allocation and deallocation costs than non-direct buffers
       - gc problems — the contents of direct buffers may reside outside of the normal garbage-collected heap
       - usage — best to allocate direct buffers only when they yield a measurable gain in program performance
       - creation — `ByteBuffer::allocateDirect`, `FileChannel::map`, view buffers on direct buffers
     - `abstract boolean isDirect()`
     - `abstract boolean isReadOnly()`

1. `java.nio.CharBuffer`
   ```java
   public abstract class CharBuffer
   extends Buffer
   implements Comparable<CharBuffer>, Appendable, CharSequence, Readable
   ```

1. `java.nio.ShortBuffer`, `java.nio.LongBuffer`, `java.nio.IntBuffer`, `java.nio.FloatBuffer`, `java.nio.DoubleBuffer`
   ```java
   public abstract class DoubleBuffer
   extends Buffer
   implements Comparable<DoubleBuffer>
   ```

## NIO Channels

1. exceptions in `java.nio.channels`
   - `IOException`
     - `java.nio.channels.ClosedChannelException`
       - `java.nio.channels.AsynchronousCloseException`
         - `java.nio.channels.ClosedByInterruptException`
     - `java.nio.channels.FileLockInterruptionException`
     - `java.nio.channels.InterruptedByTimeoutException`
   - `RuntimeException`
     - `IllegalArgumentException`
       - `java.nio.channels.IllegalChannelGroupException`
       - `java.nio.channels.IllegalSelectorException`
       - `java.nio.channels.UnresolvedAddressException`
       - `java.nio.channels.UnsupportedAddressTypeException`
     - `IllegalStateException`
       - `java.nio.channels.AcceptPendingException`
       - `java.nio.channels.AlreadyBoundException`
       - `java.nio.channels.AlreadyConnectedException`
       - `java.nio.channels.CancelledKeyException`
       - `java.nio.channels.ClosedSelectorException`
       - `java.nio.channels.ConnectionPendingException`
       - `java.nio.channels.IllegalBlockingModeException`
       - `java.nio.channels.NoConnectionPendingException`
       - `java.nio.channels.NonReadableChannelException`
       - `java.nio.channels.NonWritableChannelException`
       - `java.nio.channels.NotYetBoundException`
       - `java.nio.channels.NotYetConnectedException`
       - `java.nio.channels.OverlappingFileLockException`
       - `java.nio.channels.ReadPendingException`
       - `java.nio.channels.ShutdownChannelGroupException`
       - `java.nio.channels.WritePendingException`

1. conversion between stream and channel -- constructors of stream based classes and `java.nio.channels.Channels` methods
   - channel to stream
     - `Scanner(ReadableByteChannel source)`  
       `Scanner(ReadableByteChannel source, String charsetName)`
     - `Channels::newOutputStream`
     - more
   - stream to channel
     - `Channels::newChannel`
     - `getChannel` methods in stream based classes

1. `java.nio.channels.Pipe` -- a pair of channels that implements a unidirectional pipe

### Channel Interfaces

1. `java.nio.channels`
   - `Channel`
     - read and write channels
     - `AsynchronousChannel` — supports asynchronous I/O operations
     - `NetworkChannel` — to a network socket
   - `Channels` — utility methods for channel/stream interoperation

1. `java.nio.channels.Channel` — a nexus for I/O operations
   ```java
   public interface Channel extends Closeable
   ```
   - `void close()`
   - `boolean isOpen()` — avoid `ClosedChannelException`

1. read and write channels
   - `java.nio.channels.ReadableByteChannel` -- only one read operation upon a readable channel may be in progress at any given time
     - `int read(ByteBuffer dst)` -- read into given buffer
     - `java.nio.channels.ScatteringByteChannel`
       - `long read(ByteBuffer[] dsts)`
       - `long read(ByteBuffer[] dsts, int offset, int length)`
   - `java.nio.channels.WritableByteChannel` -- only one write operation upon a writable channel may be in progress at any given time
     - `int write(ByteBuffer src)`
     - `java.nio.channels.GatheringByteChannel` -- write version of `ScatteringByteChannel`
   - `java.nio.channels.ByteChannel` -- read and write bytes
     ```java
     public interface ByteChannel
     extends ReadableByteChannel, WritableByteChannel
     ```
     - `java.nio.channels.SeekableByteChannel` -- a byte channel that maintains a current position and allows the position to be changed
   - `java.nio.channels.InterruptibleChannel` -- a channel that can be asynchronously closed and interrupted

1. network channels
   - `java.nio.channels.NetworkChannel` -- `NetworkChannel bind(SocketAddress local)`
     - `java.nio.channels.MulticastChannel` -- a network channel that supports Internet Protocol (IP) multicasting

1. async channels -- `java.nio.channels.AsynchronousChannel`
   - `java.nio.channels.AsynchronousByteChannel`
     - read
       - `Future<Integer> read(ByteBuffer dst)`
       - `<A> void read(ByteBuffer dst, A attachment, CompletionHandler<Integer,? super A> handler)`
     - write
       - `Future<Integer> write(ByteBuffer src)`
       - `<A> void write(ByteBuffer src, A attachment, CompletionHandler<Integer,? super A> handler)`
     - `java.nio.channels.CompletionHandler` -- callback when `completed` or `failed`
     - `java.nio.channels.AsynchronousSocketChannel`
       ```java
       public abstract class AsynchronousSocketChannel
       implements AsynchronousByteChannel, NetworkChannel
       ```
   - `java.nio.channels.AsynchronousServerSocketChannel`
     ```java
     public abstract class AsynchronousServerSocketChannel
     implements AsynchronousChannel, NetworkChannel
     ```
   - `AsynchronousFileChannel`

### Selector

1. `java.nio.channels.spi.AbstractInterruptibleChannel` -- base implementation class for interruptible channels
   ```java
   public abstract class AbstractInterruptibleChannel
   implements Channel, InterruptibleChannel
   ```

1. `java.nio.channels.SelectableChannel` -- a channel that can be multiplexed via a `Selector`
   ```java
   public abstract class SelectableChannel
   extends AbstractInterruptibleChannel
   implements Channel
   ```
   - blocking mode or in non-blocking mode -- defaults to blocking mode, must be placed into non-blocking mode before being registered and when registered
     - `abstract SelectableChannel configureBlocking(boolean block)`
     - `abstract boolean isBlocking()`
   - register -- one or more selectors, at most once for each
     - `SelectionKey register(Selector sel, int ops)`
     - `abstract SelectionKey register(Selector sel, int ops, Object att)`
     - `abstract boolean isRegistered()`
     - `abstract SelectionKey keyFor(Selector sel)`
     - `abstract int validOps()`
   - deregister -- `SelectionKey::cancel`, `close()` or interrupted

1. `java.nio.channels.Selector` -- a multiplexer of `SelectableChannel` objects
   ```java
   public abstract class Selector implements Closeable
   ```
   - creation
     - `static Selector open()` -- created by `SelectorProvider::openSelector`
     - `abstract boolean isOpen()`
     - `abstract SelectorProvider provider()`
   - registration key sets
     - `abstract Set<SelectionKey> keys()` -- channel registrations
     - `abstract Set<SelectionKey> selectedKeys()` -- keys such that each key's channel was detected to be ready for at least one of the operations identified in the key's interest set during a prior selection operation; keys are removed by the `Set` removal methods
     - cancelled-key set -- the set of keys that have been cancelled (`SelectableChannel::close` or `SelectionKey::cancel`) but whose channels have not yet been deregistered, not directly accessible; removed from the key set during selection operations
   - selection -- during which keys may be added to and removed from a selector's selected-key set and may be removed from its key and cancelled-key sets
     - step
       1. empty cancelled-key set itself and from key set
       1. OS queried for an update as to the readiness of each remaining channel, if ready, add to selected-key set and its ready-operation set overwritten if newly add otherwise merged
       1. keys added to the cancelled-key set during the process are as step 1
     - `abstract int select()` -- blocking
     - `abstract int select(long timeout)`
     - `abstract int selectNow()` -- non-blocking, clears `wakeup()`
     - `abstract Selector wakeup()` -- blocked `select` will return immediately, or next `select` will return immediately if none currently; also invoked after `Thread::interrupt`
   - concurrency -- thread-safe, but not the key sets

1. `java.nio.channels.SelectionKey` -- a token representing the registration of a `SelectableChannel` with a `Selector`
   ```java
   public abstract class SelectionKey
   ```
   - operation bit vector, support depends on the underlying channel
     - `static int OP_ACCEPT` -- operation-set bit for socket-accept operations
     - `static int OP_CONNECT` -- operation-set bit for socket-connect operations
     - `static int OP_READ`
     - `static int OP_WRITE`
   - cancel
     - `abstract void cancel()`
     - `abstract boolean isValid()`
   - `abstract int interestOps()` -- the interest set, which operation categories will be tested for readiness
     - `abstract SelectionKey interestOps(int ops)` -- set to given value
   - `abstract int readyOps()` -- the ready set, the operation categories for which the key's channel has been detected to be ready by the key's selector
     - `boolean isAcceptable()`
     - `boolean isConnectable()`
     - `boolean isReadable()`
     - `boolean isWritable()`
   - binding
     - `abstract SelectableChannel channel()`
     - `abstract Selector selector()`
   - concurrency -- thread-safe

1. Reactor 模型 -- 一个线程 Thread 使用一个选择器 Selector 通过轮询的方式去监听多个通道 Channel 上的事件，从而让一个线程就可以处理多个事件
   ```java
   while (true) {
       selector.select();
       Set<SelectionKey> keys = selector.selectedKeys();
       Iterator<SelectionKey> keyIterator = keys.iterator();
       while (keyIterator.hasNext()) {
           SelectionKey key = keyIterator.next();
           if (key.isAcceptable()) {
               ServerSocketChannel ssChannel1 = (ServerSocketChannel) key.channel();
               // 服务器会为每个新连接创建一个 SocketChannel
               SocketChannel sChannel = ssChannel1.accept();
               sChannel.configureBlocking(false);
               // 这个新连接主要用于从客户端读取数据
               sChannel.register(selector, SelectionKey.OP_READ);
           } else if (key.isReadable()) {
               SocketChannel sChannel = (SocketChannel) key.channel();
               System.out.println(readDataFromSocketChannel(sChannel));
               sChannel.close();
           }
           keyIterator.remove();
       }
   }
   ```

### Channel Implementations

1. `FileChannel` -- see [File Classes](#File-Classes), extends `AbstractInterruptibleChannel` but not `AbstractSelectableChannel`

1. `java.nio.channels.SocketChannel` — like `Socket`, but a selectable channel
   ```java
   public abstract class SocketChannel
   extends AbstractSelectableChannel
   implements ByteChannel, ScatteringByteChannel, GatheringByteChannel, NetworkChannel
   ```
   - creation
     - `static SocketChannel open()`
     - `static SocketChannel open(SocketAddress remote)`

1. `java.nio.channels.DatagramChannel` -- like `DatagramSocket`, but a selectable channel
   ```java
   public abstract class DatagramChannel
   extends AbstractSelectableChannel
   implements ByteChannel, ScatteringByteChannel, GatheringByteChannel, MulticastChannel
   ```

1. `java.nio.channels.ServerSocketChannel` -- like `ServerSocket`, but a selectable channel
   ```java
   public abstract class ServerSocketChannel
   extends AbstractSelectableChannel
   implements NetworkChannel
   ```

1. more

# Network

1. `java.net` — networking like working with files
   - low level API
     - addresses — `Inet4Address`, `Inet6Address`, `InetSocketAddress`
     - sockets
       - `Socket` — a TCP client
       - `ServerSocket` — a TCP server
       - `DatagramSocket` — a UDP endpoint API and is used to send and receive `DatagramPacket`
         - `MulticastSocket` — a subclass of `DatagramSocket` used when dealing with multicast groups
     - interfaces
       - `NetworkInterface` — a network interface (e.g. ethernet connection or PPP endpoint) made up of a name, and a list of IP addresses assigned to this interface
   - high level API
     - URI
     - URL
     - connections

1. network exceptions
   - `IOException`
     - `java.net.HttpRetryException`
     - `java.io.InterruptedIOException`
       - `java.net.SocketTimeoutException`
     - `java.net.MalformedURLException`
     - `java.net.ProtocolException`
     - `java.net.SocketException`
       - `java.net.BindException`
       - `java.net.ConnectException`
       - `java.net.NoRouteToHostException`
       - `java.net.PortUnreachableException`
     - `java.net.UnknownHostException` — `String host`
     - `java.net.UnknownServiceException`
   - `java.net.URISyntaxException`

## Address

1. `java.net.InetAddress`
   ```java
   public class InetAddress extends Object
   implements Serializable
   ```
   - address types — unicast, multicast
   - IP address scope
     - Link-local addresses — designed to be used for addressing on a single link for purposes such as auto-address configuration, neighbor discovery, or when no routers are present.
     - Site-local addresses — designed to be used for addressing inside of a site without the need for a global prefix.
     - Global addresses — unique across the internet.
   - host name resolution — a combination of local configuration and network naming services such as, DNS and NIS
   - caching — `InetAddress` stores successful as well as unsuccessful host name resolutions
     - property `networkaddress.cache.ttl` — TTL for successful name lookups
     - property `networkaddress.cache.negative.ttl` — TTL for unsuccessful name lookups
   - creation
     - `static InetAddress[] getAllByName(String host)`
     - `static InetAddress getByAddress(byte[] addr)`
     - `static InetAddress getByAddress(String host, byte[] addr)`
     - `static InetAddress getByName(String host)`
     - `static InetAddress getLocalHost()`
     - `static InetAddress getLoopbackAddress()`

1. `java.net.Inet4Address`
   ```java
   public final class Inet4Address
   extends InetAddress
   ```

1. `java.net.Inet6Address`
   ```java
   public final class Inet6Address
   extends InetAddress
   ```

1. `java.net.InetSocketAddress` — IP Socket Address (IP address + port number), can also be a pair (hostname + port number)
   ```java
   public class InetSocketAddress
   extends SocketAddress
   ```
   - wildcard address — means "any" and can only be used for `bind` operations, created with `null` or omitted `InetAddress`
   - `java.net.SocketAddress` — for extending
     ```java
     public abstract class SocketAddress extends Object
     implements Serializable
     ```

## Sockets

1. `java.net.SocketImplFactory`
   ```java
   interface SocketImplFactory {
       SocketImpl createSocketImpl();
   }
   ```

1. `java.net.SocketImpl` — a common superclass for socket implementations
   ```java
   public abstract class SocketImpl extends Object
   implements SocketOptions
   ```

1. `interface java.net.SocketOptions` — socket options and get/set methods

1. `java.net.Socket` — TCP client
   ```java
   public class Socket extends Object
   implements Closeable
   ```
   - use — read/write is blocking and can not be interrupted
     - `SocketChannel getChannel()` — a socket will have a channel iff the channel itself was created via the `SocketChannel::open` or `ServerSocketChannel::accept` methods
     - `InputStream getInputStream()`
     - `OutputStream getOutputStream()`
   - timeout
     - `int getSoTimeout()`
     - `void setSoTimeout(int timeout)`
   - connect
     - blocking constructors
     - `void connect(SocketAddress endpoint)` — blocking and cannot be interrupted
     - `void connect(SocketAddress endpoint, int timeout)`
     - `boolean isConnected()`
   - half-close — one end of a socket connection to terminate its output while still receiving data from the other end
     - `void shutdownInput()`
     - `void shutdownOutput()`
     - `boolean isInputShutdown()`
     - `boolean isOutputShutdown()`
   - implementation — defaults to an instance of package-visible class inheriting `SocketImpl`
     - `static void setSocketImplFactory(SocketImplFactory fac)`
   - more

1. `java.net.ServerSocket` — TCP server
   ```java
   public class ServerSocket extends Object
   implements Closeable
   ```
   - similar methods in `Socket`
   - `Socket accept()` — wait indefinitely until a client connects to that port and then return the connection as `Socket`
   - `void setSoTimeout(int timeout)`
   - bind to local port
     - constructors
     - `void bind(SocketAddress endpoint)`
     - `void bind(SocketAddress endpoint, int backlog)`

## URI and URL

1. `java.net.URI` — uniform resource identifiers, to parsing, stringify, componentize, and process
   ```java
   public final class URI extends Object
   implements Comparable<URI>, Serializable
   ```
   - `URL toURL()`

1. encoder and decoder — for `application/x-www-form-urlencoded`
   - `java.net.URLEncoder` — `static String encode(String s, String enc)`
   - `java.net.URLDecoder` — `static String decode(String s, String enc)`

1. `java.net.URLStreamHandler` — the common superclass for all stream protocol handlers, for making a connection for a particular protocol type
   ```java
   public abstract class URLStreamHandler extends Object
   ```
   - cache — automatically loaded when first encounter, and stored in a hash table
   - protected methods for interacting with `URL` and open connection

1. `java.net.URL` — uniform resource locators, can open connections (locate resource), a special kind of URI, which is not URN (uniform resource name); supports common protocols (schemas) and `jar:`
   ```java
   public final class URL extends Object
   implements Serializable
   ```
   - URL escaping — not handled, it is the responsibility of the caller to encode and decode, recommended to use `URI` to manage
   - creation
     - constructors — take string URL, string URL components, or `URL`, and optionally `URLStreamHandler` as arguments
   - URL component get methods
   - use
     - `URLConnection openConnection()` — uses `URLStreamHandler::openConnection`, establishes connection only after `URLConnection::connect` or `URLConnection::getInputStream`, etc.
     - `URLConnection openConnection(Proxy proxy)`
     - `InputStream openStream()` — `openConnection().getInputStream()`
     - `Object getContent()` — `openConnection().getContent()`, see blow  
       `Object getContent(Class[] classes)`
   - conversion
     - `String toExternalForm()` — uses underlying `URLStreamHandler::toExternalForm`
     - `String toString()`
     - `URI toURI()`

1. `java.net.URLConnection` — URL connection
   ```java
   public abstract class URLConnection extends Object
   ```
   - establish connections
     - `abstract void connect()`
     - get methods
   - get methods — get settings and results, some will open connections implicitly
     - `static void setContentHandlerFactory(ContentHandlerFactory fac)`
     - `Object getContent()` — not very useful, `sun.net.www.content.<contentType>` is used if no custom content handler by `ContentHandlerFactory`  
       `Object getContent(Class[] classes)` — `null` if all `Class::isInstance` fails
     - `InputStream getInputStream()`
     - more
   - set methods
     - `void addRequestProperty(String key, String value)`
     - `void setDoOutput(boolean dooutput)` — set `doOutput` (defaults to `false`) field to `true` to write to the URL connection
       - `doInput` defaults to `true`
     - `OutputStream getOutputStream()`
     - set methods for applets only
     - more
   - `java.net.JarURLConnection` — use cast from `URLConnection` for creation, for URLs like `jar:<url>!/{entry}`, for example
     ```
     jar:http://www.foo.com/bar/baz.jar!/COM/foo/Quux.class
     jar:file:/home/duke/duke.jar!/
     ```
   - `java.net.HttpURLConnection` — use cast from `URLConnection` for creation
     ```java
     public abstract class HttpURLConnection
     extends URLConnection
     ```
     - `static int` HTTP status codes
     - `InputStream getErrorStream()` — 404 will throw `FileNotFoundException`, but response data can be also useful
     - cookies — see [HTTP Cookie](#HTTP-Cookie)

### HTTP Cookie

1. hierarchy of HTTP cookie classes
   ```
                    use
   CookieHandler <------- HttpURLConnection
         ^
         | impl
         |         use
   CookieManager -------> CookiePolicy
               |   use
               |--------> HttpCookie
               |              ^
               |              | use
               |   use        |
               |--------> CookieStore
                              ^
                              | impl
                              |
                    Internal in-memory implementation
   ```

1. `java.net.CookieHandler` — provides a callback mechanism to hook up a HTTP state management policy implementation into the HTTP protocol handler
   ```java
   public abstract class CookieHandler extends Object
   ```
   - `static void setDefault(CookieHandler cHandler)`

1. `java.net.CookieManager`
   ```java
   public class CookieManager
   extends CookieHandler
   ```
   - creation
     - `CookieManager(CookieStore store, CookiePolicy cookiePolicy)` — `null` parameters means default value

1. `interface java.net.CookieStore` — store and retrieve cookies, and remove when expired

1. `interface java.net.CookiePolicy`
   - predefined
     - `static CookiePolicy ACCEPT_ALL`
     - `static CookiePolicy ACCEPT_NONE`
     - `static CookiePolicy ACCEPT_ORIGINAL_SERVER`
   - `boolean shouldAccept(URI uri, HttpCookie cookie)`

1. `java.net.HttpCookie` — key-value pair with information like `isHttpOnly()`, `getMaxAge()`
