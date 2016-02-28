import {
  Injectable,
  OnDestroy
} from 'angular2/core';
import {Http} from 'angular2/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import {CodeblockComponent} from './codeblock.component';


@Injectable()
export class SrcService implements OnDestroy {

  debounceTime: number = 300;

  constructor(
    private _http: Http) { }

  _host: CodeblockComponent;

  set host(host: CodeblockComponent) {
    this._host = host;
    this._handleSrcChanges();
  }

  _srcChangedSubscription;

  _handleSrcChanges() {
    this._srcChangedSubscription = this._host.srcChanged
      .filter(source => { return this._emptySources(source); })
      .map(source => { return this._addExtensionMatches(source); })
      .filter(req => { return this._nonFiles(req); })
      .distinctUntilChanged()
      .do(() => { this._showLoading(); })
      .debounceTime(this.debounceTime)
      .do(req => { this._setHostSrc(req); })
      .switchMap(req => { return this._fetchSrc(req); })
      .retry()
      .subscribe(
        res => { this._handleResponseSuccess(res); },
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
        this._host._notAFile(req.source);
      } else {
        this._host._noFileGiven();
      }
      return false;
    }
    return true;
  }

  _showLoading() {
    this._host._showLoading();
  }

  _setHostSrc(req) {
    this._host._src = req.source;
  }

  _fetchSrc(req) {
    return this._http.get(req.source)
                .catch((error) => {
                  this._host._notFound(req.source);
                  return Observable.empty();
                })
                .map(res => {
                  return {
                    src: req.source,
                    extMatches: req.extMatches,
                    text: res.text()
                  };
                });
  }

  _handleResponseSuccess(res) {
    let fileLang = CodeblockComponent.EXTENSION_MAP[res.extMatches[1]] || res.extMatches[1];
    if (!this._host._languageSet) { this._host._language = fileLang; }
    this._host.code = res.text;
  }

  _handleResponseError(error) {
    console.log("SrcService Error");
    console.log(error);
  }

}
