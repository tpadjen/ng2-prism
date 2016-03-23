import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-smalltalk';

@Directive({
  selector: 'codeblock[smalltalk]'
})
export class Smalltalk {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'smalltalk';
  }

}
