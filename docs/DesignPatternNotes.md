# Design Patterns

1. categorization
   - by purpose
     - creational
     - structural
     - behavioral
   - by scope
     - class -- relationships between classes and their subclasses
     - object

1. index
   - [creational](#Creational)
     - class -- Factory Method
     - object -- Abstract Factory, Builder, Prototype, Singleton
   - [structural](#Structural)
     - class and object -- Adapter
     - object -- Bridge, Composite, Decorator, Facade, Flyweight, Proxy
   - [behavioral](#Behavioral)
     - class -- Interpreter, Template Method
     - object -- Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Visitor

1. inheritance and composition
   - inheritance -- white-box reuse
   - composition -- black-box reuse, forwarding requests with a reference to the original object
     - delegation -- State, Strategy, Visitor patterns and some more conditionally

1. object aggregation and acquaintance
   - aggregation -- one object owns or is responsible for another object
   - acquaintance -- an object merely knows of another object

## Creational

Creational design patterns abstract the instantiation process, They help make a system independent of how its objects are created, composed, and represented.

1. Singleton
   - double lock
     ```java
     public class Singleton {
         private volatile static Singleton uniqueInstance;
         private Singleton() { }
         public static Singleton getUniqueInstance() {
             if (uniqueInstance == null) {
                 synchronized (Singleton.class) {
                     if (uniqueInstance == null) {
                         uniqueInstance = new Singleton();
                     }
                 }
             }
             return uniqueInstance;
         }
     }
     ```
   - static inner class
     ```java
     public class Singleton {
         private Singleton() { }
         private static class SingletonHolder {
             private static final Singleton INSTANCE = new Singleton();
         }
         public static Singleton getUniqueInstance() {
             return SingletonHolder.INSTANCE;
         }
     }
     ```
   - as an enum -- prevent reflection attack; no duplicates after serialization and de-serialization
   - examples -- beans, loggers, `Runtime::getRuntime`, `System::getSecurityManager`

1. factory
   - Abstract Factory -- provide an interface for creating families of related or dependent objects without specifying their concrete classes
     ```java
     public abstract class AbstractFactory {
         abstract AbstractProductA createProductA();
         abstract AbstractProductB createProductB();
     }
     ```
     - Factory Method for each
   - Factory Method -- define an interface for creating an object, but let subclasses decide which class to instantiate; lets a class defer instantiation to subclasses
     ```java
     public abstract class Factory {
         abstract public Product factoryMethod();
         public void doSomething() {
             Product product = factoryMethod();
             // do something with the product
         }
     }
     ```
     - examples -- `java.util.concurrent.ThreadFactory`, `org.springframework.beans.factory.BeanFactory`, `java.net.SocketImplFactory`
   - Simple Factory -- 把实例化的操作单独放到一个类中，这个类就成为简单工厂类，让简单工厂类来决定应该用哪个具体子类来实例化; in some literature there is no Simple Factory, but the definition of Factory Method is expanded
     ```java
     public class SimpleFactory {
         public Product createProduct(int type) {
             if (type == 1) {
                 return new ConcreteProduct1();
             } else if (type == 2) {
                 return new ConcreteProduct2();
             }
             return new ConcreteProduct();
         }
     }
     ```
     - examples -- `java.util.EnumSet`, `java.util.ResourceBundle`, `java.text.NumberFormat`, `java.nio.charset.Charset`, `org.springframework.aop.framework.ProxyFactory`, `React.createElement`

1. Builder -- separate the construction of a complex object from its representation so that the same construction process can create different representations
   - examples -- Spring security, `StringBuilder`, `java.nio.ByteBuffer`, `Appendable`, `java.util.stream.Stream.Builder`

1. Prototype -- specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype
   - examples -- `Object::clone`, JavaScript prototype

## Structural

Structural patterns are concerned with how classes and objects are composed to form larger structures.

1. Adapter -- convert the interface of a class into another interface clients expect
   - examples -- `java.util.Collections::asLifoQueue`, `java.io.InputStreamReader`, `java.io.OutputStreamWriter`, `java.util.Arrays::asList`

1. Bridge -- decouple an abstraction from its implementation so that the two can vary independently
   ```java
   public abstract class Abstraction {
       protected AbstractionImpl impl;
       public Abstraction(AbstractionImpl impl) {
           this.impl = impl;
       }
       public abstract void operation(); // do something with impl
   }
   ```
   - examples -- JDBC, `java.net.Socket` and `java.net.SocketImpl`

1. Composite -- Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.
   ```java
   public class Composite extends Component {
       private List<Component> child;
       public Composite(String name) {
           super(name);
           child = new ArrayList<>();
       }
       @Override
       public void operation() { /* ... */ }
       @Override
       public void add(Component component) {
           child.add(component);
       }
       @Override
       public void remove(Component component) {
           child.remove(component);
       }
   }
   ```
   - examples -- `React.Fragment`

1. Decorator -- Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.
   - examples -- `@` in Python and TypeScript, `java.io.FilterInputStream`, `java.io.FilterOutputStream`, `java.io.FilterReader`, `java.io.FilterWriter`, some views in `java.util.Collections`

1. Facade -- Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.
   - example -- Compiler: Scanner, Parser, ProgramNode, BytecodeStream, and ProgramNodeBuilder

1. Flyweight -- Use sharing to support large numbers of fine-grained objects efficiently, where intrinsic states are immutable but extrinsic states can vary
   - examples -- `Integer::valueOf`, also on `Boolean`, `Byte`, `Character`, `Short`, `Long` and `BigDecimal`

1. Proxy -- Provide a surrogate or placeholder for another object to control access to it.
   - taxonomy
     - remote proxy -- provides a local representative for an object in a different address space
     - virtual proxy -- creates expensive objects on demand, like `@org.springframework.context.annotation.Lazy`
     - protection proxy -- controls access to the original object
     - smart reference -- a replacement for a bare pointer that performs additional actions when an object is accessed; for example, counting the number of references to the real object so that it can be freed automatically when there are no more references (also called smart pointers)
   - examples -- `java.lang.reflect.Proxy`, Spring AOP, `java.rmi.*`

## Behavioral

 Behavioral patterns are concerned with algorithms and the assignment of responsibilities between objects. Behavioral patterns describe not just patterns of objects or classes but also the patterns of communication between them. These patterns characterize complex control flow that's difficult to follow at run-time. They shift your focus away from flow of control to let you concentrate just on the way objects are interconnected.

1. Chain of Responsibility -- Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.
   - examples -- `javax.servlet.Filter::doFilter`, `java.util.logging.Logger::log`

1. Command -- Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.
   ```java
   public interface Command {
       void execute();
   }
   ```
   - use
     - callback -- Commands are an object-oriented replacement for callbacks
     - specify, queue, and execute requests at different times
     - support undo, redo -- store states and add an undo operation to the Command interface; for unlimited-level undo and redo, store executed commands in a history list
     - support logging -- for durability, similar to undo and redo
   - examples -- `Runnable`, Netflix Hystrix, lambda

1. Interpreter -- Given a language, define a represention for its grammar along with an interpreter that uses the representation to interpret sentences in the language.
   - examples -- `java.util.Pattern`, `java.text.Format` subclasses (Context is not `String`), SpEL

1. Iterator -- Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.
   - examples -- `java.util.Iterator` (also `java.util.Scanner`), `java.util.Enumeration`

1. Mediator -- Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.
   ```java
   public class Client {
       public static void main(String[] args) {
           Alarm alarm = new Alarm();
           CoffeePot coffeePot = new CoffeePot();
           Calender calender = new Calender();
           Sprinkler sprinkler = new Sprinkler();
           Mediator mediator = new ConcreteMediator(alarm, coffeePot, calender, sprinkler);
           alarm.onEvent(mediator);
       }
   }
   ```
   - examples
     - `java.util.Timer` (all `scheduleXXX()` methods)
     - `java.util.concurrent.Executor::execute`
     - `java.util.concurrent.ExecutorService` (the `invokeXXX()` and `submit()` methods)
     - `java.util.concurrent.ScheduledExecutorService` (all `scheduleXXX()` methods)
     - `java.lang.reflect.Method::invoke`

1. Memento -- Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.
   ```java
   public interface Originator {
     Memento createMemento();
     void setMemento(Memento memo);
   }
   public interface Memento {
     State getState();
     void setState();
   }
   ```
   - examples -- `java.io.Serializable`

1. Observer -- Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
   - examples -- `java.util.Observer`, `java.util.Observable`, `java.util.EventListener`, [RxJava](https://github.com/ReactiveX/RxJava)

1. State -- Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.
   ```java
   public interface State {
     void handle();
   }
   ```
   - example
     ```java
     public class TCPConnection {
       private TCPState state;
       // ...
     }
     public class TCPEstablished implements TCPState {}
     public class TCPListen implements TCPState {}
     public class TCPClosed implements TCPState {}
     ```

1. Strategy -- Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.
   ```java
   public class Context<T> {
     private T strategy;
     public void operation() { strategy.doAlgorithm(); }
   }
   ```
   - examples -- `javax.servlet.http.HttpServlet::service`, `java.security.MessageDigest::digest`

1. Template Method -- Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.
   - examples
     - all non-abstract methods of `java.io.InputStream`, `java.io.OutputStream`, `java.io.Reader` and `java.io.Writer`
     - default methods in collection interfaces and all non-abstract methods in collection companion classes
       - `LinkedHashMap::afterNodeRemoval`, `LinkedHashMap::afterNodeInsertion`, `LinkedHashMap::afterNodeAccess` overrides those in `HashMap`
     - React Lifecycle methods

1. Visitor -- Represent an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates.
   - examples
     - `javax.lang.model.element.AnnotationValue` and `javax.lang.model.element.AnnotationValueVisitor`
     - `javax.lang.model.element.Element` and `javax.lang.model.element.ElementVisitor`
     - `javax.lang.model.type.TypeMirror` and `javax.lang.model.type.TypeVisitor`
     - `java.nio.file.Files::walkFileTree` and `java.nio.file.FileVisitor`
     - `org.springframework.asm.ClassVisitor`, `org.springframework.asm.FieldVisitor`, `org.springframework.asm.MethodVisitor`, `org.springframework.asm.ModuleVisitor`, `org.springframework.asm.AnnotationVisitor`

1. 空对象 -- 使用什么都不做的空对象来代替 `null`。
