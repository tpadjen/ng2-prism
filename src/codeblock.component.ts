// Required in angular beta 6
///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
declare var require: any;


import {Component, ElementRef, Input, ViewEncapsulation} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

var Prism = require('prism/prism');

// import any language files that all components should recognize
require('prism/components/prism-bash');
require('prism/components/prism-javascript');

// plugins
require('prism/plugins/line-numbers/prism-line-numbers');
require('prism/plugins/normalize-whitespace/prism-normalize-whitespace');


var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

@Component({
  selector: 'codeblock',
  template: `
    <div class="codeblock">
      <pre>
        <code>
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
export class CodeblockComponent {

  _language: string;
  _languageSet: boolean = false;

  extensions = {
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

  constructor(private _elementRef: ElementRef, private _http: Http) { }

  _lineNumbers: boolean = true;

  @Input() set lineNumbers(value: any) {
    if (toType(value) == 'boolean') {
      this._lineNumbers = value;
    } else {
      this._lineNumbers = value == "true";
    }

    this.highlight(false);
  }

  get lineNumbers(): any {
    return this._lineNumbers + "";
  }

  @Input() set language(lang: string) {
    this._languageSet = lang && lang.length > 0 ? true : false;
    this._language = lang || 'bash';
    this.highlight(false);
  }

  @Input() set src(source: string) {
    this._empty();

    if (source == undefined || source == null || source.length < 1) return;

    let extMatches = source.match(/\.(\w+)$/);

    if (!extMatches) return;
    let fileLanguage = this.extensions[extMatches[1]] || extMatches[1];

    this._http.get(source)
      .map(res => res.text())
      .subscribe(
        text => {
          if (!this._languageSet) this._language = fileLanguage;
          if (fileLanguage == 'markup') text = this._processMarkup(text);
          this.code.innerHTML = text;
          this.highlight();
        },
        error => {
          // console.log("Error downloading " + source);
          // console.log(error);
          this.code.innerHTML = source + " not found";
          this.el.hidden = false;
        });
  }


  get language() {
    return this._language;
  }

  get languageSelector() {
    return 'language-' + this._language;
  }

  get el() {
    return this._elementRef.nativeElement;
  }

  get code() {
    return this.el.querySelector('code');
  }

  get pre() {
    return this.el.querySelector('pre');
  }

  ngOnInit() {
    if (!this._language) {
      this._language = "bash";
      this.highlight();
    }
  }

  // can't redo markup if already highlighted
  highlight(redoMarkup: boolean = true) {
    this._setLanguageClasses();

    if (redoMarkup && this._language == 'markup') {
      this.code.innerHTML = this._processMarkup(this.code.innerHTML)
    }

    var elements = this.el.querySelectorAll(
      `code[class*="language-"],
      [class*="language-"] code,
      code[class*="lang-"],
      [class*="lang-"] code`);

    for (var i=0, element; element = elements[i++];) {
      Prism.highlightElement(element, false, null);
    }

    this.el.hidden = false;
  }

  _setLanguageClasses() {
    let ln = this._lineNumbers ? "line-numbers " : "";
    this.pre.className = ln + this.languageSelector;
    this.code.className = this.languageSelector + " " + this._language;
  }

  _empty() {
    this.code.innerHTML = "";
    this.el.hidden = true;
  }

  // markup needs to have all opening < changed to &lt; to render correctly inside pre tags
  _processMarkup(text) {
    return text.replace(/(<)([!\/A-Za-z].*?>)/g, '&lt;$2');
  }

}