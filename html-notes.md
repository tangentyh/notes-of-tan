# Philosophy

1. Content categories
   - [MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories)

1. user agent stylesheet -- see CSS notes

# Character Entities

1. common special characters
   | Character | Description | Entity Name | Entity Number |
   | --------- | ----------- | ----------- | ------------- |
   | “ ” | non-breaking space | `&nbsp;` | `&#160;` |
   | “<” | less than | `&lt;` | `&#60;` |
   | “>” | greater than | `&gt;` | `&#62;` |
   | “&” | ampersand | `&amp;` | `&#38;` |
   | “—” | em dash | `&mdash;` | `&#8212;` |
   | “–” | en dash | `&ndash;` | `&#8211;` |
   | “©” | copyright | `&copy;` | `&#169;` |
   | “®” | registered trademark | `&reg;` | `&#174;` |
   | “™” | trademark | `&trade;` | `&#8482;` |
   | “☎” | phone | `&phone;` | `&#9742;` |

1. Entity Name
   - [reference on W3C](https://dev.w3.org/html5/html-author/charref)
   - [encode, decode tool](https://mothereff.in/html-entities)

1. Entity Number
   - `&#` -- unicode in decimal
   - `&#x` -- unicode in hex
   - `&#8212`, `&#x2014`, `&mdash;`
   - emoji extension on VSCode

# Global Attributes

1. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)

1. `aria-*` -- Accessible Rich Internet Applications
   - `role=`
   - tbd

1. event handlers

1. `title=` -- advisory information related to the element
   - usually on hover

1. `class=` and `id=`
   - `class` -- multiple to multiple
   - `id` -- one to one

1. `data-*`
   - `HTMLElement.dataset`
   - `Element.setAttribute()`
   - `Element.getAttribute()`

1. `is=` -- specify that a standard HTML element should behave like a registered custom built-in element
   - `CustomElementRegistry.define()`

1. `lang=`
   - use in `<html>` to declare the primary language of the document

1. `dir=`
   - `ltr` -- left to right and is to be used for languages that are written from the left to the right (like English);
   - `rtl` -- right to left and is to be used for languages that are written from the right to the left (like Arabic);
   - `auto` -- let the user agent decides. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then apply that directionality to the whole element
   - `<bdi></bdi>` -- Bidirectional Isolate element, tells the browser's bidirectional algorithm to treat the text it contains in isolation from its surrounding text
     - useful when a website dynamically inserts some text and doesn't know the directionality of the text being inserted
   - `<bdo></bdo>` -- Bidirectional Text Override element, overrides the current directionality of text, so that the text within is rendered in a different direction

1. `tabindex=` -- A numeric value providing guidance to the user agent as to the order in which controls receive focus when the user presses the Tab key
   - negative -- element will be focusable, but it should not be reachable via sequential keyboard navigation
   - 0 -- reachable, but relative order is defined by the platform convention
   - positive -- reachable, relative order will be defined by the attribute value
     - not recommended

1. `draggable=` -- whether the element can be dragged, using the Drag and Drop API
   - `true`
   - `false`

1. `hidden`

1. `style=`

1. `contenteditable=`
   - `true` or the empty string, which indicates that the element must be editable;
   - `false`, which indicates that the element must not be editable

1. `spellcheck=` -- Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used

1. `translate`
   - empty string and `"yes"`, which indicates that the element should be translated when the page is localized.
   - `"no"`, which indicates that the element must not be translated.
   - not supported yet

# Document Information

1. `doctype` -- `<!DOCTYPE html>` -- case-insensitive
   - HTML5 is not based on SGML (Standard Generalized Markup Language), and therefore does not require a reference to a DTD (Document Type Definition)

1. `<title></title>`

1. `<meta>` -- metadata
   - [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#Attributes)
   - `name=`, `content=` -- name-value pairs
   - `charset=`
   - page information -- `name=`
     - `application-name`
     - `description`
     - `generator`
     - `keywords`
   - part of SEO optimization -- `name="robots"`
   - Automatic Refresh, redirect
     ```html
     <meta http-equiv="refresh" content="5">
     ```
     - reload -- `content` is a positive integer
     - redirect -- `content` is a positive integer + `;url=` + URL
   - turn off Phone Number Recognition
     ```html
     <meta name="format-detection" content="telephone=no">
     ```
   - web app
     - add to home screen
       - [Google](https://developers.google.com/web/fundamentals/app-install-banners/)
     - open web app in full-screen mode (without address bar)
       ```html
       <meta name="mobile-web-app-capable" content="yes">
       <meta name="apple-mobile-web-app-capable" content="yes">
       ```
   - Mobile Layout Control -- `name=viewport`
     ```html
     <meta name="viewport" content="width=device-width, initial-scale=1">
     ```
     - `width`: A positive integer number, or the text `device-width` -- Defines the pixel width of the viewport that you want the web site to be rendered at.
     - `height`: A positive integer, or the text `device-height` -- Defines the height of the viewport. Not used by any browser.
     - `initial-scale`: A positive number between 0.0 and 10.0 -- Defines the ratio between the device width (`device-width` in portrait mode or `device-height` in landscape mode) and the viewport size.
     - `maximum-scale`: A positive number between 0.0 and 10.0 -- Defines the maximum amount to zoom in. It must be greater or equal to the minimum-scale or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
     - `minimum-scale`: A positive number between 0.0 and 10.0 -- Defines the minimum zoom level. It must be smaller or equal to the maximum-scale or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
     - `user-scalable`: `yes` or `no` -- If set to `no`, the user is not able to zoom in the webpage. The default is `yes`. Browser settings can ignore this rule, and iOS10+ ignores it by default.
   - share on social media
     - Facebook / Open Graph
       ```html
       <meta property="fb:app_id" content="123456789">
       <meta property="og:url" content="https://example.com/page.html">
       <meta property="og:type" content="website">
       <meta property="og:title" content="Content Title">
       <meta property="og:image" content="https://example.com/image.jpg">
       <meta property="og:description" content="Description Here">
       <meta property="og:site_name" content="Site Name">
       <meta property="og:locale" content="en_US">
       <meta property="article:author" content="">
       <!-- Facebook: https://developers.facebook.com/docs/sharing/webmasters#markup -->
       <!-- Open Graph: http://ogp.me/ -->
       ```
     - Facebook / Instant Articles
       - [Facebook](https://developers.facebook.com/docs/instant-articles/guides/articlecreate)
     - [Twitter](https://dev.twitter.com/cards/getting-started)
     - Google+ / Schema.org
       ```html
       <link href="https://plus.google.com/+YourPage" rel="publisher">
       <meta itemprop="name" content="Content Title">
       <meta itemprop="description" content="Content description less than 200 characters">
       <meta itemprop="image" content="https://example.com/image.jpg">
       ```

# Uncategorized Tags

1. comment
   - Commenting out whitespace between inline elements
     ```html
     <a href="#">I hope there will be no extra whitespace after this!</a><!--
     --><button>Foo</button>
     ```

1. grouping and encapsulating other elements -- `<div></div>` block, `<span></span>` inline

# Text Content

1. paragraphs and breaks
   - `<p></p>`, `<br>`
   - `<hr>`
   - `<wbr>` -- word break opportunity, a position within text where the browser may optionally break a line
     ```html
     <p>Fernstraßen<wbr>bau<wbr>privat<wbr>finanzierungs<wbr>gesetz</p>
     <p>Fernstraßen&shy;bau&shy;privat&shy;finanzierungs&shy;gesetz</p>
     <p>http://this<wbr>.is<wbr>.a<wbr>.really<wbr>.long<wbr>.example<wbr>.com/With<wbr>/deeper<wbr>/level<wbr>/pages<wbr>/deeper<wbr>/level<wbr>/pages<wbr>/deeper<wbr>/level<wbr>/pages<wbr>/deeper<wbr>/level<wbr>/pages<wbr>/deeper<wbr>/level<wbr>/pages</p>
     ```
     - behaves like the zero-width space `&ZeroWidthSpace;`
     - hyphen -- does not introduce a hyphen at the line break point. To make a hyphen appear only at the end of a line, use the soft hyphen character entity (`&shy;`) instead

1. text formating
   - `<mark></mark>`
   - `<strong></strong>`, `<b></b>`
   - `<em></em>`, `<i></i>`
   - `<u></u>` -- The Unarticulated Annotation (Underline) element, represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation
     - could use it to annotating spelling errors, etc.
     - should not use `<u>` to simply underline text for presentation purposes, or to denote titles of books
   - `<abbr title="Hypertext Markup Language">HTML</abbr>`
   - `<ins>New Text</ins>` -- mark text as inserted
   - `<del>Deleted Text</del>`
   - `<s>Struck-through text here</s>`
   - `<sup></sup>`, `<sub></sub>`
   - code formating
     - `<kbd></kbd>`
     - `<pre></pre>`
     - `<code></code>`
     - `<samp></samp>` -- enclose inline text which represents sample (or quoted) output from a computer program
     - `<var></var>` -- the name of a variable in a mathematical expression or a programming context
   - quote
     ```html
     <blockquote cite="https://www.huxley.net/bnw/four.html">
         <p>Words can be like X-rays, if you use them properly – they'll go through anything. You read and you're pierced.</p>
     </blockquote>
     <cite>– Aldous Huxley, Brave New World</cite>
     ```
     - `<q></q>` -- the enclosed text is a short inline quotation
       - Most modern browsers implement this by surrounding the text in quotation marks
       - `cite=` -- a source document or message for the information quoted
     - `<blockquote></blockquote>` -- the enclosed text is an extended quotation
       - `cite=` -- a source document or message for the information quoted
     - `<cite></cite>` -- describe a reference to a cited creative work, and must include either the title or author or the URL of that work
   - data
     - `<data></data>` -- links a given content with a machine-readable translation
       - `value=` -- specifies the machine-readable translation of the content of the element
     - `<time></time>` -- time data
       - `datetime=` -- the time and/or date of the element, in a valid format
       - [format](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time#Valid_datetime_Values)

1. Ruby -- `<ruby></ruby>`
   ```html
   <ruby>
   明日 <rp>(</rp><rt>あした</rt><rp>)</rp>
   </ruby>
   <ruby>
     漢 <rp>(</rp><rt>かん</rt><rp>)</rp>
     字 <rp>(</rp><rt>じ</rt><rp>)</rp>
   </ruby>
   <ruby>
     <rb>漢<rb>字
     <rp>(</rp><rt>kan<rt>ji<rp>)</rp>
   </ruby>
   ```
   - `<rp></rp>` -- Ruby Fallback Parenthesis, provide fall-back parentheses for browsers that do not support display of ruby annotations
   - `<rt></rt>` -- ruby text, usually pronunciation
   - `<rb>` -- ruby base, used to delimit the base text component of a `<ruby>` annotation
     - not well supported
   - `<rtc></rtc>` -- Ruby Text Container, semantic annotations of characters presented in a ruby of `<rb>` elements
     - not well supported

1. Anchors and Hyperlinks -- `<a></a>`
   - `download="filename"`, `download`
     - only works for same-origin URLs, `data:` and `blob:`
     - If the HTTP header `Content-Disposition:` gives a different filename than this attribute, the HTTP header takes priority over this attribute
   - `href`
     - absolute or relative
     - `tel:` -- dial the number
     - `="#elementId"`
     - `="#top"` or `="#"` -- top of the page
     - `javascript:` -- also `onclick` without the protocol
       - `<a href="javascript:myFunction();">Run Code</a>`
       - `<a href="#" onclick="myFunction(); return false;">Run Code</a>` -- `return false` prevents the page from scrolling to the top
       - `<a href="#!" onclick="myFunction();">Run Code</a>`
     - email -- `cc`, `bcc`, `subject`, `body`
       - `<a href="mailto:example@example.com?cc=john@example.com&bcc=jane@example.com">Send email</a>`
       - `<a href="mailto:example@example.com?subject=Example+subject&body=Message+text">Send email</a>`
   - `rel` -- relationship, [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)
     - `="external"`
   - `target`
     - consider adding `rel="noopener noreferrer"` to avoid exploitation of the `window.opener`
     - `_self`: Load the URL into the same browsing context as the current one. This is the default behavior. (default)
     - `_blank`: Load the URL into a new browsing context. This is usually a tab, but users can configure browsers to use new windows instead.
     - frame related
       - `_parent`: Load the URL into the parent browsing context of the current one. If there is no parent, this behaves the same way as _self.
       - `_top`: Load the URL into the top-level browsing context (that is, the "highest" browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this behaves the same way as _self.
   - purely advisory
     - `hreflang`
     - `type` -- MIME type

1. Lists
   - `<ol></ol>`
     - `start=` -- number
     - `reversed`
     - `type` -- consider CSS `list-style-type` first
       - `'a'` indicates lowercase letters,
       - `'A'` indicates uppercase letters,
       - `'i'` indicates lowercase Roman numerals,
       - `'I'` indicates uppercase Roman numerals,
       - `'1'` indicates numbers (default).
   - `<ul></ul>`
   - `<li></li>`
     - `value=` -- number, only for ordered lists

1. A description list (or definition list)
   ```html
   <p>The HTML description list elements:</p>
   <dl>
       <dt><code>dl</code></dt>
       <dd>Contains a description or definition list, which lists out terms and their descriptions.</dd>
       <dt><code>dt</code></dt>
       <dd>Specifies one term whose description is provided in the next <code>dd</code> block.</dd>
       <dt><code>dd</code></dt>
       <dd>The description or definition for the term or terms in the preceding <code>dt</code> element or elements.</dd>
   </dl>
   ```
   - `<dl>`: The Description List element
   - `<dt>`: The Description Term element
   - `<dd>`: The Description Details element
   - `<dfn></dfn>` -- The Definition element, a definition phrase or sentence
     - The `<p>` element, the `<dt>/<dd>` pairing, or the `<section>` element which is the nearest ancestor of the `<dfn>` is considered to be the definition of the term
     - if a `title` attribute, then the term is the value of that attribute

1. tables
   - `<table></table>` -- outermost
   - `<caption></caption>` -- the caption (or title) of a table, and if used is always the first child of a `<table>`
   - `<tr></tr>` -- table row
     - `<th></th>` -- table header, special `<td>`
       - `colspan=`
       - `rowspan=`
       - `headers=` -- This attribute contains a list of space-separated strings, each corresponding to the `id` attribute of the `<th>` elements that apply to this element.
         - `scope` is usually enough
       - `scope=` -- This enumerated attribute defines the cells that the header (defined in the `<th>`) element relates to. It may have the following values:
         - `row`: The header relates to all cells of the row it belongs to.
         - `col`: The header relates to all cells of the column it belongs to.
         - `rowgroup`: The header belongs to a rowgroup and relates to all of its cells. These cells can be placed to the right or the left of the header, depending on the value of the `dir` attribute in the `<table>` element.
         - `colgroup`: The header belongs to a colgroup and relates to all of its cells.
         - `auto`
     - `<td></td>` -- table data
       - `colspan=`
       - `rowspan=`
       - `headers=` -- This attribute contains a list of space-separated strings, each corresponding to the `id` attribute of the `<th>` elements that apply to this element.
         - `scope` is usually enough
   - `<colgroup></colgroup>` -- a group of columns for styling or semantic reasons
     - `span=` -- not permitted if there are one or more `<col>` elements within
     - `<col></col>` -- defines a column within a table, attributes applies to a whole column
       - `span=`
       - often and `class`
   - `<thead></thead>`, `<tbody></tbody>`, `<tfoot></tfoot>` -- a set of rows, semantic information
     - foot is optional

# Linking Resources

1. `crossorigin=`
   - `anonymous` -- CORS requests for this element will not have the credentials flag set.
   - `use-credentials` -- CORS requests for this element will have the credentials flag set; this means the request will provide credentials.
   - By default (that is, when the attribute is not specified), CORS is not used at all

1. `media=` -- Media query of the resource's intended media
   - [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)

1. `<base>` -- the base URL to use for all relative URLs contained within a document
   - `href=` -- The base URL to be used throughout the document for relative URL addresses, absolute or relative
   - `target=` -- assign default target

## `<script></script>`

1. attributes
   - global attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)
   - `async` HTML5 -- indicating that the browser should, if possible, execute the script asynchronously
      - must not be used if the `src` attribute is absent (i.e. for inline scripts). If it is included in this case it will have no effect
      - Dynamically inserted scripts (using `document.createElement()`) execute asynchronously by default
   - `defer` -- Boolean attribute is set to indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing `DOMContentLoaded`
     - Scripts with the defer attribute will prevent the `DOMContentLoaded` event from firing until the script has loaded and finished evaluating
     - must not be used if the `src` attribute is absent (i.e. for inline scripts), in this case it would have no effect
     - To achieve a similar effect for dynamically inserted scripts use `async=false` instead
     - Scripts with the `defer` attribute will execute in the order in which they appear in the document
   - `type`
     - Omitted or a JavaScript MIME type: For HTML5-compliant browsers this indicates the script is JavaScript
     - `module`: HTML5 For HTML5-compliant browsers the code is treated as a JavaScript module
   - `nomodule`
     - Browsers that support `type=module` ignore any script with a `nomodule` attribute. That enables you to use module scripts while also providing `nomodule`-marked fallback scripts for non-supporting browsers

1. synchronous
   - Scripts without `async`, `defer` or `type="module"` attributes, as well as inline scripts, are fetched and executed immediately, before the browser continues to parse the page

1. inline scripts for XHTML
   - warp with `//<![CDATA[`, `//]]>`

1. `<noscript></noscript>`

## `<link>`

1. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)

1. CSS
   ```html
   <link rel="stylesheet" href="path/to.css" type="text/css">
   <link rel="stylesheet" href="path/to.css">
   <style type="text/css">
       @import("path/to.css")
   </style>
   <style>
       @import("path/to.css")
   </style>
   ```
   - HTML5 -- `type` is recommended to be omitted
   - later files and declarations will override earlier ones
   - Alternative CSS -- with `title=`
     ```html
     <link rel="alternate stylesheet" href="path/to/style.css" title="yourTitle">
     ```
   - inline -- `style=`

1. Favicon
   ```html
   <link rel="icon" type="image/png" href="/favicon.png">
   <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
   ```
   - A file named `favicon.ico` at the root of your website will typically be loaded and applied automatically, without the need for a `<link>` tag

1. `rel=` Resource Hint: prev, next, dns-prefetch, prefetch, prerender
   ```html
   <link rel="prev" href="URL">
   ```
   - `prev`, `next` -- point to pages that are coming before and after
   - `preconnect` -- resolve the DNS. However, it will also make the TCP handshake, and optional TLS negotiation
   - `dns-prefetch` -- Informs browsers to resolve the DNS for a URL
   - `prefetch`
   - `prerender` -- fetch and render the URL in the background, so that they can be delivered to the user instantaneously as the user navigates to that URL

1. `media=` -- the media that the linked resource applies to
   - example -- only display that style sheet for print pages
     ```html
     <link rel="stylesheet" href="test.css" media="print">
     ```

1. RSS -- `rel="alternate"`
   ```html
   <link rel="alternate" type="application/atom+xml" href="http://example.com/feed.xml" />
   <link rel="alternate" type="application/rss+xml" href="http://example.com/feed.xml" />
   ```
   - RSS [MDN](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Tools/Feeds)
   - Atomic RSS [MDN](https://developer.mozilla.org/en-US/docs/Web/RSS/Module/Atom)

## images

1. `<img/>`
   - `src=`
   - `alt=` -- alt text
   - responsive
     ```html
     <img sizes="(min-width: 1200px) 580px,
                 (min-width: 640px) 48vw,
                 98vw"
          srcset="img/hello-300.jpg 300w,
                  img/hello-600.jpg 600w,
                  img/hello-900.jpg 900w,
                  img/hello-1200.jpg 1200w"
          src="img/hello-900.jpg" alt="hello"/>
     ```
     - `sizes=` -- A list of one or more strings separated by commas indicating a set of source sizes. Each source size consists of:
       - a media condition. This must be omitted for the last item.
       - a source size value.
       - `(min-width: 640px) 48vw` -- if viewport is between 640px and 1200px, image takes 48% of viewport
       - User agents use the current source size to select one of the sources supplied by the srcset attribute, when those sources are described using width (`'w'`) descriptors
     - `srcset=` -- A list of one or more strings separated by commas indicating a set of possible image sources for the user agent to use. Each string is composed of:
       - a URL to an image,
       - optionally, whitespace followed by one of:
       - A width descriptor, or a positive integer directly followed by `'w'`
       - A pixel density (device pixel to CSS pixel, `Window.devicePixelRatio`) descriptor, which is a positive floating point number directly followed by `'x'`
         ```html
         <img src="img/hello-300.jpg" alt="hello"
         srcset="img/hello-300.jpg,
         img/hello-600.jpg 2x,
         img/hello-1200.jpg 3x"/>
         ```

1. `<figure></figure>` -- sectioning root for a figure
   ```html
   <figure>
       <img src="/media/examples/frog.png" alt="Tree frog" />
       <figcaption>Tree frog by David Clode on Unsplash</figcaption>
   </figure>
   ```
   - `<figcaption></figcaption>` -- a caption or legend for the rest of the contents its parent `<figure>` element, if any
     - must be its first or last child

1. `<picture></picture>` -- a container for zero or more `<source>` elements and one `<img>` element to provide versions of an image for different display device scenarios
   ```html
   <picture>
   <source media="(min-width: 600px)" srcset="large_image.jpg">
   <source media="(min-width: 450px)" srcset="small_image.jpg">
   <img src="default_image.jpg" style="width:auto;"/>
   </picture>
   ```

1. `<map></map>` -- image maps, an image `<img>` with clickable areas `<area>` that usually act as hyperlinks
   ```html
   <map name="infographic">
       <area shape="poly" coords="130,147,200,107,254,219,130,228"
             href="https://developer.mozilla.org/docs/Web/HTML"
             target="_blank" alt="HTML" />
       <area shape="poly" coords="130,147,130,228,6,219,59,107"
             href="https://developer.mozilla.org/docs/Web/CSS"
             target="_blank" alt="CSS" />
       <area shape="poly" coords="130,147,200,107,130,4,59,107"
             href="https://developer.mozilla.org/docs/Web/JavaScript"
             target="_blank" alt="JavaScript" />
   </map>
   <img usemap="#infographic" src="/media/examples/mdn-info2.png" alt="MDN infographic" />
   ```
   - `<area>`
     - `alt=`
     - attributes of `<a>`
     - `shape=` -- shape of the associated hot spot
       - `rect`
       - `circle`
       - `poly` -- polygon
       - `default` -- the entire region beyond any defined shapes
     - `coords=` -- coordinates of the hot-spot region
       - for `shape="rect"`, left, top, right, bottom
       - for `shape="circle"`, `x,y,r`
       - for `shape="poly"`, the value is a set of x,y pairs for each point in the polygon: `x1,y1,x2,y2,x3,y3`, and so on
   - `usemap=#` of `<img>` -- associate image with map with `name`
     - cannot use this attribute if the `<img>` element is a descendant of an `<a>` or `<button>` element

## Audio and Video

1. `<video></video>` and `<audio></audio>`
   ```html
   <video controls>
     <source src="myVideo.mp4" type="video/mp4">
     <source src="myVideo.webm" type="video/webm">
     <p>Your browser doesn't support HTML5 video. Here is
        a <a href="myVideo.mp4">link to the video</a> instead.</p>
   </video>
   ```
   - fallback content: The content inside the opening and closing tags
   - source
     - `src` attribute
     - multiple `<source>` elements -- the browser will then use the first one it supports
   - `controls`
     - the browser's default controls
     - omit to use custom controls using JavaScript
   - `autoplay`
   - `crossorigin=`
   - `loop`
   - `muted`
   - `preload=` -- `metadata` recommended
     - `none`: Indicates that the video should not be preloaded.
     - `metadata`: Indicates that only video metadata (e.g. length) is fetched.
     - `auto`: Indicates that the whole video file can be downloaded, even if the user is not expected to use it.
     - `empty string`: Synonym of the `auto` value.

1. `<video></video>`
   - `poster=` -- A URL for an image to be shown while the video is downloading
   - tbd

1. `<source></source>` -- serve the same media content in multiple formats supported by different browsers
   - also for `<picture>`
   - `src=`
   - more

1. `<track></track>` -- a child of the media elements `<audio>` and `<video>`. It lets you specify timed text tracks (or time-based data), for example to automatically handle subtitles
   - `.vtt` format
   - `kind=` -- How the text track is meant to be used. If omitted the default kind is `subtitles`
      - `subtitles`
      - `captions`
   - `src=`
   - `srclang=`
   - more

## External Application

1. `<embed>` -- external content that is provided by an external application or other source of interactive content such as a browser plug-in
   ```html
   <embed type="video/webm"
    src="/media/examples/stream_of_water_audioless.webm"
    width="300"
    height="200">
   ```
   - most modern browsers have deprecated and removed support for browser plug-ins, so relying upon `<embed>` is generally not wise
     - good for pdf ???
   - `type=` -- MIME type
   - `scr=`
   - `height=` -- absolute
   - `width=` -- absolute

1. `<object></object>` -- an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin
   ```html
   <object type="application/pdf"
       data="/media/examples/pdf_open_parameters.pdf"
       width="300"
       height="200">
   </object>
   ```
   - `data=` -- The address of the resource as a valid URL
   - `type` -- MIME type
   - `typemustmatch` -- the type attribute and the actual content type of the resource must match to be used
   - `form=`
   - `height=`, `width=` -- absolute
   - `usemap=#` -- as `<img>`
   - `<param>` -- parameters for `<object>`
     - `name=`
     - `value=`

1. `<iframe></iframe>` -- a nested browsing context
   - `src=`
   - `srcdoc=` -- specify the exact contents of the iframe as a whole HTML document, will override `src`
   - `width=`, `height=`
   - `name=` -- `target` of `<a>`, `<form>`, `<base>`, `formtarget` of `<input>`, `<button>`
   - sandboxing
     - `sandbox=` -- extra restrictions on the content that can appear in the inline frame
       - an empty string (all the restrictions are applied)
       - `allow-scripts`
       - `allow-forms`
       - `allow-*`, tbd
     - `allow=` -- feature policy for the iframe
       - [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy)
     - `allowfullscreen` -- `Element.requestFullscreen()` allowed
       - redefined as `allow="fullscreen"`
     - `allowpaymentrequest` -- Payment Request API allowed
       - redefined as `allow="payment"`

# User Input

1. `<input>` -- used within a `<form>` element to declare input controls that allow users to input data
   - Attributes common to all input types
     - `autocomplete=` -- A string indicating the type of autocomplete functionality, if any, to allow on the input
       - `on`, `off`
       - `email`, `new-password`, `current-password`
       - more
     - `autofocus` -- A Boolean which, if present, makes the input take focus when the form is presented
     - `disabled` -- A Boolean attribute which is present if the input should be disabled
     - `form=` -- The `id` of the `<form>` of which the input is a member; if absent, the input is a member of the nearest containing form, or is not a member of a form at all
     - `list=` -- The `id` of a `<datalist>` element that provides a list of suggested values for the input
     - `name=` -- The input's name, to identify the input in the data submitted with the form's data
     - `required` -- A Boolean which, if true, indicates that the input must have a value before the form can be submitted
       - no effect for `readonly`
     - `type=` -- A string indicating which input type the `<input>` element represents
     - `value=` -- The input's current value
   - `type="text"`, default -- single-line text field with line-breaks automatically removed
     - `maxlength=` -- The maximum number of characters the input should accept
     - `minlength=` -- The minimum number of characters long the input can be and still be considered valid
     - `pattern=` -- A regular expression the input's contents must match in order to be valid
     - `placeholder=` -- An exemplar value to display in the input field whenever it is empty
     - `readonly` -- A Boolean attribute indicating whether or not the contents of the input should be read-only
     - `size=` -- A number indicating how many characters wide the input field should be
     - `spellcheck=` -- global attribute
     - `HTMLInputElement`
       - `value`, `list`, `selectionStart`, `selectionEnd`, `selectionDirection`
       - `select()`, `setRangeText()`, and `setSelectionRange()`
   - `type="password"`, `type="tel"` -- special `type="text"`
   - `type="search"` -- functionally identical to text inputs, but may be styled differently
   - `type="url"` -- special `type="text"` automatically validated
   - `type="email"` -- special `type="text"` automatically validated
     - `multiple` -- Whether or not to allow multiple, comma-separated, email addresses to be entered
   - `type="number"`
     - `max=` -- The maximum value to accept
     - `min=` -- The minimum value to accept for this input
     - `placeholder=` -- An example value to display inside the field when it's empty
     - `readonly` -- A Boolean attribute controlling whether or not the value is read-only
     - `step=` -- A stepping interval to use when using up and down arrows to adjust the value, as well as for validation
     - `HTMLInputElement`
       - `list`, `value`, `valueAsNumber`
       - `select()`, `stepUp()`, `stepDown()`
   - `type="range"` -- similar to `type="number"`, but typically a slider or dial control
     - no `placeholder`, `readonly`
   - date type -- similar to `type="number"`
     - `week`, `month`, `date`, `time`, `datetime-local`
     - no `placeholder`
     - `HTMLInputElement.valueAsDate`, `HTMLInputElement.valueAsNumber`
   - `type="checkbox"`, `type="radio"`
     - `checked`
     - `value=` -- common attribute, defaults to `on`
     - multiple checkbox -- use `name` with `[]` suffix
     - radio group -- with same `name`
       - use `<fieldset>` -- Since each radio button affects the others in the group, it is common to provide a label or context for the entire group of radio buttons
     - `HTMLInputElement`
       - `checked`, `value`
       - `select()`
   - `type="file"`
     - `accept=` -- One or more unique type specifiers describing file types to allow
       ```html
       <input type="file" id="docpicker" accept=".doc,.docx,application/msword">
       <input type="file" name="fileSubmission" accept="image/*">
       ```
     - `capture=` -- What source to use for capturing image or video data, `user`, `environment`
     - `files=` -- A `FileList` listing the chosen files
     - `multiple` -- A Boolean which, if present, indicates that the user may choose more than one file
     - `HTMLInputElement`
       - `files`, `value` (first file)
       - `select()`
   - `type="color"`
   - `type="hidden"` -- include data that cannot be seen or modified by users when a form is submitted
   - `type="button"` -- `type="submit"` without functionalities, for `onclick`, `<button>` is favored
   - `type="submit"` -- rendered as button
     - `value` is the label, or the default of the user agent
     - `formaction=` -- The URL to which to submit the form's data; overrides the form's action attribute, if any
     - `formenctype=` -- A string specifying the encoding type to use for the form data
     - `formmethod=` -- The HTTP method ((get or post) to use when submitting the form.
     - `formnovalidate=` -- A Boolean which, if present, means the form's fields will not be subjected to constraint validation before submitting the data to the server
     - `formtarget=` -- The browsing context into which to load the response returned by the server after submitting the form
   - `type="image"` -- graphical submit buttons
     - attributes of `<img>` -- `alt=`, `width=`, `height=`, `src=`
     - attributes of `type="submit"`
   - `type="reset"` -- reset button

1. `<textarea></textarea>` -- similar to text input, block version
   - common input attributes
   - `cols=`, `rows=`
   - `maxlength=`, `minlength=`
   - `readonly`
   - `placeholder=`
   - `warp=`

1. `<label></label>` -- a caption for an item in a user interface
   - labelable -- `<button>`, `<input>`, `<meter>`, `<output>`, `<progress>`, `<select>`, and `<textarea>`
   - `for=` -- The `id` of a labelable form-related element in the same document
   - relate without `for=` -- nest
     ```html
     <label>Do you like peas?
       <input type="checkbox" name="peas">
     </label>
     ```
   - `form=` -- The `<form>` element with which the label is associated

1. `<fieldset></fieldset>` -- group several controls as well as labels within a form
   ```html
   <form>
       <fieldset>
           <legend>Select a maintenance drone</legend>
           <div>
               <input type="radio" id="huey"
                      name="drone" value="huey" checked />
               <label for="huey">Huey</label>
           </div>
           <div>
               <input type="radio" id="dewey"
                      name="drone" value="dewey" />
               <label for="dewey">Dewey</label>
           </div>
           <div>
               <input type="radio" id="louie"
                      name="drone" value="louie" />
               <label for="louie">Louie</label>
           </div>
       </fieldset>
   </form>
   ```
   - `disabled`
     - Note that form elements inside the `<legend>` element won't be disabled
   - `form=` -- the `id` attribute of a `<form>` element you want the `<fieldset>` to be part of, even if it is not inside the form
   - `name=`
   - `<legend></legend>` -- a caption for the content of its parent `<fieldset>`

1. `<button></button>`
   - `<form>` related attributes
   - `type=` -- `<form>` related

1. `<form></form>`
   - `action=` -- The URI of a program that processes the form information
   - `autocomplete=` -- `on`, `off`
   - `method=` -- The HTTP method that the browser uses to submit the form
     - `get` -- append the form data to the URL specified in the action attribute
     - `post` -- does not append the form data to the action URL but sends using the request body
     - `enctype=` -- When the value of the `method` attribute is `post`, enctype is the MIME type of content that is used to submit the form to the server
   - `name=`
   - `novalidate` -- the form is not to be validated when submitted
   - `target=` -- A name or keyword for a browsing context (e.g. tab, window, or inline frame) indicating where to display the response that is received after submitting the form

1. `<output></output>` -- a container element into which a site or app can inject the results
   - `for=` -- A space-separated list of other elements’ `id`s, indicating that those elements contributed input values to (or otherwise affected) the calculation
   - `form=` -- the `id` attribute of a `<form>` element to be part of, even if it is not inside the form
   - `name=` -- The name of the element, exposed in the HTMLFormElement API

1. `<select></select>` -- a control that provides a menu of options
   - common input attributes
   - `multiple`
   - `size=` -- number of rows
   - `value` defaults to text inside

1. `<option></option>` -- menu items in popups
   - contained in a `<select>`, an `<optgroup>`, or a `<datalist>`
   - `disabled`
   - `label=` -- defaults to text inside
     - the `<option>` tag can be unclosed
   - `selected` -- initially selected
   - `value=` -- defaults to text inside

1. `<optgroup></optgroup>` -- a grouping of options within a `<select>` element
   - `disabled`
   - `label=` -- mandatory. The name of the group of options, which the browser can use when labeling the options in the user interface

1. `<datalist></datalist>` -- contains a set of `<option>` elements that represent the values available for other controls
   - like autocomplete in editors

# Sectioning Elements

1. headings -- `<h1>` to `<h6>`

1. `<hgroup></hgroup>` -- a multi-level heading for a section of a document. It groups a set of `<h1>–<h6>` elements
   ```html
   <hgroup>
       <h1>Calculus I</h1>
       <h2>Fundamentals</h2>
   </hgroup>
   <p>This course will...</p>
   ```

1. `<section></section>` -- a standalone section, Typically, but not always, sections have a heading
   - You can use the `<section>` element within an `<article>` and vice-versa.
   - Every section should have a theme (a heading element identifying this region)
   - Don't use the `<section>` element as a general styling 'container'. If you need a container to apply styling, use a `<div>` instead.

1. `<article></article>` -- a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable
   - should use the `article` element when it makes sense to syndicate the contents of the element

1. `<main></main>` -- the dominant content of the `<body>` of a document, portion of a document or application
   - should only ever be used at most once on a single page
   - must not be included as a descendant of an `article`, `aside`, `footer`, `header` or `nav` element

1. `<nav></nav>` -- The Navigation Section element
   - breadcrumb

1. `<header></header>` -- introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also other elements like a logo, a search form, an author name, and so on

1. `<footer></footer>` -- typically contains information about the author of the section, copyright data or links to related documents

1. `<address></address>` -- contact information for a person or people, or for an organization

1. `<aside></aside>` -- a portion of a document whose content is only indirectly related to the document's main content. Asides are frequently presented as sidebars or call-out boxes

# Progress and Meter

1. `<progress></progress>` -- displays an indicator showing the completion progress of a task, typically displayed as a progress bar
   - `max=` -- defaults to 1
   - `value=` -- how much of the task that has been completed, 0 to `max`
     - when absent, the progress bar is indeterminate
   - text inside is fallback
   - styling -- `processes[value]`
     - tbd

1. `<meter></meter>` -- a scalar value within a known range or a fractional value
   - `min=` -- defaults to 0
   - `max=` -- defaults to 1
   - `value=` -- The current numeric value, `min` to `max`
   - `low=`, `high=` -- range point for styling, `low` to `high` typically rendered as yellow
   - `optimum` -- indicates the optimal numeric value
     - range -- `[min, low, high, max]`
     - green if `value` is in the same range of `optimum`
       - always green if `low` and `high` not specified
     - yellow if one range away
     - red if two range away

# Interactive elements

1. `<menu></menu>` experimental -- a group of commands that a user can perform or activate

1. `<dialog></dialog>` -- a dialog box, can be shown by `HTMLDialogElement.showModal()`, can be closed by `HTMLDialogElement.close()`
   - not supported by Edge

1. `<details></details>` -- a disclosure widget in which information is visible only when the widget is toggled into an "open" state
   - `open`
   - `ontoggle`
   - `<summary></summary>` -- a summary, caption, or legend for a `<details>` element's disclosure box
     - may only be used as the first child of a `<details>` element
     - if absent, the user agent will use a default string (typically "Details")
     - includes `display: list-item` style

# SVG and Canvas

1. `<svg></svg>` -- Scalable Vector Graphics
   ```html
   <svg class="attention" xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 1000" >
   <path id="attention"
   d="m571,767l0,-106q0,-8,-5,-13t-12,-5l-108,0q-7,0,-12,5t-5,13l0,106q0,8,5,13t12,6l108,0q7,0,12,-6t5
   ,-13Zm-1,-208l10,-257q0,-6,-5,-10q-7,-6,-14,-6l-122,0q-7,0,-14,6q-5,4,-5,12l9,255q0,5,6,9t13,3l103,
   0q8,0,13,-3t6,-9Zm-7,-522l428,786q20,35,-1,70q-10,17,-26,26t-35,10l-858,0q-18,0,-35,-10t-26,-26q-21
   ,-35,-1,-70l429,-786q9,-17,26,-27t36,-10t36,10t27,27Z" />
   </svg>
   ```
   - standalone XML document
   - can be styled by CSS and JavaScript
   - external svg -- `<img>` or `<object>`
     ```html
     <object type="image/svg+xml" data="attention.svg" width="50" height="50">
     ```
     - Using `<img>` does not allow you to style the SVG using CSS or manipulate it using JavaScript
   - tbd

1. `<canvas></canvas>`
   - `width=`, `height=`
   - see JavaScript notes

# Web Components, Custom Elements

1. `<slot></slot>` -- a placeholder inside a web component that you can fill with your own markup, which lets you create separate DOM trees and present them together
   - `name=`

1. `<template></template>` -- a mechanism for holding client-side content that is not to be rendered when a page is loaded but may subsequently be instantiated during runtime using JavaScript
   ```html
   <template id="element-details-template">
     <style>
       details {font-family: "Open Sans Light", Helvetica, Arial, sans-serif }
       .name {font-weight: bold; color: #217ac0; font-size: 120% }
       h4 {
         margin: 10px 0 -8px 0;
         background: #217ac0;
         color: white;
         padding: 2px 6px;
         border: 1px solid #cee9f9;
         border-radius: 4px;
       }
       .attributes { margin-left: 22px; font-size: 90% }
       .attributes p { margin-left: 16px; font-style: italic }
     </style>
     <details>
       <summary>
         <code class="name">&lt;<slot name="element-name">NEED NAME</slot>&gt;</code>
         <i class="desc"><slot name="description">NEED DESCRIPTION</slot></i>
       </summary>
       <div class="attributes">
         <h4>Attributes</h4>
         <slot name="attributes"><p>None</p></slot>
       </div>
     </details>
     <hr>
   </template>
   ```
   - Think of a template as a content fragment that is being stored for subsequent use in the document
