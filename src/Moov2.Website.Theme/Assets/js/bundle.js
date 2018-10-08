require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * File acts as the input for browserify, which will handle compiling
 * modules into a single file. It shouldn't be necessary to add JS code
 * to this file, instead `app/app.js` should be used as the starting point
 * for JavaScript code.
 */

require('shoestring');

var app = require('app')(),
	browser = require('browser'),
	components = require('components/loader');

/**
 * Setup different layers of the application.
 */

app.addLayer(browser);
app.addLayer(components);
},{"app":2,"browser":3,"components/loader":6,"shoestring":"shoestring"}],2:[function(require,module,exports){
"use strict";

/**
 * Primary object that is executed at the entry point of the application
 * JavaScript. This modules primary function is to house the different layers
 * of the application.
 */

var app = function () {
	return {
		/**
		 * Adds new layer to application.
		 */
		addLayer: function (layer) {
			if (!layer) {
				return;
			}
			
			layer();
		}
	};
};

module.exports = app;
},{}],3:[function(require,module,exports){
"use strict";

/**
 * Responsible for setting up polyfills and enhancements to browser
 * features.
 */

var setClasses = require('browser/set-classes');
var setClasses = require('browser/objectfit.polyfill');

var browser = function browser(enhancements) {
	// if no enhancements are provided, use modules referenced via require.
	if (!enhancements) {
		enhancements = [setClasses];
	}

	// loop over and call each enhancement.
	for (var i = 0; i < enhancements.length; i++) {
		enhancements[i]();
	}
};

module.exports = browser;

},{"browser/objectfit.polyfill":4,"browser/set-classes":5}],4:[function(require,module,exports){
/* global $, Modernizr */

"use strict";

/**
 * Polyfill for implementing `object-fit` CSS property in
 * browsers that lack support.
 * http://caniuse.com/#feat=object-fit
 * https://medium.com/@primozcigler/neat-trick-for-css-object-fit-fallback-on-edge-and-other-browsers-afbc53bbb2c3#.py41lqeu6
 */

module.exports = function () {
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

},{}],5:[function(require,module,exports){
/* global $ */

"use strict";

/**
 * Adds CSS classes to the head of the document to signify that the browser
 * has JS enabled.
 */

require('fontfaceobserver');

module.exports = function () {
	var CSS_FONTS_LOADED = 'is-fonts-loaded',
		CSS_PRELOAD = 'is-preload',
		d = window.document.documentElement,
		$html = $('html');
		
	/**
	 * Returns flag indicating whether the fonts are being loaded from a 
	 * cached asset.
	 */
	var isFontsCached = function () {
		return d.className.indexOf(CSS_FONTS_LOADED) > -1;
	};
	
	$html.removeClass('no-js').addClass('js');
	
	if (!isFontsCached()) {
		new window.FontFaceObserver( 'Source Sans Pro' )
			.check()
			.then( function(){ d.className += ' ' + CSS_FONTS_LOADED; });
	}
	
	var checkHasLoaded = function() {
		var readyState = document.readyState || '',
			regReady = /d$|^c/,
			isDomReady, timerId;

		timerId = setTimeout(checkHasLoaded, 200);
		
		if ( document.body ) {
			isDomReady = isDomReady || regReady.test(readyState);
			if ( isDomReady ) {
				clearTimeout( timerId );
				$html.removeClass(CSS_PRELOAD);
			}
		}
	};
	
	checkHasLoaded();
};
},{"fontfaceobserver":8}],6:[function(require,module,exports){
"use strict";

/**
 * Responsible for setting up components.
 */

var toggleCss = require('components/toggle-css');

var loader = function browser(components) {
	// if no components are provided, use modules referenced via require.
	if (!components) {
		components = [toggleCss];
	}
	
	/**
	 * Checks the current state of the document to see if it is an appropriate
	 * time to load the components.
	 */
	var checkCanInit = function() {
		var readyState = document.readyState || '',
			regReady = /d$|^c|^i/,
			isDomReady, timerId;

		timerId = setTimeout(checkCanInit, 200);
		
		if ( document.body ) {
			isDomReady = isDomReady || regReady.test(readyState);
			if ( isDomReady ) {
				clearTimeout( timerId );
				initComponents();
			}
		}
	};
	
	/** 
	 * Initialises all the components.
	 */
	var initComponents = function () {
		// loop over and call each component.
		for (var i = 0; i < components.length; i++) {
			components[i]();
		}
	};
	
	// checks the state of the page load to see if the components
	// can be initialised.
	checkCanInit();
};

module.exports = loader;
},{"components/toggle-css":7}],7:[function(require,module,exports){
/* global $ */

"use strict";

/**
 * When user clicks a DOM element a CSS class can be applied
 * to another element on the DOM. Below is an example of how
 * to setup toggleCss for an element on the DOM.
 * 
 * <div class="js-toggle-css" data-target=".js-target" data-css="is-active" />
 * 
 * In the example above, when the element is clicked by the user
 * the `is-active` class is toggled on any elements on the DOM whose
 * selector matches `.js-target`. If `.js-target` has `is-active`
 * as a CSS class, this will be removed when the `.js-toggle-css` element
 * is clicked, but if the `is-active` class doesn't exist it is added.
 * 
 * If the toggleCss element doesn't contain `data-target` or `data-css`
 * then it is ignored.
 */

var toggleCss = function ($el) {
	var css = $el.attr('data-css'),
		target = $el.attr('data-target'),
		$target = $(target);
	
	/**
	 * Adds event listener to element to trigger the toggling of CSS.
	 */
	var init = function () {
		if (!valid()) {
			return;
		}
	
		$el.on('click', toggle);
		
		return {
			$el: $el,
			$target: $target,
			css: css,
			toggle: toggle
		};
	};
	
	/**
	 * Toggles the CSS on the `$target` element. Function must return false
	 * in order to prevent default hyperlink behaviour.
	 */
	var toggle = function () {
		var classes = $target.attr('class').toLowerCase().split(' ');
		
		// loop over classes and removing class if match.
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] === css.toLowerCase()) {
				$target.removeClass(css);
				return false;
			}
		}
		
		$target.addClass(css);
		
		return false;
	};
	
	/**
	 * Returns flag indicating whether the element has valid attributes.
	 */
	var valid = function () {
		return css && $target.length > 0;
	};

	return init();
};

