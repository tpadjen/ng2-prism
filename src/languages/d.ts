import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-d';

@Directive({
  selector: 'codeblock[d]'
})
export class D {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'd';
  }

}
