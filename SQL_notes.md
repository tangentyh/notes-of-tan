# Docs

1. docs
   - [MySQL :: MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
   - man pages

1. help
   ```
   mysql> help
   ```

1. after `brew install`
   - secure with a root password -- `mysql_secure_installation`
   - connect
     ```shell
     mysql -uroot
     ```
   - start with `launchd`
     ```shell
     brew services start mysql
     ```
   - start without a background service
     ```shell
     mysql.server start
     ```

# CLI

1. mycli -- A Terminal Client for MySQL with AutoCompletion and Syntax Highlighting
   - [mycli at GitHub](https://github.com/dbcli/mycli)
   - [mycli docs](https://www.mycli.net/docs)
   - pager -- `nopager`, `pager less`, `pager more`

1. `mysql`
   ```
   mysql [options] [db_name]
   ```
   - authentication
     - `--user=user_name`, `-u user_name`
     - `--password[=password]`, `-p[password]`
   - privileges
     - `--skip-show-database` -- sets the `skip_show_database` system variable that controls who is permitted to use
   - case sensitivity -- see after
     - `--lower-case-table-names[=#]`
   - autocomplete -- `--auto-rehash`, `mysql> \#`, `mysql> rehash`

1. at `mysql>` -- statements should end with `;` if accidentally enters multiline mode
   - `quit`, `exit`
   - help
     ```
     HELP COMMAND
     HELP STATEMENT
     ```
   - open file
     ```
     \. <filename> | source <filename>
     ```

1. `mysqlshow`
   - `mysqlshow` -- `SHOW DATABASES`, `SHOW SCHEMAS`
   - `mysqlshow db_name` -- `SHOW TABLES`

1. `mysqladmin`

1. `mysqlsh` -- mysql shell, with JavaScript and Python support
   - [MySQL :: MySQL Shell 8.0 :: 1 MySQL Shell Features](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-features.html)
   - APIs
     - The X DevAPI -- work with both relational and document data
     - The AdminAPI -- work with InnoDB cluster

# Miscellanea

1. keys
   - primary key
     - compound key -- primary key consisting of two or more columns
     - natural key or surrogate key
   - foreign key

1. normalization -- refining a database design to ensure that each independent piece of information is in only one place (except for foreign keys)

1. case sensitivity
   - SQL statements -- case insensitive
   - table names -- depends on CLI option `--lower-case-table-names[=#]` or system variable `lower_case_table_names`, `1` suggested with lowercase storing and insensitive comparisons

1. comment
   - inline comment -- `--`, `#` (less commonly supported)
   - comment block: `/**/`

1. functions
   - dummy table for `FROM` -- `dual`
     ```SQL
     SELECT now();
     SELECT now() FROM dual; -- only option for some DBMS, like Oracle
     ```
   - `now()`

# Data Types

1. numeric
   - attributes
     - arithmetic operations -- All arithmetic is done using signed `BIGINT` or `DOUBLE` values, bear overflow awareness in mind
     - string-to-number conversion -- automatically, to `DOUBLE` or `BIGINT`
     - `SIGNED` by default, no effect when using
     - `UNSIGNED` -- deprecated for columns of type `FLOAT`, `DOUBLE`, and `DECIMAL` (and any synonyms), use `CHECK` instead
       - subtraction between integer values -- the result is unsigned if one of the two is `UNSIGNED`, unless `SET sql_mode = 'NO_UNSIGNED_SUBTRACTION'`
     - `ZEROFILL` -- deprecated, automatically `UNSIGNED` if used, use `LPAD()` or `CHAR` instead
   - `TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT` or `INTEGER`, `BIGINT` -- 1 B, 2 B, 3 B, 4 B, 8 B
     ```
     TINYINT[(M)] [UNSIGNED] [ZEROFILL]
     ```
     - `M` like in `TINYINT(1)` -- the maximum display width, unrelated to the range of values a type can store
     - `SERIAL` -- `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`
   - `BOOL`, `BOOLEAN` -- `TINYINT(1)`, zero for `FALSE`, nonzero for true, `TRUE` is 1
   - `DECIMAL`, `NUMERIC`, `DEC`, `FIXED` -- `M` for precision (total digits) up to 65 and defaults to 10, `D` for scale (fraction digits, no decimal point if 0), up to 30 and defaults to 0
     ```
     DECIMAL[(M[,D])] [ZEROFILL]
     ```
     - arithmetic operations -- done with `M` of 65
     - when more digits than permitted -- generally truncation
   - `FLOAT`, `DOUBLE`, `DOUBLE PRECISION`
     - deprecated -- `FLOAT(p)`, `FLOAT(M,D)`, `DOUBLE(M,D)`, `DOUBLE PRECISION[(M,D)]`
   - `BIT[(M)]` -- `M` indicates the number of bits from 1 (default) to 64
     - literal syntax -- `b'value'`, `x''`, like `b'111'`

1. date and time
   - attribute
     - invalid value -- zero value, out of range or otherwise invalid values are converted to zero value, except `TIME`, controlled by `sql_mode` `NO_ZERO_DATE`
     - zero date -- useful for applications that need to store birthdays for which you may not know the exact date, like `2009-00-00`, controlled by `sql_mode` `NO_ZERO_IN_DATE`
       - dummy date `0000-00-00` (zero value) -- sometimes more convenient than using `NULL` values, and uses less data and index space
     - `fsp` fractional seconds part -- defaults to 0, up to 6 (microsecond, standard SQL default), rounded for excessive values, controlled by `sql_mode` `TIME_TRUNCATE_FRACTIONAL`
     - automatic initialization and updating -- for `TIMESTAMP` or `DATETIME`
     - string and number -- accept both string and number when assigning, but need to convert to numbers (`TIME_TO_SEC()`, `TO_DAYS()`) before `SUM()` and `AVG()`
     - specify a time zone offset when inserting `TIMESTAMP` and `DATETIME` values -- suffices like `+08:00`, from `-14:00` to `+14:00`
       ```SQL
       INSERT INTO ts (col) VALUES ('2020-01-01 10:10:10'), ('2020-01-01 10:10:10+05:30'), ('2020-01-01 10:10:10-08:00');
       ```
     - conversion -- missing date as `CURRENT_DATE()`, missing time part as `00:00:00`, rounding
   - `DATE` -- from `'1000-01-01'` to `'9999-12-31'`
   - `DATETIME[(fsp)]` -- from `1000-01-01 00:00:00.000000'` to `'9999-12-31 23:59:59.999999'`
     - automatic initialization and updating -- `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE CURRENT_TIMESTAMP`, also synonyms of `CURRENT_TIMESTAMP`, the parameter as `fsp`
   - `TIMESTAMP[(fsp)]` -- in UTC, from `'1970-01-01 00:00:01.000000'` to `'2038-01-19 03:14:07.999999'`
     - automatic initialization and updating -- `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE CURRENT_TIMESTAMP`, also synonyms of `CURRENT_TIMESTAMP`, the parameter as `fsp`
     - `explicit_defaults_for_timestamp` system variable -- no automatic assignment of the `DEFAULT CURRENT_TIMESTAMP` or `ON UPDATE CURRENT_TIMESTAMP`
       - if off, the first `TIMESTAMP` column has these properties and `TIMESTAMP` columns `NOT NULL` (`NULL` assigns the current timestamp)
   - `TIME[(fsp)]` -- from `'-838:59:59.000000'` to `'838:59:59.000000'`, can also used for elapsed time or a time interval
     - out of range value -- clipped to the closest endpoint
     - invalid values -- converted to the zero value which itself is valid
     - number values -- as left padded with zero, like `1111` to `00:11:11`
   - `YEAR` -- from `1901` to `2155`, 1 byte

1. string
   - literal syntax
     ```
     [_charset_name] literal [COLLATE collation_name]
     ```
     ```SQL
     SELECT _utf8mb4'abc' COLLATE utf8mb4_danish_ci;
     SELECT _utf8mb4 0x4D7953514C COLLATE utf8mb4_danish_ci;
     ```
   - attribute
     - `CHARACTER SET`, `CHARSET` -- see `SHOW CHARACTER SET`, defaults to `utf8mb4` from version 8, `latin1` previously
       ```SQL
       CREATE TABLE t
       (
           c1 VARCHAR(20) CHARACTER SET utf8,
           c2 TEXT CHARACTER SET latin1 COLLATE latin1_general_cs
       );
       ```
       ```SQL
       create database european_sales character set latin1;
       ```
       - `ASCII` attribute -- shorthand for `CHARACTER SET latin1`
     - `COLLATE`
       - `CHAR BINARY` and `VARCHAR BINARY` -- use the binary (`_bin`) collation, like `utf8mb4_bin`
       - `PAD_ATTRIBUTE` -- many collation with `PAD SPACE`, with which strings are compared without regard to any trailing spaces (`LIKE` excluded), possible cause of duplicate-key errors
         ```
         mysql> SELECT myname = 'Jones', myname = 'Jones  ' FROM names;
         +--------------------+--------------------+
         | myname = 'Jones'   | myname = 'Jones  ' |
         +--------------------+--------------------+
         |                  1 |                  1 |
         +--------------------+--------------------+
         1 row in set (0.00 sec)
         ```
   - `CHAR` -- space right padded with `M` from 0 to 255 default 1
     ```
     CHAR[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - `CHAR(0)` -- only `NULL` and `''`
     - trailing spaces removed upon retrieval
       - no trailing space removal -- `SET sql_mode = 'PAD_CHAR_TO_FULL_LENGTH';`
     - when assigning size exceeded values -- truncated with warning if not in strict mode, error in strict mode for truncation of non-space characters
       - excessive trailing spaces -- truncated silently regardless of strict mode
     - variable-length off-page storage when ≥ 768 B -- InnoDB encodes fixed-length fields greater than or equal to 768 bytes in length as variable-length fields, which can be stored off-page, for example, `CHAR(255)` with `utf8mb4`
   - `VARCHAR` -- variable length with `M` from 0 to 65535, but actual effective maximum length subject to charset and maximum row size (65535 B)
     ```
     VARCHAR(M) [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - length information -- stored with length prefix, 1 or 2 byte
     - when assigning size exceeded values -- truncated with warning if not in strict mode, error in strict mode for truncation of non-space characters
       - excessive trailing spaces -- truncated with warning regardless of strict mode
   - `MEDIUMTEXT`, and `LONGTEXT` -- variable length up to: 16 MB, 4 GB
     ```
     TINYTEXT [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - `TINYTEXT`, `TEXT` -- up to: 255 B, 65535 B; use `CHAR` and `VARCHAR` instead
     - `TEXT(M)` -- creates the column as the smallest type large enough to hold values `M` bytes long
     - length information -- stored with length prefix
     - when assigning size exceeded values -- truncated with warning if not in strict mode, error in strict mode for truncation of non-space characters
       - excessive trailing spaces -- truncated with warning regardless of strict mode
     - `max_sort_length`, limitation when sorting or grouping `TEXT` -- `max_sort_length` defaults to 1024, in bytes
     - padded for index comparisons -- index entry comparisons are space-padded at the end
     - engine `MEMORY` does not support `TEXT` and `BLOB` -- forced to use on-disk temporary tables when temporary tables with columns of these types being used
     - separately allocated object -- represented internally by a separately allocated object, whereas for all other data types storage is allocated once per column when the table is opened
   - binary strings
     - `CHARACTER SET binary` make character strings binary -- `CHAR` becomes `BINARY`, `VARCHAR` becomes `VARBINARY`, and `TEXT` becomes `BLOB`
     - `BINARY[(M)]` -- `CHAR CHARACTER SET binary`, `0x00` (`\0`) right padded, and as integral part of the value (being compared and no removal upon retrieval)
     - `VARBINARY(M)` -- `VARCHAR` binary version
     - `MEDIUMBLOB`, `LONGBLOB` -- no padded index comparisons
       - `TINYBLOB`, `BLOB[(M)]`
   - `ENUM` -- a string object that can have only one value, can be `NULL` or the special `''` error value, up to 65535 distinct elements
     ```
     ENUM('value1','value2',...) [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - ordinal -- represented internally as integers starting from 1, `NULL` as `NULL` and `''` as 0
     - maximum element length -- `M <= 255` and another constraint
   - `SET` -- `ENUM` but a string object that can have zero or more values, `NULL` or `''` not permitted, and up to 64 distinct members
     - bit vectors internally

1. spatial

1. JSON

# Statements

1. statements
   - SQL schema statements
   - SQL data statements
   - SQL transaction statements

1. `USE db_name` -- use the named database as the default (current) database for subsequent statements

## SHOW

1. `SHOW` -- provide information about databases, tables, columns, or status information about the server
   - correspond to tables in `INFORMATION_SCHEMA` -- `SELECT` corresponding tables yields the same result
   - `WHERE` clause -- evaluated against the column names in the result

1. `SHOW DATABASES`, `SHOW SCHEMAS` -- lists the databases on the MySQL server host
   ```
   SHOW {DATABASES | SCHEMAS}
       [LIKE 'pattern' | WHERE expr]
   ```
   - CLI
     - `mysqlshow`
     - `mysql` option `--skip-show-database` -- sets the `skip_show_database` system variable that controls who is permitted to use
   - corrsponding table in `INFORMATION_SCHEMA` -- `INFORMATION_SCHEMA.SCHEMATA`

1. `SHOW TABLES` -- lists the non-`TEMPORARY` tables in a given database
   ```
   SHOW [EXTENDED] [FULL] TABLES
       [{FROM | IN} db_name]
       [LIKE 'pattern' | WHERE expr]
   ```
   - `EXTENDED` -- list hidden tables prefixed with `#sq1` created by failed `ALTER TABLE` statements
   - `FULL` -- an additional `Table_type` column, with values `BASE TABLE`, `VIEW` and `SYSTEM VIEW` (only for `INFORMATION_SCHEMA`)
   - corresponding table in `INFORMATION_SCHEMA` -- `INFORMATION_SCHEMA.TABLES`
   - CLI -- `mysqlshow db_name`

1. `SHOW TABLE STATUS` -- works likes SHOW TABLES, but provides a lot of information
   - CLI -- `mysqlshow --status db_name command`
   - corresponding table in `INFORMATION_SCHEMA` -- `INFORMATION_SCHEMA.TABLES`

1. `SHOW COLUMNS`
   ```
   SHOW [EXTENDED] [FULL] {COLUMNS | FIELDS}
       {FROM | IN} tbl_name
       [{FROM | IN} db_name]
       [LIKE 'pattern' | WHERE expr]
   ```
   - `EXTENDED` -- include information about hidden columns that MySQL uses internally and are not accessible by users
   - `FULL` -- include the column collation and comments, as well as the privileges
   - corresponding table in `INFORMATION_SCHEMA` -- `INFORMATION_SCHEMA.COLUMNS`
   - CLI -- `mysqlshow db_name tbl_name`
   - see also -- `DESCRIBE`

1. `SHOW CHARACTER SET`
   - corresponding table in `INFORMATION_SCHEMA` -- `INFORMATION_SCHEMA.CHARACTER_SETS`
   - hidden character set -- `filename`, internal use only

1. `SHOW VARIABLES` -- see [System Variables](#System-Variables)

# System Variables

1. `SHOW VARIABLES`
   ```
   SHOW [GLOBAL | SESSION] VARIABLES
       [LIKE 'pattern' | WHERE expr]
   ```
   - corresponding table in `PERFORMANCE_SCHEMA` -- `PERFORMANCE_SCHEMA.global_variables`, `PERFORMANCE_SCHEMA.session_variables`, `PERFORMANCE_SCHEMA.persisted_variables`, `PERFORMANCE_SCHEMA.variables_by_thread`, `PERFORMANCE_SCHEMA.variables_info`
   - CLI -- `mysqladmin variables`

1. `SET`
   ```SQL
   SET sql_mode='TIME_TRUNCATE_FRACTIONAL';
   SET @@sql_mode='TIME_TRUNCATE_FRACTIONAL';
   ```
   - `@@` -- indicate explicitly that a variable is a session variable
   - `@@global.`, `@@session.` prefixes

1. `sql_mode`, separated by `,`
   ```SQL
   SET @@sql_mode = sys.list_add(@@sql_mode, 'TIME_TRUNCATE_FRACTIONAL');
   ```
   - strict mode --  `STRICT_ALL_TABLES` or `STRICT_TRANS_TABLES`
     - effects -- warnings become errors, tbd at [5.1.11 Server SQL Modes](https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html#sql-mode-strict)
     - temporarily non-strict -- `INSERT IGNORE` or `UPDATE IGNORE`
   - `NO_UNSIGNED_SUBTRACTION`
   - `PAD_CHAR_TO_FULL_LENGTH`
   - `NO_ZERO_IN_DATE`

1. `time_zone`

# InnoDB

1. page
   - paging -- the size of the pages stay identical and exact, make data accessing fast
   - default page size -- 16 KB
   - stored off-page -- not stored in page, does not effect main index, but a 20 B pointer is stored

1. InnoDB Row Formats -- tbd
