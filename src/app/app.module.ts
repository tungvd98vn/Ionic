import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, AlertController } from 'ionic-angular';
//Page
import { TabsPage } from '../pages/main/main';
import { TaikhoanPage } from '../pages/taikhoan/taikhoan';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { UploadavatarPage } from '../pages/uploadavatar/uploadavatar';

import { DatePicker } from "@ionic-native/date-picker";
//Googlemap
import { GoogleMaps } from '@ionic-native/google-maps';
//Paypal
import { PayPal } from '@ionic-native/paypal';
//upload img
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
// import { SQLite } from '@ionic-native/sqlite';
//Chart
import { Service } from "../providers/service";
import { CalendarPage } from "../pages/calendar/calendar";
//calendar
import { GooglePlus } from 'ionic-native';
import { Keyboard } from '@ionic-native/keyboard';
import { Googleservice } from "../providers/googleservice";
//Notification
// import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { NotificationPage } from "../pages/notification/notification";
import { ToastService } from "../providers/toast-service";
//Signature
// import { SignaturePadModule } from 'angular2-signaturepad';
import { IonicStorageModule } from '@ionic/storage';
//moment
import moment from 'moment';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { Configservice } from "../providers/config";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { newTripPage } from '../pages/newTrip/newTrip';
import { ChatPage } from '../pages/chat/chat';
import { TripPage } from '../pages/trip/trip';
import { DetailTripPage } from '../pages/detail-trip/detail-trip';
import { EnterphonePage } from "../pages/enterphone/enterphone";

import { HttpModule } from "@angular/http";
import { EmojiPickerComponent } from '../components/emoji-picker/emoji-picker';
import { EmojiProvider } from '../providers/emoji';
import { AppVersion } from '@ionic-native/app-version';
import { Diagnostic } from '@ionic-native/diagnostic';
import { MapPage } from '../pages/map/map';
import { Calendar } from '@ionic-native/calendar';
import { ForgotPassPage } from '../pages/forgot-pass/forgot-pass';
import { Push } from '@ionic-native/push';
import { SelectTripPage } from '../pages/select-trip/select-trip';
import { DetailOrderPage } from '../pages/detail-order/detail-order';
import { ChangePassPage } from '../pages/change-pass/change-pass';
import { SearchPage } from '../pages/search/search';
// import { OneSignal } from '@ionic-native/onesignal';
// const cloudSettings: CloudSettings = {
//   'core': {
//     'app_id': '837c95ec'
//   },
//   'insights': {
//     'enabled': true
//   },
//   'push': {
//     'sender_id': '280154027277',
//     'pluginConfig': {
//       'ios': {
//         'alert': true,
//         'badge': true,
//         'sound': true
//       },
//       'android': {
//         'iconColor': '#343434'
//       }
//     }
//   }
// };

@NgModule({
  declarations: [
    SelectTripPage,
    EmojiPickerComponent,
    DetailTripPage,
    TripPage,

    ChatPage,
    newTripPage,
    MapPage,
    MyApp,
    TabsPage,
    TaikhoanPage,
    LoginPage,
    RegisterPage,
    UploadavatarPage,
    NotificationPage,
    CalendarPage,
    EnterphonePage,
    ForgotPassPage,
    DetailOrderPage,
    ChangePassPage,
    SearchPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    // SignaturePadModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SelectTripPage,
    CalendarPage,
    MapPage,
    DetailTripPage,
    TripPage,
    ChatPage,
    newTripPage,
    MyApp,
    TabsPage,
    TaikhoanPage,
    LoginPage,
    RegisterPage,
    UploadavatarPage,
    NotificationPage,
    EnterphonePage,
    ForgotPassPage,
    DetailOrderPage,
    ChangePassPage,
    SearchPage
  ],
  providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler },
    Calendar,
    AppVersion,
    NativeStorage,
    Facebook,
    File,
    Transfer,
    Camera,
    FilePath,
    // SQLite,
    AlertController,
    GoogleMaps,
    Service,
    Configservice,
    PayPal,
    GooglePlus,
    Googleservice,
    ToastService,
    DatePicker,
    ScreenOrientation,
    InAppBrowser,
    EmojiProvider,
    Diagnostic,
    Keyboard,
    Push
    // OneSignal
  ]
})
export class AppModule { }
