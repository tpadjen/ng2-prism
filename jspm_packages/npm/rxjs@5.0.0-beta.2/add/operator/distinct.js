/* */ 
"use strict";
var Observable_1 = require('../../Observable');
var distinct_1 = require('../../operator/distinct');
var observableProto = Observable_1.Observable.prototype;
observableProto.distinct = distinct_1.distinct;
