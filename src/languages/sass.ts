import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-sass';

@Directive({
  selector: 'codeblock[sass]'
})
export class Sass {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'sass';
  }

}
