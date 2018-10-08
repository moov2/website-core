/* global $, Modernizr */

/**
 * Polyfill for implementing `object-fit` CSS property in
 * browsers that lack support.
 * http://caniuse.com/#feat=object-fit
 * https://medium.com/@primozcigler/neat-trick-for-css-object-fit-fallback-on-edge-and-other-browsers-afbc53bbb2c3#.py41lqeu6
 */

export default function () {
    if (Modernizr.objectfit) {
        return;
    }

    var selectors = ['.object-fit--picture'];

    $(selectors.join(',')).each(function () {
        var $container = $(this),
            $img = $container.find('img'),
            imgUrl = $img.prop('src') || $img[0].currentSrc;

        if (imgUrl) {
            $container
                .css('backgroundImage', 'url(' + imgUrl + ')')
                .addClass('compat-object-fit');
        }
    });
};
