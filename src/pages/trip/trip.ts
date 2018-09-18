import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Service } from "../../providers/service";
import { NativeStorage } from "@ionic-native/native-storage";
import { DetailTripPage } from '../detail-trip/detail-trip';
import { newTripPage } from '../newTrip/newTrip';
export interface PageInterface {
  id: number,
  Trip_code: string,
  Start_position: string,
  End_position: string
  Tractor_code: string,
  Remooc_code: string
  // origin: string
}

/*
  Generated class for the Trip page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html'
})
export class TripPage {
  Thongbao: any;
  type_user: any;
  listTracking: PageInterface[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: Service, private nativeStorage: NativeStorage, ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripPage');
    // this.Get_all_tracking();
  }
  ionViewWillEnter() {
    this.service.getDataNativeStore('userLogin').then(data => {
      if (data.TypeUser == 1) {
        this.type_user = 1;
      } else {
        this.type_user = 0;
      }
    }, error => {

    })
    this.Get_all_tracking();
  }

  Get_all_tracking() {
    this.listTracking = [];
    this.service.getDataNativeStore('userLogin').then(
      data1 => {
        console.log('id userrrrrrrrrrrrrr' + data1.id + "type user: " + data1.TypeUser);
        if (data1.TypeUser != 1) {
          this.service.postAPI("http://117.6.131.222:4010/remoocX/GetDriverTracking", 'id_driver=' + data1.id)
            .subscribe(data => {
              if (data.Object.length < 1) {
                // this.service.dialog('Chưa thực hiện chuyến đi nào.')
                this.Thongbao = 'Chưa thực hiện chuyến đi nào.'
              }
              else {
                for (let i = 0; i < data.Object.length; i++) {
                  this.listTracking.push({
                    id: data.Object[i].Id,
                    Trip_code: data.Object[i].Trip_code,
                    Start_position: data.Object[i].Start_position_text,
                    End_position: data.Object[i].End_position_text,
                    Tractor_code: data.Object[i].Tractor_code,
                    Remooc_code: data.Object[i].Remooc_code
                  })
                }
              }
            }, error => {
              this.Thongbao = 'Vui lòng kiểm tra kết nối internet';
            });
        }
        else if (data1.TypeUser == 1) {
          this.service.postAPI("http://117.6.131.222:4010/Remoocx/getalltracking", '')
            .subscribe(data => {
              if (data.length < 1) {
                // this.service.dialog('Chưa thực hiện chuyến đi nào.')
                this.Thongbao = 'Chưa thực hiện chuyến đi nào.'
              }
              else {
                for (let i = 0; i < data.length; i++) {
                  this.listTracking.push({
                    id: data[i].Id,
                    Trip_code: data[i].Trip_code,
                    Start_position: data[i].Start_position_text,
                    End_position: data[i].End_position_text,
                    Tractor_code: data[i].Tractor_code,
                    Remooc_code: data[i].Remooc_code
                  })
                }
              }
            }, error => {
              this.Thongbao = 'Vui lòng kiểm tra kết nối internet';
            });
        }
      }
    )
  }
  detail_trip(id) {
    console.log('iddddddddddđ: ' + id.id);
    TripPage.prototype.saveData(id.id);
    this.navCtrl.push(DetailTripPage, {
      type_user: this.type_user
    });
  }
  saveData(id) {
    NativeStorage.prototype.setItem('detail_trips', {
      id: id
    })
  }
  add_new_trip() {
    console.log('next qua map pages')
    this.navCtrl.push(newTripPage);
  }
}
