import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-mel';

@Directive({
  selector: 'codeblock[mel]'
})
export class Mel {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'mel';
  }

}
