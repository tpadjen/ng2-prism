import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-scss';

@Directive({
  selector: 'codeblock[scss]'
})
export class Scss {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'scss';
  }

}
