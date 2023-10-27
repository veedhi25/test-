import { Component, OnInit, AfterViewInit, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { ItemPropertySettingService } from './ItemPropertySetting.service';
import { SpinnerService } from '../../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../../common/services/alert/alert.service';
import { MasterRepo } from '../../../../../common/repositories';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemPriceChangeService } from '../Item-Price-Change/itemPriceChange.service';
import { TaxGroupComponent } from '../../Tax/TaxGroup.component';


@Component(
    {
        selector: 'priceDrop',
        templateUrl: './priceDrop.component.html',
        styleUrls: ["../../../../Style.css"],
        providers: [],

    }
)
export class PriceDropComponent implements OnInit {
    @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
    gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridCatValue") genericGridCatValue: GenericPopUpComponent;
    gridPopupSettingsForCategoryValue: GenericPopUpSettings = new GenericPopUpSettings();

    remarks: string;
    itemList: any;
    showItemList: boolean = false;
    categoryType: string;
    categoryList: any[] = [];
    selecteditemList: any[] = [];
    priceDropObj: any;
    mode: string;
    private returnUrl: string;
    selecte: any[] = [];
    menuitemList: any[] = [];
    selectedOutLets: any[] = [];
    outletList: any[] = [];
    multiselectSetting: any = {
        singleSelection: false,
        text: 'Select',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'desca',
        primaryKey: 'mcode',
        position: 'bottom'

    };
    multiselectOutLetSetting: any = {
        singleSelection: false,
        text: 'Select Outlets',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'COMPANYID',
        primaryKey: 'COMPANYID',
        position: 'bottom'

    };



    constructor(private masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService, private router: Router, private _activatedRoute: ActivatedRoute, protected service: ItemPriceChangeService) {
        this.gridPopupSettingsForCustomer = Object.assign(new GenericPopUpSettings, {
            title: "ITEMS",
            apiEndpoints: `/getMenuItemsPagedListScheme`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "MENUCODE",
                    title: "MCODE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "DESCA",
                    title: "DESCA",
                    hidden: false,
                    noSearch: false
                }
            ]
        })
        this.reset();
        this.getCategoryList();
        this.masterService.masterGetmethod_NEW("/getoutlets").subscribe((res: any) => {
            if (res.status == "ok") {
                this.outletList = res.result;
            } else {
                this.alertService.error(res.message);
            }
        }, error => {
            this.alertService.error(error._body);
        })
    }
    ngOnInit() {

        try {

            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['tag']) {
                this.mode = "edit";
                let tag = this._activatedRoute.snapshot.params['tag'];

                this.service.getPriceDropDetails(tag).subscribe(
                    (response) => {
                        this.itemList = response.result.data;
                        this.priceDropObj = response.result.data[0];
                        if (this.priceDropObj != null) {
                            this.remarks = this.priceDropObj.remarks;
                            this.itemList.forEach(x => {
                                this.selecteditemList.push({
                                    MENUCODE: x.menucode,
                                    mcode: x.mcode,
                                    DESCA: x.desca
                                })
                            });
                        }
                        this.selecteditemList.forEach
                        if (response.result2 != null) {
                            this.selectedOutLets = JSON.parse(response.result2);
                        }
                        this.showItemList = true;
                    }, err => {

                    }
                )
            }

        } catch (ex) {
            alert(ex);
        }
    }
    getCategoryList() {
        this.masterService.getCategoryTypeForPriceDrop().subscribe((data: any) => {
            this.categoryList = data;
        })
    }

    removeSelectedItem(index) {
        this.selecteditemList.splice(index, 1)
    }

    dblClickPopupItem(value) {
        this.selecteditemList.push(value)


    }

    showPopup() {
        this.genericGridCustomer.show("", false, "", false);
    }

    categoryChanged(category) {

        this.showCategoryPopup();

    }

    itemChanged() {



    }
    category: string;

    onClickedApply() {
        this.loadingService.show("Please wait...Getting data.");
        this.priceDropObj.selectedItemList = this.selecteditemList;
        this.masterService.getNewPrice(this.priceDropObj).subscribe(res => {
            if (res.status == "ok") {
                this.itemList = res.result;

                this.loadingService.hide();

            }
            if (res.result !== null || res.result !== 0) {
                this.showItemList = true;
                this.loadingService.hide();
            }
        })

    }

    onClickSave() {
        if (this.remarks == null || this.remarks == "") {
            this.alertService.warning("Please give some tag for this priceDrop as identity");
            return;
        }
        this.itemList.forEach(x => {
            x.remarks = this.remarks;
        });
        this.loadingService.show("Please wait.. Saving your data.");
        this.masterService.savePriceDrop({ mode: this.mode, data: this.itemList, outletList: this.selectedOutLets }).subscribe(res => {
            if (res.status == 'ok') {
                this.loadingService.hide();
                this.alertService.success(res.result)
                this.showItemList = false;
                this.reset();

            }
            else if (res.status == 'error') {
                this.loadingService.hide();
                this.alertService.error(res.result);
            }
        }, error => {
            this.alertService.error(error.result);

        })
    }


    showCategoryPopup() {
        this.gridPopupSettingsForCategoryValue = Object.assign(new GenericPopUpSettings, {
            title: "VALUE",
            apiEndpoints: `/getMenuitemPagedListForScheme/Category`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "variantname",
                    title: "CATEGORY Type",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "category",
                    title: "CATEGORY",
                    hidden: false,
                    noSearch: false
                }

            ]
        })
        this.genericGridCatValue.show();

    }
    dblClickOnCatValue(event) {
        this.categoryType = event.variantname;
        this.category = event.category;
    }
    reset() {
        this.itemList = [];
        this.categoryType = null;
        this.priceDropObj = <any>{};
        this.category = null;
        this.remarks = null;
        this.mode = "new";
        this.selecteditemList = [];
        this.selectedOutLets = [];
        this.priceDropObj.priceDropDaysOrDate = 'No.Of Days';
        this.priceDropObj.PriceDropMode = "Perc(%)";
        this.priceDropObj.PriceChangeNature = "Decrease";
        this.priceDropObj.DROP_BASED_ON = "MRP";
    }

    onMultiSelect(event) {

    }
}