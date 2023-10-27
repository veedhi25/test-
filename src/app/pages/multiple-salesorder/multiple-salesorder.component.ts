import { Component, ViewChild } from '@angular/core';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../common/repositories';
import { SpinnerService } from '../../common/services/spinner/spinner.service';
import { AlertService } from '../../common/services/alert/alert.service';
import * as moment from 'moment'
@Component(
    {
        selector: 'multiple-salesorder',
        templateUrl: './multiple-salesorder.component.html',
    }
)
export class MultiSalesOrderComponent {


    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    public voucherType: string = "";
    public selectedVoucherList = []
    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    fromDate: string;
    toDate: string;
    
    constructor(public masterService: MasterRepo, public loadingService: SpinnerService, public alertService: AlertService) {
        this.gridPopupSettings = Object.assign(new GenericPopUpSettings,{
            title: "Sales Orders from Mobile",
            apiEndpoints: `/getPurchaseOrderFromMobilePagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ORDERDATE",
                    title: "Order Date",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "RETAILERNAME",
                    title: "ORDER FROM",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "DSM",
                    title: "DSM NAME",
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: "BEAT",
                    title: "BEAT",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "REFNO",
                    title: "Order No",
                    hidden: true,
                    noSearch: true
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
                this.loadingService.show("Getting Mobile Orders.Please wait.");
                this.masterService.getMobileOrderFilteredDateWise(this.fromDate, this.toDate).subscribe((res) => {
                    this.selectedVoucherList = res;
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
        this.genericGrid.show("", false, "", false);
    }




    onItemDoubleClick(event) {
        let x: any
        x = this.selectedVoucherList.filter(itm => itm.REFNO == event.REFNO)
        if (x.length > 0) {
            return;
        }
        this.selectedVoucherList.push(event)
    }


    removeFromSelectedList(index) {
        this.selectedVoucherList.splice(index, 1)
    }


    OnFromMobileSosave() {
        if (this.selectedVoucherList.length == 0) {
            this.alertService.error("Please Select voucher to save.");
            return;
        } else {
            try {
                this.genericGrid.hide();
                this.loadingService.show("Saving data.Please Wait!")
                this.masterService.saveMultiMobileSO(this.selectedVoucherList, "SOSI").subscribe((res) => {
                    if (res.status == "ok") {
                        if (res.result.length) {
                            this.selectedVoucherList = [];
                            this.loadingService.hide();
                            this.alertService.error(`${res.message} with following error ${res.result}`)
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