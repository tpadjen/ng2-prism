import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-rest';

@Directive({
  selector: 'codeblock[rest]'
})
export class Rest {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'rest';
  }

}
