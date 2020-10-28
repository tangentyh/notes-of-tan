# Introduction

1. docs
   - Spring Framework
     - [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/index.html)
     - [Overview (Spring Framework current API)](https://docs.spring.io/spring/docs/current/javadoc-api/)
     - [Appendix A. Common application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html)
   - AOP
     - [Overview (AspectJ(tm) aspectj5rt API)](https://www.eclipse.org/aspectj/doc/released/aspectj5rt-api/overview-summary.html)
     - [org.aspectj:aspectjweaver:1.9.4 API Doc :: Javadoc.IO](https://javadoc.io/doc/org.aspectj/aspectjweaver/1.9.4)
   - Spring Boot
     - [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/)
     - [Spring Boot Reference Guide single page](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
     - [Overview (Spring Boot 2.3.1.RELEASE API)](https://docs.spring.io/spring-boot/docs/current/api/)

1. philosophy
   - beans -- Java objects that perform business logic, execute tasks, persist and retrieve persisted data, respond to HTTP requests, and more
   - config -- XML-based, Annotations, and JavaConfig-based approaches for configuring beans
     - decorator when used as meta annotation -- for example any annotation that is annotated with `@Component` becomes a component annotation, and so forth
   - `-Aware` -- `set-` methods for callback
   - `-Capable`, `-edBean` -- `get-` methods
     - `org.springframework.core.env.EnvironmentCapable` -- `Environment getEnvironment()`
   - `Configurable-`: `ConfigurableApplicationContext`, `ConfigurableBeanFactory` -- typically implement to configure
   - `Listable-`: `ListableBeanFactory` -- can enumerate, rather than attempting bean lookup by name one by one
   - `required` -- `Exception` or `null`
     - `Optional` -- equivalent to `required` set `false`
   - AOP -- JDK proxy or CGLIB subclassing; CGLIB proxy instance is created through Objenesis, so constructor is not called twice

## Miscellaneous

1. `org.springframework.beans.BeanUtils`
   - `static void copyProperties(Object source, Object target)`

1. `org.springframework.web.servlet.support.RequestContextUtils`

1. create a new Spring project
   - [official docs: Getting Started · Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
   - [Spring Initializr](https://start.spring.io/)
   - metadata
     - `groupId` -- Java package like
     - `artifactId` -- use hyphen as delimiters
   - create a project using maven
     ```shell
     mvn archetype:generate -DgroupId=com.apress.todo -DartifactId=todo -Dversion=0.0.1-SNAPSHOT -DinteractiveMode=false -DarchetypeArtifactId=maven-archetype-webapp
     ```
   - maven configuration
     - [properties for override individual dependencies](https://github.com/spring-projects/spring-boot/blob/v2.2.8.RELEASE/spring-boot-project/spring-boot-dependencies/pom.xml)
     - [starters](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-build-systems.html#using-boot-starter)

1. [lombok](https://projectlombok.org/features/all)

# Servlet

1. Maven artifact
   ```xml
   <dependency>
       <groupId>javax.servlet</groupId>
       <artifactId>javax.servlet-api</artifactId>
   </dependency>
   ```
   - docs
     - [javax.servlet.http (Java Servlet 4.0)](https://javadoc.io/static/javax.servlet/javax.servlet-api/4.0.1/javax/servlet/http/package-summary.html)
     - [web.xml Reference Guide for Tomcat - Metawerx Java Wiki](http://wiki.metawerx.net/wiki/Web.xml)
     - [JSR-000369 Java Servlet 4.0 Specification Final Release](https://download.oracle.com/otndocs/jcp/servlet-4-final-spec/index.html)
     - [The Java Community Process(SM) Program - JSRs: Java Specification Requests - detail JSR# 369](https://jcp.org/en/jsr/detail?id=369)

1. `web.xml`
   ```xml
   <web-app>
       <display-name>Hello World Application</display-name>
       <welcome-file-list>
           <welcome-file>index.jsp</welcome-file>
           <welcome-file>index.html</welcome-file>
       </welcome-file-list>
       <error-page>
           <error-code>500</error-code>
           <location>/errors/servererror.jsp</location>
       </error-page>
   </web-app>
   ```

## Servlet Container Initializer

1. `interface javax.servlet.ServletContainerInitializer`
   - `void onStartup(Set<Class<?>> c, ServletContext ctx)` -- on the startup of the application
     - `c` -- classes in `@HandlesTypes::value`, `null` if the implementation does not annotated with `@HandlesTypes` or `value` is empty
     - `@javax.servlet.annotation.HandlesTypes`
       ```java
       @Target(value=TYPE) public @interface HandlesTypes
       ```
       - `Class<?>[] value`
   - SPI -- implementations as service provider in `META-INF/services` inside JAR files

## HTTP Servlet, ServletConfig and ServletContext

1. `javax.servlet.http.HttpServlet` -- an abstract class to be subclassed to create an HTTP servlet
   ```java
   public abstract class HttpServlet extends GenericServlet
   ```
   ```java
   public abstract class GenericServlet extends Object
   implements Servlet, ServletConfig, Serializable
   ```
   - dispatch
     - `void service(ServletRequest req, ServletResponse res)` -- dispatches client requests to the protected one
     - `protected void service(HttpServletRequest req, HttpServletResponse resp)` -- dispatches HTTP requests to the `doXXX` methods
   - HTTP methods, `throws ServletException, IOException`
     - `protected void doDelete(HttpServletRequest req, HttpServletResponse resp)`
     - `protected void doGet(HttpServletRequest req, HttpServletResponse resp)`
       - `protected long getLastModified(HttpServletRequest req)`
     - `doHead`, `doOptions`, `doPost`, `doPut`, `doTrace`
   - lifecycle, for override
     - `void init()` -- called when the first request arrives for this servlet if the order is not specified in `<load-on-startup>`; called in `void init(ServletConfig config)`, `ServletConfig` and `ServletContext` are already available
     - `void destroy()`
   - get config
     - `ServletConfig getServletConfig()`
     - `ServletContext getServletContext()`
     - `javax.servlet.ServletConfig` -- configures in `web.xml`
       - `String getInitParameter(String name)`
       - `Enumeration<String> getInitParameterNames()`
       - `ServletContext getServletContext()`
       - `String getServletName()`

1. config `HttpServlet`
   - in `web.xml` -- the same class can have multiple instances with different names
     ```xml
     <servlet>
         <servlet-name>comingsoon</servlet-name>
         <servlet-class>mysite.server.ComingSoonServlet</servlet-class>
         <!-- <load-on-startup>1</load-on-startup> -->
         <init-param>
             <param-name>teamColor</param-name>
             <param-value>red</param-value>
         </init-param>
         <init-param>
             <param-name>bgColor</param-name>
             <param-value>#CC0000</param-value>
         </init-param>
     </servlet>
     <servlet-mapping>
         <servlet-name>comingsoon</servlet-name>
         <url-pattern>/</url-pattern>
     </servlet-mapping>
     ```
     - `<url-pattern>/</url-pattern>` -- when mapping to the application root, use `/` instead of `/*`, avoiding sending even internal JSP requests to the Servlet
     - `<multipart-config>`, see after
     - static server -- use the `default` servlet, implementation is `org.apache.catalina.servlets.DefaultServlet` for Tomcat
       ```xml
       <servlet-mapping>
           <servlet-name>default</servlet-name>
           <url-pattern>/resources/*</url-pattern>
           <url-pattern>*.css</url-pattern>
           <url-pattern>*.js</url-pattern>
           <url-pattern>*.png</url-pattern>
           <url-pattern>*.gif</url-pattern>
           <url-pattern>*.jpg</url-pattern>
       </servlet-mapping>
       ```
   - `@javax.servlet.annotation.WebServlet`
     ```java
     @Target(value=TYPE)
     public @interface WebServlet
     ```
     - `boolean asyncSupported`, `String description`, `String displayName`, `WebInitParam[] initParams`, `String largeIcon`, `int loadOnStartup`, `String name`, `String smallIcon`, `String[] urlPatterns`, `String[] value`
   - `@MultipartConfig`, see after

1. `interface javax.servlet.ServletContext` -- a set of methods that a servlet uses to communicate with its servlet container, one context per "web application" per JVM
   - context parameter
     ```xml
     <context-param>
         <param-name>settingOne</param-name>
         <param-value>foo</param-value>
     </context-param>
     <context-param>
         <param-name>settingTwo</param-name>
         <param-value>bar</param-value>
     </context-param>
     ```
     - `String getInitParameter(String name)`, `Enumeration<String> getInitParameterNames()`
     - `boolean setInitParameter(String name, String value)`
   - registration
     - `addFilter`
     - `addListener`
     - `addServlet`

1. `interface javax.servlet.AsyncContext` -- initialized by `ServletRequest::startAsync`
   - `void start(Runnable run)`
   - `boolean hasOriginalRequestAndResponse()`

## HTTP Servlet Request and Response

1. `javax.servlet.http.HttpServletRequest`
   ```java
   public interface HttpServletRequest extends ServletRequest
   ```
   - get methods
     - `String getParameter(String name)` and more -- query string or posted form data; when latter, `getInputStream()` used internally, later call to `getInputStream()` or `getReader` will throw `IllegalStateException`
     - `BufferedReader getReader()`, `ServletInputStream getInputStream()`
       - `javax.servlet.ServletInputStream` -- `setReadListener` method
     - headers
     - URL and URL segments
     - sessions and cookies
   - file upload, or the `multipart/form-data` MIME type
     - `Part getPart(String name)`, `Collection<Part> getParts()`
     - `@javax.servlet.annotation.MultipartConfig` -- annotated instances of the `Servlet` expect requests that conform to the `multipart/form-data` MIME type
       ```java
       @Target(value=TYPE) public @interface MultipartConfig
       ```
       - `int fileSizeThreshold`
       - `String location` -- file store location, can leave to container to determine
       - `long maxFileSize`
       - `long maxRequestSize`
   - serve HTML files, JSP files -- include or forward to another resource (servlet, JSP file, or HTML file) from a request
     - `RequestDispatcher getRequestDispatcher(String path)`
     - `RequestDispatcher::forward`, `RequestDispatcher::include`
   - async
     - `startAsync`, can wrap original request and response
     - `isAsyncStarted`
     - `isAsyncSupported`
     - `getAsyncContext`
   - `javax.servlet.ServletRequestWrapper`  
     `javax.servlet.http.HttpServletRequestWrapper`  
     -- decorator pattern, a convenient implementation of the `ServletRequest` interface that can be subclassed

1. sessions
   - `interface javax.servlet.http.HttpSession` -- attribute getters, setters and more
   - session types
     - session in URL path, insecure and obsolete -- `HttpServletResponse::encodeURL`, `HttpServletResponse::encodeRedirectURL`
     - cookie session
     - SSL session ID as HTTP session ID, unreliable
   - `HttpServletRequest::getSession` -- get or create
   - in clustered environment -- use sticky sessions or session replication
   - session config in `web.xml`
     ```xml
     <session-config>
         <session-timeout>30</session-timeout>
         <cookie-config>
             <name>JSESSIONID</name>
             <domain>example.org</domain>
             <path>/shop</path>
             <comment><![CDATA[Keeps you logged in. See our privacy policy for
         more information.]]></comment>
             <http-only>true</http-only>
             <secure>false</secure>
             <max-age>1800</max-age>
         </cookie-config>
         <tracking-mode>COOKIE</tracking-mode>
         <tracking-mode>URL</tracking-mode>
         <tracking-mode>SSL</tracking-mode>
     </session-config>
     ```
     - `<distributable/>` -- enabling session replication

1. `javax.servlet.http.HttpServletResponse`
   ```java
   public interface HttpServletResponse extends ServletResponse
   ```
   - `boolean isCommitted()` -- a committed response has already had its status code and headers written
   - status code and redirect
     - `static int` fields
     - status code setter and getter
       - `sendError` -- can optionally specify an error message
     - `sendRedirect`
   - response body
     - `ServletOutputStream getOutputStream()`, `PrintWriter getWriter()`
     - buffer related methods
     - `javax.servlet.ServletOutputStream`
       - `abstract void setWriteListener(WriteListener writeListener)`
   - response headers
     - MIME type related methods
     - charset and locale getters and setters
     - `void addCookie(Cookie cookie)`
     - header setters, adders -- call before response body stream getter
       - `setContentLength`, `setContentLengthLong` -- should leave to container
   - `javax.servlet.ServletResponseWrapper`  
     `javax.servlet.http.HttpServletResponseWrapper`  
     -- decorator pattern, a convenient implementation of the `ServletResponse` interface that can be subclassed
     ```java
     public class ServletResponseWrapper extends Object
     implements ServletResponse
     ```

## Servlet Listeners

1. config listeners
   - in `web.xml` -- `<listener>`
   - `ServletContext::addListener` -- called within a registered `ServletContextListener::contextInitialized` or `ServletContainerInitializer::onStartup`
   - `@javax.servlet.annotation.WebListener` -- any annotated class must implement one or more of the `ServletContextListener`, `ServletContextAttributeListener`, `ServletRequestListener`, `ServletRequestAttributeListener`, `HttpSessionListener`, `HttpSessionAttributeListener`, or `HttpSessionIdListener`
     ```java
     @Target(value=TYPE) public @interface WebListener
     ```

1. listeners -- interfaces to be implemented, extending `java.util.EventListener`
   - `javax.servlet.ServletContextListener`
     - `default void contextDestroyed(ServletContextEvent sce)`
     - `default void contextInitialized(ServletContextEvent sce)`
   - `javax.servlet.http.HttpSessionAttributeListener`
   - `javax.servlet.http.HttpSessionBindingListener` -- no config required, event triggered when set or removed from a `HttpSession` or session expiring
   - more

## Servlet Filters

1. `javax.servlet.Filter` -- acts on a request like a servlet, but can allow the handling of the request to continue with other filters or servlets
   - use case -- Authentication Filters, Logging and Auditing Filters, Data compression Filters, Encryption Filters, Tokenizing Filters, Mime-type chain Filter, error handling filters
   - lifecycle
     - `default void init(FilterConfig filterConfig)` -- called on application startup, after initialization of `ServletContextListener`s
     - `default void destroy()`
   - filter chain
     - when request come in -- container -> filter 1 -> filter 2 -> ... -> filter n -> container -> servlet
     - when returning response -- container <- filter 1 <- filter 2 <- ... <- filter n <- container <- servlet
     - `void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)`
     - `FilterChain::doFilter` -- call next filter in the chain, otherwise the chain is interrupted
   - mapping
     - to URL -- ordered before servlet mapping
     - to servlets
   - specify request types
     - normal requests
     - `RequestDispatcher::forward`ed requests -- handled internally as a separate request
     - `RequestDispatcher::include`ed requests -- handled internally as a separate request
     - error requests
     - `AsyncContext` dispatched requests

1. filter config
   - `@javax.servlet.annotation.WebFilter` -- cannot determine order; alternatively use `ServletContext::addListener` in `ServletContextListener::contextInitialized` or `ServletContainerInitializer::onStartup` and the order depends on the call
     ```java
     @Target(value=TYPE) public @interface WebFilter
     ```
     - `description`, `displayName`, `filterName`, `smallIcon`, `largeIcon`
     - `String[] servletNames`
     - `String[] urlPatterns`
     - `DispatcherType[] dispatcherTypes` -- `ASYNC`, `ERROR`, `FORWARD`, `INCLUDE`, `REQUEST`
     - `WebInitParam[] initParams`
     - `boolean asyncSupported`
   - `interface javax.servlet.FilterConfig` -- `getFilterName`, `getServletContext`, `getInitParameter`, `getInitParameterNames`
   - in `web.xml`, in the order of presence
     ```xml
     <filter>
         <filter-name>logSpecial</filter-name>
         <filter-class>mysite.server.LogFilterImpl</filter-class>
         <init-param>
             <param-name>logType</param-name>
             <param-value>special</param-value>
         </init-param>
     </filter>
     <filter-mapping>
         <filter-name>logSpecial</filter-name>
         <url-pattern>*.special</url-pattern>
         <dispatcher>REQUEST</dispatcher>
         <dispatcher>ASYNC</dispatcher>
     </filter-mapping>
     <filter-mapping>
         <filter-name>logSpecial</filter-name>
         <servlet-name>comingsoon</servlet-name>
     </filter-mapping>
     ```

# Application Context

## Spring Container

1. spring container
   - `interface org.springframework.beans.factory.BeanFactory` - root interface for accessing a Spring bean container
     - `getBean` method -- get a bean with type, name and / or other args as parameter(s)
     - `getBeanProvider` method -- lazy load a bean, see `@Lazy`
   - `interface org.springframework.context.ApplicationContext` -- application context, manages a set of beans, which are eligible for dependency injection, message notification, scheduled method execution, bean validation, and other crucial Spring services
     ```java
     public interface ApplicationContext
     extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory, MessageSource, ApplicationEventPublisher, ResourcePatternResolver
     ```
     - `org.springframework.beans.factory.ListableBeanFactory` -- bean factory methods for accessing application components
     - `org.springframework.core.io.ResourceLoader` -- the ability to load file resources in a generic fashion
       - `org.springframework.core.io.support.ResourcePatternResolver`
     - `org.springframework.context.ApplicationEventPublisher` -- The ability to publish events to registered listeners
     - `org.springframework.context.MessageSource` -- the ability to resolve messages, supporting internationalization
     - `org.springframework.beans.factory.HierarchicalBeanFactory` -- inheritance from a parent context. Definitions in a descendant context will always take priority. This means, for example, that a single parent context can be used by an entire web application, while each servlet has its own child context that is independent of that of any other servlet.

1. application context traits
   - `org.springframework.context.ConfigurableApplicationContext` -- configurable, rather than not readonly, `ApplicationContext`
     ```java
     public interface ConfigurableApplicationContext
     extends ApplicationContext, Lifecycle, Closeable
     ```
     - `org.springframework.context.Lifecycle` -- with `start()`, `stop()`, `isRunning()`
     - `void setParent(ApplicationContext parent)`
     - `void registerShutdownHook()`
     - more
   - `org.springframework.web.context.WebApplicationContext` -- with `getServletContext()`
     - `org.springframework.web.context.ConfigurableWebApplicationContext`

1. application context implementations
   - `org.springframework.context.annotation.AnnotationConfigRegistry` -- annotation config application contexts
     - `org.springframework.context.annotation.AnnotationConfigApplicationContext`
     - `org.springframework.web.context.support.AnnotationConfigWebApplicationContext`
   - `org.springframework.context.support.AbstractRefreshableConfigApplicationContext` -- base class for XML-based application context implementations
     - `org.springframework.context.support.ClassPathXmlApplicationContext`
     - `org.springframework.context.support.FileSystemXmlApplicationContext`
     - `org.springframework.context.support.XmlWebApplicationContext`

## Configure Contexts

1. bootstrap application context
   ```java
   public static void main(final String[] args) throws Exception {
       ApplicationContext ctx = new ClassPathXmlApplicationContext("scripting/beans.xml");
       Messenger messenger = ctx.getBean("messenger", Messenger.class);
       System.out.println(messenger);
   }
   ```
   ```java
   public static void main(String[] args) {
       ApplicationContext ctx = new AnnotationConfigApplicationContext(MyServiceImpl.class, Dependency1.class, Dependency2.class);
       MyService myService = ctx.getBean(MyService.class);
       myService.doStuff();
   }
   ```
   ```java
   public static void main(String[] args) {
       AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
       ctx.register(AppConfig.class, OtherConfig.class);
       ctx.register(AdditionalConfig.class);
       ctx.refresh();
       MyService myService = ctx.getBean(MyService.class);
       myService.doStuff();
   }
   ```

1. programmatic configuration
   - `AnnotationConfigApplicationContext`
     - post processors -- when using `AnnotationConfigApplicationContext`, annotation config processors are always registered
     - `void register(Class<?>... componentClasses)` -- register one or more component classes (typically `@Configurable`) to be processed
     - `void scan(String... basePackages)`
     - constructors with parameters -- methods combined
       - `AnnotationConfigApplicationContext(Class<?>... componentClasses)`
       - `AnnotationConfigApplicationContext(DefaultListableBeanFactory beanFactory)`
       - `AnnotationConfigApplicationContext(String... basePackages)`
   - `ConfigurableApplicationContext::refresh` -- load or refresh the persistent representation of the configuration, required to be called after above two methods
   - see `@Configuration` for configuration classes

1. configure beans in application context XML configurations, like `/WEB-INF/servlet-context.xml`
   - example
     ```xml
     <beans> <!-- namespace definitions omitted -->
         <mvc:annotation-driven />
         <bean name="greetingServiceImpl" class="com.demo.GreetingServiceImpl" />
         <bean name="helloController" class="com.demo.HelloController">
             <property name="greetingService" ref="greetingServiceImpl" />
         </bean>
     </beans>
     ```
   - `<beans>` -- containing beans
     - `<bean>` -- construct a bean of a given class
       - sub-elements -- constructor arguments and properties
     - `<mvc:annotation-driven>` -- enable MVC related post processors to facilitate mapping requests to controller methods to support `@RequestMapping` etc.
       - URL patterns are relative to the `DispatcherServlet`’s URL pattern
     - `<context:annotation-config/>` or `<context:component-scan/>` -- see `@Configuration`

# Beans

## Bean Attributes

### Bean Resolve Attributes

1. bean name -- defaults to the defining class or method in camelCase

1. `@org.springframework.beans.factory.annotation.Qualifier`
   ```java
   @Target(value={FIELD,METHOD,PARAMETER,TYPE,ANNOTATION_TYPE})
    @Inherited
   public @interface Qualifier
   ```
   - `String value()` -- defaults to class name in camelCase
   - use: categorization -- constitute filtering criteria. For example, you can define multiple `MovieCatalog` beans with the same qualifier value “action”, all of which are injected into a `Set<MovieCatalog>` annotated with `@Qualifier("action")`
   - specify qualifier when autowiring -- use with `@Autowired`
     ```java
     @Autowired
     public MailController(@Qualifier("smtp") MailSender mailSender) {
         this.mailSender = mailSender;
     }
     ```
   - in XML -- `<bean qualifier="">`
   - in Java EE -- `@javax.inject.Named`

1. `@org.springframework.context.annotation.Primary` -- a bean should be given preference when multiple candidates are qualified to autowire a single-valued dependency
   ```java
   @Target(value={TYPE,METHOD})
   public @interface Primary
   ```
   - in XML -- `<bean primary>`

1. `@org.springframework.core.annotation.Order` -- the order after qualifier: determine the order of resolved elements in case of collection injection points (with several target beans matching by type and qualifier)
   ```java
    @Target(value={TYPE,METHOD,FIELD})
   public @interface Order
   ```
   - `int value` -- defaults to `Ordered.LOWEST_PRECEDENCE` (`Integer.MAX_VALUE`)
   - `interface org.springframework.core.Ordered` -- implemented by objects that should be orderable
     - `int getOrder()`
     - `org.springframework.core.PriorityOrdered` -- always applied before plain `Ordered` objects
     - compared by `org.springframework.core.OrderComparator`

### Bean On-Off Attributes

1. `@org.springframework.context.annotation.Profile` -- a bean is eligible for registration when one or more specified profiles are active
   ```java
   @Target(value={TYPE,METHOD})
    @Conditional(value=org.springframework.context.annotation.ProfileCondition.class)
   public @interface Profile
   ```
   - set active profiles
     - `ConfigurableEnvironment.setActiveProfiles`
     - property `spring.profiles.active` -- as `List<String>`, for example `book,dev`
       - property `spring.profiles.default` -- fallback
     - `@ActiveProfiles` -- for test
   - `String[] value` -- used in `Profiles::of` to create a predicate, any style, `!`, `&`, `|` supported in profile expressions
   - in XML -- `<bean profile="">`, or in `<beans>`

1. conditions -- a component is only eligible for registration when all specified conditions match
   - `@org.springframework.context.annotation.Conditional`
     ```java
     @Target(value={TYPE,METHOD})
     public @interface Conditional
     ```
     - `Class<? extends Condition>[] value`
     - `org.springframework.context.annotation.Condition`
       ```java
       @FunctionalInterface public interface Condition
       ```
       - `boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata)`
       - see also sub-interface `ConfigurationCondition`
   - `org.springframework.boot.autoconfigure.condition` -- `@ConditionalOnClass`, `@ConditionalOnProperty` and `@ConditionalOnMissingBean` and more
     ```java
     @ConditionalOnProperty(name="spring.mail.host", havingValue="foo", matchIfMissing=true)
     ```

### Bean Loading Attributes

1. `@org.springframework.context.annotation.DependsOn` -- initialization-time dependency, and, in the case of singleton beans only, a corresponding destruction-time dependency
   ```java
   @Target(value={TYPE,METHOD})
   public @interface DependsOn
   ```
   - `String[] value`
   - in XML -- `<bean depends-on="">`

1. `@org.springframework.context.annotation.Lazy` -- a bean is to be lazily initialized
   ```java
   @Target(value={TYPE,METHOD,CONSTRUCTOR,PARAMETER,FIELD})
   public @interface Lazy
   ```
   - use on definitions -- specify component initialization
   - use when autowiring -- leads to the creation of a lazy-resolution proxy for all affected dependencies, as an alternative to using `ObjectFactory` or `Provider`
   - `org.springframework.beans.factory.ObjectFactory` -- `T getObject()`
     ```java
     @FunctionalInterface public interface ObjectFactory<T>
     ```
     - `org.springframework.beans.factory.ObjectProvider`
       ```java
       public interface ObjectProvider<T> extends ObjectFactory<T>, Iterable<T>
       ```

1. `@org.springframework.context.annotation.Scope` -- the lifecycle of an instance
   ```java
   @Target(value={TYPE,METHOD})
   public @interface Scope
   ```
   - `String value()`, `String scopeName()`
     - `ConfigurableBeanFactory.SCOPE_SINGLETON` -- `"singleton"`, default
     - `ConfigurableBeanFactory.SCOPE_PROTOTYPE` -- `"prototype"`, one instance of the bean is created every time the bean is injected into or retrieved from application context
     - `WebApplicationContext.SCOPE_SESSION` -- `"session"`, one instance of the bean is created for each session, `proxyMode` required
       - shortcut -- `@org.springframework.web.context.annotation.SessionScope`
       - implementation -- `org.springframework.web.context.request.SessionScope`
     - `WebApplicationContext.SCOPE_REQUEST` -- `"request"`, one instance of the bean is created for each request, `proxyMode` required
       - shortcut -- `@org.springframework.web.context.annotation.RequestScope`
       - implementation -- `org.springframework.web.context.request.RequestScope`
     - `WebApplicationContext.SCOPE_APPLICATION` -- `"application"`, one instance for one `ServletContext` (`ApplicationContext` for `"singleton"`)
       - shortcut -- `@org.springframework.web.context.annotation.ApplicationScope`
     - `CustomScopeConfigurer`-- class for configuring custom scope
   - `ScopedProxyMode proxyMode()` -- `default ScopedProxyMode.DEFAULT`, inject proxy as dependency, and instantiate the target bean when request or session incoming
     - `enum ScopedProxyMode`
       - `DEFAULT`, `NO`
       - `INTERFACES` -- preferred, create a JDK dynamic proxy implementing all interfaces exposed by the class of the target object, no proxy created if the target does not implement any interface
       - `TARGET_CLASS` -- create a class-based proxy (uses CGLIB)

## Bean Definitions

1. `@org.springframework.context.annotation.Bean` -- indicates that a method produces a bean
   ```java
   @Target(value={METHOD,ANNOTATION_TYPE})
   public @interface Bean
   ```
   - `String[] value`, `String[] name` -- defaults to the method name
   - dependencies -- an arbitrary number of parameters that describe the dependencies
   - `boolean autowireCandidate`
   - `String destroyMethod` `String initMethod`
   - in XML -- `<bean>`
   - mode when declared within `@Configuration`
     - inter-bean references -- bean methods may reference other `@Bean` methods in the same class by calling them directly. This ensures that references between beans are strongly typed and navigable, guaranteed to respect scoping and AOP semantics
     - inter-bean references requirement -- CGLIB subclassing of each such configuration class at runtime, thus no `final` or `private` for bean factory methods
   - lite mode -- when not annotated within `@Configuration`, but `@Component` or whatever
     - in XML -- `<factory-method>`
     - 'inter-bean references' are not supported -- when one `@Bean`-method invokes another `@Bean`-method in lite mode, the invocation is a standard Java method invocation; Spring does not intercept the invocation via a CGLIB proxy
   - static `@Bean` methods for `BeanFactoryPostProcessor` -- should be declared as a static method to be instantiated early in the container lifecycle, scoping and AOP semantics as trade off

1. `@org.springframework.context.annotation.Configuration` -- indicates that a class declares one or more `@Bean` methods, and / or property sources, feature switches
   ```java
   @Target(value=TYPE)
    @Component
   public @interface Configuration
   ```
   - `String value` -- `@AliasFor(annotation=Component.class)`
   - `boolean proxyBeanMethods` -- see modes in `@Bean`
   - bootstrapping
     - `AnnotationConfigApplicationContext::register`, see [Configure Contexts](#Configure-Contexts)
     - use `<context:component-scan/>`, which has an `annotation-config` attribute
       - `<context:annotation-config/>` -- enable `org.springframework.context.annotation.ConfigurationClassPostProcessor` and other annotation-related post processors for bootstrapping processing of `@Configuration` classes
         ```xml
         <beans>
            <context:annotation-config/>
            <bean class="com.acme.AppConfig"/>
         </beans>
         ```
   - compose configurations -- `@org.springframework.context.annotation.Import`, `@ImportResource` (for XLM), `<import>`, or static inner `@Configuration` classes
   - `@org.springframework.context.annotation.PropertySource` -- a convenient and declarative mechanism for adding a `PropertySource` to Spring's `Environment`, used in conjunction with `@Configuration` classes
     ```java
     @Target(value=TYPE)
      @Repeatable(value=PropertySources.class)
     public @interface PropertySource
     ```
   - in conjunction with `@Enable-` -- `@EnableAsync`, `@EnableScheduling`, `@EnableTransactionManagement`, `@EnableAspectJAutoProxy`, `@EnableCaching`, `@EnableLoadTimeWeaving`, `@EnableWebMvc`, `@EnableMBeanExport`, `@EnableSpringConfigured`, `@EnableTransactionManagement`
   - in conjunction with `@org.springframework.context.annotation.ComponentScan` -- configures component scanning directives, default annotation config processors assumed and no `annotation-config` attribute like `<context:component-scan>`
     ```java
      @Target(value=TYPE)
      @Repeatable(value=ComponentScans.class)
     public @interface ComponentScan
     ```
     - `String[] value`, `String[] basePackages` -- defaults to declaring package, sub-packages also scanned
     - filters -- defaults to include `@Component`
     - more

1. `@org.springframework.stereotype.Component` -- annotated classes are considered as candidates for auto-detection when using annotation-based configuration and classpath scanning
   ```java
   @Target(value=TYPE)
    @Indexed
   public @interface Component
   ```
   - `String value` bean name, defaults to class name in camelCase
   - in Java EE -- `@javax.inject.Named`, but with a few subtle differences
   - special kind components, `@Component` meta annotated
     - `@org.aspectj.lang.annotation.Aspect` -- not meta annotated by `@Component`
     - `@Controller`
       - `@RestController` -- `@Controller` with `@ResponseBody`
     - `@org.springframework.stereotype.Service` -- "an operation offered as an interface that stands alone in the model, with no encapsulated state."
     - `@org.springframework.stereotype.Repository` -- "a mechanism for encapsulating storage, retrieval, and search behavior which emulates a collection of objects", also for DAO

## Bean Lifecycle

1. `org.springframework.context.Lifecycle` -- tbd
   - `SmartLifecycle`

1. bean lifecycle -- see javadoc of `BeanFactory`
   - before ready to use
     - instantiate
     - populate properties
     - `BeanNameAware`’s `setBeanName()`
     - `BeanFactoryAware`’s `setBeanFactory()`
     - `ApplicationContextAware`’s `setApplicationContext()`
     - Pre-initialization `BeanPostProcessor`s, `postProcessBeforeInitialization()`
     - `InitializingBean`’s `afterPropertiesSet()`
     - Call custom init-method
     - Post-initialization `BeanPostProcessor`s, `postProcessAfterInitialization()`
   - after container shutdown
     - `DisposableBean`’s `destroy()`
     - Call custom destroy-method

1. lifecycle hooks
   - lifecycle, in `org.springframework.beans.factory`
     - `FactoryBean<T>` -- interface to be implemented by objects used within a `BeanFactory` which are themselves factories for individual objects
     - `InitializingBean` -- interface to be implemented by beans that need to react once all their properties have been
     - `DisposableBean` -- interface to be implemented by beans that want to release resources on destruction
   - `org.springframework.beans.factory.Aware` -- a marker super interface for `*Aware` indicating that a bean is eligible to be notified by the Spring container of a particular framework object through a callback-style method
     - processing -- processing done in a `BeanPostProcessor`: `ApplicationContextAwareProcessor`
     - `org.springframework.beans.factory`
       - `BeanFactoryAware` -- interface to be implemented by beans that wish to be aware of their owning `BeanFactory`
       - `BeanNameAware` -- interface to be implemented by beans that want to be aware of their bean name in a bean factory
     - `org.springframework.context`
       - `EnvironmentAware` -- `setEnvironment(Environment environment)`
       - `ApplicationContextAware` -- `setApplicationContext(ApplicationContext applicationContext)`
     - `ApplicationEventPublisherAware`
     - `MessageSourceAware`
     - `ServletContextAware`, `ServletConfigAware`

# Dependency Injection

1. DI
   - inject beans into application context
   - inject initialized beans into dependencies on them
   - injection preference -- constructor > field > setter

1. `@org.springframework.beans.factory.annotation.Autowired` -- marks a constructor, field, setter method, or config method as to be autowired, public or not
   ```java
   @Target(value={CONSTRUCTOR,METHOD,PARAMETER,FIELD,ANNOTATION_TYPE})
   public @interface Autowired
   ```
   - `boolean required` -- defaults to `true`, unwired when no matching
     - override for individual parameters -- `Optional`, `@Nullable`
   - single constructor and multiple constructors
     - implicitly if single constructor -- if a class only declares a single constructor, it is always used and autowired
     - inject as many dependencies as possible if multiple constructors annotated -- if multiple non-required constructors declare the annotation, the one with the greatest number of dependencies that can be satisfied by matching beans in the Spring container will be chosen
     - fallback -- use the primary/default constructor
   - other autowire target
     - autowired parameters -- supported by the JUnit Jupiter in the `spring-test` module
     - Arrays, Collections, and Maps -- if no bean itself is of match Collections or Map types, the container autowires all beans matching the declared value type, taking into account Ordered and `@Order` values
   - injection is performed through a `AutowiredAnnotationBeanPostProcessor` -- cannot use `@Autowired` to inject references into `BeanPostProcessor` or `BeanFactoryPostProcessor`
   - order when injecting -- Matches by Type - Restricts by Qualifiers - Matches by Name
   - in Java EE -- `@javax.inject.Inject`, but without required-vs-optional semantics; `@javax.annotation.Resource`, but with subtle differences

## Externalized Configuration

1. externalized values
   - syntax -- see SpEL
   - [Appendix A. Common application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html)
   - relaxed binding -- name bindings take following forms
     - `message.destinationName`
     - `message.destination-name`
     - `MESSAGE_DESTINATION_NAME`
   - add property files -- use `@PropertySource` to inject property files into `Environment`
   - resolving `${...}` placeholders in `<bean>` and `@Value`, `@PropertySource` annotations -- must ensure that an appropriate embedded value resolver bean is registered
     - use `<context:property-placeholder>` in XML
     - use a static `@Bean` method returning `PropertySourcesPlaceholderConfigurer`
   - injection
     - `@org.springframework.beans.factory.annotation.Value`
       ```java
       @Target(value={FIELD,METHOD,PARAMETER,ANNOTATION_TYPE})
       public @interface Value
       ```
     - `@Autowired Environment env;`
     - implement `org.springframework.context.EnvironmentAware`
     - `@org.springframework.boot.context.properties.ConfigurationProperties` -- bind and validate some external Properties with common prefix
       ```java
       @Target(value={TYPE,METHOD})
       public @interface ConfigurationProperties
       ```
       - dependency for code completion -- `org.springframework.boot:spring-boot-configuration-processor`
       - example
         ```java
         @Component
         @ConfigurationProperties(prefix="myapp")
         public static class MyAppProperties {
             private String name;
             public String getName() {
                 return name;
             }
             public void setName(String name) { // myapp.name
                 this.name = name;
             }
         }
         ```

1. property related classes
   - `org.springframework.core.env.PropertySources` -- holder containing one or more `PropertySource` objects
     ```java
     public interface PropertySources extends Iterable<PropertySource<?>>
     ```
     - `org.springframework.core.env.PropertySource<T>` -- name/value property pairs from a source (`T`), which can be `Map`, `ServletContext` etc.
   - `interface org.springframework.core.env.PropertyResolver` -- for resolving properties against any underlying source
     - `getProperty` methods
     - `org.springframework.core.env.PropertySourcesPropertyResolver` -- resolves property values against an underlying set of `PropertySources`
     - `org.springframework.core.env.Environment`
       ```java
       public interface Environment extends PropertyResolver
       ```

1. `PropertySource` resolve order -- [4.2. Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-external-config)
   1. devtools global settings properties in the `$HOME/.config/spring-boot` directory when devtools is active
   1. test related
   1. command line arguments -- see arguments passing before
      ```shell
      ./mvnw spring-boot:run -Dserver.ip=192.168.12.1
      # or after `./mvnw package`
      java -jar target/myapp.jar --data.server=remoteserver:3030
      ```
   1. `SPRING_APPLICATION_JSON` environment variable -- `spring.application.json` in `application.properties`
      ```shell
      SPRING_APPLICATION_JSON='{ "data":{"server":"remoteserver:3030"}}'
      ```
   1. servlet
      1. `ServletConfig` init parameters
      1. `ServletContext` init parameters
   1. JNDI attributes from `java:comp/env`
   1. system properties
   1. OS Environment variables
   1. a `RandomValuePropertySource` that has properties only in `random.*`
   1. application properties
      1. profile-specific application properties (`application-{profile}.properties` and YAML variants)
         1. outside of the package jar
         1. inside of the package jar
      1. plain `application.properties` and YAML variants
         1. outside of the package jar
         1. inside of the package jar
   1. `@PropertySource`
   1. `SpringApplication::setDefaultProperties`

1. profile files -- `application-{profile}.properties` and YAML variants
   - customize
     - `spring.config.name` -- defaults to `application`, for customized config filename
     - `spring.config.location` -- for customized location
     - `spring.config.additional-location`
   - set activate profiles
     - `@org.springframework.test.context.ActiveProfiles`
     - `ConfigurableEnvironment::setActiveProfiles`
     - `spring.profiles.active`, `spring.profiles.default` as fallback -- defaults to `application-default.properties`, use `application.properties` if no specific profiles exist
     - `spring.profiles` -- `List<String>` that at least one should match for the document to be included
     - `spring.profiles.include` -- `List<String>` to unconditionally activate

# SpEL

<!-- TODO -->

1. SpEL basics
   - `#{}` -- can be nested
     - `${}` for `Environment` variables
     - `${...}` placeholder default value syntax -- `${...:val}`
   - literals -- int, float, String (single or double quote), boolean
   - bean reference -- can refer to other beans with bean name, properties of beans, call methods
   - get `Class` or invoke static -- `T()`, `T(java.lang.Math).PI`
   - optional chaining -- `#{artistSelector.selectArtist()?.toUpperCase()}`
   - refer to system properties -- `#{systemProperties['disc.title']}`

1. operators
   - arithmetic and relation operators -- also be specified as a purely alphabetic equivalent, for compatibility in XML
   - `instanceof`
   - `matches` -- regular expression based, `'5.0067' matches '^-?\\d+(\\.\\d{2})?$'`
   - logical -- `and`, `or`, `not` (`!`), `|`
   - conditional -- `?:` (ternary), `?:` (Elvis operator, null coalescing, `??` in JS)
   - collection -- `[]` accessor, also for String
     - `.?[expression]` -- filter according to expression
       - `#{jukebox.songs.?[artist eq 'Aerosmith']}`, `artist` is equivalent to `#this.artist`
     - `.^[expression]` -- first match
     - `.^[expression]` -- last match
     - `.![property]` -- properties projection
       - `#{jukebox.songs.![title]}`

1. Java interface
   - package -- `org.springframework.expression` and sub-packages
   - example
     ```java
     ExpressionParser parser = new SpelExpressionParser();
     Expression exp = parser.parseExpression("'Hello World'.concat('!')");
     String message = (String) exp.getValue();
     ```

# Aspects

1. AOP -- addresses cross-cutting concerns
   - aspect `@Aspect` -- the merger of advice and pointcuts
   - advice -- the job of an aspect, what and when
     - `@Before` -- The advice functionality takes place before the advised method is invoked.
     - `@After` -- The advice functionality takes place after the advised method completes, regardless of the outcome.
     - `@AfterReturning` -- The advice functionality takes place after the advised method successfully completes.
     - `@AfterThrowing` -- The advice functionality takes place after the advised method throws an exception.
     - `@Around` -- The advice wraps the advised method, providing some functionality before and after the advised method is invoked.
       - take `ProceedingJoinPoint` as a parameter to `proceed()`
   - join points -- all the points within the execution flow of the application that are candidates to have advice applied
   - pointcuts `@Pointcut` -- where, one or more join points at which advice should be woven
   - introduction -- allows you to add new methods or attributes to existing classes
   - weaving -- the process of applying aspects to a target object to create a new proxied object
     - Compile time -- Aspects are woven in when the target class is compiled. This requires a special compiler. AspectJ’s weaving compiler weaves aspects this way.
     - Class load time -- Aspects are woven in when the target class is loaded into the JVM . This requires a special ClassLoader that enhances the target class’s byte- code before the class is introduced into the application. AspectJ 5’s load-time weaving ( LTW ) support weaves aspects this way.
     - Runtime -- Aspects are woven in sometime during the execution of the application. Typically, an AOP container dynamically generates a proxy object that delegates to the target object while weaving in the aspects. This is how Spring AOP aspects are woven.

1. aspects in Spring
   - woven into beans -- wrapping with a proxy class
   - if using an `ApplicationContext`, the proxied objects will be created when it loads all the beans from the `BeanFactory`
   - Spring only supports method join points
   - package -- `org.aspectj.lang.annotation`
   - enable AspectJ -- `aspectjweaver.jar` (`org.aspectj:aspectjweaver`) library is on the classpath and `@EnableAspectJAutoProxy`
     ```java
     @Target(value=TYPE)
      @Import(value=org.springframework.context.annotation.AspectJAutoProxyRegistrar.class)
     public @interface EnableAspectJAutoProxy
     ```
     - auto-proxying -- uses the `@Aspect` annotated bean to create a proxy around any other beans for which the aspect’s pointcuts are a match
   - `@EnableLoadTimeWeaving` -- tbd

1. pointcut expression Language
   - `args()` -- Limits join-point matches to the execution of methods whose arguments are instances of the given types
   - `@args()` -- Limits join-point matches to the execution of methods whose arguments are annotated with the given annotation types
   - `execution()` -- Matches join points that are method executions
     ```
     execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern)
            throws-pattern?)
     ```
     - `execution(* concert.Performance.perform(..))` -- matches `concert.Performance.perform` method with any return type (`*`) and any arguments (`..`)
   - `this()` -- Limits join-point matches to those where the bean reference of the AOP proxy is of a given type
   - `target()` -- Limits join-point matches to those where the target object is of a given type
   - `@target()` -- Limits matching to join points where the class of the executing object has an annotation of the given type
   - `within()` -- Limits matching to join points within certain types
     - `within(concert.*)` -- When the method is called from within any class in the `concert` package
   - `@within()` -- Limits matching to join points within types that have the given annotation (the execution of methods declared in types with the given annotation when using Spring AOP)
   - `@annotation` -- Limits join-point matches to those where the subject of the join point has the given annotation
   - `bean()` -- limits the pointcut’s effect to that specific bean
     - `bean('woodstock')`
   - logical -- `||`, `&&`, `!`
   - `+` -- any subtypes
   - `*`, `..`, `*Name` (wildcard)

1. binding form -- use a parameter name in place of a type name in an args expression, the value of the corresponding argument is passed as the parameter value when the advice is invoked
   ```java
   @Before("com.xyz.myapp.SystemArchitecture.dataAccessOperation() && args(account,..)")
   public void validateAccount(Account account) {
       // ...
   }
   ```
   - supports -- `arg`, the proxy object (`this`), target object (`target`), and annotations (`@within`, `@target`, `@annotation`, and `@args`)

1. example using AOP
   ```java
   @Aspect
   public class Audience {
       @Pointcut("execution(* concert.Performance.perform(..))")
       public void performance() {}
       @Before("performance()")
       public void silenceCellPhones() { System.out.println("Silencing cell phones"); }
       @Before("execution(* com.xyz.myapp.dao.*.*(..))")
       public void doAccessCheck() {
           // ...
       }
       @Around("performance()")
       public void watchPerformance(ProceedingJoinPoint jp) {
           try {
               System.out.println("Silencing cell phones");
               System.out.println("Taking seats");
               jp.proceed();
               System.out.println("CLAP CLAP CLAP!!!");
           } catch (Throwable e) {
               System.out.println("Demanding a refund");
           }
       }
   }
   ```

1. aspect introduction -- add new functionality (methods)
   - add interface with default implementation -- enable an aspect to declare that advised objects implement a given interface, and to provide an implementation of that interface on behalf of those objects
   - example -- all implementors of service interfaces also implement the `UsageTracked` interface, the implementation is `DefaultUsageTracked`
     ```java
     @Aspect
     public class UsageTracking {
         @DeclareParents(value="com.xzy.myapp.service.*+", defaultImpl=DefaultUsageTracked.class)
         public static UsageTracked mixin;
         @Before("com.xyz.myapp.SystemArchitecture.businessService() && this(usageTracked)")
         public void recordUsage(UsageTracked usageTracked) {
             usageTracked.incrementUseCount();
         }
     }
     ```

# SpringMVC

## Enable MVC

1. `@org.springframework.web.servlet.config.annotation.EnableWebMvc` -- imports the Spring MVC configuration from `WebMvcConfigurationSupport`

1. `org.springframework.web.servlet.config.annotation.WebMvcConfigurer` -- callback methods to customize the Java-based configuration for Spring MVC enabled via `@EnableWebMvc`
   - `default void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers)`
   - `default void addCorsMappings(CorsRegistry registry)`
   - `default void addFormatters(FormatterRegistry registry)`
   - `default void addInterceptors(InterceptorRegistry registry)`
   - `default void addResourceHandlers(ResourceHandlerRegistry registry)`
   - `default void addReturnValueHandlers(List<HandlerMethodReturnValueHandler> handlers)`
   - `default void addViewControllers(ViewControllerRegistry registry)`
   - `default void configureAsyncSupport(AsyncSupportConfigurer configurer)`
   - `default void configureContentNegotiation(ContentNegotiationConfigurer configurer)`
   - `default void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer)`
   - `default void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers)`
   - `default void configureMessageConverters(List<HttpMessageConverter<?>> converters)`
   - `default void configurePathMatch(PathMatchConfigurer configurer)`
   - `default void configureViewResolvers(ViewResolverRegistry registry)`
   - `default void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers)`
   - `default void extendMessageConverters(List<HttpMessageConverter<?>> converters)`
   - `default MessageCodesResolver getMessageCodesResolver()`
   - `default Validator getValidator()`

## DispatcherServlet

1. `org.springframework.web.servlet.DispatcherServlet`
   ```java
   public class DispatcherServlet extends FrameworkServlet
   ```
   - `org.springframework.web.servlet.FrameworkServlet`
     ```java
     public abstract class FrameworkServlet extends HttpServletBean
     implements ApplicationContextAware
     ```
     - `org.springframework.web.servlet.HttpServletBean`
       ```java
       public abstract class HttpServletBean extends HttpServlet
       implements EnvironmentCapable, EnvironmentAware
       ```
   - creation
     - `DispatcherServlet(WebApplicationContext webApplicationContext)`
     - `DispatcherServlet()` -- create own web application context based on defaults and servlet init-params

1. dispatch targets -- tbd
   - `HandlerMapping`
   - `HandlerAdapter`
   - `HandlerExceptionResolver`
   - `ViewResolver`
   - `LocaleResolver`
   - `ThemeResolver`
   - `MultipartResolver`
   - `FlashMapManager`
   - defaults -- tbd
   - processing -- tbd

1. bootstrap web application contexts
   - example -- see docs of `WebApplicationInitializer` and SpringMVC
   - `org.springframework.web.context.ContextLoaderListener` -- bootstrap listener to start up and shut down Spring's root `WebApplicationContext`. Simply delegates to `ContextLoader` as well as to `ContextCleanupListener`.
     ```java
     public class ContextLoaderListener extends ContextLoader
     implements ServletContextListener
     ```
   - initializers -- extending `AbstractAnnotationConfigDispatcherServletInitializer` for hierarchy web application contexts
     - `org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer` -- with abstract methods specifying bean classes for root and non-root application contexts
       - `protected abstract Class<?>[] getRootConfigClasses()` -- delegated by `createRootApplicationContext()`
       - `protected abstract Class<?>[] getServletConfigClasses()` -- delegated by `createServletApplicationContext()`
       - parents
         - `interface org.springframework.web.WebApplicationInitializer` -- `void onStartup(ServletContext servletContext)` to configure the `ServletContext` programmatically
         - `org.springframework.web.context.AbstractContextLoaderInitializer` -- register a `ContextLoaderListener` when `onStartup`, only abstract method `createRootApplicationContext()`
         - `org.springframework.web.servlet.support.AbstractDispatcherServletInitializer` -- with abstract methods for HTTP servlet configs like filters, mappings, etc.
     - `org.springframework.web.SpringServletContainerInitializer` -- SPI configured class, when `onStartup` (see `ServletContainerInitializer::onStartup`), scan `WebApplicationInitializer` implementations and delegates to their `onStartup`
       ```java
       public class SpringServletContainerInitializer implements javax.servlet.ServletContainerInitializer
       ```
   - `<init-param>`s of `DispatcherServlet`
     - `contextClass`, defaults to `XmlWebApplicationContext`
     - `contextConfigLocation`
     - `namespace` -- defaults to `[servlet-name]-servlet`
     - `throwExceptionIfNoHandlerFound` -- whether to throw a `NoHandlerFoundException` when no handler was found for a request, which can then be caught with a `HandlerExceptionResolver`; defaults to `false`, return 404 and no `Exception`
   - filter
     - `org.springframework.boot.web.servlet.FilterRegistrationBean` -- a `ServletContextInitializer` to register Filters
       - `void setOrder(int order)`
     - `@org.springframework.boot.web.servlet.ServletComponentScan` -- Enables scanning for Servlet components (filters, servlets, and listeners annotations in `javax.servlet.annotation`). Scanning is only performed when using an embedded web server.

## Controller

1. `@Controller`, `@RestController` -- controller, work in coordination with `@RequestMapping`
   - `org.springframework.stereotype.Controller`
     ```java
     @Target(value=TYPE)
      @Component
     public @interface Controller
     ```
   - `@org.springframework.web.bind.annotation.RestController` -- `@Controller` with `@ResponseBody`, which means `@RequestMapping` methods assume `@ResponseBody` semantics by default
     ```java
     @Target(value=TYPE)
      @Controller
      @ResponseBody
     public @interface RestController
     ```
   - `@org.springframework.web.bind.annotation.ResponseBody` -- indicates a method or methods of a class return value that should be bound to the web response body, instead of view resolution or rendering with an HTML template
     ```java
     @Target(value={TYPE,METHOD})
     public @interface ResponseBody
     ```
     - `@Inherited` -- this annotation is not annotated with `@Inherited` but is inherited
   - AOP proxying -- use class-based proxying or controller interface
     - controller interface -- make sure to put all mapping annotations on the controller interface rather than on the implementation class

1. `@org.springframework.web.bind.annotation.RequestMapping`
   ```java
   @Target(value={TYPE,METHOD})
   public @interface RequestMapping
   ```
   - method level inherit from type level -- type level checked before method level
   - `String[] path`, `String[] value`
     - patterns -- `?`, `*`, `**`, `{name}`, `{name:regex}`, SpEL property placeholders; use `@PathVariable` to captured `name`
     - matcher implementation -- `AntPathMatcher`, can be customized
     - multiple match -- when multiple patterns match a URL, the most specific one will be used, compared by `AntPathMatcher::getPatternComparator`
   - `String[] params` -- `"myParam=myValue"`, `"myParam!=myValue"`, `"myParam"`, `"!myParam"`
   - `String[] headers` -- `"My-Header=myValue"`, `"My-Header!=myValue"`, `"!My-Header"`, `"content-type=text/*"`
     - `String[] consumes` -- `"text/plain"`, `{"text/plain", "application/*"}`, `MediaType.TEXT_PLAIN_VALUE`
     - `String[] produces` -- like the above, but also parameters like `"text/plain;charset=UTF-8"`
   - `RequestMethod[] method`
     - `@GetMapping`
     - `@PostMapping`
     - `@PutMapping`
     - `@DeleteMapping`
     - `@PatchMapping`

1. handler method parameters -- [docs](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/web.html#mvc-ann-arguments)
   - `HandlerMethodArgumentResolver`
   - standard servlet type parameters
     - `HttpServletRequest`, `InputStream` or `Reader`
     - `HttpServletResponse`, `OutputStream` or `Writer`
     - `HttpSession`, `Locale`
     - `org.springframework.web.context.request.WebRequest` -- `HttpServletRequest`, `HttpServletResponse`, `HttpSession` in one
   - `org.springframework.web.bind.annotation`
     - common properties
       - `String name`, `String value` -- defaults to parameter name, but code is required to be compiled with debugging information or with the `-parameters` compiler flag
         - automatic type conversion -- automatically converted to the appropriate type, or `TypeMismatchException`; use `DataBinder` to register custom type support, tbd
         - kv map -- if the method parameter is `Map<String, String>`, `MultiValueMap<String, String>` then the map is populated with all path variable names and values
       - `boolean required` -- `Exception`, or `null` / `Optional`
       - `String defaultValue` -- defaults to `ValueConstants.DEFAULT_NONE` to serve as nil
     - `@PathVariable` -- captured URI template variable; no `defaultValue`
     - `@RequestParam` -- query parameters, also form data, and parts in multipart when SpringMVC
     - `@RequestHeader`
     - `@RequestPart` -- for multipart, tbd
     - `@MatrixVariable` -- RFC 3986 URI path parameters, parameters but in path segments, removed from the URL prior to matching it to a Servlet mapping
       ```
       http://www.example.com/hotel/43;floor=8;room=15/guest
       /hotel/43/guest
       ```
       - `String pathVar` -- for disambiguation when the same parameter persistent in different path segments; `43` in above case
   - POJO
     - `@ModelAttribute` -- for access to an existing attribute in the model
     - plain POJO, called form object, aka. command object -- if `BeanUtils::isSimpleProperty`, `@RequestParam` but use a POJO, `set-` methods examined; otherwise `@ModelAttribute`
     - `@RequestBody` -- a method parameter should be bound to the body of the web request, converted by `HttpMessageConverter`
     - validate
       ```java
       @RequestMapping(value="join", method=RequestMethod.POST) public String join(@Valid UserRegistrationForm form, BindingResult validation)
       ```
       - `BindingResult` -- can be `Errors`, or omit and throw `MethodArgumentNotValidException` when validation failed
   - `HttpEntity<T>`, `RequestEntity<T>` -- header and body
   - `@org.springframework.security.core.annotation.AuthenticationPrincipal` -- resolve `Authentication.getPrincipal()` to a method argument, usually of type `UserDetails`
   - more

1. `@ResponseStatus`

1. handler method return
   - `void`
   - model and view
     - model -- `Map<String, Object>`, `ModelMap`, `Model`
     - `View`, `String`
       - `UrlBasedViewResolver` for `String` return type special view names
         - `redirect:` -- `RedirectView`
         - `forward:` -- `InternalResourceView`
     - `ModelAndView`
   - `HttpEntity<T>`, `ResponseEntity<T>`
   - POJO
     - `@ResponseBody`
     - plain POJO -- as `@ModelAttribute`
   - async
     - `DeferredResult<V>`
     - `Callable<V>`

1. error handling
   - `@org.springframework.web.bind.annotation.ExceptionHandler` -- handling exceptions in specific handler classes and/or handler methods
     ```java
     @Target(value=METHOD)
     ```
     - `Class<? extends Throwable>[] value` -- Exceptions handled by the annotated method. If empty, will default to any exceptions listed in the method argument list.
   - `@org.springframework.web.bind.annotation.ControllerAdvice` -- declare `@ExceptionHandler`, `@InitBinder`, or `@ModelAttribute` methods to be shared across multiple `@Controller` classes
     ```java
     @Target(value=TYPE)
      @Component
     ```
     - `String[] basePackages`, `String[] value` -- the packages and sub-packages in which to select controllers to be advised
     - more
   - `org.springframework.web.server.ResponseStatusException` -- for exceptions associated with specific HTTP response status codes

1. `org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice` -- customizing the response after the execution of an `@ResponseBody` or a `ResponseEntity` controller method but before the body is written with an `HttpMessageConverter`

## Validation

1. validation
   - [Bean Validation](https://docs.spring.io/spring/docs/5.2.7.RELEASE/spring-framework-reference/core.html#validation-beanvalidation) -- `javax.validation` package and sub-packages
   - [Spring Validation](https://docs.spring.io/spring/docs/5.2.7.RELEASE/spring-framework-reference/core.html#validation)

1. validate
   - cause validation to be applied -- `MethodArgumentNotValidException` and 400 if not passed, can be used on handler methods arguments
     - `@javax.validation.Valid`
     - `@org.springframework.validation.annotation.Validated`
     - self define such annotations -- `@javax.validation.Constraint`
   - configuration -- `WebMvcConfigurer::WebMvcConfigurer` for `Validator`, which defaults to `LocalValidatorFactoryBean`
   - `org.springframework.validation.Validator`

## Interceptor

1. `HandlerMapping` -- define a mapping between requests and handler objects, along with a list of interceptors for pre- and post-processing
   - `RequestMappingHandlerMapping` -- for `@RequestMapping`

1. `org.springframework.web.servlet.HandlerInterceptor` -- add common preprocessing behavior without needing to modify each handler implementation
   - async version -- `org.springframework.web.servlet.AsyncHandlerInterceptor`
   - register -- `WebMvcConfigurer::addInterceptors`
   - `boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)` -- return `true` so the handler execution chain continues
   - `postHandle` -- less useful with `@ResponseBody` and `ResponseEntity` methods for which the response is written and committed within the `HandlerAdapter` and before `postHandle`
   - `afterCompletion`

## Web Client

1. `org.springframework.web.client.RestTemplate` -- synchronous client to perform HTTP requests, exposing a simple, template method API over underlying HTTP client libraries such as the JDK `HttpURLConnection`, Apache HttpComponents, and others
   - `exchange` method
   - `execute` method
   - more
   - can `@LoadBalance`

1. `org.springframework.web.reactive.function.client.WebClient` -- non-blocking, reactive client to perform HTTP requests, exposing a fluent, reactive API over underlying HTTP client libraries such as Reactor Netty

# Data

1. transaction
   - `org.springframework.transaction.PlatformTransactionManager` -- bean to configure for implementation of this interface as transaction infrastructure
     - `org.springframework.jdbc.datasource.DataSourceTransactionManager` -- `PlatformTransactionManager` implementation for a single JDBC `DataSource`
     - `java.sql.Connection`-like not thread-safe -- thread bound and transaction linked, like `javax.persistency.EntityManager`
   - configure
     - `@org.springframework.transaction.annotation.EnableTransactionManagement` -- `<tx:annotation-driven/>`, enables Spring's annotation-driven transaction management capability
       - `AdviceMode mode` -- `AdviceMode.PROXY`, `AdviceMode.ASPECTJ`
       - `boolean proxyTargetClass` -- CGLIB or JDK proxy, `true` will affect all Spring-managed beans requiring proxying, for example `@Async`
     - `org.springframework.transaction.annotation.TransactionManagementConfigurer`
   - `@org.springframework.transaction.annotation.Transactional`
     ```java
     @Target(value={TYPE,METHOD})
      @Inherited public @interface Transactional
     ```
     - `String transactionManager`, `String value` -- optional, the qualifier value (or the bean name) of a specific `TransactionManager`
     - `String[] rollbackForClassName`, `Class<? extends Throwable>[] rollbackFor` -- which exception types must cause a transaction rollback, defaults to `RuntimeException` and `Error`
     - `Isolation isolation`
     - `Propagation propagation` -- defaults to `Propagation.REQUIRED`, use current transaction or create anew if none exists; `Propagation.NESTED`, a single physical transaction with multiple savepoints
     - `boolean readOnly`
     - more

1. exception translation -- unite error code and exceptions that extended `SQLException` from JDBC vendors
   - translator -- configure translator implementation beans
     - `org.springframework.dao.support.PersistenceExceptionTranslator`
     - `org.springframework.dao.support.ChainedPersistenceExceptionTranslator`
   - translation target -- `@Repository` methods; catch `DataAccessException` not in from the repository itself but callers
   - `org.springframework.dao.DataAccessException`
     - `org.springframework.dao.NonTransientDataAccessException`
     - `org.springframework.dao.RecoverableDataAccessException`
     - `org.springframework.dao.TransientDataAccessException`
     - more

1. `javax.sql.DataSource` -- factory for connections, configure as beans for data sources
   - `org.springframework.jdbc.datasource.DriverManagerDataSource` -- property setters
   - `org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup`

1. Spring Data
   - `org.springframework.data.repository.Repository<T, ID>`
     - `org.springframework.data.repository.CrudRepository<T, ID>`
       - `org.springframework.data.repository.PagingAndSortingRepository<T,ID>`

1. MyBatis
   - DAO example
     ```java
     @Mapper
     public interface UserDao {
         @Select("SELECT * FROM user WHERE name = #{name}")
         User findUserByName(@Param("name") String name);
         @Select("SELECT * FROM user")
         List<User> findAllUser();
         @Insert("INSERT INTO user(name, age,money) VALUES(#{name}, #{age}, #{money})")
         void insertUser(@Param("name") String name, @Param("age") Integer age, @Param("money") Double money);
         @Update("UPDATE  user SET name = #{name},age = #{age},money= #{money} WHERE id = #{id}")
         void updateUser(@Param("name") String name, @Param("age") Integer age, @Param("money") Double money,
                         @Param("id") int id);
         @Delete("DELETE from user WHERE id = #{id}")
         void deleteUser(@Param("id") int id);
     }
     ```
   - multiple data source example
     ```properties
     server.port=8335
     # 配置第一个数据源
     spring.datasource.hikari.db1.jdbc-url=jdbc:mysql://127.0.0.1:3306/erp?useUnicode=true&characterEncoding=utf8&useSSL=true&serverTimezone=GMT%2B8
     spring.datasource.hikari.db1.username=root
     spring.datasource.hikari.db1.password=153963
     spring.datasource.hikari.db1.driver-class-name=com.mysql.cj.jdbc.Driver
     ```
     ```java
     @Configuration
     @MapperScan(basePackages = "top.snailclimb.db1.dao", sqlSessionTemplateRef = "db1SqlSessionTemplate")
     public class DataSource1Config {
         @Bean(name = "db1DataSource")
         @ConfigurationProperties(prefix = "spring.datasource.hikari.db1")
         @Primary
         public DataSource testDataSource() {
             return DataSourceBuilder.create().build();
         }
         @Bean(name = "db1SqlSessionFactory")
         @Primary
         public SqlSessionFactory testSqlSessionFactory(@Qualifier("db1DataSource") DataSource dataSource) throws Exception {
             SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
             bean.setDataSource(dataSource);
             //  bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/mapper/db1/*.xml"));
             return bean.getObject();
         }
         @Bean(name = "db1TransactionManager")
         @Primary
         public DataSourceTransactionManager testTransactionManager(@Qualifier("db1DataSource") DataSource dataSource) {
             return new DataSourceTransactionManager(dataSource);
         }
         @Bean(name = "db1SqlSessionTemplate")
         @Primary
         public SqlSessionTemplate testSqlSessionTemplate(@Qualifier("db1SqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
             return new SqlSessionTemplate(sqlSessionFactory);
         }
     }
     ```

## Jackson

1. `com.fasterxml.jackson.annotation`

1. ignore
   - `@JsonIgnoreProperties`
   - `@JsonIgnore`

1. `@JsonFormat`
   ```java
   @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone="GMT")
   private Date date;
   ```

1. `@JsonUnwrapped` -- flatten

# Integration

1. `org.springframework.core.task.TaskExecutor`
   ```java
   @FunctionalInterface
   public interface TaskExecutor extends Executor
   ```
   - `void execute(Runnable task)`

1. async
   - configuration
     - `@EnableAsync`
       - executor -- `TaskExecutor` bean, or an `Executor` bean named `"taskExecutor"`, `SimpleAsyncTaskExecutor` if none found
     - `org.springframework.scheduling.annotation.AsyncConfigurer` -- for `@Configuration`, `@EnableAsync` classes
       - `default Executor getAsyncExecutor()`
       - `default AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler()` -- uncaught exceptions are only logged by default
   - `@org.springframework.scheduling.annotation.Async` -- the return type is constrained to either `void` or `Future`
   - `TaskExecutor`
     - `org.springframework.core.task.AsyncTaskExecutor` -- with methods supporting `Future`
       - `org.springframework.core.task.SimpleAsyncTaskExecutor` -- fires up a new Thread for each task, use `ThreadPoolTaskExecutor` for thread pools
         - `void setConcurrencyLimit(int concurrencyLimit)` -- defaults to unlimited
       - `org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor`
         - `setCorePoolSize`
         - `setMaxPoolSize`
         - `setQueueCapacity`
         - `setRejectedExecutionHandler` -- defaults to `ThreadPoolExecutor.AbortPolicy`

1. scheduling
   - scheduled
     - `@org.springframework.scheduling.annotation.Scheduled` -- must expect no arguments
       - `String cron` -- cron expressions, see javadoc of `CronSequenceGenerator`
     - `org.springframework.scheduling.TaskScheduler` -- the scheduling of `Runnable`s; the 'default' implementation is `ThreadPoolTaskScheduler`
     - `org.springframework.scheduling.Trigger` -- can be used in `TaskScheduler::schedule`
       - `org.springframework.scheduling.support.CronTrigger`
       - `org.springframework.scheduling.support.PeriodicTrigger`
   - `TaskExecutor`, `org.springframework.scheduling.TaskScheduler`
     - `org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler` -- `TaskScheduler` interface wrapping a native `ScheduledThreadPoolExecutor`
       - `void setPoolSize(int poolSize)` -- pool size defaults to 1
   - configuration
     - `@EnableScheduling`
     - `org.springframework.scheduling.annotation.SchedulingConfigurer`
     - `org.springframework.scheduling.config.ScheduledTaskRegistrar` -- `set-`, `add-`, `get-` methods
       - `void setTaskScheduler(TaskScheduler taskScheduler)`

1. events
   - `org.springframework.context.ApplicationEvent`
   - `org.springframework.context.ApplicationListener<E extends ApplicationEvent>` -- only singleton beans
   - `@org.springframework.context.event.EventListener`
   - `org.springframework.context.ApplicationEventPublisher`
     - `org.springframework.context.ApplicationEventPublisherAware`
   - `org.springframework.context.event.ApplicationEventMulticaster`

1. method cache
   - enable and config -- `@org.springframework.cache.annotation.EnableCaching`, `org.springframework.cache.annotation.CachingConfigurer`
   - interface `org.springframework.cache.Cache` -- common cache operations
   - interface `org.springframework.cache.CacheManager` -- cache manager SPI, allow for retrieving named Cache regions
   - implementations -- JDK `java.util.concurrent.ConcurrentMap` based caches, Ehcache 2.x, Gemfire cache, Caffeine, and JSR-107 compliant caches (such as Ehcache 3.x)
   - `org.springframework.cache.annotation`
     - `@Cacheable` -- Triggers cache population.
     - `@CacheEvict` -- Triggers cache eviction.
     - `@CachePut` -- Updates the cache without interfering with the method execution.
     - `@Caching` -- Regroups multiple cache operations to be applied on a method.
     - `@CacheConfig` -- Shares some common cache-related settings at class-level.

# Security

1. security concepts
   - authentication
     - `Authorization: Digest`
     - client certificates
     - claims-based authentication -- OAuth and SAML
   - security related headers, configurable by `HttpSecurity::headers`
     - `Cache-Control: no-cache, no-store, max-age=0, must-revalidate`, `Pragma: no-cache`
     - `X-Content-Type-Options: nosniff` -- no MIME-sniffing
     - `Strict-Transport-Security: max-age=31536000; includeSubDomains` -- only use HTTPS
     - `X-Frame-Options`
     - `X-XSS-Protection: 1; mode=block`

1. roles, activities, identities
   - `org.springframework.security.core.context.SecurityContext` -- the minimum security information associated with the current thread of execution
     - `Authentication getAuthentication()`
     - `void setAuthentication(Authentication authentication)`
     - `org.springframework.security.core.context.SecurityContextHolder` -- a series of static methods related to `SecurityContext`
       - `static SecurityContext getContext()`
   - `org.springframework.security.core.Authentication`
     ```java
     public interface Authentication extends Principal, Serializable
     ```
     - `Collection<? extends GrantedAuthority> getAuthorities()`
     - `Object getCredentials()`
     - `Object getDetails()`
     - `Object getPrincipal()`
     - `boolean isAuthenticated()`
     - `void setAuthenticated(boolean isAuthenticated)`
     - `java.security.Principal` -- represent any entity, such as an individual, a corporation, and a login id
     - `org.springframework.security.authentication.UsernamePasswordAuthenticationToken` -- an `Authentication` implementation that is designed for simple presentation of a username and password
   - `org.springframework.security.core.GrantedAuthority` -- an authority granted to an `Authentication` object
   - `org.springframework.security.authentication.AuthenticationManager` -- processes an `Authentication` request, default implementation `ProviderManager` delegates to `AuthenticationProvider` implementations
     - `Authentication authenticate(Authentication authentication)`
     - `org.springframework.security.authentication.AuthenticationProvider` -- can process a specific `Authentication` implementation
       - `Authentication authenticate(Authentication authentication)`
       - `boolean supports(java.lang.Class<?> authentication)`
       - `org.springframework.security.authentication.dao.DaoAuthenticationProvider` -- an `AuthenticationProvider` implementation that retrieves user details from a `UserDetailsService`
   - `org.springframework.security.core.userdetails.UserDetails` -- store user information, such as the username and password, `GrantedAuthority`s, and whether the user is enabled, expired, and locked out; which is later encapsulated into `Authentication` objects, e.g. by authentication providers
     - `UserDetailsService::loadUserByUsername`
   - `org.springframework.security.core.AuthenticationException` -- authentication fail, `RuntimeException`
   - `org.springframework.security.access.AccessDeniedException` -- an `Authentication` object does not hold a required authority

1. configure
   - `org.springframework.web.filter.DelegatingFilterProxy` -- proxy for a standard Servlet Filter, delegating to a Spring-managed bean that implements the `Filter` interface
     - `FilterChainProxy` -- register security filters
     - `org.springframework.security.web.SecurityFilterChain` -- used by `FilterChainProxy` to determine which Spring Security Filters should be invoked for this request
   - `org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer` -- registers the `DelegatingFilterProxy` to use the `springSecurityFilterChain` before any other registered `Filter`
   - `@org.springframework.security.config.annotation.web.configuration.EnableWebSecurity` -- add this annotation to an `@Configuration` class to have the Spring Security configuration defined in any `WebSecurityConfigurer` or more likely by extending the `WebSecurityConfigurerAdapter` base class and overriding individual methods
     - `org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter` -- a convenient base class for creating a `WebSecurityConfigurer` instance
       - `protected void configure(AuthenticationManagerBuilder auth)` -- used by the default implementation of `authenticationManager()` to attempt to obtain an `AuthenticationManager`
         - `AuthenticationManager authenticationManagerBean()` -- to be exposed as a `@Bean`
       - `protected void configure(HttpSecurity http)`
       - `void configure(WebSecurity web)`
   - example -- see javadoc of `@EnableWebSecurity`

1. builders in configurations
   - `org.springframework.security.config.annotation.web.builders.HttpSecurity` -- configuring web based security for specific http requests
     ```java
     public final class HttpSecurity
     extends AbstractConfiguredSecurityBuilder<DefaultSecurityFilterChain,HttpSecurity>
     implements SecurityBuilder<DefaultSecurityFilterChain>, HttpSecurityBuilder<HttpSecurity>
     ```
   - `org.springframework.security.config.annotation.web.builders.WebSecurity` -- to create the `FilterChainProxy` known as the Spring Security Filter Chain (`springSecurityFilterChain`)
     ```java
     public final class WebSecurity
     extends AbstractConfiguredSecurityBuilder<Filter,WebSecurity>
     implements SecurityBuilder<Filter>, ApplicationContextAware
     ```
   - `org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder` -- used to create an `AuthenticationManager`. Allows for easily building in memory authentication, LDAP authentication, JDBC based authentication, adding `UserDetailsService`, and adding `AuthenticationProvider`s
     ```java
     public class AuthenticationManagerBuilder
     extends AbstractConfiguredSecurityBuilder<AuthenticationManager,AuthenticationManagerBuilder>
     implements ProviderManagerBuilder<AuthenticationManagerBuilder>
     ```
     - `JdbcUserDetailsManagerConfigurer<AuthenticationManagerBuilder> jdbcAuthentication()`
     - `InMemoryUserDetailsManagerConfigurer<AuthenticationManagerBuilder> inMemoryAuthentication()`
     - `LdapAuthenticationProviderConfigurer<AuthenticationManagerBuilder> ldapAuthentication()`
     - `<T extends UserDetailsService> DaoAuthenticationConfigurer<AuthenticationManagerBuilder,T> userDetailsService(T userDetailsService)`

1. security events in `org.springframework.security.authentication.event`
   - `AbstractAuthenticationFailureEvent` -- subclasses indicate more detailed reasons for failure
   - `AuthenticationSuccessEvent` -- also remember-me authentication
     - `InteractiveAuthenticationSuccessEvent`
   - `org.springframework.security.web.authentication.session.SessionFixationProtectionEvent`
   - `org.springframework.security.core.session.SessionDestroyedEvent`

1. method security
   - imperative -- `SecurityContextHolder`
   - `@AuthenticationPrincipal` -- binds a method parameter or method return value to the `Authentication.getPrincipal()`
   - `@org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity`
     - `boolean jsr250Enabled`
     - `boolean securedEnabled`
     - `boolean prePostEnabled`
     - `org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration`
   - `jsr250Enabled`: `javax.annotation.security` annotations -- `@RolesAllowed` - `@PermitAll` - more
   - `securedEnabled`: `@org.springframework.security.access.annotation.Secured` -- attributes, like `"ROLE_USER"`, `"IS_AUTHENTICATED_REMEMBERED"`
   - `prePostEnabled`: in `org.springframework.security.access.prepost`, `pre-` for parameters, `post-` for returns
     - `@PreAuthorize`
     - `@PostAuthorize`
     - `@PreFilter` -- filtering of collections and arrays
     - `@PostFilter`
   - URL -- `HttpSecurity::authorizeRequests`
     ```java
     protected void configure(HttpSecurity http) throws Exception {
         http
             // ...
             .authorizeRequests(authorize -> authorize
                 .mvcMatchers("/resources/**", "/signup", "/about").permitAll()
                 .mvcMatchers("/admin/**").hasRole("ADMIN")
                 .mvcMatchers("/db/**").access("hasRole('ADMIN') and hasRole('DBA')")
                 .anyRequest().denyAll()
             );
     }
     ```
     - `org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer.ExpressionInterceptUrlRegistry` -- matchers, order sensitive
       - `anyRequest`
       - `antMatchers` -- `AntPathMatcher`
       - `requestMatchers` -- `RequestMatcher`, simple strategy to match an `HttpServletRequest`
         - `mvcMatchers` -- `MvcRequestMatcher`, e.g. for `/secured` as well as `/secured/`, `/secured.html`, `/secured.xyz`
         - `regexMatchers` -- `RegexRequestMatcher`
     - `org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer.AuthorizedUrl`
       - `not()`
       - `permitAll()`
       - `denyAll()`
       - authorization requirement
         - `authenticated()`
         - `anonymous()`
       - attributes
         - `access(String attribute)` -- SpEL
         - `hasAuthority(String authority)` -- `"ROLE_"` not automatically inserted  
           `hasAnyAuthority(String... authorities)`
         - `hasRole(String role)` -- `"ROLE_"` automatically inserted  
           `hasAnyRole(String... roles)`
         - `hasIpAddress(String ipaddressExpression)`
       - remember
         - `rememberMe()`
         - `fullyAuthenticated()`

1. authorization decisions behind scenes
   - `org.springframework.security.access.AccessDecisionVoter`
     - decisions -- `static int`, `ACCESS_ABSTAIN`, `ACCESS_DENIED`, `ACCESS_GRANTED`
     - `org.springframework.security.acls.AclEntryVoter` -- access control lists based
     - `org.springframework.security.access.vote.AuthenticatedVoter` -- for special-case roles `IS_AUTHENTICATED_ANONYMOUSLY`, `IS_AUTHENTICATED_REMEMBERED`, and `IS_AUTHENTICATED_FULLY`
     - method security
       - `org.springframework.security.access.annotation.Jsr250Voter`
       - `org.springframework.security.access.prepost.PreInvocationAuthorizationAdviceVoter`
     - role
       - `org.springframework.security.access.vote.RoleHierarchyVoter`
       - `org.springframework.security.access.vote.RoleVoter`
     - `org.springframework.security.web.access.expression.WebExpressionVoter` -- `HttpSecurity`
   - `org.springframework.security.access.AccessDecisionManager` -- final decisions
     - `org.springframework.security.access.vote.AffirmativeBased`, default
     - `org.springframework.security.access.vote.ConsensusBased`
     - `org.springframework.security.access.vote.UnanimousBased`

1. access control list (or ACL) -- tbd

1. OAuth 2 -- tbd
   - provider end point -- `org.springframework.security.oauth2.provider.endpoint`
     - `AuthorizationEndpoint` -- for authorization. Default URL: `/oauth/authorize`
     - `TokenEndpoint` -- for access tokens. Default URL: `/oauth/token`
   - authorization server configuration
     - `@EnableAuthorizationServer`
     - `AuthorizationServerConfigurer`
   - resource server filter -- `OAuth2AuthenticationProcessingFilter`

<!-- TODO -->
# Spring Boot

1. `@org.springframework.boot.autoconfigure.SpringBootApplication` -- singleton with a `run` method which executes the application
   ```java
   @Target(value=TYPE)
    @Inherited
    @SpringBootConfiguration
    @EnableAutoConfiguration
    @ComponentScan(excludeFilters={@ComponentScan.Filter(type=CUSTOM,classes=TypeExcludeFilter.class),})
   public @interface SpringBootApplication
   ```
   - equivalent -- `@Configuration`, `@ComponentScan`, and `@EnableAutoConfiguration` combined
   - `Class<?>[] exclude` -- `exclude` in `@EnableAutoConfiguration`

1. `@org.springframework.boot.autoconfigure.EnableAutoConfiguration` -- handle `@Enable<Technology>`
   ```java
   @Target(value=TYPE)
    @Inherited
    @AutoConfigurationPackage
    @Import(value=AutoConfigurationImportSelector.class)
   public @interface EnableAutoConfiguration
   ```
   - `AutoConfigurationImportSelector` uses classpath to find all the necessary configuration classes
     - `AutoConfigurationImportSelector::getCandidateConfigurations` looks for the `META-INF/spring.factories` defined in the `spring-boot-autoconfigure` jar, which defines all the auto-configuration classes needed
   - Disabling Specific Auto-configuration Classes
     ```java
     @Configuration
     @EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class})
     // or excludeName with fully qualified name
     public class MyConfiguration { }
     ```
     - also `spring.autoconfigure.exclude` property
     - `Class<?>[] exclude`
     - `String[] excludeName`

1. `SpringApplication` -- bootstrap and launch a Spring application from a Java main method, have control over the main `ApplicationContext`
   - run
     - `static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args)`  
       `static ConfigurableApplicationContext run(Class<?> primarySource, String... args)`
     - `ConfigurableApplicationContext run(String... args)`
   - builder style -- `org.springframework.boot.builder.SpringApplicationBuilder`
     ```java
     public static void main(String[] args) {
         new SpringApplicationBuilder()
             .bannerMode(Banner.Mode.OFF)
             .sources(SpringBootSimpleApplication.class)
             .run(args);
     }
     ```
   - tbd

1. `ApplicationArguments` -- `args` from `SpringApplication::run` are accessible for beans
   ```java
   @Component
   class MyComponent {
       private static final Logger log = LoggerFactory.getLogger(MyComponent.class);
       @Autowired
       public MyComponent(ApplicationArguments args) {
           boolean enable = args.containsOption("enable");
           if(enable)
           log.info("## > You are enabled!");
           List<String> _args = args.getNonOptionArgs();
           log.info("## > extra args ...");
           if(!_args.isEmpty())
           _args.forEach(file -> log.info(file));
       }
   }
   ```
   - `args` format
     - `--option_name=value`
     - `non_option_args1, non_option_args2`
   - pass `args` from CLI
     ```shell
     ./mvnw spring-boot:run -Dspring-boot.run.arguments="--enable"
     ```
   - pass `args` from JAR
     ```shell
     ./mvnw package
     java -jar spring-boot-simple-0.0.1-SNAPSHOT.jar --enable arg1 arg2
     ```

1. run code after `SpringApplication::run` -- `ApplicationRunner` and `CommandLineRunner`
   ```java
   @Bean
   CommandLineRunner myMethod() {
       return args -> {
           log.info("## > CommandLineRunner Implementation...");
           log.info("Accessing the Info bean: " + info);
           for(String arg:args)
           log.info(arg);
       };
   }
   ```

# JUnit 5

1. docs
   - [Overview (JUnit 5.0.1 API)](https://junit.org/junit5/docs/5.0.1/api/index.html)
   - [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

1. maven config for integration with spring
   ```XML
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-test</artifactId>
     <scope>test</scope>
     <exclusions>
       <exclusion>
         <groupId>junit</groupId>
         <artifactId>junit</artifactId>
       </exclusion>
     </exclusions>
   </dependency>
   <dependency>
       <groupId>org.junit.jupiter</groupId>
       <artifactId>junit-jupiter-engine</artifactId>
       <scope>test</scope>
   </dependency>
   ```

1. [Spring JUnit Jupiter Testing Annotations](https://docs.spring.io/spring/docs/5.1.9.RELEASE/spring-framework-reference/testing.html#integration-testing-annotations-junit-jupiter)
   - `@SpringJUnitConfig` -- extends JUnit Jupiter with Spring test framework (`@ExtendWith`) and configures `ApplicationContext` (`@ContextConfiguration`)
     ```java
     @ExtendWith(value=SpringExtension.class)
      @ContextConfiguration
      @Inherited
      @Target(value=TYPE)
     public @interface SpringJUnitConfig
     ```
     - `Class<?>[] value` -- Alias for `ContextConfiguration.classes()`, classes to use for loading an `ApplicationContext`
   - `@SpringJUnitWebConfig`
   - `@EnabledIf` -- signal that the annotated JUnit Jupiter test class or test method is enabled and should be run if the supplied `expression` evaluates to `true`
     - `expression` can be -- SpEL, `Environment` properties, text literals
   - `@DisabledIf`
   - `@SpringBootTest` -- works by creating the `ApplicationContext` used in your tests through `SpringApplication`, an alternative to `@SpringJUnitConfig`
     ```java
     @Target(value=TYPE)
      @Inherited
      @BootstrapWith(value=SpringBootTestContextBootstrapper.class)
      @ExtendWith(value=org.springframework.test.context.junit.jupiter.SpringExtension.class)
     public @interface SpringBootTest
     ```

1. other test related annotations in Spring
   - `@BootstrapWith`
   - `@ContextConfiguration`
   - `@ContextHierarchy`
   - `@ActiveProfiles`
   - `@TestPropertySource`
   - `@DirtiesContext`
   - `@WebAppConfiguration`
   - `@TestExecutionListeners`
   - `@Transactional`
   - `@BeforeTransaction`
   - `@AfterTransaction`
   - `@Commit`
   - `@Rollback`
   - `@Sql`
   - `@SqlConfig`
   - `@SqlGroup`

1. [JUnit Annotations](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations)
   - define a test method
     - `@Test` -- plain test method
     - `@RepeatedTest`
     - `@ParameterizedTest`
     - `@TestFactory`
   - test method name
     - `@DisplayName`
     - `@DisplayNameGeneration`
   - test instance lifecycle
     - `@TestInstance` -- configure the test instance lifecycle
       - `TestInstance.Lifecycle.PER_CLASS` -- a new test instance will be created once per test class
       - `TestInstance.Lifecycle.PER_METHOD` -- default, a new test instance will be created for each test method or test factory method
       - condition when `PER_METHOD` -- the test class will still be instantiated if a given test method is disabled via a condition (e.g., @Disabled, @DisabledOnOs, etc.)
     - `@BeforeAll` -- Denotes that the annotated method should be executed before all test methods
     - `@BeforeEach` -- the annotated method should be executed before each test method
     - `@AfterEach` -- Denotes that the annotated method should be executed after each test method
     - `@AfterAll` -- Denotes that the annotated method should be executed after all test methods

1. test console output
   ```java
   private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
   private final ByteArrayOutputStream errContent = new ByteArrayOutputStream();
   private final PrintStream originalOut = System.out;
   private final PrintStream originalErr = System.err;

   @BeforeEach
   public void setUpStreams() {
       System.setOut(new PrintStream(outContent));
       System.setErr(new PrintStream(errContent));
   }

   @AfterEach
   public void restoreStreams() {
       System.setOut(originalOut);
       System.setErr(originalErr);
   }
   ```

1. JUnit 4 example for comparaison
   ```java
   import static org.junit.Assert.*;
   import org.junit.Test;
   import org.junit.runner.RunWith;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.test.context.ContextConfiguration;
   import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
   @RunWith(SpringJUnit4ClassRunner.class)
   @ContextConfiguration(classes=CDPlayerConfig.class)
   public class CDPlayerTest {
       @Autowired
       private CompactDisc cd;
       @Test
       public void cdShouldNotBeNull() {
           assertNotNull(cd);
       }
   }
   ```
