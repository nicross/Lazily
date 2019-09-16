# Lazily.js
A lazy framework for progressively enhancing boring markup.

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
Plugins will progressively enhance their target elements in supported browsers.

## Plugins
Plugins are optional modules that leverage the Lazily API.
They provide generic solutions for certain use cases:

### Included Plugins
- `LazilyLoaderPlugin` - Lazy loads `<iframe>`, `<img>`, `<picture>`, and `<video>` elements.

### Plugin usage
Plugins should be included directly after the main script.

### Upcoming plugins
- `LazilyRehydratorPlugin` - Rehydrates elements as components.
- `LazilyRevealerPlugin` - Triggers scroll reveal animations.

## API
- `Lazily.onMutation(handler)` - Execute `handler` whenever new elements are added to the document.
- `Lazily.observeIntersection(element, handler)` - Execute `handler` whenever `element` intersects the viewport.
- `Lazily.unobserveIntersection(element, handler)` - Remove `handler` from the intersection handlers for `element`.

## Getting started
Contributors should execute `npm install` to continue.

### Building distributables
Execute `npx gulp dist` to build distributables for all source files.
