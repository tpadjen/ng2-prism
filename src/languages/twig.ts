import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-twig';

@Directive({
  selector: 'codeblock[twig]'
})
export class Twig {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'twig';
  }

}
