import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-haml';

@Directive({
  selector: 'codeblock[haml]'
})
export class Haml {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'haml';
  }

}
