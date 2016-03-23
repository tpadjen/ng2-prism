import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-parser';

@Directive({
  selector: 'codeblock[parser]'
})
export class Parser {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'parser';
  }

}
