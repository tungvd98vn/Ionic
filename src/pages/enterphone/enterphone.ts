import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Service } from "../../providers/service";
import { ToastService } from "../../providers/toast-service";
import { NativeStorage } from "@ionic-native/native-storage";
import { TabsPage } from "../main/main";
// import {
//   Push,
//   PushToken
// } from '@ionic/cloud-angular';

export interface PageInterface {
  company_code: any,
  company_name: any
}
/*
  Generated class for the Enterphone page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-enterphone',
  templateUrl: 'enterphone.html'
})
export class EnterphonePage {
  company: PageInterface[] = [];
  txtPhone: any;
  username: any;
  email: any;
  img: any;
  id_fb: any;
  token_code: any;
  select_company: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public service: Service, public toast: ToastService, public events: Events, ) {
    this.username = navParams.get('username');
    this.email = navParams.get('email');
    this.img = navParams.get('avatar');
    this.id_fb = navParams.get('id_fb');
    this.token_code = navParams.get('token');
    console.log('xxx: ' + this.username + this.email + this.img + this.txtPhone + this.token_code)
  }

  ionViewDidLoad() {
    this.service.postAPI('http://117.6.131.222:4010/company/getallcompany', '')
      .subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          this.company.push({
            company_code: data[i].Company_Code,
            company_name: data[i].Company_Name
          })
        }
      })
    console.log('ionViewDidLoad EnterphonePage');
    this.select_company = 'CO-3I'
  }

  register() {
    var url = "http://117.6.131.222:4010/remoocx/isCheckPhone"
    var url_reg = "http://117.6.131.222:4010/Remoocx/Register";
    if (this.txtPhone != null || this.txtPhone != "") {
      this.toast.showLoading("");
      var body = "phone=" + this.txtPhone
      this.service.postAPI(url, body).subscribe(data => {
        console.log("Response Register: " + JSON.stringify(data));
        if (data.ID == 0) {
          this.toast.dismissLoading();
          this.toast.showToast("Số điện thoại đã được sử dụng");

        } else {
          var body_reg = (
            'Username=' + this.username
            + '&Name=' + this.username
            + '&Password=1234abcd'
            + '&Phone=' + this.txtPhone
            + '&Email=' + this.email
            + '&Profile_Picture=' + this.img
            + '&Id_Fb=' + this.id_fb
            + '&company_code=' + this.select_company
          );
          this.service.postAPI(url_reg, body_reg).subscribe(result => {
            console.log("Response Register sucess: " + JSON.stringify(result));
            if (result.Title == 'Register Success' && (result.Object != null)) {
              this.saveCache(result.Object.Id, result.Object.Username, result.Object.Name, "1234abcd", result.Object.Email, result.Object.Phone, result.Object.Profile_Picture, result.Object.Company_Code)
              this.events.publish('user:login');

              // this.push.register().then((t: PushToken) => {
              //   console.log('??????? enter phone: ' + t.token)
              //   return this.push.saveToken(t)
              // }).then((t: PushToken) => {
              //   var data1 = {
              //     id: 1,
              //     user_id: result.Object.Id,
              //     token_id: t.token
              //   }
              //   console.log('Token saved:', t.token);
              //   var bodyToken = ('User_id=' + result.Object.Id + '&Token=' + t.token);
              //   var url_InsertToken = "http://117.6.131.222:4010/remoocx/InsertToken";
              //   this.service.postAPI(url_InsertToken, bodyToken).subscribe(dataToken => {
              //     this.toast.dismissLoading();
              //     console.log('bạn login với id = ' + result.Object.Id);
              //   })
              //   // this.registerTokenLogin(data, t)
              // });
              this.toast.dismissLoading();
              this.navCtrl.push(TabsPage)
            }
          }, error => {

          })
        }
      })
    } else {
      this.toast.showToast("Số điện thoại không được để trống");
    }

  }

  saveCache(id, username, displayname, password, email, phone, img, company) {
    //save information
    NativeStorage.prototype.setItem('userLogin', {
      id: id,
      userName: username,
      displayName: displayname,
      password: password,
      email: email,
      phone: phone,
      img: img,
      company: company
    })
      .then(
        () => {
          console.log('Save cache success')
        },
        error => console.error('Error storing item', error)
      );
  }

}
