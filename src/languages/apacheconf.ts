import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-apacheconf';

@Directive({
  selector: 'codeblock[apacheconf]'
})
export class Apacheconf {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'apacheconf';
  }

}
