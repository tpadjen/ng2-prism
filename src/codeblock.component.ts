// Required in angular beta 6
///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
declare var require: any;


import {
  Component,
  AfterViewChecked,
  ElementRef,
  HostBinding,
  Input,
  ViewEncapsulation,
  Renderer,
  ViewChild
} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

let _ = require('underscore/underscore');
let Prism = require('prism/prism');

// import any language files that all components should recognize
require('prism/components/prism-bash');
require('prism/components/prism-powershell');
require('prism/components/prism-javascript');
Prism.languages.undefined = {};


// plugins
require('prism/plugins/line-numbers/prism-line-numbers');
require('prism/plugins/command-line/prism-command-line');
require('prism/plugins/normalize-whitespace/prism-normalize-whitespace');


@Component({
  selector: 'codeblock',
  template: `
    <div #contentEl class="content"><ng-content></ng-content></div>
    <div class="codeblock {{theme}}">
      <pre #preEl [class]="preClasses"
        [attr.data-prompt]="prompt"
        [attr.data-output]="output"
      ></pre>
    </div>
  `,

  // CSS injected in build step
  styles: [`{{CSS}}`],

  // necessary to make component styles apply because unique ng attributes
  // aren't applied to elements added by Prism.highlight
  encapsulation: ViewEncapsulation.None
})
export class CodeblockComponent implements AfterViewChecked {

  /** Inputs **/
  // @Input() language
  // @Input() src
  // @Input() lineNumbers
  // @Input() theme

  /** Data **/
  // content - the current content of this component
  // code    - the last version of content before highlighting

  /** Command line **/
  // @Input() shell:string;
  @Input() prompt: string = '$';
  @Input() output: string;

  /** Truncation **/
  @Input() truncationSize: number = 100000;
  @Input() truncationMessage: string = "\n--- File Truncated ---\n";

  /** ViewChildren **/
  @ViewChild('contentEl') contentEl; // holds and hides the unmodified content
  @ViewChild('preEl') _pre;          // holds the highlighted code

