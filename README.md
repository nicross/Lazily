# Lazily.js
A lightweight plugin ecosystem for progressively enhancing static markup.

**Lazily** leverages the `MutationObserver` interface to alert plugins of changes to the document.
Plugins then intercept and mutate these changes before they are committed.

This creates a thin rehydration layer between the server and client, allowing the server to output semantic and agnostic markup.
For example, **LazilyLoaderPlugin** removes the need for outputting custom `data-*` attributes by rehydrating elements with whatever strategy the browser supports.
Not only is this an improvement for developer experience—on many sites this presents a major performance optimization.

## Compatibility
- Compatible with all evergreen browsers
- For IE11, please provide polyfills for `IntersectionObserver`, `MutationObserver`, and `Promise`
- Earlier browsers may require transpilation and additional polyfills
- Plugins may have their own dependencies

## Basic usage
For best results, the minified scripts should be added to the document `<head>`.
For certain setups, it may be advantageous to include them inline:

```html
<head>
  <script src=".../dist/Lazily.min.js"></script>
  <!-- Plugins here -->
</head>
```

No other markup changes are required.
Plugins will progressively enhance their targets in supported browsers.

## Plugins
Plugins are optional modules that leverage the Lazily API.
They provide generic solutions for common use cases:

### Included plugins
- `LazilyLoaderPlugin` - Lazy loads supported elements. Prefers the native `loading` attribute in supporting browsers, otherwise it leverages an `IntersectionObserver`.
- `LazilyRehydratorPlugin` - Interface for executing a handler function whenever a new element matches its selector. Perfect for rehydrating static markup, from simple enhancements to custom components.
- `LazilyRevealerPlugin` - Triggers scroll reveal animations for elements matching a configurable selector. Provides an optional stylesheet for common use cases.

### Plugin usage
Plugins should be included directly after the main `<script>` element.

## API documentation
The library performs no mutations on its own.
Plugins leverage its API to progressively enhance the document:

- `Lazily.getObserved(handler)` - Returns an array of elements subscribed to `handler`.
- `Lazily.isSupported()` - Returns whether the minimum requirements are met. If `true`, then the library is running.
- `Lazily.observe(element, handler)` - Execute `handler` whenever `element` intersects the viewport.
- `Lazily.onAdd(handler)` - Execute `handler` whenever new nodes are added to the document.
- `Lazily.onRemove(handler)` - Execute `handler` whenever new nodes are removed from the document.
- `Lazily.ready(handler)` - Execute `handler` as soon as the document is ready. Returns a `Promise` if supported.
- `Lazily.unobserve(element, handler)` - Remove `handler` from the intersection handlers for `element`.

### LazilyLoaderPlugin
This plugin automatically lazy loads `<iframe>`, `<img>`, `<picture>`, and `<video>` elements without markup changes:

- `LazilyLoaderPlugin.forceLoad()` - Forces all observed elements to load. This method is automatically called when the document is printed.

### LazilyRehydratorPlugin
This plugin will execute as the document loads, as well as when it's ready the first time.
This allows handlers to be registered by scripts that are deferred or at the end of the document:

- `LazilyRehydratorPlugin.register(selector, handler)` - Executes `handler` whenever a new element matches `selector`.

### LazilyRevealerPlugin
This plugin uses the custom `data-lazily-revealer` attribute to trigger scroll reveal animations.
Elements that are `ready` are being observed for intersections.
They enter the `play` state once they enter the viewport the first time.

By default, this plugin selects elements having the `lazily-revealer` class.
Other selectors are permitted with the `addSelector()` method.
For best results, selectors should be added following the `<script>` within the document `<head>`.

The optional stylesheet provides a baseline for a scroll reveal animation framework.
A fade-in animation is forced when users' `prefers-reduced-motion` is `reduce`.
Custom animations can be specified with an attribute selector:

```css
.foobar[data-lazily-revealer] {
  animation-name: foobar;
}
```

- `LazilyRevealerPlugin.addSelector(selector)` - Triggers reveal animations whenever a new element matches `selector`.

## Getting started
Contributors should execute `npm install` to continue.

### Building distributables
Execute `npx gulp dist` to build distributables for all source files.
