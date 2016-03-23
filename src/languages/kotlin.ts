import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-kotlin';

@Directive({
  selector: 'codeblock[kotlin]'
})
export class Kotlin {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'kotlin';
  }

}
