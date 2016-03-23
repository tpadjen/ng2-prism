import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-haskell';

@Directive({
  selector: 'codeblock[haskell]'
})
export class Haskell {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'haskell';
  }

}
