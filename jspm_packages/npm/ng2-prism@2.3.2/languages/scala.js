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
require('prismjs/components/prism-java');
require('prismjs/components/prism-scala');
var core_1 = require('angular2/core');
var Scala = (function () {
    function Scala(el) {
        this.el = el;
    }
    Scala.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'scala';
    };
    Scala = __decorate([
        core_1.Directive({
            selector: 'codeblock[scala]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Scala);
    return Scala;
}());
exports.Scala = Scala;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY2FsYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsUUFBTywrQkFBK0IsQ0FBQyxDQUFBO0FBQ3ZDLFFBQU8sZ0NBQWdDLENBQUMsQ0FBQTtBQUN4QyxxQkFBb0MsZUFBZSxDQUFDLENBQUE7QUFNcEQ7SUFJRSxlQUFvQixFQUFhO1FBQWIsT0FBRSxHQUFGLEVBQUUsQ0FBVztJQUFLLENBQUM7SUFFdkMsd0JBQVEsR0FBUjtRQUVFLElBQUksQ0FBQyxTQUFTLEdBQVMsSUFBSSxDQUFDLEVBQUcsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN0RSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDcEMsQ0FBQztJQWJIO1FBQUMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7U0FDN0IsQ0FBQzs7YUFBQTtJQWFGLFlBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLGFBQUssUUFZakIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWphdmEnO1xuaW1wb3J0ICdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tc2NhbGEnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2NvZGVibG9ja1tzY2FsYV0nXG59KVxuZXhwb3J0IGNsYXNzIFNjYWxhIHtcblxuICBjb2RlYmxvY2s6YW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6RWxlbWVudFJlZikgeyAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGdldCB0aGUgaG9zdFxuICAgIHRoaXMuY29kZWJsb2NrID0gKDxhbnk+dGhpcy5lbCkuaW50ZXJuYWxFbGVtZW50LmNvbXBvbmVudFZpZXcuY29udGV4dDtcbiAgICB0aGlzLmNvZGVibG9jay5sYW5ndWFnZSA9ICdzY2FsYSc7XG4gIH1cblxufVxuIl19