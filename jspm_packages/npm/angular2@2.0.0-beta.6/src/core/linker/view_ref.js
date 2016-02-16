/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exceptions_1 = require('../../facade/exceptions');
var ViewRef = (function() {
  function ViewRef() {}
  Object.defineProperty(ViewRef.prototype, "changeDetectorRef", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  Object.defineProperty(ViewRef.prototype, "destroyed", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  return ViewRef;
})();
exports.ViewRef = ViewRef;
var HostViewRef = (function(_super) {
  __extends(HostViewRef, _super);
  function HostViewRef() {
    _super.apply(this, arguments);
  }
  Object.defineProperty(HostViewRef.prototype, "rootNodes", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  return HostViewRef;
})(ViewRef);
exports.HostViewRef = HostViewRef;
var EmbeddedViewRef = (function(_super) {
  __extends(EmbeddedViewRef, _super);
  function EmbeddedViewRef() {
    _super.apply(this, arguments);
  }
  Object.defineProperty(EmbeddedViewRef.prototype, "rootNodes", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  return EmbeddedViewRef;
})(ViewRef);
exports.EmbeddedViewRef = EmbeddedViewRef;
var ViewRef_ = (function() {
  function ViewRef_(_view) {
    this._view = _view;
    this._view = _view;
  }
  Object.defineProperty(ViewRef_.prototype, "internalView", {
    get: function() {
      return this._view;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef_.prototype, "changeDetectorRef", {
    get: function() {
      return this._view.changeDetector.ref;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef_.prototype, "rootNodes", {
    get: function() {
      return this._view.flatRootNodes;
    },
    enumerable: true,
    configurable: true
  });
  ViewRef_.prototype.setLocal = function(variableName, value) {
    this._view.setLocal(variableName, value);
  };
  ViewRef_.prototype.hasLocal = function(variableName) {
    return this._view.hasLocal(variableName);
  };
  Object.defineProperty(ViewRef_.prototype, "destroyed", {
    get: function() {
      return this._view.destroyed;
    },
    enumerable: true,
    configurable: true
  });
  return ViewRef_;
})();
exports.ViewRef_ = ViewRef_;
var HostViewFactoryRef = (function() {
  function HostViewFactoryRef() {}
  return HostViewFactoryRef;
})();
exports.HostViewFactoryRef = HostViewFactoryRef;
var HostViewFactoryRef_ = (function() {
  function HostViewFactoryRef_(_hostViewFactory) {
    this._hostViewFactory = _hostViewFactory;
  }
  Object.defineProperty(HostViewFactoryRef_.prototype, "internalHostViewFactory", {
    get: function() {
      return this._hostViewFactory;
    },
    enumerable: true,
    configurable: true
  });
  return HostViewFactoryRef_;
})();
exports.HostViewFactoryRef_ = HostViewFactoryRef_;
