import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { ComboItemService } from './comboitem.service';
@Component(
    {
        selector: 'comboitem',
        templateUrl: './comboitem.component.html',
        providers: [ComboItemService, TransactionService],
        styleUrls: ["../../../modal-style.css"],
    }
)
export class ComboItemComponent {
    mode: string = "add";
    router: Router;
    private subcriptions: Array<Subscription> = [];
    products: Array<ProductKit> = [];
    product: string;
    @ViewChild("genericGridProduct") genericGridForProduct: GenericPopUpComponent;
    gridProductPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridItem") genericGridForItem: GenericPopUpComponent;
    gridItemPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridview") genericGridview: GenericPopUpComponent;
    gridItemviewSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridedit") genericGridedit: GenericPopUpComponent;
    gridItemeditSettings: GenericPopUpSettings = new GenericPopUpSettings();
    activerowIndex: number = 0;
    productObj: ProductKit = <ProductKit>{};
    showStockedQuantityOnly = 0;
    date: any;
    selectedComboItem: any;
    guid: any;
    factor: number = 1;
    constructor(private masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        private _trnMainService: TransactionService,
        router: Router,
        private comboItemService: ComboItemService) {
        this.onReset();

        this.gridItemPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "ITEMS",
            apiEndpoints: `/getMenuitemWithStockPagedList/${this.showStockedQuantityOnly}/${'all'}/${'NO'}/${this._trnMainService.userProfile.userWarehouse}`,
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
        })
        this.gridItemviewSettings = {
            title: "Combo Configuration",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'MCODE',
                    title: 'MCODE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'DESCA',
                    title: 'Combo Item Name',
                    hidden: false,
                    noSearch: false
                }
            ]
        }
        this.gridItemeditSettings = {
            title: "Combo Configuration",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'MCODE',
                    title: 'MCODE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'DESCA',
                    title: 'Combo Item Name',
                    hidden: false,
                    noSearch: false
                }
            ]
        }

    }

    ngOnInit() {
        this.gridProductPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "ITEMS",
            apiEndpoints: `/getMenuitemWithStockPagedList/${this.showStockedQuantityOnly}/${'all'}/${'NO'}/${this._trnMainService.userProfile.userWarehouse}`,
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
        })
    }
    //popup for main products 
    productSelect() {
        this.genericGridForProduct.show(null, false, "combo");
    }
    dblClickPopupProduct(selectedproduct, mode: string = "NEW") {
        this.selectedComboItem = selectedproduct;
        this.product = selectedproduct.DESCA;
        this.factor = selectedproduct.FACTOR;


        this.masterService
            .masterGetmethod(
                "/getSubComboList?parentcode=" +
                this.selectedComboItem.MCODE
            )
            .subscribe(
                res => {
                    if (res.status == "ok") {

                        this.products = JSON.parse(res.result);
                        this.mode = mode;

                    } else {
                        this.mode = "NEW"
                        this.products = [];
                        var comboObj = <any>{};
                        comboObj.MCODE = '';
                        comboObj.DESCA = '';
                        comboObj.UNIT = null;
                        comboObj.QTY = null;
                        const uuidV1 = require('uuid/v1');
                        this.guid = uuidV1();
                        this.products.push(comboObj);
                        setTimeout(() => {
                            this.masterService.focusAnyControl("menuCode" + this.activerowIndex);
                        }, 100);
                    }
                },
                error => {
                }
            );
    }
    rowIndex: any;
    RowClick(index) {
        this.activerowIndex = this.rowIndex = index;
    }
    //deleting row
    deleteRow(index: number) {
        this.activerowIndex = index;
        if (confirm("Are you sure u you want to delete the Row?")) {
            this.products.splice(this.activerowIndex, 1);
        }
    }
    //adding next row with null value
    addNextRow(data, index) {
        if (!data.MCODE) {
            this.alertService.warning("Product is required.");
            return;
        }
        if (this.checkValidation(data)) {
            this.activerowIndex = index;
            let product: ProductKit = <ProductKit>{};
            product.DESCA = "";
            product.MCODE = "";
            product.QTY = null;
            this.products.push(product);
            var nextindex = this.activerowIndex + 1;
            var elmnt = document.getElementById("sno" + this.activerowIndex);
            elmnt.scrollIntoView();
            setTimeout(() => {

                this.masterService.focusAnyControl("menuCode" + nextindex);


            }, 500);

        }
        else {
            if (confirm("Are you sure you want to proceed with empty data?")) {
                this.activerowIndex = index;
                let newProductObj: ProductKit = <ProductKit>{};
                newProductObj.DESCA = "";
                newProductObj.MCODE = "";
                newProductObj.QTY = null;
                this.products.push(newProductObj);
            }
            else {
                this.masterService.focusAnyControl("mcode" + this.activerowIndex);
                return;
            }
        }
    }
    //validation for product
    checkValidation(data: ProductKit) {
        if ((data.DESCA) && (data.MCODE) && (data.QTY)) {
            return true;
        }
        else {
            return false;
        }
    }

    //for saving product
    onSaveClicked() {
        if (this.mode.toUpperCase() == "VIEW") {
            this.alertService.error("Cannot Save in view Mode");
            return;
        }
        if (this.selectedComboItem == '' || this.selectedComboItem == null || this.selectedComboItem == undefined) {
            this.alertService.error("Please select combo pack.");
            return;
        }
        else {
            this.loadingService.show("Please wait.... Saving your data.");
            let saveArray: any[] = [];
            this.products.filter(y => y.MCODE != null && y.MCODE != "").forEach(x => {
                let saveObj = {
                    MCODE: x.MCODE,
                    GROUPID: this.selectedComboItem.MCODE,
                    Quantity: x.QTY,
                    Factor: this.factor ? this.factor : 1
                }
                saveArray.push(saveObj);
            })
            this.comboItemService.saveComboConfig(this.mode, saveArray).subscribe(res => {
                if (res.status == "ok") {
                    this.alertService.success("Data Saved Successfully");
                    this.onReset();
                    this.loadingService.hide();

                }
                else {
                    this.loadingService.hide();
                    this.alertService.error(res.result._body);

                }
            }, error => {
            })
        }
    }

    //popup for kit item
    showItemPopUp(index: number) {
        this.genericGridForItem.show("", false, "noncombo");
        this.activerowIndex = index;
    }







    dblClickPopupItem(item) {
        if (this.products.filter(x => x.MCODE == item.MCODE)[0] != null) {
            if (confirm("Are you sure you want to add " + item.DESCA + "again ?")) {
                this.products[this.activerowIndex].MCODE = item.MCODE;
                this.products[this.activerowIndex].DESCA = item.DESCA;
                this.products[this.activerowIndex].UNIT = item.UNIT;
            }
            else {
                return;
            }
        }
        else {
            this.products[this.activerowIndex].MCODE = item.MCODE;
            this.products[this.activerowIndex].DESCA = item.DESCA;
            this.products[this.activerowIndex].UNIT = item.UNIT;
            this.masterService.focusAnyControl("qty" + this.activerowIndex);
        }

        this.masterService.masterGetmethod_NEW(`/getAltUnitsOfItem/${item.MCODE}`).subscribe((res) => {
            this.products[this.activerowIndex].alternateUnits = JSON.parse(res.result);
        })
    }

    onReset() {
        this.products = [];
        this.product = '';
        var comboObj = <any>{};
        comboObj.MCODE = '';
        comboObj.DESCA = '';
        comboObj.UNIT = null;
        comboObj.QTY = null;
        this.factor = null;
        const uuidV1 = require('uuid/v1');
        this.guid = uuidV1();
        this.products.push(comboObj);
        this.mode = "NEW";
        setTimeout(() => {
            this.masterService.focusAnyControl("menuCode" + this.activerowIndex);
        }, 100);
    }

    dblClickview(event) {

        this.dblClickPopupProduct(event, "VIEW")
    }
    dblClickedit(event) {

        this.dblClickPopupProduct(event, "EDIT")
    }




    onViewClicked() {
        this.genericGridview.show("", false, "comboconfiglist");
    }
    onEditClicked() {
        this.genericGridedit.show("", false, "comboconfiglist");
    }
}
export interface ProductKit {
    alternateUnits: any;
    MCODE: string;
    DESCA: string;
    QTY: number;
    UNIT: number;
}
export interface ProductTrn {
    VCHRNO: string;
    MCODE: string;
    QTY: string;
    ProdList: ProductKit[];
    TRNDATE: Date | string;
}