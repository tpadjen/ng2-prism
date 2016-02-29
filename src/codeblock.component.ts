// Required in angular beta 6
///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {
  Component,
  AfterViewChecked,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
  ViewChild
} from 'angular2/core';

import {CodeRenderer} from './code-renderer.component';
import {SrcService} from './src.service';

declare var Prism: any;

@Component({
  selector: 'codeblock',
  template: `
    <div #contentEl class="content"><ng-content></ng-content></div>
    <div class="codeblock {{theme}}">
      <code-renderer
        [code]="code"
        [language]="language"
        [lineNumbers]="displayLineNumbers()"
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

  directives: [CodeRenderer],

  providers: [SrcService]
})
export class CodeblockComponent implements AfterViewChecked {

  /** Inputs **/
  // @Input() language
  // @Input() src
  // @Input() lineNumbers
  // @Input() theme

  /** Outputs **/
  @Output() srcChanged: EventEmitter<string> = new EventEmitter();

  /** Data **/
  // content - the current content of this component
  // code    - the last version of content before highlighting

  /** Command line **/
  // @Input() shell:string;
  @Input() prompt: string = '$';
  @Input() outputLines: string;

  /** Truncation **/
  // @Input() truncationSize: number = 100000;
  // @Input() truncationMessage: string = "\n--- File Truncated ---\n";

  /** ViewChildren **/
  @ViewChild('contentEl') contentEl; // holds and hides the unmodified content
  @ViewChild(CodeRenderer) codeRenderer;

  /** Lifecycle Events **/

  constructor(
    private _elementRef: ElementRef,
    private _srcService: SrcService) {
      _srcService.host = this;
  }

  // update code when content changes
  ngAfterContentChecked() {
    if (!this.src) { this.code = this.content; }
  }

  ngAfterViewChecked() {
    if (this._changed) {
      this._changed = false;
      this.codeRenderer.render();
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
      this._showingMessage = false;
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

  displayLineNumbers(): boolean {
    return this.lineNumbers && ! this._showingMessage;
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
    return this._showingMessage ? undefined : this._language;
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

  @Input() set src(source: string) { this.srcChanged.next(source); }

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


  /**
  * bind(text)
  *
  *  Returns a double curly-braced version of the input string.
  *  Use this inside a template to display a binding.
  *
  *   Example:
  *     <codeblock markup #cb><span>{{cb.bind('name')}}</span></codeblock>
  *   Result:
  *     <span>{{name}}</span>
  */
  bind(text: string): string {
    return `{{${text}}}`;
  }


  /************ Private **************/

  _language: string;
  _showingMessage: boolean = false;
  _languageSet: boolean = false;
  _lineNumbers: boolean = true;
  _theme: string;
  _changed: boolean = false;
  _shell: boolean = false;


  _notFound(source) {
    this._showingMessage = true;
    this.code = `${source} not found.`;
  }

  _noFileGiven() {
    this._showingMessage = true;
    this.code = `No source file given.`;
  }

  _notAFile(source) {
    this._showingMessage = true;
    this.code = `${source} is not a file.`;
  }

  _showLoading() {
    this._showingMessage = true;
    this.code = "Loading...";
  }

}
