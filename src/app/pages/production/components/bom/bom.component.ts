import { Component, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
@Component(
    {
        selector: 'bom',
        templateUrl: './bom.component.html',
    }
)
export class BOMComponent {
    mode: string = "add";
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
    receipemain: ReceipeMain = <ReceipeMain>{};

    constructor(private masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        private _trnMainService: TransactionService,
        private MasterRepo: MasterRepo) {
        this.onReset();

        this.gridItemPopupSettings = Object.assign(new GenericPopUpSettings, {
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
            apiEndpoints: `/getReceipeItemList`,
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
        this.genericGridForProduct.show();
    }
    dblClickPopupProduct(selectedproduct, mode: string = "NEW") {
        this.receipemain.MCODE = selectedproduct.MCODE;
        this.receipemain.ENO = selectedproduct.ENO;
        this.receipemain.DESCA = selectedproduct.DESCA;
        this.receipemain.FACTOR = selectedproduct.FACTOR;


        this.masterService
            .masterGetmethod("/getReceipeProdList?ENO=" + (this.receipemain.ENO ? this.receipemain.ENO : 0))
            .subscribe(
                res => {
                    if (res.status == "ok" && res.result != null && res.result.length) {

                        this.receipemain.prodList = res.result;
                        this.mode = mode;

                    } else {
                        this.mode = "NEW"
                        this.receipemain.prodList = [];
                        let comboObj = <ReceipeProd>{};
                        this.receipemain.prodList.push(comboObj);
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
            this.receipemain.prodList.splice(this.activerowIndex, 1);
        }
    }
    //adding next row with null value
    addNextRow(data, index) {
        if (!data.RMCODE) {
            this.alertService.warning("Product is required.");
            return;
        }
        if (this.checkValidation(data)) {
            this.activerowIndex = index;
            let product: ReceipeProd = <ReceipeProd>{};
            product.DESCA = "";
            product.RMCODE = "";
            product.QTY = null;
            this.receipemain.prodList.push(product);
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
                let newProductObj: ReceipeProd = <ReceipeProd>{};
                newProductObj.DESCA = "";
                newProductObj.RMCODE = "";
                newProductObj.QTY = null;
                this.receipemain.prodList.push(newProductObj);
            }
            else {
                this.masterService.focusAnyControl("mcode" + this.activerowIndex);
                return;
            }
        }
    }
    //validation for product
    checkValidation(data: ReceipeProd) {
        if ((data.RMCODE) && (data.QTY)) {
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
        if (this.receipemain.MCODE == '' || this.receipemain.MCODE == null || this.receipemain.MCODE == undefined) {
            this.alertService.error("Please select combo pack.");
            return;
        }
        else {
            this.loadingService.show("Please wait.... Saving your data.");
            let bodyData = {
                mode: this.mode,
                data: this.receipemain
            };

            this.MasterRepo.masterPostmethod('/saveReceipeItem', bodyData).subscribe(res => {
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
        if (this.receipemain.prodList.filter(x => x.RMCODE == item.MCODE)[0] != null) {
            if (confirm("Are you sure you want to add " + item.DESCA + "again ?")) {
                this.receipemain.prodList[this.activerowIndex].RMCODE = item.MCODE;
                this.receipemain.prodList[this.activerowIndex].DESCA = item.DESCA;
                this.receipemain.prodList[this.activerowIndex].UNIT = item.UNIT;
            }
            else {
                return;
            }
        }
        else {
            this.receipemain.prodList[this.activerowIndex].RMCODE = item.MCODE;
            this.receipemain.prodList[this.activerowIndex].DESCA = item.DESCA;
            this.receipemain.prodList[this.activerowIndex].UNIT = item.UNIT;
            this.masterService.focusAnyControl("qty" + this.activerowIndex);
        }


    }

    onReset() {
        this.receipemain = <ReceipeMain>{};
        this.receipemain.prodList = [];
        this.product = '';
        let comboObj = <ReceipeProd>{};
        this.receipemain.prodList.push(comboObj);
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
        this.genericGridview.show("", false, "receipemainlist");
    }
    onEditClicked() {
        this.genericGridedit.show("", false, "receipemainlist");
    }
}
export interface ReceipeMain {
    DESCA: any;
    ENO: number;
    MCODE: string;
    FACTOR: string;
    prodList: ReceipeProd[];
}
export interface ReceipeProd {
    UNIT: any;
    DESCA: any;
    ENO: number;
    RMCODE: string;
    QTY: string;

}