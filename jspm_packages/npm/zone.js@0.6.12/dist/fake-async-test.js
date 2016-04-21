/* */ 
(function(process) {
  (function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId])
        return installedModules[moduleId].exports;
      var module = installedModules[moduleId] = {
        exports: {},
        id: moduleId,
        loaded: false
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.loaded = true;
      return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0);
  })([function(module, exports) {
    (function(global) {
      (function() {
        var Scheduler = (function() {
          function Scheduler() {
            this.nextId = 0;
            this._schedulerQueue = [];
            this._currentTime = 0;
          }
          Scheduler.prototype.scheduleFunction = function(cb, delay, args, id) {
            if (args === void 0) {
              args = [];
            }
            if (id === void 0) {
              id = -1;
            }
            var currentId = id < 0 ? this.nextId++ : id;
            var endTime = this._currentTime + delay;
            var newEntry = {
              endTime: endTime,
              id: currentId,
              func: cb,
              args: args,
              delay: delay
            };
            var i = 0;
            for (; i < this._schedulerQueue.length; i++) {
              var currentEntry = this._schedulerQueue[i];
              if (newEntry.endTime < currentEntry.endTime) {
                break;
              }
            }
            this._schedulerQueue.splice(i, 0, newEntry);
            return currentId;
          };
          Scheduler.prototype.removeScheduledFunctionWithId = function(id) {
            for (var i = 0; i < this._schedulerQueue.length; i++) {
              if (this._schedulerQueue[i].id == id) {
                this._schedulerQueue.splice(i, 1);
                break;
              }
            }
          };
          Scheduler.prototype.tick = function(millis) {
            if (millis === void 0) {
              millis = 0;
            }
            this._currentTime += millis;
            while (this._schedulerQueue.length > 0) {
              var current = this._schedulerQueue[0];
              if (this._currentTime < current.endTime) {
                break;
              } else {
                var current_1 = this._schedulerQueue.shift();
                var retval = current_1.func.apply(global, current_1.args);
                if (!retval) {
                  break;
                }
              }
            }
          };
          return Scheduler;
        }());
        var FakeAsyncTestZoneSpec = (function() {
          function FakeAsyncTestZoneSpec(namePrefix) {
            this._scheduler = new Scheduler();
            this._microtasks = [];
            this._lastError = null;
            this.pendingPeriodicTimers = [];
            this.pendingTimers = [];
            this.properties = {'FakeAsyncTestZoneSpec': this};
            this.name = 'fakeAsyncTestZone for ' + namePrefix;
          }
          FakeAsyncTestZoneSpec.assertInZone = function() {
            if (Zone.current.get('FakeAsyncTestZoneSpec') == null) {
              throw new Error('The code should be running in the fakeAsync zone to call this function');
            }
          };
          FakeAsyncTestZoneSpec.prototype._fnAndFlush = function(fn, completers) {
            var _this = this;
            return function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
              }
              fn.apply(global, args);
              if (_this._lastError === null) {
                if (completers.onSuccess != null) {
                  completers.onSuccess.apply(global);
                }
                _this.flushMicrotasks();
              } else {
                if (completers.onError != null) {
                  completers.onError.apply(global);
                }
              }
              return _this._lastError === null;
            };
          };
          FakeAsyncTestZoneSpec._removeTimer = function(timers, id) {
            var index = timers.indexOf(id);
            if (index > -1) {
              timers.splice(index, 1);
            }
          };
          FakeAsyncTestZoneSpec.prototype._dequeueTimer = function(id) {
            var _this = this;
            return function() {
              FakeAsyncTestZoneSpec._removeTimer(_this.pendingTimers, id);
            };
          };
          FakeAsyncTestZoneSpec.prototype._requeuePeriodicTimer = function(fn, interval, args, id) {
            var _this = this;
            return function() {
              if (_this.pendingPeriodicTimers.indexOf(id) !== -1) {
                _this._scheduler.scheduleFunction(fn, interval, args, id);
              }
            };
          };
          FakeAsyncTestZoneSpec.prototype._dequeuePeriodicTimer = function(id) {
            var _this = this;
            return function() {
              FakeAsyncTestZoneSpec._removeTimer(_this.pendingPeriodicTimers, id);
            };
          };
          FakeAsyncTestZoneSpec.prototype._setTimeout = function(fn, delay, args) {
            var removeTimerFn = this._dequeueTimer(this._scheduler.nextId);
            var cb = this._fnAndFlush(fn, {
              onSuccess: removeTimerFn,
              onError: removeTimerFn
            });
            var id = this._scheduler.scheduleFunction(cb, delay, args);
            this.pendingTimers.push(id);
            return id;
          };
          FakeAsyncTestZoneSpec.prototype._clearTimeout = function(id) {
            FakeAsyncTestZoneSpec._removeTimer(this.pendingTimers, id);
            this._scheduler.removeScheduledFunctionWithId(id);
          };
          FakeAsyncTestZoneSpec.prototype._setInterval = function(fn, interval) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
              args[_i - 2] = arguments[_i];
            }
            var id = this._scheduler.nextId;
            var completers = {
              onSuccess: null,
              onError: this._dequeuePeriodicTimer(id)
            };
            var cb = this._fnAndFlush(fn, completers);
            completers.onSuccess = this._requeuePeriodicTimer(cb, interval, args, id);
            this._scheduler.scheduleFunction(cb, interval, args);
            this.pendingPeriodicTimers.push(id);
            return id;
          };
          FakeAsyncTestZoneSpec.prototype._clearInterval = function(id) {
            FakeAsyncTestZoneSpec._removeTimer(this.pendingPeriodicTimers, id);
            this._scheduler.removeScheduledFunctionWithId(id);
          };
          FakeAsyncTestZoneSpec.prototype._resetLastErrorAndThrow = function() {
            var error = this._lastError;
            this._lastError = null;
            throw error;
          };
          FakeAsyncTestZoneSpec.prototype.tick = function(millis) {
            if (millis === void 0) {
              millis = 0;
            }
            FakeAsyncTestZoneSpec.assertInZone();
            this.flushMicrotasks();
            this._scheduler.tick(millis);
            if (this._lastError !== null) {
              this._resetLastErrorAndThrow();
            }
          };
          FakeAsyncTestZoneSpec.prototype.flushMicrotasks = function() {
            FakeAsyncTestZoneSpec.assertInZone();
            while (this._microtasks.length > 0) {
              var microtask = this._microtasks.shift();
              microtask();
              if (this._lastError !== null) {
                this._resetLastErrorAndThrow();
              }
            }
          };
          FakeAsyncTestZoneSpec.prototype.onScheduleTask = function(delegate, current, target, task) {
            switch (task.type) {
              case 'microTask':
                this._microtasks.push(task.invoke);
                break;
              case 'macroTask':
                switch (task.source) {
                  case 'setTimeout':
                    task.data['handleId'] = this._setTimeout(task.invoke, task.data['delay'], task.data['args']);
                    break;
                  case 'setInterval':
                    task.data['handleId'] = this._setInterval(task.invoke, task.data['delay'], task.data['args']);
                    break;
                  case 'XMLHttpRequest.send':
                    throw new Error('Cannot make XHRs from within a fake async test.');
                  default:
                    task = delegate.scheduleTask(target, task);
                }
                break;
              case 'eventTask':
                task = delegate.scheduleTask(target, task);
                break;
            }
            return task;
          };
          FakeAsyncTestZoneSpec.prototype.onCancelTask = function(delegate, current, target, task) {
            switch (task.source) {
              case 'setTimeout':
                return this._clearTimeout(task.data['handleId']);
              case 'setInterval':
                return this._clearInterval(task.data['handleId']);
              default:
                return delegate.cancelTask(target, task);
            }
          };
          FakeAsyncTestZoneSpec.prototype.onHandleError = function(parentZoneDelegate, currentZone, targetZone, error) {
            this._lastError = error;
            return false;
          };
          return FakeAsyncTestZoneSpec;
        }());
        Zone['FakeAsyncTestZoneSpec'] = FakeAsyncTestZoneSpec;
      })();
    }.call(exports, (function() {
      return this;
    }())));
  }]);
})(require('process'));
