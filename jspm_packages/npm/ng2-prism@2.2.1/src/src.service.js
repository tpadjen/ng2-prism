/* */ 
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
var core_1 = require('angular2/core');
var http_1 = require('angular2/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/observable/empty');
require('rxjs/add/operator/map');
require('rxjs/add/operator/filter');
require('rxjs/add/operator/distinctUntilChanged');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/do');
require('rxjs/add/operator/retry');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/switchMap');
var codeblock_component_1 = require('./codeblock.component');
var SrcService = (function() {
  function SrcService(_http) {
    this._http = _http;
    this.debounceTime = 300;
  }
  Object.defineProperty(SrcService.prototype, "host", {
    get: function() {
      return this._host;
    },
    set: function(host) {
      this._host = host;
      this._handleSrcChanges();
    },
    enumerable: true,
    configurable: true
  });
  SrcService.prototype._handleSrcChanges = function() {
    var _this = this;
    this._srcChangedSubscription = this.host.srcChanged.filter(function(source) {
      return _this._emptySources(source);
    }).map(function(source) {
      return _this._addExtensionMatches(source);
    }).filter(function(req) {
      return _this._nonFiles(req);
    }).distinctUntilChanged().do(function() {
      _this.host.loading();
    }).debounceTime(this.debounceTime).do(function(req) {
      _this.host._src = req.source;
    }).switchMap(function(req) {
      return _this._fetchSrc(req);
    }).catch(function(error) {
      _this.host.message("Error: Could not download file.");
      console.error(error);
      return Observable_1.Observable.empty();
    }).subscribe(function(res) {
      _this._handleResponseSuccess(res);
    }, function(error) {
      _this._handleResponseError(error);
    });
  };
  SrcService.prototype.ngOnDestroy = function() {
    this._srcChangedSubscription.dispose();
  };
  SrcService.prototype._emptySources = function(source) {
    return !(source === undefined || source == null);
  };
  SrcService.prototype._addExtensionMatches = function(source) {
    return {
      source: source,
      extMatches: source.match(/\.(\w+)$/)
    };
  };
  SrcService.prototype._nonFiles = function(req) {
    if (!req.extMatches) {
      if (req.source && req.source.length > 0) {
        this.host.message(req.source + " is not a file.");
      } else {
        this.host.message("No source file given.");
      }
      return false;
    }
    return true;
  };
  SrcService.prototype._fetchSrc = function(req) {
    var _this = this;
    return this._http.get(req.source).catch(function(error) {
      _this.host.message(req.source + " not found.");
      return Observable_1.Observable.empty();
    }).map(function(res) {
      return {
        src: req.source,
        extMatches: req.extMatches,
        text: res.text()
      };
    });
  };
  SrcService.prototype._handleResponseSuccess = function(res) {
    var fileLang = codeblock_component_1.CodeblockComponent.EXTENSION_MAP[res.extMatches[1]] || res.extMatches[1];
    if (!this.host._languageSet) {
      this.host._language = fileLang;
    }
    this.host.code = res.text;
  };
  SrcService.prototype._handleResponseError = function(error) {
    console.error("SrcService Error");
    console.error(error);
  };
  SrcService = __decorate([core_1.Injectable(), __metadata('design:paramtypes', [http_1.Http])], SrcService);
  return SrcService;
})();
exports.SrcService = SrcService;
