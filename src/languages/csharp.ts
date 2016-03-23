import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-csharp';

@Directive({
  selector: 'codeblock[csharp]'
})
export class Csharp {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'csharp';
  }

}
