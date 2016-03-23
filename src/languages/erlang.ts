import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-erlang';

@Directive({
  selector: 'codeblock[erlang]'
})
export class Erlang {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'erlang';
  }

}
