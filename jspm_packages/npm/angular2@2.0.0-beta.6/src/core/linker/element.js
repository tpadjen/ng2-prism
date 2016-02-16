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
var collection_1 = require('../../facade/collection');
var di_1 = require('../di');
var provider_1 = require('../di/provider');
var injector_1 = require('../di/injector');
var provider_2 = require('../di/provider');
var di_2 = require('../metadata/di');
var view_type_1 = require('./view_type');
var element_ref_1 = require('./element_ref');
var view_container_ref_1 = require('./view_container_ref');
var element_ref_2 = require('./element_ref');
var api_1 = require('../render/api');
var template_ref_1 = require('./template_ref');
var directives_1 = require('../metadata/directives');
var change_detection_1 = require('../change_detection/change_detection');
var query_list_1 = require('./query_list');
var reflection_1 = require('../reflection/reflection');
var pipe_provider_1 = require('../pipes/pipe_provider');
var view_container_ref_2 = require('./view_container_ref');
var _staticKeys;
var StaticKeys = (function() {
  function StaticKeys() {
    this.templateRefId = di_1.Key.get(template_ref_1.TemplateRef).id;
    this.viewContainerId = di_1.Key.get(view_container_ref_1.ViewContainerRef).id;
    this.changeDetectorRefId = di_1.Key.get(change_detection_1.ChangeDetectorRef).id;
    this.elementRefId = di_1.Key.get(element_ref_2.ElementRef).id;
    this.rendererId = di_1.Key.get(api_1.Renderer).id;
  }
  StaticKeys.instance = function() {
    if (lang_1.isBlank(_staticKeys))
      _staticKeys = new StaticKeys();
    return _staticKeys;
  };
  return StaticKeys;
})();
exports.StaticKeys = StaticKeys;
var DirectiveDependency = (function(_super) {
  __extends(DirectiveDependency, _super);
  function DirectiveDependency(key, optional, lowerBoundVisibility, upperBoundVisibility, properties, attributeName, queryDecorator) {
    _super.call(this, key, optional, lowerBoundVisibility, upperBoundVisibility, properties);
    this.attributeName = attributeName;
    this.queryDecorator = queryDecorator;
    this._verify();
  }
  DirectiveDependency.prototype._verify = function() {
    var count = 0;
    if (lang_1.isPresent(this.queryDecorator))
      count++;
    if (lang_1.isPresent(this.attributeName))
      count++;
    if (count > 1)
      throw new exceptions_1.BaseException('A directive injectable can contain only one of the following @Attribute or @Query.');
  };
  DirectiveDependency.createFrom = function(d) {
    return new DirectiveDependency(d.key, d.optional, d.lowerBoundVisibility, d.upperBoundVisibility, d.properties, DirectiveDependency._attributeName(d.properties), DirectiveDependency._query(d.properties));
  };
  DirectiveDependency._attributeName = function(properties) {
    var p = properties.find(function(p) {
      return p instanceof di_2.AttributeMetadata;
    });
    return lang_1.isPresent(p) ? p.attributeName : null;
  };
  DirectiveDependency._query = function(properties) {
    return properties.find(function(p) {
      return p instanceof di_2.QueryMetadata;
    });
  };
  return DirectiveDependency;
})(di_1.Dependency);
exports.DirectiveDependency = DirectiveDependency;
var DirectiveProvider = (function(_super) {
  __extends(DirectiveProvider, _super);
  function DirectiveProvider(key, factory, deps, isComponent, providers, viewProviders, queries) {
    _super.call(this, key, [new provider_2.ResolvedFactory(factory, deps)], false);
    this.isComponent = isComponent;
    this.providers = providers;
    this.viewProviders = viewProviders;
    this.queries = queries;
  }
  Object.defineProperty(DirectiveProvider.prototype, "displayName", {
    get: function() {
      return this.key.displayName;
    },
    enumerable: true,
    configurable: true
  });
  DirectiveProvider.createFromType = function(type, meta) {
    var provider = new di_1.Provider(type, {useClass: type});
    if (lang_1.isBlank(meta)) {
      meta = new directives_1.DirectiveMetadata();
    }
    var rb = provider_2.resolveProvider(provider);
    var rf = rb.resolvedFactories[0];
    var deps = rf.dependencies.map(DirectiveDependency.createFrom);
    var isComponent = meta instanceof directives_1.ComponentMetadata;
    var resolvedProviders = lang_1.isPresent(meta.providers) ? di_1.Injector.resolve(meta.providers) : null;
    var resolvedViewProviders = meta instanceof directives_1.ComponentMetadata && lang_1.isPresent(meta.viewProviders) ? di_1.Injector.resolve(meta.viewProviders) : null;
    var queries = [];
    if (lang_1.isPresent(meta.queries)) {
      collection_1.StringMapWrapper.forEach(meta.queries, function(meta, fieldName) {
        var setter = reflection_1.reflector.setter(fieldName);
        queries.push(new QueryMetadataWithSetter(setter, meta));
      });
    }
    deps.forEach(function(d) {
      if (lang_1.isPresent(d.queryDecorator)) {
        queries.push(new QueryMetadataWithSetter(null, d.queryDecorator));
      }
    });
    return new DirectiveProvider(rb.key, rf.factory, deps, isComponent, resolvedProviders, resolvedViewProviders, queries);
  };
  return DirectiveProvider;
})(provider_2.ResolvedProvider_);
exports.DirectiveProvider = DirectiveProvider;
var QueryMetadataWithSetter = (function() {
  function QueryMetadataWithSetter(setter, metadata) {
    this.setter = setter;
    this.metadata = metadata;
  }
  return QueryMetadataWithSetter;
})();
exports.QueryMetadataWithSetter = QueryMetadataWithSetter;
function setProvidersVisibility(providers, visibility, result) {
  for (var i = 0; i < providers.length; i++) {
    result.set(providers[i].key.id, visibility);
  }
}
var AppProtoElement = (function() {
  function AppProtoElement(firstProviderIsComponent, index, attributes, pwvs, protoQueryRefs, directiveVariableBindings) {
    this.firstProviderIsComponent = firstProviderIsComponent;
    this.index = index;
    this.attributes = attributes;
    this.protoQueryRefs = protoQueryRefs;
    this.directiveVariableBindings = directiveVariableBindings;
    var length = pwvs.length;
    if (length > 0) {
      this.protoInjector = new injector_1.ProtoInjector(pwvs);
    } else {
      this.protoInjector = null;
      this.protoQueryRefs = [];
    }
  }
  AppProtoElement.create = function(metadataCache, index, attributes, directiveTypes, directiveVariableBindings) {
    var componentDirProvider = null;
    var mergedProvidersMap = new Map();
    var providerVisibilityMap = new Map();
    var providers = collection_1.ListWrapper.createGrowableSize(directiveTypes.length);
    var protoQueryRefs = [];
    for (var i = 0; i < directiveTypes.length; i++) {
      var dirProvider = metadataCache.getResolvedDirectiveMetadata(directiveTypes[i]);
      providers[i] = new injector_1.ProviderWithVisibility(dirProvider, dirProvider.isComponent ? injector_1.Visibility.PublicAndPrivate : injector_1.Visibility.Public);
      if (dirProvider.isComponent) {
        componentDirProvider = dirProvider;
      } else {
        if (lang_1.isPresent(dirProvider.providers)) {
          provider_1.mergeResolvedProviders(dirProvider.providers, mergedProvidersMap);
          setProvidersVisibility(dirProvider.providers, injector_1.Visibility.Public, providerVisibilityMap);
        }
      }
      if (lang_1.isPresent(dirProvider.viewProviders)) {
        provider_1.mergeResolvedProviders(dirProvider.viewProviders, mergedProvidersMap);
        setProvidersVisibility(dirProvider.viewProviders, injector_1.Visibility.Private, providerVisibilityMap);
      }
      for (var queryIdx = 0; queryIdx < dirProvider.queries.length; queryIdx++) {
        var q = dirProvider.queries[queryIdx];
        protoQueryRefs.push(new ProtoQueryRef(i, q.setter, q.metadata));
      }
    }
    if (lang_1.isPresent(componentDirProvider) && lang_1.isPresent(componentDirProvider.providers)) {
      provider_1.mergeResolvedProviders(componentDirProvider.providers, mergedProvidersMap);
      setProvidersVisibility(componentDirProvider.providers, injector_1.Visibility.Public, providerVisibilityMap);
    }
    mergedProvidersMap.forEach(function(provider, _) {
      providers.push(new injector_1.ProviderWithVisibility(provider, providerVisibilityMap.get(provider.key.id)));
    });
    return new AppProtoElement(lang_1.isPresent(componentDirProvider), index, attributes, providers, protoQueryRefs, directiveVariableBindings);
  };
  AppProtoElement.prototype.getProviderAtIndex = function(index) {
    return this.protoInjector.getProviderAtIndex(index);
  };
  return AppProtoElement;
})();
exports.AppProtoElement = AppProtoElement;
var _Context = (function() {
  function _Context(element, componentElement, injector) {
    this.element = element;
    this.componentElement = componentElement;
    this.injector = injector;
  }
  return _Context;
})();
var InjectorWithHostBoundary = (function() {
  function InjectorWithHostBoundary(injector, hostInjectorBoundary) {
    this.injector = injector;
    this.hostInjectorBoundary = hostInjectorBoundary;
  }
  return InjectorWithHostBoundary;
})();
exports.InjectorWithHostBoundary = InjectorWithHostBoundary;
var AppElement = (function() {
  function AppElement(proto, parentView, parent, nativeElement, embeddedViewFactory) {
    var _this = this;
    this.proto = proto;
    this.parentView = parentView;
    this.parent = parent;
    this.nativeElement = nativeElement;
    this.embeddedViewFactory = embeddedViewFactory;
    this.nestedViews = null;
    this.componentView = null;
    this.ref = new element_ref_1.ElementRef_(this);
    var parentInjector = lang_1.isPresent(parent) ? parent._injector : parentView.parentInjector;
    if (lang_1.isPresent(this.proto.protoInjector)) {
      var isBoundary;
      if (lang_1.isPresent(parent) && lang_1.isPresent(parent.proto.protoInjector)) {
        isBoundary = false;
      } else {
        isBoundary = parentView.hostInjectorBoundary;
      }
      this._queryStrategy = this._buildQueryStrategy();
      this._injector = new di_1.Injector(this.proto.protoInjector, parentInjector, isBoundary, this, function() {
        return _this._debugContext();
      });
      var injectorStrategy = this._injector.internalStrategy;
      this._strategy = injectorStrategy instanceof injector_1.InjectorInlineStrategy ? new ElementDirectiveInlineStrategy(injectorStrategy, this) : new ElementDirectiveDynamicStrategy(injectorStrategy, this);
      this._strategy.init();
    } else {
      this._queryStrategy = null;
      this._injector = parentInjector;
      this._strategy = null;
    }
  }
  AppElement.getViewParentInjector = function(parentViewType, containerAppElement, imperativelyCreatedProviders, rootInjector) {
    var parentInjector;
    var hostInjectorBoundary;
    switch (parentViewType) {
      case view_type_1.ViewType.COMPONENT:
        parentInjector = containerAppElement._injector;
        hostInjectorBoundary = true;
        break;
      case view_type_1.ViewType.EMBEDDED:
        parentInjector = lang_1.isPresent(containerAppElement.proto.protoInjector) ? containerAppElement._injector.parent : containerAppElement._injector;
        hostInjectorBoundary = containerAppElement._injector.hostBoundary;
        break;
      case view_type_1.ViewType.HOST:
        if (lang_1.isPresent(containerAppElement)) {
          parentInjector = lang_1.isPresent(containerAppElement.proto.protoInjector) ? containerAppElement._injector.parent : containerAppElement._injector;
          if (lang_1.isPresent(imperativelyCreatedProviders)) {
            var imperativeProvidersWithVisibility = imperativelyCreatedProviders.map(function(p) {
              return new injector_1.ProviderWithVisibility(p, injector_1.Visibility.Public);
            });
            parentInjector = new di_1.Injector(new injector_1.ProtoInjector(imperativeProvidersWithVisibility), parentInjector, true, null, null);
            hostInjectorBoundary = false;
          } else {
            hostInjectorBoundary = containerAppElement._injector.hostBoundary;
          }
        } else {
          parentInjector = rootInjector;
          hostInjectorBoundary = true;
        }
        break;
    }
    return new InjectorWithHostBoundary(parentInjector, hostInjectorBoundary);
  };
  AppElement.prototype.attachComponentView = function(componentView) {
    this.componentView = componentView;
  };
  AppElement.prototype._debugContext = function() {
    var c = this.parentView.getDebugContext(this, null, null);
    return lang_1.isPresent(c) ? new _Context(c.element, c.componentElement, c.injector) : null;
  };
  AppElement.prototype.hasVariableBinding = function(name) {
    var vb = this.proto.directiveVariableBindings;
    return lang_1.isPresent(vb) && collection_1.StringMapWrapper.contains(vb, name);
  };
  AppElement.prototype.getVariableBinding = function(name) {
    var index = this.proto.directiveVariableBindings[name];
    return lang_1.isPresent(index) ? this.getDirectiveAtIndex(index) : this.getElementRef();
  };
  AppElement.prototype.get = function(token) {
    return this._injector.get(token);
  };
  AppElement.prototype.hasDirective = function(type) {
    return lang_1.isPresent(this._injector.getOptional(type));
  };
  AppElement.prototype.getComponent = function() {
    return lang_1.isPresent(this._strategy) ? this._strategy.getComponent() : null;
  };
  AppElement.prototype.getInjector = function() {
    return this._injector;
  };
  AppElement.prototype.getElementRef = function() {
    return this.ref;
  };
  AppElement.prototype.getViewContainerRef = function() {
    return new view_container_ref_2.ViewContainerRef_(this);
  };
  AppElement.prototype.getTemplateRef = function() {
    if (lang_1.isPresent(this.embeddedViewFactory)) {
      return new template_ref_1.TemplateRef_(this.ref);
    }
    return null;
  };
  AppElement.prototype.getDependency = function(injector, provider, dep) {
    if (provider instanceof DirectiveProvider) {
      var dirDep = dep;
      if (lang_1.isPresent(dirDep.attributeName))
        return this._buildAttribute(dirDep);
      if (lang_1.isPresent(dirDep.queryDecorator))
        return this._queryStrategy.findQuery(dirDep.queryDecorator).list;
      if (dirDep.key.id === StaticKeys.instance().changeDetectorRefId) {
        if (this.proto.firstProviderIsComponent) {
          return new _ComponentViewChangeDetectorRef(this);
        } else {
          return this.parentView.changeDetector.ref;
        }
      }
      if (dirDep.key.id === StaticKeys.instance().elementRefId) {
        return this.getElementRef();
      }
      if (dirDep.key.id === StaticKeys.instance().viewContainerId) {
        return this.getViewContainerRef();
      }
      if (dirDep.key.id === StaticKeys.instance().templateRefId) {
        var tr = this.getTemplateRef();
        if (lang_1.isBlank(tr) && !dirDep.optional) {
          throw new di_1.NoProviderError(null, dirDep.key);
        }
        return tr;
      }
      if (dirDep.key.id === StaticKeys.instance().rendererId) {
        return this.parentView.renderer;
      }
    } else if (provider instanceof pipe_provider_1.PipeProvider) {
      if (dep.key.id === StaticKeys.instance().changeDetectorRefId) {
        if (this.proto.firstProviderIsComponent) {
          return new _ComponentViewChangeDetectorRef(this);
        } else {
          return this.parentView.changeDetector;
        }
      }
    }
    return injector_1.UNDEFINED;
  };
  AppElement.prototype._buildAttribute = function(dep) {
    var attributes = this.proto.attributes;
    if (lang_1.isPresent(attributes) && collection_1.StringMapWrapper.contains(attributes, dep.attributeName)) {
      return attributes[dep.attributeName];
    } else {
      return null;
    }
  };
  AppElement.prototype.addDirectivesMatchingQuery = function(query, list) {
    var templateRef = this.getTemplateRef();
    if (query.selector === template_ref_1.TemplateRef && lang_1.isPresent(templateRef)) {
      list.push(templateRef);
    }
    if (this._strategy != null) {
      this._strategy.addDirectivesMatchingQuery(query, list);
    }
  };
  AppElement.prototype._buildQueryStrategy = function() {
    if (this.proto.protoQueryRefs.length === 0) {
      return _emptyQueryStrategy;
    } else if (this.proto.protoQueryRefs.length <= InlineQueryStrategy.NUMBER_OF_SUPPORTED_QUERIES) {
      return new InlineQueryStrategy(this);
    } else {
      return new DynamicQueryStrategy(this);
    }
  };
  AppElement.prototype.getDirectiveAtIndex = function(index) {
    return this._injector.getAt(index);
  };
  AppElement.prototype.ngAfterViewChecked = function() {
    if (lang_1.isPresent(this._queryStrategy))
      this._queryStrategy.updateViewQueries();
  };
  AppElement.prototype.ngAfterContentChecked = function() {
    if (lang_1.isPresent(this._queryStrategy))
      this._queryStrategy.updateContentQueries();
  };
  AppElement.prototype.traverseAndSetQueriesAsDirty = function() {
    var inj = this;
    while (lang_1.isPresent(inj)) {
      inj._setQueriesAsDirty();
      if (lang_1.isBlank(inj.parent) && inj.parentView.proto.type === view_type_1.ViewType.EMBEDDED) {
        inj = inj.parentView.containerAppElement;
      } else {
        inj = inj.parent;
      }
    }
  };
  AppElement.prototype._setQueriesAsDirty = function() {
    if (lang_1.isPresent(this._queryStrategy)) {
      this._queryStrategy.setContentQueriesAsDirty();
    }
    if (this.parentView.proto.type === view_type_1.ViewType.COMPONENT) {
      this.parentView.containerAppElement._queryStrategy.setViewQueriesAsDirty();
    }
  };
  return AppElement;
})();
exports.AppElement = AppElement;
var _EmptyQueryStrategy = (function() {
  function _EmptyQueryStrategy() {}
  _EmptyQueryStrategy.prototype.setContentQueriesAsDirty = function() {};
  _EmptyQueryStrategy.prototype.setViewQueriesAsDirty = function() {};
  _EmptyQueryStrategy.prototype.updateContentQueries = function() {};
  _EmptyQueryStrategy.prototype.updateViewQueries = function() {};
  _EmptyQueryStrategy.prototype.findQuery = function(query) {
    throw new exceptions_1.BaseException("Cannot find query for directive " + query + ".");
  };
  return _EmptyQueryStrategy;
})();
var _emptyQueryStrategy = new _EmptyQueryStrategy();
var InlineQueryStrategy = (function() {
  function InlineQueryStrategy(ei) {
    var protoRefs = ei.proto.protoQueryRefs;
    if (protoRefs.length > 0)
      this.query0 = new QueryRef(protoRefs[0], ei);
    if (protoRefs.length > 1)
      this.query1 = new QueryRef(protoRefs[1], ei);
    if (protoRefs.length > 2)
      this.query2 = new QueryRef(protoRefs[2], ei);
  }
  InlineQueryStrategy.prototype.setContentQueriesAsDirty = function() {
    if (lang_1.isPresent(this.query0) && !this.query0.isViewQuery)
      this.query0.dirty = true;
    if (lang_1.isPresent(this.query1) && !this.query1.isViewQuery)
      this.query1.dirty = true;
    if (lang_1.isPresent(this.query2) && !this.query2.isViewQuery)
      this.query2.dirty = true;
  };
  InlineQueryStrategy.prototype.setViewQueriesAsDirty = function() {
    if (lang_1.isPresent(this.query0) && this.query0.isViewQuery)
      this.query0.dirty = true;
    if (lang_1.isPresent(this.query1) && this.query1.isViewQuery)
      this.query1.dirty = true;
    if (lang_1.isPresent(this.query2) && this.query2.isViewQuery)
      this.query2.dirty = true;
  };
  InlineQueryStrategy.prototype.updateContentQueries = function() {
    if (lang_1.isPresent(this.query0) && !this.query0.isViewQuery) {
      this.query0.update();
    }
    if (lang_1.isPresent(this.query1) && !this.query1.isViewQuery) {
      this.query1.update();
    }
    if (lang_1.isPresent(this.query2) && !this.query2.isViewQuery) {
      this.query2.update();
    }
  };
  InlineQueryStrategy.prototype.updateViewQueries = function() {
    if (lang_1.isPresent(this.query0) && this.query0.isViewQuery) {
      this.query0.update();
    }
    if (lang_1.isPresent(this.query1) && this.query1.isViewQuery) {
      this.query1.update();
    }
    if (lang_1.isPresent(this.query2) && this.query2.isViewQuery) {
      this.query2.update();
    }
  };
  InlineQueryStrategy.prototype.findQuery = function(query) {
    if (lang_1.isPresent(this.query0) && this.query0.protoQueryRef.query === query) {
      return this.query0;
    }
    if (lang_1.isPresent(this.query1) && this.query1.protoQueryRef.query === query) {
      return this.query1;
    }
    if (lang_1.isPresent(this.query2) && this.query2.protoQueryRef.query === query) {
      return this.query2;
    }
    throw new exceptions_1.BaseException("Cannot find query for directive " + query + ".");
  };
  InlineQueryStrategy.NUMBER_OF_SUPPORTED_QUERIES = 3;
  return InlineQueryStrategy;
})();
var DynamicQueryStrategy = (function() {
  function DynamicQueryStrategy(ei) {
    this.queries = ei.proto.protoQueryRefs.map(function(p) {
      return new QueryRef(p, ei);
    });
  }
  DynamicQueryStrategy.prototype.setContentQueriesAsDirty = function() {
    for (var i = 0; i < this.queries.length; ++i) {
      var q = this.queries[i];
      if (!q.isViewQuery)
        q.dirty = true;
    }
  };
  DynamicQueryStrategy.prototype.setViewQueriesAsDirty = function() {
    for (var i = 0; i < this.queries.length; ++i) {
      var q = this.queries[i];
      if (q.isViewQuery)
        q.dirty = true;
    }
  };
  DynamicQueryStrategy.prototype.updateContentQueries = function() {
    for (var i = 0; i < this.queries.length; ++i) {
      var q = this.queries[i];
      if (!q.isViewQuery) {
        q.update();
      }
    }
  };
  DynamicQueryStrategy.prototype.updateViewQueries = function() {
    for (var i = 0; i < this.queries.length; ++i) {
      var q = this.queries[i];
      if (q.isViewQuery) {
        q.update();
      }
    }
  };
  DynamicQueryStrategy.prototype.findQuery = function(query) {
    for (var i = 0; i < this.queries.length; ++i) {
      var q = this.queries[i];
      if (q.protoQueryRef.query === query) {
        return q;
      }
    }
    throw new exceptions_1.BaseException("Cannot find query for directive " + query + ".");
  };
  return DynamicQueryStrategy;
})();
var ElementDirectiveInlineStrategy = (function() {
  function ElementDirectiveInlineStrategy(injectorStrategy, _ei) {
    this.injectorStrategy = injectorStrategy;
    this._ei = _ei;
  }
  ElementDirectiveInlineStrategy.prototype.init = function() {
    var i = this.injectorStrategy;
    var p = i.protoStrategy;
    i.resetConstructionCounter();
    if (p.provider0 instanceof DirectiveProvider && lang_1.isPresent(p.keyId0) && i.obj0 === injector_1.UNDEFINED)
      i.obj0 = i.instantiateProvider(p.provider0, p.visibility0);
    if (p.provider1 instanceof DirectiveProvider && lang_1.isPresent(p.keyId1) && i.obj1 === injector_1.UNDEFINED)
      i.obj1 = i.instantiateProvider(p.provider1, p.visibility1);
    if (p.provider2 instanceof DirectiveProvider && lang_1.isPresent(p.keyId2) && i.obj2 === injector_1.UNDEFINED)
      i.obj2 = i.instantiateProvider(p.provider2, p.visibility2);
    if (p.provider3 instanceof DirectiveProvider && lang_1.isPresent(p.keyId3) && i.obj3 === injector_1.UNDEFINED)
      i.obj3 = i.instantiateProvider(p.provider3, p.visibility3);
    if (p.provider4 instanceof DirectiveProvider && lang_1.isPresent(p.keyId4) && i.obj4 === injector_1.UNDEFINED)
      i.obj4 = i.instantiateProvider(p.provider4, p.visibility4);
    if (p.provider5 instanceof DirectiveProvider && lang_1.isPresent(p.keyId5) && i.obj5 === injector_1.UNDEFINED)
      i.obj5 = i.instantiateProvider(p.provider5, p.visibility5);
    if (p.provider6 instanceof DirectiveProvider && lang_1.isPresent(p.keyId6) && i.obj6 === injector_1.UNDEFINED)
      i.obj6 = i.instantiateProvider(p.provider6, p.visibility6);
    if (p.provider7 instanceof DirectiveProvider && lang_1.isPresent(p.keyId7) && i.obj7 === injector_1.UNDEFINED)
      i.obj7 = i.instantiateProvider(p.provider7, p.visibility7);
    if (p.provider8 instanceof DirectiveProvider && lang_1.isPresent(p.keyId8) && i.obj8 === injector_1.UNDEFINED)
      i.obj8 = i.instantiateProvider(p.provider8, p.visibility8);
    if (p.provider9 instanceof DirectiveProvider && lang_1.isPresent(p.keyId9) && i.obj9 === injector_1.UNDEFINED)
      i.obj9 = i.instantiateProvider(p.provider9, p.visibility9);
  };
  ElementDirectiveInlineStrategy.prototype.getComponent = function() {
    return this.injectorStrategy.obj0;
  };
  ElementDirectiveInlineStrategy.prototype.isComponentKey = function(key) {
    return this._ei.proto.firstProviderIsComponent && lang_1.isPresent(key) && key.id === this.injectorStrategy.protoStrategy.keyId0;
  };
  ElementDirectiveInlineStrategy.prototype.addDirectivesMatchingQuery = function(query, list) {
    var i = this.injectorStrategy;
    var p = i.protoStrategy;
    if (lang_1.isPresent(p.provider0) && p.provider0.key.token === query.selector) {
      if (i.obj0 === injector_1.UNDEFINED)
        i.obj0 = i.instantiateProvider(p.provider0, p.visibility0);
      list.push(i.obj0);
    }
    if (lang_1.isPresent(p.provider1) && p.provider1.key.token === query.selector) {
      if (i.obj1 === injector_1.UNDEFINED)
        i.obj1 = i.instantiateProvider(p.provider1, p.visibility1);
      list.push(i.obj1);
    }
    if (lang_1.isPresent(p.provider2) && p.provider2.key.token === query.selector) {
      if (i.obj2 === injector_1.UNDEFINED)
        i.obj2 = i.instantiateProvider(p.provider2, p.visibility2);
      list.push(i.obj2);
    }
    if (lang_1.isPresent(p.provider3) && p.provider3.key.token === query.selector) {
      if (i.obj3 === injector_1.UNDEFINED)
        i.obj3 = i.instantiateProvider(p.provider3, p.visibility3);
      list.push(i.obj3);
    }
    if (lang_1.isPresent(p.provider4) && p.provider4.key.token === query.selector) {
      if (i.obj4 === injector_1.UNDEFINED)
        i.obj4 = i.instantiateProvider(p.provider4, p.visibility4);
      list.push(i.obj4);
    }
    if (lang_1.isPresent(p.provider5) && p.provider5.key.token === query.selector) {
      if (i.obj5 === injector_1.UNDEFINED)
        i.obj5 = i.instantiateProvider(p.provider5, p.visibility5);
      list.push(i.obj5);
    }
    if (lang_1.isPresent(p.provider6) && p.provider6.key.token === query.selector) {
      if (i.obj6 === injector_1.UNDEFINED)
        i.obj6 = i.instantiateProvider(p.provider6, p.visibility6);
      list.push(i.obj6);
    }
    if (lang_1.isPresent(p.provider7) && p.provider7.key.token === query.selector) {
      if (i.obj7 === injector_1.UNDEFINED)
        i.obj7 = i.instantiateProvider(p.provider7, p.visibility7);
      list.push(i.obj7);
    }
    if (lang_1.isPresent(p.provider8) && p.provider8.key.token === query.selector) {
      if (i.obj8 === injector_1.UNDEFINED)
        i.obj8 = i.instantiateProvider(p.provider8, p.visibility8);
      list.push(i.obj8);
    }
    if (lang_1.isPresent(p.provider9) && p.provider9.key.token === query.selector) {
      if (i.obj9 === injector_1.UNDEFINED)
        i.obj9 = i.instantiateProvider(p.provider9, p.visibility9);
      list.push(i.obj9);
    }
  };
  return ElementDirectiveInlineStrategy;
})();
var ElementDirectiveDynamicStrategy = (function() {
  function ElementDirectiveDynamicStrategy(injectorStrategy, _ei) {
    this.injectorStrategy = injectorStrategy;
    this._ei = _ei;
  }
  ElementDirectiveDynamicStrategy.prototype.init = function() {
    var inj = this.injectorStrategy;
    var p = inj.protoStrategy;
    inj.resetConstructionCounter();
    for (var i = 0; i < p.keyIds.length; i++) {
      if (p.providers[i] instanceof DirectiveProvider && lang_1.isPresent(p.keyIds[i]) && inj.objs[i] === injector_1.UNDEFINED) {
        inj.objs[i] = inj.instantiateProvider(p.providers[i], p.visibilities[i]);
      }
    }
  };
  ElementDirectiveDynamicStrategy.prototype.getComponent = function() {
    return this.injectorStrategy.objs[0];
  };
  ElementDirectiveDynamicStrategy.prototype.isComponentKey = function(key) {
    var p = this.injectorStrategy.protoStrategy;
    return this._ei.proto.firstProviderIsComponent && lang_1.isPresent(key) && key.id === p.keyIds[0];
  };
  ElementDirectiveDynamicStrategy.prototype.addDirectivesMatchingQuery = function(query, list) {
    var ist = this.injectorStrategy;
    var p = ist.protoStrategy;
    for (var i = 0; i < p.providers.length; i++) {
      if (p.providers[i].key.token === query.selector) {
        if (ist.objs[i] === injector_1.UNDEFINED) {
          ist.objs[i] = ist.instantiateProvider(p.providers[i], p.visibilities[i]);
        }
        list.push(ist.objs[i]);
      }
    }
  };
  return ElementDirectiveDynamicStrategy;
})();
var ProtoQueryRef = (function() {
  function ProtoQueryRef(dirIndex, setter, query) {
    this.dirIndex = dirIndex;
    this.setter = setter;
    this.query = query;
  }
  Object.defineProperty(ProtoQueryRef.prototype, "usesPropertySyntax", {
    get: function() {
      return lang_1.isPresent(this.setter);
    },
    enumerable: true,
    configurable: true
  });
  return ProtoQueryRef;
})();
exports.ProtoQueryRef = ProtoQueryRef;
var QueryRef = (function() {
  function QueryRef(protoQueryRef, originator) {
    this.protoQueryRef = protoQueryRef;
    this.originator = originator;
    this.list = new query_list_1.QueryList();
    this.dirty = true;
  }
  Object.defineProperty(QueryRef.prototype, "isViewQuery", {
    get: function() {
      return this.protoQueryRef.query.isViewQuery;
    },
    enumerable: true,
    configurable: true
  });
  QueryRef.prototype.update = function() {
    if (!this.dirty)
      return;
    this._update();
    this.dirty = false;
    if (this.protoQueryRef.usesPropertySyntax) {
      var dir = this.originator.getDirectiveAtIndex(this.protoQueryRef.dirIndex);
      if (this.protoQueryRef.query.first) {
        this.protoQueryRef.setter(dir, this.list.length > 0 ? this.list.first : null);
      } else {
        this.protoQueryRef.setter(dir, this.list);
      }
    }
    this.list.notifyOnChanges();
  };
  QueryRef.prototype._update = function() {
    var aggregator = [];
    if (this.protoQueryRef.query.isViewQuery) {
      var nestedView = this.originator.componentView;
      if (lang_1.isPresent(nestedView))
        this._visitView(nestedView, aggregator);
    } else {
      this._visit(this.originator, aggregator);
    }
    this.list.reset(aggregator);
  };
  ;
  QueryRef.prototype._visit = function(inj, aggregator) {
    var view = inj.parentView;
    var startIdx = inj.proto.index;
    for (var i = startIdx; i < view.appElements.length; i++) {
      var curInj = view.appElements[i];
      if (i > startIdx && (lang_1.isBlank(curInj.parent) || curInj.parent.proto.index < startIdx)) {
        break;
      }
      if (!this.protoQueryRef.query.descendants && !(curInj.parent == this.originator || curInj == this.originator))
        continue;
      this._visitInjector(curInj, aggregator);
      this._visitViewContainerViews(curInj.nestedViews, aggregator);
    }
  };
  QueryRef.prototype._visitInjector = function(inj, aggregator) {
    if (this.protoQueryRef.query.isVarBindingQuery) {
      this._aggregateVariableBinding(inj, aggregator);
    } else {
      this._aggregateDirective(inj, aggregator);
    }
  };
  QueryRef.prototype._visitViewContainerViews = function(views, aggregator) {
    if (lang_1.isPresent(views)) {
      for (var j = 0; j < views.length; j++) {
        this._visitView(views[j], aggregator);
      }
    }
  };
  QueryRef.prototype._visitView = function(view, aggregator) {
    for (var i = 0; i < view.appElements.length; i++) {
      var inj = view.appElements[i];
      this._visitInjector(inj, aggregator);
      this._visitViewContainerViews(inj.nestedViews, aggregator);
    }
  };
  QueryRef.prototype._aggregateVariableBinding = function(inj, aggregator) {
    var vb = this.protoQueryRef.query.varBindings;
    for (var i = 0; i < vb.length; ++i) {
      if (inj.hasVariableBinding(vb[i])) {
        aggregator.push(inj.getVariableBinding(vb[i]));
      }
    }
  };
  QueryRef.prototype._aggregateDirective = function(inj, aggregator) {
    inj.addDirectivesMatchingQuery(this.protoQueryRef.query, aggregator);
  };
  return QueryRef;
})();
exports.QueryRef = QueryRef;
var _ComponentViewChangeDetectorRef = (function(_super) {
  __extends(_ComponentViewChangeDetectorRef, _super);
  function _ComponentViewChangeDetectorRef(_appElement) {
    _super.call(this);
    this._appElement = _appElement;
  }
  _ComponentViewChangeDetectorRef.prototype.markForCheck = function() {
    this._appElement.componentView.changeDetector.ref.markForCheck();
  };
  _ComponentViewChangeDetectorRef.prototype.detach = function() {
    this._appElement.componentView.changeDetector.ref.detach();
  };
  _ComponentViewChangeDetectorRef.prototype.detectChanges = function() {
    this._appElement.componentView.changeDetector.ref.detectChanges();
  };
  _ComponentViewChangeDetectorRef.prototype.checkNoChanges = function() {
    this._appElement.componentView.changeDetector.ref.checkNoChanges();
  };
  _ComponentViewChangeDetectorRef.prototype.reattach = function() {
    this._appElement.componentView.changeDetector.ref.reattach();
  };
  return _ComponentViewChangeDetectorRef;
})(change_detection_1.ChangeDetectorRef);
