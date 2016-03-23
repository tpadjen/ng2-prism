import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-docker';

@Directive({
  selector: 'codeblock[docker]'
})
export class Docker {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'docker';
  }

}
