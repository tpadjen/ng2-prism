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
var di_1 = require('../../core/di');
var message_bus_1 = require('../shared/message_bus');
var serializer_1 = require('../shared/serializer');
var api_1 = require('../../core/render/api');
var messaging_api_1 = require('../shared/messaging_api');
var bind_1 = require('./bind');
var event_dispatcher_1 = require('./event_dispatcher');
var render_store_1 = require('../shared/render_store');
var service_message_broker_1 = require('../shared/service_message_broker');
var MessageBasedRenderer = (function() {
  function MessageBasedRenderer(_brokerFactory, _bus, _serializer, _renderStore, _rootRenderer) {
    this._brokerFactory = _brokerFactory;
    this._bus = _bus;
    this._serializer = _serializer;
    this._renderStore = _renderStore;
    this._rootRenderer = _rootRenderer;
  }
  MessageBasedRenderer.prototype.start = function() {
    var broker = this._brokerFactory.createMessageBroker(messaging_api_1.RENDERER_CHANNEL);
    this._bus.initChannel(messaging_api_1.EVENT_CHANNEL);
    this._eventDispatcher = new event_dispatcher_1.EventDispatcher(this._bus.to(messaging_api_1.EVENT_CHANNEL), this._serializer);
    broker.registerMethod("renderComponent", [api_1.RenderComponentType, serializer_1.PRIMITIVE], bind_1.bind(this._renderComponent, this));
    broker.registerMethod("selectRootElement", [serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._selectRootElement, this));
    broker.registerMethod("createElement", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._createElement, this));
    broker.registerMethod("createViewRoot", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE], bind_1.bind(this._createViewRoot, this));
    broker.registerMethod("createTemplateAnchor", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE], bind_1.bind(this._createTemplateAnchor, this));
    broker.registerMethod("createText", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._createText, this));
    broker.registerMethod("projectNodes", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.RenderStoreObject], bind_1.bind(this._projectNodes, this));
    broker.registerMethod("attachViewAfter", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.RenderStoreObject], bind_1.bind(this._attachViewAfter, this));
    broker.registerMethod("detachView", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject], bind_1.bind(this._detachView, this));
    broker.registerMethod("destroyView", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.RenderStoreObject], bind_1.bind(this._destroyView, this));
    broker.registerMethod("setElementProperty", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._setElementProperty, this));
    broker.registerMethod("setElementAttribute", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._setElementAttribute, this));
    broker.registerMethod("setBindingDebugInfo", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._setBindingDebugInfo, this));
    broker.registerMethod("setElementClass", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._setElementClass, this));
    broker.registerMethod("setElementStyle", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._setElementStyle, this));
    broker.registerMethod("invokeElementMethod", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._invokeElementMethod, this));
    broker.registerMethod("setText", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE], bind_1.bind(this._setText, this));
    broker.registerMethod("listen", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._listen, this));
    broker.registerMethod("listenGlobal", [serializer_1.RenderStoreObject, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._listenGlobal, this));
    broker.registerMethod("listenDone", [serializer_1.RenderStoreObject, serializer_1.RenderStoreObject], bind_1.bind(this._listenDone, this));
  };
  MessageBasedRenderer.prototype._renderComponent = function(renderComponentType, rendererId) {
    var renderer = this._rootRenderer.renderComponent(renderComponentType);
    this._renderStore.store(renderer, rendererId);
  };
  MessageBasedRenderer.prototype._selectRootElement = function(renderer, selector, elId) {
    this._renderStore.store(renderer.selectRootElement(selector), elId);
  };
  MessageBasedRenderer.prototype._createElement = function(renderer, parentElement, name, elId) {
    this._renderStore.store(renderer.createElement(parentElement, name), elId);
  };
  MessageBasedRenderer.prototype._createViewRoot = function(renderer, hostElement, elId) {
    var viewRoot = renderer.createViewRoot(hostElement);
    if (this._renderStore.serialize(hostElement) !== elId) {
      this._renderStore.store(viewRoot, elId);
    }
  };
  MessageBasedRenderer.prototype._createTemplateAnchor = function(renderer, parentElement, elId) {
    this._renderStore.store(renderer.createTemplateAnchor(parentElement), elId);
  };
  MessageBasedRenderer.prototype._createText = function(renderer, parentElement, value, elId) {
    this._renderStore.store(renderer.createText(parentElement, value), elId);
  };
  MessageBasedRenderer.prototype._projectNodes = function(renderer, parentElement, nodes) {
    renderer.projectNodes(parentElement, nodes);
  };
  MessageBasedRenderer.prototype._attachViewAfter = function(renderer, node, viewRootNodes) {
    renderer.attachViewAfter(node, viewRootNodes);
  };
  MessageBasedRenderer.prototype._detachView = function(renderer, viewRootNodes) {
    renderer.detachView(viewRootNodes);
  };
  MessageBasedRenderer.prototype._destroyView = function(renderer, hostElement, viewAllNodes) {
    renderer.destroyView(hostElement, viewAllNodes);
    for (var i = 0; i < viewAllNodes.length; i++) {
      this._renderStore.remove(viewAllNodes[i]);
    }
  };
  MessageBasedRenderer.prototype._setElementProperty = function(renderer, renderElement, propertyName, propertyValue) {
    renderer.setElementProperty(renderElement, propertyName, propertyValue);
  };
  MessageBasedRenderer.prototype._setElementAttribute = function(renderer, renderElement, attributeName, attributeValue) {
    renderer.setElementAttribute(renderElement, attributeName, attributeValue);
  };
  MessageBasedRenderer.prototype._setBindingDebugInfo = function(renderer, renderElement, propertyName, propertyValue) {
    renderer.setBindingDebugInfo(renderElement, propertyName, propertyValue);
  };
  MessageBasedRenderer.prototype._setElementClass = function(renderer, renderElement, className, isAdd) {
    renderer.setElementClass(renderElement, className, isAdd);
  };
  MessageBasedRenderer.prototype._setElementStyle = function(renderer, renderElement, styleName, styleValue) {
    renderer.setElementStyle(renderElement, styleName, styleValue);
  };
  MessageBasedRenderer.prototype._invokeElementMethod = function(renderer, renderElement, methodName, args) {
    renderer.invokeElementMethod(renderElement, methodName, args);
  };
  MessageBasedRenderer.prototype._setText = function(renderer, renderNode, text) {
    renderer.setText(renderNode, text);
  };
  MessageBasedRenderer.prototype._listen = function(renderer, renderElement, eventName, unlistenId) {
    var _this = this;
    var unregisterCallback = renderer.listen(renderElement, eventName, function(event) {
      return _this._eventDispatcher.dispatchRenderEvent(renderElement, null, eventName, event);
    });
    this._renderStore.store(unregisterCallback, unlistenId);
  };
  MessageBasedRenderer.prototype._listenGlobal = function(renderer, eventTarget, eventName, unlistenId) {
    var _this = this;
    var unregisterCallback = renderer.listenGlobal(eventTarget, eventName, function(event) {
      return _this._eventDispatcher.dispatchRenderEvent(null, eventTarget, eventName, event);
    });
    this._renderStore.store(unregisterCallback, unlistenId);
  };
  MessageBasedRenderer.prototype._listenDone = function(renderer, unlistenCallback) {
    unlistenCallback();
  };
  MessageBasedRenderer = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [service_message_broker_1.ServiceMessageBrokerFactory, message_bus_1.MessageBus, serializer_1.Serializer, render_store_1.RenderStore, api_1.RootRenderer])], MessageBasedRenderer);
  return MessageBasedRenderer;
})();
exports.MessageBasedRenderer = MessageBasedRenderer;
