import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-roboconf';

@Directive({
  selector: 'codeblock[roboconf]'
})
export class Roboconf {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'roboconf';
  }

}
