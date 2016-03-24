/* */ 
'use strict';
var lang_1 = require('../../facade/lang');
var di_1 = require('../../core/di');
exports.ON_WEB_WORKER = lang_1.CONST_EXPR(new di_1.OpaqueToken('WebWorker.onWebWorker'));
