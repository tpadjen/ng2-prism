/* */ 
'use strict';
var core_1 = require('../../core');
var parse5_adapter_1 = require('../../src/platform/server/parse5_adapter');
var animation_builder_1 = require('../../src/animate/animation_builder');
var animation_builder_mock_1 = require('../../src/mock/animation_builder_mock');
var directive_resolver_mock_1 = require('../../src/mock/directive_resolver_mock');
var view_resolver_mock_1 = require('../../src/mock/view_resolver_mock');
var mock_location_strategy_1 = require('../../src/mock/mock_location_strategy');
var location_strategy_1 = require('../../src/router/location_strategy');
var ng_zone_mock_1 = require('../../src/mock/ng_zone_mock');
var test_component_builder_1 = require('../../src/testing/test_component_builder');
var xhr_1 = require('../../src/compiler/xhr');
var utils_1 = require('../../src/testing/utils');
var compiler_1 = require('../../src/compiler/compiler');
var dom_tokens_1 = require('../../src/platform/dom/dom_tokens');
var dom_adapter_1 = require('../../src/platform/dom/dom_adapter');
var api_1 = require('../../src/core/render/api');
var dom_renderer_1 = require('../../src/platform/dom/dom_renderer');
var shared_styles_host_1 = require('../../src/platform/dom/shared_styles_host');
var common_dom_1 = require('../common_dom');
var dom_events_1 = require('../../src/platform/dom/events/dom_events');
var lang_1 = require('../../src/facade/lang');
var utils_2 = require('../../src/testing/utils');
function initServerTests() {
  parse5_adapter_1.Parse5DomAdapter.makeCurrent();
  utils_1.BrowserDetection.setup();
}
exports.TEST_SERVER_PLATFORM_PROVIDERS = lang_1.CONST_EXPR([core_1.PLATFORM_COMMON_PROVIDERS, new core_1.Provider(core_1.PLATFORM_INITIALIZER, {
  useValue: initServerTests,
  multi: true
})]);
function appDoc() {
  try {
    return dom_adapter_1.DOM.defaultDoc();
  } catch (e) {
    return null;
  }
}
exports.TEST_SERVER_APPLICATION_PROVIDERS = lang_1.CONST_EXPR([core_1.APPLICATION_COMMON_PROVIDERS, compiler_1.COMPILER_PROVIDERS, new core_1.Provider(dom_tokens_1.DOCUMENT, {useFactory: appDoc}), new core_1.Provider(dom_renderer_1.DomRootRenderer, {useClass: dom_renderer_1.DomRootRenderer_}), new core_1.Provider(api_1.RootRenderer, {useExisting: dom_renderer_1.DomRootRenderer}), common_dom_1.EventManager, new core_1.Provider(common_dom_1.EVENT_MANAGER_PLUGINS, {
  useClass: dom_events_1.DomEventsPlugin,
  multi: true
}), new core_1.Provider(xhr_1.XHR, {useClass: xhr_1.XHR}), new core_1.Provider(core_1.APP_ID, {useValue: 'a'}), shared_styles_host_1.DomSharedStylesHost, common_dom_1.ELEMENT_PROBE_PROVIDERS, new core_1.Provider(core_1.DirectiveResolver, {useClass: directive_resolver_mock_1.MockDirectiveResolver}), new core_1.Provider(core_1.ViewResolver, {useClass: view_resolver_mock_1.MockViewResolver}), utils_2.Log, test_component_builder_1.TestComponentBuilder, new core_1.Provider(core_1.NgZone, {useClass: ng_zone_mock_1.MockNgZone}), new core_1.Provider(location_strategy_1.LocationStrategy, {useClass: mock_location_strategy_1.MockLocationStrategy}), new core_1.Provider(animation_builder_1.AnimationBuilder, {useClass: animation_builder_mock_1.MockAnimationBuilder})]);
