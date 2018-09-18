import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { StatusBar, Device } from 'ionic-native';
import { TabsPage } from '../main/main';
import { NativeStorage } from '@ionic-native/native-storage';
import { ToastService } from "../../providers/toast-service";
import { Validators, FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';
import { Service } from "../../providers/service";
export interface PageInterface {
  company_code: any,
  company_name: any
}
/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  company: PageInterface[] = [];
  myGroup: FormGroup;
  txtDisplayname: string;
  txtUsername: any
  txtPassword: any
  txtPhone: any
  txtEmail: any
  message: any
  select_company: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public http: Http,
    public nativeStorage: NativeStorage,
    public events: Events,
    public toast: ToastService,
    public formBuilder: FormBuilder,
    public serve: Service
  ) {
    this.menu.swipeEnable(false);
    this.myGroup = this.formBuilder.group({
      fDisplayname: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(18), Validators.required])],
      // fUsername: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9]*'), Validators.required])],
      fPassword: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.required])],
      fPhone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(14), Validators.pattern('[0-9+]*'), Validators.required])],
      fEmail: ['', Validators.compose([Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,})$')])]
    })
    this.serve.removeDataNativeStore("userLogin").then(data => {
      console.log("remove cache Register ss")
    }, error => {
      console.log("remove cache Register ERROR: " + error)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    let mystyle = document.getElementById('dialog')
    window.onclick = function (event) {
      if (event.target == mystyle) {
        mystyle.style.display = 'none'
      }
    }
    // this.serve.postAPI('http://117.6.131.222:4010/company/getallcompany', '')
    //   .subscribe(data => {
    //     for (var i = 0; i < data.length; i++) {
    //       this.company.push({
    //         company_code: data[i].Company_Code,
    //         company_name: data[i].Company_Name
    //       })
    //     }
    //   })
    // this.select_company = 'CO-3I'
  }
  validate(): boolean {
    if (this.myGroup.valid) {
      return true;
    }
    let errorMsg = "";
    let controlDisplayname = this.myGroup.controls['fDisplayname'];
    // let controlUserName = this.myGroup.controls['fUsername'];
    let controlPassword = this.myGroup.controls['fPassword'];
    let controlPhone = this.myGroup.controls['fPhone'];
    let controlEmail = this.myGroup.controls['fEmail'];

    // if (!controlUserName.valid) {
    //   if (controlUserName.errors['required']) {
    //     // errorMsg = 'Vui lòng điền đầy đủ thông tin';
    //     this.message = 'Vui lòng điền đầy đủ thông tin';
    //     this.serve.dialog(this.message)
    //   } else {
    //     if (controlUserName.errors['pattern']) {
    //       // errorMsg = 'Tài khoản chỉ bao gồm các chữ cái và chữ số';
    //       this.message = 'Tài khoản chỉ bao gồm các chữ cái và chữ số';
    //       this.serve.dialog(this.message)
    //     } else {
    //       if (controlUserName.errors['minLength']) {
    //         // errorMsg = 'Tên tài khoản phải có độ dài tối thiểu 6 ký tự'
    //         this.message = 'Tên tài khoản phải có độ dài tối thiểu 6 ký tự';
    //         this.serve.dialog(this.message)
    //       } else {
    //         // errorMsg = 'Tài khoản có độ dài từ tối thiểu 6 ký tự'
    //         this.message = 'Tài khoản có độ dài từ tối thiểu 6 ký tự';
    //         this.serve.dialog(this.message)
    //       }
    //     }
    //   }
    // }
    // else
    if (!controlPassword.valid) {
      if (controlPassword.errors['required'])
      // errorMsg = 'Vui lòng điền đầy đủ thông tin'
      {
        this.message = 'Vui lòng điền đầy đủ thông tin';
        this.serve.dialog(this.message)
      }
      else
      // errorMsg = "Mật khẩu có độ dài tối thiểu 6 ký tự."
      {
        this.message = 'Mật khẩu có độ dài tối thiểu 6 ký tự.';
        this.serve.dialog(this.message)
      }
    }

    else if (!controlPhone.valid) {
      if (controlPhone.errors['required'])
      // errorMsg = 'Vui lòng điền đầy đủ thông tin';
      {
        this.message = 'Vui lòng điền đầy đủ thông tin';
        this.serve.dialog(this.message)
      }
      else {
        this.message = 'Số điện thoại không hợp lệ, vui lòng nhập lại';
        this.serve.dialog(this.message)
      }
      // errorMsg = "Số điện thoại không hợp lệ, vui lòng nhập lại";
    }
    else if (!controlEmail.valid) {
      if (controlEmail.errors['required']) {
        this.message = 'Vui lòng điền đầy đủ thông tin';
        this.serve.dialog(this.message)
      }
      // errorMsg = 'Vui lòng điền đầy đủ thông tin';
      else {
        this.message = 'Định dạng email không đúng';
        this.serve.dialog(this.message)
      }
      // errorMsg = "Định dạng email không đúng";
    }
    else if (!controlDisplayname.valid) {
      if (controlDisplayname.errors['required']) {
        this.serve.dialog('Vui lòng nhập đầy đủ thông tin')
      }
      else {
        this.serve.dialog('Họ và tên hiển thị từ 3 đến 18 ký tự')
      }
    }
    if (!(errorMsg == "")) {
      alert(errorMsg);
      return false;
    }
  }

  mRegister() {
    if (this.validate()) {
      if (this.txtEmail == null) {
        this.message = 'Lỗi Email'
        this.serve.dialog(this.message)
      }
      else {
        if (this.txtDisplayname.trim() == "" || this.txtDisplayname == "" || this.txtDisplayname == null) {
          this.message = 'Họ và tên hiển thị không hợp lệ, vui lòng nhập lại.'
          this.serve.dialog(this.message)
        } else {
          this.toast.showLoading('Loading...')
          var body = (
            'Name=' + this.txtDisplayname
            + '&Password=' + this.txtPassword
            + '&Phone=' + this.txtPhone
            + '&Email=' + this.txtEmail
            + '&Profile_Picture=https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png'
            + '&company_code=' + this.select_company
            + '&emei=' + Device.uuid
          );
          var headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          return this.http.post('http://117.6.131.222:4010/Remoocx/Register', body, {
            headers: headers
          })
            .map(res => res.json())
            .subscribe(data => {
              console.log(data);
              if (data.Title == 'Register Success' && (data.Object != null)) {
                this.toast.dismissLoading();
                this.message = 'Đăng ký tài khoản thành công'
                this.serve.dialog(this.message)
                this.saveCache(data.Object.Id, data.Object.Name, this.txtPassword, data.Object.Email, data.Object.Phone, data.Object.Profile_picture, data.Object.Company_Code)
                // this.saveCacheBalence(data.Object.Balance_credit)
                this.events.publish('user:login');
                this.navCtrl.push(TabsPage)
              }
              else if (data.Title == 'Username is exist') {
                this.toast.dismissLoading();
                this.message = 'Tài khoản này đã tồn tại!'
                this.serve.dialog(this.message)
              } else if (data.Title = "Company already exists") {
                this.toast.dismissLoading();
                this.serve.dialog("Mã công ty không tồn tại");
              }
              else {
                this.message = 'Có lỗi trong quá trình đăng ký, vui lòng thử lại'
                this.serve.dialog(this.message);
                this.toast.dismissLoading();
              }
            }, error => {
              this.toast.dismissLoading();
              this.serve.dialog('Vui lòng kiểm tra kết nối mạng')
              console.log('error: ' + error);
            }
            )
        }
      }
    }
  }

  saveCache(id, displayname, password, email, phone, img, company) {
    //save information
    NativeStorage.prototype.setItem('userLogin', {
      id: id,
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

    //set Save avatar
    NativeStorage.prototype.setItem('userLoginAvatar', {
      avatar: img
    })
      .then(
        () => {
          console.log('Save cache  avatar success')
        },
        error => console.error('Error storing item', error)
      );
  }

  //set info balence
  saveCacheBalence(balenceData) {
    NativeStorage.prototype.setItem('userBalence', {
      balence: balenceData
    })
      .then(
        () => {
          console.log('Save cache Balence success')
        },
        error => console.error('Error storing item', error)
      );
  }

}
