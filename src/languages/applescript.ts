import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-applescript';

@Directive({
  selector: 'codeblock[applescript]'
})
export class Applescript {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'applescript';
  }

}
