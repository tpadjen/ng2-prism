/* */ 
'use strict';
var lang_1 = require('../../../facade/lang');
var exceptions_1 = require('../../../facade/exceptions');
var collection_1 = require('../../../facade/collection');
var utils_1 = require('../../utils');
var url_parser_1 = require('../../url_parser');
var route_path_1 = require('./route_path');
var ContinuationPathSegment = (function() {
  function ContinuationPathSegment() {
    this.name = '';
    this.specificity = '';
    this.hash = '...';
  }
  ContinuationPathSegment.prototype.generate = function(params) {
    return '';
  };
  ContinuationPathSegment.prototype.match = function(path) {
    return true;
  };
  return ContinuationPathSegment;
})();
var StaticPathSegment = (function() {
  function StaticPathSegment(path) {
    this.path = path;
    this.name = '';
    this.specificity = '2';
    this.hash = path;
  }
  StaticPathSegment.prototype.match = function(path) {
    return path == this.path;
  };
  StaticPathSegment.prototype.generate = function(params) {
    return this.path;
  };
  return StaticPathSegment;
})();
var DynamicPathSegment = (function() {
  function DynamicPathSegment(name) {
    this.name = name;
    this.specificity = '1';
    this.hash = ':';
  }
  DynamicPathSegment.prototype.match = function(path) {
    return path.length > 0;
  };
  DynamicPathSegment.prototype.generate = function(params) {
    if (!collection_1.StringMapWrapper.contains(params.map, this.name)) {
      throw new exceptions_1.BaseException("Route generator for '" + this.name + "' was not included in parameters passed.");
    }
    return utils_1.normalizeString(params.get(this.name));
  };
  DynamicPathSegment.paramMatcher = /^:([^\/]+)$/g;
  return DynamicPathSegment;
})();
var StarPathSegment = (function() {
  function StarPathSegment(name) {
    this.name = name;
    this.specificity = '0';
    this.hash = '*';
  }
  StarPathSegment.prototype.match = function(path) {
    return true;
  };
  StarPathSegment.prototype.generate = function(params) {
    return utils_1.normalizeString(params.get(this.name));
  };
  StarPathSegment.wildcardMatcher = /^\*([^\/]+)$/g;
  return StarPathSegment;
})();
var ParamRoutePath = (function() {
  function ParamRoutePath(routePath) {
    this.routePath = routePath;
    this.terminal = true;
    this._assertValidPath(routePath);
    this._parsePathString(routePath);
    this.specificity = this._calculateSpecificity();
    this.hash = this._calculateHash();
    var lastSegment = this._segments[this._segments.length - 1];
    this.terminal = !(lastSegment instanceof ContinuationPathSegment);
  }
  ParamRoutePath.prototype.matchUrl = function(url) {
    var nextUrlSegment = url;
    var currentUrlSegment;
    var positionalParams = {};
    var captured = [];
    for (var i = 0; i < this._segments.length; i += 1) {
      var pathSegment = this._segments[i];
      currentUrlSegment = nextUrlSegment;
      if (pathSegment instanceof ContinuationPathSegment) {
        break;
      }
      if (lang_1.isPresent(currentUrlSegment)) {
        if (pathSegment instanceof StarPathSegment) {
          positionalParams[pathSegment.name] = currentUrlSegment.toString();
          captured.push(currentUrlSegment.toString());
          nextUrlSegment = null;
          break;
        }
        captured.push(currentUrlSegment.path);
        if (pathSegment instanceof DynamicPathSegment) {
          positionalParams[pathSegment.name] = currentUrlSegment.path;
        } else if (!pathSegment.match(currentUrlSegment.path)) {
          return null;
        }
        nextUrlSegment = currentUrlSegment.child;
      } else if (!pathSegment.match('')) {
        return null;
      }
    }
    if (this.terminal && lang_1.isPresent(nextUrlSegment)) {
      return null;
    }
    var urlPath = captured.join('/');
    var auxiliary = [];
    var urlParams = [];
    var allParams = positionalParams;
    if (lang_1.isPresent(currentUrlSegment)) {
      var paramsSegment = url instanceof url_parser_1.RootUrl ? url : currentUrlSegment;
      if (lang_1.isPresent(paramsSegment.params)) {
        allParams = collection_1.StringMapWrapper.merge(paramsSegment.params, positionalParams);
        urlParams = url_parser_1.convertUrlParamsToArray(paramsSegment.params);
      } else {
        allParams = positionalParams;
      }
      auxiliary = currentUrlSegment.auxiliary;
    }
    return new route_path_1.MatchedUrl(urlPath, urlParams, allParams, auxiliary, nextUrlSegment);
  };
  ParamRoutePath.prototype.generateUrl = function(params) {
    var paramTokens = new utils_1.TouchMap(params);
    var path = [];
    for (var i = 0; i < this._segments.length; i++) {
      var segment = this._segments[i];
      if (!(segment instanceof ContinuationPathSegment)) {
        path.push(segment.generate(paramTokens));
      }
    }
    var urlPath = path.join('/');
    var nonPositionalParams = paramTokens.getUnused();
    var urlParams = nonPositionalParams;
    return new route_path_1.GeneratedUrl(urlPath, urlParams);
  };
  ParamRoutePath.prototype.toString = function() {
    return this.routePath;
  };
  ParamRoutePath.prototype._parsePathString = function(routePath) {
    if (routePath.startsWith("/")) {
      routePath = routePath.substring(1);
    }
    var segmentStrings = routePath.split('/');
    this._segments = [];
    var limit = segmentStrings.length - 1;
    for (var i = 0; i <= limit; i++) {
      var segment = segmentStrings[i],
          match;
      if (lang_1.isPresent(match = lang_1.RegExpWrapper.firstMatch(DynamicPathSegment.paramMatcher, segment))) {
        this._segments.push(new DynamicPathSegment(match[1]));
      } else if (lang_1.isPresent(match = lang_1.RegExpWrapper.firstMatch(StarPathSegment.wildcardMatcher, segment))) {
        this._segments.push(new StarPathSegment(match[1]));
      } else if (segment == '...') {
        if (i < limit) {
          throw new exceptions_1.BaseException("Unexpected \"...\" before the end of the path for \"" + routePath + "\".");
        }
        this._segments.push(new ContinuationPathSegment());
      } else {
        this._segments.push(new StaticPathSegment(segment));
      }
    }
  };
  ParamRoutePath.prototype._calculateSpecificity = function() {
    var i,
        length = this._segments.length,
        specificity;
    if (length == 0) {
      specificity += '2';
    } else {
      specificity = '';
      for (i = 0; i < length; i++) {
        specificity += this._segments[i].specificity;
      }
    }
    return specificity;
  };
  ParamRoutePath.prototype._calculateHash = function() {
    var i,
        length = this._segments.length;
    var hashParts = [];
    for (i = 0; i < length; i++) {
      hashParts.push(this._segments[i].hash);
    }
    return hashParts.join('/');
  };
  ParamRoutePath.prototype._assertValidPath = function(path) {
    if (lang_1.StringWrapper.contains(path, '#')) {
      throw new exceptions_1.BaseException("Path \"" + path + "\" should not include \"#\". Use \"HashLocationStrategy\" instead.");
    }
    var illegalCharacter = lang_1.RegExpWrapper.firstMatch(ParamRoutePath.RESERVED_CHARS, path);
    if (lang_1.isPresent(illegalCharacter)) {
      throw new exceptions_1.BaseException("Path \"" + path + "\" contains \"" + illegalCharacter[0] + "\" which is not allowed in a route config.");
    }
  };
  ParamRoutePath.RESERVED_CHARS = lang_1.RegExpWrapper.create('//|\\(|\\)|;|\\?|=');
  return ParamRoutePath;
})();
exports.ParamRoutePath = ParamRoutePath;
