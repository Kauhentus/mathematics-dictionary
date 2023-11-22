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
        console.log(node);
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
/* harmony export */   "initDesktop": () => (/* binding */ initDesktop)
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
const initDesktop = (cards, cardGroups) => {
    const desktopSurface = document.getElementById('desktop-container');
    const combinedItems = [...cards, ...cardGroups];
    // create interactive surface
    let columns = 2;
    let slots = 50;
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
/* harmony export */   "initSearchStack": () => (/* binding */ initSearchStack)
/* harmony export */ });
const searchStackContainer = document.getElementById('search-stack-container');
const initSearchStack = () => {
    const clearStackButton = document.getElementById('search-stack-clear-button');
    clearStackButton.addEventListener('click', () => {
        searchStackContainer.innerHTML = '';
    });
};
const addItemToStack = (item) => {
    const currentNode = item.getNode();
    // @ts-ignore
    if (window.MathJax)
        MathJax.typeset([currentNode]);
    searchStackContainer.prepend(currentNode);
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
    (0,_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.initPaneManagement)(_features_pane_management__WEBPACK_IMPORTED_MODULE_3__.LeftPaneType.SearchStack, _features_pane_management__WEBPACK_IMPORTED_MODULE_3__.RightPaneType.Search);
    (0,_features_card_authoring__WEBPACK_IMPORTED_MODULE_2__.initCardAuthoring)();
    (0,_features_card_group_authoring__WEBPACK_IMPORTED_MODULE_4__.initCardGroupAuthoring)();
    (0,_features_hierarchy__WEBPACK_IMPORTED_MODULE_6__.initHierarchy)(cards, cardGroups);
    (0,_features_search__WEBPACK_IMPORTED_MODULE_7__.initSearch)(cards, cardGroups);
    (0,_features_search_stack__WEBPACK_IMPORTED_MODULE_8__.initSearchStack)();
    (0,_features_desktop__WEBPACK_IMPORTED_MODULE_9__.initDesktop)(cards, cardGroups);
    // @ts-ignore
    if (window.MathJax)
        MathJax.typeset();
});
init();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxTQUFTLFFBQVEsU0FBUyxTQUFTLFdBQVc7QUFDbkY7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFdBQVcsU0FBUztBQUNwQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQkFBZ0I7QUFDM0IsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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NEI7QUFDNUIsZ0NBQWdDLGNBQWM7QUFDOUMsZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxrQkFBa0I7QUFDN0I7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIs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QyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFL0IsYUFBYTtJQUNiLElBQUksTUFBTSxDQUFDLE9BQU87UUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDMUMsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGJydC8uL25vZGVfbW9kdWxlcy9lbGFzdGljbHVuci9lbGFzdGljbHVuci5qcyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2NhcmQudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9jYXJkZ3JvdXAudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9mZWF0dXJlcy9jYXJkLWF1dGhvcmluZy50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL2NhcmQtZ3JvdXAtYXV0aG9yaW5nLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvZmVhdHVyZXMvZGVza3RvcC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL2hpZXJhcmNoeS50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL3BhbmUtbWFuYWdlbWVudC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL3NlYXJjaC1zdGFjay50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2ZlYXR1cmVzL3NlYXJjaC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL3V0aWwvY2xpcGJvYXJkLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvdXRpbC9kYXRlLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvdXRpbC9kb3dubG9hZC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL3V0aWwvanNvbi10ZXh0LWNvbnZlcnRlci50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL3V0aWwvbG9hZGVyLnRzIiwid2VicGFjazovL3BicnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGJydC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9wYnJ0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wYnJ0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGJydC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BicnQvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBlbGFzdGljbHVuciAtIGh0dHA6Ly93ZWl4c29uZy5naXRodWIuaW9cbiAqIExpZ2h0d2VpZ2h0IGZ1bGwtdGV4dCBzZWFyY2ggZW5naW5lIGluIEphdmFzY3JpcHQgZm9yIGJyb3dzZXIgc2VhcmNoIGFuZCBvZmZsaW5lIHNlYXJjaC4gLSAwLjkuNVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICogTUlUIExpY2Vuc2VkXG4gKiBAbGljZW5zZVxuICovXG5cbihmdW5jdGlvbigpe1xuXG4vKiFcbiAqIGVsYXN0aWNsdW5yLmpzXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBpbnN0YW50aWF0aW5nIGEgbmV3IGVsYXN0aWNsdW5yIGluZGV4IGFuZCBjb25maWd1cmluZyBpdFxuICogd2l0aCB0aGUgZGVmYXVsdCBwaXBlbGluZSBmdW5jdGlvbnMgYW5kIHRoZSBwYXNzZWQgY29uZmlnIGZ1bmN0aW9uLlxuICpcbiAqIFdoZW4gdXNpbmcgdGhpcyBjb252ZW5pZW5jZSBmdW5jdGlvbiBhIG5ldyBpbmRleCB3aWxsIGJlIGNyZWF0ZWQgd2l0aCB0aGVcbiAqIGZvbGxvd2luZyBmdW5jdGlvbnMgYWxyZWFkeSBpbiB0aGUgcGlwZWxpbmU6XG4gKiBcbiAqIDEuIGVsYXN0aWNsdW5yLnRyaW1tZXIgLSB0cmltIG5vbi13b3JkIGNoYXJhY3RlclxuICogMi4gZWxhc3RpY2x1bnIuU3RvcFdvcmRGaWx0ZXIgLSBmaWx0ZXJzIG91dCBhbnkgc3RvcCB3b3JkcyBiZWZvcmUgdGhleSBlbnRlciB0aGVcbiAqIGluZGV4XG4gKiAzLiBlbGFzdGljbHVuci5zdGVtbWVyIC0gc3RlbXMgdGhlIHRva2VucyBiZWZvcmUgZW50ZXJpbmcgdGhlIGluZGV4LlxuICpcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICB2YXIgaWR4ID0gZWxhc3RpY2x1bnIoZnVuY3Rpb24gKCkge1xuICogICAgICAgdGhpcy5hZGRGaWVsZCgnaWQnKTtcbiAqICAgICAgIHRoaXMuYWRkRmllbGQoJ3RpdGxlJyk7XG4gKiAgICAgICB0aGlzLmFkZEZpZWxkKCdib2R5Jyk7XG4gKiAgICAgICBcbiAqICAgICAgIC8vdGhpcy5zZXRSZWYoJ2lkJyk7IC8vIGRlZmF1bHQgcmVmIGlzICdpZCdcbiAqXG4gKiAgICAgICB0aGlzLnBpcGVsaW5lLmFkZChmdW5jdGlvbiAoKSB7XG4gKiAgICAgICAgIC8vIHNvbWUgY3VzdG9tIHBpcGVsaW5lIGZ1bmN0aW9uXG4gKiAgICAgICB9KTtcbiAqICAgICB9KTtcbiAqIFxuICogICAgaWR4LmFkZERvYyh7XG4gKiAgICAgIGlkOiAxLCBcbiAqICAgICAgdGl0bGU6ICdPcmFjbGUgcmVsZWFzZWQgZGF0YWJhc2UgMTJnJyxcbiAqICAgICAgYm9keTogJ1llc3RhZGF5LCBPcmFjbGUgaGFzIHJlbGVhc2VkIHRoZWlyIGxhdGVzdCBkYXRhYmFzZSwgbmFtZWQgMTJnLCBtb3JlIHJvYnVzdC4gdGhpcyBwcm9kdWN0IHdpbGwgaW5jcmVhc2UgT3JhY2xlIHByb2ZpdC4nXG4gKiAgICB9KTtcbiAqIFxuICogICAgaWR4LmFkZERvYyh7XG4gKiAgICAgIGlkOiAyLCBcbiAqICAgICAgdGl0bGU6ICdPcmFjbGUgcmVsZWFzZWQgYW5udWFsIHByb2ZpdCByZXBvcnQnLFxuICogICAgICBib2R5OiAnWWVzdGFkYXksIE9yYWNsZSBoYXMgcmVsZWFzZWQgdGhlaXIgYW5udWFsIHByb2ZpdCByZXBvcnQgb2YgMjAxNSwgdG90YWwgcHJvZml0IGlzIDEyLjUgQmlsbGlvbi4nXG4gKiAgICB9KTtcbiAqIFxuICogICAgIyBzaW1wbGUgc2VhcmNoXG4gKiAgICBpZHguc2VhcmNoKCdvcmFjbGUgZGF0YWJhc2UnKTtcbiAqIFxuICogICAgIyBzZWFyY2ggd2l0aCBxdWVyeS10aW1lIGJvb3N0aW5nXG4gKiAgICBpZHguc2VhcmNoKCdvcmFjbGUgZGF0YWJhc2UnLCB7ZmllbGRzOiB7dGl0bGU6IHtib29zdDogMn0sIGJvZHk6IHtib29zdDogMX19fSk7XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZmlnIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBuZXcgaW5zdGFuY2VcbiAqIG9mIHRoZSBlbGFzdGljbHVuci5JbmRleCBhcyBib3RoIGl0cyBjb250ZXh0IGFuZCBmaXJzdCBwYXJhbWV0ZXIuIEl0IGNhbiBiZSB1c2VkIHRvXG4gKiBjdXN0b21pemUgdGhlIGluc3RhbmNlIG9mIG5ldyBlbGFzdGljbHVuci5JbmRleC5cbiAqIEBuYW1lc3BhY2VcbiAqIEBtb2R1bGVcbiAqIEByZXR1cm4ge2VsYXN0aWNsdW5yLkluZGV4fVxuICpcbiAqL1xudmFyIGVsYXN0aWNsdW5yID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICB2YXIgaWR4ID0gbmV3IGVsYXN0aWNsdW5yLkluZGV4O1xuXG4gIGlkeC5waXBlbGluZS5hZGQoXG4gICAgZWxhc3RpY2x1bnIudHJpbW1lcixcbiAgICBlbGFzdGljbHVuci5zdG9wV29yZEZpbHRlcixcbiAgICBlbGFzdGljbHVuci5zdGVtbWVyXG4gICk7XG5cbiAgaWYgKGNvbmZpZykgY29uZmlnLmNhbGwoaWR4LCBpZHgpO1xuXG4gIHJldHVybiBpZHg7XG59O1xuXG5lbGFzdGljbHVuci52ZXJzaW9uID0gXCIwLjkuNVwiO1xuXG4vLyBvbmx5IHVzZWQgdGhpcyB0byBtYWtlIGVsYXN0aWNsdW5yLmpzIGNvbXBhdGlibGUgd2l0aCBsdW5yLWxhbmd1YWdlc1xuLy8gdGhpcyBpcyBhIHRyaWNrIHRvIGRlZmluZSBhIGdsb2JhbCBhbGlhcyBvZiBlbGFzdGljbHVuclxubHVuciA9IGVsYXN0aWNsdW5yO1xuXG4vKiFcbiAqIGVsYXN0aWNsdW5yLnV0aWxzXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIEEgbmFtZXNwYWNlIGNvbnRhaW5pbmcgdXRpbHMgZm9yIHRoZSByZXN0IG9mIHRoZSBlbGFzdGljbHVuciBsaWJyYXJ5XG4gKi9cbmVsYXN0aWNsdW5yLnV0aWxzID0ge307XG5cbi8qKlxuICogUHJpbnQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gYmUgcHJpbnRlZC5cbiAqIEBtZW1iZXJPZiBVdGlsc1xuICovXG5lbGFzdGljbHVuci51dGlscy53YXJuID0gKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgaWYgKGdsb2JhbC5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcbn0pKHRoaXMpO1xuXG4vKipcbiAqIENvbnZlcnQgYW4gb2JqZWN0IHRvIHN0cmluZy5cbiAqXG4gKiBJbiB0aGUgY2FzZSBvZiBgbnVsbGAgYW5kIGB1bmRlZmluZWRgIHRoZSBmdW5jdGlvbiByZXR1cm5zXG4gKiBhbiBlbXB0eSBzdHJpbmcsIGluIGFsbCBvdGhlciBjYXNlcyB0aGUgcmVzdWx0IG9mIGNhbGxpbmdcbiAqIGB0b1N0cmluZ2Agb24gdGhlIHBhc3NlZCBvYmplY3QgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgcGFzc2VkIG9iamVjdC5cbiAqIEBtZW1iZXJPZiBVdGlsc1xuICovXG5lbGFzdGljbHVuci51dGlscy50b1N0cmluZyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgaWYgKG9iaiA9PT0gdm9pZCAwIHx8IG9iaiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgcmV0dXJuIG9iai50b1N0cmluZygpO1xufTtcbi8qIVxuICogZWxhc3RpY2x1bnIuRXZlbnRFbWl0dGVyXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIGVsYXN0aWNsdW5yLkV2ZW50RW1pdHRlciBpcyBhbiBldmVudCBlbWl0dGVyIGZvciBlbGFzdGljbHVuci5cbiAqIEl0IG1hbmFnZXMgYWRkaW5nIGFuZCByZW1vdmluZyBldmVudCBoYW5kbGVycyBhbmQgdHJpZ2dlcmluZyBldmVudHMgYW5kIHRoZWlyIGhhbmRsZXJzLlxuICpcbiAqIEVhY2ggZXZlbnQgY291bGQgaGFzIG11bHRpcGxlIGNvcnJlc3BvbmRpbmcgZnVuY3Rpb25zLFxuICogdGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgY2FsbGVkIGFzIHRoZSBzZXF1ZW5jZSB0aGF0IHRoZXkgYXJlIGFkZGVkIGludG8gdGhlIGV2ZW50LlxuICogXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZWxhc3RpY2x1bnIuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmV2ZW50cyA9IHt9O1xufTtcblxuLyoqXG4gKiBCaW5kcyBhIGhhbmRsZXIgZnVuY3Rpb24gdG8gYSBzcGVjaWZpYyBldmVudChzKS5cbiAqXG4gKiBDYW4gYmluZCBhIHNpbmdsZSBmdW5jdGlvbiB0byBtYW55IGRpZmZlcmVudCBldmVudHMgaW4gb25lIGNhbGwuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFtldmVudE5hbWVdIFRoZSBuYW1lKHMpIG9mIGV2ZW50cyB0byBiaW5kIHRoaXMgZnVuY3Rpb24gdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIGFuIGV2ZW50IGlzIGZpcmVkLlxuICogQG1lbWJlck9mIEV2ZW50RW1pdHRlclxuICovXG5lbGFzdGljbHVuci5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXG4gICAgICBmbiA9IGFyZ3MucG9wKCksXG4gICAgICBuYW1lcyA9IGFyZ3M7XG5cbiAgaWYgKHR5cGVvZiBmbiAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yIChcImxhc3QgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG4gIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaGFzSGFuZGxlcihuYW1lKSkgdGhpcy5ldmVudHNbbmFtZV0gPSBbXTtcbiAgICB0aGlzLmV2ZW50c1tuYW1lXS5wdXNoKGZuKTtcbiAgfSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYSBoYW5kbGVyIGZ1bmN0aW9uIGZyb20gYSBzcGVjaWZpYyBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgdGhpcyBmdW5jdGlvbiBmcm9tLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHJlbW92ZSBmcm9tIGFuIGV2ZW50LlxuICogQG1lbWJlck9mIEV2ZW50RW1pdHRlclxuICovXG5lbGFzdGljbHVuci5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKG5hbWUsIGZuKSB7XG4gIGlmICghdGhpcy5oYXNIYW5kbGVyKG5hbWUpKSByZXR1cm47XG5cbiAgdmFyIGZuSW5kZXggPSB0aGlzLmV2ZW50c1tuYW1lXS5pbmRleE9mKGZuKTtcbiAgaWYgKGZuSW5kZXggPT09IC0xKSByZXR1cm47XG5cbiAgdGhpcy5ldmVudHNbbmFtZV0uc3BsaWNlKGZuSW5kZXgsIDEpO1xuXG4gIGlmICh0aGlzLmV2ZW50c1tuYW1lXS5sZW5ndGggPT0gMCkgZGVsZXRlIHRoaXMuZXZlbnRzW25hbWVdO1xufTtcblxuLyoqXG4gKiBDYWxsIGFsbCBmdW5jdGlvbnMgdGhhdCBib3VuZGVkIHRvIHRoZSBnaXZlbiBldmVudC5cbiAqXG4gKiBBZGRpdGlvbmFsIGRhdGEgY2FuIGJlIHBhc3NlZCB0byB0aGUgZXZlbnQgaGFuZGxlciBhcyBhcmd1bWVudHMgdG8gYGVtaXRgXG4gKiBhZnRlciB0aGUgZXZlbnQgbmFtZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBlbWl0LlxuICogQG1lbWJlck9mIEV2ZW50RW1pdHRlclxuICovXG5lbGFzdGljbHVuci5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICBpZiAoIXRoaXMuaGFzSGFuZGxlcihuYW1lKSkgcmV0dXJuO1xuXG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICB0aGlzLmV2ZW50c1tuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gIH0sIHRoaXMpO1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGhhbmRsZXIgaGFzIGV2ZXIgYmVlbiBzdG9yZWQgYWdhaW5zdCBhbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBjaGVjay5cbiAqIEBwcml2YXRlXG4gKiBAbWVtYmVyT2YgRXZlbnRFbWl0dGVyXG4gKi9cbmVsYXN0aWNsdW5yLkV2ZW50RW1pdHRlci5wcm90b3R5cGUuaGFzSGFuZGxlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBuYW1lIGluIHRoaXMuZXZlbnRzO1xufTtcbi8qIVxuICogZWxhc3RpY2x1bnIudG9rZW5pemVyXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gZm9yIHNwbGl0dGluZyBhIHN0cmluZyBpbnRvIHRva2Vucy5cbiAqIEN1cnJlbnRseSBFbmdsaXNoIGlzIHN1cHBvcnRlZCBhcyBkZWZhdWx0LlxuICogVXNlcyBgZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvcmAgdG8gc3BsaXQgc3RyaW5ncywgeW91IGNvdWxkIGNoYW5nZVxuICogdGhlIHZhbHVlIG9mIHRoaXMgcHJvcGVydHkgdG8gc2V0IGhvdyB5b3Ugd2FudCBzdHJpbmdzIGFyZSBzcGxpdCBpbnRvIHRva2Vucy5cbiAqIElNUE9SVEFOVDogdXNlIGVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3IgY2FyZWZ1bGx5LCBpZiB5b3UgYXJlIG5vdCBmYW1pbGlhciB3aXRoXG4gKiB0ZXh0IHByb2Nlc3MsIHRoZW4geW91J2QgYmV0dGVyIG5vdCBjaGFuZ2UgaXQuXG4gKlxuICogQG1vZHVsZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRoYXQgeW91IHdhbnQgdG8gdG9rZW5pemUuXG4gKiBAc2VlIGVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3JcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5lbGFzdGljbHVuci50b2tlbml6ZXIgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCB8fCBzdHIgPT09IG51bGwgfHwgc3RyID09PSB1bmRlZmluZWQpIHJldHVybiBbXTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RyKSkge1xuICAgIHZhciBhcnIgPSBzdHIuZmlsdGVyKGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICBpZiAodG9rZW4gPT09IG51bGwgfHwgdG9rZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgYXJyID0gYXJyLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIGVsYXN0aWNsdW5yLnV0aWxzLnRvU3RyaW5nKHQpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgb3V0ID0gW107XG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIHRva2VucyA9IGl0ZW0uc3BsaXQoZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvcik7XG4gICAgICBvdXQgPSBvdXQuY29uY2F0KHRva2Vucyk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcmV0dXJuIHN0ci50b1N0cmluZygpLnRyaW0oKS50b0xvd2VyQ2FzZSgpLnNwbGl0KGVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3IpO1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IHN0cmluZyBzZXBlcmF0b3IuXG4gKi9cbmVsYXN0aWNsdW5yLnRva2VuaXplci5kZWZhdWx0U2VwZXJhdG9yID0gL1tcXHNcXC1dKy87XG5cbi8qKlxuICogVGhlIHNwZXJhdG9yIHVzZWQgdG8gc3BsaXQgYSBzdHJpbmcgaW50byB0b2tlbnMuIE92ZXJyaWRlIHRoaXMgcHJvcGVydHkgdG8gY2hhbmdlIHRoZSBiZWhhdmlvdXIgb2ZcbiAqIGBlbGFzdGljbHVuci50b2tlbml6ZXJgIGJlaGF2aW91ciB3aGVuIHRva2VuaXppbmcgc3RyaW5ncy4gQnkgZGVmYXVsdCB0aGlzIHNwbGl0cyBvbiB3aGl0ZXNwYWNlIGFuZCBoeXBoZW5zLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzZWUgZWxhc3RpY2x1bnIudG9rZW5pemVyXG4gKi9cbmVsYXN0aWNsdW5yLnRva2VuaXplci5zZXBlcmF0b3IgPSBlbGFzdGljbHVuci50b2tlbml6ZXIuZGVmYXVsdFNlcGVyYXRvcjtcblxuLyoqXG4gKiBTZXQgdXAgY3VzdG9taXplZCBzdHJpbmcgc2VwZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNlcCBUaGUgY3VzdG9taXplZCBzZXBlcmF0b3IgdGhhdCB5b3Ugd2FudCB0byB1c2UgdG8gdG9rZW5pemUgYSBzdHJpbmcuXG4gKi9cbmVsYXN0aWNsdW5yLnRva2VuaXplci5zZXRTZXBlcmF0b3IgPSBmdW5jdGlvbihzZXApIHtcbiAgICBpZiAoc2VwICE9PSBudWxsICYmIHNlcCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZihzZXApID09PSAnb2JqZWN0Jykge1xuICAgICAgICBlbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yID0gc2VwO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZXNldCBzdHJpbmcgc2VwZXJhdG9yXG4gKlxuICovXG5lbGFzdGljbHVuci50b2tlbml6ZXIucmVzZXRTZXBlcmF0b3IgPSBmdW5jdGlvbigpIHtcbiAgICBlbGFzdGljbHVuci50b2tlbml6ZXIuc2VwZXJhdG9yID0gZWxhc3RpY2x1bnIudG9rZW5pemVyLmRlZmF1bHRTZXBlcmF0b3I7XG59XG5cbi8qKlxuICogR2V0IHN0cmluZyBzZXBlcmF0b3JcbiAqXG4gKi9cbmVsYXN0aWNsdW5yLnRva2VuaXplci5nZXRTZXBlcmF0b3IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZWxhc3RpY2x1bnIudG9rZW5pemVyLnNlcGVyYXRvcjtcbn1cbi8qIVxuICogZWxhc3RpY2x1bnIuUGlwZWxpbmVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogZWxhc3RpY2x1bnIuUGlwZWxpbmVzIG1haW50YWluIGFuIG9yZGVyZWQgbGlzdCBvZiBmdW5jdGlvbnMgdG8gYmUgYXBwbGllZCB0byBcbiAqIGJvdGggZG9jdW1lbnRzIHRva2VucyBhbmQgcXVlcnkgdG9rZW5zLlxuICpcbiAqIEFuIGluc3RhbmNlIG9mIGVsYXN0aWNsdW5yLkluZGV4IHdpbGwgY29udGFpbiBhIHBpcGVsaW5lXG4gKiB3aXRoIGEgdHJpbW1lciwgYSBzdG9wIHdvcmQgZmlsdGVyLCBhbiBFbmdsaXNoIHN0ZW1tZXIuIEV4dHJhXG4gKiBmdW5jdGlvbnMgY2FuIGJlIGFkZGVkIGJlZm9yZSBvciBhZnRlciBlaXRoZXIgb2YgdGhlc2UgZnVuY3Rpb25zIG9yIHRoZXNlXG4gKiBkZWZhdWx0IGZ1bmN0aW9ucyBjYW4gYmUgcmVtb3ZlZC5cbiAqXG4gKiBXaGVuIHJ1biB0aGUgcGlwZWxpbmUsIGl0IHdpbGwgY2FsbCBlYWNoIGZ1bmN0aW9uIGluIHR1cm4uXG4gKlxuICogVGhlIG91dHB1dCBvZiB0aGUgZnVuY3Rpb25zIGluIHRoZSBwaXBlbGluZSB3aWxsIGJlIHBhc3NlZCB0byB0aGUgbmV4dCBmdW5jdGlvblxuICogaW4gdGhlIHBpcGVsaW5lLiBUbyBleGNsdWRlIGEgdG9rZW4gZnJvbSBlbnRlcmluZyB0aGUgaW5kZXggdGhlIGZ1bmN0aW9uXG4gKiBzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCwgdGhlIHJlc3Qgb2YgdGhlIHBpcGVsaW5lIHdpbGwgbm90IGJlIGNhbGxlZCB3aXRoXG4gKiB0aGlzIHRva2VuLlxuICpcbiAqIEZvciBzZXJpYWxpc2F0aW9uIG9mIHBpcGVsaW5lcyB0byB3b3JrLCBhbGwgZnVuY3Rpb25zIHVzZWQgaW4gYW4gaW5zdGFuY2Ugb2ZcbiAqIGEgcGlwZWxpbmUgc2hvdWxkIGJlIHJlZ2lzdGVyZWQgd2l0aCBlbGFzdGljbHVuci5QaXBlbGluZS4gUmVnaXN0ZXJlZCBmdW5jdGlvbnMgY2FuXG4gKiB0aGVuIGJlIGxvYWRlZC4gSWYgdHJ5aW5nIHRvIGxvYWQgYSBzZXJpYWxpc2VkIHBpcGVsaW5lIHRoYXQgdXNlcyBmdW5jdGlvbnNcbiAqIHRoYXQgYXJlIG5vdCByZWdpc3RlcmVkIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICpcbiAqIElmIG5vdCBwbGFubmluZyBvbiBzZXJpYWxpc2luZyB0aGUgcGlwZWxpbmUgdGhlbiByZWdpc3RlcmluZyBwaXBlbGluZSBmdW5jdGlvbnNcbiAqIGlzIG5vdCBuZWNlc3NhcnkuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9xdWV1ZSA9IFtdO1xufTtcblxuZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJlZEZ1bmN0aW9ucyA9IHt9O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgZnVuY3Rpb24gaW4gdGhlIHBpcGVsaW5lLlxuICpcbiAqIEZ1bmN0aW9ucyB0aGF0IGFyZSB1c2VkIGluIHRoZSBwaXBlbGluZSBzaG91bGQgYmUgcmVnaXN0ZXJlZCBpZiB0aGUgcGlwZWxpbmVcbiAqIG5lZWRzIHRvIGJlIHNlcmlhbGlzZWQsIG9yIGEgc2VyaWFsaXNlZCBwaXBlbGluZSBuZWVkcyB0byBiZSBsb2FkZWQuXG4gKlxuICogUmVnaXN0ZXJpbmcgYSBmdW5jdGlvbiBkb2VzIG5vdCBhZGQgaXQgdG8gYSBwaXBlbGluZSwgZnVuY3Rpb25zIG11c3Qgc3RpbGwgYmVcbiAqIGFkZGVkIHRvIGluc3RhbmNlcyBvZiB0aGUgcGlwZWxpbmUgZm9yIHRoZW0gdG8gYmUgdXNlZCB3aGVuIHJ1bm5pbmcgYSBwaXBlbGluZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gcmVnaXN0ZXIuXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgVGhlIGxhYmVsIHRvIHJlZ2lzdGVyIHRoaXMgZnVuY3Rpb24gd2l0aFxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyRnVuY3Rpb24gPSBmdW5jdGlvbiAoZm4sIGxhYmVsKSB7XG4gIGlmIChsYWJlbCBpbiBlbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlcmVkRnVuY3Rpb25zKSB7XG4gICAgZWxhc3RpY2x1bnIudXRpbHMud2FybignT3ZlcndyaXRpbmcgZXhpc3RpbmcgcmVnaXN0ZXJlZCBmdW5jdGlvbjogJyArIGxhYmVsKTtcbiAgfVxuXG4gIGZuLmxhYmVsID0gbGFiZWw7XG4gIGVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyZWRGdW5jdGlvbnNbbGFiZWxdID0gZm47XG59O1xuXG4vKipcbiAqIEdldCBhIHJlZ2lzdGVyZWQgZnVuY3Rpb24gaW4gdGhlIHBpcGVsaW5lLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBUaGUgbGFiZWwgb2YgcmVnaXN0ZXJlZCBmdW5jdGlvbi5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLmdldFJlZ2lzdGVyZWRGdW5jdGlvbiA9IGZ1bmN0aW9uIChsYWJlbCkge1xuICBpZiAoKGxhYmVsIGluIGVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyZWRGdW5jdGlvbnMpICE9PSB0cnVlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gZWxhc3RpY2x1bnIuUGlwZWxpbmUucmVnaXN0ZXJlZEZ1bmN0aW9uc1tsYWJlbF07XG59O1xuXG4vKipcbiAqIFdhcm5zIGlmIHRoZSBmdW5jdGlvbiBpcyBub3QgcmVnaXN0ZXJlZCBhcyBhIFBpcGVsaW5lIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjaGVjayBmb3IuXG4gKiBAcHJpdmF0ZVxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLndhcm5JZkZ1bmN0aW9uTm90UmVnaXN0ZXJlZCA9IGZ1bmN0aW9uIChmbikge1xuICB2YXIgaXNSZWdpc3RlcmVkID0gZm4ubGFiZWwgJiYgKGZuLmxhYmVsIGluIHRoaXMucmVnaXN0ZXJlZEZ1bmN0aW9ucyk7XG5cbiAgaWYgKCFpc1JlZ2lzdGVyZWQpIHtcbiAgICBlbGFzdGljbHVuci51dGlscy53YXJuKCdGdW5jdGlvbiBpcyBub3QgcmVnaXN0ZXJlZCB3aXRoIHBpcGVsaW5lLiBUaGlzIG1heSBjYXVzZSBwcm9ibGVtcyB3aGVuIHNlcmlhbGlzaW5nIHRoZSBpbmRleC5cXG4nLCBmbik7XG4gIH1cbn07XG5cbi8qKlxuICogTG9hZHMgYSBwcmV2aW91c2x5IHNlcmlhbGlzZWQgcGlwZWxpbmUuXG4gKlxuICogQWxsIGZ1bmN0aW9ucyB0byBiZSBsb2FkZWQgbXVzdCBhbHJlYWR5IGJlIHJlZ2lzdGVyZWQgd2l0aCBlbGFzdGljbHVuci5QaXBlbGluZS5cbiAqIElmIGFueSBmdW5jdGlvbiBmcm9tIHRoZSBzZXJpYWxpc2VkIGRhdGEgaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQgdGhlbiBhblxuICogZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNlcmlhbGlzZWQgVGhlIHNlcmlhbGlzZWQgcGlwZWxpbmUgdG8gbG9hZC5cbiAqIEByZXR1cm4ge2VsYXN0aWNsdW5yLlBpcGVsaW5lfVxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLmxvYWQgPSBmdW5jdGlvbiAoc2VyaWFsaXNlZCkge1xuICB2YXIgcGlwZWxpbmUgPSBuZXcgZWxhc3RpY2x1bnIuUGlwZWxpbmU7XG5cbiAgc2VyaWFsaXNlZC5mb3JFYWNoKGZ1bmN0aW9uIChmbk5hbWUpIHtcbiAgICB2YXIgZm4gPSBlbGFzdGljbHVuci5QaXBlbGluZS5nZXRSZWdpc3RlcmVkRnVuY3Rpb24oZm5OYW1lKTtcblxuICAgIGlmIChmbikge1xuICAgICAgcGlwZWxpbmUuYWRkKGZuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbG9hZCB1bi1yZWdpc3RlcmVkIGZ1bmN0aW9uOiAnICsgZm5OYW1lKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwaXBlbGluZTtcbn07XG5cbi8qKlxuICogQWRkcyBuZXcgZnVuY3Rpb25zIHRvIHRoZSBlbmQgb2YgdGhlIHBpcGVsaW5lLlxuICpcbiAqIExvZ3MgYSB3YXJuaW5nIGlmIHRoZSBmdW5jdGlvbiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbnMgQW55IG51bWJlciBvZiBmdW5jdGlvbnMgdG8gYWRkIHRvIHRoZSBwaXBlbGluZS5cbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZm5zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBmbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICBlbGFzdGljbHVuci5QaXBlbGluZS53YXJuSWZGdW5jdGlvbk5vdFJlZ2lzdGVyZWQoZm4pO1xuICAgIHRoaXMuX3F1ZXVlLnB1c2goZm4pO1xuICB9LCB0aGlzKTtcbn07XG5cbi8qKlxuICogQWRkcyBhIHNpbmdsZSBmdW5jdGlvbiBhZnRlciBhIGZ1bmN0aW9uIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlXG4gKiBwaXBlbGluZS5cbiAqXG4gKiBMb2dzIGEgd2FybmluZyBpZiB0aGUgZnVuY3Rpb24gaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQuXG4gKiBJZiBleGlzdGluZ0ZuIGlzIG5vdCBmb3VuZCwgdGhyb3cgYW4gRXhjZXB0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4aXN0aW5nRm4gQSBmdW5jdGlvbiB0aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBwaXBlbGluZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG5ld0ZuIFRoZSBuZXcgZnVuY3Rpb24gdG8gYWRkIHRvIHRoZSBwaXBlbGluZS5cbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5wcm90b3R5cGUuYWZ0ZXIgPSBmdW5jdGlvbiAoZXhpc3RpbmdGbiwgbmV3Rm4pIHtcbiAgZWxhc3RpY2x1bnIuUGlwZWxpbmUud2FybklmRnVuY3Rpb25Ob3RSZWdpc3RlcmVkKG5ld0ZuKTtcblxuICB2YXIgcG9zID0gdGhpcy5fcXVldWUuaW5kZXhPZihleGlzdGluZ0ZuKTtcbiAgaWYgKHBvcyA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIGV4aXN0aW5nRm4nKTtcbiAgfVxuXG4gIHRoaXMuX3F1ZXVlLnNwbGljZShwb3MgKyAxLCAwLCBuZXdGbik7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBzaW5nbGUgZnVuY3Rpb24gYmVmb3JlIGEgZnVuY3Rpb24gdGhhdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGVcbiAqIHBpcGVsaW5lLlxuICpcbiAqIExvZ3MgYSB3YXJuaW5nIGlmIHRoZSBmdW5jdGlvbiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZC5cbiAqIElmIGV4aXN0aW5nRm4gaXMgbm90IGZvdW5kLCB0aHJvdyBhbiBFeGNlcHRpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhpc3RpbmdGbiBBIGZ1bmN0aW9uIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHBpcGVsaW5lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3Rm4gVGhlIG5ldyBmdW5jdGlvbiB0byBhZGQgdG8gdGhlIHBpcGVsaW5lLlxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnByb3RvdHlwZS5iZWZvcmUgPSBmdW5jdGlvbiAoZXhpc3RpbmdGbiwgbmV3Rm4pIHtcbiAgZWxhc3RpY2x1bnIuUGlwZWxpbmUud2FybklmRnVuY3Rpb25Ob3RSZWdpc3RlcmVkKG5ld0ZuKTtcblxuICB2YXIgcG9zID0gdGhpcy5fcXVldWUuaW5kZXhPZihleGlzdGluZ0ZuKTtcbiAgaWYgKHBvcyA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIGV4aXN0aW5nRm4nKTtcbiAgfVxuXG4gIHRoaXMuX3F1ZXVlLnNwbGljZShwb3MsIDAsIG5ld0ZuKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIGZ1bmN0aW9uIGZyb20gdGhlIHBpcGVsaW5lLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byByZW1vdmUgZnJvbSB0aGUgcGlwZWxpbmUuXG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmbikge1xuICB2YXIgcG9zID0gdGhpcy5fcXVldWUuaW5kZXhPZihmbik7XG4gIGlmIChwb3MgPT09IC0xKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fcXVldWUuc3BsaWNlKHBvcywgMSk7XG59O1xuXG4vKipcbiAqIFJ1bnMgdGhlIGN1cnJlbnQgbGlzdCBvZiBmdW5jdGlvbnMgdGhhdCByZWdpc3RlcmVkIGluIHRoZSBwaXBlbGluZSBhZ2FpbnN0IHRoZVxuICogaW5wdXQgdG9rZW5zLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHRva2VucyBUaGUgdG9rZW5zIHRvIHJ1biB0aHJvdWdoIHRoZSBwaXBlbGluZS5cbiAqIEByZXR1cm4ge0FycmF5fVxuICogQG1lbWJlck9mIFBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAodG9rZW5zKSB7XG4gIHZhciBvdXQgPSBbXSxcbiAgICAgIHRva2VuTGVuZ3RoID0gdG9rZW5zLmxlbmd0aCxcbiAgICAgIHBpcGVsaW5lTGVuZ3RoID0gdGhpcy5fcXVldWUubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5MZW5ndGg7IGkrKykge1xuICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGlwZWxpbmVMZW5ndGg7IGorKykge1xuICAgICAgdG9rZW4gPSB0aGlzLl9xdWV1ZVtqXSh0b2tlbiwgaSwgdG9rZW5zKTtcbiAgICAgIGlmICh0b2tlbiA9PT0gdm9pZCAwIHx8IHRva2VuID09PSBudWxsKSBicmVhaztcbiAgICB9O1xuXG4gICAgaWYgKHRva2VuICE9PSB2b2lkIDAgJiYgdG9rZW4gIT09IG51bGwpIG91dC5wdXNoKHRva2VuKTtcbiAgfTtcblxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXNldHMgdGhlIHBpcGVsaW5lIGJ5IHJlbW92aW5nIGFueSBleGlzdGluZyBwcm9jZXNzb3JzLlxuICpcbiAqIEBtZW1iZXJPZiBQaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5QaXBlbGluZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX3F1ZXVlID0gW107XG59O1xuXG4gLyoqXG4gICogR2V0IHRoZSBwaXBlbGluZSBpZiB1c2VyIHdhbnQgdG8gY2hlY2sgdGhlIHBpcGVsaW5lLlxuICAqXG4gICogQG1lbWJlck9mIFBpcGVsaW5lXG4gICovXG4gZWxhc3RpY2x1bnIuUGlwZWxpbmUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgIHJldHVybiB0aGlzLl9xdWV1ZTtcbiB9O1xuXG4vKipcbiAqIFJldHVybnMgYSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcGlwZWxpbmUgcmVhZHkgZm9yIHNlcmlhbGlzYXRpb24uXG4gKiBPbmx5IHNlcmlhbGl6ZSBwaXBlbGluZSBmdW5jdGlvbidzIG5hbWUuIE5vdCBzdG9yaW5nIGZ1bmN0aW9uLCBzbyB3aGVuXG4gKiBsb2FkaW5nIHRoZSBhcmNoaXZlZCBKU09OIGluZGV4IGZpbGUsIGNvcnJlc3BvbmRpbmcgcGlwZWxpbmUgZnVuY3Rpb24gaXMgXG4gKiBhZGRlZCBieSByZWdpc3RlcmVkIGZ1bmN0aW9uIG9mIGVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyZWRGdW5jdGlvbnNcbiAqXG4gKiBMb2dzIGEgd2FybmluZyBpZiB0aGUgZnVuY3Rpb24gaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQuXG4gKlxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAbWVtYmVyT2YgUGlwZWxpbmVcbiAqL1xuZWxhc3RpY2x1bnIuUGlwZWxpbmUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3F1ZXVlLm1hcChmdW5jdGlvbiAoZm4pIHtcbiAgICBlbGFzdGljbHVuci5QaXBlbGluZS53YXJuSWZGdW5jdGlvbk5vdFJlZ2lzdGVyZWQoZm4pO1xuICAgIHJldHVybiBmbi5sYWJlbDtcbiAgfSk7XG59O1xuLyohXG4gKiBlbGFzdGljbHVuci5JbmRleFxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKi9cblxuLyoqXG4gKiBlbGFzdGljbHVuci5JbmRleCBpcyBvYmplY3QgdGhhdCBtYW5hZ2VzIGEgc2VhcmNoIGluZGV4LiAgSXQgY29udGFpbnMgdGhlIGluZGV4ZXNcbiAqIGFuZCBzdG9yZXMgYWxsIHRoZSB0b2tlbnMgYW5kIGRvY3VtZW50IGxvb2t1cHMuICBJdCBhbHNvIHByb3ZpZGVzIHRoZSBtYWluXG4gKiB1c2VyIGZhY2luZyBBUEkgZm9yIHRoZSBsaWJyYXJ5LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5lbGFzdGljbHVuci5JbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fZmllbGRzID0gW107XG4gIHRoaXMuX3JlZiA9ICdpZCc7XG4gIHRoaXMucGlwZWxpbmUgPSBuZXcgZWxhc3RpY2x1bnIuUGlwZWxpbmU7XG4gIHRoaXMuZG9jdW1lbnRTdG9yZSA9IG5ldyBlbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlO1xuICB0aGlzLmluZGV4ID0ge307XG4gIHRoaXMuZXZlbnRFbWl0dGVyID0gbmV3IGVsYXN0aWNsdW5yLkV2ZW50RW1pdHRlcjtcbiAgdGhpcy5faWRmQ2FjaGUgPSB7fTtcblxuICB0aGlzLm9uKCdhZGQnLCAncmVtb3ZlJywgJ3VwZGF0ZScsIChmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5faWRmQ2FjaGUgPSB7fTtcbiAgfSkuYmluZCh0aGlzKSk7XG59O1xuXG4vKipcbiAqIEJpbmQgYSBoYW5kbGVyIHRvIGV2ZW50cyBiZWluZyBlbWl0dGVkIGJ5IHRoZSBpbmRleC5cbiAqXG4gKiBUaGUgaGFuZGxlciBjYW4gYmUgYm91bmQgdG8gbWFueSBldmVudHMgYXQgdGhlIHNhbWUgdGltZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gW2V2ZW50TmFtZV0gVGhlIG5hbWUocykgb2YgZXZlbnRzIHRvIGJpbmQgdGhlIGZ1bmN0aW9uIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHNlcmlhbGlzZWQgc2V0IHRvIGxvYWQuXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlci5hZGRMaXN0ZW5lci5hcHBseSh0aGlzLmV2ZW50RW1pdHRlciwgYXJncyk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYSBoYW5kbGVyIGZyb20gYW4gZXZlbnQgYmVpbmcgZW1pdHRlZCBieSB0aGUgaW5kZXguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiBldmVudHMgdG8gcmVtb3ZlIHRoZSBmdW5jdGlvbiBmcm9tLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHNlcmlhbGlzZWQgc2V0IHRvIGxvYWQuXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChuYW1lLCBmbikge1xuICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobmFtZSwgZm4pO1xufTtcblxuLyoqXG4gKiBMb2FkcyBhIHByZXZpb3VzbHkgc2VyaWFsaXNlZCBpbmRleC5cbiAqXG4gKiBJc3N1ZXMgYSB3YXJuaW5nIGlmIHRoZSBpbmRleCBiZWluZyBpbXBvcnRlZCB3YXMgc2VyaWFsaXNlZFxuICogYnkgYSBkaWZmZXJlbnQgdmVyc2lvbiBvZiBlbGFzdGljbHVuci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2VyaWFsaXNlZERhdGEgVGhlIHNlcmlhbGlzZWQgc2V0IHRvIGxvYWQuXG4gKiBAcmV0dXJuIHtlbGFzdGljbHVuci5JbmRleH1cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5sb2FkID0gZnVuY3Rpb24gKHNlcmlhbGlzZWREYXRhKSB7XG4gIGlmIChzZXJpYWxpc2VkRGF0YS52ZXJzaW9uICE9PSBlbGFzdGljbHVuci52ZXJzaW9uKSB7XG4gICAgZWxhc3RpY2x1bnIudXRpbHMud2FybigndmVyc2lvbiBtaXNtYXRjaDogY3VycmVudCAnXG4gICAgICAgICAgICAgICAgICAgICsgZWxhc3RpY2x1bnIudmVyc2lvbiArICcgaW1wb3J0aW5nICcgKyBzZXJpYWxpc2VkRGF0YS52ZXJzaW9uKTtcbiAgfVxuXG4gIHZhciBpZHggPSBuZXcgdGhpcztcblxuICBpZHguX2ZpZWxkcyA9IHNlcmlhbGlzZWREYXRhLmZpZWxkcztcbiAgaWR4Ll9yZWYgPSBzZXJpYWxpc2VkRGF0YS5yZWY7XG4gIGlkeC5kb2N1bWVudFN0b3JlID0gZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5sb2FkKHNlcmlhbGlzZWREYXRhLmRvY3VtZW50U3RvcmUpO1xuICBpZHgucGlwZWxpbmUgPSBlbGFzdGljbHVuci5QaXBlbGluZS5sb2FkKHNlcmlhbGlzZWREYXRhLnBpcGVsaW5lKTtcbiAgaWR4LmluZGV4ID0ge307XG4gIGZvciAodmFyIGZpZWxkIGluIHNlcmlhbGlzZWREYXRhLmluZGV4KSB7XG4gICAgaWR4LmluZGV4W2ZpZWxkXSA9IGVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgubG9hZChzZXJpYWxpc2VkRGF0YS5pbmRleFtmaWVsZF0pO1xuICB9XG5cbiAgcmV0dXJuIGlkeDtcbn07XG5cbi8qKlxuICogQWRkcyBhIGZpZWxkIHRvIHRoZSBsaXN0IG9mIGZpZWxkcyB0aGF0IHdpbGwgYmUgc2VhcmNoYWJsZSB3aXRoaW4gZG9jdW1lbnRzIGluIHRoZSBpbmRleC5cbiAqXG4gKiBSZW1lbWJlciB0aGF0IGlubmVyIGluZGV4IGlzIGJ1aWxkIGJhc2VkIG9uIGZpZWxkLCB3aGljaCBtZWFucyBlYWNoIGZpZWxkIGhhcyBvbmUgaW52ZXJ0ZWQgaW5kZXguXG4gKlxuICogRmllbGRzIHNob3VsZCBiZSBhZGRlZCBiZWZvcmUgYW55IGRvY3VtZW50cyBhcmUgYWRkZWQgdG8gdGhlIGluZGV4LCBmaWVsZHNcbiAqIHRoYXQgYXJlIGFkZGVkIGFmdGVyIGRvY3VtZW50cyBhcmUgYWRkZWQgdG8gdGhlIGluZGV4IHdpbGwgb25seSBhcHBseSB0byBuZXdcbiAqIGRvY3VtZW50cyBhZGRlZCB0byB0aGUgaW5kZXguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkTmFtZSBUaGUgbmFtZSBvZiB0aGUgZmllbGQgd2l0aGluIHRoZSBkb2N1bWVudCB0aGF0IHNob3VsZCBiZSBpbmRleGVkXG4gKiBAcmV0dXJuIHtlbGFzdGljbHVuci5JbmRleH1cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuYWRkRmllbGQgPSBmdW5jdGlvbiAoZmllbGROYW1lKSB7XG4gIHRoaXMuX2ZpZWxkcy5wdXNoKGZpZWxkTmFtZSk7XG4gIHRoaXMuaW5kZXhbZmllbGROYW1lXSA9IG5ldyBlbGFzdGljbHVuci5JbnZlcnRlZEluZGV4O1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJvcGVydHkgdXNlZCB0byB1bmlxdWVseSBpZGVudGlmeSBkb2N1bWVudHMgYWRkZWQgdG8gdGhlIGluZGV4LFxuICogYnkgZGVmYXVsdCB0aGlzIHByb3BlcnR5IGlzICdpZCcuXG4gKlxuICogVGhpcyBzaG91bGQgb25seSBiZSBjaGFuZ2VkIGJlZm9yZSBhZGRpbmcgZG9jdW1lbnRzIHRvIHRoZSBpbmRleCwgY2hhbmdpbmdcbiAqIHRoZSByZWYgcHJvcGVydHkgd2l0aG91dCByZXNldHRpbmcgdGhlIGluZGV4IGNhbiBsZWFkIHRvIHVuZXhwZWN0ZWQgcmVzdWx0cy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmTmFtZSBUaGUgcHJvcGVydHkgdG8gdXNlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoZVxuICogZG9jdW1lbnRzIGluIHRoZSBpbmRleC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZW1pdEV2ZW50IFdoZXRoZXIgdG8gZW1pdCBhZGQgZXZlbnRzLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAcmV0dXJuIHtlbGFzdGljbHVuci5JbmRleH1cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuc2V0UmVmID0gZnVuY3Rpb24gKHJlZk5hbWUpIHtcbiAgdGhpcy5fcmVmID0gcmVmTmFtZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqXG4gKiBTZXQgaWYgdGhlIEpTT04gZm9ybWF0IG9yaWdpbmFsIGRvY3VtZW50cyBhcmUgc2F2ZSBpbnRvIGVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmVcbiAqXG4gKiBEZWZhdWx0bHkgc2F2ZSBhbGwgdGhlIG9yaWdpbmFsIEpTT04gZG9jdW1lbnRzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2F2ZSBXaGV0aGVyIHRvIHNhdmUgdGhlIG9yaWdpbmFsIEpTT04gZG9jdW1lbnRzLlxuICogQHJldHVybiB7ZWxhc3RpY2x1bnIuSW5kZXh9XG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLnNhdmVEb2N1bWVudCA9IGZ1bmN0aW9uIChzYXZlKSB7XG4gIHRoaXMuZG9jdW1lbnRTdG9yZSA9IG5ldyBlbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlKHNhdmUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkIGEgSlNPTiBmb3JtYXQgZG9jdW1lbnQgdG8gdGhlIGluZGV4LlxuICpcbiAqIFRoaXMgaXMgdGhlIHdheSBuZXcgZG9jdW1lbnRzIGVudGVyIHRoZSBpbmRleCwgdGhpcyBmdW5jdGlvbiB3aWxsIHJ1biB0aGVcbiAqIGZpZWxkcyBmcm9tIHRoZSBkb2N1bWVudCB0aHJvdWdoIHRoZSBpbmRleCdzIHBpcGVsaW5lIGFuZCB0aGVuIGFkZCBpdCB0b1xuICogdGhlIGluZGV4LCBpdCB3aWxsIHRoZW4gc2hvdyB1cCBpbiBzZWFyY2ggcmVzdWx0cy5cbiAqXG4gKiBBbiAnYWRkJyBldmVudCBpcyBlbWl0dGVkIHdpdGggdGhlIGRvY3VtZW50IHRoYXQgaGFzIGJlZW4gYWRkZWQgYW5kIHRoZSBpbmRleFxuICogdGhlIGRvY3VtZW50IGhhcyBiZWVuIGFkZGVkIHRvLiBUaGlzIGV2ZW50IGNhbiBiZSBzaWxlbmNlZCBieSBwYXNzaW5nIGZhbHNlXG4gKiBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIGFkZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jIFRoZSBKU09OIGZvcm1hdCBkb2N1bWVudCB0byBhZGQgdG8gdGhlIGluZGV4LlxuICogQHBhcmFtIHtCb29sZWFufSBlbWl0RXZlbnQgV2hldGhlciBvciBub3QgdG8gZW1pdCBldmVudHMsIGRlZmF1bHQgdHJ1ZS5cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuYWRkRG9jID0gZnVuY3Rpb24gKGRvYywgZW1pdEV2ZW50KSB7XG4gIGlmICghZG9jKSByZXR1cm47XG4gIHZhciBlbWl0RXZlbnQgPSBlbWl0RXZlbnQgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBlbWl0RXZlbnQ7XG5cbiAgdmFyIGRvY1JlZiA9IGRvY1t0aGlzLl9yZWZdO1xuXG4gIHRoaXMuZG9jdW1lbnRTdG9yZS5hZGREb2MoZG9jUmVmLCBkb2MpO1xuICB0aGlzLl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICB2YXIgZmllbGRUb2tlbnMgPSB0aGlzLnBpcGVsaW5lLnJ1bihlbGFzdGljbHVuci50b2tlbml6ZXIoZG9jW2ZpZWxkXSkpO1xuICAgIHRoaXMuZG9jdW1lbnRTdG9yZS5hZGRGaWVsZExlbmd0aChkb2NSZWYsIGZpZWxkLCBmaWVsZFRva2Vucy5sZW5ndGgpO1xuXG4gICAgdmFyIHRva2VuQ291bnQgPSB7fTtcbiAgICBmaWVsZFRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgaWYgKHRva2VuIGluIHRva2VuQ291bnQpIHRva2VuQ291bnRbdG9rZW5dICs9IDE7XG4gICAgICBlbHNlIHRva2VuQ291bnRbdG9rZW5dID0gMTtcbiAgICB9LCB0aGlzKTtcblxuICAgIGZvciAodmFyIHRva2VuIGluIHRva2VuQ291bnQpIHtcbiAgICAgIHZhciB0ZXJtRnJlcXVlbmN5ID0gdG9rZW5Db3VudFt0b2tlbl07XG4gICAgICB0ZXJtRnJlcXVlbmN5ID0gTWF0aC5zcXJ0KHRlcm1GcmVxdWVuY3kpO1xuICAgICAgdGhpcy5pbmRleFtmaWVsZF0uYWRkVG9rZW4odG9rZW4sIHsgcmVmOiBkb2NSZWYsIHRmOiB0ZXJtRnJlcXVlbmN5IH0pO1xuICAgIH1cbiAgfSwgdGhpcyk7XG5cbiAgaWYgKGVtaXRFdmVudCkgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCgnYWRkJywgZG9jLCB0aGlzKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIGRvY3VtZW50IGZyb20gdGhlIGluZGV4IGJ5IGRvYyByZWYuXG4gKlxuICogVG8gbWFrZSBzdXJlIGRvY3VtZW50cyBubyBsb25nZXIgc2hvdyB1cCBpbiBzZWFyY2ggcmVzdWx0cyB0aGV5IGNhbiBiZVxuICogcmVtb3ZlZCBmcm9tIHRoZSBpbmRleCB1c2luZyB0aGlzIG1ldGhvZC5cbiAqXG4gKiBBICdyZW1vdmUnIGV2ZW50IGlzIGVtaXR0ZWQgd2l0aCB0aGUgZG9jdW1lbnQgdGhhdCBoYXMgYmVlbiByZW1vdmVkIGFuZCB0aGUgaW5kZXhcbiAqIHRoZSBkb2N1bWVudCBoYXMgYmVlbiByZW1vdmVkIGZyb20uIFRoaXMgZXZlbnQgY2FuIGJlIHNpbGVuY2VkIGJ5IHBhc3NpbmcgZmFsc2VcbiAqIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gcmVtb3ZlLlxuICpcbiAqIElmIHVzZXIgc2V0dGluZyBEb2N1bWVudFN0b3JlIG5vdCBzdG9yaW5nIHRoZSBkb2N1bWVudHMsIHRoZW4gcmVtb3ZlIGRvYyBieSBkb2NSZWYgaXMgbm90IGFsbG93ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8SW50ZWdlcn0gZG9jUmVmIFRoZSBkb2N1bWVudCByZWYgdG8gcmVtb3ZlIGZyb20gdGhlIGluZGV4LlxuICogQHBhcmFtIHtCb29sZWFufSBlbWl0RXZlbnQgV2hldGhlciB0byBlbWl0IHJlbW92ZSBldmVudHMsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUucmVtb3ZlRG9jQnlSZWYgPSBmdW5jdGlvbiAoZG9jUmVmLCBlbWl0RXZlbnQpIHtcbiAgaWYgKCFkb2NSZWYpIHJldHVybjtcbiAgaWYgKHRoaXMuZG9jdW1lbnRTdG9yZS5pc0RvY1N0b3JlZCgpID09PSBmYWxzZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghdGhpcy5kb2N1bWVudFN0b3JlLmhhc0RvYyhkb2NSZWYpKSByZXR1cm47XG4gIHZhciBkb2MgPSB0aGlzLmRvY3VtZW50U3RvcmUuZ2V0RG9jKGRvY1JlZik7XG4gIHRoaXMucmVtb3ZlRG9jKGRvYywgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgZG9jdW1lbnQgZnJvbSB0aGUgaW5kZXguXG4gKiBUaGlzIHJlbW92ZSBvcGVyYXRpb24gY291bGQgd29yayBldmVuIHRoZSBvcmlnaW5hbCBkb2MgaXMgbm90IHN0b3JlIGluIHRoZSBEb2N1bWVudFN0b3JlLlxuICpcbiAqIFRvIG1ha2Ugc3VyZSBkb2N1bWVudHMgbm8gbG9uZ2VyIHNob3cgdXAgaW4gc2VhcmNoIHJlc3VsdHMgdGhleSBjYW4gYmVcbiAqIHJlbW92ZWQgZnJvbSB0aGUgaW5kZXggdXNpbmcgdGhpcyBtZXRob2QuXG4gKlxuICogQSAncmVtb3ZlJyBldmVudCBpcyBlbWl0dGVkIHdpdGggdGhlIGRvY3VtZW50IHRoYXQgaGFzIGJlZW4gcmVtb3ZlZCBhbmQgdGhlIGluZGV4XG4gKiB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tLiBUaGlzIGV2ZW50IGNhbiBiZSBzaWxlbmNlZCBieSBwYXNzaW5nIGZhbHNlXG4gKiBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIHJlbW92ZS5cbiAqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRvYyBUaGUgZG9jdW1lbnQgcmVmIHRvIHJlbW92ZSBmcm9tIHRoZSBpbmRleC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZW1pdEV2ZW50IFdoZXRoZXIgdG8gZW1pdCByZW1vdmUgZXZlbnRzLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLnJlbW92ZURvYyA9IGZ1bmN0aW9uIChkb2MsIGVtaXRFdmVudCkge1xuICBpZiAoIWRvYykgcmV0dXJuO1xuXG4gIHZhciBlbWl0RXZlbnQgPSBlbWl0RXZlbnQgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBlbWl0RXZlbnQ7XG5cbiAgdmFyIGRvY1JlZiA9IGRvY1t0aGlzLl9yZWZdO1xuICBpZiAoIXRoaXMuZG9jdW1lbnRTdG9yZS5oYXNEb2MoZG9jUmVmKSkgcmV0dXJuO1xuXG4gIHRoaXMuZG9jdW1lbnRTdG9yZS5yZW1vdmVEb2MoZG9jUmVmKTtcblxuICB0aGlzLl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICB2YXIgZmllbGRUb2tlbnMgPSB0aGlzLnBpcGVsaW5lLnJ1bihlbGFzdGljbHVuci50b2tlbml6ZXIoZG9jW2ZpZWxkXSkpO1xuICAgIGZpZWxkVG9rZW5zLmZvckVhY2goZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICB0aGlzLmluZGV4W2ZpZWxkXS5yZW1vdmVUb2tlbih0b2tlbiwgZG9jUmVmKTtcbiAgICB9LCB0aGlzKTtcbiAgfSwgdGhpcyk7XG5cbiAgaWYgKGVtaXRFdmVudCkgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCgncmVtb3ZlJywgZG9jLCB0aGlzKTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyBhIGRvY3VtZW50IGluIHRoZSBpbmRleC5cbiAqXG4gKiBXaGVuIGEgZG9jdW1lbnQgY29udGFpbmVkIHdpdGhpbiB0aGUgaW5kZXggZ2V0cyB1cGRhdGVkLCBmaWVsZHMgY2hhbmdlZCxcbiAqIGFkZGVkIG9yIHJlbW92ZWQsIHRvIG1ha2Ugc3VyZSBpdCBjb3JyZWN0bHkgbWF0Y2hlZCBhZ2FpbnN0IHNlYXJjaCBxdWVyaWVzLFxuICogaXQgc2hvdWxkIGJlIHVwZGF0ZWQgaW4gdGhlIGluZGV4LlxuICpcbiAqIFRoaXMgbWV0aG9kIGlzIGp1c3QgYSB3cmFwcGVyIGFyb3VuZCBgcmVtb3ZlYCBhbmQgYGFkZGBcbiAqXG4gKiBBbiAndXBkYXRlJyBldmVudCBpcyBlbWl0dGVkIHdpdGggdGhlIGRvY3VtZW50IHRoYXQgaGFzIGJlZW4gdXBkYXRlZCBhbmQgdGhlIGluZGV4LlxuICogVGhpcyBldmVudCBjYW4gYmUgc2lsZW5jZWQgYnkgcGFzc2luZyBmYWxzZSBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIHVwZGF0ZS4gT25seVxuICogYW4gdXBkYXRlIGV2ZW50IHdpbGwgYmUgZmlyZWQsIHRoZSAnYWRkJyBhbmQgJ3JlbW92ZScgZXZlbnRzIG9mIHRoZSB1bmRlcmx5aW5nIGNhbGxzXG4gKiBhcmUgc2lsZW5jZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRvYyBUaGUgZG9jdW1lbnQgdG8gdXBkYXRlIGluIHRoZSBpbmRleC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZW1pdEV2ZW50IFdoZXRoZXIgdG8gZW1pdCB1cGRhdGUgZXZlbnRzLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAc2VlIEluZGV4LnByb3RvdHlwZS5yZW1vdmVcbiAqIEBzZWUgSW5kZXgucHJvdG90eXBlLmFkZFxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS51cGRhdGVEb2MgPSBmdW5jdGlvbiAoZG9jLCBlbWl0RXZlbnQpIHtcbiAgdmFyIGVtaXRFdmVudCA9IGVtaXRFdmVudCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGVtaXRFdmVudDtcblxuICB0aGlzLnJlbW92ZURvY0J5UmVmKGRvY1t0aGlzLl9yZWZdLCBmYWxzZSk7XG4gIHRoaXMuYWRkRG9jKGRvYywgZmFsc2UpO1xuXG4gIGlmIChlbWl0RXZlbnQpIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoJ3VwZGF0ZScsIGRvYywgdGhpcyk7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGludmVyc2UgZG9jdW1lbnQgZnJlcXVlbmN5IGZvciBhIHRva2VuIHdpdGhpbiB0aGUgaW5kZXggb2YgYSBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIGNhbGN1bGF0ZSB0aGUgaWRmIG9mLlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkIFRoZSBmaWVsZCB0byBjb21wdXRlIGlkZi5cbiAqIEBzZWUgSW5kZXgucHJvdG90eXBlLmlkZlxuICogQHByaXZhdGVcbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUuaWRmID0gZnVuY3Rpb24gKHRlcm0sIGZpZWxkKSB7XG4gIHZhciBjYWNoZUtleSA9IFwiQFwiICsgZmllbGQgKyAnLycgKyB0ZXJtO1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX2lkZkNhY2hlLCBjYWNoZUtleSkpIHJldHVybiB0aGlzLl9pZGZDYWNoZVtjYWNoZUtleV07XG5cbiAgdmFyIGRmID0gdGhpcy5pbmRleFtmaWVsZF0uZ2V0RG9jRnJlcSh0ZXJtKTtcbiAgdmFyIGlkZiA9IDEgKyBNYXRoLmxvZyh0aGlzLmRvY3VtZW50U3RvcmUubGVuZ3RoIC8gKGRmICsgMSkpO1xuICB0aGlzLl9pZGZDYWNoZVtjYWNoZUtleV0gPSBpZGY7XG5cbiAgcmV0dXJuIGlkZjtcbn07XG5cbi8qKlxuICogZ2V0IGZpZWxkcyBvZiBjdXJyZW50IGluZGV4IGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5nZXRGaWVsZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9maWVsZHMuc2xpY2UoKTtcbn07XG5cbi8qKlxuICogU2VhcmNoZXMgdGhlIGluZGV4IHVzaW5nIHRoZSBwYXNzZWQgcXVlcnkuXG4gKiBRdWVyaWVzIHNob3VsZCBiZSBhIHN0cmluZywgbXVsdGlwbGUgd29yZHMgYXJlIGFsbG93ZWQuXG4gKlxuICogSWYgY29uZmlnIGlzIG51bGwsIHdpbGwgc2VhcmNoIGFsbCBmaWVsZHMgZGVmYXVsdGx5LCBhbmQgbGVhZCB0byBPUiBiYXNlZCBxdWVyeS5cbiAqIElmIGNvbmZpZyBpcyBzcGVjaWZpZWQsIHdpbGwgc2VhcmNoIHNwZWNpZmllZCB3aXRoIHF1ZXJ5IHRpbWUgYm9vc3RpbmcuXG4gKlxuICogQWxsIHF1ZXJ5IHRva2VucyBhcmUgcGFzc2VkIHRocm91Z2ggdGhlIHNhbWUgcGlwZWxpbmUgdGhhdCBkb2N1bWVudCB0b2tlbnNcbiAqIGFyZSBwYXNzZWQgdGhyb3VnaCwgc28gYW55IGxhbmd1YWdlIHByb2Nlc3NpbmcgaW52b2x2ZWQgd2lsbCBiZSBydW4gb24gZXZlcnlcbiAqIHF1ZXJ5IHRlcm0uXG4gKlxuICogRWFjaCBxdWVyeSB0ZXJtIGlzIGV4cGFuZGVkLCBzbyB0aGF0IHRoZSB0ZXJtICdoZScgbWlnaHQgYmUgZXhwYW5kZWQgdG9cbiAqICdoZWxsbycgYW5kICdoZWxwJyBpZiB0aG9zZSB0ZXJtcyB3ZXJlIGFscmVhZHkgaW5jbHVkZWQgaW4gdGhlIGluZGV4LlxuICpcbiAqIE1hdGNoaW5nIGRvY3VtZW50cyBhcmUgcmV0dXJuZWQgYXMgYW4gYXJyYXkgb2Ygb2JqZWN0cywgZWFjaCBvYmplY3QgY29udGFpbnNcbiAqIHRoZSBtYXRjaGluZyBkb2N1bWVudCByZWYsIGFzIHNldCBmb3IgdGhpcyBpbmRleCwgYW5kIHRoZSBzaW1pbGFyaXR5IHNjb3JlXG4gKiBmb3IgdGhpcyBkb2N1bWVudCBhZ2FpbnN0IHRoZSBxdWVyeS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVGhlIHF1ZXJ5IHRvIHNlYXJjaCB0aGUgaW5kZXggd2l0aC5cbiAqIEBwYXJhbSB7SlNPTn0gdXNlckNvbmZpZyBUaGUgdXNlciBxdWVyeSBjb25maWcsIEpTT04gZm9ybWF0LlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQHNlZSBJbmRleC5wcm90b3R5cGUuaWRmXG4gKiBAc2VlIEluZGV4LnByb3RvdHlwZS5kb2N1bWVudFZlY3RvclxuICogQG1lbWJlck9mIEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkluZGV4LnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbiAocXVlcnksIHVzZXJDb25maWcpIHtcbiAgaWYgKCFxdWVyeSkgcmV0dXJuIFtdO1xuXG4gIHZhciBjb25maWdTdHIgPSBudWxsO1xuICBpZiAodXNlckNvbmZpZyAhPSBudWxsKSB7XG4gICAgY29uZmlnU3RyID0gSlNPTi5zdHJpbmdpZnkodXNlckNvbmZpZyk7XG4gIH1cblxuICB2YXIgY29uZmlnID0gbmV3IGVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24oY29uZmlnU3RyLCB0aGlzLmdldEZpZWxkcygpKS5nZXQoKTtcblxuICB2YXIgcXVlcnlUb2tlbnMgPSB0aGlzLnBpcGVsaW5lLnJ1bihlbGFzdGljbHVuci50b2tlbml6ZXIocXVlcnkpKTtcblxuICB2YXIgcXVlcnlSZXN1bHRzID0ge307XG5cbiAgZm9yICh2YXIgZmllbGQgaW4gY29uZmlnKSB7XG4gICAgdmFyIGZpZWxkU2VhcmNoUmVzdWx0cyA9IHRoaXMuZmllbGRTZWFyY2gocXVlcnlUb2tlbnMsIGZpZWxkLCBjb25maWcpO1xuICAgIHZhciBmaWVsZEJvb3N0ID0gY29uZmlnW2ZpZWxkXS5ib29zdDtcblxuICAgIGZvciAodmFyIGRvY1JlZiBpbiBmaWVsZFNlYXJjaFJlc3VsdHMpIHtcbiAgICAgIGZpZWxkU2VhcmNoUmVzdWx0c1tkb2NSZWZdID0gZmllbGRTZWFyY2hSZXN1bHRzW2RvY1JlZl0gKiBmaWVsZEJvb3N0O1xuICAgIH1cblxuICAgIGZvciAodmFyIGRvY1JlZiBpbiBmaWVsZFNlYXJjaFJlc3VsdHMpIHtcbiAgICAgIGlmIChkb2NSZWYgaW4gcXVlcnlSZXN1bHRzKSB7XG4gICAgICAgIHF1ZXJ5UmVzdWx0c1tkb2NSZWZdICs9IGZpZWxkU2VhcmNoUmVzdWx0c1tkb2NSZWZdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcXVlcnlSZXN1bHRzW2RvY1JlZl0gPSBmaWVsZFNlYXJjaFJlc3VsdHNbZG9jUmVmXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgcmVzdWx0cyA9IFtdO1xuICBmb3IgKHZhciBkb2NSZWYgaW4gcXVlcnlSZXN1bHRzKSB7XG4gICAgcmVzdWx0cy5wdXNoKHtyZWY6IGRvY1JlZiwgc2NvcmU6IHF1ZXJ5UmVzdWx0c1tkb2NSZWZdfSk7XG4gIH1cblxuICByZXN1bHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGIuc2NvcmUgLSBhLnNjb3JlOyB9KTtcbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vKipcbiAqIHNlYXJjaCBxdWVyeVRva2VucyBpbiBzcGVjaWZpZWQgZmllbGQuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcXVlcnlUb2tlbnMgVGhlIHF1ZXJ5IHRva2VucyB0byBxdWVyeSBpbiB0aGlzIGZpZWxkLlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkIEZpZWxkIHRvIHF1ZXJ5IGluLlxuICogQHBhcmFtIHtlbGFzdGljbHVuci5Db25maWd1cmF0aW9ufSBjb25maWcgVGhlIHVzZXIgcXVlcnkgY29uZmlnLCBKU09OIGZvcm1hdC5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLmZpZWxkU2VhcmNoID0gZnVuY3Rpb24gKHF1ZXJ5VG9rZW5zLCBmaWVsZE5hbWUsIGNvbmZpZykge1xuICB2YXIgYm9vbGVhblR5cGUgPSBjb25maWdbZmllbGROYW1lXS5ib29sO1xuICB2YXIgZXhwYW5kID0gY29uZmlnW2ZpZWxkTmFtZV0uZXhwYW5kO1xuICB2YXIgYm9vc3QgPSBjb25maWdbZmllbGROYW1lXS5ib29zdDtcbiAgdmFyIHNjb3JlcyA9IG51bGw7XG4gIHZhciBkb2NUb2tlbnMgPSB7fTtcblxuICAvLyBEbyBub3RoaW5nIGlmIHRoZSBib29zdCBpcyAwXG4gIGlmIChib29zdCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHF1ZXJ5VG9rZW5zLmZvckVhY2goZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgdmFyIHRva2VucyA9IFt0b2tlbl07XG4gICAgaWYgKGV4cGFuZCA9PSB0cnVlKSB7XG4gICAgICB0b2tlbnMgPSB0aGlzLmluZGV4W2ZpZWxkTmFtZV0uZXhwYW5kVG9rZW4odG9rZW4pO1xuICAgIH1cbiAgICAvLyBDb25zaWRlciBldmVyeSBxdWVyeSB0b2tlbiBpbiB0dXJuLiBJZiBleHBhbmRlZCwgZWFjaCBxdWVyeSB0b2tlblxuICAgIC8vIGNvcnJlc3BvbmRzIHRvIGEgc2V0IG9mIHRva2Vucywgd2hpY2ggaXMgYWxsIHRva2VucyBpbiB0aGUgXG4gICAgLy8gaW5kZXggbWF0Y2hpbmcgdGhlIHBhdHRlcm4gcXVlcnlUb2tlbiogLlxuICAgIC8vIEZvciB0aGUgc2V0IG9mIHRva2VucyBjb3JyZXNwb25kaW5nIHRvIGEgcXVlcnkgdG9rZW4sIGZpbmQgYW5kIHNjb3JlXG4gICAgLy8gYWxsIG1hdGNoaW5nIGRvY3VtZW50cy4gU3RvcmUgdGhvc2Ugc2NvcmVzIGluIHF1ZXJ5VG9rZW5TY29yZXMsIFxuICAgIC8vIGtleWVkIGJ5IGRvY1JlZi5cbiAgICAvLyBUaGVuLCBkZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGJvb2xlYW5UeXBlLCBjb21iaW5lIHRoZSBzY29yZXNcbiAgICAvLyBmb3IgdGhpcyBxdWVyeSB0b2tlbiB3aXRoIHByZXZpb3VzIHNjb3Jlcy4gIElmIGJvb2xlYW5UeXBlIGlzIE9SLFxuICAgIC8vIHRoZW4gbWVyZ2UgdGhlIHNjb3JlcyBieSBzdW1taW5nIGludG8gdGhlIGFjY3VtdWxhdGVkIHRvdGFsLCBhZGRpbmdcbiAgICAvLyBuZXcgZG9jdW1lbnQgc2NvcmVzIGFyZSByZXF1aXJlZCAoZWZmZWN0aXZlbHkgYSB1bmlvbiBvcGVyYXRvcikuIFxuICAgIC8vIElmIGJvb2xlYW5UeXBlIGlzIEFORCwgYWNjdW11bGF0ZSBzY29yZXMgb25seSBpZiB0aGUgZG9jdW1lbnQgXG4gICAgLy8gaGFzIHByZXZpb3VzbHkgYmVlbiBzY29yZWQgYnkgYW5vdGhlciBxdWVyeSB0b2tlbiAoYW4gaW50ZXJzZWN0aW9uXG4gICAgLy8gb3BlcmF0aW9uMC4gXG4gICAgLy8gRnVydGhlcm1vcmUsIHNpbmNlIHdoZW4gYm9vbGVhblR5cGUgaXMgQU5ELCBhZGRpdGlvbmFsIFxuICAgIC8vIHF1ZXJ5IHRva2VucyBjYW4ndCBhZGQgbmV3IGRvY3VtZW50cyB0byB0aGUgcmVzdWx0IHNldCwgdXNlIHRoZVxuICAgIC8vIGN1cnJlbnQgZG9jdW1lbnQgc2V0IHRvIGxpbWl0IHRoZSBwcm9jZXNzaW5nIG9mIGVhY2ggbmV3IHF1ZXJ5IFxuICAgIC8vIHRva2VuIGZvciBlZmZpY2llbmN5IChpLmUuLCBpbmNyZW1lbnRhbCBpbnRlcnNlY3Rpb24pLlxuICAgIFxuICAgIHZhciBxdWVyeVRva2VuU2NvcmVzID0ge307XG4gICAgdG9rZW5zLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIGRvY3MgPSB0aGlzLmluZGV4W2ZpZWxkTmFtZV0uZ2V0RG9jcyhrZXkpO1xuICAgICAgdmFyIGlkZiA9IHRoaXMuaWRmKGtleSwgZmllbGROYW1lKTtcbiAgICAgIFxuICAgICAgaWYgKHNjb3JlcyAmJiBib29sZWFuVHlwZSA9PSAnQU5EJykge1xuICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZSwgd2UgY2FuIHJ1bGUgb3V0IGRvY3VtZW50cyB0aGF0IGhhdmUgYmVlblxuICAgICAgICAgIC8vIGFscmVhZHkgYmVlbiBmaWx0ZXJlZCBvdXQgYmVjYXVzZSB0aGV5IHdlcmVuJ3Qgc2NvcmVkXG4gICAgICAgICAgLy8gYnkgcHJldmlvdXMgcXVlcnkgdG9rZW4gcGFzc2VzLlxuICAgICAgICAgIHZhciBmaWx0ZXJlZERvY3MgPSB7fTtcbiAgICAgICAgICBmb3IgKHZhciBkb2NSZWYgaW4gc2NvcmVzKSB7XG4gICAgICAgICAgICAgIGlmIChkb2NSZWYgaW4gZG9jcykge1xuICAgICAgICAgICAgICAgICAgZmlsdGVyZWREb2NzW2RvY1JlZl0gPSBkb2NzW2RvY1JlZl07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZG9jcyA9IGZpbHRlcmVkRG9jcztcbiAgICAgIH1cbiAgICAgIC8vIG9ubHkgcmVjb3JkIGFwcGVhcmVkIHRva2VuIGZvciByZXRyaWV2ZWQgZG9jdW1lbnRzIGZvciB0aGVcbiAgICAgIC8vIG9yaWdpbmFsIHRva2VuLCBub3QgZm9yIGV4cGFuZWQgdG9rZW4uXG4gICAgICAvLyBiZWF1c2UgZm9yIGRvaW5nIGNvb3JkTm9ybSBmb3IgYSByZXRyaWV2ZWQgZG9jdW1lbnQsIGNvb3JkTm9ybSBvbmx5IGNhcmUgaG93IG1hbnlcbiAgICAgIC8vIHF1ZXJ5IHRva2VuIGFwcGVhciBpbiB0aGF0IGRvY3VtZW50LlxuICAgICAgLy8gc28gZXhwYW5kZWQgdG9rZW4gc2hvdWxkIG5vdCBiZSBhZGRlZCBpbnRvIGRvY1Rva2VucywgaWYgYWRkZWQsIHRoaXMgd2lsbCBwb2xsdXRlIHRoZVxuICAgICAgLy8gY29vcmROb3JtXG4gICAgICBpZiAoa2V5ID09IHRva2VuKSB7XG4gICAgICAgIHRoaXMuZmllbGRTZWFyY2hTdGF0cyhkb2NUb2tlbnMsIGtleSwgZG9jcyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGRvY1JlZiBpbiBkb2NzKSB7XG4gICAgICAgIHZhciB0ZiA9IHRoaXMuaW5kZXhbZmllbGROYW1lXS5nZXRUZXJtRnJlcXVlbmN5KGtleSwgZG9jUmVmKTtcbiAgICAgICAgdmFyIGZpZWxkTGVuZ3RoID0gdGhpcy5kb2N1bWVudFN0b3JlLmdldEZpZWxkTGVuZ3RoKGRvY1JlZiwgZmllbGROYW1lKTtcbiAgICAgICAgdmFyIGZpZWxkTGVuZ3RoTm9ybSA9IDE7XG4gICAgICAgIGlmIChmaWVsZExlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgZmllbGRMZW5ndGhOb3JtID0gMSAvIE1hdGguc3FydChmaWVsZExlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGVuYWxpdHkgPSAxO1xuICAgICAgICBpZiAoa2V5ICE9IHRva2VuKSB7XG4gICAgICAgICAgLy8gY3VycmVudGx5IEknbSBub3Qgc3VyZSBpZiB0aGlzIHBlbmFsaXR5IGlzIGVub3VnaCxcbiAgICAgICAgICAvLyBuZWVkIHRvIGRvIHZlcmlmaWNhdGlvblxuICAgICAgICAgIHBlbmFsaXR5ID0gKDEgLSAoa2V5Lmxlbmd0aCAtIHRva2VuLmxlbmd0aCkgLyBrZXkubGVuZ3RoKSAqIDAuMTU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2NvcmUgPSB0ZiAqIGlkZiAqIGZpZWxkTGVuZ3RoTm9ybSAqIHBlbmFsaXR5O1xuXG4gICAgICAgIGlmIChkb2NSZWYgaW4gcXVlcnlUb2tlblNjb3Jlcykge1xuICAgICAgICAgIHF1ZXJ5VG9rZW5TY29yZXNbZG9jUmVmXSArPSBzY29yZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBxdWVyeVRva2VuU2NvcmVzW2RvY1JlZl0gPSBzY29yZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICAgIFxuICAgIHNjb3JlcyA9IHRoaXMubWVyZ2VTY29yZXMoc2NvcmVzLCBxdWVyeVRva2VuU2NvcmVzLCBib29sZWFuVHlwZSk7XG4gIH0sIHRoaXMpO1xuXG4gIHNjb3JlcyA9IHRoaXMuY29vcmROb3JtKHNjb3JlcywgZG9jVG9rZW5zLCBxdWVyeVRva2Vucy5sZW5ndGgpO1xuICByZXR1cm4gc2NvcmVzO1xufTtcblxuLyoqXG4gKiBNZXJnZSB0aGUgc2NvcmVzIGZyb20gb25lIHNldCBvZiB0b2tlbnMgaW50byBhbiBhY2N1bXVsYXRlZCBzY29yZSB0YWJsZS5cbiAqIEV4YWN0IG9wZXJhdGlvbiBkZXBlbmRzIG9uIHRoZSBvcCBwYXJhbWV0ZXIuIElmIG9wIGlzICdBTkQnLCB0aGVuIG9ubHkgdGhlXG4gKiBpbnRlcnNlY3Rpb24gb2YgdGhlIHR3byBzY29yZSBsaXN0cyBpcyByZXRhaW5lZC4gT3RoZXJ3aXNlLCB0aGUgdW5pb24gb2ZcbiAqIHRoZSB0d28gc2NvcmUgbGlzdHMgaXMgcmV0dXJuZWQuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYm9vbCBhY2N1bXVsYXRlZCBzY29yZXMuIFNob3VsZCBiZSBudWxsIG9uIGZpcnN0IGNhbGwuXG4gKiBAcGFyYW0ge1N0cmluZ30gc2NvcmVzIG5ldyBzY29yZXMgdG8gbWVyZ2UgaW50byBhY2N1bVNjb3Jlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcCBtZXJnZSBvcGVyYXRpb24gKHNob3VsZCBiZSAnQU5EJyBvciAnT1InKS5cbiAqXG4gKi9cblxuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLm1lcmdlU2NvcmVzID0gZnVuY3Rpb24gKGFjY3VtU2NvcmVzLCBzY29yZXMsIG9wKSB7XG4gICAgaWYgKCFhY2N1bVNjb3Jlcykge1xuICAgICAgICByZXR1cm4gc2NvcmVzOyBcbiAgICB9XG4gICAgaWYgKG9wID09ICdBTkQnKSB7XG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSB7fTtcbiAgICAgICAgZm9yICh2YXIgZG9jUmVmIGluIHNjb3Jlcykge1xuICAgICAgICAgICAgaWYgKGRvY1JlZiBpbiBhY2N1bVNjb3Jlcykge1xuICAgICAgICAgICAgICAgIGludGVyc2VjdGlvbltkb2NSZWZdID0gYWNjdW1TY29yZXNbZG9jUmVmXSArIHNjb3Jlc1tkb2NSZWZdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgZG9jUmVmIGluIHNjb3Jlcykge1xuICAgICAgICAgICAgaWYgKGRvY1JlZiBpbiBhY2N1bVNjb3Jlcykge1xuICAgICAgICAgICAgICAgIGFjY3VtU2NvcmVzW2RvY1JlZl0gKz0gc2NvcmVzW2RvY1JlZl07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFjY3VtU2NvcmVzW2RvY1JlZl0gPSBzY29yZXNbZG9jUmVmXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjdW1TY29yZXM7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIFJlY29yZCB0aGUgb2NjdXJpbmcgcXVlcnkgdG9rZW4gb2YgcmV0cmlldmVkIGRvYyBzcGVjaWZpZWQgYnkgZG9jIGZpZWxkLlxuICogT25seSBmb3IgaW5uZXIgdXNlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jVG9rZW5zIGEgZGF0YSBzdHJ1Y3R1cmUgc3RvcmVzIHdoaWNoIHRva2VuIGFwcGVhcnMgaW4gdGhlIHJldHJpZXZlZCBkb2MuXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gcXVlcnkgdG9rZW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2NzIHRoZSByZXRyaWV2ZWQgZG9jdW1lbnRzIG9mIHRoZSBxdWVyeSB0b2tlblxuICpcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLmZpZWxkU2VhcmNoU3RhdHMgPSBmdW5jdGlvbiAoZG9jVG9rZW5zLCB0b2tlbiwgZG9jcykge1xuICBmb3IgKHZhciBkb2MgaW4gZG9jcykge1xuICAgIGlmIChkb2MgaW4gZG9jVG9rZW5zKSB7XG4gICAgICBkb2NUb2tlbnNbZG9jXS5wdXNoKHRva2VuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jVG9rZW5zW2RvY10gPSBbdG9rZW5dO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBjb29yZCBub3JtIHRoZSBzY29yZSBvZiBhIGRvYy5cbiAqIGlmIGEgZG9jIGNvbnRhaW4gbW9yZSBxdWVyeSB0b2tlbnMsIHRoZW4gdGhlIHNjb3JlIHdpbGwgbGFyZ2VyIHRoYW4gdGhlIGRvY1xuICogY29udGFpbnMgbGVzcyBxdWVyeSB0b2tlbnMuXG4gKlxuICogb25seSBmb3IgaW5uZXIgdXNlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSByZXN1bHRzIGZpcnN0IHJlc3VsdHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2NzIGZpZWxkIHNlYXJjaCByZXN1bHRzIG9mIGEgdG9rZW5cbiAqIEBwYXJhbSB7SW50ZWdlcn0gbiBxdWVyeSB0b2tlbiBudW1iZXJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLmNvb3JkTm9ybSA9IGZ1bmN0aW9uIChzY29yZXMsIGRvY1Rva2Vucywgbikge1xuICBmb3IgKHZhciBkb2MgaW4gc2NvcmVzKSB7XG4gICAgaWYgKCEoZG9jIGluIGRvY1Rva2VucykpIGNvbnRpbnVlO1xuICAgIHZhciB0b2tlbnMgPSBkb2NUb2tlbnNbZG9jXS5sZW5ndGg7XG4gICAgc2NvcmVzW2RvY10gPSBzY29yZXNbZG9jXSAqIHRva2VucyAvIG47XG4gIH1cblxuICByZXR1cm4gc2NvcmVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIGluZGV4IHJlYWR5IGZvciBzZXJpYWxpc2F0aW9uLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBtZW1iZXJPZiBJbmRleFxuICovXG5lbGFzdGljbHVuci5JbmRleC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaW5kZXhKc29uID0ge307XG4gIHRoaXMuX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIGluZGV4SnNvbltmaWVsZF0gPSB0aGlzLmluZGV4W2ZpZWxkXS50b0pTT04oKTtcbiAgfSwgdGhpcyk7XG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uOiBlbGFzdGljbHVuci52ZXJzaW9uLFxuICAgIGZpZWxkczogdGhpcy5fZmllbGRzLFxuICAgIHJlZjogdGhpcy5fcmVmLFxuICAgIGRvY3VtZW50U3RvcmU6IHRoaXMuZG9jdW1lbnRTdG9yZS50b0pTT04oKSxcbiAgICBpbmRleDogaW5kZXhKc29uLFxuICAgIHBpcGVsaW5lOiB0aGlzLnBpcGVsaW5lLnRvSlNPTigpXG4gIH07XG59O1xuXG4vKipcbiAqIEFwcGxpZXMgYSBwbHVnaW4gdG8gdGhlIGN1cnJlbnQgaW5kZXguXG4gKlxuICogQSBwbHVnaW4gaXMgYSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aXRoIHRoZSBpbmRleCBhcyBpdHMgY29udGV4dC5cbiAqIFBsdWdpbnMgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXNlIG9yIGV4dGVuZCB0aGUgYmVoYXZpb3VyIHRoZSBpbmRleFxuICogaW4gc29tZSB3YXkuIEEgcGx1Z2luIGlzIGp1c3QgYSBmdW5jdGlvbiwgdGhhdCBlbmNhcHN1bGF0ZWQgdGhlIGN1c3RvbVxuICogYmVoYXZpb3VyIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGluZGV4LlxuICpcbiAqIFRoZSBwbHVnaW4gZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgaW5kZXggYXMgaXRzIGFyZ3VtZW50LCBhZGRpdGlvbmFsXG4gKiBhcmd1bWVudHMgY2FuIGFsc28gYmUgcGFzc2VkIHdoZW4gY2FsbGluZyB1c2UuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZFxuICogd2l0aCB0aGUgaW5kZXggYXMgaXRzIGNvbnRleHQuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgdmFyIG15UGx1Z2luID0gZnVuY3Rpb24gKGlkeCwgYXJnMSwgYXJnMikge1xuICogICAgICAgLy8gYHRoaXNgIGlzIHRoZSBpbmRleCB0byBiZSBleHRlbmRlZFxuICogICAgICAgLy8gYXBwbHkgYW55IGV4dGVuc2lvbnMgZXRjIGhlcmUuXG4gKiAgICAgfVxuICpcbiAqICAgICB2YXIgaWR4ID0gZWxhc3RpY2x1bnIoZnVuY3Rpb24gKCkge1xuICogICAgICAgdGhpcy51c2UobXlQbHVnaW4sICdhcmcxJywgJ2FyZzInKVxuICogICAgIH0pXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcGx1Z2luIFRoZSBwbHVnaW4gdG8gYXBwbHkuXG4gKiBAbWVtYmVyT2YgSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW5kZXgucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICBhcmdzLnVuc2hpZnQodGhpcyk7XG4gIHBsdWdpbi5hcHBseSh0aGlzLCBhcmdzKTtcbn07XG4vKiFcbiAqIGVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZSBpcyBhIHNpbXBsZSBrZXktdmFsdWUgZG9jdW1lbnQgc3RvcmUgdXNlZCBmb3Igc3RvcmluZyBzZXRzIG9mIHRva2VucyBmb3JcbiAqIGRvY3VtZW50cyBzdG9yZWQgaW4gaW5kZXguXG4gKlxuICogZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZSBzdG9yZSBvcmlnaW5hbCBKU09OIGZvcm1hdCBkb2N1bWVudHMgdGhhdCB5b3UgY291bGQgYnVpbGQgc2VhcmNoIHNuaXBwZXQgYnkgdGhpcyBvcmlnaW5hbCBKU09OIGRvY3VtZW50LlxuICpcbiAqIHVzZXIgY291bGQgY2hvb3NlIHdoZXRoZXIgb3JpZ2luYWwgSlNPTiBmb3JtYXQgZG9jdW1lbnQgc2hvdWxkIGJlIHN0b3JlLCBpZiBubyBjb25maWd1cmF0aW9uIHRoZW4gZG9jdW1lbnQgd2lsbCBiZSBzdG9yZWQgZGVmYXVsdGx5LlxuICogSWYgdXNlciBjYXJlIG1vcmUgYWJvdXQgdGhlIGluZGV4IHNpemUsIHVzZXIgY291bGQgc2VsZWN0IG5vdCBzdG9yZSBKU09OIGRvY3VtZW50cywgdGhlbiB0aGlzIHdpbGwgaGFzIHNvbWUgZGVmZWN0cywgc3VjaCBhcyB1c2VyXG4gKiBjb3VsZCBub3QgdXNlIEpTT04gZG9jdW1lbnQgdG8gZ2VuZXJhdGUgc25pcHBldHMgb2Ygc2VhcmNoIHJlc3VsdHMuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBzYXZlIElmIHRoZSBvcmlnaW5hbCBKU09OIGRvY3VtZW50IHNob3VsZCBiZSBzdG9yZWQuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtb2R1bGVcbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZSA9IGZ1bmN0aW9uIChzYXZlKSB7XG4gIGlmIChzYXZlID09PSBudWxsIHx8IHNhdmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX3NhdmUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX3NhdmUgPSBzYXZlO1xuICB9XG5cbiAgdGhpcy5kb2NzID0ge307XG4gIHRoaXMuZG9jSW5mbyA9IHt9O1xuICB0aGlzLmxlbmd0aCA9IDA7XG59O1xuXG4vKipcbiAqIExvYWRzIGEgcHJldmlvdXNseSBzZXJpYWxpc2VkIGRvY3VtZW50IHN0b3JlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNlcmlhbGlzZWREYXRhIFRoZSBzZXJpYWxpc2VkIGRvY3VtZW50IHN0b3JlIHRvIGxvYWQuXG4gKiBAcmV0dXJuIHtlbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlfVxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLmxvYWQgPSBmdW5jdGlvbiAoc2VyaWFsaXNlZERhdGEpIHtcbiAgdmFyIHN0b3JlID0gbmV3IHRoaXM7XG5cbiAgc3RvcmUubGVuZ3RoID0gc2VyaWFsaXNlZERhdGEubGVuZ3RoO1xuICBzdG9yZS5kb2NzID0gc2VyaWFsaXNlZERhdGEuZG9jcztcbiAgc3RvcmUuZG9jSW5mbyA9IHNlcmlhbGlzZWREYXRhLmRvY0luZm87XG4gIHN0b3JlLl9zYXZlID0gc2VyaWFsaXNlZERhdGEuc2F2ZTtcblxuICByZXR1cm4gc3RvcmU7XG59O1xuXG4vKipcbiAqIGNoZWNrIGlmIGN1cnJlbnQgaW5zdGFuY2Ugc3RvcmUgdGhlIG9yaWdpbmFsIGRvY1xuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLmlzRG9jU3RvcmVkID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc2F2ZTtcbn07XG5cbi8qKlxuICogU3RvcmVzIHRoZSBnaXZlbiBkb2MgaW4gdGhlIGRvY3VtZW50IHN0b3JlIGFnYWluc3QgdGhlIGdpdmVuIGlkLlxuICogSWYgZG9jUmVmIGFscmVhZHkgZXhpc3QsIHRoZW4gdXBkYXRlIGRvYy5cbiAqXG4gKiBEb2N1bWVudCBpcyBzdG9yZSBieSBvcmlnaW5hbCBKU09OIGZvcm1hdCwgdGhlbiB5b3UgY291bGQgdXNlIG9yaWdpbmFsIGRvY3VtZW50IHRvIGdlbmVyYXRlIHNlYXJjaCBzbmlwcGV0cy5cbiAqXG4gKiBAcGFyYW0ge0ludGVnZXJ8U3RyaW5nfSBkb2NSZWYgVGhlIGtleSB1c2VkIHRvIHN0b3JlIHRoZSBKU09OIGZvcm1hdCBkb2MuXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jIFRoZSBKU09OIGZvcm1hdCBkb2MuXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLmFkZERvYyA9IGZ1bmN0aW9uIChkb2NSZWYsIGRvYykge1xuICBpZiAoIXRoaXMuaGFzRG9jKGRvY1JlZikpIHRoaXMubGVuZ3RoKys7XG5cbiAgaWYgKHRoaXMuX3NhdmUgPT09IHRydWUpIHtcbiAgICB0aGlzLmRvY3NbZG9jUmVmXSA9IGNsb25lKGRvYyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kb2NzW2RvY1JlZl0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgSlNPTiBkb2MgZnJvbSB0aGUgZG9jdW1lbnQgc3RvcmUgZm9yIGEgZ2l2ZW4ga2V5LlxuICpcbiAqIElmIGRvY1JlZiBub3QgZm91bmQsIHJldHVybiBudWxsLlxuICogSWYgdXNlciBzZXQgbm90IHN0b3JpbmcgdGhlIGRvY3VtZW50cywgcmV0dXJuIG51bGwuXG4gKlxuICogQHBhcmFtIHtJbnRlZ2VyfFN0cmluZ30gZG9jUmVmIFRoZSBrZXkgdG8gbG9va3VwIGFuZCByZXRyaWV2ZSBmcm9tIHRoZSBkb2N1bWVudCBzdG9yZS5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBtZW1iZXJPZiBEb2N1bWVudFN0b3JlXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLmdldERvYyA9IGZ1bmN0aW9uIChkb2NSZWYpIHtcbiAgaWYgKHRoaXMuaGFzRG9jKGRvY1JlZikgPT09IGZhbHNlKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHRoaXMuZG9jc1tkb2NSZWZdO1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgZG9jdW1lbnQgc3RvcmUgY29udGFpbnMgYSBrZXkgKGRvY1JlZikuXG4gKlxuICogQHBhcmFtIHtJbnRlZ2VyfFN0cmluZ30gZG9jUmVmIFRoZSBpZCB0byBsb29rIHVwIGluIHRoZSBkb2N1bWVudCBzdG9yZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAbWVtYmVyT2YgRG9jdW1lbnRTdG9yZVxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS5oYXNEb2MgPSBmdW5jdGlvbiAoZG9jUmVmKSB7XG4gIHJldHVybiBkb2NSZWYgaW4gdGhpcy5kb2NzO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSB2YWx1ZSBmb3IgYSBrZXkgaW4gdGhlIGRvY3VtZW50IHN0b3JlLlxuICpcbiAqIEBwYXJhbSB7SW50ZWdlcnxTdHJpbmd9IGRvY1JlZiBUaGUgaWQgdG8gcmVtb3ZlIGZyb20gdGhlIGRvY3VtZW50IHN0b3JlLlxuICogQG1lbWJlck9mIERvY3VtZW50U3RvcmVcbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUucmVtb3ZlRG9jID0gZnVuY3Rpb24gKGRvY1JlZikge1xuICBpZiAoIXRoaXMuaGFzRG9jKGRvY1JlZikpIHJldHVybjtcblxuICBkZWxldGUgdGhpcy5kb2NzW2RvY1JlZl07XG4gIGRlbGV0ZSB0aGlzLmRvY0luZm9bZG9jUmVmXTtcbiAgdGhpcy5sZW5ndGgtLTtcbn07XG5cbi8qKlxuICogQWRkIGZpZWxkIGxlbmd0aCBvZiBhIGRvY3VtZW50J3MgZmllbGQgdG9rZW5zIGZyb20gcGlwZWxpbmUgcmVzdWx0cy5cbiAqIFRoZSBmaWVsZCBsZW5ndGggb2YgYSBkb2N1bWVudCBpcyB1c2VkIHRvIGRvIGZpZWxkIGxlbmd0aCBub3JtYWxpemF0aW9uIGV2ZW4gd2l0aG91dCB0aGUgb3JpZ2luYWwgSlNPTiBkb2N1bWVudCBzdG9yZWQuXG4gKlxuICogQHBhcmFtIHtJbnRlZ2VyfFN0cmluZ30gZG9jUmVmIGRvY3VtZW50J3MgaWQgb3IgcmVmZXJlbmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGROYW1lIGZpZWxkIG5hbWVcbiAqIEBwYXJhbSB7SW50ZWdlcn0gbGVuZ3RoIGZpZWxkIGxlbmd0aFxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS5hZGRGaWVsZExlbmd0aCA9IGZ1bmN0aW9uIChkb2NSZWYsIGZpZWxkTmFtZSwgbGVuZ3RoKSB7XG4gIGlmIChkb2NSZWYgPT09IG51bGwgfHwgZG9jUmVmID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgaWYgKHRoaXMuaGFzRG9jKGRvY1JlZikgPT0gZmFsc2UpIHJldHVybjtcblxuICBpZiAoIXRoaXMuZG9jSW5mb1tkb2NSZWZdKSB0aGlzLmRvY0luZm9bZG9jUmVmXSA9IHt9O1xuICB0aGlzLmRvY0luZm9bZG9jUmVmXVtmaWVsZE5hbWVdID0gbGVuZ3RoO1xufTtcblxuLyoqXG4gKiBVcGRhdGUgZmllbGQgbGVuZ3RoIG9mIGEgZG9jdW1lbnQncyBmaWVsZCB0b2tlbnMgZnJvbSBwaXBlbGluZSByZXN1bHRzLlxuICogVGhlIGZpZWxkIGxlbmd0aCBvZiBhIGRvY3VtZW50IGlzIHVzZWQgdG8gZG8gZmllbGQgbGVuZ3RoIG5vcm1hbGl6YXRpb24gZXZlbiB3aXRob3V0IHRoZSBvcmlnaW5hbCBKU09OIGRvY3VtZW50IHN0b3JlZC5cbiAqXG4gKiBAcGFyYW0ge0ludGVnZXJ8U3RyaW5nfSBkb2NSZWYgZG9jdW1lbnQncyBpZCBvciByZWZlcmVuY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZE5hbWUgZmllbGQgbmFtZVxuICogQHBhcmFtIHtJbnRlZ2VyfSBsZW5ndGggZmllbGQgbGVuZ3RoXG4gKi9cbmVsYXN0aWNsdW5yLkRvY3VtZW50U3RvcmUucHJvdG90eXBlLnVwZGF0ZUZpZWxkTGVuZ3RoID0gZnVuY3Rpb24gKGRvY1JlZiwgZmllbGROYW1lLCBsZW5ndGgpIHtcbiAgaWYgKGRvY1JlZiA9PT0gbnVsbCB8fCBkb2NSZWYgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICBpZiAodGhpcy5oYXNEb2MoZG9jUmVmKSA9PSBmYWxzZSkgcmV0dXJuO1xuXG4gIHRoaXMuYWRkRmllbGRMZW5ndGgoZG9jUmVmLCBmaWVsZE5hbWUsIGxlbmd0aCk7XG59O1xuXG4vKipcbiAqIGdldCBmaWVsZCBsZW5ndGggb2YgYSBkb2N1bWVudCBieSBkb2NSZWZcbiAqXG4gKiBAcGFyYW0ge0ludGVnZXJ8U3RyaW5nfSBkb2NSZWYgZG9jdW1lbnQgaWQgb3IgcmVmZXJlbmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGROYW1lIGZpZWxkIG5hbWVcbiAqIEByZXR1cm4ge0ludGVnZXJ9IGZpZWxkIGxlbmd0aFxuICovXG5lbGFzdGljbHVuci5Eb2N1bWVudFN0b3JlLnByb3RvdHlwZS5nZXRGaWVsZExlbmd0aCA9IGZ1bmN0aW9uIChkb2NSZWYsIGZpZWxkTmFtZSkge1xuICBpZiAoZG9jUmVmID09PSBudWxsIHx8IGRvY1JlZiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gMDtcblxuICBpZiAoIShkb2NSZWYgaW4gdGhpcy5kb2NzKSkgcmV0dXJuIDA7XG4gIGlmICghKGZpZWxkTmFtZSBpbiB0aGlzLmRvY0luZm9bZG9jUmVmXSkpIHJldHVybiAwO1xuICByZXR1cm4gdGhpcy5kb2NJbmZvW2RvY1JlZl1bZmllbGROYW1lXTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGRvY3VtZW50IHN0b3JlIHVzZWQgZm9yIHNlcmlhbGlzYXRpb24uXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBKU09OIGZvcm1hdFxuICogQG1lbWJlck9mIERvY3VtZW50U3RvcmVcbiAqL1xuZWxhc3RpY2x1bnIuRG9jdW1lbnRTdG9yZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIGRvY3M6IHRoaXMuZG9jcyxcbiAgICBkb2NJbmZvOiB0aGlzLmRvY0luZm8sXG4gICAgbGVuZ3RoOiB0aGlzLmxlbmd0aCxcbiAgICBzYXZlOiB0aGlzLl9zYXZlXG4gIH07XG59O1xuXG4vKipcbiAqIENsb25pbmcgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBpbiBKU09OIGZvcm1hdFxuICogQHJldHVybiB7T2JqZWN0fSBjb3BpZWQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuICBpZiAobnVsbCA9PT0gb2JqIHx8IFwib2JqZWN0XCIgIT09IHR5cGVvZiBvYmopIHJldHVybiBvYmo7XG5cbiAgdmFyIGNvcHkgPSBvYmouY29uc3RydWN0b3IoKTtcblxuICBmb3IgKHZhciBhdHRyIGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoYXR0cikpIGNvcHlbYXR0cl0gPSBvYmpbYXR0cl07XG4gIH1cblxuICByZXR1cm4gY29weTtcbn1cbi8qIVxuICogZWxhc3RpY2x1bnIuc3RlbW1lclxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICogQ29weXJpZ2h0IChDKSAyMDE2IFdlaSBTb25nXG4gKiBJbmNsdWRlcyBjb2RlIGZyb20gLSBodHRwOi8vdGFydGFydXMub3JnL35tYXJ0aW4vUG9ydGVyU3RlbW1lci9qcy50eHRcbiAqL1xuXG4vKipcbiAqIGVsYXN0aWNsdW5yLnN0ZW1tZXIgaXMgYW4gZW5nbGlzaCBsYW5ndWFnZSBzdGVtbWVyLCB0aGlzIGlzIGEgSmF2YVNjcmlwdFxuICogaW1wbGVtZW50YXRpb24gb2YgdGhlIFBvcnRlclN0ZW1tZXIgdGFrZW4gZnJvbSBodHRwOi8vdGFydGFydXMub3JnL35tYXJ0aW5cbiAqXG4gKiBAbW9kdWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gc3RlbVxuICogQHJldHVybiB7U3RyaW5nfVxuICogQHNlZSBlbGFzdGljbHVuci5QaXBlbGluZVxuICovXG5lbGFzdGljbHVuci5zdGVtbWVyID0gKGZ1bmN0aW9uKCl7XG4gIHZhciBzdGVwMmxpc3QgPSB7XG4gICAgICBcImF0aW9uYWxcIiA6IFwiYXRlXCIsXG4gICAgICBcInRpb25hbFwiIDogXCJ0aW9uXCIsXG4gICAgICBcImVuY2lcIiA6IFwiZW5jZVwiLFxuICAgICAgXCJhbmNpXCIgOiBcImFuY2VcIixcbiAgICAgIFwiaXplclwiIDogXCJpemVcIixcbiAgICAgIFwiYmxpXCIgOiBcImJsZVwiLFxuICAgICAgXCJhbGxpXCIgOiBcImFsXCIsXG4gICAgICBcImVudGxpXCIgOiBcImVudFwiLFxuICAgICAgXCJlbGlcIiA6IFwiZVwiLFxuICAgICAgXCJvdXNsaVwiIDogXCJvdXNcIixcbiAgICAgIFwiaXphdGlvblwiIDogXCJpemVcIixcbiAgICAgIFwiYXRpb25cIiA6IFwiYXRlXCIsXG4gICAgICBcImF0b3JcIiA6IFwiYXRlXCIsXG4gICAgICBcImFsaXNtXCIgOiBcImFsXCIsXG4gICAgICBcIml2ZW5lc3NcIiA6IFwiaXZlXCIsXG4gICAgICBcImZ1bG5lc3NcIiA6IFwiZnVsXCIsXG4gICAgICBcIm91c25lc3NcIiA6IFwib3VzXCIsXG4gICAgICBcImFsaXRpXCIgOiBcImFsXCIsXG4gICAgICBcIml2aXRpXCIgOiBcIml2ZVwiLFxuICAgICAgXCJiaWxpdGlcIiA6IFwiYmxlXCIsXG4gICAgICBcImxvZ2lcIiA6IFwibG9nXCJcbiAgICB9LFxuXG4gICAgc3RlcDNsaXN0ID0ge1xuICAgICAgXCJpY2F0ZVwiIDogXCJpY1wiLFxuICAgICAgXCJhdGl2ZVwiIDogXCJcIixcbiAgICAgIFwiYWxpemVcIiA6IFwiYWxcIixcbiAgICAgIFwiaWNpdGlcIiA6IFwiaWNcIixcbiAgICAgIFwiaWNhbFwiIDogXCJpY1wiLFxuICAgICAgXCJmdWxcIiA6IFwiXCIsXG4gICAgICBcIm5lc3NcIiA6IFwiXCJcbiAgICB9LFxuXG4gICAgYyA9IFwiW15hZWlvdV1cIiwgICAgICAgICAgLy8gY29uc29uYW50XG4gICAgdiA9IFwiW2FlaW91eV1cIiwgICAgICAgICAgLy8gdm93ZWxcbiAgICBDID0gYyArIFwiW15hZWlvdXldKlwiLCAgICAvLyBjb25zb25hbnQgc2VxdWVuY2VcbiAgICBWID0gdiArIFwiW2FlaW91XSpcIiwgICAgICAvLyB2b3dlbCBzZXF1ZW5jZVxuXG4gICAgbWdyMCA9IFwiXihcIiArIEMgKyBcIik/XCIgKyBWICsgQywgICAgICAgICAgICAgICAvLyBbQ11WQy4uLiBpcyBtPjBcbiAgICBtZXExID0gXCJeKFwiICsgQyArIFwiKT9cIiArIFYgKyBDICsgXCIoXCIgKyBWICsgXCIpPyRcIiwgIC8vIFtDXVZDW1ZdIGlzIG09MVxuICAgIG1ncjEgPSBcIl4oXCIgKyBDICsgXCIpP1wiICsgViArIEMgKyBWICsgQywgICAgICAgLy8gW0NdVkNWQy4uLiBpcyBtPjFcbiAgICBzX3YgPSBcIl4oXCIgKyBDICsgXCIpP1wiICsgdjsgICAgICAgICAgICAgICAgICAgLy8gdm93ZWwgaW4gc3RlbVxuXG4gIHZhciByZV9tZ3IwID0gbmV3IFJlZ0V4cChtZ3IwKTtcbiAgdmFyIHJlX21ncjEgPSBuZXcgUmVnRXhwKG1ncjEpO1xuICB2YXIgcmVfbWVxMSA9IG5ldyBSZWdFeHAobWVxMSk7XG4gIHZhciByZV9zX3YgPSBuZXcgUmVnRXhwKHNfdik7XG5cbiAgdmFyIHJlXzFhID0gL14oLis/KShzc3xpKWVzJC87XG4gIHZhciByZTJfMWEgPSAvXiguKz8pKFtec10pcyQvO1xuICB2YXIgcmVfMWIgPSAvXiguKz8pZWVkJC87XG4gIHZhciByZTJfMWIgPSAvXiguKz8pKGVkfGluZykkLztcbiAgdmFyIHJlXzFiXzIgPSAvLiQvO1xuICB2YXIgcmUyXzFiXzIgPSAvKGF0fGJsfGl6KSQvO1xuICB2YXIgcmUzXzFiXzIgPSBuZXcgUmVnRXhwKFwiKFteYWVpb3V5bHN6XSlcXFxcMSRcIik7XG4gIHZhciByZTRfMWJfMiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBDICsgdiArIFwiW15hZWlvdXd4eV0kXCIpO1xuXG4gIHZhciByZV8xYyA9IC9eKC4rP1teYWVpb3VdKXkkLztcbiAgdmFyIHJlXzIgPSAvXiguKz8pKGF0aW9uYWx8dGlvbmFsfGVuY2l8YW5jaXxpemVyfGJsaXxhbGxpfGVudGxpfGVsaXxvdXNsaXxpemF0aW9ufGF0aW9ufGF0b3J8YWxpc218aXZlbmVzc3xmdWxuZXNzfG91c25lc3N8YWxpdGl8aXZpdGl8YmlsaXRpfGxvZ2kpJC87XG5cbiAgdmFyIHJlXzMgPSAvXiguKz8pKGljYXRlfGF0aXZlfGFsaXplfGljaXRpfGljYWx8ZnVsfG5lc3MpJC87XG5cbiAgdmFyIHJlXzQgPSAvXiguKz8pKGFsfGFuY2V8ZW5jZXxlcnxpY3xhYmxlfGlibGV8YW50fGVtZW50fG1lbnR8ZW50fG91fGlzbXxhdGV8aXRpfG91c3xpdmV8aXplKSQvO1xuICB2YXIgcmUyXzQgPSAvXiguKz8pKHN8dCkoaW9uKSQvO1xuXG4gIHZhciByZV81ID0gL14oLis/KWUkLztcbiAgdmFyIHJlXzVfMSA9IC9sbCQvO1xuICB2YXIgcmUzXzUgPSBuZXcgUmVnRXhwKFwiXlwiICsgQyArIHYgKyBcIlteYWVpb3V3eHldJFwiKTtcblxuICB2YXIgcG9ydGVyU3RlbW1lciA9IGZ1bmN0aW9uIHBvcnRlclN0ZW1tZXIodykge1xuICAgIHZhciAgIHN0ZW0sXG4gICAgICBzdWZmaXgsXG4gICAgICBmaXJzdGNoLFxuICAgICAgcmUsXG4gICAgICByZTIsXG4gICAgICByZTMsXG4gICAgICByZTQ7XG5cbiAgICBpZiAody5sZW5ndGggPCAzKSB7IHJldHVybiB3OyB9XG5cbiAgICBmaXJzdGNoID0gdy5zdWJzdHIoMCwxKTtcbiAgICBpZiAoZmlyc3RjaCA9PSBcInlcIikge1xuICAgICAgdyA9IGZpcnN0Y2gudG9VcHBlckNhc2UoKSArIHcuc3Vic3RyKDEpO1xuICAgIH1cblxuICAgIC8vIFN0ZXAgMWFcbiAgICByZSA9IHJlXzFhXG4gICAgcmUyID0gcmUyXzFhO1xuXG4gICAgaWYgKHJlLnRlc3QodykpIHsgdyA9IHcucmVwbGFjZShyZSxcIiQxJDJcIik7IH1cbiAgICBlbHNlIGlmIChyZTIudGVzdCh3KSkgeyB3ID0gdy5yZXBsYWNlKHJlMixcIiQxJDJcIik7IH1cblxuICAgIC8vIFN0ZXAgMWJcbiAgICByZSA9IHJlXzFiO1xuICAgIHJlMiA9IHJlMl8xYjtcbiAgICBpZiAocmUudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUuZXhlYyh3KTtcbiAgICAgIHJlID0gcmVfbWdyMDtcbiAgICAgIGlmIChyZS50ZXN0KGZwWzFdKSkge1xuICAgICAgICByZSA9IHJlXzFiXzI7XG4gICAgICAgIHcgPSB3LnJlcGxhY2UocmUsXCJcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZTIudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUyLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV07XG4gICAgICByZTIgPSByZV9zX3Y7XG4gICAgICBpZiAocmUyLnRlc3Qoc3RlbSkpIHtcbiAgICAgICAgdyA9IHN0ZW07XG4gICAgICAgIHJlMiA9IHJlMl8xYl8yO1xuICAgICAgICByZTMgPSByZTNfMWJfMjtcbiAgICAgICAgcmU0ID0gcmU0XzFiXzI7XG4gICAgICAgIGlmIChyZTIudGVzdCh3KSkgeyAgdyA9IHcgKyBcImVcIjsgfVxuICAgICAgICBlbHNlIGlmIChyZTMudGVzdCh3KSkgeyByZSA9IHJlXzFiXzI7IHcgPSB3LnJlcGxhY2UocmUsXCJcIik7IH1cbiAgICAgICAgZWxzZSBpZiAocmU0LnRlc3QodykpIHsgdyA9IHcgKyBcImVcIjsgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0ZXAgMWMgLSByZXBsYWNlIHN1ZmZpeCB5IG9yIFkgYnkgaSBpZiBwcmVjZWRlZCBieSBhIG5vbi12b3dlbCB3aGljaCBpcyBub3QgdGhlIGZpcnN0IGxldHRlciBvZiB0aGUgd29yZCAoc28gY3J5IC0+IGNyaSwgYnkgLT4gYnksIHNheSAtPiBzYXkpXG4gICAgcmUgPSByZV8xYztcbiAgICBpZiAocmUudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXTtcbiAgICAgIHcgPSBzdGVtICsgXCJpXCI7XG4gICAgfVxuXG4gICAgLy8gU3RlcCAyXG4gICAgcmUgPSByZV8yO1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdO1xuICAgICAgc3VmZml4ID0gZnBbMl07XG4gICAgICByZSA9IHJlX21ncjA7XG4gICAgICBpZiAocmUudGVzdChzdGVtKSkge1xuICAgICAgICB3ID0gc3RlbSArIHN0ZXAybGlzdFtzdWZmaXhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0ZXAgM1xuICAgIHJlID0gcmVfMztcbiAgICBpZiAocmUudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXTtcbiAgICAgIHN1ZmZpeCA9IGZwWzJdO1xuICAgICAgcmUgPSByZV9tZ3IwO1xuICAgICAgaWYgKHJlLnRlc3Qoc3RlbSkpIHtcbiAgICAgICAgdyA9IHN0ZW0gKyBzdGVwM2xpc3Rbc3VmZml4XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdGVwIDRcbiAgICByZSA9IHJlXzQ7XG4gICAgcmUyID0gcmUyXzQ7XG4gICAgaWYgKHJlLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV07XG4gICAgICByZSA9IHJlX21ncjE7XG4gICAgICBpZiAocmUudGVzdChzdGVtKSkge1xuICAgICAgICB3ID0gc3RlbTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlMi50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZTIuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXSArIGZwWzJdO1xuICAgICAgcmUyID0gcmVfbWdyMTtcbiAgICAgIGlmIChyZTIudGVzdChzdGVtKSkge1xuICAgICAgICB3ID0gc3RlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdGVwIDVcbiAgICByZSA9IHJlXzU7XG4gICAgaWYgKHJlLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV07XG4gICAgICByZSA9IHJlX21ncjE7XG4gICAgICByZTIgPSByZV9tZXExO1xuICAgICAgcmUzID0gcmUzXzU7XG4gICAgICBpZiAocmUudGVzdChzdGVtKSB8fCAocmUyLnRlc3Qoc3RlbSkgJiYgIShyZTMudGVzdChzdGVtKSkpKSB7XG4gICAgICAgIHcgPSBzdGVtO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlID0gcmVfNV8xO1xuICAgIHJlMiA9IHJlX21ncjE7XG4gICAgaWYgKHJlLnRlc3QodykgJiYgcmUyLnRlc3QodykpIHtcbiAgICAgIHJlID0gcmVfMWJfMjtcbiAgICAgIHcgPSB3LnJlcGxhY2UocmUsXCJcIik7XG4gICAgfVxuXG4gICAgLy8gYW5kIHR1cm4gaW5pdGlhbCBZIGJhY2sgdG8geVxuXG4gICAgaWYgKGZpcnN0Y2ggPT0gXCJ5XCIpIHtcbiAgICAgIHcgPSBmaXJzdGNoLnRvTG93ZXJDYXNlKCkgKyB3LnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdztcbiAgfTtcblxuICByZXR1cm4gcG9ydGVyU3RlbW1lcjtcbn0pKCk7XG5cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyRnVuY3Rpb24oZWxhc3RpY2x1bnIuc3RlbW1lciwgJ3N0ZW1tZXInKTtcbi8qIVxuICogZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXJcbiAqIENvcHlyaWdodCAoQykgMjAxNiBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG5cbi8qKlxuICogZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIgaXMgYW4gRW5nbGlzaCBsYW5ndWFnZSBzdG9wIHdvcmRzIGZpbHRlciwgYW55IHdvcmRzXG4gKiBjb250YWluZWQgaW4gdGhlIHN0b3Agd29yZCBsaXN0IHdpbGwgbm90IGJlIHBhc3NlZCB0aHJvdWdoIHRoZSBmaWx0ZXIuXG4gKlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIGluIHRoZSBQaXBlbGluZS4gSWYgdGhlIHRva2VuIGRvZXMgbm90IHBhc3MgdGhlXG4gKiBmaWx0ZXIgdGhlbiB1bmRlZmluZWQgd2lsbCBiZSByZXR1cm5lZC5cbiAqIEN1cnJlbnRseSB0aGlzIFN0b3B3b3JkRmlsdGVyIHVzaW5nIGRpY3Rpb25hcnkgdG8gZG8gTygxKSB0aW1lIGNvbXBsZXhpdHkgc3RvcCB3b3JkIGZpbHRlcmluZy5cbiAqXG4gKiBAbW9kdWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIHBhc3MgdGhyb3VnaCB0aGUgZmlsdGVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAc2VlIGVsYXN0aWNsdW5yLlBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIGlmICh0b2tlbiAmJiBlbGFzdGljbHVuci5zdG9wV29yZEZpbHRlci5zdG9wV29yZHNbdG9rZW5dICE9PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbW92ZSBwcmVkZWZpbmVkIHN0b3Agd29yZHNcbiAqIGlmIHVzZXIgd2FudCB0byB1c2UgY3VzdG9taXplZCBzdG9wIHdvcmRzLCB1c2VyIGNvdWxkIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIGRlbGV0ZVxuICogYWxsIHByZWRlZmluZWQgc3RvcHdvcmRzLlxuICpcbiAqIEByZXR1cm4ge251bGx9XG4gKi9cbmVsYXN0aWNsdW5yLmNsZWFyU3RvcFdvcmRzID0gZnVuY3Rpb24gKCkge1xuICBlbGFzdGljbHVuci5zdG9wV29yZEZpbHRlci5zdG9wV29yZHMgPSB7fTtcbn07XG5cbi8qKlxuICogQWRkIGN1c3RvbWl6ZWQgc3RvcCB3b3Jkc1xuICogdXNlciBjb3VsZCB1c2UgdGhpcyBmdW5jdGlvbiB0byBhZGQgY3VzdG9taXplZCBzdG9wIHdvcmRzXG4gKiBcbiAqIEBwYXJhbXMge0FycmF5fSB3b3JkcyBjdXN0b21pemVkIHN0b3Agd29yZHNcbiAqIEByZXR1cm4ge251bGx9XG4gKi9cbmVsYXN0aWNsdW5yLmFkZFN0b3BXb3JkcyA9IGZ1bmN0aW9uICh3b3Jkcykge1xuICBpZiAod29yZHMgPT0gbnVsbCB8fCBBcnJheS5pc0FycmF5KHdvcmRzKSA9PT0gZmFsc2UpIHJldHVybjtcblxuICB3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIuc3RvcFdvcmRzW3dvcmRdID0gdHJ1ZTtcbiAgfSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIFJlc2V0IHRvIGRlZmF1bHQgc3RvcCB3b3Jkc1xuICogdXNlciBjb3VsZCB1c2UgdGhpcyBmdW5jdGlvbiB0byByZXN0b3JlIGRlZmF1bHQgc3RvcCB3b3Jkc1xuICpcbiAqIEByZXR1cm4ge251bGx9XG4gKi9cbmVsYXN0aWNsdW5yLnJlc2V0U3RvcFdvcmRzID0gZnVuY3Rpb24gKCkge1xuICBlbGFzdGljbHVuci5zdG9wV29yZEZpbHRlci5zdG9wV29yZHMgPSBlbGFzdGljbHVuci5kZWZhdWx0U3RvcFdvcmRzO1xufTtcblxuZWxhc3RpY2x1bnIuZGVmYXVsdFN0b3BXb3JkcyA9IHtcbiAgXCJcIjogdHJ1ZSxcbiAgXCJhXCI6IHRydWUsXG4gIFwiYWJsZVwiOiB0cnVlLFxuICBcImFib3V0XCI6IHRydWUsXG4gIFwiYWNyb3NzXCI6IHRydWUsXG4gIFwiYWZ0ZXJcIjogdHJ1ZSxcbiAgXCJhbGxcIjogdHJ1ZSxcbiAgXCJhbG1vc3RcIjogdHJ1ZSxcbiAgXCJhbHNvXCI6IHRydWUsXG4gIFwiYW1cIjogdHJ1ZSxcbiAgXCJhbW9uZ1wiOiB0cnVlLFxuICBcImFuXCI6IHRydWUsXG4gIFwiYW5kXCI6IHRydWUsXG4gIFwiYW55XCI6IHRydWUsXG4gIFwiYXJlXCI6IHRydWUsXG4gIFwiYXNcIjogdHJ1ZSxcbiAgXCJhdFwiOiB0cnVlLFxuICBcImJlXCI6IHRydWUsXG4gIFwiYmVjYXVzZVwiOiB0cnVlLFxuICBcImJlZW5cIjogdHJ1ZSxcbiAgXCJidXRcIjogdHJ1ZSxcbiAgXCJieVwiOiB0cnVlLFxuICBcImNhblwiOiB0cnVlLFxuICBcImNhbm5vdFwiOiB0cnVlLFxuICBcImNvdWxkXCI6IHRydWUsXG4gIFwiZGVhclwiOiB0cnVlLFxuICBcImRpZFwiOiB0cnVlLFxuICBcImRvXCI6IHRydWUsXG4gIFwiZG9lc1wiOiB0cnVlLFxuICBcImVpdGhlclwiOiB0cnVlLFxuICBcImVsc2VcIjogdHJ1ZSxcbiAgXCJldmVyXCI6IHRydWUsXG4gIFwiZXZlcnlcIjogdHJ1ZSxcbiAgXCJmb3JcIjogdHJ1ZSxcbiAgXCJmcm9tXCI6IHRydWUsXG4gIFwiZ2V0XCI6IHRydWUsXG4gIFwiZ290XCI6IHRydWUsXG4gIFwiaGFkXCI6IHRydWUsXG4gIFwiaGFzXCI6IHRydWUsXG4gIFwiaGF2ZVwiOiB0cnVlLFxuICBcImhlXCI6IHRydWUsXG4gIFwiaGVyXCI6IHRydWUsXG4gIFwiaGVyc1wiOiB0cnVlLFxuICBcImhpbVwiOiB0cnVlLFxuICBcImhpc1wiOiB0cnVlLFxuICBcImhvd1wiOiB0cnVlLFxuICBcImhvd2V2ZXJcIjogdHJ1ZSxcbiAgXCJpXCI6IHRydWUsXG4gIFwiaWZcIjogdHJ1ZSxcbiAgXCJpblwiOiB0cnVlLFxuICBcImludG9cIjogdHJ1ZSxcbiAgXCJpc1wiOiB0cnVlLFxuICBcIml0XCI6IHRydWUsXG4gIFwiaXRzXCI6IHRydWUsXG4gIFwianVzdFwiOiB0cnVlLFxuICBcImxlYXN0XCI6IHRydWUsXG4gIFwibGV0XCI6IHRydWUsXG4gIFwibGlrZVwiOiB0cnVlLFxuICBcImxpa2VseVwiOiB0cnVlLFxuICBcIm1heVwiOiB0cnVlLFxuICBcIm1lXCI6IHRydWUsXG4gIFwibWlnaHRcIjogdHJ1ZSxcbiAgXCJtb3N0XCI6IHRydWUsXG4gIFwibXVzdFwiOiB0cnVlLFxuICBcIm15XCI6IHRydWUsXG4gIFwibmVpdGhlclwiOiB0cnVlLFxuICBcIm5vXCI6IHRydWUsXG4gIFwibm9yXCI6IHRydWUsXG4gIFwibm90XCI6IHRydWUsXG4gIFwib2ZcIjogdHJ1ZSxcbiAgXCJvZmZcIjogdHJ1ZSxcbiAgXCJvZnRlblwiOiB0cnVlLFxuICBcIm9uXCI6IHRydWUsXG4gIFwib25seVwiOiB0cnVlLFxuICBcIm9yXCI6IHRydWUsXG4gIFwib3RoZXJcIjogdHJ1ZSxcbiAgXCJvdXJcIjogdHJ1ZSxcbiAgXCJvd25cIjogdHJ1ZSxcbiAgXCJyYXRoZXJcIjogdHJ1ZSxcbiAgXCJzYWlkXCI6IHRydWUsXG4gIFwic2F5XCI6IHRydWUsXG4gIFwic2F5c1wiOiB0cnVlLFxuICBcInNoZVwiOiB0cnVlLFxuICBcInNob3VsZFwiOiB0cnVlLFxuICBcInNpbmNlXCI6IHRydWUsXG4gIFwic29cIjogdHJ1ZSxcbiAgXCJzb21lXCI6IHRydWUsXG4gIFwidGhhblwiOiB0cnVlLFxuICBcInRoYXRcIjogdHJ1ZSxcbiAgXCJ0aGVcIjogdHJ1ZSxcbiAgXCJ0aGVpclwiOiB0cnVlLFxuICBcInRoZW1cIjogdHJ1ZSxcbiAgXCJ0aGVuXCI6IHRydWUsXG4gIFwidGhlcmVcIjogdHJ1ZSxcbiAgXCJ0aGVzZVwiOiB0cnVlLFxuICBcInRoZXlcIjogdHJ1ZSxcbiAgXCJ0aGlzXCI6IHRydWUsXG4gIFwidGlzXCI6IHRydWUsXG4gIFwidG9cIjogdHJ1ZSxcbiAgXCJ0b29cIjogdHJ1ZSxcbiAgXCJ0d2FzXCI6IHRydWUsXG4gIFwidXNcIjogdHJ1ZSxcbiAgXCJ3YW50c1wiOiB0cnVlLFxuICBcIndhc1wiOiB0cnVlLFxuICBcIndlXCI6IHRydWUsXG4gIFwid2VyZVwiOiB0cnVlLFxuICBcIndoYXRcIjogdHJ1ZSxcbiAgXCJ3aGVuXCI6IHRydWUsXG4gIFwid2hlcmVcIjogdHJ1ZSxcbiAgXCJ3aGljaFwiOiB0cnVlLFxuICBcIndoaWxlXCI6IHRydWUsXG4gIFwid2hvXCI6IHRydWUsXG4gIFwid2hvbVwiOiB0cnVlLFxuICBcIndoeVwiOiB0cnVlLFxuICBcIndpbGxcIjogdHJ1ZSxcbiAgXCJ3aXRoXCI6IHRydWUsXG4gIFwid291bGRcIjogdHJ1ZSxcbiAgXCJ5ZXRcIjogdHJ1ZSxcbiAgXCJ5b3VcIjogdHJ1ZSxcbiAgXCJ5b3VyXCI6IHRydWVcbn07XG5cbmVsYXN0aWNsdW5yLnN0b3BXb3JkRmlsdGVyLnN0b3BXb3JkcyA9IGVsYXN0aWNsdW5yLmRlZmF1bHRTdG9wV29yZHM7XG5cbmVsYXN0aWNsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyRnVuY3Rpb24oZWxhc3RpY2x1bnIuc3RvcFdvcmRGaWx0ZXIsICdzdG9wV29yZEZpbHRlcicpO1xuLyohXG4gKiBlbGFzdGljbHVuci50cmltbWVyXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgV2VpIFNvbmdcbiAqL1xuXG4vKipcbiAqIGVsYXN0aWNsdW5yLnRyaW1tZXIgaXMgYSBwaXBlbGluZSBmdW5jdGlvbiBmb3IgdHJpbW1pbmcgbm9uIHdvcmRcbiAqIGNoYXJhY3RlcnMgZnJvbSB0aGUgYmVnaW5pbmcgYW5kIGVuZCBvZiB0b2tlbnMgYmVmb3JlIHRoZXlcbiAqIGVudGVyIHRoZSBpbmRleC5cbiAqXG4gKiBUaGlzIGltcGxlbWVudGF0aW9uIG1heSBub3Qgd29yayBjb3JyZWN0bHkgZm9yIG5vbiBsYXRpblxuICogY2hhcmFjdGVycyBhbmQgc2hvdWxkIGVpdGhlciBiZSByZW1vdmVkIG9yIGFkYXB0ZWQgZm9yIHVzZVxuICogd2l0aCBsYW5ndWFnZXMgd2l0aCBub24tbGF0aW4gY2hhcmFjdGVycy5cbiAqXG4gKiBAbW9kdWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIHBhc3MgdGhyb3VnaCB0aGUgZmlsdGVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAc2VlIGVsYXN0aWNsdW5yLlBpcGVsaW5lXG4gKi9cbmVsYXN0aWNsdW5yLnRyaW1tZXIgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgaWYgKHRva2VuID09PSBudWxsIHx8IHRva2VuID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Rva2VuIHNob3VsZCBub3QgYmUgdW5kZWZpbmVkJyk7XG4gIH1cblxuICByZXR1cm4gdG9rZW5cbiAgICAucmVwbGFjZSgvXlxcVysvLCAnJylcbiAgICAucmVwbGFjZSgvXFxXKyQvLCAnJyk7XG59O1xuXG5lbGFzdGljbHVuci5QaXBlbGluZS5yZWdpc3RlckZ1bmN0aW9uKGVsYXN0aWNsdW5yLnRyaW1tZXIsICd0cmltbWVyJyk7XG4vKiFcbiAqIGVsYXN0aWNsdW5yLkludmVydGVkSW5kZXhcbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICogSW5jbHVkZXMgY29kZSBmcm9tIC0gaHR0cDovL3RhcnRhcnVzLm9yZy9+bWFydGluL1BvcnRlclN0ZW1tZXIvanMudHh0XG4gKi9cblxuLyoqXG4gKiBlbGFzdGljbHVuci5JbnZlcnRlZEluZGV4IGlzIHVzZWQgZm9yIGVmZmljaWVudGx5IHN0b3JpbmcgYW5kXG4gKiBsb29rdXAgb2YgZG9jdW1lbnRzIHRoYXQgY29udGFpbiBhIGdpdmVuIHRva2VuLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnJvb3QgPSB7IGRvY3M6IHt9LCBkZjogMCB9O1xufTtcblxuLyoqXG4gKiBMb2FkcyBhIHByZXZpb3VzbHkgc2VyaWFsaXNlZCBpbnZlcnRlZCBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2VyaWFsaXNlZERhdGEgVGhlIHNlcmlhbGlzZWQgaW52ZXJ0ZWQgaW5kZXggdG8gbG9hZC5cbiAqIEByZXR1cm4ge2VsYXN0aWNsdW5yLkludmVydGVkSW5kZXh9XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgubG9hZCA9IGZ1bmN0aW9uIChzZXJpYWxpc2VkRGF0YSkge1xuICB2YXIgaWR4ID0gbmV3IHRoaXM7XG4gIGlkeC5yb290ID0gc2VyaWFsaXNlZERhdGEucm9vdDtcblxuICByZXR1cm4gaWR4O1xufTtcblxuLyoqXG4gKiBBZGRzIGEge3Rva2VuOiB0b2tlbkluZm99IHBhaXIgdG8gdGhlIGludmVydGVkIGluZGV4LlxuICogSWYgdGhlIHRva2VuIGFscmVhZHkgZXhpc3QsIHRoZW4gdXBkYXRlIHRoZSB0b2tlbkluZm8uXG4gKlxuICogdG9rZW5JbmZvIGZvcm1hdDogeyByZWY6IDEsIHRmOiAyfVxuICogdG9rZW5JbmZvciBzaG91bGQgY29udGFpbnMgdGhlIGRvY3VtZW50J3MgcmVmIGFuZCB0aGUgdGYodG9rZW4gZnJlcXVlbmN5KSBvZiB0aGF0IHRva2VuIGluXG4gKiB0aGUgZG9jdW1lbnQuXG4gKlxuICogQnkgZGVmYXVsdCB0aGlzIGZ1bmN0aW9uIHN0YXJ0cyBhdCB0aGUgcm9vdCBvZiB0aGUgY3VycmVudCBpbnZlcnRlZCBpbmRleCwgaG93ZXZlclxuICogaXQgY2FuIHN0YXJ0IGF0IGFueSBub2RlIG9mIHRoZSBpbnZlcnRlZCBpbmRleCBpZiByZXF1aXJlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gXG4gKiBAcGFyYW0ge09iamVjdH0gdG9rZW5JbmZvIGZvcm1hdDogeyByZWY6IDEsIHRmOiAyfVxuICogQHBhcmFtIHtPYmplY3R9IHJvb3QgQW4gb3B0aW9uYWwgbm9kZSBhdCB3aGljaCB0byBzdGFydCBsb29raW5nIGZvciB0aGVcbiAqIGNvcnJlY3QgcGxhY2UgdG8gZW50ZXIgdGhlIGRvYywgYnkgZGVmYXVsdCB0aGUgcm9vdCBvZiB0aGlzIGVsYXN0aWNsdW5yLkludmVydGVkSW5kZXhcbiAqIGlzIHVzZWQuXG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS5hZGRUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbiwgdG9rZW5JbmZvLCByb290KSB7XG4gIHZhciByb290ID0gcm9vdCB8fCB0aGlzLnJvb3QsXG4gICAgICBpZHggPSAwO1xuXG4gIHdoaWxlIChpZHggPD0gdG9rZW4ubGVuZ3RoIC0gMSkge1xuICAgIHZhciBrZXkgPSB0b2tlbltpZHhdO1xuXG4gICAgaWYgKCEoa2V5IGluIHJvb3QpKSByb290W2tleV0gPSB7ZG9jczoge30sIGRmOiAwfTtcbiAgICBpZHggKz0gMTtcbiAgICByb290ID0gcm9vdFtrZXldO1xuICB9XG5cbiAgdmFyIGRvY1JlZiA9IHRva2VuSW5mby5yZWY7XG4gIGlmICghcm9vdC5kb2NzW2RvY1JlZl0pIHtcbiAgICAvLyBpZiB0aGlzIGRvYyBub3QgZXhpc3QsIHRoZW4gYWRkIHRoaXMgZG9jXG4gICAgcm9vdC5kb2NzW2RvY1JlZl0gPSB7dGY6IHRva2VuSW5mby50Zn07XG4gICAgcm9vdC5kZiArPSAxO1xuICB9IGVsc2Uge1xuICAgIC8vIGlmIHRoaXMgZG9jIGFscmVhZHkgZXhpc3QsIHRoZW4gdXBkYXRlIHRva2VuSW5mb1xuICAgIHJvb3QuZG9jc1tkb2NSZWZdID0ge3RmOiB0b2tlbkluZm8udGZ9O1xuICB9XG59O1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgdG9rZW4gaXMgaW4gdGhpcyBlbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LlxuICogXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBiZSBjaGVja2VkXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUuaGFzVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBub2RlID0gdGhpcy5yb290O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIW5vZGVbdG9rZW5baV1dKSByZXR1cm4gZmFsc2U7XG4gICAgbm9kZSA9IG5vZGVbdG9rZW5baV1dO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIGEgbm9kZSBmcm9tIHRoZSBpbnZlcnRlZCBpbmRleCBmb3IgYSBnaXZlbiB0b2tlbi5cbiAqIElmIHRva2VuIG5vdCBmb3VuZCBpbiB0aGlzIEludmVydGVkSW5kZXgsIHJldHVybiBudWxsLlxuICogXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBnZXQgdGhlIG5vZGUgZm9yLlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQHNlZSBJbnZlcnRlZEluZGV4LnByb3RvdHlwZS5nZXRcbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLmdldE5vZGUgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XG5cbiAgdmFyIG5vZGUgPSB0aGlzLnJvb3Q7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbi5sZW5ndGg7IGkrKykge1xuICAgIGlmICghbm9kZVt0b2tlbltpXV0pIHJldHVybiBudWxsO1xuICAgIG5vZGUgPSBub2RlW3Rva2VuW2ldXTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgZG9jdW1lbnRzIG9mIGEgZ2l2ZW4gdG9rZW4uXG4gKiBJZiB0b2tlbiBub3QgZm91bmQsIHJldHVybiB7fS5cbiAqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuIFRoZSB0b2tlbiB0byBnZXQgdGhlIGRvY3VtZW50cyBmb3IuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS5nZXREb2NzID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIHZhciBub2RlID0gdGhpcy5nZXROb2RlKHRva2VuKTtcbiAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHJldHVybiBub2RlLmRvY3M7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIHRlcm0gZnJlcXVlbmN5IG9mIGdpdmVuIHRva2VuIGluIGdpdmVuIGRvY1JlZi5cbiAqIElmIHRva2VuIG9yIGRvY1JlZiBub3QgZm91bmQsIHJldHVybiAwLlxuICpcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW4gVGhlIHRva2VuIHRvIGdldCB0aGUgZG9jdW1lbnRzIGZvci5cbiAqIEBwYXJhbSB7U3RyaW5nfEludGVnZXJ9IGRvY1JlZlxuICogQHJldHVybiB7SW50ZWdlcn1cbiAqIEBtZW1iZXJPZiBJbnZlcnRlZEluZGV4XG4gKi9cbmVsYXN0aWNsdW5yLkludmVydGVkSW5kZXgucHJvdG90eXBlLmdldFRlcm1GcmVxdWVuY3kgPSBmdW5jdGlvbiAodG9rZW4sIGRvY1JlZikge1xuICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZSh0b2tlbik7XG5cbiAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKCEoZG9jUmVmIGluIG5vZGUuZG9jcykpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBub2RlLmRvY3NbZG9jUmVmXS50Zjtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGRvY3VtZW50IGZyZXF1ZW5jeSBvZiBnaXZlbiB0b2tlbi5cbiAqIElmIHRva2VuIG5vdCBmb3VuZCwgcmV0dXJuIDAuXG4gKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gZ2V0IHRoZSBkb2N1bWVudHMgZm9yLlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUuZ2V0RG9jRnJlcSA9IGZ1bmN0aW9uICh0b2tlbikge1xuICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZSh0b2tlbik7XG5cbiAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIG5vZGUuZGY7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZG9jdW1lbnQgaWRlbnRpZmllZCBieSBkb2N1bWVudCdzIHJlZiBmcm9tIHRoZSB0b2tlbiBpbiB0aGUgaW52ZXJ0ZWQgaW5kZXguXG4gKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBSZW1vdmUgdGhlIGRvY3VtZW50IGZyb20gd2hpY2ggdG9rZW4uXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmIFRoZSByZWYgb2YgdGhlIGRvY3VtZW50IHRvIHJlbW92ZSBmcm9tIGdpdmVuIHRva2VuLlxuICogQG1lbWJlck9mIEludmVydGVkSW5kZXhcbiAqL1xuZWxhc3RpY2x1bnIuSW52ZXJ0ZWRJbmRleC5wcm90b3R5cGUucmVtb3ZlVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4sIHJlZikge1xuICBpZiAoIXRva2VuKSByZXR1cm47XG4gIHZhciBub2RlID0gdGhpcy5nZXROb2RlKHRva2VuKTtcblxuICBpZiAobm9kZSA9PSBudWxsKSByZXR1cm47XG5cbiAgaWYgKHJlZiBpbiBub2RlLmRvY3MpIHtcbiAgICBkZWxldGUgbm9kZS5kb2NzW3JlZl07XG4gICAgbm9kZS5kZiAtPSAxO1xuICB9XG59O1xuXG4vKipcbiAqIEZpbmQgYWxsIHRoZSBwb3NzaWJsZSBzdWZmaXhlcyBvZiBnaXZlbiB0b2tlbiB1c2luZyB0b2tlbnMgY3VycmVudGx5IGluIHRoZSBpbnZlcnRlZCBpbmRleC5cbiAqIElmIHRva2VuIG5vdCBmb3VuZCwgcmV0dXJuIGVtcHR5IEFycmF5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiBUaGUgdG9rZW4gdG8gZXhwYW5kLlxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS5leHBhbmRUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbiwgbWVtbywgcm9vdCkge1xuICBpZiAodG9rZW4gPT0gbnVsbCB8fCB0b2tlbiA9PSAnJykgcmV0dXJuIFtdO1xuICB2YXIgbWVtbyA9IG1lbW8gfHwgW107XG5cbiAgaWYgKHJvb3QgPT0gdm9pZCAwKSB7XG4gICAgcm9vdCA9IHRoaXMuZ2V0Tm9kZSh0b2tlbik7XG4gICAgaWYgKHJvb3QgPT0gbnVsbCkgcmV0dXJuIG1lbW87XG4gIH1cblxuICBpZiAocm9vdC5kZiA+IDApIG1lbW8ucHVzaCh0b2tlbik7XG5cbiAgZm9yICh2YXIga2V5IGluIHJvb3QpIHtcbiAgICBpZiAoa2V5ID09PSAnZG9jcycpIGNvbnRpbnVlO1xuICAgIGlmIChrZXkgPT09ICdkZicpIGNvbnRpbnVlO1xuICAgIHRoaXMuZXhwYW5kVG9rZW4odG9rZW4gKyBrZXksIG1lbW8sIHJvb3Rba2V5XSk7XG4gIH1cblxuICByZXR1cm4gbWVtbztcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBpbnZlcnRlZCBpbmRleCByZWFkeSBmb3Igc2VyaWFsaXNhdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAbWVtYmVyT2YgSW52ZXJ0ZWRJbmRleFxuICovXG5lbGFzdGljbHVuci5JbnZlcnRlZEluZGV4LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcm9vdDogdGhpcy5yb290XG4gIH07XG59O1xuXG4vKiFcbiAqIGVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb25cbiAqIENvcHlyaWdodCAoQykgMjAxNiBXZWkgU29uZ1xuICovXG4gXG4gLyoqIFxuICAqIGVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24gaXMgdXNlZCB0byBhbmFseXplIHRoZSB1c2VyIHNlYXJjaCBjb25maWd1cmF0aW9uLlxuICAqIFxuICAqIEJ5IGVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24gdXNlciBjb3VsZCBzZXQgcXVlcnktdGltZSBib29zdGluZywgYm9vbGVhbiBtb2RlbCBpbiBlYWNoIGZpZWxkLlxuICAqIFxuICAqIEN1cnJlbnRseSBjb25maWd1cmF0aW9uIHN1cHBvcnRzOlxuICAqIDEuIHF1ZXJ5LXRpbWUgYm9vc3RpbmcsIHVzZXIgY291bGQgc2V0IGhvdyB0byBib29zdCBlYWNoIGZpZWxkLlxuICAqIDIuIGJvb2xlYW4gbW9kZWwgY2hvc2luZywgdXNlciBjb3VsZCBjaG9vc2Ugd2hpY2ggYm9vbGVhbiBtb2RlbCB0byB1c2UgZm9yIGVhY2ggZmllbGQuXG4gICogMy4gdG9rZW4gZXhwYW5kYXRpb24sIHVzZXIgY291bGQgc2V0IHRva2VuIGV4cGFuZCB0byBUcnVlIHRvIGltcHJvdmUgUmVjYWxsLiBEZWZhdWx0IGlzIEZhbHNlLlxuICAqIFxuICAqIFF1ZXJ5IHRpbWUgYm9vc3RpbmcgbXVzdCBiZSBjb25maWd1cmVkIGJ5IGZpZWxkIGNhdGVnb3J5LCBcImJvb2xlYW5cIiBtb2RlbCBjb3VsZCBiZSBjb25maWd1cmVkIFxuICAqIGJ5IGJvdGggZmllbGQgY2F0ZWdvcnkgb3IgZ2xvYmFsbHkgYXMgdGhlIGZvbGxvd2luZyBleGFtcGxlLiBGaWVsZCBjb25maWd1cmF0aW9uIGZvciBcImJvb2xlYW5cIlxuICAqIHdpbGwgb3ZlcndyaXRlIGdsb2JhbCBjb25maWd1cmF0aW9uLlxuICAqIFRva2VuIGV4cGFuZCBjb3VsZCBiZSBjb25maWd1cmVkIGJvdGggYnkgZmllbGQgY2F0ZWdvcnkgb3IgZ29sYmFsbHkuIExvY2FsIGZpZWxkIGNvbmZpZ3VyYXRpb24gd2lsbFxuICAqIG92ZXJ3cml0ZSBnbG9iYWwgY29uZmlndXJhdGlvbi5cbiAgKiBcbiAgKiBjb25maWd1cmF0aW9uIGV4YW1wbGU6XG4gICoge1xuICAqICAgZmllbGRzOnsgXG4gICogICAgIHRpdGxlOiB7Ym9vc3Q6IDJ9LFxuICAqICAgICBib2R5OiB7Ym9vc3Q6IDF9XG4gICogICB9LFxuICAqICAgYm9vbDogXCJPUlwiXG4gICogfVxuICAqIFxuICAqIFwiYm9vbFwiIGZpZWxkIGNvbmZpZ3VhdGlvbiBvdmVyd3JpdGUgZ2xvYmFsIGNvbmZpZ3VhdGlvbiBleGFtcGxlOlxuICAqIHtcbiAgKiAgIGZpZWxkczp7IFxuICAqICAgICB0aXRsZToge2Jvb3N0OiAyLCBib29sOiBcIkFORFwifSxcbiAgKiAgICAgYm9keToge2Jvb3N0OiAxfVxuICAqICAgfSxcbiAgKiAgIGJvb2w6IFwiT1JcIlxuICAqIH1cbiAgKiBcbiAgKiBcImV4cGFuZFwiIGV4YW1wbGU6XG4gICoge1xuICAqICAgZmllbGRzOnsgXG4gICogICAgIHRpdGxlOiB7Ym9vc3Q6IDIsIGJvb2w6IFwiQU5EXCJ9LFxuICAqICAgICBib2R5OiB7Ym9vc3Q6IDF9XG4gICogICB9LFxuICAqICAgYm9vbDogXCJPUlwiLFxuICAqICAgZXhwYW5kOiB0cnVlXG4gICogfVxuICAqIFxuICAqIFwiZXhwYW5kXCIgZXhhbXBsZSBmb3IgZmllbGQgY2F0ZWdvcnk6XG4gICoge1xuICAqICAgZmllbGRzOnsgXG4gICogICAgIHRpdGxlOiB7Ym9vc3Q6IDIsIGJvb2w6IFwiQU5EXCIsIGV4cGFuZDogdHJ1ZX0sXG4gICogICAgIGJvZHk6IHtib29zdDogMX1cbiAgKiAgIH0sXG4gICogICBib29sOiBcIk9SXCJcbiAgKiB9XG4gICogXG4gICogc2V0dGluZyB0aGUgYm9vc3QgdG8gMCBpZ25vcmVzIHRoZSBmaWVsZCAodGhpcyB3aWxsIG9ubHkgc2VhcmNoIHRoZSB0aXRsZSk6XG4gICoge1xuICAqICAgZmllbGRzOntcbiAgKiAgICAgdGl0bGU6IHtib29zdDogMX0sXG4gICogICAgIGJvZHk6IHtib29zdDogMH1cbiAgKiAgIH1cbiAgKiB9XG4gICpcbiAgKiB0aGVuLCB1c2VyIGNvdWxkIHNlYXJjaCB3aXRoIGNvbmZpZ3VyYXRpb24gdG8gZG8gcXVlcnktdGltZSBib29zdGluZy5cbiAgKiBpZHguc2VhcmNoKCdvcmFjbGUgZGF0YWJhc2UnLCB7ZmllbGRzOiB7dGl0bGU6IHtib29zdDogMn0sIGJvZHk6IHtib29zdDogMX19fSk7XG4gICogXG4gICogXG4gICogQGNvbnN0cnVjdG9yXG4gICogXG4gICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZyB1c2VyIGNvbmZpZ3VyYXRpb25cbiAgKiBAcGFyYW0ge0FycmF5fSBmaWVsZHMgZmllbGRzIG9mIGluZGV4IGluc3RhbmNlXG4gICogQG1vZHVsZVxuICAqL1xuZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uIChjb25maWcsIGZpZWxkcykge1xuICB2YXIgY29uZmlnID0gY29uZmlnIHx8ICcnO1xuXG4gIGlmIChmaWVsZHMgPT0gdW5kZWZpbmVkIHx8IGZpZWxkcyA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmaWVsZHMgc2hvdWxkIG5vdCBiZSBudWxsJyk7XG4gIH1cblxuICB0aGlzLmNvbmZpZyA9IHt9O1xuXG4gIHZhciB1c2VyQ29uZmlnO1xuICB0cnkge1xuICAgIHVzZXJDb25maWcgPSBKU09OLnBhcnNlKGNvbmZpZyk7XG4gICAgdGhpcy5idWlsZFVzZXJDb25maWcodXNlckNvbmZpZywgZmllbGRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlbGFzdGljbHVuci51dGlscy53YXJuKCd1c2VyIGNvbmZpZ3VyYXRpb24gcGFyc2UgZmFpbGVkLCB3aWxsIHVzZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24nKTtcbiAgICB0aGlzLmJ1aWxkRGVmYXVsdENvbmZpZyhmaWVsZHMpO1xuICB9XG59O1xuXG4vKipcbiAqIEJ1aWxkIGRlZmF1bHQgc2VhcmNoIGNvbmZpZ3VyYXRpb24uXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkcyBmaWVsZHMgb2YgaW5kZXggaW5zdGFuY2VcbiAqL1xuZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbi5wcm90b3R5cGUuYnVpbGREZWZhdWx0Q29uZmlnID0gZnVuY3Rpb24gKGZpZWxkcykge1xuICB0aGlzLnJlc2V0KCk7XG4gIGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIHRoaXMuY29uZmlnW2ZpZWxkXSA9IHtcbiAgICAgIGJvb3N0OiAxLFxuICAgICAgYm9vbDogXCJPUlwiLFxuICAgICAgZXhwYW5kOiBmYWxzZVxuICAgIH07XG4gIH0sIHRoaXMpO1xufTtcblxuLyoqXG4gKiBCdWlsZCB1c2VyIGNvbmZpZ3VyYXRpb24uXG4gKiBcbiAqIEBwYXJhbSB7SlNPTn0gY29uZmlnIFVzZXIgSlNPTiBjb25maWd1cmF0b2luXG4gKiBAcGFyYW0ge0FycmF5fSBmaWVsZHMgZmllbGRzIG9mIGluZGV4IGluc3RhbmNlXG4gKi9cbmVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24ucHJvdG90eXBlLmJ1aWxkVXNlckNvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcsIGZpZWxkcykge1xuICB2YXIgZ2xvYmFsX2Jvb2wgPSBcIk9SXCI7XG4gIHZhciBnbG9iYWxfZXhwYW5kID0gZmFsc2U7XG5cbiAgdGhpcy5yZXNldCgpO1xuICBpZiAoJ2Jvb2wnIGluIGNvbmZpZykge1xuICAgIGdsb2JhbF9ib29sID0gY29uZmlnWydib29sJ10gfHwgZ2xvYmFsX2Jvb2w7XG4gIH1cblxuICBpZiAoJ2V4cGFuZCcgaW4gY29uZmlnKSB7XG4gICAgZ2xvYmFsX2V4cGFuZCA9IGNvbmZpZ1snZXhwYW5kJ10gfHwgZ2xvYmFsX2V4cGFuZDtcbiAgfVxuXG4gIGlmICgnZmllbGRzJyBpbiBjb25maWcpIHtcbiAgICBmb3IgKHZhciBmaWVsZCBpbiBjb25maWdbJ2ZpZWxkcyddKSB7XG4gICAgICBpZiAoZmllbGRzLmluZGV4T2YoZmllbGQpID4gLTEpIHtcbiAgICAgICAgdmFyIGZpZWxkX2NvbmZpZyA9IGNvbmZpZ1snZmllbGRzJ11bZmllbGRdO1xuICAgICAgICB2YXIgZmllbGRfZXhwYW5kID0gZ2xvYmFsX2V4cGFuZDtcbiAgICAgICAgaWYgKGZpZWxkX2NvbmZpZy5leHBhbmQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZmllbGRfZXhwYW5kID0gZmllbGRfY29uZmlnLmV4cGFuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnW2ZpZWxkXSA9IHtcbiAgICAgICAgICBib29zdDogKGZpZWxkX2NvbmZpZy5ib29zdCB8fCBmaWVsZF9jb25maWcuYm9vc3QgPT09IDApID8gZmllbGRfY29uZmlnLmJvb3N0IDogMSxcbiAgICAgICAgICBib29sOiBmaWVsZF9jb25maWcuYm9vbCB8fCBnbG9iYWxfYm9vbCxcbiAgICAgICAgICBleHBhbmQ6IGZpZWxkX2V4cGFuZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxhc3RpY2x1bnIudXRpbHMud2FybignZmllbGQgbmFtZSBpbiB1c2VyIGNvbmZpZ3VyYXRpb24gbm90IGZvdW5kIGluIGluZGV4IGluc3RhbmNlIGZpZWxkcycpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFkZEFsbEZpZWxkczJVc2VyQ29uZmlnKGdsb2JhbF9ib29sLCBnbG9iYWxfZXhwYW5kLCBmaWVsZHMpO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZCBhbGwgZmllbGRzIHRvIHVzZXIgc2VhcmNoIGNvbmZpZ3VyYXRpb24uXG4gKiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBib29sIEJvb2xlYW4gbW9kZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBhbmQgRXhwYW5kIG1vZGVsXG4gKiBAcGFyYW0ge0FycmF5fSBmaWVsZHMgZmllbGRzIG9mIGluZGV4IGluc3RhbmNlXG4gKi9cbmVsYXN0aWNsdW5yLkNvbmZpZ3VyYXRpb24ucHJvdG90eXBlLmFkZEFsbEZpZWxkczJVc2VyQ29uZmlnID0gZnVuY3Rpb24gKGJvb2wsIGV4cGFuZCwgZmllbGRzKSB7XG4gIGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIHRoaXMuY29uZmlnW2ZpZWxkXSA9IHtcbiAgICAgIGJvb3N0OiAxLFxuICAgICAgYm9vbDogYm9vbCxcbiAgICAgIGV4cGFuZDogZXhwYW5kXG4gICAgfTtcbiAgfSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIGdldCBjdXJyZW50IHVzZXIgY29uZmlndXJhdGlvblxuICovXG5lbGFzdGljbHVuci5Db25maWd1cmF0aW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmNvbmZpZztcbn07XG5cbi8qKlxuICogcmVzZXQgdXNlciBzZWFyY2ggY29uZmlndXJhdGlvbi5cbiAqL1xuZWxhc3RpY2x1bnIuQ29uZmlndXJhdGlvbi5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY29uZmlnID0ge307XG59O1xuLyoqXG4gKiBzb3J0ZWRfc2V0LmpzIGlzIGFkZGVkIG9ubHkgdG8gbWFrZSBlbGFzdGljbHVuci5qcyBjb21wYXRpYmxlIHdpdGggbHVuci1sYW5ndWFnZXMuXG4gKiBpZiBlbGFzdGljbHVuci5qcyBzdXBwb3J0IGRpZmZlcmVudCBsYW5ndWFnZXMgYnkgZGVmYXVsdCwgdGhpcyB3aWxsIG1ha2UgZWxhc3RpY2x1bnIuanNcbiAqIG11Y2ggYmlnZ2VyIHRoYXQgbm90IGdvb2QgZm9yIGJyb3dzZXIgdXNhZ2UuXG4gKlxuICovXG5cblxuLyohXG4gKiBsdW5yLlNvcnRlZFNldFxuICogQ29weXJpZ2h0IChDKSAyMDE2IE9saXZlciBOaWdodGluZ2FsZVxuICovXG5cbi8qKlxuICogbHVuci5Tb3J0ZWRTZXRzIGFyZSB1c2VkIHRvIG1haW50YWluIGFuIGFycmF5IG9mIHVuaXEgdmFsdWVzIGluIGEgc29ydGVkXG4gKiBvcmRlci5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xubHVuci5Tb3J0ZWRTZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMubGVuZ3RoID0gMFxuICB0aGlzLmVsZW1lbnRzID0gW11cbn1cblxuLyoqXG4gKiBMb2FkcyBhIHByZXZpb3VzbHkgc2VyaWFsaXNlZCBzb3J0ZWQgc2V0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHNlcmlhbGlzZWREYXRhIFRoZSBzZXJpYWxpc2VkIHNldCB0byBsb2FkLlxuICogQHJldHVybnMge2x1bnIuU29ydGVkU2V0fVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5sb2FkID0gZnVuY3Rpb24gKHNlcmlhbGlzZWREYXRhKSB7XG4gIHZhciBzZXQgPSBuZXcgdGhpc1xuXG4gIHNldC5lbGVtZW50cyA9IHNlcmlhbGlzZWREYXRhXG4gIHNldC5sZW5ndGggPSBzZXJpYWxpc2VkRGF0YS5sZW5ndGhcblxuICByZXR1cm4gc2V0XG59XG5cbi8qKlxuICogSW5zZXJ0cyBuZXcgaXRlbXMgaW50byB0aGUgc2V0IGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIHRvIG1haW50YWluIHRoZVxuICogb3JkZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFRoZSBvYmplY3RzIHRvIGFkZCB0byB0aGlzIHNldC5cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGksIGVsZW1lbnRcblxuICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZWxlbWVudCA9IGFyZ3VtZW50c1tpXVxuICAgIGlmICh+dGhpcy5pbmRleE9mKGVsZW1lbnQpKSBjb250aW51ZVxuICAgIHRoaXMuZWxlbWVudHMuc3BsaWNlKHRoaXMubG9jYXRpb25Gb3IoZWxlbWVudCksIDAsIGVsZW1lbnQpXG4gIH1cblxuICB0aGlzLmxlbmd0aCA9IHRoaXMuZWxlbWVudHMubGVuZ3RoXG59XG5cbi8qKlxuICogQ29udmVydHMgdGhpcyBzb3J0ZWQgc2V0IGludG8gYW4gYXJyYXkuXG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZWxlbWVudHMuc2xpY2UoKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYXJyYXkgd2l0aCB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24gb24gZXZlcnlcbiAqIGVsZW1lbnQgaW4gdGhpcyBzb3J0ZWQgc2V0LlxuICpcbiAqIERlbGVnYXRlcyB0byBBcnJheS5wcm90b3R5cGUubWFwIGFuZCBoYXMgdGhlIHNhbWUgc2lnbmF0dXJlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlXG4gKiBzZXQuXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4IEFuIG9wdGlvbmFsIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIGFzIHRoZSBjb250ZXh0XG4gKiBmb3IgdGhlIGZ1bmN0aW9uIGZuLlxuICogQHJldHVybnMge0FycmF5fVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKGZuLCBjdHgpIHtcbiAgcmV0dXJuIHRoaXMuZWxlbWVudHMubWFwKGZuLCBjdHgpXG59XG5cbi8qKlxuICogRXhlY3V0ZXMgYSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIHBlciBzb3J0ZWQgc2V0IGVsZW1lbnQuXG4gKlxuICogRGVsZWdhdGVzIHRvIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoIGFuZCBoYXMgdGhlIHNhbWUgc2lnbmF0dXJlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlXG4gKiBzZXQuXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4IEFuIG9wdGlvbmFsIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIGFzIHRoZSBjb250ZXh0XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKiBmb3IgdGhlIGZ1bmN0aW9uIGZuLlxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChmbiwgY3R4KSB7XG4gIHJldHVybiB0aGlzLmVsZW1lbnRzLmZvckVhY2goZm4sIGN0eClcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbmRleCBhdCB3aGljaCBhIGdpdmVuIGVsZW1lbnQgY2FuIGJlIGZvdW5kIGluIHRoZVxuICogc29ydGVkIHNldCwgb3IgLTEgaWYgaXQgaXMgbm90IHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW0gVGhlIG9iamVjdCB0byBsb2NhdGUgaW4gdGhlIHNvcnRlZCBzZXQuXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gIHZhciBzdGFydCA9IDAsXG4gICAgICBlbmQgPSB0aGlzLmVsZW1lbnRzLmxlbmd0aCxcbiAgICAgIHNlY3Rpb25MZW5ndGggPSBlbmQgLSBzdGFydCxcbiAgICAgIHBpdm90ID0gc3RhcnQgKyBNYXRoLmZsb29yKHNlY3Rpb25MZW5ndGggLyAyKSxcbiAgICAgIHBpdm90RWxlbSA9IHRoaXMuZWxlbWVudHNbcGl2b3RdXG5cbiAgd2hpbGUgKHNlY3Rpb25MZW5ndGggPiAxKSB7XG4gICAgaWYgKHBpdm90RWxlbSA9PT0gZWxlbSkgcmV0dXJuIHBpdm90XG5cbiAgICBpZiAocGl2b3RFbGVtIDwgZWxlbSkgc3RhcnQgPSBwaXZvdFxuICAgIGlmIChwaXZvdEVsZW0gPiBlbGVtKSBlbmQgPSBwaXZvdFxuXG4gICAgc2VjdGlvbkxlbmd0aCA9IGVuZCAtIHN0YXJ0XG4gICAgcGl2b3QgPSBzdGFydCArIE1hdGguZmxvb3Ioc2VjdGlvbkxlbmd0aCAvIDIpXG4gICAgcGl2b3RFbGVtID0gdGhpcy5lbGVtZW50c1twaXZvdF1cbiAgfVxuXG4gIGlmIChwaXZvdEVsZW0gPT09IGVsZW0pIHJldHVybiBwaXZvdFxuXG4gIHJldHVybiAtMVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHBvc2l0aW9uIHdpdGhpbiB0aGUgc29ydGVkIHNldCB0aGF0IGFuIGVsZW1lbnQgc2hvdWxkIGJlXG4gKiBpbnNlcnRlZCBhdCB0byBtYWludGFpbiB0aGUgY3VycmVudCBvcmRlciBvZiB0aGUgc2V0LlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IHRoZSBlbGVtZW50IHRvIHNlYXJjaCBmb3IgZG9lcyBub3QgYWxyZWFkeSBleGlzdFxuICogaW4gdGhlIHNvcnRlZCBzZXQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW0gVGhlIGVsZW0gdG8gZmluZCB0aGUgcG9zaXRpb24gZm9yIGluIHRoZSBzZXRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS5sb2NhdGlvbkZvciA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gIHZhciBzdGFydCA9IDAsXG4gICAgICBlbmQgPSB0aGlzLmVsZW1lbnRzLmxlbmd0aCxcbiAgICAgIHNlY3Rpb25MZW5ndGggPSBlbmQgLSBzdGFydCxcbiAgICAgIHBpdm90ID0gc3RhcnQgKyBNYXRoLmZsb29yKHNlY3Rpb25MZW5ndGggLyAyKSxcbiAgICAgIHBpdm90RWxlbSA9IHRoaXMuZWxlbWVudHNbcGl2b3RdXG5cbiAgd2hpbGUgKHNlY3Rpb25MZW5ndGggPiAxKSB7XG4gICAgaWYgKHBpdm90RWxlbSA8IGVsZW0pIHN0YXJ0ID0gcGl2b3RcbiAgICBpZiAocGl2b3RFbGVtID4gZWxlbSkgZW5kID0gcGl2b3RcblxuICAgIHNlY3Rpb25MZW5ndGggPSBlbmQgLSBzdGFydFxuICAgIHBpdm90ID0gc3RhcnQgKyBNYXRoLmZsb29yKHNlY3Rpb25MZW5ndGggLyAyKVxuICAgIHBpdm90RWxlbSA9IHRoaXMuZWxlbWVudHNbcGl2b3RdXG4gIH1cblxuICBpZiAocGl2b3RFbGVtID4gZWxlbSkgcmV0dXJuIHBpdm90XG4gIGlmIChwaXZvdEVsZW0gPCBlbGVtKSByZXR1cm4gcGl2b3QgKyAxXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBsdW5yLlNvcnRlZFNldCB0aGF0IGNvbnRhaW5zIHRoZSBlbGVtZW50cyBpbiB0aGUgaW50ZXJzZWN0aW9uXG4gKiBvZiB0aGlzIHNldCBhbmQgdGhlIHBhc3NlZCBzZXQuXG4gKlxuICogQHBhcmFtIHtsdW5yLlNvcnRlZFNldH0gb3RoZXJTZXQgVGhlIHNldCB0byBpbnRlcnNlY3Qgd2l0aCB0aGlzIHNldC5cbiAqIEByZXR1cm5zIHtsdW5yLlNvcnRlZFNldH1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uIChvdGhlclNldCkge1xuICB2YXIgaW50ZXJzZWN0U2V0ID0gbmV3IGx1bnIuU29ydGVkU2V0LFxuICAgICAgaSA9IDAsIGogPSAwLFxuICAgICAgYV9sZW4gPSB0aGlzLmxlbmd0aCwgYl9sZW4gPSBvdGhlclNldC5sZW5ndGgsXG4gICAgICBhID0gdGhpcy5lbGVtZW50cywgYiA9IG90aGVyU2V0LmVsZW1lbnRzXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBpZiAoaSA+IGFfbGVuIC0gMSB8fCBqID4gYl9sZW4gLSAxKSBicmVha1xuXG4gICAgaWYgKGFbaV0gPT09IGJbal0pIHtcbiAgICAgIGludGVyc2VjdFNldC5hZGQoYVtpXSlcbiAgICAgIGkrKywgaisrXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGlmIChhW2ldIDwgYltqXSkge1xuICAgICAgaSsrXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGlmIChhW2ldID4gYltqXSkge1xuICAgICAgaisrXG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gaW50ZXJzZWN0U2V0XG59XG5cbi8qKlxuICogTWFrZXMgYSBjb3B5IG9mIHRoaXMgc2V0XG4gKlxuICogQHJldHVybnMge2x1bnIuU29ydGVkU2V0fVxuICogQG1lbWJlck9mIFNvcnRlZFNldFxuICovXG5sdW5yLlNvcnRlZFNldC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjbG9uZSA9IG5ldyBsdW5yLlNvcnRlZFNldFxuXG4gIGNsb25lLmVsZW1lbnRzID0gdGhpcy50b0FycmF5KClcbiAgY2xvbmUubGVuZ3RoID0gY2xvbmUuZWxlbWVudHMubGVuZ3RoXG5cbiAgcmV0dXJuIGNsb25lXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBsdW5yLlNvcnRlZFNldCB0aGF0IGNvbnRhaW5zIHRoZSBlbGVtZW50cyBpbiB0aGUgdW5pb25cbiAqIG9mIHRoaXMgc2V0IGFuZCB0aGUgcGFzc2VkIHNldC5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuU29ydGVkU2V0fSBvdGhlclNldCBUaGUgc2V0IHRvIHVuaW9uIHdpdGggdGhpcyBzZXQuXG4gKiBAcmV0dXJucyB7bHVuci5Tb3J0ZWRTZXR9XG4gKiBAbWVtYmVyT2YgU29ydGVkU2V0XG4gKi9cbmx1bnIuU29ydGVkU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uIChvdGhlclNldCkge1xuICB2YXIgbG9uZ1NldCwgc2hvcnRTZXQsIHVuaW9uU2V0XG5cbiAgaWYgKHRoaXMubGVuZ3RoID49IG90aGVyU2V0Lmxlbmd0aCkge1xuICAgIGxvbmdTZXQgPSB0aGlzLCBzaG9ydFNldCA9IG90aGVyU2V0XG4gIH0gZWxzZSB7XG4gICAgbG9uZ1NldCA9IG90aGVyU2V0LCBzaG9ydFNldCA9IHRoaXNcbiAgfVxuXG4gIHVuaW9uU2V0ID0gbG9uZ1NldC5jbG9uZSgpXG5cbiAgZm9yKHZhciBpID0gMCwgc2hvcnRTZXRFbGVtZW50cyA9IHNob3J0U2V0LnRvQXJyYXkoKTsgaSA8IHNob3J0U2V0RWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgIHVuaW9uU2V0LmFkZChzaG9ydFNldEVsZW1lbnRzW2ldKVxuICB9XG5cbiAgcmV0dXJuIHVuaW9uU2V0XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzb3J0ZWQgc2V0IHJlYWR5IGZvciBzZXJpYWxpc2F0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBtZW1iZXJPZiBTb3J0ZWRTZXRcbiAqL1xubHVuci5Tb3J0ZWRTZXQucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudG9BcnJheSgpXG59XG4gIC8qKlxuICAgKiBleHBvcnQgdGhlIG1vZHVsZSB2aWEgQU1ELCBDb21tb25KUyBvciBhcyBhIGJyb3dzZXIgZ2xvYmFsXG4gICAqIEV4cG9ydCBjb2RlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9yZXR1cm5FeHBvcnRzLmpzXG4gICAqL1xuICA7KGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgZGVmaW5lKGZhY3RvcnkpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIC8qKlxuICAgICAgICogTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgICAgKiBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICogbGlrZSBOb2RlLlxuICAgICAgICovXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgICAgcm9vdC5lbGFzdGljbHVuciA9IGZhY3RvcnkoKVxuICAgIH1cbiAgfSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogSnVzdCByZXR1cm4gYSB2YWx1ZSB0byBkZWZpbmUgdGhlIG1vZHVsZSBleHBvcnQuXG4gICAgICogVGhpcyBleGFtcGxlIHJldHVybnMgYW4gb2JqZWN0LCBidXQgdGhlIG1vZHVsZVxuICAgICAqIGNhbiByZXR1cm4gYSBmdW5jdGlvbiBhcyB0aGUgZXhwb3J0ZWQgdmFsdWUuXG4gICAgICovXG4gICAgcmV0dXJuIGVsYXN0aWNsdW5yXG4gIH0pKVxufSkoKTtcbiIsImltcG9ydCB7IGZyb21KU09OU2FmZVRleHQsIHRvSlNPTlNhZmVUZXh0IH0gZnJvbSBcIi4vdXRpbC9qc29uLXRleHQtY29udmVydGVyXCI7XHJcbmltcG9ydCB7IGNvcHlUb0NsaXBib2FyZCB9IGZyb20gXCIuL3V0aWwvY2xpcGJvYXJkXCI7XHJcbmltcG9ydCB7IGFkZEl0ZW1Ub1N0YWNrIH0gZnJvbSBcIi4vZmVhdHVyZXMvc2VhcmNoLXN0YWNrXCI7XHJcbmltcG9ydCB7IExlZnRQYW5lVHlwZSwgd2hpY2hMZWZ0UGFuZUFjdGl2ZSB9IGZyb20gXCIuL2ZlYXR1cmVzL3BhbmUtbWFuYWdlbWVudFwiO1xyXG5pbXBvcnQgeyBhZGRJdGVtVG9EZXNrdG9wIH0gZnJvbSBcIi4vZmVhdHVyZXMvZGVza3RvcFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYXJkSlNPTiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIGNhdGVnb3JpZXM6IHN0cmluZ1tdO1xyXG4gICAgc3ViY2FyZHM6IHN0cmluZ1tdO1xyXG4gICAgY3JlYXRpb25EYXRlOiBEYXRlO1xyXG4gICAgZWRpdERhdGU6IERhdGU7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYXJkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHVuaXF1ZUlEOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIGNhdGVnb3JpZXM6IHN0cmluZ1tdO1xyXG4gICAgc3ViQ2FyZHM6IHN0cmluZ1tdO1xyXG4gICAgY3JlYXRpb25EYXRlOiBEYXRlO1xyXG4gICAgZWRpdERhdGU6IERhdGU7XHJcblxyXG4gICAgbm9kZTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBub2RlRGVza3RvcENvcHk6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgbm9kZUlEOiBzdHJpbmc7XHJcbiAgICBkaXNwbGF5TWV0YURhdGE6IGJvb2xlYW47XHJcbiAgICBhY3RpdmVOYW1lOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgaWQ6IHN0cmluZyA9ICcnKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudW5pcXVlSUQgPSBuYW1lLnJlcGxhY2UoLyAvZywgJy0nKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBmcm9tSlNPTlNhZmVUZXh0KGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZWRpdERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3ViQ2FyZHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5TWV0YURhdGEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlTmFtZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQpO1xyXG4gICAgICAgIHRoaXMubm9kZURlc2t0b3BDb3B5ID0gdGhpcy5jb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQpO1xyXG4gICAgICAgIHRoaXMubm9kZUlEID0gaWQubGVuZ3RoID4gMCA/IGlkIDogdGhpcy51bmlxdWVJRDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3ROb2RlKGlkOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuY29uc3RydWN0Tm9kZUludGVybmFsKGlkKTtcclxuICAgICAgICB0aGlzLm5vZGVEZXNrdG9wQ29weSA9IHRoaXMuY29uc3RydWN0Tm9kZUludGVybmFsKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3ROb2RlSW50ZXJuYWwoaWQ6IHN0cmluZyl7XHJcbiAgICAgICAgLy8gY3JlYXRlIGJhc2Ugbm9kZVxyXG4gICAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb25zdCBuYW1lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb25Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgIG5hbWVOb2RlLmlubmVyVGV4dCA9IHRoaXMubmFtZTtcclxuICAgICAgICBkZXNjcmlwdGlvbk5vZGUuaW5uZXJIVE1MID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgICAgICBub2RlLmFwcGVuZENoaWxkKG5hbWVOb2RlKTtcclxuICAgICAgICBub2RlLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uTm9kZSk7XHJcblxyXG4gICAgICAgIG5hbWVOb2RlLmNsYXNzTmFtZSA9ICdjYXJkLW5hbWUnO1xyXG4gICAgICAgIG5hbWVOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5hY3RpdmVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmKHdoaWNoTGVmdFBhbmVBY3RpdmUoKSA9PT0gTGVmdFBhbmVUeXBlLkRlc2t0b3Ape1xyXG4gICAgICAgICAgICAgICAgYWRkSXRlbVRvRGVza3RvcCh0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkZEl0ZW1Ub1N0YWNrKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBzdWJjYXJkc1xyXG4gICAgICAgIGlmKHRoaXMuc3ViQ2FyZHMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmNhcmROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmNhcmRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNCcpO1xyXG4gICAgICAgICAgICBjb25zdCBzdWJjYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnRTdWJjYXJkTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodFN1YmNhcmRMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHN1YmNhcmRIZWFkZXIuaW5uZXJIVE1MID0gJ1N1YmNhcmRzOidcclxuICAgICAgICAgICAgc3ViY2FyZEhlYWRlci5jbGFzc05hbWUgPSAnY2FyZC1zdWJjYXJkLWhlYWRlcic7XHJcbiAgICAgICAgICAgIHN1YmNhcmRDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdFN1YmNhcmRMaXN0KTtcclxuICAgICAgICAgICAgc3ViY2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodFN1YmNhcmRMaXN0KTtcclxuICAgICAgICAgICAgc3ViY2FyZENvbnRhaW5lci5jbGFzc05hbWUgPSAnY2FyZC1zdWJjYXJkLWNvbnRhaW5lcic7XHJcbiAgICAgICAgICAgIGxlZnRTdWJjYXJkTGlzdC5jbGFzc05hbWUgPSAnY2FyZC1zdWJjYXJkLWxlZnRsaXN0JztcclxuICAgICAgICAgICAgcmlnaHRTdWJjYXJkTGlzdC5jbGFzc05hbWUgPSAnY2FyZC1zdWJjYXJkLXJpZ2h0bGlzdCc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjcmVhdGVTdWJjYXJkSXRlbSA9IChpOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1YmNhcmRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBzdWJjYXJkSXRlbS5pbm5lckhUTUwgPSBgLSAke3RoaXMuc3ViQ2FyZHNbaV19YDtcclxuICAgICAgICAgICAgICAgIHN1YmNhcmRJdGVtLmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtaXRlbSc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3ViY2FyZEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnN1YkNhcmRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGxlZnRTdWJjYXJkTGlzdC5hcHBlbmRDaGlsZChjcmVhdGVTdWJjYXJkSXRlbShpKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBmb3IobGV0IGkgPSAwOyBpIDwgTWF0aC5mbG9vcih0aGlzLnN1YkNhcmRzLmxlbmd0aCAvIDIpOyBpKyspe1xyXG4gICAgICAgICAgICAvLyAgICAgbGVmdFN1YmNhcmRMaXN0LmFwcGVuZENoaWxkKGNyZWF0ZVN1YmNhcmRJdGVtKGkpKVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGZvcihsZXQgaSA9IE1hdGguZmxvb3IodGhpcy5zdWJDYXJkcy5sZW5ndGggLyAyKTsgaSA8IHRoaXMuc3ViQ2FyZHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAvLyAgICAgcmlnaHRTdWJjYXJkTGlzdC5hcHBlbmRDaGlsZChjcmVhdGVTdWJjYXJkSXRlbShpKSlcclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgc3ViY2FyZE5vZGUuYXBwZW5kQ2hpbGQoc3ViY2FyZEhlYWRlcik7XHJcbiAgICAgICAgICAgIHN1YmNhcmROb2RlLmFwcGVuZENoaWxkKHN1YmNhcmRDb250YWluZXIpO1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKHN1YmNhcmROb2RlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZSBzdWJjYXJkcycpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgYnV0dG9uc1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvblJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IGNvcHlKU09OQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgY29weUpTT05CdXR0b24uaW5uZXJUZXh0ID0gJ0NvcHkgSlNPTic7XHJcbiAgICAgICAgY29weUpTT05CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjb3B5VG9DbGlwYm9hcmQodGhpcy50b0pTT04oKSkpO1xyXG4gICAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChjb3B5SlNPTkJ1dHRvbik7XHJcbiAgICAgICAgY29uc3QgY29weVVuaXF1ZUlEQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgY29weVVuaXF1ZUlEQnV0dG9uLmlubmVySFRNTCA9ICdDb3B5IElEJztcclxuICAgICAgICBjb3B5VW5pcXVlSURCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjb3B5VG9DbGlwYm9hcmQodGhpcy51bmlxdWVJRCkpO1xyXG4gICAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChjb3B5VW5pcXVlSURCdXR0b24pXHJcbiAgICAgICAgYnV0dG9uUm93LmNsYXNzTmFtZSA9ICdjYXJkLWJ1dHRvbi1yb3cnO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoYnV0dG9uUm93KTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIGNhdGVnb3J5ICsgbWV0YWRhdGEgcmVuZGVyaW5nXHJcbiAgICAgICAgY29uc3QgbWV0YURpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBtZXRhRGlzcGxheS5jbGFzc05hbWUgPSAnY2FyZC1tZXRhLXJvdyc7XHJcbiAgICAgICAgaWYodGhpcy5kaXNwbGF5TWV0YURhdGEgJiYgdGhpcy5jYXRlZ29yaWVzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBtZXRhRGlzcGxheS5pbm5lckhUTUwgPSB0aGlzLmNhdGVnb3JpZXMubWFwKGNhdCA9PiBgIyR7Y2F0LnJlcGxhY2UoLyAvZywgJy0nKX1gKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQobWV0YURpc3BsYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmluYWxpemUgbm9kZSBjb25zdHJ1Y3Rpb25cclxuICAgICAgICBub2RlLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBpZihpZC5sZW5ndGggPiAwKSBub2RlLmlkID0gaWQ7XHJcbiAgICAgICAgY29uc29sZS5sb2cobm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9IFxyXG5cclxuICAgIGRpc2FibGVOYW1lQWRkaW5nKCl7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVOYW1lID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0ZXMoY3JlYXRpb25EYXRlOiBEYXRlLCBlZGl0RGF0ZTogRGF0ZSl7XHJcbiAgICAgICAgdGhpcy5jcmVhdGlvbkRhdGUgPSBjcmVhdGlvbkRhdGU7XHJcbiAgICAgICAgdGhpcy5lZGl0RGF0ZSA9IGVkaXREYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENhdGVnb3JpZXMoY2F0ZWdvcmllczogc3RyaW5nW10pe1xyXG4gICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XHJcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3ROb2RlKHRoaXMubm9kZUlEKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdWJjYXJkcyhzdWJjYXJkczogc3RyaW5nW10pe1xyXG4gICAgICAgIHRoaXMuc3ViQ2FyZHMgPSBzdWJjYXJkcy5zb3J0KCk7XHJcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3ROb2RlKHRoaXMubm9kZUlEKTtcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKXtcclxuICAgICAgICByZXR1cm4gYHtcclxuICAgIFwibmFtZVwiOiBcIiR7dGhpcy5uYW1lfVwiLFxyXG4gICAgXCJ1bmlxdWVJRFwiOiBcIiR7dGhpcy51bmlxdWVJRH1cIixcclxuICAgIFwiZGVzY3JpcHRpb25cIjogXCIke3RvSlNPTlNhZmVUZXh0KHRoaXMuZGVzY3JpcHRpb24pfVwiLFxyXG5cclxuICAgIFwiY3JlYXRpb25EYXRlXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5jcmVhdGlvbkRhdGUpfSxcclxuICAgIFwiZWRpdERhdGVcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmVkaXREYXRlKX0sXHJcblxyXG4gICAgXCJjYXRlZ29yaWVzXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5jYXRlZ29yaWVzKX0sXHJcbiAgICBcInN1YmNhcmRzXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5zdWJDYXJkcyl9XHJcbn1gO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXROb2RlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREZXNrdG9wTm9kZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVEZXNrdG9wQ29weTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGZyb21KU09OU2FmZVRleHQsIHRvSlNPTlNhZmVUZXh0IH0gZnJvbSBcIi4vdXRpbC9qc29uLXRleHQtY29udmVydGVyXCI7XHJcbmltcG9ydCB7IENhcmQgfSBmcm9tIFwiLi9jYXJkXCI7XHJcbmltcG9ydCB7IGNvcHlUb0NsaXBib2FyZCB9IGZyb20gXCIuL3V0aWwvY2xpcGJvYXJkXCI7XHJcbmltcG9ydCB7IGFkZEl0ZW1Ub1N0YWNrIH0gZnJvbSBcIi4vZmVhdHVyZXMvc2VhcmNoLXN0YWNrXCI7XHJcbmltcG9ydCB7IGFkZEl0ZW1Ub0Rlc2t0b3AgfSBmcm9tIFwiLi9mZWF0dXJlcy9kZXNrdG9wXCI7XHJcbmltcG9ydCB7IHdoaWNoTGVmdFBhbmVBY3RpdmUsIExlZnRQYW5lVHlwZSB9IGZyb20gXCIuL2ZlYXR1cmVzL3BhbmUtbWFuYWdlbWVudFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYXJkR3JvdXBKU09OIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgY2hpbGRyZW5JRHM6IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyZEdyb3VwIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHVuaXF1ZUlEOiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIGNoaWxkcmVuSURzOiBzdHJpbmdbXTtcclxuICAgIGNoaWxkcmVuOiAoQ2FyZEdyb3VwIHwgQ2FyZClbXVxyXG5cclxuICAgIG5vZGU6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgbm9kZURlc2t0b3BDb3B5OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG5vZGVJRDogc3RyaW5nO1xyXG4gICAgYWN0aXZlTmFtZTogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIGlkOiBzdHJpbmcgPSAnJyl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnVuaXF1ZUlEID0gJ1tHXScgKyBuYW1lLnJlcGxhY2UoLyAvZywgJy0nKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBmcm9tSlNPTlNhZmVUZXh0KGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbklEcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3RpdmVOYW1lID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLmNvbnN0cnVjdE5vZGVJbnRlcm5hbChpZCk7XHJcbiAgICAgICAgdGhpcy5ub2RlRGVza3RvcENvcHkgPSB0aGlzLmNvbnN0cnVjdE5vZGVJbnRlcm5hbChpZCk7XHJcbiAgICAgICAgdGhpcy5ub2RlSUQgPSBpZC5sZW5ndGggPiAwID8gaWQgOiB0aGlzLnVuaXF1ZUlEO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNpbWlsYXIgdG8gY2FyZC50cycgY29uc3RydWN0Tm9kZVxyXG4gICAgY29uc3RydWN0Tm9kZShpZDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLmNvbnN0cnVjdE5vZGVJbnRlcm5hbChpZCk7XHJcbiAgICAgICAgdGhpcy5ub2RlRGVza3RvcENvcHkgPSB0aGlzLmNvbnN0cnVjdE5vZGVJbnRlcm5hbChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0Tm9kZUludGVybmFsKGlkOiBzdHJpbmcpe1xyXG4gICAgICAgIC8vIGNyZWF0ZSBiYXNlIG5vZGVcclxuICAgICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgbmFtZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgICAgICBuYW1lTm9kZS5pbm5lclRleHQgPSBgW0ddICR7dGhpcy5uYW1lfWA7XHJcbiAgICAgICAgZGVzY3JpcHRpb25Ob2RlLmlubmVySFRNTCA9IHRoaXMuZGVzY3JpcHRpb247XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChuYW1lTm9kZSk7XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbk5vZGUpO1xyXG5cclxuICAgICAgICBuYW1lTm9kZS5jbGFzc05hbWUgPSAnY2FyZC1ncm91cC1uYW1lJztcclxuICAgICAgICBuYW1lTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYoIXRoaXMuYWN0aXZlTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZih3aGljaExlZnRQYW5lQWN0aXZlKCkgPT09IExlZnRQYW5lVHlwZS5EZXNrdG9wKXtcclxuICAgICAgICAgICAgICAgIGFkZEl0ZW1Ub0Rlc2t0b3AodGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhZGRJdGVtVG9TdGFjayh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgY2hpbGRyZW4gbGlzdFxyXG4gICAgICAgIGNvbnN0IHN1YmNhcmROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3Qgc3ViY2FyZEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g0Jyk7XHJcbiAgICAgICAgY29uc3Qgc3ViY2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHN1YmNhcmRDb250YWluZXIuY2xhc3NOYW1lID0gJ2NhcmQtZ3JvdXAtc3ViY2FyZC1jb250YWluZXInO1xyXG4gICAgICAgIHN1YmNhcmRIZWFkZXIuaW5uZXJIVE1MID0gJ0NoaWxkcmVuOidcclxuICAgICAgICBzdWJjYXJkSGVhZGVyLmNsYXNzTmFtZSA9ICdjYXJkLWdyb3VwLXN1YmNhcmQtaGVhZGVyJztcclxuICAgICAgICBzdWJjYXJkTm9kZS5hcHBlbmRDaGlsZChzdWJjYXJkSGVhZGVyKTtcclxuICAgICAgICBzdWJjYXJkTm9kZS5hcHBlbmRDaGlsZChzdWJjYXJkQ29udGFpbmVyKTtcclxuICAgICAgICBub2RlLmFwcGVuZENoaWxkKHN1YmNhcmROb2RlKTtcclxuXHJcbiAgICAgICAgY29uc3QgY3JlYXRlU3ViY2FyZEl0ZW0gPSAoaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmNhcmRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHN1YmNhcmRJdGVtLmlubmVySFRNTCA9IGAtICR7dGhpcy5jaGlsZHJlbklEc1tpXX1gO1xyXG4gICAgICAgICAgICBzdWJjYXJkSXRlbS5jbGFzc05hbWUgPSAnY2FyZC1ncm91cC1zdWJjYXJkLWl0ZW0nO1xyXG4gICAgICAgICAgICByZXR1cm4gc3ViY2FyZEl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuSURzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgc3ViY2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChjcmVhdGVTdWJjYXJkSXRlbShpKSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFkZCBidXR0b25zXHJcbiAgICAgICAgY29uc3QgYnV0dG9uUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgY29weUpTT05CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjb3B5SlNPTkJ1dHRvbi5pbm5lclRleHQgPSAnQ29weSBKU09OJztcclxuICAgICAgICBjb3B5SlNPTkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNvcHlUb0NsaXBib2FyZCh0aGlzLnRvSlNPTigpKSk7XHJcbiAgICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGNvcHlKU09OQnV0dG9uKTtcclxuICAgICAgICBjb25zdCBjb3B5VW5pcXVlSURCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjb3B5VW5pcXVlSURCdXR0b24uaW5uZXJIVE1MID0gJ0NvcHkgSUQnO1xyXG4gICAgICAgIGNvcHlVbmlxdWVJREJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNvcHlUb0NsaXBib2FyZCh0aGlzLnVuaXF1ZUlEKSk7XHJcbiAgICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKGNvcHlVbmlxdWVJREJ1dHRvbilcclxuICAgICAgICBidXR0b25Sb3cuY2xhc3NOYW1lID0gJ2NhcmQtYnV0dG9uLXJvdyc7XHJcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChidXR0b25Sb3cpO1xyXG5cclxuICAgICAgICAvLyBmaW5hbGl6ZSBub2RlIGNvbnN0cnVjdGlvblxyXG4gICAgICAgIG5vZGUuY2xhc3NOYW1lID0gJ2NhcmQtZ3JvdXAnO1xyXG4gICAgICAgIGlmKGlkLmxlbmd0aCA+IDApIG5vZGUuaWQgPSBpZDtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNhYmxlTmFtZUFkZGluZygpe1xyXG4gICAgICAgIHRoaXMuYWN0aXZlTmFtZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENoaWxkcmVuSURzKGNoaWxkcmVuSURzOiBzdHJpbmdbXSl7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbklEcyA9IGNoaWxkcmVuSURzLnNvcnQoKTtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdE5vZGUodGhpcy5ub2RlSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpe1xyXG4gICAgICAgIHJldHVybiBge1xyXG4gICAgXCJuYW1lXCI6IFwiJHt0aGlzLm5hbWV9XCIsXHJcbiAgICBcInVuaXF1ZUlEXCI6IFwiJHt0aGlzLnVuaXF1ZUlEfVwiLFxyXG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIiR7dG9KU09OU2FmZVRleHQodGhpcy5kZXNjcmlwdGlvbil9XCIsXHJcbiAgICBcImNoaWxkcmVuSURzXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5jaGlsZHJlbklEcyl9XHJcbn1gO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2t0b3BOb2RlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZURlc2t0b3BDb3B5O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgZnJvbUpTT05TYWZlVGV4dCB9IGZyb20gXCIuLi91dGlsL2pzb24tdGV4dC1jb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCI7XHJcbmltcG9ydCB7IGNvcHlUb0NsaXBib2FyZCwgY29weUZyb21DbGlwYm9hcmQgfSBmcm9tIFwiLi4vdXRpbC9jbGlwYm9hcmRcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0Q2FyZEF1dGhvcmluZyA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGNhcmROYW1lSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1uYW1lLWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IGNhcmREZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZGVzY3JpcHRpb24taW5wdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZERlc2NyaXB0aW9uT3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZGVzY3JpcHRpb24tb3V0cHV0JykgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuICAgIGNvbnN0IHByZXZpZXdDYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtcHJldmlldy1jb250YWluZXInKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGNhcmRDYXRlZ29yeUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtY2F0ZWdvcnktaW5wdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZFN1YmNhcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLXN1YmNhcmQtaW5wdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG5cclxuICAgIC8vIG1ldGEgdmFyaWFibGVzIHdob3NlIHN0YXRlIGlzIG5vdCBjYXJyaWVkIGluIGlubmVySFRNTFxyXG4gICAgbGV0IGNyZWF0aW9uRGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuYW1lID0gY2FyZE5hbWVJbnB1dC52YWx1ZTtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNhcmREZXNjcmlwdGlvbklucHV0LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHByZXZpZXdDYXJkID0gbmV3IENhcmQobmFtZSwgZGVzY3JpcHRpb24sICdwcmV2aWV3LWNhcmQnKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZC5zZXREYXRlcyhjcmVhdGlvbkRhdGUsIG5ldyBEYXRlKCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkLnNldENhdGVnb3JpZXMoY2FyZENhdGVnb3J5SW5wdXQudmFsdWUuc3BsaXQoJywnKS5tYXAobmFtZSA9PiBuYW1lLnRyaW0oKSkuZmlsdGVyKG5hbWUgPT4gbmFtZS5sZW5ndGggPiAwKSk7XHJcbiAgICAgICAgcHJldmlld0NhcmQuc2V0U3ViY2FyZHMoY2FyZFN1YmNhcmRJbnB1dC52YWx1ZS5zcGxpdCgnXFxuJykubWFwKG5hbWUgPT4gbmFtZS50cmltKCkpLmZpbHRlcihuYW1lID0+IG5hbWUubGVuZ3RoID4gMCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkLmRpc2FibGVOYW1lQWRkaW5nKCk7XHJcbiAgICAgICAgY2FyZERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlID0gcHJldmlld0NhcmQudG9KU09OKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHByZXZpZXdDYXJkTm9kZSA9IHByZXZpZXdDYXJkLmdldE5vZGUoKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZENvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2gobm9kZSA9PiBub2RlLnJlbW92ZSgpKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2aWV3Q2FyZE5vZGUpO1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKHdpbmRvdy5NYXRoSmF4KSBNYXRoSmF4LnR5cGVzZXQoW3ByZXZpZXdDYXJkTm9kZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlID0gKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UoY2FyZERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlKTtcclxuICAgICAgICAgICAgY29uc3QgaGFzTmFtZSA9IG9iamVjdC5uYW1lICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5uYW1lID09ICdzdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNEZXNjcmlwdGlvbiA9IG9iamVjdC5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3QuZGVzY3JpcHRpb24gPT0gJ3N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0NyZWF0aW9uRGF0ZSA9IG9iamVjdC5jcmVhdGlvbkRhdGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0LmNyZWF0aW9uRGF0ZSA9PSAnc3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3QgaGFzQ2F0ZWdvcmllcyA9IG9iamVjdC5jYXRlZ29yaWVzICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5jYXRlZ29yaWVzID09ICdvYmplY3QnO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNTdWJjYXJkcyA9IG9iamVjdC5zdWJjYXJkcyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3Quc3ViY2FyZHMgPT0gJ29iamVjdCc7XHJcblxyXG4gICAgICAgICAgICBpZihcclxuICAgICAgICAgICAgICAgIGhhc05hbWUgJiYgaGFzRGVzY3JpcHRpb24gJiYgaGFzQ3JlYXRpb25EYXRlICYmXHJcbiAgICAgICAgICAgICAgICBoYXNDYXRlZ29yaWVzICYmIGhhc1N1YmNhcmRzXHJcbiAgICAgICAgICAgICl7XHJcbiAgICAgICAgICAgICAgICBjYXJkTmFtZUlucHV0LnZhbHVlID0gb2JqZWN0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBjYXJkRGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9IGZyb21KU09OU2FmZVRleHQob2JqZWN0LmRlc2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNyZWF0aW9uRGF0ZSA9IG5ldyBEYXRlKG9iamVjdC5jcmVhdGlvbkRhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhcmRDYXRlZ29yeUlucHV0LnZhbHVlID0gb2JqZWN0LmNhdGVnb3JpZXMuam9pbignLCAnKTtcclxuICAgICAgICAgICAgICAgIGNhcmRTdWJjYXJkSW5wdXQudmFsdWUgPSBvYmplY3Quc3ViY2FyZHMuam9pbignXFxuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgY2FyZE5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUpO1xyXG4gICAgY2FyZERlc2NyaXB0aW9uSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuICAgIGNhcmREZXNjcmlwdGlvbk91dHB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlKTtcclxuICAgIGNhcmRDYXRlZ29yeUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcbiAgICBjYXJkU3ViY2FyZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcblxyXG4gICAgY29uc3QgY29weUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWF1dGhvcmluZy1jb3B5LWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgcGFzdGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1hdXRob3JpbmctcGFzdGUtYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBjbGVhckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWF1dGhvcmluZy1jbGVhci1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIFxyXG4gICAgY29weUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb3B5VG9DbGlwYm9hcmQoY2FyZERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlKTtcclxuICAgIH0pO1xyXG4gICAgcGFzdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY29weUZyb21DbGlwYm9hcmQoKS50aGVuKHRleHQgPT4ge1xyXG4gICAgICAgICAgICBjYXJkRGVzY3JpcHRpb25PdXRwdXQudmFsdWUgPSB0ZXh0O1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbk91dHB1dFVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIGNsZWFyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNhcmROYW1lSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICBjYXJkRGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGNyZWF0aW9uRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY2FyZENhdGVnb3J5SW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICBjYXJkU3ViY2FyZElucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG59XHJcbiIsImltcG9ydCB7IGZyb21KU09OU2FmZVRleHQgfSBmcm9tIFwiLi4vdXRpbC9qc29uLXRleHQtY29udmVydGVyXCI7XHJcbmltcG9ydCB7IENhcmQgfSBmcm9tIFwiLi4vY2FyZFwiO1xyXG5pbXBvcnQgeyBDYXJkR3JvdXAgfSBmcm9tIFwiLi4vY2FyZGdyb3VwXCI7XHJcbmltcG9ydCB7IGNvcHlUb0NsaXBib2FyZCwgY29weUZyb21DbGlwYm9hcmQgfSBmcm9tIFwiLi4vdXRpbC9jbGlwYm9hcmRcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0Q2FyZEdyb3VwQXV0aG9yaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgY2FyZEdyb3VwTmFtZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtbmFtZS1pbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBjb25zdCBjYXJkR3JvdXBEZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtZGVzY3JpcHRpb24taW5wdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZEdyb3VwRGVzY3JpcHRpb25PdXRwdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1ncm91cC1kZXNjcmlwdGlvbi1vdXRwdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgY29uc3QgcHJldmlld0NhcmRHcm91cENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWdyb3VwLXByZXZpZXctY29udGFpbmVyJykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBjYXJkR3JvdXBDaGlsZHJlbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtY2F0ZWdvcnktaW5wdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG5cclxuICAgIC8vIG1ldGEgdmFyaWFibGVzIHdob3NlIHN0YXRlIGlzIG5vdCBjYXJyaWVkIGluIGlubmVySFRNTFxyXG4gICAgbGV0IGNyZWF0aW9uRGF0ZT0gbmV3IERhdGUoKTtcclxuXHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0VXBkYXRlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjYXJkR3JvdXBOYW1lSW5wdXQudmFsdWU7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBjYXJkR3JvdXBEZXNjcmlwdGlvbklucHV0LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHByZXZpZXdDYXJkR3JvdXAgPSBuZXcgQ2FyZEdyb3VwKG5hbWUsIGRlc2NyaXB0aW9uLCAncHJldmlldy1jYXJkJyk7XHJcbiAgICAgICAgcHJldmlld0NhcmRHcm91cC5zZXRDaGlsZHJlbklEcyhjYXJkR3JvdXBDaGlsZHJlbklucHV0LnZhbHVlLnNwbGl0KCdcXG4nKS5tYXAobmFtZSA9PiBuYW1lLnRyaW0oKSkuZmlsdGVyKG5hbWUgPT4gbmFtZS5sZW5ndGggPiAwKSk7XHJcbiAgICAgICAgcHJldmlld0NhcmRHcm91cC5kaXNhYmxlTmFtZUFkZGluZygpO1xyXG4gICAgICAgIGNhcmRHcm91cERlc2NyaXB0aW9uT3V0cHV0LnZhbHVlID0gcHJldmlld0NhcmRHcm91cC50b0pTT04oKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJldmlld0NhcmRHcm91cE5vZGUgPSBwcmV2aWV3Q2FyZEdyb3VwLmdldE5vZGUoKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZEdyb3VwQ29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaChub2RlID0+IG5vZGUucmVtb3ZlKCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkR3JvdXBDb250YWluZXIuYXBwZW5kQ2hpbGQocHJldmlld0NhcmRHcm91cE5vZGUpO1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKHdpbmRvdy5NYXRoSmF4KSBNYXRoSmF4LnR5cGVzZXQoW3ByZXZpZXdDYXJkR3JvdXBOb2RlXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVzY3JpcHRpb25PdXRwdXRVcGRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0gSlNPTi5wYXJzZShjYXJkR3JvdXBEZXNjcmlwdGlvbk91dHB1dC52YWx1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc05hbWUgPSBvYmplY3QubmFtZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3QubmFtZSA9PSAnc3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3QgaGFzRGVzY3JpcHRpb24gPSBvYmplY3QuZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0LmRlc2NyaXB0aW9uID09ICdzdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNDaGlsZHJlbklEcyA9IG9iamVjdC5jaGlsZHJlbklEcyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3QuY2hpbGRyZW5JRHMgPT0gJ29iamVjdCc7XHJcblxyXG4gICAgICAgICAgICBpZihcclxuICAgICAgICAgICAgICAgIGhhc05hbWUgJiYgaGFzRGVzY3JpcHRpb24gJiYgaGFzQ2hpbGRyZW5JRHNcclxuICAgICAgICAgICAgKXtcclxuICAgICAgICAgICAgICAgIGNhcmRHcm91cE5hbWVJbnB1dC52YWx1ZSA9IG9iamVjdC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgY2FyZEdyb3VwRGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9IGZyb21KU09OU2FmZVRleHQob2JqZWN0LmRlc2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNhcmRHcm91cENoaWxkcmVuSW5wdXQudmFsdWUgPSBvYmplY3QuY2hpbGRyZW5JRHMuam9pbignXFxuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgY2FyZEdyb3VwTmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcbiAgICBjYXJkR3JvdXBEZXNjcmlwdGlvbklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcbiAgICBjYXJkR3JvdXBEZXNjcmlwdGlvbk91dHB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlKTtcclxuICAgIGNhcmRHcm91cENoaWxkcmVuSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuXHJcbiAgICBjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtYXV0aG9yaW5nLWNvcHktYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBwYXN0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWdyb3VwLWF1dGhvcmluZy1wYXN0ZS1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtZ3JvdXAtYXV0aG9yaW5nLWNsZWFyLWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgXHJcbiAgICBjb3B5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvcHlUb0NsaXBib2FyZChjYXJkR3JvdXBEZXNjcmlwdGlvbk91dHB1dC52YWx1ZSk7XHJcbiAgICB9KTtcclxuICAgIHBhc3RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvcHlGcm9tQ2xpcGJvYXJkKCkudGhlbih0ZXh0ID0+IHtcclxuICAgICAgICAgICAgY2FyZEdyb3VwRGVzY3JpcHRpb25PdXRwdXQudmFsdWUgPSB0ZXh0O1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbk91dHB1dFVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIGNsZWFyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNhcmRHcm91cE5hbWVJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGNhcmRHcm91cERlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICBjYXJkR3JvdXBDaGlsZHJlbklucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSgpO1xyXG59IiwiaW1wb3J0IHsgZG93bmxvYWRGaWxlIH0gZnJvbSBcIi4uL3V0aWwvZG93bmxvYWRcIjtcclxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCI7XHJcbmltcG9ydCB7IENhcmRHcm91cCB9IGZyb20gXCIuLi9jYXJkZ3JvdXBcIjtcclxuaW1wb3J0IHsgZ2V0SEhNTSwgZ2V0TU1ERFlZWVkgfSBmcm9tIFwiLi4vdXRpbC9kYXRlXCI7XHJcblxyXG5sZXQgc2VsZWN0ZWRTbG90OiBIVE1MRGl2RWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG5sZXQgc2xvdE5vZGVzIDogSFRNTERpdkVsZW1lbnRbXSA9IFtdO1xyXG5cclxuZXhwb3J0IHR5cGUgRGVza3RvcEV4cG9ydEpTT04gPSB7XHJcbiAgICBjb2x1bW5zOiBudW1iZXIsXHJcbiAgICBzbG90czogbnVtYmVyLFxyXG4gICAgZGF0YTogKHN0cmluZyB8IG51bGwpW11cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0RGVza3RvcCA9IChjYXJkczogQ2FyZFtdLCBjYXJkR3JvdXBzOiBDYXJkR3JvdXBbXSkgPT4ge1xyXG4gICAgY29uc3QgZGVza3RvcFN1cmZhY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVza3RvcC1jb250YWluZXInKSBhcyBIVE1MRWxlbWVudDtcclxuICAgIGNvbnN0IGNvbWJpbmVkSXRlbXM6IChDYXJkIHwgQ2FyZEdyb3VwKVtdID0gWy4uLmNhcmRzLCAuLi5jYXJkR3JvdXBzXTtcclxuXHJcbiAgICAvLyBjcmVhdGUgaW50ZXJhY3RpdmUgc3VyZmFjZVxyXG4gICAgbGV0IGNvbHVtbnMgPSAyO1xyXG4gICAgbGV0IHNsb3RzID0gNTA7XHJcblxyXG4gICAgY29uc3QgY2xpY2tPblNsb3QgPSAoc2xvdDogSFRNTERpdkVsZW1lbnQpID0+IHtcclxuICAgICAgICAvLyBkZWFjdGl2YXRlIHNsb3QgaWYgY2FyZC9jYXJkZ3JvdXAgaXMgYWxyZWFkeSBpbnNpZGUgc2xvdFxyXG4gICAgICAgIGlmKHNsb3QuY2hpbGRyZW4ubGVuZ3RoID4gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgYm9yZGVyIHNlbGVjdGlvbiB2aXN1YWxcclxuICAgICAgICBzbG90Tm9kZXMuZm9yRWFjaChzbG90ID0+IHtcclxuICAgICAgICAgICAgc2xvdC5zdHlsZS5ib3JkZXIgPSAnMXB4IGxpZ2h0Z3JheSc7XHJcbiAgICAgICAgICAgIHNsb3Quc3R5bGUuYm9yZGVyU3R5bGUgPSAnZGFzaGVkJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYoc2VsZWN0ZWRTbG90ICE9PSBzbG90KXtcclxuICAgICAgICAgICAgc2VsZWN0ZWRTbG90ID0gc2xvdDtcclxuICAgICAgICAgICAgc2VsZWN0ZWRTbG90LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgYmxhY2snO1xyXG4gICAgICAgICAgICBzZWxlY3RlZFNsb3Quc3R5bGUuYm9yZGVyU3R5bGUgPSAnc29saWQnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkU2xvdCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBoYW5kbGUgZHluYW1pYyBjdXJzb3Igb3ZlclxyXG4gICAgICAgIHNsb3ROb2Rlcy5mb3JFYWNoKHNsb3QgPT4ge1xyXG4gICAgICAgICAgICBpZihzbG90LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICBzbG90LnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNsb3Quc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29uc3RydWN0U3VyZmFjZSA9IChzbG90c1RvTG9hZD86IChzdHJpbmcgfCBudWxsKVtdKSA9PiB7XHJcbiAgICAgICAgZGVza3RvcFN1cmZhY2UuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgc2xvdE5vZGVzID0gW107XHJcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgeCA9IDA7IHggPCBzbG90czsgeCsrKXtcclxuICAgICAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHJvdy5jbGFzc05hbWUgPSBgZGVza3RvcC1yb3dgO1xyXG5cclxuICAgICAgICAgICAgZm9yKGxldCB5ID0gMDsgeSA8IGNvbHVtbnM7IHkrKyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzbG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBzbG90LmNsYXNzTmFtZSA9IGBkZXNrdG9wLXNsb3Qke3kgIT09IDAgPyAnIGRlc2t0b3AtbWFyZ2luLWxlZnQnIDogJyd9YDtcclxuXHJcbiAgICAgICAgICAgICAgICBzbG90LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrT25TbG90KHNsb3QpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcm93LmFwcGVuZChzbG90KTtcclxuICAgICAgICAgICAgICAgIHNsb3ROb2Rlcy5wdXNoKHNsb3QpO1xyXG4gICAgICAgICAgICAgICAgY291bnRlciArPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkZXNrdG9wU3VyZmFjZS5hcHBlbmQocm93KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGxvYWRpbmcgaW4gc2xvdHMgZnJvbSBqc29uIGltcG9ydFxyXG4gICAgICAgIGlmKCFzbG90c1RvTG9hZCkgcmV0dXJuO1xyXG4gICAgICAgIGNvdW50ZXIgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgeCA9IDA7IHggPCBzbG90czsgeCsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCB5ID0gMDsgeSA8IGNvbHVtbnM7IHkrKyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkZWRJRCA9IHNsb3RzVG9Mb2FkW2NvdW50ZXJdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNsb3QgPSBzbG90Tm9kZXNbY291bnRlcl07XHJcbiAgICAgICAgICAgICAgICBpZihsb2FkZWRJRCAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGNvbWJpbmVkSXRlbXMuZmluZChpdGVtID0+IGl0ZW0udW5pcXVlSUQgPT09IGxvYWRlZElEKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFNsb3QgPSBjdXJyZW50U2xvdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkSXRlbVRvRGVza3RvcChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0ZWRTbG90ID0gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdFN1cmZhY2UoKTtcclxuXHJcbiAgICAvLyBoYW5kbGUgdG9wIGJhciBidXR0b25zXHJcbiAgICBjb25zdCBjbGVhckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNrdG9wLWNsZWFyLWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgaW1wb3J0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2t0b3AtaW1wb3J0LWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgaW1wb3J0RmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2t0b3AtaW1wb3J0LWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgY29uc3QgZXhwb3J0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2t0b3AtZXhwb3J0LWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIGNsZWFyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHNsb3ROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICBub2RlLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgICAgICBub2RlLnN0eWxlLmJvcmRlciA9ICcxcHggbGlnaHRncmF5JztcclxuICAgICAgICAgICAgbm9kZS5zdHlsZS5ib3JkZXJTdHlsZSA9ICdkYXNoZWQnO1xyXG4gICAgICAgICAgICBub2RlLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxlY3RlZFNsb3QgPSBudWxsO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaW1wb3J0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gaW1wb3J0RmlsZUlucHV0LmNsaWNrKCkpO1xyXG4gICAgaW1wb3J0RmlsZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jICgpID0+IHtcclxuICAgICAgICBjb25zdCBmaWxlczogRmlsZUxpc3QgfCBudWxsID0gaW1wb3J0RmlsZUlucHV0LmZpbGVzO1xyXG4gICAgICAgIGlmKCFmaWxlcykgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGZpbGVEYXRhID0gYXdhaXQgZmlsZXNbMF0udGV4dCgpO1xyXG4gICAgICAgIGNvbnN0IGltcG9ydERhdGEgOiBEZXNrdG9wRXhwb3J0SlNPTiA9IEpTT04ucGFyc2UoZmlsZURhdGEpO1xyXG4gICAgICAgIGNvbHVtbnMgPSBpbXBvcnREYXRhLmNvbHVtbnM7XHJcbiAgICAgICAgc2xvdHMgPSBpbXBvcnREYXRhLnNsb3RzO1xyXG4gICAgICAgIGNvbnN0cnVjdFN1cmZhY2UoaW1wb3J0RGF0YS5kYXRhKTtcclxuICAgICAgICBpbXBvcnRGaWxlSW5wdXQudmFsdWUgPSAnJztcclxuICAgIH0pO1xyXG4gICAgZXhwb3J0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV4cG9ydERhdGEgOiBEZXNrdG9wRXhwb3J0SlNPTiA9IHtcclxuICAgICAgICAgICAgY29sdW1uczogY29sdW1ucyxcclxuICAgICAgICAgICAgc2xvdHM6IHNsb3RzLFxyXG4gICAgICAgICAgICBkYXRhOiBzbG90Tm9kZXMubWFwKHNsb3QgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoc2xvdC5jaGlsZHJlbi5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2xvdC5jaGlsZHJlblswXS5pZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRvd25sb2FkRmlsZShgZGVza3RvcC0ke2dldEhITU0oKX0tJHtnZXRNTUREWVlZWSgpfS5qc29uYCwgSlNPTi5zdHJpbmdpZnkoZXhwb3J0RGF0YSwgbnVsbCwgNCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhZGRJdGVtVG9EZXNrdG9wID0gKGl0ZW0gOiBDYXJkIHwgQ2FyZEdyb3VwKSA9PiB7XHJcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGl0ZW0uZ2V0RGVza3RvcE5vZGUoKTtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGlmICh3aW5kb3cuTWF0aEpheCkgTWF0aEpheC50eXBlc2V0KFtjdXJyZW50Tm9kZV0pO1xyXG4gICAgaWYoIXNlbGVjdGVkU2xvdCkgcmV0dXJuO1xyXG4gICAgaWYoc2VsZWN0ZWRTbG90LmNoaWxkcmVuLmxlbmd0aCA+IDApIHJldHVybjsgLy8gZG9uJ3QgcmVwbGFjZSBhIGNhcmQgdGhhdCdzIGFscmVhZHkgaW4gdGhlcmVcclxuICAgIHNlbGVjdGVkU2xvdC5hcHBlbmRDaGlsZChjdXJyZW50Tm9kZSk7XHJcblxyXG4gICAgc2VsZWN0ZWRTbG90LnN0eWxlLmJvcmRlciA9ICcxcHggbGlnaHRncmF5JztcclxuICAgIHNlbGVjdGVkU2xvdC5zdHlsZS5ib3JkZXJTdHlsZSA9ICdkYXNoZWQnO1xyXG4gICAgc2VsZWN0ZWRTbG90LnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcclxuICAgIHNlbGVjdGVkU2xvdCA9IG51bGw7XHJcbn0iLCJpbXBvcnQgeyBDYXJkIH0gZnJvbSBcIi4uL2NhcmRcIjtcclxuaW1wb3J0IHsgQ2FyZEdyb3VwIH0gZnJvbSBcIi4uL2NhcmRncm91cFwiO1xyXG5pbXBvcnQgeyBhZGRJdGVtVG9EZXNrdG9wIH0gZnJvbSBcIi4vZGVza3RvcFwiO1xyXG5pbXBvcnQgeyB3aGljaExlZnRQYW5lQWN0aXZlLCBMZWZ0UGFuZVR5cGUgfSBmcm9tIFwiLi9wYW5lLW1hbmFnZW1lbnRcIjtcclxuaW1wb3J0IHsgYWRkSXRlbVRvU3RhY2sgfSBmcm9tIFwiLi9zZWFyY2gtc3RhY2tcIjtcclxuXHJcbmV4cG9ydCB0eXBlIEhpZXJhcmNoeUludGVybmFsSXRlbSA9IHtcclxuICAgIHVuaXF1ZUlEOiBzdHJpbmcsXHJcbiAgICBkZXB0aDogbnVtYmVyLFxyXG4gICAgZW1wdHlDaGlsZDogSFRNTEVsZW1lbnRcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRIaWVyYXJjaHkgPSAoY2FyZHM6IENhcmRbXSwgY2FyZEdyb3VwczogQ2FyZEdyb3VwW10pID0+IHtcclxuICAgIGNvbnN0IGhpZXJhcmNoeVJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGllcmFyY2h5LXJvb3QnKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpZXJhcmNoeS1lbXB0eScpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3Qgcm9vdEdyb3VwcyA9IGNhcmRHcm91cHMuZmlsdGVyKGdyb3VwID0+IGNhcmRHcm91cHMuZXZlcnkob3RoZXJHcm91cCA9PiB7XHJcbiAgICAgICAgY29uc3QgdGhpc0lEID0gZ3JvdXAudW5pcXVlSUQ7XHJcbiAgICAgICAgaWYodGhpc0lEID09PSBvdGhlckdyb3VwLnVuaXF1ZUlEKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBlbHNlIHJldHVybiBvdGhlckdyb3VwLmNoaWxkcmVuSURzLmV2ZXJ5KGNoaWxkSUQgPT4gY2hpbGRJRCAhPT0gdGhpc0lEKTtcclxuICAgIH0pKTtcclxuICAgIGNvbnN0IHJvb3RDYXJkcyA9IGNhcmRzLmZpbHRlcihjYXJkID0+IFxyXG4gICAgICAgIGNhcmRHcm91cHMuZXZlcnkoZ3JvdXAgPT4gXHJcbiAgICAgICAgICAgIGdyb3VwLmNoaWxkcmVuSURzLmV2ZXJ5KGNoaWxkSUQgPT4gY2FyZC51bmlxdWVJRCAhPSBjaGlsZElEKSkpO1xyXG4gICAgY29uc3QgY29tYmluZWRJdGVtczogKENhcmQgfCBDYXJkR3JvdXApW10gPSBbLi4uY2FyZHMsIC4uLmNhcmRHcm91cHNdO1xyXG4gICAgY29uc3QgaGllcmFyY2h5TWFuYWdlciA9IG5ldyBNYXA8c3RyaW5nLCBIaWVyYXJjaHlJbnRlcm5hbEl0ZW0+KCk7XHJcblxyXG4gICAgY29uc3QgY3JlYXRlSGllcmFyY2h5SXRlbSA9IChpZDogc3RyaW5nLCBpbnNlcnRBZnRlcjogSFRNTEVsZW1lbnQsIGRlcHRoOiBudW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBjb3JyZXNwb25kaW5nSXRlbSA9IGNvbWJpbmVkSXRlbXMuZmluZChpdGVtID0+IGl0ZW0udW5pcXVlSUQgPT09IGlkKTtcclxuICAgICAgICBjb25zdCBpc0NhcmRHcm91cCA9IGNvcnJlc3BvbmRpbmdJdGVtIGluc3RhbmNlb2YgQ2FyZEdyb3VwO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgaXRlbUNoaWxkcmVuQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgaXRlbUVtcHR5Q2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBpdGVtQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdoaWVyYXJjaHktaXRlbS1jb250YWluZXInO1xyXG4gICAgICAgIGl0ZW0uY2xhc3NOYW1lID0gJ2hpZXJhcmNoeS1pdGVtJztcclxuICAgICAgICBpdGVtQ2hpbGRyZW5Db250YWluZXIuY2xhc3NOYW1lID0gJ2hpZXJhcmNoeS1pdGVtLWNoaWxkLWNvbnRhaW5lcic7XHJcblxyXG4gICAgICAgIGNvbnN0IGxlZnRQYWRkaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGVmdFBhZGRpbmcuaW5uZXJIVE1MID0gJyZuYnNwOycucmVwZWF0KGRlcHRoICogMyk7XHJcbiAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBsYWJlbC5pbm5lckhUTUwgPSBpc0NhcmRHcm91cCA/IGA8Yj4ke2lkfTwvYj5gIDogYCR7aWR9YDtcclxuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSAnaGllcmFyY2h5LWxhYmVsJztcclxuICAgICAgICBjb25zdCB0b2dnbGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICB0b2dnbGVCdXR0b24uY2xhc3NOYW1lID0gJ2hpZXJhcmNoeS10b2dnbGUtYnV0dG9uJztcclxuICAgICAgICB0b2dnbGVCdXR0b24uaW5uZXJIVE1MID0gJysnO1xyXG4gICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQobGVmdFBhZGRpbmcpO1xyXG5cclxuICAgICAgICBpZihpc0NhcmRHcm91cCkge1xyXG4gICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKHRvZ2dsZUJ1dHRvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgY2FyZFNwYWNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBjYXJkU3BhY2VyLmlubmVySFRNTCA9ICctJm5ic3A7JztcclxuICAgICAgICAgICAgY2FyZFNwYWNlci5jbGFzc05hbWUgPSAnaGllcmFyY2h5LW5vbi10b2dnbGUtc3BhY2VyJ1xyXG4gICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGNhcmRTcGFjZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbiAgICAgICAgaXRlbUNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgICBpdGVtQ29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW1DaGlsZHJlbkNvbnRhaW5lcik7XHJcbiAgICAgICAgaXRlbUNoaWxkcmVuQ29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW1FbXB0eUNoaWxkKTtcclxuICAgICAgICBpbnNlcnRBZnRlci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBpdGVtQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgbGV0IGFkZGVkQ2hpbGRyZW46IEhUTUxEaXZFbGVtZW50W10gPSBbXTtcclxuICAgICAgICB0b2dnbGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRvZ2dsZUJ1dHRvbi5pbm5lckhUTUwgPT09IFwiK1wiKXsgLy8gZXhwYW5kXHJcbiAgICAgICAgICAgICAgICB0b2dnbGVCdXR0b24uaW5uZXJIVE1MID0gXCItXCI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRHcm91cCA9IGNhcmRHcm91cHMuZmluZChncm91cCA9PiBncm91cC51bmlxdWVJRCA9PT0gaWQpIGFzIENhcmRHcm91cDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuSURzID0gdGFyZ2V0R3JvdXAuY2hpbGRyZW5JRHM7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZJdGVtID0gaXRlbUVtcHR5Q2hpbGQ7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbklEcy5mb3JFYWNoKGlkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdJdGVtID0gY3JlYXRlSGllcmFyY2h5SXRlbShpZCwgcHJldkl0ZW0sIGRlcHRoICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkZWRDaGlsZHJlbi5wdXNoKG5ld0l0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZJdGVtID0gbmV3SXRlbTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbHNlIHsgLy8gY2xvc2VcclxuICAgICAgICAgICAgICAgIHRvZ2dsZUJ1dHRvbi5pbm5lckhUTUwgPSBcIitcIjtcclxuICAgICAgICAgICAgICAgIGFkZGVkQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC5yZW1vdmUoKSk7XHJcbiAgICAgICAgICAgICAgICBhZGRlZENoaWxkcmVuID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zdCBpbnRlcm5hbEl0ZW0gOiBIaWVyYXJjaHlJbnRlcm5hbEl0ZW0gPSB7XHJcbiAgICAgICAgICAgIHVuaXF1ZUlEOiBpZCxcclxuICAgICAgICAgICAgZGVwdGg6IGRlcHRoLFxyXG4gICAgICAgICAgICBlbXB0eUNoaWxkOiBpdGVtRW1wdHlDaGlsZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaGllcmFyY2h5TWFuYWdlci5zZXQoaWQsIGludGVybmFsSXRlbSk7XHJcblxyXG4gICAgICAgIGxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZighY29ycmVzcG9uZGluZ0l0ZW0pIHJldHVybjtcclxuICAgICAgICAgICAgaWYod2hpY2hMZWZ0UGFuZUFjdGl2ZSgpID09PSBMZWZ0UGFuZVR5cGUuRGVza3RvcCl7XHJcbiAgICAgICAgICAgICAgICBhZGRJdGVtVG9EZXNrdG9wKGNvcnJlc3BvbmRpbmdJdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkZEl0ZW1Ub1N0YWNrKGNvcnJlc3BvbmRpbmdJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gaXRlbUNvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcHJldkl0ZW0gPSBlbXB0eTtcclxuICAgIHJvb3RHcm91cHMuZm9yRWFjaChyb290R3JvdXAgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld0l0ZW0gPSBjcmVhdGVIaWVyYXJjaHlJdGVtKHJvb3RHcm91cC51bmlxdWVJRCwgcHJldkl0ZW0sIDApXHJcbiAgICAgICAgcHJldkl0ZW0gPSBuZXdJdGVtO1xyXG4gICAgfSlcclxufSIsImV4cG9ydCBlbnVtIExlZnRQYW5lVHlwZSB7XHJcbiAgICBEZXNrdG9wLFxyXG4gICAgU2VhcmNoU3RhY2tcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmlnaHRQYW5lVHlwZSB7XHJcbiAgICBDcmVhdGVDYXJkLFxyXG4gICAgQ3JlYXRlQ2FyZEdyb3VwLFxyXG4gICAgU2VhcmNoLFxyXG4gICAgTWV0YWRhdGEsXHJcbiAgICBIaWVyYXJjaHlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRQYW5lTWFuYWdlbWVudCA9IChkZWZhdWx0TGVmdDogTGVmdFBhbmVUeXBlID0gTGVmdFBhbmVUeXBlLlNlYXJjaFN0YWNrLCBkZWZhdWx0UmlnaHQ6IFJpZ2h0UGFuZVR5cGUgPSBSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmRHcm91cCkgPT4ge1xyXG4gICAgY29uc3QgbGVmdFBhbmVEZXNrdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtZGVza3RvcFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGxlZnRQYW5lU2VhcmNoU3RhY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnQtcGFuZS1zZWFyY2gtc3RhY2tcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCByaWdodFBhbmVDcmVhdGVDYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWNyZWF0ZS1jYXJkXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQ3JlYXRlQ2FyZEdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWNyZWF0ZS1jYXJkLWdyb3VwXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lU2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLXNlYXJjaFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZU1ldGFkYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLW1ldGFkYXRhXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lSGllcmFyY2h5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWhpZXJhcmNoeVwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIFxyXG4gICAgY29uc3QgbGVmdFBhbmVCdXR0b25EZXNrdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtYnV0dG9uLWRlc2t0b3BcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBsZWZ0UGFuZUJ1dHRvblNlYXJjaFN0YWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtYnV0dG9uLXNlYXJjaC1zdGFja1wiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvbkNyZWF0ZUNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LXBhbmUtYnV0dG9uLWNyZWF0ZS1jYXJkXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQnV0dG9uQ3JlYXRlQ2FyZEdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWJ1dHRvbi1jcmVhdGUtY2FyZC1ncm91cFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvblNlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1idXR0b24tc2VhcmNoXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQnV0dG9uTWV0YWRhdGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LXBhbmUtYnV0dG9uLW1ldGFkYXRhXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQnV0dG9uSGllcmFyY2h5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWJ1dHRvbi1oaWVyYXJjaHlcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBcclxuICAgIGNvbnN0IGxlZnRQYW5lTm9kZUVudW1QYWlyczogW0hUTUxEaXZFbGVtZW50LCBMZWZ0UGFuZVR5cGVdW10gPSBbXHJcbiAgICAgICAgW2xlZnRQYW5lRGVza3RvcCwgTGVmdFBhbmVUeXBlLkRlc2t0b3BdLFxyXG4gICAgICAgIFtsZWZ0UGFuZVNlYXJjaFN0YWNrLCBMZWZ0UGFuZVR5cGUuU2VhcmNoU3RhY2tdXHJcbiAgICBdO1xyXG4gICAgY29uc3QgbGVmdFBhbmVDbGlja2VkID0gKHNlbGVjdGVkUGFuZTogTGVmdFBhbmVUeXBlKSA9PiB7XHJcbiAgICAgICAgbGVmdFBhbmVOb2RlRW51bVBhaXJzLmZvckVhY2gocGFpciA9PiB7XHJcbiAgICAgICAgICAgIGlmKHBhaXJbMV0gPT09IHNlbGVjdGVkUGFuZSkgcGFpclswXS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgICAgICBlbHNlIHBhaXJbMF0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJpZ2h0UGFuZU5vZGVFbnVtUGFpcnM6IFtIVE1MRGl2RWxlbWVudCwgUmlnaHRQYW5lVHlwZV1bXSA9IFtcclxuICAgICAgICBbcmlnaHRQYW5lQ3JlYXRlQ2FyZCwgUmlnaHRQYW5lVHlwZS5DcmVhdGVDYXJkXSxcclxuICAgICAgICBbcmlnaHRQYW5lQ3JlYXRlQ2FyZEdyb3VwLCBSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmRHcm91cF0sXHJcbiAgICAgICAgW3JpZ2h0UGFuZVNlYXJjaCwgUmlnaHRQYW5lVHlwZS5TZWFyY2hdLFxyXG4gICAgICAgIFtyaWdodFBhbmVNZXRhZGF0YSwgUmlnaHRQYW5lVHlwZS5NZXRhZGF0YV0sXHJcbiAgICAgICAgW3JpZ2h0UGFuZUhpZXJhcmNoeSwgUmlnaHRQYW5lVHlwZS5IaWVyYXJjaHldLFxyXG4gICAgXTtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUNsaWNrZWQgPSAoc2VsZWN0ZWRQYW5lOiBSaWdodFBhbmVUeXBlKSA9PiB7XHJcbiAgICAgICAgcmlnaHRQYW5lTm9kZUVudW1QYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xyXG4gICAgICAgICAgICBpZihwYWlyWzFdID09PSBzZWxlY3RlZFBhbmUpIHBhaXJbMF0uc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgZWxzZSBwYWlyWzBdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxlZnRQYW5lQnV0dG9uRGVza3RvcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGxlZnRQYW5lQ2xpY2tlZChMZWZ0UGFuZVR5cGUuRGVza3RvcCkpO1xyXG4gICAgbGVmdFBhbmVCdXR0b25TZWFyY2hTdGFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGxlZnRQYW5lQ2xpY2tlZChMZWZ0UGFuZVR5cGUuU2VhcmNoU3RhY2spKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvbkNyZWF0ZUNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByaWdodFBhbmVDbGlja2VkKFJpZ2h0UGFuZVR5cGUuQ3JlYXRlQ2FyZCkpO1xyXG4gICAgcmlnaHRQYW5lQnV0dG9uQ3JlYXRlQ2FyZEdyb3VwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gcmlnaHRQYW5lQ2xpY2tlZChSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmRHcm91cCkpO1xyXG4gICAgcmlnaHRQYW5lQnV0dG9uU2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gcmlnaHRQYW5lQ2xpY2tlZChSaWdodFBhbmVUeXBlLlNlYXJjaCkpO1xyXG4gICAgcmlnaHRQYW5lQnV0dG9uTWV0YWRhdGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByaWdodFBhbmVDbGlja2VkKFJpZ2h0UGFuZVR5cGUuTWV0YWRhdGEpKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvbkhpZXJhcmNoeS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJpZ2h0UGFuZUNsaWNrZWQoUmlnaHRQYW5lVHlwZS5IaWVyYXJjaHkpKTtcclxuXHJcbiAgICAvLyBmaW5hbGl6ZSBwYW5lIG1hbmFnZW1lbnQgYW5kIGRpc2FibGUgc2VsZWN0IGJ1dHRvbnNcclxuICAgIGxlZnRQYW5lQ2xpY2tlZChkZWZhdWx0TGVmdCk7XHJcbiAgICByaWdodFBhbmVDbGlja2VkKGRlZmF1bHRSaWdodCk7XHJcbiAgICByaWdodFBhbmVCdXR0b25NZXRhZGF0YS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgd2hpY2hMZWZ0UGFuZUFjdGl2ZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IGxlZnRQYW5lRGVza3RvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1wYW5lLWRlc2t0b3BcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBsZWZ0UGFuZVNlYXJjaFN0YWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtc2VhcmNoLXN0YWNrXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGlmKGxlZnRQYW5lRGVza3RvcC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpe1xyXG4gICAgICAgIHJldHVybiBMZWZ0UGFuZVR5cGUuRGVza3RvcDtcclxuICAgIH0gZWxzZSBpZihsZWZ0UGFuZVNlYXJjaFN0YWNrLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJyl7XHJcbiAgICAgICAgcmV0dXJuIExlZnRQYW5lVHlwZS5TZWFyY2hTdGFjaztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIExlZnRQYW5lVHlwZS5TZWFyY2hTdGFjazsgLy8gZGVmYXVsdCB0byB0aGUgc2VhcmNoIHN0YWNrXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDYXJkIH0gZnJvbSBcIi4uL2NhcmRcIlxyXG5pbXBvcnQgeyBDYXJkR3JvdXAgfSBmcm9tIFwiLi4vY2FyZGdyb3VwXCJcclxuXHJcbmNvbnN0IHNlYXJjaFN0YWNrQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1zdGFjay1jb250YWluZXInKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U2VhcmNoU3RhY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjbGVhclN0YWNrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1zdGFjay1jbGVhci1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNsZWFyU3RhY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgc2VhcmNoU3RhY2tDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkSXRlbVRvU3RhY2sgPSAoaXRlbSA6IENhcmQgfCBDYXJkR3JvdXApID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gaXRlbS5nZXROb2RlKCk7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBpZiAod2luZG93Lk1hdGhKYXgpIE1hdGhKYXgudHlwZXNldChbY3VycmVudE5vZGVdKTtcclxuICAgIHNlYXJjaFN0YWNrQ29udGFpbmVyLnByZXBlbmQoY3VycmVudE5vZGUpO1xyXG59IiwiaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCIuLi9jYXJkXCI7XHJcbmltcG9ydCB7IENhcmRHcm91cCB9IGZyb20gXCIuLi9jYXJkZ3JvdXBcIjtcclxuaW1wb3J0ICogYXMgZWxhc3RpY2x1bnIgZnJvbSBcImVsYXN0aWNsdW5yXCI7XHJcbmltcG9ydCB7IGFkZEl0ZW1Ub1N0YWNrIH0gZnJvbSBcIi4vc2VhcmNoLXN0YWNrXCI7XHJcbmltcG9ydCB7IGFkZEl0ZW1Ub0Rlc2t0b3AgfSBmcm9tIFwiLi9kZXNrdG9wXCI7XHJcbmltcG9ydCB7IHdoaWNoTGVmdFBhbmVBY3RpdmUsIExlZnRQYW5lVHlwZSB9IGZyb20gXCIuL3BhbmUtbWFuYWdlbWVudFwiO1xyXG5cclxuZXhwb3J0IHR5cGUgU2VhcmNoSW5kZXggPSB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFNlYXJjaCA9IChjYXJkczogQ2FyZFtdLCBjYXJkR3JvdXBzOiBDYXJkR3JvdXBbXSkgPT4ge1xyXG4gICAgY29uc3QgY29tYmluZWRJdGVtcyA9IFsuLi5jYXJkcywgLi4uY2FyZEdyb3Vwc107XHJcbiAgICBjb25zdCBpbmRleCA9IGVsYXN0aWNsdW5yPFNlYXJjaEluZGV4PihmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmFkZEZpZWxkKCduYW1lJyk7XHJcbiAgICAgICAgdGhpcy5hZGRGaWVsZCgnZGVzY3JpcHRpb24nKTtcclxuICAgICAgICB0aGlzLnNldFJlZignaWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGRvY3VtZW50czogU2VhcmNoSW5kZXhbXSA9IGNvbWJpbmVkSXRlbXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5hbWU6IGl0ZW0ubmFtZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGl0ZW0uZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIGlkOiBpdGVtLnVuaXF1ZUlELnJlcGxhY2UoLy0vZywgJyAnKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnRzLmZvckVhY2goZG9jdW1lbnQgPT4gaW5kZXguYWRkRG9jKGRvY3VtZW50KSk7XHJcblxyXG4gICAgY29uc3Qgc2VhcmNoQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1xdWVyeS1pbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBjb25zdCBzZWFyY2hSZXN1bHRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1yZXN1bHRzLWNvbnRhaW5lcicpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3Qgc2VhcmNoRmlsdGVyQ2FyZHNPbmx5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1maWx0ZXItY2FyZHMtb25seScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBjb25zdCBzZWFyY2hGaWx0ZXJDYXJkZ3JvdXBzT25seSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtZmlsdGVyLWNhcmRncm91cHMtb25seScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3QgcnVuU2VhcmNoUXVlcnkgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcXVlcnkgPSBzZWFyY2hCYXIudmFsdWU7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGluZGV4LnNlYXJjaChxdWVyeSwge1xyXG4gICAgICAgICAgICBmaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHtib29zdDogMn0sXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjoge2Jvb3N0OiAxfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2VhcmNoLXF1ZXJ5XCIsIHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgc2VhcmNoUmVzdWx0c0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzQ2FyZCA9IHJlc3VsdC5yZWYuc2xpY2UoMCwgMykgIT09ICdbR10nO1xyXG4gICAgICAgICAgICBpZihzZWFyY2hGaWx0ZXJDYXJkc09ubHkuY2hlY2tlZCAmJiAhc2VhcmNoRmlsdGVyQ2FyZGdyb3Vwc09ubHkuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgICAgICBpZighaXNDYXJkKSByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZighc2VhcmNoRmlsdGVyQ2FyZHNPbmx5LmNoZWNrZWQgJiYgc2VhcmNoRmlsdGVyQ2FyZGdyb3Vwc09ubHkuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgICAgICBpZihpc0NhcmQpIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBzZWFyY2hJdGVtLmNsYXNzTmFtZSA9ICdzZWFyY2gtcmVzdWx0LWl0ZW0nO1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xyXG4gICAgICAgICAgICBzZWFyY2hIZWFkZXIuY2xhc3NOYW1lID0gJ3NlYXJjaC1pdGVtLWhlYWRlcic7XHJcbiAgICAgICAgICAgIHNlYXJjaEhlYWRlci5pbm5lckhUTUwgPSByZXN1bHQucmVmOyAvLy5yZXBsYWNlKC8gL2csICctJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaEJ1dHRvblJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBzZWFyY2hCdXR0b25Sb3cuY2xhc3NOYW1lID0gJ3NlYXJjaC1idXR0b24tcm93J1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc3QgYWRkVG9TdGFja0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgICAgICAvLyBhZGRUb1N0YWNrQnV0dG9uLmlubmVySFRNTCA9ICdBZGQgdG8gU3RhY2snO1xyXG4gICAgICAgICAgICAvLyBzZWFyY2hCdXR0b25Sb3cuYXBwZW5kKGFkZFRvU3RhY2tCdXR0b24pO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBhZGRUb0Rlc2t0b3BCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICAgICAgLy8gYWRkVG9EZXNrdG9wQnV0dG9uLmlubmVySFRNTCA9ICdBZGQgdG8gRGVza3RvcCc7XHJcbiAgICAgICAgICAgIC8vIHNlYXJjaEJ1dHRvblJvdy5hcHBlbmQoYWRkVG9EZXNrdG9wQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaEl0ZW0uYXBwZW5kKHNlYXJjaEhlYWRlcik7XHJcbiAgICAgICAgICAgIC8vIHNlYXJjaEl0ZW0uYXBwZW5kKHNlYXJjaEJ1dHRvblJvdyk7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHNDb250YWluZXIuYXBwZW5kKHNlYXJjaEl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgc2VhcmNoSXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNJRCA9IHJlc3VsdC5yZWYucmVwbGFjZSgvIC9nLCAnLScpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGNvbWJpbmVkSXRlbXMuZmluZChpdGVtID0+IGl0ZW0udW5pcXVlSUQgPT09IHRoaXNJRCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIWl0ZW0pIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmKHdoaWNoTGVmdFBhbmVBY3RpdmUoKSA9PT0gTGVmdFBhbmVUeXBlLkRlc2t0b3Ape1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEl0ZW1Ub0Rlc2t0b3AoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEl0ZW1Ub1N0YWNrKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgc2VhcmNoQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgcnVuU2VhcmNoUXVlcnkpO1xyXG4gICAgc2VhcmNoRmlsdGVyQ2FyZHNPbmx5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcnVuU2VhcmNoUXVlcnkpO1xyXG4gICAgc2VhcmNoRmlsdGVyQ2FyZGdyb3Vwc09ubHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBydW5TZWFyY2hRdWVyeSk7XHJcblxyXG4gICAgLy8gZmluYWxpemF0aW9uXFxcclxuICAgIGNvbnN0IHByZXZRdWVyeSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2VhcmNoLXF1ZXJ5XCIpO1xyXG4gICAgaWYocHJldlF1ZXJ5KXtcclxuICAgICAgICBzZWFyY2hCYXIudmFsdWUgPSBwcmV2UXVlcnk7XHJcbiAgICAgICAgcnVuU2VhcmNoUXVlcnkoKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjb25zdCBjb3B5VG9DbGlwYm9hcmQgPSAoY29udGVudDogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoY29udGVudCk7XHJcbn0gXHJcblxyXG5leHBvcnQgY29uc3QgY29weUZyb21DbGlwYm9hcmQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCB0ZXh0ID0gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0iLCJleHBvcnQgY29uc3QgZ2V0TU1ERFlZWVkgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IE1NID0gYCR7ZGF0ZS5nZXRNb250aCgpICsgMX1gLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBERCA9IGAke2RhdGUuZ2V0RGF0ZSgpfWAucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IFlZWVkgPSBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9YDtcclxuICAgIHJldHVybiBgJHtNTX0tJHtERH0tJHtZWVlZfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRISE1NID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgWE0gPSAnQU0nO1xyXG4gICAgbGV0IEhIOiBzdHJpbmcgfCBudW1iZXIgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICBpZihISCA9PT0gMCkge1xyXG4gICAgICAgIEhIID0gMTI7XHJcbiAgICAgICAgWE0gPSAnQU0nO1xyXG4gICAgfSBlbHNlIGlmKEhIID09PSAxMil7XHJcbiAgICAgICAgWE0gPSAnUE0nO1xyXG4gICAgfSBlbHNlIGlmKEhIID49IDEzKXtcclxuICAgICAgICBISCAtPSAxMjtcclxuICAgICAgICBYTSA9ICdQTSc7XHJcbiAgICB9XHJcbiAgICBISCA9IGAke0hIfWAucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGxldCBNTSA9IGAke2RhdGUuZ2V0TWludXRlcygpfWAucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIHJldHVybiBgJHtISH0tJHtNTX0ke1hNfWBcclxufSIsImV4cG9ydCBjb25zdCBkb3dubG9hZEZpbGUgPSAoZmlsZW5hbWU6IHN0cmluZywgZGF0YTogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2RhdGFdKTtcclxuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlbmFtZTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxufSIsImV4cG9ydCBjb25zdCB0b0pTT05TYWZlVGV4dCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiB0ZXh0XHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIlxcXFxcXFwiXCIpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZnJvbUpTT05TYWZlVGV4dCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiB0ZXh0XHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFxuL2csIFwiXFxuXCIpXHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFxcIm4vZywgXCJcXFwiXCIpO1xyXG59IiwiZXhwb3J0IGNvbnN0IGxvYWREYXRhID0gKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICBjbGllbnQub3BlbignR0VUJywgcGF0aCk7XHJcbiAgICAgICAgY2xpZW50LnJlc3BvbnNlVHlwZSA9ICdqc29uJztcclxuICAgICAgICBjbGllbnQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoYWRlckNvZGUgPSBjbGllbnQucmVzcG9uc2U7XHJcbiAgICAgICAgICAgIHJlc29sdmUoc2hhZGVyQ29kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsaWVudC5zZW5kKCk7XHJcbiAgICB9KTtcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBDYXJkLCBDYXJkSlNPTiB9IGZyb20gXCIuL2NhcmRcIjtcclxuaW1wb3J0IHsgbG9hZERhdGEgfSBmcm9tIFwiLi91dGlsL2xvYWRlclwiO1xyXG5pbXBvcnQgeyBpbml0Q2FyZEF1dGhvcmluZyB9IGZyb20gXCIuL2ZlYXR1cmVzL2NhcmQtYXV0aG9yaW5nXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVZTcGFjZXIgfSBmcm9tIFwiLi91dGlsL3NwYWNlcnNcIjtcclxuaW1wb3J0IHsgTGVmdFBhbmVUeXBlLCBSaWdodFBhbmVUeXBlLCBpbml0UGFuZU1hbmFnZW1lbnQgfSBmcm9tIFwiLi9mZWF0dXJlcy9wYW5lLW1hbmFnZW1lbnRcIjtcclxuaW1wb3J0IHsgaW5pdENhcmRHcm91cEF1dGhvcmluZyB9IGZyb20gXCIuL2ZlYXR1cmVzL2NhcmQtZ3JvdXAtYXV0aG9yaW5nXCI7XHJcbmltcG9ydCB7IENhcmRHcm91cCwgQ2FyZEdyb3VwSlNPTiB9IGZyb20gXCIuL2NhcmRncm91cFwiO1xyXG5pbXBvcnQgeyBpbml0SGllcmFyY2h5IH0gZnJvbSBcIi4vZmVhdHVyZXMvaGllcmFyY2h5XCI7XHJcbmltcG9ydCB7IGluaXRTZWFyY2ggfSBmcm9tIFwiLi9mZWF0dXJlcy9zZWFyY2hcIjtcclxuaW1wb3J0IHsgaW5pdFNlYXJjaFN0YWNrIH0gZnJvbSBcIi4vZmVhdHVyZXMvc2VhcmNoLXN0YWNrXCI7XHJcbmltcG9ydCB7IGluaXREZXNrdG9wIH0gZnJvbSBcIi4vZmVhdHVyZXMvZGVza3RvcFwiO1xyXG5cclxuY29uc3QgbG9hZENhcmRzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgY2FyZE1hcCA9IGF3YWl0IGxvYWREYXRhKCcuLi9jYXJkLW1hcC5qc29uJyk7XHJcbiAgICBjb25zdCBwYXRoczogc3RyaW5nW10gPSBjYXJkTWFwLmZpbGVzO1xyXG4gICAgY29uc3QgY2FyZHNKU09OID0gYXdhaXQgUHJvbWlzZS5hbGwocGF0aHMubWFwKHBhdGggPT4gbG9hZERhdGEoYC4uL2RhdGEtY2FyZHMvJHtwYXRofS5qc29uYCkpKTtcclxuXHJcbiAgICByZXR1cm4gY2FyZHNKU09OO1xyXG59XHJcblxyXG5jb25zdCBsb2FkQ2FyZEdyb3VwcyA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGNhcmRNYXAgPSBhd2FpdCBsb2FkRGF0YSgnLi4vY2FyZC1ncm91cC1tYXAuanNvbicpO1xyXG4gICAgY29uc3QgcGF0aHM6IHN0cmluZ1tdID0gY2FyZE1hcC5maWxlcztcclxuICAgIGNvbnN0IGNhcmRzSlNPTiA9IGF3YWl0IFByb21pc2UuYWxsKHBhdGhzLm1hcChwYXRoID0+IGxvYWREYXRhKGAuLi9kYXRhLWNhcmQtZ3JvdXBzLyR7cGF0aH0uanNvbmApKSk7XHJcblxyXG4gICAgcmV0dXJuIGNhcmRzSlNPTjtcclxufVxyXG5cclxuY29uc3QgaW5pdCA9IGFzeW5jICgpID0+IHtcclxuICAgIGxldCBjYXJkc0pTT046IENhcmRKU09OW10gPSBhd2FpdCBsb2FkQ2FyZHMoKTtcclxuICAgIGxldCBjYXJkR3JvdXBzSlNPTjogQ2FyZEdyb3VwSlNPTltdID0gYXdhaXQgbG9hZENhcmRHcm91cHMoKTtcclxuICAgIGxldCBjYXJkcyA9IGNhcmRzSlNPTi5tYXAoZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2FyZCA9IG5ldyBDYXJkKGRhdGEubmFtZSwgZGF0YS5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgaWYoZGF0YS5jcmVhdGlvbkRhdGUgJiYgZGF0YS5lZGl0RGF0ZSl7XHJcbiAgICAgICAgICAgIGNhcmQuc2V0RGF0ZXMoZGF0YS5jcmVhdGlvbkRhdGUsIGRhdGEuZWRpdERhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihkYXRhLmNhdGVnb3JpZXMgJiYgZGF0YS5zdWJjYXJkcyl7XHJcbiAgICAgICAgICAgIGNhcmQuc2V0Q2F0ZWdvcmllcyhkYXRhLmNhdGVnb3JpZXMpO1xyXG4gICAgICAgICAgICBjYXJkLnNldFN1YmNhcmRzKGRhdGEuc3ViY2FyZHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FyZDtcclxuICAgIH0pO1xyXG4gICAgbGV0IGNhcmRHcm91cHMgPSBjYXJkR3JvdXBzSlNPTi5tYXAoZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2FyZEdyb3VwID0gbmV3IENhcmRHcm91cChkYXRhLm5hbWUsIGRhdGEuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGlmKGRhdGEuY2hpbGRyZW5JRHMpIGNhcmRHcm91cC5zZXRDaGlsZHJlbklEcyhkYXRhLmNoaWxkcmVuSURzKTtcclxuICAgICAgICByZXR1cm4gY2FyZEdyb3VwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gY2FyZHMuZm9yRWFjaChjYXJkID0+IHtcclxuICAgIC8vICAgICBjb25zdCBkb21Ob2RlID0gY2FyZC5nZXROb2RlKCk7XHJcbiAgICAvLyAgICAgbGVmdFBhbmVOb2RlLmFwcGVuZChkb21Ob2RlKTtcclxuICAgIC8vICAgICBsZWZ0UGFuZU5vZGUuYXBwZW5kKGNyZWF0ZVZTcGFjZXIoOCkpO1xyXG4gICAgLy8gfSk7XHJcbiAgICAvLyBjYXJkR3JvdXBzLmZvckVhY2goY2FyZEdyb3VwID0+IHtcclxuICAgIC8vICAgICBjb25zdCBkb21Ob2RlID0gY2FyZEdyb3VwLmdldE5vZGUoKTtcclxuICAgIC8vICAgICBsZWZ0UGFuZU5vZGUuYXBwZW5kKGRvbU5vZGUpO1xyXG4gICAgLy8gICAgIGxlZnRQYW5lTm9kZS5hcHBlbmQoY3JlYXRlVlNwYWNlcig4KSk7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICBpbml0UGFuZU1hbmFnZW1lbnQoTGVmdFBhbmVUeXBlLlNlYXJjaFN0YWNrLCBSaWdodFBhbmVUeXBlLlNlYXJjaCk7XHJcbiAgICBpbml0Q2FyZEF1dGhvcmluZygpO1xyXG4gICAgaW5pdENhcmRHcm91cEF1dGhvcmluZygpO1xyXG4gICAgaW5pdEhpZXJhcmNoeShjYXJkcywgY2FyZEdyb3Vwcyk7XHJcbiAgICBpbml0U2VhcmNoKGNhcmRzLCBjYXJkR3JvdXBzKTtcclxuXHJcbiAgICBpbml0U2VhcmNoU3RhY2soKTtcclxuICAgIGluaXREZXNrdG9wKGNhcmRzLCBjYXJkR3JvdXBzKTtcclxuXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBpZiAod2luZG93Lk1hdGhKYXgpIE1hdGhKYXgudHlwZXNldCgpO1xyXG59XHJcblxyXG5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9