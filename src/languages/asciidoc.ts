import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-asciidoc';

@Directive({
  selector: 'codeblock[asciidoc]'
})
export class Asciidoc {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'asciidoc';
  }

}
