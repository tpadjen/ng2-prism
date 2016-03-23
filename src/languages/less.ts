import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-less';

@Directive({
  selector: 'codeblock[less]'
})
export class Less {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'less';
  }

}
