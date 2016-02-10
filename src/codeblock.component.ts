import {Component, ElementRef, Input, ViewEncapsulation} from 'angular2/core';

import Prism from 'prism';

// import any language files that all components should recognize
import 'prism/components/prism-bash';
import 'prism/components/prism-javascript';

// plugins
import 'prism/plugins/line-numbers/prism-line-numbers';
import 'prism/plugins/normalize-whitespace/prism-normalize-whitespace';

// css
import 'prism/themes/prism-okaidia.css!';
import 'prism/plugins/line-numbers/prism-line-numbers.css!';

@Component({
  selector: 'codeblock',
  template: `
    <h2>{{language}}</h2>
    <pre>
      <code>
        <ng-content></ng-content>
      </code>
    </pre>
  `,

  // remove the line-numbers right border
  styles: [`
    pre.line-numbers {
      padding-left: 3.4em;
    }

    pre.line-numbers .line-numbers-rows {
      left: -3.4em;
      border: none;
    }
  `],

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
