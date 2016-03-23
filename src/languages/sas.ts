import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-sas';

@Directive({
  selector: 'codeblock[sas]'
})
export class Sas {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'sas';
  }

}
