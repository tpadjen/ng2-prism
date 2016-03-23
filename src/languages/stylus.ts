import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-stylus';

@Directive({
  selector: 'codeblock[stylus]'
})
export class Stylus {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'stylus';
  }

}