module.exports = function () {
	var SELECTOR = '.js-toggle-css',
		$els = $(SELECTOR),
		instances = [];
	
	// check if elements exist on the DOM.
	if ($els.length === 0) {
		return instances;
	}
	
	for (var i = 0; i < $els.length; i++) {
		var instance = toggleCss($($els[i]));
		
		if (instance) {
			instances.push(instance);
		}
	}
	
	return instances;
};
},{}],8:[function(require,module,exports){
(function(){'use strict';var f=[];function g(a){f.push(a);1===f.length&&l()}function m(){for(;f.length;)f[0](),f.shift()}if(window.MutationObserver){var n=document.createElement("div");(new MutationObserver(m)).observe(n,{attributes:!0});var l=function(){n.setAttribute("x",0)}}else l=function(){setTimeout(m)};function p(a){this.a=q;this.b=void 0;this.f=[];var b=this;try{a(function(a){r(b,a)},function(a){t(b,a)})}catch(c){t(b,c)}}var q=2;function u(a){return new p(function(b,c){c(a)})}function v(a){return new p(function(b){b(a)})}
function r(a,b){if(a.a===q){if(b===a)throw new TypeError("Promise settled with itself.");var c=!1;try{var d=b&&b.then;if(null!==b&&"object"===typeof b&&"function"===typeof d){d.call(b,function(b){c||r(a,b);c=!0},function(b){c||t(a,b);c=!0});return}}catch(e){c||t(a,e);return}a.a=0;a.b=b;w(a)}}function t(a,b){if(a.a===q){if(b===a)throw new TypeError("Promise settled with itself.");a.a=1;a.b=b;w(a)}}
function w(a){g(function(){if(a.a!==q)for(;a.f.length;){var b=a.f.shift(),c=b[0],d=b[1],e=b[2],b=b[3];try{0===a.a?"function"===typeof c?e(c.call(void 0,a.b)):e(a.b):1===a.a&&("function"===typeof d?e(d.call(void 0,a.b)):b(a.b))}catch(h){b(h)}}})}p.prototype.g=function(a){return this.c(void 0,a)};p.prototype.c=function(a,b){var c=this;return new p(function(d,e){c.f.push([a,b,d,e]);w(c)})};
function x(a){return new p(function(b,c){function d(c){return function(d){h[c]=d;e+=1;e===a.length&&b(h)}}var e=0,h=[];0===a.length&&b(h);for(var k=0;k<a.length;k+=1)v(a[k]).c(d(k),c)})}function y(a){return new p(function(b,c){for(var d=0;d<a.length;d+=1)v(a[d]).c(b,c)})};window.Promise||(window.Promise=p,window.Promise.resolve=v,window.Promise.reject=u,window.Promise.race=y,window.Promise.all=x,window.Promise.prototype.then=p.prototype.c,window.Promise.prototype["catch"]=p.prototype.g);}());

(function(){'use strict';function h(a){document.body?a():document.addEventListener("DOMContentLoaded",a)};function v(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.g=document.createElement("span");this.f=-1;this.b.style.cssText="display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.g.style.cssText="display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;";this.b.appendChild(this.h);this.c.appendChild(this.g);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function w(a,c,b){a.a.style.cssText="min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;left:-999px;white-space:nowrap;font-size:100px;font-family:"+c+";"+b}function x(a){var c=a.a.offsetWidth,b=c+100;a.g.style.width=b+"px";a.c.scrollLeft=b;a.b.scrollLeft=a.b.scrollWidth+100;return a.f!==c?(a.f=c,!0):!1}
function y(a,c){a.b.addEventListener("scroll",function(){x(a)&&null!==a.a.parentNode&&c(a.f)},!1);a.c.addEventListener("scroll",function(){x(a)&&null!==a.a.parentNode&&c(a.f)},!1);x(a)};function z(a,c){var b=c||{};this.family=a;this.style=b.style||"normal";this.variant=b.variant||"normal";this.weight=b.weight||"normal";this.stretch=b.stretch||"normal";this.featureSettings=b.featureSettings||"normal"}var B=null;
z.prototype.a=function(a,c){var b=a||"BESbswy",C=c||3E3,k="font-style:"+this.style+";font-variant:"+this.variant+";font-weight:"+this.weight+";font-stretch:"+this.stretch+";font-feature-settings:"+this.featureSettings+";-moz-font-feature-settings:"+this.featureSettings+";-webkit-font-feature-settings:"+this.featureSettings+";",g=document.createElement("div"),l=new v(b),m=new v(b),n=new v(b),d=-1,e=-1,f=-1,q=-1,r=-1,t=-1,p=this;return new Promise(function(a,b){function c(){null!==g.parentNode&&g.parentNode.removeChild(g)}
function u(){if(-1!==d&&-1!==e||-1!==d&&-1!==f||-1!==e&&-1!==f)if(d===e||d===f||e===f){if(null===B){var b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))}B?d===q&&e===q&&f===q||d===r&&e===r&&f===r||d===t&&e===t&&f===t||(c(),a(p)):(c(),a(p))}}h(function(){function a(){if(Date.now()-D>=C)c(),b(p);else{var A=document.hidden;if(!0===A||void 0===A)d=l.a.offsetWidth,e=m.a.offsetWidth,f=n.a.offsetWidth,
u();setTimeout(a,50)}}var D=Date.now();w(l,"sans-serif",k);w(m,"serif",k);w(n,"monospace",k);g.appendChild(l.a);g.appendChild(m.a);g.appendChild(n.a);document.body.appendChild(g);q=l.a.offsetWidth;r=m.a.offsetWidth;t=n.a.offsetWidth;a();y(l,function(a){d=a;u()});w(l,'"'+p.family+'",sans-serif',k);y(m,function(a){e=a;u()});w(m,'"'+p.family+'",serif',k);y(n,function(a){f=a;u()});w(n,'"'+p.family+'",monospace',k)})})};window.FontFaceObserver=z;window.FontFaceObserver.prototype.check=z.prototype.a;}());

},{}],"shoestring":[function(require,module,exports){
/*! Shoestring - v1.0.3 - 2015-09-10
* http://github.com/filamentgroup/shoestring/
* Copyright (c) 2015 Scott Jehl, Filament Group, Inc; Licensed MIT & GPLv2 */ 
(function( w, undefined ){
	/**
	 * The shoestring object constructor.
	 *
	 * @param {string,object} prim The selector to find or element to wrap.
	 * @param {object} sec The context in which to match the `prim` selector.
	 * @returns shoestring
	 * @this window
	 */
	function shoestring( prim, sec ){
		var pType = typeof( prim ),
				ret = [],
				sel;

		// return an empty shoestring object
		if( !prim ){
			return new Shoestring( ret );
		}

		// ready calls
		if( prim.call ){
			return shoestring.ready( prim );
		}

		// handle re-wrapping shoestring objects
		if( prim.constructor === Shoestring && !sec ){
			return prim;
		}

		// if string starting with <, make html
		if( pType === "string" && prim.indexOf( "<" ) === 0 ){
			var dfrag = document.createElement( "div" );

			dfrag.innerHTML = prim;

			// TODO depends on children (circular)
			return shoestring( dfrag ).children().each(function(){
				dfrag.removeChild( this );
			});
		}

		// if string, it's a selector, use qsa
		if( pType === "string" ){
			if( sec ){
				return shoestring( sec ).find( prim );
			}

				sel = document.querySelectorAll( prim );

			return new Shoestring( sel, prim );
		}

		// array like objects or node lists
		if( Object.prototype.toString.call( pType ) === '[object Array]' ||
				(window.NodeList && prim instanceof window.NodeList) ){

			return new Shoestring( prim, prim );
		}

		// if it's an array, use all the elements
		if( prim.constructor === Array ){
			return new Shoestring( prim, prim );
		}

		// otherwise assume it's an object the we want at an index
		return new Shoestring( [prim], prim );
	}

	var Shoestring = function( ret, prim ) {
		this.length = 0;
		this.selector = prim;
		shoestring.merge(this, ret);
	};

	// TODO only required for tests
	Shoestring.prototype.reverse = [].reverse;

	// For adding element set methods
	shoestring.fn = Shoestring.prototype;

	// expose for testing purposes only
	shoestring.Shoestring = Shoestring;

	// For extending objects
	// TODO move to separate module when we use prototypes
	shoestring.extend = function( first, second ){
		for( var i in second ){
			if( second.hasOwnProperty( i ) ){
				first[ i ] = second[ i ];
			}
		}

		return first;
	};

	// taken directly from jQuery
	shoestring.merge = function( first, second ) {
		var len, j, i;

		len = +second.length,
		j = 0,
		i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	};

	// expose
	window.shoestring = shoestring;



	var xmlHttp = function() {
		try {
			return new XMLHttpRequest();
		}
		catch( e ){
			return new ActiveXObject( "Microsoft.XMLHTTP" );
		}
	};

	/**
	 * Make an HTTP request to a url.
	 *
	 * **NOTE** the following options are supported:
	 *
	 * - *method* - The HTTP method used with the request. Default: `GET`.
	 * - *data* - Raw object with keys and values to pass with request as query params. Default `null`.
	 * - *headers* - Set of request headers to add. Default `{}`.
	 * - *async* - Whether the opened request is asynchronouse. Default `true`.
	 * - *success* - Callback for successful request and response. Passed the response data.
	 * - *error* - Callback for failed request and response.
	 * - *cancel* - Callback for cancelled request and response.
	 *
	 * @param {string} url The url to request.
	 * @param {object} options The options object, see Notes.
	 * @return shoestring
	 * @this shoestring
	 */

	shoestring.ajax = function( url, options ) {
		var params = "", req = xmlHttp(), settings, key;

		settings = shoestring.extend( {}, shoestring.ajax.settings );

		if( options ){
			shoestring.extend( settings, options );
		}

		if( !url ){
			url = settings.url;
		}

		if( !req || !url ){
			return;
		}

		// create parameter string from data object
		if( settings.data ){
			for( key in settings.data ){
				if( settings.data.hasOwnProperty( key ) ){
					if( params !== "" ){
						params += "&";
					}
					params += encodeURIComponent( key ) + "=" +
						encodeURIComponent( settings.data[key] );
				}
			}
		}

		// append params to url for GET requests
		if( settings.method === "GET" && params ){
			
			url += "?" + params;
		}

		req.open( settings.method, url, settings.async );

		if( req.setRequestHeader ){
			req.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );

			// Set 'Content-type' header for POST requests
			if( settings.method === "POST" && params ){
				req.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
			}

			for( key in settings.headers ){
				if( settings.headers.hasOwnProperty( key ) ){
					req.setRequestHeader(key, settings.headers[ key ]);
				}
			}
		}

		req.onreadystatechange = function () {
			if( req.readyState === 4 ){
				// Trim the whitespace so shoestring('<div>') works
				var res = (req.responseText || '').replace(/^\s+|\s+$/g, '');
				if( req.status.toString().indexOf( "0" ) === 0 ){
					return settings.cancel( res, req.status, req );
				}
				else if ( req.status.toString().match( /^(4|5)/ ) && RegExp.$1 ){
					return settings.error( res, req.status, req );
				}
				else if (settings.success) {
					return settings.success( res, req.status, req );
				}
			}
		};

		if( req.readyState === 4 ){
			return req;
		}

		// Send request
		if( settings.method === "POST" && params ){
			req.send( params );
		} else {
			req.send();
		}

		return req;
	};

	shoestring.ajax.settings = {
		success: function(){},
		error: function(){},
		cancel: function(){},
		method: "GET",
		async: true,
		data: null,
		headers: {}
	};



	/**
	 * Helper function wrapping a call to [ajax](ajax.js.html) using the `GET` method.
	 *
	 * @param {string} url The url to GET from.
	 * @param {function} callback Callback to invoke on success.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.get = function( url, callback ){
		return shoestring.ajax( url, { success: callback } );
	};



  /**
	 * Load the HTML response from `url` into the current set of elements.
	 *
	 * @param {string} url The url to GET from.
	 * @param {function} callback Callback to invoke after HTML is inserted.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.load = function( url, callback ){
		var self = this,
			args = arguments,
			intCB = function( data ){
				self.each(function(){
					shoestring( this ).html( data );
				});

				if( callback ){
					callback.apply( self, args );
				}
		  };

		shoestring.ajax( url, { success: intCB } );
		return this;
	};



	/**
	 * Helper function wrapping a call to [ajax](ajax.js.html) using the `POST` method.
	 *
	 * @param {string} url The url to POST to.
	 * @param {object} data The data to send.
	 * @param {function} callback Callback to invoke on success.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.post = function( url, data, callback ){
		return shoestring.ajax( url, { data: data, method: "POST", success: callback } );
	};



	/**
	 * Iterates over `shoestring` collections.
	 *
	 * @param {function} callback The callback to be invoked on each element and index
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.each = function( callback ){
		return shoestring.each( this, callback );
	};

	shoestring.each = function( collection, callback ) {
		var val;
		for( var i = 0, il = collection.length; i < il; i++ ){
			val = callback.call( collection[i], i, collection[i] );
			if( val === false ){
				break;
			}
		}

		return collection;
	};



  /**
	 * Check for array membership.
	 *
	 * @param {object} needle The thing to find.
	 * @param {object} haystack The thing to find the needle in.
	 * @return {boolean}
	 * @this window
	 */
	shoestring.inArray = function( needle, haystack ){
		var isin = -1;
		for( var i = 0, il = haystack.length; i < il; i++ ){
			if( haystack.hasOwnProperty( i ) && haystack[ i ] === needle ){
				isin = i;
			}
		}
		return isin;
	};



  /**
	 * Bind callbacks to be run when the DOM is "ready".
	 *
	 * @param {function} fn The callback to be run
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.ready = function( fn ){
		if( ready && fn ){
			fn.call( document );
		}
		else if( fn ){
			readyQueue.push( fn );
		}
		else {
			runReady();
		}

		return [document];
	};

	// TODO necessary?
	shoestring.fn.ready = function( fn ){
		shoestring.ready( fn );
		return this;
	};

	// Empty and exec the ready queue
	var ready = false,
		readyQueue = [],
		runReady = function(){
			if( !ready ){
				while( readyQueue.length ){
					readyQueue.shift().call( document );
				}
				ready = true;
			}
		};

	// Quick IE8 shiv
	if( !window.addEventListener ){
		window.addEventListener = function( evt, cb ){
			return window.attachEvent( "on" + evt, cb );
		};
	}

	// If DOM is already ready at exec time, depends on the browser.
	// From: https://github.com/mobify/mobifyjs/blob/526841be5509e28fc949038021799e4223479f8d/src/capture.js#L128
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
		runReady();
	}	else {
		if( !document.addEventListener ){
			document.attachEvent( "DOMContentLoaded", runReady );
			document.attachEvent( "onreadystatechange", runReady );
		} else {
			document.addEventListener( "DOMContentLoaded", runReady, false );
			document.addEventListener( "readystatechange", runReady, false );
		}
		window.addEventListener( "load", runReady, false );
	}



  /**
	 * Checks the current set of elements against the selector, if one matches return `true`.
	 *
	 * @param {string} selector The selector to check.
	 * @return {boolean}
	 * @this {shoestring}
	 */
	shoestring.fn.is = function( selector ){
		var ret = false, self = this, parents, check;

		// assume a dom element
		if( typeof selector !== "string" ){
			// array-like, ie shoestring objects or element arrays
			if( selector.length && selector[0] ){
				check = selector;
			} else {
				check = [selector];
			}

			return _checkElements(this, check);
		}

		parents = this.parent();

		if( !parents.length ){
			parents = shoestring( document );
		}

		parents.each(function( i, e ) {
			var children;

					children = e.querySelectorAll( selector );

			ret = _checkElements( self, children );
		});

		return ret;
	};

	function _checkElements(needles, haystack){
		var ret = false;

		needles.each(function() {
			var j = 0;

			while( j < haystack.length ){
				if( this === haystack[j] ){
					ret = true;
				}

				j++;
			}
		});

		return ret;
	}



	/**
	 * Get data attached to the first element or set data values on all elements in the current set.
	 *
	 * @param {string} name The data attribute name.
	 * @param {any} value The value assigned to the data attribute.
	 * @return {any|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.data = function( name, value ){
		if( name !== undefined ){
			if( value !== undefined ){
				return this.each(function(){
					if( !this.shoestringData ){
						this.shoestringData = {};
					}

					this.shoestringData[ name ] = value;
				});
			}
			else {
				if( this[ 0 ] ) {
					if( this[ 0 ].shoestringData ) {
						return this[ 0 ].shoestringData[ name ];
					}
				}
			}
		}
		else {
			return this[ 0 ] ? this[ 0 ].shoestringData || {} : undefined;
		}
	};


	/**
	 * Remove data associated with `name` or all the data, for each element in the current set.
	 *
	 * @param {string} name The data attribute name.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeData = function( name ){
		return this.each(function(){
			if( name !== undefined && this.shoestringData ){
				this.shoestringData[ name ] = undefined;
				delete this.shoestringData[ name ];
			}	else {
				this[ 0 ].shoestringData = {};
			}
		});
	};



	/**
	 * An alias for the `shoestring` constructor.
	 */
	window.$ = shoestring;



	/**
	 * Add a class to each DOM element in the set of elements.
	 *
	 * @param {string} className The name of the class to be added.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.addClass = function( className ){
		var classes = className.replace(/^\s+|\s+$/g, '').split( " " );

		return this.each(function(){
			for( var i = 0, il = classes.length; i < il; i++ ){
				if( this.className !== undefined &&
						(this.className === "" ||
						!this.className.match( new RegExp( "(^|\\s)" + classes[ i ] + "($|\\s)"))) ){
					this.className += " " + classes[ i ];
				}
			}
		});
	};



  /**
	 * Add elements matching the selector to the current set.
	 *
	 * @param {string} selector The selector for the elements to add from the DOM
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.add = function( selector ){
		var ret = [];
		this.each(function(){
			ret.push( this );
		});

		shoestring( selector ).each(function(){
			ret.push( this );
		});

		return shoestring( ret );
	};



	/**
	 * Insert an element or HTML string after each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.after = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		if( fragment.length > 1 ){
			fragment = fragment.reverse();
		}
		return this.each(function( i ){
			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				var insertEl = i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ];
				this.parentNode.insertBefore( insertEl, this.nextSibling );
			}
		});
	};



	/**
	 * Insert an element or HTML string as the last child of each element in the set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.append = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){
			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				this.appendChild( i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ] );
			}
		});
	};



	/**
	 * Insert the current set as the last child of the elements matching the selector.
	 *
	 * @param {string} selector The selector after which to append the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.appendTo = function( selector ){
		return this.each(function(){
			shoestring( selector ).append( this );
		});
	};



  /**
	 * Get the value of the first element of the set or set the value of all the elements in the set.
	 *
	 * @param {string} name The attribute name.
	 * @param {string} value The new value for the attribute.
	 * @return {shoestring|string|undefined}
	 * @this {shoestring}
	 */
	shoestring.fn.attr = function( name, value ){
		var nameStr = typeof( name ) === "string";

		if( value !== undefined || !nameStr ){
			return this.each(function(){
				if( nameStr ){
					this.setAttribute( name, value );
				}	else {
					for( var i in name ){
						if( name.hasOwnProperty( i ) ){
							this.setAttribute( i, name[ i ] );
						}
					}
				}
			});
		} else {
			return this[ 0 ] ? this[ 0 ].getAttribute( name ) : undefined;
		}
	};



	/**
	 * Insert an element or HTML string before each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.before = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){
			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				this.parentNode.insertBefore( i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ], this );
			}
		});
	};



	/**
	 * Get the children of the current collection.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.children = function(){
		var ret = [],
			childs,
			j;
		this.each(function(){
			childs = this.children;
			j = -1;

			while( j++ < childs.length-1 ){
				if( shoestring.inArray(  childs[ j ], ret ) === -1 ){
					ret.push( childs[ j ] );
				}
			}
		});
		return shoestring(ret);
	};



	/**
	 * Clone and return the current set of nodes into a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.clone = function() {
		var ret = [];

		this.each(function() {
			ret.push( this.cloneNode( true ) );
		});

		return shoestring( ret );
	};



	/**
	 * Find an element matching the selector in the set of the current element and its parents.
	 *
	 * @param {string} selector The selector used to identify the target element.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.closest = function( selector ){
		var ret = [];

		if( !selector ){
			return shoestring( ret );
		}

		this.each(function(){
			var element, $self = shoestring( element = this );

			if( $self.is(selector) ){
				ret.push( this );
				return;
			}

			while( element.parentElement ) {
				if( shoestring(element.parentElement).is(selector) ){
					ret.push( element.parentElement );
					break;
				}

				element = element.parentElement;
			}
		});

		return shoestring( ret );
	};



  shoestring.cssExceptions = {
		'float': [ 'cssFloat', 'styleFloat' ] // styleFloat is IE8
	};



	/**
	 * A polyfill to support computed styles in IE < 9
	 *
	 * NOTE this is taken directly from https://github.com/jonathantneal/polyfill
	 */
	(function () {
		function getComputedStylePixel(element, property, fontSize) {
			element.document; // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.

			var
			value = element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
			size = value[1],
			suffix = value[2],
			rootSize;

			fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
			rootSize = property === 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

			return suffix === '%' ? size / 100 * rootSize :
				suffix === 'cm' ? size * 0.3937 * 96 :
				suffix === 'em' ? size * fontSize :
				suffix === 'in' ? size * 96 :
				suffix === 'mm' ? size * 0.3937 * 96 / 10 :
				suffix === 'pc' ? size * 12 * 96 / 72 :
				suffix === 'pt' ? size * 96 / 72 :
				size;
		}

		function setShortStyleProperty(style, property) {
			var
			borderSuffix = property === 'border' ? 'Width' : '',
			t = property + 'Top' + borderSuffix,
			r = property + 'Right' + borderSuffix,
			b = property + 'Bottom' + borderSuffix,
			l = property + 'Left' + borderSuffix;

			style[property] = (style[t] === style[r] && style[t] === style[b] && style[t] === style[l] ? [ style[t] ] :
												 style[t] === style[b] && style[l] === style[r] ? [ style[t], style[r] ] :
												 style[l] === style[r] ? [ style[t], style[r], style[b] ] :
												 [ style[t], style[r], style[b], style[l] ]).join(' ');
		}

		// <CSSStyleDeclaration>
		function CSSStyleDeclaration(element) {
			var
			style = this,
			currentStyle = element.currentStyle,
			fontSize = getComputedStylePixel(element, 'fontSize'),
			unCamelCase = function (match) {
				return '-' + match.toLowerCase();
			},
			property;

			for (property in currentStyle) {
				Array.prototype.push.call(style, property === 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

				if (property === 'width') {
					style[property] = element.offsetWidth + 'px';
				} else if (property === 'height') {
					style[property] = element.offsetHeight + 'px';
				} else if (property === 'styleFloat') {
					style.float = currentStyle[property];
				} else if (/margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
					style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
				} else if (/^outline/.test(property)) {
					// errors on checking outline
					try {
						style[property] = currentStyle[property];
					} catch (error) {
						style.outlineColor = currentStyle.color;
						style.outlineStyle = style.outlineStyle || 'none';
						style.outlineWidth = style.outlineWidth || '0px';
						style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
					}
				} else {
					style[property] = currentStyle[property];
				}
			}

			setShortStyleProperty(style, 'margin');
			setShortStyleProperty(style, 'padding');
			setShortStyleProperty(style, 'border');

			style.fontSize = Math.round(fontSize) + 'px';
		}

		CSSStyleDeclaration.prototype = {
			constructor: CSSStyleDeclaration,
			// <CSSStyleDeclaration>.getPropertyPriority
			getPropertyPriority: function () {
				throw new Error('NotSupportedError: DOM Exception 9');
			},
			// <CSSStyleDeclaration>.getPropertyValue
			getPropertyValue: function (property) {
				return this[property.replace(/-\w/g, function (match) {
					return match[1].toUpperCase();
				})];
			},
			// <CSSStyleDeclaration>.item
			item: function (index) {
				return this[index];
			},
			// <CSSStyleDeclaration>.removeProperty
			removeProperty: function () {
				throw new Error('NoModificationAllowedError: DOM Exception 7');
			},
			// <CSSStyleDeclaration>.setProperty
			setProperty: function () {
				throw new Error('NoModificationAllowedError: DOM Exception 7');
			},
			// <CSSStyleDeclaration>.getPropertyCSSValue
			getPropertyCSSValue: function () {
				throw new Error('NotSupportedError: DOM Exception 9');
			}
		};

		if( !window.getComputedStyle ) {
			// <window>.getComputedStyle
			// NOTE Window is not defined in all browsers
			window.getComputedStyle = function (element) {
				return new CSSStyleDeclaration(element);
			};

			if ( window.Window ) {
				window.Window.prototype.getComputedStyle = window.getComputedStyle;
			}
		}
	})();



	(function() {
		var cssExceptions = shoestring.cssExceptions;

		// IE8 uses marginRight instead of margin-right
		function convertPropertyName( str ) {
			return str.replace( /\-([A-Za-z])/g, function ( match, character ) {
				return character.toUpperCase();
			});
		}

		function _getStyle( element, property ) {
			// polyfilled in getComputedStyle module
			return window.getComputedStyle( element, null ).getPropertyValue( property );
		}

		var vendorPrefixes = [ '', '-webkit-', '-ms-', '-moz-', '-o-', '-khtml-' ];

		/**
		 * Private function for getting the computed style of an element.
		 *
		 * **NOTE** Please use the [css](../css.js.html) method instead.
		 *
		 * @method _getStyle
		 * @param {HTMLElement} element The element we want the style property for.
		 * @param {string} property The css property we want the style for.
		 */
		shoestring._getStyle = function( element, property ) {
			var convert, value, j, k;

			if( cssExceptions[ property ] ) {
				for( j = 0, k = cssExceptions[ property ].length; j < k; j++ ) {
					value = _getStyle( element, cssExceptions[ property ][ j ] );

					if( value ) {
						return value;
					}
				}
			}

			for( j = 0, k = vendorPrefixes.length; j < k; j++ ) {
				convert = convertPropertyName( vendorPrefixes[ j ] + property );

				// VendorprefixKeyName || key-name
				value = _getStyle( element, convert );

				if( convert !== property ) {
					value = value || _getStyle( element, property );
				}

				if( vendorPrefixes[ j ] ) {
					// -vendorprefix-key-name
					value = value || _getStyle( element, vendorPrefixes[ j ] + property );
				}

				if( value ) {
					return value;
				}
			}

			return undefined;
		};
	})();



	(function() {
		var cssExceptions = shoestring.cssExceptions;

		// IE8 uses marginRight instead of margin-right
		function convertPropertyName( str ) {
			return str.replace( /\-([A-Za-z])/g, function ( match, character ) {
				return character.toUpperCase();
			});
		}

		/**
		 * Private function for setting the style of an element.
		 *
		 * **NOTE** Please use the [css](../css.js.html) method instead.
		 *
		 * @method _setStyle
		 * @param {HTMLElement} element The element we want to style.
		 * @param {string} property The property being used to style the element.
		 * @param {string} value The css value for the style property.
		 */
		shoestring._setStyle = function( element, property, value ) {
			var convertedProperty = convertPropertyName(property);

			element.style[ property ] = value;

			if( convertedProperty !== property ) {
				element.style[ convertedProperty ] = value;
			}

			if( cssExceptions[ property ] ) {
				for( var j = 0, k = cssExceptions[ property ].length; j<k; j++ ) {
					element.style[ cssExceptions[ property ][ j ] ] = value;
				}
			}
		};
	})();



	/**
	 * Get the compute style property of the first element or set the value of a style property
	 * on all elements in the set.
	 *
	 * @method _setStyle
	 * @param {string} property The property being used to style the element.
	 * @param {string|undefined} value The css value for the style property.
	 * @return {string|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.css = function( property, value ){
		if( !this[0] ){
			return;
		}

		if( typeof property === "object" ) {
			return this.each(function() {
				for( var key in property ) {
					if( property.hasOwnProperty( key ) ) {
						shoestring._setStyle( this, key, property[key] );
					}
				}
			});
		}	else {
			// assignment else retrieve first
			if( value !== undefined ){
				return this.each(function(){
					shoestring._setStyle( this, property, value );
				});
			}

			return shoestring._getStyle( this[0], property );
		}
	};



	/**
	 * Returns the indexed element wrapped in a new `shoestring` object.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.eq = function( index ){
		if( this[index] ){
			return shoestring( this[index] );
		}

		return shoestring([]);
	};



	/**
	 * Filter out the current set if they do *not* match the passed selector or
	 * the supplied callback returns false
	 *
	 * @param {string,function} selector The selector or boolean return value callback used to filter the elements.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.filter = function( selector ){
		var ret = [];

		this.each(function( index ){
			var wsel;

			if( typeof selector === 'function' ) {
				if( selector.call( this, index ) !== false ) {
					ret.push( this );
				}
			} else {
				if( !this.parentNode ){
					var context = shoestring( document.createDocumentFragment() );

					context[ 0 ].appendChild( this );
					wsel = shoestring( selector, context );
				} else {
					wsel = shoestring( selector, this.parentNode );
				}

				if( shoestring.inArray( this, wsel ) > -1 ){
					ret.push( this );
				}
			}
		});

		return shoestring( ret );
	};



	/**
	 * Find descendant elements of the current collection.
	 *
	 * @param {string} selector The selector used to find the children
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.find = function( selector ){
		var ret = [],
			finds;
		this.each(function(){
				finds = this.querySelectorAll( selector );

			for( var i = 0, il = finds.length; i < il; i++ ){
				ret = ret.concat( finds[i] );
			}
		});
		return shoestring( ret );
	};



	/**
	 * Returns the first element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.first = function(){
		return this.eq( 0 );
	};



	/**
	 * Returns the raw DOM node at the passed index.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return HTMLElement
	 * @this shoestring
	 */
	shoestring.fn.get = function( index ){
		return this[ index ];
	};



	/**
	 * Private function for setting/getting the offset property for height/width.
	 *
	 * **NOTE** Please use the [width](width.js.html) or [height](height.js.html) methods instead.
	 *
	 * @param {shoestring} set The set of elements.
	 * @param {string} name The string "height" or "width".
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this window
	 */
	shoestring._dimension = function( set, name, value ){
		var offsetName;

		if( value === undefined ){
			offsetName = name.replace(/^[a-z]/, function( letter ) {
				return letter.toUpperCase();
			});

			return set[ 0 ][ "offset" + offsetName ];
		} else {
			// support integer values as pixels
			value = typeof value === "string" ? value : value + "px";

			return set.each(function(){
				this.style[ name ] = value;
			});
		}
	};



	/**
	 * Gets the height value of the first element or sets the height for the whole set.
	 *
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.height = function( value ){
		return shoestring._dimension( this, "height", value );
	};



	var set = function( html ){
		if( typeof html === "string" ){
			return this.each(function(){
				this.innerHTML = html;
			});
		} else {
			var h = "";
			if( typeof html.length !== "undefined" ){
				for( var i = 0, l = html.length; i < l; i++ ){
					h += html[i].outerHTML;
				}
			} else {
				h = html.outerHTML;
			}
			return this.each(function(){
				this.innerHTML = h;
			});
		}
	};
	/**
	 * Gets or sets the `innerHTML` from all the elements in the set.
	 *
	 * @param {string|undefined} html The html to assign
	 * @return {string|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.html = function( html ){
				if( typeof html !== "undefined" ){
			return set.call( this, html );
		} else { // get
			var pile = "";

			this.each(function(){
				pile += this.innerHTML;
			});

			return pile;
		}
	};



	(function() {
		function _getIndex( set, test ) {
			var i, result, element;

			for( i = result = 0; i < set.length; i++ ) {
				element = set.item ? set.item(i) : set[i];

				if( test(element) ){
					return result;
				}

				// ignore text nodes, etc
				// NOTE may need to be more permissive
				if( element.nodeType === 1 ){
					result++;
				}
			}

			return -1;
		}

		/**
		 * Find the index in the current set for the passed selector.
		 * Without a selector it returns the index of the first node within the array of its siblings.
		 *
		 * @param {string|undefined} selector The selector used to search for the index.
		 * @return {integer}
		 * @this {shoestring}
		 */
		shoestring.fn.index = function( selector ){
			var self, children;

			self = this;

			// no arg? check the children, otherwise check each element that matches
			if( selector === undefined ){
				children = ( ( this[ 0 ] && this[0].parentNode ) || document.documentElement).childNodes;

				// check if the element matches the first of the set
				return _getIndex(children, function( element ) {
					return self[0] === element;
				});
			} else {

				// check if the element matches the first selected node from the parent
				return _getIndex(self, function( element ) {
					return element === (shoestring( selector, element.parentNode )[ 0 ]);
				});
			}
		};
	})();



	/**
	 * Insert the current set after the elements matching the selector.
	 *
	 * @param {string} selector The selector after which to insert the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.insertAfter = function( selector ){
		return this.each(function(){
			shoestring( selector ).after( this );
		});
	};



	/**
	 * Insert the current set before the elements matching the selector.
	 *
	 * @param {string} selector The selector before which to insert the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.insertBefore = function( selector ){
		return this.each(function(){
			shoestring( selector ).before( this );
		});
	};



	/**
	 * Returns the last element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.last = function(){
		return this.eq( this.length - 1 );
	};



	/**
	 * Returns a `shoestring` object with the set of siblings of each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.next = function(){
		
		var result = [];

		// TODO need to implement map
		this.each(function() {
			var children, item, found;

			// get the child nodes for this member of the set
			children = shoestring( this.parentNode )[0].childNodes;

			for( var i = 0; i < children.length; i++ ){
				item = children.item( i );

				// found the item we needed (found) which means current item value is
				// the next node in the list, as long as it's viable grab it
				// NOTE may need to be more permissive
				if( found && item.nodeType === 1 ){
					result.push( item );
					break;
				}

				// find the current item and mark it as found
				if( item === this ){
					found = true;
				}
			}
		});

		return shoestring( result );
	};



	/**
	 * Removes elements from the current set.
	 *
	 * @param {string} selector The selector to use when removing the elements.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.not = function( selector ){
		var ret = [];

		this.each(function(){
			var found = shoestring( selector, this.parentNode );

			if( shoestring.inArray(this, found) === -1 ){
				ret.push( this );
			}
		});

		return shoestring( ret );
	};



	/**
	 * Returns an object with the `top` and `left` properties corresponging to the first elements offsets.
	 *
	 * @return object
	 * @this shoestring
	 */
	shoestring.fn.offset = function(){
		return {
			top: this[ 0 ].offsetTop,
			left: this[ 0 ].offsetLeft
		};
	};



	/**
	 * Returns the set of first parents for each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.parent = function(){
		var ret = [],
			parent;

		this.each(function(){
			// no parent node, assume top level
			// jQuery parent: return the document object for <html> or the parent node if it exists
			parent = (this === document.documentElement ? document : this.parentNode);

			// if there is a parent and it's not a document fragment
			if( parent && parent.nodeType !== 11 ){
				ret.push( parent );
			}
		});

		return shoestring(ret);
	};



	/**
	 * Returns the set of all parents matching the selector if provided for each element in the current set.
	 *
	 * @param {string} selector The selector to check the parents with.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.parents = function( selector ){
		var ret = [];

		this.each(function(){
			var curr = this, match;

			while( curr.parentElement && !match ){
				curr = curr.parentElement;

				if( selector ){
					if( curr === shoestring( selector )[0] ){
						match = true;

						if( shoestring.inArray( curr, ret ) === -1 ){
							ret.push( curr );
						}
					}
				} else {
					if( shoestring.inArray( curr, ret ) === -1 ){
						ret.push( curr );
					}
				}
			}
		});

		return shoestring(ret);
	};



	/**
	 * Add an HTML string or element before the children of each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML string or element to add.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prepend = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){

			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				var insertEl = i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ];
				if ( this.firstChild ){
					this.insertBefore( insertEl, this.firstChild );
				} else {
					this.appendChild( insertEl );
				}
			}
		});
	};



	/**
	 * Add each element of the current set before the children of the selected elements.
	 *
	 * @param {string} selector The selector for the elements to add the current set to..
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prependTo = function( selector ){
		return this.each(function(){
			shoestring( selector ).prepend( this );
		});
	};



	/**
	 * Returns a `shoestring` object with the set of *one* siblingx before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prev = function(){
		
		var result = [];

		// TODO need to implement map
		this.each(function() {
			var children, item, found;

			// get the child nodes for this member of the set
			children = shoestring( this.parentNode )[0].childNodes;

			for( var i = children.length -1; i >= 0; i-- ){
				item = children.item( i );

				// found the item we needed (found) which means current item value is
				// the next node in the list, as long as it's viable grab it
				// NOTE may need to be more permissive
				if( found && item.nodeType === 1 ){
					result.push( item );
					break;
				}

				// find the current item and mark it as found
				if( item === this ){
					found = true;
				}
			}
		});

		return shoestring( result );
	};



	/**
	 * Returns a `shoestring` object with the set of *all* siblings before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prevAll = function(){
		
		var result = [];

		this.each(function() {
			var $previous = shoestring( this ).prev();

			while( $previous.length ){
				result.push( $previous[0] );
				$previous = $previous.prev();
			}
		});

		return shoestring( result );
	};



	// Property normalization, a subset taken from jQuery src
	shoestring.propFix = {
		"class": "className",
		contenteditable: "contentEditable",
		"for": "htmlFor",
		readonly: "readOnly",
		tabindex: "tabIndex"
	};



	/**
	 * Gets the property value from the first element or sets the property value on all elements of the currrent set.
   *
	 * @param {string} name The property name.
   * @param {any} value The property value.
	 * @return {any|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.prop = function( name, value ){
		if( !this[0] ){
			return;
		}

		name = shoestring.propFix[ name ] || name;

		if( value !== undefined ){
			return this.each(function(){
				this[ name ] = value;
			});
		}	else {
			return this[ 0 ][ name ];
		}
	};



	/**
	 * Remove an attribute from each element in the current set.
	 *
	 * @param {string} name The name of the attribute.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeAttr = function( name ){
		return this.each(function(){
			this.removeAttribute( name );
		});
	};



	/**
	 * Remove a class from each DOM element in the set of elements.
	 *
	 * @param {string} className The name of the class to be removed.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeClass = function( cname ){
		var classes = cname.replace(/^\s+|\s+$/g, '').split( " " );

		return this.each(function(){
			var newClassName, regex;

			for( var i = 0, il = classes.length; i < il; i++ ){
				if( this.className !== undefined ){
					regex = new RegExp( "(^|\\s)" + classes[ i ] + "($|\\s)", "gmi" );
					newClassName = this.className.replace( regex, " " );

					this.className = newClassName.replace(/^\s+|\s+$/g, '');
				}
			}
		});
	};



	/**
	 * Remove the current set of elements from the DOM.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.remove = function(){
		return this.each(function(){
			if( this.parentNode ) {
				this.parentNode.removeChild( this );
			}
		});
	};



	/**
	 * Remove a proprety from each element in the current set.
	 *
	 * @param {string} name The name of the property.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeProp = function( property ){
		var name = shoestring.propFix[ property ] || property;

		return this.each(function(){
			this[ name ] = undefined;
			delete this[ name ];
		});
	};



	/**
	 * Replace each element in the current set with that argument HTML string or HTMLElement.
	 *
	 * @param {string|HTMLElement} fragment The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.replaceWith = function( fragment ){
		if( typeof( fragment ) === "string" ){
			fragment = shoestring( fragment );
		}

		var ret = [];

		if( fragment.length > 1 ){
			fragment = fragment.reverse();
		}
		this.each(function( i ){
			var clone = this.cloneNode( true ),
				insertEl;
			ret.push( clone );

			// If there is no parentNode, this is pointless, drop it.
			if( !this.parentNode ){ return; }

			if( fragment.length === 1 ){
				insertEl = i > 0 ? fragment[ 0 ].cloneNode( true ) : fragment[ 0 ];
				this.parentNode.replaceChild( insertEl, this );
			} else {
				for( var j = 0, jl = fragment.length; j < jl; j++ ){
					insertEl = i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ];
					this.parentNode.insertBefore( insertEl, this.nextSibling );
				}
				this.parentNode.removeChild( this );
			}
		});

		return shoestring( ret );
	};



	shoestring.inputTypes = [
		"text",
		"hidden",
		"password",
		"color",
		"date",
		"datetime",
		// "datetime\-local" matched by datetime
		"email",
		"month",
		"number",
		"range",
		"search",
		"tel",
		"time",
		"url",
		"week"
	];

	shoestring.inputTypeTest = new RegExp( shoestring.inputTypes.join( "|" ) );


	/**
	 * Serialize child input element values into an object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.serialize = function(){
		var data = {};

		shoestring( "input, select", this ).each(function(){
			var type = this.type, name = this.name,	value = this.value;

			if( shoestring.inputTypeTest.test( type ) ||
					( type === "checkbox" || type === "radio" ) &&
					this.checked ){

				data[ name ] = value;
			}	else if( this.nodeName === "SELECT" ){
				data[ name ] = this.options[ this.selectedIndex ].nodeValue;
			}
		});

		return data;
	};



  /**
	 * Get all of the sibling elements for each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.siblings = function(){
		
		if( !this.length ) {
			return shoestring( [] );
		}

		var sibs = [], el = this[ 0 ].parentNode.firstChild;

		do {
			if( el.nodeType === 1 && el !== this[ 0 ] ) {
				sibs.push( el );
			}

      el = el.nextSibling;
		} while( el );

		return shoestring( sibs );
	};



	var getText = function( elem ){
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

  /**
	 * Recursively retrieve the text content of the each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.text = function() {
		
		return getText( this );
	};




	/**
	 * Get the value of the first element or set the value of all elements in the current set.
	 *
	 * @param {string} value The value to set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.val = function( value ){
		var el;
		if( value !== undefined ){
			return this.each(function(){
				if( this.tagName === "SELECT" ){
					var optionSet, option,
						options = this.options,
						values = [],
						i = options.length,
						newIndex;

					values[0] = value;
					while ( i-- ) {
						option = options[ i ];
						if ( (option.selected = shoestring.inArray( option.value, values ) >= 0) ) {
							optionSet = true;
							newIndex = i;
						}
					}
					// force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						this.selectedIndex = -1;
					} else {
						this.selectedIndex = newIndex;
					}
				} else {
					this.value = value;
				}
			});
		} else {
			el = this[0];

			if( el.tagName === "SELECT" ){
				if( el.selectedIndex < 0 ){ return ""; }
				return el.options[ el.selectedIndex ].value;
			} else {
				return el.value;
			}
		}
	};



	/**
	 * Gets the width value of the first element or sets the width for the whole set.
	 *
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.width = function( value ){
		return shoestring._dimension( this, "width", value );
	};



	/**
	 * Wraps the child elements in the provided HTML.
	 *
	 * @param {string} html The wrapping HTML.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.wrapInner = function( html ){
		return this.each(function(){
			var inH = this.innerHTML;

			this.innerHTML = "";
			shoestring( this ).append( shoestring( html ).html( inH ) );
		});
	};



	function initEventCache( el, evt ) {
		if ( !el.shoestringData ) {
			el.shoestringData = {};
		}
		if ( !el.shoestringData.events ) {
			el.shoestringData.events = {};
		}
		if ( !el.shoestringData.loop ) {
			el.shoestringData.loop = {};
		}
		if ( !el.shoestringData.events[ evt ] ) {
			el.shoestringData.events[ evt ] = [];
		}
	}

	function addToEventCache( el, evt, eventInfo ) {
		var obj = {};
		obj.isCustomEvent = eventInfo.isCustomEvent;
		obj.callback = eventInfo.callfunc;
		obj.originalCallback = eventInfo.originalCallback;
		obj.namespace = eventInfo.namespace;

		el.shoestringData.events[ evt ].push( obj );

		if( eventInfo.customEventLoop ) {
			el.shoestringData.loop[ evt ] = eventInfo.customEventLoop;
		}
	}

	// In IE8 the events trigger in a reverse order (LIFO). This code
	// unbinds and rebinds all callbacks on an element in the a FIFO order.
	function reorderEvents( node, eventName ) {
		if( node.addEventListener || !node.shoestringData || !node.shoestringData.events ) {
			// add event listner obviates the need for all the callback order juggling
			return;
		}

		var otherEvents = node.shoestringData.events[ eventName ] || [];
		for( var j = otherEvents.length - 1; j >= 0; j-- ) {
			// DOM Events only, Custom events maintain their own order internally.
			if( !otherEvents[ j ].isCustomEvent ) {
				node.detachEvent( "on" + eventName, otherEvents[ j ].callback );
				node.attachEvent( "on" + eventName, otherEvents[ j ].callback );
			}
		}
	}

	/**
	 * Bind a callback to an event for the currrent set of elements.
	 *
	 * @param {string} evt The event(s) to watch for.
	 * @param {object,function} data Data to be included with each event or the callback.
	 * @param {function} originalCallback Callback to be invoked when data is define.d.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.bind = function( evt, data, originalCallback ){

				if( typeof data === "function" ){
			originalCallback = data;
			data = null;
		}

		var evts = evt.split( " " ),
			docEl = document.documentElement;

		// NOTE the `triggeredElement` is purely for custom events from IE
		function encasedCallback( e, namespace, triggeredElement ){
			var result;

			if( e._namespace && e._namespace !== namespace ) {
				return;
			}

			e.data = data;
			e.namespace = e._namespace;

			var returnTrue = function(){
				return true;
			};

			e.isDefaultPrevented = function(){
				return false;
			};

			var originalPreventDefault = e.preventDefault;
			var preventDefaultConstructor = function(){
				if( originalPreventDefault ) {
					return function(){
						e.isDefaultPrevented = returnTrue;
						originalPreventDefault.call(e);
					};
				} else {
					return function(){
						e.isDefaultPrevented = returnTrue;
						e.returnValue = false;
					};
				}
			};

			// thanks https://github.com/jonathantneal/EventListener
			e.target = triggeredElement || e.target || e.srcElement;
			e.preventDefault = preventDefaultConstructor();
			e.stopPropagation = e.stopPropagation || function () {
				e.cancelBubble = true;
			};

			result = originalCallback.apply(this, [ e ].concat( e._args ) );

			if( result === false ){
				e.preventDefault();
				e.stopPropagation();
			}

			return result;
		}

		// This is exclusively for custom events on browsers without addEventListener (IE8)
		function propChange( originalEvent, boundElement, namespace ) {
			var lastEventInfo = document.documentElement[ originalEvent.propertyName ],
				triggeredElement = lastEventInfo.el;

			var boundCheckElement = boundElement;

			if( boundElement === document && triggeredElement !== document ) {
				boundCheckElement = document.documentElement;
			}

			if( triggeredElement !== undefined &&
				shoestring( triggeredElement ).closest( boundCheckElement ).length ) {

				originalEvent._namespace = lastEventInfo._namespace;
				originalEvent._args = lastEventInfo._args;
				encasedCallback.call( boundElement, originalEvent, namespace, triggeredElement );
			}
		}

		return this.each(function(){
			var domEventCallback,
				customEventCallback,
				customEventLoop,
				oEl = this;

			for( var i = 0, il = evts.length; i < il; i++ ){
				var split = evts[ i ].split( "." ),
					evt = split[ 0 ],
					namespace = split.length > 0 ? split[ 1 ] : null;

				domEventCallback = function( originalEvent ) {
					if( oEl.ssEventTrigger ) {
						originalEvent._namespace = oEl.ssEventTrigger._namespace;
						originalEvent._args = oEl.ssEventTrigger._args;

						oEl.ssEventTrigger = null;
					}
					return encasedCallback.call( oEl, originalEvent, namespace );
				};
				customEventCallback = null;
				customEventLoop = null;

				initEventCache( this, evt );

				if( "addEventListener" in this ){
					this.addEventListener( evt, domEventCallback, false );
				} else if( this.attachEvent ){
					if( this[ "on" + evt ] !== undefined ) {
						this.attachEvent( "on" + evt, domEventCallback );
					} else {
						customEventCallback = (function() {
							var eventName = evt;
							return function( e ) {
								if( e.propertyName === eventName ) {
									propChange( e, oEl, namespace );
								}
							};
						})();

						// only assign one onpropertychange per element
						if( this.shoestringData.events[ evt ].length === 0 ) {
							customEventLoop = (function() {
								var eventName = evt;
								return function( e ) {
									if( !oEl.shoestringData || !oEl.shoestringData.events ) {
										return;
									}
									var events = oEl.shoestringData.events[ eventName ];
									if( !events ) {
										return;
									}

									// TODO stopImmediatePropagation
									for( var j = 0, k = events.length; j < k; j++ ) {
										events[ j ].callback( e );
									}
								};
							})();

							docEl.attachEvent( "onpropertychange", customEventLoop );
						}
					}
				}

				addToEventCache( this, evt, {
					callfunc: customEventCallback || domEventCallback,
					isCustomEvent: !!customEventCallback,
					customEventLoop: customEventLoop,
					originalCallback: originalCallback,
					namespace: namespace
				});

				// Don’t reorder custom events, only DOM Events.
				if( !customEventCallback ) {
					reorderEvents( oEl, evt );
				}
			}
		});
	};

	shoestring.fn.on = shoestring.fn.bind;

	


	/**
	 * Unbind a previous bound callback for an event.
	 *
	 * @param {string} event The event(s) the callback was bound to..
	 * @param {function} callback Callback to unbind.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.unbind = function( event, callback ){

		
		var evts = event ? event.split( " " ) : [];

		return this.each(function(){
			if( !this.shoestringData || !this.shoestringData.events ) {
				return;
			}

			if( !evts.length ) {
				unbindAll.call( this );
			} else {
				var split, evt, namespace;
				for( var i = 0, il = evts.length; i < il; i++ ){
					split = evts[ i ].split( "." ),
					evt = split[ 0 ],
					namespace = split.length > 0 ? split[ 1 ] : null;

					if( evt ) {
						unbind.call( this, evt, namespace, callback );
					} else {
						unbindAll.call( this, namespace, callback );
					}
				}
			}
		});
	};

	function unbind( evt, namespace, callback ) {
		var bound = this.shoestringData.events[ evt ];
		if( !(bound && bound.length) ) {
			return;
		}

		var matched = [], j, jl;
		for( j = 0, jl = bound.length; j < jl; j++ ) {
			if( !namespace || namespace === bound[ j ].namespace ) {
				if( callback === undefined || callback === bound[ j ].originalCallback ) {
					if( "removeEventListener" in window ){
						this.removeEventListener( evt, bound[ j ].callback, false );
					} else if( this.detachEvent ){
						// dom event
						this.detachEvent( "on" + evt, bound[ j ].callback );

						// only unbind custom events if its the last one on the element
						if( bound.length === 1 && this.shoestringData.loop && this.shoestringData.loop[ evt ] ) {
							document.documentElement.detachEvent( "onpropertychange", this.shoestringData.loop[ evt ] );
						}
					}
					matched.push( j );
				}
			}
		}

		for( j = 0, jl = matched.length; j < jl; j++ ) {
			this.shoestringData.events[ evt ].splice( j, 1 );
		}
	}

	function unbindAll( namespace, callback ) {
		for( var evtKey in this.shoestringData.events ) {
			unbind.call( this, evtKey, namespace, callback );
		}
	}

	shoestring.fn.off = shoestring.fn.unbind;


	/**
	 * Bind a callback to an event for the currrent set of elements, unbind after one occurence.
	 *
	 * @param {string} event The event(s) to watch for.
	 * @param {function} callback Callback to invoke on the event.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.one = function( event, callback ){
		var evts = event.split( " " );

		return this.each(function(){
			var thisevt, cbs = {},	$t = shoestring( this );

			for( var i = 0, il = evts.length; i < il; i++ ){
				thisevt = evts[ i ];

				cbs[ thisevt ] = function( e ){
					var $t = shoestring( this );

					for( var j in cbs ) {
						$t.unbind( j, cbs[ j ] );
					}

					return callback.apply( this, [ e ].concat( e._args ) );
				};

				$t.bind( thisevt, cbs[ thisevt ] );
			}
		});
	};



	/**
	 * Trigger an event on the first element in the set, no bubbling, no defaults.
	 *
	 * @param {string} event The event(s) to trigger.
	 * @param {object} args Arguments to append to callback invocations.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.triggerHandler = function( event, args ){
		var e = event.split( " " )[ 0 ],
			el = this[ 0 ],
			ret;

		// TODO needs IE8 support
		// See this.fireEvent( 'on' + evts[ i ], document.createEventObject() ); instead of click() etc in trigger.
		if( document.createEvent && el.shoestringData && el.shoestringData.events && el.shoestringData.events[ e ] ){
			var bindings = el.shoestringData.events[ e ];
			for (var i in bindings ){
				if( bindings.hasOwnProperty( i ) ){
					event = document.createEvent( "Event" );
					event.initEvent( e, true, true );
					event._args = args;
					args.unshift( event );

					ret = bindings[ i ].originalCallback.apply( event.target, args );
				}
			}
		}

		return ret;
	};



	/**
	 * Trigger an event on each of the DOM elements in the current set.
	 *
	 * @param {string} event The event(s) to trigger.
	 * @param {object} args Arguments to append to callback invocations.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.trigger = function( event, args ){
		var evts = event.split( " " );

		return this.each(function(){
			var split, evt, namespace;
			for( var i = 0, il = evts.length; i < il; i++ ){
				split = evts[ i ].split( "." ),
				evt = split[ 0 ],
				namespace = split.length > 0 ? split[ 1 ] : null;

				if( evt === "click" ){
					if( this.tagName === "INPUT" && this.type === "checkbox" && this.click ){
						this.click();
						return false;
					}
				}

				if( document.createEvent ){
					var event = document.createEvent( "Event" );
					event.initEvent( evt, true, true );
					event._args = args;
					event._namespace = namespace;

					this.dispatchEvent( event );
				} else if ( document.createEventObject ) {
					if( ( "" + this[ evt ] ).indexOf( "function" ) > -1 ) {
						this.ssEventTrigger = {
							_namespace: namespace,
							_args: args
						};

						this[ evt ]();
					} else {
						document.documentElement[ evt ] = {
							"el": this,
							_namespace: namespace,
							_args: args
						};
					}
				}
			}
		});
	};



})( this );
},{}]},{},[1]);
