import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Service } from '../../providers/service';
import moment from 'moment';
import { TripPage } from '../trip/trip';
import { ToastService } from '../../providers/toast-service';
import { Body } from '@angular/http/src/body';
declare var google;
declare var jQuery, $: any
declare var ol: any;
declare var polyline: any;
declare var renderLinePathLayer: any

// export interface PageInterface {
//   Trip_code: string,
//   Status: string,
//   Start_position: string,
//   End_position:string,
//   Remooc_code:string,
//   Tractor_code:string,
//   Note: string,
//   Start_time:string,
//   End_time:string,
//   // origin: string
// }
/*
  Generated class for the DetailTrip page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-trip',
  templateUrl: 'detail-trip.html'
})
export class DetailTripPage {
  public polygon_packing_start: string;
  time_rc: any = new Date().getTime();
  myDate: any = moment(this.time_rc).format('YYYY-MM-DD HH:mm:ss')
  img: string;
  Trip_code: any
  public Status: any
  Start_position: any
  Remooc_code: any
  Tractor_code: any
  Note: any
  Start_time: any
  End_time: any
  text_packing1: any
  type_user: any;
  isCheck: boolean;
  public end_gps: any
  public end_packing: any
  public id_tracking: any
  public start_gps: any
  public start_parking: any
  public id: any
  autocompleteItems;
  autocomplete;
  public gps1111;
  public gps2222;
  public cameraaLat;
  public cameraaLong;
  sever = new google.maps.places.AutocompleteService();
  public localtion1: string
  // DetialTracking : PageInterface[] = [];
  constructor(private zone: NgZone, public navCtrl: NavController, public navParams: NavParams, public service: Service, public toast: ToastService) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.type_user = navParams.get('type_user');
    if (this.type_user == 1) {
      this.isCheck = true;
    } else {
      this.isCheck = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailTripPage');
    this.view_data();
  }
  view_data() {
    this.toast.showLoading('Loading...');
    this.service.getDataNativeStore('detail_trips').then(data => {
      console.log(data.id)
      this.id = data.id;

      this.service.postAPI('http://117.6.131.222:4010/remoocX/GetIdTracking', 'id=' + data.id)
        .subscribe(data1 => {
          this.toast.dismissLoading();
          if (data1.Title = 'Get packing success' && data1.Object != null) {
            console.log('titleeeeee:' + data1.Title)
            // this.DetialTracking.push({
            this.Trip_code = data1.Object.Trip_code;
            this.Status = data1.Object.End_position_text;
            this.Start_position = data1.Object.Start_position_text;
            this.autocomplete.query = data1.Object.End_position_text;
            this.Remooc_code = data1.Object.Remooc_code;
            this.Tractor_code = data1.Object.Tractor_code;
            this.Note = data1.Object.Note;
            this.Start_time = data1.Object.Start_position_time;
            this.End_time = data1.Object.End_position_time;
            this.end_gps = data1.Object.End_position_gps;
            this.end_packing = data1.Object.End_position_parking;
            this.id_tracking = data1.Object.Id
            this.start_gps = data1.Object.Start_position_gps
            this.autocomplete.query = data1.Object.End_position_text
            console.log('start: ' + data1.Object.Start_position_gps + " end: " + data1.Object.End_position_gps);
            var sai = data1.Object.Start_position_gps;
            var sai2 = data1.Object.End_position_gps
            if (sai == '' || sai2 == '' || sai == null || sai2 == null) {
            }
            else {
              var sai = data1.Object.Start_position_gps;
              var sai1 = sai.split(',')
              console.log('sai1:0  ' + sai1[0] + 'sai1:1 ' + sai1[1])
              var sai2 = data1.Object.End_position_gps
              var sai22 = sai2.split(',')
              console.log('sai2:0 ' + sai22[0] + 'sai2:1 ' + sai22[1])
              this.gps1111 = [sai1[1], sai1[0]];
              this.gps2222 = [sai22[1], sai22[0]]
              this.cameraaLat = sai1[0];
              this.cameraaLong = sai1[1];
              this.load2();

              this.service.postAPI('http://117.6.131.222:4010/JnanaToken/GetKey', 'Service_type=direction_api')
                .subscribe(getkey => {
                  this.service.getAPI('https://maps.googleapis.com/maps/api/directions/json?origin=' + sai1[1] + ',' + sai1[0] + '&destination=' + sai22[1] + ',' + sai22[0] + '&mode=driving&key=' + getkey.Object.Key)
                    //AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU
                    .subscribe(data2 => {
                      this.img = "https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=enc:" + encodeURI(data2.routes[0].overview_polyline.points);
                    })
                })

            }
          }
        }, error => {
          this.service.dialog('Vui lòng kiểm tra kết nối internet')
          console.log('error Login: ' + error)
          this.toast.dismissLoading()
        })
    })
    // })
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    let me = this;
    this.sever.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
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
  }

  chooseItem(it_a) {
    $('[id="chose_address"]').css("display", "none");
    this.autocomplete.query = it_a;
    let me = this;
    this.sever.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'vn' } }, function (predictions, status) {
      console.log(predictions[0].place_id)

      me.service.postAPI('http://117.6.131.222:4010/JnanaToken/GetKey', 'Service_type=direction_api')
        .subscribe(getkey => {
          me.service.getAPI("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + predictions[0].place_id + "&key=" + getkey.Object.Key)
            //AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU
            .subscribe(
              data1 => {
                me.end_gps = data1.result.geometry.location.lng + ',' + data1.result.geometry.location.lat;
                console.log('tronggggggggggggggggggggggggg    ' + me.end_gps)
                me.check_packing_start("[" + me.end_gps + "]");
              }
            )
        })

    });

  }

  check_packing_start(local) {
    console.log('chay vao ham check')
    var body
    console.log("local  " + local)
    this.service.postAPI('http://117.6.131.222:4010/remoocX/GetAllPacking', body)
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          var name_packing = data[i].title
          console.log('gissss_string: ' + data[i].Gis_data);
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

          var url = "http://117.6.131.222:3000/point_in_polygon?point=" + local + "&polygon=" + abc
          this.service.getAPI(url).subscribe(data1 => {
            var styletext = document.getElementById('text_packing1')
            if (data1.result == true) {
              this.polygon_packing_start = data[i].Id
              this.text_packing1 = 'Thuộc ' + name_packing
              styletext.style.color = 'green';
              return;
            }
            else {
              this.text_packing1 = "Không thuộc bãi xe nào"
              styletext.style.color = "red";
            }
          })
        }
      })
  }


  giaiphong() {
    this.toast.showLoading('...')
    if (this.autocomplete.query == '' || this.autocomplete.query == null) {
      this.toast.dismissLoading();
      this.service.dialog('Vui lòng nhập địa chỉ đến')
    } else {
      this.service.getDataNativeStore('userLogin').then(dataa => {
        var id_user = dataa.id;
        console.log(this.myDate)
        console.log("trip code " + this.Trip_code + ' remoc code ' + this.Remooc_code
          + ' tractor ' + this.Tractor_code + 'end text ' + this.autocomplete.query + ' end gps ' + this.end_gps
          + 'id ' + id_user + ' note ' + this.Note + ' end time: ' + this.myDate
        )
        console.log('id_packing ' + this.polygon_packing_start)
        var body = (
          'Tractor_code=' + this.Tractor_code
          + '&End_position_time=' + this.myDate
          + '&End_position_gps=' + this.end_gps
          + '&End_position_parking=' + this.polygon_packing_start
          + '&Remooc_code=' + this.Remooc_code
          + '&Note=' + this.Note
          + '&Driver_id=' + id_user
          + '&Trip_code=' + this.Trip_code
          + '&End_position_text=' + this.autocomplete.query
        )
        this.service.postAPI('http://117.6.131.222:4010/remoocX/InsertEndTracking', body)
          .subscribe(data => {
            this.toast.dismissLoading();
            console.log(JSON.stringify(data))
            if (data.ID == 0) {
              this.service.dialog(data.Title)
            }
            else {
              this.service.dialog(data.Title)
              this.navCtrl.push(TripPage);
            }

          }, error => {
            this.service.dialog('Vui lòng kiểm tra kết nối internet')
            console.log('error Login: ' + error)
            this.toast.dismissLoading()
          }
          )
      })
    }
  }
  delete_tracking() {
    this.service.postAPI('http://117.6.131.222:4010/remoocX/delete_tracking', 'id=' + this.id_tracking)
      .subscribe(data => {
        this.service.dialog(data.Title);
      })
    this.navCtrl.push(TripPage);
  }
  update_tracking() {
    this.toast.showLoading('...')
    this.service.getDataNativeStore('userLogin').then(dataa => {
      var id_user = dataa.id;
      var body = (
        'Remooc_code=' + this.Remooc_code
        + '&Tractor_code=' + this.Tractor_code
        + '&Trip_code=' + this.Trip_code
        + '&Start_position_text=' + this.Start_position
        + '&Start_position_gps=' + this.start_gps
        + '&Start_position_time=' + this.Start_time
        + '&Start_position_parking=' + this.start_parking
        + '&Driver_Id=' + id_user
        + '&Note=' + this.Note
      )
      this.service.postAPI('http://117.6.131.222:4010/remoocX/UpdateTracking', body)
        .subscribe(data => {
          this.toast.dismissLoading();
          this.service.dialog(data.Title);
          this.ionViewDidLoad();
        }, error => {
          this.service.dialog('Vui lòng kiểm tra kết nối internet')
          console.log('error Login: ' + error)
          this.toast.dismissLoading()
        }
        )
    })
  }

  load2() {
    var vectorIcon = new ol.source.Vector({});
    var centervier = [];
    var vnfields = [];
    let that = this;
    var obj = [];
    var objid = [];
    this.service.postAPI('http://117.6.131.222:4010/remoocX/GetAllPacking_app', '')
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          // obj.push(JSON.parse(data[i].Gis_data))
          // console
          var parse = JSON.parse(data[i].Gis_data);

          var field_title = parse.properties.text;
          var fill_color = parse.properties.fill_color;
          var stroke_color = parse.properties.stroke_color;
          var stroke_width = parse.properties.stroke_width;
          var text_fill = parse.properties.text_fill;
          var text_stroke_color = parse.properties.text_stroke_color;
          var text_stroke_width = parse.properties.text_stroke_width;
          var font_size = parse.properties.font_size;
          var zindex = parse.properties.zindex;

          vnfields.push(parse.gis_data);

          var polygon1 = new ol.geom.Polygon(parse.gis_data);

          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(parse.gis_data[0][0]),
            name: parse.properties.text,
            image: data[i].Image,
            description: data[i].Description,
            owner: data[i].Owner,
            population: data[i].Id,
            rainfall: 500,

          });
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: 'https://i.imgur.com/5bCuPVF.png'
            }))
          });
          //iconFeature.setStyle(iconStyleGrey);


          iconFeature.setStyle(iconStyle);


          // polygon1.transform('EPSG:4326', 'EPSG:3857');
          var feature1 = new ol.Feature(polygon1);
          feature1.setId(data[i].Id);
          feature1.getGeometry();
          var xyx = feature1.getGeometry();
          var xzx = feature1.getId();
          feature1.set('point', parse.gis_data[0][0]);
          //console.log(xzx);

          feature1.set('description', field_title);
          feature1.set('description', field_title);
          feature1.set('fill_color', fill_color);
          feature1.set('stroke_color', stroke_color);
          feature1.set('stroke_width', stroke_width);
          feature1.set('text_fill', text_fill);
          feature1.set('text_stroke_color', text_stroke_color);
          feature1.set('text_stroke_width', text_stroke_width);
          feature1.set('font_size', font_size);
          feature1.set('zindex', zindex);



          feature1.setStyle(styleFunction);

          $('#go_to_field_id')
            .append($("<option>")
              .attr("class", 'list-group-item')
              .attr("data-customvalue", data[i].Id)
              .attr("value", field_title));

          //.text("Đi đến "+field_title));

          vectorIcon.addFeature(iconFeature);
          vectorSource1.addFeature(feature1);

          // field_polygon.setId(i);
        }
        var a = obj[3]
        console.log(a);
        console.log(typeof (a))
        console.log(obj.length)
        get_fields(obj);
      })
    // this.list_packing = [];
    var map;
    var fields_vector_source;
    var vectorSource1 = new ol.source.Vector({});
    setup_map(); // set up the map
    // Map the fields from WKT
    //locate_me(); // Add point

    function locate_me() {
      var locationPoint = new ol.Feature({
        // geometry: new ol.geom.Point([106.68479919433594, 10.897367896986843])
        geometry: new ol.geom.Point([106.68479919433594, 10.897367896986843])

      });
      locationPoint.getGeometry().transform('EPSG:4326', 'EPSG:3857');

      // A vector layer to hold the location point
      var locationLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [
            locationPoint
          ]
        })
      });
      map.addLayer(locationLayer);
    }
    function get_fields(obj: any) {

      var styles3 = [

        //set style các đường nối

        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#64c936',
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(100, 201, 54,1)' // background color
          })
        }),


      ];

      ///=================

      var source4 = new ol.source.Vector({ wrapX: false });
      var vector4 = new ol.layer.Vector({
        source: source4
      });
      var draw;
      var xxx = "Polygon";
      // function vẽ polygon
      function addInteraction() {
        draw = new ol.interaction.Draw({
          source: source4,
          type: /** @type {ol.geom.GeometryType} */ (xxx)
        });
        map.addInteraction(draw);
      }

      var vectorLayer1 = new ol.layer.Vector({
        source: vectorSource1,
        style: styles3
      });
      var vectorLayer2 = new ol.layer.Vector({
        source: vectorIcon,
        style: styles3
      });
      map.addLayer(vectorLayer1);
      map.addLayer(vectorLayer2);

    }

    function styleFunction() {
      var zoom = map.getView().getZoom();
      var font_size = zoom * 1;
      return [
        new ol.style.Style({
          fill: new ol.style.Fill({
            color: this.get('fill_color')
          }),
          stroke: new ol.style.Stroke({
            color: this.get('stroke_color'),
            width: this.get('stroke_width')
          }),
          text: new ol.style.Text({
            font: font_size + 'px Calibri,sans-serif',
            fill: new ol.style.Fill({ color: this.get('text_fill') }),
            textBaseline: 'top',
            stroke: new ol.style.Stroke({
              color: this.get('text_stroke_color'), width: this.get('text_stroke_width')
            }),
            // get the text from the feature - `this` is ol.Feature
            text: this.get('description')
          }),
          zIndex: this.get('zindex')
        })
      ];
    }

    var vectorIcon2 = new ol.source.Vector({});


    // get part google
    var getPathGoogle = function (orgin, destination): void {
      that.service.postAPI('http://117.6.131.222:4010/JnanaToken/GetKey', 'Service_type=direction_api')
        .subscribe(getkey => {
          that.service.getAPI('https://maps.googleapis.com/maps/api/directions/json?origin=' + orgin + '&destination=' + destination + '&mode=driving&key=' + getkey.Object.Key)
            //AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU
            .subscribe(data => {
              var path = polyline.decode(data.routes[0].overview_polyline.points);

              var pathLayerMarker = renderLinePathLayer(path);

              map.addLayer(pathLayerMarker);
            }
            )
        })

    }
    // getPathGoogle(poitnpk4, poitnpk5);
    console.log(that.gps1111 + 'gps111111111111111');
    console.log(that.gps2222 + 'gps222222222222222222');
    if (that.gps2222 != null) {
      getPathGoogle(that.gps1111, that.gps2222)
    }

    function setup_map() {
      // A vector layer to hold the fields
      fields_vector_source = new ol.source.Vector({});
      vectorSource1 = new ol.source.Vector({});

      map = new ol.Map({
        target: $('#map')[0],
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM(
              {
                url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                attributions: [
                  new ol.Attribution({ html: '© Google' }),
                  new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
                ]
              })
          }),
          new ol.layer.Vector({
            source: fields_vector_source
          }),
          new ol.layer.Vector({
            source: vectorSource1
          })
        ],
        view: new ol.View({
          center: ol.proj.transform([106.6607666015625, 10.850840083690738], 'EPSG:4326', 'EPSG:3857'),
          // center : ol.proj.fromLonLat([105.8102273,20.99113243]),
          zoom: 9
        }),
        controls: ol.control.defaults({
          attribution: false,
          zoom: false,
        })
      });

    }

    function go_to_field() {
      var field_id = $('#go_to_field_id').val();
      console.log(field_id);
      var field_location = vectorSource1.getFeatureById(field_id).getGeometry();
      console.log(field_location);
      var field_extent = field_location.getExtent();
      map.getView().fit(field_extent, map.getSize());
    }


    var obj_remooc = [
      {
        "Id": 5,
        "Type": 1,
        "Name": "AYZ",
        "Status": "1",
        "Parking": 6,
        "TrackingTime": "2017-09-13 05:43:12.0000000"


      },
      {
        "Id": 4,
        "Type": 2,
        "Name": "AYZ",
        "Status": "0",
        "Parking": 6,
        "TrackingTime": "2017-09-04 17:29:12.0000000"
      }
    ]

    var element = document.getElementById('popup');

    var popup = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -50]
    });
    map.addOverlay(popup);
    var objnew = {}
  }
}
