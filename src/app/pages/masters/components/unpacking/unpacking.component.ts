import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { KitConfigService } from './kitconfig.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { UnpackingService } from './unpacking.service';
@Component(
    {
        selector: 'unpacking',
        templateUrl: './unpacking.component.html',
        providers: [UnpackingService, TransactionService],
        styleUrls: ["../../../modal-style.css"],
    }
)
export class UnpackingComponent {
    mode: string = "add";
    router: Router;
    private subcriptions: Array<Subscription> = [];
    products: Array<ProductKit> = [];
    product: string;
    kitConfigQty: number;
    @ViewChild("genericGridProduct") genericGridForProduct: GenericPopUpComponent;
    gridProductPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
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
    REFBILL: any;
    constructor(private masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        private _trnMainService: TransactionService,
        router: Router,
        private unpackingService: UnpackingService) {

        this.onReset();

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
    dblClickPopupProduct(selectedproduct) {
        this.selectedComboItem = selectedproduct;
        this.product = selectedproduct.DESCA;


        this.masterService
            .masterGetmethod(
                "/getSubComboList?parentcode=" +
                this.selectedComboItem.MCODE
            )
            .subscribe(
                res => {
                    if (res.status == "ok") {

                        this.products = JSON.parse(res.result);;
                        if (this.products.length > 0) {

                        }
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

        if (this.masterService.nullToZeroConverter(this.kitConfigQty) == 0) {
            this.alertService.error("Invalid config quantity.");
            return;
        }
        if (this.products.length == 0) {
            this.alertService.error("Invalid product list.");
            return;
        }
        if (!this.selectedComboItem) {
            this.alertService.error("Please select combo item.");
            return;
        }
        if (this.REFBILL == "" || this.REFBILL == null || this.REFBILL == undefined) {
            this.alertService.error("Please select a valid  Combo packing.");
            return;
        }
        this.loadingService.show("Please wait.... Saving your data.");
        const uuidV1 = require('uuid/v1');
        this.guid = uuidV1();
        let saveData = { REFBILL: this.REFBILL, GUID: this.guid, MCODE: this.selectedComboItem.MCODE, QTY: this.kitConfigQty, ProdList: this.products };
        this.unpackingService.saveUnpacking("add", saveData).subscribe(res => {
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




    onReset() {
        this._trnMainService.initialFormLoad(72);
        this.products = [];
        this.product = '';
        this.kitConfigQty = 0;
        this.date = new Date().toISOString().slice(0, 10);
        var comboObj = <any>{};
        comboObj.MCODE = '';
        comboObj.DESCA = '';
        comboObj.UNIT = null;
        comboObj.QTY = null;
        comboObj.BATCH = '';


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

                        this.REFBILL = event.VCHRNO;
                        this.products = tmpProduct;
                        this.selectedComboItem = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].MCODE : ''
                        this.product = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].ITEMDESC : ''

                        this._trnMainService.TrnMainObj.Mode = "NEW";
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


    onViewClicked() {
        this.genericGridview.show("", false, "combolistforview");
    }


    preventInput($event) {
        $event.preventDefault();
        return false;
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
}
export interface ProductTrn {
    VCHRNO: string;
    MCODE: string;
    QTY: string;
    ProdList: ProductKit[];
    TRNDATE: Date | string;
}