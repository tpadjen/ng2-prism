import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-nix';

@Directive({
  selector: 'codeblock[nix]'
})
export class Nix {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'nix';
  }

}
