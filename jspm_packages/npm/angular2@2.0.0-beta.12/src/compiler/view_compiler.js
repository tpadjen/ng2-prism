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
var lang_1 = require('../facade/lang');
var collection_1 = require('../facade/collection');
var template_ast_1 = require('./template_ast');
var source_module_1 = require('./source_module');
var view_1 = require('../core/linker/view');
var view_type_1 = require('../core/linker/view_type');
var element_1 = require('../core/linker/element');
var view_2 = require('../core/metadata/view');
var util_1 = require('./util');
var di_1 = require('../core/di');
var proto_view_compiler_1 = require('./proto_view_compiler');
exports.VIEW_JIT_IMPORTS = lang_1.CONST_EXPR({
  'AppView': view_1.AppView,
  'AppElement': element_1.AppElement,
  'flattenNestedViewRenderNodes': view_1.flattenNestedViewRenderNodes,
  'checkSlotCount': view_1.checkSlotCount
});
var ViewCompiler = (function() {
  function ViewCompiler() {}
  ViewCompiler.prototype.compileComponentRuntime = function(component, template, styles, protoViews, changeDetectorFactories, componentViewFactory) {
    var viewFactory = new RuntimeViewFactory(component, styles, protoViews, changeDetectorFactories, componentViewFactory);
    return viewFactory.createViewFactory(template, 0, []);
  };
  ViewCompiler.prototype.compileComponentCodeGen = function(component, template, styles, protoViews, changeDetectorFactoryExpressions, componentViewFactory) {
    var viewFactory = new CodeGenViewFactory(component, styles, protoViews, changeDetectorFactoryExpressions, componentViewFactory);
    var targetStatements = [];
    var viewFactoryExpression = viewFactory.createViewFactory(template, 0, targetStatements);
    return new source_module_1.SourceExpression(targetStatements.map(function(stmt) {
      return stmt.statement;
    }), viewFactoryExpression.expression);
  };
  ViewCompiler = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], ViewCompiler);
  return ViewCompiler;
})();
exports.ViewCompiler = ViewCompiler;
var CodeGenViewFactory = (function() {
  function CodeGenViewFactory(component, styles, protoViews, changeDetectorExpressions, componentViewFactory) {
    this.component = component;
    this.styles = styles;
    this.protoViews = protoViews;
    this.changeDetectorExpressions = changeDetectorExpressions;
    this.componentViewFactory = componentViewFactory;
    this._nextVarId = 0;
  }
  CodeGenViewFactory.prototype._nextVar = function(prefix) {
    return "" + prefix + this._nextVarId++ + "_" + this.component.type.name;
  };
  CodeGenViewFactory.prototype._nextRenderVar = function() {
    return this._nextVar('render');
  };
  CodeGenViewFactory.prototype._nextAppVar = function() {
    return this._nextVar('app');
  };
  CodeGenViewFactory.prototype._nextDisposableVar = function() {
    return "disposable" + this._nextVarId++ + "_" + this.component.type.name;
  };
  CodeGenViewFactory.prototype.createText = function(renderer, parent, text, targetStatements) {
    var varName = this._nextRenderVar();
    var statement = "var " + varName + " = " + renderer.expression + ".createText(" + (lang_1.isPresent(parent) ? parent.expression : null) + ", " + util_1.escapeSingleQuoteString(text) + ");";
    targetStatements.push(new util_1.Statement(statement));
    return new util_1.Expression(varName);
  };
  CodeGenViewFactory.prototype.createElement = function(renderer, parentRenderNode, name, rootSelector, targetStatements) {
    var varName = this._nextRenderVar();
    var valueExpr;
    if (lang_1.isPresent(rootSelector)) {
      valueExpr = rootSelector.expression + " == null ?\n        " + renderer.expression + ".createElement(" + (lang_1.isPresent(parentRenderNode) ? parentRenderNode.expression : null) + ", " + util_1.escapeSingleQuoteString(name) + ") :\n        " + renderer.expression + ".selectRootElement(" + rootSelector.expression + ");";
    } else {
      valueExpr = renderer.expression + ".createElement(" + (lang_1.isPresent(parentRenderNode) ? parentRenderNode.expression : null) + ", " + util_1.escapeSingleQuoteString(name) + ")";
    }
    var statement = "var " + varName + " = " + valueExpr + ";";
    targetStatements.push(new util_1.Statement(statement));
    return new util_1.Expression(varName);
  };
  CodeGenViewFactory.prototype.createTemplateAnchor = function(renderer, parentRenderNode, targetStatements) {
    var varName = this._nextRenderVar();
    var valueExpr = renderer.expression + ".createTemplateAnchor(" + (lang_1.isPresent(parentRenderNode) ? parentRenderNode.expression : null) + ");";
    targetStatements.push(new util_1.Statement("var " + varName + " = " + valueExpr));
    return new util_1.Expression(varName);
  };
  CodeGenViewFactory.prototype.createGlobalEventListener = function(renderer, appView, boundElementIndex, eventAst, targetStatements) {
    var disposableVar = this._nextDisposableVar();
    var eventHandlerExpr = codeGenEventHandler(appView, boundElementIndex, eventAst.fullName);
    targetStatements.push(new util_1.Statement("var " + disposableVar + " = " + renderer.expression + ".listenGlobal(" + util_1.escapeValue(eventAst.target) + ", " + util_1.escapeValue(eventAst.name) + ", " + eventHandlerExpr + ");"));
    return new util_1.Expression(disposableVar);
  };
  CodeGenViewFactory.prototype.createElementEventListener = function(renderer, appView, boundElementIndex, renderNode, eventAst, targetStatements) {
    var disposableVar = this._nextDisposableVar();
    var eventHandlerExpr = codeGenEventHandler(appView, boundElementIndex, eventAst.fullName);
    targetStatements.push(new util_1.Statement("var " + disposableVar + " = " + renderer.expression + ".listen(" + renderNode.expression + ", " + util_1.escapeValue(eventAst.name) + ", " + eventHandlerExpr + ");"));
    return new util_1.Expression(disposableVar);
  };
  CodeGenViewFactory.prototype.setElementAttribute = function(renderer, renderNode, attrName, attrValue, targetStatements) {
    targetStatements.push(new util_1.Statement(renderer.expression + ".setElementAttribute(" + renderNode.expression + ", " + util_1.escapeSingleQuoteString(attrName) + ", " + util_1.escapeSingleQuoteString(attrValue) + ");"));
  };
  CodeGenViewFactory.prototype.createAppElement = function(appProtoEl, appView, renderNode, parentAppEl, embeddedViewFactory, targetStatements) {
    var appVar = this._nextAppVar();
    var varValue = "new " + proto_view_compiler_1.APP_EL_MODULE_REF + "AppElement(" + appProtoEl.expression + ", " + appView.expression + ",\n      " + (lang_1.isPresent(parentAppEl) ? parentAppEl.expression : null) + ", " + renderNode.expression + ", " + (lang_1.isPresent(embeddedViewFactory) ? embeddedViewFactory.expression : null) + ")";
    targetStatements.push(new util_1.Statement("var " + appVar + " = " + varValue + ";"));
    return new util_1.Expression(appVar);
  };
  CodeGenViewFactory.prototype.createAndSetComponentView = function(renderer, viewManager, view, appEl, component, contentNodesByNgContentIndex, targetStatements) {
    var codeGenContentNodes;
    if (this.component.type.isHost) {
      codeGenContentNodes = view.expression + ".projectableNodes";
    } else {
      codeGenContentNodes = "[" + contentNodesByNgContentIndex.map(function(nodes) {
        return util_1.codeGenFlatArray(nodes);
      }).join(',') + "]";
    }
    targetStatements.push(new util_1.Statement(this.componentViewFactory(component) + "(" + renderer.expression + ", " + viewManager.expression + ", " + appEl.expression + ", " + codeGenContentNodes + ", null, null, null);"));
  };
  CodeGenViewFactory.prototype.getProjectedNodes = function(projectableNodes, ngContentIndex) {
    return new util_1.Expression(projectableNodes.expression + "[" + ngContentIndex + "]", true);
  };
  CodeGenViewFactory.prototype.appendProjectedNodes = function(renderer, parent, nodes, targetStatements) {
    targetStatements.push(new util_1.Statement(renderer.expression + ".projectNodes(" + parent.expression + ", " + proto_view_compiler_1.APP_VIEW_MODULE_REF + "flattenNestedViewRenderNodes(" + nodes.expression + "));"));
  };
  CodeGenViewFactory.prototype.createViewFactory = function(asts, embeddedTemplateIndex, targetStatements) {
    var compileProtoView = this.protoViews[embeddedTemplateIndex];
    var isHostView = this.component.type.isHost;
    var isComponentView = embeddedTemplateIndex === 0 && !isHostView;
    var visitor = new ViewBuilderVisitor(new util_1.Expression('renderer'), new util_1.Expression('viewManager'), new util_1.Expression('projectableNodes'), isHostView ? new util_1.Expression('rootSelector') : null, new util_1.Expression('view'), compileProtoView, targetStatements, this);
    template_ast_1.templateVisitAll(visitor, asts, new ParentElement(isComponentView ? new util_1.Expression('parentRenderNode') : null, null, null));
    var appProtoView = compileProtoView.protoView.expression;
    var viewFactoryName = codeGenViewFactoryName(this.component, embeddedTemplateIndex);
    var changeDetectorFactory = this.changeDetectorExpressions.expressions[embeddedTemplateIndex];
    var factoryArgs = ['parentRenderer', 'viewManager', 'containerEl', 'projectableNodes', 'rootSelector', 'dynamicallyCreatedProviders', 'rootInjector'];
    var initRendererStmts = [];
    var rendererExpr = "parentRenderer";
    if (embeddedTemplateIndex === 0) {
      var renderCompTypeVar = this._nextVar('renderType');
      targetStatements.push(new util_1.Statement("var " + renderCompTypeVar + " = null;"));
      var stylesVar = this._nextVar('styles');
      targetStatements.push(new util_1.Statement(util_1.CONST_VAR + " " + stylesVar + " = " + this.styles.expression + ";"));
      var encapsulation = this.component.template.encapsulation;
      initRendererStmts.push("if (" + renderCompTypeVar + " == null) {\n        " + renderCompTypeVar + " = viewManager.createRenderComponentType(" + codeGenViewEncapsulation(encapsulation) + ", " + stylesVar + ");\n      }");
      rendererExpr = "parentRenderer.renderComponent(" + renderCompTypeVar + ")";
    }
    var statement = "\n" + util_1.codeGenFnHeader(factoryArgs, viewFactoryName) + "{\n  " + initRendererStmts.join('\n') + "\n  var renderer = " + rendererExpr + ";\n  var view = new " + proto_view_compiler_1.APP_VIEW_MODULE_REF + "AppView(\n    " + appProtoView + ", renderer, viewManager,\n    projectableNodes,\n    containerEl,\n    dynamicallyCreatedProviders, rootInjector,\n    " + changeDetectorFactory + "()\n  );\n  " + proto_view_compiler_1.APP_VIEW_MODULE_REF + "checkSlotCount(" + util_1.escapeValue(this.component.type.name) + ", " + this.component.template.ngContentSelectors.length + ", projectableNodes);\n  " + (isComponentView ? 'var parentRenderNode = renderer.createViewRoot(view.containerAppElement.nativeElement);' : '') + "\n  " + visitor.renderStmts.map(function(stmt) {
      return stmt.statement;
    }).join('\n') + "\n  " + visitor.appStmts.map(function(stmt) {
      return stmt.statement;
    }).join('\n') + "\n\n  view.init(" + util_1.codeGenFlatArray(visitor.rootNodesOrAppElements) + ", " + util_1.codeGenArray(visitor.renderNodes) + ", " + util_1.codeGenArray(visitor.appDisposables) + ",\n            " + util_1.codeGenArray(visitor.appElements) + ");\n  return view;\n}";
    targetStatements.push(new util_1.Statement(statement));
    return new util_1.Expression(viewFactoryName);
  };
  return CodeGenViewFactory;
})();
var RuntimeViewFactory = (function() {
  function RuntimeViewFactory(component, styles, protoViews, changeDetectorFactories, componentViewFactory) {
    this.component = component;
    this.styles = styles;
    this.protoViews = protoViews;
    this.changeDetectorFactories = changeDetectorFactories;
    this.componentViewFactory = componentViewFactory;
  }
  RuntimeViewFactory.prototype.createText = function(renderer, parent, text, targetStatements) {
    return renderer.createText(parent, text);
  };
  RuntimeViewFactory.prototype.createElement = function(renderer, parent, name, rootSelector, targetStatements) {
    var el;
    if (lang_1.isPresent(rootSelector)) {
      el = renderer.selectRootElement(rootSelector);
    } else {
      el = renderer.createElement(parent, name);
    }
    return el;
  };
  RuntimeViewFactory.prototype.createTemplateAnchor = function(renderer, parent, targetStatements) {
    return renderer.createTemplateAnchor(parent);
  };
  RuntimeViewFactory.prototype.createGlobalEventListener = function(renderer, appView, boundElementIndex, eventAst, targetStatements) {
    return renderer.listenGlobal(eventAst.target, eventAst.name, function(event) {
      return appView.triggerEventHandlers(eventAst.fullName, event, boundElementIndex);
    });
  };
  RuntimeViewFactory.prototype.createElementEventListener = function(renderer, appView, boundElementIndex, renderNode, eventAst, targetStatements) {
    return renderer.listen(renderNode, eventAst.name, function(event) {
      return appView.triggerEventHandlers(eventAst.fullName, event, boundElementIndex);
    });
  };
  RuntimeViewFactory.prototype.setElementAttribute = function(renderer, renderNode, attrName, attrValue, targetStatements) {
    renderer.setElementAttribute(renderNode, attrName, attrValue);
  };
  RuntimeViewFactory.prototype.createAppElement = function(appProtoEl, appView, renderNode, parentAppEl, embeddedViewFactory, targetStatements) {
    return new element_1.AppElement(appProtoEl, appView, parentAppEl, renderNode, embeddedViewFactory);
  };
  RuntimeViewFactory.prototype.createAndSetComponentView = function(renderer, viewManager, appView, appEl, component, contentNodesByNgContentIndex, targetStatements) {
    var flattenedContentNodes;
    if (this.component.type.isHost) {
      flattenedContentNodes = appView.projectableNodes;
    } else {
      flattenedContentNodes = collection_1.ListWrapper.createFixedSize(contentNodesByNgContentIndex.length);
      for (var i = 0; i < contentNodesByNgContentIndex.length; i++) {
        flattenedContentNodes[i] = util_1.flattenArray(contentNodesByNgContentIndex[i], []);
      }
    }
    this.componentViewFactory(component)(renderer, viewManager, appEl, flattenedContentNodes);
  };
  RuntimeViewFactory.prototype.getProjectedNodes = function(projectableNodes, ngContentIndex) {
    return projectableNodes[ngContentIndex];
  };
  RuntimeViewFactory.prototype.appendProjectedNodes = function(renderer, parent, nodes, targetStatements) {
    renderer.projectNodes(parent, view_1.flattenNestedViewRenderNodes(nodes));
  };
  RuntimeViewFactory.prototype.createViewFactory = function(asts, embeddedTemplateIndex, targetStatements) {
    var _this = this;
    var compileProtoView = this.protoViews[embeddedTemplateIndex];
    var isComponentView = compileProtoView.protoView.type === view_type_1.ViewType.COMPONENT;
    var renderComponentType = null;
    return function(parentRenderer, viewManager, containerEl, projectableNodes, rootSelector, dynamicallyCreatedProviders, rootInjector) {
      if (rootSelector === void 0) {
        rootSelector = null;
      }
      if (dynamicallyCreatedProviders === void 0) {
        dynamicallyCreatedProviders = null;
      }
      if (rootInjector === void 0) {
        rootInjector = null;
      }
      view_1.checkSlotCount(_this.component.type.name, _this.component.template.ngContentSelectors.length, projectableNodes);
      var renderer;
      if (embeddedTemplateIndex === 0) {
        if (lang_1.isBlank(renderComponentType)) {
          renderComponentType = viewManager.createRenderComponentType(_this.component.template.encapsulation, _this.styles);
        }
        renderer = parentRenderer.renderComponent(renderComponentType);
      } else {
        renderer = parentRenderer;
      }
      var changeDetector = _this.changeDetectorFactories[embeddedTemplateIndex]();
      var view = new view_1.AppView(compileProtoView.protoView, renderer, viewManager, projectableNodes, containerEl, dynamicallyCreatedProviders, rootInjector, changeDetector);
      var visitor = new ViewBuilderVisitor(renderer, viewManager, projectableNodes, rootSelector, view, compileProtoView, [], _this);
      var parentRenderNode = isComponentView ? renderer.createViewRoot(containerEl.nativeElement) : null;
      template_ast_1.templateVisitAll(visitor, asts, new ParentElement(parentRenderNode, null, null));
      view.init(util_1.flattenArray(visitor.rootNodesOrAppElements, []), visitor.renderNodes, visitor.appDisposables, visitor.appElements);
      return view;
    };
  };
  return RuntimeViewFactory;
})();
var ParentElement = (function() {
  function ParentElement(renderNode, appEl, component) {
    this.renderNode = renderNode;
    this.appEl = appEl;
    this.component = component;
    if (lang_1.isPresent(component)) {
      this.contentNodesByNgContentIndex = collection_1.ListWrapper.createFixedSize(component.template.ngContentSelectors.length);
      for (var i = 0; i < this.contentNodesByNgContentIndex.length; i++) {
        this.contentNodesByNgContentIndex[i] = [];
      }
    } else {
      this.contentNodesByNgContentIndex = null;
    }
  }
  ParentElement.prototype.addContentNode = function(ngContentIndex, nodeExpr) {
    this.contentNodesByNgContentIndex[ngContentIndex].push(nodeExpr);
  };
  return ParentElement;
})();
var ViewBuilderVisitor = (function() {
  function ViewBuilderVisitor(renderer, viewManager, projectableNodes, rootSelector, view, protoView, targetStatements, factory) {
    this.renderer = renderer;
    this.viewManager = viewManager;
    this.projectableNodes = projectableNodes;
    this.rootSelector = rootSelector;
    this.view = view;
    this.protoView = protoView;
    this.targetStatements = targetStatements;
    this.factory = factory;
    this.renderStmts = [];
    this.renderNodes = [];
    this.appStmts = [];
    this.appElements = [];
    this.appDisposables = [];
    this.rootNodesOrAppElements = [];
    this.elementCount = 0;
  }
  ViewBuilderVisitor.prototype._addRenderNode = function(renderNode, appEl, ngContentIndex, parent) {
    this.renderNodes.push(renderNode);
    if (lang_1.isPresent(parent.component)) {
      if (lang_1.isPresent(ngContentIndex)) {
        parent.addContentNode(ngContentIndex, lang_1.isPresent(appEl) ? appEl : renderNode);
      }
    } else if (lang_1.isBlank(parent.renderNode)) {
      this.rootNodesOrAppElements.push(lang_1.isPresent(appEl) ? appEl : renderNode);
    }
  };
  ViewBuilderVisitor.prototype._getParentRenderNode = function(ngContentIndex, parent) {
    return lang_1.isPresent(parent.component) && parent.component.template.encapsulation !== view_2.ViewEncapsulation.Native ? null : parent.renderNode;
  };
  ViewBuilderVisitor.prototype.visitBoundText = function(ast, parent) {
    return this._visitText('', ast.ngContentIndex, parent);
  };
  ViewBuilderVisitor.prototype.visitText = function(ast, parent) {
    return this._visitText(ast.value, ast.ngContentIndex, parent);
  };
  ViewBuilderVisitor.prototype._visitText = function(value, ngContentIndex, parent) {
    var renderNode = this.factory.createText(this.renderer, this._getParentRenderNode(ngContentIndex, parent), value, this.renderStmts);
    this._addRenderNode(renderNode, null, ngContentIndex, parent);
    return null;
  };
  ViewBuilderVisitor.prototype.visitNgContent = function(ast, parent) {
    var nodesExpression = this.factory.getProjectedNodes(this.projectableNodes, ast.index);
    if (lang_1.isPresent(parent.component)) {
      if (lang_1.isPresent(ast.ngContentIndex)) {
        parent.addContentNode(ast.ngContentIndex, nodesExpression);
      }
    } else {
      if (lang_1.isPresent(parent.renderNode)) {
        this.factory.appendProjectedNodes(this.renderer, parent.renderNode, nodesExpression, this.renderStmts);
      } else {
        this.rootNodesOrAppElements.push(nodesExpression);
      }
    }
    return null;
  };
  ViewBuilderVisitor.prototype.visitElement = function(ast, parent) {
    var _this = this;
    var renderNode = this.factory.createElement(this.renderer, this._getParentRenderNode(ast.ngContentIndex, parent), ast.name, this.rootSelector, this.renderStmts);
    var component = ast.getComponent();
    var elementIndex = this.elementCount++;
    var protoEl = this.protoView.protoElements[elementIndex];
    protoEl.renderEvents.forEach(function(eventAst) {
      var disposable;
      if (lang_1.isPresent(eventAst.target)) {
        disposable = _this.factory.createGlobalEventListener(_this.renderer, _this.view, protoEl.boundElementIndex, eventAst, _this.renderStmts);
      } else {
        disposable = _this.factory.createElementEventListener(_this.renderer, _this.view, protoEl.boundElementIndex, renderNode, eventAst, _this.renderStmts);
      }
      _this.appDisposables.push(disposable);
    });
    for (var i = 0; i < protoEl.attrNameAndValues.length; i++) {
      var attrName = protoEl.attrNameAndValues[i][0];
      var attrValue = protoEl.attrNameAndValues[i][1];
      this.factory.setElementAttribute(this.renderer, renderNode, attrName, attrValue, this.renderStmts);
    }
    var appEl = null;
    if (lang_1.isPresent(protoEl.appProtoEl)) {
      appEl = this.factory.createAppElement(protoEl.appProtoEl, this.view, renderNode, parent.appEl, null, this.appStmts);
      this.appElements.push(appEl);
    }
    this._addRenderNode(renderNode, appEl, ast.ngContentIndex, parent);
    var newParent = new ParentElement(renderNode, lang_1.isPresent(appEl) ? appEl : parent.appEl, component);
    template_ast_1.templateVisitAll(this, ast.children, newParent);
    if (lang_1.isPresent(appEl) && lang_1.isPresent(component)) {
      this.factory.createAndSetComponentView(this.renderer, this.viewManager, this.view, appEl, component, newParent.contentNodesByNgContentIndex, this.appStmts);
    }
    return null;
  };
  ViewBuilderVisitor.prototype.visitEmbeddedTemplate = function(ast, parent) {
    var renderNode = this.factory.createTemplateAnchor(this.renderer, this._getParentRenderNode(ast.ngContentIndex, parent), this.renderStmts);
    var elementIndex = this.elementCount++;
    var protoEl = this.protoView.protoElements[elementIndex];
    var embeddedViewFactory = this.factory.createViewFactory(ast.children, protoEl.embeddedTemplateIndex, this.targetStatements);
    var appEl = this.factory.createAppElement(protoEl.appProtoEl, this.view, renderNode, parent.appEl, embeddedViewFactory, this.appStmts);
    this._addRenderNode(renderNode, appEl, ast.ngContentIndex, parent);
    this.appElements.push(appEl);
    return null;
  };
  ViewBuilderVisitor.prototype.visitVariable = function(ast, ctx) {
    return null;
  };
  ViewBuilderVisitor.prototype.visitAttr = function(ast, ctx) {
    return null;
  };
  ViewBuilderVisitor.prototype.visitDirective = function(ast, ctx) {
    return null;
  };
  ViewBuilderVisitor.prototype.visitEvent = function(ast, ctx) {
    return null;
  };
  ViewBuilderVisitor.prototype.visitDirectiveProperty = function(ast, context) {
    return null;
  };
  ViewBuilderVisitor.prototype.visitElementProperty = function(ast, context) {
    return null;
  };
  return ViewBuilderVisitor;
})();
function codeGenEventHandler(view, boundElementIndex, eventName) {
  return util_1.codeGenValueFn(['event'], view.expression + ".triggerEventHandlers(" + util_1.escapeValue(eventName) + ", event, " + boundElementIndex + ")");
}
function codeGenViewFactoryName(component, embeddedTemplateIndex) {
  return "viewFactory_" + component.type.name + embeddedTemplateIndex;
}
function codeGenViewEncapsulation(value) {
  if (lang_1.IS_DART) {
    return "" + proto_view_compiler_1.METADATA_MODULE_REF + value;
  } else {
    return "" + value;
  }
}
