import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-vhdl';

@Directive({
  selector: 'codeblock[vhdl]'
})
export class Vhdl {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'vhdl';
  }

}
