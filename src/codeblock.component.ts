// Required in angular beta 6
///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
declare var require: any;


import {Component, ElementRef, Input, ViewEncapsulation} from 'angular2/core';

var Prism = require('prism/prism');

// import any language files that all components should recognize
require('prism/components/prism-bash');
require('prism/components/prism-javascript');

// plugins
require('prism/plugins/line-numbers/prism-line-numbers');
require('prism/plugins/normalize-whitespace/prism-normalize-whitespace');

@Component({
  selector: 'codeblock',
  template: `
    <div class="codeblock">
      <h2>{{language}}</h2>
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

  _language: string = 'bash';

  @Input() set language(lang: string) {
    this._language = lang || 'bash';
    this.highlight();
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

  constructor(private _elementRef: ElementRef) { }

  highlight() {
    this._setLanguageClasses();

    var elements = this.el.querySelectorAll(
      `code[class*="language-"],
      [class*="language-"] code,
      code[class*="lang-"],
      [class*="lang-"] code`);

    for (var i=0, element; element = elements[i++];) {
      Prism.highlightElement(element, false, null);
    }
  }

  _setLanguageClasses() {
    this.el.querySelector('pre').className = "line-numbers " + this.languageSelector;
    this.el.querySelector('code').className = this.languageSelector + " " + this._language;
  }

}
