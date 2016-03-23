import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-prolog';

@Directive({
  selector: 'codeblock[prolog]'
})
export class Prolog {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'prolog';
  }

}
