import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { IonicApp } from 'ionic-angular';
import { Platform, MenuController, Nav, AlertController, LoadingController } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { TabsPage } from '../main/main';
import { RegisterPage } from '../register/register';
import { Service } from '../../providers/service'
import { Geolocation } from 'ionic-native';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { ToastService } from "../../providers/toast-service";
import moment from 'moment';
import { HomePage } from "../home/home";
import { EnterphonePage } from "../enterphone/enterphone";
import { ForgotPassPage } from '../forgot-pass/forgot-pass';
import { newTripPage } from '../newTrip/newTrip';
// declare var cordova: any;

export interface PageInterface {
  company_code: any,
  company_name: any
}

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
  //template: 'app.html',
})
export class LoginPage {
  company: PageInterface[] = [];
  public version: any;
  message: string;
  txtEmail: any
  txtPassword: any
  nameDisplay: any;
  emailFB: any;
  urlAvata: any;
  service2: any;
  token_code: any;
  select_company: any;
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public nativeStorage: NativeStorage,
    public fb: Facebook,
    public events: Events,
    public service: Service,
    public push: Push,
    public toast: ToastService,
    public alertCtrl: AlertController,
    public loading: LoadingController
  ) {
    // {
    //   let that = this
    //   cordova.getAppVersion.getVersionNumber(function (versionApp) {
    //     console.log('version app: ' + versionApp)
    //     that.version = versionApp
    //   });
    // }
    // this.txtEmail = '01234567890';
    // this.txtPassword = '1234567';
    // console.log(this.txtEmail, this.txtPassword);
    // this.mLogin('01234567890', '1234567');

    this.service.getDataNativeStore('userLogin').then(dataa => {
      console.log(dataa);
      if ((dataa == null) || (dataa.id == "" || dataa.id == undefined) || (dataa.phone == null || dataa.phone == undefined) ||
        (dataa.password == "" || dataa.password == undefined)) { }
      else {
        console.log(dataa.phone + ' aaaaaaa ' + dataa.password)
        this.txtEmail = dataa.phone;
        this.txtPassword = dataa.password;
        //this.select_company = dataa.company;
        this.mLogin(dataa.phone, dataa.password);

        // this.mLogin(dataa.phone, dataa.password, dataa.company);
      }
    })
  }

  ionViewDidLoad() {
    // this.service.dialog('fix sdsdsdsd');
    console.log('ionViewDidLoad LoginPage');
    this.menu.swipeEnable(false)
    // this.toast.showLoading("Loading...")
    this.service.postAPI('http://117.6.131.222:4010/company/getallcompany', '')
      .subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          this.company.push({
            company_code: data[i].Company_Code,
            company_name: data[i].Company_Name
          })
        }
      })
  }
  forgotPass() {
    this.navCtrl.push(ForgotPassPage);
  }
  //login
  //mLogin(username, password, company) {
  mLogin(username, password) {
    console.log("test")
    // console.log(this.select_company + 'select company')
    //if ((this.txtEmail == "" || this.txtPassword == "") || (this.txtEmail == null || this.txtPassword == null || (this.select_company == null || this.select_company == null))) {
    if ((this.txtEmail == "" || this.txtPassword == "") || (this.txtEmail == null || this.txtPassword == null)) {
      console.log("test" + this.txtEmail)
      this.toast.showToast("Vui lòng nhập tài khoản - mật khẩu")
    } else {
      this.toast.showLoading("Login...")
      //set parameter

      //var body = ('phone=' + this.txtEmail + '&password=' + this.txtPassword + '&company_code=' + this.select_company);
      var body = ('phone=' + this.txtEmail + '&password=' + this.txtPassword);
      console.log("test" + body)
      this.service.postAPI('http://117.6.131.222:4010/Remoocx/login', body)
        .subscribe(data => {
          //console.log('dữ liệu' + data.Object.Username)
          if (data.Title == 'Login Success' && data.Object != null) {

            LoginPage.prototype.saveCache(data.Object.Id, data.Object.Username, data.Object.Name, this.txtPassword, data.Object.Email, data.Object.Phone, data.Object.Profile_Picture, data.Object.Type_Driver);
            this.navCtrl.setRoot(TabsPage);
            // insert token vào db
            const options: PushOptions = {
              android: {
                senderID: '142553651974',
                iconColor: '#343434',
                sound: 'true',
                vibrate: 'true',
              },
              ios: {
                alert: 'true',
                badge: true,
                sound: 'true'
              },
              windows: {

              }
            };

            const pushObject: PushObject = this.push.init(options);

            pushObject.on('registration').subscribe((token) => {
              console.log('dữ liệu' + data.Object.Username)
              console.log("id user: " + data.Id + " token = " + token.registrationId);
              // var body = ("Id=" + data.Object.Id + "&OTP=" + token.registrationId);

              var bodyToken = ('User_id=' + data.Object.Id + '&Token=' + token.registrationId);
              this.service.postAPI("http://117.6.131.222:4010/remoocx/InsertToken", bodyToken)
                .subscribe(data => {
                  // this.navCtrl.push(TabsPage);
                  var FullName = data.Object.User_id + " " + data.Object.Token;
                  console.log('chạy tới đây' + data.Title);
                  //LoginPage.prototype.saveCache(data.Object.Id, data.Object.Username, data.Object.Name, this.txtPassword, data.Object.Email, data.Object.Phone, data.Object.Profile_Picture, data.Object.Type_Driver, data.Object.Company_Code);
                  //LoginPage.prototype.saveCache(data.Object.Id, data.Object.Username, data.Object.Name, this.txtPassword, data.Object.Email, data.Object.Phone, data.Object.Profile_Picture, data.Object.Type_Driver);

                })
            }, err => { console.log("err2", err) });
            this.service.postAPI("http://117.6.131.222:4010/RemoocX/CheckOnline", "id=" + data.Object.Id)
              .subscribe(check => {
                console.log('login success');


                if (check.ID == 1) {
                  this.toast.showToast("Login success")

                } else {
                  this.toast.loading.dismiss();
                }
              })
          }
          else if (data.ID == 0) {
            this.message = data.Title;
            this.service.dialog(this.message)
            this.toast.loading.dismiss()
          }
          else {
            this.message = 'Bạn nhập sai hoặc chưa có tài khoản'
            this.service.dialog(this.message)
            this.toast.loading.dismiss()
          }
        }, error => {
          this.message = 'Vui lòng kiểm tra kết nối internet'
          this.service.dialog(this.message)
          console.log('error Login: ' + error)
          this.toast.loading.dismiss()
        })
      // this.navCtrl.push(TabsPage)
    }
  }
  logErr(err) {
    console.error('erros' + err);
  }

  mLoginFB() {
    var userId;
    this.fb.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
      let that = this;
      userId = res.authResponse.userID;
      console.log('Logged into Facebook! ID: ' + userId + " // " + Object.getOwnPropertyNames(res.authResponse))
      let params = new Array();
      this.toast.showLoading("Loading...")
      this.fb.api(userId + "/?fields=name,gender,email,birthday", params).then(function (user) {
        console.log('name: ' + user.name + 'displayname: ' + user.displayame + 'email:' + user.email + 'birthday: ' + user.birthday)
        //get picture
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        console.log('Url Avatar: ' + user.picture + '/ Emai: ' + user.email + '/Birthday: ' + user.birthday + '/ndisplayname: ' + user.displayname)

        let url = "http://117.6.131.222:4010/remoocx/check_fb";
        let body = "id_fb=" + userId;
        that.service.postAPI(url, body).subscribe(data => {
          console.log('Json Fb return: ' + JSON.stringify(data))
          if (data.ID == 1) {
            console.log('FB chua login: ' + that.token_code);
            that.navCtrl.push(EnterphonePage, {
              id_fb: userId,
              username: user.name,
              email: user.email,
              avatar: user.picture
              //  token: that.token_code
            });
          }
          else if (data.ID == 2) {
            console.log('Login success');
            //id, username, displayname, password, email, phone, img
            that.saveCache(data.Object.Id, data.Object.Username, data.Object.Name, "1234abcd", data.Object.Email, data.Object.Phone, data.Object.Profile_picture, data.Object.Type_Driver)
            //that.saveCache(data.Object.Id, data.Object.Username, data.Object.Name, "1234abcd", data.Object.Email, data.Object.Phone, data.Object.Profile_picture, data.Object.Type_Driver, data.Object.Company_Code)

            that.events.publish('user:login');
            that.navCtrl.push(TabsPage);
          }
          else if (data.ID == 3) {
            console.log('Update Phone to next: ' + that.token_code);

            that.navCtrl.push(EnterphonePage, {
              id_fb: userId,
              username: user.name,
              email: user.email,
              avatar: user.picture
            })
          }


          that.toast.loading.dismiss();
        }, error => {
          this.toast.loading.dismiss()
        })

      }, function (error) {
        this.toast.loading.dismiss()
        console.log("Co loi trong qua trinh dang nhap FB")
      })
    })
      .catch(e => {
        this.toast.loading.dismiss()
        console.log('Error logging into Facebook', e)
      });
  }


  //saveCache(id, username, displayname, password, email, phone, img, type, company) {
  saveCache(id, username, displayname, password, email, phone, img, type) {
    //save information
    console.log('chạy tới đây');
    NativeStorage.prototype.setItem('userLogin', {

      id: id,
      userName: username,
      displayName: displayname,
      password: password,
      email: email,
      phone: phone,
      img: img,
      TypeUser: type,
      // company: company,
    })
      .then(
        () => {
          console.log('Save cache success')
        },
        error => console.error('Error storing item', error)
      );
  }

  msingup() {
    this.navCtrl.push(RegisterPage)
  }



}
