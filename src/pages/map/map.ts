import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Http, } from '@angular/http';
import { Service } from '../../providers/service';
export interface PageInterface {
  name: string;
  position_parking: any;
}
// import * as $ from 'jquery'
declare var ol: any;
declare var jQuery, $: any

declare var renderLinePathLayer: any
declare var polyline: any;

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  public idParking: any;
  showList: boolean = false;
  searchQuery: string = '';
  items = []
  items2: PageInterface[] = [];
  public filteredList = [];
  footer: any;
  clickPaking: any;
  nameParking: any;
  imgParking: any;
  infor: any;
  owner: any;
  public input_rm = '';
  public elementRef;
  public company_code: any;
  constructor(public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public googleMaps: GoogleMaps,
    public service: Service,
    myElement: ElementRef) {
    this.elementRef = myElement
    this.service.getDataNativeStore('userLogin').then(
      data1 => {
        this.company_code = data1.company
        console.log('native= ' + this.company_code)
        this.initializeItems();
      })
  }
  ionViewWillEnter() {
    // document.getElementById('footer_map').style.display = 'none';
    // document.getElementById('footer_search').style.display = 'none';
    this.load2();
  }
  load2() {
    var footer_map = document.getElementById('footer_map');
    footer_map.style.display = 'none';
    var vectorIcon = new ol.source.Vector({});
    var centervier = [];
    var vnfields = [];
    let that = this;
    var obj = []
    var objid = []
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
    $(document).on("click", "button#go_to_field", function () {
      go_to_field();
    });

    function locate_me() {
      var locationPoint = new ol.Feature({
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
      console.log('lenggggggggggggggggggggg ' + obj.length)
      console.log('thu 2222222222222222222222' + obj[2])

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

      ///=================

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


    var getCurrentEm = function (data1, data2) {
      getAllCurentRomooc();
      var sttrmz2 = true;
      for (var i in objnew) {
        if (data1 == objnew[i].Remooc_code) {
          sttrmz2 = objnew[i].Status;
        }
      }

      var aaa = parseInt(data2)
      console.log('aaaaaaaaaaaaaaaa' + aaa)
      console.log(data2);

      var field_location = vectorSource1.getFeatureById(aaa).getProperties();
      var pointpk = vectorSource1.getFeatureById(aaa).get('point');
      var poitnpk2 = new ol.geom.Point(ol.proj.transform(pointpk, 'EPSG:3857',
        'EPSG:4326'));

      var poitnpk3 = new ol.geom.Point(ol.proj.transform([11875413.538184507, 1283981.392167715], 'EPSG:3857',
        'EPSG:4326'));

      var poitnpk4 = [poitnpk2.A[1], poitnpk2.A[0]];
      var poitnpk5 = [poitnpk3.A[1], poitnpk3.A[0]];

      if (sttrmz2 == false) {

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
        var vectorLayer2 = new ol.layer.Vector({
          source: vectorIcon,
          style: styles3
        });

        var path = [];
        var ibs = 10;
        var getPathGoogle = function (orgin, destination): void {
          that.service.postAPI('http://117.6.131.222:4010/JnanaToken/GetKey', 'Service_type=direction_api')
            .subscribe(getkey => {
              that.service.getAPI('https://maps.googleapis.com/maps/api/directions/json?origin=' + orgin + '&destination=' + destination + '&mode=driving&key=' + getkey.Object.getkey)
                //AIzaSyC3Q9fFHlNhqFa0haTqVuIn5OQqNOyddSU
                .subscribe(data => {
                  console.log('polyline  ' + data.routes[0].overview_polyline.points)
                  path = polyline.decode(data.routes[0].overview_polyline.points);

                  var pathLayerMarker = renderLinePathLayer(path);

                  map.addLayer(pathLayerMarker);


                  map.removeLayer(vectorLayer2);
                  //console.log("ttttt" + pointpk);
                  var field_extent = field_location.geometry.getExtent();

                  map.getView().fit(field_extent, map.getSize());
                  var centerz = map.getView().getCenter();


                  map.getView().setZoom(14);
                  var i = 10;

                  setInterval(function () {

                    var poitnpk6 = new ol.geom.Point(ol.proj.transform([path[ibs][1], path[ibs][0]], 'EPSG:4326',
                      'EPSG:3857'));
                    ibs++;
                    console.log(ibs);

                    var iconStyle = new ol.style.Style({
                      image: new ol.style.Icon(({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: 'https://openlayers.org/en/v4.3.3/examples/data/icon.png'
                      }))
                    });
                    var iconStyleGrey2 = new ol.style.Style({
                      image: new ol.style.Icon(({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: 'https://i.imgur.com/9GoWcAL.png'
                      }))
                    });
                    var iconFeature = new ol.Feature({
                      geometry: poitnpk6,
                      name: data1,
                      population: "y",
                      rainfall: 501,
                      style: iconStyleGrey2
                    });
                    iconFeature.setId(1);


                    vectorIcon2.addFeature(iconFeature);

                    vectorIcon2.getFeatureById(1).setGeometry(poitnpk6);
                    vectorIcon2.getFeatureById(1).setStyle(iconStyleGrey2);

                  }, 2000);
                  var romoocLayer = new ol.layer.Vector({
                    source: vectorIcon2,
                    style: iconStyleGrey2
                  });
                  map.addLayer(romoocLayer);
                }, error => {
                  var jsonValue = jQuery.parseJSON(error.responseText);
                })

            })


        }
        getPathGoogle(poitnpk4, poitnpk5);
      }
      else {
        map.removeLayer(vectorLayer2);
        //console.log("ttttt" + pointpk);
        var field_extent = field_location.geometry.getExtent();

        map.getView().fit(field_extent, map.getSize());
        var centerz = map.getView().getCenter();


        map.getView().setZoom(14);
        var iconStyle = new ol.style.Style({
          image: new ol.style.Icon(({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://openlayers.org/en/v4.3.3/examples/data/icon.png'
          }))
        });
        var iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(centerz),
          name: data1,
          population: "y",
          rainfall: 501,

        });
        var iconStyleGrey2 = new ol.style.Style({
          image: new ol.style.Icon(({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://i.imgur.com/9GoWcAL.png'
          }))
        });

        vectorIcon2.addFeature(iconFeature);
        var romoocLayer = new ol.layer.Vector({
          source: vectorIcon2,
          style: iconStyleGrey2
        });
        map.addLayer(romoocLayer);
      }



    };
    $('#searchrm').click({ btn: that.input_rm }, searchrm);
    function searchrm(btn) {
      if (that.input_rm == null || that.input_rm == '') {
        that.service.dialog('Vui lòng nhập mã Remooc')
      }
      else {
        console.log('click tim kiem')
        vectorIcon2.clear();
        var rmCode = that.input_rm;
        that.service.postAPI('http://117.6.131.222:4010/remoocX/GetParkingByRomoocCode', 'romooc_code=' + rmCode)
          .subscribe(dataa => {
            that.idParking = dataa.Result.Position_parking;
            console.log('position parking: ' + that.idParking)
            console.log('remooc code:' + rmCode)
            getCurrentEm(rmCode, that.idParking);
          })
        console.log(that.idParking);
        var time1 = $('#date1').val();
        var time2 = $('#date2').val();
        var objSearch = {
          Remooc_code: rmCode,
          Start_position_time: time1,
          End_position_time: time2

        };

        var getRemoocSearch = function (data) {
          that.service.postAPI('http://117.6.131.222:4010/remoocX/GetTrackingById', '')
            .subscribe(data => {
              var content_ar = [];
              for (var i in data) {
                content_ar.push('<tr class = "success"><td style="font-weight:bold;color:black">' + data[i].Trip_code + '</td><td style="font-weight:bold;color:black">' + data[i].Tractor_code + '</td> <td style="color:black">Xuất phát lúc <strong style="color:green">' + data[i].Start_position_time + '</strong> tại <strong style="color:green">' + data[i].Start_position_text + '<strong></td><td style="font-weight:bold;color:black">Đến bến lúc <strong style="color:red">' + data[i].End_position_time + '</strong> tại <strong style="color:red">' + data[i].End_position_text + '<strong></td></tr>');
              }
              $("#rmchst").removeAttr("hidden");
              $('#rmchtrTable').append(content_ar);
            })
        };
        getRemoocSearch(objSearch);
        // that.input_rm = ''
      }
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
          center: ol.proj.transform([106.68479919433594, 10.897367896986843], 'EPSG:4326', 'EPSG:3857'),
          // center : ol.proj.fromLonLat([105.8102273,20.99113243]),
          zoom: 11
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
    function getAllCurentRomooc() {
      var dataremooc
      that.service.postAPI('http://117.6.131.222:4010/remoocX/GetAllRemoocCurrent', 'company_code=' + that.company_code)
        .subscribe(data => {
          dataremooc = data;
          objnew = data;
        })
      return dataremooc;
    }
    // display popup on click
    // display popup on click
    map.on('click', function (evt) {
      // document.getElementById('footer_search').style.display = 'none';
      that.footer = 'remooc'
      var footer_map = document.getElementById('footer_map');
      console.log('click click')
      that.clickPaking = 'showAllRemooc';
      // $('#rm1Table').empty();
      $('#parkingTable').empty();
      // $('#inforParking').empty();
      var content_ar = [];
      var parking_info = [];
      that.nameParking = '';
      that.imgParking = '';
      that.infor = '';
      that.owner = '';
      var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
          return feature;
        });

      if (feature && feature.get('rainfall') == 500) {
        footer_map.style.display = 'block';
        parking_info.push('<h1>' + feature.get('name') + '</h1><img src="' + feature.get('image') + '"  class="img-thumbnail" alt="Cinque Terre"><p>Thông tin bãi xe:' + feature.get('description') + '</p><p>Chủ sở hữu: ' + feature.get('owner') + '</p>');
        that.nameParking = feature.get('name');
        that.imgParking = feature.get('image');
        that.infor = feature.get('description');
        that.owner = feature.get('owner');
        // $('#inforParking').append(parking_info);
        // that.inforParking = parking_info;
        console.log('parking infor' + parking_info);
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        // $('#go_to_field_id4').empty();
        // $('#go_to_field_id2').empty();
        getAllCurentRomooc();

        for (var i in objnew) {

          if (objnew[i].Position_parking == feature.get('population')) {
            console.log('vào 1')
            if (objnew[i].Status == 0) {
              var re_status = 'Dừng bến';
              var re_type = ' <a href="google.com"> <img src="https://i.imgur.com/Ha3KNfJ.png"  class="img-thumbnail" alt="Cinque Terre" width="25" > </a>';
            }
            else {
              re_status = 'Xuất bến';
              re_type = '<a href="google.com"> <img src="https://i.imgur.com/4pcSPn9.png" href="google.com" class="img-thumbnail" alt="Cinque Terre" width="25" > </a>';
            };
            let time: string = objnew[i].Position_time.substr(0, 19);
            let tempTime = time.split('T');
            let tempTime2 = tempTime[0] + ' ' + tempTime[1].substring(0, 5);
            content_ar.push('<tr class = "success"><td >' + re_type + '</td><td style="font-weight:bold;color:black">' + objnew[i].Remooc_code + '</td> <td style="font-weight:bold;color:black">' + re_status + ' : ' + tempTime2 + '</td></tr>');
          }
        }
        //console.log("500" + objnew[i].Position_parking);
        $("#parkinghst").removeAttr("hidden");
        $('#parkingTable').append(content_ar);
        $(element).popover({
          'placement': 'top',
          'html': true,

          'content': parking_info
        });
        $(element).popover('show');
      }


      else if (feature && feature.get('rainfall') == 501) {
        footer_map.style.display = 'block';
        getAllCurentRomooc();
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        var yarray = [];
        var xarray = [];
        var valuezz = feature.get('name');
        for (var i in objnew) {
          if (valuezz == objnew[i].Remooc_code) {
            var ppobj = JSON.parse(objnew[i].FieldValue);
            var sttrmz = "Available"
            if (objnew[i].Status == false) {
              sttrmz = "On Way"

            }
            //console.log("501" + JSON.stringify(ppobj));
            xarray.push('<table class="table "> <tbody> <tr class="success"> <td style="font-weight:bold;color:black">Hãng</td> <td style="color:green">' + ppobj.producer + '</td> </tr> <tr class="success"> <td style="font-weight:bold;color:black">Hình ảnh</td> <td style="color:green"><img src="' + objnew[i].Image + '" alt="" height="100" ></td> </tr> <tr class="success"> <td style="font-weight:bold;color:black"> Loại mooc</td> <td style="color:black"> ' + ppobj.type + ' </td> </tr> <tr class="success"> <td style="font-weight:bold;color:black">Kích thước tổng thể (mm)</td> <td style="color:black">' + ppobj.sizeTotal + '</td> </tr> <tr class="success"> <td style="font-weight:bold;color:black">Kích thước thùng (mm)</td> <td style="color:black">' + ppobj.sizeBins + '</td> </tr> <tr class="success"> <td style="font-weight:bold;color:black">Trọng lượng bản thân</td> <td style="color:black">' + ppobj.seflWeight + 'kg</td></tr> <tr class="success"> <td style="font-weight:bold;color:black">Trọng tải lưu hành </td> <td style="color:black"> ' + ppobj.shippingWeight + 'kg</td></tr> <tr class="success"> <td style="font-weight:bold;color:black">Cầu</td> <td style="color:black"> ' + ppobj.carrier + '</td></tr> <tr class="success"> <td style="font-weight:bold;color:black">Lốp Trước/ Sau</td><td style="color:black"> ' + ppobj.tire + '</td></tr><tr class="success"><td style="font-weight:bold;color:black">Sản xuất</td><td style="color:black"> ' + ppobj.origin + '</td></tbody></table>');
            yarray.push(' <tr class="danger"> <td style="font-weight:bold;color:black">Trạng thái</td> <td style="color:green">' + sttrmz + '</td> </tr> <tr class="danger"> <td style="font-weight:bold;color:black">Bãi đỗ</td> <td style="color:black">' + objnew[i].Position_text + '</td> </tr> <tr class="danger"> <td style="font-weight:bold;color:black">Vị trí</td> <td style="color:black">' + objnew[i].Position_gps + '</td> </tr> <tr class="danger"> <td style="font-weight:bold;color:black">Thời điểm đỗ</td> <td style="color:black">' + objnew[i].Position_time + '</td> </tr> <tr class="danger"> <td style="font-weight:bold;color:black">Mã đầu kéo</td> <td style="color:black">' + objnew[i].Remooc_code + '</td> </tr>');
          }
        }
        $('#rm1Table').append(yarray);

        $(element).popover({
          'placement': 'top',
          'html': true,

          'content': xarray
        });
        $(element).popover('show');
      } else {
        footer_map.style.display = 'none';
        $(element).popover('destroy');
        //$("#listrm").addAttr("hidden");  
        $("#listrm").attr("hidden", "true");
        $("#romoocstatus").attr("hidden", "true");
        $("#mag").hide();
        $("#parkinghst").attr("hidden", "true");
        $('#parking24').empty();
        $('#rm1Table').empty();
        $('#parkingTable').empty();
      }
    });

  }
  search() {
    document.getElementById('footer_map').style.display = 'none'
    // var bottom_search = document.getElementById('footer_search');
    // bottom_search.style.display = 'block'
  }
  initializeItems() {
    console.log('company initia' + this.company_code)
    this.service.postAPI('http://117.6.131.222:4010/remoocX/GetAllRemoocCurrent', 'company_code=' + this.company_code)
      .subscribe(data => {
        for (var i in data) {
          console.log(typeof (data[i].Remooc_code))
          this.items.push(data[i].Remooc_code);
          this.items2.push({
            name: data[i].Remooc_code,
            position_parking: data[i].Position_parking
          })
        }
      })

  }
  filter() {
    console.log('company filter ' + this.company_code)
    if (this.input_rm !== "") {
      this.filteredList = this.items.filter(function (el) {
        return el.toLowerCase().indexOf(this.input_rm.toLowerCase()) > -1;
      }.bind(this));
      this.showList = true;
    } else {
      this.filteredList = [];
    }
  }

  select(it) {
    this.input_rm = it;
    this.showList = false;
    this.filteredList = [];
  }
}