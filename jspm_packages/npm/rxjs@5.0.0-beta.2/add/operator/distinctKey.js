/* */ 
"use strict";
var Observable_1 = require('../../Observable');
var distinctKey_1 = require('../../operator/distinctKey');
var observableProto = Observable_1.Observable.prototype;
observableProto.distinctKey = distinctKey_1.distinctKey;
