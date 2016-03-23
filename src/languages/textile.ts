import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-textile';

@Directive({
  selector: 'codeblock[textile]'
})
export class Textile {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'textile';
  }

}
