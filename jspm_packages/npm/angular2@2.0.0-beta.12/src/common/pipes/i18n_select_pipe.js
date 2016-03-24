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
var lang_1 = require('../../facade/lang');
var collection_1 = require('../../facade/collection');
var core_1 = require('../../../core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var I18nSelectPipe = (function() {
  function I18nSelectPipe() {}
  I18nSelectPipe.prototype.transform = function(value, args) {
    if (args === void 0) {
      args = null;
    }
    var mapping = (args[0]);
    if (!lang_1.isStringMap(mapping)) {
      throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nSelectPipe, mapping);
    }
    return collection_1.StringMapWrapper.contains(mapping, value) ? mapping[value] : mapping['other'];
  };
  I18nSelectPipe = __decorate([lang_1.CONST(), core_1.Pipe({
    name: 'i18nSelect',
    pure: true
  }), core_1.Injectable(), __metadata('design:paramtypes', [])], I18nSelectPipe);
  return I18nSelectPipe;
})();
exports.I18nSelectPipe = I18nSelectPipe;
