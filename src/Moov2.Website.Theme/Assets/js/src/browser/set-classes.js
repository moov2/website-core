/* global $ */

/**
 * Adds CSS classes to the head of the document to signify that the browser
 * has JS enabled.
 */

import FontFaceObserver from 'fontfaceobserver'

export default function () {
  var CSS_FONTS_LOADED = 'is-fonts-loaded'
  var CSS_PRELOAD = 'is-preload'
  var d = window.document.documentElement
  var $html = $('html')

  /**
   * Returns flag indicating whether the fonts are being loaded from a
   * cached asset.
   */
  var isFontsCached = function () {
    return d.className.indexOf(CSS_FONTS_LOADED) > -1
  }

  $html.removeClass('no-js').addClass('js')

  if (!isFontsCached()) {
    var font = new FontFaceObserver('Hind')

    font.load()
      .then(() => {
        d.className += ' ' + CSS_FONTS_LOADED
      })
  }

  var checkHasLoaded = function () {
    var readyState = document.readyState || ''
    var regReady = /d$|^c/
    var isDomReady
    var timerId

    timerId = setTimeout(checkHasLoaded, 200)

    if (document.body) {
      isDomReady = isDomReady || regReady.test(readyState)

      if (isDomReady) {
        clearTimeout(timerId)
        $html.removeClass(CSS_PRELOAD)
      }
    }
  }

  checkHasLoaded()
}
