import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-ini';

@Directive({
  selector: 'codeblock[ini]'
})
export class Ini {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'ini';
  }

}
