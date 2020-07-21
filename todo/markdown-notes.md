# Markdown

TODO: format

[TOC]

## Resources

- [typora support](http://support.typora.io/)
- tbd

## Styles

Each section contains syntax and corresponding complied HTML.

### ~~Mistaken Text~~

- Syntax: `~~Strikethrough~~`
- In HTML

  ```html
  <del>Strikethrough</del>
  ```

### _italic_

`_this_` or `*this*`

```html
<em>italic</em>
```

### **bold**

`**extraordinarily**` or `__exceptionally__`

```html
<strong>bold</strong>
```

### ==highlight== (limited support)

`==highlight==`

```html
<mark>highlight</mark>
```

### ==~~**_combined_**~~==

`==~~**_example_**~~==`

### footnotes[^notes]

```markdown
You can create footnotes like this[^footnote].

[^footnote]: Here is the *text* of the **footnote**.
```

[^notes]: lmao

### <u>underline</u>

Use raw _HTML_ `<u>underline</u>`

### ~subscripts~ (limited support)

`~subscripts~`

```html
<sub>subscripts</sub>
```

Please use escapes for~longer\ script~

```markdown
Please use escapes for~longer\ script~
```

### ^superscripts^ (limited support)

`^superscripts^`

```html
<sup>superscripts</sup>
```

### <center>align</center> (deprecated)

- center align

  ```html
  <center>centerAligned</center>
  <div align="center">centerAlignedText</div> <!-- alternative  -->
  ```

- other align

  ```html
  <div align="left">leftAlignedText"</div>
  <div align="right">rightAlignedText"</div>
  <div align="justify">justifiedText"</div> <!-- make every row the same length-->
  ```

### Font (deprecated)

For `<font property="value">Text</font>`:

| Property |                Value                 | Description |
| :------: | :----------------------------------: | :---------: |
| `color`  | `#ffffff` or `rgb(x,x,x)` or `green` | font color  |
|  `face`  |            *font_family*             |    font     |
|  `size`  |         *number* ($2x+8$ px)         |  font size  |

For `<div style="property:value">Text</div>`:

|  Property   |                Value                 | Description |
| :---------: | :----------------------------------: | :---------: |
|   `color`   | `#ffffff` or `rgb(x,x,x)` or `green` | font color  |
| `font-size` |      `20px` or `1em` or `1rem`       |  font size  |

Example:

```html
<font size="3" color="red">This is some text!</font>
<font size="2" color="blue">This is some text!</font>
<font face="verdana" color="green">This is some text!</font>
```

```html
<div style="color:#00FF00">
  <h3>This is a header</h3>
  <p>This is a paragraph.</p>
</div>
<div style=”font-size:20px”>20px</div>
```

## Headers

Use hash sequences, up to `######`.

```
<h1>header one</h1> `# header one` or `# header one # `
<h2>header two</h2>
<h3>header three</h3> `### header three` or `### header three ###` or `### header three #############`
<h4>header four</h4>
<h5>header five</h5>
<h6>header six</h6>
```

## Links

### automatic links

`<test.me>`
`<example@test.io>`

### inline link

`[visit GitHub!](github.com)`

```html
<p>A <a href="http://example.com">link</a>.</p>
```

### reference link

```markdown
Here's [a link to something else][another place].
Here's [yet another link][another-link].
And now back to [the first link][another place].
Implicit link name [foo][]

[another place]: www.github.com
[another-link]: www.google.com

Some equivalent examples:
[foo]: http://example.com/  "Optional Title Here"
[foo]: http://example.com/  'Optional Title Here'
[foo]: http://example.com/  (Optional Title Here)
[id]: <http://example.com/>  "Optional Title Here"
[id]: http://example.com/longish/path/to/resource/here "Optional Title Here"
```

## Images

### insert images

Prefaced with the exclamation point  `!` , other things is the same as inline links and reference links.

```markdown
![A representation of Octdrey Catburn](http://octodex.github.com/images/octdrey-catburn.jpg)
```

- Use relative path:
  - Default behavior for local images sharing the same path with the current `*.md` file
  - Specify a url prefix for image with property `typora-root-url` in YAML Front Matters
    - For example: `typora-root-url:/User/Abner/Website/typora.io/` in YAML Front Matters
  - `Edit` → `Image Tools` → `Use Image Root Path` to tell Typora to generate `typora-root-url` property automatically

### Image Styles: Resize and Align (deprecated)

1. Resize <!-- html comment -->

   ```html
   <img src="https://www.google.com/doodles/kamma-rahbeks-241st-birthday" width="200px" />
   <!--or-->
   <img src="https://www.google.com/doodles/kamma-rahbeks-241st-birthday" style="height:200px" />
   <!--or-->
   <img src="https://www.google.com/doodles/kamma-rahbeks-241st-birthday" style="zoom:50%" />
   ```

2. Align

   ```markdown
   <center>![]()</center>
   ```

### tables

```markdown
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
```

by including colons `:` within the header row, you can define text to be left-aligned, right-aligned, or center-aligned:

```markdown
| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |
```

### TOC: table of contents (limited support)

`[toc]`

### diagrams: sequence, flowchart and Mermaid (limited support)

See [typora support](http://support.typora.io/Draw-Diagrams-With-Markdown/).

## Blocks

### quotes

```Markdown
>preface a line with the "greater than" caret (>)
>>It can be nested
```

### `codes`

```markdown
`warp codes with grave accent`
```

### original code blocks

One level of indentation — 4 spaces or 1 tab — is removed from each line of the code block. A code block continues until it reaches a line that is not indented (or the end of the article).

### gfm code span

```markdown
Add an optional language identifier after ``` and we'll run it through syntax highlighting.

​```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
​```
```

## Lists

### unordered lists

List items with  `*` or `-` or `+` . Each list item also gets its own line.

```html
<ul>
<li>apples</li>
<li>oranges</li>
<li>pears</li>
</ul>
```

### ordered lists

Substitute asterisks with numbers. Only `1.` with a trailing space is necessary, following sequences can be replaced by asterisks and numbers will be corrected automatically.

```html
<ol>
<li>apples</li>
<li>oranges</li>
<li>pears</li>
</ol>
```

### nested lists

The same syntax. Indent each asterisk.

### task lists

```markdown
* [ ] a task list item
* [ ] list syntax required
+ [ ] normal **formatting**, @mentions, #1234 refs
- [ ] incomplete
- [x] completed
```

## Paragraphs

### hard break

insert a new line

```html
<p>paragraph one
 paragraph two
</p>
```

### soft break

insert two space at the end of a line.

```html
<p>paragraph one<br/>paragraph two</p>
```

## Inline HTML Support

HTML tags are squarely supported.

_Markdown_ syntax is not processed within __block-level__ _HTML_ tags and is processed within **span-level** _HTML_ tags.

## Math

This feature needs MathJax support.

### inline math

`$Tex commands$`

### math blocks

You can render *LaTeX* mathematical expressions using **MathJax**.
In markdown source file,math block is $\mathrm \LaTeX$ expression wrapped by `$$` mark:

```latex
$$
\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
\frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0 \\
\end{vmatrix}
$$
```

$$
\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
\frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0 \\
\end{vmatrix}
$$

## Special Characters

### auto escaping for special characters

- zero width space in _HTML_: `&#8203;`
- tab
  - horizontal tab in _HTML_: `&#9;` or `&Tab;`
  - vertical tab in _HTML_: `&#xB;`
- `&` is equivalent to `&amp;`

### special symbols indicated by backslash `\`  

These symbols are backslash supported.

| special symbols | names               |
| --------------- | ------------------- |
| \               | backslash           |
| `               | grave accent        |
| *               | asterisk            |
| _               | underscore          |
| {}              | curly braces        |
| []              | square brackets     |
| ()              | parentheses         |
| #               | hash mark           |
| +               | plus sign           |
| -               | minus sign (hyphen) |
| .               | dot                 |
| !               | exclamation mark    |

## Horizontal Rules

```markdown
* * *
***
*****
- - -
---------------------------------------
```
---
```html
<hr />
```

## Miscellaneous

### YAML Font Matter (limited support)

Typora support [YAML FrontMatter](http://jekyllrb.com/docs/frontmatter/) now. Input `---` at the top of the article and then press `Enter` will introduce one. Or insert one metadata block from the menu.

### emoji

- example — `:smile:`
- [🎁 Emoji cheat sheet for GitHub, Basecamp, Slack & more](https://www.webfx.com/tools/emoji-cheat-sheet/)
