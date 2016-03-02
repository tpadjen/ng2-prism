/* */ 
'use strict';
var lang_1 = require('../facade/lang');
var di_1 = require('./di');
var application_tokens_1 = require('./application_tokens');
var change_detection_1 = require('./change_detection/change_detection');
var resolved_metadata_cache_1 = require('./linker/resolved_metadata_cache');
var view_manager_1 = require('./linker/view_manager');
var view_manager_2 = require('./linker/view_manager');
var view_resolver_1 = require('./linker/view_resolver');
var directive_resolver_1 = require('./linker/directive_resolver');
var pipe_resolver_1 = require('./linker/pipe_resolver');
var compiler_1 = require('./linker/compiler');
var compiler_2 = require('./linker/compiler');
var dynamic_component_loader_1 = require('./linker/dynamic_component_loader');
var dynamic_component_loader_2 = require('./linker/dynamic_component_loader');
exports.APPLICATION_COMMON_PROVIDERS = lang_1.CONST_EXPR([new di_1.Provider(compiler_1.Compiler, {useClass: compiler_2.Compiler_}), application_tokens_1.APP_ID_RANDOM_PROVIDER, resolved_metadata_cache_1.ResolvedMetadataCache, new di_1.Provider(view_manager_1.AppViewManager, {useClass: view_manager_2.AppViewManager_}), view_resolver_1.ViewResolver, new di_1.Provider(change_detection_1.IterableDiffers, {useValue: change_detection_1.defaultIterableDiffers}), new di_1.Provider(change_detection_1.KeyValueDiffers, {useValue: change_detection_1.defaultKeyValueDiffers}), directive_resolver_1.DirectiveResolver, pipe_resolver_1.PipeResolver, new di_1.Provider(dynamic_component_loader_1.DynamicComponentLoader, {useClass: dynamic_component_loader_2.DynamicComponentLoader_})]);
