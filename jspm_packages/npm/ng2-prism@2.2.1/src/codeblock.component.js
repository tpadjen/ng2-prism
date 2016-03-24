/* */ 
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
var core_1 = require('angular2/core');
require('prismjs/prism');
var code_renderer_component_1 = require('./code-renderer.component');
var src_service_1 = require('./src.service');
var CodeblockComponent = (function() {
  function CodeblockComponent(_elementRef, _srcService) {
    this._elementRef = _elementRef;
    this._srcService = _srcService;
    this.DEFAULT_THEME = "standard";
    this.DEFAULT_SHELL_THEME = "okaidia";
    this.prompt = '$';
    this.srcChanged = new core_1.EventEmitter();
    this._code = '';
    this._showingMessage = false;
    this._languageSet = false;
    this._lineNumbers = true;
    this._changed = false;
    this._shellType = null;
    _srcService.host = this;
  }
  CodeblockComponent.prototype.ngAfterContentChecked = function() {
    if (!this.src) {
      this.code = this.content;
    }
  };
  CodeblockComponent.prototype.ngAfterViewChecked = function() {
    if (this._changed) {
      this._changed = false;
      this.codeRenderer.render();
    }
  };
  Object.defineProperty(CodeblockComponent.prototype, "content", {
    get: function() {
      return this.contentEl ? this.contentEl.nativeElement.innerHTML : '';
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CodeblockComponent.prototype, "code", {
    get: function() {
      return this._code;
    },
    set: function(code) {
      if (this._code !== code) {
        this._changed = true;
        this._showingMessage = false;
        this._code = code;
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CodeblockComponent.prototype, "lineNumbers", {
    get: function() {
      return this._lineNumbers;
    },
    set: function(value) {
      if (this._lineNumbers !== value) {
        this._changed = true;
        this._lineNumbers = value;
      }
    },
    enumerable: true,
    configurable: true
  });
  CodeblockComponent.prototype.shouldDisplayLineNumbers = function() {
    return this.lineNumbers && !this._showingMessage;
  };
  Object.defineProperty(CodeblockComponent.prototype, "language", {
    get: function() {
      return this._showingMessage ? undefined : this._language;
    },
    set: function(lang) {
      if (this.isShell()) {
        return;
      }
      this._languageSet = lang && lang.length > 0 ? true : false;
      this._language = Prism.languages[lang] ? lang : undefined;
      this._changed = true;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CodeblockComponent.prototype, "theme", {
    get: function() {
      if (this._theme) {
        return this._theme;
      }
      return this.isShell() ? this.DEFAULT_SHELL_THEME : this.DEFAULT_THEME;
    },
    set: function(theme) {
      this._theme = theme;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CodeblockComponent.prototype, "src", {
    get: function() {
      return this._src;
    },
    set: function(source) {
      this.srcChanged.next(source);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CodeblockComponent.prototype, "debounceTime", {
    set: function(time) {
      var parsed = parseInt(time, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        this._srcService.debounceTime = parsed;
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CodeblockComponent.prototype, "shell", {
    get: function() {
      return this._shellType;
    },
    set: function(shellType) {
      if (shellType && CodeblockComponent.SHELL_TYPES.indexOf(shellType) !== -1) {
        this._language = shellType;
        this._languageSet = true;
        this._shellType = shellType;
        this.lineNumbers = false;
        this._changed = true;
      } else {
        this._shellType = null;
      }
    },
    enumerable: true,
    configurable: true
  });
  CodeblockComponent.prototype.isShell = function() {
    return this._shellType !== null;
  };
  Object.defineProperty(CodeblockComponent.prototype, "output", {
    set: function(lines) {
      console.warn("DEPRECATION WARNING: The CodeblockComponent Input property 'output'" + " is no longer supported and will be removed in a future release. Use 'outputLines'");
      this.outputLines = lines;
    },
    enumerable: true,
    configurable: true
  });
  CodeblockComponent.prototype.message = function(text) {
    this._showingMessage = true;
    this.code = text;
  };
  CodeblockComponent.prototype.loading = function() {
    this.message("Loading...");
  };
  CodeblockComponent.prototype.bind = function(text) {
    return "{{" + text + "}}";
  };
  CodeblockComponent.THEMES = ["standard", "coy", "dark", "funky", "okaidia", "solarizedlight", "tomorrow", "twilight"];
  CodeblockComponent.EXTENSION_MAP = {
    'js': 'javascript',
    'ts': 'typescript',
    'html': 'markup',
    'svg': 'markup',
    'xml': 'markup',
    'md': 'markdown',
    'py': 'python',
    'rb': 'ruby',
    'ps1': 'powershell',
    'psm1': 'powershell'
  };
  CodeblockComponent.SHELL_TYPES = ['bash', 'powershell'];
  __decorate([core_1.ViewChild('contentEl'), __metadata('design:type', Object)], CodeblockComponent.prototype, "contentEl", void 0);
  __decorate([core_1.ViewChild(code_renderer_component_1.CodeRenderer), __metadata('design:type', Object)], CodeblockComponent.prototype, "codeRenderer", void 0);
  __decorate([core_1.Input(), __metadata('design:type', Boolean), __metadata('design:paramtypes', [Boolean])], CodeblockComponent.prototype, "lineNumbers", null);
  __decorate([core_1.Input(), __metadata('design:type', String), __metadata('design:paramtypes', [String])], CodeblockComponent.prototype, "language", null);
  __decorate([core_1.Input(), __metadata('design:type', String), __metadata('design:paramtypes', [String])], CodeblockComponent.prototype, "theme", null);
  __decorate([core_1.Input(), __metadata('design:type', String), __metadata('design:paramtypes', [String])], CodeblockComponent.prototype, "src", null);
  __decorate([core_1.Input(), __metadata('design:type', Object), __metadata('design:paramtypes', [Object])], CodeblockComponent.prototype, "debounceTime", null);
  __decorate([core_1.Input(), __metadata('design:type', String), __metadata('design:paramtypes', [String])], CodeblockComponent.prototype, "shell", null);
  __decorate([core_1.Input(), __metadata('design:type', String)], CodeblockComponent.prototype, "prompt", void 0);
  __decorate([core_1.Input(), __metadata('design:type', String)], CodeblockComponent.prototype, "outputLines", void 0);
  __decorate([core_1.Input(), __metadata('design:type', String), __metadata('design:paramtypes', [String])], CodeblockComponent.prototype, "output", null);
  __decorate([core_1.Output(), __metadata('design:type', core_1.EventEmitter)], CodeblockComponent.prototype, "srcChanged", void 0);
  CodeblockComponent = __decorate([core_1.Component({
    selector: 'codeblock',
    template: "\n    <div #contentEl class=\"codeblock-content\"><ng-content></ng-content></div>\n    <div class=\"codeblock {{theme}}\">\n      <code-renderer\n        [code]=\"code\"\n        [language]=\"language\"\n        [lineNumbers]=\"shouldDisplayLineNumbers()\"\n        [shell]=\"shell\"\n        [prompt]=\"prompt\"\n        [outputLines]=\"outputLines\">\n      </code-renderer>\n    </div>\n  ",
    styles: ["code[class*=\"language-\"],pre[class*=\"language-\"]{color:black;background:none;text-shadow:0 1px white;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=\"language-\"]::-moz-selection,pre[class*=\"language-\"] ::-moz-selection,code[class*=\"language-\"]::-moz-selection,code[class*=\"language-\"] ::-moz-selection{text-shadow:none;background:#b3d4fc}pre[class*=\"language-\"]::selection,pre[class*=\"language-\"] ::selection,code[class*=\"language-\"]::selection,code[class*=\"language-\"] ::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=\"language-\"],pre[class*=\"language-\"]{text-shadow:none}}pre[class*=\"language-\"]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=\"language-\"],pre[class*=\"language-\"]{background:#f5f2f0}:not(pre)>code[class*=\"language-\"]{padding:.1em;border-radius:.3em;white-space:normal}.token.comment,.token.prolog,.token.doctype,.token.cdata{color:slategray}.token.punctuation{color:#999}.namespace{opacity:.7}.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol,.token.deleted{color:#905}.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.inserted{color:#690}.token.operator,.token.entity,.token.url,.language-css .token.string,.style .token.string{color:#a67f59;background:rgba(255,255,255,0.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.function{color:#DD4A68}.token.regex,.token.important,.token.variable{color:#e90}.token.important,.token.bold{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}.coy code[class*=\"language-\"],.coy pre[class*=\"language-\"]{color:black;background:none;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}.coy pre[class*=\"language-\"]{position:relative;margin:.5em 0;-webkit-box-shadow:-1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf;-moz-box-shadow:-1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf;box-shadow:-1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf;border-left:10px solid #358ccb;background-color:#fdfdfd;background-image:-webkit-linear-gradient(transparent 50%, rgba(69,142,209,0.04) 50%);background-image:-moz-linear-gradient(transparent 50%, rgba(69,142,209,0.04) 50%);background-image:-ms-linear-gradient(transparent 50%, rgba(69,142,209,0.04) 50%);background-image:-o-linear-gradient(transparent 50%, rgba(69,142,209,0.04) 50%);background-image:linear-gradient(transparent 50%, rgba(69,142,209,0.04) 50%);background-size:3em 3em;background-origin:content-box;overflow:visible;padding:0}.coy code[class*=\"language\"]{max-height:inherit;height:100%;padding:0 1em;display:block;overflow:auto}.coy :not(pre)>code[class*=\"language-\"],.coy pre[class*=\"language-\"]{background-color:#fdfdfd;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin-bottom:1em}.coy :not(pre)>code[class*=\"language-\"]{position:relative;padding:.2em;-webkit-border-radius:0.3em;-moz-border-radius:0.3em;-ms-border-radius:0.3em;-o-border-radius:0.3em;border-radius:0.3em;color:#c92c2c;border:1px solid rgba(0,0,0,0.1);display:inline;white-space:normal}.coy pre[class*=\"language-\"]:before,.coy pre[class*=\"language-\"]:after{content:'';z-index:-2;display:block;position:absolute;bottom:0.75em;left:0.18em;width:40%;height:20%;max-height:13em;-webkit-box-shadow:0px 13px 8px #979797;-moz-box-shadow:0px 13px 8px #979797;box-shadow:0px 13px 8px #979797;-webkit-transform:rotate(-2deg);-moz-transform:rotate(-2deg);-ms-transform:rotate(-2deg);-o-transform:rotate(-2deg);transform:rotate(-2deg)}.coy :not(pre)>code[class*=\"language-\"]:after,.coy pre[class*=\"language-\"]:after{right:0.75em;left:auto;-webkit-transform:rotate(2deg);-moz-transform:rotate(2deg);-ms-transform:rotate(2deg);-o-transform:rotate(2deg);transform:rotate(2deg)}.coy .token.comment,.coy .token.block-comment,.coy .token.prolog,.coy .token.doctype,.coy .token.cdata{color:#7D8B99}.coy .token.punctuation{color:#5F6364}.coy .token.property,.coy .token.tag,.coy .token.boolean,.coy .token.number,.coy .token.function-name,.coy .token.constant,.coy .token.symbol,.coy .token.deleted{color:#c92c2c}.coy .token.selector,.coy .token.attr-name,.coy .token.string,.coy .token.char,.coy .token.function,.coy .token.builtin,.coy .token.inserted{color:#2f9c0a}.coy .token.operator,.coy .token.entity,.coy .token.url,.coy .token.variable{color:#a67f59;background:rgba(255,255,255,0.5)}.coy .token.atrule,.coy .token.attr-value,.coy .token.keyword,.coy .token.class-name{color:#1990b8}.coy .token.regex,.coy .token.important{color:#e90}.coy .language-css .token.string,.coy .style .token.string{color:#a67f59;background:rgba(255,255,255,0.5)}.coy .token.important{font-weight:normal}.coy .token.bold{font-weight:bold}.coy .token.italic{font-style:italic}.coy .token.entity{cursor:help}.coy .namespace{opacity:.7}@media screen and (max-width: 767px){.coy pre[class*=\"language-\"]:before,.coy pre[class*=\"language-\"]:after{bottom:14px;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}}.coy .token.tab:not(:empty):before,.coy .token.cr:before,.coy .token.lf:before{color:#e0d7d1}.coy pre[class*=\"language-\"].line-numbers{padding-left:0}.coy pre[class*=\"language-\"].line-numbers code{padding-left:3.8em}.coy pre[class*=\"language-\"].line-numbers .line-numbers-rows{left:0}.coy pre[class*=\"language-\"][data-line]{padding-top:0;padding-bottom:0;padding-left:0}.coy pre[data-line] code{position:relative;padding-left:4em}.coy pre .line-highlight{margin-top:0}.dark code[class*=\"language-\"],.dark pre[class*=\"language-\"]{color:white;background:none;text-shadow:0 -.1em .2em black;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}@media print{.dark code[class*=\"language-\"],.dark pre[class*=\"language-\"]{text-shadow:none}}.dark pre[class*=\"language-\"],.dark :not(pre)>code[class*=\"language-\"]{background:#4d4033}.dark pre[class*=\"language-\"]{padding:1em;margin:.5em 0;overflow:auto;border:0.3em solid #7a6652;border-radius:.5em;box-shadow:1px 1px .5em black inset}.dark :not(pre)>code[class*=\"language-\"]{padding:.15em .2em .05em;border-radius:.3em;border:0.13em solid #7a6652;box-shadow:1px 1px .3em -.1em black inset;white-space:normal}.dark .token.comment,.dark .token.prolog,.dark .token.doctype,.dark .token.cdata{color:#998066}.dark .token.punctuation{opacity:.7}.dark .namespace{opacity:.7}.dark .token.property,.dark .token.tag,.dark .token.boolean,.dark .token.number,.dark .token.constant,.dark .token.symbol{color:#d1949e}.dark .token.selector,.dark .token.attr-name,.dark .token.string,.dark .token.char,.dark .token.builtin,.dark .token.inserted{color:#bde052}.dark .token.operator,.dark .token.entity,.dark .token.url,.dark .language-css .token.string,.dark .style .token.string,.dark .token.variable{color:#f5b83d}.dark .token.atrule,.dark .token.attr-value,.dark .token.keyword{color:#d1949e}.dark .token.regex,.dark .token.important{color:#e90}.dark .token.important,.dark .token.bold{font-weight:bold}.dark .token.italic{font-style:italic}.dark .token.entity{cursor:help}.dark .token.deleted{color:red}.funky code[class*=\"language-\"],.funky pre[class*=\"language-\"]{font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}.funky pre[class*=\"language-\"]{padding:.4em .8em;margin:.5em 0;overflow:auto;background:url('data:image/svg+xml;charset=utf-8,<svg%20version%3D\"1.1\"%20xmlns%3D\"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\"%20width%3D\"100\"%20height%3D\"100\"%20fill%3D\"rgba(0%2C0%2C0%2C.2)\">%0D%0A<polygon%20points%3D\"0%2C50%2050%2C0%200%2C0\"%20%2F>%0D%0A<polygon%20points%3D\"0%2C100%2050%2C100%20100%2C50%20100%2C0\"%20%2F>%0D%0A<%2Fsvg>');background-size:1em 1em}.funky code[class*=\"language-\"]{background:black;color:white;box-shadow:-.3em 0 0 .3em black, .3em 0 0 .3em black}.funky :not(pre)>code[class*=\"language-\"]{padding:.2em;border-radius:.3em;box-shadow:none;white-space:normal}.funky .token.comment,.funky .token.prolog,.funky .token.doctype,.funky .token.cdata{color:#aaa}.funky .token.punctuation{color:#999}.funky .namespace{opacity:.7}.funky .token.property,.funky .token.tag,.funky .token.boolean,.funky .token.number,.funky .token.constant,.funky .token.symbol{color:#0cf}.funky .token.selector,.funky .token.attr-name,.funky .token.string,.funky .token.char,.funky .token.builtin{color:yellow}.funky .token.operator,.funky .token.entity,.funky .token.url,.funky .language-css .token.string,.funky .toke.variable,.funky .token.inserted{color:yellowgreen}.funky .token.atrule,.funky .token.attr-value,.funky .token.keyword{color:deeppink}.funky .token.regex,.funky .token.important{color:orange}.funky .token.important,.funky .token.bold{font-weight:bold}.funky .token.italic{font-style:italic}.funky .token.entity{cursor:help}.funky .token.deleted{color:red}.okaidia code[class*=\"language-\"],.okaidia pre[class*=\"language-\"]{color:#f8f8f2;background:none;text-shadow:0 1px rgba(0,0,0,0.3);font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}.okaidia pre[class*=\"language-\"]{padding:1em;margin:.5em 0;overflow:auto;border-radius:0.3em}.okaidia :not(pre)>code[class*=\"language-\"],.okaidia pre[class*=\"language-\"]{background:#272822}.okaidia :not(pre)>code[class*=\"language-\"]{padding:.1em;border-radius:.3em;white-space:normal}.okaidia .token.comment,.okaidia .token.prolog,.okaidia .token.doctype,.okaidia .token.cdata{color:slategray}.okaidia .token.punctuation{color:#f8f8f2}.okaidia .namespace{opacity:.7}.okaidia .token.property,.okaidia .token.tag,.okaidia .token.constant,.okaidia .token.symbol,.okaidia .token.deleted{color:#f92672}.okaidia .token.boolean,.okaidia .token.number{color:#ae81ff}.okaidia .token.selector,.okaidia .token.attr-name,.okaidia .token.string,.okaidia .token.char,.okaidia .token.builtin,.okaidia .token.inserted{color:#a6e22e}.okaidia .token.operator,.okaidia .token.entity,.okaidia .token.url,.okaidia .language-css .token.string,.okaidia .style .token.string,.okaidia .token.variable{color:#f8f8f2}.okaidia .token.atrule,.okaidia .token.attr-value,.okaidia .token.function{color:#e6db74}.okaidia .token.keyword{color:#66d9ef}.okaidia .token.regex,.okaidia .token.important{color:#fd971f}.okaidia .token.important,.okaidia .token.bold{font-weight:bold}.okaidia .token.italic{font-style:italic}.okaidia .token.entity{cursor:help}.solarizedlight code[class*=\"language-\"],.solarizedlight pre[class*=\"language-\"]{color:#657b83;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}.solarizedlight pre[class*=\"language-\"]::-moz-selection,.solarizedlight pre[class*=\"language-\"] ::-moz-selection,.solarizedlight code[class*=\"language-\"]::-moz-selection,.solarizedlight code[class*=\"language-\"] ::-moz-selection{background:#073642}.solarizedlight pre[class*=\"language-\"]::selection,.solarizedlight pre[class*=\"language-\"] ::selection,.solarizedlight code[class*=\"language-\"]::selection,.solarizedlight code[class*=\"language-\"] ::selection{background:#073642}.solarizedlight pre[class*=\"language-\"]{padding:1em;margin:.5em 0;overflow:auto;border-radius:0.3em}.solarizedlight :not(pre)>code[class*=\"language-\"],.solarizedlight pre[class*=\"language-\"]{background-color:#fdf6e3}.solarizedlight :not(pre)>code[class*=\"language-\"]{padding:.1em;border-radius:.3em}.solarizedlight .token.comment,.solarizedlight .token.prolog,.solarizedlight .token.doctype,.solarizedlight .token.cdata{color:#93a1a1}.solarizedlight .token.punctuation{color:#586e75}.solarizedlight .namespace{opacity:.7}.solarizedlight .token.property,.solarizedlight .token.tag,.solarizedlight .token.boolean,.solarizedlight .token.number,.solarizedlight .token.constant,.solarizedlight .token.symbol,.solarizedlight .token.deleted{color:#268bd2}.solarizedlight .token.selector,.solarizedlight .token.attr-name,.solarizedlight .token.string,.solarizedlight .token.char,.solarizedlight .token.builtin,.solarizedlight .token.url,.solarizedlight .token.inserted{color:#2aa198}.solarizedlight .token.entity{color:#657b83;background:#eee8d5}.solarizedlight .token.atrule,.solarizedlight .token.attr-value,.solarizedlight .token.keyword{color:#859900}.solarizedlight .token.function{color:#b58900}.solarizedlight .token.regex,.solarizedlight .token.important,.solarizedlight .token.variable{color:#cb4b16}.solarizedlight .token.important,.solarizedlight .token.bold{font-weight:bold}.solarizedlight .token.italic{font-style:italic}.solarizedlight .token.entity{cursor:help}.tomorrow code[class*=\"language-\"],.tomorrow pre[class*=\"language-\"]{color:#ccc;background:none;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}.tomorrow pre[class*=\"language-\"]{padding:1em;margin:.5em 0;overflow:auto}.tomorrow :not(pre)>code[class*=\"language-\"],.tomorrow pre[class*=\"language-\"]{background:#2d2d2d}.tomorrow :not(pre)>code[class*=\"language-\"]{padding:.1em;border-radius:.3em;white-space:normal}.tomorrow .token.comment,.tomorrow .token.block-comment,.tomorrow .token.prolog,.tomorrow .token.doctype,.tomorrow .token.cdata{color:#999}.tomorrow .token.punctuation{color:#ccc}.tomorrow .token.tag,.tomorrow .token.attr-name,.tomorrow .token.namespace,.tomorrow .token.deleted{color:#e2777a}.tomorrow .token.function-name{color:#6196cc}.tomorrow .token.boolean,.tomorrow .token.number,.tomorrow .token.function{color:#f08d49}.tomorrow .token.property,.tomorrow .token.class-name,.tomorrow .token.constant,.tomorrow .token.symbol{color:#f8c555}.tomorrow .token.selector,.tomorrow .token.important,.tomorrow .token.atrule,.tomorrow .token.keyword,.tomorrow .token.builtin{color:#cc99cd}.tomorrow .token.string,.tomorrow .token.char,.tomorrow .token.attr-value,.tomorrow .token.regex,.tomorrow .token.variable{color:#7ec699}.tomorrow .token.operator,.tomorrow .token.entity,.tomorrow .token.url{color:#67cdcc}.tomorrow .token.important,.tomorrow .token.bold{font-weight:bold}.tomorrow .token.italic{font-style:italic}.tomorrow .token.entity{cursor:help}.tomorrow .token.inserted{color:green}.twilight code[class*=\"language-\"],.twilight pre[class*=\"language-\"]{color:white;background:none;direction:ltr;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;text-align:left;text-shadow:0 -.1em .2em black;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}.twilight pre[class*=\"language-\"],.twilight :not(pre)>code[class*=\"language-\"]{background:#141414}.twilight pre[class*=\"language-\"]{border-radius:.5em;border:0.3em solid #545454;box-shadow:1px 1px .5em black inset;margin:.5em 0;overflow:auto;padding:1em}.twilight pre[class*=\"language-\"]::-moz-selection{background:#27292a}.twilight pre[class*=\"language-\"]::selection{background:#27292a}.twilight pre[class*=\"language-\"]::-moz-selection,.twilight pre[class*=\"language-\"] ::-moz-selection,.twilight code[class*=\"language-\"]::-moz-selection,.twilight code[class*=\"language-\"] ::-moz-selection{text-shadow:none;background:rgba(237,237,237,0.15)}.twilight pre[class*=\"language-\"]::selection,.twilight pre[class*=\"language-\"] ::selection,.twilight code[class*=\"language-\"]::selection,.twilight code[class*=\"language-\"] ::selection{text-shadow:none;background:rgba(237,237,237,0.15)}.twilight :not(pre)>code[class*=\"language-\"]{border-radius:.3em;border:0.13em solid #545454;box-shadow:1px 1px .3em -.1em black inset;padding:.15em .2em .05em;white-space:normal}.twilight .token.comment,.twilight .token.prolog,.twilight .token.doctype,.twilight .token.cdata{color:#787878}.twilight .token.punctuation{opacity:.7}.twilight .namespace{opacity:.7}.twilight .token.tag,.twilight .token.boolean,.twilight .token.number,.twilight .token.deleted{color:#cf694a}.twilight .token.keyword,.twilight .token.property,.twilight .token.selector,.twilight .token.constant,.twilight .token.symbol,.twilight .token.builtin{color:#f9ee9a}.twilight .token.attr-name,.twilight .token.attr-value,.twilight .token.string,.twilight .token.char,.twilight .token.operator,.twilight .token.entity,.twilight .token.url,.twilight .language-css .token.string,.twilight .style .token.string,.twilight .token.variable,.twilight .token.inserted{color:#919e6b}.twilight .token.atrule{color:#7386a5}.twilight .token.regex,.twilight .token.important{color:#e9c163}.twilight .token.important,.twilight .token.bold{font-weight:bold}.twilight .token.italic{font-style:italic}.twilight .token.entity{cursor:help}.twilight pre[data-line]{padding:1em 0 1em 3em;position:relative}.twilight .language-markup .token.tag,.twilight .language-markup .token.attr-name,.twilight .language-markup .token.punctuation{color:#ad895c}.twilight .token{position:relative;z-index:1}.twilight .line-highlight{background:-moz-linear-gradient(left, rgba(84,84,84,0.1) 70%, rgba(84,84,84,0));background:-o-linear-gradient(left, rgba(84,84,84,0.1) 70%, rgba(84,84,84,0));background:-webkit-linear-gradient(left, rgba(84,84,84,0.1) 70%, rgba(84,84,84,0));background:rgba(84,84,84,0.25);background:linear-gradient(left, rgba(84,84,84,0.1) 70%, rgba(84,84,84,0));border-bottom:1px dashed #545454;border-top:1px dashed #545454;left:0;line-height:inherit;margin-top:0.75em;padding:inherit 0;pointer-events:none;position:absolute;right:0;white-space:pre;z-index:0}.twilight .line-highlight:before,.twilight .line-highlight[data-end]:after{background-color:#8794a6;border-radius:999px;box-shadow:0 1px white;color:#f5f2f0;content:attr(data-start);font:bold 65%/1.5 sans-serif;left:.6em;min-width:1em;padding:0 .5em;position:absolute;text-align:center;text-shadow:none;top:.4em;vertical-align:.3em}.twilight .line-highlight[data-end]:after{bottom:.4em;content:attr(data-end);top:auto}pre.line-numbers{position:relative;padding-left:3.8em;counter-reset:linenumber}pre.line-numbers>code{position:relative}.line-numbers .line-numbers-rows{position:absolute;pointer-events:none;top:0;font-size:100%;left:-3.8em;width:3em;letter-spacing:-1px;border-right:1px solid #999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.line-numbers-rows>span{pointer-events:none;display:block;counter-increment:linenumber}.line-numbers-rows>span:before{content:counter(linenumber);color:#999;display:block;padding-right:0.8em;text-align:right}.codeblock pre.line-numbers{padding-left:3.4em}.codeblock pre.line-numbers .line-numbers-rows{border:0;left:-3.4em}.command-line-prompt{border-right:1px solid #999;display:block;float:left;font-size:100%;letter-spacing:-1px;margin-right:1em;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.command-line-prompt>span:before{color:#999;content:' ';display:block;padding-right:0.8em}.command-line-prompt>span[data-user]:before{content:\"[\" attr(data-user) \"@\" attr(data-host) \"] $\"}.command-line-prompt>span[data-user=\"root\"]:before{content:\"[\" attr(data-user) \"@\" attr(data-host) \"] #\"}.command-line-prompt>span[data-prompt]:before{content:attr(data-prompt)}.codeblock pre.command-line .command-line-prompt{border-right:0;margin-right:0}.codeblock-content{display:none}"],
    encapsulation: core_1.ViewEncapsulation.None,
    directives: [code_renderer_component_1.CodeRenderer],
    providers: [src_service_1.SrcService]
  }), __metadata('design:paramtypes', [core_1.ElementRef, src_service_1.SrcService])], CodeblockComponent);
  return CodeblockComponent;
})();
exports.CodeblockComponent = CodeblockComponent;
