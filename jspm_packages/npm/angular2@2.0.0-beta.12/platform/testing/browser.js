/* */ 
'use strict';
var browser_static_1 = require('./browser_static');
var browser_1 = require('../browser');
var lang_1 = require('../../src/facade/lang');
exports.TEST_BROWSER_PLATFORM_PROVIDERS = lang_1.CONST_EXPR([browser_static_1.TEST_BROWSER_STATIC_PLATFORM_PROVIDERS]);
exports.TEST_BROWSER_APPLICATION_PROVIDERS = lang_1.CONST_EXPR([browser_1.BROWSER_APP_PROVIDERS, browser_static_1.ADDITIONAL_TEST_BROWSER_PROVIDERS]);
