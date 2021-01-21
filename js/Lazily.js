const Lazily = (function IIFE(undefined) {
  const isSupported = 'IntersectionObserver' in window
    && 'MutationObserver' in window
    && 'Promise' in window

  const mutationObserver = isSupported
    ? new MutationObserver(onMutation)
    : undefined

  const intersectionObserver = isSupported
    ? new IntersectionObserver(onIntersection)
    : undefined

  const whenReady = isSupported
    ? new Promise(function (resolve) {
        document.addEventListener('DOMContentLoaded', resolve)
        window.addEventListener('load', resolve)
      })
    : undefined

  const addHandlers = [],
    intersectionHandlers = new Map(),
    removeHandlers = []

  if (isSupported) {
    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  }

  function onMutation(entries) {
    entries.forEach(function (entry) {
      forEach(entry.addedNodes, onAdd)
      forEach(entry.removedNodes, onRemove)
    })
  }

  function forEach(arrayLike, callback) {
    [].slice.call(arrayLike).forEach(callback)
  }

  function onAdd(element) {
    addHandlers.forEach(function (handler) {
      handler(element)
    })
  }

  function onRemove(element) {
    if (element instanceof Element) {
      intersectionHandlers.delete(element)
      intersectionObserver.unobserve(element)
    }

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

  return {
    getObserved: function(handler) {
      if (!isSupported) {
        return []
      }

      const elements = []

      intersectionHandlers.forEach(function (handlers, element) {
        if (handlers.indexOf(handler) != -1) {
          elements.push(element)
        }
      })

      return elements
    },
    isSupported: function () {
      return isSupported
    },
    observe: function (element, handler) {
      if (!isSupported || !(element instanceof Element)) {
        return this
      }

      requireValidFunction(handler)

      if (!intersectionHandlers.has(element)) {
        intersectionHandlers.set(element, [])
        intersectionObserver.observe(element)
      }

      intersectionHandlers.get(element).push(handler)

      return this
    },
    onAdd: function (handler) {
      if (!isSupported) {
        return this
      }

      requireValidFunction(handler)
      addHandlers.push(handler)

      return this
    },
    onRemove: function (handler) {
      if (!isSupported) {
        return this
      }

      requireValidFunction(handler)
      removeElementHandlers.push(handler)

      return this
    },
    ready: function () {
      if (isSupported) {
        return whenReady.then.apply(whenReady, arguments)
      }
    },
    unobserve: function (element, handler) {
      if (!isSupported || !intersectionHandlers.has(element)) {
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
