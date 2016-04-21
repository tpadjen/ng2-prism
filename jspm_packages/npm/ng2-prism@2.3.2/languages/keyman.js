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
require('prismjs/components/prism-keyman');
var core_1 = require('angular2/core');
var Keyman = (function () {
    function Keyman(el) {
        this.el = el;
    }
    Keyman.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'keyman';
    };
    Keyman = __decorate([
        core_1.Directive({
            selector: 'codeblock[keyman]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Keyman);
    return Keyman;
}());
exports.Keyman = Keyman;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5bWFuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsia2V5bWFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxRQUFPLGlDQUFpQyxDQUFDLENBQUE7QUFDekMscUJBQW9DLGVBQWUsQ0FBQyxDQUFBO0FBTXBEO0lBSUUsZ0JBQW9CLEVBQWE7UUFBYixPQUFFLEdBQUYsRUFBRSxDQUFXO0lBQUssQ0FBQztJQUV2Qyx5QkFBUSxHQUFSO1FBRUUsSUFBSSxDQUFDLFNBQVMsR0FBUyxJQUFJLENBQUMsRUFBRyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBYkg7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLG1CQUFtQjtTQUM5QixDQUFDOztjQUFBO0lBYUYsYUFBQztBQUFELENBQUMsQUFaRCxJQVlDO0FBWlksY0FBTSxTQVlsQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20ta2V5bWFuJztcbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjb2RlYmxvY2tba2V5bWFuXSdcbn0pXG5leHBvcnQgY2xhc3MgS2V5bWFuIHtcblxuICBjb2RlYmxvY2s6YW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6RWxlbWVudFJlZikgeyAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGdldCB0aGUgaG9zdFxuICAgIHRoaXMuY29kZWJsb2NrID0gKDxhbnk+dGhpcy5lbCkuaW50ZXJuYWxFbGVtZW50LmNvbXBvbmVudFZpZXcuY29udGV4dDtcbiAgICB0aGlzLmNvZGVibG9jay5sYW5ndWFnZSA9ICdrZXltYW4nO1xuICB9XG5cbn1cbiJdfQ==