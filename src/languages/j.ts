import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-j';

@Directive({
  selector: 'codeblock[j]'
})
export class J {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'j';
  }

}
