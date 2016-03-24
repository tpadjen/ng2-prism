import { OnDestroy } from 'angular2/core';
import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { CodeblockComponent } from './codeblock.component';
export declare class SrcService implements OnDestroy {
    private _http;
    debounceTime: number;
    constructor(_http: Http);
    _host: CodeblockComponent;
    host: CodeblockComponent;
    _srcChangedSubscription: any;
    _handleSrcChanges(): void;
    ngOnDestroy(): void;
    _emptySources(source: any): boolean;
    _addExtensionMatches(source: any): {
        source: any;
        extMatches: any;
    };
    _nonFiles(req: any): boolean;
    _fetchSrc(req: any): Observable<{
        src: any;
        extMatches: any;
        text: string;
    }>;
    _handleResponseSuccess(res: any): void;
    _handleResponseError(error: any): void;
}
