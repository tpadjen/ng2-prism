import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-qore';

@Directive({
  selector: 'codeblock[qore]'
})
export class Qore {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'qore';
  }

}
