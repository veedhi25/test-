import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { VoucherTypeEnum } from '../../../../common/interfaces/TrnMain';

@Component(
    {
        selector: 'production-quality-check',
        templateUrl: './production-quality-check.component.html',

    }
)
export class ProductionQualityCheckComponent {
    mode: string = "add";
    router: Router;
    private subcriptions: Array<Subscription> = [];
    products: Array<ProductKit> = [];
    product: string;
    kitConfigQty: number;
    @ViewChild("genericGridProduct") genericGridForProduct: GenericPopUpComponent;
    gridProductPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridItem") genericGridForItem: GenericPopUpComponent;
    gridItemPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridview") genericGridview: GenericPopUpComponent;
    gridItemviewSettings: GenericPopUpSettings = new GenericPopUpSettings();
    activerowIndex: number = 0;
    productObj: ProductKit = <ProductKit>{};
    showStockedQuantityOnly = 0;
    date: any;
    selectedComboItem: any;
    guid: any;
    TRNDATE: string | Date;
    VCHRNO: string;
    ComBoBatch: any;
    IsShow: boolean = true;
    public selectAll: boolean = false;
    constructor(private masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        private _trnMainService: TransactionService,
        router: Router,
        private masterRepo: MasterRepo) {

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
                    key: 'VCHRNO',
                    title: 'Combo No',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'TRNDATE',
                    title: 'Date',
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
                    title: 'Main Stock',
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: 'PendingQualityQty',
                    title: 'Pending Quality Qty',
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
        this.genericGridForProduct.show(null, false, "productionitem");
    }
    dblClickPopupProduct(selectedproduct) {
        this.selectedComboItem = selectedproduct;
        this.product = selectedproduct.DESCA;


        this.masterService
            .masterGetmethod(
                "/getSubQualityComboList?parentcode=" +
                this.selectedComboItem.MCODE
            )
            .subscribe(
                res => {
                    if (res.status == "ok") {
                        this.IsShow = true;
                        this.products = JSON.parse(res.result);;

                    }
                    else {
                        this.IsShow = false;
                        this.alertService.error(res.result);

                    }
                },
                error => {
                    this.alertService.error(error._body);
                }
            );
    }
    rowIndex: any;
    RowClick(index) {
        this.activerowIndex = this.rowIndex = index;
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
        var voucherList = '';
        var voucherAcceptQtyList = '';
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].ConfigurationAccess == true) {
                voucherList += '~' + this.products[i].VCHRNO;
                voucherAcceptQtyList += '~' + this.products[i].VCHRNO + '_' + this.products[i].AcceptQty;
            }
        }
        if (voucherList.toString() == '') {
            this.alertService.error("Please Select any one record");
            return;
        }

        if (this._trnMainService.TrnMainObj.Mode.toUpperCase() == "VIEW") {
            this.alertService.error("Cannot Save in View Mode.");
            return;
        }
        if (!this.selectedComboItem || this.selectedComboItem == '' || this.selectedComboItem == null) {
            this.alertService.error("Please select combo.");
            return;
        }
        this.loadingService.show("Please wait.... Saving your data.");
        let saveData = { VCHRNo: voucherList, AcceptQty: voucherAcceptQtyList };



        this.masterRepo.masterPostmethod('/saveQualityComboItems', saveData).subscribe(res => {
            if (res.status == "ok") {
                this.alertService.success("Data Saved Successfully");
                this.onReset();
                this.loadingService.hide();

            }
            else {
                this.loadingService.hide();
                this.alertService.error(res.result._body);

            }
        })
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
                this.products[this.activerowIndex].UNIT = item.UNIT
            }
            else {
                return;
            }
        }
        else {
            this.products[this.activerowIndex].MCODE = item.MCODE;
            this.products[this.activerowIndex].DESCA = item.DESCA;
            this.products[this.activerowIndex].UNIT = item.UNIT
            this.masterService.focusAnyControl("qty" + this.activerowIndex);
        }
    }

    onReset() {
        this.IsShow = true;
        this._trnMainService.initialFormLoad(VoucherTypeEnum.Production);
        this.products = [];
        this.product = '';
        this.kitConfigQty = 0;
        this.ComBoBatch = null;
        this.date = new Date().toISOString().slice(0, 10);
        var comboObj = <any>{};
        comboObj.MCODE = '';
        comboObj.DESCA = '';
        comboObj.UNIT = null;
        comboObj.QTY = null;
        comboObj.BATCH = '';
        const uuidV1 = require('uuid/v1');
        this.guid = uuidV1();

        this.products.push(comboObj);

        setTimeout(() => {
            this.masterService.focusAnyControl("menuCode" + this.activerowIndex);
        }, 100);
    }

    dblClickview(event) {

        this.masterService.LoadTransaction(event.VCHRNO, event.DIVISION, event.PHISCALID, "VIEW").subscribe(
            data => {
                this.loadingService.hide();
                if (data.status == "ok") {
                    this._trnMainService.TrnMainObj = data.result;
                    if (data.result && data.result.ProdList) {
                        this.kitConfigQty = data.result.ProdList.filter(x => x.RealQty == 0)[0].REALQTY_IN;
                        this.date = data.result.TRNDATE.substring(0, 10);
                        let tmpProduct = [];
                        data.result.ProdList.filter(x => x.RealQty > 0).forEach(prod => {
                            tmpProduct.push(<ProductKit>{
                                QTY: this.masterService.nullToZeroConverter(prod.Quantity) / this.masterService.nullToZeroConverter(this.kitConfigQty),
                                UNIT: prod.UNIT,
                                MCODE: prod.MCODE,
                                DESCA: prod.ITEMDESC,
                                BATCH: prod.BATCH,
                                MFGDATE: prod.MFGDATE.toString().substring(0, 10),
                                EXPDATE: prod.EXPDATE.toString().substring(0, 10),
                                PRATE: prod.PRATE
                            })
                        });

                        this.products = tmpProduct;
                        this.selectedComboItem = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].MCODE : ''
                        this.product = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].ITEMDESC : ''
                        this.ComBoBatch = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].BATCH : ''

                        this._trnMainService.TrnMainObj.Mode = "VIEW";
                    }

                }
            },
            error => {
                this.loadingService.hide();
                this.alertService.error(error._body);
            },
            () => {
                this.loadingService.hide();
            }
        );
    }
    PlistTitle = "BATCH";
    model1Closed() {
        this.masterService.PlistTitle = "";
    }
    returnBatch(event) {
        this.products[this.activerowIndex].BATCH = event.BATCH;
        this.products[this.activerowIndex].EXPDATE = event.EXPIRY.substring(0, 10);
        this.products[this.activerowIndex].MFGDATE = event.MFGDATE.substring(0, 10);
        this.products[this.activerowIndex].PRATE = event.PRATE;
        this.masterService.PlistTitle = "";
    }
    dblClickPopupBatch(value) {
        this.returnBatch(value);
    }

    onViewClicked() {
        this.genericGridview.show("", false, "productionforview");
    }
    getBatchOfItem(index, data: ProductKit) {
        if (data.MCODE == '' || data.MCODE == undefined || data.MCODE == null) {
            this.alertService.warning("Please select item first.")
            return;
        }
        this.masterService.RemoveFocusFromAnyControl("batch" + index)
        this.masterService.masterPostmethod("/getBatchListOfItem", { mcode: data.MCODE })
            .subscribe(res => {
                if (res.status == "ok") {
                    this._trnMainService.batchlist = JSON.parse(res.result);
                    this.masterService.PlistTitle = 'batchList';
                }
                else {
                    this.alertService.error(res.result);
                };

            }, error => {
                this.alertService.error(error);

            }
            );
    }


    preventInput($event) {
        $event.preventDefault();
        return false;
    }

    getSelectAllRecord() {

        if (this.selectAll == true) {
            for (var i = 0; i < this.products.length; i++) {

                if (this.products[i].ConfigurationAccess == false) {
                    this.products[i].ConfigurationAccess = true;
                }
            }

        }
        else {
            for (var i = 0; i < this.products.length; i++) {
                this.products[i].ConfigurationAccess = false;
            }
        }
    }

}
export interface ProductKit {
    EXPDATE: Date | string;
    MFGDATE: Date | string;
    MCODE: string;
    DESCA: string;
    QTY: number;
    UNIT: number;
    BATCH: string;
    PRATE: number;
    VCHRNO: string;
    ConfigurationAccess: boolean;
    AcceptQty: number;
}
export interface ProductTrn {
    VCHRNO: string;
    MCODE: string;
    QTY: string;
    ProdList: ProductKit[];
    TRNDATE: Date | string;
}