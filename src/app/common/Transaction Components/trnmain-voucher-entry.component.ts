import { Component, ViewChild } from "@angular/core";
import { TSubLedger } from "./../interfaces/TrnMain";
import { PREFIX } from "./../interfaces/Prefix.interface";
import { TAcList } from "./../interfaces/Account.interface";
import { Trntran, VoucherTypeEnum } from "./../interfaces/TrnMain";
import { MasterRepo } from "./../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { TransactionService } from "./transaction.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { IDivision } from "../interfaces/commonInterface.interface";

@Component({
  selector: "trnmain-voucher-entry",
  templateUrl: "./trnmain-voucher-entry.component.html",
  styleUrls: ["../../pages/Style.css"]
})
export class TrnMainVoucherEntryComponent {
  @ViewChild("genericGridACListParty")
  genericGridACListParty: GenericPopUpComponent;
  gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
 
  TrnTranList: Trntran[] = [];
  divisionList: IDivision[] = [];
  voucherType: VoucherTypeEnum = VoucherTypeEnum.PaymentVoucher;
  accountList: TAcList[] = [];
  cashAndBankList: TAcList[] = [];
  Suppliers: TAcList[] = [];
  Customers: TAcList[] = [];
  cashList: TAcList[] = [];
  bankList: TAcList[] = [];
  acList: TAcList[] = [];
  trnaccountList: TAcList[] = [];
  subledgerDropDownList: TSubLedger[] = [];
  prefix: PREFIX = <PREFIX>{};
  // TrnMainForm: FormGroup;
  viewMode = false;
  private subcriptions: Array<Subscription> = [];
  cashAccountSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<
    TAcList[]
  >([]);
  cashAccountObserver$: Observable<
    TAcList[]
  > = this.cashAccountSubject.asObservable();
  accountListSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<
    TAcList[]
  >([]);
  accountListObersver$: Observable<
    TAcList[]
  > = this.accountListSubject.asObservable();

