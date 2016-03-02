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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var di_1 = require('../../core/di');
var animation_builder_1 = require('../../animate/animation_builder');
var lang_1 = require('../../facade/lang');
var exceptions_1 = require('../../facade/exceptions');
var shared_styles_host_1 = require('./shared_styles_host');
var event_manager_1 = require('./events/event_manager');
var dom_tokens_1 = require('./dom_tokens');
var metadata_1 = require('../../core/metadata');
var dom_adapter_1 = require('./dom_adapter');
var util_1 = require('./util');
var NAMESPACE_URIS = lang_1.CONST_EXPR({
  'xlink': 'http://www.w3.org/1999/xlink',
  'svg': 'http://www.w3.org/2000/svg'
});
var TEMPLATE_COMMENT_TEXT = 'template bindings={}';
var TEMPLATE_BINDINGS_EXP = /^template bindings=(.*)$/g;
var DomRootRenderer = (function() {
  function DomRootRenderer(document, eventManager, sharedStylesHost, animate) {
    this.document = document;
    this.eventManager = eventManager;
    this.sharedStylesHost = sharedStylesHost;
    this.animate = animate;
    this._registeredComponents = new Map();
  }
  DomRootRenderer.prototype.renderComponent = function(componentProto) {
    var renderer = this._registeredComponents.get(componentProto.id);
    if (lang_1.isBlank(renderer)) {
      renderer = new DomRenderer(this, componentProto);
      this._registeredComponents.set(componentProto.id, renderer);
    }
    return renderer;
  };
  return DomRootRenderer;
})();
exports.DomRootRenderer = DomRootRenderer;
var DomRootRenderer_ = (function(_super) {
  __extends(DomRootRenderer_, _super);
  function DomRootRenderer_(_document, _eventManager, sharedStylesHost, animate) {
    _super.call(this, _document, _eventManager, sharedStylesHost, animate);
  }
  DomRootRenderer_ = __decorate([di_1.Injectable(), __param(0, di_1.Inject(dom_tokens_1.DOCUMENT)), __metadata('design:paramtypes', [Object, event_manager_1.EventManager, shared_styles_host_1.DomSharedStylesHost, animation_builder_1.AnimationBuilder])], DomRootRenderer_);
  return DomRootRenderer_;
})(DomRootRenderer);
exports.DomRootRenderer_ = DomRootRenderer_;
var DomRenderer = (function() {
  function DomRenderer(_rootRenderer, componentProto) {
    this._rootRenderer = _rootRenderer;
    this.componentProto = componentProto;
    this._styles = _flattenStyles(componentProto.id, componentProto.styles, []);
    if (componentProto.encapsulation !== metadata_1.ViewEncapsulation.Native) {
      this._rootRenderer.sharedStylesHost.addStyles(this._styles);
    }
    if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Emulated) {
      this._contentAttr = _shimContentAttribute(componentProto.id);
      this._hostAttr = _shimHostAttribute(componentProto.id);
    } else {
      this._contentAttr = null;
      this._hostAttr = null;
    }
  }
  DomRenderer.prototype.renderComponent = function(componentProto) {
    return this._rootRenderer.renderComponent(componentProto);
  };
  DomRenderer.prototype.selectRootElement = function(selector) {
    var el = dom_adapter_1.DOM.querySelector(this._rootRenderer.document, selector);
    if (lang_1.isBlank(el)) {
      throw new exceptions_1.BaseException("The selector \"" + selector + "\" did not match any elements");
    }
    dom_adapter_1.DOM.clearNodes(el);
    return el;
  };
  DomRenderer.prototype.createElement = function(parent, name) {
    var nsAndName = splitNamespace(name);
    var el = lang_1.isPresent(nsAndName[0]) ? dom_adapter_1.DOM.createElementNS(NAMESPACE_URIS[nsAndName[0]], nsAndName[1]) : dom_adapter_1.DOM.createElement(nsAndName[1]);
    if (lang_1.isPresent(this._contentAttr)) {
      dom_adapter_1.DOM.setAttribute(el, this._contentAttr, '');
    }
    if (lang_1.isPresent(parent)) {
      dom_adapter_1.DOM.appendChild(parent, el);
    }
    return el;
  };
  DomRenderer.prototype.createViewRoot = function(hostElement) {
    var nodesParent;
    if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Native) {
      nodesParent = dom_adapter_1.DOM.createShadowRoot(hostElement);
      this._rootRenderer.sharedStylesHost.addHost(nodesParent);
      for (var i = 0; i < this._styles.length; i++) {
        dom_adapter_1.DOM.appendChild(nodesParent, dom_adapter_1.DOM.createStyleElement(this._styles[i]));
      }
    } else {
      if (lang_1.isPresent(this._hostAttr)) {
        dom_adapter_1.DOM.setAttribute(hostElement, this._hostAttr, '');
      }
      nodesParent = hostElement;
    }
    return nodesParent;
  };
  DomRenderer.prototype.createTemplateAnchor = function(parentElement) {
    var comment = dom_adapter_1.DOM.createComment(TEMPLATE_COMMENT_TEXT);
    if (lang_1.isPresent(parentElement)) {
      dom_adapter_1.DOM.appendChild(parentElement, comment);
    }
    return comment;
  };
  DomRenderer.prototype.createText = function(parentElement, value) {
    var node = dom_adapter_1.DOM.createTextNode(value);
    if (lang_1.isPresent(parentElement)) {
      dom_adapter_1.DOM.appendChild(parentElement, node);
    }
    return node;
  };
  DomRenderer.prototype.projectNodes = function(parentElement, nodes) {
    if (lang_1.isBlank(parentElement))
      return;
    appendNodes(parentElement, nodes);
  };
  DomRenderer.prototype.attachViewAfter = function(node, viewRootNodes) {
    moveNodesAfterSibling(node, viewRootNodes);
    for (var i = 0; i < viewRootNodes.length; i++)
      this.animateNodeEnter(viewRootNodes[i]);
  };
  DomRenderer.prototype.detachView = function(viewRootNodes) {
    for (var i = 0; i < viewRootNodes.length; i++) {
      var node = viewRootNodes[i];
      dom_adapter_1.DOM.remove(node);
      this.animateNodeLeave(node);
    }
  };
  DomRenderer.prototype.destroyView = function(hostElement, viewAllNodes) {
    if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Native && lang_1.isPresent(hostElement)) {
      this._rootRenderer.sharedStylesHost.removeHost(dom_adapter_1.DOM.getShadowRoot(hostElement));
    }
  };
  DomRenderer.prototype.listen = function(renderElement, name, callback) {
    return this._rootRenderer.eventManager.addEventListener(renderElement, name, decoratePreventDefault(callback));
  };
  DomRenderer.prototype.listenGlobal = function(target, name, callback) {
    return this._rootRenderer.eventManager.addGlobalEventListener(target, name, decoratePreventDefault(callback));
  };
  DomRenderer.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {
    dom_adapter_1.DOM.setProperty(renderElement, propertyName, propertyValue);
  };
  DomRenderer.prototype.setElementAttribute = function(renderElement, attributeName, attributeValue) {
    var attrNs;
    var nsAndName = splitNamespace(attributeName);
    if (lang_1.isPresent(nsAndName[0])) {
      attributeName = nsAndName[0] + ':' + nsAndName[1];
      attrNs = NAMESPACE_URIS[nsAndName[0]];
    }
    if (lang_1.isPresent(attributeValue)) {
      if (lang_1.isPresent(attrNs)) {
        dom_adapter_1.DOM.setAttributeNS(renderElement, attrNs, attributeName, attributeValue);
      } else {
        dom_adapter_1.DOM.setAttribute(renderElement, nsAndName[1], attributeValue);
      }
    } else {
      dom_adapter_1.DOM.removeAttribute(renderElement, attributeName);
    }
  };
  DomRenderer.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {
    var dashCasedPropertyName = util_1.camelCaseToDashCase(propertyName);
    if (dom_adapter_1.DOM.isCommentNode(renderElement)) {
      var existingBindings = lang_1.RegExpWrapper.firstMatch(TEMPLATE_BINDINGS_EXP, lang_1.StringWrapper.replaceAll(dom_adapter_1.DOM.getText(renderElement), /\n/g, ''));
      var parsedBindings = lang_1.Json.parse(existingBindings[1]);
      parsedBindings[dashCasedPropertyName] = propertyValue;
      dom_adapter_1.DOM.setText(renderElement, lang_1.StringWrapper.replace(TEMPLATE_COMMENT_TEXT, '{}', lang_1.Json.stringify(parsedBindings)));
    } else {
      this.setElementAttribute(renderElement, propertyName, propertyValue);
    }
  };
  DomRenderer.prototype.setElementDebugInfo = function(renderElement, info) {};
  DomRenderer.prototype.setElementClass = function(renderElement, className, isAdd) {
    if (isAdd) {
      dom_adapter_1.DOM.addClass(renderElement, className);
    } else {
      dom_adapter_1.DOM.removeClass(renderElement, className);
    }
  };
  DomRenderer.prototype.setElementStyle = function(renderElement, styleName, styleValue) {
    if (lang_1.isPresent(styleValue)) {
      dom_adapter_1.DOM.setStyle(renderElement, styleName, lang_1.stringify(styleValue));
    } else {
      dom_adapter_1.DOM.removeStyle(renderElement, styleName);
    }
  };
  DomRenderer.prototype.invokeElementMethod = function(renderElement, methodName, args) {
    dom_adapter_1.DOM.invoke(renderElement, methodName, args);
  };
  DomRenderer.prototype.setText = function(renderNode, text) {
    dom_adapter_1.DOM.setText(renderNode, text);
  };
  DomRenderer.prototype.animateNodeEnter = function(node) {
    if (dom_adapter_1.DOM.isElementNode(node) && dom_adapter_1.DOM.hasClass(node, 'ng-animate')) {
      dom_adapter_1.DOM.addClass(node, 'ng-enter');
      this._rootRenderer.animate.css().addAnimationClass('ng-enter-active').start(node).onComplete(function() {
        dom_adapter_1.DOM.removeClass(node, 'ng-enter');
      });
    }
  };
  DomRenderer.prototype.animateNodeLeave = function(node) {
    if (dom_adapter_1.DOM.isElementNode(node) && dom_adapter_1.DOM.hasClass(node, 'ng-animate')) {
      dom_adapter_1.DOM.addClass(node, 'ng-leave');
      this._rootRenderer.animate.css().addAnimationClass('ng-leave-active').start(node).onComplete(function() {
        dom_adapter_1.DOM.removeClass(node, 'ng-leave');
        dom_adapter_1.DOM.remove(node);
      });
    } else {
      dom_adapter_1.DOM.remove(node);
    }
  };
  return DomRenderer;
})();
exports.DomRenderer = DomRenderer;
function moveNodesAfterSibling(sibling, nodes) {
  var parent = dom_adapter_1.DOM.parentElement(sibling);
  if (nodes.length > 0 && lang_1.isPresent(parent)) {
    var nextSibling = dom_adapter_1.DOM.nextSibling(sibling);
    if (lang_1.isPresent(nextSibling)) {
      for (var i = 0; i < nodes.length; i++) {
        dom_adapter_1.DOM.insertBefore(nextSibling, nodes[i]);
      }
    } else {
      for (var i = 0; i < nodes.length; i++) {
        dom_adapter_1.DOM.appendChild(parent, nodes[i]);
      }
    }
  }
}
function appendNodes(parent, nodes) {
  for (var i = 0; i < nodes.length; i++) {
    dom_adapter_1.DOM.appendChild(parent, nodes[i]);
  }
}
function decoratePreventDefault(eventHandler) {
  return function(event) {
    var allowDefaultBehavior = eventHandler(event);
    if (allowDefaultBehavior === false) {
      dom_adapter_1.DOM.preventDefault(event);
    }
  };
}
var COMPONENT_REGEX = /%COMP%/g;
exports.COMPONENT_VARIABLE = '%COMP%';
exports.HOST_ATTR = "_nghost-" + exports.COMPONENT_VARIABLE;
exports.CONTENT_ATTR = "_ngcontent-" + exports.COMPONENT_VARIABLE;
function _shimContentAttribute(componentShortId) {
  return lang_1.StringWrapper.replaceAll(exports.CONTENT_ATTR, COMPONENT_REGEX, componentShortId);
}
function _shimHostAttribute(componentShortId) {
  return lang_1.StringWrapper.replaceAll(exports.HOST_ATTR, COMPONENT_REGEX, componentShortId);
}
function _flattenStyles(compId, styles, target) {
  for (var i = 0; i < styles.length; i++) {
    var style = styles[i];
    if (lang_1.isArray(style)) {
      _flattenStyles(compId, style, target);
    } else {
      style = lang_1.StringWrapper.replaceAll(style, COMPONENT_REGEX, compId);
      target.push(style);
    }
  }
  return target;
}
var NS_PREFIX_RE = /^@([^:]+):(.+)/g;
function splitNamespace(name) {
  if (name[0] != '@') {
    return [null, name];
  }
  var match = lang_1.RegExpWrapper.firstMatch(NS_PREFIX_RE, name);
  return [match[1], match[2]];
}
