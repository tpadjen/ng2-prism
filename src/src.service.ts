import {
  Injectable,
  OnDestroy
} from 'angular2/core';
import {Http} from 'angular2/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

export interface Source {
  src: string;
  ext: string;
  text: string;
}

export interface Sourcable {
  srcChanged: Observable<any>;
  validatedSource: (string) => void;
  showLoading: () => void;
  message: (string) => void;
  handleSourceChange: (Source) => void;
}


@Injectable()
export class SrcService implements OnDestroy {

  debounceTime: number = 300;

  constructor(
    private _http: Http) { }

  _host: Sourcable;

  set host(host: Sourcable) {
    this._host = host;
    this._handleSrcChanges();
  }

  get host(): Sourcable {
    return this._host;
  }

  _srcChangedSubscription;

  _handleSrcChanges() {
    this._srcChangedSubscription = this.host.srcChanged
      .filter(source => { return this._emptySources(source); })
      .map(source => { return this._addExtensionMatches(source); })
      .filter(req => { return this._nonFiles(req); })
      .distinctUntilChanged()
      .do(() => { this.host.showLoading(); })
      .debounceTime(this.debounceTime)
      .do((req: any) => { this.host.validatedSource(req.source); })
      .switchMap(req => { return this._fetchSrc(req); })
      .catch((error) => {
        this.host.message("Error: Could not download file.");
        console.error(error);
        return Observable.empty();
      })
      .subscribe(
        (res: Source) => { this.host.handleSourceChange(res); },
        error => { this._handleResponseError(error); }
      );
  }

  ngOnDestroy() {
    this._srcChangedSubscription.dispose();
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
        this.host.message(`${req.source} is not a file.`);
      } else {
        this.host.message(`No source file given.`);
      }
      return false;
    }
    return true;
  }

  _fetchSrc(req) {
    return this._http.get(req.source)
                .catch((error) => {
                  this.host.message(`${req.source} not found.`);
                  return Observable.empty();
                })
                .map(res => {
                  return {
                    src: req.source,
                    ext: req.extMatches[1],
                    text: res.text()
                  };
                });
  }

  _handleResponseError(error) {
    console.error("SrcService Error");
    console.error(error);
  }

}
