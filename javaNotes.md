# Docs

1. docs
   - [oracle JDK 1.8](https://docs.oracle.com/javase/8/docs/api/index.html)
   - [jshell](https://docs.oracle.com/javase/9/jshell/toc.htm)

1. [specification](http://docs.oracle.com/javase/specs)

1. [errata](http://horstmann.com/corejava/bugs10.html#CJ10V1)

1. official documentations can be [downloaded](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

# Miscellanea

1. vararg parameter — `...`
   - if only an array passed, then that array is used, without nesting

1. localization
   - resource bundles — Localized applications contain locale-specific information in resource bundles
   - localized messages — A message may contain placeholders: `{0}` , `{1}`

# CLI

1. `javac` — compile
   - auto compile dependencies and recompile when source file updated according to timestamps
   - wildcard
     ```shell
     javac Employee*.java
     ```
   - `-Xlint:term`
     - `-Xlint` or `-Xlint:all` — all checks
     - `-Xlint:deprecation` — Same as -deprecation , checks for deprecated methods
     - `-Xlint:fallthrough` — Checks for missing `break` statements in `switch` statements
     - `-Xlint:finally` — Warns about finally clauses that cannot complete normally
     - `-Xlint:none` — Carries out none of the checks
     - `-Xlint:path` — Checks that all directories on the class path and source path exist
     - `-Xlint:serial` — Warns about serializable classes without `serialVersionUID`
     - `-Xlint:unchecked` — Warns of unsafe conversions between generic and raw types

1. `java` — execute
   - class name is not stored in the args of `public static void main(String[] args)`
     ```shell
     java Message -g cruel world
     # args[0]: "-g"
     # args[1]: "cruel"
     # args[2]: "world"
     ```
   - `-cp` or `-classpass` — specify the class path
     ```shell
     java -classpath /home/user/classdir:.:/home/user/archives/archive.jar MyProg
     ```
   - compile and run, no `.class` file generated
     ```shell
     java ClassName.java
     ```
   - `-verbose` — watch class loading
   - `java -X` — a listing of all nonstandard options
     - `-Xprof` — profiling, support was removed in 10.0
     - `-XshowSettings:properties`, `-XshowSettings:locale`
   - enable and disable assertion — see [Assertion](#Assertion)
   - system properties — `-D`, `System::getProperty`, `System::getProperties`
     - log related — see [Logging](#Logging)
       - log configuration file location — `-Djava.util.logging.config.file=configFile`
     - see [`Properties`](#Legacy%20Collections)
   - jar -- `java -jar MyProgram.jar`

1. `javaw` -- `java` without a shell window

1. `javadoc` — generates HTML documentation from your source files
   - information source
     - Packages
     - Public classes and interfaces
     - Public and protected fields
     - Public and protected constructors and methods
   - `doc-files` directory for assets
   - syntax
     - `/** ... */`
     - tags `@`
       - `@param variable description`
       - `@return description`
       - `@throws class description`
       - more
     - HTML tags
       - use `{@code ... }` instead of `<code>...</code>` to cope with escaping of `<`
   - example
     ```java
     /**
      * Raises the salary of an employee.
      * @param byPercent the percentage by which to raise the salary (e.g. 10 means 10%)
      * @return the amount of the raise
      */
     public double raiseSalary(double byPercent) {
         double raise = salary * byPercent / 100;
         salary += raise;
         return raise;
     }
     ```
   - tbd

1. `javap` — print java class information
   - `-v` -- verbose
   - `-c` -- Disassemble the code
     - can be used to inspect if atomic

1. `jshell` — REPL from Java 9

1. `jconsole` — Java Monitoring and Management Console

1. `jmap` and `jhat` for heap dump and examining dump

## JAR

1. `jar` -- creates an archive for classes and resources, and can manipulate or restore individual classes or resources from an archive
   ```shell
   jar [OPTION...] [ [--release VERSION] [-C dir] files] ...
   ```
   - [docs](https://docs.oracle.com/javase/8/docs/technotes/guides/jar/)
   - compression -- ZIP
   - similar to `tar`
     ```shell
     jar cvf JARFileName File1 File2 ...
     ```
   - `.exe` wrapper -- Launch4J, IzPack, etc.
   - resources
     - resources finding -- delegates to class loader, which remembers how to locate the class, so it can then search for the associated resource in the same location
     - `URL Class::getResource(String name)`, `InputStream Class::getResourceAsStream(String name)`
     - resource name
       - absolute -- starts with `/`
       - relative -- `data/text/about.txt`

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
   - syntax
     - main section -- starts with `Manifest-Version`, applies to the whole JAR file
     - Subsequent entries -- starts with `Name`, can specify properties of named entities such as individual files, packages, or URLs
     - section delimiter -- blank lines
     - the file must end with a newline
   - edit manifest
     ```shell
     jar cfm JARFileName ManifestFileName ... # create
     jar ufm MyArchive.jar manifest-additions.mf # update
     ```
   - entry point
     - `-e` option
     - `Main-Class` in manifest
     - execution -- `java -jar MyProgram.jar`
   - sealing -- a package can have no more classes, `Sealed: boolean`, `false` by default
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

1. comments — `//` for inline and `/**/` for block
   - jsdoc

1. variable should be initialized or error

1. does not have operator overloading

# Fundamentals

## Data Types

### primitive types

1. integer types
   - types
     - `int`
     - `short` — 2 bytes
     - `long`
     - `byte`
   - number literals
     - `l` or `L` suffix for `long` type
     - `0x`, `0`, `0b` or `0B`
     - friendly underscores — `1_000_000` (or `0b1111_0100_0010_0100_0000` )
   - no `unsigned`

1. float point types
   - types
     - `float` — 4 bytes
     - `double`
   - number literals
     - `f` or `F` suffix for `float` type
     - `d`, `D` suffix or no suffix for double type
     - `e` for exponent
     - `p` for binary exponent — `0x1.0p-3` (2^-3^)
   - overflows and errors
     - `Double.POSITIVE_INFINITY` , `Double.NEGATIVE_INFINITY` , and `Double.NaN`
     - `Double.isNaN()`

1. `char` -- describes a code unit in the UTF-16 encoding
   - single quote
   - `\u0fff` — inside and outside quotes
     ```Java
     public static void main(String\u005B\u005D args) {}
     "\u0022+\u0022" // yielding ""+""
     // \u000A is a newline // syntax error
     // since \u000A is replaced with a newline when the program is read
     // Look inside c:\users // syntax error
     ```
     - Unicode escape sequences are processed before the code is parsed
   - `\b`, `\t`, `\n`, `\r`
   - code unit -- a 16-bit value
     - supplementary characters -- encoded as consecutive pairs of code units, each of the values in such an encoding pair falls into a range of 2048 unused values of the basic multilingual plane
     - surrogates area -- `U+D800` to `U+DBFF` for the first code unit, `U+DC00` to `U+DFFF` for the second code unit
   - usage
     - recommendation is not to use the `char` type unless you are actually manipulating UTF-16 code units
     - use `String`

1. `boolean`
   - cannot convert between integers and boolean values
   - `if (x = 0)` does not compile

#### primitive types conversation

1. legal conversation — types with less information to types with more information, but not vice versa

1. implicit conversation using operators — converted to a common type before the operation is carried out
   - `double` > `float` > `long` > `int`
   - for `int x`, `x += 3.5` is `x = (int)(x + 3.5)`

1. casts
   ```java
   double x = 9.997;
   int nx = (int) x;
   int nx2 = (int) Math.round(x); // Math.round() return long for double, int for float
   ```
   - truncate when out of range — `(byte) 300` is 44
   - cannot cast between `boolean` values and any numeric type

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
   - `Size` is actually a subclass of `Enum`, having exactly four instances (static field)
     - not possible to construct new objects, `==` can be used
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
   - arrays are objects, in Java Language Specification
     - `final int length`
     - `T[] clone()`
     - inherit from `Object`, except `clone()` method
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
   - the name of the file must match the name of the `public` class
   - can only have one `public` class in a source file
   - when run `java ClassName` in CLI, the `main` method in `ClassName` is run

1. `class`
   - `this`
     - `this.` is optional, local variables can shadow instance fields
     - implicit parameter `this` does not appear in the method declaration
     - If the first statement of a constructor has the form `this(...)` , then the constructor calls another constructor of the same class
   - initialization
     - explicit field initialization
       - assignment is carried out before the constructor executes
       - constant value or an expression
     - initialization block
       - can be `static`
       - runs after `super()` call, but before the rest of the constructor
       - legal to set fields defined later in the class
       - However, to avoid circular definitions, not legal to read from fields initialized later
   - constructors
     - same name as the class
     - `public` and must be called with `new`
     - fields not initialized in constructor, automatically set to a default zero
     - when a constructor is absent, a no-argument constructor is provided
     - call another constructor — see `this` above
   - when a constructor is called
     1. If the first line of the constructor calls a second constructor, then the second constructor runs before the body of this constructor.
     1. All data fields are initialized to their default values ( 0 , `false` , or `null` ).
     1. All field initializers and initialization blocks are executed, in the order in which they occur in the class declaration.
     1. The body of the constructor is executed.
   - encapsulation
     - `private` data filed with `public` accessor and mutator
     - If you need to return a reference to a mutable object, you should clone it first
   - destructor
     - Java does automatic garbage collection, does not support destructors
     - The `finalize` method will be called before the garbage collector sweeps away the object
       - do not rely on, cannot know when this method will be called
     - `Runtime.addShutdownHook`

1. access modifiers
   - `public` — can be used by any class
   - `private`
     - class-based — a method can access the private data of all objects of its class
   - `protected` — can be accessed by subclasses and within the same package
     - not recommendation for fields
     - in a subclass, `obj.protectedField` is OK when `obj` is of the same class, but not accessible when superclass
   - if not specified `public`, `private` or `protected`
     - can be accessed by all methods in the same package
     - fields would better be marked `private`

1. other modifiers
   - `final` fields must be initialized and cannot be modified, methods cannot be overloaded, classes cannot be inherited
     - if a class is declared `final`, only the methods, not the fields, are automatically `final`
     - can be used for parameters
     - declare constants
   - `static`
     - static methods can be invoked by object call, but not recommended
     - Static initialization occurs when the class is first loaded
     - get class from static method (`this.getClass()` will not work in static methods)
       ```java
       new Object(){}.getClass().getEnclosingClass();
       ```
   - `strictfp` — methods tagged with the `strictfp` keyword must use strict rules for floating-point computations that yield reproducible results

## Math

1. `java.lang.Math`
   - `Math.floorDiv()`
   - `Math.floorMod(x, y)` — `x - Math.floorDiv(x, y) * y`
     - compared to `x % y` — `x - x / y * y`
   - others

1. `java.lang.StrictMath` — guaranteeing identical results on all platforms

1. `java.math.BigInteger`
   ```java
   public class BigInteger
   extends Number
   implements Comparable<BigInteger>
   ```
   - constructor
     - `static BigInteger valueOf(long val)`
   - arithmetic
     - `BigInteger add(BigInteger other)`
     - `BigInteger subtract(BigInteger other)`
     - `BigInteger multiply(BigInteger other)`
     - `BigInteger divide(BigInteger other)`
     - `BigInteger mod(BigInteger other)`
   - comparaison
     - `int compareTo(BigInteger val)`
     - `boolean equals(Object x)`

1. `java.math.BigDecimal`

## Built-In Classes

1. inside `java.lang` package

1. `System`
   ```java
   public final class System extends Object
   ```
   - std
     - `static InputStream in`
     - `static PrintStream err`
     - `static PrintStream out`
     - `static Console console()`
     - `static void setErr(PrintStream err)`
     - `static void setIn(InputStream in)`
     - `static void setOut(PrintStream out)`
   - util
     - `static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)`
     - `static long currentTimeMillis()`
     - `static long nanoTime()`
     - `static int identityHashCode(Object x)`
   - system property
     - `static Properties getProperties()`
     - `static String getProperty(String key)`
     - `static String getProperty(String key, String def)`
     - `static void setProperties(Properties props)`
     - `static String setProperty(String key, String value)`
     - `static String clearProperty(String key)`
     - `static String lineSeparator()` -- equivalent to `System.getProperty("line.separator")`
       - see `File` for other separators
   - environment
     - `static Map<String,String> getenv()`
     - `static String getenv(String name)`
   - JVM
     - `static void exit(int status)`
     - `static void gc()` -- run garbage collector
     - `static SecurityManager getSecurityManager()`
     - `static Channel inheritedChannel()` -- the channel inherited from the entity that created this Java virtual machine
     - `static void load(String filename)`
     - `static void loadLibrary(String libname)`
     - `static String mapLibraryName(String libname)`
     - `static void runFinalization()`
     - `static void setSecurityManager(SecurityManager s)`

1. `SecurityManager` -- check permissions, like read / write on certain files

### String

1. `CharSequence` -- provides uniform, read-only access to many different kinds of char sequences
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
     - `int codePointCount(int startIndex, int endIndex)` — the number of code points
       ```java
       int cpCount = greeting.codePointCount(0, greeting.length());
       ```
   - substring or transform
     - `char charAt(int index)`, `int codePointAt(int index)`
     - `String substring(int beginIndex)` `String substring(int beginIndex, int endIndex)`
     - `String replace(CharSequence oldString, CharSequence newString)`
     - `String toLowerCase()` `String toUpperCase()`
     - `String trim()`
     - `String[] split(String regex)`  
       `String[] split(String regex, int limit)`
   - construct
     - `static String format(String format, Object... args)`
     - `static String join(CharSequence delimiter, CharSequence... elements)`
     - `String concat(String str)`
     - `new String(int[] codePoints, int offset, int count)`
   - comparaison
     - `int hashCode()`
       ```java
       int hash = 0;
       for (int i = 0; i < length(); i++)
           hash = 31 * hash + charAt(i);
       ```
     - `boolean equals(Object other)`, `boolean equalsIgnoreCase(String other)`
       - Do not use the `==` operator to test whether two strings are equal
       - only string literals are shared, not strings that are the result of operations like `+` or `substring`
     - `int compareTo(String other)` — Java version of `strcmp` in C
     - `int compareToIgnoreCase(String str)`
     - `boolean startsWith(String prefix)`, `boolean endsWith(String suffix)`
   - transverse
     - with index `i`
       ```java
       // incremental
       int cp = sentence.codePointAt(i);
       if (Character.isSupplementaryCodePoint(cp)) i += 2;
       else i++;
       // decreasing
       i—;
       if (Character.isSurrogate(sentence.charAt(i))) i—;
       int cp = sentence.codePointAt(i);
       ```
     - `int offsetByCodePoints()` — get at the i^th^ code point
     - `str.codePoints().toArray()`
   - indexing
     - `int indexOf(String str)`  
       `int indexOf(String str, int fromIndex)`  
       `int indexOf(int cp)`  
       `int indexOf(int cp, int fromIndex)`
     - `int lastIndexOf(String str)`  
       `int lastIndexOf(String str, int fromIndex)`  
       `int lastIndexOf(int cp)`  
       `int lastIndexOf(int cp, int fromIndex)`

1. `StringBuilder` — mutable, single thread `StringBuffer`, build a string from many small pieces
   ```java
   public final class StringBuilder extends Object
   implements Serializable, CharSequence
   ```
   - constructors
     - `StringBuilder()`
     - `StringBuilder(CharSequence seq)`
     - `StringBuilder(int capacity)`
     - `StringBuilder(String str)`
   - `int length()`
   - modify
     - `StringBuilder append(String str)`
     - `StringBuilder append(char c)`
     - `StringBuilder appendCodePoint(int cp)`
     - `void setCharAt(int i, char c)`
     - `StringBuilder insert(int offset, String str)`
     - `StringBuilder insert(int offset, char c)`
     - `StringBuilder delete(int startIndex, int endIndex)`
   - output
     - `String toString()`

1. `java.util.Formatter` -- tbd

### Object Wrappers

1. wrappers
   - `Integer` , `Long` , `Float` , `Double` , `Short` , `Byte` , `Character` , and `Boolean`
   - all extends `Number` except `Boolean`
   - immutable and `final`
   - autowrapping (autoboxing) — done by compiler, nothing related to VM
     - `list.add(3);` is automatically translated to `list.add(Integer.valueOf(3));`
     - the compiler translates `int n = list.get(i);` into `int n = list.get(i).intValue();`
     - `Integer n = 3; n++;` compiler automatically inserts instructions to unbox the object, increment the resulting value, and box it back.
   - fixed wrapping
     - `boolean , byte , char <= 127`
     - `short` , and `int` between -128 and 127 are wrapped into fixed objects
   - wrapper class references can be `null` — possible `NullPointerException`
   - conditional promotion — `Integer` to `Double`
     ```java
     Integer n = 1;
     Double x = 2.0;
     System.out.println(true ? n : x); // Prints 1.0
     ```
   - common methods
     - `static int compare(type x, type y)`

1. `Integer`
   ```java
   public final class Integer
   extends Number
   implements Comparable<Integer>
   ```
   - fields
     - `static int BYTES`
     - `static int MAX_VALUE`
     - `static int MIN_VALUE`
     - `static int SIZE`
     - `static Class<Integer> TYPE`
   - constructors
     - `Integer(int value)`
     - `Integer(String s)`
   - conversation
     - `int intValue()`
     - `static String toString(int i)`  
       `static String toString(int i, int radix)`
     - `static int parseInt(String s)`  
       `static int parseInt(String s, int radix)`
     - `static Integer valueOf(int i)`  
       `static Integer valueOf(String s)`  
       `static Integer valueOf(String s, int radix)`

# Control Flow

1. may not declare identically named variables in two nested blocks
   - in JS and C++ inner one shadows outer one

1. `switch`
   - A case label can be
     - A constant expression of type `char` , `byte` , `short` , or `int`
     - An enumerated constant
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
     - Starting with Java SE 7, a string literal, uses `hashCode()` behind scenes

1. labeled `break` and `continue`
   - for labeled blocks, can only jump out of a block, never into a block

1. `for (variable : collection) statement`
   - `collection` — an array or an object of a class that implements the `Iterable` interface
   - see [Collections](#Collections)

# Package

1. package
   - package name — reversely ordered domain
   - package availability — A class can use all classes from its own package and all public classes from other packages.
   - package at runtime
     - Locating classes in packages is an activity of the compiler. The only benefit of the `import` statement is convenience
     - The bytecodes in class files always use full package names to refer to other classes.

1. class importation
   - add the full package name in front of every class name
   - `import` statement
     ```java
     import java.time.*;
     import java.time.LocalDate;
     ```
     - some IDEs can expand package statements with `*` into specific imports
     - `*` notation to import a single package
       - cannot use `import java.*` or `import java.*.*` to import all packages with the java prefix
     - name conflict
       ```java
       import java.util.*;
       import java.sql.*;
       // compile-time error when use `Date` class
       ```
       - solve this problem by adding a specific import statement — `import java.util.Date;`
       - use the full package name if both needed

1. static imports — the importing of static methods and fields
   ```java
   import static java.lang.System.*;
   import static java.lang.System.out;
   ```

1. add to package
   ```java
   package com.horstmann.corejava;
   public class Employee
   {
       . . .
   }
   ```
   - put the name of the package at the top of your source file
   - Place source files into a subdirectory that matches the full package name.
     ```shell
     javac com/mycompany/PayrollApp.java
     java com.mycompany.PayrollApp
     ```
   - the classes in that source file belong to the default package if no `package` statement
   - disallow loading of user-defined classes whose package name starts with "`java.`"

1. class path
   ```
   /home/user/classdir:.:/home/user/archives/archive.jar
   c:\classdir;.;c:\archives\archive.jar
   ```
   - base directory for the package tree can be added
   - jar files can be added
   - jar file directory can be added
     ```
     /home/user/classdir:.:/home/user/archives/'*'
     c:\classdir;.;c:\archives\*
     ```
     - In UNIX, the `*` must be escaped to prevent shell expansion.
   - do not add runtime libary files
     - `rt.jar` and the other JAR files in the `jre/lib` and `jre/lib/ext` directories are always searched for classes
   - `javac` and `java`
     - The `javac` compiler always looks for files in the current directory
     - the `java` virtual machine launcher only looks into the class path
       - default class path is `.`
   - class search order
     - for `java`, runtime libary to the class path
     - for `javac`, `java.lang` to imports to current package

1. set class path
   - `-cp` or `-classpath` option
     ```shell
     java -classpath /home/user/classdir:.:/home/user/archives/archive.jar MyProg
     # java -classpath c:\classdir;.;c:\archives\archive.jar MyProg
     ```
   - the `CLASSPATH` environment variable

## Package Related Classes

1. `Package`
   ```java
   public class Package extends Object
   implements AnnotatedElement
   ```

1. `ClassLoader`
   ```java
   public abstract class ClassLoader extends Object
   ```
   - get `ClassLoader` — `Class::getClassLoader`
   - assertion
     - `void clearAssertionStatus()`
     - `void setClassAssertionStatus(String className, boolean enabled)`
     - `void setDefaultAssertionStatus(boolean enabled)`
     - `void setPackageAssertionStatus(String packageName, boolean enabled)`

# Inheritance

1. inheritance
   - `extends`
   - `super`
     - special keyword, cannot be assigned
   - `super()`
     - The call using `super` must be the first statement in the constructor for the subclass
     - If the subclass constructor does not call a superclass constructor explicitly, the no-argument `super()` is invoked
     - invoked before initializers
   - polymorphism
     - object variables are polymorphic — a variable of certain type can refer to this type or any subclass, but not superclass
       - `Object[] objects`
       - all arrays remember the element type with which they were created (`new`ed)
         ```java
         Manager[] managers = new Manager[10];
         Employee[] staff = managers; // OK
         staff[0] = new Employee("Harry Hacker", ...); // ArrayStoreException
         ```

1. dynamic binding
   - static binding for `private`, `static`, `final` methods or a constructor
     - no need to use static binding to avoid the overhead, JIT of the VM does the inlining optimization
     - rarely but if the virtual machine loads another subclass that overrides an inlined method? Then the optimizer must undo the inlining.
   - method call
     1. the virtual machine precomputes for each class a method table
        - method table — lists all method signatures and the actual methods to be called
     1. overriding resolution according to function signatures
        - return type is not a part of the signature (but is in JVM so bridge methods work)
        - when return another type, a bridge method is synthesized
        - avoid a more restrictive access privilege when overriding
     1. table lookup when methods is called, from actual type to superclasses to `Object`

1. casting
   - cast to more general, a subclass reference to a superclass variable — direct assign
   - cast to more specific, a superclass reference to a subclass variable — use the same syntax as primitive type cast, check at runtime
     - `ClassCastException` when cannot cast
     - use `instanceof` to check before casting
     - can cast only within an inheritance hierarchy
     - best to minimize the use of casts and the `instanceof` operator

1. abstract class
   - cannot be instantiated
     - but `SuperAbstractClass obj = new SubClass()` is OK
   - any class can be tagged `abstract`, but not vice versa
     - a class with one or more `abstract` methods must itself be declared `abstract`
     - abstract classes can have no abstract methods
     - abstract classes can have fields and concrete methods
   - when extending an abstract class,
     - leave some or all abstract methods unimplemented, resulting in an abstract subclass
     - or implement all abstract methods, the subclass being abstract or not

1. `Object` — the cosmic superclass
   - only the values of primitive types (numbers, characters, and boolean values) are not objects
   - `boolean equals(Object otherObject)` — determines whether two object references are identical
     - override
       ```java
       @override // error when not overriding but define a new method
       public boolean equals(Object otherObject)
       {
           // a quick test to see if the objects are identical
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
     - `Objects.equals(Object a, Object, b)` — guard against `null`, call `a.equals(b)` when both non-null
     - `Arrays.equals(type[] a, type[] b)` for arrays
     - When you define the `equals` method for a subclass, first call `super.equals(other)`
     - need to redefine `hashCode` also
   - `int hashCode()` — derived from the memory address
     - compatible with `equals()`
     - `int Objects.hashCode(Object obj)` — null-safe, 0 for `null`
     - `int Double.hashCode(double)` — etc., for primitive types
   - `String toString()` — the class name and the hash code of the object
     - called when string concatenation with `+`
     - in coordination with `getClass().getName()` when override
     - arrays will come up with something like `"[I@1a46e30"`, where `[I` denotes an array of integers <!—]]—>
   - `Class<?> getClass()`
   - `protected Object clone()`
   - concurrency related -- see after

# Interfaces, Lambdas and Inner Classes

## Interfaces

1. interface
   - methods and inner classes / interfaces
     - all methods are implicitly `abstract`, redundancy is discouraged
     - all methods are implicitly `public`, redundancy is discouraged
       - but needed when implementing
     - static methods are supported as of Java SE 8
       - need explicit access modifier
     - an interface method may not be declared with `protected` or package access, or with the modifiers `final`, `synchronized`, or `native`
     - inner classes are automatically static and public
   - constant fields
     - implicitly `public static final`, as methods are implicitly `public`
     - automatically inherits these constants when implementing
   - never have instance fields
   - `implements` keyword
     - can be generic — `class Employee implements Comparable<Employee>`
   - supports `instanceof`, `extend`
   - initialized when they are first accessed, typically by reading a field that is not a compile time constant

1. default methods
   - `default` implementation
     ```java
     public interface Comparable<T>
     {
         default int compareTo(T other) { return 0; }
         // By default, all elements are the same
     }
     ```
   - `default` method conflict resolving — interface vs superclass vs another interface
     - Superclasses win — can never make a default method that redefines one of the methods in the `Object` class
       - Some interfaces in the Java API redeclare `Object` methods in order to attach javadoc comments, like `Comparator`
       - redeclaring methods from the `Object` class do not make the methods abstract, lambdas can still be compatible
     - interface clash — if clashes, either `default` or not, the method must be overriden
     - choose one when interface clash
       ```java
       class Student implements Person, Named
       {
           public String getName() { return Person.super.getName(); }
       }
       ```

1. companion class
   - used to place static methods — it has been common to place static methods in companion classes, like `Collection` / `Collections` or `Path` / `Paths`
   - used to implement some or all of methods of an interface — such as `Collection` / `AbstractCollection` or `MouseListener` / `MouseAdapter`
   - With Java SE 8, this technique is obsolete, as the support of default methods and static methods

1. use of interface
   - callback — pass an object of a class implementing a callback interface, methods in the interface will be called when the event fires
   - tagging interface — `Cloneable`

### Common Interfaces

1. `Interface Comparable<T>`
   - `int compareTo(T o)`
     - used in `Arrays.sort()`, `Arrays.binarySearch()`
     - when use subtraction to return a result, make sure absolute value is at most `(Integer.MAX_VALUE - 1) / 2`
       - otherwise use `Integer.compare()`
     - strongly recommended (though not required) to comply with `equals()`
       - `BigDecimal` violates -- `new BigDecimal("1.0").equals(new BigDecimal("1.00"))` is `false` because the numbers differ in precision
     - make `x.compareTo(y)` compatible with `y.compareTo(x)` — when overriding a class which extends a class implementing `Comparable<T>`, start with
       ```java
       if (getClass() != other.getClass()) throw new ClassCastException();
       ```

1. `Interface java.util.Comparator<T>`
   - `int compare(T o1, T o2)`
   - predefined
     - `static <T extends Comparable<? super T>> Comparator<T> naturalOrder()`
     - `static <T extends Comparable<? super T>> Comparator<T> reverseOrder()`
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
     - `default <U extends Comparable<? super U>> Comparator<T> thenComparing(Function<? super T,? extends U> keyExtractor)`
     - `default <U> Comparator<T> thenComparing(Function<? super T,? extends U> keyExtractor, Comparator<? super U> keyComparator)`
     - `default Comparator<T> thenComparingType(ToTypeFunction<? super T> keyExtractor)`
       - `type` here is `int`, `double` or `long`
     - `default Comparator<T> reversed()`
   - comparing `null`
     - `static <T> Comparator<T> nullsFirst(Comparator<? super T> comparator)`
     - `static <T> Comparator<T> nullsLast(Comparator<? super T> comparator)`

1. `Interface Cloneable`
   - serves as a tag, a `CloneNotSupportedException` if an object requests cloning but does not implement that interface
   - make a class cloneable — implement this interface, redefine `clone` to be `public`
     - `clone()` in `Object` is protected, and does a shallow copy
     - use `(T) super.clone()` if `clone()` in `Object` is OK
   - Up to Java SE 1.4, the clone method always had return type `Object`, but now the correct return type can be specified

## Lambdas

1. closure
   - cannot mutate captured value
   - any captured variable in a lambda expression must be effectively final
     ```java
     for (int i = 1; i <= count; i++) {
         ActionListener listener = event -> {
             System.out.println(i + ": " + text);
             // Error: Cannot refer to changing i
         };
         new Timer(1000, listener).start();
     }
     ```
     - illegal to refer to a variable in a lambda expression that is mutated outside
   - illegal to declare a parameter or a local variable in the lambda that has the same name as a local variable
   - the same scope as a nested block
   - `this` is the same as what outside the lambda

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
     type inference without parentheses
     ```java
     ActionListener listener = event -> System.out.println("The time is " + new Date()");
     ```
   - return type is always inferred, cannot be specified

1. functional interface — an interface with a single abstract method, like `Comparator<T>`
   - conversion to a functional interface is the only function for lambdas
   - behind the scenes, methods like `Arrays::sort` receives an object of some class that implements the interface, lambda is executed when invoking the method of that interface
   - `@FunctionalInterface`
   - lambda expression holders (also function interface) — `java.util.function.Function<T, R>`, `java.util.function.BiFunction<T, U, R>`

1. method reference
   ```java
   object::instanceMethod
   this::instanceMethod
   super::instanceMethod // uses `this` as the target and invokes the superclass version of the given method
   Class::staticMethod
   Class::instanceMethod // implicit parameter become the first parameter
   Class::new // constructor reference
   ```
   - use where lambdas are used
   - turned into instances of functional interfaces like lambdas
   - `int[]::new`
     - `new T[n]` is illegal, so libary designers use this syntax to mitigate
       ```java
       Object[] people = stream.toArray();
       // vs
       Person[] people = stream.toArray(Person[]::new);
       ```

### Common Functional Interfaces

1. `java.util.function` package, all `@FunctionalInterface`

1. `java.util.function.Function<T, R>`
   - `R apply(T t)`
   - `static <T> Function<T,T> identity()`
   - chaining
     - `default <V> Function<T,V> andThen(Function<? super R,? extends V> after)`
     - `default <V> Function<V,R> compose(Function<? super V,? extends T> before)`
   - variants
     - `java.util.function.DoubleFunction<R>` -- `R apply(double value)`
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
     - `java.util.function.BiFunction<T,U,R>` -- `R apply(T t, U u)`
     - `java.util.function.ToDoubleBiFunction<T,U>`
     - `java.util.function.ToIntBiFunction<T,U>`
     - `java.util.function.ToLongBiFunction<T,U>`

1. operator -- `Function` with type parameters of the same type
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
     - `java.util.function.DoubleBinaryOperator` -- `double applyAsDouble(double left, double right)`
     - `java.util.function.IntBinaryOperator`
     - `java.util.function.LongBinaryOperator`

1. `java.util.function.Supplier<T>`
   - `T get()`
   - variants
     - `java.util.function.BooleanSupplier` -- `boolean getAsBoolean()`
     - `java.util.function.DoubleSupplier`
     - `java.util.function.IntSupplier`
     - `java.util.function.LongSupplier`

1. `java.util.function.Consumer<T>`
   - `void accept(T t)`
   - `default Consumer<T> andThen(Consumer<? super T> after)` — chaining
     ```java
     return (T t) -> { accept(t); after.accept(t); }; // default implementation
     ```
   - variants
     - `java.util.function.DoubleConsumer` -- `void accept(double value)`
     - `java.util.function.IntConsumer`
     - `java.util.function.LongConsumer`
   - variants with two parameters
     - `java.util.function.BiConsumer<T, U>` -- `void accept(T t, U u)`
     - `java.util.function.ObjDoubleConsumer<T>`
     - `java.util.function.ObjIntConsumer<T>`
     - `java.util.function.ObjLongConsumer<T>`

1. `java.util.function.Predicate<T>`
   - `default Predicate<T> and(Predicate<? super T> other)`
   - `static <T> Predicate<T> isEqual(Object targetRef)`
   - `default Predicate<T> negate()`
   - `default Predicate<T> or(Predicate<? super T> other)`
   - `boolean test(T t)`
   - variants
     - `java.util.function.DoublePredicate`
     - `java.util.function.IntPredicate`
     - `java.util.function.LongPredicate`
     - `java.util.function.BiPredicate<T,U>`

## Inner Class

1. inner class
   - implicit reference — can access the data from the scope in which they are defined
     - also explicit reference — outer class can be explicitly referred to as `OuterClass.this`
     - constructors behind the scenes
       - The compiler modifies all inner class constructors, adding a parameter for the outer class reference
       - when inner class is being constructed, the compiler passes the `this` reference of outer class
   - constructing inner classes
     - inside outer class — `this.new` or alternatively `new`
     - outside outer class — `outerObj.new`
   - access control — can be hidden from other classes in the same package
     - Only inner classes can be private. Regular classes always have either package or public visibility
   - refer to inner class outside the outer class — `OuterClass.InnerClass`
   - enums are static inner classes

1. inner class limits
   - static fields must be `final`
   - cannot have static methods

1. inner class at runtime
   - inner classes are translated into regular class files with `$` (dollar signs) delimiting outer and inner class names
   - inner class has a `final` `this$0` reference to outer class generated by compiler
   - for private inner classes
     ```java
     private TalkingClock$TimePrinter(TalkingClock);
     TalkingClock$TimePrinter(TalkingClock, TalkingClock$1); // the last parameter is synthesized solely to distinguish this constructor from others
     new TalkingClock$TimePrinter(this, null); // actual call in outer class
     ```
     - the compiler produces a package-visible class with a private constructor
     - and a second package-visible constructor that calls the private one
   - access to outer class mechanism
     - outer class generates a static `access$0blah(OuterClass outer)` method for inner class to access
     - the generated name is not legal, but can be exploited
   - the virtual machine does not have any special knowledge about them
   - use `javap -p` to verify

1. local inner class — class locally in a single method
   - never declared with an access specifier
   - scope is always restricted to the block being declared
   - can access effectively final local variables
     - behind the scenes — stored as a final field of inner class, and spawned to constructor for initialization
   - access mutable data — use an array of length 1
     - a prototype version of the compiler automatically made this transformation for all local variables that were modified in the inner class
     - later abandoned due to concurrent updates can lead to race conditions
   - anonymous inner subclass
     ```java
     new SuperType(construction parameters) {
         // inner class methods and data
     }
     ```
     - `SuperType` can be an interface, the inner class implements that interface
     - `SuperType` can also be a class, the inner class extends that class
       - take care that `equals()` with `SuperType` will fail
     - anonymity cannot have constructors — the name of a constructor must be the same as the name of a class
     - use case -- double brace initialization for `ArrayList`
       ```java
       invite(new ArrayList<String>() {{ add("Harry"); add("Tony"); }});
       ```
     - use case -- get the class from static methods
       ```java
       new Object(){}.getClass().getEnclosingClass();
       ```

1. static inner class
   - only inner classes can be declared static
   - inner interfaces are implicitly static
   - do not have a outer class reference
   - can be used for holder for a method to return multiple values
   - must be declared static if needed in a outer class static method
   - can have static fields and methods
   - inner classes that are declared inside an interface are automatically static and public

# Reflection

1. runtime type identification — used by VM for method resolution
   - `Class getClass()` in `Object`
   - `static Class<?> forName(String className)` in `Class`
   - `T.class` if `T` is any Java type (or the `void` keyword)
   - use `Class<T>` as a parameter for type match — call with a class and the type parameter `T` will be matched

1. `Class`
   ```java
   public final class Class<T> extends Object
   implements Serializable, GenericDeclaration, Type, AnnotatedElement
   ```
   - reflection information
     - `String getName()`
     - `String getTypeName()`
     - `String toString()`
     - `Class<?> getComponentType()` — type of elements in an array, `null` if `this` is not an array
     - `ClassLoader getClassLoader()`
     - `T[] getEnumConstants()`
     - `Class<? super T> getSuperclass()`
   - get new object of this type
     - `T newInstance()`
     - `T cast(Object obj) throws ClassCastException`
   - get method reflection — from this class and superclasses, declared only for this class
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
   - inner class
     - `Class<?>[] getClasses()`
     - `Class<?> getEnclosingClass()`
   - generics
     - `Type[] getGenericInterfaces()`
     - `Type getGenericSuperclass()`
     - `TypeVariable<Class<T>>[] getTypeParameters()`
   - resources
     - `URL getResource(String name)`
     - `InputStream getResourceAsStream(String name)`

1. `java.lang.reflect.Type` — implemented / extended by `Class<T>`, `GenericArrayType`, `ParameterizedType`, `TypeVariable<D>`, `WildcardType`
   ```java
   public Interface Type
   ```
   - `default String getTypeName()`
   - implementation classes / sub-interfaces have get methods returning information about generics

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

## Array

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

## Proxy

1. proxies
   - create, at runtime, new classes that implement a given set of interfaces
   - proxy objects belong to a class that is defined at runtime with an undefined name, and has a name such as `$Proxy0`
   - all proxies are final singleton and extends `Proxy`
   - all proxy classes override the `toString()` , `equals()` , and `hashCode()`, and interface methods with `InvocationHandler::invoke`
     - other methods in `Object` are untouched
   - only one proxy class for a particular class loader and ordered set of interfaces
   - package
     - If all interfaces that the proxy class implements are public, no package
     - all non-public interfaces must belong to the same package, and the proxy class will also belong to that package

1. `Interface java.lang.reflect.InvocationHandler`
   - `public Object invoke(Object proxy, Method method, Object[] args) throws Throwable`
   - invocation handler — any class that implements `InvocationHandler`
   - additional data is stored in the invocation handler

1. `java.lang.reflect.Proxy`
   ```java
   public class Proxy extends Object
   implements Serializable
   ```
   - constructors
     - constructor — protected
     - `static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)`
        - initializes `protected InvocationHandler h`
   - `static InvocationHandler getInvocationHandler(Object proxy)`
   - `static boolean isProxyClass(Class<?> cl)`
   - `static Class<?> getProxyClass(ClassLoader loader, Class<?>... interfaces)`

1. use example
   ```java
   public class ProxyTest {
       public static void main(String... args) {
           Object[] elems = new Object[1000];
           for (int i = elems.length - 1; i >= 0; —i) {
               elems[i] = Proxy.newProxyInstance(null, new Class[]{ Comparable.class }, new TraceHandler(Integer.valueOf(i)));
           }
           Arrays.binarySearch(elems, Integer.valueOf(new Random().nextInt(elements.length) + 1));
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

# IO

## Console

1. `java.io.Console` -- synchronized
   ```java
   public final class Console extends Object
   implements Flushable
   ```
   - get instance
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

1. `java.util.Scanner` -- not synchronized
   ```java
   public final class Scanner extends Object
   implements Iterator<String>, Closeable
   ```
   - constructors
     - `Scanner(File source)`
     - `Scanner(File source, String charsetName)`
     - `Scanner(InputStream source)`
       - `System.in` for stdin
     - `Scanner(InputStream source, String charsetName)`
     - `Scanner(Path source)`
     - `Scanner(Path source, String charsetName)`
     - `Scanner(String source)`
     - more
   - read
     - `String nextLine()`
     - `String next()`
     - `int nextInt()`
     - `double nextDouble()`
   - test
     - `boolean hasNext()`
     - `boolean hasNextInt()`
     - `boolean hasNextDouble()`
   - more

1. `BufferedReader` -- synchronized

1. `System.out`, `static PrintStream`
   - `print()`
   - `println()`
   - `PrintStream printf(String format, Object... args)`
     - [formats](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#syntax)

## Basic IO Stream

1. IO streams
   - byte oriented -- `InputStream`, `OutputStream`
     - deal with bytes -- `FilterInputStream`, `FilterOutputStream` and their derivatives
     - buffer -- use `BufferedInputStream` and `BufferedOutputStream` as an intermediate stream
   - based on two-byte `char` values (UTF-16 codepoints) -- `Reader`, `Writer`, can be converted from byte streams
   - usage -- combination, filter streams as wrappers
     ```java
     DataInputStream din = new DataInputStream(
         new BufferedInputStream(
             new FileInputStream("employee.dat")));
     ```

1. IO interfaces
   - `java.io.Closeable` -- idempotent variant with `IOException` compared to `AutoCloseable` with `Exception`: no effect if already closed, whereas `AutoCloseable::close` may have side effects
     ```java
     public interface Closeable
     extends AutoCloseable
     ```
   - `java.io.Flushable` -- write any buffered output to the underlying stream
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
   - `Appendable` -- to which char sequences and values can be appended, must be implemented by any class whose instances are intended to receive formatted output from a `java.util.Formatter`
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
     - `int available()` -- an estimate of the number of bytes that can be read (or skipped over) without blocking
     - `abstract int read()` -- block if necessary, read next byte (0 ~ 255), `-1` if at end, used by some other methods so only one method to implementing when inheriting  
       `int read(byte[] b)`  
       `int read(byte[] b, int off, int len)` -- reads up to `len` bytes of data from the offset into byte buffer `b`
     - `long skip(long n)` -- returns the actual number of bytes skipped
     - `void close()`
   - mark -- the stream somehow remembers all the bytes read after the call to `mark` and stands ready to supply those same bytes again if and whenever the method `reset` is called, as long as within `readlimit`
     - `boolean markSupported()`
     - `void mark(int readlimit)`
     - `void reset()`

1. `java.io.OutputStream`
   ```java
   public abstract class OutputStream extends Object
   implements Closeable, Flushable
   ```
   - `abstract void write(int b)` -- block if necessary  
     `void write(byte[] b)`  
     `void write(byte[] b, int off, int len)`
   - `void flush()`
   - `void close()` -- automatically `flush()` before close

1. `java.io.Reader` -- see `InputStream`
   ```java
   public abstract class Reader extends Object
   implements Readable, Closeable
   ```
   - lifecycle
     - `boolean ready()`
     - `abstract int read(char[] cbuf, int off, int len)` -- 0 ~ 65535 or -1  
       `int read()`  
       `int read(char[] cbuf)`  
       `int read(CharBuffer target)`
     - `long skip(long n)`
     - `abstract void close()`
   - mark
     - `boolean markSupported()`
     - `void mark(int readAheadLimit)`
     - `void reset()`

1. `java.io.Writer` -- see `OutputStream`
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

1. convert stream to reader / writer
   - `java.io.InputStreamReader`
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

1. filter stream -- contains some other stream, which it uses as its basic source / sink of data, possibly transforming the data along the way or providing additional functionality
   - `java.io.FilterInputStream`
     ```java
     public class FilterInputStream
     extends InputStream
     ```
     - constructor -- `protected FilterInputStream(InputStream in)`
   - `java.io.FilterOutputStream`
     ```java
     public class FilterOutputStream
     extends OutputStream
     ```
     - constructor -- `FilterOutputStream(OutputStream out)`
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

1. buffer -- the ability to buffer the input and to support the mark and reset methods
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

1. data input -- conversation between bytes from a binary stream and Java data types
   - [modified UTF-8](https://docs.oracle.com/javase/8/docs/api/java/io/DataInput.html#modified-utf-8) -- Hoffman tree
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
     - `int readUnsignedByte()` -- 0 ~ 255
     - `int readUnsignedShort()` -- 0 ~ 65535
     - `String readUTF()` -- modified UTF-8 encoded string
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
     - constructor -- `DataInputStream(InputStream in)`
   - `java.io.DataOutputStream`
     ```java
     public class DataOutputStream
     extends FilterOutputStream
     implements DataOutput
     ```
     - constructor -- `DataOutputStream(OutputStream out)`

1. peek -- push back stream
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

## Files

1. `java.io.File` -- an abstract representation of file and directory pathnames
   ```java
   public class File extends Object
   implements Serializable, Comparable<File>
   ```
   - separators -- `System.getProperty("file.separator")`, `System.getProperty("path.separator")`
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
     - `int compareTo(File pathname)` -- lexicographically
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
     - `URI toURI()`
   - space -- the partition named by this abstract pathname
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
   - `java.io.FileDescriptor` -- used in file streams
      ```java
      public final class FileDescriptor extends Object
      ``

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
        - `protected void finalize()`
        - `FileChannel getChannel()` -- ensures that the close method of this file input stream is called when there are no more references to it
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

1. char based file streams
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

## TODO

1. `PrintWriter`
   ```java
   public class PrintWriter
   extends Writer
   ```
   - constructors
     - `PrintWriter(String fileName)`
     - `PrintWriter(String fileName, String csn)`
     - more
   - print
     - `print()`
     - `println()`
     - `PrintWriter printf(String format, Object... args)`

1. `java.nio.file.Paths`
   ```java
   public final class Paths extends Object
   ```
   - `static Path get(String first, String... more)` — Converts a path string, or a sequence of strings that when joined form a path string, to a Path.

# Utils

## Time

1. `System`
   - `static long nanoTime()`
   - `static long currentTimeMillis()`

1. `java.time.LocalDate` — A date without a time-zone in the ISO-8601 calendar system
   ```java
   public final class LocalDate extends Object
   implements Temporal, TemporalAdjuster, ChronoLocalDate, Serializable
   ```

1. `java.util.Date` — represents a specific instant in time, with millisecond precision
   ```java
   public class Date extends Object
   implements Serializable, Cloneable, Comparable<Date>
   ```

## Arrays

1. `java.util.Arrays`
   - conversation
     - `static String toString(type[] a)`
     - `static String deepToString(Object[] a)`
     - `static <T> List<T> asList(T... a)` — `return new ArrayList<>(a);`
       - `ArrayList` here is `Arrays$ArrayList` which implements `List`, a view on the original array with fixed size
       - if real `ArrayList` is desired — use this `Arrays$ArrayList` to construct
     - stream methods
   - `static int binarySearch(type[] a, type v)`  
     `static int binarySearch(type[] a, int start, int end, type v)`
     - `Object[]` actually needs to be `Comparable[]`
   - initialization and modifications
     - `static void fill(type[] a, type v)`
     - `static type[] copyOf(type[] original, int newLength)`
     - `static type[] copyOfRange(type[] a, int start, int end)`
     - `System::arraycopy`
     - `static void setAll(double[] array, IntToDoubleFunction generator)` -- generator takes indices as parameter  
       `static void setAll(int[] array, IntUnaryOperator generator)`  
       `static void setAll(long[] array, IntToLongFunction generator)`  
       `static <T> void setAll(T[] array, IntFunction<? extends T> generator)`
     - `parallelSetAll` -- parallel version of `setAll`
     - `parallelPrefix` -- prefix operators, like prefix sum
   - `Object`
     - `static boolean equals(type[] a, type[] b)`
     - `static int hashCode(Object[] a)`
     - `static boolean deepEquals(Object[] a1, Object[] a2)`
     - `static int deepHashCode(Object[] a)`
     - `static String deepToString(Object[] a)`
   - sort
     - `static void sort(type[] a)`  
       `static void sort(type[] a, int fromIndex, int toIndex)`
       - `Object[]` actually needs to be `Comparable[]`
       - uses `sort()` of `java.util.DualPivotQuickSort`
       - `java.util.ComparableTimSort::sort` for `Object[]`
     - `static void parallelSort(type[] a)`  
       `static void parallelSort(type[] a, int fromIndex, int toIndex)` (no `Object[]`)  
       `static <T extends Comparable<? super T>> void parallelSort(T[] a, int fromIndex, int toIndex)`
       - granularity — `private static final int MIN_ARRAY_SORT_GRAN = 1 << 13;`
       - sequential sort (as `Arrays.sort()`)
         ```java
         if (n <= MIN_ARRAY_SORT_GRAN || (p = ForkJoinPool.getCommonPoolParallelism()) == 1)
         ```
       - else parallel sort — uses threading (each thread gets a chunk of the list and sorts it in parallel. Later these sorted chunks are merged into a result)
       - `java.util.DualPivotQuickSort::sort` for primitive type arrays
       - `java.util.TimSort::sort` for `T[]`
     - `static <T> void sort(T[] a, Comparator<? super T> c)`  
       `static <T> void sort(T[] a, int fromIndex, int toIndex, Comparator<? super T> c)`
     - `static <T> void parallelSort(T[] a, Comparator<? super T> cmp)`  
       `static <T> void parallelSort(T[] a, int fromIndex, int toIndex, Comparator<? super T> cmp)`

## Event Handling

1. `java.util.EventListener` -- A tagging interface that all event listener interfaces must extend

1. `java.util.EventListenerProxy` -- An abstract wrapper class for an EventListener class
   ```java
   public abstract class EventListenerProxy<T extends EventListener> extends Object
   implements EventListener
   ```

1. `java.util.EventObject` -- The root class from which all event state objects shall be derived
   ```java
   public class EventObject extends Object
   implements Serializable
   ```

## Collections and Maps

1. concurrent collections -- see [Thread-Safe Collections](#Thread-Safe-Collections), and `SynchronousQueue`

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

1. `java.util.Spliterator` — both sequential and parallel data processing, the parallel analogue of an `Iterator`

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
   - conversation
     - `<T> T[] toArray(T[] a)` -- no new array created if `a` is of the correct size
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
   - `static boolean disjoint(Collection<?> c1, Collection<?> c2)` -- `true` if the two specified collections have no elements in common
   - `static int frequency(Collection<?> c, Object o)`
   - `static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)`  
     `static <T> T max(Collection<? extends T> coll, Comparator<? super T> comp)`  
     `static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll)`  
     `static <T> T min(Collection<? extends T> coll, Comparator<? super T> comp)`
   - `static <T> Comparator<T> reverseOrder()`  
     `static <T> Comparator<T> reverseOrder(Comparator<T> cmp)`
     - called by `Comparator::reverseOrder`
   - list related
     - find
       - `static <T> int binarySearch(List<? extends Comparable<? super T>> list, T key)` -- `insertionPoint = -i - 1` if no matching  
         `static <T> int binarySearch(List<? extends T> list, T key, Comparator<? super T> c)`
         - checks `RandomAccess` or `BINARYSEARCH_THRESHOLD` to determine whether `indexedBinarySearch` or `iteratorBinarySearch`
       - `static int indexOfSubList(List<?> source, List<?> target)`
       - `static int lastIndexOfSubList(List<?> source, List<?> target)`
     - modify
       - `static <T> void copy(List<? super T> dest, List<? extends T> src)`
       - `static <T> void fill(List<? super T> list, T obj)`
       - `static <T> boolean replaceAll(List<T> list, T oldVal, T newVal)`
       - `static void reverse(List<?> list)`
       - `static void rotate(List<?> list, int distance)`
       - `static void shuffle(List<?> list)` -- checks whether `RandomAccess` otherwise `toArray()`  
         `static void shuffle(List<?> list, Random rnd)`
       - `static <T extends Comparable<? super T>> void sort(List<T> list)`
       - `static <T> void sort(List<T> list, Comparator<? super T> c)` -- uses `List::sort`
       - `static void swap(List<?> list, int i, int j)`

### List

1. `java.util.RandomAccess` — Marker interface used by `List` implementations to indicate that they support fast (generally constant time) random access.
   - no interface body

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

1. `java.util.ListIterator`
   ```java
   public interface ListIterator<E> extends Iterator<E>
   ```
   - `void add(E e)`
   - `boolean hasPrevious()`
   - `int nextIndex()`
   - `E previous()`
   - `int previousIndex()`
   - `void set(E e)`

1. `java.util.ArrayList`
   ```java
   public class ArrayList<E>
   extends AbstractList<E>
   implements List<E>, RandomAccess, Cloneable, Serializable
   ```
   - `private static final int DEFAULT_CAPACITY = 10`
   - constructors
     - `ArrayList()` — Constructs an empty list with an initial capacity of ten.
     - `ArrayList(Collection<? extends E> c)`
     - `ArrayList(int initialCapacity)`
     - anonymous `ArrayList` — double brace initialization, actually a inner subclass
       ```java
       invite(new ArrayList<String>() {{ add("Harry"); add("Tony"); }});
       ```
   - capacity
     - `void ensureCapacity(int minCapacity)`
     - `void trimToSize()`

1. `java.util.LinkedList`
   ```java
   public class LinkedList<E>
   extends AbstractSequentialList<E>
   implements List<E>, Deque<E>, Cloneable, Serializable
   ```
   - use with `ListIterator`

### Queue

1. `java.util.Queue` -- skeletal implementations of some `Queue` operations
   ```java
   public interface Queue<E> extends Collection<E>
   ```
   - `boolean add(E e)` — Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions, returning true upon success and throwing an IllegalStateException if no space is currently available.
   - `E element()` — Retrieves, but does not remove, the head of this queue.
   - `boolean offer(E e)` — Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions.
   - `E peek()` — Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.
   - `E poll()` — Retrieves and removes the head of this queue, or returns null if this queue is empty.
   - `E remove()` — Retrieves and removes the head of this queue.
   - `java.util.AbstractQueue`
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

1. `java.util.ArrayDeque`
   ```java
   public class ArrayDeque<E> extends AbstractCollection<E>
   implements Deque<E>, Cloneable, Serializable
   ```
   - underlying implementation -- circular array
   - capacity is 16 initially

1. `java.util.PriorityQueue`
   ```java
   public class PriorityQueue<E> extends AbstractQueue<E>
   implements Serializable
   ```
   - `private static final int DEFAULT_INITIAL_CAPACITY = 11`

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
   - `private transient HashMap<E,Object> map`
   - `private static final Object PRESENT = new Object()` — dummy value

1. `java.util.TreeSet` — red-black tree
   ```java
   public class TreeSet<E> extends AbstractSet<E>
   implements NavigableSet<E>, Cloneable, Serializable
   ```
   - `private transient NavigableMap<E,Object> m` -- initialized with `TreeMap` in most cases
   - `private static final Object PRESENT = new Object()` — dummy value

1. `java.util.EnumSet` — for use with enum types
   ```java
   public abstract class EnumSet<E extends Enum<E>>
   extends AbstractSet<E>
   implements Cloneable, Serializable
   ```
   - underlying data — represented internally as bit vectors
   - usage — a high-quality, typesafe alternative to traditional int-based "bit flags"
   - underlying implementation — `RegularEnumSet`, `JumboEnumSet`, non-public in `java.util`
     - helper class — the abstract class itself acts as a static helper

1. `java.util.LinkedHashSet` — ordered `HashSet` with underlying linked list
   ```java
   public class LinkedHashSet<E> extends HashSet<E>
   implements Set<E>, Cloneable, Serializable
   ```

1. set from map -- `Collections::newSetFromMap` (for maps without corresponding sets, like `WeakHashMap` but not `HashMap`)

### Maps

1. `java.util.Map`
   ```java
   public interface Map<K,V>
   ```
   - modify
     - `void clear()`
     - `V remove(Object key)` — returns the previous value or `null`
     - `default boolean remove(Object key, Object value)`
     - `default V replace(K key, V value)`
     - `default boolean replace(K key, V oldValue, V newValue)`
     - `default void replaceAll(BiFunction<? super K,? super V,? extends V> function)`
     - `V put(K key, V value)` — returns as `remove` method
     - `void putAll(Map<? extends K,? extends V> m)`
     - `default V putIfAbsent(K key, V value)` — `null` value is also absent
     - `default V compute(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`
     - `default V computeIfAbsent(K key, Function<? super K,? extends V> mappingFunction)` — `null` value is also absent
     - `default V computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`
     - `default V merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFunction)`
       ```java
       V newValue = (oldValue == null) ? value : remappingFunction.apply(oldValue, value);
       ```
       - example
         ```java
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

1. `java.util.NavigableMap` -- refer to `NavigableSet`
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
     - `static final int MIN_TREEIFY_CAPACITY = 64`
   - `static class Node<K,V> implements Map.Entry<K,V>`

1. `java.util.TreeMap` -- red-black tree
   ```java
   public class TreeMap<K,V> extends AbstractMap<K,V>
   implements NavigableMap<K,V>, Cloneable, Serializable
   ```
   - `Map.Entry` returned by methods in this class and its views represent snapshots of mappings at the time they were produced

1. `java.util.EnumMap` -- for use with enum types
   ```java
   public class EnumMap<K extends Enum<K>,V>
   extends AbstractMap<K,V>
   implements Serializable, Cloneable
   ```
   - underlying data -- represented internally as arrays

1. `java.util.LinkedHashMap` — ordered `HashMap` with underlying linked list
   ```java
   public class LinkedHashMap<K,V> extends HashMap<K,V>
   implements Map<K,V>
   ```
   - `LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)`
     - `final boolean accessOrder` -- `true` for access order, `false` for insertion order
   - insertion order -- the order is not affected if a key is re-inserted
   - access order -- get methods and modify methods make corresponding entries place at last
     - `Map::replace` results an access only when the value is replaced
   - `protected boolean removeEldestEntry(Map.Entry<K,V> eldest)` -- invoked by `put` and `putAll` after inserting a new entry into the map, returns `true` if this map should remove its eldest entry

1. `java.util.WeakHashMap`
   ```java
   public class WeakHashMap<K,V> extends AbstractMap<K,V>
   implements Map<K,V>
   ```
   - not count for gc -- the presence of a mapping for a given key will not prevent the key from being discarded by the garbage collector
     - entry auto removal -- an entry is automatically removed when its key is no longer in ordinary use
       - `WeakHashMap` periodically checks reclaimed `WeakReference` queue, and removes associated entry
     - `WeakReference` queue -- objects reachable only by a `WeakReference` will not only be reclaimed by gc, but also be queued
   - underlying implementation -- `key` is wrapped with `WeakReference`
   - for values with strong reference to the keys -- prevent keys from gc, can be alleviated by wrapping values with `new WeakReference(value)`

1. `java.util.IdentityHashMap` — `HashMap` with keys (and values) that are compared by `==`, not `equals`
   ```java
   public class IdentityHashMap<K,V> extends AbstractMap<K,V>
   implements Map<K,V>, Serializable, Cloneable
   ```
   - constant-time performance for the basic operations (`get` and `put`) -- assuming the system identity hash function (`System.identityHashCode(Object)`) disperses elements properly among the buckets
   - rehashing may be fairly expensive -- initialize with large expected capacity

### Views and Wrappers

1. `Map::keySet` etc.

1. `Arrays::asList`

1. `java.util.Collections`
   - one for n wrapper -- `static <T> List<T> nCopies(int n, T o)`
     - returns an immutable list consisting of n copies of the specified object, `o` is stored only once
   - stack view -- `static <T> Queue<T> asLifoQueue(Deque<T> deque)`
   - set view from map, see [Set](#Set) -- `static <E> Set<E> newSetFromMap(Map<E,Boolean> map)`
   - wrappers containing only one element -- immutable, instance of inner class in `Collections`, containing only one element
     - `static <T> Set<T> singleton(T o)`
     - `static <T> List<T> singletonList(T o)`
     - `static <K,V> Map<K,V> singletonMap(K key, V value)`
   - empty wrapper -- immutable, instance of inner class in `Collections`, singleton
     - `static <T> Iterator<T> emptyIterator()`
     - `static <T> List<T> emptyList()`
     - `static <T> ListIterator<T> emptyListIterator()`
     - `static <K,V> Map<K,V> emptyMap()`
     - `static <K,V> NavigableMap<K,V> emptyNavigableMap()`
     - `static <E> NavigableSet<E> emptyNavigableSet()`
     - `static <T> Set<T> emptySet()`
     - `static <K,V> SortedMap<K,V> emptySortedMap()`
     - `static <E> SortedSet<E> emptySortedSet()`
   - unmodifiable view -- `UnsupportedOperationException` when try modifying, instance of inner class in `Collections`
     - `static <T> Collection<T> unmodifiableCollection(Collection<? extends T> c)`
     - `static <T> List<T> unmodifiableList(List<? extends T> list)`
     - `static <K,V> Map<K,V> unmodifiableMap(Map<? extends K,? extends V> m)`
     - `static <K,V> NavigableMap<K,V> unmodifiableNavigableMap(NavigableMap<K,? extends V> m)`
     - `static <T> NavigableSet<T> unmodifiableNavigableSet(NavigableSet<T> s)`
     - `static <T> Set<T> unmodifiableSet(Set<? extends T> s)`
     - `static <K,V> SortedMap<K,V> unmodifiableSortedMap(SortedMap<K,? extends V> m)`
     - `static <T> SortedSet<T> unmodifiableSortedSet(SortedSet<T> s)`
   - synchronized view -- synchronized with mutex, instance of inner class in `Collections`
     - `static <T> Collection<T> synchronizedCollection(Collection<T> c)`
     - `static <T> List<T> synchronizedList(List<T> list)`
     - `static <K,V> Map<K,V> synchronizedMap(Map<K,V> m)`
     - `static <K,V> NavigableMap<K,V> synchronizedNavigableMap(NavigableMap<K,V> m)`
     - `static <T> NavigableSet<T> synchronizedNavigableSet(NavigableSet<T> s)`
     - `static <T> Set<T> synchronizedSet(Set<T> s)`
     - `static <K,V> SortedMap<K,V> synchronizedSortedMap(SortedMap<K,V> m)`
     - `static <T> SortedSet<T> synchronizedSortedSet(SortedSet<T> s)`
   - checked view -- throw `ClassCastException` immediately when heap pollution (detects with `Class::isInstance`), instance of inner class in `Collections`, intended as debugging support
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
     - `unmodifiableCollection`, `synchronizedCollection`, `checkedCollection` -- returns a collection whose equals method does not invoke the `equals` method of the underlying collection but `Object::equals`, same for `hashCode`
     - exception -- `unmodifiableSet` and `unmodifiableList` methods use the equals and hashCode methods of the underlying collections

1. subranges -- views that changes reflect to the original
   - `List::subList`
   - `SortedMap::subMap`, `SortedMap::headMap`, `SortedMap::tailMap`
     - `NavigableMap` -- overrides and has new definitions with inclusion option
     - also for `SortedSet` and `NavigableSet`

### Legacy Collections

1. `java.util.Hashtable` -- synchronized `HashMap`, use `ConcurrentHashMap` instead

1. `java.util.Properties` -- for property files
   ```java
   public class Properties extends Hashtable<Object,Object>
   ```
   - `String` keys and values
   - can be saved to a stream or loaded from a stream
     - `void store(OutputStream out, String comments)`
     - more
   - can use a secondary `Properties` for default
     - `Properties()`
     - `Properties(Properties defaults)`
     - `String getProperty(String key)`
     - `String getProperty(String key, String defaultValue)` -- `defaultValue` only when no secondary `Properties` and `key` absent
   - system properties -- see `java` in [CLI](#CLI), find accessible names in `$JAVA_HOME/conf/security/java.policy`
     ```shell
     # jshell> System.getProperties().forEach((k, v) -> System.out.printf("%s=%s\n", k, v))
     $ java -XshowSettings:properties --version
     Property settings: # only a portion is available on all platforms
         awt.toolkit = sun.awt.windows.WToolkit
         file.encoding = GBK
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

1. `java.util.Enumeration` -- legacy `Iterator`
   - get `Enumeration` -- use `Collections::enumeration`, `Collections::emptyEnumeration` to work with legacy code

1. `java.util.Vector` — legacy synchronized `ArrayList`

1. `java.util.Stack` -- legacy
   ```java
   public class Stack<E> extends Vector<E>
   ```

1. `java.util.BitSet` -- bit vector, no perfect alternative, still in use
   ```java
   public class BitSet extends Object
   implements Cloneable, Serializable
   ```
   - no boundary check, some methods (such as `size()`) may overflow

## Preferences

1. preferences -- in `java.util.prefs`
   - disadvantages of property files
     - no uniform location
     - no standard naming convention, increasing the likelihood of name clashes
   - location of preferences -- registry in Windows, file system for Linux, implementation hidden from user
   - structure -- tree structure, recommended to make the configuration node paths match the package names
   - multiple users -- `Preferences.userRoot()`, `Preferences.systemRoot()`

1. `java.util.prefs.Preferences` -- `Map` like
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
     - no store -- elements stored in an underlying collection or generated on demand, should not mutate upon terminal operation
     - does not mutate source -- new stream on every call
     - lazy
     - one-time -- may throw `IllegalStateException` if it detects that the stream is being reused
     - sequential or parallel -- in parallel mode when the terminal method executes, all intermediate stream operations will be parallelized, using `ForkJoinPool`
     - ordered or not -- streams that arise from ordered collections (arrays and lists), from ranges, generators, and iterators, or from calling `Stream::sorted`
       - order and parallelism -- ordering does not preclude efficient parallelism, but some operations can be more effectively parallelized without requiring order
   - stream creation
     - from collections and `Arrays` -- `Collection::stream`, `Collection::parallelStream`, `Arrays::stream`
       - under the hood -- `StreamSupport::stream`, which uses `Spliterator`
     - static methods in `Stream`
     - `Pattern::splitAsStream`
     - `Files::lines`
     - `Stream.Builder`
     - `Random::ints`, `Random::doubles`, `Random::longs` for primitive variants
     - `CharSequence::codepoints`
   - generic and primitive variants exist

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

1. `java.util.stream.StreamSupport` -- for library writers presenting stream views of data structures
   ```java
   public final class StreamSupport extends Object
   ```

1. `java.util.stream.IntStream`, `java.util.stream.LongStream`, `java.util.stream.DoubleStream`
   ```java
   public interface IntStream
   extends BaseStream<Integer,IntStream>
   ```
   - see `Stream`
   - creation -- partial `range()` in Python
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
     - `static <T> Stream<T> generate(Supplier<T> s)` -- Returns an infinite sequential unordered stream where each element is generated by the provided Supplier.
     - `static <T> Stream<T> iterate(T seed, UnaryOperator<T> f)` -- Returns an infinite sequential ordered Stream produced by iterative application of a function `f` to an initial element seed, producing a Stream consisting of seed, `f(seed)`, `f(f(seed))`, etc.
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
   - query -- order matters
     - `Stream<T> limit(long maxSize)`
     - `Stream<T> skip(long n)`
     - `Stream<T> distinct()` -- uses `Object::equals`, the first occurrence when ordered
     - `Stream<T> sorted()`  
       `Stream<T> sorted(Comparator<? super T> comparator)`
   - reduction (terminal operation)
     - `Optional<T> max(Comparator<? super T> comparator)`
     - `Optional<T> min(Comparator<? super T> comparator)`
     - `long count()`
     - `Optional<T> findAny()` -- effective when parallel
     - `Optional<T> findFirst()`
     - `boolean allMatch(Predicate<? super T> predicate)`
     - `boolean anyMatch(Predicate<? super T> predicate)`
     - `boolean noneMatch(Predicate<? super T> predicate)`
     - `T reduce(T identity, BinaryOperator<T> accumulator)`
     - `<U> U reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)`
   - result (terminal operation)
     - `BaseStream` methods
     - `Stream<T> peek(Consumer<? super T> action)`
     - `void forEach(Consumer<? super T> action)`
     - `void forEachOrdered(Consumer<? super T> action)` -- when in parallel and ordre matters
     - `Object[] toArray()`  
       `<A> A[] toArray(IntFunction<A[]> generator)`
     - `<R,A> R collect(Collector<? super T,A,R> collector)`  
       `<R> R collect(Supplier<R> supplier, BiConsumer<R,? super T> accumulator, BiConsumer<R,R> combiner)` -- `Collector` shortcut
       ```java
       List<String> asList = stringStream.collect(ArrayList::new, ArrayList::add,
                                                  ArrayList::addAll);
       String concat = stringStream.collect(StringBuilder::new, StringBuilder::append,
                                            StringBuilder::append)
                                   .toString();
       ```
     - iterator methods from `BaseStream`

1. `java.util.stream.Collector` -- A mutable reduction operation that accumulates input elements into a mutable result container
   ```java
   public interface Collector<T,A,R>
   ```
   - process
     - creation of a new result container (`Supplier<A> supplier()`)
     - incorporating a new data element into a result container (`BiConsumer<A,T> accumulator()`)
     - combining two result containers into one (`BinaryOperator<A> combiner()`)
     - performing an optional final transform on the container (`Function<A,R> finisher()`)
   - `Set<Collector.Characteristics> characteristics()`
     - `CONCURRENT` -- Indicates that this collector is concurrent, meaning that the result container can support the accumulator function being called concurrently with the same result container from multiple threads.
     - `IDENTITY_FINISH` -- Indicates that the finisher function is the identity function and can be elided.
       - `Function.identity()`
     - `UNORDERED` -- Indicates that the collection operation does not commit to preserving the encounter order of input elements.
   - creation
     - `static <T,A,R> Collector<T,A,R> of(Supplier<A> supplier, BiConsumer<A,T> accumulator, BinaryOperator<A> combiner, Function<A,R> finisher, Collector.Characteristics... characteristics)`
     - `static <T,R> Collector<T,R,R> of(Supplier<R> supplier, BiConsumer<R,T> accumulator, BinaryOperator<R> combiner, Collector.Characteristics... characteristics)`
     - `Collectors`

1. `java.util.stream.Collectors`
   - statics
     - `static <T> Collector<T,?,Double> averagingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Double> averagingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Double> averagingLong(ToLongFunction<? super T> mapper)`
     - `static <T> Collector<T,?,Long> counting()`
     - `static <T> Collector<T,?,Optional<T>> maxBy(Comparator<? super T> comparator)`
     - `static <T> Collector<T,?,Optional<T>> minBy(Comparator<? super T> comparator)`
     - `static <T> Collector<T,?,DoubleSummaryStatistics> summarizingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,IntSummaryStatistics> summarizingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,LongSummaryStatistics> summarizingLong(ToLongFunction<? super T> mapper)`
     - `static <T> Collector<T,?,Double> summingDouble(ToDoubleFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Integer> summingInt(ToIntFunction<? super T> mapper)`  
       `static <T> Collector<T,?,Long> summingLong(ToLongFunction<? super T> mapper)`
   - collector chaining
     - `static <T,A,R,RR> Collector<T,A,RR> collectingAndThen(Collector<T,A,R> downstream, Function<R,RR> finisher)` -- add finisher
     - `static <T,U,A,R> Collector<T,?,R> mapping(Function<? super T,? extends U> mapper, Collector<? super U,A,R> downstream)` -- preprocess with `T -> U` function for collector accepting `U`
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
   - `Iterator<S> iterator()` -- Lazily loads the available providers of this loader's service.
   - `static <S> ServiceLoader<S> load(Class<S> service)` -- Creates a new service loader for the given service type, using the current thread's context class loader.

## Other (tbd)

<!-- TODO -->

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

1. `java.util.Random` — generate a stream of pseudorandom numbers, `Math.random()` simpler to use
   ```java
   public class Random extends Object
   implements Serializable
   ```
   - constructors
     - `Random()`
     - `Random(long seed)`
   - next
     - `int nextInt()`
     - `int nextInt(int bound)`

1. `java.util.Optional` -- A container object which may or may not contain a non-null value, a better `null`
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
   - use
     - `Collectors::summarizingLong`, `Collectors::summarizingDouble`, `Collectors::summarizingInt`
     - with out collector
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

# Error Handling

## Debugging

1. general
   - use debugger
   - test with main method, or unit test tools

1. print or log
   - using string concatenation
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
       Thread.setDefaultUncaughtExceptionHandler( new Thread.UncaughtExceptionHandler() {
           public void uncaughtException(Thread t, Throwable e) {
               // save information in log file
           };
       });
       ```

1. CLI options
   - `ctrl + \` -- get thread dump when the program hangs??
   - `java`
     - use `-verbose` when launching JVM for diagnosing class path problems
     - use `Xprof` for profiling, note that support was removed in 10.0
   - use `-Xlint:all` when `javac`
   - use `jconsole` to track memory consumption, thread usage, class loading
   - `jmap` to get a heap dump and `jhat` to examine
     ```java
     jmap -dump:format=b,file=dumpFileName processID
     jhat dumpFileName
     ```
     - at `localhost:7000`
     - `jhat` removed in JDK 9
   - `jstat`
   - `jcmd`
   - `hprof`
   - `jps`
   - `jstack`

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

1. `Exception`
   ```java
   public class Exception extends Throwable
   ```
   - descendents
     - `RuntimeException`
     - `IOException`
     - more

1. `StackTraceElement`
   ```java
   public final class StackTraceElement extends Object
   implements Serializable
   ```
   - returned by
     - `Throwable.getStackTrace()`
     - `Thread.getAllStackTraces()`
   - stack info
     - `String getClassName()`
     - `String getFileName()`
     - `int getLineNumber()`
     - `String getMethodName()`
   - `Object`
     - `boolean equals(Object obj)`
     - `int hashCode()`
     - `String toString()`

## Exception Handling

1. exception specification — declare checked exceptions
   ```java
   // modifiers return_type method_name(parameters) throws Exception1, Exception2
   // java.io.FileInputStream
   public FileInputStream(String name) throws FileNotFoundException
   ```
   - when to declare
     - call a method that threatens to throw a checked exception
     - `throw` checked exceptions manually
       - a method without a `throws` specifier may not throw any checked exceptions at all
   - if not declared — If your method fails to faithfully declare all checked exceptions or handle them, the compiler will issue an error message
   - if caught — no need for `throws` specification
   - when overriding a method
     - exception specification cannot be more general
     - OK to throw more specific exceptions, or not to throw any exceptions in the subclass method
     - if the superclass method throws no checked exception at all, neither can the subclass

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
     - the exception variable is implicitly `final` when multiple exception types
   - rethrow — `throw` in `catch` block
     - exception wrapping — use `Throwable::initCause` to throw as another wrapped type and `Throwable::getCause` for original failure
     - bypass exception specification limit — rethrow a wrapped `RuntimeException` if a method cannot throw checked exception
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
     - compiler now tracks the fact that `e` originates from the `try` block, it is valid to declare the enclosing method as throws `SQLException`
       - Provided that the only checked exceptions in that block are `SQLException` instances
       - and provided that `e` is not changed in the catch block

1. `finally` — always executed, can be used without `catch`
   - executes before the method returns, if `return` used before `finally`
   - `return` in `finally` will mask previous `return`
   - handle exceptions in `finally`
     - exceptions in `finally` will mask exceptions previously thrown
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
   - throw an `AssertionError` if the assertion fails
   - `expression` is passed to the constructor of the `AssertionError` to produce a message string
     - using `String::valueOf` when converting
   - enabling and disabling
     - disabled by default, `-da` or `-disableassertions` to explicitly disable certain classes
     - enable by `-ea` or `-enableassertions`
       ```shell
       java -enableassertions MyApp
       java -ea:MyClass -ea:com.mycompany.mylib... MyApp # for specific classes
       ```
       - when enabled, no recompiling, but the class loader stops stripping out the assertion code
     - Some classes are not loaded by a class loader but directly by the virtual machine, but above switches still work
     - `-enablesystemassertions` / `-esa` for system classes

1. assert use
   - Assertion failures are intended to be fatal, unrecoverable errors
   - Assertion checks are turned on only during development and testing
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
       - the virtual machine optimizes execution, accurate call information may not be available
       - `Logger::logp` to set calling point explicitly
   - log manager configuration
     - configuration file — `jre/lib/logging.properties`
       - log configuration file location — `-Djava.util.logging.config.file=configFile`
       - `.level=INFO`
       - `java.util.logging.ConsoleHandler.level=FINE`
     - processed by the `java.util.logging.LogManager`, configurable by `java.util.logging.manager` and `java.util.logging.config.class` system property
   - localization — resource bundle
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
   - singleton
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
   - log
     - `void level(String msg)`  
       `void level(Supplier<String> msgSupplier)`
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

1. `java.util.logging.Level`
   ```java
   public class Level extends Object
   implements Serializable
   ```
   - levels
     - `static Level OFF`
     - `static Level SEVERE`
     - `static Level WARNING`
     - `static Level INFO`
     - `static Level CONFIG`
     - `static Level FINE`
     - `static Level FINER`
     - `static Level FINEST`
     - `static Level ALL`

### Log Records

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

1. handler — all handlers extends `Handler`
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

### Filters

1. filters — implements `Filter`
   - in addition to level filtering, logger and handler can have an optional filter
   - `Logger::setFilter`, `Handler::setFilter`
     - both at most one filter at a time

1. `java.util.logging.Filter`
   ```java
   @FunctionalInterface
   public interface Filter
   ```
   - `boolean isLoggable(LogRecord record)`

### Formatters

1. formatters — extends `Formatter`
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
     - typed ones are subtype of the raw one
       - possible to cast a typed one to a raw one and cause type error
     - warning when assign a raw one to a typed one
     - types only checked when compiling, all are raw without type at runtime
   - no relationship between `Generic<Type_2>` and `Generic<Type_2>, regardless of the relationship between the type variables
   - in JVM
     - type variables are erased and replaced by first bound, or `Object`
     - compiler inserts casts to other bounds when necessary
       - place the predominant interface at the first one for performance
     - bridge methods are synthesized when necessary (when overriding)
       - actual override method can have a different signature compared to super type method — due to type erasure of generics or different return type
       - bridge method is of the same signature of super type method
       - bridge method calls actual method

1. generic syntax
   - name conventions
     - `E` for the element type of a collection
     - `K` and `V` for key and value types of a table
     - and `T` (and the neighboring letters `U` and `S` , if necessary) for “any type at all”
   - generic class
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
       - use `jshell` to test
   - generic bounds — `extends`, including
     ```java
     public static <T extends Comparable & Serializable> T min(T[] a)
     ```
     - class bound — must be the first one in the bounds list
     - interface bound and class bound — arbitrary number of interfaces, but at most one class
   - wildcards — `?`
     - `?` — can only be assigned to `Object`, can only be assigned `null`
     - `? extends SomeType` — including, can not be assigned, but can be assigned to (`?` can be deemed `SubSubSubSomeType`)
       ```java
       Pair<Manager> managerBuddies = new Pair<>(ceo, cfo);
       Pair<? extends Employee> wildcardBuddies = managerBuddies; // OK
       Employee e = wildcardBuddies.getFirst(); // OK, function signature is `? extends Employee getFirst()`
       wildcardBuddies.setFirst(lowlyEmployee); // compile-time error, function signature is `void setFirst(? extends Employee)`
       ```
     - `? super SomeType` — including, the contrary of `? extends SomeType` (can only be assigned to `Object`)
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
   }
   ```

1. limits of generics
   - type parameters cannot be primitive types — not compatible with `Object` when type erased at runtime
   - type variables not valid in static context (parameterized types are available)
     ```java
     public class Singleton<T> {
         private static T singleInstance; // Error
         public static T getSingleInstance() { // Error
             if (singleInstance == null) // ... construct new instance of T
             return singleInstance;
         }
     }
     ```
   - cannot throw or catch instances of a generic class
   - compile warning when cast (`(Pair<String>) a`), compile error when `instanceof` (`a instanceof Pair<T>`)
   - name clash
     - error by clash with `Object::equals` when defining `equals(T other)`
     - error when subtype of the same interface with different parameterization — will be a conflict with the synthesized bridge methods
       ```java
       class Employee implements Comparable<Employee> { }
       class Manager extends Employee implements Comparable<Manager> { } // Error
       ```
   - heap pollution, cannot initialize arrays of parameterized types, but can be declared — error when `new Pair<String>[10]`
     ```java
     // legal but not safe workaround, possible heap pollution
     Pair<String>[] table = (Pair<String>[]) new Pair<?>[10];
     ```
     ```java
     // heap pollution
     Object[] objArray = table;
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

1. `@SuppressWarnings("fallthrough")`

1. `@override`

1. `@FunctionalInterface`

1. `@SafeVarargs`

# Concurrency

## Thread

1. multithread
   - construct a runnable thread
     - construct with a `Runnable` target
     - subclass `Thread` and override `run` method
       - recommended only when customizing `run` is not enough
   - start a thread -- `Thread::run`
     - [zhihu](https://zhuanlan.zhihu.com/p/34414549)
   - thread scheduling -- depends on the services the OS provides

1. properties of threads
   - priority -- whenever the scheduler wants to pick a new thread, threads with higher priorities are preferred
     - inherit -- initially set equal to the priority of the creating thread
     - constants -- `Thread.MIN_PRIORITY` 1, `Thread.NORM_PRIORITY` 5, `Thread.MAX_PRIORITY` 10, mapped to priority levels of the host platform
     - Windows has seven priority levels, priorities are ignored in Linux??
     - caveat -- few scenarios there to ever tweak priorities. If you have several threads with a high priority that don’t become inactive, the lower-priority threads may never execute
   - daemon -- serves other threads, JVM exits when only daemon threads remain
     - inherit -- is a daemon thread if and only if the creating thread is a daemon
     - caveat -- should never access a persistent resource such as a file or database since it can terminate at any time
   - state -- `Thread.State`
   - `Thread.UncaughtExceptionHandler` -- method to be invoked from when the given thread terminates due to the given uncaught exception
     ```java
     @FunctionalInterface
     public interface UncaughtExceptionHandler {
         void uncaughtException(Thread t, Throwable e);
     }
     ```
     - Any exception thrown by this method will be ignored by JVM
     - default handler defaults to `null`, individual handler defaults to `ThreadGroup`
   - `ThreadGroup` -- represents a set of threads. In addition, a thread group can also include other thread groups
     - not recommended, use alternatives instead
     - action orders of `ThreadGroup::uncaughtException` when an uncaught exception
       - the `uncaughtException` method of the parent thread group
       - otherwise, default handler if non-`null`
       - otherwise, nothing happens if the `Throwable` is an instance of `ThreadDeath`
       - otherwise, print the name of the thread and the stack trace to `System.err`
   - `ThreadLocal`, `ThreadLocalRandom` -- thread-local variables
     ```java
     public static final ThreadLocal<SimpleDateFormat> dateFormat =
         ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
     ```
     - why
       - the internal data structures used by `SimpleDateFormat` can be corrupted by concurrent access, and synchronization is expensive
       - `Random` is thread safe, but inefficient if multiple threads need to wait for a single shared generator

1. `Runnable` -- should be implemented by any class whose instances are intended to be executed by a thread
   ```java
   @FunctionalInterface
   public interface Runnable {
       void run();
   }
   ```
   - see [Callable and Future](#Callable-and-Future) for more

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
     - `void run()` -- called by `start()`, generally should not be called explicitly
     - `void interrupt()` -- set the interrupted status, if the thread is blocked, throw `InterruptedException` inside the thread
       - typically blocking methods (those related to `Thread.State.WAITING` and `Thread.State.TIMED_WAITING`) threaten to throw `InterruptedException`
     - `static void yield()`
   - wait
     - `static void sleep(long millis)` -- for current thread  
       `static void sleep(long millis, int nanos)`
     - `void join()` -- waits for this thread to die  
       `void join(long millis)`  
       `void join(long millis, int nanos)`
   - get information
     - `static Thread currentThread()`
     - `boolean isAlive()`
     - `boolean isInterrupted()` -- can be used for check in `while`
     - `static boolean interrupted()` -- for current thread, also clears interrupted status
   - get
     - `Thread.State getState()`
     - `int getPriority()`
     - `boolean isDaemon()`
     - `Thread.UncaughtExceptionHandler getUncaughtExceptionHandler()`
     - `static Thread.UncaughtExceptionHandler getDefaultUncaughtExceptionHandler()`
   - set
     - `void setPriority(int newPriority)`
     - `void setDaemon(boolean on)`
     - `void setUncaughtExceptionHandler(Thread.UncaughtExceptionHandler eh)`
     - `static void setDefaultUncaughtExceptionHandler(Thread.UncaughtExceptionHandler eh)`

1. `Thread.State`
   ```java
   public enum State
   ```
   - `NEW` -- after `new`, a thread that has not yet started is in this state.
   - `RUNNABLE` -- after `start()`, a thread executing in the Java virtual machine is in this state, may not be running due to CPU time slicing
   - `BLOCKED` -- intrinsic object lock, a thread that is blocked waiting for a monitor lock is in this state.
   - `WAITING` -- after `Object::wait`, `Thread::join`, or by `Lock` or `Condition`, a thread that is waiting indefinitely for another thread to perform a particular action is in this state.
   - `TIMED_WAITING` -- after `Thread::sleep`, or methods for `WAITING` with a time parameter, a thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
   - `TERMINATED` -- A thread that has exited is in this state.

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
   - `void remove()`
   - `void set(T value)`
   - `static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier)`

1. `java.util.concurrent`
   ```java
   public class ThreadLocalRandom extends Random
   ```
   - `static ThreadLocalRandom current()`

## Synchronization and Locks

1. synchronization
   - race condition -- when a system's substantive behavior is dependent on the sequence or timing of other uncontrollable events
   - atomic
   - preference -- concurrent collections with non-blocking mechanism, synchronizers > underlying locks in `java.util.concurrent` > `synchronized` > `Lock`
     - client-side locking -- discouraged
   - when to use
     > If you write a variable which may next be read by another thread, or you read a variable which may have last been written by another thread, you must use synchronization.

1. lock -- when the lock object is locked, no other thread can `lock()` (being blocked)
   ```java
   myLock.lock(); // a ReentrantLock object
   try {
       // critical section
   }
   finally {
       myLock.unlock(); // make sure the lock is unlocked even if an exception is thrown
   }
   ```

1. conditions, condition queues or condition variables -- a means for one thread to suspend execution (to "wait") until notified by another thread that some state condition may now be true
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
   - atomic -- atomically releases the associated lock and suspends the current thread, just like `Object.wait`
   - intrinsically bound to a lock
     - `Lock::newCondition` to get instances
     - `await` and `signal` methods can only be called if the thread owns the `Lock` of the `Condition`
   - wait set -- a thread enters wait set and stays deactivated after the call to `await`, until `signal`ed by other threads
   - deadlock -- when all threads are in wait set

1. `synchronized` -- use intrinsic lock, a method or code block that is atomic to a thread
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
       ... // Perform action appropriate to condition
   }
   ```
   - intrinsic lock -- every object has an intrinsic lock, used if declared with `synchronized`
     - static methods -- the intrinsic lock of associated `Class<?>` is used
   - equivalent conditions in `Object` -- see [Inheritance](#Inheritance) for other `Object` APIs
     - `void notify()`
     - `void notifyAll()`
     - `void wait()`
     - `void wait(long timeout)`
     - `void wait(long timeout, int nanos)`
   - monitor -- intrinsic lock is the loose adaption of the monitor concept
     - [Monitor (synchronization) - Wikipedia](https://en.wikipedia.org/wiki/Monitor_(synchronization))

1. `java.util.concurrent.locks.Lock`
   ```java
   public interface Lock
   ```
   - `void lock()` -- other threads are blocked if the lock cannot be acquired, cannot be interrupted
   - `void lockInterruptibly()` -- `lock()` that can be interrupted, equivalent to `tryLock()` with an infinite timeout
   - `Condition newCondition()`
   - `boolean tryLock()` -- return `false` rather than being blocked
   - `boolean tryLock(long time, TimeUnit unit)` -- can be interrupted
   - `void unlock()`

1. `java.util.concurrent.locks.Condition` -- renamed API as counterpart methods in `Object` are `final`
   ```java
   public interface Condition
   ```
   - `void await()`
   - `boolean await(long time, TimeUnit unit)`
   - `long awaitNanos(long nanosTimeout)`
   - `void awaitUninterruptibly()`
   - `boolean awaitUntil(Date deadline)`
   - `void signal()` -- choose one random thread to unblock, more likely to deadlock compared to `signalAll()`
   - `void signalAll()`

1. `java.util.concurrent.locks.ReentrantLock`
   ```java
   public class ReentrantLock extends Object
   implements Lock, Serializable
   ```
   - reentrant -- has a hold count, can be repeatedly acquired by a thread, every `lock()` needs `unlock()` in order to relinquish the lock
     - `int getHoldCount()`
   - fair -- a lot slower, a fair lock can still be unfair if the thread scheduler is unfair
     - `ReentrantLock()`
     - `ReentrantLock(boolean fair)`

1. `java.util.concurrent.locks.ReentrantReadWriteLock` -- read lock for accessors, write lock for mutators
   ```java
   public class ReentrantReadWriteLock extends Object
   implements ReadWriteLock, Serializable
   ```
   - `ReentrantReadWriteLock.ReadLock readLock()`
     - read lock can be acquired if -- the write lock is not held by another thread
   - `ReentrantReadWriteLock.WriteLock writeLock()`
     - write lock can be acquired if -- neither the read nor write lock are held by another thread
   - `java.util.concurrent.locks.ReadWriteLock` interface
     - scenarios -- while only a single thread at a time (a writer thread) can modify the shared data, in many cases any number of threads can concurrently read the data
     - mutual exclusive or not -- The read lock may be held simultaneously by multiple reader threads, so long as there are no writers. The write lock is exclusive
     - must guarantee that the memory synchronization effects of `writeLock` operations -- a thread successfully acquiring the read lock will see all updates made upon previous release of the write lock
     - a writer can acquire the read lock, but not vice-versa
     - overhead -- the read-write lock implementation (which is inherently more complex than a mutual exclusion lock) can dominate the execution cost if the read operations are too short

1. `java.util.concurrent.locks.StampedLock` -- a capability-based lock, lock acquisition methods return a stamp that represents and controls access with respect to a lock state
   - [tbd, zhihu](https://zhuanlan.zhihu.com/p/33422168)

## volatile and Atomics

1. `volatile` -- ensures that a field is coherently accessed by multiple threads
   - problems of concurrent write and read to instance fields
     - cache coherence -- threads running in different processors may see different values for the same memory location
     - reorder?? -- a memory value can be changed by another thread, but compilers assume memory values are only changed with explicit instructions, and compilers reorder instructions to maximize throughput
   - compiler will insert the appropriate code to ensure that a change to the a variable in one thread is visible from any other thread that reads the variable
     - [happen-before order](https://docs.oracle.com/javase/specs/jls/se11/html/jls-17.html#jls-17.4.5) -- a write to a volatile field is visible to and ordered before every subsequent read of that field
   - atomicity -- volatile variables do not provide any atomicity, but makes read and write to `long` and `double` atomic

1. `java.util.concurrent.atomic` -- use efficient machine-level instructions to guarantee atomicity without using locks
   - optimistic update -- `compareAndSet` method, or use lambda like `accumulateAndGet` method
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
   - delayed computation -- `LongAdder`, `LongAccumulator`, `DoubleAdder`, `DoubleAccumulator`
     - under high contention, performance suffers because the optimistic updates require too many retries
     - the computation must be associative and commutative
     - `identity` is also used when `accumulate()`

1. `java.util.concurrent.atomic.AtomicLong`
   ```java
   public class AtomicLong extends Number // Striped64
   implements Serializable
   ```

1. more

## Thread-Safe Collections

### Blocking Queues

1. Blocking Queues
   - producer consumer model
   - no synchronization needed -- instead of synchronization and locks, queue the instructions and let only the access of one thread
   - the queue needs to be thread-safe -- blocking queue blocks a thread when no slot for producer or no provision for consumer
   - timeout -- some methods have versions with timeout

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
     - `E poll(long timeout, TimeUnit unit)`

1. `java.util.concurrent.BlockingDeque`
   ```java
   public interface BlockingDeque<E>
   extends BlockingQueue<E>, Deque<E>
   ```

1. `java.util.concurrent.LinkedBlockingQueue` -- optionally-bounded blocking queue based on linked nodes
   ```java
   public class LinkedBlockingQueue<E> extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```

1. `java.util.concurrent.LinkedBlockingDeque` -- deque version of `LinkedBlockingQueue`
   ```java
   public class LinkedBlockingDeque<E> extends AbstractQueue<E>
   implements BlockingDeque<E>, Serializable
   ```

1. `java.util.concurrent.ArrayBlockingQueue` -- optionally-fair bounded blocking queue backed by an array
   ```java
   public class ArrayBlockingQueue<E> extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```

1. `java.util.concurrent.PriorityBlockingQueue` -- unbounded blocking queue that uses the same ordering rules as class PriorityQueue
   ```java
   public class PriorityBlockingQueue<E> extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```

1. `java.util.concurrent.DelayQueue` -- unbounded blocking queue of `Delayed` elements backed by `PriorityQueue`, in which an element can only be taken when its delay has expired
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
     - necessity -- a `compareTo` method that provides an ordering consistent with its `getDelay` method
       - which violates the consistency between `compareTo` and `equals`

1. `java.util.concurrent.LinkedTransferQueue` -- unbounded TransferQueue backed by dual queues of slack (refer to source code)
   ```java
   public class LinkedTransferQueue<E> extends AbstractQueue<E>
   implements TransferQueue<E>, Serializable
   ```
   - `java.util.concurrent.TransferQueue` -- A `BlockingQueue` in which producers may wait for consumers to receive elements
     ```java
     public interface TransferQueue<E> extends BlockingQueue<E>
     ```
     - `void transfer(E e)` -- transfers the specified element immediately if there exists a consumer already waiting, else waits until the element is received by a consumer
   - `size()` is O(n) and maybe inaccurate, due to non-data nodes and concurrency
   - bulk operations `addAll`, `removeAll`, `retainAll`, `containsAll`, `equals`, and `toArray` are not guaranteed to be performed atomically

### Concurrent Collections

1. concurrent collections
   - generally non-blocking algorithm
   - some are non-null
   - `size()` is O(n) and maybe inaccurate, due to non-data nodes and concurrency
   - bulk operations `addAll`, `removeAll`, `retainAll`, `containsAll`, `equals`, and `toArray` are not guaranteed to be performed atomically
   - Iterators are weakly consistent -- may or may not reflect all modifications after construction, but will not return a value twice

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

1. `java.util.concurrent.ConcurrentHashMap`
   ```java
   public class ConcurrentHashMap<K,V> extends AbstractMap<K,V>
   implements ConcurrentMap<K,V>, Serializable
   ```
   - fully interoperable with `Hashtable`
   - `concurrencyLevel` -- the estimated number of concurrently updating threads, defaults to 16, other write threads will be blocked if the number exceeded
   - `long mappingCount()`
   - atomicity
     - vanilla -- `putIfAbsent`, `remove`
     - CAS -- `V replace(K key, V value)`, `boolean replace(K key, V oldValue, V newValue)`
     - use `ConcurrentHashMap<String, LongAdder>` with `putIfAbsent`
       ```java
       map.putIfAbsent(word, new LongAdder()).increment();
       map.computeIfAbsent(word, k -> new LongAdder()).increment(); // better
       ```
     - use lambda -- `compute`, `computeIfAbsent`, `computeIfPresent`, `merge`
   - `parallelismThreshold` of bulk operations -- if the map contains more elements than the threshold, the bulk operation is parallelized, fully utilize the `ForkJoinPool.commonPool()` if set to 1
   - `java.util.concurrent.ConcurrentMap`
     ```java
     public interface ConcurrentMap<K,V> extends Map<K,V>
     ```
   - concurrent set views
     - `ConcurrentHashMap.KeySetView<K,V> keySet()`  
       `ConcurrentHashMap.KeySetView<K,V> keySet(V mappedValue)`
     - `static <K> ConcurrentHashMap.KeySetView<K,Boolean> newKeySet()`  
       `static <K> ConcurrentHashMap.KeySetView<K,Boolean> newKeySet(int initialCapacity)`

1. `java.util.concurrent.ConcurrentSkipListMap`
   ```java
   public class ConcurrentSkipListMap<K,V> extends AbstractMap<K,V>
   implements ConcurrentNavigableMap<K,V>, Cloneable, Serializable
   ```
   - `java.util.concurrent.ConcurrentNavigableMap`
     ```java
     public interface ConcurrentNavigableMap<K,V>
     extends ConcurrentMap<K,V>, NavigableMap<K,V>
     ```

### Other Thread-Safe Collections

1. `java.util.concurrent.CopyOnWriteArrayList` -- all mutative operations (add, set, and so on) are implemented by making a fresh copy of the underlying array
   ```java
   public class CopyOnWriteArrayList<E> extends Object
   implements List<E>, RandomAccess, Cloneable, Serializable
   ```
   - tradeoff -- efficient when traversal operations vastly outnumber mutations, and is useful when you cannot or don't want to synchronize traversals
     - comparaison to synchronized view -- when frequent mutation is needed, synchronized view of `ArrayList` can outperform a `CopyOnWriteArrayList`
   - snapshot iterator -- iterator method uses a reference to the state of the array at the point that the iterator was created
   - thread-safe -- memory consistency

1. `java.util.concurrent.CopyOnWriteArraySet` -- a Set that uses an internal CopyOnWriteArrayList for all of its operations
   ```java
   public class CopyOnWriteArraySet<E> extends AbstractSet<E>
   implements Serializable
   ```

## Callable and Future

1. `java.util.concurrent.Callable` -- `Runnable` that can return a result and throw a checked exception
   ```java
   @FunctionalInterface
   public interface Callable<V> {
       V call() throws Exception;
   }
   ```
   - methods for converting to `Callable` in `Executors`

1. `java.util.concurrent.Future` -- result-bearing action that can be cancelled
   ```java
   public interface Future<V>
   ```
   - `V get()` -- block until finish or exception
     - throws `InterruptedException`, `ExecutionException`
   - `V get(long timeout, TimeUnit unit)` -- `TimeoutException` when timeout
   - `boolean cancel(boolean mayInterruptIfRunning)`
   - `boolean isCancelled()`
   - `boolean isDone()`

1. `java.util.concurrent.ScheduledFuture` -- delayed `Future`
   ```java
   public interface ScheduledFuture<V>
   extends Delayed, Future<V>
   ```

1. `java.util.concurrent.FutureTask` -- A cancellable asynchronous computation, or wrapper for `Callable` or `Runnable`
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

1. `java.util.concurrent.ForkJoinTask` -- see [Fork-Join](#Fork-Join)

1. `java.util.concurrent.CompletableFuture` -- A `Future` that may be explicitly completed (setting its value and status), and may be used as a `CompletionStage`, supporting dependent functions and actions that trigger upon its completion (`Promise.then` in JS), can be async
   ```java
   public class CompletableFuture<T> extends Object
   implements Future<T>, CompletionStage<T>
   ```
   - `async` suffixed methods -- use `ForkJoinPool.commonPool`, or the `Executor` argument, all generated asynchronous tasks are instances of the marker interface `CompletableFuture.AsynchronousCompletionTask`
   - non-`async` methods -- actions performed by the thread that completes the current `CompletableFuture`, or by any other caller of a completion method
   - static methods
     - `static CompletableFuture<Void> allOf(CompletableFuture<?>... cfs)`
     - `static CompletableFuture<Object> anyOf(CompletableFuture<?>... cfs)`
     - `static <U> CompletableFuture<U> completedFuture(U value)` -- `Promise.resolve`
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
     - `int getNumberOfDependents()` -- estimated
     - `boolean isCancelled()`
     - `boolean isCompletedExceptionally()`
     - `boolean isDone()`
   - more

## Executors

1. thread pool
   - constructing a new thread is expensive
   - throttle the number of concurrent threads -- huge number of threads can greatly degrade performance and even crash the virtual machine

1. `java.util.concurrent.Executor` -- decoupling task submission from the mechanics of how each task will be run
   ```java
   public interface Executor
   ```
   - `void execute(Runnable command)`

1. `java.util.concurrent.ExecutorService` -- `Executor` with methods to manage termination and produce `Future`
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
   - `java.util.concurrent.AbstractExecutorService` -- default implementations of `ExecutorService` execution methods
     ```java
     public abstract class AbstractExecutorService extends Object
     implements ExecutorService
     ```

1. `java.util.concurrent.ExecutorCompletionService` -- lightweight blocking queue that decouples the production of new asynchronous tasks from the consumption of the results of completed tasks
   ```java
   public class ExecutorCompletionService<V> extends Object
   implements CompletionService<V>
   ```
   - constructors
     - `ExecutorCompletionService(Executor executor)`
     - `ExecutorCompletionService(Executor executor, BlockingQueue<Future<V>> completionQueue)`
   - `Future<V> poll()` -- `null` if none are present  
     `Future<V> poll(long timeout, TimeUnit unit)`
   - `Future<V> submit(Callable<V> task)`  
     `Future<V> submit(Runnable task, V result)`
   - `Future<V> take()` -- wait if none are present

1. `java.util.concurrent.ScheduledExecutorService` -- `ExecutorService` that can schedule commands to run after a given delay, or to execute periodically
   ```java
   public interface ScheduledExecutorService extends ExecutorService
   ```
   - `<V> ScheduledFuture<V> schedule(Callable<V> callable, long delay, TimeUnit unit)`
   - `ScheduledFuture<?> schedule(Runnable command, long delay, TimeUnit unit)`
   - `ScheduledFuture<?> scheduleAtFixedRate(Runnable command, long initialDelay, long period, TimeUnit unit)`
   - `ScheduledFuture<?> scheduleWithFixedDelay(Runnable command, long initialDelay, long delay, TimeUnit unit)`

1. `java.util.concurrent.ThreadPoolExecutor` -- `ExecutorService` that executes each submitted task using one of possibly several pooled threads
   ```java
   public class ThreadPoolExecutor extends AbstractExecutorService
   ```
   - returned by `Executors.newCachedThreadPool()`, `Executors.newFixedThreadPool(int)`, `Executors.newSingleThreadExecutor()`
   - more

1. `java.util.concurrent.ScheduledThreadPoolExecutor` -- `ThreadPoolExecutor` that can additionally schedule commands to run after a given delay, or to execute periodically, preferable to `java.util.Timer`
   ```java
   public class ScheduledThreadPoolExecutor extends ThreadPoolExecutor
   implements ScheduledExecutorService
   ```
   - returned by `Executors.newScheduledThreadPool(int)`, `Executors.newSingleThreadScheduledExecutor()`

1. `java.util.concurrent.ForkJoinPool` -- see [Fork-Join](#Fork-Join)

1. `java.util.concurrent.Executors` -- factory and utility methods
   - thread pools
     - `static ExecutorService newCachedThreadPool()` -- new threads are created as needed; idle threads are kept for 60 seconds  
       `static ExecutorService newCachedThreadPool(ThreadFactory threadFactory)`
     - `static ExecutorService newFixedThreadPool(int nThreads)` -- contains a fixed set of threads; tasks kept in a queue when overloaded; idle threads are kept indefinitely  
       `static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory)`
     - `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize)` -- fixed-thread pool for scheduled execution; a replacement for `java.util.Timer`  
       `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize, ThreadFactory threadFactory)`
     - `static ExecutorService newSingleThreadExecutor()` -- a “pool” with a single thread that executes the submitted tasks sequentially  
       `static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory)`
     - `static ScheduledExecutorService newSingleThreadScheduledExecutor()` -- scheduled version of `newSingleThreadExecutor`
       `static ScheduledExecutorService newSingleThreadScheduledExecutor(ThreadFactory threadFactory)`
     - `static ExecutorService newWorkStealingPool()`-- `ForkJoinPool`  
       `static ExecutorService newWorkStealingPool(int parallelism)`
     - `java.util.concurrent.ThreadFactory`
       ```java
       public interface ThreadFactory {
           Thread newThread(Runnable r);
       }
       ```
   - more

### Fork-Join

1. fork-join framework
   - work stealing
     - task queue -- each thread has a deque for tasks, and pushes subtasks onto the head
     - work stealing -- when a worker thread is idle, it “steals” a task from the tail of another deque
       - Since large subtasks are at the tail, such stealing is rare
     - `ForkJoinPool` employing work stealing -- efficient for recursive tasks, and event-style tasks (especially `asyncMode` for the latter)
   - use and limitations
     - high volume -- Huge numbers of tasks and subtasks may be hosted by a small number of actual threads in a `ForkJoinPool`. The pool attempts to maintain enough active (or available) threads by dynamically adding, suspending, or resuming internal worker threads, even if some tasks are stalled waiting to join others
     - no side effect -- main use as computational tasks calculating pure functions or operating on purely isolated objects
     - avoid `synchronized` methods or blocks -- should minimize other blocking synchronization apart from joining other tasks or using synchronizers such as Phasers. Subdividable tasks should also not perform blocking I/O, and should ideally access variables that are completely independent of those accessed by other running tasks
     - define and use `ForkJoinTasks` that may block -- three further considerations
       - independent -- completion of few other tasks should be dependent on a task that blocks on external synchronization or I/O
       - small blocking tasks -- to minimize resource impact, tasks should be small; ideally performing only the (possibly) blocking action
       - ensure progress -- ensure the number of possibly blocked tasks fewer than `ForkJoinPool.getParallelism()`, or use `ForkJoinPool.ManagedBlocker`
     - loosely enforced guideline -- by not permitting checked exceptions such as `IOExceptions` to be thrown
     - like a call (fork) and return (join) from a parallel recursive function -- `a.fork(); b.fork(); b.join(); a.join();` is likely to be substantially more efficient than `a.join(); b.join()`
     - task size rule of thumb -- a task should perform more than 100 and less than 10000 basic computational steps

1. `java.util.concurrent.ForkJoinTask` -- tasks that run within a `ForkJoinPool`, a thread-like entity but much lighter, lightweight form of `Future`
   ```java
   public abstract class ForkJoinTask<V> extends Object
   implements Future<V>, Serializable
   ```
   - constructors (adaptors)
     - `static <T> ForkJoinTask<T> adapt(Callable<? extends T> callable)`
     - `static ForkJoinTask<?> adapt(Runnable runnable)`
     - `static <T> ForkJoinTask<T> adapt(Runnable runnable, T result)`
   - exceptions -- may still encounter unchecked exceptions, which are rethrown to callers join them
     - `RejectedExecutionException` -- internal resource exhaustion
   - awaiting completion and extracting results
     - `ForkJoinTask<V> fork()` -- Arranges to asynchronously execute this task in the pool the current task is running in, if applicable, or using the `ForkJoinPool.commonPool()` if not `inForkJoinPool()`.
     - `V join()` -- Returns the result of the computation when it is done
     - `get` from `Future`, but throws checked exception
     - `V invoke()` -- semantically equivalent to `fork(); join()` but always attempts to begin execution in the current thread
     - `invokeAll`
       - `static <T extends ForkJoinTask<?>> Collection<T> invokeAll(Collection<T> tasks)` -- forking a set of tasks and joining them all
       - `static void invokeAll(ForkJoinTask<?>... tasks)`
       - `static void invokeAll(ForkJoinTask<?> t1, ForkJoinTask<?> t2)`
     - quietly -- do not extract results or report exceptions, useful when expecting delayed processing of results or exceptions until all complete
       - `void quietlyComplete()`
       - `void quietlyInvoke()`
       - `void quietlyJoin()`
   - execution status
     - `boolean isCancelled()` -- in which case `getException()` returns a `CancellationException`
     - `boolean isCompletedAbnormally()`
     - `boolean isCompletedNormally()`
     - `boolean isDone()` -- normally, abnormally or cancelled
   - manage circular dependency
     - `void complete(V value)`  
       `void completeExceptionally(Throwable ex)`
     - `static void helpQuiesce()` -- Possibly executes tasks until the pool hosting the current task is quiescent.
   - extending -- extend one of the abstract classes that support a particular style of fork/join processing, defines a `compute` method that somehow uses the control methods supplied by this base class
     - tags -- for use of specialized subclasses
     - base `final` support methods -- should minimally implement protected methods
     - `java.util.concurrent.RecursiveAction` -- A recursive resultless `ForkJoinTask`
       ```java
       public abstract class RecursiveAction extends ForkJoinTask<Void>
       ```
     - `java.util.concurrent.RecursiveTask` -- A recursive result-bearing `ForkJoinTask`
       ```java
       public abstract class RecursiveTask<V> extends ForkJoinTask<V>
       ```
     - `java.util.concurrent.CountedCompleter` -- completed actions trigger other actions
       ```java
       public abstract class CountedCompleter<T> extends ForkJoinTask<T>
       ```
       - tbd <!-- TODO -->

1. `java.util.concurrent.ForkJoinPool` -- provides the entry point for submissions from non-`ForkJoinTask` clients, as well as management and monitoring operations
   ```java
   public class ForkJoinPool extends AbstractExecutorService
   ```
   - `static ForkJoinPool commonPool()` -- used by any `ForkJoinTask` that is not explicitly submitted to a specified pool, threads are slowly reclaimed during periods of non-use, and reinstated upon subsequent use
   - `static void managedBlock(ForkJoinPool.ManagedBlocker blocker)`
   - `ForkJoinPool.ManagedBlocker`
     ```java
     public static interface ManagedBlocker {
         boolean block() throws InterruptedException;
         boolean isReleasable();
     }
     ```

## Synchronizers

1. Memory consistency effects -- happen-before, see [volatile](#volatile-and-Atomics)

### Count

1. `java.util.concurrent.Semaphore` -- Allows a set of threads to wait until permits are available for proceeding, often used to restrict the number of threads than can access some (physical or logical) resource
   ```java
   public class Semaphore extends Object
   implements Serializable
   ```
   - use
     - permit -- a count, can be acquired or released, by any caller
     - binary semaphore -- mutex lock, but without ownership
     - multiple permits methods -- increased risk of indefinite postponement when used without `true` fairness
   - constructors
     - `Semaphore(int permits)`
     - `Semaphore(int permits, boolean fair)`
   - release -- Releases a permit, returning it to the semaphore
     - `void release()`
     - `void release(int permits)`
   - acquire -- Acquires a permit from this semaphore, blocking until one is available, or the thread is interrupted
     - `void acquire()`
     - `void acquire(int permits)`
     - `boolean tryAcquire()`
     - `boolean tryAcquire(int permits)`
     - `boolean tryAcquire(int permits, long timeout, TimeUnit unit)`
     - `boolean tryAcquire(long timeout, TimeUnit unit)`

1. `java.util.concurrent.CountDownLatch` -- Allows a set of threads to wait until a count has been decremented to 0, and the count cannot be increased
   ```java
   public class CountDownLatch extends Object
   ```
   - constructor -- `CountDownLatch(int count)`
   - `void await()` -- Causes the current thread to wait until the latch has counted down to zero and return immediately upon subsequent call, unless the thread is interrupted  
     `boolean await(long timeout, TimeUnit unit)`
   - `void countDown()` -- decrements the count of the latch, releasing all waiting threads if the count reaches zero
   - `long getCount()`

1. `java.util.concurrent.CyclicBarrier` -- Allows a set of threads to wait until a predefined count of them has reached a common barrier, and then optionally executes a barrier action
   ```java
   public class CyclicBarrier extends Object
   ```
   - all-or-none -- If a thread leaves a barrier point prematurely and exceptionally, all other threads waiting at that barrier point will also leave abnormally via `BrokenBarrierException` (or `InterruptedException` if they too were interrupted at about the same time)
   - constructors
     - `CyclicBarrier(int parties)`
     - `CyclicBarrier(int parties, Runnable barrierAction)`
   - `int await()` -- Waits until all parties have invoked `await` on this barrier, returns the arrival index of that thread at the barrier  
     `int await(long timeout, TimeUnit unit)`
   - `int getNumberWaiting()`
   - `int getParties()` -- the number of parties required to trip this barrier
   - `boolean isBroken()` -- Queries if this barrier is in a broken state
   - `void reset()`

1. `java.util.concurrent.Phaser` -- Like a cyclic barrier, but with a mutable party count, and can have multiple phases with phase number cycling from 0 to `Integer.MAX_VALUE`
   ```java
   public class Phaser extends Object
   ```
   - constructors
     - `Phaser()` -- 0 parties, phase number 0
     - `Phaser(int parties)`
     - `Phaser(Phaser parent)`
     - `Phaser(Phaser parent, int parties)`
   - registration -- change number of parties
     - `int register()` -- Adds a new unarrived party to this phaser
     - `int bulkRegister(int parties)` -- Adds the given number of new unarrived parties to this phaser
   - tree tiering -- children automatically register with and deregister from their parents according to the their numbers of registered parties
     - `Phaser getParent()` -- Returns the parent of this phaser, or null if none
     - `Phaser getRoot()` -- Returns the root ancestor of this phaser, which is the same as this phaser if it has no parent
   - arrive -- When the final party for a given phase arrives, an optional `onAdvance` is performed and the phase advances (phase number +1)
     - `int arrive()` -- Arrives at this phaser, without waiting for others to arrive
     - `int arriveAndAwaitAdvance()` -- Arrives at this phaser and awaits others
     - `int arriveAndDeregister()` -- Arrives at this phaser and deregisters from it without waiting for others to arrive
   - await -- wait at a specific phase, returns when the phaser advances to (or is already at) a different phase
     - `int awaitAdvance(int phase)` -- Awaits the phase of this phaser to advance from the given phase value, returning immediately if the current phase is not equal to the given phase value or this phaser is terminated
     - `int awaitAdvanceInterruptibly(int phase)`
     - `int awaitAdvanceInterruptibly(int phase, long timeout, TimeUnit unit)`
   - termination -- triggered when `onAdvance` returns `true`. Upon termination, all synchronization methods immediately return a negative integer and registration takes no effect
     - `void forceTermination()` -- Forces this phaser to enter termination state
     - `boolean isTerminated()` -- Returns true if this phaser has been terminated
   - monitoring
     - `int getArrivedParties()` -- Returns the number of registered parties that have arrived at the current phase of this phaser
     - `int getPhase()` -- Returns the current phase number
     - `int getRegisteredParties()` -- Returns the number of parties registered at this phaser
     - `int getUnarrivedParties()` -- Returns the number of registered parties that have not yet arrived at the current phase of this phaser
   - `protected boolean onAdvance(int phase, int registeredParties)` -- Overridable method to perform an action upon impending phase advance, and to control termination
     ```java
     return registeredParties == 0; // default implementation
     ```

### Data Exchange

1. `java.util.concurrent.Exchanger` -- Allows two threads to exchange objects when both are ready for the exchange, a bidirectional form of a `SynchronousQueue`
   ```java
   public class Exchanger<V> extends Object
   ```
   - `V exchange(V x)` -- Waits for another thread to arrive at this exchange point (unless the current thread is interrupted), and then transfers the given object to it, receiving its object in return
   - `V exchange(V x, long timeout, TimeUnit unit)`

1. `java.util.concurrent.SynchronousQueue` -- a mechanism that pairs up producer and consumer threads, a blocking queue in which each insert operation must wait for a corresponding remove operation by another thread, and vice versa
   ```java
   public class SynchronousQueue<E>
   extends AbstractQueue<E>
   implements BlockingQueue<E>, Serializable
   ```
   - empty queue -- no internal capacity
   - non-null
   - constructors
     - `SynchronousQueue()` -- LIFO for non-fair mode
     - `SynchronousQueue(boolean fair)` -- FIFO for fairness, performance is similar for this collection
   - `E poll()`  
     `E poll(long timeout, TimeUnit unit)`
   - `boolean offer(E e)`  
     `boolean offer(E e, long timeout, TimeUnit unit)`
   - other inherited methods

# Regex

1. the category of Unicode letters
   - [UTS #18: Unicode Regular Expressions](http://unicode.org/reports/tr18/#General_Category_Property)
   - [Regex Tutorial - Unicode Characters and Properties](https://www.regular-expressions.info/unicode.html)

1. `"\\PL"` is equivalent to `"\\P{L}"`
