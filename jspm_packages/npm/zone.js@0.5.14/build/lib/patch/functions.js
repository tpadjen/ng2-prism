/* */ 
(function(process) {
  var wtf = require('../wtf');
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
})(require('process'));
