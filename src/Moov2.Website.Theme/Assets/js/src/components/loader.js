/**
 * Responsible for setting up components.
 */

import toggleCss from 'components/toggle-css'

var loader = function browser (components) {
  // if no components are provided, use modules referenced via require.
  if (!components) {
    components = [toggleCss]
  }

  /**
   * Checks the current state of the document to see if it is an appropriate
   * time to load the components.
   */
  var checkCanInit = function () {
    var readyState = document.readyState || ''
    var regReady = /d$|^c|^i/
    var isDomReady
    var timerId

    timerId = setTimeout(checkCanInit, 200)

    if (document.body) {
      isDomReady = isDomReady || regReady.test(readyState)

      if (isDomReady) {
        clearTimeout(timerId)
        initComponents()
      }
    }
  }

  /**
   * Initialises all the components.
   */
  var initComponents = function () {
    // loop over and call each component.
    for (var i = 0; i < components.length; i++) {
      components[i]()
    }
  }

  // checks the state of the page load to see if the components
  // can be initialised.
  checkCanInit()
}

export default loader
