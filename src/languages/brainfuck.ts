import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-brainfuck';

@Directive({
  selector: 'codeblock[brainfuck]'
})
export class Brainfuck {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'brainfuck';
  }

}
