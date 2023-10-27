import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TAcList } from '../../../../common/interfaces/Account.interface';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component(
    {
        selector: 'transferpartyledger',
        templateUrl: 'transferpartyledger.component.html',

    }
)
export class TransferPartyLedgerComponent implements OnInit {

    aclist: TAcList = <TAcList>{};
    StateList: any = [];
    @ViewChild("genericGridDistrict") genericGridDistrict: GenericPopUpComponent;
    gridPopupSettingsForDistrict: GenericPopUpSettings = new GenericPopUpSettings();
    MODE: string;

    constructor(private _activatedRoute: ActivatedRoute, private router: Router,
        public _masterService: MasterRepo, public loadingService: SpinnerService, public alertService: AlertService) {
        this._masterService.getState().subscribe(res => {
            if (res.status == 'ok') {
                this.StateList = res.result;
            }
        })


        this.gridPopupSettingsForDistrict = {
            title: "Districts",
            apiEndpoints: `/getDistrictsPagedList`,
            defaultFilterIndex: 0,
            columns: [

                {
                    key: "District",
                    title: "DISTRICT",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "State",
                    title: "STATE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "StateCode",
                    title: "StateCode",
                    hidden: true,
                    noSearch: true
                }

            ]
        };

        if (!!this._activatedRoute.snapshot.params["mode"]) {
            this.MODE = this._activatedRoute.snapshot.params["mode"];

        } else {
            this.MODE = "NEW";
        }
        if (!!this._activatedRoute.snapshot.params["ACID"])
            this.aclist.ACID = this._activatedRoute.snapshot.params["ACID"];



        if (!!this._activatedRoute.snapshot.params["mode"] && (this._activatedRoute.snapshot.params["mode"].toUpperCase() == "EDIT" || this._activatedRoute.snapshot.params["mode"].toUpperCase() == "VIEW")) {
            this.loadingService.show("Getting Data.Please wait.")
            this._masterService.getAllAccount(this.aclist.ACID).subscribe(
                data => {
                    this.loadingService.hide();
                    this.aclist = data.result;
                },
                error => {
                    this.loadingService.hide();
                }
            );
        }


    }
    ngOnInit() {




    }


    back() {
        this.router.navigate(["./pages/masters/tPartyLedger/tCustomerList"]);
    }


    preventInput($event) {
        $event.preventDefault();
        return false;
    }
    DistrictTabCommand(e) {
        e.preventDefault();
        document.getElementById("districtselectid").blur();
        var statename = "";
        var s = this.StateList.filter(x => x.StateCode == this.aclist.STATE)[0];
        if (s != null) { statename = s.StateName; }
        this.genericGridDistrict.show(statename);
    }


    onDistrictSelected(district) {
        this.aclist.DISTRICT = district.District;
        this.aclist.STATE = district.StateCode;
    }



    SumbitSave() {
        this.aclist.PType = "I";
        this.aclist.TYPE = "A";
        this.aclist.PARENT = "AT";
        this.aclist.MODE = this.MODE;
        if (!this.validateCustomerData()) {
            return;
        }
        this.loadingService.show("Please wait while saving data.")
        this._masterService.masterPostmethod("/savetransferpartyledger", this.aclist).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.alertService.success(res.message);
                this.aclist = <TAcList>{};
                this.back();
            } else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.success(error);
        })
    }







    validateCustomerData() {
        let errorList: string[] = [];
        if (this.isNullOrUndefinedOrEmpty(this.aclist.ACNAME)) {
            errorList.push(`Customer Name is mandatory.\n`);
        }
        if (this.isNullOrUndefinedOrEmpty(this.aclist.customerID)) {
            errorList.push(`Customer ID is mandatory.\n`);
        }
        if (this.isNullOrUndefinedOrEmpty(this.aclist.GSTNO)) {
            errorList.push(`GST NO is mandatory.\n`);
        }
        if (this.isNullOrUndefinedOrEmpty(this.aclist.GSTTYPE)) {
            errorList.push(`GST TYPE is mandatory.\n`);
        }
        if (this.isNullOrUndefinedOrEmpty(this.aclist.GEO)) {
            errorList.push(`Customer Category is mandatory.\n`);
        }
        if (this.isNullOrUndefinedOrEmpty(this.aclist.MOBILE)) {
            errorList.push(`Mobile Number is mandatory.\n`);
        }
        if (!this.isNullOrUndefinedOrEmpty(this.aclist.MOBILE) && (this.aclist.MOBILE.length > 10 || this.aclist.MOBILE.length < 10)) {
            errorList.push(`Mobile Number must be 10 digit.\n`);
        }


        if (errorList.length) {
            this.alertService.error(errorList.toString());
            return false;

        } else {
            return true;
        }
    }







    isNullOrUndefinedOrEmpty(value: string): boolean {

        if (value == null || value == undefined || value == "") {
            return true;
        }
        return false;
    }




}