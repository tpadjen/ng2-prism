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
      element: elem,
      getPosition() {
        let y = 0;

        let e = this.element;
        while(e) {
          y += (e.offsetTop - e.scrollTop + e.clientTop);
          e = e.offsetParent;
        }
        return y;
      }
    }
    this._listService.push(link);
  }

}
