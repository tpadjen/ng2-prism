import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-rust';

@Directive({
  selector: 'codeblock[rust]'
})
export class Rust {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'rust';
  }

}
