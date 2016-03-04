import {
  Component,
  Input,
  ViewChild
} from "angular2/core";
import {LinklistService} from "./linklist.service";
import {Animator} from './animator.directive';

import {Sticky} from '../sticky/sticky.directive';

@Component({
  selector: 'linklist',
  template: `
    <div class="linklist" sticky>
      <div class="background" [class.hidden]="menuHidden" (click)="hideMenu()"></div>
      <button (click)="buttonClicked()">Sections <i class="fa fa-caret-down"></i></button>
      <ul [class.hidden]="menuHidden" animate animDuration="0.33" (animEnd)="animEnded($event)">
        <li *ngFor="#item of listService.list">
          <a
            href="#{{item.id}}"
            (click)="sectionSelected(item, $event)"
          ><span
            [style.padding-left]="padding(item)"
          >{{item.text}}</span></a>
        </li>
      </ul>
    </div>
  `,
  styleUrls: [`app/linklist/linklist.component.css`],
  directives: [Animator, Sticky]
})
export class LinklistComponent {

  @Input() indent: number = 8;
  menuHidden = true;

  @ViewChild(Animator) private animator: Animator;

  topOffset: number;

  constructor(
    public listService: LinklistService) { }

  padding(item) {
    return item.level*this.indent + 'px';
  }

  sectionSelected(item, $event) {
    this.menuHidden = true;
  }

  buttonClicked() {
    if (this.menuHidden) {
      this.animator.animate('fadeIn');
    } else {
      this.animator.finish();
    }
    this.menuHidden = !this.menuHidden;
  }

  hideMenu() {
    this.menuHidden = true;
    this.animator.finish();
  }

  animEnded(name) {
    // console.log("Animation finished: " + name);
  }


}
