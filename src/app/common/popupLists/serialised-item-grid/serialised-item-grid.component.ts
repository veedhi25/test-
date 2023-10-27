import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { SerialItem, TrnProd } from "../../interfaces/TrnMain";
import { MasterRepo } from "../../repositories";
import { AlertService } from "../../services/alert/alert.service";
import { TransactionService } from "../../Transaction Components/transaction.service";

@Component({
  selector: "serialised-item-grid",
  templateUrl: "./serialised-item-grid.component.html",
  styleUrls: ['./serialised-item-grid.scss']
})
export class SerializedItemGridComponent {
  public isActive: boolean = false;
  public itemDetails: TrnProd = <TrnProd>{};
  public serialisedItem: any = <any>{};
  activeRowIndex: number;
  SELECTEDINDEX: number = 0;
  @Output() onApplyClicked = new EventEmitter();
  constructor(private alertService: AlertService, private transactionService: TransactionService, @Inject(DOCUMENT) private document: Document, private masterService: MasterRepo) {

  }






  show(activerowIndex: number) {
    this.isActive = true;
    this.activeRowIndex = activerowIndex;
    this.serialisedItem = <any>{};
    this.itemDetails = this.transactionService.TrnMainObj.ProdList[activerowIndex];
    if (this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList == undefined || this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList == null || this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList.length == 0) {
      this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList = [];
    }

    setTimeout(() => {
      this.document.getElementById("serial1").focus();
    }, 10);
  }


  hide() {
    this.isActive = false;
    this.serialisedItem = <any>{};
    this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList = [];

  }


  disableSerialNumber(serialnumber: number) {
    if (serialnumber <= this.itemDetails.NOOFSERIALITEMHAS) {
      return false;
    }
    return true;
  }





