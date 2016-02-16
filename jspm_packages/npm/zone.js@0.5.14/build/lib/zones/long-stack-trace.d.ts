export declare const longStackTraceZone: {
    getLongStacktrace: (exception: any) => string;
    stackFramesFilter: (line: any) => boolean;
    onError: (exception: any) => void;
    '$fork': (parentFork: any) => () => any;
};
