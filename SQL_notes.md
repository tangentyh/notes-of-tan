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
   - arithmetic operations -- All arithmetic is done using signed `BIGINT` or `DOUBLE` values, bear overflow awareness in mind
   - string-to-number conversion -- automatically, to `DOUBLE` or `BIGINT`
   - attributes
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
   - `CHAR` -- space right padded with `M` from 0 to 255 default 1
     ```
     CHAR[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - `CHAR(0)` -- only `NULL` and `''`
     - trailing spaces removed upon retrieval
       - no trailing space removal -- `SET sql_mode = 'PAD_CHAR_TO_FULL_LENGTH';`
   - `VARCHAR` -- variable length with `M` from 0 to 65535, but actual effective maximum length subject to charset and maximum row size (65535 B)
     ```
     VARCHAR(M) [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - length information -- stored with length prefix, 1 or 2 byte
   - `MEDIUMTEXT`, and `LONGTEXT` -- up to: 16 MB, 4 GB
     ```
     TINYTEXT [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - truncated when size exceeded
     - length information -- stored with length prefix
     - limitation when sorting or grouping `TEXT` -- only first 10 KB used
     - padded for index comparisons -- index entry comparisons are space-padded at the end
     - `TINYTEXT`, `TEXT` -- up to: 255 B, 65535 B; use `CHAR` and `VARCHAR` instead
     - `TEXT(M)` -- creates the column as the smallest type large enough to hold values `M` bytes long
   - binary strings
     - `CHARACTER SET binary` make character strings binary -- `CHAR` becomes `BINARY`, `VARCHAR` becomes `VARBINARY`, and `TEXT` becomes `BLOB`
     - `BINARY[(M)]` -- `CHAR CHARACTER SET binary`
     - `VARBINARY(M)` -- `VARCHAR` binary version
     - `MEDIUMBLOB`, `LONGBLOB`
       - `TINYBLOB`, `BLOB[(M)]`
   - `ENUM` -- a string object that can have only one value, can be `NULL` or the special `''` error value, up to 65535 distinct elements
     ```
     ENUM('value1','value2',...) [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - represented internally as integers
     - maximum element length -- `M <= 255` and another constraint
   - `SET` -- `ENUM` but a string object that can have zero or more values, `NULL` or `''` not permitted, and up to 64 distinct members

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
   - `FULL` -- an additional `Table_type` column, with values `BASE TABLE`, `VIEW` and `SYSTEM VIEW` (for `INFORMATION_SCHEMA`)
   - corresponding table in `INFORMATION_SCHEMA` -- `INFORMATION_SCHEMA.TABLES`
   - CLI
     - `mysqlshow db_name`

1. `SHOW CHARACTER SET`
   - corresponding table in `INFORMATION_SCHEMA` -- `INFORMATION_SCHEMA.CHARACTER_SETS`
   - hidden character set -- `filename`, internal use only
