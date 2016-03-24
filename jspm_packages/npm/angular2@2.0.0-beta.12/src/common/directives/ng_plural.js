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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var core_1 = require('../../../core');
var lang_1 = require('../../facade/lang');
var collection_1 = require('../../facade/collection');
var ng_switch_1 = require('./ng_switch');
var _CATEGORY_DEFAULT = 'other';
var NgLocalization = (function() {
  function NgLocalization() {}
  return NgLocalization;
})();
exports.NgLocalization = NgLocalization;
var NgPluralCase = (function() {
  function NgPluralCase(value, template, viewContainer) {
    this.value = value;
    this._view = new ng_switch_1.SwitchView(viewContainer, template);
  }
  NgPluralCase = __decorate([core_1.Directive({selector: '[ngPluralCase]'}), __param(0, core_1.Attribute('ngPluralCase')), __metadata('design:paramtypes', [String, core_1.TemplateRef, core_1.ViewContainerRef])], NgPluralCase);
  return NgPluralCase;
})();
exports.NgPluralCase = NgPluralCase;
var NgPlural = (function() {
  function NgPlural(_localization) {
    this._localization = _localization;
    this._caseViews = new collection_1.Map();
    this.cases = null;
  }
  Object.defineProperty(NgPlural.prototype, "ngPlural", {
    set: function(value) {
      this._switchValue = value;
      this._updateView();
    },
    enumerable: true,
    configurable: true
  });
  NgPlural.prototype.ngAfterContentInit = function() {
    var _this = this;
    this.cases.forEach(function(pluralCase) {
      _this._caseViews.set(_this._formatValue(pluralCase), pluralCase._view);
    });
    this._updateView();
  };
  NgPlural.prototype._updateView = function() {
    this._clearViews();
    var view = this._caseViews.get(this._switchValue);
    if (!lang_1.isPresent(view))
      view = this._getCategoryView(this._switchValue);
    this._activateView(view);
  };
  NgPlural.prototype._clearViews = function() {
    if (lang_1.isPresent(this._activeView))
      this._activeView.destroy();
  };
  NgPlural.prototype._activateView = function(view) {
    if (!lang_1.isPresent(view))
      return;
    this._activeView = view;
    this._activeView.create();
  };
  NgPlural.prototype._getCategoryView = function(value) {
    var category = this._localization.getPluralCategory(value);
    var categoryView = this._caseViews.get(category);
    return lang_1.isPresent(categoryView) ? categoryView : this._caseViews.get(_CATEGORY_DEFAULT);
  };
  NgPlural.prototype._isValueView = function(pluralCase) {
    return pluralCase.value[0] === "=";
  };
  NgPlural.prototype._formatValue = function(pluralCase) {
    return this._isValueView(pluralCase) ? this._stripValue(pluralCase.value) : pluralCase.value;
  };
  NgPlural.prototype._stripValue = function(value) {
    return lang_1.NumberWrapper.parseInt(value.substring(1), 10);
  };
  __decorate([core_1.ContentChildren(NgPluralCase), __metadata('design:type', core_1.QueryList)], NgPlural.prototype, "cases", void 0);
  __decorate([core_1.Input(), __metadata('design:type', Number), __metadata('design:paramtypes', [Number])], NgPlural.prototype, "ngPlural", null);
  NgPlural = __decorate([core_1.Directive({selector: '[ngPlural]'}), __metadata('design:paramtypes', [NgLocalization])], NgPlural);
  return NgPlural;
})();
exports.NgPlural = NgPlural;
