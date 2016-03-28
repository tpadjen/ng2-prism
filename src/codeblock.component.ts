import {
  Component,
  AfterViewChecked,
  AfterContentChecked,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ViewChild
} from 'angular2/core';

declare var Prism: any;
import 'prismjs/prism';

import {CodeRenderer} from './code-renderer.component';
import {
  OnSourceChanged,
  OnSourceError,
  OnSourceReceived,
  Response
} from 'ng2-src-directive/src';

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

  // CSS injected in build step
  styles: [`{{CSS}}`],

  // necessary to make component styles apply because unique ng attributes
  // aren't applied to elements added by Prism.highlight
  encapsulation: ViewEncapsulation.None,

  directives: [CodeRenderer]
})
export class CodeblockComponent implements
                                AfterViewChecked,
                                AfterContentChecked,
                                OnSourceChanged,
                                OnSourceError,
                                OnSourceReceived {

  /** ViewChildren **/

  /**
   * The container for the original content of the codeblock. Hidden from view.
   */
  @ViewChild('contentEl') contentEl;

  /**
   * Component that shows the highlighted code.
   */
  @ViewChild(CodeRenderer) codeRenderer;


  /** Lifecycle Events **/

  constructor(
    private _elementRef: ElementRef) { }

  /**
   * Update code when content changes
   */
  ngAfterContentChecked() {
    if (!this._sourced && !this._showingMessage) { this.code = this.content; }
  }

  /**
   * Render code when any input changes
   */
  ngAfterViewChecked() {
    if (this._changed) {
      this._changed = false;
      this.codeRenderer.render();
    }
  }


  /** Attributes **/

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
  get content(): string {
    return this.contentEl ? this.contentEl.nativeElement.innerHTML : '';
  }


  /**
   * The code to display in the codeblock. Automatically set to this.content
   * unless a src attribute is present.
   */
  set code(code: string) {
    if (this._code !== code) {
      this._changed = true;
      // this._showingMessage = false;
      this._code = code;
    }
  }

  get code(): string {
    return this._code;
  }


  /** Inputs **/

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
   * @return {boolean} - whether or not lineNumbers should be displayed
   */
  shouldDisplayLineNumbers(): boolean {
    return this.lineNumbers && ! this._showingMessage;
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
   * @param {string} - language used for highlighting
   */
  @Input() set language(lang: string) {
    if (this.isShell()) { return; }
    this._languageSet = lang && lang.length > 0 ? true : false;
    this._language = Prism.languages[lang] ? lang : undefined;
    this._changed = true;
  }

  get language() {
    return this._showingMessage ? undefined : this._language;
  }


  /**
   * The theme for styling the codeblock. All prismjs themes are available.
   *
   * @param  {string} theme - A prismjs theme. Defaults to 'standard'.
   */
  @Input() set theme(theme: string) {
    this._theme = theme;
  }

  get theme(): string {
    if (this._theme) { return this._theme; }

    return this.isShell() ? this.DEFAULT_SHELL_THEME : this.DEFAULT_THEME;
  }

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
  static THEMES: Array<string> = [
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
   * The code has been loaded from a remote file. The file must have an extension
   * to be loaded. Error/warning messages are displayed within the codeblock. The
   * language is determined from the file extension, unless a language is
   * provided. Import and use the Source directive to apply it.
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
  _sourced: boolean;

  /**
   * The source has been changed
   */
  sourceChanged(url: string) {
    this.message("Loading ...");
  }

  /**
   * Given the downloaded source, set the language and code to match it.
   *
   * @param  {Response} res
   */
  sourceReceived(res: Response) {
    let ext = res.url.match(/\.(\w+)$/)[1];
    let fileLang = CodeblockComponent.EXTENSION_MAP[ext] || ext;
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
  sourceError(error) {
    this._sourced = false;
    if (error.message) {
      this.message(error.message);
    }
  }

  /**
   * Map of file extensions to highlighting languages
   */
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
   * Turn this codeblock into a shell display with a prompt.
   *
   * Example:
   * ```
   *   <codeblock shell="bash">
   *     cd ..
   *     mkdir project
   *   </codeblock>
   *```
   * Result:
   * ```
   *   $ cd ..
   *   $ mkdir project
   * ```
   *
   * @param {string} shellType - One of CodeblockComponent.SHELL_TYPES
   */
  @Input() set shell(shellType: string) {
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

  get shell(): string {
    return this._shellType;
  }

  /**
   * Is this displayed as a shell?
   */
  isShell(): boolean {
    return this._shellType !== null;
  }

  /**
   * Possible shell types
   */
  static SHELL_TYPES: Array<string>  = ['bash', 'powershell'];

  /**
   * The prompt to display in a shell codeblock. Default is $.
   *
   * Example:
   * ```
   *   <codeblock shell="bash" prompt="#">
   *     cd ..
   *   </codeblock>
   *```
   * Result:
   * ```
   *   # cd ..
   * ```
   */
  @Input() prompt: string = '$';

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
  @Input() outputLines: string;

  /**
   * @deprecated  Use outputLines instead
   */
  @Input() set output(lines: string) {
    console.warn("DEPRECATION WARNING: The CodeblockComponent Input property 'output'" +
            " is no longer supported and will be removed in a future release. Use 'outputLines'");
    this.outputLines = lines;
  }

  /** Truncation **/
  // @Input() truncationSize: number = 100000;
  // @Input() truncationMessage: string = "\n--- File Truncated ---\n";


  /** Methods **/

  /**
   * Display the text inside the codeblock instead of code. Used for errors
   * and warnings during file loading. The language of the codeblock will
   * be set to undefined when displaying a message.
   *
   * @param  {string} text - The message to display.
   */
  message(text: string) {
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
  bind(text: string): string {
    return `{{${text}}}`;
  }


  /************ Private **************/

  _code: string = '';
  _language: string;
  _showingMessage: boolean = false;
  _languageSet: boolean = false;
  _lineNumbers: boolean = true;
  _theme: string;
  _changed: boolean = false;
  _shellType: string = null;

  /**
   * Use html &lt; for leading < tags in multiline typescript strings
   *
   * @param  {string} text - the code
   * @return {string}      - the code with < replaced by &lt; inside ``s
   */
  _replaceTagsInMultiline(text: string): string {
    return text.replace(/`((.|[\r\n])*?)`/g, (match) => {
      return match.replace(/(<)([!\/A-Za-z].*?>)/g, '&lt;$2');
    });
  }

}
