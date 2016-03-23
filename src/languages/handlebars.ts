import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-handlebars';

@Directive({
  selector: 'codeblock[handlebars]'
})
export class Handlebars {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'handlebars';
  }

}
