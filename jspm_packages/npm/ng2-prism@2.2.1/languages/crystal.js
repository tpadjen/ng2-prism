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
require('prismjs/components/prism-ruby');
require('prismjs/components/prism-crystal');
var core_1 = require('angular2/core');
var Crystal = (function () {
    function Crystal(el) {
        this.el = el;
    }
    Crystal.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'crystal';
    };
    Crystal = __decorate([
        core_1.Directive({
            selector: 'codeblock[crystal]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Crystal);
    return Crystal;
})();
exports.Crystal = Crystal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5c3RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyeXN0YWwudHMiXSwibmFtZXMiOlsiQ3J5c3RhbCIsIkNyeXN0YWwuY29uc3RydWN0b3IiLCJDcnlzdGFsLm5nT25Jbml0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxRQUFPLCtCQUErQixDQUFDLENBQUE7QUFDdkMsUUFBTyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQzFDLHFCQUFvQyxlQUFlLENBQUMsQ0FBQTtBQUdwRDtJQU9FQSxpQkFBb0JBLEVBQWFBO1FBQWJDLE9BQUVBLEdBQUZBLEVBQUVBLENBQVdBO0lBQUtBLENBQUNBO0lBRXZDRCwwQkFBUUEsR0FBUkE7UUFFRUUsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBU0EsSUFBSUEsQ0FBQ0EsRUFBR0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDdEVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLFNBQVNBLENBQUNBO0lBQ3RDQSxDQUFDQTtJQWJIRjtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsb0JBQW9CQTtTQUMvQkEsQ0FBQ0E7O2dCQWFEQTtJQUFEQSxjQUFDQTtBQUFEQSxDQUFDQSxBQWZELElBZUM7QUFaWSxlQUFPLFVBWW5CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1ydWJ5JztcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWNyeXN0YWwnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2NvZGVibG9ja1tjcnlzdGFsXSdcbn0pXG5leHBvcnQgY2xhc3MgQ3J5c3RhbCB7XG5cbiAgY29kZWJsb2NrOmFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOkVsZW1lbnRSZWYpIHsgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBnZXQgdGhlIGhvc3RcbiAgICB0aGlzLmNvZGVibG9jayA9ICg8YW55PnRoaXMuZWwpLmludGVybmFsRWxlbWVudC5jb21wb25lbnRWaWV3LmNvbnRleHQ7XG4gICAgdGhpcy5jb2RlYmxvY2subGFuZ3VhZ2UgPSAnY3J5c3RhbCc7XG4gIH1cblxufVxuIl19