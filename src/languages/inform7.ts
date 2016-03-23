import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-inform7';

@Directive({
  selector: 'codeblock[inform7]'
})
export class Inform7 {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'inform7';
  }

}
