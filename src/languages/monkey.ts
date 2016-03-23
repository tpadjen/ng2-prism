import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-monkey';

@Directive({
  selector: 'codeblock[monkey]'
})
export class Monkey {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'monkey';
  }

}
