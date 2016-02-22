import {Injectable} from "angular2/core";

@Injectable()
export class LinklistService {

  list: Array<any> = [];

  push(link) {
    this.list.push(link);
  }

}
