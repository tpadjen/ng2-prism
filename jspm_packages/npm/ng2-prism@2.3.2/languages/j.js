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
require('prismjs/components/prism-j');
var core_1 = require('angular2/core');
var J = (function () {
    function J(el) {
        this.el = el;
    }
    J.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'j';
    };
    J = __decorate([
        core_1.Directive({
            selector: 'codeblock[j]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], J);
    return J;
}());
exports.J = J;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiai5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImoudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLFFBQU8sNEJBQTRCLENBQUMsQ0FBQTtBQUNwQyxxQkFBb0MsZUFBZSxDQUFDLENBQUE7QUFNcEQ7SUFJRSxXQUFvQixFQUFhO1FBQWIsT0FBRSxHQUFGLEVBQUUsQ0FBVztJQUFLLENBQUM7SUFFdkMsb0JBQVEsR0FBUjtRQUVFLElBQUksQ0FBQyxTQUFTLEdBQVMsSUFBSSxDQUFDLEVBQUcsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN0RSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFDaEMsQ0FBQztJQWJIO1FBQUMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxjQUFjO1NBQ3pCLENBQUM7O1NBQUE7SUFhRixRQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxTQUFDLElBWWIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWonO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2NvZGVibG9ja1tqXSdcbn0pXG5leHBvcnQgY2xhc3MgSiB7XG5cbiAgY29kZWJsb2NrOmFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOkVsZW1lbnRSZWYpIHsgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBnZXQgdGhlIGhvc3RcbiAgICB0aGlzLmNvZGVibG9jayA9ICg8YW55PnRoaXMuZWwpLmludGVybmFsRWxlbWVudC5jb21wb25lbnRWaWV3LmNvbnRleHQ7XG4gICAgdGhpcy5jb2RlYmxvY2subGFuZ3VhZ2UgPSAnaic7XG4gIH1cblxufVxuIl19