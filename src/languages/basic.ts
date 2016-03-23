import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-basic';

@Directive({
  selector: 'codeblock[basic]'
})
export class Basic {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'basic';
  }

}
