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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var async_1 = require('../../facade/async');
var collection_1 = require('../../facade/collection');
var lang_1 = require('../../facade/lang');
var core_1 = require('../../../core');
var routerMod = require('../router');
var instruction_1 = require('../instruction');
var hookMod = require('../lifecycle/lifecycle_annotations');
var route_lifecycle_reflector_1 = require('../lifecycle/route_lifecycle_reflector');
var _resolveToTrue = async_1.PromiseWrapper.resolve(true);
var RouterOutlet = (function() {
  function RouterOutlet(_elementRef, _loader, _parentRouter, nameAttr) {
    this._elementRef = _elementRef;
    this._loader = _loader;
    this._parentRouter = _parentRouter;
    this.name = null;
    this._componentRef = null;
    this._currentInstruction = null;
    if (lang_1.isPresent(nameAttr)) {
      this.name = nameAttr;
      this._parentRouter.registerAuxOutlet(this);
    } else {
      this._parentRouter.registerPrimaryOutlet(this);
    }
  }
  RouterOutlet.prototype.activate = function(nextInstruction) {
    var _this = this;
    var previousInstruction = this._currentInstruction;
    this._currentInstruction = nextInstruction;
    var componentType = nextInstruction.componentType;
    var childRouter = this._parentRouter.childRouter(componentType);
    var providers = core_1.Injector.resolve([core_1.provide(instruction_1.RouteData, {useValue: nextInstruction.routeData}), core_1.provide(instruction_1.RouteParams, {useValue: new instruction_1.RouteParams(nextInstruction.params)}), core_1.provide(routerMod.Router, {useValue: childRouter})]);
    this._componentRef = this._loader.loadNextToLocation(componentType, this._elementRef, providers);
    return this._componentRef.then(function(componentRef) {
      if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerOnActivate, componentType)) {
        return _this._componentRef.then(function(ref) {
          return ref.instance.routerOnActivate(nextInstruction, previousInstruction);
        });
      } else {
        return componentRef;
      }
    });
  };
  RouterOutlet.prototype.reuse = function(nextInstruction) {
    var previousInstruction = this._currentInstruction;
    this._currentInstruction = nextInstruction;
    if (lang_1.isBlank(this._componentRef)) {
      return this.activate(nextInstruction);
    } else {
      return async_1.PromiseWrapper.resolve(route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerOnReuse, this._currentInstruction.componentType) ? this._componentRef.then(function(ref) {
        return ref.instance.routerOnReuse(nextInstruction, previousInstruction);
      }) : true);
    }
  };
  RouterOutlet.prototype.deactivate = function(nextInstruction) {
    var _this = this;
    var next = _resolveToTrue;
    if (lang_1.isPresent(this._componentRef) && lang_1.isPresent(this._currentInstruction) && route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerOnDeactivate, this._currentInstruction.componentType)) {
      next = this._componentRef.then(function(ref) {
        return ref.instance.routerOnDeactivate(nextInstruction, _this._currentInstruction);
      });
    }
    return next.then(function(_) {
      if (lang_1.isPresent(_this._componentRef)) {
        var onDispose = _this._componentRef.then(function(ref) {
          return ref.dispose();
        });
        _this._componentRef = null;
        return onDispose;
      }
    });
  };
  RouterOutlet.prototype.routerCanDeactivate = function(nextInstruction) {
    var _this = this;
    if (lang_1.isBlank(this._currentInstruction)) {
      return _resolveToTrue;
    }
    if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerCanDeactivate, this._currentInstruction.componentType)) {
      return this._componentRef.then(function(ref) {
        return ref.instance.routerCanDeactivate(nextInstruction, _this._currentInstruction);
      });
    } else {
      return _resolveToTrue;
    }
  };
  RouterOutlet.prototype.routerCanReuse = function(nextInstruction) {
    var _this = this;
    var result;
    if (lang_1.isBlank(this._currentInstruction) || this._currentInstruction.componentType != nextInstruction.componentType) {
      result = false;
    } else if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerCanReuse, this._currentInstruction.componentType)) {
      result = this._componentRef.then(function(ref) {
        return ref.instance.routerCanReuse(nextInstruction, _this._currentInstruction);
      });
    } else {
      result = nextInstruction == this._currentInstruction || (lang_1.isPresent(nextInstruction.params) && lang_1.isPresent(this._currentInstruction.params) && collection_1.StringMapWrapper.equals(nextInstruction.params, this._currentInstruction.params));
    }
    return async_1.PromiseWrapper.resolve(result);
  };
  RouterOutlet.prototype.ngOnDestroy = function() {
    this._parentRouter.unregisterPrimaryOutlet(this);
  };
  RouterOutlet = __decorate([core_1.Directive({selector: 'router-outlet'}), __param(3, core_1.Attribute('name')), __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, routerMod.Router, String])], RouterOutlet);
  return RouterOutlet;
})();
exports.RouterOutlet = RouterOutlet;
