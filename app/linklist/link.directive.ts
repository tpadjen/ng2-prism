import {Directive, ElementRef} from 'angular2/core';
import {LinklistService} from './linklist.service';

@Directive({
  selector: '[link]'
})
export class LinkDirective {

  constructor(private _listService: LinklistService, private el:ElementRef) { }

  ngOnInit() {
    let elem = this.el.nativeElement;

    let link: any = {
      id: elem.id,
      text: elem.innerHTML,
      level: elem.localName == "h2" ? 0 : 1,
    }
    this._listService.push(link);
  }

}