  constructor(
    public masterService: MasterRepo,
    private _transactionService: TransactionService  ) {
    try {
      
      this.voucherType = this._transactionService.TrnMainObj.VoucherType;
      if (this.TrnTranList.length == 0) {
        var nulltt = <Trntran>{};
        nulltt.AccountItem = <TAcList>{};
        nulltt.ROWMODE = "new";
        this.TrnTranList.push(nulltt);
      } 

      this.masterService
        .getAccount("IncomeVoucher")
        .map(data => {
          var fil = data.filter(ac => ac.MAPID == "C" || ac.MAPID == "B");
          return fil;
        })
        .subscribe((res: Array<TAcList>) => {
          this.cashAccountSubject.next(res);
        });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  ngOnInit() {
    try {
      if (this._transactionService.TrnMainObj.Mode == "VIEW") {
        this.viewMode = true;
      }

 
      if (this.voucherType == VoucherTypeEnum.ReceiveVoucher) {
        this._transactionService.TrnMainObj.TRNMODE = "Party Receipt";
        this.VoucherTypeChangeEvent("Party Receipt");
      } else if (this.voucherType == VoucherTypeEnum.PaymentVoucher) {
        this._transactionService.TrnMainObj.TRNMODE = "Party Payment";
        this.VoucherTypeChangeEvent("Party Payment");
      } else {
        this.VoucherTypeChangeEvent("");
      }

      if (this._transactionService.TrnMainObj.Mode == "EDIT" || this._transactionService.TrnMainObj.Mode == "VIEW") {
        this._transactionService.loadDataObservable.subscribe(data => {
          try {
            this.VoucherTypeChangeEvent(data.TRNMODE);
          } catch (e) {
          }
        });
      } else { 
        if (this.voucherType == VoucherTypeEnum.ReceiveVoucher) {
          this._transactionService.TrnMainObj.TRNMODE = "Party Receipt";
          // this.TrnMainForm.patchValue({ TRNMODE: "Party Receipt" });
        } else if (this.voucherType == VoucherTypeEnum.PaymentVoucher) {
          this._transactionService.TrnMainObj.TRNMODE =  "Party Payment";
          // this.TrnMainForm.patchValue({ TRNMODE: "Party Payment" });
        }
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  showAcPartyList() {

    if(!this._transactionService.TrnMainObj.TRNMODE){
      alert("Selet Voucher Type or Party Type");
      return;
    }

    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`;

    if(this._transactionService.TrnMainObj.VoucherType == 12){
      TRNMODE = "ALL"
    }

    this.gridACListPartyPopupSettings = Object.assign(new GenericPopUpSettings,{
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Master/${TRNMODE}`,
      defaultFilterIndex : 1,
      columns: [
        {
          key: "ACID",
          title: "A/C CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACNAME",
          title: "A/C NAME",
          hidden: false,
          noSearch: false
        }
      ]
    });  
    this.genericGridACListParty.show();
  }

  onAcPartySelect(acItem) {
    try {
      if (typeof acItem == "object") {
        var ac = <TAcList>acItem;
        
        this._transactionService.TrnMainObj.TRNAC = ac.ACID;
        this._transactionService.TrnMainObj.TRNACName = ac.ACNAME;
  
        // this.TrnMainForm.patchValue({
        //   TRNAC : ac.ACID,
        //   TRNACName : ac.ACNAME
        // })
        
      } else {
        this._transactionService.TrnMainObj.TRNAC = "";
        this._transactionService.TrnMainObj.TRNACName = "";
      }
    } catch (error) {
      this._transactionService.TrnMainObj.TRNAC = "";
        this._transactionService.TrnMainObj.TRNACName = "";
    }
  }

  preventInput($event){
    $event.preventDefault();
    return false;
  }

  getAccountList(voucherType: string) {
    try {
      if (voucherType == "Party Payment") {
        this.masterService
          .getAccount("IncomeVoucher-account")
          .map(data => {
            var fil = data.filter(
              ac => ac.PType == "V" || ac.PType == "C" || ac.PType == "CC"
            );
            return fil;
          })
          .subscribe((res: Array<TAcList>) => {
            this._transactionService.accountListSubject.next(res);
            console.log({
              partyPayment: res,
              acountsubject: this._transactionService.accountListSubject.getValue()
            });
          });
      } else if (voucherType == "Expenses Voucher") {
        this.masterService
          .getAccount("IncomeVoucher-Expenses")
          .map(data => {
            var fil = data.filter(
              ac => ac.PType != "C" && ac.PType != "V" && ac.PType != "CC"
            );
            return fil;
          })
          .subscribe(res => {
            console.log({ expenses: res });
            this._transactionService.accountListSubject.next(res);
          });
      } else if (voucherType == "Party Receipt") {
        this.masterService
          .getAccount("IncomeVoucher-account")
          .map(data => {
            var fil = data.filter(
              ac => ac.PType == "V" || ac.PType == "CV" || ac.PType == "C"
            );
            return fil;
          })
          .subscribe((res: Array<TAcList>) => {
            this._transactionService.accountListSubject.next(res);
          });
      } else if (voucherType == "Income Voucher") {
        this.masterService
          .getAccount("IncomeVoucher-Expenses")
          .map(data => {
            var fil = data.filter(
              ac => ac.PType != "C" && ac.PType != "V" && ac.PType != "CC"
            );
            return fil;
          })
          .subscribe(res => {
            this._transactionService.accountListSubject.next(res);
          });
      } else {
        this.masterService
          .getAccount("IncomeVoucher-default")
          .subscribe(res => {
            this._transactionService.accountListSubject.next(res);
          });
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
 
  acCodeChange() {
    try {
      // this.TrnMainForm.get("TRNAC").setValue(
      //   this.TrnMainForm.get("TRNAC").value
      // );
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  acNameChange() {
    try {
      // this.TrnMainForm.get("TRNAC").setValue(
      //   this.TrnMainForm.get("TRNAC").value
      // );
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  VoucherTypeChangeEvent(value) {
    try {
      this._transactionService.TrnMainObj.TRNMODE = value; 
      this._transactionService.TrnMainObj.TRNAC = "";
      this._transactionService.TrnMainObj.TRNACName = "";   
      
      // this.getAccountList(value);
      if (value == "Income Voucher") {
        this._transactionService.TableAcHeader = "Particulars";//"Income a/c";
        this.accountList = this.acList;
        this.trnaccountList = this.cashAndBankList;
        this.getAccountList(value);
      } else if (value == "Party Receipt") {
        this._transactionService.TableAcHeader = "Particulars";//"Party/Income a/c";
        this.accountList = this.Suppliers;
        this.trnaccountList = this.cashAndBankList;
      } else if (
        value == "Bank Withdraw Voucher" ||
        value == "Bank Deposit Voucher"
      ) {
        this._transactionService.TableAcHeader = "Particulars";//"Bank a/c";
        this.accountList = this.bankList;
        this.trnaccountList = this.cashList;
      } else if (value == "Cheque Encash") {
        this._transactionService.TableAcHeader = "Particulars";//"Cheque a/c";
        this.accountList = this.acList;
        this.trnaccountList = this.cashList;
      } else if (value == "Expenses Voucher") {
        this._transactionService.TableAcHeader = "Particulars";//"Expenses a/c";
        this.accountList = this.acList;
        this.trnaccountList = this.cashAndBankList;
      } else if (value == "Party Payment") {
        this._transactionService.TableAcHeader = "Particulars";//"Party Expenses a/c";
        this.accountList = this.Suppliers;
        this.trnaccountList = this.cashAndBankList;
      } else if (value == "Cash Transfer") {
        this._transactionService.TableAcHeader = "Particulars";//"Transfer To";
        this.accountList = this.cashAndBankList;
        this.trnaccountList = this.cashAndBankList;
      } else if (value == "Customer") {
        this._transactionService.TableAcHeader = "Particulars";//"Description";
        this.accountList = this.acList;
        this.trnaccountList = this.Customers;
      } else if (value == "Supplier") {
        this._transactionService.TableAcHeader = "Particulars";//"Description";
        this.accountList = this.acList;
        this.trnaccountList = this.Suppliers;
      } else {
        this._transactionService.TableAcHeader = "Particulars";//"Description";
      }
    } catch (ex) {
      alert(ex);
    }
  } 

  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      alert(ex);
    }
  }
}
