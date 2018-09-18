import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the DetailOrder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-order',
  templateUrl: 'detail-order.html'
})
export class DetailOrderPage {
  public dataorder;
  public malenh;
  public ngaydieuxe;
  public tentaixe;
  public sodaukeo;
  public somooc;
  public tenkh;
  public diachikh;
  public noixuatphat;
  public noilay;
  public noiha;
  public macont;
  public solenh;
  public ngaygiodi;
  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailOrderPage');
    this.dataorder = this.navParams.data;
    console.log(JSON.stringify(this.dataorder));
    this.malenh = this.dataorder.matheodoi;
    this.ngaydieuxe = this.dataorder.ngaydieuxe;
    this.tentaixe = this.dataorder.tentaixe;
    this.somooc = this.dataorder.somooc;
    this.tenkh = this.dataorder.tenkh;
    this.diachikh = this.dataorder.diachikh;
    this.noixuatphat = this.dataorder.noixuatphat;
    this.noilay = this.dataorder.noilay;
    this.noiha = this.dataorder.noiha;
    this.macont = this.dataorder.macont;
    this.solenh = this.dataorder.solenh;
    this.ngaygiodi = this.dataorder.ngaygiodi;
    this.sodaukeo = this.dataorder.sodaukeo;
  }

}
