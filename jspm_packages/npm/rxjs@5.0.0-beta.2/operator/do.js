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
var noop_1 = require('../util/noop');
function _do(nextOrObserver, error, complete) {
  var next;
  if (nextOrObserver && typeof nextOrObserver === 'object') {
    next = nextOrObserver.next;
    error = nextOrObserver.error;
    complete = nextOrObserver.complete;
  } else {
    next = nextOrObserver;
  }
  return this.lift(new DoOperator(next || noop_1.noop, error || noop_1.noop, complete || noop_1.noop));
}
exports._do = _do;
var DoOperator = (function() {
  function DoOperator(next, error, complete) {
    this.next = next;
    this.error = error;
    this.complete = complete;
  }
  DoOperator.prototype.call = function(subscriber) {
    return new DoSubscriber(subscriber, this.next, this.error, this.complete);
  };
  return DoOperator;
}());
var DoSubscriber = (function(_super) {
  __extends(DoSubscriber, _super);
  function DoSubscriber(destination, next, error, complete) {
    _super.call(this, destination);
    this.__next = next;
    this.__error = error;
    this.__complete = complete;
  }
  DoSubscriber.prototype._next = function(value) {
    try {
      this.__next(value);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(value);
  };
  DoSubscriber.prototype._error = function(err) {
    try {
      this.__error(err);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.error(err);
  };
  DoSubscriber.prototype._complete = function() {
    try {
      this.__complete();
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.complete();
  };
  return DoSubscriber;
}(Subscriber_1.Subscriber));
