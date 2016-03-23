import {Directive, ElementRef} from 'angular2/core';

import 'prismjs/components/prism-dart';

@Directive({
  selector: 'codeblock[dart]'
})
export class Dart {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = 'dart';
  }

}
