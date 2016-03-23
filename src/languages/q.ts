import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-q';

@Directive({
  selector: 'codeblock[q]'
})
export class Q {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'q';
  }

}
