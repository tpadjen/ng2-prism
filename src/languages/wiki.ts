import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-wiki';

@Directive({
  selector: 'codeblock[wiki]'
})
export class Wiki {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'wiki';
  }

}
