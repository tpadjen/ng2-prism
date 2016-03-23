import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-clike';

@Directive({
  selector: 'codeblock[clike]'
})
export class Clike {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'clike';
  }

}
