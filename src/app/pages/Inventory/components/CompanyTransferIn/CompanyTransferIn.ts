import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment'
import { VoucherTypeEnum } from '../../../../common/interfaces/TrnMain';

@Component({
    selector: "company-transfer-in",
    templateUrl: "./CompanyTransferIn.html",
})

export class InterCompanyTransferInComponent {
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("genericInterCompanyTransferInCancel") genericInterCompanyTransferInCancel: GenericPopUpComponent;
    gridCancelInterCompanyTransferInPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService, private loadingService: SpinnerService, private alertService: AlertService, private route: ActivatedRoute) {
        this._trnMainService.initialFormLoad(102);
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

        this.gridCancelInterCompanyTransferInPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "Inter Company Transfer in Cancel",
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

    loadTransferredList() {
        this.genericGrid.show("", false, "interCompanyTransferredList");
    }

    showInterCompanyTransferInToCancel($event) {
        this.genericInterCompanyTransferInCancel.show("", false, "interCompanyTransferInCancelList")
    }

    onItemDoubleClick(event) {

        this.loadingService.show("Please wait while loading invoice details");
        this.masterService.LoadInterCompanyTransfer(event.VCHRNO, this.masterService.userProfile.userDivision, this.masterService.userProfile.PhiscalYearInfo.PhiscalID, event.FROMCOMPANY, "VIEW").subscribe(
            data => {
                if (data.status == "ok") {
                    this.loadingService.hide();
                    const uuidV1 = require('uuid/v1');
                    this._trnMainService.TrnMainObj = data.result;
                    if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
                        this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
                    }
                    this._trnMainService.TrnMainObj.VoucherType = 102;
                    this._trnMainService.TrnMainObj.VoucherPrefix = "IR";
                    this._trnMainService.TrnMainObj.VoucherAbbName = "IR";
                    this._trnMainService.TrnMainObj.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
                    this._trnMainService.TrnMainObj.REFORDBILL = event.VCHRNO;
                    this._trnMainService.TrnMainObj.Mode = "NEW";
                    this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
                    this._trnMainService.TrnMainObj.tag = "FROMTRANSFERRED";
                    this._trnMainService.TrnMainObj.DIVISION = this.masterService.userProfile.userDivision;
                    this._trnMainService.TrnMainObj.MWAREHOUSE = this.masterService.userProfile.userWarehouse;
                    this._trnMainService.TrnMainObj.guid = uuidV1();
                    this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_IR";


                    for (let i in this._trnMainService.TrnMainObj.ProdList) {
                        this._trnMainService.setAltunitDropDownForView(i);
                        this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].RATE, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
                        let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
                        this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
                        this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
                        this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
                        this._trnMainService.TrnMainObj.ProdList[i].DIVISION = this.masterService.userProfile.userDivision;
                        this._trnMainService.TrnMainObj.ProdList[i].WAREHOUSE = this.masterService.userProfile.userWarehouse;
                        this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
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

    onInterCompanyTransferInCancelSelect(event) {
        this.loadingService.show("Getting Details, Please Wait...");
        this.masterService.LoadTransaction(event.VCHRNO, event.DIVISION, event.PhiscalID, "CANCEL").subscribe((res: any) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this._trnMainService.setTrnMainObData(res, "CANCEL");
                this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
                this._trnMainService.TrnMainObj.VoucherType = VoucherTypeEnum.InterCompanyTransferInCancel;
                this._trnMainService.TrnMainObj.VoucherPrefix = "RI";
                this._trnMainService.TrnMainObj.VoucherAbbName = "RI";
                this._trnMainService.TrnMainObj.tag = "InterCompanyTransferIncancel";
                this._trnMainService.TrnMainObj.Mode = "CANCEL";
                this._trnMainService.pageHeading = "Inter Company Transfer In";
                const uuidV1 = require('uuid/v1');
                this._trnMainService.TrnMainObj.guid = uuidV1();
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error._body);
        })

    }

    onInterCompanyTransferInCancelSave() {
        if (confirm("Are you sure to cancel this Company Transfer In")) {
            this.loadingService.show("Cancelling the company transfer in Please wait...");
            this.masterService.saveInterCompanyTransferInCancel(this._trnMainService.TrnMainObj.Mode = "CANCEL", this._trnMainService.TrnMainObj).subscribe((res: any) => {
                if (res.status == 200) {
                    this.loadingService.hide();
                    this.alertService.success("Inter Company Transfer In Cancel Success...");
                    this._trnMainService.initialFormLoad(VoucherTypeEnum.InterCompanyTransferIn);
                }

            }, error => {
                this.loadingService.hide();
                this.alertService.error(error._body);
                // this._trnMainService.initialFormLoad(VoucherTypeEnum.InterCompanyTransferIn);
            })

        }

    }
}
