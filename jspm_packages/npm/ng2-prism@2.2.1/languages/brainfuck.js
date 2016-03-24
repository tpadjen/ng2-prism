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
require('prismjs/components/prism-brainfuck');
var core_1 = require('angular2/core');
var Brainfuck = (function () {
    function Brainfuck(el) {
        this.el = el;
    }
    Brainfuck.prototype.ngOnInit = function () {
        this.codeblock = this.el.internalElement.componentView.context;
        this.codeblock.language = 'brainfuck';
    };
    Brainfuck = __decorate([
        core_1.Directive({
            selector: 'codeblock[brainfuck]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Brainfuck);
    return Brainfuck;
})();
exports.Brainfuck = Brainfuck;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhaW5mdWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnJhaW5mdWNrLnRzIl0sIm5hbWVzIjpbIkJyYWluZnVjayIsIkJyYWluZnVjay5jb25zdHJ1Y3RvciIsIkJyYWluZnVjay5uZ09uSW5pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsUUFBTyxvQ0FBb0MsQ0FBQyxDQUFBO0FBQzVDLHFCQUFvQyxlQUFlLENBQUMsQ0FBQTtBQUdwRDtJQU9FQSxtQkFBb0JBLEVBQWFBO1FBQWJDLE9BQUVBLEdBQUZBLEVBQUVBLENBQVdBO0lBQUtBLENBQUNBO0lBRXZDRCw0QkFBUUEsR0FBUkE7UUFFRUUsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBU0EsSUFBSUEsQ0FBQ0EsRUFBR0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDdEVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLFdBQVdBLENBQUNBO0lBQ3hDQSxDQUFDQTtJQWJIRjtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsc0JBQXNCQTtTQUNqQ0EsQ0FBQ0E7O2tCQWFEQTtJQUFEQSxnQkFBQ0E7QUFBREEsQ0FBQ0EsQUFmRCxJQWVDO0FBWlksaUJBQVMsWUFZckIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWJyYWluZnVjayc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnY29kZWJsb2NrW2JyYWluZnVja10nXG59KVxuZXhwb3J0IGNsYXNzIEJyYWluZnVjayB7XG5cbiAgY29kZWJsb2NrOmFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOkVsZW1lbnRSZWYpIHsgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBnZXQgdGhlIGhvc3RcbiAgICB0aGlzLmNvZGVibG9jayA9ICg8YW55PnRoaXMuZWwpLmludGVybmFsRWxlbWVudC5jb21wb25lbnRWaWV3LmNvbnRleHQ7XG4gICAgdGhpcy5jb2RlYmxvY2subGFuZ3VhZ2UgPSAnYnJhaW5mdWNrJztcbiAgfVxuXG59XG4iXX0=