import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalState } from '../../global.state';
import { ActivatedRoute, Router } from '@angular/router';
//import { Router, ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { MasterRepo } from "../../common/repositories/index";
import { Subscription } from "rxjs/Subscription";
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthService } from '../../common/services/permission';
import * as moment from 'moment'
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { SettingService } from '../../common/services';
import { SpinnerService } from '../../common/services/spinner/spinner.service';
import { AlertService } from '../../common/services/alert/alert.service';
import { stubFalse } from 'lodash';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { PrintInvoiceComponent } from "../../common/Invoice/print-invoice/print-invoice.component";




@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html',
  providers: [PrintInvoiceComponent]

})
export class Dashboard implements OnDestroy, OnInit {
  AppSettings: any = <any>{};
  userProfile: any = <any>{};
  subsriptionArray: Subscription[] = [];
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
  alwaysShowCalendars: boolean = true;
  ranges: any;
  enableFiscalYearEnd: boolean = false;
  ordermeReport: any[] = [];
  showMessage: boolean;
  public chartData: any;
  locale = {
    format: 'DD/MM/YYYY',
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' - ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom Range',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: 0 // first day is monday
  }
  refresh: boolean = false;
  public promptPrintDevice: boolean = false;
  public printControl = new FormControl(0);
  activeurlpath: any;
  userWiseDivisions: any[] = [];

