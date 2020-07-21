# Introduction

[TOC]

1. Version: 2.7
1. [Official website](https://www.python.org/)

# Miscellaneous

1. profiling
   - [zhihu](https://www.zhihu.com/question/30018428/answer/120882946)

1. `print`
   ```python
   print "string"
   print 'ab', 3 # a whitespace is automatically added
   print(3) # 3: parentheses without comma
   print(3,5) # (3,5): parentheses with comma
   ```

   - override the invisible `\n`: end with a comma `,`
     ```python
     print "a",
     print "b",
     ```

   - coordination
     - `format()` method for strings

1. Parameters and arguments

1. Refer to doc
   - `ipython`
     - `ipython` and `help`
       ```shell
       $ ipython
       In [1]: import requests

       In [2]: help(requests.get)
       ```

     - `ipython` and `dir`
       ```
       In [3]: dir(requests)
       Out[3]: ...
       ```

     - `ipython` and `?`
       ```
       In [4]: requests.get?
       ```

   - `pydoc`
     ```shell
     $ python -m pydoc requests
     ...
     ```

     http hosted pydoc server at random unused port
     ```shell
     $ python -m pydoc -p 0
     Server ready at ...
     # python -m pydoc -g # with GUI
     ```

1. `enumerate()`

1. `zip()`
   - `zip(*[iter(s)]*n)`

1. `map()`
   - `list(map(iterable))`

1. `lambda x: 1 if x>0.5 else 0`

1. find the index of minima or maxima
   ```python
   min(range(len(a)), key=a.__getitem__)
   min(zip(a, range(len(a))))
   min(enumerate(a), key=lambda x:x[1])
   np.argmin(a) # import numpy as np
   ```

# Fundamentals

1. Using The Interpreter Prompt

   - Use squarely
     ```shell
     $ python
       Python 2.7.6 (default, Feb 23 2014, 16:08:15)
       [GCC 4.2.1 Compatible Apple LLVM 5.0 (clang-500.2.79)] on darwin
       Type "help", "copyright", "credits" or "license" for more information.
       >>> print "hello world"
       hello world
       >>>
     ```

     - Quit the Interpreter Prompt
       - GNU/Linux or OS X shell: `ctrl+d` or `exit()<CR>`
       - Windows: `ctrl+z<CR>`
   - Run the script
     ```shell
     $ python hello.py
     hello world
     ```

     - `-O` option: optimization requested
       - `__debug__` will be `False`
   - Get help
     ```python
     help('what')
     ```

     press `q` to quit

1. General properties of python

   - indentation sensitive
     - indentation is used to determine the grouping of statements
     - block: statements which go together must have the same indentation
       - `pass`: indicates an empty block of statements
       - single statement does not need an indentation
     - official Python language recommendation
       - Use four spaces for indentation
   - Interpreted: does not need compilation
     - Internally, Python converts the source code into an intermediate form called bytecodes and then translates this into the native language of your computer and then runs it
     - make Python programs much more portable
   - Extensible and embeddable
     - with C/C++
   - Extensive Libraries
     - [Python Package Index](http://pypi.python.org/pypi)
   - strongly object-oriented
     - Python is strongly object-oriented in the sense that everything is an object including numbers, strings and functions
   - Dynamic:
     - no declaration or data type definition is needed/used
   - short-circuit evaluation
   - starts counting from 0

1. Logical And Physical Line

   - Definition
     - A physical line is what you see when you write the program
     - A logical line is what Python sees as a single statement
   - Implication
     - Python implicitly assumes that each physical line corresponds to a logical line
     - Implicitly, Python encourages the use of a single statement per line which makes code more readable
   - specify more than one logical line on a single physical line: use semicolon `;`
     ```python
     # for identical examples for the use of semicolon
     i = 5
     print i

     i = 5;
     print i;

     i = 5; print i;

     i = 5; print i
     ```

   - For long code: break one logical line into multiple physical line:
     - use backslash `\`
       ```python
       # print 5
       print \
       5
       ```

     - implicit line joining
       - where the logical line has a starting parentheses `(`, starting square brackets `[` or a starting curly braces `{` but not an ending one

<!-- )]} -->

1. Comments: `#`

1. Identifier Naming

   - The first character of the identifier must be a letter of the alphabet (uppercase ASCII or lowercase ASCII or Unicode character) or an underscore ( _ )
   - The rest of the identifier name can also consist of digits
   - Identifier names are case-sensitive

# Types

1. See the type: `type(object)`

1. Dynamic

   - Variables are used by just assigning them a value.
   - No declaration or data type definition is needed/used.

1. `int`

   - `long` does not exist, included in

1. delete/remove an identifier: `del`
   ```python
   del a,b
   ```

1. Variable

   - `None`
     - special type in Python that represents nothingness
     - a variable has no value if it has a value of `None`

1. String

   - class `str`
   - Single Quote `'string'`: no `char` type in python
   - Double Quotes `"string"`: identical to single quote
   - Triple Quotes `'''` or `"""`: multi-line strings
     ```python
     # This is a multi-line string. This is the first line.
     # second line
     #
     print '''This is a multi-line string. This is the first line.
     second line
     '''
     ```

   - Strings Are Immutable
   - Strings can be indexed (subscripted)
     - a character is simply a string of size one
     - Indices may also be negative numbers, to start counting from the right
     - Note that since -0 is the same as 0, negative indices start from -1
   - slicing allows you to obtain a substring
     - Note how the start is always included, and the end always excluded. This makes sure that `s[:i] + s[i:]` is always equal to `s`
     - Slice indices have useful defaults; an omitted first index defaults to zero, an omitted second index defaults to the size of the string being sliced.
     - out of range slice indexes are handled gracefully
       ```python
       >>> 'a'[5:]
       ''
       ```

   - construct strings from other information
     - `format` method
       - substitute `{number}` with corresponding parameters, the numbers are optional but should be coherent (all with a number or all without)
         ```python
         age = 20
         name = 'Swaroop'
         print '{0} was {1} years old when he wrote this book'.format(name, age)
         print 'Why is {0} playing with that python?'.format(name)
         ```

         the conversion to string would be done automatically by the format method
       - Specify decimal precision
         ```python
         # decimal (.) precision of 3 for float '0.333'
         print '{0:.3f}'.format(1.0/3)
         ```

       - Fill to a width with the text centered
         ```python
         # (^) to 11 width '___hello___'
         print '{0:_^11}'.format('hello')
         ```

       - Keyword substitution
         ```python
         # keyword-based 'Swaroop wrote A Byte of Python'
         print '{name} wrote {book}'.format(name='Swaroop',
                                            book='A Byte of Python')
         ```

     - string concatenation
       ```python
       name + ' is ' + str(age) + ' years old'
       ```

   - convert other data types to string
     - `str()`
     - be done automatically by the format method
   - Escaped Sequences
     - quotes
       ```python
       print 'What\'s your "name'
       print "What's your \"name"
       ```

     - some other: `\n`, `\t`
     - span multiple lines: a single backslash `\` at the end of the line
       ```python
       # This is the first sentence.        This is the second sentence.
       print "This is the first sentence. \
              This is the second sentence."
       ```
   - Raw String: no escaping: by prefixing `r` or `R` to the string
     ```python
     print r"Newlines are indicated by \n"
     ```

     - Regular Expression Use: better use raw string
   - `unicode` type: prefixing `u` to the string, `'\uxxxx'` for non-ascii
     - set encoding for python
       ```python
       #!/usr/bin/python
       # -*- coding: utf-8 -*-
       # or
       #!/usr/bin/python
       # vim: set fileencoding=utf-8
       ```
     - unicode name
       ```python
       s = u'\N{BLACK SPADE SUIT}' # ♠
       ```

     - get name:
       ```python
       import unicodedata
       unicodedata.name(s)
       ```

     - get number
       ```python
       hex(ord(s))
       ```

   - String length: `len(string)`

# Operators

1. Common Ones
   - `+`, `-`, `*`, `/`, `&`, `|`
   - For strings
     ```python
     # abbb
     print 'a' + 'b' * 3 # no minus for strings
     ```

1. Special ones
   - `**`: power
   - `%`: modulo
     ```python
     print -25.5 % 2.25 # 1.5
     print 25.5 % -2.25 # -1.5
     print -25.5 % -2.25 # -0.75
     ```

   - `<<` left shift
     ```python
     print 2 << 2 # 8: 10 → 1000
     ```

   - `>>` right shift
     ```python
     print 11 >> 1 # 5: 1011 → 101
     ```

   - `^`: bit-wise XOR
   - `~`: bit-wise invert, output is $-(x+1)$ for input $x$
   - `<`, `>`, `<=`, `>=`, `==`, `!=`
     - All comparison operators return `True` or `False`
     - can be chained arbitrarily
       ```python
       # both True
       print 3 < 5 < 7
       print 7 > 5 > 3
       ```

     - when operands are not both numbers
       ```python
       print 2**30 < 'a' # True
       ```

   - Boolean function: `not`, `and`, `or`
     - short-circuit evaluation: the rest of a expression is not evaluated if the output is determined
   - Rules of precedence: from lowest to highest
     | Operator                                 | Description                              |
     | ---------------------------------------- | ---------------------------------------- |
     | [`lambda`](https://docs.python.org/3/reference/expressions.html#lambda) | Lambda expression                        |
     | [`if`](https://docs.python.org/3/reference/compound_stmts.html#if) – [`else`](https://docs.python.org/3/reference/compound_stmts.html#else) | Conditional expression                   |
     | [`or`](https://docs.python.org/3/reference/expressions.html#or) | Boolean OR                               |
     | [`and`](https://docs.python.org/3/reference/expressions.html#and) | Boolean AND                              |
     | [`not`](https://docs.python.org/3/reference/expressions.html#not) `x` | Boolean NOT                              |
     | [`in`](https://docs.python.org/3/reference/expressions.html#in), [`not in`](https://docs.python.org/3/reference/expressions.html#not-in), [`is`](https://docs.python.org/3/reference/expressions.html#is), [`is not`](https://docs.python.org/3/reference/expressions.html#is-not), `<`, `<=`, `>`, `>=`, `!=`, `==` | Comparisons, including membership tests and identity tests |
     | `|`                                      | Bitwise OR                               |
     | `^`                                      | Bitwise XOR                              |
     | `&`                                      | Bitwise AND                              |
     | `<<`, `>>`                               | Shifts                                   |
     | `+`, `-`                                 | Addition and subtraction                 |
     | `*`, `@`, `/`, `//`, `%`                 | Multiplication, matrix multiplication, division, floor division, remainder [[5\]](https://docs.python.org/3/reference/expressions.html#id21) |
     | `+x`, `-x`, `~x`                         | Positive, negative, bitwise NOT          |
     | `**`                                     | Exponentiation [[6\]](https://docs.python.org/3/reference/expressions.html#id22) |
     | `await` `x`                              | Await expression                         |
     | `x[index]`, `x[index:index]`, `x(arguments...)`, `x.attribute` | Subscription, slicing, call, attribute reference |
     | `(expressions...)`, `[expressions...]`, `{key: value...}`, `{expressions...}` | Binding or tuple display, list display, dictionary display, set display |

## Some Statements

1. `yeild`: only used when defining a generator function, and is only used in the body of the generator function

1. `exec`: dynamic execution of Python code
   - dynamic evaluation of expressions is supported by the built-in function `eval()`

# Control Flow

1. `if`
   - keywords: `if`, `elif`, `else`
   - Syntax
     ```python
     if condition1: # parentheses are optional, colon is a must
         ...
     elif conditon2:
         ...
     else:
         ...
     ...
     ```

   - no `switch`
   - condition operator
     ```python
     True if condition else False
     ```

1. `while`
   - keywords: `while`, `else`
   - Syntax
     ```python
     while condition:
         ...
     else:
         ...
     ```

   - Explanation
     - The `else` block is executed when the while loop condition becomes `False`
       - this may even be the first time that the condition is checked
     - A `else` clause is always executed for `while` unless `break`

1. `for`
   - keywords: `for`, `in`, `else`
   - Syntax
     ```python
     for var in sequence:
         ...
     else:
         ...
     ```

     where `var` is a variable and `sequence` is discussed later
   - Common sequences
     - `range()`
       ```python
       range(stop) # start = 0, step = 1
       range(start, stop[, step]) # step = 1
       range(4) # [0, 1, 2, 3]
       range(1, 5, 2) # [1, 3]
       ```

     - `xrange()`: a long range but generated only one number at a time
   - Explanation
     - `else` works the same way as the one with `while`

1. `break`

   - if `break` out of a loop, corresponding loop `else` is not executed

1. `continue`

# Function

1. Define a function
   ```python
   def foobar(para1, para2=default):
       ...
   ```

   where the default argument value should be immutable

1. `return`

   - Every function implicitly contains a `return None` statement at the end
     - Unless `return` statement is explicitly written
   - `return` without a value is equivalent to `return None`
   - `return` a tuple to pass multiple variables

1. Use variables beyond local scope: `global` and `nonlocal` statement
   - Syntax
     ```python
     var1 = 1
     var2 = 2
     def func():
         global var1, var2
         ...
     ```

   - Note
     - Names listed in a "global" statement must not be used in the same code block textually preceding that "global" statement.
     - Names listed in a "global" statement must not be defined as formal parameters or in a "for" loop control target, "class" definition, function definition, or "import" statement.
     - `nonlocal`: `global` excluded

1. Keyword Arguments

   - Definition
     - If you have some functions with many parameters and you want to specify only some of them, then you can give values for such parameters by naming them
   - Example
     ```python
     def func(a, b=5, c=10):
         print 'a is', a, 'and b is', b, 'and c is', c

     func(3, 7)
     func(25, c=24)
     func(c=50, a=100)
     ```

1. VarArgs parameters: **var**iable number of **arg**uments

   - Use the starred parameter
     ```python
     def total(initial=5, *numbers, **keywords):
         count = initial
         for number in numbers:
             count += number
         for key in keywords:
             count += keywords[key]
         return count

     print total(10, 1, 2, 3, vegetables=50, fruits=100)
     ```

   - Explanation
     - `*param`: all the positional arguments from declared point till the end are collected as a tuple
     - `**param`: all the keyword arguments from declared point till the end are collected as a dictionary

1. DocStrings: documentation strings
   - Application
     - helps to document the program better and makes it easier to understand
     - used by `help()`
     - Automated tools can retrieve the documentation, such as `pydoc`, which generates Python documentation in HTML or text
   - Syntax
     - A string on the first logical line of a function is the docstring for that function
     - also apply to modules and classes
   - Display
     ```python
     print func.__doc__
     print classname.__doc__
     print classname.methodname.__doc__ # or
     help(func) # no quotes
     ```

   - Convention
     - a multi-line string where the first line starts with a capital letter and ends with a dot.
     - Then the second line is blank
     - followed by any detailed explanation starting from the third line

## Lambda

1. Syntax: take parameters followed by a single expression
   ```python
   points = [ { 'x' : 2, 'y' : 3 },
              { 'x' : 4, 'y' : 1 } ]
   points.sort(key=lambda i : i['y'])
   print points
   ```

   ```python
   l = lambda x,y: x+y
   print l(5,6) # 11
   ```

# Modules

1. Introduction

   - reuse a number of functions in other programs
     - A module can be imported by another program to make use of its functionality. This is how we can use the Python standard library as well
   - the simplest way
     - is to create a file with a `.py` extension that contains functions and variables
     - every Python program is also a module
   - Another method
     - is to write the modules in the native language in which the Python interpreter itself was written. For example, you can write modules in the [C programming language](https://docs.python.org/2/extending/) and when compiled, they can be used from your Python code when using the standard Python interpreter
   - Locations
     - you can directly import modules located in the current directory
     - Otherwise, you will have to place your module in one of the directories listed in `sys.path`

1. Byte-compiled `.pyc` files

   - Importing a module is a relatively costly affair
   - so create byte-compiled files with the extension `.pyc` which is an intermediate form that Python transforms the program into

1. Example: `sys` module

   - Example
     ```python
     import sys
     print('The command line arguments are:')
     for i in sys.argv:
         print i

     print '\nThe PYTHONPATH is', sys.path
     ```

     ```shell
     $ python module_using_sys.py we are arguments
     The command line arguments are:
     module_using_sys.py
     we
     are
     arguments

     The PYTHONPATH is ['/tmp/py',
     # many entries here, not shown here
     '/Library/Python/2.7/site-packages',
     '/usr/local/lib/python2.7/site-packages']
     ```

   - `sys.argv`
     - contains the list of command line arguments i.e. the arguments passed to your program using the command line
     - the name of the script running is always the first argument in the `sys.argv` list
   - `sys.path`
     - contains the list of directory names where modules are imported from
     - you can directly import modules located in the current directory
     - Otherwise, you will have to place your module in one of the directories listed in `sys.path`

1. The `from ... import` statement

   - Directly import a variable, avoid the member `modulename.` prefix
   - Example
     ```python
     from math import sqrt, ...
     print "Square root of 16 is", sqrt(16)
     ```

   - Import all public names of a module
     ```python
     from modulename import *
     ```

     those starting with double underscores `__` will not be imported

1. Alias
   ```python
   import modulename as alias1
   ```

1. A module’s `name`

   - Every module has a name
   - statements in a module can find out the name of their module
   - Whether a module is run standalone or imported
     ```python
     if __name__ == '__main__':
         print 'This program is being run by itself'
     else:
         print 'I am being imported from another module'
     ```

1. list the identifiers that an object defines: the `dir()` function
   - Default parameter: the current module
   - should be imported first
   - works on any object
   - `vars()` also gives the values, but it will not work for all cases

1. Packages

   - A way to organize modules
   - Packages are just folders of modules with a special `__init__.py` file that indicates to Python that this folder is special because it contains Python modules
   - Example
     ```
     - <some folder present in the sys.path>/
         - world/
             - __init__.py
             - asia/
                 - __init__.py
                 - india/
                     - __init__.py
                     - foo.py
             - africa/
                 - __init__.py
                 - madagascar/
                     - __init__.py
                     - bar.py
     ```

# Data Structures

1. Sequence

   - Sequence types
     - [`str`](https://docs.python.org/2/library/functions.html#str), [`unicode`](https://docs.python.org/2/library/functions.html#unicode), `list`, [`tuple`](https://docs.python.org/2/library/functions.html#tuple), [`bytearray`](https://docs.python.org/2/library/functions.html#bytearray), [`buffer`](https://docs.python.org/2/library/functions.html#buffer), [`xrange`](https://docs.python.org/2/library/functions.html#xrange)
   - Common sequence operation
     | Operation      | Result                                   | Notes  |
     | -------------- | ---------------------------------------- | ------ |
     | `x in s`       | `True` if an item of *s* is equal to *x*, else `False` | (1)    |
     | `x not in s`   | `False` if an item of *s* is equal to *x*, else `True` | (1)    |
     | `s + t`        | the concatenation of *s* and *t*         | (6)    |
     | `s * n, n * s` | equivalent to adding *s* to itself *n* times | (2)    |
     | `s[i]`         | *i*th item of *s*, origin 0              | (3)    |
     | `s[i:j]`       | slice of *s* from *i* to *j*             | (3)(4) |
     | `s[i:j:k]`     | slice of *s* from *i* to *j* with step *k* | (3)(5) |
     | `len(s)`       | length of *s*                            |        |
     | `min(s)`       | smallest item of *s*                     |        |
     | `max(s)`       | largest item of *s*                      |        |
     | `s.index(x)`   | index of the first occurrence of *x* in *s* |        |
     | `s.count(x)`   | total number of occurrences of *x* in *s* |        |

     This table lists the sequence operations sorted in ascending priority. In the table, *s* and *t* are sequences of the same type; *n*, *i* and *j* are integers
   - slicing
     - Note how the start is always included, and the end always excluded. This makes sure that `s[:i] + s[i:]` is always equal to `s`
     - Slice indices have useful defaults; an omitted first index defaults to zero, an omitted second index defaults to the size of the string being sliced.
     - the sign of the step determines the direction
       - reverse: `s[::-1]`
     - out of range slice indexes are handled gracefully
       ```
       >>> 'a'[5:]
       ''
       ```

   - Notes
     1. substring test:
        - When *s* is a string or Unicode string object, the `in` and `not in` operations act like a substring test
     1. `0` when negative and referenced:
        - Values of *n* less than `0` are treated as `0` (which yields an empty sequence of the same type as *s*).
        - Note that items in the sequence *s* are not copied; they are **referenced** multiple times.
        - `[[] for i in range(3)]` in lieu of `[[]] * 3` for nested lists
     1. Reversal order when negative:
        - If *i* or *j* is negative, the index is relative to the end of sequence *s*: `len(s) + i` or `len(s) + j` is substituted. But note that `-0` is still `0`.
     1. Stringent range:
        - The slice of *s* from *i* to *j* is defined as the sequence of items with index *k* such that `i <= k < j`.
        - If *i* or *j* is greater than `len(s)`, use `len(s)`.
        - If *i* is omitted or `None`, use `0`. If *j* is omitted or `None`, use `len(s)`.
        - If *i* is greater than or equal to *j*, the slice is empty.
     1. Stringent range:
        - `x = i + n*k` such that `0 <= n < (j-i)/k`, stopping when *j* is reached (but never including *j*).
        - When *k* is positive, *i* and *j* are reduced to `len(s)` if they are greater.
        - When *k* is negative, *i* and *j* are reduced to `len(s) - 1` if they are greater.
        - If *i* or *j* are omitted or `None`, they become “end” values (which end depends on the sign of *k*).
        - Note, *k* cannot be zero. If *k* is `None`, it is treated like `1`.
     1. **CPython implementation detail:**
        - If *s* and *t* are both strings, some Python implementations such as CPython can usually perform an in-place optimization.
        - For performance sensitive code, it is preferable to use the [`str.join()`](https://docs.python.org/2/library/stdtypes.html#str.join) method which assures consistent linear concatenation performance across versions and implementations.

1. List
   - Syntax
     - Enclosed in square brackets
   - Access
     - suffix brackets with numbers
   - Methods
     - Length: `len()`
     - Add:
       - `append(x)` equivalent to `a[len(a):] = [x]`
       - `extend(L)` equivalent to `a[len(a):] = L`, or list concatenation
       - `insert(i, x)`
     - delete/remove:
       - `del`: not a member
       - `remove(x)`: Remove the first item from the list whose value is x. It is an error if there is no such item.
       - `pop()`: a position argument can be given
     - Sort: `sort(cmp=None, key=None, reverse=False)`
       - the arguments can be used for sort customization, see [`sorted()`](https://docs.python.org/2/library/functions.html#sorted) for their explanation
     - Find:
       - `index(x)`: Return the index in the list of the first item whose value is x. It is an error if there is no such item.
       - `cound(x)`: Return the number of times x appears in the list.
     - Check existence
       - `in` operator
     - Reverse: `reverse()` method
     - copy: slice all or use `copy` module
     - `count(elem)`: count
   - List Comprehension
     ```python
     listone = [2, 3, 4]
     listtwo = [2*i for i in listone if i > 2]
     ```

1. Tuple
   - Property
     - Think of them as similar to lists, but without the extensive functionality that the list class gives you
     - immutable
     - Tuples are usually used in cases where a statement or a user-defined function can safely assume that the collection of values i.e. the tuple of values used will not change
     - can be left value
       ```python
       a,b = b,a # the fastest way to swap two variables in Python
       ```

   - Syntax
     - Tuples are defined by specifying items separated by commas within an optional pair of parentheses
       - explicit parentheses are better than implicit
     - tuple with 0 or 1 items
       ```python
       mytuple = ()
       mytuple = (1, )
       ```

1. Dictionary, and `collections.defaultdict`
   - Concept
     - Association of keys and values
   - Syntax
     ```python
     dict1 = {key1: value1, key2: value2}
     ```

     - keys must be unique and immutable objects (can be a constant)
     - they are instances/objects of the `dict` class
     <!-- - a key can have ~~multiple values~~: union-find sets -->
   - Access: brackets
     ```python
     dict1[key1]
     ```

   - Operation
     - Add
       ```python
       dict1[newkey] = newvalue
       ```

     - delete/remove
       - `del`
         ```python
         del dict1[key1]
         ```

       - `clear()` method: remove all

     - Length
       - `len(dict1)`
     - Check existence
       - `in` operator: keys are checked
     - conversation
       - `items()` method: converse dictionary into a tuple list
         ```python
         >>> mydict = {'a': 1, "b": 2, 'c': 3}
         >>> print mydict.items() # [('a', 1), ('c', 3), ('b', 2)]
         ```

   - Coordination
     - `for`
       ```python
       for i in dict1 # i is keys
       for (i, j) in dict.items() # i, j are keys and values respectively
       ```
   - Application
     - keyword arguments (symbol table in compiler design terminology)

1. Set
   - Concept
     - unordered collections of simple objects
     - used when the existence of an object in a collection is more important than the order or how many times it occurs
   - Syntax
     ```python
     setname = set([value1, value2])
     ```

   - operation
     - `in`
     - copy: `copy()` method
     - add: `add()` method
       ```python
       setname.add(value3)
       ```

     - relationship: `issuperset()` method
       ```python
       brick.issuperset(bri)
       ```

     - delete/remove: `remove()` method
       ```python
       bri.remove('russia')
       ```

     - intersection: `&` or `intersection()` method
       ```python
       bri & bric
       bri.intersection(bric)
       ```

1. Strings
   - see before
   - operation
     - `startswith(prefix, [start, [end]])` method: return `True` if starts with the specified prefix
     - `find(sub, [start, [end]])` method
       - return the lowest index where the sub is found at `S[start:end]`
       - return `-1` if failure
     - `join(iterable)` join the items of a sequence with the string acting as a delimiter

1. References
   ```
   >>> a = [1, 2, 3]
   >>> b = a
   >>> a = [4, 5, 6]
   >>> a
   [4, 5, 6]
   >>> b
   [1, 2, 3]
   >>> a = [1, 2, 3]
   >>> b = a
   >>> a[0], a[1], a[2] = 4, 5, 6
   >>> a
   [4, 5, 6]
   >>> b
   [4, 5, 6]
   ```

   - binding the name to the project

# Libraries

1. [Library References](https://docs.python.org/2/library/)

1. [debugging](http://docs.python.org/2/library/pdb.html), [handling command line options](http://docs.python.org/2/library/argparse.html), [regular expressions](http://docs.python.org/2/library/re.html)

## `os`

1. make directory
   ```python
   if not os.path.exists(target_dir):
       os.mkdir(target_dir)
   ```

   - Windows directories
     - use `'C:\\Documents'` or `r’C: \Documents'`
     - do not use `'C:\Documents'`

1. `os.sep`
   - gives the directory separator according to your operating system
     - `'/'` in GNU/Linux and Unix
     - `'\\'` in Windows
     - `':'` in Macintosh
   - `'/'` can be used in Windows?

1. `os.system(command)`: Execute the command (a string) in a subshell
   - returns `0` if the command was successfully, else it returns an error number

1. `os.getenv(key, default=None)`: Get an environment variable
   - return default value if the key does not exist
   - keys
     - keys of the dict `os.envrion`
     - `'HOME'` (Unix), `os.path.join(os.getenv('HOMEDRIVE'), os.getenv('HOMEPATH'))` (Windows)

1. current directory: `os.getcwd()`
   - `os.curdir`: .
   - equivalent to `os.path.realpath(os.curdir)`

1. `os.path`: module for common pathname manipulations
   - `os.path.join(path, *paths)`: Join one or more path components intelligently
     - If a component is an absolute path, all previous components are thrown away and joining continues from the absolute path component
     - If a component contains a drive letter, all previous components are thrown away and the drive letter is reset
   - `os.path.split(path)`: Split a pathname
     - Return tuple `(head, tail)`
       - where tail is the last pathname component
       - The tail part will never contain a slash
       - if path ends in a slash, tail will be empty
       - If there is no slash in path, head will be empty
   - `os.path.realpath(path)`
     - Return the canonical path of the specified filename, eliminating any symbolic links encountered in the path (if they are supported by the operating system)
   - `os.path.relpath(path[, start])`
     - Return a relative filepath to path either from the *start* directory
     - *start* defaults to `os.curdir`
   - `os.path.getsize(path)`: Return the size, in bytes, of *path*
     - Raise `os.error` if the file does not exist or is inaccessible
   - `os.path.getmtime(path)`: Return the time of last modification of *path*
     - The return value is a number giving the number of seconds since the epoch
       - convert to local time: `time.ctime([secs])`
     - Raise `os.error` if the file does not exist or is inaccessible

1. Change directory to the current directory
   ```python
   os.chdir((os.path.split( os.path.realpath( sys.argv[0] ) )[0]))
   ```

## `time`

1. `time.strftime(format, tuple)`: convert a time tuple to a string according to a format specification
   - `time.strftime('%Y%m%d%H%M%S')`

1. `time.sleep(seconds)`
   - Delay execution for a given number of seconds
   - argument may be a floating point number

## `sys`

1. `sys.argv`: argument list

1. `sys.stdout.flush()`: Flush the internal I/O buffer
   - when used after `print`, contents are immediately printed

## `logging`

tbc

## `platform`

1. `platform.platform(aliased=0, terse=0)`
   ```python
   >>> platform.platform()
   'Windows-7-6.1.7601-SP1'
   ```

   - Returns a single identifying the underlying platform with as much information as possible
   - the output is intended to be human readable rather than machine parsable
   - If `aliased` is true, the function will use aliases, e.g. SunOS will be reported as Solaris
   - If `terse` is true, the function returns only the absolute minimum information needed to identify the platform

# Class

1. `self`
   - name for referring fields (member variables): `self.var`
   - methods must have an extra first name that has to be added to the beginning of the parameter list
   - do not give a value for this parameter when you call the method, Python will provide it
   - `myobject.method(arg1, arg2)` is automatically converted by Python into `MyClass.method(myobject, arg1, arg2)`
   - attribute reference: refer to the variables and methods of the same object using the `self` only

1. `class`
   ```python
   class MyClass: # official
       pass
   class myclass():
       pass
   ```

1. Special Methods: [manual](https://docs.python.org/2/reference/datamodel.html#special-method-names)
   - `__init__(self, ...)` method
   - `__getitem__(self, key)` method: indexing
   - `__str__(self)` method: for `print` and `str()`
   - `__lt__(self, other)`: override the less than operator `<`
   - `__len__(self)`: for `len()` function

1. Class variables and object variables
   - Class Variables, a.k.a. static member variable
     ```python
     class Robot:
         # A class variable, counting the number of robots
         population = 0
     ```

     - refer: `Robot.population`, or `self.__class__.population`
   - Object variables
     - `self.var`

1. Class method
   - def: using a decorator (tbc): `@classmethod`
     - take the class name as implicit argument
   - call: `classname.classmethod1()`

1. static method
   - def: use `@staticmethod`

1. Encapsulation
   - All class members are public
   - make private: using the double underscore prefix such as `__privatevar`
   - all the methods are virtual in Python

1. Inherit
   - polymorphism
   - Syntax
     ```python
     classdef    ::=  "class" classname [inheritance] ":" suite
     inheritance ::=  "(" [expression_list] ")"
     classname   ::=  identifier
     ```

     where expression_list is the base class names in a tuple
   - `__init__()`: initialize the base class part of the object
     - call the `__init__()` method of the base class is explicitly called using the self variable
     - Python does not automatically call the constructor of the base class
   - call methods of the base class in subclasses
     - `baseclassname.method()`
     - pass in the `self` variable along with any arguments
   - when calling a method
     - Python always starts looking for methods in the actual type
     - If it could not find the method, it starts looking at the methods belonging to its base classes one by one in the order they are specified in the tuple in the class definition

# I/O

1. `raw_input([prompt])`: Read a string from standard input
   - The trailing newline is stripped
   - If the user hits EOF (Unix: Ctrl-D, Windows: Ctrl-Z+Return), raise EOFError
   - The prompt string, if given, is printed without a trailing newline before reading

1. File I/O
   - open and close example
     ```python
     poem = 'Life is short, use Python.'
     # Open for 'w'riting
     f = open('poem.txt', 'w')
     # Write text to file
     f.write(poem)
     # Close the file
     f.close()
     ```

     `with` automatically closes the file
   - `open(name, mode=None, buffering=None)`
     - the file will be made if it does not exist
     - mode
       - `'r'` read, `'w'` write, `'a'` append, `'r+'` both reading and writing
       - `'t'` text, `'b'` binary
       - default: `'rt'`
   - read
     - `file.readline([size])`: retain a newline
       - size: non-negative, limits the maximum number of bytes to return
       - return an empty string at EOF
     - `file.read([size])`: read at most size bytes and return as a string
       - if size argument is negative or omitted, read until EOF
       - note when in non-blocking mode
     - `file.readlines()`: read all the lines of a file in a list
       - same as `list(f)`
   - write
     - `file.write(str)`: write string to file, return `None`
     - `file.writelines(sequence_of_strings)`
       - newlines are added
       - sequence can be any iterable object producing strings
       - equivalent to calling `write()` for each string
   - position
     - `file.tell()`
       - return the current file position, an integer
     - `file.seek(offset[, whence])`: move to a new file position, return `None`
       - offset: byte count
       - whence
         - 0: from start of file (default)
         - 1: move relative to current position
         - 2: move relative to the end of file

1. `with`
   ```python
   with open("poem.txt") as f:
      for line in f:
          print line,
   ```

   - Acquiring a resource in the `try` block and subsequently releasing the resource in the `finally` block
   - mechanism
     - it calls the `file.__enter__()` function at the start and calls `file.__exit__()` at the end
     - the code that we would have written in a `finally` block should be taken care of automatically by the `exit` method

1. Pickle
   - can store any plain Python object in a file and then get it back later
   - store (pickling): `open` the file in write binary mode and then call `pickle.dump()`
     - `pickle.dump(obj, file)`
   - retrieve (unpickling): `pickle.load(file)`: returns the object

# Exceptions

1. Error handler

1. Handling Exceptions: `try...except`
   ```python
   try:
       text = raw_input('Enter something --> ')
   except EOFError:
       print 'Why did you do an EOF on me?'
   except KeyboardInterrupt:
       print 'You cancelled the operation.'
   else:
       print 'You entered {}'.format(text)
   ```

   - `try`: put all the statements that might raise exceptions/errors
   - `except`
     - handlers for the appropriate errors/exceptions
     - can handle a single specified error or exception, or a parenthesized list of errors/exceptions
     - If no names of errors or exceptions are supplied, it will handle all errors and exceptions
     - there has to be at least one `except` clause associated with every `try` clause
     - user-defined override default
   - `else`: This clause is executed if no exception occurs

1. Raising Exceptions: `raise`
   - The error or exception that you can raise should be a class which directly or indirectly must be a derived class of the `Exception` class
     ```python
     class ShortInputException(Exception):
         '''A user-defined exception class.'''
         def __init__(self, length, atleast):
             Exception.__init__(self)
             self.length = length
             self.atleast = atleast
     ```

   - throw an error, with or without initialization
     ```python
     try:
         text = raw_input('Enter something --> ')
         if len(text) < 3:
             raise ShortInputException(len(text), 3)
         # ... Other work can continue as usual here
     ```
   - use of exception
     ```python
     try:
         # ...
     except ShortInputException as ex:
         print ('ShortInputException: The input was ' + \
                '{0} long, expected at least {1}')\
                .format(ex.length, ex.atleast)
     else:
         print 'No exception was raised.'
     ```

1. `finally`
   ```python
   try:
       # ...
   finally:
       # ...
   ```

   - executed whether or not an exception was raised
     - can be used to ensure that the file object is closed properly

1. `assert`: check
   ```
   assert_stmt ::=  "assert" expression ["," expression]
   ```

   - The simple form, `assert expression`, is equivalent to
     ```python
     if __debug__:
         if not expression: raise AssertionError
     ```

   - The extended form, `assert expression1, expression2`, is equivalent to
     ```python
     if __debug__:
         if not expression1: raise AssertionError(expression2)
     ```

# Decorator

1. can be imagined to be a shortcut to calling a wrapper function
   ```python
   @classmethod
   def funcname(self, parameter_list):
     pass
   # equivalent to
   funcname = classmethod(funcname)
   ```

tbc

# Python 2 to 3

1. [2to3 - Automated Python 2 to 3 code translation][2to3]

1. ["Six" library][Six]

1. <http://lucumr.pocoo.org/2013/5/21/porting-to-python-3-redux/>

1. <http://pydanny.com/experiences-with-django-python3.html>

1. <https://docs.djangoproject.com/en/dev/topics/python3/>

1. <http://www.reddit.com/r/Python/comments/22ovb3/what_are_the_advantages_to_python_3x/>

[2to3]: https://docs.python.org/2/library/2to3.html
[Six]: http://pythonhosted.org/six/

# GUI

- Tkinter
- Kivy
  - [http://kivy.org](http://kivy.org/)
- PyGTK
  - This is the Python binding for the GTK+ toolkit which is the foundation upon which GNOME is built. GTK+ has many quirks in usage but once you become comfortable, you can create GUI apps fast. The Glade graphical interface designer is indispensable. The documentation is yet to improve. GTK+ works well on GNU/Linux but its port to Windows is incomplete. You can create both free as well as proprietary software using GTK+. To get started, read the [PyGTK tutorial](http://www.pygtk.org/tutorial.html).
- PyQt
  - This is the Python binding for the Qt toolkit which is the foundation upon which the KDE is built. Qt is extremely easy to use and very powerful especially due to the Qt Designer and the amazing Qt documentation. PyQt is free if you want to create open source (GPL'ed) software and you need to buy it if you want to create proprietary closed source software. Starting with Qt 4.5 you can use it to create non-GPL software as well. To get started, read about [PySide](http://qt-project.org/wiki/PySide).
- wxPython
  - This is the Python bindings for the wxWidgets toolkit. wxPython has a learning curve associated with it. However, it is very portable and runs on GNU/Linux, Windows, Mac and even embedded platforms. There are many IDEs available for wxPython which include GUI designers as well such as [SPE (Stani's Python Editor)](http://spe.pycs.net/) and the [wxGlade](http://wxglade.sourceforge.net/) GUI builder. You can create free as well as proprietary software using wxPython. To get started, read the [wxPython tutorial](http://zetcode.com/wxpython/).
- For more choices, see the [GuiProgramming wiki page at the official python website](http://www.python.org/cgi-bin/moinmoin/GuiProgramming).
- For a more detailed and comprehensive analysis, see Page 26 of the ['The Python Papers, Volume 3, Issue 1' (PDF)](http://archive.pythonpapers.org/ThePythonPapersVolume3Issue1.pdf).
