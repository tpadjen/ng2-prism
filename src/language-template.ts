import 'prismjs/components/prism-{{lang}}';
import {Directive, ElementRef, OnInit} from '@angular/core';


@Directive({
  selector: 'codeblock[{{lang}}]'
})
export class {{lang_title}} implements OnInit {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = '{{lang}}';
  }

}
