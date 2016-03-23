import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-pure';

@Directive({
  selector: 'codeblock[pure]'
})
export class Pure {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'pure';
  }

}
