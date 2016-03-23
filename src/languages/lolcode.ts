import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-lolcode';

@Directive({
  selector: 'codeblock[lolcode]'
})
export class Lolcode {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'lolcode';
  }

}
