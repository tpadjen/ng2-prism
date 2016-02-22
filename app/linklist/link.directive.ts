import {Directive, ElementRef} from 'angular2/core';
import {LinklistService} from './linklist.service';

@Directive({
  selector: '[link]'
})
export class LinkDirective {

  constructor(private _listService: LinklistService, private el:ElementRef) { }

  ngOnInit() {
    let link: any = {
      id: this.el.nativeElement.id,
      text: this.el.nativeElement.innerHTML,
      level: this.el.nativeElement.localName == "h2" ? 0 : 1
    }
    this._listService.push(link);
  }

}
