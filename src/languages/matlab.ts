import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-matlab';

@Directive({
  selector: 'codeblock[matlab]'
})
export class Matlab {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'matlab';
  }

}
