export declare class Zone {
    static nextId: number;
    static bindPromiseFn: any;
    parent: Zone;
    $id: number;
    constructor(parentZone?: any, data?: any);
    fork(locals?: any): Zone;
    bind(fn: any, skipEnqueue?: any): () => any;
    bindOnce(fn: any): () => any;
    isRootZone(): boolean;
    run(fn: any, applyTo?: any, applyWith?: any): any;
    onError: any;
    beforeTask(): void;
    onZoneCreated(): void;
    afterTask(): void;
    enqueueTask(fn: Function): void;
    dequeueTask(fn: Function): void;
    addTask(taskFn: any): void;
    removeTask(taskFn: any): void;
    addRepeatingTask(taskFn: any): void;
    removeRepeatingTask(taskFn: any): void;
    addMicrotask(taskFn: any): void;
    removeMicrotask(taskFn: any): void;
    addEventListener(): any;
    removeEventListener(): any;
}
