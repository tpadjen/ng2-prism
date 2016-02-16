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
var di_1 = require('../../core/di');
var platform_location_1 = require('../../router/platform_location');
var client_message_broker_1 = require('../shared/client_message_broker');
var messaging_api_1 = require('../shared/messaging_api');
var serialized_types_1 = require('../shared/serialized_types');
var async_1 = require('../../facade/async');
var exceptions_1 = require('../../facade/exceptions');
var serializer_1 = require('../shared/serializer');
var message_bus_1 = require('../shared/message_bus');
var collection_1 = require('../../facade/collection');
var lang_1 = require('../../facade/lang');
var event_deserializer_1 = require('./event_deserializer');
var WebWorkerPlatformLocation = (function(_super) {
  __extends(WebWorkerPlatformLocation, _super);
  function WebWorkerPlatformLocation(brokerFactory, bus, _serializer) {
    var _this = this;
    _super.call(this);
    this._serializer = _serializer;
    this._popStateListeners = [];
    this._hashChangeListeners = [];
    this._location = null;
    this._broker = brokerFactory.createMessageBroker(messaging_api_1.ROUTER_CHANNEL);
    this._channelSource = bus.from(messaging_api_1.ROUTER_CHANNEL);
    async_1.ObservableWrapper.subscribe(this._channelSource, function(msg) {
      var listeners = null;
      if (collection_1.StringMapWrapper.contains(msg, 'event')) {
        var type = msg['event']['type'];
        if (lang_1.StringWrapper.equals(type, "popstate")) {
          listeners = _this._popStateListeners;
        } else if (lang_1.StringWrapper.equals(type, "hashchange")) {
          listeners = _this._hashChangeListeners;
        }
        if (listeners !== null) {
          var e = event_deserializer_1.deserializeGenericEvent(msg['event']);
          _this._location = _this._serializer.deserialize(msg['location'], serialized_types_1.LocationType);
          listeners.forEach(function(fn) {
            return fn(e);
          });
        }
      }
    });
  }
  WebWorkerPlatformLocation.prototype.init = function() {
    var _this = this;
    var args = new client_message_broker_1.UiArguments("getLocation");
    var locationPromise = this._broker.runOnService(args, serialized_types_1.LocationType);
    return async_1.PromiseWrapper.then(locationPromise, function(val) {
      _this._location = val;
      return true;
    }, function(err) {
      throw new exceptions_1.BaseException(err);
    });
  };
  WebWorkerPlatformLocation.prototype.getBaseHrefFromDOM = function() {
    throw new exceptions_1.BaseException("Attempt to get base href from DOM from WebWorker. You must either provide a value for the APP_BASE_HREF token through DI or use the hash location strategy.");
  };
  WebWorkerPlatformLocation.prototype.onPopState = function(fn) {
    this._popStateListeners.push(fn);
  };
  WebWorkerPlatformLocation.prototype.onHashChange = function(fn) {
    this._hashChangeListeners.push(fn);
  };
  Object.defineProperty(WebWorkerPlatformLocation.prototype, "pathname", {
    get: function() {
      if (this._location === null) {
        return null;
      }
      return this._location.pathname;
    },
    set: function(newPath) {
      if (this._location === null) {
        throw new exceptions_1.BaseException("Attempt to set pathname before value is obtained from UI");
      }
      this._location.pathname = newPath;
      var fnArgs = [new client_message_broker_1.FnArg(newPath, serializer_1.PRIMITIVE)];
      var args = new client_message_broker_1.UiArguments("setPathname", fnArgs);
      this._broker.runOnService(args, null);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(WebWorkerPlatformLocation.prototype, "search", {
    get: function() {
      if (this._location === null) {
        return null;
      }
      return this._location.search;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(WebWorkerPlatformLocation.prototype, "hash", {
    get: function() {
      if (this._location === null) {
        return null;
      }
      return this._location.hash;
    },
    enumerable: true,
    configurable: true
  });
  WebWorkerPlatformLocation.prototype.pushState = function(state, title, url) {
    var fnArgs = [new client_message_broker_1.FnArg(state, serializer_1.PRIMITIVE), new client_message_broker_1.FnArg(title, serializer_1.PRIMITIVE), new client_message_broker_1.FnArg(url, serializer_1.PRIMITIVE)];
    var args = new client_message_broker_1.UiArguments("pushState", fnArgs);
    this._broker.runOnService(args, null);
  };
  WebWorkerPlatformLocation.prototype.replaceState = function(state, title, url) {
    var fnArgs = [new client_message_broker_1.FnArg(state, serializer_1.PRIMITIVE), new client_message_broker_1.FnArg(title, serializer_1.PRIMITIVE), new client_message_broker_1.FnArg(url, serializer_1.PRIMITIVE)];
    var args = new client_message_broker_1.UiArguments("replaceState", fnArgs);
    this._broker.runOnService(args, null);
  };
  WebWorkerPlatformLocation.prototype.forward = function() {
    var args = new client_message_broker_1.UiArguments("forward");
    this._broker.runOnService(args, null);
  };
  WebWorkerPlatformLocation.prototype.back = function() {
    var args = new client_message_broker_1.UiArguments("back");
    this._broker.runOnService(args, null);
  };
  WebWorkerPlatformLocation = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [client_message_broker_1.ClientMessageBrokerFactory, message_bus_1.MessageBus, serializer_1.Serializer])], WebWorkerPlatformLocation);
  return WebWorkerPlatformLocation;
})(platform_location_1.PlatformLocation);
exports.WebWorkerPlatformLocation = WebWorkerPlatformLocation;
