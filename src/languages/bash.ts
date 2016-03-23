import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-bash';

@Directive({
  selector: 'codeblock[bash]'
})
export class Bash {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'bash';
  }

}
