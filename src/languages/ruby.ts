import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-ruby';

@Directive({
  selector: 'codeblock[ruby]'
})
export class Ruby {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'ruby';
  }

}
