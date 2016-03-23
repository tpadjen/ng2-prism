import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-swift';

@Directive({
  selector: 'codeblock[swift]'
})
export class Swift {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'swift';
  }

}
