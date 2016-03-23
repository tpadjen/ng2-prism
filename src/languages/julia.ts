import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-julia';

@Directive({
  selector: 'codeblock[julia]'
})
export class Julia {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'julia';
  }

}
