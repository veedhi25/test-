import { Component, ViewChild } from "@angular/core";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SchemeViewService } from "./scheme-view.service";
import { DatePipe } from "@angular/common";
import { MasterRepo } from "../../../../common/repositories";
import { AuthService } from "../../../../common/services/permission/authService.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";


@Component(
    {
        selector: 'scheme-view',
        templateUrl: './scheme-view.component.html',
        providers: [TransactionService]
    }
)

export class SchemeViewComponent {
    @ViewChild('schemeNumberList') schemeNumberList: GenericPopUpComponent;
    public schemeNumberListPopUpSetting: GenericPopUpSettings = new GenericPopUpSettings();
    public schemeData: SchemeView = <SchemeView>{}
    public skusDetailIndex = 0
    private disableBack: boolean = true;
    public mode: string = "VIEW";
    showSchemeFilterpopUp: boolean;
    schemeFilterObj: IschemeFilter = <IschemeFilter>{};
    userProfile: any = <any>{};
    OnlyForCentral: boolean;
    buttontag: string;
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    allCategory: any[] = [];

    constructor(
        private _schemeViewService: SchemeViewService,
        private _spinnerService: SpinnerService,
        private _alertService: AlertService,
        private _masterService: MasterRepo,
        private loadingService: SpinnerService,
        private authservice: AuthService,
        public _trnMainService: TransactionService,
    ) {


        this._masterService.masterGetmethod_NEW("/getAllHierachy").subscribe((res) => {
            if (res.status == "ok") {
                this.allCategory = res.result.GEO;
            }
        })

        this.gridPopupSettings = {
            title: "ITEMS",
            apiEndpoints: `/getMenuitemWithStockPagedList/0/${'all'}/${'NO'}/${this._trnMainService.userProfile.userWarehouse}`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'DESCA',
                    title: 'DESCRIPTION',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'MENUCODE',
                    title: 'ITEM CODE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'STOCK',
                    title: 'STOCK',
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: 'MRP',
                    title: 'MRP',
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: 'BARCODE',
                    title: 'BARCODE',
                    hidden: true,
                    noSearch: false
                }
            ]
        };
        this.userProfile = authservice.getUserProfile();

        this.schemeFilterObj.DATE1 = new Date().toJSON().split('T')[0];
        this.changeEntryDate(this.schemeFilterObj.DATE1, "AD");
        this.schemeFilterObj.DATE2 = new Date().toJSON().split('T')[0];
        this.changeEndDate(this.schemeFilterObj.DATE2, "AD");

        this.schemeNumberListPopUpSetting = {
            title: "Scheme Number List",
            apiEndpoints: `/getSchemeNumberPagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "SCHEMENO",
                    title: "Scheme Number",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "SCHEMEDESCRIPTION",
                    title: "Scheme Description",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "BUDGETLEVEL",
                    title: "Channel",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ExpireOn",
                    title: "Expire on",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "SchemeStatus",
                    title: "Status",
                    hidden: false,
                    noSearch: false
                }
            ]
        };
    }


    showSchemeNumber() {
        this._trnMainService.customerEvent = true;
        this.schemeNumberList.show()
    }
    onKeydownPreventEdit(event) {
        if (event.key === "Enter" || event.key === "Tab") { }
        else {
            event.preventDefault();
        }
    }




    onProductClicked(i) {
        this.skusDetailIndex = i
    }
    onSchemeNumberClick(event) {
        if (this.showSchemeFilterpopUp == true) {
            this.schemeFilterObj.SCHEMENO = event.SCHEMENO;
        } else {

            try {
                this._spinnerService.show("Please Wait! Data is Loading")

                this._schemeViewService.schemeView(event.SCHEMENO).subscribe((res) => {
                    this.schemeData = Object.assign({}, res.result)
                    this._spinnerService.hide()
                    this.disableBack = false;
                }, error => {
                    this._spinnerService.hide()
                    this._alertService.error(error)
                })
            } catch (ex) {
                this._alertService.error(ex)
            }

        }
    }

    Back() {
        this.schemeData = <any>{};
        this.schemeData.skUs = null;
        this.schemeData.discounts = null;
        this.mode = "VIEW";
    }
    
    addNewScheme() {
        this.mode = "NEW";
        this.schemeData = <any>{};
        this.schemeData.schemeType = "QTY";
        this.schemeData.status = "ACTIVE";
        this.schemeData.type = "TPP";
        this.schemeData.prorata = "1";
        this.schemeData.skUs = [];
        this.schemeData.discounts = [];
        this.addDiscountRange(0);
        this.addNewProductScheme(0);
    }

    ExportScheme() {
        this.buttontag = "schemeExport";
        this.showSchemeFilterpopUp = true;
    }

    SChemeEnterClicked(event) {
        this.schemeNumberList.show();
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.schemeFilterObj.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);

        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this.schemeFilterObj.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }

    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.schemeFilterObj.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this.schemeFilterObj.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }

    }




    ExportFixedDiscount() {
        //need to popup like scheme view
        this.buttontag = "fixeddiscountExport";
        this.showSchemeFilterpopUp = true;
    }



    CancelCommand() {
        this.showSchemeFilterpopUp = false;
    }

    ngOnInit() {
        let orgType = this.userProfile.CompanyInfo.ORG_TYPE;
        // console.log("userp[rofile",this.userProfile);
        if (orgType.toLowerCase() != "central") {
            this.OnlyForCentral = false;
        }
        else {
            this.OnlyForCentral = true
        }
    }



    removeSKUFromList = (index): void => {
        this.schemeData.skUs.splice(index, 1)
    }


    addNewProductScheme = (index: number): boolean => {
        if (this.schemeData.skUs.some(x => x.sku == null || x.sku == "" || x.sku == undefined)) { return false; }
        let newProdScheme = <any>{};
        newProdScheme.brand = "";
        newProdScheme.sku = "";
        this.schemeData.skUs.push(newProdScheme);

        let nextIndex = index + 1;
        this.skusDetailIndex = nextIndex;
        setTimeout(() => this._masterService.focusAnyControl("mcode" + nextIndex));
        return true;
    }
    addDiscountRange(index: number) {
        let discount = <any>{};
        discount.schemeType = "QTY";
        discount.uom = "pcs";
        discount.value = null;
        discount.greaterOrEqual = null;
        discount.valueType = "Percentage";
        this.schemeData.discounts.push(discount);
        let nextIndex = index + 1;
        setTimeout(() => this._masterService.focusAnyControl("greaterOrEqual" + nextIndex));
        return true;
    }


    saveNewScheme() {
        if (this.schemeData.schemeNo == null || this.schemeData.schemeNo == "" || this.schemeData.schemeNo == undefined) {
            this._alertService.error("Invalid Scheme Number");
            return;
        }
        if (this.schemeData.budgetlevel == null || this.schemeData.budgetlevel == "" || this.schemeData.budgetlevel == undefined) {
            this._alertService.error("Invalid Channel");
            return;
        }
        if (this.schemeData.validFrom == null || this.schemeData.validFrom == "" || this.schemeData.validFrom == undefined) {
            this._alertService.error("Invalid From Date");
            return;
        }
        if (this.schemeData.validTo == null || this.schemeData.validTo == "" || this.schemeData.validTo == undefined) {
            this._alertService.error("Invalid To Date");
            return;
        }




        let validdiscountrange = this.schemeData.discounts.filter(x => parseFloat(x.greaterOrEqual) > 0 && parseFloat(x.value));

        if (validdiscountrange.length == 0) {
            this._alertService.error("Invalid Discount Ranges.");
            return;
        };
        let validProductlist = this.schemeData.skUs.filter(x => x.sku != "");
        if (validProductlist.length == 0) {
            this._alertService.error("Invalid Product List.");
            return;
        };

        this.loadingService.show("Saving Scheme.Please wait....")
        this._masterService.masterPostmethod_NEW("/saveScheme", this.schemeData).subscribe((res) => {
            this.loadingService.hide();
            if (res.status == "ok") {
                this._alertService.success('saved successfully');
                this.Back();
            } else {
                this._alertService.error(res.message);
            }
        }, error => {
            this.loadingService.hide();
        })
    }


    onMcodeEnterEvent = (event, index: number): void => {
        event.preventDefault();
        this.genericGrid.show();
        this.skusDetailIndex = index;
    }


    dblClickPopupItem = (value): void => {
        this.schemeData.skUs[this.skusDetailIndex].sku = value.MCODE;
        this.schemeData.skUs[this.skusDetailIndex].brand = value.DESCA;

        this.addNewProductScheme(this.skusDetailIndex);
    }























    updateScheme = (): void => {
        this.loadingService.show("Please Wait While updating scheme.");
        this._masterService.masterPostmethod_NEW("/updatescheme", this.schemeData).subscribe((res) => {
            this.loadingService.hide();
            if (res.status == "ok") {
                this.Back();
            }
        }, error => {
            this.loadingService.hide();
        })
    }
}


export interface SchemeView {
    budgetlevel: string;
    budget: string
    claimable: number
    combi: number
    prorata: number | string
    qps: number
    discounts: any[]
    schemeDescription: string
    schemeNo: string
    schemeType: string
    skUs: any[]
    status: string
    type: string
    validFrom: string
    validTo: string
    applied: string

}

export interface IschemeFilter {
    SCHEMENO: string;
    BSDATE1: string;
    BSDATE2: string;
    DATE1: string;
    DATE2: string;
    Status: string;
    Approval: string;
}