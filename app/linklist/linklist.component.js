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
var core_1 = require("angular2/core");
var linklist_service_1 = require("./linklist.service");
var animator_directive_1 = require('./animator.directive');
var sticky_directive_1 = require('../sticky/sticky.directive');
var LinklistComponent = (function () {
    function LinklistComponent(listService) {
        this.listService = listService;
        this.indent = 8;
        this.menuHidden = true;
    }
    LinklistComponent.prototype.padding = function (item) {
        return item.level * this.indent + 'px';
    };
    LinklistComponent.prototype.sectionSelected = function (item, $event) {
        this.menuHidden = true;
    };
    LinklistComponent.prototype.buttonClicked = function () {
        if (this.menuHidden) {
            this.animator.animate('fadeIn');
        }
        else {
            this.animator.finish();
        }
        this.menuHidden = !this.menuHidden;
    };
    LinklistComponent.prototype.hideMenu = function () {
        this.menuHidden = true;
        this.animator.finish();
    };
    LinklistComponent.prototype.animEnded = function (name) {
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LinklistComponent.prototype, "indent", void 0);
    __decorate([
        core_1.ViewChild(animator_directive_1.Animator), 
        __metadata('design:type', animator_directive_1.Animator)
    ], LinklistComponent.prototype, "animator", void 0);
    LinklistComponent = __decorate([
        core_1.Component({
            selector: 'linklist',
            template: "\n    <div class=\"linklist\" sticky>\n      <div class=\"background\" [class.hidden]=\"menuHidden\" (click)=\"hideMenu()\"></div>\n      <button (click)=\"buttonClicked()\">Sections <i class=\"fa fa-caret-down\"></i></button>\n      <ul [class.hidden]=\"menuHidden\" animate animDuration=\"0.33\" (animEnd)=\"animEnded($event)\">\n        <li *ngFor=\"#item of listService.list\">\n          <a\n            href=\"#{{item.id}}\"\n            (click)=\"sectionSelected(item, $event)\"\n          ><span\n            [style.padding-left]=\"padding(item)\"\n          >{{item.text}}</span></a>\n        </li>\n      </ul>\n    </div>\n  ",
            styleUrls: ["app/linklist/linklist.component.css"],
            directives: [animator_directive_1.Animator, sticky_directive_1.Sticky]
        }), 
        __metadata('design:paramtypes', [linklist_service_1.LinklistService])
    ], LinklistComponent);
    return LinklistComponent;
}());
exports.LinklistComponent = LinklistComponent;
