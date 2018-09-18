import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Service } from '../../providers/service';
import moment from 'moment';
import { ToastService } from '../../providers/toast-service';
import { NativeStorage } from "@ionic-native/native-storage";
import { Geolocation } from 'ionic-native';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Diagnostic } from '@ionic-native/diagnostic';
import { empty } from 'rxjs/Observer';
// import * as $ from 'jquery'
declare var ol: any;
declare var jQuery, $: any
declare var google;
declare var cordova: any;
declare var fm: any;
/*
  Generated class for the Maps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-newTrip',
  templateUrl: 'newTrip.html'
})
export class newTripPage {

  public clients3: any;
  public lenh: boolean = false;
  public list_lenh = [];
  public checkChange: boolean;
  public driverID;
  note_trip: any;
  temitems = [];
  temitems2 = [];
  public txtCong_code
  public select_company: string;
  public checkupdate = false;
  public myLat: any;
  public myLong: any;
  public polygon_packing_end: string;
  public polygon_packing_start: string;
  txtcode_remooc: any;
  text_packing1: string;
  text_packing2: string;
  draw_map_To: any;
  draw_map_From: any;
  public localtion1: string
  public localtion2: string
  public localtion3
  public temp_remooc_code = [];
  public gis: any
  string_vitual: string;
  trip_code: string
  list_point: Array<string>;

  license_plate: string = this.navParams.get('license_plate'); //truyền biển số

  driver_ID: string = this.navParams.get('driverID'); //truyền driverID

  time_rc: any = new Date().getTime();
  myDate: any = moment(this.time_rc).format('YYYY-MM-DD HH:mm:ss')
  list_remooc = [];
  txtAmount: any;
  driver_id: any;
  isCheck: boolean = true;
  showList: boolean = false;
  showlist2: boolean = false;
  searchQuery: string = '';
  items = [];
  code_remooc = [];
  txt_code: any;
  public list_packing = []
  pet = 'Tracking'
  public showinfor: boolean = true
  isToggled_stop: boolean = false;

  start: boolean = false; // khởi tạo false
  validate: boolean = false;

  autocompleteItems;
  autocompleteItems2;
  autocompleteItems3;
  autocomplete;
  autocomplete2;
  autocomplete3;
  id_driver: any;
  img_map: any = "https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=enc:";
  service = new google.maps.places.AutocompleteService();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    public viewCtrl: ViewController,
    public sever: Service,
    public toast: ToastService,
    private iab: InAppBrowser,
    private diagnostic: Diagnostic,
    public alertCtrl: AlertController,

  ) {
    this.clients3 = new fm.websync.client('http://117.6.131.222:8089/websync.ashx');
    fm.websync.client.enableMultiple = true;
    this.connect();
    // this.batdau();
    this.subscribe();



    this.sever.getAPINoJson('https://play.google.com/store/apps/details?id=com.iii.romooc_tracking&hl=vi')
      .subscribe(abc => {
        var vt = abc.search('softwareVersion');
        var textVt = abc.substring(vt + 18, vt + 50);
        var listText = textVt.split('  <');
        console.log('asdas' + listText[0] + 'dsdsd')
        let that = this;
        cordova.getAppVersion.getVersionNumber(function (versionApp) {
          console.log('version app: ' + versionApp)
          if (listText[0] == versionApp) {
            that.checkupdate = false;
          }
          else {
            that.checkupdate = true;
          }
        });
      })

    // this.load_code();
    this.autocompleteItems2 = [];
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.autocomplete2 = {
      query2: ''
    };
    this.autocomplete3 = {
      query3: ''
    };
    this.sever.getDataNativeStore('userLogin').then(data => {
      this.id_driver = data.id;
    }, error => {

    })

    this.getDriverID();
  }


  get_trip_code() {
    console.log('DriverID là............ ' + this.driver_ID)
    this.sever.postAPI('http://117.6.131.222:4010/RemoocX/CreateTripCode', 'DriverId=' + this.driver_ID)
      .subscribe(data => {
        this.trip_code = data.Object.Trip_code
        console.log('TripCode là............ ' + this.trip_code)
      })
    this.start = !this.start;
    this.sever.dialog('Khởi tạo thành công');
  }

  huy_data() {
    this.sever.postAPI('http://117.6.131.222:4010/RemoocX/CancelTracking', 'Trip_code=' + this.trip_code)
      .subscribe(data => {
        console.log('Trạng thái hiện tại ' + data.Object.Status)
      })
    this.start = !this.start;
  }

  getDriverID() {
    this.sever.postAPI('http://117.6.131.222:4010/Driver/GetVitualDriver', this.license_plate) //'License_plate=51C - 626.88'
      .subscribe(data => {
        this.string_vitual = data.Object.virual_intiary;
        this.catchuoi(this.string_vitual);
      })
  }

  catchuoi(string_vitual) {
    if (string_vitual.length > 4) {
      string_vitual = string_vitual.substr(2, this.string_vitual.length - 4);
      this.list_point = string_vitual.split('],[');
      for (var i = 0; i < this.list_point.length; i++) {
        this.list_point[i] = "[" + this.list_point[i] + ']';
        console.log(this.list_point[i]) + '.............';
      }
    }
  }

  toggchange_stop() {
    if (this.isToggled_stop == false) {
      this.isToggled_stop = true;
      console.log(this.isToggled_stop);
    }
    else {
      this.isToggled_stop = false;
      console.log(this.isToggled_stop);
    }
  }

  loadlenh() {
    //this.list_lenh = [];
    console.log('chạy tới đây ;;;;;;;;;;;;;;;;');
    this.sever.getDataNativeStore('userLogin')
      .then(user => {
        console.log('chạy tới đây ;;;;;;;;;;;;;;;;' + user.id);
        this.driverID = user.id;
        this.sever.postAPI('http://117.6.131.222:4010/CommandOrderTruck/View_Driver_Book', 'idUser=' + user.id)
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
                congCode: lenh.macont,
                ghichu: lenh.ghichu,
              })
            });
          })
      })
    console.log('length= ' + this.list_lenh.length)
  }

  // getSettings(){
  //   this.sever.postAPI('http://117.6.131.222:4010/SettingOnOff/getSetting', null)
  //         .subscribe(data => {
  //           if( JSON.stringify(data.Object.Value) == '""'){  
  //             this.is_toogle == true;
  //           }else{
  //             this.is_toogle == false;
  //             alert('ko  '+ JSON.stringify(data.Object.Value));
  //           }
  //   )
  // }

  selectLenh(lenh) {

    console.log("select lệnh success " + JSON.stringify(lenh));

    this.txtAmount = lenh.sodaukeo;
    this.txtcode_remooc = lenh.somooc;
    setTimeout(() => {
      this.chooseItem(lenh.noilay);
    }, 100);
    setTimeout(() => {
      this.chooseItem2(lenh.noiha);
    }, 100);
    setTimeout(() => {
      this.chooseItem3(lenh.noixuatphat);
    }, 100);
    this.txtCong_code = lenh.congCode;
    this.note_trip = lenh.ghichu;
  }

  chose_address2() {
    if (this.autocomplete2.query2 == '') {
      this.autocompleteItems2 = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete2.query2, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
      me.autocompleteItems2 = [];
      me.zone.run(function () {
        if (predictions.length > 0) {
          predictions.forEach(function (prediction) {
            me.autocompleteItems2.push(prediction.description);
          });
        } else { }
      });
    });
  }

  chooseItem2(it_a) {
    // $('[id="chose_address2"]').css("display", "none");
    this.autocompleteItems2 = [];
    this.autocomplete2.query2 = it_a;
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete2.query2, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
      console.log('id place noi ha: ' + predictions[0].place_id)
      me.sever.getAPI("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + predictions[0].place_id + "&key=AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU")
        .subscribe(
          data2 => {
            me.localtion2 = data2.result.geometry.location.lng + ',' + data2.result.geometry.location.lat;
            // me.check_packing_end('[' + me.localtion2 + "]")
            me.draw_map_To = data2.result.geometry.location.lat + "," + data2.result.geometry.location.lng
            if (me.draw_map_From != null) {
              me.draw_map(me.draw_map_From, me.draw_map_To)
            }
          }
        )
    });
  }

  updateSearch2() {
    if (this.autocomplete2.query2 == '') {
      this.autocompleteItems2 = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete2.query2, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
      me.autocompleteItems2 = [];
      me.zone.run(function () {
        if (predictions.length > 0) {
          predictions.forEach(function (prediction) {
            me.autocompleteItems2.push(prediction.description);
          });
        } else { }
      });
    });
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    console.log("xXx: " + this.autocomplete.query)

    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {
        if (predictions.length > 0) {
          predictions.forEach(function (prediction) {
            me.autocompleteItems.push(prediction.description);
          });
        }
        else { }
      });
    });

    console.log("YYY " + this.autocompleteItems);
  }

  updateSearch3() {
    if (this.autocomplete3.query3 == '') {
      this.autocompleteItems3 = [];
      return;
    }
    console.log("xXx: " + this.autocomplete3.query3)

    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete3.query3, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
      me.autocompleteItems3 = [];
      me.zone.run(function () {
        if (predictions.length > 0) {
          predictions.forEach(function (prediction) {
            me.autocompleteItems3.push(prediction.description);
          });
        }
        else { }
      });
    });
  }

  chooseItem3(it_a) {
    // $('[id="chose_address3"]').css("display", "none");
    this.autocompleteItems3 = [];
    this.autocomplete3.query3 = it_a;
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete3.query3, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
      console.log('id place noi xuất phát: ' + predictions[0].place_id)
      me.sever.getAPI("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + predictions[0].place_id + "&key=AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU").subscribe(
        data1 => {
          me.localtion3 = data1.result.geometry.location.lng + ',' + data1.result.geometry.location.lat
          console.log('tronggggggggggggggggggggggggg    ' + me.localtion3)
        }
      )
    });

  }

  chooseItem(it_a) {
    // $('[id="chose_address"]').css("display", "none");
    this.autocompleteItems = [];
    this.autocomplete.query = it_a;
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
      console.log('id place noi đến: ' + predictions[0].place_id)
      me.sever.getAPI("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + predictions[0].place_id + "&key=AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU").subscribe(
        data1 => {
          me.localtion1 = data1.result.geometry.location.lng + ',' + data1.result.geometry.location.lat
          console.log('tronggggggggggggggggggggggggg    ' + me.localtion1)
          // me.check_packing_start("[" + me.localtion1 + "]");
          me.draw_map_From = data1.result.geometry.location.lat + "," + data1.result.geometry.location.lng
          if (me.draw_map_To != null) {
            me.draw_map(me.draw_map_From, me.draw_map_To)
          }
        }
      )
    });

  }

  ionViewWillEnter() {
    // this.load_map();
    this.load_code();
    this.load_code_remooc();

    console.log('ionViewDidLoad MapsPage');

    if (this.showinfor == false) {
      let mystyle = document.getElementById("action_popup")
      mystyle.style.display = "none";
    } else {
      let mystyle = document.getElementById("action_popup")
      mystyle.style.display = "block";
    }
  }

  ionViewDidLoad() {
    this.loadlenh();
    this.load_code();
    this.load_code_remooc();
    // this.load_map1();
    // this.load_map();
    console.log('ionViewDidLoad MapsPage');
    if (this.showinfor == false) {
      let mystyle = document.getElementById("action_popup")
      mystyle.style.display = "none";
    } else {
      let mystyle = document.getElementById("action_popup")
      mystyle.style.display = "block";
    }

  }

  show_popup() {
    this.showinfor = !this.showinfor;
    let mystyle = document.getElementById("action_popup");
    if (this.showinfor == true) {
      mystyle.style.display = 'block';
    }
    else {
      mystyle.style.display = 'none';
    }
  }

  getItems() {
    // Reset items back to all of the items
    // this.load_code();
    console.log(JSON.stringify(this.items));
    // set val to the value of the searchbar
    // if the value is an empty string don't filter the items
    if (this.txtAmount != '') {

      // Filter the items
      this.temitems = this.items.filter(function (item) {
        console.log("itemsss= " + item);
        return item.toLowerCase().indexOf(this.txtAmount.toLowerCase()) > -1;
      }.bind(this));

      // Show the results
      this.showList = true;
    } else {
      this.temitems = []
      // hide the results when the query is empty
      this.showList = false;
    }
  }

  load_code() {

    this.sever.getDataNativeStore('userLogin').then(data => {
      console.log('info login: ' + data.userName)
      this.driver_id = data.id;
      this.select_company = data.company
      this.items = [];
      this.sever.postAPI('http://117.6.131.222:4010/remoocx/GetAllTractorx', 'company_code=' + this.select_company)
        .subscribe(data => {

          console.log('length::::::::::::: ' + data.length)
          for (let i = 0; i < data.length; i++) {
            this.items.push(data[i].Code)
          }
        })

    }, error => {
      console.log('get info account login error: ' + error.message)
    });
    //get infor user login
  }

  getItems2() {
    this.checkChange = false;
    this.temitems2 = []
    // Reset items back to all of the items
    // this.load_code_remooc();
    console.log(JSON.stringify(this.code_remooc));
    // set val to the value of the searchbar
    // if the value is an empty string don't filter the items
    if (this.txtcode_remooc != '') {

      // Filter the items
      this.temitems2 = this.code_remooc.filter(function (item) {
        console.log("itemsss22220= " + item);
        return item.toLowerCase().indexOf(this.txtcode_remooc.toLowerCase()) > -1;
      }.bind(this));

      // Show the results
      this.showlist2 = true;
    } else {
      this.temitems2 = []
      // hide the results when the query is empty
      this.showlist2 = false;
    }
  }

  load_code_remooc() {
    this.sever.postAPI('http://117.6.131.222:4010/remoocX/GetAllRemooc', '')
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.code_remooc.push(data[i].Code)
        }
        // console.log("List Remooc: " + JSON.stringify(this.code_remooc))
      })
  }
  setText2(it) {
    $('[id="chose_tractor2"]').css("display", "none");
    this.txtcode_remooc = it;
    this.enter_remooc();
  }

  setText(it) {
    $('[id="chose_tractor"]').css("display", "none");
    this.txtAmount = it;
  }

  enter_remooc() {
    this.checkChange = true;
    if (this.txtcode_remooc == '' || this.txtcode_remooc == null) {
      this.sever.dialog('Vui lòng nhập mã remooc')
    }
    else {
      this.toast.showLoading("");
      var url = "http://117.6.131.222:4010/remoocx/isCheckRemooc2"
      var body = "remooc_code=" + this.txtcode_remooc;
      this.sever.postAPI(url, body).subscribe(data => {
        if (data.ID == 1) {
          this.toast.dismissLoading();
          this.sever.dialog("Romooc " + this.txtcode_remooc + " đang bận");
          this.txtcode_remooc = "";
        } else if (data.ID == 3) {
          this.toast.dismissLoading();
          this.sever.dialog(data.Title);
          this.txtcode_remooc = "";
        } else {
          this.toast.dismissLoading();
          this.toast.showToast("Chọn remooc thành công");
          this.txtCong_code = data.Object;
          // if (this.list_remooc.length > 0) {
          // for (var i = 0; i < this.list_remooc.length; i++) {
          //   if (this.list_remooc[i] == this.txtcode_remooc) {
          //     this.sever.dialog("Mã Romooc " + this.txtcode_remooc + " đã tồn tại");
          //     // this.txtcode_remooc = "";
          //     return
          //   } else {
          //     this.list_remooc.push(this.txtcode_remooc);
          //     this.txtcode_remooc = "";
          //   }
          // }
          // } else {
          //   console.log("lenght romooc else: " + this.list_remooc.length)
          //   this.list_remooc.push(this.txtcode_remooc);
          //   this.txtcode_remooc = "";
          // }

          // this.temp_remooc_code.push(this.txtcode_remooc);   

          // console.log('length:       ' + this.temp_remooc_code.length);
          console.log('remoooc:        ' + this.txtcode_remooc);
          // console.log('arrayyyyyyyyyy:  ' + this.temp_remooc_code);
        }
      }, error => {
        this.sever.dialog("Vui lòng kiểm tra kết nối internet");
        this.txtcode_remooc = ""
        console.log("Error: " + error)
        this.toast.dismissLoading();
      })

    }
  }

  function_keo() {
    if (this.txtAmount == '' || this.txtAmount == null ||
      this.autocomplete.query == '' || this.autocomplete.query == null ||
      this.autocomplete2.query2 == '' || this.autocomplete2.query2 == null ||
      this.txtcode_remooc == '' || this.txtcode_remooc == null ||
      this.autocomplete3.query3 == '' || this.autocomplete3.query3 == null) {
      this.sever.dialog('Vui lòng nhập đầy đủ thông tin');

      if (this.checkChange == false) {
        this.toast.dismissLoading();
        this.sever.dialog("Vui lòng kiểm tra lại mã Remooc");
        return;
      }
    }
    else {
      console.log('Trần Tiến Đạt')
      console.log('location bãi lấy: ' + this.localtion1 + '\n location nơi đi: ' + this.localtion3 + '\n location bãi đến: ' + this.localtion2);

      var body = (
        'Remooc_code=' + this.txtcode_remooc
        + '&Tractor_code=' + this.txtAmount
        + '&Trip_code=' + this.trip_code
        + '&Start_position_text=' + this.autocomplete.query
        + '&Start_position_gps=' + this.localtion1
        //+ '&Start_position_parking=' + this.polygon_packing_start
        + '&Start_position_time=' + this.myDate
        + '&Driver_Id=' + this.driver_ID
        //+ '&company_code=' + this.select_company
        + '&Note=' + this.note_trip
        + '&container_code=' + this.txtCong_code
        + '&start_point=' + this.autocomplete3.query3
        + '&start_point_gps=' + this.localtion3
        + '&status= START'
      )

      console.log(body);

      this.sever.postAPI('http://117.6.131.222:4010/RemoocX/UpdateTracking', body)
        .subscribe(data => {
          this.toast.dismissLoading();
          console.log('dataaaaaaaaaaaaaaaaa:    ');
          if (data.ID == 0) {
            this.sever.dialog(data.Title)
          }
          else {
            this.ionViewWillEnter();
            this.ionViewDidLoad();
            this.sever.dialog(data.Title)
            // this.txtAmount = '';
            // this.autocomplete.query = '';
            // this.autocomplete2.query2 = '';
            // this.list_remooc = [];

            this.saveCache(this.txtAmount, this.txtcode_remooc, data.Object.Trip_code, this.localtion2)
            this.isCheck = false;
          }
        }, error => {
          this.service.dialog('Vui lòng kiểm tra kết nối internet')
          console.log('error Login: ' + error)
          this.toast.dismissLoading()
        })
    }
  }

  function_giaiphong() {
    if (this.txtAmount == '' || this.txtAmount == null || this.autocomplete.query == '' || this.autocomplete.query == null || this.autocomplete2.query2 == '' || this.autocomplete2.query2 == null || this.txtcode_remooc == null || this.txtcode_remooc == null) {
      this.sever.dialog("Vui lòng nhập đầy đủ thông tin")
    }
    else {
      console.log(".............................");
      console.log('id_tracking: ' + this.polygon_packing_end)
      // var body = (
      //   'Remooc_code=' + this.list_remooc
      //   + '&Tractor_code=' + this.txtAmount
      //   + '&Trip_code= abccc'
      //   + '&End_position_text=' + this.autocomplete2.query2
      //   + '&End_position_gps=' + this.localtion1
      //   + '&End_position_parking=' + this.polygon_packing_end
      //   + '&End_position_time=' + this.myDate
      //   + '&Driver_Id=' + this.driver_id
      // )

      this.sever.getDataNativeStore('tracking').then(result => {
        console.log("Result Giai phong: " + JSON.stringify(result));
        console.log('id_tracking: ' + this.polygon_packing_end)
        var body = (
          //result.Tractor_code,this.myDate,this.localtion2, this.polygon_packing_end, result.Remooc_code
          'Tractor_code=' + this.txtAmount
          + '&End_position_time=' + this.myDate
          + '&End_position_gps=' + this.localtion1
          //+ '&End_position_parking=' + this.polygon_packing_end
          + '&Remooc_code=' + this.txtcode_remooc
          + '&Note=' + this.note_trip
          + '&Driver_id=' + this.id_driver
          + '&Trip_code=' + this.trip_code
          + '&End_position_text=' + this.autocomplete2.query2
        )
        console.log(".............................");
        console.log(".............................");
        console.log(".............................");
        console.log("Body: xXx: " + body);
        console.log(".............................");
        console.log(".............................");
        console.log(".............................");
        this.sever.postAPI('http://117.6.131.222:4010/remoocX/InsertEndTracking', body)
          .subscribe(data => {
            console.log('dataaaaaaaaaaaaaaaaa: ' + JSON.stringify(data));
            if (data.ID == 0) {
              this.sever.dialog(data.Title)
            }
            else {
              this.sever.dialog(data.Title)
              // this.txtAmount = '';
              // this.autocomplete.query = '';
              // this.autocomplete2.query2 = '';
              // this.list_remooc = [];this.sever.dialog(data.Title)
              this.ionViewDidLoad();
            }

          }, error => {
            console.log("Vui lòng kiểm tra kết nối internet")
            this.toast.dismissLoading();
          })
        this.sever.dialog("Thả thành công")
      }, error => {
        console.log("Result GP ERROR: " + error)
      })

    }
  }

  saveCache(tractor_code, remooc_code, trip_code, end_position_text) {
    //save information
    NativeStorage.prototype.setItem('tracking', {
      Tractor_code: tractor_code,
      Remooc_code: remooc_code,
      Trip_code: trip_code,
      End_position_text: end_position_text
    })
      .then(
        () => {
          console.log('Save cache success')
        },
        error => console.error('Error storing item', error)
      );
  }

  check_packing_end(local) {
    console.log('chay vao ham check')
    this.list_packing = []
    var body
    console.log("local  " + local)
    this.sever.postAPI('http://117.6.131.222:4010/remoocx/GetAllPacking', body)
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          var name_packing = data[i].title
          // console.log('gissss_string: ' + data[i].Gis_data);
          var gis_data = JSON.parse(data[i].Gis_data);
          console.log(gis_data);
          console.log(JSON.stringify(gis_data));
          console.log('1' + gis_data.gis_data[0].length)
          console.log('2' + gis_data.gis_data[0][0].length)
          var b = [[]]
          var a = [[]]
          for (let j = 0; j < gis_data.gis_data[0].length; j++) {
            var temp_gis2 = '[' + ol.proj.transform(gis_data.gis_data[0][j], 'EPSG:3857', 'EPSG:4326') + ']';
            b[0].push(temp_gis2)

          }
          a[0].push(b)
          console.log('a ' + a)
          var abc = '[[' + a + ']]'
          console.log('abc' + abc);

          // var url = "http://117.6.131.222:3000/point_in_polygon?point=" + local + "&polygon=" + abc
          // this.sever.getAPI(url).subscribe(data1 => {
          //   var styletext = document.getElementById('text_packing1')
          //   if (data1.result == true) {
          //     this.polygon_packing_end = data[i].Id
          //     this.text_packing2 = 'Thuộc ' + name_packing
          //     styletext.style.color = 'green';
          //     return;
          //   }
          //   else {
          //     this.text_packing2 = "Không thuộc bãi xe nào"
          //     styletext.style.color = "red";
          //   }
          // })
        }
      })
  }

  check_packing_start(local) {
    console.log('chay vao ham check')
    this.list_packing = []
    var body
    console.log("local  " + local)
    this.sever.postAPI('http://117.6.131.222:4010/remoocx/GetAllPacking', body)
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          var name_packing = data[i].title
          // console.log('gissss_string: ' + data[i].Gis_data);
          var gis_data = JSON.parse(data[i].Gis_data);
          console.log(gis_data);
          console.log(JSON.stringify(gis_data));
          console.log('1' + gis_data.gis_data[0].length)
          console.log('2' + gis_data.gis_data[0][0].length)
          var b = [[]]
          var a = [[]]
          for (let j = 0; j < gis_data.gis_data[0].length; j++) {
            var temp_gis2 = '[' + ol.proj.transform(gis_data.gis_data[0][j], 'EPSG:3857', 'EPSG:4326') + ']';
            b[0].push(temp_gis2)

          }
          a[0].push(b)
          console.log('a ' + a)
          var abc = '[[' + a + ']]'
          console.log('abc' + abc);

          // var url = "http://117.6.131.222:3000/point_in_polygon?point=" + local + "&polygon=" + abc
          // this.sever.getAPI(url).subscribe(data1 => {
          //   var styletext = document.getElementById('text_packing')
          //   if (data1.result == true) {
          //     this.polygon_packing_start = data[i].Id
          //     this.text_packing1 = 'Thuộc ' + name_packing
          //     styletext.style.color = 'green';
          //     return;
          //   }
          //   else {
          //     this.text_packing1 = "Không thuộc bãi xe nào"
          //     styletext.style.color = "red";
          //   }
          // })
        }
      })
  }

  draw_map(from, to) {
    console.log("URL ne: " + 'https://maps.googleapis.com/maps/api/directions/json?origin=' + from + '&destination=' + to + '&mode=driving&key=AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU')
    this.sever.getAPI('https://maps.googleapis.com/maps/api/directions/json?origin=' + from + '&destination=' + to + '&mode=driving&key=AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU')
      .subscribe(data2 => {
        console.log('dataaaaaaaaaaa' + data2)
        console.log(data2.routes[0].overview_polyline.points)
        this.img_map = "https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=enc:" + encodeURI(data2.routes[0].overview_polyline.points);
      })
  }

  getEndGPS() {
    let successCallback = (isAvailable) => {
      console.log('Is available? ' + isAvailable);
      if (isAvailable == false) {
        this.presentConfirm()
      }
    };
    let errorCallback = (e) => { console.error(e); };
    this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);
    Geolocation.getCurrentPosition().then((resp) => {
      var endGPSLat = resp.coords.latitude;
      var endGPSLong = resp.coords.longitude;
      console.log('lat: ' + endGPSLat + ' long: ' + endGPSLong);
      this.sever.getAPI('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + endGPSLat + ',' + endGPSLong + '&sensor=true')
        .subscribe(data => {
          this.autocomplete2.query2 = data.results[0].formatted_address;
          console.log(data.results[0].formatted_address)
          this.toast.dismissLoading();
        }),
        error => {
          this.toast.dismissLoading();
          this.sever.dialog('Kiểm tra kết nối mạng')
        }
      this.draw_map_To = endGPSLat + ',' + endGPSLong;
      this.localtion2 = this.draw_map_To;
      console.log('location to: ' + this.draw_map_To)
      // this.check_packing_end('[' + this.localtion2 + "]")
      if (this.draw_map_From != null) {
        this.draw_map(this.draw_map_From, this.draw_map_To)
      }
    }).catch((error) => {
      this.toast.dismissLoading();
      console.log('Error getting location', error);
      this.sever.dialog('Vui lòng bật GPS')
    });
    // var endGPSLat = this.getGPS().myLat;
    // var endGPSLong = this.getGPS().myLong;


  }

  getStartGPS() {
    let successCallback = (isAvailable) => {
      console.log('Is available? ' + isAvailable);
      if (isAvailable == false) {
        this.presentConfirm()

      }
    };
    let errorCallback = (e) => { console.error(e); };
    this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);

    Geolocation.getCurrentPosition().then((resp) => {
      var startGPSLat = resp.coords.latitude;
      var startGPSLong = resp.coords.longitude;
      console.log('lat: ' + startGPSLat + ' long: ' + startGPSLong);
      this.sever.getAPI('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + startGPSLat + ',' + startGPSLong + '&sensor=true')
        .subscribe(data => {
          this.autocomplete.query = data.results[0].formatted_address;
          console.log(data.results[0].formatted_address)
          this.toast.dismissLoading();
        }), error => {
          this.toast.dismissLoading();
          this.sever.dialog('Kiểm tra kết nối mạng')
        }
      this.draw_map_From = startGPSLat + ',' + startGPSLong;
      console.log('location form: ' + this.draw_map_From);
      this.localtion1 = this.draw_map_From;
      // this.check_packing_start('[' + this.localtion1 + "]")
      if (this.draw_map_To != null) {
        this.draw_map(this.draw_map_From, this.draw_map_To)
      }

    }).catch((error) => {
      console.log('Error getting location', error);
      this.sever.dialog('Vui lòng bật GPS')
    });
  }

  getStartGPS2() {
    let successCallback = (isAvailable) => {
      console.log('Is available? ' + isAvailable);
      if (isAvailable == false) {
        this.presentConfirm()

      }
    };
    let errorCallback = (e) => { console.error(e); };
    this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);

    Geolocation.getCurrentPosition().then((resp) => {
      var startGPSLat = resp.coords.latitude;
      var startGPSLong = resp.coords.longitude;
      console.log('lat: ' + startGPSLat + ' long: ' + startGPSLong);
      this.sever.getAPI('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + startGPSLat + ',' + startGPSLong + '&sensor=true')
        .subscribe(data => {
          this.autocomplete3.query3 = data.results[0].formatted_address;
          console.log(data.results[0].formatted_address)
          this.toast.dismissLoading();
        }), error => {
          this.toast.dismissLoading();
          this.sever.dialog('Kiểm tra kết nối mạng')
        }
      this.localtion3 = startGPSLat + ',' + startGPSLong;
      console.log('location form: ' + this.localtion3);
      // this.localtion1 = this.draw_map_From;
      // // this.check_packing_start('[' + this.localtion1 + "]")
      // if (this.draw_map_To != null) {
      //   this.draw_map(this.draw_map_From, this.draw_map_To)
      // }

    }).catch((error) => {
      console.log('Error getting location', error);
      this.sever.dialog('Vui lòng bật GPS')
    });
  }

  update() {
    const browser = this.iab.create('https://play.google.com/store/apps/details?id=com.iii.romooc_tracking&hl=vi');
  }

  presentConfirm() {
    const alert = this.alertCtrl.create({
      title: 'Thông báo',
      message: 'Vui lòng bât GPS',
      buttons: [
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
    $('.alert-button').addClass('oneBtn');
  }

  show(txtcode_remooc) {
    alert(txtcode_remooc);
  }

  clickCheck(e) {
    this.ionViewWillEnter();
    // this.ionViewDidLoad();
  }

  connect() {
    this.clients3.connect({
      onSuccess: function (args) {
        console.log('Connect success ')
      },
      onFailure: function (args) {
        console.log('Connect error ')
      }
    });
  }

  batdau() {
    // this.sever.getDataNativeStore('userLogin')
    //   .then(user => {
    //     console.log('chạy tới đây ;;;;;;;;;;;;;;;;' + user.id);
    //     this.driverID = user.id;
    // this.sever.postAPI('http://117.6.131.222:4010/Driver/GetVitualDriverId', 'idUser=4121')
    //   .subscribe(data => {
    var obj = new Cdata_JSON();

    var list_point = [];
    var dem = 0;
    let that = this;
    for (let i of obj.Cdata_json) {
      console.log(i);
      list_point.push(i);
    }
    setInterval(() => {
      if (that.isToggled_stop == true) {
        return;
      }
      if (dem <= list_point.length) {
        console.log("vao vong lap")
        this.clients3.publish({
          channel: "/warehouse",
          data: {
            driverid: 4045,
            name: "AAA",
            cdata: list_point[dem],
            status: 2
          },
          onSuccess: function (args) {
            console.log("send success")
          }
        });
        dem++;

      } else {
        dem = 0;
        console.log('thoat')
      }
    }, 3000);

    // })


    // })
  }

  subscribe() {
    let that = this;
    this.clients3.subscribe({
      channel: "/warehouse",
      onSuccess: function (args) {
        console.log("reiceve success:");
      },
      onFailure: function (args) {
        that.toast.showLoading("Mất kết nối")
      },
      onReceive: function (args) {
        var message = args.getData();
        console.log(message);
        //that.sendMess(message.name, message.text, message.avatar, args.getWasSentByMe())
      }
    })
  }
}

export class Cdata_JSON {
  public UserName: any;
  public Start: any;
  public End: any;
  public Mode_test: any;
  public NodeGis_Realtime: any;
  public Cdata_json: any;
  public Command: any;
  constructor() {
    this.UserName = "0937470081";
    this.Start = "[20.99101,105.80704]";
    this.End = "[21.00759,105.8236]";
    this.Mode_test = true;
    this.NodeGis_Realtime = "[[21.0716,105.77453]]";
    // this.Cdata_json = [
    //   "[21.07152,105.77265]",
    //   "[21.0716,105.77453]",
    //   "[21.07155,105.77713]",
    //   "[21.0733,105.77721]",
    //   "[21.07425,105.77625]",
    //   "[21.07419,105.77373]",
    //   "[21.07447,105.77359]",
    //   "[21.07547,105.77353]",
    //   "[21.07571,105.77387]"
    // ]
    this.Cdata_json = [
      "[20.99101,105.80704]",
      "[20.99083,105.80675]",
      "[20.99149,105.80621]",
      "[20.99269,105.80522]",
      "[20.9935,105.80643]",
      "[20.99357,105.8065]",
      "[20.99364,105.80652]",
      "[20.9939,105.80685]",
      "[20.99468,105.80795]",
      "[20.99524,105.80878]",
      "[20.9958,105.80956]",
      "[20.99733,105.81188]",
      "[20.99857,105.81384]",
      "[20.99903,105.81449]",
      "[20.99966,105.81545]",
      "[21.00115,105.81769]",
      "[21.00126,105.81776]",
      "[21.00231,105.81922]",
      "[21.00344,105.8207]",
      "[21.00416,105.82168]",
      "[21.00452,105.82201]",
      "[21.0047,105.8222]",
      "[21.00492,105.8223]",
      "[21.00616,105.8229]",
      "[21.00721, 105.82337]",
      "[21.00759, 105.8236]"
    ]
    this.Command = "ACT";
  }
}

export class Driver {
  public UserName: any;
  public Start: any;
  public End: any;
  public Mode_test: any;
  public NodeGis_Realtime: any;
  public Cdata_json: any;
  public Command: any;
  constructor() {
    this.UserName = "0976899577";
    this.Start = "[21.07571, 105.77387]";
    this.End = "[21.06633, 105.7639]";
    this.Mode_test = true;
    this.NodeGis_Realtime = "[[21.0755, 105.77385]]";
    // this.Cdata_json = [
    //   "[21.07152,105.77265]",
    //   "[21.0716,105.77453]",
    //   "[21.07155,105.77713]",
    //   "[21.0733,105.77721]",
    //   "[21.07425,105.77625]",
    //   "[21.07419,105.77373]",
    //   "[21.07447,105.77359]",
    //   "[21.07547,105.77353]",
    //   "[21.07571,105.77387]"
    // ]
    this.Cdata_json = [
      "[21.07571, 105.77387]",
      "[21.0755, 105.77385]",
      "[21.07548, 105.77384]",
      "[21.07546, 105.77363]",
      "[21.07547, 105.77353]",
      "[21.07523, 105.77353]",
      "[21.07481, 105.77356]",
      "[21.07447, 105.77359]",
      "[21.07429, 105.77364]",
      "[21.07421, 105.77367]",
      "[21.07419, 105.77373]",
      "[21.07416, 105.77386]",
      "[21.07418, 105.77433]",
      "[21.07425, 105.77625]",
      "[21.07431, 105.77726]",
      "[21.07381, 105.77723]",
      "[21.0733, 105.77721]",
      "[21.07289, 105.77721]",
      "[21.07253, 105.77721]",
      "[21.07155, 105.77713]",
      "[21.07158, 105.77602]",
      "[21.07158, 105.77467]",
      "[21.0716, 105.77453]",
      "[21.0716, 105.7739]",
      "[21.07152, 105.77295]",
      "[21.07153, 105.77279]",
      "[21.07152, 105.77265]",
      "[21.07147, 105.77255]",
      "[21.07133, 105.77249]",
      "[21.07075, 105.77248]",
      "[21.06942, 105.77251]",
      "[21.06863, 105.77251]",
      "[21.0683, 105.77255]",
      "[21.06739, 105.77254]",
      "[21.06731, 105.77255]",
      "[21.06727, 105.77257]",
      "[21.06721, 105.77274]",
      "[21.06717, 105.77278]",
      "[21.06704, 105.77281]",
      "[21.06471, 105.77297]",
      "[21.06323, 105.77303]",
      "[21.06254, 105.77309]",
      "[21.06206, 105.7731]",
      "[21.06163, 105.77313]",
      "[21.06162, 105.77203]",
      "[21.06158, 105.7715]",
      "[21.06159, 105.7713]",
      "[21.0617, 105.77091]",
      "[21.06207, 105.76979]",
      "[21.06263, 105.76812]",
      "[21.0631, 105.76671]",
      "[21.06418, 105.7637]",
      "[21.06447, 105.76376]",
      "[21.06472, 105.76413]",
      "[21.06504, 105.76464]",
      "[21.0654, 105.76468]",
      "[21.06694, 105.76471]",
      "[21.06704, 105.76469]",
      "[21.06712, 105.76465]",
      "[21.06714, 105.76459]",
      "[21.06714, 105.76439]",
      "[21.06714, 105.76389]",
      "[21.06633, 105.7639]"
    ]
    this.Command = "ACT";
  }
}