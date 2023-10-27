import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";

import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { AlertService } from '../../../../common/services/alert/alert.service';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import * as moment from 'moment'
import { ActivatedRoute } from '@angular/router';
import { UserWiseTransactionFormConfigurationComponent } from '../../../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.component';
import { VoucherTypeEnum } from '../../../../common/interfaces/TrnMain';

@Component({
  selector: "creditnote-itembase",
  templateUrl: "./creditnote-itembase.component.html",
  providers: [TransactionService]
})

export class CreditNoteItemBaseComponent {
  @ViewChild("userwisetransactionformconfig") userwisetransactionformconfig: UserWiseTransactionFormConfigurationComponent;

  gridcancelSalesPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericSalesReturnCancle") genericSalesReturnCancle: GenericPopUpComponent;
  gridFromDebitNotePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericFromDebitNote") genericFromDebitNote: GenericPopUpComponent;


  constructor(public loadingService: SpinnerService, public masterService: MasterRepo, public _trnMainService: TransactionService, public alertService: AlertService, private route: ActivatedRoute) {
    this._trnMainService.formName = "Sales Return"; 
    this._trnMainService.initialFormLoad(15);
    this._trnMainService.pageHeading = "Sales Return";
    this._trnMainService.TrnMainObj.VoucherPrefix = "CN";
    this._trnMainService.TrnMainObj.VoucherType = 15;
    this.gridcancelSalesPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Sales Return Cancel",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'VCHRNO',
          title: 'PONO.',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TRNDATE',
          title: 'DATE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'NETAMNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false
        }
      ]
    });
    this.gridFromDebitNotePopupSettings = {
      title: "Purchase Return List",
      apiEndpoints: `/getFitIndiaPurchaseReturn`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'VCHRNO',
          title: 'Voucher No',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TRNDATE',
          title: 'DATE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'NETAMOUNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false
        },
        {
          key: 'FROMCOMPANY',
          title: 'FROMCOMPANY',
          hidden: true,
          noSearch: true
        }
      ]
    };
    this.route.queryParams.subscribe(params => {
      if (params.voucher) {
          let voucherNo = params.voucher;
          let event = {
              VCHRNO: voucherNo,
              DIVISION: this.masterService.userProfile.userDivision,
              PHISCALID: this.masterService.userProfile.PhiscalYearInfo.PhiscalID,
              FROMCOMPANY:params.FROMCOMPANY,
              TYPE:params.TYPE
          }
          this.onFomDebitNoteClicked(event);
      }
  });
  }

  ngOnInit() { }


  genericSalesReturnCanclePopup() {
    this.genericSalesReturnCancle.show("", false, "SALESRETURNCANCEL")

  }

  onSalesReturnCancelSelect(event) {
    // this._trnMainService.loadData(event.VCHRNO,event.DIVISION,event.PhiscalId);
    this.loadingService.show("Getting Details, Please Wait...");
    this.masterService.LoadTransaction(event.VCHRNO, event.DIVISION, event.PhiscalID).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status == "ok") {
          this._trnMainService.TrnMainObj = data.result;
          this._trnMainService.TrnMainObj.REFBILLDATE = moment(data.result.TRNDATE).format("DD/MM/YYYY");
          if (this._trnMainService.TrnMainObj.TransporterEway == null) {
            this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          }
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
            this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
          }


          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].PrimaryDiscount) > 0) {
              this._trnMainService.TrnMainObj.ProdList[i].BasePrimaryDiscount =
                this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].PrimaryDiscount) / (this._trnMainService.TrnMainObj.ProdList[i].Quantity * this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);
            }
            if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].SecondaryDiscount) > 0) {
              this._trnMainService.TrnMainObj.ProdList[i].BaseSecondaryDiscount =
                this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].SecondaryDiscount) / (this._trnMainService.TrnMainObj.ProdList[i].Quantity * this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);
            }
            if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].LiquiditionDiscount) > 0) {
              this._trnMainService.TrnMainObj.ProdList[i].BaseLiquiditionDiscount =
                this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].LiquiditionDiscount) / (this._trnMainService.TrnMainObj.ProdList[i].Quantity * this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);
            }
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            // this._trnMainService.CalculateNormalNew(i);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
          }

          //  this._trnMainService.ReCalculateBill();
          this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.Warehouse = this._trnMainService.TrnMainObj.MWAREHOUSE;
          if (
            !this._trnMainService.Warehouse &&
            this._trnMainService.TrnMainObj.ProdList &&
            this._trnMainService.TrnMainObj.ProdList.length > 0
          ) {
            this._trnMainService.Warehouse = this._trnMainService.TrnMainObj.ProdList[0].WAREHOUSE;
          }

          this._trnMainService.TrnMainObj.TRNDATE =
            this._trnMainService.TrnMainObj.TRNDATE == null
              ? ""
              : this._trnMainService.TrnMainObj.TRNDATE.toString().substring(0, 10);
          this._trnMainService.TrnMainObj.TRN_DATE =
            this._trnMainService.TrnMainObj.TRN_DATE == null
              ? ""
              : this._trnMainService.TrnMainObj.TRN_DATE.toString().substring(0, 10);
          this._trnMainService.TrnMainObj.CHEQUEDATE =
            this._trnMainService.TrnMainObj.CHEQUEDATE == null
              ? ""
              : this._trnMainService.TrnMainObj.CHEQUEDATE.toString().substring(0, 10);
          this._trnMainService.TrnMainObj.DeliveryDate =
            this._trnMainService.TrnMainObj.DeliveryDate == null
              ? ""
              : this._trnMainService.TrnMainObj.DeliveryDate.toString().substring(0, 10);

          this._trnMainService.TrnMainObj.TrntranList.forEach(trntran => {
            if (trntran.A_ACID) {
              trntran.acitem = trntran.AccountItem;
              trntran.ROWMODE == "save";
            } else {
              trntran.acitem = <any>{};
              trntran.ROWMODE == "save";
            }
          });

          let acid = this._trnMainService.TrnMainObj.TRNAC;

          this.masterService.accountList$.subscribe(aclist => {
            if (aclist) {
              let ac = aclist.find(x => x.ACID == acid);
              if (ac && ac != null && ac != undefined)
                this._trnMainService.TrnMainObj.TRNACName = ac.ACNAME;
            }
            this._trnMainService.trnmainBehavior.next(this._trnMainService.TrnMainObj);
          });
        }
        this._trnMainService.TrnMainObj.tag = "SALESRETURNCANCEL";
      },
      error => {
        this.loadingService.hide();
        this.alertService.error(error);
        this._trnMainService.trnmainBehavior.complete();
      },
      () => {
        this.loadingService.hide();
        this._trnMainService.trnmainBehavior.complete();
        this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
        this._trnMainService.TrnMainObj.VoucherType = 63;
        this._trnMainService.TrnMainObj.VoucherPrefix = "RR";
        this._trnMainService.TrnMainObj.VoucherAbbName = "RR";
        this._trnMainService.TrnMainObj.tag = "SALESRETURNCANCEL";
        this._trnMainService.TrnMainObj.Mode = "NEW";
        this._trnMainService.pageHeading = "Sales Return Cancel";
        const uuidV1 = require('uuid/v1');
        this._trnMainService.TrnMainObj.guid = uuidV1();
      }
    );























  }




  onCancelClicked() {
    if (confirm("Are you sure to cancel this sales return")) {
      this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode = "NEW", this._trnMainService.TrnMainObj).subscribe((res) => {
        if (res.status == 'ok') {
          this._trnMainService.initialFormLoad(15);
          this._trnMainService.pageHeading = "Sales Return";
          this._trnMainService.TrnMainObj.VoucherPrefix = "CN";
          this._trnMainService.TrnMainObj.VoucherType = 15;
        }
      }, error => {
        this.alertService.error(error);
      })

    }

  }





  loadFromDebitNote() {
    this.genericFromDebitNote.show();
  }



  onFomDebitNoteClicked(event) {
    this.masterService.masterGetmethod(`/getPurchaseReturnDetail?VCHRNO=${event.VCHRNO}&FROMCOMPANY=${event.FROMCOMPANY}`).subscribe((res) => {
      if (res.status == "ok") {
        this._trnMainService.TrnMainObj = res.result;
        if (
          !this._trnMainService.TrnMainObj ||
          !this._trnMainService.TrnMainObj.ProdList ||
          this._trnMainService.TrnMainObj.ProdList == undefined
        )
          return;
        this._trnMainService.TrnMainObj.VoucherType = 15;
        this._trnMainService.TrnMainObj.VoucherPrefix = "CN";
        this._trnMainService.TrnMainObj.VoucherAbbName = "CN";
        this._trnMainService.TrnMainObj.Mode = "NEW";
        this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
        this._trnMainService.TrnMainObj.VCHRNO = "";
        this._trnMainService.TrnMainObj.CHALANNO = "";
        this._trnMainService.TrnMainObj.tag =event.TYPE;
        this._trnMainService.TrnMainObj.AdditionalObj.tag = event.TYPE;
        this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = event.TYPE;
        for (let i in this._trnMainService.TrnMainObj.ProdList) {
          this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          this._trnMainService.setAltunitDropDownForView(i);
          // this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, "", 0, this._trnMainService.TrnMainObj.ProdList[i].RATE);
          this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].SPRICE, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
          this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
          this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
        }


        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.getVoucherNumber();
        this._trnMainService.getCurrentDate();
        const uuidV1 = require('uuid/v1');
        this._trnMainService.TrnMainObj.guid = uuidV1();
        let invoiceDate = res.result.TRN_DATE;
        this._trnMainService.TrnMainObj.TRN_DATE = invoiceDate == null ? this._trnMainService.TrnMainObj.TRNDATE : invoiceDate.toString().substring(0, 10);

      }
      else {
        this.loadingService.hide();
        this.alertService.error(res.result._body);
      }
    })
  }
  onTransactionConfigureClick() {
    this.userwisetransactionformconfig.show(VoucherTypeEnum.CreditNote)
  }



  updateGridConfig(gridsetting) {
    this._trnMainService.userwiseTransactionFormConf = gridsetting;
  }
}




