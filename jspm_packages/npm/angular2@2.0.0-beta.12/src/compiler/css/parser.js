/* */ 
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
var parse_util_1 = require('../parse_util');
var lang_1 = require('../../facade/lang');
var lexer_1 = require('./lexer');
var lexer_2 = require('./lexer');
exports.CssToken = lexer_2.CssToken;
(function(BlockType) {
  BlockType[BlockType["Import"] = 0] = "Import";
  BlockType[BlockType["Charset"] = 1] = "Charset";
  BlockType[BlockType["Namespace"] = 2] = "Namespace";
  BlockType[BlockType["Supports"] = 3] = "Supports";
  BlockType[BlockType["Keyframes"] = 4] = "Keyframes";
  BlockType[BlockType["MediaQuery"] = 5] = "MediaQuery";
  BlockType[BlockType["Selector"] = 6] = "Selector";
  BlockType[BlockType["FontFace"] = 7] = "FontFace";
  BlockType[BlockType["Page"] = 8] = "Page";
  BlockType[BlockType["Document"] = 9] = "Document";
  BlockType[BlockType["Viewport"] = 10] = "Viewport";
  BlockType[BlockType["Unsupported"] = 11] = "Unsupported";
})(exports.BlockType || (exports.BlockType = {}));
var BlockType = exports.BlockType;
var EOF_DELIM = 1;
var RBRACE_DELIM = 2;
var LBRACE_DELIM = 4;
var COMMA_DELIM = 8;
var COLON_DELIM = 16;
var SEMICOLON_DELIM = 32;
var NEWLINE_DELIM = 64;
var RPAREN_DELIM = 128;
function mergeTokens(tokens, separator) {
  if (separator === void 0) {
    separator = "";
  }
  var mainToken = tokens[0];
  var str = mainToken.strValue;
  for (var i = 1; i < tokens.length; i++) {
    str += separator + tokens[i].strValue;
  }
  return new lexer_1.CssToken(mainToken.index, mainToken.column, mainToken.line, mainToken.type, str);
}
function getDelimFromToken(token) {
  return getDelimFromCharacter(token.numValue);
}
function getDelimFromCharacter(code) {
  switch (code) {
    case lexer_1.$EOF:
      return EOF_DELIM;
    case lexer_1.$COMMA:
      return COMMA_DELIM;
    case lexer_1.$COLON:
      return COLON_DELIM;
    case lexer_1.$SEMICOLON:
      return SEMICOLON_DELIM;
    case lexer_1.$RBRACE:
      return RBRACE_DELIM;
    case lexer_1.$LBRACE:
      return LBRACE_DELIM;
    case lexer_1.$RPAREN:
      return RPAREN_DELIM;
    default:
      return lexer_1.isNewline(code) ? NEWLINE_DELIM : 0;
  }
}
function characterContainsDelimiter(code, delimiters) {
  return lang_1.bitWiseAnd([getDelimFromCharacter(code), delimiters]) > 0;
}
var CssAST = (function() {
  function CssAST() {}
  CssAST.prototype.visit = function(visitor, context) {};
  return CssAST;
})();
exports.CssAST = CssAST;
var ParsedCssResult = (function() {
  function ParsedCssResult(errors, ast) {
    this.errors = errors;
    this.ast = ast;
  }
  return ParsedCssResult;
})();
exports.ParsedCssResult = ParsedCssResult;
var CssParser = (function() {
  function CssParser(_scanner, _fileName) {
    this._scanner = _scanner;
    this._fileName = _fileName;
    this._errors = [];
    this._file = new parse_util_1.ParseSourceFile(this._scanner.input, _fileName);
  }
  CssParser.prototype._resolveBlockType = function(token) {
    switch (token.strValue) {
      case '@-o-keyframes':
      case '@-moz-keyframes':
      case '@-webkit-keyframes':
      case '@keyframes':
        return BlockType.Keyframes;
      case '@charset':
        return BlockType.Charset;
      case '@import':
        return BlockType.Import;
      case '@namespace':
        return BlockType.Namespace;
      case '@page':
        return BlockType.Page;
      case '@document':
        return BlockType.Document;
      case '@media':
        return BlockType.MediaQuery;
      case '@font-face':
        return BlockType.FontFace;
      case '@viewport':
        return BlockType.Viewport;
      case '@supports':
        return BlockType.Supports;
      default:
        return BlockType.Unsupported;
    }
  };
  CssParser.prototype.parse = function() {
    var delimiters = EOF_DELIM;
    var ast = this._parseStyleSheet(delimiters);
    var errors = this._errors;
    this._errors = [];
    return new ParsedCssResult(errors, ast);
  };
  CssParser.prototype._parseStyleSheet = function(delimiters) {
    var results = [];
    this._scanner.consumeEmptyStatements();
    while (this._scanner.peek != lexer_1.$EOF) {
      this._scanner.setMode(lexer_1.CssLexerMode.BLOCK);
      results.push(this._parseRule(delimiters));
    }
    return new CssStyleSheetAST(results);
  };
  CssParser.prototype._parseRule = function(delimiters) {
    if (this._scanner.peek == lexer_1.$AT) {
      return this._parseAtRule(delimiters);
    }
    return this._parseSelectorRule(delimiters);
  };
  CssParser.prototype._parseAtRule = function(delimiters) {
    this._scanner.setMode(lexer_1.CssLexerMode.BLOCK);
    var token = this._scan();
    this._assertCondition(token.type == lexer_1.CssTokenType.AtKeyword, "The CSS Rule " + token.strValue + " is not a valid [@] rule.", token);
    var block,
        type = this._resolveBlockType(token);
    switch (type) {
      case BlockType.Charset:
      case BlockType.Namespace:
      case BlockType.Import:
        var value = this._parseValue(delimiters);
        this._scanner.setMode(lexer_1.CssLexerMode.BLOCK);
        this._scanner.consumeEmptyStatements();
        return new CssInlineRuleAST(type, value);
      case BlockType.Viewport:
      case BlockType.FontFace:
        block = this._parseStyleBlock(delimiters);
        return new CssBlockRuleAST(type, block);
      case BlockType.Keyframes:
        var tokens = this._collectUntilDelim(lang_1.bitWiseOr([delimiters, RBRACE_DELIM, LBRACE_DELIM]));
        var name = tokens[0];
        return new CssKeyframeRuleAST(name, this._parseKeyframeBlock(delimiters));
      case BlockType.MediaQuery:
        this._scanner.setMode(lexer_1.CssLexerMode.MEDIA_QUERY);
        var tokens = this._collectUntilDelim(lang_1.bitWiseOr([delimiters, RBRACE_DELIM, LBRACE_DELIM]));
        return new CssMediaQueryRuleAST(tokens, this._parseBlock(delimiters));
      case BlockType.Document:
      case BlockType.Supports:
      case BlockType.Page:
        this._scanner.setMode(lexer_1.CssLexerMode.AT_RULE_QUERY);
        var tokens = this._collectUntilDelim(lang_1.bitWiseOr([delimiters, RBRACE_DELIM, LBRACE_DELIM]));
        return new CssBlockDefinitionRuleAST(type, tokens, this._parseBlock(delimiters));
      default:
        var listOfTokens = [];
        this._scanner.setMode(lexer_1.CssLexerMode.ALL);
        this._error(lexer_1.generateErrorMessage(this._scanner.input, "The CSS \"at\" rule \"" + token.strValue + "\" is not allowed to used here", token.strValue, token.index, token.line, token.column), token);
        this._collectUntilDelim(lang_1.bitWiseOr([delimiters, LBRACE_DELIM, SEMICOLON_DELIM])).forEach(function(token) {
          listOfTokens.push(token);
        });
        if (this._scanner.peek == lexer_1.$LBRACE) {
          this._consume(lexer_1.CssTokenType.Character, '{');
          this._collectUntilDelim(lang_1.bitWiseOr([delimiters, RBRACE_DELIM, LBRACE_DELIM])).forEach(function(token) {
            listOfTokens.push(token);
          });
          this._consume(lexer_1.CssTokenType.Character, '}');
        }
        return new CssUnknownTokenListAST(token, listOfTokens);
    }
  };
  CssParser.prototype._parseSelectorRule = function(delimiters) {
    var selectors = this._parseSelectors(delimiters);
    var block = this._parseStyleBlock(delimiters);
    this._scanner.setMode(lexer_1.CssLexerMode.BLOCK);
    this._scanner.consumeEmptyStatements();
    return new CssSelectorRuleAST(selectors, block);
  };
  CssParser.prototype._parseSelectors = function(delimiters) {
    delimiters = lang_1.bitWiseOr([delimiters, LBRACE_DELIM]);
    var selectors = [];
    var isParsingSelectors = true;
    while (isParsingSelectors) {
      selectors.push(this._parseSelector(delimiters));
      isParsingSelectors = !characterContainsDelimiter(this._scanner.peek, delimiters);
      if (isParsingSelectors) {
        this._consume(lexer_1.CssTokenType.Character, ',');
        isParsingSelectors = !characterContainsDelimiter(this._scanner.peek, delimiters);
      }
    }
    return selectors;
  };
  CssParser.prototype._scan = function() {
    var output = this._scanner.scan();
    var token = output.token;
    var error = output.error;
    if (lang_1.isPresent(error)) {
      this._error(error.rawMessage, token);
    }
    return token;
  };
  CssParser.prototype._consume = function(type, value) {
    if (value === void 0) {
      value = null;
    }
    var output = this._scanner.consume(type, value);
    var token = output.token;
    var error = output.error;
    if (lang_1.isPresent(error)) {
      this._error(error.rawMessage, token);
    }
    return token;
  };
  CssParser.prototype._parseKeyframeBlock = function(delimiters) {
    delimiters = lang_1.bitWiseOr([delimiters, RBRACE_DELIM]);
    this._scanner.setMode(lexer_1.CssLexerMode.KEYFRAME_BLOCK);
    this._consume(lexer_1.CssTokenType.Character, '{');
    var definitions = [];
    while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
      definitions.push(this._parseKeyframeDefinition(delimiters));
    }
    this._consume(lexer_1.CssTokenType.Character, '}');
    return new CssBlockAST(definitions);
  };
  CssParser.prototype._parseKeyframeDefinition = function(delimiters) {
    var stepTokens = [];
    delimiters = lang_1.bitWiseOr([delimiters, LBRACE_DELIM]);
    while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
      stepTokens.push(this._parseKeyframeLabel(lang_1.bitWiseOr([delimiters, COMMA_DELIM])));
      if (this._scanner.peek != lexer_1.$LBRACE) {
        this._consume(lexer_1.CssTokenType.Character, ',');
      }
    }
    var styles = this._parseStyleBlock(lang_1.bitWiseOr([delimiters, RBRACE_DELIM]));
    this._scanner.setMode(lexer_1.CssLexerMode.BLOCK);
    return new CssKeyframeDefinitionAST(stepTokens, styles);
  };
  CssParser.prototype._parseKeyframeLabel = function(delimiters) {
    this._scanner.setMode(lexer_1.CssLexerMode.KEYFRAME_BLOCK);
    return mergeTokens(this._collectUntilDelim(delimiters));
  };
  CssParser.prototype._parseSelector = function(delimiters) {
    delimiters = lang_1.bitWiseOr([delimiters, COMMA_DELIM, LBRACE_DELIM]);
    this._scanner.setMode(lexer_1.CssLexerMode.SELECTOR);
    var selectorCssTokens = [];
    var isComplex = false;
    var wsCssToken;
    var previousToken;
    var parenCount = 0;
    while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
      var code = this._scanner.peek;
      switch (code) {
        case lexer_1.$LPAREN:
          parenCount++;
          break;
        case lexer_1.$RPAREN:
          parenCount--;
          break;
        case lexer_1.$COLON:
          this._scanner.setMode(lexer_1.CssLexerMode.PSEUDO_SELECTOR);
          previousToken = this._consume(lexer_1.CssTokenType.Character, ':');
          selectorCssTokens.push(previousToken);
          continue;
        case lexer_1.$LBRACKET:
          if (this._scanner.getMode() != lexer_1.CssLexerMode.ATTRIBUTE_SELECTOR) {
            selectorCssTokens.push(this._consume(lexer_1.CssTokenType.Character, '['));
            this._scanner.setMode(lexer_1.CssLexerMode.ATTRIBUTE_SELECTOR);
            continue;
          }
          break;
        case lexer_1.$RBRACKET:
          selectorCssTokens.push(this._consume(lexer_1.CssTokenType.Character, ']'));
          this._scanner.setMode(lexer_1.CssLexerMode.SELECTOR);
          continue;
      }
      var token = this._scan();
      if (this._scanner.getMode() == lexer_1.CssLexerMode.PSEUDO_SELECTOR && lang_1.isPresent(previousToken) && previousToken.numValue == lexer_1.$COLON && token.strValue == "not" && this._scanner.peek == lexer_1.$LPAREN) {
        selectorCssTokens.push(token);
        selectorCssTokens.push(this._consume(lexer_1.CssTokenType.Character, '('));
        this._parseSelector(lang_1.bitWiseOr([delimiters, RPAREN_DELIM])).tokens.forEach(function(innerSelectorToken) {
          selectorCssTokens.push(innerSelectorToken);
        });
        selectorCssTokens.push(this._consume(lexer_1.CssTokenType.Character, ')'));
        continue;
      }
      previousToken = token;
      if (token.type == lexer_1.CssTokenType.Whitespace) {
        wsCssToken = token;
      } else {
        if (lang_1.isPresent(wsCssToken)) {
          selectorCssTokens.push(wsCssToken);
          wsCssToken = null;
          isComplex = true;
        }
        selectorCssTokens.push(token);
      }
    }
    if (this._scanner.getMode() == lexer_1.CssLexerMode.ATTRIBUTE_SELECTOR) {
      this._error("Unbalanced CSS attribute selector at column " + previousToken.line + ":" + previousToken.column, previousToken);
    } else if (parenCount > 0) {
      this._error("Unbalanced pseudo selector function value at column " + previousToken.line + ":" + previousToken.column, previousToken);
    }
    return new CssSelectorAST(selectorCssTokens, isComplex);
  };
  CssParser.prototype._parseValue = function(delimiters) {
    delimiters = lang_1.bitWiseOr([delimiters, RBRACE_DELIM, SEMICOLON_DELIM, NEWLINE_DELIM]);
    this._scanner.setMode(lexer_1.CssLexerMode.STYLE_VALUE);
    var strValue = "";
    var tokens = [];
    var previous;
    while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
      var token;
      if (lang_1.isPresent(previous) && previous.type == lexer_1.CssTokenType.Identifier && this._scanner.peek == lexer_1.$LPAREN) {
        token = this._consume(lexer_1.CssTokenType.Character, '(');
        tokens.push(token);
        strValue += token.strValue;
        this._scanner.setMode(lexer_1.CssLexerMode.STYLE_VALUE_FUNCTION);
        token = this._scan();
        tokens.push(token);
        strValue += token.strValue;
        this._scanner.setMode(lexer_1.CssLexerMode.STYLE_VALUE);
        token = this._consume(lexer_1.CssTokenType.Character, ')');
        tokens.push(token);
        strValue += token.strValue;
      } else {
        token = this._scan();
        if (token.type != lexer_1.CssTokenType.Whitespace) {
          tokens.push(token);
        }
        strValue += token.strValue;
      }
      previous = token;
    }
    this._scanner.consumeWhitespace();
    var code = this._scanner.peek;
    if (code == lexer_1.$SEMICOLON) {
      this._consume(lexer_1.CssTokenType.Character, ';');
    } else if (code != lexer_1.$RBRACE) {
      this._error(lexer_1.generateErrorMessage(this._scanner.input, "The CSS key/value definition did not end with a semicolon", previous.strValue, previous.index, previous.line, previous.column), previous);
    }
    return new CssStyleValueAST(tokens, strValue);
  };
  CssParser.prototype._collectUntilDelim = function(delimiters, assertType) {
    if (assertType === void 0) {
      assertType = null;
    }
    var tokens = [];
    while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
      var val = lang_1.isPresent(assertType) ? this._consume(assertType) : this._scan();
      tokens.push(val);
    }
    return tokens;
  };
  CssParser.prototype._parseBlock = function(delimiters) {
    delimiters = lang_1.bitWiseOr([delimiters, RBRACE_DELIM]);
    this._scanner.setMode(lexer_1.CssLexerMode.BLOCK);
    this._consume(lexer_1.CssTokenType.Character, '{');
    this._scanner.consumeEmptyStatements();
    var results = [];
    while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
      results.push(this._parseRule(delimiters));
    }
    this._consume(lexer_1.CssTokenType.Character, '}');
    this._scanner.setMode(lexer_1.CssLexerMode.BLOCK);
    this._scanner.consumeEmptyStatements();
    return new CssBlockAST(results);
  };
  CssParser.prototype._parseStyleBlock = function(delimiters) {
    delimiters = lang_1.bitWiseOr([delimiters, RBRACE_DELIM, LBRACE_DELIM]);
    this._scanner.setMode(lexer_1.CssLexerMode.STYLE_BLOCK);
    this._consume(lexer_1.CssTokenType.Character, '{');
    this._scanner.consumeEmptyStatements();
    var definitions = [];
    while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
      definitions.push(this._parseDefinition(delimiters));
      this._scanner.consumeEmptyStatements();
    }
    this._consume(lexer_1.CssTokenType.Character, '}');
    this._scanner.setMode(lexer_1.CssLexerMode.STYLE_BLOCK);
    this._scanner.consumeEmptyStatements();
    return new CssBlockAST(definitions);
  };
  CssParser.prototype._parseDefinition = function(delimiters) {
    this._scanner.setMode(lexer_1.CssLexerMode.STYLE_BLOCK);
    var prop = this._consume(lexer_1.CssTokenType.Identifier);
    var parseValue,
        value = null;
    switch (this._scanner.peek) {
      case lexer_1.$COLON:
        this._consume(lexer_1.CssTokenType.Character, ':');
        parseValue = true;
        break;
      case lexer_1.$SEMICOLON:
      case lexer_1.$RBRACE:
      case lexer_1.$EOF:
        parseValue = false;
        break;
      default:
        var propStr = [prop.strValue];
        if (this._scanner.peek != lexer_1.$COLON) {
          var nextValue = this._consume(lexer_1.CssTokenType.Character, ':');
          propStr.push(nextValue.strValue);
          var remainingTokens = this._collectUntilDelim(lang_1.bitWiseOr([delimiters, COLON_DELIM, SEMICOLON_DELIM]), lexer_1.CssTokenType.Identifier);
          if (remainingTokens.length > 0) {
            remainingTokens.forEach(function(token) {
              propStr.push(token.strValue);
            });
          }
          prop = new lexer_1.CssToken(prop.index, prop.column, prop.line, prop.type, propStr.join(" "));
        }
        if (this._scanner.peek == lexer_1.$COLON) {
          this._consume(lexer_1.CssTokenType.Character, ':');
          parseValue = true;
        } else {
          parseValue = false;
        }
        break;
    }
    if (parseValue) {
      value = this._parseValue(delimiters);
    } else {
      this._error(lexer_1.generateErrorMessage(this._scanner.input, "The CSS property was not paired with a style value", prop.strValue, prop.index, prop.line, prop.column), prop);
    }
    return new CssDefinitionAST(prop, value);
  };
  CssParser.prototype._assertCondition = function(status, errorMessage, problemToken) {
    if (!status) {
      this._error(errorMessage, problemToken);
      return true;
    }
    return false;
  };
  CssParser.prototype._error = function(message, problemToken) {
    var length = problemToken.strValue.length;
    var error = CssParseError.create(this._file, 0, problemToken.line, problemToken.column, length, message);
    this._errors.push(error);
  };
  return CssParser;
})();
exports.CssParser = CssParser;
var CssStyleValueAST = (function(_super) {
  __extends(CssStyleValueAST, _super);
  function CssStyleValueAST(tokens, strValue) {
    _super.call(this);
    this.tokens = tokens;
    this.strValue = strValue;
  }
  CssStyleValueAST.prototype.visit = function(visitor, context) {
    visitor.visitCssValue(this);
  };
  return CssStyleValueAST;
})(CssAST);
exports.CssStyleValueAST = CssStyleValueAST;
var CssRuleAST = (function(_super) {
  __extends(CssRuleAST, _super);
  function CssRuleAST() {
    _super.apply(this, arguments);
  }
  return CssRuleAST;
})(CssAST);
exports.CssRuleAST = CssRuleAST;
var CssBlockRuleAST = (function(_super) {
  __extends(CssBlockRuleAST, _super);
  function CssBlockRuleAST(type, block, name) {
    if (name === void 0) {
      name = null;
    }
    _super.call(this);
    this.type = type;
    this.block = block;
    this.name = name;
  }
  CssBlockRuleAST.prototype.visit = function(visitor, context) {
    visitor.visitCssBlock(this.block, context);
  };
  return CssBlockRuleAST;
})(CssRuleAST);
exports.CssBlockRuleAST = CssBlockRuleAST;
var CssKeyframeRuleAST = (function(_super) {
  __extends(CssKeyframeRuleAST, _super);
  function CssKeyframeRuleAST(name, block) {
    _super.call(this, BlockType.Keyframes, block, name);
  }
  CssKeyframeRuleAST.prototype.visit = function(visitor, context) {
    visitor.visitCssKeyframeRule(this, context);
  };
  return CssKeyframeRuleAST;
})(CssBlockRuleAST);
exports.CssKeyframeRuleAST = CssKeyframeRuleAST;
var CssKeyframeDefinitionAST = (function(_super) {
  __extends(CssKeyframeDefinitionAST, _super);
  function CssKeyframeDefinitionAST(_steps, block) {
    _super.call(this, BlockType.Keyframes, block, mergeTokens(_steps, ","));
    this.steps = _steps;
  }
  CssKeyframeDefinitionAST.prototype.visit = function(visitor, context) {
    visitor.visitCssKeyframeDefinition(this, context);
  };
  return CssKeyframeDefinitionAST;
})(CssBlockRuleAST);
exports.CssKeyframeDefinitionAST = CssKeyframeDefinitionAST;
var CssBlockDefinitionRuleAST = (function(_super) {
  __extends(CssBlockDefinitionRuleAST, _super);
  function CssBlockDefinitionRuleAST(type, query, block) {
    _super.call(this, type, block);
    this.query = query;
    this.strValue = query.map(function(token) {
      return token.strValue;
    }).join("");
    var firstCssToken = query[0];
    this.name = new lexer_1.CssToken(firstCssToken.index, firstCssToken.column, firstCssToken.line, lexer_1.CssTokenType.Identifier, this.strValue);
  }
  CssBlockDefinitionRuleAST.prototype.visit = function(visitor, context) {
    visitor.visitCssBlock(this.block, context);
  };
  return CssBlockDefinitionRuleAST;
})(CssBlockRuleAST);
exports.CssBlockDefinitionRuleAST = CssBlockDefinitionRuleAST;
var CssMediaQueryRuleAST = (function(_super) {
  __extends(CssMediaQueryRuleAST, _super);
  function CssMediaQueryRuleAST(query, block) {
    _super.call(this, BlockType.MediaQuery, query, block);
  }
  CssMediaQueryRuleAST.prototype.visit = function(visitor, context) {
    visitor.visitCssMediaQueryRule(this, context);
  };
  return CssMediaQueryRuleAST;
})(CssBlockDefinitionRuleAST);
exports.CssMediaQueryRuleAST = CssMediaQueryRuleAST;
var CssInlineRuleAST = (function(_super) {
  __extends(CssInlineRuleAST, _super);
  function CssInlineRuleAST(type, value) {
    _super.call(this);
    this.type = type;
    this.value = value;
  }
  CssInlineRuleAST.prototype.visit = function(visitor, context) {
    visitor.visitInlineCssRule(this, context);
  };
  return CssInlineRuleAST;
})(CssRuleAST);
exports.CssInlineRuleAST = CssInlineRuleAST;
var CssSelectorRuleAST = (function(_super) {
  __extends(CssSelectorRuleAST, _super);
  function CssSelectorRuleAST(selectors, block) {
    _super.call(this, BlockType.Selector, block);
    this.selectors = selectors;
    this.strValue = selectors.map(function(selector) {
      return selector.strValue;
    }).join(",");
  }
  CssSelectorRuleAST.prototype.visit = function(visitor, context) {
    visitor.visitCssSelectorRule(this, context);
  };
  return CssSelectorRuleAST;
})(CssBlockRuleAST);
exports.CssSelectorRuleAST = CssSelectorRuleAST;
var CssDefinitionAST = (function(_super) {
  __extends(CssDefinitionAST, _super);
  function CssDefinitionAST(property, value) {
    _super.call(this);
    this.property = property;
    this.value = value;
  }
  CssDefinitionAST.prototype.visit = function(visitor, context) {
    visitor.visitCssDefinition(this, context);
  };
  return CssDefinitionAST;
})(CssAST);
exports.CssDefinitionAST = CssDefinitionAST;
var CssSelectorAST = (function(_super) {
  __extends(CssSelectorAST, _super);
  function CssSelectorAST(tokens, isComplex) {
    if (isComplex === void 0) {
      isComplex = false;
    }
    _super.call(this);
    this.tokens = tokens;
    this.isComplex = isComplex;
    this.strValue = tokens.map(function(token) {
      return token.strValue;
    }).join("");
  }
  CssSelectorAST.prototype.visit = function(visitor, context) {
    visitor.visitCssSelector(this, context);
  };
  return CssSelectorAST;
})(CssAST);
exports.CssSelectorAST = CssSelectorAST;
var CssBlockAST = (function(_super) {
  __extends(CssBlockAST, _super);
  function CssBlockAST(entries) {
    _super.call(this);
    this.entries = entries;
  }
  CssBlockAST.prototype.visit = function(visitor, context) {
    visitor.visitCssBlock(this, context);
  };
  return CssBlockAST;
})(CssAST);
exports.CssBlockAST = CssBlockAST;
var CssStyleSheetAST = (function(_super) {
  __extends(CssStyleSheetAST, _super);
  function CssStyleSheetAST(rules) {
    _super.call(this);
    this.rules = rules;
  }
  CssStyleSheetAST.prototype.visit = function(visitor, context) {
    visitor.visitCssStyleSheet(this, context);
  };
  return CssStyleSheetAST;
})(CssAST);
exports.CssStyleSheetAST = CssStyleSheetAST;
var CssParseError = (function(_super) {
  __extends(CssParseError, _super);
  function CssParseError(span, message) {
    _super.call(this, span, message);
  }
  CssParseError.create = function(file, offset, line, col, length, errMsg) {
    var start = new parse_util_1.ParseLocation(file, offset, line, col);
    var end = new parse_util_1.ParseLocation(file, offset, line, col + length);
    var span = new parse_util_1.ParseSourceSpan(start, end);
    return new CssParseError(span, "CSS Parse Error: " + errMsg);
  };
  return CssParseError;
})(parse_util_1.ParseError);
exports.CssParseError = CssParseError;
var CssUnknownTokenListAST = (function(_super) {
  __extends(CssUnknownTokenListAST, _super);
  function CssUnknownTokenListAST(name, tokens) {
    _super.call(this);
    this.name = name;
    this.tokens = tokens;
  }
  CssUnknownTokenListAST.prototype.visit = function(visitor, context) {
    visitor.visitUnkownRule(this, context);
  };
  return CssUnknownTokenListAST;
})(CssRuleAST);
exports.CssUnknownTokenListAST = CssUnknownTokenListAST;
