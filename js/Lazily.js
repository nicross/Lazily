const Lazily = (function IIFE(undefined) {
  const isSupported = 'IntersectionObserver' in window
    && `MutationObserver` in window

  const mutationObserver = isSupported
    ? new MutationObserver(onMutation)
    : undefined

  const intersectionObserver = isSupported
    ? new IntersectionObserver(onIntersection)
    : undefined

  const addHandlers = [],
    intersectionHandlers = new Map(),
    removeHandlers = []

  function onMutation(entries) {
    entries.forEach(function (entry) {
      forEach(entry.addedNodes, onAdd)
      forEach(entry.removedNodes, onRemove)
    })
  }

  function forEach(arrayLike, callback) {
    requireValidFunction(callback);
    [].slice.call(arrayLike).forEach(callback)
  }

  function onAdd(element) {
    addHandlers.forEach(function (handler) {
      handler(element)
    })
  }

  function onRemove(element) {
    intersectionHandlers.delete(element)
    intersectionObserver.unobserve(element)

    removeHandlers.forEach(function (handler) {
      handler(element)
    })
  }

  function onIntersection(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const element = entry.target,
          handlers = intersectionHandlers.get(element)

        if (handlers) {
          handlers.forEach(function (handler) {
            handler(element)
          })
        }
      }
    })
  }

  function requireValidFunction(value) {
    if (typeof value != 'function') {
      throw new Error('Please provide a valid function')
    }
  }

  if (isSupported) {
    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  }

  return {
    observe: function (element, handler) {
      if (!(element instanceof Element)) {
        return this
      }

      requireValidFunction(handler)

      if (!intersectionHandlers.has(element)) {
        intersectionHandlers.set(element, [])
        intersectionObserver.observe(element)
      }

      const handlers = intersectionHandlers.get(element)
      handlers.push(handler)

      return this
    },
    onAdd: function (handler) {
      requireValidFunction(handler)
      addHandlers.push(handler)
      return this
    },
    onRemove: function (handler) {
      requireValidFunction(handler)
      removeElementHandlers.push(handler)
      return this
    },
    unobserve: function (element, handler) {
      if (!intersectionHandlers.has(element)) {
        return this
      }

      const handlers = intersectionHandlers.get(element),
        index = handlers.indexOf(handler)

      if (index != -1) {
        handlers.splice(index, 1)
      }

      if (handlers.length == 0) {
        intersectionHandlers.delete(element)
        intersectionObserver.unobserve(element)
      }

      return this
    },
  }
})()
