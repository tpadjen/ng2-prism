import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-fortran';

@Directive({
  selector: 'codeblock[fortran]'
})
export class Fortran {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'fortran';
  }

}
