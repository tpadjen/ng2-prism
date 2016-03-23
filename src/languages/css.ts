import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-css';

@Directive({
  selector: 'codeblock[css]'
})
export class Css {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'css';
  }

}
