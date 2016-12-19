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

  @Input()
  public set src(source: string) {
    this._src = source;
    this.sourceChanged.next(source);
  }

  /**
   * Set the amount of time in ms to wait before processing changes to the src input.
   *
   * This can prevent unnecessary http requests. The default is 300ms.
   */
  @Input()
  public set debounceTime(time: any) {
    let parsed = parseInt(time, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      this._debounceTime = parsed;
    }
  }

  public get debounceTime(): number | any {
    return this._debounceTime;
  }

  public sourceChanged: Subject<string> = new Subject();

  private _debounceTime: number = 300;
  private _subscription: any;
  private _firstRequest: boolean = true;

  private _src: string;
  private _element: ElementRef;
  private _http: Http;
  private _renderer: Renderer;
  private _sourceDebounceTime: number;

  public constructor(_element: ElementRef, _http: Http, _renderer: Renderer,
                     @Optional() @Inject(SourceDebounceTime) _sourceDebounceTime: number) {
    this._element = _element;
    this._http = _http;
    this._renderer = _renderer;
    this._sourceDebounceTime = _sourceDebounceTime;
  }

  public ngOnInit(): any {
    this.host = this._element as Sourcable;
    if (this.host as any === this) {
      this.host = this._element;
    }
    if (this._sourceDebounceTime) {
      this.debounceTime = this._sourceDebounceTime;
    }

    this._handleSourceChanges();

    if (this._src) {
      this.sourceChanged.next(this._src);
    }
  }

  public ngOnDestroy(): any {
    this._subscription.dispose();
  }

  private _handleSourceChanges(): any {
    this._subscription = this.sourceChanged
      .do((source: string) => {
        if (this.host.sourceChanged) {
          this.host.sourceChanged(source);
        }
      })
      .filter((source: string) => {
        return this._emptySources(source);
      })
      .map((source: string) => {
        return this._addExtensionMatches(source);
      })
      .filter((req: any) => {
        return this._nonFiles(req);
      })
      .distinctUntilChanged()
      .do((req: any) => {
        if (this.host.sourceLoading) {
          this.host.sourceLoading(req.source);
        }
      })
      .debounce(() => Observable.timer(this._firstRequest ? 0 : this.debounceTime))
      .do(() => this._firstRequest = false)
      .switchMap((req: any) => {
        return this._fetchSrc(req);
      })
      .catch((error: any) => {
        if (this.host.sourceError) {
          this.host.sourceError(error);
        }
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
        (error: any) => {
          if (this.host.sourceError) {
            this.host.sourceError(error);
          }
          console.error(error);
        }
      );
  }

  private _emptySources(source: any): boolean {
    return !(source === undefined || source === null || source === '');
  }

  private _addExtensionMatches(source: any): Object {
    return {source, extMatches: source.match(/\.(\w+)$/)};
  }

  private _nonFiles(req: any): boolean {
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

  private _fetchSrc(req: any): Observable<Response> {
    return this._http
      .get(req.source)
      .catch((error: any) => {
        if (this.host.sourceError) {
          this.host.sourceError({message: `${req.source} not found.`});
        }
        return Observable.empty();
      });
  }
}
