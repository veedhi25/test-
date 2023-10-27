import { Component, ViewChild } from '@angular/core';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories';
import { error } from 'console';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component(
    {
        selector: 'SalesConfiguration',
        templateUrl: './SalesConfiguration.component.html',

    }
)
export class SalesConfigurationComponent {
    selectall: boolean = false;
    salesConfiguration: SalesConfiguration = <SalesConfiguration>{};
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    @ViewChild("genericMcodeGrid") genericMcodeGrid: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    gridMcodePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private alertService: AlertService, public masterService: MasterRepo,public loadingService:SpinnerService) {
        this.salesConfiguration.BATCHLIST = []

        this.gridPopupSettings = {
            title: "SAP LIST",
            apiEndpoints: `/sapList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'SAPCODE',
                    title: 'SAP CODE',
                    hidden: false,
                    noSearch: false
                }
            ]
        }
        this.gridMcodePopupSettings = {
            title: "Item List",
            apiEndpoints: `/getmenucodesapwise`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'MCODE',
                    title: 'Item Code',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'DESCA',
                    title: 'Item Description',
                    hidden: false,
                    noSearch: false
                }
            ]
        }
    }


    showSapCodelist = () => {
        this.genericGrid.show();
    }
    showmcodeCodelist = () => {
        this.genericMcodeGrid.show("", false, this.salesConfiguration.COMPANYID);
    }



    onItemDoubleClick = (event) => {
        this.salesConfiguration.COMPANYID = event.SAPCODE;
        setTimeout(() => {
            this.masterService.focusAnyControl("itemlist");
        }, 10);
    }
    onMcodeItemDoubleClick = (event) => {
        this.salesConfiguration.MCODE = event.MCODE;
        this.masterService.masterPostmethod(`/getbatchlistsapwise`, this.salesConfiguration).subscribe((res) => {
            if (res.status == "ok") {
                this.salesConfiguration.BATCHLIST = res.result;
            } else {
                this.alertService.error(res.message)
            }
        }, error => {
            error.resolve();
        })
    }





    onSelectAll = (event) => {
        if (event.target.checked) {
            this.salesConfiguration.BATCHLIST.forEach(x => x.STATUS = "2");
        } else {
            this.salesConfiguration.BATCHLIST.forEach(x => x.STATUS = "1");
        }
    }


    onSaveClicked = () => {
        this.loadingService.show("Updating Batch information. please wait.");
        this.masterService.masterPostmethod("/savebatchstatussapwise", this.salesConfiguration).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.salesConfiguration.MCODE = "";
                this.salesConfiguration.COMPANYID = "";
                this.salesConfiguration.BATCHLIST = [];
                this.selectall = false;
            } else {
                this.loadingService.hide();
                this.alertService.error(res.message);
            }
        }, error => {
            this.loadingService.hide();
            error.resolve();
        })
    }

}



export interface SalesConfiguration {
    COMPANYID: string;
    MCODE: string;
    BATCHLIST: BATCH[]
}




export interface BATCH {
    MCODE: string;
    BATCHNAME: string;
    MFGDATE: Date | string;
    EXPDATE: Date | string;
    PRATE: number;
    STATUS: string;

}