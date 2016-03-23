import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-c';

@Directive({
  selector: 'codeblock[c]'
})
export class C {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'c';
  }

}
