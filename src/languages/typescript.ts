import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-typescript';

@Directive({
  selector: 'codeblock[typescript]'
})
export class Typescript {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'typescript';
  }

}
