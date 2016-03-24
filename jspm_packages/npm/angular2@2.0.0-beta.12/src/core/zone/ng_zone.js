/* */ 
(function(process) {
  'use strict';
  var async_1 = require('../../facade/async');
  var ng_zone_impl_1 = require('./ng_zone_impl');
  var exceptions_1 = require('../../facade/exceptions');
  var ng_zone_impl_2 = require('./ng_zone_impl');
  exports.NgZoneError = ng_zone_impl_2.NgZoneError;
  var NgZone = (function() {
    function NgZone(_a) {
      var _this = this;
      var _b = _a.enableLongStackTrace,
          enableLongStackTrace = _b === void 0 ? false : _b;
      this._hasPendingMicrotasks = false;
      this._hasPendingMacrotasks = false;
      this._isStable = true;
      this._nesting = 0;
      this._onUnstable = new async_1.EventEmitter(false);
      this._onMicrotaskEmpty = new async_1.EventEmitter(false);
      this._onStable = new async_1.EventEmitter(false);
      this._onErrorEvents = new async_1.EventEmitter(false);
      this._zoneImpl = new ng_zone_impl_1.NgZoneImpl({
        trace: enableLongStackTrace,
        onEnter: function() {
          _this._nesting++;
          if (_this._isStable) {
            _this._isStable = false;
            _this._onUnstable.emit(null);
          }
        },
        onLeave: function() {
          _this._nesting--;
          _this._checkStable();
        },
        setMicrotask: function(hasMicrotasks) {
          _this._hasPendingMicrotasks = hasMicrotasks;
          _this._checkStable();
        },
        setMacrotask: function(hasMacrotasks) {
          _this._hasPendingMacrotasks = hasMacrotasks;
        },
        onError: function(error) {
          return _this._onErrorEvents.emit(error);
        }
      });
    }
    NgZone.isInAngularZone = function() {
      return ng_zone_impl_1.NgZoneImpl.isInAngularZone();
    };
    NgZone.assertInAngularZone = function() {
      if (!ng_zone_impl_1.NgZoneImpl.isInAngularZone()) {
        throw new exceptions_1.BaseException('Expected to be in Angular Zone, but it is not!');
      }
    };
    NgZone.assertNotInAngularZone = function() {
      if (ng_zone_impl_1.NgZoneImpl.isInAngularZone()) {
        throw new exceptions_1.BaseException('Expected to not be in Angular Zone, but it is!');
      }
    };
    NgZone.prototype._checkStable = function() {
      var _this = this;
      if (this._nesting == 0) {
        if (!this._hasPendingMicrotasks && !this._isStable) {
          try {
            this._nesting++;
            this._onMicrotaskEmpty.emit(null);
          } finally {
            this._nesting--;
            if (!this._hasPendingMicrotasks) {
              try {
                this.runOutsideAngular(function() {
                  return _this._onStable.emit(null);
                });
              } finally {
                this._isStable = true;
              }
            }
          }
        }
      }
    };
    ;
    Object.defineProperty(NgZone.prototype, "onUnstable", {
      get: function() {
        return this._onUnstable;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(NgZone.prototype, "onMicrotaskEmpty", {
      get: function() {
        return this._onMicrotaskEmpty;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(NgZone.prototype, "onStable", {
      get: function() {
        return this._onStable;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(NgZone.prototype, "onError", {
      get: function() {
        return this._onErrorEvents;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(NgZone.prototype, "hasPendingMicrotasks", {
      get: function() {
        return this._hasPendingMicrotasks;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(NgZone.prototype, "hasPendingMacrotasks", {
      get: function() {
        return this._hasPendingMacrotasks;
      },
      enumerable: true,
      configurable: true
    });
    NgZone.prototype.run = function(fn) {
      return this._zoneImpl.runInner(fn);
    };
    NgZone.prototype.runOutsideAngular = function(fn) {
      return this._zoneImpl.runOuter(fn);
    };
    return NgZone;
  })();
  exports.NgZone = NgZone;
})(require('process'));
