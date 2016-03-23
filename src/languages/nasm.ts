import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-nasm';

@Directive({
  selector: 'codeblock[nasm]'
})
export class Nasm {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'nasm';
  }

}
