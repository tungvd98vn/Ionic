import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, TextInput, Platform, ToastController, Keyboard, Navbar } from 'ionic-angular';
import { Service } from '../../providers/service';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { ToastService } from '../../providers/toast-service';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
// import { Keyboard } from '@ionic-native/keyboard';
declare var fm: any;
// declare var jQuery, $: any
declare var cordova: any;
/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  @ViewChild(Navbar) navBar: Navbar;
  channel = "/warehouse";
  public clients = new fm.websync.client('http://117.6.131.222:8089/websync.ashx');
  url_avatar = "assets/img/ava.jpg";
  public url_img: any;
  filename: any;
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  urlImageView: any;
  public img: any
  public input_message: any
  select_type: any;
  public name: any;
  lastImage: string = null;
  public id_login: any
  showEmojiPicker = false;
  showkeyboard = false;
  public temppp = true
  messageChat: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public service: Service,
    private camera: Camera,
    public platform: Platform,
    private filePath: FilePath,
    public toastCtrl: ToastController,
    private file: File,
    public toast: ToastService,
    private transfer: Transfer,
    public keyboard: Keyboard,
  ) {
    this.service.getDataNativeStore('userLogin')
      .then(
        data => {
          console.log(JSON.stringify(data));
          this.name = data.displayName;
          this.url_avatar = data.img;
        })


    fm.websync.client.enableMultiple = true;
    this.clients.connect({
      onSuccess: function (args) {
        console.log('Connect success ')
      },
      onFailure: function (args) {
        console.log('Connect error ')
      }
    });
    this.subscribe();

  }

  subscribe() {
    let that = this;
    this.clients.subscribe({
      channel: that.channel,
      onSuccess: function (args) {
      },
      onFailure: function (args) {
        that.toast.showLoading("Mất kết nối")
      },
      onReceive: function (args) {
        var message = args.getData();
        console.log("sds " + JSON.stringify(message))
        that.sendMess(message.name, message.text, message.avatar, args.getWasSentByMe())
      }
    })
  }
  send() {
    if (this.messageChat == null || this.messageChat == "") return;
    this.clients.publish({
      channel: this.channel,
      data: {
        name: this.name,
        text: this.messageChat,
        avatar: this.url_avatar,
      },
      onSuccess: function (args) {
        console.log("send success")
      }
    });
    this.messageChat = "";
    this.showEmojiPicker = false;
    this.showkeyboard = false;

    // setInterval(() => {
    //   if (this.messageChat == null || this.messageChat == "") return;
    //   var s = new driver();
    //   this.clients.publish({

    //     channel: this.channel,
    //     data: {
    //       name: this.name,
    //       text: JSON.stringify(s),
    //       avatar: this.url_avatar,
    //     },
    //     onSuccess: function (args) {
    //       console.log("send success")
    //     }
    //   });
    //   //this.messageChat = "";
    //   this.showEmojiPicker = false;
    //   this.showkeyboard = false;

    // }, 30000);

  }
  receiveMess(name, text, avatar, me) {
    var chat = document.getElementById('chat');
    var html = '<div ';
    if (me) {
      html += ' class="yourMessage"';
    }
    html += '>' + '<img class="yourAvatar" src="' + avatar + '"/><b class="yourName">' + name + '</b>' + '<div class="conten-yourMess"><span class="arrow-right"></span>' + text + '</div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    chat.appendChild(div);
  }
  sendMess(name, text, avatar, me) {
    var chat = document.getElementById('chat');
    var html = '<div ';
    if (me) {
      html += ' class="myMessage"';
    }
    html += '>' + '<img class="myAvatar" src="' + avatar + '"/><b class="myName">' + name + '</b>' + '<div class="content-myMess"><span class="arrow-left"></span>' + text + '</div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    chat.appendChild(div);
  }

  ionViewWillEnter() {
    //this.chat('chat', this.temppp);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.platform.registerBackButtonAction(() => {
      console.log('click back');
      this.scrollToBottom();
    })
  }


  textarea() {
    // this.showEmojiPicker = false;
    this.scrollToBottom();
    // this.content.resize();
    this.showkeyboard = true;
  }
  clickSend() {
    this.showkeyboard = false;
  }
  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    // if (!this.showEmojiPicker) {
    //   this.messageInput.setFocus();
    // }
    this.content.resize();
    this.scrollToBottom();
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }
  getLibary() {
    // this.navCtrl.push(TempChatPage, 'libary');
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
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
        this.urlImageView = imagePath;
      }
      else {
        console.log("Camera using 2")
        this.urlImageView = imagePath;
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
      console.log('222222')
      // setTimeout(() => {
      //   this.uploadimage();
      // }, 1000)
    }, (err) => {
      // this.service.dialog('Error while selecting image.');
    });
    console.log('111111')
  }
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    console.log('newfile: ' + newFileName)
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      console.log('last image: ' + this.lastImage)
      this.uploadimage();
    }, error => {
      this.service.dialog('Error while storing file.');
      console.log(error);
    });
  }


  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      console.log('img nulll')
      return '';
    } else {
      console.log('img #')
      return cordova.file.dataDirectory + img;
    }
  }
  public uploadimage() {

    // Destination URL
    var url = "http://117.6.131.222:4002/dididriver/insertimage";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    console.log(targetPath + '  a')
    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: this.filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {
        'id': 20,
        'file': this.filename
      }
    };
    console.log("targetPath:::::::::::::::::::::::::: " + targetPath + "/ filename: " + this.filename)


    const fileTransfer: TransferObject = this.transfer.create();
    this.toast.showLoading('Loading...')
    this.toast.dismissLoading();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      // console.log(data);
      // console.log(JSON.stringify(data));
      this.toast.dismissLoading();
      var Obj = data.response
      //console.log('objjjjjjjjjjjjj= ' + Obj)
      var url1 = Obj.split('"Profile_Picture":"');
      //console.log('split1= ' + url1[1])
      var url2 = url1[1].split('","Balance_Credit"');
      //console.log('split2= ' + url2);

      this.url_img = 'http://117.6.131.222:4002' + url2[0];
      console.log(this.url_img);
      this.temppp = false
    }, err => {
      this.toast.showLoading('Error while uploading file.');
      this.toast.dismissLoading()
      console.log(err);
    });
  }

}
export class driver {
  public id: any;
  public cdata: any;
  public start: any;
  public end: any;
  public tripcode: any;
  public status: any;
  public mode_test: boolean;
  public data_cur: any;
  public command: String;
  public service: Service;
  public location_message: any;
  public lonlat: any;
  public type: any;
  constructor() {
    //LẦN 2
    this.location_message = [
      {
        driverId: 4045,
        cdata: [
          "[21.07571,105.77387]",
          "[21.0755,105.77385]",
          "[21.07548,105.77384]",
          "[21.07546,105.77363]",
          "[21.07547,105.77353]",
          "[21.07481,105.77356]"
        ]
      },
      {
        driverId: 4046,
        cdata: [
          "[21.07571,105.77387]",
          "[21.0755,105.77385]",
          "[21.07548,105.77384]",
          "[21.07546,105.77363]",
          "[21.07547,105.77353]",
          "[21.07481,105.77356]"
        ]
      },
      {
        driverId: 4047,
        cdata: [
          "[21.07571,105.77387]",
          "[21.0755,105.77385]",
          "[21.07548,105.77384]",
          "[21.07546,105.77363]",
          "[21.07547,105.77353]",
          "[21.07481,105.77356]"
        ]
      }
      //LẦN 1
      //  this.id=4045;
      //  this.cdata = [
      //    {toado:"[21.07571,105.77387]"},
      //    {toado:"[21.0755,105.77385]"},
      //    {toado:"[21.07548,105.77384]"},
      //    {toado:"[21.07546,105.77363]"},
      //    {toado:"[21.07547,105.77353]"},
      //    {toado:"[21.07481,105.77356]"}
      // ];
      // let that = this;
      // this.service.getAPI('http://117.6.131.222:4010/Driver/Get_Vitual_Itinerary?idUser=4045')
      // .subscribe(data => {
      //   that.id = data.Id
      //   that.cdata = data.virual_intiary;
      // })
      //  this.start="[21.07571,105.77387]";
      //  this.end="[21.0755,105.77385]";
      //  this.data_cur="[21.07548,105.77384]";
      //  //this.tripcode="ssssss";
      //  this.status=0;
      //  //this.mode_test=true;
      //  //this.command="ACT";
    ]
  }

}
// class để hứng ds driver từ API
export class Driver {
  public driverID: any;
  public cdata: any;
  constructor() {

  }
}

//Class để tạo đối tượng parse sang Json
export class msg {
  private location_message: any;

  constructor(lst: any) {
    for (let i of lst) {
      this.location_message.push(lst[i]);
    }
    //  this.location_message = [
    //    {

    //    }
    //  ]
  }
}