# Miscellanea

1. JSX
   ```ts
   type JSXElementConstructor<P> =
       | ((props: P) => ReactElement | null)
       | (new (props: P) => Component<P, any>);
   type Key = string | number;
   interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
       type: T;
       props: P;
       key: Key | null;
   }
   type ReactText = string | number;
   type ReactChild = ReactElement | ReactText;
   interface ReactNodeArray extends Array<ReactNode> {}
   type ReactFragment = {} | ReactNodeArray;
   interface ReactPortal extends ReactElement {
       key: Key | null;
       children: ReactNode;
   }
   type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
   ```
   - JSX prevents XSS — React DOM escapes any values embedded in JSX before rendering them
   - string literals in JSX — JSX removes whitespace at the beginning and ending of a line. It also removes blank lines. New lines adjacent to tags are removed; new lines that occur in the middle of string literals are condensed into a single space.
   - Booleans, Null, and Undefined Are Ignored

1. DOM Attributes
   - all DOM properties and attributes (including event handlers) should be camelCased
   - `checked`, `defaultChecked` for controlled and uncontrolled components, respectively
   - `className`
   - `dangerouslySetInnerHTML: {__html: string}` — `innerHTML`, XSS exploitable
   - `htmlFor` — `for`
   - `onChange` — similar to `input` event, not `change` event
   - vender prefix — begin with capital letter except `ms`
   - React will automatically append a “px” suffix to certain numeric inline style properties
   - `suppressContentEditableWarning` — Normally, there is a warning when an element with children is also marked as `contentEditable`, because it won’t work
   - `suppressHydrationWarning` — mismatches when `hydrate`
   - other HTML attributes
   - You may also use custom attributes as long as they’re fully lowercase

1. Functions, or anything as Children
   ```jsx
   function Repeat(props) {
     let items = [];
     for (let i = 0; i < props.numTimes; i++) {
       items.push(props.children(i));
     }
     return <div>{items}</div>;
   }
   function ListOfTenThings() {
     return (
       <Repeat numTimes={10}>
         {(index) => <div key={index}>This is item {index} in the list</div>}
       </Repeat>
     );
   }
   ```

1. All React components must act like pure functions with respect to their props.

1. Returning null from a component’s render method does not affect the firing of the component’s lifecycle methods

1. Specifying the value prop on a controlled component prevents the user from changing the input unless you desire so

1. side effects
   - data fetching, subscriptions, or manually changing the DOM from React components before
   - Mutations, subscriptions, timers, logging

1. HOC
   - Wrap the Display Name for Easy Debugging
     ```js
     function withSubscription(WrappedComponent) {
       class WithSubscription extends React.Component {/* ... */}
       WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
       return WithSubscription;
     }
     function getDisplayName(WrappedComponent) {
       return WrappedComponent.displayName || WrappedComponent.name || 'Component';
     }
     ```
   - Don’t Use HOCs Inside the render Method — negative impact on diff
   - (non-react) Static Methods Must Be Copied Over — or lost in the returned new component
   - refs are not passed through — `ref` is not really a prop — like `key`, it’s handled specially by React

