import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-elixir';

@Directive({
  selector: 'codeblock[elixir]'
})
export class Elixir {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'elixir';
  }

}
