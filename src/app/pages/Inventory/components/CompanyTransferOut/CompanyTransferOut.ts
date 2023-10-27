import { Component,ViewChild } from '@angular/core';
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from '../../../../common/repositories';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import * as moment from 'moment'
@Component({
    selector: "company-transfer-out",
    templateUrl: "./CompanyTransferOut.html",
  
})

export class InterCompanyTransferOutComponent {
    @ViewChild("genericInterCompanyTransferOutCancel") genericInterCompanyTransferOutCancel: GenericPopUpComponent;
    gridCancelInterCompanyTransferOutPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService,private loadingService: SpinnerService, private alertService: AlertService) {
        this._trnMainService.initialFormLoad(103);

        this.gridCancelInterCompanyTransferOutPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "Inter Company Transfer Out Cancel",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
              {
                key: 'VCHRNO',
                title: 'VOUCHER NO.',
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
    }

    ngOnInit() {
       
    }

    showInterCompanyTransferOutToCancel($event) {
        this.genericInterCompanyTransferOutCancel.show("", false, "interCompanyTransferOutCancelList")
    }
   
    onInterCompanyTransferOutCancelSelect(event) {
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
            this._trnMainService.TrnMainObj.tag = "InterCompanyTransferOutcancel";
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
            this._trnMainService.TrnMainObj.VoucherType = 115;
            this._trnMainService.TrnMainObj.VoucherPrefix = "CI";
            this._trnMainService.TrnMainObj.VoucherAbbName = "CI";
            this._trnMainService.TrnMainObj.tag = "InterCompanyTransferOutcancel";
            this._trnMainService.TrnMainObj.Mode = "CANCEL";
            this._trnMainService.pageHeading = "Inter Company Transfer Out";
            const uuidV1 = require('uuid/v1');
            this._trnMainService.TrnMainObj.guid = uuidV1();
        });
    }

    onInterCompanyTransferOutCancelSave() {
        if (confirm("Are you sure to cancel this Company Transfer Out")) {
          this.loadingService.show("Cancelling the company transfer out Please wait...");
          this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode = "CANCEL", this._trnMainService.TrnMainObj).subscribe((res) => {
            if (res.status == 'ok') {
              this.loadingService.hide();
              this.alertService.success("Inter Company Transfer Out Cancel Success...");
              this._trnMainService.initialFormLoad(103);
              this._trnMainService.pageHeading = "Inter Company Tarnsfer Out";
              this._trnMainService.TrnMainObj.VoucherPrefix = "IC";
              this._trnMainService.TrnMainObj.VoucherType = 103;
            }
            else {
              this._trnMainService.initialFormLoad(103);
              this._trnMainService.pageHeading = "Inter Company Tarnsfer Out";
              this._trnMainService.TrnMainObj.VoucherPrefix = "IC"
              this.loadingService.hide();
              this.alertService.error(res.result._body);
    
            }
          }, error => {
            this._trnMainService.initialFormLoad(103);
            this._trnMainService.pageHeading = "Inter Company Tarnsfer Out";
            this._trnMainService.TrnMainObj.VoucherPrefix = "IC"
            this.loadingService.hide();
            this.alertService.error(error);
          })
    
        }
    
      }
}
