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
var di_1 = require('../di');
var lang_1 = require('../../facade/lang');
var exceptions_1 = require('../../facade/exceptions');
var async_1 = require('../../facade/async');
var reflection_1 = require('../reflection/reflection');
var view_1 = require('./view');
var view_ref_1 = require('./view_ref');
var Compiler = (function() {
  function Compiler() {}
  return Compiler;
})();
exports.Compiler = Compiler;
function isHostViewFactory(type) {
  return type instanceof view_1.HostViewFactory;
}
var Compiler_ = (function(_super) {
  __extends(Compiler_, _super);
  function Compiler_() {
    _super.apply(this, arguments);
  }
  Compiler_.prototype.compileInHost = function(componentType) {
    var metadatas = reflection_1.reflector.annotations(componentType);
    var hostViewFactory = metadatas.find(isHostViewFactory);
    if (lang_1.isBlank(hostViewFactory)) {
      throw new exceptions_1.BaseException("No precompiled component " + lang_1.stringify(componentType) + " found");
    }
    return async_1.PromiseWrapper.resolve(new view_ref_1.HostViewFactoryRef_(hostViewFactory));
  };
  Compiler_.prototype.clearCache = function() {};
  Compiler_ = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], Compiler_);
  return Compiler_;
})(Compiler);
exports.Compiler_ = Compiler_;