  /** Lifecycle Events **/

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    private _http: Http) { }

  // update code when content changes
  ngAfterContentChecked() {
    if (!this.src) { this.code = this.content; }
  }

  ngAfterViewChecked() {
    if (this._changed) {
      this._changed = false;
      this._replaceCode();
      this._highlight();
    }
  }


  /**
  * content
  *
  */
  get content(): string {
    return this.contentEl ? this.contentEl.nativeElement.innerHTML : '';
  }


  /**
  * code
  *
  */
  _code: string = ''; // the code from content before highlighting

  set code(code: string) {
    if (this._code !== code) {
      this._changed = true;
      this._code = code;
    }
  }

  get code(): string {
    return this._code;
  }


  /**
  * @Input() lineNumbers
  *
  */
  @Input() set lineNumbers(value: boolean) {
    if (this._lineNumbers !== value) {
      this._changed = true;
      this._lineNumbers = value;
    }
  }

  get lineNumbers(): boolean {
    return this._lineNumbers;
  }


  /**
  * @Input() language
  *
  */
  @Input() set language(lang: string) {
    if (this._shell) { return; }
    this._languageSet = lang && lang.length > 0 ? true : false;
    this._language = Prism.languages[lang] ? lang : undefined;
    this._changed = false;
  }

  get language() {
    return this._language;
  }


  /**
  * @Input() theme
  *
  */
  @Input() get theme(): string {
    if (this._theme) { return this._theme; }

    return this._shell ? this.DEFAULT_SHELL_THEME : this.DEFAULT_THEME;
  }

  set theme(theme: string) { this._theme = theme; }

  static THEMES = [
    "standard",
    "coy",
    "dark",
    "funky",
    "okaidia",
    "solarizedlight",
    "tomorrow",
    "twilight"
  ];

  DEFAULT_THEME       = "standard";
  DEFAULT_SHELL_THEME = "okaidia";


  /**
  * @Input() src
  *
  */
  _src: string;

  @Input() set src(source: string) {
    this._empty();

    if (source === undefined || source == null || source.length < 1) { return; }

    let extMatches = source.match(/\.(\w+)$/);

    if (!extMatches) {
      this._notFound(source);
      return;
    }

    this._src = source;

    let fileLanguage = CodeblockComponent.EXTENSION_MAP[extMatches[1]] || extMatches[1];

    this._fetchSource(source)
          .subscribe(
            text => {
              if (!this._languageSet) { this._language = fileLanguage; }
              this.code = text;
            },
            error => {
              this._notFound(source);
            });
  }

  _notFound(source) {
    this.code = source + " not found";
    this._language = undefined;
    this._lineNumbers = false;
  }

  get src(): string {
    return this._src;
  }

  static EXTENSION_MAP = {
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


  /**
  * @Input() shell
  *
  */
  @Input() set shell(shell: string) {
    if (shell) {
      this._language = shell;
      this._languageSet = true;
      this._shell = true;
      this.lineNumbers = false;
      this._changed = true;
    } else {
      this._shell = false;
    }
  }


  /** Styling classes **/

  get languageClass() {
    return 'language-' + this._language;
  }

  get lineNumbersClass(): string {
    return this._lineNumbers ? "line-numbers " : "";
  }

  get shellClass(): string {
    return this._shell ? "command-line" : "";
  }

  get codeClasses(): string {
    return this.languageClass + " " + this._language;
  }

  get preClasses(): string {
    return this.lineNumbersClass + ' ' + this.languageClass + ' ' + this.shellClass;
  }


  /************ Private **************/

  _language: string;
  _languageSet: boolean = false;
  _highlighted: boolean = false;
  _lineNumbers: boolean = true;
  _theme: string;
  _changed: boolean = false;
  _shell: boolean = false;


  /**
  * Select native elements
  */
  get _el() {
    return this._elementRef.nativeElement;
  }

  get _codeEl() {
    return this._el.querySelector('code');
  }


  _replaceCode() {
    this._renderer.setElementProperty(
      this._pre.nativeElement,
      'innerHTML',
      this._buildCodeElement()
    );
  }

  _buildCodeElement(): string {
    return `<code class="${this.codeClasses}">${this._processedCode}</code>`;
  }

  get _processedCode() {
    return this._isMarkup(this.language) ? _.escape(this.code) : this.code;
  }

  _isMarkup(language): boolean {
    return language === 'markup' || language === 'markdown';
  }

  _highlight() {
    // if (!this._highlighted && this._language === 'markup') {
    //   this._code.innerHTML = this._processMarkup(this._code.innerHTML);
    // }
    //
    // this._truncateLargeFiles();

    Prism.highlightElement(this._pre.nativeElement.querySelector('code'), false, null);

    this._highlighted = true;
  }

  _empty() {
    if (this._pre) {
      this._pre.innerHTML = "";
    }
  }

  // markup needs to have all opening < changed to &lt; to render correctly inside pre tags
  _processMarkup(text) {
    return text.replace(/(<)([!\/A-Za-z].*?>)/g, '&lt;$2');
  }

  _fetchSource(source): any {
    return this._http.get(source).map(res => res.text());
  }

  // padding is off on output shells because of floated left prompt
  // this adds it back
  _fixPromptOutputPadding() {
    let promptWidth = this._codeEl.querySelector('.command-line-prompt').clientWidth;
    let prePadding = parseInt(this._getStyle(this._pre, 'padding-left').replace('px', ''), 10);
    this._pre.style.paddingRight = (2 * prePadding + promptWidth / 2) + 'px';
  }

  // get the actually applied style of an element
  _getStyle(oElm, strCssRule) {
    let strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
      strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    } else if (oElm.currentStyle) {
      strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
        return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  }

  _truncateLargeFiles() {
    if (this._codeEl.innerHTML.length > this.truncationSize) {
      this._codeEl.innerHTML = this._codeEl.innerHTML.slice(0, this.truncationSize) +
                              "\n" + this.truncationMessage + "\n";
    }
  }

}
