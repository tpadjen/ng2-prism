import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-git';

@Directive({
  selector: 'codeblock[git]'
})
export class Git {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'git';
  }

}
