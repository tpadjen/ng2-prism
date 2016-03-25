import {Response} from 'angular2/http';

export {Response} from 'angular2/http';

export interface Sourcable {
  sourceChanged: () => void;
  sourceLoading: () => void;
  sourceError: (string) => void;
  sourceReceived: (Response) => void;
}

export function implementsSourcable(obj: any) {
  return  obj.sourceChanged   &&
          obj.sourceLoading   &&
          obj.sourceError     &&
          obj.sourceReceived;
}
