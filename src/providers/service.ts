import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
//
import 'rxjs/add/operator/map';
// import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from "ionic-angular";
declare var $: any
//  , jQuery
/*
  Generated class for the Service provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Service {
  // db: SQLiteObject = null

  flagSet: number = 0;
  setTake: number

  constructor(public http: Http,
    // private sqlite: SQLite,
    public nativeStorage: NativeStorage,
    public alertCtrl: AlertController) {

    // this.sqlite.create({
    //   name: 'data.db',
    //   location: 'default'
    // })
    //   .then((db: SQLiteObject) => {
    //     this.setDatabase(db)
    //     console.log("create - open db success")
    //     //create DB Cart
    //     let sql = 'CREATE TABLE IF NOT EXISTS cart(id INTEGER PRIMARY KEY, idsp INTEGER, name TEXT, price TEXT, image TEXT, discription TEXT, soluong TEXT)';
    //     db.executeSql(sql, []).then(
    //       response => {
    //         console.log('create Table cart success')
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       });

    //     //create DB Product
    //     let sql3 = 'CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY, name TEXT, price TEXT, image TEXT, discription TEXT, amount INTEGER)';
    //     db.executeSql(sql3, []).then(
    //       response => {
    //         console.log('create Table Product success')
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       });

    //     //create DB Token
    //     var sql2 = "CREATE TABLE IF NOT EXISTS token(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, token_id VARCHAR)"
    //     db.executeSql(sql2, []).then(
    //       value => {
    //         console.log("create Table Token ss: " + Object.getOwnPropertyNames(value))
    //       })

    //     db.executeSql("delete from token", []).then(data => {
    //       console.log("Delete all token success")
    //     }, error => {
    //       console.log("Delete all token error")
    //     })



    //   })
    //   .catch(e => console.log(e));
  }
  changeSet() {
    this.flagSet = 1;
  }
  // config db
  // setDatabase(db: SQLiteObject) {
  //   if (this.db === null) {
  //     this.db = db;
  //   }
  // }

  //    let sql3 = "INSERT INTO cart(id, name, discription, image, price, soluong) VALUES(?,?,?,?,?,?)";
  // this.db.executeSql(sql3, [data.id, data.name, data.discription, data.image, data.price, "1"]).then(response => {
  //   console.log('insert item to cart SQLite success')
  // }).catch(error => {
  //   console.log('insert  new error: ' + error.message)
  // })

  // executeSqlite(query) {
  //   var result = this.db.executeSql(query, []);
  //   return result;
  // }

  // insertProduct(sql, data: any) {
  //   var result = this.db.executeSql(sql, [data.id, data.name, data.price, data.image, data.discription, 1]);
  //   return result;
  // }

  // selectSPWithId(sql, data: any) {
  //   var result = this.db.executeSql(sql, [data.id]);
  //   return result;
  // }


  // updateAmountProduct(sql, soluong, data: any) {
  //   var result = this.db.executeSql(sql, [soluong, data.id]);
  //   return result;
  // }


  // selectItemCartWithId(sql, data: any) {
  //   var result = this.db.executeSql(sql, [data.id]);
  //   return result;
  // }

  // insertItemCartSQL(sql, data: any) {
  //   var result = this.db.executeSql(sql, [data.id, data.id, data.name, data.discription, data.image, data.price_sale, "1"]);
  //   return result;
  // }

  // updateSoLuongItemCart(sql, soluong, data: any) {
  //   var result = this.db.executeSql(sql, [soluong, data.id]);
  //   return result;
  // }

  // insertTokenSql(query, data, t) {
  //   return this.db.executeSql(query, [data.user.id, t.token]).then(
  //     response => {
  //       console.log('insert token_id SQLite success')
  //       return response
  //     }).catch(
  //     error => {
  //       console.log('insert token_id new error: ' + error.message)
  //       return error
  //     })
  // }

  postRegisterTokenId(url, body) {
    //this.service.getAPI()
    //  var body = ('username=' + this.txtEmail + '&' + 'password=' + this.txtPassword);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(url, body, {
      headers: headers
    })
      .map(res => res.json())
      .subscribe(data => {
        if (data.status == 'ok') {
          console.log('Saved Token_Id success')
        }
      })
  }

  postDeleteTokenId(url, body) {
    //this.service.getAPI()
    //  var body = ('username=' + this.txtEmail + '&' + 'password=' + this.txtPassword);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var result = this.http.post(url, body, { headers: headers }).map(res => res.json())
    return result
  }

  postPushNotification(url, body) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMmVjZjhmNi1lNjQ4LTRkZjctYjNlOS0zNGNmYzhjOGQ0NTEifQ.doPt4vGd-J3yKAzKWZlZnW5E4UAs1lsnYb11bVjxkyA');

    var result = this.http.post(url, body, { headers: headers }).map(res => res.json());
    return result;
  }


  getAPI(url) {
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  getAPINoJson(url) {
    var response = this.http.get(url).map(res => res.text());
    return response;
  }

  getDataNativeStore(msg) {
    //set data user
    var data = this.nativeStorage.getItem(msg)
    return data;
  }

  setDataNativeStore(msg) {
    //set data user
    var data = this.nativeStorage.setItem(msg, {})
    return data;
  }

  removeDataNativeStore(msg) {
    //set data user

    console.log('msg :' + msg)
    var data = this.nativeStorage.remove(msg)
    return data;
  }
  postAPI(url, body) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    var result = this.http.post(url, body, { headers: headers }).map(res => res.json());
    return result;
  }
  dialog(message) {
    let alert = this.alertCtrl.create({
      title: 'THÔNG BÁO',
      message: message,
      buttons: [{
        text: 'OK',
        role: 'cancel',
      }],
      cssClass: 'alert'
    });
    alert.present();
    $('.alert-button').addClass('oneBtn');
  }

}
