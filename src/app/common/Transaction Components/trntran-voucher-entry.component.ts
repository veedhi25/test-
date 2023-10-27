import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Renderer,
  ElementRef
} from "@angular/core";
import { PREFIX } from "./../interfaces/Prefix.interface";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  TrnMain,
  TrnProd,
  Trntran,
  TSubLedger,
  TSubLedgerTran,
  CostCenter,
  VoucherTypeEnum
} from "./../interfaces/TrnMain";
import { TAcList } from "./../interfaces/Account.interface";
import { MasterRepo } from "./../repositories/masterRepo.service";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { TransactionService } from "./transaction.service";
import { SettingService } from "./../services/setting.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { Subscription } from "rxjs";
import { PartyOpeningDetailsPopUpComponent } from "../popupLists/party-opening-details-popup/party-opening-details-popup.component";

@Component({
  selector: "trntran-voucher-entry",
  templateUrl: "./trntran-voucher-entry.component.html",
  providers: [],
  styles: [
    `
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
      }

      input,
      select,
      textarea {
        border: 1px solid #cbcbcb;
        border-radius: 3px;
        height: 23px;
        color: black;
      }

      tr td {
        border-top: 0px;
        border-bottom: 0px;
        line-height: 31px;
        padding: 0px 2px;
      }
      tr th {
        line-height: 31px;
        padding: 0px;
        padding-left: 4px;
        padding-right: 4px;
      }
      tbody {
        border-top: 0px;
      }
      tbody:hover {
        background-color: #e0e0e0;
      }
      tr {
        padding-left: 4px;
        padding-right: 4px;
      }
    `
  ]
})
export class TrnTranVoucherEntryComponent {
  @ViewChild("genericGridACList") genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridCostCenterList")
  genericGridCostCenterList: GenericPopUpComponent;
  gridCostCenterListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("partyOpeningDetailsPopup") partyOpeningDetailsPopup: PartyOpeningDetailsPopUpComponent;

  selectedtrntranRowIndex: number;
  hideSubledger: boolean = true;
  //TrnMainObj: TrnMain = <TrnMain>{};
  trnaccountList: Observable<TAcList[]>;
  subledgers: TSubLedgerTran[] = [];
  subledgerDropDownList: TSubLedger[] = [];
  costCenterList: CostCenter[] = [];
  subLedgerTotal: number = 0;
  trntranTotal: number = 0;
  voucherType: VoucherTypeEnum;
  viewMode = false;
  showHelp = true;
  hideSubledgerList = true;
  private showWholeSubLedger = true;
  addFocus = false;
  @ViewChild("myInput") input: ElementRef;
  TranForm: FormGroup;

