import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading, Events } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';
import { TaikhoanPage } from '../taikhoan/taikhoan';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Service } from "../../providers/service";


declare var cordova: any;
/*
  Generated class for the Uploadavatar page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-uploadavatar',
  templateUrl: 'uploadavatar.html'
})
export class UploadavatarPage {
  message: string;
  lastImage: string = null;
  loading: Loading;
  user_id: any
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public http: Http,
    public nativeStorage: NativeStorage,
    public events: Events,
    public service: Service, ) {
    this.setDataUser()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadavatarPage');
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 5,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }


  public uploadImage() {
    // Destination URL
    var url = "http://117.6.131.222:4010/Remooc/Upload";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
      console.log("Data IMG: " + data.response)

      if (data.response == "" || data.response == null) {
        this.service.dialog('Lỗi, vui lòng thử lại.')
      } else {
        console.log("ID Update: " + this.user_id);
        var body = ('Id=' + this.user_id + '&Profile_Picture=http://117.6.131.222:4010' + data.response);
        this.service.postAPI("http://117.6.131.222:4010/Remooc/updateAvatar", body)
          .subscribe(data1 => {
            console.log(data1.message)
            this.service.dialog('Cập nhật avatar thành công')
            console.log("Data url update: " + data.response)
            //cap nhat thong tin moi
            console.log('Save cache  avatar success')
            //  Events.prototype.publish('user:avatar')
            // this.setDataUser()
            NativeStorage.prototype.setItem('userLogin', {
              id: data1.Object.Id,
              userName: data1.Object.Username,
              displayName: data1.Object.Name,
              phone: data1.Object.Phone,
              email: data1.Object.Email,
              password: data1.Object.Password,
              img: data1.Object.Profile_Picture,
              company: data1.Object.Company_Code,
              TypeUser: data1.Object.Type_Driver
            }).then(() => {
              this.events.publish('user:login');
              this.navCtrl.pop();
            })

            //  NavController.prototype.push(TaikhoanPage)
          })
      }


    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

  setDataUser() {
    //set data user

    this.nativeStorage.getItem('userLogin')
      .then(
        data => {
          console.log('data: ' + data)
          this.user_id = data.id
        },
        error => console.error(error)
      );

  }



}
