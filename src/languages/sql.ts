import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-sql';

@Directive({
  selector: 'codeblock[sql]'
})
export class Sql {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'sql';
  }

}
