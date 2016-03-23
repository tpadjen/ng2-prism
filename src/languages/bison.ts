import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-bison';

@Directive({
  selector: 'codeblock[bison]'
})
export class Bison {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'bison';
  }

}
