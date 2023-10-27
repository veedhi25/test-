import { Component, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { VoucherTypeEnum } from '../../../../common/interfaces/TrnMain';
@Component(
    {
        selector: 'production-target',
        templateUrl: './production-target.component.html',
    }
)
export class ProductionTargetComponent {
    mode: string = "NEW";
    @ViewChild("genericGridProduct") genericGridForProduct: GenericPopUpComponent;
    gridProductPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridview") genericGridview: GenericPopUpComponent;
    gridItemviewSettings: GenericPopUpSettings = new GenericPopUpSettings();
    activerowIndex: number = 0;



    productionTarget: ReceipeMain = <ReceipeMain>{}
    companyProfile: any;

    constructor(private masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        private _trnMainService: TransactionService,
        private masterRepo: MasterRepo) {
        this.companyProfile = this._trnMainService.userProfile.CompanyInfo;
        this.onReset();
        this.gridItemviewSettings = {
            title: "Production Target Entries",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'VCHRNO',
                    title: 'Production No',
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
            apiEndpoints: `/getMasterPagedListOfAny`,
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
            ]
        })
    }
    productSelect() {
        this.genericGridForProduct.show("", false, "receipemainlist");
    }
    dblClickPopupProduct(selectedproduct) {
        this.productionTarget.MCODE = selectedproduct.MCODE;
        this.productionTarget.DESCA = selectedproduct.DESCA;

        this.productionTarget.ENO = selectedproduct.ENO;

        this.masterService
            .masterGetmethod("/getReceipeProdList?ENO=" + (selectedproduct.ENO ? selectedproduct.ENO : 0))
            .subscribe(
                res => {
                    if (res.status == "ok" && res.result != null && res.result.length) {

                        this.productionTarget.ProdList = res.result;

                    }
                },
                () => {
                }
            );

        this.masterService.masterGetmethod_NEW(`/getAltUnitsOfItem/${this.productionTarget.MCODE}`).subscribe((res) => {
            this.productionTarget.alternateUnits = JSON.parse(res.result);
        })
    }
    rowIndex: any;
    RowClick(index) {
        this.activerowIndex = this.rowIndex = index;
    }


    //for saving product
    onSaveClicked() {
        if (this.mode.toUpperCase() == "VIEW") {
            this.alertService.error("Cannot Save in View Mode.");
            return;
        }
        if (!this.productionTarget.MCODE || this.productionTarget.MCODE == '' || this.productionTarget.MCODE == null) {
            this.alertService.error("Please select Production Item.");
            return;
        }



        let confactor = 1;
        let altUnit = this.productionTarget.alternateUnits.filter(x => x.ALTUNIT == this.productionTarget.UNIT)[0];
        if (altUnit != null) {
            confactor = this._trnMainService.nullToZeroConverter(altUnit.CONFACTOR) == 0 ? 1 : altUnit.CONFACTOR;
        }



        this.loadingService.show("Please wait.... Saving your data.");
        const uuidV1 = require('uuid/v1');
        let saveData = {
            CONFACTOR: confactor,
            ENO: this.productionTarget.ENO,
            UNIT: this.productionTarget.UNIT,
            GUID: uuidV1(),
            DESCA: this.productionTarget.DESCA,
            MCODE: this.productionTarget.MCODE,
            QTY: this.productionTarget.QTY,
            ProdList: this.productionTarget.ProdList
        };





        this.masterRepo.masterPostmethod('/savereceipeestimate', {
            mode: "add",
            data: saveData
        }).subscribe(res => {
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



    onKitConfitQuantityChange() {



        let altunit = this.productionTarget.alternateUnits.filter(x => x.ALTUNIT == this.productionTarget.UNIT)[0];


        let confactor = 1;
        if (altunit) {
            confactor = this._trnMainService.nullToZeroConverter(altunit.CONFACTOR) == 0 ? 1 : altunit.CONFACTOR;
        }


        if (this.mode.toUpperCase() == "NEW") {
            this.productionTarget.ProdList.forEach(x => {
                x.ReqQty = this._trnMainService.nullToZeroConverter(x.QTY) * this._trnMainService.nullToZeroConverter(this.productionTarget.QTY) * this._trnMainService.nullToZeroConverter(confactor) / this._trnMainService.nullToZeroConverter(x.Factor);
                x.TotAmnt = this._trnMainService.nullToZeroConverter(x.QTY) * this._trnMainService.nullToZeroConverter(x.PRATE) * this._trnMainService.nullToZeroConverter(confactor) / this._trnMainService.nullToZeroConverter(x.Factor);
                x.AvailableStock = this._trnMainService.nullToZeroConverter(x.STOCK) - this._trnMainService.nullToZeroConverter(x.ReqQty);
            })
        }
    }


    onReset() {
        this._trnMainService.initialFormLoad(VoucherTypeEnum.ReceipeEstimate);
        this.productionTarget = <ReceipeMain>{}
        this.productionTarget.ProdList = [];
        this.productionTarget.TRNDATE = this._trnMainService.TrnMainObj.TRNDATE;
        this.productionTarget.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
        let p = <ReceipeProd>{};
        this.productionTarget.ProdList.push(p);
        this.mode = "NEW";

        setTimeout(() => {
            this.masterService.focusAnyControl("menuCode" + this.activerowIndex);
        }, 100);
    }

    dblClickview(event) {




        this.loadingService.show("Please wait while loading data.")
        this.masterService.masterGetmethod_NEW("/receipeestimatedetail?vchrno=" + event.VCHRNO).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.productionTarget = res.result;
                this.mode = "VIEW";
                this.masterService.masterGetmethod_NEW(`/getAltUnitsOfItem/${this.productionTarget.MCODE}`).subscribe((res) => {
                    this.productionTarget.alternateUnits = JSON.parse(res.result);
                })
            } else {
                this.loadingService.hide();
                this.alertService.error(res.result);
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error._body);
        })

    }

    onViewClicked() {
        this.genericGridview.show("", false, "receipeestimateforview");
    }


    onPrintClicked() {
        if (this.mode.toUpperCase() != "VIEW") {
            return;

        }



        let body = `<table id="invoiceTable" style='width: 100%;font-size:10px;table-layout: fixed;border-collapse: collapse;border:1px solid black'>
                                <col style="width:70px">
                                <col style="width:70px">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 40px;">
                                <col style="width: 70px;">
                                <thead>
                                    <tr>
                                            <td colspan='2'>
                                                <img src="assets/img/patanjali.png" alt="" style="height: 25px;">
                                            </td>
                                            <td colspan='6' style='text-align:center;'>
                                                <b>${this.companyProfile.NAME}</b><br>
                                                <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                                                <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                                                <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                                                ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                                            </td>
                                            <td colspan='2' style='border-right:1px solid black;'>&nbsp;</td>
                                    </tr>


                                    <tr>

                                        <td colspan=2>Target No:${this.productionTarget.VCHRNO}</td>
                                        <td colspan=2>TRNDATE :${this.productionTarget.TRNDATE.toString().substring(0, 10)}</td>
                                        <td colspan=6 style='border-right:1px solid black;'>&nbsp;</td>

                                    </tr>
                                    <tr>

                                        <td colspan=2>BOM CODE:${this.productionTarget.MCODE}</td>
                                        <td colspan=5>BOM NAME :${this.productionTarget.DESCA}</td>
                                        <td colspan='2'>Target QTY :${this.productionTarget.QTY}</td>
                                        <td style='border-right:1px solid black;'>Unit :${this.productionTarget.UNIT}</td>

                                    </tr>


                                    <tr>

                                        <th style='border:1px solid black; text-align:left;'>Sno</th>
                                        <th style='border:1px solid black;text-align:left;' > Code</th>
                                        <th style='border:1px solid black;text-align:left;' colspan='3'>Description</th>
                                        <th style='border:1px solid black;text-align:left;'>Unit</th>
                                        <th style='border:1px solid black;text-align:right;'>Base Qty</th>
                                        <th style='border:1px solid black; text-align:right;'>Req Qty</th>
                                        <th style='border:1px solid black;text-align:right;'> Stock</th>
                                        <th style='border:1px solid black;border-right:1px solid black; text-align:right;'> Avail Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `



        let bodyrow = ''
        this.productionTarget.ProdList.forEach((x, index) => {

            bodyrow = bodyrow + `

                            <tr>
                                <td style='border-right:1px solid black;text-align:left;'>${index + 1}</td>
                                <td style='border-right:1px solid black;text-align:left;'>${x.RMCODE}</td>
                                <td style='border-right:1px solid black;text-align:left;' colspan='3'>${x.DESCA}</td>
                                <td style='border-right:1px solid black;text-align:left;'>${x.UNIT}</td>
                                <td style='border-right:1px solid black;text-align:right;'>${x.QTY}</td>
                                <td style='border-right:1px solid black;text-align:right;'>${x.ReqQty}</td>
                                <td style='border-right:1px solid black;text-align:right;'>${x.STOCK}</td>
                                <td style='border-right:1px solid black;text-align:right;'>${x.AvailableStock}</td>
                            </tr>
                        
                                        `
        })
        body = body + bodyrow + ` </tbody></table>`

        

        let popupWin;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.write(`
                                <html>
                                    <head>
                                    <title>Production Target of ${this.productionTarget.DESCA}</title>
                                    <style>

                                        @media print {
                                            .pagebreak { page-break-after: always; }
                                        }
                                    </style>
                                    </head>
                                    <body onload="window.print();window.close()">

                                    ${body}
                                    </body>
                                </html>`
        );
        popupWin.document.close();
    }


}
export interface ReceipeProd {
    STOCK: number;
    AvailableStock: number;
    Factor: number;
    TotAmnt: number;
    ReqQty: number;
    EXPDATE: Date | string;
    MFGDATE: Date | string;
    RMCODE: string;
    DESCA: string;
    QTY: number;
    UNIT: number;
    BATCH: string;
    PRATE: number;
}
export interface ReceipeMain {
    ENO: number;
    VCHRNO: string;
    MCODE: string;
    DESCA: string;
    QTY: string;
    ProdList: ReceipeProd[];
    TRNDATE: Date | string;
    UNIT: string;
    alternateUnits: any[];

}