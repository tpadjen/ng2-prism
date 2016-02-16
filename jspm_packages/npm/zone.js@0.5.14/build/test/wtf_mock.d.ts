declare var log: any[];
declare var logArgs: any[];
declare var wtfMock: {
    log: any[];
    logArgs: any[];
    reset: () => void;
    trace: {
        leaveScope: (scope: any, returnValue: any) => any;
        beginTimeRange: (type: any, action: any) => () => void;
        endTimeRange: (range: any) => void;
        events: {
            createScope: (signature: any, flags: any) => () => (retValue: any) => any;
            createInstance: (signature: any, flags: any) => () => void;
        };
    };
};
