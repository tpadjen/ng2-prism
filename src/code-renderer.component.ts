declare var require: any;

import {
  Component,
  Input,
  Renderer,
  ViewChild
} from 'angular2/core';

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

const TEMPLATE_REGEX = /<!--template\sbindings={[^\}]*}-->/g;


@Component({
  selector: 'code-renderer',
  template: `
    <pre #preEl [class]="preClasses"
      [attr.data-prompt]="prompt"
      [attr.data-output]="outputLines"
    ></pre>
  `
})
export class CodeRenderer {

  @Input() code: string;
  @Input() language: string;
  @Input() lineNumbers: boolean;

  @ViewChild('preEl') _pre;

  @Input() shell: string;
  @Input() prompt: string;
  @Input() outputLines: string;

  constructor(
    private _renderer: Renderer) { }

  render() {
    this._replaceCode();
    this._highlight();
  }

  empty() {
    if (this._pre) { this._pre.innerHTML = ""; }
  }

  _replaceCode() {
    this._renderer.setElementProperty(
      this._pre.nativeElement,
      'innerHTML',
      this._buildCodeElement()
    );
  }

  _highlight() {
    // this._truncateLargeFiles();
    Prism.highlightElement(this._pre.nativeElement.querySelector('code'), false, null);
  }

  get _processedCode() {
    return this._isMarkup(this.language) ? this._processMarkup(this.code) : this.code;
  }

  _processMarkup(text) {
    return this._replaceTags(this._removeAngularMarkup(text));
  }

  // markup needs to have all opening < changed to &lt; to render correctly inside pre tags
  _replaceTags(text) {
    return text.replace(/(<)([!\/A-Za-z].*?>)/g, '&lt;$2');
  }

  _removeAngularMarkup(html) {
    // remove styling attributes (_ngcontent etc.)
    html = html.replace(/\s_ng[^-]+-[^-]+-[^=]+="[^"]*"/g, '');

    let lines = this._fixIndentation(html);

    // remove empty <!--template--> lines
    lines = lines.filter(line => {
      if (line.trim() === '') { return true; }
      let replaced = line.replace(TEMPLATE_REGEX, '').trim();
      return replaced !== '';
    });

    html = lines.join("\n");

    // remove <!--template--> tags on lines with code
    return html.replace(TEMPLATE_REGEX, '');
  }

  _isMarkup(language): boolean {
    return language === 'markup' || language === 'markdown';
  }

  _buildCodeElement(): string {
    return `<code class="${this.codeClasses}">${this._processedCode}</code>`;
  }

  /** Styling classes **/

  get languageClass() {
    return 'language-' + this.language;
  }

  get lineNumbersClass(): string {
    return this.lineNumbers ? "line-numbers " : "";
  }

  get shellClass(): string {
    return this.shell ? "command-line" : "";
  }

  get codeClasses(): string {
    return this.languageClass + " " + this.language;
  }

  get preClasses(): string {
    return this.lineNumbersClass + ' ' + this.languageClass + ' ' + this.shellClass;
  }


  /** Code Styling **/

  get _codeEl() {
    return this._pre.querySelector('code');
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

  // _truncateLargeFiles() {
  //   if (this._codeEl.innerHTML.length > this.truncationSize) {
  //     this._codeEl.innerHTML = this._codeEl.innerHTML.slice(0, this.truncationSize) +
  //                             "\n" + this.truncationMessage + "\n";
  //   }
  // }

  // remove extra indentation in ngSwitches
  _fixIndentation(html: string) {
    let indent = 0;
    let diff = 0;
    let removeLines = [];
    let lines = html.split("\n").map((line, index) => {
      if (line.trim() === '') { // empty line
        if (indent > 0) { removeLines.push(index); }
        indent = 0;
        return '';
      }
      let a = line.replace(TEMPLATE_REGEX, '').trim();
      if (a === '') { // template line
        indent = line.match(/^\s*/)[0].length;
        return line;
      } else if (indent > 0) { // lines after template need fixing
        length = line.match(/^\s*/)[0].length;
        if (diff === 0) { // find the amount to fix indentation
          diff = length - indent;
        }
        if (length >= indent) { // fix it
          return line.slice(diff);
        } else { // stop indenting
          indent = 0;
        }
      }
      return line;
    });

    // remove empty lines added by ngSwitch
    removeLines.forEach(removalIndex => {
      lines.splice(removalIndex, 1);
    });

    return lines;
  }

}
