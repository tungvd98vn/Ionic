import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Service } from '../../providers/service'
export interface PageInterface {
  id: number,
  Title: any,
  Message: any,
  type: any,
  Create_time: any
  // origin: string
}
/*
  Generated class for the Notification page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  listNoti: PageInterface[] = []
  txtMessage: any
  txt
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public service: Service) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    //this.loadnoti();
  }
  ionViewWillEnter(){
     this.loadnoti();
  }
  loadnoti() {
    this.listNoti = [];
    this.service.getDataNativeStore('userLogin').then(
      data => {
        console.log(data.id);
        this.service.postAPI('http://117.6.131.222:4010/RomoocFcm/GetListMess', 'id=' + data.id)
          .subscribe(data1 => {
            if (data1.length > 0) {
              console.log(data1);
              for (let i = 0; i < data1.length; i++) {
                this.listNoti.push({
                  id: data1[i].Id,
                  Title: data1[i].Title,
                  Message: data1[i].Message,
                  type: data1[i].Type,
                  Create_time: data1[i].Create_time
                })
              }
            }
            else {
              this.service.dialog('Bạn chưa có thông báo nào!')
            }
          })
      }
    )

  }

}
