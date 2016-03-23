import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-jsx';

@Directive({
  selector: 'codeblock[jsx]'
})
export class Jsx {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'jsx';
  }

}
