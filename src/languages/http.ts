import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-http';

@Directive({
  selector: 'codeblock[http]'
})
export class Http {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'http';
  }

}
