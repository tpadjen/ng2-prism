/* */ 
'use strict';
var core_1 = require('../../core');
var exceptions_1 = require('../facade/exceptions');
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var TestInjector = (function() {
  function TestInjector() {
    this._instantiated = false;
    this._injector = null;
    this._providers = [];
    this.platformProviders = [];
    this.applicationProviders = [];
  }
  TestInjector.prototype.reset = function() {
    this._injector = null;
    this._providers = [];
    this._instantiated = false;
  };
  TestInjector.prototype.addProviders = function(providers) {
    if (this._instantiated) {
      throw new exceptions_1.BaseException('Cannot add providers after test injector is instantiated');
    }
    this._providers = collection_1.ListWrapper.concat(this._providers, providers);
  };
  TestInjector.prototype.createInjector = function() {
    var rootInjector = core_1.Injector.resolveAndCreate(this.platformProviders);
    this._injector = rootInjector.resolveAndCreateChild(collection_1.ListWrapper.concat(this.applicationProviders, this._providers));
    this._instantiated = true;
    return this._injector;
  };
  TestInjector.prototype.execute = function(fn) {
    if (!this._instantiated) {
      this.createInjector();
    }
    return fn.execute(this._injector);
  };
  return TestInjector;
})();
exports.TestInjector = TestInjector;
var _testInjector = null;
function getTestInjector() {
  if (_testInjector == null) {
    _testInjector = new TestInjector();
  }
  return _testInjector;
}
exports.getTestInjector = getTestInjector;
function setBaseTestProviders(platformProviders, applicationProviders) {
  var testInjector = getTestInjector();
  if (testInjector.platformProviders.length > 0 || testInjector.applicationProviders.length > 0) {
    throw new exceptions_1.BaseException('Cannot set base providers because it has already been called');
  }
  testInjector.platformProviders = platformProviders;
  testInjector.applicationProviders = applicationProviders;
  var injector = testInjector.createInjector();
  var inits = injector.getOptional(core_1.PLATFORM_INITIALIZER);
  if (lang_1.isPresent(inits)) {
    inits.forEach(function(init) {
      return init();
    });
  }
  testInjector.reset();
}
exports.setBaseTestProviders = setBaseTestProviders;
function resetBaseTestProviders() {
  var testInjector = getTestInjector();
  testInjector.platformProviders = [];
  testInjector.applicationProviders = [];
  testInjector.reset();
}
exports.resetBaseTestProviders = resetBaseTestProviders;
function inject(tokens, fn) {
  return new FunctionWithParamTokens(tokens, fn, false);
}
exports.inject = inject;
function injectAsync(tokens, fn) {
  return new FunctionWithParamTokens(tokens, fn, true);
}
exports.injectAsync = injectAsync;
var FunctionWithParamTokens = (function() {
  function FunctionWithParamTokens(_tokens, _fn, isAsync) {
    this._tokens = _tokens;
    this._fn = _fn;
    this.isAsync = isAsync;
  }
  FunctionWithParamTokens.prototype.execute = function(injector) {
    var params = this._tokens.map(function(t) {
      return injector.get(t);
    });
    return lang_1.FunctionWrapper.apply(this._fn, params);
  };
  FunctionWithParamTokens.prototype.hasToken = function(token) {
    return this._tokens.indexOf(token) > -1;
  };
  return FunctionWithParamTokens;
})();
exports.FunctionWithParamTokens = FunctionWithParamTokens;
