import { Component, ViewChild } from '@angular/core';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../common/repositories';
import { SpinnerService } from '../../common/services/spinner/spinner.service';
import { AlertService } from '../../common/services/alert/alert.service';
import * as moment from 'moment'
@Component(
    {
        selector: 'proformatosalesinvoice',
        templateUrl: './proformatosalesinvoice.component.html',
    }
)
export class ProformaToTaxInvoiceComponent {


    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    public voucherType: string = "";
    public selectedVoucherList = []
    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    fromDate: string;
    toDate: string;
    
    
    constructor(public masterService: MasterRepo, public loadingService: SpinnerService, public alertService: AlertService) {
        this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "Proforma List",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "VCHRNO",
                    title: "Proforma No",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "REFBILL",
                    title: "Ref Bill",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "REFORDBILL",
                    title: "Order No",
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: "TRNDATE",
                    title: "Date",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "NETAMOUNT",
                    title: "Amount",
                    hidden: false,
                    noSearch: false
                }
            ]
        });


    }

    ngOnInit() {

    }


    dateChanged(date) {
        if (this.selectedDate.startDate != null) {
            try {
                this.fromDate = moment(this.selectedDate.startDate).format('MM-DD-YYYY');
                this.toDate = moment(this.selectedDate.endDate).format('MM-DD-YYYY');
                this.loadingService.show("Getting Proforma List.Please wait.");
                this.masterService.masterGetmethod(`/getProformaListFromDate?from=${this.fromDate}&to=${this.toDate}`).subscribe((res) => {
                    console.log(res);
                    this.selectedVoucherList = res.result;
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    this.alertService.error(error);
                })
            } catch (ex) {
                this.loadingService.hide();
                this.alertService.error(ex);
            }
        }
    }



    showList() {
        this.genericGrid.show("", false, "getActiveProformaList", false);
    }




    onItemDoubleClick(event) {
        let x: any
        x = this.selectedVoucherList.filter(itm => itm.VCHRNO == event.VCHRNO)
        if (x.length > 0) {
            return;
        }
        this.selectedVoucherList.push(event)
    }


    removeFromSelectedList(index) {
        this.selectedVoucherList.splice(index, 1)
    }


    onFromProformaSave() {
        if (this.selectedVoucherList.length == 0) {
            this.alertService.warning("Please Select voucher to save.");
            return;
        } else {
            try {
                this.genericGrid.hide();
                this.loadingService.show("Saving data.Please Wait!")
                this.masterService.masterPostmethod("/saveproformatotaxinvoice", this.selectedVoucherList).subscribe((res) => {
                    if (res.status == "ok") {
                        if (res.result.length) {
                            this.selectedVoucherList = [];
                            this.loadingService.hide();
                            this.alertService.error(`${res.result}`)
                        } else {
                            this.selectedVoucherList = [];
                            this.loadingService.hide();
                            this.alertService.success(res.message)
                        }
                    } else {
                        this.loadingService.hide();
                        this.alertService.error(`${res.message}:${res.result}`)
                    }
                }, error => {
                    this.alertService.error(error._body)
                })
            } catch (e) {
                this.loadingService.hide();
                this.alertService.error(e);
            }
        }
    }



}