  public userSelectedDivision: string;
  constructor(public _transactionService: TransactionService,
    public state: GlobalState,
    public router: Router,
    public masterService: MasterRepo,
    public http: Http,
    public authService: AuthService,
    public setting: SettingService,
    public spinnerService: SpinnerService,
    private alertService: AlertService,
    authservice: AuthService,
    public _trnMainService: TransactionService,
    private loadingService: SpinnerService,
    public invoicePrint: PrintInvoiceComponent,
    private arouter: ActivatedRoute,
  ) {
    this.AppSettings = setting.appSetting;
    this.result.dashboardpurchase = <any>{};
    this.result.dashboardsales = <any>{};
    this.result.dashboardtender = <any>{};
    this.result.dashboardhivalue = <any>{};
    this.userProfile = authservice.getUserProfile();

    this.chartData = [
      { y: 450 },
      { y: 414 },
      { y: 520, indexLabel: "\u2191 highest", markerColor: "red", markerType: "triangle" },
      { y: 460 },
      { y: 450 },
      { y: 500 },
      { y: 480 },
      { y: 480 },
      { y: 410, indexLabel: "\u2193 lowest", markerColor: "DarkSlateGrey", markerType: "cross" },
      { y: 500 },
      { y: 480 },
      { y: 510 }
    ];
    //this.activeurlpath = arouter.snapshot.url[0].path;


  }
  Tawk_API: any;
  Tawk_LoadStart: any;
  startChatTwak() {
    this.Tawk_API = this.Tawk_API || {}, this.Tawk_LoadStart = new Date();

    this.Tawk_API.onLoad = function () {
      this.Tawk_API.setAttributes({
        name: this.userProfile.username,
        email: this.userProfile.email
      }, function (error) { });
    };
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/60b8e8156699c7280daa885a/1f794l5gp';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }
  showChart(sale, purchase) {
    var xValues = ["Sales", "Purchase"];
    var yValues = [sale, purchase];
    var barColors = [
      "#b91d47",
      "#e8c3b9"
    ];

    new Chart("myChart", {
      type: "pie",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "Sale/Purchase for the month"
        }
      }
    });
  }
  sub: Subscription;
  result: any = <any>{};
  ngOnInit() {
    // this.callWhatsApp();
    this.selectedDate = {
      startDate: moment(),
      endDate: moment()
    }
    if (this.AppSettings.EnableLiveChatBot == 1) {
      this.startChatTwak();
    }
    else { }

    this.ranges = this.masterService.dateFilterRange;
    this.getdataforBussinessdashboard();
    this.showMessage = false;

    this.userSelectedDivision = this.userProfile.userDivision;
    if (this.userProfile.username.toLowerCase() == "admin") {
      this.userWiseDivisions = this.masterService.AllDivisions;

    } else {
      this.userWiseDivisions = this.masterService.AllDivisions.filter(x => x.INITIAL == this.userProfile.userDivision);
    }

  }

  messageOK() {
    this.showMessage = false;

  }

  reloadOrderMe() {
    //   this.refresh = true;
    //   if (this._transactionService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor"
    //    || this._transactionService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" || 
    //    this._transactionService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb") {
    //   }else{
    //     this.masterService.masterGetmethod("/getOrderStatusCount").subscribe((res) => {
    //     if (res.status == "ok") {
    //       this.refresh = false;
    //       this.ordermeReport = res.result;
    //     }else{
    //       this.refresh=false;
    //     }
    //   }, error => {
    //     this.refresh = false;
    //   },()=>{
    //     this.refresh = false;
    //   })
    // }
  }

  public getRequestOption() {
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers });
  }
  public getdataforBussinessdashboard() {

    let res = { status: "error", result: "" };

    let apiUrl = this.state.getGlobalSetting("apiUrl");
    this.http.get(apiUrl + '/getBusinessDashboard', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {

        this.result = data.result;
        if (this.result.dashboardsales != null) {
          let sale = this.result.dashboardsales.Saleforthemonth;
          let purchase = this.result.dashboardpurchase.Purchaseforthemonth;
          this.showChart(sale, purchase);
        }

      }

    }, error => {
      res.status = 'error'; res.result = error;

    }, () => {
      this.reloadOrderMe();
    }
    );

  }

  ngOnDestroy() {
    this.subsriptionArray.forEach(sub => {
      sub.unsubscribe();
    })

  }

  public date: string;
  dateChanged(date) {
    this.date = moment(this.selectedDate.endDate).format('MM-DD-YYYY')

  }
  printPosBill(data: string) {

    var ws;
    ws = new WebSocket('ws://127.0.0.1:1660');
    ws.addEventListener('message', ws_recv, false);
    ws.addEventListener('open', ws_open(data), false);
    function ws_open(text) {
      ws.onopen = () => ws.send(text)
    }

    function ws_recv(e) {

    }

  }
  showPosPrinterPreview: boolean = false;
  printStringForPos: any;
  onPrint() {
    let res = { status: "error", result: "" };
    let apiUrl = this.state.getGlobalSetting("apiUrl");
    this.http.post(apiUrl + '/getprintBusinessdashboard', { date: this.date, PhiscalID: this.authService.getUserProfile().CompanyInfo.PhiscalID, division: this.authService.getUserProfile().userDivision, warehouse: this.authService.getUserProfile().userWarehouse }, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        this.showPosPrinterPreview = true;
        this.printStringForPos = data.result;
      }
    }, error => {
      res.status = 'error'; res.result = error;
    }
    );
  }

  onPrintClicked() {
    this.promptPrintDevice = true
  }

  public printIt() {
    try {
      //alert("reached printIT")
      let printContents, popupWin;
      printContents = document.getElementById('dashboardPrint').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1500px');
      // popupWin.document.open();
      popupWin.document.write(`
      <html>
          <head>                  
              <style>
                  .InvoiceHeader{
            text-align:center;
            font-weight:bold
        }
        p
        {
            height:5px;
        }
        table{
            margin:5px
        }
        .summaryTable{
            float: right;
            border: none;
        }

        .summaryTable  td{
            text-align:right;
            border:none;
        }

        .itemtable{
            border: 1px solid black;
            border-collapse: collapse;
        }
        .itemtable th{                
            height:30px;
            font-weight:bold;
        }
        .itemtable th, td {               
            border: 1px solid black;
            padding:2px;

        }
              </style>
          </head>
          <body onload="window.print();window.close()">${printContents}
          </body>
      </html>`
      );
      popupWin.document.close();
    }
    catch (ex) {
      this.alertService.error(ex)
    }
  }

  setPrinterAndprint() {
    this.promptPrintDevice = false;
    this.userProfile.PrintMode = this.printControl.value;
    var printType = this.userProfile.PrintMode == 1 ? "BUSINESSDASHBOARD_2mm" : this.userProfile.PrintMode == 0 ? "BUSINESSDASHBOARD_3mm" : this.userProfile.PrintMode == 2 ? "BUSINESSDASHBOARD_A4" : "";
    let res = { status: "error", result: "" };
    let apiUrl = this.state.getGlobalSetting("apiUrl");

    if (printType != "BUSINESSDASHBOARD_A4") {
      this.http.post(apiUrl + '/getprintBusinessdashboard', { date: this.date, PhiscalID: this.authService.getUserProfile().CompanyInfo.PhiscalID, division: this.authService.getUserProfile().userDivision, warehouse: this.authService.getUserProfile().userWarehouse, printType: printType }, this.getRequestOption()).subscribe(response => {
        let data = response.json();
        if (data.status == 'ok') {
          this.showPosPrinterPreview = true;
          this.printStringForPos = data.result;
        }
      }, error => {
        res.status = 'error'; res.result = error;
      }
      );
    }
    else {
      this.printIt()
    }
  }


  canclePreview() {
    this.showPosPrinterPreview = false;
  }
  printDayEndBill() {
    this.printPosBill(this.printStringForPos);
  }


  showOrderMeStatus() {
    if (this._transactionService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor" || this._transactionService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" || this._transactionService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb") {
      return false;
    } else {
      return true;
    }
  }

  cancelprint() {
    this.promptPrintDevice = false;
    this.showPosPrinterPreview = false;


  }


  onUserBranchChanged = () => {
    if (this.userSelectedDivision == null || this.userSelectedDivision == undefined || this.userSelectedDivision == "") {
      return true;
    }


    this.masterService.masterGetmethod_NEW(`/updateusercurrentbranch?branch=${this.userSelectedDivision}`).subscribe((res) => {
      if (res.status == "ok") {
        if (res.result != null && res.result != undefined) {
          localStorage.setItem("USER_PROFILE", JSON.stringify(res.result));
        }
      }
    })

  }





  testNEwPrint = () => {
    // let blob: any;
    // let data =
    // {
    //   "VCHRNO": "TI1AAA2122",
    //   "DIVISION": "AAA",
    //   "PHISCALID": "21/22",
    //   "DEPVALUE": "0",
    //   "reportName": "TaxInvoice",
    //   "companyId": "localhost"
    // }

    // this.masterService.gethtmlDesignedPrint(data).subscribe(
    //   (data: any) => {
    //     const blobUrl = URL.createObjectURL(data.content);
    //     const iframe = document.createElement('iframe');
    //     iframe.style.display = 'none';
    //     iframe.src = blobUrl;
    //     document.body.appendChild(iframe);
    //     iframe.contentWindow.print();

    //   }
    // )




    this.masterService.getPRNData("/getprnData").subscribe((res: any) => {

      


      let popupWin;
      this._transactionService.initialFormLoad(this._transactionService.TrnMainObj.VoucherType);
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.write(
        `<body onload="window.print();window.close()">${JSON.stringify(res._body)}</body>`
      );
      popupWin.document.close();

    })





  }

}
