import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-crystal';

@Directive({
  selector: 'codeblock[crystal]'
})
export class Crystal {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'crystal';
  }

}
