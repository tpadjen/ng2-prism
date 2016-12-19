import { Response } from '@angular/http';
export { Response } from '@angular/http';

export interface OnSourceChanged {
  sourceChanged: (val: string) => void;
}

export interface OnSourceLoading {
  sourceLoading: (val: string) => void;
}

export interface OnSourceError {
  sourceError: (val: any) => void;
}

export interface OnSourceReceived {
  sourceReceived: (Response: Response) => void;
}

export interface Sourcable {
  sourceChanged?: (val: string) => void;
  sourceLoading?: (val: string) => void;
  sourceError?: (val: any) => void;
  sourceReceived?: (Response: Response) => void;
}
