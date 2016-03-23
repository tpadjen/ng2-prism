import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-puppet';

@Directive({
  selector: 'codeblock[puppet]'
})
export class Puppet {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'puppet';
  }

}
