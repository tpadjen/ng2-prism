import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-gherkin';

@Directive({
  selector: 'codeblock[gherkin]'
})
export class Gherkin {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'gherkin';
  }

}
