# HTTP

```
PUT /new.html HTTP/1.1
Host: example.com
Content-type: text/html
Content-length: 16

<p>New File</p>
```

```
HTTP/1.1 201 Created
Content-Location: /new.html
```

## Introduction

1. 输入URL按下回车后
   - [blog](http://blog.jobbole.com/84870/)
   - [en version](https://github.com/alex/what-happens-when)

1. version history — for detail see [Evolution of HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
   - HTTP/0.9时代：短连接
     - 每个HTTP请求都要经历一次DNS解析、三次握手、传输和四次挥手。反复创建和断开TCP连接的开销巨大，在现在看来，这种传输方式简直是糟糕透顶。
   - HTTP/1.0时代：持久连接概念提出
     - 人们认识到短连接的弊端，提出了持久连接的概念，在HTTP/1.0中得到了初步的支持。持久连接，即一个TCP连接服务多次请求：客户端在请求header中携带Connection: Keep-Alive，即是在向服务端请求持久连接。如果服务端接受持久连接，则会在响应header中同样携带Connection: Keep-Alive，这样客户端便会继续使用同一个TCP连接发送接下来的若干请求。（Keep-Alive的默认参数是[timout=5, max=100]，即一个TCP连接可以服务至多5秒内的100次请求）
     - 当服务端主动切断一个持久连接时（或服务端不支持持久连接），则会在header中携带Connection: Close，要求客户端停止使用这一连接。
   - HTTP/1.1时代：持久连接成为默认的连接方式；提出pipelining概念
     - HTTP/1.1开始，即使请求header中没有携带Connection: Keep-Alive，传输也会默认以持久连接的方式进行。
     - 持久连接的弊端被提出 —— HOLB（Head of Line Blocking）: 即持久连接下一个连接中的请求仍然是串行的，如果某个请求出现网络阻塞等问题，会导致同一条连接上的后续请求被阻塞。
     - 提出了pipelining概念，即客户端可以在一个请求发送完成后不等待响应便直接发起第二个请求，服务端在返回响应时会按请求到达的顺序依次返回。响应仍然是按请求的顺序串行返回的。所以pipelining并没有被广泛接受，几乎所有代理服务都不支持pipelining，部分浏览器不支持pipelining，支持的大部分也会将其默认关闭
   - SPDY和HTTP/2：multiplexing — multiplexing即多路复用，在SPDY中提出，同时也在HTTP/2中实现。multiplexing技术能够让多个请求和响应的传输完全混杂在一起进行，通过streamId来互相区别。这彻底解决了holb问题，同时还允许给每个请求设置优先级，服务端会先响应优先级高的请求。
     - [multiplexing](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/14), binary, stream, message, frame
     - server push — populate data in a client cache, in advance of it being required. 例如客户端请求 page.html 页面，服务端就把 script.js 和 style.css 等与之相关的资源一起发给客户端
     - header compression and delta update — 客户端和服务器同时维护和更新一个包含之前见过的首部字段表以避免重复传输

## Methods

1. request methods
   - has body or not
   - safe — does not alter the state of server, implies idempotent; `GET`, `HEAD`, or `OPTIONS`
   - idempotent — an identical request can be made once or several times in a row with the same effect while leaving the server in the same state; safe methods and `PUT`, `DELETE`
   - cacheable — a cacheable response is an HTTP response that can be cached; `GET`, `HEAD`, more in rare cases
     - controlled by response header `Cache-Control`
     - cacheable status code — 200, 203, 204, 206, 300, 301, 404, 405, 410, 414, and 501

1. `GET` — requests a representation of the specified resource
   - traits — request hash no body, response has body, safe, idempotent, cacheable, allowed in forms

1. `HEAD` — requests the headers that would be returned if `GET`
   - traits — no body, no body, safe, idempotent, cacheable, not in forms

1. `POST` — sends data to the server but not idempotent
   - traits — has body, has body, not safe, not idempotent, typically not cacheable, allowed in forms
   - related responses
     - `201 Created`

1. `PUT` — replaces all current representations of the target resource with the request payload or create new ones, idempotent
   - traits — has body, no body, not safe, idempotent, not cacheable, not in forms
   - related responses
     - `201 Created`
     - `200 OK` or `204 No Content`

1. `DELETE`
   - traits — may has body, may has body, not safe, idempotent, not cacheable, not in forms
   - related responses
     - `200 Accepted` — the action will likely succeed but has not yet been enacted
     - `204 No Content` — the action has been enacted and no further information is to be supplied
     - `200 OK` — the action has been enacted and the response body includes a representation describing the status

1. `PATCH` — apply partial modifications
   - traits — has body, has body, not safe, not idempotent, not cacheable, not in forms
     - idempotent — can be idempotent if no something like an auto-incrementing counter field and no side-effects on other resources
   - related headers and response
     - `Accept-Patch` response header — advertises which media-type the server is able to understand, and means that `PATCH` is allowed on the resource identified by the Request-URI, can be together with `415`
     - `415 Unsupported Media Type` — response to a `PATCH` request with an unsupported media type

1. `OPTIONS` — describe the communication options for the target resource, request URL can be `*` to refer to the entire server
   - traits — no body, has body, safe, idempotent, not cacheable, not in forms
   - related
     - `Allow` response header
     - CORS preflight request method, and request headers `Access-Control-Request-Method` and `Access-Control-Request-Headers`
     - CORS preflight response headers — `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Max-Age`
   - example
     ```shell
     curl -X OPTIONS https://example.org -i
     ```
     ```
     HTTP/1.1 204 No Content
     Allow: OPTIONS, GET, HEAD, POST
     Cache-Control: max-age=604800
     Date: Thu, 13 Oct 2016 11:45:00 GMT
     Server: EOS (lax004/2813)
     ```

1. `TRACE` — message loop-back test along the path to the target resource
   - traits — no body, no body, safe, idempotent, not cacheable, not in forms
   - response — `200 OK` with `Content-Type: message/http` with message of path along with way
     - `Max-Forwards` request header — minus one before forwarding, stop forwarding if zero

1. `CONNECT` — hop-by-hop method in contrast to end-to-end method, establishes a tunnel to the server identified by the target resource, like SSL through a proxy
   - traits — no body, has body, not safe, not idempotent, not cacheable, not in forms
   - related headers and responses
     - `Proxy-Authorization` request header — credentials to authenticate a user agent to a proxy server, usually after a `407` response
     - `407 Proxy Authentication Required`

## Headers

1. headers
   - proprietary headers — historically `X-` prefixed, but this convention was deprecated in June 2012
   - header contexts
     - general headers — apply to both requests and responses, but with no relation to the data transmitted in the body
     - request headers
     - response headers
     - entity headers — contain information about the body of the resource, like `Content-Length`, `Content-Type`, `Content-Encoding`, `Content-Language`, `Content-Location`, `Allow`, `Expires` and more
   - proxy handling
     - end-to-end headers — these headers must be transmitted to the final recipient of the message
     - hop-by-hop headers — these headers are meaningful only for a single transport-level connection, and must not be retransmitted by proxies or cached

1. authentication
   - `WWW-Authenticate`
   - `Authorization`
   - more

1. cache
   - [blog](https://www.jianshu.com/p/54cc04190252)
   - HTTP header  
     ![][p1]

     [p1]: ./images/http-1.png
     - 强缓存 — 可以理解为无须验证的缓存策略。对强缓存来说，响应头中有两个字段 `Expires`/`Cache-Control` 来表明规则。
       - `Expires` — 指缓存过期的时间，超过了这个时间点就代表资源过期。有一个问题是由于使用具体时间，如果时间表示出错或者没有转换到正确的时区都可能造成缓存生命周期出错。并且 `Expires` 是 HTTP/1.0 的标准，现在更倾向于用 HTTP/1.1 中定义的 `Cache-Control`。两个同时存在时也是 `Cache-Control` 的优先级更高。
       - `Cache-Control` — `Cache-Control` 可以由多个字段组合而成
         1. `max-age` 指定一个时间长度，在这个时间段内缓存是有效的，单位是s。例如设置 `Cache-Control:max-age=31536000`
         2. `s-maxage` 同 `max-age`，覆盖 `max-age`、`Expires`，但仅适用于共享缓存，在私有缓存中被忽略。
         3. `public` 表明响应可以被任何对象（发送请求的客户端、代理服务器等等）缓存。
         4. `private` 表明响应只能被单个用户（可能是操作系统用户、浏览器用户）缓存，是非共享的，不能被代理服务器缓存。
         5. `no-cache` 强制所有缓存了该响应的用户，在使用已缓存的数据前，发送带验证器的请求到服务器。不是字面意思上的不缓存。
         6. `no-store` 禁止缓存，每次请求都要向服务器重新获取数据。
       - other headers — `Pragma`, `Warning` and more
     - 协商缓存 — 客户端和服务器端通过某种验证机制验证当前请求资源是否可以使用缓存
       - `Last-modified` / `If-Modified-Since`
         - `Last-modified` — 服务器端资源的最后修改时间，响应头部会带上这个标识。第一次请求之后，浏览器记录这个时间
         - 再次请求时，请求头部带上 `If-Modified-Since` 即为之前记录下的时间。服务器端收到带 `If-Modified-Since` 的请求后会去和资源的最后修改时间对比。若修改过就返回最新资源，状态码 `200`，若没有修改过则返回 `304 Not Modified`。
       - `Etag`/`If-None-Match` — 由服务器端上生成的一段 hash 字符串，第一次请求时响应头带上 `ETag: abcd`，之后的请求中带上 `If-None-Match: abcd`，服务器检查 `ETag`，返回 `304` 或 `200`。
       - 区别
         - 某些服务器不能精确得到资源的最后修改时间，这样就无法通过最后修改时间判断资源是否更新。
         - `Last-modified` 只能精确到秒。
         - 一些资源的最后修改时间改变了，但是内容没改变，使用 `Last-modified` 看不出内容没有改变。
         - `Etag` 的精度比 `Last-modified` 高，属于强验证，要求资源字节级别的一致，优先级高。如果服务器端有提供 ETag 的话，必须先对 `ETag` 进行 Conditional Request。
         - 实际使用 `ETag`/`Last-modified` 要注意保持一致性，做负载均衡和反向代理的话可能会出现不一致的情况。计算 `ETag` 也是需要占用资源的，如果修改不是过于频繁，看自己的需求用 `Cache-Control` 是否可以满足。
       - other headers — `If-Unmodified-Since`, `Vary`
   - 其他 — 打包出来文件带hash后缀或版本号，文件内容改变后相当于请求一个新文件

1. client hints — new standard, experimental, tbd

1. connection
   - `Connection`
   - `Keep-Alive`

1. content negotiation
   - `Accept`
   - `Accept-Charset`
   - `Accept-Encoding`
   - `Accept-Language`

1. request and response context
   - requester
     - `From`
     - `Host`
     - `Referer`
     - `Referrer-Policy`
     - `User-Agent`
   - responder
     - `Allow`
     - `Server`

1. range request — respond part of the document
   - `Accept-Ranges` — indicates if the server supports range requests, and if so in which unit the range can be expressed
   - `Range` — indicates the part of a document that the server should return
   - `If-Range` — creates a conditional range request that is only fulfilled if the given etag or date matches the remote resource. Used to prevent downloading two ranges from incompatible version of the resource
   - `Content-Range` — indicates where in a full body message a partial message belongs
   - response — `206 Partial Content`

1. frontend
   - cookies — `Cookie`, `Set-Cookie`
   - CORS — `Allow-Control-` prefixed headers, `Origin`, `Timing-Allow-Origin`

1. security
   - CORS policies
   - CSP, content security policies
   - more

1. other headers
   - controls — `Expect`, `Max-Forwards`
   - track — `DNT`, `TK`
   - redirection — `Location`
   - more

## Status Codes

1. response status codes
   - 1xx — informational
   - 2xx — successful
   - 3xx — redirection
   - 4xx — client error
   - 5xx — server error

1. 1xx informational
   - `100 Continue` — everything so far is OK and that the client should continue the request
   - `101 Switching Protocol` — in response to `Upgrade` header in WebSockets
   - more

1. 2xx successful
   - `200 OK`
   - `201 Created` — typically for `POST`, `PUT`
   - `202 Accepted` — the request has been received but not yet acted upon
   - `204 No Content`
   - more

1. 3xx redirection
   - `300 Multiple Choice` — the request has more than one possible response. The user-agent or user should choose one of them
   - `301 Moved Permanently` — the resource requested has been definitively moved to the URL given by the `Location` header
   - `302 Found` — requested resource has been changed temporarily, given by the `Location` header. A browser redirects to this page but search engines don't update their links to the resource
   - `303 See Other` — `302` but make the client use `GET` follow the redirection
   - `304 Not Modified` — response to cache control, like `If-None-Match` or `If-Modified-Since`
   - `307 Temporary Redirect` — `302` but the user agent must not change the HTTP method and body

1. 4xx client error
   - `400 Bad Request` — the server could not understand the request due to invalid syntax
   - `401 Unauthorized` — unauthenticated, sent with a `WWW-Authenticate` header that contains information on how to authorize correctly
   - `403 Forbidden` — authenticated but unauthorized
   - `404 Not Found`
   - `405 Method Not Allowed`
   - `406 Not Acceptable` — used in content negotiation
   - `418 I'm a teapot` — April Fool ester egg

1. 5xx server error
   - `500 Internal Server Error`
   - `501 Not Implemented`
   - `502 Bad Gateway` — the server, while acting as a gateway or proxy, received an invalid response from the upstream server
   - `503 Service Unavailable` — server is not ready to handle the request, could be due to maintenance or being overloaded, use with `Retry-After` if possible

## Frontend Related

1. [Ajax](./BOM_DOM_notes.md#Ajax)

1. [server push](./BOM_DOM_notes.md#Server-Push)

1. [CORS](./BOM_DOM_notes.md#CORS)
   - [bypass CORS](./BOM_DOM_notes.md#Bypass-CORS)

1. [cookies](./BOM_DOM_notes.md#Cookies)

1. 为什么通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片 — [github](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/87)
   - `Navigator.sendBeacon()`
   <!-- TODO: transfer to BOM_DOM_notes -->

## HTTPS

1. encryption
   1. client requests HTTPS connection
   1. server sends its public key, authentication see below
   1. client generate a session key and encrypt it with received public key
   1. client sends the encrypted session key which is decrypted by the server with its private key
   1. communication symmetric encrypted with the session key starts

1. authenticate
   - CA, Certificate Authority — third parties trusted by both the client and the server, who sign certificates
   - signing — CA sign public keys of servers to generate certificates, which contains the data and the signature
     - signature — hash of the data encrypted by the private key of the signer
   - authentication in HTTPS — the server sends the certificate, the client verify the certificate
     - verification — compare the hash of the data and the hash decrypted from the signature using signer's public key

1. integrity — `Digest` header: in HTTP, integrity breached if altering the message and the digest at the same time; however, in HTTPS, cannot compute digest from encrypted message
