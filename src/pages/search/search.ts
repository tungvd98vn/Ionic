import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Service } from '../../providers/service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  public filteredList = [];
  public typeSearch = 1;
  public TypeS: boolean = true;
  public SRemooc;
  public STractor;
  public RMCode;
  public RMplace;
  public RMTripCode;
  public RMTractorCode;
  public TrCode;
  public TrPlace;
  public TrTripcode;
  public TrRm;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: Service,
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  ChoseTyeSearch(type) {
    console.log(type);
    if (type == 1) {
      this.TypeS = true;
    } else {
      this.TypeS = false;
    }
  }
  SearchRemooc() {
    this.service.postAPI('http://117.6.131.222:4010/remoocX/GetParkingByRomoocCode', 'romooc_code=' + this.SRemooc)
      .subscribe(data => {
        console.log('data=' + JSON.stringify(data));
        this.SRemooc = null;
        this.RMCode = data.Result.Remooc_code;
        this.RMplace = data.Result.Position_text;
        this.RMTripCode = data.Result.Trip_code;
        this.RMTractorCode = data.Result.Tractor_code;
      })
  }
  searchTractor() {
    // this.service.postAPI('http://117.6.131.222:4010/remoocX/GetParkingByRomoocCode', 'romooc_code=' + this.SRemooc)
    //   .subscribe(data => {
    //     console.log('data=' + JSON.stringify(data));
    //     this.SRemooc = null;
    //     this.TrCode = data.Result.Remooc_code;
    //     this.RMplace = data.Result.Position_text;
    //     this.RMTripCode = data.Result.Trip_code;
    //     this.RMTractorCode = data.Result.Tractor_code;
    //   })
  }
}
