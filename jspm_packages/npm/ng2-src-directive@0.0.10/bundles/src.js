/* */ 
"format cjs";
System.registerDynamic("src/src.directive", ["angular2/core", "angular2/http", "rxjs/Observable", "rxjs/Subject", "rxjs/add/observable/empty", "rxjs/add/observable/timer", "rxjs/add/operator/map", "rxjs/add/operator/filter", "rxjs/add/operator/distinctUntilChanged", "rxjs/add/operator/debounce", "rxjs/add/operator/do", "rxjs/add/operator/retry", "rxjs/add/operator/catch", "rxjs/add/operator/switchMap"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
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
  var core_1 = $__require('angular2/core');
  var http_1 = $__require('angular2/http');
  var Observable_1 = $__require('rxjs/Observable');
  var Subject_1 = $__require('rxjs/Subject');
  $__require('rxjs/add/observable/empty');
  $__require('rxjs/add/observable/timer');
  $__require('rxjs/add/operator/map');
  $__require('rxjs/add/operator/filter');
  $__require('rxjs/add/operator/distinctUntilChanged');
  $__require('rxjs/add/operator/debounce');
  $__require('rxjs/add/operator/do');
  $__require('rxjs/add/operator/retry');
  $__require('rxjs/add/operator/catch');
  $__require('rxjs/add/operator/switchMap');
  exports.SourceDebounceTime = 300;
  var SrcDirective = (function() {
    function SrcDirective(_element, _viewManager, _http, _renderer, _sourceDebounceTime) {
      this._element = _element;
      this._viewManager = _viewManager;
      this._http = _http;
      this._renderer = _renderer;
      this._sourceDebounceTime = _sourceDebounceTime;
      this._debounceTime = 300;
      this.sourceChanged = new Subject_1.Subject();
      this._firstRequest = true;
    }
    Object.defineProperty(SrcDirective.prototype, "src", {
      set: function(source) {
        this._src = source;
        this.sourceChanged.next(source);
      },
      enumerable: true,
      configurable: true
    });
    SrcDirective.prototype.ngOnInit = function() {
      this.host = this._viewManager.getComponent(this._element);
      if (this.host === this)
        this.host = this._element;
      if (this._sourceDebounceTime)
        this.debounceTime = this._sourceDebounceTime;
      this._handleSourceChanges();
      if (this._src)
        this.sourceChanged.next(this._src);
    };
    Object.defineProperty(SrcDirective.prototype, "debounceTime", {
      get: function() {
        return this._debounceTime;
      },
      set: function(time) {
        var parsed = parseInt(time, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          this._debounceTime = parsed;
        }
      },
      enumerable: true,
      configurable: true
    });
    SrcDirective.prototype._handleSourceChanges = function() {
      var _this = this;
      this._subscription = this.sourceChanged.do(function(source) {
        if (_this.host.sourceChanged)
          _this.host.sourceChanged(source);
      }).filter(function(source) {
        return _this._emptySources(source);
      }).map(function(source) {
        return _this._addExtensionMatches(source);
      }).filter(function(req) {
        return _this._nonFiles(req);
      }).distinctUntilChanged().do(function(req) {
        if (_this.host.sourceLoading)
          _this.host.sourceLoading(req.source);
      }).debounce(function() {
        return Observable_1.Observable.timer(_this._firstRequest ? 0 : _this.debounceTime);
      }).do(function() {
        return _this._firstRequest = false;
      }).switchMap(function(req) {
        return _this._fetchSrc(req);
      }).catch(function(error) {
        if (_this.host.sourceError)
          _this.host.sourceError(error);
        console.error(error);
        return Observable_1.Observable.empty();
      }).subscribe(function(res) {
        if (_this.host.sourceReceived) {
          _this.host.sourceReceived(res);
        } else {
          _this._renderer.setElementProperty(_this._element.nativeElement, 'innerHTML', res.text());
        }
      }, function(error) {
        if (_this.host.sourceError)
          _this.host.sourceError(error);
        console.error(error);
      });
    };
    SrcDirective.prototype.ngOnDestroy = function() {
      this._subscription.dispose();
    };
    SrcDirective.prototype._emptySources = function(source) {
      return !(source === undefined || source === null || source === '');
    };
    SrcDirective.prototype._addExtensionMatches = function(source) {
      return {
        source: source,
        extMatches: source.match(/\.(\w+)$/)
      };
    };
    SrcDirective.prototype._nonFiles = function(req) {
      if (!req.extMatches) {
        if (req.source && req.source.length > 0) {
          if (this.host.sourceError) {
            this.host.sourceError({message: req.source + " is not a file."});
          }
        } else {
          if (this.host.sourceError) {
            this.host.sourceError({message: "No source file given."});
          }
        }
        return false;
      }
      return true;
    };
    SrcDirective.prototype._fetchSrc = function(req) {
      var _this = this;
      return this._http.get(req.source).catch(function(error) {
        if (_this.host.sourceError) {
          _this.host.sourceError({message: req.source + " not found."});
        }
        return Observable_1.Observable.empty();
      });
    };
    __decorate([core_1.Input(), __metadata('design:type', String), __metadata('design:paramtypes', [String])], SrcDirective.prototype, "src", null);
    __decorate([core_1.Input(), __metadata('design:type', Object), __metadata('design:paramtypes', [Object])], SrcDirective.prototype, "debounceTime", null);
    SrcDirective = __decorate([core_1.Directive({selector: '[src]'}), __param(4, core_1.Optional()), __param(4, core_1.Inject(exports.SourceDebounceTime)), __metadata('design:paramtypes', [core_1.ElementRef, core_1.AppViewManager, http_1.Http, core_1.Renderer, Number])], SrcDirective);
    return SrcDirective;
  }());
  exports.SrcDirective = SrcDirective;
  return module.exports;
});

System.registerDynamic("src/sourcable", ["angular2/http"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var http_1 = $__require('angular2/http');
  exports.Response = http_1.Response;
  return module.exports;
});

System.registerDynamic("src", ["./src/src.directive", "./src/sourcable"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var src_directive_1 = $__require('./src/src.directive');
  var src_directive_2 = $__require('./src/src.directive');
  exports.Source = src_directive_2.SrcDirective;
  exports.SourceDebounceTime = src_directive_2.SourceDebounceTime;
  var sourcable_1 = $__require('./src/sourcable');
  exports.Response = sourcable_1.Response;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.default = {directives: [src_directive_1.SrcDirective]};
  return module.exports;
});
