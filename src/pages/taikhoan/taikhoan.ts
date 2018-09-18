import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { UploadavatarPage } from '../uploadavatar/uploadavatar';
import { LoginPage } from "../login/login";
import { Validators, FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';
import { ToastService } from "../../providers/toast-service";
import { Service } from "../../providers/service";
import { ChangePassPage } from '../change-pass/change-pass';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
/*
  Generated class for the Taikhoan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-taikhoan',
  templateUrl: 'taikhoan.html'
})
export class TaikhoanPage implements OnInit {
  message: string;
  updateUser: FormGroup;
  updatePass: FormGroup
  txtName: any;
  ngOnInit(): void {
    // throw new Error('Method not implemented.')
    console.log('TaikhoanPage is running...')
  }
  pass_old: any
  pass_new1: any
  pass_new2: any

  user_id: any;
  txtUsername: any;
  txtPassword: any;
  txtPhone: any;
  txtEmail: any;
  txtDisplayName: string;
  url_avatar: any;
  balence: any;
  displayname: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    public http: Http,
    public events: Events,
    public formBuilder: FormBuilder,
    public toast: ToastService,
    public serve: Service
  ) {
    this.updateUser = this.formBuilder.group({
      // fDisplayname: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(18), Validators.required])],
      fPhone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(14), Validators.pattern('[0-9+]*'), Validators.required])],
      fEmail: ['', Validators.compose([Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])]
    })
    this.updatePass = this.formBuilder.group({
      newpass1: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.pattern('[a-z0-9)]*'), Validators.required])],
      newpass2: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.pattern('[a-z0-9)]*'), Validators.required])]
    })
  }

  validate(): boolean {
    if (this.updateUser.valid) {
      return true;
    }
    let errorMsg = "";
    // let controlDisplayname = this.updateUser.controls['fDisplayname'];
    let controlPhone = this.updateUser.controls['fPhone'];
    let controlEmail = this.updateUser.controls['fEmail'];
    if (!controlPhone.valid) {
      if (controlPhone.errors['required']) {
        this.message = 'Vui lòng nhập đầy đủ thông tin';
        this.serve.dialog(this.message)
      }
      else {
        this.message = "Số điện thoại không hợp lệ, vui lòng nhập lại";
        this.serve.dialog(this.message)
      }
    }
    else
      if (!controlEmail.valid) {
        if (controlEmail.errors['required']) {
          this.message = 'Vui lòng nhập đầy đủ thông tin';
          this.serve.dialog(this.message)
        }
        else {
          this.message = "Định dạng email không đúng";
          this.serve.dialog(this.message)
        }
      }
    // else if (!controlDisplayname.valid) {
    //   if (controlDisplayname.errors['required']) {
    //     this.serve.dialog('Vui lòng nhập đầy đủ thông tin')
    //   }
    //   else {
    //     this.serve.dialog('Họ và tên hiển thị từ 3 đến 18 ký tự')
    //   }
    // }
    if (!(errorMsg == "")) {
      alert(errorMsg);
      return false;
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TaikhoanPage');
    //  this.setDataUser()
    let mystyle = document.getElementById('myModal')
    window.onclick = function (event) {
      if (event.target == mystyle) {
        mystyle.style.display = 'none'
      }
    }
  }

  ionViewWillEnter() {
    console.log('Runnnnnnnnnnnnn ionViewWillEnter')
    this.setDataUser()
  }

  update() {
    // if (this.validate()) {
    if ((this.txtDisplayName.trim() == "" || this.txtDisplayName == "" || this.txtDisplayName == null)) {
      this.message = "Vui lòng nhập đầy đủ thông tin";
      this.serve.dialog(this.message)
    } else {
      this.toast.showLoading("");
      console.log('id= ' + this.user_id + ' name= ' + this.txtUsername)
      var body = ('Id=' + this.user_id + '&Name=' + this.txtUsername);
      debugger
      this.serve.postAPI('http://117.6.131.222:4010/RemoocX/update_profile', body)
        .subscribe(data => {
          if (data.Title == 'update profile success') {
            //cap nhat thong tin moi
            NativeStorage.prototype.setItem('userLogin', {
              displayName: data.Object.Name,
              phone: data.Object.Phone,
              txtEmail: data.Object.Email,
              password: data.Object.Password
            })
              .then(() => {
                console.log('Save cache success')
                this.setDataUser()
                this.events.publish('user:login');
              },
                error => console.error('Error storing item', error)
              );
            this.serve.dialog('Cập nhật thông tin thành công')
            this.toast.dismissLoading();
          }
          else {
            console.log("Lỗi ")
            this.serve.dialog('Có lỗi trong quá trình cập nhật, vui lòng thử lại')
          }
        })
    }
    // }
  }

  setDataUser() {
    //set data user
    this.nativeStorage.getItem('userLogin')
      .then(
        data => {
          console.log('data: ' + data)
          this.user_id = data.id
          this.txtUsername = data.displayName,
            this.txtDisplayName = data.displayName,
            this.txtPassword = data.password
          this.txtPhone = data.phone
          this.txtEmail = data.email
          this.displayname = data.displayName

        },
        error => console.error('Khong co navite userLogin: ' + error)
      );

    //set data user avatar
    this.nativeStorage.getItem('userLogin')
      .then(
        data => {
          console.log('data: ' + data.img)
          if (data.img == '' || data.img == null) {
            this.url_avatar = 'assets/img/account.png';
          } else {
            this.url_avatar = data.img
            this.events.publish('user:login', data.img)
          }
        },
        error => console.error(error)
      );
  }

  uploadAvatar() {
    this.navCtrl.push(UploadavatarPage)
  }
  update_pass() {
    this.navCtrl.push(ChangePassPage);
    // let mystyle = document.getElementById('myModal123')
    // mystyle.style.display = 'block'
  }
  close() {
    let mystyle = document.getElementById('myModal123')
    mystyle.style.display = 'none'
    this.pass_old = ""
    this.pass_new1 = ""
    this.pass_new2 = ""
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
        this.message = 'Vui lòng điền đầy đủ thông tin'
        // this.serve.dialog(this.message)
      }
      else if (controlPassword1.errors['pattern']) {
        this.message = "Mật khẩu chỉ gồm chữ cái và số."
        this.serve.dialog(this.message)
      }
      else
        this.message = "Mật khẩu có độ dài tối thiểu 6 ký tự."
      this.serve.dialog(this.message)
    }

    else if (!controlPassword2.valid) {
      if (controlPassword2.errors['required']) {
        this.message = 'Vui lòng điền đầy đủ thông tin'
        // this.serve.dialog(this.message)
      }
      else if (controlPassword2.errors['pattern']) {
        this.message = "Mật khẩu chỉ gồm chữ cái và số."
        this.serve.dialog(this.message)
      }
      else
        this.message = "Mật khẩu có độ dài tối thiểu 6 ký tự."
      this.serve.dialog(this.message)
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
                this.message = 'Bạn nhập sai mật khẩu'
                this.serve.dialog(this.message)
              }
              else {
                if ((this.pass_new1 == '' || this.pass_new1 == null) || (this.pass_new2 == '' || this.pass_new2 == null)) {
                  this.message = 'Vui lòng nhập mật khẩu!'
                  this.serve.dialog(this.message)
                }
                else if (this.pass_new1 != this.pass_new2) {
                  this.message = 'Mật khẩu xác nhận không trùng nhau!'
                  this.serve.dialog(this.message)
                }
                else {
                  console.log('Id: ' + data.id + ' new_pass: ' + this.pass_new1 + ' old_pass: ' + this.pass_old)
                  // API đổi password
                  var body = ('Id= ' + data.id + '&Password=' + this.pass_new1);
                  this.serve.postAPI('http://117.6.131.222:4010/RemoocX/changePass', body)
                    .subscribe(
                      data1 => {
                        if (data1.Title == "update password success") {
                          this.serve.dialog('Đổi mật khẩu thành công')
                          this.close()
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
