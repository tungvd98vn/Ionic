import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, ToastController, Platform, LoadingController, Loading, Toast} from 'ionic-angular';

/*
  Generated class for the ToastService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ToastService {

  loading : Loading
  toast : Toast
  constructor(public http: Http,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController) {
    console.log('Hello ToastService Provider');
  }

  showLoading(msg){
    this.loading = this.loadingCtrl.create({
      content : msg,
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  dismissLoading(){
    if(this.loading.present()){
      this.loading.dismissAll();
    }
  }

   showToast(msg) {
     this.toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'center'
    });
    this.toast.present();
  }


}
