import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastService } from '../../providers/toast-service';
import { Service } from '../../providers/service';

/*
  Generated class for the ForgotPass page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-forgot-pass',
  templateUrl: 'forgot-pass.html'
})
export class ForgotPassPage {
  public email
  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastService, public service: Service, ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPassPage');
  }
  forgotPass() {
    this.service.postAPI("http://117.6.131.222:4010/RemoocX/ForgotPassWord", "email=" + this.email)
      .subscribe(data => {
        if (data.Title == "EMAIL_NOT_EXIT") {
          this.toast.showToast("Email không tồn tại");
        } else {
          this.toast.showToast("Gửi mật khẩu vào: " + this.email);
          this.navCtrl.pop();
        }
      })
  }
}
