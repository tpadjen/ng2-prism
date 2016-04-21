/* */ 
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require('prismjs/components/prism-c');
require('prismjs/components/prism-cpp');
var core_1 = require('angular2/core');
var Cpp = (function () {
    function Cpp(el) {
        this.el = el;
    }
    Cpp.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'cpp';
    };
    Cpp = __decorate([
        core_1.Directive({
            selector: 'codeblock[cpp]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Cpp);
    return Cpp;
}());
exports.Cpp = Cpp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3BwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3BwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxRQUFPLDRCQUE0QixDQUFDLENBQUE7QUFDcEMsUUFBTyw4QkFBOEIsQ0FBQyxDQUFBO0FBQ3RDLHFCQUFvQyxlQUFlLENBQUMsQ0FBQTtBQU1wRDtJQUlFLGFBQW9CLEVBQWE7UUFBYixPQUFFLEdBQUYsRUFBRSxDQUFXO0lBQUssQ0FBQztJQUV2QyxzQkFBUSxHQUFSO1FBRUUsSUFBSSxDQUFDLFNBQVMsR0FBUyxJQUFJLENBQUMsRUFBRyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBYkg7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGdCQUFnQjtTQUMzQixDQUFDOztXQUFBO0lBYUYsVUFBQztBQUFELENBQUMsQUFaRCxJQVlDO0FBWlksV0FBRyxNQVlmLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jJztcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWNwcCc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnY29kZWJsb2NrW2NwcF0nXG59KVxuZXhwb3J0IGNsYXNzIENwcCB7XG5cbiAgY29kZWJsb2NrOmFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOkVsZW1lbnRSZWYpIHsgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBnZXQgdGhlIGhvc3RcbiAgICB0aGlzLmNvZGVibG9jayA9ICg8YW55PnRoaXMuZWwpLmludGVybmFsRWxlbWVudC5jb21wb25lbnRWaWV3LmNvbnRleHQ7XG4gICAgdGhpcy5jb2RlYmxvY2subGFuZ3VhZ2UgPSAnY3BwJztcbiAgfVxuXG59XG4iXX0=