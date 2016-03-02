/* */ 
'use strict';
var core_1 = require('../../../core');
var platform_location_1 = require('../../router/platform_location');
var platform_location_2 = require('./platform_location');
var router_providers_common_1 = require('../../router/router_providers_common');
exports.WORKER_APP_ROUTER = [router_providers_common_1.ROUTER_PROVIDERS_COMMON, new core_1.Provider(platform_location_1.PlatformLocation, {useClass: platform_location_2.WebWorkerPlatformLocation}), new core_1.Provider(core_1.APP_INITIALIZER, {
  useFactory: function(platformLocation, zone) {
    return function() {
      return initRouter(platformLocation, zone);
    };
  },
  multi: true,
  deps: [platform_location_1.PlatformLocation, core_1.NgZone]
})];
function initRouter(platformLocation, zone) {
  return zone.run(function() {
    return platformLocation.init();
  });
}
