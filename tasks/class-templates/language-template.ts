// tslint:disable
import 'prismjs/components/prism-__lang__';
import { Directive, ElementRef, OnInit, Host } from '@angular/core';
import { CodeblockComponent } from '../codeblock.component';

@Directive({
  selector: 'codeblock[__lang__]'
})
export class __lang_title__ implements OnInit {

  public codeblock: any;

  public constructor(@Host() codeblockComponent: CodeblockComponent) {
    this.codeblock = codeblockComponent;
  }

  public ngOnInit():any {
    this.codeblock.language = '__lang__';
  }
}
