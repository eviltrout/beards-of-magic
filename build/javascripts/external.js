/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2011-2012 Tilde Inc. and contributors
//            Portions ©2006-2011 Strobe Inc.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


(function(){var a={};window.Handlebars=a,a.VERSION="1.0.beta.2",a.helpers={},a.partials={},a.registerHelper=function(a,b,c){c&&(b.not=c),this.helpers[a]=b},a.registerPartial=function(a,b){this.partials[a]=b},a.registerHelper("helperMissing",function(a){if(arguments.length===2)return undefined;throw new Error("Could not find property '"+a+"'")}),a.registerHelper("blockHelperMissing",function(a,b){var c=b.inverse||function(){},d=b.fn,e="",f=Object.prototype.toString.call(a);f==="[object Function]"&&(a=a());if(a===!0)return d(this);if(a===!1||a==null)return c(this);if(f==="[object Array]"){if(a.length>0)for(var g=0,h=a.length;g<h;g++)e+=d(a[g]);else e=c(this);return e}return d(a)}),a.registerHelper("each",function(a,b){var c=b.fn,d=b.inverse,e="";if(a&&a.length>0)for(var f=0,g=a.length;f<g;f++)e+=c(a[f]);else e=d(this);return e}),a.registerHelper("if",function(b,c){return!b||a.Utils.isEmpty(b)?c.inverse(this):c.fn(this)}),a.registerHelper("unless",function(b,c){var d=c.fn,e=c.inverse;return c.fn=e,c.inverse=d,a.helpers["if"].call(this,b,c)}),a.registerHelper("with",function(a,b){return b.fn(a)}),a.registerHelper("log",function(b){a.log(b)});var b=function(){var a={trace:function(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,statements:6,simpleInverse:7,statement:8,openInverse:9,closeBlock:10,openBlock:11,mustache:12,partial:13,CONTENT:14,COMMENT:15,OPEN_BLOCK:16,inMustache:17,CLOSE:18,OPEN_INVERSE:19,OPEN_ENDBLOCK:20,path:21,OPEN:22,OPEN_UNESCAPED:23,OPEN_PARTIAL:24,params:25,hash:26,param:27,STRING:28,INTEGER:29,BOOLEAN:30,hashSegments:31,hashSegment:32,ID:33,EQUALS:34,pathSegments:35,SEP:36,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},productions_:[0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],performAction:function d(a,b,c,d,e,f,g){var h=f.length-1;switch(e){case 1:return f[h-1];case 2:this.$=new d.ProgramNode(f[h-2],f[h]);break;case 3:this.$=new d.ProgramNode(f[h]);break;case 4:this.$=new d.ProgramNode([]);break;case 5:this.$=[f[h]];break;case 6:f[h-1].push(f[h]),this.$=f[h-1];break;case 7:this.$=new d.InverseNode(f[h-2],f[h-1],f[h]);break;case 8:this.$=new d.BlockNode(f[h-2],f[h-1],f[h]);break;case 9:this.$=f[h];break;case 10:this.$=f[h];break;case 11:this.$=new d.ContentNode(f[h]);break;case 12:this.$=new d.CommentNode(f[h]);break;case 13:this.$=new d.MustacheNode(f[h-1][0],f[h-1][1]);break;case 14:this.$=new d.MustacheNode(f[h-1][0],f[h-1][1]);break;case 15:this.$=f[h-1];break;case 16:this.$=new d.MustacheNode(f[h-1][0],f[h-1][1]);break;case 17:this.$=new d.MustacheNode(f[h-1][0],f[h-1][1],!0);break;case 18:this.$=new d.PartialNode(f[h-1]);break;case 19:this.$=new d.PartialNode(f[h-2],f[h-1]);break;case 20:break;case 21:this.$=[[f[h-2]].concat(f[h-1]),f[h]];break;case 22:this.$=[[f[h-1]].concat(f[h]),null];break;case 23:this.$=[[f[h-1]],f[h]];break;case 24:this.$=[[f[h]],null];break;case 25:f[h-1].push(f[h]),this.$=f[h-1];break;case 26:this.$=[f[h]];break;case 27:this.$=f[h];break;case 28:this.$=new d.StringNode(f[h]);break;case 29:this.$=new d.IntegerNode(f[h]);break;case 30:this.$=new d.BooleanNode(f[h]);break;case 31:this.$=new d.HashNode(f[h]);break;case 32:f[h-1].push(f[h]),this.$=f[h-1];break;case 33:this.$=[f[h]];break;case 34:this.$=[f[h-2],f[h]];break;case 35:this.$=[f[h-2],new d.StringNode(f[h])];break;case 36:this.$=[f[h-2],new d.IntegerNode(f[h])];break;case 37:this.$=[f[h-2],new d.BooleanNode(f[h])];break;case 38:this.$=new d.IdNode(f[h]);break;case 39:f[h-2].push(f[h]),this.$=f[h-2];break;case 40:this.$=[f[h]]}},table:[{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],defaultActions:{16:[2,1],37:[2,23],53:[2,21]},parseError:function(a,b){throw new Error(a)},parse:function f(a){function n(a){c.length=c.length-2*a,d.length=d.length-a,e.length=e.length-a}function o(){var a;return a=b.lexer.lex()||1,typeof a!="number"&&(a=b.symbols_[a]||a),a}var b=this,c=[0],d=[null],e=[],f=this.table,g="",h=0,i=0,j=0,k=2,l=1;this.lexer.setInput(a),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,typeof this.lexer.yylloc=="undefined"&&(this.lexer.yylloc={});var m=this.lexer.yylloc;e.push(m),typeof this.yy.parseError=="function"&&(this.parseError=this.yy.parseError);var p,q,r,s,t,u,v={},w,x,y,z;for(;;){r=c[c.length-1],this.defaultActions[r]?s=this.defaultActions[r]:(p==null&&(p=o()),s=f[r]&&f[r][p]);if(typeof s=="undefined"||!s.length||!s[0]){if(!j){z=[];for(w in f[r])this.terminals_[w]&&w>2&&z.push("'"+this.terminals_[w]+"'");var A="";this.lexer.showPosition?A="Parse error on line "+(h+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+z.join(", "):A="Parse error on line "+(h+1)+": Unexpected "+(p==1?"end of input":"'"+(this.terminals_[p]||p)+"'"),this.parseError(A,{text:this.lexer.match,token:this.terminals_[p]||p,line:this.lexer.yylineno,loc:m,expected:z})}if(j==3){if(p==l)throw new Error(A||"Parsing halted.");i=this.lexer.yyleng,g=this.lexer.yytext,h=this.lexer.yylineno,m=this.lexer.yylloc,p=o()}for(;;){if(k.toString()in f[r])break;if(r==0)throw new Error(A||"Parsing halted.");n(1),r=c[c.length-1]}q=p,p=k,r=c[c.length-1],s=f[r]&&f[r][k],j=3}if(s[0]instanceof Array&&s.length>1)throw new Error("Parse Error: multiple actions possible at state: "+r+", token: "+p);switch(s[0]){case 1:c.push(p),d.push(this.lexer.yytext),e.push(this.lexer.yylloc),c.push(s[1]),p=null,q?(p=q,q=null):(i=this.lexer.yyleng,g=this.lexer.yytext,h=this.lexer.yylineno,m=this.lexer.yylloc,j>0&&j--);break;case 2:x=this.productions_[s[1]][1],v.$=d[d.length-x],v._$={first_line:e[e.length-(x||1)].first_line,last_line:e[e.length-1].last_line,first_column:e[e.length-(x||1)].first_column,last_column:e[e.length-1].last_column},u=this.performAction.call(v,g,i,h,this.yy,s[1],d,e);if(typeof u!="undefined")return u;x&&(c=c.slice(0,-1*x*2),d=d.slice(0,-1*x),e=e.slice(0,-1*x)),c.push(this.productions_[s[1]][0]),d.push(v.$),e.push(v._$),y=f[c[c.length-2]][c[c.length-1]],c.push(y);break;case 3:return!0}}return!0}},b=function(){var a={EOF:1,parseError:function b(a,b){if(this.yy.parseError)this.yy.parseError(a,b);else throw new Error(a)},setInput:function(a){return this._input=a,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this},input:function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.match+=a,this.matched+=a;var b=a.match(/\n/);return b&&this.yylineno++,this._input=this._input.slice(1),a},unput:function(a){return this._input=a+this._input,this},more:function(){return this._more=!0,this},pastInput:function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var a=this.match;return a.length<20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var a=this.pastInput(),b=(new Array(a.length+1)).join("-");return a+this.upcomingInput()+"\n"+b+"^"},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var a,b,c,d;this._more||(this.yytext="",this.match="");var e=this._currentRules();for(var f=0;f<e.length;f++){b=this._input.match(this.rules[e[f]]);if(b){d=b[0].match(/\n.*/g),d&&(this.yylineno+=d.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:d?d[d.length-1].length-1:this.yylloc.last_column+b[0].length},this.yytext+=b[0],this.match+=b[0],this.matches=b,this.yyleng=this.yytext.length,this._more=!1,this._input=this._input.slice(b[0].length),this.matched+=b[0],a=this.performAction.call(this,this.yy,this,e[f],this.conditionStack[this.conditionStack.length-1]);if(a)return a;return}}if(this._input==="")return this.EOF;this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var a=this.next();return typeof a!="undefined"?a:this.lex()},begin:function(a){this.conditionStack.push(a)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}};return a.performAction=function(a,b,c,d){var e=d;switch(c){case 0:this.begin("mu");if(b.yytext)return 14;break;case 1:return 14;case 2:return 24;case 3:return 16;case 4:return 20;case 5:return 19;case 6:return 19;case 7:return 23;case 8:return 23;case 9:return b.yytext=b.yytext.substr(3,b.yyleng-5),this.begin("INITIAL"),15;case 10:return 22;case 11:return 34;case 12:return 33;case 13:return 33;case 14:return 36;case 15:break;case 16:return this.begin("INITIAL"),18;case 17:return this.begin("INITIAL"),18;case 18:return b.yytext=b.yytext.substr(1,b.yyleng-2).replace(/\\"/g,'"'),28;case 19:return 30;case 20:return 30;case 21:return 29;case 22:return 33;case 23:return b.yytext=b.yytext.substr(1,b.yyleng-2),33;case 24:return"INVALID";case 25:return 5}},a.rules=[/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s/.])/,/^\[.*\]/,/^./,/^$/],a.conditions={mu:{rules:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],inclusive:!1},INITIAL:{rules:[0,1,25],inclusive:!0}},a}();return a.lexer=b,a}();typeof require!="undefined"&&typeof exports!="undefined"&&(exports.parser=b,exports.parse=function(){return b.parse.apply(b,arguments)},exports.main=function c(a){if(!a[1])throw new Error("Usage: "+a[0]+" FILE");if(typeof process!="undefined")var b=require("fs").readFileSync(require("path").join(process.cwd(),a[1]),"utf8");else var c=require("file").path(require("file").cwd()),b=c.join(a[1]).read({charset:"utf-8"});return exports.parser.parse(b)},typeof module!="undefined"&&require.main===module&&exports.main(typeof process!="undefined"?process.argv.slice(1):require("system").args)),a.Parser=b,a.parse=function(b){return a.Parser.yy=a.AST,a.Parser.parse(b)},a.print=function(b){return(new a.PrintVisitor).accept(b)},a.logger={DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(a,b){}},a.log=function(b,c){a.logger.log(b,c)},function(){a.AST={},a.AST.ProgramNode=function(b,c){this.type="program",this.statements=b,c&&(this.inverse=new a.AST.ProgramNode(c))},a.AST.MustacheNode=function(a,b,c){this.type="mustache",this.id=a[0],this.params=a.slice(1),this.hash=b,this.escaped=!c},a.AST.PartialNode=function(a,b){this.type="partial",this.id=a,this.context=b};var b=function(b,c){if(b.original!==c.original)throw new a.Exception(b.original+" doesn't match "+c.original)};a.AST.BlockNode=function(a,c,d){b(a.id,d),this.type="block",this.mustache=a,this.program=c},a.AST.InverseNode=function(a,c,d){b(a.id,d),this.type="inverse",this.mustache=a,this.program=c},a.AST.ContentNode=function(a){this.type="content",this.string=a},a.AST.HashNode=function(a){this.type="hash",this.pairs=a},a.AST.IdNode=function(a){this.type="ID",this.original=a.join(".");var b=[],c=0;for(var d=0,e=a.length;d<e;d++){var f=a[d];f===".."?c++:f==="."||f==="this"?this.isScoped=!0:b.push(f)}this.parts=b,this.string=b.join("."),this.depth=c,this.isSimple=b.length===1&&c===0},a.AST.StringNode=function(a){this.type="STRING",this.string=a},a.AST.IntegerNode=function(a){this.type="INTEGER",this.integer=a},a.AST.BooleanNode=function(a){this.type="BOOLEAN",this.bool=a},a.AST.CommentNode=function(a){this.type="comment",this.comment=a}}(),a.Exception=function(a){var b=Error.prototype.constructor.apply(this,arguments);for(var c in b)b.hasOwnProperty(c)&&(this[c]=b[c])},a.Exception.prototype=new Error,a.SafeString=function(a){this.string=a},a.SafeString.prototype.toString=function(){return this.string.toString()},function(){var b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[<>"'`]/g,d=/[&<>"'`]/,e=function(a){return b[a]||"&amp;"};a.Utils={escapeExpression:function(b){return b instanceof a.SafeString?b.toString():b==null||b===!1?"":d.test(b)?b.replace(c,e):b},isEmpty:function(a){return typeof a=="undefined"?!0:a===null?!0:a===!1?!0:Object.prototype.toString.call(a)==="[object Array]"&&a.length===0?!0:!1}}}(),a.Compiler=function(){},a.JavaScriptCompiler=function(){},function(b,c){b.OPCODE_MAP={appendContent:1,getContext:2,lookupWithHelpers:3,lookup:4,append:5,invokeMustache:6,appendEscaped:7,pushString:8,truthyOrFallback:9,functionOrFallback:10,invokeProgram:11,invokePartial:12,push:13,assignToHash:15,pushStringParam:16},b.MULTI_PARAM_OPCODES={appendContent:1,getContext:1,lookupWithHelpers:2,lookup:1,invokeMustache:3,pushString:1,truthyOrFallback:1,functionOrFallback:1,invokeProgram:3,invokePartial:1,push:1,assignToHash:1,pushStringParam:1},b.DISASSEMBLE_MAP={};for(var d in b.OPCODE_MAP){var e=b.OPCODE_MAP[d];b.DISASSEMBLE_MAP[e]=d}b.multiParamSize=function(a){return b.MULTI_PARAM_OPCODES[b.DISASSEMBLE_MAP[a]]},b.prototype={compiler:b,disassemble:function(){var a=this.opcodes,c,d,e=[],f,g,h;for(var i=0,j=a.length;i<j;i++){c=a[i];if(c==="DECLARE")g=a[++i],h=a[++i],e.push("DECLARE "+g+" = "+h);else{f=b.DISASSEMBLE_MAP[c];var k=b.multiParamSize(c),l=[];for(var m=0;m<k;m++)d=a[++i],typeof d=="string"&&(d='"'+d.replace("\n","\\n")+'"'),l.push(d);f=f+" "+l.join(" "),e.push(f)}}return e.join("\n")},guid:0,compile:function(a,b){this.children=[],this.depths={list:[]},this.options=b;var c=this.options.knownHelpers;this.options.knownHelpers={helperMissing:!0,blockHelperMissing:!0,each:!0,"if":!0,unless:!0,"with":!0,log:!0};if(c)for(var d in c)this.options.knownHelpers[d]=c[d];return this.program(a)},accept:function(a){return this[a.type](a)},program:function(a){var b=a.statements,c;this.opcodes=[];for(var d=0,e=b.length;d<e;d++)c=b[d],this[c.type](c);return this.isSimple=e===1,this.depths.list=this.depths.list.sort(function(a,b){return a-b}),this},compileProgram:function(a){var b=(new this.compiler).compile(a,this.options),c=this.guid++;this.usePartial=this.usePartial||b.usePartial,this.children[c]=b;for(var d=0,e=b.depths.list.length;d<e;d++){depth=b.depths.list[d];if(depth<2)continue;this.addDepth(depth-1)}return c},block:function(a){var b=a.mustache,c,d,e,f,g=this.setupStackForMustache(b),h=this.compileProgram(a.program);a.program.inverse&&(f=this.compileProgram(a.program.inverse),this.declare("inverse",f)),this.opcode("invokeProgram",h,g.length,!!b.hash),this.declare("inverse",null),this.opcode("append")},inverse:function(a){var b=this.setupStackForMustache(a.mustache),c=this.compileProgram(a.program);this.declare("inverse",c),this.opcode("invokeProgram",null,b.length,!!a.mustache.hash),this.opcode("append")},hash:function(a){var b=a.pairs,c,d;this.opcode("push","{}");for(var e=0,f=b.length;e<f;e++)c=b[e],d=c[1],this.accept(d),this.opcode("assignToHash",c[0])},partial:function(a){var b=a.id;this.usePartial=!0,a.context?this.ID(a.context):this.opcode("push","depth0"),this.opcode("invokePartial",b.original),this.opcode("append")},content:function(a){this.opcode("appendContent",a.string)},mustache:function(a){var b=this.setupStackForMustache(a);this.opcode("invokeMustache",b.length,a.id.original,!!a.hash),a.escaped?this.opcode("appendEscaped"):this.opcode("append")},ID:function(a){this.addDepth(a.depth),this.opcode("getContext",a.depth),this.opcode("lookupWithHelpers",a.parts[0]||null,a.isScoped||!1);for(var b=1,c=a.parts.length;b<c;b++)this.opcode("lookup",a.parts[b])},STRING:function(a){this.opcode("pushString",a.string)},INTEGER:function(a){this.opcode("push",a.integer)},BOOLEAN:function(a){this.opcode("push",a.bool)},comment:function(){},pushParams:function(a){var b=a.length,c;while(b--)c=a[b],this.options.stringParams?(c.depth&&this.addDepth(c.depth),this.opcode("getContext",c.depth||0),this.opcode("pushStringParam",c.string)):this[c.type](c)},opcode:function(a,c,d,e){this.opcodes.push(b.OPCODE_MAP[a]),c!==undefined&&this.opcodes.push(c),d!==undefined&&this.opcodes.push(d),e!==undefined&&this.opcodes.push(e)},declare:function(a,b){this.opcodes.push("DECLARE"),this.opcodes.push(a),this.opcodes.push(b)},addDepth:function(a){if(a===0)return;this.depths[a]||(this.depths[a]=!0,this.depths.list.push(a))},setupStackForMustache:function(a){var b=a.params;return this.pushParams(b),a.hash&&this.hash(a.hash),this.ID(a.id),b}},c.prototype={nameLookup:function(a,b,d){return/^[0-9]+$/.test(b)?a+"["+b+"]":c.isValidJavaScriptVariableName(b)?a+"."+b:a+"['"+b+"']"},appendToBuffer:function(a){return this.environment.isSimple?"return "+a+";":"buffer += "+a+";"},initializeBuffer:function(){return this.quotedString("")},namespace:"Handlebars",compile:function(a,b,c,d){this.environment=a,this.options=b||{},this.name=this.environment.name,this.isChild=!!c,this.context=c||{programs:[],aliases:{self:"this"},registers:{list:[]}},this.preamble(),this.stackSlot=0,this.stackVars=[],this.compileChildren(a,b);var e=a.opcodes,f;this.i=0;for(i=e.length;this.i<i;this.i++)f=this.nextOpcode(0),f[0]==="DECLARE"?(this.i=this.i+2,this[f[1]]=f[2]):(this.i=this.i+f[1].length,this[f[0]].apply(this,f[1]));return this.createFunctionContext(d)},nextOpcode:function(a){var c=this.environment.opcodes,d=c[this.i+a],e,f,g,h;if(d==="DECLARE")return e=c[this.i+1],f=c[this.i+2],["DECLARE",e,f];e=b.DISASSEMBLE_MAP[d],g=b.multiParamSize(d),h=[];for(var i=0;i<g;i++)h.push(c[this.i+i+1+a]);return[e,h]},eat:function(a){this.i=this.i+a.length},preamble:function(){var a=[];if(!this.isChild){var b=this.namespace,c="helpers = helpers || "+b+".helpers;";this.environment.usePartial&&(c=c+" partials = partials || "+b+".partials;"),a.push(c)}else a.push("");this.environment.isSimple?a.push(""):a.push(", buffer = "+this.initializeBuffer()),this.lastContext=0,this.source=a},createFunctionContext:function(b){var c=this.stackVars;this.isChild||(c=c.concat(this.context.registers.list)),c.length>0&&(this.source[1]=this.source[1]+", "+c.join(", "));if(!this.isChild){var d=[];for(var e in this.context.aliases)this.source[1]=this.source[1]+", "+e+"="+this.context.aliases[e]}this.source[1]&&(this.source[1]="var "+this.source[1].substring(2)+";"),this.isChild||(this.source[1]+="\n"+this.context.programs.join("\n")+"\n"),this.environment.isSimple||this.source.push("return buffer;");var f=this.isChild?["depth0","data"]:["Handlebars","depth0","helpers","partials","data"];for(var g=0,h=this.environment.depths.list.length;g<h;g++)f.push("depth"+this.environment.depths.list[g]);if(b)return f.push(this.source.join("\n  ")),Function.apply(this,f);var i="function "+(this.name||"")+"("+f.join(",")+") {\n  "+this.source.join("\n  ")+"}";return a.log(a.logger.DEBUG,i+"\n\n"),i},appendContent:function(a){this.source.push(this.appendToBuffer(this.quotedString(a)))},append:function(){var a=this.popStack();this.source.push("if("+a+" || "+a+" === 0) { "+this.appendToBuffer(a)+" }"),this.environment.isSimple&&this.source.push("else { "+this.appendToBuffer("''")+" }")},appendEscaped:function(){var a=this.nextOpcode(1),b="";this.context.aliases.escapeExpression="this.escapeExpression",a[0]==="appendContent"&&(b=" + "+this.quotedString(a[1][0]),this.eat(a)),this.source.push(this.appendToBuffer("escapeExpression("+this.popStack()+")"+b))},getContext:function(a){this.lastContext!==a&&(this.lastContext=a)},lookupWithHelpers:function(a,b){if(a){var c=this.nextStack();this.usingKnownHelper=!1;var d;!b&&this.options.knownHelpers[a]?(d=c+" = "+this.nameLookup("helpers",a,"helper"),this.usingKnownHelper=!0):b||this.options.knownHelpersOnly?d=c+" = "+this.nameLookup("depth"+this.lastContext,a,"context"):d=c+" = "+this.nameLookup("helpers",a,"helper")+" || "+this.nameLookup("depth"+this.lastContext,a,"context"),d+=";",this.source.push(d)}else this.pushStack("depth"+this.lastContext)},lookup:function(a){var b=this.topStack();this.source.push(b+" = ("+b+" === null || "+b+" === undefined || "+b+" === false ? "+b+" : "+this.nameLookup(b,a,"context")+");")},pushStringParam:function(a){this.pushStack("depth"+this.lastContext),this.pushString(a)},pushString:function(a){this.pushStack(this.quotedString(a))},push:function(a){this.pushStack(a)},invokeMustache:function(a,b,c){this.populateParams(a,this.quotedString(b),"{}",null,c,function(a,b,c){this.usingKnownHelper||(this.context.aliases.helperMissing="helpers.helperMissing",this.context.aliases.undef="void 0",this.source.push("else if("+c+"=== undef) { "+a+" = helperMissing.call("+b+"); }"),a!==c&&this.source.push("else { "+a+" = "+c+"; }"))})},invokeProgram:function(a,b,c){var d=this.programExpression(this.inverse),e=this.programExpression(a);this.populateParams(b,null,e,d,c,function(a,b,c){this.usingKnownHelper||(this.context.aliases.blockHelperMissing="helpers.blockHelperMissing",this.source.push("else { "+a+" = blockHelperMissing.call("+b+"); }"))})},populateParams:function(a,b,c,d,e,f){var g=e||this.options.stringParams||d||this.options.data,h=this.popStack(),i,j=[],k,l,m;g?(this.register("tmp1",c),m="tmp1"):m="{ hash: {} }";if(g){var n=e?this.popStack():"{}";this.source.push("tmp1.hash = "+n+";")}this.options.stringParams&&this.source.push("tmp1.contexts = [];");for(var o=0;o<a;o++)k=this.popStack(),j.push(k),this.options.stringParams&&this.source.push("tmp1.contexts.push("+this.popStack()+");");d&&(this.source.push("tmp1.fn = tmp1;"),this.source.push("tmp1.inverse = "+d+";")),this.options.data&&this.source.push("tmp1.data = data;"),j.push(m),this.populateCall(j,h,b||h,f)},populateCall:function(a,b,c,d){var e=["depth0"].concat(a).join(", "),f=["depth0"].concat(c).concat(a).join(", "),g=this.nextStack();this.usingKnownHelper?this.source.push(g+" = "+b+".call("+e+");"):(this.context.aliases.functionType='"function"',this.source.push("if(typeof "+b+" === functionType) { "+g+" = "+b+".call("+e+"); }")),d.call(this,g,f,b),this.usingKnownHelper=!1},invokePartial:function(a){this.pushStack("self.invokePartial("+this.nameLookup("partials",a,"partial")+", '"+a+"', "+this.popStack()+", helpers, partials);")},assignToHash:function(a){var b=this.popStack(),c=this.topStack();this.source.push(c+"['"+a+"'] = "+b+";")},compiler:c,compileChildren:function(a,b){var c=a.children,d,e;for(var f=0,g=c.length;f<g;f++){d=c[f],e=new this.compiler,this.context.programs.push("");var h=this.context.programs.length;d.index=h,d.name="program"+h,this.context.programs[h]=e.compile(d,b,this.context)}},programExpression:function(a){if(a==null)return"self.noop";var b=this.environment.children[a],c=b.depths.list,d=[b.index,b.name,"data"];for(var e=0,f=c.length;e<f;e++)depth=c[e],depth===1?d.push("depth0"):d.push("depth"+(depth-1));return c.length===0?"self.program("+d.join(", ")+")":(d.shift(),"self.programWithDepth("+d.join(", ")+")")},register:function(a,b){this.useRegister(a),this.source.push(a+" = "+b+";")},useRegister:function(a){this.context.registers[a]||(this.context.registers[a]=!0,this.context.registers.list.push(a))},pushStack:function(a){return this.source.push(this.nextStack()+" = "+a+";"),"stack"+this.stackSlot},nextStack:function(){return this.stackSlot++,this.stackSlot>this.stackVars.length&&this.stackVars.push("stack"+this.stackSlot),"stack"+this.stackSlot},popStack:function(){return"stack"+this.stackSlot--},topStack:function(){return"stack"+this.stackSlot},quotedString:function(a){return'"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r")+'"'}};var f="break case catch continue default delete do else finally for function if in instanceof new return switch this throw try typeof var void while with null true false".split(" "),g=c.RESERVED_WORDS={};for(var h=0,i=f.length;h<i;h++)g[f[h]]=!0;c.isValidJavaScriptVariableName=function(a){return!c.RESERVED_WORDS[a]&&/^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(a)?!0:!1}}(a.Compiler,a.JavaScriptCompiler),a.precompile=function(b,c){c=c||{};var d=a.parse(b),e=(new a.Compiler).compile(d,c);return(new a.JavaScriptCompiler).compile(e,c)},a.compile=function(b,c){function e(){var d=a.parse(b),e=(new a.Compiler).compile(d,c),f=(new a.JavaScriptCompiler).compile(e,c,undefined,!0);return a.template(f)}c=c||{};var d;return function(a,b){return d||(d=e()),d.call(this,a,b)}},a.VM={template:function(b){var c={escapeExpression:a.Utils.escapeExpression,invokePartial:a.VM.invokePartial,programs:[],program:function(b,c,d){var e=this.programs[b];return d?a.VM.program(c,d):e?e:(e=this.programs[b]=a.VM.program(c),e)},programWithDepth:a.VM.programWithDepth,noop:a.VM.noop};return function(d,e){return e=e||{},b.call(c,a,d,e.helpers,e.partials,e.data)}},programWithDepth:function(a,b,c){var d=Array.prototype.slice.call(arguments,2);return function(c,e){return e=e||{},a.apply(this,[c,e.data||b].concat(d))}},program:function(a,b){return function(c,d){return d=d||{},a(c,d.data||b)}},noop:function(){return""},invokePartial:function(b,c,d,e,f){if(b===undefined)throw new a.Exception("The partial "+c+" could not be found");if(b instanceof Function)return b(d,{helpers:e,partials:f});if(!a.compile)throw new a.Exception("The partial "+c+" could not be compiled when running in vm mode");return f[c]=a.compile(b),f[c](d,{helpers:e,partials:f})}},a.template=a.VM.template})(),function(){"undefined"==typeof Ember&&(Ember={isNamespace:!0,toString:function(){return"Ember"}},"undefined"!=typeof window&&(window.Em=window.Ember=Em=Ember)),Ember.VERSION="0.9.6",Ember.ENV="undefined"==typeof ENV?{}:ENV,Ember.EXTEND_PROTOTYPES=Ember.ENV.EXTEND_PROTOTYPES!==!1,Ember.SHIM_ES5=Ember.ENV.SHIM_ES5===!1?!1:Ember.EXTEND_PROTOTYPES,Ember.K=function(){return this},"undefined"==typeof ember_assert&&(window.ember_assert=Ember.K),"undefined"==typeof ember_warn&&(window.ember_warn=Ember.K),"undefined"==typeof ember_deprecate&&(window.ember_deprecate=Ember.K),"undefined"==typeof ember_deprecateFunc&&(window.ember_deprecateFunc=function(a,b){return b}),Ember.Logger=window.console||{log:Ember.K,warn:Ember.K,error:Ember.K}}(),function(){var a=Ember.platform={};a.create=Object.create;if(!a.create){var b=function(){},c=b.prototype;a.create=function(d,e){b.prototype=d,d=new b,b.prototype=c;if(e!==undefined)for(var f in e){if(!e.hasOwnProperty(f))continue;a.defineProperty(d,f,e[f])}return d},a.create.isSimulated=!0}var d=Object.defineProperty,e,f;if(d)try{d({},"a",{get:function(){}})}catch(g){d=null}d&&(e=function(){var a={};return d(a,"a",{configurable:!0,enumerable:!0,get:function(){},set:function(){}}),d(a,"a",{configurable:!0,enumerable:!0,writable:!0,value:!0}),a.a===!0}(),f=function(){try{return d(document.createElement("div"),"definePropertyOnDOM",{}),!0}catch(a){}return!1}(),e?f||(d=function(a,b,c){var d;return typeof Node=="object"?d=a instanceof Node:d=typeof a=="object"&&typeof a.nodeType=="number"&&typeof a.nodeName=="string",d?a[b]=c.value:Object.defineProperty(a,b,c)}):d=null),a.defineProperty=d,a.hasPropertyAccessors=!0,a.defineProperty||(a.hasPropertyAccessors=!1,a.defineProperty=function(a,b,c){a[b]=c.value},a.defineProperty.isSimulated=!0)}(),function(){var a="__ember"+ +(new Date),b,c,d;b=0,c=[],d={};var e=Ember.GUID_DESC={configurable:!0,writable:!0,enumerable:!1},f=Ember.platform.defineProperty,g=Ember.platform.create;Ember.GUID_KEY=a,Ember.generateGuid=function(c,d){d||(d="ember");var g=d+b++;return c&&(e.value=g,f(c,a,e),e.value=null),g},Ember.guidFor=function(e){if(e===undefined)return"(undefined)";if(e===null)return"(null)";var f,g,h=typeof e;switch(h){case"number":return g=c[e],g||(g=c[e]="nu"+e),g;case"string":return g=d[e],g||(g=d[e]="st"+b++),g;case"boolean":return e?"(true)":"(false)";default:if(e[a])return e[a];if(e===Object)return"(Object)";if(e===Array)return"(Array)";return Ember.generateGuid(e,"ember")}};var h={writable:!0,configurable:!1,enumerable:!1,value:null},i=Ember.GUID_KEY+"_meta";Ember.META_KEY=i;var j={descs:{},watching:{}};Object.freeze&&Object.freeze(j);var k=Ember.platform.defineProperty.isSimulated?g:function(a){return a};Ember.meta=function(a,b){var c=a[i];return b===!1?c||j:(c?c.source!==a&&(c=g(c),c.descs=g(c.descs),c.values=g(c.values),c.watching=g(c.watching),c.lastSetValues={},c.cache={},c.source=a,f(a,i,h),c=a[i]=k(c)):(f(a,i,h),c=a[i]=k({descs:{},watching:{},values:{},lastSetValues:{},cache:{},source:a}),c.descs.constructor=null),c)},Ember.getMeta=function(a,b){var c=Ember.meta(a,!1);return c[b]},Ember.setMeta=function(a,b,c){var d=Ember.meta(a,!0);return d[b]=c,c},Ember.metaPath=function(a,b,c){var d=Ember.meta(a,c),e,f;for(var h=0,i=b.length;h<i;h++){e=b[h],f=d[e];if(!f){if(!c)return undefined;f=d[e]={__ember_source__:a}}else if(f.__ember_source__!==a){if(!c)return undefined;f=d[e]=g(f),f.__ember_source__=a}d=f}return f},Ember.wrap=function(a,b){function c(){}var d=function(){var d,e=this._super;return this._super=b||c,d=a.apply(this,arguments),this._super=e,d};return d.base=a,d},Ember.isArray=function(a){return!a||a.setInterval?!1:Array.isArray&&Array.isArray(a)?!0:Ember.Array&&Ember.Array.detect(a)?!0:a.length!==undefined&&"object"==typeof a?!0:!1},Ember.makeArray=function(a){return a===null||a===undefined?
[]:Ember.isArray(a)?a:[a]}}(),function(){function g(a){if(a==="*")return a;var b=a.charAt(0);return b==="."?"this"+a:b==="*"&&a.charAt(1)!=="."?"this."+a.slice(1):a}function h(a,b){var d=b.length,e,f,g;e=b.indexOf("*");if(e>0&&b.charAt(e-1)!==".")return h(h(a,b.slice(0,e)),b.slice(e+1));e=0;while(a&&e<d){f=b.indexOf(".",e),f<0&&(f=d),g=b.slice(e,f),a=g==="*"?a:c(a,g);if(a&&a.isDestroyed)return undefined;e=f+1}return a}function n(a){return a.match(m)[0]}function o(a,d){var e=l.test(d),f=!e&&k.test(d),g;if(!a||f)a=window;e&&(d=d.slice(5));var j=d.indexOf("*");j>0&&d.charAt(j-1)!=="."?(a&&b(a,!1).proto!==a?a=h(a,d.slice(0,j)):a=null,d=d.slice(j+1)):a===window&&(g=n(d),a=c(a,g),d=d.slice(g.length+1));if(!d||d.length===0)throw new Error("Invalid Path");return i[0]=a,i[1]=d,i}var a=Ember.platform.hasPropertyAccessors&&Ember.ENV.USE_ACCESSORS;Ember.USE_ACCESSORS=!!a;var b=Ember.meta,c,d;c=function(a,b){b===undefined&&"string"==typeof a&&(b=a,a=Ember);if(!a)return undefined;var c=a[b];return c===undefined&&"function"==typeof a.unknownProperty&&(c=a.unknownProperty(b)),c},d=function(a,b,c){return"object"!=typeof a||b in a?a[b]=c:"function"==typeof a.setUnknownProperty?a.setUnknownProperty(b,c):"function"==typeof a.unknownProperty?a.unknownProperty(b,c):a[b]=c,c};if(!a){var e=c,f=d;c=function(a,c){c===undefined&&"string"==typeof a&&(c=a,a=Ember);if(!a)return undefined;var d=b(a,!1).descs[c];return d?d.get(a,c):e(a,c)},d=function(a,c,d){var e=b(a,!1).descs[c];return e?e.set(a,c,d):f(a,c,d),d}}Ember.get=c,Ember.set=d;var i=[],j=/^([A-Z$]|([0-9][A-Z$]))/,k=/^([A-Z$]|([0-9][A-Z$])).*[\.\*]/,l=/^this[\.\*]/,m=/^([^\.\*]+)/;Ember.normalizePath=g,Ember.normalizeTuple=function(a,b){return o(a,g(b))},Ember.normalizeTuple.primitive=o,Ember.getWithDefault=function(a,b,c){var d=Ember.get(a,b);return d===undefined?c:d},Ember.getPath=function(a,b,d){var e,f,i,k,m;if(b==="")return a;!b&&"string"==typeof a&&(b=a,a=null,e=!0),i=b.indexOf("*")>-1;if(a===null&&!i&&b.indexOf(".")<0)return c(window,b);b=g(b),f=l.test(b);if(!a||f||i){var n=o(a,b);a=n[0],b=n[1],n.length=0}return m=h(a,b),m===undefined&&!e&&!f&&a!==window&&j.test(b)&&d!==!1?Ember.getPath(window,b):m},Ember.setPath=function(a,b,c,d){var e;arguments.length===2&&"string"==typeof a&&(c=b,b=a,a=null),b=g(b);if(b.indexOf("*")>0){var f=o(a,b);a=f[0],b=f[1],f.length=0}if(b.indexOf(".")>0)e=b.slice(b.lastIndexOf(".")+1),b=b.slice(0,b.length-(e.length+1)),b!=="this"&&(a=Ember.getPath(a,b,!1),!a&&j.test(b)&&(a=Ember.getPath(window,b)));else{if(j.test(b))throw new Error("Invalid Path");e=b}if(!e||e.length===0||e==="*")throw new Error("Invalid Path");if(!a){if(d)return;throw new Error("Object in path "+b+" could not be found or was destroyed.")}return Ember.set(a,e,c)},Ember.trySetPath=function(a,b,c){return arguments.length===2&&"string"==typeof a&&(c=b,b=a,a=null),Ember.setPath(a,b,c,!0)},Ember.isGlobalPath=function(a){return!l.test(a)&&j.test(a)}}(),function(){function n(a,b,c){c=c||d(a,!1).values;if(c){var e=c[b];if(e!==undefined)return e;if(a.unknownProperty)return a.unknownProperty(b)}}function o(a,b,c){var e=d(a),f;return f=e.watching[b]>0&&c!==e.values[b],f&&Ember.propertyWillChange(a,b),e.values[b]=c,f&&Ember.propertyDidChange(a,b),c}function q(a){var b=p[a];return b||(b=p[a]=function(){return n(this,a)}),b}function s(a){var b=r[a];return b||(b=r[a]=function(b){return o(this,a,b)}),b}function t(a,b){return b==="toString"?"function"!=typeof a.toString:!!a[b]}var a=Ember.USE_ACCESSORS,b=Ember.GUID_KEY,c=Ember.META_KEY,d=Ember.meta,e=Ember.platform.create,f=Ember.platform.defineProperty,g,h,i={writable:!0,configurable:!0,enumerable:!0,value:null},j=Ember.Descriptor=function(){},k=j.setup=function(a,b,c){i.value=c,f(a,b,i),i.value=null},l=Ember.Descriptor.prototype;l.set=function(a,b,c){return a[b]=c,c},l.get=function(a,b){return n(a,b,a)},l.setup=k,l.teardown=function(a,b){return a[b]},l.val=function(a,b){return a[b]},a||(Ember.Descriptor.MUST_USE_GETTER=function(){!(this instanceof Ember.Object)},Ember.Descriptor.MUST_USE_SETTER=function(){this instanceof Ember.Object&&!this.isDestroyed});var m={configurable:!0,enumerable:!0,set:Ember.Descriptor.MUST_USE_SETTER},p={},r={};h=new Ember.Descriptor,Ember.platform.hasPropertyAccessors?(h.get=n,h.set=o,a?h.setup=function(a,b,c){m.get=q(b),m.set=s(b),f(a,b,m),m.get=m.set=null,c!==undefined&&(d(a).values[b]=c)}:h.setup=function(a,b,c){m.get=q(b),f(a,b,m),m.get=null,c!==undefined&&(d(a).values[b]=c)},h.teardown=function(a,b){var c=d(a).values[b];return delete d(a).values[b],c}):h.set=function(a,b,c){var e=d(a),f;return f=e.watching[b]>0&&c!==a[b],f&&Ember.propertyWillChange(a,b),a[b]=c,f&&Ember.propertyDidChange(a,b),c},Ember.SIMPLE_PROPERTY=new Ember.Descriptor,g=Ember.SIMPLE_PROPERTY,g.unwatched=h.unwatched=g,g.watched=h.watched=h,Ember.defineProperty=function(a,b,c,e){var h=d(a,!1),i=h.descs,j=h.watching[b]>0,k=!0;return e===undefined?(k=!1,e=t(i,b)?i[b].teardown(a,b):a[b]):t(i,b)&&i[b].teardown(a,b),c||(c=g),c instanceof Ember.Descriptor?(h=d(a,!0),i=h.descs,c=(j?c.watched:c.unwatched)||c,i[b]=c,c.setup(a,b,e,j)):(i[b]&&(d(a).descs[b]=null),f(a,b,c)),k&&j&&Ember.overrideChains(a,b,h),this},Ember.create=function(a,d){var f=e(a,d);return b in f&&Ember.generateGuid(f,"ember"),c in f&&Ember.rewatch(f),f},Ember.createPrototype=function(a,f){var g=e(a,f);return d(g,!0).proto=g,b in g&&Ember.generateGuid(g,"ember"),c in g&&Ember.rewatch(g),g}}(),function(){function g(b,c){var d=a(b),f,g;return f=d.deps,f?f.__emberproto__!==b&&(f=d.deps=e(f),f.__emberproto__=b):f=d.deps={__emberproto__:b},g=f[c],g?g.__emberproto__!==b&&(g=f[c]=e(g),g.__emberproto__=b):g=f[c]={__emberproto__:b},g}function h(a,b,c){var d=g(a,c);d[b]=(d[b]||0)+1,Ember.watch(a,c)}function i(a,b,c){var d=g(a,c);d[b]=(d[b]||0)-1,Ember.unwatch(a,c)}function j(a,b,c){var d=a._dependentKeys,e=d?d.length:0;for(var f=0;f<e;f++)h(b,c,d[f])}function k(a,b){this.func=a,this._cacheable=b&&b.cacheable,this._dependentKeys=b&&b.dependentKeys}function m(b,c){var d=c._cacheable,e=c.func;return d?function(){var c,d=a(this).cache;return b in d?d[b]:(c=d[b]=e.call(this,b),c)}:function(){return e.call(this,b)}}function n(c,d){var e=d._cacheable,f=d.func;return function(g){var h=a(this,e),i=h.source===this&&h.watching[c]>0,j,k,l;return k=d._suspended,d._suspended=this,i=i&&h.lastSetValues[c]!==b(g),i&&(h.lastSetValues[c]=b(g),Ember.propertyWillChange(this,c)),e&&delete h.cache[c],j=f.call(this,c,g),e&&(h.cache[c]=j),i&&Ember.propertyDidChange(this,c),d._suspended=k,j}}var a=Ember.meta,b=Ember.guidFor,c=Ember.USE_ACCESSORS,d=Array.prototype.slice,e=Ember.platform.create,f=Ember.platform.defineProperty;Ember.ComputedProperty=k,k.prototype=new Ember.Descriptor;var l={configurable:!0,enumerable:!0,get:function(){return undefined},set:Ember.Descriptor.MUST_USE_SETTER},o=k.prototype;o.cacheable=function(a){return this._cacheable=a!==!1,this},o.property=function(){return this._dependentKeys=d.call(arguments),this},o.meta=function(a){return this._meta=a,this},o.setup=function(a,b,c){l.get=m(b,this),l.set=n(b,this),f(a,b,l),l.get=l.set=null,j(this,a,b)},o.teardown=function(b,c){var d=this._dependentKeys,e=d?d.length:0;for(var f=0;f<e;f++)i(b,c,d[f]);return this._cacheable&&delete a(b).cache[c],null},o.didChange=function(b,c){this._cacheable&&this._suspended!==b&&delete a(b).cache[c]},o.get=function(b,c){var d,e;if(this._cacheable){e=a(b).cache;if(c in e)return e[c];d=e[c]=this.func.call(b,c)}else d=this.func.call(b,c);return d},o.set=function(c,d,e){var f=this._cacheable,g=a(c,f),h=g.source===c&&g.watching[d]>0,i,j,k;return j=this._suspended,this._suspended=c,h=h&&g.lastSetValues[d]!==b(e),h&&(g.lastSetValues[d]=b(e),Ember.propertyWillChange(c,d)),f&&delete g.cache[d],i=this.func.call(c,d,e),f&&(g.cache[d]=i),h&&Ember.propertyDidChange(c,d),this._suspended=j,i},o.val=function(b,c){return a(b,!1).values[c]},Ember.platform.hasPropertyAccessors?c||(o.setup=function(a,b){f(a,b,l),j(this,a,b)}):o.setup=function(a,b,c){a[b]=undefined,j(this,a,b)},Ember.computed=function(a){var b;arguments.length>1&&(b=d.call(arguments,0,-1),a=d.call(arguments,-1)[0]);var c=new k(a);return b&&c.property.apply(c,b),c},Ember.cacheFor=function(b,c){var d=a(b,!1).cache;if(d&&d[c])return d[c]}}(),function(){var a=function(a){return a&&Function.prototype.toString.call(a).indexOf("[native code]")>-1},b=a(Array.prototype.map)?Array.prototype.map:function(a){if(this===void 0||this===null)throw new TypeError;var b=Object(this),c=b.length>>>0;if(typeof a!="function")throw new TypeError;var d=new Array(c),e=arguments[1];for(var f=0;f<c;f++)f in b&&(d[f]=a.call(e,b[f],f,b));return d},c=a(Array.prototype.forEach)?Array.prototype.forEach:function(a){if(this===void 0||this===null)throw new TypeError;var b=Object(this),c=b.length>>>0;if(typeof a!="function")throw new TypeError;var d=arguments[1];for(var e=0;e<c;e++)e in b&&a.call(d,b[e],e,b)},d=a(Array.prototype.indexOf)?Array.prototype.indexOf:function(a,b){b===null||b===undefined?b=0:b<0&&(b=Math.max(0,this.length+b));for(var c=b,d=this.length;c<d;c++)if(this[c]===a)return c;return-1};Ember.ArrayUtils={map:function(a){var c=Array.prototype.slice.call(arguments,1);return a.map?a.map.apply(a,c):b.apply(a,c)},forEach:function(a){var b=Array.prototype.slice.call(arguments,1);return a.forEach?a.forEach.apply(a,b):c.apply(a,b)},indexOf:function(a){var b=Array.prototype.slice.call(arguments,1);return a.indexOf?a.indexOf.apply(a,b):d.apply(a,b)},indexesOf:function(a){var b=Array.prototype.slice.call(arguments,1);return b[0]===undefined?[]:Ember.ArrayUtils.map(b[0],function(b){return Ember.ArrayUtils.indexOf(a,b)})},removeObject:function(a,b){var c=this.indexOf(a,b);c!==-1&&a.splice(c,1)}},Ember.SHIM_ES5&&(Array.prototype.map||(Array.prototype.map=b),Array.prototype.forEach||(Array.prototype.forEach=c),Array.prototype.indexOf||(Array.prototype.indexOf=d))}(),function(){function l(a,b,c){e&&!c?j.push(a,b):Ember.sendEvent(a,b)}function m(){k.clear(),j.flush()}function n(b){return b+a}function o(a){return a+b}function p(a){return a.slice(0,-7)}function q(a){return a.slice(0,-7)}function r(a){return function(b,c,d){var e=d[0],f=p(d[1]),g,h=a.slice();c.length>2&&(g=Ember.getPath(Ember.isGlobalPath(f)?window:e,f)),h.unshift(e,f,g),c.apply(b,h)}}function t(a,b,c){var d=c[0],e=q(c[1]),f;b.length>2&&(f=Ember.getPath(d,e)),b.call(a,d,e,f)}var a=":change",b=":before",c=Ember.guidFor,d=Ember.normalizePath,e=0,f=Array.prototype.slice,g=Ember.ArrayUtils.forEach,h=function(){this.targetSet={}};h.prototype.add=function(a,b){var c=this.targetSet,d=Ember.guidFor(a),e=c[d];return e||(c[d]=e={}),e[b]?!1:e[b]=!0},h.prototype.clear=function(){this.targetSet={}};var i=function(){this.targetSet={},this.queue=[]};i.prototype.push=function(a,b){var c=this.targetSet,d=this.queue,e=Ember.guidFor(a),f=c[e],g;f||(c[e]=f={}),g=f[b],g===undefined?f[b]=d.push(Ember.deferEvent(a,b))-1:d[g]=Ember.deferEvent(a,b)},i.prototype.flush=function(){var a=this.queue;this.queue=[],this.targetSet={};for(var b=0,c=a.length;b<c;++b)a[b]()};var j=new i,k=new h;Ember.beginPropertyChanges=function(){return e++,this},Ember.endPropertyChanges=function(){e--,e<=0&&m()},Ember.changeProperties=function(a,b){Ember.beginPropertyChanges();try{a.call(b)}finally{Ember.endPropertyChanges()}},Ember.setProperties=function(a,b){return Ember.changeProperties(function(){for(var c in b)b.hasOwnProperty(c)&&Ember.set(a,c,b[c])}),a};var s=r([]);Ember.addObserver=function(a,b,c,e){b=d(b);var g;if(arguments.length>4){var h=f.call(arguments,4);g=r(h)}else g=s;return Ember.addListener(a,n(b),c,e,g),Ember.watch(a,b),this},Ember.observersFor=function(a,b){return Ember.listenersFor(a,n(b))},Ember.removeObserver=function(a,b,c,e){return b=d(b),Ember.unwatch(a,b),Ember.removeListener(a,n(b),c,e),this},Ember.addBeforeObserver=function(a,b,c,e){return b=d(b),Ember.addListener(a,o(b),c,e,t),Ember.watch(a,b),this},Ember._suspendObserver=function(a,b,c,d,e){return Ember._suspendListener(a,n(b),c,d,e)},Ember.beforeObserversFor=function(a,b){return Ember.listenersFor(a,o(b))},Ember.removeBeforeObserver=function(a,b,c,e){return b=d(b),Ember.unwatch(a,b),Ember.removeListener(a,o(b),c,e),this},Ember.notifyObservers=function(a,b){if(a.isDestroying)return;l(a,n(b))},Ember.notifyBeforeObservers=function(a,b){if(a.isDestroying)return;var c,d,f=!1;if(e)if(k.add(a,b))f=!0;else return;l(a,o(b),f)}}(),function(){function n(a){return a.match(l)[0]}function o(a){return a==="*"||!m.test(a)}function q(b,c,d,e,f){var g=a(c);e[g]||(e[g]={});if(e[g][d])return;e[g][d]=!0;var h=f.deps;h=h&&h[d];if(h)for(var i in h){if(p[i])continue;b(c,i)}}function t(a,b,c){if(a.isDestroying)return;var d=r,e=!d;e&&(d=r={}),q(H,a,b,d,c),e&&(r=null)}function u(a,b,c){if(a.isDestroying)return;var d=s,e=!d;e&&(d=s={}),q(I,a,b,d,c),e&&(s=null)}function v(c,d,e){if(!c||"object"!=typeof c)return;var f=b(c),g=f.chainWatchers;if(!g||g.__emberproto__!==c)g=f.chainWatchers={__emberproto__:c};g[d]||(g[d]={}),g[d][a(e)]=e,Ember.watch(c,d)}function w(c,d,e){if(!c||"object"!=typeof c)return;var f=b(c,!1),g=f.chainWatchers;if(!g||g.__emberproto__!==c)return;g[d]&&delete g[d][a(e)],Ember.unwatch(c,d)}function y(a){if(x.length===0)return;var b=x;x=[],k(b,function(a){a[0].add(a[1])}),a!==!1&&x.length>0&&setTimeout(y,1)}function z(a){return b(a,!1).proto===a}function C(a){var c=b(a),d=c.chains;return d?d.value()!==a&&(d=c.chains=d.copy(a)):d=c.chains=new A(null,null,a),d}function D(a,b,c,d,e){var f=b.chainWatchers;if(!f||f.__emberproto__!==a)return;f=f[c];if(!f)return;for(var g in f){if(!f.hasOwnProperty(g))continue;f[g][d](e)}}function E(a,b,c){D(a,c,b,"willChange")}function F(a,b,c){D(a,c,b,"didChange")}function H(a,c){var d=b(a,!1),e=d.proto,f=d.descs[c];if(e===a)return;f&&f.willChange&&f.willChange(a,c),t(a,c,d),E(a,c,d),Ember.notifyBeforeObservers(a,c)}function I(a,c){var d=b(a,!1),e=d.proto,f=d.descs[c];if(e===a)return;f&&f.didChange&&f.didChange(a,c),u(a,c,d),F(a,c,d),Ember.notifyObservers(a,c)}var a=Ember.guidFor,b=Ember.meta,c=Ember.get,d=Ember.set,e=Ember.normalizeTuple.primitive,f=Ember.normalizePath,g=Ember.SIMPLE_PROPERTY,h=Ember.GUID_KEY,i=Ember.META_KEY,j=Ember.notifyObservers,k=Ember.ArrayUtils.forEach,l=/^([^\.\*]+)/,m=/[\.\*]/,p={__emberproto__:!0},r,s,x=[],A=function(a,b,c,d){var e;this._parent=a,this._key=b,this._watching=c===undefined,this._value=c,this._separator=d||".",this._paths={},this._watching&&(this._object=a.value(),this._object&&v(this._object,this._key,this)),this._parent&&this._parent._key==="@each"&&this.value()},B=A.prototype;B.value=function(){if(this._value===undefined&&this._watching){var a=this._parent.value();this._value=a&&!z(a)?c(a,this._key):undefined}return this._value},B.destroy=function(){if(this._watching){var a=this._object;a&&w(a,this._key,this),this._watching=!1}},B.copy=function(a){var b=new A(null,null,a,this._separator),c=this._paths,d;for(d in c){if(c[d]<=0)continue;b.add(d)}return b},B.add=function(a){var b,c,d,f,g,h;h=this._paths,h[a]=(h[a]||0)+1,b=this.value(),c=e(b,a);if(c[0]&&c[0]===b)a=c[1],d=n(a),a=a.slice(d.length+1);else{if(!c[0]){x.push([this,a]),c.length=0;return}f=c[0],d=a.slice(0,0-(c[1].length+1)),g=a.slice(d.length,d.length+1),a=c[1]}c.length=0,this.chain(d,a,f,g)},B.remove=function(a){var b,c,d,f,g;g=this._paths,g[a]>0&&g[a]--,b=this.value(),c=e(b,a),c[0]===b?(a=c[1],d=n(a),a=a.slice(d.length+1)):(f=c[0],d=a.slice(0,0-(c[1].length+1)),a=c[1]),c.length=0,this.unchain(d,a)},B.count=0,B.chain=function(a,b,c,d){var e=this._chains,f;e||(e=this._chains={}),f=e[a],f||(f=e[a]=new A(this,a,c,d)),f.count++,b&&b.length>0&&(a=n(b),b=b.slice(a.length+1),f.chain(a,b))},B.unchain=function(a,b){var c=this._chains,d=c[a];b&&b.length>1&&(a=n(b),b=b.slice(a.length+1),d.unchain(a,b)),d.count--,d.count<=0&&(delete c[d._key],d.destroy())},B.willChange=function(){var a=this._chains;if(a)for(var b in a){if(!a.hasOwnProperty(b))continue;a[b].willChange()}this._parent&&this._parent.chainWillChange(this,this._key,1)},B.chainWillChange=function(a,b,c){this._key&&(b=this._key+this._separator+b),this._parent?this._parent.chainWillChange(this,b,c+1):(c>1&&Ember.propertyWillChange(this.value(),b),b="this."+b,this._paths[b]>0&&Ember.propertyWillChange(this.value(),b))},B.chainDidChange=function(a,b,c){this._key&&(b=this._key+this._separator+b),this._parent?this._parent.chainDidChange(this,b,c+1):(c>1&&Ember.propertyDidChange(this.value(),b),b="this."+b,this._paths[b]>0&&Ember.propertyDidChange(this.value(),b))},B.didChange=function(a){if(this._watching){var b=this._parent.value();b!==this._object&&(w(this._object,this._key,this),this._object=b,v(b,this._key,this)),this._value=undefined,this._parent&&this._parent._key==="@each"&&this.value()}var c=this._chains;if(c)for(var d in c){if(!c.hasOwnProperty(d))continue;c[d].didChange(a)}if(a)return;this._parent&&this._parent.chainDidChange(this,this._key,1)},Ember.overrideChains=function(a,b,c){D(a,c,b,"didChange",!0)};var G=Ember.SIMPLE_PROPERTY.watched;Ember.watch=function(a,c){if(c==="length"&&Ember.typeOf(a)==="array")return this;var d=b(a),e=d.watching,g;return c=f(c),e[c]?e[c]=(e[c]||0)+1:(e[c]=1,o(c)?(g=d.descs[c],g=g?g.watched:G,g&&Ember.defineProperty(a,c,g)):C(a).add(c)),this},Ember.isWatching=function(a,c){return!!b(a).watching[c]},Ember.watch.flushPending=y,Ember.unwatch=function(a,c){if(c==="length"&&Ember.typeOf(a)==="array")return this;var d=b(a).watching,e,h;return c=f(c),d[c]===1?(d[c]=0,o(c)?(e=b(a).descs[c],e=e?e.unwatched:g,e&&Ember.defineProperty(a,c,e)):C(a).remove(c)):d[c]>1&&d[c]--,this},Ember.rewatch=function(a){var c=b(a,!1),d=c.chains,e=c.bindings,f,g;h in a&&!a.hasOwnProperty(h)&&Ember.generateGuid(a,"ember"),d&&d.value()!==a&&C(a);if(e&&c.proto!==a)for(f in e)g=!p[f]&&a[f],g&&g instanceof Ember.Binding&&g.fromDidChange(a);return this},Ember.propertyWillChange=H,Ember.propertyDidChange=I;var J=[];Ember.destroy=function(a){var b=a[i],c,d,e,f;if(b){a[i]=null,c=b.chains;if(c){J.push(c);while(J.length>0){c=J.pop(),d=c._chains;if(d)for(e in d)d.hasOwnProperty(e)&&J.push(d[e]);c._watching&&(f=c._object,f&&w(f,c._key,c))}}}}}(),function(){function f(a,b,d,f){var g=c(d);return e(a,["listeners",b,g],f)}function g(a,c){var d=b(a,!1).listeners;return d?d[c]||!1:!1}function i(a,b,c){if(!a)return!1;for(var d in a){if(h[d])continue;var e=a[d];if(e)for(var f in e){if(h[f])continue;var g=e[f];if(g&&b(g,c)===!0)return!0}}return!1}function j(a,b){var c=a.method,d=a.target,e=a.xform;d||(d=b[0]),"string"==typeof c&&(c=d[c]),e?e(d,c,b):c.apply(d,b)}function k(a,b,d,e,g){!e&&"function"==typeof d&&(e=d,d=null);var h=f(a,b,d,!0),i=c(e),j;return h[i]?h[i].xform=g:h[i]={target:d,method:e,xform:g},"function"==typeof a.didAddListener&&a.didAddListener(b,d,e),j}function l(a,b,d,e){!e&&"function"==typeof d&&(e=d,d=null);var g=f(a,b,d,!0),h=c(e);g&&g[h]&&(g[h]=null),a&&"function"==typeof a.didRemoveListener&&a.didRemoveListener(b,d,e)}function m(a,b,d,e,g){!e&&"function"==typeof d&&(e=d,d=null);var h=f(a,b,d,!0),i=c(e),j=h&&h[i];h[i]=null;try{return g.call(d)}finally{h[i]=j}}function n(a){var c=b(a,!1).listeners,d=[];if(c)for(var e in c)!h[e]&&c[e]&&d.push(e);return d}function o(a,b){a!==Ember&&"function"==typeof a.sendEvent&&a.sendEvent.apply(a,d.call(arguments,1));var c=g(a,b);return i(c,j,arguments),!0}function p(a,b){var c=g(a,b),e=[],f=arguments;return i(c,function(a){e.push(a)}),function(){a!==Ember&&"function"==typeof a.sendEvent&&a.sendEvent.apply(a,d.call(f,1));for(var b=0,c=e.length;b<c;++b)j(e[b],f)}}function q(a,b){var c=g(a,b);if(i(c,function(){return!0}))return!0;var d=e(a,["listeners"],!0);return d[b]=null,!1}function r(a,b){var c=g(a,b),d=[];return i(c,function(a){d.push([a.target,a.method])}),d}var a=Ember.platform.create,b=Ember.meta,c=Ember.guidFor,d=Array.prototype.slice,e=Ember.metaPath,h={__ember_source__:!0};Ember.addListener=k,Ember.removeListener=l,Ember._suspendListener=m,Ember.sendEvent=o,Ember.hasListeners=q,Ember.watchedEvents=n,Ember.listenersFor=r,Ember.deferEvent=p}(),function(){function n(a,b){var c=Ember.meta(a,b!==!1),d=c.mixins;return b===!1?d||k:(d?d.__emberproto__!==a&&(d=c.mixins=m(d),d.__emberproto__=a):d=c.mixins={__emberproto__:a},d)}function o(b,c){return c&&c.length>0&&(b.mixins=g(c,function(b){if(b instanceof a)return b;var c=new a;return c.properties=b,c})),b}function q(a){return"function"!=typeof a||a.isMethod===!1?!1:h(p,a)<0}function r(b,d,e,f,g){function u(a){delete e[a],delete f[a]}var j=b.length,k,l,m,n,o,p,s,t;for(k=0;k<j;k++){l=b[k];if(!l)throw new Error("Null value found in Ember.mixin()");if(l instanceof a){m=Ember.guidFor(l);if(d[m])continue;d[m]=l,n=l.properties}else n=l;if(n){t=f.concatenatedProperties||g.concatenatedProperties,n.concatenatedProperties&&(t=t?t.concat(n.concatenatedProperties):n.concatenatedProperties);for(p in n){if(!n.hasOwnProperty(p))continue;o=n[p];if(o instanceof Ember.Descriptor){if(o===c&&e[p])continue;e[p]=o,f[p]=undefined}else{if(q(o)){s=e[p]===Ember.SIMPLE_PROPERTY&&f[p],s||(s=g[p]),"function"!=typeof s&&(s=null);if(s){var v=o.__ember_observes__,w=o.__ember_observesBefore__;o=Ember.wrap(o,s),o.__ember_observes__=v,o.__ember_observesBefore__=w}}else if(t&&h(t,p)>=0||p==="concatenatedProperties"){var x=f[p]||g[p];o=x?x.concat(o):Ember.makeArray(o)}e[p]=Ember.SIMPLE_PROPERTY,f[p]=o}}n.hasOwnProperty("toString")&&(g.toString=n.toString)}else l.mixins&&(r(l.mixins,d,e,f,g),l._without&&i(l._without,u))}}function t(a){var b=Ember.meta(a),c=b.required;if(!c||c.__emberproto__!==a)c=b.required=c?m(c):{__ember_count__:0},c.__emberproto__=a;return c}function u(a){return"function"==typeof a&&a.__ember_observes__}function v(a){return"function"==typeof a&&a.__ember_observesBefore__}function w(a,e,f){var g={},h={},i=Ember.meta(a),j=i.required,k,m,o,p,q,w=Ember._mixinBindings;r(e,n(a),g,h,a),b.detect(a)&&(m=h.willApplyProperty||a.willApplyProperty,o=h.didApplyProperty||a.didApplyProperty);for(k in g){if(!g.hasOwnProperty(k))continue;q=g[k],p=h[k];if(q===c){if(!(k in a)){if(!f)throw new Error("Required property not defined: "+k);j=t(a),j.__ember_count__++,j[k]=!0}}else{while(q instanceof d){var x=q.methodName;g[x]?(p=h[x],q=g[x]):i.descs[x]?(q=i.descs[x],p=q.val(a,x)):(p=a[x],q=Ember.SIMPLE_PROPERTY)}m&&m.call(a,k);var y=u(p),z=y&&u(a[k]),A=v(p),B=A&&v(a[k]),C,D;if(z){C=z.length;for(D=0;D<C;D++)Ember.removeObserver(a,z[D],null,k)}if(B){C=B.length;for(D=0;D<C;D++)Ember.removeBeforeObserver(a,B[D],null,k)}p=w(a,k,p,i),s(a,k,q,p);if(y){C=y.length;for(D=0;D<C;D++)Ember.addObserver(a,y[D],null,k)}if(A){C=A.length;for(D=0;D<C;D++)Ember.addBeforeObserver(a,A[D],null,k)}j&&j[k]&&(j=t(a),j.__ember_count__--,j[k]=!1),o&&o.call(a,k)}}if(!f&&j&&j.__ember_count__>0){var E=[];for(k in j){if(l[k])continue;E.push(k)}throw new Error("Required properties not defined: "+E.join(","))}return a}function y(a,b,c){var d=Ember.guidFor(a);if(c[d])return!1;c[d]=!0;if(a===b)return!0;var e=a.mixins,f=e?e.length:0;while(--f>=0)if(y(e[f],b,c))return!0;return!1}function z(a,b,c){if(c[Ember.guidFor(b)])return;c[Ember.guidFor(b)]=!0;if(b.properties){var d=b.properties;for(var e in d)d.hasOwnProperty(e)&&(a[e]=!0)}else b.mixins&&i(b.mixins,function(b){z(a,b,c)})}function C(a,b,c){var d=a.length;for(var f in b){if(!b.hasOwnProperty||!b.hasOwnProperty(f))continue;var g=b[f];a[d]=f;if(g&&g.toString===e)g[A]=a.join(".");else if(g&&B(g,"isNamespace")){if(c[Ember.guidFor(g)])continue;c[Ember.guidFor(g)]=!0,C(a,g,c)}}a.length=d}function D(){var a=Ember.Namespace,b;if(a.PROCESSED)return;for(var c in window){if(c==="globalStorage"&&window.StorageList&&window.globalStorage instanceof window.StorageList)continue;if(window.hasOwnProperty&&!window.hasOwnProperty(c))continue;try{b=window[c]}catch(d){continue}b&&B(b,"isNamespace")&&(b[A]=c)}}var a,b,c,d,e,f,g=Ember.ArrayUtils.map,h=Ember.ArrayUtils.indexOf,i=Ember.ArrayUtils.forEach,j=Array.prototype.slice,k={},l={__emberproto__:!0,__ember_count__:!0},m=Ember.platform.create,p=[Boolean,Object,Number,Array,Date,String],s=Ember.defineProperty;Ember._mixinBindings=function(a,b,c,d){return c},Ember.mixin=function(a){var b=j.call(arguments,1);return w(a,b,!1)},Ember.Mixin=function(){return o(this,arguments)},a=Ember.Mixin,a._apply=w,a.applyPartial=function(a){var b=j.call(arguments,1);return w(a,b,!0)},a.create=function(){e.processed=!1;var a=this;return o(new a,arguments)},a.prototype.reopen=function(){var b,c;this.properties&&(b=a.create(),b.properties=this.properties,delete this.properties,this.mixins=[b]);var d=arguments.length,e=this.mixins,f;for(f=0;f<d;f++)b=arguments[f],b instanceof a?e.push(b):(c=a.create(),c.properties=b,e.push(c));return this};var x=[];a.prototype.apply=function(a){x[0]=this;var b=w(a,x,!1);return x.length=0,b},a.prototype.applyPartial=function(a){x[0]=this;var b=w(a,x,!0);return x.length=0,b},a.prototype.detect=function(b){return b?b instanceof a?y(b,this,{}):!!n(b,!1)[Ember.guidFor(this)]:!1},a.prototype.without=function(){var b=new a(this);return b._without=j.call(arguments),b},a.prototype.keys=function(){var a={},b={},c=[];z(a,this,b);for(var d in a)a.hasOwnProperty(d)&&c.push(d);return c};var A=Ember.GUID_KEY+"_name",B=Ember.get;Ember.identifyNamespaces=D,f=function(a){var b=a.superclass;if(b)return b[A]?b[A]:f(b);return},e=function(){var a=Ember.Namespace,b;if(a&&!this[A]&&!e.processed){a.PROCESSED||(D(),a.PROCESSED=!0),e.processed=!0;var c=a.NAMESPACES;for(var d=0,g=c.length;d<g;d++)b=c[d],C([b.toString()],b,{})}if(this[A])return this[A];var h=f(this);return h?"(subclass of "+h+")":"(unknown mixin)"},a.prototype.toString=e,a.mixins=function(a){var b=[],c=n(a,!1),d,e;for(d in c){if(l[d])continue;e=c[d],e.properties||b.push(c[d])}return b},c=new Ember.Descriptor,c.toString=function(){return"(Required Property)"},Ember.required=function(){return c},d=function(a){this.methodName=a},d.prototype=new Ember.Descriptor,Ember.alias=function(a){return new d(a)},Ember.MixinDelegate=a.create({willApplyProperty:Ember.required(),didApplyProperty:Ember.required()}),b=Ember.MixinDelegate,Ember.observer=function(a){var b=j.call(arguments,1);return a.__ember_observes__=b,a},Ember.beforeObserver=function(a){var b=j.call(arguments,1);return a.__ember_observesBefore__=b,a}}(),function(){function c(b,c,d,e){c===undefined&&(c=b,b=undefined),"string"==typeof c&&(c=b[c]),d&&e>0&&(d=d.length>e?a.call(d,e):null);if("function"!=typeof Ember.onerror)return c.apply(b||this,d||[]);try{return c.apply(b||this,d||[])}catch(f){Ember.onerror(f)}}function i(){h=null,g.currentRunLoop&&g.end()}function l(){var a=+(new Date),b=-1;for(var d in j){if(!j.hasOwnProperty(d))continue;var e=j[d];if(e&&e.expires)if(a>=e.expires)delete j[d],c(e.target,e.method,e.args,2);else if(b<0||e.expires<b)b=e.expires}b>0&&setTimeout(l,b- +(new Date))}function m(a,b){b[this.tguid]&&delete b[this.tguid][this.mguid],j[a]&&c(this.target,this.method,this.args,2),delete j[a]}function o(){n=null;for(var a in j){if(!j.hasOwnProperty(a))continue;var b=j[a];b.next&&(delete j[a],c(b.target,b.method,b.args,2))}}var a=Array.prototype.slice,b=Ember.ArrayUtils.forEach,d,e=function(){},f=function(a){var b;return this instanceof f?b=this:b=new e,b._prev=a||null,b.onceTimers={},b};e.prototype=f.prototype,f.prototype={end:function(){this.flush()},prev:function(){return this._prev},schedule:function(b,c,d){var e=this._queues,f;e||(e=this._queues={}),f=e[b],f||(f=e[b]=[]);var g=arguments.length>3?a.call(arguments,3):null;return f.push({target:c,method:d,args:g}),this},flush:function(a){function k(a){c(a.target,a.method,a.args)}var e=this._queues,f,g,h,i,j;if(!e)return this;Ember.watch.flushPending();if(a)while(this._queues&&(i=this._queues[a])){this._queues[a]=null;if(a==="sync"){j=Ember.LOG_BINDINGS,j&&Ember.Logger.log("Begin: Flush Sync Queue"),Ember.beginPropertyChanges();try{b(i,k)}finally{Ember.endPropertyChanges()}j&&Ember.Logger.log("End: Flush Sync Queue")}else b(i,k)}else{f=Ember.run.queues,h=f.length;do{this._queues=null;for(g=0;g<h;g++){a=f[g],i=e[a];if(i)if(a==="sync"){j=Ember.LOG_BINDINGS,j&&Ember.Logger.log("Begin: Flush Sync Queue"),Ember.beginPropertyChanges();try{b(i,k)}finally{Ember.endPropertyChanges()}j&&Ember.Logger.log("End: Flush Sync Queue")}else b(i,k)}}while(e=this._queues)}return d=null,this}},Ember.RunLoop=f,Ember.run=function(a,b){var d,e;g.begin();try{if(a||b)d=c(a,b,arguments,2)}finally{g.end()}return d};var g=Ember.run;Ember.run.begin=function(){g.currentRunLoop=new f(g.currentRunLoop)},Ember.run.end=function(){try{g.currentRunLoop.end()}finally{g.currentRunLoop=g.currentRunLoop.prev()}},Ember.run.queues=["sync","actions","destroy","timers"],Ember.run.schedule=function(a,b,c){var d=g.autorun();d.schedule.apply(d,arguments)};var h;Ember.run.autorun=function(){return g.currentRunLoop||(g.begin(),Ember.testing?g.end():h||(h=setTimeout(i,1))),g.currentRunLoop},Ember.run.sync=function(){g.autorun(),g.currentRunLoop.flush("sync")};var j={},k=!1;Ember.run.later=function(b,c){var d,e,f,h,i;return arguments.length===2&&"function"==typeof b?(i=c,c=b,b=undefined,d=[b,c]):(d=a.call(arguments),i=d.pop()),e=+(new Date)+i,f={target:b,method:c,expires:e,args:d},h=Ember.guidFor(f),j[h]=f,g.once(j,l),h},Ember.run.once=function(b,c){var d=Ember.guidFor(b),e=Ember.guidFor(c),f,h,i=g.autorun().onceTimers;return f=i[d]&&i[d][e],f&&j[f]?j[f].args=a.call(arguments):(h={target:b,method:c,args:a.call(arguments),tguid:d,mguid:e},f=Ember.guidFor(h),j[f]=h,i[d]||(i[d]={}),i[d][e]=f,g.schedule("actions",h,m,f,i)),f};var n=!1;Ember.run.next=function(b,c){var d,e;return d={target:b,method:c,args:a.call(arguments),next:!0},e=Ember.guidFor(d),j[e]=d,n||(n=setTimeout(o,1)),e},Ember.run.cancel=function(a){delete j[a]},Ember.RunLoop.begin=ember_deprecateFunc("Use Ember.run.begin instead of Ember.RunLoop.begin.",Ember.run.begin),Ember.RunLoop.end=ember_deprecateFunc("Use Ember.run.end instead of Ember.RunLoop.end.",Ember.run.end)}(),function(){function a(a){return a instanceof Array?a:a===undefined||a===null?[]:[a]}function b(a,b){return a instanceof Array?a.length>1?b:a[0]:a}function j(a,b,c,d){var e=a._typeTransform;e&&(b=e(b,a._placeholder));var f=a._transforms,g=f?f.length:0,h;for(h=0;h<g;h++){var i=f[h][d];i&&(b=i.call(this,b,c))}return b}function k(a){return a===undefined||a===null||a===""||Ember.isArray(a)&&e(a,"length")===0}function l(a,b){return f(i(b)?window:a,b)}function m(a,b){var c=b._operation,d;return c?d=c(a,b._from,b._operand):d=l(a,b._from),j(b,d,a,"to")}function n(a,b){var c=f(a,b._to);return j(b,c,a,"from")}function s(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])}Ember.LOG_BINDINGS=!!Ember.ENV.LOG_BINDINGS,Ember.BENCHMARK_BINDING_NOTIFICATIONS=!!Ember.ENV.BENCHMARK_BINDING_NOTIFICATIONS,Ember.BENCHMARK_BINDING_SETUP=!!Ember.ENV.BENCHMARK_BINDING_SETUP,Ember.MULTIPLE_PLACEHOLDER="@@MULT@@",Ember.EMPTY_PLACEHOLDER="@@EMPTY@@";var c={to:function(a){return!!a}},d={to:function(a){return!a}},e=Ember.get,f=Ember.getPath,g=Ember.setPath,h=Ember.guidFor,i=Ember.isGlobalPath,o=function(a,b,c){return l(a,b)&&l(a,c)},p=function(a,b,c){return l(a,b)||l(a,c)},q=function(){},r=function(a,b){var c;return this instanceof r?c=this:c=new q,c._direction="fwd",c._from=b,c._to=a,c};q.prototype=r.prototype,r.prototype={from:function(a){return this._from=a,this},to:function(a){return this._to=a,this},oneWay:function(a){return this._oneWay=a===undefined?!0:!!a,this},transform:function(a){return"function"==typeof a&&(a={to:a}),this._transforms||(this._transforms=[]),this._transforms.push(a),this},resetTransforms:function(){return this._transforms=null,this},single:function(a){return a===undefined&&(a=Ember.MULTIPLE_PLACEHOLDER),this._typeTransform=b,this._placeholder=a,this},multiple:function(){return this._typeTransform=a,this._placeholder=null,this},bool:function(){return this.transform(c),this},notEmpty:function(a){if(a===null||a===undefined)a=Ember.EMPTY_PLACEHOLDER;return this.transform({to:function(b){return k(b)?a:b}}),this},notNull:function(a){if(a===null||a===undefined)a=Ember.EMPTY_PLACEHOLDER;return this.transform({to:function(b){return b===null||b===undefined?a:b}}),this},not:function(){return this.transform(d),this},isNull:function(){return this.transform(function(a){return a===null||a===undefined}),this},toString:function(){var a=this._oneWay?"[oneWay]":"";return"Ember.Binding<"+h(this)+">("+this._from+" -> "+this._to+")"+a},connect:function(a){var b=this._oneWay,c=this._operand;return Ember.addObserver(a,this._from,this,this.fromDidChange),c&&Ember.addObserver(a,c,this,this.fromDidChange),b||Ember.addObserver(a,this._to,this,this.toDidChange),Ember.meta(a,!1).proto!==a&&this._scheduleSync(a,"fwd"),this._readyToSync=!0,this},disconnect:function(a){var b=this._oneWay,c=this._operand;return Ember.removeObserver(a,this._from,this,this.fromDidChange),c&&Ember.removeObserver(a,c,this,this.fromDidChange),b||Ember.removeObserver(a,this._to,this,this.toDidChange),this._readyToSync=!1
,this},fromDidChange:function(a){this._scheduleSync(a,"fwd")},toDidChange:function(a){this._scheduleSync(a,"back")},_scheduleSync:function(a,b){var c=h(a),d=this[c];d||(Ember.run.schedule("sync",this,this._sync,a),this[c]=b),d==="back"&&b==="fwd"&&(this[c]="fwd")},_sync:function(a){var b=Ember.LOG_BINDINGS;if(a.isDestroyed||!this._readyToSync)return;var c=h(a),d=this[c],e=this._from,f=this._to;delete this[c];if(d==="fwd"){var g=m(a,this);b&&Ember.Logger.log(" ",this.toString(),"->",g,a),this._oneWay?Ember.trySetPath(Ember.isGlobalPath(f)?window:a,f,g):Ember._suspendObserver(a,f,this,this.toDidChange,function(){Ember.trySetPath(Ember.isGlobalPath(f)?window:a,f,g)})}else if(d==="back"){var i=n(a,this);b&&Ember.Logger.log(" ",this.toString(),"<-",i,a),Ember._suspendObserver(a,e,this,this.fromDidChange,function(){Ember.trySetPath(Ember.isGlobalPath(e)?window:a,e,i)})}}},s(r,{from:function(){var a=this,b=new a;return b.from.apply(b,arguments)},to:function(){var a=this,b=new a;return b.to.apply(b,arguments)},oneWay:function(a,b){var c=this,d=new c(null,a);return d.oneWay(b)},single:function(a,b){var c=this,d=new c(null,a);return d.single(b)},multiple:function(a){var b=this,c=new b(null,a);return c.multiple()},transform:function(a,b){b||(b=a,a=null);var c=this,d=new c(null,a);return d.transform(b)},notEmpty:function(a,b){var c=this,d=new c(null,a);return d.notEmpty(b)},notNull:function(a,b){var c=this,d=new c(null,a);return d.notNull(b)},bool:function(a){var b=this,c=new b(null,a);return c.bool()},not:function(a){var b=this,c=new b(null,a);return c.not()},isNull:function(a){var b=this,c=new b(null,a);return c.isNull()},and:function(a,b){var c=this,d=(new c(null,a)).oneWay();return d._operand=b,d._operation=o,d},or:function(a,b){var c=this,d=(new c(null,a)).oneWay();return d._operand=b,d._operation=p,d}}),Ember.Binding=r,Ember.bind=function(a,b,c){return(new Ember.Binding(b,c)).connect(a)},Ember.oneWay=function(a,b,c){return(new Ember.Binding(b,c)).oneWay().connect(a)}}(),function(){}(),function(){}(),function(){function e(b,c,d,f){var g,h,i;if("object"!=typeof b||b===null)return b;if(c&&(h=a(d,b))>=0)return f[h];if(Ember.typeOf(b)==="array"){g=b.slice();if(c){h=g.length;while(--h>=0)g[h]=e(g[h],c,d,f)}}else if(Ember.Copyable&&Ember.Copyable.detect(b))g=b.copy(c,d,f);else{g={};for(i in b){if(!b.hasOwnProperty(i))continue;g[i]=c?e(b[i],c,d,f):b[i]}}return c&&(d.push(b),f.push(g)),g}var a=Ember.ArrayUtils.indexOf;typeof console=="undefined"&&(window.console={},console.log=console.info=console.warn=console.error=function(){});var b={},c="Boolean Number String Function Array Date RegExp Object".split(" ");Ember.ArrayUtils.forEach(c,function(a){b["[object "+a+"]"]=a.toLowerCase()});var d=Object.prototype.toString;Ember.typeOf=function(a){var c;return c=a===null||a===undefined?String(a):b[d.call(a)]||"object",c==="function"?Ember.Object&&Ember.Object.detect(a)&&(c="class"):c==="object"&&(a instanceof Error?c="error":Ember.Object&&a instanceof Ember.Object?c="instance":c="object"),c},Ember.none=function(a){return a===null||a===undefined},Ember.empty=function(a){return a===null||a===undefined||a.length===0&&typeof a!="function"},Ember.compare=function f(a,b){if(a===b)return 0;var c=Ember.typeOf(a),d=Ember.typeOf(b),e=Ember.Comparable;if(e){if(c==="instance"&&e.detect(a.constructor))return a.constructor.compare(a,b);if(d==="instance"&&e.detect(b.constructor))return 1-b.constructor.compare(b,a)}var g=Ember.ORDER_DEFINITION_MAPPING;if(!g){var h=Ember.ORDER_DEFINITION;g=Ember.ORDER_DEFINITION_MAPPING={};var i,j;for(i=0,j=h.length;i<j;++i)g[h[i]]=i;delete Ember.ORDER_DEFINITION}var k=g[c],l=g[d];if(k<l)return-1;if(k>l)return 1;switch(c){case"boolean":case"number":if(a<b)return-1;if(a>b)return 1;return 0;case"string":var m=a.localeCompare(b);if(m<0)return-1;if(m>0)return 1;return 0;case"array":var n=a.length,o=b.length,p=Math.min(n,o),q=0,r=0;while(q===0&&r<p)q=f(a[r],b[r]),r++;if(q!==0)return q;if(n<o)return-1;if(n>o)return 1;return 0;case"instance":if(Ember.Comparable&&Ember.Comparable.detect(a))return a.compare(a,b);return 0;default:return 0}},Ember.copy=function(a,b){return"object"!=typeof a||a===null?a:Ember.Copyable&&Ember.Copyable.detect(a)?a.copy(b):e(a,b,b?[]:null,b?[]:null)},Ember.inspect=function(a){var b,c=[];for(var d in a)if(a.hasOwnProperty(d)){b=a[d];if(b==="toString")continue;Ember.typeOf(b)==="function"&&(b="function() { ... }"),c.push(d+": "+b)}return"{"+c.join(" , ")+"}"},Ember.isEqual=function(a,b){return a&&"function"==typeof a.isEqual?a.isEqual(b):a===b},Ember.ORDER_DEFINITION=Ember.ENV.ORDER_DEFINITION||["undefined","null","boolean","number","string","array","object","instance","function","class"],Ember.keys=Object.keys,Ember.keys||(Ember.keys=function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b}),Ember.Error=function(){var a=Error.prototype.constructor.apply(this,arguments);for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);this.message=a.message},Ember.Error.prototype=Ember.create(Error.prototype)}(),function(){var a=/[ _]/g,b={},c=/([a-z])([A-Z])/g,d=/(\-|_|\s)+(.)?/g,e=/([a-z\d])([A-Z]+)/g,f=/\-|\s+/g;Ember.STRINGS={},Ember.String={fmt:function(a,b){var c=0;return a.replace(/%@([0-9]+)?/g,function(a,d){return d=d?parseInt(d,0)-1:c++,a=b[d],(a===null?"(null)":a===undefined?"":a).toString()})},loc:function(a,b){return a=Ember.STRINGS[a]||a,Ember.String.fmt(a,b)},w:function(a){return a.split(/\s+/)},decamelize:function(a){return a.replace(c,"$1_$2").toLowerCase()},dasherize:function(c){var d=b,e=d[c];return e?e:(e=Ember.String.decamelize(c).replace(a,"-"),d[c]=e,e)},camelize:function(a){return a.replace(d,function(a,b,c){return c?c.toUpperCase():""})},underscore:function(a){return a.replace(e,"$1_$2").replace(f,"_").toLowerCase()}}}(),function(){var a=Ember.String.fmt,b=Ember.String.w,c=Ember.String.loc,d=Ember.String.camelize,e=Ember.String.decamelize,f=Ember.String.dasherize,g=Ember.String.underscore;Ember.EXTEND_PROTOTYPES&&(String.prototype.fmt=function(){return a(this,arguments)},String.prototype.w=function(){return b(this)},String.prototype.loc=function(){return c(this,arguments)},String.prototype.camelize=function(){return d(this)},String.prototype.decamelize=function(){return e(this)},String.prototype.dasherize=function(){return f(this)},String.prototype.underscore=function(){return g(this)})}(),function(){var a=Array.prototype.slice;Ember.EXTEND_PROTOTYPES&&(Function.prototype.property=function(){var a=Ember.computed(this);return a.property.apply(a,arguments)},Function.prototype.observes=function(){return this.__ember_observes__=a.call(arguments),this},Function.prototype.observesBefore=function(){return this.__ember_observesBefore__=a.call(arguments),this})}(),function(){var a=Ember.IS_BINDING=/^.+Binding$/;Ember._mixinBindings=function(b,c,d,e){if(a.test(c)){d instanceof Ember.Binding?d.to(c.slice(0,-7)):d=new Ember.Binding(c.slice(0,-7),d),d.connect(b);var f=e.bindings;f?f.__emberproto__!==b&&(f=e.bindings=Ember.create(e.bindings),f.__emberproto__=b):f=e.bindings={__emberproto__:b},f[c]=!0}return d}}(),function(){}(),function(){function f(){return e.length===0?{}:e.pop()}function g(a){return e.push(a),null}function h(b,c){function e(e){var f=a(e,b);return d?c===f:!!f}var d=arguments.length===2;return e}function i(a,b,c){b.call(a,c[0],c[2],c[3])}var a=Ember.get,b=Ember.set,c=Array.prototype.slice,d=Ember.ArrayUtils.indexOf,e=[];Ember.Enumerable=Ember.Mixin.create({isEnumerable:!0,nextObject:Ember.required(Function),firstObject:Ember.computed(function(){if(a(this,"length")===0)return undefined;if(Ember.Array&&Ember.Array.detect(this))return this.objectAt(0);var b=f(),c;return c=this.nextObject(0,null,b),g(b),c}).property(),lastObject:Ember.computed(function(){var b=a(this,"length");if(b===0)return undefined;if(Ember.Array&&Ember.Array.detect(this))return this.objectAt(b-1);var c=f(),d=0,e,h=null;do h=e,e=this.nextObject(d++,h,c);while(e!==undefined);return g(c),h}).property(),contains:function(a){return this.find(function(b){return b===a})!==undefined},forEach:function(b,c){if(typeof b!="function")throw new TypeError;var d=a(this,"length"),e=null,h=f();c===undefined&&(c=null);for(var i=0;i<d;i++){var j=this.nextObject(i,e,h);b.call(c,j,i,this),e=j}return e=null,h=g(h),this},getEach:function(a){return this.mapProperty(a)},setEach:function(a,c){return this.forEach(function(d){b(d,a,c)})},map:function(a,b){var c=[];return this.forEach(function(d,e,f){c[e]=a.call(b,d,e,f)}),c},mapProperty:function(b){return this.map(function(c){return a(c,b)})},filter:function(a,b){var c=[];return this.forEach(function(d,e,f){a.call(b,d,e,f)&&c.push(d)}),c},filterProperty:function(a,b){return this.filter(h.apply(this,arguments))},find:function(b,c){var d=a(this,"length");c===undefined&&(c=null);var e=null,h,i=!1,j,k=f();for(var l=0;l<d&&!i;l++){h=this.nextObject(l,e,k);if(i=b.call(c,h,l,this))j=h;e=h}return h=e=null,k=g(k),j},findProperty:function(a,b){return this.find(h.apply(this,arguments))},every:function(a,b){return!this.find(function(c,d,e){return!a.call(b,c,d,e)})},everyProperty:function(a,b){return this.every(h.apply(this,arguments))},some:function(a,b){return!!this.find(function(c,d,e){return!!a.call(b,c,d,e)})},someProperty:function(a,b){return this.some(h.apply(this,arguments))},reduce:function(a,b,c){if(typeof a!="function")throw new TypeError;var d=b;return this.forEach(function(b,e){d=a.call(null,d,b,e,this,c)},this),d},invoke:function(a){var b,d=[];return arguments.length>1&&(b=c.call(arguments,1)),this.forEach(function(c,e){var f=c&&c[a];"function"==typeof f&&(d[e]=b?f.apply(c,b):f.call(c))},this),d},toArray:function(){var a=[];return this.forEach(function(b,c){a[c]=b}),a},compact:function(){return this.without(null)},without:function(a){if(!this.contains(a))return this;var b=[];return this.forEach(function(c){c!==a&&(b[b.length]=c)}),b},uniq:function(){var a=[];return this.forEach(function(b){d(a,b)<0&&a.push(b)}),a},"[]":Ember.computed(function(a,b){return this}).property().cacheable(),addEnumerableObserver:function(b,c){var d=c&&c.willChange||"enumerableWillChange",e=c&&c.didChange||"enumerableDidChange",f=a(this,"hasEnumerableObservers");return f||Ember.propertyWillChange(this,"hasEnumerableObservers"),Ember.addListener(this,"@enumerable:before",b,d,i),Ember.addListener(this,"@enumerable:change",b,e,i),f||Ember.propertyDidChange(this,"hasEnumerableObservers"),this},removeEnumerableObserver:function(b,c){var d=c&&c.willChange||"enumerableWillChange",e=c&&c.didChange||"enumerableDidChange",f=a(this,"hasEnumerableObservers");return f&&Ember.propertyWillChange(this,"hasEnumerableObservers"),Ember.removeListener(this,"@enumerable:before",b,d),Ember.removeListener(this,"@enumerable:change",b,e),f&&Ember.propertyDidChange(this,"hasEnumerableObservers"),this},hasEnumerableObservers:Ember.computed(function(){return Ember.hasListeners(this,"@enumerable:change")||Ember.hasListeners(this,"@enumerable:before")}).property().cacheable(),enumerableContentWillChange:function(b,c){var d,e,f;return"number"==typeof b?d=b:b?d=a(b,"length"):d=b=-1,"number"==typeof c?e=c:c?e=a(c,"length"):e=c=-1,f=e<0||d<0||e-d!==0,b===-1&&(b=null),c===-1&&(c=null),f&&Ember.propertyWillChange(this,"length"),Ember.sendEvent(this,"@enumerable:before",b,c),this},enumerableContentDidChange:function(b,c){var d=this.propertyDidChange,e,f,g;return"number"==typeof b?e=b:b?e=a(b,"length"):e=b=-1,"number"==typeof c?f=c:c?f=a(c,"length"):f=c=-1,g=f<0||e<0||f-e!==0,b===-1&&(b=null),c===-1&&(c=null),Ember.sendEvent(this,"@enumerable:change",b,c),g&&Ember.propertyDidChange(this,"length"),this}})}(),function(){function e(a){return a===null||a===undefined}function f(a,b,c){b.call(a,c[0],c[2],c[3],c[4])}var a=Ember.get,b=Ember.set,c=Ember.meta,d=Ember.ArrayUtils.map;Ember.Array=Ember.Mixin.create(Ember.Enumerable,{isSCArray:!0,length:Ember.required(),objectAt:function(b){return b<0||b>=a(this,"length")?undefined:a(this,b)},objectsAt:function(a){var b=this;return d(a,function(a,c){return b.objectAt(c)})},nextObject:function(a){return this.objectAt(a)},"[]":Ember.computed(function(b,c){return c!==undefined&&this.replace(0,a(this,"length"),c),this}).property().cacheable(),contains:function(a){return this.indexOf(a)>=0},slice:function(b,c){var d=[],f=a(this,"length");e(b)&&(b=0);if(e(c)||c>f)c=f;while(b<c)d[d.length]=this.objectAt(b++);return d},indexOf:function(b,c){var d,e=a(this,"length");c===undefined&&(c=0),c<0&&(c+=e);for(d=c;d<e;d++)if(this.objectAt(d,!0)===b)return d;return-1},lastIndexOf:function(b,c){var d,e=a(this,"length");if(c===undefined||c>=e)c=e-1;c<0&&(c+=e);for(d=c;d>=0;d--)if(this.objectAt(d)===b)return d;return-1},addArrayObserver:function(b,c){var d=c&&c.willChange||"arrayWillChange",e=c&&c.didChange||"arrayDidChange",g=a(this,"hasArrayObservers");return g||Ember.propertyWillChange(this,"hasArrayObservers"),Ember.addListener(this,"@array:before",b,d,f),Ember.addListener(this,"@array:change",b,e,f),g||Ember.propertyDidChange(this,"hasArrayObservers"),this},removeArrayObserver:function(b,c){var d=c&&c.willChange||"arrayWillChange",e=c&&c.didChange||"arrayDidChange",g=a(this,"hasArrayObservers");return g&&Ember.propertyWillChange(this,"hasArrayObservers"),Ember.removeListener(this,"@array:before",b,d,f),Ember.removeListener(this,"@array:change",b,e,f),g&&Ember.propertyDidChange(this,"hasArrayObservers"),this},hasArrayObservers:Ember.computed(function(){return Ember.hasListeners(this,"@array:change")||Ember.hasListeners(this,"@array:before")}).property().cacheable(),arrayContentWillChange:function(b,c,d){b===undefined?(b=0,c=d=-1):(c||(c=0),d||(d=0)),Ember.sendEvent(this,"@array:before",b,c,d);var e,f;if(b>=0&&c>=0&&a(this,"hasEnumerableObservers")){e=[],f=b+c;for(var g=b;g<f;g++)e.push(this.objectAt(g))}else e=c;return this.enumerableContentWillChange(e,d),Ember.isWatching(this,"@each")&&a(this,"@each"),this},arrayContentDidChange:function(b,c,d){b===undefined?(b=0,c=d=-1):(c||(c=0),d||(d=0));var e,f;if(b>=0&&d>=0&&a(this,"hasEnumerableObservers")){e=[],f=b+d;for(var g=b;g<f;g++)e.push(this.objectAt(g))}else e=d;return this.enumerableContentDidChange(c,e),Ember.sendEvent(this,"@array:change",b,c,d),this},"@each":Ember.computed(function(){return this.__each||(this.__each=new Ember.EachProxy(this)),this.__each}).property().cacheable()})}(),function(){Ember.Comparable=Ember.Mixin.create({isComparable:!0,compare:Ember.required(Function)})}(),function(){var a=Ember.get,b=Ember.set;Ember.Copyable=Ember.Mixin.create({copy:Ember.required(Function),frozenCopy:function(){if(Ember.Freezable&&Ember.Freezable.detect(this))return a(this,"isFrozen")?this:this.copy().freeze();throw new Error(Ember.String.fmt("%@ does not support freezing",[this]))}})}(),function(){var a=Ember.get,b=Ember.set;Ember.Freezable=Ember.Mixin.create({isFrozen:!1,freeze:function(){return a(this,"isFrozen")?this:(b(this,"isFrozen",!0),this)}}),Ember.FROZEN_ERROR="Frozen object cannot be modified."}(),function(){var a=Ember.ArrayUtils.forEach;Ember.MutableEnumerable=Ember.Mixin.create(Ember.Enumerable,{addObject:Ember.required(Function),addObjects:function(b){return Ember.beginPropertyChanges(this),a(b,function(a){this.addObject(a)},this),Ember.endPropertyChanges(this),this},removeObject:Ember.required(Function),removeObjects:function(b){return Ember.beginPropertyChanges(this),a(b,function(a){this.removeObject(a)},this),Ember.endPropertyChanges(this),this}})}(),function(){var a="Index out of range",b=[],c=Ember.get,d=Ember.set,e=Ember.ArrayUtils.forEach;Ember.MutableArray=Ember.Mixin.create(Ember.Array,Ember.MutableEnumerable,{replace:Ember.required(),clear:function(){var a=c(this,"length");return a===0?this:(this.replace(0,a,b),this)},insertAt:function(b,d){if(b>c(this,"length"))throw new Error(a);return this.replace(b,0,[d]),this},removeAt:function(d,e){var f=0;if("number"==typeof d){if(d<0||d>=c(this,"length"))throw new Error(a);e===undefined&&(e=1),this.replace(d,e,b)}return this},pushObject:function(a){return this.insertAt(c(this,"length"),a),a},pushObjects:function(a){return this.replace(c(this,"length"),0,a),this},popObject:function(){var a=c(this,"length");if(a===0)return null;var b=this.objectAt(a-1);return this.removeAt(a-1,1),b},shiftObject:function(){if(c(this,"length")===0)return null;var a=this.objectAt(0);return this.removeAt(0),a},unshiftObject:function(a){return this.insertAt(0,a),a},unshiftObjects:function(a){return this.beginPropertyChanges(),e(a,function(a){this.unshiftObject(a)},this),this.endPropertyChanges(),this},removeObject:function(a){var b=c(this,"length")||0;while(--b>=0){var d=this.objectAt(b);d===a&&this.removeAt(b)}return this},addObject:function(a){return this.contains(a)||this.pushObject(a),this}})}(),function(){var a=Ember.get,b=Ember.set;Ember.Observable=Ember.Mixin.create({isObserverable:!0,get:function(b){return a(this,b)},getProperties:function(){var b={};for(var c=0;c<arguments.length;c++)b[arguments[c]]=a(this,arguments[c]);return b},set:function(a,c){return b(this,a,c),this},setProperties:function(a){return Ember.setProperties(this,a)},beginPropertyChanges:function(){return Ember.beginPropertyChanges(),this},endPropertyChanges:function(){return Ember.endPropertyChanges(),this},propertyWillChange:function(a){return Ember.propertyWillChange(this,a),this},propertyDidChange:function(a){return Ember.propertyDidChange(this,a),this},notifyPropertyChange:function(a){return this.propertyWillChange(a),this.propertyDidChange(a),this},addObserver:function(a,b,c){Ember.addObserver(this,a,b,c)},removeObserver:function(a,b,c){Ember.removeObserver(this,a,b,c)},hasObserverFor:function(a){return Ember.hasListeners(this,a+":change")},unknownProperty:function(a){return undefined},setUnknownProperty:function(a,b){this[a]=b},getPath:function(a){return Ember.getPath(this,a)},setPath:function(a,b){return Ember.setPath(this,a,b),this},getWithDefault:function(a,b){return Ember.getWithDefault(this,a,b)},incrementProperty:function(c,d){return d||(d=1),b(this,c,(a(this,c)||0)+d),a(this,c)},decrementProperty:function(c,d){return d||(d=1),b(this,c,(a(this,c)||0)-d),a(this,c)},toggleProperty:function(c){return b(this,c,!a(this,c)),a(this,c)},cacheFor:function(a){return Ember.cacheFor(this,a)},observersForKey:function(a){return Ember.observersFor(this,a)}})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.getPath;Ember.TargetActionSupport=Ember.Mixin.create({target:null,action:null,targetObject:Ember.computed(function(){var b=a(this,"target");if(Ember.typeOf(b)==="string"){var d=c(this,b,!1);return d===undefined&&(d=c(window,b)),d}return b}).property("target").cacheable(),triggerAction:function(){var b=a(this,"action"),c=a(this,"targetObject");if(c&&b){var d;return typeof c.send=="function"?d=c.send(b,this):(typeof b=="string"&&(b=c[b]),d=b.call(c,this)),d!==!1&&(d=!0),d}return!1}})}(),function(){function d(a,b,d){var e=c.call(d,2);b.apply(a,e)}var a=Ember.get,b=Ember.set,c=Array.prototype.slice;Ember.Evented=Ember.Mixin.create({on:function(a,b,c){c||(c=b,b=null),Ember.addListener(this,a,b,c,d)},fire:function(a){Ember.sendEvent.apply(null,[this,a].concat(c.call(arguments,1)))},off:function(a,b,c){Ember.removeListener(this,a,b,c)}})}(),function(){}(),function(){function i(){var c=!1,d,e=!1,g=!1,i=function(){c||i.proto(),d?(this.reopen.apply(this,d),d=null,a(this),this.init.apply(this,arguments)):(g?a(this):(Ember.GUID_DESC.value=undefined,f(this,Ember.GUID_KEY,Ember.GUID_DESC)),e===!1&&(e=this.init),Ember.GUID_DESC.value=undefined,f(this,"_super",Ember.GUID_DESC),e.apply(this,arguments))};return i.toString=b,i.willReopen=function(){c&&(i.PrototypeMixin=Ember.Mixin.create(i.PrototypeMixin)),c=!1},i._initMixins=function(a){d=a},i.proto=function(){var a=i.superclass;return a&&a.proto(),c||(c=!0,i.PrototypeMixin.applyPartial(i.prototype),Ember.rewatch(i.prototype),g=!!h(i.prototype,!1).chains),this.prototype},i}var a=Ember.rewatch,b=Ember.Mixin.prototype.toString,c=Ember.set,d=Ember.get,e=Ember.platform.create,f=Ember.platform.defineProperty,g=Array.prototype.slice,h=Ember.meta,j=i();j.PrototypeMixin=Ember.Mixin.create({reopen:function(){return Ember.Mixin._apply(this,arguments,!0),this},isInstance:!0,init:function(){},isDestroyed:!1,isDestroying:!1,destroy:function(){if(this.isDestroying)return;return this.isDestroying=!0,this.willDestroy&&this.willDestroy(),c(this,"isDestroyed",!0),Ember.run.schedule("destroy",this,this._scheduledDestroy),this},_scheduledDestroy:function(){Ember.destroy(this),this.didDestroy&&this.didDestroy()},bind:function(a,b){return b instanceof Ember.Binding||(b=Ember.Binding.from(b)),b.to(a).connect(this),b},toString:function(){return"<"+this.constructor.toString()+":"+Ember.guidFor(this)+">"}}),j.__super__=null;var k=Ember.Mixin.create({ClassMixin:Ember.required(),PrototypeMixin:Ember.required(),isClass:!0,isMethod:!1,extend:function(){var a=i(),b;a.ClassMixin=Ember.Mixin.create(this.ClassMixin),a.PrototypeMixin=Ember.Mixin.create(this.PrototypeMixin),a.ClassMixin.ownerConstructor=a,a.PrototypeMixin.ownerConstructor=a;var c=a.PrototypeMixin;return c.reopen.apply(c,arguments),a.superclass=this,a.__super__=this.prototype,b=a.prototype=e(this.prototype),b.constructor=a,Ember.generateGuid(b,"ember"),h(b).proto=b,a.subclasses=Ember.Set?new Ember.Set:null,this.subclasses&&this.subclasses.add(a),a.ClassMixin.apply(a),a},create:function(){var a=this;return arguments.length>0&&this._initMixins(arguments),new a},reopen:function(){this.willReopen();var a=this.PrototypeMixin;return a.reopen.apply(a,arguments),this},reopenClass:function(){var a=this.ClassMixin;return a.reopen.apply(a,arguments),Ember.Mixin._apply(this,arguments,!1),this},detect:function(a){if("function"!=typeof a)return!1;while(a){if(a===this)return!0;a=a.superclass}return!1},detectInstance:function(a){return a instanceof this},metaForProperty:function(a){var b=h(this.proto(),!1).descs[a];return b._meta||{}},eachComputedProperty:function(a,b){var c=this.proto(),d=h(c).descs,e={},f;for(var g in d)f=d[g],f instanceof Ember.ComputedProperty&&a.call(b||this,g,f._meta||e)}});j.ClassMixin=k,k.apply(j),Ember.CoreObject=j}(),function(){var a=Ember.get,b=Ember.set,c=Ember.guidFor,d=Ember.none;Ember.Set=Ember.CoreObject.extend(Ember.MutableEnumerable,Ember.Copyable,Ember.Freezable,{length:0,clear:function(){if(this.isFrozen)throw new Error(Ember.FROZEN_ERROR);var d=a(this,"length"),e;this.enumerableContentWillChange(d,0);for(var f=0;f<d;f++)e=c(this[f]),delete this[e],delete this[f];return b(this,"length",0),this.enumerableContentDidChange(d,0),this},isEqual:function(b){if(!Ember.Enumerable.detect(b))return!1;var c=a(this,"length");if(a(b,"length")!==c)return!1;while(--c>=0)if(!b.contains(this[c]))return!1;return!0},add:Ember.alias("addObject"),remove:Ember.alias("removeObject"),pop:function(){if(a(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);var b=this.length>0?this[this.length-1]:null;return this.remove(b),b},push:Ember.alias("addObject"),shift:Ember.alias("pop"),unshift:Ember.alias("push"),addEach:Ember.alias("addObjects"),removeEach:Ember.alias("removeObjects"),init:function(a){this._super(),a&&this.addObjects(a)},nextObject:function(a){return this[a]},firstObject:Ember.computed(function(){return this.length>0?this[0]:undefined}).property("[]").cacheable(),lastObject:Ember.computed(function(){return this.length>0?this[this.length-1]:undefined}).property("[]").cacheable(),addObject:function(e){if(a(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);if(d(e))return this;var f=c(e),g=this[f],h=a(this,"length"),i;return g>=0&&g<h&&this[g]===e?this:(i=[e],this.enumerableContentWillChange(null,i),h=a(this,"length"),this[f]=h,this[h]=e,b(this,"length",h+1),this.enumerableContentDidChange(null,i),this)},removeObject:function(e){if(a(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);if(d(e))return this;var f=c(e),g=this[f],h=a(this,"length"),i,j;return g>=0&&g<h&&this[g]===e&&(j=[e],this.enumerableContentWillChange(j,null),g<h-1&&(i=this[h-1],this[g]=i,this[c(i)]=g),delete this[f],delete this[h-1],b(this,"length",h-1),this.enumerableContentDidChange(j,null)),this},contains:function(a){return this[c(a)]>=0},copy:function(){var d=this.constructor,e=new d,f=a(this,"length");b(e,"length",f);while(--f>=0)e[f]=this[f],e[c(this[f])]=f;return e},toString:function(){var a=this.length,b,c=[];for(b=0;b<a;b++)c[b]=this[b];return"Ember.Set<%@>".fmt(c.join(","))},isSet:!0});var e=Ember.Set.create;Ember.Set.create=function(a){return a&&Ember.Enumerable.detect(a)?new Ember.Set(a):e.apply(this,arguments)}}(),function(){Ember.CoreObject.subclasses=new Ember.Set,Ember.Object=Ember.CoreObject.extend(Ember.Observable)}(),function(){var a=Ember.ArrayUtils.indexOf;Ember.Namespace=Ember.Object.extend({isNamespace:!0,init:function(){Ember.Namespace.NAMESPACES.push(this),Ember.Namespace.PROCESSED=!1},toString:function(){return Ember.identifyNamespaces(),this[Ember.GUID_KEY+"_name"]},destroy:function(){var b=Ember.Namespace.NAMESPACES;window[this.toString()]=undefined,b.splice(a(b,this),1),this._super()}}),Ember.Namespace.NAMESPACES=[Ember],Ember.Namespace.PROCESSED=!1}(),function(){Ember.Application=Ember.Namespace.extend()}(),function(){var a=Ember.get,b=Ember.set;Ember.ArrayProxy=Ember.Object.extend(Ember.MutableArray,{content:null,objectAtContent:function(b){return a(this,"content").objectAt(b)},replaceContent:function(b,c,d){a(this,"content").replace(b,c,d)},contentWillChange:Ember.beforeObserver(function(){var b=a(this,"content"),c=b?a(b,"length"):0;this.arrayWillChange(b,0,c,undefined),b&&b.removeArrayObserver(this)},"content"),contentDidChange:Ember.observer(function(){var b=a(this,"content"),c=b?a(b,"length"):0;b&&b.addArrayObserver(this),this.arrayDidChange(b,0,undefined,c)},"content"),objectAt:function(b){return a(this,"content")&&this.objectAtContent(b)},length:Ember.computed(function(){var b=a(this,"content");return b?a(b,"length"):0}).property("content.length").cacheable(),replace:function(b,c,d){return a(this,"content")&&this.replaceContent(b,c,d),this},arrayWillChange:function(a,b,c,d){this.arrayContentWillChange(b,c,d)},arrayDidChange:function(a,b,c,d){this.arrayContentDidChange(b,c,d)},init:function(){this._super(),this.contentDidChange()}})}(),function(){function g(a,b,d,e,f){var g=d._objects,h;g||(g=d._objects={});while(--f>=e){var i=a.objectAt(f);i&&(Ember.addBeforeObserver(i,b,d,"contentKeyWillChange"),Ember.addObserver(i,b,d,"contentKeyDidChange"),h=c(i),g[h]||(g[h]=[]),g[h].push(f))}}function h(a,b,d,e,f){var g=d._objects;g||(g=d._objects={});var h,i;while(--f>=e){var j=a.objectAt(f);j&&(Ember.removeBeforeObserver(j,b,d,"contentKeyWillChange"),Ember.removeObserver(j,b,d,"contentKeyDidChange"),i=c(j),h=g[i],h[h.indexOf(f)]=null)}}var a=Ember.set,b=Ember.get,c=Ember.guidFor,d=Ember.ArrayUtils.forEach,e=Ember.Object.extend(Ember.Array,{init:function(a,b,c){this._super(),this._keyName=b,this._owner=c,this._content=a},objectAt:function(a){var c=this._content.objectAt(a);return c&&b(c,this._keyName)},length:Ember.computed(function(){var a=this._content;return a?b(a,"length"):0}).property("[]").cacheable()}),f=/^.+:(before|change)$/;Ember.EachProxy=Ember.Object.extend({init:function(a){this._super(),this._content=a,a.addArrayObserver(this),d(Ember.watchedEvents(this),function(a){this.didAddListener(a)},this)},unknownProperty:function(a,b){var c;return c=new e(this._content,a,this),(new Ember.Descriptor).setup(this,a,c),this.beginObservingContentKey(a),c},arrayWillChange:function(a,b,c,d){var e=this._keys,f,g,i;i=c>0?b+c:-1,Ember.beginPropertyChanges(this);for(f in e){if(!e.hasOwnProperty(f))continue;i>0&&h(a,f,this,b,i),Ember.propertyWillChange(this,f)}Ember.propertyWillChange(this._content,"@each"),Ember.endPropertyChanges(this)},arrayDidChange:function(a,b,c,d){var e=this._keys,f,h,i;i=d>0?b+d:-1,Ember.beginPropertyChanges(this);for(f in e){if(!e.hasOwnProperty(f))continue;i>0&&g(a,f,this,b,i),Ember.propertyDidChange(this,f)}Ember.propertyDidChange(this._content,"@each"),Ember.endPropertyChanges(this)},didAddListener:function(a){f.test(a)&&this.beginObservingContentKey(a.slice(0,-7))},didRemoveListener:function(a){f.test(a)&&this.stopObservingContentKey(a.slice(0,-7))},beginObservingContentKey:function(a){var c=this._keys;c||(c=this._keys={});if(!c[a]){c[a]=1;var d=this._content,e=b(d,"length");g(d,a,this,0,e)}else c[a]++},stopObservingContentKey:function(a){var c=this._keys;if(c&&c[a]>0&&--c[a]<=0){var d=this._content,e=b(d,"length");h(d,a,this,0,e)}},contentKeyWillChange:function(a,b){Ember.propertyWillChange(this,b)},contentKeyDidChange:function(a,b){Ember.propertyDidChange(this,b)}})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.Mixin.create(Ember.MutableArray,Ember.Observable,Ember.Copyable,{get:function(a){return a==="length"?this.length:"number"==typeof a?this[a]:this._super(a)},objectAt:function(a){return this[a]},replace:function(b,c,d){if(this.isFrozen)throw Ember.FROZEN_ERROR;var e=d?a(d,"length"):0;this.arrayContentWillChange(b,c,e);if(!d||d.length===0)this.splice(b,c);else{var f=[b,c].concat(d);this.splice.apply(this,f)}return this.arrayContentDidChange(b,c,e),this},unknownProperty:function(a,b){var c;return b!==undefined&&c===undefined&&(c=this[a]=b),c},indexOf:function(a,b){var c,d=this.length;b===undefined?b=0:b=b<0?Math.ceil(b):Math.floor(b),b<0&&(b+=d);for(c=b;c<d;c++)if(this[c]===a)return c;return-1},lastIndexOf:function(a,b){var c,d=this.length;b===undefined?b=d-1:b=b<0?Math.ceil(b):Math.floor(b),b<0&&(b+=d);for(c=b;c>=0;c--)if(this[c]===a)return c;return-1},copy:function(){return this.slice()}}),d=["length"];Ember.ArrayUtils.forEach(c.keys(),function(a){Array.prototype[a]&&d.push(a)}),d.length>0&&(c=c.without.apply(c,d)),Ember.NativeArray=c,Ember.A=function(a){return a===undefined&&(a=[]),Ember.NativeArray.apply(a)},Ember.NativeArray.activate=function(){c.apply(Array.prototype),Ember.A=function(a){return a||[]}},Ember.EXTEND_PROTOTYPES&&Ember.NativeArray.activate()}(),function(){var a=Ember.guidFor,b=Ember.ArrayUtils.indexOf,c=Ember.OrderedSet=function(){this.clear()};c.create=function(){return new c},c.prototype={clear:function(){this.presenceSet={},this.list=[]},add:function(b){var c=a(b),d=this.presenceSet,e=this.list;if(c in d)return;d[c]=!0,e.push(b)},remove:function(c){var d=a(c),e=this.presenceSet,f=this.list;delete e[d];var g=b(f,c);g>-1&&f.splice(g,1)},isEmpty:function(){return this.list.length===0},forEach:function(a,b){var c=this.list.slice();for(var d=0,e=c.length;d<e;d++)a.call(b,c[d])},toArray:function(){return this.list.slice()}};var d=Ember.Map=function(){this.keys=Ember.OrderedSet.create(),this.values={}};d.create=function(){return new d},d.prototype={get:function(b){var c=this.values,d=a(b);return c[d]},set:function(b,c){var d=this.keys,e=this.values,f=a(b);d.add(b),e[f]=c},remove:function(b){var c=this.keys,d=this.values,e=a(b),f;return d.hasOwnProperty(e)?(c.remove(b),f=d[e],delete d[e],!0):!1},has:function(b){var c=this.values,d=a(b);return c.hasOwnProperty(d)},forEach:function(b,c){var d=this.keys,e=this.values;d.forEach(function(d){var f=a(d);b.call(c,d,e[f])})}}}(),function(){}(),function(){Ember.ArrayController=Ember.ArrayProxy.extend()}(),function(){}(),function(){}(),function(){Ember.$=window.jQuery}(),function(){var a=Ember.get,b=Ember.set,c=Ember.ArrayUtils.forEach,d=Ember.ArrayUtils.indexOf,e=function(){this.seen={},this.list=[]};e.prototype={add:function(a){if(a in this.seen)return;this.seen[a]=!0,this.list.push(a)},toDOM:function(){return this.list.join(" ")}},Ember.RenderBuffer=function(a){return new Ember._RenderBuffer(a)},Ember._RenderBuffer=function(a){this.elementTag=a,this.childBuffers=[]},Ember._RenderBuffer.prototype={elementClasses:null,elementId:null,elementAttributes:null,elementTag:null,elementStyle:null,parentBuffer:null,push:function(a){return this.childBuffers.push(String(a)),this},addClass:function(a){var b=this.elementClasses=this.elementClasses||new e;return this.elementClasses.add(a),this},id:function(a){return this.elementId=a,this},attr:function(a,b){var c=this.elementAttributes=this.elementAttributes||{};return arguments.length===1?c[a]:(c[a]=b,this)},removeAttr:function(a){var b=this.elementAttributes;return b&&delete b[a],this},style:function(a,b){var c=this.elementStyle=this.elementStyle||{};return this.elementStyle[a]=b,this},newBuffer:function(a,b,c,d){var e=new Ember._RenderBuffer(a);return e.parentBuffer=b,d&&e.setProperties(d),c&&c.call(this,e),e},replaceWithBuffer:function(a){var b=this.parentBuffer;if(!b)return;var c=b.childBuffers,e=d(c,this);a?c.splice(e,1,a):c.splice(e,1)},begin:function(a){return this.newBuffer(a,this,function(a){this.childBuffers.push(a)})},prepend:function(a){return this.newBuffer(a,this,function(a){this.childBuffers.splice(0,0,a)})},replaceWith:function(a){var b=this.parentBuffer;return this.newBuffer
(a,b,function(a){this.replaceWithBuffer(a)})},insertAfter:function(b){var c=a(this,"parentBuffer");return this.newBuffer(b,c,function(a){var b=c.childBuffers,e=d(b,this);b.splice(e+1,0,a)})},end:function(){var a=this.parentBuffer;return a||this},remove:function(){this.replaceWithBuffer(null)},element:function(){return Ember.$(this.string())[0]},string:function(){var a="",b=this.elementTag,d;if(b){var e=this.elementId,f=this.elementClasses,g=this.elementAttributes,h=this.elementStyle,i="",j;d=["<"+b],e&&d.push('id="'+e+'"'),f&&d.push('class="'+f.toDOM()+'"');if(h){for(j in h)h.hasOwnProperty(j)&&(i+=j+":"+h[j]+";");d.push('style="'+i+'"')}if(g)for(j in g)g.hasOwnProperty(j)&&d.push(j+'="'+g[j]+'"');d=d.join(" ")+">"}var k=this.childBuffers;return c(k,function(b){var c=typeof b=="string";a+=c?b:b.string()}),b?d+a+"</"+b+">":a}}}(),function(){var a=Ember.get,b=Ember.set,c=Ember.String.fmt;Ember.EventDispatcher=Ember.Object.extend({rootElement:"body",setup:function(b){var c,d={touchstart:"touchStart",touchmove:"touchMove",touchend:"touchEnd",touchcancel:"touchCancel",keydown:"keyDown",keyup:"keyUp",keypress:"keyPress",mousedown:"mouseDown",mouseup:"mouseUp",contextmenu:"contextMenu",click:"click",dblclick:"doubleClick",mousemove:"mouseMove",focusin:"focusIn",focusout:"focusOut",mouseenter:"mouseEnter",mouseleave:"mouseLeave",submit:"submit",change:"change",dragstart:"dragStart",drag:"drag",dragenter:"dragEnter",dragleave:"dragLeave",dragover:"dragOver",drop:"drop",dragend:"dragEnd"};Ember.$.extend(d,b||{});var e=Ember.$(a(this,"rootElement"));e.addClass("ember-application");for(c in d)d.hasOwnProperty(c)&&this.setupHandler(e,c,d[c])},setupHandler:function(a,b,c){var d=this;a.delegate(".ember-view",b+".ember",function(a,b){var e=Ember.View.views[this.id],f=!0,g=null;return g=d._findNearestEventManager(e,c),g&&g!==b?f=d._dispatchEvent(g,a,c,e):e?f=d._bubbleEvent(e,a,c):a.stopPropagation(),f}),a.delegate("[data-ember-action]",b+".ember",function(a){var b=Ember.$(a.currentTarget).attr("data-ember-action"),d=Ember.Handlebars.ActionHelper.registeredActions[b],e=d.handler;if(d.eventName===c)return e(a)})},_findNearestEventManager:function(b,c){var d=null;while(b){d=a(b,"eventManager");if(d&&d[c])break;b=a(b,"parentView")}return d},_dispatchEvent:function(a,b,c,d){var e=!0,f=a[c];return Ember.typeOf(f)==="function"?(e=f.call(a,b,d),b.stopPropagation()):e=this._bubbleEvent(d,b,c),e},_bubbleEvent:function(a,b,c){return Ember.run(function(){return a.handleEvent(c,b)})},destroy:function(){var b=a(this,"rootElement");return Ember.$(b).undelegate(".ember").removeClass("ember-application"),this._super()}})}(),function(){var a=Ember.get,b=Ember.set;Ember.Application=Ember.Namespace.extend({rootElement:"body",eventDispatcher:null,customEvents:null,init:function(){var c,d=a(this,"rootElement");this._super(),c=Ember.EventDispatcher.create({rootElement:d}),b(this,"eventDispatcher",c);if(Ember.$.isReady)this.didBecomeReady();else{var e=this;Ember.$(document).ready(function(){e.didBecomeReady()})}},didBecomeReady:function(){var b=a(this,"eventDispatcher"),c=a(this,"customEvents");b.setup(c),this.ready()},ready:Ember.K,destroy:function(){return a(this,"eventDispatcher").destroy(),this._super()}})}(),function(){var a=Ember.run.queues;a.splice(Ember.$.inArray("actions",a)+1,0,"render")}(),function(){}(),function(){var a=Ember.get,b=Ember.set,c=Ember.addObserver,d=Ember.getPath,e=Ember.meta,f=Ember.String.fmt,g=Array.prototype.slice,h=Ember.ArrayUtils.forEach,i=Ember.computed(function(){var b=a(this,"_childViews"),c=Ember.A();return h(b,function(b){b.isVirtual?c.pushObjects(a(b,"childViews")):c.push(b)}),c}).property().cacheable();Ember.TEMPLATES={};var j={preRender:{},inBuffer:{},hasElement:{},inDOM:{},destroyed:{}};Ember.View=Ember.Object.extend(Ember.Evented,{concatenatedProperties:["classNames","classNameBindings","attributeBindings"],isView:!0,templateName:null,layoutName:null,templates:Ember.TEMPLATES,template:Ember.computed(function(b,c){if(c!==undefined)return c;var d=a(this,"templateName"),e=this.templateForName(d,"template");return e||a(this,"defaultTemplate")}).property("templateName").cacheable(),layout:Ember.computed(function(b,c){if(arguments.length===2)return c;var d=a(this,"layoutName"),e=this.templateForName(d,"layout");return e||a(this,"defaultLayout")}).property("layoutName").cacheable(),templateForName:function(b,c){if(!b)return;var d=a(this,"templates"),e=a(d,b);if(!e)throw new Ember.Error(f('%@ - Unable to find %@ "%@".',[this,c,b]));return e},templateContext:Ember.computed(function(c,d){return arguments.length===2?(b(this,"_templateContext",d),d):a(this,"_templateContext")}).cacheable(),_templateContext:Ember.computed(function(a,b){return arguments.length===2?b:this}).cacheable(),templateContextDidChange:Ember.observer(function(){this.rerender()},"templateContext"),_parentView:null,parentView:Ember.computed(function(){var b=a(this,"_parentView");return b&&b.isVirtual?a(b,"parentView"):b}).property("_parentView"),concreteView:Ember.computed(function(){return this.isVirtual?a(this,"parentView"):this}).property("_parentView"),isVisible:!0,childViews:i,_childViews:[],nearestInstanceOf:function(b){var c=a(this,"parentView");while(c){if(c instanceof b)return c;c=a(c,"parentView")}},nearestWithProperty:function(b){var c=a(this,"parentView");while(c){if(b in c)return c;c=a(c,"parentView")}},nearestChildOf:function(b){var c=a(this,"parentView");while(c){if(a(c,"parentView")instanceof b)return c;c=a(c,"parentView")}},collectionView:Ember.computed(function(){return this.nearestInstanceOf(Ember.CollectionView)}).cacheable(),itemView:Ember.computed(function(){return this.nearestChildOf(Ember.CollectionView)}).cacheable(),contentView:Ember.computed(function(){return this.nearestWithProperty("content")}).cacheable(),_parentViewDidChange:Ember.observer(function(){if(this.isDestroying)return;this.invokeRecursively(function(a){a.propertyDidChange("collectionView"),a.propertyDidChange("itemView"),a.propertyDidChange("contentView")})},"_parentView"),render:function(b){var c=a(this,"layout")||a(this,"template");if(c){var d=a(this,"_templateContext"),e=this.get("templateData"),f=this.get("controller"),g={view:this,buffer:b,isRenderData:!0};g.controller=f||e&&e.controller;var h=c(d,{data:g});h!==undefined&&b.push(h)}},invokeForState:function(a){var b=this.state,c;if(h=j[b][a])return c=g.call(arguments),c[0]=this,h.apply(this,c);var d=this,e=d.states,f;while(e){f=e[b];while(f){var h=f[a];if(h)return j[b][a]=h,c=g.call(arguments,1),c.unshift(this),h.apply(this,c);f=f.parentState}e=e.parent}},rerender:function(){return this.invokeForState("rerender")},clearRenderedChildren:function(){var b=this.lengthBeforeRender,c=this.lengthAfterRender,d=a(this,"_childViews");for(var e=c-1;e>=b;e--)d[e]&&d[e].destroy()},_applyClassNameBindings:function(){var b=a(this,"classNameBindings"),d=a(this,"classNames"),e,f,g;if(!b)return;h(b,function(a){var b,h,i=function(){f=this._classStringForProperty(a),e=this.$(),b&&(e.removeClass(b),d.removeObject(b)),f?(e.addClass(f),b=f):b=null};g=this._classStringForProperty(a),g&&(d.push(g),b=g),h=a.split(":")[0],c(this,h,i)},this)},_applyAttributeBindings:function(b){var d=a(this,"attributeBindings"),e,f,g;if(!d)return;h(d,function(d){var g=d.split(":"),h=g[0],i=g[1]||h,j=function(){f=this.$(),e=a(this,h),Ember.View.applyAttributeBindings(f,i,e)};c(this,h,j),e=a(this,h),Ember.View.applyAttributeBindings(b,i,e)},this)},_classStringForProperty:function(a){var b=a.split(":"),c=b[1];a=b[0];var d=Ember.getPath(this,a,!1);d===undefined&&Ember.isGlobalPath(a)&&(d=Ember.getPath(window,a));if(d===!0){if(c)return c;var e=a.split(".");return Ember.String.dasherize(e[e.length-1])}return d!==!1&&d!==undefined&&d!==null?d:null},element:Ember.computed(function(a,b){return b!==undefined?this.invokeForState("setElement",b):this.invokeForState("getElement")}).property("_parentView").cacheable(),$:function(a){return this.invokeForState("$",a)},mutateChildViews:function(b){var c=a(this,"_childViews"),d=a(c,"length"),e;while(--d>=0)e=c[d],b.call(this,e,d);return this},forEachChildView:function(b){var c=a(this,"_childViews");if(!c)return this;var d=a(c,"length"),e,f;for(f=0;f<d;f++)e=c[f],b.call(this,e);return this},appendTo:function(a){return this._insertElementLater(function(){this.$().appendTo(a)}),this},replaceIn:function(a){return this._insertElementLater(function(){Ember.$(a).empty(),this.$().appendTo(a)}),this},_insertElementLater:function(a){Ember.run.schedule("render",this,this.invokeForState,"insertElement",a)},append:function(){return this.appendTo(document.body)},remove:function(){this.destroyElement(),this.invokeRecursively(function(a){a.clearRenderedChildren()})},elementId:Ember.computed(function(a,b){return b!==undefined?b:Ember.guidFor(this)}).cacheable(),_elementIdDidChange:Ember.beforeObserver(function(){throw"Changing a view's elementId after creation is not allowed."},"elementId"),findElementInParentElement:function(b){var c="#"+a(this,"elementId");return Ember.$(c)[0]||Ember.$(c,b)[0]},renderBuffer:function(b){b=b||a(this,"tagName");if(b===null||b===undefined)b="div";return Ember.RenderBuffer(b)},createElement:function(){if(a(this,"element"))return this;var c=this.renderToBuffer();return b(this,"element",c.element()),this},willInsertElement:Ember.K,didInsertElement:Ember.K,willRerender:Ember.K,invokeRecursively:function(a){a.call(this,this),this.forEachChildView(function(b){b.invokeRecursively(a)})},invalidateRecursively:function(a){this.forEachChildView(function(b){b.propertyDidChange(a)})},_notifyWillInsertElement:function(a){this.invokeRecursively(function(b){a&&(b._willInsertElementAccessUnsupported=!0),b.fire("willInsertElement"),b._willInsertElementAccessUnsupported=!1})},_notifyDidInsertElement:function(){this.invokeRecursively(function(a){a.fire("didInsertElement")})},_notifyWillRerender:function(){this.invokeRecursively(function(a){a.fire("willRerender")})},destroyElement:function(){return this.invokeForState("destroyElement")},willDestroyElement:function(){},_notifyWillDestroyElement:function(){this.invokeRecursively(function(a){a.fire("willDestroyElement")})},_elementWillChange:Ember.beforeObserver(function(){this.forEachChildView(function(a){Ember.propertyWillChange(a,"element")})},"element"),_elementDidChange:Ember.observer(function(){this.forEachChildView(function(a){Ember.propertyDidChange(a,"element")})},"element"),parentViewDidChange:Ember.K,renderToBuffer:function(b,c){var d;Ember.run.sync(),c=c||"begin";if(b){var e=a(this,"tagName");if(e===null||e===undefined)e="div";d=b[c](e)}else d=this.renderBuffer();return this.buffer=d,this.transitionTo("inBuffer",!1),this.lengthBeforeRender=a(a(this,"_childViews"),"length"),this.beforeRender(d),this.render(d),this.afterRender(d),this.lengthAfterRender=a(a(this,"_childViews"),"length"),d},beforeRender:function(a){this.applyAttributesToBuffer(a)},afterRender:Ember.K,applyAttributesToBuffer:function(b){this._applyClassNameBindings(),this._applyAttributeBindings(b),h(a(this,"classNames"),function(a){b.addClass(a)}),b.id(a(this,"elementId"));var c=a(this,"ariaRole");c&&b.attr("role",c),a(this,"isVisible")===!1&&b.style("display","none")},tagName:null,ariaRole:null,classNames:["ember-view"],classNameBindings:[],attributeBindings:[],state:"preRender",init:function(){this._super(),Ember.View.views[a(this,"elementId")]=this;var c=a(this,"_childViews").slice();b(this,"_childViews",c),this.classNameBindings=Ember.A(this.classNameBindings.slice()),this.classNames=Ember.A(this.classNames.slice());var d=a(this,"viewController");d&&(d=Ember.getPath(d),d&&b(d,"view",this))},appendChild:function(a,b){return this.invokeForState("appendChild",a,b)},removeChild:function(c){if(this.isDestroying)return;b(c,"_parentView",null);var d=a(this,"_childViews");return Ember.ArrayUtils.removeObject(d,c),this.propertyDidChange("childViews"),this},removeAllChildren:function(){return this.mutateChildViews(function(a){this.removeChild(a)})},destroyAllChildren:function(){return this.mutateChildViews(function(a){a.destroy()})},removeFromParent:function(){var b=a(this,"_parentView");return this.remove(),b&&b.removeChild(this),this},willDestroy:function(){var c=a(this,"_childViews"),d=a(this,"_parentView"),e=a(this,"elementId"),f;this.removedFromDOM||this.destroyElement();if(this.viewName){var g=a(this,"parentView");g&&b(g,this.viewName,null)}d&&d.removeChild(this),this.state="destroyed",f=a(c,"length");for(var h=f-1;h>=0;h--)c[h].removedFromDOM=!0,c[h].destroy();delete Ember.View.views[a(this,"elementId")]},createChildView:function(c,d){if(Ember.View.detect(c)){d?c=c.create({_parentView:this},d):c=c.create({_parentView:this});var e=c.viewName;e&&b(a(this,"concreteView"),e,c)}else b(c,"_parentView",this);return c},becameVisible:Ember.K,becameHidden:Ember.K,_isVisibleDidChange:Ember.observer(function(){var b=a(this,"isVisible");this.$().toggle(b);if(this._isAncestorHidden())return;b?this._notifyBecameVisible():this._notifyBecameHidden()},"isVisible"),_notifyBecameVisible:function(){this.fire("becameVisible"),this.forEachChildView(function(b){var c=a(b,"isVisible");(c||c===null)&&b._notifyBecameVisible()})},_notifyBecameHidden:function(){this.fire("becameHidden"),this.forEachChildView(function(b){var c=a(b,"isVisible");(c||c===null)&&b._notifyBecameHidden()})},_isAncestorHidden:function(){var b=a(this,"parentView");while(b){if(a(b,"isVisible")===!1)return!0;b=a(b,"parentView")}return!1},clearBuffer:function(){this.invokeRecursively(function(a){this.buffer=null})},transitionTo:function(a,b){this.state=a,b!==!1&&this.forEachChildView(function(b){b.transitionTo(a)})},fire:function(a){this[a].apply(this,[].slice.call(arguments,1)),this._super.apply(this,arguments)},handleEvent:function(a,b){return this.invokeForState("handleEvent",a,b)}});var k={prepend:function(a,b){b._insertElementLater(function(){var c=a.$();c.prepend(b.$())})},after:function(a,b){b._insertElementLater(function(){var c=a.$();c.after(b.$())})},replace:function(c){var d=a(c,"element");b(c,"element",null),c._insertElementLater(function(){Ember.$(d).replaceWith(a(c,"element"))})},remove:function(c){var d=a(c,"element");b(c,"element",null),Ember.$(d).remove()},empty:function(a){a.$().empty()}};Ember.View.reopen({states:Ember.View.states,domManager:k}),Ember.View.views={},Ember.View.childViewsProperty=i,Ember.View.applyAttributeBindings=function(a,b,c){var d=Ember.typeOf(c),e=a.attr(b);(d==="string"||d==="number"&&!isNaN(c))&&c!==e?a.attr(b,c):c&&d==="boolean"?a.attr(b,b):c||a.removeAttr(b)}}(),function(){var a=Ember.get,b=Ember.set;Ember.View.states={_default:{appendChild:function(){throw"You can't use appendChild outside of the rendering process"},$:function(){return Ember.$()},getElement:function(){return null},handleEvent:function(){return!0}}},Ember.View.reopen({states:Ember.View.states})}(),function(){Ember.View.states.preRender={parentState:Ember.View.states._default,insertElement:function(a,b){a.createElement(),a._notifyWillInsertElement(!0),b.call(a),a.transitionTo("inDOM"),a._notifyDidInsertElement()},$:function(a){return a._willInsertElementAccessUnsupported&&console.error("Getting element from willInsertElement is unreliable and no longer supported."),Ember.$()},empty:Ember.K,getElement:function(a){return a._willInsertElementAccessUnsupported&&console.error("Getting element from willInsertElement is unreliable and no longer supported."),null},setElement:function(a,b){return a.beginPropertyChanges(),a.invalidateRecursively("element"),b!==null&&a.transitionTo("hasElement"),a.endPropertyChanges(),b}}}(),function(){var a=Ember.get,b=Ember.set,c=Ember.meta;Ember.View.states.inBuffer={parentState:Ember.View.states._default,$:function(a,b){return a.rerender(),Ember.$()},rerender:function(a){a._notifyWillRerender(),a.clearRenderedChildren(),a.renderToBuffer(a.buffer,"replaceWith")},appendChild:function(b,c,d){var e=b.buffer;return c=this.createChildView(c,d),a(b,"_childViews").push(c),c.renderToBuffer(e),b.propertyDidChange("childViews"),c},destroyElement:function(a){return a.clearBuffer(),a._notifyWillDestroyElement(),a.transitionTo("preRender"),a},empty:function(){throw"EWOT"},insertElement:function(){throw"You can't insert an element that has already been rendered"},setElement:function(a,b){return a.invalidateRecursively("element"),b===null?a.transitionTo("preRender"):(a.clearBuffer(),a.transitionTo("hasElement")),b}}}(),function(){var a=Ember.get,b=Ember.set,c=Ember.meta;Ember.View.states.hasElement={parentState:Ember.View.states._default,$:function(b,c){var d=a(b,"element");return c?Ember.$(c,d):Ember.$(d)},getElement:function(b){var c=a(b,"parentView");return c&&(c=a(c,"element")),c?b.findElementInParentElement(c):Ember.$("#"+a(b,"elementId"))[0]},setElement:function(a,b){if(b===null)a.invalidateRecursively("element"),a.transitionTo("preRender");else throw"You cannot set an element to a non-null value when the element is already in the DOM.";return b},rerender:function(a){return a._notifyWillRerender(),a.clearRenderedChildren(),a.domManager.replace(a),a},destroyElement:function(a){return a._notifyWillDestroyElement(),a.domManager.remove(a),a},empty:function(b){var c=a(b,"_childViews"),d,e;if(c){d=a(c,"length");for(e=0;e<d;e++)c[e]._notifyWillDestroyElement()}b.domManager.empty(b)},handleEvent:function(a,b,c){var d=a[b];return Ember.typeOf(d)==="function"?d.call(a,c):!0}},Ember.View.states.inDOM={parentState:Ember.View.states.hasElement,insertElement:function(){throw"You can't insert an element into the DOM that has already been inserted"}}}(),function(){var a="You can't call %@ on a destroyed view",b=Ember.String.fmt;Ember.View.states.destroyed={parentState:Ember.View.states._default,appendChild:function(){throw b(a,["appendChild"])},rerender:function(){throw b(a,["rerender"])},destroyElement:function(){throw b(a,["destroyElement"])},empty:function(){throw b(a,["empty"])},setElement:function(){throw b(a,["set('element', ...)"])},insertElement:Ember.K}}(),function(){}(),function(){var a=Ember.get,b=Ember.set,c=Ember.meta,d=Ember.ArrayUtils.forEach,e=Ember.computed(function(){return a(this,"_childViews")}).property("_childViews").cacheable();Ember.ContainerView=Ember.View.extend({init:function(){var c=a(this,"childViews");Ember.defineProperty(this,"childViews",e),this._super();var f=a(this,"_childViews");d(c,function(c,d){var e;"string"==typeof c?(e=a(this,c),e=this.createChildView(e),b(this,c,e)):e=this.createChildView(c),f[d]=e},this),Ember.A(f),a(this,"childViews").addArrayObserver(this,{willChange:"childViewsWillChange",didChange:"childViewsDidChange"})},render:function(a){this.forEachChildView(function(b){b.renderToBuffer(a)})},willDestroy:function(){a(this,"childViews").removeArrayObserver(this,{willChange:"childViewsWillChange",didChange:"childViewsDidChange"}),this._super()},childViewsWillChange:function(a,b,c){if(c===0)return;var d=a.slice(b,b+c);this.setParentView(d,null),this.invokeForState("childViewsWillChange",a,b,c)},childViewsDidChange:function(b,c,d,e){var f=a(b,"length");if(e===0)return;var g=b.slice(c,c+e);this.setParentView(g,this),this.invokeForState("childViewsDidChange",b,c,e)},setParentView:function(a,c){d(a,function(a){b(a,"_parentView",c)})},_scheduleInsertion:function(a,b){b?b.domManager.after(b,a):this.domManager.prepend(this,a)}}),Ember.ContainerView.states={parent:Ember.View.states,inBuffer:{childViewsDidChange:function(a,b,c,d){var e=a.buffer,f,g,h,i;c===0?(i=b[c],f=c+1,i.renderToBuffer(e,"prepend")):(i=b[c-1],f=c);for(var j=f;j<c+d;j++)g=i,i=b[j],h=g.buffer,i.renderToBuffer(h,"insertAfter")}},hasElement:{childViewsWillChange:function(a,b,c,d){for(var e=c;e<c+d;e++)b[e].remove()},childViewsDidChange:function(a,b,c,d){var e=c===0?null:b[c-1];for(var f=c;f<c+d;f++)a=b[f],this._scheduleInsertion(a,e),e=a}}},Ember.ContainerView.states.inDOM={parentState:Ember.ContainerView.states.hasElement},Ember.ContainerView.reopen({states:Ember.ContainerView.states})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.String.fmt;Ember.CollectionView=Ember.ContainerView.extend({content:null,emptyView:null,itemViewClass:Ember.View,init:function(){var a=this._super();return this._contentDidChange(),a},_contentWillChange:Ember.beforeObserver(function(){var b=this.get("content");b&&b.removeArrayObserver(this);var c=b?a(b,"length"):0;this.arrayWillChange(b,0,c)},"content"),_contentDidChange:Ember.observer(function(){var b=a(this,"content");b&&b.addArrayObserver(this);var c=b?a(b,"length"):0;this.arrayDidChange(b,0,null,c)},"content"),willDestroy:function(){var b=a(this,"content");b&&b.removeArrayObserver(this),this._super()},arrayWillChange:function(b,c,d){var e=a(this,"emptyView");e&&e instanceof Ember.View&&e.removeFromParent();var f=a(this,"childViews"),g,h,i;i=a(f,"length");var j=d===i;j&&this.invokeForState("empty");for(h=c+d-1;h>=c;h--)g=f[h],j&&(g.removedFromDOM=!0),g.destroy()},arrayDidChange:function(c,d,e,f){var g=a(this,"itemViewClass"),h=a(this,"childViews"),i=[],j,k,l,m,n;"string"==typeof g&&(g=Ember.getPath(g)),m=c?a(c,"length"):0;if(m)for(l=d;l<d+f;l++)k=c.objectAt(l),j=this.createChildView(g,{content:k,contentIndex:l}),i.push(j);else{var o=a(this,"emptyView");if(!o)return;o=this.createChildView(o),i.push(o),b(this,"emptyView",o)}h.replace(d,0,i)},createChildView:function(c,d){c=this._super(c,d);var e=a(c,"tagName"),f=e===null||e===undefined?Ember.CollectionView.CONTAINER_MAP[a(this,"tagName")]:e;return b(c,"tagName",f),c}}),Ember.CollectionView.CONTAINER_MAP={ul:"li",ol:"li",table:"tr",thead:"tr",tbody:"tr",tfoot:"tr",tr:"td",select:"option"}}(),function(){}(),function(){}(),function(){var a=Ember.get,b=Ember.set,c=Ember.getPath;Ember.State=Ember.Object.extend({isState:!0,parentState:null,start:null,name:null,path:Ember.computed(function(){var b=c(this,"parentState.path"),d=a(this,"name");return b&&(d=b+"."+d),d}).property().cacheable(),init:function(){var c=a(this,"states"),d,e;if(!c){c={};for(e in this){if(e==="constructor")continue;this.setupChild(c,e,this[e])}b(this,"states",c)}else for(e in c)this.setupChild(c,e,c[e]);b(this,"routes",{})},setupChild:function(a,c,d){if(!d)return!1;Ember.State.detect(d)?d=d.create({name:c}):d.isState&&b(d,"name",c),d.isState&&(b(d,"parentState",this),a[c]=d)},enter:Ember.K,exit:Ember.K})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.getPath,d=Ember.String.fmt;Ember.StateManager=Ember.State.extend({init:function(){this._super();var b=a(this,"initialState");!b&&c(this,"states.start")&&(b="start"),b&&this.goToState(b)},currentState:null,errorOnUnhandledEvent:!0,currentView:Ember.computed(function(){var b=a(this,"currentState"),c;while(b){if(a(b,"isViewState")){c=a(b,"view");if(c)return c}b=a(b,"parentState")}return null}).property("currentState").cacheable(),send:function(b,c){this.sendRecursively(b,a(this,"currentState"),c)},sendRecursively:function(b,e,f){var g=this.enableLogging,h=e[b];if(h)g&&console.log(d("STATEMANAGER: Sending event '%@' to state %@.",[b,a(e,"path")])),h.call(e,this,f);else{var i=a(e,"parentState");if(i)this.sendRecursively(b,i,f);else if(a(this,"errorOnUnhandledEvent"))throw new Ember.Error(this.toString()+" could not respond to event "+b+" in state "+c(this,"currentState.path")+".")}},findStatesByRoute:function(b,c){if(!c||c==="")return undefined;var d=c.split("."),e=[];for(var f=0,g=d.length;f<g;f+=1){var h=a(b,"states");if(!h)return undefined;var i=a(h,d[f]);if(i)b=i,e.push(i);else return undefined}return e},goToState:function(b){if(Ember.empty(b))return;var c=a(this,"currentState")||this,d,e,f=[],g;d=c;if(d.routes[b])f=d.routes[b].exitStates,g=d.routes[b].enterStates,d=d.routes[b].futureState;else{e=this.findStatesByRoute(c,b);while(d&&!e){f.unshift(d),d=a(d,"parentState");if(!d){e=this.findStatesByRoute(this,b);if(!e)return}e=this.findStatesByRoute(d,b)}g=e.slice(0),f=f.slice(0);if(g.length>0){d=g[g.length-1];while(g.length>0&&g[0]===f[0])g.shift(),f.shift()}c.routes[b]={exitStates:f,enterStates:g,futureState:d}}this.enterState(f,g,d)},getState:function(b){var c=a(this,b),d=a(this,"parentState");if(c)return c;if(d)return d.getState(b)},asyncEach:function(a,b,c){var d=!1,e=this;if(!a.length){c&&c.call(this);return}var f=a[0],g=a.slice(1),h={async:function(){d=!0},resume:function(){e.asyncEach(g,b,c)}};b.call(this,f,h),d||h.resume()},enterState:function(c,d,e){var f=this.enableLogging,g=this;c=c.slice(0).reverse(),this.asyncEach(c,function(a,b){a.exit(g,b)},function(){this.asyncEach(d,function(b,c){f&&console.log("STATEMANAGER: Entering "+a(b,"path")),b.enter(g,c)},function(){var c=e,d,h;h=a(c,"initialState"),h||(h="start");while(c=a(a(c,"states"),h))d=c,f&&console.log("STATEMANAGER: Entering "+a(c,"path")),c.enter(g),h=a(c,"initialState"),h||(h="start");b(this,"currentState",d||e)})})}})}(),function(){var a=Ember.get,b=Ember.set;Ember.ViewState=Ember.State.extend({isViewState:!0,enter:function(c){var d=a(this,"view"),e,f;d&&(Ember.View.detect(d)&&(d=d.create(),b(this,"view",d)),e=c.get("rootView"),e?(f=a(e,"childViews"),f.pushObject(d)):(e=c.get("rootElement")||"body",d.appendTo(e)))},exit:function(b){var c=a(this,"view");c&&(a(c,"parentView")?c.removeFromParent():c.remove())}})}(),function(){}(),function(){(function(a){var b=function(){},c=0,d=a.document,e="createRange"in d&&typeof Range!="undefined"&&Range.prototype.createContextualFragment,f=function(){var a=d.createElement("div");return a.innerHTML="<div></div>",a.firstChild.innerHTML="<script></script>",a.firstChild.innerHTML===""}(),g=function(a){var d;this instanceof g?d=this:d=new b,d.innerHTML=a;var e="metamorph-"+c++;return d.start=e+"-start",d.end=e+"-end",d};b.prototype=g.prototype;var h,i,j,k,l,m,n,o,p;k=function(){return this.startTag()+this.innerHTML+this.endTag()},o=function(){return"<script id='"+this.start+"' type='text/x-placeholder'></script>"},p=function(){return"<script id='"+this.end+"' type='text/x-placeholder'></script>"};if(e)h=function(a,b){var c=d.createRange(),e=d.getElementById(a.start),f=d.getElementById(a.end);return b?(c.setStartBefore(e),c.setEndAfter(f)):(c.setStartAfter(e),c.setEndBefore(f)),c},i=function(a,b){var c=h(this,b);c.deleteContents();var d=c.createContextualFragment(a);c.insertNode(d)},j=function(){var a=h(this,!0);a.deleteContents()},l=function(a){var b=d.createRange();b.setStart(a),b.collapse(!1);var c=b.createContextualFragment(this.outerHTML());a.appendChild(c)},m=function(a){var b=d.createRange(),c=d.getElementById(this.end);b.setStartAfter(c),b.setEndAfter(c);var e=b.createContextualFragment(a);b.insertNode(e)},n=function(a){var b=d.createRange(),c=d.getElementById(this.start);b.setStartAfter(c),b.setEndAfter(c);var e=b.createContextualFragment(a);b.insertNode(e)};else{var q={select:[1,"<select multiple='multiple'>","</select>"],fieldset:[1,"<fieldset>","</fieldset>"],table:[1,"<table>","</table>"],tbody:[2,"<table><tbody>","</tbody></table>"],tr:[3,"<table><tbody><tr>","</tr></tbody></table>"],colgroup:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],map:[1,"<map>","</map>"],_default:[0,"",""]},r=function(a,b){var c=q[a.tagName.toLowerCase()]||q._default,e=c[0],g=c[1],h=c[2];f&&(b="&shy;"+b);var i=d.createElement("div");i.innerHTML=g+b+h;for(var j=0;j<=e;j++)i=i.firstChild;if(f){var k=i;while(k.nodeType===1&&!k.nodeName&&k.childNodes.length===1)k=k.firstChild;k.nodeType===3&&k.nodeValue.charAt(0)==="­"&&(k.nodeValue=k.nodeValue.slice(1))}return i},s=function(a){while(a.parentNode.tagName==="")a=a.parentNode;return a},t=function(a,b){a.parentNode!==b.parentNode&&b.parentNode.insertBefore(a,b.parentNode.firstChild)};i=function(a,b){var c=s(d.getElementById(this.start)),e=d.getElementById(this.end),f=e.parentNode,g,h,i;t(c,e),g=c.nextSibling;while(g){h=g.nextSibling,i=g===e;if(i)if(b)e=g.nextSibling;else break;g.parentNode.removeChild(g);if(i)break;g=h}g=r(c.parentNode,a);while(g)h=g.nextSibling,f.insertBefore(g,e),g=h},j=function(){var a=s(d.getElementById(this.start)),b=d.getElementById(this.end);this.html(""),a.parentNode.removeChild(a),b.parentNode.removeChild(b)},l=function(a){var b=r(a,this.outerHTML());while(b)nextSibling=b.nextSibling,a.appendChild(b),b=nextSibling},m=function(a){var b=d.getElementById(this.end),c=b.nextSibling,e=b.parentNode,f,g;g=r(e,a);while(g)f=g.nextSibling,e.insertBefore(g,c),g=f},n=function(a){var b=d.getElementById(this.start),c=b.parentNode,e,f;f=r(c,a);var g=b.nextSibling;while(f)e=f.nextSibling,c.insertBefore(f,g),f=e}}g.prototype.html=function(a){this.checkRemoved();if(a===undefined)return this.innerHTML;i.call(this,a),this.innerHTML=a},g.prototype.replaceWith=function(a){this.checkRemoved(),i.call(this,a,!0)},g.prototype.remove=j,g.prototype.outerHTML=k,g.prototype.appendTo=l,g.prototype.after=m,g.prototype.prepend=n,g.prototype.startTag=o,g.prototype.endTag=p,g.prototype.isRemoved=function(){var a=d.getElementById(this.start),b=d.getElementById(this.end);return!a||!b},g.prototype.checkRemoved=function(){if(this.isRemoved())throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.")},a.Metamorph=g})(this)}(),function(){Ember.Handlebars=Ember.create(Handlebars),Ember.Handlebars.helpers=Ember.create(Handlebars.helpers),Ember.Handlebars.Compiler=function(){},Ember.Handlebars.Compiler.prototype=Ember.create(Handlebars.Compiler.prototype),Ember.Handlebars.Compiler.prototype.compiler=Ember.Handlebars.Compiler,Ember.Handlebars.JavaScriptCompiler=function(){},Ember.Handlebars.JavaScriptCompiler.prototype=Ember.create(Handlebars.JavaScriptCompiler.prototype),Ember.Handlebars.JavaScriptCompiler.prototype.compiler=Ember.Handlebars.JavaScriptCompiler,Ember.Handlebars.JavaScriptCompiler.prototype.namespace="Ember.Handlebars",Ember.Handlebars.JavaScriptCompiler.prototype.initializeBuffer=function(){return"''"},Ember.Handlebars.JavaScriptCompiler.prototype.appendToBuffer=function(a){return"data.buffer.push("+a+");"},Ember.Handlebars.Compiler.prototype.mustache=function(a){if(a.params.length||a.hash)return Handlebars.Compiler.prototype.mustache.call(this,a);var b=new Handlebars.AST.IdNode(["_triageMustache"]);return a.escaped&&(a.hash=a.hash||new Handlebars.AST.HashNode([]),a.hash.pairs.push(["escaped",new Handlebars.AST.StringNode("true")])),a=new Handlebars.AST.MustacheNode([b].concat([a.id]),a.hash,!a.escaped),Handlebars.Compiler.prototype.mustache.call(this,a)},Ember.Handlebars.precompile=function(a){var b=Handlebars.parse(a),c={data:!0,stringParams:!0},d=(new Ember.Handlebars.Compiler).compile(b,c);return(new Ember.Handlebars.JavaScriptCompiler).compile(d,c,undefined,!0)},Ember.Handlebars.compile=function(a){var b=Handlebars.parse(a),c={data:!0,stringParams:!0},d=(new Ember.Handlebars.Compiler).compile(b,c),e=(new Ember.Handlebars.JavaScriptCompiler).compile(d,c,undefined,!0);return Handlebars.template(e)},Ember.Handlebars.getPath=function(a,b){var c=Ember.getPath(a,b,!1);return c===undefined&&a!==window&&Ember.isGlobalPath(b)&&(c=Ember.getPath(window,b)),c},Ember.Handlebars.registerHelper("helperMissing",function(a,b){var c,d="";throw c="%@ Handlebars error: Could not find property '%@' on object %@.",b.data&&(d=b.data.view),new Ember.Error(Ember.String.fmt(c,[d,a,this]))})}(),function(){var a=Ember.set,b=Ember.get,c=Ember.getPath,d={remove:function(a){var b=a.morph;if(b.isRemoved())return;b.remove()},prepend:function(a,b){b._insertElementLater(function(){var c=a.morph;c.prepend(b.outerHTML),b.outerHTML=null})},after:function(a,b){b._insertElementLater(function(){var c=a.morph;c.after(b.outerHTML),b.outerHTML=null})},replace:function(a){var c=a.morph;a.transitionTo("preRender"),a.clearRenderedChildren();var d=a.renderToBuffer();Ember.run.schedule("render",this,function(){if(b(a,"isDestroyed"))return;a.invalidateRecursively("element"),a._notifyWillInsertElement(),c.replaceWith(d.string()),a.transitionTo("inDOM"),a._notifyDidInsertElement()})},empty:function(a){a.morph.html("")}};Ember.Metamorph=Ember.Mixin.create({isVirtual:!0,tagName:"",init:function(){this._super(),this.morph=Metamorph()},beforeRender:function(a){a.push(this.morph.startTag())},afterRender:function(a){a.push(this.morph.endTag())},createElement:function(){var a=this.renderToBuffer();this.outerHTML=a.string(),this.clearBuffer()},domManager:d})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.Handlebars.getPath;Ember._BindableSpanView=Ember.View.extend(Ember.Metamorph,{shouldDisplayFunc:null,preserveContext:!1,displayTemplate:null,inverseTemplate:null,property:null,normalizedValue:Ember.computed(function(){var b=a(this,"property"),d=a(this,"previousContext"),e=a(this,"valueNormalizerFunc"),f;return b===""?f=d:f=c(d,b),e?e(f):f}).property("property","previousContext","valueNormalizerFunc"),rerenderIfNeeded:function(){!a(this,"isDestroyed")&&a(this,"normalizedValue")!==this._lastNormalizedValue&&this.rerender()},render:function(c){var d=a(this,"isEscaped"
),e=a(this,"shouldDisplayFunc"),f=a(this,"preserveContext"),g=a(this,"previousContext"),h=a(this,"inverseTemplate"),i=a(this,"displayTemplate"),j=a(this,"normalizedValue");this._lastNormalizedValue=j;if(e(j)){b(this,"template",i);if(f)b(this,"_templateContext",g);else if(i)b(this,"_templateContext",j);else{j===null||j===undefined?j="":j=String(j),d&&(j=Handlebars.Utils.escapeExpression(j)),c.push(j);return}}else h?(b(this,"template",h),f?b(this,"_templateContext",g):b(this,"_templateContext",j)):b(this,"template",function(){return""});return this._super(c)}})}(),function(){var a=Ember.get,b=Ember.Handlebars.getPath,c=Ember.set,d=Ember.String.fmt,e=Ember.ArrayUtils.forEach,f=Ember.Handlebars,g=f.helpers;(function(){var c=function(a,c,d,e,f){var g=c.data,h=c.fn,i=c.inverse,j=g.view,k=this;if("object"==typeof this){var l=j.createChildView(Ember._BindableSpanView,{preserveContext:d,shouldDisplayFunc:e,valueNormalizerFunc:f,displayTemplate:h,inverseTemplate:i,property:a,previousContext:k,isEscaped:c.hash.escaped});j.appendChild(l);var m=function(){Ember.run.once(l,"rerenderIfNeeded")};a!==""&&Ember.addObserver(k,a,m)}else g.buffer.push(b(this,a))};f.registerHelper("_triageMustache",function(a,b){return g[a]?g[a].call(this,b):g.bind.apply(this,arguments)}),f.registerHelper("bind",function(a,b){var d=b.contexts&&b.contexts[0]||this;return c.call(d,a,b,!1,function(a){return!Ember.none(a)})}),f.registerHelper("boundIf",function(b,d){var e=d.contexts&&d.contexts[0]||this,f=function(b){return Ember.typeOf(b)==="array"?a(b,"length")!==0:!!b};return c.call(e,b,d,!0,f,f)})})(),f.registerHelper("with",function(a,b){return g.bind.call(b.contexts[0],a,b)}),f.registerHelper("if",function(a,b){return g.boundIf.call(b.contexts[0],a,b)}),f.registerHelper("unless",function(a,b){var c=b.fn,d=b.inverse;return b.fn=d,b.inverse=c,g.boundIf.call(b.contexts[0],a,b)}),f.registerHelper("bindAttr",function(a){var c=a.hash,d=a.data.view,g=[],h=this,i=++Ember.$.uuid,j=c["class"];if(j!==null&&j!==undefined){var k=f.bindClasses(this,j,d,i);g.push('class="'+k.join(" ")+'"'),delete c["class"]}var l=Ember.keys(c);return e(l,function(a){var e=c[a],f=e==="this"?h:b(h,e),j=Ember.typeOf(f),k,l;k=function(){var c=b(h,e),f=d.$("[data-bindattr-"+i+"='"+i+"']");if(f.length===0){Ember.removeObserver(h,e,l);return}Ember.View.applyAttributeBindings(f,a,c)},l=function(){Ember.run.once(k)},e!=="this"&&Ember.addObserver(h,e,l),j==="string"||j==="number"&&!isNaN(f)?g.push(a+'="'+f+'"'):f&&j==="boolean"&&g.push(a+'="'+a+'"')},this),g.push("data-bindattr-"+i+'="'+i+'"'),new f.SafeString(g.join(" "))}),f.bindClasses=function(a,c,d,f){var g=[],h,i,j,k=function(c){var d=c.split(":"),e=d[1];c=d[0];var f=c!==""?b(a,c):!0;if(f===!0){if(e)return e;var g=c.split(".");return Ember.String.dasherize(g[g.length-1])}return f!==!1&&f!==undefined&&f!==null?f:null};return e(c.split(" "),function(b){var c,e,l;e=function(){h=k(b),j=f?d.$("[data-bindattr-"+f+"='"+f+"']"):d.$(),j.length===0?Ember.removeObserver(a,b,l):(c&&j.removeClass(c),h?(j.addClass(h),c=h):c=null)},l=function(){Ember.run.once(e)};var m=b.split(":")[0];m!==""&&Ember.addObserver(a,m,l),i=k(b),i&&(g.push(i),c=i)}),g}}(),function(){var a=Ember.get,b=Ember.set,c=Ember.ArrayUtils.indexOf,d=/^parentView\./;Ember.Handlebars.ViewHelper=Ember.Object.create({viewClassFromHTMLOptions:function(a,b,c){var d={},e=b["class"],f=!1;b.id&&(d.elementId=b.id,f=!0),e&&(e=e.split(" "),d.classNames=e,f=!0),b.classBinding&&(d.classNameBindings=b.classBinding.split(" "),f=!0),b.classNameBindings&&(d.classNameBindings=b.classNameBindings.split(" "),f=!0),b.attributeBindings&&(d.attributeBindings=null,f=!0),f&&(b=Ember.$.extend({},b),delete b.id,delete b["class"],delete b.classBinding);var g;for(var h in b){if(!b.hasOwnProperty(h))continue;Ember.IS_BINDING.test(h)&&(g=b[h],Ember.isGlobalPath(g)||(g==="this"?b[h]="bindingContext":b[h]="bindingContext."+g))}return d.bindingContext=c,a.extend(b,d)},helper:function(a,b,c){var d=c.inverse,e=c.data,f=e.view,g=c.fn,h=c.hash,i;"string"==typeof b?i=Ember.Handlebars.getPath(a,b):i=b,i=this.viewClassFromHTMLOptions(i,h,a);var j=e.view,k={};g&&(k.template=g),j.appendChild(i,k)}}),Ember.Handlebars.registerHelper("view",function(a,b){return a&&a.data&&a.data.isRenderData&&(b=a,a="Ember.View"),Ember.Handlebars.ViewHelper.helper(this,a,b)})}(),function(){var a=Ember.get,b=Ember.Handlebars.getPath,c=Ember.String.fmt;Ember.Handlebars.registerHelper("collection",function(c,d){c&&c.data&&c.data.isRenderData&&(d=c,c=undefined);var e=d.fn,f=d.data,g=d.inverse,h;h=c?b(this,c):Ember.CollectionView;var i=d.hash,j={},k,l,m=i.itemViewClass,n=h.proto();delete i.itemViewClass,l=m?b(n,m):n.itemViewClass;for(var o in i)i.hasOwnProperty(o)&&(k=o.match(/^item(.)(.*)$/),k&&(j[k[1].toLowerCase()+k[2]]=i[o],delete i[o]));var p=i.tagName||n.tagName;e&&(j.template=e,delete d.fn);if(g&&g!==Handlebars.VM.noop){var q=Ember.View;i.emptyViewClass&&(q=Ember.View.detect(i.emptyViewClass)?i.emptyViewClass:b(this,i.emptyViewClass)),i.emptyView=q.extend({template:g,tagName:j.tagName})}return i.preserveContext&&(j._templateContext=Ember.computed(function(){return a(this,"content")}).property("content"),delete i.preserveContext),i.itemViewClass=Ember.Handlebars.ViewHelper.viewClassFromHTMLOptions(l,j,this),Ember.Handlebars.helpers.view.call(this,h,d)})}(),function(){var a=Ember.Handlebars.getPath;Ember.Handlebars.registerHelper("unbound",function(b,c){var d=c.contexts&&c.contexts[0]||this;return a(d,b)})}(),function(){var a=Ember.getPath;Ember.Handlebars.registerHelper("log",function(b,c){var d=c.contexts&&c.contexts[0]||this;Ember.Logger.log(a(d,b))}),Ember.Handlebars.registerHelper("debugger",function(){debugger})}(),function(){Ember.Handlebars.EachView=Ember.CollectionView.extend(Ember.Metamorph,{itemViewClass:Ember.View.extend(Ember.Metamorph)}),Ember.Handlebars.registerHelper("each",function(a,b){return b.hash.contentBinding=a,b.hash.preserveContext=!0,b.hash.itemTagName="",b.hash.emptyViewClass=Ember.View.extend(Ember.Metamorph),Ember.Handlebars.helpers.collection.call(this,"Ember.Handlebars.EachView",b)})}(),function(){Ember.Handlebars.registerHelper("template",function(a,b){var c=Ember.TEMPLATES[a];Ember.TEMPLATES[a](this,{data:b.data})})}(),function(){var a=Ember.Handlebars,b=Ember.Handlebars.getPath,c=a.ActionHelper={registeredActions:{}};c.registerAction=function(a,b,d,e,f){var g=(++Ember.$.uuid).toString();return c.registeredActions[g]={eventName:b,handler:function(b){return b.view=e,b.context=f,d.isState&&typeof d.send=="function"?d.send(a,b):d[a].call(d,b)}},e.on("willRerender",function(){delete c.registeredActions[g]}),g},a.registerHelper("action",function(d,e){var f=e.hash||{},g=f.on||"click",h=e.data.view,i,j;h.isVirtual&&(h=h.get("parentView")),i=f.target?b(this,f.target):h,j=e.contexts[0];var k=c.registerAction(d,g,i,h,j);return new a.SafeString('data-ember-action="'+k+'"')})}(),function(){var a=Ember.get,b=Ember.set;Ember.Handlebars.registerHelper("yield",function(b){var c=b.data.view,d;while(c&&!a(c,"layout"))c=a(c,"parentView");d=a(c,"template"),d(this,b)})}(),function(){}(),function(){}(),function(){var a=Ember.set,b=Ember.get;Ember.Checkbox=Ember.View.extend({title:null,value:!1,disabled:!1,classNames:["ember-checkbox"],defaultTemplate:Ember.Handlebars.compile('<label><input type="checkbox" {{bindAttr checked="value" disabled="disabled"}}>{{title}}</label>'),change:function(){Ember.run.once(this,this._updateElementValue)},_updateElementValue:function(){var b=this.$("input:checkbox");a(this,"value",b.prop("checked"))}})}(),function(){var a=Ember.get,b=Ember.set;Ember.TextSupport=Ember.Mixin.create({value:"",attributeBindings:["placeholder","disabled","maxlength"],placeholder:null,disabled:!1,maxlength:null,insertNewline:Ember.K,cancel:Ember.K,focusOut:function(a){this._elementValueDidChange()},change:function(a){this._elementValueDidChange()},keyUp:function(a){this.interpretKeyEvents(a)},interpretKeyEvents:function(a){var b=Ember.TextSupport.KEY_EVENTS,c=b[a.keyCode];this._elementValueDidChange();if(c)return this[c](a)},_elementValueDidChange:function(){b(this,"value",this.$().val())}}),Ember.TextSupport.KEY_EVENTS={13:"insertNewline",27:"cancel"}}(),function(){var a=Ember.get,b=Ember.set;Ember.TextField=Ember.View.extend(Ember.TextSupport,{classNames:["ember-text-field"],tagName:"input",attributeBindings:["type","value","size"],type:"text",size:null})}(),function(){var a=Ember.get,b=Ember.set;Ember.Button=Ember.View.extend(Ember.TargetActionSupport,{classNames:["ember-button"],classNameBindings:["isActive"],tagName:"button",propagateEvents:!1,attributeBindings:["type","disabled","href"],type:Ember.computed(function(a,b){var c=this.get("tagName");b!==undefined&&(this._type=b);if(this._type!==undefined)return this._type;if(c==="input"||c==="button")return"button"}).property("tagName").cacheable(),disabled:!1,href:Ember.computed(function(){return this.get("tagName")==="a"?"#":null}).property("tagName").cacheable(),mouseDown:function(){return a(this,"disabled")||(b(this,"isActive",!0),this._mouseDown=!0,this._mouseEntered=!0),a(this,"propagateEvents")},mouseLeave:function(){this._mouseDown&&(b(this,"isActive",!1),this._mouseEntered=!1)},mouseEnter:function(){this._mouseDown&&(b(this,"isActive",!0),this._mouseEntered=!0)},mouseUp:function(c){return a(this,"isActive")&&(this.triggerAction(),b(this,"isActive",!1)),this._mouseDown=!1,this._mouseEntered=!1,a(this,"propagateEvents")},keyDown:function(a){(a.keyCode===13||a.keyCode===32)&&this.mouseDown()},keyUp:function(a){(a.keyCode===13||a.keyCode===32)&&this.mouseUp()},touchStart:function(a){return this.mouseDown(a)},touchEnd:function(a){return this.mouseUp(a)}})}(),function(){var a=Ember.get,b=Ember.set;Ember.TextArea=Ember.View.extend(Ember.TextSupport,{classNames:["ember-text-area"],tagName:"textarea",attributeBindings:["rows","cols"],rows:null,cols:null,didInsertElement:function(){this._updateElementValue()},_updateElementValue:Ember.observer(function(){this.$().val(a(this,"value"))},"value")})}(),function(){Ember.TabContainerView=Ember.View.extend()}(),function(){var a=Ember.get,b=Ember.getPath;Ember.TabPaneView=Ember.View.extend({tabsContainer:Ember.computed(function(){return this.nearestInstanceOf(Ember.TabContainerView)}).property(),isVisible:Ember.computed(function(){return a(this,"viewName")===b(this,"tabsContainer.currentView")}).property("tabsContainer.currentView")})}(),function(){var a=Ember.get,b=Ember.setPath;Ember.TabView=Ember.View.extend({tabsContainer:Ember.computed(function(){return this.nearestInstanceOf(Ember.TabContainerView)}).property(),mouseUp:function(){b(this,"tabsContainer.currentView",a(this,"value"))}})}(),function(){}(),function(){var a=Ember.set,b=Ember.get,c=Ember.getPath,d=Ember.ArrayUtils.indexOf,e=Ember.ArrayUtils.indexesOf;Ember.Select=Ember.View.extend({tagName:"select",template:Ember.Handlebars.compile('{{#if prompt}}<option>{{prompt}}</option>{{/if}}{{#each content}}{{view Ember.SelectOption contentBinding="this"}}{{/each}}'),attributeBindings:["multiple"],multiple:!1,content:null,selection:null,prompt:null,optionLabelPath:"content",optionValuePath:"content",didInsertElement:function(){var a=b(this,"selection");a&&this.selectionDidChange(),this.change()},change:function(){b(this,"multiple")?this._changeMultiple():this._changeSingle()},selectionDidChange:Ember.observer(function(){var c=b(this,"selection"),d=Ember.isArray(c);if(b(this,"multiple")){if(!d){a(this,"selection",Ember.A([c]));return}this._selectionDidChangeMultiple()}else this._selectionDidChangeSingle()},"selection"),_changeSingle:function(){var c=this.$()[0].selectedIndex,d=b(this,"content"),e=b(this,"prompt");if(!d)return;if(e&&c===0){a(this,"selection",null);return}e&&(c-=1),a(this,"selection",d.objectAt(c))},_changeMultiple:function(){var c=this.$("option:selected"),d=b(this,"prompt"),e=d?1:0,f=b(this,"content");if(!f)return;if(c){var g=c.map(function(){return this.index-e});a(this,"selection",f.objectsAt(g))}},_selectionDidChangeSingle:function(){var a=this.$()[0],c=b(this,"content"),e=b(this,"selection"),f=d(c,e),g=b(this,"prompt");g&&(f+=1),a&&(a.selectedIndex=f)},_selectionDidChangeMultiple:function(){var a=b(this,"content"),c=b(this,"selection"),f=e(a,c),g=b(this,"prompt"),h=g?1:0,i=this.$("option");i&&i.each(function(){this.selected=d(f,this.index+h)>-1})}}),Ember.SelectOption=Ember.View.extend({tagName:"option",template:Ember.Handlebars.compile("{{label}}"),attributeBindings:["value","selected"],init:function(){this.labelPathDidChange(),this.valuePathDidChange(),this._super()},selected:Ember.computed(function(){var a=b(this,"content"),e=c(this,"parentView.selection");return c(this,"parentView.multiple")?e&&d(e,a)>-1:a==e}).property("content","parentView.selection"),labelPathDidChange:Ember.observer(function(){var a=c(this,"parentView.optionLabelPath");if(!a)return;Ember.defineProperty(this,"label",Ember.computed(function(){return c(this,a)}).property(a).cacheable())},"parentView.optionLabelPath"),valuePathDidChange:Ember.observer(function(){var a=c(this,"parentView.optionValuePath");if(!a)return;Ember.defineProperty(this,"value",Ember.computed(function(){return c(this,a)}).property(a).cacheable())},"parentView.optionValuePath")})}(),function(){}(),function(){Ember.Handlebars.bootstrap=function(a){var b='script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';Ember.ENV.LEGACY_HANDLEBARS_TAGS&&(b+=', script[type="text/html"]'),Ember.$(b,a).each(function(){var a=Ember.$(this),b=a.attr("type");if(b==="text/html"&&!Ember.ENV.LEGACY_HANDLEBARS_TAGS)return;var c=a.attr("type")==="text/x-raw-handlebars"?Ember.$.proxy(Handlebars.compile,Handlebars):Ember.$.proxy(Ember.Handlebars.compile,Ember.Handlebars),d=a.attr("data-element-id"),e=a.attr("data-template-name")||a.attr("id"),f=c(a.html()),g,h,i;if(e)Ember.TEMPLATES[e]=f,a.remove();else{if(a.parents("head").length!==0)throw new Ember.Error("Template found in <head> without a name specified. Please provide a data-template-name attribute.\n"+a.html());h=a.attr("data-view"),g=h?Ember.getPath(h):Ember.View,i=a.attr("data-tag-name"),g=g.create({elementId:d,template:f,tagName:i?i:undefined}),g._insertElementLater(function(){a.replaceWith(this.$()),a=null})}})},Ember.$(document).ready(function(){Ember.Handlebars.bootstrap(Ember.$(document))})}(),function(){}()
;
/*
 RequireJS 1.0.8 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/

var requirejs,require,define;
(function(r){function K(a){return O.call(a)==="[object Function]"}function G(a){return O.call(a)==="[object Array]"}function $(a,c,l){for(var j in c)if(!(j in L)&&(!(j in a)||l))a[j]=c[j];return d}function P(a,c,d){a=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+a);if(d)a.originalError=d;return a}function aa(a,c,d){var j,k,t;for(j=0;t=c[j];j++){t=typeof t==="string"?{name:t}:t;k=t.location;if(d&&(!k||k.indexOf("/")!==0&&k.indexOf(":")===-1))k=d+"/"+(k||t.name);a[t.name]={name:t.name,location:k||
t.name,main:(t.main||"main").replace(fa,"").replace(ba,"")}}}function V(a,c){a.holdReady?a.holdReady(c):c?a.readyWait+=1:a.ready(!0)}function ga(a){function c(b,f){var g,m;if(b&&b.charAt(0)===".")if(f){q.pkgs[f]?f=[f]:(f=f.split("/"),f=f.slice(0,f.length-1));g=b=f.concat(b.split("/"));var a;for(m=0;a=g[m];m++)if(a===".")g.splice(m,1),m-=1;else if(a==="..")if(m===1&&(g[2]===".."||g[0]===".."))break;else m>0&&(g.splice(m-1,2),m-=2);m=q.pkgs[g=b[0]];b=b.join("/");m&&b===g+"/"+m.main&&(b=g)}else b.indexOf("./")===
0&&(b=b.substring(2));return b}function l(b,f){var g=b?b.indexOf("!"):-1,m=null,a=f?f.name:null,h=b,e,d;g!==-1&&(m=b.substring(0,g),b=b.substring(g+1,b.length));m&&(m=c(m,a));b&&(m?e=(g=n[m])&&g.normalize?g.normalize(b,function(b){return c(b,a)}):c(b,a):(e=c(b,a),d=G[e],d||(d=i.nameToUrl(b,null,f),G[e]=d)));return{prefix:m,name:e,parentMap:f,url:d,originalName:h,fullName:m?m+"!"+(e||""):e}}function j(){var b=!0,f=q.priorityWait,g,a;if(f){for(a=0;g=f[a];a++)if(!s[g]){b=!1;break}b&&delete q.priorityWait}return b}
function k(b,f,g){return function(){var a=ha.call(arguments,0),c;if(g&&K(c=a[a.length-1]))c.__requireJsBuild=!0;a.push(f);return b.apply(null,a)}}function t(b,f,g){f=k(g||i.require,b,f);$(f,{nameToUrl:k(i.nameToUrl,b),toUrl:k(i.toUrl,b),defined:k(i.requireDefined,b),specified:k(i.requireSpecified,b),isBrowser:d.isBrowser});return f}function p(b){var f,g,a,c=b.callback,h=b.map,e=h.fullName,ca=b.deps;a=b.listeners;var j=q.requireExecCb||d.execCb;if(c&&K(c)){if(q.catchError.define)try{g=j(e,b.callback,
ca,n[e])}catch(k){f=k}else g=j(e,b.callback,ca,n[e]);if(e)(c=b.cjsModule)&&c.exports!==r&&c.exports!==n[e]?g=n[e]=b.cjsModule.exports:g===r&&b.usingExports?g=n[e]:(n[e]=g,H[e]&&(T[e]=!0))}else e&&(g=n[e]=c,H[e]&&(T[e]=!0));if(x[b.id])delete x[b.id],b.isDone=!0,i.waitCount-=1,i.waitCount===0&&(J=[]);delete M[e];if(d.onResourceLoad&&!b.placeholder)d.onResourceLoad(i,h,b.depArray);if(f)return g=(e?l(e).url:"")||f.fileName||f.sourceURL,a=f.moduleTree,f=P("defineerror",'Error evaluating module "'+e+'" at location "'+
g+'":\n'+f+"\nfileName:"+g+"\nlineNumber: "+(f.lineNumber||f.line),f),f.moduleName=e,f.moduleTree=a,d.onError(f);for(f=0;c=a[f];f++)c(g);return r}function u(b,f){return function(g){b.depDone[f]||(b.depDone[f]=!0,b.deps[f]=g,b.depCount-=1,b.depCount||p(b))}}function o(b,f){var g=f.map,a=g.fullName,c=g.name,h=N[b]||(N[b]=n[b]),e;if(!f.loading)f.loading=!0,e=function(b){f.callback=function(){return b};p(f);s[f.id]=!0;A()},e.fromText=function(b,f){var g=Q;s[b]=!1;i.scriptCount+=1;i.fake[b]=!0;g&&(Q=!1);
d.exec(f);g&&(Q=!0);i.completeLoad(b)},a in n?e(n[a]):h.load(c,t(g.parentMap,!0,function(b,a){var c=[],e,m;for(e=0;m=b[e];e++)m=l(m,g.parentMap),b[e]=m.fullName,m.prefix||c.push(b[e]);f.moduleDeps=(f.moduleDeps||[]).concat(c);return i.require(b,a)}),e,q)}function y(b){x[b.id]||(x[b.id]=b,J.push(b),i.waitCount+=1)}function D(b){this.listeners.push(b)}function v(b,f){var g=b.fullName,a=b.prefix,c=a?N[a]||(N[a]=n[a]):null,h,e;g&&(h=M[g]);if(!h&&(e=!0,h={id:(a&&!c?O++ +"__p@:":"")+(g||"__r@"+O++),map:b,
depCount:0,depDone:[],depCallbacks:[],deps:[],listeners:[],add:D},B[h.id]=!0,g&&(!a||N[a])))M[g]=h;a&&!c?(g=l(a),a in n&&!n[a]&&(delete n[a],delete R[g.url]),a=v(g,!0),a.add(function(){var f=l(b.originalName,b.parentMap),f=v(f,!0);h.placeholder=!0;f.add(function(b){h.callback=function(){return b};p(h)})})):e&&f&&(s[h.id]=!1,i.paused.push(h),y(h));return h}function C(b,f,a,c){var b=l(b,c),d=b.name,h=b.fullName,e=v(b),j=e.id,k=e.deps,o;if(h){if(h in n||s[j]===!0||h==="jquery"&&q.jQuery&&q.jQuery!==
a().fn.jquery)return;B[j]=!0;s[j]=!0;h==="jquery"&&a&&W(a())}e.depArray=f;e.callback=a;for(a=0;a<f.length;a++)if(j=f[a])j=l(j,d?b:c),o=j.fullName,f[a]=o,o==="require"?k[a]=t(b):o==="exports"?(k[a]=n[h]={},e.usingExports=!0):o==="module"?e.cjsModule=k[a]={id:d,uri:d?i.nameToUrl(d,null,c):r,exports:n[h]}:o in n&&!(o in x)&&(!(h in H)||h in H&&T[o])?k[a]=n[o]:(h in H&&(H[o]=!0,delete n[o],R[j.url]=!1),e.depCount+=1,e.depCallbacks[a]=u(e,a),v(j,!0).add(e.depCallbacks[a]));e.depCount?y(e):p(e)}function w(b){C.apply(null,
b)}function F(b,f){var a=b.map.fullName,c=b.depArray,d=!0,h,e,i,l;if(b.isDone||!a||!s[a])return l;if(f[a])return b;f[a]=!0;if(c){for(h=0;h<c.length;h++){e=c[h];if(!s[e]&&!ia[e]){d=!1;break}if((i=x[e])&&!i.isDone&&s[e])if(l=F(i,f))break}d||(l=r,delete f[a])}return l}function z(b,a){var g=b.map.fullName,c=b.depArray,d,h,e,i;if(b.isDone||!g||!s[g])return r;if(g){if(a[g])return n[g];a[g]=!0}if(c)for(d=0;d<c.length;d++)if(h=c[d])if((e=l(h).prefix)&&(i=x[e])&&z(i,a),(e=x[h])&&!e.isDone&&s[h])h=z(e,a),b.depCallbacks[d](h);
return n[g]}function E(){var b=q.waitSeconds*1E3,b=b&&i.startTime+b<(new Date).getTime(),a="",c=!1,l=!1,k=[],h,e;if(i.pausedCount>0)return r;if(q.priorityWait)if(j())A();else return r;for(h in s)if(!(h in L)&&(c=!0,!s[h]))if(b)a+=h+" ";else if(l=!0,h.indexOf("!")===-1){k=[];break}else(e=M[h]&&M[h].moduleDeps)&&k.push.apply(k,e);if(!c&&!i.waitCount)return r;if(b&&a)return b=P("timeout","Load timeout for modules: "+a),b.requireType="timeout",b.requireModules=a,b.contextName=i.contextName,d.onError(b);
if(l&&k.length)for(a=0;h=x[k[a]];a++)if(h=F(h,{})){z(h,{});break}if(!b&&(l||i.scriptCount)){if((I||da)&&!X)X=setTimeout(function(){X=0;E()},50);return r}if(i.waitCount){for(a=0;h=J[a];a++)z(h,{});i.paused.length&&A();Y<5&&(Y+=1,E())}Y=0;d.checkReadyState();return r}var i,A,q={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},catchError:{}},S=[],B={require:!0,exports:!0,module:!0},G={},n={},s={},x={},J=[],R={},O=0,M={},N={},H={},T={},Z=0;W=function(b){if(!i.jQuery&&(b=b||(typeof jQuery!=="undefined"?jQuery:
null))&&!(q.jQuery&&b.fn.jquery!==q.jQuery)&&("holdReady"in b||"readyWait"in b))if(i.jQuery=b,w(["jquery",[],function(){return jQuery}]),i.scriptCount)V(b,!0),i.jQueryIncremented=!0};A=function(){var b,a,c,l,k,h;i.takeGlobalQueue();Z+=1;if(i.scriptCount<=0)i.scriptCount=0;for(;S.length;)if(b=S.shift(),b[0]===null)return d.onError(P("mismatch","Mismatched anonymous define() module: "+b[b.length-1]));else w(b);if(!q.priorityWait||j())for(;i.paused.length;){k=i.paused;i.pausedCount+=k.length;i.paused=
[];for(l=0;b=k[l];l++)a=b.map,c=a.url,h=a.fullName,a.prefix?o(a.prefix,b):!R[c]&&!s[h]&&((q.requireLoad||d.load)(i,h,c),c.indexOf("empty:")!==0&&(R[c]=!0));i.startTime=(new Date).getTime();i.pausedCount-=k.length}Z===1&&E();Z-=1;return r};i={contextName:a,config:q,defQueue:S,waiting:x,waitCount:0,specified:B,loaded:s,urlMap:G,urlFetched:R,scriptCount:0,defined:n,paused:[],pausedCount:0,plugins:N,needFullExec:H,fake:{},fullExec:T,managerCallbacks:M,makeModuleMap:l,normalize:c,configure:function(b){var a,
c,d;b.baseUrl&&b.baseUrl.charAt(b.baseUrl.length-1)!=="/"&&(b.baseUrl+="/");a=q.paths;d=q.pkgs;$(q,b,!0);if(b.paths){for(c in b.paths)c in L||(a[c]=b.paths[c]);q.paths=a}if((a=b.packagePaths)||b.packages){if(a)for(c in a)c in L||aa(d,a[c],c);b.packages&&aa(d,b.packages);q.pkgs=d}if(b.priority)c=i.requireWait,i.requireWait=!1,A(),i.require(b.priority),A(),i.requireWait=c,q.priorityWait=b.priority;if(b.deps||b.callback)i.require(b.deps||[],b.callback)},requireDefined:function(b,a){return l(b,a).fullName in
n},requireSpecified:function(b,a){return l(b,a).fullName in B},require:function(b,c,g){if(typeof b==="string"){if(K(c))return d.onError(P("requireargs","Invalid require call"));if(d.get)return d.get(i,b,c);c=l(b,c);b=c.fullName;return!(b in n)?d.onError(P("notloaded","Module name '"+c.fullName+"' has not been loaded yet for context: "+a)):n[b]}(b&&b.length||c)&&C(null,b,c,g);if(!i.requireWait)for(;!i.scriptCount&&i.paused.length;)A();return i.require},takeGlobalQueue:function(){U.length&&(ja.apply(i.defQueue,
[i.defQueue.length-1,0].concat(U)),U=[])},completeLoad:function(b){var a;for(i.takeGlobalQueue();S.length;)if(a=S.shift(),a[0]===null){a[0]=b;break}else if(a[0]===b)break;else w(a),a=null;a?w(a):w([b,[],b==="jquery"&&typeof jQuery!=="undefined"?function(){return jQuery}:null]);d.isAsync&&(i.scriptCount-=1);A();d.isAsync||(i.scriptCount-=1)},toUrl:function(b,a){var c=b.lastIndexOf("."),d=null;c!==-1&&(d=b.substring(c,b.length),b=b.substring(0,c));return i.nameToUrl(b,d,a)},nameToUrl:function(b,a,g){var l,
k,h,e,j=i.config,b=c(b,g&&g.fullName);if(d.jsExtRegExp.test(b))a=b+(a?a:"");else{l=j.paths;k=j.pkgs;g=b.split("/");for(e=g.length;e>0;e--)if(h=g.slice(0,e).join("/"),l[h]){g.splice(0,e,l[h]);break}else if(h=k[h]){b=b===h.name?h.location+"/"+h.main:h.location;g.splice(0,e,b);break}a=g.join("/")+(a||".js");a=(a.charAt(0)==="/"||a.match(/^[\w\+\.\-]+:/)?"":j.baseUrl)+a}return j.urlArgs?a+((a.indexOf("?")===-1?"?":"&")+j.urlArgs):a}};i.jQueryCheck=W;i.resume=A;return i}function ka(){var a,c,d;if(C&&C.readyState===
"interactive")return C;a=document.getElementsByTagName("script");for(c=a.length-1;c>-1&&(d=a[c]);c--)if(d.readyState==="interactive")return C=d;return null}var la=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ma=/require\(\s*["']([^'"\s]+)["']\s*\)/g,fa=/^\.\//,ba=/\.js$/,O=Object.prototype.toString,u=Array.prototype,ha=u.slice,ja=u.splice,I=!!(typeof window!=="undefined"&&navigator&&document),da=!I&&typeof importScripts!=="undefined",na=I&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,
ea=typeof opera!=="undefined"&&opera.toString()==="[object Opera]",L={},D={},U=[],C=null,Y=0,Q=!1,ia={require:!0,module:!0,exports:!0},d,u={},J,y,v,E,o,w,F,B,z,W,X;if(typeof define==="undefined"){if(typeof requirejs!=="undefined")if(K(requirejs))return;else u=requirejs,requirejs=r;typeof require!=="undefined"&&!K(require)&&(u=require,require=r);d=requirejs=function(a,c,d){var j="_",k;!G(a)&&typeof a!=="string"&&(k=a,G(c)?(a=c,c=d):a=[]);if(k&&k.context)j=k.context;d=D[j]||(D[j]=ga(j));k&&d.configure(k);
return d.require(a,c)};d.config=function(a){return d(a)};require||(require=d);d.toUrl=function(a){return D._.toUrl(a)};d.version="1.0.8";d.jsExtRegExp=/^\/|:|\?|\.js$/;y=d.s={contexts:D,skipAsync:{}};if(d.isAsync=d.isBrowser=I)if(v=y.head=document.getElementsByTagName("head")[0],E=document.getElementsByTagName("base")[0])v=y.head=E.parentNode;d.onError=function(a){throw a;};d.load=function(a,c,l){d.resourcesReady(!1);a.scriptCount+=1;d.attach(l,a,c);if(a.jQuery&&!a.jQueryIncremented)V(a.jQuery,!0),
a.jQueryIncremented=!0};define=function(a,c,d){var j,k;typeof a!=="string"&&(d=c,c=a,a=null);G(c)||(d=c,c=[]);!c.length&&K(d)&&d.length&&(d.toString().replace(la,"").replace(ma,function(a,d){c.push(d)}),c=(d.length===1?["require"]:["require","exports","module"]).concat(c));if(Q&&(j=J||ka()))a||(a=j.getAttribute("data-requiremodule")),k=D[j.getAttribute("data-requirecontext")];(k?k.defQueue:U).push([a,c,d]);return r};define.amd={multiversion:!0,plugins:!0,jQuery:!0};d.exec=function(a){return eval(a)};
d.execCb=function(a,c,d,j){return c.apply(j,d)};d.addScriptToDom=function(a){J=a;E?v.insertBefore(a,E):v.appendChild(a);J=null};d.onScriptLoad=function(a){var c=a.currentTarget||a.srcElement,l;if(a.type==="load"||c&&na.test(c.readyState))C=null,a=c.getAttribute("data-requirecontext"),l=c.getAttribute("data-requiremodule"),D[a].completeLoad(l),c.detachEvent&&!ea?c.detachEvent("onreadystatechange",d.onScriptLoad):c.removeEventListener("load",d.onScriptLoad,!1)};d.attach=function(a,c,l,j,k,o){var p;
if(I)return j=j||d.onScriptLoad,p=c&&c.config&&c.config.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),p.type=k||c&&c.config.scriptType||"text/javascript",p.charset="utf-8",p.async=!y.skipAsync[a],c&&p.setAttribute("data-requirecontext",c.contextName),p.setAttribute("data-requiremodule",l),p.attachEvent&&!(p.attachEvent.toString&&p.attachEvent.toString().indexOf("[native code]")<0)&&!ea?(Q=!0,o?p.onreadystatechange=function(){if(p.readyState===
"loaded")p.onreadystatechange=null,p.attachEvent("onreadystatechange",j),o(p)}:p.attachEvent("onreadystatechange",j)):p.addEventListener("load",j,!1),p.src=a,o||d.addScriptToDom(p),p;else da&&(importScripts(a),c.completeLoad(l));return null};if(I){o=document.getElementsByTagName("script");for(B=o.length-1;B>-1&&(w=o[B]);B--){if(!v)v=w.parentNode;if(F=w.getAttribute("data-main")){if(!u.baseUrl)o=F.split("/"),w=o.pop(),o=o.length?o.join("/")+"/":"./",u.baseUrl=o,F=w.replace(ba,"");u.deps=u.deps?u.deps.concat(F):
[F];break}}}d.checkReadyState=function(){var a=y.contexts,c;for(c in a)if(!(c in L)&&a[c].waitCount)return;d.resourcesReady(!0)};d.resourcesReady=function(a){var c,l;d.resourcesDone=a;if(d.resourcesDone)for(l in a=y.contexts,a)if(!(l in L)&&(c=a[l],c.jQueryIncremented))V(c.jQuery,!1),c.jQueryIncremented=!1};d.pageLoaded=function(){if(document.readyState!=="complete")document.readyState="complete"};if(I&&document.addEventListener&&!document.readyState)document.readyState="loading",window.addEventListener("load",
d.pageLoaded,!1);d(u);if(d.isAsync&&typeof setTimeout!=="undefined")z=y.contexts[u.context||"_"],z.requireWait=!0,setTimeout(function(){z.requireWait=!1;z.scriptCount||z.resume();d.checkReadyState()},0)}})();
/**
*
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
*
**/

 
function SHA1 (msg) {
 
  function rotate_left(n,s) {
    var t4 = ( n<<s ) | (n>>>(32-s));
    return t4;
  };
 
  function lsb_hex(val) {
    var str="";
    var i;
    var vh;
    var vl;
 
    for( i=0; i<=6; i+=2 ) {
      vh = (val>>>(i*4+4))&0x0f;
      vl = (val>>>(i*4))&0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };
 
  function cvt_hex(val) {
    var str="";
    var i;
    var v;
 
    for( i=7; i>=0; i-- ) {
      v = (val>>>(i*4))&0x0f;
      str += v.toString(16);
    }
    return str;
  };
 
 
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
 
    for (var n = 0; n < string.length; n++) {
 
      var c = string.charCodeAt(n);
 
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
 
    }
 
    return utftext;
  };
 
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
 
  msg = Utf8Encode(msg);
 
  var msg_len = msg.length;
 
  var word_array = new Array();
  for( i=0; i<msg_len-3; i+=4 ) {
    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
    msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
    word_array.push( j );
  }
 
  switch( msg_len % 4 ) {
    case 0:
      i = 0x080000000;
    break;
    case 1:
      i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
    break;
 
    case 2:
      i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
    break;
 
    case 3:
      i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8  | 0x80;
    break;
  }
 
  word_array.push( i );
 
  while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
  word_array.push( msg_len>>>29 );
  word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
    for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
    for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
 
    for( i= 0; i<=19; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=20; i<=39; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=40; i<=59; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=60; i<=79; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
 
  }
 
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
  return temp.toLowerCase();
 
}
;
/*
 *  Sugar Library v1.2.5
 *
 *  Freely distributable and licensed under the MIT-style license.
 *  Copyright (c) 2012 Andrew Plummer
 *  http://sugarjs.com/
 *
 * ---------------------------- */

(function(context){var i=true,j=null,l=false,n=Object,o=Array,p=RegExp,q=Date,r=String,s=Number,t=n.defineProperty&&n.defineProperties;function v(a,b,c,d){var e=b?a.prototype:a,f;w(a,b,d);x(d,function(g,h){f=e[g];if(typeof c==="function")h=aa(e[g],h,c);if(c!==l||!e[g])y(e,g,h);a.SugarMethods[g]={e:b,method:h,g:f}})}
function w(a){if(!a.SugarMethods){y(a,"SugarMethods",{});v(a,l,l,{restore:function(){var b=arguments.length===0,c=z(arguments);x(a.SugarMethods,function(d,e){if(b||c.has(d))y(e.e?a.prototype:a,d,e.method)})},extend:function(b,c,d){a===n&&arguments.length===0?A(C.concat(D),Object):v(a,d!==l,c,b)}})}}function aa(a,b,c){return function(){return a&&(c===i||!c.apply(this,arguments))?a.apply(this,arguments):b.apply(this,arguments)}}
function y(a,b,c){if(t)n.defineProperty(a,b,{value:c,configurable:i,enumerable:l,writable:i});else a[b]=c}function x(a,b){for(var c in a)n.prototype.hasOwnProperty.call(a,c)&&b.call(a,c,a[c])}function E(a,b,c,d){var e=i;if(a===b)return i;else if(n.isRegExp(b))return p(b).test(a);else if(n.isFunction(b))return b.apply(c,[a].concat(d));else if(n.isObject(b)&&n.isObject(a)){x(b,function(f){E(a[f],b[f],c,d)||(e=l)});return!n.isEmpty(b)&&e}else return n.equal(a,b)}
function F(a,b){var c,d,e,f,g,h,k=typeof a;if(k==="string")return a;d=n.prototype.toString.call(a);c=d==="[object Object]";e=d==="[object Array]";if(a!=j&&c||e){b||(b=[]);if(b.length>1)for(g=b.length;g--;)if(b[g]===a)return"CYC";b.push(a);c=r(a.constructor);f=e?a:n.keys(a).sort();for(g=0;g<f.length;g++){h=e?g:f[g];c+=h+F(a[h],b)}b.pop()}else c=1/a===-Infinity?"-0":r(a);return k+d+c}function G(a,b,c,d){return H(b)?a:n.isFunction(b)?b.apply(c,d||[]):n.isFunction(a[b])?a[b].call(a):a[b]}
function I(a,b){return Array.prototype.slice.call(a,b)}function z(a,b,c,d){a=I(a);if(c===i)a=J(a,1);K(a,b||function(){},d);return a}function ba(a,b,c){var d=[],e=a.length,f=b[b.length-1]!==l,g;z(b,function(h){if(n.isBoolean(h))return l;if(f){h%=e;if(h<0)h=e+h}g=c?a.charAt(h)||"":a[h];d.push(g)});return d.length<2?d[0]:d}function L(a,b){return n.prototype.toString.call(a)==="[object "+b+"]"}function H(a){return a===void 0}
function ca(a,b,c,d){var e=/^(.+?)(\[.*\])$/,f,g,h;if(d!==l&&(g=b.match(e))){h=g[1];b=g[2].replace(/^\[|\]$/g,"").split("][");K(b,function(k){f=!k||k.match(/^\d+$/);if(!h&&n.isArray(a))h=a.length;a[h]||(a[h]=f?[]:{});a=a[h];h=k});if(!h&&f)h=a.length.toString();ca(a,h,c)}else a[b]=c.match(/^[\d.]+$/)?parseFloat(c):c==="true"?i:c==="false"?l:c}function M(a){var b=this;x(a,function(c,d){b[c]=d})}var C=["isObject","isNaN"],D=["keys","values","each","merge","isEmpty","clone","equal","watch","tap","has"];
function A(a,b){var c={};K(a,function(d){c[d+(d==="equal"?"s":"")]=function(){return Object[d].apply(j,[this].concat(I(arguments)))}});v(b,i,l,c)}v(n,l,i,{watch:function(a,b,c){if(t){var d=a[b];n.defineProperty(a,b,{get:function(){return d},set:function(e){d=c.call(a,b,d,e)},enumerable:i,configurable:i})}}});
v(n,l,l,{extended:function(a){return new M(a)},isObject:function(a){return a==j?l:L(a,"Object")&&r(a.constructor)===r(n)||a.constructor===M},isNaN:function(a){return n.isNumber(a)&&a.valueOf()!==a.valueOf()},each:function(a,b){b&&x(a,function(c,d){b.call(a,c,d,a)});return a},merge:function(a,b,c,d){var e,f;if(a&&typeof b!="string")for(e in b)if(n.prototype.hasOwnProperty.call(b,e)&&a){f=b[e];if(a[e]!==void 0){if(d===l)continue;if(n.isFunction(d))f=d.call(b,e,a[e],b[e])}if(c===i&&f&&typeof f==="object")if(n.isDate(f))f=
new Date(f.getTime());else if(n.isRegExp(f))f=RegExp(f.source,f.getFlags());else{a[e]||(a[e]=o.isArray(f)?[]:{});Object.merge(a[e],b[e],c,d);continue}a[e]=f}return a},isEmpty:function(a){if(a==j||typeof a!="object")return!(a&&a.length>0);return n.keys(a).length==0},equal:function(a,b){return F(a)===F(b)},values:function(a,b){var c=[];x(a,function(d,e){c.push(e);b&&b.call(a,e)});return c},clone:function(a,b){if(a==j||typeof a!=="object")return a;if(o.isArray(a))return a.clone();var c=a.constructor===
M?new M:{};return n.merge(c,a,b)},fromQueryString:function(a,b){var c=n.extended();a=a&&a.toString?a.toString():"";a.replace(/^.*?\?/,"").unescapeURL().split("&").each(function(d){d=d.split("=");d.length===2&&ca(c,d[0],d[1],b)});return c},tap:function(a,b){G(a,b,a,[a]);return a},has:function(a,b){return n.prototype.hasOwnProperty.call(a,b)}});
v(n,l,function(){return arguments.length>1},{keys:function(a,b){if(a==j||typeof a!="object"&&!n.isRegExp(a)&&!n.isFunction(a))throw new TypeError("Object required");var c=[];x(a,function(d,e){c.push(d);b&&b.call(a,d,e)});return c}});function K(a,b,c,d,e){var f,g;N(b);if(c<0)c=a.length+c;g=isNaN(c)?0:parseInt(c>>0);for(c=d===i?a.length+g:a.length;g<c;){f=g%a.length;if(!(f in a)&&e===i)return da(a,b,g,d);else if(b.call(a,a[f],f,a)===l)break;g++}}
function ea(a,b,c,d,e){var f,g;K(a,function(h,k,m){if(E(h,b,m,[k,m])){f=h;g=k;return l}},c,d);return e?g:f}function O(a,b){var c=[],d={},e,f;K(a,function(g,h){f=b?G(g,b,a,[g,h,a]):g;e=F(f);if(!(e in d&&(typeof g!=="function"||g===d[e]))){d[e]=f;c.push(g)}});return c}function J(a,b,c){b=b||Infinity;c=c||0;var d=[];K(a,function(e){if(n.isArray(e)&&c<b)d=d.concat(J(e,b,c+1));else d.push(e)});return d}
function fa(a,b,c){var d=[],e={};b.each(function(f){e[F(f)]=f});a.each(function(f){var g=F(f);if((g in e&&(typeof f!=="function"||f===e[g]))!=c){delete e[g];d.push(f)}});return d}function ga(a,b,c,d){var e=a.length,f=d==-1,g=f?e-1:0;c=isNaN(c)?g:parseInt(c>>0);if(c<0)c=e+c;if(!f&&c<0||f&&c>=e)c=g;for(;f&&c>=0||!f&&c<e;){if(a[c]===b)return c;c+=d}return-1}
function ha(a,b,c,d){var e=a.length,f=0,g=c!==void 0;N(b);if(e==0&&!g)throw new TypeError("Reduce called on empty array with no initial value");else if(g)c=c;else{c=a[d?e-1:f];f++}for(;f<e;){g=d?e-f-1:f;if(g in a)c=b.call(void 0,c,a[g],g,a);f++}return c}function N(a){if(!a||!a.call)throw new TypeError("Callback is not callable");}function P(a){if(a.length===0)throw new TypeError("First argument must be defined");}
function da(a,b,c){var d=[],e;for(e in a)e in a&&e>>>0==e&&e!=4294967295&&e>=c&&d.push(e.toNumber());d.sort().each(function(f){return b.call(a,a[f],f,a)});return a}function Q(a,b,c,d){var e=c==="max",f=c==="min",g=e?-Infinity:Infinity,h=[];x(a,function(k){var m=a[k];k=G(m,b,a,d?[m,k.toNumber(),a]:[]);if(k===g)h.push(m);else if(e&&k>g||f&&k<g){h=[m];g=k}});return h}function ia(a){if(o[ja])a=a.toLowerCase();return a.remove(o[ka])}function la(a,b){var c=a.charAt(b);return(o[ma]||{})[c]||c}
var ka="AlphanumericSortIgnore",ja="AlphanumericSortIgnoreCase",ma="AlphanumericSortEquivalents";v(o,l,l,{create:function(){var a=[];z(arguments,function(b){if(b&&b.callee)b=I(b);a=a.concat(b)});return a},isArray:function(a){return L(a,"Array")}});
v(o,i,function(){var a=arguments;return a.length>0&&!n.isFunction(a[0])},{every:function(a,b){var c=this.length,d=0;for(P(arguments);d<c;){if(d in this&&!E(this[d],a,b,[d,this]))return l;d++}return i},some:function(a,b){var c=this.length,d=0;for(P(arguments);d<c;){if(d in this&&E(this[d],a,b,[d,this]))return i;d++}return l},map:function(a,b){var c=this.length,d=0,e,f=Array(c);for(P(arguments);d<c;){if(d in this){e=this[d];f[d]=G(e,a,b,[e,d,this])}d++}return f},filter:function(a,b){var c=this.length,
d=0,e=[];for(P(arguments);d<c;){d in this&&E(this[d],a,b,[d,this])&&e.push(this[d]);d++}return e}});
v(o,i,l,{indexOf:function(a,b){if(n.isString(this))return this.indexOf(a,b);return ga(this,a,b,1)},lastIndexOf:function(a,b){if(n.isString(this))return this.lastIndexOf(a,b);return ga(this,a,b,-1)},forEach:function(a,b){var c=this.length,d=0;for(N(a);d<c;){d in this&&a.call(b,this[d],d,this);d++}},reduce:function(a,b){return ha(this,a,b)},reduceRight:function(a,b){return ha(this,a,b,i)},each:function(a,b,c){K(this,a,b,c,i);return this},find:function(a,b,c){return ea(this,a,b,c)},findAll:function(a,
b,c){var d=[];K(this,function(e,f,g){E(e,a,g,[f,g])&&d.push(e)},b,c);return d},findIndex:function(a,b,c){a=ea(this,a,b,c,i);return H(a)?-1:a},count:function(a){if(H(a))return this.length;return this.findAll(a).length},none:function(){return!this.any.apply(this,arguments)},remove:function(){var a,b=this;z(arguments,function(c){for(a=0;a<b.length;)if(E(b[a],c,b,[a,b]))b.splice(a,1);else a++});return b},removeAt:function(a,b){if(H(a))return this;if(H(b))b=a;for(var c=0;c<=b-a;c++)this.splice(a,1);return this},
add:function(a,b){if(!n.isNumber(s(b))||isNaN(b)||b==-1)b=this.length;else if(b<-1)b+=1;o.prototype.splice.apply(this,[b,0].concat(a));return this},include:function(a,b){return this.clone().add(a,b)},exclude:function(){return o.prototype.remove.apply(this.clone(),arguments)},clone:function(){return n.merge([],this)},unique:function(a){return O(this,a)},union:function(){var a=this;z(arguments,function(b){a=a.concat(b)});return O(a)},intersect:function(){return fa(this,z(arguments,j,i),l)},subtract:function(){return fa(this,
z(arguments,j,i),i)},at:function(){return ba(this,arguments)},first:function(a){if(H(a))return this[0];if(a<0)a=0;return this.slice(0,a)},last:function(a){if(H(a))return this[this.length-1];return this.slice(this.length-a<0?0:this.length-a)},from:function(a){return this.slice(a)},to:function(a){if(H(a))a=this.length;return this.slice(0,a)},min:function(a){return O(Q(this,a,"min",i))},max:function(a){return O(Q(this,a,"max",i))},least:function(){var a=J(Q(this.groupBy.apply(this,arguments),"length",
"min"));return a.length===this.length?[]:O(a)},most:function(){var a=J(Q(this.groupBy.apply(this,arguments),"length","max"));return a.length===this.length?[]:O(a)},sum:function(a){a=a?this.map(a):this;return a.length>0?a.reduce(function(b,c){return b+c}):0},average:function(a){a=a?this.map(a):this;return a.length>0?a.sum()/a.length:0},groupBy:function(a,b){var c=this,d=n.extended(),e;K(c,function(f,g){e=G(f,a,c,[f,g,c]);d[e]||(d[e]=[]);d[e].push(f)});return d.each(b)},inGroups:function(a,b){var c=
arguments.length>1,d=this,e=[],f=(this.length/a).ceil();(0).upto(a-1,function(g){g=g*f;var h=d.slice(g,g+f);c&&h.length<f&&(f-h.length).times(function(){h=h.add(b)});e.push(h)});return e},inGroupsOf:function(a,b){if(this.length===0||a===0)return this;if(H(a))a=1;if(H(b))b=j;var c=[],d=j;this.each(function(e,f){if(f%a===0){d&&c.push(d);d=[]}if(H(e))e=b;d.push(e)});if(!this.length.isMultipleOf(a)){(a-this.length%a).times(function(){d.push(b)});this.length+=a-this.length%a}d.length>0&&c.push(d);return c},
compact:function(a){var b=[];K(this,function(c){if(n.isArray(c))b.push(c.compact());else if(a&&c)b.push(c);else!a&&c!=j&&!n.isNaN(c)&&b.push(c)});return b},isEmpty:function(){return this.compact().length==0},flatten:function(a){return J(this,a)},sortBy:function(a,b){var c=this.clone();c.sort(function(d,e){var f,g;f=G(d,a,c,[d]);g=G(e,a,c,[e]);if(n.isString(f)&&n.isString(g)){f=f;g=g;var h,k,m,u,B=0,R=0;f=ia(f);g=ia(g);do{m=la(f,B);u=la(g,B);h=m?o.AlphanumericSortOrder.indexOf(m):j;k=u?o.AlphanumericSortOrder.indexOf(u):
j;if(h===-1||k===-1){h=f.charCodeAt(B)||j;k=g.charCodeAt(B)||j}m=m!==f.charAt(B);u=u!==g.charAt(B);if(m!==u&&R===0)R=m-u;B+=1}while(h!=j&&k!=j&&h===k);f=h===k?R:h<k?-1:1}else f=f<g?-1:f>g?1:0;return f*(b?-1:1)});return c},randomize:function(){for(var a=this.concat(),b,c,d=a.length;d;b=parseInt(Math.random()*d),c=a[--d],a[d]=a[b],a[b]=c);return a},zip:function(){var a=I(arguments);return this.map(function(b,c){return[b].concat(a.map(function(d){return c in d?d[c]:j}))})},sample:function(a){var b=[],
c=this.clone(),d;for(a>0||(a=1);b.length<a;){d=Number.random(0,c.length-1);b.push(c[d]);c.removeAt(d);if(c.length==0)break}return arguments.length>0?b:b[0]}});v(o,i,l,{all:o.prototype.every,any:o.prototype.some,has:o.prototype.some,insert:o.prototype.add});function S(a,b,c){c=Math[c||"round"];var d=Math.pow(10,(b||0).abs());if(b<0)d=1/d;return c(a*d)/d}function na(a,b,c,d){var e=[];a=parseInt(a);for(var f=d>0;f&&a<=b||!f&&a>=b;){e.push(a);c&&c.call(this,a);a+=d}return e}
function T(a,b,c,d,e,f){var g=a.toFixed(20),h=g.search(/\./);g=g.search(/[1-9]/);h=h-g;if(h>0)h-=1;e=Math.max(Math.min((h/3).floor(),e===l?c.length:e),-d);d=c.charAt(e+d-1);if(h<-9){e=-3;b=h.abs()-9;d=c.first()}return(a/(f?(2).pow(10*e):(10).pow(e*3))).round(b||0).format()+d.trim()}v(s,l,l,{random:function(a,b){var c;if(arguments.length==1){b=a;a=0}c=Math.min(a||0,H(b)?1:b);return S(Math.random()*(Math.max(a||0,H(b)?1:b)-c)+c)}});
v(s,i,l,{toNumber:function(){return parseFloat(this,10)},abbr:function(a){return T(this,a,"kmbt",0,4)},metric:function(a,b){return T(this,a,"n\u03bcm kMGTPE",4,H(b)?1:b)},bytes:function(a,b){return T(this,a,"kMGTPE",0,H(b)?4:b,i)+"B"},isInteger:function(){return this%1==0},ceil:function(a){return S(this,a,"ceil")},floor:function(a){return S(this,a,"floor")},abs:function(){return Math.abs(this)},pow:function(a){if(H(a))a=1;return Math.pow(this,a)},round:function(a){return S(this,a,"round")},chr:function(){return r.fromCharCode(this)},
isOdd:function(){return!this.isMultipleOf(2)},isEven:function(){return this.isMultipleOf(2)},isMultipleOf:function(a){return this%a===0},upto:function(a,b,c){return na(this,a,b,c||1)},downto:function(a,b,c){return na(this,a,b,-(c||1))},times:function(a){if(a)for(var b=0;b<this;b++)a.call(this,b);return this.toNumber()},ordinalize:function(){var a;a=this.abs();var b=a.toString().last(2).toNumber();if(b>=11&&b<=13)a="th";else switch(a%10){case 1:a="st";break;case 2:a="nd";break;case 3:a="rd";break;
default:a="th"}return this.toString()+a},pad:function(a,b,c){c=c||10;c=this.toNumber()===0?"":this.toString(c).replace(/^-/,"");c=U(c,"0",a-c.replace(/\.\d+$/,"").length,0);if(b||this<0)c=(this<0?"-":"+")+c;return c},format:function(a,b,c){var d,e,f=/(\d+)(\d{3})/;if(r(b).match(/\d/))throw new TypeError("Thousands separator cannot contain numbers.");d=n.isNumber(a)?S(this,a).toFixed(Math.max(a,0)):this.toString();b=b||",";c=c||".";e=d.split(".");d=e[0];for(e=e[1]||"";d.match(f);)d=d.replace(f,"$1"+
b+"$2");if(e.length>0)d+=c+U(e,"0",0,a-e.length);return d},hex:function(a){return this.pad(a||1,l,16)}});function V(){return"\t\n\u000b\u000c\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u2028\u2029\u3000\ufeff"}function oa(a,b,c,d){var e=I(b).join("");e=e.replace(/all/,"").replace(/(\w)lphabet|umbers?|atakana|paces?|unctuation/g,"$1");return a.replace(c,function(f){return d[f]&&(!e||e.has(d[f].type))?d[f].to:f})}
var pa=[{type:"a",shift:65248,start:65,end:90},{type:"a",shift:65248,start:97,end:122},{type:"n",shift:65248,start:48,end:57},{type:"p",shift:65248,start:33,end:47},{type:"p",shift:65248,start:58,end:64},{type:"p",shift:65248,start:91,end:96},{type:"p",shift:65248,start:123,end:126}],qa={},ra={},sa=/[\u0020-\u00A5]|[\uFF61-\uFF9F][\uff9e\uff9f]?/g,ta=/[\u3000-\u301C]|[\u301A-\u30FC]|[\uFF01-\uFF60]|[\uFFE0-\uFFE6]/g,ua=/[\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30cf\u30d2\u30d5\u30d8\u30db]/,
va=/[\u30cf\u30d2\u30d5\u30d8\u30db\u30f2]/;function W(a,b,c){qa[b]={type:a,to:c};ra[c]={type:a,to:b}}function U(a,b,c,d){var e=String(b);if(e!=b)e="";n.isNumber(c)||(c=1);n.isNumber(d)||(d=1);return e.repeat(c)+a+e.repeat(d)}var X,Y;
v(r,i,l,{escapeRegExp:function(){return p.escape(this)},escapeURL:function(a){return a?encodeURIComponent(this):encodeURI(this)},unescapeURL:function(a){return a?decodeURI(this):decodeURIComponent(this)},escapeHTML:function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},unescapeHTML:function(){return this.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")},encodeBase64:function(){return X(this)},decodeBase64:function(){return Y(this)},capitalize:function(a){return this.toLowerCase().replace(a?
/^\S|\s\S/g:/^\S/,function(b){return b.toUpperCase()})},pad:function(a,b){return U(this,a,b,b)},padLeft:function(a,b){return U(this,a,b,0)},padRight:function(a,b){return U(this,a,0,b)},repeat:function(a){var b="",c=0;if(n.isNumber(a)&&a>0)for(;c<a;){b+=this;c++}return b},each:function(a,b){if(n.isFunction(a)){b=a;a=/[\s\S]/g}else if(a)if(n.isString(a))a=p(p.escape(a),"gi");else{if(n.isRegExp(a))a=a.addFlag("g")}else a=/[\s\S]/g;var c=this.match(a)||[];if(b)for(var d=0;d<c.length;d++)c[d]=b.call(this,
c[d],d,c)||c[d];return c},shift:function(a){var b="";a=a||0;this.codes(function(c){b+=(c+a).chr()});return b},codes:function(a){for(var b=[],c=0;c<this.length;c++){var d=this.charCodeAt(c);b.push(d);a&&a.call(this,d,c)}return b},chars:function(a){return this.each(a)},words:function(a){return this.trim().each(/\S+/g,a)},lines:function(a){return this.trim().each(/^.*$/gm,a)},paragraphs:function(a){var b=this.trim().split(/[\r\n]{2,}/);return b=b.map(function(c){if(a)var d=a.call(c);return d?d:c})},
startsWith:function(a,b){if(H(b))b=i;var c=n.isRegExp(a)?a.source.replace("^",""):p.escape(a);return p("^"+c,b?"":"i").test(this)},endsWith:function(a,b){if(H(b))b=i;var c=n.isRegExp(a)?a.source.replace("$",""):p.escape(a);return p(c+"$",b?"":"i").test(this)},isBlank:function(){return this.trim().length===0},has:function(a){return this.search(n.isRegExp(a)?a:RegExp.escape(a))!==-1},add:function(a,b){return this.split("").add(a,b).join("")},remove:function(a){return this.replace(a,"")},hankaku:function(){return oa(this,
arguments,ta,ra)},zenkaku:function(){return oa(this,arguments,sa,qa)},hiragana:function(a){var b=this;if(a!==l)b=b.zenkaku("k");return b.replace(/[\u30A1-\u30F6]/g,function(c){return c.shift(-96)})},katakana:function(){return this.replace(/[\u3041-\u3096]/g,function(a){return a.shift(96)})},toNumber:function(a){var b=this.replace(/,/g,"");return b.match(/\./)?parseFloat(b):parseInt(b,a||10)},reverse:function(){return this.split("").reverse().join("")},compact:function(){return this.trim().replace(/([\r\n\s\u3000])+/g,
function(a,b){return b==="\u3000"?b:" "})},at:function(){return ba(this,arguments,i)},first:function(a){if(H(a))a=1;return this.substr(0,a)},last:function(a){if(H(a))a=1;return this.substr(this.length-a<0?0:this.length-a)},from:function(a){return this.slice(a)},to:function(a){if(H(a))a=this.length;return this.slice(0,a)},toDate:function(a){var b=this.toString();return q.create?q.create(b,a):new q(b)},dasherize:function(){return this.underscore().replace(/_/g,"-")},underscore:function(){return this.replace(/[-\s]+/g,
"_").replace(String.Inflector&&String.Inflector.acronymRegExp,function(a,b){return(b>0?"_":"")+a.toLowerCase()}).replace(/([A-Z\d]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").toLowerCase()},camelize:function(a){return this.underscore().replace(/(^|_)([^_]+)/g,function(b,c,d,e){b=r.Inflector&&r.Inflector.acronyms&&r.Inflector.acronyms[d];e=a!==l||e>0;if(b)return e?b:b.toLowerCase();return e?d.capitalize():d})},spacify:function(){return this.underscore().replace(/_/g," ")},stripTags:function(){var a=
this;z(arguments.length>0?arguments:[""],function(b){a=a.replace(p("</?"+b.escapeRegExp()+"[^<>]*>","gi"),"")});return a},removeTags:function(){var a=this;z(arguments.length>0?arguments:["\\S+"],function(b){b=p("<("+b+")[^<>]*(?:\\/>|>.*?<\\/\\1>)","gi");a=a.replace(b,"")});return a},truncate:function(a,b,c,d){var e="",f="",g=this.toString(),h="["+V()+"]+",k="[^"+V()+"]*",m=p(h+k+"$");d=H(d)?"...":r(d);if(g.length<=a)return g;switch(c){case "left":a=g.length-a;e=d;g=g.slice(a);m=p("^"+k+h);break;
case "middle":a=Math.floor(a/2);f=d+g.slice(g.length-a).trimLeft();g=g.slice(0,a);break;default:a=a;f=d;g=g.slice(0,a)}if(b===l&&this.slice(a,a+1).match(/\S/))g=g.remove(m);return e+g+f},assign:function(){var a=n.extended();z(arguments,function(b,c){if(n.isObject(b))a.merge(b);else a[c+1]=b});return this.replace(/\{(.+?)\}/g,function(b,c){return n.prototype.hasOwnProperty.call(a,c)?a[c]:b})}});
v(r,i,function(a){return n.isRegExp(a)},{split:function(a,b){var c=[],d=0;a=p(a).addFlag("g");var e,f,g,h;p.c||(e=RegExp("^"+a.source+"$(?!\\s)",a.getFlags()));if(H(b)||b<0)b=Infinity;else{b|=0;if(!b)return[]}for(;f=a.exec(this);){g=f.index+f[0].length;if(g>d){c.push(this.slice(d,f.index));!p.c&&f.length>1&&f[0].replace(e,function(){for(var k=1;k<arguments.length-2;k++)if(H(arguments[k]))f[k]=void 0});f.length>1&&f.index<this.length&&o.prototype.push.apply(c,f.slice(1));h=f[0].length;d=g;if(c.length>=
b)break}a.lastIndex===f.index&&a.lastIndex++}if(d===this.length){if(h||!a.test(""))c.push("")}else c.push(this.slice(d));return c.length>b?c.slice(0,b):c}});v(r,i,l,{insert:r.prototype.add});p.c=H(p("()??").exec("")[1]);function Z(a,b){var c="";if(b=="g"||a.global)c+="g";if(b=="i"||a.ignoreCase)c+="i";if(b=="m"||a.multiline)c+="m";if(b=="y"||a.h)c+="y";return c}v(p,l,l,{escape:function(a){n.isString(a)||(a=String(a));return a.replace(/([\\/'*+?|()\[\]{}.^$])/g,"\\$1")}});
v(p,i,l,{getFlags:function(){return Z(this)},setFlags:function(a){return p(this.source,a)},addFlag:function(a){return this.setFlags(Z(this,a))},removeFlag:function(a){return this.setFlags(Z(this).replace(a,""))}});function $(a,b,c,d,e){if(!a.b)a.b=[];n.isNumber(b)||(b=0);a.b.push(setTimeout(function(){a.b.removeAt(f);c.apply(d,e||[])},b));var f=a.b.length}
v(Function,i,l,{lazy:function(a,b){function c(){if(!(f&&e.length>b-2)){e.push([this,arguments]);g()}}var d=this,e=[],f=l,g,h,k;a=a||1;b=b||Infinity;h=a.ceil();k=S(h/a);g=function(){if(!(f||e.length==0)){for(var m=Math.max(e.length-k,0);e.length>m;)Function.prototype.apply.apply(d,e.shift());$(c,h,function(){f=l;g()});f=i}};return c},delay:function(a){var b=I(arguments,1);$(this,a,this,this,b);return this},throttle:function(a){return this.lazy(a,1)},debounce:function(a){var b=this;return function(){b.cancel();
$(b,a,b,this,arguments)}},cancel:function(){if(n.isArray(this.b))for(;this.b.length>0;)clearTimeout(this.b.shift());return this},after:function(a){var b=this,c=0,d=[];if(n.isNumber(a)){if(a===0){b.call();return b}}else a=1;return function(){var e;d.push(Array.create(arguments));c++;if(c==a){e=b.call(this,d);c=0;d=[];return e}}},once:function(){var a=this;return function(){return n.prototype.hasOwnProperty.call(a,"memo")?a.memo:a.memo=a.apply(this,arguments)}},fill:function(){var a=this,b=I(arguments);
return function(){var c=I(arguments);K(b,function(d,e){if(d!=j||e>=c.length)c.splice(e,0,d)});return a.apply(this,c)}}});(function(){var a={},b;K(["Array","Boolean","Date","Function","Number","String","RegExp"],function(c){b="is"+c;C.push(b);a[b]=function(d){return L(d,c)}});v(Object,l,l,a)})();A(D,M);
(function(a){if(this.btoa){X=this.btoa;Y=this.atob}var b=/[^A-Za-z0-9\+\/\=]/g;X=function(c){var d="",e,f,g,h,k,m,u=0;do{e=c.charCodeAt(u++);f=c.charCodeAt(u++);g=c.charCodeAt(u++);h=e>>2;e=(e&3)<<4|f>>4;k=(f&15)<<2|g>>6;m=g&63;if(isNaN(f))k=m=64;else if(isNaN(g))m=64;d=d+a.charAt(h)+a.charAt(e)+a.charAt(k)+a.charAt(m)}while(u<c.length);return d};Y=function(c){var d="",e,f,g,h,k,m=0;if(c.match(b))throw Error("String contains invalid base64 characters");c=c.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{e=a.indexOf(c.charAt(m++));
f=a.indexOf(c.charAt(m++));h=a.indexOf(c.charAt(m++));k=a.indexOf(c.charAt(m++));e=e<<2|f>>4;f=(f&15)<<4|h>>2;g=(h&3)<<6|k;d+=e.chr();if(h!=64)d+=f.chr();if(k!=64)d+=g.chr()}while(m<c.length);return unescape(d)}})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=");
(function(){var a=V().match(/^\s+$/);try{r.prototype.trim.call([1])}catch(b){a=l}var c=p("^["+V()+"]+"),d=p("["+V()+"]+$");v(r,i,!a,{trim:function(){return this.toString().trimLeft().trimRight()},trimLeft:function(){return this.replace(c,"")},trimRight:function(){return this.replace(d,"")}})})();
(function(){var a;K(pa,function(b){b.start.upto(b.end,function(c){W(b.type,c.chr(),(c+b.shift).chr())})});"\u30a2\u30a4\u30a6\u30a8\u30aa\u30a1\u30a3\u30a5\u30a7\u30a9\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c3\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e3\u30e6\u30e5\u30e8\u30e7\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3\u30fc\u30fb".each(function(b,c){a="\uff71\uff72\uff73\uff74\uff75\uff67\uff68\uff69\uff6a\uff6b\uff76\uff77\uff78\uff79\uff7a\uff7b\uff7c\uff7d\uff7e\uff7f\uff80\uff81\uff82\uff6f\uff83\uff84\uff85\uff86\uff87\uff88\uff89\uff8a\uff8b\uff8c\uff8d\uff8e\uff8f\uff90\uff91\uff92\uff93\uff94\uff6c\uff95\uff6d\uff96\uff6e\uff97\uff98\uff99\uff9a\uff9b\uff9c\uff66\uff9d\uff70\uff65".charAt(c);
W("k",a,b);b.match(ua)&&W("k",a+"\uff9e",b.shift(1));b.match(va)&&W("k",a+"\uff9f",b.shift(2))});"\u3002\u3001\u300c\u300d\uffe5\uffe0\uffe1".each(function(b,c){W("p","\uff61\uff64\uff62\uff63\u00a5\u00a2\u00a3".charAt(c),b)});W("k","\uff73\uff9e","\u30f4");W("k","\uff66\uff9e","\u30fa");W("s"," ","\u3000")})();
[{a:["Arabic"],source:"\u0600-\u06ff"},{a:["Cyrillic"],source:"\u0400-\u04ff"},{a:["Devanagari"],source:"\u0900-\u097f"},{a:["Greek"],source:"\u0370-\u03ff"},{a:["Hangul"],source:"\uac00-\ud7af\u1100-\u11ff"},{a:["Han","Kanji"],source:"\u4e00-\u9fff\uf900-\ufaff"},{a:["Hebrew"],source:"\u0590-\u05ff"},{a:["Hiragana"],source:"\u3040-\u309f\u30fb-\u30fc"},{a:["Kana"],source:"\u3040-\u30ff\uff61-\uff9f"},{a:["Katakana"],source:"\u30a0-\u30ff\uff61-\uff9f"},{a:["Latin"],source:"\u0001-\u0080-\u00ff\u0100-\u017f\u0180-\u024f"},
{a:["Thai"],source:"\u0e00-\u0e7f"}].each(function(a){var b=p("^["+a.source+"\\s]+$"),c=p("["+a.source+"]");a.a.each(function(d){y(r.prototype,"is"+d,function(){return b.test(this.trim())});y(r.prototype,"has"+d,function(){return c.test(this)})})});
(function(){var a=l;if(Function.prototype.d){a=function(){};var b=a.d();a=new b instanceof b&&!(new a instanceof b)}v(Function,i,!a,{bind:function(c){var d=this,e=I(arguments,1),f,g;if(!n.isFunction(this))throw new TypeError("Function.prototype.bind called on a non-function");g=function(){return d.apply(d.prototype&&this instanceof d?this:c,e.concat(I(arguments)))};f=function(){};f.prototype=this.prototype;g.prototype=new f;return g}})})();
(function(){o.AlphanumericSortOrder="A\u00c1\u00c0\u00c2\u00c3\u0104BC\u0106\u010c\u00c7D\u010e\u00d0E\u00c9\u00c8\u011a\u00ca\u00cb\u0118FG\u011eH\u0131I\u00cd\u00cc\u0130\u00ce\u00cfJKL\u0141MN\u0143\u0147\u00d1O\u00d3\u00d2\u00d4PQR\u0158S\u015a\u0160\u015eT\u0164U\u00da\u00d9\u016e\u00db\u00dcVWXY\u00ddZ\u0179\u017b\u017d\u00de\u00c6\u0152\u00d8\u00d5\u00c5\u00c4\u00d6".split("").map(function(b){return b+b.toLowerCase()}).join("");var a={};"A\u00c1\u00c0\u00c2\u00c3\u00c4,C\u00c7,E\u00c9\u00c8\u00ca\u00cb,I\u00cd\u00cc\u0130\u00ce\u00cf,O\u00d3\u00d2\u00d4\u00d5\u00d6,S\u00df,U\u00da\u00d9\u00db\u00dc".split(",").each(function(b){var c=
b.charAt(0);b.slice(1).chars(function(d){a[d]=c;a[d.toLowerCase()]=c.toLowerCase()})});o[ja]=i;o[ma]=a})();w(q);Object.f=w;})(this);
(function(context){var j=true,k=false;function o(a){return function(){return a}}var p=RegExp,q=Object,s=Date,t=Number,u;function v(a){return a!==void 0}
var w=["hour","minute","second","meridian","utc","offset_sign","offset_hours","offset_minutes"],x="\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d",y="\u5341\u767e\u5343\u4e07",B=p("["+x+y+"]","g"),C=[],D,E,F=[{src:"(\\d{4})",to:["year"]},{src:"([+-])?(\\d{4})[-.]?({month})[-.]?(\\d{1,2})?",to:["year_sign","year","month","date"]},{src:"(\\d{1,2})[-.\\/]({month})[-.\\/]?(\\d{2,4})?",to:["month","date","year"],h:j},{src:"\\/Date\\((\\d+(?:\\+\\d{4})?)\\)\\/",to:["timestamp"],s:k}],G=[{b:"f{1,4}|ms|milliseconds",
format:function(a){return a.getMilliseconds()}},{b:"ss?|seconds",format:function(a){return a.getSeconds()}},{b:"mm?|minutes",format:function(a){return a.getMinutes()}},{b:"hh?|hours|12hr",format:function(a){a=a.getHours(void 0);return a===0?12:a-(a/13|0)*12}},{b:"HH?|24hr",format:function(a){return a.getHours()}},{b:"dd?|date|day",format:function(a){return a.getDate()}},{b:"dow|weekday",i:j,format:function(a,b,d){return b.weekdays[a.getDay()+(d-1)*7]}},{b:"MM?",format:function(a){return a.getMonth()+
1}},{b:"mon|month",i:j,format:function(a,b,d){return b.months[a.getMonth()+(d-1)*12]}},{b:"y{2,4}|year",format:function(a){return a.getFullYear()}},{b:"[Tt]{1,2}",format:function(a,b,d,e){a=a.getHours(void 0)<12?"am":"pm";if(e.length===1)a=a.first();if(e.first()==="T")a=a.toUpperCase();return a}},{b:"z{1,4}|tz|timezone",text:j,format:function(a,b,d,e){a=a.getUTCOffset();if(e=="z"||e=="zz")a=a.replace(/(\d{2})(\d{2})/,function(g,f){return f.toNumber().pad(e.length)});return a}},{b:"iso(tz|timezone)",
format:function(a){return a.getUTCOffset(j)}},{b:"ord",format:function(a){return a.getDate().ordinalize()}}],I=[{a:"year",method:"FullYear",c:function(a){return(365+(a?a.isLeapYear()?1:0:0.25))*24*60*60*1E3}},{a:"month",method:"Month",c:function(a,b){var d=30.4375,e;if(a){e=a.daysInMonth();if(b<=e.days())d=e}return d*24*60*60*1E3}},{a:"week",method:"Week",c:o(6048E5)},{a:"day",method:"Date",c:o(864E5)},{a:"hour",method:"Hours",c:o(36E5)},{a:"minute",method:"Minutes",c:o(6E4)},{a:"second",method:"Seconds",
c:o(1E3)},{a:"millisecond",method:"Milliseconds",c:o(1)}],J={},K={en:"2;;January,February,March,April,May,June,July,August,September,October,November,December;Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday;millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s;one,two,three,four,five,six,seven,eight,nine,ten;a,an,the;the,st|nd|rd|th,of;{num} {unit} {sign},{num} {unit=4-5} {sign} {day},{weekday?} {month} {date}{1} {year?} {time?},{date} {month} {year},{month} {year},{shift?} {weekday} {time?},{shift} week {weekday} {time?},{shift} {unit=5-7},{0} {edge} of {shift?} {unit=4-7?}{month?}{year?},{weekday} {2} {shift} week,{0} {date}{1} of {month},{0}{month?} {date?}{1} of {shift} {unit=6-7},{day} at {time?},{time} {day};{Month} {d}, {yyyy};,yesterday,today,tomorrow;,ago|before,,from now|after|from;,last,the|this,next;last day,end,,first day|beginning",
ja:"1;\u6708;;\u65e5\u66dc\u65e5,\u6708\u66dc\u65e5,\u706b\u66dc\u65e5,\u6c34\u66dc\u65e5,\u6728\u66dc\u65e5,\u91d1\u66dc\u65e5,\u571f\u66dc\u65e5;\u30df\u30ea\u79d2,\u79d2,\u5206,\u6642\u9593,\u65e5,\u9031\u9593|\u9031,\u30f6\u6708|\u30f5\u6708|\u6708,\u5e74;;;;{num}{unit}{sign},{shift}{unit=5-7}{weekday?},{year}\u5e74{month?}\u6708?{date?}\u65e5?,{month}\u6708{date?}\u65e5?,{date}\u65e5;{yyyy}\u5e74{M}\u6708{d}\u65e5;\u4e00\u6628\u65e5,\u6628\u65e5,\u4eca\u65e5,\u660e\u65e5,\u660e\u5f8c\u65e5;,\u524d,,\u5f8c;,\u53bb|\u5148,,\u6765",
ko:"1;\uc6d4;;\uc77c\uc694\uc77c,\uc6d4\uc694\uc77c,\ud654\uc694\uc77c,\uc218\uc694\uc77c,\ubaa9\uc694\uc77c,\uae08\uc694\uc77c,\ud1a0\uc694\uc77c;\ubc00\ub9ac\ucd08,\ucd08,\ubd84,\uc2dc\uac04,\uc77c,\uc8fc,\uac1c\uc6d4|\ub2ec,\ub144;\uc77c|\ud55c,\uc774,\uc0bc,\uc0ac,\uc624,\uc721,\uce60,\ud314,\uad6c,\uc2ed;;;{num}{unit} {sign},{shift} {unit=5-7},{shift} {unit=5?} {weekday},{year}\ub144{month?}\uc6d4?{date?}\uc77c?,{month}\uc6d4{date?}\uc77c?,{date}\uc77c;{yyyy}\ub144{M}\uc6d4{d}\uc77c;\uadf8\uc800\uaed8,\uc5b4\uc81c,\uc624\ub298,\ub0b4\uc77c,\ubaa8\ub808;,\uc804,,\ud6c4;,\uc9c0\ub09c|\uc791,\uc774\ubc88,\ub2e4\uc74c|\ub0b4",
ru:"4;;\u042f\u043d\u0432\u0430\u0440:\u044f|\u044c,\u0424\u0435\u0432\u0440\u0430\u043b:\u044f|\u044c,\u041c\u0430\u0440\u0442:\u0430|,\u0410\u043f\u0440\u0435\u043b:\u044f|\u044c,\u041c\u0430:\u044f|\u0439,\u0418\u044e\u043d:\u044f|\u044c,\u0418\u044e\u043b:\u044f|\u044c,\u0410\u0432\u0433\u0443\u0441\u0442:\u0430|,\u0421\u0435\u043d\u0442\u044f\u0431\u0440:\u044f|\u044c,\u041e\u043a\u0442\u044f\u0431\u0440:\u044f|\u044c,\u041d\u043e\u044f\u0431\u0440:\u044f|\u044c,\u0414\u0435\u043a\u0430\u0431\u0440:\u044f|\u044c;\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435,\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a,\u0412\u0442\u043e\u0440\u043d\u0438\u043a,\u0421\u0440\u0435\u0434\u0430,\u0427\u0435\u0442\u0432\u0435\u0440\u0433,\u041f\u044f\u0442\u043d\u0438\u0446\u0430,\u0421\u0443\u0431\u0431\u043e\u0442\u0430;\u043c\u0438\u043b\u043b\u0438\u0441\u0435\u043a\u0443\u043d\u0434:\u0430|\u0443|\u044b|,\u0441\u0435\u043a\u0443\u043d\u0434:\u0430|\u0443|\u044b|,\u043c\u0438\u043d\u0443\u0442:\u0430|\u0443|\u044b|,\u0447\u0430\u0441:||\u0430|\u043e\u0432,\u0434\u0435\u043d\u044c|\u0434\u0435\u043d\u044c|\u0434\u043d\u044f|\u0434\u043d\u0435\u0439,\u043d\u0435\u0434\u0435\u043b:\u044f|\u044e|\u0438|\u044c|\u0435,\u043c\u0435\u0441\u044f\u0446:||\u0430|\u0435\u0432|\u0435,\u0433\u043e\u0434|\u0433\u043e\u0434|\u0433\u043e\u0434\u0430|\u043b\u0435\u0442|\u0433\u043e\u0434\u0443;\u043e\u0434:\u0438\u043d|\u043d\u0443,\u0434\u0432:\u0430|\u0435,\u0442\u0440\u0438,\u0447\u0435\u0442\u044b\u0440\u0435,\u043f\u044f\u0442\u044c,\u0448\u0435\u0441\u0442\u044c,\u0441\u0435\u043c\u044c,\u0432\u043e\u0441\u0435\u043c\u044c,\u0434\u0435\u0432\u044f\u0442\u044c,\u0434\u0435\u0441\u044f\u0442\u044c;;\u0432|\u043d\u0430,\u0433\u043e\u0434\u0430;{num} {unit} {sign},{sign} {num} {unit},{date} {month} {year?} {1},{month} {year},{0} {shift} {unit=5-7};{d} {month} {yyyy} \u0433\u043e\u0434\u0430;\u043f\u043e\u0437\u0430\u0432\u0447\u0435\u0440\u0430,\u0432\u0447\u0435\u0440\u0430,\u0441\u0435\u0433\u043e\u0434\u043d\u044f,\u0437\u0430\u0432\u0442\u0440\u0430,\u043f\u043e\u0441\u043b\u0435\u0437\u0430\u0432\u0442\u0440\u0430;,\u043d\u0430\u0437\u0430\u0434,,\u0447\u0435\u0440\u0435\u0437;,\u043f\u0440\u043e\u0448\u043b\u043e:\u0439|\u043c,,\u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435:\u0439|\u043c",
es:"6;;enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre;domingo,lunes,martes,mi\u00e9rcoles|miercoles,jueves,viernes,s\u00e1bado|sabado;milisegundo:|s,segundo:|s,minuto:|s,hora:|s,d\u00eda|d\u00edas|dia|dias,semana:|s,mes:|es,a\u00f1o|a\u00f1os|ano|anos;uno,dos,tres,cuatro,cinco,seis,siete,ocho,nueve,diez;;el,de;{sign} {num} {unit},{num} {unit} {sign},{date?} {1} {month} {1} {year?},{0} {unit=5-7} {shift},{0} {shift} {unit=5-7};{d} de {month} de {yyyy};anteayer,ayer,hoy,ma\u00f1ana|manana;,hace,,de ahora;,pasad:o|a,,pr\u00f3ximo|pr\u00f3xima|proximo|proxima",
pt:"6;;janeiro,fevereiro,mar\u00e7o,abril,maio,junho,julho,agosto,setembro,outubro,novembro,dezembro;domingo,segunda-feira,ter\u00e7a-feira,quarta-feira,quinta-feira,sexta-feira,s\u00e1bado|sabado;milisegundo:|s,segundo:|s,minuto:|s,hora:|s,dia:|s,semana:|s,m\u00eas|m\u00eases|mes|meses,ano:|s;um,dois,tr\u00eas|tres,quatro,cinco,seis,sete,oito,nove,dez,uma,duas;;a,de;{num} {unit} {sign},{sign} {num} {unit},{date?} {1} {month} {1} {year?},{0} {unit=5-7} {shift},{0} {shift} {unit=5-7};{d} de {month} de {yyyy};anteontem,ontem,hoje,amanh:\u00e3|a;,atr\u00e1s|atras|h\u00e1|ha,,daqui a;,passad:o|a,,pr\u00f3ximo|pr\u00f3xima|proximo|proxima",
fr:"2;;janvier,f\u00e9vrier|fevrier,mars,avril,mai,juin,juillet,ao\u00fbt,septembre,octobre,novembre,d\u00e9cembre|decembre;dimanche,lundi,mardi,mercredi,jeudi,vendredi,samedi;milliseconde:|s,seconde:|s,minute:|s,heure:|s,jour:|s,semaine:|s,mois,an:|s|n\u00e9e|nee;un:|e,deux,trois,quatre,cinq,six,sept,huit,neuf,dix;;l'|la|le;{sign} {num} {unit},{sign} {num} {unit},{0} {date?} {month} {year?},{0} {unit=5-7} {shift};{d} {month} {yyyy};,hier,aujourd'hui,demain;,il y a,,dans|d'ici;,derni:er|\u00e8re|ere,,prochain:|e",
it:"2;;Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre;Domenica,Luned:\u00ec|i,Marted:\u00ec|i,Mercoled:\u00ec|i,Gioved:\u00ec|i,Venerd:\u00ec|i,Sabato;millisecond:o|i,second:o|i,minut:o|i,or:a|e,giorn:o|i,settiman:a|e,mes:e|i,ann:o|i;un:|'|a|o,due,tre,quattro,cinque,sei,sette,otto,nove,dieci;;l'|la|il;{num} {unit} {sign},{weekday?} {date?} {month} {year?},{0} {unit=5-7} {shift},{0} {shift} {unit=5-7};{d} {month} {yyyy};,ieri,oggi,domani,dopodomani;,fa,,da adesso;,scors:o|a,,prossim:o|a",
de:"2;;Januar,Februar,M\u00e4rz|Marz,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember;Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag;Millisekunde:|n,Sekunde:|n,Minute:|n,Stunde:|n,Tag:|en,Woche:|n,Monat:|en,Jahr:|en;ein:|e|er|em|en,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn;;der;{sign} {num} {unit},{num} {unit} {sign},{num} {unit} {sign},{sign} {num} {unit},{weekday?} {date?} {month} {year?},{shift} {unit=5-7};{d}. {Month} {yyyy};vorgestern,gestern,heute,morgen,\u00fcbermorgen|ubermorgen|uebermorgen;,vor:|her,,in;,letzte:|r|n|s,,n\u00e4chste:|r|n|s+naechste:|r|n|s",
"zh-TW":"1;\u6708;;\u65e5,\u4e00,\u4e8c,\u4e09,\u56db,\u4e94,\u516d;\u6beb\u79d2,\u79d2\u9418,\u5206\u9418,\u5c0f\u6642,\u5929,\u500b\u661f\u671f|\u9031,\u500b\u6708,\u5e74;;;\u65e5|\u865f;{num}{unit}{sign},\u661f\u671f{weekday},{shift}{unit=5-7},{shift}{unit=5}{weekday},{year}\u5e74{month?}\u6708?{date?}{0},{month}\u6708{date?}{0},{date}{0};{yyyy}\u5e74{M}\u6708{d}\u65e5;\u524d\u5929,\u6628\u5929,\u4eca\u5929,\u660e\u5929,\u5f8c\u5929;,\u524d,,\u5f8c;,\u4e0a|\u53bb,\u9019,\u4e0b|\u660e","zh-CN":"1;\u6708;;\u65e5,\u4e00,\u4e8c,\u4e09,\u56db,\u4e94,\u516d;\u6beb\u79d2,\u79d2\u949f,\u5206\u949f,\u5c0f\u65f6,\u5929,\u4e2a\u661f\u671f|\u5468,\u4e2a\u6708,\u5e74;;;\u65e5|\u53f7;{num}{unit}{sign},\u661f\u671f{weekday},{shift}{unit=5-7},{shift}{unit=5}{weekday},{year}\u5e74{month?}\u6708?{date?}{0},{month}\u6708{date?}{0},{date}{0};{yyyy}\u5e74{M}\u6708{d}\u65e5;\u524d\u5929,\u6628\u5929,\u4eca\u5929,\u660e\u5929,\u540e\u5929;,\u524d,,\u540e;,\u4e0a|\u53bb,\u8fd9,\u4e0b|\u660e"};
function L(a){var b=a.code;if(!a.m){M("("+a.months.compact().join("|")+")",["month"],b);M("("+a.weekdays.compact().join("|")+")",["weekday"],b);M("("+a.modifiers.filter(function(d){return d.name==="day"}).map("src").join("|")+")",["day"],b);a.formats.each(function(d){a.addFormat(d,b,k)});a.m=j}}function M(a,b,d,e,g){g=g||"push";C[g]({h:e,p:d,q:p("^"+a+"$","i"),to:b})}function N(a,b,d){if(b&&(!q.isString(a)||!a))a=Date.currentLocale;if(a&&!J[a]||d)O(a,d);return J[a]}
function O(a,b){function d(f,h){f=f.split("+").map(function(c){return c.replace(/(.+):(.+)$/,function(i,m,l){return l.split("|").map(function(n){return m+n}).join("|")})}).join("|");return f.split("|").each(h)}function e(f,h,c){var i=[];if(b[f]){b[f].forEach(function(m,l){d(m,function(n,r){i[r*c+l]=n.toLowerCase()})});if(h)i=i.concat(b[f].map(function(m){return m.slice(0,3).toLowerCase()}));return b[f]=i}}function g(f,h){var c="[0-9\uff10-\uff19]"+(f?"{"+f+","+h+"}":"+");if(b.digits)c+="|["+b.digits+
"]+";return c}b=b||P(a);if(!b)throw Error("Invalid locale.");e("months",j,12);e("weekdays",j,7);e("units",k,8);e("numbers",k,10);b.code=a;b.date=g(1,2);b.year=g(4,4);b.num=function(){var f=[g()].concat(b.articles);b.digits||(f=f.concat(b.numbers));return f.compact().join("|")}();(function(){var f=[];b.f={};b.modifiers.each(function(h){d(h.src,function(c){b.f[c]=h;f.push({name:h.name,src:c,value:h.value})})});f.groupBy("name",function(h,c){c=c.map("src");if(h==="day")c=c.concat(b.weekdays);b[h]=c.join("|")});
b.modifiers=f})();if(b.monthSuffix){b.month=g(1,2);b.months=(1).upto(12).map(function(f){return f+b.monthSuffix})}J[a]=new Q(b)}
function P(a){function b(g){return!!(e[0]&Math.pow(2,g-1))}if(a.slice(0,3)=="en-")a="en";if(!K[a])return null;var d={modifiers:[]},e=K[a].split(";");["months","weekdays","units","numbers","articles","optionals","formats"].each(function(g,f){d[g]=e[f+2]?e[f+2].split(","):[]});d.outputFormat=e[9];["day","sign","shift","edge"].each(function(g,f){e[f+10]&&e[f+10].split(",").each(function(h,c){h&&d.modifiers.push({name:g,src:h,value:c-2})})});if(b(1)){d.digits=x+y;if(d.numbers.length>0)d.digits+=d.numbers.join("");
else d.numbers=x.split("");d.monthSuffix=e[1]}d.capitalizeUnit=a=="de";d.hasPlural=b(2);d.pastRelativeFormat=d.formats[0];d.futureRelativeFormat=d.formats[b(3)?1:0];d.durationFormat=d.formats[0].replace(/\s*\{sign\}\s*/,"");return d}function R(a){a||(a=Date.currentLocale);return a!="en"&&a!="en-US"}function Q(a){q.merge(this,a)}
q.merge(Q.prototype,{getMonth:function(a){return q.isNumber(a)?a-1:this.months.findIndex(p(a,"i"))%12},l:function(a){return this.weekdays.findIndex(p(a,"i"))%7},k:function(a){var b;return q.isNumber(a)?a:a&&(b=this.numbers.indexOf(a))!==-1?(b+1)%10:1},o:function(a){var b=this;return a.replace(this.numbers[9],"").each(function(d){return b.k(d)}).join("")},n:function(a){return u.units[this.units.indexOf(a)%8]},r:function(a){return this.j(a,a[2]>0?"futureRelativeFormat":"pastRelativeFormat")},duration:function(a){return this.j(T(a),
"durationFormat")},j:function(a,b){var d=a[0],e=a[1],g=a[2],f;if(this.code=="ru"){f=d.toString().from(-1);switch(j){case f==1:f=1;break;case f>=2&&f<=4:f=2;break;default:f=3}}else f=this.hasPlural&&d>1?1:0;f=this.units[f*8+e]||this.units[e];if(this.capitalizeUnit)f=f.capitalize();e=this.modifiers.find(function(h){return h.name=="sign"&&h.value==(g>0?1:-1)});return this[b].assign({num:d,unit:f,sign:e.src})},addFormat:function(a,b,d){var e=[],g=this;d!==k&&g.u.push(a);a=a.replace(/\s+/g,"[-,. ]*");
a=a.replace(/\{(.+?)\}/g,function(f,h){var c=h.match(/\?$/),i=h.match(/(\d)(?:-(\d))?/),m=h.match(/^\d+$/),l=h.replace(/[^a-z]+$/,""),n,r;if(l==="time"){e=e.concat(w);return c?"\\s*(?:(?:t|at |\\s+)(\\d{1,2}(?:[,.]\\d+)?):?(\\d{1,2}(?:[,.]\\d+)?)?:?(\\d{1,2}(?:[,.]\\d+)?)?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?)?":"(\\d{1,2}(?:[,.]\\d+)?):?(\\d{1,2}(?:[,.]\\d+)?)?:?(\\d{1,2}(?:[,.]\\d+)?)?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?"}if(m)n=g.optionals[m[0]];else if(g[l])n=g[l];
else if(g[l+"s"]){n=g[l+"s"];if(i){r=[];n.forEach(function(z,H){var A=H%(g.units?8:n.length);if(A>=i[1]&&A<=(i[2]||i[1]))r.push(z)});n=r}n=n.compact().join("|")}if(m)return"(?:"+n+")?";else{e.push(l);return"("+n+")"+(c?"?":"")}});M(a,e,b)}});function U(a){var b;if(q.isObject(a[0]))return a;else if(a.length==1&&q.isNumber(a[0]))return[a[0]];b={};D.each(function(d,e){b[d.a]=a[e]});return[b]}
function aa(a,b){if(b!="date"&&b!="month"&&b!="year")return a;return a.replace(B,function(d){return x.indexOf(d)+1||""})}function ba(a,b){var d={},e,g;b.each(function(f,h){e=a[h+1];if(!(e===void 0||e==="")){e=aa(e.hankaku("n"),f);if(f==="year")d.t=e;g=parseFloat(e.replace(/,/,"."));d[f]=!isNaN(g)?g:e.toLowerCase()}});return d}
function V(a,b){var d=new s,e=k,g,f,h,c,i,m,l;if(q.isDate(a))d=a;else if(q.isNumber(a))d=new s(a);else if(q.isObject(a)){d=(new s).set(a,j);c=a}else if(q.isString(a)){L(N(b,j));f=R(b);a=a.trim().replace(/\.+$/,"").replace(/^now$/,"");C.each(function(n){var r=a.match(n.q);if(r){h=n;c=ba(r,h.to);g=N(h.p,j);if(c.timestamp){d.setTime(0);c={milliseconds:c.timestamp};return k}if(h.h&&!q.isString(c.month)&&(q.isString(c.date)||f)){l=c.month;c.month=c.date;c.date=l}if(c.year&&c.t.length===2)c.year=((new s).getFullYear()/
100).round()*100-(c.year/100).round()*100+c.year;if(c.month){c.month=g.getMonth(c.month);if(c.shift&&!c.unit)c.unit="year"}if(c.weekday&&c.date)delete c.weekday;else if(c.weekday){c.weekday=g.l(c.weekday);if(c.shift&&!c.unit)c.unit="week"}if(c.day&&(l=g.f[c.day])){c.day=l.value;d.resetTime();e=j}else if(c.day&&(l=g.l(c.day))>-1){delete c.day;c.weekday=l}if(c.date&&!q.isNumber(c.date))c.date=g.o(c.date);if(c.meridian)if(c.meridian==="pm"&&c.hour<12)c.hour+=12;if("offset_hours"in c||"offset_minutes"in
c){c.utc=j;c.offset_minutes=c.offset_minutes||0;c.offset_minutes+=c.offset_hours*60;if(c.offset_sign==="-")c.offset_minutes*=-1;c.minute-=c.offset_minutes}if(c.unit){e=j;m=g.k(c.num);i=g.n(c.unit);if(c.shift||c.edge){m*=(l=g.f[c.shift])?l.value:0;if(i==="month"&&v(c.date)){d.set({day:c.date},j);delete c.date}if(i==="year"&&v(c.month)){d.set({month:c.month,day:c.date},j);delete c.month;delete c.date}}if(c.sign&&(l=g.f[c.sign]))m*=l.value;if(v(c.weekday)){d.set({weekday:c.weekday},j);delete c.weekday}c[i]=
(c[i]||0)+m}if(c.year_sign==="-")c.year*=-1;E.slice(1,4).each(function(z,H){var A=c[z.a],S=A%1;if(S){c[E[H].a]=(S*(z.a==="second"?1E3:60)).round();c[z.a]=A|0}});return k}});if(h)if(e)d.advance(c);else if(c.utc){d.resetTime();d.setUTC(c,j)}else d.set(c,j);else d=a?new s(a):new s;if(c&&c.edge){l=g.f[c.edge];E.slice(4).each(function(n){if(v(c[n.a])){i=n.a;return k}});if(i==="year")c.d="month";else if(i==="month"||i==="week")c.d="day";d[(l.value<0?"endOf":"beginningOf")+i.capitalize()]();l.value===-2&&
d.resetTime()}}return{e:d,set:c}}
function W(a,b,d,e){var g,f=N(e,j),h=p(/^[A-Z]/);if(a.isValid())if(Date[b])b=Date[b];else{if(q.isFunction(b)){g=T(a.millisecondsFromNow());b=b.apply(a,g.concat(f))}}else return"Invalid Date";if(!b&&!d)b=f.outputFormat;else if(!b&&d){g=g||T(a.millisecondsFromNow());if(g[1]===0){g[1]=1;g[0]=1}return f.r(g)}G.each(function(c){b=b.replace(p("\\{("+c.b+")(\\d)?\\}",c.i?"i":""),function(i,m,l){i=c.format(a,f,l||1,m);l=m.length;var n=m.match(/^(.)\1+$/);if(c.i){if(l===3)i=i.to(3);if(n||m.match(h))i=i.capitalize()}else if(n&&
!c.text)i=(q.isNumber(i)?i.pad(l):i.toString()).last(l);return i})});return b}function ca(a,b,d){var e=V(b),g=0,f=b=0,h;if(d>0){b=f=d;h=j}if(!e.e.isValid())return k;if(e.set&&e.set.d){I.each(function(i){if(i.a===e.set.d)g=i.c(e.e,a-e.e)-1});if(e.set.edge||e.set.shift)e.e["beginningOf"+e.set.d.capitalize()]();if(!h&&e.set.sign&&e.set.d!="millisecond"){b=50;f=-50}}d=a.getTime();h=e.e.getTime();var c=h+g;if(e.set&&e.set.d=="week"&&(new Date(c+1)).getHours()!=0)c+=s.DSTOffset;return d>=h-b&&d<=c+f}
function X(a,b,d,e,g){if(q.isNumber(b)&&g)b={milliseconds:b};else if(q.isNumber(b)){a.setTime(b);return a}if(b.date)b.day=b.date;if(!g&&b.day===void 0&&v(b.weekday)){a["set"+(e?"UTC":"")+"Weekday"](b.weekday);b.day=a["get"+(e?"UTC":"")+"Date"](void 0);delete b.weekday}E.each(function(f){if(v(b[f.a])||v(b[f.a+"s"])){b.d=f.a;return k}else if(d&&f.a!=="week"&&f.a!=="year")a["set"+(e?"UTC":"")+f.method](f.a==="day"?1:0)});I.each(function(f){var h=f.a;f=f.method;var c=v(b[h])?b[h]:b[h+"s"];if(c!==void 0){if(g){if(h===
"week"){c=(b.day||0)+c*7;f="Date"}c=c*g+a["get"+f](void 0)}a["set"+(e?"UTC":"")+f](c);if(h==="month"){h=c;if(h<0)h+=12;h%12!=a.getMonth()&&a.setDate(0)}}});return a}function Y(a){a.addDays(4-(a.getDay()||7)).resetTime();return 1+(a.daysSince(a.clone().beginningOfYear())/7|0)}function T(a){var b,d=a.abs(),e=d,g=0;E.from(1).each(function(f,h){b=(d/f.c()*10).round()/10|0;if(b>=1){e=b;g=h+1}});return[e,g,a]}function Z(a){var b;b=q.isNumber(a[1])?U(a)[0]:a[0];return V(b,a[1]).e}
function da(a,b){function d(){return(this*b).round()}function e(){return Z(arguments)[f](this)}function g(){return Z(arguments)[f](-this)}var f="add"+a.capitalize()+"s",h={};h[a]=d;h[a+"s"]=d;h[a+"Before"]=g;h[a+"sBefore"]=g;h[a+"Ago"]=g;h[a+"sAgo"]=g;h[a+"After"]=e;h[a+"sAfter"]=e;h[a+"FromNow"]=e;h[a+"sFromNow"]=e;t.extend(h)}
function $(a){var b=new s(s.UTC(1999,11,31)),d={};if(!b[a]||b[a]()!=="1999-12-31T00:00:00.000Z"){d[a]=function(){return W(this.toUTC(),s.ISO8601_DATETIME)};s.extend(d,j)}}s.extend({create:function(){return Z(arguments)},now:function(){return(new s).getTime()},setLocale:function(a,b){var d=N(a,k,b);if(d){Date.currentLocale=a;L(d);return d}},getLocale:function(a){return N(a,j)},addFormat:function(a,b,d,e){M(a,b,d,e,"unshift")}},k,k);
s.extend({set:function(){var a=U(arguments);return X(this,a[0],a[1])},setUTC:function(){var a=U(arguments);return X(this,a[0],a[1],j)},setWeekday:function(a){a===void 0||this.setDate(this.getDate()+a-this.getDay())},setUTCWeekday:function(a){a===void 0||this.setDate(this.getUTCDate()+a-this.getDay())},setWeek:function(a){if(a!==void 0){this.setMonth(0);this.setDate(a*7+1)}},setUTCWeek:function(a){if(a!==void 0){this.setMonth(0);this.setUTCDate(a*7+1)}},getWeek:function(){return Y(this)},getUTCWeek:function(){return Y(this.toUTC())},
getUTCOffset:function(a){var b=this.g?0:this.getTimezoneOffset(),d=a===j?":":"";if(!b&&a)return"Z";return(-b/60).round().pad(2,j)+d+(b%60).pad(2)},toUTC:function(){if(this.g)return this;var a=this.clone().addMinutes(this.getTimezoneOffset());a.g=j;return a},isUTC:function(){return this.g||this.getTimezoneOffset()===0},advance:function(){var a=U(arguments);return X(this,a[0],k,k,1,j)},rewind:function(){var a=U(arguments);return X(this,a[0],k,k,-1)},isValid:function(){return!isNaN(this.getTime())},
isAfter:function(a,b){return this.getTime()>s.create(a).getTime()-(b||0)},isBefore:function(a,b){return this.getTime()<s.create(a).getTime()+(b||0)},isBetween:function(a,b,d){var e=this.getTime();a=s.create(a).getTime();var g=s.create(b).getTime();b=Math.min(a,g);a=Math.max(a,g);d=d||0;return b-d<e&&a+d>e},isLeapYear:function(){var a=this.getFullYear();return a%4===0&&a%100!==0||a%400===0},daysInMonth:function(){return 32-(new s(this.getFullYear(),this.getMonth(),32)).getDate()},format:function(a,
b){return W(this,a,k,b)},relative:function(a,b){if(q.isString(a)){b=a;a=null}return W(this,a,j,b)},is:function(a,b){var d;if(q.isString(a)){a=a.trim().toLowerCase();switch(j){case a==="future":return this.getTime()>(new s).getTime();case a==="past":return this.getTime()<(new s).getTime();case a==="weekday":return this.getDay()>0&&this.getDay()<6;case a==="weekend":return this.getDay()===0||this.getDay()===6;case (d=u.weekdays.indexOf(a)%7)>-1:return this.getDay()===d;case (d=u.months.indexOf(a)%12)>
-1:return this.getMonth()===d}}return ca(this,a,b)},resetTime:function(){return this.set({hour:0,minute:0,second:0,millisecond:0})},clone:function(){return new s(this.getTime())}});s.extend({iso:function(){return this.toISOString()},getWeekday:s.prototype.getDay,getUTCWeekday:s.prototype.getUTCDay});t.extend({duration:function(a){return Date.getLocale(a).duration(this)}});u=s.setLocale("en");
(function(){var a={};I.each(function(b,d){function e(i,m){return((s.create(i,m).getTime()-this.getTime())/c).round()}function g(i,m){return((this.getTime()-s.create(i,m).getTime())/c).round()}var f=b.a,h=f.capitalize(),c=b.c();a[f+"sAgo"]=e;a[f+"sUntil"]=e;a[f+"sSince"]=g;a[f+"sFromNow"]=g;a["add"+h+"s"]=function(i){var m={};m[f]=i;return this.advance(m)};da(f,c);d<3&&["Last","This","Next"].each(function(i){a["is"+i+h]=function(){return this.is(i+" "+f)}});if(d<4){a["beginningOf"+h]=function(){var i=
{};switch(f){case "year":i.year=this.getFullYear();break;case "month":i.month=this.getMonth();break;case "day":i.day=this.getDate();break;case "week":i.weekday=0}return this.set(i,j)};a["endOf"+h]=function(){var i={hours:23,minutes:59,seconds:59,milliseconds:999};switch(f){case "year":i.month=11;i.day=31;break;case "month":i.day=this.daysInMonth();break;case "week":i.weekday=6}return this.set(i,j)}}});s.extend(a)})();
(function(){D=I.clone().removeAt(2);E=I.clone().reverse();var a="\\d{1,2}|"+u.months.join("|");F.each(function(b){M(b.src.replace(/\{month\}/,a)+(b.s===k?"":"\\s*(?:(?:t|at |\\s+)(\\d{1,2}(?:[,.]\\d+)?):?(\\d{1,2}(?:[,.]\\d+)?)?:?(\\d{1,2}(?:[,.]\\d+)?)?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?)?"),b.to.concat(w),"en",b.h)});M("(\\d{1,2}(?:[,.]\\d+)?):?(\\d{1,2}(?:[,.]\\d+)?)?:?(\\d{1,2}(?:[,.]\\d+)?)?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?",w)})();
(function(){var a={},b=u.weekdays.slice(0,7),d=u.months.slice(0,12);["today","yesterday","tomorrow","weekday","weekend","future","past"].concat(b).concat(d).each(function(e){a["is"+e.capitalize()]=function(){return this.is(e)}});s.extend(a)})();$("toISOString");$("toJSON");
s.extend({DSTOffset:((new s(2E3,6,1)).getTimezoneOffset()-(new s(2E3,0,1)).getTimezoneOffset())*60*1E3,INTERNATIONAL_TIME:"{h}:{mm}:{ss}",RFC1123:"{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}",RFC1036:"{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}",ISO8601_DATE:"{yyyy}-{MM}-{dd}",ISO8601_DATETIME:"{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}"},k,k);})(this);
