import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-markup';

@Directive({
  selector: 'codeblock[markup]'
})
export class Markup {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'markup';
  }

}
