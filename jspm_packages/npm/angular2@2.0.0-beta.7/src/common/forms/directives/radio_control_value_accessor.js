/* */ 
'use strict';
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var core_1 = require('../../../../core');
var control_value_accessor_1 = require('./control_value_accessor');
var ng_control_1 = require('./ng_control');
var lang_1 = require('../../../facade/lang');
var collection_1 = require('../../../facade/collection');
var RADIO_VALUE_ACCESSOR = lang_1.CONST_EXPR(new core_1.Provider(control_value_accessor_1.NG_VALUE_ACCESSOR, {
  useExisting: core_1.forwardRef(function() {
    return RadioControlValueAccessor;
  }),
  multi: true
}));
var RadioControlRegistry = (function() {
  function RadioControlRegistry() {
    this._accessors = [];
  }
  RadioControlRegistry.prototype.add = function(control, accessor) {
    this._accessors.push([control, accessor]);
  };
  RadioControlRegistry.prototype.remove = function(accessor) {
    var indexToRemove = -1;
    for (var i = 0; i < this._accessors.length; ++i) {
      if (this._accessors[i][1] === accessor) {
        indexToRemove = i;
      }
    }
    collection_1.ListWrapper.removeAt(this._accessors, indexToRemove);
  };
  RadioControlRegistry.prototype.select = function(accessor) {
    this._accessors.forEach(function(c) {
      if (c[0].control.root === accessor._control.control.root && c[1] !== accessor) {
        c[1].fireUncheck();
      }
    });
  };
  RadioControlRegistry = __decorate([core_1.Injectable(), __metadata('design:paramtypes', [])], RadioControlRegistry);
  return RadioControlRegistry;
})();
exports.RadioControlRegistry = RadioControlRegistry;
var RadioButtonState = (function() {
  function RadioButtonState(checked, value) {
    this.checked = checked;
    this.value = value;
  }
  return RadioButtonState;
})();
exports.RadioButtonState = RadioButtonState;
var RadioControlValueAccessor = (function() {
  function RadioControlValueAccessor(_renderer, _elementRef, _registry, _injector) {
    this._renderer = _renderer;
    this._elementRef = _elementRef;
    this._registry = _registry;
    this._injector = _injector;
    this.onChange = function() {};
    this.onTouched = function() {};
  }
  RadioControlValueAccessor.prototype.ngOnInit = function() {
    this._control = this._injector.get(ng_control_1.NgControl);
    this._registry.add(this._control, this);
  };
  RadioControlValueAccessor.prototype.ngOnDestroy = function() {
    this._registry.remove(this);
  };
  RadioControlValueAccessor.prototype.writeValue = function(value) {
    this._state = value;
    if (lang_1.isPresent(value) && value.checked) {
      this._renderer.setElementProperty(this._elementRef.nativeElement, 'checked', true);
    }
  };
  RadioControlValueAccessor.prototype.registerOnChange = function(fn) {
    var _this = this;
    this._fn = fn;
    this.onChange = function() {
      fn(new RadioButtonState(true, _this._state.value));
      _this._registry.select(_this);
    };
  };
  RadioControlValueAccessor.prototype.fireUncheck = function() {
    this._fn(new RadioButtonState(false, this._state.value));
  };
  RadioControlValueAccessor.prototype.registerOnTouched = function(fn) {
    this.onTouched = fn;
  };
  __decorate([core_1.Input(), __metadata('design:type', String)], RadioControlValueAccessor.prototype, "name", void 0);
  RadioControlValueAccessor = __decorate([core_1.Directive({
    selector: 'input[type=radio][ngControl],input[type=radio][ngFormControl],input[type=radio][ngModel]',
    host: {
      '(change)': 'onChange()',
      '(blur)': 'onTouched()'
    },
    providers: [RADIO_VALUE_ACCESSOR]
  }), __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, RadioControlRegistry, core_1.Injector])], RadioControlValueAccessor);
  return RadioControlValueAccessor;
})();
exports.RadioControlValueAccessor = RadioControlValueAccessor;
