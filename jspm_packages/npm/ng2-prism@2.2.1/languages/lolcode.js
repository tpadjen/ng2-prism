/* */ 
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require('prismjs/components/prism-lolcode');
var core_1 = require('angular2/core');
var Lolcode = (function () {
    function Lolcode(el) {
        this.el = el;
    }
    Lolcode.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'lolcode';
    };
    Lolcode = __decorate([
        core_1.Directive({
            selector: 'codeblock[lolcode]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Lolcode);
    return Lolcode;
})();
exports.Lolcode = Lolcode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvbGNvZGUudHMiXSwibmFtZXMiOlsiTG9sY29kZSIsIkxvbGNvZGUuY29uc3RydWN0b3IiLCJMb2xjb2RlLm5nT25Jbml0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxRQUFPLGtDQUFrQyxDQUFDLENBQUE7QUFDMUMscUJBQW9DLGVBQWUsQ0FBQyxDQUFBO0FBR3BEO0lBT0VBLGlCQUFvQkEsRUFBYUE7UUFBYkMsT0FBRUEsR0FBRkEsRUFBRUEsQ0FBV0E7SUFBS0EsQ0FBQ0E7SUFFdkNELDBCQUFRQSxHQUFSQTtRQUVFRSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFTQSxJQUFJQSxDQUFDQSxFQUFHQSxDQUFDQSxlQUFlQSxDQUFDQSxhQUFhQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUN0RUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsR0FBR0EsU0FBU0EsQ0FBQ0E7SUFDdENBLENBQUNBO0lBYkhGO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxvQkFBb0JBO1NBQy9CQSxDQUFDQTs7Z0JBYURBO0lBQURBLGNBQUNBO0FBQURBLENBQUNBLEFBZkQsSUFlQztBQVpZLGVBQU8sVUFZbkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWxvbGNvZGUnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2NvZGVibG9ja1tsb2xjb2RlXSdcbn0pXG5leHBvcnQgY2xhc3MgTG9sY29kZSB7XG5cbiAgY29kZWJsb2NrOmFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOkVsZW1lbnRSZWYpIHsgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBnZXQgdGhlIGhvc3RcbiAgICB0aGlzLmNvZGVibG9jayA9ICg8YW55PnRoaXMuZWwpLmludGVybmFsRWxlbWVudC5jb21wb25lbnRWaWV3LmNvbnRleHQ7XG4gICAgdGhpcy5jb2RlYmxvY2subGFuZ3VhZ2UgPSAnbG9sY29kZSc7XG4gIH1cblxufVxuIl19