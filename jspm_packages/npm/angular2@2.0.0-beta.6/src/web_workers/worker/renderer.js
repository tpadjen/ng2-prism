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
var api_1 = require('../../core/render/api');
var client_message_broker_1 = require('../shared/client_message_broker');
var lang_1 = require('../../facade/lang');
var collection_1 = require('../../facade/collection');
var di_1 = require('../../core/di');
var render_store_1 = require('../shared/render_store');
var messaging_api_1 = require('../shared/messaging_api');
var serializer_1 = require('../shared/serializer');
var messaging_api_2 = require('../shared/messaging_api');
var message_bus_1 = require('../shared/message_bus');
var async_1 = require('../../facade/async');
var view_1 = require('../../core/metadata/view');
var event_deserializer_1 = require('./event_deserializer');
var WebWorkerRootRenderer = (function() {
  function WebWorkerRootRenderer(messageBrokerFactory, bus, _serializer, _renderStore) {
    var _this = this;
    this._serializer = _serializer;
    this._renderStore = _renderStore;
    this.globalEvents = new NamedEventEmitter();
    this._componentRenderers = new Map();
    this._messageBroker = messageBrokerFactory.createMessageBroker(messaging_api_1.RENDERER_CHANNEL);
    bus.initChannel(messaging_api_2.EVENT_CHANNEL);
    var source = bus.from(messaging_api_2.EVENT_CHANNEL);
    async_1.ObservableWrapper.subscribe(source, function(message) {
      return _this._dispatchEvent(message);
    });
  }
  WebWorkerRootRenderer.prototype._dispatchEvent = function(message) {
    var eventName = message['eventName'];
    var target = message['eventTarget'];
    var event = event_deserializer_1.deserializeGenericEvent(message['event']);
    if (lang_1.isPresent(target)) {
      this.globalEvents.dispatchEvent(eventNameWithTarget(target, eventName), event);
    } else {
      var element = this._serializer.deserialize(message['element'], serializer_1.RenderStoreObject);
      element.events.dispatchEvent(eventName, event);
    }
  };
  WebWorkerRootRenderer.prototype.renderComponent = function(componentType) {
    var result = this._componentRenderers.get(componentType.id);
    if (lang_1.isBlank(result)) {
      result = new WebWorkerRenderer(this, componentType);
      this._componentRenderers.set(componentType.id, result);
      var id = this._renderStore.allocateId();
      this._renderStore.store(result, id);
      this.runOnService('renderComponent', [new client_message_broker_1.FnArg(componentType, api_1.RenderComponentType), new client_message_broker_1.FnArg(result, serializer_1.RenderStoreObject)]);
    }
    return result;
  };
  WebWorkerRootRenderer.prototype.runOnService = function(fnName, fnArgs) {
    var args = new client_message_broker_1.UiArguments(fnName, fnArgs);
    this._messageBroker.runOnService(args, null);
  };
  WebWorkerRootRenderer.prototype.allocateNode = function() {
    var result = new WebWorkerRenderNode();
    var id = this._renderStore.allocateId();
    this._renderStore.store(result, id);
    return result;
  };
  WebWorkerRootRenderer.prototype.allocateId = function() {
    return this._renderStore.allocateId();
  };
  WebWorkerRootRenderer.prototype.destroyNodes = function(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      this._renderStore.remove(nodes[i]);
    }
  };
  WebWorkerRootRenderer = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [client_message_broker_1.ClientMessageBrokerFactory, message_bus_1.MessageBus, serializer_1.Serializer, render_store_1.RenderStore])], WebWorkerRootRenderer);
  return WebWorkerRootRenderer;
})();
exports.WebWorkerRootRenderer = WebWorkerRootRenderer;
var WebWorkerRenderer = (function() {
  function WebWorkerRenderer(_rootRenderer, _componentType) {
    this._rootRenderer = _rootRenderer;
    this._componentType = _componentType;
  }
  WebWorkerRenderer.prototype.renderComponent = function(componentType) {
    return this._rootRenderer.renderComponent(componentType);
  };
  WebWorkerRenderer.prototype._runOnService = function(fnName, fnArgs) {
    var fnArgsWithRenderer = [new client_message_broker_1.FnArg(this, serializer_1.RenderStoreObject)].concat(fnArgs);
    this._rootRenderer.runOnService(fnName, fnArgsWithRenderer);
  };
  WebWorkerRenderer.prototype.selectRootElement = function(selector) {
    var node = this._rootRenderer.allocateNode();
    this._runOnService('selectRootElement', [new client_message_broker_1.FnArg(selector, null), new client_message_broker_1.FnArg(node, serializer_1.RenderStoreObject)]);
    return node;
  };
  WebWorkerRenderer.prototype.createElement = function(parentElement, name) {
    var node = this._rootRenderer.allocateNode();
    this._runOnService('createElement', [new client_message_broker_1.FnArg(parentElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(name, null), new client_message_broker_1.FnArg(node, serializer_1.RenderStoreObject)]);
    return node;
  };
  WebWorkerRenderer.prototype.createViewRoot = function(hostElement) {
    var viewRoot = this._componentType.encapsulation === view_1.ViewEncapsulation.Native ? this._rootRenderer.allocateNode() : hostElement;
    this._runOnService('createViewRoot', [new client_message_broker_1.FnArg(hostElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(viewRoot, serializer_1.RenderStoreObject)]);
    return viewRoot;
  };
  WebWorkerRenderer.prototype.createTemplateAnchor = function(parentElement) {
    var node = this._rootRenderer.allocateNode();
    this._runOnService('createTemplateAnchor', [new client_message_broker_1.FnArg(parentElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(node, serializer_1.RenderStoreObject)]);
    return node;
  };
  WebWorkerRenderer.prototype.createText = function(parentElement, value) {
    var node = this._rootRenderer.allocateNode();
    this._runOnService('createText', [new client_message_broker_1.FnArg(parentElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(value, null), new client_message_broker_1.FnArg(node, serializer_1.RenderStoreObject)]);
    return node;
  };
  WebWorkerRenderer.prototype.projectNodes = function(parentElement, nodes) {
    this._runOnService('projectNodes', [new client_message_broker_1.FnArg(parentElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(nodes, serializer_1.RenderStoreObject)]);
  };
  WebWorkerRenderer.prototype.attachViewAfter = function(node, viewRootNodes) {
    this._runOnService('attachViewAfter', [new client_message_broker_1.FnArg(node, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(viewRootNodes, serializer_1.RenderStoreObject)]);
  };
  WebWorkerRenderer.prototype.detachView = function(viewRootNodes) {
    this._runOnService('detachView', [new client_message_broker_1.FnArg(viewRootNodes, serializer_1.RenderStoreObject)]);
  };
  WebWorkerRenderer.prototype.destroyView = function(hostElement, viewAllNodes) {
    this._runOnService('destroyView', [new client_message_broker_1.FnArg(hostElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(viewAllNodes, serializer_1.RenderStoreObject)]);
    this._rootRenderer.destroyNodes(viewAllNodes);
  };
  WebWorkerRenderer.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {
    this._runOnService('setElementProperty', [new client_message_broker_1.FnArg(renderElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(propertyName, null), new client_message_broker_1.FnArg(propertyValue, null)]);
  };
  WebWorkerRenderer.prototype.setElementAttribute = function(renderElement, attributeName, attributeValue) {
    this._runOnService('setElementAttribute', [new client_message_broker_1.FnArg(renderElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(attributeName, null), new client_message_broker_1.FnArg(attributeValue, null)]);
  };
  WebWorkerRenderer.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {
    this._runOnService('setBindingDebugInfo', [new client_message_broker_1.FnArg(renderElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(propertyName, null), new client_message_broker_1.FnArg(propertyValue, null)]);
  };
  WebWorkerRenderer.prototype.setElementDebugInfo = function(renderElement, info) {};
  WebWorkerRenderer.prototype.setElementClass = function(renderElement, className, isAdd) {
    this._runOnService('setElementClass', [new client_message_broker_1.FnArg(renderElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(className, null), new client_message_broker_1.FnArg(isAdd, null)]);
  };
  WebWorkerRenderer.prototype.setElementStyle = function(renderElement, styleName, styleValue) {
    this._runOnService('setElementStyle', [new client_message_broker_1.FnArg(renderElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(styleName, null), new client_message_broker_1.FnArg(styleValue, null)]);
  };
  WebWorkerRenderer.prototype.invokeElementMethod = function(renderElement, methodName, args) {
    this._runOnService('invokeElementMethod', [new client_message_broker_1.FnArg(renderElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(methodName, null), new client_message_broker_1.FnArg(args, null)]);
  };
  WebWorkerRenderer.prototype.setText = function(renderNode, text) {
    this._runOnService('setText', [new client_message_broker_1.FnArg(renderNode, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(text, null)]);
  };
  WebWorkerRenderer.prototype.listen = function(renderElement, name, callback) {
    var _this = this;
    renderElement.events.listen(name, callback);
    var unlistenCallbackId = this._rootRenderer.allocateId();
    this._runOnService('listen', [new client_message_broker_1.FnArg(renderElement, serializer_1.RenderStoreObject), new client_message_broker_1.FnArg(name, null), new client_message_broker_1.FnArg(unlistenCallbackId, null)]);
    return function() {
      renderElement.events.unlisten(name, callback);
      _this._runOnService('listenDone', [new client_message_broker_1.FnArg(unlistenCallbackId, null)]);
    };
  };
  WebWorkerRenderer.prototype.listenGlobal = function(target, name, callback) {
    var _this = this;
    this._rootRenderer.globalEvents.listen(eventNameWithTarget(target, name), callback);
    var unlistenCallbackId = this._rootRenderer.allocateId();
    this._runOnService('listenGlobal', [new client_message_broker_1.FnArg(target, null), new client_message_broker_1.FnArg(name, null), new client_message_broker_1.FnArg(unlistenCallbackId, null)]);
    return function() {
      _this._rootRenderer.globalEvents.unlisten(eventNameWithTarget(target, name), callback);
      _this._runOnService('listenDone', [new client_message_broker_1.FnArg(unlistenCallbackId, null)]);
    };
  };
  return WebWorkerRenderer;
})();
exports.WebWorkerRenderer = WebWorkerRenderer;
var NamedEventEmitter = (function() {
  function NamedEventEmitter() {}
  NamedEventEmitter.prototype._getListeners = function(eventName) {
    if (lang_1.isBlank(this._listeners)) {
      this._listeners = new Map();
    }
    var listeners = this._listeners.get(eventName);
    if (lang_1.isBlank(listeners)) {
      listeners = [];
      this._listeners.set(eventName, listeners);
    }
    return listeners;
  };
  NamedEventEmitter.prototype.listen = function(eventName, callback) {
    this._getListeners(eventName).push(callback);
  };
  NamedEventEmitter.prototype.unlisten = function(eventName, callback) {
    collection_1.ListWrapper.remove(this._getListeners(eventName), callback);
  };
  NamedEventEmitter.prototype.dispatchEvent = function(eventName, event) {
    var listeners = this._getListeners(eventName);
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  };
  return NamedEventEmitter;
})();
exports.NamedEventEmitter = NamedEventEmitter;
function eventNameWithTarget(target, eventName) {
  return target + ":" + eventName;
}
var WebWorkerRenderNode = (function() {
  function WebWorkerRenderNode() {
    this.events = new NamedEventEmitter();
  }
  return WebWorkerRenderNode;
})();
exports.WebWorkerRenderNode = WebWorkerRenderNode;
