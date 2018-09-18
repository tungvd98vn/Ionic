import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';
import { Service } from '../../providers/service';
import { NativeStorage } from '@ionic-native/native-storage';
/*
  Generated class for the ChangePass page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-change-pass',
  templateUrl: 'change-pass.html'
})
export class ChangePassPage {
  updatePass: FormGroup;
  pass_old: any
  pass_new1: any
  pass_new2: any
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public serve: Service,
    private nativeStorage: NativeStorage,
  ) {
    this.updatePass = this.formBuilder.group({
      newpass1: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.pattern('[a-z0-9)]*'), Validators.required])],
      newpass2: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.pattern('[a-z0-9)]*'), Validators.required])]
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePassPage');
  }
  validate2(): boolean {
    if (this.updatePass.valid) {
      return true;
    }
    let errorMsg = "";
    let controlPassword1 = this.updatePass.controls['newpass1'];
    let controlPassword2 = this.updatePass.controls['newpass2'];
    if (!controlPassword1.valid) {
      if (controlPassword1.errors['required']) {
        // this.serve.dialog(this.message)
      }
      else if (controlPassword1.errors['pattern']) {
        this.serve.dialog("Mật khẩu chỉ gồm chữ cái và số.")
      }
      else
        this.serve.dialog("Mật khẩu có độ dài tối thiểu 6 ký tự.")
    }

    else if (!controlPassword2.valid) {
      if (controlPassword2.errors['required']) {
        // this.serve.dialog(this.message)
      }
      else if (controlPassword2.errors['pattern']) {
        this.serve.dialog("Mật khẩu chỉ gồm chữ cái và số.")
      }
      else
        this.serve.dialog("Mật khẩu có độ dài tối thiểu 6 ký tự.")
    }
    if (!(errorMsg == "")) {
      alert(errorMsg);
      return false;
    }
  }
  confirm() {
    if (this.validate2()) {
      if (this.pass_new1 == '' || this.pass_new1 == null || this.pass_new2 == '' || this.pass_new2 == null) {
        this.serve.dialog('Vui lòng điền đầy đủ thông tin')
      } else {
        this.nativeStorage.getItem('userLogin')
          .then(
            data => {
              console.log('data: ' + data.password)
              if (this.pass_old != data.password || this.pass_old == null) {
                this.serve.dialog('Bạn nhập sai mật khẩu')
              }
              else {
                if ((this.pass_new1 == '' || this.pass_new1 == null) || (this.pass_new2 == '' || this.pass_new2 == null)) {
                  this.serve.dialog('Vui lòng nhập mật khẩu!')
                }
                else if (this.pass_new1 != this.pass_new2) {
                  this.serve.dialog('Mật khẩu xác nhận không trùng nhau!')
                }
                else {
                  console.log('Id: ' + data.id + ' new_pass: ' + this.pass_new1 + ' old_pass: ' + this.pass_old)
                  // API đổi password
                  var body = ('Id= ' + data.id + '&Password=' + this.pass_new1);
                  this.serve.postAPI('http://117.6.131.222:4010/RemoocX/changePass', body)
                    .subscribe(
                      data1 => {
                        if (data1.Title == "update password success") {
                          this.serve.dialog('Đổi mật khẩu thành công');
                          this.navCtrl.pop();
                          // this.navCtrl.push(LoginPage)
                        }
                        else {
                          this.serve.dialog('Bạn nhập sai mật khẩu cũ hoặc mật khẩu mới trùng với mật khẩu cũ!')
                        }
                      },
                      error => console.error(error)
                    )
                }
              }
            },
            error => console.error(error)
          );
      }
    }
  }
}
