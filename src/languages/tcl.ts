import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-tcl';

@Directive({
  selector: 'codeblock[tcl]'
})
export class Tcl {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'tcl';
  }

}
