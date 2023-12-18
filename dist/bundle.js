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
        this.copyToDesktopButton = document.createElement('div');
        this.nodeDesktopCopy = this.constructNodeInternal(id, true);
        this.node = this.constructNodeInternal(id);
        this.nodeID = id.length > 0 ? id : this.uniqueID;
    }
    constructNode(id) {
        this.nodeDesktopCopy = this.constructNodeInternal(id, true);
        this.node = this.constructNodeInternal(id);
    }
    constructNodeInternal(id, isDesktop = false) {
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
        nameNode.addEventListener('click', (event) => {
            if (!this.activeName)
                return;
            if ((0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.whichLeftPaneActive)() === _features_pane_management__WEBPACK_IMPORTED_MODULE_3__.LeftPaneType.Desktop) {
                (0,_features_desktop__WEBPACK_IMPORTED_MODULE_4__.addItemToDesktop)(this);
            }
            else {
                (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_2__.addItemToStack)(this);
            }
            event.stopPropagation();
        });
        // create subcards
        if (this.subCards.length > 0) {
            const subcardNode = document.createElement('div');
            const subcardHeader = document.createElement('h4');
            const subcardContainer = document.createElement('div');
            const leftSubcardList = document.createElement('div');
            const rightSubcardList = document.createElement('div');
            subcardHeader.innerHTML = 'Related:';
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
                subcardItem.style.cursor = 'pointer';
                subcardItem.addEventListener('click', (event) => {
                    const item = _features_desktop__WEBPACK_IMPORTED_MODULE_4__.refCombinedItems.find(item => item.uniqueID === this.subCards[i]);
                    if (item === undefined)
                        return;
                    else if (!this.activeName)
                        return;
                    if ((0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.whichLeftPaneActive)() === _features_pane_management__WEBPACK_IMPORTED_MODULE_3__.LeftPaneType.Desktop)
                        (0,_features_desktop__WEBPACK_IMPORTED_MODULE_4__.addItemToDesktop)(item);
                    else
                        (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_2__.addItemToStack)(item);
                });
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
        const copyToDesktopButton = document.createElement('button');
        copyToDesktopButton.innerHTML = 'Copy to Desktop';
        copyToDesktopButton.addEventListener('click', () => {
            (0,_features_desktop__WEBPACK_IMPORTED_MODULE_4__.addItemToDesktop)(this);
            (0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.switchToDesktop)();
        });
        copyToDesktopButton.style.display = 'none';
        if (!isDesktop)
            this.copyToDesktopButton = copyToDesktopButton;
        buttonRow.appendChild(copyToDesktopButton);
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
    enableCopyToDesktop() {
        this.copyToDesktopButton.style.display = 'inline';
    }
    disableCopyToDesktop() {
        this.copyToDesktopButton.style.display = 'none';
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
        this.uniqueID = '[g]' + name.replace(/ /g, '-').toLocaleLowerCase();
        this.description = (0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.fromJSONSafeText)(description);
        this.childrenIDs = [];
        this.children = [];
        this.activeName = true;
        this.copyToDesktopButton = document.createElement('div');
        this.nodeDesktopCopy = this.constructNodeInternal(id, true);
        this.node = this.constructNodeInternal(id);
        this.nodeID = id.length > 0 ? id : this.uniqueID;
    }
    // similar to card.ts' constructNode
    constructNode(id) {
        this.nodeDesktopCopy = this.constructNodeInternal(id, true);
        this.node = this.constructNodeInternal(id);
    }
    constructNodeInternal(id, isDesktop = false) {
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
        nameNode.addEventListener('click', (event) => {
            if (!this.activeName)
                return;
            if ((0,_features_pane_management__WEBPACK_IMPORTED_MODULE_4__.whichLeftPaneActive)() === _features_pane_management__WEBPACK_IMPORTED_MODULE_4__.LeftPaneType.Desktop) {
                (0,_features_desktop__WEBPACK_IMPORTED_MODULE_3__.addItemToDesktop)(this);
            }
            else {
                (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_2__.addItemToStack)(this);
            }
            event.stopPropagation();
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
            subcardItem.style.cursor = 'pointer';
            subcardItem.addEventListener('click', (event) => {
                const item = _features_desktop__WEBPACK_IMPORTED_MODULE_3__.refCombinedItems.find(item => item.uniqueID === this.childrenIDs[i]);
                if (item === undefined)
                    return;
                else if (!this.activeName)
                    return;
                if ((0,_features_pane_management__WEBPACK_IMPORTED_MODULE_4__.whichLeftPaneActive)() === _features_pane_management__WEBPACK_IMPORTED_MODULE_4__.LeftPaneType.Desktop)
                    (0,_features_desktop__WEBPACK_IMPORTED_MODULE_3__.addItemToDesktop)(item);
                else
                    (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_2__.addItemToStack)(item);
            });
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
        const copyToDesktopButton = document.createElement('button');
        copyToDesktopButton.innerHTML = 'Copy to Desktop';
        copyToDesktopButton.addEventListener('click', () => {
            (0,_features_desktop__WEBPACK_IMPORTED_MODULE_3__.addItemToDesktop)(this);
            (0,_features_pane_management__WEBPACK_IMPORTED_MODULE_4__.switchToDesktop)();
        });
        copyToDesktopButton.style.display = 'none';
        if (!isDesktop)
            this.copyToDesktopButton = copyToDesktopButton;
        buttonRow.appendChild(copyToDesktopButton);
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
    enableCopyToDesktop() {
        this.copyToDesktopButton.style.display = 'inline';
    }
    disableCopyToDesktop() {
        this.copyToDesktopButton.style.display = 'none';
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
/* harmony import */ var _util_download__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/download */ "./src/util/download.ts");
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
    const downloadButton = document.getElementById('card-authoring-download-button');
    const copyButton = document.getElementById('card-authoring-copy-button');
    const pasteButton = document.getElementById('card-authoring-paste-button');
    const clearButton = document.getElementById('card-authoring-clear-button');
    downloadButton.addEventListener('click', () => {
        (0,_util_download__WEBPACK_IMPORTED_MODULE_3__.downloadFile)(`${cardNameInput.value.replace(/ /g, '-').toLocaleLowerCase()}.json`, cardDescriptionOutput.value);
    });
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
/* harmony import */ var _util_download__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/download */ "./src/util/download.ts");
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
    const downloadButton = document.getElementById('card-group-authoring-download-button');
    const copyButton = document.getElementById('card-group-authoring-copy-button');
    const pasteButton = document.getElementById('card-group-authoring-paste-button');
    const clearButton = document.getElementById('card-group-authoring-clear-button');
    downloadButton.addEventListener('click', () => {
        (0,_util_download__WEBPACK_IMPORTED_MODULE_3__.downloadFile)(`${cardGroupNameInput.value.replace(/ /g, '-').toLocaleLowerCase()}.json`, cardGroupDescriptionOutput.value);
    });
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
/* harmony export */   "refCombinedItems": () => (/* binding */ refCombinedItems),
/* harmony export */   "removeItemFromDesktop": () => (/* binding */ removeItemFromDesktop),
/* harmony export */   "saveDesktop": () => (/* binding */ saveDesktop),
/* harmony export */   "toggleCopyToDesktopButtonActive": () => (/* binding */ toggleCopyToDesktopButtonActive)
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
let refCombinedItems;
const initDesktop = (cards, cardGroups) => {
    const desktopSurface = document.getElementById('desktop-container');
    const combinedItems = [...cards, ...cardGroups];
    refCombinedItems = combinedItems;
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
        toggleCopyToDesktopButtonActive(combinedItems);
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
        toggleCopyToDesktopButtonActive(combinedItems);
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
        toggleCopyToDesktopButtonActive(combinedItems);
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
    toggleCopyToDesktopButtonActive(refCombinedItems);
    saveDesktop();
};
const removeItemFromDesktop = (item) => {
    const currentNode = item.getDesktopNode();
    currentNode.remove();
    saveDesktop();
};
const toggleCopyToDesktopButtonActive = (combinedItems) => {
    const slotSelected = selectedSlot !== null;
    for (let item of combinedItems) {
        const button = item.copyToDesktopButton;
        if (slotSelected) {
            button.disabled = false;
        }
        else {
            button.disabled = true;
        }
    }
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
/* harmony export */   "switchToDesktop": () => (/* binding */ switchToDesktop),
/* harmony export */   "whichLeftPaneActive": () => (/* binding */ whichLeftPaneActive)
/* harmony export */ });
var LeftPaneType;
(function (LeftPaneType) {
    LeftPaneType[LeftPaneType["Desktop"] = 0] = "Desktop";
    LeftPaneType[LeftPaneType["SearchStack"] = 1] = "SearchStack";
    LeftPaneType[LeftPaneType["About"] = 2] = "About";
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
    const leftPaneAbout = document.getElementById("left-pane-about");
    const rightPaneCreateCard = document.getElementById("right-pane-create-card");
    const rightPaneCreateCardGroup = document.getElementById("right-pane-create-card-group");
    const rightPaneSearch = document.getElementById("right-pane-search");
    const rightPaneMetadata = document.getElementById("right-pane-metadata");
    const rightPaneHierarchy = document.getElementById("right-pane-hierarchy");
    const leftPaneButtonDesktop = document.getElementById("left-pane-button-desktop");
    const leftPaneButtonSearchStack = document.getElementById("left-pane-button-search-stack");
    const leftPaneButtonAbout = document.getElementById("left-pane-button-about");
    const rightPaneButtonCreateCard = document.getElementById("right-pane-button-create-card");
    const rightPaneButtonCreateCardGroup = document.getElementById("right-pane-button-create-card-group");
    const rightPaneButtonSearch = document.getElementById("right-pane-button-search");
    const rightPaneButtonMetadata = document.getElementById("right-pane-button-metadata");
    const rightPaneButtonHierarchy = document.getElementById("right-pane-button-hierarchy");
    const leftPaneNodeEnumPairs = [
        [leftPaneDesktop, LeftPaneType.Desktop],
        [leftPaneSearchStack, LeftPaneType.SearchStack],
        [leftPaneAbout, LeftPaneType.About]
    ];
    const leftPaneClicked = (selectedPane) => {
        leftPaneNodeEnumPairs.forEach(pair => {
            if (pair[1] === selectedPane)
                pair[0].style.display = 'flex';
            else
                pair[0].style.display = 'none';
        });
        localStorage.setItem('selected-left-pane', selectedPane.toString());
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
        localStorage.setItem('selected-right-pane', selectedPane.toString());
    };
    leftPaneButtonDesktop.addEventListener('click', () => leftPaneClicked(LeftPaneType.Desktop));
    leftPaneButtonSearchStack.addEventListener('click', () => leftPaneClicked(LeftPaneType.SearchStack));
    leftPaneButtonAbout.addEventListener('click', () => leftPaneClicked(LeftPaneType.About));
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
const switchToDesktop = () => {
    const leftPaneDesktop = document.getElementById("left-pane-desktop");
    const leftPaneSearchStack = document.getElementById("left-pane-search-stack");
    const leftPaneAbout = document.getElementById("left-pane-about");
    const leftPaneNodeEnumPairs = [
        [leftPaneDesktop, LeftPaneType.Desktop],
        [leftPaneSearchStack, LeftPaneType.SearchStack],
        [leftPaneAbout, LeftPaneType.About]
    ];
    const selectedPane = LeftPaneType.Desktop;
    leftPaneNodeEnumPairs.forEach(pair => {
        if (pair[1] === selectedPane)
            pair[0].style.display = 'flex';
        else
            pair[0].style.display = 'none';
    });
    localStorage.setItem('selected-left-pane', selectedPane.toString());
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

/***/ "./src/features/pane-resizing.ts":
/*!***************************************!*\
  !*** ./src/features/pane-resizing.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initPaneResizing": () => (/* binding */ initPaneResizing)
/* harmony export */ });
const initPaneResizing = () => {
    const ratioButton11 = document.getElementById('ratio-button-1-1');
    const ratioButton21 = document.getElementById('ratio-button-2-1');
    const ratioButton31 = document.getElementById('ratio-button-3-1');
    const ratioButton41 = document.getElementById('ratio-button-4-1');
    const changePaneRatio = (left, right) => () => {
        const totalWidth = 80;
        const leftWidth = Math.ceil(left / (left + right) * totalWidth);
        const rightWidth = Math.floor(right / (left + right) * totalWidth);
        const stylesheet = document.styleSheets[0]; // should be /web/style.css
        for (let rule of stylesheet.cssRules) {
            let sr = rule;
            if (sr.selectorText === '.left-pane-width') {
                sr.style.width = `${leftWidth}vw`;
            }
            else if (sr.selectorText === '.right-pane-width') {
                sr.style.width = `${rightWidth}vw`;
            }
        }
        const paneRatioJSON = {
            left: left,
            right: right
        };
        localStorage.setItem("pane-ratio", JSON.stringify(paneRatioJSON));
    };
    ratioButton11.addEventListener('click', changePaneRatio(1, 1));
    ratioButton21.addEventListener('click', changePaneRatio(2, 1));
    ratioButton31.addEventListener('click', changePaneRatio(4, 1));
    ratioButton41.addEventListener('click', changePaneRatio(6, 1));
    const prevPaneRatioJSON = localStorage.getItem("pane-ratio");
    if (prevPaneRatioJSON !== null) {
        try {
            const prevPaneRatio = JSON.parse(prevPaneRatioJSON);
            changePaneRatio(prevPaneRatio.left, prevPaneRatio.right)();
        }
        catch (e) {
        }
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
                item.enableCopyToDesktop();
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
    item.enableCopyToDesktop();
    // @ts-ignore
    if (window.MathJax)
        MathJax.typeset([currentNode]);
    searchStackContainer.prepend(currentNode);
    saveStack();
};
const removeItemFromStack = (item) => {
    const currentNode = item.getNode();
    item.disableCopyToDesktop();
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
            const isCard = result.ref.slice(0, 3) !== '[g]';
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
        .replace(/\\n(?![a-z])/g, "\n")
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
/* harmony import */ var _features_pane_resizing__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./features/pane-resizing */ "./src/features/pane-resizing.ts");
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
    const cardMap = yield (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)('./card-map.json');
    const paths = cardMap.files;
    const cardsJSON = yield Promise.all(paths.map(path => (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)(`./data-cards/${path}.json`)));
    return cardsJSON;
});
const loadCardGroups = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardMap = yield (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)('./card-group-map.json');
    const paths = cardMap.files;
    const cardsJSON = yield Promise.all(paths.map(path => (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)(`./data-card-groups/${path}.json`)));
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
    const prevSelectedLeftPane = localStorage.getItem('selected-left-pane');
    const prevSelectedRightPane = localStorage.getItem('selected-right-pane');
    if (prevSelectedLeftPane !== null && prevSelectedRightPane !== null) {
        const prevLeft = parseInt(prevSelectedLeftPane);
        const prevRight = parseInt(prevSelectedRightPane);
        (0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.initPaneManagement)(prevLeft, prevRight);
    }
    else {
        (0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.initPaneManagement)(_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.LeftPaneType.Desktop, _features_pane_management__WEBPACK_IMPORTED_MODULE_3__.RightPaneType.Search);
    }
    (0,_features_card_authoring__WEBPACK_IMPORTED_MODULE_2__.initCardAuthoring)();
    (0,_features_card_group_authoring__WEBPACK_IMPORTED_MODULE_4__.initCardGroupAuthoring)();
    (0,_features_hierarchy__WEBPACK_IMPORTED_MODULE_6__.initHierarchy)(cards, cardGroups);
    (0,_features_search__WEBPACK_IMPORTED_MODULE_7__.initSearch)(cards, cardGroups);
    (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_8__.initSearchStack)(cards, cardGroups);
    (0,_features_desktop__WEBPACK_IMPORTED_MODULE_9__.initDesktop)(cards, cardGroups);
    (0,_features_pane_resizing__WEBPACK_IMPORTED_MODULE_10__.initPaneResizing)();
    // @ts-ignore
    if (window.MathJax) {
        // @ts-ignore
        MathJax.typeset();
    }
});
init();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxTQUFTLFFBQVEsU0FBUyxTQUFTLFdBQVc7QUFDbkY7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFdBQVcsU0FBUztBQUNwQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQkFBZ0I7QUFDM0IsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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NEI7QUFDNUIsZ0NBQWdDLGNBQWM7QUFDOUMsZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxrQkFBa0I7QUFDN0I7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIs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QUFFLENBQUM7SUFFbkIsYUFBYTtJQUNiLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNoQixhQUFhO1FBQ2IsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGJydC8uL25vZGVfbW9kdWxlcy9lbGFzdGljbHVuci9lbGFzdGljbHVuci5qcyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2NhcmQudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9jYXJkZ3JvdXAudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9mZWF0dXJlcy9jYXJkLWF1dGhvcmluZy50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL2NhcmQtZ3JvdXAtYXV0aG9yaW5nLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvZmVhdHVyZXMvZGVza3RvcC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL2hpZXJhcmNoeS50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL3BhbmUtbWFuYWdlbWVudC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL3BhbmUtcmVzaXppbmcudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9mZWF0dXJlcy9zZWFyY2gtc3RhY2sudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9mZWF0dXJlcy9zZWFyY2gudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy91dGlsL2NsaXBib2FyZC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL3V0aWwvZGF0ZS50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL3V0aWwvZG93bmxvYWQudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy91dGlsL2pzb24tdGV4dC1jb252ZXJ0ZXIudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy91dGlsL2xvYWRlci50cyIsIndlYnBhY2s6Ly9wYnJ0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BicnQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcGJydC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGJydC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BicnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZWxhc3RpY2x1bnIgLSBodHRwOi8vd2VpeHNvbmcuZ2l0aHViLmlvXG4gKiBMaWdodHdlaWdodCBmdWxsLXRleHQgc2VhcmNoIGVuZ2luZSBpbiBKYXZhc2NyaXB0IGZvciBicm93c2VyIHNlYXJjaCBhbmQgb2ZmbGluZSBzZWFyY2guIC0gMC45LjVcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqIE1JVCBMaWNlbnNlZFxuICogQGxpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24oKXtcblxuLyohXG4gKiBlbGFzdGljbHVuci5qc1xuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgaW5zdGFudGlhdGluZyBhIG5ldyBlbGFzdGljbHVuciBpbmRleCBhbmQgY29uZmlndXJpbmcgaXRcbiAqIHdpdGggdGhlIGRlZmF1bHQgcGlwZWxpbmUgZnVuY3Rpb25zIGFuZCB0aGUgcGFzc2VkIGNvbmZpZyBmdW5jdGlvbi5cbiAqXG4gKiBXaGVuIHVzaW5nIHRoaXMgY29udmVuaWVuY2UgZnVuY3Rpb24gYSBuZXcgaW5kZXggd2lsbCBiZSBjcmVhdGVkIHdpdGggdGhlXG4gKiBmb2xsb3dpbmcgZnVuY3Rpb25zIGFscmVhZHkgaW4gdGhlIHBpcGVsaW5lOlxuICogXG4gKiAxLiBlbGFzdGljbHVuci50cmltbWVyIC0gdHJpbSBub24td29yZCBjaGFyYWN0ZXJcbiAqIDIuIGVsYXN0aWNsdW5yLlN0b3BXb3JkRmlsdGVyIC0gZmlsdGVycyBvdXQgYW55IHN0b3Agd29yZHMgYmVmb3JlIHRoZXkgZW50ZXIgdGhlXG4gKiBpbmRleFxuICogMy4gZWxhc3RpY2x1bnIuc3RlbW1lciAtIHN0ZW1zIHRoZSB0b2tlbnMgYmVmb3JlIGVudGVyaW5nIHRoZSBpbmRleC5cbiAqXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgdmFyIGlkeCA9IGVsYXN0aWNsdW5yKGZ1bmN0aW9uICgpIHtcbiAqICAgICAgIHRoaXMuYWRkRmllbGQoJ2lkJyk7XG4gKiAgICAgICB0aGlzLmFkZEZpZWxkKCd0aXRsZScpO1xuICogICAgICAgdGhpcy5hZGRGaWVsZCgnYm9keScpO1xuICogICAgICAgXG4gKiAgICAgICAvL3RoaXMuc2V0UmVmKCdpZCcpOyAvLyBkZWZhdWx0IHJlZiBpcyAnaWQnXG4gKlxuICogICAgICAgdGhpcy5waXBlbGluZS5hZGQoZnVuY3Rpb24gKCkge1xuICogICAgICAgICAvLyBzb21lIGN1c3RvbSBwaXBlbGluZSBmdW5jdGlvblxuICogICAgICAgfSk7XG4gKiAgICAgfSk7XG4gKiBcbiAqICAgIGlkeC5hZGREb2Moe1xuICogICAgICBpZDogMSwgXG4gKiAgICAgIHRpdGxlOiAnT3JhY2xlIHJlbGVhc2VkIGRhdGFiYXNlIDEyZycsXG4gKiAgICAgIGJvZHk6ICdZZXN0YWRheSwgT3JhY2xlIGhhcyByZWxlYXNlZCB0aGVpciBsYXRlc3QgZGF0YWJhc2UsIG5hbWVkIDEyZywgbW9yZSByb2J1c3QuIHRoaXMgcHJvZHVjdCB3aWxsIGluY3JlYXNlIE9yYWNsZSBwcm9maXQuJ1xuICogICAgfSk7XG4gKiBcbiAqICAgIGlkeC5hZGREb2Moe1xuICogICAgICBpZDogMiwgXG4gKiAgICAgIHRpdGxlOiAnT3JhY2xlIHJlbGVhc2VkIGFubnVhbCBwcm9maXQgcmVwb3J0JyxcbiAqICAgICAgYm9keTogJ1llc3RhZGF5LCBPcmFjbGUgaGFzIHJlbGVhc2VkIHRoZWlyIGFubnVhbCBwcm9maXQgcmVwb3J0IG9mIDIwMTUsIHRvdGFsIHByb2ZpdCBpcyAxMi41IEJpbGxpb24uJ1xuICogICAgfSk7XG4gKiBcbiAqICAgICMgc2ltcGxlIHNlYXJjaFxuICogICAgaWR4LnNlYXJjaCgnb3JhY2xlIGRhdGFiYXNlJyk7XG4gKiBcbiAqICAgICMgc2VhcmNoIHdpdGggcXVlcnktdGltZSBib29zdGluZ1xuICogICAgaWR4LnNlYXJjaCgnb3JhY2xlIGRhdGFiYXNlJywge2ZpZWxkczoge3RpdGxlOiB7Ym9vc3Q6IDJ9LCBib2R5OiB7Ym9vc3Q6IDF9fX0pO1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmZpZyBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgbmV3IGluc3RhbmNlXG4gKiBvZiB0aGUgZWxhc3RpY2x1bnIuSW5kZXggYXMgYm90aCBpdHMgY29udGV4dCBhbmQgZmlyc3QgcGFyYW1ldGVyLiBJdCBjYW4gYmUgdXNlZCB0b1xuICogY3VzdG9taXplIHRoZSBpbnN0YW5jZSBvZiBuZXcgZWxhc3RpY2x1bnIuSW5kZXguXG4gKiBAbmFtZXNwYWNlXG4gKiBAbW9kdWxlXG4gKiBAcmV0dXJuIHtlbGFzdGljbHVuci5JbmRleH1cbiAqXG4gKi9cbnZhciBlbGFzdGljbHVuciA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgdmFyIGlkeCA9IG5ldyBlbGFzdGljbHVuci5JbmRleDtcblxuICBpZHgucGlwZWxpbmUuYWRkKFxuICAgIGVsYXN0aWNsdW5yLnRyaW1tZXIsXG4gICAgZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIsXG4gICAgZWxhc3RpY2x1bnIuc3RlbW1lclxuICApO1xuXG4gIGlmIChjb25maWcpIGNvbmZpZy5jYWxsKGlkeCwgaWR4KTtcblxuICByZXR1cm4gaWR4O1xufTtcblxuZWxhc3RpY2x1bnIudmVyc2lvbiA9IFwiMC45LjVcIjtcblxuLy8gb25seSB1c2VkIHRoaXMgdG8gbWFrZSBlbGFzdGljbHVuci5qcyBjb21wYXRpYmxlIHdpdGggbHVuci1sYW5ndWFnZXNcbi8vIHRoaXMgaXMgYSB0cmljayB0byBkZWZpbmUgYSBnbG9iYWwgYWxpYXMgb2YgZWxhc3RpY2x1bnJcbmx1bnIgPSBlbGFzdGljbHVucjtcblxuLyohXG4gKiBlbGFzdGljbHVuci51dGlsc1xuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBBIG5hbWVzcGFjZSBjb250YWluaW5nIHV0aWxzIGZvciB0aGUgcmVzdCBvZiB0aGUgZWxhc3RpY2x1bnIgbGlicmFyeVxuICovXG5lbGFzdGljbHVuci51dGlscyA9IHt9O1xuXG4vKipcbiAqIFByaW50IGEgd2FybmluZyBtZXNzYWdlIHRvIHRoZSBjb25zb2xlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGJlIHByaW50ZWQuXG4gKiBAbWVtYmVyT2YgVXRpbHNcbiAqL1xuZWxhc3RpY2x1bnIudXRpbHMud2FybiA9IChmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmIChnbG9iYWwuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG4gIH07XG59KSh0aGlzKTtcblxuLyoqXG4gKiBDb252ZXJ0IGFuIG9iamVjdCB0byBzdHJpbmcuXG4gKlxuICogSW4gdGhlIGNhc2Ugb2YgYG51bGxgIGFuZCBgdW5kZWZpbmVkYCB0aGUgZnVuY3Rpb24gcmV0dXJuc1xuICogYW4gZW1wdHkgc3RyaW5nLCBpbiBhbGwgb3RoZXIgY2FzZXMgdGhlIHJlc3VsdCBvZiBjYWxsaW5nXG4gKiBgdG9TdHJpbmdgIG9uIHRoZSBwYXNzZWQgb2JqZWN0IGlzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBjb252ZXJ0IHRvIGEgc3RyaW5nLlxuICogQHJldHVybiB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHBhc3NlZCBvYmplY3QuXG4gKiBAbWVtYmVyT2YgVXRpbHNcbiAqL1xuZWxhc3RpY2x1bnIudXRpbHMudG9TdHJpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gIGlmIChvYmogPT09IHZvaWQgMCB8fCBvYmogPT09IG51bGwpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIHJldHVybiBvYmoudG9TdHJpbmcoKTtcbn07XG4vKiFcbiAqIGVsYXN0aWNsdW5yLkV2ZW50RW1pdHRlclxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBlbGFzdGljbHVuci5FdmVudEVtaXR0ZXIgaXMgYW4gZXZlbnQgZW1pdHRlciBmb3IgZWxhc3RpY2x1bnIuXG4gKiBJdCBtYW5hZ2VzIGFkZGluZyBhbmQgcmVtb3ZpbmcgZXZlbnQgaGFuZGxlcnMgYW5kIHRyaWdnZXJpbmcgZXZlbnRzIGFuZCB0aGVpciBoYW5kbGVycy5cbiAqXG4gKiBFYWNoIGV2ZW50IGNvdWxkIGhhcyBtdWx0aXBsZSBjb3JyZXNwb25kaW5nIGZ1bmN0aW9ucyxcbiAqIHRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZCBhcyB0aGUgc2VxdWVuY2UgdGhhdCB0aGV5IGFyZSBhZGRlZCBpbnRvIHRoZSBldmVudC5cbiAqIFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmVsYXN0aWNsdW5yLkV2ZW50RW1pdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5ldmVudHMgPSB7fTtcbn07XG5cbi8qKlxuICogQmluZHMgYSBoYW5kbGVyIGZ1bmN0aW9uIHRvIGEgc3BlY2lmaWMgZXZlbnQocykuXG4gKlxuICogQ2FuIGJpbmQgYSBzaW5nbGUgZnVuY3Rpb24gdG8gbWFueSBkaWZmZXJlbnQgZXZlbnRzIGluIG9uZSBjYWxsLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnROYW1lXSBUaGUgbmFtZShzKSBvZiBldmVudHMgdG8gYmluZCB0aGlzIGZ1bmN0aW9uIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiBhbiBldmVudCBpcyBmaXJlZC5cbiAqIEBtZW1iZXJPZiBFdmVudEVtaXR0ZXJcbiAqL1xuZWxhc3RpY2x1bnIuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLFxuICAgICAgZm4gPSBhcmdzLnBvcCgpLFxuICAgICAgbmFtZXMgPSBhcmdzO1xuXG4gIGlmICh0eXBlb2YgZm4gIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvciAoXCJsYXN0IGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblxuICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmhhc0hhbmRsZXIobmFtZSkpIHRoaXMuZXZlbnRzW25hbWVdID0gW107XG4gICAgdGhpcy5ldmVudHNbbmFtZV0ucHVzaChmbik7XG4gIH0sIHRoaXMpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgaGFuZGxlciBmdW5jdGlvbiBmcm9tIGEgc3BlY2lmaWMgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIHRoaXMgZnVuY3Rpb24gZnJvbS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byByZW1vdmUgZnJvbSBhbiBldmVudC5cbiAqIEBtZW1iZXJPZiBFdmVudEVtaXR0ZXJcbiAqL1xuZWxhc3RpY2x1bnIuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChuYW1lLCBmbikge1xuICBpZiAoIXRoaXMuaGFzSGFuZGxlcihuYW1lKSkgcmV0dXJuO1xuXG4gIHZhciBmbkluZGV4ID0gdGhpcy5ldmVudHNbbmFtZV0uaW5kZXhPZihmbik7XG4gIGlmIChmbkluZGV4ID09PSAtMSkgcmV0dXJuO1xuXG4gIHRoaXMuZXZlbnRzW25hbWVdLnNwbGljZShmbkluZGV4LCAxKTtcblxuICBpZiAodGhpcy5ldmVudHNbbmFtZV0ubGVuZ3RoID09IDApIGRlbGV0ZSB0aGlzLmV2ZW50c1tuYW1lXTtcbn07XG5cbi8qKlxuICogQ2FsbCBhbGwgZnVuY3Rpb25zIHRoYXQgYm91bmRlZCB0byB0aGUgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQWRkaXRpb25hbCBkYXRhIGNhbiBiZSBwYXNzZWQgdG8gdGhlIGV2ZW50IGhhbmRsZXIgYXMgYXJndW1lbnRzIHRvIGBlbWl0YFxuICogYWZ0ZXIgdGhlIGV2ZW50IG5hbWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gZW1pdC5cbiAqIEBtZW1iZXJPZiBFdmVudEVtaXR0ZXJcbiAqL1xuZWxhc3RpY2x1bnIuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgaWYgKCF0aGlzLmhhc0hhbmRsZXIobmFtZSkpIHJldHVybjtcblxuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgdGhpcy5ldmVudHNbbmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICB9LCB0aGlzKTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBoYW5kbGVyIGhhcyBldmVyIGJlZW4gc3RvcmVkIGFnYWluc3QgYW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gY2hlY2suXG4gKiBAcHJpdmF0ZVxuICogQG1lbWJlck9mIEV2ZW50RW1pdHRlclxuICovXG5lbGFzdGljbHVuci5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmhhc0hhbmRsZXIgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gbmFtZSBpbiB0aGlzLmV2ZW50cztcbn07XG4vKiFcbiAqIGVsYXN0aWNsdW5yLnRva2VuaXplclxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIGZvciBzcGxpdHRpbmcgYSBzdHJpbmcgaW50byB0b2tlbnMuXG4gKiBDdXJyZW50bHkgRW5nbGlzaCBpcyBzdXBwb3J0ZWQgYXMgZGVmYXVsdC5cbiAqIFVzZXMgYGVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3JgIHRvIHNwbGl0IHN0cmluZ3MsIHlvdSBjb3VsZCBjaGFuZ2VcbiAqIHRoZSB2YWx1ZSBvZiB0aGlzIHByb3BlcnR5IHRvIHNldCBob3cgeW91IHdhbnQgc3RyaW5ncyBhcmUgc3BsaXQgaW50byB0b2tlbnMuXG4gKiBJTVBPUlRBTlQ6IHVzZSBlbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yIGNhcmVmdWxseSwgaWYgeW91IGFyZSBub3QgZmFtaWxpYXIgd2l0aFxuICogdGV4dCBwcm9jZXNzLCB0aGVuIHlvdSdkIGJldHRlciBub3QgY2hhbmdlIGl0LlxuICpcbiAqIEBtb2R1bGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0aGF0IHlvdSB3YW50IHRvIHRva2VuaXplLlxuICogQHNlZSBlbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZWxhc3RpY2x1bnIudG9rZW5pemVyID0gZnVuY3Rpb24gKHN0cikge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGggfHwgc3RyID09PSBudWxsIHx8IHN0ciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XG4gIGlmIChBcnJheS5pc0FycmF5KHN0cikpIHtcbiAgICB2YXIgYXJyID0gc3RyLmZpbHRlcihmdW5jdGlvbih0b2tlbikge1xuICAgICAgaWYgKHRva2VuID09PSBudWxsIHx8IHRva2VuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGFyciA9IGFyci5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiBlbGFzdGljbHVuci51dGlscy50b1N0cmluZyh0KS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xuXG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHZhciB0b2tlbnMgPSBpdGVtLnNwbGl0KGVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3IpO1xuICAgICAgb3V0ID0gb3V0LmNvbmNhdCh0b2tlbnMpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHJldHVybiBzdHIudG9TdHJpbmcoKS50cmltKCkudG9Mb3dlckNhc2UoKS5zcGxpdChlbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yKTtcbn07XG5cbi8qKlxuICogRGVmYXVsdCBzdHJpbmcgc2VwZXJhdG9yLlxuICovXG5lbGFzdGljbHVuci50b2tlbml6ZXIuZGVmYXVsdFNlcGVyYXRvciA9IC9bXFxzXFwtXSsvO1xuXG4vKipcbiAqIFRoZSBzcGVyYXRvciB1c2VkIHRvIHNwbGl0IGEgc3RyaW5nIGludG8gdG9rZW5zLiBPdmVycmlkZSB0aGlzIHByb3BlcnR5IHRvIGNoYW5nZSB0aGUgYmVoYXZpb3VyIG9mXG4gKiBgZWxhc3RpY2x1bnIudG9rZW5pemVyYCBiZWhhdmlvdXIgd2hlbiB0b2tlbml6aW5nIHN0cmluZ3MuIEJ5IGRlZmF1bHQgdGhpcyBzcGxpdHMgb24gd2hpdGVzcGFjZSBhbmQgaHlwaGVucy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2VlIGVsYXN0aWNsdW5yLnRva2VuaXplclxuICovXG5lbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yID0gZWxhc3RpY2x1bnIudG9rZW5pemVyLmRlZmF1bHRTZXBlcmF0b3I7XG5cbi8qKlxuICogU2V0IHVwIGN1c3RvbWl6ZWQgc3RyaW5nIHNlcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXAgVGhlIGN1c3RvbWl6ZWQgc2VwZXJhdG9yIHRoYXQgeW91IHdhbnQgdG8gdXNlIHRvIHRva2VuaXplIGEgc3RyaW5nLlxuICovXG5lbGFzdGljbHVuci50b2tlbml6ZXIuc2V0U2VwZXJhdG9yID0gZnVuY3Rpb24oc2VwKSB7XG4gICAgaWYgKHNlcCAhPT0gbnVsbCAmJiBzZXAgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Yoc2VwKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvciA9IHNlcDtcbiAgICB9XG59XG5cbi8qKlxuICogUmVzZXQgc3RyaW5nIHNlcGVyYXRvclxuICpcbiAqL1xuZWxhc3RpY2x1bnIudG9rZW5pemVyLnJlc2V0U2VwZXJhdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvciA9IGVsYXN0aWNsdW5yLnRva2VuaXplci5kZWZhdWx0U2VwZXJhdG9yO1xufVxuXG4vKipcbiAqIEdldCBzdHJpbmcgc2VwZXJhdG9yXG4gKlxuICovXG5lbGFzdGljbHVuci50b2tlbml6ZXIuZ2V0U2VwZXJhdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3I7XG59XG4vKiFcbiAqIGVsYXN0aWNsdW5yLlBpcGVsaW5lXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIGVsYXN0aWNsdW5yLlBpcGVsaW5lcyBtYWludGFpbiBhbiBvcmRlcmVkIGxpc3Qgb2YgZnVuY3Rpb25zIHRvIGJlIGFwcGxpZWQgdG8gXG4gKiBib3RoIGRvY3VtZW50cyB0b2tlbnMgYW5kIHF1ZXJ5IHRva2Vucy5cbiAqXG4gKiBBbiBpbnN0YW5jZSBvZiBlbGFzdGljbHVuci5JbmRleCB3aWxsIGNvbnRhaW4gYSBwaXBlbGluZVxuICogd2l0aCBhIHRyaW1tZXIsIGEgc3RvcCB3b3JkIGZpbHRlciwgYW4gRW5nbGlzaCBzdGVtbWVyLiBFeHRyYVxuICogZnVuY3Rpb25zIGNhbiBiZSBhZGRlZCBiZWZvcmUgb3IgYWZ0ZXIgZWl0aGVyIG9mIHRoZXNlIGZ1bmN0aW9ucyBvciB0aGVzZVxuICogZGVmYXVsdCBmdW5jdGlvbnMgY2FuIGJlIHJlbW92ZWQuXG4gKlxuICogV2hlbiBydW4gdGhlIHBpcGVsaW5lLCBpdCB3aWxsIGNhbGwgZWFjaCBmdW5jdGlvbiBpbiB0dXJuLlxuICpcbiAqIFRoZSBvdXRwdXQgb2YgdGhlIGZ1bmN0aW9ucyBpbiB0aGUgcGlwZWxpbmUgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIG5leHQgZnVuY3Rpb25cbiAqIGluIHRoZSBwaXBlbGluZS4gVG8gZXhjbHVkZSBhIHRva2VuIGZyb20gZW50ZXJpbmcgdGhlIGluZGV4IHRoZSBmdW5jdGlvblxuICogc2hvdWxkIHJldHVybiB1bmRlZmluZWQsIHRoZSByZXN0IG9mIHRoZSBwaXBlbGluZSB3aWxsIG5vdCBiZSBjYWxsZWQgd2l0aFxuICogdGhpcyB0b2tlbi5cbiAqXG4gKiBGb3Igc2VyaWFsaXNhdGlvbiBvZiBwaXBlbGluZXMgdG8gd29yaywgYWxsIGZ1bmN0aW9ucyB1c2VkIGluIGFuIGluc3RhbmNlIG9mXG4gKiBhIHBpcGVsaW5lIHNob3VsZCBiZSByZWdpc3RlcmVkIHdpdGggZWxhc3RpY2x1bnIuUGlwZWxpbmUuIFJlZ2lzdGVyZWQgZnVuY3Rpb25zIGNhblxuICogdGhlbiBiZSBsb2FkZWQuIElmIHRyeWluZyB0byBsb2FkIGEgc2VyaWFsaXNlZCBwaXBlbGluZSB0aGF0IHVzZXMgZnVuY3Rpb25zXG4gKiB0aGF0IGFyZSBub3QgcmVnaXN0ZXJlZCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqXG4gKiBJZiBub3QgcGxhbm5pbmcgb24gc2VyaWFsaXNpbmcgdGhlIHBpcGVsaW5lIHRoZW4gcmVnaXN0ZXJpbmcgcGlwZWxpbmUgZnVuY3Rpb25zXG4gKiBpcyBub3QgbmVjZXNzYXJ5LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fcXVldWUgPSBbXTtcbn07XG5cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyZWRGdW5jdGlvbnMgPSB7fTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIGZ1bmN0aW9uIGluIHRoZSBwaXBlbGluZS5cbiAqXG4gKiBGdW5jdGlvbnMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgcGlwZWxpbmUgc2hvdWxkIGJlIHJlZ2lzdGVyZWQgaWYgdGhlIHBpcGVsaW5lXG4gKiBuZWVkcyB0byBiZSBzZXJpYWxpc2VkLCBvciBhIHNlcmlhbGlzZWQgcGlwZWxpbmUgbmVlZHMgdG8gYmUgbG9hZGVkLlxuICpcbiAqIFJlZ2lzdGVyaW5nIGEgZnVuY3Rpb24gZG9lcyBub3QgYWRkIGl0IHRvIGEgcGlwZWxpbmUsIGZ1bmN0aW9ucyBtdXN0IHN0aWxsIGJlXG4gKiBhZGRlZCB0byBpbnN0YW5jZXMgb2YgdGhlIHBpcGVsaW5lIGZvciB0aGVtIHRvIGJlIHVzZWQgd2hlbiBydW5uaW5nIGEgcGlwZWxpbmUuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyLlxuICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIFRoZSBsYWJlbCB0byByZWdpc3RlciB0aGlzIGZ1bmN0aW9uIHdpdGhcbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlckZ1bmN0aW9uID0gZnVuY3Rpb24gKGZuLCBsYWJlbCkge1xuICBpZiAobGFiZWwgaW4gZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJlZEZ1bmN0aW9ucykge1xuICAgIGVsYXN0aWNsdW5yLnV0aWxzLndhcm4oJ092ZXJ3cml0aW5nIGV4aXN0aW5nIHJlZ2lzdGVyZWQgZnVuY3Rpb246ICcgKyBsYWJlbCk7XG4gIH1cblxuICBmbi5sYWJlbCA9IGxhYmVsO1xuICBlbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlcmVkRnVuY3Rpb25zW2xhYmVsXSA9IGZuO1xufTtcblxuLyoqXG4gKiBHZXQgYSByZWdpc3RlcmVkIGZ1bmN0aW9uIGluIHRoZSBwaXBlbGluZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgVGhlIGxhYmVsIG9mIHJlZ2lzdGVyZWQgZnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5nZXRSZWdpc3RlcmVkRnVuY3Rpb24gPSBmdW5jdGlvbiAobGFiZWwpIHtcbiAgaWYgKChsYWJlbCBpbiBlbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlcmVkRnVuY3Rpb25zKSAhPT0gdHJ1ZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyZWRGdW5jdGlvbnNbbGFiZWxdO1xufTtcblxuLyoqXG4gKiBXYXJucyBpZiB0aGUgZnVuY3Rpb24gaXMgbm90IHJlZ2lzdGVyZWQgYXMgYSBQaXBlbGluZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgZm9yLlxuICogQHByaXZhdGVcbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS53YXJuSWZGdW5jdGlvbk5vdFJlZ2lzdGVyZWQgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdmFyIGlzUmVnaXN0ZXJlZCA9IGZuLmxhYmVsICYmIChmbi5sYWJlbCBpbiB0aGlzLnJlZ2lzdGVyZWRGdW5jdGlvbnMpO1xuXG4gIGlmICghaXNSZWdpc3RlcmVkKSB7XG4gICAgZWxhc3RpY2x1bnIudXRpbHMud2FybignRnVuY3Rpb24gaXMgbm90IHJlZ2lzdGVyZWQgd2l0aCBwaXBlbGluZS4gVGhpcyBtYXkgY2F1c2UgcHJvYmxlbXMgd2hlbiBzZXJpYWxpc2luZyB0aGUgaW5kZXguXFxuJywgZm4pO1xuICB9XG59O1xuXG4vKipcbiAqIExvYWRzIGEgcHJldmlvdXNseSBzZXJpYWxpc2VkIHBpcGVsaW5lLlxuICpcbiAqIEFsbCBmdW5jdGlvbnMgdG8gYmUgbG9hZGVkIG11c3QgYWxyZWFkeSBiZSByZWdpc3RlcmVkIHdpdGggZWxhc3RpY2x1bnIuUGlwZWxpbmUuXG4gKiBJZiBhbnkgZnVuY3Rpb24gZnJvbSB0aGUgc2VyaWFsaXNlZCBkYXRhIGhhcyBub3QgYmVlbiByZWdpc3RlcmVkIHRoZW4gYW5cbiAqIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXJpYWxpc2VkIFRoZSBzZXJpYWxpc2VkIHBpcGVsaW5lIHRvIGxvYWQuXG4gKiBAcmV0dXJuIHtlbGFzdGljbHVuci5QaXBlbGluZX1cbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5sb2FkID0gZnVuY3Rpb24gKHNlcmlhbGlzZWQpIHtcbiAgdmFyIHBpcGVsaW5lID0gbmV3IGVsYXN0aWNsdW5yLlBpcGVsaW5lO1xuXG4gIHNlcmlhbGlzZWQuZm9yRWFjaChmdW5jdGlvbiAoZm5OYW1lKSB7XG4gICAgdmFyIGZuID0gZWxhc3RpY2x1bnIuUGlwZWxpbmUuZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uKGZuTmFtZSk7XG5cbiAgICBpZiAoZm4pIHtcbiAgICAgIHBpcGVsaW5lLmFkZChmbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxvYWQgdW4tcmVnaXN0ZXJlZCBmdW5jdGlvbjogJyArIGZuTmFtZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGlwZWxpbmU7XG59O1xuXG4vKipcbiAqIEFkZHMgbmV3IGZ1bmN0aW9ucyB0byB0aGUgZW5kIG9mIHRoZSBwaXBlbGluZS5cbiAqXG4gKiBMb2dzIGEgd2FybmluZyBpZiB0aGUgZnVuY3Rpb24gaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb25zIEFueSBudW1iZXIgb2YgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGUgcGlwZWxpbmUuXG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgZm5zLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgZWxhc3RpY2x1bnIuUGlwZWxpbmUud2FybklmRnVuY3Rpb25Ob3RSZWdpc3RlcmVkKGZuKTtcbiAgICB0aGlzLl9xdWV1ZS5wdXNoKGZuKTtcbiAgfSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBzaW5nbGUgZnVuY3Rpb24gYWZ0ZXIgYSBmdW5jdGlvbiB0aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoZVxuICogcGlwZWxpbmUuXG4gKlxuICogTG9ncyBhIHdhcm5pbmcgaWYgdGhlIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiByZWdpc3RlcmVkLlxuICogSWYgZXhpc3RpbmdGbiBpcyBub3QgZm91bmQsIHRocm93IGFuIEV4Y2VwdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGlzdGluZ0ZuIEEgZnVuY3Rpb24gdGhhdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgcGlwZWxpbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXdGbiBUaGUgbmV3IGZ1bmN0aW9uIHRvIGFkZCB0byB0aGUgcGlwZWxpbmUuXG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUucHJvdG90eXBlLmFmdGVyID0gZnVuY3Rpb24gKGV4aXN0aW5nRm4sIG5ld0ZuKSB7XG4gIGVsYXN0aWNsdW5yLlBpcGVsaW5lLndhcm5JZkZ1bmN0aW9uTm90UmVnaXN0ZXJlZChuZXdGbik7XG5cbiAgdmFyIHBvcyA9IHRoaXMuX3F1ZXVlLmluZGV4T2YoZXhpc3RpbmdGbik7XG4gIGlmIChwb3MgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmluZCBleGlzdGluZ0ZuJyk7XG4gIH1cblxuICB0aGlzLl9xdWV1ZS5zcGxpY2UocG9zICsgMSwgMCwgbmV3Rm4pO1xufTtcblxuLyoqXG4gKiBBZGRzIGEgc2luZ2xlIGZ1bmN0aW9uIGJlZm9yZSBhIGZ1bmN0aW9uIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlXG4gKiBwaXBlbGluZS5cbiAqXG4gKiBMb2dzIGEgd2FybmluZyBpZiB0aGUgZnVuY3Rpb24gaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQuXG4gKiBJZiBleGlzdGluZ0ZuIGlzIG5vdCBmb3VuZCwgdGhyb3cgYW4gRXhjZXB0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4aXN0aW5nRm4gQSBmdW5jdGlvbiB0aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBwaXBlbGluZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG5ld0ZuIFRoZSBuZXcgZnVuY3Rpb24gdG8gYWRkIHRvIHRoZSBwaXBlbGluZS5cbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5wcm90b3R5cGUuYmVmb3JlID0gZnVuY3Rpb24gKGV4aXN0aW5nRm4sIG5ld0ZuKSB7XG4gIGVsYXN0aWNsdW5yLlBpcGVsaW5lLndhcm5JZkZ1bmN0aW9uTm90UmVnaXN0ZXJlZChuZXdGbik7XG5cbiAgdmFyIHBvcyA9IHRoaXMuX3F1ZXVlLmluZGV4T2YoZXhpc3RpbmdGbik7XG4gIGlmIChwb3MgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmluZCBleGlzdGluZ0ZuJyk7XG4gIH1cblxuICB0aGlzLl9xdWV1ZS5zcGxpY2UocG9zLCAwLCBuZXdGbik7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYSBmdW5jdGlvbiBmcm9tIHRoZSBwaXBlbGluZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gcmVtb3ZlIGZyb20gdGhlIHBpcGVsaW5lLlxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdmFyIHBvcyA9IHRoaXMuX3F1ZXVlLmluZGV4T2YoZm4pO1xuICBpZiAocG9zID09PSAtMSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX3F1ZXVlLnNwbGljZShwb3MsIDEpO1xufTtcblxuLyoqXG4gKiBSdW5zIHRoZSBjdXJyZW50IGxpc3Qgb2YgZnVuY3Rpb25zIHRoYXQgcmVnaXN0ZXJlZCBpbiB0aGUgcGlwZWxpbmUgYWdhaW5zdCB0aGVcbiAqIGlucHV0IHRva2Vucy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnMgVGhlIHRva2VucyB0byBydW4gdGhyb3VnaCB0aGUgcGlwZWxpbmUuXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKHRva2Vucykge1xuICB2YXIgb3V0ID0gW10sXG4gICAgICB0b2tlbkxlbmd0aCA9IHRva2Vucy5sZW5ndGgsXG4gICAgICBwaXBlbGluZUxlbmd0aCA9IHRoaXMuX3F1ZXVlLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2VuTGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBpcGVsaW5lTGVuZ3RoOyBqKyspIHtcbiAgICAgIHRva2VuID0gdGhpcy5fcXVldWVbal0odG9rZW4sIGksIHRva2Vucyk7XG4gICAgICBpZiAodG9rZW4gPT09IHZvaWQgMCB8fCB0b2tlbiA9PT0gbnVsbCkgYnJlYWs7XG4gICAgfTtcblxuICAgIGlmICh0b2tlbiAhPT0gdm9pZCAwICYmIHRva2VuICE9PSBudWxsKSBvdXQucHVzaCh0b2tlbik7XG4gIH07XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmVzZXRzIHRoZSBwaXBlbGluZSBieSByZW1vdmluZyBhbnkgZXhpc3RpbmcgcHJvY2Vzc29ycy5cbiAqXG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9xdWV1ZSA9IFtdO1xufTtcblxuIC8qKlxuICAqIEdldCB0aGUgcGlwZWxpbmUgaWYgdXNlciB3YW50IHRvIGNoZWNrIHRoZSBwaXBlbGluZS5cbiAgKlxuICAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICAqL1xuIGVsYXN0aWNsdW5yLlBpcGVsaW5lLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICByZXR1cm4gdGhpcy5fcXVldWU7XG4gfTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIHBpcGVsaW5lIHJlYWR5IGZvciBzZXJpYWxpc2F0aW9uLlxuICogT25seSBzZXJpYWxpemUgcGlwZWxpbmUgZnVuY3Rpb24ncyBuYW1lLiBOb3Qgc3RvcmluZyBmdW5jdGlvbiwgc28gd2hlblxuICogbG9hZGluZyB0aGUgYXJjaGl2ZWQgSlNPTiBpbmRleCBmaWxlLCBjb3JyZXNwb25kaW5nIHBpcGVsaW5lIGZ1bmN0aW9uIGlzIFxuICogYWRkZWQgYnkgcmVnaXN0ZXJlZCBmdW5jdGlvbiBvZiBlbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlcmVkRnVuY3Rpb25zXG4gKlxuICogTG9ncyBhIHdhcm5pbmcgaWYgdGhlIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiByZWdpc3RlcmVkLlxuICpcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9xdWV1ZS5tYXAoZnVuY3Rpb24gKGZuKSB7XG4gICAgZWxhc3RpY2x1bnIuUGlwZWxpbmUud2FybklmRnVuY3Rpb25Ob3RSZWdpc3RlcmVkKGZuKTtcbiAgICByZXR1cm4gZm4ubGFiZWw7XG4gIH0pO1xufTtcbi8qIVxuICogZWxhc3RpY2x1bnIuSW5kZXhcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogZWxhc3RpY2x1bnIuSW5kZXggaXMgb2JqZWN0IHRoYXQgbWFuYWdlcyBhIHNlYXJjaCBpbmRleC4gIEl0IGNvbnRhaW5zIHRoZSBpbmRleGVzXG4gKiBhbmQgc3RvcmVzIGFsbCB0aGUgdG9rZW5zIGFuZCBkb2N1bWVudCBsb29rdXBzLiAgSXQgYWxzbyBwcm92aWRlcyB0aGUgbWFpblxuICogdXNlciBmYWNpbmcgQVBJIGZvciB0aGUgbGlicmFyeS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXggPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2ZpZWxkcyA9IFtdO1xuICB0aGlzLl9yZWYgPSAnaWQnO1xuICB0aGlzLnBpcGVsaW5lID0gbmV3IGVsYXN0aWNsdW5yLlBpcGVsaW5lO1xuICB0aGlzLmRvY3VtZW50U3RvcmUgPSBuZXcgZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZTtcbiAgdGhpcy5pbmRleCA9IHt9O1xuICB0aGlzLmV2ZW50RW1pdHRlciA9IG5ldyBlbGFzdGljbHVuci5FdmVudEVtaXR0ZXI7XG4gIHRoaXMuX2lkZkNhY2hlID0ge307XG5cbiAgdGhpcy5vbignYWRkJywgJ3JlbW92ZScsICd1cGRhdGUnLCAoZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2lkZkNhY2hlID0ge307XG4gIH0pLmJpbmQodGhpcykpO1xufTtcblxuLyoqXG4gKiBCaW5kIGEgaGFuZGxlciB0byBldmVudHMgYmVpbmcgZW1pdHRlZCBieSB0aGUgaW5kZXguXG4gKlxuICogVGhlIGhhbmRsZXIgY2FuIGJlIGJvdW5kIHRvIG1hbnkgZXZlbnRzIGF0IHRoZSBzYW1lIHRpbWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFtldmVudE5hbWVdIFRoZSBuYW1lKHMpIG9mIGV2ZW50cyB0byBiaW5kIHRoZSBmdW5jdGlvbiB0by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBzZXJpYWxpc2VkIHNldCB0byBsb2FkLlxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIuYWRkTGlzdGVuZXIuYXBwbHkodGhpcy5ldmVudEVtaXR0ZXIsIGFyZ3MpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgaGFuZGxlciBmcm9tIGFuIGV2ZW50IGJlaW5nIGVtaXR0ZWQgYnkgdGhlIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgZXZlbnRzIHRvIHJlbW92ZSB0aGUgZnVuY3Rpb24gZnJvbS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBzZXJpYWxpc2VkIHNldCB0byBsb2FkLlxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAobmFtZSwgZm4pIHtcbiAgcmV0dXJuIHRoaXMuZXZlbnRFbWl0dGVyLnJlbW92ZUxpc3RlbmVyKG5hbWUsIGZuKTtcbn07XG5cbi8qKlxuICogTG9hZHMgYSBwcmV2aW91c2x5IHNlcmlhbGlzZWQgaW5kZXguXG4gKlxuICogSXNzdWVzIGEgd2FybmluZyBpZiB0aGUgaW5kZXggYmVpbmcgaW1wb3J0ZWQgd2FzIHNlcmlhbGlzZWRcbiAqIGJ5IGEgZGlmZmVyZW50IHZlcnNpb24gb2YgZWxhc3RpY2x1bnIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNlcmlhbGlzZWREYXRhIFRoZSBzZXJpYWxpc2VkIHNldCB0byBsb2FkLlxuICogQHJldHVybiB7ZWxhc3RpY2x1bnIuSW5kZXh9XG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgubG9hZCA9IGZ1bmN0aW9uIChzZXJpYWxpc2VkRGF0YSkge1xuICBpZiAoc2VyaWFsaXNlZERhdGEudmVyc2lvbiAhPT0gZWxhc3RpY2x1bnIudmVyc2lvbikge1xuICAgIGVsYXN0aWNsdW5yLnV0aWxzLndhcm4oJ3ZlcnNpb24gbWlzbWF0Y2g6IGN1cnJlbnQgJ1xuICAgICAgICAgICAgICAgICAgICArIGVsYXN0aWNsdW5yLnZlcnNpb24gKyAnIGltcG9ydGluZyAnICsgc2VyaWFsaXNlZERhdGEudmVyc2lvbik7XG4gIH1cblxuICB2YXIgaWR4ID0gbmV3IHRoaXM7XG5cbiAgaWR4Ll9maWVsZHMgPSBzZXJpYWxpc2VkRGF0YS5maWVsZHM7XG4gIGlkeC5fcmVmID0gc2VyaWFsaXNlZERhdGEucmVmO1xuICBpZHguZG9jdW1lbnRTdG9yZSA9IGVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUubG9hZChzZXJpYWxpc2VkRGF0YS5kb2N1bWVudFN0b3JlKTtcbiAgaWR4LnBpcGVsaW5lID0gZWxhc3RpY2x1bnIuUGlwZWxpbmUubG9hZChzZXJpYWxpc2VkRGF0YS5waXBlbGluZSk7XG4gIGlkeC5pbmRleCA9IHt9O1xuICBmb3IgKHZhciBmaWVsZCBpbiBzZXJpYWxpc2VkRGF0YS5pbmRleCkge1xuICAgIGlkeC5pbmRleFtmaWVsZF0gPSBlbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LmxvYWQoc2VyaWFsaXNlZERhdGEuaW5kZXhbZmllbGRdKTtcbiAgfVxuXG4gIHJldHVybiBpZHg7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBmaWVsZCB0byB0aGUgbGlzdCBvZiBmaWVsZHMgdGhhdCB3aWxsIGJlIHNlYXJjaGFibGUgd2l0aGluIGRvY3VtZW50cyBpbiB0aGUgaW5kZXguXG4gKlxuICogUmVtZW1iZXIgdGhhdCBpbm5lciBpbmRleCBpcyBidWlsZCBiYXNlZCBvbiBmaWVsZCwgd2hpY2ggbWVhbnMgZWFjaCBmaWVsZCBoYXMgb25lIGludmVydGVkIGluZGV4LlxuICpcbiAqIEZpZWxkcyBzaG91bGQgYmUgYWRkZWQgYmVmb3JlIGFueSBkb2N1bWVudHMgYXJlIGFkZGVkIHRvIHRoZSBpbmRleCwgZmllbGRzXG4gKiB0aGF0IGFyZSBhZGRlZCBhZnRlciBkb2N1bWVudHMgYXJlIGFkZGVkIHRvIHRoZSBpbmRleCB3aWxsIG9ubHkgYXBwbHkgdG8gbmV3XG4gKiBkb2N1bWVudHMgYWRkZWQgdG8gdGhlIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZE5hbWUgVGhlIG5hbWUgb2YgdGhlIGZpZWxkIHdpdGhpbiB0aGUgZG9jdW1lbnQgdGhhdCBzaG91bGQgYmUgaW5kZXhlZFxuICogQHJldHVybiB7ZWxhc3RpY2x1bnIuSW5kZXh9XG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLmFkZEZpZWxkID0gZnVuY3Rpb24gKGZpZWxkTmFtZSkge1xuICB0aGlzLl9maWVsZHMucHVzaChmaWVsZE5hbWUpO1xuICB0aGlzLmluZGV4W2ZpZWxkTmFtZV0gPSBuZXcgZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHByb3BlcnR5IHVzZWQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgZG9jdW1lbnRzIGFkZGVkIHRvIHRoZSBpbmRleCxcbiAqIGJ5IGRlZmF1bHQgdGhpcyBwcm9wZXJ0eSBpcyAnaWQnLlxuICpcbiAqIFRoaXMgc2hvdWxkIG9ubHkgYmUgY2hhbmdlZCBiZWZvcmUgYWRkaW5nIGRvY3VtZW50cyB0byB0aGUgaW5kZXgsIGNoYW5naW5nXG4gKiB0aGUgcmVmIHByb3BlcnR5IHdpdGhvdXQgcmVzZXR0aW5nIHRoZSBpbmRleCBjYW4gbGVhZCB0byB1bmV4cGVjdGVkIHJlc3VsdHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZk5hbWUgVGhlIHByb3BlcnR5IHRvIHVzZSB0byB1bmlxdWVseSBpZGVudGlmeSB0aGVcbiAqIGRvY3VtZW50cyBpbiB0aGUgaW5kZXguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVtaXRFdmVudCBXaGV0aGVyIHRvIGVtaXQgYWRkIGV2ZW50cywgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQHJldHVybiB7ZWxhc3RpY2x1bnIuSW5kZXh9XG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLnNldFJlZiA9IGZ1bmN0aW9uIChyZWZOYW1lKSB7XG4gIHRoaXMuX3JlZiA9IHJlZk5hbWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKlxuICogU2V0IGlmIHRoZSBKU09OIGZvcm1hdCBvcmlnaW5hbCBkb2N1bWVudHMgYXJlIHNhdmUgaW50byBlbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlXG4gKlxuICogRGVmYXVsdGx5IHNhdmUgYWxsIHRoZSBvcmlnaW5hbCBKU09OIGRvY3VtZW50cy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHNhdmUgV2hldGhlciB0byBzYXZlIHRoZSBvcmlnaW5hbCBKU09OIGRvY3VtZW50cy5cbiAqIEByZXR1cm4ge2VsYXN0aWNsdW5yLkluZGV4fVxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5zYXZlRG9jdW1lbnQgPSBmdW5jdGlvbiAoc2F2ZSkge1xuICB0aGlzLmRvY3VtZW50U3RvcmUgPSBuZXcgZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZShzYXZlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhIEpTT04gZm9ybWF0IGRvY3VtZW50IHRvIHRoZSBpbmRleC5cbiAqXG4gKiBUaGlzIGlzIHRoZSB3YXkgbmV3IGRvY3VtZW50cyBlbnRlciB0aGUgaW5kZXgsIHRoaXMgZnVuY3Rpb24gd2lsbCBydW4gdGhlXG4gKiBmaWVsZHMgZnJvbSB0aGUgZG9jdW1lbnQgdGhyb3VnaCB0aGUgaW5kZXgncyBwaXBlbGluZSBhbmQgdGhlbiBhZGQgaXQgdG9cbiAqIHRoZSBpbmRleCwgaXQgd2lsbCB0aGVuIHNob3cgdXAgaW4gc2VhcmNoIHJlc3VsdHMuXG4gKlxuICogQW4gJ2FkZCcgZXZlbnQgaXMgZW1pdHRlZCB3aXRoIHRoZSBkb2N1bWVudCB0aGF0IGhhcyBiZWVuIGFkZGVkIGFuZCB0aGUgaW5kZXhcbiAqIHRoZSBkb2N1bWVudCBoYXMgYmVlbiBhZGRlZCB0by4gVGhpcyBldmVudCBjYW4gYmUgc2lsZW5jZWQgYnkgcGFzc2luZyBmYWxzZVxuICogYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byBhZGQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRvYyBUaGUgSlNPTiBmb3JtYXQgZG9jdW1lbnQgdG8gYWRkIHRvIHRoZSBpbmRleC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZW1pdEV2ZW50IFdoZXRoZXIgb3Igbm90IHRvIGVtaXQgZXZlbnRzLCBkZWZhdWx0IHRydWUuXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLmFkZERvYyA9IGZ1bmN0aW9uIChkb2MsIGVtaXRFdmVudCkge1xuICBpZiAoIWRvYykgcmV0dXJuO1xuICB2YXIgZW1pdEV2ZW50ID0gZW1pdEV2ZW50ID09PSB1bmRlZmluZWQgPyB0cnVlIDogZW1pdEV2ZW50O1xuXG4gIHZhciBkb2NSZWYgPSBkb2NbdGhpcy5fcmVmXTtcblxuICB0aGlzLmRvY3VtZW50U3RvcmUuYWRkRG9jKGRvY1JlZiwgZG9jKTtcbiAgdGhpcy5fZmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgdmFyIGZpZWxkVG9rZW5zID0gdGhpcy5waXBlbGluZS5ydW4oZWxhc3RpY2x1bnIudG9rZW5pemVyKGRvY1tmaWVsZF0pKTtcbiAgICB0aGlzLmRvY3VtZW50U3RvcmUuYWRkRmllbGRMZW5ndGgoZG9jUmVmLCBmaWVsZCwgZmllbGRUb2tlbnMubGVuZ3RoKTtcblxuICAgIHZhciB0b2tlbkNvdW50ID0ge307XG4gICAgZmllbGRUb2tlbnMuZm9yRWFjaChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgIGlmICh0b2tlbiBpbiB0b2tlbkNvdW50KSB0b2tlbkNvdW50W3Rva2VuXSArPSAxO1xuICAgICAgZWxzZSB0b2tlbkNvdW50W3Rva2VuXSA9IDE7XG4gICAgfSwgdGhpcyk7XG5cbiAgICBmb3IgKHZhciB0b2tlbiBpbiB0b2tlbkNvdW50KSB7XG4gICAgICB2YXIgdGVybUZyZXF1ZW5jeSA9IHRva2VuQ291bnRbdG9rZW5dO1xuICAgICAgdGVybUZyZXF1ZW5jeSA9IE1hdGguc3FydCh0ZXJtRnJlcXVlbmN5KTtcbiAgICAgIHRoaXMuaW5kZXhbZmllbGRdLmFkZFRva2VuKHRva2VuLCB7IHJlZjogZG9jUmVmLCB0ZjogdGVybUZyZXF1ZW5jeSB9KTtcbiAgICB9XG4gIH0sIHRoaXMpO1xuXG4gIGlmIChlbWl0RXZlbnQpIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoJ2FkZCcsIGRvYywgdGhpcyk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYSBkb2N1bWVudCBmcm9tIHRoZSBpbmRleCBieSBkb2MgcmVmLlxuICpcbiAqIFRvIG1ha2Ugc3VyZSBkb2N1bWVudHMgbm8gbG9uZ2VyIHNob3cgdXAgaW4gc2VhcmNoIHJlc3VsdHMgdGhleSBjYW4gYmVcbiAqIHJlbW92ZWQgZnJvbSB0aGUgaW5kZXggdXNpbmcgdGhpcyBtZXRob2QuXG4gKlxuICogQSAncmVtb3ZlJyBldmVudCBpcyBlbWl0dGVkIHdpdGggdGhlIGRvY3VtZW50IHRoYXQgaGFzIGJlZW4gcmVtb3ZlZCBhbmQgdGhlIGluZGV4XG4gKiB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tLiBUaGlzIGV2ZW50IGNhbiBiZSBzaWxlbmNlZCBieSBwYXNzaW5nIGZhbHNlXG4gKiBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIHJlbW92ZS5cbiAqXG4gKiBJZiB1c2VyIHNldHRpbmcgRG9jdW1lbnRTdG9yZSBub3Qgc3RvcmluZyB0aGUgZG9jdW1lbnRzLCB0aGVuIHJlbW92ZSBkb2MgYnkgZG9jUmVmIGlzIG5vdCBhbGxvd2VkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEludGVnZXJ9IGRvY1JlZiBUaGUgZG9jdW1lbnQgcmVmIHRvIHJlbW92ZSBmcm9tIHRoZSBpbmRleC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZW1pdEV2ZW50IFdoZXRoZXIgdG8gZW1pdCByZW1vdmUgZXZlbnRzLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLnJlbW92ZURvY0J5UmVmID0gZnVuY3Rpb24gKGRvY1JlZiwgZW1pdEV2ZW50KSB7XG4gIGlmICghZG9jUmVmKSByZXR1cm47XG4gIGlmICh0aGlzLmRvY3VtZW50U3RvcmUuaXNEb2NTdG9yZWQoKSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIXRoaXMuZG9jdW1lbnRTdG9yZS5oYXNEb2MoZG9jUmVmKSkgcmV0dXJuO1xuICB2YXIgZG9jID0gdGhpcy5kb2N1bWVudFN0b3JlLmdldERvYyhkb2NSZWYpO1xuICB0aGlzLnJlbW92ZURvYyhkb2MsIGZhbHNlKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIGRvY3VtZW50IGZyb20gdGhlIGluZGV4LlxuICogVGhpcyByZW1vdmUgb3BlcmF0aW9uIGNvdWxkIHdvcmsgZXZlbiB0aGUgb3JpZ2luYWwgZG9jIGlzIG5vdCBzdG9yZSBpbiB0aGUgRG9jdW1lbnRTdG9yZS5cbiAqXG4gKiBUbyBtYWtlIHN1cmUgZG9jdW1lbnRzIG5vIGxvbmdlciBzaG93IHVwIGluIHNlYXJjaCByZXN1bHRzIHRoZXkgY2FuIGJlXG4gKiByZW1vdmVkIGZyb20gdGhlIGluZGV4IHVzaW5nIHRoaXMgbWV0aG9kLlxuICpcbiAqIEEgJ3JlbW92ZScgZXZlbnQgaXMgZW1pdHRlZCB3aXRoIHRoZSBkb2N1bWVudCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQgYW5kIHRoZSBpbmRleFxuICogdGhlIGRvY3VtZW50IGhhcyBiZWVuIHJlbW92ZWQgZnJvbS4gVGhpcyBldmVudCBjYW4gYmUgc2lsZW5jZWQgYnkgcGFzc2luZyBmYWxzZVxuICogYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byByZW1vdmUuXG4gKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2MgVGhlIGRvY3VtZW50IHJlZiB0byByZW1vdmUgZnJvbSB0aGUgaW5kZXguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVtaXRFdmVudCBXaGV0aGVyIHRvIGVtaXQgcmVtb3ZlIGV2ZW50cywgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5yZW1vdmVEb2MgPSBmdW5jdGlvbiAoZG9jLCBlbWl0RXZlbnQpIHtcbiAgaWYgKCFkb2MpIHJldHVybjtcblxuICB2YXIgZW1pdEV2ZW50ID0gZW1pdEV2ZW50ID09PSB1bmRlZmluZWQgPyB0cnVlIDogZW1pdEV2ZW50O1xuXG4gIHZhciBkb2NSZWYgPSBkb2NbdGhpcy5fcmVmXTtcbiAgaWYgKCF0aGlzLmRvY3VtZW50U3RvcmUuaGFzRG9jKGRvY1JlZikpIHJldHVybjtcblxuICB0aGlzLmRvY3VtZW50U3RvcmUucmVtb3ZlRG9jKGRvY1JlZik7XG5cbiAgdGhpcy5fZmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgdmFyIGZpZWxkVG9rZW5zID0gdGhpcy5waXBlbGluZS5ydW4oZWxhc3RpY2x1bnIudG9rZW5pemVyKGRvY1tmaWVsZF0pKTtcbiAgICBmaWVsZFRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgdGhpcy5pbmRleFtmaWVsZF0ucmVtb3ZlVG9rZW4odG9rZW4sIGRvY1JlZik7XG4gICAgfSwgdGhpcyk7XG4gIH0sIHRoaXMpO1xuXG4gIGlmIChlbWl0RXZlbnQpIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoJ3JlbW92ZScsIGRvYywgdGhpcyk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgYSBkb2N1bWVudCBpbiB0aGUgaW5kZXguXG4gKlxuICogV2hlbiBhIGRvY3VtZW50IGNvbnRhaW5lZCB3aXRoaW4gdGhlIGluZGV4IGdldHMgdXBkYXRlZCwgZmllbGRzIGNoYW5nZWQsXG4gKiBhZGRlZCBvciByZW1vdmVkLCB0byBtYWtlIHN1cmUgaXQgY29ycmVjdGx5IG1hdGNoZWQgYWdhaW5zdCBzZWFyY2ggcXVlcmllcyxcbiAqIGl0IHNob3VsZCBiZSB1cGRhdGVkIGluIHRoZSBpbmRleC5cbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBqdXN0IGEgd3JhcHBlciBhcm91bmQgYHJlbW92ZWAgYW5kIGBhZGRgXG4gKlxuICogQW4gJ3VwZGF0ZScgZXZlbnQgaXMgZW1pdHRlZCB3aXRoIHRoZSBkb2N1bWVudCB0aGF0IGhhcyBiZWVuIHVwZGF0ZWQgYW5kIHRoZSBpbmRleC5cbiAqIFRoaXMgZXZlbnQgY2FuIGJlIHNpbGVuY2VkIGJ5IHBhc3NpbmcgZmFsc2UgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byB1cGRhdGUuIE9ubHlcbiAqIGFuIHVwZGF0ZSBldmVudCB3aWxsIGJlIGZpcmVkLCB0aGUgJ2FkZCcgYW5kICdyZW1vdmUnIGV2ZW50cyBvZiB0aGUgdW5kZXJseWluZyBjYWxsc1xuICogYXJlIHNpbGVuY2VkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2MgVGhlIGRvY3VtZW50IHRvIHVwZGF0ZSBpbiB0aGUgaW5kZXguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVtaXRFdmVudCBXaGV0aGVyIHRvIGVtaXQgdXBkYXRlIGV2ZW50cywgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQHNlZSBJbmRleC5wcm90b3R5cGUucmVtb3ZlXG4gKiBAc2VlIEluZGV4LnByb3RvdHlwZS5hZGRcbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUudXBkYXRlRG9jID0gZnVuY3Rpb24gKGRvYywgZW1pdEV2ZW50KSB7XG4gIHZhciBlbWl0RXZlbnQgPSBlbWl0RXZlbnQgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBlbWl0RXZlbnQ7XG5cbiAgdGhpcy5yZW1vdmVEb2NCeVJlZihkb2NbdGhpcy5fcmVmXSwgZmFsc2UpO1xuICB0aGlzLmFkZERvYyhkb2MsIGZhbHNlKTtcblxuICBpZiAoZW1pdEV2ZW50KSB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCd1cGRhdGUnLCBkb2MsIHRoaXMpO1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBpbnZlcnNlIGRvY3VtZW50IGZyZXF1ZW5jeSBmb3IgYSB0b2tlbiB3aXRoaW4gdGhlIGluZGV4IG9mIGEgZmllbGQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBjYWxjdWxhdGUgdGhlIGlkZiBvZi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZCBUaGUgZmllbGQgdG8gY29tcHV0ZSBpZGYuXG4gKiBAc2VlIEluZGV4LnByb3RvdHlwZS5pZGZcbiAqIEBwcml2YXRlXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLmlkZiA9IGZ1bmN0aW9uICh0ZXJtLCBmaWVsZCkge1xuICB2YXIgY2FjaGVLZXkgPSBcIkBcIiArIGZpZWxkICsgJy8nICsgdGVybTtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9pZGZDYWNoZSwgY2FjaGVLZXkpKSByZXR1cm4gdGhpcy5faWRmQ2FjaGVbY2FjaGVLZXldO1xuXG4gIHZhciBkZiA9IHRoaXMuaW5kZXhbZmllbGRdLmdldERvY0ZyZXEodGVybSk7XG4gIHZhciBpZGYgPSAxICsgTWF0aC5sb2codGhpcy5kb2N1bWVudFN0b3JlLmxlbmd0aCAvIChkZiArIDEpKTtcbiAgdGhpcy5faWRmQ2FjaGVbY2FjaGVLZXldID0gaWRmO1xuXG4gIHJldHVybiBpZGY7XG59O1xuXG4vKipcbiAqIGdldCBmaWVsZHMgb2YgY3VycmVudCBpbmRleCBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuZ2V0RmllbGRzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fZmllbGRzLnNsaWNlKCk7XG59O1xuXG4vKipcbiAqIFNlYXJjaGVzIHRoZSBpbmRleCB1c2luZyB0aGUgcGFzc2VkIHF1ZXJ5LlxuICogUXVlcmllcyBzaG91bGQgYmUgYSBzdHJpbmcsIG11bHRpcGxlIHdvcmRzIGFyZSBhbGxvd2VkLlxuICpcbiAqIElmIGNvbmZpZyBpcyBudWxsLCB3aWxsIHNlYXJjaCBhbGwgZmllbGRzIGRlZmF1bHRseSwgYW5kIGxlYWQgdG8gT1IgYmFzZWQgcXVlcnkuXG4gKiBJZiBjb25maWcgaXMgc3BlY2lmaWVkLCB3aWxsIHNlYXJjaCBzcGVjaWZpZWQgd2l0aCBxdWVyeSB0aW1lIGJvb3N0aW5nLlxuICpcbiAqIEFsbCBxdWVyeSB0b2tlbnMgYXJlIHBhc3NlZCB0aHJvdWdoIHRoZSBzYW1lIHBpcGVsaW5lIHRoYXQgZG9jdW1lbnQgdG9rZW5zXG4gKiBhcmUgcGFzc2VkIHRocm91Z2gsIHNvIGFueSBsYW5ndWFnZSBwcm9jZXNzaW5nIGludm9sdmVkIHdpbGwgYmUgcnVuIG9uIGV2ZXJ5XG4gKiBxdWVyeSB0ZXJtLlxuICpcbiAqIEVhY2ggcXVlcnkgdGVybSBpcyBleHBhbmRlZCwgc28gdGhhdCB0aGUgdGVybSAnaGUnIG1pZ2h0IGJlIGV4cGFuZGVkIHRvXG4gKiAnaGVsbG8nIGFuZCAnaGVscCcgaWYgdGhvc2UgdGVybXMgd2VyZSBhbHJlYWR5IGluY2x1ZGVkIGluIHRoZSBpbmRleC5cbiAqXG4gKiBNYXRjaGluZyBkb2N1bWVudHMgYXJlIHJldHVybmVkIGFzIGFuIGFycmF5IG9mIG9iamVjdHMsIGVhY2ggb2JqZWN0IGNvbnRhaW5zXG4gKiB0aGUgbWF0Y2hpbmcgZG9jdW1lbnQgcmVmLCBhcyBzZXQgZm9yIHRoaXMgaW5kZXgsIGFuZCB0aGUgc2ltaWxhcml0eSBzY29yZVxuICogZm9yIHRoaXMgZG9jdW1lbnQgYWdhaW5zdCB0aGUgcXVlcnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5IFRoZSBxdWVyeSB0byBzZWFyY2ggdGhlIGluZGV4IHdpdGguXG4gKiBAcGFyYW0ge0pTT059IHVzZXJDb25maWcgVGhlIHVzZXIgcXVlcnkgY29uZmlnLCBKU09OIGZvcm1hdC5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBzZWUgSW5kZXgucHJvdG90eXBlLmlkZlxuICogQHNlZSBJbmRleC5wcm90b3R5cGUuZG9jdW1lbnRWZWN0b3JcbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24gKHF1ZXJ5LCB1c2VyQ29uZmlnKSB7XG4gIGlmICghcXVlcnkpIHJldHVybiBbXTtcblxuICB2YXIgY29uZmlnU3RyID0gbnVsbDtcbiAgaWYgKHVzZXJDb25maWcgIT0gbnVsbCkge1xuICAgIGNvbmZpZ1N0ciA9IEpTT04uc3RyaW5naWZ5KHVzZXJDb25maWcpO1xuICB9XG5cbiAgdmFyIGNvbmZpZyA9IG5ldyBlbGFzdGljbHVuci5Db25maWd1cmF0aW9uKGNvbmZpZ1N0ciwgdGhpcy5nZXRGaWVsZHMoKSkuZ2V0KCk7XG5cbiAgdmFyIHF1ZXJ5VG9rZW5zID0gdGhpcy5waXBlbGluZS5ydW4oZWxhc3RpY2x1bnIudG9rZW5pemVyKHF1ZXJ5KSk7XG5cbiAgdmFyIHF1ZXJ5UmVzdWx0cyA9IHt9O1xuXG4gIGZvciAodmFyIGZpZWxkIGluIGNvbmZpZykge1xuICAgIHZhciBmaWVsZFNlYXJjaFJlc3VsdHMgPSB0aGlzLmZpZWxkU2VhcmNoKHF1ZXJ5VG9rZW5zLCBmaWVsZCwgY29uZmlnKTtcbiAgICB2YXIgZmllbGRCb29zdCA9IGNvbmZpZ1tmaWVsZF0uYm9vc3Q7XG5cbiAgICBmb3IgKHZhciBkb2NSZWYgaW4gZmllbGRTZWFyY2hSZXN1bHRzKSB7XG4gICAgICBmaWVsZFNlYXJjaFJlc3VsdHNbZG9jUmVmXSA9IGZpZWxkU2VhcmNoUmVzdWx0c1tkb2NSZWZdICogZmllbGRCb29zdDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBkb2NSZWYgaW4gZmllbGRTZWFyY2hSZXN1bHRzKSB7XG4gICAgICBpZiAoZG9jUmVmIGluIHF1ZXJ5UmVzdWx0cykge1xuICAgICAgICBxdWVyeVJlc3VsdHNbZG9jUmVmXSArPSBmaWVsZFNlYXJjaFJlc3VsdHNbZG9jUmVmXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5UmVzdWx0c1tkb2NSZWZdID0gZmllbGRTZWFyY2hSZXN1bHRzW2RvY1JlZl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgZm9yICh2YXIgZG9jUmVmIGluIHF1ZXJ5UmVzdWx0cykge1xuICAgIHJlc3VsdHMucHVzaCh7cmVmOiBkb2NSZWYsIHNjb3JlOiBxdWVyeVJlc3VsdHNbZG9jUmVmXX0pO1xuICB9XG5cbiAgcmVzdWx0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTsgfSk7XG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBzZWFyY2ggcXVlcnlUb2tlbnMgaW4gc3BlY2lmaWVkIGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHF1ZXJ5VG9rZW5zIFRoZSBxdWVyeSB0b2tlbnMgdG8gcXVlcnkgaW4gdGhpcyBmaWVsZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZCBGaWVsZCB0byBxdWVyeSBpbi5cbiAqIEBwYXJhbSB7ZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbn0gY29uZmlnIFRoZSB1c2VyIHF1ZXJ5IGNvbmZpZywgSlNPTiBmb3JtYXQuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5maWVsZFNlYXJjaCA9IGZ1bmN0aW9uIChxdWVyeVRva2VucywgZmllbGROYW1lLCBjb25maWcpIHtcbiAgdmFyIGJvb2xlYW5UeXBlID0gY29uZmlnW2ZpZWxkTmFtZV0uYm9vbDtcbiAgdmFyIGV4cGFuZCA9IGNvbmZpZ1tmaWVsZE5hbWVdLmV4cGFuZDtcbiAgdmFyIGJvb3N0ID0gY29uZmlnW2ZpZWxkTmFtZV0uYm9vc3Q7XG4gIHZhciBzY29yZXMgPSBudWxsO1xuICB2YXIgZG9jVG9rZW5zID0ge307XG5cbiAgLy8gRG8gbm90aGluZyBpZiB0aGUgYm9vc3QgaXMgMFxuICBpZiAoYm9vc3QgPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBxdWVyeVRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHZhciB0b2tlbnMgPSBbdG9rZW5dO1xuICAgIGlmIChleHBhbmQgPT0gdHJ1ZSkge1xuICAgICAgdG9rZW5zID0gdGhpcy5pbmRleFtmaWVsZE5hbWVdLmV4cGFuZFRva2VuKHRva2VuKTtcbiAgICB9XG4gICAgLy8gQ29uc2lkZXIgZXZlcnkgcXVlcnkgdG9rZW4gaW4gdHVybi4gSWYgZXhwYW5kZWQsIGVhY2ggcXVlcnkgdG9rZW5cbiAgICAvLyBjb3JyZXNwb25kcyB0byBhIHNldCBvZiB0b2tlbnMsIHdoaWNoIGlzIGFsbCB0b2tlbnMgaW4gdGhlIFxuICAgIC8vIGluZGV4IG1hdGNoaW5nIHRoZSBwYXR0ZXJuIHF1ZXJ5VG9rZW4qIC5cbiAgICAvLyBGb3IgdGhlIHNldCBvZiB0b2tlbnMgY29ycmVzcG9uZGluZyB0byBhIHF1ZXJ5IHRva2VuLCBmaW5kIGFuZCBzY29yZVxuICAgIC8vIGFsbCBtYXRjaGluZyBkb2N1bWVudHMuIFN0b3JlIHRob3NlIHNjb3JlcyBpbiBxdWVyeVRva2VuU2NvcmVzLCBcbiAgICAvLyBrZXllZCBieSBkb2NSZWYuXG4gICAgLy8gVGhlbiwgZGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBib29sZWFuVHlwZSwgY29tYmluZSB0aGUgc2NvcmVzXG4gICAgLy8gZm9yIHRoaXMgcXVlcnkgdG9rZW4gd2l0aCBwcmV2aW91cyBzY29yZXMuICBJZiBib29sZWFuVHlwZSBpcyBPUixcbiAgICAvLyB0aGVuIG1lcmdlIHRoZSBzY29yZXMgYnkgc3VtbWluZyBpbnRvIHRoZSBhY2N1bXVsYXRlZCB0b3RhbCwgYWRkaW5nXG4gICAgLy8gbmV3IGRvY3VtZW50IHNjb3JlcyBhcmUgcmVxdWlyZWQgKGVmZmVjdGl2ZWx5IGEgdW5pb24gb3BlcmF0b3IpLiBcbiAgICAvLyBJZiBib29sZWFuVHlwZSBpcyBBTkQsIGFjY3VtdWxhdGUgc2NvcmVzIG9ubHkgaWYgdGhlIGRvY3VtZW50IFxuICAgIC8vIGhhcyBwcmV2aW91c2x5IGJlZW4gc2NvcmVkIGJ5IGFub3RoZXIgcXVlcnkgdG9rZW4gKGFuIGludGVyc2VjdGlvblxuICAgIC8vIG9wZXJhdGlvbjAuIFxuICAgIC8vIEZ1cnRoZXJtb3JlLCBzaW5jZSB3aGVuIGJvb2xlYW5UeXBlIGlzIEFORCwgYWRkaXRpb25hbCBcbiAgICAvLyBxdWVyeSB0b2tlbnMgY2FuJ3QgYWRkIG5ldyBkb2N1bWVudHMgdG8gdGhlIHJlc3VsdCBzZXQsIHVzZSB0aGVcbiAgICAvLyBjdXJyZW50IGRvY3VtZW50IHNldCB0byBsaW1pdCB0aGUgcHJvY2Vzc2luZyBvZiBlYWNoIG5ldyBxdWVyeSBcbiAgICAvLyB0b2tlbiBmb3IgZWZmaWNpZW5jeSAoaS5lLiwgaW5jcmVtZW50YWwgaW50ZXJzZWN0aW9uKS5cbiAgICBcbiAgICB2YXIgcXVlcnlUb2tlblNjb3JlcyA9IHt9O1xuICAgIHRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBkb2NzID0gdGhpcy5pbmRleFtmaWVsZE5hbWVdLmdldERvY3Moa2V5KTtcbiAgICAgIHZhciBpZGYgPSB0aGlzLmlkZihrZXksIGZpZWxkTmFtZSk7XG4gICAgICBcbiAgICAgIGlmIChzY29yZXMgJiYgYm9vbGVhblR5cGUgPT0gJ0FORCcpIHtcbiAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UsIHdlIGNhbiBydWxlIG91dCBkb2N1bWVudHMgdGhhdCBoYXZlIGJlZW5cbiAgICAgICAgICAvLyBhbHJlYWR5IGJlZW4gZmlsdGVyZWQgb3V0IGJlY2F1c2UgdGhleSB3ZXJlbid0IHNjb3JlZFxuICAgICAgICAgIC8vIGJ5IHByZXZpb3VzIHF1ZXJ5IHRva2VuIHBhc3Nlcy5cbiAgICAgICAgICB2YXIgZmlsdGVyZWREb2NzID0ge307XG4gICAgICAgICAgZm9yICh2YXIgZG9jUmVmIGluIHNjb3Jlcykge1xuICAgICAgICAgICAgICBpZiAoZG9jUmVmIGluIGRvY3MpIHtcbiAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRG9jc1tkb2NSZWZdID0gZG9jc1tkb2NSZWZdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvY3MgPSBmaWx0ZXJlZERvY3M7XG4gICAgICB9XG4gICAgICAvLyBvbmx5IHJlY29yZCBhcHBlYXJlZCB0b2tlbiBmb3IgcmV0cmlldmVkIGRvY3VtZW50cyBmb3IgdGhlXG4gICAgICAvLyBvcmlnaW5hbCB0b2tlbiwgbm90IGZvciBleHBhbmVkIHRva2VuLlxuICAgICAgLy8gYmVhdXNlIGZvciBkb2luZyBjb29yZE5vcm0gZm9yIGEgcmV0cmlldmVkIGRvY3VtZW50LCBjb29yZE5vcm0gb25seSBjYXJlIGhvdyBtYW55XG4gICAgICAvLyBxdWVyeSB0b2tlbiBhcHBlYXIgaW4gdGhhdCBkb2N1bWVudC5cbiAgICAgIC8vIHNvIGV4cGFuZGVkIHRva2VuIHNob3VsZCBub3QgYmUgYWRkZWQgaW50byBkb2NUb2tlbnMsIGlmIGFkZGVkLCB0aGlzIHdpbGwgcG9sbHV0ZSB0aGVcbiAgICAgIC8vIGNvb3JkTm9ybVxuICAgICAgaWYgKGtleSA9PSB0b2tlbikge1xuICAgICAgICB0aGlzLmZpZWxkU2VhcmNoU3RhdHMoZG9jVG9rZW5zLCBrZXksIGRvY3MpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBkb2NSZWYgaW4gZG9jcykge1xuICAgICAgICB2YXIgdGYgPSB0aGlzLmluZGV4W2ZpZWxkTmFtZV0uZ2V0VGVybUZyZXF1ZW5jeShrZXksIGRvY1JlZik7XG4gICAgICAgIHZhciBmaWVsZExlbmd0aCA9IHRoaXMuZG9jdW1lbnRTdG9yZS5nZXRGaWVsZExlbmd0aChkb2NSZWYsIGZpZWxkTmFtZSk7XG4gICAgICAgIHZhciBmaWVsZExlbmd0aE5vcm0gPSAxO1xuICAgICAgICBpZiAoZmllbGRMZW5ndGggIT0gMCkge1xuICAgICAgICAgIGZpZWxkTGVuZ3RoTm9ybSA9IDEgLyBNYXRoLnNxcnQoZmllbGRMZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBlbmFsaXR5ID0gMTtcbiAgICAgICAgaWYgKGtleSAhPSB0b2tlbikge1xuICAgICAgICAgIC8vIGN1cnJlbnRseSBJJ20gbm90IHN1cmUgaWYgdGhpcyBwZW5hbGl0eSBpcyBlbm91Z2gsXG4gICAgICAgICAgLy8gbmVlZCB0byBkbyB2ZXJpZmljYXRpb25cbiAgICAgICAgICBwZW5hbGl0eSA9ICgxIC0gKGtleS5sZW5ndGggLSB0b2tlbi5sZW5ndGgpIC8ga2V5Lmxlbmd0aCkgKiAwLjE1O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNjb3JlID0gdGYgKiBpZGYgKiBmaWVsZExlbmd0aE5vcm0gKiBwZW5hbGl0eTtcblxuICAgICAgICBpZiAoZG9jUmVmIGluIHF1ZXJ5VG9rZW5TY29yZXMpIHtcbiAgICAgICAgICBxdWVyeVRva2VuU2NvcmVzW2RvY1JlZl0gKz0gc2NvcmU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcXVlcnlUb2tlblNjb3Jlc1tkb2NSZWZdID0gc2NvcmU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICBcbiAgICBzY29yZXMgPSB0aGlzLm1lcmdlU2NvcmVzKHNjb3JlcywgcXVlcnlUb2tlblNjb3JlcywgYm9vbGVhblR5cGUpO1xuICB9LCB0aGlzKTtcblxuICBzY29yZXMgPSB0aGlzLmNvb3JkTm9ybShzY29yZXMsIGRvY1Rva2VucywgcXVlcnlUb2tlbnMubGVuZ3RoKTtcbiAgcmV0dXJuIHNjb3Jlcztcbn07XG5cbi8qKlxuICogTWVyZ2UgdGhlIHNjb3JlcyBmcm9tIG9uZSBzZXQgb2YgdG9rZW5zIGludG8gYW4gYWNjdW11bGF0ZWQgc2NvcmUgdGFibGUuXG4gKiBFeGFjdCBvcGVyYXRpb24gZGVwZW5kcyBvbiB0aGUgb3AgcGFyYW1ldGVyLiBJZiBvcCBpcyAnQU5EJywgdGhlbiBvbmx5IHRoZVxuICogaW50ZXJzZWN0aW9uIG9mIHRoZSB0d28gc2NvcmUgbGlzdHMgaXMgcmV0YWluZWQuIE90aGVyd2lzZSwgdGhlIHVuaW9uIG9mXG4gKiB0aGUgdHdvIHNjb3JlIGxpc3RzIGlzIHJldHVybmVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJvb2wgYWNjdW11bGF0ZWQgc2NvcmVzLiBTaG91bGQgYmUgbnVsbCBvbiBmaXJzdCBjYWxsLlxuICogQHBhcmFtIHtTdHJpbmd9IHNjb3JlcyBuZXcgc2NvcmVzIHRvIG1lcmdlIGludG8gYWNjdW1TY29yZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gb3AgbWVyZ2Ugb3BlcmF0aW9uIChzaG91bGQgYmUgJ0FORCcgb3IgJ09SJykuXG4gKlxuICovXG5cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5tZXJnZVNjb3JlcyA9IGZ1bmN0aW9uIChhY2N1bVNjb3Jlcywgc2NvcmVzLCBvcCkge1xuICAgIGlmICghYWNjdW1TY29yZXMpIHtcbiAgICAgICAgcmV0dXJuIHNjb3JlczsgXG4gICAgfVxuICAgIGlmIChvcCA9PSAnQU5EJykge1xuICAgICAgICB2YXIgaW50ZXJzZWN0aW9uID0ge307XG4gICAgICAgIGZvciAodmFyIGRvY1JlZiBpbiBzY29yZXMpIHtcbiAgICAgICAgICAgIGlmIChkb2NSZWYgaW4gYWNjdW1TY29yZXMpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnNlY3Rpb25bZG9jUmVmXSA9IGFjY3VtU2NvcmVzW2RvY1JlZl0gKyBzY29yZXNbZG9jUmVmXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGRvY1JlZiBpbiBzY29yZXMpIHtcbiAgICAgICAgICAgIGlmIChkb2NSZWYgaW4gYWNjdW1TY29yZXMpIHtcbiAgICAgICAgICAgICAgICBhY2N1bVNjb3Jlc1tkb2NSZWZdICs9IHNjb3Jlc1tkb2NSZWZdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhY2N1bVNjb3Jlc1tkb2NSZWZdID0gc2NvcmVzW2RvY1JlZl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjY3VtU2NvcmVzO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiBSZWNvcmQgdGhlIG9jY3VyaW5nIHF1ZXJ5IHRva2VuIG9mIHJldHJpZXZlZCBkb2Mgc3BlY2lmaWVkIGJ5IGRvYyBmaWVsZC5cbiAqIE9ubHkgZm9yIGlubmVyIHVzZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRvY1Rva2VucyBhIGRhdGEgc3RydWN0dXJlIHN0b3JlcyB3aGljaCB0b2tlbiBhcHBlYXJzIGluIHRoZSByZXRyaWV2ZWQgZG9jLlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIHF1ZXJ5IHRva2VuXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jcyB0aGUgcmV0cmlldmVkIGRvY3VtZW50cyBvZiB0aGUgcXVlcnkgdG9rZW5cbiAqXG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5maWVsZFNlYXJjaFN0YXRzID0gZnVuY3Rpb24gKGRvY1Rva2VucywgdG9rZW4sIGRvY3MpIHtcbiAgZm9yICh2YXIgZG9jIGluIGRvY3MpIHtcbiAgICBpZiAoZG9jIGluIGRvY1Rva2Vucykge1xuICAgICAgZG9jVG9rZW5zW2RvY10ucHVzaCh0b2tlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY1Rva2Vuc1tkb2NdID0gW3Rva2VuXTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogY29vcmQgbm9ybSB0aGUgc2NvcmUgb2YgYSBkb2MuXG4gKiBpZiBhIGRvYyBjb250YWluIG1vcmUgcXVlcnkgdG9rZW5zLCB0aGVuIHRoZSBzY29yZSB3aWxsIGxhcmdlciB0aGFuIHRoZSBkb2NcbiAqIGNvbnRhaW5zIGxlc3MgcXVlcnkgdG9rZW5zLlxuICpcbiAqIG9ubHkgZm9yIGlubmVyIHVzZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVzdWx0cyBmaXJzdCByZXN1bHRzXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jcyBmaWVsZCBzZWFyY2ggcmVzdWx0cyBvZiBhIHRva2VuXG4gKiBAcGFyYW0ge0ludGVnZXJ9IG4gcXVlcnkgdG9rZW4gbnVtYmVyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5jb29yZE5vcm0gPSBmdW5jdGlvbiAoc2NvcmVzLCBkb2NUb2tlbnMsIG4pIHtcbiAgZm9yICh2YXIgZG9jIGluIHNjb3Jlcykge1xuICAgIGlmICghKGRvYyBpbiBkb2NUb2tlbnMpKSBjb250aW51ZTtcbiAgICB2YXIgdG9rZW5zID0gZG9jVG9rZW5zW2RvY10ubGVuZ3RoO1xuICAgIHNjb3Jlc1tkb2NdID0gc2NvcmVzW2RvY10gKiB0b2tlbnMgLyBuO1xuICB9XG5cbiAgcmV0dXJuIHNjb3Jlcztcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBpbmRleCByZWFkeSBmb3Igc2VyaWFsaXNhdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGluZGV4SnNvbiA9IHt9O1xuICB0aGlzLl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICBpbmRleEpzb25bZmllbGRdID0gdGhpcy5pbmRleFtmaWVsZF0udG9KU09OKCk7XG4gIH0sIHRoaXMpO1xuXG4gIHJldHVybiB7XG4gICAgdmVyc2lvbjogZWxhc3RpY2x1bnIudmVyc2lvbixcbiAgICBmaWVsZHM6IHRoaXMuX2ZpZWxkcyxcbiAgICByZWY6IHRoaXMuX3JlZixcbiAgICBkb2N1bWVudFN0b3JlOiB0aGlzLmRvY3VtZW50U3RvcmUudG9KU09OKCksXG4gICAgaW5kZXg6IGluZGV4SnNvbixcbiAgICBwaXBlbGluZTogdGhpcy5waXBlbGluZS50b0pTT04oKVxuICB9O1xufTtcblxuLyoqXG4gKiBBcHBsaWVzIGEgcGx1Z2luIHRvIHRoZSBjdXJyZW50IGluZGV4LlxuICpcbiAqIEEgcGx1Z2luIGlzIGEgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2l0aCB0aGUgaW5kZXggYXMgaXRzIGNvbnRleHQuXG4gKiBQbHVnaW5zIGNhbiBiZSB1c2VkIHRvIGN1c3RvbWlzZSBvciBleHRlbmQgdGhlIGJlaGF2aW91ciB0aGUgaW5kZXhcbiAqIGluIHNvbWUgd2F5LiBBIHBsdWdpbiBpcyBqdXN0IGEgZnVuY3Rpb24sIHRoYXQgZW5jYXBzdWxhdGVkIHRoZSBjdXN0b21cbiAqIGJlaGF2aW91ciB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSBpbmRleC5cbiAqXG4gKiBUaGUgcGx1Z2luIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGluZGV4IGFzIGl0cyBhcmd1bWVudCwgYWRkaXRpb25hbFxuICogYXJndW1lbnRzIGNhbiBhbHNvIGJlIHBhc3NlZCB3aGVuIGNhbGxpbmcgdXNlLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWRcbiAqIHdpdGggdGhlIGluZGV4IGFzIGl0cyBjb250ZXh0LlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgIHZhciBteVBsdWdpbiA9IGZ1bmN0aW9uIChpZHgsIGFyZzEsIGFyZzIpIHtcbiAqICAgICAgIC8vIGB0aGlzYCBpcyB0aGUgaW5kZXggdG8gYmUgZXh0ZW5kZWRcbiAqICAgICAgIC8vIGFwcGx5IGFueSBleHRlbnNpb25zIGV0YyBoZXJlLlxuICogICAgIH1cbiAqXG4gKiAgICAgdmFyIGlkeCA9IGVsYXN0aWNsdW5yKGZ1bmN0aW9uICgpIHtcbiAqICAgICAgIHRoaXMudXNlKG15UGx1Z2luLCAnYXJnMScsICdhcmcyJylcbiAqICAgICB9KVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHBsdWdpbiBUaGUgcGx1Z2luIHRvIGFwcGx5LlxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiAocGx1Z2luKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgYXJncy51bnNoaWZ0KHRoaXMpO1xuICBwbHVnaW4uYXBwbHkodGhpcywgYXJncyk7XG59O1xuLyohXG4gKiBlbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIGVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUgaXMgYSBzaW1wbGUga2V5LXZhbHVlIGRvY3VtZW50IHN0b3JlIHVzZWQgZm9yIHN0b3Jpbmcgc2V0cyBvZiB0b2tlbnMgZm9yXG4gKiBkb2N1bWVudHMgc3RvcmVkIGluIGluZGV4LlxuICpcbiAqIGVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUgc3RvcmUgb3JpZ2luYWwgSlNPTiBmb3JtYXQgZG9jdW1lbnRzIHRoYXQgeW91IGNvdWxkIGJ1aWxkIHNlYXJjaCBzbmlwcGV0IGJ5IHRoaXMgb3JpZ2luYWwgSlNPTiBkb2N1bWVudC5cbiAqXG4gKiB1c2VyIGNvdWxkIGNob29zZSB3aGV0aGVyIG9yaWdpbmFsIEpTT04gZm9ybWF0IGRvY3VtZW50IHNob3VsZCBiZSBzdG9yZSwgaWYgbm8gY29uZmlndXJhdGlvbiB0aGVuIGRvY3VtZW50IHdpbGwgYmUgc3RvcmVkIGRlZmF1bHRseS5cbiAqIElmIHVzZXIgY2FyZSBtb3JlIGFib3V0IHRoZSBpbmRleCBzaXplLCB1c2VyIGNvdWxkIHNlbGVjdCBub3Qgc3RvcmUgSlNPTiBkb2N1bWVudHMsIHRoZW4gdGhpcyB3aWxsIGhhcyBzb21lIGRlZmVjdHMsIHN1Y2ggYXMgdXNlclxuICogY291bGQgbm90IHVzZSBKU09OIGRvY3VtZW50IHRvIGdlbmVyYXRlIHNuaXBwZXRzIG9mIHNlYXJjaCByZXN1bHRzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2F2ZSBJZiB0aGUgb3JpZ2luYWwgSlNPTiBkb2N1bWVudCBzaG91bGQgYmUgc3RvcmVkLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAbW9kdWxlXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUgPSBmdW5jdGlvbiAoc2F2ZSkge1xuICBpZiAoc2F2ZSA9PT0gbnVsbCB8fCBzYXZlID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9zYXZlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9zYXZlID0gc2F2ZTtcbiAgfVxuXG4gIHRoaXMuZG9jcyA9IHt9O1xuICB0aGlzLmRvY0luZm8gPSB7fTtcbiAgdGhpcy5sZW5ndGggPSAwO1xufTtcblxuLyoqXG4gKiBMb2FkcyBhIHByZXZpb3VzbHkgc2VyaWFsaXNlZCBkb2N1bWVudCBzdG9yZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXJpYWxpc2VkRGF0YSBUaGUgc2VyaWFsaXNlZCBkb2N1bWVudCBzdG9yZSB0byBsb2FkLlxuICogQHJldHVybiB7ZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZX1cbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5sb2FkID0gZnVuY3Rpb24gKHNlcmlhbGlzZWREYXRhKSB7XG4gIHZhciBzdG9yZSA9IG5ldyB0aGlzO1xuXG4gIHN0b3JlLmxlbmd0aCA9IHNlcmlhbGlzZWREYXRhLmxlbmd0aDtcbiAgc3RvcmUuZG9jcyA9IHNlcmlhbGlzZWREYXRhLmRvY3M7XG4gIHN0b3JlLmRvY0luZm8gPSBzZXJpYWxpc2VkRGF0YS5kb2NJbmZvO1xuICBzdG9yZS5fc2F2ZSA9IHNlcmlhbGlzZWREYXRhLnNhdmU7XG5cbiAgcmV0dXJuIHN0b3JlO1xufTtcblxuLyoqXG4gKiBjaGVjayBpZiBjdXJyZW50IGluc3RhbmNlIHN0b3JlIHRoZSBvcmlnaW5hbCBkb2NcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS5pc0RvY1N0b3JlZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3NhdmU7XG59O1xuXG4vKipcbiAqIFN0b3JlcyB0aGUgZ2l2ZW4gZG9jIGluIHRoZSBkb2N1bWVudCBzdG9yZSBhZ2FpbnN0IHRoZSBnaXZlbiBpZC5cbiAqIElmIGRvY1JlZiBhbHJlYWR5IGV4aXN0LCB0aGVuIHVwZGF0ZSBkb2MuXG4gKlxuICogRG9jdW1lbnQgaXMgc3RvcmUgYnkgb3JpZ2luYWwgSlNPTiBmb3JtYXQsIHRoZW4geW91IGNvdWxkIHVzZSBvcmlnaW5hbCBkb2N1bWVudCB0byBnZW5lcmF0ZSBzZWFyY2ggc25pcHBldHMuXG4gKlxuICogQHBhcmFtIHtJbnRlZ2VyfFN0cmluZ30gZG9jUmVmIFRoZSBrZXkgdXNlZCB0byBzdG9yZSB0aGUgSlNPTiBmb3JtYXQgZG9jLlxuICogQHBhcmFtIHtPYmplY3R9IGRvYyBUaGUgSlNPTiBmb3JtYXQgZG9jLlxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS5hZGREb2MgPSBmdW5jdGlvbiAoZG9jUmVmLCBkb2MpIHtcbiAgaWYgKCF0aGlzLmhhc0RvYyhkb2NSZWYpKSB0aGlzLmxlbmd0aCsrO1xuXG4gIGlmICh0aGlzLl9zYXZlID09PSB0cnVlKSB7XG4gICAgdGhpcy5kb2NzW2RvY1JlZl0gPSBjbG9uZShkb2MpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZG9jc1tkb2NSZWZdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIEpTT04gZG9jIGZyb20gdGhlIGRvY3VtZW50IHN0b3JlIGZvciBhIGdpdmVuIGtleS5cbiAqXG4gKiBJZiBkb2NSZWYgbm90IGZvdW5kLCByZXR1cm4gbnVsbC5cbiAqIElmIHVzZXIgc2V0IG5vdCBzdG9yaW5nIHRoZSBkb2N1bWVudHMsIHJldHVybiBudWxsLlxuICpcbiAqIEBwYXJhbSB7SW50ZWdlcnxTdHJpbmd9IGRvY1JlZiBUaGUga2V5IHRvIGxvb2t1cCBhbmQgcmV0cmlldmUgZnJvbSB0aGUgZG9jdW1lbnQgc3RvcmUuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAbWVtYmVyT2YgRG9jdW1lbnRTdG9yZVxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS5nZXREb2MgPSBmdW5jdGlvbiAoZG9jUmVmKSB7XG4gIGlmICh0aGlzLmhhc0RvYyhkb2NSZWYpID09PSBmYWxzZSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB0aGlzLmRvY3NbZG9jUmVmXTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGRvY3VtZW50IHN0b3JlIGNvbnRhaW5zIGEga2V5IChkb2NSZWYpLlxuICpcbiAqIEBwYXJhbSB7SW50ZWdlcnxTdHJpbmd9IGRvY1JlZiBUaGUgaWQgdG8gbG9vayB1cCBpbiB0aGUgZG9jdW1lbnQgc3RvcmUuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQG1lbWJlck9mIERvY3VtZW50U3RvcmVcbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUuaGFzRG9jID0gZnVuY3Rpb24gKGRvY1JlZikge1xuICByZXR1cm4gZG9jUmVmIGluIHRoaXMuZG9jcztcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgdmFsdWUgZm9yIGEga2V5IGluIHRoZSBkb2N1bWVudCBzdG9yZS5cbiAqXG4gKiBAcGFyYW0ge0ludGVnZXJ8U3RyaW5nfSBkb2NSZWYgVGhlIGlkIHRvIHJlbW92ZSBmcm9tIHRoZSBkb2N1bWVudCBzdG9yZS5cbiAqIEBtZW1iZXJPZiBEb2N1bWVudFN0b3JlXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLnJlbW92ZURvYyA9IGZ1bmN0aW9uIChkb2NSZWYpIHtcbiAgaWYgKCF0aGlzLmhhc0RvYyhkb2NSZWYpKSByZXR1cm47XG5cbiAgZGVsZXRlIHRoaXMuZG9jc1tkb2NSZWZdO1xuICBkZWxldGUgdGhpcy5kb2NJbmZvW2RvY1JlZl07XG4gIHRoaXMubGVuZ3RoLS07XG59O1xuXG4vKipcbiAqIEFkZCBmaWVsZCBsZW5ndGggb2YgYSBkb2N1bWVudCdzIGZpZWxkIHRva2VucyBmcm9tIHBpcGVsaW5lIHJlc3VsdHMuXG4gKiBUaGUgZmllbGQgbGVuZ3RoIG9mIGEgZG9jdW1lbnQgaXMgdXNlZCB0byBkbyBmaWVsZCBsZW5ndGggbm9ybWFsaXphdGlvbiBldmVuIHdpdGhvdXQgdGhlIG9yaWdpbmFsIEpTT04gZG9jdW1lbnQgc3RvcmVkLlxuICpcbiAqIEBwYXJhbSB7SW50ZWdlcnxTdHJpbmd9IGRvY1JlZiBkb2N1bWVudCdzIGlkIG9yIHJlZmVyZW5jZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkTmFtZSBmaWVsZCBuYW1lXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGxlbmd0aCBmaWVsZCBsZW5ndGhcbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUuYWRkRmllbGRMZW5ndGggPSBmdW5jdGlvbiAoZG9jUmVmLCBmaWVsZE5hbWUsIGxlbmd0aCkge1xuICBpZiAoZG9jUmVmID09PSBudWxsIHx8IGRvY1JlZiA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gIGlmICh0aGlzLmhhc0RvYyhkb2NSZWYpID09IGZhbHNlKSByZXR1cm47XG5cbiAgaWYgKCF0aGlzLmRvY0luZm9bZG9jUmVmXSkgdGhpcy5kb2NJbmZvW2RvY1JlZl0gPSB7fTtcbiAgdGhpcy5kb2NJbmZvW2RvY1JlZl1bZmllbGROYW1lXSA9IGxlbmd0aDtcbn07XG5cbi8qKlxuICogVXBkYXRlIGZpZWxkIGxlbmd0aCBvZiBhIGRvY3VtZW50J3MgZmllbGQgdG9rZW5zIGZyb20gcGlwZWxpbmUgcmVzdWx0cy5cbiAqIFRoZSBmaWVsZCBsZW5ndGggb2YgYSBkb2N1bWVudCBpcyB1c2VkIHRvIGRvIGZpZWxkIGxlbmd0aCBub3JtYWxpemF0aW9uIGV2ZW4gd2l0aG91dCB0aGUgb3JpZ2luYWwgSlNPTiBkb2N1bWVudCBzdG9yZWQuXG4gKlxuICogQHBhcmFtIHtJbnRlZ2VyfFN0cmluZ30gZG9jUmVmIGRvY3VtZW50J3MgaWQgb3IgcmVmZXJlbmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGROYW1lIGZpZWxkIG5hbWVcbiAqIEBwYXJhbSB7SW50ZWdlcn0gbGVuZ3RoIGZpZWxkIGxlbmd0aFxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS51cGRhdGVGaWVsZExlbmd0aCA9IGZ1bmN0aW9uIChkb2NSZWYsIGZpZWxkTmFtZSwgbGVuZ3RoKSB7XG4gIGlmIChkb2NSZWYgPT09IG51bGwgfHwgZG9jUmVmID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgaWYgKHRoaXMuaGFzRG9jKGRvY1JlZikgPT0gZmFsc2UpIHJldHVybjtcblxuICB0aGlzLmFkZEZpZWxkTGVuZ3RoKGRvY1JlZiwgZmllbGROYW1lLCBsZW5ndGgpO1xufTtcblxuLyoqXG4gKiBnZXQgZmllbGQgbGVuZ3RoIG9mIGEgZG9jdW1lbnQgYnkgZG9jUmVmXG4gKlxuICogQHBhcmFtIHtJbnRlZ2VyfFN0cmluZ30gZG9jUmVmIGRvY3VtZW50IGlkIG9yIHJlZmVyZW5jZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkTmFtZSBmaWVsZCBuYW1lXG4gKiBAcmV0dXJuIHtJbnRlZ2VyfSBmaWVsZCBsZW5ndGhcbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUuZ2V0RmllbGRMZW5ndGggPSBmdW5jdGlvbiAoZG9jUmVmLCBmaWVsZE5hbWUpIHtcbiAgaWYgKGRvY1JlZiA9PT0gbnVsbCB8fCBkb2NSZWYgPT09IHVuZGVmaW5lZCkgcmV0dXJuIDA7XG5cbiAgaWYgKCEoZG9jUmVmIGluIHRoaXMuZG9jcykpIHJldHVybiAwO1xuICBpZiAoIShmaWVsZE5hbWUgaW4gdGhpcy5kb2NJbmZvW2RvY1JlZl0pKSByZXR1cm4gMDtcbiAgcmV0dXJuIHRoaXMuZG9jSW5mb1tkb2NSZWZdW2ZpZWxkTmFtZV07XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkb2N1bWVudCBzdG9yZSB1c2VkIGZvciBzZXJpYWxpc2F0aW9uLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gSlNPTiBmb3JtYXRcbiAqIEBtZW1iZXJPZiBEb2N1bWVudFN0b3JlXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICBkb2NzOiB0aGlzLmRvY3MsXG4gICAgZG9jSW5mbzogdGhpcy5kb2NJbmZvLFxuICAgIGxlbmd0aDogdGhpcy5sZW5ndGgsXG4gICAgc2F2ZTogdGhpcy5fc2F2ZVxuICB9O1xufTtcblxuLyoqXG4gKiBDbG9uaW5nIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgaW4gSlNPTiBmb3JtYXRcbiAqIEByZXR1cm4ge09iamVjdH0gY29waWVkIG9iamVjdFxuICovXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgaWYgKG51bGwgPT09IG9iaiB8fCBcIm9iamVjdFwiICE9PSB0eXBlb2Ygb2JqKSByZXR1cm4gb2JqO1xuXG4gIHZhciBjb3B5ID0gb2JqLmNvbnN0cnVjdG9yKCk7XG5cbiAgZm9yICh2YXIgYXR0ciBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGF0dHIpKSBjb3B5W2F0dHJdID0gb2JqW2F0dHJdO1xuICB9XG5cbiAgcmV0dXJuIGNvcHk7XG59XG4vKiFcbiAqIGVsYXN0aWNsdW5yLnN0ZW1tZXJcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICogSW5jbHVkZXMgY29kZSBmcm9tIC0gaHR0cDovL3RhcnRhcnVzLm9yZy9+bWFydGluL1BvcnRlclN0ZW1tZXIvanMudHh0XG4gKi9cblxuLyoqXG4gKiBlbGFzdGljbHVuci5zdGVtbWVyIGlzIGFuIGVuZ2xpc2ggbGFuZ3VhZ2Ugc3RlbW1lciwgdGhpcyBpcyBhIEphdmFTY3JpcHRcbiAqIGltcGxlbWVudGF0aW9uIG9mIHRoZSBQb3J0ZXJTdGVtbWVyIHRha2VuIGZyb20gaHR0cDovL3RhcnRhcnVzLm9yZy9+bWFydGluXG4gKlxuICogQG1vZHVsZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIHN0ZW1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBzZWUgZWxhc3RpY2x1bnIuUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuc3RlbW1lciA9IChmdW5jdGlvbigpe1xuICB2YXIgc3RlcDJsaXN0ID0ge1xuICAgICAgXCJhdGlvbmFsXCIgOiBcImF0ZVwiLFxuICAgICAgXCJ0aW9uYWxcIiA6IFwidGlvblwiLFxuICAgICAgXCJlbmNpXCIgOiBcImVuY2VcIixcbiAgICAgIFwiYW5jaVwiIDogXCJhbmNlXCIsXG4gICAgICBcIml6ZXJcIiA6IFwiaXplXCIsXG4gICAgICBcImJsaVwiIDogXCJibGVcIixcbiAgICAgIFwiYWxsaVwiIDogXCJhbFwiLFxuICAgICAgXCJlbnRsaVwiIDogXCJlbnRcIixcbiAgICAgIFwiZWxpXCIgOiBcImVcIixcbiAgICAgIFwib3VzbGlcIiA6IFwib3VzXCIsXG4gICAgICBcIml6YXRpb25cIiA6IFwiaXplXCIsXG4gICAgICBcImF0aW9uXCIgOiBcImF0ZVwiLFxuICAgICAgXCJhdG9yXCIgOiBcImF0ZVwiLFxuICAgICAgXCJhbGlzbVwiIDogXCJhbFwiLFxuICAgICAgXCJpdmVuZXNzXCIgOiBcIml2ZVwiLFxuICAgICAgXCJmdWxuZXNzXCIgOiBcImZ1bFwiLFxuICAgICAgXCJvdXNuZXNzXCIgOiBcIm91c1wiLFxuICAgICAgXCJhbGl0aVwiIDogXCJhbFwiLFxuICAgICAgXCJpdml0aVwiIDogXCJpdmVcIixcbiAgICAgIFwiYmlsaXRpXCIgOiBcImJsZVwiLFxuICAgICAgXCJsb2dpXCIgOiBcImxvZ1wiXG4gICAgfSxcblxuICAgIHN0ZXAzbGlzdCA9IHtcbiAgICAgIFwiaWNhdGVcIiA6IFwiaWNcIixcbiAgICAgIFwiYXRpdmVcIiA6IFwiXCIsXG4gICAgICBcImFsaXplXCIgOiBcImFsXCIsXG4gICAgICBcImljaXRpXCIgOiBcImljXCIsXG4gICAgICBcImljYWxcIiA6IFwiaWNcIixcbiAgICAgIFwiZnVsXCIgOiBcIlwiLFxuICAgICAgXCJuZXNzXCIgOiBcIlwiXG4gICAgfSxcblxuICAgIGMgPSBcIlteYWVpb3VdXCIsICAgICAgICAgIC8vIGNvbnNvbmFudFxuICAgIHYgPSBcIlthZWlvdXldXCIsICAgICAgICAgIC8vIHZvd2VsXG4gICAgQyA9IGMgKyBcIlteYWVpb3V5XSpcIiwgICAgLy8gY29uc29uYW50IHNlcXVlbmNlXG4gICAgViA9IHYgKyBcIlthZWlvdV0qXCIsICAgICAgLy8gdm93ZWwgc2VxdWVuY2VcblxuICAgIG1ncjAgPSBcIl4oXCIgKyBDICsgXCIpP1wiICsgViArIEMsICAgICAgICAgICAgICAgLy8gW0NdVkMuLi4gaXMgbT4wXG4gICAgbWVxMSA9IFwiXihcIiArIEMgKyBcIik/XCIgKyBWICsgQyArIFwiKFwiICsgViArIFwiKT8kXCIsICAvLyBbQ11WQ1tWXSBpcyBtPTFcbiAgICBtZ3IxID0gXCJeKFwiICsgQyArIFwiKT9cIiArIFYgKyBDICsgViArIEMsICAgICAgIC8vIFtDXVZDVkMuLi4gaXMgbT4xXG4gICAgc192ID0gXCJeKFwiICsgQyArIFwiKT9cIiArIHY7ICAgICAgICAgICAgICAgICAgIC8vIHZvd2VsIGluIHN0ZW1cblxuICB2YXIgcmVfbWdyMCA9IG5ldyBSZWdFeHAobWdyMCk7XG4gIHZhciByZV9tZ3IxID0gbmV3IFJlZ0V4cChtZ3IxKTtcbiAgdmFyIHJlX21lcTEgPSBuZXcgUmVnRXhwKG1lcTEpO1xuICB2YXIgcmVfc192ID0gbmV3IFJlZ0V4cChzX3YpO1xuXG4gIHZhciByZV8xYSA9IC9eKC4rPykoc3N8aSllcyQvO1xuICB2YXIgcmUyXzFhID0gL14oLis/KShbXnNdKXMkLztcbiAgdmFyIHJlXzFiID0gL14oLis/KWVlZCQvO1xuICB2YXIgcmUyXzFiID0gL14oLis/KShlZHxpbmcpJC87XG4gIHZhciByZV8xYl8yID0gLy4kLztcbiAgdmFyIHJlMl8xYl8yID0gLyhhdHxibHxpeikkLztcbiAgdmFyIHJlM18xYl8yID0gbmV3IFJlZ0V4cChcIihbXmFlaW91eWxzel0pXFxcXDEkXCIpO1xuICB2YXIgcmU0XzFiXzIgPSBuZXcgUmVnRXhwKFwiXlwiICsgQyArIHYgKyBcIlteYWVpb3V3eHldJFwiKTtcblxuICB2YXIgcmVfMWMgPSAvXiguKz9bXmFlaW91XSl5JC87XG4gIHZhciByZV8yID0gL14oLis/KShhdGlvbmFsfHRpb25hbHxlbmNpfGFuY2l8aXplcnxibGl8YWxsaXxlbnRsaXxlbGl8b3VzbGl8aXphdGlvbnxhdGlvbnxhdG9yfGFsaXNtfGl2ZW5lc3N8ZnVsbmVzc3xvdXNuZXNzfGFsaXRpfGl2aXRpfGJpbGl0aXxsb2dpKSQvO1xuXG4gIHZhciByZV8zID0gL14oLis/KShpY2F0ZXxhdGl2ZXxhbGl6ZXxpY2l0aXxpY2FsfGZ1bHxuZXNzKSQvO1xuXG4gIHZhciByZV80ID0gL14oLis/KShhbHxhbmNlfGVuY2V8ZXJ8aWN8YWJsZXxpYmxlfGFudHxlbWVudHxtZW50fGVudHxvdXxpc218YXRlfGl0aXxvdXN8aXZlfGl6ZSkkLztcbiAgdmFyIHJlMl80ID0gL14oLis/KShzfHQpKGlvbikkLztcblxuICB2YXIgcmVfNSA9IC9eKC4rPyllJC87XG4gIHZhciByZV81XzEgPSAvbGwkLztcbiAgdmFyIHJlM181ID0gbmV3IFJlZ0V4cChcIl5cIiArIEMgKyB2ICsgXCJbXmFlaW91d3h5XSRcIik7XG5cbiAgdmFyIHBvcnRlclN0ZW1tZXIgPSBmdW5jdGlvbiBwb3J0ZXJTdGVtbWVyKHcpIHtcbiAgICB2YXIgICBzdGVtLFxuICAgICAgc3VmZml4LFxuICAgICAgZmlyc3RjaCxcbiAgICAgIHJlLFxuICAgICAgcmUyLFxuICAgICAgcmUzLFxuICAgICAgcmU0O1xuXG4gICAgaWYgKHcubGVuZ3RoIDwgMykgeyByZXR1cm4gdzsgfVxuXG4gICAgZmlyc3RjaCA9IHcuc3Vic3RyKDAsMSk7XG4gICAgaWYgKGZpcnN0Y2ggPT0gXCJ5XCIpIHtcbiAgICAgIHcgPSBmaXJzdGNoLnRvVXBwZXJDYXNlKCkgKyB3LnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICAvLyBTdGVwIDFhXG4gICAgcmUgPSByZV8xYVxuICAgIHJlMiA9IHJlMl8xYTtcblxuICAgIGlmIChyZS50ZXN0KHcpKSB7IHcgPSB3LnJlcGxhY2UocmUsXCIkMSQyXCIpOyB9XG4gICAgZWxzZSBpZiAocmUyLnRlc3QodykpIHsgdyA9IHcucmVwbGFjZShyZTIsXCIkMSQyXCIpOyB9XG5cbiAgICAvLyBTdGVwIDFiXG4gICAgcmUgPSByZV8xYjtcbiAgICByZTIgPSByZTJfMWI7XG4gICAgaWYgKHJlLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlLmV4ZWModyk7XG4gICAgICByZSA9IHJlX21ncjA7XG4gICAgICBpZiAocmUudGVzdChmcFsxXSkpIHtcbiAgICAgICAgcmUgPSByZV8xYl8yO1xuICAgICAgICB3ID0gdy5yZXBsYWNlKHJlLFwiXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmUyLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlMi5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdO1xuICAgICAgcmUyID0gcmVfc192O1xuICAgICAgaWYgKHJlMi50ZXN0KHN0ZW0pKSB7XG4gICAgICAgIHcgPSBzdGVtO1xuICAgICAgICByZTIgPSByZTJfMWJfMjtcbiAgICAgICAgcmUzID0gcmUzXzFiXzI7XG4gICAgICAgIHJlNCA9IHJlNF8xYl8yO1xuICAgICAgICBpZiAocmUyLnRlc3QodykpIHsgIHcgPSB3ICsgXCJlXCI7IH1cbiAgICAgICAgZWxzZSBpZiAocmUzLnRlc3QodykpIHsgcmUgPSByZV8xYl8yOyB3ID0gdy5yZXBsYWNlKHJlLFwiXCIpOyB9XG4gICAgICAgIGVsc2UgaWYgKHJlNC50ZXN0KHcpKSB7IHcgPSB3ICsgXCJlXCI7IH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdGVwIDFjIC0gcmVwbGFjZSBzdWZmaXggeSBvciBZIGJ5IGkgaWYgcHJlY2VkZWQgYnkgYSBub24tdm93ZWwgd2hpY2ggaXMgbm90IHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHdvcmQgKHNvIGNyeSAtPiBjcmksIGJ5IC0+IGJ5LCBzYXkgLT4gc2F5KVxuICAgIHJlID0gcmVfMWM7XG4gICAgaWYgKHJlLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV07XG4gICAgICB3ID0gc3RlbSArIFwiaVwiO1xuICAgIH1cblxuICAgIC8vIFN0ZXAgMlxuICAgIHJlID0gcmVfMjtcbiAgICBpZiAocmUudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXTtcbiAgICAgIHN1ZmZpeCA9IGZwWzJdO1xuICAgICAgcmUgPSByZV9tZ3IwO1xuICAgICAgaWYgKHJlLnRlc3Qoc3RlbSkpIHtcbiAgICAgICAgdyA9IHN0ZW0gKyBzdGVwMmxpc3Rbc3VmZml4XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdGVwIDNcbiAgICByZSA9IHJlXzM7XG4gICAgaWYgKHJlLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV07XG4gICAgICBzdWZmaXggPSBmcFsyXTtcbiAgICAgIHJlID0gcmVfbWdyMDtcbiAgICAgIGlmIChyZS50ZXN0KHN0ZW0pKSB7XG4gICAgICAgIHcgPSBzdGVtICsgc3RlcDNsaXN0W3N1ZmZpeF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RlcCA0XG4gICAgcmUgPSByZV80O1xuICAgIHJlMiA9IHJlMl80O1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdO1xuICAgICAgcmUgPSByZV9tZ3IxO1xuICAgICAgaWYgKHJlLnRlc3Qoc3RlbSkpIHtcbiAgICAgICAgdyA9IHN0ZW07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZTIudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUyLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV0gKyBmcFsyXTtcbiAgICAgIHJlMiA9IHJlX21ncjE7XG4gICAgICBpZiAocmUyLnRlc3Qoc3RlbSkpIHtcbiAgICAgICAgdyA9IHN0ZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RlcCA1XG4gICAgcmUgPSByZV81O1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdO1xuICAgICAgcmUgPSByZV9tZ3IxO1xuICAgICAgcmUyID0gcmVfbWVxMTtcbiAgICAgIHJlMyA9IHJlM181O1xuICAgICAgaWYgKHJlLnRlc3Qoc3RlbSkgfHwgKHJlMi50ZXN0KHN0ZW0pICYmICEocmUzLnRlc3Qoc3RlbSkpKSkge1xuICAgICAgICB3ID0gc3RlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZSA9IHJlXzVfMTtcbiAgICByZTIgPSByZV9tZ3IxO1xuICAgIGlmIChyZS50ZXN0KHcpICYmIHJlMi50ZXN0KHcpKSB7XG4gICAgICByZSA9IHJlXzFiXzI7XG4gICAgICB3ID0gdy5yZXBsYWNlKHJlLFwiXCIpO1xuICAgIH1cblxuICAgIC8vIGFuZCB0dXJuIGluaXRpYWwgWSBiYWNrIHRvIHlcblxuICAgIGlmIChmaXJzdGNoID09IFwieVwiKSB7XG4gICAgICB3ID0gZmlyc3RjaC50b0xvd2VyQ2FzZSgpICsgdy5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHc7XG4gIH07XG5cbiAgcmV0dXJuIHBvcnRlclN0ZW1tZXI7XG59KSgpO1xuXG5lbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlckZ1bmN0aW9uKGVsYXN0aWNsdW5yLnN0ZW1tZXIsICdzdGVtbWVyJyk7XG4vKiFcbiAqIGVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIGVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyIGlzIGFuIEVuZ2xpc2ggbGFuZ3VhZ2Ugc3RvcCB3b3JkcyBmaWx0ZXIsIGFueSB3b3Jkc1xuICogY29udGFpbmVkIGluIHRoZSBzdG9wIHdvcmQgbGlzdCB3aWxsIG5vdCBiZSBwYXNzZWQgdGhyb3VnaCB0aGUgZmlsdGVyLlxuICpcbiAqIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCBpbiB0aGUgUGlwZWxpbmUuIElmIHRoZSB0b2tlbiBkb2VzIG5vdCBwYXNzIHRoZVxuICogZmlsdGVyIHRoZW4gdW5kZWZpbmVkIHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBDdXJyZW50bHkgdGhpcyBTdG9wd29yZEZpbHRlciB1c2luZyBkaWN0aW9uYXJ5IHRvIGRvIE8oMSkgdGltZSBjb21wbGV4aXR5IHN0b3Agd29yZCBmaWx0ZXJpbmcuXG4gKlxuICogQG1vZHVsZVxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBwYXNzIHRocm91Z2ggdGhlIGZpbHRlclxuICogQHJldHVybiB7U3RyaW5nfVxuICogQHNlZSBlbGFzdGljbHVuci5QaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5zdG9wV29yZEZpbHRlciA9IGZ1bmN0aW9uICh0b2tlbikge1xuICBpZiAodG9rZW4gJiYgZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIuc3RvcFdvcmRzW3Rva2VuXSAhPT0gdHJ1ZSkge1xuICAgIHJldHVybiB0b2tlbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmUgcHJlZGVmaW5lZCBzdG9wIHdvcmRzXG4gKiBpZiB1c2VyIHdhbnQgdG8gdXNlIGN1c3RvbWl6ZWQgc3RvcCB3b3JkcywgdXNlciBjb3VsZCB1c2UgdGhpcyBmdW5jdGlvbiB0byBkZWxldGVcbiAqIGFsbCBwcmVkZWZpbmVkIHN0b3B3b3Jkcy5cbiAqXG4gKiBAcmV0dXJuIHtudWxsfVxuICovXG5lbGFzdGljbHVuci5jbGVhclN0b3BXb3JkcyA9IGZ1bmN0aW9uICgpIHtcbiAgZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIuc3RvcFdvcmRzID0ge307XG59O1xuXG4vKipcbiAqIEFkZCBjdXN0b21pemVkIHN0b3Agd29yZHNcbiAqIHVzZXIgY291bGQgdXNlIHRoaXMgZnVuY3Rpb24gdG8gYWRkIGN1c3RvbWl6ZWQgc3RvcCB3b3Jkc1xuICogXG4gKiBAcGFyYW1zIHtBcnJheX0gd29yZHMgY3VzdG9taXplZCBzdG9wIHdvcmRzXG4gKiBAcmV0dXJuIHtudWxsfVxuICovXG5lbGFzdGljbHVuci5hZGRTdG9wV29yZHMgPSBmdW5jdGlvbiAod29yZHMpIHtcbiAgaWYgKHdvcmRzID09IG51bGwgfHwgQXJyYXkuaXNBcnJheSh3b3JkcykgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgd29yZHMuZm9yRWFjaChmdW5jdGlvbiAod29yZCkge1xuICAgIGVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyLnN0b3BXb3Jkc1t3b3JkXSA9IHRydWU7XG4gIH0sIHRoaXMpO1xufTtcblxuLyoqXG4gKiBSZXNldCB0byBkZWZhdWx0IHN0b3Agd29yZHNcbiAqIHVzZXIgY291bGQgdXNlIHRoaXMgZnVuY3Rpb24gdG8gcmVzdG9yZSBkZWZhdWx0IHN0b3Agd29yZHNcbiAqXG4gKiBAcmV0dXJuIHtudWxsfVxuICovXG5lbGFzdGljbHVuci5yZXNldFN0b3BXb3JkcyA9IGZ1bmN0aW9uICgpIHtcbiAgZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIuc3RvcFdvcmRzID0gZWxhc3RpY2x1bnIuZGVmYXVsdFN0b3BXb3Jkcztcbn07XG5cbmVsYXN0aWNsdW5yLmRlZmF1bHRTdG9wV29yZHMgPSB7XG4gIFwiXCI6IHRydWUsXG4gIFwiYVwiOiB0cnVlLFxuICBcImFibGVcIjogdHJ1ZSxcbiAgXCJhYm91dFwiOiB0cnVlLFxuICBcImFjcm9zc1wiOiB0cnVlLFxuICBcImFmdGVyXCI6IHRydWUsXG4gIFwiYWxsXCI6IHRydWUsXG4gIFwiYWxtb3N0XCI6IHRydWUsXG4gIFwiYWxzb1wiOiB0cnVlLFxuICBcImFtXCI6IHRydWUsXG4gIFwiYW1vbmdcIjogdHJ1ZSxcbiAgXCJhblwiOiB0cnVlLFxuICBcImFuZFwiOiB0cnVlLFxuICBcImFueVwiOiB0cnVlLFxuICBcImFyZVwiOiB0cnVlLFxuICBcImFzXCI6IHRydWUsXG4gIFwiYXRcIjogdHJ1ZSxcbiAgXCJiZVwiOiB0cnVlLFxuICBcImJlY2F1c2VcIjogdHJ1ZSxcbiAgXCJiZWVuXCI6IHRydWUsXG4gIFwiYnV0XCI6IHRydWUsXG4gIFwiYnlcIjogdHJ1ZSxcbiAgXCJjYW5cIjogdHJ1ZSxcbiAgXCJjYW5ub3RcIjogdHJ1ZSxcbiAgXCJjb3VsZFwiOiB0cnVlLFxuICBcImRlYXJcIjogdHJ1ZSxcbiAgXCJkaWRcIjogdHJ1ZSxcbiAgXCJkb1wiOiB0cnVlLFxuICBcImRvZXNcIjogdHJ1ZSxcbiAgXCJlaXRoZXJcIjogdHJ1ZSxcbiAgXCJlbHNlXCI6IHRydWUsXG4gIFwiZXZlclwiOiB0cnVlLFxuICBcImV2ZXJ5XCI6IHRydWUsXG4gIFwiZm9yXCI6IHRydWUsXG4gIFwiZnJvbVwiOiB0cnVlLFxuICBcImdldFwiOiB0cnVlLFxuICBcImdvdFwiOiB0cnVlLFxuICBcImhhZFwiOiB0cnVlLFxuICBcImhhc1wiOiB0cnVlLFxuICBcImhhdmVcIjogdHJ1ZSxcbiAgXCJoZVwiOiB0cnVlLFxuICBcImhlclwiOiB0cnVlLFxuICBcImhlcnNcIjogdHJ1ZSxcbiAgXCJoaW1cIjogdHJ1ZSxcbiAgXCJoaXNcIjogdHJ1ZSxcbiAgXCJob3dcIjogdHJ1ZSxcbiAgXCJob3dldmVyXCI6IHRydWUsXG4gIFwiaVwiOiB0cnVlLFxuICBcImlmXCI6IHRydWUsXG4gIFwiaW5cIjogdHJ1ZSxcbiAgXCJpbnRvXCI6IHRydWUsXG4gIFwiaXNcIjogdHJ1ZSxcbiAgXCJpdFwiOiB0cnVlLFxuICBcIml0c1wiOiB0cnVlLFxuICBcImp1c3RcIjogdHJ1ZSxcbiAgXCJsZWFzdFwiOiB0cnVlLFxuICBcImxldFwiOiB0cnVlLFxuICBcImxpa2VcIjogdHJ1ZSxcbiAgXCJsaWtlbHlcIjogdHJ1ZSxcbiAgXCJtYXlcIjogdHJ1ZSxcbiAgXCJtZVwiOiB0cnVlLFxuICBcIm1pZ2h0XCI6IHRydWUsXG4gIFwibW9zdFwiOiB0cnVlLFxuICBcIm11c3RcIjogdHJ1ZSxcbiAgXCJteVwiOiB0cnVlLFxuICBcIm5laXRoZXJcIjogdHJ1ZSxcbiAgXCJub1wiOiB0cnVlLFxuICBcIm5vclwiOiB0cnVlLFxuICBcIm5vdFwiOiB0cnVlLFxuICBcIm9mXCI6IHRydWUsXG4gIFwib2ZmXCI6IHRydWUsXG4gIFwib2Z0ZW5cIjogdHJ1ZSxcbiAgXCJvblwiOiB0cnVlLFxuICBcIm9ubHlcIjogdHJ1ZSxcbiAgXCJvclwiOiB0cnVlLFxuICBcIm90aGVyXCI6IHRydWUsXG4gIFwib3VyXCI6IHRydWUsXG4gIFwib3duXCI6IHRydWUsXG4gIFwicmF0aGVyXCI6IHRydWUsXG4gIFwic2FpZFwiOiB0cnVlLFxuICBcInNheVwiOiB0cnVlLFxuICBcInNheXNcIjogdHJ1ZSxcbiAgXCJzaGVcIjogdHJ1ZSxcbiAgXCJzaG91bGRcIjogdHJ1ZSxcbiAgXCJzaW5jZVwiOiB0cnVlLFxuICBcInNvXCI6IHRydWUsXG4gIFwic29tZVwiOiB0cnVlLFxuICBcInRoYW5cIjogdHJ1ZSxcbiAgXCJ0aGF0XCI6IHRydWUsXG4gIFwidGhlXCI6IHRydWUsXG4gIFwidGhlaXJcIjogdHJ1ZSxcbiAgXCJ0aGVtXCI6IHRydWUsXG4gIFwidGhlblwiOiB0cnVlLFxuICBcInRoZXJlXCI6IHRydWUsXG4gIFwidGhlc2VcIjogdHJ1ZSxcbiAgXCJ0aGV5XCI6IHRydWUsXG4gIFwidGhpc1wiOiB0cnVlLFxuICBcInRpc1wiOiB0cnVlLFxuICBcInRvXCI6IHRydWUsXG4gIFwidG9vXCI6IHRydWUsXG4gIFwidHdhc1wiOiB0cnVlLFxuICBcInVzXCI6IHRydWUsXG4gIFwid2FudHNcIjogdHJ1ZSxcbiAgXCJ3YXNcIjogdHJ1ZSxcbiAgXCJ3ZVwiOiB0cnVlLFxuICBcIndlcmVcIjogdHJ1ZSxcbiAgXCJ3aGF0XCI6IHRydWUsXG4gIFwid2hlblwiOiB0cnVlLFxuICBcIndoZXJlXCI6IHRydWUsXG4gIFwid2hpY2hcIjogdHJ1ZSxcbiAgXCJ3aGlsZVwiOiB0cnVlLFxuICBcIndob1wiOiB0cnVlLFxuICBcIndob21cIjogdHJ1ZSxcbiAgXCJ3aHlcIjogdHJ1ZSxcbiAgXCJ3aWxsXCI6IHRydWUsXG4gIFwid2l0aFwiOiB0cnVlLFxuICBcIndvdWxkXCI6IHRydWUsXG4gIFwieWV0XCI6IHRydWUsXG4gIFwieW91XCI6IHRydWUsXG4gIFwieW91clwiOiB0cnVlXG59O1xuXG5lbGFzdGljbHVuci5zdG9wV29yZEZpbHRlci5zdG9wV29yZHMgPSBlbGFzdGljbHVuci5kZWZhdWx0U3RvcFdvcmRzO1xuXG5lbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlckZ1bmN0aW9uKGVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyLCAnc3RvcFdvcmRGaWx0ZXInKTtcbi8qIVxuICogZWxhc3RpY2x1bnIudHJpbW1lclxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBlbGFzdGljbHVuci50cmltbWVyIGlzIGEgcGlwZWxpbmUgZnVuY3Rpb24gZm9yIHRyaW1taW5nIG5vbiB3b3JkXG4gKiBjaGFyYWN0ZXJzIGZyb20gdGhlIGJlZ2luaW5nIGFuZCBlbmQgb2YgdG9rZW5zIGJlZm9yZSB0aGV5XG4gKiBlbnRlciB0aGUgaW5kZXguXG4gKlxuICogVGhpcyBpbXBsZW1lbnRhdGlvbiBtYXkgbm90IHdvcmsgY29ycmVjdGx5IGZvciBub24gbGF0aW5cbiAqIGNoYXJhY3RlcnMgYW5kIHNob3VsZCBlaXRoZXIgYmUgcmVtb3ZlZCBvciBhZGFwdGVkIGZvciB1c2VcbiAqIHdpdGggbGFuZ3VhZ2VzIHdpdGggbm9uLWxhdGluIGNoYXJhY3RlcnMuXG4gKlxuICogQG1vZHVsZVxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBwYXNzIHRocm91Z2ggdGhlIGZpbHRlclxuICogQHJldHVybiB7U3RyaW5nfVxuICogQHNlZSBlbGFzdGljbHVuci5QaXBlbGluZVxuICovXG5lbGFzdGljbHVuci50cmltbWVyID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIGlmICh0b2tlbiA9PT0gbnVsbCB8fCB0b2tlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0b2tlbiBzaG91bGQgbm90IGJlIHVuZGVmaW5lZCcpO1xuICB9XG5cbiAgcmV0dXJuIHRva2VuXG4gICAgLnJlcGxhY2UoL15cXFcrLywgJycpXG4gICAgLnJlcGxhY2UoL1xcVyskLywgJycpO1xufTtcblxuZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJGdW5jdGlvbihlbGFzdGljbHVuci50cmltbWVyLCAndHJpbW1lcicpO1xuLyohXG4gKiBlbGFzdGljbHVuci5JbnZlcnRlZEluZGV4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqIEluY2x1ZGVzIGNvZGUgZnJvbSAtIGh0dHA6Ly90YXJ0YXJ1cy5vcmcvfm1hcnRpbi9Qb3J0ZXJTdGVtbWVyL2pzLnR4dFxuICovXG5cbi8qKlxuICogZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleCBpcyB1c2VkIGZvciBlZmZpY2llbnRseSBzdG9yaW5nIGFuZFxuICogbG9va3VwIG9mIGRvY3VtZW50cyB0aGF0IGNvbnRhaW4gYSBnaXZlbiB0b2tlbi5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5yb290ID0geyBkb2NzOiB7fSwgZGY6IDAgfTtcbn07XG5cbi8qKlxuICogTG9hZHMgYSBwcmV2aW91c2x5IHNlcmlhbGlzZWQgaW52ZXJ0ZWQgaW5kZXguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNlcmlhbGlzZWREYXRhIFRoZSBzZXJpYWxpc2VkIGludmVydGVkIGluZGV4IHRvIGxvYWQuXG4gKiBAcmV0dXJuIHtlbGFzdGljbHVuci5JbnZlcnRlZEluZGV4fVxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LmxvYWQgPSBmdW5jdGlvbiAoc2VyaWFsaXNlZERhdGEpIHtcbiAgdmFyIGlkeCA9IG5ldyB0aGlzO1xuICBpZHgucm9vdCA9IHNlcmlhbGlzZWREYXRhLnJvb3Q7XG5cbiAgcmV0dXJuIGlkeDtcbn07XG5cbi8qKlxuICogQWRkcyBhIHt0b2tlbjogdG9rZW5JbmZvfSBwYWlyIHRvIHRoZSBpbnZlcnRlZCBpbmRleC5cbiAqIElmIHRoZSB0b2tlbiBhbHJlYWR5IGV4aXN0LCB0aGVuIHVwZGF0ZSB0aGUgdG9rZW5JbmZvLlxuICpcbiAqIHRva2VuSW5mbyBmb3JtYXQ6IHsgcmVmOiAxLCB0ZjogMn1cbiAqIHRva2VuSW5mb3Igc2hvdWxkIGNvbnRhaW5zIHRoZSBkb2N1bWVudCdzIHJlZiBhbmQgdGhlIHRmKHRva2VuIGZyZXF1ZW5jeSkgb2YgdGhhdCB0b2tlbiBpblxuICogdGhlIGRvY3VtZW50LlxuICpcbiAqIEJ5IGRlZmF1bHQgdGhpcyBmdW5jdGlvbiBzdGFydHMgYXQgdGhlIHJvb3Qgb2YgdGhlIGN1cnJlbnQgaW52ZXJ0ZWQgaW5kZXgsIGhvd2V2ZXJcbiAqIGl0IGNhbiBzdGFydCBhdCBhbnkgbm9kZSBvZiB0aGUgaW52ZXJ0ZWQgaW5kZXggaWYgcmVxdWlyZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuSW5mbyBmb3JtYXQ6IHsgcmVmOiAxLCB0ZjogMn1cbiAqIEBwYXJhbSB7T2JqZWN0fSByb290IEFuIG9wdGlvbmFsIG5vZGUgYXQgd2hpY2ggdG8gc3RhcnQgbG9va2luZyBmb3IgdGhlXG4gKiBjb3JyZWN0IHBsYWNlIHRvIGVudGVyIHRoZSBkb2MsIGJ5IGRlZmF1bHQgdGhlIHJvb3Qgb2YgdGhpcyBlbGFzdGljbHVuci5JbnZlcnRlZEluZGV4XG4gKiBpcyB1c2VkLlxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUuYWRkVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4sIHRva2VuSW5mbywgcm9vdCkge1xuICB2YXIgcm9vdCA9IHJvb3QgfHwgdGhpcy5yb290LFxuICAgICAgaWR4ID0gMDtcblxuICB3aGlsZSAoaWR4IDw9IHRva2VuLmxlbmd0aCAtIDEpIHtcbiAgICB2YXIga2V5ID0gdG9rZW5baWR4XTtcblxuICAgIGlmICghKGtleSBpbiByb290KSkgcm9vdFtrZXldID0ge2RvY3M6IHt9LCBkZjogMH07XG4gICAgaWR4ICs9IDE7XG4gICAgcm9vdCA9IHJvb3Rba2V5XTtcbiAgfVxuXG4gIHZhciBkb2NSZWYgPSB0b2tlbkluZm8ucmVmO1xuICBpZiAoIXJvb3QuZG9jc1tkb2NSZWZdKSB7XG4gICAgLy8gaWYgdGhpcyBkb2Mgbm90IGV4aXN0LCB0aGVuIGFkZCB0aGlzIGRvY1xuICAgIHJvb3QuZG9jc1tkb2NSZWZdID0ge3RmOiB0b2tlbkluZm8udGZ9O1xuICAgIHJvb3QuZGYgKz0gMTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpZiB0aGlzIGRvYyBhbHJlYWR5IGV4aXN0LCB0aGVuIHVwZGF0ZSB0b2tlbkluZm9cbiAgICByb290LmRvY3NbZG9jUmVmXSA9IHt0ZjogdG9rZW5JbmZvLnRmfTtcbiAgfVxufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIHRva2VuIGlzIGluIHRoaXMgZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5cbiAqIFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gYmUgY2hlY2tlZFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLmhhc1Rva2VuID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIGlmICghdG9rZW4pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbm9kZSA9IHRoaXMucm9vdDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2VuLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFub2RlW3Rva2VuW2ldXSkgcmV0dXJuIGZhbHNlO1xuICAgIG5vZGUgPSBub2RlW3Rva2VuW2ldXTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSBhIG5vZGUgZnJvbSB0aGUgaW52ZXJ0ZWQgaW5kZXggZm9yIGEgZ2l2ZW4gdG9rZW4uXG4gKiBJZiB0b2tlbiBub3QgZm91bmQgaW4gdGhpcyBJbnZlcnRlZEluZGV4LCByZXR1cm4gbnVsbC5cbiAqIFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gZ2V0IHRoZSBub2RlIGZvci5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBzZWUgSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUuZ2V0XG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS5nZXROb2RlID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIGlmICghdG9rZW4pIHJldHVybiBudWxsO1xuXG4gIHZhciBub2RlID0gdGhpcy5yb290O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIW5vZGVbdG9rZW5baV1dKSByZXR1cm4gbnVsbDtcbiAgICBub2RlID0gbm9kZVt0b2tlbltpXV07XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGRvY3VtZW50cyBvZiBhIGdpdmVuIHRva2VuLlxuICogSWYgdG9rZW4gbm90IGZvdW5kLCByZXR1cm4ge30uXG4gKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gZ2V0IHRoZSBkb2N1bWVudHMgZm9yLlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUuZ2V0RG9jcyA9IGZ1bmN0aW9uICh0b2tlbikge1xuICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZSh0b2tlbik7XG4gIGlmIChub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZXR1cm4gbm9kZS5kb2NzO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0ZXJtIGZyZXF1ZW5jeSBvZiBnaXZlbiB0b2tlbiBpbiBnaXZlbiBkb2NSZWYuXG4gKiBJZiB0b2tlbiBvciBkb2NSZWYgbm90IGZvdW5kLCByZXR1cm4gMC5cbiAqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBnZXQgdGhlIGRvY3VtZW50cyBmb3IuXG4gKiBAcGFyYW0ge1N0cmluZ3xJbnRlZ2VyfSBkb2NSZWZcbiAqIEByZXR1cm4ge0ludGVnZXJ9XG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS5nZXRUZXJtRnJlcXVlbmN5ID0gZnVuY3Rpb24gKHRva2VuLCBkb2NSZWYpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLmdldE5vZGUodG9rZW4pO1xuXG4gIGlmIChub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmICghKGRvY1JlZiBpbiBub2RlLmRvY3MpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gbm9kZS5kb2NzW2RvY1JlZl0udGY7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBkb2N1bWVudCBmcmVxdWVuY3kgb2YgZ2l2ZW4gdG9rZW4uXG4gKiBJZiB0b2tlbiBub3QgZm91bmQsIHJldHVybiAwLlxuICpcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIGdldCB0aGUgZG9jdW1lbnRzIGZvci5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLmdldERvY0ZyZXEgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgdmFyIG5vZGUgPSB0aGlzLmdldE5vZGUodG9rZW4pO1xuXG4gIGlmIChub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBub2RlLmRmO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRvY3VtZW50IGlkZW50aWZpZWQgYnkgZG9jdW1lbnQncyByZWYgZnJvbSB0aGUgdG9rZW4gaW4gdGhlIGludmVydGVkIGluZGV4LlxuICpcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gUmVtb3ZlIHRoZSBkb2N1bWVudCBmcm9tIHdoaWNoIHRva2VuLlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZiBUaGUgcmVmIG9mIHRoZSBkb2N1bWVudCB0byByZW1vdmUgZnJvbSBnaXZlbiB0b2tlbi5cbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLnJlbW92ZVRva2VuID0gZnVuY3Rpb24gKHRva2VuLCByZWYpIHtcbiAgaWYgKCF0b2tlbikgcmV0dXJuO1xuICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZSh0b2tlbik7XG5cbiAgaWYgKG5vZGUgPT0gbnVsbCkgcmV0dXJuO1xuXG4gIGlmIChyZWYgaW4gbm9kZS5kb2NzKSB7XG4gICAgZGVsZXRlIG5vZGUuZG9jc1tyZWZdO1xuICAgIG5vZGUuZGYgLT0gMTtcbiAgfVxufTtcblxuLyoqXG4gKiBGaW5kIGFsbCB0aGUgcG9zc2libGUgc3VmZml4ZXMgb2YgZ2l2ZW4gdG9rZW4gdXNpbmcgdG9rZW5zIGN1cnJlbnRseSBpbiB0aGUgaW52ZXJ0ZWQgaW5kZXguXG4gKiBJZiB0b2tlbiBub3QgZm91bmQsIHJldHVybiBlbXB0eSBBcnJheS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIGV4cGFuZC5cbiAqIEByZXR1cm4ge0FycmF5fVxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUuZXhwYW5kVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4sIG1lbW8sIHJvb3QpIHtcbiAgaWYgKHRva2VuID09IG51bGwgfHwgdG9rZW4gPT0gJycpIHJldHVybiBbXTtcbiAgdmFyIG1lbW8gPSBtZW1vIHx8IFtdO1xuXG4gIGlmIChyb290ID09IHZvaWQgMCkge1xuICAgIHJvb3QgPSB0aGlzLmdldE5vZGUodG9rZW4pO1xuICAgIGlmIChyb290ID09IG51bGwpIHJldHVybiBtZW1vO1xuICB9XG5cbiAgaWYgKHJvb3QuZGYgPiAwKSBtZW1vLnB1c2godG9rZW4pO1xuXG4gIGZvciAodmFyIGtleSBpbiByb290KSB7XG4gICAgaWYgKGtleSA9PT0gJ2RvY3MnKSBjb250aW51ZTtcbiAgICBpZiAoa2V5ID09PSAnZGYnKSBjb250aW51ZTtcbiAgICB0aGlzLmV4cGFuZFRva2VuKHRva2VuICsga2V5LCBtZW1vLCByb290W2tleV0pO1xuICB9XG5cbiAgcmV0dXJuIG1lbW87XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSByZXByZXNlbnRhdGlvbiBvZiB0aGUgaW52ZXJ0ZWQgaW5kZXggcmVhZHkgZm9yIHNlcmlhbGlzYXRpb24uXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJvb3Q6IHRoaXMucm9vdFxuICB9O1xufTtcblxuLyohXG4gKiBlbGFzdGljbHVuci5Db25maWd1cmF0aW9uXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuIFxuIC8qKiBcbiAgKiBlbGFzdGljbHVuci5Db25maWd1cmF0aW9uIGlzIHVzZWQgdG8gYW5hbHl6ZSB0aGUgdXNlciBzZWFyY2ggY29uZmlndXJhdGlvbi5cbiAgKiBcbiAgKiBCeSBlbGFzdGljbHVuci5Db25maWd1cmF0aW9uIHVzZXIgY291bGQgc2V0IHF1ZXJ5LXRpbWUgYm9vc3RpbmcsIGJvb2xlYW4gbW9kZWwgaW4gZWFjaCBmaWVsZC5cbiAgKiBcbiAgKiBDdXJyZW50bHkgY29uZmlndXJhdGlvbiBzdXBwb3J0czpcbiAgKiAxLiBxdWVyeS10aW1lIGJvb3N0aW5nLCB1c2VyIGNvdWxkIHNldCBob3cgdG8gYm9vc3QgZWFjaCBmaWVsZC5cbiAgKiAyLiBib29sZWFuIG1vZGVsIGNob3NpbmcsIHVzZXIgY291bGQgY2hvb3NlIHdoaWNoIGJvb2xlYW4gbW9kZWwgdG8gdXNlIGZvciBlYWNoIGZpZWxkLlxuICAqIDMuIHRva2VuIGV4cGFuZGF0aW9uLCB1c2VyIGNvdWxkIHNldCB0b2tlbiBleHBhbmQgdG8gVHJ1ZSB0byBpbXByb3ZlIFJlY2FsbC4gRGVmYXVsdCBpcyBGYWxzZS5cbiAgKiBcbiAgKiBRdWVyeSB0aW1lIGJvb3N0aW5nIG11c3QgYmUgY29uZmlndXJlZCBieSBmaWVsZCBjYXRlZ29yeSwgXCJib29sZWFuXCIgbW9kZWwgY291bGQgYmUgY29uZmlndXJlZCBcbiAgKiBieSBib3RoIGZpZWxkIGNhdGVnb3J5IG9yIGdsb2JhbGx5IGFzIHRoZSBmb2xsb3dpbmcgZXhhbXBsZS4gRmllbGQgY29uZmlndXJhdGlvbiBmb3IgXCJib29sZWFuXCJcbiAgKiB3aWxsIG92ZXJ3cml0ZSBnbG9iYWwgY29uZmlndXJhdGlvbi5cbiAgKiBUb2tlbiBleHBhbmQgY291bGQgYmUgY29uZmlndXJlZCBib3RoIGJ5IGZpZWxkIGNhdGVnb3J5IG9yIGdvbGJhbGx5LiBMb2NhbCBmaWVsZCBjb25maWd1cmF0aW9uIHdpbGxcbiAgKiBvdmVyd3JpdGUgZ2xvYmFsIGNvbmZpZ3VyYXRpb24uXG4gICogXG4gICogY29uZmlndXJhdGlvbiBleGFtcGxlOlxuICAqIHtcbiAgKiAgIGZpZWxkczp7IFxuICAqICAgICB0aXRsZToge2Jvb3N0OiAyfSxcbiAgKiAgICAgYm9keToge2Jvb3N0OiAxfVxuICAqICAgfSxcbiAgKiAgIGJvb2w6IFwiT1JcIlxuICAqIH1cbiAgKiBcbiAgKiBcImJvb2xcIiBmaWVsZCBjb25maWd1YXRpb24gb3ZlcndyaXRlIGdsb2JhbCBjb25maWd1YXRpb24gZXhhbXBsZTpcbiAgKiB7XG4gICogICBmaWVsZHM6eyBcbiAgKiAgICAgdGl0bGU6IHtib29zdDogMiwgYm9vbDogXCJBTkRcIn0sXG4gICogICAgIGJvZHk6IHtib29zdDogMX1cbiAgKiAgIH0sXG4gICogICBib29sOiBcIk9SXCJcbiAgKiB9XG4gICogXG4gICogXCJleHBhbmRcIiBleGFtcGxlOlxuICAqIHtcbiAgKiAgIGZpZWxkczp7IFxuICAqICAgICB0aXRsZToge2Jvb3N0OiAyLCBib29sOiBcIkFORFwifSxcbiAgKiAgICAgYm9keToge2Jvb3N0OiAxfVxuICAqICAgfSxcbiAgKiAgIGJvb2w6IFwiT1JcIixcbiAgKiAgIGV4cGFuZDogdHJ1ZVxuICAqIH1cbiAgKiBcbiAgKiBcImV4cGFuZFwiIGV4YW1wbGUgZm9yIGZpZWxkIGNhdGVnb3J5OlxuICAqIHtcbiAgKiAgIGZpZWxkczp7IFxuICAqICAgICB0aXRsZToge2Jvb3N0OiAyLCBib29sOiBcIkFORFwiLCBleHBhbmQ6IHRydWV9LFxuICAqICAgICBib2R5OiB7Ym9vc3Q6IDF9XG4gICogICB9LFxuICAqICAgYm9vbDogXCJPUlwiXG4gICogfVxuICAqIFxuICAqIHNldHRpbmcgdGhlIGJvb3N0IHRvIDAgaWdub3JlcyB0aGUgZmllbGQgKHRoaXMgd2lsbCBvbmx5IHNlYXJjaCB0aGUgdGl0bGUpOlxuICAqIHtcbiAgKiAgIGZpZWxkczp7XG4gICogICAgIHRpdGxlOiB7Ym9vc3Q6IDF9LFxuICAqICAgICBib2R5OiB7Ym9vc3Q6IDB9XG4gICogICB9XG4gICogfVxuICAqXG4gICogdGhlbiwgdXNlciBjb3VsZCBzZWFyY2ggd2l0aCBjb25maWd1cmF0aW9uIHRvIGRvIHF1ZXJ5LXRpbWUgYm9vc3RpbmcuXG4gICogaWR4LnNlYXJjaCgnb3JhY2xlIGRhdGFiYXNlJywge2ZpZWxkczoge3RpdGxlOiB7Ym9vc3Q6IDJ9LCBib2R5OiB7Ym9vc3Q6IDF9fX0pO1xuICAqIFxuICAqIFxuICAqIEBjb25zdHJ1Y3RvclxuICAqIFxuICAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcgdXNlciBjb25maWd1cmF0aW9uXG4gICogQHBhcmFtIHtBcnJheX0gZmllbGRzIGZpZWxkcyBvZiBpbmRleCBpbnN0YW5jZVxuICAqIEBtb2R1bGVcbiAgKi9cbmVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24gPSBmdW5jdGlvbiAoY29uZmlnLCBmaWVsZHMpIHtcbiAgdmFyIGNvbmZpZyA9IGNvbmZpZyB8fCAnJztcblxuICBpZiAoZmllbGRzID09IHVuZGVmaW5lZCB8fCBmaWVsZHMgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignZmllbGRzIHNob3VsZCBub3QgYmUgbnVsbCcpO1xuICB9XG5cbiAgdGhpcy5jb25maWcgPSB7fTtcblxuICB2YXIgdXNlckNvbmZpZztcbiAgdHJ5IHtcbiAgICB1c2VyQ29uZmlnID0gSlNPTi5wYXJzZShjb25maWcpO1xuICAgIHRoaXMuYnVpbGRVc2VyQ29uZmlnKHVzZXJDb25maWcsIGZpZWxkcyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZWxhc3RpY2x1bnIudXRpbHMud2FybigndXNlciBjb25maWd1cmF0aW9uIHBhcnNlIGZhaWxlZCwgd2lsbCB1c2UgZGVmYXVsdCBjb25maWd1cmF0aW9uJyk7XG4gICAgdGhpcy5idWlsZERlZmF1bHRDb25maWcoZmllbGRzKTtcbiAgfVxufTtcblxuLyoqXG4gKiBCdWlsZCBkZWZhdWx0IHNlYXJjaCBjb25maWd1cmF0aW9uLlxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBmaWVsZHMgZmllbGRzIG9mIGluZGV4IGluc3RhbmNlXG4gKi9cbmVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24ucHJvdG90eXBlLmJ1aWxkRGVmYXVsdENvbmZpZyA9IGZ1bmN0aW9uIChmaWVsZHMpIHtcbiAgdGhpcy5yZXNldCgpO1xuICBmaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICB0aGlzLmNvbmZpZ1tmaWVsZF0gPSB7XG4gICAgICBib29zdDogMSxcbiAgICAgIGJvb2w6IFwiT1JcIixcbiAgICAgIGV4cGFuZDogZmFsc2VcbiAgICB9O1xuICB9LCB0aGlzKTtcbn07XG5cbi8qKlxuICogQnVpbGQgdXNlciBjb25maWd1cmF0aW9uLlxuICogXG4gKiBAcGFyYW0ge0pTT059IGNvbmZpZyBVc2VyIEpTT04gY29uZmlndXJhdG9pblxuICogQHBhcmFtIHtBcnJheX0gZmllbGRzIGZpZWxkcyBvZiBpbmRleCBpbnN0YW5jZVxuICovXG5lbGFzdGljbHVuci5Db25maWd1cmF0aW9uLnByb3RvdHlwZS5idWlsZFVzZXJDb25maWcgPSBmdW5jdGlvbiAoY29uZmlnLCBmaWVsZHMpIHtcbiAgdmFyIGdsb2JhbF9ib29sID0gXCJPUlwiO1xuICB2YXIgZ2xvYmFsX2V4cGFuZCA9IGZhbHNlO1xuXG4gIHRoaXMucmVzZXQoKTtcbiAgaWYgKCdib29sJyBpbiBjb25maWcpIHtcbiAgICBnbG9iYWxfYm9vbCA9IGNvbmZpZ1snYm9vbCddIHx8IGdsb2JhbF9ib29sO1xuICB9XG5cbiAgaWYgKCdleHBhbmQnIGluIGNvbmZpZykge1xuICAgIGdsb2JhbF9leHBhbmQgPSBjb25maWdbJ2V4cGFuZCddIHx8IGdsb2JhbF9leHBhbmQ7XG4gIH1cblxuICBpZiAoJ2ZpZWxkcycgaW4gY29uZmlnKSB7XG4gICAgZm9yICh2YXIgZmllbGQgaW4gY29uZmlnWydmaWVsZHMnXSkge1xuICAgICAgaWYgKGZpZWxkcy5pbmRleE9mKGZpZWxkKSA+IC0xKSB7XG4gICAgICAgIHZhciBmaWVsZF9jb25maWcgPSBjb25maWdbJ2ZpZWxkcyddW2ZpZWxkXTtcbiAgICAgICAgdmFyIGZpZWxkX2V4cGFuZCA9IGdsb2JhbF9leHBhbmQ7XG4gICAgICAgIGlmIChmaWVsZF9jb25maWcuZXhwYW5kICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZpZWxkX2V4cGFuZCA9IGZpZWxkX2NvbmZpZy5leHBhbmQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZ1tmaWVsZF0gPSB7XG4gICAgICAgICAgYm9vc3Q6IChmaWVsZF9jb25maWcuYm9vc3QgfHwgZmllbGRfY29uZmlnLmJvb3N0ID09PSAwKSA/IGZpZWxkX2NvbmZpZy5ib29zdCA6IDEsXG4gICAgICAgICAgYm9vbDogZmllbGRfY29uZmlnLmJvb2wgfHwgZ2xvYmFsX2Jvb2wsXG4gICAgICAgICAgZXhwYW5kOiBmaWVsZF9leHBhbmRcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsYXN0aWNsdW5yLnV0aWxzLndhcm4oJ2ZpZWxkIG5hbWUgaW4gdXNlciBjb25maWd1cmF0aW9uIG5vdCBmb3VuZCBpbiBpbmRleCBpbnN0YW5jZSBmaWVsZHMnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hZGRBbGxGaWVsZHMyVXNlckNvbmZpZyhnbG9iYWxfYm9vbCwgZ2xvYmFsX2V4cGFuZCwgZmllbGRzKTtcbiAgfVxufTtcblxuLyoqXG4gKiBBZGQgYWxsIGZpZWxkcyB0byB1c2VyIHNlYXJjaCBjb25maWd1cmF0aW9uLlxuICogXG4gKiBAcGFyYW0ge1N0cmluZ30gYm9vbCBCb29sZWFuIG1vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwYW5kIEV4cGFuZCBtb2RlbFxuICogQHBhcmFtIHtBcnJheX0gZmllbGRzIGZpZWxkcyBvZiBpbmRleCBpbnN0YW5jZVxuICovXG5lbGFzdGljbHVuci5Db25maWd1cmF0aW9uLnByb3RvdHlwZS5hZGRBbGxGaWVsZHMyVXNlckNvbmZpZyA9IGZ1bmN0aW9uIChib29sLCBleHBhbmQsIGZpZWxkcykge1xuICBmaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICB0aGlzLmNvbmZpZ1tmaWVsZF0gPSB7XG4gICAgICBib29zdDogMSxcbiAgICAgIGJvb2w6IGJvb2wsXG4gICAgICBleHBhbmQ6IGV4cGFuZFxuICAgIH07XG4gIH0sIHRoaXMpO1xufTtcblxuLyoqXG4gKiBnZXQgY3VycmVudCB1c2VyIGNvbmZpZ3VyYXRpb25cbiAqL1xuZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5jb25maWc7XG59O1xuXG4vKipcbiAqIHJlc2V0IHVzZXIgc2VhcmNoIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNvbmZpZyA9IHt9O1xufTtcbi8qKlxuICogc29ydGVkX3NldC5qcyBpcyBhZGRlZCBvbmx5IHRvIG1ha2UgZWxhc3RpY2x1bnIuanMgY29tcGF0aWJsZSB3aXRoIGx1bnItbGFuZ3VhZ2VzLlxuICogaWYgZWxhc3RpY2x1bnIuanMgc3VwcG9ydCBkaWZmZXJlbnQgbGFuZ3VhZ2VzIGJ5IGRlZmF1bHQsIHRoaXMgd2lsbCBtYWtlIGVsYXN0aWNsdW5yLmpzXG4gKiBtdWNoIGJpZ2dlciB0aGF0IG5vdCBnb29kIGZvciBicm93c2VyIHVzYWdlLlxuICpcbiAqL1xuXG5cbi8qIVxuICogbHVuci5Tb3J0ZWRTZXRcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqL1xuXG4vKipcbiAqIGx1bnIuU29ydGVkU2V0cyBhcmUgdXNlZCB0byBtYWludGFpbiBhbiBhcnJheSBvZiB1bmlxIHZhbHVlcyBpbiBhIHNvcnRlZFxuICogb3JkZXIuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmx1bnIuU29ydGVkU2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmxlbmd0aCA9IDBcbiAgdGhpcy5lbGVtZW50cyA9IFtdXG59XG5cbi8qKlxuICogTG9hZHMgYSBwcmV2aW91c2x5IHNlcmlhbGlzZWQgc29ydGVkIHNldC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBzZXJpYWxpc2VkRGF0YSBUaGUgc2VyaWFsaXNlZCBzZXQgdG8gbG9hZC5cbiAqIEByZXR1cm5zIHtsdW5yLlNvcnRlZFNldH1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQubG9hZCA9IGZ1bmN0aW9uIChzZXJpYWxpc2VkRGF0YSkge1xuICB2YXIgc2V0ID0gbmV3IHRoaXNcblxuICBzZXQuZWxlbWVudHMgPSBzZXJpYWxpc2VkRGF0YVxuICBzZXQubGVuZ3RoID0gc2VyaWFsaXNlZERhdGEubGVuZ3RoXG5cbiAgcmV0dXJuIHNldFxufVxuXG4vKipcbiAqIEluc2VydHMgbmV3IGl0ZW1zIGludG8gdGhlIHNldCBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbiB0byBtYWludGFpbiB0aGVcbiAqIG9yZGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBUaGUgb2JqZWN0cyB0byBhZGQgdG8gdGhpcyBzZXQuXG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpLCBlbGVtZW50XG5cbiAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGVsZW1lbnQgPSBhcmd1bWVudHNbaV1cbiAgICBpZiAofnRoaXMuaW5kZXhPZihlbGVtZW50KSkgY29udGludWVcbiAgICB0aGlzLmVsZW1lbnRzLnNwbGljZSh0aGlzLmxvY2F0aW9uRm9yKGVsZW1lbnQpLCAwLCBlbGVtZW50KVxuICB9XG5cbiAgdGhpcy5sZW5ndGggPSB0aGlzLmVsZW1lbnRzLmxlbmd0aFxufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoaXMgc29ydGVkIHNldCBpbnRvIGFuIGFycmF5LlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmVsZW1lbnRzLnNsaWNlKClcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGFycmF5IHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5XG4gKiBlbGVtZW50IGluIHRoaXMgc29ydGVkIHNldC5cbiAqXG4gKiBEZWxlZ2F0ZXMgdG8gQXJyYXkucHJvdG90eXBlLm1hcCBhbmQgaGFzIHRoZSBzYW1lIHNpZ25hdHVyZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb24gZWFjaCBlbGVtZW50IG9mIHRoZVxuICogc2V0LlxuICogQHBhcmFtIHtPYmplY3R9IGN0eCBBbiBvcHRpb25hbCBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCBhcyB0aGUgY29udGV4dFxuICogZm9yIHRoZSBmdW5jdGlvbiBmbi5cbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChmbiwgY3R4KSB7XG4gIHJldHVybiB0aGlzLmVsZW1lbnRzLm1hcChmbiwgY3R4KVxufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBwZXIgc29ydGVkIHNldCBlbGVtZW50LlxuICpcbiAqIERlbGVnYXRlcyB0byBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCBhbmQgaGFzIHRoZSBzYW1lIHNpZ25hdHVyZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb24gZWFjaCBlbGVtZW50IG9mIHRoZVxuICogc2V0LlxuICogQHBhcmFtIHtPYmplY3R9IGN0eCBBbiBvcHRpb25hbCBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCBhcyB0aGUgY29udGV4dFxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICogZm9yIHRoZSBmdW5jdGlvbiBmbi5cbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoZm4sIGN0eCkge1xuICByZXR1cm4gdGhpcy5lbGVtZW50cy5mb3JFYWNoKGZuLCBjdHgpXG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaW5kZXggYXQgd2hpY2ggYSBnaXZlbiBlbGVtZW50IGNhbiBiZSBmb3VuZCBpbiB0aGVcbiAqIHNvcnRlZCBzZXQsIG9yIC0xIGlmIGl0IGlzIG5vdCBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIFRoZSBvYmplY3QgdG8gbG9jYXRlIGluIHRoZSBzb3J0ZWQgc2V0LlxuICogQHJldHVybnMge051bWJlcn1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiAoZWxlbSkge1xuICB2YXIgc3RhcnQgPSAwLFxuICAgICAgZW5kID0gdGhpcy5lbGVtZW50cy5sZW5ndGgsXG4gICAgICBzZWN0aW9uTGVuZ3RoID0gZW5kIC0gc3RhcnQsXG4gICAgICBwaXZvdCA9IHN0YXJ0ICsgTWF0aC5mbG9vcihzZWN0aW9uTGVuZ3RoIC8gMiksXG4gICAgICBwaXZvdEVsZW0gPSB0aGlzLmVsZW1lbnRzW3Bpdm90XVxuXG4gIHdoaWxlIChzZWN0aW9uTGVuZ3RoID4gMSkge1xuICAgIGlmIChwaXZvdEVsZW0gPT09IGVsZW0pIHJldHVybiBwaXZvdFxuXG4gICAgaWYgKHBpdm90RWxlbSA8IGVsZW0pIHN0YXJ0ID0gcGl2b3RcbiAgICBpZiAocGl2b3RFbGVtID4gZWxlbSkgZW5kID0gcGl2b3RcblxuICAgIHNlY3Rpb25MZW5ndGggPSBlbmQgLSBzdGFydFxuICAgIHBpdm90ID0gc3RhcnQgKyBNYXRoLmZsb29yKHNlY3Rpb25MZW5ndGggLyAyKVxuICAgIHBpdm90RWxlbSA9IHRoaXMuZWxlbWVudHNbcGl2b3RdXG4gIH1cblxuICBpZiAocGl2b3RFbGVtID09PSBlbGVtKSByZXR1cm4gcGl2b3RcblxuICByZXR1cm4gLTFcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwb3NpdGlvbiB3aXRoaW4gdGhlIHNvcnRlZCBzZXQgdGhhdCBhbiBlbGVtZW50IHNob3VsZCBiZVxuICogaW5zZXJ0ZWQgYXQgdG8gbWFpbnRhaW4gdGhlIGN1cnJlbnQgb3JkZXIgb2YgdGhlIHNldC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCB0aGUgZWxlbWVudCB0byBzZWFyY2ggZm9yIGRvZXMgbm90IGFscmVhZHkgZXhpc3RcbiAqIGluIHRoZSBzb3J0ZWQgc2V0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIFRoZSBlbGVtIHRvIGZpbmQgdGhlIHBvc2l0aW9uIGZvciBpbiB0aGUgc2V0XG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUubG9jYXRpb25Gb3IgPSBmdW5jdGlvbiAoZWxlbSkge1xuICB2YXIgc3RhcnQgPSAwLFxuICAgICAgZW5kID0gdGhpcy5lbGVtZW50cy5sZW5ndGgsXG4gICAgICBzZWN0aW9uTGVuZ3RoID0gZW5kIC0gc3RhcnQsXG4gICAgICBwaXZvdCA9IHN0YXJ0ICsgTWF0aC5mbG9vcihzZWN0aW9uTGVuZ3RoIC8gMiksXG4gICAgICBwaXZvdEVsZW0gPSB0aGlzLmVsZW1lbnRzW3Bpdm90XVxuXG4gIHdoaWxlIChzZWN0aW9uTGVuZ3RoID4gMSkge1xuICAgIGlmIChwaXZvdEVsZW0gPCBlbGVtKSBzdGFydCA9IHBpdm90XG4gICAgaWYgKHBpdm90RWxlbSA+IGVsZW0pIGVuZCA9IHBpdm90XG5cbiAgICBzZWN0aW9uTGVuZ3RoID0gZW5kIC0gc3RhcnRcbiAgICBwaXZvdCA9IHN0YXJ0ICsgTWF0aC5mbG9vcihzZWN0aW9uTGVuZ3RoIC8gMilcbiAgICBwaXZvdEVsZW0gPSB0aGlzLmVsZW1lbnRzW3Bpdm90XVxuICB9XG5cbiAgaWYgKHBpdm90RWxlbSA+IGVsZW0pIHJldHVybiBwaXZvdFxuICBpZiAocGl2b3RFbGVtIDwgZWxlbSkgcmV0dXJuIHBpdm90ICsgMVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbHVuci5Tb3J0ZWRTZXQgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgaW4gdGhlIGludGVyc2VjdGlvblxuICogb2YgdGhpcyBzZXQgYW5kIHRoZSBwYXNzZWQgc2V0LlxuICpcbiAqIEBwYXJhbSB7bHVuci5Tb3J0ZWRTZXR9IG90aGVyU2V0IFRoZSBzZXQgdG8gaW50ZXJzZWN0IHdpdGggdGhpcyBzZXQuXG4gKiBAcmV0dXJucyB7bHVuci5Tb3J0ZWRTZXR9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS5pbnRlcnNlY3QgPSBmdW5jdGlvbiAob3RoZXJTZXQpIHtcbiAgdmFyIGludGVyc2VjdFNldCA9IG5ldyBsdW5yLlNvcnRlZFNldCxcbiAgICAgIGkgPSAwLCBqID0gMCxcbiAgICAgIGFfbGVuID0gdGhpcy5sZW5ndGgsIGJfbGVuID0gb3RoZXJTZXQubGVuZ3RoLFxuICAgICAgYSA9IHRoaXMuZWxlbWVudHMsIGIgPSBvdGhlclNldC5lbGVtZW50c1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKGkgPiBhX2xlbiAtIDEgfHwgaiA+IGJfbGVuIC0gMSkgYnJlYWtcblxuICAgIGlmIChhW2ldID09PSBiW2pdKSB7XG4gICAgICBpbnRlcnNlY3RTZXQuYWRkKGFbaV0pXG4gICAgICBpKyssIGorK1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBpZiAoYVtpXSA8IGJbal0pIHtcbiAgICAgIGkrK1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBpZiAoYVtpXSA+IGJbal0pIHtcbiAgICAgIGorK1xuICAgICAgY29udGludWVcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGludGVyc2VjdFNldFxufVxuXG4vKipcbiAqIE1ha2VzIGEgY29weSBvZiB0aGlzIHNldFxuICpcbiAqIEByZXR1cm5zIHtsdW5yLlNvcnRlZFNldH1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY2xvbmUgPSBuZXcgbHVuci5Tb3J0ZWRTZXRcblxuICBjbG9uZS5lbGVtZW50cyA9IHRoaXMudG9BcnJheSgpXG4gIGNsb25lLmxlbmd0aCA9IGNsb25lLmVsZW1lbnRzLmxlbmd0aFxuXG4gIHJldHVybiBjbG9uZVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbHVuci5Tb3J0ZWRTZXQgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgaW4gdGhlIHVuaW9uXG4gKiBvZiB0aGlzIHNldCBhbmQgdGhlIHBhc3NlZCBzZXQuXG4gKlxuICogQHBhcmFtIHtsdW5yLlNvcnRlZFNldH0gb3RoZXJTZXQgVGhlIHNldCB0byB1bmlvbiB3aXRoIHRoaXMgc2V0LlxuICogQHJldHVybnMge2x1bnIuU29ydGVkU2V0fVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUudW5pb24gPSBmdW5jdGlvbiAob3RoZXJTZXQpIHtcbiAgdmFyIGxvbmdTZXQsIHNob3J0U2V0LCB1bmlvblNldFxuXG4gIGlmICh0aGlzLmxlbmd0aCA+PSBvdGhlclNldC5sZW5ndGgpIHtcbiAgICBsb25nU2V0ID0gdGhpcywgc2hvcnRTZXQgPSBvdGhlclNldFxuICB9IGVsc2Uge1xuICAgIGxvbmdTZXQgPSBvdGhlclNldCwgc2hvcnRTZXQgPSB0aGlzXG4gIH1cblxuICB1bmlvblNldCA9IGxvbmdTZXQuY2xvbmUoKVxuXG4gIGZvcih2YXIgaSA9IDAsIHNob3J0U2V0RWxlbWVudHMgPSBzaG9ydFNldC50b0FycmF5KCk7IGkgPCBzaG9ydFNldEVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICB1bmlvblNldC5hZGQoc2hvcnRTZXRFbGVtZW50c1tpXSlcbiAgfVxuXG4gIHJldHVybiB1bmlvblNldFxufVxuXG4vKipcbiAqIFJldHVybnMgYSByZXByZXNlbnRhdGlvbiBvZiB0aGUgc29ydGVkIHNldCByZWFkeSBmb3Igc2VyaWFsaXNhdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnRvQXJyYXkoKVxufVxuICAvKipcbiAgICogZXhwb3J0IHRoZSBtb2R1bGUgdmlhIEFNRCwgQ29tbW9uSlMgb3IgYXMgYSBicm93c2VyIGdsb2JhbFxuICAgKiBFeHBvcnQgY29kZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvcmV0dXJuRXhwb3J0cy5qc1xuICAgKi9cbiAgOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgIGRlZmluZShmYWN0b3J5KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAvKipcbiAgICAgICAqIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgICAgICogb25seSBDb21tb25KUy1saWtlIGVudmlyb21lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAgICAqIGxpa2UgTm9kZS5cbiAgICAgICAqL1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KClcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgIHJvb3QuZWxhc3RpY2x1bnIgPSBmYWN0b3J5KClcbiAgICB9XG4gIH0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIEp1c3QgcmV0dXJuIGEgdmFsdWUgdG8gZGVmaW5lIHRoZSBtb2R1bGUgZXhwb3J0LlxuICAgICAqIFRoaXMgZXhhbXBsZSByZXR1cm5zIGFuIG9iamVjdCwgYnV0IHRoZSBtb2R1bGVcbiAgICAgKiBjYW4gcmV0dXJuIGEgZnVuY3Rpb24gYXMgdGhlIGV4cG9ydGVkIHZhbHVlLlxuICAgICAqL1xuICAgIHJldHVybiBlbGFzdGljbHVuclxuICB9KSlcbn0pKCk7XG4iLCJpbXBvcnQgeyBmcm9tSlNPTlNhZmVUZXh0LCB0b0pTT05TYWZlVGV4dCB9IGZyb20gXCIuL3V0aWwvanNvbi10ZXh0LWNvbnZlcnRlclwiO1xyXG5pbXBvcnQgeyBjb3B5VG9DbGlwYm9hcmQgfSBmcm9tIFwiLi91dGlsL2NsaXBib2FyZFwiO1xyXG5pbXBvcnQgeyBhZGRJdGVtVG9TdGFjaywgcmVtb3ZlSXRlbUZyb21TdGFjayB9IGZyb20gXCIuL2ZlYXR1cmVzL3NlYXJjaC1zdGFja1wiO1xyXG5pbXBvcnQgeyBMZWZ0UGFuZVR5cGUsIHN3aXRjaFRvRGVza3RvcCwgd2hpY2hMZWZ0UGFuZUFjdGl2ZSB9IGZyb20gXCIuL2ZlYXR1cmVzL3BhbmUtbWFuYWdlbWVudFwiO1xyXG5pbXBvcnQgeyBhZGRJdGVtVG9EZXNrdG9wLCByZWZDb21iaW5lZEl0ZW1zLCByZW1vdmVJdGVtRnJvbURlc2t0b3AgfSBmcm9tIFwiLi9mZWF0dXJlcy9kZXNrdG9wXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhcmRKU09OIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgY2F0ZWdvcmllczogc3RyaW5nW107XHJcbiAgICBzdWJjYXJkczogc3RyaW5nW107XHJcbiAgICBjcmVhdGlvbkRhdGU6IERhdGU7XHJcbiAgICBlZGl0RGF0ZTogRGF0ZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhcmQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdW5pcXVlSUQ6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgY2F0ZWdvcmllczogc3RyaW5nW107XHJcbiAgICBzdWJDYXJkczogc3RyaW5nW107XHJcbiAgICBjcmVhdGlvbkRhdGU6IERhdGU7XHJcbiAgICBlZGl0RGF0ZTogRGF0ZTtcclxuXHJcbiAgICBub2RlOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG5vZGVEZXNrdG9wQ29weTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBub2RlSUQ6IHN0cmluZztcclxuICAgIGRpc3BsYXlNZXRhRGF0YTogYm9vbGVhbjtcclxuICAgIGFjdGl2ZU5hbWU6IGJvb2xlYW47XHJcbiAgICBjb3B5VG9EZXNrdG9wQnV0dG9uOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIGlkOiBzdHJpbmcgPSAnJyl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnVuaXF1ZUlEID0gbmFtZS5yZXBsYWNlKC8gL2csICctJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZnJvbUpTT05TYWZlVGV4dChkZXNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRpb25EYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmVkaXREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnN1YkNhcmRzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheU1ldGFEYXRhID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmFjdGl2ZU5hbWUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29weVRvRGVza3RvcEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMubm9kZURlc2t0b3BDb3B5ID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQsIHRydWUpO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuY29uc3RydWN0Tm9kZUludGVybmFsKGlkKTtcclxuICAgICAgICB0aGlzLm5vZGVJRCA9IGlkLmxlbmd0aCA+IDAgPyBpZCA6IHRoaXMudW5pcXVlSUQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0Tm9kZShpZDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLm5vZGVEZXNrdG9wQ29weSA9IHRoaXMuY29uc3RydWN0Tm9kZUludGVybmFsKGlkLCB0cnVlKTtcclxuICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLmNvbnN0cnVjdE5vZGVJbnRlcm5hbChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0Tm9kZUludGVybmFsKGlkOiBzdHJpbmcsIGlzRGVza3RvcCA9IGZhbHNlKXtcclxuICAgICAgICAvLyBjcmVhdGUgYmFzZSBub2RlXHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IG5hbWVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgbmFtZU5vZGUuaW5uZXJUZXh0ID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uTm9kZS5pbm5lckhUTUwgPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQobmFtZU5vZGUpO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb25Ob2RlKTtcclxuXHJcbiAgICAgICAgbmFtZU5vZGUuY2xhc3NOYW1lID0gJ2NhcmQtbmFtZSc7XHJcbiAgICAgICAgbmFtZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYoIXRoaXMuYWN0aXZlTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZih3aGljaExlZnRQYW5lQWN0aXZlKCkgPT09IExlZnRQYW5lVHlwZS5EZXNrdG9wKXtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW1Gcm9tRGVza3RvcCh0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW1Gcm9tU3RhY2sodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5hbWVOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmFjdGl2ZU5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgaWYod2hpY2hMZWZ0UGFuZUFjdGl2ZSgpID09PSBMZWZ0UGFuZVR5cGUuRGVza3RvcCl7XHJcbiAgICAgICAgICAgICAgICBhZGRJdGVtVG9EZXNrdG9wKHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWRkSXRlbVRvU3RhY2sodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBzdWJjYXJkc1xyXG4gICAgICAgIGlmKHRoaXMuc3ViQ2FyZHMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmNhcmROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmNhcmRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNCcpO1xyXG4gICAgICAgICAgICBjb25zdCBzdWJjYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnRTdWJjYXJkTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodFN1YmNhcmRMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHN1YmNhcmRIZWFkZXIuaW5uZXJIVE1MID0gJ1JlbGF0ZWQ6J1xyXG4gICAgICAgICAgICBzdWJjYXJkSGVhZGVyLmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtaGVhZGVyJztcclxuICAgICAgICAgICAgc3ViY2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChsZWZ0U3ViY2FyZExpc3QpO1xyXG4gICAgICAgICAgICBzdWJjYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0U3ViY2FyZExpc3QpO1xyXG4gICAgICAgICAgICBzdWJjYXJkQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtY29udGFpbmVyJztcclxuICAgICAgICAgICAgbGVmdFN1YmNhcmRMaXN0LmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtbGVmdGxpc3QnO1xyXG4gICAgICAgICAgICByaWdodFN1YmNhcmRMaXN0LmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtcmlnaHRsaXN0JztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVN1YmNhcmRJdGVtID0gKGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViY2FyZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIHN1YmNhcmRJdGVtLmlubmVySFRNTCA9IGAtICR7dGhpcy5zdWJDYXJkc1tpXX1gO1xyXG4gICAgICAgICAgICAgICAgc3ViY2FyZEl0ZW0uY2xhc3NOYW1lID0gJ2NhcmQtc3ViY2FyZC1pdGVtJztcclxuICAgICAgICAgICAgICAgIHN1YmNhcmRJdGVtLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcclxuICAgICAgICAgICAgICAgIHN1YmNhcmRJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlZkNvbWJpbmVkSXRlbXMuZmluZChpdGVtID0+IGl0ZW0udW5pcXVlSUQgPT09IHRoaXMuc3ViQ2FyZHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0gPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIXRoaXMuYWN0aXZlTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHdoaWNoTGVmdFBhbmVBY3RpdmUoKSA9PT0gTGVmdFBhbmVUeXBlLkRlc2t0b3ApIGFkZEl0ZW1Ub0Rlc2t0b3AoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBhZGRJdGVtVG9TdGFjayhpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1YmNhcmRJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJDYXJkcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBsZWZ0U3ViY2FyZExpc3QuYXBwZW5kQ2hpbGQoY3JlYXRlU3ViY2FyZEl0ZW0oaSkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZm9yKGxldCBpID0gMDsgaSA8IE1hdGguZmxvb3IodGhpcy5zdWJDYXJkcy5sZW5ndGggLyAyKTsgaSsrKXtcclxuICAgICAgICAgICAgLy8gICAgIGxlZnRTdWJjYXJkTGlzdC5hcHBlbmRDaGlsZChjcmVhdGVTdWJjYXJkSXRlbShpKSlcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBmb3IobGV0IGkgPSBNYXRoLmZsb29yKHRoaXMuc3ViQ2FyZHMubGVuZ3RoIC8gMik7IGkgPCB0aGlzLnN1YkNhcmRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgLy8gICAgIHJpZ2h0U3ViY2FyZExpc3QuYXBwZW5kQ2hpbGQoY3JlYXRlU3ViY2FyZEl0ZW0oaSkpXHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIHN1YmNhcmROb2RlLmFwcGVuZENoaWxkKHN1YmNhcmRIZWFkZXIpO1xyXG4gICAgICAgICAgICBzdWJjYXJkTm9kZS5hcHBlbmRDaGlsZChzdWJjYXJkQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChzdWJjYXJkTm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgYnV0dG9uc1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvblJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IGNvcHlKU09OQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgY29weUpTT05CdXR0b24uaW5uZXJUZXh0ID0gJ0NvcHkgSlNPTic7XHJcbiAgICAgICAgY29weUpTT05CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjb3B5VG9DbGlwYm9hcmQodGhpcy50b0pTT04oKSkpO1xyXG4gICAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChjb3B5SlNPTkJ1dHRvbik7XHJcbiAgICAgICAgY29uc3QgY29weVVuaXF1ZUlEQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgY29weVVuaXF1ZUlEQnV0dG9uLmlubmVySFRNTCA9ICdDb3B5IElEJztcclxuICAgICAgICBjb3B5VW5pcXVlSURCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjb3B5VG9DbGlwYm9hcmQodGhpcy51bmlxdWVJRCkpO1xyXG4gICAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChjb3B5VW5pcXVlSURCdXR0b24pXHJcbiAgICAgICAgY29uc3QgY29weVRvRGVza3RvcEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNvcHlUb0Rlc2t0b3BCdXR0b24uaW5uZXJIVE1MID0gJ0NvcHkgdG8gRGVza3RvcCc7XHJcbiAgICAgICAgY29weVRvRGVza3RvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgYWRkSXRlbVRvRGVza3RvcCh0aGlzKTtcclxuICAgICAgICAgICAgc3dpdGNoVG9EZXNrdG9wKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29weVRvRGVza3RvcEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGlmKCFpc0Rlc2t0b3ApIHRoaXMuY29weVRvRGVza3RvcEJ1dHRvbiA9IGNvcHlUb0Rlc2t0b3BCdXR0b247XHJcbiAgICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGNvcHlUb0Rlc2t0b3BCdXR0b24pXHJcbiAgICAgICAgYnV0dG9uUm93LmNsYXNzTmFtZSA9ICdjYXJkLWJ1dHRvbi1yb3cnO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoYnV0dG9uUm93KTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIGNhdGVnb3J5ICsgbWV0YWRhdGEgcmVuZGVyaW5nXHJcbiAgICAgICAgY29uc3QgbWV0YURpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBtZXRhRGlzcGxheS5jbGFzc05hbWUgPSAnY2FyZC1tZXRhLXJvdyc7XHJcbiAgICAgICAgaWYodGhpcy5kaXNwbGF5TWV0YURhdGEgJiYgdGhpcy5jYXRlZ29yaWVzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBtZXRhRGlzcGxheS5pbm5lckhUTUwgPSB0aGlzLmNhdGVnb3JpZXMubWFwKGNhdCA9PiBgIyR7Y2F0LnJlcGxhY2UoLyAvZywgJy0nKX1gKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQobWV0YURpc3BsYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmluYWxpemUgbm9kZSBjb25zdHJ1Y3Rpb25cclxuICAgICAgICBub2RlLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBpZihpZC5sZW5ndGggPiAwKSBub2RlLmlkID0gaWQ7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9IFxyXG5cclxuICAgIGRpc2FibGVOYW1lQWRkaW5nKCl7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVOYW1lID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZW5hYmxlQ29weVRvRGVza3RvcCgpe1xyXG4gICAgICAgIHRoaXMuY29weVRvRGVza3RvcEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZSc7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZUNvcHlUb0Rlc2t0b3AoKXtcclxuICAgICAgICB0aGlzLmNvcHlUb0Rlc2t0b3BCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRlcyhjcmVhdGlvbkRhdGU6IERhdGUsIGVkaXREYXRlOiBEYXRlKXtcclxuICAgICAgICB0aGlzLmNyZWF0aW9uRGF0ZSA9IGNyZWF0aW9uRGF0ZTtcclxuICAgICAgICB0aGlzLmVkaXREYXRlID0gZWRpdERhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q2F0ZWdvcmllcyhjYXRlZ29yaWVzOiBzdHJpbmdbXSl7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdE5vZGUodGhpcy5ub2RlSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN1YmNhcmRzKHN1YmNhcmRzOiBzdHJpbmdbXSl7XHJcbiAgICAgICAgdGhpcy5zdWJDYXJkcyA9IHN1YmNhcmRzLnNvcnQoKTtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdE5vZGUodGhpcy5ub2RlSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpe1xyXG4gICAgICAgIHJldHVybiBge1xyXG4gICAgXCJuYW1lXCI6IFwiJHt0aGlzLm5hbWV9XCIsXHJcbiAgICBcInVuaXF1ZUlEXCI6IFwiJHt0aGlzLnVuaXF1ZUlEfVwiLFxyXG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIiR7dG9KU09OU2FmZVRleHQodGhpcy5kZXNjcmlwdGlvbil9XCIsXHJcblxyXG4gICAgXCJjcmVhdGlvbkRhdGVcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmNyZWF0aW9uRGF0ZSl9LFxyXG4gICAgXCJlZGl0RGF0ZVwiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuZWRpdERhdGUpfSxcclxuXHJcbiAgICBcImNhdGVnb3JpZXNcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmNhdGVnb3JpZXMpfSxcclxuICAgIFwic3ViY2FyZHNcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLnN1YkNhcmRzKX1cclxufWA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldE5vZGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2t0b3BOb2RlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZURlc2t0b3BDb3B5O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgZnJvbUpTT05TYWZlVGV4dCwgdG9KU09OU2FmZVRleHQgfSBmcm9tIFwiLi91dGlsL2pzb24tdGV4dC1jb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuL2NhcmRcIjtcclxuaW1wb3J0IHsgY29weVRvQ2xpcGJvYXJkIH0gZnJvbSBcIi4vdXRpbC9jbGlwYm9hcmRcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvU3RhY2ssIHJlbW92ZUl0ZW1Gcm9tU3RhY2sgfSBmcm9tIFwiLi9mZWF0dXJlcy9zZWFyY2gtc3RhY2tcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvRGVza3RvcCwgcmVmQ29tYmluZWRJdGVtcywgcmVtb3ZlSXRlbUZyb21EZXNrdG9wIH0gZnJvbSBcIi4vZmVhdHVyZXMvZGVza3RvcFwiO1xyXG5pbXBvcnQgeyB3aGljaExlZnRQYW5lQWN0aXZlLCBMZWZ0UGFuZVR5cGUsIHN3aXRjaFRvRGVza3RvcCB9IGZyb20gXCIuL2ZlYXR1cmVzL3BhbmUtbWFuYWdlbWVudFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYXJkR3JvdXBKU09OIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgY2hpbGRyZW5JRHM6IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyZEdyb3VwIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHVuaXF1ZUlEOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIGNoaWxkcmVuSURzOiBzdHJpbmdbXTtcclxuICAgIGNoaWxkcmVuOiAoQ2FyZEdyb3VwIHwgQ2FyZClbXVxyXG5cclxuICAgIG5vZGU6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgbm9kZURlc2t0b3BDb3B5OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG5vZGVJRDogc3RyaW5nO1xyXG4gICAgYWN0aXZlTmFtZTogYm9vbGVhbjtcclxuICAgIGNvcHlUb0Rlc2t0b3BCdXR0b246IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgaWQ6IHN0cmluZyA9ICcnKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudW5pcXVlSUQgPSAnW2ddJyArIG5hbWUucmVwbGFjZSgvIC9nLCAnLScpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGZyb21KU09OU2FmZVRleHQoZGVzY3JpcHRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuSURzID0gW107XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGl2ZU5hbWUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29weVRvRGVza3RvcEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMubm9kZURlc2t0b3BDb3B5ID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQsIHRydWUpO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuY29uc3RydWN0Tm9kZUludGVybmFsKGlkKTtcclxuICAgICAgICB0aGlzLm5vZGVJRCA9IGlkLmxlbmd0aCA+IDAgPyBpZCA6IHRoaXMudW5pcXVlSUQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2ltaWxhciB0byBjYXJkLnRzJyBjb25zdHJ1Y3ROb2RlXHJcbiAgICBjb25zdHJ1Y3ROb2RlKGlkOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubm9kZURlc2t0b3BDb3B5ID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQsIHRydWUpO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuY29uc3RydWN0Tm9kZUludGVybmFsKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQ6IHN0cmluZywgaXNEZXNrdG9wID0gZmFsc2Upe1xyXG4gICAgICAgIC8vIGNyZWF0ZSBiYXNlIG5vZGVcclxuICAgICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgbmFtZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgICAgICBuYW1lTm9kZS5pbm5lclRleHQgPSBgW0ddICR7dGhpcy5uYW1lfWA7XHJcbiAgICAgICAgZGVzY3JpcHRpb25Ob2RlLmlubmVySFRNTCA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChuYW1lTm9kZSk7XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbk5vZGUpO1xyXG5cclxuICAgICAgICBuYW1lTm9kZS5jbGFzc05hbWUgPSAnY2FyZC1ncm91cC1uYW1lJztcclxuICAgICAgICBuYW1lTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5hY3RpdmVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmKHdoaWNoTGVmdFBhbmVBY3RpdmUoKSA9PT0gTGVmdFBhbmVUeXBlLkRlc2t0b3Ape1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlSXRlbUZyb21EZXNrdG9wKHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlSXRlbUZyb21TdGFjayh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmFtZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYoIXRoaXMuYWN0aXZlTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZih3aGljaExlZnRQYW5lQWN0aXZlKCkgPT09IExlZnRQYW5lVHlwZS5EZXNrdG9wKXtcclxuICAgICAgICAgICAgICAgIGFkZEl0ZW1Ub0Rlc2t0b3AodGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhZGRJdGVtVG9TdGFjayh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIGNoaWxkcmVuIGxpc3RcclxuICAgICAgICBjb25zdCBzdWJjYXJkTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IHN1YmNhcmRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNCcpO1xyXG4gICAgICAgIGNvbnN0IHN1YmNhcmRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBzdWJjYXJkQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdjYXJkLWdyb3VwLXN1YmNhcmQtY29udGFpbmVyJztcclxuICAgICAgICBzdWJjYXJkSGVhZGVyLmlubmVySFRNTCA9ICdDaGlsZHJlbjonXHJcbiAgICAgICAgc3ViY2FyZEhlYWRlci5jbGFzc05hbWUgPSAnY2FyZC1ncm91cC1zdWJjYXJkLWhlYWRlcic7XHJcbiAgICAgICAgc3ViY2FyZE5vZGUuYXBwZW5kQ2hpbGQoc3ViY2FyZEhlYWRlcik7XHJcbiAgICAgICAgc3ViY2FyZE5vZGUuYXBwZW5kQ2hpbGQoc3ViY2FyZENvbnRhaW5lcik7XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChzdWJjYXJkTm9kZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNyZWF0ZVN1YmNhcmRJdGVtID0gKGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJjYXJkSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBzdWJjYXJkSXRlbS5pbm5lckhUTUwgPSBgLSAke3RoaXMuY2hpbGRyZW5JRHNbaV19YDtcclxuICAgICAgICAgICAgc3ViY2FyZEl0ZW0uY2xhc3NOYW1lID0gJ2NhcmQtZ3JvdXAtc3ViY2FyZC1pdGVtJztcclxuICAgICAgICAgICAgc3ViY2FyZEl0ZW0uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gICAgICAgICAgICBzdWJjYXJkSXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlZkNvbWJpbmVkSXRlbXMuZmluZChpdGVtID0+IGl0ZW0udW5pcXVlSUQgPT09IHRoaXMuY2hpbGRyZW5JRHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXRlbSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKCF0aGlzLmFjdGl2ZU5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYod2hpY2hMZWZ0UGFuZUFjdGl2ZSgpID09PSBMZWZ0UGFuZVR5cGUuRGVza3RvcCkgYWRkSXRlbVRvRGVza3RvcChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgYWRkSXRlbVRvU3RhY2soaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3ViY2FyZEl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuSURzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgc3ViY2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChjcmVhdGVTdWJjYXJkSXRlbShpKSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFkZCBidXR0b25zXHJcbiAgICAgICAgY29uc3QgYnV0dG9uUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgY29weUpTT05CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjb3B5SlNPTkJ1dHRvbi5pbm5lclRleHQgPSAnQ29weSBKU09OJztcclxuICAgICAgICBjb3B5SlNPTkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNvcHlUb0NsaXBib2FyZCh0aGlzLnRvSlNPTigpKSk7XHJcbiAgICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGNvcHlKU09OQnV0dG9uKTtcclxuICAgICAgICBjb25zdCBjb3B5VW5pcXVlSURCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjb3B5VW5pcXVlSURCdXR0b24uaW5uZXJIVE1MID0gJ0NvcHkgSUQnO1xyXG4gICAgICAgIGNvcHlVbmlxdWVJREJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNvcHlUb0NsaXBib2FyZCh0aGlzLnVuaXF1ZUlEKSk7XHJcbiAgICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGNvcHlVbmlxdWVJREJ1dHRvbik7XHJcbiAgICAgICAgY29uc3QgY29weVRvRGVza3RvcEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNvcHlUb0Rlc2t0b3BCdXR0b24uaW5uZXJIVE1MID0gJ0NvcHkgdG8gRGVza3RvcCc7XHJcbiAgICAgICAgY29weVRvRGVza3RvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgYWRkSXRlbVRvRGVza3RvcCh0aGlzKTtcclxuICAgICAgICAgICAgc3dpdGNoVG9EZXNrdG9wKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29weVRvRGVza3RvcEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGlmKCFpc0Rlc2t0b3ApIHRoaXMuY29weVRvRGVza3RvcEJ1dHRvbiA9IGNvcHlUb0Rlc2t0b3BCdXR0b247XHJcbiAgICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGNvcHlUb0Rlc2t0b3BCdXR0b24pXHJcbiAgICAgICAgYnV0dG9uUm93LmNsYXNzTmFtZSA9ICdjYXJkLWJ1dHRvbi1yb3cnO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoYnV0dG9uUm93KTtcclxuXHJcbiAgICAgICAgLy8gZmluYWxpemUgbm9kZSBjb25zdHJ1Y3Rpb25cclxuICAgICAgICBub2RlLmNsYXNzTmFtZSA9ICdjYXJkLWdyb3VwJztcclxuICAgICAgICBpZihpZC5sZW5ndGggPiAwKSBub2RlLmlkID0gaWQ7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZU5hbWVBZGRpbmcoKXtcclxuICAgICAgICB0aGlzLmFjdGl2ZU5hbWUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBlbmFibGVDb3B5VG9EZXNrdG9wKCl7XHJcbiAgICAgICAgdGhpcy5jb3B5VG9EZXNrdG9wQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lJztcclxuICAgIH1cclxuXHJcbiAgICBkaXNhYmxlQ29weVRvRGVza3RvcCgpe1xyXG4gICAgICAgIHRoaXMuY29weVRvRGVza3RvcEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENoaWxkcmVuSURzKGNoaWxkcmVuSURzOiBzdHJpbmdbXSl7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbklEcyA9IGNoaWxkcmVuSURzLnNvcnQoKTtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdE5vZGUodGhpcy5ub2RlSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpe1xyXG4gICAgICAgIHJldHVybiBge1xyXG4gICAgXCJuYW1lXCI6IFwiJHt0aGlzLm5hbWV9XCIsXHJcbiAgICBcInVuaXF1ZUlEXCI6IFwiJHt0aGlzLnVuaXF1ZUlEfVwiLFxyXG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIiR7dG9KU09OU2FmZVRleHQodGhpcy5kZXNjcmlwdGlvbil9XCIsXHJcbiAgICBcImNoaWxkcmVuSURzXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5jaGlsZHJlbklEcyl9XHJcbn1gO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2t0b3BOb2RlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZURlc2t0b3BDb3B5O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgZnJvbUpTT05TYWZlVGV4dCB9IGZyb20gXCIuLi91dGlsL2pzb24tdGV4dC1jb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCI7XHJcbmltcG9ydCB7IGNvcHlUb0NsaXBib2FyZCwgY29weUZyb21DbGlwYm9hcmQgfSBmcm9tIFwiLi4vdXRpbC9jbGlwYm9hcmRcIjtcclxuaW1wb3J0IHsgZG93bmxvYWRGaWxlIH0gZnJvbSBcIi4uL3V0aWwvZG93bmxvYWRcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0Q2FyZEF1dGhvcmluZyA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGNhcmROYW1lSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1uYW1lLWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IGNhcmREZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZGVzY3JpcHRpb24taW5wdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZERlc2NyaXB0aW9uT3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZGVzY3JpcHRpb24tb3V0cHV0JykgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuICAgIGNvbnN0IHByZXZpZXdDYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtcHJldmlldy1jb250YWluZXInKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGNhcmRDYXRlZ29yeUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtY2F0ZWdvcnktaW5wdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZFN1YmNhcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLXN1YmNhcmQtaW5wdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG5cclxuICAgIC8vIG1ldGEgdmFyaWFibGVzIHdob3NlIHN0YXRlIGlzIG5vdCBjYXJyaWVkIGluIGlubmVySFRNTFxyXG4gICAgbGV0IGNyZWF0aW9uRGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuYW1lID0gY2FyZE5hbWVJbnB1dC52YWx1ZTtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNhcmREZXNjcmlwdGlvbklucHV0LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHByZXZpZXdDYXJkID0gbmV3IENhcmQobmFtZSwgZGVzY3JpcHRpb24sICdwcmV2aWV3LWNhcmQnKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZC5zZXREYXRlcyhjcmVhdGlvbkRhdGUsIG5ldyBEYXRlKCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkLnNldENhdGVnb3JpZXMoY2FyZENhdGVnb3J5SW5wdXQudmFsdWUuc3BsaXQoJywnKS5tYXAobmFtZSA9PiBuYW1lLnRyaW0oKSkuZmlsdGVyKG5hbWUgPT4gbmFtZS5sZW5ndGggPiAwKSk7XHJcbiAgICAgICAgcHJldmlld0NhcmQuc2V0U3ViY2FyZHMoY2FyZFN1YmNhcmRJbnB1dC52YWx1ZS5zcGxpdCgnXFxuJykubWFwKG5hbWUgPT4gbmFtZS50cmltKCkpLmZpbHRlcihuYW1lID0+IG5hbWUubGVuZ3RoID4gMCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkLmRpc2FibGVOYW1lQWRkaW5nKCk7XHJcbiAgICAgICAgY2FyZERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlID0gcHJldmlld0NhcmQudG9KU09OKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHByZXZpZXdDYXJkTm9kZSA9IHByZXZpZXdDYXJkLmdldE5vZGUoKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZENvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2gobm9kZSA9PiBub2RlLnJlbW92ZSgpKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2aWV3Q2FyZE5vZGUpO1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKHdpbmRvdy5NYXRoSmF4KSBNYXRoSmF4LnR5cGVzZXQoW3ByZXZpZXdDYXJkTm9kZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlID0gKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UoY2FyZERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlKTtcclxuICAgICAgICAgICAgY29uc3QgaGFzTmFtZSA9IG9iamVjdC5uYW1lICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5uYW1lID09ICdzdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNEZXNjcmlwdGlvbiA9IG9iamVjdC5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3QuZGVzY3JpcHRpb24gPT0gJ3N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0NyZWF0aW9uRGF0ZSA9IG9iamVjdC5jcmVhdGlvbkRhdGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0LmNyZWF0aW9uRGF0ZSA9PSAnc3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3QgaGFzQ2F0ZWdvcmllcyA9IG9iamVjdC5jYXRlZ29yaWVzICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5jYXRlZ29yaWVzID09ICdvYmplY3QnO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNTdWJjYXJkcyA9IG9iamVjdC5zdWJjYXJkcyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3Quc3ViY2FyZHMgPT0gJ29iamVjdCc7XHJcblxyXG4gICAgICAgICAgICBpZihcclxuICAgICAgICAgICAgICAgIGhhc05hbWUgJiYgaGFzRGVzY3JpcHRpb24gJiYgaGFzQ3JlYXRpb25EYXRlICYmXHJcbiAgICAgICAgICAgICAgICBoYXNDYXRlZ29yaWVzICYmIGhhc1N1YmNhcmRzXHJcbiAgICAgICAgICAgICl7XHJcbiAgICAgICAgICAgICAgICBjYXJkTmFtZUlucHV0LnZhbHVlID0gb2JqZWN0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBjYXJkRGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9IGZyb21KU09OU2FmZVRleHQob2JqZWN0LmRlc2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNyZWF0aW9uRGF0ZSA9IG5ldyBEYXRlKG9iamVjdC5jcmVhdGlvbkRhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhcmRDYXRlZ29yeUlucHV0LnZhbHVlID0gb2JqZWN0LmNhdGVnb3JpZXMuam9pbignLCAnKTtcclxuICAgICAgICAgICAgICAgIGNhcmRTdWJjYXJkSW5wdXQudmFsdWUgPSBvYmplY3Quc3ViY2FyZHMuam9pbignXFxuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgY2FyZE5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUpO1xyXG4gICAgY2FyZERlc2NyaXB0aW9uSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuICAgIGNhcmREZXNjcmlwdGlvbk91dHB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlKTtcclxuICAgIGNhcmRDYXRlZ29yeUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcbiAgICBjYXJkU3ViY2FyZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcblxyXG4gICAgY29uc3QgZG93bmxvYWRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1hdXRob3JpbmctZG93bmxvYWQtYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtYXV0aG9yaW5nLWNvcHktYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBwYXN0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWF1dGhvcmluZy1wYXN0ZS1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtYXV0aG9yaW5nLWNsZWFyLWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgXHJcbiAgICBkb3dubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBkb3dubG9hZEZpbGUoYCR7Y2FyZE5hbWVJbnB1dC52YWx1ZS5yZXBsYWNlKC8gL2csICctJykudG9Mb2NhbGVMb3dlckNhc2UoKX0uanNvbmAsIGNhcmREZXNjcmlwdGlvbk91dHB1dC52YWx1ZSk7XHJcbiAgICB9KTtcclxuICAgIGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY29weVRvQ2xpcGJvYXJkKGNhcmREZXNjcmlwdGlvbk91dHB1dC52YWx1ZSk7XHJcbiAgICB9KTtcclxuICAgIHBhc3RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvcHlGcm9tQ2xpcGJvYXJkKCkudGhlbih0ZXh0ID0+IHtcclxuICAgICAgICAgICAgY2FyZERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlID0gdGV4dDtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb25PdXRwdXRVcGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbiAgICBjbGVhckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjYXJkTmFtZUlucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgY2FyZERlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICBjcmVhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNhcmRDYXRlZ29yeUlucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgY2FyZFN1YmNhcmRJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUoKTtcclxufVxyXG4iLCJpbXBvcnQgeyBmcm9tSlNPTlNhZmVUZXh0IH0gZnJvbSBcIi4uL3V0aWwvanNvbi10ZXh0LWNvbnZlcnRlclwiO1xyXG5pbXBvcnQgeyBDYXJkIH0gZnJvbSBcIi4uL2NhcmRcIjtcclxuaW1wb3J0IHsgQ2FyZEdyb3VwIH0gZnJvbSBcIi4uL2NhcmRncm91cFwiO1xyXG5pbXBvcnQgeyBjb3B5VG9DbGlwYm9hcmQsIGNvcHlGcm9tQ2xpcGJvYXJkIH0gZnJvbSBcIi4uL3V0aWwvY2xpcGJvYXJkXCI7XHJcbmltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gXCIuLi91dGlsL2Rvd25sb2FkXCI7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdENhcmRHcm91cEF1dGhvcmluZyA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGNhcmRHcm91cE5hbWVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWdyb3VwLW5hbWUtaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZEdyb3VwRGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWdyb3VwLWRlc2NyaXB0aW9uLWlucHV0JykgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuICAgIGNvbnN0IGNhcmRHcm91cERlc2NyaXB0aW9uT3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtZGVzY3JpcHRpb24tb3V0cHV0JykgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuICAgIGNvbnN0IHByZXZpZXdDYXJkR3JvdXBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1ncm91cC1wcmV2aWV3LWNvbnRhaW5lcicpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZEdyb3VwQ2hpbGRyZW5JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWdyb3VwLWNhdGVnb3J5LWlucHV0JykgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuXHJcbiAgICAvLyBtZXRhIHZhcmlhYmxlcyB3aG9zZSBzdGF0ZSBpcyBub3QgY2FycmllZCBpbiBpbm5lckhUTUxcclxuICAgIGxldCBjcmVhdGlvbkRhdGU9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuYW1lID0gY2FyZEdyb3VwTmFtZUlucHV0LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY2FyZEdyb3VwRGVzY3JpcHRpb25JbnB1dC52YWx1ZTtcclxuICAgICAgICBjb25zdCBwcmV2aWV3Q2FyZEdyb3VwID0gbmV3IENhcmRHcm91cChuYW1lLCBkZXNjcmlwdGlvbiwgJ3ByZXZpZXctY2FyZCcpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkR3JvdXAuc2V0Q2hpbGRyZW5JRHMoY2FyZEdyb3VwQ2hpbGRyZW5JbnB1dC52YWx1ZS5zcGxpdCgnXFxuJykubWFwKG5hbWUgPT4gbmFtZS50cmltKCkpLmZpbHRlcihuYW1lID0+IG5hbWUubGVuZ3RoID4gMCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkR3JvdXAuZGlzYWJsZU5hbWVBZGRpbmcoKTtcclxuICAgICAgICBjYXJkR3JvdXBEZXNjcmlwdGlvbk91dHB1dC52YWx1ZSA9IHByZXZpZXdDYXJkR3JvdXAudG9KU09OKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHByZXZpZXdDYXJkR3JvdXBOb2RlID0gcHJldmlld0NhcmRHcm91cC5nZXROb2RlKCk7XHJcbiAgICAgICAgcHJldmlld0NhcmRHcm91cENvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2gobm9kZSA9PiBub2RlLnJlbW92ZSgpKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZEdyb3VwQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZpZXdDYXJkR3JvdXBOb2RlKTtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmICh3aW5kb3cuTWF0aEpheCkgTWF0aEpheC50eXBlc2V0KFtwcmV2aWV3Q2FyZEdyb3VwTm9kZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlID0gKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UoY2FyZEdyb3VwRGVzY3JpcHRpb25PdXRwdXQudmFsdWUpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNOYW1lID0gb2JqZWN0Lm5hbWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0Lm5hbWUgPT0gJ3N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0Rlc2NyaXB0aW9uID0gb2JqZWN0LmRlc2NyaXB0aW9uICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5kZXNjcmlwdGlvbiA9PSAnc3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3QgaGFzQ2hpbGRyZW5JRHMgPSBvYmplY3QuY2hpbGRyZW5JRHMgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0LmNoaWxkcmVuSURzID09ICdvYmplY3QnO1xyXG5cclxuICAgICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgICAgICBoYXNOYW1lICYmIGhhc0Rlc2NyaXB0aW9uICYmIGhhc0NoaWxkcmVuSURzXHJcbiAgICAgICAgICAgICl7XHJcbiAgICAgICAgICAgICAgICBjYXJkR3JvdXBOYW1lSW5wdXQudmFsdWUgPSBvYmplY3QubmFtZTtcclxuICAgICAgICAgICAgICAgIGNhcmRHcm91cERlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSBmcm9tSlNPTlNhZmVUZXh0KG9iamVjdC5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjYXJkR3JvdXBDaGlsZHJlbklucHV0LnZhbHVlID0gb2JqZWN0LmNoaWxkcmVuSURzLmpvaW4oJ1xcbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIGNhcmRHcm91cE5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUpO1xyXG4gICAgY2FyZEdyb3VwRGVzY3JpcHRpb25JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUpO1xyXG4gICAgY2FyZEdyb3VwRGVzY3JpcHRpb25PdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbk91dHB1dFVwZGF0ZSk7XHJcbiAgICBjYXJkR3JvdXBDaGlsZHJlbklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcblxyXG4gICAgY29uc3QgZG93bmxvYWRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1ncm91cC1hdXRob3JpbmctZG93bmxvYWQtYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtYXV0aG9yaW5nLWNvcHktYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBwYXN0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWdyb3VwLWF1dGhvcmluZy1wYXN0ZS1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtYXV0aG9yaW5nLWNsZWFyLWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgXHJcbiAgICBkb3dubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBkb3dubG9hZEZpbGUoYCR7Y2FyZEdyb3VwTmFtZUlucHV0LnZhbHVlLnJlcGxhY2UoLyAvZywgJy0nKS50b0xvY2FsZUxvd2VyQ2FzZSgpfS5qc29uYCwgY2FyZEdyb3VwRGVzY3JpcHRpb25PdXRwdXQudmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgICBjb3B5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvcHlUb0NsaXBib2FyZChjYXJkR3JvdXBEZXNjcmlwdGlvbk91dHB1dC52YWx1ZSk7XHJcbiAgICB9KTtcclxuICAgIHBhc3RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvcHlGcm9tQ2xpcGJvYXJkKCkudGhlbih0ZXh0ID0+IHtcclxuICAgICAgICAgICAgY2FyZEdyb3VwRGVzY3JpcHRpb25PdXRwdXQudmFsdWUgPSB0ZXh0O1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbk91dHB1dFVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIGNsZWFyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNhcmRHcm91cE5hbWVJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGNhcmRHcm91cERlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICBjYXJkR3JvdXBDaGlsZHJlbklucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG59IiwiaW1wb3J0IHsgZG93bmxvYWRGaWxlIH0gZnJvbSBcIi4uL3V0aWwvZG93bmxvYWRcIjtcclxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCI7XHJcbmltcG9ydCB7IENhcmRHcm91cCB9IGZyb20gXCIuLi9jYXJkZ3JvdXBcIjtcclxuaW1wb3J0IHsgZ2V0SEhNTSwgZ2V0TU1ERFlZWVkgfSBmcm9tIFwiLi4vdXRpbC9kYXRlXCI7XHJcblxyXG5sZXQgc2VsZWN0ZWRTbG90OiBIVE1MRGl2RWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG5sZXQgc2xvdE5vZGVzIDogSFRNTERpdkVsZW1lbnRbXSA9IFtdO1xyXG5sZXQgY29sdW1ucyA9IDI7XHJcbmxldCBzbG90cyA9IDUwO1xyXG5cclxuZXhwb3J0IHR5cGUgRGVza3RvcEV4cG9ydEpTT04gPSB7XHJcbiAgICBjb2x1bW5zOiBudW1iZXIsXHJcbiAgICBzbG90czogbnVtYmVyLFxyXG4gICAgZGF0YTogKHN0cmluZyB8IG51bGwpW11cclxufTtcclxuXHJcbmV4cG9ydCBsZXQgcmVmQ29tYmluZWRJdGVtczogKENhcmQgfCBDYXJkR3JvdXApW107XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdERlc2t0b3AgPSAoY2FyZHM6IENhcmRbXSwgY2FyZEdyb3VwczogQ2FyZEdyb3VwW10pID0+IHtcclxuICAgIGNvbnN0IGRlc2t0b3BTdXJmYWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2t0b3AtY29udGFpbmVyJykgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICBjb25zdCBjb21iaW5lZEl0ZW1zOiAoQ2FyZCB8IENhcmRHcm91cClbXSA9IFsuLi5jYXJkcywgLi4uY2FyZEdyb3Vwc107XHJcbiAgICByZWZDb21iaW5lZEl0ZW1zID0gY29tYmluZWRJdGVtcztcclxuXHJcbiAgICAvLyBjcmVhdGUgaW50ZXJhY3RpdmUgc3VyZmFjZVxyXG4gICAgY29uc3QgY2xpY2tPblNsb3QgPSAoc2xvdDogSFRNTERpdkVsZW1lbnQpID0+IHtcclxuICAgICAgICAvLyBkZWFjdGl2YXRlIHNsb3QgaWYgY2FyZC9jYXJkZ3JvdXAgaXMgYWxyZWFkeSBpbnNpZGUgc2xvdFxyXG4gICAgICAgIGlmKHNsb3QuY2hpbGRyZW4ubGVuZ3RoID4gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgYm9yZGVyIHNlbGVjdGlvbiB2aXN1YWxcclxuICAgICAgICBzbG90Tm9kZXMuZm9yRWFjaChzbG90ID0+IHtcclxuICAgICAgICAgICAgc2xvdC5zdHlsZS5ib3JkZXIgPSAnMXB4IGxpZ2h0Z3JheSc7XHJcbiAgICAgICAgICAgIHNsb3Quc3R5bGUuYm9yZGVyU3R5bGUgPSAnZGFzaGVkJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYoc2VsZWN0ZWRTbG90ICE9PSBzbG90KXtcclxuICAgICAgICAgICAgc2VsZWN0ZWRTbG90ID0gc2xvdDtcclxuICAgICAgICAgICAgc2VsZWN0ZWRTbG90LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgYmxhY2snO1xyXG4gICAgICAgICAgICBzZWxlY3RlZFNsb3Quc3R5bGUuYm9yZGVyU3R5bGUgPSAnc29saWQnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkU2xvdCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRvZ2dsZUNvcHlUb0Rlc2t0b3BCdXR0b25BY3RpdmUoY29tYmluZWRJdGVtcyk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBkeW5hbWljIGN1cnNvciBvdmVyXHJcbiAgICAgICAgc2xvdE5vZGVzLmZvckVhY2goc2xvdCA9PiB7XHJcbiAgICAgICAgICAgIGlmKHNsb3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgICAgIHNsb3Quc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2xvdC5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb25zdHJ1Y3RTdXJmYWNlID0gKHNsb3RzVG9Mb2FkPzogKHN0cmluZyB8IG51bGwpW10pID0+IHtcclxuICAgICAgICBkZXNrdG9wU3VyZmFjZS5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICBzbG90Tm9kZXMgPSBbXTtcclxuICAgICAgICBsZXQgY291bnRlciA9IDA7XHJcbiAgICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IHNsb3RzOyB4Kyspe1xyXG4gICAgICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgcm93LmNsYXNzTmFtZSA9IGBkZXNrdG9wLXJvd2A7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IHkgPSAwOyB5IDwgY29sdW1uczsgeSsrKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNsb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIHNsb3QuY2xhc3NOYW1lID0gYGRlc2t0b3Atc2xvdCR7eSAhPT0gMCA/ICcgZGVza3RvcC1tYXJnaW4tbGVmdCcgOiAnJ31gO1xyXG5cclxuICAgICAgICAgICAgICAgIHNsb3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tPblNsb3Qoc2xvdCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByb3cuYXBwZW5kKHNsb3QpO1xyXG4gICAgICAgICAgICAgICAgc2xvdE5vZGVzLnB1c2goc2xvdCk7XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRlc2t0b3BTdXJmYWNlLmFwcGVuZChyb3cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgbG9hZGluZyBpbiBzbG90cyBmcm9tIGpzb24gaW1wb3J0XHJcbiAgICAgICAgaWYoIXNsb3RzVG9Mb2FkKSByZXR1cm47XHJcbiAgICAgICAgY291bnRlciA9IDA7XHJcbiAgICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IHNsb3RzOyB4Kyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHkgPSAwOyB5IDwgY29sdW1uczsgeSsrKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRlZElEID0gc2xvdHNUb0xvYWRbY291bnRlcl07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2xvdCA9IHNsb3ROb2Rlc1tjb3VudGVyXTtcclxuICAgICAgICAgICAgICAgIGlmKGxvYWRlZElEICE9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gY29tYmluZWRJdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS51bmlxdWVJRCA9PT0gbG9hZGVkSUQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0gIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkU2xvdCA9IGN1cnJlbnRTbG90O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRJdGVtVG9EZXNrdG9wKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxlY3RlZFNsb3QgPSBudWxsO1xyXG4gICAgICAgIHRvZ2dsZUNvcHlUb0Rlc2t0b3BCdXR0b25BY3RpdmUoY29tYmluZWRJdGVtcyk7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RTdXJmYWNlKCk7XHJcblxyXG4gICAgLy8gaGFuZGxlIHRvcCBiYXIgYnV0dG9uc1xyXG4gICAgY29uc3QgY2xlYXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVza3RvcC1jbGVhci1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGltcG9ydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNrdG9wLWltcG9ydC1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGltcG9ydEZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNrdG9wLWltcG9ydC1maWxlJykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IGV4cG9ydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNrdG9wLWV4cG9ydC1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcbiAgICBjbGVhckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBzbG90Tm9kZXMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICAgICAgbm9kZS5zdHlsZS5ib3JkZXIgPSAnMXB4IGxpZ2h0Z3JheSc7XHJcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyU3R5bGUgPSAnZGFzaGVkJztcclxuICAgICAgICAgICAgbm9kZS5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2VsZWN0ZWRTbG90ID0gbnVsbDtcclxuICAgICAgICB0b2dnbGVDb3B5VG9EZXNrdG9wQnV0dG9uQWN0aXZlKGNvbWJpbmVkSXRlbXMpO1xyXG4gICAgICAgIHNhdmVEZXNrdG9wKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpbXBvcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBpbXBvcnRGaWxlSW5wdXQuY2xpY2soKSk7XHJcbiAgICBpbXBvcnRGaWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpbGVzOiBGaWxlTGlzdCB8IG51bGwgPSBpbXBvcnRGaWxlSW5wdXQuZmlsZXM7XHJcbiAgICAgICAgaWYoIWZpbGVzKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCBmaWxlc1swXS50ZXh0KCk7XHJcbiAgICAgICAgY29uc3QgaW1wb3J0RGF0YSA6IERlc2t0b3BFeHBvcnRKU09OID0gSlNPTi5wYXJzZShmaWxlRGF0YSk7XHJcbiAgICAgICAgY29sdW1ucyA9IGltcG9ydERhdGEuY29sdW1ucztcclxuICAgICAgICBzbG90cyA9IGltcG9ydERhdGEuc2xvdHM7XHJcbiAgICAgICAgY29uc3RydWN0U3VyZmFjZShpbXBvcnREYXRhLmRhdGEpO1xyXG4gICAgICAgIGltcG9ydEZpbGVJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIHNhdmVEZXNrdG9wKCk7XHJcbiAgICB9KTtcclxuICAgIGV4cG9ydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb25zdCBleHBvcnREYXRhIDogRGVza3RvcEV4cG9ydEpTT04gPSB7XHJcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXHJcbiAgICAgICAgICAgIHNsb3RzOiBzbG90cyxcclxuICAgICAgICAgICAgZGF0YTogc2xvdE5vZGVzLm1hcChzbG90ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHNsb3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNsb3QuY2hpbGRyZW5bMF0uaWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkb3dubG9hZEZpbGUoYGRlc2t0b3AtJHtnZXRISE1NKCl9LSR7Z2V0TU1ERFlZWVkoKX0uanNvbmAsIEpTT04uc3RyaW5naWZ5KGV4cG9ydERhdGEsIG51bGwsIDQpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGxvY2FsIHN0b3JhZ2UgbG9hZGluZy4uLlxyXG4gICAgY29uc3QgaW1wb3J0RGF0YUpTT04gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRlc2t0b3AtZGF0YVwiKTtcclxuICAgIGlmKGltcG9ydERhdGFKU09OICE9PSBudWxsKXtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBpbXBvcnREYXRhOiBEZXNrdG9wRXhwb3J0SlNPTiA9IEpTT04ucGFyc2UoaW1wb3J0RGF0YUpTT04pO1xyXG4gICAgICAgICAgICBjb2x1bW5zID0gaW1wb3J0RGF0YS5jb2x1bW5zO1xyXG4gICAgICAgICAgICBzbG90cyA9IGltcG9ydERhdGEuc2xvdHM7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdFN1cmZhY2UoaW1wb3J0RGF0YS5kYXRhKTtcclxuICAgICAgICB9IGNhdGNoKGUpe1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGxvY2FsIHN0b3JhZ2UgZGVza3RvcCBzYXZpbmcuLi5cclxuZXhwb3J0IGNvbnN0IHNhdmVEZXNrdG9wID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZGF0YSA6IERlc2t0b3BFeHBvcnRKU09OID0ge1xyXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXHJcbiAgICAgICAgc2xvdHM6IHNsb3RzLFxyXG4gICAgICAgIGRhdGE6IHNsb3ROb2Rlcy5tYXAoc2xvdCA9PiB7XHJcbiAgICAgICAgICAgIGlmKHNsb3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsb3QuY2hpbGRyZW5bMF0uaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZGVza3RvcC1kYXRhXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZEl0ZW1Ub0Rlc2t0b3AgPSAoaXRlbSA6IENhcmQgfCBDYXJkR3JvdXApID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gaXRlbS5nZXREZXNrdG9wTm9kZSgpO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgaWYgKHdpbmRvdy5NYXRoSmF4KSBNYXRoSmF4LnR5cGVzZXQoW2N1cnJlbnROb2RlXSk7XHJcbiAgICBpZighc2VsZWN0ZWRTbG90KSByZXR1cm47XHJcbiAgICBpZihzZWxlY3RlZFNsb3QuY2hpbGRyZW4ubGVuZ3RoID4gMCkgcmV0dXJuOyAvLyBkb24ndCByZXBsYWNlIGEgY2FyZCB0aGF0J3MgYWxyZWFkeSBpbiB0aGVyZVxyXG4gICAgc2VsZWN0ZWRTbG90LmFwcGVuZENoaWxkKGN1cnJlbnROb2RlKTtcclxuXHJcbiAgICBzZWxlY3RlZFNsb3Quc3R5bGUuYm9yZGVyID0gJzFweCBsaWdodGdyYXknO1xyXG4gICAgc2VsZWN0ZWRTbG90LnN0eWxlLmJvcmRlclN0eWxlID0gJ2Rhc2hlZCc7XHJcbiAgICBzZWxlY3RlZFNsb3Quc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xyXG4gICAgc2VsZWN0ZWRTbG90ID0gbnVsbDtcclxuXHJcbiAgICB0b2dnbGVDb3B5VG9EZXNrdG9wQnV0dG9uQWN0aXZlKHJlZkNvbWJpbmVkSXRlbXMpO1xyXG4gICAgc2F2ZURlc2t0b3AoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbW92ZUl0ZW1Gcm9tRGVza3RvcCA9IChpdGVtIDogQ2FyZCB8IENhcmRHcm91cCkgPT4ge1xyXG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBpdGVtLmdldERlc2t0b3BOb2RlKCk7XHJcbiAgICBjdXJyZW50Tm9kZS5yZW1vdmUoKTtcclxuICAgIHNhdmVEZXNrdG9wKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB0b2dnbGVDb3B5VG9EZXNrdG9wQnV0dG9uQWN0aXZlID0gKGNvbWJpbmVkSXRlbXM6IChDYXJkIHwgQ2FyZEdyb3VwKVtdKSA9PiB7XHJcbiAgICBjb25zdCBzbG90U2VsZWN0ZWQgPSBzZWxlY3RlZFNsb3QgIT09IG51bGw7XHJcbiAgICBmb3IobGV0IGl0ZW0gb2YgY29tYmluZWRJdGVtcyl7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uID0gaXRlbS5jb3B5VG9EZXNrdG9wQnV0dG9uIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIGlmKHNsb3RTZWxlY3RlZCl7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCI7XHJcbmltcG9ydCB7IENhcmRHcm91cCB9IGZyb20gXCIuLi9jYXJkZ3JvdXBcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvRGVza3RvcCB9IGZyb20gXCIuL2Rlc2t0b3BcIjtcclxuaW1wb3J0IHsgd2hpY2hMZWZ0UGFuZUFjdGl2ZSwgTGVmdFBhbmVUeXBlIH0gZnJvbSBcIi4vcGFuZS1tYW5hZ2VtZW50XCI7XHJcbmltcG9ydCB7IGFkZEl0ZW1Ub1N0YWNrIH0gZnJvbSBcIi4vc2VhcmNoLXN0YWNrXCI7XHJcblxyXG5leHBvcnQgdHlwZSBIaWVyYXJjaHlJbnRlcm5hbEl0ZW0gPSB7XHJcbiAgICB1bmlxdWVJRDogc3RyaW5nLFxyXG4gICAgZGVwdGg6IG51bWJlcixcclxuICAgIGVtcHR5Q2hpbGQ6IEhUTUxFbGVtZW50XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbml0SGllcmFyY2h5ID0gKGNhcmRzOiBDYXJkW10sIGNhcmRHcm91cHM6IENhcmRHcm91cFtdKSA9PiB7XHJcbiAgICBjb25zdCBoaWVyYXJjaHlSb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpZXJhcmNoeS1yb290JykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoaWVyYXJjaHktZW1wdHknKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJvb3RHcm91cHMgPSBjYXJkR3JvdXBzLmZpbHRlcihncm91cCA9PiBjYXJkR3JvdXBzLmV2ZXJ5KG90aGVyR3JvdXAgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRoaXNJRCA9IGdyb3VwLnVuaXF1ZUlEO1xyXG4gICAgICAgIGlmKHRoaXNJRCA9PT0gb3RoZXJHcm91cC51bmlxdWVJRCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gb3RoZXJHcm91cC5jaGlsZHJlbklEcy5ldmVyeShjaGlsZElEID0+IGNoaWxkSUQgIT09IHRoaXNJRCk7XHJcbiAgICB9KSk7XHJcbiAgICBjb25zdCByb290Q2FyZHMgPSBjYXJkcy5maWx0ZXIoY2FyZCA9PiBcclxuICAgICAgICBjYXJkR3JvdXBzLmV2ZXJ5KGdyb3VwID0+IFxyXG4gICAgICAgICAgICBncm91cC5jaGlsZHJlbklEcy5ldmVyeShjaGlsZElEID0+IGNhcmQudW5pcXVlSUQgIT0gY2hpbGRJRCkpKTtcclxuICAgIGNvbnN0IGNvbWJpbmVkSXRlbXM6IChDYXJkIHwgQ2FyZEdyb3VwKVtdID0gWy4uLmNhcmRzLCAuLi5jYXJkR3JvdXBzXTtcclxuICAgIGNvbnN0IGhpZXJhcmNoeU1hbmFnZXIgPSBuZXcgTWFwPHN0cmluZywgSGllcmFyY2h5SW50ZXJuYWxJdGVtPigpO1xyXG5cclxuICAgIGNvbnN0IGNyZWF0ZUhpZXJhcmNoeUl0ZW0gPSAoaWQ6IHN0cmluZywgaW5zZXJ0QWZ0ZXI6IEhUTUxFbGVtZW50LCBkZXB0aDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29ycmVzcG9uZGluZ0l0ZW0gPSBjb21iaW5lZEl0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLnVuaXF1ZUlEID09PSBpZCk7XHJcbiAgICAgICAgY29uc3QgaXNDYXJkR3JvdXAgPSBjb3JyZXNwb25kaW5nSXRlbSBpbnN0YW5jZW9mIENhcmRHcm91cDtcclxuICAgICAgICBjb25zdCBpdGVtQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1DaGlsZHJlbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1FbXB0eUNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgaXRlbUNvbnRhaW5lci5jbGFzc05hbWUgPSAnaGllcmFyY2h5LWl0ZW0tY29udGFpbmVyJztcclxuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9ICdoaWVyYXJjaHktaXRlbSc7XHJcbiAgICAgICAgaXRlbUNoaWxkcmVuQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdoaWVyYXJjaHktaXRlbS1jaGlsZC1jb250YWluZXInO1xyXG5cclxuICAgICAgICBjb25zdCBsZWZ0UGFkZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGxlZnRQYWRkaW5nLmlubmVySFRNTCA9ICcmbmJzcDsnLnJlcGVhdChkZXB0aCAqIDMpO1xyXG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gaXNDYXJkR3JvdXAgPyBgPGI+JHtpZH08L2I+YCA6IGAke2lkfWA7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gJ2hpZXJhcmNoeS1sYWJlbCc7XHJcbiAgICAgICAgY29uc3QgdG9nZ2xlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgdG9nZ2xlQnV0dG9uLmNsYXNzTmFtZSA9ICdoaWVyYXJjaHktdG9nZ2xlLWJ1dHRvbic7XHJcbiAgICAgICAgdG9nZ2xlQnV0dG9uLmlubmVySFRNTCA9ICcrJztcclxuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGxlZnRQYWRkaW5nKTtcclxuXHJcbiAgICAgICAgaWYoaXNDYXJkR3JvdXApIHtcclxuICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZCh0b2dnbGVCdXR0b24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhcmRTcGFjZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY2FyZFNwYWNlci5pbm5lckhUTUwgPSAnLSZuYnNwOyc7XHJcbiAgICAgICAgICAgIGNhcmRTcGFjZXIuY2xhc3NOYW1lID0gJ2hpZXJhcmNoeS1ub24tdG9nZ2xlLXNwYWNlcidcclxuICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChjYXJkU3BhY2VyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgIGl0ZW1Db250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgaXRlbUNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtQ2hpbGRyZW5Db250YWluZXIpO1xyXG4gICAgICAgIGl0ZW1DaGlsZHJlbkNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtRW1wdHlDaGlsZCk7XHJcbiAgICAgICAgaW5zZXJ0QWZ0ZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJlbmRcIiwgaXRlbUNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGxldCBhZGRlZENoaWxkcmVuOiBIVE1MRGl2RWxlbWVudFtdID0gW107XHJcbiAgICAgICAgdG9nZ2xlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0b2dnbGVCdXR0b24uaW5uZXJIVE1MID09PSBcIitcIil7IC8vIGV4cGFuZFxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlQnV0dG9uLmlubmVySFRNTCA9IFwiLVwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0R3JvdXAgPSBjYXJkR3JvdXBzLmZpbmQoZ3JvdXAgPT4gZ3JvdXAudW5pcXVlSUQgPT09IGlkKSBhcyBDYXJkR3JvdXA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbklEcyA9IHRhcmdldEdyb3VwLmNoaWxkcmVuSURzO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwcmV2SXRlbSA9IGl0ZW1FbXB0eUNoaWxkO1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5JRHMuZm9yRWFjaChpZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3SXRlbSA9IGNyZWF0ZUhpZXJhcmNoeUl0ZW0oaWQsIHByZXZJdGVtLCBkZXB0aCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkQ2hpbGRyZW4ucHVzaChuZXdJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2SXRlbSA9IG5ld0l0ZW07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxzZSB7IC8vIGNsb3NlXHJcbiAgICAgICAgICAgICAgICB0b2dnbGVCdXR0b24uaW5uZXJIVE1MID0gXCIrXCI7XHJcbiAgICAgICAgICAgICAgICBhZGRlZENoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY2hpbGQucmVtb3ZlKCkpO1xyXG4gICAgICAgICAgICAgICAgYWRkZWRDaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY29uc3QgaW50ZXJuYWxJdGVtIDogSGllcmFyY2h5SW50ZXJuYWxJdGVtID0ge1xyXG4gICAgICAgICAgICB1bmlxdWVJRDogaWQsXHJcbiAgICAgICAgICAgIGRlcHRoOiBkZXB0aCxcclxuICAgICAgICAgICAgZW1wdHlDaGlsZDogaXRlbUVtcHR5Q2hpbGRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGhpZXJhcmNoeU1hbmFnZXIuc2V0KGlkLCBpbnRlcm5hbEl0ZW0pO1xyXG5cclxuICAgICAgICBsYWJlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYoIWNvcnJlc3BvbmRpbmdJdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmKHdoaWNoTGVmdFBhbmVBY3RpdmUoKSA9PT0gTGVmdFBhbmVUeXBlLkRlc2t0b3Ape1xyXG4gICAgICAgICAgICAgICAgYWRkSXRlbVRvRGVza3RvcChjb3JyZXNwb25kaW5nSXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhZGRJdGVtVG9TdGFjayhjb3JyZXNwb25kaW5nSXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1Db250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHByZXZJdGVtID0gZW1wdHk7XHJcbiAgICByb290R3JvdXBzLmZvckVhY2gocm9vdEdyb3VwID0+IHtcclxuICAgICAgICBjb25zdCBuZXdJdGVtID0gY3JlYXRlSGllcmFyY2h5SXRlbShyb290R3JvdXAudW5pcXVlSUQsIHByZXZJdGVtLCAwKVxyXG4gICAgICAgIHByZXZJdGVtID0gbmV3SXRlbTtcclxuICAgIH0pXHJcbn0iLCJleHBvcnQgZW51bSBMZWZ0UGFuZVR5cGUge1xyXG4gICAgRGVza3RvcCxcclxuICAgIFNlYXJjaFN0YWNrLFxyXG4gICAgQWJvdXRcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmlnaHRQYW5lVHlwZSB7XHJcbiAgICBDcmVhdGVDYXJkLFxyXG4gICAgQ3JlYXRlQ2FyZEdyb3VwLFxyXG4gICAgU2VhcmNoLFxyXG4gICAgTWV0YWRhdGEsXHJcbiAgICBIaWVyYXJjaHlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRQYW5lTWFuYWdlbWVudCA9IChkZWZhdWx0TGVmdDogTGVmdFBhbmVUeXBlID0gTGVmdFBhbmVUeXBlLlNlYXJjaFN0YWNrLCBkZWZhdWx0UmlnaHQ6IFJpZ2h0UGFuZVR5cGUgPSBSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmRHcm91cCkgPT4ge1xyXG4gICAgY29uc3QgbGVmdFBhbmVEZXNrdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtZGVza3RvcFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGxlZnRQYW5lU2VhcmNoU3RhY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnQtcGFuZS1zZWFyY2gtc3RhY2tcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBsZWZ0UGFuZUFib3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtYWJvdXRcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCByaWdodFBhbmVDcmVhdGVDYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWNyZWF0ZS1jYXJkXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQ3JlYXRlQ2FyZEdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWNyZWF0ZS1jYXJkLWdyb3VwXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lU2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLXNlYXJjaFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZU1ldGFkYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLW1ldGFkYXRhXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lSGllcmFyY2h5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWhpZXJhcmNoeVwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIFxyXG4gICAgY29uc3QgbGVmdFBhbmVCdXR0b25EZXNrdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtYnV0dG9uLWRlc2t0b3BcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBsZWZ0UGFuZUJ1dHRvblNlYXJjaFN0YWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtYnV0dG9uLXNlYXJjaC1zdGFja1wiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGxlZnRQYW5lQnV0dG9uQWJvdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnQtcGFuZS1idXR0b24tYWJvdXRcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCByaWdodFBhbmVCdXR0b25DcmVhdGVDYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWJ1dHRvbi1jcmVhdGUtY2FyZFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvbkNyZWF0ZUNhcmRHcm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1idXR0b24tY3JlYXRlLWNhcmQtZ3JvdXBcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCByaWdodFBhbmVCdXR0b25TZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LXBhbmUtYnV0dG9uLXNlYXJjaFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvbk1ldGFkYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWJ1dHRvbi1tZXRhZGF0YVwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvbkhpZXJhcmNoeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1idXR0b24taGllcmFyY2h5XCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgXHJcbiAgICBjb25zdCBsZWZ0UGFuZU5vZGVFbnVtUGFpcnM6IFtIVE1MRGl2RWxlbWVudCwgTGVmdFBhbmVUeXBlXVtdID0gW1xyXG4gICAgICAgIFtsZWZ0UGFuZURlc2t0b3AsIExlZnRQYW5lVHlwZS5EZXNrdG9wXSxcclxuICAgICAgICBbbGVmdFBhbmVTZWFyY2hTdGFjaywgTGVmdFBhbmVUeXBlLlNlYXJjaFN0YWNrXSxcclxuICAgICAgICBbbGVmdFBhbmVBYm91dCwgTGVmdFBhbmVUeXBlLkFib3V0XVxyXG4gICAgXTtcclxuICAgIGNvbnN0IGxlZnRQYW5lQ2xpY2tlZCA9IChzZWxlY3RlZFBhbmU6IExlZnRQYW5lVHlwZSkgPT4ge1xyXG4gICAgICAgIGxlZnRQYW5lTm9kZUVudW1QYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xyXG4gICAgICAgICAgICBpZihwYWlyWzFdID09PSBzZWxlY3RlZFBhbmUpIHBhaXJbMF0uc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgZWxzZSBwYWlyWzBdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NlbGVjdGVkLWxlZnQtcGFuZScsIHNlbGVjdGVkUGFuZS50b1N0cmluZygpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJpZ2h0UGFuZU5vZGVFbnVtUGFpcnM6IFtIVE1MRGl2RWxlbWVudCwgUmlnaHRQYW5lVHlwZV1bXSA9IFtcclxuICAgICAgICBbcmlnaHRQYW5lQ3JlYXRlQ2FyZCwgUmlnaHRQYW5lVHlwZS5DcmVhdGVDYXJkXSxcclxuICAgICAgICBbcmlnaHRQYW5lQ3JlYXRlQ2FyZEdyb3VwLCBSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmRHcm91cF0sXHJcbiAgICAgICAgW3JpZ2h0UGFuZVNlYXJjaCwgUmlnaHRQYW5lVHlwZS5TZWFyY2hdLFxyXG4gICAgICAgIFtyaWdodFBhbmVNZXRhZGF0YSwgUmlnaHRQYW5lVHlwZS5NZXRhZGF0YV0sXHJcbiAgICAgICAgW3JpZ2h0UGFuZUhpZXJhcmNoeSwgUmlnaHRQYW5lVHlwZS5IaWVyYXJjaHldLFxyXG4gICAgXTtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUNsaWNrZWQgPSAoc2VsZWN0ZWRQYW5lOiBSaWdodFBhbmVUeXBlKSA9PiB7XHJcbiAgICAgICAgcmlnaHRQYW5lTm9kZUVudW1QYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xyXG4gICAgICAgICAgICBpZihwYWlyWzFdID09PSBzZWxlY3RlZFBhbmUpIHBhaXJbMF0uc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgZWxzZSBwYWlyWzBdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NlbGVjdGVkLXJpZ2h0LXBhbmUnLCBzZWxlY3RlZFBhbmUudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxlZnRQYW5lQnV0dG9uRGVza3RvcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGxlZnRQYW5lQ2xpY2tlZChMZWZ0UGFuZVR5cGUuRGVza3RvcCkpO1xyXG4gICAgbGVmdFBhbmVCdXR0b25TZWFyY2hTdGFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGxlZnRQYW5lQ2xpY2tlZChMZWZ0UGFuZVR5cGUuU2VhcmNoU3RhY2spKTtcclxuICAgIGxlZnRQYW5lQnV0dG9uQWJvdXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBsZWZ0UGFuZUNsaWNrZWQoTGVmdFBhbmVUeXBlLkFib3V0KSk7XHJcbiAgICByaWdodFBhbmVCdXR0b25DcmVhdGVDYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gcmlnaHRQYW5lQ2xpY2tlZChSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmQpKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvbkNyZWF0ZUNhcmRHcm91cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJpZ2h0UGFuZUNsaWNrZWQoUmlnaHRQYW5lVHlwZS5DcmVhdGVDYXJkR3JvdXApKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvblNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJpZ2h0UGFuZUNsaWNrZWQoUmlnaHRQYW5lVHlwZS5TZWFyY2gpKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvbk1ldGFkYXRhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gcmlnaHRQYW5lQ2xpY2tlZChSaWdodFBhbmVUeXBlLk1ldGFkYXRhKSk7XHJcbiAgICByaWdodFBhbmVCdXR0b25IaWVyYXJjaHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByaWdodFBhbmVDbGlja2VkKFJpZ2h0UGFuZVR5cGUuSGllcmFyY2h5KSk7XHJcblxyXG4gICAgLy8gZmluYWxpemUgcGFuZSBtYW5hZ2VtZW50IGFuZCBkaXNhYmxlIHNlbGVjdCBidXR0b25zXHJcbiAgICBsZWZ0UGFuZUNsaWNrZWQoZGVmYXVsdExlZnQpO1xyXG4gICAgcmlnaHRQYW5lQ2xpY2tlZChkZWZhdWx0UmlnaHQpO1xyXG4gICAgcmlnaHRQYW5lQnV0dG9uTWV0YWRhdGEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHN3aXRjaFRvRGVza3RvcCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGxlZnRQYW5lRGVza3RvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1wYW5lLWRlc2t0b3BcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBsZWZ0UGFuZVNlYXJjaFN0YWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtc2VhcmNoLXN0YWNrXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgbGVmdFBhbmVBYm91dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1wYW5lLWFib3V0XCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgbGVmdFBhbmVOb2RlRW51bVBhaXJzOiBbSFRNTERpdkVsZW1lbnQsIExlZnRQYW5lVHlwZV1bXSA9IFtcclxuICAgICAgICBbbGVmdFBhbmVEZXNrdG9wLCBMZWZ0UGFuZVR5cGUuRGVza3RvcF0sXHJcbiAgICAgICAgW2xlZnRQYW5lU2VhcmNoU3RhY2ssIExlZnRQYW5lVHlwZS5TZWFyY2hTdGFja10sXHJcbiAgICAgICAgW2xlZnRQYW5lQWJvdXQsIExlZnRQYW5lVHlwZS5BYm91dF1cclxuICAgIF07XHJcbiAgICBcclxuICAgIGNvbnN0IHNlbGVjdGVkUGFuZSA9IExlZnRQYW5lVHlwZS5EZXNrdG9wO1xyXG4gICAgbGVmdFBhbmVOb2RlRW51bVBhaXJzLmZvckVhY2gocGFpciA9PiB7XHJcbiAgICAgICAgaWYocGFpclsxXSA9PT0gc2VsZWN0ZWRQYW5lKSBwYWlyWzBdLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgZWxzZSBwYWlyWzBdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB9KTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzZWxlY3RlZC1sZWZ0LXBhbmUnLCBzZWxlY3RlZFBhbmUudG9TdHJpbmcoKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB3aGljaExlZnRQYW5lQWN0aXZlID0gKCkgPT4ge1xyXG4gICAgY29uc3QgbGVmdFBhbmVEZXNrdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtZGVza3RvcFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGxlZnRQYW5lU2VhcmNoU3RhY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnQtcGFuZS1zZWFyY2gtc3RhY2tcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgaWYobGVmdFBhbmVEZXNrdG9wLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJyl7XHJcbiAgICAgICAgcmV0dXJuIExlZnRQYW5lVHlwZS5EZXNrdG9wO1xyXG4gICAgfSBlbHNlIGlmKGxlZnRQYW5lU2VhcmNoU3RhY2suc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKXtcclxuICAgICAgICByZXR1cm4gTGVmdFBhbmVUeXBlLlNlYXJjaFN0YWNrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gTGVmdFBhbmVUeXBlLlNlYXJjaFN0YWNrOyAvLyBkZWZhdWx0IHRvIHRoZSBzZWFyY2ggc3RhY2tcclxuICAgIH1cclxufSIsImV4cG9ydCBjb25zdCBpbml0UGFuZVJlc2l6aW5nID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcmF0aW9CdXR0b24xMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYXRpby1idXR0b24tMS0xJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCByYXRpb0J1dHRvbjIxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhdGlvLWJ1dHRvbi0yLTEnKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJhdGlvQnV0dG9uMzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmF0aW8tYnV0dG9uLTMtMScpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgcmF0aW9CdXR0b240MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYXRpby1idXR0b24tNC0xJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3QgY2hhbmdlUGFuZVJhdGlvID0gKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlcikgPT4gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRvdGFsV2lkdGggPSA4MDtcclxuICAgICAgICBjb25zdCBsZWZ0V2lkdGggPSBNYXRoLmNlaWwobGVmdCAvIChsZWZ0ICsgcmlnaHQpICogdG90YWxXaWR0aCk7XHJcbiAgICAgICAgY29uc3QgcmlnaHRXaWR0aCA9IE1hdGguZmxvb3IocmlnaHQgLyAobGVmdCArIHJpZ2h0KSAqIHRvdGFsV2lkdGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHN0eWxlc2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1swXTsgLy8gc2hvdWxkIGJlIC93ZWIvc3R5bGUuY3NzXHJcbiAgICAgICAgZm9yKGxldCBydWxlIG9mIHN0eWxlc2hlZXQuY3NzUnVsZXMpe1xyXG4gICAgICAgICAgICBsZXQgc3IgPSBydWxlIGFzIENTU1N0eWxlUnVsZTtcclxuICAgICAgICAgICAgaWYoc3Iuc2VsZWN0b3JUZXh0ID09PSAnLmxlZnQtcGFuZS13aWR0aCcpe1xyXG4gICAgICAgICAgICAgICAgc3Iuc3R5bGUud2lkdGggPSBgJHtsZWZ0V2lkdGh9dndgO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoc3Iuc2VsZWN0b3JUZXh0ID09PSAnLnJpZ2h0LXBhbmUtd2lkdGgnKXtcclxuICAgICAgICAgICAgICAgIHNyLnN0eWxlLndpZHRoID0gYCR7cmlnaHRXaWR0aH12d2A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhbmVSYXRpb0pTT04gPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IGxlZnQsXHJcbiAgICAgICAgICAgIHJpZ2h0OiByaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwYW5lLXJhdGlvXCIsIEpTT04uc3RyaW5naWZ5KHBhbmVSYXRpb0pTT04pKTtcclxuICAgIH1cclxuXHJcbiAgICByYXRpb0J1dHRvbjExLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2hhbmdlUGFuZVJhdGlvKDEsIDEpKTtcclxuICAgIHJhdGlvQnV0dG9uMjEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaGFuZ2VQYW5lUmF0aW8oMiwgMSkpO1xyXG4gICAgcmF0aW9CdXR0b24zMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoYW5nZVBhbmVSYXRpbyg0LCAxKSk7XHJcbiAgICByYXRpb0J1dHRvbjQxLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2hhbmdlUGFuZVJhdGlvKDYsIDEpKTtcclxuXHJcbiAgICBjb25zdCBwcmV2UGFuZVJhdGlvSlNPTiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGFuZS1yYXRpb1wiKTtcclxuICAgIGlmKHByZXZQYW5lUmF0aW9KU09OICE9PSBudWxsKXtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2UGFuZVJhdGlvID0gSlNPTi5wYXJzZShwcmV2UGFuZVJhdGlvSlNPTik7XHJcbiAgICAgICAgICAgIGNoYW5nZVBhbmVSYXRpbyhwcmV2UGFuZVJhdGlvLmxlZnQsIHByZXZQYW5lUmF0aW8ucmlnaHQpKCk7XHJcbiAgICAgICAgfSBjYXRjaChlKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCJcclxuaW1wb3J0IHsgQ2FyZEdyb3VwIH0gZnJvbSBcIi4uL2NhcmRncm91cFwiXHJcblxyXG5jb25zdCBzZWFyY2hTdGFja0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtc3RhY2stY29udGFpbmVyJykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFNlYXJjaFN0YWNrID0gKGNhcmRzOiBDYXJkW10sIGNhcmRHcm91cHM6IENhcmRHcm91cFtdKSA9PiB7XHJcbiAgICBjb25zdCBjb21iaW5lZEl0ZW1zOiAoQ2FyZCB8IENhcmRHcm91cClbXSA9IFsuLi5jYXJkcywgLi4uY2FyZEdyb3Vwc107XHJcbiAgICBjb25zdCBjbGVhclN0YWNrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1zdGFjay1jbGVhci1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNsZWFyU3RhY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgc2VhcmNoU3RhY2tDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgc2F2ZVN0YWNrKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBsb2NhbCBzdG9yYWdlIGxvYWRpbmcuLi5cclxuICAgIGNvbnN0IHByZXZEYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzdGFjay1kYXRhXCIpO1xyXG4gICAgaWYocHJldkRhdGEgIT09IG51bGwpe1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHByZXZEYXRhKSBhcyB7c3RhY2s6IHN0cmluZ1tdfTtcclxuICAgICAgICAgICAgZGF0YS5zdGFjay5mb3JFYWNoKGlkID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjb21iaW5lZEl0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLnVuaXF1ZUlEID09PSBpZCk7XHJcbiAgICAgICAgICAgICAgICBpZighaXRlbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoU3RhY2tDb250YWluZXIuYXBwZW5kKGl0ZW0uZ2V0Tm9kZSgpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZW5hYmxlQ29weVRvRGVza3RvcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoKGUpe1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGxvY2FsIHN0b3JhZ2Ugc3RhY2sgc2F2aW5nLi4uXHJcbmV4cG9ydCBjb25zdCBzYXZlU3RhY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBkYXRhID0ge3N0YWNrOiBbXSBhcyBzdHJpbmdbXX07XHJcbiAgICBmb3IobGV0IGNoaWxkIG9mIHNlYXJjaFN0YWNrQ29udGFpbmVyLmNoaWxkcmVuKXtcclxuICAgICAgICBkYXRhLnN0YWNrLnB1c2goY2hpbGQuaWQpO1xyXG4gICAgfTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3RhY2stZGF0YVwiLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhZGRJdGVtVG9TdGFjayA9IChpdGVtIDogQ2FyZCB8IENhcmRHcm91cCkgPT4ge1xyXG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBpdGVtLmdldE5vZGUoKTtcclxuICAgIGl0ZW0uZW5hYmxlQ29weVRvRGVza3RvcCgpO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgaWYgKHdpbmRvdy5NYXRoSmF4KSBNYXRoSmF4LnR5cGVzZXQoW2N1cnJlbnROb2RlXSk7XHJcbiAgICBzZWFyY2hTdGFja0NvbnRhaW5lci5wcmVwZW5kKGN1cnJlbnROb2RlKTtcclxuICAgIHNhdmVTdGFjaygpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlSXRlbUZyb21TdGFjayA9IChpdGVtIDogQ2FyZCB8IENhcmRHcm91cCkgPT4ge1xyXG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBpdGVtLmdldE5vZGUoKTtcclxuICAgIGl0ZW0uZGlzYWJsZUNvcHlUb0Rlc2t0b3AoKTtcclxuICAgIGN1cnJlbnROb2RlLnJlbW92ZSgpO1xyXG4gICAgc2F2ZVN0YWNrKCk7XHJcbn0iLCJpbXBvcnQgeyBDYXJkIH0gZnJvbSBcIi4uL2NhcmRcIjtcclxuaW1wb3J0IHsgQ2FyZEdyb3VwIH0gZnJvbSBcIi4uL2NhcmRncm91cFwiO1xyXG5pbXBvcnQgKiBhcyBlbGFzdGljbHVuciBmcm9tIFwiZWxhc3RpY2x1bnJcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvU3RhY2sgfSBmcm9tIFwiLi9zZWFyY2gtc3RhY2tcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvRGVza3RvcCB9IGZyb20gXCIuL2Rlc2t0b3BcIjtcclxuaW1wb3J0IHsgd2hpY2hMZWZ0UGFuZUFjdGl2ZSwgTGVmdFBhbmVUeXBlIH0gZnJvbSBcIi4vcGFuZS1tYW5hZ2VtZW50XCI7XHJcblxyXG5leHBvcnQgdHlwZSBTZWFyY2hJbmRleCA9IHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U2VhcmNoID0gKGNhcmRzOiBDYXJkW10sIGNhcmRHcm91cHM6IENhcmRHcm91cFtdKSA9PiB7XHJcbiAgICBjb25zdCBjb21iaW5lZEl0ZW1zID0gWy4uLmNhcmRzLCAuLi5jYXJkR3JvdXBzXTtcclxuICAgIGNvbnN0IGluZGV4ID0gZWxhc3RpY2x1bnI8U2VhcmNoSW5kZXg+KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuYWRkRmllbGQoJ25hbWUnKTtcclxuICAgICAgICB0aGlzLmFkZEZpZWxkKCdkZXNjcmlwdGlvbicpO1xyXG4gICAgICAgIHRoaXMuc2V0UmVmKCdpZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZG9jdW1lbnRzOiBTZWFyY2hJbmRleFtdID0gY29tYmluZWRJdGVtcy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogaXRlbS5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgaWQ6IGl0ZW0udW5pcXVlSUQucmVwbGFjZSgvLS9nLCAnICcpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudHMuZm9yRWFjaChkb2N1bWVudCA9PiBpbmRleC5hZGREb2MoZG9jdW1lbnQpKTtcclxuXHJcbiAgICBjb25zdCBzZWFyY2hCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLXF1ZXJ5LWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IHNlYXJjaFJlc3VsdHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLXJlc3VsdHMtY29udGFpbmVyJykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBzZWFyY2hGaWx0ZXJDYXJkc09ubHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWZpbHRlci1jYXJkcy1vbmx5JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IHNlYXJjaEZpbHRlckNhcmRncm91cHNPbmx5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1maWx0ZXItY2FyZGdyb3Vwcy1vbmx5JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBjb25zdCBydW5TZWFyY2hRdWVyeSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBxdWVyeSA9IHNlYXJjaEJhci52YWx1ZTtcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gaW5kZXguc2VhcmNoKHF1ZXJ5LCB7XHJcbiAgICAgICAgICAgIGZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZToge2Jvb3N0OiAyfSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7Ym9vc3Q6IDF9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzZWFyY2gtcXVlcnlcIiwgcXVlcnkpO1xyXG5cclxuICAgICAgICBzZWFyY2hSZXN1bHRzQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaXNDYXJkID0gcmVzdWx0LnJlZi5zbGljZSgwLCAzKSAhPT0gJ1tnXSc7XHJcbiAgICAgICAgICAgIGlmKHNlYXJjaEZpbHRlckNhcmRzT25seS5jaGVja2VkICYmICFzZWFyY2hGaWx0ZXJDYXJkZ3JvdXBzT25seS5jaGVja2VkKXtcclxuICAgICAgICAgICAgICAgIGlmKCFpc0NhcmQpIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCFzZWFyY2hGaWx0ZXJDYXJkc09ubHkuY2hlY2tlZCAmJiBzZWFyY2hGaWx0ZXJDYXJkZ3JvdXBzT25seS5jaGVja2VkKXtcclxuICAgICAgICAgICAgICAgIGlmKGlzQ2FyZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHNlYXJjaEl0ZW0uY2xhc3NOYW1lID0gJ3NlYXJjaC1yZXN1bHQtaXRlbSc7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XHJcbiAgICAgICAgICAgIHNlYXJjaEhlYWRlci5jbGFzc05hbWUgPSAnc2VhcmNoLWl0ZW0taGVhZGVyJztcclxuICAgICAgICAgICAgc2VhcmNoSGVhZGVyLmlubmVySFRNTCA9IHJlc3VsdC5yZWY7IC8vLnJlcGxhY2UoLyAvZywgJy0nKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoQnV0dG9uUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHNlYXJjaEJ1dHRvblJvdy5jbGFzc05hbWUgPSAnc2VhcmNoLWJ1dHRvbi1yb3cnXHJcblxyXG4gICAgICAgICAgICAvLyBjb25zdCBhZGRUb1N0YWNrQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIC8vIGFkZFRvU3RhY2tCdXR0b24uaW5uZXJIVE1MID0gJ0FkZCB0byBTdGFjayc7XHJcbiAgICAgICAgICAgIC8vIHNlYXJjaEJ1dHRvblJvdy5hcHBlbmQoYWRkVG9TdGFja0J1dHRvbik7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGFkZFRvRGVza3RvcEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgICAgICAvLyBhZGRUb0Rlc2t0b3BCdXR0b24uaW5uZXJIVE1MID0gJ0FkZCB0byBEZXNrdG9wJztcclxuICAgICAgICAgICAgLy8gc2VhcmNoQnV0dG9uUm93LmFwcGVuZChhZGRUb0Rlc2t0b3BCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgc2VhcmNoSXRlbS5hcHBlbmQoc2VhcmNoSGVhZGVyKTtcclxuICAgICAgICAgICAgLy8gc2VhcmNoSXRlbS5hcHBlbmQoc2VhcmNoQnV0dG9uUm93KTtcclxuICAgICAgICAgICAgc2VhcmNoUmVzdWx0c0NvbnRhaW5lci5hcHBlbmQoc2VhcmNoSXRlbSk7XHJcblxyXG4gICAgICAgICAgICBzZWFyY2hJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc0lEID0gcmVzdWx0LnJlZi5yZXBsYWNlKC8gL2csICctJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gY29tYmluZWRJdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS51bmlxdWVJRCA9PT0gdGhpc0lEKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZighaXRlbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYod2hpY2hMZWZ0UGFuZUFjdGl2ZSgpID09PSBMZWZ0UGFuZVR5cGUuRGVza3RvcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkSXRlbVRvRGVza3RvcChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkSXRlbVRvU3RhY2soaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWFyY2hCYXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBydW5TZWFyY2hRdWVyeSk7XHJcbiAgICBzZWFyY2hGaWx0ZXJDYXJkc09ubHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBydW5TZWFyY2hRdWVyeSk7XHJcbiAgICBzZWFyY2hGaWx0ZXJDYXJkZ3JvdXBzT25seS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJ1blNlYXJjaFF1ZXJ5KTtcclxuXHJcbiAgICAvLyBmaW5hbGl6YXRpb25cXFxyXG4gICAgY29uc3QgcHJldlF1ZXJ5ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZWFyY2gtcXVlcnlcIik7XHJcbiAgICBpZihwcmV2UXVlcnkpe1xyXG4gICAgICAgIHNlYXJjaEJhci52YWx1ZSA9IHByZXZRdWVyeTtcclxuICAgICAgICBydW5TZWFyY2hRdWVyeSgpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNvbnN0IGNvcHlUb0NsaXBib2FyZCA9IChjb250ZW50OiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChjb250ZW50KTtcclxufSBcclxuXHJcbmV4cG9ydCBjb25zdCBjb3B5RnJvbUNsaXBib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHRleHQgPSBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XHJcbiAgICByZXR1cm4gdGV4dDtcclxufSIsImV4cG9ydCBjb25zdCBnZXRNTUREWVlZWSA9ICgpID0+IHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgTU0gPSBgJHtkYXRlLmdldE1vbnRoKCkgKyAxfWAucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IEREID0gYCR7ZGF0ZS5nZXREYXRlKCl9YC5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3QgWVlZWSA9IGAke2RhdGUuZ2V0RnVsbFllYXIoKX1gO1xyXG4gICAgcmV0dXJuIGAke01NfS0ke0REfS0ke1lZWVl9YDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEhITU0gPSAoKSA9PiB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBYTSA9ICdBTSc7XHJcbiAgICBsZXQgSEg6IHN0cmluZyB8IG51bWJlciA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgIGlmKEhIID09PSAwKSB7XHJcbiAgICAgICAgSEggPSAxMjtcclxuICAgICAgICBYTSA9ICdBTSc7XHJcbiAgICB9IGVsc2UgaWYoSEggPT09IDEyKXtcclxuICAgICAgICBYTSA9ICdQTSc7XHJcbiAgICB9IGVsc2UgaWYoSEggPj0gMTMpe1xyXG4gICAgICAgIEhIIC09IDEyO1xyXG4gICAgICAgIFhNID0gJ1BNJztcclxuICAgIH1cclxuICAgIEhIID0gYCR7SEh9YC5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgbGV0IE1NID0gYCR7ZGF0ZS5nZXRNaW51dGVzKCl9YC5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgcmV0dXJuIGAke0hIfS0ke01NfSR7WE19YFxyXG59IiwiZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IChmaWxlbmFtZTogc3RyaW5nLCBkYXRhOiBzdHJpbmcpID0+IHtcclxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbZGF0YV0pO1xyXG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGxpbmsuaHJlZiA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVuYW1lO1xyXG4gICAgbGluay5jbGljaygpO1xyXG59IiwiZXhwb3J0IGNvbnN0IHRvSlNPTlNhZmVUZXh0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIHRleHRcclxuICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCBcIlxcXFxcXFxcXCIpXHJcbiAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpXHJcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiXFxcXFxcXCJcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBmcm9tSlNPTlNhZmVUZXh0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIHRleHRcclxuICAgICAgICAucmVwbGFjZSgvXFxcXG4oPyFbYS16XSkvZywgXCJcXG5cIilcclxuICAgICAgICAucmVwbGFjZSgvXFxcXFwibi9nLCBcIlxcXCJcIik7XHJcbn0iLCJleHBvcnQgY29uc3QgbG9hZERhdGEgPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIGNsaWVudC5vcGVuKCdHRVQnLCBwYXRoKTtcclxuICAgICAgICBjbGllbnQucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xyXG4gICAgICAgIGNsaWVudC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hhZGVyQ29kZSA9IGNsaWVudC5yZXNwb25zZTtcclxuICAgICAgICAgICAgcmVzb2x2ZShzaGFkZXJDb2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xpZW50LnNlbmQoKTtcclxuICAgIH0pO1xyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IENhcmQsIENhcmRKU09OIH0gZnJvbSBcIi4vY2FyZFwiO1xyXG5pbXBvcnQgeyBsb2FkRGF0YSB9IGZyb20gXCIuL3V0aWwvbG9hZGVyXCI7XHJcbmltcG9ydCB7IGluaXRDYXJkQXV0aG9yaW5nIH0gZnJvbSBcIi4vZmVhdHVyZXMvY2FyZC1hdXRob3JpbmdcIjtcclxuaW1wb3J0IHsgY3JlYXRlVlNwYWNlciB9IGZyb20gXCIuL3V0aWwvc3BhY2Vyc1wiO1xyXG5pbXBvcnQgeyBMZWZ0UGFuZVR5cGUsIFJpZ2h0UGFuZVR5cGUsIGluaXRQYW5lTWFuYWdlbWVudCB9IGZyb20gXCIuL2ZlYXR1cmVzL3BhbmUtbWFuYWdlbWVudFwiO1xyXG5pbXBvcnQgeyBpbml0Q2FyZEdyb3VwQXV0aG9yaW5nIH0gZnJvbSBcIi4vZmVhdHVyZXMvY2FyZC1ncm91cC1hdXRob3JpbmdcIjtcclxuaW1wb3J0IHsgQ2FyZEdyb3VwLCBDYXJkR3JvdXBKU09OIH0gZnJvbSBcIi4vY2FyZGdyb3VwXCI7XHJcbmltcG9ydCB7IGluaXRIaWVyYXJjaHkgfSBmcm9tIFwiLi9mZWF0dXJlcy9oaWVyYXJjaHlcIjtcclxuaW1wb3J0IHsgaW5pdFNlYXJjaCB9IGZyb20gXCIuL2ZlYXR1cmVzL3NlYXJjaFwiO1xyXG5pbXBvcnQgeyBpbml0U2VhcmNoU3RhY2sgfSBmcm9tIFwiLi9mZWF0dXJlcy9zZWFyY2gtc3RhY2tcIjtcclxuaW1wb3J0IHsgaW5pdERlc2t0b3AgfSBmcm9tIFwiLi9mZWF0dXJlcy9kZXNrdG9wXCI7XHJcbmltcG9ydCB7IGluaXRQYW5lUmVzaXppbmcgfSBmcm9tIFwiLi9mZWF0dXJlcy9wYW5lLXJlc2l6aW5nXCI7XHJcblxyXG5jb25zdCBsb2FkQ2FyZHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJkTWFwID0gYXdhaXQgbG9hZERhdGEoJy4vY2FyZC1tYXAuanNvbicpO1xyXG4gICAgY29uc3QgcGF0aHM6IHN0cmluZ1tdID0gY2FyZE1hcC5maWxlcztcclxuICAgIGNvbnN0IGNhcmRzSlNPTiA9IGF3YWl0IFByb21pc2UuYWxsKHBhdGhzLm1hcChwYXRoID0+IGxvYWREYXRhKGAuL2RhdGEtY2FyZHMvJHtwYXRofS5qc29uYCkpKTtcclxuXHJcbiAgICByZXR1cm4gY2FyZHNKU09OO1xyXG59XHJcblxyXG5jb25zdCBsb2FkQ2FyZEdyb3VwcyA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGNhcmRNYXAgPSBhd2FpdCBsb2FkRGF0YSgnLi9jYXJkLWdyb3VwLW1hcC5qc29uJyk7XHJcbiAgICBjb25zdCBwYXRoczogc3RyaW5nW10gPSBjYXJkTWFwLmZpbGVzO1xyXG4gICAgY29uc3QgY2FyZHNKU09OID0gYXdhaXQgUHJvbWlzZS5hbGwocGF0aHMubWFwKHBhdGggPT4gbG9hZERhdGEoYC4vZGF0YS1jYXJkLWdyb3Vwcy8ke3BhdGh9Lmpzb25gKSkpO1xyXG5cclxuICAgIHJldHVybiBjYXJkc0pTT047XHJcbn1cclxuXHJcbmNvbnN0IGluaXQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBsZXQgY2FyZHNKU09OOiBDYXJkSlNPTltdID0gYXdhaXQgbG9hZENhcmRzKCk7XHJcbiAgICBsZXQgY2FyZEdyb3Vwc0pTT046IENhcmRHcm91cEpTT05bXSA9IGF3YWl0IGxvYWRDYXJkR3JvdXBzKCk7XHJcbiAgICBsZXQgY2FyZHMgPSBjYXJkc0pTT04ubWFwKGRhdGEgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcmQgPSBuZXcgQ2FyZChkYXRhLm5hbWUsIGRhdGEuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGlmKGRhdGEuY3JlYXRpb25EYXRlICYmIGRhdGEuZWRpdERhdGUpe1xyXG4gICAgICAgICAgICBjYXJkLnNldERhdGVzKGRhdGEuY3JlYXRpb25EYXRlLCBkYXRhLmVkaXREYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZGF0YS5jYXRlZ29yaWVzICYmIGRhdGEuc3ViY2FyZHMpe1xyXG4gICAgICAgICAgICBjYXJkLnNldENhdGVnb3JpZXMoZGF0YS5jYXRlZ29yaWVzKTtcclxuICAgICAgICAgICAgY2FyZC5zZXRTdWJjYXJkcyhkYXRhLnN1YmNhcmRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhcmQ7XHJcbiAgICB9KTtcclxuICAgIGxldCBjYXJkR3JvdXBzID0gY2FyZEdyb3Vwc0pTT04ubWFwKGRhdGEgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcmRHcm91cCA9IG5ldyBDYXJkR3JvdXAoZGF0YS5uYW1lLCBkYXRhLmRlc2NyaXB0aW9uKTtcclxuICAgICAgICBpZihkYXRhLmNoaWxkcmVuSURzKSBjYXJkR3JvdXAuc2V0Q2hpbGRyZW5JRHMoZGF0YS5jaGlsZHJlbklEcyk7XHJcbiAgICAgICAgcmV0dXJuIGNhcmRHcm91cDtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNhcmRzLmZvckVhY2goY2FyZCA9PiB7XHJcbiAgICAvLyAgICAgY29uc3QgZG9tTm9kZSA9IGNhcmQuZ2V0Tm9kZSgpO1xyXG4gICAgLy8gICAgIGxlZnRQYW5lTm9kZS5hcHBlbmQoZG9tTm9kZSk7XHJcbiAgICAvLyAgICAgbGVmdFBhbmVOb2RlLmFwcGVuZChjcmVhdGVWU3BhY2VyKDgpKTtcclxuICAgIC8vIH0pO1xyXG4gICAgLy8gY2FyZEdyb3Vwcy5mb3JFYWNoKGNhcmRHcm91cCA9PiB7XHJcbiAgICAvLyAgICAgY29uc3QgZG9tTm9kZSA9IGNhcmRHcm91cC5nZXROb2RlKCk7XHJcbiAgICAvLyAgICAgbGVmdFBhbmVOb2RlLmFwcGVuZChkb21Ob2RlKTtcclxuICAgIC8vICAgICBsZWZ0UGFuZU5vZGUuYXBwZW5kKGNyZWF0ZVZTcGFjZXIoOCkpO1xyXG4gICAgLy8gfSk7XHJcblxyXG4gICAgY29uc3QgcHJldlNlbGVjdGVkTGVmdFBhbmUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2VsZWN0ZWQtbGVmdC1wYW5lJyk7XHJcbiAgICBjb25zdCBwcmV2U2VsZWN0ZWRSaWdodFBhbmUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2VsZWN0ZWQtcmlnaHQtcGFuZScpO1xyXG4gICAgaWYocHJldlNlbGVjdGVkTGVmdFBhbmUgIT09IG51bGwgJiYgcHJldlNlbGVjdGVkUmlnaHRQYW5lICE9PSBudWxsKXtcclxuICAgICAgICBjb25zdCBwcmV2TGVmdCA9IHBhcnNlSW50KHByZXZTZWxlY3RlZExlZnRQYW5lKSBhcyBMZWZ0UGFuZVR5cGU7XHJcbiAgICAgICAgY29uc3QgcHJldlJpZ2h0ID0gcGFyc2VJbnQocHJldlNlbGVjdGVkUmlnaHRQYW5lKSBhcyBSaWdodFBhbmVUeXBlO1xyXG4gICAgICAgIGluaXRQYW5lTWFuYWdlbWVudChwcmV2TGVmdCwgcHJldlJpZ2h0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5pdFBhbmVNYW5hZ2VtZW50KExlZnRQYW5lVHlwZS5EZXNrdG9wLCBSaWdodFBhbmVUeXBlLlNlYXJjaCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdENhcmRBdXRob3JpbmcoKTtcclxuICAgIGluaXRDYXJkR3JvdXBBdXRob3JpbmcoKTtcclxuICAgIGluaXRIaWVyYXJjaHkoY2FyZHMsIGNhcmRHcm91cHMpO1xyXG4gICAgaW5pdFNlYXJjaChjYXJkcywgY2FyZEdyb3Vwcyk7XHJcblxyXG4gICAgaW5pdFNlYXJjaFN0YWNrKGNhcmRzLCBjYXJkR3JvdXBzKTtcclxuICAgIGluaXREZXNrdG9wKGNhcmRzLCBjYXJkR3JvdXBzKTtcclxuICAgIGluaXRQYW5lUmVzaXppbmcoKTtcclxuICAgIFxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgaWYgKHdpbmRvdy5NYXRoSmF4KSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIE1hdGhKYXgudHlwZXNldCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9