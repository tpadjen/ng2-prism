/* */ 
'use strict';
var exceptions_1 = require('../../facade/exceptions');
var ElementRef = (function() {
  function ElementRef() {}
  Object.defineProperty(ElementRef.prototype, "nativeElement", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  return ElementRef;
})();
exports.ElementRef = ElementRef;
var ElementRef_ = (function() {
  function ElementRef_(_appElement) {
    this._appElement = _appElement;
  }
  Object.defineProperty(ElementRef_.prototype, "internalElement", {
    get: function() {
      return this._appElement;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ElementRef_.prototype, "nativeElement", {
    get: function() {
      return this._appElement.nativeElement;
    },
    enumerable: true,
    configurable: true
  });
  return ElementRef_;
})();
exports.ElementRef_ = ElementRef_;
