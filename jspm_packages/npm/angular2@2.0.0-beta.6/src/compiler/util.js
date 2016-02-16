/* */ 
'use strict';
var lang_1 = require('../facade/lang');
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
var SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
var DOUBLE_QUOTE_ESCAPE_STRING_RE = /"|\\|\n|\r|\$/g;
exports.MODULE_SUFFIX = lang_1.IS_DART ? '.dart' : '.js';
exports.CONST_VAR = lang_1.IS_DART ? 'const' : 'var';
function camelCaseToDashCase(input) {
  return lang_1.StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, function(m) {
    return '-' + m[1].toLowerCase();
  });
}
exports.camelCaseToDashCase = camelCaseToDashCase;
function dashCaseToCamelCase(input) {
  return lang_1.StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, function(m) {
    return m[1].toUpperCase();
  });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
function escapeSingleQuoteString(input) {
  if (lang_1.isBlank(input)) {
    return null;
  }
  return "'" + escapeString(input, SINGLE_QUOTE_ESCAPE_STRING_RE) + "'";
}
exports.escapeSingleQuoteString = escapeSingleQuoteString;
function escapeDoubleQuoteString(input) {
  if (lang_1.isBlank(input)) {
    return null;
  }
  return "\"" + escapeString(input, DOUBLE_QUOTE_ESCAPE_STRING_RE) + "\"";
}
exports.escapeDoubleQuoteString = escapeDoubleQuoteString;
function escapeString(input, re) {
  return lang_1.StringWrapper.replaceAllMapped(input, re, function(match) {
    if (match[0] == '$') {
      return lang_1.IS_DART ? '\\$' : '$';
    } else if (match[0] == '\n') {
      return '\\n';
    } else if (match[0] == '\r') {
      return '\\r';
    } else {
      return "\\" + match[0];
    }
  });
}
function codeGenExportVariable(name) {
  if (lang_1.IS_DART) {
    return "const " + name + " = ";
  } else {
    return "var " + name + " = exports['" + name + "'] = ";
  }
}
exports.codeGenExportVariable = codeGenExportVariable;
function codeGenConstConstructorCall(name) {
  if (lang_1.IS_DART) {
    return "const " + name;
  } else {
    return "new " + name;
  }
}
exports.codeGenConstConstructorCall = codeGenConstConstructorCall;
function codeGenValueFn(params, value, fnName) {
  if (fnName === void 0) {
    fnName = '';
  }
  if (lang_1.IS_DART) {
    return codeGenFnHeader(params, fnName) + " => " + value;
  } else {
    return codeGenFnHeader(params, fnName) + " { return " + value + "; }";
  }
}
exports.codeGenValueFn = codeGenValueFn;
function codeGenFnHeader(params, fnName) {
  if (fnName === void 0) {
    fnName = '';
  }
  if (lang_1.IS_DART) {
    return fnName + "(" + params.join(',') + ")";
  } else {
    return "function " + fnName + "(" + params.join(',') + ")";
  }
}
exports.codeGenFnHeader = codeGenFnHeader;
function codeGenToString(expr) {
  if (lang_1.IS_DART) {
    return "'${" + expr + "}'";
  } else {
    return expr;
  }
}
exports.codeGenToString = codeGenToString;
function splitAtColon(input, defaultValues) {
  var parts = lang_1.StringWrapper.split(input.trim(), /\s*:\s*/g);
  if (parts.length > 1) {
    return parts;
  } else {
    return defaultValues;
  }
}
exports.splitAtColon = splitAtColon;
var Statement = (function() {
  function Statement(statement) {
    this.statement = statement;
  }
  return Statement;
})();
exports.Statement = Statement;
var Expression = (function() {
  function Expression(expression, isArray) {
    if (isArray === void 0) {
      isArray = false;
    }
    this.expression = expression;
    this.isArray = isArray;
  }
  return Expression;
})();
exports.Expression = Expression;
function escapeValue(value) {
  if (value instanceof Expression) {
    return value.expression;
  } else if (lang_1.isString(value)) {
    return escapeSingleQuoteString(value);
  } else if (lang_1.isBlank(value)) {
    return 'null';
  } else {
    return "" + value;
  }
}
exports.escapeValue = escapeValue;
function codeGenArray(data) {
  return "[" + data.map(escapeValue).join(',') + "]";
}
exports.codeGenArray = codeGenArray;
function codeGenFlatArray(values) {
  var result = '([';
  var isFirstArrayEntry = true;
  var concatFn = lang_1.IS_DART ? '.addAll' : 'concat';
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    if (value instanceof Expression && value.isArray) {
      result += "])." + concatFn + "(" + value.expression + ")." + concatFn + "([";
      isFirstArrayEntry = true;
    } else {
      if (!isFirstArrayEntry) {
        result += ',';
      }
      isFirstArrayEntry = false;
      result += escapeValue(value);
    }
  }
  result += '])';
  return result;
}
exports.codeGenFlatArray = codeGenFlatArray;
function codeGenStringMap(keyValueArray) {
  return "{" + keyValueArray.map(codeGenKeyValue).join(',') + "}";
}
exports.codeGenStringMap = codeGenStringMap;
function codeGenKeyValue(keyValue) {
  return escapeValue(keyValue[0]) + ":" + escapeValue(keyValue[1]);
}
function addAll(source, target) {
  for (var i = 0; i < source.length; i++) {
    target.push(source[i]);
  }
}
exports.addAll = addAll;
function flattenArray(source, target) {
  if (lang_1.isPresent(source)) {
    for (var i = 0; i < source.length; i++) {
      var item = source[i];
      if (lang_1.isArray(item)) {
        flattenArray(item, target);
      } else {
        target.push(item);
      }
    }
  }
  return target;
}
exports.flattenArray = flattenArray;
