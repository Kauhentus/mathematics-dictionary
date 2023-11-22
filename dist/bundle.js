/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/elasticlunr/elasticlunr.js":
/*!*************************************************!*\
  !*** ./node_modules/elasticlunr/elasticlunr.js ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * elasticlunr - http://weixsong.github.io
 * Lightweight full-text search engine in Javascript for browser search and offline search. - 0.9.5
 *
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 * MIT Licensed
 * @license
 */

(function(){

/*!
 * elasticlunr.js
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * Convenience function for instantiating a new elasticlunr index and configuring it
 * with the default pipeline functions and the passed config function.
 *
 * When using this convenience function a new index will be created with the
 * following functions already in the pipeline:
 * 
 * 1. elasticlunr.trimmer - trim non-word character
 * 2. elasticlunr.StopWordFilter - filters out any stop words before they enter the
 * index
 * 3. elasticlunr.stemmer - stems the tokens before entering the index.
 *
 *
 * Example:
 *
 *     var idx = elasticlunr(function () {
 *       this.addField('id');
 *       this.addField('title');
 *       this.addField('body');
 *       
 *       //this.setRef('id'); // default ref is 'id'
 *
 *       this.pipeline.add(function () {
 *         // some custom pipeline function
 *       });
 *     });
 * 
 *    idx.addDoc({
 *      id: 1, 
 *      title: 'Oracle released database 12g',
 *      body: 'Yestaday, Oracle has released their latest database, named 12g, more robust. this product will increase Oracle profit.'
 *    });
 * 
 *    idx.addDoc({
 *      id: 2, 
 *      title: 'Oracle released annual profit report',
 *      body: 'Yestaday, Oracle has released their annual profit report of 2015, total profit is 12.5 Billion.'
 *    });
 * 
 *    # simple search
 *    idx.search('oracle database');
 * 
 *    # search with query-time boosting
 *    idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
 *
 * @param {Function} config A function that will be called with the new instance
 * of the elasticlunr.Index as both its context and first parameter. It can be used to
 * customize the instance of new elasticlunr.Index.
 * @namespace
 * @module
 * @return {elasticlunr.Index}
 *
 */
var elasticlunr = function (config) {
  var idx = new elasticlunr.Index;

  idx.pipeline.add(
    elasticlunr.trimmer,
    elasticlunr.stopWordFilter,
    elasticlunr.stemmer
  );

  if (config) config.call(idx, idx);

  return idx;
};

elasticlunr.version = "0.9.5";

// only used this to make elasticlunr.js compatible with lunr-languages
// this is a trick to define a global alias of elasticlunr
lunr = elasticlunr;

/*!
 * elasticlunr.utils
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * A namespace containing utils for the rest of the elasticlunr library
 */
elasticlunr.utils = {};

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
elasticlunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message);
    }
  };
})(this);

/**
 * Convert an object to string.
 *
 * In the case of `null` and `undefined` the function returns
 * an empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {object} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf Utils
 */
elasticlunr.utils.toString = function (obj) {
  if (obj === void 0 || obj === null) {
    return "";
  }

  return obj.toString();
};
/*!
 * elasticlunr.EventEmitter
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.EventEmitter is an event emitter for elasticlunr.
 * It manages adding and removing event handlers and triggering events and their handlers.
 *
 * Each event could has multiple corresponding functions,
 * these functions will be called as the sequence that they are added into the event.
 * 
 * @constructor
 */
elasticlunr.EventEmitter = function () {
  this.events = {};
};

/**
 * Binds a handler function to a specific event(s).
 *
 * Can bind a single function to many different events in one call.
 *
 * @param {String} [eventName] The name(s) of events to bind this function to.
 * @param {Function} fn The function to call when an event is fired.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.addListener = function () {
  var args = Array.prototype.slice.call(arguments),
      fn = args.pop(),
      names = args;

  if (typeof fn !== "function") throw new TypeError ("last argument must be a function");

  names.forEach(function (name) {
    if (!this.hasHandler(name)) this.events[name] = [];
    this.events[name].push(fn);
  }, this);
};

/**
 * Removes a handler function from a specific event.
 *
 * @param {String} eventName The name of the event to remove this function from.
 * @param {Function} fn The function to remove from an event.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!this.hasHandler(name)) return;

  var fnIndex = this.events[name].indexOf(fn);
  if (fnIndex === -1) return;

  this.events[name].splice(fnIndex, 1);

  if (this.events[name].length == 0) delete this.events[name];
};

/**
 * Call all functions that bounded to the given event.
 *
 * Additional data can be passed to the event handler as arguments to `emit`
 * after the event name.
 *
 * @param {String} eventName The name of the event to emit.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.emit = function (name) {
  if (!this.hasHandler(name)) return;

  var args = Array.prototype.slice.call(arguments, 1);

  this.events[name].forEach(function (fn) {
    fn.apply(undefined, args);
  }, this);
};

/**
 * Checks whether a handler has ever been stored against an event.
 *
 * @param {String} eventName The name of the event to check.
 * @private
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.hasHandler = function (name) {
  return name in this.events;
};
/*!
 * elasticlunr.tokenizer
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * A function for splitting a string into tokens.
 * Currently English is supported as default.
 * Uses `elasticlunr.tokenizer.seperator` to split strings, you could change
 * the value of this property to set how you want strings are split into tokens.
 * IMPORTANT: use elasticlunr.tokenizer.seperator carefully, if you are not familiar with
 * text process, then you'd better not change it.
 *
 * @module
 * @param {String} str The string that you want to tokenize.
 * @see elasticlunr.tokenizer.seperator
 * @return {Array}
 */
elasticlunr.tokenizer = function (str) {
  if (!arguments.length || str === null || str === undefined) return [];
  if (Array.isArray(str)) {
    var arr = str.filter(function(token) {
      if (token === null || token === undefined) {
        return false;
      }

      return true;
    });

    arr = arr.map(function (t) {
      return elasticlunr.utils.toString(t).toLowerCase();
    });

    var out = [];
    arr.forEach(function(item) {
      var tokens = item.split(elasticlunr.tokenizer.seperator);
      out = out.concat(tokens);
    }, this);

    return out;
  }

  return str.toString().trim().toLowerCase().split(elasticlunr.tokenizer.seperator);
};

/**
 * Default string seperator.
 */
elasticlunr.tokenizer.defaultSeperator = /[\s\-]+/;

/**
 * The sperator used to split a string into tokens. Override this property to change the behaviour of
 * `elasticlunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see elasticlunr.tokenizer
 */
elasticlunr.tokenizer.seperator = elasticlunr.tokenizer.defaultSeperator;

/**
 * Set up customized string seperator
 *
 * @param {Object} sep The customized seperator that you want to use to tokenize a string.
 */
elasticlunr.tokenizer.setSeperator = function(sep) {
    if (sep !== null && sep !== undefined && typeof(sep) === 'object') {
        elasticlunr.tokenizer.seperator = sep;
    }
}

/**
 * Reset string seperator
 *
 */
elasticlunr.tokenizer.resetSeperator = function() {
    elasticlunr.tokenizer.seperator = elasticlunr.tokenizer.defaultSeperator;
}

/**
 * Get string seperator
 *
 */
elasticlunr.tokenizer.getSeperator = function() {
    return elasticlunr.tokenizer.seperator;
}
/*!
 * elasticlunr.Pipeline
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.Pipelines maintain an ordered list of functions to be applied to 
 * both documents tokens and query tokens.
 *
 * An instance of elasticlunr.Index will contain a pipeline
 * with a trimmer, a stop word filter, an English stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline, it will call each function in turn.
 *
 * The output of the functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with elasticlunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
elasticlunr.Pipeline = function () {
  this._queue = [];
};

elasticlunr.Pipeline.registeredFunctions = {};

/**
 * Register a function in the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {Function} fn The function to register.
 * @param {String} label The label to register this function with
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.registerFunction = function (fn, label) {
  if (label in elasticlunr.Pipeline.registeredFunctions) {
    elasticlunr.utils.warn('Overwriting existing registered function: ' + label);
  }

  fn.label = label;
  elasticlunr.Pipeline.registeredFunctions[label] = fn;
};

/**
 * Get a registered function in the pipeline.
 *
 * @param {String} label The label of registered function.
 * @return {Function}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.getRegisteredFunction = function (label) {
  if ((label in elasticlunr.Pipeline.registeredFunctions) !== true) {
    return null;
  }

  return elasticlunr.Pipeline.registeredFunctions[label];
};

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {Function} fn The function to check for.
 * @private
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions);

  if (!isRegistered) {
    elasticlunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn);
  }
};

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with elasticlunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised The serialised pipeline to load.
 * @return {elasticlunr.Pipeline}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.load = function (serialised) {
  var pipeline = new elasticlunr.Pipeline;

  serialised.forEach(function (fnName) {
    var fn = elasticlunr.Pipeline.getRegisteredFunction(fnName);

    if (fn) {
      pipeline.add(fn);
    } else {
      throw new Error('Cannot load un-registered function: ' + fnName);
    }
  });

  return pipeline;
};

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} functions Any number of functions to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments);

  fns.forEach(function (fn) {
    elasticlunr.Pipeline.warnIfFunctionNotRegistered(fn);
    this._queue.push(fn);
  }, this);
};

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 * If existingFn is not found, throw an Exception.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.after = function (existingFn, newFn) {
  elasticlunr.Pipeline.warnIfFunctionNotRegistered(newFn);

  var pos = this._queue.indexOf(existingFn);
  if (pos === -1) {
    throw new Error('Cannot find existingFn');
  }

  this._queue.splice(pos + 1, 0, newFn);
};

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 * If existingFn is not found, throw an Exception.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.before = function (existingFn, newFn) {
  elasticlunr.Pipeline.warnIfFunctionNotRegistered(newFn);

  var pos = this._queue.indexOf(existingFn);
  if (pos === -1) {
    throw new Error('Cannot find existingFn');
  }

  this._queue.splice(pos, 0, newFn);
};

/**
 * Removes a function from the pipeline.
 *
 * @param {Function} fn The function to remove from the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._queue.indexOf(fn);
  if (pos === -1) {
    return;
  }

  this._queue.splice(pos, 1);
};

/**
 * Runs the current list of functions that registered in the pipeline against the
 * input tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @return {Array}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.run = function (tokens) {
  var out = [],
      tokenLength = tokens.length,
      pipelineLength = this._queue.length;

  for (var i = 0; i < tokenLength; i++) {
    var token = tokens[i];

    for (var j = 0; j < pipelineLength; j++) {
      token = this._queue[j](token, i, tokens);
      if (token === void 0 || token === null) break;
    };

    if (token !== void 0 && token !== null) out.push(token);
  };

  return out;
};

/**
 * Resets the pipeline by removing any existing processors.
 *
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.reset = function () {
  this._queue = [];
};

 /**
  * Get the pipeline if user want to check the pipeline.
  *
  * @memberOf Pipeline
  */
 elasticlunr.Pipeline.prototype.get = function () {
   return this._queue;
 };

/**
 * Returns a representation of the pipeline ready for serialisation.
 * Only serialize pipeline function's name. Not storing function, so when
 * loading the archived JSON index file, corresponding pipeline function is 
 * added by registered function of elasticlunr.Pipeline.registeredFunctions
 *
 * Logs a warning if the function has not been registered.
 *
 * @return {Array}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.toJSON = function () {
  return this._queue.map(function (fn) {
    elasticlunr.Pipeline.warnIfFunctionNotRegistered(fn);
    return fn.label;
  });
};
/*!
 * elasticlunr.Index
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.Index is object that manages a search index.  It contains the indexes
 * and stores all the tokens and document lookups.  It also provides the main
 * user facing API for the library.
 *
 * @constructor
 */
elasticlunr.Index = function () {
  this._fields = [];
  this._ref = 'id';
  this.pipeline = new elasticlunr.Pipeline;
  this.documentStore = new elasticlunr.DocumentStore;
  this.index = {};
  this.eventEmitter = new elasticlunr.EventEmitter;
  this._idfCache = {};

  this.on('add', 'remove', 'update', (function () {
    this._idfCache = {};
  }).bind(this));
};

/**
 * Bind a handler to events being emitted by the index.
 *
 * The handler can be bound to many events at the same time.
 *
 * @param {String} [eventName] The name(s) of events to bind the function to.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
elasticlunr.Index.prototype.on = function () {
  var args = Array.prototype.slice.call(arguments);
  return this.eventEmitter.addListener.apply(this.eventEmitter, args);
};

/**
 * Removes a handler from an event being emitted by the index.
 *
 * @param {String} eventName The name of events to remove the function from.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
elasticlunr.Index.prototype.off = function (name, fn) {
  return this.eventEmitter.removeListener(name, fn);
};

/**
 * Loads a previously serialised index.
 *
 * Issues a warning if the index being imported was serialised
 * by a different version of elasticlunr.
 *
 * @param {Object} serialisedData The serialised set to load.
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.load = function (serialisedData) {
  if (serialisedData.version !== elasticlunr.version) {
    elasticlunr.utils.warn('version mismatch: current '
                    + elasticlunr.version + ' importing ' + serialisedData.version);
  }

  var idx = new this;

  idx._fields = serialisedData.fields;
  idx._ref = serialisedData.ref;
  idx.documentStore = elasticlunr.DocumentStore.load(serialisedData.documentStore);
  idx.pipeline = elasticlunr.Pipeline.load(serialisedData.pipeline);
  idx.index = {};
  for (var field in serialisedData.index) {
    idx.index[field] = elasticlunr.InvertedIndex.load(serialisedData.index[field]);
  }

  return idx;
};

/**
 * Adds a field to the list of fields that will be searchable within documents in the index.
 *
 * Remember that inner index is build based on field, which means each field has one inverted index.
 *
 * Fields should be added before any documents are added to the index, fields
 * that are added after documents are added to the index will only apply to new
 * documents added to the index.
 *
 * @param {String} fieldName The name of the field within the document that should be indexed
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.addField = function (fieldName) {
  this._fields.push(fieldName);
  this.index[fieldName] = new elasticlunr.InvertedIndex;
  return this;
};

/**
 * Sets the property used to uniquely identify documents added to the index,
 * by default this property is 'id'.
 *
 * This should only be changed before adding documents to the index, changing
 * the ref property without resetting the index can lead to unexpected results.
 *
 * @param {String} refName The property to use to uniquely identify the
 * documents in the index.
 * @param {Boolean} emitEvent Whether to emit add events, defaults to true
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.setRef = function (refName) {
  this._ref = refName;
  return this;
};

/**
 *
 * Set if the JSON format original documents are save into elasticlunr.DocumentStore
 *
 * Defaultly save all the original JSON documents.
 *
 * @param {Boolean} save Whether to save the original JSON documents.
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.saveDocument = function (save) {
  this.documentStore = new elasticlunr.DocumentStore(save);
  return this;
};

/**
 * Add a JSON format document to the index.
 *
 * This is the way new documents enter the index, this function will run the
 * fields from the document through the index's pipeline and then add it to
 * the index, it will then show up in search results.
 *
 * An 'add' event is emitted with the document that has been added and the index
 * the document has been added to. This event can be silenced by passing false
 * as the second argument to add.
 *
 * @param {Object} doc The JSON format document to add to the index.
 * @param {Boolean} emitEvent Whether or not to emit events, default true.
 * @memberOf Index
 */
elasticlunr.Index.prototype.addDoc = function (doc, emitEvent) {
  if (!doc) return;
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  var docRef = doc[this._ref];

  this.documentStore.addDoc(docRef, doc);
  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(elasticlunr.tokenizer(doc[field]));
    this.documentStore.addFieldLength(docRef, field, fieldTokens.length);

    var tokenCount = {};
    fieldTokens.forEach(function (token) {
      if (token in tokenCount) tokenCount[token] += 1;
      else tokenCount[token] = 1;
    }, this);

    for (var token in tokenCount) {
      var termFrequency = tokenCount[token];
      termFrequency = Math.sqrt(termFrequency);
      this.index[field].addToken(token, { ref: docRef, tf: termFrequency });
    }
  }, this);

  if (emitEvent) this.eventEmitter.emit('add', doc, this);
};

/**
 * Removes a document from the index by doc ref.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 *
 * If user setting DocumentStore not storing the documents, then remove doc by docRef is not allowed.
 *
 * @param {String|Integer} docRef The document ref to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
elasticlunr.Index.prototype.removeDocByRef = function (docRef, emitEvent) {
  if (!docRef) return;
  if (this.documentStore.isDocStored() === false) {
    return;
  }

  if (!this.documentStore.hasDoc(docRef)) return;
  var doc = this.documentStore.getDoc(docRef);
  this.removeDoc(doc, false);
};

/**
 * Removes a document from the index.
 * This remove operation could work even the original doc is not store in the DocumentStore.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 *
 *
 * @param {Object} doc The document ref to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
elasticlunr.Index.prototype.removeDoc = function (doc, emitEvent) {
  if (!doc) return;

  var emitEvent = emitEvent === undefined ? true : emitEvent;

  var docRef = doc[this._ref];
  if (!this.documentStore.hasDoc(docRef)) return;

  this.documentStore.removeDoc(docRef);

  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(elasticlunr.tokenizer(doc[field]));
    fieldTokens.forEach(function (token) {
      this.index[field].removeToken(token, docRef);
    }, this);
  }, this);

  if (emitEvent) this.eventEmitter.emit('remove', doc, this);
};

/**
 * Updates a document in the index.
 *
 * When a document contained within the index gets updated, fields changed,
 * added or removed, to make sure it correctly matched against search queries,
 * it should be updated in the index.
 *
 * This method is just a wrapper around `remove` and `add`
 *
 * An 'update' event is emitted with the document that has been updated and the index.
 * This event can be silenced by passing false as the second argument to update. Only
 * an update event will be fired, the 'add' and 'remove' events of the underlying calls
 * are silenced.
 *
 * @param {Object} doc The document to update in the index.
 * @param {Boolean} emitEvent Whether to emit update events, defaults to true
 * @see Index.prototype.remove
 * @see Index.prototype.add
 * @memberOf Index
 */
elasticlunr.Index.prototype.updateDoc = function (doc, emitEvent) {
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  this.removeDocByRef(doc[this._ref], false);
  this.addDoc(doc, false);

  if (emitEvent) this.eventEmitter.emit('update', doc, this);
};

/**
 * Calculates the inverse document frequency for a token within the index of a field.
 *
 * @param {String} token The token to calculate the idf of.
 * @param {String} field The field to compute idf.
 * @see Index.prototype.idf
 * @private
 * @memberOf Index
 */
elasticlunr.Index.prototype.idf = function (term, field) {
  var cacheKey = "@" + field + '/' + term;
  if (Object.prototype.hasOwnProperty.call(this._idfCache, cacheKey)) return this._idfCache[cacheKey];

  var df = this.index[field].getDocFreq(term);
  var idf = 1 + Math.log(this.documentStore.length / (df + 1));
  this._idfCache[cacheKey] = idf;

  return idf;
};

/**
 * get fields of current index instance
 *
 * @return {Array}
 */
elasticlunr.Index.prototype.getFields = function () {
  return this._fields.slice();
};

/**
 * Searches the index using the passed query.
 * Queries should be a string, multiple words are allowed.
 *
 * If config is null, will search all fields defaultly, and lead to OR based query.
 * If config is specified, will search specified with query time boosting.
 *
 * All query tokens are passed through the same pipeline that document tokens
 * are passed through, so any language processing involved will be run on every
 * query term.
 *
 * Each query term is expanded, so that the term 'he' might be expanded to
 * 'hello' and 'help' if those terms were already included in the index.
 *
 * Matching documents are returned as an array of objects, each object contains
 * the matching document ref, as set for this index, and the similarity score
 * for this document against the query.
 *
 * @param {String} query The query to search the index with.
 * @param {JSON} userConfig The user query config, JSON format.
 * @return {Object}
 * @see Index.prototype.idf
 * @see Index.prototype.documentVector
 * @memberOf Index
 */
elasticlunr.Index.prototype.search = function (query, userConfig) {
  if (!query) return [];

  var configStr = null;
  if (userConfig != null) {
    configStr = JSON.stringify(userConfig);
  }

  var config = new elasticlunr.Configuration(configStr, this.getFields()).get();

  var queryTokens = this.pipeline.run(elasticlunr.tokenizer(query));

  var queryResults = {};

  for (var field in config) {
    var fieldSearchResults = this.fieldSearch(queryTokens, field, config);
    var fieldBoost = config[field].boost;

    for (var docRef in fieldSearchResults) {
      fieldSearchResults[docRef] = fieldSearchResults[docRef] * fieldBoost;
    }

    for (var docRef in fieldSearchResults) {
      if (docRef in queryResults) {
        queryResults[docRef] += fieldSearchResults[docRef];
      } else {
        queryResults[docRef] = fieldSearchResults[docRef];
      }
    }
  }

  var results = [];
  for (var docRef in queryResults) {
    results.push({ref: docRef, score: queryResults[docRef]});
  }

  results.sort(function (a, b) { return b.score - a.score; });
  return results;
};

/**
 * search queryTokens in specified field.
 *
 * @param {Array} queryTokens The query tokens to query in this field.
 * @param {String} field Field to query in.
 * @param {elasticlunr.Configuration} config The user query config, JSON format.
 * @return {Object}
 */
elasticlunr.Index.prototype.fieldSearch = function (queryTokens, fieldName, config) {
  var booleanType = config[fieldName].bool;
  var expand = config[fieldName].expand;
  var boost = config[fieldName].boost;
  var scores = null;
  var docTokens = {};

  // Do nothing if the boost is 0
  if (boost === 0) {
    return;
  }

  queryTokens.forEach(function (token) {
    var tokens = [token];
    if (expand == true) {
      tokens = this.index[fieldName].expandToken(token);
    }
    // Consider every query token in turn. If expanded, each query token
    // corresponds to a set of tokens, which is all tokens in the 
    // index matching the pattern queryToken* .
    // For the set of tokens corresponding to a query token, find and score
    // all matching documents. Store those scores in queryTokenScores, 
    // keyed by docRef.
    // Then, depending on the value of booleanType, combine the scores
    // for this query token with previous scores.  If booleanType is OR,
    // then merge the scores by summing into the accumulated total, adding
    // new document scores are required (effectively a union operator). 
    // If booleanType is AND, accumulate scores only if the document 
    // has previously been scored by another query token (an intersection
    // operation0. 
    // Furthermore, since when booleanType is AND, additional 
    // query tokens can't add new documents to the result set, use the
    // current document set to limit the processing of each new query 
    // token for efficiency (i.e., incremental intersection).
    
    var queryTokenScores = {};
    tokens.forEach(function (key) {
      var docs = this.index[fieldName].getDocs(key);
      var idf = this.idf(key, fieldName);
      
      if (scores && booleanType == 'AND') {
          // special case, we can rule out documents that have been
          // already been filtered out because they weren't scored
          // by previous query token passes.
          var filteredDocs = {};
          for (var docRef in scores) {
              if (docRef in docs) {
                  filteredDocs[docRef] = docs[docRef];
              }
          }
          docs = filteredDocs;
      }
      // only record appeared token for retrieved documents for the
      // original token, not for expaned token.
      // beause for doing coordNorm for a retrieved document, coordNorm only care how many
      // query token appear in that document.
      // so expanded token should not be added into docTokens, if added, this will pollute the
      // coordNorm
      if (key == token) {
        this.fieldSearchStats(docTokens, key, docs);
      }

      for (var docRef in docs) {
        var tf = this.index[fieldName].getTermFrequency(key, docRef);
        var fieldLength = this.documentStore.getFieldLength(docRef, fieldName);
        var fieldLengthNorm = 1;
        if (fieldLength != 0) {
          fieldLengthNorm = 1 / Math.sqrt(fieldLength);
        }

        var penality = 1;
        if (key != token) {
          // currently I'm not sure if this penality is enough,
          // need to do verification
          penality = (1 - (key.length - token.length) / key.length) * 0.15;
        }

        var score = tf * idf * fieldLengthNorm * penality;

        if (docRef in queryTokenScores) {
          queryTokenScores[docRef] += score;
        } else {
          queryTokenScores[docRef] = score;
        }
      }
    }, this);
    
    scores = this.mergeScores(scores, queryTokenScores, booleanType);
  }, this);

  scores = this.coordNorm(scores, docTokens, queryTokens.length);
  return scores;
};

/**
 * Merge the scores from one set of tokens into an accumulated score table.
 * Exact operation depends on the op parameter. If op is 'AND', then only the
 * intersection of the two score lists is retained. Otherwise, the union of
 * the two score lists is returned. For internal use only.
 *
 * @param {Object} bool accumulated scores. Should be null on first call.
 * @param {String} scores new scores to merge into accumScores.
 * @param {Object} op merge operation (should be 'AND' or 'OR').
 *
 */

elasticlunr.Index.prototype.mergeScores = function (accumScores, scores, op) {
    if (!accumScores) {
        return scores; 
    }
    if (op == 'AND') {
        var intersection = {};
        for (var docRef in scores) {
            if (docRef in accumScores) {
                intersection[docRef] = accumScores[docRef] + scores[docRef];
            }
        }
        return intersection;
    } else {
        for (var docRef in scores) {
            if (docRef in accumScores) {
                accumScores[docRef] += scores[docRef];
            } else {
                accumScores[docRef] = scores[docRef];
            }
        }
        return accumScores;
    }
};


/**
 * Record the occuring query token of retrieved doc specified by doc field.
 * Only for inner user.
 *
 * @param {Object} docTokens a data structure stores which token appears in the retrieved doc.
 * @param {String} token query token
 * @param {Object} docs the retrieved documents of the query token
 *
 */
elasticlunr.Index.prototype.fieldSearchStats = function (docTokens, token, docs) {
  for (var doc in docs) {
    if (doc in docTokens) {
      docTokens[doc].push(token);
    } else {
      docTokens[doc] = [token];
    }
  }
};

/**
 * coord norm the score of a doc.
 * if a doc contain more query tokens, then the score will larger than the doc
 * contains less query tokens.
 *
 * only for inner use.
 *
 * @param {Object} results first results
 * @param {Object} docs field search results of a token
 * @param {Integer} n query token number
 * @return {Object}
 */
elasticlunr.Index.prototype.coordNorm = function (scores, docTokens, n) {
  for (var doc in scores) {
    if (!(doc in docTokens)) continue;
    var tokens = docTokens[doc].length;
    scores[doc] = scores[doc] * tokens / n;
  }

  return scores;
};

/**
 * Returns a representation of the index ready for serialisation.
 *
 * @return {Object}
 * @memberOf Index
 */
elasticlunr.Index.prototype.toJSON = function () {
  var indexJson = {};
  this._fields.forEach(function (field) {
    indexJson[field] = this.index[field].toJSON();
  }, this);

  return {
    version: elasticlunr.version,
    fields: this._fields,
    ref: this._ref,
    documentStore: this.documentStore.toJSON(),
    index: indexJson,
    pipeline: this.pipeline.toJSON()
  };
};

/**
 * Applies a plugin to the current index.
 *
 * A plugin is a function that is called with the index as its context.
 * Plugins can be used to customise or extend the behaviour the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied to the index.
 *
 * The plugin function will be called with the index as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index as its context.
 *
 * Example:
 *
 *     var myPlugin = function (idx, arg1, arg2) {
 *       // `this` is the index to be extended
 *       // apply any extensions etc here.
 *     }
 *
 *     var idx = elasticlunr(function () {
 *       this.use(myPlugin, 'arg1', 'arg2')
 *     })
 *
 * @param {Function} plugin The plugin to apply.
 * @memberOf Index
 */
elasticlunr.Index.prototype.use = function (plugin) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift(this);
  plugin.apply(this, args);
};
/*!
 * elasticlunr.DocumentStore
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.DocumentStore is a simple key-value document store used for storing sets of tokens for
 * documents stored in index.
 *
 * elasticlunr.DocumentStore store original JSON format documents that you could build search snippet by this original JSON document.
 *
 * user could choose whether original JSON format document should be store, if no configuration then document will be stored defaultly.
 * If user care more about the index size, user could select not store JSON documents, then this will has some defects, such as user
 * could not use JSON document to generate snippets of search results.
 *
 * @param {Boolean} save If the original JSON document should be stored.
 * @constructor
 * @module
 */
elasticlunr.DocumentStore = function (save) {
  if (save === null || save === undefined) {
    this._save = true;
  } else {
    this._save = save;
  }

  this.docs = {};
  this.docInfo = {};
  this.length = 0;
};

/**
 * Loads a previously serialised document store
 *
 * @param {Object} serialisedData The serialised document store to load.
 * @return {elasticlunr.DocumentStore}
 */
elasticlunr.DocumentStore.load = function (serialisedData) {
  var store = new this;

  store.length = serialisedData.length;
  store.docs = serialisedData.docs;
  store.docInfo = serialisedData.docInfo;
  store._save = serialisedData.save;

  return store;
};

/**
 * check if current instance store the original doc
 *
 * @return {Boolean}
 */
elasticlunr.DocumentStore.prototype.isDocStored = function () {
  return this._save;
};

/**
 * Stores the given doc in the document store against the given id.
 * If docRef already exist, then update doc.
 *
 * Document is store by original JSON format, then you could use original document to generate search snippets.
 *
 * @param {Integer|String} docRef The key used to store the JSON format doc.
 * @param {Object} doc The JSON format doc.
 */
elasticlunr.DocumentStore.prototype.addDoc = function (docRef, doc) {
  if (!this.hasDoc(docRef)) this.length++;

  if (this._save === true) {
    this.docs[docRef] = clone(doc);
  } else {
    this.docs[docRef] = null;
  }
};

/**
 * Retrieves the JSON doc from the document store for a given key.
 *
 * If docRef not found, return null.
 * If user set not storing the documents, return null.
 *
 * @param {Integer|String} docRef The key to lookup and retrieve from the document store.
 * @return {Object}
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.getDoc = function (docRef) {
  if (this.hasDoc(docRef) === false) return null;
  return this.docs[docRef];
};

/**
 * Checks whether the document store contains a key (docRef).
 *
 * @param {Integer|String} docRef The id to look up in the document store.
 * @return {Boolean}
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.hasDoc = function (docRef) {
  return docRef in this.docs;
};

/**
 * Removes the value for a key in the document store.
 *
 * @param {Integer|String} docRef The id to remove from the document store.
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.removeDoc = function (docRef) {
  if (!this.hasDoc(docRef)) return;

  delete this.docs[docRef];
  delete this.docInfo[docRef];
  this.length--;
};

/**
 * Add field length of a document's field tokens from pipeline results.
 * The field length of a document is used to do field length normalization even without the original JSON document stored.
 *
 * @param {Integer|String} docRef document's id or reference
 * @param {String} fieldName field name
 * @param {Integer} length field length
 */
elasticlunr.DocumentStore.prototype.addFieldLength = function (docRef, fieldName, length) {
  if (docRef === null || docRef === undefined) return;
  if (this.hasDoc(docRef) == false) return;

  if (!this.docInfo[docRef]) this.docInfo[docRef] = {};
  this.docInfo[docRef][fieldName] = length;
};

/**
 * Update field length of a document's field tokens from pipeline results.
 * The field length of a document is used to do field length normalization even without the original JSON document stored.
 *
 * @param {Integer|String} docRef document's id or reference
 * @param {String} fieldName field name
 * @param {Integer} length field length
 */
elasticlunr.DocumentStore.prototype.updateFieldLength = function (docRef, fieldName, length) {
  if (docRef === null || docRef === undefined) return;
  if (this.hasDoc(docRef) == false) return;

  this.addFieldLength(docRef, fieldName, length);
};

/**
 * get field length of a document by docRef
 *
 * @param {Integer|String} docRef document id or reference
 * @param {String} fieldName field name
 * @return {Integer} field length
 */
elasticlunr.DocumentStore.prototype.getFieldLength = function (docRef, fieldName) {
  if (docRef === null || docRef === undefined) return 0;

  if (!(docRef in this.docs)) return 0;
  if (!(fieldName in this.docInfo[docRef])) return 0;
  return this.docInfo[docRef][fieldName];
};

/**
 * Returns a JSON representation of the document store used for serialisation.
 *
 * @return {Object} JSON format
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.toJSON = function () {
  return {
    docs: this.docs,
    docInfo: this.docInfo,
    length: this.length,
    save: this._save
  };
};

/**
 * Cloning object
 *
 * @param {Object} object in JSON format
 * @return {Object} copied object
 */
function clone(obj) {
  if (null === obj || "object" !== typeof obj) return obj;

  var copy = obj.constructor();

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }

  return copy;
}
/*!
 * elasticlunr.stemmer
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * elasticlunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @module
 * @param {String} str The string to stem
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var   stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a
    re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) {  w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return porterStemmer;
})();

elasticlunr.Pipeline.registerFunction(elasticlunr.stemmer, 'stemmer');
/*!
 * elasticlunr.stopWordFilter
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.stopWordFilter is an English language stop words filter, any words
 * contained in the stop word list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 * Currently this StopwordFilter using dictionary to do O(1) time complexity stop word filtering.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.stopWordFilter = function (token) {
  if (token && elasticlunr.stopWordFilter.stopWords[token] !== true) {
    return token;
  }
};

/**
 * Remove predefined stop words
 * if user want to use customized stop words, user could use this function to delete
 * all predefined stopwords.
 *
 * @return {null}
 */
elasticlunr.clearStopWords = function () {
  elasticlunr.stopWordFilter.stopWords = {};
};

/**
 * Add customized stop words
 * user could use this function to add customized stop words
 * 
 * @params {Array} words customized stop words
 * @return {null}
 */
elasticlunr.addStopWords = function (words) {
  if (words == null || Array.isArray(words) === false) return;

  words.forEach(function (word) {
    elasticlunr.stopWordFilter.stopWords[word] = true;
  }, this);
};

/**
 * Reset to default stop words
 * user could use this function to restore default stop words
 *
 * @return {null}
 */
elasticlunr.resetStopWords = function () {
  elasticlunr.stopWordFilter.stopWords = elasticlunr.defaultStopWords;
};

elasticlunr.defaultStopWords = {
  "": true,
  "a": true,
  "able": true,
  "about": true,
  "across": true,
  "after": true,
  "all": true,
  "almost": true,
  "also": true,
  "am": true,
  "among": true,
  "an": true,
  "and": true,
  "any": true,
  "are": true,
  "as": true,
  "at": true,
  "be": true,
  "because": true,
  "been": true,
  "but": true,
  "by": true,
  "can": true,
  "cannot": true,
  "could": true,
  "dear": true,
  "did": true,
  "do": true,
  "does": true,
  "either": true,
  "else": true,
  "ever": true,
  "every": true,
  "for": true,
  "from": true,
  "get": true,
  "got": true,
  "had": true,
  "has": true,
  "have": true,
  "he": true,
  "her": true,
  "hers": true,
  "him": true,
  "his": true,
  "how": true,
  "however": true,
  "i": true,
  "if": true,
  "in": true,
  "into": true,
  "is": true,
  "it": true,
  "its": true,
  "just": true,
  "least": true,
  "let": true,
  "like": true,
  "likely": true,
  "may": true,
  "me": true,
  "might": true,
  "most": true,
  "must": true,
  "my": true,
  "neither": true,
  "no": true,
  "nor": true,
  "not": true,
  "of": true,
  "off": true,
  "often": true,
  "on": true,
  "only": true,
  "or": true,
  "other": true,
  "our": true,
  "own": true,
  "rather": true,
  "said": true,
  "say": true,
  "says": true,
  "she": true,
  "should": true,
  "since": true,
  "so": true,
  "some": true,
  "than": true,
  "that": true,
  "the": true,
  "their": true,
  "them": true,
  "then": true,
  "there": true,
  "these": true,
  "they": true,
  "this": true,
  "tis": true,
  "to": true,
  "too": true,
  "twas": true,
  "us": true,
  "wants": true,
  "was": true,
  "we": true,
  "were": true,
  "what": true,
  "when": true,
  "where": true,
  "which": true,
  "while": true,
  "who": true,
  "whom": true,
  "why": true,
  "will": true,
  "with": true,
  "would": true,
  "yet": true,
  "you": true,
  "your": true
};

elasticlunr.stopWordFilter.stopWords = elasticlunr.defaultStopWords;

elasticlunr.Pipeline.registerFunction(elasticlunr.stopWordFilter, 'stopWordFilter');
/*!
 * elasticlunr.trimmer
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.trimmer is a pipeline function for trimming non word
 * characters from the begining and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.trimmer = function (token) {
  if (token === null || token === undefined) {
    throw new Error('token should not be undefined');
  }

  return token
    .replace(/^\W+/, '')
    .replace(/\W+$/, '');
};

elasticlunr.Pipeline.registerFunction(elasticlunr.trimmer, 'trimmer');
/*!
 * elasticlunr.InvertedIndex
 * Copyright (C) 2016 Wei Song
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * elasticlunr.InvertedIndex is used for efficiently storing and
 * lookup of documents that contain a given token.
 *
 * @constructor
 */
elasticlunr.InvertedIndex = function () {
  this.root = { docs: {}, df: 0 };
};

/**
 * Loads a previously serialised inverted index.
 *
 * @param {Object} serialisedData The serialised inverted index to load.
 * @return {elasticlunr.InvertedIndex}
 */
elasticlunr.InvertedIndex.load = function (serialisedData) {
  var idx = new this;
  idx.root = serialisedData.root;

  return idx;
};

/**
 * Adds a {token: tokenInfo} pair to the inverted index.
 * If the token already exist, then update the tokenInfo.
 *
 * tokenInfo format: { ref: 1, tf: 2}
 * tokenInfor should contains the document's ref and the tf(token frequency) of that token in
 * the document.
 *
 * By default this function starts at the root of the current inverted index, however
 * it can start at any node of the inverted index if required.
 *
 * @param {String} token 
 * @param {Object} tokenInfo format: { ref: 1, tf: 2}
 * @param {Object} root An optional node at which to start looking for the
 * correct place to enter the doc, by default the root of this elasticlunr.InvertedIndex
 * is used.
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.addToken = function (token, tokenInfo, root) {
  var root = root || this.root,
      idx = 0;

  while (idx <= token.length - 1) {
    var key = token[idx];

    if (!(key in root)) root[key] = {docs: {}, df: 0};
    idx += 1;
    root = root[key];
  }

  var docRef = tokenInfo.ref;
  if (!root.docs[docRef]) {
    // if this doc not exist, then add this doc
    root.docs[docRef] = {tf: tokenInfo.tf};
    root.df += 1;
  } else {
    // if this doc already exist, then update tokenInfo
    root.docs[docRef] = {tf: tokenInfo.tf};
  }
};

/**
 * Checks whether a token is in this elasticlunr.InvertedIndex.
 * 
 *
 * @param {String} token The token to be checked
 * @return {Boolean}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.hasToken = function (token) {
  if (!token) return false;

  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return false;
    node = node[token[i]];
  }

  return true;
};

/**
 * Retrieve a node from the inverted index for a given token.
 * If token not found in this InvertedIndex, return null.
 * 
 *
 * @param {String} token The token to get the node for.
 * @return {Object}
 * @see InvertedIndex.prototype.get
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getNode = function (token) {
  if (!token) return null;

  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return null;
    node = node[token[i]];
  }

  return node;
};

/**
 * Retrieve the documents of a given token.
 * If token not found, return {}.
 *
 *
 * @param {String} token The token to get the documents for.
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getDocs = function (token) {
  var node = this.getNode(token);
  if (node == null) {
    return {};
  }

  return node.docs;
};

/**
 * Retrieve term frequency of given token in given docRef.
 * If token or docRef not found, return 0.
 *
 *
 * @param {String} token The token to get the documents for.
 * @param {String|Integer} docRef
 * @return {Integer}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getTermFrequency = function (token, docRef) {
  var node = this.getNode(token);

  if (node == null) {
    return 0;
  }

  if (!(docRef in node.docs)) {
    return 0;
  }

  return node.docs[docRef].tf;
};

/**
 * Retrieve the document frequency of given token.
 * If token not found, return 0.
 *
 *
 * @param {String} token The token to get the documents for.
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getDocFreq = function (token) {
  var node = this.getNode(token);

  if (node == null) {
    return 0;
  }

  return node.df;
};

/**
 * Remove the document identified by document's ref from the token in the inverted index.
 *
 *
 * @param {String} token Remove the document from which token.
 * @param {String} ref The ref of the document to remove from given token.
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.removeToken = function (token, ref) {
  if (!token) return;
  var node = this.getNode(token);

  if (node == null) return;

  if (ref in node.docs) {
    delete node.docs[ref];
    node.df -= 1;
  }
};

/**
 * Find all the possible suffixes of given token using tokens currently in the inverted index.
 * If token not found, return empty Array.
 *
 * @param {String} token The token to expand.
 * @return {Array}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.expandToken = function (token, memo, root) {
  if (token == null || token == '') return [];
  var memo = memo || [];

  if (root == void 0) {
    root = this.getNode(token);
    if (root == null) return memo;
  }

  if (root.df > 0) memo.push(token);

  for (var key in root) {
    if (key === 'docs') continue;
    if (key === 'df') continue;
    this.expandToken(token + key, memo, root[key]);
  }

  return memo;
};

/**
 * Returns a representation of the inverted index ready for serialisation.
 *
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.toJSON = function () {
  return {
    root: this.root
  };
};

/*!
 * elasticlunr.Configuration
 * Copyright (C) 2016 Wei Song
 */
 
 /** 
  * elasticlunr.Configuration is used to analyze the user search configuration.
  * 
  * By elasticlunr.Configuration user could set query-time boosting, boolean model in each field.
  * 
  * Currently configuration supports:
  * 1. query-time boosting, user could set how to boost each field.
  * 2. boolean model chosing, user could choose which boolean model to use for each field.
  * 3. token expandation, user could set token expand to True to improve Recall. Default is False.
  * 
  * Query time boosting must be configured by field category, "boolean" model could be configured 
  * by both field category or globally as the following example. Field configuration for "boolean"
  * will overwrite global configuration.
  * Token expand could be configured both by field category or golbally. Local field configuration will
  * overwrite global configuration.
  * 
  * configuration example:
  * {
  *   fields:{ 
  *     title: {boost: 2},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * "bool" field configuation overwrite global configuation example:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * "expand" example:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR",
  *   expand: true
  * }
  * 
  * "expand" example for field category:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND", expand: true},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * setting the boost to 0 ignores the field (this will only search the title):
  * {
  *   fields:{
  *     title: {boost: 1},
  *     body: {boost: 0}
  *   }
  * }
  *
  * then, user could search with configuration to do query-time boosting.
  * idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
  * 
  * 
  * @constructor
  * 
  * @param {String} config user configuration
  * @param {Array} fields fields of index instance
  * @module
  */
elasticlunr.Configuration = function (config, fields) {
  var config = config || '';

  if (fields == undefined || fields == null) {
    throw new Error('fields should not be null');
  }

  this.config = {};

  var userConfig;
  try {
    userConfig = JSON.parse(config);
    this.buildUserConfig(userConfig, fields);
  } catch (error) {
    elasticlunr.utils.warn('user configuration parse failed, will use default configuration');
    this.buildDefaultConfig(fields);
  }
};

/**
 * Build default search configuration.
 * 
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.buildDefaultConfig = function (fields) {
  this.reset();
  fields.forEach(function (field) {
    this.config[field] = {
      boost: 1,
      bool: "OR",
      expand: false
    };
  }, this);
};

/**
 * Build user configuration.
 * 
 * @param {JSON} config User JSON configuratoin
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.buildUserConfig = function (config, fields) {
  var global_bool = "OR";
  var global_expand = false;

  this.reset();
  if ('bool' in config) {
    global_bool = config['bool'] || global_bool;
  }

  if ('expand' in config) {
    global_expand = config['expand'] || global_expand;
  }

  if ('fields' in config) {
    for (var field in config['fields']) {
      if (fields.indexOf(field) > -1) {
        var field_config = config['fields'][field];
        var field_expand = global_expand;
        if (field_config.expand != undefined) {
          field_expand = field_config.expand;
        }

        this.config[field] = {
          boost: (field_config.boost || field_config.boost === 0) ? field_config.boost : 1,
          bool: field_config.bool || global_bool,
          expand: field_expand
        };
      } else {
        elasticlunr.utils.warn('field name in user configuration not found in index instance fields');
      }
    }
  } else {
    this.addAllFields2UserConfig(global_bool, global_expand, fields);
  }
};

/**
 * Add all fields to user search configuration.
 * 
 * @param {String} bool Boolean model
 * @param {String} expand Expand model
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.addAllFields2UserConfig = function (bool, expand, fields) {
  fields.forEach(function (field) {
    this.config[field] = {
      boost: 1,
      bool: bool,
      expand: expand
    };
  }, this);
};

/**
 * get current user configuration
 */
elasticlunr.Configuration.prototype.get = function () {
  return this.config;
};

/**
 * reset user search configuration.
 */
elasticlunr.Configuration.prototype.reset = function () {
  this.config = {};
};
/**
 * sorted_set.js is added only to make elasticlunr.js compatible with lunr-languages.
 * if elasticlunr.js support different languages by default, this will make elasticlunr.js
 * much bigger that not good for browser usage.
 *
 */


/*!
 * lunr.SortedSet
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.SortedSets are used to maintain an array of uniq values in a sorted
 * order.
 *
 * @constructor
 */
lunr.SortedSet = function () {
  this.length = 0
  this.elements = []
}

/**
 * Loads a previously serialised sorted set.
 *
 * @param {Array} serialisedData The serialised set to load.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.load = function (serialisedData) {
  var set = new this

  set.elements = serialisedData
  set.length = serialisedData.length

  return set
}

/**
 * Inserts new items into the set in the correct position to maintain the
 * order.
 *
 * @param {Object} The objects to add to this set.
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.add = function () {
  var i, element

  for (i = 0; i < arguments.length; i++) {
    element = arguments[i]
    if (~this.indexOf(element)) continue
    this.elements.splice(this.locationFor(element), 0, element)
  }

  this.length = this.elements.length
}

/**
 * Converts this sorted set into an array.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toArray = function () {
  return this.elements.slice()
}

/**
 * Creates a new array with the results of calling a provided function on every
 * element in this sorted set.
 *
 * Delegates to Array.prototype.map and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * for the function fn.
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.map = function (fn, ctx) {
  return this.elements.map(fn, ctx)
}

/**
 * Executes a provided function once per sorted set element.
 *
 * Delegates to Array.prototype.forEach and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * @memberOf SortedSet
 * for the function fn.
 */
lunr.SortedSet.prototype.forEach = function (fn, ctx) {
  return this.elements.forEach(fn, ctx)
}

/**
 * Returns the index at which a given element can be found in the
 * sorted set, or -1 if it is not present.
 *
 * @param {Object} elem The object to locate in the sorted set.
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.indexOf = function (elem) {
  var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

  while (sectionLength > 1) {
    if (pivotElem === elem) return pivot

    if (pivotElem < elem) start = pivot
    if (pivotElem > elem) end = pivot

    sectionLength = end - start
    pivot = start + Math.floor(sectionLength / 2)
    pivotElem = this.elements[pivot]
  }

  if (pivotElem === elem) return pivot

  return -1
}

/**
 * Returns the position within the sorted set that an element should be
 * inserted at to maintain the current order of the set.
 *
 * This function assumes that the element to search for does not already exist
 * in the sorted set.
 *
 * @param {Object} elem The elem to find the position for in the set
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.locationFor = function (elem) {
  var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

  while (sectionLength > 1) {
    if (pivotElem < elem) start = pivot
    if (pivotElem > elem) end = pivot

    sectionLength = end - start
    pivot = start + Math.floor(sectionLength / 2)
    pivotElem = this.elements[pivot]
  }

  if (pivotElem > elem) return pivot
  if (pivotElem < elem) return pivot + 1
}

/**
 * Creates a new lunr.SortedSet that contains the elements in the intersection
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to intersect with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.intersect = function (otherSet) {
  var intersectSet = new lunr.SortedSet,
      i = 0, j = 0,
      a_len = this.length, b_len = otherSet.length,
      a = this.elements, b = otherSet.elements

  while (true) {
    if (i > a_len - 1 || j > b_len - 1) break

    if (a[i] === b[j]) {
      intersectSet.add(a[i])
      i++, j++
      continue
    }

    if (a[i] < b[j]) {
      i++
      continue
    }

    if (a[i] > b[j]) {
      j++
      continue
    }
  };

  return intersectSet
}

/**
 * Makes a copy of this set
 *
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.clone = function () {
  var clone = new lunr.SortedSet

  clone.elements = this.toArray()
  clone.length = clone.elements.length

  return clone
}

/**
 * Creates a new lunr.SortedSet that contains the elements in the union
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to union with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.union = function (otherSet) {
  var longSet, shortSet, unionSet

  if (this.length >= otherSet.length) {
    longSet = this, shortSet = otherSet
  } else {
    longSet = otherSet, shortSet = this
  }

  unionSet = longSet.clone()

  for(var i = 0, shortSetElements = shortSet.toArray(); i < shortSetElements.length; i++){
    unionSet.add(shortSetElements[i])
  }

  return unionSet
}

/**
 * Returns a representation of the sorted set ready for serialisation.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toJSON = function () {
  return this.toArray()
}
  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (true) {
      // AMD. Register as an anonymous module.
      !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
    } else {}
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return elasticlunr
  }))
})();


/***/ }),

/***/ "./src/card.ts":
/*!*********************!*\
  !*** ./src/card.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Card": () => (/* binding */ Card)
/* harmony export */ });
/* harmony import */ var _util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/json-text-converter */ "./src/util/json-text-converter.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/clipboard */ "./src/util/clipboard.ts");
/* harmony import */ var _features_search_stack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/search-stack */ "./src/features/search-stack.ts");
/* harmony import */ var _features_pane_management__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./features/pane-management */ "./src/features/pane-management.ts");
/* harmony import */ var _features_desktop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./features/desktop */ "./src/features/desktop.ts");





class Card {
    constructor(name, description, id = '') {
        this.name = name;
        this.uniqueID = name.replace(/ /g, '-').toLocaleLowerCase();
        this.description = (0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.fromJSONSafeText)(description);
        this.creationDate = new Date();
        this.editDate = new Date();
        this.categories = [];
        this.subCards = [];
        this.displayMetaData = true;
        this.activeName = true;
        this.node = this.constructNodeInternal(id);
        this.nodeDesktopCopy = this.constructNodeInternal(id);
        this.nodeID = id.length > 0 ? id : this.uniqueID;
    }
    constructNode(id) {
        this.node = this.constructNodeInternal(id);
        this.nodeDesktopCopy = this.constructNodeInternal(id);
    }
    constructNodeInternal(id) {
        // create base node
        const node = document.createElement('div');
        const nameNode = document.createElement('h2');
        const descriptionNode = document.createElement('p');
        nameNode.innerText = this.name;
        descriptionNode.innerHTML = this.description;
        node.appendChild(nameNode);
        node.appendChild(descriptionNode);
        nameNode.className = 'card-name';
        nameNode.addEventListener('contextmenu', (event) => {
            if (!this.activeName)
                return;
            event.preventDefault();
            if ((0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.whichLeftPaneActive)() === _features_pane_management__WEBPACK_IMPORTED_MODULE_3__.LeftPaneType.Desktop) {
                (0,_features_desktop__WEBPACK_IMPORTED_MODULE_4__.removeItemFromDesktop)(this);
            }
            else {
                (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_2__.removeItemFromStack)(this);
            }
            return false;
        });
        nameNode.addEventListener('click', () => {
            if (!this.activeName)
                return;
            if ((0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.whichLeftPaneActive)() === _features_pane_management__WEBPACK_IMPORTED_MODULE_3__.LeftPaneType.Desktop) {
                (0,_features_desktop__WEBPACK_IMPORTED_MODULE_4__.addItemToDesktop)(this);
            }
            else {
                (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_2__.addItemToStack)(this);
            }
        });
        // create subcards
        if (this.subCards.length > 0) {
            const subcardNode = document.createElement('div');
            const subcardHeader = document.createElement('h4');
            const subcardContainer = document.createElement('div');
            const leftSubcardList = document.createElement('div');
            const rightSubcardList = document.createElement('div');
            subcardHeader.innerHTML = 'Subcards:';
            subcardHeader.className = 'card-subcard-header';
            subcardContainer.appendChild(leftSubcardList);
            subcardContainer.appendChild(rightSubcardList);
            subcardContainer.className = 'card-subcard-container';
            leftSubcardList.className = 'card-subcard-leftlist';
            rightSubcardList.className = 'card-subcard-rightlist';
            const createSubcardItem = (i) => {
                const subcardItem = document.createElement('div');
                subcardItem.innerHTML = `- ${this.subCards[i]}`;
                subcardItem.className = 'card-subcard-item';
                return subcardItem;
            };
            for (let i = 0; i < this.subCards.length; i++) {
                leftSubcardList.appendChild(createSubcardItem(i));
            }
            // for(let i = 0; i < Math.floor(this.subCards.length / 2); i++){
            //     leftSubcardList.appendChild(createSubcardItem(i))
            // }
            // for(let i = Math.floor(this.subCards.length / 2); i < this.subCards.length; i++){
            //     rightSubcardList.appendChild(createSubcardItem(i))
            // }
            subcardNode.appendChild(subcardHeader);
            subcardNode.appendChild(subcardContainer);
            node.appendChild(subcardNode);
            console.log('create subcards');
        }
        // add buttons
        const buttonRow = document.createElement('div');
        const copyJSONButton = document.createElement('button');
        copyJSONButton.innerText = 'Copy JSON';
        copyJSONButton.addEventListener('click', () => (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_1__.copyToClipboard)(this.toJSON()));
        buttonRow.appendChild(copyJSONButton);
        const copyUniqueIDButton = document.createElement('button');
        copyUniqueIDButton.innerHTML = 'Copy ID';
        copyUniqueIDButton.addEventListener('click', () => (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_1__.copyToClipboard)(this.uniqueID));
        buttonRow.appendChild(copyUniqueIDButton);
        buttonRow.className = 'card-button-row';
        node.appendChild(buttonRow);
        // create category + metadata rendering
        const metaDisplay = document.createElement('div');
        metaDisplay.className = 'card-meta-row';
        if (this.displayMetaData && this.categories.length > 0) {
            metaDisplay.innerHTML = this.categories.map(cat => `#${cat.replace(/ /g, '-')}`).join(' ');
            node.appendChild(metaDisplay);
        }
        // finalize node construction
        node.className = 'card';
        if (id.length > 0)
            node.id = id;
        return node;
    }
    disableNameAdding() {
        this.activeName = false;
    }
    setDates(creationDate, editDate) {
        this.creationDate = creationDate;
        this.editDate = editDate;
    }
    setCategories(categories) {
        this.categories = categories;
        this.constructNode(this.nodeID);
    }
    setSubcards(subcards) {
        this.subCards = subcards.sort();
        this.constructNode(this.nodeID);
    }
    toJSON() {
        return `{
    "name": "${this.name}",
    "uniqueID": "${this.uniqueID}",
    "description": "${(0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.toJSONSafeText)(this.description)}",

    "creationDate": ${JSON.stringify(this.creationDate)},
    "editDate": ${JSON.stringify(this.editDate)},

    "categories": ${JSON.stringify(this.categories)},
    "subcards": ${JSON.stringify(this.subCards)}
}`;
    }
    getNode() {
        return this.node;
    }
    getDesktopNode() {
        return this.nodeDesktopCopy;
    }
}


/***/ }),

/***/ "./src/cardgroup.ts":
/*!**************************!*\
  !*** ./src/cardgroup.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CardGroup": () => (/* binding */ CardGroup)
/* harmony export */ });
/* harmony import */ var _util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/json-text-converter */ "./src/util/json-text-converter.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/clipboard */ "./src/util/clipboard.ts");
/* harmony import */ var _features_search_stack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/search-stack */ "./src/features/search-stack.ts");
/* harmony import */ var _features_desktop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./features/desktop */ "./src/features/desktop.ts");
/* harmony import */ var _features_pane_management__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./features/pane-management */ "./src/features/pane-management.ts");





class CardGroup {
    constructor(name, description, id = '') {
        this.name = name;
        this.uniqueID = '[G]' + name.replace(/ /g, '-').toLocaleLowerCase();
        this.description = (0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.fromJSONSafeText)(description);
        this.childrenIDs = [];
        this.children = [];
        this.activeName = true;
        this.node = this.constructNodeInternal(id);
        this.nodeDesktopCopy = this.constructNodeInternal(id);
        this.nodeID = id.length > 0 ? id : this.uniqueID;
    }
    // similar to card.ts' constructNode
    constructNode(id) {
        this.node = this.constructNodeInternal(id);
        this.nodeDesktopCopy = this.constructNodeInternal(id);
    }
    constructNodeInternal(id) {
        // create base node
        const node = document.createElement('div');
        const nameNode = document.createElement('h2');
        const descriptionNode = document.createElement('p');
        nameNode.innerText = `[G] ${this.name}`;
        descriptionNode.innerHTML = this.description;
        node.appendChild(nameNode);
        node.appendChild(descriptionNode);
        nameNode.className = 'card-group-name';
        nameNode.addEventListener('contextmenu', (event) => {
            if (!this.activeName)
                return;
            event.preventDefault();
            if ((0,_features_pane_management__WEBPACK_IMPORTED_MODULE_4__.whichLeftPaneActive)() === _features_pane_management__WEBPACK_IMPORTED_MODULE_4__.LeftPaneType.Desktop) {
                (0,_features_desktop__WEBPACK_IMPORTED_MODULE_3__.removeItemFromDesktop)(this);
            }
            else {
                (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_2__.removeItemFromStack)(this);
            }
            return false;
        });
        nameNode.addEventListener('click', () => {
            if (!this.activeName)
                return;
            if ((0,_features_pane_management__WEBPACK_IMPORTED_MODULE_4__.whichLeftPaneActive)() === _features_pane_management__WEBPACK_IMPORTED_MODULE_4__.LeftPaneType.Desktop) {
                (0,_features_desktop__WEBPACK_IMPORTED_MODULE_3__.addItemToDesktop)(this);
            }
            else {
                (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_2__.addItemToStack)(this);
            }
        });
        // create children list
        const subcardNode = document.createElement('div');
        const subcardHeader = document.createElement('h4');
        const subcardContainer = document.createElement('div');
        subcardContainer.className = 'card-group-subcard-container';
        subcardHeader.innerHTML = 'Children:';
        subcardHeader.className = 'card-group-subcard-header';
        subcardNode.appendChild(subcardHeader);
        subcardNode.appendChild(subcardContainer);
        node.appendChild(subcardNode);
        const createSubcardItem = (i) => {
            const subcardItem = document.createElement('div');
            subcardItem.innerHTML = `- ${this.childrenIDs[i]}`;
            subcardItem.className = 'card-group-subcard-item';
            return subcardItem;
        };
        for (let i = 0; i < this.childrenIDs.length; i++) {
            subcardContainer.appendChild(createSubcardItem(i));
        }
        // add buttons
        const buttonRow = document.createElement('div');
        const copyJSONButton = document.createElement('button');
        copyJSONButton.innerText = 'Copy JSON';
        copyJSONButton.addEventListener('click', () => (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_1__.copyToClipboard)(this.toJSON()));
        buttonRow.appendChild(copyJSONButton);
        const copyUniqueIDButton = document.createElement('button');
        copyUniqueIDButton.innerHTML = 'Copy ID';
        copyUniqueIDButton.addEventListener('click', () => (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_1__.copyToClipboard)(this.uniqueID));
        buttonRow.appendChild(copyUniqueIDButton);
        buttonRow.className = 'card-button-row';
        node.appendChild(buttonRow);
        // finalize node construction
        node.className = 'card-group';
        if (id.length > 0)
            node.id = id;
        return node;
    }
    disableNameAdding() {
        this.activeName = false;
    }
    setChildrenIDs(childrenIDs) {
        this.childrenIDs = childrenIDs.sort();
        this.constructNode(this.nodeID);
    }
    toJSON() {
        return `{
    "name": "${this.name}",
    "uniqueID": "${this.uniqueID}",
    "description": "${(0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.toJSONSafeText)(this.description)}",
    "childrenIDs": ${JSON.stringify(this.childrenIDs)}
}`;
    }
    getNode() {
        return this.node;
    }
    getDesktopNode() {
        return this.nodeDesktopCopy;
    }
}


/***/ }),

/***/ "./src/features/card-authoring.ts":
/*!****************************************!*\
  !*** ./src/features/card-authoring.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initCardAuthoring": () => (/* binding */ initCardAuthoring)
/* harmony export */ });
/* harmony import */ var _util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/json-text-converter */ "./src/util/json-text-converter.ts");
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../card */ "./src/card.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/clipboard */ "./src/util/clipboard.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const initCardAuthoring = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardNameInput = document.getElementById('card-name-input');
    const cardDescriptionInput = document.getElementById('card-description-input');
    const cardDescriptionOutput = document.getElementById('card-description-output');
    const previewCardContainer = document.getElementById('card-preview-container');
    const cardCategoryInput = document.getElementById('card-category-input');
    const cardSubcardInput = document.getElementById('card-subcard-input');
    // meta variables whose state is not carried in innerHTML
    let creationDate = new Date();
    const descriptionInputUpdate = () => {
        const name = cardNameInput.value;
        const description = cardDescriptionInput.value;
        const previewCard = new _card__WEBPACK_IMPORTED_MODULE_1__.Card(name, description, 'preview-card');
        previewCard.setDates(creationDate, new Date());
        previewCard.setCategories(cardCategoryInput.value.split(',').map(name => name.trim()).filter(name => name.length > 0));
        previewCard.setSubcards(cardSubcardInput.value.split('\n').map(name => name.trim()).filter(name => name.length > 0));
        previewCard.disableNameAdding();
        cardDescriptionOutput.value = previewCard.toJSON();
        const previewCardNode = previewCard.getNode();
        previewCardContainer.childNodes.forEach(node => node.remove());
        previewCardContainer.appendChild(previewCardNode);
        // @ts-ignore
        if (window.MathJax)
            MathJax.typeset([previewCardNode]);
    };
    const descriptionOutputUpdate = () => {
        try {
            const object = JSON.parse(cardDescriptionOutput.value);
            const hasName = object.name !== undefined && typeof object.name == 'string';
            const hasDescription = object.description !== undefined && typeof object.description == 'string';
            const hasCreationDate = object.creationDate !== undefined && typeof object.creationDate == 'string';
            const hasCategories = object.categories !== undefined && typeof object.categories == 'object';
            const hasSubcards = object.subcards !== undefined && typeof object.subcards == 'object';
            if (hasName && hasDescription && hasCreationDate &&
                hasCategories && hasSubcards) {
                cardNameInput.value = object.name;
                cardDescriptionInput.value = (0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.fromJSONSafeText)(object.description);
                creationDate = new Date(object.creationDate);
                cardCategoryInput.value = object.categories.join(', ');
                cardSubcardInput.value = object.subcards.join('\n');
                descriptionInputUpdate();
            }
        }
        catch (e) {
            console.log(e);
            return;
        }
    };
    cardNameInput.addEventListener('input', descriptionInputUpdate);
    cardDescriptionInput.addEventListener('input', descriptionInputUpdate);
    cardDescriptionOutput.addEventListener('input', descriptionOutputUpdate);
    cardCategoryInput.addEventListener('input', descriptionInputUpdate);
    cardSubcardInput.addEventListener('input', descriptionInputUpdate);
    const copyButton = document.getElementById('card-authoring-copy-button');
    const pasteButton = document.getElementById('card-authoring-paste-button');
    const clearButton = document.getElementById('card-authoring-clear-button');
    copyButton.addEventListener('click', () => {
        (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_2__.copyToClipboard)(cardDescriptionOutput.value);
    });
    pasteButton.addEventListener('click', () => {
        (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_2__.copyFromClipboard)().then(text => {
            cardDescriptionOutput.value = text;
            descriptionOutputUpdate();
        });
    });
    clearButton.addEventListener('click', () => {
        cardNameInput.value = '';
        cardDescriptionInput.value = '';
        creationDate = new Date();
        cardCategoryInput.value = '';
        cardSubcardInput.value = '';
        descriptionInputUpdate();
    });
    descriptionInputUpdate();
});


/***/ }),

/***/ "./src/features/card-group-authoring.ts":
/*!**********************************************!*\
  !*** ./src/features/card-group-authoring.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initCardGroupAuthoring": () => (/* binding */ initCardGroupAuthoring)
/* harmony export */ });
/* harmony import */ var _util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/json-text-converter */ "./src/util/json-text-converter.ts");
/* harmony import */ var _cardgroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../cardgroup */ "./src/cardgroup.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/clipboard */ "./src/util/clipboard.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const initCardGroupAuthoring = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardGroupNameInput = document.getElementById('card-group-name-input');
    const cardGroupDescriptionInput = document.getElementById('card-group-description-input');
    const cardGroupDescriptionOutput = document.getElementById('card-group-description-output');
    const previewCardGroupContainer = document.getElementById('card-group-preview-container');
    const cardGroupChildrenInput = document.getElementById('card-group-category-input');
    // meta variables whose state is not carried in innerHTML
    let creationDate = new Date();
    const descriptionInputUpdate = () => {
        const name = cardGroupNameInput.value;
        const description = cardGroupDescriptionInput.value;
        const previewCardGroup = new _cardgroup__WEBPACK_IMPORTED_MODULE_1__.CardGroup(name, description, 'preview-card');
        previewCardGroup.setChildrenIDs(cardGroupChildrenInput.value.split('\n').map(name => name.trim()).filter(name => name.length > 0));
        previewCardGroup.disableNameAdding();
        cardGroupDescriptionOutput.value = previewCardGroup.toJSON();
        const previewCardGroupNode = previewCardGroup.getNode();
        previewCardGroupContainer.childNodes.forEach(node => node.remove());
        previewCardGroupContainer.appendChild(previewCardGroupNode);
        // @ts-ignore
        if (window.MathJax)
            MathJax.typeset([previewCardGroupNode]);
    };
    const descriptionOutputUpdate = () => {
        try {
            const object = JSON.parse(cardGroupDescriptionOutput.value);
            const hasName = object.name !== undefined && typeof object.name == 'string';
            const hasDescription = object.description !== undefined && typeof object.description == 'string';
            const hasChildrenIDs = object.childrenIDs !== undefined && typeof object.childrenIDs == 'object';
            if (hasName && hasDescription && hasChildrenIDs) {
                cardGroupNameInput.value = object.name;
                cardGroupDescriptionInput.value = (0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.fromJSONSafeText)(object.description);
                cardGroupChildrenInput.value = object.childrenIDs.join('\n');
                descriptionInputUpdate();
            }
        }
        catch (e) {
            console.log(e);
            return;
        }
    };
    cardGroupNameInput.addEventListener('input', descriptionInputUpdate);
    cardGroupDescriptionInput.addEventListener('input', descriptionInputUpdate);
    cardGroupDescriptionOutput.addEventListener('input', descriptionOutputUpdate);
    cardGroupChildrenInput.addEventListener('input', descriptionInputUpdate);
    const copyButton = document.getElementById('card-group-authoring-copy-button');
    const pasteButton = document.getElementById('card-group-authoring-paste-button');
    const clearButton = document.getElementById('card-group-authoring-clear-button');
    copyButton.addEventListener('click', () => {
        (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_2__.copyToClipboard)(cardGroupDescriptionOutput.value);
    });
    pasteButton.addEventListener('click', () => {
        (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_2__.copyFromClipboard)().then(text => {
            cardGroupDescriptionOutput.value = text;
            descriptionOutputUpdate();
        });
    });
    clearButton.addEventListener('click', () => {
        cardGroupNameInput.value = '';
        cardGroupDescriptionInput.value = '';
        cardGroupChildrenInput.value = '';
        descriptionInputUpdate();
    });
    descriptionInputUpdate();
});


/***/ }),

/***/ "./src/features/desktop.ts":
/*!*********************************!*\
  !*** ./src/features/desktop.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addItemToDesktop": () => (/* binding */ addItemToDesktop),
/* harmony export */   "initDesktop": () => (/* binding */ initDesktop),
/* harmony export */   "removeItemFromDesktop": () => (/* binding */ removeItemFromDesktop),
/* harmony export */   "saveDesktop": () => (/* binding */ saveDesktop)
/* harmony export */ });
/* harmony import */ var _util_download__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/download */ "./src/util/download.ts");
/* harmony import */ var _util_date__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/date */ "./src/util/date.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


let selectedSlot = null;
let slotNodes = [];
let columns = 2;
let slots = 50;
const initDesktop = (cards, cardGroups) => {
    const desktopSurface = document.getElementById('desktop-container');
    const combinedItems = [...cards, ...cardGroups];
    // create interactive surface
    const clickOnSlot = (slot) => {
        // deactivate slot if card/cardgroup is already inside slot
        if (slot.children.length > 0)
            return;
        // handle border selection visual
        slotNodes.forEach(slot => {
            slot.style.border = '1px lightgray';
            slot.style.borderStyle = 'dashed';
        });
        if (selectedSlot !== slot) {
            selectedSlot = slot;
            selectedSlot.style.border = '1px solid black';
            selectedSlot.style.borderStyle = 'solid';
        }
        else {
            selectedSlot = null;
        }
        // handle dynamic cursor over
        slotNodes.forEach(slot => {
            if (slot.children.length === 0) {
                slot.style.cursor = 'pointer';
            }
            else {
                slot.style.cursor = 'default';
            }
        });
    };
    const constructSurface = (slotsToLoad) => {
        desktopSurface.innerHTML = '';
        slotNodes = [];
        let counter = 0;
        for (let x = 0; x < slots; x++) {
            const row = document.createElement('div');
            row.className = `desktop-row`;
            for (let y = 0; y < columns; y++) {
                const slot = document.createElement('div');
                slot.className = `desktop-slot${y !== 0 ? ' desktop-margin-left' : ''}`;
                slot.addEventListener('click', () => {
                    clickOnSlot(slot);
                });
                row.append(slot);
                slotNodes.push(slot);
                counter += 1;
            }
            desktopSurface.append(row);
        }
        // if loading in slots from json import
        if (!slotsToLoad)
            return;
        counter = 0;
        for (let x = 0; x < slots; x++) {
            for (let y = 0; y < columns; y++) {
                const loadedID = slotsToLoad[counter];
                const currentSlot = slotNodes[counter];
                if (loadedID !== null) {
                    const item = combinedItems.find(item => item.uniqueID === loadedID);
                    if (item !== undefined) {
                        selectedSlot = currentSlot;
                        addItemToDesktop(item);
                    }
                }
                counter += 1;
            }
        }
        selectedSlot = null;
    };
    constructSurface();
    // handle top bar buttons
    const clearButton = document.getElementById('desktop-clear-button');
    const importButton = document.getElementById('desktop-import-button');
    const importFileInput = document.getElementById('desktop-import-file');
    const exportButton = document.getElementById('desktop-export-button');
    clearButton.addEventListener('click', () => {
        slotNodes.forEach(node => {
            node.innerHTML = '';
            node.style.border = '1px lightgray';
            node.style.borderStyle = 'dashed';
            node.style.cursor = 'pointer';
        });
        selectedSlot = null;
        saveDesktop();
    });
    importButton.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', () => __awaiter(void 0, void 0, void 0, function* () {
        const files = importFileInput.files;
        if (!files)
            return;
        const fileData = yield files[0].text();
        const importData = JSON.parse(fileData);
        columns = importData.columns;
        slots = importData.slots;
        constructSurface(importData.data);
        importFileInput.value = '';
        saveDesktop();
    }));
    exportButton.addEventListener('click', () => {
        const exportData = {
            columns: columns,
            slots: slots,
            data: slotNodes.map(slot => {
                if (slot.children.length === 0) {
                    return null;
                }
                else {
                    return slot.children[0].id;
                }
            })
        };
        (0,_util_download__WEBPACK_IMPORTED_MODULE_0__.downloadFile)(`desktop-${(0,_util_date__WEBPACK_IMPORTED_MODULE_1__.getHHMM)()}-${(0,_util_date__WEBPACK_IMPORTED_MODULE_1__.getMMDDYYYY)()}.json`, JSON.stringify(exportData, null, 4));
    });
    // local storage loading...
    const importDataJSON = localStorage.getItem("desktop-data");
    if (importDataJSON !== null) {
        try {
            const importData = JSON.parse(importDataJSON);
            columns = importData.columns;
            slots = importData.slots;
            constructSurface(importData.data);
        }
        catch (e) {
        }
    }
};
// local storage desktop saving...
const saveDesktop = () => {
    const data = {
        columns: columns,
        slots: slots,
        data: slotNodes.map(slot => {
            if (slot.children.length === 0) {
                return null;
            }
            else {
                return slot.children[0].id;
            }
        })
    };
    localStorage.setItem("desktop-data", JSON.stringify(data));
};
const addItemToDesktop = (item) => {
    const currentNode = item.getDesktopNode();
    // @ts-ignore
    if (window.MathJax)
        MathJax.typeset([currentNode]);
    if (!selectedSlot)
        return;
    if (selectedSlot.children.length > 0)
        return; // don't replace a card that's already in there
    selectedSlot.appendChild(currentNode);
    selectedSlot.style.border = '1px lightgray';
    selectedSlot.style.borderStyle = 'dashed';
    selectedSlot.style.cursor = 'default';
    selectedSlot = null;
    saveDesktop();
};
const removeItemFromDesktop = (item) => {
    const currentNode = item.getDesktopNode();
    currentNode.remove();
    saveDesktop();
};


/***/ }),

/***/ "./src/features/hierarchy.ts":
/*!***********************************!*\
  !*** ./src/features/hierarchy.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initHierarchy": () => (/* binding */ initHierarchy)
/* harmony export */ });
/* harmony import */ var _cardgroup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cardgroup */ "./src/cardgroup.ts");
/* harmony import */ var _desktop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./desktop */ "./src/features/desktop.ts");
/* harmony import */ var _pane_management__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pane-management */ "./src/features/pane-management.ts");
/* harmony import */ var _search_stack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./search-stack */ "./src/features/search-stack.ts");




const initHierarchy = (cards, cardGroups) => {
    const hierarchyRoot = document.getElementById('hierarchy-root');
    const empty = document.getElementById('hierarchy-empty');
    const rootGroups = cardGroups.filter(group => cardGroups.every(otherGroup => {
        const thisID = group.uniqueID;
        if (thisID === otherGroup.uniqueID)
            return true;
        else
            return otherGroup.childrenIDs.every(childID => childID !== thisID);
    }));
    const rootCards = cards.filter(card => cardGroups.every(group => group.childrenIDs.every(childID => card.uniqueID != childID)));
    const combinedItems = [...cards, ...cardGroups];
    const hierarchyManager = new Map();
    const createHierarchyItem = (id, insertAfter, depth) => {
        const correspondingItem = combinedItems.find(item => item.uniqueID === id);
        const isCardGroup = correspondingItem instanceof _cardgroup__WEBPACK_IMPORTED_MODULE_0__.CardGroup;
        const itemContainer = document.createElement('div');
        const item = document.createElement('div');
        const itemChildrenContainer = document.createElement('div');
        const itemEmptyChild = document.createElement('div');
        itemContainer.className = 'hierarchy-item-container';
        item.className = 'hierarchy-item';
        itemChildrenContainer.className = 'hierarchy-item-child-container';
        const leftPadding = document.createElement('div');
        leftPadding.innerHTML = '&nbsp;'.repeat(depth * 3);
        const label = document.createElement('div');
        label.innerHTML = isCardGroup ? `<b>${id}</b>` : `${id}`;
        label.className = 'hierarchy-label';
        const toggleButton = document.createElement('button');
        toggleButton.className = 'hierarchy-toggle-button';
        toggleButton.innerHTML = '+';
        item.appendChild(leftPadding);
        if (isCardGroup) {
            item.appendChild(toggleButton);
        }
        else {
            const cardSpacer = document.createElement('div');
            cardSpacer.innerHTML = '-&nbsp;';
            cardSpacer.className = 'hierarchy-non-toggle-spacer';
            item.appendChild(cardSpacer);
        }
        item.appendChild(label);
        itemContainer.appendChild(item);
        itemContainer.appendChild(itemChildrenContainer);
        itemChildrenContainer.appendChild(itemEmptyChild);
        insertAfter.insertAdjacentElement("afterend", itemContainer);
        let addedChildren = [];
        toggleButton.addEventListener('click', () => {
            if (toggleButton.innerHTML === "+") { // expand
                toggleButton.innerHTML = "-";
                const targetGroup = cardGroups.find(group => group.uniqueID === id);
                const childrenIDs = targetGroup.childrenIDs;
                let prevItem = itemEmptyChild;
                childrenIDs.forEach(id => {
                    const newItem = createHierarchyItem(id, prevItem, depth + 1);
                    addedChildren.push(newItem);
                    prevItem = newItem;
                });
            }
            else { // close
                toggleButton.innerHTML = "+";
                addedChildren.forEach(child => child.remove());
                addedChildren = [];
            }
        });
        const internalItem = {
            uniqueID: id,
            depth: depth,
            emptyChild: itemEmptyChild
        };
        hierarchyManager.set(id, internalItem);
        label.addEventListener('click', () => {
            if (!correspondingItem)
                return;
            if ((0,_pane_management__WEBPACK_IMPORTED_MODULE_2__.whichLeftPaneActive)() === _pane_management__WEBPACK_IMPORTED_MODULE_2__.LeftPaneType.Desktop) {
                (0,_desktop__WEBPACK_IMPORTED_MODULE_1__.addItemToDesktop)(correspondingItem);
            }
            else {
                (0,_search_stack__WEBPACK_IMPORTED_MODULE_3__.addItemToStack)(correspondingItem);
            }
        });
        return itemContainer;
    };
    let prevItem = empty;
    rootGroups.forEach(rootGroup => {
        const newItem = createHierarchyItem(rootGroup.uniqueID, prevItem, 0);
        prevItem = newItem;
    });
};


/***/ }),

/***/ "./src/features/pane-management.ts":
/*!*****************************************!*\
  !*** ./src/features/pane-management.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LeftPaneType": () => (/* binding */ LeftPaneType),
/* harmony export */   "RightPaneType": () => (/* binding */ RightPaneType),
/* harmony export */   "initPaneManagement": () => (/* binding */ initPaneManagement),
/* harmony export */   "whichLeftPaneActive": () => (/* binding */ whichLeftPaneActive)
/* harmony export */ });
var LeftPaneType;
(function (LeftPaneType) {
    LeftPaneType[LeftPaneType["Desktop"] = 0] = "Desktop";
    LeftPaneType[LeftPaneType["SearchStack"] = 1] = "SearchStack";
})(LeftPaneType || (LeftPaneType = {}));
var RightPaneType;
(function (RightPaneType) {
    RightPaneType[RightPaneType["CreateCard"] = 0] = "CreateCard";
    RightPaneType[RightPaneType["CreateCardGroup"] = 1] = "CreateCardGroup";
    RightPaneType[RightPaneType["Search"] = 2] = "Search";
    RightPaneType[RightPaneType["Metadata"] = 3] = "Metadata";
    RightPaneType[RightPaneType["Hierarchy"] = 4] = "Hierarchy";
})(RightPaneType || (RightPaneType = {}));
const initPaneManagement = (defaultLeft = LeftPaneType.SearchStack, defaultRight = RightPaneType.CreateCardGroup) => {
    const leftPaneDesktop = document.getElementById("left-pane-desktop");
    const leftPaneSearchStack = document.getElementById("left-pane-search-stack");
    const rightPaneCreateCard = document.getElementById("right-pane-create-card");
    const rightPaneCreateCardGroup = document.getElementById("right-pane-create-card-group");
    const rightPaneSearch = document.getElementById("right-pane-search");
    const rightPaneMetadata = document.getElementById("right-pane-metadata");
    const rightPaneHierarchy = document.getElementById("right-pane-hierarchy");
    const leftPaneButtonDesktop = document.getElementById("left-pane-button-desktop");
    const leftPaneButtonSearchStack = document.getElementById("left-pane-button-search-stack");
    const rightPaneButtonCreateCard = document.getElementById("right-pane-button-create-card");
    const rightPaneButtonCreateCardGroup = document.getElementById("right-pane-button-create-card-group");
    const rightPaneButtonSearch = document.getElementById("right-pane-button-search");
    const rightPaneButtonMetadata = document.getElementById("right-pane-button-metadata");
    const rightPaneButtonHierarchy = document.getElementById("right-pane-button-hierarchy");
    const leftPaneNodeEnumPairs = [
        [leftPaneDesktop, LeftPaneType.Desktop],
        [leftPaneSearchStack, LeftPaneType.SearchStack]
    ];
    const leftPaneClicked = (selectedPane) => {
        leftPaneNodeEnumPairs.forEach(pair => {
            if (pair[1] === selectedPane)
                pair[0].style.display = 'flex';
            else
                pair[0].style.display = 'none';
        });
    };
    const rightPaneNodeEnumPairs = [
        [rightPaneCreateCard, RightPaneType.CreateCard],
        [rightPaneCreateCardGroup, RightPaneType.CreateCardGroup],
        [rightPaneSearch, RightPaneType.Search],
        [rightPaneMetadata, RightPaneType.Metadata],
        [rightPaneHierarchy, RightPaneType.Hierarchy],
    ];
    const rightPaneClicked = (selectedPane) => {
        rightPaneNodeEnumPairs.forEach(pair => {
            if (pair[1] === selectedPane)
                pair[0].style.display = 'flex';
            else
                pair[0].style.display = 'none';
        });
    };
    leftPaneButtonDesktop.addEventListener('click', () => leftPaneClicked(LeftPaneType.Desktop));
    leftPaneButtonSearchStack.addEventListener('click', () => leftPaneClicked(LeftPaneType.SearchStack));
    rightPaneButtonCreateCard.addEventListener('click', () => rightPaneClicked(RightPaneType.CreateCard));
    rightPaneButtonCreateCardGroup.addEventListener('click', () => rightPaneClicked(RightPaneType.CreateCardGroup));
    rightPaneButtonSearch.addEventListener('click', () => rightPaneClicked(RightPaneType.Search));
    rightPaneButtonMetadata.addEventListener('click', () => rightPaneClicked(RightPaneType.Metadata));
    rightPaneButtonHierarchy.addEventListener('click', () => rightPaneClicked(RightPaneType.Hierarchy));
    // finalize pane management and disable select buttons
    leftPaneClicked(defaultLeft);
    rightPaneClicked(defaultRight);
    rightPaneButtonMetadata.style.display = 'none';
};
const whichLeftPaneActive = () => {
    const leftPaneDesktop = document.getElementById("left-pane-desktop");
    const leftPaneSearchStack = document.getElementById("left-pane-search-stack");
    if (leftPaneDesktop.style.display !== 'none') {
        return LeftPaneType.Desktop;
    }
    else if (leftPaneSearchStack.style.display !== 'none') {
        return LeftPaneType.SearchStack;
    }
    else {
        return LeftPaneType.SearchStack; // default to the search stack
    }
};


/***/ }),

/***/ "./src/features/search-stack.ts":
/*!**************************************!*\
  !*** ./src/features/search-stack.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addItemToStack": () => (/* binding */ addItemToStack),
/* harmony export */   "initSearchStack": () => (/* binding */ initSearchStack),
/* harmony export */   "removeItemFromStack": () => (/* binding */ removeItemFromStack),
/* harmony export */   "saveStack": () => (/* binding */ saveStack)
/* harmony export */ });
const searchStackContainer = document.getElementById('search-stack-container');
const initSearchStack = (cards, cardGroups) => {
    const combinedItems = [...cards, ...cardGroups];
    const clearStackButton = document.getElementById('search-stack-clear-button');
    clearStackButton.addEventListener('click', () => {
        searchStackContainer.innerHTML = '';
        saveStack();
    });
    // local storage loading...
    const prevData = localStorage.getItem("stack-data");
    if (prevData !== null) {
        try {
            const data = JSON.parse(prevData);
            data.stack.forEach(id => {
                const item = combinedItems.find(item => item.uniqueID === id);
                if (!item)
                    return;
                searchStackContainer.append(item.getNode());
            });
        }
        catch (e) {
        }
    }
};
// local storage stack saving...
const saveStack = () => {
    const data = { stack: [] };
    for (let child of searchStackContainer.children) {
        data.stack.push(child.id);
    }
    ;
    localStorage.setItem("stack-data", JSON.stringify(data));
};
const addItemToStack = (item) => {
    const currentNode = item.getNode();
    // @ts-ignore
    if (window.MathJax)
        MathJax.typeset([currentNode]);
    searchStackContainer.prepend(currentNode);
    saveStack();
};
const removeItemFromStack = (item) => {
    const currentNode = item.getNode();
    currentNode.remove();
    saveStack();
};


/***/ }),

/***/ "./src/features/search.ts":
/*!********************************!*\
  !*** ./src/features/search.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initSearch": () => (/* binding */ initSearch)
/* harmony export */ });
/* harmony import */ var elasticlunr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! elasticlunr */ "./node_modules/elasticlunr/elasticlunr.js");
/* harmony import */ var elasticlunr__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(elasticlunr__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _search_stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search-stack */ "./src/features/search-stack.ts");
/* harmony import */ var _desktop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./desktop */ "./src/features/desktop.ts");
/* harmony import */ var _pane_management__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pane-management */ "./src/features/pane-management.ts");




const initSearch = (cards, cardGroups) => {
    const combinedItems = [...cards, ...cardGroups];
    const index = elasticlunr__WEBPACK_IMPORTED_MODULE_0__(function () {
        this.addField('name');
        this.addField('description');
        this.setRef('id');
    });
    const documents = combinedItems.map(item => {
        return {
            name: item.name,
            description: item.description,
            id: item.uniqueID.replace(/-/g, ' ')
        };
    });
    documents.forEach(document => index.addDoc(document));
    const searchBar = document.getElementById('search-query-input');
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchFilterCardsOnly = document.getElementById('search-filter-cards-only');
    const searchFilterCardgroupsOnly = document.getElementById('search-filter-cardgroups-only');
    const runSearchQuery = () => {
        const query = searchBar.value;
        const results = index.search(query, {
            fields: {
                name: { boost: 2 },
                description: { boost: 1 },
            }
        });
        localStorage.setItem("search-query", query);
        searchResultsContainer.innerHTML = '';
        results.forEach(result => {
            const isCard = result.ref.slice(0, 3) !== '[G]';
            if (searchFilterCardsOnly.checked && !searchFilterCardgroupsOnly.checked) {
                if (!isCard)
                    return;
            }
            else if (!searchFilterCardsOnly.checked && searchFilterCardgroupsOnly.checked) {
                if (isCard)
                    return;
            }
            const searchItem = document.createElement('div');
            searchItem.className = 'search-result-item';
            const searchHeader = document.createElement('h3');
            searchHeader.className = 'search-item-header';
            searchHeader.innerHTML = result.ref; //.replace(/ /g, '-');
            const searchButtonRow = document.createElement('div');
            searchButtonRow.className = 'search-button-row';
            // const addToStackButton = document.createElement('button');
            // addToStackButton.innerHTML = 'Add to Stack';
            // searchButtonRow.append(addToStackButton);
            // const addToDesktopButton = document.createElement('button');
            // addToDesktopButton.innerHTML = 'Add to Desktop';
            // searchButtonRow.append(addToDesktopButton);
            searchItem.append(searchHeader);
            // searchItem.append(searchButtonRow);
            searchResultsContainer.append(searchItem);
            searchItem.addEventListener('click', () => {
                const thisID = result.ref.replace(/ /g, '-');
                const item = combinedItems.find(item => item.uniqueID === thisID);
                if (!item)
                    return;
                if ((0,_pane_management__WEBPACK_IMPORTED_MODULE_3__.whichLeftPaneActive)() === _pane_management__WEBPACK_IMPORTED_MODULE_3__.LeftPaneType.Desktop) {
                    (0,_desktop__WEBPACK_IMPORTED_MODULE_2__.addItemToDesktop)(item);
                }
                else {
                    (0,_search_stack__WEBPACK_IMPORTED_MODULE_1__.addItemToStack)(item);
                }
            });
        });
    };
    searchBar.addEventListener('input', runSearchQuery);
    searchFilterCardsOnly.addEventListener('click', runSearchQuery);
    searchFilterCardgroupsOnly.addEventListener('click', runSearchQuery);
    // finalization\
    const prevQuery = localStorage.getItem("search-query");
    if (prevQuery) {
        searchBar.value = prevQuery;
        runSearchQuery();
    }
};


/***/ }),

/***/ "./src/util/clipboard.ts":
/*!*******************************!*\
  !*** ./src/util/clipboard.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "copyFromClipboard": () => (/* binding */ copyFromClipboard),
/* harmony export */   "copyToClipboard": () => (/* binding */ copyToClipboard)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const copyToClipboard = (content) => {
    return navigator.clipboard.writeText(content);
};
const copyFromClipboard = () => __awaiter(void 0, void 0, void 0, function* () {
    const text = yield navigator.clipboard.readText();
    return text;
});


/***/ }),

/***/ "./src/util/date.ts":
/*!**************************!*\
  !*** ./src/util/date.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getHHMM": () => (/* binding */ getHHMM),
/* harmony export */   "getMMDDYYYY": () => (/* binding */ getMMDDYYYY)
/* harmony export */ });
const getMMDDYYYY = () => {
    const date = new Date();
    const MM = `${date.getMonth() + 1}`.padStart(2, '0');
    const DD = `${date.getDate()}`.padStart(2, '0');
    const YYYY = `${date.getFullYear()}`;
    return `${MM}-${DD}-${YYYY}`;
};
const getHHMM = () => {
    const date = new Date();
    let XM = 'AM';
    let HH = date.getHours();
    if (HH === 0) {
        HH = 12;
        XM = 'AM';
    }
    else if (HH === 12) {
        XM = 'PM';
    }
    else if (HH >= 13) {
        HH -= 12;
        XM = 'PM';
    }
    HH = `${HH}`.padStart(2, '0');
    let MM = `${date.getMinutes()}`.padStart(2, '0');
    return `${HH}-${MM}${XM}`;
};


/***/ }),

/***/ "./src/util/download.ts":
/*!******************************!*\
  !*** ./src/util/download.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "downloadFile": () => (/* binding */ downloadFile)
/* harmony export */ });
const downloadFile = (filename, data) => {
    const blob = new Blob([data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};


/***/ }),

/***/ "./src/util/json-text-converter.ts":
/*!*****************************************!*\
  !*** ./src/util/json-text-converter.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromJSONSafeText": () => (/* binding */ fromJSONSafeText),
/* harmony export */   "toJSONSafeText": () => (/* binding */ toJSONSafeText)
/* harmony export */ });
const toJSONSafeText = (text) => {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/"/g, "\\\"");
};
const fromJSONSafeText = (text) => {
    return text
        .replace(/\\n/g, "\n")
        .replace(/\\"n/g, "\"");
};


/***/ }),

/***/ "./src/util/loader.ts":
/*!****************************!*\
  !*** ./src/util/loader.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadData": () => (/* binding */ loadData)
/* harmony export */ });
const loadData = (path) => {
    return new Promise((resolve) => {
        const client = new XMLHttpRequest();
        client.open('GET', path);
        client.responseType = 'json';
        client.onload = function () {
            const shaderCode = client.response;
            resolve(shaderCode);
        };
        client.send();
    });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./card */ "./src/card.ts");
/* harmony import */ var _util_loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/loader */ "./src/util/loader.ts");
/* harmony import */ var _features_card_authoring__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/card-authoring */ "./src/features/card-authoring.ts");
/* harmony import */ var _features_pane_management__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./features/pane-management */ "./src/features/pane-management.ts");
/* harmony import */ var _features_card_group_authoring__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./features/card-group-authoring */ "./src/features/card-group-authoring.ts");
/* harmony import */ var _cardgroup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cardgroup */ "./src/cardgroup.ts");
/* harmony import */ var _features_hierarchy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./features/hierarchy */ "./src/features/hierarchy.ts");
/* harmony import */ var _features_search__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./features/search */ "./src/features/search.ts");
/* harmony import */ var _features_search_stack__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./features/search-stack */ "./src/features/search-stack.ts");
/* harmony import */ var _features_desktop__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./features/desktop */ "./src/features/desktop.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};










const loadCards = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardMap = yield (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)('../card-map.json');
    const paths = cardMap.files;
    const cardsJSON = yield Promise.all(paths.map(path => (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)(`../data-cards/${path}.json`)));
    return cardsJSON;
});
const loadCardGroups = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardMap = yield (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)('../card-group-map.json');
    const paths = cardMap.files;
    const cardsJSON = yield Promise.all(paths.map(path => (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)(`../data-card-groups/${path}.json`)));
    return cardsJSON;
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    let cardsJSON = yield loadCards();
    let cardGroupsJSON = yield loadCardGroups();
    let cards = cardsJSON.map(data => {
        const card = new _card__WEBPACK_IMPORTED_MODULE_0__.Card(data.name, data.description);
        if (data.creationDate && data.editDate) {
            card.setDates(data.creationDate, data.editDate);
        }
        if (data.categories && data.subcards) {
            card.setCategories(data.categories);
            card.setSubcards(data.subcards);
        }
        return card;
    });
    let cardGroups = cardGroupsJSON.map(data => {
        const cardGroup = new _cardgroup__WEBPACK_IMPORTED_MODULE_5__.CardGroup(data.name, data.description);
        if (data.childrenIDs)
            cardGroup.setChildrenIDs(data.childrenIDs);
        return cardGroup;
    });
    // cards.forEach(card => {
    //     const domNode = card.getNode();
    //     leftPaneNode.append(domNode);
    //     leftPaneNode.append(createVSpacer(8));
    // });
    // cardGroups.forEach(cardGroup => {
    //     const domNode = cardGroup.getNode();
    //     leftPaneNode.append(domNode);
    //     leftPaneNode.append(createVSpacer(8));
    // });
    (0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.initPaneManagement)(_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.LeftPaneType.Desktop, _features_pane_management__WEBPACK_IMPORTED_MODULE_3__.RightPaneType.Search);
    (0,_features_card_authoring__WEBPACK_IMPORTED_MODULE_2__.initCardAuthoring)();
    (0,_features_card_group_authoring__WEBPACK_IMPORTED_MODULE_4__.initCardGroupAuthoring)();
    (0,_features_hierarchy__WEBPACK_IMPORTED_MODULE_6__.initHierarchy)(cards, cardGroups);
    (0,_features_search__WEBPACK_IMPORTED_MODULE_7__.initSearch)(cards, cardGroups);
    (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_8__.initSearchStack)(cards, cardGroups);
    (0,_features_desktop__WEBPACK_IMPORTED_MODULE_9__.initDesktop)(cards, cardGroups);
    // @ts-ignore
    if (window.MathJax)
        MathJax.typeset();
});
init();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxTQUFTLFFBQVEsU0FBUyxTQUFTLFdBQVc7QUFDbkY7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFdBQVcsU0FBUztBQUNwQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQkFBZ0I7QUFDM0IsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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NEI7QUFDNUIsZ0NBQWdDLGNBQWM7QUFDOUMsZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxrQkFBa0I7QUFDN0I7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIs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Y2VzIjpbIndlYnBhY2s6Ly9wYnJ0Ly4vbm9kZV9tb2R1bGVzL2VsYXN0aWNsdW5yL2VsYXN0aWNsdW5yLmpzIiwid2VicGFjazovL3BicnQvLi9zcmMvY2FyZC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2NhcmRncm91cC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL2NhcmQtYXV0aG9yaW5nLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvZmVhdHVyZXMvY2FyZC1ncm91cC1hdXRob3JpbmcudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9mZWF0dXJlcy9kZXNrdG9wLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvZmVhdHVyZXMvaGllcmFyY2h5LnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvZmVhdHVyZXMvcGFuZS1tYW5hZ2VtZW50LnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvZmVhdHVyZXMvc2VhcmNoLXN0YWNrLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvZmVhdHVyZXMvc2VhcmNoLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvdXRpbC9jbGlwYm9hcmQudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy91dGlsL2RhdGUudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy91dGlsL2Rvd25sb2FkLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvdXRpbC9qc29uLXRleHQtY29udmVydGVyLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvdXRpbC9sb2FkZXIudHMiLCJ3ZWJwYWNrOi8vcGJydC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYnJ0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3BicnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BicnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wYnJ0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGVsYXN0aWNsdW5yIC0gaHR0cDovL3dlaXhzb25nLmdpdGh1Yi5pb1xuICogTGlnaHR3ZWlnaHQgZnVsbC10ZXh0IHNlYXJjaCBlbmdpbmUgaW4gSmF2YXNjcmlwdCBmb3IgYnJvd3NlciBzZWFyY2ggYW5kIG9mZmxpbmUgc2VhcmNoLiAtIDAuOS41XG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKiBNSVQgTGljZW5zZWRcbiAqIEBsaWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKCl7XG5cbi8qIVxuICogZWxhc3RpY2x1bnIuanNcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGluc3RhbnRpYXRpbmcgYSBuZXcgZWxhc3RpY2x1bnIgaW5kZXggYW5kIGNvbmZpZ3VyaW5nIGl0XG4gKiB3aXRoIHRoZSBkZWZhdWx0IHBpcGVsaW5lIGZ1bmN0aW9ucyBhbmQgdGhlIHBhc3NlZCBjb25maWcgZnVuY3Rpb24uXG4gKlxuICogV2hlbiB1c2luZyB0aGlzIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGEgbmV3IGluZGV4IHdpbGwgYmUgY3JlYXRlZCB3aXRoIHRoZVxuICogZm9sbG93aW5nIGZ1bmN0aW9ucyBhbHJlYWR5IGluIHRoZSBwaXBlbGluZTpcbiAqIFxuICogMS4gZWxhc3RpY2x1bnIudHJpbW1lciAtIHRyaW0gbm9uLXdvcmQgY2hhcmFjdGVyXG4gKiAyLiBlbGFzdGljbHVuci5TdG9wV29yZEZpbHRlciAtIGZpbHRlcnMgb3V0IGFueSBzdG9wIHdvcmRzIGJlZm9yZSB0aGV5IGVudGVyIHRoZVxuICogaW5kZXhcbiAqIDMuIGVsYXN0aWNsdW5yLnN0ZW1tZXIgLSBzdGVtcyB0aGUgdG9rZW5zIGJlZm9yZSBlbnRlcmluZyB0aGUgaW5kZXguXG4gKlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgIHZhciBpZHggPSBlbGFzdGljbHVucihmdW5jdGlvbiAoKSB7XG4gKiAgICAgICB0aGlzLmFkZEZpZWxkKCdpZCcpO1xuICogICAgICAgdGhpcy5hZGRGaWVsZCgndGl0bGUnKTtcbiAqICAgICAgIHRoaXMuYWRkRmllbGQoJ2JvZHknKTtcbiAqICAgICAgIFxuICogICAgICAgLy90aGlzLnNldFJlZignaWQnKTsgLy8gZGVmYXVsdCByZWYgaXMgJ2lkJ1xuICpcbiAqICAgICAgIHRoaXMucGlwZWxpbmUuYWRkKGZ1bmN0aW9uICgpIHtcbiAqICAgICAgICAgLy8gc29tZSBjdXN0b20gcGlwZWxpbmUgZnVuY3Rpb25cbiAqICAgICAgIH0pO1xuICogICAgIH0pO1xuICogXG4gKiAgICBpZHguYWRkRG9jKHtcbiAqICAgICAgaWQ6IDEsIFxuICogICAgICB0aXRsZTogJ09yYWNsZSByZWxlYXNlZCBkYXRhYmFzZSAxMmcnLFxuICogICAgICBib2R5OiAnWWVzdGFkYXksIE9yYWNsZSBoYXMgcmVsZWFzZWQgdGhlaXIgbGF0ZXN0IGRhdGFiYXNlLCBuYW1lZCAxMmcsIG1vcmUgcm9idXN0LiB0aGlzIHByb2R1Y3Qgd2lsbCBpbmNyZWFzZSBPcmFjbGUgcHJvZml0LidcbiAqICAgIH0pO1xuICogXG4gKiAgICBpZHguYWRkRG9jKHtcbiAqICAgICAgaWQ6IDIsIFxuICogICAgICB0aXRsZTogJ09yYWNsZSByZWxlYXNlZCBhbm51YWwgcHJvZml0IHJlcG9ydCcsXG4gKiAgICAgIGJvZHk6ICdZZXN0YWRheSwgT3JhY2xlIGhhcyByZWxlYXNlZCB0aGVpciBhbm51YWwgcHJvZml0IHJlcG9ydCBvZiAyMDE1LCB0b3RhbCBwcm9maXQgaXMgMTIuNSBCaWxsaW9uLidcbiAqICAgIH0pO1xuICogXG4gKiAgICAjIHNpbXBsZSBzZWFyY2hcbiAqICAgIGlkeC5zZWFyY2goJ29yYWNsZSBkYXRhYmFzZScpO1xuICogXG4gKiAgICAjIHNlYXJjaCB3aXRoIHF1ZXJ5LXRpbWUgYm9vc3RpbmdcbiAqICAgIGlkeC5zZWFyY2goJ29yYWNsZSBkYXRhYmFzZScsIHtmaWVsZHM6IHt0aXRsZToge2Jvb3N0OiAyfSwgYm9keToge2Jvb3N0OiAxfX19KTtcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25maWcgQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIG5ldyBpbnN0YW5jZVxuICogb2YgdGhlIGVsYXN0aWNsdW5yLkluZGV4IGFzIGJvdGggaXRzIGNvbnRleHQgYW5kIGZpcnN0IHBhcmFtZXRlci4gSXQgY2FuIGJlIHVzZWQgdG9cbiAqIGN1c3RvbWl6ZSB0aGUgaW5zdGFuY2Ugb2YgbmV3IGVsYXN0aWNsdW5yLkluZGV4LlxuICogQG5hbWVzcGFjZVxuICogQG1vZHVsZVxuICogQHJldHVybiB7ZWxhc3RpY2x1bnIuSW5kZXh9XG4gKlxuICovXG52YXIgZWxhc3RpY2x1bnIgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gIHZhciBpZHggPSBuZXcgZWxhc3RpY2x1bnIuSW5kZXg7XG5cbiAgaWR4LnBpcGVsaW5lLmFkZChcbiAgICBlbGFzdGljbHVuci50cmltbWVyLFxuICAgIGVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyLFxuICAgIGVsYXN0aWNsdW5yLnN0ZW1tZXJcbiAgKTtcblxuICBpZiAoY29uZmlnKSBjb25maWcuY2FsbChpZHgsIGlkeCk7XG5cbiAgcmV0dXJuIGlkeDtcbn07XG5cbmVsYXN0aWNsdW5yLnZlcnNpb24gPSBcIjAuOS41XCI7XG5cbi8vIG9ubHkgdXNlZCB0aGlzIHRvIG1ha2UgZWxhc3RpY2x1bnIuanMgY29tcGF0aWJsZSB3aXRoIGx1bnItbGFuZ3VhZ2VzXG4vLyB0aGlzIGlzIGEgdHJpY2sgdG8gZGVmaW5lIGEgZ2xvYmFsIGFsaWFzIG9mIGVsYXN0aWNsdW5yXG5sdW5yID0gZWxhc3RpY2x1bnI7XG5cbi8qIVxuICogZWxhc3RpY2x1bnIudXRpbHNcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogQSBuYW1lc3BhY2UgY29udGFpbmluZyB1dGlscyBmb3IgdGhlIHJlc3Qgb2YgdGhlIGVsYXN0aWNsdW5yIGxpYnJhcnlcbiAqL1xuZWxhc3RpY2x1bnIudXRpbHMgPSB7fTtcblxuLyoqXG4gKiBQcmludCBhIHdhcm5pbmcgbWVzc2FnZSB0byB0aGUgY29uc29sZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBiZSBwcmludGVkLlxuICogQG1lbWJlck9mIFV0aWxzXG4gKi9cbmVsYXN0aWNsdW5yLnV0aWxzLndhcm4gPSAoZnVuY3Rpb24gKGdsb2JhbCkge1xuICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAoZ2xvYmFsLmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gICAgfVxuICB9O1xufSkodGhpcyk7XG5cbi8qKlxuICogQ29udmVydCBhbiBvYmplY3QgdG8gc3RyaW5nLlxuICpcbiAqIEluIHRoZSBjYXNlIG9mIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdGhlIGZ1bmN0aW9uIHJldHVybnNcbiAqIGFuIGVtcHR5IHN0cmluZywgaW4gYWxsIG90aGVyIGNhc2VzIHRoZSByZXN1bHQgb2YgY2FsbGluZ1xuICogYHRvU3RyaW5nYCBvbiB0aGUgcGFzc2VkIG9iamVjdCBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gY29udmVydCB0byBhIHN0cmluZy5cbiAqIEByZXR1cm4ge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwYXNzZWQgb2JqZWN0LlxuICogQG1lbWJlck9mIFV0aWxzXG4gKi9cbmVsYXN0aWNsdW5yLnV0aWxzLnRvU3RyaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICBpZiAob2JqID09PSB2b2lkIDAgfHwgb2JqID09PSBudWxsKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICByZXR1cm4gb2JqLnRvU3RyaW5nKCk7XG59O1xuLyohXG4gKiBlbGFzdGljbHVuci5FdmVudEVtaXR0ZXJcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogZWxhc3RpY2x1bnIuRXZlbnRFbWl0dGVyIGlzIGFuIGV2ZW50IGVtaXR0ZXIgZm9yIGVsYXN0aWNsdW5yLlxuICogSXQgbWFuYWdlcyBhZGRpbmcgYW5kIHJlbW92aW5nIGV2ZW50IGhhbmRsZXJzIGFuZCB0cmlnZ2VyaW5nIGV2ZW50cyBhbmQgdGhlaXIgaGFuZGxlcnMuXG4gKlxuICogRWFjaCBldmVudCBjb3VsZCBoYXMgbXVsdGlwbGUgY29ycmVzcG9uZGluZyBmdW5jdGlvbnMsXG4gKiB0aGVzZSBmdW5jdGlvbnMgd2lsbCBiZSBjYWxsZWQgYXMgdGhlIHNlcXVlbmNlIHRoYXQgdGhleSBhcmUgYWRkZWQgaW50byB0aGUgZXZlbnQuXG4gKiBcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5lbGFzdGljbHVuci5FdmVudEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZXZlbnRzID0ge307XG59O1xuXG4vKipcbiAqIEJpbmRzIGEgaGFuZGxlciBmdW5jdGlvbiB0byBhIHNwZWNpZmljIGV2ZW50KHMpLlxuICpcbiAqIENhbiBiaW5kIGEgc2luZ2xlIGZ1bmN0aW9uIHRvIG1hbnkgZGlmZmVyZW50IGV2ZW50cyBpbiBvbmUgY2FsbC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gW2V2ZW50TmFtZV0gVGhlIG5hbWUocykgb2YgZXZlbnRzIHRvIGJpbmQgdGhpcyBmdW5jdGlvbiB0by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gYW4gZXZlbnQgaXMgZmlyZWQuXG4gKiBAbWVtYmVyT2YgRXZlbnRFbWl0dGVyXG4gKi9cbmVsYXN0aWNsdW5yLkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcbiAgICAgIGZuID0gYXJncy5wb3AoKSxcbiAgICAgIG5hbWVzID0gYXJncztcblxuICBpZiAodHlwZW9mIGZuICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IgKFwibGFzdCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cbiAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmICghdGhpcy5oYXNIYW5kbGVyKG5hbWUpKSB0aGlzLmV2ZW50c1tuYW1lXSA9IFtdO1xuICAgIHRoaXMuZXZlbnRzW25hbWVdLnB1c2goZm4pO1xuICB9LCB0aGlzKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIGhhbmRsZXIgZnVuY3Rpb24gZnJvbSBhIHNwZWNpZmljIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZSB0aGlzIGZ1bmN0aW9uIGZyb20uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gcmVtb3ZlIGZyb20gYW4gZXZlbnQuXG4gKiBAbWVtYmVyT2YgRXZlbnRFbWl0dGVyXG4gKi9cbmVsYXN0aWNsdW5yLkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAobmFtZSwgZm4pIHtcbiAgaWYgKCF0aGlzLmhhc0hhbmRsZXIobmFtZSkpIHJldHVybjtcblxuICB2YXIgZm5JbmRleCA9IHRoaXMuZXZlbnRzW25hbWVdLmluZGV4T2YoZm4pO1xuICBpZiAoZm5JbmRleCA9PT0gLTEpIHJldHVybjtcblxuICB0aGlzLmV2ZW50c1tuYW1lXS5zcGxpY2UoZm5JbmRleCwgMSk7XG5cbiAgaWYgKHRoaXMuZXZlbnRzW25hbWVdLmxlbmd0aCA9PSAwKSBkZWxldGUgdGhpcy5ldmVudHNbbmFtZV07XG59O1xuXG4vKipcbiAqIENhbGwgYWxsIGZ1bmN0aW9ucyB0aGF0IGJvdW5kZWQgdG8gdGhlIGdpdmVuIGV2ZW50LlxuICpcbiAqIEFkZGl0aW9uYWwgZGF0YSBjYW4gYmUgcGFzc2VkIHRvIHRoZSBldmVudCBoYW5kbGVyIGFzIGFyZ3VtZW50cyB0byBgZW1pdGBcbiAqIGFmdGVyIHRoZSBldmVudCBuYW1lLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQuXG4gKiBAbWVtYmVyT2YgRXZlbnRFbWl0dGVyXG4gKi9cbmVsYXN0aWNsdW5yLkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmICghdGhpcy5oYXNIYW5kbGVyKG5hbWUpKSByZXR1cm47XG5cbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHRoaXMuZXZlbnRzW25hbWVdLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgZm4uYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgfSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgaGFuZGxlciBoYXMgZXZlciBiZWVuIHN0b3JlZCBhZ2FpbnN0IGFuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGNoZWNrLlxuICogQHByaXZhdGVcbiAqIEBtZW1iZXJPZiBFdmVudEVtaXR0ZXJcbiAqL1xuZWxhc3RpY2x1bnIuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5oYXNIYW5kbGVyID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUgaW4gdGhpcy5ldmVudHM7XG59O1xuLyohXG4gKiBlbGFzdGljbHVuci50b2tlbml6ZXJcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiBmb3Igc3BsaXR0aW5nIGEgc3RyaW5nIGludG8gdG9rZW5zLlxuICogQ3VycmVudGx5IEVuZ2xpc2ggaXMgc3VwcG9ydGVkIGFzIGRlZmF1bHQuXG4gKiBVc2VzIGBlbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yYCB0byBzcGxpdCBzdHJpbmdzLCB5b3UgY291bGQgY2hhbmdlXG4gKiB0aGUgdmFsdWUgb2YgdGhpcyBwcm9wZXJ0eSB0byBzZXQgaG93IHlvdSB3YW50IHN0cmluZ3MgYXJlIHNwbGl0IGludG8gdG9rZW5zLlxuICogSU1QT1JUQU5UOiB1c2UgZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvciBjYXJlZnVsbHksIGlmIHlvdSBhcmUgbm90IGZhbWlsaWFyIHdpdGhcbiAqIHRleHQgcHJvY2VzcywgdGhlbiB5b3UnZCBiZXR0ZXIgbm90IGNoYW5nZSBpdC5cbiAqXG4gKiBAbW9kdWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdGhhdCB5b3Ugd2FudCB0byB0b2tlbml6ZS5cbiAqIEBzZWUgZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvclxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmVsYXN0aWNsdW5yLnRva2VuaXplciA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoIHx8IHN0ciA9PT0gbnVsbCB8fCBzdHIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShzdHIpKSB7XG4gICAgdmFyIGFyciA9IHN0ci5maWx0ZXIoZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgIGlmICh0b2tlbiA9PT0gbnVsbCB8fCB0b2tlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICBhcnIgPSBhcnIubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gZWxhc3RpY2x1bnIudXRpbHMudG9TdHJpbmcodCkudG9Mb3dlckNhc2UoKTtcbiAgICB9KTtcblxuICAgIHZhciBvdXQgPSBbXTtcbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICB2YXIgdG9rZW5zID0gaXRlbS5zcGxpdChlbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yKTtcbiAgICAgIG91dCA9IG91dC5jb25jYXQodG9rZW5zKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICByZXR1cm4gc3RyLnRvU3RyaW5nKCkudHJpbSgpLnRvTG93ZXJDYXNlKCkuc3BsaXQoZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvcik7XG59O1xuXG4vKipcbiAqIERlZmF1bHQgc3RyaW5nIHNlcGVyYXRvci5cbiAqL1xuZWxhc3RpY2x1bnIudG9rZW5pemVyLmRlZmF1bHRTZXBlcmF0b3IgPSAvW1xcc1xcLV0rLztcblxuLyoqXG4gKiBUaGUgc3BlcmF0b3IgdXNlZCB0byBzcGxpdCBhIHN0cmluZyBpbnRvIHRva2Vucy4gT3ZlcnJpZGUgdGhpcyBwcm9wZXJ0eSB0byBjaGFuZ2UgdGhlIGJlaGF2aW91ciBvZlxuICogYGVsYXN0aWNsdW5yLnRva2VuaXplcmAgYmVoYXZpb3VyIHdoZW4gdG9rZW5pemluZyBzdHJpbmdzLiBCeSBkZWZhdWx0IHRoaXMgc3BsaXRzIG9uIHdoaXRlc3BhY2UgYW5kIGh5cGhlbnMuXG4gKlxuICogQHN0YXRpY1xuICogQHNlZSBlbGFzdGljbHVuci50b2tlbml6ZXJcbiAqL1xuZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvciA9IGVsYXN0aWNsdW5yLnRva2VuaXplci5kZWZhdWx0U2VwZXJhdG9yO1xuXG4vKipcbiAqIFNldCB1cCBjdXN0b21pemVkIHN0cmluZyBzZXBlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2VwIFRoZSBjdXN0b21pemVkIHNlcGVyYXRvciB0aGF0IHlvdSB3YW50IHRvIHVzZSB0byB0b2tlbml6ZSBhIHN0cmluZy5cbiAqL1xuZWxhc3RpY2x1bnIudG9rZW5pemVyLnNldFNlcGVyYXRvciA9IGZ1bmN0aW9uKHNlcCkge1xuICAgIGlmIChzZXAgIT09IG51bGwgJiYgc2VwICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mKHNlcCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3IgPSBzZXA7XG4gICAgfVxufVxuXG4vKipcbiAqIFJlc2V0IHN0cmluZyBzZXBlcmF0b3JcbiAqXG4gKi9cbmVsYXN0aWNsdW5yLnRva2VuaXplci5yZXNldFNlcGVyYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIGVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3IgPSBlbGFzdGljbHVuci50b2tlbml6ZXIuZGVmYXVsdFNlcGVyYXRvcjtcbn1cblxuLyoqXG4gKiBHZXQgc3RyaW5nIHNlcGVyYXRvclxuICpcbiAqL1xuZWxhc3RpY2x1bnIudG9rZW5pemVyLmdldFNlcGVyYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBlbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yO1xufVxuLyohXG4gKiBlbGFzdGljbHVuci5QaXBlbGluZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBlbGFzdGljbHVuci5QaXBlbGluZXMgbWFpbnRhaW4gYW4gb3JkZXJlZCBsaXN0IG9mIGZ1bmN0aW9ucyB0byBiZSBhcHBsaWVkIHRvIFxuICogYm90aCBkb2N1bWVudHMgdG9rZW5zIGFuZCBxdWVyeSB0b2tlbnMuXG4gKlxuICogQW4gaW5zdGFuY2Ugb2YgZWxhc3RpY2x1bnIuSW5kZXggd2lsbCBjb250YWluIGEgcGlwZWxpbmVcbiAqIHdpdGggYSB0cmltbWVyLCBhIHN0b3Agd29yZCBmaWx0ZXIsIGFuIEVuZ2xpc2ggc3RlbW1lci4gRXh0cmFcbiAqIGZ1bmN0aW9ucyBjYW4gYmUgYWRkZWQgYmVmb3JlIG9yIGFmdGVyIGVpdGhlciBvZiB0aGVzZSBmdW5jdGlvbnMgb3IgdGhlc2VcbiAqIGRlZmF1bHQgZnVuY3Rpb25zIGNhbiBiZSByZW1vdmVkLlxuICpcbiAqIFdoZW4gcnVuIHRoZSBwaXBlbGluZSwgaXQgd2lsbCBjYWxsIGVhY2ggZnVuY3Rpb24gaW4gdHVybi5cbiAqXG4gKiBUaGUgb3V0cHV0IG9mIHRoZSBmdW5jdGlvbnMgaW4gdGhlIHBpcGVsaW5lIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBuZXh0IGZ1bmN0aW9uXG4gKiBpbiB0aGUgcGlwZWxpbmUuIFRvIGV4Y2x1ZGUgYSB0b2tlbiBmcm9tIGVudGVyaW5nIHRoZSBpbmRleCB0aGUgZnVuY3Rpb25cbiAqIHNob3VsZCByZXR1cm4gdW5kZWZpbmVkLCB0aGUgcmVzdCBvZiB0aGUgcGlwZWxpbmUgd2lsbCBub3QgYmUgY2FsbGVkIHdpdGhcbiAqIHRoaXMgdG9rZW4uXG4gKlxuICogRm9yIHNlcmlhbGlzYXRpb24gb2YgcGlwZWxpbmVzIHRvIHdvcmssIGFsbCBmdW5jdGlvbnMgdXNlZCBpbiBhbiBpbnN0YW5jZSBvZlxuICogYSBwaXBlbGluZSBzaG91bGQgYmUgcmVnaXN0ZXJlZCB3aXRoIGVsYXN0aWNsdW5yLlBpcGVsaW5lLiBSZWdpc3RlcmVkIGZ1bmN0aW9ucyBjYW5cbiAqIHRoZW4gYmUgbG9hZGVkLiBJZiB0cnlpbmcgdG8gbG9hZCBhIHNlcmlhbGlzZWQgcGlwZWxpbmUgdGhhdCB1c2VzIGZ1bmN0aW9uc1xuICogdGhhdCBhcmUgbm90IHJlZ2lzdGVyZWQgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKlxuICogSWYgbm90IHBsYW5uaW5nIG9uIHNlcmlhbGlzaW5nIHRoZSBwaXBlbGluZSB0aGVuIHJlZ2lzdGVyaW5nIHBpcGVsaW5lIGZ1bmN0aW9uc1xuICogaXMgbm90IG5lY2Vzc2FyeS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX3F1ZXVlID0gW107XG59O1xuXG5lbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlcmVkRnVuY3Rpb25zID0ge307XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBmdW5jdGlvbiBpbiB0aGUgcGlwZWxpbmUuXG4gKlxuICogRnVuY3Rpb25zIHRoYXQgYXJlIHVzZWQgaW4gdGhlIHBpcGVsaW5lIHNob3VsZCBiZSByZWdpc3RlcmVkIGlmIHRoZSBwaXBlbGluZVxuICogbmVlZHMgdG8gYmUgc2VyaWFsaXNlZCwgb3IgYSBzZXJpYWxpc2VkIHBpcGVsaW5lIG5lZWRzIHRvIGJlIGxvYWRlZC5cbiAqXG4gKiBSZWdpc3RlcmluZyBhIGZ1bmN0aW9uIGRvZXMgbm90IGFkZCBpdCB0byBhIHBpcGVsaW5lLCBmdW5jdGlvbnMgbXVzdCBzdGlsbCBiZVxuICogYWRkZWQgdG8gaW5zdGFuY2VzIG9mIHRoZSBwaXBlbGluZSBmb3IgdGhlbSB0byBiZSB1c2VkIHdoZW4gcnVubmluZyBhIHBpcGVsaW5lLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byByZWdpc3Rlci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBUaGUgbGFiZWwgdG8gcmVnaXN0ZXIgdGhpcyBmdW5jdGlvbiB3aXRoXG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChmbiwgbGFiZWwpIHtcbiAgaWYgKGxhYmVsIGluIGVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyZWRGdW5jdGlvbnMpIHtcbiAgICBlbGFzdGljbHVuci51dGlscy53YXJuKCdPdmVyd3JpdGluZyBleGlzdGluZyByZWdpc3RlcmVkIGZ1bmN0aW9uOiAnICsgbGFiZWwpO1xuICB9XG5cbiAgZm4ubGFiZWwgPSBsYWJlbDtcbiAgZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJlZEZ1bmN0aW9uc1tsYWJlbF0gPSBmbjtcbn07XG5cbi8qKlxuICogR2V0IGEgcmVnaXN0ZXJlZCBmdW5jdGlvbiBpbiB0aGUgcGlwZWxpbmUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIFRoZSBsYWJlbCBvZiByZWdpc3RlcmVkIGZ1bmN0aW9uLlxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUuZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uID0gZnVuY3Rpb24gKGxhYmVsKSB7XG4gIGlmICgobGFiZWwgaW4gZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJlZEZ1bmN0aW9ucykgIT09IHRydWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBlbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlcmVkRnVuY3Rpb25zW2xhYmVsXTtcbn07XG5cbi8qKlxuICogV2FybnMgaWYgdGhlIGZ1bmN0aW9uIGlzIG5vdCByZWdpc3RlcmVkIGFzIGEgUGlwZWxpbmUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNoZWNrIGZvci5cbiAqIEBwcml2YXRlXG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUud2FybklmRnVuY3Rpb25Ob3RSZWdpc3RlcmVkID0gZnVuY3Rpb24gKGZuKSB7XG4gIHZhciBpc1JlZ2lzdGVyZWQgPSBmbi5sYWJlbCAmJiAoZm4ubGFiZWwgaW4gdGhpcy5yZWdpc3RlcmVkRnVuY3Rpb25zKTtcblxuICBpZiAoIWlzUmVnaXN0ZXJlZCkge1xuICAgIGVsYXN0aWNsdW5yLnV0aWxzLndhcm4oJ0Z1bmN0aW9uIGlzIG5vdCByZWdpc3RlcmVkIHdpdGggcGlwZWxpbmUuIFRoaXMgbWF5IGNhdXNlIHByb2JsZW1zIHdoZW4gc2VyaWFsaXNpbmcgdGhlIGluZGV4LlxcbicsIGZuKTtcbiAgfVxufTtcblxuLyoqXG4gKiBMb2FkcyBhIHByZXZpb3VzbHkgc2VyaWFsaXNlZCBwaXBlbGluZS5cbiAqXG4gKiBBbGwgZnVuY3Rpb25zIHRvIGJlIGxvYWRlZCBtdXN0IGFscmVhZHkgYmUgcmVnaXN0ZXJlZCB3aXRoIGVsYXN0aWNsdW5yLlBpcGVsaW5lLlxuICogSWYgYW55IGZ1bmN0aW9uIGZyb20gdGhlIHNlcmlhbGlzZWQgZGF0YSBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZCB0aGVuIGFuXG4gKiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2VyaWFsaXNlZCBUaGUgc2VyaWFsaXNlZCBwaXBlbGluZSB0byBsb2FkLlxuICogQHJldHVybiB7ZWxhc3RpY2x1bnIuUGlwZWxpbmV9XG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUubG9hZCA9IGZ1bmN0aW9uIChzZXJpYWxpc2VkKSB7XG4gIHZhciBwaXBlbGluZSA9IG5ldyBlbGFzdGljbHVuci5QaXBlbGluZTtcblxuICBzZXJpYWxpc2VkLmZvckVhY2goZnVuY3Rpb24gKGZuTmFtZSkge1xuICAgIHZhciBmbiA9IGVsYXN0aWNsdW5yLlBpcGVsaW5lLmdldFJlZ2lzdGVyZWRGdW5jdGlvbihmbk5hbWUpO1xuXG4gICAgaWYgKGZuKSB7XG4gICAgICBwaXBlbGluZS5hZGQoZm4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsb2FkIHVuLXJlZ2lzdGVyZWQgZnVuY3Rpb246ICcgKyBmbk5hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBpcGVsaW5lO1xufTtcblxuLyoqXG4gKiBBZGRzIG5ldyBmdW5jdGlvbnMgdG8gdGhlIGVuZCBvZiB0aGUgcGlwZWxpbmUuXG4gKlxuICogTG9ncyBhIHdhcm5pbmcgaWYgdGhlIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiByZWdpc3RlcmVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9ucyBBbnkgbnVtYmVyIG9mIGZ1bmN0aW9ucyB0byBhZGQgdG8gdGhlIHBpcGVsaW5lLlxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gIGZucy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgIGVsYXN0aWNsdW5yLlBpcGVsaW5lLndhcm5JZkZ1bmN0aW9uTm90UmVnaXN0ZXJlZChmbik7XG4gICAgdGhpcy5fcXVldWUucHVzaChmbik7XG4gIH0sIHRoaXMpO1xufTtcblxuLyoqXG4gKiBBZGRzIGEgc2luZ2xlIGZ1bmN0aW9uIGFmdGVyIGEgZnVuY3Rpb24gdGhhdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGVcbiAqIHBpcGVsaW5lLlxuICpcbiAqIExvZ3MgYSB3YXJuaW5nIGlmIHRoZSBmdW5jdGlvbiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZC5cbiAqIElmIGV4aXN0aW5nRm4gaXMgbm90IGZvdW5kLCB0aHJvdyBhbiBFeGNlcHRpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhpc3RpbmdGbiBBIGZ1bmN0aW9uIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHBpcGVsaW5lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3Rm4gVGhlIG5ldyBmdW5jdGlvbiB0byBhZGQgdG8gdGhlIHBpcGVsaW5lLlxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnByb3RvdHlwZS5hZnRlciA9IGZ1bmN0aW9uIChleGlzdGluZ0ZuLCBuZXdGbikge1xuICBlbGFzdGljbHVuci5QaXBlbGluZS53YXJuSWZGdW5jdGlvbk5vdFJlZ2lzdGVyZWQobmV3Rm4pO1xuXG4gIHZhciBwb3MgPSB0aGlzLl9xdWV1ZS5pbmRleE9mKGV4aXN0aW5nRm4pO1xuICBpZiAocG9zID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgZXhpc3RpbmdGbicpO1xuICB9XG5cbiAgdGhpcy5fcXVldWUuc3BsaWNlKHBvcyArIDEsIDAsIG5ld0ZuKTtcbn07XG5cbi8qKlxuICogQWRkcyBhIHNpbmdsZSBmdW5jdGlvbiBiZWZvcmUgYSBmdW5jdGlvbiB0aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoZVxuICogcGlwZWxpbmUuXG4gKlxuICogTG9ncyBhIHdhcm5pbmcgaWYgdGhlIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiByZWdpc3RlcmVkLlxuICogSWYgZXhpc3RpbmdGbiBpcyBub3QgZm91bmQsIHRocm93IGFuIEV4Y2VwdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGlzdGluZ0ZuIEEgZnVuY3Rpb24gdGhhdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgcGlwZWxpbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXdGbiBUaGUgbmV3IGZ1bmN0aW9uIHRvIGFkZCB0byB0aGUgcGlwZWxpbmUuXG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUucHJvdG90eXBlLmJlZm9yZSA9IGZ1bmN0aW9uIChleGlzdGluZ0ZuLCBuZXdGbikge1xuICBlbGFzdGljbHVuci5QaXBlbGluZS53YXJuSWZGdW5jdGlvbk5vdFJlZ2lzdGVyZWQobmV3Rm4pO1xuXG4gIHZhciBwb3MgPSB0aGlzLl9xdWV1ZS5pbmRleE9mKGV4aXN0aW5nRm4pO1xuICBpZiAocG9zID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgZXhpc3RpbmdGbicpO1xuICB9XG5cbiAgdGhpcy5fcXVldWUuc3BsaWNlKHBvcywgMCwgbmV3Rm4pO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgZnVuY3Rpb24gZnJvbSB0aGUgcGlwZWxpbmUuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHJlbW92ZSBmcm9tIHRoZSBwaXBlbGluZS5cbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZuKSB7XG4gIHZhciBwb3MgPSB0aGlzLl9xdWV1ZS5pbmRleE9mKGZuKTtcbiAgaWYgKHBvcyA9PT0gLTEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9xdWV1ZS5zcGxpY2UocG9zLCAxKTtcbn07XG5cbi8qKlxuICogUnVucyB0aGUgY3VycmVudCBsaXN0IG9mIGZ1bmN0aW9ucyB0aGF0IHJlZ2lzdGVyZWQgaW4gdGhlIHBpcGVsaW5lIGFnYWluc3QgdGhlXG4gKiBpbnB1dCB0b2tlbnMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdG9rZW5zIFRoZSB0b2tlbnMgdG8gcnVuIHRocm91Z2ggdGhlIHBpcGVsaW5lLlxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICh0b2tlbnMpIHtcbiAgdmFyIG91dCA9IFtdLFxuICAgICAgdG9rZW5MZW5ndGggPSB0b2tlbnMubGVuZ3RoLFxuICAgICAgcGlwZWxpbmVMZW5ndGggPSB0aGlzLl9xdWV1ZS5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbkxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBwaXBlbGluZUxlbmd0aDsgaisrKSB7XG4gICAgICB0b2tlbiA9IHRoaXMuX3F1ZXVlW2pdKHRva2VuLCBpLCB0b2tlbnMpO1xuICAgICAgaWYgKHRva2VuID09PSB2b2lkIDAgfHwgdG9rZW4gPT09IG51bGwpIGJyZWFrO1xuICAgIH07XG5cbiAgICBpZiAodG9rZW4gIT09IHZvaWQgMCAmJiB0b2tlbiAhPT0gbnVsbCkgb3V0LnB1c2godG9rZW4pO1xuICB9O1xuXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJlc2V0cyB0aGUgcGlwZWxpbmUgYnkgcmVtb3ZpbmcgYW55IGV4aXN0aW5nIHByb2Nlc3NvcnMuXG4gKlxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fcXVldWUgPSBbXTtcbn07XG5cbiAvKipcbiAgKiBHZXQgdGhlIHBpcGVsaW5lIGlmIHVzZXIgd2FudCB0byBjaGVjayB0aGUgcGlwZWxpbmUuXG4gICpcbiAgKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAgKi9cbiBlbGFzdGljbHVuci5QaXBlbGluZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgcmV0dXJuIHRoaXMuX3F1ZXVlO1xuIH07XG5cbi8qKlxuICogUmV0dXJucyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwaXBlbGluZSByZWFkeSBmb3Igc2VyaWFsaXNhdGlvbi5cbiAqIE9ubHkgc2VyaWFsaXplIHBpcGVsaW5lIGZ1bmN0aW9uJ3MgbmFtZS4gTm90IHN0b3JpbmcgZnVuY3Rpb24sIHNvIHdoZW5cbiAqIGxvYWRpbmcgdGhlIGFyY2hpdmVkIEpTT04gaW5kZXggZmlsZSwgY29ycmVzcG9uZGluZyBwaXBlbGluZSBmdW5jdGlvbiBpcyBcbiAqIGFkZGVkIGJ5IHJlZ2lzdGVyZWQgZnVuY3Rpb24gb2YgZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJlZEZ1bmN0aW9uc1xuICpcbiAqIExvZ3MgYSB3YXJuaW5nIGlmIHRoZSBmdW5jdGlvbiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZC5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fcXVldWUubWFwKGZ1bmN0aW9uIChmbikge1xuICAgIGVsYXN0aWNsdW5yLlBpcGVsaW5lLndhcm5JZkZ1bmN0aW9uTm90UmVnaXN0ZXJlZChmbik7XG4gICAgcmV0dXJuIGZuLmxhYmVsO1xuICB9KTtcbn07XG4vKiFcbiAqIGVsYXN0aWNsdW5yLkluZGV4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIGVsYXN0aWNsdW5yLkluZGV4IGlzIG9iamVjdCB0aGF0IG1hbmFnZXMgYSBzZWFyY2ggaW5kZXguICBJdCBjb250YWlucyB0aGUgaW5kZXhlc1xuICogYW5kIHN0b3JlcyBhbGwgdGhlIHRva2VucyBhbmQgZG9jdW1lbnQgbG9va3Vwcy4gIEl0IGFsc28gcHJvdmlkZXMgdGhlIG1haW5cbiAqIHVzZXIgZmFjaW5nIEFQSSBmb3IgdGhlIGxpYnJhcnkuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9maWVsZHMgPSBbXTtcbiAgdGhpcy5fcmVmID0gJ2lkJztcbiAgdGhpcy5waXBlbGluZSA9IG5ldyBlbGFzdGljbHVuci5QaXBlbGluZTtcbiAgdGhpcy5kb2N1bWVudFN0b3JlID0gbmV3IGVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmU7XG4gIHRoaXMuaW5kZXggPSB7fTtcbiAgdGhpcy5ldmVudEVtaXR0ZXIgPSBuZXcgZWxhc3RpY2x1bnIuRXZlbnRFbWl0dGVyO1xuICB0aGlzLl9pZGZDYWNoZSA9IHt9O1xuXG4gIHRoaXMub24oJ2FkZCcsICdyZW1vdmUnLCAndXBkYXRlJywgKGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9pZGZDYWNoZSA9IHt9O1xuICB9KS5iaW5kKHRoaXMpKTtcbn07XG5cbi8qKlxuICogQmluZCBhIGhhbmRsZXIgdG8gZXZlbnRzIGJlaW5nIGVtaXR0ZWQgYnkgdGhlIGluZGV4LlxuICpcbiAqIFRoZSBoYW5kbGVyIGNhbiBiZSBib3VuZCB0byBtYW55IGV2ZW50cyBhdCB0aGUgc2FtZSB0aW1lLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnROYW1lXSBUaGUgbmFtZShzKSBvZiBldmVudHMgdG8gYmluZCB0aGUgZnVuY3Rpb24gdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgc2VyaWFsaXNlZCBzZXQgdG8gbG9hZC5cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgcmV0dXJuIHRoaXMuZXZlbnRFbWl0dGVyLmFkZExpc3RlbmVyLmFwcGx5KHRoaXMuZXZlbnRFbWl0dGVyLCBhcmdzKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIGhhbmRsZXIgZnJvbSBhbiBldmVudCBiZWluZyBlbWl0dGVkIGJ5IHRoZSBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIFRoZSBuYW1lIG9mIGV2ZW50cyB0byByZW1vdmUgdGhlIGZ1bmN0aW9uIGZyb20uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgc2VyaWFsaXNlZCBzZXQgdG8gbG9hZC5cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKG5hbWUsIGZuKSB7XG4gIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlci5yZW1vdmVMaXN0ZW5lcihuYW1lLCBmbik7XG59O1xuXG4vKipcbiAqIExvYWRzIGEgcHJldmlvdXNseSBzZXJpYWxpc2VkIGluZGV4LlxuICpcbiAqIElzc3VlcyBhIHdhcm5pbmcgaWYgdGhlIGluZGV4IGJlaW5nIGltcG9ydGVkIHdhcyBzZXJpYWxpc2VkXG4gKiBieSBhIGRpZmZlcmVudCB2ZXJzaW9uIG9mIGVsYXN0aWNsdW5yLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXJpYWxpc2VkRGF0YSBUaGUgc2VyaWFsaXNlZCBzZXQgdG8gbG9hZC5cbiAqIEByZXR1cm4ge2VsYXN0aWNsdW5yLkluZGV4fVxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LmxvYWQgPSBmdW5jdGlvbiAoc2VyaWFsaXNlZERhdGEpIHtcbiAgaWYgKHNlcmlhbGlzZWREYXRhLnZlcnNpb24gIT09IGVsYXN0aWNsdW5yLnZlcnNpb24pIHtcbiAgICBlbGFzdGljbHVuci51dGlscy53YXJuKCd2ZXJzaW9uIG1pc21hdGNoOiBjdXJyZW50ICdcbiAgICAgICAgICAgICAgICAgICAgKyBlbGFzdGljbHVuci52ZXJzaW9uICsgJyBpbXBvcnRpbmcgJyArIHNlcmlhbGlzZWREYXRhLnZlcnNpb24pO1xuICB9XG5cbiAgdmFyIGlkeCA9IG5ldyB0aGlzO1xuXG4gIGlkeC5fZmllbGRzID0gc2VyaWFsaXNlZERhdGEuZmllbGRzO1xuICBpZHguX3JlZiA9IHNlcmlhbGlzZWREYXRhLnJlZjtcbiAgaWR4LmRvY3VtZW50U3RvcmUgPSBlbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLmxvYWQoc2VyaWFsaXNlZERhdGEuZG9jdW1lbnRTdG9yZSk7XG4gIGlkeC5waXBlbGluZSA9IGVsYXN0aWNsdW5yLlBpcGVsaW5lLmxvYWQoc2VyaWFsaXNlZERhdGEucGlwZWxpbmUpO1xuICBpZHguaW5kZXggPSB7fTtcbiAgZm9yICh2YXIgZmllbGQgaW4gc2VyaWFsaXNlZERhdGEuaW5kZXgpIHtcbiAgICBpZHguaW5kZXhbZmllbGRdID0gZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5sb2FkKHNlcmlhbGlzZWREYXRhLmluZGV4W2ZpZWxkXSk7XG4gIH1cblxuICByZXR1cm4gaWR4O1xufTtcblxuLyoqXG4gKiBBZGRzIGEgZmllbGQgdG8gdGhlIGxpc3Qgb2YgZmllbGRzIHRoYXQgd2lsbCBiZSBzZWFyY2hhYmxlIHdpdGhpbiBkb2N1bWVudHMgaW4gdGhlIGluZGV4LlxuICpcbiAqIFJlbWVtYmVyIHRoYXQgaW5uZXIgaW5kZXggaXMgYnVpbGQgYmFzZWQgb24gZmllbGQsIHdoaWNoIG1lYW5zIGVhY2ggZmllbGQgaGFzIG9uZSBpbnZlcnRlZCBpbmRleC5cbiAqXG4gKiBGaWVsZHMgc2hvdWxkIGJlIGFkZGVkIGJlZm9yZSBhbnkgZG9jdW1lbnRzIGFyZSBhZGRlZCB0byB0aGUgaW5kZXgsIGZpZWxkc1xuICogdGhhdCBhcmUgYWRkZWQgYWZ0ZXIgZG9jdW1lbnRzIGFyZSBhZGRlZCB0byB0aGUgaW5kZXggd2lsbCBvbmx5IGFwcGx5IHRvIG5ld1xuICogZG9jdW1lbnRzIGFkZGVkIHRvIHRoZSBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGROYW1lIFRoZSBuYW1lIG9mIHRoZSBmaWVsZCB3aXRoaW4gdGhlIGRvY3VtZW50IHRoYXQgc2hvdWxkIGJlIGluZGV4ZWRcbiAqIEByZXR1cm4ge2VsYXN0aWNsdW5yLkluZGV4fVxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5hZGRGaWVsZCA9IGZ1bmN0aW9uIChmaWVsZE5hbWUpIHtcbiAgdGhpcy5fZmllbGRzLnB1c2goZmllbGROYW1lKTtcbiAgdGhpcy5pbmRleFtmaWVsZE5hbWVdID0gbmV3IGVsYXN0aWNsdW5yLkludmVydGVkSW5kZXg7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcm9wZXJ0eSB1c2VkIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGRvY3VtZW50cyBhZGRlZCB0byB0aGUgaW5kZXgsXG4gKiBieSBkZWZhdWx0IHRoaXMgcHJvcGVydHkgaXMgJ2lkJy5cbiAqXG4gKiBUaGlzIHNob3VsZCBvbmx5IGJlIGNoYW5nZWQgYmVmb3JlIGFkZGluZyBkb2N1bWVudHMgdG8gdGhlIGluZGV4LCBjaGFuZ2luZ1xuICogdGhlIHJlZiBwcm9wZXJ0eSB3aXRob3V0IHJlc2V0dGluZyB0aGUgaW5kZXggY2FuIGxlYWQgdG8gdW5leHBlY3RlZCByZXN1bHRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZOYW1lIFRoZSBwcm9wZXJ0eSB0byB1c2UgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhlXG4gKiBkb2N1bWVudHMgaW4gdGhlIGluZGV4LlxuICogQHBhcmFtIHtCb29sZWFufSBlbWl0RXZlbnQgV2hldGhlciB0byBlbWl0IGFkZCBldmVudHMsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEByZXR1cm4ge2VsYXN0aWNsdW5yLkluZGV4fVxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5zZXRSZWYgPSBmdW5jdGlvbiAocmVmTmFtZSkge1xuICB0aGlzLl9yZWYgPSByZWZOYW1lO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICpcbiAqIFNldCBpZiB0aGUgSlNPTiBmb3JtYXQgb3JpZ2luYWwgZG9jdW1lbnRzIGFyZSBzYXZlIGludG8gZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZVxuICpcbiAqIERlZmF1bHRseSBzYXZlIGFsbCB0aGUgb3JpZ2luYWwgSlNPTiBkb2N1bWVudHMuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBzYXZlIFdoZXRoZXIgdG8gc2F2ZSB0aGUgb3JpZ2luYWwgSlNPTiBkb2N1bWVudHMuXG4gKiBAcmV0dXJuIHtlbGFzdGljbHVuci5JbmRleH1cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuc2F2ZURvY3VtZW50ID0gZnVuY3Rpb24gKHNhdmUpIHtcbiAgdGhpcy5kb2N1bWVudFN0b3JlID0gbmV3IGVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUoc2F2ZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBKU09OIGZvcm1hdCBkb2N1bWVudCB0byB0aGUgaW5kZXguXG4gKlxuICogVGhpcyBpcyB0aGUgd2F5IG5ldyBkb2N1bWVudHMgZW50ZXIgdGhlIGluZGV4LCB0aGlzIGZ1bmN0aW9uIHdpbGwgcnVuIHRoZVxuICogZmllbGRzIGZyb20gdGhlIGRvY3VtZW50IHRocm91Z2ggdGhlIGluZGV4J3MgcGlwZWxpbmUgYW5kIHRoZW4gYWRkIGl0IHRvXG4gKiB0aGUgaW5kZXgsIGl0IHdpbGwgdGhlbiBzaG93IHVwIGluIHNlYXJjaCByZXN1bHRzLlxuICpcbiAqIEFuICdhZGQnIGV2ZW50IGlzIGVtaXR0ZWQgd2l0aCB0aGUgZG9jdW1lbnQgdGhhdCBoYXMgYmVlbiBhZGRlZCBhbmQgdGhlIGluZGV4XG4gKiB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gYWRkZWQgdG8uIFRoaXMgZXZlbnQgY2FuIGJlIHNpbGVuY2VkIGJ5IHBhc3NpbmcgZmFsc2VcbiAqIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gYWRkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2MgVGhlIEpTT04gZm9ybWF0IGRvY3VtZW50IHRvIGFkZCB0byB0aGUgaW5kZXguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVtaXRFdmVudCBXaGV0aGVyIG9yIG5vdCB0byBlbWl0IGV2ZW50cywgZGVmYXVsdCB0cnVlLlxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5hZGREb2MgPSBmdW5jdGlvbiAoZG9jLCBlbWl0RXZlbnQpIHtcbiAgaWYgKCFkb2MpIHJldHVybjtcbiAgdmFyIGVtaXRFdmVudCA9IGVtaXRFdmVudCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGVtaXRFdmVudDtcblxuICB2YXIgZG9jUmVmID0gZG9jW3RoaXMuX3JlZl07XG5cbiAgdGhpcy5kb2N1bWVudFN0b3JlLmFkZERvYyhkb2NSZWYsIGRvYyk7XG4gIHRoaXMuX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIHZhciBmaWVsZFRva2VucyA9IHRoaXMucGlwZWxpbmUucnVuKGVsYXN0aWNsdW5yLnRva2VuaXplcihkb2NbZmllbGRdKSk7XG4gICAgdGhpcy5kb2N1bWVudFN0b3JlLmFkZEZpZWxkTGVuZ3RoKGRvY1JlZiwgZmllbGQsIGZpZWxkVG9rZW5zLmxlbmd0aCk7XG5cbiAgICB2YXIgdG9rZW5Db3VudCA9IHt9O1xuICAgIGZpZWxkVG9rZW5zLmZvckVhY2goZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICBpZiAodG9rZW4gaW4gdG9rZW5Db3VudCkgdG9rZW5Db3VudFt0b2tlbl0gKz0gMTtcbiAgICAgIGVsc2UgdG9rZW5Db3VudFt0b2tlbl0gPSAxO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgZm9yICh2YXIgdG9rZW4gaW4gdG9rZW5Db3VudCkge1xuICAgICAgdmFyIHRlcm1GcmVxdWVuY3kgPSB0b2tlbkNvdW50W3Rva2VuXTtcbiAgICAgIHRlcm1GcmVxdWVuY3kgPSBNYXRoLnNxcnQodGVybUZyZXF1ZW5jeSk7XG4gICAgICB0aGlzLmluZGV4W2ZpZWxkXS5hZGRUb2tlbih0b2tlbiwgeyByZWY6IGRvY1JlZiwgdGY6IHRlcm1GcmVxdWVuY3kgfSk7XG4gICAgfVxuICB9LCB0aGlzKTtcblxuICBpZiAoZW1pdEV2ZW50KSB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdhZGQnLCBkb2MsIHRoaXMpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgZG9jdW1lbnQgZnJvbSB0aGUgaW5kZXggYnkgZG9jIHJlZi5cbiAqXG4gKiBUbyBtYWtlIHN1cmUgZG9jdW1lbnRzIG5vIGxvbmdlciBzaG93IHVwIGluIHNlYXJjaCByZXN1bHRzIHRoZXkgY2FuIGJlXG4gKiByZW1vdmVkIGZyb20gdGhlIGluZGV4IHVzaW5nIHRoaXMgbWV0aG9kLlxuICpcbiAqIEEgJ3JlbW92ZScgZXZlbnQgaXMgZW1pdHRlZCB3aXRoIHRoZSBkb2N1bWVudCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQgYW5kIHRoZSBpbmRleFxuICogdGhlIGRvY3VtZW50IGhhcyBiZWVuIHJlbW92ZWQgZnJvbS4gVGhpcyBldmVudCBjYW4gYmUgc2lsZW5jZWQgYnkgcGFzc2luZyBmYWxzZVxuICogYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byByZW1vdmUuXG4gKlxuICogSWYgdXNlciBzZXR0aW5nIERvY3VtZW50U3RvcmUgbm90IHN0b3JpbmcgdGhlIGRvY3VtZW50cywgdGhlbiByZW1vdmUgZG9jIGJ5IGRvY1JlZiBpcyBub3QgYWxsb3dlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xJbnRlZ2VyfSBkb2NSZWYgVGhlIGRvY3VtZW50IHJlZiB0byByZW1vdmUgZnJvbSB0aGUgaW5kZXguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVtaXRFdmVudCBXaGV0aGVyIHRvIGVtaXQgcmVtb3ZlIGV2ZW50cywgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5yZW1vdmVEb2NCeVJlZiA9IGZ1bmN0aW9uIChkb2NSZWYsIGVtaXRFdmVudCkge1xuICBpZiAoIWRvY1JlZikgcmV0dXJuO1xuICBpZiAodGhpcy5kb2N1bWVudFN0b3JlLmlzRG9jU3RvcmVkKCkgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCF0aGlzLmRvY3VtZW50U3RvcmUuaGFzRG9jKGRvY1JlZikpIHJldHVybjtcbiAgdmFyIGRvYyA9IHRoaXMuZG9jdW1lbnRTdG9yZS5nZXREb2MoZG9jUmVmKTtcbiAgdGhpcy5yZW1vdmVEb2MoZG9jLCBmYWxzZSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYSBkb2N1bWVudCBmcm9tIHRoZSBpbmRleC5cbiAqIFRoaXMgcmVtb3ZlIG9wZXJhdGlvbiBjb3VsZCB3b3JrIGV2ZW4gdGhlIG9yaWdpbmFsIGRvYyBpcyBub3Qgc3RvcmUgaW4gdGhlIERvY3VtZW50U3RvcmUuXG4gKlxuICogVG8gbWFrZSBzdXJlIGRvY3VtZW50cyBubyBsb25nZXIgc2hvdyB1cCBpbiBzZWFyY2ggcmVzdWx0cyB0aGV5IGNhbiBiZVxuICogcmVtb3ZlZCBmcm9tIHRoZSBpbmRleCB1c2luZyB0aGlzIG1ldGhvZC5cbiAqXG4gKiBBICdyZW1vdmUnIGV2ZW50IGlzIGVtaXR0ZWQgd2l0aCB0aGUgZG9jdW1lbnQgdGhhdCBoYXMgYmVlbiByZW1vdmVkIGFuZCB0aGUgaW5kZXhcbiAqIHRoZSBkb2N1bWVudCBoYXMgYmVlbiByZW1vdmVkIGZyb20uIFRoaXMgZXZlbnQgY2FuIGJlIHNpbGVuY2VkIGJ5IHBhc3NpbmcgZmFsc2VcbiAqIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gcmVtb3ZlLlxuICpcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jIFRoZSBkb2N1bWVudCByZWYgdG8gcmVtb3ZlIGZyb20gdGhlIGluZGV4LlxuICogQHBhcmFtIHtCb29sZWFufSBlbWl0RXZlbnQgV2hldGhlciB0byBlbWl0IHJlbW92ZSBldmVudHMsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUucmVtb3ZlRG9jID0gZnVuY3Rpb24gKGRvYywgZW1pdEV2ZW50KSB7XG4gIGlmICghZG9jKSByZXR1cm47XG5cbiAgdmFyIGVtaXRFdmVudCA9IGVtaXRFdmVudCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGVtaXRFdmVudDtcblxuICB2YXIgZG9jUmVmID0gZG9jW3RoaXMuX3JlZl07XG4gIGlmICghdGhpcy5kb2N1bWVudFN0b3JlLmhhc0RvYyhkb2NSZWYpKSByZXR1cm47XG5cbiAgdGhpcy5kb2N1bWVudFN0b3JlLnJlbW92ZURvYyhkb2NSZWYpO1xuXG4gIHRoaXMuX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIHZhciBmaWVsZFRva2VucyA9IHRoaXMucGlwZWxpbmUucnVuKGVsYXN0aWNsdW5yLnRva2VuaXplcihkb2NbZmllbGRdKSk7XG4gICAgZmllbGRUb2tlbnMuZm9yRWFjaChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgIHRoaXMuaW5kZXhbZmllbGRdLnJlbW92ZVRva2VuKHRva2VuLCBkb2NSZWYpO1xuICAgIH0sIHRoaXMpO1xuICB9LCB0aGlzKTtcblxuICBpZiAoZW1pdEV2ZW50KSB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdyZW1vdmUnLCBkb2MsIHRoaXMpO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIGEgZG9jdW1lbnQgaW4gdGhlIGluZGV4LlxuICpcbiAqIFdoZW4gYSBkb2N1bWVudCBjb250YWluZWQgd2l0aGluIHRoZSBpbmRleCBnZXRzIHVwZGF0ZWQsIGZpZWxkcyBjaGFuZ2VkLFxuICogYWRkZWQgb3IgcmVtb3ZlZCwgdG8gbWFrZSBzdXJlIGl0IGNvcnJlY3RseSBtYXRjaGVkIGFnYWluc3Qgc2VhcmNoIHF1ZXJpZXMsXG4gKiBpdCBzaG91bGQgYmUgdXBkYXRlZCBpbiB0aGUgaW5kZXguXG4gKlxuICogVGhpcyBtZXRob2QgaXMganVzdCBhIHdyYXBwZXIgYXJvdW5kIGByZW1vdmVgIGFuZCBgYWRkYFxuICpcbiAqIEFuICd1cGRhdGUnIGV2ZW50IGlzIGVtaXR0ZWQgd2l0aCB0aGUgZG9jdW1lbnQgdGhhdCBoYXMgYmVlbiB1cGRhdGVkIGFuZCB0aGUgaW5kZXguXG4gKiBUaGlzIGV2ZW50IGNhbiBiZSBzaWxlbmNlZCBieSBwYXNzaW5nIGZhbHNlIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gdXBkYXRlLiBPbmx5XG4gKiBhbiB1cGRhdGUgZXZlbnQgd2lsbCBiZSBmaXJlZCwgdGhlICdhZGQnIGFuZCAncmVtb3ZlJyBldmVudHMgb2YgdGhlIHVuZGVybHlpbmcgY2FsbHNcbiAqIGFyZSBzaWxlbmNlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jIFRoZSBkb2N1bWVudCB0byB1cGRhdGUgaW4gdGhlIGluZGV4LlxuICogQHBhcmFtIHtCb29sZWFufSBlbWl0RXZlbnQgV2hldGhlciB0byBlbWl0IHVwZGF0ZSBldmVudHMsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEBzZWUgSW5kZXgucHJvdG90eXBlLnJlbW92ZVxuICogQHNlZSBJbmRleC5wcm90b3R5cGUuYWRkXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLnVwZGF0ZURvYyA9IGZ1bmN0aW9uIChkb2MsIGVtaXRFdmVudCkge1xuICB2YXIgZW1pdEV2ZW50ID0gZW1pdEV2ZW50ID09PSB1bmRlZmluZWQgPyB0cnVlIDogZW1pdEV2ZW50O1xuXG4gIHRoaXMucmVtb3ZlRG9jQnlSZWYoZG9jW3RoaXMuX3JlZl0sIGZhbHNlKTtcbiAgdGhpcy5hZGREb2MoZG9jLCBmYWxzZSk7XG5cbiAgaWYgKGVtaXRFdmVudCkgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCgndXBkYXRlJywgZG9jLCB0aGlzKTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgaW52ZXJzZSBkb2N1bWVudCBmcmVxdWVuY3kgZm9yIGEgdG9rZW4gd2l0aGluIHRoZSBpbmRleCBvZiBhIGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gY2FsY3VsYXRlIHRoZSBpZGYgb2YuXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGQgVGhlIGZpZWxkIHRvIGNvbXB1dGUgaWRmLlxuICogQHNlZSBJbmRleC5wcm90b3R5cGUuaWRmXG4gKiBAcHJpdmF0ZVxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5pZGYgPSBmdW5jdGlvbiAodGVybSwgZmllbGQpIHtcbiAgdmFyIGNhY2hlS2V5ID0gXCJAXCIgKyBmaWVsZCArICcvJyArIHRlcm07XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5faWRmQ2FjaGUsIGNhY2hlS2V5KSkgcmV0dXJuIHRoaXMuX2lkZkNhY2hlW2NhY2hlS2V5XTtcblxuICB2YXIgZGYgPSB0aGlzLmluZGV4W2ZpZWxkXS5nZXREb2NGcmVxKHRlcm0pO1xuICB2YXIgaWRmID0gMSArIE1hdGgubG9nKHRoaXMuZG9jdW1lbnRTdG9yZS5sZW5ndGggLyAoZGYgKyAxKSk7XG4gIHRoaXMuX2lkZkNhY2hlW2NhY2hlS2V5XSA9IGlkZjtcblxuICByZXR1cm4gaWRmO1xufTtcblxuLyoqXG4gKiBnZXQgZmllbGRzIG9mIGN1cnJlbnQgaW5kZXggaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLmdldEZpZWxkcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2ZpZWxkcy5zbGljZSgpO1xufTtcblxuLyoqXG4gKiBTZWFyY2hlcyB0aGUgaW5kZXggdXNpbmcgdGhlIHBhc3NlZCBxdWVyeS5cbiAqIFF1ZXJpZXMgc2hvdWxkIGJlIGEgc3RyaW5nLCBtdWx0aXBsZSB3b3JkcyBhcmUgYWxsb3dlZC5cbiAqXG4gKiBJZiBjb25maWcgaXMgbnVsbCwgd2lsbCBzZWFyY2ggYWxsIGZpZWxkcyBkZWZhdWx0bHksIGFuZCBsZWFkIHRvIE9SIGJhc2VkIHF1ZXJ5LlxuICogSWYgY29uZmlnIGlzIHNwZWNpZmllZCwgd2lsbCBzZWFyY2ggc3BlY2lmaWVkIHdpdGggcXVlcnkgdGltZSBib29zdGluZy5cbiAqXG4gKiBBbGwgcXVlcnkgdG9rZW5zIGFyZSBwYXNzZWQgdGhyb3VnaCB0aGUgc2FtZSBwaXBlbGluZSB0aGF0IGRvY3VtZW50IHRva2Vuc1xuICogYXJlIHBhc3NlZCB0aHJvdWdoLCBzbyBhbnkgbGFuZ3VhZ2UgcHJvY2Vzc2luZyBpbnZvbHZlZCB3aWxsIGJlIHJ1biBvbiBldmVyeVxuICogcXVlcnkgdGVybS5cbiAqXG4gKiBFYWNoIHF1ZXJ5IHRlcm0gaXMgZXhwYW5kZWQsIHNvIHRoYXQgdGhlIHRlcm0gJ2hlJyBtaWdodCBiZSBleHBhbmRlZCB0b1xuICogJ2hlbGxvJyBhbmQgJ2hlbHAnIGlmIHRob3NlIHRlcm1zIHdlcmUgYWxyZWFkeSBpbmNsdWRlZCBpbiB0aGUgaW5kZXguXG4gKlxuICogTWF0Y2hpbmcgZG9jdW1lbnRzIGFyZSByZXR1cm5lZCBhcyBhbiBhcnJheSBvZiBvYmplY3RzLCBlYWNoIG9iamVjdCBjb250YWluc1xuICogdGhlIG1hdGNoaW5nIGRvY3VtZW50IHJlZiwgYXMgc2V0IGZvciB0aGlzIGluZGV4LCBhbmQgdGhlIHNpbWlsYXJpdHkgc2NvcmVcbiAqIGZvciB0aGlzIGRvY3VtZW50IGFnYWluc3QgdGhlIHF1ZXJ5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeSBUaGUgcXVlcnkgdG8gc2VhcmNoIHRoZSBpbmRleCB3aXRoLlxuICogQHBhcmFtIHtKU09OfSB1c2VyQ29uZmlnIFRoZSB1c2VyIHF1ZXJ5IGNvbmZpZywgSlNPTiBmb3JtYXQuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAc2VlIEluZGV4LnByb3RvdHlwZS5pZGZcbiAqIEBzZWUgSW5kZXgucHJvdG90eXBlLmRvY3VtZW50VmVjdG9yXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLnNlYXJjaCA9IGZ1bmN0aW9uIChxdWVyeSwgdXNlckNvbmZpZykge1xuICBpZiAoIXF1ZXJ5KSByZXR1cm4gW107XG5cbiAgdmFyIGNvbmZpZ1N0ciA9IG51bGw7XG4gIGlmICh1c2VyQ29uZmlnICE9IG51bGwpIHtcbiAgICBjb25maWdTdHIgPSBKU09OLnN0cmluZ2lmeSh1c2VyQ29uZmlnKTtcbiAgfVxuXG4gIHZhciBjb25maWcgPSBuZXcgZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbihjb25maWdTdHIsIHRoaXMuZ2V0RmllbGRzKCkpLmdldCgpO1xuXG4gIHZhciBxdWVyeVRva2VucyA9IHRoaXMucGlwZWxpbmUucnVuKGVsYXN0aWNsdW5yLnRva2VuaXplcihxdWVyeSkpO1xuXG4gIHZhciBxdWVyeVJlc3VsdHMgPSB7fTtcblxuICBmb3IgKHZhciBmaWVsZCBpbiBjb25maWcpIHtcbiAgICB2YXIgZmllbGRTZWFyY2hSZXN1bHRzID0gdGhpcy5maWVsZFNlYXJjaChxdWVyeVRva2VucywgZmllbGQsIGNvbmZpZyk7XG4gICAgdmFyIGZpZWxkQm9vc3QgPSBjb25maWdbZmllbGRdLmJvb3N0O1xuXG4gICAgZm9yICh2YXIgZG9jUmVmIGluIGZpZWxkU2VhcmNoUmVzdWx0cykge1xuICAgICAgZmllbGRTZWFyY2hSZXN1bHRzW2RvY1JlZl0gPSBmaWVsZFNlYXJjaFJlc3VsdHNbZG9jUmVmXSAqIGZpZWxkQm9vc3Q7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgZG9jUmVmIGluIGZpZWxkU2VhcmNoUmVzdWx0cykge1xuICAgICAgaWYgKGRvY1JlZiBpbiBxdWVyeVJlc3VsdHMpIHtcbiAgICAgICAgcXVlcnlSZXN1bHRzW2RvY1JlZl0gKz0gZmllbGRTZWFyY2hSZXN1bHRzW2RvY1JlZl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeVJlc3VsdHNbZG9jUmVmXSA9IGZpZWxkU2VhcmNoUmVzdWx0c1tkb2NSZWZdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciByZXN1bHRzID0gW107XG4gIGZvciAodmFyIGRvY1JlZiBpbiBxdWVyeVJlc3VsdHMpIHtcbiAgICByZXN1bHRzLnB1c2goe3JlZjogZG9jUmVmLCBzY29yZTogcXVlcnlSZXN1bHRzW2RvY1JlZl19KTtcbiAgfVxuXG4gIHJlc3VsdHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYi5zY29yZSAtIGEuc2NvcmU7IH0pO1xuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbi8qKlxuICogc2VhcmNoIHF1ZXJ5VG9rZW5zIGluIHNwZWNpZmllZCBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBxdWVyeVRva2VucyBUaGUgcXVlcnkgdG9rZW5zIHRvIHF1ZXJ5IGluIHRoaXMgZmllbGQuXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGQgRmllbGQgdG8gcXVlcnkgaW4uXG4gKiBAcGFyYW0ge2VsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb259IGNvbmZpZyBUaGUgdXNlciBxdWVyeSBjb25maWcsIEpTT04gZm9ybWF0LlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuZmllbGRTZWFyY2ggPSBmdW5jdGlvbiAocXVlcnlUb2tlbnMsIGZpZWxkTmFtZSwgY29uZmlnKSB7XG4gIHZhciBib29sZWFuVHlwZSA9IGNvbmZpZ1tmaWVsZE5hbWVdLmJvb2w7XG4gIHZhciBleHBhbmQgPSBjb25maWdbZmllbGROYW1lXS5leHBhbmQ7XG4gIHZhciBib29zdCA9IGNvbmZpZ1tmaWVsZE5hbWVdLmJvb3N0O1xuICB2YXIgc2NvcmVzID0gbnVsbDtcbiAgdmFyIGRvY1Rva2VucyA9IHt9O1xuXG4gIC8vIERvIG5vdGhpbmcgaWYgdGhlIGJvb3N0IGlzIDBcbiAgaWYgKGJvb3N0ID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcXVlcnlUb2tlbnMuZm9yRWFjaChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICB2YXIgdG9rZW5zID0gW3Rva2VuXTtcbiAgICBpZiAoZXhwYW5kID09IHRydWUpIHtcbiAgICAgIHRva2VucyA9IHRoaXMuaW5kZXhbZmllbGROYW1lXS5leHBhbmRUb2tlbih0b2tlbik7XG4gICAgfVxuICAgIC8vIENvbnNpZGVyIGV2ZXJ5IHF1ZXJ5IHRva2VuIGluIHR1cm4uIElmIGV4cGFuZGVkLCBlYWNoIHF1ZXJ5IHRva2VuXG4gICAgLy8gY29ycmVzcG9uZHMgdG8gYSBzZXQgb2YgdG9rZW5zLCB3aGljaCBpcyBhbGwgdG9rZW5zIGluIHRoZSBcbiAgICAvLyBpbmRleCBtYXRjaGluZyB0aGUgcGF0dGVybiBxdWVyeVRva2VuKiAuXG4gICAgLy8gRm9yIHRoZSBzZXQgb2YgdG9rZW5zIGNvcnJlc3BvbmRpbmcgdG8gYSBxdWVyeSB0b2tlbiwgZmluZCBhbmQgc2NvcmVcbiAgICAvLyBhbGwgbWF0Y2hpbmcgZG9jdW1lbnRzLiBTdG9yZSB0aG9zZSBzY29yZXMgaW4gcXVlcnlUb2tlblNjb3JlcywgXG4gICAgLy8ga2V5ZWQgYnkgZG9jUmVmLlxuICAgIC8vIFRoZW4sIGRlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2YgYm9vbGVhblR5cGUsIGNvbWJpbmUgdGhlIHNjb3Jlc1xuICAgIC8vIGZvciB0aGlzIHF1ZXJ5IHRva2VuIHdpdGggcHJldmlvdXMgc2NvcmVzLiAgSWYgYm9vbGVhblR5cGUgaXMgT1IsXG4gICAgLy8gdGhlbiBtZXJnZSB0aGUgc2NvcmVzIGJ5IHN1bW1pbmcgaW50byB0aGUgYWNjdW11bGF0ZWQgdG90YWwsIGFkZGluZ1xuICAgIC8vIG5ldyBkb2N1bWVudCBzY29yZXMgYXJlIHJlcXVpcmVkIChlZmZlY3RpdmVseSBhIHVuaW9uIG9wZXJhdG9yKS4gXG4gICAgLy8gSWYgYm9vbGVhblR5cGUgaXMgQU5ELCBhY2N1bXVsYXRlIHNjb3JlcyBvbmx5IGlmIHRoZSBkb2N1bWVudCBcbiAgICAvLyBoYXMgcHJldmlvdXNseSBiZWVuIHNjb3JlZCBieSBhbm90aGVyIHF1ZXJ5IHRva2VuIChhbiBpbnRlcnNlY3Rpb25cbiAgICAvLyBvcGVyYXRpb24wLiBcbiAgICAvLyBGdXJ0aGVybW9yZSwgc2luY2Ugd2hlbiBib29sZWFuVHlwZSBpcyBBTkQsIGFkZGl0aW9uYWwgXG4gICAgLy8gcXVlcnkgdG9rZW5zIGNhbid0IGFkZCBuZXcgZG9jdW1lbnRzIHRvIHRoZSByZXN1bHQgc2V0LCB1c2UgdGhlXG4gICAgLy8gY3VycmVudCBkb2N1bWVudCBzZXQgdG8gbGltaXQgdGhlIHByb2Nlc3Npbmcgb2YgZWFjaCBuZXcgcXVlcnkgXG4gICAgLy8gdG9rZW4gZm9yIGVmZmljaWVuY3kgKGkuZS4sIGluY3JlbWVudGFsIGludGVyc2VjdGlvbikuXG4gICAgXG4gICAgdmFyIHF1ZXJ5VG9rZW5TY29yZXMgPSB7fTtcbiAgICB0b2tlbnMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgZG9jcyA9IHRoaXMuaW5kZXhbZmllbGROYW1lXS5nZXREb2NzKGtleSk7XG4gICAgICB2YXIgaWRmID0gdGhpcy5pZGYoa2V5LCBmaWVsZE5hbWUpO1xuICAgICAgXG4gICAgICBpZiAoc2NvcmVzICYmIGJvb2xlYW5UeXBlID09ICdBTkQnKSB7XG4gICAgICAgICAgLy8gc3BlY2lhbCBjYXNlLCB3ZSBjYW4gcnVsZSBvdXQgZG9jdW1lbnRzIHRoYXQgaGF2ZSBiZWVuXG4gICAgICAgICAgLy8gYWxyZWFkeSBiZWVuIGZpbHRlcmVkIG91dCBiZWNhdXNlIHRoZXkgd2VyZW4ndCBzY29yZWRcbiAgICAgICAgICAvLyBieSBwcmV2aW91cyBxdWVyeSB0b2tlbiBwYXNzZXMuXG4gICAgICAgICAgdmFyIGZpbHRlcmVkRG9jcyA9IHt9O1xuICAgICAgICAgIGZvciAodmFyIGRvY1JlZiBpbiBzY29yZXMpIHtcbiAgICAgICAgICAgICAgaWYgKGRvY1JlZiBpbiBkb2NzKSB7XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJlZERvY3NbZG9jUmVmXSA9IGRvY3NbZG9jUmVmXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBkb2NzID0gZmlsdGVyZWREb2NzO1xuICAgICAgfVxuICAgICAgLy8gb25seSByZWNvcmQgYXBwZWFyZWQgdG9rZW4gZm9yIHJldHJpZXZlZCBkb2N1bWVudHMgZm9yIHRoZVxuICAgICAgLy8gb3JpZ2luYWwgdG9rZW4sIG5vdCBmb3IgZXhwYW5lZCB0b2tlbi5cbiAgICAgIC8vIGJlYXVzZSBmb3IgZG9pbmcgY29vcmROb3JtIGZvciBhIHJldHJpZXZlZCBkb2N1bWVudCwgY29vcmROb3JtIG9ubHkgY2FyZSBob3cgbWFueVxuICAgICAgLy8gcXVlcnkgdG9rZW4gYXBwZWFyIGluIHRoYXQgZG9jdW1lbnQuXG4gICAgICAvLyBzbyBleHBhbmRlZCB0b2tlbiBzaG91bGQgbm90IGJlIGFkZGVkIGludG8gZG9jVG9rZW5zLCBpZiBhZGRlZCwgdGhpcyB3aWxsIHBvbGx1dGUgdGhlXG4gICAgICAvLyBjb29yZE5vcm1cbiAgICAgIGlmIChrZXkgPT0gdG9rZW4pIHtcbiAgICAgICAgdGhpcy5maWVsZFNlYXJjaFN0YXRzKGRvY1Rva2Vucywga2V5LCBkb2NzKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgZG9jUmVmIGluIGRvY3MpIHtcbiAgICAgICAgdmFyIHRmID0gdGhpcy5pbmRleFtmaWVsZE5hbWVdLmdldFRlcm1GcmVxdWVuY3koa2V5LCBkb2NSZWYpO1xuICAgICAgICB2YXIgZmllbGRMZW5ndGggPSB0aGlzLmRvY3VtZW50U3RvcmUuZ2V0RmllbGRMZW5ndGgoZG9jUmVmLCBmaWVsZE5hbWUpO1xuICAgICAgICB2YXIgZmllbGRMZW5ndGhOb3JtID0gMTtcbiAgICAgICAgaWYgKGZpZWxkTGVuZ3RoICE9IDApIHtcbiAgICAgICAgICBmaWVsZExlbmd0aE5vcm0gPSAxIC8gTWF0aC5zcXJ0KGZpZWxkTGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwZW5hbGl0eSA9IDE7XG4gICAgICAgIGlmIChrZXkgIT0gdG9rZW4pIHtcbiAgICAgICAgICAvLyBjdXJyZW50bHkgSSdtIG5vdCBzdXJlIGlmIHRoaXMgcGVuYWxpdHkgaXMgZW5vdWdoLFxuICAgICAgICAgIC8vIG5lZWQgdG8gZG8gdmVyaWZpY2F0aW9uXG4gICAgICAgICAgcGVuYWxpdHkgPSAoMSAtIChrZXkubGVuZ3RoIC0gdG9rZW4ubGVuZ3RoKSAvIGtleS5sZW5ndGgpICogMC4xNTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzY29yZSA9IHRmICogaWRmICogZmllbGRMZW5ndGhOb3JtICogcGVuYWxpdHk7XG5cbiAgICAgICAgaWYgKGRvY1JlZiBpbiBxdWVyeVRva2VuU2NvcmVzKSB7XG4gICAgICAgICAgcXVlcnlUb2tlblNjb3Jlc1tkb2NSZWZdICs9IHNjb3JlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHF1ZXJ5VG9rZW5TY29yZXNbZG9jUmVmXSA9IHNjb3JlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgXG4gICAgc2NvcmVzID0gdGhpcy5tZXJnZVNjb3JlcyhzY29yZXMsIHF1ZXJ5VG9rZW5TY29yZXMsIGJvb2xlYW5UeXBlKTtcbiAgfSwgdGhpcyk7XG5cbiAgc2NvcmVzID0gdGhpcy5jb29yZE5vcm0oc2NvcmVzLCBkb2NUb2tlbnMsIHF1ZXJ5VG9rZW5zLmxlbmd0aCk7XG4gIHJldHVybiBzY29yZXM7XG59O1xuXG4vKipcbiAqIE1lcmdlIHRoZSBzY29yZXMgZnJvbSBvbmUgc2V0IG9mIHRva2VucyBpbnRvIGFuIGFjY3VtdWxhdGVkIHNjb3JlIHRhYmxlLlxuICogRXhhY3Qgb3BlcmF0aW9uIGRlcGVuZHMgb24gdGhlIG9wIHBhcmFtZXRlci4gSWYgb3AgaXMgJ0FORCcsIHRoZW4gb25seSB0aGVcbiAqIGludGVyc2VjdGlvbiBvZiB0aGUgdHdvIHNjb3JlIGxpc3RzIGlzIHJldGFpbmVkLiBPdGhlcndpc2UsIHRoZSB1bmlvbiBvZlxuICogdGhlIHR3byBzY29yZSBsaXN0cyBpcyByZXR1cm5lZC4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBib29sIGFjY3VtdWxhdGVkIHNjb3Jlcy4gU2hvdWxkIGJlIG51bGwgb24gZmlyc3QgY2FsbC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBzY29yZXMgbmV3IHNjb3JlcyB0byBtZXJnZSBpbnRvIGFjY3VtU2NvcmVzLlxuICogQHBhcmFtIHtPYmplY3R9IG9wIG1lcmdlIG9wZXJhdGlvbiAoc2hvdWxkIGJlICdBTkQnIG9yICdPUicpLlxuICpcbiAqL1xuXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUubWVyZ2VTY29yZXMgPSBmdW5jdGlvbiAoYWNjdW1TY29yZXMsIHNjb3Jlcywgb3ApIHtcbiAgICBpZiAoIWFjY3VtU2NvcmVzKSB7XG4gICAgICAgIHJldHVybiBzY29yZXM7IFxuICAgIH1cbiAgICBpZiAob3AgPT0gJ0FORCcpIHtcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbiA9IHt9O1xuICAgICAgICBmb3IgKHZhciBkb2NSZWYgaW4gc2NvcmVzKSB7XG4gICAgICAgICAgICBpZiAoZG9jUmVmIGluIGFjY3VtU2NvcmVzKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0aW9uW2RvY1JlZl0gPSBhY2N1bVNjb3Jlc1tkb2NSZWZdICsgc2NvcmVzW2RvY1JlZl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGludGVyc2VjdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBkb2NSZWYgaW4gc2NvcmVzKSB7XG4gICAgICAgICAgICBpZiAoZG9jUmVmIGluIGFjY3VtU2NvcmVzKSB7XG4gICAgICAgICAgICAgICAgYWNjdW1TY29yZXNbZG9jUmVmXSArPSBzY29yZXNbZG9jUmVmXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWNjdW1TY29yZXNbZG9jUmVmXSA9IHNjb3Jlc1tkb2NSZWZdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2N1bVNjb3JlcztcbiAgICB9XG59O1xuXG5cbi8qKlxuICogUmVjb3JkIHRoZSBvY2N1cmluZyBxdWVyeSB0b2tlbiBvZiByZXRyaWV2ZWQgZG9jIHNwZWNpZmllZCBieSBkb2MgZmllbGQuXG4gKiBPbmx5IGZvciBpbm5lciB1c2VyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2NUb2tlbnMgYSBkYXRhIHN0cnVjdHVyZSBzdG9yZXMgd2hpY2ggdG9rZW4gYXBwZWFycyBpbiB0aGUgcmV0cmlldmVkIGRvYy5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBxdWVyeSB0b2tlblxuICogQHBhcmFtIHtPYmplY3R9IGRvY3MgdGhlIHJldHJpZXZlZCBkb2N1bWVudHMgb2YgdGhlIHF1ZXJ5IHRva2VuXG4gKlxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuZmllbGRTZWFyY2hTdGF0cyA9IGZ1bmN0aW9uIChkb2NUb2tlbnMsIHRva2VuLCBkb2NzKSB7XG4gIGZvciAodmFyIGRvYyBpbiBkb2NzKSB7XG4gICAgaWYgKGRvYyBpbiBkb2NUb2tlbnMpIHtcbiAgICAgIGRvY1Rva2Vuc1tkb2NdLnB1c2godG9rZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2NUb2tlbnNbZG9jXSA9IFt0b2tlbl07XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIGNvb3JkIG5vcm0gdGhlIHNjb3JlIG9mIGEgZG9jLlxuICogaWYgYSBkb2MgY29udGFpbiBtb3JlIHF1ZXJ5IHRva2VucywgdGhlbiB0aGUgc2NvcmUgd2lsbCBsYXJnZXIgdGhhbiB0aGUgZG9jXG4gKiBjb250YWlucyBsZXNzIHF1ZXJ5IHRva2Vucy5cbiAqXG4gKiBvbmx5IGZvciBpbm5lciB1c2UuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHJlc3VsdHMgZmlyc3QgcmVzdWx0c1xuICogQHBhcmFtIHtPYmplY3R9IGRvY3MgZmllbGQgc2VhcmNoIHJlc3VsdHMgb2YgYSB0b2tlblxuICogQHBhcmFtIHtJbnRlZ2VyfSBuIHF1ZXJ5IHRva2VuIG51bWJlclxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuY29vcmROb3JtID0gZnVuY3Rpb24gKHNjb3JlcywgZG9jVG9rZW5zLCBuKSB7XG4gIGZvciAodmFyIGRvYyBpbiBzY29yZXMpIHtcbiAgICBpZiAoIShkb2MgaW4gZG9jVG9rZW5zKSkgY29udGludWU7XG4gICAgdmFyIHRva2VucyA9IGRvY1Rva2Vuc1tkb2NdLmxlbmd0aDtcbiAgICBzY29yZXNbZG9jXSA9IHNjb3Jlc1tkb2NdICogdG9rZW5zIC8gbjtcbiAgfVxuXG4gIHJldHVybiBzY29yZXM7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSByZXByZXNlbnRhdGlvbiBvZiB0aGUgaW5kZXggcmVhZHkgZm9yIHNlcmlhbGlzYXRpb24uXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpbmRleEpzb24gPSB7fTtcbiAgdGhpcy5fZmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgaW5kZXhKc29uW2ZpZWxkXSA9IHRoaXMuaW5kZXhbZmllbGRdLnRvSlNPTigpO1xuICB9LCB0aGlzKTtcblxuICByZXR1cm4ge1xuICAgIHZlcnNpb246IGVsYXN0aWNsdW5yLnZlcnNpb24sXG4gICAgZmllbGRzOiB0aGlzLl9maWVsZHMsXG4gICAgcmVmOiB0aGlzLl9yZWYsXG4gICAgZG9jdW1lbnRTdG9yZTogdGhpcy5kb2N1bWVudFN0b3JlLnRvSlNPTigpLFxuICAgIGluZGV4OiBpbmRleEpzb24sXG4gICAgcGlwZWxpbmU6IHRoaXMucGlwZWxpbmUudG9KU09OKClcbiAgfTtcbn07XG5cbi8qKlxuICogQXBwbGllcyBhIHBsdWdpbiB0byB0aGUgY3VycmVudCBpbmRleC5cbiAqXG4gKiBBIHBsdWdpbiBpcyBhIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdpdGggdGhlIGluZGV4IGFzIGl0cyBjb250ZXh0LlxuICogUGx1Z2lucyBjYW4gYmUgdXNlZCB0byBjdXN0b21pc2Ugb3IgZXh0ZW5kIHRoZSBiZWhhdmlvdXIgdGhlIGluZGV4XG4gKiBpbiBzb21lIHdheS4gQSBwbHVnaW4gaXMganVzdCBhIGZ1bmN0aW9uLCB0aGF0IGVuY2Fwc3VsYXRlZCB0aGUgY3VzdG9tXG4gKiBiZWhhdmlvdXIgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgaW5kZXguXG4gKlxuICogVGhlIHBsdWdpbiBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBpbmRleCBhcyBpdHMgYXJndW1lbnQsIGFkZGl0aW9uYWxcbiAqIGFyZ3VtZW50cyBjYW4gYWxzbyBiZSBwYXNzZWQgd2hlbiBjYWxsaW5nIHVzZS4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkXG4gKiB3aXRoIHRoZSBpbmRleCBhcyBpdHMgY29udGV4dC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICB2YXIgbXlQbHVnaW4gPSBmdW5jdGlvbiAoaWR4LCBhcmcxLCBhcmcyKSB7XG4gKiAgICAgICAvLyBgdGhpc2AgaXMgdGhlIGluZGV4IHRvIGJlIGV4dGVuZGVkXG4gKiAgICAgICAvLyBhcHBseSBhbnkgZXh0ZW5zaW9ucyBldGMgaGVyZS5cbiAqICAgICB9XG4gKlxuICogICAgIHZhciBpZHggPSBlbGFzdGljbHVucihmdW5jdGlvbiAoKSB7XG4gKiAgICAgICB0aGlzLnVzZShteVBsdWdpbiwgJ2FyZzEnLCAnYXJnMicpXG4gKiAgICAgfSlcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwbHVnaW4gVGhlIHBsdWdpbiB0byBhcHBseS5cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gKHBsdWdpbikge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIGFyZ3MudW5zaGlmdCh0aGlzKTtcbiAgcGx1Z2luLmFwcGx5KHRoaXMsIGFyZ3MpO1xufTtcbi8qIVxuICogZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBlbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlIGlzIGEgc2ltcGxlIGtleS12YWx1ZSBkb2N1bWVudCBzdG9yZSB1c2VkIGZvciBzdG9yaW5nIHNldHMgb2YgdG9rZW5zIGZvclxuICogZG9jdW1lbnRzIHN0b3JlZCBpbiBpbmRleC5cbiAqXG4gKiBlbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlIHN0b3JlIG9yaWdpbmFsIEpTT04gZm9ybWF0IGRvY3VtZW50cyB0aGF0IHlvdSBjb3VsZCBidWlsZCBzZWFyY2ggc25pcHBldCBieSB0aGlzIG9yaWdpbmFsIEpTT04gZG9jdW1lbnQuXG4gKlxuICogdXNlciBjb3VsZCBjaG9vc2Ugd2hldGhlciBvcmlnaW5hbCBKU09OIGZvcm1hdCBkb2N1bWVudCBzaG91bGQgYmUgc3RvcmUsIGlmIG5vIGNvbmZpZ3VyYXRpb24gdGhlbiBkb2N1bWVudCB3aWxsIGJlIHN0b3JlZCBkZWZhdWx0bHkuXG4gKiBJZiB1c2VyIGNhcmUgbW9yZSBhYm91dCB0aGUgaW5kZXggc2l6ZSwgdXNlciBjb3VsZCBzZWxlY3Qgbm90IHN0b3JlIEpTT04gZG9jdW1lbnRzLCB0aGVuIHRoaXMgd2lsbCBoYXMgc29tZSBkZWZlY3RzLCBzdWNoIGFzIHVzZXJcbiAqIGNvdWxkIG5vdCB1c2UgSlNPTiBkb2N1bWVudCB0byBnZW5lcmF0ZSBzbmlwcGV0cyBvZiBzZWFyY2ggcmVzdWx0cy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHNhdmUgSWYgdGhlIG9yaWdpbmFsIEpTT04gZG9jdW1lbnQgc2hvdWxkIGJlIHN0b3JlZC5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1vZHVsZVxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlID0gZnVuY3Rpb24gKHNhdmUpIHtcbiAgaWYgKHNhdmUgPT09IG51bGwgfHwgc2F2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fc2F2ZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fc2F2ZSA9IHNhdmU7XG4gIH1cblxuICB0aGlzLmRvY3MgPSB7fTtcbiAgdGhpcy5kb2NJbmZvID0ge307XG4gIHRoaXMubGVuZ3RoID0gMDtcbn07XG5cbi8qKlxuICogTG9hZHMgYSBwcmV2aW91c2x5IHNlcmlhbGlzZWQgZG9jdW1lbnQgc3RvcmVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2VyaWFsaXNlZERhdGEgVGhlIHNlcmlhbGlzZWQgZG9jdW1lbnQgc3RvcmUgdG8gbG9hZC5cbiAqIEByZXR1cm4ge2VsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmV9XG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUubG9hZCA9IGZ1bmN0aW9uIChzZXJpYWxpc2VkRGF0YSkge1xuICB2YXIgc3RvcmUgPSBuZXcgdGhpcztcblxuICBzdG9yZS5sZW5ndGggPSBzZXJpYWxpc2VkRGF0YS5sZW5ndGg7XG4gIHN0b3JlLmRvY3MgPSBzZXJpYWxpc2VkRGF0YS5kb2NzO1xuICBzdG9yZS5kb2NJbmZvID0gc2VyaWFsaXNlZERhdGEuZG9jSW5mbztcbiAgc3RvcmUuX3NhdmUgPSBzZXJpYWxpc2VkRGF0YS5zYXZlO1xuXG4gIHJldHVybiBzdG9yZTtcbn07XG5cbi8qKlxuICogY2hlY2sgaWYgY3VycmVudCBpbnN0YW5jZSBzdG9yZSB0aGUgb3JpZ2luYWwgZG9jXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUuaXNEb2NTdG9yZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9zYXZlO1xufTtcblxuLyoqXG4gKiBTdG9yZXMgdGhlIGdpdmVuIGRvYyBpbiB0aGUgZG9jdW1lbnQgc3RvcmUgYWdhaW5zdCB0aGUgZ2l2ZW4gaWQuXG4gKiBJZiBkb2NSZWYgYWxyZWFkeSBleGlzdCwgdGhlbiB1cGRhdGUgZG9jLlxuICpcbiAqIERvY3VtZW50IGlzIHN0b3JlIGJ5IG9yaWdpbmFsIEpTT04gZm9ybWF0LCB0aGVuIHlvdSBjb3VsZCB1c2Ugb3JpZ2luYWwgZG9jdW1lbnQgdG8gZ2VuZXJhdGUgc2VhcmNoIHNuaXBwZXRzLlxuICpcbiAqIEBwYXJhbSB7SW50ZWdlcnxTdHJpbmd9IGRvY1JlZiBUaGUga2V5IHVzZWQgdG8gc3RvcmUgdGhlIEpTT04gZm9ybWF0IGRvYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2MgVGhlIEpTT04gZm9ybWF0IGRvYy5cbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUuYWRkRG9jID0gZnVuY3Rpb24gKGRvY1JlZiwgZG9jKSB7XG4gIGlmICghdGhpcy5oYXNEb2MoZG9jUmVmKSkgdGhpcy5sZW5ndGgrKztcblxuICBpZiAodGhpcy5fc2F2ZSA9PT0gdHJ1ZSkge1xuICAgIHRoaXMuZG9jc1tkb2NSZWZdID0gY2xvbmUoZG9jKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmRvY3NbZG9jUmVmXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBKU09OIGRvYyBmcm9tIHRoZSBkb2N1bWVudCBzdG9yZSBmb3IgYSBnaXZlbiBrZXkuXG4gKlxuICogSWYgZG9jUmVmIG5vdCBmb3VuZCwgcmV0dXJuIG51bGwuXG4gKiBJZiB1c2VyIHNldCBub3Qgc3RvcmluZyB0aGUgZG9jdW1lbnRzLCByZXR1cm4gbnVsbC5cbiAqXG4gKiBAcGFyYW0ge0ludGVnZXJ8U3RyaW5nfSBkb2NSZWYgVGhlIGtleSB0byBsb29rdXAgYW5kIHJldHJpZXZlIGZyb20gdGhlIGRvY3VtZW50IHN0b3JlLlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQG1lbWJlck9mIERvY3VtZW50U3RvcmVcbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUuZ2V0RG9jID0gZnVuY3Rpb24gKGRvY1JlZikge1xuICBpZiAodGhpcy5oYXNEb2MoZG9jUmVmKSA9PT0gZmFsc2UpIHJldHVybiBudWxsO1xuICByZXR1cm4gdGhpcy5kb2NzW2RvY1JlZl07XG59O1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBkb2N1bWVudCBzdG9yZSBjb250YWlucyBhIGtleSAoZG9jUmVmKS5cbiAqXG4gKiBAcGFyYW0ge0ludGVnZXJ8U3RyaW5nfSBkb2NSZWYgVGhlIGlkIHRvIGxvb2sgdXAgaW4gdGhlIGRvY3VtZW50IHN0b3JlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBtZW1iZXJPZiBEb2N1bWVudFN0b3JlXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLmhhc0RvYyA9IGZ1bmN0aW9uIChkb2NSZWYpIHtcbiAgcmV0dXJuIGRvY1JlZiBpbiB0aGlzLmRvY3M7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIHZhbHVlIGZvciBhIGtleSBpbiB0aGUgZG9jdW1lbnQgc3RvcmUuXG4gKlxuICogQHBhcmFtIHtJbnRlZ2VyfFN0cmluZ30gZG9jUmVmIFRoZSBpZCB0byByZW1vdmUgZnJvbSB0aGUgZG9jdW1lbnQgc3RvcmUuXG4gKiBAbWVtYmVyT2YgRG9jdW1lbnRTdG9yZVxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS5yZW1vdmVEb2MgPSBmdW5jdGlvbiAoZG9jUmVmKSB7XG4gIGlmICghdGhpcy5oYXNEb2MoZG9jUmVmKSkgcmV0dXJuO1xuXG4gIGRlbGV0ZSB0aGlzLmRvY3NbZG9jUmVmXTtcbiAgZGVsZXRlIHRoaXMuZG9jSW5mb1tkb2NSZWZdO1xuICB0aGlzLmxlbmd0aC0tO1xufTtcblxuLyoqXG4gKiBBZGQgZmllbGQgbGVuZ3RoIG9mIGEgZG9jdW1lbnQncyBmaWVsZCB0b2tlbnMgZnJvbSBwaXBlbGluZSByZXN1bHRzLlxuICogVGhlIGZpZWxkIGxlbmd0aCBvZiBhIGRvY3VtZW50IGlzIHVzZWQgdG8gZG8gZmllbGQgbGVuZ3RoIG5vcm1hbGl6YXRpb24gZXZlbiB3aXRob3V0IHRoZSBvcmlnaW5hbCBKU09OIGRvY3VtZW50IHN0b3JlZC5cbiAqXG4gKiBAcGFyYW0ge0ludGVnZXJ8U3RyaW5nfSBkb2NSZWYgZG9jdW1lbnQncyBpZCBvciByZWZlcmVuY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZE5hbWUgZmllbGQgbmFtZVxuICogQHBhcmFtIHtJbnRlZ2VyfSBsZW5ndGggZmllbGQgbGVuZ3RoXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLmFkZEZpZWxkTGVuZ3RoID0gZnVuY3Rpb24gKGRvY1JlZiwgZmllbGROYW1lLCBsZW5ndGgpIHtcbiAgaWYgKGRvY1JlZiA9PT0gbnVsbCB8fCBkb2NSZWYgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICBpZiAodGhpcy5oYXNEb2MoZG9jUmVmKSA9PSBmYWxzZSkgcmV0dXJuO1xuXG4gIGlmICghdGhpcy5kb2NJbmZvW2RvY1JlZl0pIHRoaXMuZG9jSW5mb1tkb2NSZWZdID0ge307XG4gIHRoaXMuZG9jSW5mb1tkb2NSZWZdW2ZpZWxkTmFtZV0gPSBsZW5ndGg7XG59O1xuXG4vKipcbiAqIFVwZGF0ZSBmaWVsZCBsZW5ndGggb2YgYSBkb2N1bWVudCdzIGZpZWxkIHRva2VucyBmcm9tIHBpcGVsaW5lIHJlc3VsdHMuXG4gKiBUaGUgZmllbGQgbGVuZ3RoIG9mIGEgZG9jdW1lbnQgaXMgdXNlZCB0byBkbyBmaWVsZCBsZW5ndGggbm9ybWFsaXphdGlvbiBldmVuIHdpdGhvdXQgdGhlIG9yaWdpbmFsIEpTT04gZG9jdW1lbnQgc3RvcmVkLlxuICpcbiAqIEBwYXJhbSB7SW50ZWdlcnxTdHJpbmd9IGRvY1JlZiBkb2N1bWVudCdzIGlkIG9yIHJlZmVyZW5jZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkTmFtZSBmaWVsZCBuYW1lXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGxlbmd0aCBmaWVsZCBsZW5ndGhcbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUudXBkYXRlRmllbGRMZW5ndGggPSBmdW5jdGlvbiAoZG9jUmVmLCBmaWVsZE5hbWUsIGxlbmd0aCkge1xuICBpZiAoZG9jUmVmID09PSBudWxsIHx8IGRvY1JlZiA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gIGlmICh0aGlzLmhhc0RvYyhkb2NSZWYpID09IGZhbHNlKSByZXR1cm47XG5cbiAgdGhpcy5hZGRGaWVsZExlbmd0aChkb2NSZWYsIGZpZWxkTmFtZSwgbGVuZ3RoKTtcbn07XG5cbi8qKlxuICogZ2V0IGZpZWxkIGxlbmd0aCBvZiBhIGRvY3VtZW50IGJ5IGRvY1JlZlxuICpcbiAqIEBwYXJhbSB7SW50ZWdlcnxTdHJpbmd9IGRvY1JlZiBkb2N1bWVudCBpZCBvciByZWZlcmVuY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZE5hbWUgZmllbGQgbmFtZVxuICogQHJldHVybiB7SW50ZWdlcn0gZmllbGQgbGVuZ3RoXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLmdldEZpZWxkTGVuZ3RoID0gZnVuY3Rpb24gKGRvY1JlZiwgZmllbGROYW1lKSB7XG4gIGlmIChkb2NSZWYgPT09IG51bGwgfHwgZG9jUmVmID09PSB1bmRlZmluZWQpIHJldHVybiAwO1xuXG4gIGlmICghKGRvY1JlZiBpbiB0aGlzLmRvY3MpKSByZXR1cm4gMDtcbiAgaWYgKCEoZmllbGROYW1lIGluIHRoaXMuZG9jSW5mb1tkb2NSZWZdKSkgcmV0dXJuIDA7XG4gIHJldHVybiB0aGlzLmRvY0luZm9bZG9jUmVmXVtmaWVsZE5hbWVdO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZG9jdW1lbnQgc3RvcmUgdXNlZCBmb3Igc2VyaWFsaXNhdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IEpTT04gZm9ybWF0XG4gKiBAbWVtYmVyT2YgRG9jdW1lbnRTdG9yZVxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgZG9jczogdGhpcy5kb2NzLFxuICAgIGRvY0luZm86IHRoaXMuZG9jSW5mbyxcbiAgICBsZW5ndGg6IHRoaXMubGVuZ3RoLFxuICAgIHNhdmU6IHRoaXMuX3NhdmVcbiAgfTtcbn07XG5cbi8qKlxuICogQ2xvbmluZyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IGluIEpTT04gZm9ybWF0XG4gKiBAcmV0dXJuIHtPYmplY3R9IGNvcGllZCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gIGlmIChudWxsID09PSBvYmogfHwgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG9iaikgcmV0dXJuIG9iajtcblxuICB2YXIgY29weSA9IG9iai5jb25zdHJ1Y3RvcigpO1xuXG4gIGZvciAodmFyIGF0dHIgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShhdHRyKSkgY29weVthdHRyXSA9IG9ialthdHRyXTtcbiAgfVxuXG4gIHJldHVybiBjb3B5O1xufVxuLyohXG4gKiBlbGFzdGljbHVuci5zdGVtbWVyXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqIEluY2x1ZGVzIGNvZGUgZnJvbSAtIGh0dHA6Ly90YXJ0YXJ1cy5vcmcvfm1hcnRpbi9Qb3J0ZXJTdGVtbWVyL2pzLnR4dFxuICovXG5cbi8qKlxuICogZWxhc3RpY2x1bnIuc3RlbW1lciBpcyBhbiBlbmdsaXNoIGxhbmd1YWdlIHN0ZW1tZXIsIHRoaXMgaXMgYSBKYXZhU2NyaXB0XG4gKiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUG9ydGVyU3RlbW1lciB0YWtlbiBmcm9tIGh0dHA6Ly90YXJ0YXJ1cy5vcmcvfm1hcnRpblxuICpcbiAqIEBtb2R1bGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBzdGVtXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAc2VlIGVsYXN0aWNsdW5yLlBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLnN0ZW1tZXIgPSAoZnVuY3Rpb24oKXtcbiAgdmFyIHN0ZXAybGlzdCA9IHtcbiAgICAgIFwiYXRpb25hbFwiIDogXCJhdGVcIixcbiAgICAgIFwidGlvbmFsXCIgOiBcInRpb25cIixcbiAgICAgIFwiZW5jaVwiIDogXCJlbmNlXCIsXG4gICAgICBcImFuY2lcIiA6IFwiYW5jZVwiLFxuICAgICAgXCJpemVyXCIgOiBcIml6ZVwiLFxuICAgICAgXCJibGlcIiA6IFwiYmxlXCIsXG4gICAgICBcImFsbGlcIiA6IFwiYWxcIixcbiAgICAgIFwiZW50bGlcIiA6IFwiZW50XCIsXG4gICAgICBcImVsaVwiIDogXCJlXCIsXG4gICAgICBcIm91c2xpXCIgOiBcIm91c1wiLFxuICAgICAgXCJpemF0aW9uXCIgOiBcIml6ZVwiLFxuICAgICAgXCJhdGlvblwiIDogXCJhdGVcIixcbiAgICAgIFwiYXRvclwiIDogXCJhdGVcIixcbiAgICAgIFwiYWxpc21cIiA6IFwiYWxcIixcbiAgICAgIFwiaXZlbmVzc1wiIDogXCJpdmVcIixcbiAgICAgIFwiZnVsbmVzc1wiIDogXCJmdWxcIixcbiAgICAgIFwib3VzbmVzc1wiIDogXCJvdXNcIixcbiAgICAgIFwiYWxpdGlcIiA6IFwiYWxcIixcbiAgICAgIFwiaXZpdGlcIiA6IFwiaXZlXCIsXG4gICAgICBcImJpbGl0aVwiIDogXCJibGVcIixcbiAgICAgIFwibG9naVwiIDogXCJsb2dcIlxuICAgIH0sXG5cbiAgICBzdGVwM2xpc3QgPSB7XG4gICAgICBcImljYXRlXCIgOiBcImljXCIsXG4gICAgICBcImF0aXZlXCIgOiBcIlwiLFxuICAgICAgXCJhbGl6ZVwiIDogXCJhbFwiLFxuICAgICAgXCJpY2l0aVwiIDogXCJpY1wiLFxuICAgICAgXCJpY2FsXCIgOiBcImljXCIsXG4gICAgICBcImZ1bFwiIDogXCJcIixcbiAgICAgIFwibmVzc1wiIDogXCJcIlxuICAgIH0sXG5cbiAgICBjID0gXCJbXmFlaW91XVwiLCAgICAgICAgICAvLyBjb25zb25hbnRcbiAgICB2ID0gXCJbYWVpb3V5XVwiLCAgICAgICAgICAvLyB2b3dlbFxuICAgIEMgPSBjICsgXCJbXmFlaW91eV0qXCIsICAgIC8vIGNvbnNvbmFudCBzZXF1ZW5jZVxuICAgIFYgPSB2ICsgXCJbYWVpb3VdKlwiLCAgICAgIC8vIHZvd2VsIHNlcXVlbmNlXG5cbiAgICBtZ3IwID0gXCJeKFwiICsgQyArIFwiKT9cIiArIFYgKyBDLCAgICAgICAgICAgICAgIC8vIFtDXVZDLi4uIGlzIG0+MFxuICAgIG1lcTEgPSBcIl4oXCIgKyBDICsgXCIpP1wiICsgViArIEMgKyBcIihcIiArIFYgKyBcIik/JFwiLCAgLy8gW0NdVkNbVl0gaXMgbT0xXG4gICAgbWdyMSA9IFwiXihcIiArIEMgKyBcIik/XCIgKyBWICsgQyArIFYgKyBDLCAgICAgICAvLyBbQ11WQ1ZDLi4uIGlzIG0+MVxuICAgIHNfdiA9IFwiXihcIiArIEMgKyBcIik/XCIgKyB2OyAgICAgICAgICAgICAgICAgICAvLyB2b3dlbCBpbiBzdGVtXG5cbiAgdmFyIHJlX21ncjAgPSBuZXcgUmVnRXhwKG1ncjApO1xuICB2YXIgcmVfbWdyMSA9IG5ldyBSZWdFeHAobWdyMSk7XG4gIHZhciByZV9tZXExID0gbmV3IFJlZ0V4cChtZXExKTtcbiAgdmFyIHJlX3NfdiA9IG5ldyBSZWdFeHAoc192KTtcblxuICB2YXIgcmVfMWEgPSAvXiguKz8pKHNzfGkpZXMkLztcbiAgdmFyIHJlMl8xYSA9IC9eKC4rPykoW15zXSlzJC87XG4gIHZhciByZV8xYiA9IC9eKC4rPyllZWQkLztcbiAgdmFyIHJlMl8xYiA9IC9eKC4rPykoZWR8aW5nKSQvO1xuICB2YXIgcmVfMWJfMiA9IC8uJC87XG4gIHZhciByZTJfMWJfMiA9IC8oYXR8Ymx8aXopJC87XG4gIHZhciByZTNfMWJfMiA9IG5ldyBSZWdFeHAoXCIoW15hZWlvdXlsc3pdKVxcXFwxJFwiKTtcbiAgdmFyIHJlNF8xYl8yID0gbmV3IFJlZ0V4cChcIl5cIiArIEMgKyB2ICsgXCJbXmFlaW91d3h5XSRcIik7XG5cbiAgdmFyIHJlXzFjID0gL14oLis/W15hZWlvdV0peSQvO1xuICB2YXIgcmVfMiA9IC9eKC4rPykoYXRpb25hbHx0aW9uYWx8ZW5jaXxhbmNpfGl6ZXJ8YmxpfGFsbGl8ZW50bGl8ZWxpfG91c2xpfGl6YXRpb258YXRpb258YXRvcnxhbGlzbXxpdmVuZXNzfGZ1bG5lc3N8b3VzbmVzc3xhbGl0aXxpdml0aXxiaWxpdGl8bG9naSkkLztcblxuICB2YXIgcmVfMyA9IC9eKC4rPykoaWNhdGV8YXRpdmV8YWxpemV8aWNpdGl8aWNhbHxmdWx8bmVzcykkLztcblxuICB2YXIgcmVfNCA9IC9eKC4rPykoYWx8YW5jZXxlbmNlfGVyfGljfGFibGV8aWJsZXxhbnR8ZW1lbnR8bWVudHxlbnR8b3V8aXNtfGF0ZXxpdGl8b3VzfGl2ZXxpemUpJC87XG4gIHZhciByZTJfNCA9IC9eKC4rPykoc3x0KShpb24pJC87XG5cbiAgdmFyIHJlXzUgPSAvXiguKz8pZSQvO1xuICB2YXIgcmVfNV8xID0gL2xsJC87XG4gIHZhciByZTNfNSA9IG5ldyBSZWdFeHAoXCJeXCIgKyBDICsgdiArIFwiW15hZWlvdXd4eV0kXCIpO1xuXG4gIHZhciBwb3J0ZXJTdGVtbWVyID0gZnVuY3Rpb24gcG9ydGVyU3RlbW1lcih3KSB7XG4gICAgdmFyICAgc3RlbSxcbiAgICAgIHN1ZmZpeCxcbiAgICAgIGZpcnN0Y2gsXG4gICAgICByZSxcbiAgICAgIHJlMixcbiAgICAgIHJlMyxcbiAgICAgIHJlNDtcblxuICAgIGlmICh3Lmxlbmd0aCA8IDMpIHsgcmV0dXJuIHc7IH1cblxuICAgIGZpcnN0Y2ggPSB3LnN1YnN0cigwLDEpO1xuICAgIGlmIChmaXJzdGNoID09IFwieVwiKSB7XG4gICAgICB3ID0gZmlyc3RjaC50b1VwcGVyQ2FzZSgpICsgdy5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgLy8gU3RlcCAxYVxuICAgIHJlID0gcmVfMWFcbiAgICByZTIgPSByZTJfMWE7XG5cbiAgICBpZiAocmUudGVzdCh3KSkgeyB3ID0gdy5yZXBsYWNlKHJlLFwiJDEkMlwiKTsgfVxuICAgIGVsc2UgaWYgKHJlMi50ZXN0KHcpKSB7IHcgPSB3LnJlcGxhY2UocmUyLFwiJDEkMlwiKTsgfVxuXG4gICAgLy8gU3RlcCAxYlxuICAgIHJlID0gcmVfMWI7XG4gICAgcmUyID0gcmUyXzFiO1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgcmUgPSByZV9tZ3IwO1xuICAgICAgaWYgKHJlLnRlc3QoZnBbMV0pKSB7XG4gICAgICAgIHJlID0gcmVfMWJfMjtcbiAgICAgICAgdyA9IHcucmVwbGFjZShyZSxcIlwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlMi50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZTIuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXTtcbiAgICAgIHJlMiA9IHJlX3NfdjtcbiAgICAgIGlmIChyZTIudGVzdChzdGVtKSkge1xuICAgICAgICB3ID0gc3RlbTtcbiAgICAgICAgcmUyID0gcmUyXzFiXzI7XG4gICAgICAgIHJlMyA9IHJlM18xYl8yO1xuICAgICAgICByZTQgPSByZTRfMWJfMjtcbiAgICAgICAgaWYgKHJlMi50ZXN0KHcpKSB7ICB3ID0gdyArIFwiZVwiOyB9XG4gICAgICAgIGVsc2UgaWYgKHJlMy50ZXN0KHcpKSB7IHJlID0gcmVfMWJfMjsgdyA9IHcucmVwbGFjZShyZSxcIlwiKTsgfVxuICAgICAgICBlbHNlIGlmIChyZTQudGVzdCh3KSkgeyB3ID0gdyArIFwiZVwiOyB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RlcCAxYyAtIHJlcGxhY2Ugc3VmZml4IHkgb3IgWSBieSBpIGlmIHByZWNlZGVkIGJ5IGEgbm9uLXZvd2VsIHdoaWNoIGlzIG5vdCB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSB3b3JkIChzbyBjcnkgLT4gY3JpLCBieSAtPiBieSwgc2F5IC0+IHNheSlcbiAgICByZSA9IHJlXzFjO1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdO1xuICAgICAgdyA9IHN0ZW0gKyBcImlcIjtcbiAgICB9XG5cbiAgICAvLyBTdGVwIDJcbiAgICByZSA9IHJlXzI7XG4gICAgaWYgKHJlLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV07XG4gICAgICBzdWZmaXggPSBmcFsyXTtcbiAgICAgIHJlID0gcmVfbWdyMDtcbiAgICAgIGlmIChyZS50ZXN0KHN0ZW0pKSB7XG4gICAgICAgIHcgPSBzdGVtICsgc3RlcDJsaXN0W3N1ZmZpeF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RlcCAzXG4gICAgcmUgPSByZV8zO1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdO1xuICAgICAgc3VmZml4ID0gZnBbMl07XG4gICAgICByZSA9IHJlX21ncjA7XG4gICAgICBpZiAocmUudGVzdChzdGVtKSkge1xuICAgICAgICB3ID0gc3RlbSArIHN0ZXAzbGlzdFtzdWZmaXhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0ZXAgNFxuICAgIHJlID0gcmVfNDtcbiAgICByZTIgPSByZTJfNDtcbiAgICBpZiAocmUudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXTtcbiAgICAgIHJlID0gcmVfbWdyMTtcbiAgICAgIGlmIChyZS50ZXN0KHN0ZW0pKSB7XG4gICAgICAgIHcgPSBzdGVtO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmUyLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlMi5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdICsgZnBbMl07XG4gICAgICByZTIgPSByZV9tZ3IxO1xuICAgICAgaWYgKHJlMi50ZXN0KHN0ZW0pKSB7XG4gICAgICAgIHcgPSBzdGVtO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0ZXAgNVxuICAgIHJlID0gcmVfNTtcbiAgICBpZiAocmUudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXTtcbiAgICAgIHJlID0gcmVfbWdyMTtcbiAgICAgIHJlMiA9IHJlX21lcTE7XG4gICAgICByZTMgPSByZTNfNTtcbiAgICAgIGlmIChyZS50ZXN0KHN0ZW0pIHx8IChyZTIudGVzdChzdGVtKSAmJiAhKHJlMy50ZXN0KHN0ZW0pKSkpIHtcbiAgICAgICAgdyA9IHN0ZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmUgPSByZV81XzE7XG4gICAgcmUyID0gcmVfbWdyMTtcbiAgICBpZiAocmUudGVzdCh3KSAmJiByZTIudGVzdCh3KSkge1xuICAgICAgcmUgPSByZV8xYl8yO1xuICAgICAgdyA9IHcucmVwbGFjZShyZSxcIlwiKTtcbiAgICB9XG5cbiAgICAvLyBhbmQgdHVybiBpbml0aWFsIFkgYmFjayB0byB5XG5cbiAgICBpZiAoZmlyc3RjaCA9PSBcInlcIikge1xuICAgICAgdyA9IGZpcnN0Y2gudG9Mb3dlckNhc2UoKSArIHcuc3Vic3RyKDEpO1xuICAgIH1cblxuICAgIHJldHVybiB3O1xuICB9O1xuXG4gIHJldHVybiBwb3J0ZXJTdGVtbWVyO1xufSkoKTtcblxuZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJGdW5jdGlvbihlbGFzdGljbHVuci5zdGVtbWVyLCAnc3RlbW1lcicpO1xuLyohXG4gKiBlbGFzdGljbHVuci5zdG9wV29yZEZpbHRlclxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBlbGFzdGljbHVuci5zdG9wV29yZEZpbHRlciBpcyBhbiBFbmdsaXNoIGxhbmd1YWdlIHN0b3Agd29yZHMgZmlsdGVyLCBhbnkgd29yZHNcbiAqIGNvbnRhaW5lZCBpbiB0aGUgc3RvcCB3b3JkIGxpc3Qgd2lsbCBub3QgYmUgcGFzc2VkIHRocm91Z2ggdGhlIGZpbHRlci5cbiAqXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIHVzZWQgaW4gdGhlIFBpcGVsaW5lLiBJZiB0aGUgdG9rZW4gZG9lcyBub3QgcGFzcyB0aGVcbiAqIGZpbHRlciB0aGVuIHVuZGVmaW5lZCB3aWxsIGJlIHJldHVybmVkLlxuICogQ3VycmVudGx5IHRoaXMgU3RvcHdvcmRGaWx0ZXIgdXNpbmcgZGljdGlvbmFyeSB0byBkbyBPKDEpIHRpbWUgY29tcGxleGl0eSBzdG9wIHdvcmQgZmlsdGVyaW5nLlxuICpcbiAqIEBtb2R1bGVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gcGFzcyB0aHJvdWdoIHRoZSBmaWx0ZXJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBzZWUgZWxhc3RpY2x1bnIuUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgaWYgKHRva2VuICYmIGVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyLnN0b3BXb3Jkc1t0b2tlbl0gIT09IHRydWUpIHtcbiAgICByZXR1cm4gdG9rZW47XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlIHByZWRlZmluZWQgc3RvcCB3b3Jkc1xuICogaWYgdXNlciB3YW50IHRvIHVzZSBjdXN0b21pemVkIHN0b3Agd29yZHMsIHVzZXIgY291bGQgdXNlIHRoaXMgZnVuY3Rpb24gdG8gZGVsZXRlXG4gKiBhbGwgcHJlZGVmaW5lZCBzdG9wd29yZHMuXG4gKlxuICogQHJldHVybiB7bnVsbH1cbiAqL1xuZWxhc3RpY2x1bnIuY2xlYXJTdG9wV29yZHMgPSBmdW5jdGlvbiAoKSB7XG4gIGVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyLnN0b3BXb3JkcyA9IHt9O1xufTtcblxuLyoqXG4gKiBBZGQgY3VzdG9taXplZCBzdG9wIHdvcmRzXG4gKiB1c2VyIGNvdWxkIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIGFkZCBjdXN0b21pemVkIHN0b3Agd29yZHNcbiAqIFxuICogQHBhcmFtcyB7QXJyYXl9IHdvcmRzIGN1c3RvbWl6ZWQgc3RvcCB3b3Jkc1xuICogQHJldHVybiB7bnVsbH1cbiAqL1xuZWxhc3RpY2x1bnIuYWRkU3RvcFdvcmRzID0gZnVuY3Rpb24gKHdvcmRzKSB7XG4gIGlmICh3b3JkcyA9PSBudWxsIHx8IEFycmF5LmlzQXJyYXkod29yZHMpID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gIHdvcmRzLmZvckVhY2goZnVuY3Rpb24gKHdvcmQpIHtcbiAgICBlbGFzdGljbHVuci5zdG9wV29yZEZpbHRlci5zdG9wV29yZHNbd29yZF0gPSB0cnVlO1xuICB9LCB0aGlzKTtcbn07XG5cbi8qKlxuICogUmVzZXQgdG8gZGVmYXVsdCBzdG9wIHdvcmRzXG4gKiB1c2VyIGNvdWxkIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIHJlc3RvcmUgZGVmYXVsdCBzdG9wIHdvcmRzXG4gKlxuICogQHJldHVybiB7bnVsbH1cbiAqL1xuZWxhc3RpY2x1bnIucmVzZXRTdG9wV29yZHMgPSBmdW5jdGlvbiAoKSB7XG4gIGVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyLnN0b3BXb3JkcyA9IGVsYXN0aWNsdW5yLmRlZmF1bHRTdG9wV29yZHM7XG59O1xuXG5lbGFzdGljbHVuci5kZWZhdWx0U3RvcFdvcmRzID0ge1xuICBcIlwiOiB0cnVlLFxuICBcImFcIjogdHJ1ZSxcbiAgXCJhYmxlXCI6IHRydWUsXG4gIFwiYWJvdXRcIjogdHJ1ZSxcbiAgXCJhY3Jvc3NcIjogdHJ1ZSxcbiAgXCJhZnRlclwiOiB0cnVlLFxuICBcImFsbFwiOiB0cnVlLFxuICBcImFsbW9zdFwiOiB0cnVlLFxuICBcImFsc29cIjogdHJ1ZSxcbiAgXCJhbVwiOiB0cnVlLFxuICBcImFtb25nXCI6IHRydWUsXG4gIFwiYW5cIjogdHJ1ZSxcbiAgXCJhbmRcIjogdHJ1ZSxcbiAgXCJhbnlcIjogdHJ1ZSxcbiAgXCJhcmVcIjogdHJ1ZSxcbiAgXCJhc1wiOiB0cnVlLFxuICBcImF0XCI6IHRydWUsXG4gIFwiYmVcIjogdHJ1ZSxcbiAgXCJiZWNhdXNlXCI6IHRydWUsXG4gIFwiYmVlblwiOiB0cnVlLFxuICBcImJ1dFwiOiB0cnVlLFxuICBcImJ5XCI6IHRydWUsXG4gIFwiY2FuXCI6IHRydWUsXG4gIFwiY2Fubm90XCI6IHRydWUsXG4gIFwiY291bGRcIjogdHJ1ZSxcbiAgXCJkZWFyXCI6IHRydWUsXG4gIFwiZGlkXCI6IHRydWUsXG4gIFwiZG9cIjogdHJ1ZSxcbiAgXCJkb2VzXCI6IHRydWUsXG4gIFwiZWl0aGVyXCI6IHRydWUsXG4gIFwiZWxzZVwiOiB0cnVlLFxuICBcImV2ZXJcIjogdHJ1ZSxcbiAgXCJldmVyeVwiOiB0cnVlLFxuICBcImZvclwiOiB0cnVlLFxuICBcImZyb21cIjogdHJ1ZSxcbiAgXCJnZXRcIjogdHJ1ZSxcbiAgXCJnb3RcIjogdHJ1ZSxcbiAgXCJoYWRcIjogdHJ1ZSxcbiAgXCJoYXNcIjogdHJ1ZSxcbiAgXCJoYXZlXCI6IHRydWUsXG4gIFwiaGVcIjogdHJ1ZSxcbiAgXCJoZXJcIjogdHJ1ZSxcbiAgXCJoZXJzXCI6IHRydWUsXG4gIFwiaGltXCI6IHRydWUsXG4gIFwiaGlzXCI6IHRydWUsXG4gIFwiaG93XCI6IHRydWUsXG4gIFwiaG93ZXZlclwiOiB0cnVlLFxuICBcImlcIjogdHJ1ZSxcbiAgXCJpZlwiOiB0cnVlLFxuICBcImluXCI6IHRydWUsXG4gIFwiaW50b1wiOiB0cnVlLFxuICBcImlzXCI6IHRydWUsXG4gIFwiaXRcIjogdHJ1ZSxcbiAgXCJpdHNcIjogdHJ1ZSxcbiAgXCJqdXN0XCI6IHRydWUsXG4gIFwibGVhc3RcIjogdHJ1ZSxcbiAgXCJsZXRcIjogdHJ1ZSxcbiAgXCJsaWtlXCI6IHRydWUsXG4gIFwibGlrZWx5XCI6IHRydWUsXG4gIFwibWF5XCI6IHRydWUsXG4gIFwibWVcIjogdHJ1ZSxcbiAgXCJtaWdodFwiOiB0cnVlLFxuICBcIm1vc3RcIjogdHJ1ZSxcbiAgXCJtdXN0XCI6IHRydWUsXG4gIFwibXlcIjogdHJ1ZSxcbiAgXCJuZWl0aGVyXCI6IHRydWUsXG4gIFwibm9cIjogdHJ1ZSxcbiAgXCJub3JcIjogdHJ1ZSxcbiAgXCJub3RcIjogdHJ1ZSxcbiAgXCJvZlwiOiB0cnVlLFxuICBcIm9mZlwiOiB0cnVlLFxuICBcIm9mdGVuXCI6IHRydWUsXG4gIFwib25cIjogdHJ1ZSxcbiAgXCJvbmx5XCI6IHRydWUsXG4gIFwib3JcIjogdHJ1ZSxcbiAgXCJvdGhlclwiOiB0cnVlLFxuICBcIm91clwiOiB0cnVlLFxuICBcIm93blwiOiB0cnVlLFxuICBcInJhdGhlclwiOiB0cnVlLFxuICBcInNhaWRcIjogdHJ1ZSxcbiAgXCJzYXlcIjogdHJ1ZSxcbiAgXCJzYXlzXCI6IHRydWUsXG4gIFwic2hlXCI6IHRydWUsXG4gIFwic2hvdWxkXCI6IHRydWUsXG4gIFwic2luY2VcIjogdHJ1ZSxcbiAgXCJzb1wiOiB0cnVlLFxuICBcInNvbWVcIjogdHJ1ZSxcbiAgXCJ0aGFuXCI6IHRydWUsXG4gIFwidGhhdFwiOiB0cnVlLFxuICBcInRoZVwiOiB0cnVlLFxuICBcInRoZWlyXCI6IHRydWUsXG4gIFwidGhlbVwiOiB0cnVlLFxuICBcInRoZW5cIjogdHJ1ZSxcbiAgXCJ0aGVyZVwiOiB0cnVlLFxuICBcInRoZXNlXCI6IHRydWUsXG4gIFwidGhleVwiOiB0cnVlLFxuICBcInRoaXNcIjogdHJ1ZSxcbiAgXCJ0aXNcIjogdHJ1ZSxcbiAgXCJ0b1wiOiB0cnVlLFxuICBcInRvb1wiOiB0cnVlLFxuICBcInR3YXNcIjogdHJ1ZSxcbiAgXCJ1c1wiOiB0cnVlLFxuICBcIndhbnRzXCI6IHRydWUsXG4gIFwid2FzXCI6IHRydWUsXG4gIFwid2VcIjogdHJ1ZSxcbiAgXCJ3ZXJlXCI6IHRydWUsXG4gIFwid2hhdFwiOiB0cnVlLFxuICBcIndoZW5cIjogdHJ1ZSxcbiAgXCJ3aGVyZVwiOiB0cnVlLFxuICBcIndoaWNoXCI6IHRydWUsXG4gIFwid2hpbGVcIjogdHJ1ZSxcbiAgXCJ3aG9cIjogdHJ1ZSxcbiAgXCJ3aG9tXCI6IHRydWUsXG4gIFwid2h5XCI6IHRydWUsXG4gIFwid2lsbFwiOiB0cnVlLFxuICBcIndpdGhcIjogdHJ1ZSxcbiAgXCJ3b3VsZFwiOiB0cnVlLFxuICBcInlldFwiOiB0cnVlLFxuICBcInlvdVwiOiB0cnVlLFxuICBcInlvdXJcIjogdHJ1ZVxufTtcblxuZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIuc3RvcFdvcmRzID0gZWxhc3RpY2x1bnIuZGVmYXVsdFN0b3BXb3JkcztcblxuZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJGdW5jdGlvbihlbGFzdGljbHVuci5zdG9wV29yZEZpbHRlciwgJ3N0b3BXb3JkRmlsdGVyJyk7XG4vKiFcbiAqIGVsYXN0aWNsdW5yLnRyaW1tZXJcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogZWxhc3RpY2x1bnIudHJpbW1lciBpcyBhIHBpcGVsaW5lIGZ1bmN0aW9uIGZvciB0cmltbWluZyBub24gd29yZFxuICogY2hhcmFjdGVycyBmcm9tIHRoZSBiZWdpbmluZyBhbmQgZW5kIG9mIHRva2VucyBiZWZvcmUgdGhleVxuICogZW50ZXIgdGhlIGluZGV4LlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gbWF5IG5vdCB3b3JrIGNvcnJlY3RseSBmb3Igbm9uIGxhdGluXG4gKiBjaGFyYWN0ZXJzIGFuZCBzaG91bGQgZWl0aGVyIGJlIHJlbW92ZWQgb3IgYWRhcHRlZCBmb3IgdXNlXG4gKiB3aXRoIGxhbmd1YWdlcyB3aXRoIG5vbi1sYXRpbiBjaGFyYWN0ZXJzLlxuICpcbiAqIEBtb2R1bGVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gcGFzcyB0aHJvdWdoIHRoZSBmaWx0ZXJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBzZWUgZWxhc3RpY2x1bnIuUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIudHJpbW1lciA9IGZ1bmN0aW9uICh0b2tlbikge1xuICBpZiAodG9rZW4gPT09IG51bGwgfHwgdG9rZW4gPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndG9rZW4gc2hvdWxkIG5vdCBiZSB1bmRlZmluZWQnKTtcbiAgfVxuXG4gIHJldHVybiB0b2tlblxuICAgIC5yZXBsYWNlKC9eXFxXKy8sICcnKVxuICAgIC5yZXBsYWNlKC9cXFcrJC8sICcnKTtcbn07XG5cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyRnVuY3Rpb24oZWxhc3RpY2x1bnIudHJpbW1lciwgJ3RyaW1tZXInKTtcbi8qIVxuICogZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleFxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKiBJbmNsdWRlcyBjb2RlIGZyb20gLSBodHRwOi8vdGFydGFydXMub3JnL35tYXJ0aW4vUG9ydGVyU3RlbW1lci9qcy50eHRcbiAqL1xuXG4vKipcbiAqIGVsYXN0aWNsdW5yLkludmVydGVkSW5kZXggaXMgdXNlZCBmb3IgZWZmaWNpZW50bHkgc3RvcmluZyBhbmRcbiAqIGxvb2t1cCBvZiBkb2N1bWVudHMgdGhhdCBjb250YWluIGEgZ2l2ZW4gdG9rZW4uXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXggPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMucm9vdCA9IHsgZG9jczoge30sIGRmOiAwIH07XG59O1xuXG4vKipcbiAqIExvYWRzIGEgcHJldmlvdXNseSBzZXJpYWxpc2VkIGludmVydGVkIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXJpYWxpc2VkRGF0YSBUaGUgc2VyaWFsaXNlZCBpbnZlcnRlZCBpbmRleCB0byBsb2FkLlxuICogQHJldHVybiB7ZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleH1cbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5sb2FkID0gZnVuY3Rpb24gKHNlcmlhbGlzZWREYXRhKSB7XG4gIHZhciBpZHggPSBuZXcgdGhpcztcbiAgaWR4LnJvb3QgPSBzZXJpYWxpc2VkRGF0YS5yb290O1xuXG4gIHJldHVybiBpZHg7XG59O1xuXG4vKipcbiAqIEFkZHMgYSB7dG9rZW46IHRva2VuSW5mb30gcGFpciB0byB0aGUgaW52ZXJ0ZWQgaW5kZXguXG4gKiBJZiB0aGUgdG9rZW4gYWxyZWFkeSBleGlzdCwgdGhlbiB1cGRhdGUgdGhlIHRva2VuSW5mby5cbiAqXG4gKiB0b2tlbkluZm8gZm9ybWF0OiB7IHJlZjogMSwgdGY6IDJ9XG4gKiB0b2tlbkluZm9yIHNob3VsZCBjb250YWlucyB0aGUgZG9jdW1lbnQncyByZWYgYW5kIHRoZSB0Zih0b2tlbiBmcmVxdWVuY3kpIG9mIHRoYXQgdG9rZW4gaW5cbiAqIHRoZSBkb2N1bWVudC5cbiAqXG4gKiBCeSBkZWZhdWx0IHRoaXMgZnVuY3Rpb24gc3RhcnRzIGF0IHRoZSByb290IG9mIHRoZSBjdXJyZW50IGludmVydGVkIGluZGV4LCBob3dldmVyXG4gKiBpdCBjYW4gc3RhcnQgYXQgYW55IG5vZGUgb2YgdGhlIGludmVydGVkIGluZGV4IGlmIHJlcXVpcmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBcbiAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbkluZm8gZm9ybWF0OiB7IHJlZjogMSwgdGY6IDJ9XG4gKiBAcGFyYW0ge09iamVjdH0gcm9vdCBBbiBvcHRpb25hbCBub2RlIGF0IHdoaWNoIHRvIHN0YXJ0IGxvb2tpbmcgZm9yIHRoZVxuICogY29ycmVjdCBwbGFjZSB0byBlbnRlciB0aGUgZG9jLCBieSBkZWZhdWx0IHRoZSByb290IG9mIHRoaXMgZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleFxuICogaXMgdXNlZC5cbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLmFkZFRva2VuID0gZnVuY3Rpb24gKHRva2VuLCB0b2tlbkluZm8sIHJvb3QpIHtcbiAgdmFyIHJvb3QgPSByb290IHx8IHRoaXMucm9vdCxcbiAgICAgIGlkeCA9IDA7XG5cbiAgd2hpbGUgKGlkeCA8PSB0b2tlbi5sZW5ndGggLSAxKSB7XG4gICAgdmFyIGtleSA9IHRva2VuW2lkeF07XG5cbiAgICBpZiAoIShrZXkgaW4gcm9vdCkpIHJvb3Rba2V5XSA9IHtkb2NzOiB7fSwgZGY6IDB9O1xuICAgIGlkeCArPSAxO1xuICAgIHJvb3QgPSByb290W2tleV07XG4gIH1cblxuICB2YXIgZG9jUmVmID0gdG9rZW5JbmZvLnJlZjtcbiAgaWYgKCFyb290LmRvY3NbZG9jUmVmXSkge1xuICAgIC8vIGlmIHRoaXMgZG9jIG5vdCBleGlzdCwgdGhlbiBhZGQgdGhpcyBkb2NcbiAgICByb290LmRvY3NbZG9jUmVmXSA9IHt0ZjogdG9rZW5JbmZvLnRmfTtcbiAgICByb290LmRmICs9IDE7XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgdGhpcyBkb2MgYWxyZWFkeSBleGlzdCwgdGhlbiB1cGRhdGUgdG9rZW5JbmZvXG4gICAgcm9vdC5kb2NzW2RvY1JlZl0gPSB7dGY6IHRva2VuSW5mby50Zn07XG4gIH1cbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSB0b2tlbiBpcyBpbiB0aGlzIGVsYXN0aWNsdW5yLkludmVydGVkSW5kZXguXG4gKiBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIGJlIGNoZWNrZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS5oYXNUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbikge1xuICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIG5vZGUgPSB0aGlzLnJvb3Q7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbi5sZW5ndGg7IGkrKykge1xuICAgIGlmICghbm9kZVt0b2tlbltpXV0pIHJldHVybiBmYWxzZTtcbiAgICBub2RlID0gbm9kZVt0b2tlbltpXV07XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgYSBub2RlIGZyb20gdGhlIGludmVydGVkIGluZGV4IGZvciBhIGdpdmVuIHRva2VuLlxuICogSWYgdG9rZW4gbm90IGZvdW5kIGluIHRoaXMgSW52ZXJ0ZWRJbmRleCwgcmV0dXJuIG51bGwuXG4gKiBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIGdldCB0aGUgbm9kZSBmb3IuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAc2VlIEludmVydGVkSW5kZXgucHJvdG90eXBlLmdldFxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUuZ2V0Tm9kZSA9IGZ1bmN0aW9uICh0b2tlbikge1xuICBpZiAoIXRva2VuKSByZXR1cm4gbnVsbDtcblxuICB2YXIgbm9kZSA9IHRoaXMucm9vdDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2VuLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFub2RlW3Rva2VuW2ldXSkgcmV0dXJuIG51bGw7XG4gICAgbm9kZSA9IG5vZGVbdG9rZW5baV1dO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBkb2N1bWVudHMgb2YgYSBnaXZlbiB0b2tlbi5cbiAqIElmIHRva2VuIG5vdCBmb3VuZCwgcmV0dXJuIHt9LlxuICpcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIGdldCB0aGUgZG9jdW1lbnRzIGZvci5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLmdldERvY3MgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgdmFyIG5vZGUgPSB0aGlzLmdldE5vZGUodG9rZW4pO1xuICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIG5vZGUuZG9jcztcbn07XG5cbi8qKlxuICogUmV0cmlldmUgdGVybSBmcmVxdWVuY3kgb2YgZ2l2ZW4gdG9rZW4gaW4gZ2l2ZW4gZG9jUmVmLlxuICogSWYgdG9rZW4gb3IgZG9jUmVmIG5vdCBmb3VuZCwgcmV0dXJuIDAuXG4gKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gZ2V0IHRoZSBkb2N1bWVudHMgZm9yLlxuICogQHBhcmFtIHtTdHJpbmd8SW50ZWdlcn0gZG9jUmVmXG4gKiBAcmV0dXJuIHtJbnRlZ2VyfVxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUuZ2V0VGVybUZyZXF1ZW5jeSA9IGZ1bmN0aW9uICh0b2tlbiwgZG9jUmVmKSB7XG4gIHZhciBub2RlID0gdGhpcy5nZXROb2RlKHRva2VuKTtcblxuICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoIShkb2NSZWYgaW4gbm9kZS5kb2NzKSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIG5vZGUuZG9jc1tkb2NSZWZdLnRmO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgZG9jdW1lbnQgZnJlcXVlbmN5IG9mIGdpdmVuIHRva2VuLlxuICogSWYgdG9rZW4gbm90IGZvdW5kLCByZXR1cm4gMC5cbiAqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBnZXQgdGhlIGRvY3VtZW50cyBmb3IuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS5nZXREb2NGcmVxID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIHZhciBub2RlID0gdGhpcy5nZXROb2RlKHRva2VuKTtcblxuICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbm9kZS5kZjtcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkb2N1bWVudCBpZGVudGlmaWVkIGJ5IGRvY3VtZW50J3MgcmVmIGZyb20gdGhlIHRva2VuIGluIHRoZSBpbnZlcnRlZCBpbmRleC5cbiAqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFJlbW92ZSB0aGUgZG9jdW1lbnQgZnJvbSB3aGljaCB0b2tlbi5cbiAqIEBwYXJhbSB7U3RyaW5nfSByZWYgVGhlIHJlZiBvZiB0aGUgZG9jdW1lbnQgdG8gcmVtb3ZlIGZyb20gZ2l2ZW4gdG9rZW4uXG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS5yZW1vdmVUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbiwgcmVmKSB7XG4gIGlmICghdG9rZW4pIHJldHVybjtcbiAgdmFyIG5vZGUgPSB0aGlzLmdldE5vZGUodG9rZW4pO1xuXG4gIGlmIChub2RlID09IG51bGwpIHJldHVybjtcblxuICBpZiAocmVmIGluIG5vZGUuZG9jcykge1xuICAgIGRlbGV0ZSBub2RlLmRvY3NbcmVmXTtcbiAgICBub2RlLmRmIC09IDE7XG4gIH1cbn07XG5cbi8qKlxuICogRmluZCBhbGwgdGhlIHBvc3NpYmxlIHN1ZmZpeGVzIG9mIGdpdmVuIHRva2VuIHVzaW5nIHRva2VucyBjdXJyZW50bHkgaW4gdGhlIGludmVydGVkIGluZGV4LlxuICogSWYgdG9rZW4gbm90IGZvdW5kLCByZXR1cm4gZW1wdHkgQXJyYXkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBleHBhbmQuXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLmV4cGFuZFRva2VuID0gZnVuY3Rpb24gKHRva2VuLCBtZW1vLCByb290KSB7XG4gIGlmICh0b2tlbiA9PSBudWxsIHx8IHRva2VuID09ICcnKSByZXR1cm4gW107XG4gIHZhciBtZW1vID0gbWVtbyB8fCBbXTtcblxuICBpZiAocm9vdCA9PSB2b2lkIDApIHtcbiAgICByb290ID0gdGhpcy5nZXROb2RlKHRva2VuKTtcbiAgICBpZiAocm9vdCA9PSBudWxsKSByZXR1cm4gbWVtbztcbiAgfVxuXG4gIGlmIChyb290LmRmID4gMCkgbWVtby5wdXNoKHRva2VuKTtcblxuICBmb3IgKHZhciBrZXkgaW4gcm9vdCkge1xuICAgIGlmIChrZXkgPT09ICdkb2NzJykgY29udGludWU7XG4gICAgaWYgKGtleSA9PT0gJ2RmJykgY29udGludWU7XG4gICAgdGhpcy5leHBhbmRUb2tlbih0b2tlbiArIGtleSwgbWVtbywgcm9vdFtrZXldKTtcbiAgfVxuXG4gIHJldHVybiBtZW1vO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIGludmVydGVkIGluZGV4IHJlYWR5IGZvciBzZXJpYWxpc2F0aW9uLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByb290OiB0aGlzLnJvb3RcbiAgfTtcbn07XG5cbi8qIVxuICogZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvblxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cbiBcbiAvKiogXG4gICogZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbiBpcyB1c2VkIHRvIGFuYWx5emUgdGhlIHVzZXIgc2VhcmNoIGNvbmZpZ3VyYXRpb24uXG4gICogXG4gICogQnkgZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbiB1c2VyIGNvdWxkIHNldCBxdWVyeS10aW1lIGJvb3N0aW5nLCBib29sZWFuIG1vZGVsIGluIGVhY2ggZmllbGQuXG4gICogXG4gICogQ3VycmVudGx5IGNvbmZpZ3VyYXRpb24gc3VwcG9ydHM6XG4gICogMS4gcXVlcnktdGltZSBib29zdGluZywgdXNlciBjb3VsZCBzZXQgaG93IHRvIGJvb3N0IGVhY2ggZmllbGQuXG4gICogMi4gYm9vbGVhbiBtb2RlbCBjaG9zaW5nLCB1c2VyIGNvdWxkIGNob29zZSB3aGljaCBib29sZWFuIG1vZGVsIHRvIHVzZSBmb3IgZWFjaCBmaWVsZC5cbiAgKiAzLiB0b2tlbiBleHBhbmRhdGlvbiwgdXNlciBjb3VsZCBzZXQgdG9rZW4gZXhwYW5kIHRvIFRydWUgdG8gaW1wcm92ZSBSZWNhbGwuIERlZmF1bHQgaXMgRmFsc2UuXG4gICogXG4gICogUXVlcnkgdGltZSBib29zdGluZyBtdXN0IGJlIGNvbmZpZ3VyZWQgYnkgZmllbGQgY2F0ZWdvcnksIFwiYm9vbGVhblwiIG1vZGVsIGNvdWxkIGJlIGNvbmZpZ3VyZWQgXG4gICogYnkgYm90aCBmaWVsZCBjYXRlZ29yeSBvciBnbG9iYWxseSBhcyB0aGUgZm9sbG93aW5nIGV4YW1wbGUuIEZpZWxkIGNvbmZpZ3VyYXRpb24gZm9yIFwiYm9vbGVhblwiXG4gICogd2lsbCBvdmVyd3JpdGUgZ2xvYmFsIGNvbmZpZ3VyYXRpb24uXG4gICogVG9rZW4gZXhwYW5kIGNvdWxkIGJlIGNvbmZpZ3VyZWQgYm90aCBieSBmaWVsZCBjYXRlZ29yeSBvciBnb2xiYWxseS4gTG9jYWwgZmllbGQgY29uZmlndXJhdGlvbiB3aWxsXG4gICogb3ZlcndyaXRlIGdsb2JhbCBjb25maWd1cmF0aW9uLlxuICAqIFxuICAqIGNvbmZpZ3VyYXRpb24gZXhhbXBsZTpcbiAgKiB7XG4gICogICBmaWVsZHM6eyBcbiAgKiAgICAgdGl0bGU6IHtib29zdDogMn0sXG4gICogICAgIGJvZHk6IHtib29zdDogMX1cbiAgKiAgIH0sXG4gICogICBib29sOiBcIk9SXCJcbiAgKiB9XG4gICogXG4gICogXCJib29sXCIgZmllbGQgY29uZmlndWF0aW9uIG92ZXJ3cml0ZSBnbG9iYWwgY29uZmlndWF0aW9uIGV4YW1wbGU6XG4gICoge1xuICAqICAgZmllbGRzOnsgXG4gICogICAgIHRpdGxlOiB7Ym9vc3Q6IDIsIGJvb2w6IFwiQU5EXCJ9LFxuICAqICAgICBib2R5OiB7Ym9vc3Q6IDF9XG4gICogICB9LFxuICAqICAgYm9vbDogXCJPUlwiXG4gICogfVxuICAqIFxuICAqIFwiZXhwYW5kXCIgZXhhbXBsZTpcbiAgKiB7XG4gICogICBmaWVsZHM6eyBcbiAgKiAgICAgdGl0bGU6IHtib29zdDogMiwgYm9vbDogXCJBTkRcIn0sXG4gICogICAgIGJvZHk6IHtib29zdDogMX1cbiAgKiAgIH0sXG4gICogICBib29sOiBcIk9SXCIsXG4gICogICBleHBhbmQ6IHRydWVcbiAgKiB9XG4gICogXG4gICogXCJleHBhbmRcIiBleGFtcGxlIGZvciBmaWVsZCBjYXRlZ29yeTpcbiAgKiB7XG4gICogICBmaWVsZHM6eyBcbiAgKiAgICAgdGl0bGU6IHtib29zdDogMiwgYm9vbDogXCJBTkRcIiwgZXhwYW5kOiB0cnVlfSxcbiAgKiAgICAgYm9keToge2Jvb3N0OiAxfVxuICAqICAgfSxcbiAgKiAgIGJvb2w6IFwiT1JcIlxuICAqIH1cbiAgKiBcbiAgKiBzZXR0aW5nIHRoZSBib29zdCB0byAwIGlnbm9yZXMgdGhlIGZpZWxkICh0aGlzIHdpbGwgb25seSBzZWFyY2ggdGhlIHRpdGxlKTpcbiAgKiB7XG4gICogICBmaWVsZHM6e1xuICAqICAgICB0aXRsZToge2Jvb3N0OiAxfSxcbiAgKiAgICAgYm9keToge2Jvb3N0OiAwfVxuICAqICAgfVxuICAqIH1cbiAgKlxuICAqIHRoZW4sIHVzZXIgY291bGQgc2VhcmNoIHdpdGggY29uZmlndXJhdGlvbiB0byBkbyBxdWVyeS10aW1lIGJvb3N0aW5nLlxuICAqIGlkeC5zZWFyY2goJ29yYWNsZSBkYXRhYmFzZScsIHtmaWVsZHM6IHt0aXRsZToge2Jvb3N0OiAyfSwgYm9keToge2Jvb3N0OiAxfX19KTtcbiAgKiBcbiAgKiBcbiAgKiBAY29uc3RydWN0b3JcbiAgKiBcbiAgKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnIHVzZXIgY29uZmlndXJhdGlvblxuICAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkcyBmaWVsZHMgb2YgaW5kZXggaW5zdGFuY2VcbiAgKiBAbW9kdWxlXG4gICovXG5lbGFzdGljbHVuci5Db25maWd1cmF0aW9uID0gZnVuY3Rpb24gKGNvbmZpZywgZmllbGRzKSB7XG4gIHZhciBjb25maWcgPSBjb25maWcgfHwgJyc7XG5cbiAgaWYgKGZpZWxkcyA9PSB1bmRlZmluZWQgfHwgZmllbGRzID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZWxkcyBzaG91bGQgbm90IGJlIG51bGwnKTtcbiAgfVxuXG4gIHRoaXMuY29uZmlnID0ge307XG5cbiAgdmFyIHVzZXJDb25maWc7XG4gIHRyeSB7XG4gICAgdXNlckNvbmZpZyA9IEpTT04ucGFyc2UoY29uZmlnKTtcbiAgICB0aGlzLmJ1aWxkVXNlckNvbmZpZyh1c2VyQ29uZmlnLCBmaWVsZHMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVsYXN0aWNsdW5yLnV0aWxzLndhcm4oJ3VzZXIgY29uZmlndXJhdGlvbiBwYXJzZSBmYWlsZWQsIHdpbGwgdXNlIGRlZmF1bHQgY29uZmlndXJhdGlvbicpO1xuICAgIHRoaXMuYnVpbGREZWZhdWx0Q29uZmlnKGZpZWxkcyk7XG4gIH1cbn07XG5cbi8qKlxuICogQnVpbGQgZGVmYXVsdCBzZWFyY2ggY29uZmlndXJhdGlvbi5cbiAqIFxuICogQHBhcmFtIHtBcnJheX0gZmllbGRzIGZpZWxkcyBvZiBpbmRleCBpbnN0YW5jZVxuICovXG5lbGFzdGljbHVuci5Db25maWd1cmF0aW9uLnByb3RvdHlwZS5idWlsZERlZmF1bHRDb25maWcgPSBmdW5jdGlvbiAoZmllbGRzKSB7XG4gIHRoaXMucmVzZXQoKTtcbiAgZmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgdGhpcy5jb25maWdbZmllbGRdID0ge1xuICAgICAgYm9vc3Q6IDEsXG4gICAgICBib29sOiBcIk9SXCIsXG4gICAgICBleHBhbmQ6IGZhbHNlXG4gICAgfTtcbiAgfSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIEJ1aWxkIHVzZXIgY29uZmlndXJhdGlvbi5cbiAqIFxuICogQHBhcmFtIHtKU09OfSBjb25maWcgVXNlciBKU09OIGNvbmZpZ3VyYXRvaW5cbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkcyBmaWVsZHMgb2YgaW5kZXggaW5zdGFuY2VcbiAqL1xuZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbi5wcm90b3R5cGUuYnVpbGRVc2VyQ29uZmlnID0gZnVuY3Rpb24gKGNvbmZpZywgZmllbGRzKSB7XG4gIHZhciBnbG9iYWxfYm9vbCA9IFwiT1JcIjtcbiAgdmFyIGdsb2JhbF9leHBhbmQgPSBmYWxzZTtcblxuICB0aGlzLnJlc2V0KCk7XG4gIGlmICgnYm9vbCcgaW4gY29uZmlnKSB7XG4gICAgZ2xvYmFsX2Jvb2wgPSBjb25maWdbJ2Jvb2wnXSB8fCBnbG9iYWxfYm9vbDtcbiAgfVxuXG4gIGlmICgnZXhwYW5kJyBpbiBjb25maWcpIHtcbiAgICBnbG9iYWxfZXhwYW5kID0gY29uZmlnWydleHBhbmQnXSB8fCBnbG9iYWxfZXhwYW5kO1xuICB9XG5cbiAgaWYgKCdmaWVsZHMnIGluIGNvbmZpZykge1xuICAgIGZvciAodmFyIGZpZWxkIGluIGNvbmZpZ1snZmllbGRzJ10pIHtcbiAgICAgIGlmIChmaWVsZHMuaW5kZXhPZihmaWVsZCkgPiAtMSkge1xuICAgICAgICB2YXIgZmllbGRfY29uZmlnID0gY29uZmlnWydmaWVsZHMnXVtmaWVsZF07XG4gICAgICAgIHZhciBmaWVsZF9leHBhbmQgPSBnbG9iYWxfZXhwYW5kO1xuICAgICAgICBpZiAoZmllbGRfY29uZmlnLmV4cGFuZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBmaWVsZF9leHBhbmQgPSBmaWVsZF9jb25maWcuZXhwYW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWdbZmllbGRdID0ge1xuICAgICAgICAgIGJvb3N0OiAoZmllbGRfY29uZmlnLmJvb3N0IHx8IGZpZWxkX2NvbmZpZy5ib29zdCA9PT0gMCkgPyBmaWVsZF9jb25maWcuYm9vc3QgOiAxLFxuICAgICAgICAgIGJvb2w6IGZpZWxkX2NvbmZpZy5ib29sIHx8IGdsb2JhbF9ib29sLFxuICAgICAgICAgIGV4cGFuZDogZmllbGRfZXhwYW5kXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGFzdGljbHVuci51dGlscy53YXJuKCdmaWVsZCBuYW1lIGluIHVzZXIgY29uZmlndXJhdGlvbiBub3QgZm91bmQgaW4gaW5kZXggaW5zdGFuY2UgZmllbGRzJyk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuYWRkQWxsRmllbGRzMlVzZXJDb25maWcoZ2xvYmFsX2Jvb2wsIGdsb2JhbF9leHBhbmQsIGZpZWxkcyk7XG4gIH1cbn07XG5cbi8qKlxuICogQWRkIGFsbCBmaWVsZHMgdG8gdXNlciBzZWFyY2ggY29uZmlndXJhdGlvbi5cbiAqIFxuICogQHBhcmFtIHtTdHJpbmd9IGJvb2wgQm9vbGVhbiBtb2RlbFxuICogQHBhcmFtIHtTdHJpbmd9IGV4cGFuZCBFeHBhbmQgbW9kZWxcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkcyBmaWVsZHMgb2YgaW5kZXggaW5zdGFuY2VcbiAqL1xuZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbi5wcm90b3R5cGUuYWRkQWxsRmllbGRzMlVzZXJDb25maWcgPSBmdW5jdGlvbiAoYm9vbCwgZXhwYW5kLCBmaWVsZHMpIHtcbiAgZmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgdGhpcy5jb25maWdbZmllbGRdID0ge1xuICAgICAgYm9vc3Q6IDEsXG4gICAgICBib29sOiBib29sLFxuICAgICAgZXhwYW5kOiBleHBhbmRcbiAgICB9O1xuICB9LCB0aGlzKTtcbn07XG5cbi8qKlxuICogZ2V0IGN1cnJlbnQgdXNlciBjb25maWd1cmF0aW9uXG4gKi9cbmVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuY29uZmlnO1xufTtcblxuLyoqXG4gKiByZXNldCB1c2VyIHNlYXJjaCBjb25maWd1cmF0aW9uLlxuICovXG5lbGFzdGljbHVuci5Db25maWd1cmF0aW9uLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jb25maWcgPSB7fTtcbn07XG4vKipcbiAqIHNvcnRlZF9zZXQuanMgaXMgYWRkZWQgb25seSB0byBtYWtlIGVsYXN0aWNsdW5yLmpzIGNvbXBhdGlibGUgd2l0aCBsdW5yLWxhbmd1YWdlcy5cbiAqIGlmIGVsYXN0aWNsdW5yLmpzIHN1cHBvcnQgZGlmZmVyZW50IGxhbmd1YWdlcyBieSBkZWZhdWx0LCB0aGlzIHdpbGwgbWFrZSBlbGFzdGljbHVuci5qc1xuICogbXVjaCBiaWdnZXIgdGhhdCBub3QgZ29vZCBmb3IgYnJvd3NlciB1c2FnZS5cbiAqXG4gKi9cblxuXG4vKiFcbiAqIGx1bnIuU29ydGVkU2V0XG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKi9cblxuLyoqXG4gKiBsdW5yLlNvcnRlZFNldHMgYXJlIHVzZWQgdG8gbWFpbnRhaW4gYW4gYXJyYXkgb2YgdW5pcSB2YWx1ZXMgaW4gYSBzb3J0ZWRcbiAqIG9yZGVyLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5sdW5yLlNvcnRlZFNldCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5sZW5ndGggPSAwXG4gIHRoaXMuZWxlbWVudHMgPSBbXVxufVxuXG4vKipcbiAqIExvYWRzIGEgcHJldmlvdXNseSBzZXJpYWxpc2VkIHNvcnRlZCBzZXQuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gc2VyaWFsaXNlZERhdGEgVGhlIHNlcmlhbGlzZWQgc2V0IHRvIGxvYWQuXG4gKiBAcmV0dXJucyB7bHVuci5Tb3J0ZWRTZXR9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LmxvYWQgPSBmdW5jdGlvbiAoc2VyaWFsaXNlZERhdGEpIHtcbiAgdmFyIHNldCA9IG5ldyB0aGlzXG5cbiAgc2V0LmVsZW1lbnRzID0gc2VyaWFsaXNlZERhdGFcbiAgc2V0Lmxlbmd0aCA9IHNlcmlhbGlzZWREYXRhLmxlbmd0aFxuXG4gIHJldHVybiBzZXRcbn1cblxuLyoqXG4gKiBJbnNlcnRzIG5ldyBpdGVtcyBpbnRvIHRoZSBzZXQgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24gdG8gbWFpbnRhaW4gdGhlXG4gKiBvcmRlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gVGhlIG9iamVjdHMgdG8gYWRkIHRvIHRoaXMgc2V0LlxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaSwgZWxlbWVudFxuXG4gIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBlbGVtZW50ID0gYXJndW1lbnRzW2ldXG4gICAgaWYgKH50aGlzLmluZGV4T2YoZWxlbWVudCkpIGNvbnRpbnVlXG4gICAgdGhpcy5lbGVtZW50cy5zcGxpY2UodGhpcy5sb2NhdGlvbkZvcihlbGVtZW50KSwgMCwgZWxlbWVudClcbiAgfVxuXG4gIHRoaXMubGVuZ3RoID0gdGhpcy5lbGVtZW50cy5sZW5ndGhcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyB0aGlzIHNvcnRlZCBzZXQgaW50byBhbiBhcnJheS5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5lbGVtZW50cy5zbGljZSgpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBhcnJheSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeVxuICogZWxlbWVudCBpbiB0aGlzIHNvcnRlZCBzZXQuXG4gKlxuICogRGVsZWdhdGVzIHRvIEFycmF5LnByb3RvdHlwZS5tYXAgYW5kIGhhcyB0aGUgc2FtZSBzaWduYXR1cmUuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIG9uIGVhY2ggZWxlbWVudCBvZiB0aGVcbiAqIHNldC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHggQW4gb3B0aW9uYWwgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgYXMgdGhlIGNvbnRleHRcbiAqIGZvciB0aGUgZnVuY3Rpb24gZm4uXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiAoZm4sIGN0eCkge1xuICByZXR1cm4gdGhpcy5lbGVtZW50cy5tYXAoZm4sIGN0eClcbn1cblxuLyoqXG4gKiBFeGVjdXRlcyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgcGVyIHNvcnRlZCBzZXQgZWxlbWVudC5cbiAqXG4gKiBEZWxlZ2F0ZXMgdG8gQXJyYXkucHJvdG90eXBlLmZvckVhY2ggYW5kIGhhcyB0aGUgc2FtZSBzaWduYXR1cmUuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIG9uIGVhY2ggZWxlbWVudCBvZiB0aGVcbiAqIHNldC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHggQW4gb3B0aW9uYWwgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgYXMgdGhlIGNvbnRleHRcbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqIGZvciB0aGUgZnVuY3Rpb24gZm4uXG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGZuLCBjdHgpIHtcbiAgcmV0dXJuIHRoaXMuZWxlbWVudHMuZm9yRWFjaChmbiwgY3R4KVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGluZGV4IGF0IHdoaWNoIGEgZ2l2ZW4gZWxlbWVudCBjYW4gYmUgZm91bmQgaW4gdGhlXG4gKiBzb3J0ZWQgc2V0LCBvciAtMSBpZiBpdCBpcyBub3QgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbSBUaGUgb2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgc29ydGVkIHNldC5cbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgdmFyIHN0YXJ0ID0gMCxcbiAgICAgIGVuZCA9IHRoaXMuZWxlbWVudHMubGVuZ3RoLFxuICAgICAgc2VjdGlvbkxlbmd0aCA9IGVuZCAtIHN0YXJ0LFxuICAgICAgcGl2b3QgPSBzdGFydCArIE1hdGguZmxvb3Ioc2VjdGlvbkxlbmd0aCAvIDIpLFxuICAgICAgcGl2b3RFbGVtID0gdGhpcy5lbGVtZW50c1twaXZvdF1cblxuICB3aGlsZSAoc2VjdGlvbkxlbmd0aCA+IDEpIHtcbiAgICBpZiAocGl2b3RFbGVtID09PSBlbGVtKSByZXR1cm4gcGl2b3RcblxuICAgIGlmIChwaXZvdEVsZW0gPCBlbGVtKSBzdGFydCA9IHBpdm90XG4gICAgaWYgKHBpdm90RWxlbSA+IGVsZW0pIGVuZCA9IHBpdm90XG5cbiAgICBzZWN0aW9uTGVuZ3RoID0gZW5kIC0gc3RhcnRcbiAgICBwaXZvdCA9IHN0YXJ0ICsgTWF0aC5mbG9vcihzZWN0aW9uTGVuZ3RoIC8gMilcbiAgICBwaXZvdEVsZW0gPSB0aGlzLmVsZW1lbnRzW3Bpdm90XVxuICB9XG5cbiAgaWYgKHBpdm90RWxlbSA9PT0gZWxlbSkgcmV0dXJuIHBpdm90XG5cbiAgcmV0dXJuIC0xXG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcG9zaXRpb24gd2l0aGluIHRoZSBzb3J0ZWQgc2V0IHRoYXQgYW4gZWxlbWVudCBzaG91bGQgYmVcbiAqIGluc2VydGVkIGF0IHRvIG1haW50YWluIHRoZSBjdXJyZW50IG9yZGVyIG9mIHRoZSBzZXQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIGVsZW1lbnQgdG8gc2VhcmNoIGZvciBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0XG4gKiBpbiB0aGUgc29ydGVkIHNldC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbSBUaGUgZWxlbSB0byBmaW5kIHRoZSBwb3NpdGlvbiBmb3IgaW4gdGhlIHNldFxuICogQHJldHVybnMge051bWJlcn1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLmxvY2F0aW9uRm9yID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgdmFyIHN0YXJ0ID0gMCxcbiAgICAgIGVuZCA9IHRoaXMuZWxlbWVudHMubGVuZ3RoLFxuICAgICAgc2VjdGlvbkxlbmd0aCA9IGVuZCAtIHN0YXJ0LFxuICAgICAgcGl2b3QgPSBzdGFydCArIE1hdGguZmxvb3Ioc2VjdGlvbkxlbmd0aCAvIDIpLFxuICAgICAgcGl2b3RFbGVtID0gdGhpcy5lbGVtZW50c1twaXZvdF1cblxuICB3aGlsZSAoc2VjdGlvbkxlbmd0aCA+IDEpIHtcbiAgICBpZiAocGl2b3RFbGVtIDwgZWxlbSkgc3RhcnQgPSBwaXZvdFxuICAgIGlmIChwaXZvdEVsZW0gPiBlbGVtKSBlbmQgPSBwaXZvdFxuXG4gICAgc2VjdGlvbkxlbmd0aCA9IGVuZCAtIHN0YXJ0XG4gICAgcGl2b3QgPSBzdGFydCArIE1hdGguZmxvb3Ioc2VjdGlvbkxlbmd0aCAvIDIpXG4gICAgcGl2b3RFbGVtID0gdGhpcy5lbGVtZW50c1twaXZvdF1cbiAgfVxuXG4gIGlmIChwaXZvdEVsZW0gPiBlbGVtKSByZXR1cm4gcGl2b3RcbiAgaWYgKHBpdm90RWxlbSA8IGVsZW0pIHJldHVybiBwaXZvdCArIDFcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGx1bnIuU29ydGVkU2V0IHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIGluIHRoZSBpbnRlcnNlY3Rpb25cbiAqIG9mIHRoaXMgc2V0IGFuZCB0aGUgcGFzc2VkIHNldC5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuU29ydGVkU2V0fSBvdGhlclNldCBUaGUgc2V0IHRvIGludGVyc2VjdCB3aXRoIHRoaXMgc2V0LlxuICogQHJldHVybnMge2x1bnIuU29ydGVkU2V0fVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUuaW50ZXJzZWN0ID0gZnVuY3Rpb24gKG90aGVyU2V0KSB7XG4gIHZhciBpbnRlcnNlY3RTZXQgPSBuZXcgbHVuci5Tb3J0ZWRTZXQsXG4gICAgICBpID0gMCwgaiA9IDAsXG4gICAgICBhX2xlbiA9IHRoaXMubGVuZ3RoLCBiX2xlbiA9IG90aGVyU2V0Lmxlbmd0aCxcbiAgICAgIGEgPSB0aGlzLmVsZW1lbnRzLCBiID0gb3RoZXJTZXQuZWxlbWVudHNcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChpID4gYV9sZW4gLSAxIHx8IGogPiBiX2xlbiAtIDEpIGJyZWFrXG5cbiAgICBpZiAoYVtpXSA9PT0gYltqXSkge1xuICAgICAgaW50ZXJzZWN0U2V0LmFkZChhW2ldKVxuICAgICAgaSsrLCBqKytcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgaWYgKGFbaV0gPCBiW2pdKSB7XG4gICAgICBpKytcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgaWYgKGFbaV0gPiBiW2pdKSB7XG4gICAgICBqKytcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBpbnRlcnNlY3RTZXRcbn1cblxuLyoqXG4gKiBNYWtlcyBhIGNvcHkgb2YgdGhpcyBzZXRcbiAqXG4gKiBAcmV0dXJucyB7bHVuci5Tb3J0ZWRTZXR9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNsb25lID0gbmV3IGx1bnIuU29ydGVkU2V0XG5cbiAgY2xvbmUuZWxlbWVudHMgPSB0aGlzLnRvQXJyYXkoKVxuICBjbG9uZS5sZW5ndGggPSBjbG9uZS5lbGVtZW50cy5sZW5ndGhcblxuICByZXR1cm4gY2xvbmVcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGx1bnIuU29ydGVkU2V0IHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIGluIHRoZSB1bmlvblxuICogb2YgdGhpcyBzZXQgYW5kIHRoZSBwYXNzZWQgc2V0LlxuICpcbiAqIEBwYXJhbSB7bHVuci5Tb3J0ZWRTZXR9IG90aGVyU2V0IFRoZSBzZXQgdG8gdW5pb24gd2l0aCB0aGlzIHNldC5cbiAqIEByZXR1cm5zIHtsdW5yLlNvcnRlZFNldH1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24gKG90aGVyU2V0KSB7XG4gIHZhciBsb25nU2V0LCBzaG9ydFNldCwgdW5pb25TZXRcblxuICBpZiAodGhpcy5sZW5ndGggPj0gb3RoZXJTZXQubGVuZ3RoKSB7XG4gICAgbG9uZ1NldCA9IHRoaXMsIHNob3J0U2V0ID0gb3RoZXJTZXRcbiAgfSBlbHNlIHtcbiAgICBsb25nU2V0ID0gb3RoZXJTZXQsIHNob3J0U2V0ID0gdGhpc1xuICB9XG5cbiAgdW5pb25TZXQgPSBsb25nU2V0LmNsb25lKClcblxuICBmb3IodmFyIGkgPSAwLCBzaG9ydFNldEVsZW1lbnRzID0gc2hvcnRTZXQudG9BcnJheSgpOyBpIDwgc2hvcnRTZXRFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgdW5pb25TZXQuYWRkKHNob3J0U2V0RWxlbWVudHNbaV0pXG4gIH1cblxuICByZXR1cm4gdW5pb25TZXRcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNvcnRlZCBzZXQgcmVhZHkgZm9yIHNlcmlhbGlzYXRpb24uXG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy50b0FycmF5KClcbn1cbiAgLyoqXG4gICAqIGV4cG9ydCB0aGUgbW9kdWxlIHZpYSBBTUQsIENvbW1vbkpTIG9yIGFzIGEgYnJvd3NlciBnbG9iYWxcbiAgICogRXhwb3J0IGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAgICovXG4gIDsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICBkZWZpbmUoZmFjdG9yeSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgLyoqXG4gICAgICAgKiBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAgICAqIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgKiBsaWtlIE5vZGUuXG4gICAgICAgKi9cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgICByb290LmVsYXN0aWNsdW5yID0gZmFjdG9yeSgpXG4gICAgfVxuICB9KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBKdXN0IHJldHVybiBhIHZhbHVlIHRvIGRlZmluZSB0aGUgbW9kdWxlIGV4cG9ydC5cbiAgICAgKiBUaGlzIGV4YW1wbGUgcmV0dXJucyBhbiBvYmplY3QsIGJ1dCB0aGUgbW9kdWxlXG4gICAgICogY2FuIHJldHVybiBhIGZ1bmN0aW9uIGFzIHRoZSBleHBvcnRlZCB2YWx1ZS5cbiAgICAgKi9cbiAgICByZXR1cm4gZWxhc3RpY2x1bnJcbiAgfSkpXG59KSgpO1xuIiwiaW1wb3J0IHsgZnJvbUpTT05TYWZlVGV4dCwgdG9KU09OU2FmZVRleHQgfSBmcm9tIFwiLi91dGlsL2pzb24tdGV4dC1jb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHsgY29weVRvQ2xpcGJvYXJkIH0gZnJvbSBcIi4vdXRpbC9jbGlwYm9hcmRcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvU3RhY2ssIHJlbW92ZUl0ZW1Gcm9tU3RhY2sgfSBmcm9tIFwiLi9mZWF0dXJlcy9zZWFyY2gtc3RhY2tcIjtcclxuaW1wb3J0IHsgTGVmdFBhbmVUeXBlLCB3aGljaExlZnRQYW5lQWN0aXZlIH0gZnJvbSBcIi4vZmVhdHVyZXMvcGFuZS1tYW5hZ2VtZW50XCI7XHJcbmltcG9ydCB7IGFkZEl0ZW1Ub0Rlc2t0b3AsIHJlbW92ZUl0ZW1Gcm9tRGVza3RvcCB9IGZyb20gXCIuL2ZlYXR1cmVzL2Rlc2t0b3BcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FyZEpTT04ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgICBjYXRlZ29yaWVzOiBzdHJpbmdbXTtcclxuICAgIHN1YmNhcmRzOiBzdHJpbmdbXTtcclxuICAgIGNyZWF0aW9uRGF0ZTogRGF0ZTtcclxuICAgIGVkaXREYXRlOiBEYXRlO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyZCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB1bmlxdWVJRDogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgICBjYXRlZ29yaWVzOiBzdHJpbmdbXTtcclxuICAgIHN1YkNhcmRzOiBzdHJpbmdbXTtcclxuICAgIGNyZWF0aW9uRGF0ZTogRGF0ZTtcclxuICAgIGVkaXREYXRlOiBEYXRlO1xyXG5cclxuICAgIG5vZGU6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgbm9kZURlc2t0b3BDb3B5OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG5vZGVJRDogc3RyaW5nO1xyXG4gICAgZGlzcGxheU1ldGFEYXRhOiBib29sZWFuO1xyXG4gICAgYWN0aXZlTmFtZTogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIGlkOiBzdHJpbmcgPSAnJyl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnVuaXF1ZUlEID0gbmFtZS5yZXBsYWNlKC8gL2csICctJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZnJvbUpTT05TYWZlVGV4dChkZXNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRpb25EYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmVkaXREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnN1YkNhcmRzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheU1ldGFEYXRhID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmFjdGl2ZU5hbWUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuY29uc3RydWN0Tm9kZUludGVybmFsKGlkKTtcclxuICAgICAgICB0aGlzLm5vZGVEZXNrdG9wQ29weSA9IHRoaXMuY29uc3RydWN0Tm9kZUludGVybmFsKGlkKTtcclxuICAgICAgICB0aGlzLm5vZGVJRCA9IGlkLmxlbmd0aCA+IDAgPyBpZCA6IHRoaXMudW5pcXVlSUQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0Tm9kZShpZDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLmNvbnN0cnVjdE5vZGVJbnRlcm5hbChpZCk7XHJcbiAgICAgICAgdGhpcy5ub2RlRGVza3RvcENvcHkgPSB0aGlzLmNvbnN0cnVjdE5vZGVJbnRlcm5hbChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0Tm9kZUludGVybmFsKGlkOiBzdHJpbmcpe1xyXG4gICAgICAgIC8vIGNyZWF0ZSBiYXNlIG5vZGVcclxuICAgICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgbmFtZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgICAgICBuYW1lTm9kZS5pbm5lclRleHQgPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgZGVzY3JpcHRpb25Ob2RlLmlubmVySFRNTCA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChuYW1lTm9kZSk7XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbk5vZGUpO1xyXG5cclxuICAgICAgICBuYW1lTm9kZS5jbGFzc05hbWUgPSAnY2FyZC1uYW1lJztcclxuICAgICAgICBuYW1lTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5hY3RpdmVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmKHdoaWNoTGVmdFBhbmVBY3RpdmUoKSA9PT0gTGVmdFBhbmVUeXBlLkRlc2t0b3Ape1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlSXRlbUZyb21EZXNrdG9wKHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlSXRlbUZyb21TdGFjayh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmFtZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmFjdGl2ZU5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgaWYod2hpY2hMZWZ0UGFuZUFjdGl2ZSgpID09PSBMZWZ0UGFuZVR5cGUuRGVza3RvcCl7XHJcbiAgICAgICAgICAgICAgICBhZGRJdGVtVG9EZXNrdG9wKHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWRkSXRlbVRvU3RhY2sodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIHN1YmNhcmRzXHJcbiAgICAgICAgaWYodGhpcy5zdWJDYXJkcy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgY29uc3Qgc3ViY2FyZE5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY29uc3Qgc3ViY2FyZEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g0Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmNhcmRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY29uc3QgbGVmdFN1YmNhcmRMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0U3ViY2FyZExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc3ViY2FyZEhlYWRlci5pbm5lckhUTUwgPSAnU3ViY2FyZHM6J1xyXG4gICAgICAgICAgICBzdWJjYXJkSGVhZGVyLmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtaGVhZGVyJztcclxuICAgICAgICAgICAgc3ViY2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChsZWZ0U3ViY2FyZExpc3QpO1xyXG4gICAgICAgICAgICBzdWJjYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0U3ViY2FyZExpc3QpO1xyXG4gICAgICAgICAgICBzdWJjYXJkQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtY29udGFpbmVyJztcclxuICAgICAgICAgICAgbGVmdFN1YmNhcmRMaXN0LmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtbGVmdGxpc3QnO1xyXG4gICAgICAgICAgICByaWdodFN1YmNhcmRMaXN0LmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtcmlnaHRsaXN0JztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVN1YmNhcmRJdGVtID0gKGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViY2FyZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIHN1YmNhcmRJdGVtLmlubmVySFRNTCA9IGAtICR7dGhpcy5zdWJDYXJkc1tpXX1gO1xyXG4gICAgICAgICAgICAgICAgc3ViY2FyZEl0ZW0uY2xhc3NOYW1lID0gJ2NhcmQtc3ViY2FyZC1pdGVtJztcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdWJjYXJkSXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc3ViQ2FyZHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbGVmdFN1YmNhcmRMaXN0LmFwcGVuZENoaWxkKGNyZWF0ZVN1YmNhcmRJdGVtKGkpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGZvcihsZXQgaSA9IDA7IGkgPCBNYXRoLmZsb29yKHRoaXMuc3ViQ2FyZHMubGVuZ3RoIC8gMik7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vICAgICBsZWZ0U3ViY2FyZExpc3QuYXBwZW5kQ2hpbGQoY3JlYXRlU3ViY2FyZEl0ZW0oaSkpXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZm9yKGxldCBpID0gTWF0aC5mbG9vcih0aGlzLnN1YkNhcmRzLmxlbmd0aCAvIDIpOyBpIDwgdGhpcy5zdWJDYXJkcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vICAgICByaWdodFN1YmNhcmRMaXN0LmFwcGVuZENoaWxkKGNyZWF0ZVN1YmNhcmRJdGVtKGkpKVxyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBzdWJjYXJkTm9kZS5hcHBlbmRDaGlsZChzdWJjYXJkSGVhZGVyKTtcclxuICAgICAgICAgICAgc3ViY2FyZE5vZGUuYXBwZW5kQ2hpbGQoc3ViY2FyZENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoc3ViY2FyZE5vZGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlIHN1YmNhcmRzJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFkZCBidXR0b25zXHJcbiAgICAgICAgY29uc3QgYnV0dG9uUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgY29weUpTT05CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjb3B5SlNPTkJ1dHRvbi5pbm5lclRleHQgPSAnQ29weSBKU09OJztcclxuICAgICAgICBjb3B5SlNPTkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNvcHlUb0NsaXBib2FyZCh0aGlzLnRvSlNPTigpKSk7XHJcbiAgICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGNvcHlKU09OQnV0dG9uKTtcclxuICAgICAgICBjb25zdCBjb3B5VW5pcXVlSURCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjb3B5VW5pcXVlSURCdXR0b24uaW5uZXJIVE1MID0gJ0NvcHkgSUQnO1xyXG4gICAgICAgIGNvcHlVbmlxdWVJREJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNvcHlUb0NsaXBib2FyZCh0aGlzLnVuaXF1ZUlEKSk7XHJcbiAgICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGNvcHlVbmlxdWVJREJ1dHRvbilcclxuICAgICAgICBidXR0b25Sb3cuY2xhc3NOYW1lID0gJ2NhcmQtYnV0dG9uLXJvdyc7XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChidXR0b25Sb3cpO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgY2F0ZWdvcnkgKyBtZXRhZGF0YSByZW5kZXJpbmdcclxuICAgICAgICBjb25zdCBtZXRhRGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIG1ldGFEaXNwbGF5LmNsYXNzTmFtZSA9ICdjYXJkLW1ldGEtcm93JztcclxuICAgICAgICBpZih0aGlzLmRpc3BsYXlNZXRhRGF0YSAmJiB0aGlzLmNhdGVnb3JpZXMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIG1ldGFEaXNwbGF5LmlubmVySFRNTCA9IHRoaXMuY2F0ZWdvcmllcy5tYXAoY2F0ID0+IGAjJHtjYXQucmVwbGFjZSgvIC9nLCAnLScpfWApLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChtZXRhRGlzcGxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaW5hbGl6ZSBub2RlIGNvbnN0cnVjdGlvblxyXG4gICAgICAgIG5vZGUuY2xhc3NOYW1lID0gJ2NhcmQnO1xyXG4gICAgICAgIGlmKGlkLmxlbmd0aCA+IDApIG5vZGUuaWQgPSBpZDtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0gXHJcblxyXG4gICAgZGlzYWJsZU5hbWVBZGRpbmcoKXtcclxuICAgICAgICB0aGlzLmFjdGl2ZU5hbWUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRlcyhjcmVhdGlvbkRhdGU6IERhdGUsIGVkaXREYXRlOiBEYXRlKXtcclxuICAgICAgICB0aGlzLmNyZWF0aW9uRGF0ZSA9IGNyZWF0aW9uRGF0ZTtcclxuICAgICAgICB0aGlzLmVkaXREYXRlID0gZWRpdERhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q2F0ZWdvcmllcyhjYXRlZ29yaWVzOiBzdHJpbmdbXSl7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdE5vZGUodGhpcy5ub2RlSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN1YmNhcmRzKHN1YmNhcmRzOiBzdHJpbmdbXSl7XHJcbiAgICAgICAgdGhpcy5zdWJDYXJkcyA9IHN1YmNhcmRzLnNvcnQoKTtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdE5vZGUodGhpcy5ub2RlSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpe1xyXG4gICAgICAgIHJldHVybiBge1xyXG4gICAgXCJuYW1lXCI6IFwiJHt0aGlzLm5hbWV9XCIsXHJcbiAgICBcInVuaXF1ZUlEXCI6IFwiJHt0aGlzLnVuaXF1ZUlEfVwiLFxyXG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIiR7dG9KU09OU2FmZVRleHQodGhpcy5kZXNjcmlwdGlvbil9XCIsXHJcblxyXG4gICAgXCJjcmVhdGlvbkRhdGVcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmNyZWF0aW9uRGF0ZSl9LFxyXG4gICAgXCJlZGl0RGF0ZVwiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuZWRpdERhdGUpfSxcclxuXHJcbiAgICBcImNhdGVnb3JpZXNcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmNhdGVnb3JpZXMpfSxcclxuICAgIFwic3ViY2FyZHNcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLnN1YkNhcmRzKX1cclxufWA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldE5vZGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2t0b3BOb2RlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZURlc2t0b3BDb3B5O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgZnJvbUpTT05TYWZlVGV4dCwgdG9KU09OU2FmZVRleHQgfSBmcm9tIFwiLi91dGlsL2pzb24tdGV4dC1jb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuL2NhcmRcIjtcclxuaW1wb3J0IHsgY29weVRvQ2xpcGJvYXJkIH0gZnJvbSBcIi4vdXRpbC9jbGlwYm9hcmRcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvU3RhY2ssIHJlbW92ZUl0ZW1Gcm9tU3RhY2sgfSBmcm9tIFwiLi9mZWF0dXJlcy9zZWFyY2gtc3RhY2tcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvRGVza3RvcCwgcmVtb3ZlSXRlbUZyb21EZXNrdG9wIH0gZnJvbSBcIi4vZmVhdHVyZXMvZGVza3RvcFwiO1xyXG5pbXBvcnQgeyB3aGljaExlZnRQYW5lQWN0aXZlLCBMZWZ0UGFuZVR5cGUgfSBmcm9tIFwiLi9mZWF0dXJlcy9wYW5lLW1hbmFnZW1lbnRcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FyZEdyb3VwSlNPTiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIGNoaWxkcmVuSURzOiBzdHJpbmdbXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhcmRHcm91cCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB1bmlxdWVJRDogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgICBjaGlsZHJlbklEczogc3RyaW5nW107XHJcbiAgICBjaGlsZHJlbjogKENhcmRHcm91cCB8IENhcmQpW11cclxuXHJcbiAgICBub2RlOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG5vZGVEZXNrdG9wQ29weTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBub2RlSUQ6IHN0cmluZztcclxuICAgIGFjdGl2ZU5hbWU6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBpZDogc3RyaW5nID0gJycpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy51bmlxdWVJRCA9ICdbR10nICsgbmFtZS5yZXBsYWNlKC8gL2csICctJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZnJvbUpTT05TYWZlVGV4dChkZXNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW5JRHMgPSBbXTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlTmFtZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQpO1xyXG4gICAgICAgIHRoaXMubm9kZURlc2t0b3BDb3B5ID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQpO1xyXG4gICAgICAgIHRoaXMubm9kZUlEID0gaWQubGVuZ3RoID4gMCA/IGlkIDogdGhpcy51bmlxdWVJRDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzaW1pbGFyIHRvIGNhcmQudHMnIGNvbnN0cnVjdE5vZGVcclxuICAgIGNvbnN0cnVjdE5vZGUoaWQ6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQpO1xyXG4gICAgICAgIHRoaXMubm9kZURlc2t0b3BDb3B5ID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdE5vZGVJbnRlcm5hbChpZDogc3RyaW5nKXtcclxuICAgICAgICAvLyBjcmVhdGUgYmFzZSBub2RlXHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IG5hbWVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgbmFtZU5vZGUuaW5uZXJUZXh0ID0gYFtHXSAke3RoaXMubmFtZX1gO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uTm9kZS5pbm5lckhUTUwgPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQobmFtZU5vZGUpO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb25Ob2RlKTtcclxuXHJcbiAgICAgICAgbmFtZU5vZGUuY2xhc3NOYW1lID0gJ2NhcmQtZ3JvdXAtbmFtZSc7XHJcbiAgICAgICAgbmFtZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYoIXRoaXMuYWN0aXZlTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZih3aGljaExlZnRQYW5lQWN0aXZlKCkgPT09IExlZnRQYW5lVHlwZS5EZXNrdG9wKXtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW1Gcm9tRGVza3RvcCh0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW1Gcm9tU3RhY2sodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5hbWVOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5hY3RpdmVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmKHdoaWNoTGVmdFBhbmVBY3RpdmUoKSA9PT0gTGVmdFBhbmVUeXBlLkRlc2t0b3Ape1xyXG4gICAgICAgICAgICAgICAgYWRkSXRlbVRvRGVza3RvcCh0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkZEl0ZW1Ub1N0YWNrKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBjaGlsZHJlbiBsaXN0XHJcbiAgICAgICAgY29uc3Qgc3ViY2FyZE5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb25zdCBzdWJjYXJkSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDQnKTtcclxuICAgICAgICBjb25zdCBzdWJjYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgc3ViY2FyZENvbnRhaW5lci5jbGFzc05hbWUgPSAnY2FyZC1ncm91cC1zdWJjYXJkLWNvbnRhaW5lcic7XHJcbiAgICAgICAgc3ViY2FyZEhlYWRlci5pbm5lckhUTUwgPSAnQ2hpbGRyZW46J1xyXG4gICAgICAgIHN1YmNhcmRIZWFkZXIuY2xhc3NOYW1lID0gJ2NhcmQtZ3JvdXAtc3ViY2FyZC1oZWFkZXInO1xyXG4gICAgICAgIHN1YmNhcmROb2RlLmFwcGVuZENoaWxkKHN1YmNhcmRIZWFkZXIpO1xyXG4gICAgICAgIHN1YmNhcmROb2RlLmFwcGVuZENoaWxkKHN1YmNhcmRDb250YWluZXIpO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoc3ViY2FyZE5vZGUpO1xyXG5cclxuICAgICAgICBjb25zdCBjcmVhdGVTdWJjYXJkSXRlbSA9IChpOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3ViY2FyZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc3ViY2FyZEl0ZW0uaW5uZXJIVE1MID0gYC0gJHt0aGlzLmNoaWxkcmVuSURzW2ldfWA7XHJcbiAgICAgICAgICAgIHN1YmNhcmRJdGVtLmNsYXNzTmFtZSA9ICdjYXJkLWdyb3VwLXN1YmNhcmQtaXRlbSc7XHJcbiAgICAgICAgICAgIHJldHVybiBzdWJjYXJkSXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW5JRHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBzdWJjYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZVN1YmNhcmRJdGVtKGkpKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkIGJ1dHRvbnNcclxuICAgICAgICBjb25zdCBidXR0b25Sb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb25zdCBjb3B5SlNPTkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNvcHlKU09OQnV0dG9uLmlubmVyVGV4dCA9ICdDb3B5IEpTT04nO1xyXG4gICAgICAgIGNvcHlKU09OQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gY29weVRvQ2xpcGJvYXJkKHRoaXMudG9KU09OKCkpKTtcclxuICAgICAgICBidXR0b25Sb3cuYXBwZW5kQ2hpbGQoY29weUpTT05CdXR0b24pO1xyXG4gICAgICAgIGNvbnN0IGNvcHlVbmlxdWVJREJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNvcHlVbmlxdWVJREJ1dHRvbi5pbm5lckhUTUwgPSAnQ29weSBJRCc7XHJcbiAgICAgICAgY29weVVuaXF1ZUlEQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gY29weVRvQ2xpcGJvYXJkKHRoaXMudW5pcXVlSUQpKTtcclxuICAgICAgICBidXR0b25Sb3cuYXBwZW5kQ2hpbGQoY29weVVuaXF1ZUlEQnV0dG9uKVxyXG4gICAgICAgIGJ1dHRvblJvdy5jbGFzc05hbWUgPSAnY2FyZC1idXR0b24tcm93JztcclxuICAgICAgICBub2RlLmFwcGVuZENoaWxkKGJ1dHRvblJvdyk7XHJcblxyXG4gICAgICAgIC8vIGZpbmFsaXplIG5vZGUgY29uc3RydWN0aW9uXHJcbiAgICAgICAgbm9kZS5jbGFzc05hbWUgPSAnY2FyZC1ncm91cCc7XHJcbiAgICAgICAgaWYoaWQubGVuZ3RoID4gMCkgbm9kZS5pZCA9IGlkO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc2FibGVOYW1lQWRkaW5nKCl7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVOYW1lID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q2hpbGRyZW5JRHMoY2hpbGRyZW5JRHM6IHN0cmluZ1tdKXtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuSURzID0gY2hpbGRyZW5JRHMuc29ydCgpO1xyXG4gICAgICAgIHRoaXMuY29uc3RydWN0Tm9kZSh0aGlzLm5vZGVJRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCl7XHJcbiAgICAgICAgcmV0dXJuIGB7XHJcbiAgICBcIm5hbWVcIjogXCIke3RoaXMubmFtZX1cIixcclxuICAgIFwidW5pcXVlSURcIjogXCIke3RoaXMudW5pcXVlSUR9XCIsXHJcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiJHt0b0pTT05TYWZlVGV4dCh0aGlzLmRlc2NyaXB0aW9uKX1cIixcclxuICAgIFwiY2hpbGRyZW5JRHNcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmNoaWxkcmVuSURzKX1cclxufWA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGVza3RvcE5vZGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlRGVza3RvcENvcHk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBmcm9tSlNPTlNhZmVUZXh0IH0gZnJvbSBcIi4uL3V0aWwvanNvbi10ZXh0LWNvbnZlcnRlclwiO1xyXG5pbXBvcnQgeyBDYXJkIH0gZnJvbSBcIi4uL2NhcmRcIjtcclxuaW1wb3J0IHsgY29weVRvQ2xpcGJvYXJkLCBjb3B5RnJvbUNsaXBib2FyZCB9IGZyb20gXCIuLi91dGlsL2NsaXBib2FyZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRDYXJkQXV0aG9yaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgY2FyZE5hbWVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLW5hbWUtaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZERlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1kZXNjcmlwdGlvbi1pbnB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjYXJkRGVzY3JpcHRpb25PdXRwdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1kZXNjcmlwdGlvbi1vdXRwdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgY29uc3QgcHJldmlld0NhcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1wcmV2aWV3LWNvbnRhaW5lcicpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZENhdGVnb3J5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1jYXRlZ29yeS1pbnB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjYXJkU3ViY2FyZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtc3ViY2FyZC1pbnB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcblxyXG4gICAgLy8gbWV0YSB2YXJpYWJsZXMgd2hvc2Ugc3RhdGUgaXMgbm90IGNhcnJpZWQgaW4gaW5uZXJIVE1MXHJcbiAgICBsZXQgY3JlYXRpb25EYXRlID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0VXBkYXRlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjYXJkTmFtZUlucHV0LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY2FyZERlc2NyaXB0aW9uSW5wdXQudmFsdWU7XHJcbiAgICAgICAgY29uc3QgcHJldmlld0NhcmQgPSBuZXcgQ2FyZChuYW1lLCBkZXNjcmlwdGlvbiwgJ3ByZXZpZXctY2FyZCcpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkLnNldERhdGVzKGNyZWF0aW9uRGF0ZSwgbmV3IERhdGUoKSk7XHJcbiAgICAgICAgcHJldmlld0NhcmQuc2V0Q2F0ZWdvcmllcyhjYXJkQ2F0ZWdvcnlJbnB1dC52YWx1ZS5zcGxpdCgnLCcpLm1hcChuYW1lID0+IG5hbWUudHJpbSgpKS5maWx0ZXIobmFtZSA9PiBuYW1lLmxlbmd0aCA+IDApKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZC5zZXRTdWJjYXJkcyhjYXJkU3ViY2FyZElucHV0LnZhbHVlLnNwbGl0KCdcXG4nKS5tYXAobmFtZSA9PiBuYW1lLnRyaW0oKSkuZmlsdGVyKG5hbWUgPT4gbmFtZS5sZW5ndGggPiAwKSk7XHJcbiAgICAgICAgcHJldmlld0NhcmQuZGlzYWJsZU5hbWVBZGRpbmcoKTtcclxuICAgICAgICBjYXJkRGVzY3JpcHRpb25PdXRwdXQudmFsdWUgPSBwcmV2aWV3Q2FyZC50b0pTT04oKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJldmlld0NhcmROb2RlID0gcHJldmlld0NhcmQuZ2V0Tm9kZSgpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkQ29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaChub2RlID0+IG5vZGUucmVtb3ZlKCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZpZXdDYXJkTm9kZSk7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBpZiAod2luZG93Lk1hdGhKYXgpIE1hdGhKYXgudHlwZXNldChbcHJldmlld0NhcmROb2RlXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVzY3JpcHRpb25PdXRwdXRVcGRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0gSlNPTi5wYXJzZShjYXJkRGVzY3JpcHRpb25PdXRwdXQudmFsdWUpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNOYW1lID0gb2JqZWN0Lm5hbWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0Lm5hbWUgPT0gJ3N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0Rlc2NyaXB0aW9uID0gb2JqZWN0LmRlc2NyaXB0aW9uICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5kZXNjcmlwdGlvbiA9PSAnc3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3QgaGFzQ3JlYXRpb25EYXRlID0gb2JqZWN0LmNyZWF0aW9uRGF0ZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3QuY3JlYXRpb25EYXRlID09ICdzdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNDYXRlZ29yaWVzID0gb2JqZWN0LmNhdGVnb3JpZXMgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0LmNhdGVnb3JpZXMgPT0gJ29iamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc1N1YmNhcmRzID0gb2JqZWN0LnN1YmNhcmRzICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5zdWJjYXJkcyA9PSAnb2JqZWN0JztcclxuXHJcbiAgICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICAgICAgaGFzTmFtZSAmJiBoYXNEZXNjcmlwdGlvbiAmJiBoYXNDcmVhdGlvbkRhdGUgJiZcclxuICAgICAgICAgICAgICAgIGhhc0NhdGVnb3JpZXMgJiYgaGFzU3ViY2FyZHNcclxuICAgICAgICAgICAgKXtcclxuICAgICAgICAgICAgICAgIGNhcmROYW1lSW5wdXQudmFsdWUgPSBvYmplY3QubmFtZTtcclxuICAgICAgICAgICAgICAgIGNhcmREZXNjcmlwdGlvbklucHV0LnZhbHVlID0gZnJvbUpTT05TYWZlVGV4dChvYmplY3QuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3JlYXRpb25EYXRlID0gbmV3IERhdGUob2JqZWN0LmNyZWF0aW9uRGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FyZENhdGVnb3J5SW5wdXQudmFsdWUgPSBvYmplY3QuY2F0ZWdvcmllcy5qb2luKCcsICcpO1xyXG4gICAgICAgICAgICAgICAgY2FyZFN1YmNhcmRJbnB1dC52YWx1ZSA9IG9iamVjdC5zdWJjYXJkcy5qb2luKCdcXG4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBjYXJkTmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcbiAgICBjYXJkRGVzY3JpcHRpb25JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUpO1xyXG4gICAgY2FyZERlc2NyaXB0aW9uT3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25PdXRwdXRVcGRhdGUpO1xyXG4gICAgY2FyZENhdGVnb3J5SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuICAgIGNhcmRTdWJjYXJkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuXHJcbiAgICBjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtYXV0aG9yaW5nLWNvcHktYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBwYXN0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWF1dGhvcmluZy1wYXN0ZS1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtYXV0aG9yaW5nLWNsZWFyLWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgXHJcbiAgICBjb3B5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvcHlUb0NsaXBib2FyZChjYXJkRGVzY3JpcHRpb25PdXRwdXQudmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgICBwYXN0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb3B5RnJvbUNsaXBib2FyZCgpLnRoZW4odGV4dCA9PiB7XHJcbiAgICAgICAgICAgIGNhcmREZXNjcmlwdGlvbk91dHB1dC52YWx1ZSA9IHRleHQ7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgY2xlYXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY2FyZE5hbWVJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGNhcmREZXNjcmlwdGlvbklucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgY3JlYXRpb25EYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjYXJkQ2F0ZWdvcnlJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGNhcmRTdWJjYXJkSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgZnJvbUpTT05TYWZlVGV4dCB9IGZyb20gXCIuLi91dGlsL2pzb24tdGV4dC1jb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCI7XHJcbmltcG9ydCB7IENhcmRHcm91cCB9IGZyb20gXCIuLi9jYXJkZ3JvdXBcIjtcclxuaW1wb3J0IHsgY29weVRvQ2xpcGJvYXJkLCBjb3B5RnJvbUNsaXBib2FyZCB9IGZyb20gXCIuLi91dGlsL2NsaXBib2FyZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRDYXJkR3JvdXBBdXRob3JpbmcgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJkR3JvdXBOYW1lSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1ncm91cC1uYW1lLWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IGNhcmRHcm91cERlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1ncm91cC1kZXNjcmlwdGlvbi1pbnB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjYXJkR3JvdXBEZXNjcmlwdGlvbk91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWdyb3VwLWRlc2NyaXB0aW9uLW91dHB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICBjb25zdCBwcmV2aWV3Q2FyZEdyb3VwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtcHJldmlldy1jb250YWluZXInKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGNhcmRHcm91cENoaWxkcmVuSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1ncm91cC1jYXRlZ29yeS1pbnB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcblxyXG4gICAgLy8gbWV0YSB2YXJpYWJsZXMgd2hvc2Ugc3RhdGUgaXMgbm90IGNhcnJpZWQgaW4gaW5uZXJIVE1MXHJcbiAgICBsZXQgY3JlYXRpb25EYXRlPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmRHcm91cE5hbWVJbnB1dC52YWx1ZTtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNhcmRHcm91cERlc2NyaXB0aW9uSW5wdXQudmFsdWU7XHJcbiAgICAgICAgY29uc3QgcHJldmlld0NhcmRHcm91cCA9IG5ldyBDYXJkR3JvdXAobmFtZSwgZGVzY3JpcHRpb24sICdwcmV2aWV3LWNhcmQnKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZEdyb3VwLnNldENoaWxkcmVuSURzKGNhcmRHcm91cENoaWxkcmVuSW5wdXQudmFsdWUuc3BsaXQoJ1xcbicpLm1hcChuYW1lID0+IG5hbWUudHJpbSgpKS5maWx0ZXIobmFtZSA9PiBuYW1lLmxlbmd0aCA+IDApKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZEdyb3VwLmRpc2FibGVOYW1lQWRkaW5nKCk7XHJcbiAgICAgICAgY2FyZEdyb3VwRGVzY3JpcHRpb25PdXRwdXQudmFsdWUgPSBwcmV2aWV3Q2FyZEdyb3VwLnRvSlNPTigpO1xyXG5cclxuICAgICAgICBjb25zdCBwcmV2aWV3Q2FyZEdyb3VwTm9kZSA9IHByZXZpZXdDYXJkR3JvdXAuZ2V0Tm9kZSgpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkR3JvdXBDb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5yZW1vdmUoKSk7XHJcbiAgICAgICAgcHJldmlld0NhcmRHcm91cENvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2aWV3Q2FyZEdyb3VwTm9kZSk7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBpZiAod2luZG93Lk1hdGhKYXgpIE1hdGhKYXgudHlwZXNldChbcHJldmlld0NhcmRHcm91cE5vZGVdKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbk91dHB1dFVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3QgPSBKU09OLnBhcnNlKGNhcmRHcm91cERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlKTtcclxuICAgICAgICAgICAgY29uc3QgaGFzTmFtZSA9IG9iamVjdC5uYW1lICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5uYW1lID09ICdzdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNEZXNjcmlwdGlvbiA9IG9iamVjdC5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3QuZGVzY3JpcHRpb24gPT0gJ3N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0NoaWxkcmVuSURzID0gb2JqZWN0LmNoaWxkcmVuSURzICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5jaGlsZHJlbklEcyA9PSAnb2JqZWN0JztcclxuXHJcbiAgICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICAgICAgaGFzTmFtZSAmJiBoYXNEZXNjcmlwdGlvbiAmJiBoYXNDaGlsZHJlbklEc1xyXG4gICAgICAgICAgICApe1xyXG4gICAgICAgICAgICAgICAgY2FyZEdyb3VwTmFtZUlucHV0LnZhbHVlID0gb2JqZWN0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBjYXJkR3JvdXBEZXNjcmlwdGlvbklucHV0LnZhbHVlID0gZnJvbUpTT05TYWZlVGV4dChvYmplY3QuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgY2FyZEdyb3VwQ2hpbGRyZW5JbnB1dC52YWx1ZSA9IG9iamVjdC5jaGlsZHJlbklEcy5qb2luKCdcXG4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBjYXJkR3JvdXBOYW1lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuICAgIGNhcmRHcm91cERlc2NyaXB0aW9uSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuICAgIGNhcmRHcm91cERlc2NyaXB0aW9uT3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25PdXRwdXRVcGRhdGUpO1xyXG4gICAgY2FyZEdyb3VwQ2hpbGRyZW5JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUpO1xyXG5cclxuICAgIGNvbnN0IGNvcHlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1ncm91cC1hdXRob3JpbmctY29weS1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHBhc3RlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtYXV0aG9yaW5nLXBhc3RlLWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgY2xlYXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1ncm91cC1hdXRob3JpbmctY2xlYXItYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBcclxuICAgIGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY29weVRvQ2xpcGJvYXJkKGNhcmRHcm91cERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlKTtcclxuICAgIH0pO1xyXG4gICAgcGFzdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY29weUZyb21DbGlwYm9hcmQoKS50aGVuKHRleHQgPT4ge1xyXG4gICAgICAgICAgICBjYXJkR3JvdXBEZXNjcmlwdGlvbk91dHB1dC52YWx1ZSA9IHRleHQ7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgY2xlYXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY2FyZEdyb3VwTmFtZUlucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgY2FyZEdyb3VwRGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGNhcmRHcm91cENoaWxkcmVuSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbn0iLCJpbXBvcnQgeyBkb3dubG9hZEZpbGUgfSBmcm9tIFwiLi4vdXRpbC9kb3dubG9hZFwiO1xyXG5pbXBvcnQgeyBDYXJkIH0gZnJvbSBcIi4uL2NhcmRcIjtcclxuaW1wb3J0IHsgQ2FyZEdyb3VwIH0gZnJvbSBcIi4uL2NhcmRncm91cFwiO1xyXG5pbXBvcnQgeyBnZXRISE1NLCBnZXRNTUREWVlZWSB9IGZyb20gXCIuLi91dGlsL2RhdGVcIjtcclxuXHJcbmxldCBzZWxlY3RlZFNsb3Q6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbmxldCBzbG90Tm9kZXMgOiBIVE1MRGl2RWxlbWVudFtdID0gW107XHJcbmxldCBjb2x1bW5zID0gMjtcclxubGV0IHNsb3RzID0gNTA7XHJcblxyXG5leHBvcnQgdHlwZSBEZXNrdG9wRXhwb3J0SlNPTiA9IHtcclxuICAgIGNvbHVtbnM6IG51bWJlcixcclxuICAgIHNsb3RzOiBudW1iZXIsXHJcbiAgICBkYXRhOiAoc3RyaW5nIHwgbnVsbClbXVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXREZXNrdG9wID0gKGNhcmRzOiBDYXJkW10sIGNhcmRHcm91cHM6IENhcmRHcm91cFtdKSA9PiB7XHJcbiAgICBjb25zdCBkZXNrdG9wU3VyZmFjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNrdG9wLWNvbnRhaW5lcicpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgY29uc3QgY29tYmluZWRJdGVtczogKENhcmQgfCBDYXJkR3JvdXApW10gPSBbLi4uY2FyZHMsIC4uLmNhcmRHcm91cHNdO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBpbnRlcmFjdGl2ZSBzdXJmYWNlXHJcbiAgICBjb25zdCBjbGlja09uU2xvdCA9IChzbG90OiBIVE1MRGl2RWxlbWVudCkgPT4ge1xyXG4gICAgICAgIC8vIGRlYWN0aXZhdGUgc2xvdCBpZiBjYXJkL2NhcmRncm91cCBpcyBhbHJlYWR5IGluc2lkZSBzbG90XHJcbiAgICAgICAgaWYoc2xvdC5jaGlsZHJlbi5sZW5ndGggPiAwKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBib3JkZXIgc2VsZWN0aW9uIHZpc3VhbFxyXG4gICAgICAgIHNsb3ROb2Rlcy5mb3JFYWNoKHNsb3QgPT4ge1xyXG4gICAgICAgICAgICBzbG90LnN0eWxlLmJvcmRlciA9ICcxcHggbGlnaHRncmF5JztcclxuICAgICAgICAgICAgc2xvdC5zdHlsZS5ib3JkZXJTdHlsZSA9ICdkYXNoZWQnO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZihzZWxlY3RlZFNsb3QgIT09IHNsb3Qpe1xyXG4gICAgICAgICAgICBzZWxlY3RlZFNsb3QgPSBzbG90O1xyXG4gICAgICAgICAgICBzZWxlY3RlZFNsb3Quc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCBibGFjayc7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkU2xvdC5zdHlsZS5ib3JkZXJTdHlsZSA9ICdzb2xpZCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRTbG90ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBkeW5hbWljIGN1cnNvciBvdmVyXHJcbiAgICAgICAgc2xvdE5vZGVzLmZvckVhY2goc2xvdCA9PiB7XHJcbiAgICAgICAgICAgIGlmKHNsb3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgICAgIHNsb3Quc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2xvdC5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb25zdHJ1Y3RTdXJmYWNlID0gKHNsb3RzVG9Mb2FkPzogKHN0cmluZyB8IG51bGwpW10pID0+IHtcclxuICAgICAgICBkZXNrdG9wU3VyZmFjZS5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICBzbG90Tm9kZXMgPSBbXTtcclxuICAgICAgICBsZXQgY291bnRlciA9IDA7XHJcbiAgICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IHNsb3RzOyB4Kyspe1xyXG4gICAgICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgcm93LmNsYXNzTmFtZSA9IGBkZXNrdG9wLXJvd2A7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IHkgPSAwOyB5IDwgY29sdW1uczsgeSsrKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNsb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIHNsb3QuY2xhc3NOYW1lID0gYGRlc2t0b3Atc2xvdCR7eSAhPT0gMCA/ICcgZGVza3RvcC1tYXJnaW4tbGVmdCcgOiAnJ31gO1xyXG5cclxuICAgICAgICAgICAgICAgIHNsb3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tPblNsb3Qoc2xvdCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByb3cuYXBwZW5kKHNsb3QpO1xyXG4gICAgICAgICAgICAgICAgc2xvdE5vZGVzLnB1c2goc2xvdCk7XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRlc2t0b3BTdXJmYWNlLmFwcGVuZChyb3cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgbG9hZGluZyBpbiBzbG90cyBmcm9tIGpzb24gaW1wb3J0XHJcbiAgICAgICAgaWYoIXNsb3RzVG9Mb2FkKSByZXR1cm47XHJcbiAgICAgICAgY291bnRlciA9IDA7XHJcbiAgICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IHNsb3RzOyB4Kyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHkgPSAwOyB5IDwgY29sdW1uczsgeSsrKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRlZElEID0gc2xvdHNUb0xvYWRbY291bnRlcl07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2xvdCA9IHNsb3ROb2Rlc1tjb3VudGVyXTtcclxuICAgICAgICAgICAgICAgIGlmKGxvYWRlZElEICE9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gY29tYmluZWRJdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS51bmlxdWVJRCA9PT0gbG9hZGVkSUQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0gIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkU2xvdCA9IGN1cnJlbnRTbG90O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRJdGVtVG9EZXNrdG9wKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxlY3RlZFNsb3QgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0U3VyZmFjZSgpO1xyXG5cclxuICAgIC8vIGhhbmRsZSB0b3AgYmFyIGJ1dHRvbnNcclxuICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2t0b3AtY2xlYXItYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBpbXBvcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVza3RvcC1pbXBvcnQtYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBpbXBvcnRGaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVza3RvcC1pbXBvcnQtZmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBjb25zdCBleHBvcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVza3RvcC1leHBvcnQtYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgY2xlYXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgc2xvdE5vZGVzLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyID0gJzFweCBsaWdodGdyYXknO1xyXG4gICAgICAgICAgICBub2RlLnN0eWxlLmJvcmRlclN0eWxlID0gJ2Rhc2hlZCc7XHJcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNlbGVjdGVkU2xvdCA9IG51bGw7XHJcbiAgICAgICAgc2F2ZURlc2t0b3AoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGltcG9ydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGltcG9ydEZpbGVJbnB1dC5jbGljaygpKTtcclxuICAgIGltcG9ydEZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlsZXM6IEZpbGVMaXN0IHwgbnVsbCA9IGltcG9ydEZpbGVJbnB1dC5maWxlcztcclxuICAgICAgICBpZighZmlsZXMpIHJldHVybjtcclxuICAgICAgICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IGZpbGVzWzBdLnRleHQoKTtcclxuICAgICAgICBjb25zdCBpbXBvcnREYXRhIDogRGVza3RvcEV4cG9ydEpTT04gPSBKU09OLnBhcnNlKGZpbGVEYXRhKTtcclxuICAgICAgICBjb2x1bW5zID0gaW1wb3J0RGF0YS5jb2x1bW5zO1xyXG4gICAgICAgIHNsb3RzID0gaW1wb3J0RGF0YS5zbG90cztcclxuICAgICAgICBjb25zdHJ1Y3RTdXJmYWNlKGltcG9ydERhdGEuZGF0YSk7XHJcbiAgICAgICAgaW1wb3J0RmlsZUlucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgc2F2ZURlc2t0b3AoKTtcclxuICAgIH0pO1xyXG4gICAgZXhwb3J0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV4cG9ydERhdGEgOiBEZXNrdG9wRXhwb3J0SlNPTiA9IHtcclxuICAgICAgICAgICAgY29sdW1uczogY29sdW1ucyxcclxuICAgICAgICAgICAgc2xvdHM6IHNsb3RzLFxyXG4gICAgICAgICAgICBkYXRhOiBzbG90Tm9kZXMubWFwKHNsb3QgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoc2xvdC5jaGlsZHJlbi5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2xvdC5jaGlsZHJlblswXS5pZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRvd25sb2FkRmlsZShgZGVza3RvcC0ke2dldEhITU0oKX0tJHtnZXRNTUREWVlZWSgpfS5qc29uYCwgSlNPTi5zdHJpbmdpZnkoZXhwb3J0RGF0YSwgbnVsbCwgNCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gbG9jYWwgc3RvcmFnZSBsb2FkaW5nLi4uXHJcbiAgICBjb25zdCBpbXBvcnREYXRhSlNPTiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZGVza3RvcC1kYXRhXCIpO1xyXG4gICAgaWYoaW1wb3J0RGF0YUpTT04gIT09IG51bGwpe1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydERhdGE6IERlc2t0b3BFeHBvcnRKU09OID0gSlNPTi5wYXJzZShpbXBvcnREYXRhSlNPTik7XHJcbiAgICAgICAgICAgIGNvbHVtbnMgPSBpbXBvcnREYXRhLmNvbHVtbnM7XHJcbiAgICAgICAgICAgIHNsb3RzID0gaW1wb3J0RGF0YS5zbG90cztcclxuICAgICAgICAgICAgY29uc3RydWN0U3VyZmFjZShpbXBvcnREYXRhLmRhdGEpO1xyXG4gICAgICAgIH0gY2F0Y2goZSl7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gbG9jYWwgc3RvcmFnZSBkZXNrdG9wIHNhdmluZy4uLlxyXG5leHBvcnQgY29uc3Qgc2F2ZURlc2t0b3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBkYXRhIDogRGVza3RvcEV4cG9ydEpTT04gPSB7XHJcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcclxuICAgICAgICBzbG90czogc2xvdHMsXHJcbiAgICAgICAgZGF0YTogc2xvdE5vZGVzLm1hcChzbG90ID0+IHtcclxuICAgICAgICAgICAgaWYoc2xvdC5jaGlsZHJlbi5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2xvdC5jaGlsZHJlblswXS5pZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9O1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkZXNrdG9wLWRhdGFcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkSXRlbVRvRGVza3RvcCA9IChpdGVtIDogQ2FyZCB8IENhcmRHcm91cCkgPT4ge1xyXG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBpdGVtLmdldERlc2t0b3BOb2RlKCk7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBpZiAod2luZG93Lk1hdGhKYXgpIE1hdGhKYXgudHlwZXNldChbY3VycmVudE5vZGVdKTtcclxuICAgIGlmKCFzZWxlY3RlZFNsb3QpIHJldHVybjtcclxuICAgIGlmKHNlbGVjdGVkU2xvdC5jaGlsZHJlbi5sZW5ndGggPiAwKSByZXR1cm47IC8vIGRvbid0IHJlcGxhY2UgYSBjYXJkIHRoYXQncyBhbHJlYWR5IGluIHRoZXJlXHJcbiAgICBzZWxlY3RlZFNsb3QuYXBwZW5kQ2hpbGQoY3VycmVudE5vZGUpO1xyXG5cclxuICAgIHNlbGVjdGVkU2xvdC5zdHlsZS5ib3JkZXIgPSAnMXB4IGxpZ2h0Z3JheSc7XHJcbiAgICBzZWxlY3RlZFNsb3Quc3R5bGUuYm9yZGVyU3R5bGUgPSAnZGFzaGVkJztcclxuICAgIHNlbGVjdGVkU2xvdC5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XHJcbiAgICBzZWxlY3RlZFNsb3QgPSBudWxsO1xyXG5cclxuICAgIHNhdmVEZXNrdG9wKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVJdGVtRnJvbURlc2t0b3AgPSAoaXRlbSA6IENhcmQgfCBDYXJkR3JvdXApID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gaXRlbS5nZXREZXNrdG9wTm9kZSgpO1xyXG4gICAgY3VycmVudE5vZGUucmVtb3ZlKCk7XHJcbiAgICBzYXZlRGVza3RvcCgpO1xyXG59IiwiaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCI7XHJcbmltcG9ydCB7IENhcmRHcm91cCB9IGZyb20gXCIuLi9jYXJkZ3JvdXBcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvRGVza3RvcCB9IGZyb20gXCIuL2Rlc2t0b3BcIjtcclxuaW1wb3J0IHsgd2hpY2hMZWZ0UGFuZUFjdGl2ZSwgTGVmdFBhbmVUeXBlIH0gZnJvbSBcIi4vcGFuZS1tYW5hZ2VtZW50XCI7XHJcbmltcG9ydCB7IGFkZEl0ZW1Ub1N0YWNrIH0gZnJvbSBcIi4vc2VhcmNoLXN0YWNrXCI7XHJcblxyXG5leHBvcnQgdHlwZSBIaWVyYXJjaHlJbnRlcm5hbEl0ZW0gPSB7XHJcbiAgICB1bmlxdWVJRDogc3RyaW5nLFxyXG4gICAgZGVwdGg6IG51bWJlcixcclxuICAgIGVtcHR5Q2hpbGQ6IEhUTUxFbGVtZW50XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbml0SGllcmFyY2h5ID0gKGNhcmRzOiBDYXJkW10sIGNhcmRHcm91cHM6IENhcmRHcm91cFtdKSA9PiB7XHJcbiAgICBjb25zdCBoaWVyYXJjaHlSb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpZXJhcmNoeS1yb290JykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoaWVyYXJjaHktZW1wdHknKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJvb3RHcm91cHMgPSBjYXJkR3JvdXBzLmZpbHRlcihncm91cCA9PiBjYXJkR3JvdXBzLmV2ZXJ5KG90aGVyR3JvdXAgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRoaXNJRCA9IGdyb3VwLnVuaXF1ZUlEO1xyXG4gICAgICAgIGlmKHRoaXNJRCA9PT0gb3RoZXJHcm91cC51bmlxdWVJRCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gb3RoZXJHcm91cC5jaGlsZHJlbklEcy5ldmVyeShjaGlsZElEID0+IGNoaWxkSUQgIT09IHRoaXNJRCk7XHJcbiAgICB9KSk7XHJcbiAgICBjb25zdCByb290Q2FyZHMgPSBjYXJkcy5maWx0ZXIoY2FyZCA9PiBcclxuICAgICAgICBjYXJkR3JvdXBzLmV2ZXJ5KGdyb3VwID0+IFxyXG4gICAgICAgICAgICBncm91cC5jaGlsZHJlbklEcy5ldmVyeShjaGlsZElEID0+IGNhcmQudW5pcXVlSUQgIT0gY2hpbGRJRCkpKTtcclxuICAgIGNvbnN0IGNvbWJpbmVkSXRlbXM6IChDYXJkIHwgQ2FyZEdyb3VwKVtdID0gWy4uLmNhcmRzLCAuLi5jYXJkR3JvdXBzXTtcclxuICAgIGNvbnN0IGhpZXJhcmNoeU1hbmFnZXIgPSBuZXcgTWFwPHN0cmluZywgSGllcmFyY2h5SW50ZXJuYWxJdGVtPigpO1xyXG5cclxuICAgIGNvbnN0IGNyZWF0ZUhpZXJhcmNoeUl0ZW0gPSAoaWQ6IHN0cmluZywgaW5zZXJ0QWZ0ZXI6IEhUTUxFbGVtZW50LCBkZXB0aDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29ycmVzcG9uZGluZ0l0ZW0gPSBjb21iaW5lZEl0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLnVuaXF1ZUlEID09PSBpZCk7XHJcbiAgICAgICAgY29uc3QgaXNDYXJkR3JvdXAgPSBjb3JyZXNwb25kaW5nSXRlbSBpbnN0YW5jZW9mIENhcmRHcm91cDtcclxuICAgICAgICBjb25zdCBpdGVtQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1DaGlsZHJlbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1FbXB0eUNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgaXRlbUNvbnRhaW5lci5jbGFzc05hbWUgPSAnaGllcmFyY2h5LWl0ZW0tY29udGFpbmVyJztcclxuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9ICdoaWVyYXJjaHktaXRlbSc7XHJcbiAgICAgICAgaXRlbUNoaWxkcmVuQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdoaWVyYXJjaHktaXRlbS1jaGlsZC1jb250YWluZXInO1xyXG5cclxuICAgICAgICBjb25zdCBsZWZ0UGFkZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGxlZnRQYWRkaW5nLmlubmVySFRNTCA9ICcmbmJzcDsnLnJlcGVhdChkZXB0aCAqIDMpO1xyXG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gaXNDYXJkR3JvdXAgPyBgPGI+JHtpZH08L2I+YCA6IGAke2lkfWA7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gJ2hpZXJhcmNoeS1sYWJlbCc7XHJcbiAgICAgICAgY29uc3QgdG9nZ2xlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgdG9nZ2xlQnV0dG9uLmNsYXNzTmFtZSA9ICdoaWVyYXJjaHktdG9nZ2xlLWJ1dHRvbic7XHJcbiAgICAgICAgdG9nZ2xlQnV0dG9uLmlubmVySFRNTCA9ICcrJztcclxuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGxlZnRQYWRkaW5nKTtcclxuXHJcbiAgICAgICAgaWYoaXNDYXJkR3JvdXApIHtcclxuICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZCh0b2dnbGVCdXR0b24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhcmRTcGFjZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY2FyZFNwYWNlci5pbm5lckhUTUwgPSAnLSZuYnNwOyc7XHJcbiAgICAgICAgICAgIGNhcmRTcGFjZXIuY2xhc3NOYW1lID0gJ2hpZXJhcmNoeS1ub24tdG9nZ2xlLXNwYWNlcidcclxuICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChjYXJkU3BhY2VyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgIGl0ZW1Db250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgaXRlbUNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtQ2hpbGRyZW5Db250YWluZXIpO1xyXG4gICAgICAgIGl0ZW1DaGlsZHJlbkNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtRW1wdHlDaGlsZCk7XHJcbiAgICAgICAgaW5zZXJ0QWZ0ZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJlbmRcIiwgaXRlbUNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGxldCBhZGRlZENoaWxkcmVuOiBIVE1MRGl2RWxlbWVudFtdID0gW107XHJcbiAgICAgICAgdG9nZ2xlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0b2dnbGVCdXR0b24uaW5uZXJIVE1MID09PSBcIitcIil7IC8vIGV4cGFuZFxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlQnV0dG9uLmlubmVySFRNTCA9IFwiLVwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0R3JvdXAgPSBjYXJkR3JvdXBzLmZpbmQoZ3JvdXAgPT4gZ3JvdXAudW5pcXVlSUQgPT09IGlkKSBhcyBDYXJkR3JvdXA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbklEcyA9IHRhcmdldEdyb3VwLmNoaWxkcmVuSURzO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwcmV2SXRlbSA9IGl0ZW1FbXB0eUNoaWxkO1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5JRHMuZm9yRWFjaChpZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3SXRlbSA9IGNyZWF0ZUhpZXJhcmNoeUl0ZW0oaWQsIHByZXZJdGVtLCBkZXB0aCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkQ2hpbGRyZW4ucHVzaChuZXdJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2SXRlbSA9IG5ld0l0ZW07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxzZSB7IC8vIGNsb3NlXHJcbiAgICAgICAgICAgICAgICB0b2dnbGVCdXR0b24uaW5uZXJIVE1MID0gXCIrXCI7XHJcbiAgICAgICAgICAgICAgICBhZGRlZENoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY2hpbGQucmVtb3ZlKCkpO1xyXG4gICAgICAgICAgICAgICAgYWRkZWRDaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY29uc3QgaW50ZXJuYWxJdGVtIDogSGllcmFyY2h5SW50ZXJuYWxJdGVtID0ge1xyXG4gICAgICAgICAgICB1bmlxdWVJRDogaWQsXHJcbiAgICAgICAgICAgIGRlcHRoOiBkZXB0aCxcclxuICAgICAgICAgICAgZW1wdHlDaGlsZDogaXRlbUVtcHR5Q2hpbGRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGhpZXJhcmNoeU1hbmFnZXIuc2V0KGlkLCBpbnRlcm5hbEl0ZW0pO1xyXG5cclxuICAgICAgICBsYWJlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYoIWNvcnJlc3BvbmRpbmdJdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmKHdoaWNoTGVmdFBhbmVBY3RpdmUoKSA9PT0gTGVmdFBhbmVUeXBlLkRlc2t0b3Ape1xyXG4gICAgICAgICAgICAgICAgYWRkSXRlbVRvRGVza3RvcChjb3JyZXNwb25kaW5nSXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhZGRJdGVtVG9TdGFjayhjb3JyZXNwb25kaW5nSXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1Db250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHByZXZJdGVtID0gZW1wdHk7XHJcbiAgICByb290R3JvdXBzLmZvckVhY2gocm9vdEdyb3VwID0+IHtcclxuICAgICAgICBjb25zdCBuZXdJdGVtID0gY3JlYXRlSGllcmFyY2h5SXRlbShyb290R3JvdXAudW5pcXVlSUQsIHByZXZJdGVtLCAwKVxyXG4gICAgICAgIHByZXZJdGVtID0gbmV3SXRlbTtcclxuICAgIH0pXHJcbn0iLCJleHBvcnQgZW51bSBMZWZ0UGFuZVR5cGUge1xyXG4gICAgRGVza3RvcCxcclxuICAgIFNlYXJjaFN0YWNrXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFJpZ2h0UGFuZVR5cGUge1xyXG4gICAgQ3JlYXRlQ2FyZCxcclxuICAgIENyZWF0ZUNhcmRHcm91cCxcclxuICAgIFNlYXJjaCxcclxuICAgIE1ldGFkYXRhLFxyXG4gICAgSGllcmFyY2h5XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbml0UGFuZU1hbmFnZW1lbnQgPSAoZGVmYXVsdExlZnQ6IExlZnRQYW5lVHlwZSA9IExlZnRQYW5lVHlwZS5TZWFyY2hTdGFjaywgZGVmYXVsdFJpZ2h0OiBSaWdodFBhbmVUeXBlID0gUmlnaHRQYW5lVHlwZS5DcmVhdGVDYXJkR3JvdXApID0+IHtcclxuICAgIGNvbnN0IGxlZnRQYW5lRGVza3RvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1wYW5lLWRlc2t0b3BcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBsZWZ0UGFuZVNlYXJjaFN0YWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtc2VhcmNoLXN0YWNrXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQ3JlYXRlQ2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1jcmVhdGUtY2FyZFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUNyZWF0ZUNhcmRHcm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1jcmVhdGUtY2FyZC1ncm91cFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZVNlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1zZWFyY2hcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCByaWdodFBhbmVNZXRhZGF0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1tZXRhZGF0YVwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUhpZXJhcmNoeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1oaWVyYXJjaHlcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBcclxuICAgIGNvbnN0IGxlZnRQYW5lQnV0dG9uRGVza3RvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1wYW5lLWJ1dHRvbi1kZXNrdG9wXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgbGVmdFBhbmVCdXR0b25TZWFyY2hTdGFjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1wYW5lLWJ1dHRvbi1zZWFyY2gtc3RhY2tcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCByaWdodFBhbmVCdXR0b25DcmVhdGVDYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWJ1dHRvbi1jcmVhdGUtY2FyZFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvbkNyZWF0ZUNhcmRHcm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1idXR0b24tY3JlYXRlLWNhcmQtZ3JvdXBcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCByaWdodFBhbmVCdXR0b25TZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LXBhbmUtYnV0dG9uLXNlYXJjaFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvbk1ldGFkYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWJ1dHRvbi1tZXRhZGF0YVwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvbkhpZXJhcmNoeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1idXR0b24taGllcmFyY2h5XCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgXHJcbiAgICBjb25zdCBsZWZ0UGFuZU5vZGVFbnVtUGFpcnM6IFtIVE1MRGl2RWxlbWVudCwgTGVmdFBhbmVUeXBlXVtdID0gW1xyXG4gICAgICAgIFtsZWZ0UGFuZURlc2t0b3AsIExlZnRQYW5lVHlwZS5EZXNrdG9wXSxcclxuICAgICAgICBbbGVmdFBhbmVTZWFyY2hTdGFjaywgTGVmdFBhbmVUeXBlLlNlYXJjaFN0YWNrXVxyXG4gICAgXTtcclxuICAgIGNvbnN0IGxlZnRQYW5lQ2xpY2tlZCA9IChzZWxlY3RlZFBhbmU6IExlZnRQYW5lVHlwZSkgPT4ge1xyXG4gICAgICAgIGxlZnRQYW5lTm9kZUVudW1QYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xyXG4gICAgICAgICAgICBpZihwYWlyWzFdID09PSBzZWxlY3RlZFBhbmUpIHBhaXJbMF0uc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgZWxzZSBwYWlyWzBdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCByaWdodFBhbmVOb2RlRW51bVBhaXJzOiBbSFRNTERpdkVsZW1lbnQsIFJpZ2h0UGFuZVR5cGVdW10gPSBbXHJcbiAgICAgICAgW3JpZ2h0UGFuZUNyZWF0ZUNhcmQsIFJpZ2h0UGFuZVR5cGUuQ3JlYXRlQ2FyZF0sXHJcbiAgICAgICAgW3JpZ2h0UGFuZUNyZWF0ZUNhcmRHcm91cCwgUmlnaHRQYW5lVHlwZS5DcmVhdGVDYXJkR3JvdXBdLFxyXG4gICAgICAgIFtyaWdodFBhbmVTZWFyY2gsIFJpZ2h0UGFuZVR5cGUuU2VhcmNoXSxcclxuICAgICAgICBbcmlnaHRQYW5lTWV0YWRhdGEsIFJpZ2h0UGFuZVR5cGUuTWV0YWRhdGFdLFxyXG4gICAgICAgIFtyaWdodFBhbmVIaWVyYXJjaHksIFJpZ2h0UGFuZVR5cGUuSGllcmFyY2h5XSxcclxuICAgIF07XHJcbiAgICBjb25zdCByaWdodFBhbmVDbGlja2VkID0gKHNlbGVjdGVkUGFuZTogUmlnaHRQYW5lVHlwZSkgPT4ge1xyXG4gICAgICAgIHJpZ2h0UGFuZU5vZGVFbnVtUGFpcnMuZm9yRWFjaChwYWlyID0+IHtcclxuICAgICAgICAgICAgaWYocGFpclsxXSA9PT0gc2VsZWN0ZWRQYW5lKSBwYWlyWzBdLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgICAgIGVsc2UgcGFpclswXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBsZWZ0UGFuZUJ1dHRvbkRlc2t0b3AuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBsZWZ0UGFuZUNsaWNrZWQoTGVmdFBhbmVUeXBlLkRlc2t0b3ApKTtcclxuICAgIGxlZnRQYW5lQnV0dG9uU2VhcmNoU3RhY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBsZWZ0UGFuZUNsaWNrZWQoTGVmdFBhbmVUeXBlLlNlYXJjaFN0YWNrKSk7XHJcbiAgICByaWdodFBhbmVCdXR0b25DcmVhdGVDYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gcmlnaHRQYW5lQ2xpY2tlZChSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmQpKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvbkNyZWF0ZUNhcmRHcm91cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJpZ2h0UGFuZUNsaWNrZWQoUmlnaHRQYW5lVHlwZS5DcmVhdGVDYXJkR3JvdXApKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvblNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJpZ2h0UGFuZUNsaWNrZWQoUmlnaHRQYW5lVHlwZS5TZWFyY2gpKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvbk1ldGFkYXRhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gcmlnaHRQYW5lQ2xpY2tlZChSaWdodFBhbmVUeXBlLk1ldGFkYXRhKSk7XHJcbiAgICByaWdodFBhbmVCdXR0b25IaWVyYXJjaHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByaWdodFBhbmVDbGlja2VkKFJpZ2h0UGFuZVR5cGUuSGllcmFyY2h5KSk7XHJcblxyXG4gICAgLy8gZmluYWxpemUgcGFuZSBtYW5hZ2VtZW50IGFuZCBkaXNhYmxlIHNlbGVjdCBidXR0b25zXHJcbiAgICBsZWZ0UGFuZUNsaWNrZWQoZGVmYXVsdExlZnQpO1xyXG4gICAgcmlnaHRQYW5lQ2xpY2tlZChkZWZhdWx0UmlnaHQpO1xyXG4gICAgcmlnaHRQYW5lQnV0dG9uTWV0YWRhdGEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHdoaWNoTGVmdFBhbmVBY3RpdmUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBsZWZ0UGFuZURlc2t0b3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnQtcGFuZS1kZXNrdG9wXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgbGVmdFBhbmVTZWFyY2hTdGFjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1wYW5lLXNlYXJjaC1zdGFja1wiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBpZihsZWZ0UGFuZURlc2t0b3Auc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKXtcclxuICAgICAgICByZXR1cm4gTGVmdFBhbmVUeXBlLkRlc2t0b3A7XHJcbiAgICB9IGVsc2UgaWYobGVmdFBhbmVTZWFyY2hTdGFjay5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpe1xyXG4gICAgICAgIHJldHVybiBMZWZ0UGFuZVR5cGUuU2VhcmNoU3RhY2s7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBMZWZ0UGFuZVR5cGUuU2VhcmNoU3RhY2s7IC8vIGRlZmF1bHQgdG8gdGhlIHNlYXJjaCBzdGFja1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCJcclxuaW1wb3J0IHsgQ2FyZEdyb3VwIH0gZnJvbSBcIi4uL2NhcmRncm91cFwiXHJcblxyXG5jb25zdCBzZWFyY2hTdGFja0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtc3RhY2stY29udGFpbmVyJykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFNlYXJjaFN0YWNrID0gKGNhcmRzOiBDYXJkW10sIGNhcmRHcm91cHM6IENhcmRHcm91cFtdKSA9PiB7XHJcbiAgICBjb25zdCBjb21iaW5lZEl0ZW1zOiAoQ2FyZCB8IENhcmRHcm91cClbXSA9IFsuLi5jYXJkcywgLi4uY2FyZEdyb3Vwc107XHJcbiAgICBjb25zdCBjbGVhclN0YWNrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1zdGFjay1jbGVhci1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNsZWFyU3RhY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgc2VhcmNoU3RhY2tDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgc2F2ZVN0YWNrKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBsb2NhbCBzdG9yYWdlIGxvYWRpbmcuLi5cclxuICAgIGNvbnN0IHByZXZEYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzdGFjay1kYXRhXCIpO1xyXG4gICAgaWYocHJldkRhdGEgIT09IG51bGwpe1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHByZXZEYXRhKSBhcyB7c3RhY2s6IHN0cmluZ1tdfTtcclxuICAgICAgICAgICAgZGF0YS5zdGFjay5mb3JFYWNoKGlkID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjb21iaW5lZEl0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLnVuaXF1ZUlEID09PSBpZCk7XHJcbiAgICAgICAgICAgICAgICBpZighaXRlbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoU3RhY2tDb250YWluZXIuYXBwZW5kKGl0ZW0uZ2V0Tm9kZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaChlKXtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBsb2NhbCBzdG9yYWdlIHN0YWNrIHNhdmluZy4uLlxyXG5leHBvcnQgY29uc3Qgc2F2ZVN0YWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZGF0YSA9IHtzdGFjazogW10gYXMgc3RyaW5nW119O1xyXG4gICAgZm9yKGxldCBjaGlsZCBvZiBzZWFyY2hTdGFja0NvbnRhaW5lci5jaGlsZHJlbil7XHJcbiAgICAgICAgZGF0YS5zdGFjay5wdXNoKGNoaWxkLmlkKTtcclxuICAgIH07XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInN0YWNrLWRhdGFcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkSXRlbVRvU3RhY2sgPSAoaXRlbSA6IENhcmQgfCBDYXJkR3JvdXApID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gaXRlbS5nZXROb2RlKCk7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBpZiAod2luZG93Lk1hdGhKYXgpIE1hdGhKYXgudHlwZXNldChbY3VycmVudE5vZGVdKTtcclxuICAgIHNlYXJjaFN0YWNrQ29udGFpbmVyLnByZXBlbmQoY3VycmVudE5vZGUpO1xyXG4gICAgc2F2ZVN0YWNrKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVJdGVtRnJvbVN0YWNrID0gKGl0ZW0gOiBDYXJkIHwgQ2FyZEdyb3VwKSA9PiB7XHJcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGl0ZW0uZ2V0Tm9kZSgpO1xyXG4gICAgY3VycmVudE5vZGUucmVtb3ZlKCk7XHJcbiAgICBzYXZlU3RhY2soKTtcclxufSIsImltcG9ydCB7IENhcmQgfSBmcm9tIFwiLi4vY2FyZFwiO1xyXG5pbXBvcnQgeyBDYXJkR3JvdXAgfSBmcm9tIFwiLi4vY2FyZGdyb3VwXCI7XHJcbmltcG9ydCAqIGFzIGVsYXN0aWNsdW5yIGZyb20gXCJlbGFzdGljbHVuclwiO1xyXG5pbXBvcnQgeyBhZGRJdGVtVG9TdGFjayB9IGZyb20gXCIuL3NlYXJjaC1zdGFja1wiO1xyXG5pbXBvcnQgeyBhZGRJdGVtVG9EZXNrdG9wIH0gZnJvbSBcIi4vZGVza3RvcFwiO1xyXG5pbXBvcnQgeyB3aGljaExlZnRQYW5lQWN0aXZlLCBMZWZ0UGFuZVR5cGUgfSBmcm9tIFwiLi9wYW5lLW1hbmFnZW1lbnRcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFNlYXJjaEluZGV4ID0ge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZyxcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTZWFyY2ggPSAoY2FyZHM6IENhcmRbXSwgY2FyZEdyb3VwczogQ2FyZEdyb3VwW10pID0+IHtcclxuICAgIGNvbnN0IGNvbWJpbmVkSXRlbXMgPSBbLi4uY2FyZHMsIC4uLmNhcmRHcm91cHNdO1xyXG4gICAgY29uc3QgaW5kZXggPSBlbGFzdGljbHVucjxTZWFyY2hJbmRleD4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5hZGRGaWVsZCgnbmFtZScpO1xyXG4gICAgICAgIHRoaXMuYWRkRmllbGQoJ2Rlc2NyaXB0aW9uJyk7XHJcbiAgICAgICAgdGhpcy5zZXRSZWYoJ2lkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBkb2N1bWVudHM6IFNlYXJjaEluZGV4W10gPSBjb21iaW5lZEl0ZW1zLm1hcChpdGVtID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuYW1lOiBpdGVtLm5hbWUsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBpdGVtLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICBpZDogaXRlbS51bmlxdWVJRC5yZXBsYWNlKC8tL2csICcgJylcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50cy5mb3JFYWNoKGRvY3VtZW50ID0+IGluZGV4LmFkZERvYyhkb2N1bWVudCkpO1xyXG5cclxuICAgIGNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtcXVlcnktaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgY29uc3Qgc2VhcmNoUmVzdWx0c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtcmVzdWx0cy1jb250YWluZXInKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHNlYXJjaEZpbHRlckNhcmRzT25seSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtZmlsdGVyLWNhcmRzLW9ubHknKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgY29uc3Qgc2VhcmNoRmlsdGVyQ2FyZGdyb3Vwc09ubHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWZpbHRlci1jYXJkZ3JvdXBzLW9ubHknKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0IHJ1blNlYXJjaFF1ZXJ5ID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gc2VhcmNoQmFyLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBpbmRleC5zZWFyY2gocXVlcnksIHtcclxuICAgICAgICAgICAgZmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiB7Ym9vc3Q6IDJ9LFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHtib29zdDogMX0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNlYXJjaC1xdWVyeVwiLCBxdWVyeSk7XHJcblxyXG4gICAgICAgIHNlYXJjaFJlc3VsdHNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaChyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpc0NhcmQgPSByZXN1bHQucmVmLnNsaWNlKDAsIDMpICE9PSAnW0ddJztcclxuICAgICAgICAgICAgaWYoc2VhcmNoRmlsdGVyQ2FyZHNPbmx5LmNoZWNrZWQgJiYgIXNlYXJjaEZpbHRlckNhcmRncm91cHNPbmx5LmNoZWNrZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYoIWlzQ2FyZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIXNlYXJjaEZpbHRlckNhcmRzT25seS5jaGVja2VkICYmIHNlYXJjaEZpbHRlckNhcmRncm91cHNPbmx5LmNoZWNrZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYoaXNDYXJkKSByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc2VhcmNoSXRlbS5jbGFzc05hbWUgPSAnc2VhcmNoLXJlc3VsdC1pdGVtJztcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcclxuICAgICAgICAgICAgc2VhcmNoSGVhZGVyLmNsYXNzTmFtZSA9ICdzZWFyY2gtaXRlbS1oZWFkZXInO1xyXG4gICAgICAgICAgICBzZWFyY2hIZWFkZXIuaW5uZXJIVE1MID0gcmVzdWx0LnJlZjsgLy8ucmVwbGFjZSgvIC9nLCAnLScpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hCdXR0b25Sb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc2VhcmNoQnV0dG9uUm93LmNsYXNzTmFtZSA9ICdzZWFyY2gtYnV0dG9uLXJvdydcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGFkZFRvU3RhY2tCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICAgICAgLy8gYWRkVG9TdGFja0J1dHRvbi5pbm5lckhUTUwgPSAnQWRkIHRvIFN0YWNrJztcclxuICAgICAgICAgICAgLy8gc2VhcmNoQnV0dG9uUm93LmFwcGVuZChhZGRUb1N0YWNrQnV0dG9uKTtcclxuICAgICAgICAgICAgLy8gY29uc3QgYWRkVG9EZXNrdG9wQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIC8vIGFkZFRvRGVza3RvcEJ1dHRvbi5pbm5lckhUTUwgPSAnQWRkIHRvIERlc2t0b3AnO1xyXG4gICAgICAgICAgICAvLyBzZWFyY2hCdXR0b25Sb3cuYXBwZW5kKGFkZFRvRGVza3RvcEJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICBzZWFyY2hJdGVtLmFwcGVuZChzZWFyY2hIZWFkZXIpO1xyXG4gICAgICAgICAgICAvLyBzZWFyY2hJdGVtLmFwcGVuZChzZWFyY2hCdXR0b25Sb3cpO1xyXG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzQ29udGFpbmVyLmFwcGVuZChzZWFyY2hJdGVtKTtcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaEl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzSUQgPSByZXN1bHQucmVmLnJlcGxhY2UoLyAvZywgJy0nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjb21iaW5lZEl0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLnVuaXF1ZUlEID09PSB0aGlzSUQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFpdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZih3aGljaExlZnRQYW5lQWN0aXZlKCkgPT09IExlZnRQYW5lVHlwZS5EZXNrdG9wKXtcclxuICAgICAgICAgICAgICAgICAgICBhZGRJdGVtVG9EZXNrdG9wKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRJdGVtVG9TdGFjayhpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlYXJjaEJhci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHJ1blNlYXJjaFF1ZXJ5KTtcclxuICAgIHNlYXJjaEZpbHRlckNhcmRzT25seS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJ1blNlYXJjaFF1ZXJ5KTtcclxuICAgIHNlYXJjaEZpbHRlckNhcmRncm91cHNPbmx5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcnVuU2VhcmNoUXVlcnkpO1xyXG5cclxuICAgIC8vIGZpbmFsaXphdGlvblxcXHJcbiAgICBjb25zdCBwcmV2UXVlcnkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNlYXJjaC1xdWVyeVwiKTtcclxuICAgIGlmKHByZXZRdWVyeSl7XHJcbiAgICAgICAgc2VhcmNoQmFyLnZhbHVlID0gcHJldlF1ZXJ5O1xyXG4gICAgICAgIHJ1blNlYXJjaFF1ZXJ5KCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY29uc3QgY29weVRvQ2xpcGJvYXJkID0gKGNvbnRlbnQ6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGNvbnRlbnQpO1xyXG59IFxyXG5cclxuZXhwb3J0IGNvbnN0IGNvcHlGcm9tQ2xpcGJvYXJkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgdGV4dCA9IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59IiwiZXhwb3J0IGNvbnN0IGdldE1NRERZWVlZID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBNTSA9IGAke2RhdGUuZ2V0TW9udGgoKSArIDF9YC5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3QgREQgPSBgJHtkYXRlLmdldERhdGUoKX1gLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBZWVlZID0gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfWA7XHJcbiAgICByZXR1cm4gYCR7TU19LSR7RER9LSR7WVlZWX1gO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SEhNTSA9ICgpID0+IHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IFhNID0gJ0FNJztcclxuICAgIGxldCBISDogc3RyaW5nIHwgbnVtYmVyID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gICAgaWYoSEggPT09IDApIHtcclxuICAgICAgICBISCA9IDEyO1xyXG4gICAgICAgIFhNID0gJ0FNJztcclxuICAgIH0gZWxzZSBpZihISCA9PT0gMTIpe1xyXG4gICAgICAgIFhNID0gJ1BNJztcclxuICAgIH0gZWxzZSBpZihISCA+PSAxMyl7XHJcbiAgICAgICAgSEggLT0gMTI7XHJcbiAgICAgICAgWE0gPSAnUE0nO1xyXG4gICAgfVxyXG4gICAgSEggPSBgJHtISH1gLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBsZXQgTU0gPSBgJHtkYXRlLmdldE1pbnV0ZXMoKX1gLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICByZXR1cm4gYCR7SEh9LSR7TU19JHtYTX1gXHJcbn0iLCJleHBvcnQgY29uc3QgZG93bmxvYWRGaWxlID0gKGZpbGVuYW1lOiBzdHJpbmcsIGRhdGE6IHN0cmluZykgPT4ge1xyXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtkYXRhXSk7XHJcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgbGluay5ocmVmID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZW5hbWU7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbn0iLCJleHBvcnQgY29uc3QgdG9KU09OU2FmZVRleHQgPSAodGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gdGV4dFxyXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIilcclxuICAgICAgICAucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIilcclxuICAgICAgICAucmVwbGFjZSgvXCIvZywgXCJcXFxcXFxcIlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZyb21KU09OU2FmZVRleHQgPSAodGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gdGV4dFxyXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcbi9nLCBcIlxcblwiKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcXCJuL2csIFwiXFxcIlwiKTtcclxufSIsImV4cG9ydCBjb25zdCBsb2FkRGF0YSA9IChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgY2xpZW50Lm9wZW4oJ0dFVCcsIHBhdGgpO1xyXG4gICAgICAgIGNsaWVudC5yZXNwb25zZVR5cGUgPSAnanNvbic7XHJcbiAgICAgICAgY2xpZW50Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzaGFkZXJDb2RlID0gY2xpZW50LnJlc3BvbnNlO1xyXG4gICAgICAgICAgICByZXNvbHZlKHNoYWRlckNvZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGllbnQuc2VuZCgpO1xyXG4gICAgfSk7XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQ2FyZCwgQ2FyZEpTT04gfSBmcm9tIFwiLi9jYXJkXCI7XHJcbmltcG9ydCB7IGxvYWREYXRhIH0gZnJvbSBcIi4vdXRpbC9sb2FkZXJcIjtcclxuaW1wb3J0IHsgaW5pdENhcmRBdXRob3JpbmcgfSBmcm9tIFwiLi9mZWF0dXJlcy9jYXJkLWF1dGhvcmluZ1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVWU3BhY2VyIH0gZnJvbSBcIi4vdXRpbC9zcGFjZXJzXCI7XHJcbmltcG9ydCB7IExlZnRQYW5lVHlwZSwgUmlnaHRQYW5lVHlwZSwgaW5pdFBhbmVNYW5hZ2VtZW50IH0gZnJvbSBcIi4vZmVhdHVyZXMvcGFuZS1tYW5hZ2VtZW50XCI7XHJcbmltcG9ydCB7IGluaXRDYXJkR3JvdXBBdXRob3JpbmcgfSBmcm9tIFwiLi9mZWF0dXJlcy9jYXJkLWdyb3VwLWF1dGhvcmluZ1wiO1xyXG5pbXBvcnQgeyBDYXJkR3JvdXAsIENhcmRHcm91cEpTT04gfSBmcm9tIFwiLi9jYXJkZ3JvdXBcIjtcclxuaW1wb3J0IHsgaW5pdEhpZXJhcmNoeSB9IGZyb20gXCIuL2ZlYXR1cmVzL2hpZXJhcmNoeVwiO1xyXG5pbXBvcnQgeyBpbml0U2VhcmNoIH0gZnJvbSBcIi4vZmVhdHVyZXMvc2VhcmNoXCI7XHJcbmltcG9ydCB7IGluaXRTZWFyY2hTdGFjayB9IGZyb20gXCIuL2ZlYXR1cmVzL3NlYXJjaC1zdGFja1wiO1xyXG5pbXBvcnQgeyBpbml0RGVza3RvcCB9IGZyb20gXCIuL2ZlYXR1cmVzL2Rlc2t0b3BcIjtcclxuXHJcbmNvbnN0IGxvYWRDYXJkcyA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGNhcmRNYXAgPSBhd2FpdCBsb2FkRGF0YSgnLi4vY2FyZC1tYXAuanNvbicpO1xyXG4gICAgY29uc3QgcGF0aHM6IHN0cmluZ1tdID0gY2FyZE1hcC5maWxlcztcclxuICAgIGNvbnN0IGNhcmRzSlNPTiA9IGF3YWl0IFByb21pc2UuYWxsKHBhdGhzLm1hcChwYXRoID0+IGxvYWREYXRhKGAuLi9kYXRhLWNhcmRzLyR7cGF0aH0uanNvbmApKSk7XHJcblxyXG4gICAgcmV0dXJuIGNhcmRzSlNPTjtcclxufVxyXG5cclxuY29uc3QgbG9hZENhcmRHcm91cHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJkTWFwID0gYXdhaXQgbG9hZERhdGEoJy4uL2NhcmQtZ3JvdXAtbWFwLmpzb24nKTtcclxuICAgIGNvbnN0IHBhdGhzOiBzdHJpbmdbXSA9IGNhcmRNYXAuZmlsZXM7XHJcbiAgICBjb25zdCBjYXJkc0pTT04gPSBhd2FpdCBQcm9taXNlLmFsbChwYXRocy5tYXAocGF0aCA9PiBsb2FkRGF0YShgLi4vZGF0YS1jYXJkLWdyb3Vwcy8ke3BhdGh9Lmpzb25gKSkpO1xyXG5cclxuICAgIHJldHVybiBjYXJkc0pTT047XHJcbn1cclxuXHJcbmNvbnN0IGluaXQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBsZXQgY2FyZHNKU09OOiBDYXJkSlNPTltdID0gYXdhaXQgbG9hZENhcmRzKCk7XHJcbiAgICBsZXQgY2FyZEdyb3Vwc0pTT046IENhcmRHcm91cEpTT05bXSA9IGF3YWl0IGxvYWRDYXJkR3JvdXBzKCk7XHJcbiAgICBsZXQgY2FyZHMgPSBjYXJkc0pTT04ubWFwKGRhdGEgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcmQgPSBuZXcgQ2FyZChkYXRhLm5hbWUsIGRhdGEuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGlmKGRhdGEuY3JlYXRpb25EYXRlICYmIGRhdGEuZWRpdERhdGUpe1xyXG4gICAgICAgICAgICBjYXJkLnNldERhdGVzKGRhdGEuY3JlYXRpb25EYXRlLCBkYXRhLmVkaXREYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZGF0YS5jYXRlZ29yaWVzICYmIGRhdGEuc3ViY2FyZHMpe1xyXG4gICAgICAgICAgICBjYXJkLnNldENhdGVnb3JpZXMoZGF0YS5jYXRlZ29yaWVzKTtcclxuICAgICAgICAgICAgY2FyZC5zZXRTdWJjYXJkcyhkYXRhLnN1YmNhcmRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhcmQ7XHJcbiAgICB9KTtcclxuICAgIGxldCBjYXJkR3JvdXBzID0gY2FyZEdyb3Vwc0pTT04ubWFwKGRhdGEgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcmRHcm91cCA9IG5ldyBDYXJkR3JvdXAoZGF0YS5uYW1lLCBkYXRhLmRlc2NyaXB0aW9uKTtcclxuICAgICAgICBpZihkYXRhLmNoaWxkcmVuSURzKSBjYXJkR3JvdXAuc2V0Q2hpbGRyZW5JRHMoZGF0YS5jaGlsZHJlbklEcyk7XHJcbiAgICAgICAgcmV0dXJuIGNhcmRHcm91cDtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNhcmRzLmZvckVhY2goY2FyZCA9PiB7XHJcbiAgICAvLyAgICAgY29uc3QgZG9tTm9kZSA9IGNhcmQuZ2V0Tm9kZSgpO1xyXG4gICAgLy8gICAgIGxlZnRQYW5lTm9kZS5hcHBlbmQoZG9tTm9kZSk7XHJcbiAgICAvLyAgICAgbGVmdFBhbmVOb2RlLmFwcGVuZChjcmVhdGVWU3BhY2VyKDgpKTtcclxuICAgIC8vIH0pO1xyXG4gICAgLy8gY2FyZEdyb3Vwcy5mb3JFYWNoKGNhcmRHcm91cCA9PiB7XHJcbiAgICAvLyAgICAgY29uc3QgZG9tTm9kZSA9IGNhcmRHcm91cC5nZXROb2RlKCk7XHJcbiAgICAvLyAgICAgbGVmdFBhbmVOb2RlLmFwcGVuZChkb21Ob2RlKTtcclxuICAgIC8vICAgICBsZWZ0UGFuZU5vZGUuYXBwZW5kKGNyZWF0ZVZTcGFjZXIoOCkpO1xyXG4gICAgLy8gfSk7XHJcblxyXG4gICAgaW5pdFBhbmVNYW5hZ2VtZW50KExlZnRQYW5lVHlwZS5EZXNrdG9wLCBSaWdodFBhbmVUeXBlLlNlYXJjaCk7XHJcbiAgICBpbml0Q2FyZEF1dGhvcmluZygpO1xyXG4gICAgaW5pdENhcmRHcm91cEF1dGhvcmluZygpO1xyXG4gICAgaW5pdEhpZXJhcmNoeShjYXJkcywgY2FyZEdyb3Vwcyk7XHJcbiAgICBpbml0U2VhcmNoKGNhcmRzLCBjYXJkR3JvdXBzKTtcclxuXHJcbiAgICBpbml0U2VhcmNoU3RhY2soY2FyZHMsIGNhcmRHcm91cHMpO1xyXG4gICAgaW5pdERlc2t0b3AoY2FyZHMsIGNhcmRHcm91cHMpO1xyXG5cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGlmICh3aW5kb3cuTWF0aEpheCkgTWF0aEpheC50eXBlc2V0KCk7XHJcbn1cclxuXHJcbmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=