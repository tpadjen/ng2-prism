import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-abap';

@Directive({
  selector: 'codeblock[abap]'
})
export class Abap {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'abap';
  }

}
