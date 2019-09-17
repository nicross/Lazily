const LazilyLoaderPlugin = (function IIFE(namespace) {
  const dataKey = 'lazilyLoader'

  const elements = {
    iframe: function (element, swap) {
      swap(element, ['src'])
    },
    img: function (element, swap) {
      swap(element, ['src', 'srcset'])
    },
    picture: function (element, swap) {
      [].slice.call(
        element.querySelectorAll('source')
      ).forEach(function (source) {
        swap(source, ['src', 'srcset'])
      })
    },
    video: function (element, swap) {
      [].slice.call(
        element.querySelectorAll('source')
      ).forEach(function (source) {
        swap(source, ['src'])
      })

      swap(element, ['poster', 'src'])
    },
  }

  namespace.onAdd(function (node) {
    if (node instanceof Element && node.tagName.toLowerCase() in elements) {
      initialize(node)
    }
  })

  window.matchMedia('print').addListener(function (event) {
    if (event.matches) {
      forceLoad()
    }
  })

  function initialize(element) {
    if (dataKey in element.dataset) {
      return
    }

    element.dataset[dataKey] = ''

    if ('loading' in element) {
      if (!element.hasAttribute('loading')) {
        element.setAttribute('loading', 'lazy')
      }
      return
    }

    const tagName = element.tagName.toLowerCase()
    elements[tagName](element, swapToData)
    namespace.observe(element, load)
  }

  function load(element) {
    const tagName = element.tagName.toLowerCase()
    elements[tagName](element, swapFromData)
    namespace.unobserve(element, load)
  }

  function forceLoad() {
    namespace.getObserved(onIntersection).forEach(load)
  }

  function swapFromData(element, keys) {
    keys.forEach(function (key) {
      if (key in element.dataset) {
        element[key] = element.dataset[key]
        delete element.dataset[key]
      }
    })
  }

  function swapToData(element, keys) {
    keys.forEach(function (key) {
      if (element.hasAttribute(key)) {
        element.dataset[key] = element[key]
        element.removeAttribute(key)
      }
    })
  }
})(Lazily)
