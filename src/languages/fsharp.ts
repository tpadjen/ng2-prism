import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-fsharp';

@Directive({
  selector: 'codeblock[fsharp]'
})
export class Fsharp {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'fsharp';
  }

}
