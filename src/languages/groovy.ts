import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-groovy';

@Directive({
  selector: 'codeblock[groovy]'
})
export class Groovy {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'groovy';
  }

}
