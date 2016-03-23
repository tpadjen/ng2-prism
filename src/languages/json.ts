import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-json';

@Directive({
  selector: 'codeblock[json]'
})
export class Json {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'json';
  }

}
