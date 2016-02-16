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
      var core = __webpack_require__(1);
      var browserPatch = __webpack_require__(5);
      if (global.Zone) {
        console.warn('Zone already exported on window the object!');
      } else {
        global.Zone = core.Zone;
        global.zone = new global.Zone();
        browserPatch.apply();
      }
      exports.Zone = global.Zone;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var keys = __webpack_require__(2);
      var promise = __webpack_require__(3);
      var deprecated = {};
      function deprecatedWarning(key, text) {
        if (!deprecated.hasOwnProperty(key)) {
          deprecated[key] = true;
          console.warn("DEPRECATION WARNING: '" + key + "' is no longer supported and will be removed in next major release. " + text);
        }
      }
      var Zone = (function() {
        function Zone(parentZone, data) {
          this.parent = null;
          this.onError = null;
          var zone = (arguments.length) ? Object.create(parentZone) : this;
          zone.parent = parentZone || null;
          Object.keys(data || {}).forEach(function(property) {
            var _property = property.substr(1);
            if (property[0] === '$') {
              zone[_property] = data[property](parentZone[_property] || function() {});
            } else if (property[0] === '+') {
              if (parentZone[_property]) {
                zone[_property] = function() {
                  var result = parentZone[_property].apply(this, arguments);
                  data[property].apply(this, arguments);
                  return result;
                };
              } else {
                zone[_property] = data[property];
              }
            } else if (property[0] === '-') {
              if (parentZone[_property]) {
                zone[_property] = function() {
                  data[property].apply(this, arguments);
                  return parentZone[_property].apply(this, arguments);
                };
              } else {
                zone[_property] = data[property];
              }
            } else {
              zone[property] = (typeof data[property] === 'object') ? JSON.parse(JSON.stringify(data[property])) : data[property];
            }
          });
          zone.$id = Zone.nextId++;
          return zone;
        }
        Zone.prototype.fork = function(locals) {
          this.onZoneCreated();
          return new Zone(this, locals);
        };
        Zone.prototype.bind = function(fn, skipEnqueue) {
          if (typeof fn !== 'function') {
            throw new Error('Expecting function got: ' + fn);
          }
          skipEnqueue || this.enqueueTask(fn);
          var zone = this.isRootZone() ? this : this.fork();
          return function zoneBoundFn() {
            return zone.run(fn, this, arguments);
          };
        };
        Zone.prototype.bindOnce = function(fn) {
          deprecatedWarning('bindOnce', 'There is no replacement.');
          var boundZone = this;
          return this.bind(function() {
            var result = fn.apply(this, arguments);
            boundZone.dequeueTask(fn);
            return result;
          });
        };
        Zone.prototype.isRootZone = function() {
          return this.parent === null;
        };
        Zone.prototype.run = function(fn, applyTo, applyWith) {
          applyWith = applyWith || [];
          var oldZone = global.zone;
          global.zone = this;
          try {
            this.beforeTask();
            return fn.apply(applyTo, applyWith);
          } catch (e) {
            if (this.onError) {
              this.onError(e);
            } else {
              throw e;
            }
          } finally {
            this.afterTask();
            global.zone = oldZone;
          }
        };
        Zone.prototype.beforeTask = function() {};
        Zone.prototype.onZoneCreated = function() {};
        Zone.prototype.afterTask = function() {};
        Zone.prototype.enqueueTask = function(fn) {
          deprecatedWarning('enqueueTask', 'Use addTask/addRepeatingTask/addMicroTask');
        };
        Zone.prototype.dequeueTask = function(fn) {
          deprecatedWarning('dequeueTask', 'Use removeTask/removeRepeatingTask/removeMicroTask');
        };
        Zone.prototype.addTask = function(taskFn) {
          this.enqueueTask(taskFn);
        };
        Zone.prototype.removeTask = function(taskFn) {
          this.dequeueTask(taskFn);
        };
        Zone.prototype.addRepeatingTask = function(taskFn) {
          this.enqueueTask(taskFn);
        };
        Zone.prototype.removeRepeatingTask = function(taskFn) {
          this.dequeueTask(taskFn);
        };
        Zone.prototype.addMicrotask = function(taskFn) {
          this.enqueueTask(taskFn);
        };
        Zone.prototype.removeMicrotask = function(taskFn) {
          this.dequeueTask(taskFn);
        };
        Zone.prototype.addEventListener = function() {
          return this[keys.common.addEventListener].apply(this, arguments);
        };
        Zone.prototype.removeEventListener = function() {
          return this[keys.common.removeEventListener].apply(this, arguments);
        };
        Zone.nextId = 1;
        Zone.bindPromiseFn = promise.bindPromiseFn;
        return Zone;
      })();
      exports.Zone = Zone;
      ;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports) {
    function create(name) {
      return '_zone$' + name;
    }
    exports.create = create;
    exports.common = {
      addEventListener: create('addEventListener'),
      removeEventListener: create('removeEventListener')
    };
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var utils = __webpack_require__(4);
      if (global.Promise) {
        exports.bindPromiseFn = function(delegate) {
          return function() {
            var delegatePromise = delegate.apply(this, arguments);
            if (delegatePromise instanceof Promise) {
              return delegatePromise;
            }
            return new Promise(function(resolve, reject) {
              delegatePromise.then(resolve, reject);
            });
          };
        };
      } else {
        exports.bindPromiseFn = function(delegate) {
          return function() {
            return _patchThenable(delegate.apply(this, arguments));
          };
        };
      }
      function _patchPromiseFnsOnObject(objectPath, fnNames) {
        var obj = global;
        var exists = objectPath.every(function(segment) {
          obj = obj[segment];
          return obj;
        });
        if (!exists) {
          return;
        }
        fnNames.forEach(function(name) {
          var fn = obj[name];
          if (fn) {
            obj[name] = exports.bindPromiseFn(fn);
          }
        });
      }
      function _patchThenable(thenable) {
        var then = thenable.then;
        thenable.then = function() {
          var args = utils.bindArguments(arguments);
          var nextThenable = then.apply(thenable, args);
          return _patchThenable(nextThenable);
        };
        var ocatch = thenable.catch;
        thenable.catch = function() {
          var args = utils.bindArguments(arguments);
          var nextThenable = ocatch.apply(thenable, args);
          return _patchThenable(nextThenable);
        };
        return thenable;
      }
      function apply() {
        if (global.Promise) {
          utils.patchPrototype(Promise.prototype, ['then', 'catch']);
          var patchFns = [[[], ['fetch']], [['Response', 'prototype'], ['arrayBuffer', 'blob', 'json', 'text']]];
          patchFns.forEach(function(objPathAndFns) {
            _patchPromiseFnsOnObject(objPathAndFns[0], objPathAndFns[1]);
          });
        }
      }
      exports.apply = apply;
      module.exports = {
        apply: apply,
        bindPromiseFn: exports.bindPromiseFn
      };
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var keys = __webpack_require__(2);
      function bindArguments(args) {
        for (var i = args.length - 1; i >= 0; i--) {
          if (typeof args[i] === 'function') {
            args[i] = global.zone.bind(args[i]);
          }
        }
        return args;
      }
      exports.bindArguments = bindArguments;
      ;
      function patchPrototype(obj, fnNames) {
        fnNames.forEach(function(name) {
          var delegate = obj[name];
          if (delegate) {
            obj[name] = function() {
              return delegate.apply(this, bindArguments(arguments));
            };
          }
        });
      }
      exports.patchPrototype = patchPrototype;
      ;
      function isWebWorker() {
        return (typeof document === "undefined");
      }
      exports.isWebWorker = isWebWorker;
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
            this[_prop] = fn;
            this.addEventListener(eventName, fn, false);
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
      function patchProperties(obj, properties) {
        (properties || (function() {
          var props = [];
          for (var prop in obj) {
            props.push(prop);
          }
          return props;
        }()).filter(function(propertyName) {
          return propertyName.substr(0, 2) === 'on';
        })).forEach(function(eventName) {
          patchProperty(obj, eventName);
        });
      }
      exports.patchProperties = patchProperties;
      ;
      var originalFnKey = keys.create('originalFn');
      var boundFnsKey = keys.create('boundFns');
      function patchEventTargetMethods(obj) {
        obj[keys.common.addEventListener] = obj.addEventListener;
        obj.addEventListener = function(eventName, handler, useCapturing) {
          if (handler && handler.toString() !== "[object FunctionWrapper]") {
            var eventType = eventName + (useCapturing ? '$capturing' : '$bubbling');
            var fn;
            if (handler.handleEvent) {
              fn = (function(handler) {
                return function() {
                  handler.handleEvent.apply(handler, arguments);
                };
              })(handler);
            } else {
              fn = handler;
            }
            handler[originalFnKey] = fn;
            handler[boundFnsKey] = handler[boundFnsKey] || {};
            handler[boundFnsKey][eventType] = handler[boundFnsKey][eventType] || global.zone.bind(fn);
            arguments[1] = handler[boundFnsKey][eventType];
          }
          var target = this || global;
          return global.zone.addEventListener.apply(target, arguments);
        };
        obj[keys.common.removeEventListener] = obj.removeEventListener;
        obj.removeEventListener = function(eventName, handler, useCapturing) {
          var eventType = eventName + (useCapturing ? '$capturing' : '$bubbling');
          if (handler && handler[boundFnsKey] && handler[boundFnsKey][eventType]) {
            var _bound = handler[boundFnsKey];
            arguments[1] = _bound[eventType];
            delete _bound[eventType];
            global.zone.dequeueTask(handler[originalFnKey]);
          }
          var target = this || global;
          var result = global.zone.removeEventListener.apply(target, arguments);
          return result;
        };
      }
      exports.patchEventTargetMethods = patchEventTargetMethods;
      ;
      var originalInstanceKey = keys.create('originalInstance');
      function patchClass(className) {
        var OriginalClass = global[className];
        if (!OriginalClass)
          return;
        global[className] = function() {
          var a = bindArguments(arguments);
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
              throw new Error('what are you even doing?');
          }
        };
        var instance = new OriginalClass();
        var prop;
        for (prop in instance) {
          (function(prop) {
            if (typeof instance[prop] === 'function') {
              global[className].prototype[prop] = function() {
                return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
              };
            } else {
              Object.defineProperty(global[className].prototype, prop, {
                set: function(fn) {
                  if (typeof fn === 'function') {
                    this[originalInstanceKey][prop] = global.zone.bind(fn);
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
            global[className][prop] = OriginalClass[prop];
          }
        }
      }
      exports.patchClass = patchClass;
      ;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var fnPatch = __webpack_require__(6);
      var promisePatch = __webpack_require__(3);
      var mutationObserverPatch = __webpack_require__(8);
      var definePropertyPatch = __webpack_require__(9);
      var registerElementPatch = __webpack_require__(10);
      var eventTargetPatch = __webpack_require__(11);
      var propertyDescriptorPatch = __webpack_require__(12);
      var geolocationPatch = __webpack_require__(14);
      var fileReaderPatch = __webpack_require__(15);
      function apply() {
        fnPatch.patchSetClearFunction(global, global.Zone, [['setTimeout', 'clearTimeout', false, false], ['setInterval', 'clearInterval', true, false], ['setImmediate', 'clearImmediate', false, false], ['requestAnimationFrame', 'cancelAnimationFrame', false, true], ['mozRequestAnimationFrame', 'mozCancelAnimationFrame', false, true], ['webkitRequestAnimationFrame', 'webkitCancelAnimationFrame', false, true]]);
        fnPatch.patchFunction(global, ['alert', 'prompt']);
        eventTargetPatch.apply();
        propertyDescriptorPatch.apply();
        promisePatch.apply();
        mutationObserverPatch.patchClass('MutationObserver');
        mutationObserverPatch.patchClass('WebKitMutationObserver');
        definePropertyPatch.apply();
        registerElementPatch.apply();
        geolocationPatch.apply();
        fileReaderPatch.apply();
      }
      exports.apply = apply;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var wtf = __webpack_require__(7);
      function patchSetClearFunction(window, Zone, fnNames) {
        function patchMacroTaskMethod(setName, clearName, repeating, isRaf) {
          var setNative = window[setName];
          var clearNative = window[clearName];
          var ids = {};
          if (setNative) {
            var wtfSetEventFn = wtf.createEvent('Zone#' + setName + '(uint32 zone, uint32 id, uint32 delay)');
            var wtfClearEventFn = wtf.createEvent('Zone#' + clearName + '(uint32 zone, uint32 id)');
            var wtfCallbackFn = wtf.createScope('Zone#cb:' + setName + '(uint32 zone, uint32 id, uint32 delay)');
            window[setName] = function() {
              return global.zone[setName].apply(global.zone, arguments);
            };
            window[clearName] = function() {
              return global.zone[clearName].apply(global.zone, arguments);
            };
            Zone.prototype[setName] = function(fn, delay) {
              var callbackFn = fn;
              if (typeof callbackFn !== 'function') {
                setNative.apply(window, arguments);
              }
              var zone = this;
              var setId = null;
              arguments[0] = function() {
                var callbackZone = zone.isRootZone() || isRaf ? zone : zone.fork();
                var callbackThis = this;
                var callbackArgs = arguments;
                return wtf.leaveScope(wtfCallbackFn(callbackZone.$id, setId, delay), callbackZone.run(function() {
                  if (!repeating) {
                    delete ids[setId];
                    callbackZone.removeTask(callbackFn);
                  }
                  return callbackFn.apply(callbackThis, callbackArgs);
                }));
              };
              if (repeating) {
                zone.addRepeatingTask(callbackFn);
              } else {
                zone.addTask(callbackFn);
              }
              setId = setNative.apply(window, arguments);
              ids[setId] = callbackFn;
              wtfSetEventFn(zone.$id, setId, delay);
              return setId;
            };
            Zone.prototype[setName + 'Unpatched'] = function() {
              return setNative.apply(window, arguments);
            };
            Zone.prototype[clearName] = function(id) {
              wtfClearEventFn(this.$id, id);
              if (ids.hasOwnProperty(id)) {
                var callbackFn = ids[id];
                delete ids[id];
                if (repeating) {
                  this.removeRepeatingTask(callbackFn);
                } else {
                  this.removeTask(callbackFn);
                }
              }
              return clearNative.apply(window, arguments);
            };
            Zone.prototype[clearName + 'Unpatched'] = function() {
              return clearNative.apply(window, arguments);
            };
          }
        }
        fnNames.forEach(function(args) {
          patchMacroTaskMethod.apply(null, args);
        });
      }
      exports.patchSetClearFunction = patchSetClearFunction;
      ;
      function patchFunction(obj, fnNames) {
        fnNames.forEach(function(name) {
          var delegate = obj[name];
          global.zone[name] = function() {
            return delegate.apply(obj, arguments);
          };
          obj[name] = function() {
            return global.zone[name].apply(this, arguments);
          };
        });
      }
      exports.patchFunction = patchFunction;
      ;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports) {
    (function(global) {
      var wtfTrace = null;
      var wtfEvents = null;
      var wtfEnabled = (function() {
        var wtf = global['wtf'];
        if (wtf) {
          wtfTrace = wtf['trace'];
          if (wtfTrace) {
            wtfEvents = wtfTrace['events'];
            return true;
          }
        }
        return false;
      })();
      function noop() {}
      exports.enabled = wtfEnabled;
      exports.createScope = wtfEnabled ? function(signature, flags) {
        return wtfEvents.createScope(signature, flags);
      } : function(s, f) {
        return noop;
      };
      exports.createEvent = wtfEnabled ? function(signature, flags) {
        return wtfEvents.createInstance(signature, flags);
      } : function(s, f) {
        return noop;
      };
      exports.leaveScope = wtfEnabled ? function(scope, returnValue) {
        wtfTrace.leaveScope(scope, returnValue);
        return returnValue;
      } : function(s, v) {
        return v;
      };
      exports.beginTimeRange = wtfEnabled ? function(rangeType, action) {
        return wtfTrace.beginTimeRange(rangeType, action);
      } : function(t, a) {
        return null;
      };
      exports.endTimeRange = wtfEnabled ? function(range) {
        wtfTrace.endTimeRange(range);
      } : function(r) {};
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var keys = __webpack_require__(2);
      var originalInstanceKey = keys.create('originalInstance');
      var creationZoneKey = keys.create('creationZone');
      var isActiveKey = keys.create('isActive');
      function patchClass(className) {
        var OriginalClass = global[className];
        if (!OriginalClass)
          return;
        global[className] = function(fn) {
          this[originalInstanceKey] = new OriginalClass(global.zone.bind(fn, true));
          this[creationZoneKey] = global.zone;
        };
        var instance = new OriginalClass(function() {});
        global[className].prototype.disconnect = function() {
          var result = this[originalInstanceKey].disconnect.apply(this[originalInstanceKey], arguments);
          if (this[isActiveKey]) {
            this[creationZoneKey].dequeueTask();
            this[isActiveKey] = false;
          }
          return result;
        };
        global[className].prototype.observe = function() {
          if (!this[isActiveKey]) {
            this[creationZoneKey].enqueueTask();
            this[isActiveKey] = true;
          }
          return this[originalInstanceKey].observe.apply(this[originalInstanceKey], arguments);
        };
        var prop;
        for (prop in instance) {
          (function(prop) {
            if (typeof global[className].prototype !== 'undefined') {
              return;
            }
            if (typeof instance[prop] === 'function') {
              global[className].prototype[prop] = function() {
                return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
              };
            } else {
              Object.defineProperty(global[className].prototype, prop, {
                set: function(fn) {
                  if (typeof fn === 'function') {
                    this[originalInstanceKey][prop] = global.zone.bind(fn);
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
      }
      exports.patchClass = patchClass;
      ;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    var keys = __webpack_require__(2);
    var _defineProperty = Object.defineProperty;
    var _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var _create = Object.create;
    var unconfigurablesKey = keys.create('unconfigurables');
    function apply() {
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
    exports.apply = apply;
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
    (function(global) {
      var define_property_1 = __webpack_require__(9);
      var utils = __webpack_require__(4);
      function apply() {
        if (utils.isWebWorker() || !('registerElement' in global.document)) {
          return;
        }
        var _registerElement = document.registerElement;
        var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
        document.registerElement = function(name, opts) {
          if (opts && opts.prototype) {
            callbacks.forEach(function(callback) {
              if (opts.prototype.hasOwnProperty(callback)) {
                var descriptor = Object.getOwnPropertyDescriptor(opts.prototype, callback);
                if (descriptor && descriptor.value) {
                  descriptor.value = global.zone.bind(descriptor.value);
                  define_property_1._redefineProperty(opts.prototype, callback, descriptor);
                } else {
                  opts.prototype[callback] = global.zone.bind(opts.prototype[callback]);
                }
              } else if (opts.prototype[callback]) {
                opts.prototype[callback] = global.zone.bind(opts.prototype[callback]);
              }
            });
          }
          return _registerElement.apply(document, [name, opts]);
        };
      }
      exports.apply = apply;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      'use strict';
      var utils = __webpack_require__(4);
      function apply() {
        if (global.EventTarget) {
          utils.patchEventTargetMethods(global.EventTarget.prototype);
        } else {
          var apis = ['ApplicationCache', 'EventSource', 'FileReader', 'InputMethodContext', 'MediaController', 'MessagePort', 'Node', 'Performance', 'SVGElementInstance', 'SharedWorker', 'TextTrack', 'TextTrackCue', 'TextTrackList', 'WebKitNamedFlow', 'Worker', 'WorkerGlobalScope', 'XMLHttpRequest', 'XMLHttpRequestEventTarget', 'XMLHttpRequestUpload'];
          apis.forEach(function(api) {
            var proto = global[api] && global[api].prototype;
            if (proto && proto.addEventListener) {
              utils.patchEventTargetMethods(proto);
            }
          });
          if (typeof(window) !== 'undefined') {
            utils.patchEventTargetMethods(window);
          }
        }
      }
      exports.apply = apply;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var webSocketPatch = __webpack_require__(13);
      var utils = __webpack_require__(4);
      var keys = __webpack_require__(2);
      var eventNames = 'copy cut paste abort blur focus canplay canplaythrough change click contextmenu dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart message mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup pause play playing progress ratechange reset scroll seeked seeking select show stalled submit suspend timeupdate volumechange waiting mozfullscreenchange mozfullscreenerror mozpointerlockchange mozpointerlockerror error webglcontextrestored webglcontextlost webglcontextcreationerror'.split(' ');
      function apply() {
        if (utils.isWebWorker()) {
          return;
        }
        var supportsWebSocket = typeof WebSocket !== 'undefined';
        if (canPatchViaPropertyDescriptor()) {
          var onEventNames = eventNames.map(function(property) {
            return 'on' + property;
          });
          utils.patchProperties(HTMLElement.prototype, onEventNames);
          utils.patchProperties(XMLHttpRequest.prototype);
          if (supportsWebSocket) {
            utils.patchProperties(WebSocket.prototype);
          }
        } else {
          patchViaCapturingAllTheEvents();
          utils.patchClass('XMLHttpRequest');
          if (supportsWebSocket) {
            webSocketPatch.apply();
          }
        }
      }
      exports.apply = apply;
      function canPatchViaPropertyDescriptor() {
        if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') && typeof Element !== 'undefined') {
          var desc = Object.getOwnPropertyDescriptor(Element.prototype, 'onclick');
          if (desc && !desc.configurable)
            return false;
        }
        Object.defineProperty(HTMLElement.prototype, 'onclick', {get: function() {
            return true;
          }});
        var elt = document.createElement('div');
        var result = !!elt.onclick;
        Object.defineProperty(HTMLElement.prototype, 'onclick', {});
        return result;
      }
      ;
      var unboundKey = keys.create('unbound');
      function patchViaCapturingAllTheEvents() {
        eventNames.forEach(function(property) {
          var onproperty = 'on' + property;
          document.addEventListener(property, function(event) {
            var elt = event.target,
                bound;
            while (elt) {
              if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                bound = global.zone.bind(elt[onproperty]);
                bound[unboundKey] = elt[onproperty];
                elt[onproperty] = bound;
              }
              elt = elt.parentElement;
            }
          }, true);
        });
      }
      ;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var utils = __webpack_require__(4);
      function apply() {
        var WS = global.WebSocket;
        if (!global.EventTarget) {
          utils.patchEventTargetMethods(WS.prototype);
        }
        global.WebSocket = function(a, b) {
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
          utils.patchProperties(proxySocket, ['onclose', 'onerror', 'onmessage', 'onopen']);
          return proxySocket;
        };
      }
      exports.apply = apply;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    (function(global) {
      var utils = __webpack_require__(4);
      function apply() {
        if (global.navigator && global.navigator.geolocation) {
          utils.patchPrototype(global.navigator.geolocation, ['getCurrentPosition', 'watchPosition']);
        }
      }
      exports.apply = apply;
    }.call(exports, (function() {
      return this;
    }())));
  }, function(module, exports, __webpack_require__) {
    var utils = __webpack_require__(4);
    function apply() {
      utils.patchClass('FileReader');
    }
    exports.apply = apply;
  }]);
})(require('process'));
