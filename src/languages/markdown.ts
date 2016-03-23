import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-markdown';

@Directive({
  selector: 'codeblock[markdown]'
})
export class Markdown {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'markdown';
  }

}
