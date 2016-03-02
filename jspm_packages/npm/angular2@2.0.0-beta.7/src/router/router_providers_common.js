/* */ 
'use strict';
var location_strategy_1 = require('./location_strategy');
var path_location_strategy_1 = require('./path_location_strategy');
var router_1 = require('./router');
var route_registry_1 = require('./route_registry');
var location_1 = require('./location');
var lang_1 = require('../facade/lang');
var core_1 = require('../../core');
var exceptions_1 = require('../facade/exceptions');
exports.ROUTER_PROVIDERS_COMMON = lang_1.CONST_EXPR([route_registry_1.RouteRegistry, lang_1.CONST_EXPR(new core_1.Provider(location_strategy_1.LocationStrategy, {useClass: path_location_strategy_1.PathLocationStrategy})), location_1.Location, lang_1.CONST_EXPR(new core_1.Provider(router_1.Router, {
  useFactory: routerFactory,
  deps: lang_1.CONST_EXPR([route_registry_1.RouteRegistry, location_1.Location, route_registry_1.ROUTER_PRIMARY_COMPONENT, core_1.ApplicationRef])
})), lang_1.CONST_EXPR(new core_1.Provider(route_registry_1.ROUTER_PRIMARY_COMPONENT, {
  useFactory: routerPrimaryComponentFactory,
  deps: lang_1.CONST_EXPR([core_1.ApplicationRef])
}))]);
function routerFactory(registry, location, primaryComponent, appRef) {
  var rootRouter = new router_1.RootRouter(registry, location, primaryComponent);
  appRef.registerDisposeListener(function() {
    return rootRouter.dispose();
  });
  return rootRouter;
}
function routerPrimaryComponentFactory(app) {
  if (app.componentTypes.length == 0) {
    throw new exceptions_1.BaseException("Bootstrap at least one component before injecting Router.");
  }
  return app.componentTypes[0];
}
