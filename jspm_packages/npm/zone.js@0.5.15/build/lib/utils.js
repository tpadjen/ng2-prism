/* */ 
(function(process) {
  var keys = require('./keys');
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
    return (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
  }
  exports.isWebWorker = isWebWorker;
  function isNode() {
    return (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]');
  }
  exports.isNode = isNode;
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
})(require('process'));
