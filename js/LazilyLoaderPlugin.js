const LazilyLoaderPlugin = (function IIFE(namespace) {
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

  namespace.onMutation(function (element) {
    if (element.tagName.toLowerCase() in elements) {
      initialize(element)
    }
  })

  function initialize(element) {
    if ('loading' in element) {
      if (!element.hasAttribute('loading')) {
        element.setAttribute('loading', 'lazy')
      }
      return
    }

    const tagName = element.tagName.toLowerCase()
    lazyElements[tagName](element, swapToData)

    namespace.observeIntersection(element, onIntersection)
  }

  function onIntersection(element) {
    load(element)
    namespace.unobserveIntersection(element)
  }

  function load(element) {
    const tagName = element.tagName.toLowerCase()
    lazyElements[tagName](element, swapFromData)
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

  // TODO: Force load on print
})(Lazily)
