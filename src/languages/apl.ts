import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-apl';

@Directive({
  selector: 'codeblock[apl]'
})
export class Apl {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'apl';
  }

}
