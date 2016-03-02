/* */ 
'use strict';
var lang_1 = require('../../../facade/lang');
var di_1 = require('../../../core/di');
var dom_adapter_1 = require('../dom_adapter');
var debug_node_1 = require('../../../core/debug/debug_node');
var dom_renderer_1 = require('../dom_renderer');
var core_1 = require('../../../../core');
var debug_renderer_1 = require('../../../core/debug/debug_renderer');
var INSPECT_GLOBAL_NAME = 'ng.probe';
function inspectNativeElement(element) {
  return debug_node_1.getDebugNode(element);
}
exports.inspectNativeElement = inspectNativeElement;
function _createConditionalRootRenderer(rootRenderer) {
  if (lang_1.assertionsEnabled()) {
    return _createRootRenderer(rootRenderer);
  }
  return rootRenderer;
}
function _createRootRenderer(rootRenderer) {
  dom_adapter_1.DOM.setGlobalVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
  return new debug_renderer_1.DebugDomRootRenderer(rootRenderer);
}
exports.ELEMENT_PROBE_PROVIDERS = lang_1.CONST_EXPR([new di_1.Provider(core_1.RootRenderer, {
  useFactory: _createConditionalRootRenderer,
  deps: [dom_renderer_1.DomRootRenderer]
})]);
exports.ELEMENT_PROBE_PROVIDERS_PROD_MODE = lang_1.CONST_EXPR([new di_1.Provider(core_1.RootRenderer, {
  useFactory: _createRootRenderer,
  deps: [dom_renderer_1.DomRootRenderer]
})]);
