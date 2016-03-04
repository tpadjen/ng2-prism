import {
  Directive,
  Input,
  OnInit,
  HostBinding,
  ElementRef,
  NgZone
} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';
import {Ruler} from 'angular2/src/platform/browser/ruler';

@Directive({
  selector: '[sticky]'
})
export class Sticky implements OnInit {

  /**
   * The top position style of the element when stuck. Measured in pixels
   */
  @Input() top: number = 0;

  /**
   * Add a class of 'stuck' to the host element when stuck.
   */
  @HostBinding('class.stuck') stuck: boolean;

  /**
   * Make the host element position: fixed when stuck.
   */
  @HostBinding('style.position') get position(): string {
    return this.stuck ? "fixed" : "";
  }

  /**
   * The distance from the top of the window to the host element. Measured in pixels.
   */
  topOffset: number = 0;

  /**
   * The current distance from the left edge of the window. Measured in pixels
   */
  positionLeft: number = 0;

  /**
   * Add positioning styles to keep the element sticky.
   */
  @HostBinding('style.top')   get topStyle()   {
    return this.stuck ? this.top + "px" : "";
  }
  @HostBinding('style.left') get leftStyle() {
    return this.stuck ? this.positionLeft + "px" : "";
  }

  domAdapter: BrowserDomAdapter;
  ruler;

  constructor(
    private _el: ElementRef,
    private _zone: NgZone) {
      this.domAdapter = new BrowserDomAdapter();
      this.ruler = new Ruler(this.domAdapter);

  }

  ngOnInit() {
    this.ruler.measure(this._el).then((rect) => {
      this.topOffset = rect.top;

      this._stickOnScroll();
      this._stickOnResize();
      this._stickIfLoadedNotAtTop();
    });
  }

  _stick() {
    this._findPositionLeft().then(() => {
      this.stuck = true;
    });
  }

  _unstick() {
    this.stuck = false;
  }

  _findPositionLeft() {
    return this.ruler.measure(this._el).then((rect) => {
      this.positionLeft = rect.left;
    });

  }

  _stickOnScroll() {
    window.onscroll = () => {
      this._zone.run(() => {
        if (this._shouldBeStuck()) {
          this._stick();
        } else {
          this._unstick();
        }
      });
    };
  }

  _shouldBeStuck() {
    return document.body.scrollTop + document.documentElement.scrollTop > this._stickTop;
  }

  _stickOnResize() {
    window.onresize = () => {
      this._zone.run(() => {
        if (this.stuck) {
          // unstick
          this._el.nativeElement.style.left = "";
          this._el.nativeElement.style.position = "";
          this._el.nativeElement.classList.remove("stuck");

          // find new left position
          this._findPositionLeft().then(() => {
            // re-stick
            this._el.nativeElement.style.left = (this.positionLeft) + "px";
            this._el.nativeElement.style.position = "fixed";
            this._el.nativeElement.classList.add("stuck");
          });
        }
      });
    };
  }

  _stickIfLoadedNotAtTop() {
    if (!this.stuck && this._scrollTop > this._stickTop) {
      this._stick();
    }
  }

  get _stickTop(): number {
    return this.topOffset - this.top;
  }

  get _scrollTop(): number {
    let doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  }


}
