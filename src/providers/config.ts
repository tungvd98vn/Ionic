import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the Googleservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class Configservice {
  flagSet: number = 0;
  flagPage: number = 0;
  setTake: number

  constructor(public http: Http) {
    console.log('Hello Googleservice Provider');
  }

  changeSet() {
    this.flagSet = 1;
  }
  changePage() {
    this.flagPage = 1;
  }


}
