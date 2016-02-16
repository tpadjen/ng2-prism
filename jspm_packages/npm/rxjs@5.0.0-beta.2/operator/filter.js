/* */ 
"use strict";
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
function filter(select, thisArg) {
  return this.lift(new FilterOperator(select, thisArg));
}
exports.filter = filter;
var FilterOperator = (function() {
  function FilterOperator(select, thisArg) {
    this.select = select;
    this.thisArg = thisArg;
  }
  FilterOperator.prototype.call = function(subscriber) {
    return new FilterSubscriber(subscriber, this.select, this.thisArg);
  };
  return FilterOperator;
}());
var FilterSubscriber = (function(_super) {
  __extends(FilterSubscriber, _super);
  function FilterSubscriber(destination, select, thisArg) {
    _super.call(this, destination);
    this.select = select;
    this.thisArg = thisArg;
    this.count = 0;
    this.select = select;
  }
  FilterSubscriber.prototype._next = function(value) {
    var result;
    try {
      result = this.select.call(this.thisArg, value, this.count++);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    if (result) {
      this.destination.next(value);
    }
  };
  return FilterSubscriber;
}(Subscriber_1.Subscriber));
