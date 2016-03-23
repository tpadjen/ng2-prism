import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-haxe';

@Directive({
  selector: 'codeblock[haxe]'
})
export class Haxe {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'haxe';
  }

}
