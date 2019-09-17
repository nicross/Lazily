# Lazily.js
A lightweight framework for progressively enhancing static markup.

**Lazily** leverages the `MutationObserver` interface to alert plugins of changes to the document.
Plugins then intercept and mutate these changes before they are committed.

This creates a thin rehydration layer between the server and client, allowing the server to output semantic and agnostic markup.
For example, **LazilyLoaderPlugin** removes the need for outputting custom `data-*` attributes by rehydrating elements with whatever strategy the browser supports.
Not only is this an improvement for developer experience—on many sites this presents a major performance optimization.

## Compatibility
- Compatible with all evergreen browsers
- For IE11, please provide polyfills for `IntersectionObserver` and `MutationObserver`
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
- `LazilyLoaderPlugin` - Lazy loads `<iframe>`, `<img>`, `<picture>`, and `<video>` elements. Prefers the native `loading` attribute in supporting browsers, otherwise it leverages an `IntersectionObserver`.

### Planned plugins
- `LazilyRehydratorPlugin` - Interface for rehydrating elements via selector, e.g. as custom elements or components.
- `LazilyRevealerPlugin` - Triggers scroll reveal animations. Provides an optional stylesheet for common use cases.

### Plugin usage
Plugins should be included directly after the main script.

## Lazily API
- `Lazily.getObserved(handler)` - Returns an array of elements subscribed to `handler`.
- `Lazily.isSupported()` - Returns whether the minimum requirements are met. If `true`, then the library is running.
- `Lazily.observe(element, handler)` - Execute `handler` whenever `element` intersects the viewport.
- `Lazily.onAdd(handler)` - Execute `handler` whenever new elements are added to the document.
- `Lazily.onRemove(handler)` - Execute `handler` whenever new elements are removed from the document.
- `Lazily.unobserve(element, handler)` - Remove `handler` from the intersection handlers for `element`.

### LazilyLoaderPlugin API
- `LazilyLoaderPlugin.forceLoad()` - Forces all observed elements to load.

## Getting started
Contributors should execute `npm install` to continue.

### Building distributables
Execute `npx gulp dist` to build distributables for all source files.
