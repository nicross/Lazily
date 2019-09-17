const LazilyRehydratorPlugin = (function IIFE(namespace) {
  const dataKey = 'lazilyRehydrator',
    handlers = new Map()

  namespace.ready(function () {
    rehydrateAll()

    namespace.onAdd(function (node) {
      if (node instanceof Element) {
        rehydrate(node)
      }
    })
  })

  function rehydrate(element) {
    if (dataKey in element.dataset) {
      return
    }

    const handler = getHandler(element)

    if (handler) {
      element.dataset[dataKey] = ''
      handler(element)
    }
  }

  function rehydrateAll() {
    rehydrateWithin(document.documentElement)
  }

  function rehydrateWithin(element) {
    const selector = getSelector()

    const elements = [].slice.call(
      element.querySelectorAll(selector)
    )

    if (matches(element, selector)) {
      elements.unshift(element)
    }

    elements.forEach(rehydrate)
  }

  function getHandler(element) {
    const entries = mapEntries(handlers)

    for (let i = 0, length = entries.length; i < length; i += 1) {
      if (matches(element, entries[i][0])) {
        return entries[i][1]
      }
    }
  }

  function getSelector() {
    const selectors = mapKeys(handlers)
    selectors.push(':not([data-lazily-rehydrator])')
    return selectors.join(',')
  }

  function mapEntries(map) {
    const entries = []

    map.forEach(function (value, key) {
      entries.push([key, value])
    })

    return entries
  }

  function mapKeys(map) {
    const keys = []

    map.forEach(function(value, key) {
      keys.push(key)
    })

    return keys
  }

  function matches(element, selector) {
    if (element instanceof Element) {
      const command = element.matches || element.matchesSelector || element.msMatchesSelector

      if (command) {
        return command.call(element, selector)
      }
    }
  }

  return {
    register: function (selector, handler) {
      if (typeof handler != 'function') {
        throw new Error('Please provide a valid function')
      }

      handlers.set(selector, handler)
      return this
    },
  }
})(Lazily)
