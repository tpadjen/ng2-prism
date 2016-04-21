import 'prismjs/components/prism-diff';
import { ElementRef } from 'angular2/core';
export declare class Diff {
    private el;
    codeblock: any;
    constructor(el: ElementRef);
    ngOnInit(): void;
}
