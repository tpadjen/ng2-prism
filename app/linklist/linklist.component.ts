import {Component, Input} from "angular2/core";
import {LinklistService} from "./linklist.service";

@Component({
  selector: 'linklist',
  template: `
    <div class="background" [class.hidden]="hideMenu" (click)="hideMenu = true"></div>
    <button (click)="hideMenu = !hideMenu">Sections <i class="fa fa-caret-down"></i></button>
    <ul [class.hidden]="hideMenu">
      <li *ngFor="#item of listService.list">
        <a href="#{{item.id}}" (click)="hideMenu = true"><span [style.padding-left]="padding(item)">{{item.text}}</span></a>
      </li>
    </ul>
  `,
  styleUrls: [`app/linklist/linklist.component.css`]
})
export class LinklistComponent {

  @Input() indent: number = 8;
  hideMenu = true;

  constructor(public listService: LinklistService) { }

  padding(item) {
    return item.level*this.indent + 'px';
  }


}
