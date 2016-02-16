/* */ 
'use strict';
var lang_1 = require('../../facade/lang');
var debug_node_1 = require('./debug_node');
var DebugDomRootRenderer = (function() {
  function DebugDomRootRenderer(_delegate) {
    this._delegate = _delegate;
  }
  DebugDomRootRenderer.prototype.renderComponent = function(componentProto) {
    return new DebugDomRenderer(this, this._delegate.renderComponent(componentProto));
  };
  return DebugDomRootRenderer;
})();
exports.DebugDomRootRenderer = DebugDomRootRenderer;
var DebugDomRenderer = (function() {
  function DebugDomRenderer(_rootRenderer, _delegate) {
    this._rootRenderer = _rootRenderer;
    this._delegate = _delegate;
  }
  DebugDomRenderer.prototype.renderComponent = function(componentType) {
    return this._rootRenderer.renderComponent(componentType);
  };
  DebugDomRenderer.prototype.selectRootElement = function(selector) {
    var nativeEl = this._delegate.selectRootElement(selector);
    var debugEl = new debug_node_1.DebugElement(nativeEl, null);
    debug_node_1.indexDebugNode(debugEl);
    return nativeEl;
  };
  DebugDomRenderer.prototype.createElement = function(parentElement, name) {
    var nativeEl = this._delegate.createElement(parentElement, name);
    var debugEl = new debug_node_1.DebugElement(nativeEl, debug_node_1.getDebugNode(parentElement));
    debugEl.name = name;
    debug_node_1.indexDebugNode(debugEl);
    return nativeEl;
  };
  DebugDomRenderer.prototype.createViewRoot = function(hostElement) {
    return this._delegate.createViewRoot(hostElement);
  };
  DebugDomRenderer.prototype.createTemplateAnchor = function(parentElement) {
    var comment = this._delegate.createTemplateAnchor(parentElement);
    var debugEl = new debug_node_1.DebugNode(comment, debug_node_1.getDebugNode(parentElement));
    debug_node_1.indexDebugNode(debugEl);
    return comment;
  };
  DebugDomRenderer.prototype.createText = function(parentElement, value) {
    var text = this._delegate.createText(parentElement, value);
    var debugEl = new debug_node_1.DebugNode(text, debug_node_1.getDebugNode(parentElement));
    debug_node_1.indexDebugNode(debugEl);
    return text;
  };
  DebugDomRenderer.prototype.projectNodes = function(parentElement, nodes) {
    var debugParent = debug_node_1.getDebugNode(parentElement);
    if (lang_1.isPresent(debugParent) && debugParent instanceof debug_node_1.DebugElement) {
      nodes.forEach(function(node) {
        debugParent.addChild(debug_node_1.getDebugNode(node));
      });
    }
    return this._delegate.projectNodes(parentElement, nodes);
  };
  DebugDomRenderer.prototype.attachViewAfter = function(node, viewRootNodes) {
    var debugNode = debug_node_1.getDebugNode(node);
    if (lang_1.isPresent(debugNode)) {
      var debugParent = debugNode.parent;
      if (viewRootNodes.length > 0 && lang_1.isPresent(debugParent)) {
        var debugViewRootNodes = [];
        viewRootNodes.forEach(function(rootNode) {
          return debugViewRootNodes.push(debug_node_1.getDebugNode(rootNode));
        });
        debugParent.insertChildrenAfter(debugNode, debugViewRootNodes);
      }
    }
    return this._delegate.attachViewAfter(node, viewRootNodes);
  };
  DebugDomRenderer.prototype.detachView = function(viewRootNodes) {
    viewRootNodes.forEach(function(node) {
      var debugNode = debug_node_1.getDebugNode(node);
      if (lang_1.isPresent(debugNode) && lang_1.isPresent(debugNode.parent)) {
        debugNode.parent.removeChild(debugNode);
      }
    });
    return this._delegate.detachView(viewRootNodes);
  };
  DebugDomRenderer.prototype.destroyView = function(hostElement, viewAllNodes) {
    viewAllNodes.forEach(function(node) {
      debug_node_1.removeDebugNodeFromIndex(debug_node_1.getDebugNode(node));
    });
    return this._delegate.destroyView(hostElement, viewAllNodes);
  };
  DebugDomRenderer.prototype.listen = function(renderElement, name, callback) {
    var debugEl = debug_node_1.getDebugNode(renderElement);
    if (lang_1.isPresent(debugEl)) {
      debugEl.listeners.push(new debug_node_1.EventListener(name, callback));
    }
    return this._delegate.listen(renderElement, name, callback);
  };
  DebugDomRenderer.prototype.listenGlobal = function(target, name, callback) {
    return this._delegate.listenGlobal(target, name, callback);
  };
  DebugDomRenderer.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {
    var debugEl = debug_node_1.getDebugNode(renderElement);
    if (lang_1.isPresent(debugEl) && debugEl instanceof debug_node_1.DebugElement) {
      debugEl.properties.set(propertyName, propertyValue);
    }
    return this._delegate.setElementProperty(renderElement, propertyName, propertyValue);
  };
  DebugDomRenderer.prototype.setElementAttribute = function(renderElement, attributeName, attributeValue) {
    var debugEl = debug_node_1.getDebugNode(renderElement);
    if (lang_1.isPresent(debugEl) && debugEl instanceof debug_node_1.DebugElement) {
      debugEl.attributes.set(attributeName, attributeValue);
    }
    return this._delegate.setElementAttribute(renderElement, attributeName, attributeValue);
  };
  DebugDomRenderer.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {
    return this._delegate.setBindingDebugInfo(renderElement, propertyName, propertyValue);
  };
  DebugDomRenderer.prototype.setElementDebugInfo = function(renderElement, info) {
    var debugEl = debug_node_1.getDebugNode(renderElement);
    debugEl.setDebugInfo(info);
    return this._delegate.setElementDebugInfo(renderElement, info);
  };
  DebugDomRenderer.prototype.setElementClass = function(renderElement, className, isAdd) {
    return this._delegate.setElementClass(renderElement, className, isAdd);
  };
  DebugDomRenderer.prototype.setElementStyle = function(renderElement, styleName, styleValue) {
    return this._delegate.setElementStyle(renderElement, styleName, styleValue);
  };
  DebugDomRenderer.prototype.invokeElementMethod = function(renderElement, methodName, args) {
    return this._delegate.invokeElementMethod(renderElement, methodName, args);
  };
  DebugDomRenderer.prototype.setText = function(renderNode, text) {
    return this._delegate.setText(renderNode, text);
  };
  return DebugDomRenderer;
})();
exports.DebugDomRenderer = DebugDomRenderer;
