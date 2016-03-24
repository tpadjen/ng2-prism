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
var lang_1 = require('../../facade/lang');
var __make_dart_analyzer_happy = null;
var RouteConfig = (function() {
  function RouteConfig(configs) {
    this.configs = configs;
  }
  RouteConfig = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Array])], RouteConfig);
  return RouteConfig;
})();
exports.RouteConfig = RouteConfig;
var AbstractRoute = (function() {
  function AbstractRoute(_a) {
    var name = _a.name,
        useAsDefault = _a.useAsDefault,
        path = _a.path,
        regex = _a.regex,
        serializer = _a.serializer,
        data = _a.data;
    this.name = name;
    this.useAsDefault = useAsDefault;
    this.path = path;
    this.regex = regex;
    this.serializer = serializer;
    this.data = data;
  }
  AbstractRoute = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], AbstractRoute);
  return AbstractRoute;
})();
exports.AbstractRoute = AbstractRoute;
var Route = (function(_super) {
  __extends(Route, _super);
  function Route(_a) {
    var name = _a.name,
        useAsDefault = _a.useAsDefault,
        path = _a.path,
        regex = _a.regex,
        serializer = _a.serializer,
        data = _a.data,
        component = _a.component;
    _super.call(this, {
      name: name,
      useAsDefault: useAsDefault,
      path: path,
      regex: regex,
      serializer: serializer,
      data: data
    });
    this.aux = null;
    this.component = component;
  }
  Route = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Route);
  return Route;
})(AbstractRoute);
exports.Route = Route;
var AuxRoute = (function(_super) {
  __extends(AuxRoute, _super);
  function AuxRoute(_a) {
    var name = _a.name,
        useAsDefault = _a.useAsDefault,
        path = _a.path,
        regex = _a.regex,
        serializer = _a.serializer,
        data = _a.data,
        component = _a.component;
    _super.call(this, {
      name: name,
      useAsDefault: useAsDefault,
      path: path,
      regex: regex,
      serializer: serializer,
      data: data
    });
    this.component = component;
  }
  AuxRoute = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], AuxRoute);
  return AuxRoute;
})(AbstractRoute);
exports.AuxRoute = AuxRoute;
var AsyncRoute = (function(_super) {
  __extends(AsyncRoute, _super);
  function AsyncRoute(_a) {
    var name = _a.name,
        useAsDefault = _a.useAsDefault,
        path = _a.path,
        regex = _a.regex,
        serializer = _a.serializer,
        data = _a.data,
        loader = _a.loader;
    _super.call(this, {
      name: name,
      useAsDefault: useAsDefault,
      path: path,
      regex: regex,
      serializer: serializer,
      data: data
    });
    this.aux = null;
    this.loader = loader;
  }
  AsyncRoute = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], AsyncRoute);
  return AsyncRoute;
})(AbstractRoute);
exports.AsyncRoute = AsyncRoute;
var Redirect = (function(_super) {
  __extends(Redirect, _super);
  function Redirect(_a) {
    var name = _a.name,
        useAsDefault = _a.useAsDefault,
        path = _a.path,
        regex = _a.regex,
        serializer = _a.serializer,
        data = _a.data,
        redirectTo = _a.redirectTo;
    _super.call(this, {
      name: name,
      useAsDefault: useAsDefault,
      path: path,
      regex: regex,
      serializer: serializer,
      data: data
    });
    this.redirectTo = redirectTo;
  }
  Redirect = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Redirect);
  return Redirect;
})(AbstractRoute);
exports.Redirect = Redirect;
