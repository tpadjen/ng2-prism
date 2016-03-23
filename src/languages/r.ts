import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-r';

@Directive({
  selector: 'codeblock[r]'
})
export class R {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'r';
  }

}
