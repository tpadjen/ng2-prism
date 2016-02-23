import {
  Directive,
  Input,
  Output,
  HostBinding,
  HostListener,
  ElementRef,
  EventEmitter,
  OnInit
} from 'angular2/core';

@Directive({
  selector: '[animate]'
})
export class Animator implements OnInit {

  @Input() set animDuration(duration:number) {
    this._duration = duration;
    this._setCss();
  }
  @Output() animEnd: EventEmitter<string> = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this._setCss();
  }

  @HostBinding('class.animated') get animated() { return this._animation != null; }

  _animation: string;
  _duration: number;

  animate(animation: string) {
    if (this._animation) { this.finish(); }
    this._animation = animation;
    this._addHostClass(animation);
  }

  @HostListener('webkitAnimationEnd')
  @HostListener('mozAnimationEnd')
  @HostListener('MSAnimationEnd')
  @HostListener('oanimationend')
  @HostListener('animationend')
  finish() {
    if (!this.animated) return;

    this._removeHostClass(this._animation);
    let a = this._animation;
    this._animation = null;
    this.animEnd.next(a);
  }

  _addHostClass(className) {
    this.el.nativeElement.classList.add(className);
  }

  _removeHostClass(className) {
    this.el.nativeElement.classList.remove(className);
  }

  _setCss() {
    this._setVendor(this.el.nativeElement, 'animationDuration', this._duration + 's');
  }

  _setVendor(element, prop, value) {
    let Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    element.style["webkit" + Prop] = value;
    element.style["moz" + Prop] = value;
    element.style["ms" + Prop] = value;
    element.style["o" + Prop] = value;
    element.style[prop] = value;
  }

}
