/* */ 
'use strict';
var lang_1 = require('../../facade/lang');
var exceptions_1 = require('../../facade/exceptions');
var forward_ref_1 = require('./forward_ref');
var Key = (function() {
  function Key(token, id) {
    this.token = token;
    this.id = id;
    if (lang_1.isBlank(token)) {
      throw new exceptions_1.BaseException('Token must be defined!');
    }
  }
  Object.defineProperty(Key.prototype, "displayName", {
    get: function() {
      return lang_1.stringify(this.token);
    },
    enumerable: true,
    configurable: true
  });
  Key.get = function(token) {
    return _globalKeyRegistry.get(forward_ref_1.resolveForwardRef(token));
  };
  Object.defineProperty(Key, "numberOfKeys", {
    get: function() {
      return _globalKeyRegistry.numberOfKeys;
    },
    enumerable: true,
    configurable: true
  });
  return Key;
})();
exports.Key = Key;
var KeyRegistry = (function() {
  function KeyRegistry() {
    this._allKeys = new Map();
  }
  KeyRegistry.prototype.get = function(token) {
    if (token instanceof Key)
      return token;
    if (this._allKeys.has(token)) {
      return this._allKeys.get(token);
    }
    var newKey = new Key(token, Key.numberOfKeys);
    this._allKeys.set(token, newKey);
    return newKey;
  };
  Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
    get: function() {
      return this._allKeys.size;
    },
    enumerable: true,
    configurable: true
  });
  return KeyRegistry;
})();
exports.KeyRegistry = KeyRegistry;
var _globalKeyRegistry = new KeyRegistry();
