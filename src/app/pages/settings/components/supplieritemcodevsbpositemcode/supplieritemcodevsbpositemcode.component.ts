import { Component, OnInit, ViewChild } from "@angular/core";
import { GenericPopUpSettings, GenericPopUpComponent } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";

@Component({
    templateUrl: './supplieritemcodevsbpositemcode.component.html'
})
export class SupplierItemCodeVsBposItemCode implements OnInit {




    p = 0;
    public supplierName: string;
    public supplierAcid: string;
    gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
    itemList: any[] = [];






    constructor(private _masterService: MasterRepo, private loadingService: SpinnerService, private alertService: AlertService) {
        this.gridPopupSettingsForSupplier = {
            title: "Supplier",
            apiEndpoints: `/getAccountPagedListByPType/PA/V`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACNAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ERPPLANTCODE",
                    title: "CODE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ADDRESS",
                    title: "ADDRESS",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "PRICELEVEL",
                    title: "TYPE",
                    hidden: false,
                    noSearch: false
                }
            ]
        };
    }




    ngOnInit() {

    }


    onSupplierEnterCommand() {
        this.genericGridSupplier.show();
    }

    onSupplierSelected(data: any) {
        this.supplierAcid = data.ACID;
        this.supplierName = data.ACNAME;




        this.loadingService.show("Please wait while fetching data........")
        this._masterService.masterGetmethod_NEW("/supplieritemcodevsbpositemcode?code=" + data.ACID).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.itemList = res.result;

            } else {
                this.loadingService.hide();
                this.alertService.error(res.result);
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error._body);
        })
    }


    onSaveClicked() {
        this.loadingService.show("Please wait while saving your data...");
        this.itemList.forEach(x => x.PARAC = this.supplierAcid);
        this._masterService.masterPostmethod_NEW("/savesupplieritemcodevsbpositemcode", this.itemList.filter(x => x.SUPPLIERITEMCODE)).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.alertService.success(res.message);
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error._body);
        })
    }
}