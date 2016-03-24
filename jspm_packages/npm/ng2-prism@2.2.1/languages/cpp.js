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
})();
exports.Cpp = Cpp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3BwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3BwLnRzIl0sIm5hbWVzIjpbIkNwcCIsIkNwcC5jb25zdHJ1Y3RvciIsIkNwcC5uZ09uSW5pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsUUFBTyw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3BDLFFBQU8sOEJBQThCLENBQUMsQ0FBQTtBQUN0QyxxQkFBb0MsZUFBZSxDQUFDLENBQUE7QUFHcEQ7SUFPRUEsYUFBb0JBLEVBQWFBO1FBQWJDLE9BQUVBLEdBQUZBLEVBQUVBLENBQVdBO0lBQUtBLENBQUNBO0lBRXZDRCxzQkFBUUEsR0FBUkE7UUFFRUUsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBU0EsSUFBSUEsQ0FBQ0EsRUFBR0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDdEVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBO0lBQ2xDQSxDQUFDQTtJQWJIRjtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsZ0JBQWdCQTtTQUMzQkEsQ0FBQ0E7O1lBYURBO0lBQURBLFVBQUNBO0FBQURBLENBQUNBLEFBZkQsSUFlQztBQVpZLFdBQUcsTUFZZixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tYyc7XG5pbXBvcnQgJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jcHAnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2NvZGVibG9ja1tjcHBdJ1xufSlcbmV4cG9ydCBjbGFzcyBDcHAge1xuXG4gIGNvZGVibG9jazphbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDpFbGVtZW50UmVmKSB7ICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gZ2V0IHRoZSBob3N0XG4gICAgdGhpcy5jb2RlYmxvY2sgPSAoPGFueT50aGlzLmVsKS5pbnRlcm5hbEVsZW1lbnQuY29tcG9uZW50Vmlldy5jb250ZXh0O1xuICAgIHRoaXMuY29kZWJsb2NrLmxhbmd1YWdlID0gJ2NwcCc7XG4gIH1cblxufVxuIl19