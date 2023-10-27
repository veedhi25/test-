import { Component, ViewChild, OnInit, HostListener } from "@angular/core";
import { MasterRepo } from "../../../../../common/repositories";
import { LoadChartService } from "../load-chart.service";
import { LoadChartModel } from "../../../../../common/interfaces/load-chart.interface";
import { MdDialog } from "@angular/material";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { TransactionService } from "../../../../../common/Transaction Components/transaction.service";
import { TrnMain } from "../../../../../common/interfaces";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import * as moment from 'moment'
import { DecimalPipe } from "@angular/common";
import { isNullOrUndefined } from "util";
import { FormControl } from "@angular/forms";
import { AuthService } from "../../../../../common/services/permission";

@Component({
  selector: 'load-chart-action',
  templateUrl: './load-chart-action.component.html',
  providers: [LoadChartService],
  styleUrls: ['../../../../modal-style.css', '../../../../Style.css', '../../../../../common/popupLists/pStyle.css', './halfcolumn.css']
})


export class LoadChartActionComponent implements OnInit {
  public showDiverPopUp: boolean = false;
  public promptPrintDevice: boolean = false;
  public printControl = new FormControl(0);
  LoadChartModel: LoadChartModel = new LoadChartModel();
  SELECTEDDSMLIST: any[] = <any>[];
  SELECTEdBEATLIST: any[] = <any>[];
  VTYPE: string;
  trnmain: TrnMain = <TrnMain>{}
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericDSMGrid") genericDSMGrid: GenericPopUpComponent;
  dsmGridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericBeatGrid") genericBeatGrid: GenericPopUpComponent;
  beatGridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  public activeIndex: number = 0;
  public itemSummaryDetail: any;
  public isFilterActive: boolean = false;
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
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
  startDate: string = "";
  endDate: string = "";
  setting: any;
  showVehilcePopUp: boolean = false;
  constructor(
    public masterService: MasterRepo,
    private loadChartService: LoadChartService,
    public dialog: MdDialog,
    private _transactionService: TransactionService,
    private _alertService: AlertService,
    private _loadingService: SpinnerService,
    public authservice: AuthService
  ) {
    this.setting = this.authservice.getSetting();
    this.VTYPE = "TI";
    this.LoadChartModel.MODE = "NEW"
    this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Load Sheets",
      apiEndpoints: `/VoucherListTranWise/LoadSheet`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'VOUCHERNO',
          title: 'VCHRNO',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TOTALWEIGHT',
          title: 'Total Wt.',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TOTALNUMBEROFBILLS',
          title: 'No.Of Bills',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TOTAMOUNT',
          title: 'Net Amount',
          hidden: false,
          noSearch: false
        },
      ]
    });
    this.dsmGridPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "DSM NAME",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'DSMNAME',
          title: 'Name',
          hidden: false,
          noSearch: false
        },
        {
          key: 'DSMCODE',
          title: 'DSM CODE',
          hidden: false,
          noSearch: false
        }
      ]
    });
    this.beatGridPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "BEAT NAME",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'BEAT',
          title: 'Beat Name',
          hidden: false,
          noSearch: false
        }
      ]
    });


    this.trnmain.VoucherType = 70;
    this.trnmain.VoucherPrefix = "LS";
    this.trnmain.Mode = "NEW";
    this.trnmain.DIVISION = this._transactionService.userProfile.CompanyInfo.INITIAL;
    this.trnmain.MWAREHOUSE = this._transactionService.userProfile.userWarehouse;
    this.trnmain.PhiscalID = this._transactionService.userProfile.CompanyInfo.PhiscalID;
    this.masterService.getVoucherNo(this.trnmain).subscribe((res) => {
      this.LoadChartModel.VOUCHERNO = res.result.VCHRNO
    })
    this.loadDriverMaster();
    this.loadvehicleListMaster()

    let userprofiles = this.authservice.getUserProfile();
    this.divisoinPhiscalIDString = userprofiles.userDivision + userprofiles.CompanyInfo.PhiscalID.replace("/", "");
  }



  ngOnInit() {
    this.masterService.ShowMore = true;
    let FBDATE = (this._transactionService.userProfile.CompanyInfo.FBDATE).substr(0, 10);
    let FEDATE = (this._transactionService.userProfile.CompanyInfo.FEDATE).substr(0, 10);

  }


  loadFilter() {
    this.isFilterActive = true;

  }

  singleClick(index) {
    this.activeIndex = index;
  }
  doubleClick(item) {
    let x: any
    x = this.LoadChartModel.REFBILL.filter(itm => itm.REFBILL == item.VCHRNO)
    if (x.length > 0) {
      return;
    }
    this.LoadChartModel.REFBILL.push({
      REFBILL: item.VCHRNO,
      BILLTO: item.BILLTO,
      VOUCHERNO: this.LoadChartModel.VOUCHERNO,
      CHALANNO: item.CHALANNO,
      VoucherType: item.VoucherType
    })
    this.getLoadCharSummary();
  }


  getDSMSheetVoucher(dsm) {
    let x: any
    x = this.SELECTEDDSMLIST.filter(x => x.DSMCODE == dsm.DSMCODE)
    if (x.length > 0) {
      return;
    }
    this.SELECTEDDSMLIST.push(dsm);
    let dsmarray = [];
    this.SELECTEDDSMLIST.forEach(dsm => {
      dsmarray.push(dsm.DSMNAME)
    });
    this.LoadChartModel.SALESMANNAME = dsmarray.join();

  }
  getBeatVoucher(beat) {
    let x: any
    x = this.SELECTEdBEATLIST.filter(x => x.BEAT == beat.BEAT)
    if (x.length > 0) {
      return;
    }
    this.SELECTEdBEATLIST.push(beat);
  }


  reset() {
    this.LoadChartModel = new LoadChartModel()
    this.LoadChartModel.MODE = "NEW"
    this.LoadChartModel.REFBILL = []
    this.LoadChartModel.ITEMSUMMARY = []
    this.LoadChartModel.SalesVoucher = []
    this.TOTALCLD = 0;
    this.TOTALPCS = 0;
    this.masterService.getVoucherNo(this.trnmain).subscribe((res) => {
      this.LoadChartModel.VOUCHERNO = res.result.VCHRNO
      this.enableCancelButton = false
    })
    this.loadDriverMaster();
    this.loadvehicleListMaster();
  }


  onVoucherTypeChanged() {
    this.reset();
  }


  getLoadCharSummary() {
    this.LoadChartModel.VTYPE = this.VTYPE;
    this.loadChartService.loadChartItemSummary(this.LoadChartModel).subscribe((res) => {
      if (res.status == "ok") {
        this.LoadChartModel.ITEMSUMMARY = res.result
        let totalWeight: number = 0
        let totalTaxable: number = 0
        let totalAmount: number = 0
        this.LoadChartModel.ITEMSUMMARY.forEach(x => {
          totalWeight = this._transactionService.nullToZeroConverter(totalWeight) + this._transactionService.nullToZeroConverter(x.WEIGHT)
          totalAmount = this._transactionService.nullToZeroConverter(totalAmount) + this._transactionService.nullToZeroConverter(x.NETAMOUNT)
          totalTaxable = this._transactionService.nullToZeroConverter(totalTaxable) + this._transactionService.nullToZeroConverter(x.TAXABLE)
          // x.CLD = Math.floor(this._transactionService.nullToZeroConverter(x.RealQty) / this._transactionService.nullToZeroConverter(x.CONFACTOR))
          // x.PCS = Math.ceil(this._transactionService.nullToZeroConverter(x.RealQty) % this._transactionService.nullToZeroConverter(x.CONFACTOR))
        });


        this.LoadChartModel.TOTALWEIGHT = totalWeight;
        this.LoadChartModel.TOTALAMOUNT = totalAmount;
        this.LoadChartModel.TOTALNUMBEROFBILLS = this.LoadChartModel.REFBILL.length;
        this.LoadChartModel.TOTALTAXABLE = totalTaxable;

      } else {
        alert(res.result)
      }
    }, error => {
      alert(error)
    })
  }

  onFilterApply(filter) {
    let dsm = [];
    let beat = [];
    this.SELECTEDDSMLIST.forEach(x => {
      dsm.push(`'${x.DSMCODE}'`);
    });
    this.SELECTEdBEATLIST.forEach(x => {
      beat.push(`'${x.BEAT}'`);
    });
    let data: any = {};
    data.dsmlist = dsm.join();
    data.beatlist = beat.join();
    data.FROM = this.startDate == "Invalid date" ? "" : this.startDate;
    data.TO = this.endDate == "Invalid date" ? "" : this.endDate;
    data.VTYPE = this.VTYPE;
    this.isFilterActive = false;
    this.loadChartService.loadInvoiceForLoadChart(data).subscribe((res) => {
      this.LoadChartModel.SalesVoucher = res.result
    })
  }

  removeInvoiceFromList(index) {
    this.LoadChartModel.REFBILL.splice(index, 1)
    if (this.LoadChartModel.REFBILL.length == 0) {
      this.reset()
      return;
    } else {
      this.getLoadCharSummary()
    }
  }

  removeDSM(index) {
    this.SELECTEDDSMLIST.splice(index, 1);

  }
  removeBEAT(index) {
    this.SELECTEdBEATLIST.splice(index, 1);

  }
  public drivername: string = "";
  public vehicleNo: string = "";

  public driverList: any[] = [];
  loadDriverMaster = (): any => {
    this.masterService.masterPostmethod_NEW("/getDriverList", {}).subscribe((res) => {
      if (res.status = "ok") {
        this.driverList = res.result;
      } else {
        this.driverList = [];
      }
    }, error => {
      this.driverList = [];
    })
  }
  public vehicleList: any[] = [];
  loadvehicleListMaster = (): any => {
    this.masterService.masterPostmethod_NEW("/getVehicleList", {}).subscribe((res) => {
      if (res.status = "ok") {
        this.vehicleList = res.result;
      } else {
        this.vehicleList = [];
      }
    }, error => {
      this.vehicleList = [];
    })
  }


  saveDriver = (): any => {
    this._loadingService.show("Adding Transporter.Please Wait.")
    this.masterService.masterPostmethod_NEW("/saveDriverName", { DRIVERNAME: this.drivername }).subscribe((res) => {
      this._loadingService.hide();
      this.loadDriverMaster();
      this.showDiverPopUp = false;

    }, error => {
      this._loadingService.hide();
      this.showDiverPopUp = false;

    })
  }
  saveVehicle = (): any => {
    this._loadingService.show("Adding Vehicle.Please Wait.")
    this.masterService.masterPostmethod_NEW("/saveVehicle", { VEHICLENO: this.vehicleNo }).subscribe((res) => {
      this._loadingService.hide();
      this.loadvehicleListMaster();
      this.showVehilcePopUp = false;

    }, error => {
      this._loadingService.hide();
      this.showVehilcePopUp = false;
    })
  }


  save() {
    this.LoadChartModel.ITEMSUMMARY.forEach(x => {
      x.QUANTITY = x.RealQty
    })
    if (this.LoadChartModel.VEHICLENO == null || this.LoadChartModel.VEHICLENO == "" || this.LoadChartModel.VEHICLENO == undefined) {
      this._alertService.error("Please provide vehicle number to create load sheet");
      return;
    }
    if (this.LoadChartModel.DRIVERNAME == null || this.LoadChartModel.DRIVERNAME == "" || this.LoadChartModel.DRIVERNAME == undefined) {
      this._alertService.error("Please provide Driver name to create load sheet");
      return;
    }
    if (!this.LoadChartModel.REFBILL.length) {
      this._alertService.error("Please select at least one invoice to create load sheet");
      return;
    }
    this._loadingService.show("Saving Load Sheet")
    this.loadChartService.saveLoadChartInfo(this.LoadChartModel).subscribe((res) => {
      if (res.status == "ok") {
        this._loadingService.hide()
        this._alertService.success(res.result)
        this.loadChartService.getLoadChartInfoVoucherWise(this.LoadChartModel.VOUCHERNO).subscribe((res) => {
          if (res.status == "ok") {
            this.printLoadSheetCustomize(res.result)
          }
        }, error => {
          this._alertService.error(error)
        })
        this.reset()
      } else {
        this._loadingService.hide();
        this._alertService.error(res.result._body)

      }
    }, error => {
      this._alertService.error(error)

    })

  }

  public mode: string = "NEW"

  view() {
    this.mode = "VIEW"
    this.genericGrid.show();
  }
  edit() {
    this.mode = "EDIT"
    this.genericGrid.show();
  }


  dateChanged() {
    this.startDate = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.endDate = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
  }

  popupClose() {
    this.isFilterActive = false;
  }
  loadDSMFilter() {
    this.genericDSMGrid.show("", false, "dsmList", false);
  }
  loadBeatilter() {
    this.genericBeatGrid.show("", false, "beatlist", false);
  }

  print() {
    this.promptPrintDevice = false;
    if (this.LoadChartModel.ITEMSUMMARY.length == 0) {
      this._alertService.warning("Please Load Voucher or save new voucher to print")
    } else {
      if (this.printControl.value == 0) {
        this.printLoadSheet(this.LoadChartModel)
      }
      else if (this.printControl.value == 12){
        this.downExcelLoadSheetCustomize(this.LoadChartModel);
      }
      else {
        this.printLoadSheetCustomize(this.LoadChartModel)
      }
    }
  }
  public enableCancelButton: boolean = false
  getLoadSheetVoucher(voucher) {
    if (this.mode == "VIEW") {
      this.enableCancelButton = true;
    }
    this._loadingService.show("Getting LoadSheet Data. Please Wait");
    this.loadChartService.getLoadChartInfoVoucherWise(voucher.VOUCHERNO).subscribe((res) => {

      if (res.status == "ok") {
        this._loadingService.hide()
        this.LoadChartModel = res.result;
        this.LoadChartModel.ITEMSUMMARY = res.result.ITEMSUMMARY;
        this.LoadChartModel.REFBILL = res.result.REFBILL;
        this.LoadChartModel.ITEMSUMMARY.forEach(x => {
          x.RealQty = x.QUANTITY
        })
        this.LoadChartModel.MODE = this.mode
      }
    }, error => {
      this._loadingService.hide();
      this._alertService.error(error)
    })
  }

  sendToPrint() {
    this.promptPrintDevice = true;

  }

  printSeletcted() {
    this.print();
  }

  cancelprint() {
    this.promptPrintDevice = false;
  }
  cancel() {
    this._loadingService.show("Cancelling LoadSheet.")
    this.loadChartService.cancelLoadSheet(this.LoadChartModel).subscribe((res) => {
      if (res.status == "ok") {
        this._loadingService.hide();
        this._alertService.success(res.result);
        this.reset();

      } else {
        this._loadingService.hide();
        this._alertService.error(res.result)
      }
    }, error => {
      this._loadingService.hide();
      this._alertService.error(error)
    })
  }

  transformDate(date) {
    return moment(date).format('DD/MM/YYYY')
  }
  limitDecimal(value: number) {
    return new DecimalPipe('en-US').transform(value, '1.2-2')
  }
  public TOTALCLD: number = 0;
  public TOTALPCS: number = 0;
  public collectionSheetData: any;

  CollectionSheet() {
    this._loadingService.show("Please wait! Generating Collection Sheet.")
    this.loadChartService.getCollectionSheet(this.LoadChartModel.REFBILL).subscribe((res) => {
      if (res.status == "ok") {
        this._loadingService.hide();
        this.LoadChartModel.COLLECTIONSHEET = res.result;
        this.printCollectionSheet(this.LoadChartModel)

      } else {
        this._loadingService.hide();
        this._alertService.error(res.result)
      }

    }, error => {
      this._loadingService.hide();
      this._alertService.error(error);
    })
  }
  printLoadSheet(loadSheetData) {
    this.TOTALCLD = 0;
    this.TOTALPCS = 0;
    loadSheetData.ITEMSUMMARY.forEach(x => {
      this.TOTALCLD = this.TOTALCLD + this._transactionService.nullToZeroConverter(x.CLD)
      this.TOTALPCS = this.TOTALPCS + this._transactionService.nullToZeroConverter(x.PCS)
    });



    let popupWin;
    let tableData = `<table *ngIf="itemDetail" style='width: 100%;font-size: 12px;
            border-collapse: collapse;border-top: none;border: 1px solid black;'>`
    let head = this.head(loadSheetData)
    let body = this.body(loadSheetData)
    let footer = this.footer(loadSheetData)
    tableData = tableData + head + body + footer + `</table>`

    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.write(`
        <html> <head>
        <title>Load Sheet</title>
        <style>
        td{
          padding:2px;
        }
        </style>
        </head>
        <body onload="window.print();window.close()">
        ${tableData}

        </body>
          </html>`
    );
    popupWin.document.close();
  }
  printLoadSheetCustomize(loadSheetData) {

    this.TOTALCLD = 0;
    this.TOTALPCS = 0;
    loadSheetData.ITEMSUMMARY.forEach(x => {
      this.TOTALCLD = this.TOTALCLD + this._transactionService.nullToZeroConverter(x.CLD)
      this.TOTALPCS = this.TOTALPCS + this._transactionService.nullToZeroConverter(x.PCS)
    });



    let popupWin;
    let tableData = `<table *ngIf="itemDetail" style='width: 100%;font-size: 12px;
            border-collapse: collapse;border-top: none;border: 1px solid black;'>`
    let head = this.headCustomize(loadSheetData)
    let body = this.bodyCustomize(loadSheetData)
    let footer = this.footerCustomize(loadSheetData)
    tableData = tableData + head + body + footer + `</table>`

    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.write(`
        <html> <head>
        <title>Load Sheet</title>
        <style>
        td{
          padding:2px;
        }
        </style>
        </head>
        <body onload="window.print();window.close()">
        ${tableData}

        </body>
          </html>`
    );
    popupWin.document.close();
  }
  downExcelLoadSheetCustomize(loadSheetData) {
    this.TOTALCLD = 0;
    this.TOTALPCS = 0;
    loadSheetData.ITEMSUMMARY.forEach(x => {
      this.TOTALCLD = this.TOTALCLD + this._transactionService.nullToZeroConverter(x.CLD)
      this.TOTALPCS = this.TOTALPCS + this._transactionService.nullToZeroConverter(x.PCS)
    });



   
    let tableData = `<table  style='width: 100%;font-size: 12px;
            border-collapse: collapse;border-top: none;border: 1px solid black;'>`
    let head = this.headCustomize(loadSheetData)
    let body = this.bodyCustomize(loadSheetData)
    let footer = this.footerCustomize(loadSheetData)
    tableData = tableData + head + body + footer + `</table>`;
    let htmlString =   `
        <html> <head>
        <title>Load Sheet</title>
        <style>
        td{
          padding:2px;
        }
        </style>
        </head>
        <body>
        ${tableData}

        </body>
          </html>`;
          let fileName = 'LoadSheet';
          var blob = new Blob([htmlString], { type: "application/vnd.ms-excel" });
          var blobUrl = URL.createObjectURL(blob);
          var downloadLink = document.createElement("a");
          downloadLink.href = blobUrl;
          downloadLink.download = fileName+'.xls';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
  
  }






  public divisoinPhiscalIDString: string = "";





  public head(data) {
    let thead = "";
    thead = thead + `
    <thead>
    <tr>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td>
      <td colspan="5" style="border-bottom:1px solid black;text-align:center">
        ${this._transactionService.userProfile.CompanyInfo.NAME} <br>
        ${this._transactionService.userProfile.CompanyInfo.ADDRESS} <br> 
        ${this._transactionService.userProfile.CompanyInfo.TELA},${this._transactionService.userProfile.CompanyInfo.EMAIL} <br>
        ${this._transactionService.userProfile.CompanyInfo.GSTNO}
      </td>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td> 
      <td style="border-bottom:1px solid black;"></td>
    </tr>

    <tr>
      <td colspan="2" style="border-bottom:1px solid black;border-right:1px solid black">Load sheet No</td>
      <td style="border-bottom:1px solid black;">${data.VOUCHERNO}</td>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td>
      <td colspan="2"  style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Vehicle No</td>
      <td  colspan="3" style="border-bottom:1px solid black;">${isNullOrUndefined(data.VEHICLENO) ? '' : data.VEHICLENO}</td>
    </tr>
    <tr>
      <td colspan="2"  style="border-bottom:1px solid black;border-right:1px solid black">Load sheet Date</td>
      <td style="border-bottom:1px solid black;">${this.transformDate(isNullOrUndefined(data.DATE) ? '' : (data.DATE))}</td>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td>
     
      <td colspan="2"  style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Salesman name</td>
      <td colspan="3" style="border-bottom:1px solid black;">${isNullOrUndefined(data.SALESMANNAME) ? '' : data.SALESMANNAME}</td>
    </tr>
    <tr>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td>
 
      <td colspan="2"  style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Route Name</td>
      <td colspan="3" style="border-bottom:1px solid black;">${isNullOrUndefined(data.ROUTENO) ? '' : data.ROUTENO}</td>
    </tr>
    <tr>
      <td style="border-right:1px solid black;"></td>
      <td style="border-right:1px solid black;"></td>
      <td style="border-right:1px solid black;"></td>
      <td style="border-right:1px solid black;"></td>
      <td style="border-right:1px solid black;"></td>
      <td style="border-right:1px solid black;"></td>
      <td style="border-right:1px solid black;"></td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;text-align:center"  colspan="2">Qty</td>
      <td ></td>
    </tr>
    <tr>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">SNo</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Item SAP Code</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;min-width=200px" >Material Name</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;" width="100px">Batch No.</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">MRP</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">EXP Date</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Mfg Date</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">CLD</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">PCS</td>
      <td style="border-bottom:1px solid black;">Amount</td>
    </tr>
  </thead>
                    `

    return thead
  }
  public headCustomize(data) {
    let thead = "";
    var BillsDetail = `<tbody>
                            <tr>
                              <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;">SNo</td>
                              <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;">Trn Date</td>
                              <td colspan="2" style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;min-width=200px" >Material Name</td>
                              <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;">MRP</td>
                              <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">CLD</td>
                              <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">PCS</td>
                              <td colspan="2" style="border-bottom:1px solid black;border-top:1px solid black;">Amount</td>
                            </tr>`
    for (let i in data.BILLInfo) {
      BillsDetail = BillsDetail + `
      
      <tr>
        <td style="border-right:1px solid black">${data.BILLInfo[i].VCHRNO}</td>
        <td style="border-right:1px solid black">${data.BILLInfo[i].TRNDATE}</td>
        <td colspan="2" style="border-right:1px solid black">${data.BILLInfo[i].ACNAME}</td>
        <td style="border-right:1px solid black">${data.BILLInfo[i].NETAMNT}</td>
        <td  colspan="1" style="border-right:1px solid black">${data.BILLInfo[i].ALTQTY}</td>
        <td  colspan="1" style="border-right:1px solid black">${data.BILLInfo[i].QTY}</td>
        <td style="border-right:1px solid black">${data.BILLInfo[i].ITEMDISCOUNT}</td>
        <td style="border-right:1px solid black">${data.BILLInfo[i].TOTALFLATDISCOUNT}</td>
      </tr>
                `;
    }
    BillsDetail = BillsDetail + `</tbody>`;
    thead = thead + `



    <thead>
    <tr>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"></td>
      <td colspan="5" style="border-bottom:1px solid black;text-align:center">
        ${this._transactionService.userProfile.CompanyInfo.NAME} <br>
        ${this._transactionService.userProfile.CompanyInfo.ADDRESS} <br> 
        ${this._transactionService.userProfile.CompanyInfo.TELA},${this._transactionService.userProfile.CompanyInfo.EMAIL} <br>
        ${this._transactionService.userProfile.CompanyInfo.GSTNO}
      </td>
      <td style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td> 
    </tr>
  <tr>
    <td style="border-bottom:1px solid black;border-right:1px solid black">BILL NO</td>
    <td style="border-bottom:1px solid black;border-right:1px solid black">BILL DATE</td>
    <td  colspan="2" style="border-bottom:1px solid black;border-right:1px solid black">PARTY NAME</td>
    <td style="border-bottom:1px solid black;border-right:1px solid black">GROSS</td>
    <td  colspan="2" style="border-bottom:1px solid black;border-right:1px solid black">QTY </td>
    <td style="border-bottom:1px solid black;border-right:1px solid black">Item Disc</td>
    <td style="border-bottom:1px solid black;border-right:1px solid black">Bill Disc</td>
  </tr>
    <tr>
      <td  style="border-bottom:1px solid black;border-right:1px solid black">Load sheet No</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
      <td colspan="2"style="border-bottom:1px solid black;">${data.VOUCHERNO.replace(this.divisoinPhiscalIDString, "")}</td>
      <td style="border-bottom:1px solid black;"></td>
      <td colspan="2" style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"  ></td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    </tr>
  <tr>
    <td  style="border-bottom:1px solid black;border-right:1px solid black">Load sheet Date</td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    <td colspan="2"  style="border-bottom:1px solid black;">${this.transformDate(isNullOrUndefined(data.DATE) ? '' : (data.DATE))}</td>
    <td style="border-bottom:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;"></td>
    <td style="border-bottom:1px solid black;"  ></td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
  </tr>
    <tr>
    <td  style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Vehicle No</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
      <td  colspan="2" style="border-bottom:1px solid black;">${isNullOrUndefined(data.VEHICLENO) ? '' : data.VEHICLENO}</td>
      <td style="border-bottom:1px solid black;"></td>
      <td colspan="2" style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"  ></td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    </tr>
    <tr>
      <td style="border-bottom:1px solid black;border-right:1px solid black">Salesman name</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
      <td colspan="2" style="border-bottom:1px solid black;">${isNullOrUndefined(data.SALESMANNAME) ? '' : data.SALESMANNAME}</td>
      <td style="border-bottom:1px solid black;"></td>
      <td colspan="2" style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"  ></td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    </tr>
    <tr>
      <td style="border-bottom:1px solid black;border-right:1px solid black">Driver Name</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
      <td colspan="2" style="border-bottom:1px solid black;">${isNullOrUndefined(data.DRIVERNAME) ? '' : data.DRIVERNAME}</td>
      <td style="border-bottom:1px solid black;"></td>
      <td colspan="2" style="border-bottom:1px solid black;"></td>
      <td style="border-bottom:1px solid black;"  ></td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    </tr>
    <tr>
    <td   style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Route Name</td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;">${isNullOrUndefined(data.ROUTENO) ? '' : data.ROUTENO}</td>
    <td style="border-bottom:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;"></td>
    <td style="border-bottom:1px solid black;"  ></td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    </tr>
    <tr>
    <td   style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Total Bills</td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;">${data.BILLInfo[0].VCHRNO} TO ${data.BILLInfo[data.BILLInfo.length - 1].VCHRNO}</td>
    <td style="border-bottom:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;"></td>
    <td style="border-bottom:1px solid black;"  ></td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    </tr>
    <tr>
    <td   style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Net Amount</td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;">${this.limitDecimal(data.TOTALAMOUNT)}</td>
    <td style="border-bottom:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;"></td>
    <td style="border-bottom:1px solid black;"  ></td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    </tr>
    <tr>
    <td   style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">NO of Bills</td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;">${data.TOTALNUMBEROFBILLS}</td>
    <td style="border-bottom:1px solid black;"></td>
    <td colspan="2" style="border-bottom:1px solid black;"></td>
    <td style="border-bottom:1px solid black;"  ></td>
    <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
    </tr>
    `+ BillsDetail + `
    <tr>
    <td style="border-top:1px solid black;border-right:1px solid black"></td>
    <td style="border-top:1px solid black;border-right:1px solid black"></td>
    <td colspan="2" style="border-top:1px solid black;border-right:1px solid black"></td>
    <td style="border-top:1px solid black;border-right:1px solid black">${data.BILLInfo.reduce((sum, item) => sum + item.NETAMNT, 0)}</td>
    <td colspan="1" style="border-top:1px solid black;border-right:1px solid black">${data.BILLInfo.reduce((sum, item) => sum + item.ALTQTY, 0)}</td>
    <td colspan="1" style="border-top:1px solid black;border-right:1px solid black">${data.BILLInfo.reduce((sum, item) => sum + item.QTY, 0)}</td>
    <td style="border-top:1px solid black;border-right:1px solid black"></td>
    <td style="border-top:1px solid black;border-right:1px solid black"></td>
  </tr>
  <tr>
  <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
  <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
  <td  colspan="2" style="border-bottom:1px solid black;border-right:1px solid black;"></td>
  <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
  <td colspan="2" style="border-bottom:1px solid black;border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;text-align:center">Qty</td>
  <td style="border-bottom:1px solid black;border-right:1px solid black;"></td>
 
  <td  colspan="2"style="border-bottom:1px solid black;"></td>
</tr>
    <tr>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;">SNo</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;">Item Code</td>
      <td colspan="2" style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;min-width=200px" >Material Name</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;">MRP</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">CLD</td>
      <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">PCS</td>
      <td colspan="2" style="border-bottom:1px solid black;border-top:1px solid black;">Amount</td>
    </tr>
  </thead>
                    `

    return thead
  }


















  public body(data) {
    let body = '<tbody>'
    for (let i in data.ITEMSUMMARY) {
      body = body + `
      <tr>
        <td style="border-right:1px solid black">${this._transactionService.nullToZeroConverter(i) + 1}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].MCODE}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].ITEMDESC}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].BATCH}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].MRP}</td>
        <td style="border-right:1px solid black">${this.transformDate(data.ITEMSUMMARY[i].EXPDATE)}</td>
        <td style="border-right:1px solid black">${this.transformDate(data.ITEMSUMMARY[i].MFGDATE)}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].CLD}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].PCS}</td>
        <td style="border-right:1px solid black;text-align:right">${this.limitDecimal(data.ITEMSUMMARY[i].NETAMOUNT)}</td>
      </tr>
                `
    }

    return body + `</tbody>`

  }
  public bodyCustomize(data) {
    let body = '<tbody>'
    for (let i in data.ITEMSUMMARY) {
      body = body + `
      <tr>
        <td style="border-right:1px solid black">${this._transactionService.nullToZeroConverter(i) + 1}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].MCODE}</td>
        <td colspan="2" style="border-right:1px solid black">${data.ITEMSUMMARY[i].ITEMDESC}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].MRP}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].CLD}</td>
        <td style="border-right:1px solid black">${data.ITEMSUMMARY[i].PCS}</td>
        <td colspan="2" style="border-right:1px solid black;text-align:right">${this.limitDecimal(data.ITEMSUMMARY[i].NETAMOUNT)}</td>
      </tr>
                `
    }

    return body + `</tbody>`

  }
  private footerCustomize(data) {

    let tfoot = ""
    tfoot = tfoot + `
                    <tfoot>
                    <tr>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">Total</td>
                      <td colspan="2" style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">${data.ITEMSUMMARY.reduce((sum, item) => sum + Number(item.CLD), 0)}</td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">${data.ITEMSUMMARY.reduce((sum, item) => sum + Number(item.PCS), 0)}</td>
                      <td colspan="2" style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">${this.limitDecimal(data.TOTALAMOUNT)}</td>
                    </tr>
                
                    </tfoot>
                    `

    return tfoot;

  }
  private footer(data) {

    let tfoot = ""
    tfoot = tfoot + `
                    <tfoot>
                    <tr>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">Total</td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">${this.TOTALCLD}</td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">${this.TOTALPCS}</td>
                      <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">${this.limitDecimal(data.TOTALAMOUNT)}</td>
                    </tr>
                    <tr>
                      <td colspan="5" style="overflow-wrap: break-word;
                      word-break: break-all;border-right: 1px solid black;">Ref Invoices:${this.setting.hideSuffixInBill ? data.REFBILL.map(x => x.CHALANNO).join(",") : data.REFBILL.map(x => x.VOUCHERNO).join(",")}</td>
                      <td colspan="2" style="text-align: right;">
                        Total Weight <br>
                        No.of Bills <br>
                        Total Taxable <br>
                        Total Amount
                      </td>
                      <td colspan="3" style="text-align:right">
                        ${this.limitDecimal(data.TOTALWEIGHT)} <br>
                        ${data.TOTALNUMBEROFBILLS} <br>
                        ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                        ${this.limitDecimal(data.TOTALAMOUNT)}
                      </td>
                    </tr>
                    </tfoot>
                    `

    return tfoot;

  }
  printCollectionSheet(loadSheetData) {
    let totalNetAmount = 0
    loadSheetData.COLLECTIONSHEET.forEach(x => {
      totalNetAmount = totalNetAmount + this._transactionService.nullToZeroConverter(x.NETAMNT)
    });
    let self = this;
    let popupWin;
    let tableData = `<table *ngIf="itemDetail" style='width: 100%;font-size: 12px;
            border-collapse: collapse;border-top: none;border: 1px solid black;'>`
    let header = head(loadSheetData)
    let bod = this.body(loadSheetData)
    let foot = footer()
    tableData = tableData + header + bod + foot + `</table>`
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.write(`
        <html> <head>
        <title>Collection Sheet</title>
        <style>
        td{
          padding:2px;
        }
        </style>
        </head>
        <body onload="window.print();window.close()">
        ${tableData}

        </body>
          </html>`
    );
    popupWin.document.close();




    function head(data) {
      let thead = "";

      thead = thead + `
      <thead>
      <tr>
        <td style="border-bottom:1px solid black;"></td>
        <td style="border-bottom:1px solid black;"></td>
        <td style="border-bottom:1px solid black;"></td>
        <td colspan="2" style="border-bottom:1px solid black;">
          ${self._transactionService.userProfile.CompanyInfo.NAME} <br>
          ${self._transactionService.userProfile.CompanyInfo.ADDRESS} <br> 
          ${self._transactionService.userProfile.CompanyInfo.TELA},${self._transactionService.userProfile.CompanyInfo.EMAIL} <br>
          ${self._transactionService.userProfile.CompanyInfo.GSTNO}
        </td>
        <td style="border-bottom:1px solid black;"></td>
        <td style="border-bottom:1px solid black;"></td>
        <td style="border-bottom:1px solid black;"></td>
        <td style="border-bottom:1px solid black;"></td>
      </tr>
  
      <tr>
        <td colspan="2" style="border-bottom:1px solid black;border-right:1px solid black">Load sheet No</td>
        <td style="border-bottom:1px solid black;">${data.VOUCHERNO}</td>
        <td style="border-bottom:1px solid black;"></td>
        <td colspan="2"  style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Vehicle No</td>
        <td  colspan="3" style="border-bottom:1px solid black;">${data.VEHICLENO}</td>
      </tr>
      <tr>
        <td colspan="2"  style="border-bottom:1px solid black;border-right:1px solid black">Load sheet Date</td>
        <td style="border-bottom:1px solid black;">${self.transformDate(data.DATE)}</td>
        <td style="border-bottom:1px solid black;"></td>       
        <td colspan="2"  style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Salesman name</td>
        <td colspan="3" style="border-bottom:1px solid black;">${data.SALESMANNAME}</td>
      </tr>
      <tr>
        <td style="border-bottom:1px solid black;"></td>
        <td style="border-bottom:1px solid black;"></td>
        <td style="border-bottom:1px solid black;"></td>
        <td style="border-bottom:1px solid black;"></td>
   
        <td colspan="2"  style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black">Route Name</td>
        <td colspan="3" style="border-bottom:1px solid black;">${data.ROUTENO}</td>
      </tr>
      <tr>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">S.No</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Invoice No</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Date</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">party Name</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Amount </td>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Cash</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Cheque</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Credit</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;">Remark</td>
      </tr>
    </thead>
                      `

      return thead
    }
    function body(data) {
      let body = '<tbody>'
      for (let i in data.COLLECTIONSHEET) {
        body = body + `
        <tr>
          <td style="border-right:1px solid black">${self._transactionService.nullToZeroConverter(i) + 1}</td>
          <td style="border-right:1px solid black">${data.COLLECTIONSHEET[i].VCHRNO}</td>
          <td style="border-right:1px solid black">${self.transformDate(data.COLLECTIONSHEET[i].TRNDATE)}</td>
          <td style="border-right:1px solid black">${data.COLLECTIONSHEET[i].BILLTO}</td>
          <td style="border-right:1px solid black;text-align:right">${self.limitDecimal(data.COLLECTIONSHEET[i].NETAMNT)}</td>
          <td style="border-right:1px solid black"></td>
          <td style="border-right:1px solid black"></td>
          <td style="border-right:1px solid black"></td>
          <td style="border-right:1px solid black"></td>
        </tr>
                  `
      }

      return body + `</tbody>`

    }
    function footer() {

      let tfoot = ""
      tfoot = tfoot + `
                      <tfoot>
                      <tr>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">Total</td>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">${totalNetAmount}</td>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">No Of Bills</td>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;">${self._transactionService.nullToZeroConverter(self.LoadChartModel.COLLECTIONSHEET.length)}</td>
                        <td style="border-top:1px solid black;border-bottom:1px solid black;border-right:1px solid black;"></td>
                      </tr>
                      </tfoot>
                      `
      return tfoot;

    }
  }
  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) {
    if ($event.code == "ArrowDown") {
      $event.preventDefault();
      if (this.activeIndex + 1 > this.LoadChartModel.SalesVoucher.length) {
        return;
      }
      this.activeIndex++;

    } else if ($event.code == "ArrowUp") {
      $event.preventDefault();
      if (this.activeIndex - 1 < 0) {
        return
      }
      this.activeIndex--;

    }
  }

}
