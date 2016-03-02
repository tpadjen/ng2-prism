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
var di_1 = require('../di');
var lang_1 = require('../../facade/lang');
var collection_1 = require('../../facade/collection');
var exceptions_1 = require('../../facade/exceptions');
var view_1 = require('./view');
var element_1 = require('./element');
var api_1 = require('../render/api');
var profile_1 = require('../profile/profile');
var application_tokens_1 = require('../application_tokens');
var view_type_1 = require('./view_type');
var AppViewManager = (function() {
  function AppViewManager() {}
  return AppViewManager;
})();
exports.AppViewManager = AppViewManager;
var AppViewManager_ = (function(_super) {
  __extends(AppViewManager_, _super);
  function AppViewManager_(_renderer, _appId) {
    _super.call(this);
    this._renderer = _renderer;
    this._appId = _appId;
    this._nextCompTypeId = 0;
    this._createRootHostViewScope = profile_1.wtfCreateScope('AppViewManager#createRootHostView()');
    this._destroyRootHostViewScope = profile_1.wtfCreateScope('AppViewManager#destroyRootHostView()');
    this._createEmbeddedViewInContainerScope = profile_1.wtfCreateScope('AppViewManager#createEmbeddedViewInContainer()');
    this._createHostViewInContainerScope = profile_1.wtfCreateScope('AppViewManager#createHostViewInContainer()');
    this._destroyViewInContainerScope = profile_1.wtfCreateScope('AppViewMananger#destroyViewInContainer()');
    this._attachViewInContainerScope = profile_1.wtfCreateScope('AppViewMananger#attachViewInContainer()');
    this._detachViewInContainerScope = profile_1.wtfCreateScope('AppViewMananger#detachViewInContainer()');
  }
  AppViewManager_.prototype.getViewContainer = function(location) {
    return location.internalElement.getViewContainerRef();
  };
  AppViewManager_.prototype.getHostElement = function(hostViewRef) {
    var hostView = hostViewRef.internalView;
    if (hostView.proto.type !== view_type_1.ViewType.HOST) {
      throw new exceptions_1.BaseException('This operation is only allowed on host views');
    }
    return hostView.appElements[0].ref;
  };
  AppViewManager_.prototype.getNamedElementInComponentView = function(hostLocation, variableName) {
    var appEl = hostLocation.internalElement;
    var componentView = appEl.componentView;
    if (lang_1.isBlank(componentView)) {
      throw new exceptions_1.BaseException("There is no component directive at element " + hostLocation);
    }
    for (var i = 0; i < componentView.appElements.length; i++) {
      var compAppEl = componentView.appElements[i];
      if (collection_1.StringMapWrapper.contains(compAppEl.proto.directiveVariableBindings, variableName)) {
        return compAppEl.ref;
      }
    }
    throw new exceptions_1.BaseException("Could not find variable " + variableName);
  };
  AppViewManager_.prototype.getComponent = function(hostLocation) {
    return hostLocation.internalElement.getComponent();
  };
  AppViewManager_.prototype.createRootHostView = function(hostViewFactoryRef, overrideSelector, injector, projectableNodes) {
    if (projectableNodes === void 0) {
      projectableNodes = null;
    }
    var s = this._createRootHostViewScope();
    var hostViewFactory = hostViewFactoryRef.internalHostViewFactory;
    var selector = lang_1.isPresent(overrideSelector) ? overrideSelector : hostViewFactory.selector;
    var view = hostViewFactory.viewFactory(this._renderer, this, null, projectableNodes, selector, null, injector);
    return profile_1.wtfLeave(s, view.ref);
  };
  AppViewManager_.prototype.destroyRootHostView = function(hostViewRef) {
    var s = this._destroyRootHostViewScope();
    var hostView = hostViewRef.internalView;
    hostView.renderer.detachView(view_1.flattenNestedViewRenderNodes(hostView.rootNodesOrAppElements));
    hostView.destroy();
    profile_1.wtfLeave(s);
  };
  AppViewManager_.prototype.createEmbeddedViewInContainer = function(viewContainerLocation, index, templateRef) {
    var s = this._createEmbeddedViewInContainerScope();
    var contextEl = templateRef.elementRef.internalElement;
    var view = contextEl.embeddedViewFactory(contextEl.parentView.renderer, this, contextEl, contextEl.parentView.projectableNodes, null, null, null);
    this._attachViewToContainer(view, viewContainerLocation.internalElement, index);
    return profile_1.wtfLeave(s, view.ref);
  };
  AppViewManager_.prototype.createHostViewInContainer = function(viewContainerLocation, index, hostViewFactoryRef, dynamicallyCreatedProviders, projectableNodes) {
    var s = this._createHostViewInContainerScope();
    var viewContainerLocation_ = viewContainerLocation;
    var contextEl = viewContainerLocation_.internalElement;
    var hostViewFactory = hostViewFactoryRef.internalHostViewFactory;
    var view = hostViewFactory.viewFactory(contextEl.parentView.renderer, contextEl.parentView.viewManager, contextEl, projectableNodes, null, dynamicallyCreatedProviders, null);
    this._attachViewToContainer(view, viewContainerLocation_.internalElement, index);
    return profile_1.wtfLeave(s, view.ref);
  };
  AppViewManager_.prototype.destroyViewInContainer = function(viewContainerLocation, index) {
    var s = this._destroyViewInContainerScope();
    var view = this._detachViewInContainer(viewContainerLocation.internalElement, index);
    view.destroy();
    profile_1.wtfLeave(s);
  };
  AppViewManager_.prototype.attachViewInContainer = function(viewContainerLocation, index, viewRef) {
    var viewRef_ = viewRef;
    var s = this._attachViewInContainerScope();
    this._attachViewToContainer(viewRef_.internalView, viewContainerLocation.internalElement, index);
    return profile_1.wtfLeave(s, viewRef_);
  };
  AppViewManager_.prototype.detachViewInContainer = function(viewContainerLocation, index) {
    var s = this._detachViewInContainerScope();
    var view = this._detachViewInContainer(viewContainerLocation.internalElement, index);
    return profile_1.wtfLeave(s, view.ref);
  };
  AppViewManager_.prototype.onViewCreated = function(view) {};
  AppViewManager_.prototype.onViewDestroyed = function(view) {};
  AppViewManager_.prototype.createRenderComponentType = function(encapsulation, styles) {
    return new api_1.RenderComponentType(this._appId + "-" + this._nextCompTypeId++, encapsulation, styles);
  };
  AppViewManager_.prototype._attachViewToContainer = function(view, vcAppElement, viewIndex) {
    if (view.proto.type === view_type_1.ViewType.COMPONENT) {
      throw new exceptions_1.BaseException("Component views can't be moved!");
    }
    var nestedViews = vcAppElement.nestedViews;
    if (nestedViews == null) {
      nestedViews = [];
      vcAppElement.nestedViews = nestedViews;
    }
    collection_1.ListWrapper.insert(nestedViews, viewIndex, view);
    var refNode;
    if (viewIndex > 0) {
      var prevView = nestedViews[viewIndex - 1];
      refNode = prevView.rootNodesOrAppElements.length > 0 ? prevView.rootNodesOrAppElements[prevView.rootNodesOrAppElements.length - 1] : null;
    } else {
      refNode = vcAppElement.nativeElement;
    }
    if (lang_1.isPresent(refNode)) {
      var refRenderNode;
      if (refNode instanceof element_1.AppElement) {
        refRenderNode = refNode.nativeElement;
      } else {
        refRenderNode = refNode;
      }
      view.renderer.attachViewAfter(refRenderNode, view_1.flattenNestedViewRenderNodes(view.rootNodesOrAppElements));
    }
    vcAppElement.parentView.changeDetector.addContentChild(view.changeDetector);
    vcAppElement.traverseAndSetQueriesAsDirty();
  };
  AppViewManager_.prototype._detachViewInContainer = function(vcAppElement, viewIndex) {
    var view = collection_1.ListWrapper.removeAt(vcAppElement.nestedViews, viewIndex);
    if (view.proto.type === view_type_1.ViewType.COMPONENT) {
      throw new exceptions_1.BaseException("Component views can't be moved!");
    }
    vcAppElement.traverseAndSetQueriesAsDirty();
    view.renderer.detachView(view_1.flattenNestedViewRenderNodes(view.rootNodesOrAppElements));
    view.changeDetector.remove();
    return view;
  };
  AppViewManager_ = __decorate([di_1.Injectable(), __param(1, di_1.Inject(application_tokens_1.APP_ID)), __metadata('design:paramtypes', [api_1.RootRenderer, String])], AppViewManager_);
  return AppViewManager_;
})(AppViewManager);
exports.AppViewManager_ = AppViewManager_;
