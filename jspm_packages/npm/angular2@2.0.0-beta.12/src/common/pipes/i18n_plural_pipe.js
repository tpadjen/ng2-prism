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
var core_1 = require('../../../core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var interpolationExp = lang_1.RegExpWrapper.create('#');
var I18nPluralPipe = (function() {
  function I18nPluralPipe() {}
  I18nPluralPipe.prototype.transform = function(value, args) {
    if (args === void 0) {
      args = null;
    }
    var key;
    var valueStr;
    var pluralMap = (args[0]);
    if (!lang_1.isStringMap(pluralMap)) {
      throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nPluralPipe, pluralMap);
    }
    key = value === 0 || value === 1 ? "=" + value : 'other';
    valueStr = lang_1.isPresent(value) ? value.toString() : '';
    return lang_1.StringWrapper.replaceAll(pluralMap[key], interpolationExp, valueStr);
  };
  I18nPluralPipe = __decorate([lang_1.CONST(), core_1.Pipe({
    name: 'i18nPlural',
    pure: true
  }), core_1.Injectable(), __metadata('design:paramtypes', [])], I18nPluralPipe);
  return I18nPluralPipe;
})();
exports.I18nPluralPipe = I18nPluralPipe;
