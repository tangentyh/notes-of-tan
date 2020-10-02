# JVM
<!-- TODO -->

1. JVM in `System`
   - `static void exit(int status)`
   - `static void gc()` — run garbage collector
   - `static SecurityManager getSecurityManager()`
   - `static Channel inheritedChannel()` — the channel inherited from the entity that created this Java virtual machine
   - `static void load(String filename)`
   - `static void loadLibrary(String libname)`
   - `static String mapLibraryName(String libname)`
   - `static void runFinalization()`
   - `static void setSecurityManager(SecurityManager s)`

1. security manager — `SecurityManager`
   - usage — no security manager installed by default, use by `System::setSecurityManager`, or CLI option `-Djava.security.manager`
   - permission checking — `SecurityException`
   - security policy, `java.security.Policy` — code sources to permission sets, `java.security.Permission`
     - protection domain — tbd
     - policy files — tbd
       - system property — `java.security.policy`, double equals sign (`==`) to exclude other standard policy files
   - Java Authentication and Authorization Service (JAAS) — `javax.security.auth.login.LoginContext`, tbd
     - login policies
   - tbd

## Reference

1. `java.lang.ref.Reference`
   ```java
   public abstract class Reference<T>
   ```
   - `T get()`
   - `void clear()`
   - `boolean enqueue()` -- Adds this reference object to the queue with which it is registered, if any, by the program or by the garbage collector
   - `boolean isEnqueued()`
   - notification of changes in an object's reachability -- by registering an appropriate reference object with a reference queue at the time the reference object is created
   - package private constructor for override
     - `Reference(T referent)`
     - `Reference(T referent, ReferenceQueue<? super T> queue)` -- registered with the given queue
   - subclasses
     - `SoftReference`
     - `WeakReference`
     - `PhantomReference`

1. strong reference

1. `java.lang.ref.SoftReference<T>` -- cleared at the discretion of the garbage collector in response to memory demand, guaranteed to have been cleared before `OutOfMemoryError`
   - use -- for implementing memory-sensitive caches

1. `java.lang.ref.WeakReference<T>` — weak reference objects, which do not prevent their referents from being made finalizable, finalized, and then reclaimed; next GC
   - use -- weak references are for implementing canonicalizing mappings that do not prevent their keys (or values) from being reclaimed

1. `java.lang.ref.PhantomReference<T>` -- phantom references are not automatically cleared by GC as they are enqueued. An object that is reachable via phantom references will remain so until all such references are cleared or themselves become unreachable
   - use -- for scheduling pre-mortem cleanup actions in a more flexible way than is possible with the Java finalization mechanism
   - `get()` -- always return `null` to ensure that a reclaimable object remains so

1. `java.lang.ref.ReferenceQueue<T>` -- to which registered reference objects are appended by GC, at the same time or at some later time after the appropriate reachability changes are detected
   - `Reference<? extends T> poll()` -- non-block
   - `Reference<? extends T> remove()` -- block
   - `Reference<? extends T> remove(long timeout)`

## Class Loading

1. class loading
   - class loading process — only classes needed for execution loaded, using the class loader of the method caller
     - load main program from disk or web
     - resolving — load fields or superclasses of another class type of the main program class
     - load classes required as the `main` method executes
   - class loaders
     - The bootstrap class loader — loads the system classes (typically, from the JAR file `rt.jar`, modules from JDK 9)
       - usually implemented in C — as an integral part of the virtual machine, no `ClassLoader` object involved, `String.class.getClassLoader()` is `null`
     - The extension class loader — loads “standard extensions” from the `jre/lib/ext` directory, the loader does not use the class path
       - no more `jre/lib/ext` from JDK 9 — The javac compiler and java launcher will exit if the `java.ext.dirs` system property is set, or if the `lib/ext` directory exists
       - the platform class loader — the extension class loader is retained from JDK 9 and is specified as the platform class loader, see `ClassLoader::getPlatformClassLoader`
     - The system class loader (jdk internal `AppClassLoader`) — loads the application classes
   - class loader hierarchy
     - cosmic root — the bootstrap class loader
     - parents first — load only if the parent has failed
     - default parent when constructing `ClassLoader` — system class loader
   - break parents first
     - use customized `ClassLoader` -- overloading `ClassLoader::loadClass`
     - use SPI -- `Thread::getContextClassLoader` under the hood, so built-in classes can use user classes
     - OSGi hot deployment
     - module from JDK 9 -- defaults to using the class loader of the module if in a module
   - context class loader — each thread has a reference to a class loader
     - `Thread::getContextClassLoader`, `Thread::setContextClassLoader`
     - class loader inversion — the phenomenon when loading classes programmatically, classes to load are not visible to default class loaders, can be solved by using context class loader
   - class loaders as namespaces — in JVM, a class is determined by its full name **and** the class loader
     - useful for loading code from multiple sources, hot deployment etc.
   - bytecode verification — bytecode, except system classes, verified for safety before loaded into JVM
     - turn off on CLI — `-noverify` (or `-Xverify:none`)

1. `ClassLoader`
   ```java
   public abstract class ClassLoader extends Object
   ```
   - creation
     - `Class::getClassLoader`
   - assertion
     - `void clearAssertionStatus()`
     - `void setClassAssertionStatus(String className, boolean enabled)`
     - `void setDefaultAssertionStatus(boolean enabled)`
     - `void setPackageAssertionStatus(String packageName, boolean enabled)`
   - load classes
     - `protected Class<?> loadClass(String name, boolean resolve)` — Loads the class with the specified binary name, in below order
       1. `protected final Class<?> findLoadedClass(String name)`
       1. `loadClass` of the parent class loader or the build-in JVM class loader if the parent is `null`
       1. `protected Class<?> findClass​(String name)` — for overloading with own implementation
     - `protected final Class<?> defineClass(...)` — convert bytes to classes, typically used by `findClass`

1. `java.net.URLClassLoader`
   ```java
   public class URLClassLoader
   extends SecureClassLoader
   implements Closeable
   ```
   - example usage
     ```java
     URL url = new URL("file:///path/to/plugin.jar");
     URLClassLoader pluginLoader = new URLClassLoader(new URL[] { url });
     Class<?> cl = pluginLoader.loadClass("mypackage.MyClass");
     ```
