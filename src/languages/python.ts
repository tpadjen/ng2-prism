import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-python';

@Directive({
  selector: 'codeblock[python]'
})
export class Python {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'python';
  }

}
