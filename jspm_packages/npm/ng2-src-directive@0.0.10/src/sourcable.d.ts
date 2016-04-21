export { Response } from 'angular2/http';
export interface OnSourceChanged {
    sourceChanged: (string) => void;
}
export interface OnSourceLoading {
    sourceLoading: (string) => void;
}
export interface OnSourceError {
    sourceError: (any) => void;
}
export interface OnSourceReceived {
    sourceReceived: (Response) => void;
}
export interface Sourcable {
    sourceChanged?: (string) => void;
    sourceLoading?: (string) => void;
    sourceError?: (any) => void;
    sourceReceived?: (Response) => void;
}
