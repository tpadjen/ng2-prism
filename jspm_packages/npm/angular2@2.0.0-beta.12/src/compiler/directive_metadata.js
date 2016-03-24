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
var lang_1 = require('../facade/lang');
var exceptions_1 = require('../facade/exceptions');
var collection_1 = require('../facade/collection');
var change_detection_1 = require('../core/change_detection/change_detection');
var view_1 = require('../core/metadata/view');
var selector_1 = require('./selector');
var util_1 = require('./util');
var interfaces_1 = require('../core/linker/interfaces');
var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))$/g;
var CompileMetadataWithIdentifier = (function() {
  function CompileMetadataWithIdentifier() {}
  CompileMetadataWithIdentifier.fromJson = function(data) {
    return _COMPILE_METADATA_FROM_JSON[data['class']](data);
  };
  Object.defineProperty(CompileMetadataWithIdentifier.prototype, "identifier", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  return CompileMetadataWithIdentifier;
})();
exports.CompileMetadataWithIdentifier = CompileMetadataWithIdentifier;
var CompileMetadataWithType = (function(_super) {
  __extends(CompileMetadataWithType, _super);
  function CompileMetadataWithType() {
    _super.apply(this, arguments);
  }
  CompileMetadataWithType.fromJson = function(data) {
    return _COMPILE_METADATA_FROM_JSON[data['class']](data);
  };
  Object.defineProperty(CompileMetadataWithType.prototype, "type", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CompileMetadataWithType.prototype, "identifier", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  return CompileMetadataWithType;
})(CompileMetadataWithIdentifier);
exports.CompileMetadataWithType = CompileMetadataWithType;
var CompileIdentifierMetadata = (function() {
  function CompileIdentifierMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        runtime = _b.runtime,
        name = _b.name,
        moduleUrl = _b.moduleUrl,
        prefix = _b.prefix,
        constConstructor = _b.constConstructor;
    this.runtime = runtime;
    this.name = name;
    this.prefix = prefix;
    this.moduleUrl = moduleUrl;
    this.constConstructor = constConstructor;
  }
  CompileIdentifierMetadata.fromJson = function(data) {
    return new CompileIdentifierMetadata({
      name: data['name'],
      prefix: data['prefix'],
      moduleUrl: data['moduleUrl'],
      constConstructor: data['constConstructor']
    });
  };
  CompileIdentifierMetadata.prototype.toJson = function() {
    return {
      'class': 'Identifier',
      'name': this.name,
      'moduleUrl': this.moduleUrl,
      'prefix': this.prefix,
      'constConstructor': this.constConstructor
    };
  };
  Object.defineProperty(CompileIdentifierMetadata.prototype, "identifier", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  return CompileIdentifierMetadata;
})();
exports.CompileIdentifierMetadata = CompileIdentifierMetadata;
var CompileDiDependencyMetadata = (function() {
  function CompileDiDependencyMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        isAttribute = _b.isAttribute,
        isSelf = _b.isSelf,
        isHost = _b.isHost,
        isSkipSelf = _b.isSkipSelf,
        isOptional = _b.isOptional,
        query = _b.query,
        viewQuery = _b.viewQuery,
        token = _b.token;
    this.isAttribute = lang_1.normalizeBool(isAttribute);
    this.isSelf = lang_1.normalizeBool(isSelf);
    this.isHost = lang_1.normalizeBool(isHost);
    this.isSkipSelf = lang_1.normalizeBool(isSkipSelf);
    this.isOptional = lang_1.normalizeBool(isOptional);
    this.query = query;
    this.viewQuery = viewQuery;
    this.token = token;
  }
  CompileDiDependencyMetadata.fromJson = function(data) {
    return new CompileDiDependencyMetadata({
      token: objFromJson(data['token'], CompileIdentifierMetadata.fromJson),
      query: objFromJson(data['query'], CompileQueryMetadata.fromJson),
      viewQuery: objFromJson(data['viewQuery'], CompileQueryMetadata.fromJson),
      isAttribute: data['isAttribute'],
      isSelf: data['isSelf'],
      isHost: data['isHost'],
      isSkipSelf: data['isSkipSelf'],
      isOptional: data['isOptional']
    });
  };
  CompileDiDependencyMetadata.prototype.toJson = function() {
    return {
      'token': objToJson(this.token),
      'query': objToJson(this.query),
      'viewQuery': objToJson(this.viewQuery),
      'isAttribute': this.isAttribute,
      'isSelf': this.isSelf,
      'isHost': this.isHost,
      'isSkipSelf': this.isSkipSelf,
      'isOptional': this.isOptional
    };
  };
  return CompileDiDependencyMetadata;
})();
exports.CompileDiDependencyMetadata = CompileDiDependencyMetadata;
var CompileProviderMetadata = (function() {
  function CompileProviderMetadata(_a) {
    var token = _a.token,
        useClass = _a.useClass,
        useValue = _a.useValue,
        useExisting = _a.useExisting,
        useFactory = _a.useFactory,
        deps = _a.deps,
        multi = _a.multi;
    this.token = token;
    this.useClass = useClass;
    this.useValue = useValue;
    this.useExisting = useExisting;
    this.useFactory = useFactory;
    this.deps = deps;
    this.multi = multi;
  }
  CompileProviderMetadata.fromJson = function(data) {
    return new CompileProviderMetadata({
      token: objFromJson(data['token'], CompileIdentifierMetadata.fromJson),
      useClass: objFromJson(data['useClass'], CompileTypeMetadata.fromJson)
    });
  };
  CompileProviderMetadata.prototype.toJson = function() {
    return {
      'token': objToJson(this.token),
      'useClass': objToJson(this.useClass)
    };
  };
  return CompileProviderMetadata;
})();
exports.CompileProviderMetadata = CompileProviderMetadata;
var CompileFactoryMetadata = (function() {
  function CompileFactoryMetadata(_a) {
    var runtime = _a.runtime,
        name = _a.name,
        moduleUrl = _a.moduleUrl,
        constConstructor = _a.constConstructor,
        diDeps = _a.diDeps;
    this.runtime = runtime;
    this.name = name;
    this.moduleUrl = moduleUrl;
    this.diDeps = diDeps;
    this.constConstructor = constConstructor;
  }
  Object.defineProperty(CompileFactoryMetadata.prototype, "identifier", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  CompileFactoryMetadata.prototype.toJson = function() {
    return null;
  };
  return CompileFactoryMetadata;
})();
exports.CompileFactoryMetadata = CompileFactoryMetadata;
var CompileTypeMetadata = (function() {
  function CompileTypeMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        runtime = _b.runtime,
        name = _b.name,
        moduleUrl = _b.moduleUrl,
        prefix = _b.prefix,
        isHost = _b.isHost,
        constConstructor = _b.constConstructor,
        diDeps = _b.diDeps;
    this.runtime = runtime;
    this.name = name;
    this.moduleUrl = moduleUrl;
    this.prefix = prefix;
    this.isHost = lang_1.normalizeBool(isHost);
    this.constConstructor = constConstructor;
    this.diDeps = lang_1.normalizeBlank(diDeps);
  }
  CompileTypeMetadata.fromJson = function(data) {
    return new CompileTypeMetadata({
      name: data['name'],
      moduleUrl: data['moduleUrl'],
      prefix: data['prefix'],
      isHost: data['isHost'],
      constConstructor: data['constConstructor'],
      diDeps: arrayFromJson(data['diDeps'], CompileDiDependencyMetadata.fromJson)
    });
  };
  Object.defineProperty(CompileTypeMetadata.prototype, "identifier", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CompileTypeMetadata.prototype, "type", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  CompileTypeMetadata.prototype.toJson = function() {
    return {
      'class': 'Type',
      'name': this.name,
      'moduleUrl': this.moduleUrl,
      'prefix': this.prefix,
      'isHost': this.isHost,
      'constConstructor': this.constConstructor,
      'diDeps': arrayToJson(this.diDeps)
    };
  };
  return CompileTypeMetadata;
})();
exports.CompileTypeMetadata = CompileTypeMetadata;
var CompileQueryMetadata = (function() {
  function CompileQueryMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        selectors = _b.selectors,
        descendants = _b.descendants,
        first = _b.first,
        propertyName = _b.propertyName;
    this.selectors = selectors;
    this.descendants = descendants;
    this.first = lang_1.normalizeBool(first);
    this.propertyName = propertyName;
  }
  CompileQueryMetadata.fromJson = function(data) {
    return new CompileQueryMetadata({
      selectors: arrayFromJson(data['selectors'], CompileIdentifierMetadata.fromJson),
      descendants: data['descendants'],
      first: data['first'],
      propertyName: data['propertyName']
    });
  };
  CompileQueryMetadata.prototype.toJson = function() {
    return {
      'selectors': arrayToJson(this.selectors),
      'descendants': this.descendants,
      'first': this.first,
      'propertyName': this.propertyName
    };
  };
  return CompileQueryMetadata;
})();
exports.CompileQueryMetadata = CompileQueryMetadata;
var CompileTemplateMetadata = (function() {
  function CompileTemplateMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        encapsulation = _b.encapsulation,
        template = _b.template,
        templateUrl = _b.templateUrl,
        styles = _b.styles,
        styleUrls = _b.styleUrls,
        ngContentSelectors = _b.ngContentSelectors;
    this.encapsulation = lang_1.isPresent(encapsulation) ? encapsulation : view_1.ViewEncapsulation.Emulated;
    this.template = template;
    this.templateUrl = templateUrl;
    this.styles = lang_1.isPresent(styles) ? styles : [];
    this.styleUrls = lang_1.isPresent(styleUrls) ? styleUrls : [];
    this.ngContentSelectors = lang_1.isPresent(ngContentSelectors) ? ngContentSelectors : [];
  }
  CompileTemplateMetadata.fromJson = function(data) {
    return new CompileTemplateMetadata({
      encapsulation: lang_1.isPresent(data['encapsulation']) ? view_1.VIEW_ENCAPSULATION_VALUES[data['encapsulation']] : data['encapsulation'],
      template: data['template'],
      templateUrl: data['templateUrl'],
      styles: data['styles'],
      styleUrls: data['styleUrls'],
      ngContentSelectors: data['ngContentSelectors']
    });
  };
  CompileTemplateMetadata.prototype.toJson = function() {
    return {
      'encapsulation': lang_1.isPresent(this.encapsulation) ? lang_1.serializeEnum(this.encapsulation) : this.encapsulation,
      'template': this.template,
      'templateUrl': this.templateUrl,
      'styles': this.styles,
      'styleUrls': this.styleUrls,
      'ngContentSelectors': this.ngContentSelectors
    };
  };
  return CompileTemplateMetadata;
})();
exports.CompileTemplateMetadata = CompileTemplateMetadata;
var CompileDirectiveMetadata = (function() {
  function CompileDirectiveMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        type = _b.type,
        isComponent = _b.isComponent,
        dynamicLoadable = _b.dynamicLoadable,
        selector = _b.selector,
        exportAs = _b.exportAs,
        changeDetection = _b.changeDetection,
        inputs = _b.inputs,
        outputs = _b.outputs,
        hostListeners = _b.hostListeners,
        hostProperties = _b.hostProperties,
        hostAttributes = _b.hostAttributes,
        lifecycleHooks = _b.lifecycleHooks,
        providers = _b.providers,
        viewProviders = _b.viewProviders,
        queries = _b.queries,
        viewQueries = _b.viewQueries,
        template = _b.template;
    this.type = type;
    this.isComponent = isComponent;
    this.dynamicLoadable = dynamicLoadable;
    this.selector = selector;
    this.exportAs = exportAs;
    this.changeDetection = changeDetection;
    this.inputs = inputs;
    this.outputs = outputs;
    this.hostListeners = hostListeners;
    this.hostProperties = hostProperties;
    this.hostAttributes = hostAttributes;
    this.lifecycleHooks = lifecycleHooks;
    this.providers = lang_1.normalizeBlank(providers);
    this.viewProviders = lang_1.normalizeBlank(viewProviders);
    this.queries = queries;
    this.viewQueries = viewQueries;
    this.template = template;
  }
  CompileDirectiveMetadata.create = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        type = _b.type,
        isComponent = _b.isComponent,
        dynamicLoadable = _b.dynamicLoadable,
        selector = _b.selector,
        exportAs = _b.exportAs,
        changeDetection = _b.changeDetection,
        inputs = _b.inputs,
        outputs = _b.outputs,
        host = _b.host,
        lifecycleHooks = _b.lifecycleHooks,
        providers = _b.providers,
        viewProviders = _b.viewProviders,
        queries = _b.queries,
        viewQueries = _b.viewQueries,
        template = _b.template;
    var hostListeners = {};
    var hostProperties = {};
    var hostAttributes = {};
    if (lang_1.isPresent(host)) {
      collection_1.StringMapWrapper.forEach(host, function(value, key) {
        var matches = lang_1.RegExpWrapper.firstMatch(HOST_REG_EXP, key);
        if (lang_1.isBlank(matches)) {
          hostAttributes[key] = value;
        } else if (lang_1.isPresent(matches[1])) {
          hostProperties[matches[1]] = value;
        } else if (lang_1.isPresent(matches[2])) {
          hostListeners[matches[2]] = value;
        }
      });
    }
    var inputsMap = {};
    if (lang_1.isPresent(inputs)) {
      inputs.forEach(function(bindConfig) {
        var parts = util_1.splitAtColon(bindConfig, [bindConfig, bindConfig]);
        inputsMap[parts[0]] = parts[1];
      });
    }
    var outputsMap = {};
    if (lang_1.isPresent(outputs)) {
      outputs.forEach(function(bindConfig) {
        var parts = util_1.splitAtColon(bindConfig, [bindConfig, bindConfig]);
        outputsMap[parts[0]] = parts[1];
      });
    }
    return new CompileDirectiveMetadata({
      type: type,
      isComponent: lang_1.normalizeBool(isComponent),
      dynamicLoadable: lang_1.normalizeBool(dynamicLoadable),
      selector: selector,
      exportAs: exportAs,
      changeDetection: changeDetection,
      inputs: inputsMap,
      outputs: outputsMap,
      hostListeners: hostListeners,
      hostProperties: hostProperties,
      hostAttributes: hostAttributes,
      lifecycleHooks: lang_1.isPresent(lifecycleHooks) ? lifecycleHooks : [],
      providers: providers,
      viewProviders: viewProviders,
      queries: queries,
      viewQueries: viewQueries,
      template: template
    });
  };
  Object.defineProperty(CompileDirectiveMetadata.prototype, "identifier", {
    get: function() {
      return this.type;
    },
    enumerable: true,
    configurable: true
  });
  CompileDirectiveMetadata.fromJson = function(data) {
    return new CompileDirectiveMetadata({
      isComponent: data['isComponent'],
      dynamicLoadable: data['dynamicLoadable'],
      selector: data['selector'],
      exportAs: data['exportAs'],
      type: lang_1.isPresent(data['type']) ? CompileTypeMetadata.fromJson(data['type']) : data['type'],
      changeDetection: lang_1.isPresent(data['changeDetection']) ? change_detection_1.CHANGE_DETECTION_STRATEGY_VALUES[data['changeDetection']] : data['changeDetection'],
      inputs: data['inputs'],
      outputs: data['outputs'],
      hostListeners: data['hostListeners'],
      hostProperties: data['hostProperties'],
      hostAttributes: data['hostAttributes'],
      lifecycleHooks: data['lifecycleHooks'].map(function(hookValue) {
        return interfaces_1.LIFECYCLE_HOOKS_VALUES[hookValue];
      }),
      template: lang_1.isPresent(data['template']) ? CompileTemplateMetadata.fromJson(data['template']) : data['template'],
      providers: arrayFromJson(data['providers'], CompileProviderMetadata.fromJson)
    });
  };
  CompileDirectiveMetadata.prototype.toJson = function() {
    return {
      'class': 'Directive',
      'isComponent': this.isComponent,
      'dynamicLoadable': this.dynamicLoadable,
      'selector': this.selector,
      'exportAs': this.exportAs,
      'type': lang_1.isPresent(this.type) ? this.type.toJson() : this.type,
      'changeDetection': lang_1.isPresent(this.changeDetection) ? lang_1.serializeEnum(this.changeDetection) : this.changeDetection,
      'inputs': this.inputs,
      'outputs': this.outputs,
      'hostListeners': this.hostListeners,
      'hostProperties': this.hostProperties,
      'hostAttributes': this.hostAttributes,
      'lifecycleHooks': this.lifecycleHooks.map(function(hook) {
        return lang_1.serializeEnum(hook);
      }),
      'template': lang_1.isPresent(this.template) ? this.template.toJson() : this.template,
      'providers': arrayToJson(this.providers)
    };
  };
  return CompileDirectiveMetadata;
})();
exports.CompileDirectiveMetadata = CompileDirectiveMetadata;
function createHostComponentMeta(componentType, componentSelector) {
  var template = selector_1.CssSelector.parse(componentSelector)[0].getMatchingElementTemplate();
  return CompileDirectiveMetadata.create({
    type: new CompileTypeMetadata({
      runtime: Object,
      name: "Host" + componentType.name,
      moduleUrl: componentType.moduleUrl,
      isHost: true
    }),
    template: new CompileTemplateMetadata({
      template: template,
      templateUrl: '',
      styles: [],
      styleUrls: [],
      ngContentSelectors: []
    }),
    changeDetection: change_detection_1.ChangeDetectionStrategy.Default,
    inputs: [],
    outputs: [],
    host: {},
    lifecycleHooks: [],
    isComponent: true,
    dynamicLoadable: false,
    selector: '*',
    providers: [],
    viewProviders: [],
    queries: [],
    viewQueries: []
  });
}
exports.createHostComponentMeta = createHostComponentMeta;
var CompilePipeMetadata = (function() {
  function CompilePipeMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        type = _b.type,
        name = _b.name,
        pure = _b.pure;
    this.type = type;
    this.name = name;
    this.pure = lang_1.normalizeBool(pure);
  }
  Object.defineProperty(CompilePipeMetadata.prototype, "identifier", {
    get: function() {
      return this.type;
    },
    enumerable: true,
    configurable: true
  });
  CompilePipeMetadata.fromJson = function(data) {
    return new CompilePipeMetadata({
      type: lang_1.isPresent(data['type']) ? CompileTypeMetadata.fromJson(data['type']) : data['type'],
      name: data['name'],
      pure: data['pure']
    });
  };
  CompilePipeMetadata.prototype.toJson = function() {
    return {
      'class': 'Pipe',
      'type': lang_1.isPresent(this.type) ? this.type.toJson() : null,
      'name': this.name,
      'pure': this.pure
    };
  };
  return CompilePipeMetadata;
})();
exports.CompilePipeMetadata = CompilePipeMetadata;
var _COMPILE_METADATA_FROM_JSON = {
  'Directive': CompileDirectiveMetadata.fromJson,
  'Pipe': CompilePipeMetadata.fromJson,
  'Type': CompileTypeMetadata.fromJson,
  'Identifier': CompileIdentifierMetadata.fromJson
};
function arrayFromJson(obj, fn) {
  return lang_1.isBlank(obj) ? null : obj.map(function(o) {
    return objFromJson(o, fn);
  });
}
function arrayToJson(obj) {
  return lang_1.isBlank(obj) ? null : obj.map(objToJson);
}
function objFromJson(obj, fn) {
  return (lang_1.isString(obj) || lang_1.isBlank(obj)) ? obj : fn(obj);
}
function objToJson(obj) {
  return (lang_1.isString(obj) || lang_1.isBlank(obj)) ? obj : obj.toJson();
}
