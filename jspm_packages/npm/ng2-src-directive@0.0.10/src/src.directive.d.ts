import { AppViewManager, ElementRef, OnInit, OnDestroy, Renderer } from 'angular2/core';
import { Http, Response } from 'angular2/http';
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
export declare var SourceDebounceTime: number;
export declare class SrcDirective implements OnInit, OnDestroy {
    private _element;
    private _viewManager;
    private _http;
    private _renderer;
    private _sourceDebounceTime;
    host: Sourcable;
    _src: string;
    src: string;
    constructor(_element: ElementRef, _viewManager: AppViewManager, _http: Http, _renderer: Renderer, _sourceDebounceTime: number);
    ngOnInit(): void;
    /**
     * Set the amount of time in ms to wait before processing changes to the src input.
     *
     * This can prevent unnecessary http requests. The default is 300ms.
     */
    debounceTime: any;
    _debounceTime: number;
    sourceChanged: Subject<string>;
    _subscription: any;
    _firstRequest: boolean;
    _handleSourceChanges(): void;
    ngOnDestroy(): void;
    _emptySources(source: any): boolean;
    _addExtensionMatches(source: any): {
        source: any;
        extMatches: any;
    };
    _nonFiles(req: any): boolean;
    _fetchSrc(req: any): Observable<Response>;
}
