import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-scala';

@Directive({
  selector: 'codeblock[scala]'
})
export class Scala {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'scala';
  }

}
