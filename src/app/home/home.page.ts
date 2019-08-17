import { Component } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { HttpClient } from "@angular/common/http";
import { Platform, AlertController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  constructor(
    private platform: Platform,
    private barcodeScanner: BarcodeScanner,
    private http: HttpClient,
    public alert: AlertController
  ) {
    // this.getData();
    this.data = this.dataDefault;
    this.startScan();
    // this.platform = platform;
  }

  data: any;
  dataDefault: any = {
    aliCancel: "",
    ename: "",
    fname: "",
    lname: "",
    masterCode: "",
    masterName: "",
    pid: "",
    provinceNameReport: "",
    return: "",
    tlAuto: "",
    tlDateInform: "", // 2019-04-30T00:00:00.000+07:00
    tlDateWork: "",
    tlTid: "",
    tltype: ""
  };

  status = {
    EN: "นายจ้างแจ้งเข้าสำเร็จ",
    AN: "คนต่างด้าวแจ้งเข้าสำเร็จ",
    EO: "นายจ้างแจ้งออกสำเร็จ"
  };

  laborStatus = {
    "": "ปกติ",
    C: "ถูกเพิกถอนใบอนุญาต"
  };

  onLoading = false;
  isScanned = false;

  startScan() {
    this.isScanned = false;
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        // console.log(barcodeData);
        this.getData(barcodeData.text);
        // console.log(this.data);
        this.isScanned = true;
        // this.startScan();
      })
      .catch(err => {
        this.isScanned = true;
        // console.log("Error", err);
      });
  }

  getData(id) {
    this.onLoading = true;
    this.data = this.dataDefault;
    this.http
      .post("http://122.155.84.131/doe/doefilealien/selectcheckinformmobile", {
        apikey: "ebefb44c35628c26848b6d71993994470fa24cff",
        informid: id
      })
      .subscribe(
        res => {
          const data = JSON.parse(JSON.stringify(res));
          if (data.return === "00") {
            this.data = data;
          } else {
            this.isScanned = false;
            this.presentAlert("ไม่มีข้อมูลการแจ้งทำงาน");
          }

          this.onLoading = false;
        },
        error => {
          this.onLoading = false;
          // console.log(error);
        }
      );
  }

  async presentAlert(message = "") {
    const alert = await this.alert.create({
      header: "แจ้งเตือน",
      // subHeader: 'Subtitle',
      message,
      buttons: ["ตกลง"]
    });

    await alert.present();
  }

  async exitConfirm() {
    const alert = await this.alert.create({
      header: 'ยืนยันการออก',
      message: 'คุณต้องการออกจากแอปพลิเคชัน ใช่หรือไม่',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ยืนยัน',
          handler: () => {
            this.exitApp();
            // console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  exitApp(){
    navigator['app'].exitApp()
  }
}
