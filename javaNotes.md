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
   - enable and disable assertion — see [Assertion](#Assertion)
   - system properties — `-D`, `System::getProperty`, `System::getProperties`
     - log related — see [Logging](#Logging)
       - log configuration file location — `-Djava.util.logging.config.file=configFile`
     - see [`Properties`](#Legacy%20Collections) for list of system properties
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
   - see [Collections](#Collections)

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
   - system property — see [Legacy Collections](#Legacy-Collections) for the list of system properties
     - `static Properties getProperties()`
     - `static String getProperty(String key)`  
       `static String getProperty(String key, String def)`
     - `Integer::getInteger`, `Long::getLong`
     - `static void setProperties(Properties props)`  
       `static String setProperty(String key, String value)`
     - `static String clearProperty(String key)`
     - `static String lineSeparator()` — equivalent to `System.getProperty("line.separator")`
       - see [`File`](#File-Classes) for other separators
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

# Utils

## Arrays

1. `java.util.Arrays`
   - conversion
     - `static String toString(type[] a)`
     - `static String deepToString(Object[] a)`
     - `static <T> List<T> asList(T... a)` — `return new ArrayList<>(a);`
       - `ArrayList` here is `Arrays$ArrayList` which implements `List`, a view on the original array with fixed size
       - if real `ArrayList` is desired — use this `Arrays$ArrayList` to construct
     - stream methods
   - `static int binarySearch(type[] a, type v)`  
     `static int binarySearch(type[] a, int start, int end, type v)`
     - `Object[]` actually needs to be `Comparable[]`
   - copy
     - `static type[] copyOf(type[] original, int newLength)` — uses `System::arraycopy` behind the scenes
     - `static type[] copyOfRange(type[] a, int start, int end)`
     - `System::arraycopy`
     - `T[]::clone`
   - initialization and modifications
     - `static void fill(type[] a, type v)`
     - `static void setAll(double[] array, IntToDoubleFunction generator)` — generator takes indices as parameter  
       `static void setAll(int[] array, IntUnaryOperator generator)`  
       `static void setAll(long[] array, IntToLongFunction generator)`  
       `static <T> void setAll(T[] array, IntFunction<? extends T> generator)`
     - `parallelSetAll` — parallel version of `setAll`
     - `parallelPrefix` — prefix operators, like prefix sum
   - `Object` methods
     - `static boolean equals(type[] a, type[] b)`
     - `static int hashCode(Object[] a)`
     - `static boolean deepEquals(Object[] a1, Object[] a2)`
     - `static int deepHashCode(Object[] a)`
     - `static String deepToString(Object[] a)`
     - `compare` — since JDK 9
   - sort
     - `static void sort(type[] a)`  
       `static void sort(type[] a, int fromIndex, int toIndex)`  
       `static <T> void sort(T[] a, Comparator<? super T> c)`  
       `static <T> void sort(T[] a, int fromIndex, int toIndex, Comparator<? super T> c)`
       - `Object[]` actually needs to be `Comparable[]`
       - `java.util.DualPivotQuickSort::sort` for primitive type arrays
       - `java.util.TimSort::sort` for `T[]`
     - `static void parallelSort(type[] a)`  
       `static void parallelSort(type[] a, int fromIndex, int toIndex)` (no `Object[]`)  
       `static <T extends Comparable<? super T>> void parallelSort(T[] a, int fromIndex, int toIndex)`  
       `static <T> void parallelSort(T[] a, Comparator<? super T> cmp)`  
       `static <T> void parallelSort(T[] a, int fromIndex, int toIndex, Comparator<? super T> cmp)`
       - granularity — `private static final int MIN_ARRAY_SORT_GRAN = 1 << 13;`
       - sequential sort (as `Arrays::sort`) when
         ```java
         if (n <= MIN_ARRAY_SORT_GRAN || (p = ForkJoinPool.getCommonPoolParallelism()) == 1)
         ```
       - else parallel sort — uses threading (each thread gets a chunk of the list and sorts it in parallel. Later these sorted chunks are merged into a result)
       - `java.util.DualPivotQuickSort::sort` for primitive type arrays
       - `java.util.TimSort::sort` for `T[]`

## Event Handling

1. `java.util.EventListener` — A tagging interface that all event listener interfaces must extend

1. `java.util.EventListenerProxy` — An abstract wrapper class for an EventListener class which associates a set of additional parameters with the listener
   ```java
   public abstract class EventListenerProxy<T extends EventListener> extends Object
   implements EventListener
   ```

1. `java.util.EventObject` — The root class from which all event state objects shall be derived
   ```java
   public class EventObject extends Object
   implements Serializable
   ```

1. MVC
   - `java.util.Observable`
   - `interface java.util.Observer`

## Collections and Maps

1. concurrent collections — see [Thread-Safe Collections](#Thread-Safe-Collections), and [`SynchronousQueue`](#Data-Exchange)

1. `Iterable`
   ```java
   public interface Iterable<T>
   ```
   - `default void forEach(Consumer<? super T> action)`
   - `Iterator<T> iterator()`
   - `default Spliterator<T> spliterator()`
   - foreach loop — needs to implement `Iterable`
     - behind the scenes — a loop with an iterator

1. `java.util.Iterator<E>`
   ```java
   public interface Iterator<E>
   ```
   - fail fast — multiple readers, or a single reader and writer, otherwise `ConcurrentModificationException`
     - detection scheme — the count of modifications is keep in both the collection and the iterator
     - exception — `LinkedList::set` is not counted
   - `E next()` — possibly `NoSuchElementException`
   - `boolean hasNext()`
   - `void remove()` — remove the element last returned by `next()`
   - `default void forEachRemaining(Consumer<? super E> action)`
   - `Collections::emptyIterator`

1. `java.util.Spliterator` — both sequential and parallel data processing, the parallel analogue of an `Iterator`
   - fail fast
   - late-binding — binds to the source of elements at the point of first traversal, first split, or first query for estimated size, rather than at the time the `Spliterator` is created

1. `java.util.Collection`
   ```java
   public interface Collection<E>
   extends Iterable<E>
   ```
   - add
     - `boolean add(E e)` — `true` when success
     - `boolean addAll(Collection<? extends E> c)`
   - test
     - `boolean equals(Object o)`
     - `boolean contains(Object o)`
     - `boolean containsAll(Collection<?> c)`
     - `boolean isEmpty()`
   - modify
     - `void clear()`
     - `boolean removeIf(Predicate<? super E> filter)`
     - `boolean removeAll(Collection<?> c)`
     - `boolean remove(Object o)`
     - `boolean retainAll(Collection<?> c)`
   - conversion
     - `<T> T[] toArray(T[] a)` — no new array created if `a` is of the correct size
     - `default Stream<E> stream()`
     - `default Stream<E> parallelStream()`
   - get collection information
     - `int size()`
     - `Iterator<E> iterator()`
     - `default Spliterator<E> spliterator()`
   - `java.util.AbstractCollection` — a skeletal implementation of the `Collection` interface, to minimize the effort required to implement this interface
      ```java
      public abstract class AbstractCollection<E> extends Object
      implements Collection<E>
      ```
      - should have been replaced by default methods, but only new methods have default implementation
      - extends the abstract class and simultaneously implement the interface — only make a difference to clarity and reflection

1. `java.util.Collections` — static helper
   - `static <T> boolean addAll(Collection<? super T> c, T... elements)`
   - `static boolean disjoint(Collection<?> c1, Collection<?> c2)` — `true` if the two specified collections have no elements in common
   - `static int frequency(Collection<?> c, Object o)`
   - `static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)`  
     `static <T> T max(Collection<? extends T> coll, Comparator<? super T> comp)`  
     `static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll)`  
     `static <T> T min(Collection<? extends T> coll, Comparator<? super T> comp)`
   - `static <T> Comparator<T> reverseOrder()`  
     `static <T> Comparator<T> reverseOrder(Comparator<T> cmp)`
     - called by `Comparator::reverseOrder` and `Comparator::reversed`
   - list related — see [List](#List)
   - views and wrappers — see [Views and Wrappers](#Views-and-Wrappers)
     - `Collections::unmodifiableCollection`
     - `Collections::synchronizedCollection`
     - `Collections::checkedCollection`

### List

1. `interface java.util.RandomAccess` — marker interface used by `List` implementations to indicate that they support fast (generally constant time) random access

1. `java.util.List`
   ```java
   public interface List<E>
   extends Collection<E>
   ```
   - `java.util.AbstractList<E>` — This class provides a skeletal implementation of the `List` interface to minimize the effort required to implement this interface backed by a "random access" data store (such as an array)
     ```java
     public abstract class AbstractList<E>
     extends AbstractCollection<E>
     implements List<E>
     ```
   - add — with indexed version
     - `void add(int index, E element)`
     - `boolean addAll(int index, Collection<? extends E> c)`
   - element
     - `E get(int index)`
     - `int indexOf()`
     - `int lastIndexOf(Object o)`
   - list information
     - `ListIterator<E> listIterator()`
     - `ListIterator<E> listIterator(int index)`
     - `default Spliterator<E> spliterator()`
     - `List<E> subList(int fromIndex, int toIndex)` — a view
   - modify and converse
     - `E set(int index, E element)`
     - `E remove(int index)`
     - `default void sort(Comparator<? super E> c)` — uses `Arrays::sort` after `toArray()`

1. `java.util.ListIterator` — has `previous` in addition to `next`
   ```java
   public interface ListIterator<E> extends Iterator<E>
   ```
   - `void add(E e)`
   - `boolean hasPrevious()`
   - `int nextIndex()`
   - `E previous()`
   - `int previousIndex()`
   - `void set(E e)`
   - `Collections::emptyListIterator`

1. `List` related methods in `Collections`
   - find
     - `static <T> int binarySearch(List<? extends Comparable<? super T>> list, T key)` — return `(-(insertion point) - 1)` if no matching  
       `static <T> int binarySearch(List<? extends T> list, T key, Comparator<? super T> c)`
       - whether `indexedBinarySearch` or `iteratorBinarySearch` — checks `RandomAccess` or `BINARYSEARCH_THRESHOLD` to determine
     - `static int indexOfSubList(List<?> source, List<?> target)`
     - `static int lastIndexOfSubList(List<?> source, List<?> target)`
   - modify
     - `static <T> void copy(List<? super T> dest, List<? extends T> src)`
     - `static <T> void fill(List<? super T> list, T obj)`
     - `static <T> boolean replaceAll(List<T> list, T oldVal, T newVal)`
     - `static void reverse(List<?> list)`
     - `static void rotate(List<?> list, int distance)`
     - `static void shuffle(List<?> list)` — checks whether `RandomAccess` otherwise `toArray()`  
       `static void shuffle(List<?> list, Random rnd)`
     - `static <T extends Comparable<? super T>> void sort(List<T> list)`
     - `static <T> void sort(List<T> list, Comparator<? super T> c)` — uses `List::sort`
     - `static void swap(List<?> list, int i, int j)`
   - views
     - `Arrays::asList`
     - `nCopies`
     - `singletonList`
     - `emptyList`
     - `unmodifiableList`
     - `synchronizedList`
     - `checkedList`
     - `List::subList`

1. `java.util.ArrayList`
   ```java
   public class ArrayList<E>
   extends AbstractList<E>
   implements List<E>, RandomAccess, Cloneable, Serializable
   ```
   - `private static final int DEFAULT_CAPACITY = 10`
   - constructors
     - `ArrayList()` — constructs an empty list with an initial capacity of 10
     - `ArrayList(Collection<? extends E> c)`
     - `ArrayList(int initialCapacity)`
     - anonymous `ArrayList` — double brace initialization, actually a inner subclass
       ```java
       new ArrayList<String>() {{ add("Harry"); add("Tony"); }};
       ```
     - `int[]` to `ArrayList<Integer>` without loop — for large arrays with sparse access patterns
       ```java
       public List<Integer> asList(final int[] is) {
           return Collections.unmodifiableList(new AbstractList<Integer>() {
               public Integer get(int i) { return is[i]; }
               public int size() { return is.length; }
           });
       }
       ```
   - capacity
     - `void ensureCapacity(int minCapacity)`
       ```java
       int newCapacity = oldCapacity + (oldCapacity >> 1);
       ```
     - `void trimToSize()`

1. `java.util.LinkedList`
   ```java
   public class LinkedList<E>
   extends AbstractSequentialList<E>
   implements List<E>, Deque<E>, Cloneable, Serializable
   ```
   - use with `ListIterator`
   - `LinkedList` vs `ArrayDeque` — see `ArrayDeque` below

### Queue

1. `java.util.Queue`
   ```java
   public interface Queue<E> extends Collection<E>
   ```
   - `IllegalStateException` or `NoSuchElementException` when failure
     - `boolean add(E e)` — returning `true` upon success and throwing an `IllegalStateException` if no space is currently available
     - `E remove()`
     - `E element()` — peek the head
   - return `null` when failure
     - `boolean offer(E e)`
     - `E poll()`
     - `E peek()`
   - `java.util.AbstractQueue` — skeletal implementations of some `Queue` operations
     ```java
     public abstract class AbstractQueue<E> extends AbstractCollection<E>
     implements Queue<E>
     ```

1. `java.util.Deque`
   ```java
   public interface Deque<E> extends Queue<E>
   ```
   |         | First Element (Head)                 |                         | Last Element (Tail)    |                            |
   | ------- | ------------------------------------ | ----------------------- | ---------------------- | -------------------------- |
   |         | Throws exception                     | return special value    | Throws exception       | return special value       |
   | Insert  | `addFirst(e)`, `push(e)`             | `offerFirst(e)`         | `addLast(e)`, `add(e)` | `offerLast(e)`, `offer(e)` |
   | Remove  | `removeFirst()`, `remove()`, `pop()` | `pollFirst()`, `poll()` | `removeLast()`         | `pollLast()`               |
   | Examine | `getFirst()`, `element()`            | `peekFirst()`, `peek()` | `getLast()`            | `peekLast()`               |
   - usage — double ended queue, also should be used in preference to the legacy `Stack` class

1. `LinkedList`

1. `java.util.ArrayDeque`
   ```java
   public class ArrayDeque<E> extends AbstractCollection<E>
   implements Deque<E>, Cloneable, Serializable
   ```
   - underlying implementation — circular array, no `null` elements
   - not implementing `List` and extends `AbstractCollection` but not `AbstractQueue` — [retrofit `ArrayDeque` to implement `List`](https://bugs.openjdk.java.net/browse/JDK-8143850)
   - no `null` support — `NullPointerException` for `null` elements
   - capacity
     - default initial capacity — 16
     - capacity grow policy — double capacity if small; else grow by 50%
       ```java
       int jump = (oldCapacity < 64) ? (oldCapacity + 2) : (oldCapacity >> 1);
       ```
   - `ArrayDeque` vs `LinkedList` — `LinkedList`s iterate with more CPU cache miss, have the overhead of node allocations, and consume more memory, but supports `List`, `null` elements, and better remove-while-iterate

1. `java.util.PriorityQueue`
   ```java
   public class PriorityQueue<E> extends AbstractQueue<E>
   implements Serializable
   ```
   - `private static final int DEFAULT_INITIAL_CAPACITY = 11`
   - capacity grow policy — as `ArrayDeque`

1. views
   - as stack — `Collections::asLifoQueue`

### Set

1. `java.util.Set`
   ```java
   public interface Set<E> extends Collection<E>
   ```
   - `java.util.AbstractSet<E>`

1. `java.util.NavigableSet` — adds methods for locating and backward traversal
   ```java
   public interface NavigableSet<E> extends SortedSet<E>
   ```
   - locating
     - `E lower(E e)`
     - `E pollFirst()`
     - `E pollLast()`
     - `E higher(E e)`
     - `E ceiling(E e)`
     - `E floor(E e)`
   - backward traversal
     - `Iterator<E> descendingIterator()`
     - `NavigableSet<E> descendingSet()`
   - `java.util.SortedSet`
     ```java
     public interface SortedSet<E> extends Set<E>
     ```
     - `Comparator<? super E> comparator()`
     - `E first()`
     - `E last()`
     - `default Spliterator<E> spliterator()`
     - `SortedSet<E> headSet(E toElement)`
     - `SortedSet<E> subSet(E fromElement, E toElement)`
     - `SortedSet<E> tailSet(E fromElement)`

1. `java.util.HashSet`
   ```java
   public class HashSet<E> extends AbstractSet<E>
   implements Set<E>, Cloneable, Serializable
   ```
   - underlying data structure — `private transient HashMap<E,Object> map`
   - dummy value for the value of `Map.Entry` — `private static final Object PRESENT = new Object()`
   - iteration performance — proportional to capability

1. `java.util.TreeSet` — red-black tree
   ```java
   public class TreeSet<E> extends AbstractSet<E>
   implements NavigableSet<E>, Cloneable, Serializable
   ```
   - underlying data structure — `private transient NavigableMap<E,Object> m`, initialized with `TreeMap`
   - dummy value — see `HashSet`

1. `java.util.EnumSet` — for use with enum types
   ```java
   public abstract class EnumSet<E extends Enum<E>>
   extends AbstractSet<E>
   implements Cloneable, Serializable
   ```
   - underlying data — represented internally as bit vectors
   - no `null` support — `NullPointerException` for `null` elements
   - usage — a high-quality, typesafe alternative to traditional int-based "bit flags"
   - underlying implementation — `RegularEnumSet` with a `long`, `JumboEnumSet` with a `long[]`, non-public in `java.util`
   - helper class — the abstract class itself acts as a static helper

1. `java.util.LinkedHashSet` — ordered `HashSet` with underlying linked list, have no control over `removeEldestEntry`
   ```java
   public class LinkedHashSet<E> extends HashSet<E>
   implements Set<E>, Cloneable, Serializable
   ```

1. views
   - `Map::keySet` etc.
   - set from map — `Collections::newSetFromMap` (for maps without corresponding sets, like `WeakHashMap` but not `HashMap`)
   - `Collections::singleton`
   - empty views — `Collections::emptySet`, `Collections::emptyNavigableSet`, `Collections::emptySortedSet`
   - unmodifiable views — `Collections::unmodifiableSet`, `Collections::unmodifiableNavigableSet`, `Collections::unmodifiableSortedSet`
   - synchronized views
   - checked views
   - subset methods

1. `BitSet` — see [Legacy Collections](#Legacy-Collections)

### Maps

1. `java.util.Map`
   ```java
   public interface Map<K,V>
   ```
   - modify
     - `void clear()`
     - return old value if not `void`
       - `V remove(Object key)` — returns the previous value or `null`
       - `default boolean remove(Object key, Object value)` — remove if `get(key)` equals `value`
       - `V put(K key, V value)` — returns as `remove` method
       - `default V putIfAbsent(K key, V value)` — `null` value is also absent
       - `void putAll(Map<? extends K,? extends V> m)`
       - `default V replace(K key, V value)`
       - `default boolean replace(K key, V oldValue, V newValue)`
       - `default void replaceAll(BiFunction<? super K,? super V,? extends V> function)`
     - return new value if not `void`
       - `default V compute(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`
       - `default V computeIfAbsent(K key, Function<? super K,? extends V> mappingFunction)` — `null` value is also absent
       - `default V computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`
       - `default V merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFunction)`
         ```java
         V newValue = (oldValue == null) ? value : remappingFunction.apply(oldValue, value);
         ```
         ```java
         // example
         counts.put(word, counts.getOrDefault(word, 0) + 1);
         counts.merge(word, 1, Integer::sum);
         ```
   - test
     - `boolean isEmpty()`
     - `boolean containsKey(Object key)`
     - `boolean containsValue(Object value)`
     - `boolean equals(Object o)`
   - loop or views
     - `default void forEach(BiConsumer<? super K,? super V> action)`
     - `Set<Map.Entry<K,V>> entrySet()`
     - `Set<K> keySet()`
     - `Collection<V> values()`
   - get
     - `V get(Object key)` — `null` if absent, can be confused with `null` values
     - `default V getOrDefault(Object key, V defaultValue)`
   - `int size()`
   - `interface Entry<K, V>` — key-value pair
   - `java.util.AbstractMap<K,V>` — This class provides a skeletal implementation of the `Map` interface, to minimize the effort required to implement this interface
     ```java
     public abstract class AbstractMap<K,V> extends Object
     implements Map<K,V>
     ```
     - should have been replaced by default methods, but only new methods have default implementation
     - extends the abstract class and simultaneously implement the interface — only make a difference to clarity and reflection
     - `AbstractMap.SimpleEntry`, `AbstractMap.SimpleImmutableEntry`
       ```java
       public static class AbstractMap.SimpleEntry<K,V> extends Object
       implements Map.Entry<K,V>, Serializable
       ```

1. `java.util.NavigableMap` — refer to `NavigableSet`
   ```java
   public interface NavigableMap<K,V> extends SortedMap<K,V>
   ```

1. `java.util.HashMap`
   ```java
   public class HashMap<K,V> extends AbstractMap<K,V>
   implements Map<K,V>, Cloneable, Serializable
   ```
   - schema — hash code modulo the number of buckets, or red-black tree if a hash collision
   - constants
     - `static final int DEFAULT_INITIAL_CAPACITY = 1 << 4` — initial capacity will be converted to the power of 2
     - `static final int MAXIMUM_CAPACITY = 1 << 30`
     - `static final float DEFAULT_LOAD_FACTOR = 0.75f`
     - `static final int TREEIFY_THRESHOLD = 8`
     - `static final int UNTREEIFY_THRESHOLD = 6`
     - `static final int MIN_TREEIFY_CAPACITY = 64` — smallest capability to permit treeify
   - `static class Node<K,V> implements Map.Entry<K,V>` — permits `null` values and keys
   - iteration performance — proportional to capability

1. `java.util.TreeMap` — red-black tree
   ```java
   public class TreeMap<K,V> extends AbstractMap<K,V>
   implements NavigableMap<K,V>, Cloneable, Serializable
   ```
   - do not support the `Entry::setValue` method — `Map.Entry` returned by methods in this class and its views represent snapshots of mappings at the time they were produced

1. `java.util.EnumMap` — for use with enum types
   ```java
   public class EnumMap<K extends Enum<K>,V>
   extends AbstractMap<K,V>
   implements Serializable, Cloneable
   ```
   - underlying data — represented internally as arrays, ordinals as indices
   - weakly consistent iterators — never throw `ConcurrentModificationException`, may or may not show the effects of any modifications to the map that occur while the iteration is in progress
   - `null` support — no `null` keys but values

1. `java.util.LinkedHashMap` — ordered `HashMap` with underlying doubly-linked list
   ```java
   public class LinkedHashMap<K,V> extends HashMap<K,V>
   implements Map<K,V>
   ```
   - `LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)`
     - `final boolean accessOrder` — `true` for access order, `false` for insertion order (default)
   - insertion order — the order is not affected if a key is re-inserted, even the value changes
   - access order — get methods and modify methods make corresponding entries place at the last position: `put`, `putIfAbsent`, `get`, `getOrDefault`, `compute`, `computeIfAbsent`, `computeIfPresent`, or `merge`
     - `Map::replace` — results an access only when the value is replaced
     - operations on views — no effect on order
   - `protected boolean removeEldestEntry(Map.Entry<K,V> eldest)` — invoked by `put` and `putAll` after inserting a new entry into the map, returns `true` if this map should remove its eldest entry

1. `java.util.WeakHashMap`
   ```java
   public class WeakHashMap<K,V> extends AbstractMap<K,V>
   implements Map<K,V>
   ```
   - underlying implementation — `Entry` extends `WeakReference` and registered to a `ReferenceQueue` upon construction
   - not count for gc — the presence of a mapping for a given key will not prevent the key from being discarded by the garbage collector
     - `private final ReferenceQueue<Object> queue` -- `WeakReference` keys are registered with a `queue` when created; when the referent of `WeakReference` is reclaimed by GC, `WeakReference::enqueue` is called at the same time or at some later time
     - `expungeStaleEntries()` -- private method that scan `WeakReference` keys in `queue` and set corresponding values to `null`; called every time in access methods, `size()`, and internal resize method
   - `null` support — both keys and values
   - values with strong reference to the keys — prevent keys from gc, can be alleviated by wrapping values with `new WeakReference(value)`

1. `java.util.IdentityHashMap` — `HashMap` with keys (and values) that are compared by `==`, not `equals`
   ```java
   public class IdentityHashMap<K,V> extends AbstractMap<K,V>
   implements Map<K,V>, Serializable, Cloneable
   ```
   - constant-time performance for the basic operations (`get` and `put`) — assuming the system identity hash function (`System.identityHashCode(Object)`) disperses elements properly among the buckets
   - rehashing may be fairly expensive — initialize with large expected capacity

1. views
   - `Collections::singletonMap`
   - empty views — `Collections::emptyMap`, `Collections::emptyNavigableMap`, `Collections::emptySortedMap`
   - unmodifiable views — `Collections::unmodifiableMap`, `Collections::unmodifiableNavigableMap`, `Collections::unmodifiableSortedMap`
   - synchronized views
   - checked views
   - sub map methods

### Views and Wrappers

1. `Map::keySet` etc.

1. `Arrays::asList`

1. `Collections`
   - one for n wrapper — `static <T> List<T> nCopies(int n, T o)`
     - returns an immutable list consisting of n copies of the specified object, `o` is stored only once
   - stack view — `static <T> Queue<T> asLifoQueue(Deque<T> deque)`
   - set view from map, see [Set](#Set) — `static <E> Set<E> newSetFromMap(Map<E,Boolean> map)`
   - wrappers containing only one element — immutable, instance of inner class in `Collections`, containing only one element
     - `static <T> Set<T> singleton(T o)`
     - `static <T> List<T> singletonList(T o)`
     - `static <K,V> Map<K,V> singletonMap(K key, V value)`
   - empty wrapper — immutable, instance of inner class in `Collections`, singleton
     - `static <T> Iterator<T> emptyIterator()`
     - `static <T> List<T> emptyList()`
     - `static <T> ListIterator<T> emptyListIterator()`
     - `static <K,V> Map<K,V> emptyMap()`
     - `static <K,V> NavigableMap<K,V> emptyNavigableMap()`
     - `static <E> NavigableSet<E> emptyNavigableSet()`
     - `static <T> Set<T> emptySet()`
     - `static <K,V> SortedMap<K,V> emptySortedMap()`
     - `static <E> SortedSet<E> emptySortedSet()`
   - unmodifiable view — `UnsupportedOperationException` when try modifying, instance of inner class in `Collections`
     - `static <T> Collection<T> unmodifiableCollection(Collection<? extends T> c)`
     - `static <T> List<T> unmodifiableList(List<? extends T> list)`
     - `static <K,V> Map<K,V> unmodifiableMap(Map<? extends K,? extends V> m)`
     - `static <K,V> NavigableMap<K,V> unmodifiableNavigableMap(NavigableMap<K,? extends V> m)`
     - `static <T> NavigableSet<T> unmodifiableNavigableSet(NavigableSet<T> s)`
     - `static <T> Set<T> unmodifiableSet(Set<? extends T> s)`
     - `static <K,V> SortedMap<K,V> unmodifiableSortedMap(SortedMap<K,? extends V> m)`
     - `static <T> SortedSet<T> unmodifiableSortedSet(SortedSet<T> s)`
   - synchronized view — synchronized with mutex, instance of inner class in `Collections`
     - `static <T> Collection<T> synchronizedCollection(Collection<T> c)`
     - `static <T> List<T> synchronizedList(List<T> list)`
     - `static <K,V> Map<K,V> synchronizedMap(Map<K,V> m)`
     - `static <K,V> NavigableMap<K,V> synchronizedNavigableMap(NavigableMap<K,V> m)`
     - `static <T> NavigableSet<T> synchronizedNavigableSet(NavigableSet<T> s)`
     - `static <T> Set<T> synchronizedSet(Set<T> s)`
     - `static <K,V> SortedMap<K,V> synchronizedSortedMap(SortedMap<K,V> m)`
     - `static <T> SortedSet<T> synchronizedSortedSet(SortedSet<T> s)`
   - checked view — throw `ClassCastException` immediately when heap pollution (detects with `Class::isInstance`), instance of inner class in `Collections`, intended as debugging support
     ```java
     ArrayList<String> strings = new ArrayList<>();
     ArrayList rawList = strings; // warning only, not an error, for compatibility with legacy code
     rawList.add(new Date()); // now strings contains a Date object!
     ```
     - `static <E> Collection<E> checkedCollection(Collection<E> c, Class<E> type)`
     - `static <E> List<E> checkedList(List<E> list, Class<E> type)`
     - `static <K,V> Map<K,V> checkedMap(Map<K,V> m, Class<K> keyType, Class<V> valueType)`
     - `static <K,V> NavigableMap<K,V> checkedNavigableMap(NavigableMap<K,V> m, Class<K> keyType, Class<V> valueType)`
     - `static <E> NavigableSet<E> checkedNavigableSet(NavigableSet<E> s, Class<E> type)`
     - `static <E> Queue<E> checkedQueue(Queue<E> queue, Class<E> type)`
     - `static <E> Set<E> checkedSet(Set<E> s, Class<E> type)`
     - `static <K,V> SortedMap<K,V> checkedSortedMap(SortedMap<K,V> m, Class<K> keyType, Class<V> valueType)`
     - `static <E> SortedSet<E> checkedSortedSet(SortedSet<E> s, Class<E> type)`
   - `equals` and `hashCode`
     - unmodifiable, synchronized and checked views — returns a collection whose equals method does not invoke the `equals` method of the underlying collection but `Object::equals`, same for `hashCode`
     - exception — `unmodifiableSet` and `unmodifiableList` methods use the `equals` and `hashCode` methods of the underlying collections

1. sub-ranges — views that changes reflect to the original
   - `List::subList`
   - `SortedMap::subMap`, `SortedMap::headMap`, `SortedMap::tailMap`
     - `NavigableMap` — overrides and has new definitions with inclusion option
     - also for `SortedSet` and `NavigableSet`

### Legacy Collections

1. `java.util.Hashtable` — synchronized `HashMap`, use `ConcurrentHashMap` instead

1. `java.util.Properties` — for property files
   ```java
   public class Properties extends Hashtable<Object,Object>
   ```
   - `String` keys and values
   - property file syntax — [.properties - Wikipedia](https://en.wikipedia.org/wiki/.properties)
   - can be saved to a stream or loaded from a stream
     - `void store(OutputStream out, String comments)`
     - more
   - can use a secondary `Properties` for default
     - `Properties()`
     - `Properties(Properties defaults)`
     - `String getProperty(String key)`
     - `String getProperty(String key, String defaultValue)` — `defaultValue` only when no secondary `Properties` and `key` absent
   - system properties — see `java` in [CLI](#CLI), find accessible names in `$JAVA_HOME/conf/security/java.policy`
     ```shell
     # jshell> System.getProperties().forEach((k, v) -> System.out.printf("%s=%s\n", k, v))
     $ java -XshowSettings:properties --version
     Property settings: # only a portion is available on all platforms
         awt.toolkit = sun.awt.windows.WToolkit
         file.encoding = GBK # not an official property, use Charset.defaultCharset() instead
         file.separator = \
         java.awt.graphicsenv = sun.awt.Win32GraphicsEnvironment
         java.class.path =
         java.class.version = 56.0
         java.home = C:\Program Files\Java\jdk-12.0.2
         java.io.tmpdir = C:\Users\ADMINI~1\AppData\Local\Temp\
         java.library.path = # JAVA_PATH;C:\Windows\Sun\Java\bin;. for Windows
         java.runtime.name = OpenJDK Runtime Environment
         java.runtime.version = 12.0.2+10
         java.specification.name = Java Platform API Specification
         java.specification.vendor = Oracle Corporation
         java.specification.version = 12
         java.vendor = Oracle Corporation
         java.vendor.url = https://java.oracle.com/
         java.vendor.url.bug = https://bugreport.java.com/bugreport/
         java.version = 12.0.2
         java.version.date = 2019-07-16
         java.vm.compressedOopsMode = Zero based
         java.vm.info = mixed mode, sharing
         java.vm.name = OpenJDK 64-Bit Server VM
         java.vm.specification.name = Java Virtual Machine Specification
         java.vm.specification.vendor = Oracle Corporation
         java.vm.specification.version = 12
         java.vm.vendor = Oracle Corporation
         java.vm.version = 12.0.2+10
         jdk.debug = release
         line.separator = \r\n
         os.arch = amd64
         os.name = Windows 7
         os.version = 6.1
         path.separator = ;
         sun.arch.data.model = 64
         sun.boot.library.path = C:\Program Files\Java\jdk-12.0.2\bin
         sun.cpu.endian = little
         sun.cpu.isalist = amd64
         sun.desktop = windows
         sun.io.unicode.encoding = UnicodeLittle
         sun.java.launcher = SUN_STANDARD
         sun.jnu.encoding = GBK
         sun.management.compiler = HotSpot 64-Bit Tiered Compilers
         sun.os.patch.level = Service Pack 1
         sun.stderr.encoding = ms936
         sun.stdout.encoding = ms936
         user.country = CN
         user.dir = # pwd
         user.home = # ~
         user.language = en
         user.name = Administrator
         user.script =
         user.variant =
     ```

1. `java.util.Enumeration` — legacy `Iterator`
   - get `Enumeration` — use `Collections::enumeration`, `Collections::emptyEnumeration` to work with legacy code

1. `java.util.Vector` — legacy synchronized `ArrayList`

1. `java.util.Stack` — legacy
   ```java
   public class Stack<E> extends Vector<E>
   ```

1. `java.util.BitSet` — bit vector, no perfect alternative, still in use
   ```java
   public class BitSet extends Object
   implements Cloneable, Serializable
   ```
   - no boundary check — some methods (such as `size()`) may overflow
   - creation
     - constructors
     - `valueOf`
     - `clone`
     - `BitSet get(int fromIndex, int toIndex)`

## Preferences

1. preferences — in `java.util.prefs`
   - disadvantages of property files
     - no uniform location
     - no standard naming convention, increasing the likelihood of name clashes
   - location of preferences — registry in Windows, file system for Linux, implementation hidden from user
   - structure — tree structure, recommended to make the configuration node paths match the package names
   - multiple users — `Preferences.userRoot()`, `Preferences.systemRoot()`

1. `java.util.prefs.Preferences` — `Map` like
   ```java
   public abstract class Preferences extends Object
   ```
   - move around nodes
     - `static Preferences userRoot()`
     - `static Preferences userNodeForPackage(Class<?> c)`
     - `static Preferences systemRoot()`
     - `static Preferences systemNodeForPackage(Class<?> c)`
     - `abstract Preferences node(String pathName)`
   - get value from key
     - `abstract boolean getBoolean(String key, boolean def)`
     - `abstract byte[] getByteArray(String key, byte[] def)`
     - `abstract double getDouble(String key, double def)`
     - `abstract float getFloat(String key, float def)`
     - `abstract int getInt(String key, int def)`
     - `abstract long getLong(String key, long def)`
   - put key-value pairs
   - export and import
   - more

## Stream

1. stream
   - characteristics
     - no store — elements stored in an underlying collection or generated on demand, should not mutate upon terminal operation
     - does not mutate source — new stream on every call
     - lazy
     - one-time — may throw `IllegalStateException` if it detects that the stream is being reused
     - sequential or parallel — in parallel mode when the terminal method executes, all intermediate stream operations will be parallelized, using `ForkJoinPool`
     - ordered or not — streams that arise from ordered collections (arrays and lists), from ranges, generators, and iterators, or from calling `Stream::sorted` are ordered
       - order and parallelism — ordering does not preclude efficient parallelism, but some operations can be more effectively parallelized without requiring order
   - stream creation
     - from collections and `Arrays` — `Collection::stream`, `Collection::parallelStream`, `Arrays::stream`
       - under the hood — `StreamSupport::stream`, which uses `Spliterator`
     - static methods in `Stream`
     - `Pattern::splitAsStream`
     - `Files::lines`, `BufferedReader::lines`
     - `Stream.Builder`
     - `Random::ints`, `Random::doubles`, `Random::longs` for primitive variants
     - `CharSequence::codepoints`, `CharSequence::chars`

1. `java.util.stream.BaseStream`
   ```java
   public interface BaseStream<T,S extends BaseStream<T,S>>
   extends AutoCloseable
   ```
   - `void close()`
   - `boolean isParallel()`
   - `Iterator <T> iterator()`
   - `Spliterator <T> spliterator()`
   - `S onClose(Runnable closeHandler)`
   - `S parallel()`
   - `S sequential()`
   - `S unordered()`

1. `java.util.stream.StreamSupport` — for library writers presenting stream views of data structures
   ```java
   public final class StreamSupport extends Object
   ```

1. `java.util.stream.IntStream`, `java.util.stream.LongStream`, `java.util.stream.DoubleStream`
   ```java
   public interface IntStream
   extends BaseStream<Integer,IntStream>
   ```
   - methods like those in `Stream`
   - creation — partial `range()` in Python
     - `static IntStream range(int startInclusive, int endExclusive)`
     - `static IntStream rangeClosed(int startInclusive, int endInclusive)`
     - `static LongStream range(long startInclusive, long endExclusive)`
     - `static LongStream rangeClosed(long startInclusive, long endInclusive)`
   - transformation
     - `DoubleStream asDoubleStream()`  
       `LongStream asLongStream()`
     - `Stream<Integer> boxed()`  
       `Stream<Double> boxed()`  
       `Stream<Long> boxed()`
     - `LongSummaryStatistics summaryStatistics()`  
       `IntSummaryStatistics summaryStatistics()`  
       `DoubleSummaryStatistics summaryStatistics()`

1. `java.util.stream.Stream`
   ```java
   public interface Stream<T>
   extends BaseStream<T,Stream<T>>
   ```
   - creation
     - `static <T> Stream<T> of(T... values)`  
       `static <T> Stream<T> of(T t)`
     - `static <T> Stream<T> empty()`
     - `static <T> Stream<T> generate(Supplier<T> s)` — Returns an infinite sequential unordered stream where each element is generated by the provided Supplier.
     - `static <T> Stream<T> iterate(T seed, UnaryOperator<T> f)` — Returns an infinite sequential ordered Stream produced by iterative application of a function `f` to an initial element seed, producing a Stream consisting of seed, `f(seed)`, `f(f(seed))`, etc.
     - `static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b)`
     - `static <T> Stream.Builder<T> builder()`
       ```java
       public static interface Stream.Builder<T>
       extends Consumer<T>
       ```
       - `void accept(T t)`  
         `default Stream.Builder<T> add(T t)`
       - `Stream<T> build()`
   - transformation
     - `BaseStream` methods
     - `Stream<T> filter(Predicate<? super T> predicate)`
     - `<R> Stream<R> map(Function<? super T,? extends R> mapper)`  
       `DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper)`  
       `IntStream mapToInt(ToIntFunction<? super T> mapper)`  
       `LongStream mapToLong(ToLongFunction<? super T> mapper)`
     - `<R> Stream<R> flatMap(Function<? super T,? extends Stream<? extends R>> mapper)`  
       `DoubleStream flatMapToDouble(Function<? super T,? extends DoubleStream> mapper)`  
       `IntStream flatMapToInt(Function<? super T,? extends IntStream> mapper)`  
       `LongStream flatMapToLong(Function<? super T,? extends LongStream> mapper)`
   - query — order matters
     - `Stream<T> limit(long maxSize)`
     - `Stream<T> skip(long n)`
     - `Stream<T> distinct()` — uses `Object::equals`, the first occurrence when ordered
     - `Stream<T> sorted()`  
       `Stream<T> sorted(Comparator<? super T> comparator)`
   - reduction (terminal operation)
     - `Optional<T> max(Comparator<? super T> comparator)`
     - `Optional<T> min(Comparator<? super T> comparator)`
     - `long count()`
     - `Optional<T> findAny()` — effective when parallel
     - `Optional<T> findFirst()`
     - `boolean allMatch(Predicate<? super T> predicate)`
     - `boolean anyMatch(Predicate<? super T> predicate)`
     - `boolean noneMatch(Predicate<? super T> predicate)`
     - `T reduce(T identity, BinaryOperator<T> accumulator)`
     - `<U> U reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)`
     - `Collectors::reducing`
   - result (terminal operation)
     - `Stream<T> peek(Consumer<? super T> action)`
     - `void forEach(Consumer<? super T> action)`
     - `void forEachOrdered(Consumer<? super T> action)` — when in parallel mode and order matters
     - `Object[] toArray()`  
       `<A> A[] toArray(IntFunction<A[]> generator)`
     - `<R,A> R collect(Collector<? super T,A,R> collector)`  
       `<R> R collect(Supplier<R> supplier, BiConsumer<R,? super T> accumulator, BiConsumer<R,R> combiner)` — `Collector` shortcut
       ```java
       List<String> asList = stringStream.collect(ArrayList::new, ArrayList::add,
                                                  ArrayList::addAll);
       String concat = stringStream.collect(StringBuilder::new, StringBuilder::append,
                                            StringBuilder::append)
                                   .toString();
       ```
     - iterator methods from `BaseStream`

1. `java.util.stream.Collector` — A mutable reduction operation that accumulates input elements into a mutable result container
   ```java
   public interface Collector<T,A,R>
   ```
   - process
     - creation of a new result container (`Supplier<A> supplier()`)
     - incorporating a new data element into a result container (`BiConsumer<A,T> accumulator()`)
     - combining two result containers into one (`BinaryOperator<A> combiner()`)
     - performing an optional final transform on the container (`Function<A,R> finisher()`)
   - `Set<Collector.Characteristics> characteristics()`
   - `enum Characteristics`
     - `CONCURRENT` — Indicates that this collector is concurrent, meaning that the result container can support the accumulator function being called concurrently with the same result container from multiple threads.
     - `IDENTITY_FINISH` — Indicates that the finisher function is the identity function and can be elided.
       - `Function.identity()`
     - `UNORDERED` — Indicates that the collection operation does not commit to preserving the encounter order of input elements.
   - creation
     - `static <T,A,R> Collector<T,A,R> of(Supplier<A> supplier, BiConsumer<A,T> accumulator, BinaryOperator<A> combiner, Function<A,R> finisher, Collector.Characteristics... characteristics)`
     - `static <T,R> Collector<T,R,R> of(Supplier<R> supplier, BiConsumer<R,T> accumulator, BinaryOperator<R> combiner, Collector.Characteristics... characteristics)`
     - methods in `Collectors`

1. `java.util.stream.Collectors`
   - statics
     - `static <T> Collector<T,?,Double> averagingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Double> averagingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Double> averagingLong(ToLongFunction<? super T> mapper)`
     - `static <T> Collector<T,?,Optional<T>> maxBy(Comparator<? super T> comparator)`
     - `static <T> Collector<T,?,Optional<T>> minBy(Comparator<? super T> comparator)`
     - `static <T> Collector<T,?,DoubleSummaryStatistics> summarizingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,IntSummaryStatistics> summarizingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,LongSummaryStatistics> summarizingLong(ToLongFunction<? super T> mapper)`
     - `static <T> Collector<T,?,Long> counting()`
     - `static <T> Collector<T,?,Double> summingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Integer> summingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Long> summingLong(ToLongFunction<? super T> mapper)`
   - collector chaining
     - `static <T,A,R,RR> Collector<T,A,RR> collectingAndThen(Collector<T,A,R> downstream, Function<R,RR> finisher)` — add finisher
     - `static <T,U,A,R> Collector<T,?,R> mapping(Function<? super T,? extends U> mapper, Collector<? super U,A,R> downstream)` — preprocess with `T -> U` function for collector accepting `U`
     - `groupingBy`
     - `groupingByConcurrent`
     - `partitioningBy`
   - group (defaults to using `HashMap` and `ConcurrentHashMap`)
     - `static <T,K> Collector<T,?,Map<K,List<T>>> groupingBy(Function<? super T,? extends K> classifier)`  
       `static <T,K,A,D> Collector<T,?,Map<K,D>> groupingBy(Function<? super T,? extends K> classifier, Collector<? super T,A,D> downstream)`  
       `static <T,K,D,A,M extends Map<K,D>> Collector<T,?,M> groupingBy(Function<? super T,? extends K> classifier, Supplier<M> mapFactory, Collector<? super T,A,D> downstream)`
     - `static <T,K> Collector<T,?,ConcurrentMap<K,List<T>>> groupingByConcurrent(Function<? super T,? extends K> classifier)`  
       `static <T,K,A,D> Collector<T,?,ConcurrentMap<K,D>> groupingByConcurrent(Function<? super T,? extends K> classifier, Collector<? super T,A,D> downstream)`  
       `static <T,K,A,D,M extends ConcurrentMap<K,D>> Collector<T,?,M> groupingByConcurrent(Function<? super T,? extends K> classifier, Supplier<M> mapFactory, Collector<? super T,A,D> downstream)`
     - `static <T> Collector<T,?,Map<Boolean,List<T>>> partitioningBy(Predicate<? super T> predicate)`  
       `static <T,D,A> Collector<T,?,Map<Boolean,D>> partitioningBy(Predicate<? super T> predicate, Collector<? super T,A,D> downstream)`
   - to map (`HashMap` and `ConcurrentHashMap`)
     - `static <T,K,U> Collector<T,?,ConcurrentMap<K,U>> toConcurrentMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper)`  
       `static <T,K,U> Collector<T,?,ConcurrentMap<K,U>> toConcurrentMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper, BinaryOperator<U> mergeFunction)`  
       `static <T,K,U,M extends ConcurrentMap<K,U>> Collector<T,?,M> toConcurrentMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper, BinaryOperator<U> mergeFunction, Supplier<M> mapSupplier)`
     - `static <T,K,U> Collector<T,?,Map<K,U>> toMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper)`  
       `static <T,K,U> Collector<T,?,Map<K,U>> toMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper, BinaryOperator<U> mergeFunction)`  
       `static <T,K,U,M extends Map<K,U>> Collector<T,?,M> toMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper, BinaryOperator<U> mergeFunction, Supplier<M> mapSupplier)`
   - to collection
     - `static <T,C extends Collection<T>> Collector<T,?,C> toCollection(Supplier<C> collectionFactory)`
     - `static <T> Collector<T,?,List<T>> toList()`
     - `static <T> Collector<T,?,Set<T>> toSet()`
   - join
     - `static Collector<CharSequence,?,String> joining()`
     - `static Collector<CharSequence,?,String> joining(CharSequence delimiter)`
     - `static Collector<CharSequence,?,String> joining(CharSequence delimiter, CharSequence prefix, CharSequence suffix)`
   - reduce
     - `static <T> Collector<T,?,Optional<T>> reducing(BinaryOperator<T> op)`
     - `static <T> Collector<T,?,T> reducing(T identity, BinaryOperator<T> op)`
     - `static <T,U> Collector<T,?,U> reducing(U identity, Function<? super T,? extends U> mapper, BinaryOperator<U> op)`

## SPI (Service Loader)

1. SPI
   - [zhihu](https://zhuanlan.zhihu.com/p/28909673)
   - define the interface / superclass, and provide its implementation, no hard code
   - for `ServiceLoader`, define in `META-INF/services/packageName.InterfaceName` as a text file with fully qualified implementation name
     ```
     implementation.package.name.ImplName1
     implementation.package.name.ImplName2
     ...
     ```
   - example for `ServiceLoader`
     ```java
     public interface Search {
         public List<String> searchDoc(String keyword);
     }
     // implementations and configurations omitted
     public class TestCase {
         public static ServiceLoader<Search> s = ServiceLoader.load(Search.class);
         public static void main(String[] args) {
             for (Search search : s) {
                 search.searchDoc("hello world");
             }
         }
     }
     ```
   - `java.text.spi`

1. `java.util.ServiceLoader`
   ```java
   public final class ServiceLoader<S> extends Object
   implements Iterable<S>
   ```
   - `Iterator<S> iterator()` — Lazily loads the available providers of this loader's service.
   - `static <S> ServiceLoader<S> load(Class<S> service)` — Creates a new service loader for the given service type, using the current thread's context class loader.

## Other Utils

1. date and time related — see [Time](#Time)

1. `java.util.PropertyPermission` — system property permissions

1. `java.util.UUID` — an immutable universally unique identifier (UUID). A UUID represents a 128-bit value.

1. `java.util.Objects` — null-safe
   - `static <T> int compare(T a, T b, Comparator<? super T> c)` — `return (a == b) ? 0 : c.compare(a, b);`
   - `static boolean deepEquals(Object a, Object b)` — Returns `true` if the arguments are deeply equal to each other and `false` otherwise.
   - `static boolean equals(Object a, Object b)` — `return (a == b) || (a != null && a.equals(b));`
   - `static int hash(Object... values)` — `return Arrays.hashCode(values);`
   - `static int hashCode(Object o)` — `return o != null ? o.hashCode() : 0;`
   - `static boolean isNull(Object obj)` — `return obj == null;`
   - `static boolean nonNull(Object obj)` — `return obj != null;`
   - `static <T> T requireNonNull(T obj)`  
     `static <T> T requireNonNull(T obj, String message)`  
     `static <T> T requireNonNull(T obj, Supplier<String> messageSupplier)` — Checks that the specified object reference is not null and throws a customized `NullPointerException` if it is.
   - `static String toString(Object o)` — `return String.valueOf(o);` &rarr; `return (obj == null) ? "null" : obj.toString();`
   - `static String toString(Object o, String nullDefault)` — `return (o != null) ? o.toString() : nullDefault;`
   - index check methods — since JDK 9

1. `java.util.Optional` — A container object which may or may not contain a non-null value, a better `null`
   ```java
   public final class Optional<T> extends Object
   ```
   - fallback to `null
     - `boolean isPresent()`
     - `T get()`
   - transformation
     - `void ifPresent(Consumer<? super T> consumer)`
     - `<U> Optional<U> map(Function<? super T,? extends U> mapper)`
     - `<U> Optional<U> flatMap(Function<? super T,Optional<U>> mapper)`
     - `Optional<T> filter(Predicate<? super T> predicate)`
     - `T orElse(T other)`
     - `T orElseGet(Supplier<? extends T> other)`
     - `<X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier)`
   - creation
     - `static <T> Optional<T> empty()`
     - `static <T> Optional<T> of(T value)`
     - `static <T> Optional<T> ofNullable(T value)`
   - variants
     - `java.util.OptionalInt`
     - `java.util.OptionalDouble`
     - `java.util.OptionalLong`

1. `java.util.LongSummaryStatistics`, `java.util.IntSummaryStatistics`, `java.util.DoubleSummaryStatistics`
   ```java
   public class LongSummaryStatistics extends Object
   implements LongConsumer, IntConsumer
   ```
   - creation
     - `Collectors::summarizingLong`, `Collectors::summarizingDouble`, `Collectors::summarizingInt`
     - `IntSummaryStatistics(long count, int min, int max, long sum)`
     - with out collector — `IntSummaryStatistics()`
       ```java
       LongSummaryStatistics stats = longStream.collect(LongSummaryStatistics::new,
                                                        LongSummaryStatistics::accept,
                                                        LongSummaryStatistics::combine);
       ```
   - statics
     - `double getAverage()`
     - `long getCount()`
     - `long|int|double getMax()`
     - `long|int|double getMin()`
     - `long|double getSum()`
     - `String toString()`

## ZIP, Checksum and Encryption

1. `java.util.Base64`
   - `java.util.Base64.Decoder`
   - `java.util.Base64.Encoder`

1. `java.util.zip.CRC32`
   ```java
   public class CRC32 extends Object
   implements Checksum
   ```
   - `interface java.util.zip.Checksum`

1. ZIP streams — see [ZIP Streams](#ZIP-Streams)

1. `java.security.MessageDigest` — MD5, SHA-1, SHA-256, SHA-384, and SHA-512
   ```java
   bytesToHex(MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(Paths.get("temp.py"))));
   ```
   ```java
   static char[] HEX_ARRAY = "0123456789ABCDEF".toCharArray();
   static String bytesToHex(byte[] bytes) {
       char[] hexChars = new char[bytes.length << 1];
       for (int j = 0; j < bytes.length; ++j) {
           int v = bytes[j] & 0xFF;
           hexChars[j << 1] = HEX_ARRAY[v >>> 4];
           hexChars[(j << 1) + 1] = HEX_ARRAY[v & 0x0F];
       }
       return String.valueOf(hexChars);
   }
   ```
   - CLI — `keytool`

1. `javax.crypto.Cipher` — AES, DES, RSA
   - `java.security.KeyPairGenerator`

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

1. log4j2 with slf4j
   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter</artifactId>
      <!-- 使用log4j2要排除logBack依赖 -->
      <exclusions>
         <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
         </exclusion>
      </exclusions>
   </dependency>
   <!-- Spring已经写好了一个log4j2-starter但缺少桥接包 -->
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-log4j2</artifactId>
   </dependency>
   <!-- 引入缺少的桥接包 -->
   <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>jcl-over-slf4j</artifactId>
   </dependency>
   ```
   - `org.apache.logging.log4j.ThreadContext` -- stores properties in the current thread

### Logger

1. use logger
   - prevent gc — A logger that is not referenced by any variable can be garbage collected
     ```java
     private static final Logger myLogger = Logger.getLogger("com.mycompany.myapp");
     ```
   - hierarchy — child loggers inherit certain properties from parent loggers
   - levels — `Level`
     - `Level.INFO` by default
   - stack info — default log record shows the name of the class and method that contain the logging call, as inferred from the call stack
     - call info and optimization — the virtual machine optimizes execution, accurate call information may not be available
     - `Logger::logp` to set calling point explicitly
   - log configuration — processed by `LogManager`
     - manager object property — `java.util.logging.manager`, if `null` the no-arg protected constructor is used
     - configuration class property — `java.util.logging.config.class`, take precedence over config files
     - configuration file — `java.util.logging.config.file`
       - default config file — `$JAVA_HOME/lib/logging.properties`, or `$JAVA_HOME/conf/logging.properties` for JDK >= 9
       - `.level=INFO` — default global logging level
       - `java.util.logging.ConsoleHandler.level=INFO` — log level for `ConsoleHandler`
       - hierarchy — `foo.level` defines a log level for the logger called "foo" and (recursively) for any of its children in the naming hierarchy
       - children after parents — level settings for child nodes in the tree should come after settings for their parents
   - localization — use resource bundle
     ```java
     Logger logger = Logger.getLogger(loggerName, "com.mycompany.logmessages");
     logger.log(Level.INFO, "readingFile", fileName); // fill placeholder
     ```
     - resource bundles
       - such as `com/mycompany/logmessages_de.properties`
       - property with placeholder — `readingFile=Achtung! Datei {0} wird eingelesen`
     - log with explicit resource bundle — `Logger::logrb`
     - get and set resource bundle — `Logger::getResourceBundle`, `Logger::setResourceBundle`

1. `java.util.logging.Logger`
   - creation — uses `LogManager` behind the scenes
     - `static Logger getGlobal()`
     - `static Logger getAnonymousLogger()`
     - `static Logger getAnonymousLogger(String resourceBundleName)`
     - `static Logger getLogger(String name)`
     - `static Logger getLogger(String name, String resourceBundleName)`
   - settings
     - `void setLevel(Level newLevel)`
     - `void setFilter(Filter newFilter)`
   - handler
     - `void setUseParentHandlers(boolean useParentHandlers)`
     - `void addHandler(Handler handler)`
   - hierarchy
     - `void setParent(Logger parent)`
     - `Logger getParent()`
   - log — uses `Handler::publish` behind the scenes
     - `void info(String msg)`  
       `void info(Supplier<String> msgSupplier)`
        - all levels have methods, except `Level.ALL` and `Level.OFF`
     - `void log(Level level, String msg)`  
       `void log(Level level, Supplier<String> msgSupplier)`
     - `void logp(Level level, String sourceClass, String sourceMethod, String msg)` — give the precise location of the calling class and method
   - log errors
     - `void throwing(String sourceClass, String sourceMethod, Throwable thrown)`
       - `FINER` level
       - message starts with `THROW`
     - `void log(Level level, String msg, Throwable thrown)`
     - `void logp(Level level, String sourceClass, String sourceMethod, String msg, Throwable thrown)`
   - pass values into placeholders (in property files)
     - `void log(Level level, String msg, Object param1)`
     - `void log(Level level, String msg, Object[] params)`
   - log execution flow — place at the start and the end of methods, level is `FINER`
     - `void entering(String sourceClass, String sourceMethod)`  
       `void entering(String sourceClass, String sourceMethod, Object param1)`  
       `void entering(String sourceClass, String sourceMethod, Object[] params)`
       - log records start with `ENTRY`
     - `void exiting(String sourceClass, String sourceMethod)`  
       `void exiting(String sourceClass, String sourceMethod, Object result)`
       - log records start with `RETURN`

1. `java.util.logging.LogManager` — singleton to maintain a set of shared state about loggers and log services

### Log Levels and Records

1. `java.util.logging.Level`
   ```java
   public class Level extends Object
   implements Serializable
   ```
   - levels
     - `static Level OFF` — `Integer.MAX_VALUE`
     - `static Level SEVERE` — 1000, `error` for `slf4j`
     - `static Level WARNING` — 900, `warn` for `slf4j`
     - `static Level INFO` — 800
     - `static Level CONFIG` — 700
     - `static Level FINE` — 500, `debug`, `trace` for `slf4j`
     - `static Level FINER` — 400
     - `static Level FINEST` — 300
     - `static Level ALL` — `Integer.MIN_VALUE`

1. `java.util.logging.LogRecord` — used to pass logging requests between the logging framework and individual log Handlers
   ```java
   public class LogRecord extends Object
   implements Serializable
   ```
   - `Level getLevel()`
   - `String getMessage()`
   - `Object[] getParameters()`
   - `Throwable getThrown()`
   - more

### Handlers

1. handler — all handlers extends `Handler`, used by `Logger::log`
   - also has level — `INFO` by default, configurable via configuration file
     - `java.util.logging.ConsoleHandler.level=INFO`
   - hierarchy — a logger sends records both to its own handlers and the handlers of the parent
     - the primordial logger (with name `""` ) handler — `ConsoleHandler`
     - `Logger::setUseParentHandlers`
   - custom handlers can be used — `Logger::addHandler`
   - `java.util.logging.StreamHandler`
     - `ConsoleHandler` — print records to `System.err`
     - `FileHandler` — send records to a file `java<number>.log` in homedir, or some default dir in Windows, `XMLFormatter` by default
       - supports `append` flag
       - supports file rotation
       - use platform encoding by default — set via property `java.util.logging.FileHandler.encoding=UTF-8`
     - `SocketHandler` — sends records to a specified host and port, `XMLFormatter` by default
   - `java.util.logging.MemoryHandler` — Handler that buffers requests in a circular buffer in memory.

1. `java.util.logging.Handler`
   ```java
   public abstract class Handler
   ```
   - `abstract void close()`
   - `abstract void flush()`
   - `abstract void publish(LogRecord record)`
   - settings
     - `void setFilter(Filter newFilter)`
     - `void setFormatter(Formatter newFormatter)`
     - `void setLevel(Level newLevel)`
   - more

#### Filters

1. filters — implements `Filter`, used by handlers
   - in addition to level filtering, logger and handler can have an optional filter
   - `Logger::setFilter`, `Handler::setFilter`
     - both at most one filter at a time

1. `java.util.logging.Filter`
   ```java
   @FunctionalInterface
   public interface Filter
   ```
   - `boolean isLoggable(LogRecord record)`

#### Formatters

1. formatters — extends `Formatter`, used by handlers
   - `Handler::setFormatter`

1. `java.util.logging.Formatter`
   ```java
   public abstract class Formatter
   ```
   - `abstract String format(LogRecord record)`
   - more

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

# Concurrency

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
     - Windows has seven priority levels, priorities are ignored in Linux??
     - caveat — few scenarios there to ever tweak priorities. If you have several threads with a high priority that don’t become inactive, the lower-priority threads may never execute
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
     - handler defaults — default handler defaults to `null`, individual handler defaults to `ThreadGroup`
   - `ThreadGroup` — represents a set of threads. In addition, a thread group can also include other thread groups
     - not recommended, use alternatives instead
     - action orders of `ThreadGroup::uncaughtException` when an uncaught exception
       - the `uncaughtException` method of the parent thread group
       - otherwise, default handler if non-`null`
       - otherwise, nothing happens if the `Throwable` is an instance of `ThreadDeath`
       - otherwise, print the name of the thread and the stack trace to `System.err`
   - `ThreadLocal`, `ThreadLocalRandom` — thread-local variables
     ```java
     public static final ThreadLocal<SimpleDateFormat> dateFormat =
         ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
     ```
     - motivations — avoid synchronization and blocking and boost performance
       - the internal data structures used by `SimpleDateFormat` can be corrupted by concurrent access, and synchronization is expensive
       - `Random` is thread safe using `AtomicLong::compareAndSet`, but inefficient if multiple threads need to wait for a single shared generator

1. `Runnable` — should be implemented by any class whose instances are intended to be executed by a thread
   ```java
   @FunctionalInterface
   public interface Runnable {
       void run();
   }
   ```
   - see [Callable and Future](#Callable-and-Future) for more
   - conversion to `Callable` -- `Executors::callable`

1. `Thread`
   ```java
   public class Thread extends Object
   implements Runnable
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
   - `BLOCKED` — intrinsic object lock, a thread that is blocked waiting for a monitor lock is in this state.
   - `WAITING` — after `Object::wait`, `Thread::join`, or by `Lock` or `Condition`, a thread that is waiting indefinitely for another thread to perform a particular action is in this state.
   - `TIMED_WAITING` — after `Thread::sleep`, or methods for `WAITING` with a time parameter, a thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
   - `TERMINATED` — A thread that has exited is in this state.

1. `ThreadGroup`
   ```java
   public class ThreadGroup extends Object
   implements Thread.UncaughtExceptionHandler
   ```
   - share some APIs of `Thread`

1. `ThreadLocal`
   ```java
   public class ThreadLocal<T>
   ```
   - `T get()`
   - `void remove()` -- can prevent possible memory leak
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
   - `ThreadLocal.ThreadLocalMap`, referenced by `Thread` field -- open addressing hash table
     - entry -- `WeakReference<ThreadLocal<?>>` as key, whose hash value managed by a static `AtomicInteger`, `getAndAdd` for every `ThreadLocal` instance
     - memory leak -- referent of `WeakReference<ThreadLocal<?>>` keys can be reclaimed by GC, but no `ReferenceQueue` like in `WeakHashMap`, `expungeStaleEntries()` called only when rehash, and single entry expunge method called only when a stale entry encountered, possibly leaving stale entries not expunged

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
   - equivalent conditions in `Object` — see [Inheritance](#Inheritance) for other `Object` APIs
     - `void notify()`
     - `void notifyAll()`
     - `void wait()`
     - `void wait(long timeout)`
     - `void wait(long timeout, int nanos)`
   - monitor — intrinsic lock is the loose adaption of the monitor concept
     - [Monitor (synchronization) - Wikipedia](https://en.wikipedia.org/wiki/Monitor_(synchronization))
   - JVM optimization -- see [zhihu](https://zhuanlan.zhihu.com/p/75880892), [CS-Notes/Java 并发.md at master · CyC2018/CS-Notes](https://github.com/CyC2018/CS-Notes/blob/master/notes/Java%20%E5%B9%B6%E5%8F%91.md#%E5%8D%81%E4%BA%8C%E9%94%81%E4%BC%98%E5%8C%96)

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
   - underlying implementation -- `AbstractQueuedSynchronizer::compareAndSetState`

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
     - overhead — the read-write lock implementation (which is inherently more complex than a mutual exclusion lock) can dominate the execution cost if the read operations are too short
   - underlying implementation -- `AbstractQueuedSynchronizer::compareAndSetState`

1. `java.util.concurrent.locks.StampedLock` — a capability-based lock, not reentrant, lock acquisition methods return a stamp that represents and controls access with respect to a lock state; lock release and conversion methods require stamps as arguments
   ```java
   public class StampedLock implements Serializable
   ```
   - stamp -- zero value for failure, the state of a `StampedLock` consists of a version and mode
   - three modes
     - write -- blocks waiting for exclusive access
       - `long writeLock()`
       - `void unlockWrite(long stamp)`
     - read -- blocks waiting for non-exclusive access
       - `long readLock()`
       - `void unlockRead(long stamp)`
       - `int getReadLockCount()`
     - optimistic read -- an extremely weak version of a read-lock, that can be broken by a writer at any time, for short read-only code segments
       - `long tryOptimisticRead()` -- returns a non-zero stamp only if the lock is not currently held in write mode
       - `boolean validate(long stamp)` -- returns true if the lock has not been acquired in write mode since obtaining a given stamp
     - `void unlock(long stamp)`
   - mode conversion methods
   - `Lock` conversion
     - `Lock asReadLock()`
     - `Lock asWriteLock()`
     - `ReadWriteLock asReadWriteLock()`
   - underlying implementation -- memory fence methods in `VarHandle`, and `VarHandle::compareAndSet`
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
     - memory barrier, membar, memory fence or fence instruction -- a type of barrier instruction that causes a CPU or compiler to enforce an ordering constraint on memory operations issued before and after the barrier instruction. This typically means that operations issued prior to the barrier are guaranteed to be performed before operations issued after the barrier
     - barrier -- a barrier for a group of threads or processes in the source code means any thread/process must stop at this point and cannot proceed until all other threads/processes reach this barrier
   - ensure changes visible — compiler will insert the appropriate code to ensure that a change to the a variable in one thread is visible from any other thread that reads the variable
     - [happen-before order](https://docs.oracle.com/javase/specs/jls/se11/html/jls-17.html#jls-17.4.5) — a write to a volatile field is visible to and ordered before every subsequent read of that field
   - atomicity — volatile variables do not provide any atomicity, but makes read and write to `long` and `double` atomic
     - [JLS 17.7. Non-Atomic Treatment of double and long](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.7)  
       > For the purposes of the Java programming language memory model, a single write to a non-volatile `long` or `double` value is treated as two separate writes: one to each 32-bit half. This can result in a situation where a thread sees the first 32 bits of a 64-bit value from one write, and the second 32 bits from another write.
   - also `synchronized` -- changes visible before a variable is unlocked

1. `java.util.concurrent.atomic` — use efficient machine-level instructions to guarantee atomicity without using locks
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
       - ABA problem -- use `AtomicStampedReference`, or traditional synchronization
   - delayed computation — `LongAdder`, `LongAccumulator`, `DoubleAdder`, `DoubleAccumulator`
     - under high contention, performance suffers because the optimistic updates require too many retries
     - the computation must be associative and commutative
     - `identity` — initial value, also used when `accumulate()`

1. `java.util.concurrent.atomic` classes
   - `java.util.concurrent.atomic.AtomicBoolean` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicIntegerArray` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicIntegerFieldUpdater<T>`
   - `java.util.concurrent.atomic.AtomicLongArray` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicLongFieldUpdater<T>`
   - `java.util.concurrent.atomic.AtomicMarkableReference<V>`
   - `java.util.concurrent.atomic.AtomicReference<V>` (implements `Serializable`)
   - `java.util.concurrent.atomic.AtomicReferenceArray<E>` (implements `Serializable`)
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
   - timeout — some methods have versions with timeout

1. `java.util.concurrent.BlockingQueue`
   ```java
   public interface BlockingQueue<E> extends Queue<E>
   ```
   - non-null
   - blocking
     - `E put(E e)`
     - `E take()`
   - timeout
     - `boolean offer(E e, long timeout, TimeUnit unit)`  
       `boolean offer(E e)` — 0 timeout
     - `E poll(long timeout, TimeUnit unit)`

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
   - The head of the queue is that `Delayed` element whose delay expired furthest in the past
   - `java.util.concurrent.Delay`
     ```java
     public interface Delayed extends Comparable<Delayed> {
         long getDelay(TimeUnit unit);
     }
     ```
     - consistency between `compareTo` and `getDelay` — a `compareTo` method needs to provide an ordering consistent with its `getDelay` method, which violates the consistency between `compareTo` and `equals`

1. `java.util.concurrent.LinkedTransferQueue` — unbounded `TransferQueue` backed by dual queues of slack (refer to source code) based on linked nodes
   ```java
   public class LinkedTransferQueue<E> extends AbstractQueue<E>
   implements TransferQueue<E>, Serializable
   ```
   - `java.util.concurrent.TransferQueue` — A `BlockingQueue` in which producers may wait for consumers to receive elements
     ```java
     public interface TransferQueue<E> extends BlockingQueue<E>
     ```
     - `void transfer(E e)` — transfers the specified element immediately if there exists a consumer already waiting, else waits until the element is received by a consumer
   - inaccurate `size()` — `size()` is O(n) and maybe inaccurate, due to non-data nodes and concurrency
   - atomicity for bulk operations — bulk operations `addAll`, `removeAll`, `retainAll`, `containsAll`, `equals`, and `toArray` are not guaranteed to be performed atomically

### Concurrent Collections

1. concurrent collections
   - generally non-blocking algorithm
   - some are non-null
   - inaccurate `size()` — `size()` is O(n) and maybe inaccurate, due to non-data nodes and concurrency
   - atomicity for bulk operations — bulk operations `addAll`, `removeAll`, `retainAll`, `containsAll`, `equals`, and `toArray` are not guaranteed to be performed atomically
   - iterators are weakly consistent — may or may not reflect all modifications after construction, but will not return a value twice

1. `java.util.concurrent.ConcurrentLinkedQueue`
   ```java
   public class ConcurrentLinkedQueue<E> extends AbstractQueue<E>
   implements Queue<E>, Serializable
   ```
   - [Simple, Fast, and Practical Non-Blocking and Blocking Concurrent Queue Algorithms](http://www.cs.rochester.edu/~scott/papers/1996_PODC_queues.pdf)

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

1. `java.util.concurrent.ConcurrentHashMap`
   ```java
   public class ConcurrentHashMap<K,V> extends AbstractMap<K,V>
   implements ConcurrentMap<K,V>, Serializable
   ```
   - fully interoperable with `Hashtable`
   - `concurrencyLevel` — the estimated number of concurrently updating threads, defaults to 16, other write threads will be blocked if the number exceeded
   - `long mappingCount()` — used in lieu of `size()` for `long`; an estimate, the actual count may differ if there are concurrent insertions or removals
   - atomicity
     - value non-null -- `null` is for absent; if also for value, incompatible with the operation that use `synchronized` on the old value
     - put -- `synchronized` on the old value, CAS if `null`
     - replace -- `synchronized` on the old value
     - lambda -- `synchronized` on the old value, if `null`, CAS a dummy value and `synchronized` on the dummy value, compute lambda, set computed value, exit lock block
     - use `ConcurrentHashMap<String, LongAdder>` with `putIfAbsent`
       ```java
       map.putIfAbsent(word, new LongAdder()).increment();
       map.computeIfAbsent(word, k -> new LongAdder()).increment(); // better
       ```
   - `parallelismThreshold` of bulk operations — if the map contains more elements than the threshold, the bulk operation is parallelized, fully utilize the `ForkJoinPool.commonPool()` if set to 1
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

1. `java.util.concurrent.CopyOnWriteArrayList` — all mutative operations (add, set, and so on) are implemented by making a fresh copy of the underlying array
   ```java
   public class CopyOnWriteArrayList<E> extends Object
   implements List<E>, RandomAccess, Cloneable, Serializable
   ```
   - tradeoff — efficient when traversal operations vastly outnumber mutations, and is useful when you cannot or don't want to synchronize traversals
     - comparaison to synchronized view — when frequent mutation is needed, synchronized view of `ArrayList` can outperform a `CopyOnWriteArrayList`
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
   - methods for converting to `Callable` in `Executors`

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

1. `java.util.concurrent.ForkJoinTask` — see [Fork-Join](#Fork-Join)

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

1. `java.util.concurrent.Executor` — decoupling task submission from the mechanics of how each task will be run
   ```java
   public interface Executor
   ```
   - `void execute(Runnable command)`

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
   - creation — returned by `Executors.newCachedThreadPool()`, `Executors.newFixedThreadPool(int)`, `Executors.newSingleThreadExecutor()`
   - reject policies when task queue overflow, as static inner classes
     - `ThreadPoolExecutor.AbortPolicy` -- `RejectedExecutionException`
     - `ThreadPoolExecutor.CallerRunsPolicy`
     - `ThreadPoolExecutor.DiscardOldestPolicy`
     - `ThreadPoolExecutor.DiscardPolicy`
   - more

1. `java.util.concurrent.ScheduledThreadPoolExecutor` — `ThreadPoolExecutor` that can additionally schedule commands to run after a given delay, or to execute periodically, preferable to `java.util.Timer`
   ```java
   public class ScheduledThreadPoolExecutor extends ThreadPoolExecutor
   implements ScheduledExecutorService
   ```
   - creation — returned by `Executors.newScheduledThreadPool(int)`, `Executors.newSingleThreadScheduledExecutor()`

1. `java.util.concurrent.ForkJoinPool` — see [Fork-Join](#Fork-Join)

1. `java.util.concurrent.Executors` — factory and utility methods
   - thread pools
     - `static ExecutorService newCachedThreadPool()` — new threads are created as needed; idle threads are kept for 60 seconds  
       `static ExecutorService newCachedThreadPool(ThreadFactory threadFactory)`
     - `static ExecutorService newFixedThreadPool(int nThreads)` — contains a fixed set of threads; tasks kept in a queue when overloaded; idle threads are kept indefinitely  
       `static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory)`
     - `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize)` — fixed-thread pool for scheduled execution; a replacement for `java.util.Timer`  
       `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize, ThreadFactory threadFactory)`
     - `static ExecutorService newSingleThreadExecutor()` — a “pool” with a single thread that executes the submitted tasks sequentially  
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
   - methods for conversion to `Callable` -- from `Runnable`, `PrivilegedAction`, `PrivilegedExceptionAction`
   - more

### Fork-Join

1. fork-join framework
   - work stealing
     - task queue — each thread has a deque for tasks, and pushes subtasks onto the head, LIFO
     - work stealing — when a worker thread is idle, it “steals” a task from the tail of another deque
       - stealing is rare -- since large subtasks are at the tail, such stealing is rare
       - stealing is expensive -- context switch between threads, even between CPUs if not the same core
       - only steal from adjacent thread to mitigate contention
     - `ForkJoinPool` employing work stealing — efficient for recursive tasks, and event-style tasks (especially `asyncMode` for the latter)
   - use and limitations
     - high volume — Huge numbers of tasks and subtasks may be hosted by a small number of actual threads in a `ForkJoinPool`. The pool attempts to maintain enough active (or available) threads by dynamically adding, suspending, or resuming internal worker threads, even if some tasks are stalled waiting to join others
     - no side effect — main use as computational tasks calculating pure functions or operating on purely isolated objects
     - avoid `synchronized` methods or blocks — should minimize other blocking synchronization apart from joining other tasks or using synchronizers such as Phasers. Subdividable tasks should also not perform blocking I/O, and should ideally access variables that are completely independent of those accessed by other running tasks
     - define and use `ForkJoinTasks` that may block — three further considerations
       - independent — completion of few other tasks should be dependent on a task that blocks on external synchronization or I/O
       - small blocking tasks — to minimize resource impact, tasks should be small; ideally performing only the (possibly) blocking action
       - ensure progress — ensure the number of possibly blocked tasks fewer than `ForkJoinPool.getParallelism()`, or use `ForkJoinPool.ManagedBlocker`
     - loosely enforced guideline — by not permitting checked exceptions such as `IOException` to be thrown
     - like a call (fork) and return (join) from a parallel recursive function — `a.fork(); b.fork(); b.join(); a.join();` is likely to be substantially more efficient than `a.join(); b.join()`
     - task size rule of thumb — a task should perform more than 100 and less than 10000 basic computational steps
   - dependency
     - who fork who join -- parent thread must join all its forks
     - unordered join -- forks from the same parent thread can be joined in arbitrary order
     - join all before being joined -- a thread can be joined only when all its forks joined

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
     - `void complete(V value)`  
       `void completeExceptionally(Throwable ex)`
     - `static void helpQuiesce()` — Possibly executes tasks until the pool hosting the current task is quiescent.
   - extending — extend one of the abstract classes that support a particular style of fork/join processing, defines a `compute` method that somehow uses the control methods supplied by this base class
     - tags — for use of specialized subclasses
     - base `final` support methods — should minimally implement protected methods
     - `java.util.concurrent.RecursiveAction` — A recursive resultless `ForkJoinTask`
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

1. `java.util.concurrent.ForkJoinPool` — provides the entry point for submissions from non-`ForkJoinTask` clients, as well as management and monitoring operations
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

1. Memory consistency effects — happen-before, see [volatile](#volatile-and-Atomics)

1. `AbstractQueuedSynchronizer::compareAndSetState` -- uses `VarHandle::compareAndSet`
   <!-- TODO -->
   - CLH lock queue -- the thread appends itself to the waiting queue and spins on the variable that can be updated only by the thread preceding it in the queue
     - Java uses CLH locks for blocking synchronizers, but with the same tactic, see javadoc for `AbstractQueuedSynchronizer.Node`
   - `java.util.concurrent.locks.LockSupport` -- basic thread blocking primitives for creating locks and other synchronization classes
     - underlying -- `jdk.internal.misc.Unsafe::park`, `Unsafe::unpark`
     - `static void park(Object blocker)` -- park current thread, wrapped by set and unset `Thread.parkBlocker`
     - `static void unpark(Thread thread)`

### Count Synchronizers

1. `java.util.concurrent.Semaphore` — Allows a set of threads to wait until permits are available for proceeding, often used to restrict the number of threads than can access some (physical or logical) resource
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
   - underlying implementation -- `AbstractQueuedSynchronizer::compareAndSetState`

1. `java.util.concurrent.CountDownLatch` — Allows a set of threads to wait until a count has been decremented to 0, and the count cannot be increased
   - constructor — `CountDownLatch(int count)`
   - `void await()` — Causes the current thread to wait until the latch has counted down to zero and return immediately upon subsequent call, unless the thread is interrupted  
     `boolean await(long timeout, TimeUnit unit)`
   - `void countDown()` — decrements the count of the latch, releasing all waiting threads if the count reaches zero
   - `long getCount()`
   - underlying implementation -- `AbstractQueuedSynchronizer::compareAndSetState`

1. `java.util.concurrent.CyclicBarrier` — Allows a set of threads to wait until a predefined count of them has reached a common barrier, and then optionally executes a barrier action, and the count is reset
   - all-or-none — If a thread leaves a barrier point prematurely and exceptionally, all other threads waiting at that barrier point will also leave abnormally via `BrokenBarrierException` (or `InterruptedException` if they too were interrupted at about the same time)
   - constructors
     - `CyclicBarrier(int parties)`
     - `CyclicBarrier(int parties, Runnable barrierAction)`
   - `int await()` — Waits until all parties have invoked `await` on this barrier, returns the arrival index of that thread at the barrier  
     `int await(long timeout, TimeUnit unit)`
   - `int getNumberWaiting()`
   - `int getParties()` — the number of parties required to trip this barrier
   - `boolean isBroken()` — Queries if this barrier is in a broken state
   - `void reset()`
   - underlying implementation -- `ReentrantLock`

1. `java.util.concurrent.Phaser` — Like a cyclic barrier, but with a mutable party count, and can have multiple phases with phase number cycling from 0 to `Integer.MAX_VALUE`
   - constructors
     - `Phaser()` — 0 parties, phase number 0
     - `Phaser(int parties)`
     - `Phaser(Phaser parent)`
     - `Phaser(Phaser parent, int parties)`
   - registration — change number of parties
     - `int register()` — Adds a new unarrived party to this phaser
     - `int bulkRegister(int parties)` — Adds the given number of new unarrived parties to this phaser
   - tree tiering — children automatically register with and deregister from their parents according to the their numbers of registered parties
     - `Phaser getParent()` — Returns the parent of this phaser, or null if none
     - `Phaser getRoot()` — Returns the root ancestor of this phaser, which is the same as this phaser if it has no parent
   - arrive — When the final party for a given phase arrives, an optional `onAdvance` is performed and the phase advances (phase number +1)
     - `int arrive()` — Arrives at this phaser, without waiting for others to arrive
     - `int arriveAndAwaitAdvance()` — Arrives at this phaser and awaits others
     - `int arriveAndDeregister()` — Arrives at this phaser and deregisters from it without waiting for others to arrive
   - await — wait at a specific phase, returns when the phaser advances to (or is already at) a different phase
     - `int awaitAdvance(int phase)` — Awaits the phase of this phaser to advance from the given phase value, returning immediately if the current phase is not equal to the given phase value or this phaser is terminated
     - `int awaitAdvanceInterruptibly(int phase)`
     - `int awaitAdvanceInterruptibly(int phase, long timeout, TimeUnit unit)`
   - termination — triggered when `onAdvance` returns `true`. Upon termination, all synchronization methods immediately return a negative integer and registration takes no effect
     - `void forceTermination()` — Forces this phaser to enter termination state
     - `boolean isTerminated()` — Returns true if this phaser has been terminated
   - monitoring
     - `int getArrivedParties()` — Returns the number of registered parties that have arrived at the current phase of this phaser
     - `int getPhase()` — Returns the current phase number
     - `int getRegisteredParties()` — Returns the number of parties registered at this phaser
     - `int getUnarrivedParties()` — Returns the number of registered parties that have not yet arrived at the current phase of this phaser
   - `protected boolean onAdvance(int phase, int registeredParties)` — Overridable method to perform an action upon impending phase advance, and to control termination
     ```java
     return registeredParties == 0; // default implementation
     ```
   - underlying implementation -- `VarHandle::compareAndSetState`

### Data Exchange Synchronizers

1. `java.util.concurrent.Exchanger` — Allows two threads to exchange objects when both are ready for the exchange, a bidirectional form of a `SynchronousQueue`
   ```java
   public class Exchanger<V> extends Object
   ```
   - `V exchange(V x)` — Waits for another thread to arrive at this exchange point (unless the current thread is interrupted), and then transfers the given object to it, receiving its object in return
   - `V exchange(V x, long timeout, TimeUnit unit)`

1. `java.util.concurrent.SynchronousQueue` — a mechanism that pairs up producer and consumer threads, a blocking queue in which each insert operation must wait for a corresponding remove operation by another thread, and vice versa
   ```java
   public class SynchronousQueue<E>
   extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```
   - empty queue — no internal capacity
   - non-null
   - constructors
     - `SynchronousQueue()` — LIFO for non-fair mode
     - `SynchronousQueue(boolean fair)` — FIFO for fairness, performance is similar for this collection
   - `E poll()` — 0 timeout
   - other inherited methods

# Text

1. `String` — see [`String`](#String)

1. `Character` — see also [char](#primitive-types)
   ```java
   public final class Character extends Object
   implements Serializable, Comparable<Character>
   ```
   - general category in the [Unicode specification](http://unicode.org/reports/tr44/#General_Category_Values)
     - defined in static fields as `byte`
     - `static int getType(char ch)`
     - `static int getType(int codePoint)`
   - wrapping and outboxing
     - `Character(char value)`
     - `static Character valueOf(char c)`
     - `char charValue()`
   - conversion between code points
     - casts and `0 + 'a'`
     - `static char[] toChars(int codePoint)`
     - `static int toChars(int codePoint, char[] dst, int dstIndex)`
     - `static int toCodePoint(char high, char low)`
     - `codePointAt`
     - `codePointBefore`
     - `codePointCount`
     - `static char forDigit(int digit, int radix)` — 1 to `'1'`, 10 to `'a'` etc.
     - `static int getNumericValue(char ch)` — also for characters like `Ⅺ` (Roman number)  
       `static int getNumericValue(int codePoint)`
   - `Character.UnicodeScript`
     ```java
     public static enum UnicodeScript
     ```
     - script names — enum constants
     - `static Character.UnicodeScript forName(String scriptName)`
     - `static Character.UnicodeScript of(int codePoint)`
   - `Character.UnicodeBlock`
     ```java
     public static final class Character.UnicodeBlock
     extends Character.Subset
     ```
     - Unicode character block names — static fields
     - `static Character.UnicodeBlock forName(String blockName)`
     - `static Character.UnicodeBlock of(char c)`
     - `static Character.UnicodeBlock of(int codePoint)`
   - `Character.Subset` — for extending, represents particular subsets of the Unicode character set
   - more

1. `java.nio.charset.Charset` — A named mapping between sequences of sixteen-bit Unicode code units and sequences of byte
   ```java
   public abstract class Charset extends Object
   implements Comparable<Charset>
   ```
   - `static Charset defaultCharset()`

1. `java.text.StringCharacterIterator`

## Regex

### Regex Syntax

#### Characters and Character Classes

1. characters
   - `\0n`, `\0nn`, `\0mnn` — ASCII (0~255 or 0~0o377) in octal
   - `\xhh`, `\uhhhh`, `\x{h...h}` — hexadecimal unicode
   - `\t`, `\n`, `\r`
   - `\f` — form feed `\x0c`
   - `\a` — alert (bell), `\x07`
   - `\e` — escape, `\x1b`
   - `\cx` — control character, `\ch` for `ctrl-h` (backspace, `\x08`)
   - `\R` (matcher) — any Unicode line break sequence, is equivalent to `\r\n|[\n\u000B\f\r\u0085\u2028\u2029]`

1. character classes
   - `[a-zA-Z]` — a through z or A through Z, inclusive (range)
   - `[a-d[m-p]]` — a through d, or m through p: `[a-dm-p]` (union)
   - `[a-z&&[def]]` — d, e, or f (intersection)
   - `[a-z&&[^bc]]` — a through z, except for b and c: `[ad-z]` (subtraction)
   - `[a-z&&[^m-p]]` — a through z, and not m through p: `[a-lq-z]` (subtraction)
   - `[\p{L}&&[^\p{Lu}]]` — any letter except an uppercase letter (subtraction)
   - predefined non `\p`
     - `.` — any character, including line terminators if `DOTALL`
     - `\d` — a digit: `[0-9]`  
       `\D` — a non-digit: `[^0-9]`
     - `\h` — a horizontal whitespace character: `[ \t\xA0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000]`  
       `\H` — a non-horizontal whitespace character: `[^\h]`
     - `\s` — a whitespace character: `[ \t\n\x0B\f\r]`  
       `\S` — a non-whitespace character: `[^\s]`
     - `\v` — a vertical whitespace character: `[\n\x0B\f\r\x85\u2028\u2029]`  
       `\V` — a non-vertical whitespace character: `[^\v]`
     - `\w` — a word character: `[a-zA-Z_0-9]`  
       `\W` — a non-word character: `[^\w]`

1. predefined character classes — `\p{prop}`, `\P{prop}` for negation, can be `\pX` if `prop` only takes one letter
   - [Regex Tutorial - Unicode Characters and Properties](https://www.regular-expressions.info/unicode.html)
   - predefined POSIX ASCII, `\p{ASCII}` — all ASCII:`[\x00-\x7F]`
     - `\p{Print}` — a printable character: `[\p{Graph}\x20]`
       - `\p{Graph}` — a visible character: `[\p{Alnum}\p{Punct}]`
         - `\p{Punct}` — punctuation: One of `!"#$%&'()*+,-./:;<=>?@[\]^_{|}~` and backtick
         - `\p{Alnum}` — an alphanumeric character:`[\p{Alpha}\p{Digit}]`
           - `\p{Digit}` — a decimal digit: `[0-9]` or `\d`
           - `\p{XDigit}` — a hexadecimal digit: `[0-9a-fA-F]`
           - `\p{Alpha}` — an alphabetic character:`[\p{Lower}\p{Upper}]`
             - `\p{Lower}` — a lower-case alphabetic character: `[a-z]`
             - `\p{Upper}` — an upper-case alphabetic character:`[A-Z]`
     - `\p{Blank}` — a space or a tab: `[ \t]`
     - `\p{Cntrl}` — a control character: `[\x00-\x1F\x7F]`
     - `\p{Space}` — a whitespace character: `[ \t\n\x0B\f\r]`
   - predefined by `Character` methods
     - `\p{javaLowerCase}` — Equivalent to `Character.isLowerCase()`
     - `\p{javaUpperCase}` — Equivalent to `Character.isUpperCase()`
     - `\p{javaWhitespace}` — Equivalent to `Character.isWhitespace()`
     - `\p{javaMirrored}` — Equivalent to `Character.isMirrored()`
     - more
   - predefined Unicode properties
     - `\p{IsLatin}` — a Latin script character (prefix `Is` with `Character.UnicodeScript` enum value)
     - `\p{InGreek}` — a character in the Greek block (prefix `In` with `Character.UnicodeBlock` static fields)
     - `\p{Lu}`, `\p{gc=Lu}` — an uppercase letter ([general category](http://unicode.org/reports/tr44/#General_Category_Values), also partially documented in the javadoc of static fields in `Character`)
     - `\P{InGreek}` — any character except one in the Greek block (negation)
     - `\p{IsAlphabetic}` — an alphabetic character (binary property, `Is` prefix with below), conform with POSIX character classes when `UNICODE_CHARACTER_CLASS`
        - `Alphabetic`
        - `Ideographic`
        - `Letter`
        - `Lowercase` — granted to conform with `\p{Lower}` when `UNICODE_CHARACTER_CLASS`
        - `Uppercase`
        - `Titlecase`
        - `Punctuation`
        - `Control`
        - `White_Space`
        - `Digit`
        - `Hex_Digit`
        - `Join_Control`
        - `Noncharacter_Code_Point`
        - `Assigned`

#### Matchers, Quantifiers and Others

1. line break matcher `\R` — any Unicode line break sequence, is equivalent to `\r\n|[\n\u000B\f\r\u0085\u2028\u2029]`
   - `\u000B` — a vertical tab
   - `\u0085` — a next-line character
   - `\u2028` — a line-separator character
   - `\u2029` — a paragraph-separator character
   - line terminator
     - `\n`, `\r`, `\r\n`
     - `\u0085`, `\u2028`, `\u2029`
   - line terminator when `UNIX_LINES` — `\n`

1. Boundary matchers
   - `^` `$` — ignore line terminators and only match at the beginning and the end, respectively, of the entire input sequence; respect line terminators when `MULTILINE`
   - `\b` — A word boundary
   - `\B` — A non-word boundary
   - `\A` — The beginning of the input
   - `\G` — The end of the previous match
   - `\Z` — The end of the input but for the final terminator, if any
   - `\z` — The end of the input

1. quantifiers
   - Greedy quantifiers
   - Reluctant quantifiers — non-greedy
   - Possessive quantifiers — greedy quantifiers that do not backtrack (no turning back to accommodate other parts of the pattern once matched)
     ```java
     Pattern.matches(".*+foo", "xfooxxxxxxfoo")
     // $1 ==> false
     Pattern.matches(".*foo", "xfooxxxxxxfoo")
     // $2 ==> true
     ```
     - `X?+`
     - `X*+`
     - `X++`
     - `X{n}+`
     - `X{n,}+`
     - `X{n,m}+`

1. Logical operators
   - `XY` — X followed by Y
   - `X|Y` — Either X or Y
   - `(X)` — X, as a capturing group

1. Back references
   - `\n` — Whatever the nth capturing group matched
   - `\k<name>` — Whatever the named-capturing group "name" matched

1. capturing group and flags
   - `((A)(B(C)))` — numbered by counting their opening parentheses from left to right
     ```
     1    ((A)(B(C)))
     2    (A)
     3    (B(C))
     4    (C)
     ```
     - `\0` — stands for the entire expression
     - if quantification — most recently matched
   - `(?<name>X)` — X, as a named-capturing group, name matches `\p{Alpha}\p{Alnum}*`
   - `(?idmsuxU-idmsuxU)` — Nothing, but turns match flags `i` `d` `m` `s` `u` `x` `U` on - off
   - `(?:X)` — X, as a non-capturing group
     - `(?idmsux-idmsux:X)` — X, as a non-capturing group with the given flags i d m s u x on - off
   - `(?>X)` — X, as an independent, non-capturing group, similar to possessive quantifiers
     ```java
     Pattern.matches("a(?>bc|b)c", "abc")
     // $1 ==> false
     Pattern.matches("a(?>bc|b)c", "abcc")
     // $2 ==> true
     ```
     - optimization — more performance for patterns like `(?>.*\/)(.*)`, `\b(integer|insert|in)\b`
     - order — for "insert", `\b(?>integer|insert|in)\b` matches but `\b(?>in|integer|insert)\b` does not match

1. Quotation
   - `\` — Nothing, but quotes the following character
   - `\Q...\E` — Nothing, but quotes all characters until \E

1. assertion
   - `(?=X)` — X, via zero-width positive lookahead
   - `(?!X)` — X, via zero-width negative lookahead
   - `(?<=X)` — X, via zero-width positive lookbehind
   - `(?<!X)` — X, via zero-width negative lookbehind

### Regex Classes

1. `java.util.regex.Pattern`
   ```java
   public final class Pattern extends Object
   implements Serializable
   ```
   - flags — bit vector
     - encoding and case
       - `static int CANON_EQ` — canonical equivalence, e.g. `a\u030A` and `å`
       - `static int CASE_INSENSITIVE` — `(?i)`, only for US ASCII
       - `static int UNICODE_CASE` - `(?u)`, also Unicode-aware case folding when `i`
       - `static int UNICODE_CHARACTER_CLASS` — `(?U)`, implies `u`, select Unicode character classes instead of POSIX, see before
     - line terminator
       - `static int DOTALL` — `(?s)`, make `.` match line terminators
       - `static int MULTILINE` — `(?m)`, make `^` and `$` match multiple lines
       - `static int UNIX_LINES` — `(?d)`, only `\n` as line terminator for `.`, `^`, `$`
     - literal and comments
       - `static int LITERAL` — literal parsing of meta characters or escape sequences, only `u` and `i` flag work in this mode
       - `static int COMMENTS` — `(?x)`, ignore white spaces and comments which start with `#`
   - creation
     - `static Pattern compile(String regex)`
     - `static Pattern compile(String regex, int flags)`
     - `static String quote(String s)` — quote with `\Q...\E`
   - use
     - `static boolean matches(String regex, CharSequence input)`
     - `String::split`
     - `String[] split(CharSequence input)`
     - `String[] split(CharSequence input, int limit)`
     - `Stream<String> splitAsStream(CharSequence input)`
     - `Matcher matcher(CharSequence input)`
     - `Predicate<String> asPredicate()`
   - get info
     - `int flags()`
     - `String pattern()`
     - `String toString()`

1. `interface java.util.regex.MatchResult` — group related, defaults to using group 0, available if match succeeds
   - starting index and the past-the-end index
     - `int end()`
     - `int end(int group)`
     - `int start()`
     - `int start(int group)`
   - group
     - `String group()`
     - `String group(int group)`
     - `int groupCount()`

1. `java.util.regex.Matcher`
   ```java
   public final class Matcher extends Object
   implements MatchResult
   ```
   - match operation — `MatchResult` available if succeeds
     - `boolean matches()` — match the entire region
     - `boolean lookingAt()` — `matches()` but does not require the entire region be matched
     - `boolean find()` — find from the first character not matched by the previous match
     - `boolean find(int start)` — reset and find from `start`
     - replace methods
   - reset — discards its explicit state information and sets the append position to zero
     - `boolean find(int start)` — reset and find from `start`
     - `Matcher reset()`
     - `Matcher reset(CharSequence input)` — reset with a new input sequence
   - `MatchResult`
     - methods in `MatchResult`
     - `int end(String name)`
     - `String group(String name)`
     - `int start(String name)`
     - `MatchResult toMatchResult()` — result unaffected by subsequent operations
     - `boolean requireEnd()` — whether more input could change a positive match into a negative one
   - region — the region of input to match against
     - `Matcher region(int start, int end)`
     - `int regionEnd()`
     - `int regionStart()`
     - `Matcher useAnchoringBounds(boolean b)` — defaults to using anchoring bounds, the boundaries of the region match anchors such as `^` and `$`
     - `boolean hasAnchoringBounds()`
     - `Matcher useTransparentBounds(boolean b)` — defaults to using opaque bounds, the boundaries of the region are opaque, to lookahead, lookbehind, and boundary matching constructs that may try to see beyond them
     - `boolean hasTransparentBounds()`
   - replace
     - `Matcher appendReplacement(StringBuffer sb, String replacement)` — used by `replaceAll` and `replaceFirst`, `IllegalStateException` if no match available  
       `StringBuffer appendTail(StringBuffer sb)`
       ```java
       Pattern p = Pattern.compile("cat");
       Matcher m = p.matcher("one cat two cats in the yard");
       StringBuffer sb = new StringBuffer();
       while (m.find()) {
           m.appendReplacement(sb, "dog");
           System.out.println(sb.toString());
       }
       m.appendTail(sb);
       System.out.println(sb.toString());
       // one dog
       // one dog two dog
       // one dog two dogs in the yard
       ```
     - `String replaceAll(String replacement)`
     - `String replaceFirst(String replacement)`
     - `static String quoteReplacement(String s)` — quote `\` and `$`: otherwise `\` for escape, `${name}` for named groups, `$0` to `$9` for group number
   - get, set info
     - `Pattern pattern()`
     - `Matcher usePattern(Pattern newPattern)` — position in the input and last append position are unaffected
     - `String toString()`
     - `boolean hitEnd()`

## Format

1. `java.util.Formatter`
   - `String::format`

1. `java.text.MessageFormat` — partially similar to `str.format` in Python
   ```java
   public class MessageFormat
   extends Format
   ```
   - creation
     - `MessageFormat(String pattern)`
   - `static String format(String pattern, Object... arguments)` — uses the current locale
   - `public final String format(Object obj)`
   - choice formatting — `{1,choice,0#no houses|1#one house|2#{1} houses}`, see javadoc for more

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
   - see [`System`](#System)
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

1. async and network channels
   - `java.nio.channels.AsynchronousChannel`
     - `java.nio.channels.AsynchronousByteChannel`
       - `Future<Integer> read(ByteBuffer dst)`
       - `<A> void read(ByteBuffer dst, A attachment, CompletionHandler<Integer,? super A> handler)`
       - `Future<Integer> write(ByteBuffer src)`
       - `<A> void write(ByteBuffer src, A attachment, CompletionHandler<Integer,? super A> handler)`
   - `java.nio.channels.NetworkChannel` -- `NetworkChannel bind(SocketAddress local)`
     - `java.nio.channels.MulticastChannel` -- a network channel that supports Internet Protocol (IP) multicasting

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

# JDBC

1. `java.sql.SQLException`
   ```java
   public class SQLException
   extends Exception
   implements Iterable<Throwable>
   ```
   - `java.sql.BatchUpdateException`
   - `java.sql.SQLClientInfoException`
   - `java.sql.SQLNonTransientException`
     - `java.sql.SQLDataException`
     - `java.sql.SQLFeatureNotSupportedException`
     - `java.sql.SQLIntegrityConstraintViolationException`
     - `java.sql.SQLInvalidAuthorizationSpecException`
     - `java.sql.SQLNonTransientConnectionException`
     - `java.sql.SQLSyntaxErrorException`
   - `java.sql.SQLRecoverableException`
   - `java.sql.SQLTransientException`
     - `java.sql.SQLTimeoutException`
     - `java.sql.SQLTransactionRollbackException`
     - `java.sql.SQLTransientConnectionException`
   - `java.sql.SQLWarning`
     - `java.sql.DataTruncation`

## JDBC Properties

1. JDBC system properties
   ```properties
   jdbc.drivers=org.postgresql.Driver
   jdbc.url=jdbc:postgresql:example
   jdbc.username=dbuser
   jdbc.password=secret
   ```

1. JDBC driver
   - types
     - type 1 driver, no in use anymore — translates JDBC to ODBC and relies on an ODBC driver to communicate with the database
     - type 2 driver, deprecated — written partly in Java and partly in native code; it communicates with the client API of a database, platform-specific code required
     - type 3 driver — a pure Java client library that uses a database-independent protocol to communicate database requests to a server component, which then translates the requests into a database-specific protocol
     - type 4 driver — a pure Java library that translates JDBC requests directly to a database-specific protocol
   - driver class register — the driver manager iterates through the registered drivers to find a driver that can use the subprotocol specified in the database URL
     - automatic register as service provider — a jar file is automatically registered if it contains the file `META-INF/services/java.sql.Driver`
     - hard code — load a class and its static initializers executed
       ```java
       Class.forName("org.postgresql.Driver");
       ```
     - system property — `jdbc.drivers`, separated by colons
   - debug
     - `DriverManager::setLogWriter`
     - some drivers support trace file parameter in url

1. JDBC url
   ```
   jdbc:subprotocol:others
   jdbc:derby://localhost:1527/example;create=true
   jdbc:postgresql:example
   ```

1. JDBC escape syntax -- translate to database-specific syntax variations, see [JDBC Reference Information](https://docs.oracle.com/en/database/oracle/oracle-database/18/jjdbc/JDBC-reference-information.html#GUID-DFF83C4A-D0F8-420C-BA66-8681B939B787)
   - control -- `Statement::setEscapeProcessing`
   - temporal
     ```
     {d '2008-01-24'}
     {t '23:59:59'}
     {ts '2008-01-24 23:59:59.999'}
     ```
   - scalar function
     ```
     {fn left(?, 20)}
     {fn user()}
     ```
   - calling stored procedures
   - outer joins -- `oj`
   - the escape character in `LIKE` clauses

## JDBC Classes

1. example: establish a connection and execute statements
   ```java
   public static void runTest() throws SQLException, IOException {
       try (Connection conn = getConnection(); Statement stat = conn.createStatement()) {
           stat.executeUpdate("CREATE TABLE Greetings (Message CHAR(20))");
           stat.executeUpdate("INSERT INTO Greetings VALUES ('Hello, World!')");
           try (ResultSet result = stat.executeQuery("SELECT * FROM Greetings")) {
               if (result.next()) System.out.println(result.getString(1));
           }
           stat.executeUpdate("DROP TABLE Greetings");
       }
   }
   public static Connection getConnection() throws SQLException, IOException {
       Properties props = new Properties();
       try (InputStream in = Files.newInputStream(Paths.get("database.properties"))) {
           props.load(in);
       }
       String drivers = props.getProperty("jdbc.drivers");
       if (drivers != null) System.setProperty("jdbc.drivers", drivers);
       String url = props.getProperty("jdbc.url");
       String username = props.getProperty("jdbc.username");
       String password = props.getProperty("jdbc.password");
       return DriverManager.getConnection(url, username, password);
   }
   ```

1. `java.sql.DriverManager` — for managing a set of JDBC drivers
   ```java
   public class DriverManager extends Object
   ```
   - `static Connection getConnection(String url)` — the driver manager iterates through the registered drivers to find a driver that can use the subprotocol specified in the database URL  
     `static Connection getConnection(String url, Properties info)`  
     `static Connection getConnection(String url, String user, String password)`
   - `static void setLogWriter(PrintWriter out)`
   - more

1. `interface java.sql.Wrapper` — retrieve the delegate instance when the instance in question is in fact a proxy class
   - `boolean isWrapperFor(Class<?> iface)`
   - `<T> T unwrap(Class<T> iface)`

1. `java.sql.Connection` — A connection (session) with a specific database. SQL statements are executed and results are returned within the context of a connection
   ```java
   public interface Connection
   extends Wrapper, AutoCloseable
   ```
   - metadata
     - `DatabaseMetaData getMetaData()` -- information about the database's tables, its supported SQL grammar, its stored procedures, the capabilities of this connection, and so on
   - configuration -- should not use a SQL statements to configure if a JDBC method available
     - `void abort(Executor executor)`
     - `void close()`
     - `SQLWarning getWarnings()`, `void clearWarnings()`
     - `String getSchema()`, `void setSchema(String schema)`
     - `getClientInfo`, `setClientInfo`
   - transaction -- should not use a SQL statements to configure if a JDBC method available
     - `void setAutoCommit(boolean autoCommit)` — defaults to `true`
     - `boolean getAutoCommit()`
     - `void setTransactionIsolation(int level)`
       - isolation levels as `static int` fields -- `TRANSACTION_NONE`, `TRANSACTION_READ_COMMITTED`, `TRANSACTION_READ_UNCOMMITTED`, `TRANSACTION_REPEATABLE_READ`, `TRANSACTION_SERIALIZABLE`
     - `int getTransactionIsolation()`
     - `void commit()`
     - `Savepoint setSavepoint()`  
       `Savepoint setSavepoint(String name)`
     - `void releaseSavepoint(Savepoint savepoint)`
     - `void rollback()`  
       `void rollback(Savepoint savepoint)`
   - statements -- one or more, according to `DatabaseMetaData::getMaxStatements`
     - `Statement createStatement()`  
       `Statement createStatement(int resultSetType, int resultSetConcurrency)`  
       `Statement createStatement(int resultSetType, int resultSetConcurrency, int resultSetHoldability)`
       - `resultSetType` -- `ResultSet.TYPE_FORWARD_ONLY`, `ResultSet.TYPE_SCROLL_INSENSITIVE`, `ResultSet.TYPE_SCROLL_SENSITIVE`
       - `resultSetConcurrency` -- `ResultSet.CONCUR_READ_ONLY`, `ResultSet.CONCUR_UPDATABLE`
       - `resultSetHoldability` -- `ResultSet.HOLD_CURSORS_OVER_COMMIT`, `ResultSet.CLOSE_CURSORS_AT_COMMIT`
     - `prepareCall` -- for `CALL` stored procedures
     - `prepareStatement` -- `PREPARE` and `EXECUTE`
   - `java.sql.DatabaseMetaData` -- information about the DBMS, the driver, and the results of some `SHOW` statements
      ```java
      public interface DatabaseMetaData extends Wrapper
      ```
      - `ResultSet getTables(String catalog, String schemaPattern, String tableNamePattern, String[] types)`

1. `java.sql.Statement` — executing a static SQL statement and returning the results
   ```java
   public interface Statement
   extends Wrapper, AutoCloseable
   ```
   - one `ResultSet` a time — all execution methods in the `Statement` interface implicitly close a current `ResultSet` object of the statement if an open one exists
   - `ResultSet getResultSet()`
   - `getMoreResults` -- for databases that also allow submission of multiple SELECT statements in a single query
   - `void setEscapeProcessing(boolean enable)` -- defaults to `true`
   - autogenerated keys -- whether retrieve autogenerated keys, often the primary key
     - `int executeUpdate(String sql, int autoGeneratedKeys)` and other methods
       - `static int RETURN_GENERATED_KEYS`
       - `static int NO_GENERATED_KEYS`
   - batch -- no `SELECT`
     - `void addBatch(String sql)`
     - `int[] executeBatch()`
   - execute
     - `execute`
     - `int[] executeBatch()`
     - `default long[] executeLargeBatch()`
     - `executeLargeUpdate`
     - `ResultSet executeQuery(String sql)`
     - `executeUpdate` — returns count for rows affected or 0

1. `java.sql.PreparedStatement`
   ```java
   public interface PreparedStatement extends Statement
   ```
   - `void clearParameters()`
   - example
     ```java
     PreparedStatement pSt = con.prepareStatement("UPDATE EMPLOYEES
                                       SET SALARY = ? WHERE ID = ?");
     pSt.setBigDecimal(1, 153833.00);
     pSt.setInt(2, 110592);
     pSt.executeUpdate();
     ```

1. `java.sql.ResultSet` — a table of data representing a database result set
   ```java
   public interface ResultSet
   extends Wrapper, AutoCloseable
   ```
   - cursor — initially positioned before the first row; no `hasNext`, keep calling `next` until `false`
     - `boolean next()` — moves the cursor forward one row from its current position, initially positioned before the first row, `false` when at last row
       ```java
       while (rs.next()) { }
       ```
     - scrollable cursor
       - `boolean absolute(int row)`
       - `boolean relative(int rows)`
       - `boolean previous()`
       - `first`, `last`, `beforeFirst`, and `afterLast`
       - `isFirst`, `isLast`, `isBeforeFirst`, and `isAfterLast`
   - `ResultSetMetaData getMetaData()`
     - `ResultSetMetaData::getColumnTypeName`
   - `get-` prefixed methods — get results as a certain type from the current row, two forms of parameters, for types like `Array`, `Blob`, `Clob`, `int`, `String` etc.
     - `__ get__(int columnIndex)` — index starts from 1
     - `__ get__(String columnLabel)`
   - `update-` prefixed methods — like `get-` methods, for interactive update
     - `void updateRow()` -- updates the underlying database with the new contents of the current row, changes will be discarded if not called
     - `void cancelRowUpdates()`
   - insert -- for interactive scenarios
     1. `void moveToInsertRow()`
     1. `update-` methods
     1. `void insertRow()`
     1. `void moveToCurrentRow()`
   - `void deleteRow()` -- for interactive scenarios

1. JDBC type interfaces
   - `java.lang` type classes, `String` and stream type classes, `java.math` type classes, primitive types
   - `java.net.URL` type class
   - `java.sql.Array`
   - `java.sql.Blob`
   - `java.sql.Clob`
   - `java.sql.Ref`
   - `java.sql.RowId`
   - `java.sql.SQLData` -- SQL user-defined type (UDT)
   - `java.sql.SQLType` -- a generic SQL type, called a JDBC type or a vendor specific data type
   - `java.sql.Date`
     ```java
     public class Date extends java.util.Date
     ```
   - `java.sql.Time`
     ```java
     public class Time extends java.util.Date
     ```
   - `java.sql.Timestamp`
     ```java
     public class Timestamp extends java.util.Date
     ```
   - `java.sql.Types` -- `static int` constants that are used to identify generic SQL types
     - `ARRAY`, `BIGINT`, `BINARY`, `BIT`, `BLOB`, `BOOLEAN`, `TINYINT`, `VARBINARY`, `VARCHAR`
     - more

### Row Sets

1. `javax.sql.RowSet` -- a connected rowset or more commonly, a disconnected rowset
   ```java
   public interface RowSet extends ResultSet
   ```
   - `javax.sql.rowset.JdbcRowSet -- added functionality of connections, like transaction
   - `javax.sql.rowset.CachedRowSet` -- a disconnected rowset
     ```java
     public interface CachedRowSet extends RowSet, Joinable
     ```
     - `javax.sql.rowset.WebRowSet` -- a cached row set that can be saved to an XML file
       - `javax.sql.rowset.FilteredRowSet` -- for filtering
       - `javax.sql.rowset.JoinRowSet` -- for `JOIN`

1. `interface javax.sql.rowset.RowSetFactory`
   - `__RowSet create__RowSet()`

1. `javax.sql.rowset.RowSetProvider`
   - `static RowSetFactory newFactory()`
   - `static RowSetFactory newFactory(String factoryClassName, ClassLoader cl)`

# Time

1. current timestamps
   - `System`
     - `static long nanoTime()`
     - `static long currentTimeMillis()`

1. SQL and legacy classes
   - timestamps (`Instant`) — `java.util.Date`: represents a specific instant in time, with millisecond precision
     ```java
     public class Date extends Object
     implements Serializable, Cloneable, Comparable<Date>
     ```
     - `java.sql.Date` — interoperable with SQL `DATE`
     - `java.sql.Time` — interoperable with SQL `TIME` without a timezone
     - `java.sql.Timestamp` — interoperable with SQL `TIMESTAMP`, adds the ability to hold the SQL `TIMESTAMP` fractional seconds value, by allowing the specification of fractional seconds to a precision of nanoseconds
   - calendars — `java.util.Calendar`: for converting between a specific instant in time and a set of calendar fields, and for manipulating the calendar fields
     ```java
     public abstract class Calendar extends Object
     implements Serializable, Cloneable, Comparable<Calendar>
     ```
     - `java.util.GregorianCalendar` — a concrete subclass of `Calendar` and provides the standard calendar system used by most of the world
   - timezones — `java.util.TimeZone`
     ```java
     public abstract class TimeZone extends Object
     implements Serializable, Cloneable
     ```
     - `java.util.SimpleTimeZone`
   - formats
     - `java.text.DateFormat`
       ```java
       public abstract class DateFormat
       extends Format
       ```
       - `java.text.SimpleDateFormat`

1. `java.time` — dates, times, instants, and durations
   - `java.time.temporal` — lower level access to the fields
   - `java.time.format` — printing and parsing all manner of dates and times
   - `java.time.chrono` — calendar neutral APIs, localized calendars, for interactions with users
   - non-null — non-null constructors and methods, except checking and validating methods
   - API convention
     - `of` — static factory method
     - `parse` — static factory method focussed on parsing
     - `get` — gets the value of something
     - `is` — checks if something is true
     - `with` — the immutable equivalent of a setter
     - `plus` — adds an amount to an object
     - `minus` — subtracts an amount from an object
     - `to` — converts this object to another type
     - `at` — combines this object with another, such as `date.atTime(time)`
     - `from`
   - enums
     - `java.time.Month`
       ```java
       public enum Month extends Enum<Month>
       implements TemporalAccessor, TemporalAdjuster
       ```
     - `java.time.DayOfWeek`
       ```java
       public enum DayOfWeek extends Enum<DayOfWeek>
       implements TemporalAccessor, TemporalAdjuster
       ```

1. `java.time.Instant`
   ```java
   public final class Instant extends Object
   implements Temporal, TemporalAdjuster, Comparable<Instant>, Serializable
   ```
   - SQL type — `TIMESTAMP` with a timezone
   - epoch
     - `static Instant EPOCH` — Constant for the 1970-01-01T00:00:00Z epoch instant.
     - `static Instant MAX` — The maximum supported Instant, '1000000000-12-31T23:59:59.999999999Z'.
     - `static Instant MIN` — The minimum supported Instant, '-1000000000-01-01T00:00Z'.
   - creation
     - `now`
     - `of-` prefixed methods
     - `static Instant parse(CharSequence text)`
   - conversion
     - `long toEpochMilli()`
     - `String toString()`
     - `int getNano()`
     - `getLong`

1. `java.time.Duration` — amount of time, kept in several `long` for seconds, an `int` for nanoseconds
   ```java
   public final class Duration extends Object
   implements TemporalAmount, Comparable<Duration>, Serializable
   ```
   - creation
     - `static Duration between(Temporal startInclusive, Temporal endExclusive)`
     - more

1. `java.time.OffsetDateTime` -- A date-time with an offset from UTC/Greenwich in the ISO-8601 calendar system, such as `2007-12-03T10:15:30+01:00`
   - SQL type — `TIMESTAMP` with a timezone

1. `java.time.ZonedDateTime` -- `OffsetDateTime` with `ZoneId`, such as `2007-12-03T10:15:30+01:00 Europe/Paris`
   - SQL type — `TIMESTAMP` with a timezone
   - The Internet Assigned Numbers Authority (IANA) [database](www.iana.org/time-zones)
   - `ZoneId getZone()`
   - `OffsetDateTime toOffsetDateTime()`

1. `java.time.LocalDateTime`
   - SQL type — `DATETIME`

1. `java.time.LocalDate` — A date without a time-zone in the ISO-8601 calendar system
   ```java
   public final class LocalDate extends Object
   implements Temporal, TemporalAdjuster, ChronoLocalDate, Serializable
   ```
   - SQL type — `DATE`
   - overflow when `plusMonth` or `minusMonth` — return the last valid day of the month

1. `java.time.Period` — A date-based amount of time in the ISO-8601 calendar system, counterpart of `Duration`
   ```java
   public final class Period extends Object
   implements ChronoPeriod, Serializable
   ```

1. `java.time.OffsetTime`
   - SQL type — `TIME` with a timezone

1. `java.time.LocalTime`
   - SQL type — `TIME` without a timezone

1. `java.time.format.DateTimeFormatter` — Formatter for printing and parsing date-time objects
   ```java
   public final class DateTimeFormatter extends Object
   ```
   - creation
     - predefined — see javadoc
     - `ofLocalized-` prefixed methods to create from `FormatStyle`
     - patterns — see javadoc for patterns like `"E yyyy-MM-dd HH:mm"`
       - `static DateTimeFormatter ofPattern(String pattern)`
       - `static DateTimeFormatter ofPattern(String pattern, Locale locale)`
   - localized
     - `DateTimeFormatter withLocale(Locale locale)`
   - conversion
     - `toFormat`
   - format
     - `String format(TemporalAccessor temporal)`
     - `void formatTo(TemporalAccessor temporal, Appendable appendable)`
   - parse methods
     - `LocalDate::parse`, `LocalDateTime::parse`, `LocalTime::parse`, or `ZonedDateTime::parse`, not suitable for parsing human input
     - other parse methods
   - `enum java.time.format.FormatStyle` — `FULL`, `LONG`, `MEDIUM`, `SHORT`
   - `java.time.format.TextStyle`
     ```java
     public enum TextStyle extends Enum<TextStyle>
     ```
     - `FULL` / `FULL_STANDALONE`
     - `SHORT` / `SHORT_STANDALONE`
     - `NARROW` / `NARROW_STANDALONE`
     - `Month::getDisplayName` — `String getDisplayName(TextStyle style, Locale locale)`

# i18n

1. locale — language code and optionally other codes; language tag like `en-US`
   ```
   lang-script-region-extension
   ```
   - language code — two or three lowercase letters, such as `en`
   - script code — four letters with an initial uppercase, such as `Latn` (Latin), `Cyrl` (Cyrillic), or `Hant` (traditional Chinese characters)
   - country (region) code — two uppercase letters or three digits such as US (United States) or CH (Switzerland)
   - variant: miscellaneous (such as dialects or spelling rules) codes — rarely used or made into extension
   - extension — start with `u-` and a two-letter code specifying whether the extension deals with the calendar (`ca`), numbers (`nu`), and so on; Other extensions are entirely arbitrary and start with `x-`, such as `x-java`
     - describe local preferences — calendars (such as the Japanese calendar), numbers (`u-nu-thai` Thai instead of Western digits), and so on
   - example
     - `"zh-Hans-CN"` — Chinese written in simplified characters as used in China (primary language with script and country codes)
     - `"ja-JP-u-ca-japanese"` — Use the Japanese calendar in date and time formatting, so that 2013 is expressed as the year 25 of the Heisei period, or 平成25
   - reference
     - [“Best Current Practices” BCP 47 - Tags for Identifying Languages](https://tools.ietf.org/html/bcp47)
     - [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/)

1. `java.util.Locale`
   - creation
     - constructors
       - `Locale(String language)`
       - `Locale(String language, String country)`
       - `Locale(String language, String country, String variant)`
     - `static Locale forLanguageTag(String languageTag)`
     - `static Locale[] getAvailableLocales()`
     - predefined
       - `static char PRIVATE_USE_EXTENSION` — The key for the private use extension ('x').
       - `static char UNICODE_LOCALE_EXTENSION` — `'u'`
       - `static Locale ROOT`
       - `static Locale SIMPLIFIED_CHINESE`
       - `static Locale US`
       - `static Locale UK`
       - more
     - from locale-dependent utility classes — `NumberFormat.getAvailableLocales()`
     - `Locale.Builder`
       ```java
       public static final class Locale.Builder extends Object
       ```
       ```java
       Locale aLocale = new Builder().setLanguage("sr").setScript("Latn").setRegion("RS").build();
       ```
   - default — `System.getProperty("user.language")`, `System.getProperty("user.region")`
     - `static Locale getDefault()`
     - `static Locale getDefault(Locale.Category category)`
     - `static void setDefault(Locale.Category category, Locale newLocale)`
     - `static void setDefault(Locale newLocale)`
   - get methods — show info about this locale
   - transformation
     - `Locale stripExtensions()`
     - `String toLanguageTag()`

1. `java.text.Format` — abstract base class for formatting locale-sensitive information such as dates, messages, and numbers
   ```java
   public abstract class Format extends Object
   implements Serializable, Cloneable
   ```
   - format
     - `String format(Object obj)`
     - `abstract StringBuffer format(Object obj, StringBuffer toAppendTo, FieldPosition pos)`
     - `AttributedCharacterIterator formatToCharacterIterator(Object obj)`
   - parse
     - `Object parseObject(String source)`
     - `abstract Object parseObject(String source, ParsePosition pos)`
     - use a Scanner to read localized integers and floating-point numbers — `Scanner::useLocale`

1. `MessageFormat`
   - creation
     - `MessageFormat(String pattern, Locale locale)`
   - public final String format(Object obj)

## Number Format

1. `java.text.NumberFormat`
   ```java
   public abstract class NumberFormat
   extends Format
   ```
   - creation
     - `static Locale[] getAvailableLocales()`
     - `static NumberFormat getCurrencyInstance()`
     - `static NumberFormat getCurrencyInstance(Locale inLocale)`
     - `static NumberFormat getInstance()`
     - `static NumberFormat getInstance(Locale inLocale)`
     - `static NumberFormat getIntegerInstance()`
     - `static NumberFormat getIntegerInstance(Locale inLocale)`
     - `static NumberFormat getNumberInstance()`
     - `static NumberFormat getNumberInstance(Locale inLocale)`
     - `static NumberFormat getPercentInstance()`
     - `static NumberFormat getPercentInstance(Locale inLocale)`
   - settings — get, set methods

1. `java.util.Currency` — control the currency used by the formatters
   ```java
   public final class Currency extends Object
   implements Serializable
   ```
   - `NumberFormat::serCurrency` — `void setCurrency(Currency currency)`
   - creation
     - `static Set<Currency> getAvailableCurrencies()`
     - `static Currency getInstance(Locale locale)`
     - `static Currency getInstance(String currencyCode)`
   - display
     - `String getCurrencyCode()`
     - `int getDefaultFractionDigits()`
     - `String getDisplayName()`
     - `String getDisplayName(Locale locale)`
     - `int getNumericCode()`
     - `String getSymbol()`
     - `String getSymbol(Locale locale)`
     - `String toString()`

1. `java.time.format.DateTimeFormatter` — see [Time](#Time)

## Collator and Normalizer

1. `java.text.Collator` — locale-sensitive String comparison
   ```java
   public abstract class Collator extends Object
   implements Comparator<Object>, Cloneable
   ```
   - decomposition — four normalization forms (D, KD, C, and KC)
     - normalization forms
       - In the normalization form C, accented characters are always composed. For example, a sequence of A and a combining ring above ° is combined into a single character Å (recommended by W3C)
       - In form D, accented characters are always decomposed into their base letters and combining accents: Å is turned into A followed by °
       - Forms KC and KD also decompose characters such as ligatures or the trademark symbol
     - `static int NO_DECOMPOSITION`
     - `static int CANONICAL_DECOMPOSITION`
     - `static int FULL_DECOMPOSITION`
   - strength — in Czech, "e" and "f" are considered primary differences, while "e" and "ě" are secondary differences, "e" and "E" are tertiary differences and "e" and "e" are identical
     - `PRIMARY`, `SECONDARY`, `TERTIARY`, and `IDENTICAL`
     - `int getStrength()`
     - `void setStrength(int newStrength)`
   - creation
     - `static Locale[] getAvailableLocales()`
     - `static Collator getInstance()`
     - `static Collator getInstance(Locale desiredLocale)`
   - compare
     - `int compare(Object o1, Object o2)`
     - `abstract int compare(String source, String target)`
   - sort — `abstract CollationKey getCollationKey(String source)` for better performance
   - `java.text.CollationKey` — a series of bits that can be compared bitwise against other `CollationKeys` of the same `Collator` object
     ```java
     public abstract class CollationKey extends Object
     implements Comparable<CollationKey>
     ```
     - `abstract int compareTo(CollationKey target)`
     - `String getSourceString()`
     - `abstract byte[] toByteArray()`
   - example
     ```java
     var ss = new String[] {"Peter Öhlund", "Peter Ohlin", "Peter Olsdal", "Peter Zorn"};
     Arrays.sort(ss);
     Arrays.sort(ss, Collator.getInstance(Locale.GERMANY));
     Arrays.sort(ss, Collator.getInstance(Locale.forLanguageTag("sv")));
     Arrays.stream(ss)
         .map((s) -> collator.getCollationKey(s))
         .sorted()
         .map((k) -> k.getSourceString())
         .toArray((i) -> new String[i]);
     ```

1. `java.text.Normalizer` — decomposition in `Collator`, see [Unicode Standard Annex #15 — Unicode Normalization Forms](http://www.unicode.org/reports/tr15/tr15-23.html)
   ```java
   public final class Normalizer extends Object
   ```
   - `static boolean isNormalized(CharSequence src, Normalizer.Form form)`
   - `static String normalize(CharSequence src, Normalizer.Form form)`
     ```java
     String name = "Ångström";
     String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
     ```
   - `Normalizer.Form`
     ```java
     public static enum Normalizer.Form extends Enum<Normalizer.Form>
     ```
     - `NFC`
     - `NFD`
     - `NFKC`
     - `NFKD`

## Resource Bundles

1. resource bundles — locale-specific items
   - naming convention
     - country specific — `bundleName_language_country`
     - language specific — `bundleName_language`
   - load order
     - `bundleName_currentLocaleLanguage_currentLocaleCountry`
     - `bundleName_currentLocaleLanguage`
     - `bundleName_currentLocaleLanguage_defaultLocaleCountry`
     - `bundleName_defaultLocaleLanguage`
     - `bundleName`
   - resource hierarchy — the parents are searched if a lookup was not successful in the current bundle
     - load — parents are looked up when a bundle is already located
     - order — `bundleName_de_DE`, then the `bundleName_de` and `bundleName`
   - property files
     - supported by `ResourceBundle::getBundle`
       ```java
       // MyProgramStrings.properties
       // MyProgramStrings_en.properties
       // MyProgramStrings_de_DE.properties
       ResourceBundle bundle = ResourceBundle.getBundle("MyProgramStrings", locale);
       ```
     - only ASCII in property files — use `\uxxxx` for unicode
     - property with placeholder — `readingFile=Achtung! Datei {0} wird eingelesen`
   - bundle classes — to provide resources that are not strings
     - priority — more prior than property files
     - supported by `ResourceBundle::getBundle`
       ```java
       // MyProgramResources.java
       // MyProgramResources_en.java
       // MyProgramResources_de_DE.java
       ResourceBundle bundle = ResourceBundle.getBundle("MyProgramResources", locale);
       ```
     - define bundle classes
       - extend `ListResourceBundle`
         ```java
         public class MyProgramResources_de_DE extends ListResourceBundle {
             private static final Object[][] contents = {
                 { "backgroundColor", Color.black },
                 { "defaultPaperSize", new double[] { 210, 297 } }
             }
             @Override
             public Object[][] getContents() { return contents; }
         }
         ```
       - extend `ResourceBundle` and override below methods
         ```java
         abstract Enumeration<String> getKeys()
         protected abstract Object handleGetObject(String key)
         ```

1. `java.util.ResourceBundle`
   ```java
   public abstract class ResourceBundle extends Object
   ```
   - load
     - `static ResourceBundle getBundle(String baseName)`
     - `static ResourceBundle getBundle(String baseName, Locale locale)`
     - `static ResourceBundle getBundle(String baseName, Locale locale, ClassLoader loader)`
     - `static ResourceBundle getBundle(String baseName, Locale targetLocale, ClassLoader loader, ResourceBundle.Control control)`
     - `static ResourceBundle getBundle(String baseName, Locale targetLocale, ResourceBundle.Control control)`
     - `static ResourceBundle getBundle(String baseName, ResourceBundle.Control control)`
   - get
     - `Object getObject(String key)`
     - `String getString(String key)`
     - `String[] getStringArray(String key)`

# Other Java APIs

1. agents — bytecode engineering at load time
   - bytecode engineering compiled classes — [ASM](https://asm.ow2.io/)
   - CLI
     - `-agentlib:<libname>[=<options>]`
     - `-agentpath:<pathname>[=<options>]`
     - `-javaagent:<jarpath>[=<options>]`
   - `java.lang.instrument` — allow agents to instrument programs running on the JVM. The mechanism for instrumentation is modification of the byte-codes of methods.
     - more in package javadoc
   - build an agent when launching JVM
     - write an agent class with `premain`, called when the agent is loaded, before `main` of programs
       ```java
       public static void premain(String arg, Instrumentation instr)
       ```
       - CLI options (args) — can get a single one
       - `agentmain` method for agents starting sometime after JVM launched
     - write a manifest setting `Premain-Class`
       ```
       Premain-Class: bytecodeAnnotations.EntryLoggingAgent
       ```
     - package the agent class and the manifest
       ```shell
       jar cvfm EntryLoggingAgent.jar bytecodeAnnotations/EntryLoggingAgent.mf \
           bytecodeAnnotations/Entry*.class
       ```

1. scripting
   ```java
   var $1 = new javax.script.ScriptEngineManager().getEngineByName("nashorn");
   String json = "{\"a\": 5}";
   var $7 = (jdk.nashorn.api.scripting.ScriptObjectMirror) $1.eval("JSON.parse('" + json + "')");
   $7.getMember("a"); // 5, Integer
   ```
   - engines
     - nashorn — JavaScript engine, included from JDK 8, deprecated from JDK 11
     - groovy
     - Renjin — R language
     - sisc
   - bindings — variable contexts
   - new polyglot solution: GraalVM — a Java VM and JDK based on HotSpot/OpenJDK, for running applications written in JavaScript, Python, Ruby, R, JVM-based languages like Java, Scala, Groovy, Kotlin, Clojure, and LLVM-based languages such as C and C++

1. compiling — `javax.tools.JavaCompiler` and more
   ```java
   JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
   OutputStream outStream = ; // null for System.out
   OutputStream errStream = ; // null for System.err
   int result = compiler.run(null, outStream, errStream, "-sourcepath", "src", "Test.java");
   ```

# JVM
<!-- TODO -->

1. JVM in `System`
   - `static void exit(int status)`
   - `static void gc()` — run garbage collector
   - `static SecurityManager getSecurityManager()`
   - `static Channel inheritedChannel()` — the channel inherited from the entity that created this Java virtual machine
   - `static void load(String filename)`
   - `static void loadLibrary(String libname)`
   - `static String mapLibraryName(String libname)`
   - `static void runFinalization()`
   - `static void setSecurityManager(SecurityManager s)`

1. security manager — `SecurityManager`
   - usage — no security manager installed by default, use by `System::setSecurityManager`, or CLI option `-Djava.security.manager`
   - permission checking — `SecurityException`
   - security policy, `java.security.Policy` — code sources to permission sets, `java.security.Permission`
     - protection domain — tbd
     - policy files — tbd
       - system property — `java.security.policy`, double equals sign (`==`) to exclude other standard policy files
   - Java Authentication and Authorization Service (JAAS) — `javax.security.auth.login.LoginContext`, tbd
     - login policies
   - tbd

## Reference

1. `java.lang.ref.Reference`
   ```java
   public abstract class Reference<T>
   ```
   - `T get()`
   - `void clear()`
   - `boolean enqueue()` -- Adds this reference object to the queue with which it is registered, if any, by the program or by the garbage collector
   - `boolean isEnqueued()`
   - notification of changes in an object's reachability -- by registering an appropriate reference object with a reference queue at the time the reference object is created
   - package private constructor for override
     - `Reference(T referent)`
     - `Reference(T referent, ReferenceQueue<? super T> queue)` -- registered with the given queue
   - subclasses
     - `SoftReference`
     - `WeakReference`
     - `PhantomReference`

1. strong reference

1. `java.lang.ref.SoftReference<T>` -- cleared at the discretion of the garbage collector in response to memory demand, guaranteed to have been cleared before `OutOfMemoryError`
   - use -- for implementing memory-sensitive caches

1. `java.lang.ref.WeakReference<T>` — weak reference objects, which do not prevent their referents from being made finalizable, finalized, and then reclaimed; next GC
   - use -- weak references are for implementing canonicalizing mappings that do not prevent their keys (or values) from being reclaimed

1. `java.lang.ref.PhantomReference<T>` -- phantom references are not automatically cleared by GC as they are enqueued. An object that is reachable via phantom references will remain so until all such references are cleared or themselves become unreachable
   - use -- for scheduling pre-mortem cleanup actions in a more flexible way than is possible with the Java finalization mechanism
   - `get()` -- always return `null` to ensure that a reclaimable object remains so

1. `java.lang.ref.ReferenceQueue<T>` -- to which registered reference objects are appended by GC, at the same time or at some later time after the appropriate reachability changes are detected
   - `Reference<? extends T> poll()` -- non-block
   - `Reference<? extends T> remove()` -- block
   - `Reference<? extends T> remove(long timeout)`

## Class Loading

1. class loading
   - class loading process — only classes needed for the execution loaded
     - load main program from disk or web
     - resolving — load fields or superclasses of another class type of the main program class
     - load classes required as the `main` method executes
   - class loaders
     - The bootstrap class loader — loads the system classes (typically, from the JAR file `rt.jar`, modules from JDK 9)
       - usually implemented in C — as an integral part of the virtual machine, no `ClassLoader` object involved, `String.class.getClassLoader()` is `null`
     - The extension class loader — loads “standard extensions” from the `jre/lib/ext` directory, the loader does not use the class path
       - no more `jre/lib/ext` from JDK 9 — The javac compiler and java launcher will exit if the `java.ext.dirs` system property is set, or if the `lib/ext` directory exists
       - the platform class loader — the extension class loader is retained from JDK 9 and is specified as the platform class loader, see `ClassLoader::getPlatformClassLoader`
     - The system class loader — loads the application classes
   - class loader hierarchy
     - cosmic root — the bootstrap class loader
     - parents first — load only if the parent has failed
     - default parent when constructing `ClassLoader` — system class loader
   - context class loader — each thread has a reference to a class loader
     - `Thread::getContextClassLoader`, `Thread::setContextClassLoader`
     - class loader inversion — the phenomenon when loading classes programmatically, classes to load are not visible to default class loaders, can be solved by using context class loader
   - class loaders as namespaces — in JVM, a class is determined by its full name **and** the class loader
     - useful for loading code from multiple sources, hot deployment etc.
   - bytecode verification — bytecode, except system classes, verified for safety before loaded into JVM
     - turn off on CLI — `-noverify` (or `-Xverify:none`)

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
