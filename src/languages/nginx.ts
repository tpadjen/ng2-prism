import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-nginx';

@Directive({
  selector: 'codeblock[nginx]'
})
export class Nginx {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'nginx';
  }

}
