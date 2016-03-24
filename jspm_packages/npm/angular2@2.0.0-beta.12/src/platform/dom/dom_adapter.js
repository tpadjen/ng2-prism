/* */ 
'use strict';
var lang_1 = require('../../facade/lang');
exports.DOM = null;
function setRootDomAdapter(adapter) {
  if (lang_1.isBlank(exports.DOM)) {
    exports.DOM = adapter;
  }
}
exports.setRootDomAdapter = setRootDomAdapter;
var DomAdapter = (function() {
  function DomAdapter() {}
  Object.defineProperty(DomAdapter.prototype, "attrToPropMap", {
    get: function() {
      return this._attrToPropMap;
    },
    set: function(value) {
      this._attrToPropMap = value;
    },
    enumerable: true,
    configurable: true
  });
  ;
  ;
  return DomAdapter;
})();
exports.DomAdapter = DomAdapter;
