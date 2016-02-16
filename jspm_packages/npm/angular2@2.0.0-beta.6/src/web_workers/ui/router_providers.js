/* */ 
'use strict';
var platform_location_1 = require('./platform_location');
var lang_1 = require('../../facade/lang');
var browser_platform_location_1 = require('../../router/browser_platform_location');
var core_1 = require('../../../core');
exports.WORKER_RENDER_ROUTER = lang_1.CONST_EXPR([platform_location_1.MessageBasedPlatformLocation, browser_platform_location_1.BrowserPlatformLocation, lang_1.CONST_EXPR(new core_1.Provider(core_1.APP_INITIALIZER, {
  useFactory: initRouterListeners,
  multi: true,
  deps: lang_1.CONST_EXPR([core_1.Injector])
}))]);
function initRouterListeners(injector) {
  return function() {
    var zone = injector.get(core_1.NgZone);
    zone.run(function() {
      return injector.get(platform_location_1.MessageBasedPlatformLocation).start();
    });
  };
}
