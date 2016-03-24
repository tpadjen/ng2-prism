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
var lang_1 = require('../../facade/lang');
var exceptions_1 = require('../../facade/exceptions');
var chars_1 = require('../chars');
var chars_2 = require('../chars');
exports.$EOF = chars_2.$EOF;
exports.$AT = chars_2.$AT;
exports.$RBRACE = chars_2.$RBRACE;
exports.$LBRACE = chars_2.$LBRACE;
exports.$LBRACKET = chars_2.$LBRACKET;
exports.$RBRACKET = chars_2.$RBRACKET;
exports.$LPAREN = chars_2.$LPAREN;
exports.$RPAREN = chars_2.$RPAREN;
exports.$COMMA = chars_2.$COMMA;
exports.$COLON = chars_2.$COLON;
exports.$SEMICOLON = chars_2.$SEMICOLON;
exports.isWhitespace = chars_2.isWhitespace;
(function(CssTokenType) {
  CssTokenType[CssTokenType["EOF"] = 0] = "EOF";
  CssTokenType[CssTokenType["String"] = 1] = "String";
  CssTokenType[CssTokenType["Comment"] = 2] = "Comment";
  CssTokenType[CssTokenType["Identifier"] = 3] = "Identifier";
  CssTokenType[CssTokenType["Number"] = 4] = "Number";
  CssTokenType[CssTokenType["IdentifierOrNumber"] = 5] = "IdentifierOrNumber";
  CssTokenType[CssTokenType["AtKeyword"] = 6] = "AtKeyword";
  CssTokenType[CssTokenType["Character"] = 7] = "Character";
  CssTokenType[CssTokenType["Whitespace"] = 8] = "Whitespace";
  CssTokenType[CssTokenType["Invalid"] = 9] = "Invalid";
})(exports.CssTokenType || (exports.CssTokenType = {}));
var CssTokenType = exports.CssTokenType;
(function(CssLexerMode) {
  CssLexerMode[CssLexerMode["ALL"] = 0] = "ALL";
  CssLexerMode[CssLexerMode["ALL_TRACK_WS"] = 1] = "ALL_TRACK_WS";
  CssLexerMode[CssLexerMode["SELECTOR"] = 2] = "SELECTOR";
  CssLexerMode[CssLexerMode["PSEUDO_SELECTOR"] = 3] = "PSEUDO_SELECTOR";
  CssLexerMode[CssLexerMode["ATTRIBUTE_SELECTOR"] = 4] = "ATTRIBUTE_SELECTOR";
  CssLexerMode[CssLexerMode["AT_RULE_QUERY"] = 5] = "AT_RULE_QUERY";
  CssLexerMode[CssLexerMode["MEDIA_QUERY"] = 6] = "MEDIA_QUERY";
  CssLexerMode[CssLexerMode["BLOCK"] = 7] = "BLOCK";
  CssLexerMode[CssLexerMode["KEYFRAME_BLOCK"] = 8] = "KEYFRAME_BLOCK";
  CssLexerMode[CssLexerMode["STYLE_BLOCK"] = 9] = "STYLE_BLOCK";
  CssLexerMode[CssLexerMode["STYLE_VALUE"] = 10] = "STYLE_VALUE";
  CssLexerMode[CssLexerMode["STYLE_VALUE_FUNCTION"] = 11] = "STYLE_VALUE_FUNCTION";
  CssLexerMode[CssLexerMode["STYLE_CALC_FUNCTION"] = 12] = "STYLE_CALC_FUNCTION";
})(exports.CssLexerMode || (exports.CssLexerMode = {}));
var CssLexerMode = exports.CssLexerMode;
var LexedCssResult = (function() {
  function LexedCssResult(error, token) {
    this.error = error;
    this.token = token;
  }
  return LexedCssResult;
})();
exports.LexedCssResult = LexedCssResult;
function generateErrorMessage(input, message, errorValue, index, row, column) {
  return (message + " at column " + row + ":" + column + " in expression [") + findProblemCode(input, errorValue, index, column) + ']';
}
exports.generateErrorMessage = generateErrorMessage;
function findProblemCode(input, errorValue, index, column) {
  var endOfProblemLine = index;
  var current = charCode(input, index);
  while (current > 0 && !isNewline(current)) {
    current = charCode(input, ++endOfProblemLine);
  }
  var choppedString = input.substring(0, endOfProblemLine);
  var pointerPadding = "";
  for (var i = 0; i < column; i++) {
    pointerPadding += " ";
  }
  var pointerString = "";
  for (var i = 0; i < errorValue.length; i++) {
    pointerString += "^";
  }
  return choppedString + "\n" + pointerPadding + pointerString + "\n";
}
exports.findProblemCode = findProblemCode;
var CssToken = (function() {
  function CssToken(index, column, line, type, strValue) {
    this.index = index;
    this.column = column;
    this.line = line;
    this.type = type;
    this.strValue = strValue;
    this.numValue = charCode(strValue, 0);
  }
  return CssToken;
})();
exports.CssToken = CssToken;
var CssLexer = (function() {
  function CssLexer() {}
  CssLexer.prototype.scan = function(text, trackComments) {
    if (trackComments === void 0) {
      trackComments = false;
    }
    return new CssScanner(text, trackComments);
  };
  return CssLexer;
})();
exports.CssLexer = CssLexer;
var CssScannerError = (function(_super) {
  __extends(CssScannerError, _super);
  function CssScannerError(token, message) {
    _super.call(this, 'Css Parse Error: ' + message);
    this.token = token;
    this.rawMessage = message;
  }
  CssScannerError.prototype.toString = function() {
    return this.message;
  };
  return CssScannerError;
})(exceptions_1.BaseException);
exports.CssScannerError = CssScannerError;
function _trackWhitespace(mode) {
  switch (mode) {
    case CssLexerMode.SELECTOR:
    case CssLexerMode.ALL_TRACK_WS:
    case CssLexerMode.STYLE_VALUE:
      return true;
    default:
      return false;
  }
}
var CssScanner = (function() {
  function CssScanner(input, _trackComments) {
    if (_trackComments === void 0) {
      _trackComments = false;
    }
    this.input = input;
    this._trackComments = _trackComments;
    this.length = 0;
    this.index = -1;
    this.column = -1;
    this.line = 0;
    this._currentMode = CssLexerMode.BLOCK;
    this._currentError = null;
    this.length = this.input.length;
    this.peekPeek = this.peekAt(0);
    this.advance();
  }
  CssScanner.prototype.getMode = function() {
    return this._currentMode;
  };
  CssScanner.prototype.setMode = function(mode) {
    if (this._currentMode != mode) {
      if (_trackWhitespace(this._currentMode)) {
        this.consumeWhitespace();
      }
      this._currentMode = mode;
    }
  };
  CssScanner.prototype.advance = function() {
    if (isNewline(this.peek)) {
      this.column = 0;
      this.line++;
    } else {
      this.column++;
    }
    this.index++;
    this.peek = this.peekPeek;
    this.peekPeek = this.peekAt(this.index + 1);
  };
  CssScanner.prototype.peekAt = function(index) {
    return index >= this.length ? chars_1.$EOF : lang_1.StringWrapper.charCodeAt(this.input, index);
  };
  CssScanner.prototype.consumeEmptyStatements = function() {
    this.consumeWhitespace();
    while (this.peek == chars_1.$SEMICOLON) {
      this.advance();
      this.consumeWhitespace();
    }
  };
  CssScanner.prototype.consumeWhitespace = function() {
    while (chars_1.isWhitespace(this.peek) || isNewline(this.peek)) {
      this.advance();
      if (!this._trackComments && isCommentStart(this.peek, this.peekPeek)) {
        this.advance();
        this.advance();
        while (!isCommentEnd(this.peek, this.peekPeek)) {
          if (this.peek == chars_1.$EOF) {
            this.error('Unterminated comment');
          }
          this.advance();
        }
        this.advance();
        this.advance();
      }
    }
  };
  CssScanner.prototype.consume = function(type, value) {
    if (value === void 0) {
      value = null;
    }
    var mode = this._currentMode;
    this.setMode(CssLexerMode.ALL);
    var previousIndex = this.index;
    var previousLine = this.line;
    var previousColumn = this.column;
    var output = this.scan();
    if (lang_1.isPresent(output.error)) {
      this.setMode(mode);
      return output;
    }
    var next = output.token;
    if (!lang_1.isPresent(next)) {
      next = new CssToken(0, 0, 0, CssTokenType.EOF, "end of file");
    }
    var isMatchingType;
    if (type == CssTokenType.IdentifierOrNumber) {
      isMatchingType = next.type == CssTokenType.Number || next.type == CssTokenType.Identifier;
    } else {
      isMatchingType = next.type == type;
    }
    this.setMode(mode);
    var error = null;
    if (!isMatchingType || (lang_1.isPresent(value) && value != next.strValue)) {
      var errorMessage = lang_1.resolveEnumToken(CssTokenType, next.type) + " does not match expected " + lang_1.resolveEnumToken(CssTokenType, type) + " value";
      if (lang_1.isPresent(value)) {
        errorMessage += ' ("' + next.strValue + '" should match "' + value + '")';
      }
      error = new CssScannerError(next, generateErrorMessage(this.input, errorMessage, next.strValue, previousIndex, previousLine, previousColumn));
    }
    return new LexedCssResult(error, next);
  };
  CssScanner.prototype.scan = function() {
    var trackWS = _trackWhitespace(this._currentMode);
    if (this.index == 0 && !trackWS) {
      this.consumeWhitespace();
    }
    var token = this._scan();
    if (token == null)
      return null;
    var error = this._currentError;
    this._currentError = null;
    if (!trackWS) {
      this.consumeWhitespace();
    }
    return new LexedCssResult(error, token);
  };
  CssScanner.prototype._scan = function() {
    var peek = this.peek;
    var peekPeek = this.peekPeek;
    if (peek == chars_1.$EOF)
      return null;
    if (isCommentStart(peek, peekPeek)) {
      var commentToken = this.scanComment();
      if (this._trackComments) {
        return commentToken;
      }
    }
    if (_trackWhitespace(this._currentMode) && (chars_1.isWhitespace(peek) || isNewline(peek))) {
      return this.scanWhitespace();
    }
    peek = this.peek;
    peekPeek = this.peekPeek;
    if (peek == chars_1.$EOF)
      return null;
    if (isStringStart(peek, peekPeek)) {
      return this.scanString();
    }
    if (this._currentMode == CssLexerMode.STYLE_VALUE_FUNCTION) {
      return this.scanCssValueFunction();
    }
    var isModifier = peek == chars_1.$PLUS || peek == chars_1.$MINUS;
    var digitA = isModifier ? false : isDigit(peek);
    var digitB = isDigit(peekPeek);
    if (digitA || (isModifier && (peekPeek == chars_1.$PERIOD || digitB)) || (peek == chars_1.$PERIOD && digitB)) {
      return this.scanNumber();
    }
    if (peek == chars_1.$AT) {
      return this.scanAtExpression();
    }
    if (isIdentifierStart(peek, peekPeek)) {
      return this.scanIdentifier();
    }
    if (isValidCssCharacter(peek, this._currentMode)) {
      return this.scanCharacter();
    }
    return this.error("Unexpected character [" + lang_1.StringWrapper.fromCharCode(peek) + "]");
  };
  CssScanner.prototype.scanComment = function() {
    if (this.assertCondition(isCommentStart(this.peek, this.peekPeek), "Expected comment start value")) {
      return null;
    }
    var start = this.index;
    var startingColumn = this.column;
    var startingLine = this.line;
    this.advance();
    this.advance();
    while (!isCommentEnd(this.peek, this.peekPeek)) {
      if (this.peek == chars_1.$EOF) {
        this.error('Unterminated comment');
      }
      this.advance();
    }
    this.advance();
    this.advance();
    var str = this.input.substring(start, this.index);
    return new CssToken(start, startingColumn, startingLine, CssTokenType.Comment, str);
  };
  CssScanner.prototype.scanWhitespace = function() {
    var start = this.index;
    var startingColumn = this.column;
    var startingLine = this.line;
    while (chars_1.isWhitespace(this.peek) && this.peek != chars_1.$EOF) {
      this.advance();
    }
    var str = this.input.substring(start, this.index);
    return new CssToken(start, startingColumn, startingLine, CssTokenType.Whitespace, str);
  };
  CssScanner.prototype.scanString = function() {
    if (this.assertCondition(isStringStart(this.peek, this.peekPeek), "Unexpected non-string starting value")) {
      return null;
    }
    var target = this.peek;
    var start = this.index;
    var startingColumn = this.column;
    var startingLine = this.line;
    var previous = target;
    this.advance();
    while (!isCharMatch(target, previous, this.peek)) {
      if (this.peek == chars_1.$EOF || isNewline(this.peek)) {
        this.error('Unterminated quote');
      }
      previous = this.peek;
      this.advance();
    }
    if (this.assertCondition(this.peek == target, "Unterminated quote")) {
      return null;
    }
    this.advance();
    var str = this.input.substring(start, this.index);
    return new CssToken(start, startingColumn, startingLine, CssTokenType.String, str);
  };
  CssScanner.prototype.scanNumber = function() {
    var start = this.index;
    var startingColumn = this.column;
    if (this.peek == chars_1.$PLUS || this.peek == chars_1.$MINUS) {
      this.advance();
    }
    var periodUsed = false;
    while (isDigit(this.peek) || this.peek == chars_1.$PERIOD) {
      if (this.peek == chars_1.$PERIOD) {
        if (periodUsed) {
          this.error('Unexpected use of a second period value');
        }
        periodUsed = true;
      }
      this.advance();
    }
    var strValue = this.input.substring(start, this.index);
    return new CssToken(start, startingColumn, this.line, CssTokenType.Number, strValue);
  };
  CssScanner.prototype.scanIdentifier = function() {
    if (this.assertCondition(isIdentifierStart(this.peek, this.peekPeek), 'Expected identifier starting value')) {
      return null;
    }
    var start = this.index;
    var startingColumn = this.column;
    while (isIdentifierPart(this.peek)) {
      this.advance();
    }
    var strValue = this.input.substring(start, this.index);
    return new CssToken(start, startingColumn, this.line, CssTokenType.Identifier, strValue);
  };
  CssScanner.prototype.scanCssValueFunction = function() {
    var start = this.index;
    var startingColumn = this.column;
    while (this.peek != chars_1.$EOF && this.peek != chars_1.$RPAREN) {
      this.advance();
    }
    var strValue = this.input.substring(start, this.index);
    return new CssToken(start, startingColumn, this.line, CssTokenType.Identifier, strValue);
  };
  CssScanner.prototype.scanCharacter = function() {
    var start = this.index;
    var startingColumn = this.column;
    if (this.assertCondition(isValidCssCharacter(this.peek, this._currentMode), charStr(this.peek) + ' is not a valid CSS character')) {
      return null;
    }
    var c = this.input.substring(start, start + 1);
    this.advance();
    return new CssToken(start, startingColumn, this.line, CssTokenType.Character, c);
  };
  CssScanner.prototype.scanAtExpression = function() {
    if (this.assertCondition(this.peek == chars_1.$AT, 'Expected @ value')) {
      return null;
    }
    var start = this.index;
    var startingColumn = this.column;
    this.advance();
    if (isIdentifierStart(this.peek, this.peekPeek)) {
      var ident = this.scanIdentifier();
      var strValue = '@' + ident.strValue;
      return new CssToken(start, startingColumn, this.line, CssTokenType.AtKeyword, strValue);
    } else {
      return this.scanCharacter();
    }
  };
  CssScanner.prototype.assertCondition = function(status, errorMessage) {
    if (!status) {
      this.error(errorMessage);
      return true;
    }
    return false;
  };
  CssScanner.prototype.error = function(message, errorTokenValue, doNotAdvance) {
    if (errorTokenValue === void 0) {
      errorTokenValue = null;
    }
    if (doNotAdvance === void 0) {
      doNotAdvance = false;
    }
    var index = this.index;
    var column = this.column;
    var line = this.line;
    errorTokenValue = lang_1.isPresent(errorTokenValue) ? errorTokenValue : lang_1.StringWrapper.fromCharCode(this.peek);
    var invalidToken = new CssToken(index, column, line, CssTokenType.Invalid, errorTokenValue);
    var errorMessage = generateErrorMessage(this.input, message, errorTokenValue, index, line, column);
    if (!doNotAdvance) {
      this.advance();
    }
    this._currentError = new CssScannerError(invalidToken, errorMessage);
    return invalidToken;
  };
  return CssScanner;
})();
exports.CssScanner = CssScanner;
function isAtKeyword(current, next) {
  return current.numValue == chars_1.$AT && next.type == CssTokenType.Identifier;
}
function isCharMatch(target, previous, code) {
  return code == target && previous != chars_1.$BACKSLASH;
}
function isDigit(code) {
  return chars_1.$0 <= code && code <= chars_1.$9;
}
function isCommentStart(code, next) {
  return code == chars_1.$SLASH && next == chars_1.$STAR;
}
function isCommentEnd(code, next) {
  return code == chars_1.$STAR && next == chars_1.$SLASH;
}
function isStringStart(code, next) {
  var target = code;
  if (target == chars_1.$BACKSLASH) {
    target = next;
  }
  return target == chars_1.$DQ || target == chars_1.$SQ;
}
function isIdentifierStart(code, next) {
  var target = code;
  if (target == chars_1.$MINUS) {
    target = next;
  }
  return (chars_1.$a <= target && target <= chars_1.$z) || (chars_1.$A <= target && target <= chars_1.$Z) || target == chars_1.$BACKSLASH || target == chars_1.$MINUS || target == chars_1.$_;
}
function isIdentifierPart(target) {
  return (chars_1.$a <= target && target <= chars_1.$z) || (chars_1.$A <= target && target <= chars_1.$Z) || target == chars_1.$BACKSLASH || target == chars_1.$MINUS || target == chars_1.$_ || isDigit(target);
}
function isValidPseudoSelectorCharacter(code) {
  switch (code) {
    case chars_1.$LPAREN:
    case chars_1.$RPAREN:
      return true;
    default:
      return false;
  }
}
function isValidKeyframeBlockCharacter(code) {
  return code == chars_1.$PERCENT;
}
function isValidAttributeSelectorCharacter(code) {
  switch (code) {
    case chars_1.$$:
    case chars_1.$PIPE:
    case chars_1.$CARET:
    case chars_1.$TILDA:
    case chars_1.$STAR:
    case chars_1.$EQ:
      return true;
    default:
      return false;
  }
}
function isValidSelectorCharacter(code) {
  switch (code) {
    case chars_1.$HASH:
    case chars_1.$PERIOD:
    case chars_1.$TILDA:
    case chars_1.$STAR:
    case chars_1.$PLUS:
    case chars_1.$GT:
    case chars_1.$COLON:
    case chars_1.$PIPE:
    case chars_1.$COMMA:
      return true;
    default:
      return false;
  }
}
function isValidStyleBlockCharacter(code) {
  switch (code) {
    case chars_1.$HASH:
    case chars_1.$SEMICOLON:
    case chars_1.$COLON:
    case chars_1.$PERCENT:
    case chars_1.$SLASH:
    case chars_1.$BACKSLASH:
    case chars_1.$BANG:
    case chars_1.$PERIOD:
    case chars_1.$LPAREN:
    case chars_1.$RPAREN:
      return true;
    default:
      return false;
  }
}
function isValidMediaQueryRuleCharacter(code) {
  switch (code) {
    case chars_1.$LPAREN:
    case chars_1.$RPAREN:
    case chars_1.$COLON:
    case chars_1.$PERCENT:
    case chars_1.$PERIOD:
      return true;
    default:
      return false;
  }
}
function isValidAtRuleCharacter(code) {
  switch (code) {
    case chars_1.$LPAREN:
    case chars_1.$RPAREN:
    case chars_1.$COLON:
    case chars_1.$PERCENT:
    case chars_1.$PERIOD:
    case chars_1.$SLASH:
    case chars_1.$BACKSLASH:
    case chars_1.$HASH:
    case chars_1.$EQ:
    case chars_1.$QUESTION:
    case chars_1.$AMPERSAND:
    case chars_1.$STAR:
    case chars_1.$COMMA:
    case chars_1.$MINUS:
    case chars_1.$PLUS:
      return true;
    default:
      return false;
  }
}
function isValidStyleFunctionCharacter(code) {
  switch (code) {
    case chars_1.$PERIOD:
    case chars_1.$MINUS:
    case chars_1.$PLUS:
    case chars_1.$STAR:
    case chars_1.$SLASH:
    case chars_1.$LPAREN:
    case chars_1.$RPAREN:
    case chars_1.$COMMA:
      return true;
    default:
      return false;
  }
}
function isValidBlockCharacter(code) {
  return code == chars_1.$AT;
}
function isValidCssCharacter(code, mode) {
  switch (mode) {
    case CssLexerMode.ALL:
    case CssLexerMode.ALL_TRACK_WS:
      return true;
    case CssLexerMode.SELECTOR:
      return isValidSelectorCharacter(code);
    case CssLexerMode.PSEUDO_SELECTOR:
      return isValidPseudoSelectorCharacter(code);
    case CssLexerMode.ATTRIBUTE_SELECTOR:
      return isValidAttributeSelectorCharacter(code);
    case CssLexerMode.MEDIA_QUERY:
      return isValidMediaQueryRuleCharacter(code);
    case CssLexerMode.AT_RULE_QUERY:
      return isValidAtRuleCharacter(code);
    case CssLexerMode.KEYFRAME_BLOCK:
      return isValidKeyframeBlockCharacter(code);
    case CssLexerMode.STYLE_BLOCK:
    case CssLexerMode.STYLE_VALUE:
      return isValidStyleBlockCharacter(code);
    case CssLexerMode.STYLE_CALC_FUNCTION:
      return isValidStyleFunctionCharacter(code);
    case CssLexerMode.BLOCK:
      return isValidBlockCharacter(code);
    default:
      return false;
  }
}
function charCode(input, index) {
  return index >= input.length ? chars_1.$EOF : lang_1.StringWrapper.charCodeAt(input, index);
}
function charStr(code) {
  return lang_1.StringWrapper.fromCharCode(code);
}
function isNewline(code) {
  switch (code) {
    case chars_1.$FF:
    case chars_1.$CR:
    case chars_1.$LF:
    case chars_1.$VTAB:
      return true;
    default:
      return false;
  }
}
exports.isNewline = isNewline;
