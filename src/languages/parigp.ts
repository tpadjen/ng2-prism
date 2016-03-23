import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-parigp';

@Directive({
  selector: 'codeblock[parigp]'
})
export class Parigp {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'parigp';
  }

}
