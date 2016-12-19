// tslint:disable:max-file-line-count
import {
  Component, AfterViewChecked, AfterContentChecked, ElementRef, Input,
  ViewEncapsulation, ViewChild
} from '@angular/core';
import { CodeRendererComponent } from './code-renderer.component';
import { OnSourceChanged, OnSourceError, OnSourceReceived, Response } from './ng2-src-directive/sourcable';

@Component({
  selector: 'codeblock',
  template: `
    <div #contentEl class="codeblock-content"><ng-content></ng-content></div>
    <div class="codeblock {{theme}}">
      <code-renderer
        [code]="code"
        [language]="language"
        [lineNumbers]="shouldDisplayLineNumbers()"
        [shell]="shell"
        [prompt]="prompt"
        [outputLines]="outputLines">
      </code-renderer>
    </div>
  `,
  // necessary to make component styles apply because unique ng attributes
  // aren't applied to elements added by Prism.highlight
  encapsulation: ViewEncapsulation.None
})
export class CodeblockComponent implements AfterViewChecked,
  AfterContentChecked,
  OnSourceChanged,
  OnSourceError,
  OnSourceReceived {

  /**
   * Map of file extensions to highlighting languages
   */
  public static EXTENSION_MAP: any = {
    js: 'javascript',
    ts: 'typescript',
    html: 'markup',
    svg: 'markup',
    xml: 'markup',
    md: 'markdown',
    py: 'python',
    rb: 'ruby',
    ps1: 'powershell',
    psm1: 'powershell'
  };
  /**
   * Possible shell types
   */
  public static SHELL_TYPES: string[] = ['bash', 'powershell'];
  /**
   * A list of the valid codeblock themes.
   *
   * Example:
   * ```
   *   <select name="select" [(ngModel)]="selectedTheme">
   *     <option *ngFor="#theme of CodeblockComponent.THEMES"
   *       value="{{theme}}">{{theme}}</option>
   *   </select>
   * ```
   */
  public static THEMES: string[] = [
    'standard',
    'coy',
    'dark',
    'funky',
    'okaidia',
    'solarizedlight',
    'tomorrow',
    'twilight'
  ];
  public DEFAULT_THEME: string = 'standard';
  public DEFAULT_SHELL_THEME: string = 'okaidia';

  /* Inputs */

  /**
   * Display line numbers for the codeblock. The numbers start at 1 and are
   * not selected when selecting the main code text.
   *
   * Example:
   * ```
   *   <codeblock [lineNumbers]="true" markup>
   *     <h1>Hello</h1>
   *     <h1>Hi</h1>
   *     <h1>Aloha</h1>
   *   </codeblock>
   * ```
   *
   * Result:
   * ```
   *   1  <h1>Hello</h1>
   *   2  <h1>Hi</h1>
   *   3  <h1>Aloha</h1>
   * ```
   *
   * @param  {boolean} value - whether or not to show line numbers
   */
  @Input()
  public set lineNumbers(value: boolean) {
    if (this._lineNumbers !== value) {
      this._changed = true;
      this._lineNumbers = value;
    }
  }

  public get lineNumbers(): boolean {
    return this._lineNumbers;
  }

  /**
   * Set the language used to highlight the code within the codeblock.
   * Consider using a language directive instead if the language is not
   * going to change dynamically.
   *
   * Example:
   *    <codeblock language="markup">
   *      <h1>This is HTML</h1>
   *    </codeblock>
   *
   * @param lang
   */
  @Input()
  public set language(lang: string) {
    if (this.isShell()) {
      this._languageSet = !!(lang && lang.length > 0);
      this._language = (Prism.languages as any)[lang] ? lang : undefined;
      this._changed = true;
    }
  }

  public get language(): string {
    return this._showingMessage ? undefined : this._language;
  }

  /**
   * The theme for styling the codeblock. All prismjs themes are available.
   *
   * @param  {string} theme - A prismjs theme. Defaults to 'standard'.
   */
  @Input()
  public set theme(theme: string) {
    this._theme = theme;
  }

  public get theme(): string {
    if (this._theme) {
      return this._theme;
    }

    return this.isShell() ? this.DEFAULT_SHELL_THEME : this.DEFAULT_THEME;
  }

  /**
   * The prompt to display in a shell codeblock. Default is $.
   *
   * Example:
   * ```
   *   <codeblock shell="bash" prompt="#">
   *     cd ..
   *   </codeblock>
   * ```
   * Result:
   * ```
   *   # cd ..
   * ```
   */
  @Input() public prompt: string = '$';

  /**
   * Comma separated list of lines or series of lines to treat as output
   * in a shell codeblock, meaning they do not have a prompt.
   *
   * Example:
   * ```
   *   <codeblock shell="bash" outputLines="2, 4-6, 8">
   *     Line 1
   *     Line 2
   *     Line 3
   *     Line 4
   *     Line 5
   *     Line 6
   *     Line 7
   *     Line 8
   *   </codeblock>
   * Result:
   * ```
   *   $ Line 1
   *     Line 2
   *   $ Line 3
   *     Line 4
   *     Line 5
   *     Line 6
   *   $ Line 7
   *     Line 8
   * ```
   */
  @Input() public outputLines: string;

  /**
   * @deprecated  Use outputLines instead
   */
  @Input()
  public set output(lines: string) {
    console.warn(`DEPRECATION WARNING: The CodeblockComponent Input property 'output'
      ' is no longer supported and will be removed in a future release. Use 'outputLines'`);
    this.outputLines = lines;
  }

  /**
   * Turn this codeblock into a shell display with a prompt.
   *
   * Example:
   * ```
   *   <codeblock shell="bash">
   *     cd ..
   *     mkdir project
   *   </codeblock>
   * ```
   * Result:
   * ```
   *   $ cd ..
   *   $ mkdir project
   * ```
   *
   * @param {string} shellType - One of CodeblockComponent.SHELL_TYPES
   */
  @Input()
  public set shell(shellType: string) {
    if (shellType && CodeblockComponent.SHELL_TYPES.indexOf(shellType) !== -1) {
      this._language = shellType;
      this._languageSet = true;
      this._shellType = shellType;
      this.lineNumbers = false;
      this._changed = true;
    } else {
      this._shellType = null;
    }
  }

  public get shell(): string {
    return this._shellType;
  }

  /*** ViewChildren ***/

  /**
   * The container for the original content of the codeblock. Hidden from view.
   */
  @ViewChild('contentEl') public contentEl: any;

  /**
   * Component that shows the highlighted code.
   */
  @ViewChild(CodeRendererComponent) public codeRenderer: any;

  /**
   * The code has been loaded from a remote file. The file must have an
   * extension to be loaded. Error/warning messages are displayed within the
   * codeblock. The language is determined from the file extension, unless a
   * language is provided. Import and use the Source directive to apply it.
   *
   * Null means no source has been loaded.
   *
   * Examples:
   * ```
   *  <codeblock src="index.html"></codeblock>
   *  <codeblock
   *    src="https://raw.githubusercontent.com/tpadjen/ng2-prism/master/codeblock.js"
   *  <codeblock
   *    src="http://meyerweb.com/eric/tools/css/reset/reset.css"></codeblock>
   * ```
   */
  private _sourced: boolean;
  private _code: string = '';
  private _language: string;
  private _showingMessage: boolean = false;
  private _languageSet: boolean = false;
  private _lineNumbers: boolean = true;
  private _theme: string;
  private _changed: boolean = false;
  private _shellType: string = null;
  private _elementRef: ElementRef;

  public constructor(_elementRef: ElementRef) {
    this._elementRef = _elementRef;
  }

  /* Lifecycle Events **/

  /**
   * Update code when content changes
   */
  public ngAfterContentChecked(): any {
    if (!this._sourced && !this._showingMessage) {
      this.code = this.content;
    }
  }

  /**
   * Render code when any input changes
   */
  public ngAfterViewChecked(): any {
    if (this._changed) {
      this._changed = false;
      this.codeRenderer.render();
    }
  }

  /* Attributes */

  /**
   * The current content of the codeblock.
   *
   * Example:
   * ```
   *   <codeblock javascript>
   *     // Inside the codeblock
   *   </codeblock>
   * ```
   * Result:
   * ```
   *  // Inside the codeblock
   * ```
   *
   * @return {string} - innerHTML of this codeblock's nativeElement
   */
  public get content(): string {
    return this.contentEl ? this.contentEl.nativeElement.innerHTML : '';
  }

  /**
   * The code to display in the codeblock. Automatically set to this.content
   * unless a src attribute is present.
   */
  public set code(code: string) {
    if (this._code !== code) {
      this._changed = true;
      // this._showingMessage = false;
      this._code = code;
    }
  }

  public get code(): string {
    return this._code;
  }

  /**
   * The source has been changed
   */
  public sourceChanged(url: string): void {
    this.message('Loading ...');
  }

  /**
   * Given the downloaded source, set the language and code to match it.
   *
   * @param  {Response} res
   */
  public sourceReceived(res: Response): void {
    let ext = res.url.match(/\.(\w+)$/)[1];
    let fileLang = (CodeblockComponent.EXTENSION_MAP as any)[ext] || ext;
    let text = res.text();
    if (!this._languageSet) {
      this._language = fileLang;
      if (fileLang === 'typescript') {
        text = this._replaceTagsInMultiline(res.text());
      }
    }
    this.code = text;
    this._showingMessage = false;
    this._sourced = true;
  }

  /**
   * An error occured while downloading from the src url
   *
   * @param  {Error} error
   */
  public sourceError(error: Error): void {
    this._sourced = false;
    this.message(error.message ? error.message : 'An error occured.');
  }

  /**
   * Is this displayed as a shell?
   */
  public isShell(): boolean {
    return this._shellType !== null;
  }

  /**
   * @return {boolean} - whether or not lineNumbers should be displayed
   */
  public shouldDisplayLineNumbers(): boolean {
    return this.lineNumbers && !this._showingMessage;
  }

  /*** Truncation ***/
  // @Input() truncationSize: number = 100000;
  // @Input() truncationMessage: string = "\n--- File Truncated ---\n";

  /*** Methods ***/

  /**
   * Display the text inside the codeblock instead of code. Used for errors
   * and warnings during file loading. The language of the codeblock will
   * be set to undefined when displaying a message.
   *
   * @param  {string} text - The message to display.
   */
  public message(text: string): void {
    this._showingMessage = true;
    this.code = text;
  }

  /**
   * Returns a double curly-braced version of the input string.
   *  Use this inside a template to display a binding.
   *
   * Example:
   * ```
   *   <codeblock markup #cb><span>{{cb.bind('name')}}</span></codeblock>
   * ```
   * Result:
   * ```
   *   <span>{{name}}</span>
   * ```
   *
   * @param  {string} text - the text to wrap in curly braces
   */
  public bind(text: string): string {
    return `{{${text}}}`;
  }

  /************ Private **************/

  /**
   * Use html &lt; for leading < tags in multiline typescript strings
   *
   * @param  {string} text - the code
   * @return {string}      - the code with < replaced by &lt; inside ``s
   */
  private _replaceTagsInMultiline(text: string): string {
    return text.replace(/`((.|[\r\n])*?)`/g, (match: string) => {
      return match.replace(/(<)([!\/A-Za-z].*?>)/g, '&lt;$2');
    });
  }
}
