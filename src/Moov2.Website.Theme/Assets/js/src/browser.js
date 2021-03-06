/**
 * Responsible for setting up polyfills and enhancements to browser
 * features.
 */

import setClasses from 'browser/set-classes'

var browser = function browser (enhancements) {
  // if no enhancements are provided, use modules referenced via require.
  if (!enhancements) {
    enhancements = [setClasses]
  }

  // loop over and call each enhancement.
  for (var i = 0; i < enhancements.length; i++) {
    enhancements[i]()
  }
}

export default browser
