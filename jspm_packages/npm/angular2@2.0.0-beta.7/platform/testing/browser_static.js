/* */ 
'use strict';
var core_1 = require('../../core');
var browser_common_1 = require('../../src/platform/browser_common');
var browser_adapter_1 = require('../../src/platform/browser/browser_adapter');
var animation_builder_1 = require('../../src/animate/animation_builder');
var animation_builder_mock_1 = require('../../src/mock/animation_builder_mock');
var directive_resolver_mock_1 = require('../../src/mock/directive_resolver_mock');
var view_resolver_mock_1 = require('../../src/mock/view_resolver_mock');
var mock_location_strategy_1 = require('../../src/mock/mock_location_strategy');
var location_strategy_1 = require('../../src/router/location_strategy');
var ng_zone_mock_1 = require('../../src/mock/ng_zone_mock');
var xhr_impl_1 = require('../../src/platform/browser/xhr_impl');
var compiler_1 = require('../../compiler');
var test_component_builder_1 = require('../../src/testing/test_component_builder');
var utils_1 = require('../../src/testing/utils');
var common_dom_1 = require('../common_dom');
var lang_1 = require('../../src/facade/lang');
var utils_2 = require('../../src/testing/utils');
function initBrowserTests() {
  browser_adapter_1.BrowserDomAdapter.makeCurrent();
  utils_1.BrowserDetection.setup();
}
exports.TEST_BROWSER_STATIC_PLATFORM_PROVIDERS = lang_1.CONST_EXPR([core_1.PLATFORM_COMMON_PROVIDERS, new core_1.Provider(core_1.PLATFORM_INITIALIZER, {
  useValue: initBrowserTests,
  multi: true
})]);
exports.ADDITIONAL_TEST_BROWSER_PROVIDERS = lang_1.CONST_EXPR([new core_1.Provider(core_1.APP_ID, {useValue: 'a'}), common_dom_1.ELEMENT_PROBE_PROVIDERS, new core_1.Provider(core_1.DirectiveResolver, {useClass: directive_resolver_mock_1.MockDirectiveResolver}), new core_1.Provider(core_1.ViewResolver, {useClass: view_resolver_mock_1.MockViewResolver}), utils_2.Log, test_component_builder_1.TestComponentBuilder, new core_1.Provider(core_1.NgZone, {useClass: ng_zone_mock_1.MockNgZone}), new core_1.Provider(location_strategy_1.LocationStrategy, {useClass: mock_location_strategy_1.MockLocationStrategy}), new core_1.Provider(animation_builder_1.AnimationBuilder, {useClass: animation_builder_mock_1.MockAnimationBuilder})]);
exports.TEST_BROWSER_STATIC_APPLICATION_PROVIDERS = lang_1.CONST_EXPR([browser_common_1.BROWSER_APP_COMMON_PROVIDERS, new core_1.Provider(compiler_1.XHR, {useClass: xhr_impl_1.XHRImpl}), exports.ADDITIONAL_TEST_BROWSER_PROVIDERS]);
