import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-processing';

@Directive({
  selector: 'codeblock[processing]'
})
export class Processing {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'processing';
  }

}
