// Required in angular beta 6
///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
declare var require: any;


import {
  Component,
  AfterViewChecked,
  ElementRef,
  HostBinding,
  Input,
  ViewEncapsulation
} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

var Prism = require('prism/prism');

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
    <div class="codeblock {{theme}}">
      <pre [class]="preClasses" 
        [attr.data-prompt]="prompt"
        [attr.data-output]="output"
      >
        <code [class]="codeClasses">
          <ng-content></ng-content>
        </code>
      </pre>
    </div>
  `,

  // CSS injected in build step
  styles: [`{{CSS}}`],

  // necessary to make component styles apply because unique ng attributes
  // aren't applied to elements added by Prism.highlight
  encapsulation: ViewEncapsulation.None
})
export class CodeblockComponent implements AfterViewChecked {

  // @Input() language
  // @Input() src
  // @Input() lineNumbers
  // @Input() theme
  
  // Command line
  // @Input() shell:string;
  @Input() prompt:string = '$';
  @Input() output:string;

  constructor(private _elementRef: ElementRef, private _http: Http) { }

  ngAfterViewChecked() {
    if (this._changed) {
      this._changed = false;
      this._highlight();
    }
  }


  /**
  * @Input() lineNumbers
  *
  */
  @Input() set lineNumbers(value:boolean) {
    if (this._lineNumbers != value) {
      this._changed = true;
      this._lineNumbers = value;
    }
  }

  get lineNumbers():boolean {
    return this._lineNumbers;
  }


  /**
  * @Input() language
  *
  */
  @Input() set language(lang:string) {
    if (this._shell) return;
    this._languageSet = lang && lang.length > 0 ? true : false;
    this._language = lang || 'bash';
    this._changed = true;
  }

  get language() {
    return this._language;
  }


  /**
  * @Input() theme
  *
  */
  @Input() get theme():string { 
    if (this._theme) return this._theme;

    return this._shell ? this.DEFAULT_SHELL_THEME : this.DEFAULT_THEME;
  }

  set theme(theme:string) { this._theme = theme; }
  
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
  @Input() set src(source:string) {
    this._empty();

    if (source == undefined || source == null || source.length < 1) return;

    let extMatches = source.match(/\.(\w+)$/);

    if (!extMatches) return;
    
    let lang = CodeblockComponent.EXTENSION_MAP[extMatches[1]] || extMatches[1];
    this._fetchSource(source, lang);
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
  @Input() set shell(shell:string) {
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


  /**
  * Styling classes
  */
  get languageClass() {
    return 'language-' + this._language;
  }

  get lineNumbersClass():string {
    return this._lineNumbers ? "line-numbers " : "";
  }

  get shellClass():string {
    return this._shell ? "command-line" : "";
  }

  get codeClasses():string {
    return this.languageClass + " " + this._language;
  }

  get preClasses():string {
    return this.lineNumbersClass + ' ' + this.languageClass + ' ' + this.shellClass;
  }


  /************ Private **************/

  _language:string;
  _languageSet:boolean = false;
  _highlighted:boolean = false;
  _lineNumbers:boolean = true;
  _theme:string;
  _changed:boolean = true;
  _shell:boolean = false;


  /**
  * Select native elements
  */
  get _el() {
    return this._elementRef.nativeElement;
  }

  get _code() {
    return this._el.querySelector('code');
  }

  get _pre() {
    return this._el.querySelector('pre');
  }
  


  _highlight() {
    if (!this._highlighted && this._language == 'markup') {
      this._code.innerHTML = this._processMarkup(this._code.innerHTML)
    }

    var elements = this._el.querySelectorAll(
      `code[class*="language-"],
      [class*="language-"] code,
      code[class*="lang-"],
      [class*="lang-"] code`);

    for (var i=0, element; element = elements[i++];) {
      Prism.highlightElement(element, false, null);
    }

    if (this._shell && this.output) { this._fixPromptOutputPadding(); }

    this._el.hidden = false;
    this._highlighted = true;
  }

  _empty() {
    this._code.innerHTML = "";
    this._el.hidden = true;
  }

  // markup needs to have all opening < changed to &lt; to render correctly inside pre tags
  _processMarkup(text) {
    return text.replace(/(<)([!\/A-Za-z].*?>)/g, '&lt;$2');
  }

  _fetchSource(source, fileLanguage) {
    this._http.get(source)
      .map(res => res.text())
      .subscribe(
        text => {
          if (!this._languageSet) this._language = fileLanguage;
          if (fileLanguage == 'markup') text = this._processMarkup(text);
          this._code.innerHTML = text;
          this._changed = true;
        },
        error => {
          // console.log("Error downloading " + source);
          // console.log(error);
          this._code.innerHTML = source + " not found";
          this._el.hidden = false;
        });
  }

  // padding is off on output shells because of floated left prompt
  // this adds it back
  _fixPromptOutputPadding() {
    let promptWidth = this._code.querySelector('.command-line-prompt').clientWidth;
    let prePadding = parseInt(this._getStyle(this._pre, 'padding-left').replace('px', ''));
    this._pre.style.paddingRight = (2*prePadding + promptWidth/2) + 'px';
  }

  // get the actually applied style of an element
  _getStyle(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
      strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
      strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
        return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  }

}