import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-scheme';

@Directive({
  selector: 'codeblock[scheme]'
})
export class Scheme {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'scheme';
  }

}
