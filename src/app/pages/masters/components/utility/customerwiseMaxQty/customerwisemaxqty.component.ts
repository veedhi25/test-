import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CustomerWiseMaxQuantity } from "../../../../../common/interfaces/scheme.interface";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { MasterRepo } from "../../../../../common/repositories";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";


@Component({
    templateUrl: './customerwisemaxqty.component.html',
    styleUrls: ['./customerwisemaxqty.component.css']
})

export class CustomerWiseMaxQuantityComponent implements OnInit {


    CustomerWiseMaxQuantityList: CustomerWiseMaxQuantity[] = [];
    @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
    gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridmcode") genericGridmcode: GenericPopUpComponent;
    gridPopupSettingsFormcode: GenericPopUpSettings = new GenericPopUpSettings();
    activeRowIndex: number;
    mode: string = "NEW";

    constructor(private _alertService: AlertService, private _masterRepo: MasterRepo, private _loadingService: SpinnerService, private route: Router, private _activatedRoute: ActivatedRoute) {

        this.addnewRow(-1);
        this.gridPopupSettingsForCustomer = {

            title: "Customers",
            apiEndpoints: `/getAccountPagedListByPType/PA/C`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACNAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "customerID",
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
                    key: "GEO",
                    title: "TYPE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "MOBILE",
                    title: "MOBILE",
                    hidden: true,
                    noSearch: false
                }
            ]
        };
        this.gridPopupSettingsFormcode = {

            title: "Item List",
            apiEndpoints: `/getMenuItemsPagedListScheme`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "MCODE",
                    title: "Item Code",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "DESCA",
                    title: "Description",
                    hidden: false,
                    noSearch: false
                }
            ]
        };
    }


    ngOnInit() {
        let newRow = <CustomerWiseMaxQuantity>{};
        if (!!this._activatedRoute.snapshot.params["mode"]) {
            this.mode = this._activatedRoute.snapshot.params["mode"];
        }



        if (!!this._activatedRoute.snapshot.params["mcode"]) {
            newRow.mcode = this._activatedRoute.snapshot.params["mcode"];
        }

        if (!!this._activatedRoute.snapshot.params["desca"]) {
            newRow.desca = this._activatedRoute.snapshot.params["desca"];
        }

        if (!!this._activatedRoute.snapshot.params["acname"]) {
            newRow.acname = this._activatedRoute.snapshot.params["acname"];
        }
        if (!!this._activatedRoute.snapshot.params["parac"]) {
            newRow.parac = this._activatedRoute.snapshot.params["parac"];
        }
        if (!!this._activatedRoute.snapshot.params["maxquantity"]) {
            newRow.maxquantity = this._activatedRoute.snapshot.params["maxquantity"];
        }

        if (this.mode.toLowerCase() != "new") {
            this.CustomerWiseMaxQuantityList = [];
            this.CustomerWiseMaxQuantityList.push(newRow);
            this.activeRowIndex = 0;
        }


    }





    onCustomerEnterCommand = (index: number) => {
        this.activeRowIndex = index;
        this.genericGridCustomer.show();
    }



    onmcodeEnterCommand = (index: number) => {

        this.activeRowIndex = index;
        this.genericGridmcode.show();
    }


    onCustomerDoubleClick = (data) => {
        this.CustomerWiseMaxQuantityList[this.activeRowIndex].parac = data.ACID;
        this.CustomerWiseMaxQuantityList[this.activeRowIndex].acname = data.ACNAME;
        this._masterRepo.focusAnyControl("mcode" + this.activeRowIndex);


    }
    onmcodeDoubleClick = (data) => {
        this.CustomerWiseMaxQuantityList[this.activeRowIndex].mcode = data.MCODE;
        this.CustomerWiseMaxQuantityList[this.activeRowIndex].desca = data.DESCA;
        this._masterRepo.focusAnyControl("maxquantity" + this.activeRowIndex);
    }



    onmaxquantityEnterCommand = (index) => {


        this.addnewRow(index);
    }






    onBudgetTypeChange = (event) => {

        this._masterRepo.focusAnyControl("value" + this.activeRowIndex);
    }
    addnewRow = (index: number) => {



        if (this.CustomerWiseMaxQuantityList.some(x => this._masterRepo.nullToZeroConverter(x.maxquantity) == 0)) { return true; }

        let newRow = <CustomerWiseMaxQuantity>{};
        this.CustomerWiseMaxQuantityList.push(newRow);
        this.activeRowIndex = index + 1;


        setTimeout(() => {
            this._masterRepo.focusAnyControl("customer" + this.activeRowIndex);
        }, 10);
    }

    onSaveSchemeVsBudget = () => {


        this._loadingService.show("Please wait. Saving Data.........")
        this._masterRepo.masterPostmethod_NEW(`/savecustomerwisemaxquantity?mode=${this.mode}`, this.CustomerWiseMaxQuantityList.filter(x => x.maxquantity > 0)).subscribe((res) => {
            if (res.status == "ok") {
                this._loadingService.hide();
                this._alertService.success("Saved Successfully;");
                this.route.navigate(["./pages/masters/utility/customerwisemaxqtylist"]);

            }
        }, error => {
            this._loadingService.hide();
            this._alertService.error(error._body);
        })
    }


    onBack = (event) => {
        this.route.navigate(["./pages/masters/utility/customerwisemaxqtylist"]);
    }

}