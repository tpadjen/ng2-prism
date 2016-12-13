import {Response} from '@angular/http';
export {Response} from '@angular/http';

export interface OnSourceChanged {
  sourceChanged: (string:string) => void;
}

export interface OnSourceLoading {
  sourceLoading: (string:string) => void;
}

export interface OnSourceError {
  sourceError: (any:any) => void;
}

export interface OnSourceReceived {
  sourceReceived: (Response:Response) => void;
}

export interface Sourcable {
  sourceChanged?: (string:string) => void;
  sourceLoading?: (string:string) => void;
  sourceError?: (any:any) => void;
  sourceReceived?: (Response:Response) => void;
}
