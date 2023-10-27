import { Component, ViewChild } from '@angular/core';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
@Component(
    {
        selector: 'taxslab',
        templateUrl: './taxslab.component.html',
    }
)
export class TaxSlabComponent {

    taxSlabMain: TaxSlabMain = <TaxSlabMain>{};

    @ViewChild("genericGridview") genericGridview: GenericPopUpComponent;
    genericGridviewSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericTaxSlabGrid") genericTaxSlabGrid: GenericPopUpComponent;
    genericTaxSlabGridSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericTaxSlabGridEdit") genericTaxSlabGridEdit: GenericPopUpComponent;
    genericTaxSlabGridSettingsEdit: GenericPopUpSettings = new GenericPopUpSettings();
    activeRowIndex: number;



    constructor(private masterService: MasterRepo, private alertService: AlertService, private loadingService: SpinnerService) {
        this.initialiseForm();
        this.genericGridviewSettings = {
            title: "Tax-Slab Rate",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'TaxSlabName',
                    title: 'Name',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'SlabRateId',
                    title: 'SlabRateId',
                    hidden: true,
                    noSearch: true
                }
            ]
        }
        this.genericTaxSlabGridSettingsEdit = {
            title: "Tax-Slab Rate",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'TaxSlabName',
                    title: 'Name',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'SlabRateId',
                    title: 'SlabRateId',
                    hidden: true,
                    noSearch: true
                }
            ]
        }
        this.genericTaxSlabGridSettings = {
            title: "Tax Details",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'TAXGROUPNAME',
                    title: 'Name',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'TAXAPPLY',
                    title: 'Tax',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'CESS',
                    title: 'Cess',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'ID',
                    title: 'ID',
                    hidden: true,
                    noSearch: true
                }
            ]
        }
    }











    addRow = () => {
        if (this.taxSlabMain.TaxSlabList.some(x => x.RateTo == null && x.RateFrom == null && x.TaxGroupId == null)) { return true; }
        let newRow = <TaxSlabList>{};
        this.taxSlabMain.TaxSlabList.push(newRow);
    }


    onTaxEnterKey = (currentindex: number) => {
        this.activeRowIndex = currentindex;
        let srd = this.taxSlabMain.TaxSlabList[currentindex];
        if (srd.RateFrom == null || srd.RateFrom == undefined) {
            document.getElementById("ratefrom" + currentindex).focus();
            return;
        }
        if (srd.RateTo == null || srd.RateTo == undefined) {
            document.getElementById("rateto" + currentindex).focus();
            return;
        }
        this.genericTaxSlabGrid.show("", false, "taxrates");
    }

    dblClicktax = (data) => {
        this.taxSlabMain.TaxSlabList[this.activeRowIndex].TaxGroupName = data.TAXGROUPNAME;
        this.taxSlabMain.TaxSlabList[this.activeRowIndex].TaxGroupId = data.ID;
        this.addRow();
        let nextInd = this.activeRowIndex + 1;
        setTimeout(() => {
            document.getElementById("ratefrom" + nextInd).focus();
        }, 10);
    }



    onRateFromChange = (index: number) => {
        if (isNaN(this.taxSlabMain.TaxSlabList[index].RateFrom)) return;
        document.getElementById("rateto" + index).focus();

    }
    onRateToChange = (index: number) => {
        if (isNaN(this.taxSlabMain.TaxSlabList[index].RateTo)) return;
        document.getElementById("tax" + index).focus();

    }

    onsaveClicked = () => {


        if (this.taxSlabMain.Mode.toUpperCase() == "VIEW") {
            this.alertService.error("Cannot Save in view mode");
            return;
        }

        if (this.checkValidSlab()) {
            this.loadingService.show("Saving data.please wait a moment.")
            this.taxSlabMain.TaxSlabList = this.taxSlabMain.TaxSlabList.filter(x => !isNaN(x.RateFrom) && !isNaN(x.RateTo))
            this.masterService.masterPostmethod_NEW("/saveslabratedetails", this.taxSlabMain).subscribe((res) => {
                if (res.status == "ok") {
                    this.loadingService.hide();
                    this.alertService.success(res.result)
                    this.initialiseForm();
                } else {
                    this.loadingService.hide();
                    this.alertService.error(res.result)
                }
            }, error => {
                this.loadingService.hide();
                this.alertService.error(error._body);
            })
        }
    }





    onViewClicked = () => {
        this.genericGridview.show("", false, "getslabrates");
    }

    initialiseForm = () => {
        this.taxSlabMain = <TaxSlabMain>{};
        this.taxSlabMain.TaxSlabList = [];
        this.taxSlabMain.Mode = "NEW";
        this.addRow();
    }


    checkValidSlab = () => {
        if (this.taxSlabMain.TaxSlabName == null || this.taxSlabMain.TaxSlabName == undefined || this.taxSlabMain.TaxSlabName == "") {
            this.alertService.error("Tax slab name should not be empty");
            return false;
        }
        if (this.taxSlabMain.TaxSlabList.length == 0) {
            this.alertService.error("No slab rate details found.");
            return false;
        }


        for (let i in this.taxSlabMain.TaxSlabList.filter(x => !isNaN(x.RateFrom) && !isNaN(x.RateTo))) {
            if (this.taxSlabMain.TaxSlabList[i].TaxGroupId == null || this.taxSlabMain.TaxSlabList[i].TaxGroupId == undefined) {
                this.alertService.error("Invalid Tax Group at row " + parseFloat(i) + 1);
                return false;

            }
        }
        if (this.taxSlabMain.TaxSlabList.length == 1) return true;
        for (let i in this.taxSlabMain.TaxSlabList.filter(x => !isNaN(x.RateFrom) && !isNaN(x.RateTo))) {
            if (parseFloat(i) == 0) continue;


            let srdListonTop = this.taxSlabMain.TaxSlabList.slice(0, parseFloat(i));
            let currentRateFrom = this.taxSlabMain.TaxSlabList[i].RateFrom;
            let currentRateTo = this.taxSlabMain.TaxSlabList[i].RateTo;
            if (currentRateTo == currentRateFrom) return false;

            for (let j in srdListonTop) {
                if (currentRateFrom >= srdListonTop[j].RateFrom && currentRateFrom <= srdListonTop[j].RateTo) {
                    this.alertService.error("Invalid RateFrom at row." + parseFloat(i) + 1);
                    return false;

                }
                if (currentRateTo >= srdListonTop[j].RateFrom && currentRateTo <= srdListonTop[j].RateTo) {
                    this.alertService.error("Invalid RateTo at row." + parseFloat(i) + 1);
                    return false;

                }
            }
        }
        return true;

    }

    onEditClicked = () => {
        this.genericTaxSlabGridEdit.show("", false, "getslabrates");
    }



    dblClicktaxSlabRate = (data) => {
        this.getSlabRatedata("VIEW", data.SlabRateId);
    }
    dblClicktaxSlabRateEdit = (data) => {

        this.getSlabRatedata("EDIT", data.SlabRateId);
    }


    getSlabRatedata = (mode: string, id) => {
        this.masterService.masterGetmethod_NEW(`/getSlabDetails?id=${id}`).subscribe((res) => {
            if (res.status == "ok") {
                this.taxSlabMain = res.result;
                this.taxSlabMain.Mode = mode;
            } else {
                this.loadingService.hide();
                this.alertService.error(res.result);
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error._body);
        })
    }
}






export interface TaxSlabMain {
    TaxSlabName: string;
    Mode: string;
    TaxSlabList: TaxSlabList[];
}


export interface TaxSlabList {
    RateFrom: number;
    RateTo: number;
    TaxSlabName: string;
    SlabRateId: number;
    TaxGroupId: number;
    TaxGroupName: string;
}