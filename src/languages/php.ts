import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-php';

@Directive({
  selector: 'codeblock[php]'
})
export class Php {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'php';
  }

}