  private subcriptions: Array<Subscription> = [];
  constructor(
    public masterService: MasterRepo,
    private _transactionService: TransactionService,
    private settingService: SettingService,
    private router: Router,
    private arouter: ActivatedRoute,
    private fb: FormBuilder,
    private renderer: Renderer,
    private alertService: AlertService,
    private loadingSerive: SpinnerService
  ) {
    try {
      //this.masterService.refreshTransactionList();
      this.showWholeSubLedger = this.settingService.appSetting.enableSubLedger;
      //this.TrnMainObj = this._transactionService.TrnMainObj;
      this.voucherType = this._transactionService.TrnMainObj.VoucherType;
      this.trnaccountList = this._transactionService.accountListObersver$;
      // if (!this.TrnMainObj.TrntranList || this.TrnMainObj.TrntranList.length == 0) {
      //     this._transactionService.addRowForTransaction(0);
      // }
  
      this.gridCostCenterListPopupSettings = Object.assign(new GenericPopUpSettings,{
        title: "Cost Centers",
        apiEndpoints: `/getCostCenterPagedList`,
        defaultFilterIndex : 0,
        columns: [
          {
            key: "CostCenterName",
            title: "Cost Center Name",
            hidden: false,
            noSearch: false
          }
        ]
      });

      this.addFocus = true;
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  ngOnInit() {
    try {
      this.masterService.getSubLedgerList().subscribe(
        res => {
          this.subledgerDropDownList = res;
        },
        error => {
          this.masterService.resolveError(
            error,
            "AddIncomeVoucher - getSubLedgerList"
          );
        }
      );

      if (this._transactionService.TrnMainObj.Mode == "VIEW") {
        this.viewMode = true;
      }

      if (
        this._transactionService.TrnMainObj.Mode == "EDIT" ||
        this._transactionService.TrnMainObj.Mode == "VIEW"
      ) {
        this._transactionService.loadDataObservable.subscribe(data => {
          try {
            this._transactionService.TrnMainObj.TrntranList = data.TrntranList;
            this._transactionService.TrnMainObj.TrntranList.forEach(t => {
              t.ROWMODE = "save";
              t.AccountItem = this.masterService.accountList.filter(
                y => y.ACID == t.A_ACID
              )[0];
              t.acitem = t.AccountItem;
              this.LoadSubledgerForTran(t);
              console.log({ trntranlist: t });
            });
            if (this.viewMode == false) {
              var nulltt = <Trntran>{};
              nulltt.AccountItem = <TAcList>{};
              nulltt.ROWMODE = "new";
              this._transactionService.TrnMainObj.TrntranList.push(nulltt);
            }
          } catch (e) {
            console.log({ errorOnLoad: e });
          }
        });
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  hideDetail() {
    this.masterService.ShowMore = false;
  }

  selectedIndex: number = 0;
  setSelectedRow(index) {
    this.selectedIndex = index;
  }

  showAcList(i) {
    this.selectedIndex = i;  
    var TRNMODE = `${this._transactionService.TrnMainObj.TRNMODE}`; 
    if(this._transactionService.TrnMainObj.VoucherType == 12){
      TRNMODE = "ALL"
    }

    if(this._transactionService.TrnMainObj.VoucherType == 62){
      TRNMODE = "CONTRA"
    }
    else if(this._transactionService.TrnMainObj.VoucherType == 23)
    {
      TRNMODE = "PartyOpeningBalance"
    }
    else if(this._transactionService.TrnMainObj.VoucherType == 22)
    {
      TRNMODE = "AccountOpeningBalance"
    }

    this.gridACListPopupSettings = Object.assign(new GenericPopUpSettings,{
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Details/${TRNMODE}`,      
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

    this.genericGridACList.show();
  }

  focusNext(colindex, rowIndex, event = null) {

    if(event && event != null && event != undefined) event.preventDefault();
    
    let selectorName = "";
    switch(colindex) { 
        case 0: { 
            selectorName = `ACCODEInput_${rowIndex}`
            break; 
        } 
        case 1: { 
            selectorName = (this.voucherType == VoucherTypeEnum.Journal 
                            ||this.voucherType == VoucherTypeEnum.ContraVoucher 
                            || this.voucherType == VoucherTypeEnum.PaymentVoucher
                            ||this.voucherType == VoucherTypeEnum.PartyOpeningBalance 
                            ||this.voucherType == VoucherTypeEnum.AccountOpeningBalance 
                            || this.voucherType == VoucherTypeEnum.CreditNote )
                                            ? `DrAmtInput_${rowIndex}` 
                                            : `CrAmtInput_${rowIndex}`;
            break;   
        } 
        case 2: { 
            selectorName = this._transactionService.TrnMainObj.TrntranList[rowIndex].DRAMNT != 0 
            ?  this._transactionService.AppSettings.enableCostCenter==1 ? `CostCenterInput_${rowIndex}` :`narration_${rowIndex}`
            : `CrAmtInput_${rowIndex}`
            break;   
        } 
        case 3: {  
            selectorName = this._transactionService.AppSettings.enableCostCenter==1 ? `CostCenterInput_${rowIndex}` : `narration_${rowIndex}`; 
            break;   
        } 
        case 4: { 
            selectorName = `narration_${rowIndex}`
            break;   
        } 
        case 5: { 
          selectorName = `ChequeNo_${rowIndex}`
          break;   
        }  
        case 6: { 
          selectorName = `ChequeDate_${rowIndex}`
          break;   
        }
        default: { 
            selectorName = `ACCODEInput_${rowIndex}`
            break;  
        } 
     }  
     
    let element =  document.getElementById(`${selectorName}`); 
    
    
    if (element)
    {
        setTimeout(function(){
            (<HTMLInputElement>element).focus();
            (<HTMLInputElement>element).select();
        }, 100) 
    } 
  }

  onAcSelect(acItem) {
    try {
      if (typeof acItem == "object") {
        var ac = <TAcList>acItem;
        this._transactionService.TrnMainObj.TrntranList[
          this.selectedIndex
        ].AccountItem = acItem;
        this._transactionService.TrnMainObj.TrntranList[
          this.selectedIndex
        ].AccountItem.ACCODE = ac.ACCODE;
        this._transactionService.TrnMainObj.TrntranList[
          this.selectedIndex
        ].acitem = ac;
        this.trnAccountChange(ac.HASSUBLEDGER, this.selectedIndex);
        this.focusNext(1, this.selectedIndex);

        this.getAccountWiseTrnAmount(ac)

      } else {
        this._transactionService.TrnMainObj.TrntranList[
          this.selectedIndex
        ].AccountItem.ACCODE = "";
        this.focusNext(0, this.selectedIndex);
      }
    } catch (error) {
      this._transactionService.TrnMainObj.TrntranList[
        this.selectedIndex
      ].AccountItem.ACCODE = "";
      this.focusNext(0, this.selectedIndex);
    }
  }

  getAccountWiseTrnAmount(ac : TAcList){
    this._transactionService.getAccountWiseTrnAmount(ac.ACID);
  }

  onAcRowFocus(index : number){
    let account = this._transactionService.TrnMainObj.TrntranList[index].AccountItem;

    if(account && account != null && account != undefined) {
      this.getAccountWiseTrnAmount(account)
    }; 
  }

  showCostCenterList(i) {
    this.selectedIndex = i;
    this.genericGridCostCenterList.show();
  }

  onCostCenterSelect(costCenter) {
    this._transactionService.TrnMainObj.TrntranList[
      this.selectedIndex
    ].CostCenter = costCenter.CostCenterName;
    this.focusNext(4, this.selectedIndex);
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }

  LoadSubledgerForTran(t: Trntran) {
    try {
      if (
        t.AccountItem != null &&
        (t.AccountItem && t.AccountItem.HASSUBLEDGER == 1)
      ) {
        t.SubledgerTranList.forEach(z => {
          (z.ROWMODE = "save"),
            (z.SubledgerItem = this.subledgerDropDownList.filter(
              w => w.ACID == z.A_ACID
            )[0]);
        });
        if (this.viewMode == false) {
          this.addTrnTranRow();
        }
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  accountListObservable$ = (keyword: any): Observable<TAcList[]> => {
    try {
      return new Observable((observer: Subscriber<TAcList[]>) => {
        if (keyword) {
          this.trnaccountList
            .map(data => {
              console.log({ accountlistobservable: "before toupper" });
              var lst = data.filter(
                ac =>
                  ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1
              );
              console.log({ keyword: keyword, filter: lst, data: data });
              return lst;
            })
            .subscribe(res => {
              console.log({
                keyword: keyword,
                filterSubscribe: res,
                data: res
              });
              observer.next(res);
            });
        } else {
          observer.next([]);
          console.log({ keyword: keyword, filter: "empty" });
        }
      });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  };

  AddNewSubLedgerRow() {
    try {
      var nullsl = <TSubLedgerTran>{};
      nullsl.SubledgerItem = <TSubLedger>{};
      nullsl.ROWMODE = "new";
      this.subledgers.push(nullsl);
      /*
            var fGroup= this.fb.group({
                accode:new FormControl(''),
                acname:new FormControl(''),
                dramnt:new FormControl(0),
                cramnt:new FormControl(0),
                remarks:new FormControl(''),
                acItem:new FormControl(''),
            })
            */
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  TrnTranRowOk($event, index) {
    try {
      this.addFocus = true;
      if(event && event != null && event != undefined) $event.preventDefault();
      this._transactionService.addRowForTransaction(index);
      setTimeout(() => {
        this.focusNext(0, index+1);
      }, 100) 
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  SubLedgerRowOk(index) {
    try {
      var rm = this.subledgers[index].ROWMODE;
      if (rm == "new") {
        this.subledgers[index].ROWMODE = "save";
        this.AddNewSubLedgerRow();
      } else if (rm == "edit") {
        this.subledgers[index].ROWMODE = "save";
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  removeRow(index) {
    try {
      console.log("index: " + index);
      if (
        this._transactionService.TrnMainObj.TrntranList[index].inputMode ==
          true &&
        this._transactionService.TrnMainObj.TrntranList[index].editMode == false
      ) {
        this._transactionService.TrnMainObj.TrntranList[index] = <Trntran>{};
        this._transactionService.TrnMainObj.TrntranList[index].AccountItem = <
          TAcList
        >{};
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].SubledgerTranList = [];
        //this.showSubLedger = false;
        this.showHelp = true;
        this._transactionService.TrnMainObj.TrntranList[index].inputMode = true;
        this._transactionService.TrnMainObj.TrntranList[index].editMode = false;
        this._transactionService.TrnMainObj.TrntranList[index].drBGColor = "";
        this._transactionService.TrnMainObj.TrntranList[index].drColor = "";
        this._transactionService.TrnMainObj.TrntranList[index].crBGColor = "";
        this._transactionService.TrnMainObj.TrntranList[index].crColor = "";
        this._transactionService.TrnMainObj.TrntranList[index].hasDebit = true;
        this._transactionService.TrnMainObj.TrntranList[index].hasCredit = true;
        // this.changeCredit(null, index);
        // this.changeDebit(null, index);
      } else {
        this._transactionService.TrnMainObj.TrntranList.splice(index, 1);
        //this.hasAddBtn = false;
        this._transactionService.TrnMainObj.TrntranList[index].DRAMNT = null;
        this._transactionService.TrnMainObj.TrntranList[index].CRAMNT = null;

        // this.showSubLedger = false;
        this.showHelp = true;

        //this.changeCredit(null, index);
        //this.changeDebit(null, index);
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  clearRow($event, index) {
    try {
      $event.preventDefault();
      this._transactionService.deleteAccountTrnRow(index);
      this.TrnTranCrAmtChange(0);
      this.TrnTranDrAmtChange(0);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  clearSubLedgerRow(index) {
    try {
      var rm = this.subledgers[index].ROWMODE;
      if (rm == "new") {
        this.subledgers[index] = <TSubLedgerTran>{};
        this.subledgers[index].SubledgerItem = <TSubLedger>{};
        this.subledgers[index].ROWMODE = "new";
      } else if (rm == "save" || rm == "edit") {
        this.subledgers.splice(index, 1);
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  editRow(index) {
    try {
      if (
        this._transactionService.TrnMainObj.TrntranList[index].ROWMODE == "save"
      ) {
        this._transactionService.TrnMainObj.TrntranList[index].ROWMODE = "edit";
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  editSubledgerRow(index) {
    try {
      if (this.subledgers[index].ROWMODE == "save") {
        this.subledgers[index].ROWMODE = "edit";
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  trnAccountChange(hasSubLedger, index) {
    try {
      this.selectedtrntranRowIndex = index;
      this._transactionService.TrnMainObj.TrntranList[index].CRAMNT = 0;
      this._transactionService.TrnMainObj.TrntranList[index].DRAMNT = 0;
      if (hasSubLedger == 1) {
        this.showSubLedgerEntry(index);
        if (
          this.voucherType == VoucherTypeEnum.PaymentVoucher ||
          this.voucherType == VoucherTypeEnum.CreditNote
        ) {
          this.subLedgerCrAmtChanges();
        } else if (
          this.voucherType == VoucherTypeEnum.ReceiveVoucher ||
          this.voucherType == VoucherTypeEnum.DebitNote
        ) {
          this.subLedgerDrAmtChanges();
        }
      } else {
        this.hideSubLedgerEntry(index);
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  hideSubLedgerEntry(index) {
    try {
      this.hideSubledger = true;
      this.subledgers = [];
      if (
        this._transactionService.TrnMainObj.TrntranList[index].ROWMODE == "new"
      ) {
        this.showHelp = true;
        this.hideSubledgerList = true;
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  showSubLedgerEntry(index) {
    try {
      if (
        this._transactionService.TrnMainObj.TrntranList[index]
          .SubledgerTranList == null
      ) {
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].SubledgerTranList = [];
      }
      if (
        this._transactionService.TrnMainObj.TrntranList[index].SubledgerTranList
          .length == 0
      ) {
        this.AddNewSubLedgerRow();
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].SubledgerTranList = this.subledgers;
      }
      this.subledgers = this._transactionService.TrnMainObj.TrntranList[
        index
      ].SubledgerTranList;
      for (var i in this.subledgers) {
        if (
          this.subledgers[i].SubledgerItem != null &&
          this.subledgers[i].SubledgerItem.ACNAME != null &&
          this.subledgers[i].Amount != null &&
          this.subledgers[i].Amount > 0
        ) {
          this.subledgers[i].ROWMODE = "save";
        }
      }
      this.hideSubledger = false;
      this.hideSubledgerList = true;
      this.showHelp = false;
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  rowClick(i) {
    try {
      this.showHelp = false;
      this.hideSubledgerList = false;
      this.selectedtrntranRowIndex = i;
      if (
        this._transactionService.TrnMainObj.TrntranList[i].AccountItem == null
      ) {
        console.log("return");
        return;
      }
      if (
        this._transactionService.TrnMainObj.TrntranList[i].AccountItem &&
        this._transactionService.TrnMainObj.TrntranList[i].AccountItem
          .HASSUBLEDGER == 1
      ) {
        this.showSubLedgerEntry(i);
        if (
          this.voucherType == VoucherTypeEnum.PaymentVoucher ||
          this.voucherType == VoucherTypeEnum.CreditNote
        ) {
          this.subLedgerCrAmtChanges();
        } else if (
          this.voucherType == VoucherTypeEnum.ReceiveVoucher ||
          this.voucherType == VoucherTypeEnum.DebitNote
        ) {
          this.subLedgerDrAmtChanges();
        }
      } else {
        this.hideSubLedgerEntry(i);
      }

      // if(this._transactionService.TrnMainObj.TrntranList[i].ROWMODE == "new"){
      //     this.showHelp = true;
      //     this.hideSubledgerList = true;
      // }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  addTrnTranRow() {}

  subLedgerDrAmtChanges() {
    try {
      this.subLedgerTotal = 0;
      this.subledgers.forEach(x => {
        this.subLedgerTotal += x.DRAMNT == null ? 0 : x.DRAMNT;
      });
      this._transactionService.TrnMainObj.TrntranList[
        this.selectedtrntranRowIndex
      ].CRAMNT = this.subLedgerTotal;
      this.TrnTranCrAmtChange(null);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  subLedgerCrAmtChanges() {
    try {
      this.subLedgerTotal = 0;
      this.subledgers.forEach(x => {
        this.subLedgerTotal += x.CRAMNT == null ? 0 : x.CRAMNT;
      });
      this._transactionService.TrnMainObj.TrntranList[
        this.selectedtrntranRowIndex
      ].DRAMNT = this.subLedgerTotal;
      this.TrnTranDrAmtChange(null);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  drTotal = 0;
  crTotal = 0;
  TrnTranDrAmtChange(value) {
    try {
      this.trntranTotal = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(x => {
        this.trntranTotal += this.masterService.nullToZeroConverter(x.DRAMNT) == null ? 0 : this.masterService.nullToZeroConverter(x.DRAMNT);
      });
      this._transactionService.trntranTotal = this.trntranTotal;
      this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
      this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
      this._transactionService.calculateDrCrDifferences();
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  TrnTranCrAmtChange(value) {
    try {
      this.trntranTotal = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(x => {
        this.trntranTotal += this.masterService.nullToZeroConverter(x.CRAMNT) == null ? 0 : this.masterService.nullToZeroConverter(x.CRAMNT);
      });
      this._transactionService.trntranTotal = this.trntranTotal;
      this._transactionService.TrnMainObj.NETAMNT = this.trntranTotal;
      this._transactionService.TrnMainObj.TOTAMNT = this.trntranTotal;
      this._transactionService.calculateDrCrDifferences();
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  AutoSelectAcnameChange($event, index) {
    try {
      if (typeof $event == "object") {
        var ac = <TAcList>$event;
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].AccountItem = $event;
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].AccountItem.ACCODE = ac.ACCODE;
        // if (ac.HASSUBLEDGER == 1) {
        //     this.showSubLedgerEntry(index);
        // } else {
        //     this.hideSubLedgerEntry(index);
        //     this._transactionService.TrnMainObj.TrntranList[index].SubledgerTranList = [];
        // }
      } else {
        this._transactionService.TrnMainObj.TrntranList[
          index
        ].AccountItem.ACCODE = "";
      }
    } catch (error) {
      this._transactionService.TrnMainObj.TrntranList[
        index
      ].AccountItem.ACCODE = "";
    }
  }

  checkDifference() {
    try {
      let diffAmount: number = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(tran => {
        diffAmount =
          diffAmount +
          ((tran.DRAMNT == null ? 0 : tran.DRAMNT) -
            (tran.CRAMNT == null ? 0 : tran.CRAMNT));
      });
      this._transactionService.differenceAmount = Math.abs(diffAmount);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  debitTotal() {
    try {
      let debitAmount: number = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(tran => {
        debitAmount = debitAmount + (tran.DRAMNT == null ? 0 : tran.DRAMNT);
      });
      this.drTotal = debitAmount;
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  creditTotal() {
    try {
      let creditAmount: number = 0;
      this._transactionService.TrnMainObj.TrntranList.forEach(tran => {
        creditAmount = creditAmount + (tran.CRAMNT == null ? 0 : tran.CRAMNT);
      });
      this.crTotal = creditAmount;
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  changeSubDebit(value, index) {
    try {
      this.subDebitTotal();
      this.creditTotal();
      this.checkDifference();
      // this.hasLedgerAddBtn = true;
      // if (value == null) {
      //     this.hasLedgerAddBtn = true;
      // } else if (this.subLedgerList[index].SubledgerItem == null || this.subLedgerList[index].SubledgerItem.ACID == null || this.subLedgerList[index].DRAMNT <= 0) {
      //     this.hasLedgerAddBtn = false;
      // }
      // if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
      //     this._trnMainService.saveDisable  = false;
      // } else {
      //     this._trnMainService.saveDisable  = true;
      // }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  changeSubCredit(value, index) {
    try {
      this.subCreditTotal();
      this.debitTotal();
      this.checkDifference();
      // this.hasLedgerAddBtn = true;
      // if (value == null) {
      //     this.hasLedgerAddBtn = true;
      // } else if (this.subLedgerList[index].SubledgerItem == null || this.subLedgerList[index].SubledgerItem.ACID == null || this.subLedgerList[index].CRAMNT <= 0) {
      //     this.hasLedgerAddBtn = false;
      // }
      // if ((this.drTotal == this.crTotal) && this.drTotal != 0 && this.crTotal != 0) {
      //     this._trnMainService.saveDisable  = false;
      // } else {
      //     this._trnMainService.saveDisable  = true;
      // }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  subDebitTotal() {
    try {
      let debitAmount: number = 0;
      // this.trnMain.TrntranList[this.changeIndex].SubledgerTranList.forEach(sub => {
      //     debitAmount = debitAmount + ((sub.DRAMNT == null) ? 0 : sub.DRAMNT)
      // })
      // this.trnMain.TrntranList[this.changeIndex].CRAMNT = debitAmount;
      // this.subDrTotal = debitAmount;
      // if (this.trnMain.TrntranList[this.changeIndex].AccountItem != null && this.trnMain.TrntranList[this.changeIndex].CRAMNT > 0) {
      //     this.hasAddBtn = true;
      // } else {
      //     this.hasAddBtn = false;
      // }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  subCreditTotal() {
    try {
      let creditAmount: number = 0;
      // this.trnMain.TrntranList[this.changeIndex].SubledgerTranList.forEach(sub => {
      //     creditAmount = creditAmount + ((sub.CRAMNT == null) ? 0 : sub.CRAMNT)
      // })
      // this.subCrTotal = creditAmount;
      // this.trnMain.TrntranList[this.changeIndex].DRAMNT = creditAmount;
      // if (this.trnMain.TrntranList[this.changeIndex].AccountItem != null && this.trnMain.TrntranList[this.changeIndex].DRAMNT > 0) {
      //     this.hasAddBtn = true;
      // } else {
      //     this.hasAddBtn = false;
      // }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  showPartyOpeningDetails(index : number, acCase : string){
    //validate

    if(this._transactionService.TrnMainObj.VoucherType != 23) return;

    var currentTrnTranObj = this._transactionService.TrnMainObj.TrntranList[index];

    if(currentTrnTranObj.AccountItem.PType == "C" && acCase == 'drAmt'){
      //alert error
      this.alertService.warning("Party Opening details is not valid for Dr Amount with selected A/C");
      return;
    }

    if(currentTrnTranObj.AccountItem.PType == "V" && acCase == 'crAmt'){
      //alert error
      this.alertService.warning("Party Opening details is not valid for Cr Amount with selected A/C");
      return;
    }

    //show popup
    this.partyOpeningDetailsPopup.show(index, acCase);
  }

  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
}
