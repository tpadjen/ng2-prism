export interface WtfScopeFn {
    (...args: any[]): any;
}
export interface WtfEventFn {
    (...args: any[]): any;
}
export declare const enabled: boolean;
export declare const createScope: (signature: string, flags?: any) => WtfScopeFn;
export declare const createEvent: (signature: string, action?: string) => WtfEventFn;
export declare const leaveScope: (scope: WtfScopeFn, returnValue: any) => any;
export declare const beginTimeRange: (rangeType: any, action: any) => any;
export declare const endTimeRange: (range: any) => void;
