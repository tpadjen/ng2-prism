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
var exceptions_1 = require('../../facade/exceptions');
var core_1 = require('../../../core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var ReplacePipe = (function() {
  function ReplacePipe() {}
  ReplacePipe.prototype.transform = function(value, args) {
    if (lang_1.isBlank(args) || args.length !== 2) {
      throw new exceptions_1.BaseException('ReplacePipe requires two arguments');
    }
    if (lang_1.isBlank(value)) {
      return value;
    }
    if (!this._supportedInput(value)) {
      throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(ReplacePipe, value);
    }
    var input = value.toString();
    var pattern = args[0];
    var replacement = args[1];
    if (!this._supportedPattern(pattern)) {
      throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(ReplacePipe, pattern);
    }
    if (!this._supportedReplacement(replacement)) {
      throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(ReplacePipe, replacement);
    }
    if (lang_1.isFunction(replacement)) {
      var rgxPattern = lang_1.isString(pattern) ? lang_1.RegExpWrapper.create(pattern) : pattern;
      return lang_1.StringWrapper.replaceAllMapped(input, rgxPattern, replacement);
    }
    if (pattern instanceof RegExp) {
      return lang_1.StringWrapper.replaceAll(input, pattern, replacement);
    }
    return lang_1.StringWrapper.replace(input, pattern, replacement);
  };
  ReplacePipe.prototype._supportedInput = function(input) {
    return lang_1.isString(input) || lang_1.isNumber(input);
  };
  ReplacePipe.prototype._supportedPattern = function(pattern) {
    return lang_1.isString(pattern) || pattern instanceof RegExp;
  };
  ReplacePipe.prototype._supportedReplacement = function(replacement) {
    return lang_1.isString(replacement) || lang_1.isFunction(replacement);
  };
  ReplacePipe = __decorate([core_1.Pipe({name: 'replace'}), core_1.Injectable(), __metadata('design:paramtypes', [])], ReplacePipe);
  return ReplacePipe;
})();
exports.ReplacePipe = ReplacePipe;
