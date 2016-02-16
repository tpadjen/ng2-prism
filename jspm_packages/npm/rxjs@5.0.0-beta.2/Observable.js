/* */ 
"use strict";
var root_1 = require('./util/root');
var SymbolShim_1 = require('./util/SymbolShim');
var toSubscriber_1 = require('./util/toSubscriber');
var tryCatch_1 = require('./util/tryCatch');
var errorObject_1 = require('./util/errorObject');
var Observable = (function() {
  function Observable(subscribe) {
    this._isScalar = false;
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable.prototype.lift = function(operator) {
    var observable = new Observable();
    observable.source = this;
    observable.operator = operator;
    return observable;
  };
  Observable.prototype.subscribe = function(observerOrNext, error, complete) {
    var operator = this.operator;
    var subscriber = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
    if (operator) {
      subscriber.add(this._subscribe(operator.call(subscriber)));
    } else {
      subscriber.add(this._subscribe(subscriber));
    }
    if (subscriber.syncErrorThrowable) {
      subscriber.syncErrorThrowable = false;
      if (subscriber.syncErrorThrown) {
        throw subscriber.syncErrorValue;
      }
    }
    return subscriber;
  };
  Observable.prototype.forEach = function(next, thisArg, PromiseCtor) {
    if (!PromiseCtor) {
      if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
        PromiseCtor = root_1.root.Rx.config.Promise;
      } else if (root_1.root.Promise) {
        PromiseCtor = root_1.root.Promise;
      }
    }
    if (!PromiseCtor) {
      throw new Error('no Promise impl found');
    }
    var source = this;
    return new PromiseCtor(function(resolve, reject) {
      source.subscribe(function(value) {
        var result = tryCatch_1.tryCatch(next).call(thisArg, value);
        if (result === errorObject_1.errorObject) {
          reject(errorObject_1.errorObject.e);
        }
      }, reject, resolve);
    });
  };
  Observable.prototype._subscribe = function(subscriber) {
    return this.source.subscribe(subscriber);
  };
  Observable.prototype[SymbolShim_1.SymbolShim.observable] = function() {
    return this;
  };
  Observable.create = function(subscribe) {
    return new Observable(subscribe);
  };
  return Observable;
}());
exports.Observable = Observable;
