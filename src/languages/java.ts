import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-java';

@Directive({
  selector: 'codeblock[java]'
})
export class Java {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'java';
  }

}
