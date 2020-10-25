# Docs

1. docs
   - [oracle JDK 1.8](https://docs.oracle.com/javase/8/docs/api/index.html)
   - [jshell](https://docs.oracle.com/javase/9/jshell/toc.htm)
   - [Java Platform, Standard Edition Tools Reference for Oracle JDK on Solaris, Linux, and OS X, Release 8](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/toc.html)
   - [JSR-000221 JDBC API 4.3 Maintenance Release 3](https://download.oracle.com/otndocs/jcp/jdbc-4_3-mrel3-spec/index.html)
   - [download](https://stackoverflow.com/questions/6986993/how-to-download-javadoc-to-read-offline/36497090)
     - [Java Development Kit 8 Documentation](https://www.oracle.com/technetwork/java/javase/documentation/jdk8-doc-downloads-2133158.html)

1. [specification](http://docs.oracle.com/javase/specs)
   - [The Java® Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/)

# CLI

1. `javac` — compile
   - timestamps aware — auto compile dependencies and recompile when source file updated according to timestamps
   - extra options — `--help-extra`, `-X`
   - `-Xlint:<key>(,<key>)*` — enable warnings
     - `-Xlint` or `-Xlint:all` — all checks
     - `-Xlint:deprecation` — Same as `-deprecation`, checks for deprecated methods
     - `-Xlint:fallthrough` — Checks for missing `break` statements in `switch` statements
     - `-Xlint:finally` — Warns about finally clauses that cannot complete normally
     - `-Xlint:none` — Carries out none of the checks
     - `-Xlint:path` — Checks that all directories on the class path and source path exist
     - `-Xlint:serial` — Warns about serializable classes without `serialVersionUID`
     - `-Xlint:unchecked` — Warns of unsafe conversions between generic and raw types

1. `java` — execute
   - synopsis
     ```
     java [options] <mainclass> [args...]
         (to execute a class)
     java [options] -m <module>[/<mainclass>] [args...]
     java [options] --module <module>[/<mainclass>] [args...]
         (to execute the main class in a module)
     ```
     - args in `public static void main(String[] args)` — class name is not included
       ```shell
       java Message -g cruel world
       # args: ["-g", "cruel", "world"]
       ```
     - jar — `java -jar MyProgram.jar`, see [Jar](#JAR)
       ```
       java [options] -jar <jarfile> [args...]
       ```
     - single source file program — compile and run, no `.class` file generated
       ```
       java [options] <sourcefile> [args]
       ```
       ```shell
       java ClassName.java
       ```
   - `-cp` or `-classpath` — specify the class path
     ```shell
     java -classpath /home/user/classdir:.:/home/user/archives/archive.jar MyProg
     ```
   - `-verbose` — watch class loading
   - `java -X` — a listing of all nonstandard options
     - `-Xprof` — profiling, support was removed in 10.0
     - `-XshowSettings:properties`, `-XshowSettings:locale`
     - `-Xverify:none`, or `-noverify` — turn off verification when loading classes
     - memory related -- see JVM
       - `-Xss`
       - `-Xms`, `-Xmx`
   - enable and disable assertion — see [Assertion](#Assertion)
   - system properties — `-D`, `System::getProperty`, `System::getProperties`
     - log related — see [Logging](#Logging)
       - log configuration file location — `-Djava.util.logging.config.file=configFile`
     - see [`Properties`](./javaUtils.md#Legacy%20Collections) for list of system properties
   - remote debug
     ```shell
     java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n \
       -jar target/myapplication-0.0.1-SNAPSHOT.jar # remote debug
     ```

1. `javaw` — `java` without a shell window

1. `javadoc` — generates HTML documentation from your source files
   - information source
     - Packages
     - Public classes and interfaces
     - Public and protected fields
     - Public and protected constructors and methods
   - assets directory — `/doc-files` directory for assets
   - syntax
     - `/** ... */`
     - tags `@`
       - `@param variable description`
       - `@return description`
       - `@throws class description`
       - more
     - HTML tags
       - use `{@code ... }` instead of `<code>...</code>` to cope with escaping of `^`
   - example
     ```java
     /**
      * Raises the salary of an employee.
      * @param byPercent the percentage by which to raise the salary (e.g. 10 means 10%)
      * @return the amount of the raise
      */
     public double raiseSalary(double byPercent) {}
     ```
   - more

1. `javap` — print java class information
   - `-v` — verbose
   - `-c` — Disassemble the code
     - can be used to inspect if atomic

1. `jshell` — REPL from Java 9

1. `jconsole` — Java Monitoring and Management Console

1. `jmap` and `jhat` (deprecated) for heap dump and examining dump — see [Debugging](#Debugging)

1. `serialver` — get serial version ID

1. sign
   - `keytool` — signatures, certificates
     - password for cacerts — `changeit`
   - `jarsigner` — add a signature to a (jar) file

1. `javah` — produces a C header file from class files for `native` methods

## JAR

1. `jar` — creates an archive for classes and resources, and can manipulate or restore individual classes or resources from an archive
   ```shell
   jar [OPTION...] [ [--release VERSION] [-C dir] files] ...
   ```
   - [docs](https://docs.oracle.com/javase/8/docs/technotes/guides/jar/)
   - compression — ZIP
   - similar to `tar`
     ```shell
     jar cvf JARFileName File1 File2 ...
     ```
   - `.exe` wrapper — Launch4J, IzPack, etc.
   - resources
     - resources finding — delegates to class loader, which remembers how to locate the class, so it can then search for the associated resource in the same location
     - `URL Class::getResource(String name)`, `InputStream Class::getResourceAsStream(String name)`
     - resource name
       - absolute — starts with `/`
       - relative — `data/text/about.txt`

1. manifest
   ```manifest
   Manifest-Version: 1.0
   lines describing this archive

   Name: Woozle.class
   lines describing this file
   Name: com/mycompany/mypkg/
   lines describing this package
   ```
   - each jar file contains a `META-INF/MANIFEST.MF` manifest file
   - syntax — key-value entries
     - main section — starts with `Manifest-Version`, applies to the whole JAR file
     - Subsequent entries — starts with `Name`, can specify properties of named entities such as individual files, packages, or URLs
     - section delimiter — blank lines
     - file end — the file must end with a newline
   - edit manifest
     ```shell
     jar cfm JARFileName ManifestFileName ... # create
     jar ufm MyArchive.jar manifest-additions.mf # update
     ```
   - specify entry point for execution
     - `jar -e` option
     - `Main-Class` in manifest
     - execution — `java -jar MyProgram.jar`
   - sealing — a package can have no more classes, `Sealed: boolean`, `false` by default
     ```manifest
     Name: com/mycompany/util/
     Sealed: true
     ```
     - global default defined in main section

# Philosophy

1. class based
   - everything inside class

1. camelCase naming
   - `Character.isJavaIdentifierStart()` and `Character.isJavaIdentifierPart()`
   - `$` is intended for names that are generated by the Java compiler and other tools

1. curly braces and semicolons

1. initialize local variables before read otherwise compilation error

1. does not have operator overloading

## Control Flow

1. no block variable shadowing — may not declare identically named variables in two nested blocks
   - in JS and C++ inner one shadows outer one

1. `switch`
   - A case label can be
     - primitive type expressions — a constant expression of type `char` , `byte` , `short` , or `int`
     - `Enum` — like `with` in JS
       ```java
       Size sz = . . .;
       switch (sz)
       {
           case SMALL: // no need to use Size.SMALL
               // . . .
               break;
           // . . .
       }
       ```
     - strings — Starting with Java SE 7, a string literal, uses `hashCode()` behind scenes

1. labeled `break` and `continue` — for labeled blocks, can only jump out of a block, never into a block

1. iterator — `for (variable : collection) statement`
   - `collection` — an array or an object of a class that implements the `Iterable` interface
   - see [Collections](./javaUtils.md#Collections)

1. vararg parameter — `...`
   - if only an array passed, then that array is used, without nesting

## Package

1. package
   - package name — reversely ordered domain
   - package availability — A class can use all classes from its own package and all public classes from other packages.
   - package at runtime
     - locating classes is done by compiler — the only benefit of the `import` statement is convenience
     - canonical name after compilation — the byte codes in class files always canonical names to refer to other classes

1. class importation
   - built-in — `java.lang`
   - without `import` — use canonical name
   - `import` statement
     ```java
     import java.time.*;
     import java.time.LocalDate;
     ```
     - import a class — canonical name
     - import a package — `*`
     - import a inner class — `java.util.AbstractMap.SimpleEntry`
     - solve name conflict — import the specific class, or use canonical name
       ```java
       import java.util.*;
       import java.sql.*;
       // compile-time error when use `Date` class
       ```
   - static imports — the importing of static methods and fields
     ```java
     import static java.lang.System.*;
     import static java.lang.System.out;
     ```

1. add to package — put the name of the package at the top of a source file
   ```java
   package com.example;
   ```
   - directory — match the canonical name
     ```shell
     javac com/mycompany/PayrollApp.java
     java com.mycompany.PayrollApp
     ```
   - default package — classes belong to the default package if no `package` statement
   - no custom `java.` prefixed packages — disallow loading of user-defined classes whose package name starts with "`java.`"

1. class path
   ```
   /home/user/classdir:.:/home/user/archives/archive.jar
   c:\classdir;.;c:\archives\archive.jar
   ```
   - system property — `java.class.path`
   - possible components
     ```shell
     /home/user/classdir:.:/home/user/archives/'*'
     # - In UNIX, the `*` must be escaped to prevent shell expansion.
     # c:\classdir;.;c:\archives\*
     ```
     - base directory for the package tree
     - jar files
     - jar file directory
     - do not add runtime libary files — `rt.jar` and the other JAR files in the `jre/lib` and `jre/lib/ext` directories are always searched for classes (modules from JDK 9, and no more `ext`)
   - used by `java` but not `javac`
     - the `javac` compiler — always looks for files in the current directory
     - the `java` virtual machine — launcher only looks into the class path, default class path is `.`
   - class search order
     - for `javac` — from `java.lang` to imports to current package
     - for `java` — from runtime libary to the class path
   - set class path
     - `-cp` or `-classpath` option
       ```shell
       java -classpath /home/user/classdir:.:/home/user/archives/archive.jar MyProg
       # java -classpath c:\classdir;.;c:\archives\archive.jar MyProg
       ```
     - the `CLASSPATH` environment variable

# Fundamentals

## Data Types

### primitive types

1. integer types
   - types
     - `byte`
     - `short` — 2 bytes
     - `int`
     - `long`
   - number literals
     - `long` — `l` or `L` suffix for `long` type
     - hexadecimal, octal and binary — `0x`, `0`, `0b` or `0B`
     - friendly underscores — `1_000_000`, `0b1111_0100_0010_0100_0000`
   - no `unsigned`
   - shift overflow bits -- mod
     ```java
     1l << 65 // 1l << (65 % 64)
     ```

1. loop shift

1. float point types
   - types
     - `float` — 4 bytes
     - `double`
   - number literals
     - `float` — `f` or `F` suffix
     - `double` — `d`, `D` suffix or no suffix
     - exponent — `e`
     - binary exponent — `p`, e.g. `0x1.0p-3` (2^-3)
   - overflows and errors
     - `Double.POSITIVE_INFINITY`, `Double.NEGATIVE_INFINITY`, and `Double.NaN`
     - `Double.isNaN()`

1. `char` — describes a code unit in the UTF-16 BE encoding
   - syntax — single quote
   - Unicode escaping, e.g. `\u0fff` — inside and outside quotes
     ```Java
     public static void main(String\u005B\u005D args) {}
     "\u0022+\u0022" // yielding ""+""
     // \u000A is a newline // syntax error
     // since \u000A is replaced with a newline when the program is read
     // Look inside c:\users // syntax error
     ```
     - processing — Unicode escape sequences are processed before the code is parsed
     - other escapes — `\b`, `\t`, `\n`, `\r`
     - `native2ascii` — CLI for converting the native character encoding to plain ASCII, removed in JDK 9 due to the ability to support UTF-8 based properties resource bundles
   - code unit — a 16-bit value
     - supplementary characters — whose code points are greater than `U+FFFF`, encoded as consecutive pairs of code units, a range of 2048 unused values of the basic multilingual plane
     - surrogates area — high-surrogates range `U+D800` to `U+DBFF` for the first code unit, low-surrogates range `U+DC00` to `U+DFFF` for the second code unit
   - usage
     - use `String` — recommendation is not to use the `char` type unless you are actually manipulating UTF-16 code units

1. `boolean`
   - cannot convert between integers and boolean values
   - `if (x = 0)` does not compile
   - stored as `int`

#### primitive type conversion

1. conversion
   - legal conversion — types with less information to types with more information, but not vice versa
   - type priority — `double` > `float` > `long` > `int` > `char`
   - implicit conversion using operators — converted to a common type before the operation is carried out
     - example — for `int x`, `x += 3.5` is `x = (int)(x + 3.5)`

1. casts
   ```java
   double x = 9.997;
   int nx = (int) x;
   int nx2 = (int) Math.round(x); // Math.round() return long for double, int for float
   ```
   - truncate when out of range — `(byte) 300` is 44
   - not between `boolean` and number — cannot cast between `boolean` values and any numeric type

### other types

1. `enum`
   ```java
   enum Size { SMALL, MEDIUM, LARGE, EXTRA_LARGE };
   Size s = Size.MEDIUM; // s can be null
   ```
   ```java
   public enum Size {
       SMALL("S"), MEDIUM("M"), LARGE("L"), EXTRA_LARGE("XL");
       private String abbreviation;
       private Size(String abbreviation) { this.abbreviation = abbreviation; }
       public String getAbbreviation() { return abbreviation; }
   }
   ```
   - `enum` extends `Enum` — `Size` is actually a subclass of `Enum`, having exactly four instances (static field)
     - ?? — not possible to construct new objects, `==` can be used
   - implicitly defined methods (i.e. added by the compiler)
     - `static E[] values()`
     - `static E valueOf(String name)`

1. `Enum`
   ```java
   public abstract class Enum<E extends Enum<E>> extends Object
   implements Comparable<E>, Serializable
   ```
   - `String toString()`
   - `static <T extends Enum<T>> T valueOf(Class<T> enumType, String name)`
   - `int ordinal()`
   - `int compareTo(E other)` — order comparaison, result <0, 0 or >0

1. arrays
   ```java
   int[] a = new int[100];
   int[] smallPrimes = { 2, 3, 5, 7, 11, 13 };
   int[] smallPrimes2 = new int[] { 17, 19, 23, 29, 31, 37 };
   new int[] { 17, 19, 23, 29, 31, 37 }; // anonymous array
   ```
   - arrays are objects — extends `Object` and implements `Cloneable`, `Serializable`
     - `final int length`
     - `T[] clone()`
     - `Object` methods
   - initialization
     - all elements are initialized with zero or `false`
     - Arrays of objects are initialized with the special value `null`
       ```java
       String[] names = new String[10];
       ```
   - two dimensional
     ```java
     double[][] balances;
     balances = new double[NYEARS][NRATES];
     int[][] magicSquare =
         {
             {16, 3, 2, 13},
             {5, 10, 11, 8},
             {9, 6, 7, 12},
             {4, 15, 14, 1}
         };
     ```
   - ragged
     ```java
     int[][] odds = new int[NMAX + 1][];
     for (int n = 0; n <= NMAX; n++)
         odds[n] = new int[n + 1];
     ```

## Classes and Modifiers

1. `public class`
   - filename and class name — the name of the file must match the name of the `public` class
   - unique in a file — can only have one `public` class in a source file
   - when run `java ClassName` in CLI, the `main` method in `ClassName` is run

1. `class`
   - `this`
     - field variable shadowing — `this.` is optional, local variables can shadow instance fields
     - implicit parameter — implicit parameter `this` does not appear in the method declaration
       - can be explicitly declared as the first parameter, usually for annotations
     - as constructor — the form `this(...)`, constructor call must be the first statement in a constructor
   - initialization
     - implicit field initialization — fields automatically set to a default zero
     - explicit field initialization — initialize with constant value or an expression
     - initialization block
       - can be `static` — static initialization block
       - can set fields but cannot read later fields — legal to set fields defined later in the class. However, to avoid circular definitions, not legal to read from fields initialized later
     - execution order — runs after `super()` call or other constructor call, but before the rest of the constructor, see below
   - constructors
     - method name — same as the class
     - `new` — must be called with `new`
     - default no-arg constructor — when no constructor present, a no-argument constructor is provided
     - call another constructor — see `this` above
   - execution order when a constructor is called
     1. other constructor call — if the first line of the constructor calls a second constructor, then the second constructor runs before the body of this constructor.
     1. implicit field initialization — all data fields are initialized to their default values (0 , `false` , or `null`)
     1. explicit field initialization and initialization blocks — all field initializers and initialization blocks are executed, in the order in which they occur in the class declaration
     1. the rest — The body of the constructor is executed.
   - encapsulation
     - getter, setter — `private` data field with `public` accessor and mutator
     - return clone for mutable objects — If you need to return a reference to a mutable object, return a clone
   - destructor
     - garbage collection — Java does automatic garbage collection, does not support destructors
     - `Object::finalize` — The `finalize` method will be called before the garbage collector sweeps away the object, but do not rely on, since cannot know when this method will be called, deprecated in JDK 9
     - `Runtime::addShutdownHook`

1. access modifiers
   - `public` — no access limit
   - `private` — accessible only when the class is the same
   - `protected` — can be accessed by subclasses and within the same package
     - limitation to subclasses — when not within the same package, `SuperType.protectedField` are not accessible to subclass
   - default package access — when no access modifiers specified, can be accessed within the same package
   - use in fields — `private` is recommended
   - access privileges when overriding — no more restrictive access privileges when overriding

1. other modifiers
   - `final`
     - `final` fields — must be initialized when the object is constructed (can be initialized in constructor) and cannot be modified
     - `final` methods — cannot be overloaded
     - `final class` — cannot be inherited, and only the methods, not the fields, are automatically `final`
     - `final` parameters — cannot be modified
   - `static`
     - call by instance — static methods can be invoked by object call, but not recommended
     - execution order — static initialization occurs when the class is first loaded
     - get class from static method (`this.getClass()` will not work in static methods) besides `.class` property
       ```java
       new Object(){}.getClass().getEnclosingClass();
       ```
   - `strictfp` — methods tagged with the `strictfp` keyword must use strict rules for floating-point computations that yield reproducible results

## Math

1. `Math` — elementary exponential, logarithm, square root, and trigonometric functions
   - `Math.E`, `Math.PI`
   - `static double random()` — uses `java.util.Random` behind scenes
   - `min`, `max`
   - double
     - `public static double ulp(double d)` — An ulp, unit in the last place, of a double value is the positive distance between this floating-point value and the double value next larger in magnitude
   - rounding
     - `static double ceil(double a)`
     - `static long round(double a)`  
       `static int round(float a)`
     - `static double floor(double a)`
     - `Math.floorDiv()`
     - `Math.floorMod(x, y)` — `x - Math.floorDiv(x, y) * y`
       - compared to `x % y` — `x - x / y * y`
   - `-Exact` suffixed methods — `ArithmeticException` if overflow
     - `static int addExact(int x, int y)`  
       `static long addExact(long x, long y)`
     - `addExact`, `subtractExact`, `multiplyExact`, `decrementExact`, `incrementExact`, `negateExact`
     - `static int toIntExact(long value)`
   - more

1. `java.util.Random` — generate a stream of pseudorandom numbers, of which `Math.random()` uses an `static final` instance
   ```java
   public class Random extends Object
   implements Serializable
   ```
   - creation
     - `Random()`
     - `Random(long seed)`
   - thread-safe — use `ThreadLocalRandom` to avoid `AtomicLong::compareAndSet`
   - set — `void setSeed(long seed)`
   - next — for `boolean`, `byte`, `double`, `float`, `int`, `long`
     - `int nextInt()`
     - `int nextInt(int bound)`
     - more
     - `double nextGaussian()`
   - stream
   - `java.security.SecureRandom`

1. `StrictMath` — guaranteeing identical results on all platforms

1. `java.math.BigInteger`
   ```java
   public class BigInteger
   extends Number
   implements Comparable<BigInteger>
   ```
   - creation
     - `static BigInteger valueOf(long val)`
     - `static BigInteger ONE`
     - `static BigInteger TEN`
     - `static BigInteger ZERO`
   - arithmetic
     - `BigInteger add(BigInteger other)`
     - `BigInteger subtract(BigInteger other)`
     - `BigInteger multiply(BigInteger other)`
     - `BigInteger divide(BigInteger other)`
     - `BigInteger mod(BigInteger other)`
     - `BigInteger modInverse(BigInteger m)`
     - `BigInteger modPow(BigInteger exponent, BigInteger m)`
     - more

1. `java.math.BigDecimal` — Immutable, arbitrary-precision signed decimal numbers, decimal version of `BigInteger`

## Built-In Classes

1. inside `java.lang` package

### System

1. `System`
   ```java
   public final class System extends Object
   ```
   - std
     - `static InputStream in` — instance of `BufferedInputStream`
     - `static PrintStream err`
     - `static PrintStream out`
     - `static Console console()`
     - `static void setErr(PrintStream err)`
     - `static void setIn(InputStream in)`
     - `static void setOut(PrintStream out)`
   - util
     - `static native void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)`
     - `static long currentTimeMillis()`
     - `static long nanoTime()`
     - `static native int identityHashCode(Object x)` — `Object::hashCode` regardless of overriden or not, 0 for `null`
   - system property — see [Legacy Collections](./javaUtils.md#Legacy-Collections) for the list of system properties
     - `static Properties getProperties()`
     - `static String getProperty(String key)`  
       `static String getProperty(String key, String def)`
     - `Integer::getInteger`, `Long::getLong`
     - `static void setProperties(Properties props)`  
       `static String setProperty(String key, String value)`
     - `static String clearProperty(String key)`
     - `static String lineSeparator()` — equivalent to `System.getProperty("line.separator")`
       - see [`File`](./javaIO.md#File-Classes) for other separators
   - environment
     - `static Map<String,String> getenv()`
     - `static String getenv(String name)`
   - JVM
     - `static void exit(int status)`
     - `static void gc()` — run garbage collector
     - `static SecurityManager getSecurityManager()`
     - `static Channel inheritedChannel()` — the channel inherited from the entity that created this Java virtual machine
     - `static void load(String filename)`
     - `static void loadLibrary(String libname)`
     - `static String mapLibraryName(String libname)`
     - `static void runFinalization()`
     - `static void setSecurityManager(SecurityManager s)`

1. `SecurityManager` — check permissions, like read / write on certain files

### String

1. `CharSequence` — provides uniform, read-only access to many different kinds of char sequences
   ```java
   public interface CharSequence
   ```
   - `char charAt(int index)`
   - `default IntStream chars()`
   - `default IntStream codePoints()`
   - `int length()`
   - `CharSequence subSequence(int start, int end)`
   - `String toString()`

1. `String`
   ```java
   public final class String extends Object
   implements Serializable, Comparable<String>, CharSequence
   ```
   - length
     - `int length()`
     - `boolean isEmpty()`
     - `int codePointCount(int startIndex, int endIndex)` — the number of code points
       ```java
       int cpCount = greeting.codePointCount(0, greeting.length());
       ```
   - substring or transform
     - `char charAt(int index)`, `int codePointAt(int index)`, `codePointBefore`
     - conversion methods to and from `bytes[]`, `char[]`
     - `String substring(int beginIndex)` `String substring(int beginIndex, int endIndex)`
     - `String replace(char oldChar, char newChar)`  
       `String replace(CharSequence target, CharSequence replacement)`  
       `String replaceAll(String regex, String replacement)`  
       `String replaceFirst(String regex, String replacement)`
     - `String toLowerCase()` `String toUpperCase()`
     - `String trim()`
     - `String[] split(String regex)`  
       `String[] split(String regex, int limit)`
   - creation
     - `static String format(String format, Object... args)`  
       `static String format(Locale l, String format, Object... args)`
     - `static String join(CharSequence delimiter, CharSequence... elements)`  
       `static String join(CharSequence delimiter, Iterable<? extends CharSequence> elements)`  
       `Collectors::joining`  
       `StringJoiner`
     - `valueOf`
       - `static String valueOf(type c)` — from various types
       - `static String copyValueOf(char[] data)` — `valueOf` equivalent  
         `static String copyValueOf(char[] data, int offset, int count)`
     - `String concat(String str)`
     - `String(byte[] bytes)`  
       `String(byte[] bytes, Charset charset)`  
       `String(byte[] bytes, int offset, int length)`  
       `String(byte[] bytes, int offset, int length, Charset charset)`
     - `String(int[] codePoints, int offset, int count)`
     - `String(char[] value)`  
       `String(char[] value, int offset, int count)`
     - `String(String original)`
     - `String(StringBuffer buffer)`
     - `String(StringBuilder builder)`
   - comparaison
     - `int hashCode()`
       ```java
       int hash = 0;
       for (int i = 0; i < length(); i++)
           hash = 31 * hash + charAt(i);
       ```
     - `boolean equals(Object other)`, `boolean equalsIgnoreCase(String other)`
       - reference type — do not use the `==` operator to test whether two strings are equal
       - string pool — only string literals are shared, not strings that are the result of operations like `+` or `substring`
     - `int compareToIgnoreCase(String str)`
     - `boolean startsWith(String prefix)`, `boolean endsWith(String suffix)`
     - `boolean contentEquals(CharSequence cs)`, `boolean contentEquals(StringBuffer sb)`
     - `String intern()` — determined by `equals`, return the string from string pool, add to the pool if not contained already
   - transverse
     - with index `i`
       ```java
       // incremental
       int cp = sentence.codePointAt(i);
       if (Character.isSupplementaryCodePoint(cp)) i += 2;
       else i++;
       // decreasing
       i--;
       if (Character.isSurrogate(sentence.charAt(i))) i--;
       int cp = sentence.codePointAt(i);
       ```
     - `int offsetByCodePoints()` — get at the i^th^ code point
     - `int offsetByCodePoints(int index, int codePointOffset)` — the resulted index by moving given number of code points from given index
     - `str.codePoints().toArray()`
   - find
     - `boolean contains(CharSequence s)`
     - `boolean matches(String regex)`
     - `boolean regionMatches(boolean ignoreCase, int toffset, String other, int ooffset, int len)` — Tests if two string regions are equal  
       `boolean regionMatches(int toffset, String other, int ooffset, int len)`
     - `int indexOf(String str)`  
       `int indexOf(String str, int fromIndex)`  
       `int indexOf(int cp)`  
       `int indexOf(int cp, int fromIndex)`
     - `int lastIndexOf(String str)`  
       `int lastIndexOf(String str, int fromIndex)`  
       `int lastIndexOf(int cp)`  
       `int lastIndexOf(int cp, int fromIndex)`

1. `StringBuilder` — mutable, not synchronized `StringBuffer`, build a string from many small pieces
   ```java
   public final class StringBuilder extends Object
   implements Serializable, CharSequence
   ```
   - constructors
     - `StringBuilder()`
     - `StringBuilder(CharSequence seq)`
     - `StringBuilder(int capacity)`
     - `StringBuilder(String str)`
   - modify
     - `StringBuilder append(String str)`
     - `StringBuilder append(char c)`
     - `StringBuilder appendCodePoint(int cp)`
     - `void setCharAt(int i, char c)`
     - `StringBuilder insert(int offset, String str)`
     - `StringBuilder insert(int offset, char c)`
     - `StringBuilder delete(int startIndex, int endIndex)`
     - `StringBuilder deleteCharAt(int index)`
     - more
   - output — `String toString()`

1. `StringBuffer`
   ```java
   public final class StringBuffer extends Object
   implements Serializable, CharSequence
   ```

1. `java.util.StringJoiner` — store components in `String[]` with doubling strategy when expanding capability, used by `Collectors::joining` and `String::join`
   ```java
   public final class StringJoiner extends Object
   ```
   - constructors
     - `StringJoiner(CharSequence delimiter)`
     - `StringJoiner(CharSequence delimiter, CharSequence prefix, CharSequence suffix)`
   - use
     - `StringJoiner add(CharSequence newElement)`
     - `int length()`
     - `StringJoiner merge(StringJoiner other)`
     - `StringJoiner setEmptyValue(CharSequence emptyValue)`
     - `String toString()`

### Object Wrappers

1. wrappers
   - `Integer` , `Long` , `Float` , `Double` , `Short` , `Byte` , `Character` , and `Boolean`
   - all extends `Number` except `Boolean` — no arithmetic operations and number conversions for boolean
   - immutable and `final`
   - autowrapping (autoboxing) — done by compiler, nothing related to VM
     - `valueOf` — example: `list.add(3);` is automatically translated to `list.add(Integer.valueOf(3));`
     - `typeValue()` — example: the compiler translates `int n = list.get(i);` into `int n = list.get(i).intValue();`
     - arithmetic operations — example: `Integer n = 3; n++;` compiler automatically inserts instructions to unbox the object, increment the resulting value, and box it back.
   - fixed wrapping — wrapped into fixed objects
     - `boolean , byte , char <= 127`
     - `short` , and `int` between -128 and 127
   - wrapper class references can be `null` — possible `NullPointerException`
   - conditional promotion — `Integer` to `Double`
     ```java
     Integer n = 1;
     Double x = 2.0;
     System.out.println(true ? n : x); // Prints 1.0
     ```

1. `Number`
   ```java
   public abstract class Number implements Serializable
   ```
   - `byte byteValue()`
   - `abstract double doubleValue()`
   - `abstract float floatValue()`
   - `abstract int intValue()`
   - `abstract long longValue()`
   - `short shortValue()`

1. `Integer`
   ```java
   public final class Integer
   extends Number
   implements Comparable<Integer>
   ```
   - fields
     - `static int BYTES` — usually 4
     - `static int MAX_VALUE`
     - `static int MIN_VALUE`
     - `static int SIZE` — usually 32
     - `static Class<Integer> TYPE` — `int.class`
   - creation
     - `Integer(int value)` — deprecated since JDK 9
     - `Integer(String s)` — uses `parseInt` internally, deprecated since JDK 9
     - `static Integer decode(String nm)` — accepts decimal, hexadecimal (`0x`, `0X`, `#` prefixed), octal (`0` prefixed), can be negative
     - `static Integer valueOf(int i)`  
       `static Integer valueOf(String s)` — uses `parseInt` internally  
       `static Integer valueOf(String s, int radix)`
   - conversion to primitive types
     - methods in `Number`
       - `int intValue()`
     - `static int parseInt(String s)`  
       `static int parseInt(String s, int radix)`
   - arithmetic operations
     - `static int signum(int i)`
     - `static int sum(int a, int b)`
   - unsigned
     - `static int parseUnsignedInt(String s)`
     - `static int parseUnsignedInt(String s, int radix)`
     - `static int divideUnsigned(int dividend, int divisor)`
     - `static int compareUnsigned(int x, int y)`
     - `static int remainderUnsigned(int dividend, int divisor)`
     - `static String toBinaryString(int i)` — two's complement representation
     - `static String toHexString(int i)`
     - `static String toOctalString(int i)`
     - `static String toUnsignedString(int i)`
     - `static String toUnsignedString(int i, int radix)`
     - `static long toUnsignedLong(int x)`
   - bits in the two's complement
     - `static int bitCount(int i)` — the number of one-bits
     - `static int highestOneBit(int i)`
     - `static int lowestOneBit(int i)`
     - `static int numberOfLeadingZeros(int i)`
     - `static int numberOfTrailingZeros(int i)`
     - `static int reverse(int i)`
     - `static int reverseBytes(int i)`
     - `static int rotateLeft(int i, int distance)`
     - `static int rotateRight(int i, int distance)`
   - for `int` and `null` compatible
     - `static int compare(int x, int y)`
     - `static int hashCode(int value)`
     - `static String toString(int i)`
     - `static String toString(int i, int radix)`

1. `Double`
   - counterparts of fields and methods in `Integer`
   - IEEE 754
     - `static int MAX_EXPONENT`
     - `static int MIN_EXPONENT`
     - `static double MIN_NORMAL`
   - infinite and not a number
     - `static double NaN`
     - `static double NEGATIVE_INFINITY`
     - `static double POSITIVE_INFINITY`
     - `static boolean isFinite(double d)`
     - `boolean isInfinite()`
     - `static boolean isInfinite(double v)`
     - `boolean isNaN()`
     - `static boolean isNaN(double v)`

1. `Character` — see after

1. `Boolean`
   ```java
   public final class Boolean extends Object
   implements Serializable, Comparable<Boolean>
   ```

# Inheritance

1. inheritance
   - `extends`
   - `super`
     <!-- - special keyword, cannot be assigned -->
   - `super()`
     - first statement — the call using `super` must be the first statement in the constructor for the subclass
     - default no-arg constructor — if the subclass constructor does not call a superclass constructor explicitly, the no-argument `super()` is invoked
     - order — invoked before initializers
   - polymorphism
     - object variables are polymorphic — a variable can be assigned subclasses of its type
     - no polymorphism exploit in arrays — all arrays remember the element type with which they were created (`new`ed)
       ```java
       Manager[] managers = new Manager[10];
       Employee[] staff = managers; // OK
       staff[0] = new Employee("Harry Hacker", ...); // ArrayStoreException
       ```

1. method call
   - overriding resolution — according to function signatures, done by compiler
     - function signature
       - return type — return type is not a part of the signature (but is in JVM so bridge methods work)
       - bridge method — when return another type, a bridge method is synthesized
   - static binding — for `private`, `static`, `final` methods or constructors, done by compiler
   - dynamic binding — JVM resolving the implicit parameter with method table lookup
     - method table — method table lists all method signatures and the actual methods to be called, computed by VM for each class in advance
     - order of method table lookup — from actual type to superclasses to `Object`
     - overhead of dynamic binding — no need to use static binding to avoid the overhead, JIT does the inlining optimization

1. casting
   - direct assign to more general — cast to more general, a subclass reference to a superclass variable, direct assign
   - cast needed for more specific — cast to more specific, a superclass reference to a subclass variable, use the same syntax as primitive type cast, check at runtime
     - exception — `ClassCastException` when cannot cast
     - check — use `instanceof` to check before casting
     - cast range — can cast only within an inheritance hierarchy
     - minimal usage — best to minimize the use of casts and the `instanceof` operator

1. abstract class
   - no instance — cannot be instantiated, but can be super type
   - abstract methods — any class can be tagged `abstract`, but not vice versa
     - can be none — abstract classes can have no abstract methods, abstract classes can have fields and concrete methods
     - none in concrete class — a class with one or more `abstract` methods must itself be declared `abstract`

1. `Object` — the cosmic superclass
   - for all reference type — only the values of primitive types (numbers, characters, and boolean values) are not objects
   - `boolean equals(Object otherObject)` — determines whether two object references are identical
     - override — template as below, need to override `hashCode` also if `equals` overriden
       ```java
       @Override
       public boolean equals(Object otherObject) {
           // super.equals(other)
           // a quick test to see if the objects are identical, may be unnecessary if covered in `super.equals(other)`
           if (this == otherObject) return true;
           // must return false if the explicit parameter is null
           if (otherObject == null) return false;
           // if the classes don't match, they can't be equal
           // alternative — use instanceof and tagging final to allow objects of different subclasses to be equal to one another
           if (getClass() != otherObject.getClass()) return false;
           // now we know otherObject is a non-null Employee
           Employee other = (Employee) otherObject;
           // test whether the fields have identical values
           return name.equals(other.name)
               && salary == other.salary
               && hireDay.equals(other.hireDay);
       }
       ```
   - `native int hashCode()` — derived from the memory address, recommended to be compatible with `equals()`
   - `String toString()` — `getClass().getName() + "@" + Integer.toHexString(hashCode());`
     - for arrays — arrays will come up with something like `"[I@1a46e30"`, where `[I` denotes an array of integers <!-- ]] -->
   - `Class<?> getClass()`
   - `protected Object clone()`
   - `protected void finalize()` — deprecated in JDK 9
   - concurrency related — see after
   - methods in `Objects` and object wrappers

# Interfaces, Lambdas and Inner Classes

## Interfaces

1. interface
   - methods in interfaces
     - non-static methods — all methods are implicitly `abstract public`, redundancy is discouraged
       - when implementing — `public` still required when implementing
     - static methods — supported as of Java SE 8, need explicit access modifier
     - prohibited modifiers — an interface method may not be declared with `protected` or package access, or with the modifiers `final`, `synchronized`, or `native`
   - inner classes in interfaces — automatically `static public`
   - constant fields — implicitly `public static final`, automatically inherited when implementing
   - no instance fields
   - `implements`, `SuperInterface.super` — examples below
   - can be generic — `class Employee implements Comparable<Employee>`
   - use as super type — supports `instanceof`, `extend`, multiple inheritance
     - diamond problem — see below
   - initialization time point — initialized when they are first accessed, typically by reading a field that is not a compile time constant

1. default methods
   - `default` implementation
     ```java
     public interface Comparable<T> {
         default int compareTo(T other) { return 0; } // By default, all elements are the same
     }
     ```
   - `default` method conflict resolving — interface vs superclass vs another interface
     - superclasses take precedence — default methods are ignored if implemented in superclasses
       - no default `Object` methods — not possible to make a default method that redefines one of the methods in the `Object` class
       - no abstract `Object` methods — redeclaring methods from the `Object` class do not make the methods abstract, no effect to function interfaces
       - attach javadoc by `Object` methods — some interfaces redeclare `Object` methods in order to attach javadoc comments, like `Comparator`
     - interface clash — if clashes, even only one of the methods is `default`, the method must be overriden
       - `SuperInterface.super` — choose one when interface clash
         ```java
         interface Named { default String getName() { return getClass().getName() + "_" + hashCode(); } }
         interface Person { default String getName() { return ""; }; }
         class Student implements Person, Named {
             public String getName() { return Person.super.getName(); }
         }
         ```

1. companion class
   - used to place static methods — it has been common to place static methods in companion classes, like `Collection` / `Collections` or `Path` / `Paths`
   - used to implement some or all of methods of an interface — such as `Collection` / `AbstractCollection` or `MouseListener` / `MouseAdapter`
   - `default` and `static` methods in interfaces — with Java SE 8, this technique of companion class is obsolete, as the support of default methods and static methods

1. some use of interface
   - callback — pass an object of a class implementing a callback interface, methods in the interface will be called when the event fires
   - tagging interface — `Cloneable`

### Common Interfaces

1. `Interface Comparable<T>` — `int compareTo(T o)`
   - overflow when implementing with subtraction — make sure absolute values of operands are at most `(Integer.MAX_VALUE - 1) / 2`
     - otherwise use `Integer.compare()`
   - `equals()` compliance — strongly recommended (though not required) to comply with `equals()`
     - `BigDecimal` violates — `new BigDecimal("1.0").equals(new BigDecimal("1.00"))` is `false` because the numbers differ in precision
   - associative — to make `x.compareTo(y)` compatible with `y.compareTo(x)`, start with below when implementing
     ```java
     if (getClass() != other.getClass()) throw new ClassCastException();
     ```

1. `Interface java.util.Comparator<T>` — `int compare(T o1, T o2)`
   - nature and reversed order
     - `static <T extends Comparable<? super T>> Comparator<T> naturalOrder()`
     - `static <T extends Comparable<? super T>> Comparator<T> reverseOrder()` — uses `Collections::reverseOrder` under the hood
   - key extract
     ```java
     // sort people by name
     Arrays.sort(people, Comparator.comparing(Person::getName));
     ```
     - `static <T,U extends Comparable<? super U>> Comparator<T> comparing(Function<? super T,? extends U> keyExtractor)`
     - `static <T,U> Comparator<T> comparing(Function<? super T,? extends U> keyExtractor, Comparator<? super U> keyComparator)`
     - `static <T> Comparator<T> comparingDouble(ToDoubleFunction<? super T> keyExtractor)`
     - `static <T> Comparator<T> comparingInt(ToIntFunction<? super T> keyExtractor)`
     - `static <T> Comparator<T> comparingLong(ToLongFunction<? super T> keyExtractor)`
   - comparator chaining
     ```java
     Arrays.sort(people, Comparator
         .comparing(Person::getLastName)
         .thenComparing(Person::getFirstName)
     );
     ```
     - `default Comparator<T> thenComparing(Comparator<? super T> other)`  
       `default <U extends Comparable<? super U>> Comparator<T> thenComparing(Function<? super T,? extends U> keyExtractor)`  
       `default <U> Comparator<T> thenComparing(Function<? super T,? extends U> keyExtractor, Comparator<? super U> keyComparator)`
     - `default Comparator<T> thenComparingType(ToTypeFunction<? super T> keyExtractor)` — `type` for `int`, `double` and `long`
     - `default Comparator<T> reversed()` — uses `Collections::reverseOrder` under the hood
   - comparing `null`
     - `static <T> Comparator<T> nullsFirst(Comparator<? super T> comparator)`
     - `static <T> Comparator<T> nullsLast(Comparator<? super T> comparator)`

1. `Interface Cloneable`
   - mark interface — serves as a tag, a checked `CloneNotSupportedException` if an object requests cloning but does not implement that interface
   - make a class cloneable — implement this interface, redefine `clone` to be `public`
     - `Object::clone` — protected, and does a shallow copy
     - use `Object::clone` — `(T) super.clone()`
   - return `Object` by convention — Up to Java SE 1.4, the clone method always had return type `Object`, but now the correct return type can be specified
     - inconsistency — `HashMap::clone` and `ArrayList::clone` etc. return `Object`, whereas `int[]::clone` and `ArrayDeque::clone` etc. return specific type

## Lambdas

1. closure
   - effectively final — any captured variable in a lambda expression must be effectively final: no difference if declared `final`
     ```java
     for (int i = 1; i <= count; i++) {
         ActionListener listener = event -> {
             System.out.println(i + ": " + text);
             // Error: Cannot refer to changing i
         };
         new Timer(1000, listener).start();
     }
     ```
     - no mutation outside — illegal to refer to a variable in a lambda expression that is mutated outside
     - no mutation inside — cannot mutate captured value
     - access mutable data — use an array of length 1
   - no block variable shadowing — illegal to declare a parameter or a local variable in the lambda that has the same name as a local variable
   - block scope — the same scope as a nested block
   - same `this` — `this` is the same as what outside the lambda
   - number of instantiations -- only one instantiation inside loops when no closure
     ```java
     static IntUnaryOperator oper = null;
     static int opCounter = 0;
     static int lambdaTest(IntUnaryOperator op) {
         if (op != oper) ++opCounter;
         oper = op;
         return op.applyAsInt(3);
     }
     static void test() {
         for (int i = 0; i < 100; ++i) {
             lambdaTest(j -> j * j);
         }
         System.out.println(opCounter); // 1
     }
     static void test2(int num) {
         for (int i = 0; i < 100; ++i) {
             lambdaTest(j -> j * j * num);
         }
         System.out.println(opCounter); // 100
     }
     ```

1. lambda expression syntax
   - inline
     ```java
     (String first, String second) -> first.length() - second.length();
     ```
   - block with explicit `return`
     ```java
     (String first, String second) -> {
         if (first.length() < second.length()) return -1;
         else if (first.length() > second.length()) return 1;
         else return 0;
     }
     ```
   - type inference
     ```java
     Comparator<String> comp = (first, second) -> first.length() - second.length();
     ```
   - type inference without parentheses
     ```java
     ActionListener listener = event -> System.out.println("The time is " + new Date()");
     ```
   - inferred return type — return type is always inferred, cannot be specified

1. functional interface — an interface with a single abstract method, like `Comparator<T>`
   - for conversion from lambdas — conversion to a functional interface is the only function for lambdas
   - object instance used behind the scenes — methods like `Arrays::sort` receives an object of some class that implements the interface, lambda is executed when invoking the method of that interface
   - `@FunctionalInterface` — optional annotation
   - lambda expression holders (also function interface) — see [Common Functional Interfaces](#Common-Functional-Interfaces) for `java.util.function`

1. method reference — use as lambdas
   ```java
   object::instanceMethod
   this::instanceMethod
   super::instanceMethod // uses `this` as the target and invokes the superclass version of the given method
   Class::staticMethod
   Class::instanceMethod // the implicit parameter becomes explicit
   Class::new // constructor reference
   int[]::new
   ```
   - object instance used behind the scenes — turned into instances of functional interfaces like lambdas
   - `int[]::new` — `new T[n]` is illegal, so libary designers use this syntax to mitigate
     ```java
     Object[] people = stream.toArray();
     Person[] people = stream.toArray(Person[]::new);
     ```

### Common Functional Interfaces

1. `java.util.function` package, all `@FunctionalInterface`

1. `java.util.function.Function<T, R>` — `R apply(T t)`
   - `static <T> Function<T,T> identity()`
   - chaining
     - `default <V> Function<T,V> andThen(Function<? super R,? extends V> after)`
     - `default <V> Function<V,R> compose(Function<? super V,? extends T> before)`
   - variants
     - `java.util.function.DoubleFunction<R>` — `R apply(double value)`
     - `java.util.function.DoubleToIntFunction`
     - `java.util.function.DoubleToLongFunction`
     - `java.util.function.IntFunction<R>`
     - `java.util.function.IntToDoubleFunction`
     - `java.util.function.IntToLongFunction`
     - `java.util.function.LongFunction<R>`
     - `java.util.function.LongToDoubleFunction`
     - `java.util.function.LongToIntFunction`
     - `java.util.function.ToDoubleFunction<T>`
     - `java.util.function.ToIntFunction<T>`
     - `java.util.function.ToLongFunction<T>`
   - variants with two parameters
     - `java.util.function.BiFunction<T,U,R>` — `R apply(T t, U u)`
     - `java.util.function.ToDoubleBiFunction<T,U>`
     - `java.util.function.ToIntBiFunction<T,U>`
     - `java.util.function.ToLongBiFunction<T,U>`

1. operator — `Function` with type parameters of the same primitive type
   ```java
   @FunctionalInterface
   public interface UnaryOperator<T>
   extends Function<T,T>
   ```
   - unary
     - `java.util.function.UnaryOperator<T>`
       - `static <T> UnaryOperator<T> identity()`
     - `java.util.function.DoubleUnaryOperator`
     - `java.util.function.IntUnaryOperator`
     - `java.util.function.LongUnaryOperator`
   - binary
     - `java.util.function.BinaryOperator<T>`
       - `static <T> BinaryOperator<T> maxBy(Comparator<? super T> comparator)`
       - `static <T> BinaryOperator<T> minBy(Comparator<? super T> comparator)`
     - `java.util.function.DoubleBinaryOperator` — `double applyAsDouble(double left, double right)`
     - `java.util.function.IntBinaryOperator`
     - `java.util.function.LongBinaryOperator`

1. `java.util.function.Supplier<T>` — `T get()`
   - variants
     - `java.util.function.BooleanSupplier` — `boolean getAsBoolean()`
     - `java.util.function.DoubleSupplier`
     - `java.util.function.IntSupplier`
     - `java.util.function.LongSupplier`

1. `java.util.function.Consumer<T>` — `void accept(T t)`
   - `default Consumer<T> andThen(Consumer<? super T> after)` — chaining
     ```java
     // default implementation
     return (T t) -> { accept(t); after.accept(t); };
     ```
   - variants
     - `java.util.function.DoubleConsumer` — `void accept(double value)`
     - `java.util.function.IntConsumer`
     - `java.util.function.LongConsumer`
   - variants with two parameters
     - `java.util.function.BiConsumer<T, U>` — `void accept(T t, U u)`
     - `java.util.function.ObjDoubleConsumer<T>`
     - `java.util.function.ObjIntConsumer<T>`
     - `java.util.function.ObjLongConsumer<T>`

1. `java.util.function.Predicate<T>` — `boolean test(T t)`
   - `static <T> Predicate<T> isEqual(Object targetRef)`
   - chaining
     - `default Predicate<T> and(Predicate<? super T> other)`
     - `default Predicate<T> negate()`
     - `default Predicate<T> or(Predicate<? super T> other)`
   - variants
     - `java.util.function.DoublePredicate`
     - `java.util.function.IntPredicate`
     - `java.util.function.LongPredicate`
     - `java.util.function.BiPredicate<T,U>`

## Inner Class

1. inner class
   - explicit reference to the outer class — outer class can be explicitly referred to as `OuterClass.this`
     - passed as implicit parameter to inner class constructors
   - implicit reference — can access the data from the scope in which they are defined
     - synthesized constructor parameter for implicit reference — the compiler modifies all inner class constructors, adding a parameter for the outer class reference
   - constructing inner classes — `new` keyword changes for implicit reference
     - inside outer class — `this.new` or alternatively `new`
     - outside outer class — `outerObj.new`
   - access control — can be hidden from other classes in the same package
     - only inner classes can be private — regular classes always have either package or public visibility
     - `private` accessible for each other — between the outer class and inner classes
   - refer to inner class outside the outer class — `OuterClass.InnerClass`

1. inner class limits
   - static fields — must be `final`
   - static methods — cannot have static methods

1. inner class after compilation or at runtime — synthesized regular classes
   - `Outer$Inner` class — inner classes are translated into regular class files with `$` (dollar signs) delimiting outer and inner class names
     - compared to regular classes — more access privileges to the outer class, like private fields
   - synthesized outer class reference — inner class has a `final` `this$0` field for reference to outer class generated by compiler
   - private inner classes — JVM does not support private classes, so the compiler produces a package-visible class with a private constructor, and a second package-visible constructor that calls the private one
     ```java
     private TalkingClock$TimePrinter(TalkingClock);
     TalkingClock$TimePrinter(TalkingClock, TalkingClock$1);
     // the last parameter type is synthesized solely to distinguish this constructor from others
     new TalkingClock$TimePrinter(this, null); // actual call in outer class
     ```
   - mechanism for more privileged access to outer class — synthesized outer class backdoor method
     - backdoor method — outer class generates a package accessible static `access$0(OuterClass outer)` method (method name can vary slightly), for inner class, outer class private field access is translated to backdoor method call
     - vulnerability — the generated backdoor method name is not legal in source code, but can be exploited by build or modify a class file
   - JVM unaware — the virtual machine does not have any special knowledge about inner classes
   - verify by inspecting class files — use `javap -p` to verify

1. local inner class — class locally in a single method
   - no access modifier — never declared with an access specifier
   - restricted scope — scope is always restricted to the block being declared
   - effectively final closure — can access effectively final local variables
     - as final fields — behind the scenes stored as a final field of inner class, and spawned to constructor for initialization
     - access mutable data — use an array of length 1
   - anonymous inner subclass
     ```java
     new SuperType(construction parameters) {
         // inner class methods and data
     }
     ```
     - implement an interface — `SuperType` can be an interface, the inner class implements that interface
     - extend a class — `SuperType` can also be a class, the inner class extends that class
       - a different subclass — take care that `equals()` with `SuperType` may fail
     - anonymity cannot have constructors — the name of a constructor must be the same as the name of a class
     - use case
       - double brace initialization for `ArrayList`
         ```java
         invite(new ArrayList<String>() {{ add("Harry"); add("Tony"); }});
         ```
       - get the class from static methods, alternative to `T.class`
         ```java
         new Object(){}.getClass().getEnclosingClass();
         ```

1. static inner class
   - static — do not have a outer class reference, can have static fields and methods
   - use case
     - enums are static inner classes
     - use in outer static methods — must be declared static if needed in a outer class static method
     - return type — can be used for holder for a method to return multiple values
   - the only static classes — only inner classes can be declared static
   - implicitly static
     - inner interfaces are implicitly `static`
     - inner classes inside interfaces are automatically `static public`

# Reflection

1. runtime type identification — used by VM for method resolution
   - `Class getClass()` in `Object`
   - `static Class<?> forName(String className)` in `Class`
   - `T.class` if `T` is any Java type (or `void.class`)
   - type capturing — use `Class<T>` as a parameter for type match, when called with a class object, the type parameter `T` will be matched

1. `interface java.lang.reflect.Type` — super interface for all types, implemented or extended by `Class<T>`, `GenericArrayType`, `ParameterizedType`, `TypeVariable<D>`, `WildcardType`
   - `default String getTypeName()`
   - generics reflection methods — in implementing classes or sub-Interfaces

1. `interface java.lang.reflect.AnnotatedElement` — represents an annotated element with methods getting annotations

1. `java.lang.reflect.GenericDeclaration` — entities that declare type variables
   ```java
   public interface GenericDeclaration
   extends AnnotatedElement
   ```
   - `TypeVariable<?>[] getTypeParameters()`

1. `Class`
   ```java
   public final class Class<T> extends Object
   implements Serializable, GenericDeclaration, Type, AnnotatedElement
   ```
   - reflection
     - `String getName()`
     - `String getTypeName()`
     - `String toString()`
     - `Class<?> getComponentType()` — type of elements in an array, `null` if `this` is not an array
     - `ClassLoader getClassLoader()`
     - `T[] getEnumConstants()`
     - `Class<? super T> getSuperclass()`
   - instance creation
     - `T newInstance()`
     - `T cast(Object obj) throws ClassCastException`
   - method reflection — from this class and superclasses, `declared-` only for this class
     - `Field[] getFields()`
     - `Field getField(String name)`
     - `Field[] getDeclaredFields()`
     - `Field getDeclaredField(String name)`
     - `Method[] getMethods()`
     - `Method getMethod(String name, Class<?>... parameterTypes)`
     - `Method[] getDeclaredMethods()`
     - `Method getDeclaredMethod(String name, Class<?>... parameterTypes)`
     - `Constructor[] getConstructors()`
     - `Constructor<T> getConstructor(Class<?>... parameterTypes)`
     - `Constructor[] getDeclaredConstructors()`
     - `Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes)`
   - inner class and outer class
     - `Class<?>[] getClasses()`
     - `Class<?> getEnclosingClass()`
   - generics
     - `Type[] getGenericInterfaces()`
     - `Type getGenericSuperclass()`
     - `TypeVariable<Class<T>>[] getTypeParameters()`
   - get resources, delegating to class loader
     - `URL getResource(String name)`
     - `InputStream getResourceAsStream(String name)`

1. `java.lang.reflect.Field`  
   `java.lang.reflect.Method`  
   `java.lang.reflect.Constructor`
   - `Class<?> getDeclaringClass()`
   - `Class<?>[] getExceptionTypes()` (`Constructor` and `Method`)
   - `Class<?>[] getParameterTypes()` (`Constructor` and `Method`)
   - `int getModifiers()`
   - `String getName()`
   - inherited from `java.lang.reflect.AccessibleObject`
     - `boolean isAccessible()`
     - `void setAccessible()`

1. `java.lang.reflect.Constructor`
   ```java
   public final class Constructor<T>
   extends Executable
   ```
   - `T newInstance(Object... initargs)`

1. `java.lang.reflect.Method`
   ```java
   public final class Method
   extends Executable
   ```
   - `Object invoke(Object obj, Object... args)`
     - For a static method, the first parameter is ignored, use `null`
     - slow and as last resort
   - `Class<?> getReturnType()`
   - Generics
     - `TypeVariable[] getTypeParameters()`
     - `Type getGenericReturnType()`
     - `Type[] getGenericParameterTypes()`

1. `java.lang.reflect.Field`
   ```java
   public final class Field
   extends AccessibleObject
   implements Member
   ```
   - `Object get(Object obj)` — `obj.field`  
     `type getType(Object obj)` — for primitive
   - `void set(Object obj, Object value)`  
     `type setType(Object obj, type value)`

1. `java.lang.reflect.Modifier`
   - `static String toString(int mod)`
   - `static boolean isAbstract(int mod)`
   - `static boolean isFinal(int mod)`
   - `static boolean isInterface(int mod)`
   - `static boolean isNative(int mod)`
   - `static boolean isPrivate(int mod)`
   - `static boolean isProtected(int mod)`
   - `static boolean isPublic(int mod)`
   - `static boolean isStatic(int mod)`
   - `static boolean isStrict(int mod)`
   - `static boolean isSynchronized(int mod)`
   - `static boolean isVolatile(int mod)`

1. `java.lang.reflect.Array`
   ```java
   public final class Array extends Object
   ```
   - `static Object newInstance(Class<?> componentType, int length)`  
     `static Object newInstance(Class<?> componentType, int... dimensions)`
     - in coordination with `ClassObj.getComponentType()`
     - `type[]` can be converted to an `Object`, but not `Object[]`
   - `static int getLength(Object array)`
   - `static void set(Object array)`
   - `static Object get(Object array)`
   - `static type getType(Object array)`

1. `Package`
   ```java
   public class Package extends Object
   implements AnnotatedElement
   ```

## Proxy

1. proxies
   - usage — at runtime, create new classes that implement given interfaces, with a method invocation handler
   - proxy class definition
     - runtime defined class — proxy objects are of classes defined at runtime with names such as `$Proxy0`
     - modifiers and inheritance — all proxies are `public final` and extends `Proxy`
     - cached — only one proxy class for a particular class loader and ordered set of interfaces
     - package — default package if given interfaces all public, else belongs to the package of given non-public interfaces
   - proxying — all proxy classes override the `toString()`, `equals()`, and `hashCode()`, and given interface methods with `InvocationHandler::invoke`
     - other methods in `Object` are untouched

1. `interface java.lang.reflect.InvocationHandler` — invocation handlers
   - `public Object invoke(Object proxy, Method method, Object[] args) throws Throwable`
   - additional data is stored in the invocation handler

1. `java.lang.reflect.Proxy`
   ```java
   public class Proxy extends Object
   implements Serializable
   ```
   - creation
     - `static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)`
     - `static Class<?> getProxyClass(ClassLoader loader, Class<?>... interfaces)`
   - `static InvocationHandler getInvocationHandler(Object proxy)`
   - `static boolean isProxyClass(Class<?> cl)`

1. use example
   ```java
   public class ProxyTest {
       public static void main(String... args) {
           Object[] elems = new Object[1000];
           for (int i = elems.length - 1; i >= 0; —i) {
               elems[i] = Proxy.newProxyInstance(null, new Class[]{ Comparable.class }, new TraceHandler(Integer.valueOf(i)));
           }
           Arrays.binarySearch(elems, Integer.valueOf(ThreadLocalRandom.current().nextInt(elements.length) + 1));
       }
   }
   class TraceHandler implements InvocationHandler {
      private Object target;
      public TraceHandler(Object t) {
         target = t;
      }
      public Object invoke(Object proxy, Method m, Object[] args) throws Throwable {
         // print implicit argument
         System.out.print(target);
         // print method name
         System.out.print("." + m.getName() + "(");
         // print explicit arguments
         if (args != null)
         {
            for (int i = 0; i < args.length; i++)
            {
               System.out.print(args[i]);
               if (i < args.length - 1) System.out.print(", ");
            }
         }
         System.out.println(")");
         // invoke actual method
         return m.invoke(target, args);
      }
   }
   ```

# Error Handling

## Debugging

1. general
   - use debugger
   - test with main method, or unit test tools

1. print or log
   - debug by print concatenated or formatted string
   - logging proxy — anonymous inner class overriding methods of interest with logger
   - stack trace — `Throwable::printStackTrace` and rethrow, or `Thread.dumpStack()`
     - capture string instead of printing to `System.err`
       ```java
       StringWriter out = new StringWriter();
       new Throwable().printStackTrace(new PrintWriter(out));
       String description = out.toString();
       ```
     - change handler for uncaught exceptions
       ```java
       Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
           @Override
           public void uncaughtException(Thread t, Throwable e) { /* logging... */ };
       });
       ```

1. CLI options related to debugging
   - `ctrl` + `\` — get thread dump when the program hangs??
   - `java`
     - use `-verbose` when launching JVM for diagnosing class path problems
     - use `Xprof` for profiling, note that support was removed in 10.0
     - `-XX:+HeapDumpOnOutOfMemoryError`
   - use `-Xlint:all` when `javac`
   - use `jconsole` to track memory consumption, thread usage, class loading
   - `jmap` and `jhat` (`jhat` removed in JDK 9) — `jmap` to get a heap dump and `jhat` to examine
     ```java
     jmap -dump:format=b,file=dumpFileName processID
     jhat dumpFileName
     ```
     - at `localhost:7000`
   - `jstat`
   - `jcmd`
   - `hprof`
   - `jps`
   - `jstack`
   - `syslog`

## Exceptions

1. unchecked exceptions and checked exceptions
   - unchecked — any exception that derives from the class `Error` or the class `RuntimeException` an unchecked exception
   - checked — All other exceptions are called checked exceptions, including `Exception`
   - why called checked — The compiler checks that you provide exception handlers for all checked exceptions

1. `Throwable` — the superclass of all errors and exceptions, other objects cannot be thrown
   ```java
   public class Throwable implements Serializable
   ```
   - constructors
     - `Throwable()`
     - `Throwable(String message)`
     - `Throwable(String message, Throwable cause)`
     - `protected Throwable(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace)`
     - `Throwable(Throwable cause)`
   - stack trace
     - `void printStackTrace()`  
       `void printStackTrace(PrintStream s)`  
       `void printStackTrace(PrintWriter s)`
     - `void setStackTrace(StackTraceElement[] stackTrace)`
     - `StackTraceElement[] getStackTrace()`
     - `Throwable fillInStackTrace()`
   - error message
     - `String getMessage()`
     - `String getLocalizedMessage()` — for overriding, defaults to `getMessage()`
     - `String toString()` — class name, and message if applicable
   - wrapping
     - `Throwable initCause(Throwable cause)`
     - `Throwable getCause()`
   - suppress
     - `void addSuppressed(Throwable exception)`
     - `Throwable[] getSuppressed()`
   - subclasses
     - `Error`
     - `Exception`

1. `Error` — internal errors and resource exhaustion situations, not expected to throw by user
   ```java
   public class Error extends Throwable
   ```

1. `Exception` and its hierarchy
   ```java
   public class Exception extends Throwable
   ```
   - `CloneNotSupportedException`
   - `InterruptedException`
   - `ReflectiveOperationException`
     - `ClassNotFoundException`
     - `IllegalAccessException`
     - `InstantiationException`
     - `NoSuchFieldException`
     - `NoSuchMethodException`
   - `RuntimeException`
     - `ArithmeticException`
     - `ArrayStoreException`
     - `ClassCastException`
     - `EnumConstantNotPresentException`
     - `IllegalArgumentException`
       - `IllegalThreadStateException`
       - `NumberFormatException`
     - `IllegalMonitorStateException`
     - `IllegalStateException`
     - `IndexOutOfBoundsException`
       - `ArrayIndexOutOfBoundsException`
       - `StringIndexOutOfBoundsException`
     - `NegativeArraySizeException`
     - `NullPointerException`
     - `SecurityException`
     - `TypeNotPresentException`
     - `UnsupportedOperationException`

1. `StackTraceElement`
   ```java
   public final class StackTraceElement extends Object
   implements Serializable
   ```
   - creation
     - `StackTraceElement(String declaringClass, String methodName, String fileName, int lineNumber)`
     - `Throwable::getStackTrace`
     - `Thread::getStackTrace`
     - `Thread.getAllStackTraces()`
   - stack info
     - `String getClassName()`
     - `String getFileName()`
     - `int getLineNumber()`
     - `String getMethodName()`

## Exception Handling

1. exception specification — declare checked exceptions
   ```java
   // modifiers return_type method_name(parameters) throws Exception1, Exception2
   // java.io.FileInputStream
   public FileInputStream(String name) throws FileNotFoundException
   ```
   - when to declare
     - nested method call — when calling a method that threatens to throw a checked exception
     - `throw` checked exceptions spontaneously — check exceptions can be thrown only when declared by the method
   - if not declared — compiling error if a method fails to faithfully declare all checked exceptions or handle them
   - if caught — no need for `throws`
   - when overriding a method
     - more specific exceptions or not at all — exception specification cannot be more general; OK to throw more specific exceptions, or not to throw any exceptions in the subclass method
     - none if none in superclass — if the superclass method throws no checked exception at all, neither can the subclass

1. `try catch`
   ```java
   try {
       // statements that might throw exceptions
   } catch (FileNotFoundException e) { // optionally final in parameter
       // emergency action for missing files
   } catch (UnknownHostException e) {
       // emergency action for unknown hosts
   } catch (IOException e) {
       // emergency action for all other I/O problems
   } finally {
       // close resources
   }
   ```
   - multiple exception types — only needed when catching exception types that are not subclasses of one another
     ```java
     catch (FileNotFoundException | UnknownHostException e) {
         // emergency action for missing files and unknown hosts
     }
     ```
     - implicit `final` — the exception variable is implicitly `final` when multiple exception types
   - rethrow — `throw` in `catch` block
     - exception wrapping — use `Throwable::initCause` to throw as another wrapped type and `Throwable::getCause` for original failure
     - bypass exception specification limit — rethrow a wrapped `RuntimeException` if a method cannot throw checked exception
       - for `IOException` — for example, `java.io.UncheckedIOException` is designed to wrap `IOException`
     - use generics to make checked exceptions unchecked, see [Generics](#Generics)
   - smart narrowing — when rethrow any exception
     ```java
     public void updateRecord() throws SQLException {
         try {
             // access the database
         } catch (Exception e) {
             logger.log(level, message, e);
             throw e;
         }
     }
     ```
     - example above — compiler now tracks the fact that `e` originates from the `try` block, it is valid to declare the enclosing method as throws `SQLException`
     - smart narrowing conditions
       - only checked exceptions — provided that the only checked exceptions in that block are `SQLException` instances
       - `final` `e` — and provided that `e` is not changed in the catch block

1. `finally` — always executed, can be used without `catch`
   - order — executes before the method return, if `return` used before `finally`
   - mask `return` and exceptions
     - `return` in `finally` will mask previous `return`
     - exceptions in `finally` will mask exceptions previously thrown
   - handle exceptions in `finally`
     - wrap a `try catch` block to handle possible exception thrown by `finally`
       ```java
       InputStream in = . . .;
       try {
           try {
               // code that might throw exceptions
           } finally {
               // in.close();
           }
       } catch (IOException e) {
           // show error message
       }
       ```
     - rethrow the original, suppress exception thrown by `finally`
       ```java
       InputStream in = . . .;
       Exception ex = null;
       try {
           try {
               // code that might throw exceptions
           } catch (Exception e) {
               ex = e;
               throw e;
           }
       } finally {
            try {
                in.close();
            } catch (Exception e) {
                if (ex == null) throw e;
                else ex.addSuppressed(e);
            }
       }
       ```

1. `try (resources)` — auto close when exiting the block
   ```java
   try (Resource res = . . .) {
       // work with res
   }
   ```
   - the resource needs to implement `AutoCloseable` which has a single method
     ```java
     public interface AutoCloseable {
         void close() throws Exception;
     }
     ```
   - multiple resources — use semicolon as delimiter
   - when both `try` block and `AutoCloseable::close` throw exception — any exceptions thrown by `close` methods are suppressed
   - can have `catch` and `finally` blocks, but not recommended

## Assertion

1. assert
   ```java
   assert condition;
   assert condition : expression;
   ```
   - `condition` — throw an `AssertionError` if the assertion fails
   - `expression` — passed to `AssertionError::new` to produce a message string, using `String::valueOf` when converting
   - enabling and disabling
     - disabled — disabled by default, `-da` or `-disableassertions` to explicitly disable certain classes
     - enable — by `-ea` or `-enableassertions`
       ```shell
       java -enableassertions MyApp
       java -ea:MyClass -ea:com.mycompany.mylib... MyApp # for specific classes
       ```
       - enabling mechanism — when enabled, no recompiling, but the class loader stops stripping out the assertion code
     - also for JVM loaded classes — some classes are not loaded by a class loader but directly by the virtual machine, but above switches still work
     - enable for system classes — `-enablesystemassertions` / `-esa` for system classes

1. assert use
   - fatal errors — assertion failures are intended to be fatal, unrecoverable errors
   - for development and testing — assertion checks are turned on only during development and testing
   - use for precondition — parameter checking
   - use for documenting assumptions
     ```java
     // use comments to document underlying assumptions
     if (i % 3 == 0) . . .
     else if (i % 3 == 1) . . .
     else // (i % 3 == 2)
     . . .
     ```
     ```java
     // use assertion instead
     if (i % 3 == 0) . . .
     else if (i % 3 == 1) . . .
     else {
         assert i % 3 == 2;
         . . .
     }
     ```
     ```java
     // even better assertion
     assert i >= 0;
     if (i % 3 == 0) . . .
     else if (i % 3 == 1) . . .
     else { . . . }
     ```

1. `AssertionError`
   ```java
   public class AssertionError extends Error
   ```

## Logging

see [Logging](./javaMisc.md#Logging).

# Generics

1. Generics
   - [further reading](http://angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)
   - diamond syntax
   - raw and typed
     - typed are subtypes — typed ones are subtypes of the raw one
     - warning when using raw types
     - raw at runtime — types only checked when compiling, all are raw without type at runtime
   - differently parallelized, different type — no relationship between `Generic<Type_2>` and `Generic<Type_2>`, regardless of the relationship between the type variables
   - at runtime in JVM
     - erased to bound — type variables are erased and replaced by first bound, or `Object`
     - cast when needed — compiler inserts casts to other bounds when necessary
       - place the predominant interface at the first one for performance
     - bridge methods are synthesized when necessary (when overriding)
       - override method can have a different signature — due to type erasure of generics or different return type
       - bridge method — the same signature of super type method, calls actual method

1. generic syntax
   - name conventions
     - `E` — for the element type of a collection
     - `K` and `V` — for key and value types of a table
     - `T` (and the neighboring `U` and `S`) — for “any type at all”
   - generic class syntax
     ```java
     public class Pair<T, U> { . . . }
     ```
   - generic methods inside ordinary classes
     ```java
     @SafeVarargs // to suppress Warning: Possible heap pollution from parameterized vararg type
     public static <T> T getMiddle(T... a) {
         return a[a.length / 2];
     }
     ```
     - call — type parameter before method name, `className.<type>method(params)`
       - avoid parsing ambiguities in C++ — `g(f<a,b>(c))`
     - type inference — type can be inferred from parameters, but can be problematic when multiple super types
   - generic bounds — `extends`, including
     ```java
     public static <T extends Comparable & Serializable> T min(T[] a)
     ```
     - class bound — must be the first one in the bounds list
     - interface bound and class bound — arbitrary number of interfaces, but at most one class
   - wildcards — `?`
     - `?` — for a variable of type `?`, can only assign when left value is `Object`, or right value is `null`
     - `? extends SomeType` — including; a variable of this type can only be right value
       ```java
       Pair<Manager> managerBuddies = new Pair<>(ceo, cfo);
       Pair<? extends Employee> wildcardBuddies = managerBuddies; // OK
       Employee e = wildcardBuddies.getFirst(); // function signature is `? extends Employee getFirst()`, OK
       wildcardBuddies.setFirst(lowlyEmployee); // function signature is `void setFirst(? extends Employee)`, compile-time error
       ```
     - `? super SomeType` — including; the contrary of `? extends SomeType` (left value can only be `Object`)
       - example — `<T extends Comparable<? super T>>`, a rescue when `T` does not implement `Comparable` but its super class does
     - wildcard capture — when the wildcard represents a single, definite type, it can be captured by type parameter
       ```java
       public static <T> void swapHelper(Pair<T> p) {
           T t = p.getFirst();
           p.setFirst(p.getSecond());
           p.setSecond(t);
       }
       public static void swap(Pair<?> p) { swapHelper(p); }
       ```

1. use generics to make checked exceptions unchecked
   ```java
   @SuppressWarnings("unchecked")
   public static <T extends Throwable> void throwAs(Throwable e) throws T {
       throw (T) e;
   }
   ```
   ```java
   try {
       // do work
   } catch (Throwable t) {
       // the compiler will believe that t becomes an unchecked exception
       Block.<RuntimeException>throwAs(t);
       // alternatively, see https://stackoverflow.com/questions/31316581/a-peculiar-feature-of-exception-type-inference-in-java-8
       // Block.throwAs(t);
   }
   ```

1. limits of generics
   - type parameters cannot be primitive types — not compatible with `Object` when type erased at runtime
   - not in static context — type variables not valid in static context (parameterized types are available)
     ```java
     public class Singleton<T> {
         private static T singleInstance; // Error
         public static T getSingleInstance() { // Error
             if (singleInstance == null) // ... construct new instance of T
             return singleInstance;
         }
     }
     ```
   - not when `throw` or `catch` — cannot throw or catch instances of a generic class
   - not when cast and `instanceof` — compile warning when cast (`(Pair<String>) a`), compile error when `instanceof` (`a instanceof Pair<T>`)
   - name clash
     - name clash with methods in `Object` — error by clash with `Object::equals` when defining `equals(T other)`
     - error when generic interfaces implemented more than once with different arguments — will be a conflict with the synthesized bridge methods
       ```java
       class Employee implements Comparable<Employee> { }
       class Manager extends Employee implements Comparable<Manager> { } // Error
       // bridge method for Comparable<X>
       public int compareTo(Object other) { return compareTo((X) other); }
       ```
   - heap pollution, cannot initialize arrays of parameterized types, but can be declared — error when `new Pair<String>[10]`
     ```java
     // legal but not safe workaround, possible heap pollution
     Pair<String>[] table = (Pair<String>[]) new Pair<?>[10];
     ```
     ```java
     // heap pollution
     Object[] objArray = table; // defined above
     objArray[0] = new Pair<Employee>();
     ```
   - cannot instantiate type variable — error when `new T()`
     - workaround — provide the constructor using lambda
       ```java
       Pair<String> p = Pair.makePair(String::new);
       public static <T> Pair<T> makePair(Supplier<T> constr) {
           return new Pair<>(constr.get(), constr.get());
       }
       ```
     - workaround — use reflection
       ```java
       Pair<String> p = Pair.makePair(String.class);
       public static <T> Pair<T> makePair(Class<T> cl) {
           try { return new Pair<>(cl.newInstance(), cl.newInstance()); }
           catch (Exception ex) { return null; }
       }
       ```
   - cannot construct generic array — error when `new T[n]`
     - parameterized vararg type (`T...`) — against the rule, but can use `@SafeVarargs` to suppress warning
     - workaround — use `Object[]`
       ```java
       public class ArrayList<E> {
           private Object[] elements;
           @SuppressWarnings("unchecked")
           public E get(int n) { return (E) elements[n]; }
           public void set(int n, E e) { elements[n] = e; } // no cast needed
       }
       ```
     - workaround — use cast from `Object[]`, type erasure makes the cast undetectable at runtime
       ```java
       public class ArrayList<E> {
           private E[] elements;
           public ArrayList() { elements = (E[]) new Object[10]; }
       }
       ```
       - not work when assigning to actual type — `ArrayList::toArray` either return `Object[]` or take a `T[]` parameter to return `T[]`
     - workaround — provide constructor or use reflection, see above

# Annotations

1. annotations
   - syntax — each annotation is preceded by an `@` symbol, used like a modifier and is placed before the annotated item without a semicolon
     - an item can have multiple annotations
     - one annotation can be used multiple times on one item if `@Repeatable`
   - annotation interfaces — define annotations, creates actual Java interfaces, implicitly extend `Annotation`
     ```java
     modifiers @interface AnnotationName {
       type elementName();
       type elementName() default value;
     }
     ```
     - cannot be extended or implemented explicitly
     - when being processed — tools that process annotations receive objects implementing annotation interfaces, and call methods to retrieve elements
     - `java.lang.annotation.Annotation` — The common interface extended by all annotation types. Note that an interface that manually extends this one does not define an annotation type.
       ```java
       public interface Annotation
       ```
       - `Class<? extends Annotation> annotationType()`
   - annotation places
     - declarations
     - type uses

1. annotation elements
   - elements of annotations — parameters when annotating, all element values must be compile-time constants, correspond to methods of annotation interfaces
     ```java
     @AnnotationName(elementName1=value1, elementName2=value2, ...)
     @AnnotationName
     @AnnotationName(valueForSingleElement)
     ```
     - marker annotation — annotations no elements need to be specified when annotating
     - single value annotation — only one element called `value`
   - annotation element types — non-null, usually `""` or `Void.class` as substitution
     - primitive types
     - `String`
     - `Class`
     - `Enum`
     - annotation types, error to introduce circular dependencies
       ```java
       Reference ref() default @Reference(); // an annotation type
       @BugReport(ref=@Reference(id="3352627"), ...) // when annotating
       ```
     - arrays of the preceding types (flat), enclosed in braces when annotating
       ```java
       @BugReport(..., reportedBy={"Harry", "Carl"})
       @BugReport(..., reportedBy="Joe") // OK, same as {"Joe"}
       ```

1. declaration annotations
   - annotation target — implementing classes of `AnnotatedElement`: `Class` (also interfaces), `Constructor`, `Executable`, `Field`, `Method`, `Package`, `Parameter`; sub-interface `TypeVariable` and local variables
     - package annotations — in `package-info.java`, can only be processed at the source level
       ```java
       /**
        * Package-level javadoc
        */
       @GPL(version="3")
       package com.a.b;
       import org.gnu.GPL;
       ```
     - parameter annotations — explicitly declare `this` if necessary
   - local variable annotations — can only be processed at the source level
   - an annotation can annotate itself

1. type use (`ElementType.TYPE_USE`) annotations — annotate types, as sub-interfaces of `AnnotatedElement`
   - type arguments — `List<@NonNull String>`, `List<@Localized ? extends Message>`, `List<? extends @Localized Message>`
   - arrays — `@NonNull String[][] words` (`words[i][j]` is not `null`), `String @NonNull [][] words` (`words` is not `null`), `String[] @NonNull [] words` (`words[i]` is not `null`)
   - when inheriting — `class Warning extends @Localized Message`
   - when `new` — `new @Localized String(...)`
   - casts and `instanceof` — `(@Localized String) text`, `if (text instanceof @Localized String)`
   - exception specifications — `public String read() throws @Localized IOException`
   - method references — `@Localized Message::getText`
   - cannot
     ```java
     @NonNull String.class // ERROR: Cannot annotate class literal
     import java.lang.@NonNull String; // ERROR: Cannot annotate import
     ```

## Standard Annotations

1. for compilation
   - `@Deprecated`
     ```java
     @Documented
      @Retention(value=RUNTIME)
      @Target(value={CONSTRUCTOR,FIELD,LOCAL_VARIABLE,METHOD,PACKAGE,PARAMETER,TYPE})
     public @interface Deprecated
     ```
   - `@SuppressWarnings`
     ```java
     @Target(value={TYPE,FIELD,METHOD,PARAMETER,CONSTRUCTOR,LOCAL_VARIABLE})
      @Retention(value=SOURCE)
     public @interface SuppressWarnings
     ```
     - `@SuppressWarnings("fallthrough")`
   - `@Override` — error when not overriding but define a new method
     ```java
     @Target(value=METHOD)
      @Retention(value=SOURCE)
     public @interface Override
     ```
   - `@javax.annotation.Generated` — mark source code that has been generated. It can also be used to differentiate user written code from generated code in a single file (in `javax.annotation.processing` for post JDK 8)
     ```java
     @Documented
      @Retention(value=SOURCE)
      @Target(value={PACKAGE,TYPE,ANNOTATION_TYPE,METHOD,CONSTRUCTOR,FIELD,LOCAL_VARIABLE,PARAMETER})
     public @interface Generated
     ```
   - `@FunctionalInterface` — error if conditions of functional interfaces not meet
     ```java
     @Documented
      @Retention(value=RUNTIME)
      @Target(value=TYPE)
     public @interface FunctionalInterface
     ```
   - `@SafeVarargs` — assertion that the body of the annotated method or constructor does not perform potentially unsafe operations on its varargs parameter
     ```java
     @Documented
      @Retention(value=RUNTIME)
      @Target(value={CONSTRUCTOR,METHOD})
     public @interface SafeVarargs
     ```

1. meta
   ```java
   @Documented
    @Retention(value=RUNTIME)
    @Target(value=ANNOTATION_TYPE)
   ```
   - `@java.lang.annotation.Target` — the contexts in which an annotation type is applicable, any declaration except a type parameter declaration if absent
     - `ElementType[] value`
     - `enum java.lang.annotation.ElementType` — `ANNOTATION_TYPE`, `CONSTRUCTOR`, `FIELD`, `LOCAL_VARIABLE`, `METHOD`, `PACKAGE`, `PARAMETER`, `TYPE`, `TYPE_PARAMETER`, `TYPE_USE`
       - `TYPE` -- class, interface (including annotation type), or enum declaration
   - `@java.lang.annotation.Retention` — how long annotations with the annotated type are to be retained, defaults to `RetentionPolicy.CLASS` if absent
     - `RetentionPolicy value`
     - `enum java.lang.annotation.RetentionPolicy`
       - `CLASS` — in class files but not the VM
       - `RUNTIME`
       - `SOURCE`
   - `@java.lang.annotation.Documented` — indicates that annotations with a type are to be documented by javadoc and similar tools by default
   - `@java.lang.annotation.Inherited` — indicates that an annotation type is automatically inherited, has no effect if the annotated type is used to annotate anything other than a class
   - `@java.lang.annotation.Repeatable` — indicates the annotation type is repeatable, with the containing annotation type to hold repeated annotations
     ```java
     @Repeatable(TestCases.class)
     @interface TestCase {
         String params();
         String expected();
     }
     @interface TestCases { TestCase[] value(); }
     ```
     - `Class<? extends Annotation> value` — a container annotation that holds the repeated annotations in an array

1. for java EE resource managing (deprecated from JDK 9 and removed from JDK 11, available in Maven)
   - `@javax.annotation.PostConstruct` — used on a method that needs to be executed after dependency injection is done
     ```java
     @Documented
      @Retention(value=RUNTIME)
      @Target(value=METHOD)
     public @interface PostConstruct
     ```
     - Only one method can be annotated with this annotation
     - annotated method signature — see javadoc
   - `@javax.annotation.PreDestroy` — used on methods as a callback notification to signal that the instance is in the process of being removed by the container
     ```java
     @Documented
      @Retention(value=RUNTIME)
      @Target(value=METHOD)
     public @interface PreDestroy
     ```
     - annotated method requirements — see javadoc
   - `@javax.annotation.Resource` — marks a resource that is needed by the application
     ```java
     @Target(value={TYPE,FIELD,METHOD})
      @Retention(value=RUNTIME)
     public @interface Resource
     ```
     - example
       ```java
       @Resource(name="jdbc/mydb") private DataSource source;
       ```
   - `@javax.annotation.Resources` — multiple resources

## Source-Level Annotation Processing

1. CLI
   ```
   javac -processor <class1>[,<class2>,<class3>...] sourceFiles
   ```
   - also other alternatives
   - produce new source files until no more — Each annotation processor is executed in turn and given the annotations in which it expressed an interest. If an annotation processor creates a new source file, the process is repeated. Once a processing round yields no further source files, all source files are compiled.
     - `-XprintRounds` — show rounds
     - cannot modify source files — use with agents or bytecode engineering tools

1. `javax.annotation.processing`
   ```java
   @SupportedAnnotationTypes("com.example.annotations.ToString")
   @SupportedSourceVersion(SourceVersion.RELEASE_8)
   public class ToStringAnnotationProcessor extends AbstractProcessor {
       public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment currentRound) { }
   }
   ```
   - `javax.annotation.processing.AbstractProcessor` — for processors to extend
     ```java
     public abstract class AbstractProcessor extends Object
     implements Processor
     ```
   - `interface` `javax.annotation.processing.RoundEnvironment`
   - `@javax.annotation.processing.SupportedAnnotationTypes`
   - `@javax.annotation.processing.SupportedOptions`
   - `@javax.annotation.processing.SupportedSourceVersion`

1. language model (AST) — `javax.lang.model`
   - `javax.lang.model.element.Element` — AST nodes
