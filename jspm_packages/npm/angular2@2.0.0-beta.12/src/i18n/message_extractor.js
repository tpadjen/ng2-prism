/* */ 
(function(process) {
  'use strict';
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var parse_util_1 = require('../compiler/parse_util');
  var html_ast_1 = require('../compiler/html_ast');
  var lang_1 = require('../facade/lang');
  var collection_1 = require('../facade/collection');
  var message_1 = require('./message');
  var I18N_ATTR = "i18n";
  var I18N_ATTR_PREFIX = "i18n-";
  var ExtractionResult = (function() {
    function ExtractionResult(messages, errors) {
      this.messages = messages;
      this.errors = errors;
    }
    return ExtractionResult;
  })();
  exports.ExtractionResult = ExtractionResult;
  var I18nExtractionError = (function(_super) {
    __extends(I18nExtractionError, _super);
    function I18nExtractionError(span, msg) {
      _super.call(this, span, msg);
    }
    return I18nExtractionError;
  })(parse_util_1.ParseError);
  exports.I18nExtractionError = I18nExtractionError;
  function removeDuplicates(messages) {
    var uniq = {};
    messages.forEach(function(m) {
      if (!collection_1.StringMapWrapper.contains(uniq, message_1.id(m))) {
        uniq[message_1.id(m)] = m;
      }
    });
    return collection_1.StringMapWrapper.values(uniq);
  }
  exports.removeDuplicates = removeDuplicates;
  var MessageExtractor = (function() {
    function MessageExtractor(_htmlParser, _parser) {
      this._htmlParser = _htmlParser;
      this._parser = _parser;
    }
    MessageExtractor.prototype.extract = function(template, sourceUrl) {
      var _this = this;
      this.messages = [];
      this.errors = [];
      var res = this._htmlParser.parse(template, sourceUrl);
      if (res.errors.length > 0) {
        return new ExtractionResult([], res.errors);
      } else {
        var ps = this._partition(res.rootNodes);
        ps.forEach(function(p) {
          return _this._extractMessagesFromPart(p);
        });
        return new ExtractionResult(this.messages, this.errors);
      }
    };
    MessageExtractor.prototype._extractMessagesFromPart = function(p) {
      if (p.hasI18n) {
        this.messages.push(new message_1.Message(_stringifyNodes(p.children, this._parser), _meaning(p.i18n), _description(p.i18n)));
        this._recurseToExtractMessagesFromAttributes(p.children);
      } else {
        this._recurse(p.children);
      }
      if (lang_1.isPresent(p.rootElement)) {
        this._extractMessagesFromAttributes(p.rootElement);
      }
    };
    MessageExtractor.prototype._recurse = function(nodes) {
      var _this = this;
      var ps = this._partition(nodes);
      ps.forEach(function(p) {
        return _this._extractMessagesFromPart(p);
      });
    };
    MessageExtractor.prototype._recurseToExtractMessagesFromAttributes = function(nodes) {
      var _this = this;
      nodes.forEach(function(n) {
        if (n instanceof html_ast_1.HtmlElementAst) {
          _this._extractMessagesFromAttributes(n);
          _this._recurseToExtractMessagesFromAttributes(n.children);
        }
      });
    };
    MessageExtractor.prototype._extractMessagesFromAttributes = function(p) {
      var _this = this;
      p.attrs.forEach(function(attr) {
        if (attr.name.startsWith(I18N_ATTR_PREFIX)) {
          var expectedName = attr.name.substring(5);
          var matching = p.attrs.filter(function(a) {
            return a.name == expectedName;
          });
          if (matching.length > 0) {
            var value = _removeInterpolation(matching[0].value, p.sourceSpan, _this._parser);
            _this.messages.push(new message_1.Message(value, _meaning(attr.value), _description(attr.value)));
          } else {
            _this.errors.push(new I18nExtractionError(p.sourceSpan, "Missing attribute '" + expectedName + "'."));
          }
        }
      });
    };
    MessageExtractor.prototype._partition = function(nodes) {
      var res = [];
      for (var i = 0; i < nodes.length; ++i) {
        var n = nodes[i];
        var temp = [];
        if (_isOpeningComment(n)) {
          var i18n = n.value.substring(5).trim();
          i++;
          while (!_isClosingComment(nodes[i])) {
            temp.push(nodes[i++]);
            if (i === nodes.length) {
              this.errors.push(new I18nExtractionError(n.sourceSpan, "Missing closing 'i18n' comment."));
              break;
            }
          }
          res.push(new _Part(null, temp, i18n, true));
        } else if (n instanceof html_ast_1.HtmlElementAst) {
          var i18n = _findI18nAttr(n);
          res.push(new _Part(n, n.children, lang_1.isPresent(i18n) ? i18n.value : null, lang_1.isPresent(i18n)));
        }
      }
      return res;
    };
    return MessageExtractor;
  })();
  exports.MessageExtractor = MessageExtractor;
  var _Part = (function() {
    function _Part(rootElement, children, i18n, hasI18n) {
      this.rootElement = rootElement;
      this.children = children;
      this.i18n = i18n;
      this.hasI18n = hasI18n;
    }
    return _Part;
  })();
  function _isOpeningComment(n) {
    return n instanceof html_ast_1.HtmlCommentAst && lang_1.isPresent(n.value) && n.value.startsWith("i18n:");
  }
  function _isClosingComment(n) {
    return n instanceof html_ast_1.HtmlCommentAst && lang_1.isPresent(n.value) && n.value == "/i18n";
  }
  function _stringifyNodes(nodes, parser) {
    var visitor = new _StringifyVisitor(parser);
    return html_ast_1.htmlVisitAll(visitor, nodes).join("");
  }
  var _StringifyVisitor = (function() {
    function _StringifyVisitor(_parser) {
      this._parser = _parser;
    }
    _StringifyVisitor.prototype.visitElement = function(ast, context) {
      var attrs = this._join(html_ast_1.htmlVisitAll(this, ast.attrs), " ");
      var children = this._join(html_ast_1.htmlVisitAll(this, ast.children), "");
      return "<" + ast.name + " " + attrs + ">" + children + "</" + ast.name + ">";
    };
    _StringifyVisitor.prototype.visitAttr = function(ast, context) {
      if (ast.name.startsWith(I18N_ATTR_PREFIX)) {
        return "";
      } else {
        return ast.name + "=\"" + ast.value + "\"";
      }
    };
    _StringifyVisitor.prototype.visitText = function(ast, context) {
      return _removeInterpolation(ast.value, ast.sourceSpan, this._parser);
    };
    _StringifyVisitor.prototype.visitComment = function(ast, context) {
      return "";
    };
    _StringifyVisitor.prototype._join = function(strs, str) {
      return strs.filter(function(s) {
        return s.length > 0;
      }).join(str);
    };
    return _StringifyVisitor;
  })();
  function _removeInterpolation(value, source, parser) {
    try {
      var parsed = parser.parseInterpolation(value, source.toString());
      if (lang_1.isPresent(parsed)) {
        var ast = parsed.ast;
        var res = "";
        for (var i = 0; i < ast.strings.length; ++i) {
          res += ast.strings[i];
          if (i != ast.strings.length - 1) {
            res += "{{I" + i + "}}";
          }
        }
        return res;
      } else {
        return value;
      }
    } catch (e) {
      return value;
    }
  }
  function _findI18nAttr(p) {
    var i18n = p.attrs.filter(function(a) {
      return a.name == I18N_ATTR;
    });
    return i18n.length == 0 ? null : i18n[0];
  }
  function _meaning(i18n) {
    if (lang_1.isBlank(i18n) || i18n == "")
      return null;
    return i18n.split("|")[0];
  }
  function _description(i18n) {
    if (lang_1.isBlank(i18n) || i18n == "")
      return null;
    var parts = i18n.split("|");
    return parts.length > 1 ? parts[1] : null;
  }
})(require('process'));
