import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-oz';

@Directive({
  selector: 'codeblock[oz]'
})
export class Oz {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'oz';
  }

}
