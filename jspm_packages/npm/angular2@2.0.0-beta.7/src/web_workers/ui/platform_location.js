/* */ 
'use strict';
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
var browser_platform_location_1 = require('../../router/browser_platform_location');
var di_1 = require('../../core/di');
var messaging_api_1 = require('../shared/messaging_api');
var service_message_broker_1 = require('../shared/service_message_broker');
var serializer_1 = require('../shared/serializer');
var bind_1 = require('./bind');
var serialized_types_1 = require('../shared/serialized_types');
var message_bus_1 = require('../shared/message_bus');
var async_1 = require('../../facade/async');
var MessageBasedPlatformLocation = (function() {
  function MessageBasedPlatformLocation(_brokerFactory, _platformLocation, bus, _serializer) {
    this._brokerFactory = _brokerFactory;
    this._platformLocation = _platformLocation;
    this._serializer = _serializer;
    this._platformLocation.onPopState(bind_1.bind(this._sendUrlChangeEvent, this));
    this._platformLocation.onHashChange(bind_1.bind(this._sendUrlChangeEvent, this));
    this._broker = this._brokerFactory.createMessageBroker(messaging_api_1.ROUTER_CHANNEL);
    this._channelSink = bus.to(messaging_api_1.ROUTER_CHANNEL);
  }
  MessageBasedPlatformLocation.prototype.start = function() {
    this._broker.registerMethod("getLocation", null, bind_1.bind(this._getLocation, this), serialized_types_1.LocationType);
    this._broker.registerMethod("setPathname", [serializer_1.PRIMITIVE], bind_1.bind(this._setPathname, this));
    this._broker.registerMethod("pushState", [serializer_1.PRIMITIVE, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._platformLocation.pushState, this._platformLocation));
    this._broker.registerMethod("replaceState", [serializer_1.PRIMITIVE, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._platformLocation.replaceState, this._platformLocation));
    this._broker.registerMethod("forward", null, bind_1.bind(this._platformLocation.forward, this._platformLocation));
    this._broker.registerMethod("back", null, bind_1.bind(this._platformLocation.back, this._platformLocation));
  };
  MessageBasedPlatformLocation.prototype._getLocation = function() {
    return async_1.PromiseWrapper.resolve(this._platformLocation.location);
  };
  MessageBasedPlatformLocation.prototype._sendUrlChangeEvent = function(e) {
    var loc = this._serializer.serialize(this._platformLocation.location, serialized_types_1.LocationType);
    var serializedEvent = {'type': e.type};
    async_1.ObservableWrapper.callEmit(this._channelSink, {
      'event': serializedEvent,
      'location': loc
    });
  };
  MessageBasedPlatformLocation.prototype._setPathname = function(pathname) {
    this._platformLocation.pathname = pathname;
  };
  MessageBasedPlatformLocation = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [service_message_broker_1.ServiceMessageBrokerFactory, browser_platform_location_1.BrowserPlatformLocation, message_bus_1.MessageBus, serializer_1.Serializer])], MessageBasedPlatformLocation);
  return MessageBasedPlatformLocation;
})();
exports.MessageBasedPlatformLocation = MessageBasedPlatformLocation;
