import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-yaml';

@Directive({
  selector: 'codeblock[yaml]'
})
export class Yaml {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'yaml';
  }

}
