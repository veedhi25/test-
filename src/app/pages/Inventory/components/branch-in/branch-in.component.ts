import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import * as moment from 'moment';
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { Spinner } from 'primeng/primeng';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: "branch-in",
    templateUrl: "./branch-in.component.html",
    providers: [TransactionService],

})

export class BranchInComponent {
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService, private loadingService: SpinnerService, private alertService: AlertService, private route: ActivatedRoute) {
        this._trnMainService.initialFormLoad(7);
        this.gridPopupSettings = {
            title: "Transferred List",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "VCHRNO",
                    title: "Voucher No.",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "TRNDATE",
                    title: "Date",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "NETAMNT",
                    title: "Net Amount",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "NAME",
                    title: "Transferred From",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "STATUS",
                    title: "Status",
                    hidden: false,
                    noSearch: false
                }
            ]
        };
        this.route.queryParams.subscribe(params => {
            if (params.voucher) {
                let voucherNo = params.voucher;
                let event = {
                    VCHRNO: voucherNo,
                    DIVISION: this.masterService.userProfile.userDivision,
                    PHISCALID: this.masterService.userProfile.PhiscalYearInfo.PhiscalID
                }
                this.onItemDoubleClick(event);
            }
        });
    }

    ngOnInit() {

    }

    loadTransferredList() {
        
        this.genericGrid.show("", false, "stockTransferredList");

    }

    onItemDoubleClick(event) {

        this.loadingService.show("Please wait while loading invoice details");
        this.masterService.LoadTransaction(event.VCHRNO, event.DIVISION, event.PHISCALID, "VIEW").subscribe(
            data => {
                if (data.status == "ok") {
                    this.loadingService.hide();
                    const uuidV1 = require('uuid/v1');
                    this._trnMainService.TrnMainObj = data.result;
                    this._trnMainService.TrnMainObj.VoucherType = 7;
                    this._trnMainService.TrnMainObj.VoucherPrefix = "TR";
                    this._trnMainService.TrnMainObj.VoucherAbbName = "TR";
                    this._trnMainService.TrnMainObj.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
                    this._trnMainService.TrnMainObj.REFORDBILL = event.VCHRNO;
                    this._trnMainService.TrnMainObj.Mode = "NEW";
                    this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
                    this._trnMainService.TrnMainObj.tag = "FROMTRANSFERRED";
                    this._trnMainService.TrnMainObj.DIVISION = this.masterService.userProfile.userDivision;
                    this._trnMainService.TrnMainObj.MWAREHOUSE = this.masterService.userProfile.userWarehouse;
                    this._trnMainService.TrnMainObj.guid = uuidV1();


                    for (let i in this._trnMainService.TrnMainObj.ProdList) {

                        this._trnMainService.setAltunitDropDownForView(i);
                        this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].RATE, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
                        this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
                        this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
                        this._trnMainService.TrnMainObj.ProdList[i].DIVISION = this.masterService.userProfile.userDivision;
                        this._trnMainService.TrnMainObj.ProdList[i].WAREHOUSE = this.masterService.userProfile.userWarehouse;
                        this._trnMainService.TrnMainObj.ProdList[i].WAREHOUSE = this.masterService.userProfile.userWarehouse;
                    }


                    this._trnMainService.ReCalculateBillWithNormal();
                    this._trnMainService.getVoucherNumber();
                    this._trnMainService.getCurrentDate();
                    this._trnMainService.TrnMainObj.TRN_DATE = data.result.TRNDATE.toString().substring(0, 10);

                }
            },
            error => {
                this.loadingService.hide();
                this.alertService.error(error._body);
            },
            () => {
                this.loadingService.hide();
            }
        );
    }
}
