/* */ 
'use strict';
var xhr_1 = require('../compiler/xhr');
var xhr_impl_1 = require('../web_workers/worker/xhr_impl');
var renderer_1 = require('../web_workers/worker/renderer');
var lang_1 = require('../facade/lang');
var api_1 = require('../core/render/api');
var core_1 = require('../../core');
var common_1 = require('../../common');
var client_message_broker_1 = require('../web_workers/shared/client_message_broker');
var service_message_broker_1 = require('../web_workers/shared/service_message_broker');
var serializer_1 = require('../web_workers/shared/serializer');
var api_2 = require('../web_workers/shared/api');
var di_1 = require('../core/di');
var render_store_1 = require('../web_workers/shared/render_store');
var PrintLogger = (function() {
  function PrintLogger() {
    this.log = lang_1.print;
    this.logError = lang_1.print;
    this.logGroup = lang_1.print;
  }
  PrintLogger.prototype.logGroupEnd = function() {};
  return PrintLogger;
})();
exports.WORKER_APP_PLATFORM = lang_1.CONST_EXPR([core_1.PLATFORM_COMMON_PROVIDERS]);
exports.WORKER_APP_APPLICATION_COMMON = lang_1.CONST_EXPR([core_1.APPLICATION_COMMON_PROVIDERS, common_1.FORM_PROVIDERS, serializer_1.Serializer, new di_1.Provider(core_1.PLATFORM_PIPES, {
  useValue: common_1.COMMON_PIPES,
  multi: true
}), new di_1.Provider(core_1.PLATFORM_DIRECTIVES, {
  useValue: common_1.COMMON_DIRECTIVES,
  multi: true
}), new di_1.Provider(client_message_broker_1.ClientMessageBrokerFactory, {useClass: client_message_broker_1.ClientMessageBrokerFactory_}), new di_1.Provider(service_message_broker_1.ServiceMessageBrokerFactory, {useClass: service_message_broker_1.ServiceMessageBrokerFactory_}), renderer_1.WebWorkerRootRenderer, new di_1.Provider(api_1.RootRenderer, {useExisting: renderer_1.WebWorkerRootRenderer}), new di_1.Provider(api_2.ON_WEB_WORKER, {useValue: true}), render_store_1.RenderStore, new di_1.Provider(core_1.ExceptionHandler, {
  useFactory: _exceptionHandler,
  deps: []
}), xhr_impl_1.WebWorkerXHRImpl, new di_1.Provider(xhr_1.XHR, {useExisting: xhr_impl_1.WebWorkerXHRImpl})]);
function _exceptionHandler() {
  return new core_1.ExceptionHandler(new PrintLogger());
}
