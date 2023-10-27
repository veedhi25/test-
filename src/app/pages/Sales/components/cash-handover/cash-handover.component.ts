import { Component, ViewChild, OnInit } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { ActivatedRoute } from "@angular/router";
import { ModalDirective } from "ng2-bootstrap";
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { AuthService } from "../../../../common/services/permission";


@Component({
  selector: "cash-handover",
  templateUrl: "./cash-handover.html",
  providers: [TransactionService],
  styles: [
    `
    .GRNPopUp tbody tr:hover {
      background-color: #e0e0e0;
    }
    .GRNPopUp tr.active td {
      background-color: #123456 !important;
      color: white;
    }
    .modal-dialog.modal-md {
      top: 45%;
      margin-top: 0px;
    }

    .modal-dialog.modal-sm {
      top: 45%;
      margin-top: 0px;
    }

    .table-summary > tbody > tr > td {
      font-size: 12px;
      font-weight: bold;
    }

    .table-summary > tbody > tr > td:first-child {
      text-align: left !important;
    }
    `
  ]
})
export class CashHandoverComponent implements OnInit {
  denoList: any;
  calculatedAmount: number;
  @ViewChild('childModal') childModal: ModalDirective;
  counter: number;
  cashTaken: number;
  morningCash: number;
  total: number = 0;
  screenOne = true;
  noOfBills: any;
  discountAmount: any;
  noOfItems: any;
  totalSales: any;
  counterArray: any[] = [];
  denoArray: any[] = [];
  amountArray: any[] = [];
  newList: any;
  date: any;
  print: any;
  showPosPrinterPreview: boolean = false;
  modeOfPaymentList: any;
  dateForTotalSales: any;
  newDate: any;
  actualCash: number = 0;
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private loadingService: SpinnerService,
  ) { }

  ngOnInit() {
    this.getDenoList();

    this.masterService.getCurrentDate().subscribe((res: any) => {
      this.date = res.Date.substring(0, 10);
    }
    )
    this.dateForTotalSales = new Date().toISOString().split('T')[0];
    this.dateChange(this.dateForTotalSales);

    this.getSession();
  }
  getDenoList() {
    this.masterService.getDenominationList().subscribe((res: any) => {
      this.denoList = res.result;
    })
  }

  changeMorningCash(event) {
    this.calculateDenomination();


  }

  changeCashTaken(event) {
    this.calculateDenomination();

  }

  dateChange(event) {
    this.noOfBills = null;
    this.noOfItems = null;
    this.totalSales = null;
    this.discountAmount = null;
    this.modeOfPaymentList = null;
    // .target.value
    this.newDate = event;
    // .target.value
    this.masterService.getDenominationTotal(event).subscribe((res: any) => {
      if (res.status == "ok") {
        if (res.result) {
          this.noOfBills = res.result.noOfBills;
          this.noOfItems = res.result.noOfItems;
          this.totalSales = res.result.totalSales;
          this.discountAmount = res.result.discountAmt;
          this.modeOfPaymentList = res.result.trnmodes;
          let cash = this.modeOfPaymentList.filter(x => x.trnmode.toLowerCase() == 'cash')[0];
          this.actualCash = cash.amount;
        }

        this.denoList = [];
        if (res.result2 && res.result2.length) {
          this.denoList = res.result2;
          this.cashTaken = res.result2[0].cash_taken;
          this.morningCash = res.result2[0].morning_cash;
          this.calculateDenomination();
        }
      }
      if(res.status == 'error'){
        this.getDenoList();
        this.actualCash = 0;
        this.calculateDenomination();
      }
    })

  }

  canclePreview() {
    this.showPosPrinterPreview = false;
  }




  changeScreen() {
    if (this.screenOne == true) {
      this.screenOne = false;
    }
    else {
      this.screenOne = true;
    }
  }

  saveDenomination() {
    if (this.actualCash !== this.total) {
      if (confirm("There is cash difference in actual cash and total cash. Are you sure you want to save?")) {
        this.loadingService.show("Please wait... Saving your data.");

        this.denoList.forEach(d => {
          d.morning_cash = this.morningCash;
          d.cash_taken = this.cashTaken
        });
        this.masterService.saveDenomination(this.denoList).subscribe(res => {
          if (res.status == 'ok') {
            this.loadingService.hide();
            // console.log(res);
            this.alertService.success("Data Saved SuccessFully");
            this.reset();
          }
          else {
            
            this.loadingService.hide();
            this.alertService.warning(res.status)
            this.reset();
          }
        })

      }
      else {
        return;
      }
    }
    else {
      this.loadingService.show("Please wait... Saving your data.");
      this.masterService.saveDenomination(this.denoList).subscribe(res => {
        if (res.status == 'ok') {
          this.loadingService.hide();
          this.reset();
          this.alertService.success("Data Saved SuccessFully")
        }
        else {
          this.loadingService.hide();
          this.reset();
          this.alertService.warning(res.status)
        }
      })


    }

  }

  printPosBill(data: string) {


    var ws;
    ws = new WebSocket("ws://127.0.0.1:1660");
    ws.addEventListener("message", ws_recv, false);
    ws.addEventListener("open", ws_open(data), false);
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
    this.showPosPrinterPreview = false;
  }

  printDayEndBill() {
    this.printPosBill(this.print)
  }
  calculateDenomination() {
    this.total = this.masterService.nullToZeroConverter(this.morningCash) - this.masterService.nullToZeroConverter(this.cashTaken);
    for (let d of this.denoList) {
      d.amount = this.masterService.nullToZeroConverter(d.qty) * this.masterService.nullToZeroConverter(d.basevalue);
      this.total = this.total + d.amount;
    }

  }

  onPrint() {


    this.masterService.getPrintCashHandover(this.newDate).subscribe((res: any) => {
      this.print = res.result;
      this.showPosPrinterPreview = true;
    });
  }

  getSession() {


    this.masterService.masterGetmethod("/getsession").subscribe((res: any) => {
      this.morningCash = res.result[0].OpeningAmount;
    });
  }

  reset() {
    this.dateForTotalSales = null;
    this.noOfBills = null;
    this.noOfItems = null;
    this.totalSales = null;
    this.discountAmount = null;
    this.modeOfPaymentList = null;
    this.total = 0;
    this.morningCash = 0;
    this.cashTaken = 0;
    this.actualCash = 0;
    this.getDenoList();
    for (let d of this.denoList) {
      d.amount = 0;
      d.qty = 0;
    }

  }
}
