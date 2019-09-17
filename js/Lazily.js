const Lazily = (function IIFE(undefined) {
  const dataKey = 'lazily'

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
      handleMutationNodes(entry.addedNodes, onAdd)
      handleMutationNodes(entry.removedNodes, onRemove)
    })
  }

  function handleMutationNodes(nodeList, callback) {
    [].slice.call(nodeList).forEach(function (node) {
      if (node instanceof Element) {
        callback(node)
      }
    })
  }

  function onAdd(element) {
    if (dataKey in element.dataset) {
      return
    }

    element.dataset[dataKey] = ''

    addHandlers.forEach(function (handler) {
      handler(element)
    })
  }

  function onRemove(element) {
    if (!(dataKey in element.dataset)) {
      return
    }

    delete element.dataset[dataKey]

    intersectionHandlers.delete(element)
    intersectionObserver.unobserve(element)

    removeHandlers.forEach(function (handler) {
      handler(element)
    })
  }

  function onIntersection(entries, observer) {
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

      if (typeof handler != 'function') {
        throw new Error('Please provide a valid function')
      }

      if (!intersectionHandlers.has(element)) {
        intersectionHandlers.set(element, [])
      }

      const handlers = intersectionHandlers.get(element)
      handlers.push(handler)

      return this
    },
    onAdd: function (handler) {
      if (typeof handler != 'function') {
        throw new Error('Please provide a valid function')
      }

      addHandlers.push(handler)

      return this
    },
    onRemove: function (handler) {
      if (typeof handler != 'function') {
        throw new Error('Please provide a valid function')
      }

      removeElementHandlers.push(handler)

      return this
    },
    unobserve: function (element, handler) {
      if (intersectionHandlers.has(element)) {
        const handlers = intersectionHandlers.get(element),
          index = handlers.indexOf(handler)

        if (index != -1) {
          handlers.splice(index, 1)
        }
      }

      return this
    },
  }
})()
