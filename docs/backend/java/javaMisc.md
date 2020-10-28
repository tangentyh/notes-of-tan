# Text

1. `String` — see [`String`](./javaBasics.md#String)

1. `Character` — see also [char](./javaBasics.md#primitive-types)
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

# Logging

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

## Logger

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

## Log Levels and Records

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

## Handlers

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

### Filters

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

### Formatters

1. formatters — extends `Formatter`, used by handlers
   - `Handler::setFormatter`

1. `java.util.logging.Formatter`
   ```java
   public abstract class Formatter
   ```
   - `abstract String format(LogRecord record)`
   - more

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

# Security

1. security manager — `SecurityManager`
   - usage — no security manager installed by default, use with `System::setSecurityManager`, or CLI option `-Djava.security.manager`
   - permission checking — `SecurityException`
   - security policy, `java.security.Policy` — code sources to permission sets, `java.security.Permission`
     - protection domain — tbd
     - policy files — tbd
       - system property — `java.security.policy`, double equals sign (`==`) to exclude other standard policy files
   - Java Authentication and Authorization Service (JAAS) — `javax.security.auth.login.LoginContext`, tbd
     - login policies
   - tbd

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
