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
  })([function(module, exports, __webpack_require__) {
    (function(global) {
      "use strict";
      __webpack_require__(1);
      var event_target_1 = __webpack_require__(2);
      var define_property_1 = __webpack_require__(4);
      var register_element_1 = __webpack_require__(5);
      var property_descriptor_1 = __webpack_require__(6);
      var utils_1 = __webpack_require__(3);
      var set = 'set';
      var clear = 'clear';
      var blockingMethods = ['alert', 'prompt', 'confirm'];
      var _global = typeof window == 'undefined' ? global : window;
      patchTimer(_global, set, clear, 'Timeout');
      patchTimer(_global, set, clear, 'Interval');
      patchTimer(_global, set, clear, 'Immediate');
      patchTimer(_global, 'request', 'cancelMacroTask', 'AnimationFrame');
      patchTimer(_global, 'mozRequest', 'mozCancel', 'AnimationFrame');
      patchTimer(_global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
      for (var i = 0; i < blockingMethods.length; i++) {
        var name = blockingMethods[i];
        utils_1.patchMethod(_global, name, function(delegate, symbol, name) {
          return function(s, args) {
            return Zone.current.run(delegate, _global, args, name);
          };
        });
      }
      event_target_1.eventTargetPatch(_global);
      property_descriptor_1.propertyDescriptorPatch(_global);
      utils_1.patchClass('MutationObserver');
      utils_1.patchClass('WebKitMutationObserver');
      utils_1.patchClass('FileReader');
      define_property_1.propertyPatch();
      register_element_1.registerElementPatch(_global);
      if (_global['navigator'] && _global['navigator'].geolocation) {
        utils_1.patchPrototype(_global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
      }
      function patchTimer(window, setName, cancelName, nameSuffix) {
        setName += nameSuffix;
        cancelName += nameSuffix;
        function scheduleTask(task) {
          var data = task.data;
          data.args[0] = task.invoke;
          data.handleId = setNative.apply(window, data.args);
          return task;
        }
        function clearTask(task) {
          return clearNative(task.data.handleId);
        }
        var setNative = utils_1.patchMethod(window, setName, function(delegate) {
          return function(self, args) {
            if (typeof args[0] === 'function') {
              var zone = Zone.current;
              var options = {
                handleId: null,
                isPeriodic: nameSuffix == 'Interval',
                delay: (nameSuffix == 'Timeout' || nameSuffix == 'Interval') ? args[1] || 0 : null,
                args: args
              };
              return zone.scheduleMacroTask(setName, args[0], options, scheduleTask, clearTask);
            } else {
              return delegate.apply(window, args);
            }
          };
        });
        var clearNative = utils_1.patchMethod(window, cancelName, function(delegate) {
          return function(self, args) {
            var task = args[0];
            if (task && typeof task.type == 'string') {
              if (task.cancelFn) {
                task.zone.cancelTask(task);
              }
            } else {
              delegate.apply(window, args);
            }
          };
        });
      }
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports) {
    (function(global) {
      ;
      ;
      var Zone = (function(global) {
        var Zone = (function() {
          function Zone(parent, zoneSpec) {
            this._properties = null;
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate = new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
          }
          Object.defineProperty(Zone, "current", {
            get: function() {
              return _currentZone;
            },
            enumerable: true,
            configurable: true
          });
          ;
          Object.defineProperty(Zone, "currentTask", {
            get: function() {
              return _currentTask;
            },
            enumerable: true,
            configurable: true
          });
          ;
          Object.defineProperty(Zone.prototype, "parent", {
            get: function() {
              return this._parent;
            },
            enumerable: true,
            configurable: true
          });
          ;
          Object.defineProperty(Zone.prototype, "name", {
            get: function() {
              return this._name;
            },
            enumerable: true,
            configurable: true
          });
          ;
          Zone.prototype.get = function(key) {
            var current = this;
            while (current) {
              if (current._properties.hasOwnProperty(key)) {
                return current._properties[key];
              }
              current = current._parent;
            }
          };
          Zone.prototype.fork = function(zoneSpec) {
            if (!zoneSpec)
              throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
          };
          Zone.prototype.wrap = function(callback, source) {
            if (typeof callback != 'function') {
              throw new Error('Expecting function got: ' + callback);
            }
            var callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function() {
              return zone.runGuarded(callback, this, arguments, source);
            };
          };
          Zone.prototype.run = function(callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) {
              applyThis = null;
            }
            if (applyArgs === void 0) {
              applyArgs = null;
            }
            if (source === void 0) {
              source = null;
            }
            var oldZone = _currentZone;
            _currentZone = this;
            try {
              return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            } finally {
              _currentZone = oldZone;
            }
          };
          Zone.prototype.runGuarded = function(callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) {
              applyThis = null;
            }
            if (applyArgs === void 0) {
              applyArgs = null;
            }
            if (source === void 0) {
              source = null;
            }
            var oldZone = _currentZone;
            _currentZone = this;
            try {
              try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
              } catch (error) {
                if (this._zoneDelegate.handleError(this, error)) {
                  throw error;
                }
              }
            } finally {
              _currentZone = oldZone;
            }
          };
          Zone.prototype.runTask = function(task, applyThis, applyArgs) {
            if (task.zone != this)
              throw new Error('A task can only be run in the zone which created it! (Creation: ' + task.zone.name + '; Execution: ' + this.name + ')');
            var previousTask = _currentTask;
            _currentTask = task;
            var oldZone = _currentZone;
            _currentZone = this;
            try {
              try {
                return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
              } catch (error) {
                if (this._zoneDelegate.handleError(this, error)) {
                  throw error;
                }
              }
            } finally {
              if (task.type == 'macroTask' && task.data && !task.data.isPeriodic) {
                task.cancelFn = null;
              }
              _currentZone = oldZone;
              _currentTask = previousTask;
            }
          };
          Zone.prototype.scheduleMicroTask = function(source, callback, data, customSchedule) {
            return this._zoneDelegate.scheduleTask(this, new ZoneTask('microTask', this, source, callback, data, customSchedule, null));
          };
          Zone.prototype.scheduleMacroTask = function(source, callback, data, customSchedule, customCancel) {
            return this._zoneDelegate.scheduleTask(this, new ZoneTask('macroTask', this, source, callback, data, customSchedule, customCancel));
          };
          Zone.prototype.scheduleEventTask = function(source, callback, data, customSchedule, customCancel) {
            return this._zoneDelegate.scheduleTask(this, new ZoneTask('eventTask', this, source, callback, data, customSchedule, customCancel));
          };
          Zone.prototype.cancelTask = function(task) {
            var value = this._zoneDelegate.cancelTask(this, task);
            task.cancelFn = null;
            return value;
          };
          Zone.__symbol__ = __symbol__;
          return Zone;
        }());
        ;
        var ZoneDelegate = (function() {
          function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = {
              microTask: 0,
              macroTask: 0,
              eventTask: 0
            };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._hasTaskZS = zoneSpec && (zoneSpec.onHasTask ? zoneSpec : parentDelegate._hasTaskZS);
            this._hasTaskDlgt = zoneSpec && (zoneSpec.onHasTask ? parentDelegate : parentDelegate._hasTaskDlgt);
          }
          ZoneDelegate.prototype.fork = function(targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new Zone(targetZone, zoneSpec);
          };
          ZoneDelegate.prototype.intercept = function(targetZone, callback, source) {
            return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this.zone, targetZone, callback, source) : callback;
          };
          ZoneDelegate.prototype.invoke = function(targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this.zone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
          };
          ZoneDelegate.prototype.handleError = function(targetZone, error) {
            return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this.zone, targetZone, error) : true;
          };
          ZoneDelegate.prototype.scheduleTask = function(targetZone, task) {
            try {
              if (this._scheduleTaskZS) {
                return this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this.zone, targetZone, task);
              } else if (task.scheduleFn) {
                task.scheduleFn(task);
              } else if (task.type == 'microTask') {
                scheduleMicroTask(task);
              } else {
                throw new Error('Task is missing scheduleFn.');
              }
              return task;
            } finally {
              if (targetZone == this.zone) {
                this._updateTaskCount(task.type, 1);
              }
            }
          };
          ZoneDelegate.prototype.invokeTask = function(targetZone, task, applyThis, applyArgs) {
            try {
              return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this.zone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
            } finally {
              if (targetZone == this.zone && (task.type != 'eventTask') && !(task.data && task.data.isPeriodic)) {
                this._updateTaskCount(task.type, -1);
              }
            }
          };
          ZoneDelegate.prototype.cancelTask = function(targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
              value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this.zone, targetZone, task);
            } else if (!task.cancelFn) {
              throw new Error('Task does not support cancellation, or is already canceled.');
            } else {
              value = task.cancelFn(task);
            }
            if (targetZone == this.zone) {
              this._updateTaskCount(task.type, -1);
            }
            return value;
          };
          ZoneDelegate.prototype.hasTask = function(targetZone, isEmpty) {
            return this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this.zone, targetZone, isEmpty);
          };
          ZoneDelegate.prototype._updateTaskCount = function(type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
              throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
              var isEmpty = {
                microTask: counts.microTask > 0,
                macroTask: counts.macroTask > 0,
                eventTask: counts.eventTask > 0,
                change: type
              };
              try {
                this.hasTask(this.zone, isEmpty);
              } finally {
                if (this._parentDelegate) {
                  this._parentDelegate._updateTaskCount(type, count);
                }
              }
            }
          };
          return ZoneDelegate;
        }());
        var ZoneTask = (function() {
          function ZoneTask(type, zone, source, callback, options, scheduleFn, cancelFn) {
            this.type = type;
            this.zone = zone;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            this.invoke = function() {
              try {
                return zone.runTask(self, this, arguments);
              } finally {
                drainMicroTaskQueue();
              }
            };
          }
          return ZoneTask;
        }());
        function __symbol__(name) {
          return '__zone_symbol__' + name;
        }
        ;
        var symbolSetTimeout = __symbol__('setTimeout');
        var symbolPromise = __symbol__('Promise');
        var symbolThen = __symbol__('then');
        var _currentZone = new Zone(null, null);
        var _currentTask = null;
        var _microTaskQueue = [];
        var _isDrainingMicrotaskQueue = false;
        var _uncaughtPromiseErrors = [];
        var _drainScheduled = false;
        function scheduleQueueDrain() {
          if (!_drainScheduled && !_currentTask && _microTaskQueue.length == 0) {
            if (global[symbolPromise]) {
              global[symbolPromise].resolve(0)[symbolThen](drainMicroTaskQueue);
            } else {
              global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
          }
        }
        function scheduleMicroTask(task) {
          scheduleQueueDrain();
          _microTaskQueue.push(task);
        }
        function consoleError(e) {
          var rejection = e && e.rejection;
          if (rejection) {
            console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection);
          }
          console.error(e);
        }
        function drainMicroTaskQueue() {
          if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
              var queue = _microTaskQueue;
              _microTaskQueue = [];
              for (var i = 0; i < queue.length; i++) {
                var task = queue[i];
                try {
                  task.zone.runTask(task, null, null);
                } catch (e) {
                  consoleError(e);
                }
              }
            }
            while (_uncaughtPromiseErrors.length) {
              var uncaughtPromiseErrors = _uncaughtPromiseErrors;
              _uncaughtPromiseErrors = [];
              for (var i = 0; i < uncaughtPromiseErrors.length; i++) {
                var uncaughtPromiseError = uncaughtPromiseErrors[i];
                try {
                  uncaughtPromiseError.zone.runGuarded(function() {
                    throw uncaughtPromiseError;
                  });
                } catch (e) {
                  consoleError(e);
                }
              }
            }
            _isDrainingMicrotaskQueue = false;
            _drainScheduled = false;
          }
        }
        function isThenable(value) {
          return value && value.then;
        }
        function forwardResolution(value) {
          return value;
        }
        function forwardRejection(rejection) {
          return ZoneAwarePromise.reject(rejection);
        }
        var symbolState = __symbol__('state');
        var symbolValue = __symbol__('value');
        var source = 'Promise.then';
        var UNRESOLVED = null;
        var RESOLVED = true;
        var REJECTED = false;
        var REJECTED_NO_CATCH = 0;
        function makeResolver(promise, state) {
          return function(v) {
            resolvePromise(promise, state, v);
          };
        }
        function resolvePromise(promise, state, value) {
          if (promise[symbolState] === UNRESOLVED) {
            if (value instanceof ZoneAwarePromise && value[symbolState] !== UNRESOLVED) {
              clearRejectedNoCatch(value);
              resolvePromise(promise, value[symbolState], value[symbolValue]);
            } else if (isThenable(value)) {
              value.then(makeResolver(promise, state), makeResolver(promise, false));
            } else {
              promise[symbolState] = state;
              var queue = promise[symbolValue];
              promise[symbolValue] = value;
              for (var i = 0; i < queue.length; ) {
                scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
              }
              if (queue.length == 0 && state == REJECTED) {
                promise[symbolState] = REJECTED_NO_CATCH;
                try {
                  throw new Error("Uncaught (in promise): " + value);
                } catch (e) {
                  var error = e;
                  error.rejection = value;
                  error.promise = promise;
                  error.zone = Zone.current;
                  error.task = Zone.currentTask;
                  _uncaughtPromiseErrors.push(error);
                  scheduleQueueDrain();
                }
              }
            }
          }
          return promise;
        }
        function clearRejectedNoCatch(promise) {
          if (promise[symbolState] === REJECTED_NO_CATCH) {
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
              if (promise === _uncaughtPromiseErrors[i].promise) {
                _uncaughtPromiseErrors.splice(i, 1);
                break;
              }
            }
          }
        }
        function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
          clearRejectedNoCatch(promise);
          var delegate = promise[symbolState] ? onFulfilled || forwardResolution : onRejected || forwardRejection;
          zone.scheduleMicroTask(source, function() {
            try {
              resolvePromise(chainPromise, true, zone.run(delegate, null, [promise[symbolValue]]));
            } catch (error) {
              resolvePromise(chainPromise, false, error);
            }
          });
        }
        var ZoneAwarePromise = (function() {
          function ZoneAwarePromise(executor) {
            var promise = this;
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = [];
            try {
              executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            } catch (e) {
              resolvePromise(promise, false, e);
            }
          }
          ZoneAwarePromise.resolve = function(value) {
            return resolvePromise(new this(null), RESOLVED, value);
          };
          ZoneAwarePromise.reject = function(error) {
            return resolvePromise(new this(null), REJECTED, error);
          };
          ZoneAwarePromise.race = function(values) {
            var resolve;
            var reject;
            var promise = new this(function(res, rej) {
              resolve = res;
              reject = rej;
            });
            function onResolve(value) {
              promise && (promise = null || resolve(value));
            }
            function onReject(error) {
              promise && (promise = null || reject(error));
            }
            for (var _i = 0,
                values_1 = values; _i < values_1.length; _i++) {
              var value = values_1[_i];
              if (!isThenable(value)) {
                value = this.resolve(value);
              }
              value.then(onResolve, onReject);
            }
            return promise;
          };
          ZoneAwarePromise.all = function(values) {
            var resolve;
            var reject;
            var promise = new this(function(res, rej) {
              resolve = res;
              reject = rej;
            });
            var resolvedValues = [];
            var count = 0;
            function onReject(error) {
              promise && reject(error);
              promise = null;
            }
            for (var _i = 0,
                values_2 = values; _i < values_2.length; _i++) {
              var value = values_2[_i];
              if (!isThenable(value)) {
                value = this.resolve(value);
              }
              value.then((function(index) {
                return function(value) {
                  resolvedValues[index] = value;
                  count--;
                  if (promise && !count) {
                    resolve(resolvedValues);
                  }
                  promise == null;
                };
              })(count), onReject);
              count++;
            }
            if (!count)
              resolve(resolvedValues);
            return promise;
          };
          ZoneAwarePromise.prototype.then = function(onFulfilled, onRejected) {
            var chainPromise = new ZoneAwarePromise(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
              this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            } else {
              scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
          };
          ZoneAwarePromise.prototype.catch = function(onRejected) {
            return this.then(null, onRejected);
          };
          return ZoneAwarePromise;
        }());
        var NativePromise = global[__symbol__('Promise')] = global.Promise;
        global.Promise = ZoneAwarePromise;
        if (NativePromise) {
          var NativePromiseProtototype = NativePromise.prototype;
          var NativePromiseThen = NativePromiseProtototype[__symbol__('then')] = NativePromiseProtototype.then;
          NativePromiseProtototype.then = function(onResolve, onReject) {
            var nativePromise = this;
            return new ZoneAwarePromise(function(resolve, reject) {
              NativePromiseThen.call(nativePromise, resolve, reject);
            }).then(onResolve, onReject);
          };
        }
        return global.Zone = Zone;
      })(typeof window == 'undefined' ? global : window);
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    "use strict";
    var utils_1 = __webpack_require__(3);
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex'.split(',');
    var EVENT_TARGET = 'EventTarget';
    function eventTargetPatch(_global) {
      var apis = [];
      var isWtf = _global['wtf'];
      if (isWtf) {
        apis = WTF_ISSUE_555.split(',').map(function(v) {
          return 'HTML' + v + 'Element';
        }).concat(NO_EVENT_TARGET);
      } else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
      } else {
        apis = NO_EVENT_TARGET;
      }
      for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        utils_1.patchEventTargetMethods(type && type.prototype);
      }
    }
    exports.eventTargetPatch = eventTargetPatch;
  }, function(module, exports) {
    (function(global) {
      "use strict";
      exports.zoneSymbol = Zone['__symbol__'];
      var _global = typeof window == 'undefined' ? global : window;
      function bindArguments(args, source) {
        for (var i = args.length - 1; i >= 0; i--) {
          if (typeof args[i] === 'function') {
            args[i] = Zone.current.wrap(args[i], source + '_' + i);
          }
        }
        return args;
      }
      exports.bindArguments = bindArguments;
      ;
      function patchPrototype(prototype, fnNames) {
        var source = prototype.constructor['name'];
        for (var i = 0; i < fnNames.length; i++) {
          var name = fnNames[i];
          var delegate = prototype[name];
          if (delegate) {
            prototype[name] = (function(delegate) {
              return function() {
                return delegate.apply(this, bindArguments(arguments, source + '.' + name));
              };
            })(delegate);
          }
        }
      }
      exports.patchPrototype = patchPrototype;
      ;
      exports.isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
      exports.isNode = (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]');
      exports.isBrowser = !exports.isNode && !exports.isWebWorker && !!(window && window['HTMLElement']);
      function patchProperty(obj, prop) {
        var desc = Object.getOwnPropertyDescriptor(obj, prop) || {
          enumerable: true,
          configurable: true
        };
        delete desc.writable;
        delete desc.value;
        var eventName = prop.substr(2);
        var _prop = '_' + prop;
        desc.set = function(fn) {
          if (this[_prop]) {
            this.removeEventListener(eventName, this[_prop]);
          }
          if (typeof fn === 'function') {
            var wrapFn = function(event) {
              var result;
              result = fn.apply(this, arguments);
              if (result != undefined && !result)
                event.preventDefault();
            };
            this[_prop] = wrapFn;
            this.addEventListener(eventName, wrapFn, false);
          } else {
            this[_prop] = null;
          }
        };
        desc.get = function() {
          return this[_prop];
        };
        Object.defineProperty(obj, prop, desc);
      }
      exports.patchProperty = patchProperty;
      ;
      function patchOnProperties(obj, properties) {
        var onProperties = [];
        for (var prop in obj) {
          if (prop.substr(0, 2) == 'on') {
            onProperties.push(prop);
          }
        }
        for (var j = 0; j < onProperties.length; j++) {
          patchProperty(obj, onProperties[j]);
        }
        if (properties) {
          for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i]);
          }
        }
      }
      exports.patchOnProperties = patchOnProperties;
      ;
      var EVENT_TASKS = exports.zoneSymbol('eventTasks');
      var ADD_EVENT_LISTENER = 'addEventListener';
      var REMOVE_EVENT_LISTENER = 'removeEventListener';
      var SYMBOL_ADD_EVENT_LISTENER = exports.zoneSymbol(ADD_EVENT_LISTENER);
      var SYMBOL_REMOVE_EVENT_LISTENER = exports.zoneSymbol(REMOVE_EVENT_LISTENER);
      function findExistingRegisteredTask(target, handler, name, capture, remove) {
        var eventTasks = target[EVENT_TASKS];
        if (eventTasks) {
          for (var i = 0; i < eventTasks.length; i++) {
            var eventTask = eventTasks[i];
            var data = eventTask.data;
            if (data.handler === handler && data.useCapturing === capture && data.eventName === name) {
              if (remove) {
                eventTasks.splice(i, 1);
              }
              return eventTask;
            }
          }
        }
        return null;
      }
      function attachRegisteredEvent(target, eventTask) {
        var eventTasks = target[EVENT_TASKS];
        if (!eventTasks) {
          eventTasks = target[EVENT_TASKS] = [];
        }
        eventTasks.push(eventTask);
      }
      function scheduleEventListener(eventTask) {
        var meta = eventTask.data;
        attachRegisteredEvent(meta.target, eventTask);
        return meta.target[SYMBOL_ADD_EVENT_LISTENER](meta.eventName, eventTask.invoke, meta.useCapturing);
      }
      function cancelEventListener(eventTask) {
        var meta = eventTask.data;
        findExistingRegisteredTask(meta.target, eventTask.invoke, meta.eventName, meta.useCapturing, true);
        meta.target[SYMBOL_REMOVE_EVENT_LISTENER](meta.eventName, eventTask.invoke, meta.useCapturing);
      }
      function zoneAwareAddEventListener(self, args) {
        var eventName = args[0];
        var handler = args[1];
        var useCapturing = args[2] || false;
        var target = self || _global;
        var delegate = null;
        if (typeof handler == 'function') {
          delegate = handler;
        } else if (handler && handler.handleEvent) {
          delegate = function(event) {
            return handler.handleEvent(event);
          };
        }
        if (!delegate || handler && handler.toString() === "[object FunctionWrapper]") {
          return target[SYMBOL_ADD_EVENT_LISTENER](eventName, handler, useCapturing);
        }
        var eventTask = findExistingRegisteredTask(target, handler, eventName, useCapturing, false);
        if (eventTask) {
          return target[SYMBOL_ADD_EVENT_LISTENER](eventName, eventTask.invoke, useCapturing);
        }
        var zone = Zone.current;
        var source = target.constructor['name'] + '.addEventListener:' + eventName;
        var data = {
          target: target,
          eventName: eventName,
          name: eventName,
          useCapturing: useCapturing,
          handler: handler
        };
        zone.scheduleEventTask(source, delegate, data, scheduleEventListener, cancelEventListener);
      }
      function zoneAwareRemoveEventListener(self, args) {
        var eventName = args[0];
        var handler = args[1];
        var useCapturing = args[2] || false;
        var target = self || _global;
        var eventTask = findExistingRegisteredTask(target, handler, eventName, useCapturing, true);
        if (eventTask) {
          eventTask.zone.cancelTask(eventTask);
        } else {
          target[SYMBOL_REMOVE_EVENT_LISTENER](eventName, handler, useCapturing);
        }
      }
      function patchEventTargetMethods(obj) {
        if (obj && obj.addEventListener) {
          patchMethod(obj, ADD_EVENT_LISTENER, function() {
            return zoneAwareAddEventListener;
          });
          patchMethod(obj, REMOVE_EVENT_LISTENER, function() {
            return zoneAwareRemoveEventListener;
          });
          return true;
        } else {
          return false;
        }
      }
      exports.patchEventTargetMethods = patchEventTargetMethods;
      ;
      var originalInstanceKey = exports.zoneSymbol('originalInstance');
      function patchClass(className) {
        var OriginalClass = _global[className];
        if (!OriginalClass)
          return;
        _global[className] = function() {
          var a = bindArguments(arguments, className);
          switch (a.length) {
            case 0:
              this[originalInstanceKey] = new OriginalClass();
              break;
            case 1:
              this[originalInstanceKey] = new OriginalClass(a[0]);
              break;
            case 2:
              this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
              break;
            case 3:
              this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
              break;
            case 4:
              this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
              break;
            default:
              throw new Error('Arg list too long.');
          }
        };
        var instance = new OriginalClass(function() {});
        var prop;
        for (prop in instance) {
          (function(prop) {
            if (typeof instance[prop] === 'function') {
              _global[className].prototype[prop] = function() {
                return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
              };
            } else {
              Object.defineProperty(_global[className].prototype, prop, {
                set: function(fn) {
                  if (typeof fn === 'function') {
                    this[originalInstanceKey][prop] = Zone.current.wrap(fn, className + '.' + prop);
                  } else {
                    this[originalInstanceKey][prop] = fn;
                  }
                },
                get: function() {
                  return this[originalInstanceKey][prop];
                }
              });
            }
          }(prop));
        }
        for (prop in OriginalClass) {
          if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
          }
        }
      }
      exports.patchClass = patchClass;
      ;
      function createNamedFn(name, delegate) {
        try {
          return (Function('f', "return function " + name + "(){return f(this, arguments)}"))(delegate);
        } catch (e) {
          return function() {
            return delegate(this, arguments);
          };
        }
      }
      exports.createNamedFn = createNamedFn;
      function patchMethod(target, name, patchFn) {
        var proto = target;
        while (proto && !proto.hasOwnProperty(name)) {
          proto = Object.getPrototypeOf(proto);
        }
        if (!proto && target[name]) {
          proto = target;
        }
        var delegateName = exports.zoneSymbol(name);
        var delegate;
        if (proto && !(delegate = proto[delegateName])) {
          delegate = proto[delegateName] = proto[name];
          proto[name] = createNamedFn(name, patchFn(delegate, delegateName, name));
        }
        return delegate;
      }
      exports.patchMethod = patchMethod;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    "use strict";
    var utils_1 = __webpack_require__(3);
    var _defineProperty = Object.defineProperty;
    var _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var _create = Object.create;
    var unconfigurablesKey = utils_1.zoneSymbol('unconfigurables');
    function propertyPatch() {
      Object.defineProperty = function(obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
          throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        if (prop !== 'prototype') {
          desc = rewriteDescriptor(obj, prop, desc);
        }
        return _defineProperty(obj, prop, desc);
      };
      Object.defineProperties = function(obj, props) {
        Object.keys(props).forEach(function(prop) {
          Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
      };
      Object.create = function(obj, proto) {
        if (typeof proto === 'object') {
          Object.keys(proto).forEach(function(prop) {
            proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
          });
        }
        return _create(obj, proto);
      };
      Object.getOwnPropertyDescriptor = function(obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (isUnconfigurable(obj, prop)) {
          desc.configurable = false;
        }
        return desc;
      };
    }
    exports.propertyPatch = propertyPatch;
    ;
    function _redefineProperty(obj, prop, desc) {
      desc = rewriteDescriptor(obj, prop, desc);
      return _defineProperty(obj, prop, desc);
    }
    exports._redefineProperty = _redefineProperty;
    ;
    function isUnconfigurable(obj, prop) {
      return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
    }
    function rewriteDescriptor(obj, prop, desc) {
      desc.configurable = true;
      if (!desc.configurable) {
        if (!obj[unconfigurablesKey]) {
          _defineProperty(obj, unconfigurablesKey, {
            writable: true,
            value: {}
          });
        }
        obj[unconfigurablesKey][prop] = true;
      }
      return desc;
    }
  }, function(module, exports, __webpack_require__) {
    "use strict";
    var define_property_1 = __webpack_require__(4);
    var utils_1 = __webpack_require__(3);
    function registerElementPatch(_global) {
      if (!utils_1.isBrowser || !('registerElement' in _global.document)) {
        return;
      }
      var _registerElement = document.registerElement;
      var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
      document.registerElement = function(name, opts) {
        if (opts && opts.prototype) {
          callbacks.forEach(function(callback) {
            var source = 'Document.registerElement::' + callback;
            if (opts.prototype.hasOwnProperty(callback)) {
              var descriptor = Object.getOwnPropertyDescriptor(opts.prototype, callback);
              if (descriptor && descriptor.value) {
                descriptor.value = Zone.current.wrap(descriptor.value, source);
                define_property_1._redefineProperty(opts.prototype, callback, descriptor);
              } else {
                opts.prototype[callback] = Zone.current.wrap(opts.prototype[callback], source);
              }
            } else if (opts.prototype[callback]) {
              opts.prototype[callback] = Zone.current.wrap(opts.prototype[callback], source);
            }
          });
        }
        return _registerElement.apply(document, [name, opts]);
      };
    }
    exports.registerElementPatch = registerElementPatch;
  }, function(module, exports, __webpack_require__) {
    "use strict";
    var webSocketPatch = __webpack_require__(7);
    var utils_1 = __webpack_require__(3);
    var eventNames = 'copy cut paste abort blur focus canplay canplaythrough change click contextmenu dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart message mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup pause play playing progress ratechange reset scroll seeked seeking select show stalled submit suspend timeupdate volumechange waiting mozfullscreenchange mozfullscreenerror mozpointerlockchange mozpointerlockerror error webglcontextrestored webglcontextlost webglcontextcreationerror'.split(' ');
    function propertyDescriptorPatch(_global) {
      if (utils_1.isNode) {
        return;
      }
      var supportsWebSocket = typeof WebSocket !== 'undefined';
      if (canPatchViaPropertyDescriptor()) {
        if (utils_1.isBrowser) {
          utils_1.patchOnProperties(HTMLElement.prototype, eventNames);
        }
        utils_1.patchOnProperties(XMLHttpRequest.prototype, null);
        if (typeof IDBIndex !== 'undefined') {
          utils_1.patchOnProperties(IDBIndex.prototype, null);
          utils_1.patchOnProperties(IDBRequest.prototype, null);
          utils_1.patchOnProperties(IDBOpenDBRequest.prototype, null);
          utils_1.patchOnProperties(IDBDatabase.prototype, null);
          utils_1.patchOnProperties(IDBTransaction.prototype, null);
          utils_1.patchOnProperties(IDBCursor.prototype, null);
        }
        if (supportsWebSocket) {
          utils_1.patchOnProperties(WebSocket.prototype, null);
        }
      } else {
        patchViaCapturingAllTheEvents();
        utils_1.patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
          webSocketPatch.apply(_global);
        }
      }
    }
    exports.propertyDescriptorPatch = propertyDescriptorPatch;
    function canPatchViaPropertyDescriptor() {
      if (utils_1.isBrowser && !Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') && typeof Element !== 'undefined') {
        var desc = Object.getOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
          return false;
      }
      Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {get: function() {
          return true;
        }});
      var req = new XMLHttpRequest();
      var result = !!req.onreadystatechange;
      Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {});
      return result;
    }
    ;
    var unboundKey = utils_1.zoneSymbol('unbound');
    function patchViaCapturingAllTheEvents() {
      for (var i = 0; i < eventNames.length; i++) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        document.addEventListener(property, function(event) {
          var elt = event.target,
              bound;
          var source = elt.constructor['name'] + '.' + onproperty;
          while (elt) {
            if (elt[onproperty] && !elt[onproperty][unboundKey]) {
              bound = Zone.current.wrap(elt[onproperty], source);
              bound[unboundKey] = elt[onproperty];
              elt[onproperty] = bound;
            }
            elt = elt.parentElement;
          }
        }, true);
      }
      ;
    }
    ;
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      "use strict";
      var utils_1 = __webpack_require__(3);
      function apply(_global) {
        var WS = _global.WebSocket;
        if (!_global.EventTarget) {
          utils_1.patchEventTargetMethods(WS.prototype);
        }
        _global.WebSocket = function(a, b) {
          var socket = arguments.length > 1 ? new WS(a, b) : new WS(a);
          var proxySocket;
          var onmessageDesc = Object.getOwnPropertyDescriptor(socket, 'onmessage');
          if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = Object.create(socket);
            ['addEventListener', 'removeEventListener', 'send', 'close'].forEach(function(propName) {
              proxySocket[propName] = function() {
                return socket[propName].apply(socket, arguments);
              };
            });
          } else {
            proxySocket = socket;
          }
          utils_1.patchOnProperties(proxySocket, ['close', 'error', 'message', 'open']);
          return proxySocket;
        };
        global.WebSocket.prototype = Object.create(WS.prototype, {constructor: {value: WebSocket}});
      }
      exports.apply = apply;
    }.call(exports, (function() {
      return this;
    }())));
  }]);
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
    'use strict';
    (function() {
      var NEWLINE = '\n';
      var SEP = '  -------------  ';
      var IGNORE_FRAMES = [];
      var creationTrace = '__creationTrace__';
      var LongStackTrace = (function() {
        function LongStackTrace() {
          this.error = getStacktrace();
          this.timestamp = new Date();
        }
        return LongStackTrace;
      }());
      function getStacktraceWithUncaughtError() {
        return new Error('STACKTRACE TRACKING');
      }
      function getStacktraceWithCaughtError() {
        try {
          throw getStacktraceWithUncaughtError();
        } catch (e) {
          return e;
        }
      }
      var error = getStacktraceWithUncaughtError();
      var coughtError = getStacktraceWithCaughtError();
      var getStacktrace = error.stack ? getStacktraceWithUncaughtError : (coughtError.stack ? getStacktraceWithCaughtError : getStacktraceWithUncaughtError);
      function getFrames(error) {
        return error.stack ? error.stack.split(NEWLINE) : [];
      }
      function addErrorStack(lines, error) {
        var trace;
        trace = getFrames(error);
        for (var i = 0; i < trace.length; i++) {
          var frame = trace[i];
          if (!(i < IGNORE_FRAMES.length && IGNORE_FRAMES[i] === frame)) {
            lines.push(trace[i]);
          }
        }
      }
      function renderLongStackTrace(frames, stack) {
        var longTrace = [stack];
        if (frames) {
          var timestamp = new Date().getTime();
          for (var i = 0; i < frames.length; i++) {
            var traceFrames = frames[i];
            var lastTime = traceFrames.timestamp;
            longTrace.push(SEP + " Elapsed: " + (timestamp - lastTime.getTime()) + " ms; At: " + lastTime + " " + SEP);
            addErrorStack(longTrace, traceFrames.error);
            timestamp = lastTime.getTime();
          }
        }
        return longTrace.join(NEWLINE);
      }
      Zone['longStackTraceZoneSpec'] = {
        name: 'long-stack-trace',
        longStackTraceLimit: 10,
        onScheduleTask: function(parentZoneDelegate, currentZone, targetZone, task) {
          var currentTask = Zone.currentTask;
          var trace = currentTask && currentTask.data && currentTask.data[creationTrace] || [];
          trace = [new LongStackTrace()].concat(trace);
          if (trace.length > this.longStackTraceLimit) {
            trace.length = this.longStackTraceLimit;
          }
          if (!task.data)
            task.data = {};
          task.data[creationTrace] = trace;
          return parentZoneDelegate.scheduleTask(targetZone, task);
        },
        onHandleError: function(parentZoneDelegate, currentZone, targetZone, error) {
          var parentTask = Zone.currentTask;
          if (error instanceof Error && parentTask) {
            var descriptor = Object.getOwnPropertyDescriptor(error, 'stack');
            if (descriptor) {
              var delegateGet = descriptor.get;
              var value = descriptor.value;
              descriptor = {get: function() {
                  return renderLongStackTrace(parentTask.data && parentTask.data[creationTrace], delegateGet ? delegateGet.apply(this) : value);
                }};
              Object.defineProperty(error, 'stack', descriptor);
            } else {
              error.stack = renderLongStackTrace(parentTask.data && parentTask.data[creationTrace], error.stack);
            }
          }
          return parentZoneDelegate.handleError(targetZone, error);
        }
      };
      function captureStackTraces(stackTraces, count) {
        if (count > 0) {
          stackTraces.push(getFrames((new LongStackTrace()).error));
          captureStackTraces(stackTraces, count - 1);
        }
      }
      function computeIgnoreFrames() {
        var frames = [];
        captureStackTraces(frames, 2);
        var frames1 = frames[0];
        var frames2 = frames[1];
        for (var i = 0; i < frames1.length; i++) {
          var frame1 = frames1[i];
          var frame2 = frames2[i];
          if (frame1 === frame2) {
            IGNORE_FRAMES.push(frame1);
          } else {
            break;
          }
        }
      }
      computeIgnoreFrames();
    })();
  }]);
  "use strict";
  var Reflect;
  (function(Reflect) {
    var functionPrototype = Object.getPrototypeOf(Function);
    var _Map = typeof Map === "function" ? Map : CreateMapPolyfill();
    var _Set = typeof Set === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    var __Metadata__ = new _WeakMap();
    function decorate(decorators, target, targetKey, targetDescriptor) {
      if (!IsUndefined(targetDescriptor)) {
        if (!IsArray(decorators)) {
          throw new TypeError();
        } else if (!IsObject(target)) {
          throw new TypeError();
        } else if (IsUndefined(targetKey)) {
          throw new TypeError();
        } else if (!IsObject(targetDescriptor)) {
          throw new TypeError();
        }
        targetKey = ToPropertyKey(targetKey);
        return DecoratePropertyWithDescriptor(decorators, target, targetKey, targetDescriptor);
      } else if (!IsUndefined(targetKey)) {
        if (!IsArray(decorators)) {
          throw new TypeError();
        } else if (!IsObject(target)) {
          throw new TypeError();
        }
        targetKey = ToPropertyKey(targetKey);
        return DecoratePropertyWithoutDescriptor(decorators, target, targetKey);
      } else {
        if (!IsArray(decorators)) {
          throw new TypeError();
        } else if (!IsConstructor(target)) {
          throw new TypeError();
        }
        return DecorateConstructor(decorators, target);
      }
    }
    Reflect.decorate = decorate;
    function metadata(metadataKey, metadataValue) {
      function decorator(target, targetKey) {
        if (!IsUndefined(targetKey)) {
          if (!IsObject(target)) {
            throw new TypeError();
          }
          targetKey = ToPropertyKey(targetKey);
          OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
        } else {
          if (!IsConstructor(target)) {
            throw new TypeError();
          }
          OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, undefined);
        }
      }
      return decorator;
    }
    Reflect.metadata = metadata;
    function defineMetadata(metadataKey, metadataValue, target, targetKey) {
      if (!IsObject(target)) {
        throw new TypeError();
      } else if (!IsUndefined(targetKey)) {
        targetKey = ToPropertyKey(targetKey);
      }
      return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
    }
    Reflect.defineMetadata = defineMetadata;
    function hasMetadata(metadataKey, target, targetKey) {
      if (!IsObject(target)) {
        throw new TypeError();
      } else if (!IsUndefined(targetKey)) {
        targetKey = ToPropertyKey(targetKey);
      }
      return OrdinaryHasMetadata(metadataKey, target, targetKey);
    }
    Reflect.hasMetadata = hasMetadata;
    function hasOwnMetadata(metadataKey, target, targetKey) {
      if (!IsObject(target)) {
        throw new TypeError();
      } else if (!IsUndefined(targetKey)) {
        targetKey = ToPropertyKey(targetKey);
      }
      return OrdinaryHasOwnMetadata(metadataKey, target, targetKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    function getMetadata(metadataKey, target, targetKey) {
      if (!IsObject(target)) {
        throw new TypeError();
      } else if (!IsUndefined(targetKey)) {
        targetKey = ToPropertyKey(targetKey);
      }
      return OrdinaryGetMetadata(metadataKey, target, targetKey);
    }
    Reflect.getMetadata = getMetadata;
    function getOwnMetadata(metadataKey, target, targetKey) {
      if (!IsObject(target)) {
        throw new TypeError();
      } else if (!IsUndefined(targetKey)) {
        targetKey = ToPropertyKey(targetKey);
      }
      return OrdinaryGetOwnMetadata(metadataKey, target, targetKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    function getMetadataKeys(target, targetKey) {
      if (!IsObject(target)) {
        throw new TypeError();
      } else if (!IsUndefined(targetKey)) {
        targetKey = ToPropertyKey(targetKey);
      }
      return OrdinaryMetadataKeys(target, targetKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    function getOwnMetadataKeys(target, targetKey) {
      if (!IsObject(target)) {
        throw new TypeError();
      } else if (!IsUndefined(targetKey)) {
        targetKey = ToPropertyKey(targetKey);
      }
      return OrdinaryOwnMetadataKeys(target, targetKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    function deleteMetadata(metadataKey, target, targetKey) {
      if (!IsObject(target)) {
        throw new TypeError();
      } else if (!IsUndefined(targetKey)) {
        targetKey = ToPropertyKey(targetKey);
      }
      var metadataMap = GetOrCreateMetadataMap(target, targetKey, false);
      if (IsUndefined(metadataMap)) {
        return false;
      }
      if (!metadataMap.delete(metadataKey)) {
        return false;
      }
      if (metadataMap.size > 0) {
        return true;
      }
      var targetMetadata = __Metadata__.get(target);
      targetMetadata.delete(targetKey);
      if (targetMetadata.size > 0) {
        return true;
      }
      __Metadata__.delete(target);
      return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        var decorated = decorator(target);
        if (!IsUndefined(decorated)) {
          if (!IsConstructor(decorated)) {
            throw new TypeError();
          }
          target = decorated;
        }
      }
      return target;
    }
    function DecoratePropertyWithDescriptor(decorators, target, propertyKey, descriptor) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        var decorated = decorator(target, propertyKey, descriptor);
        if (!IsUndefined(decorated)) {
          if (!IsObject(decorated)) {
            throw new TypeError();
          }
          descriptor = decorated;
        }
      }
      return descriptor;
    }
    function DecoratePropertyWithoutDescriptor(decorators, target, propertyKey) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        decorator(target, propertyKey);
      }
    }
    function GetOrCreateMetadataMap(target, targetKey, create) {
      var targetMetadata = __Metadata__.get(target);
      if (!targetMetadata) {
        if (!create) {
          return undefined;
        }
        targetMetadata = new _Map();
        __Metadata__.set(target, targetMetadata);
      }
      var keyMetadata = targetMetadata.get(targetKey);
      if (!keyMetadata) {
        if (!create) {
          return undefined;
        }
        keyMetadata = new _Map();
        targetMetadata.set(targetKey, keyMetadata);
      }
      return keyMetadata;
    }
    function OrdinaryHasMetadata(MetadataKey, O, P) {
      var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn) {
        return true;
      }
      var parent = GetPrototypeOf(O);
      if (parent !== null) {
        return OrdinaryHasMetadata(MetadataKey, parent, P);
      }
      return false;
    }
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P, false);
      if (metadataMap === undefined) {
        return false;
      }
      return Boolean(metadataMap.has(MetadataKey));
    }
    function OrdinaryGetMetadata(MetadataKey, O, P) {
      var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn) {
        return OrdinaryGetOwnMetadata(MetadataKey, O, P);
      }
      var parent = GetPrototypeOf(O);
      if (parent !== null) {
        return OrdinaryGetMetadata(MetadataKey, parent, P);
      }
      return undefined;
    }
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P, false);
      if (metadataMap === undefined) {
        return undefined;
      }
      return metadataMap.get(MetadataKey);
    }
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P, true);
      metadataMap.set(MetadataKey, MetadataValue);
    }
    function OrdinaryMetadataKeys(O, P) {
      var ownKeys = OrdinaryOwnMetadataKeys(O, P);
      var parent = GetPrototypeOf(O);
      if (parent === null) {
        return ownKeys;
      }
      var parentKeys = OrdinaryMetadataKeys(parent, P);
      if (parentKeys.length <= 0) {
        return ownKeys;
      }
      if (ownKeys.length <= 0) {
        return parentKeys;
      }
      var set = new _Set();
      var keys = [];
      for (var _i = 0; _i < ownKeys.length; _i++) {
        var key = ownKeys[_i];
        var hasKey = set.has(key);
        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }
      for (var _a = 0; _a < parentKeys.length; _a++) {
        var key = parentKeys[_a];
        var hasKey = set.has(key);
        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }
      return keys;
    }
    function OrdinaryOwnMetadataKeys(target, targetKey) {
      var metadataMap = GetOrCreateMetadataMap(target, targetKey, false);
      var keys = [];
      if (metadataMap) {
        metadataMap.forEach(function(_, key) {
          return keys.push(key);
        });
      }
      return keys;
    }
    function IsUndefined(x) {
      return x === undefined;
    }
    function IsArray(x) {
      return Array.isArray(x);
    }
    function IsObject(x) {
      return typeof x === "object" ? x !== null : typeof x === "function";
    }
    function IsConstructor(x) {
      return typeof x === "function";
    }
    function IsSymbol(x) {
      return typeof x === "symbol";
    }
    function ToPropertyKey(value) {
      if (IsSymbol(value)) {
        return value;
      }
      return String(value);
    }
    function GetPrototypeOf(O) {
      var proto = Object.getPrototypeOf(O);
      if (typeof O !== "function" || O === functionPrototype) {
        return proto;
      }
      if (proto !== functionPrototype) {
        return proto;
      }
      var prototype = O.prototype;
      var prototypeProto = Object.getPrototypeOf(prototype);
      if (prototypeProto == null || prototypeProto === Object.prototype) {
        return proto;
      }
      var constructor = prototypeProto.constructor;
      if (typeof constructor !== "function") {
        return proto;
      }
      if (constructor === O) {
        return proto;
      }
      return constructor;
    }
    function CreateMapPolyfill() {
      var cacheSentinel = {};
      function Map() {
        this._keys = [];
        this._values = [];
        this._cache = cacheSentinel;
      }
      Map.prototype = {
        get size() {
          return this._keys.length;
        },
        has: function(key) {
          if (key === this._cache) {
            return true;
          }
          if (this._find(key) >= 0) {
            this._cache = key;
            return true;
          }
          return false;
        },
        get: function(key) {
          var index = this._find(key);
          if (index >= 0) {
            this._cache = key;
            return this._values[index];
          }
          return undefined;
        },
        set: function(key, value) {
          this.delete(key);
          this._keys.push(key);
          this._values.push(value);
          this._cache = key;
          return this;
        },
        delete: function(key) {
          var index = this._find(key);
          if (index >= 0) {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
            this._cache = cacheSentinel;
            return true;
          }
          return false;
        },
        clear: function() {
          this._keys.length = 0;
          this._values.length = 0;
          this._cache = cacheSentinel;
        },
        forEach: function(callback, thisArg) {
          var size = this.size;
          for (var i = 0; i < size; ++i) {
            var key = this._keys[i];
            var value = this._values[i];
            this._cache = key;
            callback.call(this, value, key, this);
          }
        },
        _find: function(key) {
          var keys = this._keys;
          var size = keys.length;
          for (var i = 0; i < size; ++i) {
            if (keys[i] === key) {
              return i;
            }
          }
          return -1;
        }
      };
      return Map;
    }
    function CreateSetPolyfill() {
      var cacheSentinel = {};
      function Set() {
        this._map = new _Map();
      }
      Set.prototype = {
        get size() {
          return this._map.length;
        },
        has: function(value) {
          return this._map.has(value);
        },
        add: function(value) {
          this._map.set(value, value);
          return this;
        },
        delete: function(value) {
          return this._map.delete(value);
        },
        clear: function() {
          this._map.clear();
        },
        forEach: function(callback, thisArg) {
          this._map.forEach(callback, thisArg);
        }
      };
      return Set;
    }
    function CreateWeakMapPolyfill() {
      var UUID_SIZE = 16;
      var isNode = typeof global !== "undefined" && Object.prototype.toString.call(global.process) === '[object process]';
      var nodeCrypto = isNode && require('crypto');
      var hasOwn = Object.prototype.hasOwnProperty;
      var keys = {};
      var rootKey = CreateUniqueKey();
      function WeakMap() {
        this._key = CreateUniqueKey();
      }
      WeakMap.prototype = {
        has: function(target) {
          var table = GetOrCreateWeakMapTable(target, false);
          if (table) {
            return this._key in table;
          }
          return false;
        },
        get: function(target) {
          var table = GetOrCreateWeakMapTable(target, false);
          if (table) {
            return table[this._key];
          }
          return undefined;
        },
        set: function(target, value) {
          var table = GetOrCreateWeakMapTable(target, true);
          table[this._key] = value;
          return this;
        },
        delete: function(target) {
          var table = GetOrCreateWeakMapTable(target, false);
          if (table && this._key in table) {
            return delete table[this._key];
          }
          return false;
        },
        clear: function() {
          this._key = CreateUniqueKey();
        }
      };
      function FillRandomBytes(buffer, size) {
        for (var i = 0; i < size; ++i) {
          buffer[i] = Math.random() * 255 | 0;
        }
      }
      function GenRandomBytes(size) {
        if (nodeCrypto) {
          var data = nodeCrypto.randomBytes(size);
          return data;
        } else if (typeof Uint8Array === "function") {
          var data = new Uint8Array(size);
          if (typeof crypto !== "undefined") {
            crypto.getRandomValues(data);
          } else if (typeof msCrypto !== "undefined") {
            msCrypto.getRandomValues(data);
          } else {
            FillRandomBytes(data, size);
          }
          return data;
        } else {
          var data = new Array(size);
          FillRandomBytes(data, size);
          return data;
        }
      }
      function CreateUUID() {
        var data = GenRandomBytes(UUID_SIZE);
        data[6] = data[6] & 0x4f | 0x40;
        data[8] = data[8] & 0xbf | 0x80;
        var result = "";
        for (var offset = 0; offset < UUID_SIZE; ++offset) {
          var byte = data[offset];
          if (offset === 4 || offset === 6 || offset === 8) {
            result += "-";
          }
          if (byte < 16) {
            result += "0";
          }
          result += byte.toString(16).toLowerCase();
        }
        return result;
      }
      function CreateUniqueKey() {
        var key;
        do {
          key = "@@WeakMap@@" + CreateUUID();
        } while (hasOwn.call(keys, key));
        keys[key] = true;
        return key;
      }
      function GetOrCreateWeakMapTable(target, create) {
        if (!hasOwn.call(target, rootKey)) {
          if (!create) {
            return undefined;
          }
          Object.defineProperty(target, rootKey, {value: Object.create(null)});
        }
        return target[rootKey];
      }
      return WeakMap;
    }
    (function(__global) {
      if (typeof __global.Reflect !== "undefined") {
        if (__global.Reflect !== Reflect) {
          for (var p in Reflect) {
            __global.Reflect[p] = Reflect[p];
          }
        }
      } else {
        __global.Reflect = Reflect;
      }
    })(typeof window !== "undefined" ? window : typeof WorkerGlobalScope !== "undefined" ? self : typeof global !== "undefined" ? global : Function("return this;")());
  })(Reflect || (Reflect = {}));
})(require('process'));
