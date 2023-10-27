import {
  Component,
  Output,
  EventEmitter,
  Injector,
  HostListener
} from "@angular/core";
import { debounce } from "../generic-grid/generic-popup-grid.component";
import { TransactionService } from "../../Transaction Components/transaction.service";
import { VoucherTypeEnum, PartyOpeningDetail } from "../../interfaces/TrnMain";
import { AlertService } from "../../services/alert/alert.service";

@Component({
  selector: "party-opening-details-popup",
  templateUrl: "./party-opening-details-popup.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class PartyOpeningDetailsPopUpComponent {
  isActive: boolean = false;
  currentIndex: number = 0;
  acType: string = "";

  @Output() onPopUpClose = new EventEmitter();
  @Output() onOkClick = new EventEmitter();

  voucherType: VoucherTypeEnum;

  constructor(
    public _trnMainService: TransactionService,
    private alertService : AlertService 
    ) {
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType;
  }

  show(index: number, acType: string) {
    this.currentIndex = index;
    this.acType = acType;

    console.log(this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]);
    if (
      !this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .PartyDetails ||
      this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .PartyDetails.length == 0
    ) {
      this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].PartyDetails = [];
      this.addRow();
    }
    this.isActive = true;
  }

  addRow(index: number = -1) {
    if (index != -1) {
      let current = this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].PartyDetails[index];
       if (current.REFVNO == "") {
        this.alertService.info("Voucher No is Required.");
        return;
      } else if (current.AMOUNT <= 0 || current.CLRAMOUNT < 0) {
        this.alertService.info("AMOUNT and CLEAR AMOUNT is required and can not be less than 0.");
        return;
      }
      else if ((current.AMOUNT - current.CLRAMOUNT) <= 0) {
        this.alertService.info("Amount Should be Greater than Clear Amount.");
        return;
      } 
    }


    if(index != -1 && this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails.length > index+1){
      return true; 
    } 
    
    var newItem = Object.assign(<PartyOpeningDetail>{}, {
      VCHRNO: this._trnMainService.TrnMainObj.VCHRNO,
      DIVISION: this._trnMainService.TrnMainObj.DIVISION,
      REFVNO: "",
      ACID: this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .AccountItem.ACID,
      REFDATE: (new Date()).toString().substring(0,10),
      AMOUNT: 0,
      CLRAMOUNT: 0,
      DUEDATE: (new Date()).toString().substring(0,10),
      REFSNO: "",
      PHISCALID: this._trnMainService.TrnMainObj.PhiscalID
    });
    this._trnMainService.TrnMainObj.TrntranList[
      this.currentIndex
    ].PartyDetails.push(newItem);
  }

  onAmountChange(i : number) {

    if(i != -1){
      this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[i].DUEAMT
      = this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[i].AMOUNT 
      - this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].PartyDetails[i].CLRAMOUNT;
    } 

    let dueTotal = this._trnMainService.TrnMainObj.TrntranList[
      this.currentIndex
    ].PartyDetails.reduce(
      (sum, x) =>
        sum +
        (this._trnMainService.nullToZeroConverter(x.AMOUNT) -
          this._trnMainService.nullToZeroConverter(x.CLRAMOUNT)),
      0
    );

    this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].CRAMNT = 0;
    this._trnMainService.TrnMainObj.TrntranList[this.currentIndex].DRAMNT = 0;
    if (this.acType == "drAmt") {
      this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].DRAMNT = dueTotal;
    } else if (this.acType == "crAmt") {
      this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].CRAMNT = dueTotal;
    }
  }

  deleteRow(index: number) {
    this._trnMainService.TrnMainObj.TrntranList[
      this.currentIndex
    ].PartyDetails.splice(index, 1);
    if (
      this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .PartyDetails.length == 0
    ) {
      this.addRow();
    }
    this.onAmountChange(-1);
  }

  hide() {
    this.validateDetailEntry();
    this.onAmountChange(-1);
    this.currentIndex = 0;
    this.acType = "";
    this.isActive = false;
    this.onPopUpClose.emit(true);
  }

  validateDetailEntry() {
    for (
      var i = 0;
      i <
      this._trnMainService.TrnMainObj.TrntranList[this.currentIndex]
        .PartyDetails.length;
      i++
    ) {
      let current = this._trnMainService.TrnMainObj.TrntranList[
        this.currentIndex
      ].PartyDetails[i];
      if (
        current.REFVNO == "" ||
        current.AMOUNT <= 0 ||
        current.CLRAMOUNT < 0 ||
        (current.AMOUNT - current.CLRAMOUNT) <= 0
      ) {
        this._trnMainService.TrnMainObj.TrntranList[
          this.currentIndex
        ].PartyDetails.splice(i, 1);
        i--;
      }
    }
  } 

  @HostListener("document : keydown", ["$event"])
  @debounce(20)
  updown($event: KeyboardEvent) {
    if (!this.isActive) return true;
    if ($event.code == "Escape") {
      $event.preventDefault();
      this.hide();
    }
  }
}
