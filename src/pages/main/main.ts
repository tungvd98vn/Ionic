import { Component } from '@angular/core';
import { NavParams, Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { TaikhoanPage } from '../taikhoan/taikhoan'
import { Configservice } from "../../providers/config";
import { NativeStorage } from "@ionic-native/native-storage";
// import { MapsPage } from '../new-trip/new-trip';
import { newTripPage } from '../newTrip/newTrip';
import { TripPage } from '../trip/trip';
import { NotificationPage } from '../notification/notification';
import { ChatPage } from '../chat/chat';
import { SelectTripPage } from '../select-trip/select-trip';

@Component({
  templateUrl: 'main.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabmap: any = newTripPage;
  tablstrip: any = TripPage;
  tabTinMoi: any = NotificationPage;
  tabchat: any = ChatPage;
  tabTaiKhoan: any = TaikhoanPage;
  // tabHuongDan: any = HuongdanPage
  mySelectedIndex: number;
  user_id: number

  constructor(navParams: NavParams, public config: Configservice, public events: Events, private nativeStorage: NativeStorage) {
    // if (config.flagPage == 0) {
    //   this.mySelectedIndex = navParams.data.tabIndex || 0;
    //   config.changePage();
    // } else {
    //   this.mySelectedIndex = navParams.data.tabIndex || 0;
    // }

    this.events.subscribe('user:admin', () => {
      // set active page menu default
      this.nativeStorage.getItem('userLogin')
        .then(data1 => {
          this.user_id = data1.type_user;
        }, error => {

        })
    });


  }
}