  validateSerialNumber = () => {
    if (this.disableSerialNumber(1) == false && this.serialisedItem.HAVINGPREFIX && (this.serialisedItem.PREFIX1 == null || this.serialisedItem.PREFIX1 == "" || this.serialisedItem.PREFIX1 == undefined)) {
      this.alertService.error("PREFIX1 is invalid");
      this.document.getElementById("PREFIX1").focus();
      return;
    }
    if (this.serialisedItem.SERIAL1 == null || this.serialisedItem.SERIAL1 == undefined || this.serialisedItem.SERIAL1 == "") {
      this.alertService.error("Please select a valid Serial No 1");
      return;
    }

    if (this.disableSerialNumber(2) == false && this.serialisedItem.HAVINGPREFIX && (this.serialisedItem.PREFIX2 == null || this.serialisedItem.PREFIX2 == "" || this.serialisedItem.PREFIX2 == undefined)) {
      this.alertService.error("PREFIX2 is invalid");
      this.document.getElementById("PREFIX2").focus();
      return;
    }
    if (this.disableSerialNumber(2) == false && this.masterService.nullToZeroConverter(this.serialisedItem.SERIAL2) <= 0) {
      this.alertService.error("Serial No 2 is invalid");
      this.document.getElementById("serial2").focus();
      return;
    }



    if (this.disableSerialNumber(3) == false && this.serialisedItem.HAVINGPREFIX && (this.serialisedItem.PREFIX3 == null || this.serialisedItem.PREFIX3 == "" || this.serialisedItem.PREFIX3 == undefined)) {
      this.alertService.error("PREFIX3 is invalid");
      this.document.getElementById("PREFIX3").focus();
      return;
    }
    if (this.disableSerialNumber(3) == false && this.masterService.nullToZeroConverter(this.serialisedItem.SERIAL3) <= 0) {
      this.alertService.error("Serial No 3 is invalid");
      this.document.getElementById("serial3").focus();
      return;
    }

    if (this.disableSerialNumber(4) == false && this.serialisedItem.HAVINGPREFIX && (this.serialisedItem.PREFIX4 == null || this.serialisedItem.PREFIX4 == "" || this.serialisedItem.PREFIX4 == undefined)) {
      this.alertService.error("PREFIX4 is invalid");
      this.document.getElementById("PREFIX4").focus();
      return;
    }

    if (this.disableSerialNumber(4) == false && this.masterService.nullToZeroConverter(this.serialisedItem.SERIAL4) <= 0) {
      this.alertService.error("Serial No 4 is invalid");
      this.document.getElementById("serial4").focus();
      return;
    }


    if (this.disableSerialNumber(5) == false && this.serialisedItem.HAVINGPREFIX && (this.serialisedItem.PREFIX5 == null || this.serialisedItem.PREFIX5 == "" || this.serialisedItem.PREFIX5 == undefined)) {
      this.alertService.error("PREFIX5 is invalid");
      this.document.getElementById("PREFIX5").focus();
      return;
    }
    if (this.disableSerialNumber(5) == false && this.masterService.nullToZeroConverter(this.serialisedItem.SERIAL5) <= 0) {
      this.alertService.error("Serial No 5 is invalid");
      this.document.getElementById("serial5").focus();

      return;
    }

    this.masterService.masterGetmethod_NEW(`/validateSerialNumber/${this.itemDetails.MCODE}/${this.serialisedItem.PREFIX1 ? this.serialisedItem.PREFIX1 + this.serialisedItem.SERIAL1 : this.serialisedItem.SERIAL1}`).subscribe((res) => {
      if (res.status == "ok") {

        if (!this.serialisedItem.AUTOGENERATE) {
          let doesSerialExist = this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList.filter(x => x.SERIAL1 == this.serialisedItem.SERIAL1);
          if (doesSerialExist.length > 0) {
            this.alertService.error("Serial No1 already Exists.");
            return;
          }
          this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList.push({
            SERIAL1: this.serialisedItem.SERIAL1,
            SERIAL2: this.serialisedItem.SERIAL2,
            SERIAL3: this.serialisedItem.SERIAL3,
            SERIAL4: this.serialisedItem.SERIAL4,
            SERIAL5: this.serialisedItem.SERIAL5
          });
          this.serialisedItem = <any>{};
          this.document.getElementById("serial1").focus();

        } else if (this.serialisedItem.AUTOGENERATE) {
          if (this.masterService.nullToZeroConverter(this.serialisedItem.ITEMCOUNT) <= 0) {
            this.alertService.error("Please provide valid Item Count");
            return;
          }

          let doesSerialExist = this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList.filter(x => x.SERIAL1 == this.serialisedItem.SERIAL1);
          if (doesSerialExist.length > 0) {
            this.alertService.error("Serial No1 already Exists.");
            return;
          }
          for (let i = 0; i < this.serialisedItem.ITEMCOUNT; i++) {
            this.transactionService.TrnMainObj.ProdList[this.activeRowIndex].serialItemList.push({
              SERIAL1: this.getNextSerialNUmber(this.serialisedItem.SERIAL1, i, this.serialisedItem.PREFIX1),
              SERIAL2: this.getNextSerialNUmber(this.serialisedItem.SERIAL2, i, this.serialisedItem.PREFIX2),
              SERIAL3: this.getNextSerialNUmber(this.serialisedItem.SERIAL3, i, this.serialisedItem.PREFIX3),
              SERIAL4: this.getNextSerialNUmber(this.serialisedItem.SERIAL4, i, this.serialisedItem.PREFIX4),
              SERIAL5: this.getNextSerialNUmber(this.serialisedItem.SERIAL5, i, this.serialisedItem.PREFIX5)
            });
          }
          this.serialisedItem = <any>{};
          this.document.getElementById("serial1").focus();
        }
      } else {


        this.alertService.error(res.result)
      }
    }, error => {
      let err = JSON.parse(error._body);
      this.alertService.error(err.result);
    })
  }



  getNextSerialNUmber(serialNumber: any, incrementor: number, prefix: string) {
    if (!prefix) prefix = '';
    return isNaN(serialNumber) ? ((this.serialisedItem.HAVINGPREFIX ? prefix : '') + (this.masterService.nullToZeroConverter(serialNumber) + (this.masterService.nullToZeroConverter(serialNumber) + incrementor))) : ((this.serialisedItem.HAVINGPREFIX ? prefix : '') + (this.masterService.nullToZeroConverter(serialNumber) + this.masterService.nullToZeroConverter(incrementor)));
  }

  applyclicked() {
    this.onApplyClicked.emit({ activeRowIndex: this.activeRowIndex });
    this.isActive = false;
    this.serialisedItem = <any>{};
  }
 SerialInputEnterkeyEvent(serialvalue)
 {
   if(serialvalue==this.itemDetails.NOOFSERIALITEMHAS)
   {
     this.validateSerialNumber();
   }
  
 }


}
