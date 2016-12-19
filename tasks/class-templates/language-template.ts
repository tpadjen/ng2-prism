// tslint:disable
import 'prismjs/components/prism-__lang__';
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: 'codeblock[__lang__]'
})
export class __lang_title__ implements OnInit {

  public codeblock: any;
  public el: ElementRef;

  public constructor(el: ElementRef) {
    this.el = el;
  }

  public ngOnInit():any {
    // get the host
    this.codeblock = (this.el as any).internalElement.componentView.context;
    this.codeblock.language = '{{lang}}';
  }
}
