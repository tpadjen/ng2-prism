import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-latex';

@Directive({
  selector: 'codeblock[latex]'
})
export class Latex {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'latex';
  }

}
