/* */ 
'use strict';
var router_1 = require('../../router');
var core_1 = require('../../core');
var lang_1 = require('../facade/lang');
var browser_platform_location_1 = require('./browser_platform_location');
var platform_location_1 = require('./platform_location');
exports.ROUTER_PROVIDERS = lang_1.CONST_EXPR([router_1.ROUTER_PROVIDERS_COMMON, lang_1.CONST_EXPR(new core_1.Provider(platform_location_1.PlatformLocation, {useClass: browser_platform_location_1.BrowserPlatformLocation}))]);
exports.ROUTER_BINDINGS = exports.ROUTER_PROVIDERS;
