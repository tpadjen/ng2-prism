import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-cpp';

@Directive({
  selector: 'codeblock[cpp]'
})
export class Cpp {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'cpp';
  }

}
