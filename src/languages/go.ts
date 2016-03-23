import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-go';

@Directive({
  selector: 'codeblock[go]'
})
export class Go {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'go';
  }

}
