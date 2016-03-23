import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-verilog';

@Directive({
  selector: 'codeblock[verilog]'
})
export class Verilog {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'verilog';
  }

}
