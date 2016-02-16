/* */ 
"use strict";
var mergeMapTo_1 = require('./mergeMapTo');
function concatMapTo(observable, resultSelector) {
  return this.lift(new mergeMapTo_1.MergeMapToOperator(observable, resultSelector, 1));
}
exports.concatMapTo = concatMapTo;
