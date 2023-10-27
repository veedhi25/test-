import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { KitConfigService } from './kitconfig.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
@Component(
    {
        selector: 'kitconfig',
        templateUrl: './kitconfig.component.html',
        providers: [KitConfigService, TransactionService],
        styleUrls: ["../../../modal-style.css"],
    }
)
export class KitConfigComponent {
    mode: string = "add";
    router: Router;
    private subcriptions: Array<Subscription> = [];
    products: Array<ProductKit> = [];
    product: string;
    kitConfigQty: number;
    kitconfigunit: string;
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
    ComboMRP: number;
    ComBoPRATE: number;
    ComBoSRATE: number;
    alternateUnits: any[] = [];
    constructor(private masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        private _trnMainService: TransactionService,
        router: Router,
        private kitConfigService: KitConfigService) {

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



        this.masterService.masterGetmethod_NEW(`/getAltUnitsOfItem/${this.selectedComboItem.MCODE}`).subscribe((res) => {
            this.alternateUnits = JSON.parse(res.result);
        })
    }
    rowIndex: any;
    RowClick(index) {
        this.activerowIndex = this.rowIndex = index;
    }

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
        if (this._trnMainService.TrnMainObj.Mode.toUpperCase() == "VIEW") {
            this.alertService.error("Cannot Save in View Mode.");
            return;
        }
        if (!this.selectedComboItem || this.selectedComboItem == '' || this.selectedComboItem == null) {
            this.alertService.error("Please select combo.");
            return;
        }



        let confactor = 1;
        let altUnit = this.alternateUnits.filter(x => x.ALTUNIT == this.kitconfigunit)[0];
        if (altUnit != null) {
            confactor = this._trnMainService.nullToZeroConverter(altUnit.CONFACTOR) == 0 ? 1 : altUnit.CONFACTOR;
        }



        this.loadingService.show("Please wait.... Saving your data.");
        let saveData = {
            ComBoBatch: this.ComBoBatch,
            ComboMRP: this.ComboMRP,
            ComBoPRATE: this.ComBoPRATE,
            ComBoSRATE: this.ComBoSRATE,
            CONFACTOR: confactor,
            ComBoUnit: this.kitconfigunit,
            GUID: this.guid,
            MCODE: this.selectedComboItem.MCODE,
            QTY: this.kitConfigQty,
            ProdList: this.products
        };
        this.kitConfigService.saveKitConfig("add", saveData).subscribe(res => {
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



    onKitConfitQuantityChange() {



        let altunit = this.alternateUnits.filter(x => x.ALTUNIT == this.kitconfigunit)[0];


        let confactor = 1;
        if (altunit) {
            confactor = this._trnMainService.nullToZeroConverter(altunit.CONFACTOR) == 0 ? 1 : altunit.CONFACTOR;
        }


        if (this._trnMainService.TrnMainObj.Mode.toUpperCase() == "NEW") {
            this.products.forEach(x => {
                x.ReqQty = this._trnMainService.nullToZeroConverter(x.QTY) * this._trnMainService.nullToZeroConverter(this.kitConfigQty) * this._trnMainService.nullToZeroConverter(confactor) / this._trnMainService.nullToZeroConverter(x.Factor);
                x.TotAmnt = this._trnMainService.nullToZeroConverter(x.QTY) * this._trnMainService.nullToZeroConverter(x.PRATE) * this._trnMainService.nullToZeroConverter(confactor) / this._trnMainService.nullToZeroConverter(x.Factor);

            })
        }
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
        this._trnMainService.initialFormLoad(72);
        this.products = [];
        this.product = '';
        this.kitConfigQty = 0;
        this.kitconfigunit = null;
        this.ComBoBatch = null;
        this.ComboMRP = null;
        this.ComBoPRATE = null;
        this.ComBoSRATE = null;
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
                        this.date = data.result.TRNDATE.substring(0, 10);
                        let tmpProduct = [];
                        data.result.ProdList.filter(x => x.RealQty > 0).forEach(prod => {
                            tmpProduct.push(<any>{
                                QTY: this.masterService.nullToZeroConverter(prod.Quantity),
                                UNIT: prod.UNIT,
                                MCODE: prod.MCODE,
                                DESCA: prod.ITEMDESC,
                                BATCH: prod.BATCH,
                                MFGDATE: prod.MFGDATE.toString().substring(0, 10),
                                EXPDATE: prod.EXPDATE.toString().substring(0, 10),
                                PRATE: prod.PRATE,
                                NETAMOUNTFORVIEW:prod.NETAMOUNT
                            })
                        });

                        this.products = tmpProduct;
                        this.selectedComboItem = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0] : ''
                        this.product = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].ITEMDESC : ''
                        this.ComBoBatch = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].BATCH : ''
                        this.ComboMRP = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].MRP : ''
                        this.ComBoPRATE = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].PRATE : ''
                        this.ComBoSRATE = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].SPRICE : ''
                        this.kitconfigunit = (data.result.ProdList.filter(x => x.RealQty == 0)).length ? data.result.ProdList.filter(x => x.RealQty == 0)[0].ALTUNIT : ''

                        this._trnMainService.TrnMainObj.Mode = "VIEW";
                        this.masterService.masterGetmethod_NEW(`/getAltUnitsOfItem/${this.selectedComboItem.MCODE}`).subscribe((res) => {
                            this.alternateUnits = JSON.parse(res.result);
                            let confactor = 1;
                            let alunit = this.alternateUnits.filter(x => x.ALTUNIT == this.kitconfigunit)[0];
                            if (alunit != null) {
                                confactor = alunit.CONFACTOR;
                            }
                            this.kitConfigQty = (data.result.ProdList.filter(x => x.RealQty == 0)[0].REALQTY_IN) / this._trnMainService.nullToZeroConverter(confactor);
                            this.products.forEach((x: any) => {
                                x.Factor = 1;
                                x.TotAmnt = x.NETAMOUNTFORVIEW
                            })
                            this.onKitConfitQuantityChange();


                        })

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
        this.onKitConfitQuantityChange();
    }
    dblClickPopupBatch(value) {
        this.returnBatch(value);
    }

    onViewClicked() {
        this.genericGridview.show("", false, "combolistforview");
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
                    this.masterService.PlistTitle = 'batchListold';
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



}
export interface ProductKit {
    Factor: number;
    TotAmnt: number;
    ReqQty: number;
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