import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-coffeescript';

@Directive({
  selector: 'codeblock[coffeescript]'
})
export class Coffeescript {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'coffeescript';
  }

}
