import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-diff';

@Directive({
  selector: 'codeblock[diff]'
})
export class Diff {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'diff';
  }

}
