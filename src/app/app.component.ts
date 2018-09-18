import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events, AlertController } from 'ionic-angular';
import { StatusBar, Device } from 'ionic-native';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { TabsPage } from '../pages/main/main';
import { LoginPage } from '../pages/login/login';
// import { SQLite } from '@ionic-native/sqlite';
// import { GoogleplusPage } from "../pages/googleplus/googleplus";
import { Service } from "../providers/service";
// import {
//   Push,
//   PushToken,
// } from '@ionic/cloud-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//Get GPS
import { Geolocation } from 'ionic-native';

import { Http } from "@angular/http";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
// import { TaikhoanPage } from "../pages/taikhoan/taikhoan";
import { Configservice } from "../providers/config";
//import { MapsPage } from '../pages/new-trip/new-trip';
import { DetailTripPage } from '../pages/detail-trip/detail-trip';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Diagnostic } from '@ionic-native/diagnostic';
import { MapPage } from '../pages/map/map';
import { SelectTripPage } from '../pages/select-trip/select-trip';
import { newTripPage } from '../pages/newTrip/newTrip';
import { TripPage } from '../pages/trip/trip';
import { NotificationPage } from '../pages/notification/notification';
import { TaikhoanPage } from '../pages/taikhoan/taikhoan';
import { ChatPage } from '../pages/chat/chat';
import { SearchPage } from '../pages/search/search';
import { ToastService } from "../../providers/toast-service";
// import { CalendarPage } from '../pages/calendar/calendar';
// import { OneSignal } from '@ionic-native/onesignal';
declare var cordova: any;
declare var fm: any;
export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  // @ViewChild(NavParams) NavParams: NavParams;
  //name: any = "null"
  id: any
  name: any
  isLogin: any
  username: any;
  balence: any;
  url_avatar: any;
  clients2: any;
  messageChat: any;
  idroom: 1234
  version: any;
  // set our app's pages

  appPages: PageInterface[] = [
    { title: 'Hành trình điều độ', component: SelectTripPage, icon: 'md-add' },
    { title: 'Hành trình tự do', component: TripPage, icon: 'ios-calendar' },
    { title: 'Tin tức nội bộ', component: NotificationPage, icon: 'ios-notifications' },
    { title: 'Chat', component: ChatPage, icon: 'ios-chatbubbles-outline' },
    { title: 'Tài khoản', component: TaikhoanPage, icon: 'ios-person' },
    { title: 'Tìm kiếm remooc', component: SearchPage, icon: 'md-map' },
  ];
  rootPage = LoginPage;
  // rootPage = DetailTripPage;
  activePage: any;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    private nativeStorage: NativeStorage,
    private fb: Facebook,
    public events: Events,
    public alertCtrl: AlertController,

    // private sqlite: SQLite,
    public push: Push,
    public service: Service,
    public http: Http,
    private screenOrientation: ScreenOrientation,
    public config: Configservice,
    private iab: InAppBrowser,
    private appVersion: AppVersion,
    private diagnostic: Diagnostic,
    // private _OneSignal: OneSignal
  ) {
    // this.onesignal();
    this.http = http;
    platform.ready().then(() => {
      this.pushsetup();
      console.log(JSON.stringify(Device));
      console.log(Device.uuid + " -- " + Device.version + " -- " + Device.serial);



      this.check();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      StatusBar.styleDefault();
      console.log("chay den day");
      {
        let that = this
        cordova.getAppVersion.getVersionNumber(function (versionApp) {
          console.log("chay den day1");
          console.log('version app: ' + versionApp)
          that.version = versionApp
        });
      }
      let successCallback = (isAvailable) => {
        console.log('Is available? ' + isAvailable);
        if (isAvailable == false) {
          this.presentConfirm()

        }
      };
      console.log("chay den day3");
      let errorCallback = (e) => { console.error(e); };
      this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);
    });

    platform.registerBackButtonAction(this.exit)

    this.events.subscribe('user:login', () => {
      //get infor user login
      this.service.getDataNativeStore('userLogin').then(data => {
        console.log('info login: ' + JSON.stringify(data))
        this.username = data.displayName;
        this.id = data.id;

        this.clients2 = new fm.websync.client('http://117.6.131.222:8089/websync.ashx');
        fm.websync.client.enableMultiple = true;
        var me = this;
        if (data != null) {
          let that = this;
          fm.util.addOnLoad(function () {
            //init object chat between users a room
            var chat = {
              alias: 'Unknown',
              clientId: 0,
              channels: {
                main: '/iklearn'
              },
              dom: {
                chat: {
                  username: "",
                  roomid: me.idroom
                }
              },
              util: {
                start: function () {
                  chat.alias = data.id;
                  chat.clientId = me.idroom;
                },
                stopEvent: function (event) {
                  if (event.preventDefault) {
                    event.preventDefault();
                  } else {
                    event.returnValue = false;
                  }
                  if (event.stopPropagation) {
                    event.stopPropagation();
                  } else {
                    event.cancelBubble = true;
                  }
                },
                send: function () {
                  var arrayGPS = []
                  Geolocation.getCurrentPosition().then((resp) => {
                    if (resp != null) {
                      var startGPSLat = resp.coords.latitude;
                      var startGPSLong = resp.coords.longitude;
                      arrayGPS.push(startGPSLat);
                      arrayGPS.push(startGPSLong);
                      var GPS = '[' + startGPSLat + ',' + startGPSLong + ']'
                      console.log('GPS: ' + GPS)
                      //NOI DUNG MESS SEND
                      me.clients2.publish({
                        channel: '/warehouse',
                        data: {
                          alias: chat.alias,
                          text: arrayGPS
                        },
                        onSuccess: function (args) {
                          me.messageChat = ""
                        }
                      });
                    }
                  })
                },
                clear: function (el) {
                  el.value = '';
                },
                observe: fm.util.observe,
                isEnter: function (e) {
                  return (e.keyCode == 13);
                },
                isEmpty: function (el) {
                  return (el.value == '');
                },
                setInvalid: function (el) {
                  el.className = 'invalid';
                },
                clearLog: function () {
                },
                logMessage: function (alias, text, me) {
                  var html = text;
                },
                logMessage2: function (alias, text, me) {
                  var html = text;
                },
                logSuccess: function (text) {
                },
                logFailure: function (text) {
                },
                log: function (html) {
                  var div = document.createElement('div');
                  chat.util.scroll();
                },
                scroll: function () {
                }
              }
            };
            setInterval(() => {
              chat.util.start();
              chat.util.send();
              console.log('send...')
            }, 15000)
            me.clients2.connect({
              onSuccess: function (args) {
                chat.clientId = args.clientId;
                chat.util.clearLog();
                console.log('Connect success')
              },
              onFailure: function (args) {
                console.log('Connect error')
              }
            });
            me.clients2.subscribe({
              channel: '/warehouse',
              onSuccess: function (args) {
                // chat.util.logSuccess('Nội dung chat sinh viên.');
                var logs = args.getExtensionValue('logs');
                if (logs != null) {
                  for (var i = 0; i < logs.length; i++) {
                    chat.util.logMessage2(logs[i].alias, logs[i].text, false);
                  }
                }

              },
              onFailure: function (args) {
                chat.util.logSuccess('Đang bị mất kết nối.');
              },
              onReceive: function (args) {
                console.log('nhan tin nhan: ' + args.getData().alias + " / " + args.getData().text + "  / " + args.getWasSentByMe());
              }
            });
          });
        }
      }, error => {
        console.log('get info account login error: ' + error.message)
      });
      // //get User avatar
      this.service.getDataNativeStore('userLogin').then(data => {
        console.log('info login avatar: ' + data.img)
        if (data.img == null || data.img == '') {
          this.url_avatar = 'assets/img/account.png'
        } else {
          this.url_avatar = data.img;
        }
      }, error => {
        console.log('get info avatar login error: ' + error.message)
      });

    });


  }
  // onesignal() {
  //   this._OneSignal.startInit('6f108174-6d26-4205-8e6e-4c5ecea72195', "280154027277");
  //   this._OneSignal.inFocusDisplaying(this._OneSignal.OSInFocusDisplayOption.Notification);
  //   this._OneSignal.setSubscription(true);
  //   this._OneSignal.handleNotificationReceived().subscribe((data) => {
  //     // handle received here how you wish.
  //     console.log("data recevived: " + JSON.stringify(data));
  //   });
  //   this._OneSignal.handleNotificationOpened().subscribe((data) => {
  //     // handle opened here how you wish.
  //     console.log("data opened: " + JSON.stringify(data));
  //   });
  //   this._OneSignal.endInit();
  // }
  pushsetup() {

    const options: PushOptions = {
      android: {
        senderID: '142553651974',
        iconColor: '#343434',
        sound: 'true',
        vibrate: 'true',
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        // MainAppPage.prototype.LoadData();
        let alert = this.alertCtrl.create({
          title: notification.title,
          message: notification.message,
          buttons: [{
            text: 'OK',
            role: 'cancel',
          }],
          cssClass: 'alert'
        });
        alert.present();
        console.log("detail notification: " + JSON.stringify(notification))
      }
    }, err => { console.log("notifi", err) });
    pushObject.on('registration').subscribe((token) => {
      console.log(" token = " + token.registrationId);
    }, err => { console.log("err2", err) });
    console.log("push successs");
  }

  check() {
    this.platform.pause.subscribe(() => {
      console.log('[INFO] App paused');
      this.service.postAPI("http://117.6.131.222:4010/RemoocX/isOnline", "id_user=" + this.id + "&type=0")
        .subscribe(result => {
          console.log("change isonline success");
        }), err => {
          console.log("error isOnline " + err);
        }
    });
    this.platform.resume.subscribe(() => {
      console.log('[INFO] App resumed');
      this.service.postAPI("http://117.6.131.222:4010/RemoocX/isOnline", "id_user=" + this.id + "&type=1")
        .subscribe(result => {
          console.log("change isonline success");
        }), err => {
          console.log("error isOnline " + err);
        }
    });
  }
  //end contructor
  exit() {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  exitApp() {
    Platform.prototype.exitApp();
  }

  presentConfirm() {
    const alert = this.alertCtrl.create({
      title: 'Thông báo',
      message: 'Vui lòng bât GPS',
      buttons: [
        {
          text: 'hủy',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Bật',
          handler: () => {
            this.diagnostic.switchToLocationSettings();
          }
        }
      ],
      cssClass: 'confirm'
    });
    alert.present();
  }


  ionViewWillEnter() {
    console.log('Runnnnnnnnnnnnn ionViewWillEnter App.Component')
  }



  public openPage(page: PageInterface) {
    this.activePage = page
    this.menu.close();

    if (page.index) {
      this.nav.push(page.component, { tabIndex: page.index });

    } else {
      this.nav.push(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }
  }

  public checkActivePage(page): boolean {
    return page === this.activePage;
  }
  // logout cu cua chi Quynh
  // openPageLogout() {
  //   this.service.removeDataNativeStore("userLogin").then(user => {
  //     console.log("userLogin");
  //     console.log('nhay vao logout' + user.id);
  //     this.service.postAPI("http://117.6.131.222:4010/RemoocX/Logout", "id=" + user.id)
  //       .subscribe(data => {
  //         console.log('logout success');

  //         debugger

  //         if (data.ID == 1) {
  //           console.log('id la' + data.Object.Id);
  //           console.log("Remove userLogin ss");

  //           this.service.flagSet = 0
  //           this.config.flagPage = 0
  //           this.nav.push(LoginPage)
  //           this.activePage = null;

  //         } else {
  //           console.log('loi khi log out');
  //         }
  //       })


  //   }, error => {
  //     console.error("Remove userLogin ERROR" + error);
  //   })
  // }
  //
  // log out test cua Tung
  openPageLogout() {
    this.service.getDataNativeStore("userLogin").then(user => {
      console.log("userLogin");
      console.log('nhay vao logout' + user.id);
      this.service.postAPI("http://117.6.131.222:4010/RemoocX/Logout", "id=" + user.id)
        .subscribe(data => {
          console.log('is_online set back to 0');

          debugger

          if (data.ID == 1) {
            console.log('id la' + data.Object.Id);
            console.log("Remove userLogin ss");
          } else {
            console.log('loi khi log out');
          };

        })


    }, error => {
      console.error("Remove userLogin ERROR1" + error);
    })

    this.service.removeDataNativeStore("userLogin").then(user => {
      this.service.flagSet = 0
      this.config.flagPage = 0
      this.nav.push(LoginPage)

      this.activePage = null;
    }, error => {
      console.error("Remove userLogin ERROR2" + error);
    })
  }

}
