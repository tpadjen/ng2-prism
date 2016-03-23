import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-ocaml';

@Directive({
  selector: 'codeblock[ocaml]'
})
export class Ocaml {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'ocaml';
  }

}
