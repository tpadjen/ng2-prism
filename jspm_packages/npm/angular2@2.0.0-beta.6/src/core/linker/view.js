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
var collection_1 = require('../../facade/collection');
var change_detection_1 = require('../change_detection/change_detection');
var interfaces_1 = require('../change_detection/interfaces');
var element_1 = require('./element');
var lang_1 = require('../../facade/lang');
var exceptions_1 = require('../../facade/exceptions');
var api_1 = require('../render/api');
var view_ref_1 = require('./view_ref');
var pipes_1 = require('../pipes/pipes');
var util_1 = require('../render/util');
var interfaces_2 = require('../change_detection/interfaces');
exports.DebugContext = interfaces_2.DebugContext;
var pipes_2 = require('../pipes/pipes');
var view_type_1 = require('./view_type');
var REFLECT_PREFIX = 'ng-reflect-';
var EMPTY_CONTEXT = lang_1.CONST_EXPR(new Object());
var AppView = (function() {
  function AppView(proto, renderer, viewManager, projectableNodes, containerAppElement, imperativelyCreatedProviders, rootInjector, changeDetector) {
    this.proto = proto;
    this.renderer = renderer;
    this.viewManager = viewManager;
    this.projectableNodes = projectableNodes;
    this.containerAppElement = containerAppElement;
    this.changeDetector = changeDetector;
    this.context = null;
    this.destroyed = false;
    this.ref = new view_ref_1.ViewRef_(this);
    var injectorWithHostBoundary = element_1.AppElement.getViewParentInjector(this.proto.type, containerAppElement, imperativelyCreatedProviders, rootInjector);
    this.parentInjector = injectorWithHostBoundary.injector;
    this.hostInjectorBoundary = injectorWithHostBoundary.hostInjectorBoundary;
    var pipes;
    var context;
    switch (proto.type) {
      case view_type_1.ViewType.COMPONENT:
        pipes = new pipes_2.Pipes(proto.protoPipes, containerAppElement.getInjector());
        context = containerAppElement.getComponent();
        break;
      case view_type_1.ViewType.EMBEDDED:
        pipes = containerAppElement.parentView.pipes;
        context = containerAppElement.parentView.context;
        break;
      case view_type_1.ViewType.HOST:
        pipes = null;
        context = EMPTY_CONTEXT;
        break;
    }
    this.pipes = pipes;
    this.context = context;
  }
  AppView.prototype.init = function(rootNodesOrAppElements, allNodes, disposables, appElements) {
    this.rootNodesOrAppElements = rootNodesOrAppElements;
    this.allNodes = allNodes;
    this.disposables = disposables;
    this.appElements = appElements;
    var localsMap = new collection_1.Map();
    collection_1.StringMapWrapper.forEach(this.proto.templateVariableBindings, function(templateName, _) {
      localsMap.set(templateName, null);
    });
    for (var i = 0; i < appElements.length; i++) {
      var appEl = appElements[i];
      var providerTokens = [];
      if (lang_1.isPresent(appEl.proto.protoInjector)) {
        for (var j = 0; j < appEl.proto.protoInjector.numberOfProviders; j++) {
          providerTokens.push(appEl.proto.protoInjector.getProviderAtIndex(j).key.token);
        }
      }
      collection_1.StringMapWrapper.forEach(appEl.proto.directiveVariableBindings, function(directiveIndex, name) {
        if (lang_1.isBlank(directiveIndex)) {
          localsMap.set(name, appEl.nativeElement);
        } else {
          localsMap.set(name, appEl.getDirectiveAtIndex(directiveIndex));
        }
      });
      this.renderer.setElementDebugInfo(appEl.nativeElement, new api_1.RenderDebugInfo(appEl.getInjector(), appEl.getComponent(), providerTokens, localsMap));
    }
    var parentLocals = null;
    if (this.proto.type !== view_type_1.ViewType.COMPONENT) {
      parentLocals = lang_1.isPresent(this.containerAppElement) ? this.containerAppElement.parentView.locals : null;
    }
    if (this.proto.type === view_type_1.ViewType.COMPONENT) {
      this.containerAppElement.attachComponentView(this);
      this.containerAppElement.parentView.changeDetector.addViewChild(this.changeDetector);
    }
    this.locals = new change_detection_1.Locals(parentLocals, localsMap);
    this.changeDetector.hydrate(this.context, this.locals, this, this.pipes);
    this.viewManager.onViewCreated(this);
  };
  AppView.prototype.destroy = function() {
    if (this.destroyed) {
      throw new exceptions_1.BaseException('This view has already been destroyed!');
    }
    this.changeDetector.destroyRecursive();
  };
  AppView.prototype.notifyOnDestroy = function() {
    this.destroyed = true;
    var hostElement = this.proto.type === view_type_1.ViewType.COMPONENT ? this.containerAppElement.nativeElement : null;
    this.renderer.destroyView(hostElement, this.allNodes);
    for (var i = 0; i < this.disposables.length; i++) {
      this.disposables[i]();
    }
    this.viewManager.onViewDestroyed(this);
  };
  Object.defineProperty(AppView.prototype, "changeDetectorRef", {
    get: function() {
      return this.changeDetector.ref;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AppView.prototype, "flatRootNodes", {
    get: function() {
      return flattenNestedViewRenderNodes(this.rootNodesOrAppElements);
    },
    enumerable: true,
    configurable: true
  });
  AppView.prototype.hasLocal = function(contextName) {
    return collection_1.StringMapWrapper.contains(this.proto.templateVariableBindings, contextName);
  };
  AppView.prototype.setLocal = function(contextName, value) {
    if (!this.hasLocal(contextName)) {
      return;
    }
    var templateName = this.proto.templateVariableBindings[contextName];
    this.locals.set(templateName, value);
  };
  AppView.prototype.notifyOnBinding = function(b, currentValue) {
    if (b.isTextNode()) {
      this.renderer.setText(this.allNodes[b.elementIndex], currentValue);
    } else {
      var nativeElement = this.appElements[b.elementIndex].nativeElement;
      if (b.isElementProperty()) {
        this.renderer.setElementProperty(nativeElement, b.name, currentValue);
      } else if (b.isElementAttribute()) {
        this.renderer.setElementAttribute(nativeElement, b.name, lang_1.isPresent(currentValue) ? "" + currentValue : null);
      } else if (b.isElementClass()) {
        this.renderer.setElementClass(nativeElement, b.name, currentValue);
      } else if (b.isElementStyle()) {
        var unit = lang_1.isPresent(b.unit) ? b.unit : '';
        this.renderer.setElementStyle(nativeElement, b.name, lang_1.isPresent(currentValue) ? "" + currentValue + unit : null);
      } else {
        throw new exceptions_1.BaseException('Unsupported directive record');
      }
    }
  };
  AppView.prototype.logBindingUpdate = function(b, value) {
    if (b.isDirective() || b.isElementProperty()) {
      var nativeElement = this.appElements[b.elementIndex].nativeElement;
      this.renderer.setBindingDebugInfo(nativeElement, "" + REFLECT_PREFIX + util_1.camelCaseToDashCase(b.name), "" + value);
    }
  };
  AppView.prototype.notifyAfterContentChecked = function() {
    var count = this.appElements.length;
    for (var i = count - 1; i >= 0; i--) {
      this.appElements[i].ngAfterContentChecked();
    }
  };
  AppView.prototype.notifyAfterViewChecked = function() {
    var count = this.appElements.length;
    for (var i = count - 1; i >= 0; i--) {
      this.appElements[i].ngAfterViewChecked();
    }
  };
  AppView.prototype.getDebugContext = function(appElement, elementIndex, directiveIndex) {
    try {
      if (lang_1.isBlank(appElement) && elementIndex < this.appElements.length) {
        appElement = this.appElements[elementIndex];
      }
      var container = this.containerAppElement;
      var element = lang_1.isPresent(appElement) ? appElement.nativeElement : null;
      var componentElement = lang_1.isPresent(container) ? container.nativeElement : null;
      var directive = lang_1.isPresent(directiveIndex) ? appElement.getDirectiveAtIndex(directiveIndex) : null;
      var injector = lang_1.isPresent(appElement) ? appElement.getInjector() : null;
      return new interfaces_1.DebugContext(element, componentElement, directive, this.context, _localsToStringMap(this.locals), injector);
    } catch (e) {
      return null;
    }
  };
  AppView.prototype.getDirectiveFor = function(directive) {
    return this.appElements[directive.elementIndex].getDirectiveAtIndex(directive.directiveIndex);
  };
  AppView.prototype.getDetectorFor = function(directive) {
    var componentView = this.appElements[directive.elementIndex].componentView;
    return lang_1.isPresent(componentView) ? componentView.changeDetector : null;
  };
  AppView.prototype.triggerEventHandlers = function(eventName, eventObj, boundElementIndex) {
    return this.changeDetector.handleEvent(eventName, boundElementIndex, eventObj);
  };
  return AppView;
})();
exports.AppView = AppView;
function _localsToStringMap(locals) {
  var res = {};
  var c = locals;
  while (lang_1.isPresent(c)) {
    res = collection_1.StringMapWrapper.merge(res, collection_1.MapWrapper.toStringMap(c.current));
    c = c.parent;
  }
  return res;
}
var AppProtoView = (function() {
  function AppProtoView(type, protoPipes, templateVariableBindings) {
    this.type = type;
    this.protoPipes = protoPipes;
    this.templateVariableBindings = templateVariableBindings;
  }
  AppProtoView.create = function(metadataCache, type, pipes, templateVariableBindings) {
    var protoPipes = null;
    if (lang_1.isPresent(pipes) && pipes.length > 0) {
      var boundPipes = collection_1.ListWrapper.createFixedSize(pipes.length);
      for (var i = 0; i < pipes.length; i++) {
        boundPipes[i] = metadataCache.getResolvedPipeMetadata(pipes[i]);
      }
      protoPipes = pipes_1.ProtoPipes.fromProviders(boundPipes);
    }
    return new AppProtoView(type, protoPipes, templateVariableBindings);
  };
  return AppProtoView;
})();
exports.AppProtoView = AppProtoView;
var HostViewFactory = (function() {
  function HostViewFactory(selector, viewFactory) {
    this.selector = selector;
    this.viewFactory = viewFactory;
  }
  HostViewFactory = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [String, Function])], HostViewFactory);
  return HostViewFactory;
})();
exports.HostViewFactory = HostViewFactory;
function flattenNestedViewRenderNodes(nodes) {
  return _flattenNestedViewRenderNodes(nodes, []);
}
exports.flattenNestedViewRenderNodes = flattenNestedViewRenderNodes;
function _flattenNestedViewRenderNodes(nodes, renderNodes) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node instanceof element_1.AppElement) {
      var appEl = node;
      renderNodes.push(appEl.nativeElement);
      if (lang_1.isPresent(appEl.nestedViews)) {
        for (var k = 0; k < appEl.nestedViews.length; k++) {
          _flattenNestedViewRenderNodes(appEl.nestedViews[k].rootNodesOrAppElements, renderNodes);
        }
      }
    } else {
      renderNodes.push(node);
    }
  }
  return renderNodes;
}
function checkSlotCount(componentName, expectedSlotCount, projectableNodes) {
  var givenSlotCount = lang_1.isPresent(projectableNodes) ? projectableNodes.length : 0;
  if (givenSlotCount < expectedSlotCount) {
    throw new exceptions_1.BaseException(("The component " + componentName + " has " + expectedSlotCount + " <ng-content> elements,") + (" but only " + givenSlotCount + " slots were provided."));
  }
}
exports.checkSlotCount = checkSlotCount;
