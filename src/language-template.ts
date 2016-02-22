import {Directive, ElementRef} from 'angular2/core';

// import 'ng2-prism/languages/prism-{{lang}}';

@Directive({
  selector: 'codeblock[{{lang}}]'
})
export class {{lang_title}} {

  codeblock:any;

  constructor(private el:ElementRef) {  }

  ngOnInit() {
    // get the host
    this.codeblock = (<any>this.el).internalElement.componentView.context;
    this.codeblock.language = '{{lang}}';
  }

}