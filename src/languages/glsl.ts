import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-glsl';

@Directive({
  selector: 'codeblock[glsl]'
})
export class Glsl {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'glsl';
  }

}
