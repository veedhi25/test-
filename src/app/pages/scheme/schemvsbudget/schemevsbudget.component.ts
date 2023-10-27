import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SchemeVsBudget } from "../../../common/interfaces/scheme.interface";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { MasterRepo } from "../../../common/repositories";
import { AlertService } from "../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../common/services/spinner/spinner.service";

@Component({
    templateUrl: './schemevsbudget.component.html',
    styleUrls: ['./schemevsbudget.component.css']
})

export class SchemeVsBudgetComponent implements OnInit {


    schemevsbudgetList: SchemeVsBudget[] = [];
    @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
    gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridScheme") genericGridScheme: GenericPopUpComponent;
    gridPopupSettingsForScheme: GenericPopUpSettings = new GenericPopUpSettings();
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
        this.gridPopupSettingsForScheme = {

            title: "Customers",
            apiEndpoints: `/getSchemePagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "DisID",
                    title: "Scheme Id",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "SchemeName",
                    title: "Scheme Name",
                    hidden: false,
                    noSearch: false
                }
            ]
        };
    }


    ngOnInit() {
        let newRow = <SchemeVsBudget>{};
        if (!!this._activatedRoute.snapshot.params["mode"]) {
            this.mode = this._activatedRoute.snapshot.params["mode"];
        }

        if (!!this._activatedRoute.snapshot.params["schemeno"]) {
            newRow.schemeno = this._activatedRoute.snapshot.params["schemeno"];
        }

        if (!!this._activatedRoute.snapshot.params["description"]) {
            newRow.description = this._activatedRoute.snapshot.params["description"];
        }

        if (!!this._activatedRoute.snapshot.params["customername"]) {
            newRow.customername = this._activatedRoute.snapshot.params["customername"];
        }
        if (!!this._activatedRoute.snapshot.params["retailercode"]) {
            newRow.retailercode = this._activatedRoute.snapshot.params["retailercode"];
        }
        if (!!this._activatedRoute.snapshot.params["budgetamount"]) {
            newRow.budgetamount = this._activatedRoute.snapshot.params["budgetamount"];
        }
        if (!!this._activatedRoute.snapshot.params["budgetquantity"]) {
            newRow.budgetquantity = this._activatedRoute.snapshot.params["budgetquantity"];
        }
        if (this.mode.toLowerCase() != "new") {
            this.schemevsbudgetList = [];
            this.schemevsbudgetList.push(newRow);
            this.activeRowIndex = 0;
        }

    }





    onCustomerEnterCommand = (index: number) => {
        this.activeRowIndex = index;
        this.genericGridCustomer.show();
    }



    onSchemeEnterCommand = (index: number) => {

        this.activeRowIndex = index;
        this.genericGridScheme.show();
    }


    onCustomerDoubleClick = (data) => {
        this.schemevsbudgetList[this.activeRowIndex].retailercode = data.ACID;
        this.schemevsbudgetList[this.activeRowIndex].customername = data.ACNAME;
        this._masterRepo.focusAnyControl("scheme" + this.activeRowIndex);


    }
    onSchemeDoubleClick = (data) => {
        this.schemevsbudgetList[this.activeRowIndex].schemeno = data.DisID;
        this.schemevsbudgetList[this.activeRowIndex].description = data.SchemeName;
        this._masterRepo.focusAnyControl("budgetamount" + this.activeRowIndex);
    }



    onbudgetamountEnterCommand = (index) => {


        this._masterRepo.focusAnyControl("budgetquantity" + this.activeRowIndex);
    }


    onbudgetquantityEnterCommand = (index) => {


        this.addnewRow(index);
    }




    onBudgetTypeChange = (event) => {

        this._masterRepo.focusAnyControl("value" + this.activeRowIndex);
    }
    addnewRow = (index: number) => {
        let newRow = <SchemeVsBudget>{};
        this.schemevsbudgetList.push(newRow);
        this.activeRowIndex = index + 1;


        setTimeout(() => {
            this._masterRepo.focusAnyControl("customer" + this.activeRowIndex);
        }, 10);
    }

    onSaveSchemeVsBudget = () => {


        this._loadingService.show("Please wait. Saving Data.........")
        this._masterRepo.masterPostmethod_NEW(`/saveschemevsbudget?mode=${this.mode}`, this.schemevsbudgetList.filter(x => x.budgetamount > 0 || x.budgetquantity > 0)).subscribe((res) => {
            if (res.status == "ok") {
                this._loadingService.hide();
                this._alertService.success("Saved Successfully;");
                this.route.navigate(["./pages/configuration/scheme/schemebudgetlist"]);

            }
        }, error => {
            this._loadingService.hide();
            this._alertService.error(error._body);
        })
    }


    onBack = (event) => {
        this.route.navigate(["./pages/configuration/scheme/schemebudgetlist"]);
    }

}