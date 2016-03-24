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
var lang_1 = require('../facade/lang');
var collection_1 = require('../facade/collection');
var template_ast_1 = require('./template_ast');
var source_module_1 = require('./source_module');
var view_1 = require('../core/linker/view');
var view_type_1 = require('../core/linker/view_type');
var element_1 = require('../core/linker/element');
var util_1 = require('./util');
var di_1 = require('../core/di');
exports.PROTO_VIEW_JIT_IMPORTS = lang_1.CONST_EXPR({
  'AppProtoView': view_1.AppProtoView,
  'AppProtoElement': element_1.AppProtoElement,
  'ViewType': view_type_1.ViewType
});
exports.APP_VIEW_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/view' + util_1.MODULE_SUFFIX);
exports.VIEW_TYPE_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/view_type' + util_1.MODULE_SUFFIX);
exports.APP_EL_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/element' + util_1.MODULE_SUFFIX);
exports.METADATA_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/metadata/view' + util_1.MODULE_SUFFIX);
var IMPLICIT_TEMPLATE_VAR = '\$implicit';
var CLASS_ATTR = 'class';
var STYLE_ATTR = 'style';
var ProtoViewCompiler = (function() {
  function ProtoViewCompiler() {}
  ProtoViewCompiler.prototype.compileProtoViewRuntime = function(metadataCache, component, template, pipes) {
    var protoViewFactory = new RuntimeProtoViewFactory(metadataCache, component, pipes);
    var allProtoViews = [];
    protoViewFactory.createCompileProtoView(template, [], [], allProtoViews);
    return new CompileProtoViews([], allProtoViews);
  };
  ProtoViewCompiler.prototype.compileProtoViewCodeGen = function(resolvedMetadataCacheExpr, component, template, pipes) {
    var protoViewFactory = new CodeGenProtoViewFactory(resolvedMetadataCacheExpr, component, pipes);
    var allProtoViews = [];
    var allStatements = [];
    protoViewFactory.createCompileProtoView(template, [], allStatements, allProtoViews);
    return new CompileProtoViews(allStatements.map(function(stmt) {
      return stmt.statement;
    }), allProtoViews);
  };
  ProtoViewCompiler = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], ProtoViewCompiler);
  return ProtoViewCompiler;
})();
exports.ProtoViewCompiler = ProtoViewCompiler;
var CompileProtoViews = (function() {
  function CompileProtoViews(declarations, protoViews) {
    this.declarations = declarations;
    this.protoViews = protoViews;
  }
  return CompileProtoViews;
})();
exports.CompileProtoViews = CompileProtoViews;
var CompileProtoView = (function() {
  function CompileProtoView(embeddedTemplateIndex, protoElements, protoView) {
    this.embeddedTemplateIndex = embeddedTemplateIndex;
    this.protoElements = protoElements;
    this.protoView = protoView;
  }
  return CompileProtoView;
})();
exports.CompileProtoView = CompileProtoView;
var CompileProtoElement = (function() {
  function CompileProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex, appProtoEl) {
    this.boundElementIndex = boundElementIndex;
    this.attrNameAndValues = attrNameAndValues;
    this.variableNameAndValues = variableNameAndValues;
    this.renderEvents = renderEvents;
    this.directives = directives;
    this.embeddedTemplateIndex = embeddedTemplateIndex;
    this.appProtoEl = appProtoEl;
  }
  return CompileProtoElement;
})();
exports.CompileProtoElement = CompileProtoElement;
function visitAndReturnContext(visitor, asts, context) {
  template_ast_1.templateVisitAll(visitor, asts, context);
  return context;
}
var ProtoViewFactory = (function() {
  function ProtoViewFactory(component) {
    this.component = component;
  }
  ProtoViewFactory.prototype.createCompileProtoView = function(template, templateVariableBindings, targetStatements, targetProtoViews) {
    var embeddedTemplateIndex = targetProtoViews.length;
    targetProtoViews.push(null);
    var builder = new ProtoViewBuilderVisitor(this, targetStatements, targetProtoViews);
    template_ast_1.templateVisitAll(builder, template);
    var viewType = getViewType(this.component, embeddedTemplateIndex);
    var appProtoView = this.createAppProtoView(embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements);
    var cpv = new CompileProtoView(embeddedTemplateIndex, builder.protoElements, appProtoView);
    targetProtoViews[embeddedTemplateIndex] = cpv;
    return cpv;
  };
  return ProtoViewFactory;
})();
var CodeGenProtoViewFactory = (function(_super) {
  __extends(CodeGenProtoViewFactory, _super);
  function CodeGenProtoViewFactory(resolvedMetadataCacheExpr, component, pipes) {
    _super.call(this, component);
    this.resolvedMetadataCacheExpr = resolvedMetadataCacheExpr;
    this.pipes = pipes;
    this._nextVarId = 0;
  }
  CodeGenProtoViewFactory.prototype._nextProtoViewVar = function(embeddedTemplateIndex) {
    return "appProtoView" + this._nextVarId++ + "_" + this.component.type.name + embeddedTemplateIndex;
  };
  CodeGenProtoViewFactory.prototype.createAppProtoView = function(embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements) {
    var protoViewVarName = this._nextProtoViewVar(embeddedTemplateIndex);
    var viewTypeExpr = codeGenViewType(viewType);
    var pipesExpr = embeddedTemplateIndex === 0 ? codeGenTypesArray(this.pipes.map(function(pipeMeta) {
      return pipeMeta.type;
    })) : null;
    var statement = "var " + protoViewVarName + " = " + exports.APP_VIEW_MODULE_REF + "AppProtoView.create(" + this.resolvedMetadataCacheExpr.expression + ", " + viewTypeExpr + ", " + pipesExpr + ", " + util_1.codeGenStringMap(templateVariableBindings) + ");";
    targetStatements.push(new util_1.Statement(statement));
    return new util_1.Expression(protoViewVarName);
  };
  CodeGenProtoViewFactory.prototype.createAppProtoElement = function(boundElementIndex, attrNameAndValues, variableNameAndValues, directives, targetStatements) {
    var varName = "appProtoEl" + this._nextVarId++ + "_" + this.component.type.name;
    var value = exports.APP_EL_MODULE_REF + "AppProtoElement.create(\n        " + this.resolvedMetadataCacheExpr.expression + ",\n        " + boundElementIndex + ",\n        " + util_1.codeGenStringMap(attrNameAndValues) + ",\n        " + codeGenDirectivesArray(directives) + ",\n        " + util_1.codeGenStringMap(variableNameAndValues) + "\n      )";
    var statement = "var " + varName + " = " + value + ";";
    targetStatements.push(new util_1.Statement(statement));
    return new util_1.Expression(varName);
  };
  return CodeGenProtoViewFactory;
})(ProtoViewFactory);
var RuntimeProtoViewFactory = (function(_super) {
  __extends(RuntimeProtoViewFactory, _super);
  function RuntimeProtoViewFactory(metadataCache, component, pipes) {
    _super.call(this, component);
    this.metadataCache = metadataCache;
    this.pipes = pipes;
  }
  RuntimeProtoViewFactory.prototype.createAppProtoView = function(embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements) {
    var pipes = embeddedTemplateIndex === 0 ? this.pipes.map(function(pipeMeta) {
      return pipeMeta.type.runtime;
    }) : [];
    var templateVars = keyValueArrayToStringMap(templateVariableBindings);
    return view_1.AppProtoView.create(this.metadataCache, viewType, pipes, templateVars);
  };
  RuntimeProtoViewFactory.prototype.createAppProtoElement = function(boundElementIndex, attrNameAndValues, variableNameAndValues, directives, targetStatements) {
    var attrs = keyValueArrayToStringMap(attrNameAndValues);
    return element_1.AppProtoElement.create(this.metadataCache, boundElementIndex, attrs, directives.map(function(dirMeta) {
      return dirMeta.type.runtime;
    }), keyValueArrayToStringMap(variableNameAndValues));
  };
  return RuntimeProtoViewFactory;
})(ProtoViewFactory);
var ProtoViewBuilderVisitor = (function() {
  function ProtoViewBuilderVisitor(factory, allStatements, allProtoViews) {
    this.factory = factory;
    this.allStatements = allStatements;
    this.allProtoViews = allProtoViews;
    this.protoElements = [];
    this.boundElementCount = 0;
  }
  ProtoViewBuilderVisitor.prototype._readAttrNameAndValues = function(directives, attrAsts) {
    var attrs = visitAndReturnContext(this, attrAsts, {});
    directives.forEach(function(directiveMeta) {
      collection_1.StringMapWrapper.forEach(directiveMeta.hostAttributes, function(value, name) {
        var prevValue = attrs[name];
        attrs[name] = lang_1.isPresent(prevValue) ? mergeAttributeValue(name, prevValue, value) : value;
      });
    });
    return mapToKeyValueArray(attrs);
  };
  ProtoViewBuilderVisitor.prototype.visitBoundText = function(ast, context) {
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitText = function(ast, context) {
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitNgContent = function(ast, context) {
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitElement = function(ast, context) {
    var _this = this;
    var boundElementIndex = null;
    if (ast.isBound()) {
      boundElementIndex = this.boundElementCount++;
    }
    var component = ast.getComponent();
    var variableNameAndValues = [];
    if (lang_1.isBlank(component)) {
      ast.exportAsVars.forEach(function(varAst) {
        variableNameAndValues.push([varAst.name, null]);
      });
    }
    var directives = [];
    var renderEvents = visitAndReturnContext(this, ast.outputs, new Map());
    collection_1.ListWrapper.forEachWithIndex(ast.directives, function(directiveAst, index) {
      directiveAst.visit(_this, new DirectiveContext(index, boundElementIndex, renderEvents, variableNameAndValues, directives));
    });
    var renderEventArray = [];
    renderEvents.forEach(function(eventAst, _) {
      return renderEventArray.push(eventAst);
    });
    var attrNameAndValues = this._readAttrNameAndValues(directives, ast.attrs);
    this._addProtoElement(ast.isBound(), boundElementIndex, attrNameAndValues, variableNameAndValues, renderEventArray, directives, null);
    template_ast_1.templateVisitAll(this, ast.children);
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitEmbeddedTemplate = function(ast, context) {
    var _this = this;
    var boundElementIndex = this.boundElementCount++;
    var directives = [];
    collection_1.ListWrapper.forEachWithIndex(ast.directives, function(directiveAst, index) {
      directiveAst.visit(_this, new DirectiveContext(index, boundElementIndex, new Map(), [], directives));
    });
    var attrNameAndValues = this._readAttrNameAndValues(directives, ast.attrs);
    var templateVariableBindings = ast.vars.map(function(varAst) {
      return [varAst.value.length > 0 ? varAst.value : IMPLICIT_TEMPLATE_VAR, varAst.name];
    });
    var nestedProtoView = this.factory.createCompileProtoView(ast.children, templateVariableBindings, this.allStatements, this.allProtoViews);
    this._addProtoElement(true, boundElementIndex, attrNameAndValues, [], [], directives, nestedProtoView.embeddedTemplateIndex);
    return null;
  };
  ProtoViewBuilderVisitor.prototype._addProtoElement = function(isBound, boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex) {
    var appProtoEl = null;
    if (isBound) {
      appProtoEl = this.factory.createAppProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, directives, this.allStatements);
    }
    var compileProtoEl = new CompileProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex, appProtoEl);
    this.protoElements.push(compileProtoEl);
  };
  ProtoViewBuilderVisitor.prototype.visitVariable = function(ast, ctx) {
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitAttr = function(ast, attrNameAndValues) {
    attrNameAndValues[ast.name] = ast.value;
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitDirective = function(ast, ctx) {
    ctx.targetDirectives.push(ast.directive);
    template_ast_1.templateVisitAll(this, ast.hostEvents, ctx.hostEventTargetAndNames);
    ast.exportAsVars.forEach(function(varAst) {
      ctx.targetVariableNameAndValues.push([varAst.name, ctx.index]);
    });
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitEvent = function(ast, eventTargetAndNames) {
    eventTargetAndNames.set(ast.fullName, ast);
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitDirectiveProperty = function(ast, context) {
    return null;
  };
  ProtoViewBuilderVisitor.prototype.visitElementProperty = function(ast, context) {
    return null;
  };
  return ProtoViewBuilderVisitor;
})();
function mapToKeyValueArray(data) {
  var entryArray = [];
  collection_1.StringMapWrapper.forEach(data, function(value, name) {
    entryArray.push([name, value]);
  });
  collection_1.ListWrapper.sort(entryArray, function(entry1, entry2) {
    return lang_1.StringWrapper.compare(entry1[0], entry2[0]);
  });
  var keyValueArray = [];
  entryArray.forEach(function(entry) {
    keyValueArray.push([entry[0], entry[1]]);
  });
  return keyValueArray;
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
  if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
    return attrValue1 + " " + attrValue2;
  } else {
    return attrValue2;
  }
}
var DirectiveContext = (function() {
  function DirectiveContext(index, boundElementIndex, hostEventTargetAndNames, targetVariableNameAndValues, targetDirectives) {
    this.index = index;
    this.boundElementIndex = boundElementIndex;
    this.hostEventTargetAndNames = hostEventTargetAndNames;
    this.targetVariableNameAndValues = targetVariableNameAndValues;
    this.targetDirectives = targetDirectives;
  }
  return DirectiveContext;
})();
function keyValueArrayToStringMap(keyValueArray) {
  var stringMap = {};
  for (var i = 0; i < keyValueArray.length; i++) {
    var entry = keyValueArray[i];
    stringMap[entry[0]] = entry[1];
  }
  return stringMap;
}
function codeGenDirectivesArray(directives) {
  var expressions = directives.map(function(directiveType) {
    return typeRef(directiveType.type);
  });
  return "[" + expressions.join(',') + "]";
}
function codeGenTypesArray(types) {
  var expressions = types.map(typeRef);
  return "[" + expressions.join(',') + "]";
}
function codeGenViewType(value) {
  if (lang_1.IS_DART) {
    return "" + exports.VIEW_TYPE_MODULE_REF + value;
  } else {
    return "" + value;
  }
}
function typeRef(type) {
  return "" + source_module_1.moduleRef(type.moduleUrl) + type.name;
}
function getViewType(component, embeddedTemplateIndex) {
  if (embeddedTemplateIndex > 0) {
    return view_type_1.ViewType.EMBEDDED;
  } else if (component.type.isHost) {
    return view_type_1.ViewType.HOST;
  } else {
    return view_type_1.ViewType.COMPONENT;
  }
}
