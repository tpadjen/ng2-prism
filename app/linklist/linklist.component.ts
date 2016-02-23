import {Component, Input} from "angular2/core";
import {LinklistService} from "./linklist.service";

@Component({
  selector: 'linklist',
  template: `
    <div class="background" [class.hidden]="hideMenu" (click)="hideMenu = true"></div>
    <button (click)="buttonClicked()">Sections <i class="fa fa-caret-down"></i></button>
    <ul [class.hidden]="hideMenu" [class.animated]="animating" [class.fadeIn]="animating"
      (webkitAnimationEnd)="finishAnimation()"
      (mozAnimationEnd)="finishAnimation()"
      (MSAnimationEnd)="finishAnimation()"
      (oanimationend)="finishAnimation()"
      (animationend)="finishAnimation()">
      <li *ngFor="#item of listService.list">
        <a href="#{{item.id}}" (click)="sectionSelected(item, $event)"><span [style.padding-left]="padding(item)">{{item.text}}</span></a>
      </li>
    </ul>
  `,
  styleUrls: [`app/linklist/linklist.component.css`]
})
export class LinklistComponent {

  @Input() indent: number = 8;
  hideMenu = true;
  animating = false;

  constructor(public listService: LinklistService) { }

  padding(item) {
    return item.level*this.indent + 'px';
  }

  sectionSelected(item, $event) {
    this.hideMenu = true;
  }

  buttonClicked() {
    this.hideMenu = !this.hideMenu;
    if (!this.hideMenu) {
      this.animating = true;
    }
  }

  finishAnimation() {

    console.log("Animation finished: " + this.animating);

    this.animating = false;
  }

}
