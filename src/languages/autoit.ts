import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-autoit';

@Directive({
  selector: 'codeblock[autoit]'
})
export class Autoit {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'autoit';
  }

}
