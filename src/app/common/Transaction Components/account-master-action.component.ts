import { TransactionService } from "./transaction.service";

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { VoucherTypeEnum } from "../interfaces/TrnMain";
import { FormGroup, FormControl } from "@angular/forms";
import { MasterRepo } from "../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "../services";
import { AuthService } from "../services/permission/authService.service";
import { MdDialog } from "@angular/material";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { PrintInvoiceComponent } from "../Invoice/print-invoice/print-invoice.component";

@Component({
  selector: "account-master-action",
  templateUrl: "./account-master-action.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class AccountMasterActionComponent implements OnInit {
  @Input() isSales;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  modeTitle: string = "";
  public activeurlpath: string;
  // public activeurlpath2:string;
  //TrnMainObj: TrnMain = <TrnMain>{};

  form: FormGroup;
  AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};

  @Output() onViewClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSaveClickedEmit: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;

  returnUrl: string;
  checkstatus = true;
  viewSubscription: Subscription = new Subscription();
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  showSecondaryButtons: boolean;
  gridPopupSettingsForHoldBill: GenericPopUpSettings = new GenericPopUpSettings();
  trialUrl: boolean = false;
  showUnApprove: boolean = false;
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    public setting: SettingService,

    authservice: AuthService,
    public dialog: MdDialog,
    public router: Router,
    public arouter: ActivatedRoute,
    public alertService: AlertService,
    public _hotkeysService: HotkeysService,
    public loadingService: SpinnerService,
    public invoicePrint: PrintInvoiceComponent,

  ) {
    //this.TrnMainObj = _trnMainService.TrnMainObj;
    this.activeurlpath = this.arouter.snapshot.url[0].path;
    // this.activeurlpath2=this.arouter.snapshot.url[0].path;


    this.masterService.ShowMore = false;
    this.AppSettings = this.setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType;
    this._trnMainService.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this._trnMainService.TrnMainObj.DIVISION = this.userProfile.userDivision;
    this.showSecondaryButtons = false;
    this.masterService.refreshTransactionList();
    if (
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn
    ) {
      this.transactionType = "creditnote";
    }

    this.gridPopupSettings = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings(
      this._trnMainService.TrnMainObj.VoucherAbbName
    ));

    this.setHotKeyFunction();

  }

  onCancelClicked() {
    this.router.navigate([this.returnUrl]);
  }

  @ViewChild('back') back: ElementRef
  @ViewChild('save') save: ElementRef
  @ViewChild('reset') reset: ElementRef
  @ViewChild('view') view: ElementRef
  // @ViewChild('print') print: ElementRef



  setHotKeyFunction() {

    //for new 
    this._hotkeysService.add(
      new Hotkey(
        "f3",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          if (this.reset) {
            this.reset.nativeElement.click();
          }
          return false;
        }
      )
    );

    //for view 
    this._hotkeysService.add(
      new Hotkey(
        "f4",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          if (this.view) {
            this.view.nativeElement.click()
          }
          return false;
        }
      )
    );

    //for Save 
    this._hotkeysService.add(
      new Hotkey(
        "f6",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          if (this.save) {
            this.save.nativeElement.click()
          }
          return false;
        }
      )
    );

    //for Cancel 
    this._hotkeysService.add(
      new Hotkey(
        "f10",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          if (this.back) {
            this.back.nativeElement.click()
          }
          return false;
        }
      )
    );
  }

  ngOnInit() {
    this.returnUrl = "/pages/dashboard";
  }

  ngOnDestroy() {
    try {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    } catch (ex) {
      console.log({ OnDestroyVoucherDate: ex });
    }
  }

  onCloseClicked() {
    this.router.navigate(["/pages/dashboard"]);
  }

  onViewClicked() {
    // this.onViewClickEmit.emit(null);
    this.genericGrid.show();
  }

  // onPrintClicked() {
  //   //get print data
  //   // this.masterService.getReprintData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNUSER).subscribe((response) => {
  //   this.masterService
  //     .getReprintData("TI82-MMX-075/76", "MMX", "075/76", "admin")
  //     .subscribe(
  //       response => {
  //         this.print(response.result);
  //       },
  //       err => {
  //         this.alertService.error(err);
  //       }
  //     );
  // }

  //for print
  public promptPrintDevice: boolean = false
  promptPrinterDevice() {
    this.promptPrintDevice = true
  }
  public printControl = new FormControl(0)

  setPrinterAndprint() {
    this.promptPrintDevice = false
    this.userProfile.PrintMode = this.printControl.value
    if (this.userProfile.PrintMode == 1) {
      this.loadingService.show("please wait. Getting invoice data ready for printing.")
      try {

        this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC, "", "", this._trnMainService.TrnMainObj.TRNMODE).subscribe((res) => {
          this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherType, this.activeurlpath)
          this.loadingService.hide()
        }, err => {
          this.alertService.error(err)

        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    } else if (this.userProfile.PrintMode == 0) {
      try {

        this.masterService.getReprintData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNUSER,this._trnMainService.TrnMainObj.VoucherAbbName).subscribe((response) => {
          this.print(response.result)
        }, err => {
          this.alertService.error(err);
        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    } else {
      try {
        this.masterService.getReprintData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNUSER,this._trnMainService.TrnMainObj.VoucherAbbName).subscribe((response) => {
          this.print(response.result)
        }, err => {
          this.alertService.error(err);
        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    }


    setTimeout(() => {
      this._trnMainService.TrnMainObj.VoucherType = this._trnMainService.TrnMainObj.VoucherType == 61 ? 14 : this._trnMainService.TrnMainObj.VoucherType
      this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
    }, 100);

  }




  onPrintClicked() {
    this.promptPrinterDevice()
  }

  //     onPrintClicked() {
  
  //   }





  print(printStr: string) {
    var ws;
    ws = new WebSocket("ws://127.0.0.1:1660");
    ws.addEventListener("message", ws_recv, false);
    ws.addEventListener("open", ws_open(printStr), false);
    function ws_open(text) {
      alert("Are you sure to print?");
      console.log(ws);
      ws.onopen = () => ws.send(text);
      // ws.send(text);
    }

    function ws_recv() {
      alert("2 : success");
      console.log();
    }
  }

  onSaveClicked() {
    console.log({ trnMainSave: this._trnMainService.TrnMainObj });
    var data = JSON.stringify(this._trnMainService.TrnMainObj, undefined, 2);
    console.log(data);
    this.onSubmit();
  }

  transactionValidator(): boolean {
    if (!this._trnMainService.setDefaultValueInTransaction()) {
      return false;
    }
    return true;
  }

  onSubmit() {
    try {
      if (
        this._trnMainService.TrnMainObj.TrntranList[this._trnMainService.TrnMainObj.TrntranList.length - 1].AccountItem.ACID == null
      ) {
        this._trnMainService.TrnMainObj.TrntranList.splice(
          this._trnMainService.TrnMainObj.TrntranList.length - 1,
          1
        );
      }
      for (var t in this._trnMainService.TrnMainObj.TrntranList) {
        if (
          this._trnMainService.TrnMainObj.TrntranList[t].AccountItem.HASSUBLEDGER == 1 &&
          (this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList[
            this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1
          ].SubledgerItem.ACID == null ||
            this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList[
              this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1
            ].CRAMNT == null)
        ) {
          this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.splice(
            this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1,
            1
          );
        }
      }

      if (this._trnMainService.TrnMainObj.VoucherType == 22 || this._trnMainService.TrnMainObj.VoucherType == 23) {
        this._trnMainService.TrnMainObj.ProdList = [];
      }
      this._trnMainService.TrnMainObj.tag = "accountbase";
    } catch (e) {
    }
  }

  nullToZeroConverter(value) {
    if (value == undefined || value == null || value == "") {
      return 0;
    }
    return parseFloat(value);
  }

  onItemDoubleClick(event) {
    this.loadVoucher(event);
  }

  loadVoucher(selectedItem) {
    this._trnMainService.loadData(
      selectedItem.VCHRNO,
      selectedItem.DIVISION,
      selectedItem.PhiscalID
    );
    this._trnMainService.showPerformaApproveReject = false;
  }

  onNewClick() {
    this._trnMainService.initialFormLoad(
      this._trnMainService.TrnMainObj.VoucherType
    );
    this._trnMainService.showPerformaApproveReject = false;
  }

  okClicked(value) {
    this._trnMainService.TrnMainObj.TenderList = value;
    console.table(this._trnMainService.TrnMainObj.TenderList);
    let TB = this._trnMainService.TrnMainObj.TenderList[0];
    if (TB == null) {
      this.alertService.error("Tender Amount not detected");
      return;
    }
    this._trnMainService.TrnMainObj.TRNAC = TB.ACCOUNT;
    if (!this.transactionValidator()) return;
    this.onSubmit();
  }

  okAddNewClicked(value) {
    let CustObj = value;
    CustObj.PRICELEVEL = value.GEO;
    CustObj.TYPE = "A";
    CustObj.PARENT = "PA";
    CustObj.PType = "C";
    CustObj.COMPANYID = this._trnMainService.userProfile.CompanyInfo.COMPANYID;
  }

  isFormValid: boolean;
  formValidCheck = (): boolean => {
    // console.log({ warehouse: this.warehouse, prodlist: this.TrnMainObj.AdditionProdList, trnac: this.TrnMainObj.TRNAC });
    if (this._trnMainService.Warehouse == undefined || this._trnMainService.Warehouse == '') {
      return false;
    }
    if (this._trnMainService.TrnMainObj.ProdList == undefined) {
      return false;
    }
    else {
      if (this._trnMainService.TrnMainObj.ProdList.length < 1) {
        return false;
      }
    }
    return true;
  }

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "ControlLeft" || $event.code == "ControlRight") {
      $event.preventDefault();
      this.showSecondaryButtons = true;
    }
  }
  @HostListener("document : keyup", ["$event"])
  handleKeyUpboardEvent($event: KeyboardEvent) {
    if ($event.code == "ControlLeft" || $event.code == "ControlRight") {
      $event.preventDefault();
      this.showSecondaryButtons = false;
    }
  }
}
