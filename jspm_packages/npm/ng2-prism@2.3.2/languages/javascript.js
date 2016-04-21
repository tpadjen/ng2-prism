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
require('prismjs/components/prism-javascript');
var core_1 = require('angular2/core');
var Javascript = (function () {
    function Javascript(el) {
        this.el = el;
    }
    Javascript.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'javascript';
    };
    Javascript = __decorate([
        core_1.Directive({
            selector: 'codeblock[javascript]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Javascript);
    return Javascript;
}());
exports.Javascript = Javascript;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImphdmFzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLFFBQU8scUNBQXFDLENBQUMsQ0FBQTtBQUM3QyxxQkFBb0MsZUFBZSxDQUFDLENBQUE7QUFNcEQ7SUFJRSxvQkFBb0IsRUFBYTtRQUFiLE9BQUUsR0FBRixFQUFFLENBQVc7SUFBSyxDQUFDO0lBRXZDLDZCQUFRLEdBQVI7UUFFRSxJQUFJLENBQUMsU0FBUyxHQUFTLElBQUksQ0FBQyxFQUFHLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDdEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0lBQ3pDLENBQUM7SUFiSDtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsdUJBQXVCO1NBQ2xDLENBQUM7O2tCQUFBO0lBYUYsaUJBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLGtCQUFVLGFBWXRCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1qYXZhc2NyaXB0JztcbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjb2RlYmxvY2tbamF2YXNjcmlwdF0nXG59KVxuZXhwb3J0IGNsYXNzIEphdmFzY3JpcHQge1xuXG4gIGNvZGVibG9jazphbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDpFbGVtZW50UmVmKSB7ICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gZ2V0IHRoZSBob3N0XG4gICAgdGhpcy5jb2RlYmxvY2sgPSAoPGFueT50aGlzLmVsKS5pbnRlcm5hbEVsZW1lbnQuY29tcG9uZW50Vmlldy5jb250ZXh0O1xuICAgIHRoaXMuY29kZWJsb2NrLmxhbmd1YWdlID0gJ2phdmFzY3JpcHQnO1xuICB9XG5cbn1cbiJdfQ==