1. SCU
   - not mutating data to avoid SCU not working correctly
   - [Immutable.js](https://github.com/facebook/immutable-js)

1. Web Components use “class” instead of “className”

1. Environment Requirements
   - React 16 depends on the collection types `Map` and `Set`
   - a global polyfill in your bundled application, such as core-js or babel-polyfill

# Accessibility

tbd

# Context

1. Context
   - some data needs to be accessible by many components at different nesting levels
   - alternative
     - component composition
     - pass component as prop
     - render props

1. `React.createContext`
   ```typescript
   interface Context<T> {
       Provider: Provider<T>;
       Consumer: Consumer<T>;
       displayName?: string;
   }
   function createContext<T>(
       defaultValue: T,
       calculateChangedBits?: (prev: T, next: T) => number
   ): Context<T>;
   ```
   - `defaultValue` — only used when a component does not have a matching `Provider` above it in the tree

1. `Context.Provider` — allows consuming components to subscribe to context changes
   ```ts
   type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
   interface ProviderProps<T> {
       value: T;
       children?: ReactNode;
   }
   ```
   - One Provider can be connected to many consumers
   - Providers can be nested to override values deeper within the tree
   - consumers that are descendants of a Provider will re-render on `value` change
     - not subject to the `shouldComponentUpdate` method
     - diff by `Object.is()` equivalent — do not write an object literal in JSX

1. `Component.contextType`
   ```ts
   type ContextType<C extends Context<any>> = C extends Context<infer T> ? T : never;
   class Component<P, S> {
        static contextType?: Context<any>;
   }
   ```
   - usage — assign with a context lets you consume the nearest current value of that Context type using `this.context`
     ```ts
     class Foo extends React.Component<P, S> {
         static contextType = Ctx
         context!: React.ContextType<typeof Ctx>
     }
     ```

1. `Context.Consumer` — lets you subscribe to a context within a function component
   ```ts
   type Consumer<T> = ExoticComponent<ConsumerProps<T>>;
   interface ConsumerProps<T> {
       children: (value: T) => ReactNode;
       unstable_observedBits?: number;
   }
   ```
   - function as child
   - Consuming Multiple Contexts
     ```JSX
     function Content() {
       return (
         <ThemeContext.Consumer>
           {theme => (
             <UserContext.Consumer>
               {user => (
                 <ProfilePage user={user} theme={theme} />
               )}
             </UserContext.Consumer>
           )}
         </ThemeContext.Consumer>
       );
     }
     ```

# Code Splitting

1. `import()`

1. `React.lazy()`
   ```ts
   function lazy<T extends ComponentType<any>>(
       factory: () => Promise<{ default: T }>
   ): LazyExoticComponent<T>;
   interface LazyExoticComponent<T extends ComponentType<any>> extends ExoticComponent<ComponentPropsWithRef<T>> {
       readonly _result: T;
   }
   ```
   - not yet for SSR
   - requires that there’s a `<React.Suspense>` component higher in the rendering tree

1. `React.Suspense`
   ```ts
   const Suspense: ExoticComponent<SuspenseProps>;
   interface SuspenseProps {
       children?: ReactNode;
       /** A fallback react tree to show when a Suspense child (like React.lazy) suspends */
       fallback: NonNullable<ReactNode>|null;
       // I tried looking at the code but I have no idea what it does.
       // https://github.com/facebook/react/issues/13206#issuecomment-432489986
       /**
        * Not implemented yet, requires unstable_ConcurrentMode
        */
       // maxDuration?: number;
   }
   ```
   - not yet for SSR

1. error boundary — handler when other modules fails to load

1. usage
   - router based code splitting
     ```jsx
     import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
     import React, { Suspense, lazy } from 'react';
     const Home = lazy(() => import('./routes/Home'));
     const About = lazy(() => import('./routes/About'));
     const App = () => (
       <Router>
         <Suspense fallback={<div>Loading...</div>}>
           <Switch>
             <Route exact path="/" component={Home}/>
             <Route path="/about" component={About}/>
           </Switch>
         </Suspense>
       </Router>
     );
     ```
   - named export — intermediate module reexport

# Error Boundaries

1. Error Boundaries
   - catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them
     - log those errors, and display a fallback UI
   - don’t try to use them for control flow.
   - do not catch errors for:
     - Event handlers
     - Asynchronous code (e.g. `setTimeout` or `requestAnimationFrame` callbacks)
     - Server side rendering
     - Errors thrown in the error boundary itself (rather than its children)
   - uncaught error — result in unmounting of the whole React component tree
   - filenames and line numbers in the component stack trace — [Babel plugin](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source)
     - depends on `Function.name`, may need polyfill, or use `React.Component.displayName`

1. `getDerivedStateFromError` and `componentDidCatch`
   - A class component becomes an error boundary if it defines either (or both) of the lifecycle methods `static getDerivedStateFromError()` or `componentDidCatch()`
   - In the event of an error, you can render a fallback UI with `componentDidCatch()` by calling setState, but this will be deprecated in a future release. Use `static getDerivedStateFromError()` to handle fallback rendering instead.

1. example
   ```jsx
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false };
     }

     static getDerivedStateFromError(error) {
       // Update state so the next render will show the fallback UI.
       return { hasError: true };
     }

     componentDidCatch(error, info) {
       // You can also log the error to an error reporting service
       logErrorToMyService(error, info);
     }

     render() {
       if (this.state.hasError) {
         // You can render any custom fallback UI
         return <h1>Something went wrong.</h1>;
       }

       return this.props.children;
     }
   }
   ```

# Refs, Forwarding Refs

1. Ref forwarding
   - alternative — explicitly pass a ref as a differently named prop
   - an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child
   - useful in two scenarios:
     - Forwarding refs to DOM components
     - Forwarding refs in higher-order-components
   - example
     ```jsx
     const FancyButton = React.forwardRef((props, ref) => (
       <button ref={ref} className="FancyButton">
         {props.children}
       </button>
     ));
     // You can now get a ref directly to the DOM button:
     const ref = React.createRef();
     <FancyButton ref={ref}>Click me!</FancyButton>;
     // access by ref.current
     ```

1. `React.forwardRef`
   ```ts
   function forwardRef<T, P = {}>(Component: RefForwardingComponent<T, P>)
       : ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
   interface RefForwardingComponent<T, P = {}> {
       (props: PropsWithChildren<P>, ref: Ref<T>): ReactElement | null;
       propTypes?: WeakValidationMap<P>;
       contextTypes?: ValidationMap<any>;
       defaultProps?: Partial<P>;
       displayName?: string;
   }
   interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
       defaultProps?: Partial<P>;
   }
   interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
       displayName?: string;
   }
   ```

1. `React.createRef`
   ```ts
   function createRef<T>(): RefObject<T>;
   interface RefObject<T> {
       readonly current: T | null;
   }
   ```
   - `RefObject.current` — DOM element or component instance
   - may not use the `ref` attribute on function components

1. `ReactDOM.findDOMNode()`
   ```ts
   function findDOMNode(instance: ReactInstance | null | undefined): Element | null | Text;
   ```
   - an escape hatch used to access the underlying DOM node, deprecated in `StrictMode`
   - In most cases, you can attach a ref to the DOM node and avoid using findDOMNode at all.
   - a component may return a fragment with multiple children, in which case `findDOMNode` will return the DOM node corresponding to the first non-empty child
   - cannot be used on function components.
   - an exception will be thrown if called on a component that has not been mounted yet

1. callback ref
   ```jsx
   class CustomTextInput extends React.Component {
     constructor(props) {
       super(props);
       this.textInput = null;
       this.setTextInputRef = element => {
         this.textInput = element;
       };
       this.focusTextInput = () => {
         if (this.textInput) this.textInput.focus();
       };
     }
     componentDidMount() {
       // autofocus the input on mount
       this.focusTextInput();
     }
     render() {
       // Use the `ref` callback to store a reference to the text input DOM
       // element in an instance field (for example, this.textInput).
       return (
         <div>
           <input type="text" ref={this.setTextInputRef} />
           <input type="button" value="Focus the text input" onClick={this.focusTextInput} />
         </div>
       );
     }
   }
   ```

1. uncontrolled element
   - `defaultValue` prop for `<input>` like, `defaultChecked` for `<input type="checkbox">` like
     - `value` and `checked` for controlled counterparts
   - an `<input type="file" />` is always an uncontrolled component

# Portals

1. Portals — a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component
   - An event fired from inside a portal will propagate to ancestors in the containing React tree, even if those elements are not ancestors in the DOM tree

1. `ReactDOM.createPortal`
   ```ts
   function createPortal(children: ReactNode, container: Element, key?: null | string): ReactPortal;
   ```

# Fragment

1. return an array
   ```jsx
   render() {
    return [
     "Some text.",
     <h2 key="heading-1">A heading</h2>,
     "More text.",
     <h2 key="heading-2">Another heading</h2>,
     "Even more text."
    ];
   }
   ```
   - 每个子元素需要使用逗号分隔
   - 数组的每一项必须要有 key 值，否则会产生警告
   - 字符串必须使用引号

1. `React.Fragment`
   ```ts
   const Fragment: ExoticComponent<{ children?: ReactNode }>;
   // TODO: similar to how Fragment is actually a symbol, the values returned from createContext,
   // forwardRef and memo are actually objects that are treated specially by the renderer; see:
   // https://github.com/facebook/react/blob/v16.6.0/packages/react/src/ReactContext.js#L35-L48
   // https://github.com/facebook/react/blob/v16.6.0/packages/react/src/forwardRef.js#L42-L45
   // https://github.com/facebook/react/blob/v16.6.0/packages/react/src/memo.js#L27-L31
   // However, we have no way of telling the JSX parser that it's a JSX element type or its props other than
   // by pretending to be a normal component.
   //
   // We don't just use ComponentType or SFC types because you are not supposed to attach statics to this
   // object, but rather to the original function.
   interface ExoticComponent<P = {}> {
       /**
        * **NOTE**: Exotic components are not callable.
        */
       (props: P): (ReactElement|null);
       readonly $$typeof: symbol;
   }
   ```

# Strict Mode

1. Strict Mode
   - does not render any visible UI. It activates additional checks and warnings for its descendants
   - do not impact the production build

1. help with
   - Identifying components with unsafe lifecycles
   - Warning about legacy string ref API usage
   - Warning about deprecated findDOMNode usage
   - Detecting unexpected side effects
     - [doc](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)
     - intentionally double-invoking some methods to detect side effects
   - Detecting legacy context API

1. `React.StrictMode`
   ```ts
   const StrictMode: ExoticComponent<{ children?: ReactNode }>;
   ```

# API

## Component, memo

1. function component
   ```ts
   type FC<P = {}> = FunctionComponent<P>;
   type PropsWithChildren<P> = P & { children?: ReactNode };
   interface FunctionComponent<P = {}> {
       (props: PropsWithChildren<P>, context?: any): ReactElement | null;
       propTypes?: WeakValidationMap<P>;
       contextTypes?: ValidationMap<any>;
       defaultProps?: Partial<P>;
       displayName?: string;
   }
   ```
   - not stateless (SFC) — as of recent React versions, function components can no longer be considered 'stateless': [React Hooks](https://reactjs.org/docs/hooks-intro.html)

1. `React.Component`
   ```ts
   interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> { }
   class Component<P, S> {
       static contextType?: Context<any>;
       constructor(props: Readonly<P>);
       setState<K extends keyof S>(
           state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
           callback?: () => void
       ): void;
       forceUpdate(callBack?: () => void): void;
       render(): ReactNode;
       readonly props: Readonly<P> & Readonly<{ children?: ReactNode }>;
       state: Readonly<S>;
   }
   interface ComponentClass<P = {}, S = any> extends StaticLifecycle<P, S> {
       new (props: P, context?: any): Component<P, S>;
       propTypes?: WeakValidationMap<P>;
       contextType?: Context<any>;
       contextTypes?: ValidationMap<any>;
       childContextTypes?: ValidationMap<any>;
       defaultProps?: Partial<P>;
       displayName?: string;
   }
   ```
   - `ComponentClass` — return type of HOCs or type of class expression

1. `React.PureComponent`
   ```ts
   class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> { }
   ```
   - implements SCU with a shallow prop and state comparison

1. optional lifecycle
   ```ts
   interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {
       componentDidMount?(): void;
       shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
       componentWillUnmount?(): void;
       componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
   }
   interface NewLifecycle<P, S, SS> {
       getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null;
       componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
   }
   interface StaticLifecycle<P, S> {
       getDerivedStateFromProps?: GetDerivedStateFromProps<P, S>;
       getDerivedStateFromError?: GetDerivedStateFromError<P, S>;
   }
   type GetDerivedStateFromProps<P, S> =
       (nextProps: Readonly<P>, prevState: S) => Partial<S> | null;
   type GetDerivedStateFromError<P, S> =
       (error: any) => Partial<S> | null;
   ```
   - [the lifecycle diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
   - `getDerivedStateFromProps` — for rare use cases where the state depends on changes in props over time
     - If you need to perform a side effect (for example, data fetching or an animation) in response to a change in props, use `componentDidUpdate` lifecycle instead.
     - If you want to re-compute some data only when a prop changes, use a memoization helper instead.
     - If you want to “reset” some state when a prop changes, consider either making a component fully controlled or fully uncontrolled with a key instead.
   - `getSnapshotBeforeUpdate` — enables your component to capture some information from the DOM (e.g. scroll position) before it is potentially changed

1. `React.memo` — HOC similar to `React.PureComponent` but for function components
   ```ts
   // will show `Memo(${Component.displayName || Component.name})` in devtools by default,
   // but can be given its own specific name
   interface MemoExoticComponent<T extends ComponentType<any>> extends NamedExoticComponent<ComponentPropsWithRef<T>> {
       readonly type: T;
   }
   type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
   function memo<P extends object>(
       Component: FC<P>,
       propsAreEqual?: (prevProps: Readonly<PropsWithChildren<P>>, nextProps: Readonly<PropsWithChildren<P>>) => boolean
   ): NamedExoticComponent<P>;
   function memo<T extends ComponentType<any>>(
       Component: T,
       propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean
   ): MemoExoticComponent<T>;
   ```
   - for a performance boost in some cases by memoizing the result
     - This means that React will skip rendering the component, and reuse the last rendered result.
   - By default it will only shallowly compare complex objects in the props object

## Create Element

1. `React.createElement`
   ```ts
   function createElement<P extends DOMAttributes<T>, T extends Element>(
       type: string,
       props?: ClassAttributes<T> & P | null,
       ...children: ReactNode[]): DOMElement<P, T>;
   function createElement<P extends {}>(
       type: FunctionComponent<P> | ComponentClass<P> | string,
       props?: Attributes & P | null,
       ...children: ReactNode[]): ReactElement<P>;
   interface ClassAttributes<T> extends Attributes {
       ref?: LegacyRef<T>;
   }
   interface Attributes {
       key?: Key;
   }
   type LegacyRef<T> = string | Ref<T>;
   ```

1. `React.createFactory` — legacy helper

## Transform Element

1. `React.cloneElement`
   ```ts
   function cloneElement<P>(
       element: ReactElement<P>,
       props?: Partial<P> & Attributes,
       ...children: ReactNode[]): ReactElement<P>;
   ```
   - the original element’s props with the new props merged in shallowly
   - New children will replace existing children
   - `key` and `ref` from the original element will be preserved.
     ```jsx
     // almost equivalent but not ref
     <element.type {...element.props} {...props}>{children}</element.type>
     ```

1. `React.isValidChildren`
   ```ts
   function isValidElement<P>(object: {} | null | undefined): object is ReactElement<P>;
   ```

1. `React.Children` — utilities for dealing with the `this.props.children` opaque data structure
   ```ts
   const Children: ReactChildren;
   interface ReactChildren {
       map<T, C>(children: C | C[], fn: (child: C, index: number) => T): T[];
       forEach<C>(children: C | C[], fn: (child: C, index: number) => void): void;
       count(children: any): number;
       only<C>(children: C): C extends any[] ? never : C;
       toArray<C>(children: C | C[]): C[];
   }
   ```
   - `React.Children.only` throws an error when `never`
   - `React.Children.toArray` — Returns the children opaque data structure as a flat array with keys assigned to each child.
     - prefixes each key in the returned array so that each element’s key is scoped to the input array containing it

# Hooks

## Concepts

1. hooks
   - use state and other React features without writing a class
     - Classes present issues for today’s tools, too. For example, classes don’t minify very well, and they make hot reloading flaky and unreliable.
   - With Hooks, you can extract stateful logic from a component
   - Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data)
   - [plain implementation](https://zhuanlan.zhihu.com/p/50358654)
     - relies on the order in which Hooks are called
   - `use` prefix — only created the first time called, return current ones afterwards
   - [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
   - no Hook equivalents to the uncommon `getSnapshotBeforeUpdate` and `componentDidCatch` lifecycles yet

1. rules
   - Only Call Hooks at the Top Level — always use Hooks at the top level of your React function
     - put condition inside hooks
   - only Call Hooks from React function components and custom hooks

1. custom hooks
   - a JavaScript function whose name starts with ”use” and that may call other Hooks
   - do not have a specific signature, can pass information as the return value
   - the extract of common patterns

## Basic Hooks

1. type definations
   ```ts
   // Unlike the class component setState, the updates are not allowed to be partial
   type SetStateAction<S> = S | ((prevState: S) => S);
   // this technically does accept a second argument, but it's already under a deprecation warning
   // and it's not even released so probably better to not define it.
   type Dispatch<A> = (value: A) => void;
   ```

1. `React.useState()`
   ```ts
   function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
   function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
   ```
   - unlike `this.setState` in a class, updating a state variable always replaces it instead of merging it
   - use multiple times for multiple states
   - If you update a State Hook to the same value as the current state, React will bail out without rendering the children or firing effects. (React uses the `Object.is` comparison algorithm.)
   - `getDerivedStateFromProps` — store previous props in state

1. `React.useEffect()` — perform side effects in function components
   ```ts
   // NOTE: callbacks are _only_ allowed to return either void, or a destructor.
   // The destructor is itself only allowed to return void.
   type EffectCallback = () => (void | (() => void | undefined));
   // The identity check is done with the SameValue algorithm (Object.is), which is stricter than ===
   // TODO (TypeScript 3.0): ReadonlyArray<unknown>
   type DependencyList = ReadonlyArray<any>;
   function useEffect(effect: EffectCallback, deps?: DependencyList): void;
   ```
   - you can think of useEffect Hook as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined
     - component needs to do something after render
   - every render a new `EffectCallback` is passed, letting the closure of up-to-date states
   - Unlike `componentDidMount` or `componentDidUpdate`, effects scheduled with `useEffect` don’t block the browser from updating the screen
     - although deferred until after the browser has painted, it’s guaranteed to fire before any new renders
     - use `React.useLayoutEffect()` for synchronous effects
   - Run on Each Update, performs the cleanup when the component unmounts
     - if a component renders multiple times (as they typically do), the previous effect is cleaned up before executing the next effect
   - will apply every effect used by the component, in the order they were specified.
   - `DependencyList` — perform effect only when any value of this list change (`===`) between renders
     - mount and unmount only effects — pass `[]` as `deps`
     - `Dispatch` returned by `useEffect`, `useReducer` is guaranteed to be stable so it’s safe to omit
   - ways of use of function in `EffectCallback`
     - move the function inside `EffectCallback`, with `deps` updated to the function
     - move the function outside component, `deps` irrelevant of the function
     - call the function outside `EffectCallback`, and make the effect depend on the returned value
     - add a function to `deps` but wrap its definition into the `useCallback` Hook

1. `React.useContext()`
   ```ts
   function useContext<T>(context: Context<T>/*, (not public API) observedBits?: number|boolean */): T;
   ```
   - always re-render when the context value changes
   - works as `static contextType = MyContext` in a class, or to `<MyContext.Consumer>`

## Additional Hooks

1. `React.useReducer()` — alternative to `useState`
   ```ts
   // Unlike redux, the actions _can_ be anything
   type Reducer<S, A> = (prevState: S, action: A) => S;
   // types used to try and prevent the compiler from reducing S
   // to a supertype common with the second argument to useReducer()
   type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
   type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
   function useReducer<R extends Reducer<any, any>, I>(
       reducer: R,
       initializerArg: I & ReducerState<R>,
       initializer: (arg: I & ReducerState<R>) => ReducerState<R>
   ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
   function useReducer<R extends Reducer<any, any>, I>(
       reducer: R,
       initializerArg: I,
       initializer: (arg: I) => ReducerState<R>
   ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
   function useReducer<R extends Reducer<any, any>>(
       reducer: R,
       initialState: ReducerState<R>,
       initializer?: undefined
   ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
   ```
   - preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one
   - avoid passing callbacks down
     ```jsx
     const TodosDispatch = React.createContext(null);
     function TodosApp() {
       // Note: `dispatch` won't change between re-renders
       const [todos, dispatch] = useReducer(todosReducer);
       return (
         <TodosDispatch.Provider value={dispatch}>
           <DeepTree todos={todos} />
         </TodosDispatch.Provider>
       );
     }
     ```

1. `React.useCallback()` — memorize callback
   ```ts
   // useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
   /**
    * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
    * has changed.
    *
    * @version 16.8.0
    * @see https://reactjs.org/docs/hooks-reference.html#usecallback
    */
   // TODO (TypeScript 3.0): <T extends (...args: never[]) => unknown>
   function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
   ```
   - useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders
   - `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`
   - often-changing value — use reference value when closure, `useReducer` and `dispatch` as context is more preferable
     ```jsx
     function Form() {
       const [text, updateText] = useState('');
       const textRef = useRef();
       useEffect(() => {
         textRef.current = text; // Write it to the ref
       });
       const handleSubmit = useCallback(() => {
         const currentText = textRef.current; // Read it from the ref
         alert(currentText);
       }, [textRef]); // Don't recreate handleSubmit like [text] would do
       return (
         <>
           <input value={text} onChange={e => updateText(e.target.value)} />
           <ExpensiveTree onSubmit={handleSubmit} />
         </>
       );
     }
     ```
     ```jsx
     function useEventCallback(fn, dependencies) {
       const ref = useRef(() => {
         throw new Error('Cannot call an event handler while rendering.');
       });
       useEffect(() => {
         ref.current = fn;
       }, [fn, ...dependencies]);
       return useCallback(() => {
         const fn = ref.current;
         return fn();
       }, [ref]);
     }
     ```

1. `React.useMemo()`
   ```ts
   /**
    * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
    *
    * Usage note: if calling `useMemo` with a referentially stable function, also give it as the input in
    * the second argument.
    *
    * ```ts
    * function expensive () { ... }
    *
    * function Component () {
    *   const expensiveResult = useMemo(expensive, [expensive])
    *   return ...
    * }
    * ```
    *
    * @version 16.8.0
    * @see https://reactjs.org/docs/hooks-reference.html#usememo
    */
   // allow undefined, but don't make it optional as that is very likely a mistake
   function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
   ```
   - as a performance optimization, not as a semantic guarantee

1. `React.useRef()`
   ```ts
   /**
    * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
    * (`initialValue`). The returned object will persist for the full lifetime of the component.
    *
    * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
    * value around similar to how you’d use instance fields in classes.
    *
    * @version 16.8.0
    * @see https://reactjs.org/docs/hooks-reference.html#useref
    */
   // TODO (TypeScript 3.0): <T extends unknown>
   function useRef<T>(initialValue: T): MutableRefObject<T>;
   interface MutableRefObject<T> {
       current: T;
   }
   ```
   - creates a plain JavaScript object but persists — The only difference between `useRef()` and creating a `{current: ...}` object yourself is that `useRef` will give you the same ref object on every render.
   - previous state by `useRef`
     ```js
     function usePrevious(value) {
       const ref = useRef();
       useEffect(() => {
         ref.current = value;
       });
       return ref.current;
     }
     ```

1. `React.useImperativeHandle()` — used with `forwardRef`
   ```ts
   // NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
   /**
    * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
    * `ref`. As always, imperative code using refs should be avoided in most cases.
    *
    * `useImperativeHandle` should be used with `React.forwardRef`.
    *
    * @version 16.8.0
    * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    */
   function useImperativeHandle<T, R extends T>(ref: Ref<T>|undefined, init: () => R, deps?: DependencyList): void;
   ```
   - customizes the instance value that is exposed to parent components when using `ref`, should be avoided in most cases
   - example
     ```jsx
     function FancyInput(props, ref) {
       const inputRef = useRef();
       useImperativeHandle(ref, () => ({
         focus: () => {
           inputRef.current.focus();
         }
       }));
       return <input ref={inputRef} ... />;
     }
     FancyInput = forwardRef(FancyInput);
     ```

1. `React.useLayoutEffect()` — identical to useEffect, but it fires synchronously after all DOM mutations, before the browser has a chance to paint

1. `React.useDebugValue()` — display a label for custom hooks in React DevTools.
   ```ts
   /**
    * `useDebugValue` can be used to display a label for custom hooks in React DevTools.
    *
    * NOTE: We don’t recommend adding debug values to every custom hook.
    * It’s most valuable for custom hooks that are part of shared libraries.
    *
    * @version 16.8.0
    * @see https://reactjs.org/docs/hooks-reference.html#usedebugvalue
    */
   // the name of the custom hook is itself derived from the function name at runtime:
   // it's just the function name without the "use" prefix.
   function useDebugValue<T>(value: T, format?: (value: T) => any): void;
   ```

# ReactDOM

1. `ReactDOM.render()`
   ```ts
   const render: Renderer;
   interface Renderer {
       // Deprecated(render): The return value is deprecated.
       // In future releases the render function's return type will be void.
       (
           element: SFCElement<any> | Array<SFCElement<any>>,
           container: Element | null,
           callback?: () => void
       ): void;
       <P, T extends Component<P, ComponentState>>(
           element: CElement<P, T>,
           container: Element | null,
           callback?: () => void
       ): T;
       <P>(
           element: ReactElement<P>,
           container: Element | null,
           callback?: () => void
       ): Component<P, ComponentState> | Element | void;
   }
   ```
   - Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.

1. `ReactDOM.hydrate()`
   ```ts
   const hydrate: Renderer;
   ```
   - hydrate a container whose HTML contents were rendered by `ReactDOMServer`
   - React will attempt to attach event listeners to the existing markup.
   - React expects that the rendered content is identical between the server and the client
     - intentionally need to render something different on the server and the client — `this.state.isClient`, which you can set to `true` in `componentDidMount()`

1. `ReactDOM.unmountComponentAtNode()`
   ```ts
   function unmountComponentAtNode(container: Element): boolean;
   ```
   - Returns `true` if a component was unmounted and `false` if there was no component to unmount.

# ReactDOMServer

1. `ReactDOMServer.renderToString()` — Render a React element to its initial HTML
   ```ts
   function renderToString(element: ReactElement): string;
   ```
   - call `ReactDOM.hydrate()` on a node that already has this server-rendered markup, React will preserve it and only attach event handlers

1. `ReactDOMServer.renderToStaticMarkup()` — Similar to `renderToString`, except this doesn’t create extra DOM attributes that React uses internally, such as `data-reactroot`
   - useful if you want to use React as a simple static page generator

1. `ReactDOMServer.renderToNodeStream()` — `renderToString` which returns a stream
   ```ts
   function renderToNodeStream(element: ReactElement): NodeJS.ReadableStream;
   ```

1. `ReactDOMServer.renderToStaticNodeStream()` — `renderToStaticMarkup` which returns a stream

1. `NoSsr`
   ```jsx
   class NoSsr extends React.Component {
     mounted = false;
     state = {
       mounted: false,
     };
     componentDidMount() {
       this.mounted = true;
       if (this.props.defer) {
         // Wondering why we use two RAFs? Check this video out:
         // https://www.youtube.com/watch?v=cCOL7MC4Pl0
         //
         // The componentDidMount() method is called after the DOM nodes are inserted.
         // The UI might not have rendering the changes. We request a frame.
         requestAnimationFrame(() => {
           // The browser should be about to render the DOM nodes
           // that React committed at this point.
           // We don't want to interrupt. Let's wait the next frame.
           requestAnimationFrame(() => {
             // The UI is up-to-date at this point.
             // We can continue rendering the children.
             if (this.mounted) {
               this.setState({ mounted: true });
             }
           });
         });
       } else {
         this.setState({ mounted: true });
       }
     }
     componentWillUnmount() {
       this.mounted = false;
     }
     render() {
       const { children, fallback } = this.props;
       return this.state.mounted ? children : fallback;
     }
   }
   ```

# SyntheticEvent

1. `SyntheticEvent`
   ```ts
   interface BaseSyntheticEvent<E = object, C = any, T = any> {
       nativeEvent: E;
       currentTarget: C;
       target: T;
       bubbles: boolean;
       cancelable: boolean;
       defaultPrevented: boolean;
       eventPhase: number;
       isTrusted: boolean;
       preventDefault(): void;
       isDefaultPrevented(): boolean;
       stopPropagation(): void;
       isPropagationStopped(): boolean;
       persist(): void;
       timeStamp: number;
       type: string;
   }
   interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
   ```

1. event pooling
   - the `SyntheticEvent` object will be reused and all properties will be nullified after the event callback has been invoked
   - cannot access the event in an asynchronous way
   - `persist()` — which will remove the synthetic event from the pool and allow references to the event to be retained by user code
   - specific event types interface — [.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L1070)

# Test Utilities

1. `ReactTestUtils`
   ```js
   import ReactTestUtils from 'react-dom/test-utils';
   ```
   - [docs](https://reactjs.org/docs/test-utils.html)
   - tbd

1. Jest

1. Enzyme

1. react-testing-library

1. `ShallowRenderer`
   ```js
   import ShallowRenderer from 'react-test-renderer/shallow';
   ```
   - Shallow rendering lets you render a component “one level deep” and assert facts about what its render method returns, without worrying about the behavior of child components, which are not instantiated or rendered
   - does not require a DOM
