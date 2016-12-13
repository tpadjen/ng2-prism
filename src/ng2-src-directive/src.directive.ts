import { Directive, ElementRef, Inject, Input, OnInit, OnDestroy, Optional, Renderer } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Sourcable } from './sourcable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

export const SourceDebounceTime: number = 300;

@Directive({selector: '[src]'})
export class SrcDirective implements OnInit, OnDestroy {

  public host: Sourcable;

  @Input() set src(source: string) {
    this._src = source;
    this.sourceChanged.next(source);
  }

  private _src: string;
  constructor(private _element: ElementRef,
              private _http: Http,
              private _renderer: Renderer,
              @Optional() @Inject(SourceDebounceTime) private _sourceDebounceTime: number) {
  }

  ngOnInit() {
    this.host = <Sourcable>this._element;
    if (<any>this.host === this) this.host = this._element;
    if (this._sourceDebounceTime) this.debounceTime = this._sourceDebounceTime;

    this._handleSourceChanges();
    if (this._src) this.sourceChanged.next(this._src);
  }

  /**
   * Set the amount of time in ms to wait before processing changes to the src input.
   *
   * This can prevent unnecessary http requests. The default is 300ms.
   */
  @Input() set debounceTime(time: any) {
    let parsed = parseInt(time, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      this._debounceTime = parsed;
    }
  }

  get debounceTime(): number | any {
    return this._debounceTime;
  }

  _debounceTime: number = 300;

  sourceChanged: Subject<string> = new Subject();
  _subscription:any;
  _firstRequest: boolean = true;

  _handleSourceChanges() {
    this._subscription = this.sourceChanged
      .do(source => {
        if (this.host.sourceChanged) this.host.sourceChanged(source);
      })
      .filter(source => {
        return this._emptySources(source);
      })
      .map(source => {
        return this._addExtensionMatches(source);
      })
      .filter(req => {
        return this._nonFiles(req);
      })
      .distinctUntilChanged()
      .do(req => {
        if (this.host.sourceLoading) this.host.sourceLoading(req.source);
      })
      .debounce(() => Observable.timer(this._firstRequest ? 0 : this.debounceTime))
      .do(() => this._firstRequest = false)
      .switchMap(req => {
        return this._fetchSrc(req);
      })
      .catch((error) => {
        if (this.host.sourceError) this.host.sourceError(error);
        console.error(error);
        return Observable.empty();
      })
      .subscribe(
        (res: Response) => {
          if (this.host.sourceReceived) {
            this.host.sourceReceived(res);
          } else {
            this._renderer.setElementProperty(
              this._element.nativeElement, 'innerHTML', res.text());
          }
        },
        error => {
          if (this.host.sourceError) this.host.sourceError(error);
          console.error(error);
        }
      );
  }

  ngOnDestroy() {
    this._subscription.dispose();
  }

  _emptySources(source:any) {
    return !(source === undefined || source === null || source === '');
  }

  _addExtensionMatches(source:any) {
    return {
      source: source,
      extMatches: source.match(/\.(\w+)$/)
    };
  }

  _nonFiles(req:any) {
    if (!req.extMatches) {
      if (req.source && req.source.length > 0) {
        if (this.host.sourceError) {
          this.host.sourceError({message: `${req.source} is not a file.`});
        }
      } else {
        if (this.host.sourceError) {
          this.host.sourceError({message: `No source file given.`});
        }
      }
      return false;
    }
    return true;
  }

  _fetchSrc(req:any) {
    return this._http.get(req.source)
      .catch((error) => {
        if (this.host.sourceError) {
          this.host.sourceError({message: `${req.source} not found.`});
        }
        return Observable.empty();
      });
  }
}
