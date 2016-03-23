import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-actionscript';

@Directive({
  selector: 'codeblock[actionscript]'
})
export class Actionscript {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'actionscript';
  }

}
