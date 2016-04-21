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
require('prismjs/components/prism-textile');
var core_1 = require('angular2/core');
var Textile = (function () {
    function Textile(el) {
        this.el = el;
    }
    Textile.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'textile';
    };
    Textile = __decorate([
        core_1.Directive({
            selector: 'codeblock[textile]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Textile);
    return Textile;
}());
exports.Textile = Textile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRleHRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLFFBQU8sa0NBQWtDLENBQUMsQ0FBQTtBQUMxQyxxQkFBb0MsZUFBZSxDQUFDLENBQUE7QUFNcEQ7SUFJRSxpQkFBb0IsRUFBYTtRQUFiLE9BQUUsR0FBRixFQUFFLENBQVc7SUFBSyxDQUFDO0lBRXZDLDBCQUFRLEdBQVI7UUFFRSxJQUFJLENBQUMsU0FBUyxHQUFTLElBQUksQ0FBQyxFQUFHLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDdEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0lBQ3RDLENBQUM7SUFiSDtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsb0JBQW9CO1NBQy9CLENBQUM7O2VBQUE7SUFhRixjQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxlQUFPLFVBWW5CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS10ZXh0aWxlJztcbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjb2RlYmxvY2tbdGV4dGlsZV0nXG59KVxuZXhwb3J0IGNsYXNzIFRleHRpbGUge1xuXG4gIGNvZGVibG9jazphbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDpFbGVtZW50UmVmKSB7ICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gZ2V0IHRoZSBob3N0XG4gICAgdGhpcy5jb2RlYmxvY2sgPSAoPGFueT50aGlzLmVsKS5pbnRlcm5hbEVsZW1lbnQuY29tcG9uZW50Vmlldy5jb250ZXh0O1xuICAgIHRoaXMuY29kZWJsb2NrLmxhbmd1YWdlID0gJ3RleHRpbGUnO1xuICB9XG5cbn1cbiJdfQ==