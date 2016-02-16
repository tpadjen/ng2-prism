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
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var core_1 = require('../../core');
var platform_location_1 = require('./platform_location');
var dom_adapter_1 = require('../platform/dom/dom_adapter');
var BrowserPlatformLocation = (function(_super) {
  __extends(BrowserPlatformLocation, _super);
  function BrowserPlatformLocation() {
    _super.call(this);
    this._init();
  }
  BrowserPlatformLocation.prototype._init = function() {
    this._location = dom_adapter_1.DOM.getLocation();
    this._history = dom_adapter_1.DOM.getHistory();
  };
  Object.defineProperty(BrowserPlatformLocation.prototype, "location", {
    get: function() {
      return this._location;
    },
    enumerable: true,
    configurable: true
  });
  BrowserPlatformLocation.prototype.getBaseHrefFromDOM = function() {
    return dom_adapter_1.DOM.getBaseHref();
  };
  BrowserPlatformLocation.prototype.onPopState = function(fn) {
    dom_adapter_1.DOM.getGlobalEventTarget('window').addEventListener('popstate', fn, false);
  };
  BrowserPlatformLocation.prototype.onHashChange = function(fn) {
    dom_adapter_1.DOM.getGlobalEventTarget('window').addEventListener('hashchange', fn, false);
  };
  Object.defineProperty(BrowserPlatformLocation.prototype, "pathname", {
    get: function() {
      return this._location.pathname;
    },
    set: function(newPath) {
      this._location.pathname = newPath;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BrowserPlatformLocation.prototype, "search", {
    get: function() {
      return this._location.search;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BrowserPlatformLocation.prototype, "hash", {
    get: function() {
      return this._location.hash;
    },
    enumerable: true,
    configurable: true
  });
  BrowserPlatformLocation.prototype.pushState = function(state, title, url) {
    this._history.pushState(state, title, url);
  };
  BrowserPlatformLocation.prototype.replaceState = function(state, title, url) {
    this._history.replaceState(state, title, url);
  };
  BrowserPlatformLocation.prototype.forward = function() {
    this._history.forward();
  };
  BrowserPlatformLocation.prototype.back = function() {
    this._history.back();
  };
  BrowserPlatformLocation = __decorate([core_1.Injectable(), __metadata('design:paramtypes', [])], BrowserPlatformLocation);
  return BrowserPlatformLocation;
})(platform_location_1.PlatformLocation);
exports.BrowserPlatformLocation = BrowserPlatformLocation;
