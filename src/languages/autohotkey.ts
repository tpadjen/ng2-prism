import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-autohotkey';

@Directive({
  selector: 'codeblock[autohotkey]'
})
export class Autohotkey {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'autohotkey';
  }

}
