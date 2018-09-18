import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { GooglePlus } from 'ionic-native';
/*
  Generated class for the Googleservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class Googleservice {

  constructor(public http: Http,
    private googlePlus: GooglePlus) {
    console.log('Hello Googleservice Provider');
  }


  login() {
    return GooglePlus.login({
      'scopes': 'https://www.google.com/m8/feeds',
      'androidClientId': '573140317262-4117puh86ulickmroqo59vk95re9e59c.apps.googleusercontent.com',
      'offline': true,
    }).then((res) => {
      console.log("Login google plus success: " + Object.getOwnPropertyNames(res));
      console.log("User ID: " + res.userId + '/ toKen: ' + res.accessToken);
      return res
    }, (err) => {
      console.log("Login google plus error: " + err);
      return "error"
    });

  }

  logout() {
    GooglePlus.logout().then(() => {
      console.log("logged out");
    });
  }

  getContactGoogle(url) {
    var response = this.http.get(url).map(res => res.json());
    return response;
    // this.http.get(url)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     console.log('get all Contact success ' + data)
    //     return data
    //   }, error => {
    //     console.log('get all Contact success ' + error)
    //     return "error"
    //   })
  }

  getGroupContactGoogle(url) {
    var response = this.http.get(url).map(res => res.json());
    return response;
    // this.http.get(url)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     console.log('get all Contact success ' + data)
    //     return data
    //   }, error => {
    //     console.log('get all Contact success ' + error)
    //     return "error"
    //   })
  }

}
