import { Component, Input, Renderer, ViewChild } from '@angular/core';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-javascript';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/command-line/prism-command-line';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';

/**
 * Represent template tags added by angular structural directives
 */
const TEMPLATE_REGEX = /<!--template\sbindings={[^\}]*}-->/g;

/**
 * Code highlighting component
 *
 * Used internally by a codeblock to perform the actual highlighting.
 */
@Component({
  selector: 'code-renderer',
  template: `
<pre #preEl [class]="preClasses" [attr.data-prompt]="prompt" [attr.data-output]="outputLines"></pre>
  `
})
export class CodeRendererComponent {

  /**
   * The code to highlight
   */
  @Input() public code: string;

  /**
   * The language to use when highlighting the code.
   */
  @Input() public language: string;

  /**
   * Whether or not to display line numbers.
   */
  @Input() public lineNumbers: boolean;

  /**
   * Display a prompt in the codeblock. Set to 'bash' or 'powershell'.
   */
  @Input() public shell: string;

  /**
   * The prompt to use when displaying as a shell.
   */
  @Input() public prompt: string;

  /**
   * A comma separated list of lines or groups of lines to treat as output
   * in a shell display.
   */
  @Input() public outputLines: string;

  /**
   * The template <pre> that will contain the code.
   */
  @ViewChild('preEl') private _pre: any;

  private _renderer: Renderer;

  public constructor(_renderer: Renderer) {
    this._renderer = _renderer;
  }

  public render(): void {
    this._replaceCode();
    this._highlight();
  }

  /**
   * Clear the code.
   */
  public empty(): void {
    if (this._pre) {
      this._pre.nativeElement.innerHTML = '';
    }
  }

  /**
   * Place the new code element in the template
   */
  private _replaceCode():void {
    this._renderer.setElementProperty(
      this._pre.nativeElement,
      'innerHTML',
      this._buildCodeElement()
    );
  }

  /**
   * Perform the actual highlighting
   */
  private _highlight():void {
    // this._truncateLargeFiles();
    Prism.highlightElement(this._pre.nativeElement.querySelector('code'), false, null);
    if (this.shell && this.outputLines) {
      this._fixPromptOutputPadding();
    }
  }

  /**
   * Code prepared for highlighting and display
   */
  private get _processedCode():string {
    return this._isMarkup(this.language)
      ? this._processMarkup(this.code)
      : this.code;
  }

  /**
   * Format markup for display.
   */
  private _processMarkup(text: string): string {
    return this._replaceTags(this._removeAngularMarkup(text));
  }

  /**
   * Change all opening < changed to &lt; to render markup correctly inside pre
   * tags
   */
  private _replaceTags(text: string): string {
    return text.replace(/(<)([!\/A-Za-z](.|[\n\r])*?>)/g, '&lt;$2');
  }

  /**
   * Remove both template tags and styling attributes added by the angular2
   * parser and fix indentation within code elements created by structural
   * directives.
   */
  private _removeAngularMarkup(html: string): string {
    // remove styling attributes (_ngcontent etc.)
    html = html.replace(/\s_ng[^-]+-[^-]+-[^=]+="[^"]*"/g, '');

    let lines = this._fixIndentation(html);

    // remove empty <!--template--> lines
    lines = lines.filter((line: string) => {
      if (line.trim() === '') {
        return true;
      }
      let replaced = line.replace(TEMPLATE_REGEX, '')
        .trim();
      return replaced !== '';
    });

    html = lines.join('\n');

    // remove <!--template--> tags on lines with code
    return html.replace(TEMPLATE_REGEX, '');
  }

  /**
   * Is the language given a markup language?
   */
  private _isMarkup(language: string): boolean {
    return language === 'markup' || language === 'markdown';
  }

  /**
   * Create a <code> element with the proper classes and formatted code
   */
  private _buildCodeElement(): string {
    return `<code class="${this.codeClasses}">${this._processedCode}</code>`;
  }

  /**
   * Styling classes
   */
  public get languageClass(): string {
    return 'language-' + this.language;
  }

  public get lineNumbersClass(): string {
    return this.lineNumbers ? 'line-numbers' : '';
  }

  public get shellClass(): string {
    return this.shell ? 'command-line' : '';
  }

  public get codeClasses(): string {
    return this.languageClass + ' ' + this.language;
  }

  public get preClasses(): string {
    return this.lineNumbersClass + ' ' + this.languageClass + ' ' + this.shellClass;
  }

  /* Code Styling **/

  /**
   * The code element within <pre>
   */
  private get _codeEl(): any {
    return this._pre.nativeElement.querySelector('code');
  }

  /**
   * Adds back padding on output shells because of floated left prompt
   */
  private _fixPromptOutputPadding():void {
    if (this._codeEl) {
      let clp = this._codeEl.querySelector('.command-line-prompt');
      if (clp) {
        let promptWidth = this._codeEl.querySelector('.command-line-prompt').clientWidth;
        let prePadding = parseInt(this._getStyle(this._pre.nativeElement,
          'padding-left')
          .replace('px', ''), 10);
        this._pre.nativeElement.style.paddingRight = (2 * prePadding + promptWidth / 2) + 'px';
      }
    }
  }

  /**
   * Get the actually applied style of an element
   */
  private _getStyle(oElm: any, strCssRule: string): string {
    let strValue = '';
    if (document.defaultView && document.defaultView.getComputedStyle) {
      strValue = document.defaultView.getComputedStyle(oElm, '')
        .getPropertyValue(strCssRule);
    } else if (oElm.currentStyle) {
      strCssRule = strCssRule.replace(/\-(\w)/g, (strMatch:string, p1:string):string => {
        return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  }

  // _truncateLargeFiles() {
  //   if (this._codeEl.innerHTML.length > this.truncationSize) {
  //     this._codeEl.innerHTML = this._codeEl.innerHTML.slice(0,
  // this.truncationSize) + "\n" + this.truncationMessage + "\n"; } }

  /**
   * Remove extra indentation in ngSwitches
   */
  private _fixIndentation(html: string): string[] {
    let indent = 0;
    let diff = 0;
    let removeLines: number[] = [];
    let lines = html.split('\n')
      .map((line: string, index: number) => {
        if (line.trim() === '') { // empty line
          if (indent > 0) {
            removeLines.push(index);
          }
          indent = 0;
          return '';
        }
        let a = line.replace(TEMPLATE_REGEX, '')
          .trim();
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
    removeLines.forEach((removalIndex: number) => {
      lines.splice(removalIndex, 1);
    });

    return lines;
  }

}
