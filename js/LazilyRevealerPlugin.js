const LazilyRevealerPlugin = (function IIFE(namespace, undefined) {
  const dataKey = 'lazilyRevealer',
    dataStates = {
      play: 'play',
      ready: 'ready',
    },
    selectors = [
      '.lazily-revealer',
    ]

  namespace.onAdd(function (node) {
    if (node instanceof Element && matches(node, selectors.join(','))) {
      initialize(node)
    }
  })

  function initialize(element) {
    if (dataKey in element.dataset) {
      return
    }

    element.dataset[dataKey] = dataStates.ready
    namespace.observe(element, onIntersection)
  }

  function onIntersection(element) {
    element.dataset[dataKey] = dataStates.play
    namespace.unobserve(element)
  }

  function matches(element, selector) {
    const command = element.matches || element.matchesSelector || element.msMatchesSelector

    if (command) {
      return command.call(element, selector)
    }
  }

  return {
    select: function (selector) {
      selectors.push(selector)
      return this
    },
  }
})(Lazily)
