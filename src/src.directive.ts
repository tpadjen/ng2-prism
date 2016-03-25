import {
  AppViewManager,
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy
} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {
  Sourcable,
  implementsSourcable
} from './sourcable';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';


@Directive({selector: '[src]'})
export class SrcDirective implements OnInit, OnDestroy {

  host: Sourcable;
  @Input() set src(source: string) { this.sourceChanged.next(source); }

  constructor(
    private _element: ElementRef,
    private _viewManager: AppViewManager,
    private _http: Http) { }

  ngOnInit() {
    this.host = <Sourcable>this._viewManager.getComponent(this._element);

    if (implementsSourcable(this.host)) {
      this._handleSourceChanges();
    } else { // is not a proper Sourcable host
      let tagName = this._element.nativeElement.localName;
      let validSrcTags = ['img', 'script'];
      if (validSrcTags.indexOf(tagName) === -1) {
        console.warn(tagName +
          " has a src directive but the component does not implement the Sourcable interface.");
        }
    }

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
  _subscription;

  _handleSourceChanges() {
     this._subscription = this.sourceChanged
      .do(() => { this.host.sourceChanged(); })
      .filter(source => { return this._emptySources(source); })
      .map(source => { return this._addExtensionMatches(source); })
      .filter(req => { return this._nonFiles(req); })
      .distinctUntilChanged()
      .do(() => { this.host.sourceLoading(); })
      .debounceTime(this.debounceTime)
      .switchMap(req => { return this._fetchSrc(req); })
      .catch((error) => {
        this.host.sourceError(error);
        console.error(error);
        return Observable.empty();
      })
      .subscribe(
        (res: Response) => { this.host.sourceReceived(res); },
        error => { this._handleResponseError(error); }
      );
  }

  ngOnDestroy() {
    this._subscription.dispose();
  }

  _emptySources(source) {
    return !(source === undefined || source == null);
  }

  _addExtensionMatches(source) {
    return {
      source: source,
      extMatches: source.match(/\.(\w+)$/)
    };
  }

  _nonFiles(req) {
    if (!req.extMatches) {
      if (req.source && req.source.length > 0) {
        this.host.sourceError({message: `${req.source} is not a file.`});
      } else {
        this.host.sourceError({message: `No source file given.`});
      }
      return false;
    }
    return true;
  }

  _fetchSrc(req) {
    return this._http.get(req.source)
                .catch((error) => {
                  this.host.sourceError({message: `${req.source} not found.`});
                  return Observable.empty();
                });
  }

  _handleResponseError(error) {
    console.error(error);
  }

}
