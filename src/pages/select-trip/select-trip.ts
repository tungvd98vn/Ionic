import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { newTripPage } from '../newTrip/newTrip';
import { Service } from '../../providers/service';
import { ToastService } from '../../providers/toast-service';
import { DetailOrderPage } from '../detail-order/detail-order';
import { AlertController } from 'ionic-angular';
/*
  Generated class for the SelectTrip page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-select-trip',
  templateUrl: 'select-trip.html'
})
export class SelectTripPage {
  typeTrip = {
    type: '',
    data: {}
  }
  public driverID
  public list_lenh = [];
  public checkClick: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sever: Service,
    public toast: ToastService,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectTripPage');
    this.loadlenh();
  }
  loadlenh() {
    this.sever.getDataNativeStore('userLogin')
      .then(user => {
        this.driverID = user.id;
        console.log('driver' + this.driverID)
        this.sever.postAPI('http://117.6.131.222:4010/Remoocx/orderTruck', 'idUser=' + user.id)
          .subscribe(data => {
            data.forEach(lenh => {
              this.list_lenh.push({
                id: lenh.id,
                matheodoi: lenh.matheodoi,
                ngaydieuxe: lenh.ngaydieuxe,
                tentaixe: lenh.tentaixe,
                sodaukeo: lenh.sodaukeo,
                somooc: lenh.somooc,
                tenkh: lenh.tenkh,
                diachikh: lenh.diachikh,
                noixuatphat: lenh.noixuatphat,
                noilay: lenh.noilay,
                noiha: lenh.noiha,
                macont: lenh.macont,
                solenh: lenh.solenh,
                ngaygiodi: lenh.ngaygiodi
              })
            });
          })
      })
    console.log('length= ' + this.list_lenh.length)
  }

  detail(lenh) {
    if (this.checkClick == true) {
      console.log("không đụng thằng click detail")
    } else {
      this.navCtrl.push(DetailOrderPage, lenh)
    }
    this.checkClick = false;
  }
  delete(id) {
    this.checkClick = true;
    let alert = this.alertCtrl.create({
      title: 'Thông báo',
      message: 'Bạn muốn xóa lệnh điều động này không?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Xóa',
          handler: () => {
            console.log('Button xử lý sự kiện xóa');
            this.sever.postAPI('http://117.6.131.222:4010/CommandOrderTruck/Driver_Cancel', 'Ma_Theo_Doi=' + id)
              .subscribe(data => {
                console.log(JSON.stringify(data));
                if (data.ID == 0) {
                  this.sever.dialog(data.Title)
                }
                else {
                  this.sever.dialog(data.Title)
                }
              })
          }
        }
      ]
    });
    alert.present();
    console.log('click delete')
  }
  Receive(id) {
    this.checkClick = true;
    let alert = this.alertCtrl.create({
      title: 'Thông báo',
      message: 'Bạn muốn nhận lệnh điều động này không?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Nhận',
          handler: () => {
            console.log('Button xử lý sự kiện nhận');
            this.sever.postAPI('http://117.6.131.222:4010/CommandOrderTruck/Driver_Book', 'Ma_Theo_Doi=' + id)
              .subscribe(data => {
                console.log(JSON.stringify(data));
                if (data.ID == 0) {
                  this.sever.dialog(data.Title)
                }
                else {
                  this.sever.dialog(data.Title)

                }
              })
          }
        }
      ]
    });
    alert.present();
    console.log('Click Nhận')
  }
  refreshPage() {
    var component = this.navCtrl.getActive().instance;
    //re-run the view load function if the page has one declared
    if (component.ionViewDidLoad) {
      component.ionViewDidLoad();
    }
  }

}
