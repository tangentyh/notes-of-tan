# SQL

Based on MySQL

## Docs

1. docs
   - [MySQL :: MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
   - man pages

1. help
   ```
   help
   HELP 'search_string'
   ```
   - corresponding table in `mysql` — `help_category`, `help_keyword`, `help_relation`, `help_topic`
   - the top-level help categories
     ```
     HELP 'contents'
     ```
   - topics in help categories — use the category name
     ```
     HELP 'data types'
     ```
   - keywords
     ```
     HELP 'ascii'
     HELP 'create table'
     ```

1. after `brew install`
   - secure with a root password — `mysql_secure_installation`
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

## CLI

1. mycli — A Terminal Client for MySQL with AutoCompletion and Syntax Highlighting
   - [mycli at GitHub](https://github.com/dbcli/mycli)
   - [mycli docs](https://www.mycli.net/docs)
   - pager — `nopager`, `pager less`, `pager more`

1. `mysql`
   ```
   mysql [options] [db_name]
   ```
   - authentication
     - `--user=user_name`, `-u user_name`
     - `--password[=password]`, `-p[password]`
   - privileges
     - `--skip-show-database` — sets the `skip_show_database` system variable that controls who is permitted to use
   - case sensitivity — see after
     - `--lower-case-table-names[=#]`
   - autocomplete — `--auto-rehash`, `mysql> \#`, `mysql> rehash`
   - output format
     - `--xml`
     - `--html`

1. at `mysql>` — statements should end with `;` if accidentally enters multiline mode
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
   - `mysqlshow` — `SHOW DATABASES`, `SHOW SCHEMAS`
   - `mysqlshow db_name` — `SHOW TABLES`

1. `mysqladmin`

1. `mysqlsh` — mysql shell, with JavaScript and Python support
   - [MySQL :: MySQL Shell 8.0 :: 1 MySQL Shell Features](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-features.html)
   - APIs
     - The X DevAPI — work with both relational and document data
     - The AdminAPI — work with InnoDB cluster

## Miscellanea

1. case sensitivity
   - SQL statements — case insensitive
   - database, trigger, table names — depends on file system and CLI option `--lower-case-table-names[=#]` or system variable `lower_case_table_names`, `1` suggested with lowercase storing and insensitive comparisons
   - table aliases — platform dependent

1. index — start from 1

## Data Types

1. numeric
   - attributes
     - arithmetic operations — All arithmetic is done using signed `BIGINT` or `DOUBLE` values, bear overflow awareness in mind
     - string-to-number conversion — automatically, to `DOUBLE` or `BIGINT`
     - `SIGNED` by default, no effect when using
     - `UNSIGNED` — deprecated for columns of type `FLOAT`, `DOUBLE`, and `DECIMAL` (and any synonyms), use `CHECK` instead
       - subtraction between integer values — the result is unsigned if one of the two is `UNSIGNED`, unless `sql_mode` `NO_UNSIGNED_SUBTRACTION`
     - `ZEROFILL` — deprecated, automatically `UNSIGNED` if used, use `LPAD()` or `CHAR` instead
   - `TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT` or `INTEGER`, `BIGINT` — 1 B, 2 B, 3 B, 4 B, 8 B
     ```
     TINYINT[(M)] [UNSIGNED] [ZEROFILL]
     ```
     - `M` like in `TINYINT(1)` — the maximum display width, unrelated to the range of values a type can store
     - `SERIAL` — `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`
   - `BOOL`, `BOOLEAN` — `TINYINT(1)`, zero for `FALSE`, nonzero for true, `TRUE` is 1
   - `DECIMAL`, `NUMERIC`, `DEC`, `FIXED` — `M` for precision (total digits) up to 65 and defaults to 10, `D` for scale (fraction digits, no decimal point if 0), up to 30 and defaults to 0
     ```
     DECIMAL[(M[,D])] [ZEROFILL]
     ```
     - arithmetic operations — done with `M` of 65
     - when more digits than permitted — generally truncation
   - `FLOAT`, `DOUBLE`, `DOUBLE PRECISION`
     - deprecated — `FLOAT(p)`, `FLOAT(M,D)`, `DOUBLE(M,D)`, `DOUBLE PRECISION[(M,D)]`
   - `BIT[(M)]` — `M` indicates the number of bits from 1 (default) to 64
     - literal syntax — see after

1. date and time
   - attribute
     - invalid value — zero value, out of range or otherwise invalid values are converted to zero value, except `TIME`, controlled by `sql_mode` `NO_ZERO_DATE`
     - zero date — useful for applications that need to store birthdays for which you may not know the exact date, like `2009-00-00`, controlled by `sql_mode` `NO_ZERO_IN_DATE`
       - dummy date `0000-00-00` (zero value) — sometimes more convenient than using `NULL` values, and uses less data and index space
     - `fsp` fractional seconds part — defaults to 0, up to 6 (microsecond, ANSI SQL default), rounded for excessive values, controlled by `sql_mode` `TIME_TRUNCATE_FRACTIONAL`
     - automatic initialization and updating — for `TIMESTAMP` or `DATETIME`
     - string and number — accept both string and number when assigning, but need to convert to numbers (`TIME_TO_SEC()`, `TO_DAYS()`) before `SUM()` and `AVG()`
     - specify a time zone offset when inserting `TIMESTAMP` and `DATETIME` values — suffices like `+08:00`, from `-14:00` to `+14:00`
       ```SQL
       INSERT INTO ts (col) VALUES ('2020-01-01 10:10:10'), ('2020-01-01 10:10:10+05:30'), ('2020-01-01 10:10:10-08:00');
       ```
     - conversion — missing date as `CURRENT_DATE()`, missing time part as `00:00:00`, rounding
   - `DATE` — from `'1000-01-01'` to `'9999-12-31'`
   - `DATETIME[(fsp)]` — from `1000-01-01 00:00:00.000000'` to `'9999-12-31 23:59:59.999999'`
     - automatic initialization and updating — `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE CURRENT_TIMESTAMP`, also synonyms of `CURRENT_TIMESTAMP`, the parameter as `fsp`
   - `TIMESTAMP[(fsp)]` — in UTC, from `'1970-01-01 00:00:01.000000'` to `'2038-01-19 03:14:07.999999'`
     - automatic initialization and updating — `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE CURRENT_TIMESTAMP`, also synonyms of `CURRENT_TIMESTAMP`, the parameter as `fsp`
     - `explicit_defaults_for_timestamp` system variable — no automatic assignment of the `DEFAULT CURRENT_TIMESTAMP` or `ON UPDATE CURRENT_TIMESTAMP`
       - if off, the first `TIMESTAMP` column has these properties and `TIMESTAMP` columns `NOT NULL` (`NULL` assigns the current timestamp)
   - `TIME[(fsp)]` — from `'-838:59:59.000000'` to `'838:59:59.000000'`, can also used for elapsed time or a time interval
     - out of range value — clipped to the closest endpoint
     - invalid values — converted to the zero value which itself is valid
     - number values — as left padded with zero, like `1111` to `00:11:11`
   - `YEAR` — from `1901` to `2155`, 1 byte

1. string
   - attribute
     - `CHARACTER SET`, `CHARSET` — see `SHOW CHARACTER SET`, defaults to `utf8mb4` from version 8, `latin1` previously
       ```SQL
       CREATE TABLE t
       (
           c1 VARCHAR(20) CHARACTER SET utf8,
           c2 TEXT CHARACTER SET latin1 COLLATE latin1_general_cs
       );
       ```
       ```SQL
       CREATE DATABASE european_sales CHARACTER SET latin1;
       ```
       - `ASCII` attribute — shorthand for `CHARACTER SET latin1`
     - `COLLATE`
       - `CHAR BINARY` and `VARCHAR BINARY` — use the binary (`_bin`) collation, like `utf8mb4_bin`
       - `PAD_ATTRIBUTE` — many collation with `PAD SPACE`, with which strings are compared without regard to any trailing spaces (`LIKE` excluded), possible cause of duplicate-key errors
         ```
         mysql> SELECT myname = 'Jones', myname = 'Jones  ' FROM names;
         +--------------------+--------------------+
         | myname = 'Jones'   | myname = 'Jones  ' |
         +--------------------+--------------------+
         |                  1 |                  1 |
         +--------------------+--------------------+
         ```
   - `CHAR` — space right padded with `M` from 0 to 255 default 1
     ```
     CHAR[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - `CHAR(0)` — only `NULL` and `''`
     - trailing spaces removed upon retrieval
       - no trailing space removal — `sql_mode` `PAD_CHAR_TO_FULL_LENGTH`
     - when assigning size exceeded values — truncated with warning if not in strict mode, error in strict mode for truncation of non-space characters
       - excessive trailing spaces — truncated silently regardless of strict mode
     - variable-length off-page storage when ≥ 768 B — InnoDB encodes fixed-length fields greater than or equal to 768 bytes in length as variable-length fields, which can be stored off-page, for example, `CHAR(255)` with `utf8mb4`
   - `VARCHAR` — variable length with `M` from 0 to 65535, but actual effective maximum length subject to charset and maximum row size (65535 B)
     ```
     VARCHAR(M) [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - length information — stored with length prefix, 1 or 2 byte
     - when assigning size exceeded values — truncated with warning if not in strict mode, error in strict mode for truncation of non-space characters
       - excessive trailing spaces — truncated with warning regardless of strict mode
   - `MEDIUMTEXT`, and `LONGTEXT` — variable length up to: 16 MB, 4 GB
     ```
     TINYTEXT [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - `TINYTEXT`, `TEXT` — up to: 255 B, 65535 B; use `CHAR` and `VARCHAR` instead
     - `TEXT(M)` — creates the column as the smallest type large enough to hold values `M` bytes long
     - length information — stored with length prefix
     - when assigning size exceeded values — truncated with warning if not in strict mode, error in strict mode for truncation of non-space characters
       - excessive trailing spaces — truncated with warning regardless of strict mode
     - `max_sort_length`, limitation when sorting or grouping `TEXT` — `max_sort_length` defaults to 1024, in bytes
     - padded for index comparisons — index entry comparisons are space-padded at the end
     - engine `MEMORY` does not support `TEXT` and `BLOB` — forced to use on-disk temporary tables when temporary tables with columns of these types being used
     - separately allocated object — represented internally by a separately allocated object, whereas for all other data types storage is allocated once per column when the table is opened
   - binary strings
     - `CHARACTER SET binary` make character strings binary — `CHAR` becomes `BINARY`, `VARCHAR` becomes `VARBINARY`, and `TEXT` becomes `BLOB`
     - `BINARY[(M)]` — `CHAR CHARACTER SET binary`, `0x00` (`\0`) right padded, and as integral part of the value (being compared and no removal upon retrieval)
     - `VARBINARY(M)` — `VARCHAR` binary version
     - `MEDIUMBLOB`, `LONGBLOB` — no padded index comparisons
       - `TINYBLOB`, `BLOB[(M)]`
   - `ENUM` — a string object that can have only one value, can be `NULL` or the special `''` error value, up to 65535 distinct elements
     ```
     ENUM('value1','value2',...) [CHARACTER SET charset_name] [COLLATE collation_name]
     ```
     - ordinal — represented internally as integers starting from 1, `NULL` as `NULL` and `''` as 0
     - maximum element length — `M <= 255` and another constraint
   - `SET` — `ENUM` but a string object that can have zero or more values, `NULL` or `''` not permitted, and up to 64 distinct members
     - bit vectors internally
     - literal — comma separated string, like `'a,b'`

1. spatial

1. JSON

## Statements

1. statements
   - SQL schema statements
     - DDL — Data Definition Language
   - SQL data statements
     - DML — Data Manipulation Language
   - SQL transaction statements
     - TCL — Transaction Control Language
   - DCL — Data Control Language, `GRANT`, `REVOKE`

1. `USE db_name` — use the named database as the default (current) database for subsequent statements
   - currently using — `DATABASE()`

### Inspection

#### SHOW

1. `SHOW` — provide information about databases, tables, columns, or status information about the server
   - correspond to tables in `INFORMATION_SCHEMA` — `SELECT` corresponding tables yields the same result
   - `WHERE` clause — evaluated against the column names in the result

1. show database information
   - `SHOW DATABASES`, `SHOW SCHEMAS` — lists the databases on the MySQL server host
     ```
     SHOW {DATABASES | SCHEMAS}
         [LIKE 'pattern' | WHERE expr]
     ```
     - CLI
       - `mysqlshow`
       - `mysql` option `--skip-show-database` — sets the `skip_show_database` system variable that controls who is permitted to use
     - corrsponding table in `INFORMATION_SCHEMA` — `INFORMATION_SCHEMA.SCHEMATA`
   - `SHOW CREATE DATABASE`
     ```
     SHOW CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
     ```

1. show table information
   - `SHOW TABLES` — lists the non-`TEMPORARY` tables in a given database
     ```
     SHOW [EXTENDED] [FULL] TABLES
         [{FROM | IN} db_name]
         [LIKE 'pattern' | WHERE expr]
     ```
     - `EXTENDED` — list hidden tables prefixed with `#sq1` created by failed `ALTER TABLE` statements
     - `FULL` — an additional `Table_type` column, with values `BASE TABLE`, `VIEW` and `SYSTEM VIEW` (only for `INFORMATION_SCHEMA`)
     - corresponding table in `INFORMATION_SCHEMA` — `INFORMATION_SCHEMA.TABLES`
     - CLI — `mysqlshow db_name`
   - `SHOW TABLE STATUS` — works likes SHOW TABLES, but provides a lot of information
     ```
     SHOW TABLE STATUS
         [{FROM | IN} db_name]
         [LIKE 'pattern' | WHERE expr]
     ```
     - CLI — `mysqlshow --status db_name command`
     - corresponding table in `INFORMATION_SCHEMA` — `INFORMATION_SCHEMA.TABLES`
   - `SHOW INDEX`
     ```
     SHOW [EXTENDED] {INDEX | INDEXES | KEYS}
         {FROM | IN} tbl_name
         [{FROM | IN} db_name]
         [WHERE expr]
     ```

1. `SHOW COLUMNS`
   ```
   SHOW [EXTENDED] [FULL] {COLUMNS | FIELDS}
       {FROM | IN} tbl_name
       [{FROM | IN} db_name]
       [LIKE 'pattern' | WHERE expr]
   ```
   - `EXTENDED` — include information about hidden columns that MySQL uses internally and are not accessible by users
   - `FULL` — include the column collation and comments, as well as the privileges
   - corresponding table in `INFORMATION_SCHEMA` — `INFORMATION_SCHEMA.COLUMNS`
   - CLI — `mysqlshow db_name tbl_name`
   - `SHOW CREATE TABLE`
     ```
     SHOW CREATE TABLE tbl_name
     ```
   - `DESCRIBE`
     ```
     {EXPLAIN | DESCRIBE | DESC}
         tbl_name [col_name | wild]
     ```

1. `SHOW CHARACTER SET`
   - corresponding table in `INFORMATION_SCHEMA` — `INFORMATION_SCHEMA.CHARACTER_SETS`
   - hidden character set — `filename`, internal use only

1. `SHOW VARIABLES` — see [System Variables](#System-Variables)

1. `SHOW ENGINE`

#### EXPLAIN

1. `EXPLAIN`, `DESCRIBE`, `DESC`
   - see `SHOW COLUMNS`
   - execution plan, usually `EXPLAIN` — displays information from the optimizer, i.e. how it would process the statement, including information about how tables are joined and in which order
     ```
     {EXPLAIN | DESCRIBE | DESC}
         [FORMAT = {TRADITIONAL | JSON | TREE}]
         {explainable_stmt | FOR CONNECTION connection_id}
     ```
     - `explainable_stmt` — `SELECT`, `DELETE`, `INSERT`, `REPLACE`, and `UPDATE`; also `TABLE` from MySQL 8.0.19
     - `FOR CONNECTION connection_id` — the last statement in the named connection
       - `connection_id` — `CONNECTION_ID()` for current session
     - `FORMAT`
       - `TRADITIONAL` — tabular
       - `TREE` — the only format which shows hash join usage
   - `EXPLAIN ANALYZE` — execution plan along with timing and additional, iterator-based, information about how the optimizer's expectations matched the actual execution
     ```
     {EXPLAIN | DESCRIBE | DESC} ANALYZE select_statement
     ```
     - `select_statement` — besides `SELECT`, also multi-table `UPDATE` and `DELETE` statements; also `TABLE` from MySQL 8.0.19

1. performance benchmark profiling
   - system variable `profiling`
     ```SQL
     SET profiling=1;
     SELECT SQL_NO_CACHE * FROM my_table;
     --- ...
     SHOW PROFILE;
     SET profiling=0;
     ```
   - `STATUS` starting with `Select`
     ```SQL
     FLUSH STATUS;
     SELECT SQL_NO_CACHE * FROM my_table;
     SHOW SESSION STATUS LIKE 'Select%';
     ```
   - `STATUS` `last_query_cost`
     ```SQL
     SHOW STATUS LIKE 'last_query_cost';
     ```

1. select optimization — tbd
   - big query refactor
     - 切分大查询 — 一个大查询如果一次性执行的话，可能一次锁住很多数据、占满整个事务日志、耗尽系统资源、阻塞很多小的但重要的查询。
     - 分解大连接查询 — 将一个大连接查询分解成对每一个表进行一次单表查询，然后在应用程序中进行关联，这样做的好处有：
       - 让缓存更高效。对于连接查询，如果其中一个表发生变化，那么整个查询缓存就无法使用。而分解后的多个查询，即使其中一个表发生变化，对其它表的查询缓存依然可以使用。
       - 分解成多个单表查询，这些单表查询的缓存结果更可能被其它查询使用到，从而减少冗余记录的查询。
       - 减少锁竞争；
       - 在应用层进行连接，可以更容易对数据库进行拆分，从而更容易做到高性能和可伸缩。

### DDL

1. DDL statements, atomic or otherwise, implicitly end any transaction that is active in the current session

#### CREATE TABLE

1. `CREATE TABLE`
   ```
   CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
       (create_definition,...)
       [table_options]
       [partition_options]
   ```
   - `TEMPORARY` — tbd, temporary tables kept until the end of transaction or session
   - `table_options`
     ```
     table_option [[,] table_option] ...
     ```
     - `table_option`
       - `AUTO_INCREMENT [=] value`
       - `COMMENT [=] 'string'`
       - more
   - more

1. `create_definition`
   ```
     col_name column_definition
   | {INDEX|KEY} [index_name] [index_type] (key_part,...)
       [index_option] ...
   | {FULLTEXT|SPATIAL} [INDEX|KEY] [index_name] (key_part,...)
       [index_option] ...
   | [CONSTRAINT [symbol]] PRIMARY KEY
       [index_type] (key_part,...)
       [index_option] ...
   | [CONSTRAINT [symbol]] UNIQUE [INDEX|KEY]
       [index_name] [index_type] (key_part,...)
       [index_option] ...
   | [CONSTRAINT [symbol]] FOREIGN KEY
       [index_name] (col_name,...)
       reference_definition
   | check_constraint_definition
   ```
   - syntax — column definition with constraint attributes or a sole constraint or index definition
   - `key_part` — `{col_name [(length)] | (expr)} [ASC | DESC]`, order matters
     - `length` — up to 767 bytes long for InnoDB tables that use the `REDUNDANT` or `COMPACT` row format, 3072 bytes for `DYNAMIC` or `COMPRESSED` row format
   - `check_constraint_definition`
     ```
     [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
     ```

1. `column_definition`
   ```
     data_type [NOT NULL | NULL] [DEFAULT {literal | (expr)} ]
       [AUTO_INCREMENT] [UNIQUE [KEY]] [[PRIMARY] KEY]
       [COMMENT 'string']
       [COLLATE collation_name]
       [COLUMN_FORMAT {FIXED|DYNAMIC|DEFAULT}]
       [STORAGE {DISK|MEMORY}]
       [reference_definition]
       [check_constraint_definition]
   | data_type
       [COLLATE collation_name]
       [GENERATED ALWAYS] AS (expr)
       [VIRTUAL | STORED] [NOT NULL | NULL]
       [UNIQUE [KEY]] [[PRIMARY] KEY]
       [COMMENT 'string']
       [reference_definition]
       [check_constraint_definition]
   ```

1. key / index
   ```
   index_type:
       USING {BTREE | HASH}
   index_option:
       KEY_BLOCK_SIZE [=] value
     | index_type
     | WITH PARSER parser_name
     | COMMENT 'string'
     | {VISIBLE | INVISIBLE}
   ```
   - `KEY | INDEX` — as index
   - `PRIMARY KEY` — implicitly `NOT NULL`, name is `PRIMARY`
   - `UNIQUE [INDEX|KEY]` — error when duplicate
   - `FOREIGN KEY` — only InnoDB and NDB tables support checking of foreign key constraints
     ```
     reference_definition:
         REFERENCES tbl_name (col_name,...)
         [ON DELETE reference_option]
         [ON UPDATE reference_option]
     reference_option:
         RESTRICT | CASCADE | SET NULL | NO ACTION
     ```
     - switch — system variable `foreign_key_checks`
     - `CASCADE` — delete or update from the parent table is cascaded to the matching rows in the child table; cascaded actions do not activate triggers
     - `SET NULL` — literally
     - `RESTRICT` or `NO ACTION` (default) — rejects the delete or update operation for the parent table if there is a related foreign key value in the referenced table
     - corresponding tables in `INFORMATION_SCHEMA` — `INFORMATION_SCHEMA.KEY_COLUMN_USAGE`, `INFORMATION_SCHEMA.INNODB_FOREIGN`, `INFORMATION_SCHEMA.INNODB_FOREIGN_COLS`
   - `FULLTEXT`, `SPATIAL` keys — tbd

#### ALTER TABLE, DROP TABLE

1. `ALTER TABLE`
   ```
   ALTER TABLE tbl_name
       [alter_specification [, alter_specification] ...]
       [partition_options]
   ```
   - `alter_specification` — one of below, see docs
     - `table_options`
     - add
       - add column
         ```
           ADD [COLUMN] col_name column_definition [FIRST | AFTER col_name]
         | ADD [COLUMN] (col_name column_definition,...)
         ```
       - add index key
         ```
           ADD {INDEX|KEY} [index_name] [index_type] (key_part,...) [index_option] ...
         | ADD [CONSTRAINT [symbol]] PRIMARY KEY [index_type] (key_part,...) [index_option] ...
         | ADD [CONSTRAINT [symbol]] UNIQUE [INDEX|KEY] [index_name] [index_type] (key_part,...) [index_option] ...
         | ADD [CONSTRAINT [symbol]] FOREIGN KEY [index_name] (col_name,...) reference_definition
         ```
     - delete
       ```
         DROP {CHECK|CONSTRAINT} symbol
       | DROP [COLUMN] col_name
       | DROP {INDEX|KEY} index_name
       | DROP PRIMARY KEY
       | DROP FOREIGN KEY fk_symbol
       ```

1. `DROP TABLE`

#### CREATE VIEW, PROCEDURE, FUNCTION, TRIGGER

1. `CREATE VIEW`
   ```
   CREATE
       [OR REPLACE]
       [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
       [DEFINER = user]
       [SQL SECURITY { DEFINER | INVOKER }]
       VIEW view_name [(column_list)]
       AS select_statement
       [WITH [CASCADED | LOCAL] CHECK OPTION]
   ```
   - `OR REPLACE` — literally
   - frozen after creation — for a `SELECT *` view on a table, new columns added to the table are unknown to the view, and errors when selecting from the view if relevent columns dropped from the table
   - updatable and insertable views — see docs
   - more

1. `CREATE PROCEDURE`
   ```
   CREATE
       [DEFINER = user]
       PROCEDURE sp_name ([proc_parameter[,...]])
       [characteristic ...] routine_body
   ```
   - `CURSOR` — MySQL supports cursors inside stored programs

1. `CREATE FUNCTION`
   ```
   CREATE
       [DEFINER = user]
       FUNCTION sp_name ([func_parameter[,...]])
       RETURNS type
       [characteristic ...] routine_body
   ```

1. `CREATE TRIGGER`

### DML

#### SELECT

1. `SELECT`
   ```
   SELECT
       [ALL | DISTINCT | DISTINCTROW ]
       [other_modifiers]
     select_expr [, select_expr] ...
       [FROM table_references [PARTITION partition_list]]
       [WHERE where_condition]
       [GROUP BY {col_name | expr | position}, ... [WITH ROLLUP]]
       [HAVING where_condition]
       [WINDOW window_name AS (window_spec) [, window_name AS (window_spec)] ...]
       [ORDER BY {col_name | expr | position} [ASC | DESC], ... [WITH ROLLUP]]
       [LIMIT {[offset,] row_count | row_count OFFSET offset}]
       [FOR {UPDATE | SHARE} [OF tbl_name [, tbl_name] ...]
           [NOWAIT | SKIP LOCKED] | LOCK IN SHARE MODE]
       [into_option]
   ```
   - in CTE — `SELECT` can start with a `WITH` clause to define common table expressions accessible within the `SELECT`
   - modifiers — affect the operation of the statement, modifiers beginning with `SQL_` are MySQL extensions
     - `ALL` (default), `DISTINCT` — `DISTINCT` implicitly sorts the data, `DISTINCTROW` is an alias
     - tbd — `HIGH_PRIORITY`, `STRAIGHT_JOIN`, `SQL_SMALL_RESULT`, `SQL_BIG_RESULT`, `SQL_BUFFER_RESULT`, `SQL_NO_CACHE`, `SQL_CALC_FOUND_ROWS`
   - `position` — column index, non-standard, deprecated
   - `FOR UPDATE`, `FOR SHARE` — locking reads

1. `select_expr` — the select list that indicates which columns to retrieve
   ```
   col_name [[AS] alias_name]
   ```
   - `col_name` — `col_name`, `tbl_name.col_name`, or `db_name.tbl_name.col_name`, `*`, `tbl_name.*`
     - single `*` — all columns from all tables, probable error when used with other items
     - `tbl_name.*` — all columns from the named table
   - alias and position scope — can be used in `GROUP BY`, `ORDER BY`, or `HAVING` clauses, but cannot be used in `WHERE` clause, because the column value might not yet be determined when the `WHERE` clause is executed
     ```SQL
     SELECT college, region AS r, seed AS s FROM tournament ORDER BY r, s;
     SELECT college, region, seed FROM tournament ORDER BY 2, 3;
     ```
   - `OVER` — see `WINDOW`

1. `into_option`, `INTO`
   ```
   {
       INTO OUTFILE 'file_name' [CHARACTER SET charset_name] export_options
     | INTO DUMPFILE 'file_name'
     | INTO var_name [, var_name] ...
   }
   ```
   - `var_list` — the number of variables must match the number of columns; the query should return a single row
   - `OUTFILE`
   - `DUMPFILE` — writes a single row to a file without any formatting
   - more

1. execution order — gross, subject to optimizer
   ```SQL
   SET @mysql_order := '';
   SELECT @mysql_order := CONCAT(@mysql_order," SELECT ")
   FROM (SELECT @mysql_order := CONCAT(@mysql_order," FROM ")) AS t1
       JOIN (SELECT @mysql_order := CONCAT(@mysql_order," JOIN1 ")) AS t ON ((SELECT @mysql_order := CONCAT(@mysql_order," ON1 ")) | (RAND() < 1))
       JOIN (SELECT @mysql_order := CONCAT(@mysql_order," JOIN2 ")) AS t2 ON ((SELECT @mysql_order := CONCAT(@mysql_order," ON2 ")) | (RAND() < 1))
   WHERE ((SELECT @mysql_order := CONCAT(@mysql_order," WHERE ")) | (RAND() < 1))
   GROUP BY (SELECT @mysql_order := CONCAT(@mysql_order," GROUP_BY "))
   HAVING (SELECT @mysql_order := CONCAT(@mysql_order," HAVING "))
   ORDER BY (SELECT @mysql_order := CONCAT(@mysql_order," ORDER_BY "));
   SELECT @mysql_order;
   ```
   ```
   FROM  JOIN1  JOIN2  WHERE  ON2  ON1  SELECT  ORDER_BY  GROUP_BY  HAVING
   ```
   - execution order defined in ANSI SQL — `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT`, `ORDER BY`

##### FROM, JOIN

1. `FROM` — the table or tables from which to retrieve rows
   ```
   [FROM table_references [PARTITION partition_list]]
   ```
   - `PARTITION` — partition selection
   - `table_references`
     ```
     table_reference [, table_reference] ...
     ```

1. `table_reference` in `FROM`, simplified
   ```
   tbl_name [[AS] alias] [index_hint_list]
   ```
   - `tbl_name` — `tbl_name`, or `db_name.tbl_name`
     - derived tables
       ```SQL
       FROM (SELECT first_name, last_name, email
        FROM customer WHERE first_name = 'JESSIE'
       ) AS cust;
       ```
   - `JOIN` — join if more than one table specified
   - `DUAL` — dummy table name, for rows computed without reference to any table
   - `index_hint_list` — give the optimizer information about how to choose indexes during query processing

1. `table_reference` in `FROM`
   ```
   table_factor | joined_table
   ```
   - `table_factor`
     ```
     tbl_name [PARTITION (partition_names)]
         [[AS] alias] [index_hint_list]
     | table_subquery [AS] alias [(col_list)]
     | ( table_references )
     ```
     - `( table_references )` — MySQL extension to allow a list instead of a single `table_reference`, each comma is considered as equivalent to an inner join
     - `index_hint_list`
       ```
       index_hint_list:
           index_hint [, index_hint] ...
       index_hint:
           USE {INDEX|KEY}
             [FOR {JOIN|ORDER BY|GROUP BY}] ([index_list])
         | {IGNORE|FORCE} {INDEX|KEY}
             [FOR {JOIN|ORDER BY|GROUP BY}] (index_list)
       index_list:
           index_name [, index_name] ...
       ```
     - `col_list` — a list of names for the derived table columns

1. `joined_table` in `table_reference`
   ```
   joined_table:
       table_reference {[INNER | CROSS] JOIN | STRAIGHT_JOIN} table_factor [join_specification]
     | table_reference LEFT [OUTER] JOIN table_reference join_specification
     | table_reference NATURAL [INNER | LEFT [OUTER]] JOIN table_factor
   ```
   - special joins
     - tables joined multiple times — use alias for name resolving
     - self joins — when self-referencing foreign keys exist, like a prequel column in a film table
   - cross join or inner join, order of `table_reference` or `table_factor` does not matter
     - `CROSS JOIN` — Cartesian product, all permutations, no `join_specification`
     - `INNER JOIN` — only matches matching `join_specification`, multiple records if multiple matches
     - MySQL extension — `JOIN`, `INNER JOIN`, `CROSS JOIN` are equivalent syntactically, although not semantically
     - `STRAIGHT_JOIN` — like `JOIN`, but the left table is always read before the right table
   - `LEFT [OUTER] JOIN` — `NULL` if no matching
   - `NATURAL [...] JOIN` — equivalent to an `INNER JOIN` or a `LEFT JOIN` with a `USING` clause that names all columns that exist in both tables
   - `join_specification`
     ```
     ON search_condition | USING (join_column_list)
     ```
     - `search_condition` — filtering like `WHERE`
     - `join_column_list` — list of columns that must exist in both tables
       ```
       column_name [, column_name] ...
       ```
     - `USING` vs `ON` — `USING` with redundant column elimination, `ON` without
       - redundant column elimination — by `COALESCE()` columns with the same name, as in outer joins `NULL` if no matching
         ```
         COALESCE(a.c1, b.c1), COALESCE(a.c2, b.c2), COALESCE(a.c3, b.c3)
         a.c1, a.c2, a.c3, b.c1, b.c2, b.c3
         ```

##### UNION

1. `UNION`
   ```
   SELECT ...
   UNION [ALL | DISTINCT] SELECT ...
   [UNION [ALL | DISTINCT] SELECT ...]
   ```
   - order — unordered, intermediate `ORDER BY` are optimized out when without `LIMIT`
   - column name and type — names taken from the first `SELECT`; corresponding columns should be the same type, otherwise determined by all values of the column
   - `ALL` or `DISTINCT` — `DISTINCT` by default, duplicate rows removed; when mixed, a `DISTINCT` union overrides any `ALL` union to its left
   - additional column — help determine which `SELECT` each row comes from, and by which optionally order
     ```SQL
     (SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
     UNION
     (SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col;
     ```

1. `INTERSECT` — ANSI SQL but not in MySQL

1. `EXCEPT` — ANSI SQL but not in MySQL

#### Filtering, Ordering, Grouping, Limiting

1. `WHERE` `where_condition` — an expression that evaluates to true for each row to be selected
   - no aggregate functions — can use any of the functions and operators, except for aggregate (summary) functions
   - see [Operators and Functions](#Operators-and-Functions)

1. `GROUP BY`, `ORDER BY`
   - `ORDER BY` — defaults to `ACS`, outermost one take precedence if used in nested multiple subqueries
     - resolve unqualified column or alias — by searching in the `select_expr` values, then in the columns of the tables in the `FROM` clause
   - `GROUP BY`
     - resolve unqualified column or alias — reverse order of `ORDER BY`
     - implicit groups — all rows as a implicit group when no `GROUP BY` clause present
     - `sql_mode` `ONLY_FULL_GROUP_BY` — reject queries for which the select list, `HAVING` condition, or `ORDER BY` list refer to non-aggregated columns that are neither named in the `GROUP BY` clause nor are functionally dependent on (uniquely determined by) `GROUP BY` columns
     - `ANY_VALUE(arg)` — suppress the test for nondeterminism, equivalent to disable `sql_mode` `ONLY_FULL_GROUP_BY`; use when a selected non-aggregated column is effectively functionally dependent on a `GROUP BY` column by MySQL cannot determine it
     - `WITH ROLLUP` — produce another (super-aggregate) row for each `GROUP BY` column
       ```
       mysql> SELECT year, SUM(profit) AS profit
              FROM sales
              GROUP BY year WITH ROLLUP;
       +------+--------+
       | year | profit |
       +------+--------+
       | 2000 |   4525 |
       | 2001 |   3010 |
       | NULL |   7535 |
       +------+--------+
       ```
       - name super-aggregate row — `GROUPING(expr [, expr] ...)` return a bit vector, big endian, 1 when super-aggregate
         ```SQL
         SELECT
           IF(GROUPING(year), 'All years', year) AS year,
           IF(GROUPING(country), 'All countries', country) AS country,
           IF(GROUPING(product), 'All products', product) AS product,
           SUM(profit) AS profit
         FROM sales
         GROUP BY year, country, product WITH ROLLUP;
         ```
     - no aggregation in `SELECT` clause — return first row of a group
       ```SQL
       SELECT Email FROM Person GROUP BY Email HAVING COUNT(Email) > 1;
       ```
   - `max_sort_length` system variable — only `max_sort_length` bytes compared

1. `HAVING`
   - for filter after `GROUP BY` — must reference only columns in the `GROUP BY` clause or columns used in aggregate functions
     - extended in MySQL — permits `HAVING` to refer to columns in the `SELECT` list and columns in outer subqueries as well
     - applied nearly last (before `LIMIT`), with no optimization

1. `LIMIT` — outermost one take precedence if used in nested multiple subqueries
   - `offset` — use 0 to include first row
   - up to end — use a large number `row_count`

##### WINDOW

1. `WINDOW` — windows for window functions, tbd
   - `WINDOW` clause in `SELECT`
     ```
     [WINDOW window_name AS (window_spec) [, window_name AS (window_spec)] ...]
     ```
   - `over_clause` in aggregation and window functions
     ```
     over_clause:
         {OVER (window_spec) | OVER window_name}
     ```
     - `window_spec`
       ```
       window_spec:
           [window_name] [partition_clause] [order_clause] [frame_clause]
       ```
       - empty — all rows
       - `partition_clause` — like `GROUP BY`, differs from table partitioning
         ```
         PARTITION BY expr [, expr] ...
         ```
       - `order_clause` — applies within individual partitions
         ```
         ORDER BY expr [ASC|DESC] [, expr [ASC|DESC]] ...
         ```
       - `frame_clause` — a subset of the current partition, see below

1. `frame_clause` — a subset of the current partition, enabling move within a partition depending on the location of the current row
   ```
   frame_clause:
       frame_units frame_extent
   ```
   - limitation — some window functions operate on the entire partition, frames are ignored for them
   - `frame_units`
     ```
     {ROWS | RANGE}
     ```
     - `ROWS` — the frame is defined by beginning and ending row positions
     - `RANGE` — the frame is defined by rows within a value range
   - `frame_extent`
     ```
     frame_extent:
         {frame_start | BETWEEN frame_start AND frame_end}
     frame_start, frame_end: {
         CURRENT ROW
       | UNBOUNDED PRECEDING
       | UNBOUNDED FOLLOWING
       | expr PRECEDING
       | expr FOLLOWING
     }
     ```
     - single `frame_start` — `CURRENT ROW` is implicitly the end
     - `BETWEEN` — `frame_start` must not occur later than `frame_end`
   - default frame depends on `ORDER BY`
     - with `ORDER BY`
       ```
       RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ```
     - without `ORDER BY`
       ```
       RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ```
   - example
     ```
     ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
     ```

1. example
   ```SQL
   SELECT
     val,
     ROW_NUMBER()   OVER w AS 'row_number',
     CUME_DIST()    OVER w AS 'cume_dist',
     PERCENT_RANK() OVER w AS 'percent_rank',
     SUM(val)       OVER () AS total_profit
   FROM numbers
   WINDOW w AS (ORDER BY val);
   ```

#### Subqueries

1. subqueries
   - return type — scalar, column, row, and table
   - parentheses — even in functions, like `UPPER((SELECT s1 FROM t1))`
   - correlated subquery — a subquery that contains a reference to a table that also appears in the outer query
   - limitations — see docs

1. row constructors — `(1, 2)` or `ROW(1, 2)`, scalar if only one column

1. comparaison subqueries
   - subquery type when no modifiers — correspondent. For a comparison of the subquery to a scalar, the subquery must return a scalar. For a comparison of the subquery to a row constructor, the subquery must be a row subquery that returns a row with the same number of values as the row constructor
     ```
     non_subquery_operand comparison_operator (subquery)
     ```
     - `NULL` when empty
   - `ANY`, `IN`, `SOME`
     ```
     operand comparison_operator { ANY | SOME } (subquery)
     operand IN (subquery)
     ```
   - `ALL` — `TRUE` when empty subquery, `UNKNOWN` when containing `NULL`
     ```
     operand comparison_operator ALL (subquery)
     ```
     - `NULL` when empty and aggregated
       ```SQL
       SELECT * FROM t1 WHERE 1 > ALL (SELECT MAX(s1) FROM t2);
       ```

1. `EXISTS` or `NOT EXISTS` — whether a subquery is empty
   - example: What kind of store is present in all cities?
     ```SQL
     SELECT DISTINCT store_type FROM stores s1
       WHERE NOT EXISTS (
         SELECT * FROM cities WHERE NOT EXISTS (
           SELECT * FROM cities_stores
            WHERE cities_stores.city = cities.city
     AND cities_stores.store_type = stores.store_type));
     ```

1. derived table
   ```
   SELECT ... FROM (subquery) [AS] tbl_name [(col_list)] ...
   ```
   - alias — mandatory, because every table in a `FROM` clause must have a name
   - `col_list` — names for the derived table, must cover all columns
   - limitation — prior to MySQL 8.0.14, a derived table cannot contain outer references
   - example
     ```SQL
     select Num as 'ConsecutiveNums' from
         `Logs`,
         (select @cnt := 0, @prev := 0) as _init
     where (@cnt := IF(@prev = (@prev := Num), @cnt + 1, 1)) = 3;
     ```
   - `LATERAL` — can refer to columns from other tables, “this derived table depends on previous tables on its left side”
     - example — solve the problem that max value would be calculated twice if using subqueries in `SELECT` clause, because a subquery in `SELECT` clause can only produce one column
       ```SQL
       SELECT
         salesperson.name,
         max_sale.amount,
         max_sale_customer.customer_name
       FROM
         salesperson,
         — calculate maximum size, cache it in transient derived table max_sale
         LATERAL
         (SELECT MAX(amount) AS amount
           FROM all_sales
           WHERE all_sales.salesperson_id = salesperson.id)
         AS max_sale,
         — find customer, reusing cached maximum size
         LATERAL
         (SELECT customer_name
           FROM all_sales
           WHERE all_sales.salesperson_id = salesperson.id
           AND all_sales.amount =
               — the cached maximum size
               max_sale.amount)
         AS max_sale_customer;
       ```

#### WITH (Common Table Expressions, CTE)

1. CTE — a named temporary result set that exists within the scope of a single statement, from MySQL 8.0
   - use
     - at the beginning of `SELECT`, `UPDATE`, and `DELETE` statements
       ```
       WITH ... SELECT ...
       WITH ... UPDATE ...
       WITH ... DELETE ...
       ```
       - CTE not updatable — need to refer to the original table to update / delete rows, use CTE in other clauses or joining CTE with original table one-to-one as workaround
     - at the beginning of subqueries
       ```
       SELECT ... WHERE id IN (WITH ... SELECT ...) ...
       SELECT * FROM (WITH ... SELECT ...) AS dt ...
       ```
     - immediately preceding SELECT for statements that include a SELECT statement
       ```
       INSERT ... WITH ... SELECT ...
       REPLACE ... WITH ... SELECT ...
       CREATE TABLE ... WITH ... SELECT ...
       CREATE VIEW ... WITH ... SELECT ...
       DECLARE CURSOR ... WITH ... SELECT ...
       EXPLAIN ... WITH ... SELECT ...
       ```

1. `WITH`
   ```
   with_clause:
       WITH [RECURSIVE]
           cte_name [(col_name [, col_name] ...)] AS (subquery)
           [, cte_name [(col_name [, col_name] ...)] AS (subquery)] ...
   ```
   - more tbd
   - example
     ```SQL
     WITH
       cte1 AS (SELECT a, b FROM table1),
       cte2 AS (SELECT c, d FROM table2)
     SELECT b, d FROM cte1 JOIN cte2
     WHERE cte1.a = cte2.c;
     ```

#### DELETE

1. `DELETE` syntax
   - single table delete
     ```
     DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM tbl_name [[AS] tbl_alias]
         [PARTITION (partition_name [, partition_name] ...)]
         [WHERE where_condition]
         [ORDER BY ...]
         [LIMIT row_count]
     ```
     - `ORDER BY` — delete by the order specified
   - multiple table delete
     ```
     DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
         tbl_name[.*] [, tbl_name[.*]] ...
         FROM table_references
         [WHERE where_condition]
     ```
     ```
     DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
         FROM tbl_name[.*] [, tbl_name[.*]] ...
         USING table_references
         [WHERE where_condition]
     ```
     - target — matching rows
     - alias coerced when declared, can only be declared in `table_references`
       ```SQL
       DELETE t1 FROM test AS t1, test2 WHERE ...
       ```

1. `DELETE` attributes
   - subqueries — cannot delete from a table and select from the same table in a subquery
     - workaround — intermediate cache
       ```SQL
       delete from Person where Person.Id not in (select * from (select min(Id) from Person group by Email) as _temp);
       ```
       - still error if optimizer optimize out the subquery — see [release notes](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-6.html#mysqld-5-7-6-optimizer) for details and workarounds
     - workaround — use CTE
       ```SQL
       with
           rem as (select min(Id) as id from Person group by Email)
       delete from Person where Person.Id not in (select * from rem);
       ```
   - modifiers — `LOW_PRIORITY`, `QUICK`, `IGNORE`, see docs
   - keep desired in lieu of delete unwanted
     ```SQL
     INSERT INTO t_copy SELECT * FROM t WHERE ... ;
     RENAME TABLE t TO t_old, t_copy TO t;
     DROP TABLE t_old;
     ```

#### UPDATE

1. `UPDATE`
   ```
   value:
       {expr | DEFAULT}
   assignment:
       col_name = value
   assignment_list:
       assignment [, assignment] ...
   ```
   - single table `UPDATE`
     ```
     UPDATE [LOW_PRIORITY] [IGNORE] table_reference
         SET assignment_list
         [WHERE where_condition]
         [ORDER BY ...]
         [LIMIT row_count]
     ```
   - multi-table update — each matching row is updated once
     ```
     UPDATE [LOW_PRIORITY] [IGNORE] table_references
         SET assignment_list
         [WHERE where_condition]
     ```

#### INSERT

1. `INSERT` syntax
   ```
   value_list:
       value [, value] ...
   value:
       {expr | DEFAULT}
   assignment:
       col_name = [row_alias.]value
   assignment_list:
       assignment [, assignment] ...
   ```
   - `INSERT ... VALUES`
     ```
     INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
         [INTO] tbl_name
         [PARTITION (partition_name [, partition_name] ...)]
         [(col_name [, col_name] ...)]
         { VALUES (value_list) [, (value_list)] ...
           |
           VALUES ROW(value_list)[, ROW(value_list)][, ...]
         }
         [AS row_alias[(col_alias [, col_alias] ...)]]
         [ON DUPLICATE KEY UPDATE assignment_list]
     ```
   - `INSERT ... SET`
     ```
     INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
         [INTO] tbl_name
         [PARTITION (partition_name [, partition_name] ...)]
         [AS row_alias[(col_alias [, col_alias] ...)]]
         SET assignment_list
         [ON DUPLICATE KEY UPDATE assignment_list]
     ```
   - `INSERT ... SELECT` — insert many rows into a table from the result of a `SELECT` statement
     ```
     INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
         [INTO] tbl_name
         [PARTITION (partition_name [, partition_name] ...)]
         [(col_name [, col_name] ...)]
         [AS row_alias[(col_alias [, col_alias] ...)]]
         {SELECT ... | TABLE table_name}
         [ON DUPLICATE KEY UPDATE assignment_list]
     ```

1. clauses in `INSERT`
   - resort to update when not permitted duplicates — update using `assignment_list` when a duplicate value in a `UNIQUE` index or `PRIMARY KEY`
     ```
     [ON DUPLICATE KEY UPDATE assignment_list]
     ```
   - refer to previous columns
     ```SQL
     INSERT INTO tbl_name (col1,col2) VALUES(15,col1*2);
     ```

### TCL

#### Transactions

1. `START TRANSACTION` or `BEGIN` — start a new transaction
   ```
   START TRANSACTION
       [transaction_characteristic [, transaction_characteristic] ...]
   transaction_characteristic: {
       WITH CONSISTENT SNAPSHOT
     | READ WRITE
     | READ ONLY
   }
   ```
   - `WITH CONSISTENT SNAPSHOT` — starts a consistent read; the effect is the same as issuing a `START TRANSACTION` followed by a `SELECT` from any InnoDB table
   - `READ WRITE`, `READ ONLY` — set the transaction access mode; in `READ ONLY` mode, MySQL enables extra optimizations for queries on InnoDB tables, the transaction can still modify or lock `TEMPORARY` tables
   - implicit commits — beginning a transaction and some statements including DDLs causes any pending transaction to be committed
   - implicit unlock — beginning a transaction also causes table locks acquired with `LOCK TABLES` to be released, as though you had executed `UNLOCK TABLES`
   - `BEGIN [WORK]` — aliases of `START TRANSACTION`

1. `COMMIT`, and `ROLLBACK` statements
   ```
   COMMIT [WORK] [AND [NO] CHAIN] [[NO] RELEASE]
   ROLLBACK [WORK] [AND [NO] CHAIN] [[NO] RELEASE]
   SET autocommit = {0 | 1}
   ```
   - `COMMIT` — commits the current transaction, making its changes permanent, stored in the binary log in one chunk??
   - `ROLLBACK` — rolls back the current transaction, canceling its changes
     - DDL cannot be rolled back
   - `SET autocommit` — disables or enables the default autocommit mode for the current session
     - defaults to `1` — each statement is atomic, as if it were surrounded by `START TRANSACTION` and `COMMIT`
   - `WORK` — optional
   - after completion
     - `AND CHAIN` — a new transaction to begin with the same isolation level and access mode as soon as the current one ends
     - `RELEASE` — causes the server to disconnect the current client session after terminating the current transaction
     - `NO` — negate
     - system variable `completion_type`

1. `SAVEPOINT`
   ```
   SAVEPOINT identifier
   ROLLBACK [WORK] TO [SAVEPOINT] identifier
   RELEASE SAVEPOINT identifier
   ```
   - `identifier` — overwrite when collison
   - `ROLLBACK TO` — without terminating the transaction, changes are undone, but InnoDB does not release the row locks that were stored in memory after the savepoint, except new insert rows; later save points discarded
   - `RELEASE SAVEPOINT` — delete a save point
   - deconstruction — all deleted after single `COMMIT` or `ROLLBACK`

#### SET TRANSACTION

1. `SET TRANSACTION`
   ```
   SET [GLOBAL | SESSION] TRANSACTION
       transaction_characteristic [, transaction_characteristic] ...
   transaction_characteristic: {
       ISOLATION LEVEL level
     | access_mode
   }
   ```
   - `GLOBAL` or `SESSION` — global scope, or session scope, defaults to only next transaction within the same session
   - `access_mode`
     - `READ WRITE` (default)
     - `READ ONLY`

1. `level` — isolation levels for InnoDB, relax to minimize the amount of overhead for locking
   - `SERIALIZABLE` — like `REPEATABLE READ`, but all reads are implicitly locking reads
   - `REPEATABLE READ` (default)
     - consistent read — read the snapshot established by the first read
     - for locking reads (`SELECT` with `FOR UPDATE` or `FOR SHARE`), `UPDATE`, and `DELETE` statements — next-key locks, record locks, gap locks, see docs
   - `READ COMMITTED`
     - consistent read — read the snapshot that is reset to the time of each consistent read operation
     - for locking reads (`SELECT` with `FOR UPDATE` or `FOR SHARE`), `UPDATE`, and `DELETE` statements — record locks; gap locking is only used for foreign-key constraint checking and duplicate-key checking, see docs
   - `READ UNCOMMITTED` — no consistent read; otherwise like `READ COMMITTED`

1. check current `level` — `SHOW VARIABLES LIKE '%iso%'`

#### Locks

1. instance lock — prevents files from being created, renamed, or removed
   ```
   LOCK INSTANCE FOR BACKUP
   UNLOCK INSTANCE
   ```

1. table lock — explicitly acquires table locks for the current client session
   ```
   LOCK TABLES
       tbl_name [[AS] alias] lock_type
       [, tbl_name [[AS] alias] lock_type] ...
   lock_type: {
       READ [LOCAL]
     | [LOW_PRIORITY] WRITE
   }
   UNLOCK TABLES
   ```
   - more

1. show lock
   - `SHOW ENGINE INNODB STATUS`
   - `SHOW OPEN TABLES`

### Dynamic SQL

1. prepared statements
   - merits
     - less overhead for parsing the statement each time it is executed
     - protection against SQL injection attacks
   - scope — session specific if created in a session, global if created in a stored routine
   - control — system variable `max_prepared_stmt_count`
   - allowed statements — see docs

1. `PREPARE`
   ```
   PREPARE stmt_name FROM preparable_stmt
   ```
   - `preparable_stmt` — string literal or a user variable of a single SQL statement, `?` as parameter markers, keywords and identifiers cannot be parameters
   - implicit `DEALLOCATE` — prepared statements with the same `stmt_name` are deallocated implicitly

1. `EXECUTE`
   ```
   EXECUTE stmt_name [USING @var_name [, @var_name] ...]
   ```

1. `DEALLOCATE PREPARE`
   ```
   {DEALLOCATE | DROP} PREPARE stmt_name
   ```

## Language Structure

### Identifiers, User Variables and Comments

1. comment
   - inline comment — `--`, `#` (less commonly supported)
   - comment block: `/**/`
     - `/*! */` — MySQL-specific code
       ```
       /*![version] MySQL-specific code */
       ```
     - `/*+ */` — optimizer hints

1. identifiers
   <!-- markdownlint-disable MD033 -->
   - identifier quote — the <code>\`</code> character
     - also `"` if `sql_mode` `ANSI_QUOTES` — Treat `"` as an identifier quote character and not as a string quote character
     - escape backtick — <code>\`\`</code>
   - identifier characters
     - permitted characters when unquoted — `[$_0-9a-zA-Z\x80-\uFFFF]`, cannot be all numbers
     - permitted characters when quoted — `[\x01-\uFFFF]`
     - Database, table, and column names cannot end with space characters
   - qualifier — `schema_name.func_name()`, <code>\`my-table\`.\`my-column\`</code>
   - mapping to filenames — refer to docs

1. user defined variables — session specific
   ```
   SET @var_name = expr [, @var_name = expr] ...
   SET @var_name := expr [, @var_name = expr] ...
   ```
   - `@var_name`, `@'my-var'`, `@"my-var"`, or <code>@\`my-var\`</code>
   <!-- markdownlint-enable MD033 -->
   - corresponding table in `PERFORMANCE_SCHEMA` — `PERFORMANCE_SCHEMA.user_variables_by_thread`
   - supported data types — integer, decimal (no precision), floating-point, binary or nonbinary string, or `NULL`
     - auto conversion — other types are converted
     - defaults to `NULL`, as string when selected in a result set
   - use in expressions — `@var_name`, intended to provide data values, cannot be used directly as identifiers
   - evaluated on the client — a variable that is assigned a value in the select expression list, does not work in `HAVING`, `GROUP BY`, and `ORDER BY`
   - example
     ```SQL
     select Num as 'ConsecutiveNums' from
         `Logs`,
         (select @cnt := 0, @prev := 0) as _init
     where (@cnt := IF(@prev = (@prev := Num), @cnt + 1, 1)) = 3;
     ```

### Literals

1. `NULL`

1. strings literals — `'`, or `"` if not in `sql_mode` `ANSI_QUOTES`
   ```
   [_charset_name]'string' [COLLATE collation_name]
   ```
   ```SQL
   SELECT _utf8mb4'abc' COLLATE utf8mb4_danish_ci;
   SELECT _utf8mb4 0x4D7953514C COLLATE utf8mb4_danish_ci;
   ```
   - escape sequences - `\0`, `\'`, `\"`, `\b` (backspace), `\n`, `\r`, `\t`, `\Z` (ASCII 26 (Control+Z)), `\\`, `\%`, `\_`
     - `\'`, `\"` — also `"'"`, `'"'`, `''` enclosed in single quotes, `""` enclosed in double quotes
     - `\%`, `\_` — only in in pattern-matching contexts, otherwise just the strings `\%` and `\_`, not to `%` and `_`
     - backslash ignored for all other escape sequences — `\x` is just `x`
     - raw string — `QUOTE(str)`
     - controlled by `sql_mode` `NO_BACKSLASH_ESCAPES`
   - `SET` type — comma separated string, like `'a,b'`

1. numbers literals
   - (fixed-point) number
     ```SQL
     SELECT 1, .2, 3.4, -5, -6.78, +9.10
     ```
   - approximate-value (floating-point) number
     ```SQL
     SELECT 1.2E3, 1.2E-3, -1.2E3, -1.2E-3, 1e3
     ```
   - `TRUE`, `FALSE` — 1, 0

1. `BIT`, number or binary string literals
   - hexidecimal
     ```
     [_charset_name] X'val' [COLLATE collation_name]
     ```
     - `X'val'`, `x'val'`, `val` must contain an even number of digits
     - `0xval`, case sensitive not `0X`
     - `charset_name` — defaults to `binary`
     - numeric contexts — treated like `BIGINT`, to ensure numeric treatment, `+0` or `CAST(X'41' AS UNSIGNED)`
     - bit operators — defaults to numeric context, for binary string context, use a `_binary` introducer for at least one of the arguments
     - get hex — `HEX(str)`, `HEX(N)`
   - binary — like hexidecimal, but no constraint on number of digits
     ```
     [_charset_name] b'val' [COLLATE collation_name]
     ```

1. date and time literals
   - quoted strings and numbers — like `'2015-07-21'`, `'20150721'`, and `20150721`
     - `'YYYY-MM-DD'` or `'YY-MM-DD'`, `'YYYY-MM-DD hh:mm:ss'` or `'YY-MM-DD hh:mm:ss'`, any punctuation character may be used as the delimiter
     - `'YYYYMMDD'` or `'YYMMDD'`, `'YYYYMMDDhhmmss'` or `'YYMMDDhhmmss'`, `'hhmmss'`
     - `YYYYMMDD` or `YYMMDD`, `YYYYMMDDhhmmss`, `YYMMDDhhmmss`, `ss`, `mmss`, or `hhmmss` formatted numbers
     - trailing fractional seconds
     - preceding zeros in delimited strings — optional
     - `TIME` with or without days — `'D hh:mm:ss'`, `'hh:mm:ss'`, `'hh:mm'`, `'D hh:mm'`, `'D hh'`, or `'ss'`, `D` from 0 to 34 days
   - ANSI SQL — space delimiter is optional
     ```SQL
     DATE 'str'
     TIME 'str'
     TIMESTAMP 'str'
     ```

### Operators and Functions

1. implicit type conversion — use `CAST()` for explict conversion
   - between strings and numbers — `1+'1'`, `CONCAT(1)`
     - character set and collation when implicitly converted to string — by `character_set_connection` and `collation_connection`
   - when comparing
     - `NULL` — result in `NULL` if one or both arguments are `NULL`, except `<=>`
     - hexidecimal values — as binary strings if not compared to a number
     - when `TIMESTAMP` or `DATETIME` compared to constants — constants converted
     - when comparing strings to numbers — convert to floating point numbers
   - when arithmetic — see below

1. operator priority
   1. unary operators — `-`, `~` (bit inversion)
   1. `^`, arithmetic operators
   1. bitwise operators
   1. comparison operators
   1. logical operators
   1. assignment operators — `:=`, `=` (in `SET` statements and `SET` clauses of `UPDATE`); support multiple assignments

1. numeric operators and functions
   - `+`, `-`, `*` — result is floating-point if any operand is floating-point, otherwise `UNSIGNED` if any operand is `UNSIGNED`
   - `/`
     - scale of the result — when using two exact-value operands, the scale of the result is the scale of the first operand plus the value of the `div_precision_increment` (defaults to 4) system variable
     - division by zero — `NULL` or error, controlled by `sql_mode` `ERROR_FOR_DIVISION_BY_ZERO`
   - `DIV` — integer division returning `BIGINT`, non-integer types are converted to `DECIMAL` and use `DECIMAL` arithmetic, error when overflow
   - `%`, `MOD`, `MOD(N,M)`

1. bitwise operators and functions
   - `&`, `>>`, `<<`, `^`, `|`, `~`
   - `BIT_COUNT(N)`

1. comparison operators and functions — result in a value of `1` (`TRUE`), `0` (`FALSE`), or `NULL`
   - L, E and G, also row operands — for example, `(a, b) <= (x, y)`
     ```
     =  >  <  >=  <=  <>  !=  <=>
     ```
     - `<=>` — `NULL`-safe equal, equivalent to the ANSI SQL `IS NOT DISTINCT FROM`
     - `<>` or `!=` — not equal
   - `expr [NOT] IN (value,...)` — also as row operands, use `CAST()` for best results, `NULL` if left value is `NULL` or `NULL` among right values when not found
   - `IS`
     - `IS [NOT] boolean_value` — `boolean_value`: `TRUE`, `FALSE`, or `UNKNOWN` (for `NULL`)
     - `IS [NOT] NULL`, `ISNULL(expr)`
       - `AUTO_INCREMENT` columns — controlled by system variable `sql_auto_is_null`
       - zero values for `DATE` nad `DATETIME` columns — zero values `IS NULL` when the column defined as `NOT NULL`
   - string related — `NULL` if any parameter is `NULL`
     - `expr1 SOUNDS LIKE expr2` — `SOUNDEX(expr1) = SOUNDEX(expr2)`
     - `expr [NOT] LIKE pat [ESCAPE 'escape_char']`
       - matching on a per-character basis — some collate rules may not work, trailing space significant
       - wildcard — `%` for any number of characters, `_` for one character
       - escape — defaults to use `\` as escape character
     - `expr [NOT] REGEXP pat`, `expr [NOT] RLIKE pat` — `REGEXP_LIKE()`
     - `REGEXP_LIKE(expr, pat[, match_type])`
       - compatibility — not multibyte safe prior to 8.0.4, and more
       - `match_type` options — `c` case sensitive, `i` case insensitive, more
       - regex syntax — limited support, see docs
     - `STRCMP(expr1,expr2)`
   - `expr [NOT] BETWEEN min AND max` — inclusive, equivalent to the expression `(min <= expr AND expr <= max)` if of same type, use `CAST()` for best results
   - `CASE` — control flow, `NULL` if no else, different when use inside stored programs
     - switch case
       ```
       CASE value
           WHEN [compare_value] THEN result
           [WHEN [compare_value] THEN result ...]
           [ELSE result]
       END
       ```
     - if else
       ```
       CASE
           WHEN [condition] THEN result
           [WHEN [condition] THEN result ...]
           [ELSE result]
       END
       ```
     - `result` — the aggregated type of all result values, see docs for details
     - in tandem — `ELT()`, `FIELD()`
   - pick value or index
     - `COALESCE(value,...)` — the first non-`NULL` argument
     - `GREATEST(value1,value2,...)`, `LEAST(value1,value2,...)` — with implicit type conversion, `NULL` if any `NULL` argument
     - `INTERVAL(N,N1,N2,N3,...)` — binary search `N`, `N_i` required to be incremental, arguments treated as integers, `-1` if `N` is `NULL`, `0` if `N < N1`, `1` if `N1 <= N < N2` and so on
     - `IF(expr1,expr2,expr3)` — ternary `expr1 ? expr2 : expr3` in other languages, return type is aggregated
     - `IFNULL(expr1,expr2)` — `expr1 ?? expr2` in other languages, `NULL` coalescing, return type is the generalized type
     - `NULLIF(expr1,expr2)` — `IF(expr1 = expr2, NULL, expr1)`, return type as `expr1`, `expr1` may be evaluated twice

1. logical operators
   - short circuit — undefined and should not rely on, use `CASE` for guaranteed order or bitwise operator to ensure execution
   - `NOT` — `NOT NULL` is `NULL`
   - `AND` — `1 AND NULL` and `NULL AND 1` is `NULL`
   - `OR` — `1 OR NULL` and `NULL or 1` is `NULL`
     - `||` — deprecated as `OR`, when in `sql_mode` `PIPES_AS_CONCAT`, `||` is SQL-standard string concatenation
   - `XOR` — `NULL` if any `NULL`

### Cast, Math, Date, Time and String Functions

1. cast
   - use extract functions for date times
   - string to number — use arithmetic, like `'1' | 0`
   - convert between character sets
     ```
     CONVERT(expr USING transcoding_name) [COLLATE collation_name]
     CONVERT(string, CHAR[(N)] CHARACTER SET charset_name) [COLLATE collation_name]
     CAST(string AS CHAR[(N)] CHARACTER SET charset_name) [COLLATE collation_name]
     ```
   - `BINARY expr` — to a binary string, force byte comparaison and trailing spaces significant
   - `CAST(expr AS type [ARRAY])`, `CONVERT(expr,type)`
     - `type` — see docs, some data types and `SIGNED`, `UNSIGNED`

1. mathmatical functions — `NULL` when error
   - sign
     - `ABS(X)`
     - `SIGN(X)`
   - rounding
     - `CEIL(X)`, `CEILING(X)`, `FLOOR(X)` — return floating type when string or floating-point arguments
     - `ROUND(X)`, `ROUND(X,D)` — precision `D` can be negative
     - `TRUNCATE(X,D)`
   - `RAND([N])` — `Math.random()` in Java, `N` for seed
     - retrieve in random order — `ORDER BY RAND()`
   - `POW(X,Y)`, `POWER(X,Y)`, `SQRT(X)`
   - `EXP(X)`, `LN(X)`, `LOG(X)`, `LOG(B,X)`, `LOG2(X)`, `LOG10(X)`, `LOG2(X)`, `LOG10(X)`
   - trigonometric — in radian
     - `PI()`
     - `DEGREES(X)`, `RADIANS(X)` — conversion between radians and degrees
     - `ACOS(X)`, `ASIN(X)`
     - `ATAN(X)`, `ATAN(Y,X)`, `ATAN2(Y,X)` — the latter two as `Y/X`
     - `COT(X)` — cotangent
     - `COS(X)`, `SIN(X)`, `TAN(X)`
   - `CRC32(expr)`

1. date and time functions
   - excess information ignored — ignore the time part if expect date values and vice versa
   - current date or time evaluated at start — functions like `NOW()` evaluated only once per query at the start of query execution, except `SYSDATE()`
     - `NOW([fsp])`, `CURRENT_TIMESTAMP`, `CURRENT_TIMESTAMP([fsp])`, `LOCALTIME`, `LOCALTIME([fsp])`, `LOCALTIMESTAMP`, `LOCALTIMESTAMP([fsp])`
     - `SYSDATE([fsp])` — nondeterministic, evaluated to the time at which executed
     - `CURDATE()`, `CURRENT_DATE`, `CURRENT_DATE()`
     - `CURTIME([fsp])`, `CURRENT_TIME`, `CURRENT_TIME([fsp])`
     - `UNIX_TIMESTAMP([date])` — when without parameters
     - `UTC_DATE`, `UTC_DATE()`; `UTC_TIME`, `UTC_TIME([fsp])`; `UTC_TIMESTAMP`, `UTC_TIMESTAMP([fsp])`
   - arithmetic
     - `ADDDATE(date,INTERVAL expr unit)`, `DATE_ADD(date,INTERVAL expr unit)`
     - `SUBDATE(date,INTERVAL expr unit)`, `DATE_SUB(date,INTERVAL expr unit)`
     - `ADDDATE(expr,days)`; `SUBDATE(expr,days)`
     - `FROM_DAYS(N)`
     - `ADDTIME(expr1,expr2)`; `SUBTIME(expr1,expr2)`
     - `TIMEDIFF(expr1,expr2)`
     - `DATEDIFF(expr1,expr2)`
     - `PERIOD_ADD(P,N)`
     - `PERIOD_DIFF(P1,P2)`
     - `TIMESTAMP(expr1,expr2)`
     - `TIMESTAMPADD(unit,interval,datetime_expr)`, `TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2)`
   - of
     - `LAST_DAY(date)` — last day of the month
     - `MAKEDATE(year,dayofyear)`
     - `MAKETIME(hour,minute,second)`
     - `SEC_TO_TIME(seconds)`
     - `STR_TO_DATE(str,format)`
     - `FROM_UNIXTIME(unix_timestamp[,format])`
     - `TIMESTAMP(expr)`
   - timezone
     - `CONVERT_TZ(dt,from_tz,to_tz)`
   - format
     - with format
       - `DATE_FORMAT(date,format)` — see docs for formats, `STR_TO_DATE(str,format)` for inversion
       - `TIME_FORMAT(time,format)`
       - `FROM_UNIXTIME(unix_timestamp[,format])`
       - `GET_FORMAT({DATE|TIME|DATETIME}, {'EUR'|'USA'|'JIS'|'ISO'|'INTERNAL'})`
     - name
       - `DAYNAME(date)` — Saturday, etc.
       - `MONTHNAME(date)`
     - extract
       - `EXTRACT(unit FROM date)`
       - `MICROSECOND(expr)`
       - `SECOND(time)`
       - `MINUTE(time)`
       - `HOUR(time)`
       - `TIME(expr)`
       - `DAY(date)`, `DAYOFMONTH(date)`
       - `MONTH(date)`
       - `YEAR(date)`
       - `DATE(expr)`
     - index
       - `DAYOFMONTH(date)`, `DAY(date)`
       - `DAYOFYEAR(date)`
       - `DAYOFWEEK(date)` — start from 1 = Sunday
        -`WEEKDAY(date)` — start from 0 = Monday
       - `QUARTER(date)`
       - `WEEK(date[,mode])`
       - `WEEKOFYEAR(date)` — `WEEK(date,3)`
       - `YEARWEEK(date)`, `YEARWEEK(date,mode)` — return year and week
     - conversion
       - `TIME_TO_SEC(time)`
       - `TO_DAYS(date)` — since year 0
       - `TO_SECONDS(expr)`
       - `UNIX_TIMESTAMP([date])`

1. string functions
   - char at
     - `ASCII(str)`
     - `ORD(str)` — byte representation
   - length
     - `BIT_LENGTH(str)`
     - `OCTET_LENGTH(str)`, `LENGTH(str)` — byte length
     - `CHAR_LENGTH(str)`, CHARACTER_LENGTH(str)
   - to string, of
     - `BIN(N)`
     - `OCT(N)`
     - `HEX(N)`
     - `CONV(N,from_base,to_base)` — `N` treated as unsigned unless `from_base` is negative
     - `EXPORT_SET(bits,on,off[,separator[,number_of_bits]])` — `BIN()` but `on` as 1 and `off` as 0
     - `MAKE_SET(bits,str1,str2,...)` — choose from bit vector `bits`, little endian
     - `CHAR(N,... [USING charset_name])` — from byte array
     - `FORMAT(X,D[,locale])` — localization
     - `LOAD_FILE(file_name)`
   - find — 0 if not found
     - `INSTR(str,substr)`
     - `REGEXP_INSTR(expr, pat[, pos[, occurrence[, return_option[, match_type]]]])`
       - `REGEXP_SUBSTR(expr, pat[, pos[, occurrence[, match_type]]])` — `REGEXP_INSTR()` but return matched result
     - `LOCATE(substr,str)`, `LOCATE(substr,str,pos)`, `POSITION(substr IN str)`
   - transform
     - `CONCAT(str1,str2,...)`
     - `CONCAT_WS(separator,str1,str2,...)`
     - `INSERT(str,pos,len,newstr)`
     - `REPLACE(str,from_str,to_str)`
     - `REPEAT(str,count)`
     - `SPACE(N)` — `REPEAT(' ', N)`
     - `REVERSE(str)`
     - case
       - `LOWER(str)`, `LCASE(str)` — for a binary string, first convert it to a non-binary string
       - `UPPER(str)`, `UCASE(str)`
     - substring — multibyte safe
       - `LEFT(str,len)` — from start
       - `RIGHT(str,len)` — from end
       - `SUBSTRING(str,pos,len)`, `MID(str,pos,len)`
       - `SUBSTR(str,pos)`, `SUBSTR(str FROM pos)`, `SUBSTR(str,pos,len)`, `SUBSTR(str FROM pos FOR len)`
       - `SUBSTRING(str,pos)`, `SUBSTRING(str FROM pos)`, `SUBSTRING(str,pos,len)`, `SUBSTRING(str FROM pos FOR len)`
       - `SUBSTRING_INDEX(str,delim,count)` — start from end if `count` is negative
     - padding
       - `LPAD(str,len,padstr)`
       - `RPAD(str,len,padstr)`
     - trim
       - `LTRIM(str)`
       - `RTRIM(str)`
       - `TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM] str)`, `TRIM([remstr FROM] str)`
   - mapping
     - `ELT(N,str1,str2,str3,...)` — select `strN` from string array starting from `str1`
     - `FIELD(str,str1,str2,str3,...)` — ordinal in the string array starting from `str1`
   - encoding
     - `HEX(str)` — hex representation
     - `UNHEX(str)`
     - `TO_BASE64(str)`
     - `FROM_BASE64(str)`
     - `QUOTE(str)`
     - `SOUNDEX(str)`
     - `CHARSET(str)`
     - `COLLATION(str)`

### Aggregate and Window Functions

1. group functions
   - ignore `NULL` values
   - return type — `DOUBLE` or `DECIMAL` if exact-value arguments, `BIGINT` (or binary strings) for bitwise
   - `over_clause` — use as window functions

1. statistic group functions
   - `SUM([DISTINCT] expr) [over_clause]`
   - `AVG([DISTINCT] expr) [over_clause]`
   - `MAX([DISTINCT] expr) [over_clause]`
   - `MIN([DISTINCT] expr) [over_clause]`
   - `STDDEV_POP(expr) [over_clause]`, `STDDEV(expr) [over_clause]`, `STD(expr) [over_clause]`
   - `STDDEV_SAMP(expr) [over_clause]`
   - `VAR_POP(expr) [over_clause]`, `VARIANCE(expr) [over_clause]`
   - `VAR_SAMP(expr) [over_clause]`

1. bitwise group functions
   - `BIT_AND(expr) [over_clause]`
   - `BIT_OR(expr) [over_clause]`
   - `BIT_XOR(expr) [over_clause]`

1. other group functions
   - `COUNT(expr) [over_clause]` — non-`NULL` values, also `NULL` if `COUNT(*)`
     - secondary index traversing — InnoDB processes `SELECT COUNT(*)` statements by traversing the smallest available secondary index unless an index or optimizer hint directs the optimizer to use a different index. If a secondary index is not present, InnoDB processes `SELECT COUNT(*)` statements by scanning the clustered index.
   - `COUNT(DISTINCT expr,[expr...])`
   - `GROUP_CONCAT(expr)`
     ```
     GROUP_CONCAT([DISTINCT] expr [,expr ...]
                  [ORDER BY {unsigned_integer | col_name | expr}
                      [ASC | DESC] [,col_name ...]]
                  [SEPARATOR str_val])
     ```

1. window functions — tbd
   - `null_treatment` — for ANSI SQL conformance, permits only `RESPECT NULLS`
   - `LEAD(expr [, N[, default]]) [null_treatment] over_clause`
   - `LAG(expr [, N[, default]]) [null_treatment] over_clause`
   - `NTILE`
   - `CUME_DIST`
   - `DENSE_RANK() over_clause` — consecutive even when duplicates
   - `PERCENT_RANK`
   - `RANK() over_clause` — not consecutive when duplicate
   - `ROW_NUMBER() over_clause`

### Other Functions

1. full-text search functions — for `FULLTEXT` index types, tbd
   ```
   MATCH (col1,col2,...) AGAINST (expr [search_modifier])
   search_modifier:
     {
          IN NATURAL LANGUAGE MODE
        | IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION
        | IN BOOLEAN MODE
        | WITH QUERY EXPANSION
     }
   ```

1. encryption and compression
   - `SHA1()`, `SHA2()`, `SHA()`
   - `MD5()`
   - more

1. lock functions

1. information functions
   - `BENCHMARK(count,expr)` — executes the expression `expr` repeatedly `count` times, scalar expressions only
   - last query
     - `FOUND_ROWS()` — for last `LIMIT`
     - `ROW_COUNT()`
     - `LAST_INSERT_ID()`, `LAST_INSERT_ID(expr)`
   - client, current session
     - `VERSION()`
     - `USER()`, `SESSION_USER()`, `SYSTEM_USER()`
     - `CONNECTION_ID()`
     - `CURRENT_ROLE()`
     - `CURRENT_USER`, `CURRENT_USER()`
     - `DATABASE()`, `SCHEMA()`

1. miscellaneous functions
   - UUID — see docs for arguments
     - `BIN_TO_UUID()`
     - `IS_UUID()`
     - `UUID()`
     - `UUID_SHORT()`
     - `UUID_TO_BIN()`
   - column related during statements
     - `DEFAULT(col_name)` — `DEFAULT` value for `col_name`
     - `GROUPING(expr [, expr] ...)` — see `GROUP BY`
     - `ANY_VALUE(arg)` — see `GROUP BY`

### Expressions

1. expression
   ```
   expr:
       expr OR expr
     | expr || expr
     | expr XOR expr
     | expr AND expr
     | expr && expr
     | NOT expr
     | ! expr
     | boolean_primary IS [NOT] {TRUE | FALSE | UNKNOWN}
     | boolean_primary
   ```

1. `boolean_primary`
   ```
   boolean_primary:
       boolean_primary IS [NOT] NULL
     | boolean_primary <=> predicate
     | boolean_primary comparison_operator predicate
     | boolean_primary comparison_operator {ALL | ANY} (subquery)
     | predicate
   ```
   - `comparison_operator`
     ```
     comparison_operator: = | >= | > | <= | < | <> | !=
     ```

1. `predicate`
   ```
   predicate:
       bit_expr [NOT] IN (subquery)
     | bit_expr [NOT] IN (expr [, expr] ...)
     | bit_expr [NOT] BETWEEN bit_expr AND predicate
     | bit_expr SOUNDS LIKE bit_expr
     | bit_expr [NOT] LIKE simple_expr [ESCAPE simple_expr]
     | bit_expr [NOT] REGEXP bit_expr
     | bit_expr
   ```

1. `bit_expr`
   ```
   bit_expr:
       bit_expr | bit_expr
     | bit_expr & bit_expr
     | bit_expr << bit_expr
     | bit_expr >> bit_expr
     | bit_expr + bit_expr
     | bit_expr - bit_expr
     | bit_expr * bit_expr
     | bit_expr / bit_expr
     | bit_expr DIV bit_expr
     | bit_expr MOD bit_expr
     | bit_expr % bit_expr
     | bit_expr ^ bit_expr
     | bit_expr + interval_expr
     | bit_expr - interval_expr
     | simple_expr
   ```

1. `simple_expr`
   ```
   simple_expr:
       literal
     | identifier
     | function_call
     | simple_expr COLLATE collation_name
     | param_marker
     | variable
     | simple_expr || simple_expr
     | + simple_expr
     | - simple_expr
     | ~ simple_expr
     | ! simple_expr
     | BINARY simple_expr
     | (expr [, expr] ...)
     | ROW (expr, expr [, expr] ...)
     | (subquery)
     | EXISTS (subquery)
     | match_expr
     | case_expr
     | interval_expr
   ```
   - `variable` — user variables, system variables, or stored program local variables or parameters
   - `param_marker` — `?` in `PREPARE`

1. `interval_expr` — represents a temporal interval, for `+`, `-` and functions like `DATE_ADD()` and `DATE_SUB()`
   ```
   INTERVAL expr unit
   ```
   - `expr` here — quantity in `unit`, should be in the format according to `unit`
   - `unit`
     - `MICROSECOND`, `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR` — expect number
     - `SECOND_MICROSECOND`, `MINUTE_MICROSECOND`, `MINUTE_SECOND`, `HOUR_MICROSECOND`, `HOUR_SECOND`, `HOUR_MINUTE` — from left part to right part, expect any punctuation delimited string
     - `DAY_MICROSECOND`, `DAY_SECOND`, `DAY_MINUTE`, `DAY_HOUR` — like above but with days spaced: `'DAYS HOURS:MINUTES:SECONDS.MICROSECONDS'`
     - `YEAR_MONTH` — `'YEARS-MONTHS'`

## Distributed MySQL

### Partition

1. partition in MySQL
   - partitioning types — horizontal, error when cannot decide partition
     - `RANGE` partitioning — partitions based on column values falling within a given range
       - `RANGE COLUMNS` partitioning — enables the use of multiple columns in partitioning keys
     - `LIST` partitioning — partitions based on column values matching one of a set of discrete values
       - `LIST COLUMNS` partitioning — enables the use of multiple columns in partitioning keys
     - `HASH` partitioning — partitions based on user provided hash function on column values
       - `LINEAR HASH` — data is less likely to be evenly distributed, but adding, dropping, merging, and splitting of partitions is made much faster
       - `KEY` partitioning — similar to `HASH`, except that MySQL supplies the hashing function
   - composite partitioning — with `SUBPARTITION`
   - limitation — all columns used in the table's partitioning expression must be part of every unique key that the table may have, including any primary key, see docs for more
   - corresponding table in `INFORMATION_SCHEMA` — `INFORMATION_SCHEMA.PARTITIONS`

1. `partition_options` in `CREATE TABLE`
   ```
   PARTITION BY
       { [LINEAR] HASH(expr)
       | [LINEAR] KEY [ALGORITHM={1|2}] (column_list)
       | RANGE{(expr) | COLUMNS(column_list)}
       | LIST{(expr) | COLUMNS(column_list)} }
   [PARTITIONS num]
   [SUBPARTITION BY
       { [LINEAR] HASH(expr)
       | [LINEAR] KEY [ALGORITHM={1|2}] (column_list) }
     [SUBPARTITIONS num]
   ]
   [(partition_definition [, partition_definition] ...)]
   ```
   - `partition_definition`
     ```
     PARTITION partition_name
         [VALUES
             {LESS THAN {(expr | value_list) | MAXVALUE}
             |
             IN (value_list)}]
         [[STORAGE] ENGINE [=] engine_name]
         [COMMENT [=] 'string' ]
         [DATA DIRECTORY [=] 'data_dir']
         [INDEX DIRECTORY [=] 'index_dir']
         [MAX_ROWS [=] max_number_of_rows]
         [MIN_ROWS [=] min_number_of_rows]
         [TABLESPACE [=] tablespace_name]
         [(subpartition_definition [, subpartition_definition] ...)]
     ```
     - `subpartition_definition`
       ```
       SUBPARTITION logical_name
           [[STORAGE] ENGINE [=] engine_name]
           [COMMENT [=] 'string' ]
           [DATA DIRECTORY [=] 'data_dir']
           [INDEX DIRECTORY [=] 'index_dir']
           [MAX_ROWS [=] max_number_of_rows]
           [MIN_ROWS [=] min_number_of_rows]
           [TABLESPACE [=] tablespace_name]
       ```

1. `partition_options` in `ALTER TABLE`
   ```
   partition_options:
       partition_option [partition_option] ...
   partition_option:
       ADD PARTITION (partition_definition)
     | DROP PARTITION partition_names
     | DISCARD PARTITION {partition_names | ALL} TABLESPACE
     | IMPORT PARTITION {partition_names | ALL} TABLESPACE
     | TRUNCATE PARTITION {partition_names | ALL}
     | COALESCE PARTITION number
     | REORGANIZE PARTITION partition_names INTO (partition_definitions)
     | EXCHANGE PARTITION partition_name WITH TABLE tbl_name [{WITH|WITHOUT} VALIDATION]
     | ANALYZE PARTITION {partition_names | ALL}
     | CHECK PARTITION {partition_names | ALL}
     | OPTIMIZE PARTITION {partition_names | ALL}
     | REBUILD PARTITION {partition_names | ALL}
     | REPAIR PARTITION {partition_names | ALL}
     | REMOVE PARTITIONING
   ```
   - see `partition_options` in `CREATE TABLE` for other syntax

1. `PARTITION` clause in DML — see corresponding DML

## System Variables

1. `SHOW VARIABLES`
   ```
   SHOW [GLOBAL | SESSION] VARIABLES
       [LIKE 'pattern' | WHERE expr]
   ```
   - corresponding table in `PERFORMANCE_SCHEMA` — `PERFORMANCE_SCHEMA.global_variables`, `PERFORMANCE_SCHEMA.session_variables`, `PERFORMANCE_SCHEMA.persisted_variables`, `PERFORMANCE_SCHEMA.variables_by_thread`, `PERFORMANCE_SCHEMA.variables_info`
   - CLI — `mysqladmin variables`

1. `SET`
   ```SQL
   SET sql_mode='TIME_TRUNCATE_FRACTIONAL';
   SET @@sql_mode='TIME_TRUNCATE_FRACTIONAL';
   ```
   - `@@` — indicate explicitly that a variable is a session variable
   - `@@global.`, `@@session.` prefixes

1. `sql_mode`, separated by `,`
   ```SQL
   SET @@sql_mode = sys.list_add(@@sql_mode, 'TIME_TRUNCATE_FRACTIONAL');
   ```
   - strict mode —  `STRICT_ALL_TABLES` or `STRICT_TRANS_TABLES`
     - effects — warnings become errors, see docs [5.1.11 Server SQL Modes](https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html#sql-mode-strict)
     - temporarily non-strict — `INSERT IGNORE` or `UPDATE IGNORE`
   - `NO_UNSIGNED_SUBTRACTION`
   - `PAD_CHAR_TO_FULL_LENGTH`
   - `NO_ZERO_IN_DATE`
   <!-- markdownlint-disable MD033 -->
   - `ANSI_QUOTES` — Treat `"` as an identifier quote character (like the <code>\`</code> quote character) and not as a string quote character
   <!-- markdownlint-enable MD033 -->
   - `NO_BACKSLASH_ESCAPES` — Disable the use of the backslash character (`\`) as an escape character within strings and identifiers
   - `PIPES_AS_CONCAT`

1. system variables — tbd
   - `time_zone`
   - `max_sort_length`
   - `sql_auto_is_null`
   - character set
     - `character_set_connection`
