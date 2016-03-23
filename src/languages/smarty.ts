import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-smarty';

@Directive({
  selector: 'codeblock[smarty]'
})
export class Smarty {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'smarty';
  }

}
