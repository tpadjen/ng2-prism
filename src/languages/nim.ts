import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-nim';

@Directive({
  selector: 'codeblock[nim]'
})
export class Nim {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'nim';
  }

}
