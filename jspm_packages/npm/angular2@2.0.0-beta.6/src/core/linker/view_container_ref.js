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
var collection_1 = require('../../facade/collection');
var exceptions_1 = require('../../facade/exceptions');
var lang_1 = require('../../facade/lang');
var ViewContainerRef = (function() {
  function ViewContainerRef() {}
  Object.defineProperty(ViewContainerRef.prototype, "element", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ViewContainerRef.prototype.clear = function() {
    for (var i = this.length - 1; i >= 0; i--) {
      this.remove(i);
    }
  };
  Object.defineProperty(ViewContainerRef.prototype, "length", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  return ViewContainerRef;
})();
exports.ViewContainerRef = ViewContainerRef;
var ViewContainerRef_ = (function(_super) {
  __extends(ViewContainerRef_, _super);
  function ViewContainerRef_(_element) {
    _super.call(this);
    this._element = _element;
  }
  ViewContainerRef_.prototype.get = function(index) {
    return this._element.nestedViews[index].ref;
  };
  Object.defineProperty(ViewContainerRef_.prototype, "length", {
    get: function() {
      var views = this._element.nestedViews;
      return lang_1.isPresent(views) ? views.length : 0;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef_.prototype, "element", {
    get: function() {
      return this._element.ref;
    },
    enumerable: true,
    configurable: true
  });
  ViewContainerRef_.prototype.createEmbeddedView = function(templateRef, index) {
    if (index === void 0) {
      index = -1;
    }
    if (index == -1)
      index = this.length;
    var vm = this._element.parentView.viewManager;
    return vm.createEmbeddedViewInContainer(this._element.ref, index, templateRef);
  };
  ViewContainerRef_.prototype.createHostView = function(hostViewFactoryRef, index, dynamicallyCreatedProviders, projectableNodes) {
    if (index === void 0) {
      index = -1;
    }
    if (dynamicallyCreatedProviders === void 0) {
      dynamicallyCreatedProviders = null;
    }
    if (projectableNodes === void 0) {
      projectableNodes = null;
    }
    if (index == -1)
      index = this.length;
    var vm = this._element.parentView.viewManager;
    return vm.createHostViewInContainer(this._element.ref, index, hostViewFactoryRef, dynamicallyCreatedProviders, projectableNodes);
  };
  ViewContainerRef_.prototype.insert = function(viewRef, index) {
    if (index === void 0) {
      index = -1;
    }
    if (index == -1)
      index = this.length;
    var vm = this._element.parentView.viewManager;
    return vm.attachViewInContainer(this._element.ref, index, viewRef);
  };
  ViewContainerRef_.prototype.indexOf = function(viewRef) {
    return collection_1.ListWrapper.indexOf(this._element.nestedViews, viewRef.internalView);
  };
  ViewContainerRef_.prototype.remove = function(index) {
    if (index === void 0) {
      index = -1;
    }
    if (index == -1)
      index = this.length - 1;
    var vm = this._element.parentView.viewManager;
    return vm.destroyViewInContainer(this._element.ref, index);
  };
  ViewContainerRef_.prototype.detach = function(index) {
    if (index === void 0) {
      index = -1;
    }
    if (index == -1)
      index = this.length - 1;
    var vm = this._element.parentView.viewManager;
    return vm.detachViewInContainer(this._element.ref, index);
  };
  return ViewContainerRef_;
})(ViewContainerRef);
exports.ViewContainerRef_ = ViewContainerRef_;
